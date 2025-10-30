# 🚀 Urgent Deployment Fix for 404 Callback Error

## ❌ Problem Identified
The `/callback` endpoint was returning the React app HTML instead of the serverless function. This is because:
1. Vercel wasn't properly recognizing the `api/callback.js` as a serverless function
2. The ES module format was causing issues with Vercel's Node runtime
3. Missing explicit function configuration in `vercel.json`

## ✅ Changes Made

### 1. New Serverless Function Structure
```
api/
├── oauth-callback.js    # NEW: Proper CommonJS serverless function
├── test.js             # NEW: Simple test endpoint
├── callback.js         # OLD: Keep as backup but not used
└── package.json        # UPDATED: Removed "type": "module"
```

### 2. Updated Files
- **`api/oauth-callback.js`**: New properly formatted Vercel serverless function
- **`api/package.json`**: Removed ES module type to use CommonJS
- **`vercel.json`**: Added explicit function runtime configuration
- **`api/test.js`**: Simple test endpoint to verify serverless functions work

### 3. New Vercel Configuration
```json
{
  "functions": {
    "api/oauth-callback.js": { "runtime": "@vercel/node@20" },
    "api/test.js": { "runtime": "@vercel/node@20" }
  },
  "rewrites": [
    { "source": "/callback", "destination": "/api/oauth-callback" },
    { "source": "/test", "destination": "/api/test" }
  ]
}
```

## 🔧 Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix: Recreate callback as proper Vercel serverless function"
git push origin main
```

### Step 2: Wait for Vercel Auto-Deploy
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Watch for the deployment to complete
- Check the deployment logs for any errors

### Step 3: Test the Fixed Endpoints

After deployment, test these URLs:

**Test Endpoint** (should work immediately):
```
https://saathiya-mind-connect.vercel.app/test
```

**Callback Endpoint** (should return 405 Method Not Allowed, not 404):
```
https://saathiya-mind-connect.vercel.app/callback
```

**Direct API Test**:
```
https://saathiya-mind-connect.vercel.app/api/oauth-callback
```

## 🧪 PowerShell Test Commands

Run these after deployment:

```powershell
# Test the new test endpoint
Invoke-RestMethod -Uri 'https://saathiya-mind-connect.vercel.app/test'

# Test callback endpoint (should return 405, not 404)
try {
    Invoke-RestMethod -Uri 'https://saathiya-mind-connect.vercel.app/callback' -Method Get
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)" 
}

# Test direct API endpoint
try {
    Invoke-RestMethod -Uri 'https://saathiya-mind-connect.vercel.app/api/oauth-callback' -Method Get
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
}
```

## 🔍 Expected Results After Fix

### ✅ Success Indicators
- `/test` returns JSON with message "Test API function working"
- `/callback` returns 405 Method Not Allowed (not 404)
- `/api/oauth-callback` returns 405 Method Not Allowed (not 404)
- Health endpoint still works: `/api/health`

### 🔧 If Still Getting 404
1. Check Vercel deployment logs for errors
2. Verify `api/oauth-callback.js` was deployed
3. Check function runtime configuration
4. Ensure `vercel.json` was deployed with the project

## 📋 Google Cloud Console Settings

Once the callback is working, set these **exact** redirect URIs:

```
Authorized JavaScript origins:
https://saathiya-mind-connect.vercel.app

Authorized redirect URIs:
https://saathiya-mind-connect.vercel.app/callback
```

## 🔄 Next Steps After Deployment

1. **Verify endpoints work** using the test commands above
2. **Set Google Cloud Console** redirect URIs to the working callback
3. **Add Vercel environment variables**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET` 
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. **Test OAuth flow** with `https://saathiya-mind-connect.vercel.app/test-oauth.html`

## 🆘 Emergency Contact

If you're still getting 404 after deployment:
1. Share the Vercel deployment logs
2. Run the PowerShell test commands and share results
3. Check if the `api/` folder was properly deployed