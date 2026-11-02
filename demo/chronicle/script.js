/**
 * The Chronicle – Editorial & Magazine Template
 * High-performance, zero-dependency ES6
 * Real-time reading progress, typography scaling, live search & category filters,
 * distraction-free modal reader, localStorage bookmarks & newsletter subscription.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initThemeToggle();
  initTypographyControls();
  initArticlesCatalog();
  initBookmarksDrawer();
  initNewsletterForms();
  initKeyboardShortcuts();
});

/* ==========================================================================
   1. SCROLL READING PROGRESS BAR
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  });
}

/* ==========================================================================
   2. DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('chronicle_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('chronicle_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark Obsidian' : 'Light Paper'} theme`, '🎨');
  });

  function updateThemeIcon(theme) {
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

/* ==========================================================================
   3. TYPOGRAPHY SCALING & SERIF / SANS TOGGLE
   ========================================================================== */
function initTypographyControls() {
  const increaseBtn = document.getElementById('font-increase-btn');
  const decreaseBtn = document.getElementById('font-decrease-btn');
  const familyToggle = document.getElementById('font-family-toggle');
  const familyLabel = document.getElementById('font-toggle-label');

  let currentFontSize = parseFloat(localStorage.getItem('chronicle_fontsize') || '16');
  document.documentElement.style.fontSize = `${currentFontSize}px`;

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      if (currentFontSize < 20) {
        currentFontSize += 1;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        localStorage.setItem('chronicle_fontsize', currentFontSize);
        showToast(`Text size: ${currentFontSize}px`, '🔍');
      }
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (currentFontSize > 13) {
        currentFontSize -= 1;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        localStorage.setItem('chronicle_fontsize', currentFontSize);
        showToast(`Text size: ${currentFontSize}px`, '🔍');
      }
    });
  }

  if (familyToggle) {
    let isSerif = localStorage.getItem('chronicle_fontfamily') !== 'sans';
    applyFontFamily(isSerif);

    familyToggle.addEventListener('click', () => {
      isSerif = !isSerif;
      applyFontFamily(isSerif);
      localStorage.setItem('chronicle_fontfamily', isSerif ? 'serif' : 'sans');
      showToast(`Font mode: ${isSerif ? 'Classical Serif' : 'Modern Sans'}`, 'Aa');
    });

    function applyFontFamily(serif) {
      if (serif) {
        document.body.classList.remove('font-sans');
        document.body.classList.add('font-serif');
        if (familyLabel) familyLabel.textContent = 'Sans';
      } else {
        document.body.classList.remove('font-serif');
        document.body.classList.add('font-sans');
        if (familyLabel) familyLabel.textContent = 'Serif';
      }
    }
  }
}

/* ==========================================================================
   4. ARTICLES CATALOG, CATEGORY FILTERS & LIVE SEARCH
   ========================================================================== */
let allArticlesData = [];
let currentCategory = 'all';
let currentSearchQuery = '';

