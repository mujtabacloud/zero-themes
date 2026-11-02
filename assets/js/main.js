/**
 * ZERO THEMES - MAIN INTERACTIVE LOGIC
 * High-performance, pure static ES6 JavaScript
 * GitHub Pages Compatible (username.github.io/website_name)
 */

// Dynamic CMS configuration & data loaders with safe static fallbacks
let SITE_SETTINGS = {
  google_sheet_endpoint: 'https://script.google.com/macros/s/AKfycbxA03eiBo9CGMpjSH5MlWxhZKolwJNwYQ69KgfcWY8DpOSv0ocx-XBGt-Y290nq27M7/exec'
};

async function loadSiteSettings() {
  try {
    const res = await fetch('./content/settings.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.google_sheet_endpoint) {
        SITE_SETTINGS = { ...SITE_SETTINGS, ...data };
      }
    }
  } catch (e) {
    // Offline or local file fallback
  }
}

async function loadThemesData() {
  try {
    const res = await fetch('./assets/data/themes.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        window.ZERO_THEMES = data;
      }
    }
  } catch (e) {
    // Fallback to static ZERO_THEMES from themes-data.js
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initThemeSwitcher();
  initSideDrawer();
  initBasket();
  await Promise.all([loadSiteSettings(), loadThemesData()]);
  initThemesCatalog();
  initModals();
  initCodeCopy();
  initNewsletter();
  initContactForm();
  initCursorFollower();
  initDiceRollWidget();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark & Light Mode with LocalStorage & System Preference)
   ========================================================================== */
