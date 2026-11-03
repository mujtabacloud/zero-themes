/**
 * DocuCraft - Developer Technical Documentation Engine
 * World-class developer documentation experience. Pure ES6, zero runtime dependencies.
 *
 * Features:
 * - Real-time reading progress scrollbar
 * - Multi-endpoint interactive REST API playground (Swagger/Postman-grade)
 * - Interactive in-browser CLI terminal emulator
 * - Instant Ctrl+K spotlight search palette with fuzzy matching
 * - Heading hover deep-anchor link copier
 * - Multi-language code snippet tabs with memory persistence
 * - Client-side code syntax highlighter (Bash, TS/JS, JSON, Python, Go)
 * - Keyboard navigation shortcuts ([ Prev, ] Next, Ctrl+K)
 * - Accessible reader font scaling (A- / A+)
 * - Dark & light theme switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFontSizeControls();
  initReadingProgressBar();
  initKeyboardShortcuts();
  initDocsRouting();
  initSearchModal();
  initScrollSpy();
  initFeedbackWidget();
  initMobileDrawer();
  initPageActions();
});

/* ==========================================================================
   1. DARK / LIGHT MODE CONTROLLER
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('docucraft_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('docucraft_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next === 'dark' ? 'Developer Dark' : 'Editorial Light'} theme`, '🎨');
  });

  function updateThemeIcon(theme) {
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

/* ==========================================================================
   2. ACCESSIBLE FONT SCALE CONTROLLER
   ========================================================================== */
let currentScale = parseFloat(localStorage.getItem('docucraft_font_scale') || '1');

function initFontSizeControls() {
  const btnDec = document.getElementById('btn-font-dec');
  const btnInc = document.getElementById('btn-font-inc');

  if (currentScale !== 1) {
    document.documentElement.style.setProperty('--font-scale', currentScale);
  }

  if (btnDec) {
    btnDec.addEventListener('click', () => {
      if (currentScale > 0.85) {
        currentScale = Math.round((currentScale - 0.05) * 100) / 100;
        document.documentElement.style.setProperty('--font-scale', currentScale);
        localStorage.setItem('docucraft_font_scale', currentScale);
      }
    });
  }

  if (btnInc) {
    btnInc.addEventListener('click', () => {
      if (currentScale < 1.25) {
        currentScale = Math.round((currentScale + 0.05) * 100) / 100;
        document.documentElement.style.setProperty('--font-scale', currentScale);
        localStorage.setItem('docucraft_font_scale', currentScale);
      }
    });
  }
}

/* ==========================================================================
   3. READING PROGRESS SCROLLBAR
   ========================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
  }, { passive: true });
}

/* ==========================================================================
   4. KEYBOARD NAVIGATION SHORTCUTS
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing inside input / textarea
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key === '[') {
      // Previous chapter
      const prevBtn = document.getElementById('pager-prev');
      if (prevBtn && !prevBtn.classList.contains('hidden')) {
        prevBtn.click();
      }
    } else if (e.key === ']') {
      // Next chapter
      const nextBtn = document.getElementById('pager-next');
      if (nextBtn && !nextBtn.classList.contains('hidden')) {
        nextBtn.click();
      }
    } else if (e.key === 't' || e.key === 'T') {
      // Focus table of contents
      const firstToc = document.querySelector('.toc-link');
      if (firstToc) firstToc.focus();
    }
  });
}

/* ==========================================================================
   5. EMBEDDED DOCUMENTATION REPOSITORY & CLIENT-SIDE ROUTER
   ========================================================================== */
