# KNC Logistics Services — website content audit

**Source of truth:** *KNC Corporate Profile* (7 pages). Facts it supports: KNC Logistics Services is a
Foreign Investment Company (LLC), **established in 2026**, headquartered in **Riyadh, Kingdom of Saudi
Arabia**; services are freight forwarding, customs clearance, inland and cross-border transport, project
logistics, rental services, event logistics, 4PL services and SABER services; "Why KNC": one partner /
complete logistics, we own the execution, right resources right time, local knowledge / global standards,
visibility at every stage, safety is non-negotiable, long-term relationships; contact 0502746895, Riyadh.
The e-mail address `hello@knclogistics.com.sa` was given by the site owner.

The site is a Framer export (copy lives in Framer's hosted bundle). Corrections are therefore applied in
both places: **in the delivered HTML** (so the source, crawlers and no-JS views are clean) and by
`knc-content.js` / `knc-theme.css` (so they stay in place after the page hydrates).

## 1. Removed — not supported by the profile

| Page | Claim | Action |
|---|---|---|
| Home | "1.2M+ miles driven annually", "98% on-time delivery", "24/7 dedicated support" | removed |
| Home | "Successful deliveries — over 145,000 shipments", vehicle spec / elite operators (100%, 500+ hours) / eco-fleet / cargo-safety claims | section removed |
| Home | "Investors and partners … across Vietnam and Southeast Asia", "200+ partners" | replaced by the profile's "Building long-term relationships" statement |
| Home | five sample blog articles (Insights) | section removed |
| Home / every page | "Join hundreds of global enterprises…" (and "businesses across Saudi Arabia and the GCC") | replaced with "Let's build success together." (profile) |
| About | timeline "2020 Foundation / 2021 / 2022 / 2023" (the company was established in 2026) | replaced by 2026 Established, Vision, Mission, Vision 2030 (profile) |
| About | "Recognition and Impact" (1100+ shipments, 200+ clients, 50+ trucks, industries served) | section removed |
| About / Solutions / Services | "Trusted by leading brands / strong backers / Trusted by Businesses Nationwide" + a named testimonial ("Marcus Sterling") | sections removed |
| About | "Meet the founder" quote | section removed |
| Solutions | "90% of logistics disruptions can be avoided with predictive analytics" | removed |
| Service pages (5) | per-service performance metrics (99.5 %, 15 % fuel, 40 %, 48 %, 99.9 %, 30 %, 99.8 %, 60M, 100 %, 25 % …) | removed (also from the embedded page data) |
| Footer | social links to unrelated accounts (`x.com/createwithsang`, generic youtube/linkedin/instagram) | column removed until KNC's accounts are supplied |
| Footer | "Made by Cyberthic" linked to the template author's Framer profile | link removed, text kept |
| Contact | phone link dialled `+453589432285` (template number) | now `tel:+966502746895` |
| Contact | map link to the Google Maps home page | now a Riyadh search |
| Legal | job-advertisement text from an unrelated company ("Aurora", Houdini, a $150,000–$240,000 salary range) and leaked "[Clone word count for layout…]" notes | removed |
| `<head>` | `canonical` pointed to `himon.framer.website`; `og:url` pointed to another domain | removed (set once the production domain is final) |
| `<head>` | social-share image was the template's "HIMON Logistics & Transport Website Template" graphic with a UPS truck | replaced with a KNC logo card (`og-image.png`) |

## 2. Rewritten using the profile's own wording

* Solution cards → End-to-End Supply Chain, Visibility at Every Stage, Warehousing & Distribution, Project Logistics.
* "How we work" steps: "performance-driven fleet" → "We own the execution"; "24/7 tracking" → "visibility at every stage".
* Solutions page: ticker (now the profile's services), "backed by industry experts" → "Experienced professionals.",
  three capability paragraphs, "Why choose us" titles.
* Services overview: four value statements from "Why KNC".
* FAQ: all five answers (the template answers were mismatched, e.g. the first answer talked about AI routing).
* About: mission paragraph → the profile's "Who we are" statement; heading typo "MORDEN" → "MODERN".

## 3. Still on the site — needs the client's decision

These are not in the profile; they are generic marketing language kept for review rather than invented away:

* **Service pages for Container Transport, Last-Mile Delivery and Express Distribution** — the profile does not list
  these services (it lists freight forwarding, customs clearance, inland & cross-border transport, project
  logistics, rental, event logistics, 4PL, SABER). Freight & Trucking ≈ inland transport and Warehouse & Storage ≈
  warehousing & distribution are supported. Suggest replacing the three pages with profile services.
* **Technology claims in service-page copy and elsewhere**: "AI-driven", "IoT", "telematics", "predictive
  maintenance", "digital proof of delivery", "WMS", "climate sensors", "advanced AI", "global fleet", "global scale".
  The profile only says "technology-driven operations" and "strong vendor and subcontractor network".
* FAQ question "Can I track my shipments in real time?" — the question is kept, its answer is now neutral
  ("visibility at every stage … contact our team"). Confirm what tracking KNC actually offers.
* Terms of Service still say "KNC's AI models, predictive analytics engines, and software are the exclusive
  property of KNC" and the Privacy Policy lists "IoT telemetry" and "Predictive Analytics" as data uses.
* Hero/intro lines such as "redefines the logistics journey … optimized routing … real-time visibility" and
  "Revolutionizing global commerce…".
* Legal pages: generic template terms remain (**governing law and courts: Singapore**, "Data Protection Officer",
  "IoT telemetry", "Predictive Analytics"). Needs review by the client's legal adviser.
* Hidden "Our Teams" block on the About page contains named individuals' CVs (not in the profile). It is not
  displayed; remove it from the source if it will not be used.
* Photography is stock imagery that shows third-party brands (Maersk, UASC, Scania, Volk). Replace with KNC/Freyta photography when available.
* Contact details in the profile use `info@masteryandprecise.com` / `www.masteryandprecise.com`; the site uses
  `hello@knclogistics.com.sa` as instructed.

## 4. Functional issues found while auditing

* **Contact form never sent anything** — it showed "Thank you! Inquiry Received." and cleared the form. It now opens
  the visitor's email app with the inquiry addressed to `hello@knclogistics.com.sa` and says so. A real delivery
  backend (e.g. a form service or serverless function) is still recommended.
* Mojibake (`â€™`, `â€¢`) in the HTML source, including list bullets on the legal pages — fixed.
* Template brand name "Himon" still present in the source copy — replaced.
