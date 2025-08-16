# MCP Integration Guide

This document explains how to integrate the FlipLab Scraper Service with actual MCP (Model Context Protocol) tools for production web scraping.

## Current Status

The scraper service currently uses placeholder implementations that simulate web scraping behavior. These placeholders generate mock data and use simple string parsing to demonstrate the architecture.

## MCP Tools Available

The following MCP tools are available in the FlipLab project:

- **@playwright/mcp**: Browser automation and web scraping
- **@upstash/context7-mcp**: Context management
- **@vercel/mcp-adapter**: Vercel integration

## Integration Steps

### 1. Replace Placeholder Navigation

In `src/services/mcp-scraper-service.ts`, replace the `navigateToPage` method:

```typescript
// Current placeholder implementation
public async navigateToPage(url: string): Promise<string> {
  // TODO: Replace with actual MCP tool calls
  const mockContent = this.generateMockPageContent(url);
  return mockContent;
}

// Replace with actual MCP implementation
public async navigateToPage(url: string): Promise<string> {
  try {
    this.logger.info(`Navigating to page: ${url}`);
    
    // Use Playwright MCP to navigate and get page content
    const pageContent = await this.mcpPlaywright.navigate(url);
    
    this.logger.debug(`Retrieved page content from ${url} (${pageContent.length} characters)`);
    return pageContent;
    
  } catch (error) {
    this.logger.logError(error as Error, 'MCP navigation');
    throw new Error(`Failed to navigate to ${url}: ${(error as Error).message}`);
  }
}
```

### 2. Replace Placeholder HTML Parsing

Replace the simple string matching with proper HTML parsing:

```typescript
// Current placeholder implementation
public async extractTextFromHTML(html: string, selector: string): Promise<string> {
  if (selector.includes('title')) {
    const match = html.match(/<[^>]*title[^>]*>([^<]*)<\/[^>]*>/i);
    return match ? match[1].trim() : '';
  }
  // ... more placeholder logic
}

// Replace with proper HTML parsing
public async extractTextFromHTML(html: string, selector: string): Promise<string> {
  try {
    this.logger.debug(`Extracting text from selector: ${selector}`);
    
    // Use a proper HTML parser (e.g., jsdom, cheerio, or MCP tools)
    const $ = cheerio.load(html);
    const element = $(selector);
    
    if (element.length === 0) {
      this.logger.debug(`Selector not found: ${selector}`);
      return '';
    }
    
    const text = element.text().trim();
    this.logger.debug(`Extracted text: "${text}" from selector: ${selector}`);
    
    return text;
    
  } catch (error) {
    this.logger.debug(`Failed to extract text from selector ${selector}: ${(error as Error).message}`);
    return '';
  }
}
```

### 3. Implement MCP Playwright Integration

Create a new service for MCP Playwright integration:

```typescript
// src/services/mcp-playwright-service.ts
export class MCPPlaywrightService {
  private logger: Logger;
  
  constructor(logger: Logger) {
    this.logger = logger;
  }
  
  async navigate(url: string): Promise<string> {
    // Use @playwright/mcp tools to:
    // 1. Launch browser
    // 2. Navigate to URL
    // 3. Wait for page load
    // 4. Extract page content
    // 5. Close browser
    
    // This will integrate with the available MCP tools
  }
  
  async extractElements(url: string, selector: string): Promise<string[]> {
    // Use Playwright to extract specific elements
  }
  
  async takeScreenshot(url: string): Promise<Buffer> {
    // Capture screenshots for debugging
  }
}
```

### 4. Update Package Dependencies

Add the necessary dependencies for proper HTML parsing:

```json
{
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "jsdom": "^22.1.0"
  }
}
```

## MCP Tool Usage Examples

### Playwright MCP

```typescript
// Example of how to use Playwright MCP
import { PlaywrightMCP } from '@playwright/mcp';

const playwright = new PlaywrightMCP();

// Navigate to a page
const page = await playwright.newPage();
await page.goto(url);
const content = await page.content();
await page.close();

return content;
```

### Context Management

```typescript
// Use Upstash context for managing scraping sessions
import { Context7MCP } from '@upstash/context7-mcp';

const context = new Context7MCP();
await context.set('scraping_session', { url, timestamp: Date.now() });
```

## Production Considerations

### 1. Rate Limiting

Implement proper rate limiting to avoid being blocked:

```typescript
public async navigateToPage(url: string): Promise<string> {
  // Check rate limits
  await this.rateLimiter.checkLimit(url);
  
  // Add random delays
  await this.randomDelay(2000, 5000);
  
  // Navigate and extract content
  const content = await this.mcpPlaywright.navigate(url);
  
  // Update rate limit counters
  await this.rateLimiter.updateCount(url);
  
  return content;
}
```

### 2. Error Handling

Implement robust error handling for various failure scenarios:

```typescript
try {
  const content = await this.mcpPlaywright.navigate(url);
  return content;
} catch (error) {
  if (error.message.includes('blocked')) {
    // Handle IP blocking
    await this.handleBlocking(url);
  } else if (error.message.includes('timeout')) {
    // Handle timeouts
    await this.handleTimeout(url);
  } else {
    // Handle other errors
    throw error;
  }
}
```

### 3. Proxy Rotation

Implement proxy rotation for avoiding detection:

```typescript
public async navigateToPage(url: string): Promise<string> {
  const proxy = await this.proxyManager.getNextProxy();
  
  try {
    const content = await this.mcpPlaywright.navigate(url, { proxy });
    return content;
  } catch (error) {
    // Mark proxy as failed
    await this.proxyManager.markFailed(proxy);
    throw error;
  }
}
```

## Testing MCP Integration

### 1. Unit Tests

```typescript
describe('MCP Scraper Service', () => {
  it('should navigate to page using MCP tools', async () => {
    const service = new MCPScraperService(mockLogger);
    const content = await service.navigateToPage('https://example.com');
    
    expect(content).toContain('Example Domain');
  });
});
```

### 2. Integration Tests

```typescript
describe('Facebook Marketplace Scraper', () => {
  it('should extract items using MCP tools', async () => {
    const scraper = new FacebookMarketplaceScraper(mockLogger, mockConfig);
    const items = await scraper.searchItems({ query: 'nike sneakers' });
    
    expect(items).toHaveLength(2);
    expect(items[0].title).toContain('Nike');
  });
});
```

## Migration Checklist

- [ ] Replace placeholder navigation with MCP Playwright
- [ ] Replace string parsing with proper HTML parsing
- [ ] Implement rate limiting and error handling
- [ ] Add proxy rotation support
- [ ] Update dependencies
- [ ] Write comprehensive tests
- [ ] Update documentation
- [ ] Performance testing
- [ ] Security review

## Support

For questions about MCP integration:

1. Check the MCP tool documentation
2. Review the existing MCP implementations in FlipLab
3. Test with small, controlled examples first
4. Monitor logs and performance metrics
5. Implement gradual rollouts for production use