let allDocsData = [];
const fallbackDocs = [
  {
    "id": "quickstart",
    "category": "Getting Started",
    "title": "Quickstart & Architecture",
    "slug": "quickstart",
    "readTime": "3 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Bootstrap a high-performance documentation handbook in less than 3 minutes. Zero build configuration required.",
    "toc": [
      {
        "id": "overview",
        "title": "Architecture Overview",
        "level": 2
      },
      {
        "id": "prerequisites",
        "title": "System Prerequisites",
        "level": 2
      },
      {
        "id": "step-1-cli",
        "title": "Step 1: Install DocuCraft CLI",
        "level": 2
      },
      {
        "id": "step-2-scaffold",
        "title": "Step 2: Scaffold Your Handbook",
        "level": 2
      },
      {
        "id": "step-3-dev",
        "title": "Step 3: Start Local Hot-Reload Server",
        "level": 2
      },
      {
        "id": "project-structure",
        "title": "Standard Directory Tree",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft is an opinionated, static-first documentation engine engineered for developer happiness, sub-50ms cold loads, and 100% Lighthouse audit scores. Built with zero runtime dependencies.\n      </div>\n\n      <div class=\"callout callout-info\">\n        <div class=\"callout-icon\">ℹ️</div>\n        <div class=\"callout-body\">\n          <strong>Production Ready:</strong> DocuCraft produces pure semantic HTML5, modern CSS, and lightweight ES6. It deploys out-of-the-box to GitHub Pages, Cloudflare Pages, Netlify, or Vercel with zero server costs.\n        </div>\n      </div>\n\n      <h2 id=\"overview\">Architecture Overview</h2>\n      <p>Traditional documentation tools often bundle megabytes of client-side JavaScript, hydration overhead, and bloated Webpack runtimes. DocuCraft flips this paradigm:</p>\n      <ul>\n        <li><strong>Static AST Generation:</strong> Markdown and MDX are compiled ahead-of-time into optimized semantic DOM nodes.</li>\n        <li><strong>Zero Hydration Tax:</strong> Navigation, table of contents, and search run entirely in pure vanilla ES6 (less than 12KB gzip).</li>\n        <li><strong>Client-Side Full Text Indexing:</strong> In-memory prefix trie algorithm delivers instant search results without Algolia credentials.</li>\n        <li><strong>Accessible by Default:</strong> WCAG 2.1 AA compliant, screen-reader friendly code blocks, keyboard navigable (<code>Tab</code>, <code>Ctrl+K</code>).</li>\n      </ul>\n\n      <h2 id=\"prerequisites\">System Prerequisites</h2>\n      <p>Before installing the CLI, ensure your environment meets the minimum version constraints:</p>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Runtime / Tool</th>\n              <th>Supported Versions</th>\n              <th>Recommended</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>Node.js</code></td>\n              <td>>= 18.16.0 LTS</td>\n              <td>Node.js 20.x or 22.x LTS</td>\n            </tr>\n            <tr>\n              <td><code>pnpm</code> / <code>npm</code></td>\n              <td>pnpm >= 8.0, npm >= 9.0</td>\n              <td><code>pnpm</code> for instant caching</td>\n            </tr>\n            <tr>\n              <td><code>Git</code></td>\n              <td>>= 2.34.0</td>\n              <td>Git 2.40+ with commit signing</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"step-1-cli\">Step 1: Install DocuCraft CLI</h2>\n      <p>Install the global CLI utility using your preferred package orchestrator:</p>\n\n      <div class=\"code-tabs\" data-group=\"package-manager\">\n        <div class=\"code-tabs-header\">\n          <button class=\"code-tab-btn active\" data-tab=\"pnpm\">pnpm</button>\n          <button class=\"code-tab-btn\" data-tab=\"npm\">npm</button>\n          <button class=\"code-tab-btn\" data-tab=\"yarn\">yarn</button>\n          <button class=\"code-tab-btn\" data-tab=\"curl\">cURL Shell</button>\n        </div>\n        <div class=\"code-tab-content active\" data-tab=\"pnpm\">\n          <pre><code class=\"language-bash\"># Global installation via pnpm\npnpm add -g @docucraft/cli\n\n# Verify version\ndocucraft --version\n# Output: docucraft/2.4.0 darwin-arm64 node-v20.11.0</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"npm\">\n          <pre><code class=\"language-bash\"># Global installation via npm\nnpm install -g @docucraft/cli\n\n# Verify version\ndocucraft --version</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"yarn\">\n          <pre><code class=\"language-bash\"># Global installation via yarn\nyarn global add @docucraft/cli\n\n# Verify version\ndocucraft --version</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"curl\">\n          <pre><code class=\"language-bash\"># Direct standalone binary installation for Linux / macOS\ncurl -fsSL https://get.docucraft.dev/install.sh | bash</code></pre>\n        </div>\n      </div>\n\n      <h2 id=\"step-2-scaffold\">Step 2: Scaffold Your Handbook</h2>\n      <p>Run the interactive initializer to generate a standard documentation repository with TypeScript configuration and sample guides:</p>\n\n      <pre><code class=\"language-bash\">docucraft init my-developer-portal --template standard\n\n# Navigate into project directory\ncd my-developer-portal</code></pre>\n\n      <div class=\"callout callout-tip\">\n        <div class=\"callout-icon\">💡</div>\n        <div class=\"callout-body\">\n          <strong>Interactive Prompts:</strong> The initializer will ask for your Project Title, Base URL (e.g. <code>https://docs.mycompany.com</code>), GitHub Repository URL, and primary theme accent color.\n        </div>\n      </div>\n\n      <h2 id=\"step-3-dev\">Step 3: Start Local Hot-Reload Server</h2>\n      <p>Launch the built-in development web server with instant Markdown hot-module reloading:</p>\n\n      <pre><code class=\"language-bash\">docucraft dev --port 4000 --open</code></pre>\n      <p>Your documentation handbook is now live at <code>http://localhost:4000</code>. Edits to any Markdown file in <code>./docs</code> reflect in under 40 milliseconds.</p>\n\n      <h2 id=\"project-structure\">Standard Directory Tree</h2>\n      <p>A typical DocuCraft handbook adheres to this clean filesystem hierarchy:</p>\n\n      <pre><code class=\"language-plaintext\">my-developer-portal/\n├── docs/                      # Markdown and MDX content sources\n│   ├── 01-getting-started/\n│   │   ├── index.md           # /docs/getting-started/\n│   │   └── quickstart.md      # /docs/getting-started/quickstart\n│   ├── 02-api-reference/\n│   │   ├── authentication.md  # /docs/api-reference/authentication\n│   │   └── endpoints.md       # /docs/api-reference/endpoints\n│   └── 03-deployment/\n│       └── github-pages.md    # /docs/deployment/github-pages\n├── assets/                    # Static images, diagrams, custom SVGs\n│   └── architecture-diagram.svg\n├── docucraft.config.ts        # Primary configuration manifest\n├── package.json               # Scripts & dependencies\n└── tsconfig.json              # Optional TypeScript typings</code></pre>\n    "
  },
  {
    "id": "installation",
    "category": "Getting Started",
    "title": "Installation & Environments",
    "slug": "installation",
    "readTime": "4 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Detailed installation instructions for local development, CI/CD pipelines, containerized environments, and air-gapped setups.",
    "toc": [
      {
        "id": "package-managers",
        "title": "Package Manager Options",
        "level": 2
      },
      {
        "id": "docker-setup",
        "title": "Docker Containerized Setup",
        "level": 2
      },
      {
        "id": "ci-cd-pipelines",
        "title": "CI/CD Automated Verification",
        "level": 2
      },
      {
        "id": "airgapped-offline",
        "title": "Air-Gapped & Offline Bundles",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft is distributed as an npm package, a standalone compiled binary for macOS/Linux/Windows, and a minimal Docker container (under 24MB).\n      </div>\n\n      <h2 id=\"package-managers\">Package Manager Options</h2>\n      <p>You can add DocuCraft as a local dev-dependency directly into your project root so all team members use the exact pinned version:</p>\n\n      <pre><code class=\"language-bash\"># Add as pinned project development dependency\npnpm add -D @docucraft/cli@^2.4.0\n\n# Add build scripts to package.json\nnpm pkg set scripts.docs:dev=\"docucraft dev\"\nnpm pkg set scripts.docs:build=\"docucraft build\"\nnpm pkg set scripts.docs:serve=\"docucraft serve --dist ./dist\"</code></pre>\n\n      <h2 id=\"docker-setup\">Docker Containerized Setup</h2>\n      <p>For organizations requiring strict container sandboxing or air-gapped CI workers, pull the official Alpine-based container:</p>\n\n      <pre><code class=\"language-bash\"># Pull the lightweight Alpine image\ndocker pull ghcr.io/docucraft/docucraft:2.4.0-alpine\n\n# Run local documentation server mounting your ./docs folder\ndocker run --rm -it \\\n  -p 4000:4000 \\\n  -v $(pwd)/docs:/app/docs \\\n  -v $(pwd)/docucraft.config.ts:/app/docucraft.config.ts \\\n  ghcr.io/docucraft/docucraft:2.4.0-alpine dev</code></pre>\n\n      <h2 id=\"ci-cd-pipelines\">CI/CD Automated Verification</h2>\n      <p>Validate broken links, invalid code blocks, and missing image references automatically inside your GitHub Actions pipeline:</p>\n\n      <pre><code class=\"language-yaml\"># .github/workflows/docs-validation.yml\nname: Documentation Lint & Build\n\non:\n  pull_request:\n    paths:\n      - 'docs/**'\n      - 'docucraft.config.ts'\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v3\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'pnpm'\n\n      - name: Install Dependencies\n        run: pnpm install --frozen-lockfile\n\n      - name: Lint Markdown & Dead Links\n        run: pnpm docucraft check --strict\n\n      - name: Compile Static Distribution\n        run: pnpm docucraft build</code></pre>\n\n      <h2 id=\"airgapped-offline\">Air-Gapped & Offline Bundles</h2>\n      <p>If operating inside high-security networks with zero external WAN connectivity, download the standalone archive containing all bundled font assets, search indexing routines, and icon sets without remote CDN calls:</p>\n\n      <pre><code class=\"language-bash\"># Download offline bundle archive\ncurl -O https://releases.docucraft.dev/v2.4.0/docucraft-offline-v2.4.0.tar.gz\n\n# Extract and run\ntar -xzf docucraft-offline-v2.4.0.tar.gz\n./docucraft/bin/docucraft serve --offline</code></pre>\n    "
  },
  {
    "id": "cli-reference",
    "category": "Core Concepts",
    "title": "CLI Toolchain Reference",
    "slug": "cli-reference",
    "readTime": "5 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Master the complete DocuCraft command line interface. Includes an interactive simulated terminal sandbox.",
    "toc": [
      {
        "id": "cli-overview",
        "title": "CLI Overview & Global Flags",
        "level": 2
      },
      {
        "id": "command-matrix",
        "title": "Complete Command Matrix",
        "level": 2
      },
      {
        "id": "interactive-terminal",
        "title": "Interactive Terminal Simulator",
        "level": 2
      },
      {
        "id": "exit-codes",
        "title": "Standard Exit Codes",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        The DocuCraft CLI is a lightning-fast Rust-powered binary wrapped in a native Node.js bridge. It handles local hot-reload dev servers, link verification, AST compilation, and edge deployments.\n      </div>\n\n      <h2 id=\"cli-overview\">CLI Overview & Global Flags</h2>\n      <p>All DocuCraft subcommands inherit these universal execution flags:</p>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Flag</th>\n              <th>Type</th>\n              <th>Description</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>--config &lt;path&gt;</code></td>\n              <td>String</td>\n              <td>Explicit path to custom configuration file. Defaults to <code>./docucraft.config.ts</code>.</td>\n            </tr>\n            <tr>\n              <td><code>--verbose</code></td>\n              <td>Boolean</td>\n              <td>Print detailed internal compilation stages and AST timing breakdown.</td>\n            </tr>\n            <tr>\n              <td><code>--json</code></td>\n              <td>Boolean</td>\n              <td>Output machine-parseable JSON stdout for CI/CD automation pipelines.</td>\n            </tr>\n            <tr>\n              <td><code>--quiet</code></td>\n              <td>Boolean</td>\n              <td>Suppress non-critical log messages and ascii art banners.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"command-matrix\">Complete Command Matrix</h2>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Command</th>\n              <th>Arguments</th>\n              <th>Purpose & Example</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>docucraft init</code></td>\n              <td><code>[name] [--template]</code></td>\n              <td>Scaffolds a new handbook repository. Example: <code>docucraft init api-docs</code></td>\n            </tr>\n            <tr>\n              <td><code>docucraft dev</code></td>\n              <td><code>[--port] [--host] [--open]</code></td>\n              <td>Starts hot-module reloading local web server. Example: <code>docucraft dev -p 3000</code></td>\n            </tr>\n            <tr>\n              <td><code>docucraft build</code></td>\n              <td><code>[--outDir] [--clean]</code></td>\n              <td>Compiles static distribution to <code>./dist</code>. Zero JS runtime mode.</td>\n            </tr>\n            <tr>\n              <td><code>docucraft check</code></td>\n              <td><code>[--links] [--strict]</code></td>\n              <td>Audits documentation for 404 dead links, unclosed tags, and orphan images.</td>\n            </tr>\n            <tr>\n              <td><code>docucraft deploy</code></td>\n              <td><code>[--prod] [--token]</code></td>\n              <td>Pushes compiled release to DocuCraft Edge Network or GitHub Pages.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"interactive-terminal\">Interactive Terminal Simulator</h2>\n      <p>Test CLI commands directly in your browser without leaving this chapter. Click any quick command button below or type directly into the terminal prompt:</p>\n\n      <!-- INTERACTIVE TERMINAL WIDGET -->\n      <div class=\"cli-terminal-widget\" id=\"cli-terminal-widget\">\n        <div class=\"terminal-header\">\n          <div class=\"terminal-dots\">\n            <span class=\"dot red\"></span>\n            <span class=\"dot yellow\"></span>\n            <span class=\"dot green\"></span>\n          </div>\n          <span class=\"terminal-title\">docucraft-cli — zsh — 80x24</span>\n          <button id=\"btn-term-clear\" class=\"btn-term-clear\">Clear</button>\n        </div>\n\n        <div class=\"terminal-quick-pills\">\n          <button class=\"term-pill\" data-cmd=\"docucraft --version\">docucraft --version</button>\n          <button class=\"term-pill\" data-cmd=\"docucraft check --links\">docucraft check --links</button>\n          <button class=\"term-pill\" data-cmd=\"docucraft build --prod\">docucraft build --prod</button>\n          <button class=\"term-pill\" data-cmd=\"docucraft deploy\">docucraft deploy</button>\n          <button class=\"term-pill\" data-cmd=\"help\">help</button>\n        </div>\n\n        <div class=\"terminal-output\" id=\"terminal-output\">\n          <div class=\"term-line welcome\"><span class=\"term-accent\">DocuCraft CLI v2.4.0</span> (x86_64-apple-darwin)</div>\n          <div class=\"term-line text-muted\">Type 'help' or click any command pill above to simulate execution.</div>\n        </div>\n\n        <form class=\"terminal-input-row\" id=\"terminal-form\" onsubmit=\"return false;\">\n          <span class=\"term-prompt\">user@devbox:~/handbook $</span>\n          <input type=\"text\" id=\"terminal-input\" placeholder=\"Type command here...\" autocomplete=\"off\">\n        </form>\n      </div>\n\n      <h2 id=\"exit-codes\">Standard Exit Codes</h2>\n      <p>For shell scripting and GitHub Actions error trapping, DocuCraft uses predictable POSIX exit codes:</p>\n      <ul>\n        <li><code>0</code>: Success (All documents validated and built successfully).</li>\n        <li><code>1</code>: General compilation error (syntax error in Markdown or TS config).</li>\n        <li><code>2</code>: Dead link detected under <code>--strict</code> mode.</li>\n        <li><code>130</code>: Script terminated by user (<code>SIGINT / Ctrl+C</code>).</li>\n      </ul>\n    "
  },
  {
    "id": "configuration",
    "category": "Core Concepts",
    "title": "Configuration Reference",
    "slug": "configuration",
    "readTime": "5 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Exhaustive reference for docucraft.config.ts. Learn how to configure custom themes, navigation trees, analytics, and plugins.",
    "toc": [
      {
        "id": "config-overview",
        "title": "Configuration Overview",
        "level": 2
      },
      {
        "id": "full-example",
        "title": "Annotated docucraft.config.ts",
        "level": 2
      },
      {
        "id": "theme-customization",
        "title": "Design Tokens & Brand Colors",
        "level": 2
      },
      {
        "id": "custom-plugins",
        "title": "Markdown Plugins (KaTeX, Mermaid)",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft utilizes a strongly typed TypeScript or JSON configuration file located at your repository root. Full IDE auto-completion is provided via JSDoc and TypeScript definitions.\n      </div>\n\n      <h2 id=\"config-overview\">Configuration Overview</h2>\n      <p>The configuration file orchestrates your handbook's global metadata, navbar items, sidebar hierarchies, search algorithms, and custom code theme palettes.</p>\n\n      <h2 id=\"full-example\">Annotated docucraft.config.ts</h2>\n      <p>Here is an enterprise-grade configuration exhibiting all core capabilities:</p>\n\n      <pre><code class=\"language-typescript\">import { defineConfig } from '@docucraft/types';\n\nexport default defineConfig({\n  // Global Project Identity\n  title: 'DocuCraft Developer Handbook',\n  tagline: 'High-velocity technical documentation engine for software teams',\n  baseUrl: 'https://docs.docucraft.dev',\n  favicon: '/assets/favicon.svg',\n\n  // Version Control & SCM\n  scm: {\n    provider: 'github',\n    repo: 'mujtabacloud/docucraft-documentation-theme',\n    branch: 'main',\n    docsDir: 'docs',\n    showEditLink: true,\n    editLinkText: 'Suggest an edit on GitHub'\n  },\n\n  // Navigation Bar Top Links\n  navbar: {\n    logo: {\n      text: 'DocuCraft',\n      version: 'v2.4.0',\n      badge: 'STABLE'\n    },\n    items: [\n      { text: 'Handbook', link: '/docs/quickstart', activeMatch: '^/docs/' },\n      { text: 'API Specs', link: '/docs/api-reference' },\n      { text: 'Changelog', link: 'https://github.com/mujtabacloud/docucraft/releases' },\n      {\n        text: 'Versions',\n        items: [\n          { text: 'v2.4.0 (Latest)', link: '/docs/quickstart' },\n          { text: 'v2.3.1 (Maintenance)', link: '/v2.3/' },\n          { text: 'v1.9.0 (LTS)', link: '/v1.9/' }\n        ]\n      }\n    ]\n  },\n\n  // Design Tokens & Code Highlight Theme\n  themeConfig: {\n    accentColor: '#38bdf8', // Electric Cyan\n    fontFamilySans: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif',\n    fontFamilyMono: '\"SF Mono\", \"Fira Code\", monospace',\n    defaultTheme: 'dark', // 'dark' | 'light' | 'system'\n    codeHighlight: {\n      theme: 'github-dark-dimmed',\n      showLineNumbers: true,\n      copyButton: true\n    }\n  },\n\n  // Search Engine Configuration\n  search: {\n    provider: 'local', // 'local' (In-memory trie) | 'algolia'\n    maxResults: 8,\n    keyboardShortcut: 'ctrl+k'\n  }\n});</code></pre>\n\n      <h2 id=\"theme-customization\">Design Tokens & Brand Colors</h2>\n      <p>DocuCraft allows CSS variable overrides directly via your custom stylesheet <code>custom.css</code> without having to rebuild dependencies:</p>\n\n      <pre><code class=\"language-css\">/* custom.css */\n:root {\n  --doc-accent: #0284c7;             /* Primary Brand Color */\n  --doc-accent-glow: rgba(2, 132, 199, 0.25);\n  --doc-bg-main: #090d16;            /* Deep navy dark mode */\n  --doc-code-bg: #040711;            /* Terminal editor contrast */\n  --doc-border: rgba(148, 163, 184, 0.14);\n}</code></pre>\n\n      <h2 id=\"custom-plugins\">Markdown Plugins (KaTeX, Mermaid)</h2>\n      <p>Render mathematical formulas with KaTeX or architectural sequence diagrams with Mermaid simply by enabling them in <code>markdownPlugins</code>:</p>\n\n      <div class=\"callout callout-warning\">\n        <div class=\"callout-icon\">⚠️</div>\n        <div class=\"callout-body\">\n          <strong>SSR Pre-rendering:</strong> All Mermaid diagrams and KaTeX LaTeX formulas are pre-compiled during <code>docucraft build</code>. Zero heavy browser parsing scripts are downloaded by your users.\n        </div>\n      </div>\n    "
  },
  {
    "id": "authentication",
    "category": "API Reference",
    "title": "Authentication & API Keys",
    "slug": "authentication",
    "readTime": "4 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Authenticate requests using Bearer tokens, workspace API keys, and cryptographically verified HMAC signatures.",
    "toc": [
      {
        "id": "bearer-tokens",
        "title": "Bearer Token Authorization",
        "level": 2
      },
      {
        "id": "api-key-generation",
        "title": "Generating Scoped API Keys",
        "level": 2
      },
      {
        "id": "hmac-signatures",
        "title": "HMAC-SHA256 Signature Header",
        "level": 2
      },
      {
        "id": "rate-limiting",
        "title": "Rate Limit Specifications",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        Every request to the DocuCraft Cloud API must be authenticated over HTTPS. Unauthenticated requests return a standard <code>401 Unauthorized</code> JSON payload.\n      </div>\n\n      <h2 id=\"bearer-tokens\">Bearer Token Authorization</h2>\n      <p>Include your personal access token or service account key in the HTTP <code>Authorization</code> header prefixed with <code>Bearer</code>:</p>\n\n      <div class=\"code-tabs\" data-group=\"auth-lang\">\n        <div class=\"code-tabs-header\">\n          <button class=\"code-tab-btn active\" data-tab=\"curl\">cURL</button>\n          <button class=\"code-tab-btn\" data-tab=\"node\">Node.js (Fetch)</button>\n          <button class=\"code-tab-btn\" data-tab=\"python\">Python (Requests)</button>\n          <button class=\"code-tab-btn\" data-tab=\"go\">Go (net/http)</button>\n        </div>\n        <div class=\"code-tab-content active\" data-tab=\"curl\">\n          <pre><code class=\"language-bash\">curl -X GET \"https://api.docucraft.dev/v1/workspaces\" \\\n  -H \"Authorization: Bearer dc_live_98a7f1e6b0294e1d\" \\\n  -H \"Accept: application/json\"</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"node\">\n          <pre><code class=\"language-typescript\">import { DocuCraftClient } from '@docucraft/sdk';\n\nconst client = new DocuCraftClient({\n  apiKey: process.env.DOCUCRAFT_API_KEY! // 'dc_live_...'\n});\n\nconst workspaces = await client.workspaces.list();\nconsole.log(workspaces);</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"python\">\n          <pre><code class=\"language-python\">import os\nimport requests\n\napi_key = os.environ.get(\"DOCUCRAFT_API_KEY\")\n\nresponse = requests.get(\n    \"https://api.docucraft.dev/v1/workspaces\",\n    headers={\"Authorization\": f\"Bearer {api_key}\"}\n)\n\nprint(response.json())</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"go\">\n          <pre><code class=\"language-go\">package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"os\"\n)\n\nfunc main() {\n\treq, _ := http.NewRequest(\"GET\", \"https://api.docucraft.dev/v1/workspaces\", nil)\n\treq.Header.Set(\"Authorization\", \"Bearer \"+os.Getenv(\"DOCUCRAFT_API_KEY\"))\n\t\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tfmt.Println(\"Status:\", resp.Status)\n}</code></pre>\n        </div>\n      </div>\n\n      <h2 id=\"api-key-generation\">Generating Scoped API Keys</h2>\n      <p>DocuCraft supports granular Principle-of-Least-Privilege (PoLP) scopes. You can generate keys restricted solely to read operations or build triggers:</p>\n\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Scope Identifier</th>\n              <th>Permitted Actions</th>\n              <th>Risk Level</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>docs:read</code></td>\n              <td>Query public and private handbook schemas</td>\n              <td>Low</td>\n            </tr>\n            <tr>\n              <td><code>docs:write</code></td>\n              <td>Push markdown commits and deploy revisions</td>\n              <td>Medium</td>\n            </tr>\n            <tr>\n              <td><code>admin:all</code></td>\n              <td>Workspace member management and billing access</td>\n              <td>High</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"hmac-signatures\">HMAC-SHA256 Signature Header</h2>\n      <p>For webhook consumers and enterprise SSO callbacks, all event payloads are signed using your workspace webhook secret key via HMAC-SHA256:</p>\n\n      <pre><code class=\"language-typescript\">// Verify inbound webhook signature in Node.js\nimport crypto from 'node:crypto';\n\nexport function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {\n  const hmac = crypto.createHmac('sha256', secret);\n  const digest = 'sha256=' + hmac.update(payload).digest('hex');\n  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));\n}</code></pre>\n\n      <h2 id=\"rate-limiting\">Rate Limit Specifications</h2>\n      <p>API requests are throttled per API key according to your workspace tier:</p>\n      <ul>\n        <li><strong>Open Source Tier:</strong> 1,200 requests / minute</li>\n        <li><strong>Enterprise Tier:</strong> 25,000 requests / minute</li>\n      </ul>\n      <p>When throttled, the API returns HTTP <code>429 Too Many Requests</code> with standard RFC 6585 headers:</p>\n      <pre><code class=\"language-http\">HTTP/1.1 429 Too Many Requests\nX-RateLimit-Limit: 1200\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1730678400\nRetry-After: 42</code></pre>\n    "
  },
  {
    "id": "api-reference",
    "category": "API Reference",
    "title": "REST API Reference",
    "slug": "api-reference",
    "readTime": "6 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Multi-endpoint interactive REST API console. Test deployments, check build status, and inspect releases in real time.",
    "toc": [
      {
        "id": "endpoints-overview",
        "title": "Endpoints Directory",
        "level": 2
      },
      {
        "id": "interactive-console",
        "title": "Interactive Multi-Endpoint Console",
        "level": 2
      },
      {
        "id": "parameters",
        "title": "Request Body & Query Parameters",
        "level": 2
      },
      {
        "id": "response-schema",
        "title": "Response Schema Specification",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        The DocuCraft REST API allows programmatic control over documentation deployments, branch rollbacks, webhook subscriptions, and build metrics.\n      </div>\n\n      <h2 id=\"endpoints-overview\">Endpoints Directory</h2>\n      <div class=\"endpoint-pills-row\" id=\"endpoint-pills-row\">\n        <button class=\"endpoint-selector-btn active\" data-endpoint=\"post-deploy\">\n          <span class=\"http-badge post\">POST</span> <code>/v1/deployments</code>\n        </button>\n        <button class=\"endpoint-selector-btn\" data-endpoint=\"get-deploys\">\n          <span class=\"http-badge get\">GET</span> <code>/v1/deployments</code>\n        </button>\n        <button class=\"endpoint-selector-btn\" data-endpoint=\"get-status\">\n          <span class=\"http-badge get\">GET</span> <code>/v1/deployments/:id</code>\n        </button>\n        <button class=\"endpoint-selector-btn\" data-endpoint=\"del-rollback\">\n          <span class=\"http-badge del\">DELETE</span> <code>/v1/deployments/:id</code>\n        </button>\n      </div>\n\n      <h2 id=\"interactive-console\">Interactive Multi-Endpoint Console</h2>\n      <p>Switch between endpoints using the tabs above. Tweak parameters and click <strong>Send Request</strong> to simulate an execution against the edge gateway:</p>\n\n      <!-- MULTI-ENDPOINT API TESTER WIDGET -->\n      <div class=\"api-tester-card\" id=\"api-tester-card\">\n        <div class=\"api-tester-header\">\n          <div class=\"api-method-select\">\n            <span id=\"api-method-badge\" class=\"http-badge post\">POST</span>\n            <input type=\"text\" id=\"api-test-url\" value=\"https://api.docucraft.dev/v1/deployments\" readonly>\n          </div>\n          <button id=\"btn-run-api-test\" class=\"btn-api-run\">\n            <span>⚡ Send Request</span>\n          </button>\n        </div>\n\n        <div class=\"api-tester-body\">\n          <div class=\"api-tester-col\" id=\"api-request-col\">\n            <span class=\"tester-label\">Request Payload (JSON):</span>\n            <textarea id=\"api-test-payload\" class=\"tester-textarea\" rows=\"7\">{\n  \"environment\": \"production\",\n  \"commit_sha\": \"71ef3b6\",\n  \"branch\": \"main\",\n  \"auto_rollback\": true\n}</textarea>\n          </div>\n\n          <div class=\"api-tester-col\">\n            <div class=\"tester-status-row\">\n              <span class=\"tester-label\">Live Gateway Response:</span>\n              <span id=\"api-test-status\" class=\"status-pill idle\">Ready (Click Send)</span>\n            </div>\n            <pre class=\"tester-response-pre\"><code id=\"api-test-response\" class=\"language-json\">{\n  \"hint\": \"Click 'Send Request' to execute simulated deployment.\"\n}</code></pre>\n          </div>\n        </div>\n      </div>\n\n      <h2 id=\"parameters\">Request Body & Query Parameters</h2>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Field</th>\n              <th>Type</th>\n              <th>Required</th>\n              <th>Description</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>environment</code></td>\n              <td><code>string (enum)</code></td>\n              <td><span class=\"req-badge\">Required</span></td>\n              <td>Target distribution environment: <code>\"production\"</code> or <code>\"preview\"</code>.</td>\n            </tr>\n            <tr>\n              <td><code>commit_sha</code></td>\n              <td><code>string</code></td>\n              <td><span class=\"req-badge\">Required</span></td>\n              <td>Full 40-character or 7-character Git commit hash being built.</td>\n            </tr>\n            <tr>\n              <td><code>branch</code></td>\n              <td><code>string</code></td>\n              <td><span class=\"opt-badge\">Optional</span></td>\n              <td>Git branch name. Defaults to <code>\"main\"</code>.</td>\n            </tr>\n            <tr>\n              <td><code>auto_rollback</code></td>\n              <td><code>boolean</code></td>\n              <td><span class=\"opt-badge\">Optional</span></td>\n              <td>If <code>true</code>, reverts to previous release if health checks fail. Defaults to <code>true</code>.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"response-schema\">Response Schema Specification</h2>\n      <p>A successful deployment registration returns HTTP <code>201 Created</code> with the following JSON model:</p>\n\n      <pre><code class=\"language-json\">{\n  \"id\": \"dep_9b4c10e82f71\",\n  \"object\": \"deployment\",\n  \"status\": \"queued\",\n  \"environment\": \"production\",\n  \"commit_sha\": \"71ef3b6\",\n  \"branch\": \"main\",\n  \"build_latency\": \"38ms\",\n  \"urls\": {\n    \"live\": \"https://handbook.company.com\",\n    \"inspect\": \"https://app.docucraft.dev/deployments/dep_9b4c10e82f71\"\n  },\n  \"created_at\": \"2026-11-03T18:24:00Z\"\n}</code></pre>\n    "
  },
  {
    "id": "webhooks",
    "category": "API Reference",
    "title": "Webhooks & Event Handlers",
    "slug": "webhooks",
    "readTime": "5 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Subscribe to real-time asynchronous deployment and schema change notifications with automatic retry backoff.",
    "toc": [
      {
        "id": "event-types",
        "title": "Supported Event Manifest",
        "level": 2
      },
      {
        "id": "headers-schema",
        "title": "Inbound Webhook Headers",
        "level": 2
      },
      {
        "id": "verification-recipe",
        "title": "Signature Verification Recipe",
        "level": 2
      },
      {
        "id": "retry-policy",
        "title": "Exponential Retry Policy",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft webhooks deliver push notifications to your HTTP endpoints whenever an asynchronous event occurs, such as a deployment succeeding or a broken link being caught.\n      </div>\n\n      <h2 id=\"event-types\">Supported Event Manifest</h2>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Event Identifier</th>\n              <th>Trigger Condition</th>\n              <th>Sample Payload Entity</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>deployment.succeeded</code></td>\n              <td>Static AST built and deployed to CDN edge</td>\n              <td>Deployment Object with live URL and build latency</td>\n            </tr>\n            <tr>\n              <td><code>deployment.failed</code></td>\n              <td>Compile error, link failure, or AST syntax crash</td>\n              <td>Error Object with line number and commit SHA</td>\n            </tr>\n            <tr>\n              <td><code>schema.updated</code></td>\n              <td>API schema changed in OpenAPI manifest</td>\n              <td>Diff Object with added/removed endpoints</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"headers-schema\">Inbound Webhook Headers</h2>\n      <p>Each delivery POST request includes authentication and audit headers:</p>\n\n      <pre><code class=\"language-http\">POST /api/webhooks/docucraft HTTP/1.1\nHost: your-api.company.com\nContent-Type: application/json\nUser-Agent: DocuCraft-Hookshot/2.4.0\nX-DocuCraft-Event: deployment.succeeded\nX-DocuCraft-Delivery: deliv_789f2a014bc9\nX-DocuCraft-Signature: sha256=5d8c36b94328d19f...\nX-DocuCraft-Timestamp: 1730680000</code></pre>\n\n      <h2 id=\"verification-recipe\">Signature Verification Recipe</h2>\n      <p>Always verify the HMAC-SHA256 signature before processing events in production:</p>\n\n      <div class=\"code-tabs\" data-group=\"webhook-verify\">\n        <div class=\"code-tabs-header\">\n          <button class=\"code-tab-btn active\" data-tab=\"node\">Node.js Express</button>\n          <button class=\"code-tab-btn\" data-tab=\"python\">Python FastAPI</button>\n        </div>\n        <div class=\"code-tab-content active\" data-tab=\"node\">\n          <pre><code class=\"language-typescript\">import express from 'express';\nimport crypto from 'node:crypto';\n\nconst app = express();\n\napp.post('/api/webhooks', express.raw({ type: 'application/json' }), (req, res) => {\n  const signature = req.headers['x-docucraft-signature'] as string;\n  const secret = process.env.DOCUCRAFT_WEBHOOK_SECRET!;\n\n  const expected = 'sha256=' + crypto\n    .createHmac('sha256', secret)\n    .update(req.body)\n    .digest('hex');\n\n  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {\n    return res.status(401).send('Invalid signature');\n  }\n\n  const event = JSON.parse(req.body.toString());\n  console.log('Received event:', event.type);\n  res.status(200).json({ received: true });\n});</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"python\">\n          <pre><code class=\"language-python\">from fastapi import FastAPI, Request, HTTPException\nimport hmac, hashlib, os\n\napp = FastAPI()\n\n@app.post(\"/api/webhooks\")\nasync def handle_webhook(request: Request):\n    payload = await request.body()\n    signature = request.headers.get(\"x-docucraft-signature\", \"\")\n    secret = os.getenv(\"DOCUCRAFT_WEBHOOK_SECRET\", \"\").encode()\n\n    expected = \"sha256=\" + hmac.new(secret, payload, hashlib.sha256).hexdigest()\n    if not hmac.compare_digest(signature, expected):\n        raise HTTPException(status_code=401, detail=\"Invalid HMAC signature\")\n\n    return {\"status\": \"accepted\"}</code></pre>\n        </div>\n      </div>\n\n      <h2 id=\"retry-policy\">Exponential Retry Policy</h2>\n      <p>If your webhook receiver returns any status other than HTTP <code>2xx</code> (or times out after 10 seconds), DocuCraft automatically retries with exponential backoff:</p>\n      <ul>\n        <li><strong>Attempt 1:</strong> Immediate (0s)</li>\n        <li><strong>Attempt 2:</strong> 15 seconds</li>\n        <li><strong>Attempt 3:</strong> 2 minutes</li>\n        <li><strong>Attempt 4:</strong> 15 minutes</li>\n        <li><strong>Attempt 5:</strong> 1 hour (Final attempt before notification email)</li>\n      </ul>\n    "
  },
  {
    "id": "deployments-hosting",
    "category": "Operations",
    "title": "Deployment & Cloud Providers",
    "slug": "deployments-hosting",
    "readTime": "4 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Deploy your handbook across GitHub Pages, Cloudflare Pages, Netlify, and Vercel with zero hosting costs.",
    "toc": [
      {
        "id": "github-pages",
        "title": "GitHub Pages (1-Click Action)",
        "level": 2
      },
      {
        "id": "cloudflare-pages",
        "title": "Cloudflare Pages (Direct Git)",
        "level": 2
      },
      {
        "id": "vercel-netlify",
        "title": "Vercel & Netlify Configs",
        "level": 2
      },
      {
        "id": "custom-domain-ssl",
        "title": "Custom Domains & Edge SSL",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft outputs a pure static distribution directory (<code>dist/</code>). You can host your developer handbook completely free on any modern CDN or object storage bucket.\n      </div>\n\n      <h2 id=\"github-pages\">GitHub Pages (1-Click Action)</h2>\n      <p>The standard GitHub Pages deployment workflow automatically builds and publishes on every commit to <code>main</code>:</p>\n\n      <pre><code class=\"language-yaml\"># .github/workflows/deploy.yml\nname: Deploy Handbook to GitHub Pages\n\non:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n  pages: write\n  id-token: write\n\nconcurrency:\n  group: 'pages'\n  cancel-in-progress: true\n\njobs:\n  deploy:\n    environment:\n      name: github-pages\n      url: ${{ steps.deployment.outputs.page_url }}\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v3\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'pnpm'\n\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm docucraft build\n\n      - uses: actions/upload-pages-artifact@v3\n        with:\n          path: './dist'\n      - id: deployment\n        uses: actions/deploy-pages@v4</code></pre>\n\n      <h2 id=\"cloudflare-pages\">Cloudflare Pages (Direct Git)</h2>\n      <p>Connect your GitHub repository directly in the Cloudflare dashboard with these settings:</p>\n      <ul>\n        <li><strong>Framework Preset:</strong> None (Custom)</li>\n        <li><strong>Build Command:</strong> <code>pnpm docucraft build</code></li>\n        <li><strong>Build Output Directory:</strong> <code>dist</code></li>\n        <li><strong>Node Version Environment Variable:</strong> <code>NODE_VERSION = 20</code></li>\n      </ul>\n\n      <h2 id=\"vercel-netlify\">Vercel & Netlify Configs</h2>\n      <p>Include a minimal <code>vercel.json</code> or <code>netlify.toml</code> at repository root for zero-config deploys:</p>\n\n      <div class=\"code-tabs\" data-group=\"hosting-config\">\n        <div class=\"code-tabs-header\">\n          <button class=\"code-tab-btn active\" data-tab=\"vercel\">vercel.json</button>\n          <button class=\"code-tab-btn\" data-tab=\"netlify\">netlify.toml</button>\n        </div>\n        <div class=\"code-tab-content active\" data-tab=\"vercel\">\n          <pre><code class=\"language-json\">{\n  \"buildCommand\": \"pnpm docucraft build\",\n  \"outputDirectory\": \"dist\",\n  \"cleanUrls\": true\n}</code></pre>\n        </div>\n        <div class=\"code-tab-content\" data-tab=\"netlify\">\n          <pre><code class=\"language-toml\">[build]\n  command = \"pnpm docucraft build\"\n  publish = \"dist\"\n\n[[redirects]]\n  from = \"/*\"\n  to = \"/index.html\"\n  status = 200</code></pre>\n        </div>\n      </div>\n\n      <h2 id=\"custom-domain-ssl\">Custom Domains & Edge SSL</h2>\n      <p>When provisioning custom subdomains (e.g. <code>docs.yourcompany.com</code>), configure a CNAME record pointing to your host. TLS certificates are provisioned automatically via Let's Encrypt with 0 downtime.</p>\n    "
  },
  {
    "id": "troubleshooting",
    "category": "Operations",
    "title": "Troubleshooting & Error Index",
    "slug": "troubleshooting",
    "readTime": "4 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Resolutions for common compiler errors, broken hyperlinks, image rendering anomalies, and custom domain SSL issues.",
    "toc": [
      {
        "id": "error-code-index",
        "title": "Standard Error Code Index",
        "level": 2
      },
      {
        "id": "broken-links",
        "title": "Resolving Broken Internal Links",
        "level": 2
      },
      {
        "id": "memory-overflow",
        "title": "Large Monorepo Node Out-Of-Memory",
        "level": 2
      },
      {
        "id": "custom-domain",
        "title": "Custom Domain SSL & DNS CNAME",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        Encountering build warnings or hydration failures? Consult this systematic diagnostic guide engineered by the DocuCraft core maintainers.\n      </div>\n\n      <h2 id=\"error-code-index\">Standard Error Code Index</h2>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Error Code</th>\n              <th>Underlying Root Cause</th>\n              <th>Recommended Remediation</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>ERR_LINK_BROKEN</code></td>\n              <td>Relative Markdown hyperlink targets a missing <code>.md</code> file</td>\n              <td>Run <code>docucraft check --fix-links</code> to auto-correct path</td>\n            </tr>\n            <tr>\n              <td><code>ERR_CONFIG_INVALID</code></td>\n              <td>Syntax error or schema violation in <code>docucraft.config.ts</code></td>\n              <td>Validate schema with <code>docucraft config validate</code></td>\n            </tr>\n            <tr>\n              <td><code>ERR_AST_PARSE_FAIL</code></td>\n              <td>Unclosed HTML tag or malformed JSX inside Markdown</td>\n              <td>Check the line and column number reported in terminal output</td>\n            </tr>\n            <tr>\n              <td><code>ERR_AUTH_EXPIRED</code></td>\n              <td>API key or Bearer token has exceeded its TTL lifecycle</td>\n              <td>Generate a renewed API key in your workspace console</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"broken-links\">Resolving Broken Internal Links</h2>\n      <p>When reorganizing chapters or renaming files, references can become stale. The DocuCraft link verifier scans all anchors before building:</p>\n\n      <pre><code class=\"language-bash\"># Run link auditor in report mode\ndocucraft check --links\n\n# Automatically create redirects for renamed files\ndocucraft check --links --generate-redirects</code></pre>\n\n      <h2 id=\"memory-overflow\">Large Monorepo Node Out-Of-Memory</h2>\n      <p>If compiling documentation handbooks exceeding 5,000 pages within a massive monorepo, allocate additional heap memory to the Node.js V8 runtime:</p>\n\n      <pre><code class=\"language-bash\"># Set max old space size to 4GB\nNODE_OPTIONS=\"--max-old-space-size=4096\" docucraft build</code></pre>\n\n      <h2 id=\"custom-domain\">Custom Domain SSL & DNS CNAME</h2>\n      <p>When deploying to custom apex domains (e.g. <code>docs.yourcompany.com</code>) via GitHub Pages or Cloudflare, ensure your DNS provider points to the edge CDN:</p>\n\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Record Type</th>\n              <th>Host / Name</th>\n              <th>Target Value</th>\n              <th>TTL</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>CNAME</code></td>\n              <td><code>docs</code></td>\n              <td><code>mujtabacloud.github.io.</code></td>\n              <td>Automatic (300s)</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <div class=\"callout callout-tip\">\n        <div class=\"callout-icon\">💡</div>\n        <div class=\"callout-body\">\n          <strong>Still blocked?</strong> Open an issue on our official <a href=\"https://github.com/mujtabacloud/docucraft-documentation-theme/issues\" target=\"_blank\" rel=\"noopener\">GitHub Issues tracker</a> or connect with community engineers on Discord.\n        </div>\n      </div>\n    "
  }
];

let activeDocId = 'quickstart';

function initDocsRouting() {
  fetch('./assets/data/docs.json')
    .then(res => res.json())
    .then(data => {
      allDocsData = data;
      setupDocs();
    })
    .catch(() => {
      allDocsData = fallbackDocs;
      setupDocs();
    });

  function setupDocs() {
    renderSidebarNav();
    handleHashNavigation();

    window.addEventListener('hashchange', () => {
      handleHashNavigation();
    });
  }

  // Sidebar Filter Input
  const filterInput = document.getElementById('sidebar-filter');
  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}

function handleHashNavigation() {
  const rawHash = window.location.hash.replace('#', '').trim();
  // Check if hash matches a doc id or a sub-heading anchor
  const foundDoc = allDocsData.find(d => d.id === rawHash || d.slug === rawHash);
  if (foundDoc) {
    activeDocId = foundDoc.id;
    loadArticle(activeDocId);
  } else if (!rawHash) {
    activeDocId = allDocsData[0] ? allDocsData[0].id : 'quickstart';
    loadArticle(activeDocId);
  } else {
    // Might be deep anchor inside current doc
    const targetEl = document.getElementById(rawHash);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function renderSidebarNav() {
  const container = document.getElementById('sidebar-nav-container');
  if (!container) return;

  // Group docs by category
  const categories = {};
  allDocsData.forEach(doc => {
    const cat = doc.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(doc);
  });

  let html = '';
  Object.entries(categories).forEach(([categoryName, items]) => {
    html += `
      <div class="sidebar-group">
        <div class="sidebar-group-title">
          <span>${categoryName}</span>
          <span style="font-size: 0.65rem; opacity: 0.6;">${items.length}</span>
        </div>
        <ul class="sidebar-nav-list">
          ${items.map(doc => `
            <li class="sidebar-nav-item">
              <a href="#${doc.id}" class="sidebar-nav-link ${doc.id === activeDocId ? 'active' : ''}" data-doc="${doc.id}">
                <span>${doc.title}</span>
                ${doc.id === 'quickstart' ? '<span class="item-badge new">Quick</span>' : ''}
                ${doc.id === 'cli-reference' ? '<span class="item-badge api">CLI</span>' : ''}
                ${doc.id === 'api-reference' ? '<span class="item-badge api">REST</span>' : ''}
                ${doc.id === 'webhooks' ? '<span class="item-badge new">Events</span>' : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;

  // Close mobile sidebar upon clicking link
  container.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });
}

function loadArticle(docId) {
  const doc = allDocsData.find(d => d.id === docId) || allDocsData[0];
  if (!doc) return;

  // Update Sidebar active state
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-doc') === doc.id);
  });

  // Breadcrumbs
  const breadcrumbCategory = document.getElementById('breadcrumb-category');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  if (breadcrumbCategory) breadcrumbCategory.textContent = doc.category || 'Documentation';
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = doc.title;

  // Article Header
  const titleEl = document.getElementById('article-title');
  const readTimeEl = document.getElementById('article-read-time');
  const lastUpdatedEl = document.getElementById('article-last-updated');

  if (titleEl) titleEl.textContent = doc.title;
  if (readTimeEl) readTimeEl.textContent = doc.readTime || '4 min read';
  if (lastUpdatedEl) lastUpdatedEl.textContent = doc.lastUpdated || 'November 2026';

  // Article Body Content
  const contentEl = document.getElementById('article-content');
  if (contentEl) {
    contentEl.innerHTML = doc.content;
  }

  // Render Table of Contents
  renderTableOfContents(doc.toc || []);

  // Previous / Next Pagination
  renderArticlePagination(doc.id);

  // Re-bind interactive features
  initHeadingAnchors();
  initCodeSnippets();
  initCodeSyntaxHighlighting();
  initApiPlayground();
  initTerminalSimulator();

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTableOfContents(tocItems) {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  if (!tocItems || tocItems.length === 0) {
    tocList.innerHTML = '<li class="toc-item" style="color: var(--text-tertiary); font-size: 0.8rem;">No subsections</li>';
    return;
  }

  tocList.innerHTML = tocItems.map(item => `
    <li class="toc-item">
      <a href="#${item.id}" class="toc-link" data-target="${item.id}" style="${item.level === 3 ? 'padding-left: 1.2rem;' : ''}">
        ${item.title}
      </a>
    </li>
  `).join('');

  // Smooth scroll click handler
  tocList.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const offset = 120;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, null, `#${activeDocId}`);
      }
    });
  });

  // Re-initialize ScrollSpy
  initScrollSpy();
}

function renderArticlePagination(currentId) {
  const currentIdx = allDocsData.findIndex(d => d.id === currentId);
  const prevBtn = document.getElementById('pager-prev');
  const nextBtn = document.getElementById('pager-next');

  if (prevBtn) {
    if (currentIdx > 0) {
      const prev = allDocsData[currentIdx - 1];
      prevBtn.href = `#${prev.id}`;
      prevBtn.querySelector('.pager-title').textContent = prev.title;
      prevBtn.classList.remove('hidden');
    } else {
      prevBtn.classList.add('hidden');
    }
  }

  if (nextBtn) {
    if (currentIdx < allDocsData.length - 1) {
      const next = allDocsData[currentIdx + 1];
      nextBtn.href = `#${next.id}`;
      nextBtn.querySelector('.pager-title').textContent = next.title;
      nextBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.add('hidden');
    }
  }
}

/* ==========================================================================
   6. HEADING HOVER ANCHORS & DIRECT LINK COPIER
   ========================================================================== */
function initHeadingAnchors() {
  document.querySelectorAll('.article-content h2, .article-content h3').forEach(heading => {
    const id = heading.getAttribute('id');
    if (!id || heading.querySelector('.heading-anchor')) return;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${id}`;
    anchor.innerHTML = '#';
    anchor.title = 'Copy direct anchor link';

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const directUrl = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(directUrl).then(() => {
        showToast(`Direct link copied: #${id}`, '🔗');
      });
      history.replaceState(null, null, `#${id}`);
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    heading.appendChild(anchor);
  });
}

/* ==========================================================================
   7. SCROLLSPY TABLE OF CONTENTS TRACKER
   ========================================================================== */
let scrollSpyObserver = null;

function initScrollSpy() {
  if (scrollSpyObserver) {
    scrollSpyObserver.disconnect();
  }

  const headings = document.querySelectorAll('.article-content h2, .article-content h3');
  if (headings.length === 0) return;

  scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          document.querySelectorAll('.toc-link').forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-target') === id);
          });
        }
      }
    });
  }, {
    rootMargin: '-100px 0px -65% 0px',
    threshold: 0
  });

  headings.forEach(h => scrollSpyObserver.observe(h));
}

/* ==========================================================================
   8. CLIENT-SIDE SYNTAX TOKEN HIGHLIGHTER (LIGHTWEIGHT REGEX ENGINE)
   ========================================================================== */
function initCodeSyntaxHighlighting() {
  document.querySelectorAll('.article-content code[class*="language-"]').forEach(codeEl => {
    if (codeEl.getAttribute('data-highlighted')) return;

    let text = codeEl.innerHTML;
    // Comments
    text = text.replace(/(^|[^\])(#[^\n]*|\/\/[^\n]*)/g, '$1<span class="token-comment">$2</span>');

    // Strings
    text = text.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="token-string">$1</span>');

    // JSON Keys
    text = text.replace(/<span class="token-string">("(?:\\.|[^"\\])*")<\/span>(?=\s*:)/g, '<span class="token-key">$1</span>');

    // Keywords
    const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'async', 'await', 'class', 'type', 'interface', 'def', 'package', 'func', 'curl', 'pnpm', 'npm', 'yarn', 'docker', 'git'];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    text = text.replace(kwRegex, '<span class="token-keyword">$1</span>');

    // Numbers
    text = text.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token-number">$1</span>');

    codeEl.innerHTML = text;
    codeEl.setAttribute('data-highlighted', 'true');
  });
}

/* ==========================================================================
   9. INTERACTIVE MULTI-LANGUAGE CODE TABS & ONE-CLICK CLIPBOARD COPY
   ========================================================================== */
function initCodeSnippets() {
  // Inject copy buttons to all standalone pre blocks
  document.querySelectorAll('.article-content pre').forEach(pre => {
    if (pre.querySelector('.btn-copy-code')) return;
    const btn = document.createElement('button');
    btn.className = 'btn-copy-code';
    btn.textContent = 'Copy';
    btn.title = 'Copy code snippet to clipboard';
    btn.onclick = () => copyCodeToClipboard(pre, btn);
    pre.appendChild(btn);
  });

  // Multi-Language Tab Switchers
  document.querySelectorAll('.code-tabs').forEach(tabsBlock => {
    const buttons = tabsBlock.querySelectorAll('.code-tab-btn');
    const contents = tabsBlock.querySelectorAll('.code-tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        buttons.forEach(b => b.classList.toggle('active', b === btn));
        contents.forEach(c => c.classList.toggle('active', c.getAttribute('data-tab') === targetTab));

        // Save preferred language
        localStorage.setItem('docucraft_pref_lang', targetTab);
      });
    });

    // Check saved preference
    const pref = localStorage.getItem('docucraft_pref_lang');
    if (pref) {
      const matchBtn = tabsBlock.querySelector(`.code-tab-btn[data-tab="${pref}"]`);
      if (matchBtn) matchBtn.click();
    }
  });
}

function copyCodeToClipboard(preElement, btnElement) {
  const code = preElement.querySelector('code');
  const text = code ? code.innerText : preElement.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = '✓ Copied!';
    btnElement.style.color = '#10b981';
    btnElement.style.borderColor = '#10b981';

    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
      btnElement.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    showToast('Failed to copy to clipboard', '⚠️');
  });
}

