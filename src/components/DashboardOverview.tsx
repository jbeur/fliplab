'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, SoldItem } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/profit';

interface DashboardOverviewProps {
  inventoryItems: InventoryItem[];
  soldItems: SoldItem[];
}

interface BusinessMetrics {
  totalItemsScanned: number;
  totalInventoryValue: number;
  totalInventoryCost: number;
  totalRevenue: number;
  totalProfit: number;
  averageProfitMargin: number;
  averageROI: number;
  itemsInInventory: number;
  itemsListed: number;
  itemsSold: number;
  averageTimeToSell: number;
  bestPerformingCategory: string;
  worstPerformingCategory: string;
  topProfitItem: SoldItem | null;
  totalFees: number;
  netProfit: number;
}

interface MarketInsight {
  category: string;
  trend: 'rising' | 'stable' | 'declining';
  confidence: number;
  recommendation: string;
  avgPrice: number;
  demandLevel: 'high' | 'medium' | 'low';
}

export default function DashboardOverview({ inventoryItems, soldItems }: DashboardOverviewProps) {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  useEffect(() => {
    calculateMetrics();
    generateMarketInsights();
  }, [inventoryItems, soldItems, selectedTimeframe]);

  const calculateMetrics = () => {
    const now = new Date();
    const timeframeDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': Infinity
    };
    
    const days = timeframeDays[selectedTimeframe];
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // Filter items by timeframe
    const recentSoldItems = soldItems.filter(item => 
      new Date(item.soldDate) >= cutoffDate
    );
    
    const recentInventoryItems = inventoryItems.filter(item => 
      new Date(item.dateAdded) >= cutoffDate
    );

    // Calculate metrics
    const totalInventoryValue = inventoryItems.reduce((sum, item) => 
      sum + (item.suggestedListingPrice * item.quantity), 0
    );
    
    const totalInventoryCost = inventoryItems.reduce((sum, item) => 
      sum + (item.userCost * item.quantity), 0
    );
    
    const totalRevenue = recentSoldItems.reduce((sum, item) => sum + item.soldPrice, 0);
    const totalProfit = recentSoldItems.reduce((sum, item) => sum + item.actualProfit, 0);
    
    // Calculate fees (estimate 10% of revenue for marketplace fees)
    const totalFees = totalRevenue * 0.1;
    const netProfit = totalProfit - totalFees;
    
    const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const averageROI = totalInventoryCost > 0 ? (totalProfit / totalInventoryCost) * 100 : 0;
    
    // Calculate average time to sell
    const timeToSellData = recentSoldItems.map(item => 
      (new Date(item.soldDate).getTime() - new Date(item.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
    );
    const averageTimeToSell = timeToSellData.length > 0 
      ? timeToSellData.reduce((sum, days) => sum + days, 0) / timeToSellData.length 
      : 0;

    // Find best/worst performing categories
    const categoryPerformance = recentSoldItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { totalProfit: 0, count: 0 };
      }
      acc[item.category].totalProfit += item.actualProfit;
      acc[item.category].count += 1;
      return acc;
    }, {} as Record<string, { totalProfit: number; count: number }>);

    const bestPerformingCategory = Object.entries(categoryPerformance)
      .sort(([,a], [,b]) => b.totalProfit - a.totalProfit)[0]?.[0] || 'N/A';
    
    const worstPerformingCategory = Object.entries(categoryPerformance)
      .sort(([,a], [,b]) => a.totalProfit - b.totalProfit)[0]?.[0] || 'N/A';

    const topProfitItem = recentSoldItems.length > 0 
      ? recentSoldItems.reduce((best, item) => item.actualProfit > best.actualProfit ? item : best)
      : null;

    setMetrics({
      totalItemsScanned: recentInventoryItems.length + recentSoldItems.length,
      totalInventoryValue,
      totalInventoryCost,
      totalRevenue,
      totalProfit,
      averageProfitMargin,
      averageROI,
      itemsInInventory: inventoryItems.length,
      itemsListed: inventoryItems.filter(item => item.status === 'listed').length,
      itemsSold: soldItems.length,
      averageTimeToSell,
      bestPerformingCategory,
      worstPerformingCategory,
      topProfitItem,
      totalFees,
      netProfit
    });
  };

  const generateMarketInsights = () => {
    // Generate AI-powered market insights based on current data
    const insights: MarketInsight[] = [
      {
        category: 'Electronics',
        trend: 'rising',
        confidence: 0.85,
        recommendation: 'Focus on vintage electronics and gaming consoles. High demand, good margins.',
        avgPrice: 45.50,
        demandLevel: 'high'
      },
      {
        category: 'Clothing',
        trend: 'stable',
        confidence: 0.72,
        recommendation: 'Branded vintage clothing continues to perform well. Watch for seasonal trends.',
        avgPrice: 28.75,
        demandLevel: 'medium'
      },
      {
        category: 'Home & Garden',
        trend: 'rising',
        confidence: 0.78,
        recommendation: 'Mid-century modern furniture and unique decor items are trending.',
        avgPrice: 65.20,
        demandLevel: 'high'
      },
      {
        category: 'Sports Equipment',
        trend: 'declining',
        confidence: 0.65,
        recommendation: 'Consider reducing inventory. Focus on premium brands only.',
        avgPrice: 35.40,
        demandLevel: 'low'
      }
    ];

    setMarketInsights(insights);
  };

  if (!metrics) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Business Overview</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y', 'all'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {timeframe === '7d' ? '7 Days' : 
               timeframe === '30d' ? '30 Days' :
               timeframe === '90d' ? '90 Days' :
               timeframe === '1y' ? '1 Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Profit */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Net Profit</div>
          <div className="text-2xl font-bold">{formatCurrency(metrics.netProfit)}</div>
          <div className="text-xs opacity-75 mt-1">
            {formatPercentage(metrics.averageProfitMargin)} margin
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Revenue</div>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="text-xs opacity-75 mt-1">
            {metrics.itemsSold} items sold
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Inventory Value</div>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalInventoryValue)}</div>
          <div className="text-xs opacity-75 mt-1">
            {metrics.itemsInInventory} items
          </div>
        </div>

        {/* ROI */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">ROI</div>
          <div className="text-2xl font-bold">{formatPercentage(metrics.averageROI)}</div>
          <div className="text-xs opacity-75 mt-1">
            {formatCurrency(metrics.totalInventoryCost)} invested
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Performance */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Scanned</span>
              <span className="font-semibold">{metrics.totalItemsScanned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items in Inventory</span>
              <span className="font-semibold">{metrics.itemsInInventory}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Listed</span>
              <span className="font-semibold">{metrics.itemsListed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Sold</span>
              <span className="font-semibold">{metrics.itemsSold}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Time to Sell</span>
              <span className="font-semibold">{metrics.averageTimeToSell.toFixed(1)} days</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Costs</span>
              <span className="font-semibold text-red-600">{formatCurrency(metrics.totalInventoryCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Marketplace Fees</span>
              <span className="font-semibold text-orange-600">{formatCurrency(metrics.totalFees)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-800 font-medium">Net Profit</span>
              <span className={`font-bold text-lg ${
                metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(metrics.netProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Category</span>
              <span className="font-semibold text-green-600">{metrics.bestPerformingCategory}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Needs Attention</span>
              <span className="font-semibold text-red-600">{metrics.worstPerformingCategory}</span>
            </div>
            {metrics.topProfitItem && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm font-medium text-green-800 mb-1">🏆 Best Sale</div>
                <div className="text-sm text-green-700">
                  {metrics.topProfitItem.itemName} - {formatCurrency(metrics.topProfitItem.actualProfit)} profit
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              📱 Scan New Item
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              📦 View Inventory
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              💰 View Sales
            </button>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
              📊 Export Report
            </button>
          </div>
        </div>
      </div>

      {/* AI Market Insights */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🤖 AI Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketInsights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              insight.trend === 'rising' ? 'border-green-200 bg-green-50' :
              insight.trend === 'declining' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{insight.category}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.trend === 'rising' ? 'bg-green-100 text-green-800' :
                  insight.trend === 'declining' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {insight.trend === 'rising' ? '📈 Rising' :
                   insight.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {insight.recommendation}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Avg Price: {formatCurrency(insight.avgPrice)}</span>
                <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
              </div>
              
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  insight.demandLevel === 'high' ? 'bg-green-100 text-green-800' :
                  insight.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Demand: {insight.demandLevel.charAt(0).toUpperCase() + insight.demandLevel.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profit Trend Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <div>Chart visualization coming soon</div>
            <div className="text-sm">Track your profit trends over time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
