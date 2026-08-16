from django.db import migrations


def seed_data(apps, schema_editor):
    CarMake = apps.get_model("djangoapp", "CarMake")
    for name in ("Audi", "BMW", "Ford", "Honda", "Hyundai", "Kia", "Mercedes-Benz", "Toyota", "Volkswagen", "Volvo"):
        CarMake.objects.get_or_create(name=name, description=f"{name} vehicles")


class Migration(migrations.Migration):
    dependencies = [
        ("djangoapp", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_data, migrations.RunPython.noop),
    ]