/* ==========================================================================
   10. INTERACTIVE MULTI-ENDPOINT REST API PLAYGROUND
   ========================================================================== */
const API_ENDPOINTS = {
  'post-deploy': {
    method: 'POST',
    url: 'https://api.docucraft.dev/v1/deployments',
    payload: JSON.stringify({
      environment: "production",
      commit_sha: "71ef3b6",
      branch: "main",
      auto_rollback: true
    }, null, 2),
    mockResponse: (p) => ({
      id: "dep_" + Math.random().toString(36).substring(2, 10),
      object: "deployment",
      status: "queued",
      environment: p.environment || "production",
      commit_sha: p.commit_sha || "71ef3b6",
      branch: p.branch || "main",
      build_latency: "38ms",
      edge_region: "iad-us-east",
      urls: {
        live: `https://handbook-${p.environment || "production"}.docucraft.dev`,
        inspect: "https://app.docucraft.dev/deployments/dep_demo"
      },
      created_at: new Date().toISOString()
    }),
    statusCode: '201 Created'
  },
  'get-deploys': {
    method: 'GET',
    url: 'https://api.docucraft.dev/v1/deployments?limit=3',
    payload: '// GET requests do not require a request body.',
    mockResponse: () => ({
      object: "list",
      data: [
        { id: "dep_9b4c10", status: "ready", branch: "main", commit_sha: "71ef3b6", latency: "38ms" },
        { id: "dep_8a2d19", status: "ready", branch: "main", commit_sha: "96fe578", latency: "42ms" },
        { id: "dep_7c1b08", status: "ready", branch: "staging", commit_sha: "0db5e41", latency: "35ms" }
      ],
      has_more: false,
      total_count: 3
    }),
    statusCode: '200 OK'
  },
  'get-status': {
    method: 'GET',
    url: 'https://api.docucraft.dev/v1/deployments/dep_9b4c10e82f71',
    payload: '// GET requests do not require a request body.',
    mockResponse: () => ({
      id: "dep_9b4c10e82f71",
      object: "deployment",
      status: "ready",
      environment: "production",
      commit_sha: "71ef3b6",
      branch: "main",
      build_time_ms: 1240,
      cached_ast_nodes: 418,
      urls: { live: "https://docs.mycompany.com" }
    }),
    statusCode: '200 OK'
  },
  'del-rollback': {
    method: 'DELETE',
    url: 'https://api.docucraft.dev/v1/deployments/dep_9b4c10e82f71',
    payload: '// DELETE requests do not require a request body.',
    mockResponse: () => ({
      id: "dep_9b4c10e82f71",
      object: "deployment",
      status: "rolled_back",
      reverted_to: "dep_8a2d19e4bc10",
      active_release_url: "https://docs.mycompany.com"
    }),
    statusCode: '200 OK (Rolled Back)'
  }
};

