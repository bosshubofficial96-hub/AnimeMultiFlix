/**
 * AnimeMultiFlix - User Model
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

// ==================== INTERFACES ====================

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

export interface IUserSocial {
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    friendRequestCount: number;
}

export interface IWatchHistoryEntry {
    animeId: mongoose.Types.ObjectId;
    episodeId: mongoose.Types.ObjectId;
    progress: number;
    duration: number;
    watchedAt: Date;
}

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
    premiumType?: PremiumType;
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
    watchlist: mongoose.Types.ObjectId[];
    favorites: mongoose.Types.ObjectId[];
    watchHistory: IWatchHistoryEntry[];
    playlists: mongoose.Types.ObjectId[];
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
    deletionReason?: string;
    
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
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findActiveUsers(): Promise<IUser[]>;
    findPremiumUsers(): Promise<IUser[]>;
    findOnlineUsers(): Promise<IUser[]>;
}

// ==================== SCHEMAS ====================

const UserPreferencesSchema = new Schema<IUserPreferences>({
    language: { type: String, default: 'en' },
    theme: { type: String, enum: Object.values(Theme), default: Theme.DARK },
    timezone: { type: String, default: 'Asia/Tokyo' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
    },
    privacy: {
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        showBirthday: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: false },
        showLastSeen: { type: Boolean, default: true },
        showOnline: { type: Boolean, default: true },
        readReceipts: { type: Boolean, default: true },
        allowFriendRequests: { type: Boolean, default: true },
        allowMessages: { type: String, enum: ['everyone', 'friends', 'nobody'], default: 'everyone' }
    },
    playback: {
        defaultQuality: { type: String, default: 'auto' },
        autoplayNext: { type: Boolean, default: true },
        skipIntro: { type: Boolean, default: true },
        skipOutro: { type: Boolean, default: true },
        defaultSubtitleLanguage: { type: String, default: 'en' },
        defaultAudioLanguage: { type: String, default: 'ja' },
        volume: { type: Number, default: 0.8, min: 0, max: 1 },
        playbackSpeed: { type: Number, default: 1, min: 0.25, max: 4 }
    }
});

const UserWatchStatsSchema = new Schema<IUserWatchStats>({
    totalHours: { type: Number, default: 0 },
    totalEpisodes: { type: Number, default: 0 },
    totalAnime: { type: Number, default: 0 },
    completedAnime: { type: Number, default: 0 },
    droppedAnime: { type: Number, default: 0 },
    planningAnime: { type: Number, default: 0 },
    rewatchingAnime: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    lastWatched: { type: Date, default: null },
    streakDays: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
});

const UserSocialSchema = new Schema<IUserSocial>({
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestCount: { type: Number, default: 0 }
});

const WatchHistoryEntrySchema = new Schema<IWatchHistoryEntry>({
    animeId: { type: Schema.Types.ObjectId, ref: 'Anime', required: true },
    episodeId: { type: Schema.Types.ObjectId, ref: 'Episode', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    duration: { type: Number, default: 0 },
    watchedAt: { type: Date, default: Date.now }
});

// ==================== MAIN USER SCHEMA ====================

const UserSchema = new Schema<IUser>(
    {
        // Basic Information
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 50,
            match: /^[a-zA-Z0-9_]+$/
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },
        phone: {
            type: String,
            sparse: true,
            match: /^\+?[1-9]\d{1,14}$/
        },
        avatar: {
            type: String,
            default: '/assets/images/default-avatar.png'
        },
        cover: {
            type: String,
            default: '/assets/images/default-cover.jpg'
        },
        bio: {
            type: String,
            maxlength: 500
        },
        birthday: Date,
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say']
        },
        location: {
            type: String,
            maxlength: 100
        },
        website: {
            type: String,
            match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
        },
        
        // Account Status
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        status: {
            type: String,
            enum: Object.values(AccountStatus),
            default: AccountStatus.ACTIVE
        },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isPremium: { type: Boolean, default: false },
        premiumType: {
            type: String,
            enum: Object.values(PremiumType)
        },
        premiumExpiry: Date,
        premiumFeatures: [String],
        
        // Verification
        verificationToken: String,
        verificationExpiry: Date,
        emailVerifiedAt: Date,
        phoneVerifiedAt: Date,
        
        // Password Reset
        resetPasswordToken: String,
        resetPasswordExpiry: Date,
        passwordChangedAt: Date,
        previousPasswords: [String],
        
        // Two-Factor Authentication
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: String,
        twoFactorTempSecret: String,
        twoFactorBackupCodes: [String],
        
        // Social Logins
        googleId: { type: String, sparse: true },
        discordId: { type: String, sparse: true },
        facebookId: { type: String, sparse: true },
        appleId: { type: String, sparse: true },
        githubId: { type: String, sparse: true },
        twitterId: { type: String, sparse: true },
        linkedinId: { type: String, sparse: true },
        twitchId: { type: String, sparse: true },
        redditId: { type: String, sparse: true },
        
        // Preferences & Stats
        preferences: { type: UserPreferencesSchema, default: () => ({}) },
        watchStats: { type: UserWatchStatsSchema, default: () => ({}) },
        social: { type: UserSocialSchema, default: () => ({}) },
        
        // Collections
        watchlist: [{ type: Schema.Types.ObjectId, ref: 'Anime' }],
        favorites: [{ type: Schema.Types.ObjectId, ref: 'Anime' }],
        watchHistory: [WatchHistoryEntrySchema],
        playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
        badges: [String],
        
        // Activity
        lastLogin: Date,
        lastLoginIP: String,
        lastLoginDevice: String,
        lastActive: { type: Date, default: Date.now },
        loginCount: { type: Number, default: 0 },
        loginAttempts: { type: Number, default: 0 },
        isLocked: { type: Boolean, default: false },
        lockUntil: Date,
        
        // Timestamps
        deletedAt: Date,
        deletionReason: String
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ==================== INDEXES ====================

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isPremium: 1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'watchStats.totalHours': -1 });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ discordId: 1 }, { sparse: true });
UserSchema.index({ facebookId: 1 }, { sparse: true });
UserSchema.index({ appleId: 1 }, { sparse: true });
UserSchema.index({ githubId: 1 }, { sparse: true });

// Compound indexes
UserSchema.index({ isPremium: 1, lastActive: -1 });
UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ isVerified: 1, createdAt: -1 });
UserSchema.index({ status: 1, lastActive: -1 });

// Text search index
UserSchema.index({ username: 'text', bio: 'text' });

// ==================== VIRTUALS ====================

UserSchema.virtual('isAdmin').get(function(this: IUser) {
    return [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OWNER].includes(this.role);
});

UserSchema.virtual('isModerator').get(function(this: IUser) {
    return [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OWNER].includes(this.role);
});

UserSchema.virtual('profileComplete').get(function(this: IUser) {
    return !!(this.avatar && this.bio && this.phone);
});

UserSchema.virtual('premiumStatus').get(function(this: IUser) {
    if (!this.isPremium) return 'inactive';
    if (this.premiumExpiry && this.premiumExpiry < new Date()) return 'expired';
    return 'active';
});

UserSchema.virtual('followersCount').get(function(this: IUser) {
    return this.social.followers.length;
});

UserSchema.virtual('followingCount').get(function(this: IUser) {
    return this.social.following.length;
});

UserSchema.virtual('friendsCount').get(function(this: IUser) {
    return this.social.friends.length;
});

// ==================== PRE-SAVE MIDDLEWARE ====================

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Add to previous passwords history
    if (this.previousPasswords) {
        this.previousPasswords.push(this.password);
        if (this.previousPasswords.length > 5) {
            this.previousPasswords.shift();
        }
    }
    
    this.passwordChangedAt = new Date();
    next();
});

// Update timestamps
UserSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// ==================== INSTANCE METHODS ====================

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateVerificationToken = function(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = token;
    this.verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return token;
};

UserSchema.methods.generatePasswordResetToken = function(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = token;
    this.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    return token;
};

UserSchema.methods.incrementLoginCount = async function(): Promise<void> {
    this.loginCount += 1;
    this.lastLogin = new Date();
    this.loginAttempts = 0;
    await this.save();
};

UserSchema.methods.updateLastActive = async function(): Promise<void> {
    this.lastActive = new Date();
    await this.save();
};

UserSchema.methods.addToWatchlist = async function(animeId: string): Promise<void> {
    if (!this.watchlist.includes(animeId as any)) {
        this.watchlist.push(animeId as any);
        await this.save();
    }
};

UserSchema.methods.removeFromWatchlist = async function(animeId: string): Promise<void> {
    this.watchlist = this.watchlist.filter((id: any) => id.toString() !== animeId);
    await this.save();
};

UserSchema.methods.addToFavorites = async function(animeId: string): Promise<void> {
    if (!this.favorites.includes(animeId as any)) {
        this.favorites.push(animeId as any);
        await this.save();
    }
};

UserSchema.methods.removeFromFavorites = async function(animeId: string): Promise<void> {
    this.favorites = this.favorites.filter((id: any) => id.toString() !== animeId);
    await this.save();
};

UserSchema.methods.updateWatchStats = async function(episodeDuration: number): Promise<void> {
    this.watchStats.totalHours += episodeDuration / 3600;
    this.watchStats.totalEpisodes += 1;
    this.watchStats.lastWatched = new Date();
    await this.save();
};

// ==================== STATIC METHODS ====================

UserSchema.statics.findByEmail = function(email: string) {
    return this.findOne({ email, isActive: true });
};

UserSchema.statics.findByUsername = function(username: string) {
    return this.findOne({ username, isActive: true });
};

UserSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true, status: AccountStatus.ACTIVE });
};

UserSchema.statics.findPremiumUsers = function() {
    return this.find({ isPremium: true, premiumExpiry: { $gt: new Date() }, isActive: true });
};

UserSchema.statics.findOnlineUsers = async function() {
    // This would require Redis integration
    return this.find({ isActive: true, status: AccountStatus.ACTIVE });
};

// ==================== MODEL ====================

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
