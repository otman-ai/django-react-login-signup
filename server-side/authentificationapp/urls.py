from django.urls import path
from .views import (
    google_sign,
    SignupView,LoginView, Verify_email, passwordReset, PasswordResetConfirmation
)

urlpatterns = [
    path("google_sign", google_sign, name="google_sign"),
    path("signup", SignupView.as_view(), name="signup"),
    path("login", LoginView.as_view(), name="login"),
    path("verify-email/<uidb64>/<token>", Verify_email.as_view(), name="verify_email"),
    path("password-reset", passwordReset, name="reset_password"),
    path("password-reset/<uidb64>/<token>", PasswordResetConfirmation.as_view(), name="confirm_reset_password")
]
