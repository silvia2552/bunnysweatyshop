// Slider (basic) - adjusts by slide width
const slider = document.querySelector('.slider');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let current = 0;
function update() {
  const slideWidth = slides[0].getBoundingClientRect().width + 0; // gap is handled by container
  slider.style.transform = `translateX(-${current * (slideWidth + 0)}px)`;
}
nextBtn.addEventListener('click', ()=>{ current = (current + 1) % slides.length; update(); });
prevBtn.addEventListener('click', ()=>{ current = (current - 1 + slides.length) % slides.length; update(); });
window.addEventListener('resize', update);

// Simple cart & checkout demo (no backend)
const cart = [];
document.getElementById('add-to-cart').addEventListener('click', ()=>{
  cart.push({id: 'sweater-cozy', name:'Sweater Cozy', price:199000});
  alert('Produk ditambahkan ke keranjang. Jumlah item: ' + cart.length);
});
document.getElementById('checkout').addEventListener('click', ()=>{
  if(cart.length === 0){ alert('Keranjang kosong. Tambahkan produk dulu.'); return; }
  const total = cart.reduce((s,p)=>s+p.price,0);
  alert('Checkout (demo) — Total: Rp ' + total.toLocaleString());
});

// Testimoni
const txInput = document.getElementById('testimonial-input');
const txList = document.getElementById('testimonial-list');
document.getElementById('submit-testimonial').addEventListener('click', ()=>{
  const text = txInput.value.trim();
  if(!text) return alert('Isi testimoni terlebih dahulu.');
  const li = document.createElement('li');
  li.textContent = text;
  txList.prepend(li);
  txInput.value = '';
});
