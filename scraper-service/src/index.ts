import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

// Import local modules
import Config from './utils/config';
import Logger from './utils/logger';
import { ScraperService } from './services/scraper-service';
import scraperRoutes from './api/routes/scraper';

/**
 * Main application entry point
 * Sets up Express server with middleware, routes, and scraper service
 */
class ScraperServer {
  private app: express.Application;
  private config: Config;
  private logger: Logger;
  private rateLimiter: RateLimiterMemory;

  constructor() {
    this.config = Config.getInstance();
    this.logger = new Logger(this.config.logging);
    
    // Initialize Express app
    this.app = express();
    
    // Initialize rate limiter
    this.rateLimiter = new RateLimiterMemory({
      points: this.config.rateLimit.maxRequests,
      duration: this.config.rateLimit.windowMs / 1000
    });
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: this.config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
    }));

    // Compression middleware
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request ID middleware
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      req.headers['x-request-id'] = req.headers['x-request-id'] || this.generateRequestId();
      next();
    });

    // Rate limiting middleware
    this.app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const clientIp = req.ip || 'unknown';
        await this.rateLimiter.consume(clientIp);
        next();
      } catch (error) {
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: this.config.rateLimit.message,
          timestamp: new Date(),
          requestId: req.headers['x-request-id']
        });
      }
    });

    // Logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.logApiRequest(req.method, req.path, duration, res.statusCode);
      });
      
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'FlipLab Scraper Service is running',
        version: '1.0.0',
        timestamp: new Date(),
        requestId: req.headers['x-request-id']
      });
    });

    // API routes
    this.app.use('/api', scraperRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
        timestamp: new Date(),
        requestId: req.headers['x-request-id']
      });
    });
  }

  /**
   * Setup error handling middleware
   */
  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
      this.logger.logError(error, 'Global error handler');
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: this.config.isDevelopment() ? error.message : 'An unexpected error occurred',
        timestamp: new Date(),
        requestId: req.headers['x-request-id']
      });
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logger.error('Unhandled Promise Rejection:', { reason, promise });
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Initialize scraper service
      this.logger.info('Starting ScraperService initialization...');
      await ScraperService.getInstance().initialize();
      this.logger.info('ScraperService initialized successfully');

      // Start HTTP server
      const server = this.app.listen(this.config.port, () => {
        this.logger.info(`🚀 Scraper Service started on port ${this.config.port}`);
        this.logger.info(`📊 Environment: ${this.config.nodeEnv}`);
        this.logger.info(`🔗 Health check: http://localhost:${this.config.port}/api/health`);
        this.logger.info(`📚 API docs: http://localhost:${this.config.port}/api`);
        
        if (this.config.isDevelopment()) {
          this.config.printConfig();
        }
      });

      // Graceful shutdown handling
      const gracefulShutdown = async (signal: string) => {
        this.logger.info(`Received ${signal}. Starting graceful shutdown...`);
        
        server.close(async () => {
          try {
            await ScraperService.getInstance().cleanup();
            this.logger.info('Graceful shutdown completed');
            process.exit(0);
          } catch (error) {
            this.logger.error('Error during graceful shutdown:', error);
            process.exit(1);
          }
        });

        // Force shutdown after 30 seconds
        setTimeout(() => {
          this.logger.error('Forced shutdown after timeout');
          process.exit(1);
        }, 30000);
      };

      // Handle shutdown signals
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new ScraperServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
