/**
 * Environment configuration validation
 * This ensures all required environment variables are present
 */

const requiredEnvVars = {
  // Google Cloud Vision API (optional for demo mode)
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  
  // eBay API (optional for demo mode)
  EBAY_APP_ID: process.env.EBAY_APP_ID,
  EBAY_CERT_ID: process.env.EBAY_CERT_ID,
  EBAY_CLIENT_SECRET: process.env.EBAY_CLIENT_SECRET,
} as const;

/**
 * Check if all required environment variables are set
 * @returns boolean - True if all required vars are present
 */
export const validateEnvironment = (): boolean => {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('📱 App will run in demo mode with mock data');
    return false;
  }
  
  return true;
};

/**
 * Get environment configuration
 * @returns Environment configuration object
 */
export const getEnvConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasGoogleVision = !!(requiredEnvVars.GOOGLE_CLOUD_PROJECT_ID && 
                            requiredEnvVars.GOOGLE_CLOUD_PRIVATE_KEY && 
                            requiredEnvVars.GOOGLE_CLOUD_CLIENT_EMAIL);
  const hasEbayApi = !!(requiredEnvVars.EBAY_APP_ID && 
                        requiredEnvVars.EBAY_CLIENT_SECRET);
  
  return {
    isProduction,
    hasGoogleVision,
    hasEbayApi,
    isDemoMode: !hasGoogleVision || !hasEbayApi,
  };
};

/**
 * Environment variables for client-side use
 * Only expose safe, public variables
 */
export const clientEnv = {
  NODE_ENV: process.env.NODE_ENV,
  IS_DEMO_MODE: !validateEnvironment(),
} as const;