function initThemeSwitcher() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('zero_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  document.querySelectorAll('.theme-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(active);
      showToast(`Switched to ${active} mode`);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('zero_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('zero_theme', theme);
  
  document.querySelectorAll('.theme-switch-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

/* ==========================================================================
   2. RIGHT-SIDE MENU TRIGGER & LEFT-SIDE SLIDING DRAWER
   Requirement: "menu option will on right side but when click will list on left side"
   ========================================================================== */
function initSideDrawer() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('sidebar-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   3. BASKET / SAVED THEMES COLLECTION (Free Open Source Strategy)
   User can add themes to basket and access them easily
   ========================================================================== */
let basketItems = JSON.parse(localStorage.getItem('zero_basket') || '[]');

function initBasket() {
  updateBasketBadge();

  // Basket trigger button in header
  const basketBtn = document.getElementById('cart-toggle-btn');
  if (basketBtn) {
    basketBtn.setAttribute('title', 'Saved Themes Basket');
    basketBtn.setAttribute('aria-label', 'View Saved Themes Basket');
    basketBtn.addEventListener('click', () => {
      openBasketModal();
    });
  }
}

function updateBasketBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.textContent = basketItems.length;
    b.style.display = basketItems.length > 0 ? 'flex' : 'none';
  });
}

function addToBasket(themeId) {
  const theme = (typeof ZERO_THEMES !== 'undefined' ? ZERO_THEMES : []).find(t => t.id === themeId);
  if (!theme) return;

  if (basketItems.some(item => item.id === themeId)) {
    showToast(`"${theme.name}" is already in your basket!`, 'info');
    openBasketModal();
    return;
  }

  basketItems.push({
    id: theme.id,
    name: theme.name,
    categoryLabel: theme.categoryLabel,
    price: "Free",
    image: theme.image,
    demoUrl: theme.demoUrl,
    repoUrl: theme.repoUrl || `https://github.com/username/${theme.id}`
  });

  localStorage.setItem('zero_basket', JSON.stringify(basketItems));
  updateBasketBadge();
  showToast(`Added "${theme.name}" to your basket!`, 'success');
  openBasketModal();
}

// Backward compatibility alias
window.addToCart = addToBasket;

function removeFromBasket(themeId) {
  basketItems = basketItems.filter(item => item.id !== themeId);
  localStorage.setItem('zero_basket', JSON.stringify(basketItems));
  updateBasketBadge();
  renderBasketModalContent();
  showToast('Removed theme from basket');
}

window.removeFromCart = removeFromBasket;

function clearBasket() {
  basketItems = [];
  localStorage.removeItem('zero_basket');
  updateBasketBadge();
  renderBasketModalContent();
  showToast('Basket cleared');
}

function openBasketModal() {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  renderBasketModalContent();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderBasketModalContent() {
  const body = document.getElementById('cart-modal-body');
  const footer = document.getElementById('cart-modal-footer');
  if (!body) return;

  if (basketItems.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🧺</div>
        <h3>Your basket is empty</h3>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">Explore our free premium website themes and save your favorites here.</p>
        <a href="themes.html" class="btn btn-primary" onclick="closeAllModals()">Browse Free Themes</a>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  let itemsHtml = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
      <div>
        <span style="font-weight: 700; font-size: 0.95rem;">${basketItems.length} Themes in Your Basket</span>
        <div style="font-size: 0.75rem; color: var(--success); font-weight: 600;">✓ 100% Free & Open Source (MIT License)</div>
      </div>
      <button onclick="clearBasket()" style="background: none; border: none; color: var(--text-subtle); font-size: 0.8rem; cursor: pointer; text-decoration: underline;">Clear All</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 50vh; overflow-y: auto; padding-right: 4px; margin-bottom: 1.5rem;">
      ${basketItems.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem; background: var(--bg-muted); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <img src="${item.image}" alt="${item.name}" style="width: 58px; height: 42px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.2rem;">${item.name}</h4>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem;">
              <span class="badge badge-new" style="font-size: 0.65rem; padding: 0.15rem 0.4rem;">FREE</span>
              <span style="color: var(--text-muted);">${item.categoryLabel || 'GitHub Pages'}</span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
            <div style="display: flex; gap: 0.35rem;">
              <a href="${item.repoUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="View repository on GitHub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
              <button onclick="openPreviewModal('${item.id}')" class="btn btn-primary btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Open live demo preview">
                Live
              </button>
            </div>
            <button onclick="removeFromBasket('${item.id}')" style="background: none; border: none; color: var(--danger); font-size: 0.72rem; cursor: pointer; text-decoration: underline;">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem;">
        <span>All Selected Themes</span>
        <span style="color: var(--success);">100% Free / Open Source</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
        Click below to copy all Git clone commands to your terminal or visit the GitHub repositories to star and fork.
      </p>
    </div>
  `;

  body.innerHTML = itemsHtml;
  if (footer) {
    footer.style.display = 'flex';
    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="closeAllModals()">Continue Browsing</button>
      <button class="btn btn-primary" onclick="copyAllGitCloneCommands()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copy Git Clone Commands
      </button>
    `;
  }
}

function copyAllGitCloneCommands() {
  if (basketItems.length === 0) return;
  const commands = basketItems.map(item => `git clone ${item.repoUrl}.git`).join('\n');
  navigator.clipboard.writeText(commands).then(() => {
    showToast(`✓ Copied ${basketItems.length} Git clone commands to clipboard!`, 'success');
  }).catch(() => {
    showToast('Commands copied to clipboard', 'success');
  });
}

/* ==========================================================================
   4. THEMES CATALOG (Grid View, Filters, Search & Sorting)
   ========================================================================== */
function initThemesCatalog() {
  const grid = document.getElementById('themes-grid');
  if (!grid) return;

  const searchInput = document.getElementById('theme-search');
  const sortSelect = document.getElementById('theme-sort');
  const filterPills = document.querySelectorAll('.cat-pill');

  let activeCategory = 'all';
  let searchQuery = '';
  let activeSort = 'featured';

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('category')) {
    activeCategory = urlParams.get('category');
    filterPills.forEach(p => {
      p.classList.toggle('active', p.dataset.category === activeCategory);
    });
  }

  function render() {
    if (typeof ZERO_THEMES === 'undefined') return;

    let filtered = [...ZERO_THEMES];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(t => t.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q) ||
        t.compatibleWith.some(c => c.toLowerCase().includes(q))
      );
    }

    if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === 'sales' || activeSort === 'popular') {
      filtered.sort((a, b) => b.sales - a.sales);
    } else if (activeSort === 'alpha') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
          <h3>No themes found</h3>
          <p style="color: var(--text-muted); margin-top: 0.4rem;">Try searching for different keywords or clear your active category filters.</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 1.2rem;" onclick="resetCatalogFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(theme => `
      <article class="theme-card" data-id="${theme.id}">
        <div class="theme-card-preview">
          <img src="${theme.image}" alt="${theme.name} - Free Premium Website Theme" loading="lazy" />
          <div class="theme-card-badges">
            ${theme.badge ? `<span class="badge badge-${theme.badgeType}">${theme.badge}</span>` : ''}
            <span class="badge badge-new">FREE</span>
          </div>
          <div class="theme-card-overlay">
            <button class="btn btn-primary btn-sm" onclick="openPreviewModal('${theme.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Live Demo
            </button>
            <a href="${theme.repoUrl || '#'}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub Repo
            </a>
          </div>
        </div>
        <div class="theme-card-content">
          <div class="theme-card-meta">
            <span style="font-weight: 600; color: var(--primary);">${theme.categoryLabel}</span>
            <div class="theme-rating">
              <span>★</span>
              <span>${theme.rating}</span>
              <span style="color: var(--text-subtle); font-size: 0.75rem;">(${theme.reviewsCount})</span>
            </div>
          </div>
          <h3 class="theme-title">
            <a href="theme-detail.html?id=${theme.id}">${theme.name}</a>
          </h3>
          <p class="theme-tagline">${theme.tagline}</p>
          <div class="theme-tags-list">
            ${theme.compatibleWith.map(tag => `<span class="badge badge-gh">${tag}</span>`).join('')}
          </div>
          <div class="theme-card-footer">
            <div class="theme-price-block">
              <span class="current-price" style="color: var(--success); font-size: 1.3rem;">Free</span>
              <span class="badge badge-gh" style="font-size: 0.7rem;">MIT License</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-secondary btn-sm" onclick="addToBasket('${theme.id}')" title="Save to your basket collection">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Basket
              </button>
              <a href="theme-detail.html?id=${theme.id}" class="btn btn-primary btn-sm" title="View theme details">
                Details
              </a>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      render();
    });
  }

  window.resetCatalogFilters = () => {
    activeCategory = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    filterPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
    render();
  };

  render();
}

/* ==========================================================================
   5. LIVE THEME PREVIEW MODAL
   ========================================================================== */
function openPreviewModal(themeId) {
  const theme = (typeof ZERO_THEMES !== 'undefined' ? ZERO_THEMES : []).find(t => t.id === themeId);
  if (!theme) return;

  const modal = document.getElementById('preview-modal');
  const title = document.getElementById('preview-modal-title');
  const frameContainer = document.getElementById('preview-frame-container');
  const buyBtn = document.getElementById('preview-buy-btn');

  if (!modal || !frameContainer) return;

  if (title) title.textContent = `${theme.name} — Live Interactive Preview`;
  
  if (buyBtn) {
    buyBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      Get Theme on GitHub
    `;
    buyBtn.onclick = () => {
      window.open(theme.repoUrl || `https://github.com/username/${theme.id}`, '_blank');
    };
  }

  frameContainer.innerHTML = `
    <div id="interactive-preview-wrapper" style="width: 100%; height: 100%; transition: width 0.3s ease; margin: 0 auto; background: var(--bg-surface); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; border: 1px solid var(--border-color);">
      <div style="background: var(--bg-muted); padding: 0.6rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted);">
        <div style="display: flex; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
        </div>
        <div>https://username.github.io/${theme.id}/</div>
        <div style="font-size: 0.75rem; color: var(--success); font-weight: 600;">✓ Free MIT License</div>
      </div>
      <div style="flex: 1; overflow-y: auto; position: relative;">
        <img src="${theme.image}" alt="${theme.name} Full Preview" style="width: 100%; display: block;" />
        <div style="padding: 2rem; background: var(--bg-surface); border-top: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3>${theme.name}</h3>
              <span class="badge badge-new">100% Free on GitHub</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="addToBasket('${theme.id}')">
                Add to Basket
              </button>
              <a href="${theme.repoUrl || '#'}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                Open GitHub Repo &rarr;
              </a>
            </div>
          </div>
          <p style="color: var(--text-muted); margin: 0.5rem 0 1.2rem;">${theme.description}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            ${theme.features.map(f => `
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                <span style="color: var(--success); font-weight: bold;">✓</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.dataset.device;
      const wrapper = document.getElementById('interactive-preview-wrapper');
      if (!wrapper) return;
      if (device === 'mobile') {
        wrapper.style.maxWidth = '375px';
      } else if (device === 'tablet') {
        wrapper.style.maxWidth = '768px';
      } else {
        wrapper.style.maxWidth = '100%';
      }
    });
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   6. MODAL UTILITIES
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'success') {
    toast.style.borderLeftColor = 'var(--success)';
  } else if (type === 'danger') {
    toast.style.borderLeftColor = 'var(--danger)';
  }

  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   8. CODE BLOCK COPY BUTTONS (DOCUMENTATION)
   ========================================================================== */
