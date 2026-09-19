"use client";

/**
 * KNC Logistics — Cinematic Preloader (React)
 * ------------------------------------------------------------------
 * Drop this at the top of your root layout / App component, e.g.:
 *
 *   <KNCLoader />
 *   <YourApp />
 *
 * It renders as a fixed, full-viewport overlay (position: fixed) so it
 * never affects the layout of anything beneath it — no reserved space,
 * no shift when it disappears. All motion is pure CSS (see
 * knc-loader.css); this component only manages the exit timing, scroll
 * lock, and reduced-motion preference, mirroring knc-loader.js.
 *
 * Update LOGO_SRC below if your bundler serves the asset from a
 * different path (e.g. a Next.js `import logo from "..."` static import
 * also works — just pass its resolved `.src` / value in).
 */

import { useEffect, useRef, useState } from "react";
import "./knc-loader.css";

const LOGO_SRC = "/assets/knc-logo.png";

export default function KNCLoader({ onDone }) {
  const rootRef = useRef(null);
  const [phase, setPhase] = useState("active"); // 'active' | 'exit' | 'gone'

  useEffect(() => {
    if (phase === "gone") return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const MIN_MS = prefersReduced ? 500 : 2850;
    const MAX_MS = prefersReduced ? 900 : 4200;
    const EXIT_MS = prefersReduced ? 260 : 480;

    const html = document.documentElement;
    const body = document.body;
    html.classList.add("knc-loader-lock");
    body.classList.add("knc-loader-lock");

    const started = performance.now();
    let pageLoaded = document.readyState === "complete";
    let raf;
    let exited = false;

    const onLoad = () => {
      pageLoaded = true;
    };
    window.addEventListener("load", onLoad, { once: true });

    const tick = () => {
      if (exited) return;
      const t = performance.now() - started;
      const readyToExit = t >= MIN_MS && (pageLoaded || t >= MAX_MS);
      if (readyToExit) {
        exited = true;
        setPhase("exit");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let exitTimer;
    const node = rootRef.current;
    const finish = () => {
      html.classList.remove("knc-loader-lock");
      body.classList.remove("knc-loader-lock");
      setPhase("gone");
      if (onDone) onDone();
    };

    if (phase === "exit" && node) {
      node.addEventListener("transitionend", finish, { once: true });
      exitTimer = window.setTimeout(finish, EXIT_MS + 120);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      if (node) node.removeEventListener("transitionend", finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={rootRef}
      className={`knc-loader${phase === "exit" ? " knc-loader--exit" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="knc-loader__sr">Loading KNC Logistics…</span>

      <div className="knc-loader__glow" aria-hidden="true" />

      <div className="knc-loader__stage">
        <svg
          className="knc-loader__orbits"
          viewBox="0 0 400 400"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse
            className="knc-loader__orbit-ring knc-loader__orbit-ring--a"
            cx="200"
            cy="200"
            rx="192"
            ry="150"
            pathLength="1"
          />
          <ellipse
            className="knc-loader__orbit-ring knc-loader__orbit-ring--b"
            cx="200"
            cy="200"
            rx="150"
            ry="192"
            pathLength="1"
          />
        </svg>

        <div className="knc-loader__mark">
          <img
            className="knc-loader__logo"
            src={LOGO_SRC}
            alt=""
            width={386}
            height={386}
            decoding="async"
            fetchPriority="high"
          />
          <div className="knc-loader__sheen" aria-hidden="true" />
          <div className="knc-loader__spark" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
