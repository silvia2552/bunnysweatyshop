// Data produk (maks 5 item)
const PRODUCTS = [
  { id: 's1', name: 'Sweater Bunny 귀엽다', price: 189000, img: 'assets/img/sweater_bunny.svg' },
  { id: 's2', name: 'Sweater Blossom 봄', price: 199000, img: 'assets/img/sweater_blossom.svg' },
  { id: 's3', name: 'Sweater Milk 우유', price: 179000, img: 'assets/img/sweater_milk.svg' },
  { id: 's4', name: 'Sweater Star 반짝', price: 199000, img: 'assets/img/sweater_star.svg' },
  { id: 's5', name: 'Sweater Peach 복숭아', price: 199000, img: 'assets/img/sweater_peach.svg' },
];

// Util
const fmt = n => 'Rp' + n.toLocaleString('id-ID');

// Render slider cards
const track = document.getElementById('sliderTrack');
const dots = document.getElementById('dots');

PRODUCTS.forEach((p, i) => {
  const card = document.createElement('article');
  card.className = 'card product';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" width="160" height="160" loading="lazy"/>
    <div class="meta">
      <h4>${p.name}</h4>
      <p class="muted">Bahan halus, adem, cocok untuk OOTD ala Korea.</p>
      <div class="price">${fmt(p.price)}</div>
      <div class="actions">
        <button class="btn primary" data-add="${p.id}">Tambah ke Keranjang</button>
      </div>
    </div>
  `;
  track.appendChild(card);

  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.dataset.to = i;
  dots.appendChild(dot);
});

// Slider logic
let index = 0;
const prevBtn = document.querySelector('.nav.prev');
const nextBtn = document.querySelector('.nav.next');

function updateSlider() {
  const cardWidth = track.children[0].getBoundingClientRect().width;
  track.style.transform = `translateX(${-index * (cardWidth)}px)`;
  [...dots.children].forEach((d, i) => d.classList.toggle('active', i === index));
}

prevBtn.addEventListener('click', () => { index = (index - 1 + PRODUCTS.length) % PRODUCTS.length; updateSlider(); });
nextBtn.addEventListener('click', () => { index = (index + 1) % PRODUCTS.length; updateSlider(); });
dots.addEventListener('click', e => {
  if (e.target.dataset.to) { index = +e.target.dataset.to; updateSlider(); }
});
window.addEventListener('resize', updateSlider);
setInterval(() => { index = (index + 1) % PRODUCTS.length; updateSlider(); }, 4000);

// Cart
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const goCheckoutBtn = document.getElementById('goCheckout');

const LS_KEY = 'bunny_cart_v1';
let cart = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

function saveCart() {
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
  cartCount.textContent = cart.reduce((a,b)=>a+b.qty,0);
  renderCart();
}
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++; else cart.push({ id, qty: 1 });
  saveCart();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(ci => {
    const p = PRODUCTS.find(p => p.id === ci.id);
    const li = document.createElement('li');
    const sub = p.price * ci.qty;
    total += sub;
    li.innerHTML = `
      <span>${p.name} × ${ci.qty}</span>
      <span>${fmt(sub)} <button class="btn ghost" data-remove="${ci.id}">hapus</button></span>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = fmt(total);
}
document.addEventListener('click', e => {
  if (e.target.dataset.add) addToCart(e.target.dataset.add);
  if (e.target.dataset.remove) removeFromCart(e.target.dataset.remove);
  if (e.target.hasAttribute('data-close')) e.target.closest('.modal').setAttribute('aria-hidden', 'true');
});

cartBtn.addEventListener('click', () => cartModal.setAttribute('aria-hidden','false'));
clearCartBtn.addEventListener('click', () => { cart = []; saveCart(); });
goCheckoutBtn.addEventListener('click', () => {
  document.getElementById('checkoutModal').setAttribute('aria-hidden','false');
});

saveCart();

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
checkoutBtn.addEventListener('click', ()=> checkoutModal.setAttribute('aria-hidden','false'));

document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  document.getElementById('checkoutMsg').textContent = `Terima kasih! Link pembayaran akan dikirim ke ${email}`;
});

// Testimoni
const testiForm = document.getElementById('testiForm');
const testiList = document.getElementById('testiList');
const LS_TESTI = 'bunny_testi_v1';
let testimonials = JSON.parse(localStorage.getItem(LS_TESTI) || '[]');

function renderTesti(){
  testiList.innerHTML = '';
  testimonials.forEach(t => {
    const li = document.createElement('li');
    const date = new Date(t.time).toLocaleDateString('id-ID');
    li.innerHTML = `<strong>${t.nama}</strong> <small class="muted">(${date})</small><br>${t.pesan}`;
    testiList.appendChild(li);
  });
}

testiForm.addEventListener('submit', e => {
  e.preventDefault();
  const nama = document.getElementById('nama').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  if(!nama || !pesan) return;
  testimonials.unshift({ nama, pesan, time: Date.now() });
  localStorage.setItem(LS_TESTI, JSON.stringify(testimonials));
  testiForm.reset();
  renderTesti();
});

renderTesti();
document.getElementById('year').textContent = new Date().getFullYear();