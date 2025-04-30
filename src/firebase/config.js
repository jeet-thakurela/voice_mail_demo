

// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyCmS7EcpBDCFUYdEOzVg42sBaaF2w-JNZo",
  authDomain: "vchat-jt99.firebaseapp.com",
  projectId: "vchat-jt99",
  storageBucket: "vchat-jt99.firebasestorage.app",
  messagingSenderId: "860841243412",
  appId: "1:860841243412:web:1a4c27554fd4e2be150801",
  measurementId: "G-780W7NV55Y"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; // No need to export 'app'
