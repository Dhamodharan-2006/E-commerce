from django.urls import path
from . import views

urlpatterns = [
    path('', views.register),
    path('verify/<str:uidb64>/<str:token>/', views.verify_email),
    path('create-admin/', views.create_admin_temp),
]