// auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const form = document.getElementById("auth-form");

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;

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
