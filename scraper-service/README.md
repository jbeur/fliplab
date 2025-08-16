# FlipLab Scraper Service

A standalone web scraping service for Facebook Marketplace and Poshmark that provides RESTful API endpoints for FlipLab to consume marketplace data.

## Features

- **Multi-Platform Scraping**: Facebook Marketplace and Poshmark support
- **RESTful API**: Clean, documented endpoints for easy integration
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Comprehensive error handling and logging
- **Health Monitoring**: Real-time service health and status endpoints
- **Configurable**: Environment-based configuration
- **Production Ready**: Security middleware, CORS, compression, and graceful shutdown
- **MCP Ready**: Designed for easy integration with MCP (Model Context Protocol) tools

## Architecture

```
src/
├── api/                    # API routes and middleware
│   └── routes/
│       └── scraper.ts     # Main API endpoints
├── scrapers/              # Platform-specific scrapers
│   ├── base-scraper.ts    # Common scraper functionality
│   ├── facebook-marketplace-scraper.ts
│   └── poshmark-scraper.ts
├── services/              # Business logic
│   └── scraper-service.ts # Main service orchestrator
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   ├── config.ts          # Configuration management
│   └── logger.ts          # Logging utility
└── index.ts               # Main server entry point
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- MCP tools (for production web scraping)

### Installation

1. **Clone and navigate to the scraper service directory:**
   ```bash
   cd scraper-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the service:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The service will start on port 3001 (configurable via `PORT` environment variable).

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `SCRAPER_TIMEOUT_MS` | Scraping timeout (ms) | `30000` |
| `SCRAPER_HEADLESS` | Run browser in headless mode | `true` |
| `SCRAPER_USER_AGENT` | Browser user agent string | Chrome 120 user agent |
| `LOG_LEVEL` | Logging level | `info` |
| `LOG_FILE_PATH` | Log file path | `./logs/scraper-service.log` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600000,
    "memory": {
      "used": 45,
      "total": 128,
      "percentage": 35
    },
    "scrapers": {
      "facebook": "active",
      "poshmark": "active"
    }
  }
}
```

### Search Facebook Marketplace
```http
POST /api/search/facebook
Content-Type: application/json

{
  "query": "nike sneakers",
  "category": "shoes",
  "priceMin": 20,
  "priceMax": 100,
  "sortBy": "price-low",
  "limit": 20
}
```

### Search Poshmark
```http
POST /api/search/poshmark
Content-Type: application/json

{
  "query": "nike sneakers",
  "category": "shoes",
  "priceMin": 20,
  "priceMax": 100,
  "sortBy": "price-low",
  "limit": 20
}
```

### Search Both Platforms
```http
POST /api/search/all
Content-Type: application/json

{
  "query": "nike sneakers",
  "priceMin": 20,
  "priceMax": 100
}
```

### Get Item Details
```http
POST /api/item/details
Content-Type: application/json

{
  "url": "https://www.facebook.com/marketplace/item/123456789"
}
```

### Platform Status
```http
GET /api/platforms
```

## Data Models

### Search Parameters
```typescript
interface SearchParams {
  query: string;           // Required: Search query
  category?: string;        // Optional: Item category
  location?: string;        // Optional: Location filter
  priceMin?: number;        // Optional: Minimum price
  priceMax?: number;        // Optional: Maximum price
  condition?: string;       // Optional: Item condition
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'date' | 'distance';
  limit?: number;           // Optional: Result limit (default: 20)
}
```

### Marketplace Item
```typescript
interface MarketplaceItem {
  id: string;              // Unique item identifier
  title: string;           // Item title
  price: number;           // Current price
  originalPrice?: number;  // Original price (if on sale)
  currency: string;        // Currency code
  description?: string;    // Item description
  images: string[];        // Array of image URLs
  location?: string;       // Item location
  seller?: string;         // Seller information
  condition?: string;      // Item condition
  category?: string;       // Item category
  tags?: string[];         // Item tags
  url: string;             // Item URL
  platform: 'facebook-marketplace' | 'poshmark';
  scrapedAt: Date;         // When data was scraped
  metadata?: Record<string, any>; // Additional metadata
}
```

## Integration with FlipLab

### Basic Usage Example

```typescript
// Search for items on both platforms
const searchParams = {
  query: "nike air max",
  priceMin: 50,
  priceMax: 200,
  limit: 25
};

const response = await fetch('http://localhost:3001/api/search/all', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(searchParams)
});

const result = await response.json();
console.log(`Found ${result.data.total} items across platforms`);
```

### Error Handling

```typescript
try {
  const response = await fetch('http://localhost:3001/api/search/facebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'test' })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.message);
    return;
  }
  
  const data = await response.json();
  // Process successful response
  
} catch (error) {
  console.error('Network Error:', error);
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests

### Adding New Platforms

1. Create a new scraper class extending `BaseScraper`
2. Implement required abstract methods
3. Add the scraper to `ScraperService`
4. Update API routes if needed
5. Add platform-specific types

### MCP Integration

The service is designed to work with MCP (Model Context Protocol) tools. See [MCP_INTEGRATION.md](./MCP_INTEGRATION.md) for detailed integration instructions.

**Current Status**: The service uses placeholder implementations that simulate web scraping behavior. These placeholders generate mock data and use simple string parsing to demonstrate the architecture.

**Next Steps**: Replace placeholder implementations with actual MCP tool calls for production web scraping.

### Logging

The service uses Winston for structured logging with:
- Console output (development)
- File rotation (production)
- Request/response logging
- Error tracking
- Scraping operation logging

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **Error Sanitization**: Production-safe error messages

## Monitoring

### Health Endpoints
- `/api/health` - Service health status
- `/api/platforms` - Platform availability

### Metrics
- Memory usage
- Uptime
- Scraper status
- Request counts and response times

## Troubleshooting

### Common Issues

1. **Puppeteer Installation**
   ```bash
   # If you encounter Puppeteer issues
   npm install puppeteer --unsafe-perm=true
   ```

2. **Port Already in Use**
   ```bash
   # Change port in .env file
   PORT=3002
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 dist/index.js
   ```

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Check the logs in `./logs/` directory
- Review the health endpoints
- Check platform status endpoints
- Ensure proper environment configuration
