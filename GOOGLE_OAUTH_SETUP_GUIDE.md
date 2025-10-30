# 🔐 Google OAuth Setup Guide for Saathi

## 📋 Complete Setup Checklist

### 1. Google Cloud Console Configuration

#### Step 1: OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services > OAuth consent screen**
4. Configure:
   - **Application name**: Saathi Mind Connect
   - **Authorized domains**: 
     - `saathiya-mind-connect.vercel.app`
   - **Application homepage link**: `https://saathiya-mind-connect.vercel.app`
   - **Application privacy policy link**: `https://saathiya-mind-connect.vercel.app/privacy-policy.html`

#### Step 2: Create OAuth Client ID
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. **Application type**: Web application
4. **Name**: Saathi Production Client
5. **Authorized JavaScript origins**:
   ```
   https://saathiya-mind-connect.vercel.app
   http://localhost:8080
   http://localhost:3000
   ```
6. **Authorized redirect URIs**:
   ```
   https://saathiya-mind-connect.vercel.app/callback
   http://localhost:3001/callback
   http://localhost:3000/callback
   ```

#### Step 3: Copy Credentials
- **Client ID**: Copy this for your environment variables
- **Client Secret**: Copy this for your environment variables (keep secret!)

### 2. Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `saathiya-mind-connect` project
3. Go to **Settings > Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|--------|-------------|
| `GOOGLE_CLIENT_ID` | `your_client_id_here` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `your_client_secret_here` | Production, Preview, Development |
| `JWT_SECRET` | `your_random_32_char_string` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production only |
| `CLIENT_URL` | `https://saathiya-mind-connect.vercel.app` | Production |
| `PRODUCTION_URL` | `https://saathiya-mind-connect.vercel.app` | Production |

### 3. Required Files Check

Verify these files exist in your repository:

```
├── vercel.json                    ✅ (rewrites /callback to /api/callback)
├── api/
│   ├── callback.js               ✅ (handles GET and POST)
│   └── auth/
│       ├── callback.js           ✅ (legacy POST handler)
│       ├── profile.js            ✅ (JWT verification)
│       └── logout.js             ✅ (logout handler)
└── public/
    └── test-oauth.html           ✅ (debug page with data-login_uri="/api/callback")
```

### 4. Deployment Steps

1. **Commit and push** all changes to your GitHub repository
2. **Redeploy** on Vercel (automatic if connected to Git)
3. **Test the endpoints**:
   - Health check: `https://saathiya-mind-connect.vercel.app/api/health`
   - Callback endpoint: `https://saathiya-mind-connect.vercel.app/callback` (should not 404)

### 5. Testing OAuth Flow

#### Production Test (saathiya-mind-connect.vercel.app)
1. Go to: `https://saathiya-mind-connect.vercel.app/test-oauth.html`
2. Click "Sign in with Google"
3. Complete Google OAuth
4. Should receive user info JSON response

#### Local Development Test
1. Start local servers:
   ```powershell
   # Terminal 1 - OAuth server (if using)
   npm run auth:server
   
   # Terminal 2 - Vite dev server  
   npm run dev
   ```
2. Go to: `http://localhost:8080/test-oauth.html`
3. Test Google sign-in (will use local auth server)

### 6. Common Issues & Solutions

#### 404 Error on /callback
**Problem**: `https://saathiya-mind-connect.vercel.app/callback` returns 404

**Solutions**:
1. ✅ **Check `vercel.json` exists** in repo root with rewrites
2. ✅ **Check `api/callback.js` exists** and is properly exported
3. 🔄 **Redeploy** - Environment variables and files may not be updated
4. 🔄 **Check Vercel build logs** for any deployment errors

#### Invalid Client Error
**Problem**: "Error: invalid_client" or "Error: redirect_uri_mismatch"

**Solutions**:
1. ✅ **Verify Google Cloud Console redirect URIs** exactly match:
   - `https://saathiya-mind-connect.vercel.app/callback`
2. ✅ **Verify client ID** matches between code and Google Console
3. ✅ **Check authorized JavaScript origins** include your domain

#### CORS Errors
**Problem**: Cross-origin request blocked

**Solutions**:
1. ✅ **Check `api/callback.js` CORS headers** include your domain
2. ✅ **Verify origin matching** in the allowed origins array

### 7. Debug Commands

Test the API endpoint directly:

```powershell
# Test health endpoint
Invoke-RestMethod -Uri 'https://saathiya-mind-connect.vercel.app/api/health'

# Test callback endpoint exists (should return 405 Method Not Allowed, not 404)
Invoke-RestMethod -Uri 'https://saathiya-mind-connect.vercel.app/callback' -Method Get
```

### 8. Security Notes

- ⚠️ **Never commit** `GOOGLE_CLIENT_SECRET` or `JWT_SECRET` to Git
- 🔒 **Use Vercel environment variables** for all secrets
- 🔄 **Rotate secrets** if accidentally exposed
- 🧪 **Remove test pages** (`test-oauth.html`) before production launch

---

## 🎯 Quick Fix Checklist

If you're getting 404 errors:

1. [ ] Verify `vercel.json` and `api/callback.js` are committed to Git
2. [ ] Check Vercel environment variables are set
3. [ ] Redeploy the Vercel project
4. [ ] Test `https://saathiya-mind-connect.vercel.app/api/health` (should work)
5. [ ] Test `https://saathiya-mind-connect.vercel.app/callback` (should not be 404)
6. [ ] Update Google Cloud Console redirect URIs if needed

## 📞 Support

If you continue having issues:
1. Check Vercel deployment logs
2. Test the API endpoints directly  
3. Verify Google Cloud Console settings match exactly
4. Ensure all environment variables are set in Vercel