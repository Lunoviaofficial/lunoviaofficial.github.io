// app.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {

  // DOM Elements
  const usernameEl = document.getElementById("username");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const cartCountEl = document.getElementById("cart-count");
  const productsContainer = document.getElementById("products");
  const themeBtn = document.getElementById("theme-btn");

  // Dark / Light toggle
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  // Sample Products
  const products = [
    { id:1, name:"T-Shirt", price:500, category:"clothing" },
    { id:2, name:"Hoodie", price:1200, category:"clothing" },
    { id:3, name:"Cap", price:300, category:"accessories" },
    { id:4, name:"Sneakers", price:2500, category:"footwear" }
  ];

  // Display Products
  function displayProducts(list){
    if(!productsContainer) return;
    productsContainer.innerHTML = "";
    list.forEach(prod => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <h3>${prod.name}</h3>
        <p>₹${prod.price}</p>
        <button class="add-to-cart">Add to Cart</button>
        <button class="add-to-wishlist">❤ Wishlist</button>
      `;
      // Cart button
      div.querySelector(".add-to-cart").addEventListener("click", () => addToCart(prod.id));
      // Wishlist button
      div.querySelector(".add-to-wishlist").addEventListener("click", () => addToWishlist(prod.id));

      productsContainer.appendChild(div);
    });
  }

  displayProducts(products);

  // Search Products
  const searchInput = document.getElementById("search");
  searchInput?.addEventListener("input", (e)=>{
    const filtered = products.filter(p=>p.name.toLowerCase().includes(e.target.value.toLowerCase()));
    displayProducts(filtered);
  });

  // Filter Categories
  document.querySelectorAll("#categories button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const category = btn.getAttribute("data-category");
      displayProducts(category === "all" ? products : products.filter(p=>p.category===category));
    });
  });

  // Firebase Auth State
  let currentUser = null;
  onAuthStateChanged(auth, async (user)=>{
    currentUser = user;
    if(user){
      usernameEl.textContent = `Hello, ${user.email}`;
      loginBtn?.style.setProperty("display","none");
      logoutBtn?.style.setProperty("display","inline-block");
      updateCartCount();
    }else{
      usernameEl.textContent = "";
      loginBtn?.style.setProperty("display","inline-block");
      logoutBtn?.style.setProperty("display","none");
      if(cartCountEl) cartCountEl.textContent = 0;
    }
  });

  // Logout
  logoutBtn?.addEventListener("click", async ()=>{
    await auth.signOut();
    window.location.reload();
  });

  // Add to Cart
  async function addToCart(id){
    if(!currentUser){ alert("Login first!"); window.location.href="login.html"; return; }
    const product = products.find(p=>p.id===id);
    const cartRef = doc(db,"carts",currentUser.uid);
    const cartSnap = await getDoc(cartRef);
    let cart = cartSnap.exists()? cartSnap.data().items||[] : [];
    cart.push(product);
    await setDoc(cartRef,{items:cart});
    alert("Added to cart!");
    updateCartCount();
  }

  // Add to Wishlist
  async function addToWishlist(id){
    if(!currentUser){ alert("Login first!"); window.location.href="login.html"; return; }
    const product = products.find(p=>p.id===id);
    const wishRef = doc(db,"wishlists",currentUser.uid);
    const wishSnap = await getDoc(wishRef);
    let wish = wishSnap.exists()? wishSnap.data().items||[] : [];
    if(!wish.find(p=>p.id===id)) wish.push(product);
    await setDoc(wishRef,{items:wish});
    alert("Added to Wishlist!");
  }

  // Expose globally (needed for inline onclick fallback)
  window.addToCart = addToCart;
  window.addToWishlist = addToWishlist;

  // Update cart count
  async function updateCartCount(){
    if(!currentUser || !cartCountEl) return;
    const cartRef = doc(db,"carts",currentUser.uid);
    const cartSnap = await getDoc(cartRef);
    const count = cartSnap.exists()? (cartSnap.data().items||[]).length : 0;
    cartCountEl.textContent = count;
  }

});
