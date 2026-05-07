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

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_np = np.array(image)

    # OCR text extraction
    result = reader.readtext(image_np, detail=0, paragraph=True)
    extracted_text = "\n".join(result)

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
        if area > 10000 and w > 80 and h > 80:
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