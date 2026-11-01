---
title: "GitHub Pages 1-Click Deployment"
slug: "github-pages-deployment"
section: "Deployment & Hosting"
order: 2
summary: "Host your website completely free forever with GitHub's worldwide Fastly CDN and automatic SSL."
---

# GitHub Pages 1-Click Deployment

Deploying your Zero Themes website to GitHub Pages takes less than 60 seconds.

## Step-by-Step Instructions

1. **Create a GitHub Repository**:
   - Go to [GitHub.com/new](https://github.com/new).
   - Enter your repository name (e.g., `zero-themes` or `my-awesome-site`).
   - Choose **Public** and leave initialization options unchecked.

2. **Push Your Files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository's **Settings** tab.
   - Click **Pages** in the left sidebar.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.

4. **Your Live Site**:
   Within 30–60 seconds, your site will be live at:
   `https://<your-username>.github.io/<your-repo>/`
