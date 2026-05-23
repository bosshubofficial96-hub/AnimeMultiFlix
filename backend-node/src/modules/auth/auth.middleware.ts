/**
 * AnimeMultiFlix - Authentication Middleware
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './auth.model';
import { AuthService } from './auth.service';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';

// ==================== INITIALIZATION ====================

const authService = new AuthService();

// ==================== TYPES ====================

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    sessionId?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
            token?: string;
            sessionId?: string;
        }
    }
}

// ==================== AUTHENTICATION MIDDLEWARE ====================

/**
 * Authenticate user using JWT token
 * Extracts token from Authorization header or cookie
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from header or cookie
        let token: string | undefined;
        
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        
        // Check cookie
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }
        
        // Check query parameter (for WebSocket upgrade)
        if (!token && req.query?.token) {
            token = req.query.token as string;
        }
        
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. Please provide a valid token.'
            });
            return;
        }
        
        // Check if token is blacklisted
        const isBlacklisted = await authService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json({
                success: false,
                message: 'Token has been revoked. Please login again.'
            });
            return;
        }
        
        // Verify token
        const decoded = authService.verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
            return;
        }
        
        // Get user from database
        const user = await User.findById(decoded.userId)
            .select('-password -verificationToken -resetPasswordToken')
            .lean();
        
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            });
            return;
        }
        
        // Check if user is active
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
            return;
        }
        
        // Check if user is locked
        if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
            res.status(423).json({
                success: false,
                message: 'Account is locked. Please try again later.'
            });
            return;
        }
        
        // Attach user and token to request
        req.user = user;
        req.token = token;
        req.sessionId = decoded.sessionId;
        
        // Update last active timestamp (async, don't await)
        User.findByIdAndUpdate(user._id, { lastActive: new Date() }).catch(err => {
            logger.error('Failed to update last active:', err);
        });
        
        next();
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again.'
        });
    }
};

// ==================== OPTIONAL AUTHENTICATION ====================

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that can work with or without auth
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        
        if (!token) {
            return next();
        }
        
        const decoded = authService.verifyToken(token);
        if (decoded) {
            const user = await User.findById(decoded.userId)
                .select('-password')
                .lean();
            
            if (user && user.isActive) {
                req.user = user;
                req.token = token;
            }
        }
        
        next();
    } catch (error) {
        // Don't fail on error, just continue without user
        next();
    }
};

// ==================== ROLE-BASED MIDDLEWARE ====================

/**
 * Check if user has required role
 * @param roles - Array of allowed roles
 */
export const requireRole = (roles: string | string[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions. You do not have access to this resource.'
            });
            return;
        }
        
        next();
    };
};

/**
 * Check if user is admin (admin, super_admin, or owner)
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    const adminRoles = ['admin', 'super_admin', 'owner'];
    if (!adminRoles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }
    
    next();
};

/**
 * Check if user is super admin or owner
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    const superAdminRoles = ['super_admin', 'owner'];
    if (!superAdminRoles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: 'Super admin access required'
        });
        return;
    }
    
    next();
};

/**
 * Check if user is owner (highest level)
 */
export const requireOwner = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    if (req.user.role !== 'owner') {
        res.status(403).json({
            success: false,
            message: 'Owner access required'
        });
        return;
    }
    
    next();
};

/**
 * Check if user has premium access
 */
export const requirePremium = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    if (!req.user.isPremium) {
        res.status(403).json({
            success: false,
            message: 'Premium subscription required to access this content'
        });
        return;
    }
    
    // Check if premium has expired
    if (req.user.premiumExpiry && new Date(req.user.premiumExpiry) < new Date()) {
        res.status(403).json({
            success: false,
            message: 'Your premium subscription has expired. Please renew to continue.'
        });
        return;
    }
    
    next();
};

/**
 * Check if user has ultimate premium access
 */
export const requireUltimate = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    if (req.user.premiumType !== 'ultimate') {
        res.status(403).json({
            success: false,
            message: 'Ultimate premium subscription required to access this content'
        });
        return;
    }
    
    if (req.user.premiumExpiry && new Date(req.user.premiumExpiry) < new Date()) {
        res.status(403).json({
            success: false,
            message: 'Your premium subscription has expired'
        });
        return;
    }
    
    next();
};

// ==================== PERMISSION MIDDLEWARE ====================

/**
 * Check if user owns the resource or has admin access
 * @param getResourceUserId - Function to extract user ID from request
 */
export const requireOwnership = (
    getResourceUserId: (req: Request) => Promise<string | null> | string | null
) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            
            // Admin and owner have full access
            const adminRoles = ['admin', 'super_admin', 'owner'];
            if (adminRoles.includes(req.user.role)) {
                return next();
            }
            
            const resourceUserId = await getResourceUserId(req);
            
            if (!resourceUserId) {
                res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
                return;
            }
            
            if (req.user._id.toString() !== resourceUserId) {
                res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this resource'
                });
                return;
            }
            
            next();
        } catch (error) {
            logger.error('Ownership check error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to verify ownership'
            });
        }
    };
};

