import winston from 'winston';
import path from 'path';
import { LogConfig } from '../types';

/**
 * Winston logger configuration for the scraper service
 * Provides structured logging with file rotation and console output
 */
class Logger {
  private logger: winston.Logger;

  constructor(config: LogConfig) {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    const transports: winston.transport[] = [];

    // Console transport
    if (config.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      );
    }

    // File transport
    if (config.filePath) {
      const logDir = path.dirname(config.filePath);
      const fileName = path.basename(config.filePath, path.extname(config.filePath));
      
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, `${fileName}.log`),
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true
        }),
        new winston.transports.File({
          filename: path.join(logDir, `${fileName}-error.log`),
          level: 'error',
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true
        })
      );
    }

    this.logger = winston.createLogger({
      level: config.level || 'info',
      format: logFormat,
      transports,
      exitOnError: false
    });

    // Handle uncaught exceptions
    this.logger.exceptions.handle(
      new winston.transports.File({
        filename: config.filePath ? path.join(path.dirname(config.filePath), 'exceptions.log') : 'exceptions.log'
      })
    );
  }

  /**
   * Log an info message
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log a warning message
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log an error message
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log a debug message
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log scraping operation details
   */
  logScraping(platform: string, operation: string, details: any): void {
    this.info(`Scraping ${operation} on ${platform}`, {
      platform,
      operation,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log API request details
   */
  logApiRequest(method: string, path: string, duration: number, statusCode: number): void {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      duration: `${duration}ms`,
      statusCode,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log error with context
   */
  logError(error: Error, context: string, meta?: any): void {
    this.error(`Error in ${context}: ${error.message}`, {
      context,
      error: error.stack,
      ...meta,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get the underlying Winston logger instance
   */
  getLogger(): winston.Logger {
    return this.logger;
  }
}

export default Logger;
