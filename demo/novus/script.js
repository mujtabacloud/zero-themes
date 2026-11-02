/**
 * Novus Creative Agency - Interactive Script
 * Pure Vanilla ES6 - Interactive Proposal Calculator & Booking Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProposalCalculator();
  initBookingModal();
});

/* ==========================================================================
   1. THEME SWITCHER
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('novus_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('novus_theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ==========================================================================
   2. INTERACTIVE PROPOSAL & BUDGET CALCULATOR
   ========================================================================== */
function initProposalCalculator() {
  const deliverableBtns = document.querySelectorAll('[data-calc-deliverable]');
  const velocityBtns = document.querySelectorAll('[data-calc-velocity]');
  const addonBtns = document.querySelectorAll('[data-calc-addon]');
  
  const priceDisplay = document.getElementById('calc-price');
  const timelineDisplay = document.getElementById('calc-timeline');
  const specList = document.getElementById('calc-specs');

  let state = {
    deliverable: 'web',
    basePrice: 24000,
    baseWeeks: 6,
    velocityMultiplier: 1.0,
    addons: []
  };

  const DELIVERABLE_CONFIG = {
    brand: { name: "Brand Identity & Guidelines", price: 14000, weeks: 4 },
    web: { name: "Web Platform & Architecture", price: 24000, weeks: 6 },
    mobile: { name: "Mobile App Experience (iOS/Android)", price: 34000, weeks: 8 },
    full: { name: "Full Digital Ecosystem", price: 58000, weeks: 12 }
  };

  const ADDON_CONFIG = {
    motion: { name: "3D WebGL & Kinetic Motion", price: 8000 },
    designSystem: { name: "Enterprise Design System", price: 6500 },
    seo: { name: "Technical SEO & Copywriting", price: 4500 }
  };

  function updateCalculation() {
    let totalPrice = state.basePrice;
    let totalWeeks = state.baseWeeks;

    // Addons
    state.addons.forEach(addonKey => {
      if (ADDON_CONFIG[addonKey]) {
        totalPrice += ADDON_CONFIG[addonKey].price;
      }
    });

    // Velocity
    totalPrice = Math.round(totalPrice * state.velocityMultiplier);
    if (state.velocityMultiplier > 1.0) {
      totalWeeks = Math.max(3, Math.round(totalWeeks * 0.7)); // 30% faster
    }

    // Format output
    if (priceDisplay) {
      priceDisplay.textContent = `$${totalPrice.toLocaleString()}`;
    }

    if (timelineDisplay) {
      timelineDisplay.textContent = `Estimated Delivery: ~${totalWeeks} Weeks • Full Dedicated Sprint Team`;
    }

    if (specList) {
      const selectedDeliverableName = DELIVERABLE_CONFIG[state.deliverable].name;
      let html = `<li class="calc-spec-item"><span class="check">✓</span> <strong>${selectedDeliverableName}</strong></li>`;
      html += `<li class="calc-spec-item"><span class="check">✓</span> Weekly Partner-Level Review Cycles</li>`;
      
      state.addons.forEach(key => {
        html += `<li class="calc-spec-item"><span class="check">✓</span> ${ADDON_CONFIG[key].name}</li>`;
      });

      if (state.velocityMultiplier > 1.0) {
        html += `<li class="calc-spec-item"><span class="check">✓</span> Priority Sprint Turbo Scheduling</li>`;
      }

      specList.innerHTML = html;
    }
  }

  // Deliverable selector
  deliverableBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deliverableBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const key = btn.dataset.calcDeliverable;
      state.deliverable = key;
      state.basePrice = DELIVERABLE_CONFIG[key].price;
      state.baseWeeks = DELIVERABLE_CONFIG[key].weeks;
      updateCalculation();
    });
  });

  // Velocity selector
  velocityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      velocityBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.velocityMultiplier = parseFloat(btn.dataset.calcVelocity || '1.0');
      updateCalculation();
    });
  });

  // Add-on toggles
  addonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const addonKey = btn.dataset.calcAddon;
      if (btn.classList.contains('selected')) {
        if (!state.addons.includes(addonKey)) state.addons.push(addonKey);
      } else {
        state.addons = state.addons.filter(a => a !== addonKey);
      }
      updateCalculation();
    });
  });

  updateCalculation();
}

/* ==========================================================================
   3. CONSULTATION BOOKING MODAL
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.open-booking-trigger');
  const closeBtn = document.getElementById('close-booking-btn');
  const form = document.getElementById('booking-form');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Consultation Scheduled ✓';
      submitBtn.style.background = '#ccff00';
      submitBtn.style.color = '#000';

      setTimeout(() => {
        closeModal();
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 2500);
    });
  }
}
