from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from .models import (
    Destination, DestinationImage, DestinationLike,
    Hotel, HotelImage,
    Restaurant, RestaurantImage,
    CommunityPost, PostImage, Comment, Like, AppFeedback,
    Notification,
)
from .serializers import (
    DestinationSerializer,
    HotelSerializer,
    RestaurantSerializer,
    CommunityPostSerializer,
    AppFeedbackSerializer,
    NotificationSerializer,
)


class DestinationViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for travel destinations.
    Gallery images are sent as a multipart list under the key 'gallery_images'.
    Destinations are returned ordered by like count descending so the most-loved
    destinations appear first in the discovery feed.
    """
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        from django.db.models import Count
        return Destination.objects.annotate(
            like_count=Count('likes')
        ).order_by('-like_count', 'name')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_like(self, request, pk=None):
        """Toggle the authenticated user's like on a destination. Returns updated destination data."""
        destination = self.get_object()
        like, created = DestinationLike.objects.get_or_create(user=request.user, destination=destination)
        if not created:
            like.delete()
        return Response(self.get_serializer(destination).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        destination = serializer.save()

        for image in request.FILES.getlist('gallery_images'):
            DestinationImage.objects.create(destination=destination, image=image)

        return Response(self.get_serializer(destination).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        destination = self.get_object()
        gallery_images = request.FILES.getlist('gallery_images')

        if gallery_images:
            destination.images.all().delete()
            for image in gallery_images:
                DestinationImage.objects.create(destination=destination, image=image)
            return Response(self.get_serializer(destination).data)

        return response


class HotelViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for hotels.
    Gallery images are sent as a multipart list under the key 'gallery_images'.
    """
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hotel = serializer.save()

        for image in request.FILES.getlist('gallery_images'):
            HotelImage.objects.create(hotel=hotel, image=image)

        return Response(self.get_serializer(hotel).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        hotel = self.get_object()
        gallery_images = request.FILES.getlist('gallery_images')

        if gallery_images:
            hotel.images.all().delete()
            for image in gallery_images:
                HotelImage.objects.create(hotel=hotel, image=image)
            return Response(self.get_serializer(hotel).data)

        return response


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for restaurants.
    Gallery images are sent as a multipart list under the key 'gallery_images'.
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        restaurant = serializer.save()

        for image in request.FILES.getlist('gallery_images'):
            RestaurantImage.objects.create(restaurant=restaurant, image=image)

        return Response(self.get_serializer(restaurant).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        restaurant = self.get_object()
        gallery_images = request.FILES.getlist('gallery_images')

        if gallery_images:
            restaurant.images.all().delete()
            for image in gallery_images:
                RestaurantImage.objects.create(restaurant=restaurant, image=image)
            return Response(self.get_serializer(restaurant).data)

        return response


class CommunityPostViewSet(viewsets.ModelViewSet):
    """
    Community posts feed. Supports creating posts with images,
    toggling likes, and adding comments.
    Posts optionally carry a destination reference and star rating
    that feed into destination-level average ratings.
    Posts are returned in reverse-chronological order.
    """
    queryset = CommunityPost.objects.all().order_by('-created_at')
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        destination_id = request.data.get('destination_id') or None
        user_rating = request.data.get('user_rating') or None

        destination = None
        if destination_id:
            try:
                destination = Destination.objects.get(pk=destination_id)
            except Destination.DoesNotExist:
                pass

        post = CommunityPost.objects.create(
            author=request.user,
            text=request.data.get('text', ''),
            destination=destination,
            user_rating=float(user_rating) if user_rating else None,
        )
        for img in request.FILES.getlist('images'):
            PostImage.objects.create(post=post, image=img)

        return Response(self.get_serializer(post).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def toggle_like(self, request, pk=None):
        """Toggle the authenticated user's like on a post."""
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
        return Response(self.get_serializer(post).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def add_comment(self, request, pk=None):
        """Append a comment to a post."""
        post = self.get_object()
        text = request.data.get('text')
        if text:
            Comment.objects.create(post=post, user=request.user, text=text)
        return Response(self.get_serializer(post).data)


class AppFeedbackViewSet(viewsets.ModelViewSet):
    """
    User feedback for the platform (ratings + short comments).
    Only authenticated users can submit or view feedback.
    Feedback is capped at 50 words per submission.
    """
    serializer_class = AppFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AppFeedback.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        text = request.data.get('text', '')
        if len(text.split()) > 50:
            return Response(
                {'error': 'Feedback must be 50 words or less.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        feedback = AppFeedback.objects.create(
            user=request.user,
            rating=request.data.get('rating', 5),
            comment=text,
        )
        return Response(self.get_serializer(feedback).data, status=status.HTTP_201_CREATED)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for a user's inbox notifications.
    Supports marking individual notifications as read via a custom action.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all of the authenticated user's notifications as read."""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked read'})
