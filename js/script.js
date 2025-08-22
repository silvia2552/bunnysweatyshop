/* BunnySweatyShop - storefront logic (vanilla JS) */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const PRODUCTS = [
  {id:"sw1", name:"Cloudy Knit Pullover", price:179000, image:"assets/svg/sweater1.svg", badge:"Best Seller"},
  {id:"sw2", name:"Pastel Breeze Hoodie", price:199000, image:"assets/svg/sweater2.svg", badge:"Hot"},
  {id:"sw3", name:"Cotton Candy Crew", price:149000, image:"assets/svg/sweater3.svg", badge:"Limited"},
  {id:"sw4", name:"Baby Blue Cardigan", price:189000, image:"assets/svg/sweater4.svg"},
  {id:"sw5", name:"Blush Zip Sweater", price:209000, image:"assets/svg/sweater5.svg"},
];

const currency = (n) => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);

/* --- Cart state with localStorage --- */
const CART_KEY = "bss_cart_v1";
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const addToCart = (id) => {
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  if(item) item.qty += 1; else cart.push({id, qty:1});
  saveCart(cart);
  renderCartBadge();
  toast("Ditambahkan ke keranjang");
};
const removeFromCart = (id) => {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart); renderCart();
  renderCartBadge();
};
const changeQty = (id, delta) => {
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) return removeFromCart(id);
  saveCart(cart); renderCart();
  renderCartBadge();
};
const cartTotal = () => loadCart().reduce((sum,i)=>{
  const p = PRODUCTS.find(p=>p.id===i.id);
  return sum + (p ? p.price*i.qty : 0);
},0);

function renderCartBadge(){
  const count = loadCart().reduce((n,i)=>n+i.qty,0);
  const badge = $(".cart-btn .badge");
  if(badge) badge.textContent = count;
}

function renderProducts(){
  const wrap = $("#products");
  wrap.innerHTML = PRODUCTS.map(p => `
    <article class="card" aria-label="${p.name}">
      <div class="media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="body">
        ${p.badge ? `<span class="badge-pill">${p.badge}</span>` : ""}
        <h3>${p.name}</h3>
        <div class="price">${currency(p.price)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">+ Keranjang</button>
          <button class="buy" data-id="${p.id}">Checkout</button>
        </div>
      </div>
    </article>
  `).join("");
  // bind
  $$("#products .add").forEach(btn => btn.addEventListener("click", e => addToCart(e.currentTarget.dataset.id)));
  $$("#products .buy").forEach(btn => btn.addEventListener("click", e => {
    addToCart(e.currentTarget.dataset.id);
    openCart();
  }));
}

function renderSlider(){
  const slides = PRODUCTS.slice(0,5).map(p => `
    <div class="slide" aria-label="${p.name}">
      <div class="visual"><img src="${p.image}" alt="${p.name}"></div>
      <div class="copy">
        <span class="badge-pill">Terlaris</span>
        <h3>${p.name}</h3>
        <p>Nyaman, ringan, dan lembut—pas untuk cuaca tropis. Warna pastel baby pink & baby blue yang manis.</p>
        <div class="price">${currency(p.price)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">+ Keranjang</button>
          <button class="buy" data-id="${p.id}">Checkout</button>
        </div>
      </div>
    </div>
  `).join("");
  $(".slider-track").innerHTML = slides;
  bindActionButtons($(".slider"));
}

function bindActionButtons(root){
  $$(".add", root).forEach(btn => btn.addEventListener("click", e => addToCart(e.currentTarget.dataset.id)));
  $$(".buy", root).forEach(btn => btn.addEventListener("click", e => { addToCart(e.currentTarget.dataset.id); openCart(); }));
}

let currentSlide = 0;
function slideTo(idx){
  const track = $(".slider-track");
  const total = PRODUCTS.slice(0,5).length;
  currentSlide = (idx + total) % total;
  track.style.transform = `translateX(-${currentSlide*100}%)`;
}
function nextSlide(){ slideTo(currentSlide+1) }
function prevSlide(){ slideTo(currentSlide-1) }

