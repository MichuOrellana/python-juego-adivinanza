// Captura la escena 3D sin textos (para usar como fondo de portadas).
// Uso: node still-sin-texto.mjs <segundo> <salida.png>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const root = path.dirname(new URL(import.meta.url).pathname);
const [t = 7.2, out = 'escena.png'] = process.argv.slice(2);
const server = http.createServer((req, res) => { fs.readFile(path.join(root, decodeURIComponent(req.url.split('?')[0])), (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': req.url.endsWith('.html') ? 'text/html' : req.url.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); res.end(d); }); }).listen(0);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`http://localhost:${server.address().port}/index.html`);
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
await page.evaluate(t => { window.renderAt(t); document.querySelectorAll('.layer:not(#grain)').forEach(e => e.style.display = 'none'); }, Number(t));
await page.screenshot({ path: path.resolve(out) });
await browser.close(); server.close();
