/**
 * AnimeMultiFlix - User Queue
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import Bull from 'bull';
import { logger } from '../../shared/utils/logger';
import { sendEmail } from '../../shared/utils/email';
import { redisClient } from '../../shared/services/redis.service';
import User from './user.model';

// ==================== QUEUE CONFIGURATION ====================

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const defaultQueueOptions: Bull.QueueOptions = {
    redis: REDIS_URL,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: 100,
        removeOnFail: 500
    }
};

// ==================== QUEUE DEFINITIONS ====================

/**
 * User Stats Queue
 */
export const userStatsQueue = new Bull('user:stats', defaultQueueOptions);

/**
 * User Notification Queue
 */
export const userNotificationQueue = new Bull('user:notification', defaultQueueOptions);

/**
 * User Cleanup Queue
 */
export const userCleanupQueue = new Bull('user:cleanup', defaultQueueOptions);

/**
 * User Export Queue
 */
export const userExportQueue = new Bull('user:export', defaultQueueOptions);

// ==================== JOB TYPES ====================

// Stats Jobs
export interface UpdateWatchStatsJob {
    userId: string;
    episodeDuration: number;
    animeId: string;
    episodeId: string;
}

export interface UpdateLoginStatsJob {
    userId: string;
    ip: string;
    device: string;
}

// Notification Jobs
export interface SendWelcomeEmailJob {
    userId: string;
    email: string;
    username: string;
}

export interface SendPremiumReminderJob {
    userId: string;
    email: string;
    username: string;
    daysRemaining: number;
}

// Cleanup Jobs
export interface CleanupInactiveUsersJob {
    daysInactive: number;
}

export interface CleanupExpiredPremiumJob {
    daysBeforeExpiry: number;
}

// Export Jobs
export interface ExportUserDataJob {
    userId: string;
    email: string;
    format: 'json' | 'csv';
}

// ==================== JOB PROCESSORS ====================

// User Stats Queue Processor
userStatsQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'update_watch_stats':
                await User.findByIdAndUpdate(data.userId, {
                    $inc: {
                        'watchStats.totalHours': data.episodeDuration / 3600,
                        'watchStats.totalEpisodes': 1
                    },
                    $set: { 'watchStats.lastWatched': new Date() }
                });
                break;
                
            case 'update_login_stats':
                await User.findByIdAndUpdate(data.userId, {
                    $inc: { loginCount: 1 },
                    $set: {
                        lastLogin: new Date(),
                        lastLoginIP: data.ip,
                        lastLoginDevice: data.device
                    }
                });
                break;
                
            default:
                logger.warn(`Unknown user stats job type: ${type}`);
        }
        
        logger.info(`User stats job ${job.id} completed: ${type}`);
    } catch (error) {
        logger.error(`User stats job ${job.id} failed:`, error);
        throw error;
    }
});

// User Notification Queue Processor
userNotificationQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'welcome_email':
                await sendEmail({
                    to: data.email,
                    subject: 'Welcome to AnimeMultiFlix! 🎬',
                    template: 'welcome',
                    data: {
                        username: data.username,
                        year: new Date().getFullYear()
                    }
                });
                break;
                
            case 'premium_reminder':
                await sendEmail({
                    to: data.email,
                    subject: `Premium Expires in ${data.daysRemaining} Days - AnimeMultiFlix`,
                    template: 'premium-reminder',
                    data: {
                        username: data.username,
                        daysRemaining: data.daysRemaining,
                        renewLink: `${process.env.FRONTEND_URL}/premium`
                    }
                });
                break;
                
            default:
                logger.warn(`Unknown user notification job type: ${type}`);
        }
        
        logger.info(`User notification job ${job.id} completed: ${type}`);
    } catch (error) {
        logger.error(`User notification job ${job.id} failed:`, error);
        throw error;
    }
});

// User Cleanup Queue Processor
userCleanupQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'inactive_users':
                const inactiveDate = new Date();
                inactiveDate.setDate(inactiveDate.getDate() - data.daysInactive);
                
                const inactiveUsers = await User.updateMany(
                    {
                        lastActive: { $lt: inactiveDate },
                        role: 'user',
                        isActive: true
                    },
                    {
                        isActive: false,
                        status: 'inactive',
                        updatedAt: new Date()
                    }
                );
                
                logger.info(`Marked ${inactiveUsers.modifiedCount} inactive users`);
                break;
                
            case 'expired_premium':
                const expiredUsers = await User.updateMany(
                    {
                        isPremium: true,
                        premiumExpiry: { $lt: new Date() }
                    },
                    {
                        isPremium: false,
                        premiumType: null,
                        updatedAt: new Date()
                    }
                );
                
                logger.info(`Expired premium for ${expiredUsers.modifiedCount} users`);
                break;
                
            default:
                logger.warn(`Unknown user cleanup job type: ${type}`);
        }
        
        logger.info(`User cleanup job ${job.id} completed: ${type}`);
    } catch (error) {
        logger.error(`User cleanup job ${job.id} failed:`, error);
        throw error;
    }
});

