from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Arodoc AI"
    DATABASE_URL: str = "sqlite:///./arodoc.db" # Default to SQLite for easy local demo. Use Postgres for production.
    SECRET_KEY: str = os.getenv("SECRET_KEY")  # REQUIRED: Set this in environment variables!
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")  # Required for AI Analysis
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
