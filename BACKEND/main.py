from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os


app = FastAPI(
    title="AskMyNotes Backend API",
    description="Backend API for AskMyNotes",
    version="1.0.0",
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# MODEL URL
# =========================

MODEL_URL = os.getenv(
    "MODEL_URL",
    "http://model:7860"
)


# =========================
# REQUEST / RESPONSE
# =========================

class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    question: str
    answer: str


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "AskMyNotes backend is running"
    }


# =========================
# HEALTH
# =========================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# =========================
# ASK QUESTION
# =========================

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):

    cleaned_question = request.question.strip()

    if not cleaned_question:
        return QuestionResponse(
            question="",
            answer="Please enter a question."
        )

    try:

        # Send question to ML model
        async with httpx.AsyncClient() as client:

            response = await client.post(
                f"{MODEL_URL}/predict",
                json={
                    "question": cleaned_question
                },
                timeout=60.0
            )

        response.raise_for_status()

        model_data = response.json()

        predicted_category = model_data.get(
            "predicted_category",
            "Unknown"
        )

        return QuestionResponse(
            question=cleaned_question,
            answer=predicted_category
        )

    except Exception as e:

        print("Model connection error:", e)

        return QuestionResponse(
            question=cleaned_question,
            answer="Unable to connect to the ML model."
        )