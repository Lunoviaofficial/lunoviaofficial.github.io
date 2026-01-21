// profile.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

let currentUser = null;
const usernameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logout-btn");
const profileEmail = document.getElementById("profile-email");
const ordersContainer = document.getElementById("orders-container");

onAuthStateChanged(auth,(user)=>{
  if(!user){ alert("Login first!"); window.location.href="login.html"; return; }
  currentUser = user;
  usernameEl.textContent = `Hello, ${user.email}`;
  profileEmail.textContent = user.email;

  logoutBtn.addEventListener("click", async ()=>{
    await signOut(auth);
    window.location.href="index.html";
  });

  displayOrders();
});

async function displayOrders(){
  const ordersRef = doc(db,"orders",currentUser.uid);
  const ordersSnap = await getDoc(ordersRef);
  const orders = ordersSnap.exists()? ordersSnap.data().items || [] : [];

  ordersContainer.innerHTML="";
  if(orders.length === 0){
    ordersContainer.innerHTML="<p>No orders yet!</p>";
  }else{
    orders.forEach((order,i)=>{
      const div = document.createElement("div");
      div.innerHTML = `<strong>Order ${i+1} (${order.date}):</strong> ${order.items.map(it=>it.name).join(", ")}`;
      ordersContainer.appendChild(div);
    });
  }
}