let currentEndpointKey = 'post-deploy';

function initApiPlayground() {
  const btnRun = document.getElementById('btn-run-api-test');
  const methodBadge = document.getElementById('api-method-badge');
  const urlInput = document.getElementById('api-test-url');
  const payloadEl = document.getElementById('api-test-payload');
  const statusEl = document.getElementById('api-test-status');
  const responseEl = document.getElementById('api-test-response');
  const pills = document.querySelectorAll('.endpoint-selector-btn');

  if (!btnRun || !responseEl) return;

  // Endpoint Switchers
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const epKey = pill.getAttribute('data-endpoint');
      const conf = API_ENDPOINTS[epKey];
      if (!conf) return;

      currentEndpointKey = epKey;
      if (methodBadge) {
        methodBadge.textContent = conf.method;
        methodBadge.className = `http-badge ${conf.method.toLowerCase().substring(0, 3)}`;
      }
      if (urlInput) urlInput.value = conf.url;
      if (payloadEl) payloadEl.value = conf.payload;
      if (statusEl) {
        statusEl.className = 'status-pill idle';
        statusEl.textContent = 'Ready (Click Send)';
      }
      if (responseEl) {
        responseEl.textContent = '// Click "Send Request" to simulate call to ' + conf.url;
      }
    });
  });

  // Run Request
  btnRun.addEventListener('click', () => {
    btnRun.disabled = true;
    btnRun.innerHTML = '<span>⚡ Executing...</span>';

    const conf = API_ENDPOINTS[currentEndpointKey] || API_ENDPOINTS['post-deploy'];

    if (statusEl) {
      statusEl.className = 'status-pill idle';
      statusEl.textContent = 'Contacting edge runner...';
    }

    let parsed = {};
    if (payloadEl && conf.method === 'POST') {
      try {
        parsed = JSON.parse(payloadEl.value);
      } catch {
        parsed = { environment: "production" };
      }
    }

    setTimeout(() => {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span>⚡ Send Request</span>';

      if (statusEl) {
        statusEl.className = 'status-pill success';
        statusEl.textContent = `${conf.statusCode} • 38ms`;
      }

      const res = conf.mockResponse(parsed);
      responseEl.textContent = JSON.stringify(res, null, 2);
      showToast(`Gateway responded: ${conf.statusCode}`, '🚀');
    }, 450);
  });
}

