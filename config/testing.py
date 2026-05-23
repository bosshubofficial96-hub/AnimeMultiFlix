"""
AnimeMultiFlix - Testing Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
import tempfile
from typing import List, Dict, Any, Optional
from .config import Config


class TestingConfig(Config):
    """Testing Environment Configuration"""
    
    # ==================== DEBUG SETTINGS ====================
    DEBUG: bool = False
    TESTING: bool = True
    DEVELOPMENT: bool = False
    STAGING: bool = False
    PRODUCTION: bool = False
    
    # ==================== SERVER SETTINGS ====================
    PORT: int = int(os.getenv("TEST_PORT", 3001))
    HOST: str = os.getenv("TEST_HOST", "localhost")
    API_URL: str = os.getenv("TEST_API_URL", "http://localhost:3001/api")
    FRONTEND_URL: str = os.getenv("TEST_FRONTEND_URL", "http://localhost:3001")
    ADMIN_URL: str = os.getenv("TEST_ADMIN_URL", "http://localhost:3001/admin")
    WS_URL: str = os.getenv("TEST_WS_URL", "ws://localhost:3002")
    
    # ==================== DATABASE SETTINGS ====================
    # Use in-memory or temporary database for testing
    MONGODB_URI: str = os.getenv("TEST_MONGODB_URI", "mongodb://localhost:27017/anime_multiflix_test")
    MONGODB_DB: str = os.getenv("TEST_MONGODB_DB", "anime_multiflix_test")
    MONGODB_POOL_SIZE: int = 2
    MONGODB_MIN_POOL_SIZE: int = 1
    MONGODB_MAX_IDLE_TIME: int = 10000
    MONGODB_CONNECT_TIMEOUT: int = 5000
    MONGODB_SOCKET_TIMEOUT: int = 10000
    MONGODB_SERVER_SELECTION_TIMEOUT: int = 5000
    MONGODB_RETRY_WRITES: bool = False
    MONGODB_RETRY_READS: bool = False
    MONGODB_SSL: bool = False
    
    # ==================== REDIS SETTINGS ====================
    REDIS_ENABLED: bool = False  # Disable Redis for testing, use mock
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 15  # Use separate DB for testing
    REDIS_KEY_PREFIX: str = "amf:test:"
    REDIS_TTL: int = 60
    
    # ==================== POSTGRESQL SETTINGS ====================
    POSTGRES_ENABLED: bool = False  # Disable for testing
    
    # ==================== SECURITY SETTINGS (Disabled for Testing) ====================
    SSL_ENABLED: bool = False
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"
    SESSION_COOKIE_MAX_AGE: int = 3600  # 1 hour
    
    # Rate Limiting (Disabled for testing)
    RATE_LIMIT_ENABLED: bool = False
    
    # CSRF Protection (Disabled for testing)
    CSRF_ENABLED: bool = False
    
    # Helmet Security Headers (Disabled for testing)
    HELMET_ENABLED: bool = False
    CSP_ENABLED: bool = False
    HSTS_ENABLED: bool = False
    
    # CORS Settings (Allow all for testing)
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400
    
    # ==================== LOGGING SETTINGS ====================
    LOG_LEVEL: str = "ERROR"  # Only log errors in tests
    LOG_CONSOLE: bool = False
    LOG_FILE: bool = False
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # ==================== CACHE SETTINGS ====================
    CACHE_TYPE: str = "simple"  # Use simple cache for testing
    CACHE_DEFAULT_TIMEOUT: int = 60
    CACHE_KEY_PREFIX: str = "amf_test:cache:"
    REDIS_CACHE_ENABLED: bool = False
    
    # ==================== QUEUE SETTINGS ====================
    QUEUE_ENABLED: bool = False  # Disable queues for testing
    ASYNC_TASKS_ENABLED: bool = False
    
    # ==================== EMAIL SETTINGS ====================
    EMAIL_ENABLED: bool = False
    EMAIL_BACKEND: str = "console"  # Print to console
    EMAIL_HOST: str = "localhost"
    EMAIL_PORT: int = 1025
    
    # ==================== SMS SETTINGS ====================
    SMS_ENABLED: bool = False
    
    # ==================== PAYMENT SETTINGS (Mock) ====================
    STRIPE_ENABLED: bool = False
    PAYPAL_ENABLED: bool = False
    RAZORPAY_ENABLED: bool = False
    USE_TEST_PAYMENT_GATEWAY: bool = True
    MOCK_PAYMENTS: bool = True
    
    # ==================== FILE UPLOAD SETTINGS ====================
    MAX_CONTENT_LENGTH: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER: str = tempfile.mkdtemp()  # Temporary folder for tests
    ALLOWED_EXTENSIONS: List[str] = [
        "mp4", "jpg", "jpeg", "png", "srt", "vtt"
    ]
    
    # ==================== EXTERNAL SERVICES (Mock) ====================
    MOCK_EXTERNAL_APIS: bool = True
    MOCK_ML_SERVICES: bool = True
    MOCK_RECOMMENDATIONS: bool = True
    MOCK_TRANSLATIONS: bool = True
    MOCK_EMAILS: bool = True
    MOCK_SMS: bool = True
    
    # ==================== FEATURE FLAGS ====================
    FEATURE_VOICE_CHAT: bool = True
    FEATURE_WATCH_PARTY: bool = True
    FEATURE_GROUPS: bool = True
    FEATURE_PREMIUM: bool = True
    FEATURE_ANALYTICS: bool = False
    FEATURE_NOTIFICATIONS: bool = False
    FEATURE_SOCIAL_LOGIN: bool = True
    FEATURE_TWO_FACTOR: bool = False
    FEATURE_OFFLINE_DOWNLOAD: bool = False
    
    # ==================== TEST DATA ====================
    TEST_USER_EMAIL: str = "test@example.com"
    TEST_USER_USERNAME: str = "testuser"
    TEST_USER_PASSWORD: str = "Test@123456"
    TEST_ADMIN_EMAIL: str = "admin@example.com"
    TEST_ADMIN_PASSWORD: str = "Admin@123456"
    
    # ==================== API SETTINGS ====================
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api"
    API_RATE_LIMIT: int = 10000  # High limit for testing
    API_DEBUG: bool = True
    
    # ==================== TEST COVERAGE ====================
    COVERAGE_REQUIRED: float = 80.0  # 80% coverage required
    COVERAGE_REPORT_PATH: str = "./coverage"
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def init_app(cls, app) -> None:
        """Initialize testing app with test-specific settings"""
        
        # Enable CORS for testing
        from flask_cors import CORS
        CORS(app, origins="*", supports_credentials=True)
        
        # Setup test database
        cls._setup_test_database()
        
        # Print testing mode banner
        print("\n" + "=" * 60)
        print("🧪 TESTING MODE ENABLED")
        print("=" * 60)
        print(f"📡 Server: http://{cls.HOST}:{cls.PORT}")
        print(f"🗄️  Test Database: {cls.MONGODB_DB}")
        print(f"🔒 Security: Disabled (Rate Limiting, CSRF, SSL)")
        print(f"📧 Email: Mocked")
        print(f"💳 Payments: Mocked")
        print(f"🤖 External APIs: Mocked")
        print("=" * 60 + "\n")
    
    @classmethod
    def _setup_test_database(cls) -> None:
        """Setup test database (clear before tests)"""
        # This method would be implemented to clear test database
        pass
    
    @classmethod
    def is_testing(cls) -> bool:
        """Check if environment is testing"""
        return True
    
    @classmethod
    def should_mock_services(cls) -> bool:
        """Check if services should be mocked"""
        return True
    
    @classmethod
    def get_test_user(cls) -> Dict[str, str]:
        """Get test user credentials"""
        return {
            "email": cls.TEST_USER_EMAIL,
            "username": cls.TEST_USER_USERNAME,
            "password": cls.TEST_USER_PASSWORD
        }
    
    @classmethod
    def get_test_admin(cls) -> Dict[str, str]:
        """Get test admin credentials"""
        return {
            "email": cls.TEST_ADMIN_EMAIL,
            "password": cls.TEST_ADMIN_PASSWORD
        }
    
    @classmethod
    def get_upload_folder(cls) -> str:
        """Get temporary upload folder for tests"""
        return cls.UPLOAD_FOLDER
    
    @classmethod
    def get_coverage_requirement(cls) -> float:
        """Get required test coverage percentage"""
        return cls.COVERAGE_REQUIRED
    
    @classmethod
    def get_test_config(cls) -> Dict[str, Any]:
        """Get complete testing configuration"""
        return {
            "debug": cls.DEBUG,
            "testing": cls.TESTING,
            "server": {
                "port": cls.PORT,
                "host": cls.HOST,
                "api_url": cls.API_URL
            },
            "database": {
                "mongodb_uri": cls.MONGODB_URI,
                "mongodb_db": cls.MONGODB_DB
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
            "mock_services": {
                "external_apis": cls.MOCK_EXTERNAL_APIS,
                "ml_services": cls.MOCK_ML_SERVICES,
                "payments": cls.MOCK_PAYMENTS,
                "emails": cls.MOCK_EMAILS
            },
            "test_data": {
                "user": cls.get_test_user(),
                "admin": cls.get_test_admin()
            },
            "coverage": {
                "required": cls.COVERAGE_REQUIRED,
                "report_path": cls.COVERAGE_REPORT_PATH
            }
        }


# Create testing config instance
testing_config = TestingConfig()

# Print configuration status
if testing_config.TESTING:
    print("🧪 Testing Configuration Loaded")
    print(f"   Test Database: {testing_config.MONGODB_DB}")
    print(f"   Mock Services: {testing_config.should_mock_services()}")
    print(f"   Rate Limiting: {'Disabled' if not testing_config.RATE_LIMIT_ENABLED else 'Enabled'}")
    print(f"   Coverage Required: {testing_config.get_coverage_requirement()}%")
