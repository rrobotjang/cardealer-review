from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("djangoapp.urls")),
    # React SPA: every non-API/admin/static path renders the built index.html;
    # client-side routing (react-router) takes over from there.
    re_path(
        r"^(?!admin|api|static).*",
        TemplateView.as_view(template_name="index.html"),
        name="index",
    ),
]
