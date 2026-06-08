# Deployment Guide — Quimera Agency Website

## Quick Start

### 1. **GitHub Sync** (Already connected ✅)
Your repo is at: `https://github.com/QuimeraAgency/Quimera-Web`

### 2. **Push to GitHub**
```bash
# In your local repo folder:
git add .
git commit -m "Initial commit: Quimera website v1"
git push origin main
```

### 3. **Deploy to Vercel** (Free tier)
1. Go to https://vercel.com
2. Click **"Add New... → Project"**
3. Select **QuimeraAgency/Quimera-Web**
4. Click **"Deploy"** (Vercel auto-detects the setup)
5. Wait ~2 min — you'll get a live URL like `quimera-web.vercel.app`

### 4. **Share Access with Team**
In Vercel:
- Go to **Project Settings → Members**
- Add your web team by email
- They can push to `main` and see live previews

### 5. **Connect Custom Domain**
Once live on Vercel:
- Go to **Settings → Domains**
- Add `quimeragency.com` (or your domain)
- Follow DNS instructions from your domain registrar

---

## Making Changes

1. Edit files locally (or in VS Code)
2. `git commit -m "Update [section]"`
3. `git push origin main`
4. Vercel auto-deploys (~30 sec)
5. Check `quimera-web.vercel.app` (or your custom domain)

---

## Environment & Tech Stack

- **Frontend**: Plain HTML5 + CSS + React (inline JSX for interactivity)
- **Hosting**: Vercel (auto-scales, free tier covers agency site)
- **Version Control**: GitHub
- **Static Site**: No backend needed

---

## Next: Make Responsive

Once deployed, we'll add mobile/tablet styles:
- Responsive grid breakpoints
- Touch-friendly nav
- Optimized font sizes for small screens
- Test on actual devices via Vercel's preview URL
