'use client';

import { useState } from 'react';
import { BrandInfo } from '@/types';

interface BrandInputProps {
  onBrandSubmit: (brandInfo: BrandInfo) => void;
  itemName: string;
}

export default function BrandInput({ onBrandSubmit, itemName }: BrandInputProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('good');
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand.trim()) {
      alert('Please enter a brand name');
      return;
    }

    const brandInfo: BrandInfo = {
      brand: brand.trim(),
      model: model.trim() || undefined,
      condition,
      userProvided: true
    };

    onBrandSubmit(brandInfo);
  };

  const handleSkip = () => {
    const brandInfo: BrandInfo = {
      brand: 'Unknown',
      condition: 'unknown',
      userProvided: false
    };
    onBrandSubmit(brandInfo);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Details</h2>
        <p className="text-gray-600">Tell us more about your {itemName}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Brand Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Nike, TaylorMade, KitchenAid, Coach"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the brand name if you can see it on the item
          </p>
        </div>

        {/* Model Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model/Series (Optional)
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g., Air Jordan 1, Classic Series, Legacy"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Specific model information can help with pricing accuracy
          </p>
        </div>

        {/* Condition Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition *
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="excellent">Excellent - Like new, minimal wear</option>
            <option value="good">Good - Some wear but still functional</option>
            <option value="fair">Fair - Visible wear, may need minor repairs</option>
            <option value="poor">Poor - Significant wear or damage</option>
            <option value="unknown">Unknown - Can&apos;t determine condition</option>
          </select>
        </div>

        {/* Camera Option */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-800 mb-2">
            📷 Can&apos;t read the brand?
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Take a photo of the logo or brand name for better identification
          </p>
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            📸 Take Photo of Logo
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ⏭️ Skip Brand Info
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue
          </button>
        </div>
      </form>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Photo of Logo/Brand</h3>
              <p className="text-sm text-gray-600">Take a clear photo of the brand name or logo</p>
            </div>
            
            <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm text-gray-600">
                Camera functionality coming soon!<br/>
                For now, please manually enter the brand information.
              </p>
            </div>
            
            <button
              onClick={() => setShowCamera(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>💡 Tip: Brand information significantly improves pricing accuracy and helps identify valuable items!</p>
      </div>
    </div>
  );
}
