/**
 * KNC Logistics — Cinematic Preloader
 * ------------------------------------------------------------------
 * Zero dependencies. Pure CSS handles every frame of motion (GPU-friendly
 * transform / opacity / filter); this script only:
 *
 *   1. Locks page scroll while the loader is on screen.
 *   2. Times the exit: the choreography has a natural finish point
 *      (MIN_MS), but if the page genuinely isn't ready yet, it waits a
 *      little longer for `load` — capped at MAX_MS so it can never hang.
 *   3. Respects prefers-reduced-motion with a much shorter hold.
 *   4. Cleans up after itself: unlocks scroll, hides the node, dispatches
 *      a `knc:loader:done` event, and removes the element from the DOM.
 *
 * Nothing here is required to make the animation play — it plays purely
 * from the CSS as soon as the markup is in the DOM. This script exists to
 * make the *exit* considerate of real page-load timing instead of firing
 * on a dumb fixed timer.
 */
(function () {
  "use strict";

  var root = document.getElementById("knc-loader");
  if (!root) return;

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Natural end of the choreography (see knc-loader.css timeline comment),
  // plus a short hold. Reduced-motion gets a much shorter, calmer hold.
  var MIN_MS = prefersReduced ? 500 : 2850;
  // Absolute ceiling — the loader will never block the site longer than this,
  // even on a slow connection where `load` fires late.
  var MAX_MS = prefersReduced ? 900 : 4200;
  var EXIT_MS = prefersReduced ? 260 : 480;

  var htmlEl = document.documentElement;
  var bodyEl = document.body;
  htmlEl.classList.add("knc-loader-lock");
  bodyEl.classList.add("knc-loader-lock");

  var started = performance.now();
  var pageLoaded = document.readyState === "complete";
  var exited = false;

  window.addEventListener(
    "load",
    function () {
      pageLoaded = true;
    },
    { once: true }
  );

  function elapsed() {
    return performance.now() - started;
  }

  function tick() {
    if (exited) return;
    var t = elapsed();
    var readyToExit = t >= MIN_MS && (pageLoaded || t >= MAX_MS);
    if (readyToExit) {
      exit();
      return;
    }
    requestAnimationFrame(tick);
  }

  function exit() {
    if (exited) return;
    exited = true;
    root.classList.add("knc-loader--exit");

    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      root.classList.add("knc-loader--gone");
      htmlEl.classList.remove("knc-loader-lock");
      bodyEl.classList.remove("knc-loader-lock");
      document.dispatchEvent(new CustomEvent("knc:loader:done"));
      if (root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };

    root.addEventListener("transitionend", finish, { once: true });
    // Fallback in case transitionend doesn't fire (e.g. display changes
    // mid-flight, or a browser quirk) — never leave the site locked.
    window.setTimeout(finish, EXIT_MS + 120);
  }

  requestAnimationFrame(tick);
})();
