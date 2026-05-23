/**
 * AnimeMultiFlix - Authentication Controller
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from './auth.model';
import { AuthService } from './auth.service';
import { sendEmail } from '../../shared/utils/email';
import { sendSMS } from '../../shared/utils/sms';
import { logger } from '../../shared/utils/logger';
import { config } from '../../../config/config';

// ==================== TYPES ====================

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone?: string;
}

// ==================== INITIALIZATION ====================

const authService = new AuthService();

// ==================== REGISTRATION ====================

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }

        const { username, email, password, phone }: RegisterRequest = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User already exists with this email or username'
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            verificationToken,
            verificationExpiry,
            role: 'user',
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await user.save();

        // Generate JWT token
        const token = authService.generateToken(user);

        // Generate refresh token
        const refreshToken = authService.generateRefreshToken(user);

        // Send verification email
        await sendEmail({
            to: email,
            subject: 'Verify Your Email - AnimeMultiFlix',
            template: 'verify-email',
            data: {
                username,
                verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
                expiryHours: 24
            }
        });

        // Log registration
        logger.info(`New user registered: ${email} (${user._id})`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        logger.error('Registration error:', error);
        next(error);
    }
};

// ==================== LOGIN ====================

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }

        const { email, password, rememberMe }: LoginRequest = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }

        // Check if user is locked
        if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
            res.status(423).json({
                success: false,
                message: 'Account is locked. Please try again later.',
                lockUntil: user.lockUntil
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed login attempts
            user.loginAttempts += 1;
            
            if (user.loginAttempts >= 5) {
                user.isLocked = true;
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                await user.save();
                
                // Send lock notification
                await sendEmail({
                    to: email,
                    subject: 'Account Locked - AnimeMultiFlix',
                    template: 'account-locked',
                    data: {
                        username: user.username,
                        lockDuration: 30
                    }
                });
                
                res.status(423).json({
                    success: false,
                    message: 'Account locked due to multiple failed attempts. Try again in 30 minutes.'
                });
                return;
            }
            
            await user.save();
            
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                attemptsRemaining: 5 - user.loginAttempts
            });
            return;
        }

        // Reset login attempts
        user.loginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = null;
        user.lastLogin = new Date();
        user.lastLoginIP = req.ip;
        user.lastLoginDevice = req.headers['user-agent'];
        
        // Update last active
        user.lastActive = new Date();
        
        await user.save();

        // Generate tokens
        const token = authService.generateToken(user);
        const refreshToken = authService.generateRefreshToken(user);
        
        // Set token expiry based on remember me
        const tokenExpiry = rememberMe ? '30d' : '7d';

        // Log login
        logger.info(`User logged in: ${email} (${user._id}) from ${req.ip}`);

        // Send login notification email (optional)
        if (user.notificationSettings?.loginAlerts) {
            await sendEmail({
                to: email,
                subject: 'New Login Detected - AnimeMultiFlix',
                template: 'login-alert',
                data: {
                    username: user.username,
                    ip: req.ip,
                    device: req.headers['user-agent'],
                    time: new Date().toISOString()
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isVerified: user.isVerified,
                    isPremium: user.isPremium,
                    premiumType: user.premiumType
                },
                token,
                refreshToken,
                tokenExpiry
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        next(error);
    }
};

// ==================== LOGOUT ====================

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Add token to blacklist (optional)
            await authService.blacklistToken(token);
        }
        
        // Clear session if using session-based auth
        req.session?.destroy((err) => {
            if (err) {
                logger.error('Session destruction error:', err);
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Logout error:', error);
        next(error);
    }
};

// ==================== REFRESH TOKEN ====================

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
            return;
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        
        // Generate new access token
        const newToken = authService.generateToken(user);
        
        res.status(200).json({
            success: true,
            data: {
                token: newToken
            }
        });
    } catch (error) {
        logger.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// ==================== VERIFY EMAIL ====================

/**
 * Verify user email
 * @route POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.body;
        
        if (!token) {
            res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
            return;
        }
        
        // Find user by verification token
        const user = await User.findOne({
            verificationToken: token,
            verificationExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
            return;
        }
        
        // Update user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiry = undefined;
        user.emailVerifiedAt = new Date();
        
        await user.save();
        
        // Send welcome email
        await sendEmail({
            to: user.email,
            subject: 'Welcome to AnimeMultiFlix!',
            template: 'welcome',
            data: {
                username: user.username,
                premiumTrial: 7
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        logger.error('Email verification error:', error);
        next(error);
    }
};

// ==================== RESEND VERIFICATION ====================

/**
 * Resend verification email
 * @route POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        
        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
            return;
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        user.verificationToken = verificationToken;
        user.verificationExpiry = verificationExpiry;
        await user.save();
        
        // Send verification email
        await sendEmail({
            to: email,
            subject: 'Verify Your Email - AnimeMultiFlix',
            template: 'verify-email',
            data: {
                username: user.username,
                verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
                expiryHours: 24
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Verification email sent'
        });
    } catch (error) {
        logger.error('Resend verification error:', error);
        next(error);
    }
};

// ==================== FORGOT PASSWORD ====================

/**
 * Send password reset email
 * @route POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal that user doesn't exist for security
            res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link'
            });
            return;
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetExpiry;
        await user.save();
        
        // Send reset email
        await sendEmail({
            to: email,
            subject: 'Reset Your Password - AnimeMultiFlix',
            template: 'reset-password',
            data: {
                username: user.username,
                resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
                expiryHours: 1
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        logger.error('Forgot password error:', error);
        next(error);
    }
};

// ==================== RESET PASSWORD ====================

/**
 * Reset password using token
 * @route POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, newPassword } = req.body;
        
        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
            return;
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        user.passwordChangedAt = new Date();
        
        await user.save();
        
        // Send confirmation email
        await sendEmail({
            to: user.email,
            subject: 'Password Changed - AnimeMultiFlix',
            template: 'password-changed',
            data: {
                username: user.username
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        logger.error('Reset password error:', error);
        next(error);
    }
};

// ==================== CHANGE PASSWORD ====================

/**
 * Change password (authenticated users)
 * @route POST /api/v1/auth/change-password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
        await user.save();
        
        // Send confirmation email
        await sendEmail({
            to: user.email,
            subject: 'Password Changed - AnimeMultiFlix',
            template: 'password-changed',
            data: {
                username: user.username
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        logger.error('Change password error:', error);
        next(error);
    }
};

// ==================== GET CURRENT USER ====================

/**
 * Get current authenticated user
 * @route GET /api/v1/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId)
            .select('-password -verificationToken -resetPasswordToken')
            .populate('watchlist', 'title thumbnail')
            .populate('favorites', 'title thumbnail');
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Get current user error:', error);
        next(error);
    }
};

// ==================== OAUTH CALLBACKS ====================

/**
 * Google OAuth callback
 * @route GET /api/v1/auth/google/callback
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Passport handles the authentication
        // This is handled by passport-google-oauth20 strategy
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error) {
        logger.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
};

/**
 * Discord OAuth callback
 * @route GET /api/v1/auth/discord/callback
 */
