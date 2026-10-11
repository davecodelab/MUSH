from django.urls import path
from .views import (
    HoldSpaceView,
    MyBookingsView,
    ReleaseHoldView,
    InitializePaymentView,
    VerifyPaymentView,
    PaystackWebhookView,
    RoommatesView,
)

urlpatterns = [
    path('my-bookings/', MyBookingsView.as_view(), name='my_bookings'),
    path('hold/', HoldSpaceView.as_view(), name='hold_space'),
    path('release-hold/', ReleaseHoldView.as_view(), name='release_hold'),
    path('initialize-payment/', InitializePaymentView.as_view(), name='initialize_payment'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('webhook/', PaystackWebhookView.as_view(), name='paystack_webhook'),
    path('roommates/<str:room_id>/', RoommatesView.as_view(), name='roommates_view'),
]

