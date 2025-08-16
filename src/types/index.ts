// Core application types
export interface ScanResult {
  itemName: string;
  avgPrice: number;
  confidence: number;
  category: string;
  suggestedImage?: string; // Generic image for confirmation
}

export interface ItemConfirmation {
  itemName: string;
  category: string;
  suggestedImage: string;
  userConfirmed: boolean;
  userCorrectedName?: string;
}

export interface BrandInfo {
  brand: string;
  model?: string;
  condition: string;
  userProvided: boolean;
}

export interface MarketplaceData {
  platform: string;
  itemName: string;
  price: number;
  condition: string;
  soldDate?: string;
  url?: string;
}

export interface ComprehensiveAnalysis {
  itemName: string;
  brand: string;
  category: string;
  marketplaceData: MarketplaceData[];
  averagePrice: number;
  priceRange: {
    low: number;
    high: number;
    average: number;
  };
  suggestedListingPrice: number;
  recommendedPlatforms: string[];
  profitAnalysis: {
    lowProfit: number;
    highProfit: number;
    suggestedProfit: number;
    isSmartFlip: boolean;
    confidence: number;
  };
  userCost: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ImageAnalysisRequest {
  image: File;
}

export interface ProfitCalculation {
  cost: number;
  avgPrice: number;
  profit: number;
  margin: number;
  isGoodDeal: boolean;
}

// API configuration types
export interface GoogleVisionConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export interface EbayApiConfig {
  appId: string;
  certId: string;
  clientSecret: string;
}

// Component prop types
export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onCameraCapture: () => void;
}

export interface ItemConfirmationProps {
  item: ItemConfirmation;
  onConfirm: (confirmed: boolean, correctedName?: string) => void;
}

export interface BrandInputProps {
  onBrandSubmit: (brandInfo: BrandInfo) => void;
  itemName: string;
}

export interface MarketplaceAnalysisProps {
  analysis: ComprehensiveAnalysis;
  onNewScan: () => void;
}

export interface CostInputProps {
  onSubmit: (cost: number) => void;
}
