# 📧 EmailJS Setup Guide for Contact Form

## 🎯 **What This Does:**
- Sends contact form submissions directly to your email
- No backend email server needed
- Works immediately after setup
- Free tier: 200 emails/month

## 🚀 **Step-by-Step Setup:**

### **1. Create EmailJS Account**
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** or **"Get Started Free"**
3. Create account with your email

### **2. Create Email Service**
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended)
4. Connect your Gmail account
5. **Save the Service ID** (you'll need this)

### **3. Create Email Template**
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

```html
Subject: New Contact Form Submission - {{from_name}}

Hello,

You have received a new contact form submission from your website:

**Name:** {{from_name}}
**Email:** {{from_email}}
**Message:** {{message}}

**Timestamp:** {{timestamp}}

Best regards,
Your Website Contact Form
```

4. **Save the Template ID** (you'll need this)

### **4. Get Your Public Key**
1. Go to **"Account"** → **"API Keys"**
2. Copy your **"Public Key"**

### **5. Update Your Website**
Replace these placeholders in `contact.html`:

```javascript
// Replace "public_key_here" with your actual public key
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY");

// Replace "service_id_here" with your service ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

## 🔧 **Complete Configuration Example:**

```javascript
// Initialize EmailJS
emailjs.init("abc123def456ghi789"); // Your public key

// Send email
emailjs.send('gmail', 'template_abc123', templateParams)
```

## 📱 **Test the Setup:**

1. **Fill out contact form** on your website
2. **Submit the form**
3. **Check your email** - you should receive the submission
4. **Check browser console** for success/error messages

## 🎉 **What Happens After Setup:**

✅ **Contact form submissions** go directly to your email  
✅ **Real-time notifications** when someone contacts you  
✅ **Professional email templates** with all form data  
✅ **No server maintenance** needed  
✅ **Mobile-friendly** email delivery  

## 🆘 **Troubleshooting:**

- **Check browser console** for error messages
- **Verify service ID** and template ID are correct
- **Ensure Gmail account** is properly connected
- **Check spam folder** for test emails

## 💰 **Pricing:**
- **Free Tier**: 200 emails/month
- **Paid Plans**: Start at $15/month for more emails

---

**After setup, your contact form will send real emails to your inbox!** 🚀
