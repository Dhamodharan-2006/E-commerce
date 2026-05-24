from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    register, verify_otp, resend_otp,
    CustomTokenObtainPairView, profile,
    forgot_password, reset_password, all_users
)
from orders.views import all_orders

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', register),
    path('api/auth/verify-otp/', verify_otp),
    path('api/auth/resend-otp/', resend_otp),
    path('api/auth/login/', CustomTokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
    path('api/auth/profile/', profile),
    path('api/auth/forgot-password/', forgot_password),
    path('api/auth/reset-password/', reset_password),
    path('api/auth/users/', all_users),
    path('api/auth/all-orders/', all_orders),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)