#!/bin/bash

echo "🚀 Starting Intranet Institute Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please copy env.example to .env and configure your Cloudinary credentials"
    echo "💡 Run: cp env.example .env"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check environment variables
if grep -q "your_cloud_name" .env; then
    echo "⚠️  Please configure your Cloudinary credentials in .env file"
    echo "💡 Edit .env and replace placeholder values with your actual credentials"
    exit 1
fi

echo "✅ Environment configured"
echo "🌐 Starting server..."

# Start the server
npm start
