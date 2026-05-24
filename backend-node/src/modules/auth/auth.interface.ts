/**
 * AnimeMultiFlix - Authentication Interfaces
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Document, Model } from 'mongoose';
import { Request } from 'express';
import { Socket } from 'socket.io';

// ==================== ENUMS ====================

export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ULTIMATE = 'ultimate',
    MODERATOR = 'moderator',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    OWNER = 'owner'
}

export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
    LOCKED = 'locked',
    DELETED = 'deleted'
}

export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    EXPIRED = 'expired',
    FAILED = 'failed'
}

export enum LoginMethod {
    PASSWORD = 'password',
    GOOGLE = 'google',
    DISCORD = 'discord',
    FACEBOOK = 'facebook',
    APPLE = 'apple',
    GITHUB = 'github',
    TWITTER = 'twitter',
    LINKEDIN = 'linkedin',
    TWITCH = 'twitch',
    REDDIT = 'reddit',
    PHONE = 'phone',
    MAGIC_LINK = 'magic_link',
    QR_CODE = 'qr_code'
}

export enum TwoFactorMethod {
    AUTHENTICATOR = 'authenticator',
    SMS = 'sms',
    EMAIL = 'email',
    BACKUP_CODE = 'backup_code'
}

export enum NotificationChannel {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    IN_APP = 'in_app'
}

// ==================== USER INTERFACES ====================

/**
 * User Preferences Interface
 */
export interface IUserPreferences {
    language: string;
    theme: 'dark' | 'light' | 'auto';
    timezone: string;
    dateFormat: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        inApp: boolean;
        marketing: boolean;
    };
    privacy: {
        showEmail: boolean;
        showPhone: boolean;
        showBirthday: boolean;
        showLocation: boolean;
        showLastSeen: boolean;
        showOnline: boolean;
        readReceipts: boolean;
        allowFriendRequests: boolean;
        allowMessages: 'everyone' | 'friends' | 'nobody';
    };
    playback: {
        defaultQuality: string;
        autoplayNext: boolean;
        skipIntro: boolean;
        skipOutro: boolean;
        defaultSubtitleLanguage: string;
        defaultAudioLanguage: string;
        volume: number;
        playbackSpeed: number;
    };
}

/**
 * User Watch Statistics Interface
 */
export interface IUserWatchStats {
    totalHours: number;
    totalEpisodes: number;
    totalAnime: number;
    completedAnime: number;
    droppedAnime: number;
    planningAnime: number;
    rewatchingAnime: number;
    averageRating: number;
    lastWatched: Date;
    streakDays: number;
    longestStreak: number;
    favoriteGenre: string;
    favoriteStudio: string;
}

/**
 * User Social Interface
 */
export interface IUserSocial {
    friends: string[];
    friendRequests: string[];
    blockedUsers: string[];
    following: string[];
    followers: string[];
    friendRequestCount: number;
    unreadMessages: number;
}

/**
 * User Document Interface (Database)
 */
export interface IUser extends Document {
    // Basic Information
    _id: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    cover?: string;
    bio?: string;
    birthday?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location?: string;
    website?: string;
    
    // Account Status
    role: UserRole;
    status: AccountStatus;
    isVerified: boolean;
    isActive: boolean;
    isPremium: boolean;
    premiumType?: 'basic' | 'pro' | 'ultimate' | 'family';
    premiumExpiry?: Date;
    premiumFeatures?: string[];
    
    // Verification
    verificationToken?: string;
    verificationExpiry?: Date;
    emailVerifiedAt?: Date;
    phoneVerifiedAt?: Date;
    
    // Password Reset
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    passwordChangedAt?: Date;
    previousPasswords: string[];
    
    // Two-Factor Authentication
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorTempSecret?: string;
    twoFactorMethod?: TwoFactorMethod;
    twoFactorPhone?: string;
    twoFactorEmail?: string;
    twoFactorBackupCodes: string[];
    
    // Social Logins
    googleId?: string;
    discordId?: string;
    facebookId?: string;
    appleId?: string;
    githubId?: string;
    twitterId?: string;
    linkedinId?: string;
    twitchId?: string;
    redditId?: string;
    
