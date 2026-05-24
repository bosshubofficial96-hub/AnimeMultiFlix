/**
 * AnimeMultiFlix - User Middleware
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';
import { UserRole } from './user.types';

// ==================== USER MIDDLEWARE ====================

/**
 * Check if user exists
 */
export const userExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
            return;
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        req.userData = user;
        next();
    } catch (error) {
        logger.error('User exists middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Check if user is active
 */
export const isUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id || req.params.userId;
        
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact support.'
            });
            return;
        }

        next();
    } catch (error) {
        logger.error('Is user active middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Check if user is verified
 */
export const isUserVerified = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: 'Please verify your email address to access this resource'
            });
            return;
        }

        next();
    } catch (error) {
        logger.error('Is user verified middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Check if user is premium
 */
export const isPremiumUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (!user.isPremium) {
            res.status(403).json({
                success: false,
                message: 'Premium subscription required to access this content'
            });
            return;
        }

        // Check if premium has expired
        if (user.premiumExpiry && new Date(user.premiumExpiry) < new Date()) {
            res.status(403).json({
                success: false,
                message: 'Your premium subscription has expired. Please renew to continue.'
            });
            return;
        }

        next();
    } catch (error) {
        logger.error('Is premium user middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Check if user has specific role
 */
export const hasRole = (roles: UserRole | UserRole[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            const user = await User.findById(userId);
            
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions. Required role: ' + allowedRoles.join(' or ')
                });
                return;
            }

            next();
        } catch (error) {
            logger.error('Has role middleware error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

/**
 * Check if user owns the resource
 */
export const isResourceOwner = (getResourceUserId: (req: Request) => Promise<string> | string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?.id;
            const resourceUserId = await getResourceUserId(req);
            
            if (currentUserId !== resourceUserId) {
                res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this resource'
                });
                return;
            }

            next();
        } catch (error) {
            logger.error('Is resource owner middleware error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

// ==================== ONLINE STATUS MIDDLEWARE ====================

/**
 * Track user online status
 */
export const trackOnlineStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (userId) {
            // Update last active
            await User.findByIdAndUpdate(userId, { lastActive: new Date() });
            
            // Set online status in Redis (5 minutes TTL)
            await redisClient.setex(`user:online:${userId}`, 300, 'true');
        }
        
        next();
    } catch (error) {
        logger.error('Track online status middleware error:', error);
        next();
    }
};

/**
 * Get user online status
 */
export const getUserOnlineStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        
        const isOnline = await redisClient.get(`user:online:${userId}`);
        
        res.locals.isOnline = isOnline === 'true';
        next();
    } catch (error) {
        logger.error('Get user online status error:', error);
        res.locals.isOnline = false;
        next();
    }
};

// ==================== RATE LIMITING MIDDLEWARE ====================

/**
 * Rate limit for user actions
 */
export const userRateLimit = (limit: number, windowMs: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            const key = `ratelimit:user:${userId}:${req.path}`;
            
            const current = await redisClient.incr(key);
            if (current === 1) {
                await redisClient.expire(key, Math.ceil(windowMs / 1000));
            }
            
            if (current > limit) {
                res.status(429).json({
                    success: false,
                    message: `Rate limit exceeded. Please try again later.`,
                    retryAfter: Math.ceil(windowMs / 1000)
                });
                return;
            }
            
            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
            res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + Math.ceil(windowMs / 1000));
            
            next();
        } catch (error) {
            logger.error('User rate limit middleware error:', error);
            next();
        }
    };
};

// ==================== SUSPICIOUS ACTIVITY MIDDLEWARE ====================

/**
 * Check for suspicious activity
 */
export const checkSuspiciousActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const ip = req.ip;
        
        if (userId && ip) {
            const key = `user:${userId}:ips`;
            const ips = await redisClient.lrange(key, 0, -1);
            
            if (!ips.includes(ip)) {
                // New IP detected
                await redisClient.lpush(key, ip);
                await redisClient.ltrim(key, 0, 9);
                
                // Could trigger notification here
                logger.warn(`New IP detected for user ${userId}: ${ip}`);
            }
        }
        
        next();
    } catch (error) {
        logger.error('Check suspicious activity error:', error);
        next();
    }
};

// ==================== EXPORT ====================

export default {
    userExists,
    isUserActive,
    isUserVerified,
    isPremiumUser,
    hasRole,
    isResourceOwner,
    trackOnlineStatus,
    getUserOnlineStatus,
    userRateLimit,
    checkSuspiciousActivity
};
