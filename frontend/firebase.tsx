// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbQUmxFlH-NMN7hpY38-b5iZtSn4_9Rlc",
  authDomain: "learning-platforme.firebaseapp.com",
  projectId: "learning-platforme",
  storageBucket: "learning-platforme.firebasestorage.app",
  messagingSenderId: "374415781275",
  appId: "1:374415781275:web:1a61afe8443fc8922c053e",
  measurementId: "G-NPKR7YE65S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);