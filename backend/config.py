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
    
    # Email SMTP Configuration (Primary notification method)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")  # Your email address
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")  # App password for Gmail
    
    # Twilio SMS Configuration (Optional - for future use)
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: Optional[str] = os.getenv("TWILIO_PHONE_NUMBER")

    class Config:
        env_file = ".env"

settings = Settings()
