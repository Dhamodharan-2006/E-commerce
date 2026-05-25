from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import CustomUser
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


def send_otp_email(email, username, otp):
    send_mail(
        subject='Your OTP - Verify Your Account',
        message=f'''Hello {username},

Your OTP for account verification is:

{otp}

This OTP is valid for 10 minutes.
Do not share this with anyone.

Thank you!''',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )


@api_view(['POST'])
def register(request):
    try:
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')

        if not email or not username or not password:
            return Response({'error': 'All fields are required'}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            existing = CustomUser.objects.get(email=email)
            if not existing.is_verified:
                otp = existing.generate_otp()
                send_otp_email(email, existing.username, otp)
                return Response({'message': 'OTP resent to your email.', 'email': email})
            return Response({'error': 'Email already exists'}, status=400)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=400)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
                        is_active=False
        )

        otp = user.generate_otp()

        try:
            send_otp_email(email, username, otp)
        except Exception as e:
            return Response({'error': 'Account created but email failed: ' + str(e)}, status=500)

        return Response({'message': 'OTP sent to your email!', 'email': email})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def verify_otp(request):
    try:
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=400)

        user = CustomUser.objects.get(email=email)

        if user.is_verified:
            return Response({'error': 'Account already verified'}, status=400)

        expiry_time = user.otp_created_at + timedelta(minutes=10)
        if timezone.now() > expiry_time:
            return Response({'error': 'OTP has expired. Please signup again to get a new OTP.'}, status=400)

        if user.otp != otp:
            return Response({'error': 'Invalid OTP. Please check your email.'}, status=400)

        user.is_active = True
        user.is_verified = True
        user.otp = None
        user.otp_created_at = None
        user.save()

        return Response({'message': 'Email verified successfully! You can now login.'})

    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def resend_otp(request):
    try:
        email = request.data.get('email')
        user = CustomUser.objects.get(email=email)

        if user.is_verified:
            return Response({'error': 'Account already verified'}, status=400)

        otp = user.generate_otp()
        send_otp_email(email, user.username, otp)

        return Response({'message': 'New OTP sent to your email!'})

    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'address': user.address,
        })
    if request.method == 'PUT':
        user.username = request.data.get('username', user.username)
        user.phone = request.data.get('phone', user.phone)
        user.address = request.data.get('address', user.address)
        user.save()
        return Response({'message': 'Profile updated!'})


@api_view(['POST'])
def forgot_password(request):
    try:
        email = request.data.get('email')
        user = CustomUser.objects.get(email=email)
        otp = user.generate_otp()
        send_otp_email(email, user.username, otp)
        return Response({'message': 'OTP sent to your email!'})
    except CustomUser.DoesNotExist:
        return Response({'error': 'No account found with this email'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        user = CustomUser.objects.get(email=email)

        expiry = user.otp_created_at + timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=400)

        if user.otp != otp:
            return Response({'error': 'Invalid OTP'}, status=400)

        user.set_password(new_password)
        user.otp = None
        user.otp_created_at = None
        user.save()
        return Response({'message': 'Password reset successful! You can now login.'})

    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    try:
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)
        users = CustomUser.objects.all().order_by('-date_joined')
        data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'is_verified': user.is_verified,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
        } for user in users]
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)