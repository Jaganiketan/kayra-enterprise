// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBe1Gi-atOr6ugqIIHNs5W_8x6DH0oCY9g",
  authDomain: "kayraenterprise-8a2ec.firebaseapp.com",
  projectId: "kayraenterprise-8a2ec",
  storageBucket: "kayraenterprise-8a2ec.firebasestorage.app",
  messagingSenderId: "541311529043",
  appId: "1:541311529043:web:d8e2300b7290e7caa356a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

console.log("✅ Firebase Connected");
