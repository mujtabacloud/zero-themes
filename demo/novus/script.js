/**
 * Novus Creative Agency - Interactive Script
 * Pure Vanilla ES6 - Interactive Proposal Calculator & Booking Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProposalCalculator();
  initBookingModal();
  initCaseStudyModal();
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

/* ==========================================================================
   4. CASE STUDY MODAL (Written Form)
   ========================================================================== */
const NOVUS_CASE_STUDIES = {
  hyperion: {
    title: "Hyperion Robotics OS",
    client: "Hyperion Robotics Inc. (San Francisco)",
    year: "2026",
    badge: "Awwwards Site of the Day",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    challenge: "Industrial autonomous robotics systems have traditionally suffered from dense, impenetrable engineering interfaces. Hyperion needed to shift perception from pure hardware mechanics to an enterprise-grade software intelligence ecosystem prior to their Series B funding round.",
    solution: "Novus engineered an end-to-end digital experience: a custom WebGL spatial telemetry cockpit where factory directors can visualize real-time robot arm kinematics, coupled with bold monochromatic brand typography and an interactive investor data room.",
    impact: "+340% increase in inbound tier-1 automotive enterprise pilots within 60 days of launch; contributed directly to the closure of their $48M Series B round.",
    metrics: ["$48M Series B Closed", "+340% Pilot Pipeline", "60 FPS WebGL Performance"]
  },
  kinetic: {
    title: "Kinetic Card & Pay",
    client: "Kinetic FinTech Global (London / NYC)",
    year: "2025",
    badge: "Red Dot Best of the Best",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    challenge: "In a heavily saturated neo-banking landscape dominated by lookalike fintech apps, Kinetic needed an audacious design language that could scale across 4+ million physical credit cards and millions of daily app transactions without sacrificing security.",
    solution: "We designed a tactile design system blending heavy tactile typography with haptic feedback micro-interactions. The web and mobile apps feature instant virtual card generation, fluid gesture controls, and a real-time spending radar.",
    impact: "Achieved a 4.9 App Store rating across 80,000+ verified customer reviews, with an 84% reduction in user drop-off during new account onboarding.",
    metrics: ["4.9 App Store Rating", "4.2M+ Active Cards", "-84% Onboarding Drop-off"]
  },
  veloce: {
    title: "Veloce Hypercar Configurator",
    client: "Veloce Automobili (Munich)",
    year: "2025",
    badge: "FWA of the Month",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    challenge: "Selling multi-million dollar electric hypercars requires visceral emotional resonance. Ultra-high-net-worth clients expected an in-browser configurator with photorealistic lighting, metallic lacquer reflections, and bespoke carbon weaves that could run smoothly even on mobile devices.",
    solution: "Novus developed a bespoke WebGL ray-marched rendering pipeline with zero external plugins. Users can customize wheels, active aero spoilers, bespoke Alcantara stitching, and audition the electric motor sound profile in 3D binaural spatial audio.",
    impact: "All 150 limited allocation production vehicles sold out within 48 hours of the digital premiere, generating over $280M in gross vehicle reservations.",
    metrics: ["150 Units Sold Out", "$280M+ Pre-Orders", "Sub-1.2s Initial Load"]
  },
  aura: {
    title: "Aura Acoustic Systems",
    client: "Aura Sound Labs (Stockholm)",
    year: "2024",
    badge: "Design Week Gold",
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    challenge: "Conveying the emotional depth of high-end acoustic monitors and reference-grade headphones through a flat glass screen without physical acoustic trial.",
    solution: "We built an interactive frequency response audition tool right in the browser, allowing prospective buyers to compare audio soundstages across different musical genres, paired with sculptural Scandinavian product photography and storytelling.",
    impact: "Generated $18.4M in first-year direct-to-consumer sales, with an average order value 45% above consumer audio benchmarks.",
    metrics: ["$18.4M Direct Sales", "+45% Higher AOV", "2.8x Average Time on Site"]
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const triggers = document.querySelectorAll('.view-case-study-trigger');
  const closeBtn = document.getElementById('close-study-btn');

  if (!modal) return;

  function openStudy(id) {
    const data = NOVUS_CASE_STUDIES[id];
    if (!data) return;

    document.getElementById('study-title').textContent = data.title;
    document.getElementById('study-meta').textContent = `${data.client} • ${data.year}`;
    document.getElementById('study-badge').textContent = data.badge;
    document.getElementById('study-img').src = data.img;
    document.getElementById('study-img').alt = data.title;
    document.getElementById('study-challenge').textContent = data.challenge;
    document.getElementById('study-solution').textContent = data.solution;
    document.getElementById('study-impact').textContent = data.impact;

    const metricsContainer = document.getElementById('study-metrics');
    if (metricsContainer) {
      metricsContainer.innerHTML = data.metrics.map(m => `
        <div class="case-metric-pill"><span class="dot">●</span> ${m}</div>
      `).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeStudy() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = btn.dataset.caseId;
      openStudy(caseId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeStudy);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeStudy();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeStudy();
    }
  });
}
