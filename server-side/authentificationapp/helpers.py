from django.conf import settings
import smtplib
import imaplib
import time
from email.mime.text import MIMEText
from email.header import Header
import os
from .models import *
from django.conf import settings
from stripe import Customer
import stripe

stripe.api_key = settings.STRIPE_PRIVATE_KEY
# SMTP (sending) server details
smtp_server = settings.EMAIL_HOST_SMTP
smtp_port = settings.EMAIL_PORT_SMTP

# IMAP (receiving) server details
imap_server = settings.EMAIL_HOST_IMAP
imap_port = settings.EMAIL_PORT_IMAP

# Email configuration
sender_password = settings.EMAIL_HOST_PASSWORD
sender_email = settings.EMAIL_HOST_USER


def handle_user_created(user):
    subscription = Subscription.objects.create(user=user)
    subscription.save()

    print("Saved.")
    customer = Customer.create(email=user.email, name=user.username)
    profile = UserProfile.objects.create(user=user, stripe_customer_id=customer.id)
    profile.save()
    print("Customer created")

def send_welcome_email(email):
    subject = f"Welcome to {os.getenv('BRAND_NAME')}"
    body = f"""
    A Warm welcome to {os.getenv('BRAND_NAME')}!\n
    We're thrilled to have you on board.\n\n .
    This email is to verify your email
    \n\nYour feedback or feature requests are invaluable to us, so please don't hesitate to reach out.
    \n\nBest regards,\Founder of \n{os.getenv('BRAND_NAME')}"""
    send_email(subject, body, email)

def send_email(subject, body, recipient_email):
    # Create the message
    message = MIMEText(body, "plain", "utf-8")
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = Header(subject, "utf-8")

    try:
        # Send the email
        smtp_obj = smtplib.SMTP(smtp_server, smtp_port)
        smtp_obj.starttls()
        smtp_obj.login(sender_email, sender_password)
        smtp_obj.sendmail(sender_email, 
                          recipient_email, 
                          message.as_string())
        smtp_obj.quit()
        print("Email sent successfully.")

        # Append the sent email to the IMAP server's "Sent" folder
        imap_obj = imaplib.IMAP4_SSL(imap_server, imap_port)
        imap_obj.login(sender_email, sender_password)
        imap_obj.append(
            "Sent",
            "",
            imaplib.Time2Internaldate(
                imaplib.Time2Internaldate(
                    imaplib.Time2Internaldate(time.time()))
            ),
            message.as_bytes(),
        )
        imap_obj.logout()
        print('Email appended to "Sent" folder.')
    except smtplib.SMTPException as e:
        print("Error sending email:", str(e))
    except imaplib.IMAP4.error as e:
        print('Error appending email to "Sent" folder:', str(e))






# def get_user_token( request):
#     user_token = request.data.get("user_token")
#     auth_header = request.headers.get("Authorization", "")
#     user_token= auth_header.split(" ")[-1]
#     return user_token

# def update_credits( user, ip, added):
#     features = FacelessFeatures.objects.get(user=user)
#     prev_credits = features.credits
#     new_credits = prev_credits + added
#     FacelessFeatures.objects.filter(user=user).update(credits=new_credits)
#     log_credit_usage(user, new_credits, f"Updating the credits from {prev_credits} to {new_credits}", ip=ip)



# async def generate_hook(prompt) -> str:
#     chat_completion = await client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant."},
#             {"role": "user", "content": f"""
#              Generate a captivating caption for a video of social media with the following topic: {prompt}
#              The caption should be 30 words or less.
#              No quotes in the caption.
#              Make it short and concise.
#              make it engaging and interesting.
#              The caption should be in the same language as the prompt."""}
#         ],
#         max_tokens=50
#     )
#     return chat_completion.choices[0].message.content

# async def generate_video_idea(prompt) -> str:
#     chat_completion = await client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant."},
#             {"role": "user", "content": f"""
#              Generate a captivating caption for a video of social media with the following topic: {prompt}
#              The caption should be 30 words or less.
#              No quotes in the caption.
#              Make it short and concise.
#              make it engaging and interesting.
#              The caption should be in the same language as the prompt."""}
#         ],
#         max_tokens=50
#     )
#     return chat_completion.choices[0].message.content

# def is_allowed( user, credits_needed):
#     features = FacelessFeatures.objects.get(user=user)
#     return features.credits + credits_needed <= features.credits_limits

# def get_client_ip(request):
#     x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(',')[0]
#     else:
#         ip = request.META.get('REMOTE_ADDR')
#     return ip

