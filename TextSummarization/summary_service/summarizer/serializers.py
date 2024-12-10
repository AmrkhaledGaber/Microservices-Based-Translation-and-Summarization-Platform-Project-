from rest_framework import serializers
from .models import SummarizationTask

class SummarizationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummarizationTask
        fields = "__all__"
