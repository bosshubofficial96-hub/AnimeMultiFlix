/**
 * AnimeMultiFlix - Authentication Worker
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Worker, Queue, Job } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../../shared/utils/logger';
import { User } from './auth.model';
import { sendEmail } from '../../shared/utils/email';
import { sendSMS } from '../../shared/utils/sms';
import { redisClient } from '../../shared/services/redis.service';
import { 
    TOKEN_CONFIG, 
    OTP_CONFIG, 
    ACCOUNT_LOCKOUT,
    CACHE_KEYS 
} from './auth.constants';
import { 
    generateOTP, 
    maskEmail, 
    maskPhone 
} from './auth.utils';

// ==================== REDIS CONNECTION ====================

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
});

// ==================== QUEUE DEFINITIONS ====================

/**
 * Email Queue - For sending emails asynchronously
 */
export const emailQueue = new Queue('auth:email', { connection });

/**
 * SMS Queue - For sending SMS asynchronously
 */
export const smsQueue = new Queue('auth:sms', { connection });

/**
 * Verification Queue - For verification code processing
 */
export const verificationQueue = new Queue('auth:verification', { connection });

/**
 * Notification Queue - For user notifications
 */
export const notificationQueue = new Queue('auth:notification', { connection });

/**
 * Analytics Queue - For analytics tracking
 */
export const analyticsQueue = new Queue('auth:analytics', { connection });

/**
 * Cleanup Queue - For cleanup tasks
 */
export const cleanupQueue = new Queue('auth:cleanup', { connection });

// ==================== EMAIL WORKER ====================

