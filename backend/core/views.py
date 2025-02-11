from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status


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

        SwapRequest.objects.create(requestor=request.user, responder=gig.user, gig=gig, message=message)
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
        gigId = request.data.get('gigId')
        gig = Gig.objects.get(gigId=gigId)
        SwapRequest.objects.get(requestor=request.user, responder=gig.user, gig=gig)
        return Response({
            'status': 'success',
            'data': 'Swap request already exists'
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