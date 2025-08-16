# FlipLab - API Requirements & Setup Guide

## Overview

FlipLab integrates with multiple external APIs to provide comprehensive item analysis and marketplace data. This document outlines the requirements, setup process, and integration details for each

## 🎯 Required APIs

### **1. Google Cloud Vision API (Primary - AI Recognition)**

#### **Purpose**
- Analyze uploaded images to identify items
- Extract text from labels and logos
- Provide confidence scores for item identification

#### **Service Details**
- **Service Name**: Google Cloud Vision API
- **Version**: v1
- **Authentication**: Service Account with JSON key
- **Rate Limits**: 1000 requests per minute (free tier)
- **Quotas**: 1000 requests per day (free tier)

#### **Setup Process**

##### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "fliplab-vision")
4. Click "Create"

##### **Step 2: Enable Vision API**
1. In project dashboard, go to "APIs & Services" → "Library"
2. Search for "Cloud Vision API"
3. Click on "Cloud Vision API"
4. Click "Enable"

##### **Step 3: Create Service Account**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter service account details:
   - Name: `fliplab-vision`
- Description: `Service account for FlipLab Vision API`
4. Click "Create and Continue"

##### **Step 4: Assign Roles**
1. Click "Select a role"
2. Choose "Cloud Vision API User"
3. Click "Continue" → "Done"

##### **Step 5: Generate JSON Key**
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" (downloads key file)

##### **Step 6: Configure Environment**
```env
GOOGLE_CLOUD_PROJECT_ID=fliplab
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCwW0vH/PL0Y4wG\n4Onnqu8C1aA7JaZmwyXiUkJfIuIisljCFld3MgjbELz4iCWhOwT8H+7LFWlxbf2D\nYXHWCOsftR/v1X0gt+Z+Wo31T+b3OmosEIO3vKTbtIINVB9dQ68hX1AEchOgci3M\nwjCSBrCaZJNbHzi9bAAqR+PTY4PM64RZ1VD+3HRBrXGgCA0WOUU2/tKxMrxU8WB6\njzOmgtO01WxANXIpgzj+xyIsmVjYeSwGcuvn7Apt9ouNFEfEH5GIValE78bYibOG\nmrOmxWjo4dp03/j6IB4viHhcdX2tpBINk48pDXj151oZcOUVW5SrEq0p0SiVBpTi\n6EWpyxQ5AgMBAAECgf8bWriGbKsX/S4wYvKPsekg0hc9wA6aIereZU6mMw2gaXQa\n/BwqVjh0F5niyDtjUXmUdzTdiz9aY2p51m4xz3BTmrnkGYPZxKyb11qYPQHg7HlL\nccRR25DhWJOo6EN1KT/LjV0mqLXNTT3iuhGOlOW6Ykn4+FQfYtZ5DcLo0aa/7LDB\nmMBFKdBvYsNCbzuquOIoKuYd0BJrbwb9/yqk8wJ0N5DGHQXbKG7orfeL9JeF2OxY\nr3/9SPBjeZZVgUSDtd5Hd+MVsnGoipwNtwbvKZhyRWFtKcKH6Uz9bAU4iZhwA456\neK1H/ewmYg8V4BACjlNmeIEtkGk/mCqqReeW3bECgYEA3Y9FTri3aQyNJehDq+C3\npwFyDqa8EumfNA+kmj2WmzljqE4e4V8EoHk/RThBp3l4xXABfj5LcDQxVtbWvY4J\n3UkZ7eh5x7O8tLZJGBh+i5/VoaeBff69lQ5QfNgjTGK9eG2pTQweNFq4zEQhL+gy\n1aWWZmBTWSWr3NCaAvZF1OkCgYEAy8U4HxHHBKnDa0jld+z/R2qtcm2QlArZGL+l\nnREkLUlcr9tx3YvQReQqYDJbonfWkwExJIsMPtlZ6WKkCWoSKW9L2i372wFvqqie\nc6Sxle9hr5raujN/jt7GjlcWZhqmKwAr4FEI0UHotUF0XHbN72M0XGSVJLkw0t9j\nCDjk8tECgYBSZpSKQJzGDwr3zDhO1la3YAxBcrWD+ytgu2imjL1UobV0xQkrHKGl\n5TIo1lFkrgLCu3NytkxsQJ0RBPn8qbT1fdiM6OdR5IEMXLc2pPV7jEhxxNCeQX3U\nz+wTYndOU3LQNUjABP++zPbp0XTeUmeFmf4juTOGdkJC77o328wA8QKBgCbZmCSc\nUBR8hWyb/lwKDHXCSgVqDEmdc9y7FUlH7lzQAuLodOInePMKWGX00/G65WcrsAHm\nnNQSvoi3rMy6s3HA7XZQlBciQ/cGpQcpXE5Y0IgZfyBHF0fXA4Y55mRbKllCdBsV\neBfleAeuzg+e+w5sHJyM9L6GrF9YBdqYdlYxAoGBALE0+RKYsdRnjsKiIZbwJyua\nTs3Bv4SHu9KPNRuXoOCWo3JlhkquL2nchEqIckssTlhxoHtM5tyDb/hfhi+VLhux\nS6ggb2332gH+meBS+nUVqFoxgygVxEwO1QIP1ZdGxFJ7wNq23IXSInd8QHydVHLp\nj5sZjqn18EK8VgnfnkTV\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=fliplab-vision@fliplab.iam.gserviceaccount.com
```

