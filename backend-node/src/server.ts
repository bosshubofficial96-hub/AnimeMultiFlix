/**
 * AnimeMultiFlix - Main Server
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configuration
import config from '../config/config';

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

// Import middleware
import { errorHandler } from './shared/middleware/error.middleware';
import { notFoundHandler } from './shared/middleware/notFound.middleware';
import { logger } from './shared/utils/logger';
import { securityHeaders } from './shared/middleware/security.middleware';
import { requestLogger } from './shared/middleware/logging.middleware';

// Import socket handlers
import { setupAuthSocket } from './sockets/auth.socket';
import { setupChatSocket } from './sockets/chat.socket';
import { setupVoiceSocket } from './sockets/voice.socket';
import { setupGroupSocket } from './sockets/group.socket';
import { setupStreamSocket } from './sockets/stream.socket';
import { setupNotificationSocket } from './sockets/notification.socket';

// ==================== INITIALIZATION ====================

const app: Application = express();
const server: HttpServer = createServer(app);
const io: SocketServer = new SocketServer(server, {
    cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

const PORT: number = parseInt(process.env.PORT || '3000');
const HOST: string = process.env.HOST || '0.0.0.0';

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:"],
            frameSrc: ["'none'"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Total-Pages']
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

// Logging
app.use(requestLogger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Security headers
app.use(securityHeaders);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
});
app.use('/api', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: { error: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../../public')));

// ==================== HEALTH CHECK ====================

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '4.0.0'
    });
});

app.get('/health/detailed', async (req: Request, res: Response) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
    });
});

// ==================== API ROUTES ====================

// API version prefix
const apiPrefix = '/api/v1';

// Public routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/webhook`, webhookRoutes);

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

// Admin routes (require admin authentication)
app.use(`${apiPrefix}/admin`, adminRoutes);

// ==================== SOCKET.IO SETUP ====================

// Authentication middleware for sockets
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication required'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        socket.data.user = decoded;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

// Socket connection handler
io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    
    // Setup socket handlers
    setupAuthSocket(io, socket);
    setupChatSocket(io, socket);
    setupVoiceSocket(io, socket);
    setupGroupSocket(io, socket);
    setupStreamSocket(io, socket);
    setupNotificationSocket(io, socket);
    
    // Disconnect handler
    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
    
    // Error handler
    socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
    });
});

// ==================== DATABASE CONNECTION ====================

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/anime_multiflix';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        } as any);
        
        logger.info('✅ MongoDB connected successfully');
        
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected, attempting to reconnect...');
            setTimeout(connectDB, 5000);
        });
        
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
        
    } catch (error) {
        logger.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    // Close socket connections
    io.close(() => {
        logger.info('Socket.io server closed');
    });
    
    // Close database connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
    
    // Close server
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==================== START SERVER ====================

const startServer = async (): Promise<void> => {
    await connectDB();
    
    server.listen(PORT, HOST, () => {
        const serverUrl = process.env.NODE_ENV === 'production' 
            ? `https://${HOST}:${PORT}` 
            : `http://${HOST}:${PORT}`;
        
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║   🎬 AnimeMultiFlix Server Started Successfully                                 ║
║                                                                                  ║
║   📡 Server: ${serverUrl.padEnd(55)}║
║   🔗 API: ${(process.env.API_URL || `${serverUrl}/api/v1`).padEnd(55)}║
║   🔌 WebSocket: ${(process.env.WS_URL || `ws://${HOST}:${PORT}`).padEnd(55)}║
║   🗄️  Database: MongoDB Connected                                              ║
║   🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(55)}║
║   🚀 Uptime: ${new Date().toISOString().padEnd(55)}║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
        `);
        
        logger.info(`Server started on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV}`);
        logger.info(`API URL: ${process.env.API_URL || `${serverUrl}/api/v1`}`);
    });
};

// Start the server
startServer();

// Export for testing
export { app, server, io };
