const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const ROOT = __dirname;
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.mjs':'text/javascript;charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain;charset=utf-8'};
const server = http.createServer((req, res) => {
  let u = decodeURI(req.url.split('?')[0]);
  if (u === '/') { res.writeHead(302, { Location: '/himon.framer.website/index.html' }); res.end(); return; }
  let fp = path.join(ROOT, u);
  fs.stat(fp, (err, st) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404'); return; }
    if (st.isDirectory()) fp = path.join(fp, 'index.html');
    const ct = MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream';
    fs.readFile(fp, (er, data) => {
      if (er) { res.writeHead(500, {'Content-Type':'text/plain'}); res.end('500'); return; }
      res.writeHead(200, {'Content-Type': ct});
      res.end(data);
    });
  });
});
server.listen(PORT, '0.0.0.0', () => {
  console.log('Server running at http://localhost:' + PORT + '/');
});
