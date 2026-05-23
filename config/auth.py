"""
AnimeMultiFlix - Authentication Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
import secrets
from typing import List, Dict, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class AuthConfig:
    """Authentication Configuration Class"""
    
    # ==================== JWT SETTINGS ====================
    JWT_SECRET: str = os.getenv("JWT_SECRET", secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: int = 7 * 24 * 60 * 60  # 7 days in seconds
    JWT_REFRESH_EXPIRES_IN: int = 30 * 24 * 60 * 60  # 30 days
    JWT_TOKEN_TYPE: str = "Bearer"
    JWT_AUDIENCE: str = "animemultiflix-api"
    JWT_ISSUER: str = "animemultiflix"
    
    # JWT Cookie Settings
    JWT_COOKIE_NAME: str = "amf_token"
    JWT_COOKIE_SECURE: bool = os.getenv("NODE_ENV") == "production"
    JWT_COOKIE_HTTPONLY: bool = True
    JWT_COOKIE_SAMESITE: str = "lax"
    JWT_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    
    # ==================== PASSWORD POLICY ====================
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_MAX_LENGTH: int = 32
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    PASSWORD_SPECIAL_CHARS: str = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Password Hashing
    PASSWORD_BCRYPT_ROUNDS: int = 12
    PASSWORD_ALGORITHM: str = "bcrypt"  # bcrypt, argon2, scrypt
    
    # Password History & Expiry
    PASSWORD_HISTORY_COUNT: int = 5
    PASSWORD_EXPIRY_DAYS: int = 90
    PASSWORD_EXPIRY_WARNING_DAYS: int = 7
    
    # ==================== TWO-FACTOR AUTHENTICATION ====================
    TFA_ENABLED: bool = os.getenv("TFA_ENABLED", "true").lower() == "true"
    TFA_ISSUER: str = "AnimeMultiFlix"
    TFA_ALGORITHM: str = "SHA1"
    TFA_DIGITS: int = 6
    TFA_PERIOD: int = 30
    TFA_BACKUP_CODES: int = 10
    TFA_BACKUP_CODE_LENGTH: int = 8
    
    # TFA Delivery Methods
    TFA_METHODS: List[str] = ["authenticator", "sms", "email"]
    TFA_DEFAULT_METHOD: str = "authenticator"
    
    # ==================== OTP SETTINGS ====================
    OTP_LENGTH: int = 6
    OTP_EXPIRY: int = 10 * 60  # 10 minutes in seconds
    OTP_RESEND_COOLDOWN: int = 30  # seconds
    OTP_MAX_ATTEMPTS: int = 3
    OTP_LOCKOUT_DURATION: int = 15 * 60  # 15 minutes
    OTP_DELIVERY: List[str] = ["email", "sms"]
    
    # ==================== OAUTH PROVIDERS ====================
    
    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "/api/auth/google/callback")
    GOOGLE_AUTHORIZATION_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v2/userinfo"
    GOOGLE_SCOPES: List[str] = [
        "openid",
        "email", 
        "profile",
        "https://www.googleapis.com/auth/user.birthday.read",
        "https://www.googleapis.com/auth/user.gender.read"
    ]
    GOOGLE_PROMPT: str = "select_account"
    GOOGLE_ACCESS_TYPE: str = "offline"
    
    # Discord OAuth 2.0
    DISCORD_CLIENT_ID: str = os.getenv("DISCORD_CLIENT_ID", "")
    DISCORD_CLIENT_SECRET: str = os.getenv("DISCORD_CLIENT_SECRET", "")
    DISCORD_REDIRECT_URI: str = os.getenv("DISCORD_REDIRECT_URI", "/api/auth/discord/callback")
    DISCORD_AUTHORIZATION_URL: str = "https://discord.com/api/oauth2/authorize"
    DISCORD_TOKEN_URL: str = "https://discord.com/api/oauth2/token"
    DISCORD_USERINFO_URL: str = "https://discord.com/api/users/@me"
    DISCORD_SCOPES: List[str] = ["identify", "email", "guilds.join"]
    
    # Facebook OAuth 2.0
    FACEBOOK_CLIENT_ID: str = os.getenv("FACEBOOK_CLIENT_ID", "")
    FACEBOOK_CLIENT_SECRET: str = os.getenv("FACEBOOK_CLIENT_SECRET", "")
    FACEBOOK_REDIRECT_URI: str = os.getenv("FACEBOOK_REDIRECT_URI", "/api/auth/facebook/callback")
    FACEBOOK_AUTHORIZATION_URL: str = "https://www.facebook.com/v18.0/dialog/oauth"
    FACEBOOK_TOKEN_URL: str = "https://graph.facebook.com/v18.0/oauth/access_token"
    FACEBOOK_USERINFO_URL: str = "https://graph.facebook.com/me"
    FACEBOOK_SCOPES: List[str] = ["email", "public_profile", "user_birthday", "user_gender"]
    FACEBOOK_API_VERSION: str = "v18.0"
    
    # Apple OAuth 2.0
    APPLE_CLIENT_ID: str = os.getenv("APPLE_CLIENT_ID", "")
    APPLE_TEAM_ID: str = os.getenv("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.getenv("APPLE_KEY_ID", "")
    APPLE_PRIVATE_KEY: str = os.getenv("APPLE_PRIVATE_KEY", "")
    APPLE_REDIRECT_URI: str = os.getenv("APPLE_REDIRECT_URI", "/api/auth/apple/callback")
    APPLE_AUTHORIZATION_URL: str = "https://appleid.apple.com/auth/authorize"
    APPLE_TOKEN_URL: str = "https://appleid.apple.com/auth/token"
    APPLE_SCOPES: List[str] = ["name", "email"]
    APPLE_RESPONSE_MODE: str = "form_post"
    
    # GitHub OAuth 2.0
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI: str = os.getenv("GITHUB_REDIRECT_URI", "/api/auth/github/callback")
    GITHUB_AUTHORIZATION_URL: str = "https://github.com/login/oauth/authorize"
    GITHUB_TOKEN_URL: str = "https://github.com/login/oauth/access_token"
    GITHUB_USERINFO_URL: str = "https://api.github.com/user"
    GITHUB_EMAIL_URL: str = "https://api.github.com/user/emails"
    GITHUB_SCOPES: List[str] = ["user:email", "read:user"]
    
    # Twitter OAuth 2.0
    TWITTER_CLIENT_ID: str = os.getenv("TWITTER_CLIENT_ID", "")
    TWITTER_CLIENT_SECRET: str = os.getenv("TWITTER_CLIENT_SECRET", "")
    TWITTER_REDIRECT_URI: str = os.getenv("TWITTER_REDIRECT_URI", "/api/auth/twitter/callback")
    TWITTER_AUTHORIZATION_URL: str = "https://twitter.com/i/oauth2/authorize"
    TWITTER_TOKEN_URL: str = "https://api.twitter.com/2/oauth2/token"
    TWITTER_USERINFO_URL: str = "https://api.twitter.com/2/users/me"
    TWITTER_SCOPES: List[str] = ["users.read", "tweet.read", "offline.access"]
    
    # LinkedIn OAuth 2.0
    LINKEDIN_CLIENT_ID: str = os.getenv("LINKEDIN_CLIENT_ID", "")
    LINKEDIN_CLIENT_SECRET: str = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    LINKEDIN_REDIRECT_URI: str = os.getenv("LINKEDIN_REDIRECT_URI", "/api/auth/linkedin/callback")
    LINKEDIN_AUTHORIZATION_URL: str = "https://www.linkedin.com/oauth/v2/authorization"
    LINKEDIN_TOKEN_URL: str = "https://www.linkedin.com/oauth/v2/accessToken"
    LINKEDIN_USERINFO_URL: str = "https://api.linkedin.com/v2/userinfo"
    LINKEDIN_SCOPES: List[str] = ["openid", "profile", "email"]
    
    # Twitch OAuth 2.0
    TWITCH_CLIENT_ID: str = os.getenv("TWITCH_CLIENT_ID", "")
    TWITCH_CLIENT_SECRET: str = os.getenv("TWITCH_CLIENT_SECRET", "")
    TWITCH_REDIRECT_URI: str = os.getenv("TWITCH_REDIRECT_URI", "/api/auth/twitch/callback")
    TWITCH_AUTHORIZATION_URL: str = "https://id.twitch.tv/oauth2/authorize"
    TWITCH_TOKEN_URL: str = "https://id.twitch.tv/oauth2/token"
    TWITCH_USERINFO_URL: str = "https://api.twitch.tv/helix/users"
    TWITCH_SCOPES: List[str] = ["user:read:email"]
    
    # Reddit OAuth 2.0
    REDDIT_CLIENT_ID: str = os.getenv("REDDIT_CLIENT_ID", "")
    REDDIT_CLIENT_SECRET: str = os.getenv("REDDIT_CLIENT_SECRET", "")
    REDDIT_REDIRECT_URI: str = os.getenv("REDDIT_REDIRECT_URI", "/api/auth/reddit/callback")
    REDDIT_AUTHORIZATION_URL: str = "https://www.reddit.com/api/v1/authorize"
    REDDIT_TOKEN_URL: str = "https://www.reddit.com/api/v1/access_token"
    REDDIT_USERINFO_URL: str = "https://oauth.reddit.com/api/v1/me"
    REDDIT_SCOPES: List[str] = ["identity", "read"]
    
    # Telegram OAuth
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_REDIRECT_URI: str = os.getenv("TELEGRAM_REDIRECT_URI", "/api/auth/telegram/callback")
    
    # LINE OAuth 2.0
    LINE_CLIENT_ID: str = os.getenv("LINE_CLIENT_ID", "")
    LINE_CLIENT_SECRET: str = os.getenv("LINE_CLIENT_SECRET", "")
    LINE_REDIRECT_URI: str = os.getenv("LINE_REDIRECT_URI", "/api/auth/line/callback")
    LINE_AUTHORIZATION_URL: str = "https://access.line.me/oauth2/v2.1/authorize"
    LINE_TOKEN_URL: str = "https://api.line.me/oauth2/v2.1/token"
    LINE_USERINFO_URL: str = "https://api.line.me/v2/profile"
    LINE_SCOPES: List[str] = ["openid", "profile", "email"]
    
    # Kakao OAuth 2.0
    KAKAO_CLIENT_ID: str = os.getenv("KAKAO_CLIENT_ID", "")
    KAKAO_CLIENT_SECRET: str = os.getenv("KAKAO_CLIENT_SECRET", "")
    KAKAO_REDIRECT_URI: str = os.getenv("KAKAO_REDIRECT_URI", "/api/auth/kakao/callback")
    KAKAO_AUTHORIZATION_URL: str = "https://kauth.kakao.com/oauth/authorize"
    KAKAO_TOKEN_URL: str = "https://kauth.kakao.com/oauth/token"
    KAKAO_USERINFO_URL: str = "https://kapi.kakao.com/v2/user/me"
    KAKAO_SCOPES: List[str] = ["profile_nickname", "profile_image", "account_email"]
    
    # Naver OAuth 2.0
    NAVER_CLIENT_ID: str = os.getenv("NAVER_CLIENT_ID", "")
    NAVER_CLIENT_SECRET: str = os.getenv("NAVER_CLIENT_SECRET", "")
    NAVER_REDIRECT_URI: str = os.getenv("NAVER_REDIRECT_URI", "/api/auth/naver/callback")
    NAVER_AUTHORIZATION_URL: str = "https://nid.naver.com/oauth2.0/authorize"
    NAVER_TOKEN_URL: str = "https://nid.naver.com/oauth2.0/token"
    NAVER_USERINFO_URL: str = "https://openapi.naver.com/v1/nid/me"
    NAVER_SCOPES: List[str] = ["name", "email", "profile_image"]
    
    # WeChat OAuth 2.0
    WECHAT_APP_ID: str = os.getenv("WECHAT_APP_ID", "")
    WECHAT_APP_SECRET: str = os.getenv("WECHAT_APP_SECRET", "")
    WECHAT_REDIRECT_URI: str = os.getenv("WECHAT_REDIRECT_URI", "/api/auth/wechat/callback")
    WECHAT_AUTHORIZATION_URL: str = "https://open.weixin.qq.com/connect/qrconnect"
    WECHAT_TOKEN_URL: str = "https://api.weixin.qq.com/sns/oauth2/access_token"
    WECHAT_USERINFO_URL: str = "https://api.weixin.qq.com/sns/userinfo"
    WECHAT_SCOPES: List[str] = ["snsapi_login"]
    
    # ==================== SESSION SETTINGS ====================
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", secrets.token_urlsafe(32))
    SESSION_COOKIE_NAME: str = "amf_session"
    SESSION_COOKIE_SECURE: bool = os.getenv("NODE_ENV") == "production"
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"
    SESSION_COOKIE_MAX_AGE: int = 7 * 24 * 60 * 60  # 7 days
    SESSION_COOKIE_DOMAIN: Optional[str] = os.getenv("COOKIE_DOMAIN")
    SESSION_RESAVE: bool = False
    SESSION_SAVE_UNINITIALIZED: bool = False
    SESSION_ROLLING: bool = True
    
    # Session Store
    SESSION_STORE_TYPE: str = "redis"  # redis, memory, mongodb
    SESSION_REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    SESSION_MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/anime_multiflix")
    SESSION_MONGODB_COLLECTION: str = "sessions"
    
    # ==================== RATE LIMITING ====================
    LOGIN_RATE_LIMIT: int = 5  # attempts
    LOGIN_RATE_LIMIT_WINDOW: int = 15 * 60  # 15 minutes in seconds
    LOGIN_LOCKOUT_DURATION: int = 30 * 60  # 30 minutes
    
    REGISTER_RATE_LIMIT: int = 3  # attempts
    REGISTER_RATE_LIMIT_WINDOW: int = 60 * 60  # 1 hour
    
    VERIFY_RATE_LIMIT: int = 10  # attempts
    VERIFY_RATE_LIMIT_WINDOW: int = 60 * 60  # 1 hour
    
    RESET_PASSWORD_RATE_LIMIT: int = 3
    RESET_PASSWORD_RATE_LIMIT_WINDOW: int = 60 * 60  # 1 hour
    
    # ==================== ACCOUNT SECURITY ====================
    MAX_SESSIONS_PER_USER: int = 5
    SESSION_IDLE_TIMEOUT: int = 30 * 60  # 30 minutes
    SESSION_ABSOLUTE_TIMEOUT: int = 12 * 60 * 60  # 12 hours
    REMEMBER_ME_DURATION: int = 30 * 24 * 60 * 60  # 30 days
    
    # Account Lockout
    ACCOUNT_LOCKOUT_ATTEMPTS: int = 10
    ACCOUNT_LOCKOUT_DURATION: int = 30 * 60  # 30 minutes
    ACCOUNT_LOCKOUT_NOTIFY_EMAIL: bool = True
    
    # Suspicious Activity
    SUSPICIOUS_LOGIN_DETECTION: bool = True
    SUSPICIOUS_LOGIN_NOTIFY_EMAIL: bool = True
    NEW_DEVICE_NOTIFY_EMAIL: bool = True
    NEW_IP_NOTIFY_EMAIL: bool = True
    
    # ==================== EMAIL VERIFICATION ====================
    EMAIL_VERIFICATION_REQUIRED: bool = os.getenv("EMAIL_VERIFICATION_REQUIRED", "true").lower() == "true"
    EMAIL_VERIFICATION_TOKEN_EXPIRY: int = 24 * 60 * 60  # 24 hours
    EMAIL_VERIFICATION_RESEND_COOLDOWN: int = 5 * 60  # 5 minutes
    
    # ==================== PHONE VERIFICATION ====================
    PHONE_VERIFICATION_REQUIRED: bool = os.getenv("PHONE_VERIFICATION_REQUIRED", "false").lower() == "true"
    PHONE_VERIFICATION_TOKEN_EXPIRY: int = 10 * 60  # 10 minutes
    PHONE_VERIFICATION_RESEND_COOLDOWN: int = 60  # 1 minute
    
    # ==================== SOCIAL LOGIN ====================
    SOCIAL_LOGIN_ALLOWED: bool = True
    SOCIAL_LOGIN_AUTO_CREATE: bool = True
    SOCIAL_LOGIN_LINK_ACCOUNTS: bool = True
    SOCIAL_LOGIN_ALLOWED_PROVIDERS: List[str] = [
        "google", "discord", "facebook", "apple", "github",
        "twitter", "linkedin", "twitch", "reddit"
    ]
    
    # ==================== MAGIC LINK LOGIN ====================
    MAGIC_LINK_ENABLED: bool = True
    MAGIC_LINK_EXPIRY: int = 15 * 60  # 15 minutes
    MAGIC_LINK_TOKEN_LENGTH: int = 32
    
    # ==================== QR CODE LOGIN ====================
    QR_LOGIN_ENABLED: bool = True
    QR_LOGIN_CODE_EXPIRY: int = 60  # 60 seconds
    QR_LOGIN_POLL_INTERVAL: int = 2  # seconds
    
    # ==================== API KEYS ====================
    API_KEY_ENABLED: bool = True
    API_KEY_LENGTH: int = 32
    API_KEY_EXPIRY: int = 365 * 24 * 60 * 60  # 1 year
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_jwt_config(cls) -> Dict[str, Any]:
        """Get JWT configuration"""
        return {
            "secret": cls.JWT_SECRET,
            "algorithm": cls.JWT_ALGORITHM,
            "expires_in": cls.JWT_EXPIRES_IN,
            "refresh_expires_in": cls.JWT_REFRESH_EXPIRES_IN,
            "token_type": cls.JWT_TOKEN_TYPE,
            "audience": cls.JWT_AUDIENCE,
            "issuer": cls.JWT_ISSUER
        }
    
    @classmethod
    def get_password_policy(cls) -> Dict[str, Any]:
        """Get password policy"""
        return {
            "min_length": cls.PASSWORD_MIN_LENGTH,
            "max_length": cls.PASSWORD_MAX_LENGTH,
            "require_uppercase": cls.PASSWORD_REQUIRE_UPPERCASE,
            "require_lowercase": cls.PASSWORD_REQUIRE_LOWERCASE,
            "require_numbers": cls.PASSWORD_REQUIRE_NUMBERS,
            "require_special": cls.PASSWORD_REQUIRE_SPECIAL,
            "special_chars": cls.PASSWORD_SPECIAL_CHARS,
            "bcrypt_rounds": cls.PASSWORD_BCRYPT_ROUNDS,
            "history_count": cls.PASSWORD_HISTORY_COUNT,
            "expiry_days": cls.PASSWORD_EXPIRY_DAYS
        }
    
    @classmethod
    def get_tfa_config(cls) -> Dict[str, Any]:
        """Get TFA configuration"""
        return {
            "enabled": cls.TFA_ENABLED,
            "issuer": cls.TFA_ISSUER,
            "algorithm": cls.TFA_ALGORITHM,
            "digits": cls.TFA_DIGITS,
            "period": cls.TFA_PERIOD,
            "backup_codes": cls.TFA_BACKUP_CODES,
            "methods": cls.TFA_METHODS
        }
    
    @classmethod
    def get_oauth_config(cls, provider: str) -> Dict[str, Any]:
        """Get OAuth configuration for specific provider"""
        providers = {
            "google": {
                "client_id": cls.GOOGLE_CLIENT_ID,
                "client_secret": cls.GOOGLE_CLIENT_SECRET,
                "redirect_uri": cls.GOOGLE_REDIRECT_URI,
                "authorization_url": cls.GOOGLE_AUTHORIZATION_URL,
                "token_url": cls.GOOGLE_TOKEN_URL,
                "userinfo_url": cls.GOOGLE_USERINFO_URL,
                "scopes": cls.GOOGLE_SCOPES
            },
            "discord": {
                "client_id": cls.DISCORD_CLIENT_ID,
                "client_secret": cls.DISCORD_CLIENT_SECRET,
                "redirect_uri": cls.DISCORD_REDIRECT_URI,
                "authorization_url": cls.DISCORD_AUTHORIZATION_URL,
                "token_url": cls.DISCORD_TOKEN_URL,
                "userinfo_url": cls.DISCORD_USERINFO_URL,
                "scopes": cls.DISCORD_SCOPES
            },
            "facebook": {
                "client_id": cls.FACEBOOK_CLIENT_ID,
                "client_secret": cls.FACEBOOK_CLIENT_SECRET,
                "redirect_uri": cls.FACEBOOK_REDIRECT_URI,
                "authorization_url": cls.FACEBOOK_AUTHORIZATION_URL,
                "token_url": cls.FACEBOOK_TOKEN_URL,
                "userinfo_url": cls.FACEBOOK_USERINFO_URL,
                "scopes": cls.FACEBOOK_SCOPES
            },
            "apple": {
                "client_id": cls.APPLE_CLIENT_ID,
                "team_id": cls.APPLE_TEAM_ID,
                "key_id": cls.APPLE_KEY_ID,
                "private_key": cls.APPLE_PRIVATE_KEY,
                "redirect_uri": cls.APPLE_REDIRECT_URI,
                "authorization_url": cls.APPLE_AUTHORIZATION_URL,
                "token_url": cls.APPLE_TOKEN_URL,
                "scopes": cls.APPLE_SCOPES
            }
        }
        return providers.get(provider, {})
    
    @classmethod
    def is_oauth_enabled(cls, provider: str) -> bool:
        """Check if OAuth provider is enabled"""
        config = cls.get_oauth_config(provider)
        return bool(config.get("client_id") and config.get("client_secret"))
    
    @classmethod
    def get_enabled_oauth_providers(cls) -> List[str]:
        """Get list of enabled OAuth providers"""
        providers = ["google", "discord", "facebook", "apple", "github", 
                    "twitter", "linkedin", "twitch", "reddit"]
        return [p for p in providers if cls.is_oauth_enabled(p)]
    
    @classmethod
    def validate_password(cls, password: str) -> tuple:
        """Validate password against policy"""
        errors = []
        
        if len(password) < cls.PASSWORD_MIN_LENGTH:
            errors.append(f"Password must be at least {cls.PASSWORD_MIN_LENGTH} characters")
        if len(password) > cls.PASSWORD_MAX_LENGTH:
            errors.append(f"Password must be less than {cls.PASSWORD_MAX_LENGTH} characters")
        if cls.PASSWORD_REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        if cls.PASSWORD_REQUIRE_LOWERCASE and not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        if cls.PASSWORD_REQUIRE_NUMBERS and not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one number")
        if cls.PASSWORD_REQUIRE_SPECIAL and not any(c in cls.PASSWORD_SPECIAL_CHARS for c in password):
            errors.append(f"Password must contain at least one special character ({cls.PASSWORD_SPECIAL_CHARS})")
        
        return len(errors) == 0, errors


# Create auth config instance
auth_config = AuthConfig()

# Print enabled OAuth providers on startup
if auth_config.get_enabled_oauth_providers():
    print(f"🔐 Enabled OAuth providers: {', '.join(auth_config.get_enabled_oauth_providers())}")
