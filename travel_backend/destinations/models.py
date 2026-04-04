from django.db import models
from django.conf import settings


# ---------------------------------------------------------------------------
# Destination
# ---------------------------------------------------------------------------

class Destination(models.Model):
    name = models.CharField(max_length=200)
    short_description = models.CharField(max_length=255, default='Short description here')
    long_description = models.TextField(default='Detailed description here')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    image = models.ImageField(upload_to='destinations/')
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class DestinationImage(models.Model):
    """Additional gallery images for a destination."""
    destination = models.ForeignKey(Destination, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='destinations/gallery/')


# ---------------------------------------------------------------------------
# Hotel
# ---------------------------------------------------------------------------

class Hotel(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='hotels/')
    rating = models.FloatField(default=0.0)
    total_rooms = models.IntegerField(default=10)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name


class HotelImage(models.Model):
    """Additional gallery images for a hotel."""
    hotel = models.ForeignKey(Hotel, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='hotels/gallery/')


# ---------------------------------------------------------------------------
# Restaurant
# ---------------------------------------------------------------------------

class Restaurant(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='restaurants/')
    opening_time = models.TimeField(default='09:00:00')
    closing_time = models.TimeField(default='22:00:00')
    max_guests_per_slot = models.IntegerField(default=50)
    average_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    rating = models.FloatField(default=0.0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name


class RestaurantImage(models.Model):
    """Additional gallery images for a restaurant."""
    restaurant = models.ForeignKey(Restaurant, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='restaurants/gallery/')


# ---------------------------------------------------------------------------
# Destination Likes
# ---------------------------------------------------------------------------

class DestinationLike(models.Model):
    """Records a single user's like on a destination. One like per user per destination."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'destination')

    def __str__(self):
        return f"{self.user.email} likes {self.destination.name}"


# ---------------------------------------------------------------------------
# Community
# ---------------------------------------------------------------------------

class CommunityPost(models.Model):
    """
    A user-created post in the community feed.
    Optionally linked to a destination with a 1–5 star rating,
    which feeds into that destination's computed average rating.
    The destination association is hidden from the post display
    but used for aggregating ratings.
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Optional destination tag — used only for rating aggregation, not shown in feed.
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='community_posts',
    )
    # User's star rating for the linked destination (1–5).
    user_rating = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Post by {self.author.email}"


class PostImage(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='community/posts/')


class Comment(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------

class AppFeedback(models.Model):
    """Platform-level feedback submitted by registered users."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.rating}/5"


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

class Notification(models.Model):
    """
    In-app inbox message delivered to a user after a booking event.
    Created automatically when a booking is confirmed or cancelled.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    booking_reference = models.CharField(max_length=30, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.user.email}] {self.title}"
