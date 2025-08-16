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
  const [useCamera, setUseCamera] = useState(false);

  const handleSubmit = () => {
    if (brand.trim()) {
      onBrandSubmit({
        brand: brand.trim(),
        model: model.trim() || undefined,
        condition,
        userProvided: true
      });
    }
  };

  const handleSkip = () => {
    onBrandSubmit({
      brand: 'Unknown',
      condition: 'unknown',
      userProvided: false
    });
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Brand & Details</h2>
        <p className="text-gray-600">Help us find the exact pricing for your {itemName}</p>
      </div>

      {/* Brand Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Name *
        </label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Nike, Apple, KitchenAid"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Model Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model/Type (Optional)
        </label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g., Air Jordan 1, iPhone 13, Professional 600"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Condition Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="excellent">Excellent - Like New</option>
          <option value="good">Good - Minor Wear</option>
          <option value="fair">Fair - Some Wear</option>
          <option value="poor">Poor - Significant Wear</option>
        </select>
      </div>

      {/* Camera Option */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <div className="text-center">
          <p className="text-sm text-gray-700 mb-3">
            📷 Can&apos;t identify the brand? Take a photo of the logo or label
          </p>
          <button
            onClick={() => setUseCamera(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            📱 Take Photo of Logo
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!brand.trim()}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue with Brand Info
        </button>
        <button
          onClick={handleSkip}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>More specific brand info = more accurate pricing!</p>
      </div>
    </div>
  );
}
