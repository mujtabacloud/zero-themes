/**
 * Aurora SaaS & Startup - Interactive Script
 * High-performance, zero-dependency ES6
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPricingSwitch();
  initFaqAccordion();
  initCliCopy();
  initMockupTelemetry();
});

/* ==========================================================================
   1. DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('aurora_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aurora_theme', next);
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
   2. PRICING SWITCHER (Monthly vs Annual - 20% Discount)
   ========================================================================== */
function initPricingSwitch() {
  const switchBtn = document.getElementById('pricing-switch');
  const proPrice = document.getElementById('price-pro');
  const entPrice = document.getElementById('price-ent');
  const periodLabels = document.querySelectorAll('.pricing-period');

  if (!switchBtn || !proPrice || !entPrice) return;

  let isAnnual = false;

  switchBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchBtn.classList.toggle('active', isAnnual);

    if (isAnnual) {
      proPrice.textContent = '$39';
      entPrice.textContent = '$159';
      periodLabels.forEach(p => p.textContent = '/month, billed annually');
    } else {
      proPrice.textContent = '$49';
      entPrice.textContent = '$199';
      periodLabels.forEach(p => p.textContent = '/month');
    }
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other accordions
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   4. COPY CLI COMMAND
   ========================================================================== */
function initCliCopy() {
  const copyBtn = document.getElementById('copy-cli-btn');
  const cliText = document.getElementById('cli-code-text');

  if (!copyBtn || !cliText) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cliText.innerText.trim()).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = '✓ Copied';
      copyBtn.style.color = '#10b981';
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.color = '';
      }, 2000);
    }).catch(() => {
      copyBtn.innerText = 'Copied';
    });
  });
}

/* ==========================================================================
   5. MOCKUP TELEMETRY SIMULATION
   ========================================================================== */
function initMockupTelemetry() {
  const latencyEl = document.getElementById('stat-latency');
  const eventsEl = document.getElementById('stat-events');

  if (!latencyEl || !eventsEl) return;

  setInterval(() => {
    // Subtle realistic latency fluctuation between 11ms and 15ms
    const randomLatency = (11 + Math.random() * 4).toFixed(1);
    latencyEl.textContent = `${randomLatency}ms`;

    // Events counter fluctuation
    const baseEvents = 1240000 + Math.floor(Math.random() * 5000);
    eventsEl.textContent = `${(baseEvents / 1000000).toFixed(2)}M/s`;
  }, 2500);
}
