from django.db import models
from django.contrib.auth.models import User

from userProfile.models import UserProfile
# Create your models here.

class Thread(models.Model):
    participants = models.ManyToManyField(User, related_name='chat_threads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Chat thread {self.id}"

class Message(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    isRead = models.BooleanField(default=False)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return f"Message from {self.sender.user.username} to {self.receiver.user.username}"

class MessageAttachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='chat_attachments/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
