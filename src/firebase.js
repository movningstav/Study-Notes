// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfuTRoR0bHf4CrwmAaSKGQjaQttQXmKrs",
  authDomain: "movningstav01.firebaseapp.com",
  projectId: "movningstav01",
  storageBucket: "movningstav01.firebasestorage.app",
  messagingSenderId: "898287539034",
  appId: "1:898287539034:web:92ce16af0254d69f911963",
  measurementId: "G-S1ERZBSG4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);