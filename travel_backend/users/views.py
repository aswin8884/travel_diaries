from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser
)
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserListSerializer
)
from users.models import Profile

User = get_user_model()


# 1. Registration Endpoint
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# 2. Login Endpoint (Using our custom token)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# 3. List all users (Admins Only)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]  # Only admins can access


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user_profile(request):
    user = request.user
    
    # Ensure a profile exists defensivly
    try:
        profile = user.profile
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=user)

    # 1. FETCH USER + PROFILE DATA
    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email, # Fetching for read-only display
            'first_name': user.first_name,
            'last_name': user.last_name,
            # 🔥 New profile fields 🔥
            'phone_number': profile.phone_number,
            'address': profile.address,
        })
        
    # 2. UPDATE USER + PROFILE DATA
    elif request.method == 'PATCH':
        data = request.data
        
        # --- Update standard User fields ---
        # Note: user.email is removed here deliberately. It cannot be updated.
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()

        # --- Update Profile fields ---
        profile.phone_number = data.get('phone_number', profile.phone_number)
        profile.address = data.get('address', profile.address)
        profile.save()
        
        return Response({'message': 'Profile updated successfully!'})