import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz0ir_8trPPv-bcVislVXbxSN-IngW6rs",
  authDomain: "pokeapi2-39ae6.firebaseapp.com",
  projectId: "pokeapi2-39ae6",
  storageBucket: "pokeapi2-39ae6.firebasestorage.app",
  messagingSenderId: "897457297350",
  appId: "1:897457297350:web:2d667d96da214a3a2284c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);