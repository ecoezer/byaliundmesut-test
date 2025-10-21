import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let firebaseError: Error | null = null;

try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is missing. Please check your environment variables in Netlify.');
  }

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    getAnalytics(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  firebaseError = error instanceof Error ? error : new Error(String(error));
  db = null;
}

export { db, firebaseError };

export function ensureFirebaseInitialized(): void {
  if (firebaseError) {
    throw firebaseError;
  }
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
}
