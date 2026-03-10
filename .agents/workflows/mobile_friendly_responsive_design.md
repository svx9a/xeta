---
description: Mobile‑first responsive design overhaul for XETAPAY (global UX/UI standards)
---

# Mobile‑First Responsive Design Workflow

**Goal**: Apply globally‑standard UX/UI best practices with a mobile‑first priority across the XETAPAY dashboard while preserving the premium “Light Sovereign” aesthetic.

## Steps

1. **Viewport meta tag**
   - Ensure `public/index.html` (or the root HTML file) contains:

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

2. **Tailwind config – mobile‑first breakpoints**
   - In `tailwind.config.js` define breakpoints (default are mobile‑first). Add any custom sizes if needed.
   - Enable `aspectRatio` and `forms` plugins for better UI controls.
3. **Responsive container widths**
   - Replace fixed `max-w-[1600px]`, `max-w-[1200px]`, etc., with responsive classes:

     ```tsx
     className="max-w-full sm:max-w-[800px] md:max-w-[1200px]"
     ```

   - Ensure sidebars collapse on small screens (`hidden sm:block`).
4. **Fluid typography**
   - Use Tailwind’s responsive text utilities:

     ```tsx
     className="text-sm sm:text-base md:text-lg"
     ```

   - Apply `tracking` and `leading` responsively.
5. **Touch‑friendly interactive elements**
   - Minimum touch target: `min-h-12` (48 px) and horizontal padding `px-4`.
   - Add `focus-visible` outlines for keyboard navigation.
6. **Responsive background decorations**
   - Convert large pixel‑based overlays to viewport units:

     ```tsx
     className="absolute top-0 right-0 w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw]"
     ```

   - Apply this pattern to all `w-[800px] h-[800px]` style elements.
7. **Image handling**
   - Ensure every `<img>` has an `alt` attribute.
   - Use `object-cover`, `max-w-full`, `h-auto` for responsive images.
8. **Accessibility (a11y)**
   - Add `aria-label` to icon‑only buttons.
   - Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`).
   - Verify color contrast meets WCAG AA (use axe or Lighthouse).
9. **Testing on devices**
   - Run `npm run dev` and open Chrome DevTools device toolbar.
   - Verify layout at breakpoints: 320 px, 375 px, 425 px, 768 px, 1024 px.
10. **Automated linting**
    - Install `eslint-plugin-jsx-a11y` and extend ESLint config.
    - Add script `"lint:ui": "eslint . --ext .tsx,.ts --rule 'jsx-a11y/*:error'"`.
11. **Documentation**
    - Add a **Responsive Design** section to `README.md` describing the new standards.

## // turbo‑all

All steps that involve running a command (e.g., installing plugins, linting) can be auto‑run with `// turbo‑all` annotation if desired.

**After completing these steps, re‑run the dev server and verify that all pages adapt gracefully from mobile to desktop while preserving the premium “Light Sovereign” look.**
