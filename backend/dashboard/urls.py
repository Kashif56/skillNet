from django.urls import path

from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    path('chart-data/', views.chart_data, name='chart-data'),
    path('activity-feed/', views.activity_feed, name='activity-feed'),
    path('swap-status/', views.swap_status, name='swap_status'),
]