    // Preferences & Stats
    preferences: IUserPreferences;
    watchStats: IUserWatchStats;
    social: IUserSocial;
    
    // Collections
    watchlist: string[];
    favorites: string[];
    watchHistory: string[];
    playlists: string[];
    badges: string[];
    
    // Activity
    lastLogin: Date;
    lastLoginIP?: string;
    lastLoginDevice?: string;
    lastActive: Date;
    loginCount: number;
    loginAttempts: number;
    isLocked: boolean;
    lockUntil?: Date;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    
    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateVerificationToken(): string;
    generatePasswordResetToken(): string;
    incrementLoginCount(): Promise<void>;
    updateLastActive(): Promise<void>;
    addToWatchlist(animeId: string): Promise<void>;
    removeFromWatchlist(animeId: string): Promise<void>;
    addToFavorites(animeId: string): Promise<void>;
    removeFromFavorites(animeId: string): Promise<void>;
    updateWatchStats(episodeDuration: number): Promise<void>;
    isFollowing(userId: string): boolean;
    follow(userId: string): Promise<void>;
    unfollow(userId: string): Promise<void>;
    sendFriendRequest(userId: string): Promise<void>;
    acceptFriendRequest(userId: string): Promise<void>;
    rejectFriendRequest(userId: string): Promise<void>;
    blockUser(userId: string): Promise<void>;
    unblockUser(userId: string): Promise<void>;
}

/**
 * User Model Interface
 */
export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findActiveUsers(): Promise<IUser[]>;
    findPremiumUsers(): Promise<IUser[]>;
    findOnlineUsers(): Promise<IUser[]>;
    findBySocialId(provider: string, id: string): Promise<IUser | null>;
}

// ==================== TOKEN INTERFACES ====================

/**
 * JWT Token Payload Interface
 */
export interface ITokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    sessionId?: string;
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
    jti?: string;
}

/**
 * Refresh Token Payload Interface
 */
export interface IRefreshTokenPayload {
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
export interface IVerificationTokenPayload {
    userId: string;
    email: string;
    type: 'verification' | 'password_reset' | 'email_change';
    exp?: number;
}

/**
 * Magic Link Token Payload
 */
export interface IMagicLinkPayload {
    email: string;
    type: 'magic_link';
    redirectUrl?: string;
    exp?: number;
}

// ==================== REQUEST/RESPONSE INTERFACES ====================

/**
 * Register Request Interface
 */
export interface IRegisterRequest {
    username: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
    acceptTerms: boolean;
    acceptPrivacy: boolean;
}

/**
 * Login Request Interface
 */
export interface ILoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
    twoFactorToken?: string;
}

/**
 * Social Login Request Interface
 */
export interface ISocialLoginRequest {
    provider: string;
    accessToken: string;
    providerUserId?: string;
    email?: string;
    name?: string;
    avatar?: string;
}

/**
 * Refresh Token Request Interface
 */
export interface IRefreshTokenRequest {
    refreshToken: string;
}

/**
 * Forgot Password Request Interface
 */
export interface IForgotPasswordRequest {
    email: string;
}

/**
 * Reset Password Request Interface
 */
export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Change Password Request Interface
 */
export interface IChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Update Profile Request Interface
 */
export interface IUpdateProfileRequest {
    username?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    cover?: string;
    birthday?: string;
    gender?: string;
    location?: string;
    website?: string;
}

/**
 * User Response Interface (Safe)
 */
export interface IUserResponse {
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
    premiumType?: string;
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
        streakDays: number;
    };
    social: {
        friendsCount: number;
        followersCount: number;
        followingCount: number;
    };
    preferences: IUserPreferences;
}

/**
 * Auth Response Interface
 */
export interface IAuthResponse {
    user: IUserResponse;
    token: string;
    refreshToken: string;
    tokenExpiry: number;
    expiresIn: number;
    requiresTwoFactor?: boolean;
    twoFactorSessionId?: string;
}

/**
 * Two-Factor Setup Response Interface
 */
