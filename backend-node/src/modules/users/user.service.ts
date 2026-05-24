/**
 * AnimeMultiFlix - User Service
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import mongoose from 'mongoose';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';
import { IUser, IUserResponse, IUserPreferences, IUserWatchStats } from './user.types';
import { queueNotification, queueAnalytics } from '../auth/auth.queue';

export class UserService {
    
    // ==================== USER CRUD OPERATIONS ====================

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<IUser | null> {
        try {
            return await User.findById(userId)
                .select('-password -verificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes')
                .lean();
        } catch (error) {
            logger.error('Get user by ID error:', error);
            return null;
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email })
                .select('-password -verificationToken -resetPasswordToken')
                .lean();
        } catch (error) {
            logger.error('Get user by email error:', error);
            return null;
        }
    }

    /**
     * Get user by username
     */
    async getUserByUsername(username: string): Promise<IUser | null> {
        try {
            return await User.findOne({ username })
                .select('-password -verificationToken -resetPasswordToken')
                .lean();
        } catch (error) {
            logger.error('Get user by username error:', error);
            return null;
        }
    }

    /**
     * Update user
     */
    async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true }
            ).select('-password -verificationToken -resetPasswordToken');
        } catch (error) {
            logger.error('Update user error:', error);
            return null;
        }
    }

    /**
     * Delete user (soft delete)
     */
    async deleteUser(userId: string, reason?: string): Promise<boolean> {
        try {
            const result = await User.findByIdAndUpdate(userId, {
                isActive: false,
                deletedAt: new Date(),
                deletionReason: reason
            });
            
            if (result) {
                await this.clearUserSessions(userId);
                await queueAnalytics('user_deleted', { userId, reason });
                return true;
            }
            return false;
        } catch (error) {
            logger.error('Delete user error:', error);
            return false;
        }
    }

    // ==================== USER STATUS ====================

    /**
     * Check if user is online
     */
    async isUserOnline(userId: string): Promise<boolean> {
        try {
            const status = await redisClient.get(`user:online:${userId}`);
            return status === 'true';
        } catch (error) {
            logger.error('Check user online error:', error);
            return false;
        }
    }

    /**
     * Set user online status
     */
    async setUserOnline(userId: string, isOnline: boolean): Promise<void> {
        try {
            if (isOnline) {
                await redisClient.setex(`user:online:${userId}`, 300, 'true'); // 5 minutes TTL
                await User.findByIdAndUpdate(userId, { lastActive: new Date() });
            } else {
                await redisClient.del(`user:online:${userId}`);
            }
        } catch (error) {
            logger.error('Set user online error:', error);
        }
    }

    /**
     * Update last active timestamp
     */
    async updateLastActive(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, { lastActive: new Date() });
            await this.setUserOnline(userId, true);
        } catch (error) {
            logger.error('Update last active error:', error);
        }
    }

    // ==================== USER SESSIONS ====================

    /**
     * Get user sessions
     */
    async getUserSessions(userId: string): Promise<any[]> {
        try {
            const sessions = await redisClient.lrange(`user:sessions:${userId}`, 0, -1);
            return sessions.map(s => JSON.parse(s));
        } catch (error) {
            logger.error('Get user sessions error:', error);
            return [];
        }
    }

    /**
     * Clear all user sessions
     */
    async clearUserSessions(userId: string): Promise<void> {
        try {
            const sessions = await this.getUserSessions(userId);
            for (const session of sessions) {
                await redisClient.del(`session:${session.id}`);
            }
            await redisClient.del(`user:sessions:${userId}`);
        } catch (error) {
            logger.error('Clear user sessions error:', error);
        }
    }

    /**
     * Remove specific session
     */
    async removeUserSession(userId: string, sessionId: string): Promise<void> {
        try {
            await redisClient.lrem(`user:sessions:${userId}`, 0, sessionId);
            await redisClient.del(`session:${sessionId}`);
        } catch (error) {
            logger.error('Remove user session error:', error);
        }
    }

    // ==================== WATCHLIST MANAGEMENT ====================

    /**
     * Add to watchlist
     */
    async addToWatchlist(userId: string, animeId: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            if (!user.watchlist.includes(animeId as any)) {
                user.watchlist.push(animeId as any);
                await user.save();
                await queueAnalytics('watchlist_add', { userId, animeId });
                return true;
            }
            return false;
        } catch (error) {
            logger.error('Add to watchlist error:', error);
            return false;
        }
    }

    /**
     * Remove from watchlist
     */
    async removeFromWatchlist(userId: string, animeId: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
            await user.save();
            await queueAnalytics('watchlist_remove', { userId, animeId });
            return true;
        } catch (error) {
            logger.error('Remove from watchlist error:', error);
            return false;
        }
    }

    /**
     * Get watchlist
     */
    async getWatchlist(userId: string): Promise<any[]> {
        try {
            const user = await User.findById(userId)
                .populate('watchlist', 'title thumbnail rating episodesCount status')
                .lean();
            return user?.watchlist || [];
        } catch (error) {
            logger.error('Get watchlist error:', error);
            return [];
        }
    }

    // ==================== FAVORITES MANAGEMENT ====================

    /**
     * Add to favorites
     */
    async addToFavorites(userId: string, animeId: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            if (!user.favorites.includes(animeId as any)) {
                user.favorites.push(animeId as any);
                await user.save();
                await queueAnalytics('favorite_add', { userId, animeId });
                return true;
            }
            return false;
        } catch (error) {
            logger.error('Add to favorites error:', error);
            return false;
        }
    }

    /**
     * Remove from favorites
     */
    async removeFromFavorites(userId: string, animeId: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            user.favorites = user.favorites.filter(id => id.toString() !== animeId);
            await user.save();
            await queueAnalytics('favorite_remove', { userId, animeId });
            return true;
        } catch (error) {
            logger.error('Remove from favorites error:', error);
            return false;
        }
    }

    /**
     * Get favorites
     */
    async getFavorites(userId: string): Promise<any[]> {
        try {
            const user = await User.findById(userId)
                .populate('favorites', 'title thumbnail rating episodesCount')
                .lean();
            return user?.favorites || [];
        } catch (error) {
            logger.error('Get favorites error:', error);
            return [];
        }
    }

    // ==================== WATCH HISTORY ====================

    /**
     * Add to watch history
     */
    async addToWatchHistory(
        userId: string,
        animeId: string,
        episodeId: string,
        progress: number,
        duration: number
    ): Promise<void> {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            // Check if already in history
            const existingIndex = user.watchHistory.findIndex(
                h => h.animeId.toString() === animeId && h.episodeId.toString() === episodeId
            );

            if (existingIndex !== -1) {
                user.watchHistory[existingIndex].progress = progress;
                user.watchHistory[existingIndex].watchedAt = new Date();
            } else {
                user.watchHistory.push({
                    animeId,
                    episodeId,
                    progress,
                    duration,
                    watchedAt: new Date()
                } as any);
            }

            // Keep only last 500 history items
            if (user.watchHistory.length > 500) {
                user.watchHistory = user.watchHistory.slice(-500);
            }

            await user.save();
            
            // Update watch stats
            await this.updateWatchStats(userId, duration);
        } catch (error) {
            logger.error('Add to watch history error:', error);
        }
    }

    /**
     * Update watch statistics
     */
    async updateWatchStats(userId: string, duration: number): Promise<void> {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            const hoursWatched = duration / 3600;
            
            user.watchStats.totalHours += hoursWatched;
            user.watchStats.totalEpisodes += 1;
            user.watchStats.lastWatched = new Date();
            
            // Update streak
            const lastWatched = user.watchStats.lastWatched;
            const today = new Date();
            const diffDays = Math.floor((today.getTime() - new Date(lastWatched).getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                user.watchStats.streakDays += 1;
                if (user.watchStats.streakDays > user.watchStats.longestStreak) {
                    user.watchStats.longestStreak = user.watchStats.streakDays;
                }
            } else if (diffDays > 1) {
                user.watchStats.streakDays = 1;
            }

            await user.save();
        } catch (error) {
            logger.error('Update watch stats error:', error);
        }
    }

    // ==================== USER PREFERENCES ====================

    /**
     * Get user preferences
     */
    async getPreferences(userId: string): Promise<IUserPreferences | null> {
        try {
            const user = await User.findById(userId).select('preferences').lean();
            return user?.preferences || null;
        } catch (error) {
            logger.error('Get preferences error:', error);
            return null;
        }
    }

    /**
     * Update user preferences
     */
    async updatePreferences(userId: string, updates: Partial<IUserPreferences>): Promise<IUserPreferences | null> {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            user.preferences = {
                ...user.preferences,
                ...updates,
                notifications: { ...user.preferences.notifications, ...updates.notifications },
                privacy: { ...user.preferences.privacy, ...updates.privacy },
                playback: { ...user.preferences.playback, ...updates.playback }
            };
            
            await user.save();
            return user.preferences;
        } catch (error) {
            logger.error('Update preferences error:', error);
            return null;
        }
    }

    // ==================== USER STATISTICS ====================

    /**
     * Get user statistics
     */
    async getUserStatistics(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId)
                .select('watchStats loginCount createdAt lastActive')
                .lean();
            
            if (!user) return null;

            const totalHours = Math.floor(user.watchStats.totalHours);
            const totalMinutes = Math.floor((user.watchStats.totalHours - totalHours) * 60);
            
            return {
                watchStats: {
                    ...user.watchStats,
                    totalHoursDisplay: `${totalHours}h ${totalMinutes}m`
                },
                loginCount: user.loginCount,
                memberSince: user.createdAt,
                lastActive: user.lastActive,
                accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            };
        } catch (error) {
            logger.error('Get user statistics error:', error);
            return null;
        }
    }

    // ==================== BULK OPERATIONS ====================

    /**
     * Get multiple users by IDs
     */
    async getUsersByIds(userIds: string[]): Promise<IUser[]> {
        try {
            return await User.find({ _id: { $in: userIds }, isActive: true })
                .select('username avatar bio watchStats followersCount')
                .lean();
        } catch (error) {
            logger.error('Get users by IDs error:', error);
            return [];
        }
    }

    /**
     * Search users
     */
    async searchUsers(query: string, limit: number = 20, page: number = 1): Promise<{ users: IUser[]; total: number }> {
        try {
            const searchQuery = {
                isActive: true,
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { bio: { $regex: query, $options: 'i' } }
                ]
            };

            const users = await User.find(searchQuery)
                .select('username avatar bio watchStats followersCount')
                .limit(limit)
                .skip((page - 1) * limit)
                .lean();

            const total = await User.countDocuments(searchQuery);

            return { users, total };
        } catch (error) {
            logger.error('Search users error:', error);
            return { users: [], total: 0 };
        }
    }

    /**
     * Get top users by watch time
     */
    async getTopUsersByWatchTime(limit: number = 10): Promise<IUser[]> {
        try {
            return await User.find({ isActive: true })
                .sort({ 'watchStats.totalHours': -1 })
                .limit(limit)
                .select('username avatar watchStats.totalHours')
                .lean();
        } catch (error) {
            logger.error('Get top users error:', error);
            return [];
        }
    }

    /**
     * Get user count
     */
    async getUserCount(): Promise<number> {
        try {
            return await User.countDocuments({ isActive: true });
        } catch (error) {
            logger.error('Get user count error:', error);
            return 0;
        }
    }

    /**
     * Get premium user count
     */
    async getPremiumUserCount(): Promise<number> {
        try {
            return await User.countDocuments({ isPremium: true, isActive: true });
        } catch (error) {
            logger.error('Get premium user count error:', error);
            return 0;
        }
    }
}

export default UserService;
