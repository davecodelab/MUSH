from rest_framework import generics, permissions
from .models import Room
from .serializers import RoomSerializer


class RoomListView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Room.objects.prefetch_related('spaces__bookings').all()
        gender = self.request.query_params.get('gender')
        floor = self.request.query_params.get('floor')
        room_type = self.request.query_params.get('room_type')

        if gender:
            queryset = queryset.filter(gender_policy__in=['UNASSIGNED', gender.upper()])
        if floor:
            queryset = queryset.filter(floor=floor)
        if room_type:
            queryset = queryset.filter(room_type=room_type)

        return queryset


class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.prefetch_related('spaces__bookings').all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]
