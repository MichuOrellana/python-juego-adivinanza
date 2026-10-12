// Renderiza index.html cuadro a cuadro y arma el MP4 con ffmpeg.
// Uso: node render.mjs [fps] [desde] [hasta]   (ej: node render.mjs 30)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || '/opt/node22/lib/node_modules/playwright');

const root = path.dirname(new URL(import.meta.url).pathname);
const fps = Number(process.argv[2] || 30);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  });
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e));
page.on('console', m => m.type() === 'error' && console.error('CONSOLE', m.text()));
await page.goto(`http://localhost:${port}/${process.env.PAGE || 'index.html'}`);
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
const duration = await page.evaluate(() => window.DURATION);

const from = Number(process.argv[3] ?? 0), to = Number(process.argv[4] ?? duration);
const out = path.resolve(root, process.env.OUT || 'reel-demo.mp4');
const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });

const frames = Math.round((to - from) * fps);
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const t = from + f / fps;
  await page.evaluate(t => window.renderAt(t), t);
  ff.stdin.write(await page.screenshot({ type: 'png' }));
  if (f % 30 === 0) console.log(`cuadro ${f}/${frames}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close(); server.close();
console.log('Listo:', out);
