from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
import calendar
import random
import traceback

# Import models at the top to avoid circular imports
from gigs.models import SwapRequest, Gig
from userProfile.models import UserProfile

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    API view to get dashboard stats for the current user
    """
    try:
        user = request.user
        
        # Get user profile
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({
                "error": "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get active swaps from database
        active_swaps = SwapRequest.objects.filter(
            (Q(requestor=profile) | Q(responder=profile)),
            status='accepted'
        ).count()

        # Get completed swaps from database
        completed_swaps = SwapRequest.objects.filter(
            (Q(requestor=profile) | Q(responder=profile)),
            status='completed'
        ).count()
        
        # Calculate trend (for demo, return a random positive/negative value)
        active_swaps_trend = random.randint(-15, 20)
        completed_swaps_trend = random.randint(-10, 15)
        
        # Get user rating from profile
        rating = profile.rating
        
   
        
        return Response({
            'stats': {
                'active_swaps': {
                    'value': active_swaps,
                    'trend': active_swaps_trend
                },
                'rating': {
                    'value': round(rating, 1)
                },
                'completed_swaps': {
                    'value': completed_swaps,
                    'trend': completed_swaps_trend
                }
            }
        })
    except Exception as e:
        print(f"Error in dashboard_stats view: {str(e)}")
        traceback.print_exc()
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chart_data(request):
    """
    API view to get chart data for the dashboard
    """
    try:
        user = request.user
        
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({
                "error": "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get last 6 months
        today = timezone.now()
        months = []
        data = []
        
        for i in range(5, -1, -1):
            # Calculate month and year
            month_date = today - timedelta(days=30 * i)
            month = month_date.month
            year = month_date.year
            
            # Add month abbreviation to labels
            months.append(calendar.month_abbr[month])
            
            # Get number of swaps for that month from database
            month_start = timezone.datetime(year, month, 1, tzinfo=timezone.get_current_timezone())
            if month == 12:
                next_month = 1
                next_year = year + 1
            else:
                next_month = month + 1
                next_year = year
            
            month_end = timezone.datetime(next_year, next_month, 1, tzinfo=timezone.get_current_timezone())
            
            try:
                # Count completed swap requests for this month
                swaps_count = SwapRequest.objects.filter(
                    (Q(requestor=profile) | Q(responder=profile)),
                    status='completed',
                    createdAt__gte=month_start,
                    createdAt__lt=month_end
                ).count()
            except Exception as e:
                print(f"Error counting swaps for month {month}/{year}: {str(e)}")
                swaps_count = 0
            
            data.append(swaps_count)
        
        return Response({
            'labels': months,
            'datasets': [
                {
                    'label': 'Skill Swaps',
                    'data': data,
                    'borderColor': '#4A90E2',
                    'tension': 0.4
                }
            ]
        })
    except Exception as e:
        print(f"Error in chart_data view: {str(e)}")
        traceback.print_exc()
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_feed(request):
    """
    API view to get activity feed for the dashboard
    """
    try:
        user = request.user
        
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({
                "error": "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get recent activities
        activities = []
        
        # Get all swap requests (completed, pending, accepted, etc.)
        try:
            # First, get all swap requests without slicing
            swap_requests = SwapRequest.objects.filter(
                (Q(requestor=profile) | Q(responder=profile))
            ).select_related('gig', 'requestor__user', 'responder__user').order_by('-updatedAt')
            
            # Add completed swaps to activities
            for swap in swap_requests.filter(status='completed'):
                other_user = swap.requestor.user.username if swap.responder == profile else swap.responder.user.username
                activities.append({
                    'type': 'swap_completed',
                    'title': f'Swap completed with {other_user}',
                    'time': swap.updatedAt,
                    'details': f'You swapped skills through gig: {swap.gig.title}',
                    'swap_id': swap.id,
                    'swapId': swap.swapId,
                    'gig_id': swap.gig.id,
                    'other_user': other_user
                })
            
            # Add accepted swaps to activities
            for swap in swap_requests.filter(status='accepted'):
                other_user = swap.requestor.user.username if swap.responder == profile else swap.responder.user.username
                activities.append({
                    'type': 'swap_accepted',
                    'title': f'Swap accepted with {other_user}',
                    'time': swap.updatedAt,
                    'details': f'You are now actively swapping skills for gig: {swap.gig.title}',
                    'swap_id': swap.id,
                    'swapId': swap.swapId,
                    'gig_id': swap.gig.id,
                    'other_user': other_user
                })
            
            # Add new swap requests to activities
            for request in swap_requests.filter(status='pending', responder=profile):
                activities.append({
                    'type': 'new_request',
                    'title': 'New swap request',
                    'time': request.createdAt,
                    'details': f'{request.requestor.user.username} wants to swap skills with you for: {request.gig.title}',
                    'swap_id': request.id,
                    'swapId': request.swapId,
                    'gig_id': request.gig.id,
                    'other_user': request.requestor.user.username
                })
                
            # Add sent swap requests to activities
            for request in swap_requests.filter(status='pending', requestor=profile):
                activities.append({
                    'type': 'request_sent',
                    'title': 'Request sent',
                    'time': request.createdAt,
                    'details': f'You requested a skill swap with {request.responder.user.username} for: {request.gig.title}',
                    'swap_id': request.id,
                    'swapId': request.swapId,
                    'gig_id': request.gig.id,
                    'other_user': request.responder.user.username
                })
            
            # Add rejected swap requests to activities
            for request in swap_requests.filter(status='rejected'):
                if request.requestor == profile:
                    activities.append({
                        'type': 'request_rejected',
                        'title': 'Request rejected',
                        'time': request.updatedAt,
                        'details': f'{request.responder.user.username} rejected your swap request for: {request.gig.title}',
                        'swap_id': request.id,
                        'swapId': request.swapId,
                        'gig_id': request.gig.id,
                        'other_user': request.responder.user.username
                    })
                else:
                    activities.append({
                        'type': 'request_rejected',
                        'title': 'Request rejected',
                        'time': request.updatedAt,
                        'details': f'You rejected a swap request from {request.requestor.user.username} for: {request.gig.title}',
                        'swap_id': request.id,
                        'swapId': request.swapId,
                        'gig_id': request.gig.id,
                        'other_user': request.requestor.user.username
                    })
                
        except Exception as e:
            print(f"Error fetching swap requests: {str(e)}")
            traceback.print_exc()
            # Add at least one activity so the view doesn't fail
            activities.append({
                'type': 'system',
                'title': 'Welcome to SkillNet',
                'time': timezone.now(),
                'details': 'Start by browsing gigs or creating your own!'
            })
        
        # Get recent gigs created by user
        try:
            # Get the gigs without slicing first
            user_gigs = Gig.objects.filter(user=profile).order_by('-createdAt')
            
            # Limit to the 5 most recent gigs
            for gig in user_gigs[:5]:
                activities.append({
                    'type': 'gig_created',
                    'title': 'New gig created',
                    'time': gig.createdAt,
                    'details': f'You created a new gig: {gig.title}',
                    'gig_id': gig.id
                })
        except Exception as e:
            print(f"Error fetching user gigs: {str(e)}")
            traceback.print_exc()
        
        # If no activities were found, add a welcome message
        if not activities:
            activities.append({
                'type': 'system',
                'title': 'Welcome to SkillNet',
                'time': timezone.now(),
                'details': 'Start by browsing gigs or creating your own!'
            })
        
        # Sort all activities by time
        activities.sort(key=lambda x: x['time'], reverse=True)
        
        # Format the activities for the response, limiting to the 15 most recent
        formatted_activities = []
        for activity in activities[:15]:
            formatted_activity = {
                'type': activity['type'],
                'title': activity['title'],
                'time': activity['time'].strftime('%Y-%m-%dT%H:%M:%SZ'),
                'details': activity['details']
            }
            
            # Add additional fields if they exist
            for field in ['swap_id', 'gig_id', 'other_user']:
                if field in activity:
                    formatted_activity[field] = activity[field]
            
            formatted_activities.append(formatted_activity)
        
        return Response(formatted_activities)
    
    except Exception as e:
        print(f"Unexpected error in activity_feed view: {str(e)}")
        traceback.print_exc()
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def swap_status(request):
    """
    API view to get active and completed swaps for the current user
    """
    try:
        user = request.user
        
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({
                "error": "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get active and completed swaps
        active_swaps = []
        completed_swaps = []
        
        try:
            # Get all swap requests without slicing or filtering first
            swap_requests = SwapRequest.objects.filter(
                (Q(requestor=profile) | Q(responder=profile))
            ).select_related('gig', 'requestor__user', 'responder__user').order_by('-updatedAt')
            
            # Process active swaps
            for swap in swap_requests.filter(status='accepted'):
                other_user = swap.requestor.user.username if swap.responder == profile else swap.responder.user.username
                active_swaps.append({
                    'id': swap.id,
                    'swapId': swap.swapId,
                    'status': 'accepted',
                    'title': f'Swap with {other_user}',
                    'details': f'Active skill swap for: {swap.gig.title}',
                    'date': swap.updatedAt.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'gig_id': swap.gig.id,
                    'other_user': other_user
                })
            
            # Process completed swaps
            for swap in swap_requests.filter(status='completed'):
                other_user = swap.requestor.user.username if swap.responder == profile else swap.responder.user.username
                completed_swaps.append({
                    'id': swap.id,
                    'swapId': swap.swapId,
                    'status': 'completed',
                    'title': f'Swap with {other_user}',
                    'details': f'Completed skill swap for: {swap.gig.title}',
                    'date': swap.updatedAt.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'gig_id': swap.gig.id,
                    'other_user': other_user
                })
                
        except Exception as e:
            print(f"Error fetching swap data: {str(e)}")
            traceback.print_exc()
            return Response(
                {"error": f"An error occurred while fetching swaps: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'active_swaps': active_swaps,
            'completed_swaps': completed_swaps
        })
    
    except Exception as e:
        print(f"Unexpected error in swap_status view: {str(e)}")
        traceback.print_exc()
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
