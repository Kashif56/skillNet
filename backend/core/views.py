from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status


from userProfile.models import UserProfile
from gigs.models import Gig, SwapRequest
from gigs.serializer import GigSerializer, SwapRequestSerializer



@api_view(['GET'])
@permission_classes([AllowAny])
def allGigs(request):
    try:
        gigs = Gig.objects.all()
        serializer = GigSerializer(gigs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def gigDetail(request, gigId):
    try:
        gig = Gig.objects.get(gigId=gigId)
        serializer = GigSerializer(gig)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Gig.DoesNotExist:
        print("Gig does not exist")
        return Response({
            'status': 'error',
            'data': 'Gig does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendSwapRequest(request):
    try:
        data = request.data
        gigId = data.get('gigId')
        message = data.get('message')
        gig = Gig.objects.get(gigId=gigId)
        if gig.isActive == False:
            return Response({
                'status': 'error',
                'data': 'Gig is not active'
            })
        
        requesterProfile = UserProfile.objects.get(user=request.user)
        responderProfile = gig.user

        SwapRequest.objects.create(requestor=requesterProfile, responder=responderProfile, gig=gig, message=message)
        return Response({
            'status': 'success',
            'data': 'Swap request sent successfully'
        })
    except Gig.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Gig does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkSwapRequest(request):
    try:
        gigId = request.GET.get('gigId')
        gig = Gig.objects.get(gigId=gigId)
        requestorUserProfile = UserProfile.objects.get(user=request.user)
        swapRequest = SwapRequest.objects.get(requestor=requestorUserProfile, responder=gig.user, gig=gig)
        serializer = SwapRequestSerializer(swapRequest)
       
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Gig.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Gig does not exist'
        })
    except SwapRequest.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Swap request does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSwapRequest(request, swapId):
    try:
        swap = SwapRequest.objects.get(swapId=swapId)
        serializer = SwapRequestSerializer(swap)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except SwapRequest.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Swap request does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMySwapRequests(request):
    try:
        userProfile = UserProfile.objects.get(user=request.user)
        sentSwapRequests = SwapRequest.objects.filter(requestor=userProfile)
        receivedSwapRequests = SwapRequest.objects.filter(responder=userProfile)

        sentSerializer = SwapRequestSerializer(sentSwapRequests, many=True)
        receivedSerializer = SwapRequestSerializer(receivedSwapRequests, many=True)
        return Response({
            'status': 'success',
            'sent': sentSerializer.data,
            'received': receivedSerializer.data
        })
    except UserProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'User profile does not exist'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respondToSwapRequest(request):
    try:
        data = request.data
        swapId = data.get('swapId')
        action = data.get('action')

        if action not in ['accepted', 'rejected']:
            return Response({
                'status': 'error',
                'data': 'Invalid action'
            })
        
        swapRequest = SwapRequest.objects.get(swapId=swapId)
        swapRequest.status = action
        swapRequest.save()
        
        return Response({
            'status': 'success',
            'data': 'Swap request response saved successfully'
        })
        
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdrawSwapRequest(request):
    try:
        data = request.data
        swapId = data.get('swapId')
        userProfile = UserProfile.objects.get(user=request.user)
        
        swapRequest = SwapRequest.objects.get(swapId=swapId, requestor=userProfile)
        
        if swapRequest.status != 'pending':
            return Response({
                'status': 'error',
                'data': 'Can only withdraw pending requests'
            })
            
        swapRequest.delete()
        
        return Response({
            'status': 'success',
            'data': 'Swap request withdrawn successfully'
        })
        
    except SwapRequest.DoesNotExist:
        return Response({
            'status': 'error',
            'data': 'Swap request not found or you are not authorized to withdraw it'
        })
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)