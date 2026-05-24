/**
 * AnimeMultiFlix - User Events
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { EventEmitter } from 'events';
import { logger } from '../../shared/utils/logger';
import { sendEmail } from '../../shared/utils/email';
import { redisClient } from '../../shared/services/redis.service';
import { queueNotification, queueAnalytics } from '../auth/auth.queue';

// ==================== EVENT NAMES ====================

export const UserEvents = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    USER_ACTIVATED: 'user.activated',
    USER_DEACTIVATED: 'user.deactivated',
    USER_BANNED: 'user.banned',
    USER_UNBANNED: 'user.unbanned',
    PROFILE_UPDATED: 'profile.updated',
    AVATAR_UPDATED: 'avatar.updated',
    SETTINGS_UPDATED: 'settings.updated',
    WATCHLIST_ADDED: 'watchlist.added',
    WATCHLIST_REMOVED: 'watchlist.removed',
    FAVORITE_ADDED: 'favorite.added',
    FAVORITE_REMOVED: 'favorite.removed',
    WATCH_HISTORY_ADDED: 'watch.history.added',
    PREMIUM_ACTIVATED: 'premium.activated',
    PREMIUM_EXPIRED: 'premium.expired',
    PREMIUM_RENEWED: 'premium.renewed',
    PASSWORD_CHANGED: 'password.changed',
    EMAIL_CHANGED: 'email.changed'
};

// ==================== EVENT EMITTER ====================

class UserEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        this.setupListeners();
    }

    private setupListeners(): void {
        this.on(UserEvents.USER_UPDATED, this.handleUserUpdated);
        this.on(UserEvents.PROFILE_UPDATED, this.handleProfileUpdated);
        this.on(UserEvents.AVATAR_UPDATED, this.handleAvatarUpdated);
        this.on(UserEvents.SETTINGS_UPDATED, this.handleSettingsUpdated);
        this.on(UserEvents.WATCHLIST_ADDED, this.handleWatchlistAdded);
        this.on(UserEvents.FAVORITE_ADDED, this.handleFavoriteAdded);
        this.on(UserEvents.PREMIUM_ACTIVATED, this.handlePremiumActivated);
        this.on(UserEvents.PREMIUM_EXPIRED, this.handlePremiumExpired);
        this.on(UserEvents.PASSWORD_CHANGED, this.handlePasswordChanged);
    }

    // ==================== EVENT HANDLERS ====================

    private async handleUserUpdated(data: {
        userId: string;
        email: string;
        username: string;
        changes: Record<string, any>;
    }): Promise<void> {
        try {
            logger.info(`User updated: ${data.email} (${data.userId})`);
            
            // Clear user cache
            await redisClient.del(`user:${data.userId}`);
            
            // Queue analytics
            await queueAnalytics('user_updated', {
                userId: data.userId,
                changes: Object.keys(data.changes)
            });
        } catch (error) {
            logger.error('Failed to handle user updated event:', error);
        }
    }

    private async handleProfileUpdated(data: {
        userId: string;
        email: string;
        username: string;
        changes: Record<string, any>;
    }): Promise<void> {
        try {
            logger.info(`Profile updated for user: ${data.email} (${data.userId})`);
            
            // Queue notification
            await queueNotification('profile_update', {
                userId: data.userId,
                email: data.email,
                username: data.username,
                changes: data.changes
            });
        } catch (error) {
            logger.error('Failed to handle profile updated event:', error);
        }
    }

    private async handleAvatarUpdated(data: {
        userId: string;
        email: string;
        username: string;
        avatarUrl: string;
    }): Promise<void> {
        try {
            logger.info(`Avatar updated for user: ${data.email} (${data.userId})`);
            
            // Clear avatar cache
            await redisClient.del(`user:${data.userId}:avatar`);
        } catch (error) {
            logger.error('Failed to handle avatar updated event:', error);
        }
    }

    private async handleSettingsUpdated(data: {
        userId: string;
        email: string;
        username: string;
        settings: Record<string, any>;
    }): Promise<void> {
        try {
            logger.info(`Settings updated for user: ${data.email} (${data.userId})`);
            
            // Clear settings cache
            await redisClient.del(`user:${data.userId}:settings`);
        } catch (error) {
            logger.error('Failed to handle settings updated event:', error);
        }
    }

    private async handleWatchlistAdded(data: {
        userId: string;
        email: string;
        username: string;
        animeId: string;
        animeTitle: string;
    }): Promise<void> {
        try {
            logger.info(`Anime added to watchlist: ${data.animeTitle} for user ${data.email}`);
            
            // Queue analytics
            await queueAnalytics('watchlist_add', {
                userId: data.userId,
                animeId: data.animeId
            });
        } catch (error) {
            logger.error('Failed to handle watchlist added event:', error);
        }
    }

    private async handleFavoriteAdded(data: {
        userId: string;
        email: string;
        username: string;
        animeId: string;
        animeTitle: string;
    }): Promise<void> {
        try {
            logger.info(`Anime added to favorites: ${data.animeTitle} for user ${data.email}`);
            
            // Queue analytics
            await queueAnalytics('favorite_add', {
                userId: data.userId,
                animeId: data.animeId
            });
        } catch (error) {
            logger.error('Failed to handle favorite added event:', error);
        }
    }

    private async handlePremiumActivated(data: {
        userId: string;
        email: string;
        username: string;
        premiumType: string;
        expiryDate: Date;
    }): Promise<void> {
        try {
            logger.info(`Premium activated for user: ${data.email} (${data.userId}) - ${data.premiumType}`);
            
            // Send welcome email
            await sendEmail({
                to: data.email,
                subject: 'Premium Activated - AnimeMultiFlix',
                template: 'premium-activated',
                data: {
                    username: data.username,
                    premiumType: data.premiumType,
                    expiryDate: data.expiryDate,
                    features: getPremiumFeatures(data.premiumType)
                }
            });
            
            // Queue analytics
            await queueAnalytics('premium_activated', {
                userId: data.userId,
                premiumType: data.premiumType
            });
        } catch (error) {
            logger.error('Failed to handle premium activated event:', error);
        }
    }

    private async handlePremiumExpired(data: {
        userId: string;
        email: string;
        username: string;
        premiumType: string;
    }): Promise<void> {
        try {
            logger.info(`Premium expired for user: ${data.email} (${data.userId})`);
            
            // Send expiry email
            await sendEmail({
                to: data.email,
                subject: 'Premium Expired - AnimeMultiFlix',
                template: 'premium-expired',
                data: {
                    username: data.username,
                    premiumType: data.premiumType,
                    renewLink: `${process.env.FRONTEND_URL}/premium`
                }
            });
            
            // Queue analytics
            await queueAnalytics('premium_expired', {
                userId: data.userId,
                premiumType: data.premiumType
            });
        } catch (error) {
            logger.error('Failed to handle premium expired event:', error);
        }
    }

    private async handlePasswordChanged(data: {
        userId: string;
        email: string;
        username: string;
        ip?: string;
    }): Promise<void> {
        try {
            logger.info(`Password changed for user: ${data.email} (${data.userId})`);
            
            // Send notification email
            await sendEmail({
                to: data.email,
                subject: 'Password Changed - AnimeMultiFlix',
                template: 'password-changed',
                data: {
                    username: data.username,
                    ip: data.ip || 'unknown',
                    time: new Date().toISOString()
                }
            });
            
            // Clear all sessions except current
            await redisClient.del(`user:sessions:${data.userId}`);
        } catch (error) {
            logger.error('Failed to handle password changed event:', error);
        }
    }

    // ==================== HELPER FUNCTIONS ====================

    /**
     * Emit event with error handling
     */
    emitEvent(event: string, data: any): void {
        try {
            this.emit(event, data);
        } catch (error) {
            logger.error(`Failed to emit event ${event}:`, error);
        }
    }
}

// Helper function to get premium features
function getPremiumFeatures(premiumType: string): string[] {
    const features = {
        basic: ['No ads', '1080p quality', 'Download support', '2 devices'],
        pro: ['No ads', '4K quality', 'Download support', '5 devices', 'Early access'],
        ultimate: ['No ads', '4K HDR', 'Download support', '10 devices', 'Early access', 'Exclusive content'],
        family: ['All Ultimate features', '5 profiles', 'Family sharing']
    };
    return features[premiumType as keyof typeof features] || [];
}

// ==================== SINGLETON INSTANCE ====================

export const userEventEmitter = new UserEventEmitter();

// ==================== EXPORT ====================

export default userEventEmitter;
