const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg'
};

let rewrites = [];
try {
  const vercelCfg = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'vercel.json'), 'utf8'));
  rewrites = vercelCfg.rewrites || [];
} catch (e) {}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Check vercel rewrites
  for (const r of rewrites) {
    if (reqPath === r.source) {
      reqPath = r.destination;
      break;
    }
  }

  let filePath = path.join(BASE_DIR, reqPath);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const stat = fs.statSync(filePath);
      const total = stat.size;

      if (req.headers.range && (ext === '.mp4' || ext === '.webm')) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, '').split('-');
        let start = parts[0] ? parseInt(parts[0], 10) : 0;
        let end = parts[1] ? parseInt(parts[1], 10) : total - 1;

        if (isNaN(start)) start = 0;
        if (isNaN(end) || end >= total) end = total - 1;

        if (start > end || start >= total) {
          res.writeHead(416, {
            'Content-Range': `bytes */${total}`
          });
          return res.end();
        }

        const chunksize = end - start + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${total}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.on('error', (err) => {
          console.error('Stream error:', err.message);
        });
        res.on('close', () => {
          stream.destroy();
        });
        stream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': total,
          'Accept-Ranges': 'bytes',
          'Content-Type': contentType
        });
        const stream = fs.createReadStream(filePath);
        stream.on('error', (err) => {
          console.error('Stream error:', err.message);
        });
        res.on('close', () => {
          stream.destroy();
        });
        stream.pipe(res);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + req.url);
    }
  } catch (err) {
    console.error('Request error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
    }
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
