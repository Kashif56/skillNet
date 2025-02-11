from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
   
    phone = models.CharField(max_length=20, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='banner_images/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField('core.Skill', related_name='users')
    rating = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username + ' - Profile'

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'