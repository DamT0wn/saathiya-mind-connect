# 🔧 Troubleshooting 404 Errors - Quick Fix Guide

## Common 404 Error Scenarios

### 1. **Development Server Not Running**

The most common cause! Make sure your dev server is running:

```bash
# Stop any running servers first (Ctrl+C)
# Then start the Vite dev server:
npm run dev
```

The server should start at: `http://localhost:8080`

**Not working?** Try:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

### 2. **Wrong URL**

✅ **Correct URLs:**
- Development: `http://localhost:8080`
- Production: `https://saathiya-mind-connect.vercel.app`

❌ **Wrong URLs:**
- `http://localhost:3000` (wrong port)
- `http://localhost:5173` (default Vite port, but we use 8080)
- Using Vercel dev URL when not deployed

---

### 3. **Email Link 404 Error**

If you're getting 404 when clicking email magic link:

**Problem:** The email link might be pointing to wrong URL

**Solution:** Update Firebase action code settings

Check `src/lib/firebase.ts`:
```typescript
const actionCodeSettings = {
  url: process.env.NODE_ENV === 'production' 
    ? 'https://saathiya-mind-connect.vercel.app/finishSignUp'
    : 'http://localhost:8080/finishSignUp',  // ← Make sure this matches your dev port
  handleCodeInApp: true,
};
```

---

### 4. **Vercel Deployment 404**

If getting 404 on Vercel after deployment:

**Solution 1: Check vercel.json**
Make sure `vercel.json` has proper rewrites:

```json
{
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Solution 2: Redeploy**
```bash
vercel --prod
```

---

### 5. **OAuth Callback 404**

If Google sign-in gives 404 on callback:

**Check Firebase Console:**
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add:
   - `localhost`
   - `saathiya-mind-connect.vercel.app`

**Check Google Cloud Console:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Find your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   - `http://localhost:8080` (for dev)
   - `https://saathiya-mind-connect.vercel.app` (for prod)
   - `https://saathiya-mind-connect.vercel.app/__/auth/handler` (Firebase auth handler)

---

## 🚀 Quick Start Guide

### For Local Development:

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser to:
http://localhost:8080
```

### For Production (Vercel):

```bash
# 1. Build the project
npm run build

# 2. Deploy to Vercel
vercel --prod
```

---

## 🔍 Debugging Steps

### Step 1: Check Dev Server Status

```bash
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.x.x:8080/
```

### Step 2: Test Routes Manually

Open these URLs in your browser:
- ✅ `http://localhost:8080/` (Home page)
- ✅ `http://localhost:8080/login` (Login page)
- ✅ `http://localhost:8080/finishSignUp` (Email link completion)
- ✅ `http://localhost:8080/ai-chat` (AI Chat page)

### Step 3: Check Browser Console

1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Step 4: Verify Firebase Config

Make sure Firebase is initialized properly:

```bash
# Check if firebase is installed
npm list firebase

# Should show: firebase@12.5.0
```

---

## 🐛 Common Error Messages & Fixes

### "Cannot GET /finishSignUp"

**Problem:** Route not configured or server not running

**Fix:**
1. Make sure dev server is running: `npm run dev`
2. Check that route exists in `src/App.tsx`
3. Verify React Router is set up correctly

### "ERR_CONNECTION_REFUSED"

**Problem:** Development server is not running

**Fix:**
```bash
# Kill any process on port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Then restart server
npm run dev
```

### "This site can't be reached"

**Problem:** Wrong URL or server crashed

**Fix:**
1. Check terminal for error messages
2. Restart dev server
3. Try different port if 8080 is busy:
```bash
# Edit vite.config.ts, change port to 3000
# Then run: npm run dev
```

---

## 📧 Email Link Specific Issues

### Email link opens but shows 404:

**Problem:** URL mismatch in Firebase settings

**Fix:**
1. Update `src/lib/firebase.ts` actionCodeSettings
2. Make sure URL matches your actual dev server
3. Restart dev server after changes

### Email not received:

**Problem:** Email link not enabled in Firebase

**Fix:**
1. Go to Firebase Console
2. Authentication → Sign-in method
3. Enable "Email link (passwordless sign-in)"

---

## 🔄 Still Not Working?

### Complete Reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear everything
rm -rf node_modules
rm -rf dist
rm package-lock.json

# 3. Fresh install
npm install

# 4. Clear browser cache
# Ctrl+Shift+Delete → Clear browsing data

# 5. Restart server
npm run dev

# 6. Open in incognito mode
# To rule out browser cache issues
```

---

## 📞 Need More Help?

### Check These Files:
- `src/App.tsx` - Routes configuration
- `vite.config.ts` - Dev server config
- `vercel.json` - Production routing
- `src/lib/firebase.ts` - Firebase & redirect URLs

### Verify These Settings:
- Firebase Console → Authentication → Authorized domains
- Google Cloud Console → OAuth credentials
- Browser console for JavaScript errors
- Network tab for failed API calls

---

## ✅ Success Checklist

Before testing, make sure:
- [ ] `npm install` completed without errors
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser is at `http://localhost:8080`
- [ ] Firebase authentication is enabled
- [ ] Authorized domains are configured
- [ ] No JavaScript errors in console

---

## 🎯 Quick Solutions Summary

| Issue | Quick Fix |
|-------|-----------|
| 404 on home page | Run `npm run dev`, open `http://localhost:8080` |
| Email link 404 | Update `actionCodeSettings` URL in `firebase.ts` |
| OAuth callback 404 | Add redirect URIs in Google Console |
| Route not found | Check `src/App.tsx` for route definition |
| Server not starting | Clear `node_modules`, run `npm install` |
| Port already in use | Change port in `vite.config.ts` |

---

**Remember:** Most 404 errors are because:
1. Development server isn't running
2. Wrong URL (use `localhost:8080`, not `localhost:3000`)
3. Missing route configuration

Start with `npm run dev` and make sure the server is running! 🚀
