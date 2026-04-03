from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import (
    DestinationViewSet,
    HotelViewSet,
    RestaurantViewSet,
    CommunityPostViewSet,
    AppFeedbackViewSet,
    NotificationViewSet,
)

# 1. Create the router
router = SimpleRouter()

# 2. Register all your endpoints
router.register(r'destinations', DestinationViewSet, basename='destinations')
router.register(r'hotels', HotelViewSet)
router.register(r'restaurants', RestaurantViewSet)
router.register(r'community', CommunityPostViewSet, basename='community')
router.register(r'feedback', AppFeedbackViewSet, basename='feedback')
router.register(r'notifications', NotificationViewSet, basename='notifications')

# 3. Add them to urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]