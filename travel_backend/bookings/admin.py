from django.contrib import admin
from .models import HotelBooking, RestaurantBooking

# This registers your new models so you can see them in the Django Admin panel
admin.site.register(HotelBooking)
admin.site.register(RestaurantBooking)