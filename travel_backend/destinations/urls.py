from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    DestinationViewSet,
    HotelViewSet,
    RestaurantViewSet,
    CommunityPostViewSet,
    AppFeedbackViewSet
)

# 1. Create the router
router = DefaultRouter()

# 2. Register all your endpoints
router.register(r'destinations', DestinationViewSet)
router.register(r'hotels', HotelViewSet)
router.register(r'restaurants', RestaurantViewSet)
router.register(r'community', CommunityPostViewSet, basename='community')
router.register(r'feedback', AppFeedbackViewSet, basename='feedback')

# 3. Add them to urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]