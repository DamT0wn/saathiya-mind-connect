# 🚀 Vercel Deployment Guide for Saathi OAuth

## Current OAuth Configuration Status ✅

Your Google Cloud Console is configured for:
- **Production URL**: `https://saathiya-mind-connect.vercel.app`
- **Callback URL**: `https://saathiya-mind-connect.vercel.app/callback`

## Step 1: Add Local Development URLs to Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials:

### Update your OAuth 2.0 Client ID:

**Authorized JavaScript origins** - Add ALL these URLs:
```
http://localhost:8080
http://localhost:8081  
http://localhost:8082
http://localhost:3001
https://saathiya-mind-connect.vercel.app
```

**Authorized redirect URIs** - Keep as:
```
https://saathiya-mind-connect.vercel.app/callback
```

## Step 2: Set Environment Variables in Vercel

In your Vercel dashboard, go to Project Settings > Environment Variables:

### Add these variables:
```
GOOGLE_CLIENT_ID=1071099308535-2qtfl9qa0168of5mvoo2hmec92so8hj4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
JWT_SECRET=your_production_jwt_secret_here_make_it_different_from_dev
NODE_ENV=production
PRODUCTION_URL=https://saathiya-mind-connect.vercel.app
```

## Step 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect Vercel to your GitHub repository
3. Vercel will auto-deploy on every push

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 4: Test Your Deployment

### Production URLs:
- **Frontend**: `https://saathiya-mind-connect.vercel.app`
- **OAuth Endpoints**: `https://saathiya-mind-connect.vercel.app/auth/*`
- **Health Check**: `https://saathiya-mind-connect.vercel.app/health`

### Local Development URLs:
- **Frontend**: `http://localhost:8080`
- **OAuth Server**: `http://localhost:3001`
- **Test Page**: `http://localhost:8080/test-oauth.html`

## Step 5: Verify OAuth Flow

### For Local Development:
1. Start both servers: `npm run dev` and `npm run auth:server`
2. Open: `http://localhost:8080`
3. Click "Sign In" and test Google OAuth

### For Production:
1. Open: `https://saathiya-mind-connect.vercel.app`
2. Click "Sign In" and test Google OAuth
3. Verify authentication works correctly

## File Structure for Vercel:

```
├── vercel.json           # Vercel configuration
├── server.js            # OAuth backend (deployed as serverless function)
├── src/                 # React frontend
├── public/              # Static assets
└── .env                 # Local environment variables (not deployed)
```

## Security Notes:

1. **Environment Variables**: Never commit `.env` to GitHub
2. **JWT Secrets**: Use different secrets for development and production
3. **Google Client Secret**: Keep this secure in Vercel environment variables
4. **HTTPS Only**: Production OAuth only works with HTTPS

## Troubleshooting:

### Common Issues:
- **CORS errors**: Check that all origins are added to Google Cloud Console
- **Redirect URI mismatch**: Ensure callback URL matches exactly
- **Environment variables**: Verify all required env vars are set in Vercel
- **Function timeout**: OAuth should complete quickly, but check Vercel function logs

Your OAuth system is now configured for both local development and production deployment! 🎉