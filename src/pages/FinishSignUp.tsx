import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function FinishSignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeEmailLinkSignIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);

  useEffect(() => {
    // Check if this is a valid email link
    const emailLink = window.location.href;
    
    // Try to get email from localStorage
    const savedEmail = window.localStorage.getItem('emailForSignIn');
    
    if (savedEmail) {
      // Automatically complete sign-in
      handleSignIn(savedEmail, emailLink);
    } else {
      // Ask user to provide email
      setNeedsEmail(true);
    }
  }, []);

  const handleSignIn = async (userEmail: string, emailLink: string) => {
    setIsLoading(true);
    try {
      await completeEmailLinkSignIn(userEmail, emailLink);
      toast({
        title: "Success!",
        description: "You've been signed in successfully.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Email link sign-in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete sign-in. Please try again.",
        variant: "destructive",
      });
      setNeedsEmail(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    const emailLink = window.location.href;
    await handleSignIn(email, emailLink);
  };

  if (isLoading && !needsEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wellness-light via-white to-wellness-calm/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Signing you in...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light via-white to-wellness-calm/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Sign In</CardTitle>
          <CardDescription>
            Please confirm your email address to complete the sign-in process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter the email address where you received the sign-in link
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Complete Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
