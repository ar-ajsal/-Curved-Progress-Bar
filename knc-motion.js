/**
 * KNC Logistics Services — typography fixes + logistics motion
 *
 * Works on top of the Framer export without touching its approved content:
 *   - marks oversized/mis-tagged text so knc-theme.css can size it properly
 *     and corrects its accessibility roles (one primary heading, paragraphs
 *     that are not headings)
 *   - shipment tracker: a truck drives along the bottom of the viewport as
 *     the page scrolls
 *   - hero route: a dashed freight route with waypoints and a moving shipment
 *   - solution cards: line-art replaced by supply-chain animations
 *   - stats count up when they scroll into view
 *
 * Everything decorative is aria-hidden, pointer-events:none, and switched off
 * (or shown static) for prefers-reduced-motion.
 */
(function () {
  "use strict";

  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var NS = "http://www.w3.org/2000/svg";

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function visible(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function svg(html, cls) {
    var wrap = document.createElement("div");
    wrap.className = cls;
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = html;
    return wrap;
  }
  // Run once the page loader (if any) has left, so intros are actually seen.
  function whenReady(fn) {
    if (q(".knc-loader")) {
      var done = false;
      var go = function () { if (!done) { done = true; fn(); } };
      window.addEventListener("knc:loader:done", go, { once: true });
      setTimeout(go, 9000);
    } else {
      fn();
    }
  }

  /* ------------------------------------------------------------------
     1. Typography + semantics
     ------------------------------------------------------------------ */
  function mark(el, cls, role, level) {
    if (!el.classList.contains(cls)) el.classList.add(cls);
    if (role && el.getAttribute("role") !== role) el.setAttribute("role", role);
    if (level && el.getAttribute("aria-level") !== String(level)) el.setAttribute("aria-level", String(level));
  }

  // Safety net: never show the same replacement paragraph twice.
  function dedupeClones() {
    var seen = {};
    qa("[data-clone]").forEach(function (c) {
      var key = c.tagName + "|" + (c.textContent || "").trim();
      if (seen[key] && seen[key].parentNode === c.parentNode) c.parentNode.removeChild(c);
      else seen[key] = c;
    });
  }

  function classify() {
    dedupeClones();
    var firstH1 = null;
    qa("h1").forEach(function (h) {
      if (!visible(h)) return;
      if (!firstH1) { firstH1 = h; return; }
      // Only the primary page heading stays an H1 for assistive tech.
      if (h.closest('[data-framer-name="Section: Hero"]')) { h.setAttribute("role", "heading"); h.setAttribute("aria-level", "1"); return; }
      h.setAttribute("role", "heading");
      h.setAttribute("aria-level", "3");
    });

    // Long statements set as giant headings are lead paragraphs.
    qa("h2").forEach(function (h) {
      var t = (h.textContent || "").trim();
      if (t.length > 100) mark(h, "knc-lead", "paragraph");
    });

    // Statement blocks built as word-by-word reveal components (.word divs):
    // size the block that holds the words like a lead paragraph.
    qa(".word").forEach(function (w) {
      var block = w.parentElement;
      if (!block || block.classList.contains("knc-lead")) return;
      if (parseFloat(getComputedStyle(block).fontSize) >= 36) block.classList.add("knc-lead");
    });

    // Large display figures (e.g. "90%") stay prominent but not poster-sized
    qa('[data-framer-name="Highlight"] p').forEach(function (p) {
      if ((p.textContent || "").trim().length <= 8 && parseFloat(getComputedStyle(p).fontSize) > 64) p.classList.add("knc-display");
    });

    // Copy that sits on a brand-green panel needs dark ink for contrast
    qa('[data-framer-name="Highlight"] p').forEach(function (p) {
      if ((p.textContent || "").trim().length < 20 || p.classList.contains("knc-on-green")) return;
      for (var e = p; e && e !== document.body; e = e.parentElement) {
        var bg = getComputedStyle(e).backgroundColor;
        var m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(bg);
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
          if (+m[1] === 34 && +m[2] === 178 && +m[3] === 107) p.classList.add("knc-on-green");
          break;
        }
      }
    });

    // Stats row
    qa('[data-framer-name="Stats"] h1, [data-framer-name="Stats"] h2').forEach(function (h) {
      mark(h, "knc-stat", "heading", 3);
    });

    // Services list: section title keeps H2 size, entries are sub-titles
    var service = q('[data-framer-name="Section: Service"]');
    if (service) {
      qa("h1, h2", service).forEach(function (h, i) {
        if (!visible(h)) return;
        if (i === 0 && /^services$/i.test((h.textContent || "").trim())) return;
        mark(h, "knc-title-lg", "heading", 3);
      });
      qa("p", service).forEach(function (p) {
        if (/^\(\d+\)$/.test((p.textContent || "").trim())) mark(p, "knc-count");
      });
    }

    // Solution card titles
    qa('[data-framer-name="Section: Solution"] [data-framer-name="Variant 1"] p').forEach(function (p) {
      var fs = parseFloat(getComputedStyle(p).fontSize);
      if (fs >= 24 && !p.classList.contains("knc-title-md")) mark(p, "knc-title-md", "heading", 3);
    });

    // How-we-work step titles get a drawn accent bar when seen
    qa('[data-framer-name="Section: How we work"] h3').forEach(function (h) {
      if (!h.classList.contains("knc-step")) {
        h.classList.add("knc-step");
        if (io) io.observe(h);
      }
    });
  }

  /* ------------------------------------------------------------------
     2. Shipment tracker (truck on a road along the bottom edge)
     ------------------------------------------------------------------ */
  var tracker, trackerFill, trackerTruck, ticking = false;

  function buildTracker() {
    if (tracker) return;
    tracker = document.createElement("div");
    tracker.className = "knc-tracker";
    tracker.setAttribute("aria-hidden", "true");
    tracker.innerHTML =
      '<div class="knc-tracker__road"></div>' +
      '<div class="knc-tracker__fill"></div>' +
      '<div class="knc-tracker__truck">' +
      '<svg viewBox="0 0 30 16" xmlns="' + NS + '">' +
      '<rect x="0" y="1.5" width="18" height="9.5" rx="1.2" fill="#000080"/>' +
      '<rect x="0" y="8.2" width="18" height="1.4" fill="#22b26b"/>' +
      '<path d="M19.2 4.6h5.6l3.8 3.9v4.2H19.2z" fill="#0f8fd1"/>' +
      '<path d="M21 5.9h3.4l2.3 2.4H21z" fill="#eaf4fb"/>' +
      '<g fill="#0a1240"><circle class="knc-tracker__wheel" cx="5.5" cy="12.6" r="2.3"/>' +
      '<circle class="knc-tracker__wheel" cx="12.5" cy="12.6" r="2.3"/>' +
      '<circle class="knc-tracker__wheel" cx="24" cy="12.6" r="2.3"/></g>' +
      '<g fill="#fff"><circle cx="5.5" cy="12.6" r="0.8"/><circle cx="12.5" cy="12.6" r="0.8"/><circle cx="24" cy="12.6" r="0.8"/></g>' +
      "</svg></div>";
    document.body.appendChild(tracker);
    trackerFill = q(".knc-tracker__fill", tracker);
    trackerTruck = q(".knc-tracker__truck", tracker);
    updateTracker();
  }

  function updateTracker() {
    ticking = false;
    if (!tracker) return;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    trackerFill.style.transform = "scaleX(" + p.toFixed(4) + ")";
    var x = p * (window.innerWidth - 8);
    trackerTruck.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateTracker); }
  }

  /* ------------------------------------------------------------------
     3. Hero freight route
     ------------------------------------------------------------------ */
  function buildHeroRoute() {
    // Freight route belongs on the home page and the service pages (road/freight imagery).
    if (!/^\/(index(\.html)?)?$|^\/services\/[^/]+\/?$|^\/services\/[^/]+\.html$/.test(location.pathname)) return;
    var hero = q('[data-framer-name="Section: Hero"]');
    if (!hero || q(".knc-route", hero)) return;
    if (getComputedStyle(hero).position === "static") hero.style.position = "relative";
    var path = "M -20 280 C 160 280, 210 170, 380 190 S 640 270, 800 170 S 1040 70, 1220 60";
    var motion = reduced ? "" :
      '<circle r="6" fill="#fff"><animateMotion dur="9s" repeatCount="indefinite" path="' + path + '"/></circle>' +
      '<circle r="14" fill="#22b26b" opacity=".35"><animateMotion dur="9s" repeatCount="indefinite" path="' + path + '"/>' +
      '<animate attributeName="r" values="8;18;8" dur="1.8s" repeatCount="indefinite"/></circle>';
    var pins = [[380, 190, "#22b26b"], [800, 170, "#e8731a"], [1190, 60, "#0f8fd1"]].map(function (p, i) {
      return '<g class="knc-pin" style="animation-delay:' + (1.1 + i * 0.5) + 's">' +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="' + p[2] + '" opacity=".22"/>' +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="' + p[2] + '" stroke="#fff" stroke-width="2"/></g>';
    }).join("");
    var el = svg(
      '<svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" xmlns="' + NS + '">' +
      '<path class="knc-route__base" d="' + path + '" fill="none"/>' +
      '<path class="knc-route__flow" d="' + path + '" fill="none"/>' +
      pins + motion + "</svg>",
      "knc-route"
    );
    hero.appendChild(el);
    whenReady(function () { el.classList.add("knc-in"); });
  }

  /* ------------------------------------------------------------------
     4. Solution cards: supply-chain animations instead of static line-art
     ------------------------------------------------------------------ */
  function artFor(i, dark) {
    var s = dark ? "#ffffff" : "#0a1240";
    var a = dark ? "#22b26b" : "#000080";
    if (i === 0) { // Optimized Supply Chain: pallets stacking up
      var layers = "";
      for (var k = 0; k < 6; k++) {
        layers += '<g class="knc-stack" style="animation-delay:' + (k * 0.18) + 's">' +
          '<ellipse cx="60" cy="' + (96 - k * 13) + '" rx="46" ry="12" fill="none" stroke="' + s + '" stroke-width="1.4"/></g>';
      }
      return '<svg viewBox="0 0 120 120" xmlns="' + NS + '">' + layers +
        '<circle class="knc-blip" cx="60" cy="16" r="3.2" fill="' + a + '"/></svg>';
    }
    if (i === 1) { // End to End Visibility: tracking radar
      return '<svg viewBox="0 0 120 120" xmlns="' + NS + '">' +
        '<g fill="none" stroke="' + s + '" stroke-width="1.3">' +
        '<circle cx="60" cy="60" r="16"/><circle cx="60" cy="60" r="32" opacity=".7"/><circle cx="60" cy="60" r="48" opacity=".45"/></g>' +
        '<circle class="knc-ping" cx="60" cy="60" r="16" fill="none" stroke="' + a + '" stroke-width="2"/>' +
        '<circle class="knc-ping" style="animation-delay:1.2s" cx="60" cy="60" r="16" fill="none" stroke="' + a + '" stroke-width="2"/>' +
        '<circle cx="60" cy="60" r="5" fill="' + a + '"/></svg>';
    }
    if (i === 2) { // Scalable Distribution: hub fanning out to destinations
      var nodes = [[18, 22], [100, 30], [96, 98], [24, 96]];
      var lines = nodes.map(function (n, k) {
        return '<line x1="60" y1="60" x2="' + n[0] + '" y2="' + n[1] + '" stroke="' + s + '" stroke-width="1.2" stroke-dasharray="4 5" class="knc-flow"/>' +
          '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="5" fill="none" stroke="' + s + '" stroke-width="1.4"/>' +
          '<circle class="knc-dot" r="2.8" fill="' + a + '" style="animation-delay:' + (k * 0.45) + 's;--x:' + (n[0] - 60) + 'px;--y:' + (n[1] - 60) + 'px" cx="60" cy="60"/>';
      }).join("");
      return '<svg viewBox="0 0 120 120" xmlns="' + NS + '">' + lines +
        '<circle cx="60" cy="60" r="9" fill="' + a + '"/><circle cx="60" cy="60" r="15" fill="none" stroke="' + s + '" stroke-width="1.2"/></svg>';
    }
    // Predictive Routing: grid of nodes with a route lighting up
    var grid = "";
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      grid += '<circle cx="' + (24 + c * 36) + '" cy="' + (24 + r * 36) + '" r="5" fill="none" stroke="' + s + '" stroke-width="1.3" opacity=".7"/>';
    }
    var route = "M24 96 L60 96 L60 60 L96 60 L96 24";
    return '<svg viewBox="0 0 120 120" xmlns="' + NS + '">' + grid +
      '<path d="' + route + '" fill="none" stroke="' + s + '" stroke-width="1" opacity=".25"/>' +
      '<path class="knc-route-draw" d="' + route + '" fill="none" stroke="' + a + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="96" r="5.5" fill="' + a + '"/><circle cx="96" cy="24" r="5.5" fill="' + a + '"/></svg>';
  }

  function buildCardArt() {
    var cards = qa('[data-framer-name="Section: Solution"] [data-framer-name="Variant 1"]').filter(visible);
    cards.forEach(function (card, i) {
      if (q(".knc-art", card)) return;
      if (getComputedStyle(card).position === "static") card.style.position = "relative";
      var dark = i === 2;
      var el = svg(artFor(i, dark), "knc-art");
      card.appendChild(el);
      if (io) io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     5. Stats count-up
     ------------------------------------------------------------------ */
  function prepareStats() {
    qa(".knc-stat").forEach(function (el) {
      if (el.__knc) return;
      var t = (el.textContent || "").trim();
      var m = /^(\d+(?:\.\d+)?)(.*)$/.exec(t);
      if (!m || /\//.test(t)) return;                 // "24/7" stays as is
      var node = null;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var n;
      while ((n = walker.nextNode())) { if (n.nodeValue.trim() === t) { node = n; break; } }
      if (!node) return;
      el.__knc = { node: node, target: parseFloat(m[1]), suffix: m[2], decimals: (m[1].split(".")[1] || "").length, text: node.nodeValue };
      if (io) io.observe(el);
    });
  }

  function countUp(el) {
    var d = el.__knc;
    if (!d || d.running || d.done) return;
    if (reduced) { d.done = true; return; }
    d.running = true;
    var start = performance.now(), dur = 1500;
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      d.node.nodeValue = (d.target * e).toFixed(d.decimals) + d.suffix;
      if (p < 1) requestAnimationFrame(tick);
      else { d.node.nodeValue = d.text; d.done = true; }
    })(start);
  }

  /* ------------------------------------------------------------------
     Observers + boot
     ------------------------------------------------------------------ */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add("knc-seen");
        if (el.__knc) countUp(el);
        io.unobserve(el);
      });
    }, { threshold: 0.35 });
  }

  var queued = false;
  function refresh() {
    queued = false;
    classify();
    prepareStats();
    buildHeroRoute();
    buildCardArt();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(function () { requestAnimationFrame(refresh); }, 220);
  }

  function boot() {
    buildTracker();
    refresh();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { onScroll(); schedule(); });
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
