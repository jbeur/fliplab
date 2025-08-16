import { useState, useCallback, useRef } from 'react';
import { MarketplaceItem, SearchParams } from '../types';
import { scraperClient, ScraperClientConfig } from '../lib/scraper-client';

/**
 * State interface for the scraper hook
 */
interface ScraperState {
  items: MarketplaceItem[];
  loading: boolean;
  error: string | null;
  lastSearch: SearchParams | null;
  totalResults: number;
}

/**
 * Hook for integrating with the FlipLab Scraper Service
 * Provides state management, search functions, and error handling
 */
export const useScraper = (config?: Partial<ScraperClientConfig>) => {
  // Initialize state
  const [state, setState] = useState<ScraperState>({
    items: [],
    loading: false,
    error: null,
    lastSearch: null,
    totalResults: 0
  });

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Update scraper client config if provided
  if (config) {
    scraperClient.updateConfig(config);
  }

  /**
   * Check if the scraper service is healthy
   */
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const isHealthy = await scraperClient.checkHealth();
      
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: isHealthy ? null : 'Scraper service is not healthy'
        }));
      }
      
      return isHealthy;
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Health check failed: ${(error as Error).message}` 
        }));
      }
      return false;
    }
  }, []);

  /**
   * Search Facebook Marketplace
   */
  const searchFacebook = useCallback(async (params: SearchParams): Promise<void> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        lastSearch: params 
      }));
      
      const items = await scraperClient.searchFacebookMarketplace(params);
      
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          items,
          loading: false,
          totalResults: items.length,
          error: null
        }));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Facebook search failed: ${(error as Error).message}` 
        }));
      }
    }
  }, []);

  /**
   * Search Poshmark
   */
  const searchPoshmark = useCallback(async (params: SearchParams): Promise<void> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        lastSearch: params 
      }));
      
      const items = await scraperClient.searchPoshmark(params);
      
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          items,
          loading: false,
          totalResults: items.length,
          error: null
        }));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Poshmark search failed: ${(error as Error).message}` 
        }));
      }
    }
  }, []);

  /**
   * Search all platforms
   */
  const searchAll = useCallback(async (params: SearchParams): Promise<void> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        lastSearch: params 
      }));
      
      const result = await scraperClient.searchAllPlatforms(params);
      
      if (isMountedRef.current) {
        // Combine items from both platforms
        const allItems = [...result.facebook, ...result.poshmark];
        
        setState(prev => ({ 
          ...prev, 
          items: allItems,
          loading: false,
          totalResults: result.total,
          error: null
        }));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Multi-platform search failed: ${(error as Error).message}` 
        }));
      }
    }
  }, []);

  /**
   * Get item details
   */
  const getItemDetails = useCallback(async (url: string): Promise<MarketplaceItem | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const item = await scraperClient.getItemDetails(url);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return item;
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Failed to get item details: ${(error as Error).message}` 
        }));
      }
      return null;
    }
  }, []);

  /**
   * Get platform status
   */
  const getPlatformStatus = useCallback(async (): Promise<Record<string, any> | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const status = await scraperClient.getPlatformStatus();
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return status;
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `Failed to get platform status: ${(error as Error).message}` 
        }));
      }
      return null;
    }
  }, []);

  /**
   * Clear current results and error
   */
  const clearResults = useCallback((): void => {
    setState(prev => ({ 
      ...prev, 
      items: [], 
      error: null, 
      totalResults: 0 
    }));
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Retry last search
   */
  const retryLastSearch = useCallback(async (): Promise<void> => {
    if (state.lastSearch) {
      await searchAll(state.lastSearch);
    }
  }, [state.lastSearch, searchAll]);

  /**
   * Filter items by platform
   */
  const getItemsByPlatform = useCallback((platform: 'facebook-marketplace' | 'poshmark'): MarketplaceItem[] => {
    return state.items.filter(item => item.platform === platform);
  }, [state.items]);

  /**
   * Filter items by price range
   */
  const getItemsByPriceRange = useCallback((minPrice: number, maxPrice: number): MarketplaceItem[] => {
    return state.items.filter(item => 
      item.price >= minPrice && item.price <= maxPrice
    );
  }, [state.items]);

  /**
   * Sort items by price
   */
  const sortItemsByPrice = useCallback((ascending: boolean = true): MarketplaceItem[] => {
    return [...state.items].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
  }, [state.items]);

  /**
   * Get unique categories from items
   */
  const getUniqueCategories = useCallback((): string[] => {
    const categories = state.items
      .map(item => item.category)
      .filter(Boolean) as string[];
    
    return [...new Set(categories)];
  }, [state.items]);

  /**
   * Get price statistics
   */
  const getPriceStats = useCallback((): {
    min: number;
    max: number;
    average: number;
    median: number;
  } => {
    if (state.items.length === 0) {
      return { min: 0, max: 0, average: 0, median: 0 };
    }

    const prices = state.items.map(item => item.price).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 === 0 
      ? (prices[mid - 1] + prices[mid]) / 2 
      : prices[mid];

    return { min, max, average, median };
  }, [state.items]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    checkHealth,
    searchFacebook,
    searchPoshmark,
    searchAll,
    getItemDetails,
    getPlatformStatus,
    clearResults,
    clearError,
    retryLastSearch,
    
    // Utilities
    getItemsByPlatform,
    getItemsByPriceRange,
    sortItemsByPrice,
    getUniqueCategories,
    getPriceStats,
    
    // Cleanup
    cleanup
  };
};