# def log_user_action(user, action, ip=None):
#     email = User.objects.get(pk=user.id).email
#     logger.debug(f"User `{str(user)}` with email {email} and Ip Adress {ip} performed action {action}")
#     UserActionLog.objects.create(user=user, action=action, ip=ip)

# def log_transaction(user, transaction_id, amount, details):
#     email = User.objects.get(pk=user.id).email
#     logger.debug(f"User `{str(user)}` with email {email} made a transaction {transaction_id} amount : {amount} details : {details}")
#     TransactionLog.objects.create(user=user, transaction_id=transaction_id, amount=amount, details=details)

# def log_credit_usage(user, credits_used, description, ip=None):
#     email = User.objects.get(pk=user.id).email

#     logger.debug(f"User `{str(user)}` with email {email} and Ip Adress {ip} used {credits_used} credits. Description :{description}")
#     CreditUsageLog.objects.create(user=user, ip=ip, credits_used=credits_used, description=description)

# def get_query_info(access_token):
#     headers = {'Content-Type': 'application/json; charset=UTF-8',
#                 'Authorization': f'Bearer {access_token}'}
#     query_info_endpoint = "https://open.tiktokapis.com/v2/post/publish/creator_info/query/"
#     response = requests.post(query_info_endpoint, headers=headers)
#     print("Response from info query:", response.text)
#     if response.status_code == 200:
#         print("Response from Query info is OK")
#         print("Response: ", response.json())
#         if 'data' in response.json():
#             if 'creator_avatar_url' in response.json()['data']:
#                 return response.json()['data'], True
#             print("No creator_avatar and nickname found")
#     return response.text, False

# def refresh_post_limits():
#    paid_subscriptions = Subscription.objects.exclude(Q(plan="free") | Q(plan="Free"))

#    print(paid_subscriptions)
#    for subscription in paid_subscriptions:
#        print("Updating for user: ", subscription.user)
#        FacelessFeatures.objects.filter(user=subscription.user).update(post_times=0)
#        print("Post limits updated successffully for user:", subscription.user)
#    return True

# def refresh_youtube_access_token(refresh_token, user_id):
#     print("Tasks is excuting ...")
    
#     if not YouTubeAccount.objects.filter(refresh_token=refresh_token, user_id=user_id).exists():
#       print("YouTube account deosn't exists to update the token for")
#       return None
#     youtube_account = YouTubeAccount.objects.get(refresh_token=refresh_token)
#     url = "https://oauth2.googleapis.com/token"
#     data = {
#         "client_id": youtube_account.client_id,
#         "client_secret": youtube_account.client_secret,
#         "refresh_token": youtube_account.refresh_token,
#         "grant_type": "refresh_token"
#     }
#     print("Posting....")
#     response = requests.post(url, data=data)
#     if response.status_code == 200:
#        token_info = response.json()
#        token = token_info["access_token"]
#        if YouTubeAccount.objects.filter(token=token).exists():
#          print("Youtube Token already up to date")
#          return None
#        if token:
#          print("Updating the youtube token")
#          credentials_dict = {
#        'token':token,
#         'refresh_token': youtube_account.refresh_token,
#         'client_id': youtube_account.client_id,
#         'client_secret': youtube_account.client_secret,
#         'scopes': settings.GOOGLE_SCOPES}
#          youtube = build('youtube', 'v3', credentials=Credentials(**credentials_dict))
#          channel = youtube.channels().list(mine=True, part='snippet').execute()
#          creator_nickname = channel["items"][0]["snippet"]["localized"]["title"]
#          creator_avatar_url =  channel["items"][0]["snippet"]["thumbnails"]["default"]["url"]
#          YouTubeAccount.objects.filter(refresh_token=refresh_token, user_id=user_id).update(token=token, creator_nickname=creator_nickname, 
#                                                                     creator_avatar_url=creator_avatar_url)
#          print("Youtube Account token has Updated Successfully")
#     return response.json()


def get_body_verification_email(user, verification_link):
    body = f"""Hi {user}!
            You have just created an account on {os.getenv("BRAND_NAME")}.
            Please take a minute to activate your account by clicking this link: {verification_link}
            If you did not create an account, please ignore this email.
            Thanks,
            {os.getenv("BRAND_NAME")} Founder"""
    return body


# # def get_product(session_id):
# #     line_items = stripe.checkout.Session.list_line_items(session_id)        
# #     price_id = line_items['data'][-1]['price']['id']
# #     print(f"Checkout session completed for {price_id}")
# #     product_details = None
# #     price  = stripe.Price.retrieve(price_id)
# #     print("Price details ", price)
# #     product_id = price.product
# #     product = stripe.Product.retrieve(product_id)
# #     return product

