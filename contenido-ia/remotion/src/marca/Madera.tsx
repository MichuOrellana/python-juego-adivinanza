// Textura de madera de nogal generada por código (sin imágenes externas).
import React, { useEffect, useRef, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function crearRuido(seed: number) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const g = new Float32Array(256).map(() => rand());
  const v = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    const h = (i: number, j: number) => g[perm[(perm[(xi + i) & 255] + yi + j) & 255]];
    return (h(0, 0) * (1 - u) + h(1, 0) * u) * (1 - w) + (h(0, 1) * (1 - u) + h(1, 1) * u) * w;
  };
  return (x: number, y: number) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < 5; i++) { s += a * v(x * f, y * f); f *= 2; a *= 0.5; } return s; };
}
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const OSCURO: RGB = [34, 21, 13], MEDIO: RGB = [84, 54, 33], CLARO: RGB = [128, 88, 56];

function pintarTabla(img: ImageData, seed: number) {
  const fbm = crearRuido(seed);
  const { width: w, height: h, data } = img;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const nx = x / 1080, ny = y / 1080;
    // vetas largas en horizontal con nudos suaves
    const ph = ny * 140 + 9 * fbm(nx * 1.6, ny * 3) + 3 * fbm(nx * 6, ny * 6);
    const veta = Math.pow(0.5 + 0.5 * Math.sin(ph), 6);
    let c = mix(MEDIO, CLARO, 0.55 * fbm(nx * 2 + 5, ny * 9));
    c = mix(c, OSCURO, 0.7 * veta);
    c = mix(c, OSCURO, 0.35 * fbm(nx * 3, ny * 160));
    const i = (y * w + x) * 4; data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
  }
}

function pintarAnillos(img: ImageData, seed: number) {
  const fbm = crearRuido(seed);
  const { width: s, data } = img;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const nx = x / s - 0.5, ny = y / s - 0.5;
    const d = Math.hypot(nx * 1.04, ny) + 0.05 * fbm(nx * 4 + 10, ny * 4 + 10);
    const ph = d * 250 - 120 * d * d + 7 * fbm(nx * 2.2, ny * 2.2);
    const tardia = Math.pow(0.5 + 0.5 * Math.sin(ph + 0.6), 9);
    let c = mix(MEDIO, CLARO, 0.5 * (0.5 + 0.5 * Math.sin(ph)) * fbm(nx * 3 + 4, ny * 3));
    c = mix(c, OSCURO, 0.75 * tardia);
    c = mix(c, OSCURO, 0.35 * fbm(nx * 90, ny * 90));
    const borde = Math.min(1, Math.max(0, (d - 0.44) / 0.06));
    c = mix(c, [16, 10, 6], borde);
    const i = (y * s + x) * 4; data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = d > 0.5 ? 0 : 255;
  }
}

export const Madera: React.FC<{ ancho: number; alto: number; tipo?: 'tabla' | 'anillos'; semilla?: number; style?: React.CSSProperties }> = ({ ancho, alto, tipo = 'tabla', semilla = 3, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender('pintando madera'));
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const img = ctx.createImageData(cv.width, cv.height);
    (tipo === 'tabla' ? pintarTabla : pintarAnillos)(img, semilla);
    ctx.putImageData(img, 0, 0);
    continueRender(handle);
  }, [handle, semilla, tipo]);
  return <canvas ref={ref} width={ancho} height={alto} style={{ width: ancho, height: alto, display: 'block', ...style }} />;
};
