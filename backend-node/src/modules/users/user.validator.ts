/**
 * AnimeMultiFlix - User Validator
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import User from './user.model';

// ==================== CUSTOM VALIDATORS ====================

/**
 * Check if email is already taken (excluding current user)
 */
const isEmailUnique = (userId?: string) => {
    return async (email: string) => {
        const query: any = { email };
        if (userId) {
            query._id = { $ne: userId };
        }
        const user = await User.findOne(query);
        if (user) {
            throw new Error('Email is already taken');
        }
        return true;
    };
};

/**
 * Check if username is already taken (excluding current user)
 */
const isUsernameUnique = (userId?: string) => {
    return async (username: string) => {
        const query: any = { username };
        if (userId) {
            query._id = { $ne: userId };
        }
        const user = await User.findOne(query);
        if (user) {
            throw new Error('Username is already taken');
        }
        return true;
    };
};

/**
 * Check if user exists
 */
const userExists = async (userId: string) => {
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

// ==================== PROFILE VALIDATORS ====================

export const updateProfileValidator = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(isUsernameUnique(req.user?.id)),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(isEmailUnique(req.user?.id)),
    
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
        .withMessage('Cover image must be a valid URL'),
    
    body('birthday')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
        .withMessage('Invalid gender value'),
    
    body('location')
        .optional()
        .isString()
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),
    
    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL')
];

// ==================== SETTINGS VALIDATORS ====================

export const updateSettingsValidator = [
    body('language')
        .optional()
        .isString()
        .isLength({ min: 2, max: 5 })
        .withMessage('Language code must be valid'),
    
    body('theme')
        .optional()
        .isIn(['dark', 'light', 'auto'])
        .withMessage('Theme must be dark, light, or auto'),
    
    body('timezone')
        .optional()
        .isString()
        .withMessage('Timezone must be a valid string'),
    
    body('dateFormat')
        .optional()
        .isString()
        .withMessage('Date format must be a valid string'),
    
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
    
    body('notifications.marketing')
        .optional()
        .isBoolean()
        .withMessage('Marketing notification setting must be boolean'),
    
    body('privacy.showEmail')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.showPhone')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.showBirthday')
        .optional()
        .isBoolean()
        .withMessage('Privacy setting must be boolean'),
    
    body('privacy.showLocation')
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
    
    body('privacy.allowMessages')
        .optional()
        .isIn(['everyone', 'friends', 'nobody'])
        .withMessage('Allow messages must be everyone, friends, or nobody'),
    
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
        .withMessage('Language code must be valid'),
    
    body('playback.volume')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Volume must be between 0 and 1'),
    
    body('playback.playbackSpeed')
        .optional()
        .isFloat({ min: 0.25, max: 4 })
        .withMessage('Playback speed must be between 0.25 and 4')
];

// ==================== PASSWORD VALIDATORS ====================

export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
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

// ==================== ACCOUNT DELETE VALIDATORS ====================

export const deleteAccountValidator = [
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('reason')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters')
];

// ==================== WATCHLIST VALIDATORS ====================

export const watchlistValidator = [
    param('animeId')
        .isMongoId()
        .withMessage('Invalid anime ID format')
];

export const favoritesValidator = [
    param('animeId')
        .isMongoId()
        .withMessage('Invalid anime ID format')
];

// ==================== USER ID VALIDATOR ====================

export const userIdValidator = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format')
        .custom(userExists)
];

// ==================== SEARCH VALIDATORS ====================

export const searchUsersValidator = [
    query('q')
        .notEmpty()
        .withMessage('Search query is required')
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be at least 1')
];

// ==================== REGISTRATION VALIDATORS (Extended) ====================

export const registerValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(isUsernameUnique()),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(isEmailUnique()),
    
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
        .trim(),
    
    body('acceptTerms')
        .isBoolean()
        .withMessage('You must accept the terms and conditions')
        .custom(value => value === true)
        .withMessage('You must accept the terms and conditions'),
    
    body('acceptPrivacy')
        .isBoolean()
        .withMessage('You must accept the privacy policy')
        .custom(value => value === true)
        .withMessage('You must accept the privacy policy')
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
        .withMessage('rememberMe must be a boolean')
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
    updateProfileValidator,
    updateSettingsValidator,
    changePasswordValidator,
    deleteAccountValidator,
    watchlistValidator,
    favoritesValidator,
    userIdValidator,
    searchUsersValidator,
    registerValidator,
    loginValidator,
    validate
};
