from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the directory where config.py is located (backend folder)
BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Arodoc AI"
    DATABASE_URL: str = "sqlite:///./arodoc.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    GEMINI_API_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Twilio SMS Configuration (Optional)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = 'utf-8'
        extra = 'ignore'

settings = Settings()

