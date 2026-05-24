/**
 * AnimeMultiFlix - User Types
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

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

export enum PremiumType {
    BASIC = 'basic',
    PRO = 'pro',
    ULTIMATE = 'ultimate',
    FAMILY = 'family',
    STUDENT = 'student',
    LIFETIME = 'lifetime'
}

export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
    LOCKED = 'locked',
    DELETED = 'deleted'
}

export enum Theme {
    DARK = 'dark',
    LIGHT = 'light',
    AUTO = 'auto'
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// ==================== INTERFACES ====================

/**
 * User Preferences Interface
 */
export interface IUserPreferences {
    language: string;
    theme: Theme;
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
}

/**
 * Watch History Entry Interface
 */
export interface IWatchHistoryEntry {
    animeId: string;
    episodeId: string;
    progress: number;
    duration: number;
    watchedAt: Date;
}

// ==================== REQUEST INTERFACES ====================

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
    gender?: Gender;
    location?: string;
    website?: string;
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
 * Delete Account Request Interface
 */
export interface IDeleteAccountRequest {
    password: string;
    reason?: string;
}

// ==================== RESPONSE INTERFACES ====================

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
    birthday?: Date;
    gender?: Gender;
    location?: string;
    website?: string;
    role: UserRole;
    status: AccountStatus;
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
 * User Statistics Response Interface
 */
export interface IUserStatsResponse {
    watchStats: IUserWatchStats;
    loginCount: number;
    memberSince: Date;
    lastActive: Date;
    accountAge: number;
}

// ==================== QUERY INTERFACES ====================

/**
 * Search Users Query Interface
 */
export interface ISearchUsersQuery {
    q: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Get Users Query Interface
 */
export interface IGetUsersQuery {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    role?: UserRole;
    isPremium?: boolean;
    isVerified?: boolean;
}

// ==================== EXPORT ====================

export default {
    UserRole,
    PremiumType,
    AccountStatus,
    Theme,
    Gender
};
