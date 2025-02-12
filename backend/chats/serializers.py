from rest_framework import serializers

from .models import Thread, Message, MessageAttachment
from userProfile.serializers import UserProfileSerializer


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = "__all__"
        
class MessageSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer()
    receiver = UserProfileSerializer()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'isRead', 'createdAt']

class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageAttachment
        fields = '__all__'