from django.conf import settings
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth
from django.contrib.auth.tokens import default_token_generator
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

import json
from .serializers import *
from .helpers import *

@csrf_exempt
@api_view(["POST"])
def google_sign(request):

    # Load the sended data
    data = json.loads(request.body)
    # Get the token
    token = data["token"]

    try:
        # Verify the token id 
        decoded_token = auth.verify_id_token(token)
        print("Decoed token: ", decoded_token)
        uid = decoded_token["uid"]
        email = str(decoded_token["email"]).lower()
        username = email.split("@")[0]
        user, created = User.objects.get_or_create(email=email, 
                                                    is_active=True, 
                                                    username=username)
        # Create GoogleProfile instance if not exist
        if created :
            handle_user_created(user)
            gg_profile = GoogleProfile.objects.create(user=user, uid=uid)
            gg_profile.save()
            # send_welcome_email(email)
        token , _ = Token.objects.get_or_create(user=user)   
        return  Response({'token': token.key})
    except Exception as e:
        print("Error while logging with google: ", str(e))
        return Response({"message":"Error while logging"}, status=400)


@api_view(["POST"])
def passwordReset(request):
    data = request.data
    print("Data retrieved: ", data)
    serializer = PasswordResetSerializer(data=data)
    if serializer.is_valid():
        email = serializer.validated_data["email"]
        print("Email: ", email)
        try:
            user = User.objects.get(email=email)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"message": "user with this email does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        url = (
            f"{settings.FRONT_END_URL}reset-password?uidb64={uid}&activationId={token}"
        )
        print(url)
        subject = "Reset your Password"
        body = f"Click the link below to reset your password: \n\n {url}"

        # send_email(subject, body, email)
        return Response(
            {"message": "Password reset email sent."}, status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmation(APIView):
    def get(self, request, uidb64, token):
        # log_user_action(request.user, "Requesting Password Reset", ip=get_client_ip(self.request))
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            return Response({"message": "Success"}, status=200)
        else:

            return Response({"message": "Not found"}, status=404)

    def post(self, request, uidb64, token):

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            serializer = PasswordResetConfirmationSerializer(data=request.data)
            if serializer.is_valid():
                new_password = serializer.validated_data["new_password"]
                user.set_password(new_password)
                user.save()
                # Expire the reset token
                default_token_generator.make_token(user)  # This generates a new token, effectively invalidating the old one
                return Response({"message": "Password reset successful."}, status=200)
            else:
                return Response(serializer.errors)
        else:
            return Response({"message": "Invalid password reset link."}, status=400)

class LoginView(ObtainAuthToken):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request":request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token':token.key})

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class Verify_email(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            if email_verification_token.check_token(user, token):
                user.is_active = True
                user.save()
                # send_welcome_email(user.email)
                return Response(
                    {"message": "Email successfully verified"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Verification link is invalid"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST
            )

