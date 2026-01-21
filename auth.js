import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("auth-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");

  if(!form || !emailInput || !passwordInput) return;

  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(!email || !password){ alert("Fill both fields!"); return; }

    try{
      await createUserWithEmailAndPassword(auth,email,password);
      alert("Signup successful!");
      window.location.href="index.html";
    }catch(signupError){
      try{
        await signInWithEmailAndPassword(auth,email,password);
        alert("Login successful!");
        window.location.href="index.html";
      }catch(loginError){
        alert("Error: "+loginError.message);
      }
    }
  });
});
