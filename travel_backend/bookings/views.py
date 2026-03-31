from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import HotelBooking, RestaurantBooking
from .serializers import HotelBookingSerializer, RestaurantBookingSerializer


class IsAdminRole(BasePermission):
    """Allow access to users with role='admin' or is_staff=True."""
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or getattr(request.user, 'role', '') == 'admin')
        )


class HotelBookingViewSet(viewsets.ModelViewSet):
    serializer_class = HotelBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HotelBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RestaurantBookingViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RestaurantBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# --- ADMIN VIEWS: See ALL bookings ---
@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_all_bookings(request):
    """Admin endpoint to fetch all hotel and restaurant bookings."""
    hotel_bookings = HotelBooking.objects.all().order_by('-created_at')
    restaurant_bookings = RestaurantBooking.objects.all().order_by('-created_at')

    hotel_data = HotelBookingSerializer(hotel_bookings, many=True).data
    restaurant_data = RestaurantBookingSerializer(restaurant_bookings, many=True).data

    # Add a 'type' field to distinguish bookings in the frontend
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
