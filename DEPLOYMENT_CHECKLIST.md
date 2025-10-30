# ✅ Vercel Deployment Checklist

## Pre-Deployment (All Done! ✅)

- [x] Firebase configuration added
- [x] Authentication components created
- [x] Routes configured in App.tsx
- [x] vercel.json configured for SPA routing
- [x] Email link route (/finishSignUp) added
- [x] Security headers configured
- [x] Favicon paths fixed
- [x] Build tested locally

## Deploy to Vercel

### Step 1: Deploy Command

Open a **NEW PowerShell terminal** and run:

```powershell
cd "d:\tute dude\Assigment 4\New folder\New folder\saathiya-mind-connect"
vercel --prod
```

**What happens:**
- Vercel will ask you to login (if not logged in)
- It will build your project
- Deploy to production
- Give you a live URL: `https://saathiya-mind-connect.vercel.app`

### Step 2: Note Your Deployment URL

Copy the URL Vercel gives you. It should be:
```
https://saathiya-mind-connect.vercel.app
```

## Post-Deployment Configuration

### Firebase Console Updates

#### A. Add Authorized Domain
1. Go to: https://console.firebase.google.com/
2. Select: **Saathi** (saathi-96ddc)
3. Navigate: **Authentication** → **Settings** → **Authorized domains**
4. Click: **"Add domain"**
5. Enter: `saathiya-mind-connect.vercel.app`
6. Click: **"Add"**

#### B. Enable Email Link Sign-in (if not already done)
1. Go to: **Authentication** → **Sign-in method**
2. Click: **"Email/Password"**
3. Enable:
   - [x] Email/Password
   - [x] Email link (passwordless sign-in)
4. Add support email if asked
5. Click: **"Save"**

#### C. Enable Google Sign-in (if not already done)
1. Same page: **Sign-in method**
2. Click: **"Google"**
3. Toggle: **Enable**
4. Add support email
5. Click: **"Save"**

### Google Cloud Console Updates

#### Update OAuth Redirect URIs
1. Go to: https://console.cloud.google.com/
2. Select project: **saathi-96ddc**
3. Navigate: **APIs & Services** → **Credentials**
4. Click your **OAuth 2.0 Client ID**
5. Under **"Authorized JavaScript origins"**, add:
   - `https://saathiya-mind-connect.vercel.app`
6. Under **"Authorized redirect URIs"**, add:
   - `https://saathiya-mind-connect.vercel.app`
   - `https://saathiya-mind-connect.vercel.app/__/auth/handler`
7. Click: **"Save"**

## Testing Your Deployment

### Test These URLs (Replace with your actual Vercel URL):

- [ ] Home: `https://saathiya-mind-connect.vercel.app/`
- [ ] Login: `https://saathiya-mind-connect.vercel.app/login`
- [ ] AI Chat: `https://saathiya-mind-connect.vercel.app/ai-chat`
- [ ] Crisis Support: `https://saathiya-mind-connect.vercel.app/crisis-support`
- [ ] Mood Dashboard: `https://saathiya-mind-connect.vercel.app/mood-dashboard`
- [ ] Resources: `https://saathiya-mind-connect.vercel.app/resources`

### Test Authentication Methods:

#### 1. Email/Password Sign-up
- [ ] Go to login page
- [ ] Click "Sign Up" tab
- [ ] Enter email and password
- [ ] Click "Sign Up"
- [ ] Should create account successfully

#### 2. Google OAuth
- [ ] Click "Sign in with Google" button
- [ ] Select Google account
- [ ] Grant permissions
- [ ] Should redirect back and sign in

#### 3. Email Link (Magic Link)
- [ ] Click "Email Link" tab
- [ ] Enter your email
- [ ] Click "Send Magic Link"
- [ ] Check your email
- [ ] Click the link in email
- [ ] Should open /finishSignUp and sign you in

## Troubleshooting

### If you get "Unauthorized domain" error:
✅ **Fix:** Add your Vercel domain to Firebase Console → Authorized domains

### If Google sign-in doesn't work:
✅ **Fix:** Update redirect URIs in Google Cloud Console

### If email link gives 404:
✅ **Fix:** Already configured in vercel.json! Should work automatically.

### If routes give 404 on refresh:
✅ **Fix:** Already configured in vercel.json! All routes fallback to index.html.

### If build fails:
✅ **Fix:** Check Vercel deployment logs
```bash
vercel logs
```

## Deployment Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>
```

## Final Checklist

After deployment, verify:

- [ ] Deployment successful (got a live URL)
- [ ] Added Vercel domain to Firebase authorized domains
- [ ] Enabled Email/Password auth in Firebase
- [ ] Enabled Google auth in Firebase
- [ ] Updated Google OAuth redirect URIs
- [ ] Tested home page loads
- [ ] Tested login page loads
- [ ] Tested Email/Password sign-in works
- [ ] Tested Google sign-in works
- [ ] Tested Email Link sign-in works
- [ ] No console errors in browser
- [ ] Mobile responsive works
- [ ] HTTPS is enabled (automatic on Vercel)

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ All pages load without 404 errors
2. ✅ All 3 authentication methods work
3. ✅ No JavaScript errors in console
4. ✅ App works on mobile devices
5. ✅ HTTPS is enabled
6. ✅ Users can sign in and stay logged in

## Next Steps

Once deployed and tested:

1. **Share your app!** 🎉
   - URL: `https://saathiya-mind-connect.vercel.app`

2. **Monitor usage:**
   - Firebase Console → Authentication → Users
   - Vercel Dashboard → Analytics

3. **Set up custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain

4. **Enable analytics** (optional)
   - Firebase Analytics is already configured!
   - View data in Firebase Console

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Deployment logs:** `vercel logs`
- **Check deployment status:** https://vercel.com/dashboard

---

## 🚀 Ready to Deploy?

Run this command in a new terminal:

```powershell
vercel --prod
```

**That's it!** Your app will be live in minutes! 🎉
