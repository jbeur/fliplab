import { BaseScraper } from './base-scraper';
import { MarketplaceItem, SearchParams } from '../types';
import Logger from '../utils/logger';
import { ScraperConfig } from '../types';
import { MCPScraperService } from '../services/mcp-scraper-service';

/**
 * Facebook Marketplace scraper implementation using MCP
 * Handles searching and extracting item data from Facebook Marketplace
 */
export class FacebookMarketplaceScraper extends BaseScraper {
  private readonly searchUrl = 'https://www.facebook.com/marketplace/search';
  private mcpService: MCPScraperService;

  constructor(logger: Logger, config: ScraperConfig) {
    super(logger, config);
    this.mcpService = MCPScraperService.getInstance(logger);
  }

  /**
   * Get platform name
   */
  protected getPlatformName(): string {
    return 'Facebook Marketplace';
  }

  /**
   * Search for items on Facebook Marketplace
   */
  public async searchItems(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      this.logger.logScraping('Facebook Marketplace', 'search', params);
      
      // Build search URL with parameters
      const searchUrl = this.buildSearchUrl(params);
      
      // Navigate to search page using MCP
      await this.navigateTo(searchUrl);
      
      // Get page content
      const pageContent = await this.mcpService.navigateToPage(searchUrl);
      
      // Extract items from search results
      const items = await this.extractSearchResults(pageContent);
      
      this.logger.info(`Successfully scraped ${items.length} items from Facebook Marketplace search`);
      return items;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Facebook Marketplace search');
      throw new Error(`Facebook Marketplace search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get detailed information about a specific item
   */
  public async getItemDetails(url: string): Promise<MarketplaceItem | null> {
    try {
      this.logger.logScraping('Facebook Marketplace', 'item details', { url });
      
      // Navigate to item page using MCP
      await this.navigateTo(url);
      
      // Get page content
      const pageContent = await this.mcpService.navigateToPage(url);
      
      // Extract item details
      const item = await this.extractItemDetails(pageContent, url);
      
      if (item) {
        this.logger.info(`Successfully scraped item details from Facebook Marketplace: ${item.title}`);
      }
      
      return item;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Facebook Marketplace item details');
      throw new Error(`Facebook Marketplace item details failed: ${(error as Error).message}`);
    }
  }

  /**
   * Build search URL with parameters
   */
  private buildSearchUrl(params: SearchParams): string {
    const url = new URL(this.searchUrl);
    
    // Add query parameter
    url.searchParams.set('query', params.query);
    
    // Add category if specified
    if (params.category) {
      url.searchParams.set('category', params.category);
    }
    
    // Add location if specified
    if (params.location) {
      url.searchParams.set('location', params.location);
    }
    
    // Add price range if specified
    if (params.priceMin !== undefined) {
      url.searchParams.set('minPrice', params.priceMin.toString());
    }
    
    if (params.priceMax !== undefined) {
      url.searchParams.set('maxPrice', params.priceMax.toString());
    }
    
    // Add sorting if specified
    if (params.sortBy) {
      const sortMap: Record<string, string> = {
        'relevance': 'relevance',
        'price-low': 'price_asc',
        'price-high': 'price_desc',
        'date': 'date_desc',
        'distance': 'distance'
      };
      
      if (sortMap[params.sortBy]) {
        url.searchParams.set('sortBy', sortMap[params.sortBy]);
      }
    }
    
    return url.toString();
  }

  /**
   * Extract search results from the page content
   */
  private async extractSearchResults(pageContent: string): Promise<MarketplaceItem[]> {
    try {
      // Extract item elements using MCP service
      const itemElements = await this.mcpService.extractMultipleTextFromHTML(
        pageContent, 
        '[data-testid="marketplace_search_results"] > div'
      );
      
      const items: MarketplaceItem[] = [];
      
      for (const elementText of itemElements) {
        try {
          const item = await this.extractItemFromElement(elementText);
          if (item) {
            items.push(item);
          }
        } catch (error) {
          this.logger.debug(`Failed to extract item from element: ${(error as Error).message}`);
          continue;
        }
      }
      
      return items;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Extracting Facebook Marketplace search results');
      return [];
    }
  }

  /**
   * Extract item data from a single element
   */
  private async extractItemFromElement(elementText: string): Promise<MarketplaceItem | null> {
    try {
      // Extract title
      const title = await this.mcpService.extractTextFromHTML(elementText, '[data-testid="marketplace_item_title"]');
      
      if (!title) return null;
      
      // Extract price
      const priceText = await this.mcpService.extractTextFromHTML(elementText, '[data-testid="marketplace_item_price"]');
      const price = this.parsePrice(priceText);
      
      // Extract image
      const images = await this.mcpService.extractImagesFromHTML(elementText, 'img');
      
      // Extract URL
      const url = await this.mcpService.extractAttributeFromHTML(elementText, 'a', 'href');
      
      // Extract location
      const location = await this.mcpService.extractTextFromHTML(elementText, '[data-testid="marketplace_item_location"]');
      
      // Extract seller
      const seller = await this.mcpService.extractTextFromHTML(elementText, '[data-testid="marketplace_item_seller"]');
      
      // Generate unique ID
      const id = this.generateItemId(title, price, location);
      
      return {
        id,
        title,
        price,
        currency: 'USD',
        images: images || [],
        location,
        seller,
        url: url.startsWith('http') ? url : `https://www.facebook.com${url}`,
        platform: 'facebook-marketplace',
        scrapedAt: new Date(),
        metadata: {
          priceText,
          extractedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      this.logger.debug(`Failed to extract item from element: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Extract detailed item information from item page
   */
  private async extractItemDetails(pageContent: string, url: string): Promise<MarketplaceItem | null> {
    try {
      // Extract title
      const title = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_title"]');
      if (!title) return null;
      
      // Extract price
      const priceText = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_price"]');
      const price = this.parsePrice(priceText);
      
      // Extract description
      const description = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_description"]');
      
      // Extract images
      const images = await this.mcpService.extractImagesFromHTML(pageContent, '[data-testid="marketplace_item_images"] img');
      
      // Extract location
      const location = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_location"]');
      
      // Extract seller
      const seller = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_seller"]');
      
      // Extract condition
      const condition = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_condition"]');
      
      // Extract category
      const category = await this.mcpService.extractTextFromHTML(pageContent, '[data-testid="marketplace_item_category"]');
      
      // Generate unique ID
      const id = this.generateItemId(title, price, location);
      
      return {
        id,
        title,
        price,
        currency: 'USD',
        description,
        images: images || [],
        location,
        seller,
        condition,
        category,
        url,
        platform: 'facebook-marketplace',
        scrapedAt: new Date(),
        metadata: {
          priceText,
          extractedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      this.logger.logError(error as Error, 'Extracting Facebook Marketplace item details');
      return null;
    }
  }

  /**
   * Parse price from text
   */
  private parsePrice(priceText: string): number {
    try {
      // Remove currency symbols and non-numeric characters
      const cleanPrice = priceText.replace(/[^\d.,]/g, '');
      
      // Handle different price formats
      if (cleanPrice.includes(',')) {
        // Format: $1,234.56
        return parseFloat(cleanPrice.replace(/,/g, ''));
      } else if (cleanPrice.includes('.')) {
        // Format: $1234.56
        return parseFloat(cleanPrice);
      } else {
        // Format: $1234
        return parseFloat(cleanPrice);
      }
    } catch {
      this.logger.debug(`Failed to parse price from text: ${priceText}`);
      return 0;
    }
  }

  /**
   * Generate unique item ID
   */
  private generateItemId(title: string, price: number, location: string): string {
    const base = `${title}-${price}-${location}`;
    return Buffer.from(base).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }
}
