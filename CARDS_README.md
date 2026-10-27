# KNC digital business cards

Three public, login-free cards opened by scanning a QR code on the physical card:

| Person | Card | Contact file |
|---|---|---|
| Dr. Afzal Aziz | `/afzal` | `/afzal.vcf` |
| Nisar Kondadan | `/nisar` | `/nisar.vcf` |
| Arun Nelli | `/arun` | `/arun.vcf` |

QR generator (not linked from anywhere, `noindex`): **`/qr-admin`**.

## Change what a card shows
Edit **`cards-data.js`** only. Real details supplied by KNC are in; the remaining open points are marked `TODO`:

* Arun: the details sent read "Arun Nelli C" — confirm whether the "C" belongs on the card (currently left out).
* WhatsApp uses each person's mobile number unless a separate `whatsapp` number is added.
* The company phone/e-mail are used only if a person has none of their own.

Photos are in `/card/*.jpg` (cropped from `team_*.png`); `/card/*-256.jpg` is the small copy embedded in the saved contact.

If you change a **name or title**, also update the `<title>` / description in `afzal.html`, `nisar.html`,
`arun.html` (used for link previews; the card itself is drawn from the data).

## Print the QR codes
1. Deploy, then open `https://<production-domain>/qr-admin`.
2. Enter the production domain (https), choose PNG size, download PNG / SVG for each person.
   Codes use error correction **H**, a white background and a 4-module quiet zone, and contain only
   `https://<domain>/<name>`.
3. Scan each printed code once with a phone before sending cards to print.

## How "Save contact" works
The button is a normal link to `/<name>.vcf`. On Vercel that is `api/vcard.js` (rewrites in `vercel.json`);
locally it is served by `server.js`. Both build a vCard 3.0 from `cards-data.js` through `cards-core.js`
and send it as `text/vcard` with a download header. If that route is ever unavailable the page builds
the same vCard in the browser instead.

QR generation uses the MIT-licensed `qrcode` library, bundled in `vendor/qrcode.min.js`.
