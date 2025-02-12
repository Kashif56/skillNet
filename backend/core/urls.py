from django.urls import path

from . import views

urlpatterns = [
    path('all-gigs/', views.allGigs, name='all-gigs'),
    path('gig-detail/<gigId>/', views.gigDetail, name='gig-detail'),
    path('send-swap-request/', views.sendSwapRequest, name='send-swap-request'),
    path('check-swap-request/', views.checkSwapRequest, name='check-swap-request'),
    path('get-swap-request/<swapId>/', views.getSwapRequest, name='get-swap-request'),
    path('my-swap-requests/', views.getMySwapRequests, name='get-my-swap-requests'),
    path('respond-swap-request/', views.respondToSwapRequest, name='respond-swap-request'),
    path('withdraw-swap-request/', views.withdrawSwapRequest, name='withdraw-swap-request')
]