/* ==========================================================================
   11. INTERACTIVE CLI TERMINAL EMULATOR
   ========================================================================== */
function initTerminalSimulator() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const btnClear = document.getElementById('btn-term-clear');
  const pills = document.querySelectorAll('.term-pill');

  if (!output || !input) return;

  function runCliCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Append command prompt
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line cmd';
    cmdLine.innerHTML = `<span style="color: #10b981;">user@devbox:~/handbook $</span> ${cmd}`;
    output.appendChild(cmdLine);

    // Process output
    const outLine = document.createElement('div');
    outLine.className = 'term-line';

    const c = cmd.toLowerCase();
    if (c === 'clear') {
      output.innerHTML = '';
      return;
    } else if (c === 'help') {
      outLine.innerHTML = `
        <div style="color: #38bdf8; font-weight: 700;">DocuCraft CLI v2.4.0 Commands:</div>
        <div>  <strong>docucraft dev</strong>       Start local hot-reload web server</div>
        <div>  <strong>docucraft build</strong>     Compile static distribution to ./dist</div>
        <div>  <strong>docucraft check</strong>     Audit 404 links, images and AST syntax</div>
        <div>  <strong>docucraft deploy</strong>    Deploy to edge CDN or GitHub Pages</div>
        <div>  <strong>docucraft --version</strong> Display CLI and engine build commit</div>
        <div>  <strong>clear</strong>               Clear terminal display</div>
      `;
    } else if (c.includes('--version') || c.includes('-v')) {
      outLine.innerHTML = `<span class="term-accent">docucraft/2.4.0</span> darwin-arm64 node-v20.11.0 (commit 80545fd)`;
    } else if (c.includes('check')) {
      outLine.innerHTML = `
        <div style="color: #a78bfa;">[docucraft:check] Scanning 9 chapters across 418 AST nodes...</div>
        <div>✓ Scanned 124 internal hyperlinks ... 0 broken links</div>
        <div>✓ Scanned 32 static image assets ... 0 missing assets</div>
        <div class="term-line success">✓ Audit passed with 0 errors and 0 warnings (took 32ms)</div>
      `;
    } else if (c.includes('build')) {
      outLine.innerHTML = `
        <div style="color: #38bdf8;">[docucraft:build] Compiling static distribution...</div>
        <div>● Pre-rendering 9 AST HTML nodes ... done (18ms)</div>
        <div>● Building in-memory search trie index ... done (6ms)</div>
        <div>● Bundling styles and vanilla ES6 ... done (12ms)</div>
        <div class="term-line success">✓ Compiled static distribution into ./dist (total size: 48.2 KB, took 44ms)</div>
      `;
    } else if (c.includes('deploy')) {
      outLine.innerHTML = `
        <div style="color: #38bdf8;">[docucraft:deploy] Connecting to edge deployment gate...</div>
        <div>● Authenticated via service account key ... ok</div>
        <div>● Uploaded 9 artifact pages to edge CDN ... ok</div>
        <div class="term-line success">🚀 Deployed release dep_9b4c10 -> https://docs.mycompany.com (latency 38ms)</div>
      `;
    } else {
      outLine.innerHTML = `<span style="color: #ef4444;">zsh: command not found: ${cmd}</span>. Type 'help' for available commands.`;
    }

    output.appendChild(outLine);
    output.scrollTop = output.scrollHeight;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runCliCommand(input.value);
      input.value = '';
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      output.innerHTML = '<div class="term-line text-muted">Terminal cleared.</div>';
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        runCliCommand(cmd);
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   12. CMD+K SPOTLIGHT SEARCH ENGINE
   ========================================================================== */
