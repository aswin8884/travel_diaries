from django.contrib import admin
from .models import (
    Destination, DestinationImage,
    Hotel, HotelImage,
    Restaurant, RestaurantImage,
    CommunityPost, PostImage, Comment, Like,
    AppFeedback
)

admin.site.register(Destination)
admin.site.register(DestinationImage)
admin.site.register(Hotel)
admin.site.register(HotelImage)
admin.site.register(Restaurant)
admin.site.register(RestaurantImage)
admin.site.register(CommunityPost)
admin.site.register(PostImage)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(AppFeedback)
