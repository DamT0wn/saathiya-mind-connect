import React, { useEffect } from 'react';
import { FirebaseAuth } from '../components/FirebaseAuth';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light via-white to-wellness-calm/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Login Card */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md">
            <FirebaseAuth />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact our{' '}
                <a href="/crisis-support" className="text-primary hover:underline">
                  Crisis Support Team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}