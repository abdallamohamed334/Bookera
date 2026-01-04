// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoPFJyeA5rcWjkhb5GdY7yh9GRDonhUlk",
  authDomain: "afra7-platform.firebaseapp.com",
  projectId: "afra7-platform",
  storageBucket: "afra7-platform.firebasestorage.app",
  messagingSenderId: "674822522007",
  appId: "1:674822522007:web:98f45bcf87ac54dcedd5d2",
  measurementId: "G-Y00QGR0GL8"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
