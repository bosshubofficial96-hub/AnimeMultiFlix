/**
 * AnimeMultiFlix - Authentication DTO (Data Transfer Objects)
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

// ==================== REQUEST DTOs ====================

/**
 * Register Request DTO
 */
export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
}

/**
 * Login Request DTO
 */
export interface LoginRequestDto {
    email: string;
    password: string;
    rememberMe?: boolean;
    twoFactorToken?: string;
}

/**
 * Refresh Token Request DTO
 */
export interface RefreshTokenRequestDto {
    refreshToken: string;
}

/**
 * Verify Email Request DTO
 */
export interface VerifyEmailRequestDto {
    token: string;
}

/**
 * Resend Verification Request DTO
 */
export interface ResendVerificationRequestDto {
    email: string;
}

/**
 * Forgot Password Request DTO
 */
export interface ForgotPasswordRequestDto {
    email: string;
}

/**
 * Reset Password Request DTO
 */
export interface ResetPasswordRequestDto {
    token: string;
    newPassword: string;
    confirmPassword: string;
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
 * Enable 2FA Request DTO
 */
export interface Enable2FARequestDto {
    token?: string;
}

/**
 * Verify 2FA Request DTO
 */
export interface Verify2FARequestDto {
    token: string;
}

/**
 * Disable 2FA Request DTO
 */
export interface Disable2FARequestDto {
    token: string;
}

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
}

/**
 * Update Preferences Request DTO
 */
export interface UpdatePreferencesRequestDto {
    language?: string;
    theme?: 'dark' | 'light' | 'auto';
    notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        inApp?: boolean;
    };
    privacy?: {
        showEmail?: boolean;
        showLastSeen?: boolean;
        showOnline?: boolean;
        readReceipts?: boolean;
        allowFriendRequests?: boolean;
    };
    playback?: {
        defaultQuality?: string;
        autoplayNext?: boolean;
        skipIntro?: boolean;
        skipOutro?: boolean;
        defaultSubtitleLanguage?: string;
        defaultAudioLanguage?: string;
    };
}

// ==================== RESPONSE DTOs ====================

/**
 * User Response DTO (Safe - no sensitive data)
 */
