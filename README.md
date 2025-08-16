# ThriftScope - AI-Powered Thrift Scanner

A Next.js application that uses AI image recognition and eBay API integration to help thrift shoppers identify profitable items for resale.

## 🚀 Features

- **AI Image Recognition**: Google Cloud Vision API integration for automatic item identification
- **Real-time Pricing**: eBay API integration for current market pricing data
- **Profit Calculator**: Instant profit margin calculations and buy/skip recommendations
- **Mobile-First Design**: Responsive PWA with camera integration
- **Fast Performance**: Optimized for quick scanning and analysis

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **APIs**: Google Cloud Vision, eBay Browse API
- **Deployment**: Vercel-ready
- **PWA**: Progressive Web App with offline capabilities

## 📱 Mobile Features

- Camera integration for item scanning
- Touch-optimized interface
- PWA installation support
- Responsive design for all screen sizes
- Fast loading and smooth animations

## 🚀 Quick Start (1-Hour Setup)

### 1. Clone and Install
```bash
git clone <your-repo>
cd thrift-scanner-nextjs
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-client-email

# eBay API
EBAY_APP_ID=your-ebay-app-id
EBAY_CERT_ID=your-ebay-cert-id
EBAY_CLIENT_SECRET=your-ebay-client-secret
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

## 🔧 API Setup

### Google Cloud Vision API
1. Create a Google Cloud project
2. Enable Vision API
3. Create service account and download JSON key
4. Add credentials to environment variables

### eBay API
1. Register as eBay developer
2. Create application for Browse API
3. Get App ID, Cert ID, and Client Secret
4. Add to environment variables

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # Image analysis API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main app component
public/
├── manifest.json             # PWA manifest
└── icons/                    # App icons
```

## 🎯 How It Works

1. **Image Upload**: User takes photo or uploads image
2. **AI Analysis**: Google Vision API identifies the item
3. **Price Research**: eBay API finds recent sale prices
4. **Profit Calculation**: App calculates potential profit margin
5. **Recommendation**: Buy/skip recommendation based on profit threshold

## 🚀 Performance Optimizations

- Image compression and optimization
- Lazy loading for components
- Efficient API calls with fallbacks
- Mobile-first responsive design
- PWA caching strategies

## 🔒 Security Features

- Environment variable protection
- API key security
- Input validation
- Error handling without data exposure

## 📊 Demo Mode

When APIs are not configured, the app runs in demo mode with:
- Mock item identification
- Sample pricing data
- Full functionality demonstration

## 🌟 Future Enhancements

- Multiple marketplace integration (Amazon, Facebook Marketplace)
- Historical price tracking
- User accounts and scan history
- Social sharing features
- Advanced analytics dashboard

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API setup guides

---

**Built with ❤️ for thrift shoppers everywhere**
