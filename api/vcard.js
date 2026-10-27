// Serverless function: GET /afzal.vcf  ->  /api/vcard?m=afzal
// Builds the vCard from cards-data.js on every request (with a small embedded photo).
// Public, no login. Served inline so phones open the "add contact" screen directly.
const fs = require("fs");
const path = require("path");
const core = require("../cards-core.js");

function photoBase64(r) {
  try {
    if (!r.photoSmall || !/^\/card\/[a-z0-9-]+\.jpg$/.test(r.photoSmall)) return null;
    return fs.readFileSync(path.join(__dirname, "..", r.photoSmall)).toString("base64");
  } catch (e) {
    return null; // the contact still saves, just without a picture
  }
}

module.exports = function handler(req, res) {
  let key = null;
  try {
    key = (req.query && req.query.m) || new URL(req.url, "http://localhost").searchParams.get("m");
  } catch (e) { /* fall through to 404 */ }

  const r = core.resolve(key);
  if (!r) {
    res.status(404).setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send("Not found");
  }
  const vcf = core.buildVCard(key, { photoBase64: photoBase64(r) });
  res.setHeader("Content-Type", "text/vcard; charset=utf-8");
  res.setHeader("Content-Disposition", 'inline; filename="' + r.vcfName + '"');
  res.setHeader("Cache-Control", "public, max-age=300");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(200).send(vcf);
};
