import jwt from 'jsonwebtoken';
import axios from 'axios';

/**
 * Verify Google ID token with Google's tokeninfo endpoint
 */
const verifyGoogleToken = async (idToken) => {
  try {
    console.log('🔍 Verifying Google ID token...');
    
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      { timeout: 10000 }
    );

    const tokenData = response.data;
    
    // Verify the token is for our application
    if (tokenData.aud !== process.env.GOOGLE_CLIENT_ID) {
      console.error('❌ Token audience mismatch');
      return null;
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenData.exp < currentTime) {
      console.error('❌ Token expired');
      return null;
    }

    console.log('✅ Token verified successfully');
    return {
      id: tokenData.sub,
      email: tokenData.email,
      name: tokenData.name,
      picture: tokenData.picture,
      email_verified: tokenData.email_verified === 'true'
    };

  } catch (error) {
    console.error('❌ Error verifying Google token:', error.message);
    return null;
  }
};

/**
 * Generate JWT token for authenticated user
 */
const generateJWTToken = (userData) => {
  const payload = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

/**
 * Verify JWT tokens
 */
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    return null;
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081', 
    'http://localhost:8082',
    'http://localhost:3001',
    'https://saathiya-mind-connect.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the URL from query parameter or use the request URL
  const targetUrl = req.query.url || req.url;
  const { method } = req;

  try {
    // Health check endpoint
    if (targetUrl === '/health' && method === 'GET') {
      return res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Saathi OAuth Server'
      });
    }

    // OAuth callback endpoint
    if (targetUrl === '/auth/callback' && method === 'POST') {
      console.log('🚀 OAuth callback received');
      console.log('📋 Request body:', req.body);
      
      const { credential } = req.body;
      
      if (!credential) {
        console.error('❌ No credential provided');
        return res.status(400).json({ 
          success: false, 
          error: 'No credential provided' 
        });
      }

      // Verify the Google ID token
      const userData = await verifyGoogleToken(credential);
      
      if (!userData) {
        console.error('❌ Invalid or expired token');
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid or expired token' 
        });
      }

      // Generate JWT token for our application
      const jwtToken = generateJWTToken(userData);
      
      console.log('✅ User authenticated successfully:', userData.email);
      
      // Return success response with user data and JWT token
      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          email_verified: userData.email_verified
        },
        token: jwtToken,
        expires_in: 86400 // 24 hours in seconds
      });
    }

    // Profile endpoint
    if (targetUrl === '/auth/profile' && method === 'GET') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required' 
        });
      }

      const decoded = verifyJWT(token);
      if (!decoded) {
        return res.status(403).json({ 
          success: false, 
          error: 'Invalid or expired token' 
        });
      }

      console.log('👤 Profile requested for user:', decoded.email);
      
      return res.status(200).json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        }
      });
    }

    // Logout endpoint
    if (targetUrl === '/auth/logout' && method === 'POST') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required' 
        });
      }

      const decoded = verifyJWT(token);
      if (!decoded) {
        return res.status(403).json({ 
          success: false, 
          error: 'Invalid or expired token' 
        });
      }

      console.log('🚪 Logout requested for user:', decoded.email);
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // 404 handler
    return res.status(404).json({ 
      success: false, 
      error: 'Endpoint not found' 
    });

  } catch (error) {
    console.error('❌ Unhandled error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}