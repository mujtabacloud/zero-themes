/**
 * Luxe Atelier - Luxury Storefront & E-Commerce Catalog
 * High-performance, zero-dependency ES6
 * Real-time cart drawer, dynamic currency conversion, multi-faceted filtering,
 * interactive quick-view modal, 1-Click Express Checkout, WhatsApp ordering,
 * and Recently Viewed history.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCurrencyConverter();
  initCatalog();
  initCartDrawer();
  initWishlistDrawer();
  initExpressCheckout();
  initRecentlyViewed();
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
    renderRecentlyViewed();
    showToast(`Currency updated to ${currentCurrency} (${CURRENCY_RATES[currentCurrency].symbol})`, '💱');
  });
}

function updateGlobalCurrencyDisplays() {
  const thresholdEl = document.getElementById('announcement-threshold');
  const calcThresholdEls = document.querySelectorAll('.calc-threshold');
  const thresholdVal = formatCurrency(200);

  if (thresholdEl) thresholdEl.textContent = thresholdVal;
  calcThresholdEls.forEach(el => el.textContent = thresholdVal);
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

const fallbackProducts = [
  {
    "id": "prod-1",
    "name": "Heritage Automatic Chronograph",
    "slug": "heritage-automatic-chronograph",
    "category": "timepieces",
    "categoryLabel": "Timepieces",
    "price": 380,
    "rating": 4.9,
    "reviews": 42,
    "badge": "Bestseller",
    "badgeType": "hot",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Mechanical automatic chronograph movement featuring a 41mm aerospace grade 316L stainless steel case, sapphire crystal with dual anti-reflective coating, and vegetable-tanned bridle leather strap.",
    "specs": {
      "Movement": "Calibre LX-740 Automatic (42hr reserve)",
      "Case Diameter": "41mm &bull; 11.2mm depth",
      "Glass": "Scratch-resistant Sapphire Crystal",
      "Water Resistance": "10 ATM (100 meters / 330 ft)"
    },
    "colors": [
      { "name": "Obsidian Black", "hex": "#18181b" },
      { "name": "Brushed Silver", "hex": "#cbd5e1" },
      { "name": "Rose Gold", "hex": "#b45309" }
    ],
    "inStock": true
  },
  {
    "id": "prod-2",
    "name": "Tuscan Bridle Leather Folio",
    "slug": "tuscan-bridle-leather-folio",
    "category": "leather",
    "categoryLabel": "Leatherware",
    "price": 220,
    "rating": 4.95,
    "reviews": 38,
    "badge": "Artisanal",
    "badgeType": "new",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Hand-stitched in Florence using full-grain Tuscan vegetable-tanned cowhide. Designed to carry a 14-inch or 16-inch laptop, legal documents, notebooks, and writing instruments with solid brass YKK Excella zippers.",
    "specs": {
      "Material": "100% Certified Tuscan Full-Grain Vachetta",
      "Hardware": "Solid Brushed Brass Hardware",
      "Dimensions": "38cm x 27cm x 3.5cm",
      "Compatibility": "Laptops up to 16-inch MacBook Pro"
    },
    "colors": [
      { "name": "Saddle Tan", "hex": "#92400e" },
      { "name": "Espresso Brown", "hex": "#382314" },
      { "name": "Jet Black", "hex": "#09090b" }
    ],
    "inStock": true
  },
  {
    "id": "prod-3",
    "name": "Titanium Wireless Studio Headphones",
    "slug": "titanium-wireless-studio-headphones",
    "category": "audio",
    "categoryLabel": "Audio & Optics",
    "price": 420,
    "rating": 4.88,
    "reviews": 56,
    "badge": "Audiophile",
    "badgeType": "hot",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Precision acoustical tuning with 45mm beryllium drivers, active hybrid noise cancellation, memory-foam lambskin ear cushions, and 38-hour battery longevity on a single charge.",
    "specs": {
      "Drivers": "45mm Custom Beryllium Dynamic",
      "Frequency Response": "10Hz - 42,000Hz (Hi-Res Certified)",
      "Battery Life": "38 hours ANC active &bull; Fast charge 15m=6h",
      "Connectivity": "Bluetooth 5.3 &bull; aptX Lossless &bull; 3.5mm"
    },
    "colors": [
      { "name": "Matte Slate", "hex": "#334155" },
      { "name": "Silver Anodized", "hex": "#94a3b8" },
      { "name": "Midnight", "hex": "#0f172a" }
    ],
    "inStock": true
  },
  {
    "id": "prod-4",
    "name": "Hand-Turned Brass Fountain Pen",
    "slug": "hand-turned-brass-fountain-pen",
    "category": "lifestyle",
    "categoryLabel": "Everyday Carry",
    "price": 145,
    "rating": 4.96,
    "reviews": 29,
    "badge": "Signature",
    "badgeType": "popular",
    "image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1585336261026-40713b2e53ef?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585336261026-40713b2e53ef?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Machined from a single rod of raw untreated solid brass that develops an exquisite individual patina over decades. Fitted with a German Peter Bock 18k gold-plated medium nib.",
    "specs": {
      "Weight": "58 grams (Gravitational balance)",
      "Nib": "German Peter Bock 18K Bi-Color Steel/Gold (M)",
      "Filling System": "Standard International Converter & Cartridge",
      "Finish": "Raw untreated unlacquered brass"
    },
    "colors": [
      { "name": "Raw Brass", "hex": "#d97706" },
      { "name": "Aged Copper", "hex": "#b45309" },
      { "name": "Gunmetal PVD", "hex": "#475569" }
    ],
    "inStock": true
  },
  {
    "id": "prod-5",
    "name": "Minimalist Card Wallet (RFID Shield)",
    "slug": "minimalist-card-wallet",
    "category": "leather",
    "categoryLabel": "Leatherware",
    "price": 85,
    "rating": 4.92,
    "reviews": 64,
    "badge": "Essential",
    "badgeType": "popular",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Slim, featherlight front-pocket card sleeve hand-cut from Cordovan leather with an integrated aerospace aluminum RFID blocking internal shield. Holds up to 8 cards plus folded currency.",
    "specs": {
      "Capacity": "6 to 8 cards + 6 folded bills",
      "Dimensions": "10.2cm x 6.8cm x 0.5cm (Ultra-slim)",
      "Protection": "13.56 MHz RFID / NFC Anti-Skimming",
      "Stitching": "Hand-waxed linen thread saddle-stitch"
    },
    "colors": [
      { "name": "Cognac", "hex": "#78350f" },
      { "name": "Forest Green", "hex": "#14532d" },
      { "name": "Carbon Black", "hex": "#18181b" }
    ],
    "inStock": true
  },
  {
    "id": "prod-6",
    "name": "Architectural Sunglasses (Polarized Zeiss)",
    "slug": "architectural-sunglasses-zeiss",
    "category": "audio",
    "categoryLabel": "Audio & Optics",
    "price": 260,
    "rating": 4.85,
    "reviews": 21,
    "badge": "Limited",
    "badgeType": "new",
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Crafted from Japanese cellulose acetate with reinforced 5-barrel German hinges. Equipped with Carl Zeiss Vision CR-39 polarized lenses offering 100% UVA/UVB protection and crystal visual acuity.",
    "specs": {
      "Frame Material": "Japanese Takiron Cellulose Acetate",
      "Lenses": "Carl Zeiss Vision Polarized Grey Cat. 3",
      "Hinges": "5-Barrel Teflon-coated stainless screws",
      "Includes": "Handmade leather hardshell case + microfiber"
    },
    "colors": [
      { "name": "Tokyo Tortoise", "hex": "#451a03" },
      { "name": "Matte Crystal", "hex": "#cbd5e1" },
      { "name": "Onyx Black", "hex": "#09090b" }
    ],
    "inStock": true
  },
  {
    "id": "prod-7",
    "name": "Weekender Duffle Bag in Waxed Canvas",
    "slug": "weekender-duffle-bag-waxed-canvas",
    "category": "leather",
    "categoryLabel": "Leatherware",
    "price": 310,
    "rating": 4.94,
    "reviews": 33,
    "badge": "Signature",
    "badgeType": "hot",
    "image": "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Heavyweight 18oz water-repellent Scottish waxed canvas trimmed with thick vegetable-tanned harness leather. Sized specifically to fit overhead carry-on dimensions on all global airlines.",
    "specs": {
      "Volume": "42 Liters capacity",
      "Dimensions": "52cm x 30cm x 28cm (IATA Carry-on compliant)",
      "Canvas": "18oz Halley Stevensons Waxed Cotton (Scotland)",
      "Straps": "Adjustable padded leather shoulder strap"
    },
    "colors": [
      { "name": "British Tan / Olive", "hex": "#3f462a" },
      { "name": "Charcoal / Black", "hex": "#1e293b" }
    ],
    "inStock": true
  },
  {
    "id": "prod-8",
    "name": "Desk Mat & Wireless Charging Pad",
    "slug": "desk-mat-wireless-charging-pad",
    "category": "lifestyle",
    "categoryLabel": "Everyday Carry",
    "price": 130,
    "rating": 4.89,
    "reviews": 47,
    "badge": "Modern",
    "badgeType": "popular",
    "image": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Dual-surface workspace mat made with premium vegan top-grain leather on top and natural non-slip cork underneath. Features an embedded 15W Qi fast wireless charging station for smartphones and earbuds.",
    "specs": {
      "Charging Station": "15W Qi-Certified Fast Wireless Pad",
      "Dimensions": "80cm x 40cm (Full desk coverage)",
      "Base": "Eco-friendly sustainable natural oak cork",
      "Cable": "2-meter braided USB-C power cable included"
    },
    "colors": [
      { "name": "Midnight Charcoal", "hex": "#1e293b" },
      { "name": "Cognac Tan", "hex": "#9a3412" }
    ],
    "inStock": true
  },
  {
    "id": "prod-9",
    "name": "Damascus Steel Santoku Chef Knife",
    "slug": "damascus-steel-santoku-knife",
    "category": "lifestyle",
    "categoryLabel": "Everyday Carry",
    "price": 295,
    "rating": 4.98,
    "reviews": 51,
    "badge": "Mastercraft",
    "badgeType": "hot",
    "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Forged in Seki, Japan using 67 alternating layers of VG-10 high-carbon Japanese stainless steel. Features a balanced octagonal stabilized bog oak handle with brass bolster.",
    "specs": {
      "Blade Steel": "67-Layer VG-10 Damascus (61±1 HRC)",
      "Blade Length": "180mm (7.1 inches)",
      "Edge Angle": "Hand-honed 15° per side (Honbazuke)",
      "Handle": "Stabilized European Bog Oak & Brass"
    },
    "colors": [
      { "name": "Dark Bog Oak", "hex": "#27272a" },
      { "name": "Desert Ironwood", "hex": "#713f12" }
    ],
    "inStock": true
  },
  {
    "id": "prod-10",
    "name": "Minimalist Solid Brass Task Lamp",
    "slug": "minimalist-solid-brass-task-lamp",
    "category": "lifestyle",
    "categoryLabel": "Everyday Carry",
    "price": 340,
    "rating": 4.91,
    "reviews": 19,
    "badge": "Architectural",
    "badgeType": "new",
    "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Counter-weighted cantilever desk lamp machined from heavy solid brass. Equipped with warm 2700K high-CRI LED matrix and capacitive touch dimming in the base.",
    "specs": {
      "Color Temperature": "2700K Warm Tungsten (98 CRI)",
      "Dimming": "Stepless capacitive touch sensor",
      "Material": "Solid Turned Unlacquered Brass",
      "Lifespan": "50,000 hour integrated LED module"
    },
    "colors": [
      { "name": "Brushed Brass", "hex": "#d97706" },
      { "name": "Matte Obsidian", "hex": "#18181b" }
    ],
    "inStock": true
  },
  {
    "id": "prod-11",
    "name": "Custom Mechanical Keyboard (Brass Plate)",
    "slug": "custom-mechanical-keyboard-brass-plate",
    "category": "audio",
    "categoryLabel": "Audio & Optics",
    "price": 320,
    "rating": 4.97,
    "reviews": 73,
    "badge": "Enthusiast",
    "badgeType": "hot",
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "CNC milled from a 2.4kg block of 6063 aluminum with an internal polished brass weight and gasket-mounted acoustic dampening. Factory lubricated linear mechanical switches.",
    "specs": {
      "Layout": "75% Exploded Compact with Rotary Knob",
      "Mounting": "Poron Gasket with Solid Brass Switch Plate",
      "Switches": "Pre-lubricated Gateron Oil King Linears",
      "Connection": "USB-C &bull; 2.4GHz Wireless &bull; Bluetooth 5.2"
    },
    "colors": [
      { "name": "Anodized Silver", "hex": "#94a3b8" },
      { "name": "Space Grey", "hex": "#334155" },
      { "name": "E-White", "hex": "#f8fafc" }
    ],
    "inStock": true
  },
  {
    "id": "prod-12",
    "name": "Fine Mongolian Cashmere Travel Throw",
    "slug": "fine-mongolian-cashmere-travel-throw",
    "category": "lifestyle",
    "categoryLabel": "Everyday Carry",
    "price": 190,
    "rating": 4.87,
    "reviews": 24,
    "badge": "Heirloom",
    "badgeType": "popular",
    "image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Spun from 100% Grade-A Mongolian cashmere fibers under 15 microns in fineness. Includes a vegetable-tanned bridle leather carrying strap for journeys and flights.",
    "specs": {
      "Fiber": "100% Sustainable Grade-A Inner Mongolian Cashmere",
      "Fineness": "14.5 Microns (Supreme softness)",
      "Dimensions": "180cm x 135cm",
      "Carrying Harness": "Included detachable English bridle leather strap"
    },
    "colors": [
      { "name": "Oatmeal Melange", "hex": "#d6cfc7" },
      { "name": "Charcoal Heather", "hex": "#3f3f46" },
      { "name": "Deep Camel", "hex": "#a16207" }
    ],
    "inStock": true
  }
];

function initCatalog() {
  fetch('./assets/data/products.json')
    .then(res => res.json())
    .then(data => {
      allProductsData = data;
      renderProducts();
      renderRecentlyViewed();
    })
    .catch(() => {
      allProductsData = fallbackProducts;
      renderProducts();
      renderRecentlyViewed();
    });

  // Category Filter Pills (Toolbar & Header & Footer)
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
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(currentSearchQuery)) ||
      (p.description && p.description.toLowerCase().includes(currentSearchQuery));

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
          <img src="${prod.image}" alt="${prod.name}" class="img-primary" loading="lazy">
          ${prod.hoverImage ? `<img src="${prod.hoverImage}" alt="${prod.name} alternate view" class="img-hover" loading="lazy">` : ''}
          ${prod.badge ? `<span class="card-badge ${prod.badgeType || ''}">${prod.badge}</span>` : ''}
          <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="${isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}">
            <span>${isWishlisted ? '♥' : '♡'}</span>
          </button>
          <div class="card-quickview-overlay">
            <button class="btn-quickview" data-id="${prod.id}">Quick View</button>
            <button class="btn-card-buy-now" data-id="${prod.id}">⚡ Buy Now</button>
          </div>
        </div>

        <div class="card-details">
          <div class="card-category-row">
            <span class="card-category">${prod.categoryLabel || prod.category}</span>
            <div class="card-rating">
              <span>★</span>
              <strong>${Number(prod.rating).toFixed(2)}</strong>
              <span class="review-count">(${prod.reviews || 24})</span>
            </div>
          </div>
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
            <div class="card-actions-group">
              <button class="btn-add-bag" data-id="${prod.id}" title="Add to bag">+ Bag</button>
              <button class="btn-buy-now-direct" data-id="${prod.id}" title="Instant 1-Click Checkout">⚡ Buy Now</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  attachCardEvents();
}

function attachCardEvents() {
  // Quick View triggers & Name clicks
  document.querySelectorAll('.btn-quickview, .card-name').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = el.getAttribute('data-id');
      addRecentlyViewed(id);
      openQuickViewModal(id);
    });
  });

  // Direct Buy Now buttons
  document.querySelectorAll('.btn-buy-now-direct, .btn-card-buy-now').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = allProductsData.find(p => p.id === id);
      if (!prod) return;
      addRecentlyViewed(id);
      const color = selectedColors[id] || (prod.colors && prod.colors[0] ? prod.colors[0].name : 'Standard');
      openCheckoutModal(id, { color: color, quantity: 1 });
    });
  });

  // Add to Bag buttons
  document.querySelectorAll('.btn-add-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const prod = allProductsData.find(p => p.id === id);
      if (!prod) return;
      addRecentlyViewed(id);
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

  addRecentlyViewed(prod.id);

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
        <div class="card-category-row" style="margin-bottom: 0.3rem;">
          <span class="qv-category">${prod.categoryLabel || prod.category}</span>
          <div class="card-rating">
            <span>★</span>
            <strong>${Number(prod.rating).toFixed(2)}</strong>
            <span class="review-count">(${prod.reviews || 24} reviews)</span>
          </div>
        </div>
        <h2 class="qv-title">${prod.name}</h2>
      </div>

      <div class="qv-price-row">
        <span id="qv-price-val" style="color: var(--accent); font-size: 1.4rem; font-weight: 800;">${formatCurrency(prod.price)}</span>
        <span style="font-size: 0.85rem; color: #10b981; font-weight: 700;">● In Stock &bull; Ready for Courier Dispatch</span>
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
              <span class="color-dot ${c.name === selectedModalColor ? 'active' : ''}" style="background-color: ${c.hex}; width: 22px; height: 22px;" title="${c.name}" data-color="${c.name}"></span>
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
        <button id="qv-btn-buynow" class="btn btn-buy-now-direct btn-block" style="padding: 0.75rem; font-size: 0.95rem;">⚡ Buy Now (Express 1-Click Checkout)</button>
        <button id="qv-btn-add" class="btn btn-primary btn-block">+ Add to Shopping Bag &bull; ${formatCurrency(prod.price)}</button>
        <button id="qv-btn-whatsapp" class="btn btn-whatsapp btn-block">
          <span>💬 Inquire &amp; Order on WhatsApp</span>
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
      if (btnAdd) btnAdd.textContent = `+ Add to Shopping Bag • ${formatCurrency(prod.price * modalQty)}`;
    }
  });

  document.getElementById('qv-qty-plus').addEventListener('click', () => {
    modalQty++;
    if (qtyVal) qtyVal.textContent = modalQty;
    if (btnAdd) btnAdd.textContent = `+ Add to Shopping Bag • ${formatCurrency(prod.price * modalQty)}`;
  });

  // Direct 1-Click Buy Now
  document.getElementById('qv-btn-buynow').addEventListener('click', () => {
    closeQuickViewModal();
    openCheckoutModal(prod.id, {
      color: selectedModalColor,
      quantity: modalQty
    });
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

  // Proceed to Express Checkout Modal
  const btnStripe = document.getElementById('btn-stripe-checkout');
  if (btnStripe) {
    btnStripe.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('Your shopping bag is empty', '⚠️');
        return;
      }
      closeCartDrawer();
      openCheckoutModal('cart');
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
   6. 1-CLICK STREAMLINED EXPRESS CHECKOUT SYSTEM
   ========================================================================== */
