// auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("auth-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");

  if (!form || !emailInput || !passwordInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please fill both email and password!");
      return;
    }

    try {
      // Try Signup first
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      window.location.href = "index.html";
    } catch (signupError) {
      try {
        // If user exists, try login
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "index.html";
      } catch (loginError) {
        alert("Error: " + loginError.message);
      }
    }
  });

});
