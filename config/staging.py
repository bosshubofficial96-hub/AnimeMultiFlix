"""
AnimeMultiFlix - Staging Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import List, Dict, Any, Optional
from .config import Config


class StagingConfig(Config):
    """Staging Environment Configuration"""
    
    # ==================== DEBUG SETTINGS ====================
    DEBUG: bool = True
    TESTING: bool = False
    DEVELOPMENT: bool = False
    STAGING: bool = True
    PRODUCTION: bool = False
    
    # ==================== SERVER SETTINGS ====================
    PORT: int = int(os.getenv("STAGING_PORT", 3000))
    HOST: str = os.getenv("STAGING_HOST", "0.0.0.0")
    API_URL: str = os.getenv("STAGING_API_URL", "https://staging-api.animemultiflix.me/api")
    FRONTEND_URL: str = os.getenv("STAGING_FRONTEND_URL", "https://staging.animemultiflix.me")
    ADMIN_URL: str = os.getenv("STAGING_ADMIN_URL", "https://staging-admin.animemultiflix.me")
    WS_URL: str = os.getenv("STAGING_WS_URL", "wss://staging-ws.animemultiflix.me")
    
    # ==================== DATABASE SETTINGS ====================
    MONGODB_URI: str = os.getenv("STAGING_MONGODB_URI", "mongodb://localhost:27017/anime_multiflix_staging")
    MONGODB_DB: str = os.getenv("STAGING_MONGODB_DB", "anime_multiflix_staging")
    MONGODB_POOL_SIZE: int = int(os.getenv("STAGING_MONGODB_POOL_SIZE", 10))
    MONGODB_MIN_POOL_SIZE: int = int(os.getenv("STAGING_MONGODB_MIN_POOL_SIZE", 2))
    MONGODB_MAX_IDLE_TIME: int = int(os.getenv("STAGING_MONGODB_MAX_IDLE_TIME", 30000))
    MONGODB_CONNECT_TIMEOUT: int = int(os.getenv("STAGING_MONGODB_CONNECT_TIMEOUT", 10000))
    MONGODB_SOCKET_TIMEOUT: int = int(os.getenv("STAGING_MONGODB_SOCKET_TIMEOUT", 45000))
    MONGODB_SERVER_SELECTION_TIMEOUT: int = int(os.getenv("STAGING_MONGODB_SERVER_SELECTION_TIMEOUT", 30000))
    MONGODB_RETRY_WRITES: bool = True
    MONGODB_RETRY_READS: bool = True
    MONGODB_SSL: bool = os.getenv("STAGING_MONGODB_SSL", "true").lower() == "true"
    
    # ==================== REDIS SETTINGS ====================
    REDIS_ENABLED: bool = True
    REDIS_HOST: str = os.getenv("STAGING_REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("STAGING_REDIS_PORT", 6379))
    REDIS_PASSWORD: Optional[str] = os.getenv("STAGING_REDIS_PASSWORD")
    REDIS_DB: int = int(os.getenv("STAGING_REDIS_DB", 1))
    REDIS_KEY_PREFIX: str = "amf:staging:"
    REDIS_TTL: int = int(os.getenv("STAGING_REDIS_TTL", 1800))  # 30 minutes
    
    # ==================== POSTGRESQL SETTINGS ====================
    POSTGRES_ENABLED: bool = os.getenv("STAGING_POSTGRES_ENABLED", "true").lower() == "true"
    POSTGRES_HOST: str = os.getenv("STAGING_POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("STAGING_POSTGRES_PORT", 5432))
    POSTGRES_DB: str = os.getenv("STAGING_POSTGRES_DB", "anime_multiflix_staging")
    POSTGRES_USER: str = os.getenv("STAGING_POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("STAGING_POSTGRES_PASSWORD", "")
    POSTGRES_SSL: bool = os.getenv("STAGING_POSTGRES_SSL", "true").lower() == "true"
    POSTGRES_POOL_SIZE: int = int(os.getenv("STAGING_POSTGRES_POOL_SIZE", 10))
    POSTGRES_MAX_OVERFLOW: int = int(os.getenv("STAGING_POSTGRES_MAX_OVERFLOW", 20))
    
    # ==================== SECURITY SETTINGS ====================
    SSL_ENABLED: bool = True
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"
    SESSION_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    
    # Rate Limiting (Less strict than production)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_STORE: str = "redis"
    RATE_LIMIT_GLOBAL: Dict[str, int] = {
        "window_seconds": 60,
        "max_requests": 200  # 200 requests per minute
    }
    
    # CSRF Protection
    CSRF_ENABLED: bool = True
    CSRF_COOKIE_SECURE: bool = True
    CSRF_COOKIE_SAMESITE: str = "lax"
    
    # Helmet Security Headers
    HELMET_ENABLED: bool = True
    CSP_ENABLED: bool = True
    HSTS_ENABLED: bool = True
    HSTS_MAX_AGE: int = 86400  # 1 day (shorter for staging)
    HSTS_INCLUDE_SUBDOMAINS: bool = False
    HSTS_PRELOAD: bool = False
    
    # CORS Settings (Staging origins)
    CORS_ORIGINS: List[str] = os.getenv("STAGING_CORS_ORIGINS", "https://staging.animemultiflix.me,https://staging-api.animemultiflix.me,https://staging-admin.animemultiflix.me,http://localhost:3000").split(",")
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400
    
    # ==================== LOGGING SETTINGS ====================
    LOG_LEVEL: str = os.getenv("STAGING_LOG_LEVEL", "INFO")
    LOG_CONSOLE: bool = True
    LOG_FILE: bool = True
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    LOG_FILE_PATH: str = "./logs/staging/app.log"
    LOG_ERROR_FILE_PATH: str = "./logs/staging/error.log"
    LOG_MAX_BYTES: int = 50 * 1024 * 1024  # 50MB
    LOG_BACKUP_COUNT: int = 10
    
    # ==================== CACHE SETTINGS ====================
    CACHE_TYPE: str = "redis"
    CACHE_REDIS_URL: str = os.getenv("STAGING_REDIS_URL", "")
    CACHE_DEFAULT_TIMEOUT: int = 1800  # 30 minutes
    CACHE_KEY_PREFIX: str = "amf_staging:cache:"
    
    # Cache TTL by Type (Shorter for staging)
    CACHE_TTL_ANIME_LIST: int = 1800
    CACHE_TTL_ANIME_DETAIL: int = 3600
    CACHE_TTL_EPISODE: int = 900
    CACHE_TTL_USER: int = 150
    CACHE_TTL_GROUP: int = 300
    CACHE_TTL_TRENDING: int = 450
    
    # ==================== QUEUE SETTINGS ====================
    QUEUE_ENABLED: bool = True
    QUEUE_DRIVER: str = "redis"
    QUEUE_REDIS_URL: str = os.getenv("STAGING_REDIS_URL", "")
    QUEUE_DEFAULT_RETRY_ATTEMPTS: int = 2
    QUEUE_DEFAULT_RETRY_DELAY: int = 3
    QUEUE_DEFAULT_TIMEOUT: int = 30
    
    # ==================== EMAIL SETTINGS ====================
    EMAIL_ENABLED: bool = True
    EMAIL_BACKEND: str = "smtp"
    EMAIL_HOST: str = os.getenv("STAGING_SMTP_HOST", "smtp.gmail.com")
    EMAIL_PORT: int = int(os.getenv("STAGING_SMTP_PORT", 587))
    EMAIL_USE_TLS: bool = True
    EMAIL_USE_SSL: bool = False
    EMAIL_HOST_USER: str = os.getenv("STAGING_SMTP_USER", "")
    EMAIL_HOST_PASSWORD: str = os.getenv("STAGING_SMTP_PASS", "")
    EMAIL_DEFAULT_FROM: str = os.getenv("STAGING_EMAIL_FROM", "staging@animemultiflix.com")
    
    # ==================== SMS SETTINGS ====================
    SMS_ENABLED: bool = os.getenv("STAGING_SMS_ENABLED", "false").lower() == "true"
    SMS_PROVIDER: str = os.getenv("STAGING_SMS_PROVIDER", "twilio")
    SMS_TWILIO_ACCOUNT_SID: str = os.getenv("STAGING_TWILIO_ACCOUNT_SID", "")
    SMS_TWILIO_AUTH_TOKEN: str = os.getenv("STAGING_TWILIO_AUTH_TOKEN", "")
    SMS_TWILIO_FROM_NUMBER: str = os.getenv("STAGING_TWILIO_FROM_NUMBER", "")
    
    # ==================== PAYMENT SETTINGS (Test Mode) ====================
    STRIPE_ENABLED: bool = True
    STRIPE_PUBLIC_KEY: str = os.getenv("STAGING_STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STAGING_STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STAGING_STRIPE_WEBHOOK_SECRET", "")
    
    PAYPAL_ENABLED: bool = True
    PAYPAL_CLIENT_ID: str = os.getenv("STAGING_PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("STAGING_PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = "sandbox"
    
    RAZORPAY_ENABLED: bool = os.getenv("STAGING_RAZORPAY_ENABLED", "false").lower() == "true"
    RAZORPAY_KEY_ID: str = os.getenv("STAGING_RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("STAGING_RAZORPAY_KEY_SECRET", "")
    
    # Test Payment Gateway
    USE_TEST_PAYMENT_GATEWAY: bool = True
    TEST_PAYMENT_SUCCESS_RATE: float = 0.95  # 95% success rate for testing
    
    # ==================== CDN SETTINGS ====================
    CDN_ENABLED: bool = os.getenv("STAGING_CDN_ENABLED", "false").lower() == "true"
    CDN_URL: str = os.getenv("STAGING_CDN_URL", "")
    CDN_PROVIDER: str = os.getenv("STAGING_CDN_PROVIDER", "cloudflare")
    
    # ==================== STORAGE SETTINGS ====================
    STORAGE_TYPE: str = os.getenv("STAGING_STORAGE_TYPE", "local")
    STORAGE_PATH: str = "./uploads/staging"
    
    # S3 Storage (Optional for staging)
    S3_ENABLED: bool = os.getenv("STAGING_S3_ENABLED", "false").lower() == "true"
    S3_BUCKET: str = os.getenv("STAGING_S3_BUCKET", "")
    S3_REGION: str = os.getenv("STAGING_S3_REGION", "us-east-1")
    S3_ACCESS_KEY: str = os.getenv("STAGING_S3_ACCESS_KEY", "")
    S3_SECRET_KEY: str = os.getenv("STAGING_S3_SECRET_KEY", "")
    
    # ==================== MONITORING ====================
    MONITORING_ENABLED: bool = True
    SENTRY_DSN: str = os.getenv("STAGING_SENTRY_DSN", "")
    NEW_RELIC_LICENSE: str = os.getenv("STAGING_NEW_RELIC_LICENSE", "")
    
    # Health Check
    HEALTH_CHECK_ENABLED: bool = True
    HEALTH_CHECK_PATH: str = "/health"
    HEALTH_CHECK_DETAILS: bool = True  # Show details in staging
    
    # ==================== BACKUP SETTINGS ====================
    BACKUP_ENABLED: bool = True
    BACKUP_SCHEDULE: str = "0 3 * * *"  # Daily at 3 AM
    BACKUP_RETENTION_DAYS: int = 7  # 7 days for staging
    BACKUP_COMPRESS: bool = True
    BACKUP_ENCRYPT: bool = False  # No encryption for staging
    
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
    FEATURE_BETA_FEATURES: bool = True  # Enable beta features in staging
    
    # ==================== BETA FEATURES ====================
    BETA_FEATURES: List[str] = [
        "ai_recommendations_v2",
        "voice_effects",
        "custom_emojis",
        "animated_stickers",
        "watch_party_recording",
        "voice_translation"
    ]
    
    # ==================== API SETTINGS ====================
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api"
    API_RATE_LIMIT: int = 2000  # requests per hour
    API_DEBUG: bool = True
    
    # ==================== MOCK SERVICES ====================
    MOCK_EXTERNAL_APIS: bool = os.getenv("STAGING_MOCK_APIS", "false").lower() == "true"
    MOCK_ML_SERVICES: bool = False
    MOCK_PAYMENTS: bool = False
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def init_app(cls, app) -> None:
        """Initialize staging app with staging-specific settings"""
        
        # Enable CORS
        from flask_cors import CORS
        CORS(app, origins=cls.CORS_ORIGINS, supports_credentials=True)
        
        # Setup logging
        import logging
        from logging.handlers import RotatingFileHandler
        import os
        
        # Ensure log directory exists
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
        
        app.logger.addHandler(file_handler)
        app.logger.addHandler(error_file_handler)
        
        # Initialize Sentry (if configured)
        if cls.SENTRY_DSN:
            import sentry_sdk
            from sentry_sdk.integrations.flask import FlaskIntegration
            sentry_sdk.init(
                dsn=cls.SENTRY_DSN,
                integrations=[FlaskIntegration()],
                environment="staging",
                traces_sample_rate=0.5
            )
        
        # Print staging mode banner
        print("\n" + "=" * 60)
        print("🟡 STAGING MODE ENABLED")
        print("=" * 60)
        print(f"📡 Server: https://{cls.HOST}:{cls.PORT}")
        print(f"📚 API: {cls.API_URL}")
        print(f"🗄️  MongoDB: {cls.MONGODB_HOST}:{cls.MONGODB_PORT}")
        print(f"⚡ Redis: {cls.REDIS_HOST}:{cls.REDIS_PORT}")
        print(f"🔒 Security: Enabled (SSL, CSP, HSTS)")
        print(f"💳 Payments: Test Mode")
        print(f"📊 Monitoring: {'Enabled' if cls.MONITORING_ENABLED else 'Disabled'}")
        print(f"🔬 Beta Features: {len(cls.BETA_FEATURES)} enabled")
        print("=" * 60 + "\n")
    
    @classmethod
    def is_staging(cls) -> bool:
        """Check if environment is staging"""
        return True
    
    @classmethod
    def is_beta_feature_enabled(cls, feature: str) -> bool:
        """Check if a beta feature is enabled"""
        return cls.FEATURE_BETA_FEATURES and feature in cls.BETA_FEATURES
    
    @classmethod
    def get_beta_features(cls) -> List[str]:
        """Get list of enabled beta features"""
        return cls.BETA_FEATURES if cls.FEATURE_BETA_FEATURES else []
    
    @classmethod
    def should_mock_external_apis(cls) -> bool:
        """Check if external APIs should be mocked"""
        return cls.MOCK_EXTERNAL_APIS
    
    @classmethod
    def get_test_payment_success_rate(cls) -> float:
        """Get test payment success rate"""
        return cls.TEST_PAYMENT_SUCCESS_RATE
    
    @classmethod
    def get_staging_config(cls) -> Dict[str, Any]:
        """Get complete staging configuration"""
        return {
            "debug": cls.DEBUG,
            "staging": cls.STAGING,
            "server": {
                "port": cls.PORT,
                "host": cls.HOST,
                "api_url": cls.API_URL,
                "frontend_url": cls.FRONTEND_URL
            },
            "database": {
                "mongodb_uri": cls.MONGODB_URI,
                "mongodb_pool_size": cls.MONGODB_POOL_SIZE,
                "redis_host": cls.REDIS_HOST,
                "redis_port": cls.REDIS_PORT
            },
            "security": {
                "ssl_enabled": cls.SSL_ENABLED,
                "rate_limit_enabled": cls.RATE_LIMIT_ENABLED,
                "csrf_enabled": cls.CSRF_ENABLED
            },
            "logging": {
                "level": cls.LOG_LEVEL,
                "console": cls.LOG_CONSOLE,
                "file": cls.LOG_FILE
            },
            "payment": {
                "stripe_enabled": cls.STRIPE_ENABLED,
                "paypal_enabled": cls.PAYPAL_ENABLED,
                "test_mode": cls.USE_TEST_PAYMENT_GATEWAY
            },
            "features": {
                "beta_features": cls.FEATURE_BETA_FEATURES,
                "beta_list": cls.BETA_FEATURES,
                "voice_chat": cls.FEATURE_VOICE_CHAT,
                "watch_party": cls.FEATURE_WATCH_PARTY
            },
            "mock_services": {
                "external_apis": cls.MOCK_EXTERNAL_APIS,
                "ml_services": cls.MOCK_ML_SERVICES,
                "payments": cls.MOCK_PAYMENTS
            }
        }


# Create staging config instance
staging_config = StagingConfig()

# Print configuration status
if staging_config.STAGING:
    print("🟡 Staging Configuration Loaded")
    print(f"   Server: https://{staging_config.HOST}:{staging_config.PORT}")
    print(f"   Beta Features: {len(staging_config.get_beta_features())}")
    print(f"   Rate Limiting: {'Enabled' if staging_config.RATE_LIMIT_ENABLED else 'Disabled'}")
    print(f"   Mock APIs: {'Enabled' if staging_config.should_mock_external_apis() else 'Disabled'}")
