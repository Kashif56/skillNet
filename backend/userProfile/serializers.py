from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from dj_rest_auth.registration.serializers import RegisterSerializer
from core.serializer import SkillSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    skills = SkillSerializer(many=True, read_only=True)
    rating = serializers.FloatField(read_only=True, default=0.0)
    rating_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'user_first_name', 'user_last_name', 'user_email',
            'phone', 'title', 'address', 'profile_picture', 'banner_image',
            'bio', 'skills', 'rating', 'rating_count', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ('rating', 'rating_count', 'createdAt', 'updatedAt')

    def to_representation(self, instance):
        # Handle case where profile doesn't exist
        if instance is None:
            return {
                'id': None,
                'user': None,
                'user_first_name': '',
                'user_last_name': '',
                'user_email': '',
                'phone': None,
                'title': None,
                'address': None,
                'profile_picture': None,
                'banner_image': None,
                'bio': None,
                'skills': [],
                'rating': 0.0,
                'rating_count': 0,
                'createdAt': None,
                'updatedAt': None
            }
        
        # Get the base representation
        ret = super().to_representation(instance)
        
        # Ensure skills is always a list
        if 'skills' not in ret:
            ret['skills'] = []
            
        return ret


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    email = serializers.EmailField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')
        read_only_fields = ('id', 'username', 'email')

    def update(self, instance, validated_data):
        # Update User fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update or create UserProfile
        profile_data = validated_data.get('profile')
        if profile_data:
            UserProfile.objects.update_or_create(
                user=instance,
                defaults=profile_data
            )

        return instance


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save()
        UserProfile.objects.get_or_create(user=user)
