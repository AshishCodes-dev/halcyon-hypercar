# Halcyon

Launch website for Halcyon, a fictional luxury hypercar brand. Built with a production-grade frontend stack designed for award-level interactive web experiences.

## Tech Stack

- **Framework**: React 19 + Vite (JavaScript)
- **Routing**: `react-router-dom`
- **Animation & Motion**: `framer-motion`, `gsap`, `lenis`
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Icons**: `lucide-react`
- **Auth**: `firebase` (Google Sign-In setup ready)
- **Styling**: Pure CSS with CSS custom properties (no Tailwind / UI kits)

---

## Getting Started

### 1. Installation

Ensure [pnpm](https://pnpm.io/) is installed. Then install dependencies:

```bash
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

### 3. Local Development

Start the Vite development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### 4. Production Build

Build for production with strict asset optimization:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

---

## Deployment Guide

### GitHub (Repository Setup)

1. Create a new repository on [GitHub](https://github.com/new).
2. Link your local repository and push:
   ```bash
   git remote add origin https://github.com/<your-username>/halcyon.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment

1. Import the repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `pnpm build`.
4. Output Directory: `dist`.
5. Environment Variables: Configure `VITE_FIREBASE_*` variables in project settings.
6. SPA routing is automatically handled via [`vercel.json`](./vercel.json).

### Render Deployment (Static Site)

1. Create a new **Static Site** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the build and publish settings:
   - **Build Command**: `pnpm install && pnpm build`
   - **Publish Directory**: `dist`
4. Add the SPA rewrite rule under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Add your `VITE_FIREBASE_*` environment variables in the **Environment** tab.
