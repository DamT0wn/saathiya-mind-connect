import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://oauth2.googleapis.com"],
      frameSrc: ["https://accounts.google.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8080', // Current Vite dev server
    'http://localhost:8081', // Backup port
    'http://localhost:8082', // Backup port
    'http://localhost:8083', // Backup port
    'http://localhost:3001', // OAuth server
    'https://saathiya-mind-connect.vercel.app', // Production frontend
    process.env.CLIENT_URL,
    process.env.PRODUCTION_URL,
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware to validate environment variables
const validateEnv = () => {
  const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please check your .env file and add the missing variables.');
    process.exit(1);
  }
};

validateEnv();

/**
 * Verify Google ID token with Google's tokeninfo endpoint
 * @param {string} idToken - The ID token from Google
 * @returns {Object} - Verified user data or null if invalid
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
 * @param {Object} userData - Verified user data from Google
 * @returns {string} - JWT token
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Saathi OAuth Server'
  });
});

// OAuth callback endpoint
app.post('/auth/callback', async (req, res) => {
  console.log('🚀 OAuth callback received');
  console.log('📋 Request body:', req.body);
  console.log('📋 Request headers:', req.headers);
  
  try {
    const { credential } = req.body;
    
    if (!credential) {
      console.error('❌ No credential provided in request body');
      console.log('📋 Full request body:', JSON.stringify(req.body, null, 2));
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
    res.json({
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

  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during authentication' 
    });
  }
});

// Middleware to verify JWT tokens
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

// Protected route to get user profile
app.get('/auth/profile', verifyJWT, (req, res) => {
  console.log('👤 Profile requested for user:', req.user.email);
  
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    }
  });
});

// Logout endpoint (client-side will handle token removal)
app.post('/auth/logout', verifyJWT, (req, res) => {
  console.log('🚪 Logout requested for user:', req.user.email);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Saathi OAuth Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 OAuth callback: http://localhost:${PORT}/auth/callback`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes('your-')) {
    console.warn('⚠️  Warning: Please set your actual GOOGLE_CLIENT_ID in .env file');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

export default app;