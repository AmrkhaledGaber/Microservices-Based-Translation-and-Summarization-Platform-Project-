from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SummarizationTask
from .serializers import SummarizationTaskSerializer
from .utils import summarize_text

class SummarizeView(APIView):
    def post(self, request):
        input_text = request.data.get("text")
        style = request.data.get("style", None)

        if not input_text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        task = SummarizationTask.objects.create(input_text=input_text, style=style)

        # Perform summarization (asynchronous tasks can be used in production)
        try:
            summary = summarize_text(input_text, style)
            task.summary = summary
            task.status = "COMPLETED"
            task.save()
        except Exception as e:
            task.status = "FAILED"
            task.save()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(SummarizationTaskSerializer(task).data, status=status.HTTP_201_CREATED)

class SummarizationStatusView(APIView):
    def get(self, request, id):
        try:
            task = SummarizationTask.objects.get(id=id)
            return Response(SummarizationTaskSerializer(task).data)
        except SummarizationTask.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
