"""
AnimeMultiFlix - Admin Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class AdminConfig:
    """Admin Panel Configuration Class"""
    
    # ==================== SUPER ADMIN SETTINGS ====================
    SUPER_ADMIN_EMAIL: str = os.getenv("SUPER_ADMIN_EMAIL", "owner@animemultiflix.com")
    SUPER_ADMIN_USERNAME: str = os.getenv("SUPER_ADMIN_USERNAME", "animemultiflix_owner")
    SUPER_ADMIN_PASSWORD: str = os.getenv("SUPER_ADMIN_PASSWORD", "Admin@2026#AMF")
    SUPER_ADMIN_NAME: str = os.getenv("SUPER_ADMIN_NAME", "AnimeMultiFlix Owner")
    SUPER_ADMIN_AVATAR: str = "/assets/images/admin-avatar.png"
    
    # ==================== ADMIN ROLES & PERMISSIONS ====================
    ADMIN_ROLES: Dict[str, Dict] = {
        "super_admin": {
            "name": "Super Administrator",
            "description": "Full system access with all permissions",
            "level": 0,
            "permissions": ["*"],
            "max_admins": 1,
            "color": "#FF3366",
            "badge": "👑"
        },
        "admin": {
            "name": "Administrator",
            "description": "Complete admin access except system settings",
            "level": 1,
            "permissions": [
                "manage_anime",
                "manage_users",
                "manage_admins",
                "manage_reports",
                "view_analytics",
                "manage_settings",
                "send_notifications",
                "manage_comments",
                "view_logs",
                "manage_backups",
                "manage_payments",
                "view_audit_logs"
            ],
            "max_admins": 10,
            "color": "#4ECDC4",
            "badge": "👤"
        },
        "moderator": {
            "name": "Moderator",
            "description": "Content and user moderation",
            "level": 2,
            "permissions": [
                "manage_anime",
                "manage_comments",
                "manage_reports",
                "send_notifications",
                "view_users",
                "manage_reviews",
                "manage_ratings"
            ],
            "max_admins": 20,
            "color": "#FFE66D",
            "badge": "🛡️"
        },
        "editor": {
            "name": "Content Editor",
            "description": "Anime and episode management",
            "level": 3,
            "permissions": [
                "manage_anime",
                "upload_episodes",
                "manage_genres",
                "manage_seasons",
                "manage_cast",
                "manage_staff"
            ],
            "max_admins": 30,
            "color": "#95A5A6",
            "badge": "✏️"
        },
        "support": {
            "name": "Support Staff",
            "description": "User support and ticket management",
            "level": 4,
            "permissions": [
                "view_users",
                "view_reports",
                "send_notifications",
                "manage_tickets",
                "view_feedback"
            ],
            "max_admins": 50,
            "color": "#3498DB",
            "badge": "🎧"
        },
        "viewer": {
            "name": "Analytics Viewer",
            "description": "View-only analytics access",
            "level": 5,
            "permissions": [
                "view_analytics",
                "view_reports"
            ],
            "max_admins": 100,
            "color": "#7F8C8D",
            "badge": "👁️"
        }
    }
    
    # ==================== PERMISSIONS LIST ====================
    ALL_PERMISSIONS: List[str] = [
        # Anime Management
        "manage_anime",
        "manage_episodes",
        "manage_seasons",
        "manage_genres",
        "manage_studios",
        "manage_cast",
        "manage_staff",
        "upload_episodes",
        "upload_thumbnails",
        "upload_subtitles",
        "delete_anime",
        "delete_episodes",
        
        # User Management
        "manage_users",
        "view_users",
        "edit_users",
        "delete_users",
        "ban_users",
        "unban_users",
        "reset_user_password",
        "impersonate_user",
        "view_user_activity",
        
        # Admin Management
        "manage_admins",
        "add_admins",
        "edit_admins",
        "delete_admins",
        "assign_roles",
        
        # Content Moderation
        "manage_comments",
        "manage_reviews",
        "manage_ratings",
        "manage_reports",
        "delete_comments",
        "delete_reviews",
        "resolve_reports",
        
        # Analytics
        "view_analytics",
        "view_reports",
        "export_data",
        "view_dashboard",
        
        # System Management
        "manage_settings",
        "manage_backups",
        "view_logs",
        "manage_cache",
        "manage_webhooks",
        "manage_api_keys",
        
        # Notifications
        "send_notifications",
        "manage_announcements",
        "manage_email_templates",
        
        # Payment Management
        "manage_payments",
        "manage_subscriptions",
        "process_refunds",
        "view_transactions",
        
        # Security
        "view_audit_logs",
        "manage_ip_blacklist",
        "manage_security_settings",
        
        # Support
        "manage_tickets",
        "view_feedback"
    ]
    
    # ==================== DASHBOARD SETTINGS ====================
    DASHBOARD_THEME: str = os.getenv("ADMIN_THEME", "dark")  # dark, light, auto
    DASHBOARD_SIDEBAR_COLLAPSED: bool = os.getenv("ADMIN_SIDEBAR_COLLAPSED", "false").lower() == "true"
    DASHBOARD_ITEMS_PER_PAGE: int = int(os.getenv("ADMIN_ITEMS_PER_PAGE", 50))
    DASHBOARD_DEFAULT_VIEW: str = os.getenv("ADMIN_DEFAULT_VIEW", "grid")  # grid, list
    DASHBOARD_CHART_THEME: str = os.getenv("ADMIN_CHART_THEME", "dark")
    DASHBOARD_REFRESH_INTERVAL: int = int(os.getenv("ADMIN_REFRESH_INTERVAL", 30000))  # milliseconds
    DASHBOARD_ENABLE_REAL_TIME: bool = os.getenv("ADMIN_REAL_TIME", "true").lower() == "true"
    
    # Dashboard Widgets
    DASHBOARD_WIDGETS: List[str] = [
        "total_users",
        "total_animes",
        "total_episodes",
        "total_views",
        "total_revenue",
        "active_users",
        "premium_users",
        "new_users_today",
        "new_anime_today",
        "total_groups",
        "total_messages",
        "system_health",
        "server_status",
        "recent_activities",
        "top_animes",
        "top_users",
        "recent_reports",
        "pending_approvals",
        "storage_usage",
        "bandwidth_usage"
    ]
    
    # ==================== AUTHENTICATION SETTINGS ====================
    ADMIN_AUTH_SESSION_TIMEOUT: int = int(os.getenv("ADMIN_SESSION_TIMEOUT", 3600))  # seconds
    ADMIN_AUTH_MAX_LOGIN_ATTEMPTS: int = int(os.getenv("ADMIN_MAX_LOGIN_ATTEMPTS", 5))
    ADMIN_AUTH_LOCKOUT_DURATION: int = int(os.getenv("ADMIN_LOCKOUT_DURATION", 900))  # seconds
    ADMIN_AUTH_REQUIRE_2FA: bool = os.getenv("ADMIN_REQUIRE_2FA", "false").lower() == "true"
    ADMIN_AUTH_REQUIRE_STRONG_PASSWORD: bool = os.getenv("ADMIN_STRONG_PASSWORD", "true").lower() == "true"
    ADMIN_AUTH_SINGLE_SESSION: bool = os.getenv("ADMIN_SINGLE_SESSION", "true").lower() == "true"
    ADMIN_AUTH_SESSION_PER_USER: int = int(os.getenv("ADMIN_SESSION_PER_USER", 3))
    
    # Password Policy for Admins
    ADMIN_PASSWORD_POLICY: Dict[str, Any] = {
        "min_length": 10,
        "max_length": 64,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_numbers": True,
        "require_special": True,
        "special_chars": "!@#$%^&*()_+-=[]{}|;:,.<>?",
        "expiry_days": 90,
        "history_count": 5,
        "prevent_common": True,
        "prevent_username": True
    }
    
    # ==================== AUDIT & LOGGING ====================
    AUDIT_ENABLED: bool = os.getenv("ADMIN_AUDIT_ENABLED", "true").lower() == "true"
    AUDIT_LOG_ACTIONS: bool = os.getenv("AUDIT_LOG_ACTIONS", "true").lower() == "true"
    AUDIT_LOG_IP: bool = os.getenv("AUDIT_LOG_IP", "true").lower() == "true"
    AUDIT_LOG_USER_AGENT: bool = os.getenv("AUDIT_LOG_USER_AGENT", "true").lower() == "true"
    AUDIT_LOG_REQUEST_BODY: bool = os.getenv("AUDIT_LOG_REQUEST_BODY", "false").lower() == "true"
    AUDIT_LOG_RESPONSE_BODY: bool = os.getenv("AUDIT_LOG_RESPONSE_BODY", "false").lower() == "true"
    AUDIT_RETENTION_DAYS: int = int(os.getenv("AUDIT_RETENTION_DAYS", 90))
    AUDIT_EXPORT_ENABLED: bool = os.getenv("AUDIT_EXPORT_ENABLED", "true").lower() == "true"
    
    # Actions to log
    AUDIT_ACTIONS: Dict[str, bool] = {
        "login": True,
        "logout": True,
        "login_failed": True,
        "create": True,
        "update": True,
        "delete": True,
        "export": True,
        "import": True,
        "settings_change": True,
        "role_change": True,
        "permission_change": True,
        "password_change": True,
        "2fa_enable": True,
        "2fa_disable": True,
        "backup_create": True,
        "backup_restore": True,
        "cache_clear": True,
        "user_ban": True,
        "user_unban": True,
        "user_impersonate": True
    }
    
    # ==================== BACKUP SETTINGS ====================
    ADMIN_BACKUP_AUTO_BACKUP: bool = os.getenv("ADMIN_AUTO_BACKUP", "true").lower() == "true"
    ADMIN_BACKUP_FREQUENCY: str = os.getenv("ADMIN_BACKUP_FREQUENCY", "daily")  # hourly, daily, weekly, monthly
    ADMIN_BACKUP_TIME: str = os.getenv("ADMIN_BACKUP_TIME", "02:00")
    ADMIN_BACKUP_DAY: int = int(os.getenv("ADMIN_BACKUP_DAY", 0))  # 0=Sunday, 1=Monday, etc.
    ADMIN_BACKUP_RETENTION: int = int(os.getenv("ADMIN_BACKUP_RETENTION", 30))  # days
    ADMIN_BACKUP_STORAGE_PATH: str = os.getenv("ADMIN_BACKUP_PATH", "./backups/admin")
    ADMIN_BACKUP_COMPRESS: bool = os.getenv("ADMIN_BACKUP_COMPRESS", "true").lower() == "true"
    ADMIN_BACKUP_ENCRYPT: bool = os.getenv("ADMIN_BACKUP_ENCRYPT", "true").lower() == "true"
    ADMIN_BACKUP_INCLUDE: List[str] = ["database", "uploads", "logs", "config"]
    ADMIN_BACKUP_EXCLUDE: List[str] = ["temp", "cache"]
    ADMIN_BACKUP_NOTIFY_EMAIL: bool = os.getenv("ADMIN_BACKUP_NOTIFY", "true").lower() == "true"
    
    # ==================== NOTIFICATION SETTINGS ====================
    ADMIN_NOTIFICATIONS_EMAIL_ENABLED: bool = os.getenv("ADMIN_NOTIFY_EMAIL", "true").lower() == "true"
    ADMIN_NOTIFICATIONS_PUSH_ENABLED: bool = os.getenv("ADMIN_NOTIFY_PUSH", "true").lower() == "true"
    ADMIN_NOTIFICATIONS_SLACK_ENABLED: bool = os.getenv("ADMIN_NOTIFY_SLACK", "false").lower() == "true"
    ADMIN_NOTIFICATIONS_TEAMS_ENABLED: bool = os.getenv("ADMIN_NOTIFY_TEAMS", "false").lower() == "true"
    ADMIN_NOTIFICATIONS_ADMIN_ALERTS: bool = os.getenv("ADMIN_ALERTS", "true").lower() == "true"
    ADMIN_NOTIFICATIONS_USER_ALERTS: bool = os.getenv("USER_ALERTS", "true").lower() == "true"
    ADMIN_NOTIFICATIONS_SYSTEM_ALERTS: bool = os.getenv("SYSTEM_ALERTS", "true").lower() == "true"
    ADMIN_NOTIFICATIONS_SECURITY_ALERTS: bool = os.getenv("SECURITY_ALERTS", "true").lower() == "true"
    
    # Slack/Teams Webhooks
    ADMIN_SLACK_WEBHOOK_URL: Optional[str] = os.getenv("ADMIN_SLACK_WEBHOOK")
    ADMIN_TEAMS_WEBHOOK_URL: Optional[str] = os.getenv("ADMIN_TEAMS_WEBHOOK")
    
    # ==================== UI SETTINGS ====================
    ADMIN_UI_LOGO_URL: str = "/assets/images/admin-logo.png"
    ADMIN_UI_FAVICON: str = "/assets/images/favicon.ico"
    ADMIN_UI_PRIMARY_COLOR: str = "#FF3366"
    ADMIN_UI_SECONDARY_COLOR: str = "#4ECDC4"
    ADMIN_UI_ACCENT_COLOR: str = "#FFE66D"
    ADMIN_UI_SUCCESS_COLOR: str = "#2ECC71"
    ADMIN_UI_WARNING_COLOR: str = "#F39C12"
    ADMIN_UI_ERROR_COLOR: str = "#E74C3C"
    ADMIN_UI_INFO_COLOR: str = "#3498DB"
    ADMIN_UI_FONT_FAMILY: str = "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ADMIN_UI_DATE_FORMAT: str = "YYYY-MM-DD HH:mm:ss"
    ADMIN_UI_TIMEZONE: str = "Asia/Tokyo"
    ADMIN_UI_LANGUAGE: str = "en"
    ADMIN_UI_CUSTOM_CSS: Optional[str] = os.getenv("ADMIN_CUSTOM_CSS")
    ADMIN_UI_CUSTOM_JS: Optional[str] = os.getenv("ADMIN_CUSTOM_JS")
    
    # ==================== API SETTINGS ====================
    ADMIN_API_RATE_LIMIT: int = int(os.getenv("ADMIN_API_RATE_LIMIT", 1000))  # requests per hour
    ADMIN_API_KEY_REQUIRED: bool = os.getenv("ADMIN_API_KEY_REQUIRED", "true").lower() == "true"
    ADMIN_API_KEY_LENGTH: int = 32
    ADMIN_API_KEY_EXPIRY: int = 365 * 24 * 60 * 60  # 1 year
    ADMIN_API_ALLOWED_IPS: List[str] = os.getenv("ADMIN_ALLOWED_IPS", "").split(",") if os.getenv("ADMIN_ALLOWED_IPS") else []
    ADMIN_API_WEBHOOK_ENABLED: bool = os.getenv("ADMIN_WEBHOOK_ENABLED", "false").lower() == "true"
    ADMIN_API_WEBHOOK_URL: Optional[str] = os.getenv("ADMIN_WEBHOOK_URL")
    ADMIN_API_VERSION: str = "v1"
    ADMIN_API_PREFIX: str = "/api/admin"
    
    # ==================== FEATURES SETTINGS ====================
    ADMIN_FEATURES: Dict[str, bool] = {
        "anime_management": True,
        "user_management": True,
        "admin_management": True,
        "content_moderation": True,
        "analytics": True,
        "reports": True,
        "backup_restore": True,
        "cache_management": True,
        "log_viewer": True,
        "system_settings": True,
        "payment_management": True,
        "subscription_management": True,
        "notification_management": True,
        "api_management": True,
        "webhook_management": True,
        "email_templates": True,
        "announcements": True,
        "maintenance_mode": True,
        "debug_mode": False
    }
    
    # ==================== EMAIL TEMPLATES ====================
    ADMIN_EMAIL_TEMPLATES: Dict[str, Dict] = {
        "welcome_admin": {
            "subject": "Welcome to AnimeMultiFlix Admin Panel",
            "template": "emails/admin/welcome.html",
            "variables": ["name", "email", "role", "login_url"]
        },
        "password_reset": {
            "subject": "Admin Password Reset Request",
            "template": "emails/admin/password-reset.html",
            "variables": ["name", "reset_link", "expiry_minutes", "ip_address"]
        },
        "new_report": {
            "subject": "New Report Received - Action Required",
            "template": "emails/admin/new-report.html",
            "variables": ["report_id", "type", "reporter", "reported_user", "reason", "view_link"]
        },
        "system_alert": {
            "subject": "System Alert - Action Required",
            "template": "emails/admin/system-alert.html",
            "variables": ["alert_level", "message", "timestamp", "action_link"]
        },
        "backup_completed": {
            "subject": "Backup Completed Successfully",
            "template": "emails/admin/backup-completed.html",
            "variables": ["backup_size", "backup_time", "backup_location", "download_link"]
        },
        "backup_failed": {
            "subject": "Backup Failed - Immediate Attention Required",
            "template": "emails/admin/backup-failed.html",
            "variables": ["error_message", "timestamp", "retry_link"]
        },
        "user_report": {
            "subject": "User Reported - Content Violation",
            "template": "emails/admin/user-report.html",
            "variables": ["user_name", "violation_type", "evidence_link", "action_buttons"]
        },
        "daily_summary": {
            "subject": "Daily Admin Summary Report",
            "template": "emails/admin/daily-summary.html",
            "variables": ["date", "new_users", "new_anime", "new_reports", "revenue", "top_anime"]
        }
    }
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_role(cls, role_name: str) -> Optional[Dict]:
        """Get role by name"""
        return cls.ADMIN_ROLES.get(role_name)
    
    @classmethod
    def get_role_permissions(cls, role_name: str) -> List[str]:
        """Get permissions for a role"""
        role = cls.get_role(role_name)
        if not role:
            return []
        return role.get("permissions", [])
    
    @classmethod
    def has_permission(cls, role_name: str, permission: str) -> bool:
        """Check if role has permission"""
        permissions = cls.get_role_permissions(role_name)
        return "*" in permissions or permission in permissions
    
    @classmethod
    def get_all_roles(cls) -> List[str]:
        """Get all role names"""
        return list(cls.ADMIN_ROLES.keys())
    
    @classmethod
    def get_max_admins_for_role(cls, role_name: str) -> int:
        """Get maximum admins allowed for a role"""
        role = cls.get_role(role_name)
        if not role:
            return 0
        return role.get("max_admins", 0)
    
    @classmethod
    def is_feature_enabled(cls, feature_name: str) -> bool:
        """Check if a feature is enabled"""
        return cls.ADMIN_FEATURES.get(feature_name, False)
    
    @classmethod
    def get_dashboard_widgets(cls) -> List[str]:
        """Get list of dashboard widgets"""
        return cls.DASHBOARD_WIDGETS
    
    @classmethod
    def get_email_template(cls, template_name: str) -> Optional[Dict]:
        """Get email template by name"""
        return cls.ADMIN_EMAIL_TEMPLATES.get(template_name)
    
    @classmethod
    def get_all_email_templates(cls) -> Dict[str, Dict]:
        """Get all email templates"""
        return cls.ADMIN_EMAIL_TEMPLATES
    
    @classmethod
    def get_password_policy(cls) -> Dict[str, Any]:
        """Get admin password policy"""
        return cls.ADMIN_PASSWORD_POLICY
    
    @classmethod
    def validate_password(cls, password: str, username: str = None) -> tuple:
        """Validate password against admin policy"""
        errors = []
        policy = cls.ADMIN_PASSWORD_POLICY
        
        if len(password) < policy["min_length"]:
            errors.append(f"Password must be at least {policy['min_length']} characters")
        if len(password) > policy["max_length"]:
            errors.append(f"Password must be less than {policy['max_length']} characters")
        if policy["require_uppercase"] and not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        if policy["require_lowercase"] and not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        if policy["require_numbers"] and not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one number")
        if policy["require_special"] and not any(c in policy["special_chars"] for c in password):
            errors.append(f"Password must contain at least one special character ({policy['special_chars']})")
        if policy["prevent_username"] and username and username.lower() in password.lower():
            errors.append("Password cannot contain your username")
        
        return len(errors) == 0, errors
    
    @classmethod
    def is_audit_action_logged(cls, action: str) -> bool:
        """Check if an action should be logged"""
        return cls.AUDIT_ACTIONS.get(action, False)
    
    @classmethod
    def get_api_config(cls) -> Dict[str, Any]:
        """Get API configuration"""
        return {
            "rate_limit": cls.ADMIN_API_RATE_LIMIT,
            "api_key_required": cls.ADMIN_API_KEY_REQUIRED,
            "api_key_length": cls.ADMIN_API_KEY_LENGTH,
            "api_key_expiry": cls.ADMIN_API_KEY_EXPIRY,
            "allowed_ips": cls.ADMIN_API_ALLOWED_IPS,
            "webhook_enabled": cls.ADMIN_API_WEBHOOK_ENABLED,
            "webhook_url": cls.ADMIN_API_WEBHOOK_URL,
            "version": cls.ADMIN_API_VERSION,
            "prefix": cls.ADMIN_API_PREFIX
        }
    
    @classmethod
    def get_backup_config(cls) -> Dict[str, Any]:
        """Get backup configuration"""
        return {
            "auto_backup": cls.ADMIN_BACKUP_AUTO_BACKUP,
            "frequency": cls.ADMIN_BACKUP_FREQUENCY,
            "time": cls.ADMIN_BACKUP_TIME,
            "retention": cls.ADMIN_BACKUP_RETENTION,
            "storage_path": cls.ADMIN_BACKUP_STORAGE_PATH,
            "compress": cls.ADMIN_BACKUP_COMPRESS,
            "encrypt": cls.ADMIN_BACKUP_ENCRYPT,
            "include": cls.ADMIN_BACKUP_INCLUDE,
            "exclude": cls.ADMIN_BACKUP_EXCLUDE,
            "notify_email": cls.ADMIN_BACKUP_NOTIFY_EMAIL
        }
    
    @classmethod
    def get_ui_config(cls) -> Dict[str, Any]:
        """Get UI configuration"""
        return {
            "theme": cls.DASHBOARD_THEME,
            "sidebar_collapsed": cls.DASHBOARD_SIDEBAR_COLLAPSED,
            "items_per_page": cls.DASHBOARD_ITEMS_PER_PAGE,
            "default_view": cls.DASHBOARD_DEFAULT_VIEW,
            "chart_theme": cls.DASHBOARD_CHART_THEME,
            "refresh_interval": cls.DASHBOARD_REFRESH_INTERVAL,
            "real_time": cls.DASHBOARD_ENABLE_REAL_TIME,
            "primary_color": cls.ADMIN_UI_PRIMARY_COLOR,
            "secondary_color": cls.ADMIN_UI_SECONDARY_COLOR,
            "date_format": cls.ADMIN_UI_DATE_FORMAT,
            "timezone": cls.ADMIN_UI_TIMEZONE,
            "language": cls.ADMIN_UI_LANGUAGE
        }


# Create admin config instance
admin_config = AdminConfig()

# Print admin configuration status
print(f"👑 Admin Panel Configuration")
print(f"   Super Admin: {admin_config.SUPER_ADMIN_EMAIL}")
print(f"   Roles: {len(admin_config.get_all_roles())}")
print(f"   Permissions: {len(admin_config.ALL_PERMISSIONS)}")
print(f"   Dashboard Theme: {admin_config.DASHBOARD_THEME}")
print(f"   Auto Backup: {admin_config.ADMIN_BACKUP_AUTO_BACKUP}")
