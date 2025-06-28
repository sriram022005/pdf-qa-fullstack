from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from datetime import datetime
from database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True)
    content = Column(LargeBinary)
    upload_date = Column(DateTime, default=datetime.utcnow)
