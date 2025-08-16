import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import axios from 'axios';
import { getEnvConfig } from '@/lib/env';
import { ScanResult, MarketplaceData } from '@/types';
import { getGenericItemImage } from '@/utils/itemImages';

// Initialize Google Cloud Vision client
const vision = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || undefined,
  credentials: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  } : undefined,
});

// eBay API configuration
const EBAY_CONFIG = {
  appId: process.env.EBAY_APP_ID || 'demo-app-id',
  certId: process.env.EBAY_CERT_ID || 'demo-cert-id',
  clientSecret: process.env.EBAY_CLIENT_SECRET || 'demo-secret',
};

// Mock marketplace data for demo purposes
const MOCK_MARKETPLACE_DATA: Record<string, MarketplaceData[]> = {
  'golf club': [
    { platform: 'eBay', itemName: 'TaylorMade Golf Club Set', price: 245, condition: 'good', soldDate: '2024-01-15' },
    { platform: 'Facebook Marketplace', itemName: 'Callaway Golf Club', price: 189, condition: 'excellent', soldDate: '2024-01-10' },
    { platform: 'eBay', itemName: 'Ping Golf Club', price: 156, condition: 'fair', soldDate: '2024-01-08' },
    { platform: 'Craigslist', itemName: 'Golf Club Set', price: 120, condition: 'good', soldDate: '2024-01-05' },
  ],
  'mixer': [
    { platform: 'eBay', itemName: 'KitchenAid Stand Mixer', price: 189, condition: 'good', soldDate: '2024-01-12' },
    { platform: 'Facebook Marketplace', itemName: 'KitchenAid Mixer', price: 165, condition: 'excellent', soldDate: '2024-01-09' },
    { platform: 'eBay', itemName: 'Stand Mixer', price: 145, condition: 'fair', soldDate: '2024-01-06' },
  ],
  'sneakers': [
    { platform: 'eBay', itemName: 'Nike Air Jordan 1', price: 245, condition: 'good', soldDate: '2024-01-14' },
    { platform: 'StockX', itemName: 'Air Jordan Retro', price: 289, condition: 'excellent', soldDate: '2024-01-11' },
    { platform: 'eBay', itemName: 'Nike Sneakers', price: 189, condition: 'fair', soldDate: '2024-01-07' },
  ],
  'default': [
    { platform: 'eBay', itemName: 'Generic Item', price: 100, condition: 'good', soldDate: '2024-01-01' },
    { platform: 'Facebook Marketplace', itemName: 'Similar Item', price: 85, condition: 'fair', soldDate: '2024-01-01' },
  ]
};

// Mock items for demo purposes when APIs are not configured
const MOCK_ITEMS: ScanResult[] = [
  {
    itemName: "Vintage Nike Air Jordan 1985 Sneakers",
    avgPrice: 245,
    confidence: 0.9,
    category: "Shoes",
    suggestedImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop"
  },
  {
    itemName: "Kitchen Aid Stand Mixer - Classic Series",
    avgPrice: 189,
    confidence: 0.85,
    category: "Kitchen",
    suggestedImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  },
  {
    itemName: "Vintage Pyrex Mixing Bowl Set",
    avgPrice: 67,
    confidence: 0.8,
    category: "Kitchen",
    suggestedImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  },
  {
    itemName: "Designer Handbag - Coach Legacy",
    avgPrice: 156,
    confidence: 0.9,
    category: "Fashion",
    suggestedImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop"
  },
  {
    itemName: "First Edition Book - Harry Potter",
    avgPrice: 340,
    confidence: 0.95,
    category: "Books",
    suggestedImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
  }
];

/**
 * Analyze image using Google Vision API
 * @param imageBuffer - Image buffer to analyze
 * @returns Promise<{itemName: string, category: string}>
 */
async function analyzeImageWithVision(imageBuffer: Buffer): Promise<{itemName: string, category: string}> {
  try {
    console.log('🔍 Using Google Vision API...');
    
    const [result] = await vision.labelDetection({
      image: { content: imageBuffer }
    });
    
    const labels = result.labelAnnotations || [];
    console.log('🏷️ Labels detected:', labels.map(l => l.description));
    
    if (labels.length > 0) {
      return {
        itemName: labels[0].description || '',
        category: labels[1]?.description || labels[0].description || ''
      };
    }
    
    return { itemName: '', category: '' };
  } catch (error) {
    console.error('⚠️ Google Vision API failed:', error);
    throw new Error('Vision API analysis failed');
  }
}

