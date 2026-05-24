from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    try:
        cart_items = request.data.get('cart_items', [])
        address = request.data.get('address', '')
        name = request.data.get('name', '')
        phone = request.data.get('phone', '')
        total_price = request.data.get('total_price', 0)

        if not address or not name or not phone:
            return Response({'error': 'Name, phone and address are required'}, status=400)

        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=400)

        # Create order
        order = Order.objects.create(
            user=request.user,
            payment_method='cod',
            payment_status='pending',
            total_price=total_price,
            address=address,
            name=name,
            phone=phone,
        )

        # Create order items and reduce stock
        for item in cart_items:
            try:
                product = Product.objects.get(id=item['id'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    quantity=item['quantity'],
                    price=item['price'],
                )
                product.stock -= int(item['quantity'])
                if product.stock < 0:
                    product.stock = 0
                product.save()
            except Product.DoesNotExist:
                continue

        return Response({
            'message': 'Order placed successfully!',
            'order_id': order.id,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    try:
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_orders(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)

        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')

        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=400)

        order.status = new_status

        # If delivered, mark payment as paid for COD
        if new_status == 'delivered':
            order.payment_status = 'paid'

        order.save()

        # Send email to customer
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            send_mail(
                f'Order #{order.id} Status Updated',
                f'''Hello {order.name},

Your order #{order.id} status has been updated to: {new_status.upper()}

Order Details:
- Total Amount: ₹{order.total_price}
- Payment: Cash on Delivery
- Address: {order.address}

{'Your order has been delivered! Thank you for shopping with us.' if new_status == 'delivered' else ''}
{'Your order has been shipped and is on the way!' if new_status == 'shipped' else ''}
{'Your order is being processed.' if new_status == 'processing' else ''}

Thank you!
ShopCart Team''',
                settings.EMAIL_HOST_USER,
                [order.user.email],
                fail_silently=True,
            )
        except:
            pass

        return Response({
            'message': f'Order status updated to {new_status}',
            'order_id': order.id,
            'status': order.status,
            'payment_status': order.payment_status,
        })

    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)

        # Only allow cancel if order is pending or processing
        if order.status in ['shipped', 'delivered']:
            return Response({
                'error': f'Order cannot be cancelled. It is already {order.status}.'
            }, status=400)

        if order.status == 'cancelled':
            return Response({'error': 'Order is already cancelled'}, status=400)

        # Restore stock
        for item in order.items.all():
            try:
                product = item.product
                product.stock += item.quantity
                product.save()
            except:
                pass

        order.status = 'cancelled'
        order.save()

        # Send cancellation email
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            send_mail(
                f'Order #{order.id} Cancelled',
                f'''Hello {order.name},

Your order #{order.id} has been cancelled successfully.

Order Details:
- Total Amount: ₹{order.total_price}
- Payment: Cash on Delivery

Since this was a Cash on Delivery order, no payment was made.

We hope to see you again!
ShopCart Team''',
                settings.EMAIL_HOST_USER,
                [order.user.email],
                fail_silently=True,
            )
        except:
            pass

        return Response({'message': f'Order #{order.id} cancelled successfully'})

    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    