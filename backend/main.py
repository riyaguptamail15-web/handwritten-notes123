from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Home route
@app.get("/")
def home():
    return {"message": "Backend is running"}

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OCR model
reader = easyocr.Reader(['en'], gpu=False)

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):

    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")

    result = reader.readtext(np.array(image), detail=0)

    extracted_text = "\n".join(result)

    return {
        "text": extracted_text
    }