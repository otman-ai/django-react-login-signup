from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = []
if settings.DEBUG:
    urlpatterns = [
        path("admin/", admin.site.urls) ,
        path("auth/", include("authentificationapp.urls")),

    ]
else:

    urlpatterns = [
        path("auth/", include("authentificationapp.urls")),
    ]