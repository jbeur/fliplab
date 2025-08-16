'use client';

import React, { useState, useEffect } from 'react';
import { useScraper } from '../hooks/useScraper';
import { SearchParams, MarketplaceItem } from '../types';

/**
 * Demo component showcasing the scraper integration
 * Provides search forms and displays results from Facebook Marketplace and Poshmark
 */
export const ScraperDemo: React.FC = () => {
  const [searchForm, setSearchForm] = useState<SearchParams>({
    query: '',
    category: '',
    priceMin: undefined,
    priceMax: undefined,
    condition: '',
    sortBy: 'relevance',
    limit: 20
  });

  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'facebook' | 'poshmark'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    items,
    loading,
    error,
    totalResults,
    searchFacebook,
    searchPoshmark,
    searchAll,
    checkHealth,
    getPlatformStatus,
    clearResults,
    clearError,
    retryLastSearch,
    getItemsByPlatform,
    getPriceStats
  } = useScraper();

  // Check service health on component mount
  useEffect(() => {
    checkHealth();
    getPlatformStatus();
  }, [checkHealth, getPlatformStatus]);

  /**
   * Handle search form submission
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchForm.query.trim()) {
      alert('Please enter a search query');
      return;
    }

    try {
      switch (selectedPlatform) {
        case 'facebook':
          await searchFacebook(searchForm);
          break;
        case 'poshmark':
          await searchPoshmark(searchForm);
          break;
        case 'all':
        default:
          await searchAll(searchForm);
          break;
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: keyof SearchParams, value: any) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Format price for display
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  /**
   * Get platform display name
   */
  const getPlatformName = (platform: string): string => {
    return platform === 'facebook-marketplace' ? 'Facebook Marketplace' : 'Poshmark';
  };

  /**
   * Get platform icon
   */
  const getPlatformIcon = (platform: string): string => {
    return platform === 'facebook-marketplace' ? '📘' : '🛍️';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🔍 FlipLab Scraper Demo
        </h1>
        <p className="text-lg text-gray-600">
          Search Facebook Marketplace and Poshmark for thrift items
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Search Items</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query *
              </label>
              <input
                type="text"
                value={searchForm.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="e.g., nike sneakers, vintage jacket"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook Marketplace</option>
                <option value="poshmark">Poshmark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Limit
              </label>
              <input
                type="number"
                value={searchForm.limit}
                onChange={(e) => handleInputChange('limit', parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {/* Advanced Search Options */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={searchForm.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., shoes, clothing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={searchForm.priceMin || ''}
                  onChange={(e) => handleInputChange('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={searchForm.priceMax || ''}
                  onChange={(e) => handleInputChange('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="1000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={searchForm.sortBy}
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="date">Date</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>

            <button
              type="button"
              onClick={clearResults}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              🗑️ Clear Results
            </button>

            {error && (
              <button
                type="button"
                onClick={retryLastSearch}
                className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                🔄 Retry
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">❌</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {totalResults > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800">
                ✅ Search Complete
              </h3>
              <p className="text-green-700">
                Found {totalResults} items across {selectedPlatform === 'all' ? 'all platforms' : selectedPlatform}
              </p>
            </div>
            
            {/* Price Statistics */}
            <div className="text-right">
              <div className="text-sm text-green-600">
                <div>Price Range: {formatPrice(getPriceStats().min)} - {formatPrice(getPriceStats().max)}</div>
                <div>Average: {formatPrice(getPriceStats().average)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          
          {/* Platform Filter Tabs */}
          {selectedPlatform === 'all' && (
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPlatform('all')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setSelectedPlatform('facebook')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Facebook ({getItemsByPlatform('facebook-marketplace').length})
              </button>
              <button
                onClick={() => setSelectedPlatform('poshmark')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Poshmark ({getItemsByPlatform('poshmark').length})
              </button>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Item Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTcyOSA4Ny41NzI5IDgyIDk4IDgyQzEwOC40MjcgODIgMTE2IDg5LjU3MjkxIDExNiAxMDBDMTE2IDExMC40MjcgMTA4LjQyNyAxMTggOTggMTE4Qzg3LjU3MjkxIDExOCA4MCAxMTAuNDI3IDgwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAxMzBDODguOTU0MyAxMzAgODAgMTIxLjA0NiA4MCAxMTBIMTIwQzEyMCAxMjEuMDQ2IDExMS4wNDYgMTMwIDEwMCAxMzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">🖼️</div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {getPlatformIcon(item.platform)} {getPlatformName(item.platform)}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {item.location && (
                      <span>📍 {item.location}</span>
                    )}
                    {item.condition && (
                      <span>✨ {item.condition}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex space-x-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Item
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.url)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                      title="Copy URL"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching marketplaces...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && totalResults === 0 && items.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600">Enter a search query above to find items on Facebook Marketplace and Poshmark.</p>
        </div>
      )}
    </div>
  );
};
