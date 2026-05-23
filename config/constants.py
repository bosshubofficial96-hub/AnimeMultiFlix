"""
AnimeMultiFlix - Constants Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

from typing import Dict, List, Tuple


class Constants:
    """Application Constants Class"""
    
    # ==================== APPLICATION CONSTANTS ====================
    APP_NAME: str = "AnimeMultiFlix"
    APP_SHORT_NAME: str = "AMF"
    APP_VERSION: str = "4.0.0"
    APP_URL: str = "https://animemultiflix.me"
    APP_API_URL: str = "https://api.animemultiflix.me"
    APP_CDN_URL: str = "https://cdn.animemultiflix.me"
    APP_SUPPORT_EMAIL: str = "support@animemultiflix.me"
    APP_NOREPLY_EMAIL: str = "noreply@animemultiflix.me"
    
    # ==================== HTTP STATUS CODES ====================
    HTTP_100_CONTINUE: int = 100
    HTTP_101_SWITCHING_PROTOCOLS: int = 101
    HTTP_102_PROCESSING: int = 102
    HTTP_103_EARLY_HINTS: int = 103
    
    HTTP_200_OK: int = 200
    HTTP_201_CREATED: int = 201
    HTTP_202_ACCEPTED: int = 202
    HTTP_203_NON_AUTHORITATIVE_INFORMATION: int = 203
    HTTP_204_NO_CONTENT: int = 204
    HTTP_205_RESET_CONTENT: int = 205
    HTTP_206_PARTIAL_CONTENT: int = 206
    HTTP_207_MULTI_STATUS: int = 207
    HTTP_208_ALREADY_REPORTED: int = 208
    HTTP_226_IM_USED: int = 226
    
    HTTP_300_MULTIPLE_CHOICES: int = 300
    HTTP_301_MOVED_PERMANENTLY: int = 301
    HTTP_302_FOUND: int = 302
    HTTP_303_SEE_OTHER: int = 303
    HTTP_304_NOT_MODIFIED: int = 304
    HTTP_305_USE_PROXY: int = 305
    HTTP_307_TEMPORARY_REDIRECT: int = 307
    HTTP_308_PERMANENT_REDIRECT: int = 308
    
    HTTP_400_BAD_REQUEST: int = 400
    HTTP_401_UNAUTHORIZED: int = 401
    HTTP_402_PAYMENT_REQUIRED: int = 402
    HTTP_403_FORBIDDEN: int = 403
    HTTP_404_NOT_FOUND: int = 404
    HTTP_405_METHOD_NOT_ALLOWED: int = 405
    HTTP_406_NOT_ACCEPTABLE: int = 406
    HTTP_407_PROXY_AUTHENTICATION_REQUIRED: int = 407
    HTTP_408_REQUEST_TIMEOUT: int = 408
    HTTP_409_CONFLICT: int = 409
    HTTP_410_GONE: int = 410
    HTTP_411_LENGTH_REQUIRED: int = 411
    HTTP_412_PRECONDITION_FAILED: int = 412
    HTTP_413_PAYLOAD_TOO_LARGE: int = 413
    HTTP_414_URI_TOO_LONG: int = 414
    HTTP_415_UNSUPPORTED_MEDIA_TYPE: int = 415
    HTTP_416_RANGE_NOT_SATISFIABLE: int = 416
    HTTP_417_EXPECTATION_FAILED: int = 417
    HTTP_418_IM_A_TEAPOT: int = 418
    HTTP_421_MISDIRECTED_REQUEST: int = 421
    HTTP_422_UNPROCESSABLE_ENTITY: int = 422
    HTTP_423_LOCKED: int = 423
    HTTP_424_FAILED_DEPENDENCY: int = 424
    HTTP_425_TOO_EARLY: int = 425
    HTTP_426_UPGRADE_REQUIRED: int = 426
    HTTP_428_PRECONDITION_REQUIRED: int = 428
    HTTP_429_TOO_MANY_REQUESTS: int = 429
    HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE: int = 431
    HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS: int = 451
    
    HTTP_500_INTERNAL_SERVER_ERROR: int = 500
    HTTP_501_NOT_IMPLEMENTED: int = 501
    HTTP_502_BAD_GATEWAY: int = 502
    HTTP_503_SERVICE_UNAVAILABLE: int = 503
    HTTP_504_GATEWAY_TIMEOUT: int = 504
    HTTP_505_HTTP_VERSION_NOT_SUPPORTED: int = 505
    HTTP_506_VARIANT_ALSO_NEGOTIATES: int = 506
    HTTP_507_INSUFFICIENT_STORAGE: int = 507
    HTTP_508_LOOP_DETECTED: int = 508
    HTTP_510_NOT_EXTENDED: int = 510
    HTTP_511_NETWORK_AUTHENTICATION_REQUIRED: int = 511
    
    # Status Code Groups
    STATUS_CODES_INFO: List[int] = [100, 101, 102, 103]
    STATUS_CODES_SUCCESS: List[int] = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
    STATUS_CODES_REDIRECTION: List[int] = [300, 301, 302, 303, 304, 305, 307, 308]
    STATUS_CODES_CLIENT_ERROR: List[int] = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451]
    STATUS_CODES_SERVER_ERROR: List[int] = [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511]
    
    # ==================== USER ROLES ====================
    ROLE_USER: str = "user"
    ROLE_PREMIUM: str = "premium"
    ROLE_ULTIMATE: str = "ultimate"
    ROLE_MODERATOR: str = "moderator"
    ROLE_ADMIN: str = "admin"
    ROLE_SUPER_ADMIN: str = "super_admin"
    ROLE_OWNER: str = "owner"
    
    USER_ROLES: Dict[str, Dict] = {
        ROLE_USER: {"level": 0, "name": "User", "color": "#95A5A6"},
        ROLE_PREMIUM: {"level": 1, "name": "Premium User", "color": "#3498DB"},
        ROLE_ULTIMATE: {"level": 2, "name": "Ultimate User", "color": "#9B59B6"},
        ROLE_MODERATOR: {"level": 3, "name": "Moderator", "color": "#F39C12"},
        ROLE_ADMIN: {"level": 4, "name": "Administrator", "color": "#E74C3C"},
        ROLE_SUPER_ADMIN: {"level": 5, "name": "Super Admin", "color": "#FF3366"},
        ROLE_OWNER: {"level": 999, "name": "Owner", "color": "#FFD700"}
    }
    
    # ==================== ANIME STATUS ====================
    ANIME_STATUS_ONGOING: str = "ongoing"
    ANIME_STATUS_COMPLETED: str = "completed"
    ANIME_STATUS_UPCOMING: str = "upcoming"
    ANIME_STATUS_HIATUS: str = "hiatus"
    ANIME_STATUS_CANCELLED: str = "cancelled"
    
    ANIME_STATUSES: Dict[str, Dict] = {
        ANIME_STATUS_ONGOING: {"name": "Ongoing", "color": "#2ECC71", "icon": "fa-play-circle"},
        ANIME_STATUS_COMPLETED: {"name": "Completed", "color": "#3498DB", "icon": "fa-check-circle"},
        ANIME_STATUS_UPCOMING: {"name": "Upcoming", "color": "#F39C12", "icon": "fa-clock"},
        ANIME_STATUS_HIATUS: {"name": "Hiatus", "color": "#E74C3C", "icon": "fa-pause-circle"},
        ANIME_STATUS_CANCELLED: {"name": "Cancelled", "color": "#95A5A6", "icon": "fa-times-circle"}
    }
    
    # ==================== VIDEO QUALITIES ====================
    VIDEO_QUALITY_144P: str = "144p"
    VIDEO_QUALITY_240P: str = "240p"
    VIDEO_QUALITY_360P: str = "360p"
    VIDEO_QUALITY_480P: str = "480p"
    VIDEO_QUALITY_720P: str = "720p"
    VIDEO_QUALITY_1080P: str = "1080p"
    VIDEO_QUALITY_1440P: str = "1440p"
    VIDEO_QUALITY_2160P: str = "2160p"  # 4K
    VIDEO_QUALITY_4320P: str = "4320p"  # 8K
    
    VIDEO_QUALITIES: List[str] = [
        VIDEO_QUALITY_144P, VIDEO_QUALITY_240P, VIDEO_QUALITY_360P,
        VIDEO_QUALITY_480P, VIDEO_QUALITY_720P, VIDEO_QUALITY_1080P,
        VIDEO_QUALITY_1440P, VIDEO_QUALITY_2160P, VIDEO_QUALITY_4320P
    ]
    
    VIDEO_QUALITY_SETTINGS: Dict[str, Dict] = {
        VIDEO_QUALITY_144P: {"width": 256, "height": 144, "bitrate": 100000},
        VIDEO_QUALITY_240P: {"width": 426, "height": 240, "bitrate": 300000},
        VIDEO_QUALITY_360P: {"width": 640, "height": 360, "bitrate": 500000},
        VIDEO_QUALITY_480P: {"width": 854, "height": 480, "bitrate": 1000000},
        VIDEO_QUALITY_720P: {"width": 1280, "height": 720, "bitrate": 2500000},
        VIDEO_QUALITY_1080P: {"width": 1920, "height": 1080, "bitrate": 5000000},
        VIDEO_QUALITY_1440P: {"width": 2560, "height": 1440, "bitrate": 8000000},
        VIDEO_QUALITY_2160P: {"width": 3840, "height": 2160, "bitrate": 15000000},
        VIDEO_QUALITY_4320P: {"width": 7680, "height": 4320, "bitrate": 50000000}
    }
    
    # ==================== ANIME GENRES ====================
    ANIME_GENRES: List[str] = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy",
        "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
        "Sports", "Thriller", "Supernatural", "Mecha", "Psychological",
        "Ecchi", "Harem", "Isekai", "Magic", "Martial Arts",
        "Military", "Music", "Parody", "Police", "Political",
        "School", "Seinen", "Shoujo", "Shounen", "Space", "Vampire",
        "Demons", "Game", "Historical", "Josei", "Kids",
        "Samurai", "Spy", "Super Power", "Villainess", "Wuxia"
    ]
    
    GENRE_COLORS: Dict[str, str] = {
        "Action": "#E74C3C", "Adventure": "#F39C12", "Comedy": "#F1C40F",
        "Drama": "#9B59B6", "Fantasy": "#3498DB", "Horror": "#2C3E50",
        "Mystery": "#1ABC9C", "Romance": "#E91E63", "Sci-Fi": "#00BCD4",
        "Slice of Life": "#4CAF50", "Sports": "#FF9800", "Thriller": "#607D8B"
    }
    
    # ==================== GROUP TYPES ====================
    GROUP_TYPE_PUBLIC: str = "public"
    GROUP_TYPE_PRIVATE: str = "private"
    GROUP_TYPE_SECRET: str = "secret"
    
    GROUP_TYPES: Dict[str, Dict] = {
        GROUP_TYPE_PUBLIC: {"name": "Public", "icon": "fa-globe", "color": "#3498DB"},
        GROUP_TYPE_PRIVATE: {"name": "Private", "icon": "fa-lock", "color": "#F39C12"},
        GROUP_TYPE_SECRET: {"name": "Secret", "icon": "fa-user-secret", "color": "#E74C3C"}
    }
    
    # ==================== GROUP ROLES ====================
    GROUP_ROLE_OWNER: str = "owner"
    GROUP_ROLE_ADMIN: str = "admin"
    GROUP_ROLE_MODERATOR: str = "moderator"
    GROUP_ROLE_MEMBER: str = "member"
    GROUP_ROLE_RESTRICTED: str = "restricted"
    GROUP_ROLE_MUTED: str = "muted"
    GROUP_ROLE_BANNED: str = "banned"
    
    GROUP_ROLES: Dict[str, Dict] = {
        GROUP_ROLE_OWNER: {"level": 0, "name": "Owner", "color": "#FF3366"},
        GROUP_ROLE_ADMIN: {"level": 1, "name": "Admin", "color": "#4ECDC4"},
        GROUP_ROLE_MODERATOR: {"level": 2, "name": "Moderator", "color": "#FFE66D"},
        GROUP_ROLE_MEMBER: {"level": 3, "name": "Member", "color": "#95A5A6"},
        GROUP_ROLE_RESTRICTED: {"level": 4, "name": "Restricted", "color": "#E74C3C"},
        GROUP_ROLE_MUTED: {"level": 5, "name": "Muted", "color": "#7F8C8D"},
        GROUP_ROLE_BANNED: {"level": 6, "name": "Banned", "color": "#2C3E50"}
    }
    
    # ==================== MESSAGE TYPES ====================
    MESSAGE_TYPE_TEXT: str = "text"
    MESSAGE_TYPE_VOICE: str = "voice"
    MESSAGE_TYPE_VIDEO: str = "video"
    MESSAGE_TYPE_IMAGE: str = "image"
    MESSAGE_TYPE_FILE: str = "file"
    MESSAGE_TYPE_STICKER: str = "sticker"
    MESSAGE_TYPE_GIF: str = "gif"
    MESSAGE_TYPE_POLL: str = "poll"
    MESSAGE_TYPE_QUIZ: str = "quiz"
    MESSAGE_TYPE_LOCATION: str = "location"
    MESSAGE_TYPE_CONTACT: str = "contact"
    MESSAGE_TYPE_DELETED: str = "deleted"
    
    MESSAGE_TYPES: Dict[str, Dict] = {
        MESSAGE_TYPE_TEXT: {"name": "Text", "icon": "fa-comment"},
        MESSAGE_TYPE_VOICE: {"name": "Voice", "icon": "fa-microphone"},
        MESSAGE_TYPE_VIDEO: {"name": "Video", "icon": "fa-video"},
        MESSAGE_TYPE_IMAGE: {"name": "Image", "icon": "fa-image"},
        MESSAGE_TYPE_FILE: {"name": "File", "icon": "fa-file"},
        MESSAGE_TYPE_STICKER: {"name": "Sticker", "icon": "fa-smile"},
        MESSAGE_TYPE_GIF: {"name": "GIF", "icon": "fa-play-circle"},
        MESSAGE_TYPE_POLL: {"name": "Poll", "icon": "fa-chart-bar"},
        MESSAGE_TYPE_QUIZ: {"name": "Quiz", "icon": "fa-question-circle"},
        MESSAGE_TYPE_LOCATION: {"name": "Location", "icon": "fa-map-marker-alt"},
        MESSAGE_TYPE_CONTACT: {"name": "Contact", "icon": "fa-address-card"}
    }
    
    # ==================== PAYMENT STATUS ====================
    PAYMENT_STATUS_PENDING: str = "pending"
    PAYMENT_STATUS_COMPLETED: str = "completed"
    PAYMENT_STATUS_FAILED: str = "failed"
    PAYMENT_STATUS_REFUNDED: str = "refunded"
    PAYMENT_STATUS_PARTIAL_REFUNDED: str = "partial_refunded"
    PAYMENT_STATUS_CANCELLED: str = "cancelled"
    
    PAYMENT_STATUSES: Dict[str, Dict] = {
        PAYMENT_STATUS_PENDING: {"name": "Pending", "color": "#F39C12"},
        PAYMENT_STATUS_COMPLETED: {"name": "Completed", "color": "#2ECC71"},
        PAYMENT_STATUS_FAILED: {"name": "Failed", "color": "#E74C3C"},
        PAYMENT_STATUS_REFUNDED: {"name": "Refunded", "color": "#3498DB"},
        PAYMENT_STATUS_PARTIAL_REFUNDED: {"name": "Partial Refunded", "color": "#9B59B6"},
        PAYMENT_STATUS_CANCELLED: {"name": "Cancelled", "color": "#95A5A6"}
    }
    
    # ==================== SUBSCRIPTION PLANS ====================
    PLAN_FREE: str = "free"
    PLAN_BASIC: str = "basic"
    PLAN_PRO: str = "pro"
    PLAN_ULTIMATE: str = "ultimate"
    PLAN_FAMILY: str = "family"
    PLAN_STUDENT: str = "student"
    PLAN_LIFETIME: str = "lifetime"
    
    SUBSCRIPTION_PLANS: List[str] = [
        PLAN_FREE, PLAN_BASIC, PLAN_PRO, PLAN_ULTIMATE, PLAN_FAMILY, PLAN_STUDENT, PLAN_LIFETIME
    ]
    
    # ==================== CACHE KEYS ====================
    CACHE_KEY_ANIME_LIST: str = "anime:list:{}"
    CACHE_KEY_ANIME_DETAIL: str = "anime:detail:{}"
    CACHE_KEY_ANIME_POPULAR: str = "anime:popular"
    CACHE_KEY_ANIME_TRENDING: str = "anime:trending"
    CACHE_KEY_ANIME_RECENT: str = "anime:recent"
    CACHE_KEY_ANIME_UPCOMING: str = "anime:upcoming"
    
    CACHE_KEY_EPISODE_DETAIL: str = "episode:detail:{}"
    CACHE_KEY_EPISODE_LIST: str = "episode:list:{}"
    
    CACHE_KEY_USER_SESSION: str = "user:session:{}"
    CACHE_KEY_USER_PROFILE: str = "user:profile:{}"
    CACHE_KEY_USER_SETTINGS: str = "user:settings:{}"
    CACHE_KEY_USER_WATCHLIST: str = "user:watchlist:{}"
    CACHE_KEY_USER_HISTORY: str = "user:history:{}"
    
    CACHE_KEY_GROUP_DETAIL: str = "group:detail:{}"
    CACHE_KEY_GROUP_MEMBERS: str = "group:members:{}"
    CACHE_KEY_GROUP_MESSAGES: str = "group:messages:{}"
    
    CACHE_KEY_RECOMMENDATIONS: str = "recommendations:user:{}"
    CACHE_KEY_TRENDING: str = "trending:anime"
    CACHE_KEY_POPULAR: str = "popular:anime"
    
    # ==================== FILE LIMITS ====================
    MAX_VIDEO_SIZE: int = 2 * 1024 * 1024 * 1024  # 2GB
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_SUBTITLE_SIZE: int = 2 * 1024 * 1024  # 2MB
    MAX_AUDIO_SIZE: int = 50 * 1024 * 1024  # 50MB
    MAX_DOCUMENT_SIZE: int = 25 * 1024 * 1024  # 25MB
    MAX_AVATAR_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_THUMBNAIL_SIZE: int = 1 * 1024 * 1024  # 1MB
    
    # ==================== PAGINATION ====================
    PAGINATION_DEFAULT_PAGE: int = 1
    PAGINATION_DEFAULT_LIMIT: int = 20
    PAGINATION_MAX_LIMIT: int = 100
    PAGINATION_ADMIN_LIMIT: int = 500
    
    # ==================== REGEX PATTERNS ====================
    REGEX_EMAIL: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    REGEX_USERNAME: str = r'^[a-zA-Z0-9_]{3,50}$'
    REGEX_PASSWORD: str = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    REGEX_PHONE: str = r'^\+?[1-9]\d{1,14}$'
    REGEX_URL: str = r'^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$'
    REGEX_SLUG: str = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
    REGEX_UUID: str = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    
    # ==================== DATE FORMATS ====================
    DATE_FORMAT: str = "%Y-%m-%d"
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"
    DATETIME_FORMAT_WITH_TZ: str = "%Y-%m-%d %H:%M:%S %z"
    TIME_FORMAT: str = "%H:%M:%S"
    
    # ==================== SORT OPTIONS ====================
    SORT_ASC: str = "asc"
    SORT_DESC: str = "desc"
    
    SORT_FIELDS: Dict[str, List[str]] = {
        "anime": ["title", "rating", "views", "year", "created_at"],
        "episode": ["number", "views", "created_at"],
        "user": ["username", "created_at", "last_active"],
        "group": ["name", "member_count", "created_at"]
    }
    
    # ==================== FILTER OPERATORS ====================
    FILTER_EQ: str = "eq"
    FILTER_NE: str = "ne"
    FILTER_GT: str = "gt"
    FILTER_GTE: str = "gte"
    FILTER_LT: str = "lt"
    FILTER_LTE: str = "lte"
    FILTER_IN: str = "in"
    FILTER_NIN: str = "nin"
    FILTER_CONTAINS: str = "contains"
    FILTER_STARTS_WITH: str = "starts_with"
    FILTER_ENDS_WITH: str = "ends_with"
    
    # ==================== DEFAULT VALUES ====================
    DEFAULT_AVATAR: str = "/assets/images/default-avatar.png"
    DEFAULT_GROUP_AVATAR: str = "/assets/images/default-group.png"
    DEFAULT_THUMBNAIL: str = "/assets/images/default-thumb.jpg"
    DEFAULT_BANNER: str = "/assets/images/default-banner.jpg"
    
    DEFAULT_USERNAME_PREFIX: str = "user_"
    DEFAULT_GROUP_NAME_PREFIX: str = "group_"
    
    # ==================== LIMITS ====================
    MAX_USERNAME_LENGTH: int = 50
    MAX_EMAIL_LENGTH: int = 255
    MAX_PASSWORD_LENGTH: int = 128
    MAX_MESSAGE_LENGTH: int = 5000
    MAX_GROUP_NAME_LENGTH: int = 100
    MAX_ANIME_TITLE_LENGTH: int = 200
    MAX_COMMENT_LENGTH: int = 2000
    MAX_BIO_LENGTH: int = 500
    
    # ==================== TIME CONSTANTS ====================
    SECOND: int = 1
    MINUTE: int = 60
    HOUR: int = 60 * 60
    DAY: int = 24 * 60 * 60
    WEEK: int = 7 * 24 * 60 * 60
    MONTH: int = 30 * 24 * 60 * 60
    YEAR: int = 365 * 24 * 60 * 60
    
    # ==================== API RATE LIMITS ====================
    API_RATE_LIMIT_FREE: int = 60
    API_RATE_LIMIT_PREMIUM: int = 300
    API_RATE_LIMIT_ULTIMATE: int = 1000
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_status_code_group(cls, code: int) -> str:
        """Get status code group"""
        if code in cls.STATUS_CODES_INFO:
            return "info"
        elif code in cls.STATUS_CODES_SUCCESS:
            return "success"
        elif code in cls.STATUS_CODES_REDIRECTION:
            return "redirect"
        elif code in cls.STATUS_CODES_CLIENT_ERROR:
            return "client_error"
        elif code in cls.STATUS_CODES_SERVER_ERROR:
            return "server_error"
        return "unknown"
    
    @classmethod
    def get_video_quality_settings(cls, quality: str) -> Dict:
        """Get video quality settings"""
        return cls.VIDEO_QUALITY_SETTINGS.get(quality, cls.VIDEO_QUALITY_SETTINGS[cls.VIDEO_QUALITY_720P])
    
    @classmethod
    def get_genre_color(cls, genre: str) -> str:
        """Get genre color"""
        return cls.GENRE_COLORS.get(genre, "#95A5A6")
    
    @classmethod
    def get_user_role_info(cls, role: str) -> Dict:
        """Get user role information"""
        return cls.USER_ROLES.get(role, cls.USER_ROLES[cls.ROLE_USER])
    
    @classmethod
    def get_anime_status_info(cls, status: str) -> Dict:
        """Get anime status information"""
        return cls.ANIME_STATUSES.get(status, cls.ANIME_STATUSES[cls.ANIME_STATUS_ONGOING])
    
    @classmethod
    def get_group_role_info(cls, role: str) -> Dict:
        """Get group role information"""
        return cls.GROUP_ROLES.get(role, cls.GROUP_ROLES[cls.GROUP_ROLE_MEMBER])
    
    @classmethod
    def get_payment_status_info(cls, status: str) -> Dict:
        """Get payment status information"""
        return cls.PAYMENT_STATUSES.get(status, cls.PAYMENT_STATUSES[cls.PAYMENT_STATUS_PENDING])
    
    @classmethod
    def is_valid_quality(cls, quality: str) -> bool:
        """Check if video quality is valid"""
        return quality in cls.VIDEO_QUALITIES
    
    @classmethod
    def is_valid_genre(cls, genre: str) -> bool:
        """Check if genre is valid"""
        return genre in cls.ANIME_GENRES
    
    @classmethod
    def is_valid_role(cls, role: str) -> bool:
        """Check if user role is valid"""
        return role in cls.USER_ROLES
    
    @classmethod
    def get_cache_key(cls, key: str, *args) -> str:
        """Generate cache key with arguments"""
        return key.format(*args)
    
    @classmethod
    def get_api_rate_limit(cls, is_premium: bool = False, is_ultimate: bool = False) -> int:
        """Get API rate limit based on user tier"""
        if is_ultimate:
            return cls.API_RATE_LIMIT_ULTIMATE
        elif is_premium:
            return cls.API_RATE_LIMIT_PREMIUM
        return cls.API_RATE_LIMIT_FREE


# Create constants instance
constants = Constants()

# Print constants status
print(f"📋 Constants Configuration")
print(f"   HTTP Status Codes: {len(constants.STATUS_CODES_SUCCESS)} success codes")
print(f"   User Roles: {len(constants.USER_ROLES)}")
print(f"   Anime Genres: {len(constants.ANIME_GENRES)}")
print(f"   Video Qualities: {len(constants.VIDEO_QUALITIES)}")
print(f"   Message Types: {len(constants.MESSAGE_TYPES)}")
