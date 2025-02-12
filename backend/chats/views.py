from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Max, F, Subquery, OuterRef
from django.db.models.functions import Coalesce
from .models import Message
from userProfile.models import UserProfile
from .serializers import MessageSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, username):
    try:
        # Get both users
        other_user = get_object_or_404(User, username=username)
        current_user_profile = UserProfile.objects.get(user=request.user)
        other_user_profile = UserProfile.objects.get(user=other_user)

        # Get messages between these users
        messages = Message.objects.filter(
            (Q(sender=current_user_profile) & Q(receiver=other_user_profile)) |
            (Q(sender=other_user_profile) & Q(receiver=current_user_profile))
        ).order_by('createdAt')

        # Format messages
        message_list = []
        for msg in messages:
            message_list.append({
                'id': msg.id,
                'message': msg.content,
                'sender': msg.sender.user.username,
                'receiver': msg.receiver.user.username,
                'createdAt': msg.createdAt.isoformat()
            })

        return Response(message_list)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error in get_chat_history: {str(e)}")
        return Response({'error': 'Failed to fetch chat history'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    try:
        current_user_profile = UserProfile.objects.get(user=request.user)
        
        # Get all messages where current user is either sender or receiver
        messages = Message.objects.filter(
            Q(sender=current_user_profile) | Q(receiver=current_user_profile)
        ).order_by('-createdAt')

        # Get unique conversations
        conversations = set()
        conversation_list = []

        for msg in messages:
            other_profile = msg.receiver if msg.sender == current_user_profile else msg.sender
            
            if other_profile.user.username not in conversations:
                conversations.add(other_profile.user.username)
                conversation_list.append({
                    'username': other_profile.user.username,
                    'firstName': other_profile.user.first_name,
                    'lastName': other_profile.user.last_name,
                    'profilePicture': other_profile.profile_picture.url if other_profile.profile_picture else None,
                    'lastMessage': msg.content,
                    'lastMessageTime': msg.createdAt.isoformat()
                })

        return Response(conversation_list)

    except Exception as e:
        print(f"Error in get_conversations: {str(e)}")
        return Response({'error': 'Failed to fetch conversations'}, status=500)