// User Export Queue Processor
userExportQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'export_user_data':
                const user = await User.findById(data.userId)
                    .select('-password -verificationToken -resetPasswordToken -twoFactorSecret')
                    .lean();
                
                if (!user) {
                    throw new Error('User not found');
                }
                
                let exportData: string;
                
                if (data.format === 'json') {
                    exportData = JSON.stringify(user, null, 2);
                } else {
                    // CSV format
                    const flattenObject = (obj: any, prefix = '') => {
                        const result: Record<string, any> = {};
                        for (const key in obj) {
                            const value = obj[key];
                            const newKey = prefix ? `${prefix}.${key}` : key;
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                Object.assign(result, flattenObject(value, newKey));
                            } else {
                                result[newKey] = value;
                            }
                        }
                        return result;
                    };
                    
                    const flatUser = flattenObject(user);
                    const headers = Object.keys(flatUser);
                    const values = headers.map(h => flatUser[h]);
                    
                    exportData = [
                        headers.join(','),
                        values.map(v => `"${v}"`).join(',')
                    ].join('\n');
                }
                
                // Store export in Redis (24 hours TTL)
                await redisClient.setex(`user:export:${data.userId}`, 86400, exportData);
                
                // Send email with download link
                await sendEmail({
                    to: data.email,
                    subject: 'Your Data Export is Ready - AnimeMultiFlix',
                    template: 'data-export',
                    data: {
                        username: user.username,
                        downloadLink: `${process.env.API_URL}/users/export/download/${data.userId}`,
                        expiryHours: 24
                    }
                });
                
                logger.info(`User data exported for ${data.userId}`);
                break;
                
            default:
                logger.warn(`Unknown user export job type: ${type}`);
        }
        
        logger.info(`User export job ${job.id} completed: ${type}`);
    } catch (error) {
        logger.error(`User export job ${job.id} failed:`, error);
        throw error;
    }
});

// ==================== SCHEDULED JOBS ====================

// Daily cleanup of inactive users (2 AM)
userCleanupQueue.add('inactive_users',
    { type: 'inactive_users', data: { daysInactive: 90 } },
    { repeat: { pattern: '0 2 * * *' } }
);

// Daily cleanup of expired premium users (3 AM)
userCleanupQueue.add('expired_premium',
    { type: 'expired_premium', data: {} },
    { repeat: { pattern: '0 3 * * *' } }
);

// Daily premium reminder for expiring soon (10 AM)
userCleanupQueue.add('premium_reminder',
    { type: 'premium_reminder', data: { daysBeforeExpiry: 7 } },
    { repeat: { pattern: '0 10 * * *' } }
);

// ==================== QUEUE HELPERS ====================

export const queueUserStats = async (type: string, data: any): Promise<Bull.Job> => {
    return userStatsQueue.add(type, { type, data });
};

export const queueUserNotification = async (type: string, data: any): Promise<Bull.Job> => {
    return userNotificationQueue.add(type, { type, data });
};

export const queueUserCleanup = async (type: string, data: any): Promise<Bull.Job> => {
    return userCleanupQueue.add(type, { type, data });
};

export const queueUserExport = async (type: string, data: any): Promise<Bull.Job> => {
    return userExportQueue.add(type, { type, data });
};

// ==================== QUEUE EVENT HANDLERS ====================

userStatsQueue.on('completed', (job) => {
    logger.debug(`User stats job ${job.id} completed`);
});

userStatsQueue.on('failed', (job, err) => {
    logger.error(`User stats job ${job?.id} failed:`, err);
});

userNotificationQueue.on('completed', (job) => {
    logger.debug(`User notification job ${job.id} completed`);
});

userNotificationQueue.on('failed', (job, err) => {
    logger.error(`User notification job ${job?.id} failed:`, err);
});

userCleanupQueue.on('completed', (job) => {
    logger.info(`User cleanup job ${job.id} completed`);
});

userCleanupQueue.on('failed', (job, err) => {
    logger.error(`User cleanup job ${job?.id} failed:`, err);
});

userExportQueue.on('completed', (job) => {
    logger.info(`User export job ${job.id} completed`);
});

userExportQueue.on('failed', (job, err) => {
    logger.error(`User export job ${job?.id} failed:`, err);
});

// ==================== EXPORT ====================

export default {
    userStatsQueue,
    userNotificationQueue,
    userCleanupQueue,
    userExportQueue,
    queueUserStats,
    queueUserNotification,
    queueUserCleanup,
    queueUserExport
};
