// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_EXISTING_API_KEY",
  authDomain: "kayraenterprise-8a2ec.firebaseapp.com",
  projectId: "kayraenterprise-8a2ec",
  storageBucket: "kayraenterprise-8a2ec.firebasestorage.app",
  messagingSenderId: "541311529043",
  appId: "1:541311529043:web:d8e2300b7290e7caa356a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export for other V3 files
export { app, db, auth, storage };

console.log("✅ Firebase App Connected");
console.log("✅ Firestore Connected");
console.log("✅ Firebase Auth Connected");
console.log("✅ Firebase Storage Connected");
