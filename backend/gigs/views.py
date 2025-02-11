from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Gig, SwapRequest
from .serializer import GigSerializer, SwapRequestSerializer
from django.db import transaction
import json



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