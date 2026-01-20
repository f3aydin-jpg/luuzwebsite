import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDU75o6g6tyWU2VXjpl02xZJots57MLTxY",
  authDomain: "luuz-poster.firebaseapp.com",
  projectId: "luuz-poster",
  storageBucket: "luuz-poster.firebasestorage.app",
  messagingSenderId: "454979069272",
  appId: "1:454979069272:web:6989f69d496c101100312d",
  measurementId: "G-8DKELJ68HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
