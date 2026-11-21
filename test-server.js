const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3032;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        filePath = htmlPath;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

const pages = [
  'index.html',
  'shop.html',
  'product-detail.html',
  'upload-prescription.html',
  'cart.html',
  'checkout.html',
  'order-confirmation.html',
  'track-order.html',
  'portal.html',
  'services.html',
  'about.html',
  'contact.html',
  'compliance.html',
  'admin/index.html',
  'css/pharmacy.css',
  'js/pharmacy-data.js',
  'js/pharmacy-store.js',
  'js/pharmacy-ui.js'
];

async function checkPage(p) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}/${p}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode === 200 ? 'PASS' : 'FAIL'}] /${p} -> HTTP ${res.statusCode} (${data.length} bytes)`);
        resolve(res.statusCode === 200);
      });
    }).on('error', (e) => {
      console.log(`[ERR] /${p} -> ${e.message}`);
      resolve(false);
    });
  });
}

async function run() {
  server.listen(PORT, async () => {
    console.log(`Internal test server running on port ${PORT}...`);
    console.log('Testing CuraRx Pakistan Server HTTP Endpoints...\n');
    let passed = 0;
    for (const p of pages) {
      const ok = await checkPage(p);
      if (ok) passed++;
    }
    console.log(`\nResults: ${passed}/${pages.length} checks passed!`);
    server.close(() => {
      process.exit(passed === pages.length ? 0 : 1);
    });
  });
}

run();
