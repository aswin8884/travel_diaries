import uuid
from django.db import models
from django.conf import settings


class HotelBooking(models.Model):
    """Records a guest's hotel room reservation."""

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='hotel_bookings',
    )
    hotel = models.ForeignKey('destinations.Hotel', on_delete=models.CASCADE)

    # Guest contact details captured at checkout
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)

    # Booking specifics
    check_in = models.DateField()
    check_out = models.DateField()
    rooms = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    # 50 % of total_price collected upfront; remaining due at hotel check-in.
    advance_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Lifecycle tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    booking_reference = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"HTL-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} — {self.guest_name} (Hotel)"


class RestaurantBooking(models.Model):
    """Records a guest's restaurant table reservation."""

    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='restaurant_bookings',
    )
    restaurant = models.ForeignKey('destinations.Restaurant', on_delete=models.CASCADE)

    # Guest contact details
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)

    # Reservation specifics
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    number_of_guests = models.IntegerField(default=2)
    # total_price is always 0 for restaurant reservations (reservation-only model)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)

    # Lifecycle tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    booking_reference = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"RES-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} — {self.guest_name} (Restaurant)"
