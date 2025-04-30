

// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyClyX-Sxaz8AqBYTBefCCL4pjjRnjqmwHc",
  authDomain: "voice-email-app-44fef.firebaseapp.com",
  projectId: "voice-email-app-44fef",
  storageBucket: "voice-email-app-44fef.firebasestorage.app",
  messagingSenderId: "50430064588",
  appId: "1:50430064588:web:0cfc89e1c5bdc346bbcf69"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; // No need to export 'app'
