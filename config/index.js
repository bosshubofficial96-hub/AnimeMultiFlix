/**
 * AnimeMultiFlix - Configuration Index
 * Version: 4.0.0 (2026)
 * Error Free - Production Ready
 * Powered by BossHub
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// ==================== INTERFACES ====================

interface AppConfig {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production' | 'testing';
    debug: boolean;
    port: number;
    host: string;
    apiUrl: string;
    frontendUrl: string;
    adminUrl: string;
    wsUrl: string;
}

interface DatabaseConfig {
    mongodb: {
        uri: string;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            poolSize: number;
            connectTimeoutMS: number;
            socketTimeoutMS: number;
            family: number;
        };
        collections: {
            users: string;
            animes: string;
            episodes: string;
            groups: string;
            messages: string;
            payments: string;
            admins: string;
            subscriptions: string;
            watchHistory: string;
            comments: string;
            ratings: string;
            notifications: string;
            reports: string;
            analytics: string;
        };
    };
    redis: {
        enabled: boolean;
        host: string;
        port: number;
        password: string | null;
        ttl: number;
        keyPrefix: string;
        db: number;
    };
    postgresql: {
        enabled: boolean;
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
        ssl: boolean;
        max: number;
        idleTimeoutMillis: number;
    };
}

interface AuthConfig {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
        algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256';
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackURL: string;
        scope: string[];
    };
    discord: {
        clientId: string;
        clientSecret: string;
        callbackURL: string;
        scope: string[];
    };
    github: {
        clientId: string;
        clientSecret: string;
        callbackURL: string;
        scope: string[];
    };
    apple: {
        clientId: string;
        teamId: string;
        keyId: string;
        privateKey: string;
        callbackURL: string;
        scope: string[];
    };
    session: {
        secret: string;
        resave: boolean;
        saveUninitialized: boolean;
        cookie: {
            secure: boolean;
            httpOnly: boolean;
            maxAge: number;
            sameSite: 'strict' | 'lax' | 'none';
        };
    };
    passwordPolicy: {
        minLength: number;
        maxLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
    };
    rateLimit: {
        enabled: boolean;
        windowMs: number;
        max: number;
        skipSuccessfulRequests: boolean;
        skipFailedRequests: boolean;
    };
}

interface GroupConfig {
    maxMembers: {
        free: number;
        premium: number;
        ultimate: number;
    };
    maxGroupsPerUser: {
        free: number;
        premium: number;
        ultimate: number;
    };
    maxAdminsPerGroup: number;
    inviteLinkExpiry: number;
    maxInvitesPerLink: number;
    groupTypes: {
        PUBLIC: 'public';
        PRIVATE: 'private';
        SECRET: 'secret';
    };
    roles: {
        OWNER: 'owner';
        ADMIN: 'admin';
        MODERATOR: 'moderator';
        MEMBER: 'member';
    };
    permissions: {
        createInvite: string[];
        deleteMessage: string[];
        banMember: string[];
        changeSettings: string[];
        pinMessage: string[];
    };
}

interface ChatConfig {
    maxMessageLength: number;
    maxFileSize: number;
    allowedFileTypes: string[];
    messageRetention: {
        free: number;
        premium: number;
    };
    rateLimit: {
        messagesPerMinute: number;
        filesPerMinute: number;
    };
    voiceMessage: {
        maxDuration: number;
        quality: number;
        format: 'mp3' | 'ogg' | 'aac';
    };
    reactions: {
        maxReactionsPerMessage: number;
        allowedReactions: string[];
    };
    editWindow: number;
    deleteWindow: number;
}

interface VoiceConfig {
    webrtc: {
        iceServers: Array<{
            urls: string | string[];
            username?: string;
            credential?: string;
        }>;
        iceCandidatePoolSize: number;
        bundlePolicy: 'max-bundle' | 'balanced' | 'max-compat';
        rtcpMuxPolicy: 'require' | 'negotiate';
        sdpSemantics: 'unified-plan' | 'plan-b';
    };
    rooms: {
        maxParticipants: number;
        maxDuration: number;
        autoDelete: boolean;
        recordingEnabled: boolean;
    };
    audio: {
        sampleRate: number;
        channelCount: number;
        echoCancellation: boolean;
        noiseSuppression: boolean;
        autoGainControl: boolean;
        volume: number;
    };
    codecs: {
        audio: ('opus' | 'pcmu' | 'pcma')[];
        video: ('VP8' | 'VP9' | 'H264')[];
    };
}

interface PaymentConfig {
    stripe: {
        publicKey: string;
        secretKey: string;
        webhookSecret: string;
        enabled: boolean;
    };
    paypal: {
        clientId: string;
        clientSecret: string;
        mode: 'sandbox' | 'live';
        enabled: boolean;
    };
    razorpay: {
        keyId: string;
        keySecret: string;
        enabled: boolean;
    };
    currency: string;
    taxRate: number;
    taxName: string;
    enabledGateways: string[];
}

interface PremiumConfig {
    plans: {
        free: {
            name: string;
            price: number;
            priceId: string;
            features: string[];
            limits: {
                quality: string;
                devices: number;
                downloads: boolean;
                ads: boolean;
                watchPartySize: number;
                groupSize: number;
                voiceQuality: string;
            };
        };
        basic: {
            name: string;
            price: number;
            priceId: string;
            features: string[];
            limits: {
                quality: string;
                devices: number;
                downloads: boolean;
                ads: boolean;
                watchPartySize: number;
                groupSize: number;
                voiceQuality: string;
            };
        };
        pro: {
            name: string;
            price: number;
            priceId: string;
            features: string[];
            limits: {
                quality: string;
                devices: number;
                downloads: boolean;
                ads: boolean;
                watchPartySize: number;
                groupSize: number;
                voiceQuality: string;
            };
        };
        ultimate: {
            name: string;
            price: number;
            priceId: string;
            features: string[];
            limits: {
                quality: string;
                devices: number;
                downloads: boolean;
                ads: boolean;
                watchPartySize: number;
                groupSize: number;
                voiceQuality: string;
            };
        };
        family: {
            name: string;
            price: number;
            priceId: string;
            features: string[];
            limits: {
                quality: string;
                devices: number;
                downloads: boolean;
                ads: boolean;
                watchPartySize: number;
                groupSize: number;
                voiceQuality: string;
                profiles: number;
            };
        };
    };
    discounts: {
        yearly: number;
        student: number;
        referral: number;
        promoCodeEnabled: boolean;
    };
    trial: {
        enabled: boolean;
        days: number;
    };
}

interface StreamingConfig {
    video: {
        qualities: ('144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p' | '4320p')[];
        defaultQuality: string;
        adaptiveBitrate: boolean;
        hls: {
            enabled: boolean;
            segmentDuration: number;
            maxSegments: number;
        };
        dash: {
            enabled: boolean;
            segmentDuration: number;
        };
    };
    transcoding: {
        enabled: boolean;
        presets: {
            '1080p': { width: number; height: number; bitrate: number };
            '720p': { width: number; height: number; bitrate: number };
            '480p': { width: number; height: number; bitrate: number };
        };
    };
    cdn: {
        enabled: boolean;
        url: string;
        regions: string[];
    };
    subtitles: {
        supportedFormats: ('srt' | 'vtt' | 'ass' | 'ssa')[];
        maxSize: number;
        languages: string[];
    };
}

interface AdminConfig {
    dashboard: {
        theme: 'dark' | 'light';
        sidebarCollapsed: boolean;
        itemsPerPage: number;
        refreshInterval: number;
        widgets: string[];
    };
    auth: {
        sessionTimeout: number;
        maxLoginAttempts: number;
        lockoutDuration: number;
        require2FA: boolean;
        passwordPolicy: {
            minLength: number;
            requireUppercase: boolean;
            requireLowercase: boolean;
            requireNumbers: boolean;
            requireSpecialChars: boolean;
        };
    };
    roles: {
        super_admin: {
            name: string;
            permissions: string[];
            maxAdmins: number;
        };
        admin: {
            name: string;
            permissions: string[];
            maxAdmins: number;
        };
        moderator: {
            name: string;
            permissions: string[];
            maxAdmins: number;
        };
        editor: {
            name: string;
            permissions: string[];
            maxAdmins: number;
        };
        viewer: {
            name: string;
            permissions: string[];
            maxAdmins: number;
        };
    };
    audit: {
        enabled: boolean;
        logActions: boolean;
        logIP: boolean;
        logUserAgent: boolean;
        retentionDays: number;
    };
    backup: {
        autoBackup: boolean;
        frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
        time: string;
        retention: number;
        compress: boolean;
        encrypt: boolean;
    };
    notifications: {
        emailEnabled: boolean;
        pushEnabled: boolean;
        adminAlerts: boolean;
        systemAlerts: boolean;
    };
}

interface ApiConfig {
    version: string;
    prefix: string;
    rateLimit: {
        enabled: boolean;
        windowMs: number;
        max: number;
    };
    cors: {
        enabled: boolean;
        origins: string[];
        methods: string[];
        allowedHeaders: string[];
        exposedHeaders: string[];
        credentials: boolean;
        maxAge: number;
    };
    compression: {
        enabled: boolean;
        level: number;
        threshold: number;
    };
    pagination: {
        defaultLimit: number;
        maxLimit: number;
    };
    webhooks: {
        enabled: boolean;
        timeout: number;
        retries: number;
    };
}

interface SecurityConfig {
    helmet: {
        enabled: boolean;
        contentSecurityPolicy: {
            directives: Record<string, any>;
        };
        hsts: {
            enabled: boolean;
            maxAge: number;
            includeSubDomains: boolean;
            preload: boolean;
        };
        referrerPolicy: {
            policy: string;
        };
    };
    rateLimit: {
        enabled: boolean;
        windowMs: number;
        max: number;
        skipSuccessfulRequests: boolean;
        skipFailedRequests: boolean;
        keyGenerator: (req: any) => string;
    };
    csrf: {
        enabled: boolean;
        cookie: boolean;
    };
    xss: {
        enabled: boolean;
    };
    sqlInjection: {
        enabled: boolean;
    };
    ipFiltering: {
        enabled: boolean;
        whitelist: string[];
        blacklist: string[];
    };
    encryption: {
        algorithm: 'aes-256-gcm' | 'aes-256-cbc';
        keyDerivation: 'pbkdf2' | 'scrypt';
        iterations: number;
    };
}

interface Constants {
    APP_NAME: string;
    APP_VERSION: string;
    APP_URL: string;
    STATUS_CODES: {
        OK: number;
        CREATED: number;
        ACCEPTED: number;
        NO_CONTENT: number;
        BAD_REQUEST: number;
        UNAUTHORIZED: number;
        FORBIDDEN: number;
        NOT_FOUND: number;
        CONFLICT: number;
        UNPROCESSABLE_ENTITY: number;
        TOO_MANY_REQUESTS: number;
        INTERNAL_SERVER_ERROR: number;
        BAD_GATEWAY: number;
        SERVICE_UNAVAILABLE: number;
    };
    USER_ROLES: {
        USER: string;
        ADMIN: string;
        MODERATOR: string;
        SUPER_ADMIN: string;
    };
    ANIME_STATUS: {
        ONGOING: string;
        COMPLETED: string;
        UPCOMING: string;
        HIATUS: string;
    };
    VIDEO_QUALITIES: string[];
    GENRES: string[];
    CACHE_KEYS: {
        ANIME_LIST: string;
        ANIME_DETAIL: string;
        USER_SESSION: string;
        TRENDING: string;
        POPULAR: string;
        RECOMMENDATIONS: string;
    };
    FILE_LIMITS: {
        MAX_VIDEO_SIZE: number;
        MAX_IMAGE_SIZE: number;
        MAX_SUBTITLE_SIZE: number;
        MAX_AUDIO_SIZE: number;
    };
    PAGINATION: {
        DEFAULT_PAGE: number;
        DEFAULT_LIMIT: number;
        MAX_LIMIT: number;
    };
    REGEX: {
        EMAIL: RegExp;
        PASSWORD: RegExp;
        USERNAME: RegExp;
        URL: RegExp;
        PHONE: RegExp;
    };
}

// ==================== LOAD ENVIRONMENT CONFIG ====================

const env = (process.env.NODE_ENV as string) || 'development';
const envConfigPath = path.join(__dirname, 'environments', `${env}.json`);

let environmentConfig: any = {};

if (fs.existsSync(envConfigPath)) {
    try {
        environmentConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));
        console.log(`✅ Loaded ${env} configuration`);
    } catch (error) {
        console.error(`❌ Failed to load ${env} configuration:`, error);
    }
}

// ==================== DEFAULT CONFIGURATIONS ====================

const defaultConfig: AppConfig = {
    name: 'AnimeMultiFlix',
    version: '4.0.0',
    environment: env as any,
    debug: env === 'development',
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
    apiUrl: process.env.API_URL || `http://localhost:3000/api`,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:3000/admin',
    wsUrl: process.env.WS_URL || 'ws://localhost:3001',
};

const defaultDatabase: DatabaseConfig = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/anime_multiflix',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        },
        collections: {
            users: 'users',
            animes: 'animes',
            episodes: 'episodes',
            groups: 'groups',
            messages: 'messages',
            payments: 'payments',
            admins: 'admins',
            subscriptions: 'subscriptions',
            watchHistory: 'watch_histories',
            comments: 'comments',
            ratings: 'ratings',
            notifications: 'notifications',
            reports: 'reports',
            analytics: 'analytics',
        },
    },
    redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || null,
        ttl: 3600,
        keyPrefix: 'amf:',
        db: 0,
    },
    postgresql: {
        enabled: process.env.PG_ENABLED === 'true',
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432'),
        database: process.env.PG_DATABASE || 'anime_multiflix',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'password',
        ssl: process.env.PG_SSL === 'true',
        max: 20,
        idleTimeoutMillis: 30000,
    },
};

const defaultAuth: AuthConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'default-jwt-secret-change-me',
        expiresIn: '7d',
        refreshExpiresIn: '30d',
        algorithm: 'HS256',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
        scope: ['profile', 'email'],
    },
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:3000/api/auth/discord/callback',
        scope: ['identify', 'email'],
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
        scope: ['user:email'],
    },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID || '',
        teamId: process.env.APPLE_TEAM_ID || '',
        keyId: process.env.APPLE_KEY_ID || '',
        privateKey: process.env.APPLE_PRIVATE_KEY || '',
        callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/api/auth/apple/callback',
        scope: ['name', 'email'],
    },
    session: {
        secret: process.env.SESSION_SECRET || 'session-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: env === 'production',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        },
    },
    passwordPolicy: {
        minLength: 8,
        maxLength: 32,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
    },
    rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        max: 100,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
    },
};

const defaultGroup: GroupConfig = {
    maxMembers: {
        free: 100,
        premium: 500,
        ultimate: 2000,
    },
    maxGroupsPerUser: {
        free: 10,
        premium: 50,
        ultimate: 200,
    },
    maxAdminsPerGroup: 20,
    inviteLinkExpiry: 7 * 24 * 60 * 60 * 1000,
    maxInvitesPerLink: 100,
    groupTypes: {
        PUBLIC: 'public',
        PRIVATE: 'private',
        SECRET: 'secret',
    },
    roles: {
        OWNER: 'owner',
        ADMIN: 'admin',
        MODERATOR: 'moderator',
        MEMBER: 'member',
    },
    permissions: {
        createInvite: ['owner', 'admin'],
        deleteMessage: ['owner', 'admin', 'moderator'],
        banMember: ['owner', 'admin'],
        changeSettings: ['owner', 'admin'],
        pinMessage: ['owner', 'admin', 'moderator'],
    },
};

const defaultChat: ChatConfig = {
    maxMessageLength: 5000,
    maxFileSize: 100 * 1024 * 1024,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg'],
    messageRetention: {
        free: 30,
        premium: 365,
    },
    rateLimit: {
        messagesPerMinute: 60,
        filesPerMinute: 10,
    },
    voiceMessage: {
        maxDuration: 300,
        quality: 128,
        format: 'mp3',
    },
    reactions: {
        maxReactionsPerMessage: 20,
        allowedReactions: ['👍', '👎', '❤️', '😂', '😮', '😢', '😡'],
    },
    editWindow: 60 * 60 * 1000,
    deleteWindow: 60 * 60 * 1000,
};

const defaultVoice: VoiceConfig = {
    webrtc: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject',
            },
        ],
        iceCandidatePoolSize: 10,
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        sdpSemantics: 'unified-plan',
    },
    rooms: {
        maxParticipants: 50,
        maxDuration: 3600,
        autoDelete: true,
        recordingEnabled: false,
    },
    audio: {
        sampleRate: 48000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        volume: 1.0,
    },
    codecs: {
        audio: ['opus'],
        video: ['VP8', 'VP9', 'H264'],
    },
};

const defaultPayment: PaymentConfig = {
    stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        enabled: false,
    },
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
        mode: 'sandbox',
        enabled: false,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
        enabled: false,
    },
    currency: 'USD',
    taxRate: 0,
    taxName: 'Tax',
    enabledGateways: [],
};

const defaultPremium: PremiumConfig = {
    plans: {
        free: {
            name: 'Free',
            price: 0,
            priceId: 'price_free',
            features: ['Basic access', '480p quality', 'Ads supported', '1 device'],
            limits: {
                quality: '480p',
                devices: 1,
                downloads: false,
                ads: true,
                watchPartySize: 5,
                groupSize: 100,
                voiceQuality: 'standard',
            },
        },
        basic: {
            name: 'Basic',
            price: 4.99,
            priceId: 'price_basic',
            features: ['No ads', '1080p quality', 'Download support', '2 devices'],
            limits: {
                quality: '1080p',
                devices: 2,
                downloads: true,
                ads: false,
                watchPartySize: 20,
                groupSize: 500,
                voiceQuality: 'high',
            },
        },
        pro: {
            name: 'Pro',
            price: 9.99,
            priceId: 'price_pro',
            features: ['4K Ultra HD', '5 devices', 'Early access', 'Priority support'],
            limits: {
                quality: '4k',
                devices: 5,
                downloads: true,
                ads: false,
                watchPartySize: 100,
                groupSize: 2000,
                voiceQuality: 'hd',
            },
        },
        ultimate: {
            name: 'Ultimate',
            price: 14.99,
            priceId: 'price_ultimate',
            features: ['4K HDR', '10 devices', 'Family sharing', 'Exclusive content'],
            limits: {
                quality: '4k',
                devices: 10,
                downloads: true,
                ads: false,
                watchPartySize: 500,
                groupSize: 5000,
                voiceQuality: 'ultra-hd',
            },
        },
        family: {
            name: 'Family',
            price: 19.99,
            priceId: 'price_family',
            features: ['5 profiles', 'Parental controls', 'Kids mode', 'Family sharing'],
            limits: {
                quality: '4k',
                devices: 15,
                downloads: true,
                ads: false,
                watchPartySize: 500,
                groupSize: 5000,
                voiceQuality: 'ultra-hd',
                profiles: 5,
            },
        },
    },
    discounts: {
        yearly: 0.2,
        student: 0.5,
        referral: 0.1,
        promoCodeEnabled: true,
    },
    trial: {
        enabled: true,
        days: 7,
    },
};

const defaultStreaming: StreamingConfig = {
    video: {
        qualities: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4320p'],
        defaultQuality: '720p',
        adaptiveBitrate: true,
        hls: {
            enabled: true,
            segmentDuration: 6,
            maxSegments: 10,
        },
        dash: {
            enabled: true,
            segmentDuration: 4,
        },
    },
    transcoding: {
        enabled: true,
        presets: {
            '1080p': { width: 1920, height: 1080, bitrate: 5000000 },
            '720p': { width: 1280, height: 720, bitrate: 2500000 },
            '480p': { width: 854, height: 480, bitrate: 1500000 },
        },
    },
    cdn: {
        enabled: false,
        url: '',
        regions: [],
    },
    subtitles: {
        supportedFormats: ['srt', 'vtt', 'ass', 'ssa'],
        maxSize: 10 * 1024 * 1024,
        languages: ['en', 'ja', 'es', 'fr', 'de', 'zh', 'ko', 'ar', 'hi', 'pt', 'ru'],
    },
};

const defaultAdmin: AdminConfig = {
    dashboard: {
        theme: 'dark',
        sidebarCollapsed: false,
        itemsPerPage: 50,
        refreshInterval: 30000,
        widgets: ['totalUsers', 'totalAnimes', 'totalViews', 'revenue', 'activeUsers', 'systemHealth'],
    },
    auth: {
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        lockoutDuration: 900,
        require2FA: false,
        passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        },
    },
    roles: {
        super_admin: {
            name: 'Super Administrator',
            permissions: ['*'],
            maxAdmins: 1,
        },
        admin: {
            name: 'Administrator',
            permissions: ['manage_anime', 'manage_users', 'manage_admins', 'manage_reports', 'view_analytics'],
            maxAdmins: 10,
        },
        moderator: {
            name: 'Moderator',
            permissions: ['manage_anime', 'manage_comments', 'manage_reports'],
            maxAdmins: 20,
        },
        editor: {
            name: 'Content Editor',
            permissions: ['manage_anime', 'upload_episodes', 'manage_genres'],
            maxAdmins: 30,
        },
        viewer: {
            name: 'Analytics Viewer',
            permissions: ['view_analytics'],
            maxAdmins: 50,
        },
    },
    audit: {
        enabled: true,
        logActions: true,
        logIP: true,
        logUserAgent: true,
        retentionDays: 90,
    },
    backup: {
        autoBackup: true,
        frequency: 'daily',
        time: '02:00',
        retention: 30,
        compress: true,
        encrypt: true,
    },
    notifications: {
        emailEnabled: true,
        pushEnabled: true,
        adminAlerts: true,
        systemAlerts: true,
    },
};

const defaultApi: ApiConfig = {
    version: 'v1',
    prefix: '/api/v1',
    rateLimit: {
        enabled: true,
        windowMs: 60 * 1000,
        max: 60,
    },
    cors: {
        enabled: true,
        origins: ['http://localhost:3000', 'http://localhost:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Total-Pages'],
        credentials: true,
        maxAge: 86400,
    },
    compression: {
        enabled: true,
        level: 6,
        threshold: 1024,
    },
    pagination: {
        defaultLimit: 20,
        maxLimit: 100,
    },
    webhooks: {
        enabled: false,
        timeout: 5000,
        retries: 3,
    },
};

const defaultSecurity: SecurityConfig = {
    helmet: {
        enabled: true,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "wss:", "https:"],
                fontSrc: ["'self'", "https:", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        hsts: {
            enabled: true,
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
    },
    rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        max: 100,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        keyGenerator: (req) => req.ip,
    },
    csrf: {
        enabled: true,
        cookie: true,
    },
    xss: {
        enabled: true,
    },
    sqlInjection: {
        enabled: true,
    },
    ipFiltering: {
        enabled: false,
        whitelist: [],
        blacklist: [],
    },
    encryption: {
        algorithm: 'aes-256-gcm',
        keyDerivation: 'pbkdf2',
        iterations: 100000,
    },
};

const defaultConstants: Constants = {
    APP_NAME: 'AnimeMultiFlix',
    APP_VERSION: '4.0.0',
    APP_URL: 'https://animemultiflix.me',
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
    },
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        MODERATOR: 'moderator',
        SUPER_ADMIN: 'super_admin',
    },
    ANIME_STATUS: {
        ONGOING: 'ongoing',
        COMPLETED: 'completed',
        UPCOMING: 'upcoming',
        HIATUS: 'hiatus',
    },
    VIDEO_QUALITIES: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4320p'],
    GENRES: [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance',
        'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller', 'Supernatural', 'Mecha', 'Psychological',
        'Ecchi', 'Harem', 'Isekai', 'Magic', 'Martial Arts', 'Military', 'Music', 'Parody',
        'Police', 'Political', 'School', 'Seinen', 'Shoujo', 'Shounen', 'Space', 'Vampire',
    ],
    CACHE_KEYS: {
        ANIME_LIST: 'anime_list',
        ANIME_DETAIL: 'anime_detail_',
        USER_SESSION: 'user_session_',
        TRENDING: 'trending_anime',
        POPULAR: 'popular_anime',
        RECOMMENDATIONS: 'recommendations_',
    },
    FILE_LIMITS: {
        MAX_VIDEO_SIZE: 2 * 1024 * 1024 * 1024,
        MAX_IMAGE_SIZE: 10 * 1024 * 1024,
        MAX_SUBTITLE_SIZE: 2 * 1024 * 1024,
        MAX_AUDIO_SIZE: 50 * 1024 * 1024,
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
    },
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
        URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        PHONE: /^\+?[1-9]\d{1,14}$/,
    },
};

// ==================== MERGE CONFIGURATIONS ====================

export const config: AppConfig = { ...defaultConfig, ...environmentConfig.app };
export const database: DatabaseConfig = { ...defaultDatabase, ...environmentConfig.database };
export const auth: AuthConfig = { ...defaultAuth, ...environmentConfig.auth };
export const group: GroupConfig = { ...defaultGroup, ...environmentConfig.group };
export const chat: ChatConfig = { ...defaultChat, ...environmentConfig.chat };
export const voice: VoiceConfig = { ...defaultVoice, ...environmentConfig.voice };
export const payment: PaymentConfig = { ...defaultPayment, ...environmentConfig.payment };
export const premium: PremiumConfig = { ...defaultPremium, ...environmentConfig.premium };
export const streaming: StreamingConfig = { ...defaultStreaming, ...environmentConfig.streaming };
export const admin: AdminConfig = { ...defaultAdmin, ...environmentConfig.admin };
export const api: ApiConfig = { ...defaultApi, ...environmentConfig.api };
export const security: SecurityConfig = { ...defaultSecurity, ...environmentConfig.security };
export const constants: Constants = { ...defaultConstants, ...environmentConfig.constants };

// ==================== HELPER FUNCTIONS ====================

export function getEnv(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
}

export function isProduction(): boolean {
    return config.environment === 'production';
}

export function isDevelopment(): boolean {
    return config.environment === 'development';
}

export function isStaging(): boolean {
    return config.environment === 'staging';
}

export function isTest(): boolean {
    return config.environment === 'testing';
}

export function getMongoURI(): string {
    return database.mongodb.uri;
}

export function getRedisUrl(): string | null {
    if (!database.redis.enabled) return null;
    let url = `redis://${database.redis.host}:${database.redis.port}`;
    if (database.redis.password) {
        url = `redis://:${database.redis.password}@${database.redis.host}:${database.redis.port}`;
    }
    return url;
}

export function getPostgresUrl(): string | null {
    if (!database.postgresql.enabled) return null;
    return `postgresql://${database.postgresql.user}:${database.postgresql.password}@${database.postgresql.host}:${database.postgresql.port}/${database.postgresql.database}`;
}

export function getJwtSecret(): string {
    return auth.jwt.secret;
}

// ==================== EXPORTS ====================

export default {
    config,
    database,
    auth,
    group,
    chat,
    voice,
    payment,
    premium,
    streaming,
    admin,
    api,
    security,
    constants,
    getEnv,
    isProduction,
    isDevelopment,
    isStaging,
    isTest,
    getMongoURI,
    getRedisUrl,
    getPostgresUrl,
    getJwtSecret,
};

console.log(`\n✅ Configuration loaded for environment: ${config.environment}`);
console.log(`   Server: http://${config.host}:${config.port}`);
console.log(`   API: ${config.apiUrl}\n`);
