// cart.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

let currentUser = null;

// DOM
const usernameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logout-btn");
const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");

// Auth state
onAuthStateChanged(auth,(user)=>{
  if(!user){ alert("Login first!"); window.location.href="login.html"; return; }
  currentUser = user;
  usernameEl.textContent = `Hello, ${user.email}`;
  logoutBtn.addEventListener("click", async ()=>{
    await signOut(auth);
    window.location.href="index.html";
  });
  displayCart();
});

// Display Cart
async function displayCart(){
  const cartRef = doc(db,"carts",currentUser.uid);
  const cartSnap = await getDoc(cartRef);
  let cart = cartSnap.exists()? cartSnap.data().items || [] : [];
  
  cartContainer.innerHTML="";
  let total = 0;

  cart.forEach((item,index)=>{
    const div = document.createElement("div");
    div.innerHTML = `${item.name} - ₹${item.price} 
      <button onclick="removeItem(${index})">Remove</button>`;
    cartContainer.appendChild(div);
    total += item.price;
  });

  totalPriceEl.textContent = total;
}

// Remove item
window.removeItem = async (index)=>{
  const cartRef = doc(db,"carts",currentUser.uid);
  const cartSnap = await getDoc(cartRef);
  let cart = cartSnap.exists()? cartSnap.data().items || [] : [];
  cart.splice(index,1);
  await setDoc(cartRef,{items:cart});
  displayCart();
}

// Checkout
checkoutBtn.addEventListener("click", async ()=>{
  const cartRef = doc(db,"carts",currentUser.uid);
  const cartSnap = await getDoc(cartRef);
  const cart = cartSnap.exists()? cartSnap.data().items || [] : [];

  if(cart.length === 0){ alert("Cart is empty!"); return; }

  // Save to orders
  const ordersRef = doc(db,"orders",currentUser.uid);
  const ordersSnap = await getDoc(ordersRef);
  let orders = ordersSnap.exists()? ordersSnap.data().items || [] : [];
  orders.push({items:cart, date: new Date().toLocaleString()});
  await setDoc(ordersRef,{items:orders});

  // Clear cart
  await setDoc(cartRef,{items:[]});
  alert("Checkout complete!");
  displayCart();
});
