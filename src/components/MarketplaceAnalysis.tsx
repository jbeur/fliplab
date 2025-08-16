'use client';

import { ComprehensiveAnalysis } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/profit';

interface MarketplaceAnalysisProps {
  analysis: ComprehensiveAnalysis;
  onNewScan: () => void;
  onAddToInventory: (item: ComprehensiveAnalysis) => void;
}

export default function MarketplaceAnalysis({ analysis, onNewScan, onAddToInventory }: MarketplaceAnalysisProps) {
  const handleAddToInventory = () => {
    onAddToInventory(analysis);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Analysis Complete!</h2>
        <p className="text-gray-600">Here&apos;s what we found for your {analysis.itemName}</p>
      </div>

      {/* Item Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">{analysis.itemName}</div>
          <div className="text-lg text-gray-600 mb-4">
            Brand: {analysis.brand} • Category: {analysis.category}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Your Cost</div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(analysis.userCost)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Market Average</div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(analysis.averagePrice)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Suggested Price</div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(analysis.suggestedListingPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Potential</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Low Profit</div>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(analysis.profitAnalysis.lowProfit)}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Expected Profit</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(analysis.profitAnalysis.suggestedProfit)}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">High Profit</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(analysis.profitAnalysis.highProfit)}
            </div>
          </div>
        </div>

        {/* Smart Flip Recommendation */}
        <div className={`p-4 rounded-lg border-l-4 ${
          analysis.profitAnalysis.isSmartFlip
            ? 'bg-green-50 border-green-500 text-green-800'
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="font-semibold mb-1">
            {analysis.profitAnalysis.isSmartFlip ? '🎯 SMART FLIP!' : '⚠️ PASS ON THIS'}
          </div>
          <div className="text-sm">
            {analysis.profitAnalysis.isSmartFlip
              ? `This item has excellent profit potential with a ${formatPercentage((analysis.profitAnalysis.suggestedProfit / analysis.userCost) * 100)} ROI`
              : `Profit margin is too low. Look for items with better profit potential.`
            }
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Price Range</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Low End</div>
            <div className="text-lg font-bold text-gray-700">
              {formatCurrency(analysis.priceRange.low)}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Average</div>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(analysis.priceRange.average)}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">High End</div>
            <div className="text-lg font-bold text-gray-700">
              {formatCurrency(analysis.priceRange.high)}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Platforms */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Platforms to List</h3>
        <div className="flex flex-wrap gap-3">
          {analysis.recommendedPlatforms.map((platform, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Sales Data */}
      {analysis.marketplaceData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales Data</h3>
          <div className="space-y-3">
            {analysis.marketplaceData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{item.itemName}</div>
                  <div className="text-sm text-gray-600">
                    {item.platform} • {item.condition}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(item.price)}
                  </div>
                  {item.soldDate && (
                    <div className="text-xs text-gray-500">
                      {new Date(item.soldDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToInventory}
          className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
        >
          📦 Add to Inventory
        </button>
        <button
          onClick={onNewScan}
          className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          📱 Scan Another Item
        </button>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="text-sm text-yellow-800">
          <strong>💡 Pro Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• List at 90% of market average for faster sales</li>
            <li>• Include detailed photos and accurate descriptions</li>
            <li>• Monitor competitor prices and adjust accordingly</li>
            <li>• Consider seasonal trends and demand patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
