// Vercel Serverless Function for Google OAuth Callback

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU8lgQ8qW9cLx1_eK2RvTNY0VCZQOoddI",
  authDomain: "saathi-96ddc.firebaseapp.com",
  projectId: "saathi-96ddc",
  storageBucket: "saathi-96ddc.firebasestorage.app",
  messagingSenderId: "311646503359",
  appId: "1:311646503359:web:8f0bf9994c7a9fdf4de10a",
  measurementId: "G-10HYMXH45S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://saathiya-mind-connect.vercel.app',
    'https://accounts.google.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Handle OAuth callback from Google
    const { code, state, error } = req.query;

    if (error) {
      console.error('❌ OAuth error:', error);
      // Redirect to frontend with error
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:8080'}?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('❌ No authorization code received');
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:8080'}?error=no_code`);
    }

    try {
      console.log('🔄 Exchanging authorization code for tokens...');

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:3000'}/callback`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('❌ Token exchange failed:', errorData);
        return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:8080'}?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json();
      console.log('✅ Token exchange successful');

      // Get user info from Google
      const userResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`);
      
      if (!userResponse.ok) {
        console.error('❌ Failed to get user info');
        return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:8080'}?error=user_info_failed`);
      }

      const userInfo = await userResponse.json();
      console.log('✅ User info retrieved:', userInfo.email);

      // Generate JWT token for our app (you can implement this)
      const userToken = Buffer.from(JSON.stringify({
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        timestamp: Date.now()
      })).toString('base64');

      // Redirect to frontend with user token
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://saathiya-mind-connect.vercel.app' 
        : 'http://localhost:8080';
      
      return res.redirect(`${frontendUrl}?token=${userToken}&success=true`);

    } catch (error) {
      console.error('❌ Callback processing error:', error);
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://saathiya-mind-connect.vercel.app' : 'http://localhost:8080'}?error=processing_failed`);
    }
  }

  if (req.method === 'POST') {
    // Accept POST from Google Identity Services (credential) or from client
    try {
      let body = req.body;

      // If body is a string (server may not have parsed it), try to parse
      if (typeof body === 'string' && body.length) {
        try {
          body = JSON.parse(body);
        } catch (e) {
          // Try parsing urlencoded
          const params = new URLSearchParams(body);
          const parsed = {};
          for (const [k, v] of params) parsed[k] = v;
          body = parsed;
        }
      }

      const credential = (body && (body.credential || body.id_token || body.idToken)) || null;

      if (!credential) {
        console.error('❌ No credential/id_token provided in POST body');
        return res.status(400).json({ error: 'no_credential' });
      }

      // Verify ID token with Google's tokeninfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);

      if (!verifyRes.ok) {
        const txt = await verifyRes.text();
        console.error('❌ tokeninfo failed:', verifyRes.status, txt);
        return res.status(400).json({ error: 'invalid_token', details: txt });
      }

      const userInfo = await verifyRes.json();

      // Minimal user payload to return
      const user = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        picture: userInfo.picture || null,
        issuer: userInfo.iss || null,
        audience: userInfo.aud || null,
      };

      // Create a simple app token (base64 JSON) -- replace with signed JWT in prod
      const appToken = Buffer.from(JSON.stringify({ id: user.id, email: user.email, iat: Date.now() })).toString('base64');

      console.log('✅ POST /api/callback verified user:', user.email);

      return res.status(200).json({ success: true, user, token: appToken });

    } catch (error) {
      console.error('❌ POST callback error:', error);
      return res.status(500).json({ error: 'server_error', details: String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}