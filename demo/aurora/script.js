/**
 * Aurora SaaS & Startup - Interactive Script
 * High-performance, zero-dependency ES6
 * Real-time telemetry, live canvas traffic chart, SVG edge map,
 * interactive terminal simulation, 3D card flips, guided tour & AI chat widget.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPricingSwitch();
  initFaqAccordion();
  initCliCopy();
  initMockupTelemetry();
  initTelemetryTabs();
  initLiveTrafficCanvas();
  initEdgeMap();
  initUniversalModal();
  initGuidedTour();
  initChatWidget();
  initCardMouseGlow();
  initMobileCardFlip();
});

/* ==========================================================================
   1. DARK / LIGHT THEME TOGGLE (WITH SMOOTH TRANSITION & PERSISTENCE)
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
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   4. COPY CLI COMMAND WITH TOAST NOTIFICATION
   ========================================================================== */
function initCliCopy() {
  const copyBtn = document.getElementById('copy-cli-btn');
  const cliText = document.getElementById('cli-code-text');
  const toast = document.getElementById('cli-toast');
  const copyLabel = document.getElementById('copy-btn-label');

  if (!copyBtn || !cliText) return;

  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const command = cliText.innerText.replace(/^\$\s*/, '').trim();

    navigator.clipboard.writeText(command).then(() => {
      if (copyLabel) copyLabel.textContent = 'Copied!';
      copyBtn.style.color = '#10b981';

      if (toast) {
        toast.classList.remove('hidden');
        toast.style.opacity = '1';
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2200);
      }

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copy';
        copyBtn.style.color = '';
      }, 2000);
    }).catch(() => {
      if (copyLabel) copyLabel.textContent = 'Copied!';
    });
  });
}

/* ==========================================================================
   5. LIVE TELEMETRY COUNTER ANIMATIONS & REAL-TIME UPDATES
   ========================================================================== */
function initMockupTelemetry() {
  const uptimeEl = document.getElementById('stat-uptime');
  const latencyEl = document.getElementById('stat-latency');
  const eventsEl = document.getElementById('stat-events');
  const latencyDeltaEl = document.getElementById('stat-latency-delta');

  // Initial count-up animation
  animateCountUp(uptimeEl, 99.995, '%', 3, 1400);
  animateCountUp(latencyEl, 12.4, 'ms', 1, 1200);
  animateCountUp(eventsEl, 1.24, 'M/s', 2, 1600);

  // Periodic subtle realistic fluctuation every 3.5s
  setInterval(() => {
    fetchMetricsAndUpdate(latencyEl, eventsEl, latencyDeltaEl);
  }, 3500);
}

function animateCountUp(element, target, unit = '', decimals = 1, duration = 1200) {
  if (!element) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (target * easeProgress).toFixed(decimals);

    element.textContent = `${currentVal}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${target.toFixed(decimals)}${unit}`;
    }
  }

  requestAnimationFrame(update);
}

function fetchMetricsAndUpdate(latencyEl, eventsEl, deltaEl) {
  // Attempt to fetch from local json, fallback smoothly to realistic algorithm
  fetch('./assets/data/metrics.json')
    .then(res => res.json())
    .then(data => {
      if (latencyEl && data.latency) {
        const baseLatency = parseFloat(data.latency);
        const variation = (Math.random() * 1.6 - 0.8).toFixed(1);
        const currentLatency = (baseLatency + parseFloat(variation)).toFixed(1);
        latencyEl.textContent = `${currentLatency}ms`;

        if (deltaEl) {
          deltaEl.textContent = variation >= 0 ? `+${variation}ms` : `${variation}ms`;
          deltaEl.className = variation <= 0 ? 'stat-badge green' : 'stat-badge cyan';
        }
      }

      if (eventsEl && data.events) {
        const base = 1.24;
        const currentEvents = (base + (Math.random() * 0.08 - 0.04)).toFixed(2);
        eventsEl.textContent = `${currentEvents}M/s`;
      }
    })
    .catch(() => {
      // Local fallback without network
      if (latencyEl) {
        const randLat = (11.5 + Math.random() * 2.2).toFixed(1);
        latencyEl.textContent = `${randLat}ms`;
      }
      if (eventsEl) {
        const randEvt = (1.20 + Math.random() * 0.09).toFixed(2);
        eventsEl.textContent = `${randEvt}M/s`;
      }
    });
}

/* ==========================================================================
   6. TELEMETRY CONSOLE TAB SWITCHING
   ========================================================================== */