function initArticlesCatalog() {
  const gridContainer = document.getElementById('articles-grid');
  const searchInput = document.getElementById('masthead-search-input');
  const filterBtns = document.querySelectorAll('.nav-cat-btn');

  // Fallback data if file fetch is blocked
  const fallbackArticles = [
    {
      id: "post-1",
      title: "The Renaissance of Static Hypertext Systems",
      tag: "Architecture",
      tagColor: "#e11d48",
      date: "Nov 2, 2026",
      readTime: "7 min read",
      author: "Dr. Thomas Wright",
      authorRole: "Staff Architect",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
      excerpt: "Why modern software engineering is discarding multi-tier complexity in favor of immutable files, edge distribution, and the eternal clarity of plain text."
    },
    {
      id: "post-2",
      title: "Autonomous Neural Agents and the Epistemology of Proof",
      tag: "Artificial Intelligence",
      tagColor: "#8b5cf6",
      date: "Oct 29, 2026",
      readTime: "9 min read",
      author: "Elena Rostova",
      authorRole: "Senior Fellow",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      excerpt: "When autonomous agents write software that proves theorems neither human nor compiler can parse, what becomes of scientific consensus?"
    },
    {
      id: "post-3",
      title: "The Lost Art of Clean Typography in Digital Spaces",
      tag: "Design",
      tagColor: "#06b6d4",
      date: "Oct 26, 2026",
      readTime: "5 min read",
      author: "Marcus Sterling",
      authorRole: "Typographer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      excerpt: "A meditation on measure, vertical rhythm, optical kerning, and how the web forgot six centuries of bookmaking discipline."
    },
    {
      id: "post-4",
      title: "Deep Memory: Why Silicon Physics Demands Radical Architecture",
      tag: "Systems",
      tagColor: "#10b981",
      date: "Oct 22, 2026",
      readTime: "11 min read",
      author: "Julian Vance",
      authorRole: "Principal Hardware Architect",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      excerpt: "The von Neumann bottleneck is no longer a theoretical annoyance—it is a physical wall of heat, latency, and quantum tunneling."
    },
    {
      id: "post-5",
      title: "On Solitude in the Hyperconnected Era",
      tag: "Philosophy",
      tagColor: "#f59e0b",
      date: "Oct 18, 2026",
      readTime: "6 min read",
      author: "Claire Beaumont",
      authorRole: "Contributing Essayist",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
      excerpt: "When every waking micro-moment is saturated with alerts, the inner workspace where deep synthesis occurs begins to wither."
    },
    {
      id: "post-6",
      title: "The Geometry of Decentralized Protocols",
      tag: "Architecture",
      tagColor: "#e11d48",
      date: "Oct 14, 2026",
      readTime: "8 min read",
      author: "Dr. Thomas Wright",
      authorRole: "Staff Architect",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      excerpt: "Mathematical topology of Byzantine fault tolerant gossip networks in low-earth orbit and edge environments."
    }
  ];

  fetch('./assets/data/articles.json')
    .then(res => res.json())
    .then(data => {
      allArticlesData = data;
      renderArticles();
    })
    .catch(() => {
      allArticlesData = fallbackArticles;
      renderArticles();
    });

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');
      currentCategory = filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.add('active'));

      const activeBadge = document.getElementById('active-filter-badge');
      if (activeBadge) {
        activeBadge.innerHTML = `Filter: <span>${filter === 'all' ? 'All Dispatches' : filter}</span>`;
      }

      renderArticles();
    });
  });

  // Live Instant Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderArticles();
    });
  }

  function renderArticles() {
    if (!gridContainer) return;

    const filtered = allArticlesData.filter(art => {
      const matchesCategory = currentCategory === 'all' || art.tag.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch = !currentSearchQuery || 
        art.title.toLowerCase().includes(currentSearchQuery) ||
        art.excerpt.toLowerCase().includes(currentSearchQuery) ||
        art.author.toLowerCase().includes(currentSearchQuery) ||
        art.tag.toLowerCase().includes(currentSearchQuery);

      return matchesCategory && matchesSearch;
    });

    const countText = document.getElementById('catalog-count-text');
    if (countText) {
      countText.innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'essay' : 'essays'}`;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 0.8rem;">🔍</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.4rem;">No matching essays found</h3>
          <p>Try searching for broader keywords like <em>architecture</em>, <em>system</em>, or <em>proof</em>.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(art => {
      const isBookmarked = getBookmarks().some(b => b.id === art.id);
      return `
        <article class="article-card" data-id="${art.id}">
          <div class="card-image-box">
            <img src="${art.image}" alt="${art.title}" loading="lazy">
          </div>
          <div class="card-body">
            <div class="card-meta-top">
              <span class="card-tag" style="color: ${art.tagColor || 'var(--accent)'};">${art.tag}</span>
              <span class="card-date">${art.date}</span>
            </div>
            <h3 class="card-title">
              <a href="#" class="open-article-link" data-id="${art.id}">${art.title}</a>
            </h3>
            <p class="card-excerpt">${art.excerpt}</p>
            <div class="card-footer">
              <div class="card-author-group">
                <img src="${art.authorAvatar}" alt="${art.author}" class="card-author-avatar">
                <span class="card-author-name">${art.author}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="card-readtime">${art.readTime}</span>
                <button class="btn-bookmark-action ${isBookmarked ? 'saved' : ''}" data-id="${art.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}">
                  <span class="bm-icon">${isBookmarked ? '★' : '🔖'}</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachCardEventListeners();
  }
}

/* ==========================================================================
   5. ARTICLE READER MODAL (DISTRACTION-FREE READING VIEW)
   ========================================================================== */
function attachCardEventListeners() {
  const readLinks = document.querySelectorAll('.open-article-link');
  const bookmarkBtns = document.querySelectorAll('.btn-bookmark-action');

  readLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = link.getAttribute('data-id');
      openArticleModal(articleId);
    });
  });

  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const articleId = btn.getAttribute('data-id');
      toggleBookmark(articleId);
    });
  });
}

let currentModalArticleIndex = 0;

