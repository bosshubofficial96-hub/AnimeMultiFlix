"""
AnimeMultiFlix - Payment Configuration
Version: 4.0.0 (2026)
Error Free - Production Ready
Powered by BossHub
"""

import os
from typing import Dict, List, Any, Optional
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()


class PaymentConfig:
    """Payment Configuration Class"""
    
    # ==================== GENERAL PAYMENT SETTINGS ====================
    CURRENCY: str = os.getenv("PAYMENT_CURRENCY", "USD")
    CURRENCY_SYMBOL: str = "$"
    CURRENCY_CODE: str = "USD"
    TAX_RATE: float = float(os.getenv("PAYMENT_TAX_RATE", 0.0))
    TAX_NAME: str = os.getenv("PAYMENT_TAX_NAME", "Tax")
    TAX_ID: Optional[str] = os.getenv("TAX_ID")
    COMPANY_NAME: str = os.getenv("COMPANY_NAME", "AnimeMultiFlix Inc.")
    COMPANY_ADDRESS: str = os.getenv("COMPANY_ADDRESS", "123 Anime Street, Tokyo, Japan")
    COMPANY_EMAIL: str = os.getenv("COMPANY_EMAIL", "billing@animemultiflix.com")
    
    # ==================== STRIPE PAYMENT ====================
    STRIPE_ENABLED: bool = os.getenv("STRIPE_ENABLED", "true").lower() == "true"
    STRIPE_PUBLIC_KEY: str = os.getenv("STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_API_VERSION: str = os.getenv("STRIPE_API_VERSION", "2023-10-16")
    
    # Stripe Products & Prices
    STRIPE_PRODUCTS: Dict[str, str] = {
        "free": "prod_free",
        "basic_monthly": "prod_basic_monthly",
        "basic_yearly": "prod_basic_yearly",
        "pro_monthly": "prod_pro_monthly",
        "pro_yearly": "prod_pro_yearly",
        "ultimate_monthly": "prod_ultimate_monthly",
        "ultimate_yearly": "prod_ultimate_yearly",
        "family_monthly": "prod_family_monthly",
        "family_yearly": "prod_family_yearly"
    }
    
    STRIPE_PRICES: Dict[str, str] = {
        "basic_monthly": "price_basic_monthly",
        "basic_yearly": "price_basic_yearly",
        "pro_monthly": "price_pro_monthly",
        "pro_yearly": "price_pro_yearly",
        "ultimate_monthly": "price_ultimate_monthly",
        "ultimate_yearly": "price_ultimate_yearly",
        "family_monthly": "price_family_monthly",
        "family_yearly": "price_family_yearly"
    }
    
    # Stripe Webhook Events
    STRIPE_WEBHOOK_EVENTS: List[str] = [
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "invoice.paid",
        "invoice.payment_failed",
        "checkout.session.completed"
    ]
    
    # ==================== PAYPAL PAYMENT ====================
    PAYPAL_ENABLED: bool = os.getenv("PAYPAL_ENABLED", "true").lower() == "true"
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox, live
    PAYPAL_API_URL: str = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"
    
    # PayPal Products & Plans
    PAYPAL_PRODUCTS: Dict[str, str] = {
        "basic": "PROD-XXXX",
        "pro": "PROD-XXXX",
        "ultimate": "PROD-XXXX",
        "family": "PROD-XXXX"
    }
    
    PAYPAL_PLANS: Dict[str, str] = {
        "basic_monthly": "P-XXXX",
        "basic_yearly": "P-XXXX",
        "pro_monthly": "P-XXXX",
        "pro_yearly": "P-XXXX",
        "ultimate_monthly": "P-XXXX",
        "ultimate_yearly": "P-XXXX",
        "family_monthly": "P-XXXX",
        "family_yearly": "P-XXXX"
    }
    
    # ==================== RAZORPAY PAYMENT ====================
    RAZORPAY_ENABLED: bool = os.getenv("RAZORPAY_ENABLED", "false").lower() == "true"
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    
    # ==================== GOOGLE PAY ====================
    GOOGLE_PAY_ENABLED: bool = os.getenv("GOOGLE_PAY_ENABLED", "true").lower() == "true"
    GOOGLE_PAY_MERCHANT_ID: str = os.getenv("GOOGLE_PAY_MERCHANT_ID", "")
    GOOGLE_PAY_GATEWAY: str = "stripe"  # stripe, adyen, braintree
    
    # ==================== APPLE PAY ====================
    APPLE_PAY_ENABLED: bool = os.getenv("APPLE_PAY_ENABLED", "true").lower() == "true"
    APPLE_PAY_MERCHANT_ID: str = os.getenv("APPLE_PAY_MERCHANT_ID", "")
    APPLE_PAY_MERCHANT_CERT: str = os.getenv("APPLE_PAY_MERCHANT_CERT", "")
    
    # ==================== UPI (India) ====================
    UPI_ENABLED: bool = os.getenv("UPI_ENABLED", "false").lower() == "true"
    UPI_VPA: str = os.getenv("UPI_VPA", "animemultiflix@okhdfcbank")
    UPI_MERCHANT_NAME: str = os.getenv("UPI_MERCHANT_NAME", "AnimeMultiFlix")
    
    # ==================== CRYPTO PAYMENT ====================
    CRYPTO_ENABLED: bool = os.getenv("CRYPTO_ENABLED", "false").lower() == "true"
    CRYPTO_CURRENCIES: List[str] = ["BTC", "ETH", "USDT", "BNB", "SOL"]
    CRYPTO_API_KEY: str = os.getenv("CRYPTO_API_KEY", "")
    CRYPTO_API_SECRET: str = os.getenv("CRYPTO_API_SECRET", "")
    
    # ==================== BANK TRANSFER ====================
    BANK_TRANSFER_ENABLED: bool = os.getenv("BANK_TRANSFER_ENABLED", "false").lower() == "true"
    BANK_NAME: str = os.getenv("BANK_NAME", "Example Bank")
    BANK_ACCOUNT_NAME: str = os.getenv("BANK_ACCOUNT_NAME", "AnimeMultiFlix Inc.")
    BANK_ACCOUNT_NUMBER: str = os.getenv("BANK_ACCOUNT_NUMBER", "")
    BANK_ROUTING_NUMBER: str = os.getenv("BANK_ROUTING_NUMBER", "")
    BANK_SWIFT_CODE: str = os.getenv("BANK_SWIFT_CODE", "")
    BANK_IBAN: str = os.getenv("BANK_IBAN", "")
    
    # ==================== PRICES & PLANS ====================
    PRICES: Dict[str, Dict[str, float]] = {
        "basic": {
            "monthly": 4.99,
            "yearly": 49.99,
            "lifetime": 149.99
        },
        "pro": {
            "monthly": 9.99,
            "yearly": 99.99,
            "lifetime": 299.99
        },
        "ultimate": {
            "monthly": 14.99,
            "yearly": 149.99,
            "lifetime": 449.99
        },
        "family": {
            "monthly": 19.99,
            "yearly": 199.99,
            "lifetime": 599.99
        }
    }
    
    # ==================== DISCOUNTS ====================
    DISCOUNTS: Dict[str, float] = {
        "yearly": 0.20,      # 20% off
        "student": 0.50,     # 50% off
        "military": 0.25,    # 25% off
        "senior": 0.30,      # 30% off
        "first_month": 0.50, # 50% off
        "referral": 0.10,    # 10% off
        "promo": 0.15,       # 15% off
        "black_friday": 0.40, # 40% off
        "cyber_monday": 0.35, # 35% off
        "holiday": 0.30      # 30% off
    }
    
    # ==================== SUBSCRIPTION SETTINGS ====================
    SUBSCRIPTION_GRACE_PERIOD_DAYS: int = int(os.getenv("SUBSCRIPTION_GRACE_DAYS", 3))
    SUBSCRIPTION_CANCELLATION_REFUND_DAYS: int = int(os.getenv("CANCELLATION_REFUND_DAYS", 14))
    SUBSCRIPTION_RENEWAL_REMINDER_DAYS: List[int] = [30, 15, 7, 3, 1]
    SUBSCRIPTION_PAYMENT_RETRY_ATTEMPTS: int = int(os.getenv("PAYMENT_RETRY_ATTEMPTS", 3))
    SUBSCRIPTION_PAYMENT_RETRY_DELAYS: List[int] = [1, 3, 7]  # days
    SUBSCRIPTION_AUTO_CANCEL_ON_FAILURE: bool = os.getenv("AUTO_CANCEL_ON_FAILURE", "true").lower() == "true"
    
    # ==================== INVOICE SETTINGS ====================
    INVOICE_PREFIX: str = os.getenv("INVOICE_PREFIX", "INV")
    INVOICE_NUMBER_FORMAT: str = "{prefix}-{year:04d}{month:02d}{day:02d}-{seq:04d}"
    INVOICE_DUE_DAYS: int = int(os.getenv("INVOICE_DUE_DAYS", 14))
    INVOICE_LOGO_URL: str = "/assets/images/logo.png"
    INVOICE_TERMS: str = "Payment is due within 14 days. Late payments may result in service suspension."
    
    # ==================== TAX SETTINGS ====================
    TAX_COUNTRIES: Dict[str, Dict] = {
        "US": {"rate": 0.0, "name": "Sales Tax", "required": False},
        "GB": {"rate": 0.20, "name": "VAT", "required": True},
        "EU": {"rate": 0.20, "name": "VAT", "required": True},
        "CA": {"rate": 0.05, "name": "GST", "required": False},
        "AU": {"rate": 0.10, "name": "GST", "required": True},
        "IN": {"rate": 0.18, "name": "GST", "required": True},
        "JP": {"rate": 0.10, "name": "Consumption Tax", "required": True}
    }
    
    # ==================== REFUND SETTINGS ====================
    REFUND_AUTO_APPROVE_DAYS: int = int(os.getenv("REFUND_AUTO_APPROVE_DAYS", 7))
    REFUND_MAX_PERCENTAGE: float = float(os.getenv("REFUND_MAX_PERCENTAGE", 100.0))
    REFUND_PROCESSING_DAYS: int = int(os.getenv("REFUND_PROCESSING_DAYS", 5))
    REFUND_REASON_REQUIRED: bool = os.getenv("REFUND_REASON_REQUIRED", "true").lower() == "true"
    
    # ==================== PROMO CODES ====================
    PROMO_CODE_LENGTH: int = int(os.getenv("PROMO_CODE_LENGTH", 8))
    PROMO_CODE_PREFIX: str = os.getenv("PROMO_CODE_PREFIX", "AMF")
    PROMO_CODE_CHARS: str = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789"
    PROMO_CODE_MAX_USES: int = int(os.getenv("PROMO_CODE_MAX_USES", 1000))
    PROMO_CODE_MAX_USES_PER_USER: int = 1
    PROMO_CODE_EXPIRY_DAYS: int = int(os.getenv("PROMO_CODE_EXPIRY_DAYS", 90))
    
    # ==================== REFERRAL PROGRAM ====================
    REFERRAL_ENABLED: bool = os.getenv("REFERRAL_ENABLED", "true").lower() == "true"
    REFERRAL_REWARD_AMOUNT: float = float(os.getenv("REFERRAL_REWARD_AMOUNT", 5.00))
    REFERRAL_REWARD_TYPE: str = os.getenv("REFERRAL_REWARD_TYPE", "credit")  # credit, discount
    REFERRAL_REWARD_DAYS: int = int(os.getenv("REFERRAL_REWARD_DAYS", 30))
    REFERRAL_MAX_REWARDS_PER_USER: int = int(os.getenv("REFERRAL_MAX_REWARDS", 100))
    REFERRAL_CODE_LENGTH: int = int(os.getenv("REFERRAL_CODE_LENGTH", 6))
    
    # ==================== GIFT CARDS ====================
    GIFT_CARD_ENABLED: bool = os.getenv("GIFT_CARD_ENABLED", "true").lower() == "true"
    GIFT_CARD_LENGTH: int = int(os.getenv("GIFT_CARD_LENGTH", 16))
    GIFT_CARD_PREFIX: str = os.getenv("GIFT_CARD_PREFIX", "AMF-GIFT")
    GIFT_CARD_EXPIRY_DAYS: int = int(os.getenv("GIFT_CARD_EXPIRY_DAYS", 365))
    GIFT_CARD_MIN_AMOUNT: float = float(os.getenv("GIFT_CARD_MIN_AMOUNT", 10.00))
    GIFT_CARD_MAX_AMOUNT: float = float(os.getenv("GIFT_CARD_MAX_AMOUNT", 500.00))
    
    # ==================== SUBSCRIPTION PLANS DETAILS ====================
    SUBSCRIPTION_PLANS: Dict[str, Dict] = {
        "basic": {
            "id": "basic",
            "name": "Basic Premium",
            "description": "No ads, 1080p quality",
            "price_monthly": 4.99,
            "price_yearly": 49.99,
            "price_lifetime": 149.99,
            "features": [
                "No ads - ad-free experience",
                "1080p Full HD quality",
                "Download support",
                "2 devices simultaneously",
                "Priority email support"
            ],
            "popular": False
        },
        "pro": {
            "id": "pro",
            "name": "Pro Premium",
            "description": "4K quality, early access",
            "price_monthly": 9.99,
            "price_yearly": 99.99,
            "price_lifetime": 299.99,
            "features": [
                "No ads - completely ad-free",
                "4K Ultra HD quality",
                "Download support unlimited",
                "5 devices simultaneously",
                "Early access to new episodes",
                "Priority 24/7 support"
            ],
            "popular": True
        },
        "ultimate": {
            "id": "ultimate",
            "name": "Ultimate Premium",
            "description": "4K HDR, family sharing",
            "price_monthly": 14.99,
            "price_yearly": 149.99,
            "price_lifetime": 449.99,
            "features": [
                "No ads - completely ad-free",
                "4K HDR + Dolby Vision",
                "Dolby Atmos audio",
                "Download support unlimited",
                "10 devices simultaneously",
                "Early access to all content",
                "Exclusive premium content",
                "Priority 24/7 VIP support",
                "Family sharing up to 5 profiles"
            ],
            "popular": False
        },
        "family": {
            "id": "family",
            "name": "Family Plan",
            "description": "5 profiles, parental controls",
            "price_monthly": 19.99,
            "price_yearly": 199.99,
            "price_lifetime": 599.99,
            "features": [
                "All Ultimate features",
                "5 separate profiles",
                "Parental controls",
                "Kids mode",
                "Family sharing",
                "Profile PIN protection"
            ],
            "popular": False
        }
    }
    
    # ==================== PAYMENT METHODS ====================
    PAYMENT_METHODS: List[Dict] = [
        {
            "id": "credit_card",
            "name": "Credit / Debit Card",
            "icon": "fa-credit-card",
            "enabled": True,
            "countries": ["ALL"]
        },
        {
            "id": "paypal",
            "name": "PayPal",
            "icon": "fa-paypal",
            "enabled": True,
            "countries": ["US", "GB", "CA", "AU", "DE", "FR", "ES", "IT"]
        },
        {
            "id": "google_pay",
            "name": "Google Pay",
            "icon": "fa-google",
            "enabled": True,
            "countries": ["US", "GB", "CA", "AU", "DE", "FR", "ES", "IT", "IN"]
        },
        {
            "id": "apple_pay",
            "name": "Apple Pay",
            "icon": "fa-apple",
            "enabled": True,
            "countries": ["US", "GB", "CA", "AU", "FR", "ES", "IT"]
        },
        {
            "id": "crypto",
            "name": "Cryptocurrency",
            "icon": "fa-bitcoin",
            "enabled": False,
            "countries": ["ALL"]
        },
        {
            "id": "bank_transfer",
            "name": "Bank Transfer",
            "icon": "fa-university",
            "enabled": False,
            "countries": ["ALL"]
        },
        {
            "id": "upi",
            "name": "UPI",
            "icon": "fa-mobile-alt",
            "enabled": False,
            "countries": ["IN"]
        }
    ]
    
    # ==================== HELPER METHODS ====================
    
    @classmethod
    def get_plan_price(cls, plan_id: str, cycle: str = "monthly") -> float:
        """Get plan price for specific billing cycle"""
        plan = cls.PRICES.get(plan_id, {})
        return plan.get(cycle, 0.0)
    
    @classmethod
    def get_plan_details(cls, plan_id: str) -> Optional[Dict]:
        """Get plan details"""
        return cls.SUBSCRIPTION_PLANS.get(plan_id)
    
    @classmethod
    def get_all_plans(cls) -> Dict[str, Dict]:
        """Get all subscription plans"""
        return cls.SUBSCRIPTION_PLANS
    
    @classmethod
    def get_stripe_price_id(cls, plan_id: str, cycle: str = "monthly") -> str:
        """Get Stripe price ID for plan"""
        key = f"{plan_id}_{cycle}"
        return cls.STRIPE_PRICES.get(key, "")
    
    @classmethod
    def get_paypal_plan_id(cls, plan_id: str, cycle: str = "monthly") -> str:
        """Get PayPal plan ID"""
        key = f"{plan_id}_{cycle}"
        return cls.PAYPAL_PLANS.get(key, "")
    
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
    def get_tax_rate(cls, country_code: str) -> float:
        """Get tax rate for country"""
        country_tax = cls.TAX_COUNTRIES.get(country_code, {})
        return country_tax.get("rate", 0.0)
    
    @classmethod
    def calculate_tax(cls, amount: float, country_code: str) -> float:
        """Calculate tax for amount"""
        tax_rate = cls.get_tax_rate(country_code)
        tax_amount = amount * tax_rate
        return round(tax_amount, 2)
    
    @classmethod
    def calculate_total(cls, amount: float, country_code: str) -> float:
        """Calculate total including tax"""
        tax = cls.calculate_tax(amount, country_code)
        total = amount + tax
        return round(total, 2)
    
    @classmethod
    def is_payment_method_enabled(cls, method_id: str, country_code: str = "US") -> bool:
        """Check if payment method is enabled for country"""
        method = next((m for m in cls.PAYMENT_METHODS if m["id"] == method_id), None)
        if not method:
            return False
        
        if not method["enabled"]:
            return False
        
        countries = method.get("countries", [])
        if "ALL" in countries:
            return True
        
        return country_code in countries
    
    @classmethod
    def get_enabled_payment_methods(cls, country_code: str = "US") -> List[Dict]:
        """Get enabled payment methods for country"""
        return [
            m for m in cls.PAYMENT_METHODS
            if cls.is_payment_method_enabled(m["id"], country_code)
        ]
    
    @classmethod
    def get_stripe_config(cls) -> Dict[str, Any]:
        """Get Stripe configuration"""
        return {
            "enabled": cls.STRIPE_ENABLED,
            "public_key": cls.STRIPE_PUBLIC_KEY,
            "api_version": cls.STRIPE_API_VERSION,
            "webhook_events": cls.STRIPE_WEBHOOK_EVENTS
        }
    
    @classmethod
    def get_paypal_config(cls) -> Dict[str, Any]:
        """Get PayPal configuration"""
        return {
            "enabled": cls.PAYPAL_ENABLED,
            "mode": cls.PAYPAL_MODE,
            "api_url": cls.PAYPAL_API_URL
        }
    
    @classmethod
    def generate_promo_code(cls) -> str:
        """Generate a random promo code"""
        import random
        
        chars = cls.PROMO_CODE_CHARS
        random_part = ''.join(random.choices(chars, k=cls.PROMO_CODE_LENGTH))
        return f"{cls.PROMO_CODE_PREFIX}-{random_part}"
    
    @classmethod
    def generate_referral_code(cls) -> str:
        """Generate a random referral code"""
        import random
        import string
        
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=cls.REFERRAL_CODE_LENGTH))
    
    @classmethod
    def generate_gift_card_code(cls) -> str:
        """Generate a random gift card code"""
        import random
        import string
        
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=cls.GIFT_CARD_LENGTH))
        return f"{cls.GIFT_CARD_PREFIX}-{code}"
    
    @classmethod
    def get_invoice_number(cls, year: int, month: int, day: int, seq: int) -> str:
        """Generate invoice number"""
        return cls.INVOICE_NUMBER_FORMAT.format(
            prefix=cls.INVOICE_PREFIX,
            year=year,
            month=month,
            day=day,
            seq=seq
        )
    
    @classmethod
    def get_refund_deadline(cls, purchase_date) -> bool:
        """Check if refund is still available"""
        from datetime import datetime, timedelta
        
        if isinstance(purchase_date, str):
            from datetime import datetime
            purchase_date = datetime.fromisoformat(purchase_date)
        
        deadline = purchase_date + timedelta(days=cls.REFUND_AUTO_APPROVE_DAYS)
        return datetime.now() <= deadline


# Create payment config instance
payment_config = PaymentConfig()

# Print payment configuration status
print(f"💳 Payment Configuration")
print(f"   Currency: {payment_config.CURRENCY_SYMBOL}{payment_config.CURRENCY}")
print(f"   Tax Rate: {payment_config.TAX_RATE * 100}%")
print(f"   Stripe: {'Enabled' if payment_config.STRIPE_ENABLED else 'Disabled'}")
print(f"   PayPal: {'Enabled' if payment_config.PAYPAL_ENABLED else 'Disabled'}")
print(f"   Subscription Plans: {len(payment_config.get_all_plans())}")
print(f"   Payment Methods: {len(payment_config.get_enabled_payment_methods())}")
