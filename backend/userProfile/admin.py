from django.contrib import admin
from .models import UserProfile

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'rating', 'rating_count', 'createdAt')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('rating', 'createdAt')
    filter_horizontal = ('skills',)
