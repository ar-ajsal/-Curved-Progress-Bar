/**
 * KNC Logistics Services — page loader
 *
 * Loaded synchronously from <head> so the loader paints before the site.
 * It builds its own markup (styled by knc-loader.css), shows the logo intro,
 * tracks real page-load progress, and then gets out of the way.
 *
 *  - First visit in a session: full intro (~2.4s minimum so the animation
 *    can finish, longer only if the page is genuinely still loading).
 *  - Later pages in the same session: a short branded hold, no intro.
 *  - prefers-reduced-motion: no motion, very short hold.
 *  - Never blocks longer than MAX_MS, even if `load` never fires.
 */
(function () {
  "use strict";

  if (window.__kncLoader) return;
  window.__kncLoader = true;

  var doc = document.documentElement;
  var STORAGE_KEY = "knc-loader-seen";

  var seen = false;
  try { seen = sessionStorage.getItem(STORAGE_KEY) === "1"; } catch (e) {}

  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var MIN_MS = reduced ? 250 : seen ? 450 : 2400;
  var MAX_MS = 6000;
  var EXIT_MS = 700;

  var LAYERS = [
    ["orange", "bar"],
    ["green", "bar"],
    ["blue", "bar"],
    ["grey", "bar"],
    ["text", "text"]
  ];

  var root = document.createElement("div");
  root.className = "knc-loader" + (seen || reduced ? " knc-loader--quick" : "");
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-label", "Loading KNC Logistics Services");

  var stage = document.createElement("div");
  stage.className = "knc-loader__stage";

  var logo = document.createElement("div");
  logo.className = "knc-loader__logo";

  var images = [];
  LAYERS.forEach(function (l) {
    var img = new Image();
    img.className = "knc-loader__layer knc-loader__layer--" + l[1] + " knc-loader__layer--" + l[0];
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.decoding = "sync";
    img.src = "/knc-loader-" + l[0] + ".png";
    images.push(img);
    logo.appendChild(img);
  });

  var sheen = document.createElement("div");
  sheen.className = "knc-loader__sheen";
  logo.appendChild(sheen);

  var road = document.createElement("div");
  road.className = "knc-loader__road";
  var fill = document.createElement("div");
  fill.className = "knc-loader__fill";
  road.appendChild(fill);

  stage.appendChild(logo);
  stage.appendChild(road);
  root.appendChild(stage);

  doc.classList.add("knc-loader-lock");
  doc.appendChild(root);

  var started = false;
  var startedAt = 0;
  var finished = false;
  var shown = Date.now();
  var progress = 0;

  function begin() {
    if (started) return;
    started = true;
    startedAt = Date.now();
    root.classList.add("knc-loader--go");
  }

  // Start the animation only once the artwork is decoded, so nothing pops in.
  var decodes = images.map(function (img) {
    return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
  });
  Promise.all(decodes).then(begin, begin);
  setTimeout(begin, 900);

  function loadProgress() {
    if (document.readyState === "complete") return 1;
    if (document.readyState === "interactive") return 0.8;
    return 0.45;
  }

  function setProgress(p) {
    if (p <= progress) return;
    progress = p;
    fill.style.transform = "scaleX(" + p.toFixed(3) + ")";
  }

  function finish() {
    if (finished) return;
    finished = true;
    setProgress(1);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    setTimeout(function () {
      root.classList.add("knc-loader--exit");
      doc.classList.remove("knc-loader-lock");
      setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
        window.dispatchEvent(new Event("knc:loader:done"));
      }, EXIT_MS);
    }, 380);
  }

  var timer = setInterval(function () {
    var now = Date.now();
    var since = started ? now - startedAt : 0;
    // Bar fills with whichever is behind: the animation clock or the real load.
    var timeP = Math.min(1, since / MIN_MS);
    setProgress(Math.min(loadProgress(), timeP * 0.96));

    var ready = document.readyState === "complete";
    if ((ready && started && since >= MIN_MS) || now - shown >= MAX_MS) {
      clearInterval(timer);
      finish();
    }
  }, 100);
})();
