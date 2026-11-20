/**
 * CuraRx Pharmacy - Lightweight Standalone Local Development Server
 * Runs with Node.js built-in modules (http, fs, path). Zero external dependencies required!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3030;
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

  // Security check to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check if .html can be appended
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        filePath = htmlPath;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <div style="font-family:sans-serif;text-align:center;padding:50px;">
            <h1>404 Not Found</h1>
            <p>The requested page <code>${reqPath}</code> was not found.</p>
            <a href="/index.html">Return to CuraRx Homepage</a>
          </div>
        `);
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 CuraRx Pharmacy & Healthcare Server Live!`);
  console.log(`🌐 Local URL:  http://localhost:${PORT}`);
  console.log(`👨‍⚕️ Pharmacist Admin: http://localhost:${PORT}/admin/index.html`);
  console.log(`📋 Prescription Upload: http://localhost:${PORT}/upload-prescription.html`);
  console.log(`💊 Medicine Catalog:   http://localhost:${PORT}/shop.html`);
  console.log(`=======================================================`);
});
