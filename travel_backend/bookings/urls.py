from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import HotelBookingViewSet, RestaurantBookingViewSet, admin_all_bookings

router = SimpleRouter()
router.register(r'hotel-bookings', HotelBookingViewSet, basename='hotel-booking')
router.register(r'restaurant-bookings', RestaurantBookingViewSet, basename='restaurant-booking')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/bookings/', admin_all_bookings, name='admin-all-bookings'),
]
