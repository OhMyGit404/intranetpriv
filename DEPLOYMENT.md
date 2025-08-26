# 🚀 Production Deployment Guide

## 🌐 Domain: intranetinstitute.co.ke

### 📋 Prerequisites
- Node.js 16+ installed
- A Cloudinary account (free tier: 25GB storage)
- A hosting provider (recommended: Railway, Render, or Vercel)

---

## 🔥 Step 1: Set Up Firebase (Free Tier)

### 1.1 Create Firebase Account
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `intranet-institute`
4. Complete setup

### 1.2 Get API Credentials
1. In Firebase console, click gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Copy these values:
   - **API Key**
   - **Auth Domain**
   - **Project ID**
   - **Storage Bucket**
   - **Messaging Sender ID**
   - **App ID**

### 1.3 Create Environment File
```bash
# Copy the example file
cp env.example .env

# Edit .env with your Firebase credentials
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
PORT=3000
NODE_ENV=production
```

---

## 🚀 Step 2: Choose Hosting Provider

### Option A: Railway (Recommended - Free Tier)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your repository
5. Add environment variables from `.env`
6. Deploy!

### Option B: Render (Free Tier)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Add environment variables
6. Deploy!

### Option C: Vercel (Free Tier)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Add environment variables
5. Deploy!

---

## 🔧 Step 3: Local Testing

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Set Environment Variables
```bash
# Copy and edit .env file
cp env.example .env
# Edit .env with your Cloudinary credentials
```

### 3.3 Test Locally
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### 3.4 Test Image Upload
1. Open `http://localhost:3000/admin/dashboard.html`
2. Login with demo credentials
3. Try uploading an image in the blog post form
4. Check Cloudinary dashboard for uploaded images

---

## 🌍 Step 4: Domain Configuration

### 4.1 DNS Settings
Add these records to your domain provider:

```
Type: A
Name: @
Value: [Your hosting provider's IP]

Type: CNAME
Name: www
Value: intranetinstitute.co.ke
```

### 4.2 SSL Certificate
- Most hosting providers auto-generate SSL
- If not, use Let's Encrypt (free)

---

## 📱 Step 5: Production Features

### 5.1 Image Optimization
- ✅ Automatic resizing (800x600)
- ✅ Quality optimization
- ✅ Format conversion (WebP/AVIF)
- ✅ CDN delivery

### 5.2 Security Features
- ✅ File type validation
- ✅ File size limits (5MB)
- ✅ CORS protection
- ✅ Error handling

### 5.3 Performance
- ✅ Cloudinary CDN
- ✅ Automatic image transformations
- ✅ Lazy loading ready

---

## 🔍 Step 6: Monitoring & Maintenance

### 6.1 Health Check
```bash
curl https://intranetinstitute.co.ke/api/health
```

### 6.2 Cloudinary Dashboard
- Monitor storage usage
- View upload statistics
- Manage transformations

### 6.3 Logs
- Check hosting provider logs
- Monitor API usage
- Track errors

---

## 💰 Cost Breakdown (Free Tier)

### Firebase Storage
- **Storage**: 5GB free
- **Bandwidth**: 1GB/day free
- **Database**: 1GB free
- **Perfect for**: Small to medium websites

### Hosting
- **Railway**: $5/month after free tier
- **Render**: $7/month after free tier
- **Vercel**: $20/month after free tier

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Image Upload Fails
```bash
# Check server logs
npm run dev

# Verify Cloudinary credentials
curl http://localhost:3000/api/health
```

#### 2. CORS Errors
- Ensure CORS middleware is enabled
- Check domain configuration

#### 3. File Size Issues
- Verify 5MB limit in multer config
- Check client-side validation

---

## 📞 Support

### Firebase Support
- [Documentation](https://firebase.google.com/docs)
- [Community Forum](https://firebase.google.com/community)

### Hosting Support
- Check your provider's documentation
- Most offer 24/7 support

---

## 🎯 Next Steps

### Phase 2 Enhancements
1. **User Authentication**: JWT tokens
2. **Database**: MongoDB/PostgreSQL
3. **File Management**: Bulk uploads
4. **Image Editor**: Cropping, filters
5. **Analytics**: Upload statistics

### Phase 3 Features
1. **Multi-tenant**: Multiple organizations
2. **API**: Public endpoints
3. **Webhooks**: Real-time notifications
4. **Backup**: Automated backups

---

## ✅ Checklist

- [ ] Firebase account created
- [ ] Environment variables configured
- [ ] Local testing successful
- [ ] Hosting provider selected
- [ ] Repository connected
- [ ] Environment variables added to hosting
- [ ] Deployment successful
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Image upload tested
- [ ] Health check endpoint working

---

**🎉 Congratulations! Your production-ready Firebase image storage system is deployed!**
