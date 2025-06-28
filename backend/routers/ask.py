from fastapi import APIRouter
from pydantic import BaseModel
from services.qa_engine import build_index_and_answer

router = APIRouter()

class AskRequest(BaseModel):
    filename: str
    question: str

@router.post("/ask")
def ask_question(payload: AskRequest):
    return {"answer": build_index_and_answer(payload.filename, payload.question)}