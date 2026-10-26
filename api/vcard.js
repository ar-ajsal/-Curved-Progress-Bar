// Serverless function: GET /afzal.vcf  ->  /api/vcard?m=afzal
// Builds the vCard from cards-data.js on every request. Public, no login.
const core = require("../cards-core.js");

module.exports = function handler(req, res) {
  let key = null;
  try {
    key = (req.query && req.query.m) || new URL(req.url, "http://localhost").searchParams.get("m");
  } catch (e) { /* fall through to 404 */ }

  const vcf = core.buildVCard(key);
  if (!vcf) {
    res.status(404).setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send("Not found");
  }
  const file = core.resolve(key).vcfName;
  res.setHeader("Content-Type", "text/vcard; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="' + file + '"');
  res.setHeader("Cache-Control", "public, max-age=300");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(200).send(vcf);
};
