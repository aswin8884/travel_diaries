from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings # 🔥 Added this import!
from django.db.models.signals import post_save
from django.dispatch import receiver

# ==========================================
# 1. CUSTOM USER MODEL
# ==========================================
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.email} ({self.role})"
    
# ==========================================
# 2. PROFILE MODEL
# ==========================================
class Profile(models.Model):
    # 🔥 FIXED: Pointing to settings.AUTH_USER_MODEL instead of default User
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.email}"

# ==========================================
# 3. AUTOMATION SIGNALS
# ==========================================
# 🔥 FIXED: Sender is now settings.AUTH_USER_MODEL
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# 🔥 FIXED: Sender is now settings.AUTH_USER_MODEL
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    # Using try/except prevents crashes if a user was created BEFORE this profile model existed
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)