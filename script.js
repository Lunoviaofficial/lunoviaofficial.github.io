/* =========================
   FIREBASE v12 (MODULE)
========================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* YOUR FIREBASE CONFIG (FROM YOU) */
const firebaseConfig = {
  apiKey: "AIzaSyA9Vrlxv0EIOVG2atMBUk4JIHlxcnC410o",
  authDomain: "studio-lunovia.firebaseapp.com",
  projectId: "studio-lunovia",
  storageBucket: "studio-lunovia.firebasestorage.app",
  messagingSenderId: "713608183015",
  appId: "1:713608183015:web:82cc7ae25517699fa9f642",
  measurementId: "G-ZL8HGPJPN8"
};

/* INIT FIREBASE */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* =========================
   UI FUNCTIONS (EXPOSED)
========================= */
window.openLogin = function () {
  closeAll();
  document.getElementById("loginModal").style.display = "block";
};

window.openSignup = function () {
  closeAll();
  document.getElementById("signupModal").style.display = "block";
};

window.closeAll = function () {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("signupModal").style.display = "none";
};

/* =========================
   AUTH FUNCTIONS
========================= */
window.signup = function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created successfully");
      closeAll();
    })
    .catch(err => alert(err.message));
};

window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged in successfully");
      closeAll();
    })
    .catch(err => alert(err.message));
};

/* CLICK OUTSIDE TO CLOSE */
window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    closeAll();
  }
};
