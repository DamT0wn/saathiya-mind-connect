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

  return res.status(405).json({ error: 'Method not allowed' });
}