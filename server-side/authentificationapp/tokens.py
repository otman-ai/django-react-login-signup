from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGeneratore(PasswordResetTokenGenerator):
    pass

email_verification_token = EmailVerificationTokenGeneratore()
