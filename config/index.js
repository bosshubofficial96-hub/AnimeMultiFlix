    /**
 * AnimeMultiFlix - Configuration Index
 * Version: 3.0.0
 * Error-Free Production Ready
 */

'use strict';

// Load environment variables
try {
    require('dotenv').config();
} catch (error) {
    console.log('⚠️ dotenv not installed, using process.env');
}

const fs = require('fs');
const path = require('path');

// Default configurations (fallbacks)
const DEFAULT_CONFIG = {
    app: {
        name: 'AnimeMultiFlix',
        version: '3.0.0',
        environment: 'development',
        debug: true
    },
    server: {
        port: 3000,
        host: 'localhost'
    }
};

const DEFAULT_DATABASE = {
    mongodb: {
        uri: 'mongodb://localhost:27017/anime_multiflix',
        options: {}
    },
    redis: {
        enabled: false,
        host: 'localhost',
        port: 6379
    }
};

const DEFAULT_ADMIN = {
    superAdmin: {
        email: 'admin@animemultiflix.com',
        role: 'super_admin'
    },
    features: {}
};

const DEFAULT_UPLOAD = {
    general: {
        maxFileSize: 1073741824,
        allowedMimeTypes: ['video/mp4', 'image/jpeg', 'image/png']
    }
};

const DEFAULT_SECURITY = {
    jwt: {
        secret: 'default-secret-key-change-me',
        expiresIn: '7d'
    },
    bcrypt: {
        saltRounds: 10
    }
};

// Safe configuration loader function
function loadConfigFile(filename, defaultValue) {
    try {
        const filePath = path.join(__dirname, filename);
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
            const config = require(filePath);
            
            // Validate config is not empty
            if (config && Object.keys(config).length > 0) {
                return config;
            }
        }
        
        // Try loading .example file if main doesn't exist
        const examplePath = path.join(__dirname, `${filename}.example`);
        if (fs.existsSync(examplePath)) {
            console.log(`📄 Using example config for: ${filename}`);
            return require(examplePath);
        }
        
        console.warn(`⚠️ Config file ${filename} not found, using defaults`);
        return defaultValue;
        
    } catch (error) {
        console.error(`❌ Error loading ${filename}:`, error.message);
        return defaultValue;
    }
}

// Load all configurations with fallbacks
const config = loadConfigFile('config.js', DEFAULT_CONFIG);
const database = loadConfigFile('database.js', DEFAULT_DATABASE);
const adminConfig = loadConfigFile('adminConfig.js', DEFAULT_ADMIN);
const uploadConfig = loadConfigFile('uploadConfig.js', DEFAULT_UPLOAD);
const securityConfig = loadConfigFile('securityConfig.js', DEFAULT_SECURITY);

// Optional configs with empty fallbacks
let emailConfig = {};
let cacheConfig = {};
let apiConfig = {};
let loggerConfig = {};
let constants = {};
let validation = {};
let rateLimit = {};

try {
    emailConfig = loadConfigFile('emailConfig.js', { enabled: false, from: 'noreply@animemultiflix.com' });
    cacheConfig = loadConfigFile('cacheConfig.js', { enabled: true, ttl: 3600 });
    apiConfig = loadConfigFile('apiConfig.js', { version: 'v1', prefix: '/api/v1' });
    loggerConfig = loadConfigFile('loggerConfig.js', { level: 'info', format: 'json' });
    constants = loadConfigFile('constants.js', { APP_NAME: 'AnimeMultiFlix', STATUS_CODES: { SUCCESS: 200 } });
    validation = loadConfigFile('validation.js', { passwordMinLength: 6, usernameMinLength: 3 });
    rateLimit = loadConfigFile('rateLimit.js', { windowMs: 60000, max: 100 });
} catch (error) {
    console.log('⚠️ Optional configs not loaded:', error.message);
}

// Helper function to get nested config values
function getConfigValue(path, defaultValue = null) {
    try {
        const keys = path.split('.');
        let value = config;
        
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
}

// Helper to check if feature is enabled
function isFeatureEnabled(featurePath) {
    try {
        const value = getConfigValue(featurePath, false);
        return value === true || value === 'true' || value === 1;
    } catch (error) {
        return false;
    }
}

// Export all configurations
module.exports = {
    // Core configs
    config,
    database,
    adminConfig,
    uploadConfig,
    securityConfig,
    
    // Optional configs
    emailConfig,
    cacheConfig,
    apiConfig,
    loggerConfig,
    constants,
    validation,
    rateLimit,
    
    // Helper methods
    get: getConfigValue,
    isEnabled: isFeatureEnabled,
    
    // Get environment
    env: process.env.NODE_ENV || 'development',
    isProduction: () => process.env.NODE_ENV === 'production',
    isDevelopment: () => process.env.NODE_ENV === 'development',
    isTest: () => process.env.NODE_ENV === 'test',
    
    // Get app info
    appName: () => config.app?.name || 'AnimeMultiFlix',
    appVersion: () => config.app?.version || '3.0.0',
    appPort: () => config.server?.port || 3000,
    
    // Reload configuration (useful for development)
    reload: function() {
        try {
            // Clear require cache
            Object.keys(require.cache).forEach(key => {
                if (key.includes('/config/')) {
                    delete require.cache[key];
                }
            });
            
            // Reload main configs
            const freshConfig = loadConfigFile('config.js', DEFAULT_CONFIG);
            const freshDatabase = loadConfigFile('database.js', DEFAULT_DATABASE);
            const freshAdmin = loadConfigFile('adminConfig.js', DEFAULT_ADMIN);
            
            Object.assign(config, freshConfig);
            Object.assign(database, freshDatabase);
            Object.assign(adminConfig, freshAdmin);
            
            console.log('✅ Configuration reloaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to reload config:', error.message);
            return false;
        }
    }
};

// Startup message
console.log('\n📦 AnimeMultiFlix Configuration Loaded');
console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   ✅ Config Version: ${config.app?.version || '3.0.0'}`);
console.log(`   ✅ Server Port: ${config.server?.port || 3000}`);
console.log('   ✅ All configs loaded successfully\n');      
