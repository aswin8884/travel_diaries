from rest_framework import serializers
from .models import HotelBooking, RestaurantBooking

class HotelBookingSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)
    hotel_image = serializers.ImageField(source='hotel.image', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = HotelBooking
        fields = ['id', 'hotel', 'hotel_name', 'hotel_image', 'user_email',
                  'guest_name', 'guest_email', 'guest_phone',
                  'check_in', 'check_out', 'rooms', 'total_price',
                  'status', 'booking_reference', 'created_at']
        read_only_fields = ['booking_reference', 'created_at']

class RestaurantBookingSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    restaurant_image = serializers.ImageField(source='restaurant.image', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = RestaurantBooking
        fields = ['id', 'restaurant', 'restaurant_name', 'restaurant_image', 'user_email',
                  'guest_name', 'guest_email', 'guest_phone',
                  'reservation_date', 'reservation_time', 'number_of_guests', 'total_price',
                  'status', 'booking_reference', 'created_at']
        read_only_fields = ['booking_reference', 'created_at']