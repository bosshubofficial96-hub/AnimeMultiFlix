/**
 * AnimeMultiFlix - User Preferences Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { toSuccessResponse, toErrorResponse } from './user.dto';
import { Theme } from './user.types';

// ==================== PREFERENCES SERVICE ====================

class UserPreferencesService {
    
    /**
     * Get user preferences
     */
    async getPreferences(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId).select('preferences').lean();

            if (!user) {
                return null;
            }

            return user.preferences || this.getDefaultPreferences();
        } catch (error) {
            logger.error('Get preferences error:', error);
            throw error;
        }
    }

    /**
     * Update language preference
     */
    async updateLanguage(userId: string, language: string): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.language = language;
            await user.save();

            return { language: user.preferences.language };
        } catch (error) {
            logger.error('Update language error:', error);
            throw error;
        }
    }

    /**
     * Update theme preference
     */
    async updateTheme(userId: string, theme: Theme): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.theme = theme;
            await user.save();

            return { theme: user.preferences.theme };
        } catch (error) {
            logger.error('Update theme error:', error);
            throw error;
        }
    }

    /**
     * Update timezone preference
     */
    async updateTimezone(userId: string, timezone: string): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.timezone = timezone;
            await user.save();

            return { timezone: user.preferences.timezone };
        } catch (error) {
            logger.error('Update timezone error:', error);
            throw error;
        }
    }

    /**
     * Update date format preference
     */
    async updateDateFormat(userId: string, dateFormat: string): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.dateFormat = dateFormat;
            await user.save();

            return { dateFormat: user.preferences.dateFormat };
        } catch (error) {
            logger.error('Update date format error:', error);
            throw error;
        }
    }

    /**
     * Get default preferences
     */
    private getDefaultPreferences(): any {
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

const preferencesService = new UserPreferencesService();

/**
 * Get user preferences
 */
export const getPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const preferences = await preferencesService.getPreferences(userId);

        if (!preferences) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(preferences));
    } catch (error) {
        logger.error('Get preferences controller error:', error);
        next(error);
    }
};

/**
 * Update language preference
 */
export const updateLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { language } = req.body;

        if (!language) {
            res.status(400).json(toErrorResponse('Language is required'));
            return;
        }

        const result = await preferencesService.updateLanguage(userId, language);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Language updated successfully'));
    } catch (error) {
        logger.error('Update language controller error:', error);
        next(error);
    }
};

/**
 * Update theme preference
 */
export const updateTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { theme } = req.body;

        if (!theme || !Object.values(Theme).includes(theme)) {
            res.status(400).json(toErrorResponse('Invalid theme value'));
            return;
        }

        const result = await preferencesService.updateTheme(userId, theme);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Theme updated successfully'));
    } catch (error) {
        logger.error('Update theme controller error:', error);
        next(error);
    }
};

/**
 * Update timezone preference
 */
export const updateTimezone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { timezone } = req.body;

        if (!timezone) {
            res.status(400).json(toErrorResponse('Timezone is required'));
            return;
        }

        const result = await preferencesService.updateTimezone(userId, timezone);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Timezone updated successfully'));
    } catch (error) {
        logger.error('Update timezone controller error:', error);
        next(error);
    }
};

/**
 * Update date format preference
 */
export const updateDateFormat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { dateFormat } = req.body;

        if (!dateFormat) {
            res.status(400).json(toErrorResponse('Date format is required'));
            return;
        }

        const result = await preferencesService.updateDateFormat(userId, dateFormat);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Date format updated successfully'));
    } catch (error) {
        logger.error('Update date format controller error:', error);
        next(error);
    }
};

/**
 * Reset all preferences to default
 */
export const resetPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        user.preferences = preferencesService['getDefaultPreferences']();
        await user.save();

        res.status(200).json(toSuccessResponse(user.preferences, 'Preferences reset to default'));
    } catch (error) {
        logger.error('Reset preferences controller error:', error);
        next(error);
    }
};

export default {
    getPreferences,
    updateLanguage,
    updateTheme,
    updateTimezone,
    updateDateFormat,
    resetPreferences
};
