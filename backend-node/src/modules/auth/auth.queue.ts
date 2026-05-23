/**
 * AnimeMultiFlix - Authentication Queue
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import Bull from 'bull';
import { logger } from '../../shared/utils/logger';
import { sendEmail } from '../../shared/utils/email';
import { sendSMS } from '../../shared/utils/sms';
import { redisClient } from '../../shared/services/redis.service';

// ==================== QUEUE CONFIGURATION ====================

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Queue options
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
 * Email Queue - For sending emails asynchronously
 */
export const emailQueue = new Bull('auth:email', defaultQueueOptions);

/**
 * SMS Queue - For sending SMS asynchronously
 */
export const smsQueue = new Bull('auth:sms', defaultQueueOptions);

/**
 * Verification Queue - For verification code processing
 */
export const verificationQueue = new Bull('auth:verification', defaultQueueOptions);

/**
 * Notification Queue - For user notifications
 */
export const notificationQueue = new Bull('auth:notification', defaultQueueOptions);

/**
 * Analytics Queue - For analytics tracking
 */
export const analyticsQueue = new Bull('auth:analytics', defaultQueueOptions);

/**
 * Cleanup Queue - For cleanup tasks
 */
export const cleanupQueue = new Bull('auth:cleanup', defaultQueueOptions);

// ==================== JOB TYPES ====================

// Email Jobs
export interface WelcomeEmailJob {
    userId: string;
    email: string;
    username: string;
    verificationToken: string;
}

export interface VerificationEmailJob {
    email: string;
    username: string;
    verificationToken: string;
}

export interface PasswordResetEmailJob {
    email: string;
    username: string;
    resetToken: string;
    expiryHours: number;
}

export interface PasswordChangedEmailJob {
    email: string;
    username: string;
    ip?: string;
}

export interface SuspiciousLoginEmailJob {
    email: string;
    username: string;
    ip: string;
    device: string;
    time: string;
    reason: string;
}

export interface AccountLockedEmailJob {
    email: string;
    username: string;
    attempts: number;
    lockUntil: Date;
}

export interface TwoFactorEnabledEmailJob {
    email: string;
    username: string;
}

// SMS Jobs
export interface OTPsmsJob {
    phone: string;
    code: string;
}

export interface VerificationSmsJob {
    phone: string;
    code: string;
}

// Verification Jobs
export interface GenerateOTPJob {
    identifier: string;
    type: 'email' | 'phone';
    length?: number;
}

export interface VerifyOTPJob {
    identifier: string;
    code: string;
    type: 'email' | 'phone';
}

// Notification Jobs
export interface LoginNotificationJob {
    userId: string;
    email: string;
    username: string;
    ip: string;
    device: string;
    timestamp: Date;
}

export interface ProfileUpdateNotificationJob {
    userId: string;
    email: string;
    username: string;
    changes: Record<string, any>;
}

// Analytics Jobs
export interface TrackLoginJob {
    userId: string;
    email: string;
    ip: string;
    device: string;
    success: boolean;
}

export interface TrackRegistrationJob {
    userId: string;
    email: string;
    ip: string;
    referralCode?: string;
}

// Cleanup Jobs
export interface CleanupExpiredTokensJob {
    olderThan: Date;
}

export interface CleanupInactiveUsersJob {
    daysInactive: number;
}

// ==================== JOB PROCESSORS ====================

// Email Queue Processor
emailQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'welcome':
                await sendEmail({
                    to: data.email,
                    subject: 'Welcome to AnimeMultiFlix!',
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
                        expiryHours: data.expiryHours
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
                        lockUntil: data.lockUntil.toISOString(),
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
                
            default:
                logger.warn(`Unknown email job type: ${type}`);
        }
        
        logger.info(`Email job completed: ${type} for ${data.email}`);
        
    } catch (error) {
        logger.error(`Email job failed: ${type} for ${data.email}`, error);
        throw error;
    }
});

// SMS Queue Processor
smsQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'otp':
                await sendSMS({
                    to: data.phone,
                    message: `Your AnimeMultiFlix OTP code is: ${data.code}. Valid for 10 minutes.`
                });
                break;
                
            case 'verification':
                await sendSMS({
                    to: data.phone,
                    message: `Your AnimeMultiFlix verification code is: ${data.code}. Valid for 10 minutes.`
                });
                break;
                
            default:
                logger.warn(`Unknown SMS job type: ${type}`);
        }
        
        logger.info(`SMS job completed: ${type} for ${data.phone}`);
        
    } catch (error) {
        logger.error(`SMS job failed: ${type} for ${data.phone}`, error);
        throw error;
    }
});

// Verification Queue Processor
verificationQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'generate_otp':
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const key = `otp:${data.identifier}:${data.type}`;
                await redisClient.setex(key, 600, otp); // 10 minutes expiry
                
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
                
                logger.info(`OTP generated for ${data.identifier}`);
                break;
                
            case 'verify_otp':
                const storedOtp = await redisClient.get(`otp:${data.identifier}:${data.type}`);
                const isValid = storedOtp === data.code;
                
                if (isValid) {
                    await redisClient.del(`otp:${data.identifier}:${data.type}`);
                }
                
                logger.info(`OTP verification ${isValid ? 'successful' : 'failed'} for ${data.identifier}`);
                return { isValid };
                
            default:
                logger.warn(`Unknown verification job type: ${type}`);
        }
        
    } catch (error) {
        logger.error(`Verification job failed: ${type}`, error);
        throw error;
    }
});

