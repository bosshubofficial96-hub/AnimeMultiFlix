"""
AnimeMultiFlix - Voice Chat Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class VoiceConfig:
    """Voice Chat Configuration Class"""
    
    # ==================== WEBRTC SETTINGS ====================
    WEBRTC_ICE_SERVERS: List[Dict[str, Any]] = [
        {
            "urls": [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302"
            ]
        },
        {
            "urls": [
                "stun:stun.ekiga.net",
                "stun:stun.ideasip.com",
                "stun:stun.iptel.org",
                "stun:stun.rixtelecom.se",
                "stun:stun.schlund.de"
            ]
        },
        {
            "urls": "turn:openrelay.metered.ca:80",
            "username": "openrelayproject",
            "credential": "openrelayproject"
        },
        {
            "urls": "turn:openrelay.metered.ca:443",
            "username": "openrelayproject",
            "credential": "openrelayproject"
        },
        {
            "urls": "turn:openrelay.metered.ca:443?transport=tcp",
            "username": "openrelayproject",
            "credential": "openrelayproject"
        }
    ]
    
    WEBRTC_ICE_CANDIDATE_POOL_SIZE: int = int(os.getenv("WEBRTC_ICE_POOL_SIZE", 10))
    WEBRTC_BUNDLE_POLICY: str = os.getenv("WEBRTC_BUNDLE_POLICY", "max-bundle")
    WEBRTC_RTCP_MUX_POLICY: str = os.getenv("WEBRTC_RTCP_MUX_POLICY", "require")
    WEBRTC_SDP_SEMANTICS: str = os.getenv("WEBRTC_SDP_SEMANTICS", "unified-plan")
    WEBRTC_ICE_TRANSPORT_POLICY: str = os.getenv("WEBRTC_ICE_TRANSPORT_POLICY", "all")
    WEBRTC_DTLS_SRTP_KEY_AGREEMENT: str = os.getenv("DTLS_SRTP_KEY_AGREEMENT", "true")
    
    # ==================== ROOM SETTINGS ====================
    ROOM_MAX_PARTICIPANTS: int = int(os.getenv("VOICE_ROOM_MAX_PARTICIPANTS", 50))
    ROOM_MAX_DURATION: int = int(os.getenv("VOICE_ROOM_MAX_DURATION", 3600))  # seconds
    ROOM_AUTO_DELETE_EMPTY: bool = os.getenv("VOICE_ROOM_AUTO_DELETE", "true").lower() == "true"
    ROOM_AUTO_DELETE_AFTER: int = int(os.getenv("VOICE_ROOM_AUTO_DELETE_AFTER", 300))  # 5 minutes
    ROOM_RECORDING_ENABLED: bool = os.getenv("VOICE_ROOM_RECORDING", "false").lower() == "true"
    ROOM_RECORDING_STORAGE_PATH: str = os.getenv("VOICE_RECORDING_PATH", "./uploads/voice/recordings")
    ROOM_ID_LENGTH: int = int(os.getenv("VOICE_ROOM_ID_LENGTH", 8))
    ROOM_PASSWORD_ENABLED: bool = os.getenv("VOICE_ROOM_PASSWORD", "true").lower() == "true"
    
    # ==================== ROOM TYPES ====================
    ROOM_TYPES: Dict[str, Dict] = {
        "public": {
            "name": "Public Room",
            "description": "Anyone can join",
            "icon": "fa-globe",
            "discoverable": True,
            "password_required": False
        },
        "private": {
            "name": "Private Room",
            "description": "Invite only",
            "icon": "fa-lock",
            "discoverable": False,
            "password_required": True
        },
        "group": {
            "name": "Group Room",
            "description": "Linked to a group",
            "icon": "fa-users",
            "discoverable": False,
            "password_required": False
        },
        "temporary": {
            "name": "Temporary Room",
            "description": "Auto-deletes when empty",
            "icon": "fa-hourglass",
            "discoverable": True,
            "password_required": False,
            "auto_delete": True
        }
    }
    
    # ==================== AUDIO SETTINGS ====================
    AUDIO_SAMPLE_RATE: int = int(os.getenv("VOICE_AUDIO_SAMPLE_RATE", 48000))
    AUDIO_CHANNELS: int = int(os.getenv("VOICE_AUDIO_CHANNELS", 1))
    AUDIO_ECHO_CANCELLATION: bool = os.getenv("VOICE_ECHO_CANCELLATION", "true").lower() == "true"
    AUDIO_NOISE_SUPPRESSION: bool = os.getenv("VOICE_NOISE_SUPPRESSION", "true").lower() == "true"
    AUDIO_AUTO_GAIN_CONTROL: bool = os.getenv("VOICE_AUTO_GAIN_CONTROL", "true").lower() == "true"
    AUDIO_VOLUME: float = float(os.getenv("VOICE_DEFAULT_VOLUME", 1.0))
    
    # Audio Qualities
    AUDIO_QUALITIES: Dict[str, Dict] = {
        "low": {
            "bitrate": 32000,
            "sample_rate": 16000,
            "channels": 1,
            "codec": "opus"
        },
        "medium": {
            "bitrate": 64000,
            "sample_rate": 24000,
            "channels": 1,
            "codec": "opus"
        },
        "high": {
            "bitrate": 128000,
            "sample_rate": 48000,
            "channels": 2,
            "codec": "opus"
        },
        "ultra": {
            "bitrate": 256000,
            "sample_rate": 48000,
            "channels": 2,
            "codec": "opus"
        }
    }
    AUDIO_DEFAULT_QUALITY: str = os.getenv("VOICE_DEFAULT_QUALITY", "high")
    
    # ==================== CODEC SETTINGS ====================
    AUDIO_CODECS: List[str] = ["opus", "pcmu", "pcma", "g722", "telephone-event"]
    VIDEO_CODECS: List[str] = ["VP8", "VP9", "H264", "H265", "AV1"]
    PREFERRED_AUDIO_CODEC: str = os.getenv("PREFERRED_AUDIO_CODEC", "opus")
    PREFERRED_VIDEO_CODEC: str = os.getenv("PREFERRED_VIDEO_CODEC", "VP9")
    
    # ==================== VIDEO SETTINGS ====================
    VIDEO_ENABLED: bool = os.getenv("VOICE_VIDEO_ENABLED", "true").lower() == "true"
    VIDEO_MAX_PARTICIPANTS: int = int(os.getenv("VOICE_VIDEO_MAX_PARTICIPANTS", 10))
    VIDEO_QUALITIES: Dict[str, Dict] = {
        "360p": {"width": 640, "height": 360, "bitrate": 500000},
        "480p": {"width": 854, "height": 480, "bitrate": 1000000},
        "720p": {"width": 1280, "height": 720, "bitrate": 2500000},
        "1080p": {"width": 1920, "height": 1080, "bitrate": 5000000}
    }
    VIDEO_DEFAULT_QUALITY: str = os.getenv("VOICE_VIDEO_DEFAULT_QUALITY", "720p")
    VIDEO_FPS: int = int(os.getenv("VOICE_VIDEO_FPS", 30))
    
    # ==================== SCREEN SHARE SETTINGS ====================
    SCREEN_SHARE_ENABLED: bool = os.getenv("VOICE_SCREEN_SHARE_ENABLED", "true").lower() == "true"
    SCREEN_SHARE_QUALITIES: Dict[str, Dict] = {
        "720p": {"width": 1280, "height": 720, "bitrate": 2000000},
        "1080p": {"width": 1920, "height": 1080, "bitrate": 4000000},
        "1440p": {"width": 2560, "height": 1440, "bitrate": 8000000}
    }
    SCREEN_SHARE_DEFAULT_QUALITY: str = os.getenv("SCREEN_SHARE_DEFAULT_QUALITY", "1080p")
    SCREEN_SHARE_FPS: int = int(os.getenv("SCREEN_SHARE_FPS", 15))
    
    # ==================== RECORDING SETTINGS ====================
    RECORDING_ENABLED: bool = os.getenv("VOICE_RECORDING_ENABLED", "false").lower() == "true"
    RECORDING_MAX_DURATION: int = int(os.getenv("VOICE_RECORDING_MAX_DURATION", 3600))  # 1 hour
    RECORDING_MAX_SIZE: int = int(os.getenv("VOICE_RECORDING_MAX_SIZE", 500 * 1024 * 1024))  # 500MB
    RECORDING_FORMATS: List[str] = ["mp4", "webm", "ogg"]
    RECORDING_DEFAULT_FORMAT: str = os.getenv("VOICE_RECORDING_FORMAT", "mp4")
    RECORDING_AUTO_DELETE_DAYS: int = int(os.getenv("VOICE_RECORDING_AUTO_DELETE", 30))
    
    # ==================== MODERATION SETTINGS ====================
    MODERATION_ENABLED: bool = os.getenv("VOICE_MODERATION_ENABLED", "true").lower() == "true"
    MODERATION_AUTO_MUTE_THRESHOLD: float = float(os.getenv("VOICE_AUTO_MUTE_THRESHOLD", 0.9))  # 90% volume
    MODERATION_AUTO_MUTE_DURATION: int = int(os.getenv("VOICE_AUTO_MUTE_DURATION", 60))  # seconds
    MODERATION_MAX_REPORTS_BEFORE_KICK: int = int(os.getenv("VOICE_MAX_REPORTS_BEFORE_KICK", 5))
    MODERATION_PROFANITY_FILTER: bool = os.getenv("VOICE_PROFANITY_FILTER", "true").lower() == "true"
    MODERATION_PROFANITY_LIST: List[str] = [
        "profanity1", "profanity2"  # Add actual words
    ]
    
    # ==================== BANDWIDTH SETTINGS ====================
    BANDWIDTH_ESTIMATION_INTERVAL: int = int(os.getenv("BANDWIDTH_ESTIMATION_INTERVAL", 5000))  # milliseconds
    BANDWIDTH_ADAPTIVE_BITRATE: bool = os.getenv("ADAPTIVE_BITRATE", "true").lower() == "true"
    BANDWIDTH_MIN_BITRATE: int = int(os.getenv("MIN_BITRATE", 16000))
    BANDWIDTH_MAX_BITRATE: int = int(os.getenv("MAX_BITRATE", 512000))
    BANDWIDTH_START_BITRATE: int = int(os.getenv("START_BITRATE", 128000))
    
    # ==================== LATENCY SETTINGS ====================
    LATENCY_TARGET: int = int(os.getenv("VOICE_LATENCY_TARGET", 100))  # milliseconds
    LATENCY_JITTER_BUFFER: int = int(os.getenv("JITTER_BUFFER", 50))  # milliseconds
    LATENCY_PACKET_LOSS_TOLERANCE: float = float(os.getenv("PACKET_LOSS_TOLERANCE", 0.2))  # 20%
    
    # ==================== STREAMING TOGETHER SETTINGS ====================
    STREAMING_TOGETHER_ENABLED: bool = os.getenv("STREAMING_TOGETHER_ENABLED", "true").lower() == "true"
    STREAMING_SYNC_INTERVAL: int = int(os.getenv("STREAMING_SYNC_INTERVAL", 100))  # milliseconds
    STREAMING_MAX_OFFSET: int = int(os.getenv("STREAMING_MAX_OFFSET", 2000))  # milliseconds
    STREAMING_AUTO_SYNC: bool = os.getenv("STREAMING_AUTO_SYNC", "true").lower() == "true"
    STREAMING_PLAYER_TYPES: List[str] = ["html5", "hls", "dash"]
    STREAMING_DEFAULT_PLAYER: str = os.getenv("STREAMING_DEFAULT_PLAYER", "html5")
    
    # ==================== VOICE COMMANDS ====================
    VOICE_COMMANDS_ENABLED: bool = os.getenv("VOICE_COMMANDS_ENABLED", "true").lower() == "true"
    VOICE_COMMANDS: Dict[str, str] = {
        "mute": "Mute microphone",
        "unmute": "Unmute microphone",
        "deafen": "Deafen audio",
        "undeafen": "Undeafen audio",
        "play": "Play current video",
        "pause": "Pause current video",
        "next": "Next episode",
        "previous": "Previous episode",
        "volume up": "Increase volume",
        "volume down": "Decrease volume",
        "fullscreen": "Toggle fullscreen",
        "theater": "Toggle theater mode"
    }
    
    # ==================== VOICE TRANSLATION ====================
    VOICE_TRANSLATION_ENABLED: bool = os.getenv("VOICE_TRANSLATION_ENABLED", "false").lower() == "true"
    VOICE_TRANSLATION_LANGUAGES: List[str] = [
        "en", "ja", "es", "fr", "de", "zh", "ko", "ar",
        "hi", "pt", "ru", "it", "tr", "vi", "th", "id"
    ]
    VOICE_TRANSLATION_DEFAULT_TARGET: str = os.getenv("VOICE_TRANSLATION_DEFAULT", "en")
    VOICE_TRANSLATION_REAL_TIME: bool = os.getenv("VOICE_TRANSLATION_REAL_TIME", "false").lower() == "true"
    
    # ==================== SPEECH-TO-TEXT ====================
    SPEECH_TO_TEXT_ENABLED: bool = os.getenv("SPEECH_TO_TEXT_ENABLED", "true").lower() == "true"
    SPEECH_TO_TEXT_LANGUAGES: List[str] = ["en-US", "ja-JP", "es-ES", "fr-FR", "de-DE", "zh-CN", "ko-KR"]
    SPEECH_TO_TEXT_DEFAULT_LANGUAGE: str = os.getenv("SPEECH_TO_TEXT_DEFAULT", "en-US")
    SPEECH_TO_TEXT_REAL_TIME: bool = os.getenv("SPEECH_TO_TEXT_REAL_TIME", "true").lower() == "true"
    SPEECH_TO_TEXT_PROFANITY_FILTER: bool = os.getenv("SPEECH_TO_TEXT_PROFANITY_FILTER", "true").lower() == "true"
    
    # ==================== TEXT-TO-SPEECH ====================
    TEXT_TO_SPEECH_ENABLED: bool = os.getenv("TEXT_TO_SPEECH_ENABLED", "true").lower() == "true"
    TEXT_TO_SPEECH_VOICES: List[str] = [
        "male_1", "male_2", "female_1", "female_2", "neutral"
    ]
    TEXT_TO_SPEECH_DEFAULT_VOICE: str = os.getenv("TEXT_TO_SPEECH_DEFAULT_VOICE", "female_1")
    TEXT_TO_SPEECH_RATE: float = float(os.getenv("TEXT_TO_SPEECH_RATE", 1.0))
    TEXT_TO_SPEECH_PITCH: float = float(os.getenv("TEXT_TO_SPEECH_PITCH", 1.0))
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_ice_servers(cls) -> List[Dict[str, Any]]:
        """Get ICE servers configuration"""
        return cls.WEBRTC_ICE_SERVERS
    
    @classmethod
    def get_room_type(cls, room_type: str) -> Optional[Dict]:
        """Get room type configuration"""
        return cls.ROOM_TYPES.get(room_type)
    
    @classmethod
    def get_all_room_types(cls) -> Dict[str, Dict]:
        """Get all room types"""
        return cls.ROOM_TYPES
    
    @classmethod
    def get_audio_quality(cls, quality: str) -> Dict:
        """Get audio quality settings"""
        return cls.AUDIO_QUALITIES.get(quality, cls.AUDIO_QUALITIES["medium"])
    
    @classmethod
    def get_video_quality(cls, quality: str) -> Dict:
        """Get video quality settings"""
        return cls.VIDEO_QUALITIES.get(quality, cls.VIDEO_QUALITIES["720p"])
    
    @classmethod
    def get_screen_share_quality(cls, quality: str) -> Dict:
        """Get screen share quality settings"""
        return cls.SCREEN_SHARE_QUALITIES.get(quality, cls.SCREEN_SHARE_QUALITIES["1080p"])
    
    @classmethod
    def get_audio_bitrate(cls, quality: str) -> int:
        """Get audio bitrate for quality"""
        audio_quality = cls.get_audio_quality(quality)
        return audio_quality.get("bitrate", 64000)
    
    @classmethod
    def get_video_bitrate(cls, quality: str) -> int:
        """Get video bitrate for quality"""
        video_quality = cls.get_video_quality(quality)
        return video_quality.get("bitrate", 2500000)
    
    @classmethod
    def is_video_enabled(cls) -> bool:
        """Check if video chat is enabled"""
        return cls.VIDEO_ENABLED
    
    @classmethod
    def is_screen_share_enabled(cls) -> bool:
        """Check if screen share is enabled"""
        return cls.SCREEN_SHARE_ENABLED
    
    @classmethod
    def is_recording_enabled(cls) -> bool:
        """Check if recording is enabled"""
        return cls.RECORDING_ENABLED
    
    @classmethod
    def is_moderation_enabled(cls) -> bool:
        """Check if moderation is enabled"""
        return cls.MODERATION_ENABLED
    
    @classmethod
    def is_streaming_together_enabled(cls) -> bool:
        """Check if streaming together is enabled"""
        return cls.STREAMING_TOGETHER_ENABLED
    
    @classmethod
    def is_voice_commands_enabled(cls) -> bool:
        """Check if voice commands are enabled"""
        return cls.VOICE_COMMANDS_ENABLED
    
    @classmethod
    def is_voice_translation_enabled(cls) -> bool:
        """Check if voice translation is enabled"""
        return cls.VOICE_TRANSLATION_ENABLED
    
    @classmethod
    def is_speech_to_text_enabled(cls) -> bool:
        """Check if speech-to-text is enabled"""
        return cls.SPEECH_TO_TEXT_ENABLED
    
    @classmethod
    def is_text_to_speech_enabled(cls) -> bool:
        """Check if text-to-speech is enabled"""
        return cls.TEXT_TO_SPEECH_ENABLED
    
    @classmethod
    def get_voice_commands(cls) -> Dict[str, str]:
        """Get voice commands"""
        return cls.VOICE_COMMANDS
    
    @classmethod
    def get_translation_languages(cls) -> List[str]:
        """Get translation languages"""
        return cls.VOICE_TRANSLATION_LANGUAGES
    
    @classmethod
    def get_speech_languages(cls) -> List[str]:
        """Get speech-to-text languages"""
        return cls.SPEECH_TO_TEXT_LANGUAGES
    
    @classmethod
    def get_tts_voices(cls) -> List[str]:
        """Get text-to-speech voices"""
        return cls.TEXT_TO_SPEECH_VOICES
    
    @classmethod
    def generate_room_id(cls) -> str:
        """Generate a random room ID"""
        import random
        import string
        
        chars = string.ascii_uppercase + string.digits
        return ''.join(random.choices(chars, k=cls.ROOM_ID_LENGTH))
    
    @classmethod
    def get_max_participants(cls) -> int:
        """Get maximum participants per room"""
        return cls.ROOM_MAX_PARTICIPANTS
    
    @classmethod
    def get_max_duration(cls) -> int:
        """Get maximum room duration in seconds"""
        return cls.ROOM_MAX_DURATION
    
    @classmethod
    def is_auto_delete_enabled(cls) -> bool:
        """Check if auto-delete is enabled"""
        return cls.ROOM_AUTO_DELETE_EMPTY
    
    @classmethod
    def get_recording_config(cls) -> Dict[str, Any]:
        """Get recording configuration"""
        return {
            "enabled": cls.RECORDING_ENABLED,
            "max_duration": cls.RECORDING_MAX_DURATION,
            "max_size": cls.RECORDING_MAX_SIZE,
            "formats": cls.RECORDING_FORMATS,
            "default_format": cls.RECORDING_DEFAULT_FORMAT,
            "auto_delete_days": cls.RECORDING_AUTO_DELETE_DAYS,
            "storage_path": cls.ROOM_RECORDING_STORAGE_PATH
        }
    
    @classmethod
    def get_streaming_config(cls) -> Dict[str, Any]:
        """Get streaming configuration"""
        return {
            "enabled": cls.STREAMING_TOGETHER_ENABLED,
            "sync_interval": cls.STREAMING_SYNC_INTERVAL,
            "max_offset": cls.STREAMING_MAX_OFFSET,
            "auto_sync": cls.STREAMING_AUTO_SYNC,
            "player_types": cls.STREAMING_PLAYER_TYPES,
            "default_player": cls.STREAMING_DEFAULT_PLAYER
        }


# Create voice config instance
voice_config = VoiceConfig()

# Print voice configuration status
print(f"🎤 Voice Chat Configuration")
print(f"   ICE Servers: {len(voice_config.get_ice_servers())}")
print(f"   Room Types: {len(voice_config.get_all_room_types())}")
print(f"   Audio Qualities: {len(voice_config.AUDIO_QUALITIES)}")
print(f"   Video: {'Enabled' if voice_config.is_video_enabled() else 'Disabled'}")
print(f"   Recording: {'Enabled' if voice_config.is_recording_enabled() else 'Disabled'}")
print(f"   Voice Commands: {'Enabled' if voice_config.is_voice_commands_enabled() else 'Disabled'}")
