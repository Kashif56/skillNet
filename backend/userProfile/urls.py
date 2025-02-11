from django.urls import path
from .views import (
    getUserProfile,
    updateProfile,
    updateProfilePicture,
    updateBanner,
    updateSkills,
)

urlpatterns = [
    # The base path 'api/profile/' is already included from the main urls.py
    # So we only need to specify the remaining path
    path('profile/', getUserProfile, name='user-profile'),
    path('update/', updateProfile, name='update-profile'),  # Changed from profile/update/
    path('picture/', updateProfilePicture, name='update-profile-picture'),  # Changed from profile/picture/
    path('banner/', updateBanner, name='update-banner-image'),  # Changed from profile/banner/
    path('skills/', updateSkills, name='update-skills'),  # Changed from profile/skills/
]