/**
 * Get eBay pricing data for an item
 * @param itemName - Name of the item to search for
 * @returns Promise<number> - Average price
 */
async function getEbayPricing(itemName: string): Promise<number> {
  try {
    console.log('💰 Fetching eBay pricing data...');
    
    // Get eBay access token
    const tokenResponse = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', 
      'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${EBAY_CONFIG.appId}:${EBAY_CONFIG.clientSecret}`).toString('base64')}`
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    
    // Search for completed sales
    const searchResponse = await axios.get(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(itemName)}&filter=soldItems`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY-US'
        }
      }
    );

    const items = searchResponse.data.itemSummaries || [];
    if (items.length > 0) {
      const prices = items
        .slice(0, 10) // Take first 10 items
        .map((item: any) => parseFloat(item.price?.value || '0'))
        .filter((price: number) => price > 0);
      
      if (prices.length > 0) {
        const avgPrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
        console.log('💵 eBay pricing calculated:', avgPrice);
        return avgPrice;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('⚠️ eBay API failed:', error);
    throw new Error('eBay pricing lookup failed');
  }
}

/**
 * Get marketplace data for an item
 * @param itemName - Name of the item to search for
 * @returns Promise<MarketplaceData[]> - Array of marketplace data
 */
async function getMarketplaceData(itemName: string): Promise<MarketplaceData[]> {
  try {
    console.log('🛒 Fetching marketplace data...');
    
    // Try to get real data from eBay if configured
    if (process.env.EBAY_APP_ID && process.env.EBAY_CLIENT_SECRET) {
      // This would be expanded to include multiple marketplaces
      // For now, we'll use mock data with some eBay integration
      const mockData = MOCK_MARKETPLACE_DATA[itemName.toLowerCase()] || MOCK_MARKETPLACE_DATA.default;
      return mockData;
    }
    
    // Return mock data for demo
    return MOCK_MARKETPLACE_DATA[itemName.toLowerCase()] || MOCK_MARKETPLACE_DATA.default;
  } catch (error) {
    console.error('⚠️ Marketplace data fetch failed:', error);
    return MOCK_MARKETPLACE_DATA.default;
  }
}

/**
 * POST handler for image analysis
 * @param request - Next.js request object
 * @returns NextResponse with analysis results
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting enhanced image analysis...');
    
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      console.error('❌ No image file provided');
      return NextResponse.json(
        { error: 'No image file provided' }, 
        { status: 400 }
      );
    }

    console.log('📸 Image received, processing...');

    // Convert file to buffer for Google Vision API
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    const envConfig = getEnvConfig();
    let itemName = '';
    let category = '';

    // Try to use Google Vision API if configured
    if (envConfig.hasGoogleVision) {
      try {
        const visionResult = await analyzeImageWithVision(imageBuffer);
        itemName = visionResult.itemName;
        category = visionResult.category;
      } catch (visionError) {
        console.error('⚠️ Vision API failed, falling back to mock data:', visionError);
      }
    }

    // If no labels from Vision API, use mock data
    if (!itemName) {
      console.log('🎭 Using mock data for demo...');
      const randomItem = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
      itemName = randomItem.itemName;
      category = randomItem.category;
    }

    // Get generic image for confirmation
    const suggestedImage = getGenericItemImage(itemName);

    // Try to get marketplace data
    const marketplaceData = await getMarketplaceData(itemName);

    // Try to get eBay pricing data if configured
    let avgPrice = 0;
    if (envConfig.hasEbayApi) {
      try {
        avgPrice = await getEbayPricing(itemName);
      } catch (ebayError) {
        console.error('⚠️ eBay API failed, using mock pricing:', ebayError);
      }
    }

    // If no eBay data, use mock pricing
    if (avgPrice === 0) {
      console.log('🎭 Using mock pricing data...');
      const mockItem = MOCK_ITEMS.find(item => 
        item.itemName.toLowerCase().includes(itemName.toLowerCase()) ||
        itemName.toLowerCase().includes(item.itemName.toLowerCase())
      );
      avgPrice = mockItem ? mockItem.avgPrice : MOCK_ITEMS[0].avgPrice;
    }

    const result: ScanResult = {
      itemName,
      avgPrice: Math.round(avgPrice),
      confidence: 0.85,
      category,
      suggestedImage
    };

    console.log('✅ Enhanced analysis complete:', result);
    
    return NextResponse.json({
      ...result,
      marketplaceData
    });
    
  } catch (error) {
    console.error('❌ Error in enhanced image analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' }, 
      { status: 500 }
    );
  }
}
