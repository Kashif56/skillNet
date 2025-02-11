from rest_framework import serializers
from .models import Skill, SkillCategory, UserAchievement, Achievement, Review


class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'description']


class SkillSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Skill
        fields = ['id','user', 'name', 'createdAt', 'updatedAt', ]
        read_only_fields = ('createdAt', 'updatedAt')


class UserAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAchievement
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'
    

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'