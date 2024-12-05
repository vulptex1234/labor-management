// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7yi_3foq97t016RVBnMLDZr5GijcdYSo",
  authDomain: "labor-management-b1a3c.firebaseapp.com",
  projectId: "labor-management-b1a3c",
  storageBucket: "labor-management-b1a3c.firebasestorage.app",
  messagingSenderId: "675127161419",
  appId: "1:675127161419:web:d3d16487185b18a371d3ce",
  measurementId: "G-56MS6LW7CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Authentication をエクスポート
export const db = getFirestore(app); // Firestore をエクスポート