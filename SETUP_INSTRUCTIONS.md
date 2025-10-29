# Setup Instructions for Saathiya Mind Connect

## ✅ Current Status
- **Vite dev server**: ✅ Running (automatically on localhost:8081)
- **Client-side Gemini integration**: ✅ Implemented
- **API key**: ⚠️ Needs Google Cloud API enabling

## 🔑 Enable Gemini API (Required)

Your API key is present but the Gemini API is not enabled in your Google Cloud project. Follow these steps:

### Step 1: Visit Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure you're logged in with the same Google account used to create the API key

### Step 2: Enable the API
1. Click **"Enable"** button on the Generative Language API page
2. Wait for the API to be enabled (usually takes 1-2 minutes)

### Step 3: Test the Chatbot
1. Your dev server is already running at: http://localhost:8081
2. Open that URL in your browser
3. Try sending a message in the chat interface
4. You should now get AI responses from Gemini!

## 🚀 How to Run (After API is enabled)

### Start Development Server
```powershell
cd 'd:\tute dude\Assigment 4\New folder\New folder\saathiya-mind-connect'
npm run dev
```
The app will be available at http://localhost:8080 (or 8081 if 8080 is in use)

### Your API Key
- ✅ Located in `.env.local`
- ✅ Properly configured as `VITE_GEMINI_API_KEY`
- ✅ Accessible to the client-side code

## 🔧 What I Fixed

1. **Removed separate dev server** - No more `npm run dev:server` needed
2. **Direct client-side integration** - Gemini API called directly from browser
3. **Simplified architecture** - No more proxy/middleware complexity
4. **Better error handling** - Clear messages when API isn't enabled

## 🛡️ Security Note
- Your API key is in `.env.local` (not committed to git)
- In production, consider server-side calls to hide the API key
- For development/demo purposes, client-side is fine

## 📝 Test Messages to Try
Once the API is enabled, test with:
- "I'm feeling stressed about my exams"
- "I feel lonely and isolated" 
- "I'm having trouble sleeping"
- "Can you help me with anxiety?"

The AI should respond as Saathiya, your empathetic Indian companion!