/**
 * Kanso Minimalist Portfolio - Interactive Script
 * Pure Vanilla ES6 - Lightbox, Category Filtering, Theme Persistence
 */

const KANSO_PROJECTS = {
  "nordic-art": {
    title: "Nordic Art Foundation",
    category: "Brand Identity & Spatial Architecture",
    year: "2026",
    client: "Nordic Cultural Council (Stockholm)",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    description: "A comprehensive brand identity overhaul, bilingual exhibition monograph series, and digital archive for the Nordic Art Foundation. Designed to honor Scandinavian brutalist architecture through custom monospace typography and unbleached paper materials.",
    scope: "Identity, Monograph, Digital Archive",
    duration: "6 Months",
    typography: "Kanso Grotesk + Garamond"
  },
  "monochrome-ceramics": {
    title: "Monochrome Ceramics Studio",
    category: "Digital Architecture & E-Commerce",
    year: "2025",
    client: "Studio Kanso Pottery (Kyoto / Copenhagen)",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    description: "An intentional, zero-clutter e-commerce experience showcasing limited batch ceramic vessels. Featuring ultra-fast static checkout, 360-degree glazes inspection, and quiet typography that lets craftsmanship take center stage.",
    scope: "Web Platform, Art Direction, Photography",
    duration: "4 Months",
    typography: "GT America Mono + Modern Serifs"
  },
  "atelier-form": {
    title: "Atelier Form Architecture",
    category: "Digital Architecture",
    year: "2025",
    client: "Atelier Form Partners (Berlin)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "A digital portfolio for a leading sustainable architecture studio in Berlin. The project emphasizes raw structural grids, natural daylight documentation, and fluid fullscreen project lightboxes.",
    scope: "Design System, Interactive Portfolio",
    duration: "3 Months",
    typography: "Neue Haas Grotesk"
  },
  "kroma-pavilion": {
    title: "Kroma Sound & Light Pavilion",
    category: "Exhibition & Editorial",
    year: "2024",
    client: "Biennale Architettura (Venice)",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    description: "Exhibition guide, environmental signage, and kinetic visual identity for an acoustic resonance pavilion. Explores the boundary between sonic vibration, architecture, and typographic rhythm.",
    scope: "Wayfinding, Exhibition Catalog, Sound Identity",
    duration: "5 Months",
    typography: "Custom Geometric Display"
  },
  "vesper-os": {
    title: "Vesper Spatial Operating System",
    category: "Digital Architecture",
    year: "2026",
    client: "Vesper Labs (San Francisco)",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "Conceptual human interface guidelines and design tokens for a spatial ambient computing environment. Focuses on typographic legibility across variable optical focal lengths.",
    scope: "Spatial UI, Design Tokens, Guidelines",
    duration: "7 Months",
    typography: "Vesper Spatial Variable"
  },
  "svenska-modern": {
    title: "Svenska Modern Anthology",
    category: "Editorial",
    year: "2024",
    client: "Bokförlaget Arena (Stockholm)",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    description: "A 480-page hardcover publication surveying mid-century Scandinavian furniture joinery and industrial product history. Bound in raw linen cloth with foil-stamped Swiss typography.",
    scope: "Editorial Direction, Book Layout, Print Production",
    duration: "8 Months",
    typography: "Baskerville Pro + Akzidenz Grotesk"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFilterPills();
  initCaseStudyModal();
  initStockholmClock();
  initContactForm();
});

/* ==========================================================================
   1. THEME SWITCHER (Warm Paper vs Obsidian)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('kanso_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kanso_theme', next);
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
   2. CATEGORY FILTER TABS
   ========================================================================== */
function initFilterPills() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.project-card');
  const countEl = document.getElementById('project-counter');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.dataset.category || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countEl) {
        countEl.textContent = `${visibleCount} Selected Works`;
      }
    });
  });
}

/* ==========================================================================
   3. CASE STUDY LIGHTBOX MODAL
   ========================================================================== */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!modal) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.id;
      const data = KANSO_PROJECTS[projectId];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-client').textContent = `${data.client} • ${data.year}`;
      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-img').alt = data.title;
      document.getElementById('modal-desc').textContent = data.description;
      document.getElementById('modal-scope').textContent = data.scope;
      document.getElementById('modal-duration').textContent = data.duration;
      document.getElementById('modal-type').textContent = data.typography;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

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
}

/* ==========================================================================
   4. STOCKHOLM CLOCK
   ========================================================================== */
function initStockholmClock() {
  const clockEl = document.getElementById('stockholm-time');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Stockholm is UTC+1 (or UTC+2 in summer)
    const options = { timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    clockEl.textContent = `${now.toLocaleTimeString('en-GB', options)} Stockholm`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   5. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('kanso-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Commission Inquiry Sent ✓';
    btn.style.background = '#10b981';
    btn.style.color = '#fff';

    setTimeout(() => {
      form.reset();
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  });
}
