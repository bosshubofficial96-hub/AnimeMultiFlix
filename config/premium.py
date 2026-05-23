"""
AnimeMultiFlix - Premium Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class PremiumConfig:
    """Premium Subscription Configuration Class"""
    
    # ==================== PREMIUM PLANS ====================
    PREMIUM_PLANS: Dict[str, Dict] = {
        "free": {
            "id": "free",
            "name": "Free",
            "display_name": "Free Plan",
            "description": "Basic access with ads",
            "price_monthly": 0,
            "price_yearly": 0,
            "price_lifetime": 0,
            "currency": "USD",
            "stripe_price_id": "price_free",
            "paypal_plan_id": "free",
            "features": [
                "Basic access to anime library",
                "480p video quality",
                "Ads supported",
                "1 device at a time",
                "No downloads",
                "Standard support",
                "Watch with ads"
            ],
            "limits": {
                "quality": "480p",
                "max_quality": "480p",
                "devices": 1,
                "downloads": False,
                "downloads_per_month": 0,
                "ads": True,
                "ad_free": False,
                "watch_party_size": 5,
                "group_size": 100,
                "max_groups": 10,
                "voice_quality": "standard",
                "voice_bitrate": 32000,
                "max_friends": 50,
                "custom_emojis": False,
                "animated_emoji": False,
                "profile_badge": False,
                "blue_tick": False,
                "early_access": False,
                "exclusive_content": False,
                "priority_support": False,
                "background_play": False,
                "offline_download": False,
                "multiple_subtitles": 1,
                "audio_tracks": 1
            },
            "badge": "⭐",
            "color": "#95A5A6",
            "sort_order": 0,
            "popular": False,
            "recommended": False
        },
        "basic": {
            "id": "basic",
            "name": "Basic",
            "display_name": "Basic Premium",
            "description": "No ads, HD quality",
            "price_monthly": 4.99,
            "price_yearly": 49.99,
            "price_lifetime": 149.99,
            "currency": "USD",
            "stripe_price_id": "price_basic_monthly",
            "stripe_yearly_price_id": "price_basic_yearly",
            "paypal_plan_id": "basic",
            "features": [
                "No ads - ad-free experience",
                "1080p Full HD quality",
                "Download support",
                "2 devices simultaneously",
                "Priority email support",
                "Watch party up to 20 users",
                "Groups up to 500 members",
                "Voice chat high quality"
            ],
            "limits": {
                "quality": "1080p",
                "max_quality": "1080p",
                "devices": 2,
                "downloads": True,
                "downloads_per_month": 100,
                "ads": False,
                "ad_free": True,
                "watch_party_size": 20,
                "group_size": 500,
                "max_groups": 50,
                "voice_quality": "high",
                "voice_bitrate": 64000,
                "max_friends": 200,
                "custom_emojis": False,
                "animated_emoji": False,
                "profile_badge": True,
                "blue_tick": False,
                "early_access": False,
                "exclusive_content": False,
                "priority_support": False,
                "background_play": True,
                "offline_download": True,
                "multiple_subtitles": 2,
                "audio_tracks": 2
            },
            "badge": "💎",
            "color": "#3498DB",
            "sort_order": 1,
            "popular": False,
            "recommended": True
        },
        "pro": {
            "id": "pro",
            "name": "Pro",
            "display_name": "Pro Premium",
            "description": "4K quality, early access",
            "price_monthly": 9.99,
            "price_yearly": 99.99,
            "price_lifetime": 299.99,
            "currency": "USD",
            "stripe_price_id": "price_pro_monthly",
            "stripe_yearly_price_id": "price_pro_yearly",
            "paypal_plan_id": "pro",
            "features": [
                "No ads - completely ad-free",
                "4K Ultra HD quality",
                "Download support unlimited",
                "5 devices simultaneously",
                "Early access to new episodes",
                "Priority 24/7 support",
                "Watch party up to 100 users",
                "Groups up to 2000 members",
                "Voice chat HD quality",
                "Custom emojis",
                "Profile badge",
                "Background play"
            ],
            "limits": {
                "quality": "4k",
                "max_quality": "4k",
                "devices": 5,
                "downloads": True,
                "downloads_per_month": 500,
                "ads": False,
                "ad_free": True,
                "watch_party_size": 100,
                "group_size": 2000,
                "max_groups": 100,
                "voice_quality": "hd",
                "voice_bitrate": 128000,
                "max_friends": 500,
                "custom_emojis": True,
                "animated_emoji": False,
                "profile_badge": True,
                "blue_tick": False,
                "early_access": True,
                "exclusive_content": False,
                "priority_support": True,
                "background_play": True,
                "offline_download": True,
                "multiple_subtitles": 5,
                "audio_tracks": 5
            },
            "badge": "👑",
            "color": "#9B59B6",
            "sort_order": 2,
            "popular": True,
            "recommended": False
        },
        "ultimate": {
            "id": "ultimate",
            "name": "Ultimate",
            "display_name": "Ultimate Premium",
            "description": "4K HDR, family sharing",
            "price_monthly": 14.99,
            "price_yearly": 149.99,
            "price_lifetime": 449.99,
            "currency": "USD",
            "stripe_price_id": "price_ultimate_monthly",
            "stripe_yearly_price_id": "price_ultimate_yearly",
            "paypal_plan_id": "ultimate",
            "features": [
                "No ads - completely ad-free",
                "4K HDR + Dolby Vision",
                "Dolby Atmos audio",
                "Download support unlimited",
                "10 devices simultaneously",
                "Early access to all content",
                "Exclusive premium content",
                "Priority 24/7 VIP support",
                "Watch party up to 500 users",
                "Groups up to 5000 members",
                "Voice chat Ultra HD quality",
                "Custom & animated emojis",
                "Premium profile badge",
                "Blue verified tick",
                "Background play",
                "Family sharing up to 5 profiles",
                "Exclusive merchandise discounts"
            ],
            "limits": {
                "quality": "4k",
                "max_quality": "8k",
                "devices": 10,
                "downloads": True,
                "downloads_per_month": 2000,
                "ads": False,
                "ad_free": True,
                "watch_party_size": 500,
                "group_size": 5000,
                "max_groups": 200,
                "voice_quality": "ultra-hd",
                "voice_bitrate": 256000,
                "max_friends": 1000,
                "custom_emojis": True,
                "animated_emoji": True,
                "profile_badge": True,
                "blue_tick": True,
                "early_access": True,
                "exclusive_content": True,
                "priority_support": True,
                "background_play": True,
                "offline_download": True,
                "multiple_subtitles": 10,
                "audio_tracks": 10,
                "family_profiles": 5
            },
            "badge": "👑✨",
            "color": "#FF3366",
            "sort_order": 3,
            "popular": False,
            "recommended": False
        },
        "family": {
            "id": "family",
            "name": "Family",
            "display_name": "Family Plan",
            "description": "5 profiles, parental controls",
            "price_monthly": 19.99,
            "price_yearly": 199.99,
            "price_lifetime": 599.99,
            "currency": "USD",
            "stripe_price_id": "price_family_monthly",
            "stripe_yearly_price_id": "price_family_yearly",
            "paypal_plan_id": "family",
            "features": [
                "All Ultimate features",
                "5 separate profiles",
                "Parental controls",
                "Kids mode",
                "Family sharing",
                "Profile PIN protection",
                "Viewing activity per profile",
                "Separate watchlists per profile"
            ],
            "limits": {
                "quality": "4k",
                "max_quality": "8k",
                "devices": 15,
                "downloads": True,
                "downloads_per_month": 5000,
                "ads": False,
                "ad_free": True,
                "watch_party_size": 500,
                "group_size": 5000,
                "max_groups": 200,
                "voice_quality": "ultra-hd",
                "voice_bitrate": 256000,
                "max_friends": 1000,
                "custom_emojis": True,
                "animated_emoji": True,
                "profile_badge": True,
                "blue_tick": True,
                "early_access": True,
                "exclusive_content": True,
                "priority_support": True,
                "background_play": True,
                "offline_download": True,
                "multiple_subtitles": 10,
                "audio_tracks": 10,
                "family_profiles": 5
            },
            "badge": "👨‍👩‍👧‍👦",
            "color": "#27AE60",
            "sort_order": 4,
            "popular": False,
            "recommended": False
        },
        "student": {
            "id": "student",
            "name": "Student",
            "display_name": "Student Plan",
            "description": "50% off for students",
            "price_monthly": 2.49,
            "price_yearly": 24.99,
            "price_lifetime": None,
            "currency": "USD",
            "stripe_price_id": "price_student_monthly",
            "paypal_plan_id": "student",
            "features": [
                "All Basic features",
                "50% discount",
                "Student verification required",
                ".edu email required",
                "Annual verification"
            ],
            "limits": {
                "quality": "1080p",
                "max_quality": "1080p",
                "devices": 2,
                "downloads": True,
                "downloads_per_month": 100,
                "ads": False,
                "ad_free": True,
                "watch_party_size": 20,
                "group_size": 500,
                "max_groups": 50,
                "voice_quality": "high",
                "voice_bitrate": 64000,
                "max_friends": 200,
                "custom_emojis": False,
                "animated_emoji": False,
                "profile_badge": True,
                "blue_tick": False,
                "early_access": False,
                "exclusive_content": False,
                "priority_support": False,
                "background_play": True,
                "offline_download": True,
                "multiple_subtitles": 2,
                "audio_tracks": 2
            },
            "badge": "🎓",
            "color": "#F39C12",
            "sort_order": 5,
            "popular": False,
            "recommended": False,
            "verification_required": True
        }
    }
    
    # ==================== DISCOUNTS ====================
    DISCOUNTS: Dict[str, float] = {
        "yearly": 0.20,           # 20% off yearly plans
        "student": 0.50,          # 50% off for students
        "referral": 0.10,         # 10% off for referrals
        "promo_code": 0.15,       # 15% off for promo codes
        "first_month": 0.50,      # 50% off first month
        "holiday": 0.30,          # 30% off holiday sale
        "black_friday": 0.40,     # 40% off Black Friday
        "cyber_monday": 0.35,     # 35% off Cyber Monday
        "new_year": 0.25,         # 25% off New Year
        "birthday": 0.20          # 20% off birthday month
    }
    
    # ==================== TRIAL SETTINGS ====================
    TRIAL_ENABLED: bool = os.getenv("PREMIUM_TRIAL_ENABLED", "true").lower() == "true"
    TRIAL_DAYS: int = int(os.getenv("PREMIUM_TRIAL_DAYS", 7))
    TRIAL_FOR_NEW_USERS_ONLY: bool = os.getenv("TRIAL_NEW_USERS_ONLY", "true").lower() == "true"
    TRIAL_REQUIRE_CREDIT_CARD: bool = os.getenv("TRIAL_REQUIRE_CARD", "true").lower() == "true"
    TRIAL_AUTO_CONVERT: bool = os.getenv("TRIAL_AUTO_CONVERT", "true").lower() == "true"
    TRIAL_REMINDER_DAYS: List[int] = [3, 1]  # Send reminders 3 days and 1 day before trial ends
    
    # ==================== PREMIUM FEATURES ====================
    PREMIUM_FEATURES: Dict[str, Any] = {
        "ad_free": {
            "name": "Ad-Free Experience",
            "description": "No advertisements while streaming",
            "icon": "fa-ban",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "hd_quality": {
            "name": "HD Quality",
            "description": "1080p Full HD streaming",
            "icon": "fa-tv",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "uhd_quality": {
            "name": "4K Ultra HD",
            "description": "4K HDR + Dolby Vision",
            "icon": "fa-film",
            "available_in": ["pro", "ultimate", "family"]
        },
        "offline_download": {
            "name": "Offline Downloads",
            "description": "Download episodes to watch offline",
            "icon": "fa-download",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "multiple_devices": {
            "name": "Multiple Devices",
            "description": "Watch on multiple devices simultaneously",
            "icon": "fa-mobile-alt",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "early_access": {
            "name": "Early Access",
            "description": "Watch new episodes 1 hour early",
            "icon": "fa-clock",
            "available_in": ["pro", "ultimate", "family"]
        },
        "exclusive_content": {
            "name": "Exclusive Content",
            "description": "Access to premium-only anime",
            "icon": "fa-gem",
            "available_in": ["ultimate", "family"]
        },
        "priority_support": {
            "name": "Priority Support",
            "description": "24/7 priority customer support",
            "icon": "fa-headset",
            "available_in": ["pro", "ultimate", "family"]
        },
        "voice_hd": {
            "name": "HD Voice Quality",
            "description": "High quality voice chat",
            "icon": "fa-microphone-alt",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "watch_party": {
            "name": "Watch Party",
            "description": "Watch anime together with friends",
            "icon": "fa-users",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "custom_emojis": {
            "name": "Custom Emojis",
            "description": "Upload and use custom emojis",
            "icon": "fa-smile-wink",
            "available_in": ["pro", "ultimate", "family"]
        },
        "animated_emojis": {
            "name": "Animated Emojis",
            "description": "Use animated emojis in chat",
            "icon": "fa-laugh-beam",
            "available_in": ["ultimate", "family"]
        },
        "profile_badge": {
            "name": "Premium Badge",
            "description": "Special badge on your profile",
            "icon": "fa-certificate",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "blue_tick": {
            "name": "Verified Badge",
            "description": "Blue verified tick on profile",
            "icon": "fa-check-circle",
            "available_in": ["ultimate", "family"]
        },
        "background_play": {
            "name": "Background Play",
            "description": "Continue playing audio in background",
            "icon": "fa-play-circle",
            "available_in": ["basic", "pro", "ultimate", "family", "student"]
        },
        "family_sharing": {
            "name": "Family Sharing",
            "description": "Share with up to 5 family members",
            "icon": "fa-users",
            "available_in": ["family"]
        },
        "parental_controls": {
            "name": "Parental Controls",
            "description": "Control what children can watch",
            "icon": "fa-shield-alt",
            "available_in": ["family"]
        },
        "kids_mode": {
            "name": "Kids Mode",
            "description": "Kid-friendly interface",
            "icon": "fa-child",
            "available_in": ["family"]
        }
    }
    
    # ==================== SUBSCRIPTION SETTINGS ====================
    SUBSCRIPTION_BILLING_CYCLES: List[str] = ["monthly", "yearly", "lifetime"]
    SUBSCRIPTION_GRACE_PERIOD_DAYS: int = int(os.getenv("SUBSCRIPTION_GRACE_DAYS", 3))
    SUBSCRIPTION_CANCELLATION_REFUND_DAYS: int = int(os.getenv("CANCELLATION_REFUND_DAYS", 14))
    SUBSCRIPTION_RENEWAL_REMINDER_DAYS: List[int] = [7, 3, 1]
    SUBSCRIPTION_PAYMENT_RETRY_ATTEMPTS: int = int(os.getenv("PAYMENT_RETRY_ATTEMPTS", 3))
    SUBSCRIPTION_PAYMENT_RETRY_DELAYS: List[int] = [1, 3, 7]  # days
    
    # ==================== PAYMENT METHODS ====================
    PAYMENT_METHODS: List[Dict] = [
        {"id": "credit_card", "name": "Credit/Debit Card", "icon": "fa-credit-card", "enabled": True},
        {"id": "paypal", "name": "PayPal", "icon": "fa-paypal", "enabled": True},
        {"id": "google_pay", "name": "Google Pay", "icon": "fa-google", "enabled": True},
        {"id": "apple_pay", "name": "Apple Pay", "icon": "fa-apple", "enabled": True},
        {"id": "crypto", "name": "Cryptocurrency", "icon": "fa-bitcoin", "enabled": False},
        {"id": "bank_transfer", "name": "Bank Transfer", "icon": "fa-university", "enabled": False}
    ]
    
    # ==================== PROMO CODES ====================
    PROMO_CODE_LENGTH: int = 8
    PROMO_CODE_PREFIX: str = "AMF"
    PROMO_CODE_CHARS: str = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789"
    PROMO_CODE_MAX_USES: int = 1000
    PROMO_CODE_MAX_USES_PER_USER: int = 1
    
    # ==================== REFERRAL PROGRAM ====================
    REFERRAL_ENABLED: bool = os.getenv("REFERRAL_ENABLED", "true").lower() == "true"
    REFERRAL_REWARD_DAYS: int = int(os.getenv("REFERRAL_REWARD_DAYS", 30))
    REFERRAL_REWARD_AMOUNT: float = float(os.getenv("REFERRAL_REWARD_AMOUNT", 5.00))
    REFERRAL_MAX_REWARDS_PER_USER: int = int(os.getenv("REFERRAL_MAX_REWARDS", 100))
    REFERRAL_CODE_LENGTH: int = 6
    
    # ==================== GIFT SUBSCRIPTIONS ====================
    GIFT_SUBSCRIPTION_ENABLED: bool = os.getenv("GIFT_SUBSCRIPTION_ENABLED", "true").lower() == "true"
    GIFT_CARD_LENGTH: int = 16
    GIFT_CARD_PREFIX: str = "AMF-GIFT"
    GIFT_CARD_EXPIRY_DAYS: int = int(os.getenv("GIFT_CARD_EXPIRY_DAYS", 365))
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_plan(cls, plan_id: str) -> Optional[Dict]:
        """Get premium plan by ID"""
        return cls.PREMIUM_PLANS.get(plan_id)
    
    @classmethod
    def get_all_plans(cls) -> Dict[str, Dict]:
        """Get all premium plans"""
        return cls.PREMIUM_PLANS
    
    @classmethod
    def get_active_plans(cls) -> Dict[str, Dict]:
        """Get all active premium plans"""
        return {k: v for k, v in cls.PREMIUM_PLANS.items() if v.get("price_monthly", 0) > 0 or k == "free"}
    
    @classmethod
    def get_plan_price(cls, plan_id: str, cycle: str = "monthly") -> float:
        """Get plan price for specific billing cycle"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return 0
        
        price_map = {
            "monthly": "price_monthly",
            "yearly": "price_yearly",
            "lifetime": "price_lifetime"
        }
        price_key = price_map.get(cycle, "price_monthly")
        return plan.get(price_key, 0)
    
    @classmethod
    def get_plan_features(cls, plan_id: str) -> List[str]:
        """Get features for a plan"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return []
        return plan.get("features", [])
    
    @classmethod
    def get_plan_limits(cls, plan_id: str) -> Dict[str, Any]:
        """Get limits for a plan"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return {}
        return plan.get("limits", {})
    
    @classmethod
    def get_plan_badge(cls, plan_id: str) -> str:
        """Get badge for a plan"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return "⭐"
        return plan.get("badge", "⭐")
    
    @classmethod
    def get_plan_color(cls, plan_id: str) -> str:
        """Get color for a plan"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return "#95A5A6"
        return plan.get("color", "#95A5A6")
    
    @classmethod
    def calculate_discounted_price(cls, plan_id: str, discount_type: str, cycle: str = "monthly") -> float:
        """Calculate discounted price"""
        price = cls.get_plan_price(plan_id, cycle)
        if price == 0:
            return 0
        
        discount = cls.DISCOUNTS.get(discount_type, 0)
        discounted_price = price * (1 - discount)
        return round(discounted_price, 2)
    
    @classmethod
    def get_yearly_discount(cls, plan_id: str) -> float:
        """Get yearly discount percentage"""
        monthly_price = cls.get_plan_price(plan_id, "monthly")
        yearly_price = cls.get_plan_price(plan_id, "yearly")
        
        if monthly_price == 0 or yearly_price == 0:
            return 0
        
        annual_monthly_cost = monthly_price * 12
        savings = annual_monthly_cost - yearly_price
        discount = savings / annual_monthly_cost
        
        return round(discount, 2)
    
    @classmethod
    def is_feature_available(cls, plan_id: str, feature_name: str) -> bool:
        """Check if a feature is available in a plan"""
        plan = cls.get_plan(plan_id)
        if not plan:
            return False
        
        feature = cls.PREMIUM_FEATURES.get(feature_name, {})
        available_in = feature.get("available_in", [])
        
        return plan_id in available_in or plan_id == "ultimate" and "ultimate" in available_in
    
    @classmethod
    def get_feature_details(cls, feature_name: str) -> Optional[Dict]:
        """Get feature details"""
        return cls.PREMIUM_FEATURES.get(feature_name)
    
    @classmethod
    def get_all_features(cls) -> Dict[str, Any]:
        """Get all premium features"""
        return cls.PREMIUM_FEATURES
    
    @classmethod
    def is_trial_available(cls, plan_id: str) -> bool:
        """Check if trial is available for a plan"""
        if not cls.TRIAL_ENABLED:
            return False
        # Only new users can get trial for paid plans
        return plan_id in ["basic", "pro", "ultimate", "family"]
    
    @classmethod
    def get_max_downloads(cls, plan_id: str) -> int:
        """Get maximum downloads per month for a plan"""
        limits = cls.get_plan_limits(plan_id)
        return limits.get("downloads_per_month", 0)
    
    @classmethod
    def get_max_devices(cls, plan_id: str) -> int:
        """Get maximum devices for a plan"""
        limits = cls.get_plan_limits(plan_id)
        return limits.get("devices", 1)
    
    @classmethod
    def get_max_quality(cls, plan_id: str) -> str:
        """Get maximum video quality for a plan"""
        limits = cls.get_plan_limits(plan_id)
        return limits.get("max_quality", "480p")
    
    @classmethod
    def get_watch_party_size(cls, plan_id: str) -> int:
        """Get maximum watch party size for a plan"""
        limits = cls.get_plan_limits(plan_id)
        return limits.get("watch_party_size", 5)
    
    @classmethod
    def get_group_size(cls, plan_id: str) -> int:
        """Get maximum group size for a plan"""
        limits = cls.get_plan_limits(plan_id)
        return limits.get("group_size", 100)
    
    @classmethod
    def is_blue_tick_available(cls, plan_id: str) -> bool:
        """Check if blue tick is available"""
        return cls.is_feature_available(plan_id, "blue_tick")
    
    @classmethod
    def is_animated_emoji_available(cls, plan_id: str) -> bool:
        """Check if animated emoji is available"""
        return cls.is_feature_available(plan_id, "animated_emojis")
    
    @classmethod
    def get_referral_reward(cls) -> float:
        """Get referral reward amount"""
        return cls.REFERRAL_REWARD_AMOUNT
    
    @classmethod
    def generate_promo_code(cls) -> str:
        """Generate a random promo code"""
        import random
        import string
        
        chars = cls.PROMO_CODE_CHARS
        random_part = ''.join(random.choices(chars, k=cls.PROMO_CODE_LENGTH))
        return f"{cls.PROMO_CODE_PREFIX}-{random_part}"


# Create premium config instance
premium_config = PremiumConfig()

# Print premium configuration status
print(f"💎 Premium Configuration")
print(f"   Plans: {len(premium_config.get_active_plans())}")
print(f"   Features: {len(premium_config.get_all_features())}")
print(f"   Trial Days: {premium_config.TRIAL_DAYS}")
print(f"   Referral Reward: ${premium_config.get_referral_reward()}")
