// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDThnDZVushE0aN_NSCER4pNrfsjoUkJVU",
  authDomain: "unilearn-13994.firebaseapp.com",
  projectId: "unilearn-13994",
  storageBucket: "unilearn-13994.firebasestorage.app",
  messagingSenderId: "898552166587",
  appId: "1:898552166587:web:5f7f1882696528d66e919e",
  measurementId: "G-LZLB6ZH5E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage (for file uploads)
export const storage = getStorage(app);

export default app;
