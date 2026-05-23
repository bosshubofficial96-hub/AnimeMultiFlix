"""
AnimeMultiFlix - Security Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
import secrets
from typing import Dict, List, Any, Optional, Tuple
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class SecurityConfig:
    """Security Configuration Class"""
    
    # ==================== GENERAL SECURITY ====================
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", secrets.token_urlsafe(32))
    SALT_ROUNDS: int = int(os.getenv("SALT_ROUNDS", 12))
    
    # ==================== HELMET SECURITY HEADERS ====================
    HELMET_ENABLED: bool = os.getenv("HELMET_ENABLED", "true").lower() == "true"
    
    # Content Security Policy (CSP)
    CSP_ENABLED: bool = os.getenv("CSP_ENABLED", "true").lower() == "true"
    CSP_DIRECTIVES: Dict[str, List[str]] = {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "connect-src": ["'self'", "wss:", "https://api.animemultiflix.com"],
        "media-src": ["'self'", "https:", "blob:"],
        "frame-src": ["'none'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"]
    }
    
    # HSTS (HTTP Strict Transport Security)
    HSTS_ENABLED: bool = os.getenv("HSTS_ENABLED", "true").lower() == "true"
    HSTS_MAX_AGE: int = int(os.getenv("HSTS_MAX_AGE", 31536000))  # 1 year
    HSTS_INCLUDE_SUBDOMAINS: bool = os.getenv("HSTS_INCLUDE_SUBDOMAINS", "true").lower() == "true"
    HSTS_PRELOAD: bool = os.getenv("HSTS_PRELOAD", "true").lower() == "true"
    
    # Other Security Headers
    X_FRAME_OPTIONS: str = "DENY"
    X_CONTENT_TYPE_OPTIONS: str = "nosniff"
    X_XSS_PROTECTION: str = "1; mode=block"
    REFERRER_POLICY: str = "strict-origin-when-cross-origin"
    PERMISSIONS_POLICY: Dict[str, List[str]] = {
        "geolocation": [],
        "microphone": ["'self'"],
        "camera": ["'self'"],
        "fullscreen": ["'self'"]
    }
    
    # ==================== CORS SETTINGS ====================
    CORS_ENABLED: bool = os.getenv("CORS_ENABLED", "true").lower() == "true"
    CORS_ALLOWED_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://animemultiflix.me").split(",")
    CORS_ALLOWED_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    CORS_ALLOWED_HEADERS: List[str] = [
        "Content-Type", "Authorization", "X-Requested-With", "Accept",
        "Origin", "X-CSRF-Token", "X-API-Key", "X-Session-Token"
    ]
    CORS_EXPOSED_HEADERS: List[str] = [
        "X-Total-Count", "X-Page", "X-Total-Pages", "X-Per-Page",
        "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 86400
    
    # ==================== RATE LIMITING ====================
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    RATE_LIMIT_STORE: str = os.getenv("RATE_LIMIT_STORE", "redis")  # redis, memory
    
    # Global Rate Limits
    RATE_LIMIT_GLOBAL: Dict[str, int] = {
        "window_seconds": 60,
        "max_requests": 100
    }
    
    # Endpoint Specific Rate Limits
    RATE_LIMIT_ENDPOINTS: Dict[str, Dict[str, int]] = {
        "auth_login": {"window": 900, "max": 5},      # 5 per 15 minutes
        "auth_register": {"window": 3600, "max": 3},  # 3 per hour
        "auth_verify": {"window": 3600, "max": 10},   # 10 per hour
        "auth_reset": {"window": 3600, "max": 3},     # 3 per hour
        "api_anime": {"window": 60, "max": 60},       # 60 per minute
        "api_search": {"window": 60, "max": 30},      # 30 per minute
        "api_upload": {"window": 3600, "max": 10},    # 10 per hour
        "chat_send": {"window": 60, "max": 60},       # 60 per minute
        "voice_join": {"window": 60, "max": 10},      # 10 per minute
        "group_create": {"window": 3600, "max": 5}    # 5 per hour
    }
    
    # ==================== CSRF PROTECTION ====================
    CSRF_ENABLED: bool = os.getenv("CSRF_ENABLED", "true").lower() == "true"
    CSRF_COOKIE_NAME: str = "csrf_token"
    CSRF_COOKIE_SECURE: bool = os.getenv("NODE_ENV") == "production"
    CSRF_COOKIE_HTTPONLY: bool = False
    CSRF_COOKIE_SAMESITE: str = "lax"
    CSRF_HEADER_NAME: str = "X-CSRF-Token"
    CSRF_TOKEN_LENGTH: int = 32
    CSRF_TOKEN_EXPIRY: int = 3600  # 1 hour
    
    # ==================== XSS PROTECTION ====================
    XSS_PROTECTION_ENABLED: bool = os.getenv("XSS_PROTECTION_ENABLED", "true").lower() == "true"
    XSS_TRUSTED_DOMAINS: List[str] = [
        "animemultiflix.com",
        "api.animemultiflix.com",
        "cdn.animemultiflix.com"
    ]
    
    # ==================== SQL INJECTION PROTECTION ====================
    SQL_INJECTION_ENABLED: bool = os.getenv("SQL_INJECTION_ENABLED", "true").lower() == "true"
    SQL_INJECTION_PATTERNS: List[str] = [
        " UNION ", " SELECT ", " INSERT ", " UPDATE ", " DELETE ",
        " DROP ", " CREATE ", " ALTER ", " EXEC ", " EXECUTE ",
        " -- ", " /* ", " */ ", " @@", " @"
    ]
    
    # ==================== INPUT VALIDATION ====================
    INPUT_VALIDATION_ENABLED: bool = True
    INPUT_MAX_LENGTH: Dict[str, int] = {
        "username": 50,
        "email": 255,
        "password": 128,
        "message": 5000,
        "group_name": 100,
        "anime_title": 200,
        "comment": 2000
    }
    
    INPUT_SANITIZE_PATTERNS: Dict[str, str] = {
        "email": r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        "username": r'^[a-zA-Z0-9_]{3,50}$',
        "phone": r'^\+?[1-9]\d{1,14}$'
    }
    
    # ==================== IP FILTERING ====================
    IP_FILTERING_ENABLED: bool = os.getenv("IP_FILTERING_ENABLED", "false").lower() == "true"
    IP_WHITELIST: List[str] = os.getenv("IP_WHITELIST", "").split(",") if os.getenv("IP_WHITELIST") else []
    IP_BLACKLIST: List[str] = os.getenv("IP_BLACKLIST", "").split(",") if os.getenv("IP_BLACKLIST") else []
    IP_BAN_DURATION: int = int(os.getenv("IP_BAN_DURATION", 86400))  # 24 hours
    IP_MAX_FAILED_ATTEMPTS: int = int(os.getenv("IP_MAX_FAILED_ATTEMPTS", 10))
    
    # Country Blocking
    COUNTRY_BLOCKING_ENABLED: bool = os.getenv("COUNTRY_BLOCKING_ENABLED", "false").lower() == "true"
    COUNTRY_BLACKLIST: List[str] = os.getenv("COUNTRY_BLACKLIST", "").split(",") if os.getenv("COUNTRY_BLACKLIST") else []
    COUNTRY_WHITELIST: List[str] = os.getenv("COUNTRY_WHITELIST", "").split(",") if os.getenv("COUNTRY_WHITELIST") else []
    
    # ==================== ENCRYPTION ====================
    ENCRYPTION_ALGORITHM: str = os.getenv("ENCRYPTION_ALGORITHM", "aes-256-gcm")
    ENCRYPTION_KEY_DERIVATION: str = os.getenv("ENCRYPTION_KEY_DERIVATION", "pbkdf2")
    ENCRYPTION_ITERATIONS: int = int(os.getenv("ENCRYPTION_ITERATIONS", 100000))
    ENCRYPTION_SALT_LENGTH: int = 16
    ENCRYPTION_IV_LENGTH: int = 12
    
    # Data at Rest Encryption
    DATABASE_ENCRYPTION_ENABLED: bool = os.getenv("DATABASE_ENCRYPTION_ENABLED", "true").lower() == "true"
    DATABASE_ENCRYPTION_FIELDS: List[str] = [
        "email", "phone", "address", "payment_info"
    ]
    
    # ==================== SESSION SECURITY ====================
    SESSION_SECURE: bool = os.getenv("SESSION_SECURE", "true").lower() == "true"
    SESSION_HTTPONLY: bool = True
    SESSION_SAMESITE: str = "lax"
    SESSION_MAX_AGE: int = int(os.getenv("SESSION_MAX_AGE", 604800))  # 7 days
    SESSION_REFRESH_INTERVAL: int = int(os.getenv("SESSION_REFRESH_INTERVAL", 3600))  # 1 hour
    
    # Session Storage
    SESSION_STORE: str = os.getenv("SESSION_STORE", "redis")  # redis, memory, database
    SESSION_REDIS_TTL: int = int(os.getenv("SESSION_REDIS_TTL", 604800))  # 7 days
    
    # ==================== TOKEN SECURITY ====================
    JWT_SECRET: str = os.getenv("JWT_SECRET", secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRY: int = int(os.getenv("JWT_ACCESS_EXPIRY", 3600))  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRY: int = int(os.getenv("JWT_REFRESH_EXPIRY", 2592000))  # 30 days
    JWT_ISSUER: str = "animemultiflix"
    JWT_AUDIENCE: str = "animemultiflix-api"
    
    # Password Reset Token
    PASSWORD_RESET_TOKEN_EXPIRY: int = int(os.getenv("PASSWORD_RESET_EXPIRY", 3600))  # 1 hour
    PASSWORD_RESET_TOKEN_LENGTH: int = 32
    
    # Email Verification Token
    EMAIL_VERIFICATION_TOKEN_EXPIRY: int = int(os.getenv("EMAIL_VERIFICATION_EXPIRY", 86400))  # 24 hours
    EMAIL_VERIFICATION_TOKEN_LENGTH: int = 32
    
    # API Token
    API_TOKEN_EXPIRY: int = int(os.getenv("API_TOKEN_EXPIRY", 31536000))  # 1 year
    API_TOKEN_LENGTH: int = 32
    
    # ==================== BRUTE FORCE PROTECTION ====================
    BRUTE_FORCE_PROTECTION_ENABLED: bool = os.getenv("BRUTE_FORCE_ENABLED", "true").lower() == "true"
    BRUTE_FORCE_MAX_ATTEMPTS: int = int(os.getenv("BRUTE_FORCE_MAX_ATTEMPTS", 5))
    BRUTE_FORCE_WINDOW: int = int(os.getenv("BRUTE_FORCE_WINDOW", 900))  # 15 minutes
    BRUTE_FORCE_LOCKOUT_DURATION: int = int(os.getenv("BRUTE_FORCE_LOCKOUT", 3600))  # 1 hour
    
    # Account Lockout
    ACCOUNT_LOCKOUT_ENABLED: bool = os.getenv("ACCOUNT_LOCKOUT_ENABLED", "true").lower() == "true"
    ACCOUNT_LOCKOUT_MAX_ATTEMPTS: int = int(os.getenv("ACCOUNT_LOCKOUT_MAX", 10))
    ACCOUNT_LOCKOUT_DURATION: int = int(os.getenv("ACCOUNT_LOCKOUT_DURATION", 1800))  # 30 minutes
    
    # ==================== DDOS PROTECTION ====================
    DDOS_PROTECTION_ENABLED: bool = os.getenv("DDOS_PROTECTION_ENABLED", "true").lower() == "true"
    DDOS_MAX_REQUESTS_PER_IP: int = int(os.getenv("DDOS_MAX_REQUESTS", 1000))
    DDOS_WINDOW: int = int(os.getenv("DDOS_WINDOW", 60))  # 1 minute
    DDOS_BAN_DURATION: int = int(os.getenv("DDOS_BAN_DURATION", 3600))  # 1 hour
    
    # ==================== SSL/TLS ====================
    SSL_ENABLED: bool = os.getenv("SSL_ENABLED", "true").lower() == "true"
    SSL_CERT_PATH: Optional[str] = os.getenv("SSL_CERT_PATH")
    SSL_KEY_PATH: Optional[str] = os.getenv("SSL_KEY_PATH")
    SSL_MIN_VERSION: str = "TLSv1.2"
    SSL_CIPHERS: str = "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256"
    
    # ==================== WEBHOOK SECURITY ====================
    WEBHOOK_SIGNATURE_HEADER: str = "X-Webhook-Signature"
    WEBHOOK_SIGNATURE_ALGORITHM: str = "sha256"
    WEBHOOK_TIMEOUT: int = int(os.getenv("WEBHOOK_TIMEOUT", 5))  # seconds
    WEBHOOK_RETRY_ATTEMPTS: int = int(os.getenv("WEBHOOK_RETRY", 3))
    
    # ==================== API SECURITY ====================
    API_KEY_REQUIRED: bool = os.getenv("API_KEY_REQUIRED", "false").lower() == "true"
    API_KEY_HEADER: str = "X-API-Key"
    API_RATE_LIMIT: int = int(os.getenv("API_RATE_LIMIT", 1000))  # per hour
    
    # ==================== FILE UPLOAD SECURITY ====================
    UPLOAD_SECURITY_ENABLED: bool = True
    UPLOAD_SCAN_VIRUS: bool = os.getenv("UPLOAD_SCAN_VIRUS", "true").lower() == "true"
    UPLOAD_ALLOWED_MIME_TYPES: List[str] = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "video/mp4", "video/webm", "video/quicktime",
        "audio/mpeg", "audio/ogg", "audio/wav",
        "application/pdf", "text/plain"
    ]
    UPLOAD_MAX_SIZE: int = int(os.getenv("UPLOAD_MAX_SIZE", 100 * 1024 * 1024))  # 100MB
    UPLOAD_SCAN_MALWARE: bool = True
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_csp_directives(cls) -> Dict[str, List[str]]:
        """Get CSP directives"""
        return cls.CSP_DIRECTIVES
    
    @classmethod
    def get_cors_config(cls) -> Dict[str, Any]:
        """Get CORS configuration"""
        return {
            "enabled": cls.CORS_ENABLED,
            "origins": cls.CORS_ALLOWED_ORIGINS,
            "methods": cls.CORS_ALLOWED_METHODS,
            "headers": cls.CORS_ALLOWED_HEADERS,
            "exposed_headers": cls.CORS_EXPOSED_HEADERS,
            "credentials": cls.CORS_ALLOW_CREDENTIALS,
            "max_age": cls.CORS_MAX_AGE
        }
    
    @classmethod
    def get_rate_limit(cls, endpoint: str) -> Dict[str, int]:
        """Get rate limit for endpoint"""
        return cls.RATE_LIMIT_ENDPOINTS.get(endpoint, cls.RATE_LIMIT_GLOBAL)
    
    @classmethod
    def is_ip_allowed(cls, ip: str) -> bool:
        """Check if IP is allowed"""
        if not cls.IP_FILTERING_ENABLED:
            return True
        
        if cls.IP_BLACKLIST and ip in cls.IP_BLACKLIST:
            return False
        
        if cls.IP_WHITELIST and ip not in cls.IP_WHITELIST:
            return False
        
        return True
    
    @classmethod
    def is_country_allowed(cls, country_code: str) -> bool:
        """Check if country is allowed"""
        if not cls.COUNTRY_BLOCKING_ENABLED:
            return True
        
        if cls.COUNTRY_BLACKLIST and country_code in cls.COUNTRY_BLACKLIST:
            return False
        
        if cls.COUNTRY_WHITELIST and country_code not in cls.COUNTRY_WHITELIST:
            return False
        
        return True
    
    @classmethod
    def validate_input(cls, field: str, value: str) -> Tuple[bool, Optional[str]]:
        """Validate input field"""
        max_length = cls.INPUT_MAX_LENGTH.get(field)
        if max_length and len(value) > max_length:
            return False, f"Field {field} exceeds maximum length of {max_length}"
        
        pattern = cls.INPUT_SANITIZE_PATTERNS.get(field)
        if pattern:
            import re
            if not re.match(pattern, value):
                return False, f"Invalid format for field {field}"
        
        return True, None
    
    @classmethod
    def get_jwt_config(cls) -> Dict[str, Any]:
        """Get JWT configuration"""
        return {
            "secret": cls.JWT_SECRET,
            "algorithm": cls.JWT_ALGORITHM,
            "access_expiry": cls.JWT_ACCESS_TOKEN_EXPIRY,
            "refresh_expiry": cls.JWT_REFRESH_TOKEN_EXPIRY,
            "issuer": cls.JWT_ISSUER,
            "audience": cls.JWT_AUDIENCE
        }
    
    @classmethod
    def get_encryption_config(cls) -> Dict[str, Any]:
        """Get encryption configuration"""
        return {
            "algorithm": cls.ENCRYPTION_ALGORITHM,
            "key_derivation": cls.ENCRYPTION_KEY_DERIVATION,
            "iterations": cls.ENCRYPTION_ITERATIONS,
            "salt_length": cls.ENCRYPTION_SALT_LENGTH,
            "iv_length": cls.ENCRYPTION_IV_LENGTH
        }
    
    @classmethod
    def encrypt_data(cls, data: str) -> bytes:
        """Encrypt sensitive data"""
        from cryptography.fernet import Fernet
        
        key = base64.urlsafe_b64encode(cls.ENCRYPTION_KEY.encode()[:32])
        f = Fernet(key)
        return f.encrypt(data.encode())
    
    @classmethod
    def decrypt_data(cls, encrypted_data: bytes) -> str:
        """Decrypt sensitive data"""
        from cryptography.fernet import Fernet
        
        key = base64.urlsafe_b64encode(cls.ENCRYPTION_KEY.encode()[:32])
        f = Fernet(key)
        return f.decrypt(encrypted_data).decode()
    
    @classmethod
    def is_session_secure(cls) -> bool:
        """Check if session should be secure"""
        return cls.SESSION_SECURE and cls.SSL_ENABLED
    
    @classmethod
    def get_session_config(cls) -> Dict[str, Any]:
        """Get session configuration"""
        return {
            "secure": cls.is_session_secure(),
            "http_only": cls.SESSION_HTTPONLY,
            "same_site": cls.SESSION_SAMESITE,
            "max_age": cls.SESSION_MAX_AGE,
            "refresh_interval": cls.SESSION_REFRESH_INTERVAL,
            "store": cls.SESSION_STORE
        }
    
    @classmethod
    def generate_csrf_token(cls) -> str:
        """Generate CSRF token"""
        import secrets
        return secrets.token_urlsafe(cls.CSRF_TOKEN_LENGTH)
    
    @classmethod
    def generate_api_token(cls) -> str:
        """Generate API token"""
        import secrets
        return secrets.token_urlsafe(cls.API_TOKEN_LENGTH)
    
    @classmethod
    def generate_reset_token(cls) -> str:
        """Generate password reset token"""
        import secrets
        return secrets.token_urlsafe(cls.PASSWORD_RESET_TOKEN_LENGTH)
    
    @classmethod
    def is_upload_allowed(cls, mime_type: str, file_size: int) -> bool:
        """Check if file upload is allowed"""
        if mime_type not in cls.UPLOAD_ALLOWED_MIME_TYPES:
            return False
        
        if file_size > cls.UPLOAD_MAX_SIZE:
            return False
        
        return True
    
    @classmethod
    def get_security_headers(cls) -> Dict[str, str]:
        """Get security headers"""
        headers = {
            "X-Frame-Options": cls.X_FRAME_OPTIONS,
            "X-Content-Type-Options": cls.X_CONTENT_TYPE_OPTIONS,
            "X-XSS-Protection": cls.X_XSS_PROTECTION,
            "Referrer-Policy": cls.REFERRER_POLICY
        }
        
        if cls.HSTS_ENABLED:
            hsts_value = f"max-age={cls.HSTS_MAX_AGE}"
            if cls.HSTS_INCLUDE_SUBDOMAINS:
                hsts_value += "; includeSubDomains"
            if cls.HSTS_PRELOAD:
                hsts_value += "; preload"
            headers["Strict-Transport-Security"] = hsts_value
        
        return headers


# Create security config instance
security_config = SecurityConfig()

# Print security configuration status
print(f"🔒 Security Configuration")
print(f"   Helmet: {'Enabled' if security_config.HELMET_ENABLED else 'Disabled'}")
print(f"   CSP: {'Enabled' if security_config.CSP_ENABLED else 'Disabled'}")
print(f"   HSTS: {'Enabled' if security_config.HSTS_ENABLED else 'Disabled'}")
print(f"   Rate Limiting: {'Enabled' if security_config.RATE_LIMIT_ENABLED else 'Disabled'}")
print(f"   CSRF: {'Enabled' if security_config.CSRF_ENABLED else 'Disabled'}")
print(f"   SSL: {'Enabled' if security_config.SSL_ENABLED else 'Disabled'}")
