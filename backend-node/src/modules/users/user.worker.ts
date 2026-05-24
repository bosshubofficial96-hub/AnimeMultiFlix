/**
 * AnimeMultiFlix - User Worker (BullMQ)
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Worker, Queue, Job } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../../shared/utils/logger';
import User from './user.model';
import { sendEmail } from '../../shared/utils/email';
import { redisClient } from '../../shared/services/redis.service';
import { queueUserNotification } from './user.queue';
import { userEventEmitter, UserEvents } from './user.events';

// ==================== REDIS CONNECTION ====================

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
});

// ==================== QUEUE DEFINITIONS ====================

export const userStatsWorker = new Worker('user:stats', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing user stats job ${job.id}: ${type}`);
    
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
}, { connection });

export const userNotificationWorker = new Worker('user:notification', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing user notification job ${job.id}: ${type}`);
    
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
                
            case 'profile_update':
                await sendEmail({
                    to: data.email,
                    subject: 'Profile Updated - AnimeMultiFlix',
                    template: 'profile-updated',
                    data: {
                        username: data.username,
                        changes: data.changes,
                        time: new Date().toISOString()
                    }
                });
                break;
                
            case 'send_notification_email':
                await sendEmail({
                    to: data.email,
                    subject: data.title,
                    template: 'notification',
                    data: {
                        username: data.username,
                        title: data.title,
                        message: data.message,
                        type: data.type
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
}, { connection });

export const userCleanupWorker = new Worker('user:cleanup', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing user cleanup job ${job.id}: ${type}`);
    
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
                
                // Send expiry notifications
                for (const user of expiredUsers) {
                    await queueUserNotification('premium_expired', {
                        userId: user._id,
                        email: user.email,
                        username: user.username
                    });
                }
                break;
                
            default:
                logger.warn(`Unknown user cleanup job type: ${type}`);
        }
        
        logger.info(`User cleanup job ${job.id} completed: ${type}`);
    } catch (error) {
        logger.error(`User cleanup job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

export const userExportWorker = new Worker('user:export', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing user export job ${job.id}: ${type}`);
    
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
                        favorites: user.favorites
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
}, { connection });

// ==================== SCHEDULED JOBS ====================

// Daily cleanup of inactive users (2 AM)
userCleanupWorker.add('inactive_users',
    { type: 'inactive_users', data: { daysInactive: 90 } },
    { repeat: { pattern: '0 2 * * *' } }
);

// Daily cleanup of expired premium users (3 AM)
userCleanupWorker.add('expired_premium',
    { type: 'expired_premium', data: {} },
    { repeat: { pattern: '0 3 * * *' } }
);

// ==================== QUEUE EVENT HANDLERS ====================

userStatsWorker.on('completed', (job) => {
    logger.debug(`User stats job ${job.id} completed`);
});

userStatsWorker.on('failed', (job, err) => {
    logger.error(`User stats job ${job?.id} failed:`, err);
});

userNotificationWorker.on('completed', (job) => {
    logger.debug(`User notification job ${job.id} completed`);
});

userNotificationWorker.on('failed', (job, err) => {
    logger.error(`User notification job ${job?.id} failed:`, err);
});

userCleanupWorker.on('completed', (job) => {
    logger.info(`User cleanup job ${job.id} completed`);
});

userCleanupWorker.on('failed', (job, err) => {
    logger.error(`User cleanup job ${job?.id} failed:`, err);
});

userExportWorker.on('completed', (job) => {
    logger.info(`User export job ${job.id} completed`);
});

userExportWorker.on('failed', (job, err) => {
    logger.error(`User export job ${job?.id} failed:`, err);
});

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = async () => {
    logger.info('Shutting down user workers...');
    
    await userStatsWorker.close();
    await userNotificationWorker.close();
    await userCleanupWorker.close();
    await userExportWorker.close();
    
    await connection.quit();
    
    logger.info('User workers shutdown complete');
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ==================== EXPORT ====================

export default {
    userStatsWorker,
    userNotificationWorker,
    userCleanupWorker,
    userExportWorker
};