export interface ITwoFactorSetupResponse {
    qrCode: string;
    secret: string;
    backupCodes: string[];
    method: TwoFactorMethod;
}

// ==================== DEVICE & SESSION INTERFACES ====================

/**
 * Device Information Interface
 */
export interface IDeviceInfo {
    fingerprint: string;
    browser: string;
    browserVersion?: string;
    os: string;
    osVersion?: string;
    device: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'tv' | 'console';
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
}

/**
 * Session Interface
 */
export interface ISession {
    id: string;
    userId: string;
    deviceInfo: IDeviceInfo;
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
 * Login History Entry Interface
 */
export interface ILoginHistoryEntry {
    id: string;
    userId: string;
    timestamp: Date;
    ip: string;
    deviceInfo: IDeviceInfo;
    method: LoginMethod;
    success: boolean;
    failureReason?: string;
    location?: {
        country?: string;
        city?: string;
    };
}

// ==================== EVENT INTERFACES ====================

/**
 * User Registered Event Interface
 */
export interface IUserRegisteredEvent {
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
 * User Login Event Interface
 */
export interface IUserLoginEvent {
    userId: string;
    email: string;
    username: string;
    method: LoginMethod;
    ip: string;
    userAgent: string;
    deviceInfo: IDeviceInfo;
    success: boolean;
    failureReason?: string;
    timestamp: Date;
}

/**
 * Password Changed Event Interface
 */
export interface IPasswordChangedEvent {
    userId: string;
    email: string;
    username: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
}

/**
 * Account Locked Event Interface
 */
export interface IAccountLockedEvent {
    userId: string;
    email: string;
    username: string;
    attempts: number;
    lockUntil: Date;
    ip?: string;
    timestamp: Date;
}

// ==================== SERVICE INTERFACES ====================

/**
 * Auth Service Interface
 */
export interface IAuthService {
    generateToken(user: IUser): string;
    generateRefreshToken(user: IUser): string;
    verifyToken(token: string): ITokenPayload | null;
    verifyRefreshToken(token: string): IRefreshTokenPayload | null;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generate2FASecret(email: string): { secret: string; qrCode: string };
    verify2FAToken(secret: string, token: string): boolean;
    createSession(userId: string, deviceInfo: IDeviceInfo): Promise<string>;
    getSession(sessionId: string): Promise<ISession | null>;
    deleteSession(sessionId: string): Promise<void>;
    blacklistToken(token: string): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
}

// ==================== MIDDLEWARE INTERFACES ====================

/**
 * Authenticated Request Interface
 */
export interface IAuthenticatedRequest extends Request {
    user?: IUserResponse;
    token?: string;
    sessionId?: string;
    deviceInfo?: IDeviceInfo;
}

/**
 * Authenticated Socket Interface
 */
export interface IAuthenticatedSocket extends Socket {
    user?: IUserResponse;
    token?: string;
    sessionId?: string;
}

// ==================== REPOSITORY INTERFACES ====================

/**
 * User Repository Interface
 */
export interface IUserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    update(id: string, updates: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
    findActiveUsers(): Promise<IUser[]>;
    findPremiumUsers(): Promise<IUser[]>;
    updateLastActive(id: string): Promise<void>;
    incrementLoginCount(id: string): Promise<void>;
}

// ==================== CONFIGURATION INTERFACES ====================

/**
 * Auth Configuration Interface
 */
export interface IAuthConfig {
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
        issuer: string;
        audience: string;
    };
    bcrypt: {
        saltRounds: number;
    };
    rateLimit: {
        login: { max: number; windowMs: number };
        register: { max: number; windowMs: number };
        verify: { max: number; windowMs: number };
    };
    session: {
        maxAge: number;
        refreshInterval: number;
    };
    twoFactor: {
        enabled: boolean;
        issuer: string;
        algorithm: string;
        digits: number;
        period: number;
    };
}

// ==================== EXPORT ====================

export default {
    UserRole,
    AccountStatus,
    VerificationStatus,
    LoginMethod,
    TwoFactorMethod,
    NotificationChannel
};
