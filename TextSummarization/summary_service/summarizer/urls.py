from django.urls import path
from summarizer.views import SummarizeView, SummarizationStatusView

urlpatterns = [
    path('summarize', SummarizeView.as_view(), name="summarize"),
    path('summarize/status/<int:id>', SummarizationStatusView.as_view(), name="summarize_status"),
]
