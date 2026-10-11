from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from .serializers import RegisterSerializer, StudentSerializer


def set_auth_cookies(response, user):
    refresh = RefreshToken.for_user(user)
    jwt_cfg = settings.SIMPLE_JWT
    response.set_cookie(
        key=jwt_cfg['AUTH_COOKIE'],
        value=str(refresh.access_token),
        max_age=int(jwt_cfg['ACCESS_TOKEN_LIFETIME'].total_seconds()),
        secure=jwt_cfg['AUTH_COOKIE_SECURE'],
        httponly=jwt_cfg['AUTH_COOKIE_HTTP_ONLY'],
        samesite=jwt_cfg['AUTH_COOKIE_SAMESITE'],
        path=jwt_cfg['AUTH_COOKIE_PATH'],
    )
    response.set_cookie(
        key=jwt_cfg['AUTH_COOKIE_REFRESH'],
        value=str(refresh),
        max_age=int(jwt_cfg['REFRESH_TOKEN_LIFETIME'].total_seconds()),
        secure=jwt_cfg['AUTH_COOKIE_SECURE'],
        httponly=jwt_cfg['AUTH_COOKIE_HTTP_ONLY'],
        samesite=jwt_cfg['AUTH_COOKIE_SAMESITE'],
        path=jwt_cfg['AUTH_COOKIE_PATH'],
    )


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            res = Response(
                {"message": "Registration successful", "user": StudentSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
            set_auth_cookies(res, user)
            return res
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        username = (request.data.get('username') or '').strip()
        password = request.data.get('password') or ''
        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)
        if user is not None and user.is_active:
            res = Response(
                {"message": "Login successful", "user": StudentSerializer(user).data},
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(res, user)
            return res
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        jwt_cfg = settings.SIMPLE_JWT
        res = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        res.delete_cookie(
            jwt_cfg['AUTH_COOKIE'],
            path=jwt_cfg['AUTH_COOKIE_PATH'],
            samesite=jwt_cfg['AUTH_COOKIE_SAMESITE'],
        )
        res.delete_cookie(
            jwt_cfg['AUTH_COOKIE_REFRESH'],
            path=jwt_cfg['AUTH_COOKIE_PATH'],
            samesite=jwt_cfg['AUTH_COOKIE_SAMESITE'],
        )
        return res


class UserProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(StudentSerializer(request.user).data)
