/**
 * AnimeMultiFlix - User Notifications Management
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import { logger } from '../../shared/utils/logger';
import { redisClient } from '../../shared/services/redis.service';
import { sendEmail } from '../../shared/utils/email';
import { toSuccessResponse, toErrorResponse } from './user.dto';
import { queueUserNotification } from './user.queue';

// ==================== NOTIFICATIONS SERVICE ====================

class UserNotificationsService {
    
    /**
     * Get notification settings
     */
    async getNotificationSettings(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId).select('preferences.notifications').lean();

            if (!user) {
                return null;
            }

            return user.preferences?.notifications || {
                email: true,
                push: true,
                sms: false,
                inApp: true,
                marketing: false
            };
        } catch (error) {
            logger.error('Get notification settings error:', error);
            throw error;
        }
    }

    /**
     * Update notification settings
     */
    async updateNotificationSettings(userId: string, updates: any): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return null;
            }

            user.preferences.notifications = {
                ...user.preferences.notifications,
                ...updates
            };
            await user.save();

            return user.preferences.notifications;
        } catch (error) {
            logger.error('Update notification settings error:', error);
            throw error;
        }
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId: string, limit: number = 50, page: number = 1): Promise<any> {
        try {
            const notifications = await redisClient.lrange(`user:${userId}:notifications`, 0, -1);
            const parsed = notifications.map(n => JSON.parse(n));
            
            // Sort by timestamp descending
            parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            const total = parsed.length;
            const start = (page - 1) * limit;
            const end = start + limit;
            const data = parsed.slice(start, end);

            return {
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Get user notifications error:', error);
            return { data: [], pagination: { total: 0, page: 1, limit, totalPages: 0 } };
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(userId: string, notificationId: string): Promise<boolean> {
        try {
            const notifications = await redisClient.lrange(`user:${userId}:notifications`, 0, -1);
            
            for (let i = 0; i < notifications.length; i++) {
                const notif = JSON.parse(notifications[i]);
                if (notif.id === notificationId) {
                    notif.read = true;
                    await redisClient.lset(`user:${userId}:notifications`, i, JSON.stringify(notif));
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            logger.error('Mark notification as read error:', error);
            return false;
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string): Promise<void> {
        try {
            const notifications = await redisClient.lrange(`user:${userId}:notifications`, 0, -1);
            
            for (let i = 0; i < notifications.length; i++) {
                const notif = JSON.parse(notifications[i]);
                notif.read = true;
                await redisClient.lset(`user:${userId}:notifications`, i, JSON.stringify(notif));
            }
        } catch (error) {
            logger.error('Mark all notifications as read error:', error);
        }
    }

    /**
     * Delete notification
     */
    async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
        try {
            const notifications = await redisClient.lrange(`user:${userId}:notifications`, 0, -1);
            
            for (let i = 0; i < notifications.length; i++) {
                const notif = JSON.parse(notifications[i]);
                if (notif.id === notificationId) {
                    await redisClient.lrem(`user:${userId}:notifications`, 1, notifications[i]);
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            logger.error('Delete notification error:', error);
            return false;
        }
    }

    /**
     * Clear all notifications
     */
    async clearAllNotifications(userId: string): Promise<void> {
        try {
            await redisClient.del(`user:${userId}:notifications`);
        } catch (error) {
            logger.error('Clear all notifications error:', error);
        }
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const notifications = await redisClient.lrange(`user:${userId}:notifications`, 0, -1);
            const unread = notifications.filter(n => {
                const notif = JSON.parse(n);
                return !notif.read;
            });
            return unread.length;
        } catch (error) {
            logger.error('Get unread count error:', error);
            return 0;
        }
    }

    /**
     * Send notification to user
     */
    async sendNotification(userId: string, title: string, message: string, type: string, data?: any): Promise<void> {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            const notification = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                title,
                message,
                data,
                timestamp: new Date().toISOString(),
                read: false
            };

            // Store in Redis
            await redisClient.lpush(`user:${userId}:notifications`, JSON.stringify(notification));
            await redisClient.ltrim(`user:${userId}:notifications`, 0, 499); // Keep last 500

            // Send email if enabled
            if (user.preferences?.notifications?.email && type !== 'marketing') {
                await queueUserNotification('send_notification_email', {
                    userId,
                    email: user.email,
                    username: user.username,
                    title,
                    message,
                    type
                });
            }
        } catch (error) {
            logger.error('Send notification error:', error);
        }
    }
}

// ==================== CONTROLLER FUNCTIONS ====================

const notificationsService = new UserNotificationsService();

/**
 * Get notification settings
 */
export const getNotificationSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const settings = await notificationsService.getNotificationSettings(userId);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings));
    } catch (error) {
        logger.error('Get notification settings controller error:', error);
        next(error);
    }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const updates = req.body;

        const settings = await notificationsService.updateNotificationSettings(userId, updates);

        if (!settings) {
            res.status(404).json(toErrorResponse('User not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(settings, 'Notification settings updated successfully'));
    } catch (error) {
        logger.error('Update notification settings controller error:', error);
        next(error);
    }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit as string) || 50;
        const page = parseInt(req.query.page as string) || 1;

        const result = await notificationsService.getUserNotifications(userId, limit, page);

        res.status(200).json(toSuccessResponse(result));
    } catch (error) {
        logger.error('Get user notifications controller error:', error);
        next(error);
    }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;

        const marked = await notificationsService.markAsRead(userId, notificationId);

        if (!marked) {
            res.status(404).json(toErrorResponse('Notification not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(null, 'Notification marked as read'));
    } catch (error) {
        logger.error('Mark as read controller error:', error);
        next(error);
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        await notificationsService.markAllAsRead(userId);

        res.status(200).json(toSuccessResponse(null, 'All notifications marked as read'));
    } catch (error) {
        logger.error('Mark all as read controller error:', error);
        next(error);
    }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;

        const deleted = await notificationsService.deleteNotification(userId, notificationId);

        if (!deleted) {
            res.status(404).json(toErrorResponse('Notification not found'));
            return;
        }

        res.status(200).json(toSuccessResponse(null, 'Notification deleted'));
    } catch (error) {
        logger.error('Delete notification controller error:', error);
        next(error);
    }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        await notificationsService.clearAllNotifications(userId);

        res.status(200).json(toSuccessResponse(null, 'All notifications cleared'));
    } catch (error) {
        logger.error('Clear all notifications controller error:', error);
        next(error);
    }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        const count = await notificationsService.getUnreadCount(userId);

        res.status(200).json(toSuccessResponse({ unreadCount: count }));
    } catch (error) {
        logger.error('Get unread count controller error:', error);
        next(error);
    }
};

export default {
    getNotificationSettings,
    updateNotificationSettings,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
};
