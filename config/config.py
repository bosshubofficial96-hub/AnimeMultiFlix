"""
AnimeMultiFlix - Base Configuration
Version: 4.0.0 (2026)
"""

import os
from pathlib import Path
from typing import List, Dict, Any, Optional

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    """Base Configuration Class"""

    # ==================== APPLICATION INFO ====================
    APP_NAME: str = 'AnimeMultiFlix'
    APP_SHORT_NAME: str = 'AMF'
    APP_VERSION: str = '4.0.0'
    APP_DESCRIPTION: str = 'Ultimate Anime Streaming Platform with Voice Chat'
    APP_AUTHOR: str = 'AnimeMultiFlix Team'
    APP_LICENSE: str = 'MIT'

    # ==================== ENVIRONMENT ====================
    ENVIRONMENT: str = os.getenv('NODE_ENV', 'development')
    DEBUG: bool = os.getenv('DEBUG', 'false').lower() == 'true'
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'your-super-secret-key-change-me')

    # ==================== SERVER ====================
    PORT: int = int(os.getenv('PORT', 3000))
    HOST: str = os.getenv('HOST', '0.0.0.0')
    API_URL: str = os.getenv('API_URL', 'http://localhost:3000/api')
    FRONTEND_URL: str = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    ADMIN_URL: str = os.getenv('ADMIN_URL', 'http://localhost:3000/admin')
    WS_URL: str = os.getenv('WS_URL', 'ws://localhost:3001')

    # ==================== SSL ====================
    SSL_ENABLED: bool = os.getenv('SSL_ENABLED', 'false').lower() == 'true'
    SSL_CERT: Optional[str] = os.getenv('SSL_CERT')
    SSL_KEY: Optional[str] = os.getenv('SSL_KEY')

    # ==================== TIMEZONE ====================
    TIMEZONE: str = 'Asia/Tokyo'
    LOCALE: str = 'en-US'

    # ==================== FILE PATHS ====================
    UPLOADS_DIR: Path = BASE_DIR / 'uploads'
    TEMP_DIR: Path = BASE_DIR / 'temp'
    LOGS_DIR: Path = BASE_DIR / 'logs'
    BACKUPS_DIR: Path = BASE_DIR / 'backups'
    PUBLIC_DIR: Path = BASE_DIR / 'public'
    CACHE_DIR: Path = BASE_DIR / 'cache'

    # ==================== CORS ====================
    CORS_ORIGINS: List[str] = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8080').split(',')
    CORS_METHODS: List[str] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    CORS_ALLOW_HEADERS: List[str] = [
        'Content-Type', 'Authorization', 'X-Requested-With',
        'Accept', 'Origin', 'X-CSRF-Token', 'X-API-Key'
    ]
    CORS_EXPOSE_HEADERS: List[str] = ['X-Total-Count', 'X-Page', 'X-Total-Pages']
    CORS_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400

    # ==================== RATE LIMITING ====================
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_WINDOW: int = 15 * 60 * 1000  # 15 minutes
    RATE_LIMIT_MAX: int = 100  # requests per window

    # ==================== PAGINATION ====================
    PAGINATION_DEFAULT_LIMIT: int = 20
    PAGINATION_MAX_LIMIT: int = 100

    # ==================== FILE UPLOADS ====================
    MAX_CONTENT_LENGTH: int = 2 * 1024 * 1024 * 1024  # 2GB
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ['mp4', 'mkv', 'avi', 'mov', 'webm']
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    ALLOWED_SUBTITLE_EXTENSIONS: List[str] = ['srt', 'vtt', 'ass']

    # ==================== SESSION ====================
    SESSION_TYPE: str = 'redis'
    SESSION_PERMANENT: bool = True
    SESSION_USE_SIGNER: bool = True
    SESSION_KEY_PREFIX: str = 'amf:session:'
    SESSION_REDIS_URL: Optional[str] = os.getenv('REDIS_URL')

    # ==================== CACHE ====================
    CACHE_TYPE: str = 'redis'
    CACHE_REDIS_URL: Optional[str] = os.getenv('REDIS_URL')
    CACHE_DEFAULT_TIMEOUT: int = 3600  # 1 hour
    CACHE_KEY_PREFIX: str = 'amf:cache:'

    # ==================== LOGGING ====================
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT: str = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOG_FILE: Path = LOGS_DIR / 'app.log'
    LOG_MAX_BYTES: int = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT: int = 10

    # ==================== FEATURE FLAGS ====================
    FEATURE_VOICE_CHAT: bool = True
    FEATURE_WATCH_PARTY: bool = True
    FEATURE_GROUPS: bool = True
    FEATURE_PREMIUM: bool = True
    FEATURE_ANALYTICS: bool = True
    FEATURE_NOTIFICATIONS: bool = True

    # ==================== EXTERNAL SERVICES ====================
    REDIS_URL: Optional[str] = os.getenv('REDIS_URL')
    REDIS_HOST: str = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT: int = int(os.getenv('REDIS_PORT', 6379))
    REDIS_PASSWORD: Optional[str] = os.getenv('REDIS_PASSWORD', 12380)
    REDIS_DB: int = int(os.getenv('REDIS_DB', 0))

    @classmethod
    def create_directories(cls) -> None:
        """Create necessary directories"""
        for directory in [cls.UPLOADS_DIR, cls.TEMP_DIR, cls.LOGS_DIR, 
                         cls.BACKUPS_DIR, cls.CACHE_DIR]:
            directory.mkdir(parents=True, exist_ok=True)

    @classmethod
    def get_redis_url(cls) -> str:
        """Get Redis URL"""
        if cls.REDIS_URL:
            return cls.REDIS_URL
        if cls.REDIS_PASSWORD:
            return f"redis://:{cls.REDIS_PASSWORD}@{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
        return f"redis://{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
