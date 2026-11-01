---
title: "Fixing Broken Asset Paths on GitHub Pages Subfolder Repositories"
slug: "fixing-broken-asset-paths"
date: "2026-10-25"
category: "Tutorials"
badge: "Guide"
author: "Alex Rivera"
authorRole: "DevOps Engineer"
readTime: "5 min read"
coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
excerpt: "Understand the fundamental difference between root relative paths and directory relative paths to guarantee bulletproof CSS and JS loading."
tags:
  - "GitHub Pages"
  - "Tutorial"
  - "CSS"
---

## The Common Pitfall with Subfolder Hosting

When hosting a project repository on GitHub Pages, your site URL looks like:
`https://yourname.github.io/your-project/`

If your HTML uses root-absolute links:
```html
<!-- INCORRECT on subfolder repos -->
<link rel="stylesheet" href="/assets/css/style.css" />
```
The browser will look for:
`https://yourname.github.io/assets/css/style.css` (404 Not Found!)

### The Solution: Dot-Slash Relative Paths

Change all asset references to use `./`:
```html
<!-- CORRECT for all environments -->
<link rel="stylesheet" href="./assets/css/style.css" />
<script defer src="./assets/js/main.js"></script>
```

This guarantees your template works whether served locally via `file:///`, on custom domains (`https://example.com/`), or under GitHub subfolders (`https://yourname.github.io/repo/`).
