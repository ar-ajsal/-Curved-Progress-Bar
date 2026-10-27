/* KNC digital business card — renders one person's card from cards-data.js */
(function () {
  "use strict";
  var core = window.KNC_CORE;
  var root = document.getElementById("card");
  if (!core || !root) return;

  var key = root.getAttribute("data-member");
  var r = core.resolve(key);
  if (!r) { root.textContent = "Card not found."; return; }

  /* ---------- tiny DOM helpers (all dynamic text goes through textContent) ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(path) {
    var t = document.createElement("span");
    t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
    return t.firstChild;
  }
  var ICON = {
    save: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 8.8c.3 2.6 2.7 5 5.3 5.4l1.2-1.1-1.7-1-.8.6a4 4 0 0 1-1.9-1.9l.6-.8-1-1.7z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6 10-6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    go: '<path d="m9 18 6-6-6-6"/>'
  };

  function link(href, cls, newTab) {
    var a = el("a", cls);
    a.href = href;
    if (newTab) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }
  var step = 0;
  function rise(node) { node.classList.add("rise"); node.style.setProperty("--i", String(step++)); return node; }

  var toastEl = el("div", "toast");
  toastEl.setAttribute("role", "status");
  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------- header ---------- */
  var hero = el("div", "hero");
  var bars = el("div", "bars");
  for (var i = 0; i < 4; i++) bars.appendChild(el("i"));
  hero.appendChild(bars);
  var chev = el("div", "chev");
  for (var c = 0; c < 4; c++) chev.appendChild(el("i"));
  hero.appendChild(chev);
  var logo = el("img", "logo");
  logo.src = r.logoLight; logo.alt = "KNC Logistics Services"; logo.width = 138; logo.height = 44;
  hero.appendChild(logo);

  /* ---------- identity ---------- */
  var ident = el("div", "ident");
  var ring = el("div", "ring");
  var avatar = el("div", "avatar");
  if (r.photo) {
    var img = el("img");
    img.src = r.photo; img.alt = r.fullName; img.width = 156; img.height = 156;
    img.addEventListener("error", function () { avatar.textContent = r.initials; });
    avatar.appendChild(img);
  } else {
    avatar.textContent = r.initials;
  }
  ring.appendChild(avatar);
  ident.appendChild(rise(ring));
  ident.appendChild(rise(el("h1", "name", r.fullName)));
  var role = el("p", "role");
  if (r.designation) role.textContent = r.designation;
  else role.appendChild(el("span", "ph", "Designation to be added"));
  ident.appendChild(rise(role));
  ident.appendChild(rise(el("p", "org", r.company)));

  /* ---------- Save contact ----------
     A normal link to the server's .vcf (inline, text/vcard): iPhones open the "Add contact" sheet straight away,
     Android downloads it and offers to open it in Contacts. If the server route is unavailable the page builds
     the same vCard in the browser instead. */
  var saveWrap = el("div", "save-wrap");
  var save = link("/" + r.key + ".vcf", "save");
  var chip = el("span", "chip"); chip.appendChild(svg(ICON.save));
  save.appendChild(chip);
  save.appendChild(el("span", null, "Save contact"));
  saveWrap.appendChild(save);
  saveWrap.appendChild(el("p", "save-note", "Opens in your phone’s Contacts app"));
  rise(saveWrap);

  var vc = core.buildVCard(r.key);
  if (window.fetch && vc) {
    fetch(save.href, { method: "HEAD" }).then(function (res) {
      if (!res.ok) throw new Error("no server vcf");
    }).catch(function () {
      try {
        save.href = URL.createObjectURL(new Blob([vc], { type: "text/vcard;charset=utf-8" }));
        save.setAttribute("download", r.vcfName);
      } catch (e) { /* keep link */ }
    });
  }

  /* ---------- quick actions ---------- */
  var actions = el("div", "actions");
  function act(cls, label, icon, href, newTab) {
    if (!href) return null;
    var a = link(href, "act " + cls, newTab);
    var ic = el("span", "ic"); ic.appendChild(svg(icon));
    a.appendChild(ic);
    a.appendChild(el("span", null, label));
    actions.appendChild(a);
    return a;
  }
  act("c-call", "Call", ICON.phone, r.phone ? "tel:" + r.phone : null);
  act("c-wa", "WhatsApp", ICON.whatsapp, r.whatsapp ? "https://wa.me/" + r.whatsapp : null, true);
  act("c-mail", "Email", ICON.mail, r.email ? "mailto:" + r.email : null);
  act("c-map", "Location", ICON.pin, r.mapsUrl, true);
  // Share: native share sheet when available, otherwise copy the link
  var pageUrl = location.origin + "/" + r.key;
  var shareBtn = el("button", "act c-share");
  shareBtn.type = "button";
  var sic = el("span", "ic"); sic.appendChild(svg(ICON.share));
  shareBtn.appendChild(sic); shareBtn.appendChild(el("span", null, "Share"));
  shareBtn.addEventListener("click", function () {
    var data = { title: r.fullName + " – " + r.company, text: r.fullName + ", " + (r.designation || r.company), url: pageUrl };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pageUrl).then(function () { toast("Link copied"); }, function () { toast(pageUrl); });
    } else { toast(pageUrl); }
  });
  actions.appendChild(shareBtn);
  rise(actions);

  /* ---------- details ---------- */
  var sect = rise(el("div", "sect", "Contact"));
  var list = el("ul", "details");
  function row(label, note, icon, valueLines, href, newTab) {
    if (!valueLines || !valueLines.length) return;
    var li = el("li", "row");
    var host = href ? link(href, null, newTab) : el("div", "r");
    var ico = el("span", "ico"); ico.appendChild(svg(icon));
    var txt = el("span", "txt");
    var lab = el("span", "lab", label);
    if (note) { lab.appendChild(document.createTextNode(" ")); lab.appendChild(el("em", null, "· " + note)); }
    txt.appendChild(lab);
    var val = el("span", "val");
    var first = valueLines[0];
    var at = first.indexOf("@");
    if (at > 0) { // e-mail: allow a line break only after the @
      val.appendChild(document.createTextNode(first.slice(0, at + 1)));
      val.appendChild(document.createElement("wbr"));
      val.appendChild(document.createTextNode(first.slice(at + 1)));
    } else { val.textContent = first; }
    for (var k = 1; k < valueLines.length; k++) val.appendChild(el("small", null, valueLines[k]));
    txt.appendChild(val);
    host.appendChild(ico); host.appendChild(txt);
    if (href) host.appendChild(svg(ICON.go)).setAttribute("class", "go");
    li.appendChild(host); list.appendChild(li);
  }
  row("Mobile", r.phoneFromCompany ? "Company line" : "", ICON.phone, [r.phoneDisplay], r.phone ? "tel:" + r.phone : null);
  row("Email", r.emailFromCompany ? "Company" : "", ICON.mail, [r.email], r.email ? "mailto:" + r.email : null);
  row("Website", "", ICON.globe, [r.websiteDisplay], r.website, true);
  row("Office", "", ICON.pin, r.addressLines, r.mapsUrl, true);
  rise(list);

  /* ---------- share QR (drawn in the browser) ---------- */
  var share = el("div", "share");
  var qr = el("div", "qr");
  var shText = el("div");
  shText.appendChild(el("h2", null, "Scan to share"));
  shText.appendChild(el("p", null, "Point a phone camera at this code to open " + r.fullName + "’s card."));
  share.appendChild(qr); share.appendChild(shText);
  rise(share);
  if (window.QRCode && QRCode.toString) {
    QRCode.toString(pageUrl, { type: "svg", errorCorrectionLevel: "H", margin: 0, color: { dark: "#0a1240", light: "#ffffff" } }).then(function (s) {
      qr.innerHTML = s; // markup generated by the QR library (paths only)
      var n = qr.firstChild; if (n && n.setAttribute) { n.setAttribute("role", "img"); n.setAttribute("aria-label", "QR code for " + pageUrl); }
    }).catch(function () { share.style.display = "none"; });
  } else { share.style.display = "none"; }

  /* ---------- footer ---------- */
  var foot = el("div", "foot");
  var fb = el("div", "fb");
  for (var f = 0; f < 4; f++) fb.appendChild(el("i"));
  foot.appendChild(fb);
  foot.appendChild(el("b", null, r.company));
  foot.appendChild(el("span", null, "Riyadh, Kingdom of Saudi Arabia"));

  root.textContent = "";
  root.appendChild(hero);
  root.appendChild(ident);
  root.appendChild(saveWrap);
  root.appendChild(actions);
  root.appendChild(sect);
  root.appendChild(list);
  root.appendChild(share);
  root.appendChild(foot);
  root.appendChild(toastEl);
})();
