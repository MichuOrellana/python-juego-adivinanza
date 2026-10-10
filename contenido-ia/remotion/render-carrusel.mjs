// Renderiza todas las slides del carrusel como PNG en out/<id>/.
// Uso: node render-carrusel.mjs [slides...]   (ej: node render-carrusel.mjs 1 3)
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const ID = 'chatbot-vs-agente', TOTAL = 8;
const browserExecutable = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const root = path.dirname(new URL(import.meta.url).pathname);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const slides = process.argv.slice(2).map(Number);
const outDir = path.join(root, 'out', ID);
fs.mkdirSync(outDir, { recursive: true });

for (const slide of slides.length ? slides : Array.from({ length: TOTAL }, (_, i) => i + 1)) {
  const inputProps = { slide };
  const composition = await selectComposition({ serveUrl, id: ID, inputProps, browserExecutable });
  const output = path.join(outDir, `${String(slide).padStart(2, '0')}.png`);
  await renderStill({ composition, serveUrl, output, inputProps, browserExecutable, imageFormat: 'png' });
  console.log('✓', output);
}
