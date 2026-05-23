"""
AnimeMultiFlix - Streaming Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class StreamingConfig:
    """Streaming Configuration Class"""
    
    # ==================== VIDEO SETTINGS ====================
    VIDEO_QUALITIES: List[str] = [
        "144p", "240p", "360p", "480p", 
        "720p", "1080p", "1440p", "2160p", "4320p"
    ]
    
    VIDEO_QUALITY_SETTINGS: Dict[str, Dict] = {
        "144p": {"width": 256, "height": 144, "bitrate": 100000, "codec": "h264"},
        "240p": {"width": 426, "height": 240, "bitrate": 300000, "codec": "h264"},
        "360p": {"width": 640, "height": 360, "bitrate": 500000, "codec": "h264"},
        "480p": {"width": 854, "height": 480, "bitrate": 1000000, "codec": "h264"},
        "720p": {"width": 1280, "height": 720, "bitrate": 2500000, "codec": "h264"},
        "1080p": {"width": 1920, "height": 1080, "bitrate": 5000000, "codec": "h264"},
        "1440p": {"width": 2560, "height": 1440, "bitrate": 8000000, "codec": "h265"},
        "2160p": {"width": 3840, "height": 2160, "bitrate": 15000000, "codec": "h265"},
        "4320p": {"width": 7680, "height": 4320, "bitrate": 50000000, "codec": "h265"}
    }
    
    DEFAULT_QUALITY: str = os.getenv("DEFAULT_VIDEO_QUALITY", "720p")
    DEFAULT_QUALITY_PREMIUM: str = "1080p"
    DEFAULT_QUALITY_ULTIMATE: str = "2160p"
    
    ADAPTIVE_BITRATE: bool = os.getenv("ADAPTIVE_BITRATE", "true").lower() == "true"
    ADAPTIVE_BITRATE_INTERVAL: int = int(os.getenv("ADAPTIVE_BITRATE_INTERVAL", 5000))  # milliseconds
    
    # ==================== HLS (HTTP Live Streaming) ====================
    HLS_ENABLED: bool = os.getenv("HLS_ENABLED", "true").lower() == "true"
    HLS_SEGMENT_DURATION: int = int(os.getenv("HLS_SEGMENT_DURATION", 6))  # seconds
    HLS_SEGMENT_COUNT: int = int(os.getenv("HLS_SEGMENT_COUNT", 10))
    HLS_PLAYLIST_TYPE: str = os.getenv("HLS_PLAYLIST_TYPE", "event")  # event, vod, live
    HLS_ALLOW_CACHE: bool = os.getenv("HLS_ALLOW_CACHE", "true").lower() == "true"
    HLS_DISCONTINUITY: bool = os.getenv("HLS_DISCONTINUITY", "true").lower() == "true"
    HLS_KEY_URL: Optional[str] = os.getenv("HLS_KEY_URL")
    HLS_IV: Optional[str] = os.getenv("HLS_IV")
    
    # Low-Latency HLS (LL-HLS)
    LL_HLS_ENABLED: bool = os.getenv("LL_HLS_ENABLED", "false").lower() == "true"
    LL_HLS_PART_TARGET_DURATION: int = int(os.getenv("LL_HLS_PART_DURATION", 1))  # seconds
    LL_HLS_PART_COUNT: int = int(os.getenv("LL_HLS_PART_COUNT", 3))
    
    # ==================== DASH (Dynamic Adaptive Streaming) ====================
    DASH_ENABLED: bool = os.getenv("DASH_ENABLED", "true").lower() == "true"
    DASH_SEGMENT_DURATION: int = int(os.getenv("DASH_SEGMENT_DURATION", 4))  # seconds
    DASH_SEGMENT_COUNT: int = int(os.getenv("DASH_SEGMENT_COUNT", 10))
    DASH_AVAILABILITY_TIME: int = int(os.getenv("DASH_AVAILABILITY_TIME", 3600))  # seconds
    DASH_MINIMUM_UPDATE_PERIOD: int = int(os.getenv("DASH_MIN_UPDATE_PERIOD", 10))  # seconds
    DASH_TIME_SHIFT_BUFFER_DEPTH: int = int(os.getenv("DASH_TIME_SHIFT_BUFFER", 300))  # seconds
    
    # ==================== CMAF (Common Media Application Format) ====================
    CMAF_ENABLED: bool = os.getenv("CMAF_ENABLED", "true").lower() == "true"
    CMAF_FRAGMENT_DURATION: int = int(os.getenv("CMAF_FRAGMENT_DURATION", 2))  # seconds
    
    # ==================== TRANSCODING ====================
    TRANSCODING_ENABLED: bool = os.getenv("TRANSCODING_ENABLED", "true").lower() == "true"
    TRANSCODING_QUEUE_SIZE: int = int(os.getenv("TRANSCODING_QUEUE_SIZE", 100))
    TRANSCODING_CONCURRENT_JOBS: int = int(os.getenv("TRANSCODING_CONCURRENT_JOBS", 5))
    TRANSCODING_INPUT_FORMATS: List[str] = ["mp4", "mkv", "avi", "mov", "webm", "flv", "ts", "m3u8"]
    TRANSCODING_OUTPUT_FORMATS: List[str] = ["mp4", "ts", "m3u8"]
    
    # Transcoding Presets
    TRANSCODING_PRESETS: Dict[str, Dict] = {
        "fast": {"preset": "fast", "crf": 23, "profile": "main"},
        "medium": {"preset": "medium", "crf": 22, "profile": "main"},
        "slow": {"preset": "slow", "crf": 21, "profile": "high"},
        "veryslow": {"preset": "veryslow", "crf": 20, "profile": "high"}
    }
    TRANSCODING_DEFAULT_PRESET: str = os.getenv("TRANSCODING_PRESET", "medium")
    
    # Codec Settings
    TRANSCODING_VIDEO_CODEC: str = os.getenv("VIDEO_CODEC", "libx264")
    TRANSCODING_AUDIO_CODEC: str = os.getenv("AUDIO_CODEC", "aac")
    TRANSCODING_AUDIO_BITRATE: int = int(os.getenv("AUDIO_BITRATE", 128000))
    TRANSCODING_AUDIO_CHANNELS: int = int(os.getenv("AUDIO_CHANNELS", 2))
    TRANSCODING_AUDIO_SAMPLE_RATE: int = int(os.getenv("AUDIO_SAMPLE_RATE", 48000))
    
    # ==================== CDN SETTINGS ====================
    CDN_ENABLED: bool = os.getenv("CDN_ENABLED", "false").lower() == "true"
    CDN_URL: str = os.getenv("CDN_URL", "")
    CDN_PROVIDER: str = os.getenv("CDN_PROVIDER", "cloudflare")  # cloudflare, cloudfront, fastly, bunny
    CDN_API_KEY: Optional[str] = os.getenv("CDN_API_KEY")
    CDN_ZONE_ID: Optional[str] = os.getenv("CDN_ZONE_ID")
    CDN_PURGE_ON_DEPLOY: bool = os.getenv("CDN_PURGE_ON_DEPLOY", "true").lower() == "true"
    CDN_PURGE_ON_UPDATE: bool = os.getenv("CDN_PURGE_ON_UPDATE", "true").lower() == "true"
    
    # CDN Regions
    CDN_REGIONS: List[str] = [
        "us-east", "us-west", "eu-west", "eu-central", 
        "asia-east", "asia-south", "asia-northeast", "sa-east", "af-south"
    ]
    
    # ==================== STORAGE SETTINGS ====================
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")  # local, s3, gcs, r2
    STORAGE_PATH: str = os.getenv("STORAGE_PATH", "./uploads/videos")
    
    # S3 Storage
    S3_ENABLED: bool = os.getenv("S3_ENABLED", "false").lower() == "true"
    S3_BUCKET: str = os.getenv("S3_BUCKET", "")
    S3_REGION: str = os.getenv("S3_REGION", "us-east-1")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "")
    S3_ENDPOINT: Optional[str] = os.getenv("S3_ENDPOINT")
    S3_CDN_URL: Optional[str] = os.getenv("S3_CDN_URL")
    
    # R2 Storage (Cloudflare)
    R2_ENABLED: bool = os.getenv("R2_ENABLED", "false").lower() == "true"
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_BUCKET: str = os.getenv("R2_BUCKET", "")
    R2_ACCESS_KEY: str = os.getenv("R2_ACCESS_KEY", "")
    R2_SECRET_KEY: str = os.getenv("R2_SECRET_KEY", "")
    
    # GCS Storage
    GCS_ENABLED: bool = os.getenv("GCS_ENABLED", "false").lower() == "true"
    GCS_BUCKET: str = os.getenv("GCS_BUCKET", "")
    GCS_PROJECT_ID: str = os.getenv("GCS_PROJECT_ID", "")
    GCS_KEY_FILE: Optional[str] = os.getenv("GCS_KEY_FILE")
    
    # ==================== SUBTITLE SETTINGS ====================
    SUBTITLE_SUPPORTED_FORMATS: List[str] = ["srt", "vtt", "ass", "ssa", "sbv"]
    SUBTITLE_MAX_SIZE: int = int(os.getenv("SUBTITLE_MAX_SIZE", 10 * 1024 * 1024))  # 10MB
    SUBTITLE_LANGUAGES: List[str] = [
        "en", "ja", "es", "fr", "de", "zh", "ko", "ar",
        "hi", "pt", "ru", "it", "tr", "vi", "th", "id", "nl", "pl", "sv", "no", "da", "fi"
    ]
    SUBTITLE_DEFAULT_LANGUAGE: str = os.getenv("SUBTITLE_DEFAULT_LANGUAGE", "en")
    SUBTITLE_AUTO_GENERATE: bool = os.getenv("SUBTITLE_AUTO_GENERATE", "false").lower() == "true"
    SUBTITLE_AUTO_TRANSLATE: bool = os.getenv("SUBTITLE_AUTO_TRANSLATE", "false").lower() == "true"
    
    # ==================== THUMBNAIL SETTINGS ====================
    THUMBNAIL_ENABLED: bool = True
    THUMBNAIL_GENERATE_AT_SECONDS: List[int] = [30, 60, 90, 120, 150, 180]
    THUMBNAIL_COUNT: int = int(os.getenv("THUMBNAIL_COUNT", 10))
    THUMBNAIL_WIDTH: int = int(os.getenv("THUMBNAIL_WIDTH", 300))
    THUMBNAIL_HEIGHT: int = int(os.getenv("THUMBNAIL_HEIGHT", 450))
    THUMBNAIL_QUALITY: int = int(os.getenv("THUMBNAIL_QUALITY", 85))
    THUMBNAIL_FORMAT: str = os.getenv("THUMBNAIL_FORMAT", "jpg")
    
    # Sprite Thumbnails (Preview when seeking)
    SPRITE_THUMBNAIL_ENABLED: bool = True
    SPRITE_THUMBNAIL_ROWS: int = 10
    SPRITE_THUMBNAIL_COLS: int = 10
    SPRITE_THUMBNAIL_WIDTH: int = 160
    SPRITE_THUMBNAIL_HEIGHT: int = 90
    
    # ==================== DRM (Digital Rights Management) ====================
    DRM_ENABLED: bool = os.getenv("DRM_ENABLED", "false").lower() == "true"
    DRM_PROVIDER: str = os.getenv("DRM_PROVIDER", "widevine")  # widevine, playready, fairplay
    
    # Widevine DRM
    WIDEVINE_ENABLED: bool = False
    WIDEVINE_PSSH: Optional[str] = os.getenv("WIDEVINE_PSSH")
    WIDEVINE_LICENSE_URL: Optional[str] = os.getenv("WIDEVINE_LICENSE_URL")
    
    # PlayReady DRM
    PLAYREADY_ENABLED: bool = False
    PLAYREADY_LICENSE_URL: Optional[str] = os.getenv("PLAYREADY_LICENSE_URL")
    
    # FairPlay DRM
    FAIRPLAY_ENABLED: bool = False
    FAIRPLAY_CERTIFICATE: Optional[str] = os.getenv("FAIRPLAY_CERTIFICATE")
    FAIRPLAY_LICENSE_URL: Optional[str] = os.getenv("FAIRPLAY_LICENSE_URL")
    
    # ==================== WATERMARK ====================
    WATERMARK_ENABLED: bool = os.getenv("WATERMARK_ENABLED", "false").lower() == "true"
    WATERMARK_IMAGE: str = "/assets/images/watermark.png"
    WATERMARK_POSITION: str = os.getenv("WATERMARK_POSITION", "bottom-right")  # top-left, top-right, bottom-left, bottom-right, center
    WATERMARK_OPACITY: float = float(os.getenv("WATERMARK_OPACITY", 0.7))
    WATERMARK_SIZE: int = int(os.getenv("WATERMARK_SIZE", 150))
    
    # ==================== PREVIEW / TRAILER ====================
    PREVIEW_DURATION: int = int(os.getenv("PREVIEW_DURATION", 30))  # seconds
    TRAILER_QUALITY: str = os.getenv("TRAILER_QUALITY", "720p")
    TRAILER_AUTOPLAY: bool = os.getenv("TRAILER_AUTOPLAY", "true").lower() == "true"
    TRAILER_MUTE: bool = os.getenv("TRAILER_MUTE", "true").lower() == "true"
    
    # ==================== PLAYER SETTINGS ====================
    PLAYER_THEMES: List[str] = ["dark", "light", "auto"]
    PLAYER_DEFAULT_THEME: str = os.getenv("PLAYER_DEFAULT_THEME", "dark")
    PLAYER_AUTOPLAY: bool = os.getenv("PLAYER_AUTOPLAY", "false").lower() == "true"
    PLAYER_AUTOPLAY_NEXT: bool = os.getenv("PLAYER_AUTOPLAY_NEXT", "true").lower() == "true"
    PLAYER_CONTROLS: bool = True
    PLAYER_KEYBOARD_SHORTCUTS: bool = True
    PLAYER_MOUSE_GESTURES: bool = True
    PLAYER_TOUCH_GESTURES: bool = True
    PLAYER_VOLUME_STEP: float = 0.05
    PLAYER_SEEK_STEP: int = 10  # seconds
    PLAYER_SPEEDS: List[float] = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
    PLAYER_DEFAULT_SPEED: float = 1.0
    
    # ==================== ANALYTICS ====================
    ANALYTICS_ENABLED: bool = os.getenv("ANALYTICS_ENABLED", "true").lower() == "true"
    ANALYTICS_TRACK_VIEWS: bool = True
    ANALYTICS_TRACK_WATCH_TIME: bool = True
    ANALYTICS_TRACK_BUFFERING: bool = True
    ANALYTICS_TRACK_QUALITY_CHANGES: bool = True
    ANALYTICS_TRACK_ERRORS: bool = True
    
    # ==================== CDN SETTINGS ====================
    CDN_SETTINGS: Dict[str, Any] = {
        "cloudflare": {
            "api_url": "https://api.cloudflare.com/client/v4",
            "purge_endpoint": "/zones/{zone_id}/purge_cache"
        },
        "cloudfront": {
            "api_url": "https://cloudfront.amazonaws.com",
            "invalidation_endpoint": "/2020-05-31/distribution/{distribution_id}/invalidation"
        },
        "fastly": {
            "api_url": "https://api.fastly.com",
            "purge_endpoint": "/service/{service_id}/purge_all"
        },
        "bunny": {
            "api_url": "https://api.bunny.net",
            "purge_endpoint": "/pullzone/{pullzone_id}/purgeCache"
        }
    }
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_video_quality_settings(cls, quality: str) -> Dict:
        """Get video quality settings"""
        return cls.VIDEO_QUALITY_SETTINGS.get(quality, cls.VIDEO_QUALITY_SETTINGS[cls.DEFAULT_QUALITY])
    
    @classmethod
    def get_quality_for_user(cls, is_premium: bool = False, is_ultimate: bool = False) -> str:
        """Get appropriate quality based on user tier"""
        if is_ultimate:
            return cls.DEFAULT_QUALITY_ULTIMATE
        elif is_premium:
            return cls.DEFAULT_QUALITY_PREMIUM
        return cls.DEFAULT_QUALITY
    
    @classmethod
    def is_quality_available(cls, quality: str, is_premium: bool = False, is_ultimate: bool = False) -> bool:
        """Check if quality is available for user tier"""
        if quality in ["2160p", "4320p"]:
            return is_ultimate
        elif quality in ["1080p", "1440p"]:
            return is_premium or is_ultimate
        return True
    
    @classmethod
    def get_hls_playlist_url(cls, video_id: str, quality: str = None) -> str:
        """Generate HLS playlist URL"""
        if quality:
            return f"/api/stream/hls/{video_id}/{quality}/playlist.m3u8"
        return f"/api/stream/hls/{video_id}/playlist.m3u8"
    
    @classmethod
    def get_dash_manifest_url(cls, video_id: str) -> str:
        """Generate DASH manifest URL"""
        return f"/api/stream/dash/{video_id}/manifest.mpd"
    
    @classmethod
    def get_thumbnail_url(cls, video_id: str, timestamp: int = None) -> str:
        """Generate thumbnail URL"""
        if timestamp:
            return f"/api/stream/thumbnail/{video_id}?time={timestamp}"
        return f"/api/stream/thumbnail/{video_id}"
    
    @classmethod
    def get_subtitle_url(cls, video_id: str, language: str) -> str:
        """Generate subtitle URL"""
        return f"/api/stream/subtitle/{video_id}/{language}.vtt"
    
    @classmethod
    def get_transcoding_preset(cls, preset_name: str = None) -> Dict:
        """Get transcoding preset"""
        preset = preset_name or cls.TRANSCODING_DEFAULT_PRESET
        return cls.TRANSCODING_PRESETS.get(preset, cls.TRANSCODING_PRESETS["medium"])
    
    @classmethod
    def is_cdn_enabled(cls) -> bool:
        """Check if CDN is enabled"""
        return cls.CDN_ENABLED and bool(cls.CDN_URL)
    
    @classmethod
    def get_cdn_url(cls, path: str) -> str:
        """Get CDN URL for a path"""
        if cls.is_cdn_enabled():
            return f"{cls.CDN_URL}/{path}"
        return path
    
    @classmethod
    def get_cdn_provider_config(cls, provider: str = None) -> Dict:
        """Get CDN provider configuration"""
        provider = provider or cls.CDN_PROVIDER
        return cls.CDN_SETTINGS.get(provider, {})
    
    @classmethod
    def get_storage_config(cls) -> Dict[str, Any]:
        """Get storage configuration"""
        config = {
            "type": cls.STORAGE_TYPE,
            "path": cls.STORAGE_PATH
        }
        
        if cls.STORAGE_TYPE == "s3":
            config["bucket"] = cls.S3_BUCKET
            config["region"] = cls.S3_REGION
            config["access_key"] = cls.S3_ACCESS_KEY
            config["secret_key"] = cls.S3_SECRET_KEY
            config["endpoint"] = cls.S3_ENDPOINT
        elif cls.STORAGE_TYPE == "r2":
            config["account_id"] = cls.R2_ACCOUNT_ID
            config["bucket"] = cls.R2_BUCKET
            config["access_key"] = cls.R2_ACCESS_KEY
            config["secret_key"] = cls.R2_SECRET_KEY
        elif cls.STORAGE_TYPE == "gcs":
            config["bucket"] = cls.GCS_BUCKET
            config["project_id"] = cls.GCS_PROJECT_ID
        
        return config
    
    @classmethod
    def is_drm_enabled(cls) -> bool:
        """Check if DRM is enabled"""
        return cls.DRM_ENABLED
    
    @classmethod
    def get_available_formats(cls, is_premium: bool = False, is_ultimate: bool = False) -> List[str]:
        """Get available streaming formats"""
        formats = []
        if cls.HLS_ENABLED:
            formats.append("hls")
        if cls.DASH_ENABLED:
            formats.append("dash")
        return formats
    
    @classmethod
    def get_supported_subtitle_languages(cls) -> List[str]:
        """Get supported subtitle languages"""
        return cls.SUBTITLE_LANGUAGES
    
    @classmethod
    def get_player_config(cls) -> Dict[str, Any]:
        """Get player configuration"""
        return {
            "themes": cls.PLAYER_THEMES,
            "default_theme": cls.PLAYER_DEFAULT_THEME,
            "autoplay": cls.PLAYER_AUTOPLAY,
            "autoplay_next": cls.PLAYER_AUTOPLAY_NEXT,
            "controls": cls.PLAYER_CONTROLS,
            "keyboard_shortcuts": cls.PLAYER_KEYBOARD_SHORTCUTS,
            "mouse_gestures": cls.PLAYER_MOUSE_GESTURES,
            "touch_gestures": cls.PLAYER_TOUCH_GESTURES,
            "volume_step": cls.PLAYER_VOLUME_STEP,
            "seek_step": cls.PLAYER_SEEK_STEP,
            "speeds": cls.PLAYER_SPEEDS,
            "default_speed": cls.PLAYER_DEFAULT_SPEED
        }


# Create streaming config instance
streaming_config = StreamingConfig()

# Print streaming configuration status
print(f"🎬 Streaming Configuration")
print(f"   Video Qualities: {len(streaming_config.VIDEO_QUALITIES)}")
print(f"   HLS: {'Enabled' if streaming_config.HLS_ENABLED else 'Disabled'}")
print(f"   DASH: {'Enabled' if streaming_config.DASH_ENABLED else 'Disabled'}")
print(f"   Transcoding: {'Enabled' if streaming_config.TRANSCODING_ENABLED else 'Disabled'}")
print(f"   CDN: {'Enabled' if streaming_config.is_cdn_enabled() else 'Disabled'}")
print(f"   Subtitle Languages: {len(streaming_config.get_supported_subtitle_languages())}")
