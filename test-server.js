const http = require('http');

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
    http.get(`http://localhost:3030/${p}`, (res) => {
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
  console.log('Testing CuraRx Server HTTP Endpoints...\n');
  let passed = 0;
  for (const p of pages) {
    const ok = await checkPage(p);
    if (ok) passed++;
  }
  console.log(`\nResults: ${passed}/${pages.length} checks passed!`);
  process.exit(passed === pages.length ? 0 : 1);
}

run();