function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const openBtns = document.querySelectorAll('#btn-open-search, .search-trigger-btn');
  const closeBackdrop = document.getElementById('search-backdrop');
  const searchInput = document.getElementById('search-dialog-input');
  const resultsContainer = document.getElementById('search-dialog-results');

  if (!modal || !searchInput || !resultsContainer) return;

  function openSearch() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    searchInput.value = '';
    renderSearchResults('');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBackdrop) closeBackdrop.addEventListener('click', closeSearch);

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, '/')
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('hidden')) {
        openSearch();
      } else {
        closeSearch();
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  // Live query search
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    renderSearchResults(q);
  });

  function renderSearchResults(query) {
    if (!query) {
      resultsContainer.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-tertiary); font-size: 0.85rem;">
          Type keywords like <strong>"cli"</strong>, <strong>"api keys"</strong>, <strong>"webhooks"</strong>, or <strong>"config"</strong> to search docs...
        </div>
      `;
      return;
    }

    const qLower = query.toLowerCase();
    const matches = [];

    allDocsData.forEach(doc => {
      let score = 0;
      let matchedSnippet = '';

      if (doc.title.toLowerCase().includes(qLower)) score += 10;
      if (doc.summary.toLowerCase().includes(qLower)) score += 5;
      if (doc.content.toLowerCase().includes(qLower)) score += 2;

      if (score > 0) {
        // Extract surrounding snippet
        const plainText = doc.content.replace(/<[^>]*>/g, ' ');
        const idx = plainText.toLowerCase().indexOf(qLower);
        if (idx > -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(plainText.length, idx + 80);
          matchedSnippet = '...' + plainText.substring(start, end).trim() + '...';
        } else {
          matchedSnippet = doc.summary;
        }

        // Highlight keyword
        const regex = new RegExp(`(${query})`, 'gi');
        matchedSnippet = matchedSnippet.replace(regex, '<mark>$1</mark>');
        const highlightedTitle = doc.title.replace(regex, '<mark>$1</mark>');

        matches.push({
          doc: doc,
          score: score,
          title: highlightedTitle,
          snippet: matchedSnippet
        });
      }
    });

    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
          <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔍</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.2rem;">No documentation matching "${query}"</p>
          <span style="font-size: 0.78rem;">Try alternative engineering terms or consult the troubleshooting index.</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map((m, idx) => `
      <div class="search-result-item ${idx === 0 ? 'selected' : ''}" data-doc="${m.doc.id}">
        <span class="search-result-category">${m.doc.category}</span>
        <div class="search-result-title">${m.title}</div>
        <div class="search-result-snippet">${m.snippet}</div>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-doc');
        window.location.hash = `#${id}`;
        closeSearch();
      });
    });
  }
}

