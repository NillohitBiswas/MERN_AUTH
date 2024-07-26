// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-24.firebaseapp.com",
  projectId: "mern-auth-24",
  storageBucket: "mern-auth-24.appspot.com",
  messagingSenderId: "218668951774",
  appId: "1:218668951774:web:e4e7e58f92ff8ce4d43a4f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);