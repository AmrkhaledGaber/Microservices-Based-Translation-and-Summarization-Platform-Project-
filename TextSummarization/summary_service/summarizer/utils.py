from transformers import pipeline

summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(input_text, style=None):
    # Handle style-specific transformations if needed
    style_options = {
        "formal": "...",  # Placeholder: Add model tweaks or keywords if needed.
        "informal": "...",
        "technical": "..."
    }
    if style and style in style_options:
        input_text = f"{style_options[style]} {input_text}"

    summary = summarization_pipeline(input_text, max_length=130, min_length=30, do_sample=False)
    return summary[0]['summary_text']
