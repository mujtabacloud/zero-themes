/**
 * ZENITH DEVELOPER CV & RESUME
 * Senior-Engineered Interactive Technical Resume & Executive Portfolio
 * Zero External Dependencies • Native Vanilla ES6 • Print-to-PDF Optimized
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Embedded Baseline Resume Telemetry (Resilient Offline Fallback)
  // ---------------------------------------------------------------------------
  const DEFAULT_RESUME = {
    profile: {
      name: "Marcus Vance",
      title: "Staff Distributed Systems & Infrastructure Architect",
      location: "San Francisco, CA • Remote",
      email: "marcus.vance@zenith-dev.io",
      phone: "+1 (415) 890-4219",
      website: "https://marcusvance.dev",
      github: "https://github.com/marcusvance",
      linkedin: "https://linkedin.com/in/marcus-vance-eng",
      status: "Available for Select Advisory & Staff Eng Roles",
      terminalCommand: "curl -s https://zenith.dev/marcus.json | jq .experience[0]"
    },
    metrics: [
      { label: "Years Experience", value: "12+", sub: "Distributed Systems & Cloud" },
      { label: "Daily Request Volume", value: "4.8B+", sub: "Zero-drop Edge Pipeline" },
      { label: "Global Uptime SLA", value: "99.999%", sub: "Multi-region Failover" },
      { label: "Open Source Stars", value: "14.2k+", sub: "Rust & Go Developer Tooling" }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Principal Infrastructure Architect",
        company: "Voxel Cloud Platform",
        location: "San Francisco, CA (Hybrid)",
        period: "2023 — Present",
        duration: "2+ yrs",
        summary: "Directing the global distributed execution engine and serverless edge runtime spanning 32 PoPs across North America, Europe, and Asia-Pacific.",
        achievements: [
          "Architected custom Rust-based WebAssembly edge sandbox reducing cold-start latency from 120ms to 4.2ms at P99 across 32 data centers.",
          "Engineered global Anycast ingress mesh handling 4.8B+ requests/day with automated zero-packet-loss BGP route shifting during ISP outages.",
          "Cut monthly cloud transit and egress expenditure by $380,000 via peer interconnects, UDP packet pacing, and custom zstandard compression buffers.",
          "Mentored a 14-person distributed systems engineering group, instituting deterministic fuzz testing and chaos engineering game days."
        ],
        technologies: ["Rust", "eBPF", "WebAssembly", "Kubernetes", "Anycast BGP", "Go", "Terraform", "Prometheus"]
      },
      {
        id: "exp-2",
        role: "Staff Systems Engineer",
        company: "Hyperion Observability & Telemetry",
        location: "Seattle, WA (Remote)",
        period: "2020 — 2023",
        duration: "3 yrs",
        summary: "Technical lead for the columnar metrics ingestion pipeline, indexing 85M samples per second for Tier-1 enterprise SaaS customers.",
        achievements: [
          "Replaced memory-bound Java time-series ingestion cluster with a SIMD-accelerated Go and Apache Arrow pipeline, yielding a 4.6x throughput boost.",
          "Engineered zero-alloc inverted index caching layer that lowered P99 metric query latencies from 3.8s down to 180ms during heavy incident bursts.",
          "Spearheaded SOC2 Type II compliance audit and end-to-end envelope encryption for cross-tenant time-series datasets.",
          "Authored the company's distributed tracing RFC adopted across 22 microservices teams, integrating OpenTelemetry standards."
        ],
        technologies: ["Go", "Apache Arrow", "Kafka", "ClickHouse", "gRPC", "Docker", "AWS Graviton", "OpenTelemetry"]
      },
      {
        id: "exp-3",
        role: "Senior Cloud Platform Engineer",
        company: "Starlight Financial & Payments",
        location: "New York, NY",
        period: "2017 — 2020",
        duration: "3 yrs",
        summary: "Core infrastructure team member maintaining PCI-DSS Level 1 compliant ledger transaction clusters and active-active database replicas.",
        achievements: [
          "Led migration of monolithic payment services into containerized Kubernetes clusters across AWS and Google Cloud Platform with zero downtime.",
          "Built distributed idempotency and distributed lock coordinator in Go/Redis, eliminating recurring $120k duplicate transaction authorizations.",
          "Designed real-time disaster recovery replication keeping cross-region PostgreSQL data loss (RPO) under 2 seconds and RTO under 90 seconds."
        ],
        technologies: ["Go", "PostgreSQL", "Redis", "Kubernetes", "GCP", "Vault", "Envoy", "Python"]
      },
      {
        id: "exp-4",
        role: "Systems Software Engineer",
        company: "Nexus Micro Networks",
        location: "Austin, TX",
        period: "2014 — 2017",
        duration: "3 yrs",
        summary: "Developed low-latency Linux kernel networking patches and high-speed packet capture tools for financial trading data providers.",
        achievements: [
          "Optimized Linux network socket queues and ring buffers (DPDK / AF_XDP), shaving 14 microseconds off multicast UDP packet arrival times.",
          "Automated continuous integration testing across bare-metal server clusters running Debian and RedHat Enterprise Linux."
        ],
        technologies: ["C", "Linux Kernel", "DPDK", "Python", "Bash", "Wireshark", "Git"]
      }
    ],
    skills: [
      {
        category: "Systems & Languages",
        items: [
          { name: "Rust", level: 95, tag: "Primary" },
          { name: "Go (Golang)", level: 94, tag: "Primary" },
          { name: "C / Modern C++", level: 82, tag: "Systems" },
          { name: "TypeScript / Node", level: 85, tag: "Tooling" },
          { name: "Python & Bash", level: 88, tag: "Automation" }
        ]
      },
      {
        category: "Distributed Systems & Cloud",
        items: [
          { name: "Kubernetes & Operator SDK", level: 94, tag: "Cloud Native" },
          { name: "Distributed Storage & Raft", level: 92, tag: "Consensus" },
          { name: "Kafka & Event Mesh", level: 88, tag: "Streaming" },
          { name: "eBPF & Kernel Tracing", level: 84, tag: "Low Level" },
          { name: "AWS & Google Cloud (GCP)", level: 92, tag: "Infra" }
        ]
      },
      {
        category: "Databases & Observability",
        items: [
          { name: "PostgreSQL & Citus", level: 90, tag: "RDBMS" },
          { name: "ClickHouse Columnar OLAP", level: 88, tag: "Analytics" },
          { name: "Redis & Valkey In-Memory", level: 95, tag: "Caching" },
          { name: "Prometheus & Grafana", level: 92, tag: "Metrics" },
          { name: "OpenTelemetry & Jaeger", level: 89, tag: "Tracing" }
        ]
      }
    ],
    projects: [
      {
        name: "aegis-raft",
        description: "High-throughput, pipelined Raft consensus engine implemented in Rust with zero-allocation log persistence and snapshot streaming.",
        stars: 6240,
        forks: 510,
        language: "Rust",
        languageColor: "#dea584",
        repoUrl: "https://github.com/marcusvance/aegis-raft",
        highlights: ["Zero unsafe memory", "SIMD CRC32 validation", "1.2M ops/sec benchmark"]
      },
      {
        name: "orbit-proxy",
        description: "Ultra-low-latency eBPF-powered TCP/UDP transparent reverse proxy for cloud microservices with sub-5-microsecond routing jitter.",
        stars: 4820,
        forks: 380,
        language: "Go & C",
        languageColor: "#00add8",
        repoUrl: "https://github.com/marcusvance/orbit-proxy",
        highlights: ["eBPF sockmap bypass", "Prometheus exporter", "Hot reload without dropped conns"]
      },
      {
        name: "pulsar-time",
        description: "Precision clock synchronization agent using PTP (IEEE 1588) and hardware timestamping for multi-region distributed databases.",
        stars: 1940,
        forks: 145,
        language: "Rust",
        languageColor: "#dea584",
        repoUrl: "https://github.com/marcusvance/pulsar-time",
        highlights: ["Sub-microsecond bounds", "Hardware NIC timestamping", "Linux PHC support"]
      },
      {
        name: "k8s-mesh-operator",
        description: "Kubernetes CRD operator automating Canary egress failover, mTLS certificate rotation, and dynamic envoy configuration.",
        stars: 1280,
        forks: 98,
        language: "Go",
        languageColor: "#00add8",
        repoUrl: "https://github.com/marcusvance/k8s-mesh-operator",
        highlights: ["Operator SDK v2", "Automatic cert renewal", "Zero downtime rolling upgrades"]
      }
    ],
    recommendations: [
      {
        author: "Dr. Aris Thorne",
        role: "VP of Infrastructure Engineering",
        company: "Voxel Cloud Platform",
        avatar: "AT",
        quote: "Marcus is the rare Staff engineer who seamlessly navigates from Linux kernel socket buffers to high-level executive infrastructure roadmaps. His WebAssembly runtime architecture directly reduced our multi-million dollar transit bill while delivering record-low P99 latencies for enterprise workloads."
      },
      {
        author: "Claire Beaumont",
        role: "Head of Platform & SRE",
        company: "Hyperion Observability",
        avatar: "CB",
        quote: "When our metrics ingestion cluster was buckling under 4x traffic during Black Friday, Marcus led the team with unmatched calm and technical mastery. His SIMD-accelerated pipeline redesign turned a crisis into the most reliable subsystem in our entire architecture."
      },
      {
        author: "Kenji Takahashi",
        role: "Principal Security Architect",
        company: "Starlight Financial",
        avatar: "KT",
        quote: "In high-stakes PCI-DSS environments, you need engineers who treat distributed state and consensus with absolute mathematical rigor. Marcus Vance is that engineer. His multi-region active replication design set the gold standard across our entire organization."
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science & Distributed Systems",
        institution: "University of California, Berkeley",
        year: "2010 — 2014",
        honors: "Summa Cum Laude • Dean's Honor List • Parallel Computing Research"
      }
    ],
    publications: [
      {
        title: "Deterministic Fault Injection in Raft-based State Machines",
        venue: "USENIX ATC Workshops",
        year: "2023"
      },
      {
        title: "Scaling Anycast BGP Ingress for Sub-millisecond Serverless Runtimes",
        venue: "Communications of the ACM (Queue Magazine)",
        year: "2021"
      }
    ]
  };

  let resumeData = DEFAULT_RESUME;
  let activeSkillFilter = 'all';

  // ---------------------------------------------------------------------------
  // 2. Helpers & Toast Engine
  // ---------------------------------------------------------------------------
  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' 
      ? '<span style="color:#10b981;">✓</span>' 
      : '<span style="color:#38bdf8;">ℹ</span>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  // ---------------------------------------------------------------------------
  // 3. UI Component Renderers
  // ---------------------------------------------------------------------------
  function renderMetrics() {
    const container = document.getElementById('metrics-container');
    if (!container) return;

    container.innerHTML = resumeData.metrics.map(m => `
      <div class="metric-tile">
        <div class="metric-val">${escapeHtml(m.value)}</div>
        <div class="metric-lbl">${escapeHtml(m.label)}</div>
        <div class="metric-sub">${escapeHtml(m.sub)}</div>
      </div>
    `).join('');
  }

  function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML = resumeData.experience.map(exp => `
      <article class="timeline-item">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${escapeHtml(exp.role)} &bull; <span class="timeline-company">${escapeHtml(exp.company)}</span></h3>
          </div>
          <span class="timeline-badge">${escapeHtml(exp.period)} (${escapeHtml(exp.duration)})</span>
        </div>
        <div class="timeline-meta">
          <span>📍 ${escapeHtml(exp.location)}</span>
        </div>
        <p class="timeline-summary">${escapeHtml(exp.summary)}</p>
        <ul class="achievements-list">
          ${exp.achievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join('')}
        </ul>
        <div class="tech-tags">
          ${exp.technologies.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </article>
    `).join('');
  }

  function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    let categories = resumeData.skills;
    if (activeSkillFilter !== 'all') {
      categories = categories.filter(c => c.category === activeSkillFilter);
    }

    container.innerHTML = categories.map(cat => `
      <div class="skill-card">
        <div class="skill-card-title">
          <span>${escapeHtml(cat.category)}</span>
          <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">${cat.items.length} Techs</span>
        </div>
        <div class="skill-items-list">
          ${cat.items.map(item => `
            <div class="skill-item-row">
              <div class="skill-meta">
                <span class="skill-name">${escapeHtml(item.name)}</span>
                <span class="skill-tag-pill">${escapeHtml(item.tag)}</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width: ${item.level}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = resumeData.projects.map(proj => `
      <article class="repo-card">
        <div>
          <div class="repo-header">
            <a href="${proj.repoUrl}" target="_blank" rel="noopener" class="repo-name">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>${escapeHtml(proj.name)}</span>
            </a>
            <div class="repo-stats">
              <span title="GitHub Stars">★ ${formatNumber(proj.stars)}</span>
              <span title="Forks">⑂ ${formatNumber(proj.forks)}</span>
            </div>
          </div>
          <p class="repo-desc">${escapeHtml(proj.description)}</p>
          <div class="repo-highlights">
            ${proj.highlights.map(h => `<span class="repo-highlight-chip">✓ ${escapeHtml(h)}</span>`).join('')}
          </div>
        </div>
        <div class="repo-footer">
          <span class="repo-lang">
            <span class="lang-dot" style="background-color: ${proj.languageColor};"></span>
            <span>${escapeHtml(proj.language)}</span>
          </span>
          <a href="${proj.repoUrl}" target="_blank" rel="noopener" style="font-size:0.75rem; font-weight:600;">
            View Source &rarr;
          </a>
        </div>
      </article>
    `).join('');
  }

  function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;

    container.innerHTML = resumeData.recommendations.map(rec => `
      <div class="rec-card">
        <blockquote class="rec-quote">
          “${escapeHtml(rec.quote)}”
        </blockquote>
        <div class="rec-author-meta">
          <div class="rec-avatar">${escapeHtml(rec.avatar)}</div>
          <div>
            <div class="rec-author-name">${escapeHtml(rec.author)}</div>
            <div class="rec-author-title">${escapeHtml(rec.role)} &bull; ${escapeHtml(rec.company)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderEducationAndPubs() {
    const eduContainer = document.getElementById('education-container');
    const pubContainer = document.getElementById('publications-container');

    if (eduContainer) {
      eduContainer.innerHTML = resumeData.education.map(edu => `
        <div class="info-item">
          <div class="info-item-title">${escapeHtml(edu.degree)}</div>
          <div class="info-item-sub">${escapeHtml(edu.institution)} &bull; ${escapeHtml(edu.year)}</div>
          <div class="info-item-detail">${escapeHtml(edu.honors)}</div>
        </div>
      `).join('');
    }

    if (pubContainer) {
      pubContainer.innerHTML = resumeData.publications.map(pub => `
        <div class="info-item">
          <div class="info-item-title">${escapeHtml(pub.title)}</div>
          <div class="info-item-sub">${escapeHtml(pub.venue)} (${escapeHtml(pub.year)})</div>
        </div>
      `).join('');
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Modal Controllers
  // ---------------------------------------------------------------------------
  function toggleContactModal(open) {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    if (open) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const input = document.getElementById('contact-name');
      if (input) input.focus();
    } else {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Theme Controller
  // ---------------------------------------------------------------------------
  function initTheme() {
    const saved = localStorage.getItem('zenith_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('zenith_theme', next);
    updateThemeIcons(next);
  }

  function updateThemeIcons(theme) {
    const sun = document.getElementById('theme-sun-icon');
    const moon = document.getElementById('theme-moon-icon');
    if (sun && moon) {
      if (theme === 'light') {
        sun.style.display = 'block';
        moon.style.display = 'none';
      } else {
        sun.style.display = 'none';
        moon.style.display = 'block';
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Bootstrapping & Event Listeners
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    initTheme();

    // Fetch fresh JSON if available
    try {
      const resp = await fetch('assets/data/resume.json');
      if (resp.ok) {
        resumeData = await resp.json();
      }
    } catch (e) {
      console.info('Zenith CV loaded with baseline offline dataset.');
    }

    // Render sections
    renderMetrics();
    renderExperience();
    renderSkills();
    renderProjects();
    renderRecommendations();
    renderEducationAndPubs();

    // 1-Click Print PDF button
    const btnPrint = document.getElementById('btn-print-cv');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Copy Terminal cURL Command
    const btnCopyTerminal = document.getElementById('btn-copy-terminal');
    const cmdTextEl = document.getElementById('terminal-cmd-text');
    const copyLabel = document.getElementById('copy-btn-label');

    if (btnCopyTerminal && cmdTextEl) {
      btnCopyTerminal.addEventListener('click', async () => {
        const text = cmdTextEl.textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
          if (copyLabel) copyLabel.textContent = 'Copied!';
          showToast('Copied cURL command to clipboard!', 'success');
          setTimeout(() => {
            if (copyLabel) copyLabel.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          showToast('Command ready: ' + text, 'info');
        }
      });
    }

    // Skill Filter Buttons
    document.querySelectorAll('.skill-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.skill-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeSkillFilter = e.currentTarget.getAttribute('data-skill-filter');
        renderSkills();
      });
    });

    // Contact Modal Triggers
    const btnOpenContact = document.getElementById('btn-open-contact');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const contactModal = document.getElementById('contact-modal');
    const contactForm = document.getElementById('contact-form');

    if (btnOpenContact) btnOpenContact.addEventListener('click', () => toggleContactModal(true));
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => toggleContactModal(false));
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => toggleContactModal(false));
    if (contactModal) {
      contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) toggleContactModal(false);
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('contact-email-input');
        const emailVal = emailInput ? emailInput.value : '';
        toggleContactModal(false);
        contactForm.reset();
        showToast(`Inquiry transmitted for ${emailVal}. Marcus will reply within 24h.`, 'success');
      });
    }

    // Theme Toggle Trigger
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

    // Escape Key Modal Close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleContactModal(false);
      }
    });
  });

})();
