from django.db import models

class SummarizationTask(models.Model):
    input_text = models.TextField()
    summary = models.TextField(null=True, blank=True)
    style = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=20, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
