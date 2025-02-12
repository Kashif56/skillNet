"""
URL configuration for skillNet project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from dj_rest_auth.views import PasswordResetConfirmView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password reset
    path('api/auth/password/reset/confirm/<uidb64>/<token>/', 
         PasswordResetConfirmView.as_view(), 
         name='password_reset_confirm'),
    
    # Email verification
    path('api/auth/account-confirm-email/', 
         TemplateView.as_view(template_name="account/email/email_confirmation.html"), 
         name='account_email_verification_sent'),
    path('api/auth/account-confirm-email/<str:key>/', 
         TemplateView.as_view(template_name="account/email/email_confirmation.html"), 
         name='account_confirm_email'),

    path('api/', include('core.urls')),
    path('api/profile/', include('userProfile.urls')),  
    path('api/gigs/', include('gigs.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/chats/', include('chats.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
