/**
 * Luxe Atelier - Luxury Storefront & E-Commerce Catalog
 * High-performance, zero-dependency ES6
 * Real-time cart drawer, dynamic currency conversion, multi-faceted filtering,
 * interactive quick-view modal, WhatsApp checkout & promo codes.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCurrencyConverter();
  initCatalog();
  initCartDrawer();
  initWishlistDrawer();
  initSocietyNewsletter();
  initKeyboardEvents();
});

/* ==========================================================================
   1. CURRENCY CONVERTER SYSTEM
   ========================================================================== */
const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' }
};

let currentCurrency = localStorage.getItem('luxe_currency') || 'USD';

function formatCurrency(amountUSD) {
  const curr = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD;
  const converted = (amountUSD * curr.rate).toFixed(2);
  return `${curr.symbol}${converted}`;
}

function initCurrencyConverter() {
  const selector = document.getElementById('currency-selector');
  if (!selector) return;

  selector.value = currentCurrency;
  updateGlobalCurrencyDisplays();

  selector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('luxe_currency', currentCurrency);
    updateGlobalCurrencyDisplays();
    renderProducts();
    renderCartDrawer();
    showToast(`Currency updated to ${currentCurrency} (${CURRENCY_RATES[currentCurrency].symbol})`, '💱');
  });
}

function updateGlobalCurrencyDisplays() {
  const thresholdEl = document.getElementById('announcement-threshold');
  const calcThresholdEl = document.querySelector('.calc-threshold');
  const thresholdVal = formatCurrency(200);

  if (thresholdEl) thresholdEl.textContent = thresholdVal;
  if (calcThresholdEl) calcThresholdEl.textContent = thresholdVal;
}

/* ==========================================================================
   2. DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('luxe_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('luxe_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next === 'dark' ? 'Matte Obsidian' : 'Alabaster Ceramic'} mode`, '🎨');
  });

  function updateThemeIcon(theme) {
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

/* ==========================================================================
   3. PRODUCTS CATALOG & MULTI-FACETED FILTERING
   ========================================================================== */
let allProductsData = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSort = 'featured';
let inStockOnly = false;

// Color selections cache per product id
const selectedColors = {};

