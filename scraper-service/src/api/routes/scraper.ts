import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { ScraperService } from '../../services/scraper-service';
import { SearchParams } from '../../types';
import Logger from '../../utils/logger';
import Config from '../../utils/config';

const router = Router();
const logger = new Logger(Config.getInstance().logging);

// Validation schemas
const searchParamsSchema = Joi.object({
  query: Joi.string().required().min(1).max(200),
  category: Joi.string().optional().max(100),
  location: Joi.string().optional().max(100),
  priceMin: Joi.number().optional().min(0).max(100000),
  priceMax: Joi.number().optional().min(0).max(100000),
  condition: Joi.string().optional().max(50),
  sortBy: Joi.string().optional().valid('relevance', 'price-low', 'price-high', 'date', 'distance'),
  limit: Joi.number().optional().min(1).max(100).default(20)
});

const itemDetailsSchema = Joi.object({
  url: Joi.string().uri().required()
});

/**
 * @route   GET /api/health
 * @desc    Get service health status
 * @access  Public
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    const healthStatus = await ScraperService.getInstance().getHealthStatus();
    
    logger.logApiRequest('GET', '/api/health', Date.now() - startTime, 200);
    
    res.json({
      success: true,
      data: healthStatus,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
    
  } catch (error) {
    logger.logError(error as Error, 'Health check endpoint');
    
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

/**
 * @route   POST /api/search/facebook
 * @desc    Search Facebook Marketplace items
 * @access  Public
 */
router.post('/search/facebook', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Validate request body
    const { error, value } = searchParamsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }

    const searchParams: SearchParams = value;
    
    // Execute search
    const items = await ScraperService.getInstance().searchFacebookMarketplace(searchParams);
    
    logger.logApiRequest('POST', '/api/search/facebook', Date.now() - startTime, 200);
    
    return res.json({
      success: true,
      data: items,
      message: `Found ${items.length} items on Facebook Marketplace`,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
    
  } catch (error) {
    logger.logError(error as Error, 'Facebook Marketplace search endpoint');
    
    return res.status(500).json({
      success: false,
      error: 'Search failed',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

/**
 * @route   POST /api/search/poshmark
 * @desc    Search Poshmark items
 * @access  Public
 */
router.post('/search/poshmark', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Validate request body
    const { error, value } = searchParamsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }

    const searchParams: SearchParams = value;
    
    // Execute search
    const items = await ScraperService.getInstance().searchPoshmark(searchParams);
    
    logger.logApiRequest('POST', '/api/search/poshmark', Date.now() - startTime, 200);
    
    return res.json({
      success: true,
      data: items,
      message: `Found ${items.length} items on Poshmark`,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
    
  } catch (error) {
    logger.logError(error as Error, 'Poshmark search endpoint');
    
    return res.status(500).json({
      success: false,
      error: 'Search failed',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

/**
 * @route   POST /api/search/all
 * @desc    Search both platforms simultaneously
 * @access  Public
 */
router.post('/search/all', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Validate request body
    const { error, value } = searchParamsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }

    const searchParams: SearchParams = value;
    
    // Execute searches on both platforms
    const [facebookItems, poshmarkItems] = await Promise.all([
      ScraperService.getInstance().searchFacebookMarketplace(searchParams),
      ScraperService.getInstance().searchPoshmark(searchParams)
    ]);
    
    const allItems = [...facebookItems, ...poshmarkItems];
    
    logger.logApiRequest('POST', '/api/search/all', Date.now() - startTime, 200);
    
    return res.json({
      success: true,
      data: {
        facebook: facebookItems,
        poshmark: poshmarkItems,
        total: allItems.length
      },
      message: `Found ${facebookItems.length} items on Facebook Marketplace and ${poshmarkItems.length} items on Poshmark`,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
    
  } catch (error) {
    logger.logError(error as Error, 'Multi-platform search endpoint');
    
    return res.status(500).json({
      success: false,
      error: 'Search failed',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

/**
 * @route   POST /api/item/details
 * @desc    Get detailed information about a specific item
 * @access  Public
 */
router.post('/item/details', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Validate request body
    const { error, value } = itemDetailsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }

    const { url } = value;
    
    // Determine platform and get item details
    let item;
    if (url.includes('facebook.com') || url.includes('marketplace')) {
      item = await ScraperService.getInstance().getFacebookItemDetails(url);
    } else if (url.includes('poshmark.com')) {
      item = await ScraperService.getInstance().getPoshmarkItemDetails(url);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported platform',
        message: 'URL must be from Facebook Marketplace or Poshmark',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }
    
    logger.logApiRequest('POST', '/api/item/details', Date.now() - startTime, 200);
    
    if (item) {
      return res.json({
        success: true,
        data: item,
        message: 'Item details retrieved successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'Could not retrieve item details',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] || 'unknown'
      });
    }
    
  } catch (error) {
    logger.logError(error as Error, 'Item details endpoint');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to get item details',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

/**
 * @route   GET /api/platforms
 * @desc    Get available platforms and their status
 * @access  Public
 */
router.get('/platforms', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    const platforms = await ScraperService.getInstance().getPlatformStatus();
    
    logger.logApiRequest('GET', '/api/platforms', Date.now() - startTime, 200);
    
    return res.json({
      success: true,
      data: platforms,
      message: 'Platform status retrieved successfully',
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
    
  } catch (error) {
    logger.logError(error as Error, 'Platforms endpoint');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to get platform status',
      message: (error as Error).message,
      timestamp: new Date(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
});

export default router;
