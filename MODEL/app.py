from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("askmynotes_classifier.pkl")


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "AskMyNotes Classifier API Running"
    }


@app.post("/predict")
def predict(data: QuestionRequest):

    prediction = model.predict([data.question])[0]

    return {
        "question": data.question,
        "predicted_category": prediction
    }