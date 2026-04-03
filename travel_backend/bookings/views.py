import re
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from django.core.mail import send_mail
from django.conf import settings

from .models import HotelBooking, RestaurantBooking
from .serializers import HotelBookingSerializer, RestaurantBookingSerializer


def _slugify_name(name):
    """Convert a venue name to a lowercase email-safe slug (e.g. 'Rambagh Palace' → 'rambagh-palace')."""
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


def _venue_email(name):
    """Generate a deterministic fake contact email for a hotel or restaurant."""
    return f"info@{_slugify_name(name)}.traveldairies.com"


def _create_notification(user, title, message, booking_ref=None):
    """Helper to persist an in-app notification for a user."""
    from destinations.models import Notification
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        booking_reference=booking_ref,
    )


def _send_booking_email(guest_email, subject, body):
    """
    Send a confirmation/cancellation email to the guest.
    In development this prints to the console (EMAIL_BACKEND = console).
    """
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@traveldairies.com'),
            recipient_list=[guest_email],
            fail_silently=True,
        )
    except Exception:
        pass


class IsAdminRole(BasePermission):
    """Grants access only to users whose role is 'admin' or who have is_staff=True."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or getattr(request.user, 'role', '') == 'admin')
        )


class HotelBookingViewSet(viewsets.ModelViewSet):
    """
    Hotel booking lifecycle management for authenticated users.
    Enforces room availability at the point of creation to prevent overbooking.
    Collects 50 % of total price as advance; remainder is due at check-in.
    Admin commission is 10 % of the total price (tracked separately in the overview).
    """
    serializer_class = HotelBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HotelBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Validate room availability, compute advance price, persist the booking,
        create an in-app notification, and send a confirmation email to the guest.
        """
        hotel = serializer.validated_data['hotel']
        rooms_requested = serializer.validated_data['rooms']
        total_price = serializer.validated_data['total_price']

        # Overbooking guard: compare requested rooms against currently available rooms.
        booked = HotelBooking.objects.filter(
            hotel=hotel,
            status__in=['Confirmed', 'Pending'],
        ).aggregate(total=Sum('rooms'))['total'] or 0

        available = max(0, hotel.total_rooms - booked)

        if rooms_requested > available:
            if available == 0:
                raise ValidationError("This hotel is fully booked. No rooms are available.")
            raise ValidationError(f"Only {available} room(s) available for this hotel.")

        # 50 % advance collected now; remaining 50 % due at hotel check-in.
        advance_price = round(float(total_price) * 0.5, 2)

        booking = serializer.save(user=self.request.user, advance_price=advance_price)

        # In-app inbox notification for the guest.
        _create_notification(
            user=self.request.user,
            title=f"Booking Confirmed — {hotel.name}",
            message=(
                f"Your booking at {hotel.name} is confirmed.\n"
                f"Reference: {booking.booking_reference}\n"
                f"Check-in: {booking.check_in} | Check-out: {booking.check_out}\n"
                f"Advance paid: ₹{advance_price} | Balance due at check-in: ₹{round(float(total_price) * 0.5, 2)}"
            ),
            booking_ref=booking.booking_reference,
        )

        # Confirmation email from the hotel's generated address to the guest.
        venue_email = _venue_email(hotel.name)
        _send_booking_email(
            guest_email=booking.guest_email,
            subject=f"Booking Confirmed — {hotel.name} [{booking.booking_reference}]",
            body=(
                f"Dear {booking.guest_name},\n\n"
                f"Thank you for choosing {hotel.name}.\n\n"
                f"Booking Reference : {booking.booking_reference}\n"
                f"Check-in          : {booking.check_in}\n"
                f"Check-out         : {booking.check_out}\n"
                f"Rooms             : {booking.rooms}\n"
                f"Advance Paid      : ₹{advance_price}\n"
                f"Balance Due       : ₹{round(float(total_price) * 0.5, 2)} (payable at check-in)\n\n"
                f"For any queries, contact us at {venue_email}\n\n"
                f"Warm regards,\n{hotel.name} Team\n{venue_email}"
            ),
        )

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        """Return all hotel bookings belonging to the authenticated user."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        After a booking status change to Cancelled, notify the guest via
        in-app message and email from the hotel.
        """
        old_status = serializer.instance.status
        booking = serializer.save()
        if old_status != 'Cancelled' and booking.status == 'Cancelled':
            hotel = booking.hotel
            _create_notification(
                user=booking.user,
                title=f"Booking Cancelled — {hotel.name}",
                message=(
                    f"Your booking ({booking.booking_reference}) at {hotel.name} has been cancelled."
                ),
                booking_ref=booking.booking_reference,
            )
            venue_email = _venue_email(hotel.name)
            _send_booking_email(
                guest_email=booking.guest_email,
                subject=f"Booking Cancelled — {hotel.name} [{booking.booking_reference}]",
                body=(
                    f"Dear {booking.guest_name},\n\n"
                    f"Your booking ({booking.booking_reference}) at {hotel.name} has been cancelled.\n\n"
                    f"If this was unexpected, please contact us at {venue_email}.\n\n"
                    f"Regards,\n{hotel.name} Team\n{venue_email}"
                ),
            )


