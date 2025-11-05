// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- 1. ИМПОРТИРУЕМ AUTH
// 🔑 Твой конфиг Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCdV5ZzJTeWasgeLGf3vDrHcWhOYN0r5s8",
    authDomain: "christmas-72937.firebaseapp.com",
    projectId: "christmas-72937",
    storageBucket: "christmas-72937.appspot.com", // ⚠️ исправлено: должно быть .appspot.com
    messagingSenderId: "410074346443",
    appId: "1:410074346443:web:3f59afc6f0a924b5b17c4e",
    measurementId: "G-4BQK0WR1N5",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Firestore (для данных товаров)
export const db = getFirestore(app);

// Storage (для загрузки изображений)
export const storage = getStorage(app);

// Analytics (необязательно)
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // <-- 2. ЭКСПОРТИРУЕМ AUTH