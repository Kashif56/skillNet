from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Gig, SwapRequest, SwapDelivery, DeliveryComment
from .serializer import GigSerializer, SwapRequestSerializer, DeliveryCommentSerializer
from django.db import transaction
import json
from django.utils import timezone



from userProfile.models import UserProfile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allGigs(request):
    try:
        print(request.user)
        gigs = Gig.objects.filter(user__user=request.user)
        serializer = GigSerializer(gigs, many=True)
        return Response({
            'status': 'success',   
            'data': serializer.data
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gigDetail(request, gigId):
    try:
        gig = Gig.objects.get(gigId=gigId, user__user=request.user)
        serializer = GigSerializer(gig)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Gig.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Gig does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
@parser_classes([JSONParser, MultiPartParser, FormParser])
def createGig(request):
    try:
        data = request.data
        user = UserProfile.objects.get(user=request.user)
        title = data.get('title')
        description = data.get('description')
        gigImage = request.FILES.get('gigImage')  # Get image from FILES
        offeredSkills = data.get('offering')
        desiredSkills = data.get('lookingFor')
        
        # Parse tags from JSON string
        try:
            tags = json.loads(data.get('tags', '[]'))
        except json.JSONDecodeError:
            tags = []
        
        gig = Gig.objects.create(
            user=user,
            title=title,
            description=description,
            gigImage=gigImage,
            offeredSkills=offeredSkills,
            desiredSkills=desiredSkills,
            tags=tags
        )
        serializer = GigSerializer(gig)

        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def updateGig(request, gigId):
    try:
        gig = Gig.objects.get(gigId=gigId, user__user=request.user)
        data = request.data
        
        # Update fields
        gig.title = data.get('title', gig.title)
        gig.description = data.get('description', gig.description)
        gig.offeredSkills = data.get('offering', gig.offeredSkills)
        gig.desiredSkills = data.get('lookingFor', gig.desiredSkills)
        
        # Handle image update
        if 'gigImage' in request.FILES:
            gig.gigImage = request.FILES['gigImage']
            
        # Handle tags
        if 'tags' in data:
            try:
                gig.tags = json.loads(data.get('tags', '[]'))
            except json.JSONDecodeError:
                gig.tags = []
        
        gig.save()
        serializer = GigSerializer(gig)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Gig.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Gig not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteGig(request, gigId):
    try:
        gig = Gig.objects.get(gigId=gigId, user__user=request.user)
        gig.delete()
        
        return Response({
            'status': 'success',
            'message': 'Gig deleted successfully'
        })
    except Gig.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Gig not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def track_impression(request):
    """
    API view to track when a gig is viewed (impression)
    """
    try:
        gig_id = request.data.get('gigId')
        if not gig_id:
            return Response({
                'status': 'error',
                'message': 'Gig ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            gig = Gig.objects.get(gigId=gig_id)
            gig.impressions += 1
            gig.save()
            
            return Response({
                'status': 'success',
                'data': {
                    'impressions': gig.impressions
                }
            })
        except Gig.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Gig not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def track_click(request):
    """
    API view to track when a gig is clicked
    """
    try:
        gig_id = request.data.get('gigId')
        if not gig_id:
            return Response({
                'status': 'error',
                'message': 'Gig ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            gig = Gig.objects.get(gigId=gig_id)
            gig.clicks += 1
            gig.save()
            
            return Response({
                'status': 'success',
                'data': {
                    'clicks': gig.clicks
                }
            })
        except Gig.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Gig not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def swap_delivery(request, swapId=None):
    """
    API view to handle swap delivery functionality after a swap request is accepted
    GET: Retrieve delivery details for a specific swap
    POST: Update delivery status, add comments or upload deliverables
    """
    try:
        # If no swapId provided in the URL, get it from request data for POST requests
        if not swapId and request.method == 'POST':
            swapId = request.data.get('swapId')
            
        if not swapId:
            return Response({
                'status': 'error',
                'message': 'Swap ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the swap request
        try:
            swap_request = SwapRequest.objects.get(swapId=swapId)
            
            # Verify the user is part of this swap
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile != swap_request.requestor and user_profile != swap_request.responder:
                return Response({
                    'status': 'error',
                    'message': 'You are not authorized to access this swap'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Determine user role in this swap
            is_requestor = user_profile == swap_request.requestor
            current_user_role = 'requestor' if is_requestor else 'responder'
            other_user = swap_request.responder if is_requestor else swap_request.requestor
                
            # Get or create the swap delivery
            delivery, created = SwapDelivery.objects.get_or_create(swap_request=swap_request)
                
            # Handle GET request - return swap delivery details
            if request.method == 'GET':
                # Get comments for this delivery
                comments = DeliveryComment.objects.filter(delivery=delivery).order_by('created_at')
                comments_data = DeliveryCommentSerializer(comments, many=True).data
                
                # Current user's delivery status
                my_delivery_status = delivery.requestor_status if is_requestor else delivery.responder_status
                my_delivery_file = delivery.requestor_file.url if is_requestor and delivery.requestor_file else None
                my_delivery_comment = delivery.requestor_comment if is_requestor else delivery.responder_comment
                
                # Other user's delivery status
                other_delivery_status = delivery.responder_status if is_requestor else delivery.requestor_status
                other_delivery_file = delivery.responder_file.url if not is_requestor and delivery.responder_file else None
                other_delivery_comment = delivery.responder_comment if is_requestor else delivery.requestor_comment
                if not other_delivery_file and not is_requestor and delivery.requestor_file:
                    other_delivery_file = delivery.requestor_file.url
                elif not other_delivery_file and is_requestor and delivery.responder_file:
                    other_delivery_file = delivery.responder_file.url
                
                return Response({
                    'status': 'success',
                    'data': {
                        'swap': {
                            'swapId': swap_request.swapId,
                            'status': swap_request.status,
                            'created_at': swap_request.createdAt,
                            'updated_at': swap_request.updatedAt,
                            'message': swap_request.message,
                            'is_completed': swap_request.status == 'completed'
                        },
                        'gig': {
                            'gigId': swap_request.gig.gigId,
                            'title': swap_request.gig.title,
                            'description': swap_request.gig.description,
                            'offered_skills': swap_request.gig.offeredSkills,
                            'desired_skills': swap_request.gig.desiredSkills,
                            'image': swap_request.gig.gigImage.url if swap_request.gig.gigImage else None
                        },
                        'requestor': {
                            'username': swap_request.requestor.user.username,
                            'first_name': swap_request.requestor.user.first_name,
                            'profile_picture': swap_request.requestor.profile_picture.url if swap_request.requestor.profile_picture else None,
                            'delivery_status': delivery.requestor_status,
                            'delivered_at': delivery.requestor_delivered_at,
                            'file': delivery.requestor_file.url if delivery.requestor_file else None,
                            'comment': delivery.requestor_comment
                        },
                        'responder': {
                            'username': swap_request.responder.user.username,
                            'first_name': swap_request.responder.user.first_name,
                            'profile_picture': swap_request.responder.profile_picture.url if swap_request.responder.profile_picture else None,
                            'delivery_status': delivery.responder_status,
                            'delivered_at': delivery.responder_delivered_at,
                            'file': delivery.responder_file.url if delivery.responder_file else None,
                            'comment': delivery.responder_comment
                        },
                        'current_user_role': current_user_role,
                        'other_user': {
                            'username': other_user.user.username,
                            'first_name': other_user.user.first_name
                        },
                        'delivery': {
                            'delivery_id': delivery.delivery_id,
                            'requestor_status': delivery.requestor_status,
                            'requestor_file': delivery.requestor_file.url if delivery.requestor_file else None,
                            'requestor_comment': delivery.requestor_comment,
                            'responder_status': delivery.responder_status,
                            'responder_file': delivery.responder_file.url if delivery.responder_file else None,
                            'responder_comment': delivery.responder_comment,
                            'is_completed': delivery.requestor_status == 'accepted' and delivery.responder_status == 'accepted',
                            'created_at': delivery.created_at,
                            'updated_at': delivery.updated_at
                        },
                        'comments': comments_data
                    }
                })
                
            # Handle POST request - update delivery status or add deliverables
            elif request.method == 'POST':
                action = request.data.get('action')
                
                if not action:
                    return Response({
                        'status': 'error',
                        'message': 'Action is required'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Handle different actions
                if action == 'mark_completed':
                    # When a user accepts a delivery, they are accepting the OTHER user's deliverable
                    # not their own. So we should update the status of the OTHER user's deliverable.
                    current_timestamp = timezone.now()
                    
                    if is_requestor:
                        # If requestor is accepting, they're accepting the responder's delivery
                        delivery.responder_status = 'accepted' 
                        delivery.responder_accepted_at = current_timestamp
                    else:
                        # If responder is accepting, they're accepting the requestor's delivery
                        delivery.requestor_status = 'accepted'
                        delivery.requestor_accepted_at = current_timestamp
                        
                    delivery.save()
                    
                    # Check if both parties have accepted, update swap status
                    if delivery.requestor_status == 'accepted' and delivery.responder_status == 'accepted':
                        swap_request.status = 'completed'
                        swap_request.save()
                    
                    return Response({
                        'status': 'success',
                        'message': 'Delivery marked as accepted',
                        'data': {
                            'swapId': swap_request.swapId,
                            'status': swap_request.status,
                            'delivery_status': {
                                'requestor': delivery.requestor_status,
                                'responder': delivery.responder_status,
                                'is_completed': delivery.requestor_status == 'accepted' and delivery.responder_status == 'accepted'
                            }
                        }
                    })
                    
                elif action == 'add_comment':
                    comment_text = request.data.get('comment')
                    if not comment_text:
                        return Response({
                            'status': 'error',
                            'message': 'Comment is required'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Handle file attachment if provided
                    file_attachment = request.FILES.get('file_attachment', None)
                    
                    # Create the comment
                    new_comment = DeliveryComment.objects.create(
                        delivery=delivery,
                        user=user_profile,
                        message=comment_text,
                        file_attachment=file_attachment
                    )
                    
                    # Return the created comment
                    serialized_comment = DeliveryCommentSerializer(new_comment).data
                    
                    return Response({
                        'status': 'success',
                        'message': 'Comment added successfully',
                        'data': serialized_comment
                    })
                    
                elif action == 'upload_deliverable':
                    # Check if file is provided
                    deliverable_file = request.FILES.get('file')
                    if not deliverable_file:
                        return Response({
                            'status': 'error',
                            'message': 'File is required for uploading deliverable'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Get the comment if provided
                    comment = request.data.get('comment', '')
                    
                    current_timestamp = timezone.now()
                    
                    # Update the appropriate field based on user role
                    if is_requestor:
                        delivery.requestor_file = deliverable_file
                        delivery.requestor_comment = comment
                        delivery.requestor_status = 'delivered'
                        delivery.requestor_delivered_at = current_timestamp
                    else:
                        delivery.responder_file = deliverable_file
                        delivery.responder_comment = comment
                        delivery.responder_status = 'delivered'
                        delivery.responder_delivered_at = current_timestamp
                        
                    delivery.save()
                    
                    # Create a comment to notify about the deliverable
                    message = f"Uploaded a new deliverable file: {deliverable_file.name}"
                    if comment:
                        message += f"\nComment: {comment}"
                        
                    DeliveryComment.objects.create(
                        delivery=delivery,
                        user=user_profile,
                        message=message
                    )
                    
                    return Response({
                        'status': 'success',
                        'message': 'Deliverable uploaded successfully',
                        'data': {
                            'file_url': delivery.requestor_file.url if is_requestor else delivery.responder_file.url,
                            'comment': comment,
                            'status': 'delivered',
                            'delivered_at': current_timestamp
                        }
                    })
                    
                else:
                    return Response({
                        'status': 'error',
                        'message': f'Unknown action: {action}'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
        except SwapRequest.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Swap request not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except UserProfile.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)