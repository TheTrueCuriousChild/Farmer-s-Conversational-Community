#!/bin/bash

# KrishiSeva Frontend Development Setup Script

echo "🌱 Setting up KrishiSeva Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if backend is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:5000/test > /dev/null; then
    echo "✅ Backend server is running on port 5000"
else
    echo "⚠️  Backend server is not running on port 5000"
    echo "   Please start the backend server first:"
    echo "   cd ../server/backend && npm start"
    echo ""
    echo "   The frontend will still work but with limited functionality."
fi

# Start development server
echo "🚀 Starting development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend should be running at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
