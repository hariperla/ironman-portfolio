# MARK XII — Iron Man Portfolio

**Live:** https://hariperla.github.io/ironman-portfolio/

Personal portfolio for **Hari Charan Perla**, themed as Iron Man gold-titanium armor: JARVIS-style
boot sequence, WebGL 3D arc reactors, career told as MARK I→XII suit evolution on a rotating
reactor dial, hologram project cards, and suit-systems skill diagnostics.

**Stack:** Vite · React 19 · Tailwind CSS v4 · Framer Motion 12 · Three.js (react-three-fiber)

## Run

```bash
npm install
npm run dev        # http://localhost:5173/ironman-portfolio/
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub
Pages automatically (`base: '/ironman-portfolio/'` in `vite.config.js` matches the project-pages
path — change both together if the repo is ever renamed or moved to a user/org page).

## Edit content

All text lives in **`src/data.js`** — profile, stats, career timeline (marks), work projects
(primaryBuilds), side projects (garageLab), skills (systems), achievements, contact links,
and the boot log. Components render from it; no need to touch JSX for content updates.

## Structure

```
src/
  data.js                 ← all content (edit this)
  App.jsx                 ← section order + boot state
  index.css               ← theme variables, HUD utilities
  components/
    BootSequence.jsx      ← T.R.I.A.G.E. OS boot overlay (click to skip)
    BackgroundFX.jsx      ← grid, glows, particles, scanlines
    HUDOverlay.jsx        ← scroll progress + corner brackets + telemetry
    ArcReactor.jsx        ← SVG reactor (boot, footer, non-WebGL fallback)
    ArcReactor3D.jsx      ← WebGL reactor (hero + mission-log dial centerpiece),
                            lazy-loaded chunk; pauses offscreen; falls back to SVG
    Nav.jsx  Hero.jsx  PowerStats.jsx  MarkTimeline.jsx
    Workshop.jsx  SuitSystems.jsx  Achievements.jsx  Contact.jsx
    ui.jsx                ← SectionHeader, Brackets, TiltCard, Magnetic, Chip
  webgl.js                ← WebGL capability check
```

## Deploy

`npm run build`, then host `dist/` anywhere static — GitHub Pages, Netlify, Vercel, or
Cloudflare Pages. For GitHub Pages on a repo named `hariperla.github.io`, push `dist/`
contents (or add an Actions workflow) and the site serves at the root.

Respects `prefers-reduced-motion` (boot skipped, spins/parallax disabled).
