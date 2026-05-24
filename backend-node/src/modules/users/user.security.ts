/**
 * AnimeMultiFlix - User Security Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';
import { sendEmail } from '../../shared/utils/email';
import { queueUserNotification } from './user.queue';
import { toSuccessResponse, toErrorResponse } from './user.dto';
import { userEventEmitter, UserEvents } from './user.events';

// ==================== SECURITY SERVICE ====================

class UserSecurityService {
    
    /**
     * Get security settings
     */
    async getSecuritySettings(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId)
                .select('twoFactorEnabled email phone lastLogin lastLoginIP lastLoginDevice loginCount')
                .lean();

            if (!user) {
                return null;
            }

            // Get recent login attempts
            const recentLogins = await redisClient.lrange(`user:logins:${userId}`, 0, 9);
            const parsedLogins = recentLogins.map(l => JSON.parse(l));

            return {
                twoFactorEnabled: user.twoFactorEnabled,
                email: user.email,
                phone: user.phone,
                lastLogin: user.lastLogin,
                lastLoginIP: user.lastLoginIP,
                lastLoginDevice: user.lastLoginDevice,
                loginCount: user.loginCount,
                recentLogins: parsedLogins
            };
        } catch (error) {
            logger.error('Get security settings error:', error);
            throw error;
        }
    }

    /**
     * Enable 2FA
     */
    async enable2FA(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            // Generate secret
            const secret = speakeasy.generateSecret({
                name: `AnimeMultiFlix (${user.email})`,
                length: 20,
                issuer: 'AnimeMultiFlix'
            });

            // Generate QR code
            const qrCode = await QRCode.toDataURL(secret.otpauth_url);

            // Store temp secret
            user.twoFactorTempSecret = secret.base32;
            await user.save();

            return {
                qrCode,
                secret: secret.base32
            };
        } catch (error) {
            logger.error('Enable 2FA error:', error);
            throw error;
        }
    }

    /**
     * Verify and confirm 2FA
     */
    async verify2FA(userId: string, token: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user || !user.twoFactorTempSecret) {
                return false;
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorTempSecret,
                encoding: 'base32',
                token,
                window: 1
            });

            if (verified) {
                // Generate backup codes
                const backupCodes = [];
                for (let i = 0; i < 10; i++) {
                    backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
                }

                user.twoFactorEnabled = true;
                user.twoFactorSecret = user.twoFactorTempSecret;
                user.twoFactorTempSecret = undefined;
                user.twoFactorBackupCodes = backupCodes;
                await user.save();

                // Send email notification
                await sendEmail({
                    to: user.email,
                    subject: 'Two-Factor Authentication Enabled - AnimeMultiFlix',
                    template: '2fa-enabled',
                    data: {
                        username: user.username
                    }
                });

                // Emit event
                userEventEmitter.emitEvent(UserEvents.USER_UPDATED, {
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                    changes: { twoFactorEnabled: true }
                });

                return true;
            }

            return false;
        } catch (error) {
            logger.error('Verify 2FA error:', error);
            throw error;
        }
    }

    /**
     * Disable 2FA
     */
    async disable2FA(userId: string, token: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user || !user.twoFactorSecret) {
                return false;
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 1
            });

            if (verified) {
                user.twoFactorEnabled = false;
                user.twoFactorSecret = undefined;
                user.twoFactorBackupCodes = undefined;
                await user.save();

                // Send email notification
                await sendEmail({
                    to: user.email,
                    subject: 'Two-Factor Authentication Disabled - AnimeMultiFlix',
                    template: '2fa-disabled',
                    data: {
                        username: user.username
                    }
                });

                return true;
            }

            return false;
        } catch (error) {
            logger.error('Disable 2FA error:', error);
            throw error;
        }
    }

    /**
     * Get backup codes
     */
    async getBackupCodes(userId: string): Promise<string[] | null> {
        try {
            const user = await User.findById(userId);
            if (!user || !user.twoFactorEnabled) {
                return null;
            }

            return user.twoFactorBackupCodes || [];
        } catch (error) {
            logger.error('Get backup codes error:', error);
            throw error;
        }
    }

    /**
     * Regenerate backup codes
     */
    async regenerateBackupCodes(userId: string): Promise<string[] | null> {
        try {
            const user = await User.findById(userId);
            if (!user || !user.twoFactorEnabled) {
                return null;
            }

            const backupCodes = [];
            for (let i = 0; i < 10; i++) {
                backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
            }

            user.twoFactorBackupCodes = backupCodes;
            await user.save();

            return backupCodes;
        } catch (error) {
            logger.error('Regenerate backup codes error:', error);
            throw error;
        }
    }

    /**
     * Get active sessions
     */
    async getActiveSessions(userId: string): Promise<any[]> {
        try {
            const sessions = await redisClient.lrange(`user:sessions:${userId}`, 0, -1);
            return sessions.map(s => JSON.parse(s));
        } catch (error) {
            logger.error('Get active sessions error:', error);
            return [];
        }
    }

    /**
     * Revoke session
     */
    async revokeSession(userId: string, sessionId: string): Promise<boolean> {
        try {
            await redisClient.lrem(`user:sessions:${userId}`, 0, sessionId);
            await redisClient.del(`session:${sessionId}`);
            return true;
        } catch (error) {
            logger.error('Revoke session error:', error);
            return false;
        }
    }

    /**
     * Revoke all sessions
     */
    async revokeAllSessions(userId: string): Promise<boolean> {
        try {
            const sessions = await this.getActiveSessions(userId);
            for (const session of sessions) {
                await redisClient.del(`session:${session.id}`);
            }
            await redisClient.del(`user:sessions:${userId}`);
            return true;
        } catch (error) {
            logger.error('Revoke all sessions error:', error);
            return false;
        }
    }
}

