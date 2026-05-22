/**
 * AnimeMultiFlix - Database Configuration
 * Version: 3.0.0
 * Supports MongoDB, Redis, PostgreSQL
 */

'use strict';

// Load environment variables
try {
    require('dotenv').config();
} catch (error) {
    // dotenv is optional
}

// Database configuration
const database = {
    // MongoDB Configuration (Primary Database)
    mongodb: {
        enabled: process.env.MONGODB_ENABLED !== 'false',
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/anime_multiflix',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            poolSize: parseInt(process.env.MONGODB_POOL_SIZE) || 10,
            socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
            connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT) || 10000,
            family: 4, // Use IPv4
            retryWrites: true,
            retryReads: true,
            maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL) || 10,
            minPoolSize: parseInt(process.env.MONGODB_MIN_POOL) || 1,
            maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME) || 30000,
            waitQueueTimeoutMS: parseInt(process.env.MONGODB_QUEUE_TIMEOUT) || 10000
        },
        collections: {
            users: 'users',
            animes: 'animes',
            episodes: 'episodes',
            admins: 'admins',
            watchHistory: 'watch_histories',
            comments: 'comments',
            reports: 'reports',
            analytics: 'analytics',
            genres: 'genres',
            seasons: 'seasons',
            watchlist: 'watchlists',
            reviews: 'reviews',
            notifications: 'notifications',
            settings: 'settings',
            backups: 'backups'
        },
        backup: {
            enabled: process.env.MONGODB_BACKUP_ENABLED === 'true',
            interval: '0 2 * * *', // Daily at 2 AM
            retention: 7, // days
            path: './backups/mongodb'
        }
    },

    // Redis Configuration (Cache & Sessions)
    redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || null,
        db: parseInt(process.env.REDIS_DB) || 0,
        keyPrefix: 'amf:',
        ttl: parseInt(process.env.REDIS_TTL) || 3600, // 1 hour
        options: {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false
        },
        useFor: {
            sessions: true,
            cache: true,
            queue: true,
            rateLimiting: true
        }
    },

    // PostgreSQL Configuration (Analytics & Reports)
    postgresql: {
        enabled: process.env.PG_ENABLED === 'true',
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT) || 5432,
        database: process.env.PG_DATABASE || 'anime_multiflix',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'password',
        ssl: process.env.PG_SSL === 'true',
        max: parseInt(process.env.PG_MAX_CONNECTIONS) || 20,
        idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT) || 30000,
        connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT) || 2000,
        tables: {
            analytics: 'analytics',
            reports: 'reports',
            logs: 'logs',
            events: 'events',
            metrics: 'metrics'
        }
    },

    // MySQL Configuration (Alternative)
    mysql: {
        enabled: process.env.MYSQL_ENABLED === 'false',
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        database: process.env.MYSQL_DATABASE || 'anime_multiflix',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 10,
        tables: {
            users: 'users',
            settings: 'settings'
        }
    },

    // Connection Management
    connections: {
        maxRetries: parseInt(process.env.DB_MAX_RETRIES) || 5,
        retryDelay: parseInt(process.env.DB_RETRY_DELAY) || 5000,
        monitorInterval: parseInt(process.env.DB_MONITOR_INTERVAL) || 60000,
        healthCheck: {
            enabled: true,
            interval: 30000,
            timeout: 5000
        }
    },

    // Backup Configuration
    backup: {
        enabled: process.env.DB_BACKUP_ENABLED === 'true',
        schedule: process.env.DB_BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
        retention: parseInt(process.env.DB_BACKUP_RETENTION) || 30, // days
        compression: true,
        encryption: process.env.DB_BACKUP_ENCRYPTION === 'true',
        storage: {
            type: process.env.BACKUP_STORAGE || 'local', // local, s3, gcs
            path: './backups/database',
            s3: {
                bucket: process.env.BACKUP_S3_BUCKET,
                region: process.env.BACKUP_S3_REGION,
                accessKey: process.env.BACKUP_S3_ACCESS_KEY,
                secretKey: process.env.BACKUP_S3_SECRET_KEY
            }
        }
    },

    // Migration Settings
    migration: {
        enabled: true,
        autoRun: process.env.NODE_ENV === 'development',
        tableName: 'migrations',
        directory: './database/migrations',
        template: {
            up: '// Migration up script',
            down: '// Migration down script'
        }
    },

    // Seeding Configuration
    seeding: {
        enabled: process.env.NODE_ENV === 'development',
        dataPath: './database/seeds',
        defaultData: {
            genres: [
                'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
                'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
                'Sports', 'Thriller', 'Supernatural', 'Mecha', 'Psychological'
            ],
            roles: ['user', 'admin', 'moderator', 'editor']
        }
    }
};

// Helper method to get MongoDB URI with authentication
database.getMongoURI = function() {
    let uri = this.mongodb.uri;
    
    // If username and password are provided in env
    if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
        const auth = `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@`;
        uri = uri.replace('mongodb://', `mongodb://${auth}`);
    }
    
    return uri;
};

// Helper method to check if database is connected
database.isConnected = function() {
    return this._connected || false;
};

// Helper method to set connection status
database.setConnected = function(status) {
    this._connected = status;
};

// Helper method to get Redis connection string
database.getRedisUrl = function() {
    let url = `redis://${this.redis.host}:${this.redis.port}`;
    if (this.redis.password) {
        url = `redis://:${this.redis.password}@${this.redis.host}:${this.redis.port}`;
    }
    return url;
};

// Helper method to get PostgreSQL connection string
database.getPostgresUrl = function() {
    let url = `postgresql://${this.postgresql.user}:${this.postgresql.password}@${this.postgresql.host}:${this.postgresql.port}/${this.postgresql.database}`;
    return url;
};

// Environment specific configurations
if (process.env.NODE_ENV === 'production') {
    database.mongodb.options.poolSize = 20;
    database.redis.ttl = 7200; // 2 hours
    database.backup.enabled = true;
}

if (process.env.NODE_ENV === 'development') {
    database.mongodb.options.poolSize = 5;
    database.redis.ttl = 300; // 5 minutes
    database.seeding.enabled = true;
}

if (process.env.NODE_ENV === 'test') {
    database.mongodb.uri = 'mongodb://localhost:27017/anime_multiflix_test';
    database.redis.db = 1;
    database.backup.enabled = false;
    database.seeding.enabled = false;
}

// Export configuration
module.exports = database;

// Log database configuration (only in development)
if (process.env.NODE_ENV === 'development') {
    console.log('\n🗄️ Database Configuration Loaded:');
    console.log(`   ✅ MongoDB: ${database.mongodb.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   ✅ Redis: ${database.redis.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   ✅ PostgreSQL: ${database.postgresql.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   ✅ Backup: ${database.backup.enabled ? 'Enabled' : 'Disabled'}\n`);
      }