function initCatalog() {
  const fallbackProducts = [
    {
      id: "prod-1",
      name: "Heritage Automatic Chronograph",
      category: "timepieces",
      price: 380,
      rating: 4.9,
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      description: "Mechanical automatic chronograph movement featuring a 41mm aerospace grade 316L stainless steel case.",
      specs: { "Movement": "Calibre LX-740 Automatic", "Glass": "Sapphire Crystal" },
      colors: [{ name: "Obsidian Black", hex: "#18181b" }, { name: "Brushed Silver", hex: "#cbd5e1" }],
      inStock: true
    },
    {
      id: "prod-2",
      name: "Tuscan Bridle Leather Folio",
      category: "leather",
      price: 220,
      rating: 4.95,
      badge: "Artisanal",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      description: "Hand-stitched in Florence using full-grain Tuscan vegetable-tanned cowhide.",
      specs: { "Material": "Tuscan Vachetta", "Hardware": "Solid Brushed Brass" },
      colors: [{ name: "Saddle Tan", hex: "#92400e" }, { name: "Espresso Brown", hex: "#382314" }],
      inStock: true
    },
    {
      id: "prod-3",
      name: "Titanium Wireless Studio Headphones",
      category: "audio",
      price: 420,
      rating: 4.88,
      badge: "Audiophile",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      description: "Precision acoustical tuning with 45mm beryllium drivers and active hybrid noise cancellation.",
      specs: { "Drivers": "45mm Beryllium", "Battery": "38 hours" },
      colors: [{ name: "Matte Slate", hex: "#334155" }, { name: "Silver Anodized", hex: "#94a3b8" }],
      inStock: true
    },
    {
      id: "prod-4",
      name: "Hand-Turned Brass Fountain Pen",
      category: "lifestyle",
      price: 145,
      rating: 4.96,
      badge: "Signature",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
      description: "Machined from a single rod of raw untreated solid brass that develops an exquisite individual patina.",
      specs: { "Nib": "German Peter Bock 18K", "Weight": "58g" },
      colors: [{ name: "Raw Brass", hex: "#d97706" }],
      inStock: true
    }
  ];

  fetch('./assets/data/products.json')
    .then(res => res.json())
    .then(data => {
      allProductsData = data;
      renderProducts();
    })
    .catch(() => {
      allProductsData = fallbackProducts;
      renderProducts();
    });

  // Category Filter Pills (Toolbar & Header)
  const catButtons = document.querySelectorAll('.cat-pill, .nav-filter-btn, .footer-cat-link');
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-category');
      currentCategory = cat;

      document.querySelectorAll('.cat-pill').forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === cat));
      document.querySelectorAll('.nav-filter-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === cat));

      renderProducts();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // In-Stock Switch
  const inStockCheck = document.getElementById('instock-filter-check');
  if (inStockCheck) {
    inStockCheck.addEventListener('change', (e) => {
      inStockOnly = e.target.checked;
      renderProducts();
    });
  }

  // Search Input
  const searchInput = document.getElementById('store-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Hero Quick View CTA
  const heroQuickAdd = document.getElementById('hero-quick-add');
  if (heroQuickAdd) {
    heroQuickAdd.addEventListener('click', () => {
      openQuickViewModal('prod-1');
    });
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countDisplay = document.getElementById('catalog-count-display');
  if (!grid) return;

  // Filter products
  let filtered = allProductsData.filter(p => {
    const matchCat = currentCategory === 'all' || p.category.toLowerCase() === currentCategory.toLowerCase();
    const matchStock = !inStockOnly || p.inStock;
    const matchSearch = !currentSearchQuery || 
      p.name.toLowerCase().includes(currentSearchQuery) ||
      p.categoryLabel.toLowerCase().includes(currentSearchQuery) ||
      p.description.toLowerCase().includes(currentSearchQuery);

    return matchCat && matchStock && matchSearch;
  });

  // Sort products
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (countDisplay) {
    countDisplay.innerHTML = `Displaying <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'Handcrafted Piece' : 'Handcrafted Pieces'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">📦</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-main); margin-bottom: 0.5rem;">No Matching Objects in Atelier</h3>
        <p>Try resetting filters or searching for alternative artisanal pieces.</p>
      </div>
    `;
    return;
  }

  const wishlist = getWishlist();

  grid.innerHTML = filtered.map(prod => {
    const isWishlisted = wishlist.some(w => w.id === prod.id);
    const activeColor = selectedColors[prod.id] || (prod.colors && prod.colors[0] ? prod.colors[0].name : '');

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="card-media">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          ${prod.badge ? `<span class="card-badge">${prod.badge}</span>` : ''}
          <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="${isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}">
            <span>${isWishlisted ? '♥' : '♡'}</span>
          </button>
          <div class="card-quickview-overlay">
            <button class="btn-quickview" data-id="${prod.id}">Quick View</button>
          </div>
        </div>

        <div class="card-details">
          <span class="card-category">${prod.categoryLabel || prod.category}</span>
          <h3 class="card-name" data-id="${prod.id}">${prod.name}</h3>

          ${prod.colors && prod.colors.length > 0 ? `
            <div class="card-swatches">
              ${prod.colors.map(c => `
                <span class="color-dot ${c.name === activeColor ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" data-color="${c.name}" data-prod="${prod.id}"></span>
              `).join('')}
            </div>
          ` : ''}

          <div class="card-pricing-row">
            <span class="card-price">${formatCurrency(prod.price)}</span>
            <button class="btn-add-bag" data-id="${prod.id}">+ Add to Bag</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  attachCardEvents();
}

function attachCardEvents() {
  // Quick View triggers
  document.querySelectorAll('.btn-quickview, .card-name').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = el.getAttribute('data-id');
      openQuickViewModal(id);
    });
  });

  // Add to Bag buttons
  document.querySelectorAll('.btn-add-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const prod = allProductsData.find(p => p.id === id);
      if (!prod) return;
      const color = selectedColors[id] || (prod.colors && prod.colors[0] ? prod.colors[0].name : 'Standard');
      addToCart(prod, 1, color);
    });
  });

  // Wishlist buttons
  document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      toggleWishlist(id);
    });
  });

  // Color Swatch buttons
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = dot.getAttribute('data-prod');
      const colorName = dot.getAttribute('data-color');
      selectedColors[prodId] = colorName;

      // Update active swatch state in card
      const parent = dot.parentElement;
      parent.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE PRODUCT QUICK-VIEW MODAL
   ========================================================================== */
