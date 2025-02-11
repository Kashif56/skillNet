from django.contrib import admin
from .models import Gig, SwapRequest

# Register your models here.

@admin.register(Gig)
class GigAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'offeredSkills', 'desiredSkills', 'isActive', 'createdAt')
    search_fields = ('title', 'description', 'user__username')
    list_filter = ('isActive', 'createdAt')

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ('requestor', 'responder', 'gig', 'status', 'createdAt')
    search_fields = ('requestor__username', 'responder__username', 'message')
    list_filter = ('status', 'createdAt')
