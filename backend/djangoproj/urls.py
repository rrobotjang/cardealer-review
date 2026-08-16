from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("djangoapp.urls")),
    # Frontend pages (served by the Django BFF)
    path("", TemplateView.as_view(template_name="index.html"), name="index"),
    path("about/", TemplateView.as_view(template_name="about.html"), name="about"),
    path("contact/", TemplateView.as_view(template_name="contact.html"), name="contact"),
    path("dealers/", TemplateView.as_view(template_name="dealers.html"), name="dealers"),
    path("dealer/", TemplateView.as_view(template_name="dealer_details.html"), name="dealer_details"),
    path("postreview/", TemplateView.as_view(template_name="postreview.html"), name="postreview"),
]
