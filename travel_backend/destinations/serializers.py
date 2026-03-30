from rest_framework import serializers
from .models import (
    Destination, DestinationImage, 
    Hotel, HotelImage, 
    Restaurant, RestaurantImage,
    CommunityPost, PostImage, Comment, Like,
    AppFeedback
)

# ==========================================
# 1. DESTINATION & GALLERY SERIALIZERS
# ==========================================
class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = ['id', 'image']

# ==========================================
# 2. HOTEL & GALLERY SERIALIZERS
# ==========================================
class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ['id', 'image']

class HotelSerializer(serializers.ModelSerializer):
    gallery = HotelImageSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = ['id', 'destination', 'name', 'description', 'price_per_night', 'rating', 'image', 'gallery']

# ==========================================
# 3. RESTAURANT & GALLERY SERIALIZERS
# ==========================================
class RestaurantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantImage
        fields = ['id', 'image']

class RestaurantSerializer(serializers.ModelSerializer):
    gallery = RestaurantImageSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'destination', 'name', 'description', 'price', 'rating', 'image', 'gallery']

# --- Main Destination Serializer (Uses Hotel & Restaurant) ---
class DestinationSerializer(serializers.ModelSerializer):
    hotels = HotelSerializer(many=True, read_only=True)
    restaurants = RestaurantSerializer(many=True, read_only=True)
    gallery = DestinationImageSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'short_description', 'description', 
            'image', 'latitude', 'longitude', 
            'hotels', 'restaurants', 'gallery'
        ]

# ==========================================
# 4. COMMUNITY (POSTS, IMAGES, COMMENTS, LIKES)
# ==========================================
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'text', 'author_name', 'author_initial', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else "?"

class CommunityPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()
    images = PostImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author_name', 'author_initial', 'text', 
            'images', 'comments', 'likes_count', 'is_liked_by_me', 'created_at'
        ]

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else "?"

    def get_likes_count(self, obj):
        # Uses the 'related_name' defined in your Like model
        return obj.likes.count()

    def get_is_liked_by_me(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

# ==========================================
# 5. APP FEEDBACK (SCROLLING BANNER)
# ==========================================
class AppFeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()

    class Meta:
        model = AppFeedback
        fields = ['id', 'author_name', 'author_initial', 'rating', 'text', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else "?"