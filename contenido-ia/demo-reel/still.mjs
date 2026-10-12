// Captura cuadros sueltos para revisar: node still.mjs 2 5 8 10
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const root = path.dirname(new URL(import.meta.url).pathname);
const server = http.createServer((req, res) => { fs.readFile(path.join(root, decodeURIComponent(req.url.split('?')[0])), (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': req.url.endsWith('.html') ? 'text/html' : req.url.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); res.end(d); }); }).listen(0);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.error('PAGE ERROR', e)); page.on('console', m => console.log('CONSOLE', m.type(), m.text()));
await page.goto(`http://localhost:${server.address().port}/index.html`);
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
const outDir = process.env.OUT || root;
for (const t of process.argv.slice(2).map(Number)) {
  const s = Date.now(); await page.evaluate(t => window.renderAt(t), t);
  await page.screenshot({ path: path.join(outDir, `still-${t}.png`) }); console.log('t=', t, Date.now() - s, 'ms');
}
await browser.close(); server.close();
