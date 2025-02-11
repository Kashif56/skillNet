from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from django.db import transaction
from django.core.files.uploadedfile import InMemoryUploadedFile

from .models import UserProfile
from .serializers import UserProfileSerializer, UserSerializer
from core.models import Skill





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)

        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except UserProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'User profile does not exist'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'data': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    """
    Update user's profile information.
    Expected format:
    {
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
            "title": "Senior Developer",
            "bio": "About me..."
        }
    }
    """
    try:
        with transaction.atomic():
            # Get or create user profile
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            
            # Update user fields if provided
            user_fields = {'first_name', 'last_name'}
            user_data = {
                key: request.data[key]
                for key in user_fields
                if key in request.data
            }
            
            if user_data:
                user_serializer = UserSerializer(
                    request.user,
                    data=user_data,
                    partial=True
                )
                if not user_serializer.is_valid():
                    return Response({
                        'status': 'error',
                        'data': user_serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                user_serializer.save()

            # Update profile fields if provided
            profile_data = request.data.get('profile', {})
            if profile_data:
                profile_serializer = UserProfileSerializer(
                    profile,
                    data=profile_data,
                    partial=True
                )
                if not profile_serializer.is_valid():
                    return Response({
                        'status': 'error',
                        'data': profile_serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                profile_serializer.save()

            # Return updated profile
            updated_profile = UserProfile.objects.select_related('user').get(user=request.user)
            serializer = UserProfileSerializer(updated_profile)
            return Response({
                'status': 'success',
                'data': serializer.data
            })

    except Exception as e:
        return Response({
            'status': 'error',
            'data': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateProfilePicture(request):
    """Update user's profile picture"""
    try:
        if 'profile_picture' not in request.FILES:
            return Response({
                'status': 'error',
                'data': 'No profile picture provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        profile = UserProfile.objects.get(user=request.user)
        
        # Delete old profile picture if it exists
        if profile.profile_picture:
            profile.profile_picture.delete(save=False)
            
        profile.profile_picture = request.FILES['profile_picture']
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })

    except UserProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'User profile does not exist'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'data': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateBanner(request):
    """Update user's banner image"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if 'banner_image' not in request.FILES:
            return Response({
                'status': 'error',
                'data': 'No banner image provided'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        profile.banner_image = request.FILES['banner_image']
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        return Response({
            'status': 'success',
            'data': serializer.data
        })

    except UserProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'User profile does not exist'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'data': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateSkills(request):
    """
    Update user's skills.
    Expected format:
    {
        "skills": ["Python", "JavaScript", "React"]  # List of skill names
    }
    """
    try:
        if 'skills' not in request.data:
            return Response({
                'status': 'error',
                'data': 'No skills provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        skill_names = request.data['skills']
        if not isinstance(skill_names, list):
            return Response({
                'status': 'error',
                'data': 'Skills must be a list of strings'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Delete all existing skills for this user
            Skill.objects.filter(user=request.user).delete()
            
            # Create new skills
            new_skills = []
            for skill_name in skill_names:
                skill = Skill.objects.create(
                    user=request.user,
                    name=skill_name
                )
                new_skills.append(skill)

            # Update user profile's skills
            profile = UserProfile.objects.get(user=request.user)
            profile.skills.set(new_skills)
            
            # Return updated profile data
            serializer = UserProfileSerializer(profile)
            return Response({
                'status': 'success',
                'data': serializer.data
            })

    except UserProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'User profile does not exist'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'data': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)