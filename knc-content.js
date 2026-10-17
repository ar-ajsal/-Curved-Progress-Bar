/**
 * KNC Logistics Services — content corrections
 *
 * The site is a Framer export whose copy lives in Framer's hosted bundle, so
 * the delivered HTML is patched at source (see CONTENT_AUDIT.md) and this file
 * keeps the corrections in place after the page hydrates.
 *
 * Source of truth: "KNC Corporate Profile" (KNC Logistics Services, a Foreign
 * Investment Company (LLC), established 2026, headquartered in Riyadh, Saudi
 * Arabia). Claims the profile does not support (statistics, history, partner
 * and investor claims, sample articles) are removed in knc-theme.css; copy that
 * had a profile-backed equivalent is rewritten here using the profile's own
 * wording. Nothing in this file invents a fact.
 */
(function () {
  "use strict";

  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }
  function strip(s) { return (s || "").replace(/\s+/g, ""); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- 1. Exact text replacements (normalised text -> new text) ---------------- */
  var EXACT = {
    // Home
    "Gain absolute peace of mind with 24/7 real-time tracking, providing full transparency from the moment of pickup to the final destination.":
      "Gain peace of mind with visibility at every stage, providing full transparency from the moment of pickup to the final destination.",
    "Our performance-driven fleet takes over, managing everything from container drayage to long-haul trucking with precision.":
      "We own the execution, managing everything from container drayage to long-haul trucking with precision.",
    "Stay informed with 24/7 tracking and automated updates, giving you total transparency over every mile of the journey.":
      "Stay informed with visibility at every stage, giving you total transparency over every mile of the journey.",
    "INVESTORS AND PARTNERS": "WHY KNC",

    // Home solution cards -> capabilities named in the profile
    "Optimized Supply Chain": "End-to-End Supply Chain",
    "We eliminate inefficiencies by synchronizing every stage of your logistics, reducing operational waste and maximizing overall performance.":
      "End-to-end supply chain expertise that simplifies operations and enhances business performance.",
    "End to End Visibility": "Visibility at Every Stage",
    "Scalable Distribution": "Warehousing & Distribution",
    "Our flexible infrastructure grows with your business, offering high-capacity transport solutions that adapt to your changing market demands.":
      "Warehousing and distribution that connect businesses with opportunities locally and globally.",
    "Predictive Routing": "Project Logistics",
    "Leveraging advanced data to anticipate traffic and weather, we ensure your cargo takes the fastest, safest, and most cost-effective path.":
      "Project logistics capability backed by experienced professionals and a strong vendor and subcontractor network.",

    // CTA copy on every page
    "Join hundreds of global enterprises optimizing their journey with KNC.": "Let’s build success together.",
    "Join businesses across Saudi Arabia and the GCC optimizing their supply chain with KNC Logistics Services.": "Let’s build success together.",

    // FAQ answers (template answers replaced with profile-backed ones)
    "Our AI uses predictive analytics and real-time data to optimize routes, preempt delays, and provide dynamic transit adjustments for maximum punctuality.":
      "KNC Logistics Services offers freight forwarding, customs clearance, inland and cross-border transport, project logistics, rental services, event logistics, 4PL services and SABER services.",
    "Yes. Our dashboard provides real-time tracking, live ETAs, shipment status updates, and delivery confirmations for full visibility.":
      "Visibility at every stage is part of how we work. Contact our team for details on how your shipment’s progress is shared.",
    "We operate nationwide with cross-border capabilities, covering ports, industrial zones, warehouses, and major distribution routes.":
      "KNC is headquartered in Riyadh, Kingdom of Saudi Arabia, and offers inland and cross-border transport with local knowledge and global standards.",
    "We use modern vehicles, trained drivers, optimized routing, and strict safety protocols to protect cargo and meet delivery timelines.":
      "Safety is non-negotiable. We own the execution, backed by an experienced team and a strong vendor and subcontractor network.",
    "Simply contact our team with your shipment details, and we will provide a fast, transparent quote tailored to your logistics needs.":
      "Contact our team at hello@knclogistics.com.sa or 0502746895 with your shipment details.",

    // About: timeline replaced by facts and statements from the corporate profile
    "2020. Foundation": "2026. Established",
    "Founded on the principles of precision and innovation, KNC emerged as a response to the evolving needs of modern commerce. What started as a strategic concept has rapidly evolved into a leading logistics force.":
      "KNC Logistics Services is a Foreign Investment Company (LLC), established in 2026 and headquartered in Riyadh, Kingdom of Saudi Arabia.",
    "2022. Technology Integration": "Vision",
    "We introduced digital tracking, automated routing, data-driven planning to modernize our operations.":
      "To become a globally recognized diversified holding group, delivering integrated and innovative solutions across logistics, healthcare, industrial services, trade, and business advisory — creating lasting value for stakeholders and contributing to sustainable economic progress across the markets we serve.",
    "2021. Expansion of Services": "Mission",
    "We expanded into container transport, last mile delivery and warehouse logistics to support growing customer needs.":
      "To deliver integrated, innovative, and value-driven solutions across our diverse portfolio of businesses by fostering excellence, embracing technology, developing exceptional talent, and building strategic partnerships — empowering our clients and creating sustainable value for our stakeholders.",
    "2023. Becoming a Trusted Logistics Partner": "Vision 2030",
    "Today KNC supports leading brands and delivers thousands of shipments with precision and trust.":
      "As Saudi Arabia continues its remarkable transformation under Vision 2030, we are proud to contribute to the Kingdom’s economic diversification by providing world-class logistics, technology, and business solutions that connect businesses with opportunities locally and globally.",

    // Solutions
    "We’re backed by industry experts.": "Experienced professionals.",
    "PREDICTIVE ANALYTICS": "FREIGHT FORWARDING",
    "DIGITAL DOCUMENTATION": "CUSTOMS CLEARANCE",
    "DYNAMIC FLEET ROUTING": "INLAND & CROSS-BORDER TRANSPORT",
    "AUTOMATED COMPLIANCE": "PROJECT LOGISTICS",
    "REAL-TIME VISIBILITY": "4PL SERVICES",
    "KNC brings together our expert team, advanced AI and a performance-driven global fleet to help simplify complex supply chain challenges and deliver freight worldwide.":
      "KNC brings together experienced logistics professionals, technology-driven operations and a strong vendor and subcontractor network to help simplify complex supply chain challenges.",
    "Our integrated platform guarantees full operational control from the initial port clearance stage to the final mile, ensuring execution excellence across all international logistics.":
      "We own the execution, with visibility at every stage from customs clearance to the final mile.",
    "We build resilience into your supply chain using predictive risk modeling and smart systems that anticipate disruptions, ensuring continuity & reliable delivery performance globally.":
      "Safety is non-negotiable. We combine local knowledge with global standards to keep your supply chain reliable.",
    "Global freight demands more than just movement. It demands AI-driven foresight.":
      "Global freight demands more than just movement. It demands visibility at every stage.",
    "At KNC, we dismantle these barriers. By integrating advanced AI insights with a robust global network, we transform fragmented data into actionable intelligence. We move beyond simple transportation to provide a unified platform where complexity is simplified, risks are anticipated, and every shipment becomes a strategic advantage for your business.":
      "At KNC, we offer one partner for complete logistics: freight forwarding, customs clearance, inland and cross-border transport and project logistics under one roof, with technology-driven operations and visibility at every stage.",
    "Modern and Reliable Fleet": "One Partner. Complete Logistics",
    "Fast and Flexible Support": "Right Resources, Right Time",
    "Safety and Compliance": "Safety Is Non-Negotiable",

    // Services overview: four value statements taken from the profile's "Why KNC"
    "Data Driven Intelligence": "One Partner. Complete Logistics",
    "We transform raw data into actionable insights, using AI to eliminate guesswork and optimize every route for maximum efficiency.":
      "Freight forwarding, customs clearance, inland transportation and project logistics under one roof.",
    "Global Network": "Local Knowledge. Global Standards.",
    "Access a massive international infrastructure combined with deep local knowledge to navigate complex regulations.":
      "Rooted in Riyadh, Saudi Arabia and aligned with Vision 2030, connecting businesses with opportunities locally and globally.",
    "Absolute Transparency": "Visibility at Every Stage",
    "Stay in control with real-time tracking and instant reporting, ensuring you have full visibility of your cargo at every second.":
      "Technology-driven operations keep you informed from pickup to delivery.",
    "Scalable Infrastructure": "Right Resources, Right Time",
    "Whether you are a startup or an enterprise, our flexible solutions grow with your business, adapting to your changing market needs.":
      "A strong vendor and subcontractor network and project logistics capability to match the right resources to every job.",

    // Legal pages. The governing-law clause named Singapore (template text); removed until KNC's legal adviser supplies it.
    "6. GOVERNING LAW AND DISPUTE RESOLUTION": "",
    "7. AMENDMENTS": "6. AMENDMENTS",
    "Our Terms Cookie": "Our Terms"
  };

  /* ---------------- 2. Pattern clean-ups (regex on a text node's value) ---------------- */
  var PATTERNS = [
    [/^\s*These Terms shall be governed by and construed in accordance with the laws of Singapore[^]*$/, ""],
    // Template typos
    [/^(\s*)We delivers\b/, "$1We deliver"],
    // Legal pages: text pasted from an unrelated job advertisement and layout notes
    [/\s*\[Clone word count for layout:[^\]]*\]/g, ""],
    [/\s*Required Qualifications:[^]*?(?=You are granted|$)/, " "],
    [/\s*Desirable Qualifications:[^]*$/, ""],
    [/\s*Working at KNC Logistics Services At Aurora,[^]*$/, ""],
    [/\s*Commitment to Inclusion:[^]*$/, ""],
    [/^At KNC Logistics Services, we tackle complex logistics challenges alongside our dedicated team[^.]*\.\s*For the latest news from KNC Logistics Services, visit our website or follow us on LinkedIn\.\s*/, ""],
    [/\s*Working at KNC Logistics Services is an opportunity to operate with integrity[^]*?Newsroom\.\s*/, " "],
    [/^KNC Logistics Services considers candidates without regard to[^.]*\.\s*/, ""],
    [/^KNC Logistics Services hires talented professionals who are ready to help build[^.]*\.\s*/, ""],
    [/^KNC Logistics Services is committed to delivering innovative and value-driven logistics solutions safely, quickly, and broadly\. We strive to create a new era in mobility and logistics, one that will bring a safer, more efficient, and more accessible future to everyone\./,
      "KNC Logistics Services is committed to delivering innovative, reliable, and value-driven business solutions."]
  ];

  /* ---------------- 2b. Whole-paragraph replacements (text split over several nodes) ---------------- */
  var BLOCKS = {
    "Our global fleet is powered by IoT sensors, delivering consistent performance, predictive maintenance, and efficiency on every route from port to customer.":
      "Freight forwarding, customs clearance, inland and cross-border transport and project logistics under one roof.",
    "We utilize AI-driven systems and expert personnel to provide 24/7 proactive support, ensuring flexible adaptation to complex international shipping.":
      "Experienced professionals and a strong vendor and subcontractor network, matched to every job.",
    "Our commitment to safety is enforced by automated compliance checks and real-time risk assessment, guaranteeing adherence to all international trade codes and zero tolerance.":
      "We own the execution, with safety built into every stage of the job."
  };

  /* Paragraphs identified by a distinctive phrase (the template's original wording). */
  var PARTIAL = [
    ["unifies human expertise, AI-powered systems", "KNC Logistics Services unifies human expertise, technology-driven systems, and a capable fleet to help businesses simplify complex supply chain operations and deliver with confidence."],
    ["integrates our expert teams, cutting-edge technology", "KNC Logistics Services integrates expert teams, reliable technology, and a strong vendor network to help businesses navigate complex supply chains and achieve on-time delivery."],
    ["powerful data platforms, and a resilient fleet", "KNC Logistics Services combines dedicated personnel, proven logistics platforms, and a resilient network to empower businesses with end-to-end visibility and control across the supply chain."]
  ];

  /* ---------------- 3. Statements built from word-reveal components ---------------- */
  var STATEMENTS = [
    { start: "KNCbringstogetherpeople", text: "KNC brings together experienced logistics professionals, technology-driven operations and a strong vendor and subcontractor network to deliver complete, end-to-end supply chain solutions." },
    { start: "KNCcollaborateswithmanufacturers", text: "We establish strong and lasting relationships with clients and partners through transparency and professionalism." },
    { start: "KNCexiststomakelogistics", text: "Since our inception, we have been committed to delivering innovative, reliable, and value-driven business solutions that empower organizations to achieve operational excellence and sustainable growth." }
  ];

  /* ---------------- 4. Headings made of per-letter spans ---------------- */
  var HEADINGS = [
    { start: "Tracingourpathofrelentlessinnovation", text: "Our direction and purpose" },
    { start: "We’rebackedbyindustryexperts", text: "Experienced professionals." }
  ];

  function rewriteTextNodes() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName)) continue;
      var raw = n.nodeValue;
      if (!raw || raw.length < 4) continue;
      var key = norm(raw);
      if (Object.prototype.hasOwnProperty.call(EXACT, key)) {
        n.nodeValue = EXACT[key];
        continue;
      }
      var v = raw;
      for (var i = 0; i < PATTERNS.length; i++) v = v.replace(PATTERNS[i][0], PATTERNS[i][1]);
      if (v !== raw) n.nodeValue = v.replace(/\s{2,}/g, " ");
    }
  }

  // The primary heading on the About page had a typo ("MORDEN").
  function fixTypos() {
    qa("h1").forEach(function (h) {
      if (strip(h.textContent).indexOf("MORDEN") === -1) return;
      var leaves = [];
      var w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      var n;
      while ((n = w.nextNode())) if (n.nodeValue.trim()) leaves.push(n);
      for (var i = 0; i + 5 < leaves.length; i++) {
        var seq = leaves.slice(i, i + 6).map(function (x) { return x.nodeValue.trim(); }).join("");
        if (seq === "MORDEN") {
          var fix = ["M", "O", "D", "E", "R", "N"];
          for (var k = 0; k < 6; k++) leaves[i + k].nodeValue = fix[k];
          h.setAttribute("aria-label", "Building the future of modern logistics.");
          break;
        }
      }
    });
    qa("[aria-label]").forEach(function (e) {
      if (/morden/i.test(e.getAttribute("aria-label"))) e.setAttribute("aria-label", e.getAttribute("aria-label").replace(/morden/gi, "modern"));
    });
  }

  function replaceBlocks() {
    qa("p,h1,h2,h3,h4,h5,h6").forEach(function (el) {
      if (el.hasAttribute("data-knc-replaced") || el.hasAttribute("data-knc-replacement")) return;
      var t = norm(el.textContent);
      if (t.length < 40) return;
      var text = Object.prototype.hasOwnProperty.call(BLOCKS, t) ? BLOCKS[t] : null;
      if (!text) for (var i = 0; i < PARTIAL.length; i++) if (t.indexOf(PARTIAL[i][0]) !== -1) { text = PARTIAL[i][1]; break; }
      if (!text) return;
      var c = document.createElement(el.tagName);
      c.className = el.className;
      ["data-styles-preset", "dir", "style"].forEach(function (a) { if (el.getAttribute(a)) c.setAttribute(a, el.getAttribute(a)); });
      c.setAttribute("data-knc-replacement", "true");
      c.textContent = text;
      hideOriginal(el);
      el.parentNode.insertBefore(c, el.nextSibling);
    });
  }

  function hideOriginal(el) {
    el.setAttribute("data-knc-replaced", "true");
    el.style.setProperty("display", "none", "important");
  }

  function replaceStatements() {
    var lines = qa(".line");
    var roots = [];
    lines.forEach(function (l) {
      var root = l.closest('[class*="-container"]');
      if (root && roots.indexOf(root) === -1) roots.push(root);
    });
    roots.forEach(function (root) {
      if (root.hasAttribute("data-knc-replaced")) return;
      var s = strip(root.textContent);
      for (var i = 0; i < STATEMENTS.length; i++) {
        if (s.indexOf(STATEMENTS[i].start) === 0) {
          var first = root.querySelector(".word") || root;
          var cs = getComputedStyle(first);
          var p = document.createElement("p");
          p.className = "knc-statement knc-lead";
          p.setAttribute("data-knc-replacement", "true");
          p.style.color = cs.color;
          p.style.textAlign = getComputedStyle(root.querySelector(".line") || root).textAlign || "left";
          STATEMENTS[i].text.split(" ").forEach(function (word, idx) {
            var sp = document.createElement("span");
            sp.className = "kw";
            sp.style.setProperty("--wi", idx);
            sp.textContent = word + " ";
            p.appendChild(sp);
          });
          hideOriginal(root);
          root.parentNode.insertBefore(p, root.nextSibling);
          if (io) io.observe(p);
          break;
        }
      }
    });
  }

  function replaceHeadings() {
    qa("h1,h2,h3,h4,h5,h6").forEach(function (h) {
      if (h.hasAttribute("data-knc-replaced") || h.hasAttribute("data-knc-replacement")) return;
      var s = strip(h.textContent);
      for (var i = 0; i < HEADINGS.length; i++) {
        if (s.indexOf(HEADINGS[i].start) === 0) {
          var c = document.createElement(h.tagName);
          c.className = h.className;
          ["data-styles-preset", "dir"].forEach(function (a) { if (h.getAttribute(a)) c.setAttribute(a, h.getAttribute(a)); });
          c.setAttribute("data-knc-replacement", "true");
          c.textContent = HEADINGS[i].text;
          hideOriginal(h);
          h.parentNode.insertBefore(c, h.nextSibling);
        }
      }
    });
  }

  /* ---------------- 5. Links ---------------- */
  var MAPS = "https://www.google.com/maps/search/?api=1&query=Riyadh%2C%20Saudi%20Arabia";
  function fixLinks() {
    qa('a[href^="tel:"]').forEach(function (a) {
      if (a.getAttribute("href") !== "tel:+966502746895") a.setAttribute("href", "tel:+966502746895");
    });
    qa('a[href*="google.com/maps"]').forEach(function (a) {
      if (a.getAttribute("href") !== MAPS) { a.setAttribute("href", MAPS); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    });
    // The credit line pointed at the template author's Framer profile.
    qa('a[href*="framer.com/@sang"], a[href*="createwithsang"]').forEach(function (a) {
      a.removeAttribute("href");
      a.style.cursor = "default";
    });
  }

  /* ---------------- 6. Reveal for replaced statements ---------------- */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("knc-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
  }

  var queued = false;
  function run() {
    queued = false;
    rewriteTextNodes();
    fixTypos();
    replaceStatements();
    replaceHeadings();
    replaceBlocks();
    fixLinks();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(run, 120);
  }

  function boot() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