// ==================== CONTROLLER FUNCTIONS ====================

const securityService = new UserSecurityService();

/**
 * Get security settings
 */
export const getSecuritySettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const settings = await securityService.getSecuritySettings(userId);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings));
    } catch (error) {
        logger.error('Get security settings controller error:', error);
        next(error);
    }
};

/**
 * Enable 2FA
 */
export const enable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const result = await securityService.enable2FA(userId);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result));
    } catch (error) {
        logger.error('Enable 2FA controller error:', error);
        next(error);
    }
};

/**
 * Verify and confirm 2FA
 */
export const verify2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { token } = req.body;

        if (!token) {
            res.status(400).json(toErrorResponse('2FA token is required'));
            return;
        }

        const verified = await securityService.verify2FA(userId, token);

        if (!verified) {
            res.status(400).json(toErrorResponse('Invalid 2FA token'));
            return;
        }

        const backupCodes = await securityService.getBackupCodes(userId);

        res.status(200).json(toSuccessResponse({ backupCodes }, '2FA enabled successfully'));
    } catch (error) {
        logger.error('Verify 2FA controller error:', error);
        next(error);
    }
};

/**
 * Disable 2FA
 */
export const disable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { token } = req.body;

        if (!token) {
            res.status(400).json(toErrorResponse('2FA token is required'));
            return;
        }

        const disabled = await securityService.disable2FA(userId, token);

        if (!disabled) {
            res.status(400).json(toErrorResponse('Invalid 2FA token'));
            return;
        }

        res.status(200).json(toSuccessResponse(null, '2FA disabled successfully'));
    } catch (error) {
        logger.error('Disable 2FA controller error:', error);
        next(error);
    }
};

/**
 * Get backup codes
 */
export const getBackupCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const backupCodes = await securityService.getBackupCodes(userId);

        if (!backupCodes) {
            res.status(404).json(toErrorResponse('2FA not enabled or user not found'));
            return;
        }

        res.status(200).json(toSuccessResponse({ backupCodes }));
    } catch (error) {
        logger.error('Get backup codes controller error:', error);
        next(error);
    }
};

/**
 * Regenerate backup codes
 */
export const regenerateBackupCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const backupCodes = await securityService.regenerateBackupCodes(userId);

        if (!backupCodes) {
            res.status(404).json(toErrorResponse('2FA not enabled or user not found'));
            return;
        }

        res.status(200).json(toSuccessResponse({ backupCodes }, 'Backup codes regenerated successfully'));
    } catch (error) {
        logger.error('Regenerate backup codes controller error:', error);
        next(error);
    }
};

/**
 * Get active sessions
 */
export const getActiveSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const sessions = await securityService.getActiveSessions(userId);

        res.status(200).json(toSuccessResponse({ sessions }));
    } catch (error) {
        logger.error('Get active sessions controller error:', error);
        next(error);
    }
};

/**
 * Revoke session
 */
export const revokeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { sessionId } = req.params;

        const revoked = await securityService.revokeSession(userId, sessionId);

        if (!revoked) {
            res.status(404).json(toErrorResponse('Session not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(null, 'Session revoked successfully'));
    } catch (error) {
        logger.error('Revoke session controller error:', error);
        next(error);
    }
};

/**
 * Revoke all sessions
 */
export const revokeAllSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        await securityService.revokeAllSessions(userId);

        res.status(200).json(toSuccessResponse(null, 'All sessions revoked successfully'));
    } catch (error) {
        logger.error('Revoke all sessions controller error:', error);
        next(error);
    }
};

export default {
    getSecuritySettings,
    enable2FA,
    verify2FA,
    disable2FA,
    getBackupCodes,
    regenerateBackupCodes,
    getActiveSessions,
    revokeSession,
    revokeAllSessions
};
