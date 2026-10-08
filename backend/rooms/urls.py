from django.urls import path
from .views import RoomListView, RoomDetailView

urlpatterns = [
    path('', RoomListView.as_view(), name='room_list'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room_detail'),
]
