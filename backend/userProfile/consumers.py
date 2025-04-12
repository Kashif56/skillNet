import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.notification_group_name = f'notifications_{self.username}'
        
        # Join notification group
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave notification group
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )
    
    # Receive message from WebSocket (for future use)
    async def receive(self, text_data):
        data = json.loads(text_data)
        # Currently not processing any incoming messages from client
        # This would be for acknowledgments, etc.
        pass
    
    # Handle notification messages
    async def notification_message(self, event):
        message = event['message']
        
        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
    
    # Helper method to get user by username
    @database_sync_to_async
    def get_user(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None 