function openQuickViewModal(productId) {
  const modal = document.getElementById('quickview-modal');
  const body = document.getElementById('quickview-body');
  const closeBtn = document.getElementById('quickview-close-btn');
  const backdrop = document.getElementById('quickview-backdrop');

  if (!modal || !body) return;

  const prod = allProductsData.find(p => p.id === productId);
  if (!prod) return;

  let selectedModalColor = selectedColors[prod.id] || (prod.colors && prod.colors[0] ? prod.colors[0].name : 'Default');
  let modalQty = 1;

  const galleryImages = prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image];

  body.innerHTML = `
    <div class="qv-gallery">
      <img src="${galleryImages[0]}" alt="${prod.name}" class="qv-main-img" id="qv-main-image">
      ${galleryImages.length > 1 ? `
        <div class="qv-thumbs">
          ${galleryImages.map((img, idx) => `
            <img src="${img}" class="qv-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}" alt="Thumb">
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div class="qv-info">
      <div>
        <span class="qv-category">${prod.categoryLabel || prod.category}</span>
        <h2 class="qv-title">${prod.name}</h2>
      </div>

      <div class="qv-price-row">
        <span id="qv-price-val" style="color: var(--accent);">${formatCurrency(prod.price)}</span>
        <span style="font-size: 0.85rem; color: #10b981; font-weight: 700;">● In Stock &bull; Ready to Dispatch</span>
      </div>

      <p class="qv-desc">${prod.description}</p>

      ${prod.specs ? `
        <div class="qv-specs-box">
          ${Object.entries(prod.specs).map(([key, val]) => `
            <div class="qv-spec-line">
              <span>${key}:</span>
              <strong>${val}</strong>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${prod.colors && prod.colors.length > 0 ? `
        <div>
          <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; display: block;">
            Selected Color: <strong id="qv-color-label" style="color: var(--accent);">${selectedModalColor}</strong>
          </label>
          <div class="card-swatches">
            ${prod.colors.map(c => `
              <span class="color-dot ${c.name === selectedModalColor ? 'active' : ''}" style="background-color: ${c.hex}; width: 20px; height: 20px;" title="${c.name}" data-color="${c.name}"></span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="qv-selectors-row">
        <label style="font-size: 0.82rem; font-weight: 700;">Quantity:</label>
        <div class="qty-control">
          <button id="qv-qty-minus">&minus;</button>
          <span id="qv-qty-val">1</span>
          <button id="qv-qty-plus">&plus;</button>
        </div>
      </div>

      <div class="qv-actions">
        <button id="qv-btn-add" class="btn btn-primary btn-block">Add to Shopping Bag &bull; ${formatCurrency(prod.price)}</button>
        <button id="qv-btn-whatsapp" class="btn btn-whatsapp btn-block">
          <span>Inquire &amp; Order on WhatsApp</span>
        </button>
      </div>
    </div>
  `;

  // Gallery thumbnail clicks
  const mainImg = document.getElementById('qv-main-image');
  body.querySelectorAll('.qv-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      body.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) mainImg.src = thumb.src;
    });
  });

  // Color Swatch clicks inside modal
  body.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      body.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedModalColor = dot.getAttribute('data-color');
      selectedColors[prod.id] = selectedModalColor;
      const label = document.getElementById('qv-color-label');
      if (label) label.textContent = selectedModalColor;
    });
  });

  // Quantity adjustments
  const qtyVal = document.getElementById('qv-qty-val');
  const btnAdd = document.getElementById('qv-btn-add');

  document.getElementById('qv-qty-minus').addEventListener('click', () => {
    if (modalQty > 1) {
      modalQty--;
      if (qtyVal) qtyVal.textContent = modalQty;
      if (btnAdd) btnAdd.textContent = `Add to Shopping Bag • ${formatCurrency(prod.price * modalQty)}`;
    }
  });

  document.getElementById('qv-qty-plus').addEventListener('click', () => {
    modalQty++;
    if (qtyVal) qtyVal.textContent = modalQty;
    if (btnAdd) btnAdd.textContent = `Add to Shopping Bag • ${formatCurrency(prod.price * modalQty)}`;
  });

  // Add to Bag action
  btnAdd.addEventListener('click', () => {
    addToCart(prod, modalQty, selectedModalColor);
    closeQuickViewModal();
  });

  // WhatsApp Single Item Direct Order
  document.getElementById('qv-btn-whatsapp').addEventListener('click', () => {
    const text = encodeURIComponent(`Hello Luxe Atelier, I would like to order: ${prod.name} (Color: ${selectedModalColor}, Quantity: ${modalQty}) for ${formatCurrency(prod.price * modalQty)}.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  });

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (closeBtn) closeBtn.onclick = closeQuickViewModal;
  if (backdrop) backdrop.onclick = closeQuickViewModal;
}

function closeQuickViewModal() {
  const modal = document.getElementById('quickview-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. CLIENT-SIDE SHOPPING BAG & CART DRAWER (LOCALSTORAGE)
   ========================================================================== */
let activeDiscountPercent = 0;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('luxe_cart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(product, quantity = 1, color = 'Standard') {
  const cart = getCart();
  const existingIdx = cart.findIndex(item => item.id === product.id && item.color === color);

  if (existingIdx > -1) {
    cart[existingIdx].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: color,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added ${quantity}x "${product.name}" to bag`, '👜');
  openCartDrawer();
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
}

function removeCartItem(index) {
  const cart = getCart();
  if (cart[index]) {
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`Removed "${name}" from bag`, '🗑️');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const drawerCount = document.getElementById('drawer-cart-count');
  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);

  if (badge) badge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = totalItems;
}

