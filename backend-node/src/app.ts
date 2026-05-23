/**
 * AnimeMultiFlix - Express App Configuration
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configuration
import config from '../config/config';

// Import middleware
import { errorHandler } from './shared/middleware/error.middleware';
import { notFoundHandler } from './shared/middleware/notFound.middleware';
import { securityHeaders } from './shared/middleware/security.middleware';
import { requestLogger } from './shared/middleware/logging.middleware';
import { validateEnv } from './shared/middleware/validation.middleware';
import { csrfProtection } from './shared/middleware/csrf.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import groupRoutes from './modules/groups/group.routes';
import chatRoutes from './modules/chat/chat.routes';
import voiceRoutes from './modules/voice/voice.routes';
import animeRoutes from './modules/anime/anime.routes';
import streamingRoutes from './modules/streaming/stream.routes';
import paymentRoutes from './modules/payment/payment.routes';
import adminRoutes from './modules/admin/admin.routes';
import premiumRoutes from './modules/premium/premium.routes';
import socialRoutes from './modules/social/social.routes';
import webhookRoutes from './modules/webhook/webhook.routes';
import uploadRoutes from './modules/upload/upload.routes';
import healthRoutes from './modules/health/health.routes';

// Import passport strategies
import './modules/auth/strategies/jwt.strategy';
import './modules/auth/strategies/google.strategy';
import './modules/auth/strategies/discord.strategy';
import './modules/auth/strategies/facebook.strategy';
import './modules/auth/strategies/apple.strategy';

// Import utils
import { logger } from './shared/utils/logger';

// ==================== CREATE APP ====================

const createApp = (): Application => {
    const app: Application = express();

    // Validate environment variables
    validateEnv();

    // ==================== SECURITY MIDDLEWARE ====================
    
    // Helmet for security headers
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
                connectSrc: ["'self'", "wss:", "https://api.animemultiflix.com"],
                mediaSrc: ["'self'", "https:", "blob:"],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                baseUri: ["'self'"]
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        xssFilter: true
    }));

    // CORS configuration
    const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080',
        'https://animemultiflix.me',
        'https://staging.animemultiflix.me',
        'https://api.animemultiflix.me'
    ];

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl)
            if (!origin) return callback(null, true);
            if (corsOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'X-CSRF-Token',
            'X-API-Key',
            'X-Session-Token'
        ],
        exposedHeaders: [
            'X-Total-Count',
            'X-Page',
            'X-Total-Pages',
            'X-Per-Page',
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset'
        ],
        maxAge: 86400 // 24 hours
    }));

    // Compression
    app.use(compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        }
    }));

    // Body parsing
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());

    // ==================== SESSION CONFIGURATION ====================
    
    const sessionConfig: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || 'default-session-secret',
        resave: false,
        saveUninitialized: false,
        name: 'amf.sid',
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
            domain: process.env.COOKIE_DOMAIN || undefined
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
            ttl: 7 * 24 * 60 * 60, // 7 days
            touchAfter: 24 * 3600 // lazy session update
        })
    };

    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
        sessionConfig.cookie!.secure = true;
    }

    app.use(session(sessionConfig));

    // ==================== PASSPORT AUTHENTICATION ====================
    
    app.use(passport.initialize());
    app.use(passport.session());

    // ==================== LOGGING MIDDLEWARE ====================
    
    app.use(requestLogger);
    
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined', {
            stream: {
                write: (message) => logger.info(message.trim())
            }
        }));
    }

    // ==================== SECURITY HEADERS ====================
    
    app.use(securityHeaders);

    // ==================== RATE LIMITING ====================
    
    // Global rate limiter
    const globalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: { error: 'Too many requests, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        keyGenerator: (req) => {
            return req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
        }
    });
    app.use('/api', globalLimiter);

    // Auth rate limiter (stricter)
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        skipSuccessfulRequests: true,
        message: { error: 'Too many authentication attempts, please try again later.' }
    });
    app.use('/api/v1/auth/login', authLimiter);
    app.use('/api/v1/auth/register', authLimiter);
    app.use('/api/v1/auth/reset-password', authLimiter);
    app.use('/api/v1/auth/forgot-password', authLimiter);

    // API rate limiter
    const apiLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 60,
        message: { error: 'Rate limit exceeded. Please slow down.' }
    });
    app.use('/api/v1/', apiLimiter);

    // Upload rate limiter
    const uploadLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,
        message: { error: 'Upload limit reached. Please try again later.' }
    });
    app.use('/api/v1/upload', uploadLimiter);

    // ==================== CSRF PROTECTION ====================
    
    if (process.env.NODE_ENV === 'production') {
        app.use('/api/v1/', csrfProtection);
    }

    // ==================== STATIC FILES ====================
    
    app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
        maxAge: '30d',
        etag: true,
        lastModified: true
    }));
    
    app.use('/public', express.static(path.join(__dirname, '../../public'), {
        maxAge: '1d',
        etag: true
    }));

    // ==================== HEALTH CHECKS ====================
    
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version || '4.0.0'
        });
    });

    app.get('/health/ready', (req: Request, res: Response) => {
        // Check database connection
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState === 1 ? 'ready' : 'not ready';
        
        res.status(dbStatus === 'ready' ? 200 : 503).json({
            status: dbStatus,
            timestamp: new Date().toISOString()
        });
    });

    app.get('/health/live', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'alive',
            timestamp: new Date().toISOString()
        });
    });

    // ==================== API ROUTES ====================
    
    const apiVersion = process.env.API_VERSION || 'v1';
    const apiPrefix = `/api/${apiVersion}`;

    // Public routes
    app.use(`${apiPrefix}/auth`, authRoutes);
    app.use(`${apiPrefix}/webhook`, webhookRoutes);
    app.use(`${apiPrefix}/health`, healthRoutes);

    // Protected routes (require authentication)
    app.use(`${apiPrefix}/users`, userRoutes);
    app.use(`${apiPrefix}/groups`, groupRoutes);
    app.use(`${apiPrefix}/chat`, chatRoutes);
    app.use(`${apiPrefix}/voice`, voiceRoutes);
    app.use(`${apiPrefix}/anime`, animeRoutes);
    app.use(`${apiPrefix}/streaming`, streamingRoutes);
    app.use(`${apiPrefix}/payment`, paymentRoutes);
    app.use(`${apiPrefix}/premium`, premiumRoutes);
    app.use(`${apiPrefix}/social`, socialRoutes);
    app.use(`${apiPrefix}/upload`, uploadRoutes);

    // Admin routes (require admin authentication)
    app.use(`${apiPrefix}/admin`, adminRoutes);

    // ==================== TEST ROUTE ====================
    
    if (process.env.NODE_ENV === 'development') {
        app.get('/api/test', (req: Request, res: Response) => {
            res.json({
                message: 'API is working!',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });
    }

    // ==================== 404 HANDLER ====================
    
    app.use(notFoundHandler);

    // ==================== GLOBAL ERROR HANDLER ====================
    
    app.use(errorHandler);

    return app;
};

// ==================== EXPORT ====================

export default createApp;
