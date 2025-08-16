'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ItemConfirmation as ItemConfirmationType } from '@/types';

interface ItemConfirmationProps {
  item: ItemConfirmationType;
  onConfirm: (confirmed: boolean, correctedName?: string) => void;
}

export default function ItemConfirmation({ item, onConfirm }: ItemConfirmationProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [correctedName, setCorrectedName] = useState(item.itemName);
  const [showCorrection, setShowCorrection] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm(true, correctedName);
  };

  const handleDeny = () => {
    setShowCorrection(true);
  };

  const handleCorrection = () => {
    if (correctedName.trim()) {
      onConfirm(false, correctedName);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Item</h2>
        <p className="text-gray-600">Is this what you're scanning?</p>
      </div>

      {/* Generic Item Image */}
      <div className="mb-6">
        <Image
          src={item.suggestedImage}
          alt={`Generic ${item.itemName}`}
          width={400}
          height={300}
          className="w-full h-64 object-cover rounded-xl mx-auto"
        />
      </div>

      {/* Item Details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {item.itemName}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            Category: {item.category}
          </div>
        </div>
      </div>

      {/* Confirmation Buttons */}
      {!showCorrection && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            ✅ Yes, that&apos;s correct
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            ❌ No, that&apos;s wrong
          </button>
        </div>
      )}

      {/* Correction Input */}
      {showCorrection && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is this item actually?
          </label>
          <input
            type="text"
            value={correctedName}
            onChange={(e) => setCorrectedName(e.target.value)}
            placeholder="Enter the correct item name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCorrection}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue with corrected name
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>This helps us provide more accurate pricing and recommendations</p>
      </div>
    </div>
  );
}
