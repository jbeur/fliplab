// Core application types
export interface ScanResult {
  itemName: string;
  avgPrice: number;
  confidence: number;
  category: string;
  suggestedImage?: string; // Generic image for confirmation
  marketplaceData?: MarketplaceData[]; // Marketplace data from API
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

// Inventory Management Types
export interface InventoryItem {
  id: string;
  itemName: string;
  brand: string;
  category: string;
  condition: string;
  userCost: number;
  suggestedListingPrice: number;
  estimatedProfit: {
    low: number;
    high: number;
    suggested: number;
  };
  bestPlatforms: string[];
  quantity: number;
  imageUrl: string;
  notes?: string;
  dateAdded: string;
  status: 'inventory' | 'listed' | 'sold';
  listings?: ListingInfo[];
}

export interface ListingInfo {
  id: string;
  platform: string;
  listingUrl?: string;
  listingTitle?: string;
  price: number;
  dateListed: string;
  status: 'active' | 'sold' | 'expired';
}

export interface SoldItem extends InventoryItem {
  soldDate: string;
  soldPrice: number;
  actualProfit: number;
  platform: string;
  buyerNotes?: string;
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
  onAddToInventory: (item: ComprehensiveAnalysis) => void;
}

export interface CostInputProps {
  onSubmit: (cost: number) => void;
}

export interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
  onMarkSold: (item: InventoryItem, soldPrice: number, platform: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export interface SoldItemsListProps {
  items: SoldItem[];
  onViewDetails: (item: SoldItem) => void;
}

export interface AddToInventoryModalProps {
  analysis: ComprehensiveAnalysis;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'status'>) => void;
}
