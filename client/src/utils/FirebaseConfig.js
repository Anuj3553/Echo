// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDivoj-u5k-3kN8o08fb4jhnzotD9f0_E0",
    authDomain: "app-echo-chat.firebaseapp.com",
    projectId: "app-echo-chat",
    storageBucket: "app-echo-chat.firebasestorage.app",
    messagingSenderId: "435471819167",
    appId: "1:435471819167:web:99449ea7bea6a87f131daa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseAuth);

export const firebaseAuth = getAuth(app);
