'use client';

import { ComprehensiveAnalysis } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/profit';

interface MarketplaceAnalysisProps {
  analysis: ComprehensiveAnalysis;
  onNewScan: () => void;
}

export default function MarketplaceAnalysis({ analysis, onNewScan }: MarketplaceAnalysisProps) {
  const { 
    itemName, 
    brand, 
    category, 
    marketplaceData, 
    priceRange, 
    suggestedListingPrice, 
    recommendedPlatforms, 
    profitAnalysis, 
    userCost 
  } = analysis;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Analysis Complete!</h2>
        <p className="text-gray-600">Here&apos;s what we found for your {itemName}</p>
      </div>

      {/* Item Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-1">{itemName}</div>
          <div className="text-sm text-gray-600">
            Brand: {brand} • Category: {category}
          </div>
        </div>
      </div>

      {/* Price Analysis */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-600 mb-1">Low Price</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(priceRange.low)}
          </div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-600 mb-1">Average</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(priceRange.average)}
          </div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-600 mb-1">High Price</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(priceRange.high)}
          </div>
        </div>
      </div>

      {/* Recommended Listing Price */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Recommended Listing Price</div>
          <div className="text-3xl font-bold text-blue-600">
            {formatCurrency(suggestedListingPrice)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Based on {marketplaceData.length} similar items
          </div>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="bg-white rounded-xl p-4 mb-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Profit Potential</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Low Profit</div>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(profitAnalysis.lowProfit)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Suggested</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(profitAnalysis.suggestedProfit)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">High Profit</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(profitAnalysis.highProfit)}
            </div>
          </div>
        </div>
        
        {/* Your Cost vs Profit */}
        <div className="text-center p-3 bg-gray-50 rounded-lg mb-3">
          <div className="text-sm text-gray-600">
            Your Cost: <span className="font-semibold">{formatCurrency(userCost)}</span> • 
            Profit Margin: <span className="font-semibold">{formatPercentage((profitAnalysis.suggestedProfit / userCost) * 100)}</span>
          </div>
        </div>

        {/* Smart Flip Recommendation */}
        <div className={`p-3 rounded-lg text-center font-semibold ${
          profitAnalysis.isSmartFlip 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        }`}>
          {profitAnalysis.isSmartFlip 
            ? `🎯 SMART FLIP! High profit potential with ${formatPercentage(profitAnalysis.confidence * 100)} confidence`
            : `⚠️ MODERATE FLIP - Consider negotiating a lower purchase price`
          }
        </div>
      </div>

      {/* Recommended Platforms */}
      <div className="bg-white rounded-xl p-4 mb-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Best Platforms to List</h3>
        <div className="flex flex-wrap gap-2">
          {recommendedPlatforms.map((platform, index) => (
            <span
              key={platform}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {platform}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Based on where similar items sell best
        </div>
      </div>

      {/* Sample Marketplace Data */}
      {marketplaceData.length > 0 && (
        <div className="bg-white rounded-xl p-4 mb-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Sales Data</h3>
          <div className="space-y-2">
            {marketplaceData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{item.platform}</div>
                  <div className="text-xs text-gray-500">{item.condition} condition</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.price)}</div>
                  <div className="text-xs text-gray-500">
                    {item.soldDate ? new Date(item.soldDate).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onNewScan}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-transform duration-200"
      >
        📷 Scan Another Item
      </button>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
        <div className="text-sm text-yellow-800">
          <strong>💡 Pro Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• List during peak shopping times (weekends, holidays)</li>
            <li>• Use high-quality photos and detailed descriptions</li>
            <li>• Consider bundling with related items</li>
            <li>• Monitor competitor prices and adjust accordingly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
