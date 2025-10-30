# Google OAuth 2.0 Setup Guide for Saathi

This guide will help you set up Google OAuth 2.0 authentication for the Saathi mental wellness platform.

## Prerequisites

1. A Google Account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Give your project a name (e.g., "Saathi Mental Wellness")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - **App name**: Saathi - Mental Wellness Platform
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add the following scopes:
   - `email`
   - `profile`
   - `openid`
5. Save and continue through the remaining steps

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Set the following:
   - **Name**: Saathi Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:8082`
     - `http://localhost:3001`
   - **Authorized redirect URIs**: 
     - `http://localhost:3001/auth/callback`
5. Click "Create"
6. Copy the Client ID and Client Secret

## Step 5: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   JWT_SECRET=saathi_super_secret_jwt_key_for_development_make_it_long_and_random_2024
   PORT=3001
   CLIENT_URL=http://localhost:8082
   ```

## Step 6: Update Frontend Google Client ID

1. Open `src/components/GoogleAuth.tsx`
2. Find the line with `client_id: 'YOUR_GOOGLE_CLIENT_ID'`
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID

## Step 7: Install Dependencies and Run

1. Install the new dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. In a new terminal, start the OAuth server:
   ```bash
   npm run auth:server
   ```

## Step 8: Test the Authentication

1. Open your browser to `http://localhost:8082`
2. Click "Sign In" in the navigation
3. Test the Google OAuth flow
4. Verify that you can sign in and sign out successfully

## Security Notes

- The `.env` file contains sensitive information and should never be committed to version control
- For production deployment, use proper environment variable management
- Consider implementing additional security measures like CSRF protection
- Regularly rotate your JWT secret and OAuth credentials

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**: 
   - Ensure your redirect URI in Google Cloud Console exactly matches `http://localhost:3001/auth/callback`

2. **CORS errors**: 
   - Check that both servers (Vite on 8082 and Express on 3001) are running
   - Verify the CLIENT_URL in your .env file

3. **"Invalid client" error**: 
   - Double-check your Google Client ID and Client Secret
   - Ensure you've enabled the Google+ API

4. **JWT errors**: 
   - Make sure your JWT_SECRET is properly set in the .env file

## Production Deployment

For production deployment:

1. Update the authorized origins and redirect URIs in Google Cloud Console
2. Set up proper environment variables on your hosting platform
3. Use HTTPS for all OAuth redirects
4. Consider implementing additional security measures

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for backend errors
3. Verify all environment variables are correctly set
4. Ensure both servers are running on the correct ports