// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCKszurqk3GwAjAHBkMa-607dKuuSuv4",
  authDomain: "autospec-booking-form.firebaseapp.com",
  projectId: "autospec-booking-form",
  storageBucket: "autospec-booking-form.appspot.com",
  messagingSenderId: "304519910858",
  appId: "1:304519910858:web:1a01b1913f6346c2930b33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);