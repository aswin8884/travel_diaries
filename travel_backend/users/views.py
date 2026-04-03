from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import status as http_status

from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserListSerializer
from users.models import Profile

User = get_user_model()


class IsAdminRole(BasePermission):
    """Grants access only to users whose role is 'admin' or who have is_staff=True."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or getattr(request.user, 'role', '') == 'admin')
        )


class RegisterView(generics.CreateAPIView):
    """Public endpoint for new user registration."""
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """JWT login endpoint that embeds 'role' and other custom claims in the token."""
    serializer_class = CustomTokenObtainPairSerializer


class UserListView(generics.ListAPIView):
    """List all registered users. Restricted to admin accounts."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer
    permission_classes = [IsAdminRole]


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user_profile(request):
    """
    GET  — Return the authenticated user's profile data.
    PATCH — Update editable fields (first_name, last_name, phone_number, address).
            Email is intentionally excluded from updates.
    """
    user = request.user

    # Ensure a profile record exists; create one defensively if missing.
    try:
        profile = user.profile
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=user)

    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': profile.phone_number,
            'address': profile.address,
        })

    # PATCH
    data = request.data
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.save()

    profile.phone_number = data.get('phone_number', profile.phone_number)
    profile.address = data.get('address', profile.address)
    profile.save()

    return Response({'message': 'Profile updated successfully.'})


@api_view(['DELETE'])
@permission_classes([IsAdminRole])
def delete_user(request, user_id):
    """
    Admin-only endpoint to permanently delete a user account.
    The requesting admin cannot delete their own account.
    """
    if request.user.id == user_id:
        return Response({'error': 'You cannot delete your own account.'}, status=http_status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=http_status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response(status=http_status.HTTP_204_NO_CONTENT)
