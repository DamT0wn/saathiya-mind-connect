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
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests' 
    });
  }

  // Check for Google Client ID environment variable
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ 
      error: 'Missing Google Client ID',
      message: 'GOOGLE_CLIENT_ID environment variable is not set' 
    });
  }

  try {
    // Extract credential from request body
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ 
        error: 'Missing credential',
        message: 'No credential (ID token) provided in request body' 
      });
    }

    // Verify the Google ID token by calling Google's tokeninfo endpoint
    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const tokenInfoResponse = await fetch(tokenInfoUrl);

    if (!tokenInfoResponse.ok) {
      const errorText = await tokenInfoResponse.text();
      return res.status(400).json({ 
        error: 'Invalid token',
        message: 'Failed to verify Google ID token',
        details: errorText
      });
    }

    // Parse the verified user information
    const userInfo = await tokenInfoResponse.json();

    // Verify the token is for our application
    if (userInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ 
        error: 'Invalid token audience',
        message: 'Token was not issued for this application' 
      });
    }

    // Extract user data
    const user = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.email,
      picture: userInfo.picture || null,
      emailVerified: userInfo.email_verified === 'true' || userInfo.email_verified === true
    };

    // Return success response with user data
    return res.status(200).json({ 
      message: 'Login successful',
      user 
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'An error occurred while processing the authentication',
      details: error.message
    });
  }
}
