"""
Configuration management for QRadar Rule Editor
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "QRadar Rule Test Stack Editor"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # API
    API_PREFIX: str = "/api"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./qradar_editor.db"
    
    # File Storage
    RULES_DIR: str = "./data/rules"
    BUILDING_BLOCKS_DIR: str = "./data/building_blocks"
    TEMPLATES_DIR: str = "./data/templates"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    # Limits
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_EVENTS_PER_TEST: int = 10000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
