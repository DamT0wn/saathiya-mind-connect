import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UserIcon, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  emailVerified?: boolean;
}

export const GoogleOAuth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error('❌ Error parsing stored user data:', err);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Identity Services loaded');
      initializeGoogle();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '1069787260321-vq914fbv10g3bad76joorhc4sha3cc69.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        ux_mode: 'popup',
        context: 'signin'
      });

      // Render the button
      const buttonDiv = document.getElementById('google-signin-button');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 400
        });
      }

      // Show One Tap prompt for returning users
      window.google.accounts.id.prompt();
    }
  };

  const handleCredentialResponse = async (response: any) => {
    console.log('🔐 Received credential response');
    
    try {
      setIsLoading(true);
      setError(null);

      // Send the credential to our backend
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api/auth-callback'
        : 'https://saathiya-mind-connect.vercel.app/api/auth-callback';

      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      console.log('✅ User authenticated:', data.user.email);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
    } catch (err: any) {
      console.error('❌ Authentication error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    console.log('🚪 User logged out');
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600 text-center">{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
          </div>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>{user.name}</CardDescription>
          <CardDescription className="text-sm text-muted-foreground">
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UserIcon className="w-16 h-16 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">Sign in to Saathi</CardTitle>
        <CardDescription>
          Connect with your mental wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="google-signin-button" className="flex justify-center"></div>
        
        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="/terms-of-service.html" className="underline hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy.html" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
};