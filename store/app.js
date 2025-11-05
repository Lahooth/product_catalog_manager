const API = "http://127.0.0.1:8000/products/";

const grid = document.getElementById("grid");
const toast = document.getElementById("toast");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const drawer = document.getElementById("drawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkout");

let cart = loadCart();

function loadCart(){ try { return JSON.parse(localStorage.getItem("cart")||"[]"); } catch { return []; } }
function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0); }
function money(n){ return Number(n||0).toFixed(2); }
function notify(msg, ok=true){ toast.textContent=msg; toast.className="toast "+(ok?"ok":"err"); toast.classList.remove("hidden"); setTimeout(()=>toast.classList.add("hidden"),1500); }

async function fetchProducts(){
  const res = await fetch(API);
  const items = await res.json();
  renderProducts(items);
}

function renderProducts(items){
  grid.innerHTML = "";
  items.forEach(p=>{
    const el = document.createElement("div");
    el.className="card";
    el.innerHTML = `
      <div><strong>${escapeHtml(p.name)}</strong></div>
      <div>SKU: ${escapeHtml(p.sku)}</div>
      <div class="price">₹ ${money(p.price)}</div>
      <div style="margin-top:8px">
        <button class="btn primary" data-add="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">
          Add to Cart
        </button>
      </div>
    `;
    grid.appendChild(el);
  });
}

grid.addEventListener("click", (e)=>{
  const id = e.target.getAttribute("data-add");
  if(!id) return;
  const name = e.target.getAttribute("data-name");
  const price = Number(e.target.getAttribute("data-price")||0);
  const idx = cart.findIndex(i=>i.id==id);
  if(idx>=0) cart[idx].qty += 1; else cart.push({id, name, price, qty:1});
  saveCart();
  notify("Added to cart");
});

cartBtn.addEventListener("click", ()=>{ drawer.classList.remove("hidden"); renderCart(); });
closeCart.addEventListener("click", ()=> drawer.classList.add("hidden"));

function renderCart(){
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((it, i)=>{
    total += it.price * it.qty;
    const row = document.createElement("div");
    row.className="item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(it.name)}</strong>
        <div>₹ ${money(it.price)} × ${it.qty}</div>
      </div>
      <div class="qty">
        <button class="btn" data-minus="${i}">−</button>
        <button class="btn" data-plus="${i}">+</button>
        <button class="btn danger" data-remove="${i}">Remove</button>
      </div>
    `;
    cartItems.appendChild(row);
  });
  grandTotal.textContent = money(total);
}

cartItems.addEventListener("click", (e)=>{
  const minus = e.target.getAttribute("data-minus");
  const plus = e.target.getAttribute("data-plus");
  const remove = e.target.getAttribute("data-remove");
  if(minus!==null){ if(cart[minus].qty>1) cart[minus].qty -= 1; else cart.splice(minus,1); saveCart(); renderCart(); }
  if(plus!==null){ cart[plus].qty += 1; saveCart(); renderCart(); }
  if(remove!==null){ cart.splice(remove,1); saveCart(); renderCart(); }
});

checkoutBtn.addEventListener("click", ()=>{
  if(cart.length===0) { notify("Your cart is empty", false); return; }
  notify("Checkout demo complete");
  cart = []; saveCart(); renderCart();
});

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

updateCartCount();
fetchProducts();
