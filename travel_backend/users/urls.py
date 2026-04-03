from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, UserListView, current_user_profile, delete_user

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('all/', UserListView.as_view(), name='all_users'),
    path('me/', current_user_profile, name='current_user_profile'),
    path('<int:user_id>/delete/', delete_user, name='delete_user'),
]