/* Cart drawer */
function openCart(){ $("#cart").showModal(); renderCart(); }
function closeCart(){ $("#cart").close(); }
function renderCart(){
  const body = $("#cart-items");
  const cart = loadCart();
  if(cart.length === 0){
    body.innerHTML = "<p>Keranjang kosong.</p>";
  } else {
    body.innerHTML = cart.map(i => {
      const p = PRODUCTS.find(p=>p.id===i.id);
      if(!p) return "";
      return `
        <div class="row" style="display:flex;gap:.6rem;align-items:center;justify-content:space-between;padding:.4rem 0;border-bottom:1px dashed #e5e7eb">
          <div style="display:flex;gap:.6rem;align-items:center">
            <img src="${p.image}" alt="" width="40" height="40">
            <div>
              <div style="font-weight:700">${p.name}</div>
              <div>${currency(p.price)}</div>
            </div>
          </div>
          <div style="display:flex;gap:.4rem;align-items:center">
            <button aria-label="Kurangi" onclick="changeQty('${i.id}',-1)">−</button>
            <span aria-live="polite">${i.qty}</span>
            <button aria-label="Tambah" onclick="changeQty('${i.id}',1)">+</button>
            <button onclick="removeFromCart('${i.id}')">Hapus</button>
          </div>
        </div>
      `;
    }).join("");
  }
  $("#cart-total").textContent = currency(cartTotal());
}

/* Checkout (mock) */
function checkout(){
  if(loadCart().length === 0){ toast("Keranjang masih kosong"); return; }
  toast("Checkout berhasil (simulasi). Kami akan menghubungi Anda via WhatsApp!");
  // In real app, redirect to payment or WhatsApp API
  localStorage.removeItem(CART_KEY);
  renderCart(); renderCartBadge();
}

/* Toast */
let toastTimer;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 1800);
}

/* Testimonials */
const T_KEY = "bss_testimonials_v1";
const loadT = () => JSON.parse(localStorage.getItem(T_KEY) || "[]");
const saveT = (arr) => localStorage.setItem(T_KEY, JSON.stringify(arr));
const defaultT = [
  {name:"Dina", rating:5, text:"Bahannya adem dan lembut. Warna pastel-nya gemas!"},
  {name:"Rafi", rating:4, text:"Pengiriman cepat, ukuran pas. Recommended."},
  {name:"Sari", rating:5, text:"Modelnya simple tapi elegan. Cocok buat sehari-hari."}
];
function ensureDefaultT(){
  if(loadT().length === 0) saveT(defaultT);
}
function renderTestimonials(){
  const list = $("#testimonials");
  const all = loadT();
  list.innerHTML = all.map(t => `
    <div class="testimonial">
      <div class="name">${t.name}</div>
      <div class="rating">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</div>
      <p>${t.text}</p>
    </div>
  `).join("");
}
function handleSubmitTesti(e){
  e.preventDefault();
  const name = $("#t-name").value.trim() || "Anonim";
  const rating = +$("#t-rating").value || 5;
  const text = $("#t-text").value.trim();
  if(!text){ toast("Tulis pengalamanmu dulu ya"); return; }
  const all = loadT();
  all.unshift({name, rating, text});
  saveT(all);
  $("#t-form").reset();
  renderTestimonials();
  toast("Terima kasih atas testimoninya!");
}

/* Kritik & Saran */
function handleSubmitFeedback(e){
  e.preventDefault();
  const name = $("#f-name").value.trim() || "Anonim";
  const message = $("#f-message").value.trim();
  if(!message){ toast("Isi pesan kritik/saran ya"); return; }
  // For demo: just store to localStorage and show success
  const FB_KEY = "bss_feedback_v1";
  const all = JSON.parse(localStorage.getItem(FB_KEY) || "[]");
  all.push({name, message, at: new Date().toISOString()});
  localStorage.setItem(FB_KEY, JSON.stringify(all));
  $("#f-form").reset();
  toast("Terima kasih untuk kritik & saran!");
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderSlider();
  ensureDefaultT();
  renderTestimonials();
  renderCartBadge();
  $("#next").addEventListener("click", nextSlide);
  $("#prev").addEventListener("click", prevSlide);
  $("#open-cart").addEventListener("click", openCart);
  $("#close-cart").addEventListener("click", closeCart);
  $("#checkout").addEventListener("click", checkout);
  $("#t-form").addEventListener("submit", handleSubmitTesti);
  $("#f-form").addEventListener("submit", handleSubmitFeedback);
  // auto-play
  setInterval(nextSlide, 5000);
});