/**
 * AnimeMultiFlix - Authentication Utilities
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { DeviceInfo, LoginMethod, UserRole } from './auth.types';

// ==================== TOKEN GENERATION ====================

/**
 * Generate random token
 */
export const generateRandomToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate OTP code
 */
export const generateOTP = (length: number = 6): string => {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

/**
 * Generate API key
 */
export const generateAPIKey = (): { key: string; secret: string } => {
    const key = `amf_${crypto.randomBytes(16).toString('hex')}`;
    const secret = crypto.randomBytes(32).toString('hex');
    return { key, secret };
};

/**
 * Generate UUID
 */
export const generateUUID = (): string => {
    return uuidv4();
};

/**
 * Generate referral code
 */
export const generateReferralCode = (username: string): string => {
    const prefix = username.slice(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${random}`;
};

// ==================== PASSWORD UTILITIES ====================

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

/**
 * Verify password
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (password.length > 128) errors.push('Password must be less than 128 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain a special character');
    
    return { isValid: errors.length === 0, errors };
};

/**
 * Check if password is commonly used
 */
export const isCommonPassword = (password: string): boolean => {
    const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'monkey', 'letmein', 'dragon', 'baseball', 'master'
    ];
    return commonPasswords.includes(password.toLowerCase());
};

// ==================== DEVICE DETECTION ====================

/**
 * Parse user agent and get device info
 */
export const getDeviceInfo = (userAgent: string, ip?: string): DeviceInfo => {
    const ua = userAgent || '';
    
    // Browser detection
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    if (ua.includes('Chrome')) {
        browser = 'Chrome';
        const match = ua.match(/Chrome\/(\d+\.\d+)/);
        if (match) browserVersion = match[1];
    } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        if (match) browserVersion = match[1];
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
        const match = ua.match(/Version\/(\d+\.\d+)/);
        if (match) browserVersion = match[1];
    } else if (ua.includes('Edge')) {
        browser = 'Edge';
        const match = ua.match(/Edge\/(\d+\.\d+)/);
        if (match) browserVersion = match[1];
    }
    
    // OS detection
    let os = 'Unknown';
    let osVersion = 'Unknown';
    if (ua.includes('Windows')) {
        os = 'Windows';
        if (ua.includes('Windows NT 10.0')) osVersion = '10';
        else if (ua.includes('Windows NT 6.1')) osVersion = '7';
        else if (ua.includes('Windows NT 6.2')) osVersion = '8';
        else if (ua.includes('Windows NT 6.3')) osVersion = '8.1';
    } else if (ua.includes('Mac OS X')) {
        os = 'macOS';
        const match = ua.match(/Mac OS X (\d+[._]\d+)/);
        if (match) osVersion = match[1].replace('_', '.');
    } else if (ua.includes('Linux')) {
        os = 'Linux';
    } else if (ua.includes('Android')) {
        os = 'Android';
        const match = ua.match(/Android (\d+\.\d+)/);
        if (match) osVersion = match[1];
    } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
        os = 'iOS';
        const match = ua.match(/OS (\d+[._]\d+)/);
        if (match) osVersion = match[1].replace('_', '.');
    }
    
    // Device type detection
    const isMobile = /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);
    const isDesktop = !isMobile && !isTablet;
    const isBot = /bot|crawler|spider|scraper/i.test(ua);
    const isTV = /SmartTV|AppleTV|GoogleTV|Roku|Amazon Fire/i.test(ua);
    const isConsole = /PlayStation|Xbox|Nintendo/i.test(ua);
    
    let deviceType: DeviceInfo['deviceType'] = 'unknown';
    if (isMobile) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';
    else if (isDesktop) deviceType = 'desktop';
    else if (isBot) deviceType = 'bot';
    else if (isTV) deviceType = 'tv';
    else if (isConsole) deviceType = 'console';
    
    let device = 'Unknown';
    if (ua.includes('iPhone')) device = 'iPhone';
    else if (ua.includes('iPad')) device = 'iPad';
    else if (ua.includes('Android')) device = 'Android Device';
    else if (ua.includes('Windows')) device = 'Windows PC';
    else if (ua.includes('Mac')) device = 'Mac';
    else if (ua.includes('Linux')) device = 'Linux PC';
    
    // Generate fingerprint
    const fingerprint = crypto
        .createHash('md5')
        .update(`${browser}${browserVersion}${os}${osVersion}${deviceType}${ua.substring(0, 100)}`)
        .digest('hex');
    
    return {
        fingerprint,
        browser,
        browserVersion,
        os,
        osVersion,
        device,
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
        isBot,
        isTV,
        isConsole,
        userAgent: ua,
        ip,
        language: 'unknown',
        screenResolution: 'unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
};

/**
 * Get client IP from request
 */
export const getClientIP = (req: Request): string => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
           req.socket.remoteAddress ||
           req.ip ||
           'unknown';
};

// ==================== EMAIL VALIDATION ====================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate username
 */
export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
};

// ==================== ROLE CHECKING ====================

/**
 * Check if role has admin access
 */
export const isAdminRole = (role: string): boolean => {
    const adminRoles = ['admin', 'super_admin', 'owner'];
    return adminRoles.includes(role);
};

/**
 * Check if role has super admin access
 */
export const isSuperAdminRole = (role: string): boolean => {
    const superAdminRoles = ['super_admin', 'owner'];
    return superAdminRoles.includes(role);
};

/**
 * Get role level
 */
export const getRoleLevel = (role: UserRole): number => {
    const levels: Record<UserRole, number> = {
        [UserRole.USER]: 0,
        [UserRole.PREMIUM]: 1,
        [UserRole.ULTIMATE]: 2,
        [UserRole.MODERATOR]: 3,
        [UserRole.ADMIN]: 4,
        [UserRole.SUPER_ADMIN]: 5,
        [UserRole.OWNER]: 999
    };
    return levels[role] || 0;
};

// ==================== MASKING UTILITIES ====================

/**
 * Mask email (e.g., u***r@example.com)
 */
export const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
};

/**
 * Mask phone number (e.g., +1***1234)
 */
export const maskPhone = (phone: string): string => {
    if (phone.length <= 4) return '***';
    return `${phone.slice(0, 2)}***${phone.slice(-4)}`;
};

/**
 * Mask IP address (e.g., 192.168.*.*)
 */
export const maskIP = (ip: string): string => {
    const parts = ip.split('.');
    if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.*.*`;
    }
    return ip;
};

// ==================== TOKEN UTILITIES ====================

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token: string): any => {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch {
        return null;
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token: string): Date | null => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
};

// ==================== LOGIN METHOD UTILITIES ====================

/**
 * Get login method from provider
 */
export const getLoginMethod = (provider: string): LoginMethod => {
    const methods: Record<string, LoginMethod> = {
        google: LoginMethod.GOOGLE,
        discord: LoginMethod.DISCORD,
        facebook: LoginMethod.FACEBOOK,
        apple: LoginMethod.APPLE,
        github: LoginMethod.GITHUB,
        twitter: LoginMethod.TWITTER
    };
    return methods[provider] || LoginMethod.PASSWORD;
};

// ==================== EXPORT ====================

export default {
    generateRandomToken,
    generateOTP,
    generateAPIKey,
    generateUUID,
    generateReferralCode,
    hashPassword,
    verifyPassword,
    validatePasswordStrength,
    isCommonPassword,
    getDeviceInfo,
    getClientIP,
    isValidEmail,
    isValidPhone,
    isValidUsername,
    isAdminRole,
    isSuperAdminRole,
    getRoleLevel,
    maskEmail,
    maskPhone,
    maskIP,
    decodeToken,
    isTokenExpired,
    getTokenExpiry,
    getLoginMethod
};
