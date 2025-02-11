from django.urls import path
from . import views


urlpatterns = [
   path('all-gigs/', views.allGigs, name='all-gigs'),
   path('gig-detail/<gigId>/', views.gigDetail, name='gig-detail'),
   path('create-gig/', views.createGig, name='create-gig'),
   path('update-gig/<str:gigId>/', views.updateGig, name='update_gig'),
   path('delete-gig/<str:gigId>/', views.deleteGig, name='delete_gig')
]