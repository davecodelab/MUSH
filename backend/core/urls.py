from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

admin.site.site_header = "Mushia Hostel Administration"
admin.site.site_title = "Mushia Hostel Admin"
admin.site.index_title = "Hostel Management Portal"

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/bookings/', include('bookings.urls')),
]
