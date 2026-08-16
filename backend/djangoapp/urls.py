from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views

urlpatterns = [
    path("dealerships", views.dealerships, name="dealerships"),
    path("dealerships/<int:id>/", views.dealership_detail, name="dealership_detail"),
    path("dealer/<int:id>/reviews", views.dealer_reviews, name="dealer_reviews"),
    path("dealer/<int:id>/review", views.add_review, name="add_review"),
    path("register", views.register, name="register"),
    path("login", TokenObtainPairView.as_view(), name="login"),
    path("sentiment", views.sentiment, name="sentiment"),
    path("carmakes", views.car_makes, name="car_makes"),
]
