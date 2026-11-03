/**
 * DocuCraft - Developer Technical Documentation Engine
 * Pure ES6, zero external runtime dependencies.
 * Instant Ctrl+K search, dynamic table of contents scrollspy, multi-language code tabs,
 * interactive API playground, client-side routing, and font accessibility controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDocsRouting();
  initSearchModal();
  initScrollSpy();
  initFontSizeControls();
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
   3. EMBEDDED DOCUMENTATION REPOSITORY & CLIENT-SIDE ROUTER
   ========================================================================== */
let allDocsData = [];
const fallbackDocs = [
  {
    "id": "quickstart",
    "category": "Getting Started",
    "title": "Quickstart & Architecture",
    "slug": "quickstart",
    "readTime": "3 min read",
    "lastUpdated": "November 2, 2026",
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
    "lastUpdated": "November 2, 2026",
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
    "content": "\n      <div class=\"lead-text\">\n        DocuCraft is distributed as both an npm package, a standalone compiled binary for macOS/Linux/Windows, and a minimal Docker container (under 24MB).\n      </div>\n\n      <h2 id=\"package-managers\">Package Manager Options</h2>\n      <p>You can add DocuCraft as a local dev-dependency directly into your project root so all team members use the exact pinned version:</p>\n\n      <pre><code class=\"language-bash\"># Add as pinned project development dependency\npnpm add -D @docucraft/cli@^2.4.0\n\n# Add build scripts to package.json\nnpm pkg set scripts.docs:dev=\"docucraft dev\"\nnpm pkg set scripts.docs:build=\"docucraft build\"\nnpm pkg set scripts.docs:serve=\"docucraft serve --dist ./dist\"</code></pre>\n\n      <h2 id=\"docker-setup\">Docker Containerized Setup</h2>\n      <p>For organizations requiring strict container sandboxing or air-gapped CI workers, pull the official Alpine-based container:</p>\n\n      <pre><code class=\"language-bash\"># Pull the lightweight Alpine image\ndocker pull ghcr.io/docucraft/docucraft:2.4.0-alpine\n\n# Run local documentation server mounting your ./docs folder\ndocker run --rm -it \\\n  -p 4000:4000 \\\n  -v $(pwd)/docs:/app/docs \\\n  -v $(pwd)/docucraft.config.ts:/app/docucraft.config.ts \\\n  ghcr.io/docucraft/docucraft:2.4.0-alpine dev</code></pre>\n\n      <h2 id=\"ci-cd-pipelines\">CI/CD Automated Verification</h2>\n      <p>Validate broken links, invalid code blocks, and missing image references automatically inside your GitHub Actions pipeline:</p>\n\n      <pre><code class=\"language-yaml\"># .github/workflows/docs-validation.yml\nname: Documentation Lint & Build\n\non:\n  pull_request:\n    paths:\n      - 'docs/**'\n      - 'docucraft.config.ts'\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v3\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'pnpm'\n\n      - name: Install Dependencies\n        run: pnpm install --frozen-lockfile\n\n      - name: Lint Markdown & Dead Links\n        run: pnpm docucraft check --strict\n\n      - name: Compile Static Distribution\n        run: pnpm docucraft build</code></pre>\n\n      <h2 id=\"airgapped-offline\">Air-Gapped & Offline Bundles</h2>\n      <p>If operating inside high-security networks with zero external WAN connectivity, download the standalone archive containing all bundled font assets, search indexing routines, and icon sets without remote CDN calls:</p>\n\n      <pre><code class=\"language-bash\"># Download offline bundle archive\ncurl -O https://releases.docucraft.dev/v2.4.0/docucraft-offline-v2.4.0.tar.gz\n\n# Extract and run\ntar -xzf docucraft-offline-v2.4.0.tar.gz\n./docucraft/bin/docucraft serve --offline</code></pre>\n    "
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
    "lastUpdated": "November 2, 2026",
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
    "title": "REST API: Deployments",
    "slug": "api-reference",
    "readTime": "6 min read",
    "lastUpdated": "November 3, 2026",
    "summary": "Trigger automated documentation builds, check deployment status, and inspect build latency via the REST API.",
    "toc": [
      {
        "id": "post-deployment",
        "title": "POST /v1/deployments",
        "level": 2
      },
      {
        "id": "parameters",
        "title": "Request Body Parameters",
        "level": 2
      },
      {
        "id": "interactive-console",
        "title": "Live Interactive API Tester",
        "level": 2
      },
      {
        "id": "response-schema",
        "title": "Response Schema Specification",
        "level": 2
      }
    ],
    "content": "\n      <div class=\"lead-text\">\n        The Deployments API empowers CI/CD bots and Git webhook triggers to compile and publish new revisions of your documentation handbook without accessing the command line.\n      </div>\n\n      <h2 id=\"post-deployment\">POST /v1/deployments</h2>\n      <p>Submits a build manifest to the distributed edge compilation queue.</p>\n\n      <div class=\"endpoint-badge-row\">\n        <span class=\"http-badge post\">POST</span>\n        <code class=\"endpoint-url\">https://api.docucraft.dev/v1/deployments</code>\n      </div>\n\n      <h2 id=\"parameters\">Request Body Parameters</h2>\n      <div class=\"specs-table-wrapper\">\n        <table class=\"specs-table\">\n          <thead>\n            <tr>\n              <th>Field</th>\n              <th>Type</th>\n              <th>Required</th>\n              <th>Description</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>environment</code></td>\n              <td><code>string (enum)</code></td>\n              <td><span class=\"req-badge\">Required</span></td>\n              <td>Target distribution environment: <code>\"production\"</code> or <code>\"preview\"</code>.</td>\n            </tr>\n            <tr>\n              <td><code>commit_sha</code></td>\n              <td><code>string</code></td>\n              <td><span class=\"req-badge\">Required</span></td>\n              <td>Full 40-character or 7-character Git commit hash being built.</td>\n            </tr>\n            <tr>\n              <td><code>branch</code></td>\n              <td><code>string</code></td>\n              <td><span class=\"opt-badge\">Optional</span></td>\n              <td>Git branch name. Defaults to <code>\"main\"</code>.</td>\n            </tr>\n            <tr>\n              <td><code>auto_rollback</code></td>\n              <td><code>boolean</code></td>\n              <td><span class=\"opt-badge\">Optional</span></td>\n              <td>If <code>true</code>, reverts to previous release if health checks fail. Defaults to <code>true</code>.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <h2 id=\"interactive-console\">Live Interactive API Tester</h2>\n      <p>Test the deployment orchestrator directly from this handbook. Click <strong>Send Request</strong> to execute a simulated request to the edge runner:</p>\n\n      <!-- INTERACTIVE API RUNNER WIDGET -->\n      <div class=\"api-tester-card\" id=\"api-tester-card\">\n        <div class=\"api-tester-header\">\n          <div class=\"api-method-select\">\n            <span class=\"http-badge post\">POST</span>\n            <input type=\"text\" id=\"api-test-url\" value=\"/v1/deployments\" readonly>\n          </div>\n          <button id=\"btn-run-api-test\" class=\"btn-api-run\">\n            <span>⚡ Send Request</span>\n          </button>\n        </div>\n\n        <div class=\"api-tester-body\">\n          <div class=\"api-tester-col\">\n            <span class=\"tester-label\">Request Payload (JSON):</span>\n            <textarea id=\"api-test-payload\" class=\"tester-textarea\" rows=\"7\">{\n  \"environment\": \"production\",\n  \"commit_sha\": \"71ef3b6\",\n  \"branch\": \"main\",\n  \"auto_rollback\": true\n}</textarea>\n          </div>\n\n          <div class=\"api-tester-col\">\n            <div class=\"tester-status-row\">\n              <span class=\"tester-label\">Response:</span>\n              <span id=\"api-test-status\" class=\"status-pill idle\">Ready (Click Send)</span>\n            </div>\n            <pre class=\"tester-response-pre\"><code id=\"api-test-response\" class=\"language-json\">{\n  \"hint\": \"Click 'Send Request' to execute simulated deployment.\"\n}</code></pre>\n          </div>\n        </div>\n      </div>\n\n      <h2 id=\"response-schema\">Response Schema Specification</h2>\n      <p>A successful deployment registration returns HTTP <code>201 Created</code> with the following JSON model:</p>\n\n      <pre><code class=\"language-json\">{\n  \"id\": \"dep_9b4c10e82f71\",\n  \"object\": \"deployment\",\n  \"status\": \"queued\",\n  \"environment\": \"production\",\n  \"commit_sha\": \"71ef3b6\",\n  \"branch\": \"main\",\n  \"urls\": {\n    \"live\": \"https://handbook.company.com\",\n    \"inspect\": \"https://app.docucraft.dev/deployments/dep_9b4c10e82f71\"\n  },\n  \"created_at\": \"2026-11-03T18:24:00Z\"\n}</code></pre>\n    "
  },
  {
    "id": "troubleshooting",
    "category": "Operations",
    "title": "Troubleshooting & Error Index",
    "slug": "troubleshooting",
    "readTime": "4 min read",
    "lastUpdated": "November 2, 2026",
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
  const hash = window.location.hash.replace('#', '').trim();
  const found = allDocsData.find(d => d.id === hash || d.slug === hash);
  if (found) {
    activeDocId = found.id;
  } else {
    activeDocId = allDocsData[0] ? allDocsData[0].id : 'quickstart';
  }
  loadArticle(activeDocId);
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
                ${doc.id === 'api-reference' ? '<span class="item-badge api">REST</span>' : ''}
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

  // Re-bind interactive widgets
  initCodeSnippets();
  initApiPlayground();

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
   4. SCROLLSPY TABLE OF CONTENTS TRACKER
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
   5. INTERACTIVE MULTI-LANGUAGE CODE TABS & ONE-CLICK CLIPBOARD COPY
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
   6. INTERACTIVE REST API TESTER PLAYGROUND
   ========================================================================== */
function initApiPlayground() {
  const btnRun = document.getElementById('btn-run-api-test');
  const statusEl = document.getElementById('api-test-status');
  const responseEl = document.getElementById('api-test-response');
  const payloadEl = document.getElementById('api-test-payload');

  if (!btnRun || !responseEl) return;

  btnRun.addEventListener('click', () => {
    btnRun.disabled = true;
    btnRun.innerHTML = '<span>⚡ Executing...</span>';

    if (statusEl) {
      statusEl.className = 'status-pill idle';
      statusEl.textContent = 'Contacting edge runner...';
    }

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payloadEl.value);
    } catch {
      parsedPayload = { environment: "production", commit_sha: "71ef3b6" };
    }

    setTimeout(() => {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span>⚡ Send Request</span>';

      if (statusEl) {
        statusEl.className = 'status-pill success';
        statusEl.textContent = '201 Created • 38ms';
      }

      const randomId = 'dep_' + Math.random().toString(36).substring(2, 10);
      const mockResponse = {
        id: randomId,
        object: "deployment",
        status: "queued",
        environment: parsedPayload.environment || "production",
        commit_sha: parsedPayload.commit_sha || "71ef3b6",
        branch: parsedPayload.branch || "main",
        build_latency: "38ms",
        edge_region: "iad-us-east",
        urls: {
          live: `https://handbook-${parsedPayload.environment || "production"}.docucraft.dev`,
          inspect: `https://app.docucraft.dev/deployments/${randomId}`
        },
        created_at: new Date().toISOString()
      };

      responseEl.textContent = JSON.stringify(mockResponse, null, 2);
      showToast('API call completed (201 Created)', '🚀');
    }, 450);
  });
}

/* ==========================================================================
   7. CMD+K SPOTLIGHT SEARCH ENGINE
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
          Type keywords like <strong>"cli"</strong>, <strong>"api keys"</strong>, <strong>"deployments"</strong>, or <strong>"config"</strong> to search docs...
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
   8. FEEDBACK WIDGET & PAGE ACTIONS
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
   9. MOBILE SIDEBAR DRAWER CONTROLLER
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
   10. FLOATING TOAST HELPER
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
