# KGI AI Chatbot & Voicebot - Deployment Guide

## 🎯 Overview
- **Name**: Koshys Group of Institutions AI Assistant
- **Platforms**: Website Widget + Voice/IVR Phone System
- **Data Storage**: Google Sheets (Name, Phone, User Type, Course)
- **Tech Stack**: Vercel + Next.js + OpenAI + Google Sheets + Vapi.ai

---

## 🚀 Step-by-Step Deployment

### Step 1: GitHub Repository
```bash
# Push to GitHub
cd kgi-chatbot
git init
git add .
git commit -m "KGI AI Chatbot & Voicebot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kgi-chatbot.git
git push -u origin main
```

### Step 2: Vercel Deployment
1. Go to https://vercel.com
2. Import from GitHub: Select kgi-chatbot repository
3. Framework: Next.js
4. Environment Variables (add these):
   - `OPENAI_API_KEY` = your OpenAI key (get free tier at platform.openai.com)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = your service account email
   - `GOOGLE_PRIVATE_KEY` = your private key (with newlines replaced by \n)
   - `GOOGLE_SHEET_ID` = your Google Sheet ID
   - `VAPI_API_KEY` = your Vapi.ai key (get free at vapi.ai)
5. Deploy

### Step 3: Google Sheets Setup
1. Create new Google Sheet: https://sheet.new
2. Add headers in Row 1: Timestamp, Name, Type, Phone, Course, Inquiry, Status
3. Share with service account email (edit access)
4. Copy Sheet ID from URL (between /d/ and /edit)

### Step 4: Google Cloud Setup (for Sheets API)
1. Go to https://console.cloud.google.com
2. Create project → Enable Google Sheets API
3. Create Service Account → Download JSON key
4. Copy credentials to Vercel env vars

### Step 5: Website Widget Integration
In your kgi.edu.in HTML, add before `</body>`:
```html
<script src="https://your-vercel-app.vercel.app/widget.js"></script>
```
Or embed the ChatWidget component directly in Next.js

### Step 6: Voice/IVR Setup (Vapi.ai)
1. Go to https://dashboard.vapi.ai
2. Create Assistant with:
   - Model: GPT-3.5 Turbo
   - Endpoint: https://your-vercel-app.vercel.app/api/voice
3. Get virtual phone number
4. Point to 808 866 0000 or use new virtual number

---

## 📋 Features Implemented

### ✅ Website Chat Widget
- AI-powered chat with KGI knowledge base
- Automatic user data collection (Name, Phone, Type, Course)
- Quick action buttons (Call, Apply)
- Form triggers on admission queries

### ✅ Voice/IVR System
- Phone call support via Vapi.ai
- Voice responses optimized for speech
- Handles common queries

### ✅ Data Collection
- Saves to Google Sheets automatically
- Fields: Timestamp, Name, User Type, Phone, Course, Inquiry, Status
- Auto-triggers after admission inquiries

### ✅ KGI Information Loaded
- All courses (UG, PG, Nursing, Allied Health, Hotel Management)
- Campus facilities & location
- Placement partners
- Contact details
- FAQs

---

## 🔧 Environment Variables Required

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| OPENAI_API_KEY | AI Chat | platform.openai.com |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | Sheets Access | Google Cloud Console |
| GOOGLE_PRIVATE_KEY | Sheets Key | Service Account JSON |
| GOOGLE_SHEET_ID | Database | Google Sheet URL |
| VAPI_API_KEY | Voice Calls | vapi.ai |
| OPENAI_MODEL | gpt-3.5-turbo | Default |

---

## 💰 Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth/month |
| OpenAI | $5 credit (GPT-3.5) |
| Google Sheets | Unlimited |
| Vapi.ai | $5 credit + test minutes |

---

## 📞 Support
- Phone: 808 866 0000
- Email: info@kgi.edu.in
- Website: kgi.edu.in