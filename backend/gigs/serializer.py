from rest_framework import serializers
from .models import Gig, SwapRequest
from userProfile.serializers import UserProfileSerializer
from core.serializer import SkillSerializer


class SwapRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = '__all__'


class GigSerializer(serializers.ModelSerializer):
    # Explicitly include nested serializers
    user = UserProfileSerializer()
   
    
    class Meta:
        depth = 1
        model = Gig
        fields = "__all__"