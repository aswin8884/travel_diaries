from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import (
    Destination, DestinationImage,
    Hotel, HotelImage,
    Restaurant, RestaurantImage,
    CommunityPost, PostImage, Comment, Like,AppFeedback
)

from .serializers import (
    DestinationSerializer,
    HotelSerializer,
    RestaurantSerializer,
    CommunityPostSerializer,AppFeedbackSerializer
)


# -------------------- DESTINATION --------------------
class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        destination = serializer.save()

        gallery_images = request.FILES.getlist('gallery')
        for image in gallery_images:
            DestinationImage.objects.create(destination=destination, image=image)

        result_serializer = self.get_serializer(destination)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        destination = self.get_object()

        gallery_images = request.FILES.getlist('gallery')
        if gallery_images:
            destination.gallery.all().delete()

            for image in gallery_images:
                DestinationImage.objects.create(destination=destination, image=image)

            result_serializer = self.get_serializer(destination)
            return Response(result_serializer.data)

        return response


# -------------------- HOTEL --------------------
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hotel = serializer.save()

        gallery_images = request.FILES.getlist('gallery')
        for image in gallery_images:
            HotelImage.objects.create(hotel=hotel, image=image)

        result_serializer = self.get_serializer(hotel)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        hotel = self.get_object()

        gallery_images = request.FILES.getlist('gallery')
        if gallery_images:
            hotel.gallery.all().delete()

            for image in gallery_images:
                HotelImage.objects.create(hotel=hotel, image=image)

            result_serializer = self.get_serializer(hotel)
            return Response(result_serializer.data)

        return response


# -------------------- RESTAURANT --------------------
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        restaurant = serializer.save()

        gallery_images = request.FILES.getlist('gallery')
        for image in gallery_images:
            RestaurantImage.objects.create(restaurant=restaurant, image=image)

        result_serializer = self.get_serializer(restaurant)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        restaurant = self.get_object()

        gallery_images = request.FILES.getlist('gallery')
        if gallery_images:
            restaurant.gallery.all().delete()

            for image in gallery_images:
                RestaurantImage.objects.create(restaurant=restaurant, image=image)

            result_serializer = self.get_serializer(restaurant)
            return Response(result_serializer.data)

        return response


# -------------------- COMMUNITY POSTS --------------------
class CommunityPostViewSet(viewsets.ModelViewSet):
    queryset = CommunityPost.objects.all().order_by('-created_at')
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        post = CommunityPost.objects.create(
            author=request.user,
            text=request.data.get('text', '')
        )

        images = request.FILES.getlist('images')
        for img in images:
            PostImage.objects.create(post=post, image=img)

        return Response(self.get_serializer(post).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)

        if not created:
            like.delete()

        return Response(self.get_serializer(post).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def add_comment(self, request, pk=None):
        post = self.get_object()
        text = request.data.get('text')

        if text:
            Comment.objects.create(post=post, author=request.user, text=text)

        return Response(self.get_serializer(post).data)
    
class AppFeedbackViewSet(viewsets.ModelViewSet):
    queryset = AppFeedback.objects.all().order_by('-created_at')
    serializer_class = AppFeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        # Enforce max 50 words on the backend just to be safe
        text = request.data.get('text', '')
        if len(text.split()) > 50:
            return Response({"error": "Feedback must be 50 words or less."}, status=status.HTTP_400_BAD_REQUEST)
            
        feedback = AppFeedback.objects.create(
            user=request.user,
            rating=request.data.get('rating', 5),
            text=text
        )
        return Response(self.get_serializer(feedback).data, status=status.HTTP_201_CREATED)