// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (ensure this is correct)
const firebaseConfig = {
  apiKey: "AIzaSyCqvfyCSkINeNqIj9_X74MUn6sWyLkjbIg",
  authDomain: "jewel-box-dashboard.firebaseapp.com",
  projectId: "jewel-box-dashboard",
  storageBucket: "jewel-box-dashboard.firebasestorage.app",
  messagingSenderId: "544308371060",
  appId: "1:544308371060:web:3377471e052e5e15fbbb21",
  measurementId: "G-QND4G8VTZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };