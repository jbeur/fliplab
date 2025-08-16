'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { calculateProfit, formatCurrency, formatPercentage } from '@/utils/profit';
import { isValidImageFile } from '@/utils/image';

import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ThriftScanner() {
  const { isLoading, result, imageData, error, analyzeImage, reset } = useImageAnalysis();
  const [showCamera, setShowCamera] = useState(false);
  const [userCost, setUserCost] = useState('');
  const [showCostInput, setShowCostInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleFileUpload = async (file: File) => {
    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    await analyzeImage(file);
    setShowCostInput(true);
  };

  const handleCameraCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob and then to file
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            handleFileUpload(file);
          });
      }
    }
    setShowCamera(false);
  };

  const handleCostSubmit = () => {
    if (!userCost || parseFloat(userCost) <= 0) {
      alert('Please enter a valid cost amount');
      return;
    }
    setShowCostInput(false);
  };

  const handleNewScan = () => {
    reset();
    setUserCost('');
    setShowCostInput(false);
    setShowCamera(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate profit when we have both result and user cost
  const profitData = result && userCost ? 
    calculateProfit(parseFloat(userCost), result.avgPrice) : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">ThriftScope</h1>
            <p className="text-lg opacity-90">Discover hidden gems and flip for profit</p>
          </div>

          {/* Upload Section */}
          {!result && !isLoading && (
            <div className="p-8 text-center">
              <div 
                className="border-3 border-dashed border-gray-300 rounded-2xl p-12 mb-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-6xl mb-4">📷</div>
                <div className="text-xl text-gray-700 mb-2">Take or Upload Photo</div>
                <div className="text-gray-500">Point at any item to check its resale value</div>
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
              
              <button
                onClick={() => setShowCamera(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-transform duration-200"
              >
                📱 Use Camera
              </button>
            </div>
          )}

          {/* Camera Modal */}
          {showCamera && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold">Take Photo</h3>
                  <p className="text-gray-600">Position your item in the frame</p>
                </div>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCamera(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCameraCapture}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Capture
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Analyzing your item...</h3>
              <p className="text-gray-600">Searching marketplaces for pricing data</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="text-red-800 font-semibold mb-2">Analysis Failed</div>
                <div className="text-red-600 text-sm">{error}</div>
              </div>
              <button
                onClick={handleNewScan}
                className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {result && imageData && (
            <div className="p-6">
              <div className="mb-6">
                <Image
                  src={imageData}
                  alt="Scanned item"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              {/* Cost Input */}
              {showCostInput && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      What&apos;s the asking price for this item?
                    </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={userCost}
                      onChange={(e) => setUserCost(e.target.value)}
                      placeholder="15"
                      aria-label="Enter item cost"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleCostSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {!showCostInput && userCost && profitData && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="text-2xl font-bold text-gray-800 mb-4">{result.itemName}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-white rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Average Sale Price</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(result.avgPrice)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Potential Profit</div>
                      <div className={`text-3xl font-bold ${profitData.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(profitData.profit)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-700 mb-4">
                    <strong>
                      Your Cost: {formatCurrency(profitData.cost)} • 
                      Profit Margin: {formatPercentage(profitData.margin)}
                    </strong>
                  </div>
                  
                  <div className={`p-4 rounded-xl font-semibold ${
                    profitData.isGoodDeal 
                      ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                      : 'bg-red-100 text-red-800 border-l-4 border-red-500'
                  }`}>
                    {profitData.isGoodDeal 
                      ? `🎯 BUY IT! Great profit potential of ${formatCurrency(profitData.profit)} (${formatPercentage(profitData.margin)} margin)`
                      : `⚠️ SKIP - Low profit margin. Look for items under ${formatCurrency(result.avgPrice * 0.6)}`
                    }
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-gray-600">
                    <strong>💡 Tip:</strong> This data is based on recent eBay sales. Check condition and authenticity before buying!
                  </div>
                </div>
              )}
              
              <button
                onClick={handleNewScan}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-transform duration-200"
              >
                📷 Scan Another Item
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
