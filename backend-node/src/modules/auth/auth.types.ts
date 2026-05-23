/**
 * AnimeMultiFlix - Authentication Types
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

// ==================== ENUMS ====================

/**
 * User Role Enumeration
 */
export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ULTIMATE = 'ultimate',
    MODERATOR = 'moderator',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    OWNER = 'owner'
}

/**
 * Premium Plan Types
 */
export enum PremiumType {
    BASIC = 'basic',
    PRO = 'pro',
    ULTIMATE = 'ultimate',
    FAMILY = 'family',
    STUDENT = 'student',
    LIFETIME = 'lifetime'
}

/**
 * Theme Options
 */
export enum Theme {
    DARK = 'dark',
    LIGHT = 'light',
    AUTO = 'auto'
}

/**
 * Two-Factor Authentication Methods
 */
export enum TwoFAMethod {
    AUTHENTICATOR = 'authenticator',
    SMS = 'sms',
    EMAIL = 'email'
}

/**
 * Account Status
 */
export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
    LOCKED = 'locked',
    DELETED = 'deleted'
}

/**
 * Verification Status
 */
export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    EXPIRED = 'expired',
    FAILED = 'failed'
}

/**
 * Notification Type
 */
export enum NotificationType {
    EMAIL = 'email',
    PUSH = 'push',
    SMS = 'sms',
    IN_APP = 'inApp'
}

/**
 * Login Method
 */
export enum LoginMethod {
    PASSWORD = 'password',
    GOOGLE = 'google',
    DISCORD = 'discord',
    FACEBOOK = 'facebook',
    APPLE = 'apple',
    GITHUB = 'github',
    TWITTER = 'twitter',
    PHONE = 'phone',
    MAGIC_LINK = 'magic_link'
}

// ==================== TOKEN PAYLOADS ====================

/**
 * JWT Token Payload
 */
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    sessionId?: string;
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
}

/**
 * Refresh Token Payload
 */
export interface RefreshTokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    tokenId: string;
    iat?: number;
    exp?: number;
}

/**
 * Email Verification Token Payload
 */
export interface EmailVerificationPayload {
    userId: string;
    email: string;
    type: 'verification';
    exp?: number;
}

/**
 * Password Reset Token Payload
 */
export interface PasswordResetPayload {
    userId: string;
    email: string;
    type: 'reset';
    exp?: number;
}

/**
 * Magic Link Token Payload
 */
export interface MagicLinkPayload {
    email: string;
    type: 'magic_link';
    redirectUrl?: string;
    exp?: number;
}

// ==================== DEVICE & SESSION ====================

/**
 * Device Information
 */
export interface DeviceInfo {
    fingerprint: string;
    browser: string;
    browserVersion?: string;
    os: string;
    osVersion?: string;
    device: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'tv' | 'console' | 'unknown';
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isBot: boolean;
    isTV: boolean;
    isConsole: boolean;
    userAgent: string;
    ip?: string;
    language?: string;
    screenResolution?: string;
    timezone?: string;
    platform?: string;
    engine?: string;
    engineVersion?: string;
}

/**
 * Session Information
 */
export interface Session {
    id: string;
    userId: string;
    deviceInfo: DeviceInfo;
    createdAt: Date;
    lastActive: Date;
    expiresAt: Date;
    isActive: boolean;
    ip?: string;
    location?: {
        country?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
    };
}

/**
 * Login History Entry
 */
export interface LoginHistoryEntry {
    id: string;
    userId: string;
    timestamp: Date;
    ip: string;
    deviceInfo: DeviceInfo;
    method: LoginMethod;
    success: boolean;
    failureReason?: string;
    location?: {
        country?: string;
        city?: string;
    };
}

// ==================== REQUEST DTOs ====================

/**
 * Register Request
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
    acceptTerms: boolean;
    acceptPrivacy: boolean;
}

/**
 * Login Request
 */
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
    twoFactorToken?: string;
}

/**
 * Social Login Request
 */
