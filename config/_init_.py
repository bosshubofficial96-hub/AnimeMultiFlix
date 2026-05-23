"""
AnimeMultiFlix - Configuration Package
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .config import Config
from .database import DatabaseConfig
from .auth import AuthConfig
from .group import GroupConfig
from .chat import ChatConfig
from .voice import VoiceConfig
from .payment import PaymentConfig
from .premium import PremiumConfig
from .streaming import StreamingConfig
from .admin import AdminConfig
from .api import APIConfig
from .security import SecurityConfig
from .constants import Constants
from .settings import get_settings

# Environment detection
ENV = os.getenv('NODE_ENV', 'development')

# Load environment specific config
if ENV == 'production':
    from .production import ProductionConfig as EnvConfig
elif ENV == 'staging':
    from .staging import StagingConfig as EnvConfig
elif ENV == 'testing':
    from .testing import TestingConfig as EnvConfig
else:
    from .development import DevelopmentConfig as EnvConfig


class AppConfig(EnvConfig):
    """Main Application Configuration"""
    pass


config = AppConfig()

__all__ = [
    'config',
    'Config',
    'DatabaseConfig',
    'AuthConfig',
    'GroupConfig',
    'ChatConfig',
    'VoiceConfig',
    'PaymentConfig',
    'PremiumConfig',
    'StreamingConfig',
    'AdminConfig',
    'APIConfig',
    'SecurityConfig',
    'Constants',
    'get_settings',
    'ENV'
]

print(f"\n✅ Configuration loaded for environment: {ENV}")
print(f"   Server: http://{config.HOST}:{config.PORT}")
print(f"   API: {config.API_URL}\n")
