// Renderiza un anuncio a MP4, o cuadros sueltos para revisar.
// Uso: node render-anuncio.mjs [id]                     → out/<id>.mp4
//      node render-anuncio.mjs [id] --cuadros 30 120    → out/cuadros-<id>/<n>.png
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const args = process.argv.slice(2);
const ID = args[0] && !args[0].startsWith('--') ? args[0] : 'anuncio-grano-lento';
const browserExecutable = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const chromiumOptions = { gl: 'swangle' };
const root = path.dirname(new URL(import.meta.url).pathname);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: ID, browserExecutable, chromiumOptions });

const i = args.indexOf('--cuadros');
if (i >= 0) {
  const dir = process.env.OUT_DIR || path.join(root, 'out', `cuadros-${ID}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const frame of args.slice(i + 1).map(Number)) {
    await renderStill({ composition, serveUrl, frame, browserExecutable, chromiumOptions, output: path.join(dir, `${frame}.png`) });
    console.log('✓ cuadro', frame);
  }
} else {
  const outputLocation = path.join(root, 'out', `${ID}.mp4`);
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', crf: 18, outputLocation, browserExecutable, chromiumOptions,
    concurrency: Math.max(1, Math.min(4, os.cpus().length - 1)),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${p * 10}%`); } },
  });
  // Volumen estándar para redes (≈ -14 LUFS) si el video tiene audio; la imagen no se toca.
  const tieneAudio = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', outputLocation]).toString().trim();
  if (tieneAudio) {
    const tmp = outputLocation.replace(/\.mp4$/, '.tmp.mp4');
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', outputLocation, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', tmp]);
    fs.renameSync(tmp, outputLocation);
  }
  console.log('Listo:', outputLocation);
}
