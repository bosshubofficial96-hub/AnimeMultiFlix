/**
 * AnimeMultiFlix - User Routes
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';
import path from 'path';

// Import controllers
import {
    getCurrentUser,
    getUserById,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getWatchHistory,
    clearWatchHistory,
    getSettings,
    updateSettings,
    changePassword,
    getUserStats,
    searchUsers
} from './user.controller';

// Import middleware
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../auth/auth.validator';
import { rateLimit } from 'express-rate-limit';

// ==================== MULTER CONFIGURATION ====================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `avatar-${req.user?.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, JPG, WEBP are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ==================== RATE LIMITERS ====================

const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: { error: 'Too many search requests. Please try again later.' }
});

const updateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: { error: 'Too many update requests. Please try again later.' }
});

const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: { error: 'Too many password change attempts. Please try again later.' }
});

// ==================== VALIDATION RULES ====================

const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Please provide a valid phone number'),
    
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

const updateSettingsValidation = [
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

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')
];

const deleteAccountValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('reason')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters')
];

const watchlistValidation = [
    param('animeId')
        .isMongoId()
        .withMessage('Invalid anime ID format')
];

const searchValidation = [
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

const userIdValidation = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format')
];

// ==================== ROUTER ====================

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ==================== PROFILE ROUTES ====================

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', getCurrentUser);

/**
 * @route   GET /api/v1/users/:userId
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:userId', userIdValidation, validate, getUserById);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
    '/profile',
    updateLimiter,
    updateProfileValidation,
    validate,
    updateProfile
);

/**
 * @route   POST /api/v1/users/avatar
 * @desc    Upload avatar
 * @access  Private
 */
router.post('/avatar', upload.single('avatar'), uploadAvatar);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete account
 * @access  Private
 */
router.delete(
    '/account',
    deleteAccountValidation,
    validate,
    deleteAccount
);

// ==================== WATCHLIST ROUTES ====================

/**
 * @route   GET /api/v1/users/watchlist
 * @desc    Get user watchlist
 * @access  Private
 */
router.get('/watchlist', getWatchlist);

/**
 * @route   POST /api/v1/users/watchlist/:animeId
 * @desc    Add to watchlist
 * @access  Private
 */
router.post(
    '/watchlist/:animeId',
    watchlistValidation,
    validate,
    addToWatchlist
);

/**
 * @route   DELETE /api/v1/users/watchlist/:animeId
 * @desc    Remove from watchlist
 * @access  Private
 */
router.delete(
    '/watchlist/:animeId',
    watchlistValidation,
    validate,
    removeFromWatchlist
);

// ==================== FAVORITES ROUTES ====================

/**
 * @route   GET /api/v1/users/favorites
 * @desc    Get user favorites
 * @access  Private
 */
router.get('/favorites', getFavorites);

/**
 * @route   POST /api/v1/users/favorites/:animeId
 * @desc    Add to favorites
 * @access  Private
 */
router.post(
    '/favorites/:animeId',
    watchlistValidation,
    validate,
    addToFavorites
);

/**
 * @route   DELETE /api/v1/users/favorites/:animeId
 * @desc    Remove from favorites
 * @access  Private
 */
router.delete(
    '/favorites/:animeId',
    watchlistValidation,
    validate,
    removeFromFavorites
);

// ==================== WATCH HISTORY ROUTES ====================

/**
 * @route   GET /api/v1/users/history
 * @desc    Get watch history
 * @access  Private
 */
router.get('/history', getWatchHistory);

/**
 * @route   DELETE /api/v1/users/history
 * @desc    Clear watch history
 * @access  Private
 */
router.delete('/history', clearWatchHistory);

// ==================== SETTINGS ROUTES ====================

/**
 * @route   GET /api/v1/users/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/settings', getSettings);

/**
 * @route   PUT /api/v1/users/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put(
    '/settings',
    updateLimiter,
    updateSettingsValidation,
    validate,
    updateSettings
);

// ==================== PASSWORD ROUTES ====================

/**
 * @route   POST /api/v1/users/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
    '/change-password',
    passwordLimiter,
    changePasswordValidation,
    validate,
    changePassword
);

// ==================== STATISTICS ROUTES ====================

/**
 * @route   GET /api/v1/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', getUserStats);

// ==================== SEARCH ROUTES ====================

/**
 * @route   GET /api/v1/users/search
 * @desc    Search users
 * @access  Private
 */
router.get('/search', searchLimiter, searchValidation, validate, searchUsers);

// ==================== EXPORT ====================

export default router;
