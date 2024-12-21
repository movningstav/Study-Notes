// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF9DHivUkkAAsS5S17LNijnuHMTv1JBLM",
  authDomain: "studynotes42726.firebaseapp.com",
  projectId: "studynotes42726",
  storageBucket: "studynotes42726.firebasestorage.app",
  messagingSenderId: "253881643882",
  appId: "1:253881643882:web:d43a08ddaeab5affb3ab13",
  measurementId: "G-9RTGQLV9SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };