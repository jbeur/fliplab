# ThriftScope - Comprehensive Documentation

## 📋 Table of Contents

1. [User Journey](#user-journey)
2. [Component Architecture](#component-architecture)
3. [API Documentation](#api-documentation)
4. [Data Flow](#data-flow)
5. [Configuration Requirements](#configuration-requirements)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

## 🚀 User Journey

### **Phase 1: Image Upload & AI Recognition**
1. **Upload Image**: User takes photo or uploads image of item
2. **AI Analysis**: Google Vision API analyzes image and identifies item
3. **Item Confirmation**: App shows generic image + asks user to confirm identification
4. **User Correction**: User can confirm, deny, or correct the item name

### **Phase 2: Brand & Details Collection**
1. **Brand Input**: User enters brand name, model, and condition
2. **Logo Photo Option**: User can take photo of logo/label if brand unknown
3. **Skip Option**: User can skip brand details if not applicable

### **Phase 3: Marketplace Analysis**
1. **Deep Search**: App searches multiple marketplaces for similar items
2. **Price Analysis**: Calculates low, average, and high price ranges
3. **Platform Recommendations**: Suggests best platforms to list the item
4. **Profit Calculation**: Analyzes profit potential based on user's cost

### **Phase 4: Results & Recommendations**
1. **Comprehensive Report**: Shows detailed analysis with pricing data
2. **Smart Flip Decision**: Recommends whether to buy or pass
3. **Actionable Tips**: Provides listing strategies and best practices

## 🏗️ Component Architecture

### **Core Components**

#### 1. **ThriftScanner (Main App)**
- **Location**: `src/app/page.tsx`
- **Purpose**: Main application orchestrator
- **State Management**: Manages overall app flow and component transitions
- **Dependencies**: All other components, custom hooks, utilities

#### 2. **ItemConfirmation**
- **Location**: `src/components/ItemConfirmation.tsx`
- **Purpose**: Shows AI recognition results and gets user confirmation
- **Props**:
  ```typescript
  interface ItemConfirmationProps {
    item: ItemConfirmation;
    onConfirm: (confirmed: boolean, correctedName?: string) => void;
  }
  ```
- **Features**:
  - Displays generic item image for confirmation
  - Yes/No confirmation buttons
  - Text input for item name correction
  - Responsive design for mobile

#### 3. **BrandInput**
- **Location**: `src/components/BrandInput.tsx`
- **Purpose**: Collects brand information and item condition
- **Props**:
  ```typescript
  interface BrandInputProps {
    onBrandSubmit: (brandInfo: BrandInfo) => void;
    itemName: string;
  }
  ```
- **Features**:
  - Brand name input (required)
  - Model/type input (optional)
  - Condition dropdown (excellent, good, fair, poor)
  - Camera option for logo photos
  - Skip functionality

#### 4. **MarketplaceAnalysis**
- **Location**: `src/components/MarketplaceAnalysis.tsx`
- **Purpose**: Displays comprehensive analysis results
- **Props**:
  ```typescript
  interface MarketplaceAnalysisProps {
    analysis: ComprehensiveAnalysis;
    onNewScan: () => void;
  }
  ```
- **Features**:
  - Price range visualization (low, average, high)
  - Recommended listing price
  - Profit analysis with confidence scores
  - Platform recommendations
  - Recent sales data
  - Pro tips for listing

#### 5. **ErrorBoundary**
- **Location**: `src/components/ErrorBoundary.tsx`
- **Purpose**: Catches and handles React errors gracefully
- **Features**:
  - Error state management
  - User-friendly error messages
  - Development mode error details
  - Refresh functionality

### **Custom Hooks**

#### 1. **useImageAnalysis**
- **Location**: `src/hooks/useImageAnalysis.ts`
- **Purpose**: Manages image analysis state and API calls
- **Returns**:
  ```typescript
  interface UseImageAnalysisReturn {
    isLoading: boolean;
    result: ScanResult | null;
    imageData: string | null;
    error: string | null;
    analyzeImage: (file: File) => Promise<void>;
    reset: () => void;
  }
  ```

### **Utility Functions**

#### 1. **Image Utilities** (`src/utils/image.ts`)
- `fileToBase64()`: Converts File to base64 string
- `base64ToFile()`: Converts base64 to File object
- `isValidImageFile()`: Validates image file types
- `formatFileSize()`: Human-readable file size formatting

#### 2. **Profit Utilities** (`src/utils/profit.ts`)
- `calculateProfit()`: Calculates profit and margin
- `isWorthBuying()`: Determines if item is worth purchasing
- `getRecommendedMaxPrice()`: Suggests maximum purchase price
- `formatCurrency()`: Consistent currency formatting
- `formatPercentage()`: Consistent percentage formatting

#### 3. **Marketplace Utilities** (`src/utils/marketplace.ts`)
- `calculatePriceRange()`: Computes low/high/average prices
- `getRecommendedPlatforms()`: Suggests best listing platforms
- `calculateSuggestedListingPrice()`: Recommends listing price
- `analyzeProfitPotential()`: Analyzes flip potential
- `generateComprehensiveAnalysis()`: Creates full analysis object

#### 4. **Item Image Utilities** (`src/utils/itemImages.ts`)
- `ITEM_IMAGES`: Generic image mappings for common items
- `getGenericItemImage()`: Finds best matching generic image
- `getRandomGenericImage()`: Returns random image for demos

## 🔌 API Documentation

### **1. Image Analysis API**

#### **Endpoint**: `POST /api/analyze`

#### **Purpose**: Analyzes uploaded images using AI and returns item identification

#### **Request**:
```typescript
// FormData with image file
const formData = new FormData();
formData.append('image', File);
```

#### **Response**:
```typescript
interface AnalysisResponse {
  itemName: string;
  avgPrice: number;
  confidence: number;
  category: string;
  suggestedImage: string;
  marketplaceData: MarketplaceData[];
}
```

#### **API Requirements**:

##### **Google Cloud Vision API**
- **Service**: Google Cloud Vision API
- **Authentication**: Service Account with JSON key
- **Environment Variables**:
  ```env
  GOOGLE_CLOUD_PROJECT_ID=your-project-id
  GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
  ```
- **Setup Steps**:
  1. Create Google Cloud project
  2. Enable Vision API
  3. Create service account
  4. Download JSON key file
  5. Add credentials to environment

##### **eBay Browse API**
- **Service**: eBay Browse API v1
- **Authentication**: OAuth 2.0 Client Credentials
- **Environment Variables**:
  ```env
  EBAY_APP_ID=your-ebay-app-id
  EBAY_CERT_ID=your-ebay-cert-id
  EBAY_CLIENT_SECRET=your-ebay-client-secret
  ```
- **Setup Steps**:
  1. Register as eBay developer
  2. Create application
  3. Get App ID, Cert ID, and Client Secret
  4. Add to environment variables

#### **API Flow**:
1. **Image Processing**: Converts uploaded image to buffer
2. **Vision Analysis**: Google Vision API identifies item and category
3. **Marketplace Search**: eBay API searches for completed sales
4. **Data Aggregation**: Combines AI results with marketplace data
5. **Response Generation**: Returns comprehensive item analysis

#### **Fallback Behavior**:
- **Demo Mode**: When APIs not configured, uses mock data
- **Partial Failure**: Continues with available data sources
- **Error Handling**: Graceful degradation with user feedback

### **2. Data Sources & Scraping**

#### **Current Sources**:
- **eBay**: Official API integration
- **Mock Data**: Comprehensive demo datasets

#### **Future Expansion**:
- **Facebook Marketplace**: Web scraping (requires compliance review)
- **Amazon**: API integration (requires seller account)
- **Craigslist**: Web scraping (requires compliance review)
- **Local Marketplaces**: Regional platform integration

#### **Scraping Considerations**:
- **Rate Limiting**: Respect platform rate limits
- **Terms of Service**: Ensure compliance with platform policies
- **Data Freshness**: Regular updates for accurate pricing
- **Legal Compliance**: Follow data protection regulations

## 🔄 Data Flow

### **1. Image Upload Flow**
```
User Upload → File Validation → Base64 Conversion → API Call → AI Analysis
```

### **2. Item Confirmation Flow**
```
AI Result → Generic Image Display → User Confirmation → Brand Collection
```

### **3. Marketplace Analysis Flow**
```
Brand Info → Multi-Platform Search → Price Aggregation → Profit Calculation
```

### **4. Results Display Flow**
```
Analysis Data → Component Rendering → User Interaction → New Scan
```

## ⚙️ Configuration Requirements

### **Environment Variables**

#### **Required for Full Functionality**:
```env
# Google Cloud Vision
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# eBay API
EBAY_APP_ID=your-ebay-app-id
EBAY_CERT_ID=your-ebay-cert-id
EBAY_CLIENT_SECRET=your-ebay-client-secret
```

#### **Optional**:
```env
# Google Cloud Key File (alternative to inline credentials)
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json

# App Configuration
NODE_ENV=production
```

### **Dependencies**

#### **Production Dependencies**:
```json
{
  "@google-cloud/vision": "^5.0.0",
  "@upstash/context7-mcp": "^1.0.14",
  "@vercel/mcp-adapter": "^1.0.0",
  "axios": "^1.6.0",
  "next": "15.4.6",
  "react": "^18",
  "react-dom": "^18",
  "react-webcam": "^7.2.0"
}
```

#### **Development Dependencies**:
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "eslint": "^8",
  "eslint-config-next": "15.4.6",
  "postcss": "^8",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

## 🚀 Deployment Guide

### **1. Vercel Deployment (Recommended)**

#### **Prerequisites**:
- Vercel account
- GitHub repository
- Environment variables configured

#### **Steps**:
1. **Connect Repository**:
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial ThriftScope deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Import repository in Vercel dashboard
   - Configure environment variables
   - Deploy automatically

3. **Custom Domain** (Optional):
   - Add custom domain in Vercel settings
   - Configure DNS records

#### **Vercel Configuration**:
```json
{
  "version": 2,
  "name": "thriftscope",
  "builds": [{ "src": "package.json", "use": "@vercel/next" }],
  "functions": {
    "src/app/api/analyze/route.ts": { "maxDuration": 30 }
  }
}
```

### **2. Other Platforms**

#### **Netlify**:
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables in Netlify dashboard

#### **AWS Amplify**:
- Connect GitHub repository
- Build settings: `npm run build`
- Environment variables in Amplify console

#### **Self-Hosted**:
```bash
# Build application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "thriftscope" -- start
```

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Google Vision API Errors**
```bash
# Error: Invalid credentials
# Solution: Check service account JSON and environment variables

# Error: API not enabled
# Solution: Enable Vision API in Google Cloud Console

# Error: Quota exceeded
# Solution: Check API quotas and billing
```

#### **2. eBay API Issues**
```bash
# Error: Invalid app credentials
# Solution: Verify App ID, Cert ID, and Client Secret

# Error: Rate limit exceeded
# Solution: Implement rate limiting and retry logic

# Error: Authentication failed
# Solution: Check OAuth token generation
```

#### **3. Build Errors**
```bash
# TypeScript compilation errors
npm run type-check

# ESLint errors
npm run lint:fix

# Build failures
npm run clean && npm run build
```

#### **4. Runtime Errors**
```bash
# Check browser console for client errors
# Check server logs for API errors
# Verify environment variables are loaded
```

### **Debug Mode**

#### **Enable Debug Logging**:
```typescript
// In development, enable verbose logging
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Debug: API response:', response);
}
```

#### **Environment Validation**:
```typescript
// Check environment configuration
import { validateEnvironment } from '@/lib/env';
console.log('Environment valid:', validateEnvironment());
```

## 📱 Mobile Optimization

### **PWA Features**
- **Manifest**: `public/manifest.json`
- **Service Worker**: Automatic PWA installation
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Full-screen mode

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Touch Interactions**: Large touch targets
- **Camera Integration**: Native camera access
- **Fast Loading**: Optimized images and bundles

### **Performance Metrics**
- **First Load JS**: ~199KB
- **Build Time**: ~3 seconds
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

## 🔒 Security Considerations

### **API Security**
- **Environment Variables**: Never expose API keys in client code
- **Rate Limiting**: Implement API call limits
- **Input Validation**: Validate all user inputs
- **Error Handling**: Don't expose sensitive error details

### **Data Privacy**
- **Image Storage**: Images processed in memory, not stored
- **User Data**: No persistent user data collection
- **Third-party APIs**: Secure API key management
- **HTTPS Only**: Force secure connections in production

## 🌟 Future Enhancements

### **Short Term (1-3 months)**
- [ ] Multiple marketplace integration
- [ ] Historical price tracking
- [ ] User accounts and scan history
- [ ] Advanced filtering and search

### **Medium Term (3-6 months)**
- [ ] Machine learning price predictions
- [ ] Social sharing features
- [ ] Mobile app development
- [ ] API rate limiting and caching

### **Long Term (6+ months)**
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with inventory systems
- [ ] AI-powered condition assessment

---

**Documentation Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained By**: ThriftScope Development Team
