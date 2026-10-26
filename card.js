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
    var s = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
    var t = document.createElement("span");
    t.innerHTML = s;
    return t.firstChild;
  }
  var ICON = {
    save: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 8.8c.3 2.6 2.7 5 5.3 5.4l1.2-1.1-1.7-1-.8.6a4 4 0 0 1-1.9-1.9l.6-.8-1-1.7z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6 10-6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
  };

  function link(href, cls, newTab) {
    var a = el("a", cls);
    a.href = href;
    if (newTab) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }

  /* ---------- build ---------- */
  var bars = el("div", "bars");
  for (var i = 0; i < 4; i++) bars.appendChild(el("i"));

  var body = el("div", "card-body");

  var logo = el("img", "logo");
  logo.src = r.logo; logo.alt = "KNC Logistics Services"; logo.width = 187; logo.height = 46;
  body.appendChild(logo);

  var avatar = el("div", "avatar");
  if (r.photo) {
    var img = el("img");
    img.src = r.photo; img.alt = r.fullName; img.width = 132; img.height = 132;
    img.addEventListener("error", function () { avatar.textContent = r.initials; });
    avatar.appendChild(img);
  } else {
    avatar.textContent = r.initials;
  }
  body.appendChild(avatar);

  body.appendChild(el("h1", "name", r.fullName));
  var role = el("p", "role");
  if (r.designation) role.textContent = r.designation;
  else role.appendChild(el("span", "ph", "Designation to be added"));
  body.appendChild(role);
  body.appendChild(el("p", "org", r.company));

  /* Save contact: real file from the server (right content-type for iOS/Android contacts);
     if the server route is unavailable, fall back to a vCard built in the browser. */
  var save = link("/" + r.key + ".vcf", "save");
  save.setAttribute("download", r.vcfName);
  save.appendChild(svg(ICON.save));
  save.appendChild(el("span", null, "Save contact"));
  body.appendChild(save);
  body.appendChild(el("p", "save-note", "Adds " + r.fullName + " to your phone contacts"));

  var vc = core.buildVCard(r.key);
  if (window.fetch && vc) {
    fetch(save.href, { method: "HEAD" }).then(function (res) {
      if (!res.ok) throw new Error("no server vcf");
    }).catch(function () {
      try { save.href = URL.createObjectURL(new Blob([vc], { type: "text/vcard;charset=utf-8" })); } catch (e) { /* keep link */ }
    });
  }

  /* secondary actions */
  var actions = el("div", "actions");
  function act(label, icon, href, newTab) {
    if (!href) return;
    var a = link(href, "act", newTab);
    a.appendChild(svg(icon));
    a.appendChild(el("span", null, label));
    actions.appendChild(a);
  }
  act("Call", ICON.phone, r.phone ? "tel:" + r.phone : null);
  act("WhatsApp", ICON.whatsapp, r.whatsapp ? "https://wa.me/" + r.whatsapp : null, true);
  act("Email", ICON.mail, r.email ? "mailto:" + r.email : null);
  act("Website", ICON.globe, r.website, true);
  act("Location", ICON.pin, r.mapsUrl, true);
  body.appendChild(actions);

  /* contact details */
  var list = el("ul", "details");
  function row(label, note, icon, value, href, newTab) {
    if (!value) return;
    var li = el("li", "row");
    var host = href ? link(href, null, newTab) : el("div", "r");
    var ico = el("span", "ico"); ico.appendChild(svg(icon));
    var txt = el("span", "txt");
    var lab = el("span", "lab", label);
    if (note) { lab.appendChild(document.createTextNode(" ")); lab.appendChild(el("em", null, "· " + note)); }
    txt.appendChild(lab);
    txt.appendChild(el("span", "val", value));
    host.appendChild(ico); host.appendChild(txt);
    li.appendChild(host); list.appendChild(li);
  }
  row("Phone", r.phoneFromCompany ? "Company line" : "", ICON.phone, r.phoneDisplay, r.phone ? "tel:" + r.phone : null);
  row("Email", r.emailFromCompany ? "Company" : "", ICON.mail, r.email, r.email ? "mailto:" + r.email : null);
  row("Website", "", ICON.globe, r.websiteDisplay, r.website, true);
  row("Address", "", ICON.pin, r.addressText, r.mapsUrl, true);
  body.appendChild(list);

  var foot = el("div", "foot");
  var b = el("b", null, r.company);
  foot.appendChild(b);

  root.textContent = "";
  root.appendChild(bars);
  root.appendChild(body);
  root.appendChild(foot);
})();