export interface SocialLoginRequest {
    provider: string;
    accessToken: string;
    providerUserId?: string;
    email?: string;
    name?: string;
    avatar?: string;
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Verify Email Request
 */
export interface VerifyEmailRequest {
    token: string;
}

/**
 * Resend Verification Request
 */
export interface ResendVerificationRequest {
    email: string;
}

/**
 * Forgot Password Request
 */
export interface ForgotPasswordRequest {
    email: string;
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Enable 2FA Request
 */
export interface Enable2FARequest {
    method: TwoFAMethod;
    phone?: string;
}

/**
 * Verify 2FA Request
 */
export interface Verify2FARequest {
    token: string;
    method?: TwoFAMethod;
}

/**
 * Disable 2FA Request
 */
export interface Disable2FARequest {
    token: string;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
    username?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    cover?: string;
    birthday?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location?: string;
    website?: string;
}

/**
 * Update Preferences Request
 */
export interface UpdatePreferencesRequest {
    language?: string;
    theme?: Theme;
    notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        inApp?: boolean;
        marketing?: boolean;
    };
    privacy?: {
        showEmail?: boolean;
        showPhone?: boolean;
        showBirthday?: boolean;
        showLocation?: boolean;
        showLastSeen?: boolean;
        showOnline?: boolean;
        readReceipts?: boolean;
        allowFriendRequests?: boolean;
        allowMessages?: boolean;
    };
    playback?: {
        defaultQuality?: string;
        autoplayNext?: boolean;
        skipIntro?: boolean;
        skipOutro?: boolean;
        defaultSubtitleLanguage?: string;
        defaultAudioLanguage?: string;
        volume?: number;
        playbackSpeed?: number;
    };
}

// ==================== RESPONSE DTOs ====================

/**
 * User Response (Safe - No Sensitive Data)
 */
export interface UserResponse {
    id: string;
    username: string;
    email: string;
    phone?: string;
    avatar?: string;
    cover?: string;
    bio?: string;
    birthday?: string;
    gender?: string;
    location?: string;
    website?: string;
    role: UserRole;
    isVerified: boolean;
    isPremium: boolean;
    premiumType?: PremiumType;
    premiumExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
    lastActive: Date;
    isOnline: boolean;
    watchStats: {
        totalHours: number;
        totalEpisodes: number;
        totalAnime: number;
        completedAnime: number;
        droppedAnime: number;
        planningAnime: number;
        rewatchingAnime: number;
        averageRating: number;
        streakDays: number;
    };
    social: {
        friendsCount: number;
        followersCount: number;
        followingCount: number;
    };
    badges: string[];
    preferences: {
        language: string;
        theme: Theme;
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
            inApp: boolean;
        };
        privacy: {
            showEmail: boolean;
            showLastSeen: boolean;
            showOnline: boolean;
            readReceipts: boolean;
            allowFriendRequests: boolean;
        };
        playback: {
            defaultQuality: string;
            autoplayNext: boolean;
            skipIntro: boolean;
            skipOutro: boolean;
            defaultSubtitleLanguage: string;
            defaultAudioLanguage: string;
        };
    };
}

/**
 * Authentication Response
 */
export interface AuthResponse {
    user: UserResponse;
    token: string;
    refreshToken: string;
    tokenExpiry: number;
    expiresIn: number;
}

/**
 * Token Refresh Response
 */
export interface TokenRefreshResponse {
    token: string;
    expiresIn: number;
}

/**
 * Two-Factor Setup Response
 */
export interface TwoFASetupResponse {
    qrCode: string;
    secret: string;
    backupCodes: string[];
    method: TwoFAMethod;
}

/**
 * Verification Response
 */
export interface VerificationResponse {
    message: string;
    success: boolean;
    requiresTwoFactor?: boolean;
    redirectUrl?: string;
}

/**
 * Magic Link Response
 */
export interface MagicLinkResponse {
    message: string;
    sent: boolean;
    email: string;
}

/**
 * Session Response
 */
export interface SessionResponse {
    sessions: Session[];
    currentSessionId?: string;
}

/**
 * Login History Response
 */
export interface LoginHistoryResponse {
    logins: LoginHistoryEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ==================== ERROR RESPONSES ====================

/**
 * Validation Error
 */
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
    code?: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    errors?: ValidationError[];
    code?: number;
    status?: number;
    timestamp?: string;
    path?: string;
}

/**
 * Rate Limit Error Response
 */
export interface RateLimitErrorResponse {
    success: false;
    message: string;
    retryAfter: number;
    limit: number;
    remaining: number;
}

/**
 * Account Locked Error Response
 */
export interface AccountLockedErrorResponse {
    success: false;
    message: string;
    lockUntil: Date;
    attemptsRemaining?: number;
    unlockTime?: string;
}

/**
 * TwoFactorRequired Response
 */
export interface TwoFactorRequiredResponse {
    success: false;
    message: string;
    requiresTwoFactor: true;
    sessionId: string;
    methods: TwoFAMethod[];
}

// ==================== EVENT TYPES ====================

/**
 * User Registered Event
 */
