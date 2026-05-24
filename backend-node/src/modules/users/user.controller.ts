/**
 * AnimeMultiFlix - User Controller
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from './user.model';
import { UserService } from './user.service';
import { logger } from '../../shared/utils/logger';
import { sendEmail } from '../../shared/utils/email';
import { queueNotification } from '../auth/auth.queue';
import { IUserResponse, IUpdateProfileRequest, IChangePasswordRequest } from './user.types';

const userService = new UserService();

// ==================== PROFILE MANAGEMENT ====================

/**
 * Get current user profile
 * @route GET /api/v1/users/me
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId)
            .select('-password -verificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes')
            .populate('watchlist', 'title thumbnail rating episodesCount')
            .populate('favorites', 'title thumbnail rating')
            .populate('watchHistory', 'animeId episodeId watchedAt progress')
            .lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Check if user is online
        const isOnline = await userService.isUserOnline(userId);
        
        res.status(200).json({
            success: true,
            data: {
                ...user,
                isOnline
            }
        });
    } catch (error) {
        logger.error('Get current user error:', error);
        next(error);
    }
};

/**
 * Get user by ID
 * @route GET /api/v1/users/:userId
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
            return;
        }

        const user = await User.findById(userId)
            .select('-password -verificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes -email -phone')
            .populate('watchlist', 'title thumbnail rating')
            .populate('favorites', 'title thumbnail rating')
            .lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Check privacy settings
        const requestingUserId = req.user?.id;
        const showEmail = user.preferences?.privacy?.showEmail && requestingUserId === userId;
        
        res.status(200).json({
            success: true,
            data: {
                ...user,
                email: showEmail ? user.email : undefined
            }
        });
    } catch (error) {
        logger.error('Get user by ID error:', error);
        next(error);
    }
};

/**
 * Update user profile
 * @route PUT /api/v1/users/profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates: IUpdateProfileRequest = req.body;
        
        // Remove sensitive fields
        delete updates.email;
        delete updates.password;
        delete updates.role;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password -verificationToken -resetPasswordToken');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Queue profile update notification
        await queueNotification('profile_update', {
            userId,
            email: user.email,
            username: user.username,
            changes: updates
        });

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        next(error);
    }
};

/**
 * Upload avatar
 * @route POST /api/v1/users/avatar
 */
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
            return;
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        ).select('avatar');

        res.status(200).json({
            success: true,
            data: { avatar: user?.avatar },
            message: 'Avatar uploaded successfully'
        });
    } catch (error) {
        logger.error('Upload avatar error:', error);
        next(error);
    }
};

/**
 * Delete account
 * @route DELETE /api/v1/users/account
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { password, reason } = req.body;
        
        const user = await User.findById(userId).select('+password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
            return;
        }

        // Soft delete - mark as deleted
        user.isActive = false;
        user.deletedAt = new Date();
        user.deletionReason = reason;
        await user.save();

        // Clear sessions
        await userService.clearUserSessions(userId);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        logger.error('Delete account error:', error);
        next(error);
    }
};

// ==================== WATCHLIST MANAGEMENT ====================

/**
 * Get user watchlist
 * @route GET /api/v1/users/watchlist
 */
export const getWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId)
            .populate('watchlist', 'title thumbnail rating episodesCount status')
            .lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user.watchlist,
            count: user.watchlist.length
        });
    } catch (error) {
        logger.error('Get watchlist error:', error);
        next(error);
    }
};

/**
 * Add to watchlist
 * @route POST /api/v1/users/watchlist/:animeId
 */
export const addToWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { animeId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(animeId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid anime ID format'
            });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (!user.watchlist.includes(animeId as any)) {
            user.watchlist.push(animeId as any);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Added to watchlist'
        });
    } catch (error) {
        logger.error('Add to watchlist error:', error);
        next(error);
    }
};

/**
 * Remove from watchlist
 * @route DELETE /api/v1/users/watchlist/:animeId
 */
export const removeFromWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { animeId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Removed from watchlist'
        });
    } catch (error) {
        logger.error('Remove from watchlist error:', error);
        next(error);
    }
};

// ==================== FAVORITES MANAGEMENT ====================

/**
 * Get user favorites
 * @route GET /api/v1/users/favorites
 */
export const getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId)
            .populate('favorites', 'title thumbnail rating episodesCount')
            .lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user.favorites,
            count: user.favorites.length
        });
    } catch (error) {
        logger.error('Get favorites error:', error);
        next(error);
    }
};

