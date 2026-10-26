/**
 * KNC Logistics Services — digital business card data
 * ----------------------------------------------------------------------------
 * This is the ONLY file you need to edit to change what the cards show.
 * It is read by the card pages (card.js), the vCard download (api/vcard.js and
 * the browser fallback) and the QR admin page (qr-admin.html).
 *
 * Anything marked  TODO  has NOT been provided yet. It is left empty (null) on
 * purpose — nothing here is invented. Until a personal value is filled in, the
 * card falls back to the COMPANY value below and says "Company line" next to it.
 *
 * Phone numbers: write them in international format, e.g. "+966501234567".
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KNC_CARDS = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---- Company-level details (taken from the KNC website / corporate profile) ----
  var company = {
    name: "KNC Logistics Services",
    phone: "+966502746895",            // company line, as shown on the website
    email: "hello@knclogistics.com.sa", // company mailbox, as shown on the website
    // TODO: replace with the final production domain once it is live.
    website: "https://curved-progress-bar.vercel.app",
    address: {
      street: null,                     // TODO: street / building / P.O. box not provided yet
      city: "Riyadh",
      region: null,                     // TODO: province/region if wanted
      postalCode: null,                 // TODO: postal code not provided yet
      country: "Saudi Arabia"
    },
    // Used for the "Location" button (Google Maps search).
    mapsQuery: "KNC Logistics Services, Riyadh, Kingdom of Saudi Arabia",
    logo: "/knc-logo.png"               // the existing KNC logo, unchanged
  };

  // ---- People ---------------------------------------------------------------------
  // Route = "/" + key  (e.g. /afzal).  Photo files live in /card/.
  var members = {
    afzal: {
      key: "afzal",
      name: { prefix: "Dr.", given: "Afzal", family: "Aziz" },
      // Taken from the "Our Teams" block on the About page — TODO: confirm the title printed on the card.
      designation: "Global Logistics & Freight Forwarding Executive",
      photo: "/card/afzal.jpg",
      phone: null,       // TODO: personal mobile number not provided
      whatsapp: null,    // TODO: WhatsApp number (defaults to the phone number)
      email: null        // TODO: personal e-mail not provided
    },
    nisar: {
      key: "nisar",
      name: { prefix: "", given: "Nisar", family: "Kondadan" },
      // Taken from the "Our Teams" block on the About page — TODO: confirm the title printed on the card.
      // (That block spells the surname "Kondandan"; this card uses "Kondadan" as in the card brief — confirm.)
      designation: "Operations / Sales & Marketing Leader",
      photo: "/card/nisar.jpg",
      phone: null,       // TODO: personal mobile number not provided
      whatsapp: null,    // TODO
      email: null        // TODO
    },
    arun: {
      key: "arun",
      name: { prefix: "", given: "Arun", family: "Nelli" },
      // Taken from the "Our Teams" block on the About page — TODO: confirm the title printed on the card.
      designation: "Supply Chain & Inventory Management Specialist",
      photo: "/card/arun.jpg",
      phone: null,       // TODO: personal mobile number not provided
      whatsapp: null,    // TODO
      email: null        // TODO
    }
  };

  return { company: company, members: members };
});