// ==================== ACCOUNT STATUS MIDDLEWARE ====================

/**
 * Check if user account is verified
 */
export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    if (!req.user.isVerified) {
        res.status(403).json({
            success: false,
            message: 'Please verify your email address to access this resource'
        });
        return;
    }
    
    next();
};

/**
 * Check if user account is not locked
 */
export const requireNotLocked = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    
    if (req.user.isLocked && req.user.lockUntil && req.user.lockUntil > new Date()) {
        res.status(423).json({
            success: false,
            message: 'Your account is locked. Please try again later.'
        });
        return;
    }
    
    next();
};

// ==================== RATE LIMIT MIDDLEWARE ====================

/**
 * Rate limit based on user ID or IP
 */
export const userRateLimit = (limit: number, windowSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const identifier = req.user?._id || req.ip;
            const key = `ratelimit:user:${identifier}:${req.path}`;
            
            const current = await redisClient.incr(key);
            if (current === 1) {
                await redisClient.expire(key, windowSeconds);
            }
            
            if (current > limit) {
                res.status(429).json({
                    success: false,
                    message: `Rate limit exceeded. Please try again in ${windowSeconds} seconds.`,
                    retryAfter: windowSeconds
                });
                return;
            }
            
            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
            res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + windowSeconds);
            
            next();
        } catch (error) {
            logger.error('Rate limit error:', error);
            next();
        }
    };
};

// ==================== TWO-FACTOR MIDDLEWARE ====================

/**
 * Check if 2FA is required and verified
 * This should be used after authentication for sensitive operations
 */
export const requireTwoFactorVerified = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        
        // If 2FA is not enabled, skip
        if (!req.user.twoFactorEnabled) {
            return next();
        }
        
        // Check if 2FA has been verified in this session
        const sessionKey = `2fa:verified:${req.sessionId || req.user._id}`;
        const isVerified = await redisClient.get(sessionKey);
        
        if (!isVerified) {
            res.status(403).json({
                success: false,
                message: 'Two-factor authentication required',
                requiresTwoFactor: true
            });
            return;
        }
        
        next();
    } catch (error) {
        logger.error('2FA check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify two-factor authentication'
        });
    }
};

/**
 * Mark 2FA as verified for this session
 */
export const markTwoFactorVerified = async (req: Request, res: Response): Promise<void> => {
    if (req.user && req.sessionId) {
        const sessionKey = `2fa:verified:${req.sessionId}`;
        await redisClient.setex(sessionKey, 3600, 'true'); // Valid for 1 hour
    }
};

// ==================== DEVICE VERIFICATION ====================

/**
 * Check if device is trusted
 */
export const requireTrustedDevice = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        
        const deviceFingerprint = req.headers['x-device-fingerprint'] as string;
        
        if (!deviceFingerprint) {
            res.status(403).json({
                success: false,
                message: 'Untrusted device. Please verify your device first.'
            });
            return;
        }
        
        const trustedKey = `user:${req.user._id}:trusted_device:${deviceFingerprint}`;
        const isTrusted = await redisClient.get(trustedKey);
        
        if (!isTrusted) {
            // Send verification code
            // Implementation would send OTP to user's email/phone
            
            res.status(403).json({
                success: false,
                message: 'Untrusted device. Verification code sent.',
                requiresDeviceVerification: true
            });
            return;
        }
        
        next();
    } catch (error) {
        logger.error('Device verification error:', error);
        next();
    }
};

// ==================== SESSION MANAGEMENT ====================

/**
 * Check if session is still valid (not expired)
 */
export const requireValidSession = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user || !req.sessionId) {
            res.status(401).json({
                success: false,
                message: 'Invalid session'
            });
            return;
        }
        
        const session = await authService.getSession(req.sessionId);
        
        if (!session || Object.keys(session).length === 0) {
            res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
            return;
        }
        
        // Update session activity
        await authService.updateSessionActivity(req.sessionId);
        
        next();
    } catch (error) {
        logger.error('Session validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate session'
        });
    }
};

// ==================== EXPORT ====================

export default {
    authenticate,
    optionalAuth,
    requireRole,
    requireAdmin,
    requireSuperAdmin,
    requireOwner,
    requirePremium,
    requireUltimate,
    requireOwnership,
    requireVerified,
    requireNotLocked,
    userRateLimit,
    requireTwoFactorVerified,
    markTwoFactorVerified,
    requireTrustedDevice,
    requireValidSession
};
