/**
 * AnimeMultiFlix - User Profile Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { queueUserNotification, queueUserStats } from './user.queue';
import { userEventEmitter, UserEvents } from './user.events';
import { toUserResponse, toSuccessResponse, toErrorResponse } from './user.dto';
import { IUpdateProfileRequest } from './user.types';

// ==================== PROFILE SERVICE ====================

class UserProfileService {
    
    /**
     * Get user profile by ID
     */
    async getProfile(userId: string, requestingUserId?: string): Promise<any> {
        try {
            const user = await User.findById(userId)
                .select('-password -verificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes')
                .populate('watchlist', 'title thumbnail rating')
                .populate('favorites', 'title thumbnail rating')
                .lean();

            if (!user) {
                return null;
            }

            // Check privacy settings for email visibility
            const showEmail = user.preferences?.privacy?.showEmail && requestingUserId === userId;
            
            const response = toUserResponse(user);
            if (!showEmail) {
                delete (response as any).email;
            }

            return response;
        } catch (error) {
            logger.error('Get profile error:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: IUpdateProfileRequest): Promise<any> {
        try {
            // Remove sensitive fields
            delete (updates as any).email;
            delete (updates as any).password;
            delete (updates as any).role;
            
            const oldUser = await User.findById(userId).lean();
            
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true }
            ).select('-password -verificationToken -resetPasswordToken');

            if (!user) {
                return null;
            }

            // Track changes
            const changes: Record<string, any> = {};
            if (oldUser) {
                for (const key of Object.keys(updates)) {
                    if (oldUser[key] !== (updates as any)[key]) {
                        changes[key] = {
                            old: oldUser[key],
                            new: (updates as any)[key]
                        };
                    }
                }
            }

            // Emit profile updated event
            userEventEmitter.emitEvent(UserEvents.PROFILE_UPDATED, {
                userId: user._id,
                email: user.email,
                username: user.username,
                changes
            });

            // Queue notification
            await queueUserNotification('profile_update', {
                userId: user._id,
                email: user.email,
                username: user.username,
                changes
            });

            return toUserResponse(user);
        } catch (error) {
            logger.error('Update profile error:', error);
            throw error;
        }
    }

    /**
     * Update avatar
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<any> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar: avatarUrl },
                { new: true }
            ).select('avatar');

            if (!user) {
                return null;
            }

            // Emit avatar updated event
            userEventEmitter.emitEvent(UserEvents.AVATAR_UPDATED, {
                userId: user._id,
                email: user.email,
                username: user.username,
                avatarUrl
            });

            return { avatar: user.avatar };
        } catch (error) {
            logger.error('Update avatar error:', error);
            throw error;
        }
    }

    /**
     * Update cover image
     */
    async updateCover(userId: string, coverUrl: string): Promise<any> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { cover: coverUrl },
                { new: true }
            ).select('cover');

            if (!user) {
                return null;
            }

            return { cover: user.cover };
        } catch (error) {
            logger.error('Update cover error:', error);
            throw error;
        }
    }

    /**
     * Get profile visibility
     */
    async getProfileVisibility(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId).select('preferences.privacy').lean();

            if (!user) {
                return null;
            }

            return user.preferences?.privacy || {
                showEmail: false,
                showPhone: false,
                showBirthday: false,
                showLocation: false,
                showLastSeen: true,
                showOnline: true,
                readReceipts: true,
                allowFriendRequests: true,
                allowMessages: 'everyone'
            };
        } catch (error) {
            logger.error('Get profile visibility error:', error);
            throw error;
        }
    }

    /**
     * Update profile visibility
     */
    async updateProfileVisibility(userId: string, visibility: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.privacy = {
                ...user.preferences.privacy,
                ...visibility
            };
            await user.save();

            return user.preferences.privacy;
        } catch (error) {
            logger.error('Update profile visibility error:', error);
            throw error;
        }
    }

    /**
     * Get profile stats
     */
    async getProfileStats(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId)
                .select('watchStats loginCount createdAt lastActive username avatar')
                .lean();

            if (!user) {
                return null;
            }

            const totalHours = Math.floor(user.watchStats?.totalHours || 0);
            const totalMinutes = Math.floor(((user.watchStats?.totalHours || 0) - totalHours) * 60);

            return {
                username: user.username,
                avatar: user.avatar,
                watchStats: {
                    totalHours: user.watchStats?.totalHours || 0,
                    totalHoursDisplay: `${totalHours}h ${totalMinutes}m`,
                    totalEpisodes: user.watchStats?.totalEpisodes || 0,
                    totalAnime: user.watchStats?.totalAnime || 0,
                    completedAnime: user.watchStats?.completedAnime || 0,
                    streakDays: user.watchStats?.streakDays || 0
                },
                loginCount: user.loginCount || 0,
                memberSince: user.createdAt,
                lastActive: user.lastActive,
                accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            };
        } catch (error) {
            logger.error('Get profile stats error:', error);
            throw error;
        }
    }
}

// ==================== CONTROLLER FUNCTIONS ====================

const profileService = new UserProfileService();

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const requestingUserId = req.user?.id;

        const profile = await profileService.getProfile(userId, requestingUserId);

        if (!profile) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(profile));
    } catch (error) {
        logger.error('Get user profile controller error:', error);
        next(error);
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates = req.body;

        const profile = await profileService.updateProfile(userId, updates);

        if (!profile) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(profile, 'Profile updated successfully'));
    } catch (error) {
        logger.error('Update user profile controller error:', error);
        next(error);
    }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (!req.file) {
            res.status(400).json(toErrorResponse('No file uploaded'));
            return;
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const result = await profileService.updateAvatar(userId, avatarUrl);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Avatar uploaded successfully'));
    } catch (error) {
        logger.error('Upload avatar controller error:', error);
        next(error);
    }
};

/**
 * Upload cover
 */
export const uploadCover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (!req.file) {
            res.status(400).json(toErrorResponse('No file uploaded'));
            return;
        }

        const coverUrl = `/uploads/covers/${req.file.filename}`;
        const result = await profileService.updateCover(userId, coverUrl);

        if (!result) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(result, 'Cover uploaded successfully'));
    } catch (error) {
        logger.error('Upload cover controller error:', error);
        next(error);
    }
};

/**
 * Get profile visibility settings
 */
export const getProfileVisibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const visibility = await profileService.getProfileVisibility(userId);

        if (!visibility) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(visibility));
    } catch (error) {
        logger.error('Get profile visibility controller error:', error);
        next(error);
    }
};

/**
 * Update profile visibility settings
 */
export const updateProfileVisibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const visibility = req.body;

        const updated = await profileService.updateProfileVisibility(userId, visibility);

        if (!updated) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(updated, 'Profile visibility updated successfully'));
    } catch (error) {
        logger.error('Update profile visibility controller error:', error);
        next(error);
    }
};

/**
 * Get profile statistics
 */
export const getProfileStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        
        const stats = await profileService.getProfileStats(userId);

        if (!stats) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(stats));
    } catch (error) {
        logger.error('Get profile stats controller error:', error);
        next(error);
    }
};

/**
 * Get current user profile
 */
export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        const profile = await profileService.getProfile(userId, userId);

        if (!profile) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(profile));
    } catch (error) {
        logger.error('Get my profile controller error:', error);
        next(error);
    }
};

export default {
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
    uploadCover,
    getProfileVisibility,
    updateProfileVisibility,
    getProfileStats,
    getMyProfile
};
