const PRODUCTS = [
  { id:'miel-250', name:'Miel natural', size:'250 ml', category:'Miel', price:18.90, stock:14, image:'assets/honey.jpg', description:'Miel de abeja 100% natural, filtrada y envasada con cuidado.' },
  { id:'miel-500', name:'Miel natural', size:'500 ml', category:'Miel', price:32.90, stock:9, image:'assets/honey-500.jpg', description:'Formato familiar para disfrutar miel natural en más ocasiones.' },
  { id:'polen-100', name:'Polen de abeja', size:'100 g', category:'Polen', price:24.90, stock:11, image:'assets/pollen.jpg', description:'Polen recolectado y seleccionado para conservar su textura y aroma.' },
  { id:'polen-250', name:'Polen de abeja', size:'250 g', category:'Polen', price:44.90, stock:5, image:'assets/pollen.jpg', description:'Formato mayor para consumo frecuente.' },
  { id:'vela-lavanda', name:'Vela de cera natural', size:'Lavanda · 100 g', category:'Velas', price:16.90, stock:13, image:'assets/candles.jpg', description:'Vela artesanal de cera natural con aroma suave a lavanda.' },
  { id:'vela-vainilla', name:'Vela de cera natural', size:'Vainilla · 100 g', category:'Velas', price:17.90, stock:7, image:'assets/candles.jpg', description:'Aroma cálido y dulce para crear un ambiente acogedor.' },
  { id:'propolio-30', name:'Propóleo', size:'30 ml', category:'Propóleo', price:21.90, stock:8, image:'assets/propolis.jpg', description:'Extracto de propóleo en formato práctico para uso cotidiano.' },
  { id:'mini-api', name:'Mini Api', size:'Peluche de abeja', category:'Peluches', price:20.00, stock:20, image:'assets/mini-api.jpg', description:'Un pequeño peluche de abeja suave y adorable, para acompañarte incluso cuando no haya miel disponible.' }
];

const CART_KEY = 'factorApiCart';
const money = n => `S/ ${Number(n).toFixed(2)}`;
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const productById = id => PRODUCTS.find(p => p.id === id);

function cartCount() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = total);
}

function toast(title, text) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function addToCart(id, qty = 1) {
  const p = productById(id);
  if (!p) return;
  const cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) found.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart); cartCount();
  toast('¡Producto agregado!', `${p.name} · ${p.size} ya está en tu carrito.`);
  animateAdd();
}

function animateAdd() {
  const cart = document.querySelector('.cart-btn');
  if (!cart) return;
  cart.classList.remove('cart-added');
  void cart.offsetWidth;
  cart.classList.add('cart-added');
  setTimeout(() => cart.classList.remove('cart-added'), 1000);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart(); cartCount();
}

function changeQty(id, delta) {
  const p = productById(id);
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart(cart); renderCart(); cartCount();
}

function renderCart() {
  const list = document.querySelector('#cart-list');
  const summary = document.querySelector('#cart-summary');
  if (!list || !summary) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<div class="empty"><div style="font-size:46px">🛒</div><h3>Tu carrito está vacío</h3><p>Agrega miel, polen o alguno de nuestros productos artesanales.</p><a class="primary-btn" href="tienda.html">Ver tienda</a></div>`;
    summary.innerHTML = `<h3>Resumen</h3><p style="color:var(--muted)">Aún no tienes productos en el carrito.</p>`;
    return;
  }
  let subtotal = 0;
  list.innerHTML = cart.map(item => {
    const p = productById(item.id);
    const total = p.price * item.qty; subtotal += total;
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/honey.jpg'">
      <div class="cart-meta"><h4>${p.name}</h4><p>${p.size} · ${money(p.price)} c/u</p>
        <div class="qty" style="margin-top:10px"><button onclick="changeQty('${p.id}',-1)">−</button><strong>${item.qty}</strong><button onclick="changeQty('${p.id}',1)">+</button></div>
      </div>
      <div style="text-align:right"><strong>${money(total)}</strong><br><button style="border:0;background:none;color:#8a670b;margin-top:8px" onclick="removeFromCart('${p.id}')">Eliminar</button></div>
    </div>`;
  }).join('');
  const shipping = subtotal >= 80 ? 0 : 7;
  summary.innerHTML = `<h3>Resumen del pedido</h3>
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Envío</span><strong>${shipping === 0 ? 'Gratis' : money(shipping)}</strong></div>
    <div class="summary-total"><span>Total</span><span>${money(subtotal + shipping)}</span></div>
    <button class="primary-btn" style="width:100%;margin-top:18px" onclick="completeOrder()">Finalizar pedido</button>
    <p style="color:var(--muted);font-size:12px;margin-top:10px">También puedes enviar tu pedido por WhatsApp desde el botón de contacto.</p>`;
}

