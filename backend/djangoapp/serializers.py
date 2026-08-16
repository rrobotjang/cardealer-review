from django.contrib.auth.models import User
from rest_framework import serializers

from .models import CarMake, CarModel


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"],
        )
        return user


class CarMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMake
        fields = ("id", "name", "description")


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = ("id", "name", "make", "dealer_id", "year")
