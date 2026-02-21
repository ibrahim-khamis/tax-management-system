from django.contrib import admin
from .models import User, Business, Payment

admin.site.register(User)
admin.site.register(Business)
admin.site.register(Payment)


# Register your models here.
