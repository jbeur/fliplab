# ThriftScope - Developer Quickstart Guide

## 🚀 Get Up and Running in 5 Minutes

### **1. Clone & Install**
```bash
git clone <your-repo>
cd thriftscope
npm install
```

### **2. Environment Setup**
Create `.env.local`:
```env
# Google Cloud Vision (Optional - app runs in demo mode without)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# eBay API (Optional - app runs in demo mode without)
EBAY_APP_ID=your-ebay-app-id
EBAY_CERT_ID=your-ebay-cert-id
EBAY_CLIENT_SECRET=your-ebay-client-secret
```

### **3. Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/              # API routes
│   │   └── analyze/      # Image analysis endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main app component
├── components/            # React components
│   ├── ErrorBoundary.tsx # Error handling
│   ├── ItemConfirmation.tsx # Item verification
│   ├── BrandInput.tsx    # Brand collection
│   └── MarketplaceAnalysis.tsx # Results display
├── hooks/                 # Custom React hooks
│   └── useImageAnalysis.ts # Image analysis logic
├── lib/                   # Library code
│   └── env.ts            # Environment validation
├── types/                 # TypeScript definitions
│   └── index.ts          # All interfaces
└── utils/                 # Utility functions
    ├── image.ts          # Image processing
    ├── itemImages.ts     # Generic image mappings
    ├── marketplace.ts    # Marketplace analysis
    └── profit.ts         # Profit calculations
```

## 🔧 Key Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript validation
npm run clean        # Clean build artifacts

# Testing (when implemented)
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## 📱 Component Development

### **Adding New Components**
1. Create component in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Import and use in main app
4. Update `DOCUMENTATION.md`

### **Component Template**
```typescript
'use client';

import { useState } from 'react';
import { ComponentProps } from '@/types';

interface ComponentProps {
  // Define props here
}

export default function ComponentName({ ...props }: ComponentProps) {
  // Component logic here
  
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

## 🔌 API Development

### **Adding New API Routes**
1. Create route in `src/app/api/`
2. Define request/response types in `src/types/`
3. Add error handling and validation
4. Update documentation

### **API Route Template**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // API logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

## 🎨 Styling Guidelines

### **Tailwind CSS Classes**
- Use utility classes for consistent styling
- Follow mobile-first responsive design
- Maintain consistent spacing with Tailwind's scale
- Use semantic color names (e.g., `text-gray-800` not `text-black`)

### **Component Styling Pattern**
```typescript
// Good: Consistent, semantic classes
<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">

// Avoid: Inline styles or inconsistent classes
<div style={{ backgroundColor: 'white', borderRadius: '12px' }}>
```

## 🧪 Testing Strategy

### **Unit Tests**
- Test utility functions
- Test custom hooks
- Test component logic

### **Integration Tests**
- Test API endpoints
- Test component interactions
- Test user flows

### **E2E Tests**
- Test complete user journeys
- Test mobile responsiveness
- Test API integrations

## 🚀 Deployment Checklist

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] API keys valid and working
- [ ] Error boundaries implemented
- [ ] Mobile responsiveness verified

### **Production Deployment**
- [ ] Deploy to staging first
- [ ] Test all user flows
- [ ] Verify API rate limits
- [ ] Check performance metrics
- [ ] Deploy to production
- [ ] Monitor error logs

## 🐛 Debugging Tips

### **Client-Side Debugging**
```typescript
// Add debug logging
console.log('🔍 Debug:', { data, state });

// Use React DevTools for component state
// Check browser console for errors
```

### **Server-Side Debugging**
```typescript
// API route logging
console.log('🚀 API Request:', { method, url, body });

// Environment validation
import { validateEnvironment } from '@/lib/env';
console.log('Environment:', validateEnvironment());
```

### **Common Issues**
1. **Build Errors**: Check TypeScript types and ESLint rules
2. **API Errors**: Verify environment variables and API keys
3. **Runtime Errors**: Check browser console and server logs
4. **Performance Issues**: Use Lighthouse and Next.js analytics

## 📚 Learning Resources

### **Next.js**
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)

### **React**
- [React Documentation](https://react.dev/)
- [Hooks Guide](https://react.dev/reference/react/hooks)
- [TypeScript with React](https://react.dev/learn/typescript)

### **APIs**
- [Google Cloud Vision](https://cloud.google.com/vision/docs)
- [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Contributing

### **Code Standards**
- Follow TypeScript strict mode
- Use ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### **Pull Request Process**
1. Create feature branch
2. Implement changes
3. Add tests if applicable
4. Update documentation
5. Submit PR with description
6. Address review comments

### **Commit Message Format**
```
feat: add new marketplace integration
fix: resolve image upload issue
docs: update API documentation
style: improve component styling
refactor: restructure utility functions
test: add component unit tests
```

---

**Need Help?** Check the main `DOCUMENTATION.md` or create an issue in the repository.
