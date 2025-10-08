// Ball Knower Configuration
// This file handles environment-specific settings

const config = {
  // API Base URL - will be set based on environment
  API_BASE_URL: (() => {
    // Check if we're in production (deployed on Vercel)
    if (window.location.hostname === 'ballknower.app' || 
        window.location.hostname === 'www.ballknower.app') {
      return 'https://ball-knower-backend-production.up.railway.app';
    }
    
    // Check if we're in development with a custom backend URL
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // Default fallback for other environments
    return 'https://ball-knower-backend-production.up.railway.app';
  })(),
  
  // Environment detection
  isProduction: () => {
    return window.location.hostname === 'ballknower.app' || 
           window.location.hostname === 'www.ballknower.app';
  },
  
  isDevelopment: () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  },
  
  // Debug logging
  debug: () => {
    return config.isDevelopment();
  }
};

// Log configuration in development
if (config.debug()) {
  console.log('🔧 Ball Knower Config:', {
    API_BASE_URL: config.API_BASE_URL,
    isProduction: config.isProduction(),
    isDevelopment: config.isDevelopment(),
    hostname: window.location.hostname
  });
}

// Make config available globally
window.BallKnowerConfig = config;
