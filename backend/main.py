from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import numpy as np
import io
import cv2
import base64

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

def clean_ocr_text(text):
    junk_words = [
        "page view",
        "read aloud",
        "draw",
        "jocudocun",
        "document",
        "browser",
        "toolbar"
    ]

    lines = text.split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()

        if len(line) < 3:
            continue

        if any(junk in line.lower() for junk in junk_words):
            continue

        cleaned.append(line)

    return "\n".join(cleaned)

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_np = np.array(image)

    # OCR text extraction
    result = reader.readtext(image_np, detail=0, paragraph=True)
    raw_text = "\n".join(result)
    extracted_text = clean_ocr_text(raw_text)   

    # Convert image for OpenCV
    cv_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

    # Threshold image
    thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)[1]

    # Find connected components / contours
    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    diagram_crops = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        area = w * h

        # This filters bigger objects like diagrams/images
        aspect_ratio = w / h

        # likely actual diagram/image region
        if (
             area > 15000 and
              w > 120 and
              h > 120 and
              0.5 < aspect_ratio < 2.5 and
              w < cv_image.shape[1] * 0.8 and
              h < cv_image.shape[0] * 0.8
            ):

            crop = cv_image[y:y+h, x:x+w]

            _, buffer = cv2.imencode(".png", crop)
            crop_base64 = base64.b64encode(buffer).decode("utf-8")

            diagram_crops.append({
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "image": crop_base64
            })

    return {
        "text": extracted_text,
        "diagrams": diagram_crops
    }