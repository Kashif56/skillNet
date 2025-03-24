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

    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    swaps = models.IntegerField(default=0)
    
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

    requestor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='swap_requests_sent')
    responder = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='swap_requests_received')
    gig = models.ForeignKey('gigs.Gig', on_delete=models.CASCADE, related_name='swap_requests')
    message = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')


    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Swap request from {self.requestor.user.username} to {self.responder.user.username}"
    

    def generateSwapId(self):
        intital = f"swap-{self.gig.gigId}"
        for i in range(5):
            intital += str(random.randint(0, 9))

        return intital
    

    def save(self, *args, **kwargs):
        if not self.swapId:
            self.swapId = self.generateSwapId()

        return super().save(*args, **kwargs)


class SwapDelivery(models.Model):
    """
    Model to track deliverables for both users in a swap request.
    Each user (requestor and responder) can upload files and mark their delivery as complete.
    The swap is considered complete when both users have marked their deliveries as complete.
    """
    DELIVERY_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
        ('accepted', 'Accepted'),
    )
    
    swap_request = models.OneToOneField(SwapRequest, on_delete=models.CASCADE, related_name='delivery')
    delivery_id = models.CharField(max_length=200, unique=True, null=True, blank=True)
    
    # Requestor delivery fields
    requestor_file = models.FileField(upload_to='swap_deliveries/requestor/', blank=True, null=True)
    requestor_comment = models.TextField(blank=True, null=True)
    requestor_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='pending')
    requestor_delivered_at = models.DateTimeField(blank=True, null=True)
    requestor_accepted_at = models.DateTimeField(blank=True, null=True)
    
    # Responder delivery fields
    responder_file = models.FileField(upload_to='swap_deliveries/responder/', blank=True, null=True)
    responder_comment = models.TextField(blank=True, null=True)
    responder_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='pending')
    responder_delivered_at = models.DateTimeField(blank=True, null=True)
    responder_accepted_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery for {self.swap_request.swapId}"
    
    def generate_delivery_id(self):
        initial = f"delivery-{self.swap_request.swapId}-"
        for i in range(5):
            initial += str(random.randint(0, 9))
        return initial
    
    def save(self, *args, **kwargs):
        if not self.delivery_id:
            self.delivery_id = self.generate_delivery_id()
        
        # Check if both requestor and responder have accepted deliveries and update swap status
        if self.requestor_status == 'accepted' and self.responder_status == 'accepted':
            self.swap_request.status = 'completed'
            self.swap_request.save()
            
        return super().save(*args, **kwargs)


class DeliveryComment(models.Model):
    """
    Model for comments related to swap deliveries.
    Used for communication between users about their deliverables.
    """
    delivery = models.ForeignKey(SwapDelivery, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    message = models.TextField()
    file_attachment = models.FileField(upload_to='swap_comments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.user.username} on {self.created_at}"