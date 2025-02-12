from django.contrib import admin
from .models import Thread, Message, MessageAttachment

# Register your models here.

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at')
    filter_horizontal = ('participants',)
    search_fields = ('participants__username',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'isRead', 'createdAt')
    list_filter = ('isRead', 'createdAt')
   

@admin.register(MessageAttachment)
class MessageAttachmentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'file_type', 'message', 'created_at')
    search_fields = ('file_name', 'file_type')
    list_filter = ('file_type', 'created_at')
