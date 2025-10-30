# Firebase Authentication Setup Guide

## 🔥 Firebase Console Configuration

### Step 1: Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **Saathi** (saathi-96ddc)
3. In the left sidebar, click on **Build** → **Authentication**
4. Click on the **Sign-in method** tab
5. Enable the following providers:

#### Email/Password Authentication:
- Click on **Email/Password**
- Toggle **Enable** to ON
- **IMPORTANT**: Also toggle **Email link (passwordless sign-in)** to ON
- Click **Save**

#### Google Authentication:
- Click on **Google**
- Toggle **Enable** to ON
- Enter a project support email (your email)
- Click **Save**

### Step 2: Add Authorized Domains

1. Still in **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are added:
   - `localhost` (for local development)
   - Your Vercel domain: `saathiya-mind-connect.vercel.app`

### Step 3: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Templates** tab
2. Customize the email templates for:
   - Email link sign-in
   - Email verification
   - Password reset

### Step 4: Configure OAuth Consent Screen (Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (saathi-96ddc)
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen with:
   - App name: **Saathi Mind Connect**
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email` and `profile`

## ✅ What's Already Set Up in Your Code

### 1. Firebase Configuration
- Location: `src/lib/firebase.ts`
- Initialized with your project credentials
- Exports auth functions for easy use

### 2. Authentication Context
- Location: `src/contexts/AuthContext.tsx`
- Manages authentication state across the app
- Provides hooks: `useAuth()`

### 3. Authentication UI Component
- Location: `src/components/FirebaseAuth.tsx`
- Beautiful sign-in/sign-up form with:
  - Email/Password authentication
  - Google sign-in button
  - Form validation
  - Toast notifications

### 4. User Profile Component
- Location: `src/components/UserProfile.tsx`
- Shows user avatar and dropdown menu
- Appears in navigation when logged in

### 5. Protected Routes
- Location: `src/components/ProtectedRoute.tsx`
- Wraps routes that require authentication
- Redirects to login if not authenticated

### 6. Updated Components
- `App.tsx`: Wrapped with `AuthProvider`
- `Login.tsx`: Uses new `FirebaseAuth` component
- `Navigation.tsx`: Shows `UserProfile` when authenticated

## 🚀 How to Use Authentication

### Check if User is Logged In:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <div>Welcome, {currentUser.email}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

### Protect a Route:
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Sign Out:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Sign Out</button>;
}
```

## 🎨 Available Auth Methods

1. **Google Sign-In**: Click the Google button on the login page
2. **Email/Password Sign-In**: Enter credentials in the Sign In tab
3. **Email/Password Sign-Up**: Create a new account in the Sign Up tab
4. **Magic Link (Email Link)**: Passwordless sign-in via email link

## 📱 Testing Authentication

1. Run your development server: `npm run dev`
2. Navigate to `/login`
3. Try signing up with email/password or Google
4. Try the **Email Link** tab to send yourself a magic link
5. Check the navigation bar for your profile picture
6. Click profile to see dropdown with logout option

## 🔐 Email Link Authentication Flow

### Sending the Magic Link:
1. User enters their email in the "Email Link" tab
2. Firebase sends an email with a magic link
3. Email is saved in localStorage for convenience

### Completing Sign-In:
1. User clicks the link in their email
2. Browser opens `/finishSignUp` route
3. If email is in localStorage, sign-in completes automatically
4. Otherwise, user is asked to confirm their email
5. User is redirected to the home page after successful sign-in

## 🔒 Security Notes

- Passwords must be at least 6 characters
- Firebase handles all password encryption
- OAuth tokens are managed securely by Firebase
- User sessions persist across page refreshes
- Automatic token refresh handled by Firebase

## 🐛 Troubleshooting

### "Unauthorized domain" error:
- Make sure your domain is added in Firebase Console → Authentication → Settings → Authorized domains

### Google Sign-In not working:
- Verify OAuth consent screen is configured
- Check that Google provider is enabled in Firebase Console
- Make sure your Google Cloud project is linked to Firebase

### Email link not working:
- Ensure "Email link (passwordless sign-in)" is enabled in Firebase Console
- Check that the redirect URL matches your authorized domains
- Verify email templates are configured properly

### Email verification not working:
- Email verification is optional and not enabled by default
- Enable it in Firebase Console → Authentication → Templates

## 📚 Next Steps

- ✅ Email link (passwordless) authentication already added!
- Add email verification for new users
- Implement password reset functionality
- Add more OAuth providers (GitHub, Twitter, etc.)
- Set up Firebase Security Rules
- Add user profile storage in Firestore
- Customize email templates in Firebase Console