function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-overlay-backdrop');
  const openBtn = document.getElementById('cart-toggle-btn');
  const closeBtn = document.getElementById('cart-close-btn');

  if (openBtn) openBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', () => {
    closeCartDrawer();
    closeWishlistDrawer();
  });

  // Promo Code Handler
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoInput = document.getElementById('promo-input');
  const promoStatus = document.getElementById('promo-status');

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'LUXE10' || code === 'ZERO10') {
        activeDiscountPercent = 10;
        promoStatus.className = 'promo-status-msg success';
        promoStatus.textContent = '✓ 10% Society Privilege discount applied!';
        promoStatus.classList.remove('hidden');
        renderCartDrawer();
        showToast('10% Privilege Discount Applied!', '🎉');
      } else {
        promoStatus.className = 'promo-status-msg error';
        promoStatus.textContent = 'Invalid promotion code. Try LUXE10';
        promoStatus.classList.remove('hidden');
      }
    });
  }

  // WhatsApp Order Checkout
  const btnWhatsApp = document.getElementById('btn-whatsapp-order');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('Your shopping bag is empty', '⚠️');
        return;
      }

      let orderText = `*LUXE ATELIER ORDER REQUISITION*%0A------------------------------------%0A`;
      cart.forEach((item, idx) => {
        orderText += `${idx + 1}. *${item.name}* (Qty: ${item.quantity}, Color: ${item.color}) - ${formatCurrency(item.price * item.quantity)}%0A`;
      });

      const subtotalUSD = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const discount = (subtotalUSD * activeDiscountPercent) / 100;
      const total = subtotalUSD - discount;

      orderText += `------------------------------------%0A`;
      if (activeDiscountPercent > 0) {
        orderText += `Discount (10%): -${formatCurrency(discount)}%0A`;
      }
      orderText += `*Total Order Value:* ${formatCurrency(total)} (${currentCurrency})%0A%0APlease confirm fulfillment availability and payment link.`;

      window.open(`https://wa.me/?text=${orderText}`, '_blank');
    });
  }

  // Simulated Stripe Checkout
  const btnStripe = document.getElementById('btn-stripe-checkout');
  if (btnStripe) {
    btnStripe.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('Your shopping bag is empty', '⚠️');
        return;
      }
      openOrderSuccessModal();
    });
  }

  updateCartBadge();
  renderCartDrawer();
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-overlay-backdrop');
  if (!drawer) return;

  renderCartDrawer();
  drawer.classList.remove('hidden');
  if (backdrop) backdrop.classList.remove('hidden');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-overlay-backdrop');
  if (drawer) drawer.classList.add('hidden');
  if (backdrop) backdrop.classList.add('hidden');
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');
  const shippingVal = document.getElementById('cart-shipping-val');
  const totalEl = document.getElementById('cart-total-val');
  const progressFill = document.getElementById('shipping-progress-fill');
  const progressText = document.getElementById('shipping-progress-text');

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👜</div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-main); margin-bottom: 0.3rem;">Your Shopping Bag is Empty</h4>
        <p style="font-size: 0.85rem;">Discover our collection of handcrafted timepieces, leatherware, and everyday luxury essentials.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(0);
    if (totalEl) totalEl.textContent = formatCurrency(0);
    if (discountRow) discountRow.classList.add('hidden');
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = `Add ${formatCurrency(200)} more for Free Worldwide Express Shipping`;
    return;
  }

  // Render items
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-meta">Color: ${item.color}</span>
        <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
      </div>
      <div class="cart-item-actions">
        <button class="btn-item-remove" data-idx="${index}">Remove</button>
        <div class="qty-control">
          <button class="btn-cart-minus" data-idx="${index}">&minus;</button>
          <span>${item.quantity}</span>
          <button class="btn-cart-plus" data-idx="${index}">&plus;</button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach item quantity & remove buttons
  container.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      updateCartQuantity(idx, -1);
    });
  });

  container.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      updateCartQuantity(idx, 1);
    });
  });

  container.querySelectorAll('.btn-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      removeCartItem(idx);
    });
  });

  // Calculate Subtotal & Shipping
  const subtotalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountUSD = (subtotalUSD * activeDiscountPercent) / 100;
  const isFreeShipping = subtotalUSD >= 200;
  const shippingUSD = isFreeShipping ? 0 : 25;
  const finalTotalUSD = subtotalUSD - discountUSD + shippingUSD;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotalUSD);

  if (discountRow && discountVal) {
    if (activeDiscountPercent > 0) {
      discountRow.classList.remove('hidden');
      discountVal.textContent = `-${formatCurrency(discountUSD)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (shippingVal) {
    shippingVal.textContent = isFreeShipping ? 'FREE (Express)' : formatCurrency(25);
    shippingVal.style.color = isFreeShipping ? 'var(--success)' : 'inherit';
  }

  if (totalEl) totalEl.textContent = formatCurrency(finalTotalUSD);

  // Free shipping progress bar
  if (progressFill && progressText) {
    const percent = Math.min((subtotalUSD / 200) * 100, 100);
    progressFill.style.width = `${percent}%`;

    if (isFreeShipping) {
      progressText.innerHTML = `✨ <strong>Complimentary Worldwide Shipping Unlocked!</strong>`;
      progressText.style.color = 'var(--success)';
    } else {
      const remaining = 200 - subtotalUSD;
      progressText.textContent = `Add ${formatCurrency(remaining)} more for Free Worldwide Express Shipping`;
      progressText.style.color = 'inherit';
    }
  }
}

/* ==========================================================================
   6. WISHLIST SYSTEM (LOCALSTORAGE)
   ========================================================================== */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
  } catch {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}

function toggleWishlist(productId) {
  const prod = allProductsData.find(p => p.id === productId);
  if (!prod) return;

  let wishlist = getWishlist();
  const exists = wishlist.some(w => w.id === productId);

  if (exists) {
    wishlist = wishlist.filter(w => w.id !== productId);
    saveWishlist(wishlist);
    showToast(`Removed "${prod.name}" from wishlist`, '💔');
  } else {
    wishlist.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image });
    saveWishlist(wishlist);
    showToast(`Saved "${prod.name}" to wishlist`, '♥');
  }

  // Update card buttons
  document.querySelectorAll(`.card-wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', !exists);
    btn.innerHTML = `<span>${!exists ? '♥' : '♡'}</span>`;
  });

  renderWishlistDrawer();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  const count = getWishlist().length;

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
}

