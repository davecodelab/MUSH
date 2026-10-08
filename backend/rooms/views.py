from rest_framework import generics, permissions
from .models import Room
from .serializers import RoomSerializer

class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny] # Publicly viewable

    def get_queryset(self):
        queryset = super().get_queryset()
        gender = self.request.query_params.get('gender', None)
        floor = self.request.query_params.get('floor', None)
        room_type = self.request.query_params.get('room_type', None)

        if gender:
            # Filter rooms that are unassigned or match the requested gender
            queryset = queryset.filter(gender_policy__in=['UNASSIGNED', gender.upper()])
        
        if floor:
            queryset = queryset.filter(floor=floor)
            
        if room_type:
            queryset = queryset.filter(room_type=room_type)

        return queryset

class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]
