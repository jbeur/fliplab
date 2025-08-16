import { FacebookMarketplaceScraper } from '../scrapers/facebook-marketplace-scraper';
import { PoshmarkScraper } from '../scrapers/poshmark-scraper';
import { ScraperConfig, SearchParams, MarketplaceItem, HealthStatus } from '../types';
import Logger from '../utils/logger';
import Config from '../utils/config';

/**
 * Main scraper service that manages all platform scrapers
 * Provides a unified interface for searching and extracting data
 */
export class ScraperService {
  private static instance: ScraperService;
  
  private facebookScraper: FacebookMarketplaceScraper;
  private poshmarkScraper: PoshmarkScraper;
  private logger: Logger;
  private config: ScraperConfig;
  private startTime: Date;
  private isInitialized: boolean = false;

  private constructor() {
    this.config = Config.getInstance().scraper;
    this.logger = new Logger(Config.getInstance().logging);
    this.startTime = new Date();
    
    // Initialize scrapers
    this.facebookScraper = new FacebookMarketplaceScraper(this.logger, this.config);
    this.poshmarkScraper = new PoshmarkScraper(this.logger, this.config);
  }

  /**
   * Get singleton instance of ScraperService
   */
  public static getInstance(): ScraperService {
    if (!ScraperService.instance) {
      ScraperService.instance = new ScraperService();
    }
    return ScraperService.instance;
  }

  /**
   * Initialize all scrapers
   */
  public async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing ScraperService...');
      
      // Initialize scrapers in parallel
      await Promise.all([
        this.facebookScraper.initialize(),
        this.poshmarkScraper.initialize()
      ]);
      
      this.isInitialized = true;
      this.logger.info('ScraperService initialized successfully');
      
    } catch (error) {
      this.logger.logError(error as Error, 'ScraperService initialization');
      throw new Error(`Failed to initialize ScraperService: ${(error as Error).message}`);
    }
  }

  /**
   * Cleanup all scrapers
   */
  public async cleanup(): Promise<void> {
    try {
      this.logger.info('Cleaning up ScraperService...');
      
      // Cleanup scrapers in parallel
      await Promise.all([
        this.facebookScraper.cleanup(),
        this.poshmarkScraper.cleanup()
      ]);
      
      this.isInitialized = false;
      this.logger.info('ScraperService cleaned up successfully');
      
    } catch (error) {
      this.logger.logError(error as Error, 'ScraperService cleanup');
    }
  }

  /**
   * Search Facebook Marketplace
   */
  public async searchFacebookMarketplace(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      if (!this.isInitialized) {
        throw new Error('ScraperService not initialized');
      }

      this.logger.info(`Searching Facebook Marketplace with params: ${JSON.stringify(params)}`);
      
      const items = await this.facebookScraper.searchItems(params);
      
      this.logger.info(`Facebook Marketplace search completed. Found ${items.length} items.`);
      return items;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Facebook Marketplace search');
      throw error;
    }
  }

  /**
   * Search Poshmark
   */
  public async searchPoshmark(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      if (!this.isInitialized) {
        throw new Error('ScraperService not initialized');
      }

      this.logger.info(`Searching Poshmark with params: ${JSON.stringify(params)}`);
      
      const items = await this.poshmarkScraper.searchItems(params);
      
      this.logger.info(`Poshmark search completed. Found ${items.length} items.`);
      return items;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Poshmark search');
      throw error;
    }
  }

  /**
   * Get Facebook Marketplace item details
   */
  public async getFacebookItemDetails(url: string): Promise<MarketplaceItem | null> {
    try {
      if (!this.isInitialized) {
        throw new Error('ScraperService not initialized');
      }

      this.logger.info(`Getting Facebook Marketplace item details for: ${url}`);
      
      const item = await this.facebookScraper.getItemDetails(url);
      
      if (item) {
        this.logger.info(`Successfully retrieved Facebook Marketplace item: ${item.title}`);
      } else {
        this.logger.warn(`No item found for Facebook Marketplace URL: ${url}`);
      }
      
      return item;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Facebook Marketplace item details');
      throw error;
    }
  }

  /**
   * Get Poshmark item details
   */
  public async getPoshmarkItemDetails(url: string): Promise<MarketplaceItem | null> {
    try {
      if (!this.isInitialized) {
        throw new Error('ScraperService not initialized');
      }

      this.logger.info(`Getting Poshmark item details for: ${url}`);
      
      const item = await this.poshmarkScraper.getItemDetails(url);
      
      if (item) {
        this.logger.info(`Successfully retrieved Poshmark item: ${item.title}`);
      } else {
        this.logger.warn(`No item found for Poshmark URL: ${url}`);
      }
      
      return item;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Poshmark item details');
      throw error;
    }
  }

  /**
   * Get service health status
   */
  public async getHealthStatus(): Promise<HealthStatus> {
    try {
      const memoryUsage = process.memoryUsage();
      const uptime = Date.now() - this.startTime.getTime();
      
      const status: HealthStatus = {
        status: 'healthy',
        timestamp: new Date(),
        uptime,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
        },
        scrapers: {
          facebook: this.facebookScraper.isScraperActive() ? 'active' : 'inactive',
          poshmark: this.poshmarkScraper.isScraperActive() ? 'active' : 'inactive'
        }
      };

      // Determine overall status
      if (status.scrapers.facebook === 'error' || status.scrapers.poshmark === 'error') {
        status.status = 'unhealthy';
      } else if (status.scrapers.facebook === 'inactive' || status.scrapers.poshmark === 'inactive') {
        status.status = 'degraded';
      }

      return status;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Health status check');
      
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime: Date.now() - this.startTime.getTime(),
        memory: {
          used: 0,
          total: 0,
          percentage: 0
        },
        scrapers: {
          facebook: 'error',
          poshmark: 'error'
        }
      };
    }
  }

  /**
   * Get platform status
   */
  public async getPlatformStatus(): Promise<Record<string, any>> {
    try {
      return {
        facebook: {
          name: 'Facebook Marketplace',
          status: this.facebookScraper.isScraperActive() ? 'active' : 'inactive',
          lastCheck: new Date()
        },
        poshmark: {
          name: 'Poshmark',
          status: this.poshmarkScraper.isScraperActive() ? 'active' : 'inactive',
          lastCheck: new Date()
        }
      };
      
    } catch (error) {
      this.logger.logError(error as Error, 'Platform status check');
      throw error;
    }
  }

  /**
   * Check if service is initialized
   */
  public isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get service statistics
   */
  public getServiceStats(): Record<string, any> {
    return {
      initialized: this.isInitialized,
      startTime: this.startTime,
      uptime: Date.now() - this.startTime.getTime(),
      memoryUsage: process.memoryUsage(),
      platformStatus: {
        facebook: this.facebookScraper.isScraperActive(),
        poshmark: this.poshmarkScraper.isScraperActive()
      }
    };
  }
}