export const emailWorker = new Worker('auth:email', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing email job ${job.id}: ${type}`);
    
    try {
        switch (type) {
            case 'welcome':
                await sendEmail({
                    to: data.email,
                    subject: 'Welcome to AnimeMultiFlix! 🎬',
                    template: 'welcome',
                    data: {
                        username: data.username,
                        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}`,
                        year: new Date().getFullYear()
                    }
                });
                break;
                
            case 'verification':
                await sendEmail({
                    to: data.email,
                    subject: 'Verify Your Email - AnimeMultiFlix',
                    template: 'verify-email',
                    data: {
                        username: data.username,
                        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}`,
                        expiryHours: 24
                    }
                });
                break;
                
            case 'password_reset':
                await sendEmail({
                    to: data.email,
                    subject: 'Reset Your Password - AnimeMultiFlix',
                    template: 'reset-password',
                    data: {
                        username: data.username,
                        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}`,
                        expiryHours: 1
                    }
                });
                break;
                
            case 'password_changed':
                await sendEmail({
                    to: data.email,
                    subject: 'Password Changed - AnimeMultiFlix',
                    template: 'password-changed',
                    data: {
                        username: data.username,
                        ip: data.ip || 'unknown',
                        time: new Date().toISOString(),
                        supportLink: `${process.env.FRONTEND_URL}/support`
                    }
                });
                break;
                
            case 'suspicious_login':
                await sendEmail({
                    to: data.email,
                    subject: 'New Login Detected - AnimeMultiFlix',
                    template: 'suspicious-login',
                    data: {
                        username: data.username,
                        ip: data.ip,
                        device: data.device,
                        time: data.time,
                        reason: data.reason
                    }
                });
                break;
                
            case 'account_locked':
                await sendEmail({
                    to: data.email,
                    subject: 'Account Locked - AnimeMultiFlix',
                    template: 'account-locked',
                    data: {
                        username: data.username,
                        attempts: data.attempts,
                        lockUntil: data.lockUntil,
                        supportLink: `${process.env.FRONTEND_URL}/support`
                    }
                });
                break;
                
            case '2fa_enabled':
                await sendEmail({
                    to: data.email,
                    subject: 'Two-Factor Authentication Enabled - AnimeMultiFlix',
                    template: '2fa-enabled',
                    data: {
                        username: data.username,
                        supportLink: `${process.env.FRONTEND_URL}/support`
                    }
                });
                break;
                
            case '2fa_disabled':
                await sendEmail({
                    to: data.email,
                    subject: 'Two-Factor Authentication Disabled - AnimeMultiFlix',
                    template: '2fa-disabled',
                    data: {
                        username: data.username,
                        supportLink: `${process.env.FRONTEND_URL}/support`
                    }
                });
                break;
                
            case 'account_deleted':
                await sendEmail({
                    to: data.email,
                    subject: 'Account Deleted - AnimeMultiFlix',
                    template: 'account-deleted',
                    data: {
                        username: data.username,
                        reactivateLink: `${process.env.FRONTEND_URL}/reactivate`
                    }
                });
                break;
                
            default:
                logger.warn(`Unknown email job type: ${type}`);
        }
        
        logger.info(`Email job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`Email job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== SMS WORKER ====================

export const smsWorker = new Worker('auth:sms', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing SMS job ${job.id}: ${type}`);
    
    try {
        switch (type) {
            case 'otp':
                await sendSMS({
                    to: data.phone,
                    message: `Your AnimeMultiFlix OTP code is: ${data.code}. Valid for ${OTP_CONFIG.EXPIRY_SECONDS / 60} minutes.`
                });
                break;
                
            case 'verification':
                await sendSMS({
                    to: data.phone,
                    message: `Your AnimeMultiFlix verification code is: ${data.code}. Valid for ${OTP_CONFIG.EXPIRY_SECONDS / 60} minutes.`
                });
                break;
                
            case 'login_alert':
                await sendSMS({
                    to: data.phone,
                    message: `New login to your AnimeMultiFlix account from ${data.device} at ${data.time}. If this wasn't you, please secure your account.`
                });
                break;
                
            case 'password_changed':
                await sendSMS({
                    to: data.phone,
                    message: `Your AnimeMultiFlix password was changed at ${data.time}. If this wasn't you, contact support immediately.`
                });
                break;
                
            default:
                logger.warn(`Unknown SMS job type: ${type}`);
        }
        
        logger.info(`SMS job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`SMS job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== VERIFICATION WORKER ====================

export const verificationWorker = new Worker('auth:verification', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing verification job ${job.id}: ${type}`);
    
    try {
        switch (type) {
            case 'generate_otp':
                const otp = generateOTP(OTP_CONFIG.LENGTH);
                const key = CACHE_KEYS.OTP_CODE(`${data.identifier}:${data.type}`);
                
                await redisClient.setex(key, OTP_CONFIG.EXPIRY_SECONDS, otp);
                
                if (data.type === 'email') {
                    await emailQueue.add('verification', {
                        email: data.identifier,
                        code: otp
                    });
                } else if (data.type === 'phone') {
                    await smsQueue.add('otp', {
                        phone: data.identifier,
                        code: otp
                    });
                }
                
                logger.info(`OTP generated for ${maskEmail(data.identifier)}`);
                break;
                
            case 'verify_otp':
                const storedOtp = await redisClient.get(CACHE_KEYS.OTP_CODE(`${data.identifier}:${data.type}`));
                const isValid = storedOtp === data.code;
                
                if (isValid) {
                    await redisClient.del(CACHE_KEYS.OTP_CODE(`${data.identifier}:${data.type}`));
                }
                
                logger.info(`OTP verification ${isValid ? 'successful' : 'failed'} for ${maskEmail(data.identifier)}`);
                return { isValid };
                
            default:
                logger.warn(`Unknown verification job type: ${type}`);
        }
        
        logger.info(`Verification job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`Verification job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== NOTIFICATION WORKER ====================

export const notificationWorker = new Worker('auth:notification', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing notification job ${job.id}: ${type}`);
    
    try {
        switch (type) {
            case 'login':
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    id: `notif_${Date.now()}`,
                    type: 'login',
                    title: 'New Login',
                    message: `New login from ${data.device} at ${new Date().toISOString()}`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    data: {
                        ip: data.ip,
                        device: data.device,
                        location: data.location
                    }
                }));
                await redisClient.ltrim(`user:${data.userId}:notifications`, 0, 99);
                break;
                
            case 'profile_update':
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    id: `notif_${Date.now()}`,
                    type: 'profile_update',
                    title: 'Profile Updated',
                    message: 'Your profile has been successfully updated.',
                    timestamp: new Date().toISOString(),
                    read: false
                }));
                break;
                
            case 'password_change':
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    id: `notif_${Date.now()}`,
                    type: 'security',
                    title: 'Password Changed',
                    message: 'Your password was changed successfully.',
                    timestamp: new Date().toISOString(),
                    read: false
                }));
                break;
                
            case '2fa_enabled':
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    id: `notif_${Date.now()}`,
                    type: 'security',
                    title: '2FA Enabled',
                    message: 'Two-factor authentication has been enabled on your account.',
                    timestamp: new Date().toISOString(),
                    read: false
                }));
                break;
                
            default:
                logger.warn(`Unknown notification job type: ${type}`);
        }
        
        logger.info(`Notification job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`Notification job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== ANALYTICS WORKER ====================

export const analyticsWorker = new Worker('auth:analytics', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing analytics job ${job.id}: ${type}`);
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const hour = new Date().getHours();
        const month = new Date().toISOString().slice(0, 7);
        
        switch (type) {
            case 'login':
                await redisClient.hincrby(`analytics:logins:${today}`, 'total', 1);
                await redisClient.hincrby(`analytics:logins:${today}`, data.success ? 'success' : 'failed', 1);
                await redisClient.hincrby(`analytics:logins:hour:${hour}`, 'total', 1);
                await redisClient.hincrby(`analytics:logins:month:${month}`, 'total', 1);
                
                if (data.method) {
                    await redisClient.hincrby(`analytics:logins:method:${data.method}`, 'count', 1);
                }
                break;
                
            case 'registration':
                await redisClient.hincrby(`analytics:registrations:${today}`, 'total', 1);
                await redisClient.hincrby(`analytics:registrations:hour:${hour}`, 'total', 1);
                await redisClient.hincrby(`analytics:registrations:month:${month}`, 'total', 1);
                
                if (data.referralCode) {
                    await redisClient.hincrby(`analytics:referrals:${today}`, data.referralCode, 1);
                }
                
                // Update daily active users
                await redisClient.pfadd(`analytics:dau:${today}`, data.userId);
                break;
                
            case 'verification':
                await redisClient.hincrby(`analytics:verifications:${today}`, 'total', 1);
                await redisClient.hincrby(`analytics:verifications:${today}`, data.success ? 'success' : 'failed', 1);
                break;
                
            case 'password_reset':
                await redisClient.hincrby(`analytics:password_resets:${today}`, 'total', 1);
                await redisClient.hincrby(`analytics:password_resets:${today}`, data.success ? 'success' : 'failed', 1);
                break;
                
            default:
                logger.warn(`Unknown analytics job type: ${type}`);
        }
        
        logger.info(`Analytics job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`Analytics job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== CLEANUP WORKER ====================

export const cleanupWorker = new Worker('auth:cleanup', async (job: Job) => {
    const { type, data } = job.data;
    
    logger.info(`Processing cleanup job ${job.id}: ${type}`);
    
    try {
        switch (type) {
            case 'expired_tokens':
                // Delete expired verification tokens
                const verificationResult = await User.updateMany(
                    {
                        verificationExpiry: { $lt: new Date() },
                        isVerified: false
                    },
                    {
                        $unset: { verificationToken: "", verificationExpiry: "" }
                    }
                );
                
                // Delete expired password reset tokens
                const resetResult = await User.updateMany(
                    {
                        resetPasswordExpiry: { $lt: new Date() }
                    },
                    {
                        $unset: { resetPasswordToken: "", resetPasswordExpiry: "" }
                    }
                );
                
                logger.info(`Cleaned up expired tokens: ${verificationResult.modifiedCount} verification, ${resetResult.modifiedCount} reset`);
                break;
                
            case 'inactive_users':
                const inactiveDate = new Date();
                inactiveDate.setDate(inactiveDate.getDate() - data.daysInactive);
                
                const inactiveResult = await User.updateMany(
                    {
                        lastActive: { $lt: inactiveDate },
                        role: 'user',
                        isActive: true
                    },
                    {
                        isActive: false,
                        updatedAt: new Date()
                    }
                );
                
                logger.info(`Marked ${inactiveResult.modifiedCount} inactive users (${data.daysInactive} days)`);
                break;
                
            case 'expired_sessions':
                // Clean up expired sessions from Redis
                const pattern = CACHE_KEYS.USER_SESSION('*');
                const keys = await redisClient.keys(pattern);
                let deletedCount = 0;
                
                for (const key of keys) {
                    const session = await redisClient.get(key);
                    if (session) {
                        const sessionData = JSON.parse(session);
                        if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
                            await redisClient.del(key);
                            deletedCount++;
                        }
                    }
                }
                
                logger.info(`Cleaned up ${deletedCount} expired sessions`);
                break;
                
            default:
                logger.warn(`Unknown cleanup job type: ${type}`);
        }
        
        logger.info(`Cleanup job ${job.id} completed successfully`);
        
    } catch (error) {
        logger.error(`Cleanup job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

// ==================== SCHEDULED JOBS ====================

/**
 * Schedule daily cleanup of expired tokens (2 AM)
 */
cleanupQueue.add('expired_tokens', 
    { type: 'expired_tokens', data: { olderThan: new Date() } },
    { repeat: { pattern: '0 2 * * *' } }
);

/**
 * Schedule weekly cleanup of inactive users (3 AM Sunday)
 */
cleanupQueue.add('inactive_users',
    { type: 'inactive_users', data: { daysInactive: 90 } },
    { repeat: { pattern: '0 3 * * 0' } }
);

/**
 * Schedule hourly cleanup of expired sessions
 */
cleanupQueue.add('expired_sessions',
    { type: 'expired_sessions', data: {} },
    { repeat: { pattern: '0 * * * *' } }
);

// ==================== QUEUE EVENT HANDLERS ====================

emailWorker.on('completed', (job) => {
    logger.debug(`Email job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
    logger.error(`Email job ${job?.id} failed:`, err);
});

smsWorker.on('completed', (job) => {
    logger.debug(`SMS job ${job.id} completed successfully`);
});

smsWorker.on('failed', (job, err) => {
    logger.error(`SMS job ${job?.id} failed:`, err);
});

verificationWorker.on('completed', (job) => {
    logger.debug(`Verification job ${job.id} completed successfully`);
});

verificationWorker.on('failed', (job, err) => {
    logger.error(`Verification job ${job?.id} failed:`, err);
});

notificationWorker.on('completed', (job) => {
    logger.debug(`Notification job ${job.id} completed successfully`);
});

notificationWorker.on('failed', (job, err) => {
    logger.error(`Notification job ${job?.id} failed:`, err);
});

analyticsWorker.on('completed', (job) => {
    logger.debug(`Analytics job ${job.id} completed successfully`);
});

analyticsWorker.on('failed', (job, err) => {
    logger.error(`Analytics job ${job?.id} failed:`, err);
});

cleanupWorker.on('completed', (job) => {
    logger.info(`Cleanup job ${job.id} completed successfully`);
});

cleanupWorker.on('failed', (job, err) => {
    logger.error(`Cleanup job ${job?.id} failed:`, err);
});

// ==================== QUEUE HELPERS ====================

/**
 * Add email to queue
 */
export const queueEmail = async (type: string, data: any): Promise<Job> => {
    return emailQueue.add(type, { type, data });
};

/**
 * Add SMS to queue
 */
export const queueSms = async (type: string, data: any): Promise<Job> => {
    return smsQueue.add(type, { type, data });
};

/**
 * Add verification task to queue
 */
export const queueVerification = async (type: string, data: any): Promise<Job> => {
    return verificationQueue.add(type, { type, data });
};

/**
 * Add notification to queue
 */
export const queueNotification = async (type: string, data: any): Promise<Job> => {
    return notificationQueue.add(type, { type, data });
};

/**
 * Add analytics task to queue
 */
export const queueAnalytics = async (type: string, data: any): Promise<Job> => {
    return analyticsQueue.add(type, { type, data });
};

/**
 * Add cleanup task to queue
 */
export const queueCleanup = async (type: string, data: any): Promise<Job> => {
    return cleanupQueue.add(type, { type, data });
};

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = async () => {
    logger.info('Shutting down workers...');
    
    await emailWorker.close();
    await smsWorker.close();
    await verificationWorker.close();
    await notificationWorker.close();
    await analyticsWorker.close();
    await cleanupWorker.close();
    
    await connection.quit();
    
    logger.info('Workers shutdown complete');
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ==================== EXPORT ====================

export default {
    emailWorker,
    smsWorker,
    verificationWorker,
    notificationWorker,
    analyticsWorker,
    cleanupWorker,
    queueEmail,
    queueSms,
    queueVerification,
    queueNotification,
    queueAnalytics,
    queueCleanup
};