function initTelemetryTabs() {
  const tabBtns = document.querySelectorAll('.mockup-nav-item');
  const panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. LIVE DYNAMIC TRAFFIC CANVAS (ANIMATED HISTOGRAM / WAVEFORM)
   ========================================================================== */
function initLiveTrafficCanvas() {
  const canvas = document.getElementById('traffic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set logical resolution
  const barCount = 42;
  const dataPoints = [];

  // Seed initial realistic data
  for (let i = 0; i < barCount; i++) {
    const factor = 0.35 + Math.sin(i / 4) * 0.25 + Math.random() * 0.35;
    dataPoints.push(Math.min(Math.max(factor, 0.15), 0.95));
  }

  // Push new data point periodically
  setInterval(() => {
    const last = dataPoints[dataPoints.length - 1];
    const nextVal = Math.min(Math.max(last + (Math.random() * 0.3 - 0.15), 0.2), 0.98);
    dataPoints.shift();
    dataPoints.push(nextVal);
  }, 600);

  function draw() {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw subtle horizontal grid lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 20; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const gap = 4;
    const totalGap = gap * (barCount - 1);
    const barWidth = (width - totalGap) / barCount;

    // Gradient for bars
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    gradient.addColorStop(0.6, 'rgba(99, 102, 241, 0.7)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.95)');

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const val = dataPoints[i];
      const barHeight = val * (height - 15);
      const x = i * (barWidth + gap);
      const y = height - barHeight;

      // Fill bar
      ctx.fillStyle = (i === barCount - 1) ? '#38bdf8' : gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
      ctx.fill();

      // Glowing cap on top
      if (val > 0.65) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth, 2);
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   8. INTERACTIVE SVG EDGE MAP WITH RADAR PINGS & TOOLTIPS
   ========================================================================== */
function initEdgeMap() {
  const nodesGroup = document.getElementById('map-nodes-group');
  const tooltip = document.getElementById('map-tooltip');
  const mapContainer = document.getElementById('edge-map');
  if (!nodesGroup || !tooltip || !mapContainer) return;

  const edgeNodes = [
    { id: 'sfo', name: 'San Francisco (US-West)', latency: '9.2ms', load: '38%', status: 'Optimal', x: 160, y: 140 },
    { id: 'iad', name: 'Virginia (US-East)', latency: '13.8ms', load: '64%', status: 'Optimal', x: 255, y: 135 },
    { id: 'gru', name: 'São Paulo (SA-East)', latency: '24.6ms', load: '42%', status: 'Optimal', x: 310, y: 280 },
    { id: 'lhr', name: 'London (UK-South)', latency: '11.4ms', load: '48%', status: 'Optimal', x: 445, y: 105 },
    { id: 'fra', name: 'Frankfurt (EU-Central)', latency: '10.2ms', load: '55%', status: 'Optimal', x: 485, y: 110 },
    { id: 'dxb', name: 'Dubai (ME-Central)', latency: '17.1ms', load: '36%', status: 'Optimal', x: 580, y: 160 },
    { id: 'sin', name: 'Singapore (AP-Southeast)', latency: '15.3ms', load: '59%', status: 'Optimal', x: 690, y: 210 },
    { id: 'nrt', name: 'Tokyo (AP-Northeast)', latency: '18.5ms', load: '41%', status: 'Optimal', x: 765, y: 135 },
    { id: 'syd', name: 'Sydney (AU-East)', latency: '21.9ms', load: '31%', status: 'Optimal', x: 785, y: 295 }
  ];

  // Render SVG Node pins dynamically
  edgeNodes.forEach((node, index) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-point');
    g.setAttribute('data-id', node.id);

    // Radar ping ring
    const ping = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ping.setAttribute('cx', node.x);
    ping.setAttribute('cy', node.y);
    ping.setAttribute('r', '5');
    ping.setAttribute('fill', 'none');
    ping.setAttribute('stroke', '#06b6d4');
    ping.setAttribute('class', 'node-ping-ring');
    ping.style.animationDelay = `${(index * 0.35) % 2.5}s`;

    // Outer glow circle
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('cx', node.x);
    glow.setAttribute('cy', node.y);
    glow.setAttribute('r', '7');
    glow.setAttribute('fill', 'rgba(6, 182, 212, 0.3)');

    // Core pin
    const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pin.setAttribute('cx', node.x);
    pin.setAttribute('cy', node.y);
    pin.setAttribute('r', '3.5');
    pin.setAttribute('fill', '#38bdf8');
    pin.setAttribute('stroke', '#ffffff');
    pin.setAttribute('stroke-width', '1.2');
    pin.setAttribute('class', 'core-pin');

    g.appendChild(ping);
    g.appendChild(glow);
    g.appendChild(pin);

    // Hover tooltip handlers
    g.addEventListener('mouseenter', (e) => {
      tooltip.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 2px;">⚡ ${node.name}</div>
        <div style="display: flex; gap: 8px; font-size: 0.75rem; color: #94a3b8;">
          <span>Latency: <strong style="color: #10b981;">${node.latency}</strong></span>
          <span>Load: <strong style="color: #38bdf8;">${node.load}</strong></span>
          <span>Status: <strong style="color: #a855f7;">${node.status}</strong></span>
        </div>
      `;
      tooltip.classList.remove('hidden');
      positionTooltip(e);
    });

    g.addEventListener('mousemove', (e) => {
      positionTooltip(e);
    });

    g.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    nodesGroup.appendChild(g);
  });

  function positionTooltip(e) {
    const bounds = mapContainer.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }
}

/* ==========================================================================
   9. UNIVERSAL MODAL & CLI TERMINAL SIMULATION
   ========================================================================== */
function initUniversalModal() {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('modal-backdrop');

  if (!modal || !modalBody) return;

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  }

  function openModal(contentHtml) {
    modalBody.innerHTML = contentHtml;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Handle "Run in Terminal" Badge Button
  const runTerminalBadgeBtn = document.getElementById('run-terminal-badge-btn');
  if (runTerminalBadgeBtn) {
    runTerminalBadgeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openTerminalModal();
    });
  }

  // Handle Embedded Terminal Run Button in Mockup
  const embeddedRunBtn = document.getElementById('embedded-terminal-run-btn');
  const embeddedOutput = document.getElementById('embedded-terminal-output');
  if (embeddedRunBtn && embeddedOutput) {
    embeddedRunBtn.addEventListener('click', () => {
      runStreamTerminalLogs(embeddedOutput, embeddedRunBtn);
    });
  }

  // Handle Bento Card "Learn More" buttons
  const learnMoreBtns = document.querySelectorAll('.btn-learn-more, [data-modal]');
  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalType = btn.getAttribute('data-modal');
      openFeatureModal(modalType);
    });
  });

  function openTerminalModal() {
    const terminalHtml = `
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
          <span class="badge-pill">Interactive Sandbox</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">aurora-cli v2.4.0</span>
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.4rem;">Simulated Cloud Terminal</h3>
        <p style="color: var(--text-muted); font-size: 0.92rem;">Execute zero-downtime serverless deployments directly to 320 global edge clusters.</p>
        
        <div class="modal-terminal-box">
          <div class="modal-terminal-header">
            <div class="modal-terminal-dots">
              <span style="background: #ef4444;"></span>
              <span style="background: #f59e0b;"></span>
              <span style="background: #10b981;"></span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8;">bash - npx aurora-cli deploy</div>
          </div>
          <div class="modal-terminal-screen" id="modal-terminal-screen">
            <div class="term-line prompt-line">$ npx aurora-cli deploy --cluster=edge --prod</div>
            <div class="term-line dim">Press "Execute Deployment" below to trigger automated edge container orchestration...</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.2rem;">
          <button class="btn btn-secondary btn-sm" id="modal-term-clear">Clear Logs</button>
          <button class="btn btn-primary btn-sm" id="modal-term-run">▶ Execute Deployment</button>
        </div>
      </div>
    `;

    openModal(terminalHtml);

    const screen = document.getElementById('modal-terminal-screen');
    const runBtn = document.getElementById('modal-term-run');
    const clearBtn = document.getElementById('modal-term-clear');

    if (runBtn && screen) {
      runBtn.addEventListener('click', () => {
        runStreamTerminalLogs(screen, runBtn);
      });
    }

    if (clearBtn && screen) {
      clearBtn.addEventListener('click', () => {
        screen.innerHTML = `
          <div class="term-line prompt-line">$ npx aurora-cli deploy --cluster=edge --prod</div>
          <div class="term-line dim">Ready for next command.</div>
        `;
      });
    }
  }

  function openFeatureModal(type) {
    const featureData = {
      edge: {
        title: 'Global Anycast Edge Network',
        badge: 'Distributed Infrastructure',
        desc: 'Instant DNS routing with BGP Anycast maps requests to the closest physical server rack across 320 PoPs.',
        specs: [
          { label: 'Routing Protocol', val: 'BGP Anycast + Autonomous GeoDNS' },
          { label: 'Global Backbone', val: '180 Tbps Dark Fiber Network' },
          { label: 'Cold Start Latency', val: '0 ms (Pre-Warmed V8 Isolates)' },
          { label: 'TLS Handshake', val: 'TLS 1.3 0-RTT Session Resumption' }
        ],
        codeSnippet: '$ aurora cluster status --region=all\n✓ 320/320 PoPs Healthy | Global Latency: 12.4ms'
      },
      scaling: {
        title: 'Zero-to-One-Million Autonomous Scaling',
        badge: 'Predictive Autoscaling',
        desc: 'Aurora dynamically spins up lightweight container isolates in under 350ms to absorb viral traffic surges without configuration.',
        specs: [
          { label: 'Isolate Provisioning', val: '< 350ms Spin-Up' },
          { label: 'Throughput Capacity', val: '1,000,000+ concurrent requests/sec' },
          { label: 'Concurrency Model', val: 'Lock-Free Multi-Threaded Actors' },
          { label: 'Scale-to-Zero', val: 'Zero idle server costs when dormant' }
        ],
        codeSnippet: '$ aurora scale config --target=adaptive\n✓ Autonomous scaling rules active for production cluster'
      },
      observability: {
        title: 'Microsecond Distributed Tracing & Telemetry',
        badge: 'OpenTelemetry Native',
        desc: 'Inspect headers, execution waterfalls, database span queries, and error traces with zero performance sampling loss.',
        specs: [
          { label: 'Span Resolution', val: 'Microsecond (1 µs) precision' },
          { label: 'Sampling Rate', val: '100% Full-Fidelity Ingestion' },
          { label: 'Data Retention', val: '30 Days Real-Time Hot Storage' },
          { label: 'Protocol Support', val: 'OTLP, Jaeger, Prometheus, Datadog' }
        ],
        codeSnippet: '$ aurora trace live --tail=100\n[TRACE 200] GET /api/v1/inference (9.4ms) -> SFO-Edge-01'
      },
      security: {
        title: 'SOC-2 Type II & HIPAA Certified Defense',
        badge: 'Zero-Trust Perimeter',
        desc: 'Enterprise security envelope with automated mutual TLS (mTLS), hardware encryption keys, and automated DDoS mitigation.',
        specs: [
          { label: 'Encryption', val: 'AES-256 GCM Storage + mTLS v1.3' },
          { label: 'Compliance Pack', val: 'SOC2 Type II, HIPAA, GDPR, ISO 27001' },
          { label: 'DDoS Capacity', val: 'Layer 3, 4, and 7 Scrubbing (180 Tbps)' },
          { label: 'SSL Orchestration', val: 'Automated Let\'s Encrypt Wildcard renew' }
        ],
        codeSnippet: '$ aurora security audit\n✓ All 4 compliance packs verified. 0 vulnerabilities found.'
      }
    };

    const feat = featureData[type] || featureData.edge;

    const modalHtml = `
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
          <span class="badge-pill">${feat.badge}</span>
        </div>
        <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem;">${feat.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.2rem;">${feat.desc}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem;">
          ${feat.specs.map(s => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.8rem;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${s.label}</div>
              <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">${s.val}</div>
            </div>
          `).join('')}
        </div>

        <div style="background: #020617; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: #38bdf8; margin-bottom: 1.4rem;">
          <pre style="margin: 0; white-space: pre-wrap;">${feat.codeSnippet}</pre>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal').classList.add('hidden')">Close Window</button>
          <a href="#pricing" class="btn btn-primary btn-sm" onclick="document.getElementById('modal').classList.add('hidden')">Deploy on Aurora Now</a>
        </div>
      </div>
    `;

    openModal(modalHtml);
  }

  function runStreamTerminalLogs(outputElement, triggerBtn) {
    if (triggerBtn) triggerBtn.disabled = true;

    outputElement.innerHTML = `
      <div class="term-line prompt-line">$ npx aurora-cli deploy --cluster=edge --prod</div>
    `;

    const logs = [
      { text: '[0.04s] ⚡ Authenticating with Aurora Edge Mesh... OK (auth_token valid)', class: 'info' },
      { text: '[0.22s] 📦 Packaging serverless edge bundle (target: ES2024, wasm32)... 1.4 MB', class: '' },
      { text: '[0.51s] 🌐 Discovering 320 Anycast Points of Presence worldwide...', class: 'info' },
      { text: '[0.84s] 🔒 Automated Let\'s Encrypt TLS 1.3 certificates verified & pinned', class: 'info' },
      { text: '[1.18s] 🚀 Sharding application isolates to US-East, EU-Central, AP-Northeast...', class: '' },
      { text: '[1.42s] ✅ Production deploy complete in 1.42s!', class: 'success' },
      { text: '>>> Live URL: https://aurora-edge.mesh/production', class: 'success' },
      { text: '>>> Telemetry: https://console.aurora.io/clusters/us-east-edge', class: 'dim' }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        const line = document.createElement('div');
        line.className = `term-line ${logs[step].class}`;
        line.textContent = logs[step].text;
        outputElement.appendChild(line);
        outputElement.scrollTop = outputElement.scrollHeight;
        step++;
      } else {
        clearInterval(interval);
        if (triggerBtn) triggerBtn.disabled = false;
      }
    }, 280);
  }
}

/* ==========================================================================
   10. GUIDED TOUR OVERLAY (SMOOTH IN-HOUSE SPOTLIGHT & STEP NAVIGATION)
   ========================================================================== */
function initGuidedTour() {
  const tourBtn = document.getElementById('start-tour-btn');
  const overlay = document.getElementById('tour-overlay');
  const highlightBox = document.getElementById('tour-highlight-box');
  const tourCard = document.getElementById('tour-card');
  const stepBadge = document.getElementById('tour-step-badge');
  const titleEl = document.getElementById('tour-title');
  const descEl = document.getElementById('tour-desc');
  const prevBtn = document.getElementById('tour-prev-btn');
  const nextBtn = document.getElementById('tour-next-btn');
  const skipBtn = document.getElementById('tour-skip-btn');
  const dotsContainer = document.getElementById('tour-dots');

  if (!tourBtn || !overlay || !highlightBox || !tourCard) return;

  const tourSteps = [
    {
      target: '#hero',
      title: 'Welcome to Aurora Cloud',
      desc: 'Deploy next-generation SaaS applications with sub-15ms edge latency and zero DevOps friction.',
      badge: 'Step 1 of 4'
    },
    {
      target: '#telemetry',
      title: 'Live Telemetry & Traffic Stream',
      desc: 'Watch real-time performance counters, animated waveform traffic canvas, and interactive edge map tabs.',
      badge: 'Step 2 of 4'
    },
    {
      target: '#bento',
      title: 'Architectural Bento Grid',
      desc: 'Interactive 3D cards flip on hover or tap to reveal technical specs and instant terminal run capabilities.',
      badge: 'Step 3 of 4'
    },
    {
      target: '#pricing',
      title: 'Predictable Economics',
      desc: 'Developer-first transparent pricing with annual discounts and zero hidden overage fees.',
      badge: 'Step 4 of 4'
    }
  ];

  let currentStep = 0;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    tourSteps.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `tour-dot ${idx === currentStep ? 'active' : ''}`;
      dotsContainer.appendChild(dot);
    });
  }

  function showStep(index) {
    if (index < 0 || index >= tourSteps.length) {
      exitTour();
      return;
    }

    currentStep = index;
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);

    if (!targetElement) {
      exitTour();
      return;
    }

    // Scroll smoothly to target element
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Position spotlight highlight box with padding
      const pad = 12;
      highlightBox.style.top = `${rect.top + scrollY - pad}px`;
      highlightBox.style.left = `${rect.left + scrollX - pad}px`;
      highlightBox.style.width = `${rect.width + pad * 2}px`;
      highlightBox.style.height = `${rect.height + pad * 2}px`;

      // Update card content
      if (stepBadge) stepBadge.textContent = step.badge;
      if (titleEl) titleEl.textContent = step.title;
      if (descEl) descEl.textContent = step.desc;

      // Position tour card dynamically below or above target
      const cardHeight = tourCard.offsetHeight || 190;
      let cardTop = rect.bottom + scrollY + 24;
      if (cardTop + cardHeight > document.body.scrollHeight - 50) {
        cardTop = Math.max(rect.top + scrollY - cardHeight - 24, 20);
      }

      let cardLeft = rect.left + scrollX + (rect.width / 2) - 180;
      cardLeft = Math.max(16, Math.min(cardLeft, window.innerWidth - 380));

      tourCard.style.top = `${cardTop}px`;
      tourCard.style.left = `${cardLeft}px`;

      // Buttons
      if (prevBtn) {
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      }
      if (nextBtn) {
        nextBtn.textContent = currentStep === tourSteps.length - 1 ? 'Finish Tour ✓' : 'Next →';
      }

      renderDots();
    }, 350);
  }

  function startTour() {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    showStep(0);
  }

  function exitTour() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
  }

  tourBtn.addEventListener('click', startTour);
  if (skipBtn) skipBtn.addEventListener('click', exitTour);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < tourSteps.length - 1) {
        showStep(currentStep + 1);
      } else {
        exitTour();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') exitTour();
    if (e.key === 'ArrowRight') {
      if (currentStep < tourSteps.length - 1) showStep(currentStep + 1);
      else exitTour();
    }
    if (e.key === 'ArrowLeft' && currentStep > 0) {
      showStep(currentStep - 1);
    }
  });
}

