import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UserIcon, LogOut } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const GoogleAuth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogle = () => {
    if (window.google) {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: '1069787260321-vq914fbv10g3bad76joorhc4sha3cc69.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
        context: 'signin'
      });

      // Render the sign-in button
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300,
          type: 'standard'
        }
      );

      // Show One Tap prompt
      window.google.accounts.id.prompt((notification: any) => {
        console.log('Google One Tap notification:', notification);
      });
    }
  };

  const handleCredentialResponse = async (response: any) => {
    console.log('🔑 Google credential response received:', response);
    setIsLoading(true);
    
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Determine the correct backend URL based on environment
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://saathiya-mind-connect.vercel.app/api';

      console.log('📤 Sending credential to backend:', backendUrl);
      const res = await fetch(`${backendUrl}/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      console.log('📥 Backend response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('❌ Backend error response:', errorData);
        throw new Error(`Authentication failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Authentication successful:', data);
      
      // Store the JWT token
      localStorage.setItem('authToken', data.token);
      
      // Set user data
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Auth error:', error);
      setIsLoading(false);
      // You might want to show an error message to the user here
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://saathiya-mind-connect.vercel.app/api';
        
      const res = await fetch(`${backendUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const backendUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3001' 
          : 'https://saathiya-mind-connect.vercel.app/api';
          
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('authToken');
    setUser(null);
    
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
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
        <div id="googleSignInDiv" className="flex justify-center"></div>
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

// Global function for Google callback
window.handleCredentialResponse = () => {};