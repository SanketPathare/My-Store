import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCFD1gPppnzTBo5IiT16XL52BgbgxMNvWM",
    authDomain: "ecommerce-7a95b.firebaseapp.com",
    projectId: "ecommerce-7a95b",
    storageBucket: "ecommerce-7a95b.firebasestorage.app",
    messagingSenderId: "951741836979",
    appId: "1:951741836979:web:478e60ec30de7e48004ac6",
    measurementId: "G-S7SJEH7N3X"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db };