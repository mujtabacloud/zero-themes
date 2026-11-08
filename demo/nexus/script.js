/**
 * NEXUS ADMIN & ANALYTICS UI
 * Senior Human-Engineered B2B SaaS Dashboard System
 * Native Vanilla ES6 • Pure Canvas Chart Engine • Client-side Sorting & Filtering
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Data Store & Fallback Telemetry (Zero-dependency offline resilience)
  // ---------------------------------------------------------------------------
  const DEFAULT_DATA = {
    metrics: {
      mrr: { value: 128450, change: 12.4, period: "vs last month" },
      activeSeats: { value: 4892, change: 8.1, period: "vs last month" },
      nrr: { value: 118.4, change: 2.3, period: "net retention" },
      uptime: { value: 99.98, latency: "42ms", status: "Healthy & Nominal" }
    },
    chartData: {
      "7d": {
        labels: ["Nov 02", "Nov 03", "Nov 04", "Nov 05", "Nov 06", "Nov 07", "Nov 08"],
        mrr: [123800, 124500, 125300, 126100, 127200, 127900, 128450],
        inflow: [4200, 3800, 5100, 4600, 6200, 5400, 6800]
      },
      "30d": {
        labels: ["Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30", "Nov 04", "Nov 08"],
        mrr: [112000, 115200, 118400, 121000, 124300, 126500, 128450],
        inflow: [18200, 19400, 22100, 24500, 26800, 28100, 31200]
      },
      "q4": {
        labels: ["Week 40", "Week 41", "Week 42", "Week 43", "Week 44", "Week 45"],
        mrr: [108000, 112500, 116800, 121400, 125200, 128450],
        inflow: [24000, 27500, 31000, 35400, 38200, 42100]
      },
      "ytd": {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        mrr: [64000, 78500, 91200, 104000, 118000, 128450],
        inflow: [52000, 68000, 84000, 102000, 121000, 148000]
      }
    },
    trafficSources: [
      { source: "Direct SaaS Portal", percentage: 42, visitors: 52400, color: "#38bdf8" },
      { source: "Organic Search (Google / DuckDuckGo)", percentage: 28, visitors: 34800, color: "#10b981" },
      { source: "Developer Ecosystem (GitHub / NPM)", percentage: 18, visitors: 22400, color: "#818cf8" },
      { source: "Referrals & ProductHunt", percentage: 12, visitors: 14900, color: "#f59e0b" }
    ],
    transactions: [
      { id: "INV-2026-9041", customer: "Vercel Labs Inc.", email: "billing@vercel-labs.io", plan: "Enterprise Scale", interval: "Annual", amount: 24000, status: "Paid", date: "2026-11-07", seats: 85 },
      { id: "INV-2026-9040", customer: "Linear Orbit Systems", email: "finance@linear-orbit.app", plan: "Pro Team", interval: "Annual", amount: 4800, status: "Paid", date: "2026-11-07", seats: 20 },
      { id: "INV-2026-9039", customer: "Supabase Infrastructure", email: "accounts@supabase-infra.co", plan: "Enterprise Scale", interval: "Annual", amount: 18000, status: "Paid", date: "2026-11-06", seats: 60 },
      { id: "INV-2026-9038", customer: "Tailwind Labs Global", email: "admin@tailwind-labs.com", plan: "Pro Team", interval: "Monthly", amount: 420, status: "Paid", date: "2026-11-06", seats: 14 },
      { id: "INV-2026-9037", customer: "Starlight Creative AG", email: "contact@starlight-swiss.ch", plan: "Growth Starter", interval: "Monthly", amount: 180, status: "Past Due", date: "2026-11-05", seats: 6 },
      { id: "INV-2026-9036", customer: "Datadog Observability", email: "corp-dev@datadog-ops.net", plan: "Enterprise Scale", interval: "Annual", amount: 36000, status: "Paid", date: "2026-11-04", seats: 120 },
      { id: "INV-2026-9035", customer: "Acme Microelectronics", email: "payments@acme-micro.com", plan: "Pro Team", interval: "Annual", amount: 3600, status: "Paid", date: "2026-11-03", seats: 15 },
      { id: "INV-2026-9034", customer: "Resend Courier Cloud", email: "ops@resend-courier.io", plan: "Pro Team", interval: "Monthly", amount: 320, status: "Paid", date: "2026-11-03", seats: 10 },
      { id: "INV-2026-9033", customer: "Prisma Data Layer", email: "finance@prisma-data.dev", plan: "Enterprise Scale", interval: "Annual", amount: 14400, status: "Paid", date: "2026-11-02", seats: 45 },
      { id: "INV-2026-9032", customer: "Neon Serverless Postgres", email: "infra@neon-serverless.tech", plan: "Pro Team", interval: "Monthly", amount: 480, status: "Paid", date: "2026-11-02", seats: 16 },
      { id: "INV-2026-9031", customer: "Raycast Extension Core", email: "devs@raycast-core.com", plan: "Growth Starter", interval: "Monthly", amount: 120, status: "Paid", date: "2026-11-01", seats: 4 },
      { id: "INV-2026-9030", customer: "Chronicle Publishing Ltd", email: "editor@chronicle-press.co.uk", plan: "Growth Starter", interval: "Monthly", amount: 95, status: "Trialing", date: "2026-10-31", seats: 3 }
    ],
    team: [
      { name: "Alexander Vance", email: "alexander.vance@nexus-core.io", role: "Workspace Owner", avatar: "AV", twoFactor: "Enforced (YubiKey 5C)", lastActive: "Active now" },
      { name: "Elena Rostova", email: "elena.rostova@nexus-core.io", role: "Lead SRE & Security", avatar: "ER", twoFactor: "Enforced (Authenticator)", lastActive: "14m ago" },
      { name: "Marcus Aurelius Chen", email: "marcus.chen@nexus-core.io", role: "Staff Platform Architect", avatar: "MC", twoFactor: "Enforced (YubiKey 5C)", lastActive: "1h ago" },
      { name: "Sarah Jenkins", email: "sarah.jenkins@nexus-core.io", role: "Billing & Revenue Ops", avatar: "SJ", twoFactor: "Enforced (Authenticator)", lastActive: "3h ago" },
      { name: "Devin Thorne", email: "devin.thorne@nexus-core.io", role: "Frontend Engineer", avatar: "DT", twoFactor: "Enforced (Authenticator)", lastActive: "Yesterday" }
    ],
    serverNodes: [
      { region: "US-East (N. Virginia)", ping: "24ms", uptime: "99.99%", status: "nominal" },
      { region: "EU-Central (Frankfurt)", ping: "38ms", uptime: "99.98%", status: "nominal" },
      { region: "AP-East (Tokyo)", ping: "72ms", uptime: "99.95%", status: "nominal" },
      { region: "US-West (Oregon)", ping: "31ms", uptime: "99.99%", status: "nominal" }
    ],
    notifications: [
      { id: "notif-1", type: "deal", title: "Enterprise Renewal Secured", desc: "Datadog Observability renewed annual contract ($36,000/yr).", time: "12m ago", unread: true },
      { id: "notif-2", type: "alert", title: "P99 Edge Latency Normalized", desc: "Tokyo edge node ping dropped from 110ms back to healthy 72ms.", time: "45m ago", unread: true },
      { id: "notif-3", type: "billing", title: "Payment Past Due Notice", desc: "Starlight Creative card charge declined ($180). Dunning sequence triggered.", time: "2h ago", unread: true },
      { id: "notif-4", type: "deploy", title: "Canary Release Deployed", desc: "Gateway v2.8.4 successfully promoted to 100% of global traffic.", time: "5h ago", unread: false }
    ]
  };

  // State
  let appState = {
    data: DEFAULT_DATA,
    currentTimeframe: "30d",
    currentMetric: "mrr",
    currentFilter: "All",
    searchQuery: "",
    sortColumn: "date",
    sortDirection: "desc",
    currentPage: 1,
    pageSize: 6
  };

  // ---------------------------------------------------------------------------
  // 2. Formatters & Helpers
  // ---------------------------------------------------------------------------
  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

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
  // 3. High-DPI Canvas Chart Engine
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('revenue-canvas');
  const tooltip = document.getElementById('chart-tooltip');
  let animationProgress = 1;

  function renderChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    
    // Set actual canvas pixel buffer for retina sharpness
    const width = rect.width;
    const height = 290;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const timeframe = appState.data.chartData[appState.currentTimeframe] || appState.data.chartData["30d"];
    const labels = timeframe.labels;
    const values = timeframe[appState.currentMetric] || timeframe.mrr;

    const padding = { top: 25, right: 30, bottom: 35, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minVal = Math.min(...values) * 0.9;
    const maxVal = Math.max(...values) * 1.05;

    // Draw horizontal dashed grid lines
    const gridRows = 4;
    ctx.lineWidth = 1;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim() || 'rgba(255,255,255,0.08)';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (chartH / gridRows) * i;
      const val = maxVal - ((maxVal - minVal) / gridRows) * i;

      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillText(formatCurrency(val), padding.left - 10, y);
    }

    // Coordinates calculation
    const points = values.map((val, idx) => {
      const x = padding.left + (chartW / (values.length - 1)) * idx;
      const normalized = (val - minVal) / (maxVal - minVal);
      const y = padding.top + chartH - normalized * chartH;
      return { x, y, val, label: labels[idx] };
    });

    // Store points for mousemove proximity detection
    canvas._chartPoints = points;

    if (points.length < 2) return;

    // Draw smooth cubic bezier curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i != points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    // Save path for stroke
    const linePath = new Path2D();
    linePath.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i != points.length - 2 ? points[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      linePath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    // Gradient fill under the curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw main curve line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(linePath);

    // Draw bottom X-axis labels & vertex dots
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    points.forEach((pt) => {
      // Small node dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#080b11';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Label below
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
      ctx.fillText(pt.label, pt.x, height - padding.bottom + 10);
    });
  }

  // Canvas Mouse Interaction (Hover crosshair & tooltip)
  if (canvas && tooltip) {
    canvas.addEventListener('mousemove', (e) => {
      if (!canvas._chartPoints || !canvas._chartPoints.length) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      // Find closest point by X coordinate
      let closest = canvas._chartPoints[0];
      let minDiff = Math.abs(mouseX - closest.x);

      for (let i = 1; i < canvas._chartPoints.length; i++) {
        const diff = Math.abs(mouseX - canvas._chartPoints[i].x);
        if (diff < minDiff) {
          minDiff = diff;
          closest = canvas._chartPoints[i];
        }
      }

      // Re-draw chart and overlay vertical hairline & active dot
      renderChart();
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      // Vertical guide line
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(closest.x, 25);
      ctx.lineTo(closest.x, 290 - 35);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlighted outer circle
      ctx.beginPath();
      ctx.arc(closest.x, closest.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip position & text
      const metricLabel = appState.currentMetric === 'mrr' ? 'MRR Run-rate' : 'Net Inflow';
      tooltip.innerHTML = `
        <div style="color:#94a3b8; font-size: 0.7rem; margin-bottom: 2px;">${closest.label} • ${metricLabel}</div>
        <div style="font-weight: 800; font-size: 0.95rem; color: #38bdf8;">${formatCurrency(closest.val)}</div>
      `;
      tooltip.style.left = closest.x + 'px';
      tooltip.style.top = closest.y - 12 + 'px';
      tooltip.style.opacity = '1';
    });

    canvas.addEventListener('mouseleave', () => {
      renderChart();
      tooltip.style.opacity = '0';
    });
  }

  window.addEventListener('resize', () => {
    renderChart();
  });

  // ---------------------------------------------------------------------------
  // 4. Traffic Breakdown Renderer
  // ---------------------------------------------------------------------------
  function renderTrafficSources() {
    const container = document.getElementById('traffic-breakdown-list');
    if (!container) return;

    container.innerHTML = appState.data.trafficSources.map(item => `
      <div class="breakdown-item">
        <div class="breakdown-meta">
          <span class="breakdown-label">
            <span class="breakdown-dot" style="background-color: ${item.color};"></span>
            <span>${item.source}</span>
          </span>
          <span class="breakdown-val">${item.percentage}% <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(${formatNumber(item.visitors)})</span></span>
        </div>
        <div class="breakdown-bar-track">
          <div class="breakdown-bar-fill" style="width: ${item.percentage}%; background-color: ${item.color};"></div>
        </div>
      </div>
    `).join('');
  }

  // ---------------------------------------------------------------------------
  // 5. Data Table: Search, Filter, Sort & Pagination
  // ---------------------------------------------------------------------------
  function getFilteredTransactions() {
    let list = [...appState.data.transactions];

    // Filter by status pill
    if (appState.currentFilter !== 'All') {
      list = list.filter(t => t.status.toLowerCase() === appState.currentFilter.toLowerCase());
    }

    // Search query
    if (appState.searchQuery.trim()) {
      const q = appState.searchQuery.toLowerCase();
      list = list.filter(t => 
        t.customer.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.plan.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[appState.sortColumn];
      let valB = b[appState.sortColumn];

      if (typeof valA === 'string') {
        return appState.sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return appState.sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }

  function renderTable() {
    const tbody = document.getElementById('transactions-tbody');
    const paginationInfo = document.getElementById('pagination-info');
    const pageIndicator = document.getElementById('page-indicator');
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    if (!tbody) return;

    // Update count badges
    const allCount = appState.data.transactions.length;
    const paidCount = appState.data.transactions.filter(t => t.status === 'Paid').length;
    const pastDueCount = appState.data.transactions.filter(t => t.status === 'Past Due').length;
    const trialingCount = appState.data.transactions.filter(t => t.status === 'Trialing').length;

    const elCountAll = document.getElementById('count-all');
    const elCountPaid = document.getElementById('count-paid');
    const elCountPastDue = document.getElementById('count-pastdue');
    const elCountTrialing = document.getElementById('count-trialing');
    if (elCountAll) elCountAll.textContent = allCount;
    if (elCountPaid) elCountPaid.textContent = paidCount;
    if (elCountPastDue) elCountPastDue.textContent = pastDueCount;
    if (elCountTrialing) elCountTrialing.textContent = trialingCount;

    const filtered = getFilteredTransactions();
    const total = filtered.length;
    const totalPages = Math.ceil(total / appState.pageSize) || 1;

    if (appState.currentPage > totalPages) appState.currentPage = totalPages;
    if (appState.currentPage < 1) appState.currentPage = 1;

    const startIdx = (appState.currentPage - 1) * appState.pageSize;
    const paginated = filtered.slice(startIdx, startIdx + appState.pageSize);

    if (paginated.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            No records found matching "<strong>${escapeHtml(appState.searchQuery)}</strong>"
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginated.map(t => `
        <tr>
          <td>
            <code style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-cyan);">${t.id}</code>
          </td>
          <td>
            <div class="customer-cell">
              <span class="customer-name">${escapeHtml(t.customer)}</span>
              <span class="customer-email">${escapeHtml(t.email)}</span>
            </div>
          </td>
          <td>
            <span>${t.plan}</span>
            <span style="font-size: 0.74rem; color: var(--text-muted);"> (${t.interval})</span>
          </td>
          <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
            ${t.seats}
          </td>
          <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">
            ${formatCurrency(t.amount)}
          </td>
          <td>
            <span class="status-tag ${t.status.replace(/\s+/g, '')}">
              ● ${t.status}
            </span>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">
            ${t.date}
          </td>
          <td style="text-align: center;">
            <button class="btn-secondary btn-receipt-download" data-id="${t.id}" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">
              PDF
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Pagination status
    const startNum = total === 0 ? 0 : startIdx + 1;
    const endNum = Math.min(startIdx + appState.pageSize, total);
    if (paginationInfo) paginationInfo.textContent = `Showing ${startNum}-${endNum} of ${total} records`;
    if (pageIndicator) pageIndicator.textContent = `Page ${appState.currentPage} of ${totalPages}`;
    if (btnPrev) btnPrev.disabled = appState.currentPage <= 1;
    if (btnNext) btnNext.disabled = appState.currentPage >= totalPages;

    // Attach receipt download listeners
    document.querySelectorAll('.btn-receipt-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        showToast(`Downloaded tax invoice & receipt for ${id}`, 'success');
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  // ---------------------------------------------------------------------------
  // 6. CSV Export Generator (RFC 4180 standard)
  // ---------------------------------------------------------------------------
  function exportToCSV() {
    const list = getFilteredTransactions();
    if (!list.length) {
      showToast('No transaction records available to export', 'info');
      return;
    }

    const headers = ['Invoice ID', 'Customer Name', 'Billing Email', 'Plan Tier', 'Billing Interval', 'Enterprise Seats', 'Amount (USD)', 'Status', 'Date'];
    const rows = list.map(t => [
      t.id,
      `"${t.customer.replace(/"/g, '""')}"`,
      `"${t.email.replace(/"/g, '""')}"`,
      `"${t.plan}"`,
      t.interval,
      t.seats,
      t.amount,
      t.status,
      t.date
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexus-revenue-telemetry-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${list.length} records to CSV successfully!`, 'success');
  }

  // ---------------------------------------------------------------------------
  // 7. Infrastructure Health Nodes & RBAC Team Directory
  // ---------------------------------------------------------------------------
  function renderEdgeNodes() {
    const container = document.getElementById('edge-nodes-container');
    if (!container) return;

    container.innerHTML = appState.data.serverNodes.map(node => `
      <div class="node-item">
        <div>
          <div class="node-region">${node.region}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Uptime SLA: ${node.uptime}</div>
        </div>
        <div class="node-ping">
          <span class="pulse-dot"></span>
          <span>${node.ping}</span>
        </div>
      </div>
    `).join('');
  }

  function renderTeamList() {
    const container = document.getElementById('team-list-container');
    const teamBadge = document.getElementById('sidebar-team-count');
    if (!container) return;

    if (teamBadge) teamBadge.textContent = appState.data.team.length;

    container.innerHTML = appState.data.team.map(member => `
      <div class="team-item">
        <div class="team-member-info">
          <div class="member-avatar">${member.avatar}</div>
          <div>
            <div class="member-name">${escapeHtml(member.name)}</div>
            <div class="member-role">${escapeHtml(member.role)} &bull; <span style="color:var(--text-muted); font-size: 0.72rem;">${escapeHtml(member.email)}</span></div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="team-badge-2fa">2FA: ${member.twoFactor.split(' ')[0]}</span>
          <span style="font-size: 0.74rem; color: var(--text-muted);">${member.lastActive}</span>
        </div>
      </div>
    `).join('');
  }

  // ---------------------------------------------------------------------------
  // 8. Notifications Drawer
  // ---------------------------------------------------------------------------
  function renderNotifications() {
    const list = document.getElementById('drawer-notifications-list');
    const unreadCountEl = document.getElementById('unread-count');
    const badgeDot = document.getElementById('notif-badge');
    if (!list) return;

    const unreadCount = appState.data.notifications.filter(n => n.unread).length;
    if (unreadCountEl) unreadCountEl.textContent = unreadCount;
    if (badgeDot) badgeDot.style.display = unreadCount > 0 ? 'block' : 'none';

    list.innerHTML = appState.data.notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-head">
          <span class="notif-title">${escapeHtml(n.title)}</span>
          <span class="notif-time">${n.time}</span>
        </div>
        <div class="notif-desc">${escapeHtml(n.desc)}</div>
      </div>
    `).join('');
  }

  function toggleDrawer(open) {
    const drawer = document.getElementById('notifications-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (!drawer || !backdrop) return;

    if (open) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
    } else {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  // ---------------------------------------------------------------------------
  // 9. Modals & Forms
  // ---------------------------------------------------------------------------
  function toggleInviteModal(open) {
    const modal = document.getElementById('invite-modal');
    if (!modal) return;
    if (open) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const input = document.getElementById('invite-name');
      if (input) input.focus();
    } else {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // ---------------------------------------------------------------------------
  // 10. Theme Toggle
  // ---------------------------------------------------------------------------
  function initTheme() {
    const saved = localStorage.getItem('nexus_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nexus_theme', next);
    updateThemeIcons(next);
    renderChart(); // re-render canvas with adjusted palette
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
  // 11. Event Listeners & Bootstrapping
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    initTheme();

    // Try fetching fresh analytics.json
    try {
      const resp = await fetch('assets/data/analytics.json');
      if (resp.ok) {
        const json = await resp.json();
        appState.data = json;
      }
    } catch (e) {
      console.info('Nexus running with embedded telemetry baseline.');
    }

    // Initial renders
    renderChart();
    renderTrafficSources();
    renderTable();
    renderEdgeNodes();
    renderTeamList();
    renderNotifications();

    // Timeframe toggle buttons
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        appState.currentTimeframe = e.currentTarget.getAttribute('data-timeframe');
        renderChart();
      });
    });

    // Metric toggle buttons (MRR vs Inflow)
    const btnMrr = document.getElementById('btn-chart-mrr');
    const btnInflow = document.getElementById('btn-chart-inflow');
    if (btnMrr && btnInflow) {
      btnMrr.addEventListener('click', () => {
        btnMrr.classList.add('active');
        btnInflow.classList.remove('active');
        appState.currentMetric = 'mrr';
        renderChart();
      });
      btnInflow.addEventListener('click', () => {
        btnInflow.classList.add('active');
        btnMrr.classList.remove('active');
        appState.currentMetric = 'inflow';
        renderChart();
      });
    }

    // Status pill filter buttons
    document.querySelectorAll('.status-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.status-pill-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        appState.currentFilter = e.currentTarget.getAttribute('data-filter');
        appState.currentPage = 1;
        renderTable();
      });
    });

    // Table search input
    const searchInput = document.getElementById('table-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value;
        appState.currentPage = 1;
        renderTable();
      });
    }

    // Global quick search button
    const cmdSearchBtn = document.getElementById('btn-search-cmd');
    if (cmdSearchBtn && searchInput) {
      cmdSearchBtn.addEventListener('click', () => {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      });
    }

    // Table Header sorting
    document.querySelectorAll('#transactions-table th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (appState.sortColumn === col) {
          appState.sortDirection = appState.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          appState.sortColumn = col;
          appState.sortDirection = 'desc';
        }
        renderTable();
      });
    });

    // Pagination
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (appState.currentPage > 1) {
          appState.currentPage--;
          renderTable();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        appState.currentPage++;
        renderTable();
      });
    }

    // Export CSV buttons
    const btnExportTop = document.getElementById('btn-export-csv');
    const btnExportTable = document.getElementById('btn-table-csv');
    if (btnExportTop) btnExportTop.addEventListener('click', exportToCSV);
    if (btnExportTable) btnExportTable.addEventListener('click', exportToCSV);

    // Notifications Drawer interactions
    const btnNotif = document.getElementById('btn-notifications');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const btnMarkAllRead = document.getElementById('btn-mark-all-read');

    if (btnNotif) btnNotif.addEventListener('click', () => toggleDrawer(true));
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener('click', () => {
        appState.data.notifications.forEach(n => n.unread = false);
        renderNotifications();
        showToast('All notifications marked as read', 'success');
      });
    }

    // Invite Modal interactions
    const btnOpenInvite = document.getElementById('btn-open-invite');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelInvite = document.getElementById('btn-cancel-invite');
    const inviteModal = document.getElementById('invite-modal');
    const inviteForm = document.getElementById('invite-form');

    if (btnOpenInvite) btnOpenInvite.addEventListener('click', () => toggleInviteModal(true));
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => toggleInviteModal(false));
    if (btnCancelInvite) btnCancelInvite.addEventListener('click', () => toggleInviteModal(false));
    if (inviteModal) {
      inviteModal.addEventListener('click', (e) => {
        if (e.target === inviteModal) toggleInviteModal(false);
      });
    }

    if (inviteForm) {
      inviteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('invite-name');
        const emailInput = document.getElementById('invite-email');
        const roleSelect = document.getElementById('invite-role');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role = roleSelect.value;
        const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TM';

        const newMember = {
          name,
          email,
          role,
          avatar: initials,
          twoFactor: "Enforced (YubiKey 5C)",
          lastActive: "Invited just now"
        };

        appState.data.team.unshift(newMember);
        renderTeamList();
        toggleInviteModal(false);
        inviteForm.reset();
        showToast(`Provisioning invitation sent to ${email}`, 'success');
      });
    }

    // Theme Toggle button
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchInput.focus();
        }
      }
      // Escape key closes modals / drawer
      if (e.key === 'Escape') {
        toggleDrawer(false);
        toggleInviteModal(false);
      }
    });

    // Simulated telemetry sync interval
    let syncCount = 4;
    setInterval(() => {
      syncCount = (syncCount + 1) % 15;
      const syncLabel = document.getElementById('last-sync-label');
      if (syncLabel) {
        syncLabel.textContent = `Sync ${syncCount}s ago`;
      }
    }, 1000);
  });

})();
