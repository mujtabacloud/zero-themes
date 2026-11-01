---
title: "How to Score 100/100 on Google PageSpeed with GitHub Pages in 2026"
slug: "score-100-google-pagespeed"
date: "2026-10-28"
category: "Performance"
badge: "Editor's Pick"
author: "Sarah Chen"
authorRole: "Principal Frontend Architect"
readTime: "6 min read"
coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
excerpt: "Static websites hosted on GitHub Pages have a massive speed advantage over heavy WordPress and database platforms. Here is our blueprint for sub-300ms First Contentful Paint."
tags:
  - "Performance"
  - "GitHub Pages"
  - "Web Vitals"
  - "Lighthouse"
---

## Why GitHub Pages Delivers Instant Performance

When you serve purely pre-rendered HTML, CSS, and modern vanilla JavaScript from Fastly's global CDN—which powers GitHub Pages—you bypass the single slowest stage in dynamic web architectures: server-side runtime database queries and PHP template compilation.

In this guide, we break down the five exact techniques we use across all Zero Themes templates to guarantee a flat 100/100 on Google PageSpeed Insights and Lighthouse.

### 1. Zero Render-Blocking Resources

Every stylesheet in Zero Themes is structured with critical CSS above the fold and standard styles loaded with non-blocking techniques. Scripts always carry `defer` or `type="module"` to ensure DOM rendering is never halted:

```html
<!-- Defer script execution until HTML parsing completes -->
<script defer src="./assets/js/main.js"></script>
```

### 2. Relative Asset URLs for GitHub Pages Subdirectories

When hosting on a GitHub repository URL such as `https://username.github.io/repo-name/`, referencing absolute root paths like `/assets/css/style.css` leads to 404 errors because the browser resolves them against `username.github.io` rather than the subfolder.

Always use explicit relative links:

```html
<!-- Correct relative link -->
<link rel="stylesheet" href="./assets/css/style.css" />
```

### 3. Modern WebP/AVIF Image Encoding

Unoptimized hero images are the #1 cause of poor Largest Contentful Paint (LCP) scores. By serving modern responsive images with explicit `width` and `height` attributes, you eliminate Cumulative Layout Shift (CLS) and keep payloads under 150 KB.

### Summary Checklist

- **First Contentful Paint (FCP)**: < 0.4s
- **Largest Contentful Paint (LCP)**: < 0.9s
- **Total Blocking Time (TBT)**: 0 ms
- **Cumulative Layout Shift (CLS)**: 0.00
