// Core data types for scraped marketplace items
export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description?: string;
  images: string[];
  location?: string;
  seller?: string;
  condition?: string;
  category?: string;
  brand?: string;
  tags?: string[];
  url: string;
  platform: 'facebook-marketplace' | 'poshmark';
  scrapedAt: Date;
  metadata?: Record<string, any>;
}

// Search parameters for scraping
export interface SearchParams {
  query: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'date' | 'distance';
  limit?: number;
}

// API response structure
export interface ScraperResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  requestId: string;
}

// Scraping configuration
export interface ScraperConfig {
  timeout: number;
  headless: boolean;
  userAgent: string;
  retryAttempts: number;
  retryDelay: number;
  rateLimitDelay: number;
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

// Logging configuration
export interface LogConfig {
  level: string;
  filePath?: string;
  console: boolean;
}

// Service health status
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  scrapers: {
    facebook: 'active' | 'inactive' | 'error';
    poshmark: 'active' | 'inactive' | 'error';
  };
}

// Error types
export enum ScraperErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ScraperError {
  type: ScraperErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}