function openArticleModal(articleId) {
  const modal = document.getElementById('article-reader-modal');
  const modalContent = document.getElementById('modal-article-content');
  const tagBadge = document.getElementById('modal-article-tag');
  const bookmarkBtn = document.getElementById('modal-bookmark-btn');
  const shareBtn = document.getElementById('modal-share-btn');
  const prevBtn = document.getElementById('modal-prev-article');
  const nextBtn = document.getElementById('modal-next-article');
  const closeBtn = document.getElementById('article-modal-close');
  const backdrop = document.getElementById('article-modal-backdrop');

  if (!modal || !modalContent) return;

  const articleIndex = allArticlesData.findIndex(a => a.id === articleId);
  if (articleIndex === -1) return;

  currentModalArticleIndex = articleIndex;
  const article = allArticlesData[articleIndex];

  if (tagBadge) tagBadge.textContent = article.tag;

  // Render full article body
  const bodyHtml = (article.content && article.content.length > 0)
    ? article.content.join('\n')
    : `<p class="lead-paragraph"><span class="drop-cap">${article.title.charAt(0)}</span>${article.excerpt}</p><p>Full dispatch text formatted for static web systems and accessible reading.</p>`;

  modalContent.innerHTML = `
    <h1>${article.title}</h1>
    <div class="article-modal-meta">
      <img src="${article.authorAvatar}" alt="${article.author}" style="width: 36px; height: 36px; border-radius: 50%;">
      <div>
        <strong>${article.author}</strong> &bull; ${article.authorRole || 'Editorial Staff'}
      </div>
      <div style="margin-left: auto;">
        ${article.date} &bull; ${article.readTime}
      </div>
    </div>
    <img src="${article.image}" alt="${article.title}" class="article-modal-image">
    <span class="image-caption">${article.caption || 'The Chronicle Photographic Archive / Open Access'}</span>
    <div class="article-text-body">
      ${bodyHtml}
    </div>
  `;

  // Attach copy code buttons inside modal
  const codeBlocks = modalContent.querySelectorAll('.code-snippet');
  codeBlocks.forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy Code';
    copyBtn.style.cssText = 'position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.15); border: none; color: #fff; padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; cursor: pointer;';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(block.innerText.trim()).then(() => {
        copyBtn.textContent = 'Copied!';
        showToast('Code snippet copied to clipboard', '📋');
        setTimeout(() => copyBtn.textContent = 'Copy Code', 2000);
      });
    });
    block.style.position = 'relative';
    block.appendChild(copyBtn);
  });

  // Update modal bookmark button state
  const isBookmarked = getBookmarks().some(b => b.id === article.id);
  if (bookmarkBtn) {
    bookmarkBtn.innerHTML = `<span>${isBookmarked ? '★' : '🔖'}</span>`;
    bookmarkBtn.onclick = () => {
      toggleBookmark(article.id);
      const nowSaved = getBookmarks().some(b => b.id === article.id);
      bookmarkBtn.innerHTML = `<span>${nowSaved ? '★' : '🔖'}</span>`;
    };
  }

  // Share button
  if (shareBtn) {
    shareBtn.onclick = () => {
      const url = window.location.href.split('#')[0] + `#article=${article.id}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Article permalink copied to clipboard', '🔗');
      }).catch(() => {
        showToast('Share link: ' + url, '🔗');
      });
    };
  }

  // Next / Prev Navigation
  if (prevBtn) {
    prevBtn.style.visibility = articleIndex > 0 ? 'visible' : 'hidden';
    prevBtn.onclick = () => {
      if (currentModalArticleIndex > 0) {
        openArticleModal(allArticlesData[currentModalArticleIndex - 1].id);
      }
    };
  }

  if (nextBtn) {
    nextBtn.style.visibility = articleIndex < allArticlesData.length - 1 ? 'visible' : 'hidden';
    nextBtn.onclick = () => {
      if (currentModalArticleIndex < allArticlesData.length - 1) {
        openArticleModal(allArticlesData[currentModalArticleIndex + 1].id);
      }
    };
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Close handlers
  if (closeBtn) closeBtn.onclick = closeArticleModal;
  if (backdrop) backdrop.onclick = closeArticleModal;
}

function closeArticleModal() {
  const modal = document.getElementById('article-reader-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   6. BOOKMARKS / READING LIST TRAY (LOCALSTORAGE)
   ========================================================================== */
function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('chronicle_bookmarks') || '[]');
  } catch {
    return [];
  }
}

function setBookmarks(bookmarks) {
  localStorage.setItem('chronicle_bookmarks', JSON.stringify(bookmarks));
  updateBookmarksBadge();
  renderBookmarksDrawer();
}

function toggleBookmark(articleId) {
  const article = allArticlesData.find(a => a.id === articleId);
  if (!article) return;

  let bookmarks = getBookmarks();
  const exists = bookmarks.some(b => b.id === articleId);

  if (exists) {
    bookmarks = bookmarks.filter(b => b.id !== articleId);
    setBookmarks(bookmarks);
    showToast(`Removed "${article.title.substring(0, 30)}..." from saved list`, '🗑️');
  } else {
    bookmarks.push({
      id: article.id,
      title: article.title,
      author: article.author,
      readTime: article.readTime,
      tag: article.tag
    });
    setBookmarks(bookmarks);
    showToast(`Saved "${article.title.substring(0, 30)}..." to reading list`, '🔖');
  }

  // Update all card bookmark icons in DOM
  document.querySelectorAll(`.btn-bookmark-action[data-id="${articleId}"]`).forEach(btn => {
    btn.classList.toggle('saved', !exists);
    btn.innerHTML = `<span class="bm-icon">${!exists ? '★' : '🔖'}</span>`;
  });
}

function updateBookmarksBadge() {
  const badge = document.getElementById('bookmark-count-badge');
  const count = getBookmarks().length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

function initBookmarksDrawer() {
  const drawer = document.getElementById('bookmarks-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const openBtn = document.getElementById('bookmarks-tray-btn');
  const closeBtn = document.getElementById('bookmarks-close-btn');
  const clearBtn = document.getElementById('clear-all-bookmarks-btn');

  if (!drawer || !openBtn) return;

  function openDrawer() {
    renderBookmarksDrawer();
    drawer.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
  }

  function closeDrawer() {
    drawer.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      setBookmarks([]);
      showToast('Reading list cleared', '🧹');
      // Reset card icons
      document.querySelectorAll('.btn-bookmark-action').forEach(btn => {
        btn.classList.remove('saved');
        btn.innerHTML = '<span class="bm-icon">🔖</span>';
      });
    });
  }

  updateBookmarksBadge();
}

function renderBookmarksDrawer() {
  const container = document.getElementById('bookmarks-body');
  if (!container) return;

  const bookmarks = getBookmarks();
  if (bookmarks.length === 0) {
    container.innerHTML = `
      <div class="empty-bookmarks">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📖</div>
        <p style="font-weight: 700; color: var(--text-main);">Your reading list is empty</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Click the 🔖 bookmark icon on any essay to read it anytime.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = bookmarks.map(bm => `
    <div class="bookmark-item">
      <div class="bookmark-item-title" data-id="${bm.id}">${bm.title}</div>
      <div class="bookmark-item-meta">
        <span>${bm.author} &bull; ${bm.readTime}</span>
        <button class="btn-remove-bookmark" data-id="${bm.id}">Remove</button>
      </div>
    </div>
  `).join('');

  // Attach handlers in drawer
  container.querySelectorAll('.bookmark-item-title').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      document.getElementById('bookmarks-drawer').classList.add('hidden');
      const backdrop = document.getElementById('drawer-backdrop');
      if (backdrop) backdrop.classList.add('hidden');
      openArticleModal(id);
    });
  });

  container.querySelectorAll('.btn-remove-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleBookmark(id);
    });
  });
}

