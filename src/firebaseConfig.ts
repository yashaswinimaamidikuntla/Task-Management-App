// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCGQudHNkn4RByTYPWfyFWhMf9-r_iyCgk",
  authDomain: "task-management-app-3841f.firebaseapp.com",
  projectId: "task-management-app-3841f",
  storageBucket: "task-management-app-3841f.firebasestorage.app",
  messagingSenderId: "459261641276",
  appId: "1:459261641276:web:07169409a62b5ec8963939",
  measurementId: "G-ZYVJJSVE3B",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
