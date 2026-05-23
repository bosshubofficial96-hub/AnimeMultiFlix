"""
AnimeMultiFlix - Development Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import List, Dict, Any
from .config import Config


class DevelopmentConfig(Config):
    """Development Environment Configuration"""
    
    # ==================== DEBUG SETTINGS ====================
    DEBUG: bool = True
    TESTING: bool = False
    DEVELOPMENT: bool = True
    
    # ==================== SERVER SETTINGS ====================
    PORT: int = int(os.getenv("DEV_PORT", 3000))
    HOST: str = os.getenv("DEV_HOST", "localhost")
    API_URL: str = os.getenv("DEV_API_URL", "http://localhost:3000/api")
    FRONTEND_URL: str = os.getenv("DEV_FRONTEND_URL", "http://localhost:3000")
    ADMIN_URL: str = os.getenv("DEV_ADMIN_URL", "http://localhost:3000/admin")
    WS_URL: str = os.getenv("DEV_WS_URL", "ws://localhost:3001")
    
    # ==================== DATABASE SETTINGS ====================
    MONGODB_URI: str = os.getenv("DEV_MONGODB_URI", "mongodb://localhost:27017/anime_multiflix_dev")
    MONGODB_DB: str = os.getenv("DEV_MONGODB_DB", "anime_multiflix_dev")
    REDIS_DB: int = int(os.getenv("DEV_REDIS_DB", 0))
    REDIS_HOST: str = os.getenv("DEV_REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("DEV_REDIS_PORT", 6379))
    
    # ==================== SECURITY SETTINGS (Relaxed for Dev) ====================
    SSL_ENABLED: bool = False
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_SAMESITE: str = "lax"
    RATE_LIMIT_ENABLED: bool = False
    CSRF_ENABLED: bool = False
    HELMET_ENABLED: bool = False
    CSP_ENABLED: bool = False
    HSTS_ENABLED: bool = False
    
    # ==================== CORS SETTINGS (Allow All in Dev) ====================
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:8080",
        "*"  # Allow all in development
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # ==================== LOGGING SETTINGS ====================
    LOG_LEVEL: str = "DEBUG"
    LOG_CONSOLE: bool = True
    LOG_FILE: bool = True
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    LOG_MAX_BYTES: int = 5 * 1024 * 1024  # 5MB
    LOG_BACKUP_COUNT: int = 5
    
    # ==================== CACHE SETTINGS ====================
    CACHE_TYPE: str = "simple"  # Use simple cache in development
    CACHE_DEFAULT_TIMEOUT: int = 60  # 1 minute
    CACHE_KEY_PREFIX: str = "amf_dev:cache:"
    REDIS_CACHE_ENABLED: bool = False
    
    # ==================== QUEUE SETTINGS ====================
    QUEUE_ENABLED: bool = False  # Disable queues in development
    ASYNC_TASKS_ENABLED: bool = False
    
    # ==================== EMAIL SETTINGS ====================
    EMAIL_ENABLED: bool = False
    EMAIL_BACKEND: str = "console"  # Print emails to console
    EMAIL_HOST: str = "localhost"
    EMAIL_PORT: int = 1025
    EMAIL_USE_TLS: bool = False
    EMAIL_USE_SSL: bool = False
    
    # ==================== SMS SETTINGS ====================
    SMS_ENABLED: bool = False
    SMS_BACKEND: str = "console"  # Print SMS to console
    
    # ==================== PAYMENT SETTINGS ====================
    STRIPE_ENABLED: bool = False
    PAYPAL_ENABLED: bool = False
    RAZORPAY_ENABLED: bool = False
    USE_TEST_PAYMENT_GATEWAY: bool = True
    
    # ==================== FILE UPLOAD SETTINGS ====================
    MAX_CONTENT_LENGTH: int = 500 * 1024 * 1024  # 500MB
    UPLOAD_FOLDER: str = "./uploads/dev"
    ALLOWED_EXTENSIONS: List[str] = [
        "mp4", "mkv", "avi", "mov", "webm",
        "jpg", "jpeg", "png", "gif", "webp",
        "srt", "vtt", "ass"
    ]
    
    # ==================== EXTERNAL SERVICES ====================
    EXTERNAL_API_MOCK: bool = True  # Mock external APIs
    USE_MOCK_RECOMMENDATIONS: bool = True
    USE_MOCK_TRANSLATIONS: bool = True
    
    # ==================== FEATURE FLAGS ====================
    FEATURE_VOICE_CHAT: bool = True
    FEATURE_WATCH_PARTY: bool = True
    FEATURE_GROUPS: bool = True
    FEATURE_PREMIUM: bool = True
    FEATURE_ANALYTICS: bool = False  # Disable analytics in dev
    FEATURE_NOTIFICATIONS: bool = True
    FEATURE_SOCIAL_LOGIN: bool = True
    FEATURE_TWO_FACTOR: bool = False  # Disable 2FA in dev
    
    # ==================== RATE LIMITING (Disabled) ====================
    RATE_LIMIT_GLOBAL: Dict[str, int] = {
        "window_seconds": 60,
        "max_requests": 1000  # High limit for development
    }
    
    # ==================== SESSION SETTINGS ====================
    SESSION_COOKIE_NAME: str = "amf_dev_session"
    SESSION_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    SESSION_REFRESH_INTERVAL: int = 60 * 60  # 1 hour
    
    # ==================== TEMPLATE SETTINGS ====================
    TEMPLATES_AUTO_RELOAD: bool = True
    TEMPLATES_CACHE_SIZE: int = 0  # No cache in development
    
    # ==================== STATIC FILES ====================
    STATIC_FOLDER: str = "./frontend"
    STATIC_URL_PATH: str = "/"
    STATIC_CACHE_TIMEOUT: int = 0  # No cache
    
    # ==================== DEBUG TOOLBAR ====================
    DEBUG_TOOLBAR_ENABLED: bool = True
    DEBUG_TOOLBAR_PANELS: List[str] = [
        "debug_toolbar.panels.versions.VersionsPanel",
        "debug_toolbar.panels.timer.TimerPanel",
        "debug_toolbar.panels.settings.SettingsPanel",
        "debug_toolbar.panels.headers.HeadersPanel",
        "debug_toolbar.panels.request.RequestPanel",
        "debug_toolbar.panels.sql.SQLPanel",
        "debug_toolbar.panels.staticfiles.StaticFilesPanel",
        "debug_toolbar.panels.templates.TemplatesPanel",
        "debug_toolbar.panels.cache.CachePanel",
        "debug_toolbar.panels.signals.SignalsPanel",
        "debug_toolbar.panels.logging.LoggingPanel",
        "debug_toolbar.panels.redirects.RedirectsPanel"
    ]
    
    # ==================== PROFILING ====================
    PROFILING_ENABLED: bool = True
    PROFILING_DIR: str = "./logs/profiling"
    
    # ==================== API DOCUMENTATION ====================
    API_DOCS_ENABLED: bool = True
    SWAGGER_UI_ENABLED: bool = True
    SWAGGER_UI_URL: str = "/api/docs"
    REDOC_URL: str = "/api/redoc"
    
    # ==================== DEVELOPMENT TOOLS ====================
    HOT_RELOAD_ENABLED: bool = True
    AUTO_MIGRATE: bool = True
    AUTO_SEED: bool = True
    SEED_DATA_PATH: str = "./database/seeds/dev"
    
    # ==================== MOCK DATA ====================
    MOCK_USERS_COUNT: int = 10
    MOCK_ANIME_COUNT: int = 50
    MOCK_EPISODES_PER_ANIME: int = 12
    MOCK_GROUPS_COUNT: int = 5
    MOCK_MESSAGES_PER_GROUP: int = 100
    
    # ==================== ERROR HANDLING ====================
    SHOW_ERROR_DETAILS: bool = True
    SHOW_STACK_TRACE: bool = True
    PROPAGATE_EXCEPTIONS: bool = True
    
    # ==================== WEBPACK/ASSETS ====================
    ASSETS_DEV_MODE: bool = True
    WEBPACK_DEV_SERVER: str = "http://localhost:8080"
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def init_app(cls, app) -> None:
        """Initialize development app with dev-specific settings"""
        
        # Enable CORS for all origins
        from flask_cors import CORS
        CORS(app, supports_credentials=True)
        
        # Enable debug toolbar
        if cls.DEBUG_TOOLBAR_ENABLED:
            try:
                from flask_debugtoolbar import DebugToolbarExtension
                DebugToolbarExtension(app)
            except ImportError:
                pass
        
        # Setup profiling
        if cls.PROFILING_ENABLED:
            import os
            os.makedirs(cls.PROFILING_DIR, exist_ok=True)
        
        # Print development mode banner
        print("\n" + "=" * 60)
        print("🔧 DEVELOPMENT MODE ENABLED")
        print("=" * 60)
        print(f"📡 Server: http://{cls.HOST}:{cls.PORT}")
        print(f"📚 API Docs: http://{cls.HOST}:{cls.PORT}{cls.SWAGGER_UI_URL}")
        print(f"🗄️  MongoDB: {cls.MONGODB_URI}")
        print(f"⚡ Redis: {cls.REDIS_HOST}:{cls.REDIS_PORT}")
        print(f"🔒 Security: Disabled (CORS, SSL, Rate Limiting)")
        print(f"📧 Email: Console Output")
        print(f"💬 Voice Chat: {'Enabled' if cls.FEATURE_VOICE_CHAT else 'Disabled'}")
        print(f"🎉 Watch Party: {'Enabled' if cls.FEATURE_WATCH_PARTY else 'Disabled'}")
        print(f"👥 Groups: {'Enabled' if cls.FEATURE_GROUPS else 'Disabled'}")
        print(f"💎 Premium: {'Enabled' if cls.FEATURE_PREMIUM else 'Disabled'}")
        print("=" * 60 + "\n")
    
    @classmethod
    def is_debug_mode(cls) -> bool:
        """Check if debug mode is enabled"""
        return cls.DEBUG
    
    @classmethod
    def should_auto_migrate(cls) -> bool:
        """Check if auto migration should run"""
        return cls.AUTO_MIGRATE
    
    @classmethod
    def should_auto_seed(cls) -> bool:
        """Check if auto seeding should run"""
        return cls.AUTO_SEED
    
    @classmethod
    def get_mock_data_count(cls, data_type: str) -> int:
        """Get mock data count for specific type"""
        counts = {
            "users": cls.MOCK_USERS_COUNT,
            "anime": cls.MOCK_ANIME_COUNT,
            "episodes": cls.MOCK_EPISODES_PER_ANIME,
            "groups": cls.MOCK_GROUPS_COUNT,
            "messages": cls.MOCK_MESSAGES_PER_GROUP
        }
        return counts.get(data_type, 0)
    
    @classmethod
    def get_dev_config(cls) -> Dict[str, Any]:
        """Get complete development configuration"""
        return {
            "debug": cls.DEBUG,
            "testing": cls.TESTING,
            "server": {
                "port": cls.PORT,
                "host": cls.HOST,
                "api_url": cls.API_URL,
                "frontend_url": cls.FRONTEND_URL
            },
            "database": {
                "mongodb_uri": cls.MONGODB_URI,
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
                "console": cls.LOG_CONSOLE
            },
            "features": {
                "voice_chat": cls.FEATURE_VOICE_CHAT,
                "watch_party": cls.FEATURE_WATCH_PARTY,
                "groups": cls.FEATURE_GROUPS,
                "premium": cls.FEATURE_PREMIUM
            },
            "tools": {
                "debug_toolbar": cls.DEBUG_TOOLBAR_ENABLED,
                "profiling": cls.PROFILING_ENABLED,
                "api_docs": cls.API_DOCS_ENABLED,
                "hot_reload": cls.HOT_RELOAD_ENABLED
            }
        }


# Create development config instance
dev_config = DevelopmentConfig()

# Print configuration status
if dev_config.DEBUG:
    print("🔧 Development Configuration Loaded")
    print(f"   Server: http://{dev_config.HOST}:{dev_config.PORT}")
    print(f"   Debug: {dev_config.DEBUG}")
    print(f"   Auto Migrate: {dev_config.AUTO_MIGRATE}")
    print(f"   Auto Seed: {dev_config.AUTO_SEED}")
