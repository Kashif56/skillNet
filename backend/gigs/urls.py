from django.urls import path
from . import views


urlpatterns = [
   path('all-gigs/', views.allGigs, name='all-gigs'),
   path('gig-detail/<gigId>/', views.gigDetail, name='gig-detail'),
   path('create-gig/', views.createGig, name='create-gig'),
   path('update-gig/<str:gigId>/', views.updateGig, name='update_gig'),
   path('delete-gig/<str:gigId>/', views.deleteGig, name='delete_gig'),
   path('track-impression/', views.track_impression, name='track_impression'),
   path('track-click/', views.track_click, name='track_click'),
   path('swap-delivery/<str:swapId>/', views.swap_delivery, name='swap_delivery'),
   path('swap-delivery/', views.swap_delivery, name='swap_delivery_no_id')
]