function initWishlistDrawer() {
  const openBtn = document.getElementById('wishlist-toggle-btn');
  const closeBtn = document.getElementById('wishlist-close-btn');

  if (openBtn) openBtn.addEventListener('click', openWishlistDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeWishlistDrawer);

  updateWishlistBadge();
}

function openWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('drawer-overlay-backdrop');
  if (!drawer) return;

  renderWishlistDrawer();
  drawer.classList.remove('hidden');
  if (backdrop) backdrop.classList.remove('hidden');
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('drawer-overlay-backdrop');
  if (drawer) drawer.classList.add('hidden');
  if (backdrop) backdrop.classList.add('hidden');
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlist-items-list');
  const countEl = document.getElementById('drawer-wishlist-count');
  if (!container) return;

  const wishlist = getWishlist();
  if (countEl) countEl.textContent = wishlist.length;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">♡</div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-main); margin-bottom: 0.3rem;">Wishlist is Empty</h4>
        <p style="font-size: 0.85rem;">Tap the heart icon on any piece to curate your private collection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price">${formatCurrency(item.price)}</span>
      </div>
      <div class="cart-item-actions">
        <button class="btn btn-secondary btn-sm btn-wl-move" data-id="${item.id}">+ Move to Bag</button>
        <button class="btn-item-remove btn-wl-del" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-wl-move').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = allProductsData.find(p => p.id === id);
      if (prod) {
        addToCart(prod, 1, 'Standard');
        toggleWishlist(id);
      }
    });
  });

  container.querySelectorAll('.btn-wl-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      toggleWishlist(id);
    });
  });
}

