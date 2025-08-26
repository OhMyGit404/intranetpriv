#!/bin/bash

echo "⚡ Intranet Institute - Quick Setup"
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Setting up your production-ready intranet institute...${NC}"

# 1. Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# 2. Create environment file
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}💡 Please edit .env with your Firebase credentials${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# 3. Make scripts executable
echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
chmod +x start.sh
chmod +x deploy.sh
chmod +x quick-setup.sh

# 4. Test server
echo -e "${YELLOW}🧪 Testing server...${NC}"
if npm run dev &>/dev/null & then
    SERVER_PID=$!
    sleep 3
    
    # Test health endpoint
    if curl -s http://localhost:3000/api/health &>/dev/null; then
        echo -e "${GREEN}✅ Server test successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Server test incomplete (Firebase not configured)${NC}"
    fi
    
    kill $SERVER_PID 2>/dev/null
else
    echo -e "${YELLOW}⚠️  Server test skipped${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Quick setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 What to do next:${NC}"
echo "1. 🔑 Get Firebase credentials (see FIREBASE_SETUP.md)"
echo "2. ⚙️  Edit .env with your Firebase credentials"
echo "3. 🧪 Test: ./deploy.sh"
echo "4. 🚀 Deploy: git push origin main"
echo ""
echo -e "${GREEN}🔥 Your intranet institute is ready to go live!${NC}"
