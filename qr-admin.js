/* KNC digital card QR generator — builds QR codes that point at /afzal, /nisar, /arun */
(function () {
  "use strict";
  var core = window.KNC_CORE, QR = window.QRCode;
  var grid = document.getElementById("grid");
  var baseInput = document.getElementById("base");
  var sizeSel = document.getElementById("size");
  var msg = document.getElementById("msg");
  var missUl = document.getElementById("miss");

  var QR_OPTS = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#0a1240", light: "#ffffff" } };

  function say(text, cls) { msg.textContent = text || ""; msg.className = "msg" + (cls ? " " + cls : ""); }

  /* Validate the base URL: must be http(s); https required unless localhost. */
  function readBase() {
    var raw = (baseInput.value || "").trim();
    if (!raw) { say("Enter the website address first.", "err"); return null; }
    var u = core.cleanUrl(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
    if (!u) { say("That is not a valid web address.", "err"); return null; }
    var url = new URL(u);
    if (url.search || url.hash || (url.pathname && url.pathname !== "/")) { say("Use only the domain (no path, query or #), e.g. https://your-domain.com", "err"); return null; }
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname);
    if (url.protocol !== "https:" && !local) { say("Use https:// for printed codes.", "err"); return null; }
    say(local ? "Local address: fine for testing, but replace it with the production domain before printing." : "Codes will open " + url.origin + "/<name>", local ? "err" : "ok");
    return url.origin;
  }

  function cardUrl(base, key) { return base + "/" + key; }

  function download(href, name) {
    var a = document.createElement("a");
    a.href = href; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }
  function fileBase(key) { return "KNC-QR-" + core.resolve(key).vcfName.replace(/\.vcf$/, ""); }

  function svgFor(url) {
    return QR.toString(url, Object.assign({ type: "svg" }, QR_OPTS));
  }
  function pngFor(url) {
    return QR.toDataURL(url, Object.assign({ type: "image/png", width: parseInt(sizeSel.value, 10) || 2048 }, QR_OPTS));
  }
  function downloadPng(key, base) {
    return pngFor(cardUrl(base, key)).then(function (d) { download(d, fileBase(key) + "-" + sizeSel.value + ".png"); });
  }
  function downloadSvg(key, base) {
    return svgFor(cardUrl(base, key)).then(function (s) {
      var blob = new Blob([s], { type: "image/svg+xml" });
      var href = URL.createObjectURL(blob);
      download(href, fileBase(key) + ".svg");
      setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
    });
  }

  /* ---------- UI ---------- */
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  var cards = {};
  core.keys().forEach(function (key) {
    var r = core.resolve(key);
    var box = el("section", "q");
    box.appendChild(el("h2", null, r.fullName));
    var url = el("p", "url");
    var qr = el("div", "qr");
    var btns = el("div", "btns");
    var png = el("button", "b", "PNG"); png.type = "button";
    var svgb = el("button", "b alt", "SVG"); svgb.type = "button";
    var open = el("a", "b alt", "Open card"); open.target = "_blank"; open.rel = "noopener";
    open.style.gridColumn = "1 / -1";
    btns.appendChild(png); btns.appendChild(svgb); btns.appendChild(open);
    box.appendChild(qr); box.appendChild(url); box.appendChild(btns);
    grid.appendChild(box);
    cards[key] = { url: url, qr: qr, open: open };
    png.addEventListener("click", function () { var b = readBase(); if (b) downloadPng(key, b); });
    svgb.addEventListener("click", function () { var b = readBase(); if (b) downloadSvg(key, b); });
  });

  function render() {
    var base = readBase();
    core.keys().forEach(function (key) {
      var c = cards[key];
      if (!base) { c.qr.textContent = ""; c.url.textContent = ""; c.open.removeAttribute("href"); return; }
      var u = cardUrl(base, key);
      c.url.textContent = u;
      c.open.href = u;
      svgFor(u).then(function (s) {
        // The SVG string comes from the QR library (numbers and path data only).
        c.qr.innerHTML = s;
        var node = c.qr.firstChild; if (node && node.setAttribute) { node.setAttribute("role", "img"); node.setAttribute("aria-label", "QR code for " + u); }
      });
    });
  }

  document.getElementById("all-png").addEventListener("click", function () {
    var b = readBase(); if (!b) return;
    core.keys().reduce(function (p, k) { return p.then(function () { return downloadPng(k, b); }).then(function () { return new Promise(function (r) { setTimeout(r, 400); }); }); }, Promise.resolve());
  });
  document.getElementById("all-svg").addEventListener("click", function () {
    var b = readBase(); if (!b) return;
    core.keys().reduce(function (p, k) { return p.then(function () { return downloadSvg(k, b); }).then(function () { return new Promise(function (r) { setTimeout(r, 400); }); }); }, Promise.resolve());
  });

  baseInput.value = /^https?:$/.test(location.protocol) ? location.origin : "";
  baseInput.addEventListener("input", render);
  render();

  /* ---------- missing information ---------- */
  core.keys().forEach(function (key) {
    var r = core.resolve(key);
    var li = el("li");
    var b = el("b", null, r.fullName + ": ");
    li.appendChild(b);
    li.appendChild(document.createTextNode(r.missing.length ? r.missing.join(", ") : "nothing missing"));
    missUl.appendChild(li);
  });
  var note = el("li");
  note.appendChild(el("b", null, "Company: "));
  note.appendChild(document.createTextNode("final production website address (edit cards-data.js). Until personal phone numbers and e-mail addresses are added, the cards show the company line and company e-mail."));
  missUl.appendChild(note);
})();