/* ==========================================================================
   11. LIVE SUPPORT CHAT WIDGET WITH AI ANSWERS
   ========================================================================== */
function initChatWidget() {
  const widget = document.getElementById('chat-widget');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const panel = document.getElementById('chat-panel');
  const minimizeBtn = document.getElementById('chat-minimize-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesBox = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const badge = document.getElementById('chat-badge');
  const quickPills = document.querySelectorAll('.chat-pill');

  if (!widget || !toggleBtn || !panel) return;

  function toggleChat() {
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) {
      panel.classList.remove('hidden');
      widget.classList.add('active');
      if (badge) badge.style.display = 'none';
      if (chatInput) chatInput.focus();
    } else {
      panel.classList.add('hidden');
      widget.classList.remove('active');
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  if (minimizeBtn) minimizeBtn.addEventListener('click', toggleChat);

  // Quick Action Pills
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.getAttribute('data-prompt') || pill.textContent.trim();
      handleUserMessage(prompt);
    });
  });

  // Chat Form Submission
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      handleUserMessage(text);
    });
  }

  function handleUserMessage(userText) {
    // Append User Message
    appendMessage(userText, 'user');

    // Show Typing Indicator
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Bot Response Delay
    setTimeout(() => {
      if (typingIndicator) typingIndicator.classList.add('hidden');
      const botResponse = generateBotResponse(userText);
      appendMessage(botResponse, 'bot');
    }, 750);
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = text;

    const time = document.createElement('span');
    time.className = 'chat-timestamp';
    time.textContent = 'Just now';

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function generateBotResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('latency') || q.includes('fast') || q.includes('speed')) {
      return '⚡ <strong>Sub-15ms Latency:</strong> Aurora routes all requests through Anycast BGP across 320 global edge locations, ensuring requests hit the closest data center with zero cold starts.';
    }
    if (q.includes('anycast') || q.includes('routing') || q.includes('route')) {
      return '🌐 <strong>Anycast BGP Mesh:</strong> We announce unified IPs globally. If any node experiences packet degradation, traffic automatically fails over in &lt;100ms.';
    }
    if (q.includes('devops') || q.includes('deploy') || q.includes('github')) {
      return '🚀 <strong>Zero DevOps:</strong> You don\'t need to manage Kubernetes clusters or Docker registries. Run <code>npx aurora-cli deploy</code> and your app goes live instantly!';
    }
    if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('plan')) {
      return '💰 <strong>Pricing:</strong> We offer a 100% Free Hobby tier forever! Our Pro Engineer plan is $49/mo (or $39/mo billed annually) with 10M monthly requests.';
    }
    if (q.includes('security') || q.includes('soc2') || q.includes('hipaa') || q.includes('ssl')) {
      return '🛡️ <strong>Enterprise Security:</strong> Aurora is fully SOC-2 Type II and HIPAA compliant, equipped with automated Let\'s Encrypt TLS 1.3 certificates and a 180 Tbps DDoS mitigation shield.';
    }

    return '👋 <strong>Thanks for asking!</strong> Aurora is built to power modern AI and SaaS teams with autonomous edge compute, instant SSL, and live telemetry. Would you like to test our CLI deploy or review pricing?';
  }
}

/* ==========================================================================
   12. SUBTLE MOUSE GLOW & BENTO CARD INTERACTIONS
   ========================================================================== */
function initCardMouseGlow() {
  const cards = document.querySelectorAll('.bento-card-front, .bento-card-back');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   13. MOBILE CARD FLIP ON TAP
   ========================================================================== */
function initMobileCardFlip() {
  const flipCards = document.querySelectorAll('.interactive-flip-card');

  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle flip if clicking an interactive button or copy element
      if (e.target.closest('button') || e.target.closest('.code-box-wrapper') || e.target.closest('a')) {
        return;
      }
      card.classList.toggle('flipped');
    });
  });
}