# # def handle_payment_finished(data_object, quantiy_serie):
# #     session_id = data_object["id"]
# #     product = get_product(session_id)
# #     credits_granted = product["metadata"]["credits_granted"]
# #     serie_range = product["metadata"]["serie_range"]

# #     plan = None
# #     if product:
# #         plan = product["name"]
# #     print("Plan: ", plan)

# #     customer_id = data_object.get("customer")
# #     print("Customer id: ", customer_id)
# #     if customer_id:
# #         user = get_user_by_customer(customer_id)
# #         amount = data_object.get("amount_total")  / 100
# #         transaction_id = data_object.get("id")
# #         description = "Checkout session completed"
# #         log_transaction(user=user, 
# #                         details=description, 
# #                         amount=amount, 
# #                         transaction_id=transaction_id)
# #         log_user_action(user, "Add credits after upgrading")
# #         restore_membership(user, plan.lower(), credits_granted, serie_range,quantiy_serie, data_object.get("id"))
# #         return JsonResponse({"status": "success"})

# # def handle_customer_deleted(data):
# #     customer_id = data.get("id")
# #     user = get_user_by_customer(customer_id)

# #     try:
# #         if user:
# #             log_user_action(user, "Deleting the customer")
# #             user.delete()
# #             log_user_action(user, "Customer deleted succesfully.")
# #             return JsonResponse({"status": "success"})
# #         return JsonResponse({"status": "No customer found"})
# #     except Exception as e:
# #         return Response({"status": "Error", "error":str(e)}, status=500)  
    
# # def handle_payment_failed(invoice):
# #     customer = invoice["customer"]
# #     transaction_id = invoice["id"]
# #     description = f"Payment for invoice {invoice['number']} failed"
# #     log_transaction(get_user_by_customer(customer), 
# #                     transaction_id=transaction_id, 
# #                     amount=0,details=description)

# # def handle_subscription_delete(data_object):
# #     customer_id = data_object.get("customer")
# #     print("Deleting the customer info ", customer_id)
# #     user = None
# #     try:
# #         if customer_id:
# #             user = get_user_by_customer(customer_id)
# #         if user:
# #             log_user_action(user=user, action="Subscritpion deleted")
# #             restore_membership(user, "free", 1, 0,0, None)
# #             return JsonResponse({"status": "success"})
# #         return JsonResponse({"status": "No customer found"})
# #     except Exception as e:
# #         return Response({"status": "Error", "error":str(e)}, status=404)

# # def get_user_by_customer(id):
# #     profile = UserProfile.objects.filter(stripe_customer=id).first()
# #     user = None
# #     if profile:
# #       user = profile.user
# #     return user

# # def get_credentials_project(project_id, json_data):
# #     return [j for j in json_data if j["web"]["project_id"] == project_id][0]

# # def credentials_to_dict(credentials):
# #   return {'token': credentials.token,
# #           'refresh_token': credentials.refresh_token,
# #           'token_uri': credentials.token_uri,
# #           'client_id': credentials.client_id,
# #           'client_secret': credentials.client_secret}

# # def get_project_id():
# #     return settings.GOOGLE_CLOUD_CREDENTAILS["web"]["project_id"]




# # def download_video(video_url, save_path):
# #     try:
# #         # Send a GET request to download the video
# #         response = requests.get(video_url, stream=True)
# #         if response.status_code == 200:
# #             # Open a file stream and write the video content chunk by chunk
# #             with open(save_path, "wb") as file:
# #                 for chunk in response.iter_content(chunk_size=1024):
# #                     file.write(chunk)
# #             return True
# #         else:
# #             print(f"Failed to download the video. Status code: {response.status_code}")
# #             return False  # Download failed
# #     except Exception as e:
# #         print(f"Error occurred during download: {e}")
# #         return False  # Download failed


# # def remove_file(file_path):
# #     try:
# #         os.remove(file_path)
# #         print(f"File '{file_path}' removed successfully.")
# #     except FileNotFoundError:
# #         print(f"File '{file_path}' does not exist. Skipping removal.")

# # def submit(data):
# #     """Submit the data to Edit API
# #     Parametres :
# #         data (dict) : dict of the metadata
# #     Return :
# #         response from the endpoint or None
# #     """
# #     print("Try to post on AWS API edit:", data)
# #     api_url = f"{settings.BASE_URL_API}submit-job"
# #     try:
# #         response = requests.post(api_url, json=data)
# #         if response.status_code == 200:
# #             return response.json()
# #     except:
# #         return None


