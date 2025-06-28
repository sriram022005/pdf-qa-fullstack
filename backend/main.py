from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, ask
from database import engine
import models

# ✅ Define the FastAPI app FIRST
app = FastAPI()

# ✅ Then add CORS middleware AFTER defining `app`
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create DB tables on startup
models.Base.metadata.create_all(bind=engine)

# ✅ Include routers
app.include_router(upload.router)
app.include_router(ask.router)
