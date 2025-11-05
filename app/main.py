from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import Base, engine
from .api.products import router as products_router

# Create tables for the base schema
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Catalog & Order Manager (FastAPI)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8001", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = BASE_DIR / "web"
app.mount("/web", StaticFiles(directory=str(WEB_DIR), html=True), name="web")

@app.get("/")
def root():
    return {"ok": True, "service": "fastapi-shop"}

app.include_router(products_router)
