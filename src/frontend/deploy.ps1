# DOBI Frontend Deploy Script for Vercel (PowerShell)

Write-Host "🚀 Starting DOBI Frontend Deploy Process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: index.html not found. Please run this script from the frontend directory." -ForegroundColor Red
    exit 1
}

# Check if git is available
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ Error: Git is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check if vercel CLI is available
$vercelAvailable = $false
try {
    vercel --version | Out-Null
    $vercelAvailable = $true
} catch {
    Write-Host "⚠️  Warning: Vercel CLI not found. You can still deploy via the Vercel dashboard." -ForegroundColor Yellow
    Write-Host "   Install with: npm i -g vercel" -ForegroundColor Yellow
}

Write-Host "✅ Pre-deploy checks passed" -ForegroundColor Green

# Add all files to git
Write-Host "📁 Adding files to git..." -ForegroundColor Blue
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Blue
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy DOBI frontend to Vercel - $timestamp"

# Push to remote
Write-Host "📤 Pushing to remote repository..." -ForegroundColor Blue
git push origin main

Write-Host "✅ Git push completed" -ForegroundColor Green

# Deploy with Vercel CLI if available
if ($vercelAvailable) {
    Write-Host "🚀 Deploying with Vercel CLI..." -ForegroundColor Blue
    vercel --prod
    Write-Host "✅ Deploy completed!" -ForegroundColor Green
} else {
    Write-Host "📋 Manual deploy required:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   2. Click 'New Project'" -ForegroundColor White
    Write-Host "   3. Import your GitHub repository" -ForegroundColor White
    Write-Host "   4. Set root directory to: ./" -ForegroundColor White
    Write-Host "   5. Click 'Deploy'" -ForegroundColor White
}

Write-Host "🎉 Deploy process completed!" -ForegroundColor Green
Write-Host "📖 See DEPLOY.md for detailed instructions" -ForegroundColor Cyan
