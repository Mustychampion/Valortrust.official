/**
 * Firebase client initialization.
 *
 * Replaces the old src/lib/supabase.ts. All frontend modules import
 * `db`, `auth`, and `storage` from this file instead.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDURgFVcDnfzGdr-Z-uPDYcq4FNSYWlBcc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "valortrust.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "valortrust",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "valortrust.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1023055310780",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1023055310780:web:fd1afab93f4b146abf05b9",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
