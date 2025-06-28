from fastapi import APIRouter, UploadFile, File
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Document

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_data = await file.read()
    db: Session = SessionLocal()

    # Check for duplicates
    existing = db.query(Document).filter(Document.filename == file.filename.strip()).first()
    if existing:
        db.close()
        return {"message": "File already exists", "filename": file.filename}

    doc = Document(
        filename=file.filename.strip(),
        content=file_data
    )
    db.add(doc)
    db.commit()
    db.close()

    print(f"Saved to DB: {file.filename}")
    return {"message": "PDF uploaded and stored in DB", "filename": file.filename}