#### **API Usage Example**
```typescript
import { ImageAnnotatorClient } from '@google-cloud/vision';

const vision = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
});

const [result] = await vision.labelDetection({
  image: { content: imageBuffer }
});
```

#### **Costs & Billing**
- **Free Tier**: 1000 requests/month
- **Paid Tier**: $1.50 per 1000 requests
- **Budget Alert**: Set up billing alerts in Google Cloud Console

---

### **2. eBay Browse API (Primary - Marketplace Data)**

#### **Purpose**
- Search for completed sales of similar items
- Get current market prices and trends
- Identify best selling platforms

#### **Service Details**
- **Service Name**: eBay Browse API
- **Version**: v1
- **Authentication**: OAuth 2.0 Client Credentials
- **Rate Limits**: 5000 calls per day
- **Endpoints**: `/item_summary/search`, `/item/get_items_by_item_group`

#### **Setup Process**

##### **Step 1: Register as eBay Developer**
1. Go to [eBay Developer Portal](https://developer.ebay.com/)
2. Click "Sign In" with eBay account
3. Complete developer registration

##### **Step 2: Create Application**
1. Go to "My Account" → "Application Keys"
2. Click "Create a New Application"
3. Fill in application details:
   - Application Name: `FlipLab`
   - Developer Account: Your eBay account
   - Application Type: `Web Application`
4. Click "Create Application"

##### **Step 3: Configure Application**
1. Set OAuth Redirect URIs (if needed)
2. Note your App ID, Cert ID, and Client Secret
3. Enable "Buy Browse API" in API Permissions

##### **Step 4: Configure Environment**
```env
EBAY_APP_ID=your-app-id-here
EBAY_CERT_ID=your-cert-id-here
EBAY_CLIENT_SECRET=your-client-secret-here
```

#### **API Usage Example**
```typescript
import axios from 'axios';

// Get access token
const tokenResponse = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', 
  'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${appId}:${clientSecret}`).toString('base64')}`
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
```

#### **Rate Limiting & Best Practices**
- **Token Management**: Cache access tokens (valid for 2 hours)
- **Request Batching**: Group similar searches
- **Error Handling**: Implement exponential backoff for rate limits
- **Data Caching**: Cache results to minimize API calls

---

## 🔄 API Integration Flow

### **Complete Request Flow**
```
1. User Uploads Image
   ↓
2. Image → Base64 → Buffer
   ↓
3. Google Vision API Analysis
   ↓
4. Item Identification + Confidence
   ↓
5. eBay API Search (with item name)
   ↓
6. Marketplace Data Aggregation
   ↓
7. Price Analysis + Recommendations
   ↓
8. Response to User
```

### **Error Handling Strategy**
```typescript
try {
  // Primary API call
  const result = await primaryAPI();
  return result;
} catch (error) {
  console.error('Primary API failed:', error);
  
  try {
    // Fallback API call
    const fallback = await fallbackAPI();
    return fallback;
  } catch (fallbackError) {
    console.error('Fallback API failed:', fallbackError);
    
    // Return mock data
    return getMockData();
  }
}
```