/* ==========================================================================
   7. ORDER SUCCESS CHECKOUT CELEBRATION MODAL
   ========================================================================== */
function openOrderSuccessModal() {
  const modal = document.getElementById('order-success-modal');
  const summaryEl = document.getElementById('order-receipt-summary');
  const closeBtn = document.getElementById('order-success-close');
  const backdrop = document.getElementById('order-success-backdrop');

  if (!modal || !summaryEl) return;

  const cart = getCart();
  const orderNumber = 'LX-' + Math.floor(100000 + Math.random() * 900000);
  const subtotalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountUSD = (subtotalUSD * activeDiscountPercent) / 100;
  const shippingUSD = subtotalUSD >= 200 ? 0 : 25;
  const total = subtotalUSD - discountUSD + shippingUSD;

  summaryEl.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem; display: flex; justify-content: space-between;">
      <span>REQUISITION: <strong>${orderNumber}</strong></span>
      <span>DATE: ${new Date().toLocaleDateString()}</span>
    </div>
    <div style="border-top: 1px dashed var(--border-color); padding-top: 0.6rem; margin-bottom: 0.6rem;">
      ${cart.map(i => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>${i.name} &bull; ${i.color} &times; ${i.quantity}</span>
          <strong>${formatCurrency(i.price * i.quantity)}</strong>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px solid var(--border-color); padding-top: 0.6rem; display: flex; justify-content: space-between; font-weight: 800;">
      <span>Grand Total Charged:</span>
      <span style="color: var(--accent); font-size: 1.1rem;">${formatCurrency(total)}</span>
    </div>
  `;

  // Clear cart upon successful order
  saveCart([]);
  closeCartDrawer();

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  if (backdrop) backdrop.onclick = () => modal.classList.add('hidden');

  showToast('Order confirmed! Check your email.', '✨');
}

/* ==========================================================================
   8. ATELIER SOCIETY NEWSLETTER FORM
   ========================================================================== */
function initSocietyNewsletter() {
  const form = document.getElementById('society-form');
  const status = document.getElementById('society-status');

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('society-email');
      if (input && input.value) {
        status.classList.remove('hidden');
        input.value = '';
        showToast('Privilege unlocked! Use code LUXE10', '✨');
      }
    });
  }
}

/* ==========================================================================
   9. KEYBOARD EVENTS (ESCAPE CLOSE MODALS)
   ========================================================================== */
function initKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickViewModal();
      closeCartDrawer();
      closeWishlistDrawer();
      const orderModal = document.getElementById('order-success-modal');
      if (orderModal) orderModal.classList.add('hidden');
    }
  });
}

/* ==========================================================================
   10. FLOATING TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout;

function showToast(message, icon = '✓') {
  const toast = document.getElementById('luxe-toast');
  const textEl = document.getElementById('toast-text');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !textEl) return;

  textEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}
