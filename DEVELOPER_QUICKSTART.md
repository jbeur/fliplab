# FlipLab - Developer Quickstart Guide

## Quick Setup

1. Clone the repository
```bash
git clone <your-repo>
cd fliplab
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Run development server
```bash
npm run dev
```

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables for full functionality:

```bash
# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-client-email

# eBay API
EBAY_APP_ID=your-app-id
EBAY_CERT_ID=your-cert-id
EBAY_CLIENT_SECRET=your-client-secret
```

## Development Notes

- The app runs in demo mode when APIs are not configured
- All data is stored in localStorage for development
- Error boundaries provide graceful fallbacks
- TypeScript is strictly enforced for type safety
