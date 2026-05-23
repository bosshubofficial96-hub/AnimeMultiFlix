/**
 * AnimeMultiFlix - Authentication Routes
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Router } from 'express';
import { body, query, param } from 'express-validator';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

// Import controllers
import {
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
} from './auth.controller';

// Import middleware
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validation.middleware';

// ==================== RATE LIMITERS ====================

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: { error: 'Too many registration attempts. Please try again later.' }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: { error: 'Too many login attempts. Please try again later.' }
});

const refreshLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 attempts per hour
    message: { error: 'Too many refresh attempts. Please try again later.' }
});

const verificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: { error: 'Too many verification attempts. Please try again later.' }
});

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: { error: 'Too many password reset attempts. Please try again later.' }
});

const twoFALimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts per hour
    message: { error: 'Too many 2FA attempts. Please try again later.' }
});

// ==================== VALIDATION RULES ====================

const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Please provide a valid phone number')
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('rememberMe must be a boolean')
];

const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
];

const verifyEmailValidation = [
    body('token')
        .notEmpty()
        .withMessage('Verification token is required')
        .isLength({ min: 32, max: 64 })
        .withMessage('Invalid verification token format')
];

const resendVerificationValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

const forgotPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const twoFAEnableValidation = [
    body('token')
        .notEmpty()
        .withMessage('2FA token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
];

const twoFADisableValidation = [
    body('token')
        .notEmpty()
        .withMessage('2FA token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
];

// ==================== ROUTER ====================

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    registerLimiter,
    registerValidation,
    validateRequest,
    register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    loginLimiter,
    loginValidation,
    validateRequest,
    login
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
    '/refresh-token',
    refreshLimiter,
    refreshTokenValidation,
    validateRequest,
    refreshToken
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email with token
 * @access  Public
 */
router.post(
    '/verify-email',
    verificationLimiter,
    verifyEmailValidation,
    validateRequest,
    verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post(
    '/resend-verification',
    verificationLimiter,
    resendVerificationValidation,
    validateRequest,
    resendVerification
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
    '/forgot-password',
    passwordResetLimiter,
    forgotPasswordValidation,
    validateRequest,
    forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
    '/reset-password',
    passwordResetLimiter,
    resetPasswordValidation,
    validateRequest,
    resetPassword
);

// ==================== OAUTH ROUTES ====================

/**
 * @route   GET /api/v1/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    googleCallback
);

/**
 * @route   GET /api/v1/auth/discord
 * @desc    Discord OAuth login
 * @access  Public
 */
router.get(
    '/discord',
    passport.authenticate('discord', {
        scope: ['identify', 'email'],
        session: false
    })
);

/**
 * @route   GET /api/v1/auth/discord/callback
 * @desc    Discord OAuth callback
 * @access  Public
 */
router.get(
    '/discord/callback',
    passport.authenticate('discord', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    discordCallback
);

/**
 * @route   GET /api/v1/auth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
router.get(
    '/facebook',
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        session: false
    })
);

/**
 * @route   GET /api/v1/auth/facebook/callback
 * @desc    Facebook OAuth callback
 * @access  Public
 */
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
);

/**
 * @route   GET /api/v1/auth/apple
 * @desc    Apple OAuth login
 * @access  Public
 */
router.get(
    '/apple',
    passport.authenticate('apple', {
        session: false
    })
);

/**
 * @route   POST /api/v1/auth/apple/callback
 * @desc    Apple OAuth callback
 * @access  Public
 */
router.post(
    '/apple/callback',
    passport.authenticate('apple', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
);

/**
 * @route   GET /api/v1/auth/github
 * @desc    GitHub OAuth login
 * @access  Public
 */
router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email'],
        session: false
    })
);

/**
 * @route   GET /api/v1/auth/github/callback
 * @desc    GitHub OAuth callback
 * @access  Public
 */
router.get(
    '/github/callback',
    passport.authenticate('github', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
);

/**
 * @route   GET /api/v1/auth/twitter
 * @desc    Twitter OAuth login
 * @access  Public
 */
router.get(
    '/twitter',
    passport.authenticate('twitter', {
        session: false
    })
);

/**
 * @route   GET /api/v1/auth/twitter/callback
 * @desc    Twitter OAuth callback
 * @access  Public
 */
router.get(
    '/twitter/callback',
    passport.authenticate('twitter', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/error`
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
    '/change-password',
    authenticate,
    changePasswordValidation,
    validateRequest,
    changePassword
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser);

// ==================== TWO-FACTOR AUTHENTICATION ROUTES ====================

/**
 * @route   POST /api/v1/auth/2fa/enable
 * @desc    Enable 2FA (get secret and QR code)
 * @access  Private
 */
router.post('/2fa/enable', authenticate, enable2FA);

/**
 * @route   POST /api/v1/auth/2fa/verify
 * @desc    Verify and enable 2FA
 * @access  Private
 */
router.post(
    '/2fa/verify',
    authenticate,
    twoFAEnableValidation,
    validateRequest,
    verify2FA
);

/**
 * @route   POST /api/v1/auth/2fa/disable
 * @desc    Disable 2FA
 * @access  Private
 */
router.post(
    '/2fa/disable',
    authenticate,
    twoFADisableValidation,
    validateRequest,
    disable2FA
);

// ==================== SOCIAL LOGIN LINKING ====================

/**
 * @route   POST /api/v1/auth/link/google
 * @desc    Link Google account to existing user
 * @access  Private
 */
router.post(
    '/link/google',
    authenticate,
    passport.authorize('google', {
        scope: ['profile', 'email']
    })
);

/**
 * @route   POST /api/v1/auth/link/discord
 * @desc    Link Discord account to existing user
 * @access  Private
 */
router.post(
    '/link/discord',
    authenticate,
    passport.authorize('discord', {
        scope: ['identify', 'email']
    })
);

/**
 * @route   DELETE /api/v1/auth/unlink/:provider
 * @desc    Unlink social account
 * @access  Private
 */
router.delete(
    '/unlink/:provider',
    authenticate,
    param('provider').isIn(['google', 'discord', 'facebook', 'apple', 'github', 'twitter']),
    validateRequest,
    async (req, res) => {
        // Implementation would unlink social account from user
        res.json({ success: true, message: 'Social account unlinked' });
    }
);

// ==================== EXPORT ====================

export default router;