# # def generate_unique_filename(ext=".mp4"):
# #     """Generate unique file name
# #     Paramtres :
# #         ext (string) : the extention of the file
# #     Return:
# #         key (string): the full file name with unique name
# #     """
# #     key = str(uuid.uuid4()) + ext
# #     return key


# # def validate_file_size(value):
# #     """Check the file size
# #     Paramtres :
# #         value of the file
# #     """
# #     max_size = settings.FILE_UPLOAD_MAX_MEMORY_SIZE  # 30MB in bytes
# #     if value.size > max_size:
# #         raise ValidationError("File size must not exceed 100MB.")


# # def determine_features(pricings, factor, plan, user):
# #     """Determine the features that the user will have
# #     Parametres :
# #         pricing (dict): the pricing we offer
# #         factor (int) : how many month
# #         plan  (string) : the current plan (basic, free, pro)
# #         user (Django user)
# #     Return :
# #         features (dict): all the features based on the plan and the factor
# #     """
# #     uploaded_counts = (
# #         pricings[settings.DEFAULT_PRICE]["uploaded_counts_limits"] * factor
# #     )
# #     processing_minutes = (
# #         pricings[settings.DEFAULT_PRICE]["processing_minutes_limits"] * factor
# #     )
# #     video_quality = pricings[settings.DEFAULT_PRICE]["video_quality"]
# #     watermark_enabled = pricings[settings.DEFAULT_PRICE]["watermark_enabled"]
# #     if plan.lower() == "free":
# #         watermark_enabled = pricings["Free"]["watermark_enabled"]
# #         uploaded_counts = pricings["Free"]["uploaded_counts_limits"]
# #         video_quality = pricings["Free"]["video_quality"]
# #         processing_minutes = pricings["Free"]["processing_minutes_limits"]
# #     elif plan.lower() == "basic":
# #         uploaded_counts = factor * pricings["Basic"]["uploaded_counts_limits"]
# #         processing_minutes = factor * pricings["Basic"]["processing_minutes_limits"]
# #     features = {
# #         "user": user,
# #         "watermark_enabled": watermark_enabled,
# #         "processing_minutes": 0,
# #         "uploaded_counts": 0,
# #         "processing_minutes_limits": processing_minutes,
# #         "uploaded_counts_limits": uploaded_counts,
# #         "video_quality": video_quality,
# #     }
# #     print("Plan ->", plan, " Features ->", features)
# #     return features


# # def determine_plan(amount, pricings, yearly_discount):
# #     """Determine the plan based on the ammount and the period of the plan
# #     Paramtres :
# #         amount (int): the price
# #         pricing (dict): all the pricing we offer
# #         yearly_discount (float): the discount of year period
# #     Return :
# #         plan (string) : plan name
# #         interval (string): period"""
# #     print("Amount is :", amount)
# #     plan = None
# #     interval = None
# #     if amount == int(pricings["Basic"]["Price"]["Monthly"] * 100):
# #         plan = "Basic"
# #         interval = "monthly"
# #     elif amount == int(pricings["Pro"]["Price"]["Monthly"] * 100):
# #         plan = "Pro"
# #         interval = "monthly"
# #     elif amount == int(pricings["Basic"]["Price"]["Yearly"] * 100):
# #         plan = "Basic"
# #         interval = "yearly"
# #     elif amount == int(
# #         pricings["Pro"]["Price"]["Yearly"] * 100
# #     ):
# #         plan = "Pro"
# #         interval = "yearly"
# #     print("Plan, interval: ", plan, interval)
# #     return plan, interval


# # def restore_membership(user, plan, credits_granted, serie_range, quantiy_serie, stripe_subscription_id):
# #     """Resotre the membership according to the plan"""
# #     print("Plan :", plan)
    
# #     print("The credits granted", credits_granted)
# #     subscription_data = {
# #         "status": "active",
# #         "plan": plan,
# #         "stripe_subscription_id": stripe_subscription_id,
# #     }
# #     Subscription.objects.filter(user=user).update(**subscription_data)
# #     features = {"credits_limits":int(credits_granted), 
# #                 "serie_range":int(serie_range),
# #                 "credits":0,
# #                 "series_limits":int(quantiy_serie) * int(serie_range),
# #                 "series":0,
# #                 "video_quality":settings.PRICINGS[plan]["video_quality"],
# #                 "watermark_enabled":settings.PRICINGS[plan]["watermark_enabled"]
# #         }    
# #     print("Updating the features for the user")
# #     FacelessFeatures.objects.filter(user=user).update(**features)
# #     print("Features created successfully")
