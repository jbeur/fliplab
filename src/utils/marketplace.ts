import { MarketplaceData, ComprehensiveAnalysis } from '@/types';

/**
 * Calculate price range from marketplace data
 * @param data - Array of marketplace data
 * @returns Object with low, high, and average prices
 */
export const calculatePriceRange = (data: MarketplaceData[]) => {
  if (data.length === 0) return { low: 0, high: 0, average: 0 };
  
  const prices = data.map(item => item.price).sort((a, b) => a - b);
  const low = prices[0];
  const high = prices[prices.length - 1];
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  return { low, high, average };
};

/**
 * Determine recommended platforms based on marketplace data
 * @param data - Array of marketplace data
 * @returns Array of recommended platform names
 */
export const getRecommendedPlatforms = (data: MarketplaceData[]): string[] => {
  const platformCounts: Record<string, number> = {};
  
  data.forEach(item => {
    platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
  });
  
  // Sort by frequency and return top platforms
  return Object.entries(platformCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([platform]) => platform);
};

/**
 * Calculate suggested listing price
 * @param averagePrice - Average market price
 * @param condition - Item condition
 * @returns Suggested listing price
 */
export const calculateSuggestedListingPrice = (averagePrice: number, condition: string): number => {
  let multiplier = 1.0;
  
  // Adjust based on condition
  switch (condition.toLowerCase()) {
    case 'excellent':
    case 'like new':
      multiplier = 1.1;
      break;
    case 'good':
      multiplier = 1.0;
      break;
    case 'fair':
      multiplier = 0.9;
      break;
    case 'poor':
      multiplier = 0.7;
      break;
    default:
      multiplier = 1.0;
  }
  
  return Math.round(averagePrice * multiplier);
};

/**
 * Analyze profit potential
 * @param userCost - Cost to purchase the item
 * @param suggestedPrice - Suggested listing price
 * @param marketData - Marketplace data for confidence calculation
 * @returns Profit analysis object
 */
export const analyzeProfitPotential = (
  userCost: number,
  suggestedPrice: number,
  marketData: MarketplaceData[]
): {
  lowProfit: number;
  highProfit: number;
  suggestedProfit: number;
  isSmartFlip: boolean;
  confidence: number;
} => {
  const lowProfit = suggestedPrice * 0.8 - userCost; // 20% below suggested
  const highProfit = suggestedPrice * 1.2 - userCost; // 20% above suggested
  const suggestedProfit = suggestedPrice - userCost;
  
  // Calculate confidence based on market data consistency
  const priceVariation = marketData.length > 1 ? 
    Math.abs(marketData[0].price - marketData[marketData.length - 1].price) / suggestedPrice : 0.3;
  const confidence = Math.max(0.5, 1 - priceVariation);
  
  // Determine if it's a smart flip (50%+ profit margin)
  const profitMargin = (suggestedProfit / userCost) * 100;
  const isSmartFlip = profitMargin >= 50 && confidence >= 0.7;
  
  return {
    lowProfit: Math.round(lowProfit),
    highProfit: Math.round(highProfit),
    suggestedProfit: Math.round(suggestedProfit),
    isSmartFlip,
    confidence: Math.round(confidence * 100) / 100
  };
};

/**
 * Generate comprehensive marketplace analysis
 * @param itemName - Name of the item
 * @param brand - Brand of the item
 * @param category - Category of the item
 * @param marketplaceData - Raw marketplace data
 * @param userCost - User's purchase cost
 * @returns Comprehensive analysis object
 */
export const generateComprehensiveAnalysis = (
  itemName: string,
  brand: string,
  category: string,
  marketplaceData: MarketplaceData[],
  userCost: number
): ComprehensiveAnalysis => {
  const priceRange = calculatePriceRange(marketplaceData);
  const recommendedPlatforms = getRecommendedPlatforms(marketplaceData);
  const suggestedListingPrice = calculateSuggestedListingPrice(priceRange.average, 'good');
  const profitAnalysis = analyzeProfitPotential(userCost, suggestedListingPrice, marketplaceData);
  
  return {
    itemName,
    brand,
    category,
    marketplaceData,
    averagePrice: priceRange.average,
    priceRange,
    suggestedListingPrice,
    recommendedPlatforms,
    profitAnalysis,
    userCost
  };
};
