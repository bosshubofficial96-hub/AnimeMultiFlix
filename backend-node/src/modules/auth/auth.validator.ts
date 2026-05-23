/**
 * AnimeMultiFlix - Authentication Validator
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { User } from './auth.model';

// ==================== CUSTOM VALIDATORS ====================

/**
 * Check if email is already taken
 */
const isEmailUnique = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('Email is already registered');
    }
    return true;
};

/**
 * Check if username is already taken
 */
const isUsernameUnique = async (username: string): Promise<boolean> => {
    const user = await User.findOne({ username });
    if (user) {
        throw new Error('Username is already taken');
    }
    return true;
};

/**
 * Check if email exists in database
 */
const emailExists = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('No account found with this email');
    }
    return true;
};

/**
 * Check if user exists by ID
 */
const userExists = async (userId: string): Promise<boolean> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return true;
};

/**
 * Validate password strength
 */
const isStrongPassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 128;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isValidLength;
};

// ==================== REGISTRATION VALIDATORS ====================

export const registerValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(isUsernameUnique),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(isEmailUnique),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .custom(isStrongPassword)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('referralCode')
        .optional()
        .isString()
        .trim()
];

// ==================== LOGIN VALIDATORS ====================

export const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('rememberMe must be a boolean'),
    
    body('twoFactorToken')
        .optional()
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
        .isNumeric()
        .withMessage('2FA token must contain only numbers')
];

// ==================== REFRESH TOKEN VALIDATORS ====================

export const refreshTokenValidator = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isJWT()
        .withMessage('Invalid refresh token format')
];

// ==================== EMAIL VERIFICATION VALIDATORS ====================

export const verifyEmailValidator = [
    body('token')
        .notEmpty()
        .withMessage('Verification token is required')
        .isLength({ min: 32, max: 64 })
        .withMessage('Invalid verification token format')
];

export const resendVerificationValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(emailExists)
];

// ==================== PASSWORD RESET VALIDATORS ====================

export const forgotPasswordValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(emailExists)
];

export const resetPasswordValidator = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required')
        .isLength({ min: 32, max: 64 })
        .withMessage('Invalid reset token format'),
    
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .custom(isStrongPassword)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')
];

// ==================== CHANGE PASSWORD VALIDATORS ====================

export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .custom(isStrongPassword)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')
];

// ==================== TWO-FACTOR AUTH VALIDATORS ====================

export const enable2FAValidator = [
    body('token')
        .optional()
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
        .isNumeric()
        .withMessage('2FA token must contain only numbers')
];

export const verify2FAValidator = [
    body('token')
        .notEmpty()
        .withMessage('2FA token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
        .isNumeric()
        .withMessage('2FA token must contain only numbers')
];

export const disable2FAValidator = [
    body('token')
        .notEmpty()
        .withMessage('2FA token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('2FA token must be 6 digits')
        .isNumeric()
        .withMessage('2FA token must contain only numbers')
];

// ==================== PROFILE UPDATE VALIDATORS ====================

export const updateProfileValidator = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(async (username, { req }) => {
            const user = await User.findOne({ username, _id: { $ne: req.user._id } });
            if (user) {
                throw new Error('Username is already taken');
            }
            return true;
        }),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const user = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (user) {
                throw new Error('Email is already registered');
            }
            return true;
        }),
    
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    
    body('cover')
        .optional()
        .isURL()
        .withMessage('Cover image must be a valid URL')
];

// ==================== PREFERENCES VALIDATORS ====================

export const updatePreferencesValidator = [
    body('language')
        .optional()
        .isString()
        .isLength({ min: 2, max: 5 })
        .withMessage('Language code must be valid'),
    
    body('theme')
        .optional()
        .isIn(['dark', 'light', 'auto'])
        .withMessage('Theme must be dark, light, or auto'),
    
    body('notifications.email')
        .optional()
        .isBoolean()
        .withMessage('Email notification setting must be boolean'),
    
    body('notifications.push')
        .optional()
        .isBoolean()
        .withMessage('Push notification setting must be boolean'),
    
    body('notifications.sms')
        .optional()
        .isBoolean()
        .withMessage('SMS notification setting must be boolean'),
    
    body('notifications.inApp')
        .optional()
        .isBoolean()
        .withMessage('In-app notification setting must be boolean'),
    
    body('privacy.showEmail')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.showLastSeen')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.showOnline')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.readReceipts')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.allowFriendRequests')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('playback.defaultQuality')
        .optional()
        .isIn(['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', 'auto'])
        .withMessage('Invalid quality setting'),
    
    body('playback.autoplayNext')
        .optional()
        .isBoolean()
        .withMessage('Autoplay setting must be boolean'),
    
    body('playback.skipIntro')
        .optional()
        .isBoolean()
        .withMessage('Skip intro setting must be boolean'),
    
    body('playback.skipOutro')
        .optional()
        .isBoolean()
        .withMessage('Skip outro setting must be boolean'),
    
    body('playback.defaultSubtitleLanguage')
        .optional()
        .isString()
        .isLength({ min: 2, max: 5 })
        .withMessage('Language code must be valid'),
    
    body('playback.defaultAudioLanguage')
        .optional()
        .isString()
        .isLength({ min: 2, max: 5 })
        .withMessage('Language code must be valid')
];

// ==================== USER ID VALIDATOR ====================

export const userIdValidator = [
    param('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid user ID format')
        .custom(userExists)
];

// ==================== EMAIL VALIDATOR ====================

export const emailValidator = [
    query('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

// ==================== VALIDATION RESULT HANDLER ====================

/**
 * Middleware to check validation results and return errors
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
        return;
    }
    
    next();
};

// ==================== EXPORT ====================

export default {
    registerValidator,
    loginValidator,
    refreshTokenValidator,
    verifyEmailValidator,
    resendVerificationValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    changePasswordValidator,
    enable2FAValidator,
    verify2FAValidator,
    disable2FAValidator,
    updateProfileValidator,
    updatePreferencesValidator,
    userIdValidator,
    emailValidator,
    validate
};
