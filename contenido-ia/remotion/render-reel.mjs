// Renderiza el Reel "Chatbot vs. Agente" a MP4, o cuadros sueltos para revisar.
// Uso: node render-reel.mjs                 → out/reel-chatbot-vs-agente.mp4
//      node render-reel.mjs --cuadros 60 200 → out/cuadros/<n>.png
//      SIN_VIDEO=1 ...                       → usa una imagen fija de fondo (más rápido, para pruebas)
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const ID = 'reel-chatbot-vs-agente';
const browserExecutable = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const chromiumOptions = { gl: 'swangle' };
const root = path.dirname(new URL(import.meta.url).pathname);
const inputProps = { fondoVideo: !process.env.SIN_VIDEO };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: ID, inputProps, browserExecutable, chromiumOptions });

const i = process.argv.indexOf('--cuadros');
if (i > 0) {
  const dir = process.env.OUT_DIR || path.join(root, 'out', 'cuadros');
  fs.mkdirSync(dir, { recursive: true });
  for (const frame of process.argv.slice(i + 1).map(Number)) {
    await renderStill({ composition, serveUrl, frame, inputProps, browserExecutable, chromiumOptions, output: path.join(dir, `${frame}.png`) });
    console.log('✓ cuadro', frame);
  }
} else {
  const outputLocation = path.join(root, 'out', `${ID}.mp4`);
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', crf: 18, outputLocation, inputProps, browserExecutable, chromiumOptions,
    concurrency: Math.max(1, Math.min(6, os.cpus().length - 1)),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; console.log(`${p * 5}%`); } },
  });
  console.log('Listo:', outputLocation);
}
