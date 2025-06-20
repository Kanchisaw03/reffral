// Firebase config and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFPfJJYQUFaue_I9s4Z75TARR5Waf-vgY",
  authDomain: "reffral-6072d.firebaseapp.com",
  projectId: "reffral-6072d",
  storageBucket: "reffral-6072d.appspot.com",
  messagingSenderId: "461168859674",
  appId: "1:461168859674:web:467f1da73a7855c305cfa3",
  measurementId: "G-29R593V67B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 