class RestaurantBookingViewSet(viewsets.ModelViewSet):
    """Restaurant reservation management for authenticated users."""
    serializer_class = RestaurantBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RestaurantBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """Persist the reservation and dispatch an in-app notification and confirmation email."""
        booking = serializer.save(user=self.request.user)
        restaurant = booking.restaurant

        _create_notification(
            user=self.request.user,
            title=f"Reservation Confirmed — {restaurant.name}",
            message=(
                f"Your table at {restaurant.name} is reserved.\n"
                f"Reference: {booking.booking_reference}\n"
                f"Date: {booking.reservation_date} at {booking.reservation_time}\n"
                f"Guests: {booking.number_of_guests}"
            ),
            booking_ref=booking.booking_reference,
        )

        venue_email = _venue_email(restaurant.name)
        _send_booking_email(
            guest_email=booking.guest_email,
            subject=f"Table Reserved — {restaurant.name} [{booking.booking_reference}]",
            body=(
                f"Dear {booking.guest_name},\n\n"
                f"Your table at {restaurant.name} has been reserved.\n\n"
                f"Booking Reference : {booking.booking_reference}\n"
                f"Date              : {booking.reservation_date}\n"
                f"Time              : {booking.reservation_time}\n"
                f"Guests            : {booking.number_of_guests}\n\n"
                f"For any queries, contact us at {venue_email}\n\n"
                f"Warm regards,\n{restaurant.name} Team\n{venue_email}"
            ),
        )

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        """Return all restaurant reservations belonging to the authenticated user."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """On cancellation, notify the guest via in-app message and email."""
        old_status = serializer.instance.status
        booking = serializer.save()
        if old_status != 'Cancelled' and booking.status == 'Cancelled':
            restaurant = booking.restaurant
            _create_notification(
                user=booking.user,
                title=f"Reservation Cancelled — {restaurant.name}",
                message=(
                    f"Your reservation ({booking.booking_reference}) at {restaurant.name} has been cancelled."
                ),
                booking_ref=booking.booking_reference,
            )
            venue_email = _venue_email(restaurant.name)
            _send_booking_email(
                guest_email=booking.guest_email,
                subject=f"Reservation Cancelled — {restaurant.name} [{booking.booking_reference}]",
                body=(
                    f"Dear {booking.guest_name},\n\n"
                    f"Your reservation ({booking.booking_reference}) at {restaurant.name} has been cancelled.\n\n"
                    f"If this was unexpected, please contact us at {venue_email}.\n\n"
                    f"Regards,\n{restaurant.name} Team\n{venue_email}"
                ),
            )


@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_all_bookings(request):
    """
    Admin-only endpoint that returns a combined payload of all hotel
    and restaurant bookings, each annotated with a 'type' field for
    easy discrimination on the frontend.
    """
    hotel_bookings = HotelBooking.objects.all().order_by('-created_at')
    restaurant_bookings = RestaurantBooking.objects.all().order_by('-created_at')

    hotel_data = HotelBookingSerializer(hotel_bookings, many=True).data
    restaurant_data = RestaurantBookingSerializer(restaurant_bookings, many=True).data

    for b in hotel_data:
        b['type'] = 'hotel'
    for b in restaurant_data:
        b['type'] = 'restaurant'

    return Response({
        'hotel_bookings': hotel_data,
        'restaurant_bookings': restaurant_data,
        'total_hotel': len(hotel_data),
        'total_restaurant': len(restaurant_data),
    })
