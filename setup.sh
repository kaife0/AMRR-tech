#!/bin/bash

# AMRR Tech Item Manager - Quick Setup and Test Script

echo "🚀 AMRR Tech Item Manager Setup & Test"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    echo "VITE_WEB3FORMS_ACCESS_KEY=536c9794-b157-41d4-880b-27cc4da87b2f" > .env.local
    echo "✅ .env.local created with Web3Forms access key"
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo ""
echo "📁 Ensuring directories exist..."
mkdir -p server/data
mkdir -p server/uploads
echo "✅ Directories created"

echo ""
echo "🎉 Setup complete! Ready to run the application."
echo ""
echo "To start the application:"
echo "1. Backend:  cd server && npx nodemon src/index.ts"
echo "2. Frontend: npm run dev"
echo ""
echo "Features included:"
echo "✅ Add/View/Delete items"
echo "✅ Image upload and serving"
echo "✅ Web3Forms enquiry system"
echo "✅ Responsive design"
echo "✅ Fallback demo data"
echo ""
echo "Access the app at: http://localhost:5173"