export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
    phone?: string;
    avatar?: string;
    cover?: string;
    bio?: string;
    role: string;
    isVerified: boolean;
    isPremium: boolean;
    premiumType?: string;
    premiumExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
    lastActive: Date;
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
    preferences: {
        language: string;
        theme: string;
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
 * Auth Response DTO (Login/Register response)
 */
export interface AuthResponseDto {
    user: UserResponseDto;
    token: string;
    refreshToken: string;
    tokenExpiry?: string;
}

/**
 * Token Refresh Response DTO
 */
export interface TokenRefreshResponseDto {
    token: string;
    expiresIn: number;
}

/**
 * Message Response DTO
 */
export interface MessageResponseDto {
    message: string;
    success: boolean;
}

/**
 * Verification Response DTO
 */
export interface VerificationResponseDto {
    message: string;
    success: boolean;
    requiresTwoFactor?: boolean;
}

/**
 * 2FA Setup Response DTO
 */
export interface TwoFASetupResponseDto {
    qrCode: string;
    secret: string;
    backupCodes: string[];
}

/**
 * User List Response DTO
 */
export interface UserListResponseDto {
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ==================== ERROR RESPONSE DTOs ====================

/**
 * Error Response DTO
 */
export interface ErrorResponseDto {
    success: false;
    message: string;
    error?: string;
    errors?: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
    code?: number;
}

/**
 * Validation Error Response DTO
 */
export interface ValidationErrorResponseDto {
    success: false;
    message: string;
    errors: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
}

/**
 Rate Limit Error Response DTO
 */
export interface RateLimitErrorResponseDto {
    success: false;
    message: string;
    retryAfter: number;
}

/**
 * Account Locked Error Response DTO
 */
export interface AccountLockedErrorResponseDto {
    success: false;
    message: string;
    lockUntil: Date;
    attemptsRemaining?: number;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert User document to UserResponseDto
 */
export function toUserResponse(user: any): UserResponseDto {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        cover: user.cover,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumExpiry: user.premiumExpiry,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastActive: user.lastActive,
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
        preferences: {
            language: user.preferences?.language || 'en',
            theme: user.preferences?.theme || 'dark',
            notifications: {
                email: user.preferences?.notifications?.email ?? true,
                push: user.preferences?.notifications?.push ?? true,
                sms: user.preferences?.notifications?.sms ?? false,
                inApp: user.preferences?.notifications?.inApp ?? true
            },
            privacy: {
                showEmail: user.preferences?.privacy?.showEmail ?? false,
                showLastSeen: user.preferences?.privacy?.showLastSeen ?? true,
                showOnline: user.preferences?.privacy?.showOnline ?? true,
                readReceipts: user.preferences?.privacy?.readReceipts ?? true,
                allowFriendRequests: user.preferences?.privacy?.allowFriendRequests ?? true
            },
            playback: {
                defaultQuality: user.preferences?.playback?.defaultQuality || 'auto',
                autoplayNext: user.preferences?.playback?.autoplayNext ?? true,
                skipIntro: user.preferences?.playback?.skipIntro ?? true,
                skipOutro: user.preferences?.playback?.skipOutro ?? true,
                defaultSubtitleLanguage: user.preferences?.playback?.defaultSubtitleLanguage || 'en',
                defaultAudioLanguage: user.preferences?.playback?.defaultAudioLanguage || 'ja'
            }
        }
    };
}

/**
 * Create Auth Response DTO
 */
export function toAuthResponse(user: any, token: string, refreshToken: string): AuthResponseDto {
    return {
        user: toUserResponse(user),
        token,
        refreshToken,
        tokenExpiry: '7d'
    };
}

/**
 * Create Error Response DTO
 */
export function toErrorResponse(
    message: string,
    statusCode: number = 400,
    error?: string,
    errors?: Array<{ field: string; message: string; value?: any }>
): ErrorResponseDto {
    const response: ErrorResponseDto = {
        success: false,
        message,
        code: statusCode
    };
    
    if (error) {
        response.error = error;
    }
    
    if (errors && errors.length > 0) {
        response.errors = errors;
    }
    
    return response;
}

/**
 * Create Validation Error Response DTO
 */
export function toValidationErrorResponse(
    errors: Array<{ field: string; message: string; value?: any }>
): ValidationErrorResponseDto {
    return {
        success: false,
        message: 'Validation failed',
        errors
    };
}

/**
 * Create Rate Limit Error Response DTO
 */
export function toRateLimitErrorResponse(retryAfter: number): RateLimitErrorResponseDto {
    return {
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter
    };
}

/**
 * Create Account Locked Error Response DTO
 */
export function toAccountLockedErrorResponse(
    lockUntil: Date,
    attemptsRemaining?: number
): AccountLockedErrorResponseDto {
    return {
        success: false,
        message: 'Account is locked due to multiple failed attempts.',
        lockUntil,
        attemptsRemaining
    };
}

/**
 * Create Message Response DTO
 */
export function toMessageResponse(message: string, success: boolean = true): MessageResponseDto {
    return {
        message,
        success
    };
}

/**
 * Create Verification Response DTO
 */
export function toVerificationResponse(
    message: string,
    requiresTwoFactor: boolean = false
): VerificationResponseDto {
    return {
        message,
        success: true,
        requiresTwoFactor
    };
}

/**
 * Create 2FA Setup Response DTO
 */
export function toTwoFASetupResponse(
    qrCode: string,
    secret: string,
    backupCodes: string[]
): TwoFASetupResponseDto {
    return {
        qrCode,
        secret,
        backupCodes
    };
}

/**
 * Create User List Response DTO
 */
export function toUserListResponse(
    users: any[],
    total: number,
    page: number,
    limit: number
): UserListResponseDto {
    return {
        users: users.map(toUserResponse),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

// ==================== EXPORT ====================

export default {
    toUserResponse,
    toAuthResponse,
    toErrorResponse,
    toValidationErrorResponse,
    toRateLimitErrorResponse,
    toAccountLockedErrorResponse,
    toMessageResponse,
    toVerificationResponse,
    toTwoFASetupResponse,
    toUserListResponse
};
