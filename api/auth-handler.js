// Google OAuth Authentication Handler - Alternative to callback.js
export default async function handler(req, res) {
  console.log(`📍 Auth Handler called: ${req.method} ${req.url}`);
  
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

  if (req.method === 'POST') {
    // Handle POST from Google Identity Services (credential verification)
    console.log('🔄 POST auth-handler received');
    
    try {
      let body = req.body;

      // Parse body if it's a string
      if (typeof body === 'string' && body.length) {
        try {
          body = JSON.parse(body);
        } catch (e) {
          const params = new URLSearchParams(body);
          const parsed = {};
          for (const [k, v] of params) parsed[k] = v;
          body = parsed;
        }
      }

      console.log('📝 Request body keys:', body ? Object.keys(body) : 'none');

      const credential = (body && (body.credential || body.id_token || body.idToken)) || null;

      if (!credential) {
        console.error('❌ No credential/id_token provided');
        return res.status(400).json({ 
          error: 'no_credential',
          message: 'No credential found in request body'
        });
      }

      console.log('🔄 Verifying credential with Google tokeninfo...');

      // Verify ID token with Google's tokeninfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);

      if (!verifyRes.ok) {
        const txt = await verifyRes.text();
        console.error('❌ tokeninfo failed:', verifyRes.status, txt);
        return res.status(400).json({ 
          error: 'invalid_token', 
          details: txt,
          status: verifyRes.status 
        });
      }

      const userInfo = await verifyRes.json();
      console.log('✅ Token verified for user:', userInfo.email);

      // Create user payload
      const user = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        picture: userInfo.picture || null,
        issuer: userInfo.iss || null,
        audience: userInfo.aud || null,
      };

      // Create app token (base64 JSON for simplicity)
      const appToken = Buffer.from(JSON.stringify({ 
        id: user.id, 
        email: user.email, 
        iat: Date.now() 
      })).toString('base64');

      console.log('✅ POST /api/auth-handler success for user:', user.email);

      return res.status(200).json({ 
        success: true, 
        user, 
        token: appToken 
      });

    } catch (error) {
      console.error('❌ POST auth-handler error:', error);
      return res.status(500).json({ 
        error: 'server_error', 
        details: String(error),
        message: 'Internal server error during authentication'
      });
    }
  }

  if (req.method === 'GET') {
    // Handle GET redirect from Google (authorization code flow)
    const { code, state, error } = req.query;

    console.log('🔄 GET auth-handler received:', { code: code ? 'present' : 'missing', error });

    if (error) {
      console.error('❌ OAuth error:', error);
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://saathiya-mind-connect.vercel.app' 
        : 'http://localhost:8080';
      return res.redirect(`${frontendUrl}?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('❌ No authorization code received');
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://saathiya-mind-connect.vercel.app' 
        : 'http://localhost:8080';
      return res.redirect(`${frontendUrl}?error=no_code`);
    }

    try {
      // Exchange code for tokens and redirect with user data
      // Implementation similar to callback.js GET handler
      return res.status(200).json({ 
        message: 'GET auth handler working',
        code: 'received',
        next_step: 'token_exchange_not_implemented_yet'
      });

    } catch (error) {
      console.error('❌ GET auth-handler error:', error);
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://saathiya-mind-connect.vercel.app' 
        : 'http://localhost:8080';
      return res.redirect(`${frontendUrl}?error=processing_failed`);
    }
  }

  console.log('❌ Method not allowed:', req.method);
  return res.status(405).json({ 
    error: 'Method not allowed',
    allowed: ['GET', 'POST', 'OPTIONS'],
    received: req.method
  });
}