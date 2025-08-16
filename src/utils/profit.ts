/**
 * Calculates profit and margin for an item
 * @param cost - Cost to purchase the item
 * @param avgPrice - Average selling price
 * @returns ProfitCalculation object
 */
export const calculateProfit = (cost: number, avgPrice: number) => {
  const profit = avgPrice - cost;
  const margin = cost > 0 ? ((profit / cost) * 100) : 0;
  const isGoodDeal = profit > cost * 0.5; // 50% profit margin threshold
  
  return {
    cost,
    avgPrice,
    profit,
    margin,
    isGoodDeal
  };
};

/**
 * Determines if an item is worth buying based on profit margin
 * @param cost - Cost to purchase the item
 * @param avgPrice - Average selling price
 * @param minMargin - Minimum profit margin percentage (default: 50)
 * @returns boolean - True if worth buying
 */
export const isWorthBuying = (cost: number, avgPrice: number, minMargin: number = 50): boolean => {
  if (cost <= 0 || avgPrice <= 0) return false;
  
  const margin = ((avgPrice - cost) / cost) * 100;
  return margin >= minMargin;
};

/**
 * Calculates recommended maximum purchase price
 * @param avgPrice - Average selling price
 * @param targetMargin - Target profit margin percentage (default: 50)
 * @returns number - Recommended maximum purchase price
 */
export const getRecommendedMaxPrice = (avgPrice: number, targetMargin: number = 50): number => {
  return avgPrice / (1 + targetMargin / 100);
};

/**
 * Formats currency values consistently
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns string - Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats percentage values consistently
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default: 0)
 * @returns string - Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};
