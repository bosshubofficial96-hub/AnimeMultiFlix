"""
AnimeMultiFlix - Database Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, Any, Optional, List
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()


class DatabaseConfig:
    """Database Configuration Class"""
    
    # ==================== MONGODB SETTINGS ====================
    MONGODB_ENABLED: bool = os.getenv("MONGODB_ENABLED", "true").lower() == "true"
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/anime_multiflix")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "anime_multiflix")
    MONGODB_USER: Optional[str] = os.getenv("MONGODB_USER")
    MONGODB_PASSWORD: Optional[str] = os.getenv("MONGODB_PASSWORD")
    MONGODB_HOST: str = os.getenv("MONGODB_HOST", "localhost")
    MONGODB_PORT: int = int(os.getenv("MONGODB_PORT", 27017))
    MONGODB_REPLICA_SET: Optional[str] = os.getenv("MONGODB_REPLICA_SET")
    MONGODB_AUTH_SOURCE: str = os.getenv("MONGODB_AUTH_SOURCE", "admin")
    MONGODB_AUTH_MECHANISM: str = os.getenv("MONGODB_AUTH_MECHANISM", "DEFAULT")
    MONGODB_SSL: bool = os.getenv("MONGODB_SSL", "false").lower() == "true"
    MONGODB_SSL_CA: Optional[str] = os.getenv("MONGODB_SSL_CA")
    MONGODB_SSL_CERT: Optional[str] = os.getenv("MONGODB_SSL_CERT")
    MONGODB_SSL_KEY: Optional[str] = os.getenv("MONGODB_SSL_KEY")
    MONGODB_RETRY_WRITES: bool = os.getenv("MONGODB_RETRY_WRITES", "true").lower() == "true"
    MONGODB_RETRY_READS: bool = os.getenv("MONGODB_RETRY_READS", "true").lower() == "true"
    
    # Connection Pool Settings
    MONGODB_MAX_POOL_SIZE: int = int(os.getenv("MONGODB_MAX_POOL_SIZE", 10))
    MONGODB_MIN_POOL_SIZE: int = int(os.getenv("MONGODB_MIN_POOL_SIZE", 1))
    MONGODB_MAX_IDLE_TIME_MS: int = int(os.getenv("MONGODB_MAX_IDLE_TIME_MS", 30000))
    MONGODB_WAIT_QUEUE_TIMEOUT_MS: int = int(os.getenv("MONGODB_WAIT_QUEUE_TIMEOUT_MS", 10000))
    
    # Timeout Settings
    MONGODB_CONNECT_TIMEOUT_MS: int = int(os.getenv("MONGODB_CONNECT_TIMEOUT_MS", 10000))
    MONGODB_SOCKET_TIMEOUT_MS: int = int(os.getenv("MONGODB_SOCKET_TIMEOUT_MS", 45000))
    MONGODB_SERVER_SELECTION_TIMEOUT_MS: int = int(os.getenv("MONGODB_SERVER_SELECTION_TIMEOUT_MS", 30000))
    MONGODB_HEARTBEAT_FREQUENCY_MS: int = int(os.getenv("MONGODB_HEARTBEAT_FREQUENCY_MS", 10000))
    
    # Write Concern
    MONGODB_W: str = os.getenv("MONGODB_W", "majority")
    MONGODB_JOURNAL: bool = os.getenv("MONGODB_JOURNAL", "true").lower() == "true"
    MONGODB_WTIMEOUT_MS: int = int(os.getenv("MONGODB_WTIMEOUT_MS", 10000))
    
    # Read Preference
    MONGODB_READ_PREFERENCE: str = os.getenv("MONGODB_READ_PREFERENCE", "primaryPreferred")
    MONGODB_READ_PREFERENCE_TAGS: List[Dict] = []
    
    # Collections
    MONGODB_COLLECTIONS: Dict[str, str] = {
        # User Collections
        "users": "users",
        "admins": "admins",
        "owners": "owners",
        "sessions": "sessions",
        
        # Content Collections
        "animes": "animes",
        "episodes": "episodes",
        "seasons": "seasons",
        "genres": "genres",
        "studios": "studios",
        "characters": "characters",
        "casts": "casts",
        "staffs": "staffs",
        "reviews": "reviews",
        "ratings": "ratings",
        "comments": "comments",
        "reports": "reports",
        
        # Group Collections
        "groups": "groups",
        "group_members": "group_members",
        "group_invites": "group_invites",
        "messages": "messages",
        "voice_messages": "voice_messages",
        "voice_rooms": "voice_rooms",
        "voice_calls": "voice_calls",
        
        # Watch Collections
        "watch_parties": "watch_parties",
        "watch_history": "watch_history",
        "watchlist": "watchlist",
        "favorites": "favorites",
        "playlists": "playlists",
        
        # Payment Collections
        "payments": "payments",
        "subscriptions": "subscriptions",
        "transactions": "transactions",
        "invoices": "invoices",
        "promo_codes": "promo_codes",
        
        # Notification Collections
        "notifications": "notifications",
        "activities": "activities",
        "analytics": "analytics",
        "logs": "logs",
        
        # System Collections
        "backups": "backups",
        "cache": "cache",
        "jobs": "jobs",
        "webhooks": "webhooks"
    }
    
    # Indexes Configuration
    MONGODB_INDEXES: Dict[str, List[Dict]] = {
        "users": [
            {"keys": [("email", 1)], "unique": True},
            {"keys": [("username", 1)], "unique": True},
            {"keys": [("role", 1)]},
            {"keys": [("is_premium", 1)]},
            {"keys": [("created_at", -1)]},
            {"keys": [("last_active", -1)]}
        ],
        "animes": [
            {"keys": [("title", "text")]},
            {"keys": [("slug", 1)], "unique": True},
            {"keys": [("status", 1)]},
            {"keys": [("genres", 1)]},
            {"keys": [("rating", -1)]},
            {"keys": [("views", -1)]},
            {"keys": [("created_at", -1)]}
        ],
        "episodes": [
            {"keys": [("anime_id", 1), ("season", 1), ("number", 1)]},
            {"keys": [("anime_id", 1), ("slug", 1)]},
            {"keys": [("release_date", -1)]},
            {"keys": [("views", -1)]}
        ],
        "groups": [
            {"keys": [("name", "text")]},
            {"keys": [("slug", 1)], "unique": True},
            {"keys": [("type", 1)]},
            {"keys": [("member_count", -1)]},
            {"keys": [("created_at", -1)]}
        ],
        "messages": [
            {"keys": [("group_id", 1), ("created_at", -1)]},
            {"keys": [("user_id", 1), ("created_at", -1)]},
            {"keys": [("type", 1)]}
        ],
        "payments": [
            {"keys": [("user_id", 1), ("created_at", -1)]},
            {"keys": [("status", 1)]},
            {"keys": [("transaction_id", 1)], "unique": True}
        ]
    }
    
    # ==================== REDIS SETTINGS ====================
    REDIS_ENABLED: bool = os.getenv("REDIS_ENABLED", "true").lower() == "true"
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    REDIS_DB: int = int(os.getenv("REDIS_DB", 0))
    REDIS_KEY_PREFIX: str = "amf:"
    REDIS_TTL: int = int(os.getenv("REDIS_TTL", 3600))
    
    # Redis Connection Settings
    REDIS_SOCKET_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_TIMEOUT", 5))
    REDIS_SOCKET_CONNECT_TIMEOUT: int = int(os.getenv("REDIS_SOCKET_CONNECT_TIMEOUT", 5))
    REDIS_RETRY_ON_TIMEOUT: bool = os.getenv("REDIS_RETRY_ON_TIMEOUT", "true").lower() == "true"
    REDIS_MAX_RETRIES: int = int(os.getenv("REDIS_MAX_RETRIES", 3))
    REDIS_RETRY_BACKOFF: int = int(os.getenv("REDIS_RETRY_BACKOFF", 100))
    REDIS_HEALTH_CHECK_INTERVAL: int = int(os.getenv("REDIS_HEALTH_CHECK_INTERVAL", 30))
    
    # Redis Sentinel
    REDIS_SENTINEL_ENABLED: bool = os.getenv("REDIS_SENTINEL_ENABLED", "false").lower() == "true"
    REDIS_SENTINEL_HOSTS: List[str] = os.getenv("REDIS_SENTINEL_HOSTS", "").split(",") if os.getenv("REDIS_SENTINEL_HOSTS") else []
    REDIS_SENTINEL_MASTER_NAME: str = os.getenv("REDIS_SENTINEL_MASTER_NAME", "mymaster")
    REDIS_SENTINEL_PASSWORD: Optional[str] = os.getenv("REDIS_SENTINEL_PASSWORD")
    
    # Redis Cluster
    REDIS_CLUSTER_ENABLED: bool = os.getenv("REDIS_CLUSTER_ENABLED", "false").lower() == "true"
    REDIS_CLUSTER_HOSTS: List[str] = os.getenv("REDIS_CLUSTER_HOSTS", "").split(",") if os.getenv("REDIS_CLUSTER_HOSTS") else []
    
    # Redis Cache TTL by Type
    REDIS_CACHE_TTL: Dict[str, int] = {
        "anime_list": 3600,
        "anime_detail": 7200,
        "episode": 1800,
        "user_profile": 300,
        "group_list": 600,
        "trending": 900,
        "recommendations": 3600,
        "session": 86400,
        "rate_limit": 60
    }
    
    # ==================== POSTGRESQL SETTINGS ====================
    POSTGRES_ENABLED: bool = os.getenv("POSTGRES_ENABLED", "false").lower() == "true"
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "anime_multiflix")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_SSL: bool = os.getenv("POSTGRES_SSL", "false").lower() == "true"
    POSTGRES_SSL_CA: Optional[str] = os.getenv("POSTGRES_SSL_CA")
    POSTGRES_SSL_CERT: Optional[str] = os.getenv("POSTGRES_SSL_CERT")
    POSTGRES_SSL_KEY: Optional[str] = os.getenv("POSTGRES_SSL_KEY")
    
    # Connection Pool
    POSTGRES_POOL_SIZE: int = int(os.getenv("POSTGRES_POOL_SIZE", 20))
    POSTGRES_MAX_OVERFLOW: int = int(os.getenv("POSTGRES_MAX_OVERFLOW", 40))
    POSTGRES_POOL_TIMEOUT: int = int(os.getenv("POSTGRES_POOL_TIMEOUT", 30))
    POSTGRES_POOL_RECYCLE: int = int(os.getenv("POSTGRES_POOL_RECYCLE", 3600))
    POSTGRES_POOL_PRE_PING: bool = os.getenv("POSTGRES_POOL_PRE_PING", "true").lower() == "true"
    
    # Query Settings
    POSTGRES_ECHO: bool = os.getenv("POSTGRES_ECHO", "false").lower() == "true"
    POSTGRES_ECHO_POOL: bool = os.getenv("POSTGRES_ECHO_POOL", "false").lower() == "true"
    POSTGRES_MAX_IDLE_TIME: int = int(os.getenv("POSTGRES_MAX_IDLE_TIME", 60))
    
    # Tables
    POSTGRES_TABLES: Dict[str, str] = {
        "analytics": "analytics",
        "audit_logs": "audit_logs",
        "error_logs": "error_logs",
        "access_logs": "access_logs",
        "performance_metrics": "performance_metrics",
        "system_metrics": "system_metrics"
    }
    
    # ==================== MYSQL SETTINGS (Alternative) ====================
    MYSQL_ENABLED: bool = os.getenv("MYSQL_ENABLED", "false").lower() == "true"
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_DB: str = os.getenv("MYSQL_DB", "anime_multiflix")
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_SSL: bool = os.getenv("MYSQL_SSL", "false").lower() == "true"
    
    # ==================== BACKUP SETTINGS ====================
    BACKUP_ENABLED: bool = os.getenv("BACKUP_ENABLED", "true").lower() == "true"
    BACKUP_SCHEDULE: str = os.getenv("BACKUP_SCHEDULE", "0 2 * * *")  # Daily at 2 AM
    BACKUP_RETENTION_DAYS: int = int(os.getenv("BACKUP_RETENTION_DAYS", 30))
    BACKUP_COMPRESS: bool = os.getenv("BACKUP_COMPRESS", "true").lower() == "true"
    BACKUP_ENCRYPT: bool = os.getenv("BACKUP_ENCRYPT", "false").lower() == "true"
    BACKUP_ENCRYPTION_KEY: Optional[str] = os.getenv("BACKUP_ENCRYPTION_KEY")
    
    # Backup Storage
    BACKUP_STORAGE_TYPE: str = os.getenv("BACKUP_STORAGE_TYPE", "local")  # local, s3, gcs, azure
    BACKUP_LOCAL_PATH: str = os.getenv("BACKUP_LOCAL_PATH", "./backups/database")
    BACKUP_S3_BUCKET: str = os.getenv("BACKUP_S3_BUCKET", "")
    BACKUP_S3_REGION: str = os.getenv("BACKUP_S3_REGION", "us-east-1")
    BACKUP_S3_PATH: str = os.getenv("BACKUP_S3_PATH", "backups/")
    BACKUP_GCS_BUCKET: str = os.getenv("BACKUP_GCS_BUCKET", "")
    BACKUP_GCS_PATH: str = os.getenv("BACKUP_GCS_PATH", "backups/")
    BACKUP_AZURE_CONTAINER: str = os.getenv("BACKUP_AZURE_CONTAINER", "")
    BACKUP_AZURE_PATH: str = os.getenv("BACKUP_AZURE_PATH", "backups/")
    
    # ==================== MIGRATION SETTINGS ====================
    MIGRATION_ENABLED: bool = True
    MIGRATION_AUTO_RUN: bool = os.getenv("NODE_ENV") == "development"
    MIGRATION_TABLE: str = "migrations"
    MIGRATION_DIR: str = "./database/migrations"
    MIGRATION_TEMPLATE: Dict[str, str] = {
        "up": "-- Migration up script",
        "down": "-- Migration down script"
    }
    
    # ==================== SEEDING SETTINGS ====================
    SEEDING_ENABLED: bool = os.getenv("NODE_ENV") == "development"
    SEEDING_DATA_PATH: str = "./database/seeds"
    SEEDING_DEFAULT_DATA: Dict[str, List] = {
        "genres": [
            "Action", "Adventure", "Comedy", "Drama", "Fantasy",
            "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
            "Sports", "Thriller", "Supernatural", "Mecha", "Psychological"
        ],
        "roles": ["user", "admin", "moderator", "owner"],
        "premium_plans": ["free", "basic", "pro", "ultimate", "family"]
    }
    
    # ==================== MONITORING SETTINGS ====================
    MONITORING_DB_QUERY_SLOW_THRESHOLD: int = int(os.getenv("MONITORING_DB_QUERY_SLOW_THRESHOLD", 100))  # milliseconds
    MONITORING_DB_POOL_USAGE: bool = True
    MONITORING_DB_CONNECTION_LEAK: bool = True
    MONITORING_DB_LOCK_WAIT: bool = True
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_mongodb_uri(cls) -> str:
        """Get MongoDB URI with authentication"""
        uri = cls.MONGODB_URI
        
        # Build URI with authentication
        if cls.MONGODB_USER and cls.MONGODB_PASSWORD:
            encoded_password = quote_plus(cls.MONGODB_PASSWORD)
            encoded_user = quote_plus(cls.MONGODB_USER)
            
            # Replace or inject credentials
            if "@" in uri:
                # Replace existing credentials
                parts = uri.split("@")
                auth_part = f"{encoded_user}:{encoded_password}"
                uri = f"{parts[0].split('//')[0]}//{auth_part}@{parts[1]}"
            else:
                # Add credentials
                parts = uri.split("//")
                uri = f"{parts[0]}//{encoded_user}:{encoded_password}@{parts[1]}"
        
        # Add replica set
        if cls.MONGODB_REPLICA_SET:
            uri += f"?replicaSet={cls.MONGODB_REPLICA_SET}"
        
        # Add SSL parameters
        if cls.MONGODB_SSL:
            separator = "?" if "?" not in uri else "&"
            uri += f"{separator}ssl=true"
            
            if cls.MONGODB_SSL_CA:
                uri += f"&ssl_ca_certs={cls.MONGODB_SSL_CA}"
        
        return uri
    
    @classmethod
    def get_mongodb_options(cls) -> Dict[str, Any]:
        """Get MongoDB connection options"""
        options = {
            "maxPoolSize": cls.MONGODB_MAX_POOL_SIZE,
            "minPoolSize": cls.MONGODB_MIN_POOL_SIZE,
            "maxIdleTimeMS": cls.MONGODB_MAX_IDLE_TIME_MS,
            "waitQueueTimeoutMS": cls.MONGODB_WAIT_QUEUE_TIMEOUT_MS,
            "connectTimeoutMS": cls.MONGODB_CONNECT_TIMEOUT_MS,
            "socketTimeoutMS": cls.MONGODB_SOCKET_TIMEOUT_MS,
            "serverSelectionTimeoutMS": cls.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
            "heartbeatFrequencyMS": cls.MONGODB_HEARTBEAT_FREQUENCY_MS,
            "retryWrites": cls.MONGODB_RETRY_WRITES,
            "retryReads": cls.MONGODB_RETRY_READS,
            "w": cls.MONGODB_W,
            "journal": cls.MONGODB_JOURNAL,
            "wtimeoutMS": cls.MONGODB_WTIMEOUT_MS,
            "readPreference": cls.MONGODB_READ_PREFERENCE
        }
        
        # Add auth mechanism
        if cls.MONGODB_AUTH_SOURCE:
            options["authSource"] = cls.MONGODB_AUTH_SOURCE
        if cls.MONGODB_AUTH_MECHANISM != "DEFAULT":
            options["authMechanism"] = cls.MONGODB_AUTH_MECHANISM
        
        return options
    
    @classmethod
    def get_redis_url(cls) -> Optional[str]:
        """Get Redis URL"""
        if not cls.REDIS_ENABLED:
            return None
        
        if cls.REDIS_PASSWORD:
            encoded_password = quote_plus(cls.REDIS_PASSWORD)
            return f"redis://:{encoded_password}@{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
        
        return f"redis://{cls.REDIS_HOST}:{cls.REDIS_PORT}/{cls.REDIS_DB}"
    
    @classmethod
    def get_redis_sentinel_url(cls) -> Optional[str]:
        """Get Redis Sentinel URL"""
        if not cls.REDIS_SENTINEL_ENABLED or not cls.REDIS_SENTINEL_HOSTS:
            return None
        
        hosts = ",".join(cls.REDIS_SENTINEL_HOSTS)
        if cls.REDIS_SENTINEL_PASSWORD:
            return f"redis+sentinel://:{cls.REDIS_SENTINEL_PASSWORD}@{hosts}/{cls.REDIS_SENTINEL_MASTER_NAME}"
        
        return f"redis+sentinel://{hosts}/{cls.REDIS_SENTINEL_MASTER_NAME}"
    
    @classmethod
    def get_postgres_url(cls) -> Optional[str]:
        """Get PostgreSQL URL"""
        if not cls.POSTGRES_ENABLED:
            return None
        
        encoded_password = quote_plus(cls.POSTGRES_PASSWORD) if cls.POSTGRES_PASSWORD else ""
        
        url = f"postgresql://{cls.POSTGRES_USER}:{encoded_password}@{cls.POSTGRES_HOST}:{cls.POSTGRES_PORT}/{cls.POSTGRES_DB}"
        
        if cls.POSTGRES_SSL:
            url += "?sslmode=require"
            if cls.POSTGRES_SSL_CA:
                url += f"&sslrootcert={cls.POSTGRES_SSL_CA}"
        
        return url
    
    @classmethod
    def get_postgres_pool_config(cls) -> Dict[str, Any]:
        """Get PostgreSQL pool configuration"""
        return {
            "pool_size": cls.POSTGRES_POOL_SIZE,
            "max_overflow": cls.POSTGRES_MAX_OVERFLOW,
            "pool_timeout": cls.POSTGRES_POOL_TIMEOUT,
            "pool_recycle": cls.POSTGRES_POOL_RECYCLE,
            "pool_pre_ping": cls.POSTGRES_POOL_PRE_PING,
            "echo": cls.POSTGRES_ECHO,
            "echo_pool": cls.POSTGRES_ECHO_POOL
        }
    
    @classmethod
    def get_mysql_url(cls) -> Optional[str]:
        """Get MySQL URL"""
        if not cls.MYSQL_ENABLED:
            return None
        
        encoded_password = quote_plus(cls.MYSQL_PASSWORD) if cls.MYSQL_PASSWORD else ""
        url = f"mysql://{cls.MYSQL_USER}:{encoded_password}@{cls.MYSQL_HOST}:{cls.MYSQL_PORT}/{cls.MYSQL_DB}"
        
        if cls.MYSQL_SSL:
            url += "?ssl=true"
        
        return url
    
    @classmethod
    def get_backup_storage_config(cls) -> Dict[str, Any]:
        """Get backup storage configuration"""
        config = {
            "type": cls.BACKUP_STORAGE_TYPE,
            "compress": cls.BACKUP_COMPRESS,
            "encrypt": cls.BACKUP_ENCRYPT,
            "retention_days": cls.BACKUP_RETENTION_DAYS
        }
        
        if cls.BACKUP_STORAGE_TYPE == "local":
            config["path"] = cls.BACKUP_LOCAL_PATH
        elif cls.BACKUP_STORAGE_TYPE == "s3":
            config["bucket"] = cls.BACKUP_S3_BUCKET
            config["region"] = cls.BACKUP_S3_REGION
            config["path"] = cls.BACKUP_S3_PATH
        elif cls.BACKUP_STORAGE_TYPE == "gcs":
            config["bucket"] = cls.BACKUP_GCS_BUCKET
            config["path"] = cls.BACKUP_GCS_PATH
        elif cls.BACKUP_STORAGE_TYPE == "azure":
            config["container"] = cls.BACKUP_AZURE_CONTAINER
            config["path"] = cls.BACKUP_AZURE_PATH
        
        return config
    
    @classmethod
    def is_mongodb_available(cls) -> bool:
        """Check if MongoDB is available"""
        return cls.MONGODB_ENABLED and bool(cls.MONGODB_URI)
    
    @classmethod
    def is_redis_available(cls) -> bool:
        """Check if Redis is available"""
        return cls.REDIS_ENABLED and bool(cls.REDIS_HOST)
    
    @classmethod
    def is_postgres_available(cls) -> bool:
        """Check if PostgreSQL is available"""
        return cls.POSTGRES_ENABLED and bool(cls.POSTGRES_HOST)
    
    @classmethod
    def get_collection_name(cls, collection_key: str) -> str:
        """Get collection name by key"""
        return cls.MONGODB_COLLECTIONS.get(collection_key, collection_key)
    
    @classmethod
    def get_cache_ttl(cls, cache_key: str) -> int:
        """Get cache TTL by key"""
        return cls.REDIS_CACHE_TTL.get(cache_key, cls.REDIS_TTL)


# Create database config instance
db_config = DatabaseConfig()

# Print database configuration status
if db_config.is_mongodb_available():
    print(f"🗄️ MongoDB: {db_config.MONGODB_HOST}:{db_config.MONGODB_PORT}")
if db_config.is_redis_available():
    print(f"⚡ Redis: {db_config.REDIS_HOST}:{db_config.REDIS_PORT}")
if db_config.is_postgres_available():
    print(f"🐘 PostgreSQL: {db_config.POSTGRES_HOST}:{db_config.POSTGRES_PORT}")
