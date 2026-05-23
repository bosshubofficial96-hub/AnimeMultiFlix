/**
 * AnimeMultiFlix - Authentication Constants
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

// ==================== TOKEN CONFIGURATION ====================

export const TOKEN_CONFIG = {
    // JWT Tokens
    ACCESS_TOKEN: {
        EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
        EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
        EXPIRY_STRING: '7d'
    },
    REFRESH_TOKEN: {
        EXPIRY: 30 * 24 * 60 * 60, // 30 days
        EXPIRY_MS: 30 * 24 * 60 * 60 * 1000,
        EXPIRY_STRING: '30d'
    },
    VERIFICATION_TOKEN: {
        EXPIRY: 24 * 60 * 60, // 24 hours
        EXPIRY_MS: 24 * 60 * 60 * 1000
    },
    PASSWORD_RESET_TOKEN: {
        EXPIRY: 1 * 60 * 60, // 1 hour
        EXPIRY_MS: 1 * 60 * 60 * 1000
    },
    MAGIC_LINK_TOKEN: {
        EXPIRY: 15 * 60, // 15 minutes
        EXPIRY_MS: 15 * 60 * 1000
    },
    OTP_TOKEN: {
        EXPIRY: 10 * 60, // 10 minutes
        EXPIRY_MS: 10 * 60 * 1000
    },
    SESSION_TOKEN: {
        EXPIRY: 7 * 24 * 60 * 60, // 7 days
        EXPIRY_MS: 7 * 24 * 60 * 60 * 1000
    }
};

// ==================== RATE LIMITS ====================

export const RATE_LIMITS = {
    LOGIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 15 * 60, // 15 minutes
        WINDOW_MS: 15 * 60 * 1000
    },
    REGISTER: {
        MAX_ATTEMPTS: 3,
        WINDOW_SECONDS: 60 * 60, // 1 hour
        WINDOW_MS: 60 * 60 * 1000
    },
    VERIFICATION: {
        MAX_ATTEMPTS: 3,
        WINDOW_SECONDS: 60 * 60, // 1 hour
        WINDOW_MS: 60 * 60 * 1000
    },
    PASSWORD_RESET: {
        MAX_ATTEMPTS: 3,
        WINDOW_SECONDS: 60 * 60, // 1 hour
        WINDOW_MS: 60 * 60 * 1000
    },
    OTP: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60 * 60, // 1 hour
        WINDOW_MS: 60 * 60 * 1000
    },
    API: {
        MAX_REQUESTS: 100,
        WINDOW_SECONDS: 60, // 1 minute
        WINDOW_MS: 60 * 1000
    }
};

// ==================== PASSWORD POLICY ====================

export const PASSWORD_POLICY = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true,
    SPECIAL_CHARS: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    HISTORY_COUNT: 5, // Remember last 5 passwords
    EXPIRY_DAYS: 90, // Password expires after 90 days
    PREVENT_COMMON: true,
    PREVENT_USERNAME: true,
    PREVENT_EMAIL: true
};

// ==================== ACCOUNT LOCKOUT ====================

export const ACCOUNT_LOCKOUT = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60, // 30 minutes in seconds
    LOCKOUT_DURATION_MS: 30 * 60 * 1000,
    RESET_AFTER: 15 * 60, // Reset attempts after 15 minutes
    NOTIFY_ON_LOCK: true,
    NOTIFY_ON_UNLOCK: true
};

// ==================== TWO-FACTOR AUTHENTICATION ====================

export const TWO_FACTOR_CONFIG = {
    ENABLED: true,
    METHODS: ['authenticator', 'sms', 'email'] as const,
    BACKUP_CODES_COUNT: 10,
    BACKUP_CODE_LENGTH: 8,
    TOTP: {
        ISSUER: 'AnimeMultiFlix',
        ALGORITHM: 'SHA1',
        DIGITS: 6,
        PERIOD: 30,
        WINDOW: 1
    },
    SMS: {
        RESEND_COOLDOWN: 60, // seconds
        MAX_ATTEMPTS: 3
    },
    EMAIL: {
        RESEND_COOLDOWN: 60, // seconds
        MAX_ATTEMPTS: 3
    }
};

// ==================== SESSION CONFIGURATION ====================

export const SESSION_CONFIG = {
    MAX_CONCURRENT_SESSIONS: 5,
    SESSION_IDLE_TIMEOUT: 30 * 60, // 30 minutes
    SESSION_ABSOLUTE_TIMEOUT: 12 * 60 * 60, // 12 hours
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60, // 30 days
    CLEANUP_INTERVAL: 60 * 60, // 1 hour
    MAX_DEVICES_PER_USER: 20
};

// ==================== OTP CONFIGURATION ====================

export const OTP_CONFIG = {
    LENGTH: 6,
    EXPIRY_SECONDS: 10 * 60, // 10 minutes
    MAX_ATTEMPTS: 3,
    RESEND_COOLDOWN: 60, // seconds
    METHODS: ['email', 'sms'] as const,
    RESEND_LIMIT: 5, // Max resends per hour
    BLOCK_AFTER_FAILED: 5
};

// ==================== SOCIAL LOGIN ====================

export const SOCIAL_LOGIN_CONFIG = {
    ENABLED_PROVIDERS: [
        'google',
        'discord',
        'facebook',
        'apple',
        'github',
        'twitter',
        'linkedin',
        'twitch',
        'reddit'
    ],
    AUTO_CREATE_USER: true,
    LINK_ACCOUNTS: true,
    ALLOW_MULTIPLE: true,
    MERGE_ACCOUNTS: true
};

// ==================== OAUTH PROVIDER URLS ====================

export const OAUTH_URLS = {
    GOOGLE: {
        AUTHORIZATION: 'https://accounts.google.com/o/oauth2/v2/auth',
        TOKEN: 'https://oauth2.googleapis.com/token',
        USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo'
    },
    DISCORD: {
        AUTHORIZATION: 'https://discord.com/api/oauth2/authorize',
        TOKEN: 'https://discord.com/api/oauth2/token',
        USERINFO: 'https://discord.com/api/users/@me'
    },
    FACEBOOK: {
        AUTHORIZATION: 'https://www.facebook.com/v18.0/dialog/oauth',
        TOKEN: 'https://graph.facebook.com/v18.0/oauth/access_token',
        USERINFO: 'https://graph.facebook.com/me'
    },
    APPLE: {
        AUTHORIZATION: 'https://appleid.apple.com/auth/authorize',
        TOKEN: 'https://appleid.apple.com/auth/token',
        USERINFO: 'https://appleid.apple.com/auth/token'
    },
    GITHUB: {
        AUTHORIZATION: 'https://github.com/login/oauth/authorize',
        TOKEN: 'https://github.com/login/oauth/access_token',
        USERINFO: 'https://api.github.com/user'
    }
};

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
    // Auth Errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked. Please try again later',
    ACCOUNT_NOT_VERIFIED: 'Please verify your email address',
    ACCOUNT_INACTIVE: 'Account is inactive. Please contact support',
    ACCOUNT_DELETED: 'Account has been deleted',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_MISSING: 'Token is required',
    
    // Registration Errors
    EMAIL_EXISTS: 'Email is already registered',
    USERNAME_EXISTS: 'Username is already taken',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_USERNAME: 'Invalid username format',
    TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
    
    // 2FA Errors
    TWO_FACTOR_REQUIRED: 'Two-factor authentication is required',
    TWO_FACTOR_INVALID: 'Invalid two-factor authentication code',
    TWO_FACTOR_NOT_ENABLED: 'Two-factor authentication is not enabled',
    
    // Rate Limit Errors
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
    LOGIN_ATTEMPTS_EXCEEDED: 'Too many login attempts. Account temporarily locked',
    
    // Session Errors
    SESSION_EXPIRED: 'Session has expired. Please login again',
    SESSION_INVALID: 'Invalid session',
    MAX_SESSIONS_REACHED: 'Maximum concurrent sessions reached'
};

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful. Please verify your email',
    VERIFICATION_SENT: 'Verification email sent',
    VERIFICATION_SUCCESS: 'Email verified successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    TWO_FACTOR_ENABLED: 'Two-factor authentication enabled',
    TWO_FACTOR_DISABLED: 'Two-factor authentication disabled',
    PROFILE_UPDATED: 'Profile updated successfully',
    ACCOUNT_DELETED: 'Account deleted successfully'
};

// ==================== ROLE PERMISSIONS ====================

export const ROLE_PERMISSIONS = {
    user: [
        'read:profile',
        'update:profile',
        'read:anime',
        'watch:anime',
        'comment:anime',
        'rate:anime',
        'create:playlist',
        'join:group',
        'send:message',
        'join:voice'
    ],
    premium: [
        ...ROLE_PERMISSIONS.user,
        'download:anime',
        'watch:premium',
        'create:group',
        'host:watch_party',
        'voice:hd'
    ],
    ultimate: [
        ...ROLE_PERMISSIONS.premium,
        'watch:ultimate',
        'create:unlimited_groups',
        'voice:ultra_hd',
        'early:access',
        'exclusive:content'
    ],
    moderator: [
        ...ROLE_PERMISSIONS.user,
        'moderate:comments',
        'moderate:reports',
        'manage:groups',
        'view:analytics'
    ],
    admin: [
        ...ROLE_PERMISSIONS.moderator,
        'manage:users',
        'manage:anime',
        'manage:premium',
        'view:all_data',
        'manage:admins'
    ],
    super_admin: [
        ...ROLE_PERMISSIONS.admin,
        'manage:system',
        'manage:backups',
        'view:audit_logs',
        'manage:settings'
    ],
    owner: [
        '*'
    ]
};

// ==================== AUTH COOKIE OPTIONS ====================

export const COOKIE_OPTIONS = {
    ACCESS_TOKEN: {
        name: 'access_token',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY_MS,
        path: '/'
    },
    REFRESH_TOKEN: {
        name: 'refresh_token',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY_MS,
        path: '/api/auth/refresh'
    },
    SESSION: {
        name: 'session_id',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: SESSION_CONFIG.REMEMBER_ME_DURATION * 1000,
        path: '/'
    }
};

// ==================== CACHE KEYS ====================

export const CACHE_KEYS = {
    USER_SESSION: (userId: string) => `user:session:${userId}`,
    USER_DEVICES: (userId: string) => `user:devices:${userId}`,
    USER_PREMIUM: (userId: string) => `user:premium:${userId}`,
    USER_PERMISSIONS: (userId: string) => `user:permissions:${userId}`,
    TOKEN_BLACKLIST: (token: string) => `token:blacklist:${token}`,
    OTP_CODE: (identifier: string) => `otp:${identifier}`,
    RATE_LIMIT: (action: string, identifier: string) => `ratelimit:${action}:${identifier}`,
    ACCOUNT_LOCK: (identifier: string) => `lock:${identifier}`
};

// ==================== EXTERNAL API ENDPOINTS ====================

export const EXTERNAL_APIS = {
    IP_GEOLOCATION: 'https://ipapi.co/{ip}/json/',
    EMAIL_VALIDATION: 'https://api.hunter.io/v2/email-verifier',
    PHONE_VALIDATION: 'https://api.numverify.com/validate'
};

// ==================== EXPORT ====================

export default {
    TOKEN_CONFIG,
    RATE_LIMITS,
    PASSWORD_POLICY,
    ACCOUNT_LOCKOUT,
    TWO_FACTOR_CONFIG,
    SESSION_CONFIG,
    OTP_CONFIG,
    SOCIAL_LOGIN_CONFIG,
    OAUTH_URLS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROLE_PERMISSIONS,
    COOKIE_OPTIONS,
    CACHE_KEYS,
    EXTERNAL_APIS
};