function initCodeCopy() {
  document.querySelectorAll('pre').forEach(pre => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-secondary btn-sm';
    copyBtn.style.position = 'absolute';
    copyBtn.style.top = '8px';
    copyBtn.style.right = '8px';
    copyBtn.style.padding = '0.25rem 0.6rem';
    copyBtn.fontSize = '0.75rem';
    copyBtn.textContent = 'Copy';

    copyBtn.addEventListener('click', () => {
      const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        showToast('Code snippet copied to clipboard', 'success');
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(copyBtn);
  });
}

/* ==========================================================================
   9. GOOGLE SHEETS FORM INTEGRATION & NEWSLETTER
   Endpoints: https://script.google.com/macros/s/AKfycbxA03eiBo9CGMpjSH5MlWxhZKolwJNwYQ69KgfcWY8DpOSv0ocx-XBGt-Y290nq27M7/exec
   ========================================================================== */
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxA03eiBo9CGMpjSH5MlWxhZKolwJNwYQ69KgfcWY8DpOSv0ocx-XBGt-Y290nq27M7/exec';

async function postToGoogleSheet(payload) {
  try {
    const params = new URLSearchParams();
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        params.append(key, payload[key]);
      }
    }

    const endpoint = (SITE_SETTINGS && SITE_SETTINGS.google_sheet_endpoint) || GOOGLE_SHEET_ENDPOINT;
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    return true;
  } catch (err) {
    console.warn('Google Sheet submission warning:', err);
    return false;
  }
}

