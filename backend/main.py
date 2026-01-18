from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, health, analysis, emergency
from . import models, database

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Arodoc AI API", version="1.0.0")

# CORS Middleware
origins = [
    "http://localhost:5173",  # React Default
    "http://localhost:3000",
    "https://*.onrender.com",  # Render deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(emergency.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Arodoc AI API"}
