/**
 * AnimeMultiFlix - Authentication Service
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument } from './auth.model';
import { redisClient } from '../../shared/services/redis.service';
import { logger } from '../../shared/utils/logger';

// ==================== TYPES ====================

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    sessionId?: string;
}

interface TokenOptions {
    expiresIn?: string | number;
    issuer?: string;
    audience?: string;
}

// ==================== AUTH SERVICE CLASS ====================

export class AuthService {
    private readonly jwtSecret: string;
    private readonly jwtRefreshSecret: string;
    private readonly jwtExpiry: string;
    private readonly jwtRefreshExpiry: string;
    private readonly jwtIssuer: string;
    private readonly jwtAudience: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-jwt-refresh-secret';
        this.jwtExpiry = process.env.JWT_EXPIRY || '7d';
        this.jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY || '30d';
        this.jwtIssuer = process.env.JWT_ISSUER || 'animemultiflix';
        this.jwtAudience = process.env.JWT_AUDIENCE || 'animemultiflix-api';
    }

    // ==================== TOKEN GENERATION ====================

    /**
     * Generate JWT access token
     */
    generateToken(user: UserDocument, options?: TokenOptions): string {
        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            sessionId: uuidv4()
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: options?.expiresIn || this.jwtExpiry,
            issuer: options?.issuer || this.jwtIssuer,
            audience: options?.audience || this.jwtAudience
        });
    }

    /**
     * Generate refresh token
     */
    generateRefreshToken(user: UserDocument): string {
        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, this.jwtRefreshSecret, {
            expiresIn: this.jwtRefreshExpiry,
            issuer: this.jwtIssuer,
            audience: this.jwtAudience
        });
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokens(user: UserDocument): { accessToken: string; refreshToken: string } {
        return {
            accessToken: this.generateToken(user),
            refreshToken: this.generateRefreshToken(user)
        };
    }

    /**
     * Generate email verification token
     */
    generateEmailVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate password reset token
     */
    generatePasswordResetToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate API key for third-party access
     */
    generateAPIKey(): { key: string; secret: string } {
        const key = `amf_${crypto.randomBytes(16).toString('hex')}`;
        const secret = crypto.randomBytes(32).toString('hex');
        return { key, secret };
    }

    // ==================== TOKEN VALIDATION ====================

    /**
     * Verify JWT access token
     */
    verifyToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer,
                audience: this.jwtAudience
            }) as TokenPayload;
            return decoded;
        } catch (error) {
            logger.error('Token verification failed:', error);
            return null;
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.jwtRefreshSecret, {
                issuer: this.jwtIssuer,
                audience: this.jwtAudience
            }) as TokenPayload;
            return decoded;
        } catch (error) {
            logger.error('Refresh token verification failed:', error);
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(token: string): boolean {
        try {
            const decoded = jwt.decode(token) as any;
            if (!decoded || !decoded.exp) return true;
            return Date.now() >= decoded.exp * 1000;
        } catch (error) {
            return true;
        }
    }

    /**
     * Get token expiration time
     */
    getTokenExpiry(token: string): Date | null {
        try {
            const decoded = jwt.decode(token) as any;
            if (!decoded || !decoded.exp) return null;
            return new Date(decoded.exp * 1000);
        } catch (error) {
            return null;
        }
    }

    // ==================== TOKEN BLACKLIST ====================

    /**
     * Add token to blacklist (for logout)
     */
    async blacklistToken(token: string, expiresIn?: number): Promise<void> {
        const decoded = jwt.decode(token) as any;
        const expiry = expiresIn || (decoded?.exp ? decoded.exp * 1000 - Date.now() : 3600000);
        
        await redisClient.setex(`blacklist:${token}`, Math.ceil(expiry / 1000), 'true');
        logger.info(`Token blacklisted: ${token.substring(0, 20)}...`);
    }

    /**
     * Check if token is blacklisted
     */
    async isTokenBlacklisted(token: string): Promise<boolean> {
        const result = await redisClient.get(`blacklist:${token}`);
        return result === 'true';
    }

    // ==================== PASSWORD HANDLING ====================

    /**
     * Hash password
     */
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    }

    /**
     * Verify password
     */
    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Check password strength
     */
    validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (password.length > 128) {
            errors.push('Password must be less than 128 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // ==================== TWO-FACTOR AUTHENTICATION ====================

    /**
     * Generate 2FA secret
     */
    generate2FASecret(email: string): speakeasy.GeneratedSecret {
        return speakeasy.generateSecret({
            name: `AnimeMultiFlix (${email})`,
            length: 20,
            issuer: 'AnimeMultiFlix'
        });
    }

    /**
     * Generate 2FA QR code as data URL
     */
    async generate2FAQRCode(secret: string): Promise<string> {
        const otpauthUrl = speakeasy.otpauthURL({
            secret: secret,
            label: 'AnimeMultiFlix',
            issuer: 'AnimeMultiFlix'
        });
        
        return QRCode.toDataURL(otpauthUrl);
    }

    /**
     * Verify 2FA token
     */
    verify2FAToken(secret: string, token: string): boolean {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1
        });
    }

    /**
     * Generate backup codes for 2FA
     */
    generateBackupCodes(count: number = 10): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    }

    /**
     * Verify backup code
     */
    verifyBackupCode(backupCodes: string[], code: string): boolean {
        const index = backupCodes.indexOf(code);
        if (index !== -1) {
            backupCodes.splice(index, 1);
            return true;
        }
        return false;
    }

    // ==================== SESSION MANAGEMENT ====================

    /**
     * Create user session
     */
    async createSession(userId: string, deviceInfo: any): Promise<string> {
        const sessionId = uuidv4();
        const sessionData = {
            userId,
            deviceInfo,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        await redisClient.hset(`session:${sessionId}`, sessionData);
        await redisClient.expire(`session:${sessionId}`, 7 * 24 * 60 * 60); // 7 days
        
        // Add to user's session list
        await redisClient.sadd(`user:sessions:${userId}`, sessionId);
        
        return sessionId;
    }

    /**
     * Get user session
     */
    async getSession(sessionId: string): Promise<any> {
        const session = await redisClient.hgetall(`session:${sessionId}`);
        return session;
    }

    /**
     * Update session last active time
     */
    async updateSessionActivity(sessionId: string): Promise<void> {
        await redisClient.hset(`session:${sessionId}`, 'lastActive', new Date().toISOString());
    }

    /**
     * Delete user session
     */
    async deleteSession(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (session?.userId) {
            await redisClient.srem(`user:sessions:${session.userId}`, sessionId);
        }
        await redisClient.del(`session:${sessionId}`);
    }

    /**
     * Delete all user sessions
     */
    async deleteAllUserSessions(userId: string): Promise<void> {
        const sessionIds = await redisClient.smembers(`user:sessions:${userId}`);
        for (const sessionId of sessionIds) {
            await redisClient.del(`session:${sessionId}`);
        }
        await redisClient.del(`user:sessions:${userId}`);
    }

    /**
     * Get all user sessions
     */
    async getUserSessions(userId: string): Promise<any[]> {
        const sessionIds = await redisClient.smembers(`user:sessions:${userId}`);
        const sessions = [];
        
        for (const sessionId of sessionIds) {
            const session = await this.getSession(sessionId);
            if (session && Object.keys(session).length > 0) {
                sessions.push({ sessionId, ...session });
            }
        }
        
        return sessions;
    }

    // ==================== RATE LIMITING ====================

    /**
     * Check rate limit for IP
     */
    async checkRateLimit(ip: string, action: string, limit: number, windowSeconds: number): Promise<boolean> {
        const key = `ratelimit:${action}:${ip}`;
        const current = await redisClient.incr(key);
        
        if (current === 1) {
            await redisClient.expire(key, windowSeconds);
        }
        
        return current <= limit;
    }

    /**
     * Get remaining rate limit attempts
     */
    async getRemainingAttempts(ip: string, action: string, limit: number): Promise<number> {
        const key = `ratelimit:${action}:${ip}`;
        const current = await redisClient.get(key);
        const attempts = current ? parseInt(current) : 0;
        return Math.max(0, limit - attempts);
    }

    /**
     * Reset rate limit for IP
     */
    async resetRateLimit(ip: string, action: string): Promise<void> {
        const key = `ratelimit:${action}:${ip}`;
        await redisClient.del(key);
    }

    // ==================== ACCOUNT LOCKOUT ====================

    /**
     * Increment failed login attempts
     */
    async incrementFailedAttempts(identifier: string): Promise<number> {
        const key = `failed:${identifier}`;
        const attempts = await redisClient.incr(key);
        
        if (attempts === 1) {
            await redisClient.expire(key, 15 * 60); // 15 minutes
        }
        
        return attempts;
    }

    /**
     * Get failed login attempts
     */
    async getFailedAttempts(identifier: string): Promise<number> {
        const key = `failed:${identifier}`;
        const attempts = await redisClient.get(key);
        return attempts ? parseInt(attempts) : 0;
    }

    /**
     * Reset failed login attempts
     */
    async resetFailedAttempts(identifier: string): Promise<void> {
        const key = `failed:${identifier}`;
        await redisClient.del(key);
    }

    /**
     * Check if account is locked
     */
    async isAccountLocked(identifier: string): Promise<boolean> {
        const key = `locked:${identifier}`;
        const locked = await redisClient.get(key);
        return locked === 'true';
    }

    /**
     * Lock account
     */
    async lockAccount(identifier: string, durationSeconds: number = 1800): Promise<void> {
        const key = `locked:${identifier}`;
        await redisClient.setex(key, durationSeconds, 'true');
    }

    // ==================== VERIFICATION CODES ====================

    /**
     * Generate OTP code
     */
    generateOTP(length: number = 6): string {
        return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
    }

    /**
     * Store verification code
     */
    async storeVerificationCode(identifier: string, code: string, expirySeconds: number = 600): Promise<void> {
        const key = `verify:${identifier}`;
        await redisClient.setex(key, expirySeconds, code);
    }

    /**
     * Verify code
     */
    async verifyCode(identifier: string, code: string): Promise<boolean> {
        const key = `verify:${identifier}`;
        const storedCode = await redisClient.get(key);
        
        if (storedCode === code) {
            await redisClient.del(key);
            return true;
        }
        
        return false;
    }

    // ==================== HELPER METHODS ====================

    /**
     * Sanitize user object (remove sensitive data)
     */
    sanitizeUser(user: UserDocument): any {
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.verificationToken;
        delete userObj.resetPasswordToken;
        delete userObj.twoFactorSecret;
        delete userObj.twoFactorTempSecret;
        delete userObj.twoFactorBackupCodes;
        return userObj;
    }

    /**
     * Get client IP from request
     */
    getClientIP(req: any): string {
        return req.ip ||
               req.headers['x-forwarded-for'] ||
               req.connection.remoteAddress ||
               req.socket.remoteAddress ||
               'unknown';
    }

    /**
     * Get device info from user agent
     */
    getDeviceInfo(userAgent: string): any {
        // Simple device detection
        const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
        const isTablet = /Tablet|iPad/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;
        
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';
        
        return {
            isMobile,
            isTablet,
            isDesktop,
            browser,
            os,
            userAgent
        };
    }
}

// ==================== EXPORT ====================

export default AuthService;
