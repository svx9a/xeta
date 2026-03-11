---
description: Maintain and expand the XETAPAY dashboard design system
---

1. Ensure the `PageHeader` component is used at the top of every functional page module.
    - Path: `src/components/PageHeader.tsx`
    - Standard props: `title`, `subtitle`, `icon`, `status`.

2. Standardize page container layout:
    - Use `<div className="animate-fadeIn w-full space-y-6 pb-8">` as the root wrapper.
    - Ensure responsive grids use `grid grid-cols-1 md:grid-cols-2 gap-6` for consistent density.

// turbo
3. Verify architectural integrity across all lazy-loaded modules:
    - Run `npm run build` to ensure all high-performance chunks are generated correctly.

4. Check for port conflicts and service dependencies:
    - Ensure `server.ts` is configured for the correct local environment (default: 8081).
    - Verify that `src/services/` contains all essential logic (taxService, shippingService, etc.).

// turbo
5. Launch the development environment for visual verification:
    - Run `npm run dev` and navigate to `http://localhost:8081`.
