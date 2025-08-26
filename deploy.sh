#!/bin/bash

echo "🚀 Intranet Institute - Production Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}📝 Please copy env.example to .env and configure your Firebase credentials${NC}"
    echo -e "${BLUE}💡 Run: cp env.example .env${NC}"
    exit 1
fi

# Check if Firebase credentials are configured
if grep -q "your_api_key" .env; then
    echo -e "${RED}❌ Please configure your Firebase credentials in .env file${NC}"
    echo -e "${YELLOW}💡 Edit .env and replace placeholder values with your actual credentials${NC}"
    echo -e "${BLUE}📖 See FIREBASE_SETUP.md for detailed instructions${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment configured${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Test the server
echo -e "${BLUE}🧪 Testing server configuration...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health 2>/dev/null)
if [[ $HEALTH_RESPONSE == *"firebase"* ]]; then
    echo -e "${GREEN}✅ Server test successful${NC}"
    echo -e "${GREEN}✅ Firebase configuration working${NC}"
else
    echo -e "${RED}❌ Server test failed${NC}"
    echo -e "${YELLOW}💡 Check your Firebase credentials and server configuration${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop test server
kill $SERVER_PID 2>/dev/null

echo ""
echo -e "${GREEN}🎉 Your project is ready for production deployment!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. 🔑 Push to GitHub: git push origin main"
echo "2. 🚀 Deploy to hosting (Railway/Render/Vercel)"
echo "3. 🌐 Configure domain: intranetinstitute.co.ke"
echo "4. 🎯 Go live!"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "• FIREBASE_SETUP.md - Complete Firebase setup guide"
echo "• DEPLOYMENT.md - Production deployment guide"
echo "• README.md - Project overview and features"
echo ""
echo -e "${GREEN}🔥 Firebase Storage: Professional quality at zero cost!${NC}"
