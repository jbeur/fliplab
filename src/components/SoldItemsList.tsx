'use client';

import { useState } from 'react';
import { SoldItem } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/profit';

interface SoldItemsListProps {
  items: SoldItem[];
  onViewDetails: (item: SoldItem) => void;
}

export default function SoldItemsList({ items, onViewDetails }: SoldItemsListProps) {
  const [selectedItem, setSelectedItem] = useState<SoldItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sales Yet</h3>
        <p className="text-gray-600">Start selling items from your inventory to see your profits!</p>
      </div>
    );
  }

  const handleViewDetails = (item: SoldItem) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // Calculate summary statistics
  const totalRevenue = items.reduce((sum, item) => sum + item.soldPrice, 0);
  const totalProfit = items.reduce((sum, item) => sum + item.actualProfit, 0);
  const totalCost = items.reduce((sum, item) => sum + item.userCost, 0);
  const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const bestSale = items.reduce((best, item) => item.actualProfit > best.actualProfit ? item : best, items[0]);
  const worstSale = items.reduce((worst, item) => item.actualProfit < worst.actualProfit ? item : worst, items[0]);

  return (
    <div className="space-y-4">
      {/* Sales Summary */}
      <div className="bg-white rounded-xl p-4 border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{items.length}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalProfit)}
            </div>
            <div className="text-sm text-gray-600">Total Profit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {formatPercentage(averageProfitMargin)}
            </div>
            <div className="text-sm text-gray-600">Avg Margin</div>
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">🏆 Best Sale</h3>
          <div className="text-lg font-bold text-green-600">
            {bestSale?.itemName}
          </div>
          <div className="text-sm text-green-700">
            Profit: {formatCurrency(bestSale?.actualProfit || 0)} • 
            Sold for: {formatCurrency(bestSale?.soldPrice || 0)}
          </div>
        </div>
        
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">📉 Lowest Profit</h3>
          <div className="text-lg font-bold text-red-600">
            {worstSale?.itemName}
          </div>
          <div className="text-sm text-red-700">
            Profit: {formatCurrency(worstSale?.actualProfit || 0)} • 
            Sold for: {formatCurrency(worstSale?.soldPrice || 0)}
          </div>
        </div>
      </div>

      {/* Sold Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Sold
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Brand: {item.brand} • Category: {item.category} • Condition: {item.condition}
                </div>
                
                <div className="text-sm text-gray-600">
                  Sold: {new Date(item.soldDate).toLocaleDateString()} • Platform: {item.platform}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(item.soldPrice)}
                </div>
                <div className="text-sm text-gray-500">Sold Price</div>
              </div>
            </div>

            {/* Profit Analysis */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Your Cost</div>
                  <div className="text-sm font-semibold text-red-600">
                    {formatCurrency(item.userCost)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Sold For</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(item.soldPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Profit</div>
                  <div className={`text-sm font-semibold ${
                    item.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(item.actualProfit)}
                  </div>
                </div>
              </div>
              
              {/* Profit Margin */}
              <div className="text-center mt-3">
                <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
                <div className={`text-lg font-bold ${
                  item.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage((item.actualProfit / item.soldPrice) * 100)}
                </div>
              </div>
            </div>

            {/* Estimated vs Actual */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Estimated vs Actual</div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Expected Profit</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {formatCurrency(item.estimatedProfit.suggested)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Actual Profit</div>
                  <div className={`text-sm font-semibold ${
                    item.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(item.actualProfit)}
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Notes */}
            {item.buyerNotes && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Buyer Notes</div>
                <div className="text-sm text-gray-600">{item.buyerNotes}</div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleViewDetails(item)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                📊 View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <SoldItemDetailsModal
          item={selectedItem}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

// Sold Item Details Modal
interface SoldItemDetailsModalProps {
  item: SoldItem;
  isOpen: boolean;
  onClose: () => void;
}

function SoldItemDetailsModal({ item, isOpen, onClose }: SoldItemDetailsModalProps) {
  if (!isOpen) return null;

  const profitMargin = (item.actualProfit / item.soldPrice) * 100;
  const roi = (item.actualProfit / item.userCost) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sale Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Item Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Item Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <div className="font-medium">{item.itemName}</div>
              </div>
              <div>
                <span className="text-gray-600">Brand:</span>
                <div className="font-medium">{item.brand}</div>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <div className="font-medium">{item.category}</div>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <div className="font-medium">{item.condition}</div>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <div className="font-medium">{item.quantity}</div>
              </div>
              <div>
                <span className="text-gray-600">Date Added:</span>
                <div className="font-medium">{new Date(item.dateAdded).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(item.userCost)}
                </div>
                <div className="text-sm text-gray-600">Your Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(item.soldPrice)}
                </div>
                <div className="text-sm text-gray-600">Sold For</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(item.actualProfit)}
              </div>
              <div className="text-sm text-gray-600">Total Profit</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">
                  {formatPercentage(profitMargin)}
                </div>
                <div className="text-sm text-gray-600">Profit Margin</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">
                  {formatPercentage(roi)}
                </div>
                <div className="text-sm text-gray-600">ROI</div>
              </div>
            </div>
          </div>

          {/* Sale Details */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Sale Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Platform:</span>
                <div className="font-medium">{item.platform}</div>
              </div>
              <div>
                <span className="text-gray-600">Sold Date:</span>
                <div className="font-medium">{new Date(item.soldDate).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Time to Sell:</span>
                <div className="font-medium">
                  {Math.ceil((new Date(item.soldDate).getTime() - new Date(item.dateAdded).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Item Notes</h3>
              <div className="text-sm text-gray-600">{item.notes}</div>
            </div>
          )}

          {item.buyerNotes && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Buyer Notes</h3>
              <div className="text-sm text-gray-600">{item.buyerNotes}</div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
