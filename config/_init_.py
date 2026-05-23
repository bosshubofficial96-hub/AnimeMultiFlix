"""
AnimeMultiFlix - Configuration Package
Version: 4.0.0 (2026)
"""

import os
from dotenv import load_dotenv

load_dotenv()

from .config import Config
from .database import DatabaseConfig
from .auth import AuthConfig
from .admin import AdminConfig
from .owner import OwnerConfig
from .premium import PremiumConfig
from .group import GroupConfig
from .chat import ChatConfig
from .voice import VoiceConfig
from .payment import PaymentConfig
from .streaming import StreamingConfig
from .security import SecurityConfig
from .constants import Constants

ENV = os.getenv('NODE_ENV', 'development')

if ENV == 'production':
    from .production import ProductionConfig as EnvConfig
elif ENV == 'staging':
    from .staging import StagingConfig as EnvConfig
elif ENV == 'testing':
    from .testing import TestingConfig as EnvConfig
else:
    from .development import DevelopmentConfig as EnvConfig


class AppConfig(EnvConfig):
    pass


config = AppConfig()

__all__ = [
    'config', 'Config', 'DatabaseConfig', 'AuthConfig', 'AdminConfig',
    'OwnerConfig', 'PremiumConfig', 'GroupConfig', 'ChatConfig',
    'VoiceConfig', 'PaymentConfig', 'StreamingConfig', 'SecurityConfig',
    'Constants', 'ENV'
]

print(f"\n✅ Configuration loaded: {ENV}")
