'use client';

import { useState } from 'react';
import { InventoryItem, ListingInfo } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/profit';

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
  onMarkSold: (item: InventoryItem, soldPrice: number, platform: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function InventoryList({ items, onUpdateItem, onMarkSold, onDeleteItem }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Items in Inventory</h3>
        <p className="text-gray-600">Start scanning items to build your inventory!</p>
      </div>
    );
  }

  const handleMarkAsListed = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowListingModal(true);
  };

  const handleMarkAsSold = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowSoldModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Inventory Summary */}
      <div className="bg-white rounded-xl p-4 border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(items.reduce((sum, item) => sum + (item.suggestedListingPrice * item.quantity), 0))}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {items.filter(item => item.status === 'listed').length}
            </div>
            <div className="text-sm text-gray-600">Listed</div>
          </div>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'inventory' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'listed' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Brand: {item.brand} • Category: {item.category} • Condition: {item.condition}
                </div>
                
                <div className="text-sm text-gray-600">
                  Quantity: {item.quantity} • Added: {new Date(item.dateAdded).toLocaleDateString()}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(item.suggestedListingPrice)}
                </div>
                <div className="text-sm text-gray-500">Suggested Price</div>
              </div>
            </div>

            {/* Profit Analysis */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Profit Potential</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Low</div>
                  <div className="text-sm font-semibold text-red-600">
                    {formatCurrency(item.estimatedProfit.low)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Expected</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {formatCurrency(item.estimatedProfit.suggested)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">High</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(item.estimatedProfit.high)}
                  </div>
                </div>
              </div>
            </div>

            {/* Best Platforms */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Best Platforms</div>
              <div className="flex flex-wrap gap-2">
                {item.bestPlatforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Listings */}
            {item.listings && item.listings.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Active Listings</div>
                <div className="space-y-2">
                  {item.listings.map((listing) => (
                    <div key={listing.id} className="bg-blue-50 rounded-lg p-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{listing.platform}</span>
                        <span className="text-blue-600 font-semibold">
                          {formatCurrency(listing.price)}
                        </span>
                      </div>
                      {listing.listingUrl && (
                        <a
                          href={listing.listingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View Listing →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                <div className="text-sm text-gray-600">{item.notes}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {item.status === 'inventory' && (
                <button
                  onClick={() => handleMarkAsListed(item)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  📝 Mark as Listed
                </button>
              )}
              
              <button
                onClick={() => handleMarkAsSold(item)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                💰 Mark as Sold
              </button>
              
              <button
                onClick={() => onDeleteItem(item.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Modal */}
      {showListingModal && selectedItem && (
        <ListingModal
          item={selectedItem}
          isOpen={showListingModal}
          onClose={() => setShowListingModal(false)}
          onSubmit={(listing) => {
            onUpdateItem({
              ...selectedItem,
              status: 'listed',
              listings: [...(selectedItem.listings || []), listing]
            });
            setShowListingModal(false);
          }}
        />
      )}

      {/* Sold Modal */}
      {showSoldModal && selectedItem && (
        <SoldModal
          item={selectedItem}
          isOpen={showSoldModal}
          onClose={() => setShowSoldModal(false)}
          onSubmit={(soldPrice, platform, buyerNotes) => {
            onMarkSold(selectedItem, soldPrice, platform);
            setShowSoldModal(false);
          }}
        />
      )}
    </div>
  );
}

// Listing Modal Component
interface ListingModalProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: ListingInfo) => void;
}

function ListingModal({ item, isOpen, onClose, onSubmit }: ListingModalProps) {
  const [platform, setPlatform] = useState('');
  const [price, setPrice] = useState(item.suggestedListingPrice.toString());
  const [listingUrl, setListingUrl] = useState('');
  const [listingTitle, setListingTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const listing: ListingInfo = {
      id: Date.now().toString(),
      platform,
      listingUrl: listingUrl.trim() || undefined,
      listingTitle: listingTitle.trim() || undefined,
      price: parseFloat(price),
      dateListed: new Date().toISOString(),
      status: 'active'
    };

    onSubmit(listing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mark as Listed</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g., eBay, Facebook Marketplace"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing URL (Optional)</label>
            <input
              type="url"
              value={listingUrl}
              onChange={(e) => setListingUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Title (Optional)</label>
            <input
              type="text"
              value={listingTitle}
              onChange={(e) => setListingTitle(e.target.value)}
              placeholder="Your listing title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Mark as Listed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sold Modal Component
interface SoldModalProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (soldPrice: number, platform: string, buyerNotes?: string) => void;
}

function SoldModal({ item, isOpen, onClose, onSubmit }: SoldModalProps) {
  const [soldPrice, setSoldPrice] = useState(item.suggestedListingPrice.toString());
  const [platform, setPlatform] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit(parseFloat(soldPrice), platform, buyerNotes.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mark as Sold</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sold Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g., eBay, Facebook Marketplace"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Notes (Optional)</label>
            <textarea
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="Any notes about the buyer or sale..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
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
              Mark as Sold
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
