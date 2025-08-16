import { BaseScraper } from './base-scraper';
import { MarketplaceItem, SearchParams } from '../types';
import Logger from '../utils/logger';
import { ScraperConfig } from '../types';
import { MCPScraperService } from '../services/mcp-scraper-service';

/**
 * Poshmark scraper implementation using MCP
 * Handles searching and extracting item data from Poshmark
 */
export class PoshmarkScraper extends BaseScraper {
  private readonly searchUrl = 'https://poshmark.com/search';
  private mcpService: MCPScraperService;

  constructor(logger: Logger, config: ScraperConfig) {
    super(logger, config);
    this.mcpService = MCPScraperService.getInstance(logger);
  }

  /**
   * Get platform name
   */
  protected getPlatformName(): string {
    return 'Poshmark';
  }

  /**
   * Search for items on Poshmark
   */
  public async searchItems(params: SearchParams): Promise<MarketplaceItem[]> {
    try {
      this.logger.logScraping('Poshmark', 'search', params);
      
      // Build search URL with parameters
      const searchUrl = this.buildSearchUrl(params);
      
      // Navigate to search page using MCP
      await this.navigateTo(searchUrl);
      
      // Get page content
      const pageContent = await this.mcpService.navigateToPage(searchUrl);
      
      // Extract items from search results
      const items = await this.extractSearchResults(pageContent);
      
      this.logger.info(`Successfully scraped ${items.length} items from Poshmark search`);
      return items;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Poshmark search');
      throw new Error(`Poshmark search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get detailed information about a specific item
   */
  public async getItemDetails(url: string): Promise<MarketplaceItem | null> {
    try {
      this.logger.logScraping('Poshmark', 'item details', { url });
      
      // Navigate to item page using MCP
      await this.navigateTo(url);
      
      // Get page content
      const pageContent = await this.mcpService.navigateToPage(url);
      
      // Extract item details
      const item = await this.extractItemDetails(pageContent, url);
      
      if (item) {
        this.logger.info(`Successfully scraped item details from Poshmark: ${item.title}`);
      }
      
      return item;
      
    } catch (error) {
      this.logger.logError(error as Error, 'Poshmark item details');
      throw new Error(`Poshmark item details failed: ${(error as Error).message}`);
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
      url.searchParams.set('department', params.category);
    }
    
    // Add price range if specified
    if (params.priceMin !== undefined) {
      url.searchParams.set('min_price', params.priceMin.toString());
    }
    
    if (params.priceMax !== undefined) {
      url.searchParams.set('max_price', params.priceMax.toString());
    }
    
    // Add sorting if specified
    if (params.sortBy) {
      const sortMap: Record<string, string> = {
        'relevance': 'relevance',
        'price-low': 'price_asc',
        'price-high': 'price_desc',
        'date': 'just_in',
        'distance': 'distance'
      };
      
      if (sortMap[params.sortBy]) {
        url.searchParams.set('sort_by', sortMap[params.sortBy]);
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
        '.tile'
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
      this.logger.logError(error as Error, 'Extracting Poshmark search results');
      return [];
    }
  }

  /**
   * Extract item data from a single element
   */
  private async extractItemFromElement(elementText: string): Promise<MarketplaceItem | null> {
    try {
      // Extract title
      const title = await this.mcpService.extractTextFromHTML(elementText, '.tile__title');
      
      if (!title) return null;
      
      // Extract price
      const priceText = await this.mcpService.extractTextFromHTML(elementText, '.tile__price');
      const price = this.parsePrice(priceText);
      
      // Extract original price (if on sale)
      const originalPriceText = await this.mcpService.extractTextFromHTML(elementText, '.tile__price--original');
      const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;
      
      // Extract image
      const images = await this.mcpService.extractImagesFromHTML(elementText, '.tile__img img');
      
      // Extract URL
      const url = await this.mcpService.extractAttributeFromHTML(elementText, 'a', 'href');
      
      // Extract brand
      const brand = await this.mcpService.extractTextFromHTML(elementText, '.tile__brand');
      
      // Extract condition
      const condition = await this.mcpService.extractTextFromHTML(elementText, '.tile__condition');
      
      // Generate unique ID
      const id = this.generateItemId(title, price, brand);
      
      return {
        id,
        title,
        price,
        originalPrice,
        currency: 'USD',
        images: images || [],
        brand,
        condition,
        url: url.startsWith('http') ? url : `https://poshmark.com${url}`,
        platform: 'poshmark',
        scrapedAt: new Date(),
        metadata: {
          priceText,
          originalPriceText,
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
      const title = await this.mcpService.extractTextFromHTML(pageContent, '.listing-title');
      if (!title) return null;
      
      // Extract price
      const priceText = await this.mcpService.extractTextFromHTML(pageContent, '.listing-price');
      const price = this.parsePrice(priceText);
      
      // Extract original price
      const originalPriceText = await this.mcpService.extractTextFromHTML(pageContent, '.listing-price-original');
      const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;
      
      // Extract description
      const description = await this.mcpService.extractTextFromHTML(pageContent, '.listing-description');
      
      // Extract images
      const images = await this.mcpService.extractImagesFromHTML(pageContent, '.listing-images img');
      
      // Extract brand
      const brand = await this.mcpService.extractTextFromHTML(pageContent, '.listing-brand');
      
      // Extract condition
      const condition = await this.mcpService.extractTextFromHTML(pageContent, '.listing-condition');
      
      // Extract category
      const category = await this.mcpService.extractTextFromHTML(pageContent, '.listing-category');
      
      // Extract tags
      const tags = await this.mcpService.extractMultipleTextFromHTML(pageContent, '.listing-tags .tag');
      
      // Extract seller
      const seller = await this.mcpService.extractTextFromHTML(pageContent, '.listing-seller');
      
      // Generate unique ID
      const id = this.generateItemId(title, price, brand);
      
      return {
        id,
        title,
        price,
        originalPrice,
        currency: 'USD',
        description,
        images: images || [],
        brand,
        condition,
        category,
        tags,
        seller,
        url,
        platform: 'poshmark',
        scrapedAt: new Date(),
        metadata: {
          priceText,
          originalPriceText,
          extractedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      this.logger.logError(error as Error, 'Extracting Poshmark item details');
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
  private generateItemId(title: string, price: number, brand: string): string {
    const base = `${title}-${price}-${brand}`;
    return Buffer.from(base).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }
}
