'use client';

import { useState } from 'react';
import { ComprehensiveAnalysis, InventoryItem } from '@/types';
import { formatCurrency } from '@/utils/profit';

interface AddToInventoryModalProps {
  analysis: ComprehensiveAnalysis;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'status'>) => void;
}

export default function AddToInventoryModal({ analysis, isOpen, onClose, onAdd }: AddToInventoryModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inventoryItem = {
      itemName: analysis.itemName,
      brand: analysis.brand,
      category: analysis.category,
      condition: 'good', // Default condition
      userCost: analysis.userCost,
      suggestedListingPrice: analysis.suggestedListingPrice,
      estimatedProfit: {
        low: analysis.profitAnalysis.lowProfit,
        high: analysis.profitAnalysis.highProfit,
        suggested: analysis.profitAnalysis.suggestedProfit,
      },
      bestPlatforms: analysis.recommendedPlatforms,
      quantity,
      imageUrl: analysis.marketplaceData[0]?.url || '', // Use first marketplace image or empty
      notes: notes.trim() || undefined,
    };

    onAdd(inventoryItem);
    onClose();
    
    // Reset form
    setQuantity(1);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add to Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                {analysis.itemName}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Brand: {analysis.brand} • Category: {analysis.category}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Your Cost</div>
                  <div className="font-semibold text-red-600">
                    {formatCurrency(analysis.userCost)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Suggested Price</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(analysis.suggestedListingPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Profit Potential</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-600 mb-1">Low</div>
                <div className="text-sm font-semibold text-red-600">
                  {formatCurrency(analysis.profitAnalysis.lowProfit)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Expected</div>
                <div className="text-sm font-semibold text-blue-600">
                  {formatCurrency(analysis.profitAnalysis.suggestedProfit)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">High</div>
                <div className="text-sm font-semibold text-green-600">
                  {formatCurrency(analysis.profitAnalysis.highProfit)}
                </div>
              </div>
            </div>
          </div>

          {/* Best Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best Platforms to List
            </label>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedPlatforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes about this item..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
