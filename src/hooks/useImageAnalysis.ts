import { useState, useCallback } from 'react';
import { ScanResult } from '@/types';
import { fileToBase64 } from '@/utils/image';

interface UseImageAnalysisReturn {
  isLoading: boolean;
  result: ScanResult | null;
  imageData: string | null;
  error: string | null;
  analyzeImage: (file: File) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for handling image analysis
 * @returns UseImageAnalysisReturn object with analysis state and methods
 */
export const useImageAnalysis = (): UseImageAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Convert image to base64 for display
      const base64 = await fileToBase64(file);
      setImageData(base64);
      
      // Prepare form data for API
      const formData = new FormData();
      formData.append('image', file);
      
      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(errorMessage);
      console.error('Image analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setResult(null);
    setImageData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    result,
    imageData,
    error,
    analyzeImage,
    reset
  };
};
