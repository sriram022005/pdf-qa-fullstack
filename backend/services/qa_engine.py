from sqlalchemy.orm import Session
from database import SessionLocal
from models import Document
import fitz  # PyMuPDF
import io

from openai import OpenAI
client = OpenAI(
    api_key="",
    base_url="https://openrouter.ai/api/v1"
)

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        return "\n".join([page.get_text() for page in doc])

def build_index_and_answer(filename: str, question: str) -> str:
    db: Session = SessionLocal()
    doc = db.query(Document).filter(Document.filename == filename.strip()).first()
    db.close()

    print(f"Searching for PDF: {filename}")
    if not doc:
        return "Error: PDF not found in database"

    pdf_text = extract_text_from_pdf_bytes(doc.content)

    prompt = f"""Answer this question using the content below:\n\n{pdf_text[:3000]}\n\nQ: {question}\nA:"""

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error from OpenRouter: {str(e)}"
