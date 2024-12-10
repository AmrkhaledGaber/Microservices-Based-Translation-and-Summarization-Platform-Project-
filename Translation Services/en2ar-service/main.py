from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uuid

app = FastAPI()

class TranslationRequest(BaseModel):
    text: str

# Temporary storage for translations
translation_store = {}
#http://0.0.0.0:3000/translate/en2ar
@app.post("/translate/en2ar")
async def translate_en_to_ar(request: TranslationRequest):
    try:
        # Generate a unique task_id
        task_id = str(uuid.uuid4())
        
        # Perform translation
        translation = translator(request.text)
        translated_text = translation[0]["translation_text"]
        
        # Store the translation result
        translation_store[task_id] = translated_text
        
        return {
            "task_id": task_id,
            "translated_text": translated_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
#http://0.0.0.0:3000/translate/en2ar/

@app.get("/translate/en2ar/{task_id}")
async def get_translation_by_id(task_id: str):
    # Check if the task_id exists
    if task_id not in translation_store:
        raise HTTPException(status_code=404, detail="Translation not found")
    
    # Return the translation result
    return {
        "task_id": task_id,
        "translated_text": translation_store[task_id]
    }

if __name__ == "__main__":
    import uvicorn
    translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-ar")
    uvicorn.run(app, host="0.0.0.0", port=3000)
