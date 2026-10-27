/**
 * KNC Logistics Services — digital business card data
 * ----------------------------------------------------------------------------
 * This is the ONLY file you need to edit to change what the cards show.
 * It is read by the card pages (card.js), the vCard download (api/vcard.js and
 * the browser fallback) and the QR admin page (qr-admin.html).
 *
 * Phone numbers: international format, digits only after the "+" (no spaces,
 * no "(0)"), e.g. "+966501234567".
 *
 * Anything still marked  TODO  has not been provided. It is left empty (null)
 * on purpose — nothing here is invented.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KNC_CARDS = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---- Company-level details ----
  var company = {
    name: "KNC Logistics Services",
    phone: "+966502746895",              // company line (used only if a person has no own number)
    email: "hello@knclogistics.com.sa",  // company mailbox (used only if a person has no own e-mail)
    website: "https://www.knclogistics.com.sa",
    address: {
      street: "Building No. 7678, Al Shafei Street",
      extended: "Al Rawabi Dist 5488",
      city: "Riyadh",
      region: null,
      postalCode: "14216",
      country: "Saudi Arabia"
    },
    // Used for the "Location" button (Google Maps search).
    mapsQuery: "Building 7678, Al Shafei Street, Al Rawabi, Riyadh 14216, Saudi Arabia",
    logo: "/knc-logo.png",               // the existing KNC logo, unchanged
    logoLight: "/knc-logo-footer.png"    // same logo with white lettering, for the navy header
  };

  // ---- People ---------------------------------------------------------------------
  // Route = "/" + key  (e.g. /afzal).  Photos live in /card/.
  var members = {
    afzal: {
      key: "afzal",
      name: { prefix: "Dr.", given: "Afzal", family: "Aziz" },
      designation: "Managing Partner",
      photo: "/card/afzal.jpg",
      photoSmall: "/card/afzal-256.jpg",   // embedded in the saved contact
      phone: "+966566103539",
      whatsapp: null,                      // defaults to the phone number
      email: "afzal.aziz@knclogistics.com.sa"
    },
    nisar: {
      key: "nisar",
      name: { prefix: "", given: "Nisar", family: "Kondadan" },
      designation: "Managing Partner",
      photo: "/card/nisar.jpg",
      photoSmall: "/card/nisar-256.jpg",
      phone: "+966502746894",
      whatsapp: null,
      email: "nisar.kondadan@knclogistics.com.sa"
    },
    arun: {
      key: "arun",
      // TODO: the details sent read "Arun Nelli C" — confirm whether the "C" belongs on the card.
      name: { prefix: "", given: "Arun", family: "Nelli" },
      designation: "Managing Partner",
      photo: "/card/arun.jpg?v=2",
      photoSmall: "/card/arun-256.jpg",
      phone: "+966535847425",
      whatsapp: null,
      email: "arun.nelli@knclogistics.com.sa"
    }
  };

  return { company: company, members: members };
});
