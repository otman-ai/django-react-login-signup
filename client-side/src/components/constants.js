import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup ,analytics};


export const colors = {
    white: '#ffffff',
    'transparent-black': '#1E1E1E', // Darker shade for better contrast
    primary: '#F97C3E',            // Warm accent color
    secondary: '#FFE2D2',          // Soft background color
    'transparent-white': '#FFF8F5', // Light background shade
    'text-main': '#2A2A2A',        // Main text color
    'text-light': '#5C5C5C',       // Secondary text color
    'border-color': '#E0E0E0',     // Border color
    'card-bg': '#FFFDFD',          // Card background color
    'accent-light': '#FFB07C',     // Light accent color
    'accent-dark': '#D65F29',      // Dark accent color
    'highlight': '#FFEB3B',        // Highlight color
    'error': '#F44336',            // Error color
    'success': '#4CAF50',          // Success color
    'info': '#2196F3',             // Info color
    'warning': '#FF9800',          // Warning color
}

export const brand = 'EasyPostly.'
export const endpoints = {
  "login":"auth/login",
  "signup":"auth/signup",
  "google_login":"auth/google_sign",
  "password-reset":"auth/password-reset",
  "verify-email":"auth/verify-email"
}

export const routes = {
  "main":"workspace",
  "login":"login",
  "signup":"signup",
  "forgetpassword":"forgot-password",
  "password-reset":"password-reset"
}
export const BASE_API = import.meta.env.VITE_BASE_API || 'https://api.easypostly.com/api/'
export const DOMAIN = import.meta.env.VITE_DOMAIN || 'https://easypostly.com/'