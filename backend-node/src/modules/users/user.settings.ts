/**
 * AnimeMultiFlix - User Settings Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { userEventEmitter, UserEvents } from './user.events';
import { toUserSettingsResponse, toSuccessResponse, toErrorResponse } from './user.dto';
import { IUserPreferences, Theme } from './user.types';

// ==================== SETTINGS SERVICE ====================

class UserSettingsService {
    
    /**
     * Get user settings
     */
    async getSettings(userId: string): Promise<IUserPreferences | null> {
        try {
            const user = await User.findById(userId).select('preferences').lean();

            if (!user) {
                return null;
            }

            return user.preferences || this.getDefaultPreferences();
        } catch (error) {
            logger.error('Get settings error:', error);
            throw error;
        }
    }

    /**
     * Update user settings
     */
    async updateSettings(userId: string, updates: Partial<IUserPreferences>): Promise<IUserPreferences | null> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            const oldSettings = { ...user.preferences };

            // Deep merge preferences
            user.preferences = {
                ...user.preferences,
                ...updates,
                notifications: { ...user.preferences.notifications, ...updates.notifications },
                privacy: { ...user.preferences.privacy, ...updates.privacy },
                playback: { ...user.preferences.playback, ...updates.playback }
            };
            
            await user.save();

            // Track changes
            const changes: Record<string, any> = {};
            for (const key of Object.keys(updates)) {
                if (JSON.stringify(oldSettings[key]) !== JSON.stringify(user.preferences[key])) {
                    changes[key] = {
                        old: oldSettings[key],
                        new: user.preferences[key]
                    };
                }
            }

            // Emit settings updated event
            userEventEmitter.emitEvent(UserEvents.SETTINGS_UPDATED, {
                userId: user._id,
                email: user.email,
                username: user.username,
                settings: changes
            });

            return user.preferences;
        } catch (error) {
            logger.error('Update settings error:', error);
            throw error;
        }
    }

    /**
     * Reset settings to default
     */
    async resetSettings(userId: string): Promise<IUserPreferences | null> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences = this.getDefaultPreferences();
            await user.save();

            return user.preferences;
        } catch (error) {
            logger.error('Reset settings error:', error);
            throw error;
        }
    }

    /**
     * Update notification settings
     */
    async updateNotificationSettings(userId: string, notifications: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.notifications = {
                ...user.preferences.notifications,
                ...notifications
            };
            await user.save();

            return user.preferences.notifications;
        } catch (error) {
            logger.error('Update notification settings error:', error);
            throw error;
        }
    }

    /**
     * Update privacy settings
     */
    async updatePrivacySettings(userId: string, privacy: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.privacy = {
                ...user.preferences.privacy,
                ...privacy
            };
            await user.save();

            return user.preferences.privacy;
        } catch (error) {
            logger.error('Update privacy settings error:', error);
            throw error;
        }
    }

    /**
     * Update playback settings
     */
    async updatePlaybackSettings(userId: string, playback: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.playback = {
                ...user.preferences.playback,
                ...playback
            };
            await user.save();

            return user.preferences.playback;
        } catch (error) {
            logger.error('Update playback settings error:', error);
            throw error;
        }
    }

    /**
     * Get default preferences
     */
    private getDefaultPreferences(): IUserPreferences {
        return {
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
        };
    }
}

// ==================== CONTROLLER FUNCTIONS ====================

const settingsService = new UserSettingsService();

/**
 * Get user settings
 */
export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const settings = await settingsService.getSettings(userId);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings));
    } catch (error) {
        logger.error('Get settings controller error:', error);
        next(error);
    }
};

/**
 * Update user settings
 */
export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates = req.body;

        const settings = await settingsService.updateSettings(userId, updates);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings, 'Settings updated successfully'));
    } catch (error) {
        logger.error('Update settings controller error:', error);
        next(error);
    }
};

/**
 * Reset settings to default
 */
export const resetSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const settings = await settingsService.resetSettings(userId);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings, 'Settings reset to default'));
    } catch (error) {
        logger.error('Reset settings controller error:', error);
        next(error);
    }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const notifications = req.body;

        const updated = await settingsService.updateNotificationSettings(userId, notifications);

        if (!updated) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(updated, 'Notification settings updated'));
    } catch (error) {
        logger.error('Update notification settings controller error:', error);
        next(error);
    }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const privacy = req.body;

        const updated = await settingsService.updatePrivacySettings(userId, privacy);

        if (!updated) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(updated, 'Privacy settings updated'));
    } catch (error) {
        logger.error('Update privacy settings controller error:', error);
        next(error);
    }
};

/**
 * Update playback settings
 */
export const updatePlaybackSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const playback = req.body;

        const updated = await settingsService.updatePlaybackSettings(userId, playback);

        if (!updated) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(updated, 'Playback settings updated'));
    } catch (error) {
        logger.error('Update playback settings controller error:', error);
        next(error);
    }
};

export default {
    getSettings,
    updateSettings,
    resetSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updatePlaybackSettings
};
