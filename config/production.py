"""
AnimeMultiFlix - Production Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import List, Dict, Any, Optional
from .config import Config


class ProductionConfig(Config):
    """Production Environment Configuration"""
    
    # ==================== DEBUG SETTINGS ====================
    DEBUG: bool = False
    TESTING: bool = False
    DEVELOPMENT: bool = False
    PRODUCTION: bool = True
    
    # ==================== SERVER SETTINGS ====================
    PORT: int = int(os.getenv("PORT", 8080))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    API_URL: str = os.getenv("API_URL", "https://api.animemultiflix.me/api")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://animemultiflix.me")
    ADMIN_URL: str = os.getenv("ADMIN_URL", "https://admin.animemultiflix.me")
    WS_URL: str = os.getenv("WS_URL", "wss://ws.animemultiflix.me")
    
    # ==================== DATABASE SETTINGS ====================
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "anime_multiflix_prod")
    MONGODB_POOL_SIZE: int = int(os.getenv("MONGODB_POOL_SIZE", 20))
    MONGODB_MIN_POOL_SIZE: int = int(os.getenv("MONGODB_MIN_POOL_SIZE", 5))
    MONGODB_MAX_IDLE_TIME: int = int(os.getenv("MONGODB_MAX_IDLE_TIME", 30000))
    MONGODB_CONNECT_TIMEOUT: int = int(os.getenv("MONGODB_CONNECT_TIMEOUT", 10000))
    MONGODB_SOCKET_TIMEOUT: int = int(os.getenv("MONGODB_SOCKET_TIMEOUT", 45000))
    MONGODB_SERVER_SELECTION_TIMEOUT: int = int(os.getenv("MONGODB_SERVER_SELECTION_TIMEOUT", 30000))
    MONGODB_HEARTBEAT_FREQUENCY: int = int(os.getenv("MONGODB_HEARTBEAT_FREQUENCY", 10000))
    MONGODB_RETRY_WRITES: bool = True
    MONGODB_RETRY_READS: bool = True
    MONGODB_SSL: bool = os.getenv("MONGODB_SSL", "true").lower() == "true"
    MONGODB_SSL_CA: Optional[str] = os.getenv("MONGODB_SSL_CA")
    MONGODB_AUTH_SOURCE: str = os.getenv("MONGODB_AUTH_SOURCE", "admin")
    
    # ==================== REDIS SETTINGS ====================
    REDIS_ENABLED: bool = True
    REDIS_HOST: str = os.getenv("REDIS_HOST", "")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    REDIS_DB: int = int(os.getenv("REDIS_DB", 1))
    REDIS_KEY_PREFIX: str = "amf:prod:"
    REDIS_TTL: int = int(os.getenv("REDIS_TTL", 3600))
    REDIS_SOCKET_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_TIMEOUT", 5))
    REDIS_SOCKET_CONNECT_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_CONNECT_TIMEOUT", 5))
    REDIS_RETRY_ON_TIMEOUT: bool = True
    REDIS_MAX_RETRIES: int = int(os.getenv("REDIS_MAX_RETRIES", 3))
    REDIS_RETRY_BACKOFF: int = int(os.getenv("REDIS_RETRY_BACKOFF", 100))
    
    # ==================== POSTGRESQL SETTINGS ====================
    POSTGRES_ENABLED: bool = os.getenv("POSTGRES_ENABLED", "true").lower() == "true"
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "anime_multiflix_prod")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_SSL: bool = os.getenv("POSTGRES_SSL", "true").lower() == "true"
    POSTGRES_POOL_SIZE: int = int(os.getenv("POSTGRES_POOL_SIZE", 20))
    POSTGRES_MAX_OVERFLOW: int = int(os.getenv("POSTGRES_MAX_OVERFLOW", 40))
    POSTGRES_POOL_TIMEOUT: int = int(os.getenv("POSTGRES_POOL_TIMEOUT", 30))
    POSTGRES_POOL_RECYCLE: int = int(os.getenv("POSTGRES_POOL_RECYCLE", 3600))
    POSTGRES_POOL_PRE_PING: bool = True
    
    # ==================== SECURITY SETTINGS ====================
    SSL_ENABLED: bool = True
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "strict"
    SESSION_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_STORE: str = "redis"
    RATE_LIMIT_GLOBAL: Dict[str, int] = {
        "window_seconds": 60,
        "max_requests": 60  # 60 requests per minute
    }
    
    # CSRF Protection
    CSRF_ENABLED: bool = True
    CSRF_COOKIE_SECURE: bool = True
    CSRF_COOKIE_HTTPONLY: bool = False
    CSRF_COOKIE_SAMESITE: str = "strict"
    
    # Helmet Security Headers
    HELMET_ENABLED: bool = True
    CSP_ENABLED: bool = True
    HSTS_ENABLED: bool = True
    HSTS_MAX_AGE: int = 31536000  # 1 year
    HSTS_INCLUDE_SUBDOMAINS: bool = True
    HSTS_PRELOAD: bool = True
    
    # CORS Settings
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "https://animemultiflix.me,https://api.animemultiflix.me,https://admin.animemultiflix.me").split(",")
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400
    
    # ==================== LOGGING SETTINGS ====================
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_CONSOLE: bool = False
    LOG_FILE: bool = True
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    LOG_FILE_PATH: str = "/var/log/animemultiflix/app.log"
    LOG_ERROR_FILE_PATH: str = "/var/log/animemultiflix/error.log"
    LOG_ACCESS_FILE_PATH: str = "/var/log/animemultiflix/access.log"
    LOG_MAX_BYTES: int = 100 * 1024 * 1024  # 100MB
    LOG_BACKUP_COUNT: int = 30
    
    # ==================== CACHE SETTINGS ====================
    CACHE_TYPE: str = "redis"
    CACHE_REDIS_URL: str = os.getenv("REDIS_URL", "")
    CACHE_DEFAULT_TIMEOUT: int = 3600  # 1 hour
    CACHE_KEY_PREFIX: str = "amf_prod:cache:"
    
    # Cache TTL by Type
    CACHE_TTL_ANIME_LIST: int = 3600
    CACHE_TTL_ANIME_DETAIL: int = 7200
    CACHE_TTL_EPISODE: int = 1800
    CACHE_TTL_USER: int = 300
    CACHE_TTL_GROUP: int = 600
    CACHE_TTL_TRENDING: int = 900
    
    # ==================== QUEUE SETTINGS ====================
    QUEUE_ENABLED: bool = True
    QUEUE_DRIVER: str = "redis"
    QUEUE_REDIS_URL: str = os.getenv("REDIS_URL", "")
    QUEUE_DEFAULT_RETRY_ATTEMPTS: int = 3
    QUEUE_DEFAULT_RETRY_DELAY: int = 5
    QUEUE_DEFAULT_TIMEOUT: int = 60
    
    # ==================== EMAIL SETTINGS ====================
    EMAIL_ENABLED: bool = True
    EMAIL_BACKEND: str = "smtp"
    EMAIL_HOST: str = os.getenv("SMTP_HOST", "")
    EMAIL_PORT: int = int(os.getenv("SMTP_PORT", 587))
    EMAIL_USE_TLS: bool = os.getenv("SMTP_TLS", "true").lower() == "true"
    EMAIL_USE_SSL: bool = os.getenv("SMTP_SSL", "false").lower() == "true"
    EMAIL_HOST_USER: str = os.getenv("SMTP_USER", "")
    EMAIL_HOST_PASSWORD: str = os.getenv("SMTP_PASS", "")
    EMAIL_DEFAULT_FROM: str = os.getenv("EMAIL_FROM", "noreply@animemultiflix.com")
    EMAIL_DEFAULT_REPLY_TO: str = os.getenv("EMAIL_REPLY_TO", "support@animemultiflix.com")
    
    # ==================== SMS SETTINGS ====================
    SMS_ENABLED: bool = os.getenv("SMS_ENABLED", "true").lower() == "true"
    SMS_PROVIDER: str = os.getenv("SMS_PROVIDER", "twilio")
    SMS_TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    SMS_TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    SMS_TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")
    
    # ==================== PAYMENT SETTINGS ====================
    STRIPE_ENABLED: bool = True
    STRIPE_PUBLIC_KEY: str = os.getenv("STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    PAYPAL_ENABLED: bool = True
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = "live"
    
    RAZORPAY_ENABLED: bool = os.getenv("RAZORPAY_ENABLED", "false").lower() == "true"
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    
    # ==================== CDN SETTINGS ====================
    CDN_ENABLED: bool = True
    CDN_URL: str = os.getenv("CDN_URL", "https://cdn.animemultiflix.me")
    CDN_PROVIDER: str = os.getenv("CDN_PROVIDER", "cloudflare")
    CDN_API_KEY: Optional[str] = os.getenv("CDN_API_KEY")
    CDN_ZONE_ID: Optional[str] = os.getenv("CDN_ZONE_ID")
    CDN_PURGE_ON_DEPLOY: bool = True
    
    # ==================== STORAGE SETTINGS ====================
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "s3")
    
    # S3 Storage
    S3_BUCKET: str = os.getenv("S3_BUCKET", "")
    S3_REGION: str = os.getenv("S3_REGION", "us-east-1")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "")
    S3_CDN_URL: str = os.getenv("S3_CDN_URL", "")
    
    # ==================== MONITORING ====================
    MONITORING_ENABLED: bool = True
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    NEW_RELIC_LICENSE: str = os.getenv("NEW_RELIC_LICENSE", "")
    DATADOG_API_KEY: str = os.getenv("DATADOG_API_KEY", "")
    
    # Health Check
    HEALTH_CHECK_ENABLED: bool = True
    HEALTH_CHECK_PATH: str = "/health"
    HEALTH_CHECK_INTERVAL: int = 30  # seconds
    
    # ==================== BACKUP SETTINGS ====================
    BACKUP_ENABLED: bool = True
    BACKUP_SCHEDULE: str = "0 2 * * *"  # Daily at 2 AM
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_COMPRESS: bool = True
    BACKUP_ENCRYPT: bool = True
    BACKUP_STORAGE: str = "s3"
    BACKUP_S3_BUCKET: str = os.getenv("BACKUP_S3_BUCKET", "")
    
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
    
    # ==================== SESSION SETTINGS ====================
    SESSION_COOKIE_NAME: str = "amf_session"
    SESSION_REFRESH_INTERVAL: int = 1800  # 30 minutes
    SESSION_STORE: str = "redis"
    SESSION_REDIS_TTL: int = 7 * 24 * 60 * 60  # 7 days
    
    # ==================== API SETTINGS ====================
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api"
    API_RATE_LIMIT: int = 1000  # requests per hour
    API_KEY_REQUIRED: bool = False
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def init_app(cls, app) -> None:
        """Initialize production app with prod-specific settings"""
        
        # Enable CORS with strict origins
        from flask_cors import CORS
        CORS(app, origins=cls.CORS_ORIGINS, supports_credentials=True)
        
        # Setup logging to file
        import logging
        from logging.handlers import RotatingFileHandler
        
        # Ensure log directory exists
        import os
        os.makedirs(os.path.dirname(cls.LOG_FILE_PATH), exist_ok=True)
        
        # File handler
        file_handler = RotatingFileHandler(
            cls.LOG_FILE_PATH,
            maxBytes=cls.LOG_MAX_BYTES,
            backupCount=cls.LOG_BACKUP_COUNT
        )
        file_handler.setLevel(getattr(logging, cls.LOG_LEVEL))
        file_handler.setFormatter(logging.Formatter(cls.LOG_FORMAT, cls.LOG_DATE_FORMAT))
        
        # Error file handler
        error_file_handler = RotatingFileHandler(
            cls.LOG_ERROR_FILE_PATH,
            maxBytes=cls.LOG_MAX_BYTES,
            backupCount=cls.LOG_BACKUP_COUNT
        )
        error_file_handler.setLevel(logging.ERROR)
        error_file_handler.setFormatter(logging.Formatter(cls.LOG_FORMAT, cls.LOG_DATE_FORMAT))
        
        # Add handlers to app logger
        app.logger.addHandler(file_handler)
        app.logger.addHandler(error_file_handler)
        
        # Initialize Sentry
        if cls.SENTRY_DSN:
            import sentry_sdk
            from sentry_sdk.integrations.flask import FlaskIntegration
            sentry_sdk.init(
                dsn=cls.SENTRY_DSN,
                integrations=[FlaskIntegration()],
                environment="production",
                traces_sample_rate=0.1
            )
        
        # Print production mode banner
        print("\n" + "=" * 60)
        print("🚀 PRODUCTION MODE ENABLED")
        print("=" * 60)
        print(f"📡 Server: https://{cls.HOST}:{cls.PORT}")
        print(f"📚 API: {cls.API_URL}")
        print(f"🗄️  MongoDB: {cls.MONGODB_HOST}:{cls.MONGODB_PORT}")
        print(f"⚡ Redis: {cls.REDIS_HOST}:{cls.REDIS_PORT}")
        print(f"🔒 Security: Enabled (SSL, CSP, HSTS, CSRF)")
        print(f"📧 Email: SMTP (Production)")
        print(f"💳 Payments: Stripe + PayPal")
        print(f"📊 Monitoring: {'Enabled' if cls.MONITORING_ENABLED else 'Disabled'}")
        print(f"💾 Backups: {'Enabled' if cls.BACKUP_ENABLED else 'Disabled'}")
        print("=" * 60 + "\n")
    
    @classmethod
    def is_production(cls) -> bool:
        """Check if environment is production"""
        return True
    
    @classmethod
    def should_use_cdn(cls) -> bool:
        """Check if CDN should be used"""
        return cls.CDN_ENABLED and bool(cls.CDN_URL)
    
    @classmethod
    def get_cdn_url(cls, path: str) -> str:
        """Get CDN URL for asset"""
        if cls.should_use_cdn():
            return f"{cls.CDN_URL}/{path}"
        return path
    
    @classmethod
    def get_prod_config(cls) -> Dict[str, Any]:
        """Get complete production configuration"""
        return {
            "debug": cls.DEBUG,
            "production": cls.PRODUCTION,
            "server": {
                "port": cls.PORT,
                "host": cls.HOST,
                "api_url": cls.API_URL,
                "frontend_url": cls.FRONTEND_URL,
                "admin_url": cls.ADMIN_URL
            },
            "database": {
                "mongodb_uri": cls.MONGODB_URI,
                "mongodb_pool_size": cls.MONGODB_POOL_SIZE,
                "redis_host": cls.REDIS_HOST,
                "redis_port": cls.REDIS_PORT,
                "postgres_enabled": cls.POSTGRES_ENABLED
            },
            "security": {
                "ssl_enabled": cls.SSL_ENABLED,
                "rate_limit_enabled": cls.RATE_LIMIT_ENABLED,
                "csrf_enabled": cls.CSRF_ENABLED,
                "helmet_enabled": cls.HELMET_ENABLED,
                "csp_enabled": cls.CSP_ENABLED,
                "hsts_enabled": cls.HSTS_ENABLED
            },
            "logging": {
                "level": cls.LOG_LEVEL,
                "console": cls.LOG_CONSOLE,
                "file": cls.LOG_FILE,
                "file_path": cls.LOG_FILE_PATH
            },
            "cache": {
                "type": cls.CACHE_TYPE,
                "default_timeout": cls.CACHE_DEFAULT_TIMEOUT
            },
            "queue": {
                "enabled": cls.QUEUE_ENABLED,
                "driver": cls.QUEUE_DRIVER
            },
            "payment": {
                "stripe_enabled": cls.STRIPE_ENABLED,
                "paypal_enabled": cls.PAYPAL_ENABLED
            },
            "cdn": {
                "enabled": cls.CDN_ENABLED,
                "url": cls.CDN_URL,
                "provider": cls.CDN_PROVIDER
            },
            "monitoring": {
                "enabled": cls.MONITORING_ENABLED,
                "sentry_dsn": bool(cls.SENTRY_DSN),
                "health_check": cls.HEALTH_CHECK_ENABLED
            },
            "backup": {
                "enabled": cls.BACKUP_ENABLED,
                "schedule": cls.BACKUP_SCHEDULE,
                "retention_days": cls.BACKUP_RETENTION_DAYS
            },
            "features": {
                "voice_chat": cls.FEATURE_VOICE_CHAT,
                "watch_party": cls.FEATURE_WATCH_PARTY,
                "groups": cls.FEATURE_GROUPS,
                "premium": cls.FEATURE_PREMIUM,
                "analytics": cls.FEATURE_ANALYTICS,
                "two_factor": cls.FEATURE_TWO_FACTOR
            }
        }


# Create production config instance
prod_config = ProductionConfig()

# Print configuration status
if prod_config.PRODUCTION:
    print("🚀 Production Configuration Loaded")
    print(f"   Server: https://{prod_config.HOST}:{prod_config.PORT}")
    print(f"   SSL: {'Enabled' if prod_config.SSL_ENABLED else 'Disabled'}")
    print(f"   Rate Limiting: {'Enabled' if prod_config.RATE_LIMIT_ENABLED else 'Disabled'}")
    print(f"   Monitoring: {'Enabled' if prod_config.MONITORING_ENABLED else 'Disabled'}")
    print(f"   Backups: {'Enabled' if prod_config.BACKUP_ENABLED else 'Disabled'}")
