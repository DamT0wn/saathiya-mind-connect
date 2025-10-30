import jwt from 'jsonwebtoken';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
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

  } catch (error) {
    console.error('❌ Profile error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}