// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9Vrlxv0EIOVG2atMBUk4JIHlxcnC410o",
  authDomain: "studio-lunovia.firebaseapp.com",
  projectId: "studio-lunovia",
  storageBucket: "studio-lunovia.firebasestorage.app",
  messagingSenderId: "713608183015",
  appId: "1:713608183015:web:82cc7ae25517699fa9f642",
  measurementId: "G-ZL8HGPJPN8"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
