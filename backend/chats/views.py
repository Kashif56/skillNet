from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Max, F, Subquery, OuterRef
from django.db.models.functions import Coalesce
from .models import Message
from userProfile.models import UserProfile
from .serializers import MessageSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, username):
    try:
        # Get the UserProfile objects for both users
        current_user = UserProfile.objects.get(user=request.user)
        other_user = UserProfile.objects.get(user__username=username)

        # Query messages between the two users
        messages = Message.objects.filter(
            Q(sender=current_user, receiver=other_user) |
            Q(sender=other_user, receiver=current_user)
        ).order_by('createdAt')

        # Serialize the messages
        serializer = MessageSerializer(messages, many=True)
        
        # Transform the data to include sender username
        chat_messages = []
        for msg in serializer.data:
            chat_messages.append({
                'id': msg['id'],
                'message': msg['content'],
                'sender': msg['sender']['user']['username'],
                'createdAt': msg['createdAt']
            })

        return Response(chat_messages)

    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        print(f"Error in get_chat_history: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    try:
        current_user = UserProfile.objects.get(user=request.user)
        
        # Get latest message for each conversation
        latest_messages = Message.objects.filter(
            Q(sender=current_user) | Q(receiver=current_user)
        ).values(
            'sender', 'receiver'
        ).annotate(
            last_message_time=Max('createdAt')
        ).order_by('-last_message_time')

        # Format the response
        chat_list = []
        seen_users = set()  # To track unique conversations

        for msg in latest_messages:
            other_user = None
            if msg['sender'] == current_user.id:
                other_user = UserProfile.objects.get(id=msg['receiver'])
            else:
                other_user = UserProfile.objects.get(id=msg['sender'])
            
            # Skip if we've already added this user
            if other_user.user.username in seen_users:
                continue
            
            seen_users.add(other_user.user.username)
            
            # Get the actual last message
            last_message = Message.objects.filter(
                Q(sender=current_user, receiver=other_user) |
                Q(sender=other_user, receiver=current_user)
            ).order_by('-createdAt').first()

            if last_message:
                chat_list.append({
                    'username': other_user.user.username,
                    'firstName': other_user.user.first_name,
                    'lastName': other_user.user.last_name,
                    'lastMessage': last_message.content,
                    'lastMessageTime': last_message.createdAt.isoformat(),
                    'profilePicture': other_user.profile_picture.url if other_user.profile_picture else None,
                })

        return Response(chat_list)

    except Exception as e:
        print(f"Error in get_conversations: {str(e)}")
        return Response([], status=200)  # Return empty array instead of error
