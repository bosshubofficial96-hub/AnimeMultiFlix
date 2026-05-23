"""
AnimeMultiFlix - Group Configuration (Telegram-like)
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class GroupConfig:
    """Group Configuration Class - Telegram-like Features"""
    
    # ==================== GROUP TYPES ====================
    GROUP_TYPES: Dict[str, Dict] = {
        "public": {
            "id": "public",
            "name": "Public Group",
            "description": "Anyone can find and join",
            "icon": "fa-globe",
            "color": "#3498DB",
            "visibility": "public",
            "join_type": "auto"
        },
        "private": {
            "id": "private",
            "name": "Private Group",
            "description": "Invite-only, hidden from search",
            "icon": "fa-lock",
            "color": "#F39C12",
            "visibility": "hidden",
            "join_type": "invite"
        },
        "secret": {
            "id": "secret",
            "name": "Secret Group",
            "description": "Completely hidden, invite-only",
            "icon": "fa-user-secret",
            "color": "#E74C3C",
            "visibility": "secret",
            "join_type": "invite"
        }
    }
    
    # ==================== CHANNEL TYPES ====================
    CHANNEL_TYPES: Dict[str, Dict] = {
        "public": {
            "id": "public",
            "name": "Public Channel",
            "description": "Anyone can follow",
            "icon": "fa-bullhorn",
            "color": "#2ECC71",
            "post_permission": "admin_only"
        },
        "private": {
            "id": "private",
            "name": "Private Channel",
            "description": "Invite-only followers",
            "icon": "fa-lock",
            "color": "#E67E22",
            "post_permission": "admin_only"
        }
    }
    
    # ==================== GROUP MEMBERSHIP LIMITS ====================
    GROUP_MEMBERS_LIMITS: Dict[str, Dict] = {
        "free": {
            "max_members": 100,
            "max_admins": 5,
            "max_moderators": 10,
            "max_invites_per_day": 20
        },
        "basic": {
            "max_members": 500,
            "max_admins": 10,
            "max_moderators": 20,
            "max_invites_per_day": 50
        },
        "pro": {
            "max_members": 2000,
            "max_admins": 20,
            "max_moderators": 50,
            "max_invites_per_day": 100
        },
        "ultimate": {
            "max_members": 10000,
            "max_admins": 50,
            "max_moderators": 100,
            "max_invites_per_day": 500
        },
        "family": {
            "max_members": 10000,
            "max_admins": 50,
            "max_moderators": 100,
            "max_invites_per_day": 500
        }
    }
    
    # ==================== GROUPS PER USER LIMITS ====================
    GROUPS_PER_USER_LIMITS: Dict[str, int] = {
        "free": 10,
        "basic": 50,
        "pro": 100,
        "ultimate": 200,
        "family": 200
    }
    
    # ==================== GROUP ROLES ====================
    GROUP_ROLES: Dict[str, Dict] = {
        "owner": {
            "id": "owner",
            "name": "Owner",
            "level": 0,
            "color": "#FF3366",
            "badge": "👑",
            "permissions": [
                "edit_group",
                "delete_group",
                "manage_members",
                "manage_roles",
                "manage_permissions",
                "manage_invites",
                "delete_messages",
                "pin_messages",
                "edit_settings",
                "manage_voice_chat",
                "view_analytics",
                "export_data"
            ]
        },
        "admin": {
            "id": "admin",
            "name": "Administrator",
            "level": 1,
            "color": "#4ECDC4",
            "badge": "🛡️",
            "permissions": [
                "manage_members",
                "manage_invites",
                "delete_messages",
                "pin_messages",
                "edit_settings",
                "manage_voice_chat"
            ]
        },
        "moderator": {
            "id": "moderator",
            "name": "Moderator",
            "level": 2,
            "color": "#FFE66D",
            "badge": "⚡",
            "permissions": [
                "delete_messages",
                "pin_messages",
                "mute_members",
                "warn_members"
            ]
        },
        "member": {
            "id": "member",
            "name": "Member",
            "level": 3,
            "color": "#95A5A6",
            "badge": "👤",
            "permissions": [
                "send_messages",
                "send_media",
                "reply_messages",
                "react_messages",
                "view_members"
            ]
        },
        "restricted": {
            "id": "restricted",
            "name": "Restricted",
            "level": 4,
            "color": "#E74C3C",
            "badge": "🚫",
            "permissions": [
                "view_messages"
            ]
        },
        "muted": {
            "id": "muted",
            "name": "Muted",
            "level": 5,
            "color": "#7F8C8D",
            "badge": "🔇",
            "permissions": []
        },
        "banned": {
            "id": "banned",
            "name": "Banned",
            "level": 6,
            "color": "#000000",
            "badge": "⛔",
            "permissions": []
        }
    }
    
    # ==================== INVITE SETTINGS ====================
    INVITE_LINK_EXPIRY: int = int(os.getenv("INVITE_LINK_EXPIRY", 7 * 24 * 60 * 60))  # 7 days
    INVITE_MAX_USES: int = int(os.getenv("INVITE_MAX_USES", 100))
    INVITE_CODE_LENGTH: int = int(os.getenv("INVITE_CODE_LENGTH", 8))
    INVITE_CODE_CHARS: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    
    # ==================== MESSAGE SETTINGS ====================
    MESSAGE_MAX_LENGTH: int = int(os.getenv("GROUP_MESSAGE_MAX_LENGTH", 5000))
    MESSAGE_EDIT_WINDOW: int = int(os.getenv("MESSAGE_EDIT_WINDOW", 60 * 60))  # 1 hour
    MESSAGE_DELETE_WINDOW: int = int(os.getenv("MESSAGE_DELETE_WINDOW", 60 * 60))  # 1 hour
    MESSAGE_DELETE_FOR_EVERYONE_WINDOW: int = int(os.getenv("MESSAGE_DELETE_EVERYONE_WINDOW", 60 * 60))  # 1 hour
    
    # Message Types
    MESSAGE_TYPES: Dict[str, str] = {
        "text": "text",
        "voice": "voice",
        "video": "video",
        "image": "image",
        "file": "file",
        "sticker": "sticker",
        "gif": "gif",
        "poll": "poll",
        "quiz": "quiz",
        "location": "location",
        "contact": "contact"
    }
    
    # ==================== MEDIA SETTINGS ====================
    MEDIA_MAX_FILE_SIZE: int = int(os.getenv("GROUP_MEDIA_MAX_SIZE", 100 * 1024 * 1024))  # 100MB
    MEDIA_ALLOWED_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "audio/mpeg",
        "audio/ogg",
        "application/pdf",
        "application/zip"
    ]
    MEDIA_RETENTION_DAYS: int = int(os.getenv("GROUP_MEDIA_RETENTION_DAYS", 90))
    MEDIA_THUMBNAIL_ENABLED: bool = True
    MEDIA_THUMBNAIL_SIZE: tuple = (300, 300)
    
    # ==================== RATE LIMITING ====================
    GROUP_RATE_LIMITS: Dict[str, int] = {
        "messages_per_minute": 60,
        "media_per_minute": 10,
        "invites_per_minute": 5,
        "new_groups_per_day": 10
    }
    
    # ==================== SLOW MODE ====================
    SLOW_MODE_INTERVALS: Dict[str, int] = {
        "off": 0,
        "1s": 1,
        "5s": 5,
        "10s": 10,
        "30s": 30,
        "1m": 60,
        "5m": 300,
        "10m": 600,
        "30m": 1800,
        "1h": 3600
    }
    SLOW_MODE_DEFAULT: str = "off"
    
    # ==================== VOICE CHAT SETTINGS ====================
    VOICE_CHAT_ENABLED: bool = os.getenv("GROUP_VOICE_CHAT_ENABLED", "true").lower() == "true"
    VOICE_CHAT_MAX_PARTICIPANTS: int = int(os.getenv("GROUP_VOICE_MAX_PARTICIPANTS", 50))
    VOICE_CHAT_MAX_DURATION: int = int(os.getenv("GROUP_VOICE_MAX_DURATION", 3600))  # 1 hour
    VOICE_CHAT_RECORDING_ENABLED: bool = os.getenv("GROUP_VOICE_RECORDING", "false").lower() == "true"
    VOICE_CHAT_BITRATES: Dict[str, int] = {
        "low": 32000,
        "medium": 64000,
        "high": 128000,
        "ultra": 256000
    }
    VOICE_CHAT_DEFAULT_BITRATE: str = "medium"
    
    # ==================== VIDEO CHAT SETTINGS ====================
    VIDEO_CHAT_ENABLED: bool = os.getenv("GROUP_VIDEO_CHAT_ENABLED", "true").lower() == "true"
    VIDEO_CHAT_MAX_PARTICIPANTS: int = int(os.getenv("GROUP_VIDEO_MAX_PARTICIPANTS", 10))
    VIDEO_CHAT_QUALITIES: List[str] = ["360p", "480p", "720p", "1080p"]
    VIDEO_CHAT_DEFAULT_QUALITY: str = "720p"
    
    # ==================== WATCH PARTY SETTINGS ====================
    WATCH_PARTY_ENABLED: bool = os.getenv("GROUP_WATCH_PARTY_ENABLED", "true").lower() == "true"
    WATCH_PARTY_SYNC_INTERVAL: int = int(os.getenv("WATCH_PARTY_SYNC_INTERVAL", 100))  # milliseconds
    WATCH_PARTY_MAX_OFFSET: int = int(os.getenv("WATCH_PARTY_MAX_OFFSET", 2000))  # milliseconds
    WATCH_PARTY_AUTO_SYNC: bool = True
    
    # ==================== STICKER SETTINGS ====================
    STICKER_ENABLED: bool = True
    STICKER_MAX_SIZE: int = 512 * 1024  # 512KB
    STICKER_ALLOWED_FORMATS: List[str] = ["image/webp", "image/png", "image/gif"]
    STICKER_MAX_PER_PACK: int = 120
    STICKER_MAX_PACKS_PER_USER: int = 10
    STICKER_ANIMATED_ENABLED: bool = True
    STICKER_ANIMATED_MAX_SIZE: int = 2 * 1024 * 1024  # 2MB
    
    # ==================== POLL SETTINGS ====================
    POLL_MAX_OPTIONS: int = 10
    POLL_MAX_DURATION: int = 7 * 24 * 60 * 60  # 7 days
    POLL_ANONYMOUS_ENABLED: bool = True
    POLL_MULTIPLE_VOTES_ENABLED: bool = True
    POLL_QUIZ_MODE_ENABLED: bool = True
    
    # ==================== GROUP VERIFICATION ====================
    GROUP_VERIFICATION_REQUIREMENTS: Dict[str, Any] = {
        "verified_badge": {
            "min_members": 1000,
            "min_age_days": 30,
            "min_activity_percentage": 50,
            "no_recent_reports": True
        },
        "official_badge": {
            "requires_approval": True,
            "only_verified": True,
            "manual_review": True
        }
    }
    
    # ==================== GROUP BACKUP ====================
    GROUP_BACKUP_ENABLED: bool = os.getenv("GROUP_BACKUP_ENABLED", "true").lower() == "true"
    GROUP_BACKUP_FREQUENCY: str = "daily"
    GROUP_BACKUP_RETENTION_DAYS: int = 30
    GROUP_BACKUP_INCLUDE: List[str] = ["members", "messages", "settings", "media"]
    
    # ==================== GROUP ANALYTICS ====================
    GROUP_ANALYTICS_ENABLED: bool = True
    GROUP_ANALYTICS_METRICS: List[str] = [
        "member_count",
        "message_count",
        "active_members",
        "new_members",
        "left_members",
        "message_per_day",
        "top_active_members",
        "popular_hours"
    ]
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_group_type(cls, type_id: str) -> Optional[Dict]:
        """Get group type by ID"""
        return cls.GROUP_TYPES.get(type_id)
    
    @classmethod
    def get_all_group_types(cls) -> Dict[str, Dict]:
        """Get all group types"""
        return cls.GROUP_TYPES
    
    @classmethod
    def get_channel_type(cls, type_id: str) -> Optional[Dict]:
        """Get channel type by ID"""
        return cls.CHANNEL_TYPES.get(type_id)
    
    @classmethod
    def get_all_channel_types(cls) -> Dict[str, Dict]:
        """Get all channel types"""
        return cls.CHANNEL_TYPES
    
    @classmethod
    def get_group_role(cls, role_id: str) -> Optional[Dict]:
        """Get group role by ID"""
        return cls.GROUP_ROLES.get(role_id)
    
    @classmethod
    def get_all_roles(cls) -> Dict[str, Dict]:
        """Get all group roles"""
        return cls.GROUP_ROLES
    
    @classmethod
    def get_role_permissions(cls, role_id: str) -> List[str]:
        """Get permissions for a role"""
        role = cls.get_group_role(role_id)
        if not role:
            return []
        return role.get("permissions", [])
    
    @classmethod
    def has_permission(cls, role_id: str, permission: str) -> bool:
        """Check if role has permission"""
        permissions = cls.get_role_permissions(role_id)
        return permission in permissions
    
    @classmethod
    def get_group_members_limit(cls, plan_id: str, limit_type: str = "max_members") -> int:
        """Get group members limit for a plan"""
        limits = cls.GROUP_MEMBERS_LIMITS.get(plan_id, {})
        return limits.get(limit_type, 0)
    
    @classmethod
    def get_groups_per_user_limit(cls, plan_id: str) -> int:
        """Get groups per user limit for a plan"""
        return cls.GROUPS_PER_USER_LIMITS.get(plan_id, 10)
    
    @classmethod
    def get_invite_link_expiry(cls) -> int:
        """Get invite link expiry time in seconds"""
        return cls.INVITE_LINK_EXPIRY
    
    @classmethod
    def generate_invite_code(cls) -> str:
        """Generate a random invite code"""
        import random
        import string
        
        chars = cls.INVITE_CODE_CHARS
        return ''.join(random.choices(chars, k=cls.INVITE_CODE_LENGTH))
    
    @classmethod
    def get_slow_mode_interval(cls, mode: str) -> int:
        """Get slow mode interval in seconds"""
        return cls.SLOW_MODE_INTERVALS.get(mode, 0)
    
    @classmethod
    def get_slow_mode_options(cls) -> Dict[str, int]:
        """Get all slow mode options"""
        return cls.SLOW_MODE_INTERVALS
    
    @classmethod
    def get_voice_chat_bitrate(cls, quality: str) -> int:
        """Get voice chat bitrate for quality"""
        return cls.VOICE_CHAT_BITRATES.get(quality, 64000)
    
    @classmethod
    def is_voice_chat_enabled(cls) -> bool:
        """Check if voice chat is enabled"""
        return cls.VOICE_CHAT_ENABLED
    
    @classmethod
    def is_video_chat_enabled(cls) -> bool:
        """Check if video chat is enabled"""
        return cls.VIDEO_CHAT_ENABLED
    
    @classmethod
    def is_watch_party_enabled(cls) -> bool:
        """Check if watch party is enabled"""
        return cls.WATCH_PARTY_ENABLED
    
    @classmethod
    def is_group_backup_enabled(cls) -> bool:
        """Check if group backup is enabled"""
        return cls.GROUP_BACKUP_ENABLED
    
    @classmethod
    def get_group_rate_limit(cls, limit_type: str) -> int:
        """Get rate limit for specific type"""
        return cls.GROUP_RATE_LIMITS.get(limit_type, 0)
    
    @classmethod
    def is_sticker_enabled(cls) -> bool:
        """Check if stickers are enabled"""
        return cls.STICKER_ENABLED
    
    @classmethod
    def is_animated_sticker_enabled(cls) -> bool:
        """Check if animated stickers are enabled"""
        return cls.STICKER_ANIMATED_ENABLED
    
    @classmethod
    def get_media_allowed_types(cls) -> List[str]:
        """Get allowed media types"""
        return cls.MEDIA_ALLOWED_TYPES
    
    @classmethod
    def get_message_max_length(cls) -> int:
        """Get maximum message length"""
        return cls.MESSAGE_MAX_LENGTH
    
    @classmethod
    def get_message_edit_window(cls) -> int:
        """Get message edit window in seconds"""
        return cls.MESSAGE_EDIT_WINDOW
    
    @classmethod
    def get_verification_requirements(cls, badge_type: str) -> Dict:
        """Get verification requirements for badge"""
        return cls.GROUP_VERIFICATION_REQUIREMENTS.get(badge_type, {})
    
    @classmethod
    def get_analytics_metrics(cls) -> List[str]:
        """Get analytics metrics"""
        return cls.GROUP_ANALYTICS_METRICS
    
    @classmethod
    def is_analytics_enabled(cls) -> bool:
        """Check if group analytics is enabled"""
        return cls.GROUP_ANALYTICS_ENABLED


# Create group config instance
group_config = GroupConfig()

# Print group configuration status
print(f"👥 Group Configuration")
print(f"   Group Types: {len(group_config.get_all_group_types())}")
print(f"   Channel Types: {len(group_config.get_all_channel_types())}")
print(f"   Roles: {len(group_config.get_all_roles())}")
print(f"   Voice Chat: {'Enabled' if group_config.is_voice_chat_enabled() else 'Disabled'}")
print(f"   Watch Party: {'Enabled' if group_config.is_watch_party_enabled() else 'Disabled'}")