function completeOrder() {
  const cart = getCart();
  if (!cart.length) return;
  const text = cart.map(i => { const p = productById(i.id); return `• ${p.name} ${p.size} x${i.qty} = ${money(p.price*i.qty)}`; }).join('%0A');
  const total = cart.reduce((s,i) => s + productById(i.id).price*i.qty,0);
  const phone = '51941983088'; // REEMPLAZA POR EL WHATSAPP REAL DEL NEGOCIO
  const url = `https://wa.me/${phone}?text=Hola%20FACTOR%20API,%20quiero%20hacer%20este%20pedido:%0A${text}%0A%0ATotal%20estimado:%20${encodeURIComponent(money(total))}`;
  localStorage.removeItem(CART_KEY); cartCount();
  const overlay = document.querySelector('#celebrate');
  if (overlay) {
    overlay.classList.add('show');
    setTimeout(() => window.open(url, '_blank'), 700);
    setTimeout(() => overlay.classList.remove('show'), 2300);
  } else {
    window.open(url, '_blank');
  }
}

function productCard(p) {
  return `<article class="product-card glass">
    <a class="product-image" href="producto.html?id=${p.id}"><img src="${p.image}" alt="${p.name} ${p.size}" onerror="this.onerror=null;this.src='assets/honey.jpg'"><span class="tag">${p.category}</span></a>
    <div class="product-body">
      <h3>${p.name}</h3><p>${p.size}</p>
      <div class="stock ok">● Disponible para pedido</div>
      <div class="price-row"><span class="price">${money(p.price)}</span><button class="add-btn" onclick="addToCart('${p.id}')">＋</button></div>
    </div>
  </article>`;
}

function setupStore() {
  const grid = document.querySelector('#product-grid');
  if (!grid) return;
  const search = document.querySelector('#search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let current = 'Todos';
  function draw() {
    const q = (search?.value || '').toLowerCase().trim();
    const list = PRODUCTS.filter(p => (current === 'Todos' || p.category === current) && `${p.name} ${p.size} ${p.category}`.toLowerCase().includes(q));
    grid.innerHTML = list.length ? list.map(productCard).join('') : `<div class="empty" style="grid-column:1/-1"><h3>No encontramos ese producto</h3><p>Prueba con “miel”, “polen”, “velas” o “Mini Api”.</p></div>`;
  }
  search?.addEventListener('input', draw);
  filters.forEach(btn => btn.addEventListener('click', () => { filters.forEach(b => b.classList.remove('active')); btn.classList.add('active'); current = btn.dataset.filter; draw(); }));
  draw();
}

function setupProduct() {
  const root = document.querySelector('#product-detail');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('id') || PRODUCTS[0].id;
  const p = productById(id) || PRODUCTS[0];
  let selectedSize = p.size, qty = 1;
  root.innerHTML = `<div class="detail-image glass"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/honey.jpg'"></div>
  <section class="detail-panel glass"><span class="tag" style="position:static;display:inline-block">${p.category}</span>
    <h1>${p.name}</h1><p style="color:var(--muted)">${p.description}</p>
    <div class="detail-price">${money(p.price)}</div>
    <div class="stock ok">● Disponible para pedido · confirmar por WhatsApp</div>
    <h4>Presentación</h4><div class="options"><button class="option active">${selectedSize}</button></div>
    <div class="qty-row"><div class="qty"><button id="minus">−</button><strong id="qty">1</strong><button id="plus">+</button></div><button id="add-detail" class="primary-btn" style="flex:1">Agregar al carrito</button></div>
    <div class="info-grid" style="grid-template-columns:1fr 1fr"><div class="info-card" style="padding:15px"><h4>100% natural</h4><p>Sin aditivos innecesarios.</p></div><div class="info-card" style="padding:15px"><h4>Origen local</h4><p>Producción con identidad.</p></div></div>
  </section>`;
  const qtyEl = root.querySelector('#qty');
  root.querySelector('#minus').onclick = () => { qty = Math.max(1, qty-1); qtyEl.textContent = qty; };
  root.querySelector('#plus').onclick = () => { qty += 1; qtyEl.textContent = qty; };
  root.querySelector('#add-detail').onclick = () => addToCart(p.id, qty);
}

function sendContactEmail(form) {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = 'Consulta desde la web de FACTOR API';
  const body = [
    'Hola FACTOR API, quiero hacer una consulta.',
    `Nombre: ${data.get('nombre')}`,
    `Mi WhatsApp: ${data.get('whatsapp')}`,
    `Mi correo: ${data.get('correo')}`,
    `Mensaje: ${data.get('mensaje')}`
  ].join('\n');
  const url = `mailto:factorapi.pe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  toast('Abriendo tu correo', 'Revisa el mensaje y pulsa Enviar en tu aplicación de correo.');
}

function sendContactMessage(event, form) {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    'Hola FACTOR API, quiero hacer una consulta.',
    `Nombre: ${data.get('nombre')}`,
    `Mi WhatsApp: ${data.get('whatsapp')}`,
    `Mi correo: ${data.get('correo')}`,
    `Mensaje: ${data.get('mensaje')}`
  ].join('\n');
  const phone = '51941983088';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  toast('Abriendo WhatsApp', 'Revisa los datos y pulsa Enviar en WhatsApp para entregar tu mensaje.');
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  cartCount(); setupStore(); setupProduct(); renderCart();
  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
});