export interface UserRegisteredEvent {
    userId: string;
    email: string;
    username: string;
    verificationToken: string;
    ip?: string;
    userAgent?: string;
    referralCode?: string;
    timestamp: Date;
}

/**
 * User Verified Event
 */
export interface UserVerifiedEvent {
    userId: string;
    email: string;
    username: string;
    timestamp: Date;
}

/**
 * User Login Event
 */
export interface UserLoginEvent {
    userId: string;
    email: string;
    username: string;
    method: LoginMethod;
    ip: string;
    userAgent: string;
    deviceInfo: DeviceInfo;
    success: boolean;
    failureReason?: string;
    timestamp: Date;
}

/**
 * Password Changed Event
 */
export interface PasswordChangedEvent {
    userId: string;
    email: string;
    username: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
}

/**
 * TwoFactorEnabled Event
 */
export interface TwoFactorEnabledEvent {
    userId: string;
    email: string;
    username: string;
    method: TwoFAMethod;
    timestamp: Date;
}

/**
 * TwoFactorDisabled Event
 */
export interface TwoFactorDisabledEvent {
    userId: string;
    email: string;
    username: string;
    method: TwoFAMethod;
    timestamp: Date;
}

/**
 * Account Locked Event
 */
export interface AccountLockedEvent {
    userId: string;
    email: string;
    username: string;
    attempts: number;
    lockUntil: Date;
    ip?: string;
    timestamp: Date;
}

/**
 * Account Unlocked Event
 */
export interface AccountUnlockedEvent {
    userId: string;
    email: string;
    username: string;
    ip?: string;
    timestamp: Date;
}

/**
 * Profile Updated Event
 */
export interface ProfileUpdatedEvent {
    userId: string;
    email: string;
    username: string;
    changes: Record<string, any>;
    timestamp: Date;
}

/**
 * Account Deleted Event
 */
export interface AccountDeletedEvent {
    userId: string;
    email: string;
    username: string;
    reason?: string;
    timestamp: Date;
}

// ==================== DATABASE DOCUMENT TYPES ====================

/**
 * User Document (Database)
 */
export interface UserDocument {
    _id: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    cover?: string;
    bio?: string;
    birthday?: Date;
    gender?: string;
    location?: string;
    website?: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    isPremium: boolean;
    premiumType?: PremiumType;
    premiumExpiry?: Date;
    verificationToken?: string;
    verificationExpiry?: Date;
    emailVerifiedAt?: Date;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    passwordChangedAt?: Date;
    previousPasswords: string[];
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorTempSecret?: string;
    twoFactorBackupCodes?: string[];
    twoFactorMethod?: TwoFAMethod;
    twoFactorPhone?: string;
    googleId?: string;
    discordId?: string;
    facebookId?: string;
    appleId?: string;
    githubId?: string;
    twitterId?: string;
    preferences: any;
    watchStats: any;
    social: any;
    watchlist: string[];
    favorites: string[];
    watchHistory: string[];
    playlists: string[];
    badges: string[];
    lastLogin: Date;
    lastLoginIP?: string;
    lastLoginDevice?: string;
    lastActive: Date;
    loginCount: number;
    loginAttempts: number;
    isLocked: boolean;
    lockUntil?: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== HELPER TYPES ====================

/**
 * Pagination Options
 */
export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Filter Options
 */
export interface FilterOptions {
    search?: string;
    role?: UserRole;
    isVerified?: boolean;
    isPremium?: boolean;
    isActive?: boolean;
    fromDate?: Date;
    toDate?: Date;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Token Options
 */
export interface TokenOptions {
    expiresIn?: number | string;
    issuer?: string;
    audience?: string;
    subject?: string;
}

/**
 * Email Options
 */
export interface EmailOptions {
    to: string | string[];
    subject: string;
    template?: string;
    data?: Record<string, any>;
    attachments?: Array<{
        filename: string;
        content?: string;
        path?: string;
        contentType?: string;
    }>;
}

/**
 * SMS Options
 */
export interface SMSOptions {
    to: string;
    message: string;
    type?: 'otp' | 'verification' | 'notification' | 'alert';
}

// ==================== EXPRESS EXTENSIONS ====================

/**
 * Express Request with User
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserResponse;
            token?: string;
            sessionId?: string;
            deviceInfo?: DeviceInfo;
        }
    }
}

// ==================== EXPORT ====================

export default {
    UserRole,
    PremiumType,
    Theme,
    TwoFAMethod,
    AccountStatus,
    VerificationStatus,
    NotificationType,
    LoginMethod
};
