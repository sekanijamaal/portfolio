# Sidney Odum Portfolio

Premium single-page portfolio (Software Developer & AWS Certified Solutions Architect) built with React 19, TypeScript, Vite, Tailwind CSS, Three.js / React Three Fiber, drei, GSAP, and Framer Motion.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Three.js 0.187, React Three Fiber 9.8, drei 10.7
- GSAP 3.15, Framer Motion 14
- Playwright-core + Sharp (dev tooling only)

## Commands

```bash
npm run dev      # dev server on http://127.0.0.1:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Placeholders to replace before launch

The following are centralized and must be replaced with real values:

- `src/data/site.ts` — email, GitHub, LinkedIn handles, monogram, name, role, description, credentials, nav, site URL
- `index.html` — canonical URL, Open Graph `og:url`, `og:image` alt/target
- `public/og.png` — generated social image (1200×630); regenerate if the hero changes

Contact form uses client-side validation and a `mailto:` fallback; nothing is stored server-side. The Resume is a printable modal built from real supplied facts (no fabricated PDF).

## Structure

```
src/
  data/          site.ts, books.ts, projects.ts, skills.ts, certifications.ts, architecture.ts
  lib/           coverArt.ts (procedural covers), covers.tsx (CoverProvider)
  components/
    three/       Book.tsx, BookScene.tsx (32-book shelf, spring wave, click panels)
    hero/        Hero.tsx, BookPanel.tsx, LibraryIndex.tsx
    navigation/  Nav.tsx, MobileMenu.tsx
    about/       About.tsx
    projects/    Projects.tsx
    expertise/   Expertise.tsx
    architecture/Lab.tsx, Diagram.tsx
    certifications/Experience.tsx
    contact/     Contact.tsx
    footer/      Footer.tsx
    ui/          icons.tsx, SectionHeading.tsx
  hooks/         usePrefersReducedMotion, useMediaQuery, useScrollLock, useFocusTrap, useWebGLSupport, useActiveSection, useScrollReveals
index.css        design-system tokens + all component styles
main.tsx         entry
App.tsx          page composition + overlay state
public/
  fonts/         Inter + Libre Caslon Display (self-hosted, preloaded)
  projects/      ahome.webp, aglf.webp (real screenshots)
  og.png         social image (1200×630)
  favicon.svg
```

## Accessibility / performance

- Skip link, focus traps, ARIA dialogs, keyboard navigation (arrows/Escape in panels), reduced-motion support (`prefers-reduced-motion`)
- WebGL detection with static fallback
- Three.js lazy-loaded in hero (BookScene chunk ~926 KB / 246 KB gzip)
- Semantic HTML, print styles for Resume

## Notes

- No invented employment history, metrics, screenshots, or testimonials. NAAB and IaC volumes use generated cover art and are labeled "no project screenshot available."
- Build emits a chunk-size warning (>500 KB) for the lazily-loaded BookScene chunk; this is acceptable.