---

## 📊 Data Sources & Fallbacks

### **Primary Data Sources**
1. **Google Vision API**: Item identification
2. **eBay Browse API**: Marketplace pricing
3. **User Input**: Brand, model, condition

### **Fallback Data Sources**
1. **Mock Datasets**: Comprehensive demo data
2. **Generic Images**: Unsplash stock photos
3. **Estimated Pricing**: Based on category averages

### **Data Quality Assurance**
- **Confidence Scores**: Only use high-confidence AI results
- **Price Validation**: Filter out extreme outliers
- **Source Verification**: Prioritize recent sales data
- **User Confirmation**: Always allow user correction

---

## 🔒 Security & Compliance

### **API Key Security**
- **Environment Variables**: Never commit API keys to code
- **Key Rotation**: Regular key updates
- **Access Control**: Minimal required permissions
- **Monitoring**: Track API usage and costs

### **Data Privacy**
- **Image Processing**: No persistent storage
- **User Data**: No personal information collection
- **Third-party Compliance**: Follow API provider terms
- **GDPR Compliance**: European data protection

### **Rate Limiting**
- **Client-side**: Implement request throttling
- **Server-side**: API call queuing
- **Fallback Strategy**: Graceful degradation
- **User Feedback**: Clear error messages

---

## 🧪 Testing & Development

### **API Testing Tools**
- **Google Cloud Console**: Vision API testing
- **eBay Developer Portal**: API playground
- **Postman**: API endpoint testing
- **Insomnia**: Alternative API client

### **Mock Data for Development**
```typescript
// Enable mock mode when APIs not configured
const isMockMode = !process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.EBAY_APP_ID;

if (isMockMode) {
  console.log('🎭 Running in mock mode');
  return getMockData();
}
```

### **Environment Validation**
```typescript
import { validateEnvironment } from '@/lib/env';

// Check API configuration
const envStatus = validateEnvironment();
console.log('Environment Status:', envStatus);

// Validate API connectivity
const apiHealth = await checkAPIHealth();
console.log('API Health:', apiHealth);
```

---

## 📈 Monitoring & Analytics

### **API Performance Metrics**
- **Response Times**: Track API latency
- **Success Rates**: Monitor API reliability
- **Error Rates**: Identify common failures
- **Cost Tracking**: Monitor API usage costs

### **User Experience Metrics**
- **Image Recognition Accuracy**: User confirmation rates
- **Price Prediction Accuracy**: Actual vs. predicted prices
- **User Satisfaction**: App store ratings and feedback
- **Feature Usage**: Most/least used features

### **Alerting & Notifications**
- **API Failures**: Immediate alerts for critical errors
- **Rate Limit Warnings**: Proactive rate limit monitoring
- **Cost Thresholds**: Billing alerts for API usage
- **Performance Degradation**: Response time monitoring

---

## 🚀 Future API Integrations

### **Planned Integrations**
1. **Amazon Product API**: Additional marketplace data
2. **Facebook Marketplace**: Social commerce insights
3. **Local Marketplaces**: Regional platform data
4. **Price History APIs**: Historical pricing trends

### **Web Scraping Considerations**
- **Terms of Service**: Ensure compliance
- **Rate Limiting**: Respect platform limits
- **Data Freshness**: Regular updates
- **Legal Compliance**: Follow data protection laws

### **Machine Learning APIs**
- **Condition Assessment**: AI-powered item condition analysis
- **Price Prediction**: ML-based price forecasting
- **Trend Analysis**: Market trend identification
- **Personalization**: User-specific recommendations

---

## 📚 Additional Resources

### **Official Documentation**
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### **Community Resources**
- [Google Cloud Community](https://cloud.google.com/community)
- [eBay Developer Forums](https://developer.ebay.com/community)
- [Next.js Discord](https://discord.gg/nextjs)

### **Support Channels**
- **Google Cloud**: [Support Portal](https://cloud.google.com/support)
- **eBay Developer**: [Developer Support](https://developer.ebay.com/support)
- **FlipLab**: GitHub Issues

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained By**: FlipLab Development Team
