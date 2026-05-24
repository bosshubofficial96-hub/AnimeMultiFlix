/**
 * AnimeMultiFlix - User Privacy Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';
import { queueUserExport } from './user.queue';
import { toSuccessResponse, toErrorResponse } from './user.dto';
import { userEventEmitter, UserEvents } from './user.events';

// ==================== PRIVACY SERVICE ====================

class UserPrivacyService {
    
    /**
     * Get privacy settings
     */
    async getPrivacySettings(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId).select('preferences.privacy').lean();

            if (!user) {
                return null;
            }

            return user.preferences?.privacy || {
                showEmail: false,
                showPhone: false,
                showBirthday: false,
                showLocation: false,
                showLastSeen: true,
                showOnline: true,
                readReceipts: true,
                allowFriendRequests: true,
                allowMessages: 'everyone'
            };
        } catch (error) {
            logger.error('Get privacy settings error:', error);
            throw error;
        }
    }

    /**
     * Update privacy settings
     */
    async updatePrivacySettings(userId: string, updates: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.privacy = {
                ...user.preferences.privacy,
                ...updates
            };
            await user.save();

            return user.preferences.privacy;
        } catch (error) {
            logger.error('Update privacy settings error:', error);
            throw error;
        }
    }

    /**
     * Get data export
     */
    async exportUserData(userId: string, format: 'json' | 'csv' = 'json'): Promise<string | null> {
        try {
            const user = await User.findById(userId)
                .select('-password -verificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes')
                .populate('watchlist', 'title thumbnail')
                .populate('favorites', 'title thumbnail')
                .populate('watchHistory')
                .lean();

            if (!user) {
                return null;
            }

            let exportData: string;

            if (format === 'json') {
                exportData = JSON.stringify({
                    profile: {
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        bio: user.bio,
                        birthday: user.birthday,
                        location: user.location,
                        createdAt: user.createdAt,
                        lastActive: user.lastActive
                    },
                    preferences: user.preferences,
                    watchStats: user.watchStats,
                    watchlist: user.watchlist,
                    favorites: user.favorites,
                    watchHistory: user.watchHistory
                }, null, 2);
            } else {
                // CSV format
                const rows = [
                    ['Field', 'Value'],
                    ['Username', user.username],
                    ['Email', user.email],
                    ['Phone', user.phone || ''],
                    ['Bio', user.bio || ''],
                    ['Birthday', user.birthday || ''],
                    ['Location', user.location || ''],
                    ['Created At', user.createdAt],
                    ['Last Active', user.lastActive],
                    ['Total Hours Watched', user.watchStats?.totalHours || 0],
                    ['Total Episodes', user.watchStats?.totalEpisodes || 0],
                    ['Watchlist Count', user.watchlist?.length || 0],
                    ['Favorites Count', user.favorites?.length || 0]
                ];
                exportData = rows.map(row => row.join(',')).join('\n');
            }

            // Store in Redis with 24h TTL
            await redisClient.setex(`user:export:${userId}`, 86400, exportData);

            return exportData;
        } catch (error) {
            logger.error('Export user data error:', error);
            throw error;
        }
    }

    /**
     * Delete user data (GDPR)
     */
    async deleteUserData(userId: string): Promise<boolean> {
        try {
            // Anonymize user data instead of full deletion
            const result = await User.findByIdAndUpdate(userId, {
                email: `deleted_${userId}@deleted.com`,
                username: `deleted_user_${userId}`,
                phone: null,
                bio: null,
                avatar: null,
                cover: null,
                birthday: null,
                location: null,
                website: null,
                isActive: false,
                status: 'deleted',
                deletedAt: new Date(),
                watchlist: [],
                favorites: [],
                watchHistory: [],
                social: {
                    friends: [],
                    friendRequests: [],
                    blockedUsers: [],
                    following: [],
                    followers: []
                }
            });

            if (result) {
                // Clear all user data from Redis
                await redisClient.del(`user:${userId}`);
                await redisClient.del(`user:online:${userId}`);
                await redisClient.del(`user:sessions:${userId}`);
                
                // Emit account deleted event
                userEventEmitter.emitEvent(UserEvents.USER_DELETED, {
                    userId,
                    email: result.email,
                    username: result.username
                });
            }

            return !!result;
        } catch (error) {
            logger.error('Delete user data error:', error);
            throw error;
        }
    }

    /**
     * Get data retention policy
     */
    getDataRetentionPolicy(): any {
        return {
            retentionPeriod: 90, // days
            inactiveAccountDeletion: 365, // days
            dataExportAvailability: 24, // hours
            backupsRetention: 30, // days
            logsRetention: 90 // days
        };
    }

    /**
     * Request data download
     */
    async requestDataDownload(userId: string, email: string, format: 'json' | 'csv'): Promise<void> {
        try {
            await queueUserExport('export_user_data', {
                userId,
                email,
                format
            });
        } catch (error) {
            logger.error('Request data download error:', error);
            throw error;
        }
    }
}

// ==================== CONTROLLER FUNCTIONS ====================

const privacyService = new UserPrivacyService();

/**
 * Get privacy settings
 */
export const getPrivacySettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const settings = await privacyService.getPrivacySettings(userId);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings));
    } catch (error) {
        logger.error('Get privacy settings controller error:', error);
        next(error);
    }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates = req.body;

        const settings = await privacyService.updatePrivacySettings(userId, updates);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings, 'Privacy settings updated successfully'));
    } catch (error) {
        logger.error('Update privacy settings controller error:', error);
        next(error);
    }
};

/**
 * Export user data
 */
export const exportUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { format = 'json' } = req.query;

        const data = await privacyService.exportUserData(userId, format as 'json' | 'csv');

        if (!data) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        const contentType = format === 'json' ? 'application/json' : 'text/csv';
        const filename = `animemultiflix-data-${Date.now()}.${format}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(data);
    } catch (error) {
        logger.error('Export user data controller error:', error);
        next(error);
    }
};

/**
 * Request data download (async)
 */
export const requestDataDownload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const user = req.user;
        const { format = 'json' } = req.body;

        await privacyService.requestDataDownload(userId, user.email, format);

        res.status(202).json(toSuccessResponse(null, 'Data export requested. You will receive an email when ready.'));
    } catch (error) {
        logger.error('Request data download controller error:', error);
        next(error);
    }
};

/**
 * Delete user data (GDPR Right to be Forgotten)
 */
export const deleteUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { password, confirmation } = req.body;

        if (confirmation !== 'DELETE') {
            res.status(400).json(toErrorResponse('Please type DELETE to confirm'));
            return;
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json(toErrorResponse('Invalid password'));
            return;
        }

        const deleted = await privacyService.deleteUserData(userId);

        if (!deleted) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(null, 'Your data has been deleted successfully'));
    } catch (error) {
        logger.error('Delete user data controller error:', error);
        next(error);
    }
};

/**
 * Get data retention policy
 */
export const getDataRetentionPolicy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const policy = privacyService.getDataRetentionPolicy();
        res.status(200).json(toSuccessResponse(policy));
    } catch (error) {
        logger.error('Get data retention policy controller error:', error);
        next(error);
    }
};

export default {
    getPrivacySettings,
    updatePrivacySettings,
    exportUserData,
    requestDataDownload,
    deleteUserData,
    getDataRetentionPolicy
};
