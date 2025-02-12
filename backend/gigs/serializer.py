from rest_framework import serializers
from .models import Gig, SwapRequest
from userProfile.serializers import UserProfileSerializer
from core.serializer import SkillSerializer
from chats.serializer import MessageAttachmentSerializer
from chats.models import MessageAttachment





class GigSerializer(serializers.ModelSerializer):
    # Explicitly include nested serializers
    user = UserProfileSerializer()
   
    
    class Meta:
        depth = 1
        model = Gig
        fields = "__all__"
    

class SwapRequestSerializer(serializers.ModelSerializer):
    requestor = UserProfileSerializer()
    responder = UserProfileSerializer()
    gig = GigSerializer()

    class Meta:
        model = SwapRequest
        depth = 1
        fields = '__all__'