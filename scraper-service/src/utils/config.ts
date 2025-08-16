import dotenv from 'dotenv';
import { ScraperConfig, RateLimitConfig, LogConfig } from '../types';

// Load environment variables
dotenv.config();

/**
 * Configuration manager for the scraper service
 * Loads and validates environment variables with sensible defaults
 */
class Config {
  private static instance: Config;
  
  // Server configuration
  public readonly port: number;
  public readonly nodeEnv: string;
  
  // Rate limiting
  public readonly rateLimit: RateLimitConfig;
  
  // Scraping configuration
  public readonly scraper: ScraperConfig;
  
  // Logging configuration
  public readonly logging: LogConfig;
  
  // CORS configuration
  public readonly corsOrigin: string;

  private constructor() {
    // Server configuration
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.nodeEnv = process.env.NODE_ENV || 'development';
    
    // Rate limiting configuration
    this.rateLimit = {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      message: 'Too many requests from this IP, please try again later.'
    };
    
    // Scraping configuration
    this.scraper = {
      timeout: parseInt(process.env.SCRAPER_TIMEOUT_MS || '30000', 10),
      headless: process.env.SCRAPER_HEADLESS !== 'false',
      userAgent: process.env.SCRAPER_USER_AGENT || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      retryAttempts: 3,
      retryDelay: 1000,
      rateLimitDelay: 2000
    };
    
    // Logging configuration
    this.logging = {
      level: process.env.LOG_LEVEL || 'info',
      filePath: process.env.LOG_FILE_PATH || './logs/scraper-service.log',
      console: true
    };
    
    // CORS configuration
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    
    this.validate();
  }

  /**
   * Get singleton instance of Config
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Validate configuration values
   */
  private validate(): void {
    if (this.port < 1 || this.port > 65535) {
      throw new Error('Invalid PORT configuration. Must be between 1 and 65535.');
    }
    
    if (this.scraper.timeout < 1000) {
      throw new Error('Invalid SCRAPER_TIMEOUT_MS configuration. Must be at least 1000ms.');
    }
    
    if (this.rateLimit.maxRequests < 1) {
      throw new Error('Invalid RATE_LIMIT_MAX_REQUESTS configuration. Must be at least 1.');
    }
    
    if (this.rateLimit.windowMs < 1000) {
      throw new Error('Invalid RATE_LIMIT_WINDOW_MS configuration. Must be at least 1000ms.');
    }
  }

  /**
   * Check if running in development mode
   */
  public isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  /**
   * Check if running in production mode
   */
  public isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  /**
   * Get all configuration as a plain object
   */
  public toObject(): Record<string, any> {
    return {
      port: this.port,
      nodeEnv: this.nodeEnv,
      rateLimit: this.rateLimit,
      scraper: this.scraper,
      logging: this.logging,
      corsOrigin: this.corsOrigin
    };
  }

  /**
   * Print configuration to console (development only)
   */
  public printConfig(): void {
    if (this.isDevelopment()) {
      console.log('🔧 Scraper Service Configuration:');
      console.log(JSON.stringify(this.toObject(), null, 2));
    }
  }
}

export default Config;
