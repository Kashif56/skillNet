from django.urls import path
from . import views


urlpatterns = [
    path('chat-history/<str:username>/', views.get_chat_history, name='chat-history'),
    path('conversations/', views.get_conversations, name='conversations'),
]