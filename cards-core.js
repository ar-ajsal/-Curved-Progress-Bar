/**
 * KNC digital business cards — shared logic (runs in Node and in the browser).
 * Reads cards-data.js. Contains NO personal data of its own.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./cards-data.js"));
  else root.KNC_CORE = factory(root.KNC_CARDS);
})(typeof self !== "undefined" ? self : this, function (DATA) {
  "use strict";

  var company = DATA.company;
  var members = DATA.members;

  /* ---------------- validation ---------------- */
  function cleanPhone(v) {
    if (v == null) return null;
    var s = String(v).replace(/[\s().-]/g, "");
    return /^\+?[0-9]{7,15}$/.test(s) ? s : null;
  }
  function cleanEmail(v) {
    if (v == null) return null;
    var s = String(v).trim();
    return /^[^\s@<>"'`;,]+@[^\s@<>"'`;,]+\.[^\s@<>"'`;,]{2,}$/.test(s) && s.length <= 254 ? s : null;
  }
  function cleanUrl(v) {
    if (v == null) return null;
    try {
      var u = new URL(String(v).trim());
      return u.protocol === "https:" || u.protocol === "http:" ? u.href.replace(/\/$/, "") : null;
    } catch (e) { return null; }
  }
  function cleanSlug(v) { return /^[a-z0-9-]{1,40}$/.test(String(v || "")) ? String(v) : null; }

  /* ---------------- display helpers ---------------- */
  function formatPhone(p) {
    if (!p) return "";
    var m = /^\+966(\d{2})(\d{3})(\d{4})$/.exec(p);
    return m ? "+966 " + m[1] + " " + m[2] + " " + m[3] : p;
  }
  function fullName(n) {
    return [n.prefix, n.given, n.family].filter(Boolean).join(" ");
  }
  function initials(n) {
    return ((n.given || "").charAt(0) + (n.family || "").charAt(0)).toUpperCase();
  }
  function addressText(a) {
    return [a.street, a.city, a.region, a.postalCode, a.country].filter(Boolean).join(", ");
  }
  function fileName(m) {
    return (fullName(m.name).replace(/^Dr\.?\s+/i, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || m.key) + ".vcf";
  }

  /* ---------------- resolve a member against company fallbacks ---------------- */
  function resolve(key) {
    key = cleanSlug(key);
    var m = key && Object.prototype.hasOwnProperty.call(members, key) ? members[key] : null;
    if (!m) return null;

    var ownPhone = cleanPhone(m.phone), coPhone = cleanPhone(company.phone);
    var ownEmail = cleanEmail(m.email), coEmail = cleanEmail(company.email);
    var ownWa = cleanPhone(m.whatsapp) || ownPhone;
    var site = cleanUrl(company.website);
    var phone = ownPhone || coPhone;
    var email = ownEmail || coEmail;
    var wa = ownWa || coPhone;

    var missing = [];
    if (!m.designation) missing.push("designation");
    if (!ownPhone) missing.push("personal phone");
    if (!ownEmail) missing.push("personal email");
    if (!m.whatsapp && !ownPhone) missing.push("WhatsApp number");
    if (!m.photo) missing.push("photo");
    if (!company.address.street) missing.push("street address");
    if (!company.address.postalCode) missing.push("postal code");

    return {
      key: m.key,
      member: m,
      fullName: fullName(m.name),
      initials: initials(m.name),
      designation: m.designation || null,
      company: company.name,
      photo: m.photo || null,
      phone: phone, phoneFromCompany: !ownPhone, phoneDisplay: formatPhone(phone),
      email: email, emailFromCompany: !ownEmail,
      whatsapp: wa ? wa.replace(/^\+/, "") : null,
      website: site, websiteDisplay: site ? site.replace(/^https?:\/\//, "") : null,
      address: company.address, addressText: addressText(company.address),
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(company.mapsQuery || addressText(company.address)),
      logo: company.logo,
      vcfName: fileName(m),
      missing: missing
    };
  }

  /* ---------------- vCard 3.0 ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
  }
  function fold(line) {
    // RFC 2425/6350: lines longer than 75 octets are folded with CRLF + one space.
    var out = [], cur = "", bytes = 0, limit = 75;
    for (var i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      var b = unescape(encodeURIComponent(ch)).length;
      if (bytes + b > limit) { out.push(cur); cur = " "; bytes = 1; limit = 75; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join("\r\n");
  }
  function buildVCard(key) {
    var r = resolve(key);
    if (!r) return null;
    var n = r.member.name, a = r.address;
    var coPhone = cleanPhone(company.phone), coEmail = cleanEmail(company.email);
    var ownPhone = cleanPhone(r.member.phone), ownEmail = cleanEmail(r.member.email);
    var L = [];
    L.push("BEGIN:VCARD");
    L.push("VERSION:3.0");
    L.push("PRODID:-//KNC Logistics Services//Digital Card//EN");
    L.push("N:" + [esc(n.family), esc(n.given), "", esc(n.prefix), ""].join(";"));
    L.push("FN:" + esc(r.fullName));
    L.push("ORG:" + esc(r.company));
    if (r.designation) L.push("TITLE:" + esc(r.designation));
    if (ownPhone) L.push("TEL;TYPE=CELL,VOICE:" + ownPhone);
    if (coPhone && coPhone !== ownPhone) L.push("TEL;TYPE=WORK,VOICE:" + coPhone);
    if (ownEmail) L.push("EMAIL;TYPE=INTERNET,WORK:" + ownEmail);
    if (coEmail && coEmail !== ownEmail) L.push("EMAIL;TYPE=INTERNET,WORK:" + coEmail);
    if (r.website) L.push("URL:" + r.website);
    L.push("ADR;TYPE=WORK:" + ["", "", esc(a.street), esc(a.city), esc(a.region), esc(a.postalCode), esc(a.country)].join(";"));
    L.push("END:VCARD");
    return L.map(fold).join("\r\n") + "\r\n";
  }

  return {
    company: company, members: members,
    cleanPhone: cleanPhone, cleanEmail: cleanEmail, cleanUrl: cleanUrl, cleanSlug: cleanSlug,
    resolve: resolve, buildVCard: buildVCard, fileName: fileName,
    keys: function () { return Object.keys(members); }
  };
});