let checkoutManifestItems = [];
let isCheckoutSingleItem = false;
let checkoutSelectedMethod = 'card';

function initExpressCheckout() {
  const modal = document.getElementById('express-checkout-modal');
  const closeBtn = document.getElementById('checkout-close-btn');
  const backdrop = document.getElementById('checkout-backdrop');
  const autofillBtn = document.getElementById('btn-autofill-demo');
  const submitBtn = document.getElementById('btn-submit-order');
  const cardRadio = document.getElementById('pay-method-card');
  const whatsappRadio = document.getElementById('pay-method-whatsapp');
  const cardLabel = document.getElementById('pay-opt-card-label');
  const whatsappLabel = document.getElementById('pay-opt-whatsapp-label');
  const cardWrapper = document.getElementById('card-fields-wrapper');
  const whatsappWrapper = document.getElementById('whatsapp-notice-wrapper');
  const promoInput = document.getElementById('checkout-promo-input');
  const promoBtn = document.getElementById('checkout-apply-promo-btn');
  const promoFeedback = document.getElementById('checkout-promo-feedback');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);
  if (backdrop) backdrop.addEventListener('click', closeCheckoutModal);

  // Auto-Fill Demo Button
  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      document.getElementById('chk-email').value = 'alexander.vance@atelier-society.com';
      document.getElementById('chk-phone').value = '+1 (212) 555-0198';
      document.getElementById('chk-name').value = 'Alexander Vance';
      document.getElementById('chk-address').value = '740 Park Avenue, Penthouse B';
      document.getElementById('chk-city').value = 'New York';
      document.getElementById('chk-postal').value = '10021';
      document.getElementById('chk-country').value = 'United States';
      
      const cardNum = document.getElementById('chk-card-num');
      const cardExp = document.getElementById('chk-card-exp');
      const cardCvc = document.getElementById('chk-card-cvc');
      if (cardNum) cardNum.value = '4242 8899 4432 1084';
      if (cardExp) cardExp.value = '10/28';
      if (cardCvc) cardCvc.value = '739';

      showToast('Demo patron details populated!', '⚡');
    });
  }

  // Payment Method Toggles
  function updatePaymentMethod(method) {
    checkoutSelectedMethod = method;
    if (cardLabel) cardLabel.classList.toggle('active', method === 'card');
    if (whatsappLabel) whatsappLabel.classList.toggle('active', method === 'whatsapp');
    if (cardWrapper) cardWrapper.classList.toggle('hidden', method !== 'card');
    if (whatsappWrapper) whatsappWrapper.classList.toggle('hidden', method !== 'whatsapp');

    const submitLabel = document.getElementById('btn-submit-label');
    const totalUSD = calculateCheckoutTotal();
    if (submitLabel) {
      if (method === 'whatsapp') {
        submitLabel.textContent = `Direct WhatsApp Requisition • ${formatCurrency(totalUSD)}`;
      } else {
        submitLabel.textContent = `Confirm Requisition • ${formatCurrency(totalUSD)}`;
      }
    }
  }

  if (cardRadio) {
    cardRadio.addEventListener('change', () => updatePaymentMethod('card'));
  }
  if (whatsappRadio) {
    whatsappRadio.addEventListener('change', () => updatePaymentMethod('whatsapp'));
  }

  // Checkout Promo Code
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'LUXE10' || code === 'ZERO10') {
        activeDiscountPercent = 10;
        if (promoFeedback) {
          promoFeedback.className = 'promo-feedback-inline success';
          promoFeedback.textContent = '✓ 10% Society Privilege applied!';
          promoFeedback.classList.remove('hidden');
        }
        updateCheckoutManifestTotals();
        renderCartDrawer();
        showToast('10% Privilege Applied!', '🎉');
      } else {
        if (promoFeedback) {
          promoFeedback.className = 'promo-feedback-inline error';
          promoFeedback.textContent = 'Invalid promo code. Try LUXE10';
          promoFeedback.classList.remove('hidden');
        }
      }
    });
  }

  // Submit Requisition Handler
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const email = document.getElementById('chk-email').value.trim();
      const phone = document.getElementById('chk-phone').value.trim();
      const name = document.getElementById('chk-name').value.trim();
      const address = document.getElementById('chk-address').value.trim();
      const city = document.getElementById('chk-city').value.trim();
      const postal = document.getElementById('chk-postal').value.trim();
      const country = document.getElementById('chk-country').value;

      if (!email || !name || !address || !city || !postal) {
        showToast('Please complete required contact & delivery fields', '⚠️');
        return;
      }

      const totalUSD = calculateCheckoutTotal();
      const orderNumber = 'LX-' + Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        orderNumber: orderNumber,
        patronName: name,
        patronEmail: email,
        patronPhone: phone,
        shippingAddress: `${address}, ${city}, ${postal}, ${country}`,
        items: [...checkoutManifestItems],
        totalUSD: totalUSD,
        paymentMethod: checkoutSelectedMethod === 'whatsapp' ? 'WhatsApp Direct Requisition' : 'Direct Encrypted Card (Simulated)'
      };

      if (checkoutSelectedMethod === 'whatsapp') {
        let text = `*LUXE ATELIER BESPOKE REQUISITION*%0A` +
                   `Order: ${orderNumber}%0A` +
                   `Patron: ${name}%0A` +
                   `Delivery: ${address}, ${city}, ${postal}, ${country}%0A` +
                   `------------------------------------%0A`;

        checkoutManifestItems.forEach((item, idx) => {
          text += `${idx + 1}. ${item.name} (${item.color}) x${item.quantity} - ${formatCurrency(item.price * item.quantity)}%0A`;
        });
        text += `------------------------------------%0A` +
                `*Total:* ${formatCurrency(totalUSD)} (${currentCurrency})%0A` +
                `Please confirm dispatch timeline and provide secure payment link.`;

        window.open(`https://wa.me/?text=${text}`, '_blank');

        if (!isCheckoutSingleItem) {
          saveCart([]);
        }
        closeCheckoutModal();
        openOrderSuccessModal(orderData);
      } else {
        // Credit card / instant checkout
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Requisition...</span>';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          if (!isCheckoutSingleItem) {
            saveCart([]);
          }
          closeCheckoutModal();
          openOrderSuccessModal(orderData);
        }, 650);
      }
    });
  }
}