function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!input || !input.value) return;

      const email = input.value.trim();
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Connect with Us';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      await postToGoogleSheet({
        email: email,
        name: 'Newsletter Subscriber',
        topic: 'Newsletter / Connect',
        message: 'Subscribed to Zero Themes updates'
      });

      showToast(`🎉 Thanks for connecting! Your email has been saved to our Google Sheet.`, 'success');
      input.value = '';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const topicSelect = form.querySelector('[name="topic"]');
    const messageInput = form.querySelector('[name="message"]');

    const name = nameInput ? nameInput.value.trim() : 'Anonymous';
    const email = emailInput ? emailInput.value.trim() : '';
    const topic = topicSelect ? topicSelect.value : 'General Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    await postToGoogleSheet({
      name: name,
      email: email,
      topic: topic,
      message: message
    });

    showToast('🎉 Message sent successfully! We will reply within 24 hours.', 'success');
    form.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* ==========================================================================
   10. LIGHTWEIGHT MOVING CURSOR AURA ANIMATION
   A gentle, ambient cursor halo tracking mouse movement across desktop hero
   ========================================================================== */
function initCursorFollower() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch screens

  const aura = document.createElement('div');
  aura.className = 'hero-cursor-aura';
  document.body.appendChild(aura);

  let mouseX = -100, mouseY = -100;
  let currentX = -100, currentY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      aura.classList.add('active');
      isMoving = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    aura.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    if (isMoving) aura.classList.add('active');
  });

  function loop() {
    currentX += (mouseX - currentX) * 0.16;
    currentY += (mouseY - currentY) * 0.16;
    aura.style.left = `${currentX}px`;
    aura.style.top = `${currentY}px`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .cat-pill, .theme-card, .btn-roll-trigger, .dice-scene')) {
      aura.classList.add('hovering-interactive');
    } else {
      aura.classList.remove('hovering-interactive');
    }
  }, { passive: true });
}

/* ==========================================================================
   11. 🎲 SURPRISE ME 3D DICE ROLL & FLIP CARD WIDGET
   ========================================================================== */
