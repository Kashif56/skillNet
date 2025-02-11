from django.db import models
from django.contrib.auth.models import User
from userProfile.models import UserProfile

import random

class Gig(models.Model):
    MODE_CHOICES = (
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('both', 'Both'),
    )
    gigId = models.CharField(max_length=200, unique=True, null=True, blank=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    gigImage = models.ImageField(upload_to='gig_images/', blank=True, null=True)
   
    offeredSkills = models.CharField(max_length=200,null=True, blank=True)
    desiredSkills = models.CharField(max_length=200, null=True, blank=True)

    tags = models.JSONField(blank=True, null=True)
    
    
    isActive = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-createdAt']


    def generateGigId(self):
        intital = f"gig-"
        for i in range(5):
            intital += str(random.randint(0, 9))

        return intital

    def save(self, *args, **kwargs):
        if not self.gigId:
            self.gigId = self.generateGigId()

        return super().save(*args, **kwargs)


class SwapRequest(models.Model):
    swapId = models.CharField(max_length=200, unique=True, null=True, blank=True)
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    requestor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swap_requests_sent')
    responder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swap_requests_received')
    gig = models.ForeignKey('gigs.Gig', on_delete=models.CASCADE, related_name='swap_requests')
    message = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')


    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Swap request from {self.requestor.username} to {self.responder.username}"
    

    def generateSwapId(self):
        intital = f"swap-{self.gig.gigId}"
        for i in range(5):
            intital += str(random.randint(0, 9))

        return intital
    

    def save(self, *args, **kwargs):
        if not self.swapId:
            self.swapId = self.generateSwapId()

        return super().save(*args, **kwargs)