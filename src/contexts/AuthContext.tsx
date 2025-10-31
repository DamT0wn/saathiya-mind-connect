import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  googleProvider,
  actionCodeSettings,
  type User 
} from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string, emailLink: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        console.log('User signed in:', user.email);
      } else {
        console.log('User signed out');
        // Clear onboarding flags when user signs out
        localStorage.removeItem('hasSeenWelcome');
        localStorage.removeItem('hasCompletedMoodCheckIn');
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email sign-up successful:', result.user.email);
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const sendEmailLink = async (email: string) => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email locally so we don't need to ask the user for it again
      // if they open the link on the same device
      window.localStorage.setItem('emailForSignIn', email);
      console.log('Sign-in link sent to:', email);
    } catch (error) {
      console.error('Email link send error:', error);
      throw error;
    }
  };

  const completeEmailLinkSignIn = async (email: string, emailLink: string) => {
    try {
      if (isSignInWithEmailLink(auth, emailLink)) {
        const result = await signInWithEmailLink(auth, email, emailLink);
        // Clear email from storage
        window.localStorage.removeItem('emailForSignIn');
        console.log('Email link sign-in successful:', result.user.email);
      } else {
        throw new Error('Invalid sign-in link');
      }
    } catch (error) {
      console.error('Email link sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear onboarding flags on logout
      localStorage.removeItem('hasSeenWelcome');
      localStorage.removeItem('hasCompletedMoodCheckIn');
      await signOut(auth);
      console.log('Sign-out successful');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendEmailLink,
    completeEmailLinkSignIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
