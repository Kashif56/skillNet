import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from userProfile.models import UserProfile
from .models import Message
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ObjectDoesNotExist
import jwt
from django.conf import settings

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Get the token from query params
            query_string = self.scope.get('query_string', b'').decode()
            params = dict(param.split('=') for param in query_string.split('&') if param)
            token = params.get('token', '')

            if not token:
                print("No token provided")
                await self.close()
                return

            # Verify the token
            try:
                # First try JWT token
                decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded.get('user_id')
                if not user_id:
                    print("No user_id in token")
                    await self.close()
                    return
            except jwt.InvalidTokenError:
                print("Invalid token")
                await self.close()
                return

            # Get the user
            self.user = await self.get_user(user_id)
            if not self.user:
                print("User not found")
                await self.close()
                return

            # Get room name from URL
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
            print(f"WebSocket connected for user {self.user.username} in room {self.room_name}")

        except Exception as e:
            print(f"WebSocket connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            if hasattr(self, 'room_group_name'):
                # Leave room group
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                print(f"WebSocket disconnected for user {self.user.username if hasattr(self, 'user') else 'unknown'}")
        except Exception as e:
            print(f"Error in disconnect: {str(e)}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            receiver_username = text_data_json.get('receiver_id')

            if not message or not receiver_username:
                print("Missing message or receiver")
                return

            # Save message to database
            saved_message = await self.save_message(message, receiver_username)
            if not saved_message:
                print("Failed to save message")
                return

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': saved_message['content'],
                    'sender': saved_message['sender'],
                    'createdAt': saved_message['createdAt']
                }
            )
            print(f"Message sent in room {self.room_group_name}")

        except Exception as e:
            print(f"Error in receive: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'Failed to process message'
            }))

    async def chat_message(self, event):
        try:
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': event['message'],
                'sender': event['sender'],
                'createdAt': event['createdAt']
            }))
        except Exception as e:
            print(f"Error in chat_message: {str(e)}")

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, message_content, receiver_username):
        try:
            sender_profile = UserProfile.objects.get(user=self.user)
            receiver_profile = UserProfile.objects.get(user__username=receiver_username)

            message = Message.objects.create(
                sender=sender_profile,
                receiver=receiver_profile,
                content=message_content
            )

            return {
                'content': message.content,
                'sender': self.user.username,
                'createdAt': message.createdAt.isoformat()
            }
        except Exception as e:
            print(f"Error saving message: {str(e)}")
            return None
