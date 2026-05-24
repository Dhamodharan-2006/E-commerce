from django.urls import path
from . import views

urlpatterns = [
    path('orders/place/', views.place_order),
    path('orders/my-orders/', views.my_orders),
    path('orders/update-status/<int:order_id>/', views.update_order_status),
    path('orders/cancel/<int:order_id>/', views.cancel_order),
]