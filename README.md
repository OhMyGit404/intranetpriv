# 🎓 Intranet Training Institute

A modern, responsive intranet website with an integrated admin panel for content management, featuring production-ready cloud image storage.

## 🌐 Live Demo
- **Website**: [intranetinstitute.co.ke](https://intranetinstitute.co.ke)
- **Admin Panel**: [intranetinstitute.co.ke/admin](https://intranetinstitute.co.ke/admin)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX**: Glassmorphism design with Tailwind CSS
- **Mobile Responsive**: Optimized for all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Section Dividers**: Distinct visual separation between content areas

### 🔧 Admin Panel
- **Content Management**: Blog posts, courses, and gallery management
- **Image Upload**: Drag & drop interface with cloud storage
- **Real-time Updates**: Instant synchronization between admin and frontend
- **User Authentication**: Secure login system

### ☁️ Production Features
- **Firebase Storage Integration**: Google's enterprise-grade image hosting with CDN
- **Image Optimization**: Automatic compression and caching
- **Secure Uploads**: File validation and size limits
- **API Endpoints**: RESTful API for image management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Cloudinary account (free tier)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/intranet-institute.git
cd intranet-institute

# Install dependencies
npm install

# Configure environment
cp env.example .env
# Edit .env with your Cloudinary credentials

# Start development server
npm run dev
```

### Production Deployment
```bash
# Use the startup script
./start.sh

# Or manually
npm start
```

## 📁 Project Structure

```
intranet-institute/
├── admin/                 # Admin panel files
│   ├── dashboard.html    # Main admin interface
│   ├── login.html        # Admin login
│   └── js/
│       └── admin.js      # Admin functionality
├── assets/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Frontend JavaScript
│   └── img/             # Images and media
├── data/                 # JSON data files
├── server.js             # Express server with Cloudinary
├── package.json          # Dependencies and scripts
└── DEPLOYMENT.md         # Production deployment guide
```

## 🔑 Admin Access

**Demo Credentials:**
- **Email**: `DEMO_EMAIL`
- **Password**: `DEMO_PASSWORD`

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript (ES6+)**: Modern JavaScript features
- **Font Awesome**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Multer**: File upload middleware
- **Firebase Storage**: Google's cloud image management

### Development
- **Nodemon**: Auto-restart development server
- **CORS**: Cross-origin resource sharing
- **Environment Variables**: Secure configuration

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Design Features

### Visual Elements
- **Glassmorphism**: Modern glass-like effects
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth hover effects and transitions
- **Typography**: Inter font for readability
- **Icons**: Font Awesome integration

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Green (#10B981)
- **Neutral**: Slate (#64748B)

## 🔒 Security Features

- **File Validation**: Type and size checking
- **CORS Protection**: Cross-origin security
- **Input Sanitization**: XSS prevention
- **Error Handling**: Secure error messages

## 📊 Performance Features

- **Image Optimization**: Automatic compression and resizing
- **CDN Delivery**: Global content distribution
- **Lazy Loading**: Optimized image loading
- **Caching**: Browser and CDN caching

## 🌍 Deployment Options

### Free Tier Hosting
1. **Railway** (Recommended)
2. **Render**
3. **Vercel**
4. **Netlify**

### Domain Configuration
- **Primary**: intranetinstitute.co.ke
- **SSL**: Automatic HTTPS
- **DNS**: A and CNAME records

## 📈 Monitoring & Analytics

### Health Checks
```bash
# Server health
curl https://intranetinstitute.co.ke/api/health

# Image upload test
curl -X POST https://intranetinstitute.co.ke/api/upload-image
```

### Cloudinary Dashboard
- Storage usage monitoring
- Bandwidth statistics
- Image transformation metrics

## 🚨 Troubleshooting

### Common Issues
1. **Image Upload Fails**: Check Cloudinary credentials
2. **CORS Errors**: Verify domain configuration
3. **File Size Issues**: Check 5MB limit
4. **Server Won't Start**: Verify .env configuration

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run dev

# Check server logs
tail -f logs/server.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues
- **Email**: support@intranetinstitute.co.ke

## 🎯 Roadmap

### Phase 2 (Q2 2024)
- [ ] User authentication system
- [ ] Database integration
- [ ] Advanced image editing
- [ ] Analytics dashboard

### Phase 3 (Q3 2024)
- [ ] Multi-tenant support
- [ ] API documentation
- [ ] Webhook system
- [ ] Automated backups

---

**🎉 Built with ❤️ for Intranet Training Institute**

*Empowering education through modern technology*
