# 🚀 Vercel Deployment Guide - Firebase Auth

## ✅ Pre-Deployment Checklist

Before deploying to Vercel, make sure:

- [x] Firebase configuration is correct in `src/lib/firebase.ts`
- [x] All routes are defined in `src/App.tsx`
- [x] `vercel.json` is configured for SPA routing
- [x] Environment variables are ready (if needed)

## 📋 Step-by-Step Deployment

### 1. Build the Project Locally (Optional Test)

```bash
npm run build
```

This ensures there are no build errors before deploying.

### 2. Deploy to Vercel

```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod
```

**Or use the Vercel CLI interactive mode:**

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **Yes** (if you have one) or **No**
- Project name: `saathiya-mind-connect`
- Directory: `./` (current directory)
- Build settings? **Yes**
- Build command: `npm run build`
- Output directory: `dist`
- Deploy? **Yes**

### 3. Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `DamT0wn/saathiya-mind-connect`
4. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**

## 🔥 Firebase Console Configuration

After deployment, update Firebase settings:

### 1. Add Vercel Domain to Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **Saathi** (saathi-96ddc)
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Vercel URL: `saathiya-mind-connect.vercel.app`
6. If you have a custom domain, add that too

### 2. Update OAuth Redirect URIs (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (saathi-96ddc)
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **"Authorized redirect URIs"**, add:
   - `https://saathiya-mind-connect.vercel.app`
   - `https://saathiya-mind-connect.vercel.app/__/auth/handler`
   - Your custom domain (if any)
6. Click **"Save"**

### 3. Verify Email Link Settings

The email link URLs are already configured in `src/lib/firebase.ts`:

```typescript
const actionCodeSettings = {
  url: process.env.NODE_ENV === 'production' 
    ? 'https://saathiya-mind-connect.vercel.app/finishSignUp'
    : 'http://localhost:8080/finishSignUp',
  handleCodeInApp: true,
};
```

This will automatically use the correct URL in production! ✅

## 🌐 Environment Variables (If Needed)

If you want to use environment variables for Firebase config:

### In Vercel Dashboard:

1. Go to your project settings
2. Click **"Environment Variables"**
3. Add the following:

```
VITE_FIREBASE_API_KEY=AIzaSyBU8lgQ8qW9cLx1_eK2RvTNY0VCZQOoddI
VITE_FIREBASE_AUTH_DOMAIN=saathi-96ddc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=saathi-96ddc
VITE_FIREBASE_STORAGE_BUCKET=saathi-96ddc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=311646503359
VITE_FIREBASE_APP_ID=1:311646503359:web:8f0bf9994c7a9fdf4de10a
VITE_FIREBASE_MEASUREMENT_ID=G-10HYMXH45S
```

**Note:** Since your Firebase config is already in the code, this is optional.

## 🧪 Testing Production Deployment

After deployment:

### 1. Test All Routes

Visit these URLs on your Vercel domain:

- ✅ `https://saathiya-mind-connect.vercel.app/`
- ✅ `https://saathiya-mind-connect.vercel.app/login`
- ✅ `https://saathiya-mind-connect.vercel.app/finishSignUp`
- ✅ `https://saathiya-mind-connect.vercel.app/ai-chat`
- ✅ `https://saathiya-mind-connect.vercel.app/crisis-support`
- ✅ `https://saathiya-mind-connect.vercel.app/mood-dashboard`
- ✅ `https://saathiya-mind-connect.vercel.app/resources`

### 2. Test Authentication

#### Email/Password Sign-In:
1. Go to `/login`
2. Try signing up with email/password
3. Verify it works

#### Google Sign-In:
1. Click "Sign in with Google"
2. Complete OAuth flow
3. Should redirect back to your app

#### Email Link (Magic Link):
1. Click "Email Link" tab
2. Enter your email
3. Check your inbox
4. Click the magic link
5. Should open `/finishSignUp` and sign you in

### 3. Check Browser Console

Open Developer Tools (F12) and check for:
- No JavaScript errors
- No CORS errors
- Successful API calls

## 🔍 Common Deployment Issues & Fixes

### Issue 1: "Unauthorized domain" error

**Fix:**
- Add your Vercel domain to Firebase Console → Authentication → Authorized domains

### Issue 2: Google OAuth not working

**Fix:**
- Update redirect URIs in Google Cloud Console
- Make sure OAuth consent screen is configured

### Issue 3: Email link 404 error

**Fix:**
- Already configured in `vercel.json` ✅
- The `/finishSignUp` route is set to serve `index.html`

### Issue 4: SPA routing issues (404 on refresh)

**Fix:**
- Already configured in `vercel.json` ✅
- All routes fallback to `index.html`

### Issue 5: Build fails on Vercel

**Fix:**
```bash
# Test build locally first
npm run build

# Check for errors
# Fix any TypeScript or build errors
# Then redeploy
```

## 📊 Deployment Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm <deployment-url>

# Link local project to Vercel project
vercel link

# Pull environment variables
vercel env pull
```

## 🔄 Continuous Deployment (GitHub Integration)

For automatic deployments on every push:

1. Go to Vercel Dashboard
2. Connect your GitHub repository
3. Enable automatic deployments
4. Every push to `main` branch will auto-deploy!

**Benefits:**
- Automatic deployments on git push
- Preview deployments for pull requests
- Rollback to previous versions easily

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] All routes are accessible
- [ ] Email/Password sign-in works
- [ ] Google OAuth works
- [ ] Email link (magic link) works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)

## 🌟 Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `saathi.yourdomain.com`)
4. Follow Vercel's DNS configuration instructions
5. Update Firebase authorized domains
6. Update Google OAuth redirect URIs

## 📈 Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Compression (Gzip/Brotli)
- ✅ Image optimization
- ✅ Edge caching

Your app will be fast worldwide! 🚀

## 🔐 Security Headers

Already configured in `vercel.json`:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block

## 🎉 You're Ready!

Your app is now configured for Vercel deployment. Just run:

```bash
vercel --prod
```

And your Firebase authentication will work perfectly in production! 🚀

## 📞 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Firebase Documentation: https://firebase.google.com/docs
- Check deployment logs: `vercel logs`
- Vercel Support: https://vercel.com/support
