#!/bin/bash

# Finance Visualizer Deployment Script
# This script helps you deploy your app to Vercel with MongoDB Atlas

echo "🚀 Finance Visualizer Deployment Script"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please create it with your MongoDB URI:"
    echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_tracker?retryWrites=true&w=majority"
    echo ""
    echo "📝 Create .env.local now? (y/n)"
    read -r create_env
    if [ "$create_env" = "y" ]; then
        echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_tracker?retryWrites=true&w=majority" > .env.local
        echo "✅ Created .env.local (please update with your actual MongoDB URI)"
    fi
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "📝 Please follow the prompts to configure your deployment:"
echo "   - Link to existing project or create new"
echo "   - Set environment variables (MONGODB_URI)"
echo ""

vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📖 Check DEPLOYMENT.md for detailed instructions and troubleshooting."
echo "🔗 Your app should be live at the URL provided above." 