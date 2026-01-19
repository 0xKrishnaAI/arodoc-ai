from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Arodoc AI"
    DATABASE_URL: str = "postgresql://arodoc_user:arodoc_password@localhost:5432/arodoc_db"
    SECRET_KEY: str = "supersecretkey" # WARNING: Change this in production! Use a strong env var.
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AIzaSyBD-tvUA5gS0whL44Q-Ep7B0GcGbqETFYc") # Required for AI Analysis
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