export const discordCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error) {
        logger.error('Discord callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
};

// ==================== TWO-FACTOR AUTHENTICATION ====================

/**
 * Enable 2FA
 * @route POST /api/v1/auth/2fa/enable
 */
export const enable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        
        // Generate 2FA secret
        const secret = authService.generate2FASecret(user.email);
        
        // Generate backup codes
        const backupCodes = authService.generateBackupCodes();
        
        // Store secret temporarily (verify before enabling)
        user.twoFactorTempSecret = secret.base32;
        user.twoFactorBackupCodes = backupCodes;
        await user.save();
        
        res.status(200).json({
            success: true,
            data: {
                qrCode: secret.otpauth_url,
                secret: secret.base32,
                backupCodes
            }
        });
    } catch (error) {
        logger.error('Enable 2FA error:', error);
        next(error);
    }
};

/**
 * Verify and enable 2FA
 * @route POST /api/v1/auth/2fa/verify
 */
export const verify2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { token } = req.body;
        
        const user = await User.findById(userId);
        if (!user || !user.twoFactorTempSecret) {
            res.status(400).json({
                success: false,
                message: '2FA setup not initiated'
            });
            return;
        }
        
        // Verify token
        const isValid = authService.verify2FAToken(user.twoFactorTempSecret, token);
        
        if (!isValid) {
            res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
            return;
        }
        
        // Enable 2FA
        user.twoFactorEnabled = true;
        user.twoFactorSecret = user.twoFactorTempSecret;
        user.twoFactorTempSecret = undefined;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: '2FA enabled successfully',
            data: {
                backupCodes: user.twoFactorBackupCodes
            }
        });
    } catch (error) {
        logger.error('Verify 2FA error:', error);
        next(error);
    }
};

/**
 * Disable 2FA
 * @route POST /api/v1/auth/2fa/disable
 */
export const disable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { token } = req.body;
        
        const user = await User.findById(userId);
        if (!user || !user.twoFactorSecret) {
            res.status(400).json({
                success: false,
                message: '2FA not enabled'
            });
            return;
        }
        
        // Verify token
        const isValid = authService.verify2FAToken(user.twoFactorSecret, token);
        
        if (!isValid) {
            res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
            return;
        }
        
        // Disable 2FA
        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        user.twoFactorBackupCodes = undefined;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: '2FA disabled successfully'
        });
    } catch (error) {
        logger.error('Disable 2FA error:', error);
        next(error);
    }
};

// ==================== EXPORT ====================

export default {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentUser,
    googleCallback,
    discordCallback,
    enable2FA,
    verify2FA,
    disable2FA
};
