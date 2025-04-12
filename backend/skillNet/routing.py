from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

import chats.routing
import userProfile.routing

# Combine all WebSocket URL patterns
websocket_urlpatterns = []
websocket_urlpatterns.extend(chats.routing.websocket_urlpatterns)
websocket_urlpatterns.extend(userProfile.routing.websocket_urlpatterns)

# Debug output to console - helps identify loaded routes
for pattern in websocket_urlpatterns:
    print(f"Loaded WebSocket route: {pattern.pattern}")

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
}) 