"""
AnimeMultiFlix - Chat Configuration (WhatsApp-like)
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class ChatConfig:
    """Chat Configuration Class - WhatsApp-like Features"""
    
    # ==================== MESSAGE SETTINGS ====================
    MESSAGE_MAX_LENGTH: int = int(os.getenv("CHAT_MESSAGE_MAX_LENGTH", 5000))
    MESSAGE_EDIT_WINDOW: int = int(os.getenv("CHAT_MESSAGE_EDIT_WINDOW", 3600))  # 1 hour
    MESSAGE_DELETE_WINDOW: int = int(os.getenv("CHAT_MESSAGE_DELETE_WINDOW", 3600))  # 1 hour
    MESSAGE_DELETE_FOR_EVERYONE_WINDOW: int = int(os.getenv("CHAT_MESSAGE_DELETE_EVERYONE", 3600))  # 1 hour
    
    # Message Types
    MESSAGE_TYPES: Dict[str, Dict] = {
        "text": {
            "name": "Text Message",
            "icon": "fa-comment",
            "max_length": 5000,
            "supports_formatting": True
        },
        "voice": {
            "name": "Voice Message",
            "icon": "fa-microphone",
            "max_duration": 300,  # seconds
            "max_size": 10 * 1024 * 1024,  # 10MB
            "formats": ["mp3", "ogg", "m4a"]
        },
        "video": {
            "name": "Video Message",
            "icon": "fa-video",
            "max_size": 100 * 1024 * 1024,  # 100MB
            "max_duration": 60,  # seconds
            "formats": ["mp4", "mov", "avi"]
        },
        "image": {
            "name": "Image Message",
            "icon": "fa-image",
            "max_size": 25 * 1024 * 1024,  # 25MB
            "formats": ["jpg", "jpeg", "png", "gif", "webp"],
            "thumbnail_size": (300, 300)
        },
        "file": {
            "name": "File Message",
            "icon": "fa-file",
            "max_size": 100 * 1024 * 1024,  # 100MB
            "allowed_types": [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
                "application/zip",
                "application/x-rar-compressed"
            ]
        },
        "sticker": {
            "name": "Sticker",
            "icon": "fa-smile",
            "max_size": 512 * 1024,  # 512KB
            "formats": ["webp", "png", "gif"],
            "animated_supported": True
        },
        "gif": {
            "name": "GIF",
            "icon": "fa-play-circle",
            "max_size": 25 * 1024 * 1024,  # 25MB
            "max_duration": 15,  # seconds
            "source": ["tenor", "giphy"]
        },
        "poll": {
            "name": "Poll",
            "icon": "fa-chart-bar",
            "max_options": 10,
            "max_duration": 7 * 24 * 60 * 60,  # 7 days
            "allow_multiple_votes": True,
            "allow_anonymous": True
        },
        "quiz": {
            "name": "Quiz",
            "icon": "fa-question-circle",
            "max_questions": 20,
            "max_options_per_question": 6,
            "timer_supported": True
        },
        "location": {
            "name": "Location",
            "icon": "fa-map-marker-alt",
            "accuracy": "high"
        },
        "contact": {
            "name": "Contact",
            "icon": "fa-address-card",
            "fields": ["name", "phone", "email"]
        }
    }
    
    # ==================== RICH TEXT FORMATTING ====================
    RICH_TEXT_FORMATTING: Dict[str, Dict] = {
        "bold": {
            "syntax": "**text**",
            "html": "<strong>text</strong>",
            "description": "Bold text"
        },
        "italic": {
            "syntax": "*text*",
            "html": "<em>text</em>",
            "description": "Italic text"
        },
        "underline": {
            "syntax": "__text__",
            "html": "<u>text</u>",
            "description": "Underlined text"
        },
        "strikethrough": {
            "syntax": "~~text~~",
            "html": "<del>text</del>",
            "description": "Strikethrough text"
        },
        "code": {
            "syntax": "`code`",
            "html": "<code>code</code>",
            "description": "Inline code"
        },
        "code_block": {
            "syntax": "```code```",
            "html": "<pre><code>code</code></pre>",
            "description": "Code block"
        },
        "spoiler": {
            "syntax": "||text||",
            "html": "<span class=\"spoiler\">text</span>",
            "description": "Spoiler text"
        },
        "mention": {
            "syntax": "@username",
            "html": "<span class=\"mention\">@username</span>",
            "description": "Mention user"
        },
        "hashtag": {
            "syntax": "#tag",
            "html": "<span class=\"hashtag\">#tag</span>",
            "description": "Hashtag"
        },
        "link": {
            "syntax": "[text](url)",
            "html": "<a href=\"url\">text</a>",
            "description": "Link"
        }
    }
    
    # ==================== REACTION SETTINGS ====================
    REACTION_ENABLED: bool = os.getenv("CHAT_REACTIONS_ENABLED", "true").lower() == "true"
    REACTION_MAX_PER_MESSAGE: int = int(os.getenv("CHAT_MAX_REACTIONS", 20))
    REACTION_MAX_PER_USER: int = int(os.getenv("CHAT_MAX_USER_REACTIONS", 1))
    REACTION_ALLOWED: List[str] = [
        "👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🎉",
        "🔥", "✨", "💯", "🤣", "🥺", "😍", "🥳", "😎",
        "🤔", "😴", "🥱", "🤯", "💀", "👻", "🤡", "💩"
    ]
    REACTION_CUSTOM_ENABLED: bool = os.getenv("CHAT_CUSTOM_REACTIONS", "true").lower() == "true"
    REACTION_ANIMATED_ENABLED: bool = os.getenv("CHAT_ANIMATED_REACTIONS", "true").lower() == "true"
    
    # ==================== MEDIA SETTINGS ====================
    MEDIA_MAX_FILE_SIZE: int = int(os.getenv("CHAT_MEDIA_MAX_SIZE", 100 * 1024 * 1024))  # 100MB
    MEDIA_ALLOWED_TYPES: List[str] = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "video/mp4", "video/webm", "video/quicktime",
        "audio/mpeg", "audio/ogg", "audio/wav",
        "application/pdf"
    ]
    MEDIA_RETENTION_DAYS: int = int(os.getenv("CHAT_MEDIA_RETENTION_DAYS", 90))
    MEDIA_COMPRESSION_ENABLED: bool = os.getenv("CHAT_MEDIA_COMPRESSION", "true").lower() == "true"
    MEDIA_THUMBNAIL_ENABLED: bool = os.getenv("CHAT_MEDIA_THUMBNAIL", "true").lower() == "true"
    MEDIA_THUMBNAIL_SIZE: tuple = (300, 300)
    
    # ==================== VOICE MESSAGE SETTINGS ====================
    VOICE_MESSAGE_ENABLED: bool = os.getenv("CHAT_VOICE_MESSAGE_ENABLED", "true").lower() == "true"
    VOICE_MESSAGE_MAX_DURATION: int = int(os.getenv("CHAT_VOICE_MAX_DURATION", 300))  # 5 minutes
    VOICE_MESSAGE_QUALITY: int = int(os.getenv("CHAT_VOICE_QUALITY", 128))  # kbps
    VOICE_MESSAGE_FORMAT: str = os.getenv("CHAT_VOICE_FORMAT", "mp3")
    VOICE_MESSAGE_TRANSCRIPTION: bool = os.getenv("CHAT_VOICE_TRANSCRIPTION", "true").lower() == "true"
    VOICE_MESSAGE_TRANSCRIPTION_LANGUAGES: List[str] = ["en", "ja", "es", "fr", "de"]
    
    # ==================== TYPING INDICATOR ====================
    TYPING_INDICATOR_ENABLED: bool = os.getenv("CHAT_TYPING_INDICATOR", "true").lower() == "true"
    TYPING_INDICATOR_TIMEOUT: int = int(os.getenv("CHAT_TYPING_TIMEOUT", 5000))  # milliseconds
    TYPING_INDICATOR_INTERVAL: int = int(os.getenv("CHAT_TYPING_INTERVAL", 3000))  # milliseconds
    
    # ==================== READ RECEIPTS ====================
    READ_RECEIPTS_ENABLED: bool = os.getenv("CHAT_READ_RECEIPTS", "true").lower() == "true"
    READ_RECEIPTS_DELIVERY: bool = os.getenv("CHAT_DELIVERY_RECEIPTS", "true").lower() == "true"
    READ_RECEIPTS_READ: bool = os.getenv("CHAT_READ_RECEIPTS_READ", "true").lower() == "true"
    READ_RECEIPTS_PRIVACY: bool = os.getenv("CHAT_READ_RECEIPTS_PRIVACY", "true").lower() == "true"
    
    # ==================== LAST SEEN ====================
    LAST_SEEN_ENABLED: bool = os.getenv("CHAT_LAST_SEEN", "true").lower() == "true"
    LAST_SEEN_PRECISION: str = os.getenv("CHAT_LAST_SEEN_PRECISION", "last_seen")  # last_seen, online, offline
    LAST_SEEN_PRIVACY_OPTIONS: List[str] = ["everyone", "contacts", "nobody"]
    
    # ==================== CHAT BACKUP ====================
    CHAT_BACKUP_ENABLED: bool = os.getenv("CHAT_BACKUP_ENABLED", "true").lower() == "true"
    CHAT_BACKUP_FREQUENCY: str = os.getenv("CHAT_BACKUP_FREQUENCY", "daily")
    CHAT_BACKUP_RETENTION_DAYS: int = int(os.getenv("CHAT_BACKUP_RETENTION", 30))
    CHAT_BACKUP_ENCRYPT: bool = os.getenv("CHAT_BACKUP_ENCRYPT", "true").lower() == "true"
    CHAT_EXPORT_ENABLED: bool = os.getenv("CHAT_EXPORT_ENABLED", "true").lower() == "true"
    CHAT_EXPORT_FORMATS: List[str] = ["json", "csv", "html", "txt"]
    
    # ==================== CHAT SEARCH ====================
    CHAT_SEARCH_ENABLED: bool = os.getenv("CHAT_SEARCH_ENABLED", "true").lower() == "true"
    CHAT_SEARCH_MAX_RESULTS: int = int(os.getenv("CHAT_SEARCH_MAX_RESULTS", 100))
    CHAT_SEARCH_HIGHLIGHT: bool = os.getenv("CHAT_SEARCH_HIGHLIGHT", "true").lower() == "true"
    CHAT_SEARCH_FILTERS: List[str] = ["date", "sender", "type", "has_media"]
    
    # ==================== CHAT FILTERS ====================
    CHAT_FILTERS_ENABLED: bool = os.getenv("CHAT_FILTERS_ENABLED", "true").lower() == "true"
    CHAT_FILTER_PROFANITY: bool = os.getenv("CHAT_FILTER_PROFANITY", "true").lower() == "true"
    CHAT_FILTER_SPAM: bool = os.getenv("CHAT_FILTER_SPAM", "true").lower() == "true"
    CHAT_FILTER_PHISHING: bool = os.getenv("CHAT_FILTER_PHISHING", "true").lower() == "true"
    CHAT_FILTER_CUSTOM_WORDS: List[str] = []
    
    # ==================== CHAT ARCHIVE ====================
    CHAT_ARCHIVE_ENABLED: bool = os.getenv("CHAT_ARCHIVE_ENABLED", "true").lower() == "true"
    CHAT_ARCHIVE_AUTO_DAYS: int = int(os.getenv("CHAT_ARCHIVE_AUTO_DAYS", 30))
    CHAT_ARCHIVE_UNARCHIVE_ON_MESSAGE: bool = os.getenv("CHAT_UNARCHIVE_ON_MESSAGE", "true").lower() == "true"
    
    # ==================== CHAT MUTE ====================
    CHAT_MUTE_DURATIONS: Dict[str, int] = {
        "8_hours": 8 * 60 * 60,
        "1_week": 7 * 24 * 60 * 60,
        "1_year": 365 * 24 * 60 * 60,
        "forever": -1
    }
    CHAT_MUTE_DEFAULT_DURATION: str = os.getenv("CHAT_MUTE_DEFAULT", "8_hours")
    
    # ==================== CHAT PIN ====================
    CHAT_PIN_MAX_PER_CHAT: int = int(os.getenv("CHAT_PIN_MAX", 5))
    CHAT_PIN_NOTIFY: bool = os.getenv("CHAT_PIN_NOTIFY", "true").lower() == "true"
    
    # ==================== CHAT FOLDERS ====================
    CHAT_FOLDERS_ENABLED: bool = os.getenv("CHAT_FOLDERS_ENABLED", "true").lower() == "true"
    CHAT_FOLDERS_MAX_PER_USER: int = int(os.getenv("CHAT_FOLDERS_MAX", 10))
    CHAT_DEFAULT_FOLDERS: List[str] = ["All Chats", "Unread", "Groups", "Channels", "Archived"]
    
    # ==================== MESSAGE SCHEDULING ====================
    MESSAGE_SCHEDULING_ENABLED: bool = os.getenv("MESSAGE_SCHEDULING_ENABLED", "true").lower() == "true"
    MESSAGE_SCHEDULING_MAX_FUTURE_DAYS: int = int(os.getenv("MESSAGE_SCHEDULING_MAX_DAYS", 30))
    MESSAGE_SCHEDULING_MAX_PER_USER: int = int(os.getenv("MESSAGE_SCHEDULING_MAX", 50))
    
    # ==================== SELF-DESTRUCTING MESSAGES ====================
    SELF_DESTRUCT_ENABLED: bool = os.getenv("SELF_DESTRUCT_ENABLED", "true").lower() == "true"
    SELF_DESTRUCT_TIMERS: List[int] = [5, 10, 30, 60, 300, 600, 3600]  # seconds
    SELF_DESTRUCT_DEFAULT_TIMER: int = int(os.getenv("SELF_DESTRUCT_DEFAULT", 60))
    
    # ==================== SECRET CHAT (E2EE) ====================
    SECRET_CHAT_ENABLED: bool = os.getenv("SECRET_CHAT_ENABLED", "true").lower() == "true"
    SECRET_CHAT_ENCRYPTION_ALGORITHM: str = os.getenv("SECRET_CHAT_ENCRYPTION", "aes-256-gcm")
    SECRET_CHAT_KEY_EXCHANGE: str = os.getenv("SECRET_CHAT_KEY_EXCHANGE", "ecdh")
    SECRET_CHAT_SESSION_TIMEOUT: int = int(os.getenv("SECRET_CHAT_TIMEOUT", 86400))  # 24 hours
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_message_type(cls, msg_type: str) -> Optional[Dict]:
        """Get message type configuration"""
        return cls.MESSAGE_TYPES.get(msg_type)
    
    @classmethod
    def get_all_message_types(cls) -> Dict[str, Dict]:
        """Get all message types"""
        return cls.MESSAGE_TYPES
    
    @classmethod
    def get_formatting_syntax(cls, formatting: str) -> Optional[Dict]:
        """Get formatting syntax"""
        return cls.RICH_TEXT_FORMATTING.get(formatting)
    
    @classmethod
    def get_all_formatting(cls) -> Dict[str, Dict]:
        """Get all formatting options"""
        return cls.RICH_TEXT_FORMATTING
    
    @classmethod
    def get_reactions(cls) -> List[str]:
        """Get allowed reactions"""
        return cls.REACTION_ALLOWED
    
    @classmethod
    def is_reaction_enabled(cls) -> bool:
        """Check if reactions are enabled"""
        return cls.REACTION_ENABLED
    
    @classmethod
    def is_voice_message_enabled(cls) -> bool:
        """Check if voice messages are enabled"""
        return cls.VOICE_MESSAGE_ENABLED
    
    @classmethod
    def is_typing_indicator_enabled(cls) -> bool:
        """Check if typing indicator is enabled"""
        return cls.TYPING_INDICATOR_ENABLED
    
    @classmethod
    def is_read_receipts_enabled(cls) -> bool:
        """Check if read receipts are enabled"""
        return cls.READ_RECEIPTS_ENABLED
    
    @classmethod
    def is_last_seen_enabled(cls) -> bool:
        """Check if last seen is enabled"""
        return cls.LAST_SEEN_ENABLED
    
    @classmethod
    def is_chat_backup_enabled(cls) -> bool:
        """Check if chat backup is enabled"""
        return cls.CHAT_BACKUP_ENABLED
    
    @classmethod
    def is_chat_search_enabled(cls) -> bool:
        """Check if chat search is enabled"""
        return cls.CHAT_SEARCH_ENABLED
    
    @classmethod
    def is_chat_filters_enabled(cls) -> bool:
        """Check if chat filters are enabled"""
        return cls.CHAT_FILTERS_ENABLED
    
    @classmethod
    def is_chat_archive_enabled(cls) -> bool:
        """Check if chat archive is enabled"""
        return cls.CHAT_ARCHIVE_ENABLED
    
    @classmethod
    def is_secret_chat_enabled(cls) -> bool:
        """Check if secret chat is enabled"""
        return cls.SECRET_CHAT_ENABLED
    
    @classmethod
    def is_self_destruct_enabled(cls) -> bool:
        """Check if self-destruct is enabled"""
        return cls.SELF_DESTRUCT_ENABLED
    
    @classmethod
    def is_message_scheduling_enabled(cls) -> bool:
        """Check if message scheduling is enabled"""
        return cls.MESSAGE_SCHEDULING_ENABLED
    
    @classmethod
    def get_mute_duration(cls, duration_key: str) -> int:
        """Get mute duration in seconds"""
        return cls.CHAT_MUTE_DURATIONS.get(duration_key, 8 * 60 * 60)
    
    @classmethod
    def get_mute_options(cls) -> Dict[str, int]:
        """Get all mute options"""
        return cls.CHAT_MUTE_DURATIONS
    
    @classmethod
    def get_self_destruct_timers(cls) -> List[int]:
        """Get self-destruct timers"""
        return cls.SELF_DESTRUCT_TIMERS
    
    @classmethod
    def get_voice_message_config(cls) -> Dict[str, Any]:
        """Get voice message configuration"""
        return {
            "enabled": cls.VOICE_MESSAGE_ENABLED,
            "max_duration": cls.VOICE_MESSAGE_MAX_DURATION,
            "quality": cls.VOICE_MESSAGE_QUALITY,
            "format": cls.VOICE_MESSAGE_FORMAT,
            "transcription": cls.VOICE_MESSAGE_TRANSCRIPTION,
            "transcription_languages": cls.VOICE_MESSAGE_TRANSCRIPTION_LANGUAGES
        }
    
    @classmethod
    def get_media_allowed_types(cls) -> List[str]:
        """Get allowed media types"""
        return cls.MEDIA_ALLOWED_TYPES
    
    @classmethod
    def get_export_formats(cls) -> List[str]:
        """Get export formats"""
        return cls.CHAT_EXPORT_FORMATS
    
    @classmethod
    def get_max_message_length(cls) -> int:
        """Get maximum message length"""
        return cls.MESSAGE_MAX_LENGTH
    
    @classmethod
    def get_edit_window(cls) -> int:
        """Get edit window in seconds"""
        return cls.MESSAGE_EDIT_WINDOW
    
    @classmethod
    def get_delete_window(cls) -> int:
        """Get delete window in seconds"""
        return cls.MESSAGE_DELETE_WINDOW


# Create chat config instance
chat_config = ChatConfig()

# Print chat configuration status
print(f"💬 Chat Configuration")
print(f"   Message Types: {len(chat_config.get_all_message_types())}")
print(f"   Formatting Options: {len(chat_config.get_all_formatting())}")
print(f"   Reactions: {len(chat_config.get_reactions())}")
print(f"   Voice Messages: {'Enabled' if chat_config.is_voice_message_enabled() else 'Disabled'}")
print(f"   Read Receipts: {'Enabled' if chat_config.is_read_receipts_enabled() else 'Disabled'}")
print(f"   Secret Chat: {'Enabled' if chat_config.is_secret_chat_enabled() else 'Disabled'}")
