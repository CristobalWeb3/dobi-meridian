#!/bin/bash

# DOBI Frontend Deploy Script for Vercel

echo "🚀 Starting DOBI Frontend Deploy Process..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed or not in PATH."
    exit 1
fi

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Warning: Vercel CLI not found. You can still deploy via the Vercel dashboard."
    echo "   Install with: npm i -g vercel"
fi

echo "✅ Pre-deploy checks passed"

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy DOBI frontend to Vercel - $(date)"

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

echo "✅ Git push completed"

# Deploy with Vercel CLI if available
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying with Vercel CLI..."
    vercel --prod
    echo "✅ Deploy completed!"
else
    echo "📋 Manual deploy required:"
    echo "   1. Go to https://vercel.com/dashboard"
    echo "   2. Click 'New Project'"
    echo "   3. Import your GitHub repository"
    echo "   4. Set root directory to: ./"
    echo "   5. Click 'Deploy'"
fi

echo "🎉 Deploy process completed!"
echo "📖 See DEPLOY.md for detailed instructions"
