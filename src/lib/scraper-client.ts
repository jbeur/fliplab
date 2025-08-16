import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { MarketplaceItem, SearchParams, ScraperResponse } from '../types';

/**
 * Configuration for the scraper client
 */
export interface ScraperClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Response from the scraper service
 */
export interface ScraperServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

/**
 * Client for consuming the FlipLab Scraper Service
 * Provides a clean interface for searching marketplace items
 */
export class ScraperClient {
  private client: AxiosInstance;
  private config: ScraperClientConfig;
  private retryAttempts: number;

  constructor(config: Partial<ScraperClientConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || 'http://localhost:3001',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FlipLab-Scraper-Client/1.0.0'
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔍 Scraper Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Scraper Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Scraper Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Scraper Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check if the scraper service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/health');
      const data = response.data as ScraperServiceResponse<any>;
      
      if (data.success && data.data?.status === 'healthy') {
        console.log('✅ Scraper service is healthy');
        return true;
      } else {
        console.warn('⚠️ Scraper service is not healthy:', data.data?.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to check scraper service health:', error);
      return false;
    }
  }

  /**
   * Search Facebook Marketplace items
   */
  async searchFacebookMarketplace(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      console.log('🔍 Searching Facebook Marketplace:', params);
      
      const response = await this.executeWithRetry(() =>
        this.client.post('/api/search/facebook', params)
      );
      
      const data = response.data as ScraperServiceResponse<MarketplaceItem[]>;
      
      if (data.success && data.data) {
        console.log(`✅ Found ${data.data.length} items on Facebook Marketplace`);
        return data.data;
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error('❌ Facebook Marketplace search failed:', error);
      throw new Error(`Facebook Marketplace search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Search Poshmark items
   */
  async searchPoshmark(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      console.log('🔍 Searching Poshmark:', params);
      
      const response = await this.executeWithRetry(() =>
        this.client.post('/api/search/poshmark', params)
      );
      
      const data = response.data as ScraperServiceResponse<MarketplaceItem[]>;
      
      if (data.success && data.data) {
        console.log(`✅ Found ${data.data.length} items on Poshmark`);
        return data.data;
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error('❌ Poshmark search failed:', error);
      throw new Error(`Poshmark search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Search both platforms simultaneously
   */
  async searchAllPlatforms(params: SearchParams): Promise<{
    facebook: MarketplaceItem[];
    poshmark: MarketplaceItem[];
    total: number;
  }> {
    try {
      console.log('🔍 Searching all platforms:', params);
      
      const response = await this.executeWithRetry(() =>
        this.client.post('/api/search/all', params)
      );
      
      const data = response.data as ScraperServiceResponse<{
        facebook: MarketplaceItem[];
        poshmark: MarketplaceItem[];
        total: number;
      }>;
      
      if (data.success && data.data) {
        console.log(`✅ Found ${data.data.total} items across all platforms`);
        return data.data;
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error('❌ Multi-platform search failed:', error);
      throw new Error(`Multi-platform search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get detailed information about a specific item
   */
  async getItemDetails(url: string): Promise<MarketplaceItem | null> {
    try {
      console.log('🔍 Getting item details:', url);
      
      const response = await this.executeWithRetry(() =>
        this.client.post('/api/item/details', { url })
      );
      
      const data = response.data as ScraperServiceResponse<MarketplaceItem>;
      
      if (data.success && data.data) {
        console.log(`✅ Retrieved item details: ${data.data.title}`);
        return data.data;
      } else if (data.success && !data.data) {
        console.log('ℹ️ Item not found');
        return null;
      } else {
        throw new Error(data.error || 'Failed to get item details');
      }
      
    } catch (error) {
      console.error('❌ Failed to get item details:', error);
      throw new Error(`Failed to get item details: ${(error as Error).message}`);
    }
  }

  /**
   * Get platform status information
   */
  async getPlatformStatus(): Promise<Record<string, any>> {
    try {
      console.log('🔍 Getting platform status');
      
      const response = await this.executeWithRetry(() =>
        this.client.get('/api/platforms')
      );
      
      const data = response.data as ScraperServiceResponse<Record<string, any>>;
      
      if (data.success && data.data) {
        console.log('✅ Platform status retrieved');
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get platform status');
      }
      
    } catch (error) {
      console.error('❌ Failed to get platform status:', error);
      throw new Error(`Failed to get platform status: ${(error as Error).message}`);
    }
  }

  /**
   * Execute a request with retry logic
   */
  private async executeWithRetry<T>(
    operation: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retryAttempts) {
          console.log(`⚠️ Attempt ${attempt} failed, retrying in ${this.config.retryDelay}ms...`);
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get client configuration
   */
  getConfig(): ScraperClientConfig {
    return { ...this.config };
  }

  /**
   * Update client configuration
   */
  updateConfig(newConfig: Partial<ScraperClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update axios client configuration
    this.client.defaults.baseURL = this.config.baseURL;
    this.client.defaults.timeout = this.config.timeout;
  }
}

/**
 * Create a default scraper client instance
 */
export const createScraperClient = (config?: Partial<ScraperClientConfig>): ScraperClient => {
  return new ScraperClient(config);
};

/**
 * Default scraper client instance
 */
export const scraperClient = createScraperClient();
