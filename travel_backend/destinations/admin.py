from django.contrib import admin
from .models import (
    Destination, DestinationImage,
    Hotel, HotelImage,
    Restaurant, RestaurantImage,
    CommunityPost, PostImage, Comment, Like,
    AppFeedback, Notification,
)


class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 3


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 3


class RestaurantImageInline(admin.TabularInline):
    model = RestaurantImage
    extra = 3


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    inlines = [DestinationImageInline]
    list_display = ['name', 'is_featured']
    list_filter = ['is_featured']
    search_fields = ['name']


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    inlines = [HotelImageInline]
    list_display = ['name', 'destination', 'price_per_night', 'rating', 'total_rooms']
    list_filter = ['destination']
    search_fields = ['name']


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    inlines = [RestaurantImageInline]
    list_display = ['name', 'destination', 'rating', 'opening_time', 'closing_time']
    list_filter = ['destination']
    search_fields = ['name']


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline]
    list_display = ['author', 'destination', 'user_rating', 'created_at']


admin.site.register(DestinationImage)
admin.site.register(HotelImage)
admin.site.register(RestaurantImage)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(AppFeedback)
admin.site.register(Notification)
