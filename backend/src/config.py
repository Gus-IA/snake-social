import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # Database configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./snake_social.db"
    )
    
    # Adjust for SQLite to use check_same_thread=False
    @property
    def connect_args(self) -> dict:
        if self.DATABASE_URL.startswith("sqlite"):
            return {"check_same_thread": False}
        return {}

# Global settings instance
settings = Settings()
