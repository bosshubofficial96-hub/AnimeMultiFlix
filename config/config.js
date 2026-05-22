/**
 * AnimeMultiFlix - Main Configuration File
 * Version: 3.0.0
 * Production Ready - Error Free
 */

'use strict';

// Load environment variables
try {
    require('dotenv').config();
} catch (error) {
    // dotenv is optional
}

// Main configuration object
const config = {
    // Application Information
    app: {
        name: 'AnimeMultiFlix',
        shortName: 'AMF',
        version: '3.0.0',
        description: 'Ultimate Anime Streaming Platform',
        author: 'AnimeMultiFlix Team',
        license: 'MIT',
        environment: process.env.NODE_ENV || 'development',
        debug: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
        timezone: 'Asia/Tokyo',
        locale: 'en-US',
        apiVersion: 'v1'
    },

    // Logo & Branding Configuration
    branding: {
        logo: {
            text: 'AnimeMultiFlix',
            shortText: 'AMF',
            icon: '🎬',
            primaryColor: '#FF3366',
            secondaryColor: '#4ECDC4',
            accentColor: '#FFE66D',
            darkBg: '#1A1A2E',
            lightBg: '#F8F9FA',
            animation: 'pulse',
            fontFamily: 'Poppins, sans-serif'
        },
        images: {
            logo: '/assets/images/logo.png',
            logoDark: '/assets/images/logo-dark.png',
            logoLight: '/assets/images/logo-light.png',
            favicon: '/assets/images/favicon.ico',
            defaultAvatar: '/assets/images/default-avatar.png',
            defaultThumbnail: '/assets/images/default-thumb.jpg'
        },
        social: {
            discord: 'https://discord.gg/animemultiflix',
            twitter: 'https://twitter.com/animemultiflix',
            github: 'https://github.com/animemultiflix',
            instagram: 'https://instagram.com/animemultiflix'
        }
    },

    // Server Configuration
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || '0.0.0.0',
        apiUrl: process.env.API_URL || 'http://localhost:3000/api',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        adminUrl: process.env.ADMIN_URL || 'http://localhost:3000/admin',
        wsUrl: process.env.WS_URL || 'ws://localhost:3001',
        sslEnabled: process.env.SSL_ENABLED === 'true',
        sslCert: process.env.SSL_CERT || null,
        sslKey: process.env.SSL_KEY || null,
        trustProxy: true
    },

    // File Paths
    paths: {
        uploads: process.env.UPLOADS_PATH || './uploads',
        temp: process.env.TEMP_PATH || './temp',
        logs: process.env.LOGS_PATH || './logs',
        backups: process.env.BACKUPS_PATH || './backups',
        public: './public',
        views: './views',
        cache: './cache'
    },

    // Limits & Constraints
    limits: {
        maxConnections: parseInt(process.env.MAX_CONNECTIONS) || 1000,
        requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
        jsonLimit: process.env.JSON_LIMIT || '10mb',
        urlencodedLimit: process.env.URLENCODED_LIMIT || '10mb',
        fileUploadLimit: process.env.FILE_UPLOAD_LIMIT || '2gb',
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // CORS Configuration
    cors: {
        enabled: true,
        origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
        maxAge: 86400
    },

    // Session Configuration
    session: {
        secret: process.env.SESSION_SECRET || 'anime-multiflix-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        }
    },

    // Cache Configuration
    cache: {
        enabled: process.env.CACHE_ENABLED !== 'false',
        ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
        maxItems: parseInt(process.env.CACHE_MAX_ITEMS) || 1000,
        checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600,
        redis: {
            enabled: process.env.REDIS_ENABLED === 'true',
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || null,
            db: parseInt(process.env.REDIS_DB) || 0
        }
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        format: process.env.LOG_FORMAT || 'json',
        directory: './logs',
        maxFiles: parseInt(process.env.LOG_MAX_FILES) || 7,
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        console: process.env.NODE_ENV !== 'production'
    },

    // Monitoring & Analytics
    monitoring: {
        enabled: process.env.MONITORING_ENABLED === 'true',
        sentryDsn: process.env.SENTRY_DSN || null,
        googleAnalytics: process.env.GA_TRACKING_ID || null,
        healthCheck: {
            enabled: true,
            path: '/health',
            interval: 60000
        }
    },

    // Feature Flags
    features: {
        userRegistration: true,
        emailVerification: process.env.EMAIL_VERIFICATION === 'true',
        socialLogin: ['google', 'discord'],
        comments: true,
        ratings: true,
        watchlist: true,
        recommendations: true,
        offlineMode: false,
        mobileApp: false,
        darkMode: true
    }
};

// Production specific overrides
if (config.app.environment === 'production') {
    config.app.debug = false;
    config.cors.origins = process.env.PRODUCTION_CORS_ORIGINS ? 
        process.env.PRODUCTION_CORS_ORIGINS.split(',') : [];
    config.session.cookie.secure = true;
    config.logging.console = false;
}

// Development specific overrides
if (config.app.environment === 'development') {
    config.app.debug = true;
    config.cache.ttl = 60; // Short cache for development
    config.logging.level = 'debug';
}

// Test specific overrides
if (config.app.environment === 'test') {
    config.app.debug = false;
    config.server.port = 3001;
    config.cache.enabled = false;
    config.logging.level = 'error';
}

// Helper method to get config value
config.get = function(path, defaultValue = null) {
    try {
        const keys = path.split('.');
        let value = this;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value !== undefined ? value : defaultValue;
    } catch (error) {
        return defaultValue;
    }
};

// Helper method to check if feature is enabled
config.isEnabled = function(featurePath) {
    const value = this.get(featurePath, false);
    return value === true || value === 'true' || value === 1;
};

// Helper method to check environment
config.isProduction = function() {
    return this.app.environment === 'production';
};

config.isDevelopment = function() {
    return this.app.environment === 'development';
};

config.isTest = function() {
    return this.app.environment === 'test';
};

// Export configuration
module.exports = config;

// Console log configuration load status (only in development)
if (config.isDevelopment()) {
    console.log('\n🎬 AnimeMultiFlix Configuration Loaded');
    console.log(`   📦 Version: ${config.app.version}`);
    console.log(`   🌍 Environment: ${config.app.environment}`);
    console.log(`   🚀 Server: http://${config.server.host}:${config.server.port}`);
    console.log(`   🎨 Theme: ${config.branding.logo.primaryColor}\n`);
  }
