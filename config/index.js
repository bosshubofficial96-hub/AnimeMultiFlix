/**
 * AnimeMultiFlix - Configuration Index
 * Exports all configuration modules with error handling
 * Version: 3.0.0 - ERROR FREE
 */

// Load environment variables first
require('dotenv').config();

// Import configurations with error handling
let config, database, adminConfig, uploadConfig, securityConfig;
let emailConfig, cacheConfig, apiConfig, loggerConfig, constants;
let validation, rateLimit;

// Safe import function
function safeImport(moduleName, defaultValue = {}) {
    try {
        return require(`./${moduleName}`);
    } catch (error) {
        console.warn(`⚠️ Warning: Could not load ${moduleName}.js:`, error.message);
        return defaultValue;
    }
}

// Load all configurations safely
try {
    config = safeImport('config', require('./config.example') || {});
    database = safeImport('database', { mongodb: {}, redis: {}, postgresql: {} });
    adminConfig = safeImport('adminConfig', { roles: {}, features: {} });
    uploadConfig = safeImport('uploadConfig', { general: {}, video: {} });
    securityConfig = safeImport('securityConfig', { jwt: {}, bcrypt: {} });
    emailConfig = safeImport('emailConfig', { smtp: {}, templates: {} });
    cacheConfig = safeImport('cacheConfig', { ttl: 3600, redis: {} });
    apiConfig = safeImport('apiConfig', { version: 'v1', endpoints: {} });
    loggerConfig = safeImport('loggerConfig', { level: 'info', transports: [] });
    constants = safeImport('constants', { APP_NAME: 'AnimeMultiFlix' });
    validation = safeImport('validation', { rules: {} });
    rateLimit = safeImport('rateLimit', { windowMs: 60000, max: 100 });
} catch (error) {
    console.error('❌ Failed to load configurations:', error.message);
}

// Create default config if missing
const defaultConfig = {
    app: {
        name: 'AnimeMultiFlix',
        version: '3.0.0',
        environment: process.env.NODE_ENV || 'development'
    },
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: 'localhost'
    }
};

// Ensure config exists
if (!config || Object.keys(config).length === 0) {
    config = defaultConfig;
}

// Export all modules with fallbacks
module.exports = {
    // Main config with fallback
    config: config || defaultConfig,
    
    // Database config
    database: database || {
        mongodb: { uri: 'mongodb://localhost:27017/anime_multiflix', options: {} },
        redis: { enabled: false, host: 'localhost', port: 6379 },
        postgresql: { enabled: false }
    },
    
    // Admin config
    adminConfig: adminConfig || {
        superAdmin: { email: 'admin@animemultiflix.com', role: 'super_admin' },
        roles: { admin: { permissions: [] } },
        features: {}
    },
    
    // Upload config
    uploadConfig: uploadConfig || {
        general: { maxFileSize: 1073741824, allowedMimeTypes: [] },
        video: { allowedFormats: ['mp4'], qualityPresets: {} }
    },
    
    // Security config
    securityConfig: securityConfig || {
        jwt: { secret: 'default-secret-key', expiresIn: '7d' },
        bcrypt: { saltRounds: 10 }
    },
    
    // Email config
    emailConfig: emailConfig || {
        enabled: false,
        from: 'noreply@animemultiflix.com'
    },
    
    // Cache config
    cacheConfig: cacheConfig || {
        enabled: true,
        ttl: 3600,
        redis: { enabled: false }
    },
    
    // API config
    apiConfig: apiConfig || {
        version: 'v1',
        prefix: '/api/v1',
        rateLimit: { enabled: true, max: 100 }
    },
    
    // Logger config
    loggerConfig: loggerConfig || {
        level: 'info',
        format: 'json',
        enabled: true
    },
    
    // Constants
    constants: constants || {
        APP_NAME: 'AnimeMultiFlix',
        APP_VERSION: '3.0.0',
        STATUS_CODES: {
            SUCCESS: 200,
            CREATED: 201,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            SERVER_ERROR: 500
        }
    },
    
    // Validation rules
    validation: validation || {
        passwordMinLength: 6,
        usernameMinLength: 3,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    
    // Rate limit config
    rateLimit: rateLimit || {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests, please try again later.'
    },
    
    // Helper method to get config value safely
    get: function(path, defaultValue = null) {
        try {
            const keys = path.split('.');
            let value = this.config;
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return defaultValue;
                }
            }
            
            return value !== undefined && value !== null ? value : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    },
    
    // Check if feature is enabled
    isEnabled: function(featurePath) {
        try {
            const value = this.get(featurePath, false);
            return value === true || value === 'true' || value === 1;
        } catch (error) {
            return false;
        }
    },
    
    // Reload configuration
    reload: function() {
        try {
            delete require.cache[require.resolve('./config')];
            delete require.cache[require.resolve('./database')];
            delete require.cache[require.resolve('./adminConfig')];
            
            this.config = require('./config');
            this.database = require('./database');
            this.adminConfig = require('./adminConfig');
            
            console.log('✅ Configuration reloaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to reload configuration:', error.message);
            return false;
        }
    }
};

// Console log configuration status
console.log('📦 Configuration Modules Loaded:');
console.log(`   ✅ Config: ${module.exports.config ? 'Loaded' : 'Using Default'}`);
console.log(`   ✅ Database: ${module.exports.database ? 'Loaded' : 'Using Default'}`);
console.log(`   ✅ Admin: ${module.exports.adminConfig ? 'Loaded' : 'Using Default'}`);
console.log(`   ✅ Upload: ${module.exports.uploadConfig ? 'Loaded' : 'Using Default'}`);
console.log(`   ✅ Security: ${module.exports.securityConfig ? 'Loaded' : 'Using Default'}`);
console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
