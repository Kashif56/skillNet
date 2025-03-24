from rest_framework import serializers
from .models import Gig, SwapRequest, SwapDelivery, DeliveryComment
from userProfile.serializers import UserProfileSerializer





class GigSerializer(serializers.ModelSerializer):
    # Explicitly include nested serializers
    user = UserProfileSerializer()
   
    
    class Meta:
        depth = 1
        model = Gig
        fields = "__all__"
    

class SwapRequestSerializer(serializers.ModelSerializer):
    requestor = UserProfileSerializer()
    responder = UserProfileSerializer()
    gig = GigSerializer()

    class Meta:
        model = SwapRequest
        depth = 1
        fields = '__all__'


class DeliveryCommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    
    class Meta:
        model = DeliveryComment
        fields = ['id', 'user', 'message', 'file_attachment', 'created_at']
        

class SwapDeliverySerializer(serializers.ModelSerializer):
    swap_request = SwapRequestSerializer()
    comments = DeliveryCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = SwapDelivery
        fields = [
            'delivery_id', 'swap_request', 
            'requestor_file', 'requestor_status', 'requestor_delivered_at', 'requestor_accepted_at',
            'responder_file', 'responder_status', 'responder_delivered_at', 'responder_accepted_at',
            'comments', 'created_at', 'updated_at'
        ]
        
    def to_representation(self, instance):
        """
        Custom representation to include some computed fields
        """
        representation = super().to_representation(instance)
        
        # Add formatted file URLs if they exist
        if instance.requestor_file:
            representation['requestor_file_url'] = instance.requestor_file.url
        
        if instance.responder_file:
            representation['responder_file_url'] = instance.responder_file.url
            
        # Add convenience status fields
        representation['is_fully_delivered'] = (
            instance.requestor_status in ['delivered', 'accepted'] and 
            instance.responder_status in ['delivered', 'accepted']
        )
        
        representation['is_fully_accepted'] = (
            instance.requestor_status == 'accepted' and 
            instance.responder_status == 'accepted'
        )
        
        return representation