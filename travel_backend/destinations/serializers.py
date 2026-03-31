from rest_framework import serializers
from .models import (
    Destination, DestinationImage, Hotel, HotelImage, 
    Restaurant, RestaurantImage, CommunityPost, PostImage, 
    Comment, Like, AppFeedback
)

# --- DESTINATION SERIALIZERS ---
class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = '__all__'  

# --- HOTEL SERIALIZERS ---
class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = '__all__'

class HotelSerializer(serializers.ModelSerializer):
    # 🔥 THE FIX: source='images' tells Django to grab the related_name from models.py, 
    # but we name the variable 'gallery_images' so React gets exactly what it expects!
    gallery_images = HotelImageSerializer(source='images', many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'


# --- RESTAURANT SERIALIZERS ---
class RestaurantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantImage
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    # 🔥 THE FIX: Same trick here for restaurants!
    gallery_images = RestaurantImageSerializer(source='images', many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = '__all__'

# --- COMMUNITY SERIALIZERS ---
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
        if obj.user.first_name or obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return obj.user.username or obj.user.email

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
        fields = ['id', 'author', 'text', 'created_at', 'images', 'comments',
                  'likes', 'author_name', 'author_initial', 'is_liked_by_me', 'likes_count']

    def get_author_name(self, obj):
        if obj.author.first_name or obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}".strip()
        return obj.author.username or obj.author.email

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

# --- FEEDBACK SERIALIZER ---
class AppFeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()
    text = serializers.CharField(source='comment', read_only=True)

    class Meta:
        model = AppFeedback
        fields = ['id', 'user', 'rating', 'comment', 'text', 'created_at', 'author_name', 'author_initial']

    def get_author_name(self, obj):
        if obj.user:
            if obj.user.first_name or obj.user.last_name:
                return f"{obj.user.first_name} {obj.user.last_name}".strip()
            return obj.user.username or obj.user.email
        return 'Anonymous'

    def get_author_initial(self, obj):
        name = self.get_author_name(obj)
        return name[0].upper() if name else '?'