from rest_framework import serializers
from django.db.models import Avg

from .models import (
    Destination, DestinationImage, DestinationLike,
    Hotel, HotelImage,
    Restaurant, RestaurantImage,
    CommunityPost, PostImage,
    Comment, Like, AppFeedback,
    Notification,
)


# ---------------------------------------------------------------------------
# Destination
# ---------------------------------------------------------------------------

class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = '__all__'


class DestinationSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = '__all__'

    def get_likes_count(self, obj):
        """Return the total number of user likes for this destination."""
        return obj.likes.count()

    def get_is_liked_by_me(self, obj):
        """Return True if the authenticated request user has liked this destination."""
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


# ---------------------------------------------------------------------------
# Hotel
# ---------------------------------------------------------------------------

class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    gallery_images = HotelImageSerializer(source='images', many=True, read_only=True)
    available_rooms = serializers.SerializerMethodField()
    avg_user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = '__all__'

    def get_available_rooms(self, obj):
        """
        Compute the number of rooms currently available for booking.
        Uses a lazy import to avoid circular dependency with the bookings app.
        """
        from bookings.models import HotelBooking
        from django.db.models import Sum

        booked = HotelBooking.objects.filter(
            hotel=obj,
            status__in=['Confirmed', 'Pending'],
        ).aggregate(total=Sum('rooms'))['total'] or 0

        return max(0, obj.total_rooms - booked)

    def get_avg_user_rating(self, obj):
        """Compute the average rating for this hotel's destination from community posts."""
        result = obj.destination.community_posts.filter(
            user_rating__isnull=False
        ).aggregate(avg=Avg('user_rating'))['avg']
        return round(result, 1) if result else 0.0


# ---------------------------------------------------------------------------
# Restaurant
# ---------------------------------------------------------------------------

class RestaurantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantImage
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    gallery_images = RestaurantImageSerializer(source='images', many=True, read_only=True)
    avg_user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = '__all__'

    def get_avg_user_rating(self, obj):
        """Compute the average rating for this restaurant's destination from community posts."""
        result = obj.destination.community_posts.filter(
            user_rating__isnull=False
        ).aggregate(avg=Avg('user_rating'))['avg']
        return round(result, 1) if result else 0.0


# ---------------------------------------------------------------------------
# Community
# ---------------------------------------------------------------------------

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text', 'created_at', 'author_name', 'author_initial']

    def get_author_name(self, obj):
        if obj.user.first_name:
            return obj.user.first_name
        return obj.user.username or obj.user.email.split('@')[0]

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else '?'


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class CommunityPostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes = LikeSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()
    is_liked_by_me = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author', 'text', 'created_at',
            'destination', 'user_rating',
            'images', 'comments', 'likes',
            'author_name', 'author_initial', 'is_liked_by_me', 'likes_count',
        ]

    def get_author_name(self, obj):
        if obj.author.first_name:
            return obj.author.first_name
        return obj.author.username or obj.author.email.split('@')[0]

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else '?'

    def get_is_liked_by_me(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------

class AppFeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()
    author_profile_picture = serializers.SerializerMethodField()
    # Expose 'comment' field under the alias 'text' for frontend compatibility.
    text = serializers.CharField(source='comment', read_only=True)

    class Meta:
        model = AppFeedback
        fields = [
            'id', 'user', 'rating', 'comment', 'text',
            'created_at', 'author_name', 'author_initial', 'author_profile_picture',
        ]

    def get_author_name(self, obj):
        if obj.user:
            if obj.user.first_name:
                return obj.user.first_name
            return obj.user.username or obj.user.email.split('@')[0]
        return 'Anonymous'

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else '?'

    def get_author_profile_picture(self, obj):
        """Return an absolute URL to the user's profile picture, or None."""
        if not obj.user:
            return None
        try:
            pic = obj.user.profile.profile_picture
            if pic:
                request = self.context.get('request')
                return request.build_absolute_uri(pic.url) if request else pic.url
        except Exception:
            pass
        return None


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'booking_reference', 'is_read', 'created_at']