/**
 * Add to favorites
 * @route POST /api/v1/users/favorites/:animeId
 */
export const addToFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { animeId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (!user.favorites.includes(animeId as any)) {
            user.favorites.push(animeId as any);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Added to favorites'
        });
    } catch (error) {
        logger.error('Add to favorites error:', error);
        next(error);
    }
};

/**
 * Remove from favorites
 * @route DELETE /api/v1/users/favorites/:animeId
 */
export const removeFromFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { animeId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        user.favorites = user.favorites.filter(id => id.toString() !== animeId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Removed from favorites'
        });
    } catch (error) {
        logger.error('Remove from favorites error:', error);
        next(error);
    }
};

// ==================== WATCH HISTORY ====================

/**
 * Get watch history
 * @route GET /api/v1/users/history
 */
export const getWatchHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { limit = 50, page = 1 } = req.query;

        const user = await User.findById(userId)
            .populate({
                path: 'watchHistory',
                populate: {
                    path: 'animeId episodeId',
                    select: 'title thumbnail episodeNumber'
                },
                options: {
                    sort: { watchedAt: -1 },
                    limit: Number(limit),
                    skip: (Number(page) - 1) * Number(limit)
                }
            })
            .lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const total = user.watchHistory.length;

        res.status(200).json({
            success: true,
            data: user.watchHistory,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        logger.error('Get watch history error:', error);
        next(error);
    }
};

/**
 * Clear watch history
 * @route DELETE /api/v1/users/history
 */
export const clearWatchHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        await User.findByIdAndUpdate(userId, { watchHistory: [] });

        res.status(200).json({
            success: true,
            message: 'Watch history cleared'
        });
    } catch (error) {
        logger.error('Clear watch history error:', error);
        next(error);
    }
};

// ==================== USER SETTINGS ====================

/**
 * Get user settings
 * @route GET /api/v1/users/settings
 */
export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId).select('preferences').lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user.preferences
        });
    } catch (error) {
        logger.error('Get settings error:', error);
        next(error);
    }
};

/**
 * Update user settings
 * @route PUT /api/v1/users/settings
 */
export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Deep merge preferences
        user.preferences = {
            ...user.preferences,
            ...updates,
            notifications: { ...user.preferences.notifications, ...updates.notifications },
            privacy: { ...user.preferences.privacy, ...updates.privacy },
            playback: { ...user.preferences.playback, ...updates.playback }
        };
        
        await user.save();

        res.status(200).json({
            success: true,
            data: user.preferences,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        logger.error('Update settings error:', error);
        next(error);
    }
};

// ==================== CHANGE PASSWORD ====================

/**
 * Change password
 * @route POST /api/v1/users/change-password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword }: IChangePasswordRequest = req.body;

        const user = await User.findById(userId).select('+password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Verify current password
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }

        // Update password
        user.password = newPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        // Send notification
        await sendEmail({
            to: user.email,
            subject: 'Password Changed - AnimeMultiFlix',
            template: 'password-changed',
            data: {
                username: user.username,
                time: new Date().toISOString()
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

// ==================== USER STATISTICS ====================

/**
 * Get user statistics
 * @route GET /api/v1/users/stats
 */
export const getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const user = await User.findById(userId).select('watchStats loginCount createdAt lastActive').lean();

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Calculate watch time in hours
        const totalHours = Math.floor(user.watchStats.totalHours);
        const totalMinutes = Math.floor((user.watchStats.totalHours - totalHours) * 60);

        res.status(200).json({
            success: true,
            data: {
                watchStats: {
                    ...user.watchStats,
                    totalHoursDisplay: `${totalHours}h ${totalMinutes}m`
                },
                loginCount: user.loginCount,
                memberSince: user.createdAt,
                lastActive: user.lastActive,
                accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            }
        });
    } catch (error) {
        logger.error('Get user stats error:', error);
        next(error);
    }
};

// ==================== SEARCH USERS ====================

/**
 * Search users
 * @route GET /api/v1/users/search
 */
export const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { q, limit = 20, page = 1 } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
            return;
        }

        const query = {
            isActive: true,
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } }
            ]
        };

        const users = await User.find(query)
            .select('username avatar bio watchStats followersCount')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        logger.error('Search users error:', error);
        next(error);
    }
};

// ==================== EXPORT ====================

export default {
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
};
