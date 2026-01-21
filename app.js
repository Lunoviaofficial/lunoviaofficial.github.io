// app.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// DOM Elements
const usernameEl = document.getElementById("username");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const cartCountEl = document.getElementById("cart-count");
const productsContainer = document.getElementById("products");

// Dark/Light
const themeBtn = document.getElementById("theme-btn");
themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")?"☀️":"🌙";
});

// Auth state
let currentUser = null;
onAuthStateChanged(auth,(user)=>{
  currentUser = user;
  if(user){
    usernameEl.textContent=`Hello, ${user.email}`;
    loginBtn.style.display="none";
    logoutBtn.style.display="inline-block";
    updateCartCount();
  }else{
    usernameEl.textContent="";
    loginBtn.style.display="inline-block";
    logoutBtn.style.display="none";
    cartCountEl.textContent=0;
  }
});

logoutBtn?.addEventListener("click",async()=>{
  await auth.signOut();
  window.location.reload();
});

// Products
const products=[
  {id:1,name:"T-Shirt",price:500,category:"clothing"},
  {id:2,name:"Hoodie",price:1200,category:"clothing"},
  {id:3,name:"Cap",price:300,category:"accessories"},
  {id:4,name:"Sneakers",price:2500,category:"footwear"}
];

// Display
function displayProducts(list){
  productsContainer.innerHTML="";
  list.forEach(prod=>{
    const div=document.createElement("div");
    div.className="product-card";
    div.innerHTML=`<h3>${prod.name}</h3>
      <p>₹${prod.price}</p>
      <button onclick="addToCart(${prod.id})">Add to Cart</button>
      <button onclick="addToWishlist(${prod.id})">❤ Wishlist</button>`;
    productsContainer.appendChild(div);
  });
}
displayProducts(products);

// Search
document.getElementById("search").addEventListener("input",(e)=>{
  const filtered=products.filter(p=>p.name.toLowerCase().includes(e.target.value.toLowerCase()));
  displayProducts(filtered);
});

// Filter
document.querySelectorAll("#categories button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const cat=btn.getAttribute("data-category");
    displayProducts(cat==="all"?products:products.filter(p=>p.category===cat));
  });
});

// Cart & Wishlist
window.addToCart = async (id)=>{
  if(!currentUser){ alert("Login first!"); window.location.href="login.html"; return; }
  const product=products.find(p=>p.id===id);
  const cartRef=doc(db,"carts",currentUser.uid);
  const cartSnap=await getDoc(cartRef);
  if(cartSnap.exists()){
    let cart=cartSnap.data().items||[];
    cart.push(product);
    await setDoc(cartRef,{items:cart});
  }else{
    await setDoc(cartRef,{items:[product]});
  }
  alert("Added to cart!");
  updateCartCount();
}

window.addToWishlist = async (id)=>{
  if(!currentUser){ alert("Login first!"); window.location.href="login.html"; return; }
  const product=products.find(p=>p.id===id);
  const wishRef=doc(db,"wishlists",currentUser.uid);
  const wishSnap=await getDoc(wishRef);
  if(wishSnap.exists()){
    let wish=wishSnap.data().items||[];
    if(!wish.find(p=>p.id===id)) wish.push(product);
    await setDoc(wishRef,{items:wish});
  }else{
    await setDoc(wishRef,{items:[product]});
  }
  alert("Added to Wishlist!");
}

async function updateCartCount(){
  if(!currentUser) return;
  const cartRef=doc(db,"carts",currentUser.uid);
  const cartSnap=await getDoc(cartRef);
  const count=cartSnap.exists()? (cartSnap.data().items||[]).length:0;
  cartCountEl.textContent=count;
}