function calculateCheckoutTotal() {
  const subtotal = checkoutManifestItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const discount = (subtotal * activeDiscountPercent) / 100;
  const shipping = subtotal >= 200 ? 0 : 25;
  return subtotal - discount + shipping;
}

function openCheckoutModal(target, singleConfig) {
  const modal = document.getElementById('express-checkout-modal');
  if (!modal) return;

  if (target === 'cart') {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your shopping bag is empty', '⚠️');
      return;
    }
    checkoutManifestItems = [...cart];
    isCheckoutSingleItem = false;
  } else {
    // Single product ID
    const prod = allProductsData.find(p => p.id === target);
    if (!prod) return;
    checkoutManifestItems = [{
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      color: singleConfig?.color || 'Standard',
      quantity: singleConfig?.quantity || 1
    }];
    isCheckoutSingleItem = true;
  }

  renderCheckoutManifestItems();
  updateCheckoutManifestTotals();

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('express-checkout-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderCheckoutManifestItems() {
  const listEl = document.getElementById('checkout-items-list');
  if (!listEl) return;

  listEl.innerHTML = checkoutManifestItems.map(item => `
    <div class="chk-item">
      <img src="${item.image}" alt="${item.name}" class="chk-item-img">
      <div class="chk-item-meta">
        <span class="chk-item-title">${item.name}</span>
        <span class="chk-item-sub">Color: ${item.color} &bull; Qty: ${item.quantity}</span>
      </div>
      <span class="chk-item-price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');
}

function updateCheckoutManifestTotals() {
  const subtotalEl = document.getElementById('chk-subtotal-val');
  const discountRow = document.getElementById('chk-discount-row');
  const discountVal = document.getElementById('chk-discount-val');
  const shippingEl = document.getElementById('chk-shipping-val');
  const totalEl = document.getElementById('chk-total-val');
  const submitLabel = document.getElementById('btn-submit-label');

  const subtotalUSD = checkoutManifestItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const discountUSD = (subtotalUSD * activeDiscountPercent) / 100;
  const isFree = subtotalUSD >= 200;
  const shippingUSD = isFree ? 0 : 25;
  const totalUSD = subtotalUSD - discountUSD + shippingUSD;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotalUSD);

  if (discountRow && discountVal) {
    if (activeDiscountPercent > 0) {
      discountRow.classList.remove('hidden');
      discountVal.textContent = `-${formatCurrency(discountUSD)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (shippingEl) {
    shippingEl.textContent = isFree ? 'FREE (Express Courier)' : formatCurrency(25);
    shippingEl.style.color = isFree ? 'var(--success)' : 'inherit';
  }

  if (totalEl) totalEl.textContent = formatCurrency(totalUSD);

  if (submitLabel) {
    if (checkoutSelectedMethod === 'whatsapp') {
      submitLabel.textContent = `Direct WhatsApp Requisition • ${formatCurrency(totalUSD)}`;
    } else {
      submitLabel.textContent = `Confirm Requisition • ${formatCurrency(totalUSD)}`;
    }
  }
}

/* ==========================================================================
   7. RECENTLY VIEWED OBJECTS SHELF
   ========================================================================== */
function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
  } catch {
    return [];
  }
}