/* ==========================================================================
   7. NEWSLETTER SUBSCRIPTION FORMS
   ========================================================================== */
function initNewsletterForms() {
  const sidebarForm = document.getElementById('sidebar-newsletter-form');
  const sidebarStatus = document.getElementById('sidebar-sn-status');

  const mainForm = document.getElementById('main-newsletter-form');
  const mainSuccess = document.getElementById('main-newsletter-success');

  if (sidebarForm && sidebarStatus) {
    sidebarForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = sidebarForm.querySelector('input');
      if (input && input.value) {
        sidebarStatus.classList.remove('hidden');
        input.value = '';
        showToast('Subscribed to The Sunday Dispatch', '📬');
      }
    });
  }

  if (mainForm && mainSuccess) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('main-newsletter-email');
      if (input && input.value) {
        mainSuccess.classList.remove('hidden');
        input.value = '';
        showToast('Welcome to The Sunday Edition', '✨');
      }
    });
  }
}

/* ==========================================================================
   8. KEYBOARD SHORTCUTS (CTRL+K SEARCH, ESCAPE MODAL)
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape closes reader modal or bookmarks drawer
    if (e.key === 'Escape') {
      closeArticleModal();
      const drawer = document.getElementById('bookmarks-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      if (drawer) drawer.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
    }

    // Ctrl+K or Cmd+K focuses search box
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.getElementById('masthead-search-input');
      if (search) {
        search.focus();
        showToast('Search dispatches activated', '🔍');
      }
    }
  });
}

/* ==========================================================================
   9. FLOATING TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout;

function showToast(message, icon = '✓') {
  const toast = document.getElementById('chronicle-toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}