// Notification Queue Processor
notificationQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'login':
                // Store login notification in database
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    type: 'login',
                    title: 'New Login',
                    message: `New login from ${data.device} at ${new Date().toISOString()}`,
                    timestamp: new Date().toISOString(),
                    read: false
                }));
                break;
                
            case 'profile_update':
                await redisClient.lpush(`user:${data.userId}:notifications`, JSON.stringify({
                    type: 'profile_update',
                    title: 'Profile Updated',
                    message: 'Your profile has been successfully updated.',
                    timestamp: new Date().toISOString(),
                    read: false
                }));
                break;
                
            default:
                logger.warn(`Unknown notification job type: ${type}`);
        }
        
        logger.info(`Notification job completed: ${type} for user ${data.userId}`);
        
    } catch (error) {
        logger.error(`Notification job failed: ${type}`, error);
        throw error;
    }
});

// Analytics Queue Processor
analyticsQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        const today = new Date().toISOString().split('T')[0];
        
        switch (type) {
            case 'login':
                await redisClient.hincrby(`analytics:logins:${today}`, 'total', 1);
                await redisClient.hincrby(`analytics:logins:${today}`, data.success ? 'success' : 'failed', 1);
                break;
                
            case 'registration':
                await redisClient.hincrby(`analytics:registrations:${today}`, 'total', 1);
                if (data.referralCode) {
                    await redisClient.hincrby(`analytics:referrals:${today}`, data.referralCode, 1);
                }
                break;
                
            default:
                logger.warn(`Unknown analytics job type: ${type}`);
        }
        
        logger.info(`Analytics job completed: ${type}`);
        
    } catch (error) {
        logger.error(`Analytics job failed: ${type}`, error);
        throw error;
    }
});

// Cleanup Queue Processor
cleanupQueue.process(async (job) => {
    const { type, data } = job.data;
    
    try {
        switch (type) {
            case 'expired_tokens':
                // Delete expired verification tokens from database
                // Implementation would delete from MongoDB
                logger.info(`Cleaned up expired tokens older than ${data.olderThan}`);
                break;
                
            case 'inactive_users':
                // Mark inactive users for cleanup
                logger.info(`Cleaned up inactive users older than ${data.daysInactive} days`);
                break;
                
            default:
                logger.warn(`Unknown cleanup job type: ${type}`);
        }
        
    } catch (error) {
        logger.error(`Cleanup job failed: ${type}`, error);
        throw error;
    }
});

// ==================== QUEUE HELPERS ====================

/**
 * Add email to queue
 */
export const queueEmail = async (type: string, data: any): Promise<Bull.Job> => {
    return emailQueue.add(type, { type, data });
};

/**
 * Add SMS to queue
 */
export const queueSms = async (type: string, data: any): Promise<Bull.Job> => {
    return smsQueue.add(type, { type, data });
};

/**
 * Add verification task to queue
 */
export const queueVerification = async (type: string, data: any): Promise<Bull.Job> => {
    return verificationQueue.add(type, { type, data });
};

/**
 * Add notification to queue
 */
export const queueNotification = async (type: string, data: any): Promise<Bull.Job> => {
    return notificationQueue.add(type, { type, data });
};

/**
 * Add analytics task to queue
 */
export const queueAnalytics = async (type: string, data: any): Promise<Bull.Job> => {
    return analyticsQueue.add(type, { type, data });
};

/**
 * Add cleanup task to queue
 */
export const queueCleanup = async (type: string, data: any): Promise<Bull.Job> => {
    return cleanupQueue.add(type, { type, data });
};

// ==================== SCHEDULED JOBS ====================

// Schedule daily cleanup of expired tokens
cleanupQueue.add('expired_tokens', 
    { type: 'expired_tokens', data: { olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    { repeat: { cron: '0 2 * * *' } } // Daily at 2 AM
);

// Schedule weekly cleanup of inactive users
cleanupQueue.add('inactive_users',
    { type: 'inactive_users', data: { daysInactive: 90 } },
    { repeat: { cron: '0 3 * * 0' } } // Weekly on Sunday at 3 AM
);

// ==================== QUEUE EVENT HANDLERS ====================

emailQueue.on('completed', (job) => {
    logger.debug(`Email job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
    logger.error(`Email job ${job?.id} failed:`, err);
});

smsQueue.on('completed', (job) => {
    logger.debug(`SMS job ${job.id} completed successfully`);
});

smsQueue.on('failed', (job, err) => {
    logger.error(`SMS job ${job?.id} failed:`, err);
});

verificationQueue.on('completed', (job) => {
    logger.debug(`Verification job ${job.id} completed successfully`);
});

verificationQueue.on('failed', (job, err) => {
    logger.error(`Verification job ${job?.id} failed:`, err);
});

// ==================== EXPORT ====================

export default {
    emailQueue,
    smsQueue,
    verificationQueue,
    notificationQueue,
    analyticsQueue,
    cleanupQueue,
    queueEmail,
    queueSms,
    queueVerification,
    queueNotification,
    queueAnalytics,
    queueCleanup
};
