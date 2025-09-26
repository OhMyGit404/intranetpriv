const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `blog-${timestamp}-${req.file.originalname}`;
    const storageRef = ref(storage, `blog-images/${filename}`);

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        uploadedAt: timestamp,
        originalName: req.file.originalname
      }
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    res.json({
      success: true,
      url: downloadURL,
      filename: filename,
      size: req.file.size,
      contentType: req.file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// Delete image endpoint
app.delete('/api/delete-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    const storageRef = ref(storage, `blog-images/${filename}`);
    await deleteObject(storageRef);
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: error.message 
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and message are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        details: 'Please provide a valid email address' 
      });
    }
    
    // Log the contact form submission (for now)
    console.log('📧 New Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('---');
    
    // TODO: Add actual email sending functionality here
    // For now, we'll just log it and return success
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully! We\'ll get back to you soon.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: !!process.env.FIREBASE_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${__dirname}`);
  console.log(`🔥 Firebase configured: ${!!process.env.FIREBASE_API_KEY}`);
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});
