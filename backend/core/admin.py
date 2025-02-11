from django.contrib import admin
from .models import Skill, SkillCategory, Review, Achievement, UserAchievement

# Register your models here.

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'createdAt', 'updatedAt')
    search_fields = ('name', 'user__username')
    list_filter = ('user',)

@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'createdAt', 'updatedAt')
    search_fields = ('name', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewee', 'rating', 'gig', 'createdAt')
    search_fields = ('reviewer__username', 'reviewee__username', 'comment')
    list_filter = ('rating', 'createdAt')

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'createdAt', 'updatedAt')
    search_fields = ('name', 'description')

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'achievedAt', 'createdAt')
    search_fields = ('user__username', 'achievement__name')
    list_filter = ('achievedAt', 'createdAt')
