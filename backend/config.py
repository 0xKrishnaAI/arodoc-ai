from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Arodoc AI"
    DATABASE_URL: str = "sqlite:///./arodoc.db" # Default to SQLite for easy local demo. Use Postgres for production.
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")  # REQUIRED in production!
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")  # Required for AI Analysis
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Twilio SMS Configuration (Optional - user provides their own credentials)
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: Optional[str] = os.getenv("TWILIO_PHONE_NUMBER")

    class Config:
        env_file = ".env"

settings = Settings()