/* ==========================================================================
   13. FEEDBACK WIDGET & PAGE ACTIONS
   ========================================================================== */
function initFeedbackWidget() {
  const btnYes = document.getElementById('btn-feedback-yes');
  const btnNo = document.getElementById('btn-feedback-no');
  const card = document.getElementById('page-feedback-card');

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      showToast('Thank you for the positive feedback!', '👍');
      if (card) {
        card.innerHTML = '<div style="color: var(--success); font-weight: 600;">✓ Thank you! Your feedback helps us refine our developer guides.</div>';
      }
    });
  }

  if (btnNo) {
    btnNo.addEventListener('click', () => {
      showToast('Feedback recorded. We will improve this chapter.', '📝');
      if (card) {
        card.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.88rem;">Thank you for flagging this. Open an issue on GitHub to request specific clarifications.</div>';
      }
    });
  }
}

function initPageActions() {
  const btnCopyUrl = document.getElementById('btn-copy-page-url');
  const btnShare = document.getElementById('btn-share-x');
  const btnPrint = document.getElementById('btn-print-page');

  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Page URL copied to clipboard!', '🔗');
      });
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const text = encodeURIComponent(`Checking out ${document.title} on DocuCraft:`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   14. MOBILE SIDEBAR DRAWER CONTROLLER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('docs-sidebar');
  const backdrop = document.getElementById('docs-sidebar-backdrop');

  if (!hamburger || !sidebar) return;

  function openDrawer() {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hamburger.addEventListener('click', openDrawer);
  if (backdrop) backdrop.addEventListener('click', closeMobileDrawer);
}

function closeMobileDrawer() {
  const sidebar = document.getElementById('docs-sidebar');
  const backdrop = document.getElementById('docs-sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ==========================================================================
   15. FLOATING TOAST HELPER
   ========================================================================== */
let toastTimeout;

function showToast(message, icon = '✓') {
  const toast = document.getElementById('doc-toast');
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
