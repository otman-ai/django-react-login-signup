from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers

from django.conf import settings
from .models import *
from .tokens import email_verification_token
from .helpers import *

FRONT_END = settings.FRONT_END_URL

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if email and password:	
            user = authenticate(email=email, password=password)
            print("user:",user)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is not active")
            else:
                raise serializers.ValidationError("Incorrect email and password")
        attrs["user"] = user
        return attrs

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print("Validated data :", validated_data["email"])
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_active=False,
        )
        user = User.objects.get(pk=user.id)
        handle_user_created(user)
        self.send_verification_email(user)
        print('Verification sended to ',user.email)
        return user

    def send_verification_email(self, user):
        token = email_verification_token.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"{settings.FRONT_END_URL}signup?uidb64={uid}&activationId={token}"
        print(verification_link)
        subject = "Verify Your Email"
        body = get_body_verification_email(user, verification_link)
        send_email(subject, body, user.email)

    def validate(self, attrs):
        # Call the parent validate method
        attrs = super().validate(attrs)
        
        # Validate email
        email = attrs.get('email')
        if email:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError({"message": "A user with this email already exists."})
        
        # Validate username
        username = attrs.get('username')
        if username:
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError({"message": "This username is already taken."})
            
            # Additional username validation (e.g., no special characters)
            if not username.isalnum():
                raise serializers.ValidationError({"message": "Username should only contain alphanumeric characters."})
        
        return attrs

class PasswordResetSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ["email"]


class PasswordResetConfirmationSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["new_password"]
        extra_kwargs = {"new_password": {"write_only": True}}
