#!/bin/bash

# FlipLab Scraper Service Startup Script

echo "🚀 Starting FlipLab Scraper Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm 8+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) and npm $(npm -v) are available"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ .env file created from template"
        echo "📝 Please edit .env file with your configuration before starting the service"
        echo "🔧 You can now run: npm run dev"
        exit 0
    else
        echo "❌ env.example file not found"
        exit 1
    fi
fi

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"

# Start the service
echo "🚀 Starting service..."
echo "📊 Service will be available at: http://localhost:3001"
echo "🔗 Health check: http://localhost:3001/api/health"
echo "📚 API docs: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

npm start
