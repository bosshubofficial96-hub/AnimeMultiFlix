/**
 * AnimeMultiFlix - User DTO (Data Transfer Objects)
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { 
    IUserResponse, 
    IUserStatsResponse, 
    IUserPreferences,
    IUserWatchStats,
    UserRole,
    PremiumType,
    AccountStatus,
    Theme,
    Gender
} from './user.types';

// ==================== REQUEST DTOs ====================

/**
 * Update Profile Request DTO
 */
export interface UpdateProfileRequestDto {
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
 * Change Password Request DTO
 */
export interface ChangePasswordRequestDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Delete Account Request DTO
 */
export interface DeleteAccountRequestDto {
    password: string;
    reason?: string;
}

/**
 * Update Settings Request DTO
 */
export interface UpdateSettingsRequestDto {
    language?: string;
    theme?: Theme;
    timezone?: string;
    dateFormat?: string;
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
        allowMessages?: 'everyone' | 'friends' | 'nobody';
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

/**
 * Search Users Query DTO
 */
export interface SearchUsersQueryDto {
    q: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE DTOs ====================

/**
 * User Response DTO
 */
export interface UserResponseDto {
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
 * User Statistics Response DTO
 */
export interface UserStatsResponseDto {
    watchStats: IUserWatchStats;
    loginCount: number;
    memberSince: Date;
    lastActive: Date;
    accountAge: number;
    totalHoursDisplay: string;
}

/**
 * User Settings Response DTO
 */
export interface UserSettingsResponseDto {
    preferences: IUserPreferences;
}

/**
 * Watchlist Response DTO
 */
export interface WatchlistResponseDto {
    data: any[];
    count: number;
}

/**
 * Favorites Response DTO
 */
export interface FavoritesResponseDto {
    data: any[];
    count: number;
}

/**
 * Watch History Response DTO
 */
export interface WatchHistoryResponseDto {
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Search Users Response DTO
 */
export interface SearchUsersResponseDto {
    data: IUserResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert User document to UserResponseDto
 */
export function toUserResponse(user: any): UserResponseDto {
    const totalHours = Math.floor(user.watchStats?.totalHours || 0);
    const totalMinutes = Math.floor(((user.watchStats?.totalHours || 0) - totalHours) * 60);

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        cover: user.cover,
        bio: user.bio,
        birthday: user.birthday,
        gender: user.gender,
        location: user.location,
        website: user.website,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumExpiry: user.premiumExpiry,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastActive: user.lastActive,
        isOnline: false, // Will be set by service
        watchStats: {
            totalHours: user.watchStats?.totalHours || 0,
            totalEpisodes: user.watchStats?.totalEpisodes || 0,
            totalAnime: user.watchStats?.totalAnime || 0,
            completedAnime: user.watchStats?.completedAnime || 0,
            streakDays: user.watchStats?.streakDays || 0
        },
        social: {
            friendsCount: user.social?.friends?.length || 0,
            followersCount: user.social?.followers?.length || 0,
            followingCount: user.social?.following?.length || 0
        },
        preferences: user.preferences || {
            language: 'en',
            theme: Theme.DARK,
            timezone: 'Asia/Tokyo',
            dateFormat: 'YYYY-MM-DD',
            notifications: {
                email: true,
                push: true,
                sms: false,
                inApp: true,
                marketing: false
            },
            privacy: {
                showEmail: false,
                showPhone: false,
                showBirthday: false,
                showLocation: false,
                showLastSeen: true,
                showOnline: true,
                readReceipts: true,
                allowFriendRequests: true,
                allowMessages: 'everyone'
            },
            playback: {
                defaultQuality: 'auto',
                autoplayNext: true,
                skipIntro: true,
                skipOutro: true,
                defaultSubtitleLanguage: 'en',
                defaultAudioLanguage: 'ja',
                volume: 0.8,
                playbackSpeed: 1
            }
        }
    };
}

/**
 * Convert User document to UserStatsResponseDto
 */
export function toUserStatsResponse(user: any): UserStatsResponseDto {
    const totalHours = Math.floor(user.watchStats?.totalHours || 0);
    const totalMinutes = Math.floor(((user.watchStats?.totalHours || 0) - totalHours) * 60);
    
    return {
        watchStats: user.watchStats || {
            totalHours: 0,
            totalEpisodes: 0,
            totalAnime: 0,
            completedAnime: 0,
            droppedAnime: 0,
            planningAnime: 0,
            rewatchingAnime: 0,
            averageRating: 0,
            lastWatched: null,
            streakDays: 0,
            longestStreak: 0
        },
        loginCount: user.loginCount || 0,
        memberSince: user.createdAt,
        lastActive: user.lastActive,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        totalHoursDisplay: `${totalHours}h ${totalMinutes}m`
    };
}

/**
 * Convert User preferences to UserSettingsResponseDto
 */
export function toUserSettingsResponse(preferences: IUserPreferences): UserSettingsResponseDto {
    return { preferences };
}

/**
 * Create paginated response
 */
export function toPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): { data: T[]; pagination: { total: number; page: number; limit: number; totalPages: number } } {
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

/**
 * Create success response
 */
export function toSuccessResponse<T>(data: T, message?: string): { success: boolean; data: T; message?: string } {
    return {
        success: true,
        data,
        message
    };
}

/**
 * Create error response
 */
export function toErrorResponse(message: string, code?: number): { success: false; message: string; code?: number } {
    return {
        success: false,
        message,
        code
    };
}

// ==================== EXPORT ====================

export default {
    toUserResponse,
    toUserStatsResponse,
    toUserSettingsResponse,
    toPaginatedResponse,
    toSuccessResponse,
    toErrorResponse
};
