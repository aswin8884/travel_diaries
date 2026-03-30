from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, UserListView ,current_user_profile

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('all/', UserListView.as_view(), name='all_users'),
    path('api/users/me/', current_user_profile, name='current_user_profile')
]