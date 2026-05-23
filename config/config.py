"""
AnimeMultiFlix - Main Configuration File
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
import secrets
from pathlib import Path
from typing import List, Dict, Any, Optional, Union
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    """Main Configuration Class - All Settings"""
    
    # ==================== APPLICATION SETTINGS ====================
    APP_NAME: str = "AnimeMultiFlix"
    APP_SHORT_NAME: str = "AMF"
    APP_VERSION: str = "4.0.0"
    APP_DESCRIPTION: str = "Ultimate Anime Streaming Platform with Voice Chat, Groups & Premium Features"
    APP_AUTHOR: str = "AnimeMultiFlix Team"
    APP_LICENSE: str = "MIT"
    APP_COPYRIGHT: str = "© 2026 AnimeMultiFlix. All rights reserved."
    
    # ==================== ENVIRONMENT ====================
    ENVIRONMENT: str = os.getenv("NODE_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    API_VERSION: str = "v1"
    
    # ==================== SERVER SETTINGS ====================
    PORT: int = int(os.getenv("PORT", 3000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    API_URL: str = os.getenv("API_URL", f"http://localhost:{PORT}/api")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", f"http://localhost:{PORT}")
    ADMIN_URL: str = os.getenv("ADMIN_URL", f"http://localhost:{PORT}/admin")
    WS_URL: str = os.getenv("WS_URL", f"ws://localhost:{PORT + 1}")
    
    # ==================== SSL/TLS ====================
    SSL_ENABLED: bool = os.getenv("SSL_ENABLED", "false").lower() == "true"
    SSL_CERT: Optional[str] = os.getenv("SSL_CERT")
    SSL_KEY: Optional[str] = os.getenv("SSL_KEY")
    
    # ==================== TIMEZONE & LOCALIZATION ====================
    TIMEZONE: str = "Asia/Tokyo"
    LOCALE: str = "en-US"
    DATE_FORMAT: str = "%Y-%m-%d"
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    
    # ==================== FILE PATHS ====================
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    TEMP_DIR: Path = BASE_DIR / "temp"
    LOGS_DIR: Path = BASE_DIR / "logs"
    BACKUPS_DIR: Path = BASE_DIR / "backups"
    PUBLIC_DIR: Path = BASE_DIR / "public"
    CACHE_DIR: Path = BASE_DIR / "cache"
    CERT_DIR: Path = BASE_DIR / "certs"
    
    # ==================== FILE UPLOAD LIMITS ====================
    MAX_CONTENT_LENGTH: int = 2 * 1024 * 1024 * 1024  # 2GB
    MAX_VIDEO_SIZE: int = 2 * 1024 * 1024 * 1024      # 2GB
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024            # 10MB
    MAX_AUDIO_SIZE: int = 50 * 1024 * 1024            # 50MB
    MAX_SUBTITLE_SIZE: int = 2 * 1024 * 1024          # 2MB
    MAX_DOCUMENT_SIZE: int = 25 * 1024 * 1024         # 25MB
    
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ["mp4", "mkv", "avi", "mov", "webm", "flv", "m3u8", "ts"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"]
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["mp3", "wav", "ogg", "m4a", "flac", "aac"]
    ALLOWED_SUBTITLE_EXTENSIONS: List[str] = ["srt", "vtt", "ass", "ssa", "sbv"]
    ALLOWED_DOCUMENT_EXTENSIONS: List[str] = ["pdf", "doc", "docx", "txt", "md", "json", "xml"]
    
    # ==================== CORS SETTINGS ====================
    CORS_ENABLED: bool = True
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
    CORS_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
    CORS_ALLOW_HEADERS: List[str] = [
        "Content-Type", "Authorization", "X-Requested-With", "Accept", 
        "Origin", "X-CSRF-Token", "X-API-Key", "X-Session-Token"
    ]
    CORS_EXPOSE_HEADERS: List[str] = [
        "X-Total-Count", "X-Page", "X-Total-Pages", "X-Per-Page", 
        "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"
    ]
    CORS_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400
    
    # ==================== RATE LIMITING ====================
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_WINDOW: int = 15 * 60 * 1000  # 15 minutes in milliseconds
    RATE_LIMIT_MAX: int = 100                # requests per window
    RATE_LIMIT_SKIP_SUCCESSFUL: bool = False
    RATE_LIMIT_SKIP_FAILED: bool = False
    
    # Specific endpoint rate limits
    RATE_LIMIT_LOGIN: int = 5                # 5 attempts per 15 minutes
    RATE_LIMIT_REGISTER: int = 3             # 3 attempts per hour
    RATE_LIMIT_API: int = 100                # 100 requests per minute
    RATE_LIMIT_UPLOAD: int = 10              # 10 uploads per hour
    
    # ==================== PAGINATION ====================
    PAGINATION_DEFAULT_LIMIT: int = 20
    PAGINATION_MAX_LIMIT: int = 100
    PAGINATION_DEFAULT_PAGE: int = 1
    
    # ==================== CACHE SETTINGS ====================
    CACHE_ENABLED: bool = os.getenv("CACHE_ENABLED", "true").lower() == "true"
    CACHE_TYPE: str = os.getenv("CACHE_TYPE", "redis")  # redis, memory, file
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", 3600))   # 1 hour
    CACHE_KEY_PREFIX: str = "amf:cache:"
    CACHE_MAX_ITEMS: int = 10000
    
    # Cache TTL by endpoint
    CACHE_TTL_ANIME_LIST: int = 3600        # 1 hour
    CACHE_TTL_ANIME_DETAIL: int = 7200      # 2 hours
    CACHE_TTL_EPISODE: int = 1800           # 30 minutes
    CACHE_TTL_USER: int = 300               # 5 minutes
    CACHE_TTL_GROUP: int = 600              # 10 minutes
    CACHE_TTL_TRENDING: int = 900           # 15 minutes
    
    # ==================== SESSION SETTINGS ====================
    SESSION_ENABLED: bool = True
    SESSION_TYPE: str = "redis"             # redis, memory, mongodb
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", secrets.token_urlsafe(32))
    SESSION_COOKIE_NAME: str = "amf_session"
    SESSION_COOKIE_SECURE: bool = SSL_ENABLED or ENVIRONMENT == "production"
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"
    SESSION_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    SESSION_PERMANENT: bool = True
    SESSION_USE_SIGNER: bool = True
    SESSION_KEY_PREFIX: str = "amf:session:"
    SESSION_REDIS_URL: Optional[str] = os.getenv("REDIS_URL")
    
    # ==================== LOGGING ====================
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    LOG_FILE: Path = LOGS_DIR / "app.log"
    LOG_ERROR_FILE: Path = LOGS_DIR / "error.log"
    LOG_ACCESS_FILE: Path = LOGS_DIR / "access.log"
    LOG_MAX_BYTES: int = 10 * 1024 * 1024    # 10MB
    LOG_BACKUP_COUNT: int = 10
    LOG_CONSOLE: bool = ENVIRONMENT != "production"
    
    # ==================== DATABASE ====================
    # MongoDB
    MONGODB_ENABLED: bool = True
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/anime_multiflix")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "anime_multiflix")
    MONGODB_USER: Optional[str] = os.getenv("MONGODB_USER")
    MONGODB_PASSWORD: Optional[str] = os.getenv("MONGODB_PASSWORD")
    MONGODB_HOST: str = os.getenv("MONGODB_HOST", "localhost")
    MONGODB_PORT: int = int(os.getenv("MONGODB_PORT", 27017))
    MONGODB_POOL_SIZE: int = int(os.getenv("MONGODB_POOL_SIZE", 10))
    MONGODB_MIN_POOL_SIZE: int = int(os.getenv("MONGODB_MIN_POOL_SIZE", 1))
    MONGODB_MAX_IDLE_TIME: int = int(os.getenv("MONGODB_MAX_IDLE_TIME", 30000))
    MONGODB_CONNECT_TIMEOUT: int = int(os.getenv("MONGODB_CONNECT_TIMEOUT", 10000))
    MONGODB_SOCKET_TIMEOUT: int = int(os.getenv("MONGODB_SOCKET_TIMEOUT", 45000))
    MONGODB_SERVER_SELECTION_TIMEOUT: int = int(os.getenv("MONGODB_SERVER_SELECTION_TIMEOUT", 30000))
    MONGODB_HEARTBEAT_FREQUENCY: int = int(os.getenv("MONGODB_HEARTBEAT_FREQUENCY", 10000))
    MONGODB_RETRY_WRITES: bool = True
    MONGODB_RETRY_READS: bool = True
    MONGODB_SSL: bool = os.getenv("MONGODB_SSL", "false").lower() == "true"
    MONGODB_SSL_CA: Optional[str] = os.getenv("MONGODB_SSL_CA")
    MONGODB_AUTH_SOURCE: str = os.getenv("MONGODB_AUTH_SOURCE", "admin")
    
    # Redis
    REDIS_ENABLED: bool = os.getenv("REDIS_ENABLED", "true").lower() == "true"
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    REDIS_DB: int = int(os.getenv("REDIS_DB", 0))
    REDIS_KEY_PREFIX: str = "amf:"
    REDIS_TTL: int = int(os.getenv("REDIS_TTL", 3600))
    REDIS_SOCKET_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_TIMEOUT", 5))
    REDIS_SOCKET_CONNECT_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_CONNECT_TIMEOUT", 5))
    REDIS_RETRY_ON_TIMEOUT: bool = True
    REDIS_MAX_RETRIES: int = 3
    REDIS_RETRY_BACKOFF: int = 100
    
    # PostgreSQL
    POSTGRES_ENABLED: bool = os.getenv("POSTGRES_ENABLED", "false").lower() == "true"
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "anime_multiflix")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_SSL: bool = os.getenv("POSTGRES_SSL", "false").lower() == "true"
    POSTGRES_POOL_SIZE: int = int(os.getenv("POSTGRES_POOL_SIZE", 20))
    POSTGRES_MAX_OVERFLOW: int = int(os.getenv("POSTGRES_MAX_OVERFLOW", 40))
    POSTGRES_POOL_TIMEOUT: int = int(os.getenv("POSTGRES_POOL_TIMEOUT", 30))
    POSTGRES_POOL_RECYCLE: int = int(os.getenv("POSTGRES_POOL_RECYCLE", 3600))
    POSTGRES_POOL_PRE_PING: bool = True
    POSTGRES_ECHO: bool = False
    
    # ==================== JWT AUTHENTICATION ====================
    JWT_SECRET: str = os.getenv("JWT_SECRET", secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: int = 7 * 24 * 60 * 60      # 7 days
    JWT_REFRESH_EXPIRES_IN: int = 30 * 24 * 60 * 60  # 30 days
    JWT_TOKEN_TYPE: str = "Bearer"
    JWT_AUDIENCE: str = "animemultiflix-api"
    JWT_ISSUER: str = "animemultiflix"
    
    # ==================== OAuth Providers ====================
    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "/api/auth/google/callback")
    GOOGLE_SCOPES: List[str] = ["email", "profile"]
    
    # Discord OAuth
    DISCORD_CLIENT_ID: str = os.getenv("DISCORD_CLIENT_ID", "")
    DISCORD_CLIENT_SECRET: str = os.getenv("DISCORD_CLIENT_SECRET", "")
    DISCORD_REDIRECT_URI: str = os.getenv("DISCORD_REDIRECT_URI", "/api/auth/discord/callback")
    DISCORD_SCOPES: List[str] = ["identify", "email"]
    
    # Facebook OAuth
    FACEBOOK_CLIENT_ID: str = os.getenv("FACEBOOK_CLIENT_ID", "")
    FACEBOOK_CLIENT_SECRET: str = os.getenv("FACEBOOK_CLIENT_SECRET", "")
    FACEBOOK_REDIRECT_URI: str = os.getenv("FACEBOOK_REDIRECT_URI", "/api/auth/facebook/callback")
    FACEBOOK_SCOPES: List[str] = ["email", "public_profile"]
    
    # Apple OAuth
    APPLE_CLIENT_ID: str = os.getenv("APPLE_CLIENT_ID", "")
    APPLE_TEAM_ID: str = os.getenv("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.getenv("APPLE_KEY_ID", "")
    APPLE_PRIVATE_KEY: str = os.getenv("APPLE_PRIVATE_KEY", "")
    APPLE_REDIRECT_URI: str = os.getenv("APPLE_REDIRECT_URI", "/api/auth/apple/callback")
    APPLE_SCOPES: List[str] = ["name", "email"]
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI: str = os.getenv("GITHUB_REDIRECT_URI", "/api/auth/github/callback")
    GITHUB_SCOPES: List[str] = ["user:email"]
    
    # ==================== TWO-FACTOR AUTHENTICATION ====================
    TFA_ENABLED: bool = os.getenv("TFA_ENABLED", "true").lower() == "true"
    TFA_ISSUER: str = "AnimeMultiFlix"
    TFA_ALGORITHM: str = "SHA1"
    TFA_DIGITS: int = 6
    TFA_PERIOD: int = 30
    TFA_BACKUP_CODES: int = 10
    
    # ==================== OTP SETTINGS ====================
    OTP_LENGTH: int = 6
    OTP_EXPIRY: int = 10 * 60  # 10 minutes
    OTP_DELIVERY: List[str] = ["email", "sms"]
    
    # ==================== PASSWORD POLICY ====================
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_MAX_LENGTH: int = 32
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    PASSWORD_BCRYPT_ROUNDS: int = 12
    PASSWORD_HISTORY_COUNT: int = 5
    PASSWORD_EXPIRY_DAYS: int = 90
    
    # ==================== EMAIL SETTINGS ====================
    EMAIL_ENABLED: bool = os.getenv("EMAIL_ENABLED", "true").lower() == "true"
    EMAIL_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    EMAIL_PORT: int = int(os.getenv("SMTP_PORT", 587))
    EMAIL_USE_TLS: bool = os.getenv("SMTP_TLS", "true").lower() == "true"
    EMAIL_USE_SSL: bool = os.getenv("SMTP_SSL", "false").lower() == "true"
    EMAIL_HOST_USER: str = os.getenv("SMTP_USER", "")
    EMAIL_HOST_PASSWORD: str = os.getenv("SMTP_PASS", "")
    EMAIL_DEFAULT_FROM: str = os.getenv("EMAIL_FROM", "noreply@animemultiflix.com")
    EMAIL_DEFAULT_REPLY_TO: str = os.getenv("EMAIL_REPLY_TO", "support@animemultiflix.com")
    EMAIL_TEMPLATE_DIR: Path = BASE_DIR / "templates" / "email"
    
    # ==================== SMS SETTINGS ====================
    SMS_ENABLED: bool = os.getenv("SMS_ENABLED", "false").lower() == "true"
    SMS_PROVIDER: str = os.getenv("SMS_PROVIDER", "twilio")
    SMS_TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    SMS_TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    SMS_TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")
    SMS_VONAGE_API_KEY: str = os.getenv("VONAGE_API_KEY", "")
    SMS_VONAGE_API_SECRET: str = os.getenv("VONAGE_API_SECRET", "")
    SMS_VONAGE_FROM_NUMBER: str = os.getenv("VONAGE_FROM_NUMBER", "")
    
    # ==================== PAYMENT SETTINGS ====================
    PAYMENT_CURRENCY: str = "USD"
    PAYMENT_TAX_RATE: float = 0.0
    PAYMENT_TAX_NAME: str = "Tax"
    
    # Stripe
    STRIPE_ENABLED: bool = os.getenv("STRIPE_ENABLED", "false").lower() == "true"
    STRIPE_PUBLIC_KEY: str = os.getenv("STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # PayPal
    PAYPAL_ENABLED: bool = os.getenv("PAYPAL_ENABLED", "false").lower() == "true"
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live
    
    # Razorpay
    RAZORPAY_ENABLED: bool = os.getenv("RAZORPAY_ENABLED", "false").lower() == "true"
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    
    # ==================== PREMIUM PLANS ====================
    PREMIUM_PLANS: Dict[str, Dict] = {
        "free": {
            "name": "Free",
            "price": 0,
            "price_id": "price_free",
            "features": ["Basic access", "480p quality", "Ads supported", "1 device"],
            "limits": {
                "quality": "480p",
                "devices": 1,
                "downloads": False,
                "ads": True,
                "watch_party_size": 5,
                "group_size": 100,
                "voice_quality": "standard"
            }
        },
        "basic": {
            "name": "Basic",
            "price": 4.99,
            "price_id": "price_basic",
            "features": ["No ads", "1080p quality", "Download support", "2 devices"],
            "limits": {
                "quality": "1080p",
                "devices": 2,
                "downloads": True,
                "ads": False,
                "watch_party_size": 20,
                "group_size": 500,
                "voice_quality": "high"
            }
        },
        "pro": {
            "name": "Pro",
            "price": 9.99,
            "price_id": "price_pro",
            "features": ["4K Ultra HD", "5 devices", "Early access", "Priority support"],
            "limits": {
                "quality": "4k",
                "devices": 5,
                "downloads": True,
                "ads": False,
                "watch_party_size": 100,
                "group_size": 2000,
                "voice_quality": "hd"
            }
        },
        "ultimate": {
            "name": "Ultimate",
            "price": 14.99,
            "price_id": "price_ultimate",
            "features": ["4K HDR", "10 devices", "Family sharing", "Exclusive content"],
            "limits": {
                "quality": "4k",
                "devices": 10,
                "downloads": True,
                "ads": False,
                "watch_party_size": 500,
                "group_size": 5000,
                "voice_quality": "ultra-hd"
            }
        },
        "family": {
            "name": "Family",
            "price": 19.99,
            "price_id": "price_family",
            "features": ["5 profiles", "Parental controls", "Kids mode", "Family sharing"],
            "limits": {
                "quality": "4k",
                "devices": 15,
                "downloads": True,
                "ads": False,
                "watch_party_size": 500,
                "group_size": 5000,
                "voice_quality": "ultra-hd",
                "profiles": 5
            }
        }
    }
    
    PREMIUM_DISCOUNTS: Dict[str, float] = {
        "yearly": 0.20,      # 20% off
        "student": 0.50,     # 50% off
        "referral": 0.10,    # 10% off
        "promo": 0.15        # 15% off
    }
    
    PREMIUM_TRIAL_DAYS: int = 7
    
    # ==================== VOICE CHAT SETTINGS ====================
    VOICE_WEBRTC_ICE_SERVERS: List[Dict] = [
        {"urls": "stun:stun.l.google.com:19302"},
        {"urls": "stun:stun1.l.google.com:19302"},
        {"urls": "stun:stun2.l.google.com:19302"},
        {"urls": "stun:stun3.l.google.com:19302"},
        {"urls": "stun:stun4.l.google.com:19302"},
    ]
    VOICE_ROOM_MAX_PARTICIPANTS: int = 50
    VOICE_ROOM_MAX_DURATION: int = 3600  # 1 hour
    VOICE_AUTO_DELETE_EMPTY_ROOMS: bool = True
    VOICE_RECORDING_ENABLED: bool = False
    VOICE_AUDIO_SAMPLE_RATE: int = 48000
    VOICE_AUDIO_CHANNELS: int = 1
    VOICE_ECHO_CANCELLATION: bool = True
    VOICE_NOISE_SUPPRESSION: bool = True
    VOICE_AUTO_GAIN_CONTROL: bool = True
    
    # ==================== GROUP CHAT SETTINGS (Telegram-like) ====================
    GROUP_MAX_MEMBERS: Dict[str, int] = {
        "free": 100,
        "premium": 500,
        "ultimate": 2000
    }
    GROUP_MAX_PER_USER: Dict[str, int] = {
        "free": 10,
        "premium": 50,
        "ultimate": 200
    }
    GROUP_MAX_ADMINS: int = 20
    GROUP_INVITE_LINK_EXPIRY: int = 7 * 24 * 60 * 60  # 7 days
    GROUP_INVITE_MAX_USES: int = 100
    GROUP_MESSAGE_RETENTION_DAYS: int = 90
    GROUP_MEDIA_RETENTION_DAYS: int = 30
    
    # ==================== CHAT SETTINGS (WhatsApp-like) ====================
    CHAT_MAX_MESSAGE_LENGTH: int = 5000
    CHAT_MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    CHAT_MESSAGE_EDIT_WINDOW: int = 60 * 60  # 1 hour
    CHAT_MESSAGE_DELETE_WINDOW: int = 60 * 60  # 1 hour
    CHAT_TYPING_INDICATOR: bool = True
    CHAT_READ_RECEIPTS: bool = True
    CHAT_LAST_SEEN: bool = True
    CHAT_MESSAGE_REACTIONS: bool = True
    CHAT_VOICE_MESSAGES: bool = True
    
    # ==================== STREAMING SETTINGS (Crunchyroll-like) ====================
    STREAMING_VIDEO_QUALITIES: List[str] = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p", "4320p"]
    STREAMING_DEFAULT_QUALITY: str = "720p"
    STREAMING_ADAPTIVE_BITRATE: bool = True
    STREAMING_HLS_ENABLED: bool = True
    STREAMING_HLS_SEGMENT_DURATION: int = 6
    STREAMING_HLS_MAX_SEGMENTS: int = 10
    STREAMING_DASH_ENABLED: bool = True
    STREAMING_DASH_SEGMENT_DURATION: int = 4
    STREAMING_TRANSCODING_ENABLED: bool = True
    STREAMING_CDN_ENABLED: bool = False
    STREAMING_CDN_URL: str = ""
    
    # ==================== SUBTITLE SETTINGS ====================
    SUBTITLE_SUPPORTED_FORMATS: List[str] = ["srt", "vtt", "ass", "ssa"]
    SUBTITLE_MAX_SIZE: int = 10 * 1024 * 1024  # 10MB
    SUBTITLE_LANGUAGES: List[str] = [
        "en", "ja", "es", "fr", "de", "zh", "ko", "ar", 
        "hi", "pt", "ru", "it", "tr", "vi", "th", "id"
    ]
    SUBTITLE_DEFAULT_LANGUAGE: str = "en"
    SUBTITLE_AUTO_GENERATE: bool = False
    
    # ==================== ADMIN SETTINGS ====================
    ADMIN_DASHBOARD_THEME: str = "dark"
    ADMIN_ITEMS_PER_PAGE: int = 50
    ADMIN_REFRESH_INTERVAL: int = 30000  # 30 seconds
    ADMIN_SESSION_TIMEOUT: int = 3600  # 1 hour
    ADMIN_MAX_LOGIN_ATTEMPTS: int = 5
    ADMIN_LOCKOUT_DURATION: int = 900  # 15 minutes
    ADMIN_REQUIRE_2FA: bool = False
    ADMIN_AUTO_BACKUP: bool = True
    ADMIN_BACKUP_FREQUENCY: str = "daily"
    ADMIN_BACKUP_TIME: str = "02:00"
    ADMIN_BACKUP_RETENTION: int = 30  # days
    
    # ==================== OWNER SETTINGS ====================
    OWNER_EMAIL: str = "owner@animemultiflix.com"
    OWNER_GMAIL: str = "animemultiflix.owner@gmail.com"
    OWNER_USERNAME: str = "animemultiflix_owner"
    OWNER_BOSS_BAG: bool = True
    OWNER_HIDDEN_PANEL: bool = True
    OWNER_HIDDEN_PANEL_URL: str = "/owner/hidden/dashboard"
    OWNER_ACCESS_LEVEL: int = 999
    OWNER_CAN_DELETE_ANYTHING: bool = True
    OWNER_CAN_VIEW_ALL_LOGS: bool = True
    OWNER_CAN_BACKUP_ALL: bool = True
    
    # ==================== FEATURE FLAGS ====================
    FEATURE_VOICE_CHAT: bool = True
    FEATURE_WATCH_PARTY: bool = True
    FEATURE_GROUPS: bool = True
    FEATURE_PREMIUM: bool = True
    FEATURE_ANALYTICS: bool = True
    FEATURE_NOTIFICATIONS: bool = True
    FEATURE_SOCIAL_LOGIN: bool = True
    FEATURE_TWO_FACTOR: bool = True
    FEATURE_OFFLINE_DOWNLOAD: bool = True
    FEATURE_CASTING: bool = True
    FEATURE_PIP: bool = True
    
    # ==================== SECURITY HEADERS ====================
    SECURITY_HSTS_ENABLED: bool = ENVIRONMENT == "production"
    SECURITY_HSTS_MAX_AGE: int = 31536000  # 1 year
    SECURITY_HSTS_INCLUDE_SUBDOMAINS: bool = True
    SECURITY_HSTS_PRELOAD: bool = True
    SECURITY_CSP_ENABLED: bool = ENVIRONMENT == "production"
    SECURITY_CSP_DIRECTIVES: Dict[str, List[str]] = {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'", "https:", "data:"],
        "connect-src": ["'self'", "https:", "wss:"],
        "media-src": ["'self'", "https:"],
        "frame-src": ["'none'"],
        "object-src": ["'none'"]
    }
    SECURITY_REFERRER_POLICY: str = "strict-origin-when-cross-origin"
    SECURITY_X_FRAME_OPTIONS: str = "DENY"
    SECURITY_X_CONTENT_TYPE_OPTIONS: str = "nosniff"
    SECURITY_X_XSS_PROTECTION: str = "1; mode=block"
    
    # ==================== MONITORING ====================
    MONITORING_ENABLED: bool = True
    MONITORING_HEALTH_CHECK_PATH: str = "/health"
    MONITORING_METRICS_PATH: str = "/metrics"
    MONITORING_PROMETHEUS_PORT: int = 9090
    MONITORING_SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    MONITORING_NEW_RELIC_LICENSE: str = os.getenv("NEW_RELIC_LICENSE", "")
    MONITORING_DATADOG_API_KEY: str = os.getenv("DATADOG_API_KEY", "")
    
    # ==================== BACKUP ====================
    BACKUP_ENABLED: bool = True
    BACKUP_SCHEDULE: str = "0 2 * * *"  # Daily at 2 AM
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_COMPRESS: bool = True
    BACKUP_ENCRYPT: bool = False
    BACKUP_STORAGE_PATH: Path = BACKUPS_DIR / "database"
    BACKUP_S3_BUCKET: str = os.getenv("BACKUP_S3_BUCKET", "")
    BACKUP_S3_REGION: str = os.getenv("BACKUP_S3_REGION", "us-east-1")
    
    # ==================== QUEUE ====================
    QUEUE_ENABLED: bool = True
    QUEUE_DRIVER: str = "redis"  # redis, rabbitmq, sqs
    QUEUE_REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/1")
    QUEUE_RABBITMQ_URL: str = os.getenv("RABBITMQ_URL", "amqp://localhost:5672")
    QUEUE_SQS_REGION: str = os.getenv("SQS_REGION", "us-east-1")
    QUEUE_SQS_QUEUE_URL: str = os.getenv("SQS_QUEUE_URL", "")
    QUEUE_DEFAULT_RETRY_ATTEMPTS: int = 3
    QUEUE_DEFAULT_RETRY_DELAY: int = 5  # seconds
    QUEUE_DEFAULT_TIMEOUT: int = 60  # seconds
    
    # ==================== WEBHOOKS ====================
    WEBHOOK_ENABLED: bool = False
    WEBHOOK_TIMEOUT: int = 5  # seconds
    WEBHOOK_RETRY_ATTEMPTS: int = 3
    WEBHOOK_RETRY_DELAY: int = 5  # seconds
    WEBHOOK_EVENTS: List[str] = [
        "user.created", "user.updated", "user.deleted",
        "payment.completed", "subscription.created", "subscription.cancelled",
        "anime.added", "episode.released"
    ]
    
    # ==================== CDN ====================
    CDN_ENABLED: bool = False
    CDN_URL: str = os.getenv("CDN_URL", "")
    CDN_PROVIDER: str = os.getenv("CDN_PROVIDER", "cloudflare")  # cloudflare, cloudfront, fastly
    CDN_API_KEY: str = os.getenv("CDN_API_KEY", "")
    CDN_ZONE_ID: str = os.getenv("CDN_ZONE_ID", "")
    CDN_PURGE_ON_DEPLOY: bool = True
    
    # ==================== EXTERNAL APIS ====================
    EXTERNAL_MAL_CLIENT_ID: str = os.getenv("MAL_CLIENT_ID", "")
    EXTERNAL_MAL_CLIENT_SECRET: str = os.getenv("MAL_CLIENT_SECRET", "")
    EXTERNAL_ANILIST_CLIENT_ID: str = os.getenv("ANILIST_CLIENT_ID", "")
    EXTERNAL_ANILIST_CLIENT_SECRET: str = os.getenv("ANILIST_CLIENT_SECRET", "")
    EXTERNAL_TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def create_directories(cls) -> None:
        """Create all necessary directories"""
        directories = [
            cls.UPLOADS_DIR, cls.TEMP_DIR, cls.LOGS_DIR, 
            cls.BACKUPS_DIR, cls.PUBLIC_DIR, cls.CACHE_DIR, 
            cls.CERT_DIR, cls.BACKUP_STORAGE_PATH
        ]
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories
        (cls.UPLOADS_DIR / "videos").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "thumbnails").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "subtitles").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "audio").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "images").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "documents").mkdir(parents=True, exist_ok=True)
        (cls.UPLOADS_DIR / "temp").mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def get_mongodb_uri(cls) -> str:
        """Get MongoDB URI with authentication"""
        uri = cls.MONGODB_URI
        if cls.MONGODB_USER and cls.MONGODB_PASSWORD:
            from urllib.parse import urlparse, urlunparse
            parsed = urlparse(uri)
            netloc = f"{cls.MONGODB_USER}:{cls.MONGODB_PASSWORD}@{parsed.hostname}:{parsed.port}"
            return urlunparse(parsed._replace(netloc=netloc))
        return uri
    
    @classmethod
    def get_redis_url(cls) -> Optional[str]:
        """Get Redis URL"""
        if not cls.REDIS_ENABLED:
            return None
        if cls.REDIS_PASSWORD:
            return f"redis://:{cls.REDIS_PASSWORD}@{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
        return f"redis://{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
    
    @classmethod
    def get_postgres_url(cls) -> Optional[str]:
        """Get PostgreSQL URL"""
        if not cls.POSTGRES_ENABLED:
            return None
        auth = f"{cls.POSTGRES_USER}:{cls.POSTGRES_PASSWORD}" if cls.POSTGRES_PASSWORD else cls.POSTGRES_USER
        ssl_param = "?sslmode=require" if cls.POSTGRES_SSL else ""
        return f"postgresql://{auth}@{cls.POSTGRES_HOST}:{cls.POSTGRES_PORT}/{cls.POSTGRES_DB}{ssl_param}"
    
    @classmethod
    def is_production(cls) -> bool:
        """Check if environment is production"""
        return cls.ENVIRONMENT == "production"
    
    @classmethod
    def is_development(cls) -> bool:
        """Check if environment is development"""
        return cls.ENVIRONMENT == "development"
    
    @classmethod
    def is_staging(cls) -> bool:
        """Check if environment is staging"""
        return cls.ENVIRONMENT == "staging"
    
    @classmethod
    def is_testing(cls) -> bool:
        """Check if environment is testing"""
        return cls.ENVIRONMENT == "testing"
    
    @classmethod
    def get_premium_plan(cls, plan_id: str) -> Optional[Dict]:
        """Get premium plan by ID"""
        return cls.PREMIUM_PLANS.get(plan_id)
    
    @classmethod
    def get_all_premium_plans(cls) -> Dict[str, Dict]:
        """Get all premium plans"""
        return cls.PREMIUM_PLANS
    
    @classmethod
    def calculate_premium_price(cls, plan_id: str, discount_type: str = None) -> float:
        """Calculate premium price with discount"""
        plan = cls.get_premium_plan(plan_id)
        if not plan:
            return 0
        price = plan["price"]
        if discount_type and discount_type in cls.PREMIUM_DISCOUNTS:
            price = price * (1 - cls.PREMIUM_DISCOUNTS[discount_type])
        return round(price, 2)


# Create config instance
config = Config()

# Create directories on import
config.create_directories()

# Print configuration info
if config.is_development():
    print("\n" + "=" * 50)
    print(f"🎬 {config.APP_NAME} v{config.APP_VERSION}")
    print(f"📡 Environment: {config.ENVIRONMENT}")
    print(f"🚀 Server: http://{config.HOST}:{config.PORT}")
    print(f"📚 API: {config.API_URL}")
    print(f"🗄️ MongoDB: {config.MONGODB_HOST}:{config.MONGODB_PORT}")
    print("=" * 50 + "\n")
