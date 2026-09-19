# KNC Logistics — Cinematic Preloader

A premium, dependency-free page-load animation built around the exact
supplied KNC logo. The logo asset itself is never redrawn, recolored, or
distorted — every effect (the orbit lines, the settle-into-place motion,
the shimmer) is staged *around* or *masked to* the untouched PNG.

A live, interactive version of this is running at the link shared alongside
these files — open it and refresh, or hit "Replay," to see the full
sequence. That page and this folder run the identical CSS/JS, so what you
see there is exactly what you're getting here.

## What's in this folder

```
knc-loader/
├── knc-loader.html     ← markup to paste into <body>
├── knc-loader.css       ← all styling + animation choreography
├── knc-loader.js         ← vanilla JS orchestration (zero dependencies)
├── KNCLoader.jsx          ← equivalent React/Next.js component
├── assets/knc-logo.png     ← your logo, cropped tight & optimized (386×386)
└── README.md (this file)
```

## A note on your codebase

I wasn't able to inspect an actual project in this workspace — only the
logo image came through, no repo or file tree. So this is built as a
**framework-agnostic core** (plain HTML/CSS/JS, works in literally any
stack — static HTML, PHP, Rails, WordPress, etc.) plus a **React
component** for the common case of a React/Next.js corporate site. If you
share your actual project structure, I can wire this in directly and
adapt it to your build system, asset pipeline, and CSS conventions instead
of you having to do it by hand.

## Integration — plain HTML / any backend

1. In `<head>`, before your other stylesheets:
   ```html
   <link rel="preload" as="image" href="/assets/knc-logo.png" fetchpriority="high">
   <link rel="stylesheet" href="/knc-loader.css">
   ```
2. Paste the contents of `knc-loader.html` as the **first** thing inside
   `<body>`, before anything else.
3. Before `</body>`:
   ```html
   <script src="/knc-loader.js" defer></script>
   ```
4. Copy `assets/knc-logo.png` into your project and make sure the paths in
   `knc-loader.css` (`mask-image: url(...)`) and the `<img src>` point at
   wherever you actually host it.

That's it — no build step, no dependency to install.

## Integration — React / Next.js

```jsx
import KNCLoader from "./KNCLoader";

export default function RootLayout({ children }) {
  return (
    <>
      <KNCLoader />
      {children}
    </>
  );
}
```

- Works with the App Router or Pages Router (it's marked `"use client"`).
- Renders as a `position: fixed` overlay, so it never shifts your layout,
  and your page can render/hydrate underneath it normally.
- If you'd rather import the logo through your bundler (so it gets
  hashed/optimized) instead of a static `/assets/...` path, import it and
  pass the resolved URL in:
  ```jsx
  import logoUrl from "./assets/knc-logo.png";
  <KNCLoader logoSrc={logoUrl} />
  ```
  (swap the hardcoded `LOGO_SRC` constant for a prop if you do this — one
  line change at the top of `KNCLoader.jsx`.)
- Listen for completion anywhere with `onDone={() => ...}`, or globally via
  `document.addEventListener("knc:loader:done", ...)` (vanilla version).

## The animation, phase by phase

| Time | What happens |
|---|---|
| 0.00s | Clean white screen; a barely-there navy radial glow blooms in behind center (the "ambient depth" layer) |
| 0.15s–1.30s | Two thin elliptical orbit lines draw themselves on, navy then green — an abstract globe-grid motif, echoing the logo's own theme without touching its pixels |
| 0.65s–1.60s | The real, untouched logo settles into frame: fades in while easing from a slight lower-left offset and soft blur into perfect focus and center — a single, expensive-feeling "arrival" |
| 1.30s–2.00s | Orbit lines recede to a faint, slowly-rotating ambient texture (they keep drifting almost imperceptibly for the rest of the sequence) |
| 1.50s–2.40s | A soft diagonal light sheen sweeps across the logo, masked to its *exact* alpha shape so it only glints on real ink |
| 1.75s–2.30s | A brief spark at the arrow tip, timed to the sheen passing through — a small, deliberate detail |
| ~2.85s | Hold complete — sequence exits: the mark dissolves slightly ahead of the backdrop (forward-feeling, not a hard cut) |
| ~3.30s | Fully gone, scroll restored, site interactive |

Total: **~3.3s**, inside your 2.5–3.5s target.

Timing isn't just a dumb fixed clock: the exit waits for the real `load`
event if the page genuinely isn't ready yet (capped at 4.2s so it can
never hang), but never fires *before* the choreography's natural finish —
see the comments in `knc-loader.js`.

## Reduced motion

`prefers-reduced-motion: reduce` swaps in a calm ~350ms crossfade of the
static logo — no orbit lines, no movement, no blur, no shimmer — and the
whole thing holds for under a second total. This is a real, separate code
path (see the `@media` block at the bottom of `knc-loader.css`), not a
sped-up version of the full animation.

## Customization

Everything is driven by CSS custom properties and a handful of named
`@keyframes`, so retiming or recoloring doesn't require touching the
choreography logic:

- **Colors** — `--knc-navy`, `--knc-navy-deep`, `--knc-navy-light`,
  `--knc-green`, `--knc-green-light` at the top of `knc-loader.css`.
  These were sampled directly from your logo file, so they already match
  exactly.
- **Logo size** — `--knc-logo-size` (a `clamp()`, so it's already
  responsive; adjust the min/preferred/max values for a bigger or smaller
  mark).
- **Retiming a phase** — each animated layer has one line like
  `animation: knc-mark-settle 950ms var(--knc-ease-settle) 650ms both;`
  (duration, easing, delay). Nudge the delay to shift a phase earlier or
  later; nudge `MIN_MS` in the JS if you change the overall length.

### Optional: GSAP variant

Everything here is hand-tuned CSS so it drops into any project with zero
new dependencies. If GSAP is already in your stack and you'd prefer a
timeline you can scrub/tune more interactively, the same choreography
maps directly onto a `gsap.timeline()` — each `@keyframes` block above
becomes one `.to()` call at the same delay/duration/ease. Happy to build
that variant if you'd like it instead — just say the word.

## Performance & production notes

- **Zero runtime dependencies.** All motion is CSS
  transform/opacity/filter (GPU-composited); JS only toggles classes and
  times the exit.
- **Preload the logo** (`<link rel="preload" as="image" ...>`) so the
  very first paint already has it — see integration steps above.
- The provided PNG is cropped tight to the logo's actual bounds (removed
  ~15% of dead transparent padding) and losslessly optimized — 386×386,
  ~155KB. If you want it smaller still, a WebP export of the same crop
  will typically run 40–70KB with no visible quality loss; keep the PNG as
  a fallback for older Safari mask-image support if you do.
- No layout shift: the loader is a `position: fixed` overlay that never
  participates in document flow, and it's fully removed from the DOM
  (`root.remove()`) once it's done — nothing left behind.
- Scroll is locked (`overflow: hidden` on `<html>`/`<body>`) only while
  the loader is visible, and restored the instant the exit transition
  completes.
- Runs on every hard navigation / direct visit / refresh by design (it's
  plain markup in `<body>`, not gated behind any "first visit only"
  check) — that's standard behavior for a full document reload and needs
  no special-casing. If you're in a single-page app and only want it on
  the very first load (not on client-side route changes), that's a one-
  line addition — just ask.
