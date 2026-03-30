from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Destination(models.Model):
    name = models.CharField(max_length=200)
    # NEW: A short description for the preview cards (max 150 characters)
    short_description = models.CharField(max_length=150, blank=True, null=True) 
    # The long description for the expanded modal
    description = models.TextField() 
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    
    # The main "Hero" image
    image = models.ImageField(upload_to='destinations/') 
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

# NEW: The Gallery Model! 
# This allows 1 destination to have infinite gallery images.
class DestinationImage(models.Model):
    # The Foreign Key links this image directly back to the Destination above
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='destinations/gallery/')
    
    def __str__(self):
        return f"Gallery Photo for {self.destination.name}"

# (Keep your existing Hotel and Restaurant models down here...)
class Hotel(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='hotels/')
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.name
    
class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='destinations/hotels/gallery/')

class Restaurant(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='restaurants/')
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.name
    
class RestaurantImage(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='destinations/restaurants/gallery/')

# ==========================================
# COMMUNITY MODELS
# ==========================================
class CommunityPost(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.first_name or self.author.username}"

class PostImage(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='community/')

class Comment(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class AppFeedback(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = models.TextField(max_length=300) # 300 chars is roughly 50 words
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.username}"