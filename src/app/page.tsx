'use client';

import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { useInventory } from '@/hooks/useInventory';
import { isValidImageFile } from '@/utils/image';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import DashboardOverview from '@/components/DashboardOverview';
import ItemConfirmation from '@/components/ItemConfirmation';
import BrandInput from '@/components/BrandInput';
import MarketplaceAnalysis from '@/components/MarketplaceAnalysis';
import AddToInventoryModal from '@/components/AddToInventoryModal';
import InventoryList from '@/components/InventoryList';
import SoldItemsList from '@/components/SoldItemsList';
import { ItemConfirmation as ItemConfirmationType, BrandInfo, ComprehensiveAnalysis } from '@/types';

export default function ThriftScanner() {
  // Navigation state
  const [currentView, setCurrentView] = useState<'dashboard' | 'scanner' | 'inventory' | 'sales'>('dashboard');
  
  // Scanner state
  const { isLoading, result, error, analyzeImage, reset } = useImageAnalysis();
  const [showCamera, setShowCamera] = useState(false);
  const [userCost, setUserCost] = useState('');
  const [showCostInput, setShowCostInput] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'confirm' | 'brand' | 'results'>('upload');
  const [confirmedItem, setConfirmedItem] = useState<ItemConfirmationType | null>(null);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  
  // Inventory state
  const {
    inventoryItems,
    soldItems,
    addToInventory,
    updateItem,
    markAsSold,
    deleteItem
  } = useInventory();
  
  // Modal state
  const [showAddToInventory, setShowAddToInventory] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // Scanner handlers
  const handleFileUpload = async (file: File) => {
    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, GIF) under 10MB.');
      return;
    }

    try {
      await analyzeImage(file);
      setCurrentStep('confirm');
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  const handleCameraCapture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        // Convert base64 to file and process
        const byteString = atob(screenshot.split(',')[1]);
        const mimeString = screenshot.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const file = new File([ab], 'camera-capture.jpg', { type: mimeString });
        handleFileUpload(file);
      }
    }
    setShowCamera(false);
  };

  const handleItemConfirmation = (confirmed: boolean, correctedName?: string) => {
    if (confirmed && result) {
      setConfirmedItem({
        ...result,
        userConfirmed: true,
        userCorrectedName: correctedName,
        suggestedImage: result.suggestedImage || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
      });
      setCurrentStep('brand');
    } else {
      // Reset to upload
      reset();
      setCurrentStep('upload');
    }
  };

  const handleBrandSubmit = (brand: BrandInfo) => {
    setBrandInfo(brand);
    setShowCostInput(true);
  };

  const handleCostSubmit = (cost: number) => {
    if (confirmedItem && brandInfo) {
      // Create comprehensive analysis
      const analysis: ComprehensiveAnalysis = {
        itemName: confirmedItem.userCorrectedName || confirmedItem.itemName,
        brand: brandInfo.brand,
        category: confirmedItem.category,
        marketplaceData: result?.marketplaceData || [],
        averagePrice: result?.avgPrice || 0,
        priceRange: {
          low: Math.round((result?.avgPrice || 0) * 0.7),
          high: Math.round((result?.avgPrice || 0) * 1.3),
          average: result?.avgPrice || 0
        },
        suggestedListingPrice: Math.round((result?.avgPrice || 0) * 0.9),
        recommendedPlatforms: ['eBay', 'Facebook Marketplace', 'Mercari'],
        profitAnalysis: {
          lowProfit: Math.round((result?.avgPrice || 0) * 0.9 - cost),
          highProfit: Math.round((result?.avgPrice || 0) * 1.3 - cost),
          suggestedProfit: Math.round((result?.avgPrice || 0) * 0.9 - cost),
          isSmartFlip: (result?.avgPrice || 0) * 0.9 - cost > cost * 0.3,
          confidence: 0.85
        },
        userCost: cost
      };
      
      setComprehensiveAnalysis(analysis);
      setCurrentStep('results');
    }
  };

  const handleAddToInventory = (item: Omit<import('@/types').InventoryItem, 'id' | 'dateAdded' | 'status'>) => {
    addToInventory(item);
    setShowAddToInventory(false);
    // Optionally switch to inventory view
    setCurrentView('inventory');
  };

  const handleNewScan = () => {
    reset();
    setCurrentStep('upload');
    setConfirmedItem(null);
    setBrandInfo(null);
    setComprehensiveAnalysis(null);
    setUserCost('');
    setShowCostInput(false);
  };

  const handleViewChange = (view: 'dashboard' | 'scanner' | 'inventory' | 'sales') => {
    setCurrentView(view);
    // Reset scanner state when switching views
    if (view !== 'scanner') {
      reset();
      setCurrentStep('upload');
    }
  };

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <DashboardOverview 
              inventoryItems={inventoryItems}
              soldItems={soldItems}
            />
          </div>
        );
        
      case 'inventory':
        return (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>
              <p className="text-gray-600">Manage your items for sale and track their status</p>
            </div>
            <InventoryList
              items={inventoryItems}
              onUpdateItem={updateItem}
              onMarkSold={(item, soldPrice, platform) => markAsSold(item.id, soldPrice, platform)}
              onDeleteItem={deleteItem}
            />
          </div>
        );
        
      case 'sales':
        return (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales History</h1>
              <p className="text-gray-600">Track your completed sales and profit performance</p>
            </div>
            <SoldItemsList
              items={soldItems}
              onViewDetails={() => {}}
            />
          </div>
        );
        
      case 'scanner':
      default:
        return (
          <div className="max-w-md mx-auto px-4 py-6">
            {/* Scanner Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">FlipLab Scanner</h1>
              <p className="text-gray-600">AI-powered thrift item analysis</p>
            </div>

            {/* Scanner Content */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Upload Section */}
              {currentStep === 'upload' && !isLoading && !error && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">📱</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Scan an Item</h2>
                    <p className="text-gray-600">Take a photo or upload an image to analyze</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      📷 Take Photo
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
                    >
                      📁 Upload Image
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    aria-label="Upload image file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>
              )}

              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-4 max-w-md w-full">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Take a Photo</h3>
                      <p className="text-sm text-gray-600">Position the item in the frame</p>
                    </div>
                    
                    <div className="mb-4">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCamera(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCameraCapture}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        📸 Capture
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your image...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Failed</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={handleNewScan}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Item Confirmation */}
              {currentStep === 'confirm' && confirmedItem && (
                <ItemConfirmation item={confirmedItem} onConfirm={handleItemConfirmation} />
              )}

              {/* Brand Input */}
              {currentStep === 'brand' && confirmedItem && (
                <BrandInput itemName={confirmedItem.itemName} onBrandSubmit={handleBrandSubmit} />
              )}

              {/* Cost Input */}
              {showCostInput && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">What did you pay?</h3>
                    <p className="text-gray-600">Enter your cost to calculate profit potential</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="text-2xl font-bold text-gray-600">$</span>
                    <input
                      type="number"
                      value={userCost}
                      onChange={(e) => setUserCost(e.target.value)}
                      placeholder="15"
                      aria-label="Enter item cost"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleCostSubmit(parseFloat(userCost) || 0)}
                    className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                  >
                    Analyze Profit Potential
                  </button>
                </div>
              )}

              {/* Results */}
              {currentStep === 'results' && comprehensiveAnalysis && (
                <MarketplaceAnalysis 
                  analysis={comprehensiveAnalysis} 
                  onNewScan={handleNewScan}
                  onAddToInventory={() => setShowAddToInventory(true)}
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={handleViewChange} />
        {renderView()}
        
        {/* Add to Inventory Modal */}
        {showAddToInventory && comprehensiveAnalysis && (
          <AddToInventoryModal
            analysis={comprehensiveAnalysis}
            isOpen={showAddToInventory}
            onClose={() => setShowAddToInventory(false)}
            onAdd={handleAddToInventory}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
