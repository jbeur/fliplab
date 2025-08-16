'use client';

import { useState } from 'react';
import { ItemConfirmation as ItemConfirmationType } from '@/types';

interface ItemConfirmationProps {
  item: ItemConfirmationType;
  onConfirm: (confirmed: boolean, correctedName?: string) => void;
}

export default function ItemConfirmation({ item, onConfirm }: ItemConfirmationProps) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctedName, setCorrectedName] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);

  const handleConfirm = (confirmed: boolean) => {
    if (confirmed) {
      onConfirm(true);
    } else {
      setShowCorrection(true);
    }
  };

  const handleSubmitCorrection = () => {
    onConfirm(true, correctedName.trim() || item.itemName);
  };

  const handleSkip = () => {
    onConfirm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Item Identification</h2>
        <p className="text-gray-600">Is this what you&apos;re scanning?</p>
      </div>

      {/* AI Identification */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="text-sm text-blue-800 mb-2">
          🤖 AI Identified:
        </div>
        <div className="text-lg font-semibold text-blue-900">
          {item.itemName}
        </div>
        <div className="text-sm text-blue-700">
          Category: {item.category}
        </div>
      </div>

      {/* Generic Image */}
      {item.suggestedImage && (
        <div className="text-center">
          <img
            src={item.suggestedImage}
            alt="Generic item representation"
            className="w-full h-48 object-cover rounded-xl mx-auto"
          />
          <p className="text-sm text-gray-500 mt-2">
            Generic representation for reference
          </p>
        </div>
      )}

      {/* Confirmation Buttons */}
      {!showCorrection && (
        <div className="space-y-3">
          <button
            onClick={() => handleConfirm(true)}
            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            ✅ Yes, that&apos;s correct
          </button>
          
          <button
            onClick={() => handleConfirm(false)}
            className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            ❌ No, that&apos;s wrong
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
          >
            ⏭️ Skip this step
          </button>
        </div>
      )}

      {/* Correction Form */}
      {showCorrection && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is this item?</h3>
            <p className="text-gray-600">Help us improve by providing the correct identification</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={correctedName}
              onChange={(e) => setCorrectedName(e.target.value)}
              placeholder="e.g., Vintage Golf Club, Designer Handbag, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowCorrection(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCorrection}
              disabled={!correctedName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Correction
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>💡 Tip: The more accurate the identification, the better our pricing recommendations will be!</p>
      </div>
    </div>
  );
}
