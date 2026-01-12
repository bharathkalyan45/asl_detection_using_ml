from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

# ---------------- APP ----------------
app = FastAPI(title="ASL FastAPI Backend")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

import joblib

label_encoder = joblib.load("label_encoder.pkl")

# ---------------- STATIC FILES ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.mount("/css", StaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")

# ---------------- LOAD MODEL ----------------
model = tf.keras.models.load_model("asl_cnn_model.h5")

print("Model output classes:", model.output_shape[-1])
print("LabelEncoder classes:", len(label_encoder.classes_))
print("Classes:", label_encoder.classes_)

# ---------------- ROUTES ----------------
@app.get("/", response_class=HTMLResponse)
def home():
    with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as f:
        return f.read()

from fastapi import HTTPException

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    if len(contents) < 1000:
        raise HTTPException(status_code=400, detail="Invalid image")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupted image")

    image = image.resize((64, 64))
    img = np.array(image) / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    idx = int(np.argmax(preds))
    prediction = label_encoder.inverse_transform([idx])[0]


    confidence = float(preds[0][idx])

    return {
        "prediction": prediction,
        "confidence": round(confidence, 3)
    }