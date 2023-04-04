from django.db import models
from jsonfield import JSONField


class Case(models.Model):
    class Meta: 
        ordering = ['-date_uploaded']

    csv_file = models.FileField(upload_to="csv-files")
    model = models.FileField(upload_to="models")
    model_details = JSONField(null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.date_uploaded)