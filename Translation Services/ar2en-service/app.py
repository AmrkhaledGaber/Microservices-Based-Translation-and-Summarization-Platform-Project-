from flask import Flask, request, jsonify
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import torch
import uuid

app = Flask(__name__)

# Load model
model_name = "Helsinki-NLP/opus-mt-ar-en"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
translator = pipeline("translation", model=model, tokenizer=tokenizer, device=-1)  # Run on CPU

# Temporary storage for translations
translation_store = {}

@app.route("/translate/ar2en", methods=["POST"])
def translate_ar_to_en_post():
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        translation = translator(data["text"], max_length=512)
        task_id = str(uuid.uuid4())
        translated_text = translation[0]["translation_text"]

        # Store the translation result
        translation_store[task_id] = translated_text

        return jsonify({
            "task_id": task_id,
            "translated_text": translated_text
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/translate/ar2en/<task_id>", methods=["GET"])
def get_translation_by_id(task_id):
    # Check if the task_id exists in the store
    if task_id not in translation_store:
        return jsonify({"error": "Translation not found"}), 404

    # Return the translation result
    return jsonify({
        "task_id": task_id,
        "translated_text": translation_store[task_id]
    }), 200

if __name__ == "__main__":
    torch.set_num_threads(1)
    app.run(debug=False, host="0.0.0.0", port=5000)
