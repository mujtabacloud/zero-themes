---
title: "Quick Start Guide"
slug: "quick-start"
section: "Quick Start"
order: 1
summary: "Get any Zero Themes template up and running in under 2 minutes with zero build tools."
---

# Quick Start Guide

Zero Themes website templates are crafted to be 100% plug-and-play. You don't need `npm install`, Node.js, Webpack, Vite, or any build pipeline unless you choose to add one.

## 1. Clone or Download

Choose any theme from the [Themes Catalog](themes.html) and clone the repository:

```bash
git clone https://github.com/mujtabacloud/aurora-saas-theme.git
cd aurora-saas-theme
```

## 2. Open Locally

Simply double-click `index.html` to open it in Google Chrome, Firefox, or Safari, or use VS Code's Live Server extension.

## 3. Customize Branding

- **Site Name**: Edit `<title>` and header brand text in `index.html`.
- **Colors**: Open `assets/css/style.css` and adjust the CSS variables in `:root`:
  ```css
  :root {
    --primary: #4f46e5;
    --primary-light: #6366f1;
    --bg-main: #0b0f19;
  }
  ```
- **Images**: Place your own product screenshots in `assets/images/`.