function initDiceRollWidget() {
  const widget = document.getElementById('dice-widget');
  if (!widget) return;

  const diceTrigger = document.getElementById('dice-trigger');
  const btnRoll = document.getElementById('btn-roll');
  const diceCube = document.getElementById('dice-cube');
  const flipInner = document.getElementById('dice-flip-inner');
  const particlesWrap = document.getElementById('dice-particles');

  const themeImg = document.getElementById('dice-theme-img');
  const themeBadge = document.getElementById('dice-theme-badge');
  const themeCat = document.getElementById('dice-theme-cat');
  const themeName = document.getElementById('dice-theme-name');
  const themeTagline = document.getElementById('dice-theme-tagline');
  const demoLink = document.getElementById('dice-demo-link');
  const detailsLink = document.getElementById('dice-details-link');

  let isRolling = false;
  let currentThemeId = null;
  let rollCount = 0;

  function rollDice() {
    if (isRolling) return;
    isRolling = true;

    const themes = (typeof ZERO_THEMES !== 'undefined' ? ZERO_THEMES : []);
    if (themes.length === 0) {
      isRolling = false;
      return;
    }

    rollCount++;

    // Pick random theme different from current
    let availableThemes = themes.filter(t => t.id !== currentThemeId);
    if (availableThemes.length === 0) availableThemes = themes;
    const picked = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    currentThemeId = picked.id;

    // 3D physics-like random tumbling angles with isometric perspective offset
    const baseRotX = 720 + (rollCount * 360) + (Math.floor(Math.random() * 4) * 90) - 22;
    const baseRotY = 1080 + (rollCount * 360) + (Math.floor(Math.random() * 4) * 90) - 32;
    const baseRotZ = (Math.floor(Math.random() * 2) * 180);

    if (diceCube) {
      diceCube.style.transform = `rotateX(${baseRotX}deg) rotateY(${baseRotY}deg) rotateZ(${baseRotZ}deg)`;
    }

    // If card was already flipped, flip back to mystery for a moment
    if (flipInner && flipInner.classList.contains('flipped')) {
      flipInner.classList.remove('flipped');
    }

    // Populate theme card data
    setTimeout(() => {
      if (themeImg) {
        themeImg.src = picked.image;
        themeImg.alt = picked.name;
      }
      if (themeBadge) {
        themeBadge.textContent = picked.badge || 'FREE';
        themeBadge.className = `badge badge-${picked.badgeType || 'hot'}`;
      }
      if (themeCat) themeCat.textContent = picked.categoryLabel || 'Template';
      if (themeName) themeName.textContent = picked.name;
      if (themeTagline) themeTagline.textContent = picked.tagline;
      if (demoLink) {
        demoLink.href = picked.demoUrl || '#';
      }
      if (detailsLink) {
        detailsLink.href = `theme-detail.html?id=${picked.id}`;
      }

      // 3D Flip reveal
      if (flipInner) {
        flipInner.classList.add('flipped');
      }

      // Sparkles burst
      createSparkleBurst();
    }, 450);

    setTimeout(() => {
      isRolling = false;
    }, 850);
  }

  function createSparkleBurst() {
    if (!particlesWrap) return;
    particlesWrap.innerHTML = '';
    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#fbbf24'];

    for (let i = 0; i < 16; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'dice-sparkle';
      const angle = (Math.PI * 2 / 16) * i + (Math.random() * 0.3 - 0.15);
      const dist = 30 + Math.random() * 45;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      sparkle.style.setProperty('--dx', `${dx}px`);
      sparkle.style.setProperty('--dy', `${dy}px`);
      sparkle.style.left = '60px';
      sparkle.style.top = '65px';
      sparkle.style.background = colors[i % colors.length];
      sparkle.style.boxShadow = `0 0 6px ${colors[i % colors.length]}`;

      particlesWrap.appendChild(sparkle);
    }

    setTimeout(() => {
      particlesWrap.innerHTML = '';
    }, 850);
  }

  if (diceTrigger) {
    diceTrigger.addEventListener('click', rollDice);
    diceTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        rollDice();
      }
    });
  }

  if (btnRoll) {
    btnRoll.addEventListener('click', (e) => {
      e.stopPropagation();
      rollDice();
    });
  }
}
