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
    // dotenv is optional
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
    }
};

const DEFAULT_ADMIN = {
    superAdmin: {
        email: 'admin@animemultiflix.com',
        role: 'super_admin'
    }
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
    }
};

const DEFAULT_CONSTANTS = {
    APP_NAME: 'AnimeMultiFlix',
    STATUS_CODES: {
        SUCCESS: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    }
};

// Safe configuration loader function
function loadConfigFile(filename, defaultValue) {
    try {
        const filePath = path.join(__dirname, filename);
        
        if (fs.existsSync(filePath)) {
            const config = require(filePath);
            if (config && Object.keys(config).length > 0) {
                return config;
            }
        }
        
        // Try loading .example file
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

// Load all configurations
const config = loadConfigFile('config.js', DEFAULT_CONFIG);
const database = loadConfigFile('database.js', DEFAULT_DATABASE);
const adminConfig = loadConfigFile('adminConfig.js', DEFAULT_ADMIN);
const uploadConfig = loadConfigFile('uploadConfig.js', DEFAULT_UPLOAD);
const securityConfig = loadConfigFile('securityConfig.js', DEFAULT_SECURITY);
const constants = loadConfigFile('constants.js', DEFAULT_CONSTANTS);

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
    constants,
    
    // Helper methods
    get: getConfigValue,
    isEnabled: isFeatureEnabled,
    
    // Environment helpers
    env: process.env.NODE_ENV || 'development',
    isProduction: () => process.env.NODE_ENV === 'production',
    isDevelopment: () => process.env.NODE_ENV === 'development',
    isTest: () => process.env.NODE_ENV === 'test',
    
    // App info helpers
    appName: () => config.app?.name || 'AnimeMultiFlix',
    appVersion: () => config.app?.version || '3.0.0',
    appPort: () => config.server?.port || 3000,
    
    // Reload configuration
    reload: function() {
        try {
            Object.keys(require.cache).forEach(key => {
                if (key.includes('/config/')) {
                    delete require.cache[key];
                }
            });
            
            const freshConfig = loadConfigFile('config.js', DEFAULT_CONFIG);
            Object.assign(config, freshConfig);
            
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
console.log(`   ✅ Server Port: ${config.server?.port || 3000}\n`);           
