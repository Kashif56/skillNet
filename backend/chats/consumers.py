import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from userProfile.models import UserProfile
from .models import Message
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ObjectDoesNotExist

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the token from query params
        query_string = self.scope.get('query_string', b'').decode()
        params = dict(param.split('=') for param in query_string.split('&') if param)
        token = params.get('token', '')

        try:
            # Verify the token and get the user
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.user = await self.get_user(user_id)
            
            if not self.user:
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

        except Exception as e:
            print(f"WebSocket connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        # Leave room group
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except:
            pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            receiver_username = text_data_json.get('receiver_id')

            if not message or not receiver_username:
                return

            # Save message to database
            saved_message = await self.save_message(message, receiver_username)
            if not saved_message:
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
