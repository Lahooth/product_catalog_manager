from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Storefront")
app.mount("/", StaticFiles(directory="store", html=True), name="store")
