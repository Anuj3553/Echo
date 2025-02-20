// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeotltM7h72uiEBG4kkbCkb75rJqymmAI",
    authDomain: "echo-6fea2.firebaseapp.com",
    projectId: "echo-6fea2",
    storageBucket: "echo-6fea2.firebasestorage.app",
    messagingSenderId: "196995932764",
    appId: "1:196995932764:web:50965872eeadc2d3ecbc99",
    measurementId: "G-P14TF0JZRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseAuth);

export const firebaseAuth = getAuth(app);