function addRecentlyViewed(productId) {
  let list = getRecentlyViewed();
  list = list.filter(id => id !== productId);
  list.unshift(productId);
  if (list.length > 4) list = list.slice(0, 4);
  localStorage.setItem('luxe_recently_viewed', JSON.stringify(list));
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const section = document.getElementById('recently-viewed-section');
  const grid = document.getElementById('recently-viewed-grid');
  if (!section || !grid) return;

  const list = getRecentlyViewed();
  if (list.length === 0 || allProductsData.length === 0) {
    section.classList.add('hidden');
    return;
  }

  const items = list.map(id => allProductsData.find(p => p.id === id)).filter(Boolean);
  if (items.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  grid.innerHTML = items.map(prod => `
    <div class="product-card" style="font-size: 0.9rem;" data-id="${prod.id}">
      <div class="card-media" style="height: 200px;">
        <img src="${prod.image}" alt="${prod.name}" class="img-primary" loading="lazy">
        ${prod.hoverImage ? `<img src="${prod.hoverImage}" alt="${prod.name}" class="img-hover" loading="lazy">` : ''}
        <div class="card-quickview-overlay">
          <button class="btn-quickview" data-id="${prod.id}">Inspect</button>
        </div>
      </div>
      <div class="card-details" style="padding: 0.8rem;">
        <span class="card-category" style="font-size: 0.68rem;">${prod.categoryLabel || prod.category}</span>
        <h4 class="card-name" data-id="${prod.id}" style="font-size: 0.95rem; margin-bottom: 0.4rem;">${prod.name}</h4>
        <div class="card-pricing-row" style="padding-top: 0.4rem;">
          <span class="card-price" style="font-size: 1rem;">${formatCurrency(prod.price)}</span>
          <button class="btn-add-bag" data-id="${prod.id}">+ Bag</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-quickview, .card-name').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      openQuickViewModal(id);
    });
  });

  grid.querySelectorAll('.btn-add-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = allProductsData.find(p => p.id === id);
      if (prod) addToCart(prod, 1, 'Standard');
    });
  });
}

/* ==========================================================================
   8. WISHLIST SYSTEM (LOCALSTORAGE)
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
   9. ORDER SUCCESS CHECKOUT CELEBRATION MODAL
   ========================================================================== */
function openOrderSuccessModal(orderData) {
  const modal = document.getElementById('order-success-modal');
  const summaryEl = document.getElementById('order-receipt-summary');
  const closeBtn = document.getElementById('order-success-close');
  const backdrop = document.getElementById('order-success-backdrop');
  const printBtn = document.getElementById('btn-print-receipt');

  if (!modal || !summaryEl) return;

  const data = orderData || {
    orderNumber: 'LX-' + Math.floor(100000 + Math.random() * 900000),
    patronName: 'Distinguished Patron',
    patronEmail: 'patron@luxe-atelier.com',
    shippingAddress: 'Express Atelier Courier Dispatch',
    items: getCart(),
    totalUSD: 0,
    paymentMethod: 'Encrypted Atelier Payment'
  };

  summaryEl.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
      <span>REQUISITION: <strong>${data.orderNumber}</strong></span>
      <span>DATE: ${new Date().toLocaleDateString()}</span>
    </div>
    <div style="font-size: 0.82rem; margin-bottom: 0.8rem; color: var(--text-muted); line-height: 1.5; background: var(--bg-surface-elevated); padding: 0.7rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <div><strong>Patron:</strong> ${data.patronName} (${data.patronEmail})</div>
      <div><strong>Delivery Destination:</strong> ${data.shippingAddress}</div>
      <div><strong>Orchestration:</strong> ${data.paymentMethod}</div>
    </div>
    <div style="border-top: 1px dashed var(--border-color); padding-top: 0.6rem; margin-bottom: 0.6rem;">
      ${data.items.map(i => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.84rem;">
          <span>${i.name} &bull; ${i.color} &times; ${i.quantity}</span>
          <strong>${formatCurrency(i.price * i.quantity)}</strong>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px solid var(--border-color); padding-top: 0.6rem; display: flex; justify-content: space-between; font-weight: 800;">
      <span>Total Requisition Value:</span>
      <span style="color: var(--accent); font-size: 1.15rem;">${formatCurrency(data.totalUSD)}</span>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  if (backdrop) backdrop.onclick = () => modal.classList.add('hidden');
  if (printBtn) printBtn.onclick = () => window.print();

  showToast('Requisition logged successfully!', '✨');
}

/* ==========================================================================
   10. ATELIER SOCIETY NEWSLETTER FORM
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
   11. KEYBOARD EVENTS (ESCAPE CLOSE MODALS)
   ========================================================================== */
function initKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickViewModal();
      closeCartDrawer();
      closeWishlistDrawer();
      closeCheckoutModal();
      const orderModal = document.getElementById('order-success-modal');
      if (orderModal) orderModal.classList.add('hidden');
    }
  });
}

/* ==========================================================================
   12. FLOATING TOAST NOTIFICATION HELPER
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
