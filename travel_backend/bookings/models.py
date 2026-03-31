from django.db import models
from django.conf import settings
import uuid

# --- HOTEL BOOKINGS ---
class HotelBooking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hotel_bookings')
    hotel = models.ForeignKey('destinations.Hotel', on_delete=models.CASCADE) 
    
    # Guest Details
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)
    
    # Booking Details
    check_in = models.DateField()
    check_out = models.DateField()
    rooms = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    booking_reference = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"HTL-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} - {self.guest_name} (Hotel)"


# --- RESTAURANT BOOKINGS ---
class RestaurantBooking(models.Model):
    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurant_bookings')
    restaurant = models.ForeignKey('destinations.Restaurant', on_delete=models.CASCADE) # Ensure 'Restaurant' matches your actual model name
    
    # Guest Details
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)
    
    # Reservation Details
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    number_of_guests = models.IntegerField(default=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2) # Estimated cost
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    booking_reference = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"RES-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} - {self.guest_name} (Restaurant)"