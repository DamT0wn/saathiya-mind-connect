// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User 
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU8lgQ8qW9cLx1_eK2RvTNY0VCZQOoddI",
  authDomain: "saathi-96ddc.firebaseapp.com",
  projectId: "saathi-96ddc",
  storageBucket: "saathi-96ddc.firebasestorage.app",
  messagingSenderId: "311646503359",
  appId: "1:311646503359:web:8f0bf9994c7a9fdf4de10a",
  measurementId: "G-10HYMXH45S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Action Code Settings for Email Link Sign-In
const actionCodeSettings = {
  // URL you want to redirect back to. The domain for this URL must be in the authorized domains list
  url: process.env.NODE_ENV === 'production' 
    ? 'https://saathiya-mind-connect.vercel.app/finishSignUp'
    : 'http://localhost:5173/finishSignUp',
  // This must be true for email link sign-in
  handleCodeInApp: true,
};

// Export auth functions
export {
  auth,
  analytics,
  googleProvider,
  actionCodeSettings,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  type User
};

export default app;
