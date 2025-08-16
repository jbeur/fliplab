import Logger from '../utils/logger';
import { ScraperConfig, MarketplaceItem, SearchParams } from '../types';

/**
 * Base scraper class providing common functionality for all marketplace scrapers
 * Uses MCP (Model Context Protocol) for web scraping operations
 */
export abstract class BaseScraper {
  protected logger: Logger;
  protected config: ScraperConfig;
  protected isActive: boolean = false;

  constructor(logger: Logger, config: ScraperConfig) {
    this.logger = logger;
    this.config = config;
  }

  /**
   * Initialize the scraper
   */
  public async initialize(): Promise<void> {
    try {
      this.logger.info(`Initializing ${this.getPlatformName()} scraper`);
      
      // For MCP-based scraping, we don't need to initialize a browser
      // The MCP server handles the browser management
      this.isActive = true;
      this.logger.info(`${this.getPlatformName()} scraper initialized successfully`);
      
    } catch (error) {
      this.logger.logError(error as Error, `${this.getPlatformName()} scraper initialization`);
      throw new Error(`Failed to initialize ${this.getPlatformName()} scraper: ${(error as Error).message}`);
    }
  }

  /**
   * Cleanup resources
   */
  public async cleanup(): Promise<void> {
    try {
      this.logger.info(`Cleaning up ${this.getPlatformName()} scraper`);
      
      // No browser cleanup needed for MCP
      this.isActive = false;
      this.logger.info(`${this.getPlatformName()} scraper cleaned up successfully`);
      
    } catch (error) {
      this.logger.logError(error as Error, `${this.getPlatformName()} scraper cleanup`);
    }
  }

  /**
   * Execute a scraping operation with retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        this.logger.debug(`Executing ${operationName} on ${this.getPlatformName()} (attempt ${attempt}/${this.config.retryAttempts})`);
        
        const result = await operation();
        
        if (attempt > 1) {
          this.logger.info(`${operationName} succeeded on ${this.getPlatformName()} after ${attempt} attempts`);
        }
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Attempt ${attempt} failed for ${operationName} on ${this.getPlatformName()}: ${lastError.message}`);
        
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }
    
    this.logger.error(`All ${this.config.retryAttempts} attempts failed for ${operationName} on ${this.getPlatformName()}`);
    throw new Error(`Operation failed after ${this.config.retryAttempts} attempts: ${lastError!.message}`);
  }

  /**
   * Navigate to a URL using MCP
   * This is a placeholder - actual implementation will be in subclasses
   */
  protected async navigateTo(url: string): Promise<void> {
    try {
      this.logger.debug(`Navigating to ${url} on ${this.getPlatformName()}`);
      
      // Add random delay to avoid detection
      await this.randomDelay(1000, 3000);
      
    } catch (error) {
      this.logger.logError(error as Error, `Navigation to ${url} on ${this.getPlatformName()}`);
      throw new Error(`Failed to navigate to ${url}: ${(error as Error).message}`);
    }
  }

  /**
   * Extract text content from an element using MCP
   * This is a placeholder - actual implementation will be in subclasses
   */
  protected async extractText(selector: string): Promise<string> {
    try {
      this.logger.debug(`Extracting text from selector: ${selector}`);
      return '';
    } catch (error) {
      this.logger.debug(`Failed to extract text from selector ${selector}: ${(error as Error).message}`);
      return '';
    }
  }

  /**
   * Extract attribute value from an element using MCP
   * This is a placeholder - actual implementation will be in subclasses
   */
  protected async extractAttribute(selector: string, attribute: string): Promise<string> {
    try {
      this.logger.debug(`Extracting attribute ${attribute} from selector: ${selector}`);
      return '';
    } catch (error) {
      this.logger.debug(`Failed to extract attribute ${attribute} from selector ${selector}: ${(error as Error).message}`);
      return '';
    }
  }

  /**
   * Extract multiple elements and their text content using MCP
   * This is a placeholder - actual implementation will be in subclasses
   */
  protected async extractMultipleText(selector: string): Promise<string[]> {
    try {
      this.logger.debug(`Extracting multiple texts from selector: ${selector}`);
      return [];
    } catch (error) {
      this.logger.debug(`Failed to extract multiple texts from selector ${selector}: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Extract image URLs from elements using MCP
   * This is a placeholder - actual implementation will be in subclasses
   */
  protected async extractImages(selector: string): Promise<string[]> {
    try {
      this.logger.debug(`Extracting images from selector: ${selector}`);
      return [];
    } catch (error) {
      this.logger.debug(`Failed to extract images from selector ${selector}: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Wait for a random amount of time
   */
  protected async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await this.delay(delay);
  }

  /**
   * Simple delay utility
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if scraper is active
   */
  public isScraperActive(): boolean {
    return this.isActive;
  }

  /**
   * Get platform name (to be implemented by subclasses)
   */
  protected abstract getPlatformName(): string;

  /**
   * Search for items (to be implemented by subclasses)
   */
  public abstract searchItems(params: SearchParams): Promise<MarketplaceItem[]>;

  /**
   * Get item details (to be implemented by subclasses)
   */
  public abstract getItemDetails(url: string): Promise<MarketplaceItem | null>;
}
