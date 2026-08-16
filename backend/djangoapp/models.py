from django.db import models


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="car_models")
    name = models.CharField(max_length=100)
    dealer_id = models.IntegerField()
    year = models.IntegerField()

    def __str__(self):
        return f"{self.make.name} {self.name} ({self.year})"
