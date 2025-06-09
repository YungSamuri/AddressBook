from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Household(models.Model):
    name = models.TextField();
    user = models.ForeignKey(User, on_delete=models.CASCADE);


class Contact(models.Model):
    firstName = models.TextField();
    lastName = models.TextField();
    household = models.ForeignKey(Household, on_delete=models.CASCADE);
    addressLine1 = models.TextField();
    addressLine2 = models.TextField();
    city = models.TextField();
    state = models.CharField(max_length=2)
    zip = models.IntegerField();
    country = models.TextField();
    email = models.EmailField();
    cellPhone = models.IntegerField();
    workPhone = models.IntegerField();
    notes = models.TextField();
    user = models.ForeignKey(User, on_delete=models.CASCADE);

