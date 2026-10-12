// Muestrario de ideas para MigasOk: 12 escenas cortas (4 s c/u) para elegir cuáles convertir en anuncios completos.
import React from 'react';
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { MIGASOK } from './migasok';
import { FotoLogo } from './LogoMigas';

export const cargarFuentesMuestrario = () => Promise.all([
  loadFont({ family: 'Nunito', url: staticFile('fonts/anuncios/Nunito.ttf'), weight: '900' }),
  loadFont({ family: 'Caveat', url: staticFile('fonts/anuncios/Caveat.ttf'), weight: '700' }),
  loadFont({ family: 'Courier Prime', url: staticFile('fonts/anuncios/CourierPrime.ttf'), weight: '700' }),
]);

const M = MIGASOK;
const C = M.color;
const F = M.extra.fotos;
const ESC = 120;
export const DURACION_MUESTRARIO = ESC * 12;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const lin = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], cl);
const useSp = (d: number, damping = 12, mass = 0.7) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass } }); };
const Sp: React.FC<{ d: number; damping?: number; children: (s: number) => React.ReactNode }> = ({ d, damping, children }) => <>{children(useSp(d, damping))}</>;

const NUNITO = 'Nunito', CAVEAT = 'Caveat', COURIER = 'Courier Prime';
const fondoCrema = `radial-gradient(ellipse 90% 70% at 50% 50%, ${C.fondo2}, ${C.fondo} 80%)`;
const foto = (src: string, st: React.CSSProperties = {}) => <Img src={staticFile(src)} style={{ objectFit: 'cover', display: 'block', ...st }} />;
const Centro: React.FC<{ top: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ top, children, st }) => <div style={{ position: 'absolute', top, left: 60, right: 60, textAlign: 'center', ...st }}>{children}</div>;

// ---------------- 1 · La pila infinita ----------------
const PilaInfinita = () => {
  const f = useCurrentFrame();
  const n = Math.round(lin(f, 10, 95, 12, 48) / 12) * 12;
  return (
    <AbsoluteFill style={{ background: fondoCrema }}>
      <div style={{ position: 'absolute', left: 140, width: 800, top: 0, transform: `translateY(${-((f * 16) % 1040)}px)` }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ height: 500, marginBottom: 20, borderRadius: 30, overflow: 'hidden', boxShadow: '0 20px 40px rgba(90,50,25,0.25)' }}>
            {foto(i % 2 ? F.miga2 : F.miga1, { width: '100%', height: '100%' })}
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,250,242,0.95) 0%, rgba(255,250,242,0) 30%, rgba(255,250,242,0) 70%, rgba(255,250,242,0.95) 100%)' }} />
      <Centro top={250}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 260, lineHeight: 1, color: C.acento, textShadow: '0 8px 0 #fff' }}>{n}</div><div style={{ display: 'inline-block', marginTop: 10, background: '#fff', borderRadius: 18, padding: '6px 26px', fontFamily: NUNITO, fontWeight: 900, fontSize: 56, color: C.texto }}>sándwiches</div></Centro>
      <Sp d={70}>{s => <Centro top={1480} st={{ opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}><div style={{ display: 'inline-block', background: C.texto, color: '#fff', borderRadius: 24, padding: '22px 36px', fontFamily: NUNITO, fontWeight: 900, fontSize: 54 }}>¿Para cuántos es tu evento?</div></Centro>}</Sp>
    </AbsoluteFill>
  );
};

// ---------------- 2 · Capa por capa ----------------
const CapaPorCapa = () => {
  const f = useCurrentFrame();
  const abre = lin(f, 18, 50);
  const capas = ['pan de miga', 'jamón cocido', 'queso', 'pan de miga', 'jamón y queso'];
  return (
    <AbsoluteFill style={{ background: fondoCrema }}>
      <Centro top={250}><div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 58, color: C.texto }}>ANATOMÍA DE UN<br /><span style={{ color: C.acento }}>SÁNDWICH DE MIGA</span></div></Centro>
      <div style={{ position: 'absolute', left: 80, top: 640, width: 560 }}>
        {capas.map((_, i) => (
          <div key={i} style={{ height: 120, marginTop: i ? abre * 46 : 0, borderRadius: 10, overflow: 'hidden', boxShadow: '0 10px 20px rgba(90,50,25,0.2)', transform: `translateX(${(i % 2 ? 1 : -1) * abre * 12}px)` }}>
            <div style={{ width: 560, height: 600, transform: `translateY(${-i * 120}px)` }}>{foto(F.miga2, { width: 560, height: 600, objectPosition: '30% 50%' })}</div>
          </div>
        ))}
      </div>
      {capas.map((c, i) => {
        const y = 640 + i * (120 + abre * 46) + 60;
        const d = lin(f, 45 + i * 8, 60 + i * 8);
        return (
          <div key={c + i} style={{ position: 'absolute', top: y - 2, left: 660, display: 'flex', alignItems: 'center', gap: 14, opacity: d > 0 ? 1 : 0 }}>
            <div style={{ width: 70 * d, height: 3, background: C.acento }} />
            <span style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, color: C.texto, clipPath: `inset(0 ${100 - d * 100}% 0 0)` }}>{c}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------- 3 · Antes / con MigasOk ----------------
const AntesDespues = () => {
  const f = useCurrentFrame();
  const corte = interpolate(f, [30, 70], [1080, 0], { ...cl, easing: t => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill style={{ background: '#e9e3da' }}>
      <svg width="1080" height="1920" style={{ position: 'absolute' }}>
        <ellipse cx="540" cy="1000" rx="380" ry="150" fill="#fff" stroke="#d6cfc4" strokeWidth="6" />
        <ellipse cx="540" cy="990" rx="270" ry="95" fill="#f6f2ec" />
      </svg>
      <Centro top={560}><div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 110, color: '#8a8178' }}>la mesa del cumple…</div></Centro>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${corte}px)` }}>
        {foto(F.miga1, { width: 1080, height: 1920, transform: `scale(${1.15 - 0.1 * lin(f, 30, 120)})` })}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0) 35%)' }} />
        <Centro top={560}><div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 120, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>…con MigasOk 🥪</div></Centro>
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: corte - 4, width: 8, background: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.3)', opacity: corte > 2 && corte < 1078 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};

// ---------------- 4 · Testimonios ----------------
const Testimonios = () => {
  const f = useCurrentFrame();
  const textos = ['Riquísimos, llegaron re frescos 😍', 'Los budines vuelan en la oficina', 'Ya es clásico en cada cumple 💛'];
  return (
    <AbsoluteFill style={{ background: fondoCrema }}>
      <Centro top={250}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 80, color: C.texto }}>Lo que dicen<br /><span style={{ color: C.acento }}>nuestros clientes</span></div></Centro>
      {textos.map((t, i) => (
        <Sp key={i} d={14 + i * 18}>{s => (
          <div style={{ position: 'absolute', top: 640 + i * 260, left: i % 2 ? 180 : 80, width: 820, background: '#fff', borderRadius: 30, padding: '28px 34px', boxShadow: '0 16px 40px rgba(90,50,25,0.15)', transform: `translateX(${(1 - s) * (i % 2 ? 700 : -700)}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`, opacity: Math.min(1, s * 2) }}>
            <div style={{ fontSize: 44, letterSpacing: 4 }}>{[0, 1, 2, 3, 4].map(k => <span key={k} style={{ color: lin(f, 30 + i * 18 + k * 3, 34 + i * 18 + k * 3) > 0.5 ? '#f5b301' : '#e5ddd2' }}>★</span>)}</div>
            <div style={{ marginTop: 8, fontFamily: M.fuente.texto, fontWeight: 500, fontSize: 40, color: C.texto }}>{t}</div>
          </div>
        )}</Sp>
      ))}
      <Centro top={1500}><div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: '#9c8f80' }}>* textos de ejemplo: usar mensajes reales de clientes</div></Centro>
    </AbsoluteFill>
  );
};

// ---------------- 5 · Calculadora de miga ----------------
const Triangulo: React.FC<{ s: number }> = ({ s }) => (
  <svg width="120" height="104" viewBox="0 0 120 104" style={{ transform: `translateY(${(1 - s) * -400}px)`, opacity: s > 0.02 ? 1 : 0 }}>
    <path d="M6 98 L60 8 L114 98 Z" fill="#f6ecd8" stroke="#e2d2b4" strokeWidth="4" strokeLinejoin="round" />
    <path d="M22 72 H98" stroke="#ee9c94" strokeWidth="9" /><path d="M30 58 H90" stroke="#f5cf5c" strokeWidth="7" />
  </svg>
);
const Calculadora = () => {
  const f = useCurrentFrame();
  const rueda = lin(f, 8, 40);
  const invitados = Math.round(interpolate(rueda, [0, 1], [5, 30]));
  return (
    <AbsoluteFill style={{ background: C.texto }}>
      <Centro top={240}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 64, color: '#fff' }}>¿Cuántos sándwiches<br />necesito?</div></Centro>
      <Centro top={520}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 20, background: '#fff', borderRadius: 30, padding: '20px 44px' }}>
          <span style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 150, color: C.acento, fontVariantNumeric: 'tabular-nums', filter: `blur(${(1 - rueda) * 4}px)` }}>{invitados}</span>
          <span style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 50, color: C.texto }}>invitados</span>
        </div>
      </Centro>
      <Sp d={44}>{s => <Centro top={800} st={{ opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 110, color: '#f5cf5c' }}>= 5 docenas</div></Centro>}</Sp>
      <div style={{ position: 'absolute', top: 1040, left: 120, width: 840, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', rowGap: 10, justifyItems: 'center' }}>
        {Array.from({ length: 12 }, (_, i) => <Sp key={i} d={56 + i * 3} damping={10}>{s => <Triangulo s={s} />}</Sp>)}
      </div>
      <Centro top={1380}><div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: 'rgba(255,255,255,0.6)' }}>* cálculo de ejemplo (2 por invitado): usar la regla real de MigasOk</div></Centro>
    </AbsoluteFill>
  );
};

// ---------------- 6 · Menú de gustos ----------------
const Menu = () => {
  const gustos: [string, string, string][] = [['Jamón y queso', F.miga2, C.acento], ['Triple', M.extra.logo, C.acento2], ['Budín de chocolate', F.budin1, '#6b3a1e'], ['Budín con chips', F.budin2, '#c98a44']];
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: fondoCrema }}>
      <Centro top={240}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 96, color: C.texto }}>Nuestros <span style={{ color: C.acento }}>gustos</span></div></Centro>
      <div style={{ position: 'absolute', top: 470, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, perspective: 1600 }}>
        {gustos.map(([g, src, col], i) => {
          const giro = interpolate(f, [12 + i * 10, 40 + i * 10], [180, 0], { ...cl, easing: t => 1 - Math.pow(1 - t, 3) });
          return (
            <div key={g} style={{ height: 520, transformStyle: 'preserve-3d', transform: `rotateY(${giro}deg)`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 30, overflow: 'hidden', background: '#fff', boxShadow: '0 18px 40px rgba(90,50,25,0.2)' }}>
                {foto(src, { width: '100%', height: 390 })}
                <div style={{ height: 130, background: col, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: NUNITO, fontWeight: 900, fontSize: 44, textAlign: 'center', lineHeight: 1 }}>{g}</div>
              </div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 30, background: col, display: 'grid', placeItems: 'center' }}>
                <span style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 140, color: 'rgba(255,255,255,0.85)' }}>?</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 7 · Tipografía cinética del eslogan ----------------
const Cinetica = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tipeo = 'que siempre'.slice(0, Math.round(lin(f, 34, 56) * 11));
  const suma = spring({ frame: f - 62, fps, config: { damping: 8, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ background: C.acento2, overflow: 'hidden' }}>
      {f > 66 && Array.from({ length: 40 }, (_, i) => {
        const s = spring({ frame: f - 66 - (i % 10) * 2, fps, config: { damping: 9 } });
        return <span key={i} style={{ position: 'absolute', left: (i % 6) * 190 + 20, top: Math.floor(i / 6) * 290 + 40, fontFamily: NUNITO, fontWeight: 900, fontSize: 150, color: 'rgba(255,255,255,0.14)', transform: `scale(${s}) rotate(${f * 3 + i * 20}deg)` }}>+</span>;
      })}
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        {'El clásico'.split('').map((l, i) => {
          const s = spring({ frame: f - 4 - i * 2, fps, config: { damping: 7, mass: 0.6 } });
          return <span key={i} style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 150, color: '#fff', whiteSpace: 'pre', display: 'inline-block', transform: `translateY(${(1 - s) * -900}px)` }}>{l}</span>;
        })}
      </div>
      <Centro top={720}><span style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 150, color: '#ffe9a8' }}>{tipeo}</span></Centro>
      <Centro top={900}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 330, lineHeight: 1, color: '#fff', transform: `scale(${suma}) rotate(${(1 - suma) * -20}deg)`, textShadow: `0 14px 0 ${C.acento}` }}>SUMA</div></Centro>
    </AbsoluteFill>
  );
};

// ---------------- 8 · Ilustración: el sándwich se arma ----------------
const Ilustrado = () => {
  const capas: [string, number, React.ReactNode][] = [
    ['pan', 80, <rect key="a" x="0" y="0" width="700" height="80" rx="28" fill="#f6ecd8" stroke="#e2d2b4" strokeWidth="6" />],
    ['jamón', 40, <path key="b" d="M10 20 Q90 0 175 20 T350 20 T525 20 T700 20 V40 H10 Z" fill="#f2a5a0" />],
    ['queso', 36, <g key="c"><rect x="0" y="0" width="700" height="36" rx="6" fill="#f7d05e" /><circle cx="140" cy="18" r="8" fill="#e8b83c" /><circle cx="420" cy="14" r="10" fill="#e8b83c" /></g>],
    ['tomate', 44, <g key="d">{[0, 1, 2, 3].map(k => <ellipse key={k} cx={100 + k * 170} cy="22" rx="80" ry="22" fill="#d8432f" />)}</g>],
    ['lechuga', 40, <path key="e" d="M0 30 Q35 0 70 30 T140 30 T210 30 T280 30 T350 30 T420 30 T490 30 T560 30 T630 30 T700 30 V40 H0 Z" fill="#78b046" />],
    ['pan', 80, <rect key="f" x="0" y="0" width="700" height="80" rx="28" fill="#f6ecd8" stroke="#e2d2b4" strokeWidth="6" />],
  ];
  let y = 1240;
  return (
    <AbsoluteFill style={{ background: '#fdf3e4' }}>
      <svg width="1080" height="1920" style={{ position: 'absolute' }}>
        <ellipse cx="540" cy="1340" rx="430" ry="60" fill="#f1e2cc" />
        {capas.map(([n, h, el], i) => {
          y -= h - 6;
          const yy = y;
          return <Sp key={i} d={6 + i * 9} damping={9}>{s => <g transform={`translate(190 ${yy - (1 - s) * 1300})`} opacity={s > 0.01 ? 1 : 0}>{el}</g>}</Sp>;
        })}
      </svg>
      <Sp d={66}>{s => <Centro top={420} st={{ opacity: s, transform: `rotate(-4deg) scale(${0.7 + 0.3 * s})` }}><div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 130, color: C.texto, lineHeight: 1 }}>hecho a mano,<br /><span style={{ color: C.acento }}>como siempre</span></div></Centro>}</Sp>
    </AbsoluteFill>
  );
};

// ---------------- 9 · Bandeja giratoria (3D CSS + fotos) ----------------
const Bandeja = () => {
  const f = useCurrentFrame();
  const fotos = [F.miga1, F.budin1, F.miga2, F.budin2, F.apertura, M.extra.logo];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #3a2216, #1c110b 75%)`, perspective: 1600 }}>
      <Centro top={250}><div style={{ fontFamily: M.fuente.display, fontWeight: 700, fontSize: 96, color: '#f6e7cf', lineHeight: 1.05 }}>Bandejas para<br /><em style={{ color: '#f2c06b' }}>cada ocasión</em></div></Centro>
      <div style={{ position: 'absolute', left: 540, top: 1150, transformStyle: 'preserve-3d', transform: 'rotateX(-12deg)' }}>
        <div style={{ position: 'absolute', left: -430, top: -280, width: 860, height: 860, borderRadius: '50%', background: 'radial-gradient(circle, #f7d98a, #c9962f 60%, #8a611a)', transform: 'rotateX(90deg)', boxShadow: '0 0 80px rgba(242,192,107,0.4)' }} />
        {fotos.map((src, i) => {
          const a = i * 60 + f * 1.4;
          return (
            <div key={i} style={{ position: 'absolute', left: -150, top: -230, width: 300, height: 380, transform: `rotateY(${a}deg) translateZ(330px)`, borderRadius: 22, overflow: 'hidden', border: '8px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              {foto(src, { width: '100%', height: '100%' })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 10 · Caja que se abre (3D CSS) ----------------
const Caja = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const llega = spring({ frame: f - 4, fps, config: { damping: 9 } });
  const tapa = interpolate(f, [40, 60], [0, -120], { ...cl, easing: t => 1 - Math.pow(1 - t, 3) });
  const L = 420;
  const cara = (t: string, bg: string, extra?: React.ReactNode) => <div style={{ position: 'absolute', width: L, height: L, transform: t, background: bg, border: '3px solid rgba(0,0,0,0.08)', display: 'grid', placeItems: 'center' }}>{extra}</div>;
  return (
    <AbsoluteFill style={{ background: fondoCrema, perspective: 1800 }}>
      <Centro top={250}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 92, color: C.texto }}>Lista para <span style={{ color: C.acento }}>llevar</span></div></Centro>
      {[F.miga1, F.budin1, F.miga2].map((src, i) => {
        const s = spring({ frame: f - 58 - i * 6, fps, config: { damping: 10 } });
        return <div key={src} style={{ position: 'absolute', left: 540 - 110 + (i - 1) * 230, top: 1000 - s * 420, width: 220, height: 220, opacity: s > 0.02 ? 1 : 0, transform: `scale(${0.4 + 0.6 * s}) rotate(${(i - 1) * 10}deg)` }}>{foto(src, { width: 220, height: 220, borderRadius: 110, border: '8px solid #fff' })}</div>;
      })}
      <div style={{ position: 'absolute', left: 540 - L / 2, top: 900 + (1 - llega) * -1200, width: L, height: L, transformStyle: 'preserve-3d', transform: 'rotateX(-18deg) rotateY(-30deg)' }}>
        {cara(`rotateY(180deg) translateZ(${L / 2}px)`, '#a8773f')}
        {cara(`rotateY(-90deg) translateZ(${L / 2}px)`, '#b5844c')}
        {cara(`rotateX(-90deg) translateZ(${L / 2}px)`, '#8f6232')}
        {cara(`rotateY(90deg) translateZ(${L / 2}px)`, '#c4925a')}
        {cara(`translateZ(${L / 2}px)`, '#d9a86c', <FotoLogo marca={M} size={240} borde={8} sombra={false} />)}
        <div style={{ position: 'absolute', top: 0, left: 0, width: L, height: 0, transformStyle: 'preserve-3d', transform: `translateZ(${-L / 2}px)` }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: L, height: L, transformOrigin: '50% 0', transform: `rotateX(${90 + tapa}deg)`, background: '#e3b77d', border: '3px solid rgba(0,0,0,0.1)' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 11 · Logo moneda (firma de cierre) ----------------
const Moneda = () => {
  const f = useCurrentFrame();
  const giro = interpolate(f, [10, 70], [0, 540], { ...cl, easing: t => 1 - Math.pow(1 - t, 3) });
  const D = 560;
  return (
    <AbsoluteFill style={{ background: fondoCrema, perspective: 2000 }}>
      <div style={{ position: 'absolute', left: 540 - D / 2, top: 660, width: D, height: D, transformStyle: 'preserve-3d', transform: `rotateY(${giro}deg)` }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: i % 2 ? '#d7c7b0' : '#e8dccb', transform: `translateZ(${-i * 2.4}px)` }} />)}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}><FotoLogo marca={M} size={D} borde={22} sombra={false} /></div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#25d366', backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(32px)', display: 'grid', placeItems: 'center', color: '#fff', textAlign: 'center' }}>
          <div><div style={{ fontSize: 140 }}>💬</div><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 64, lineHeight: 1.05 }}>Pedí por<br />WhatsApp</div></div>
        </div>
      </div>
      <Centro top={1300}><div style={{ fontFamily: NUNITO, fontWeight: 900, fontSize: 110, color: C.texto, letterSpacing: '-0.03em', opacity: lin(f, 60, 74) }}>Migas<span style={{ color: C.acento }}>Ok</span></div></Centro>
    </AbsoluteFill>
  );
};

// ---------------- 12 · Fiestas ----------------
const Fiestas = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#140c08' }}>
      {foto(F.miga1, { position: 'absolute', width: 1080, height: 1920, opacity: 0.55, transform: `scale(${1.1 - 0.06 * lin(f, 0, 120)})` })}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(20,12,8,0.85), rgba(20,12,8,0.2) 45%, rgba(20,12,8,0.85))' }} />
      {Array.from({ length: 70 }, (_, i) => {
        const r = (k: number) => { const v = Math.sin((i + k) * 91.7) * 43758.5; return v - Math.floor(v); };
        return <div key={i} style={{ position: 'absolute', left: r(1) * 1080 + Math.sin(f / 20 + i) * 20, top: ((r(2) * 1920 + f * (3 + r(3) * 4)) % 1980) - 40, width: 6 + r(4) * 10, height: 6 + r(4) * 10, borderRadius: '50%', background: '#fff', opacity: 0.5 + r(5) * 0.5 }} />;
      })}
      <Sp d={8}>{s => <Centro top={330} st={{ opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}><div style={{ fontFamily: M.fuente.display, fontWeight: 700, fontSize: 100, color: '#fff', lineHeight: 1.05 }}>Reservá tu bandeja<br /><em style={{ color: '#f2c06b' }}>para las fiestas</em></div></Centro>}</Sp>
      <Sp d={40}>{s => <Centro top={1350} st={{ opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}><div style={{ display: 'inline-block', padding: '22px 40px', borderRadius: 22, background: C.acento, color: '#fff', fontFamily: NUNITO, fontWeight: 900, fontSize: 56 }}>🎄 Cupos limitados</div></Centro>}</Sp>
    </AbsoluteFill>
  );
};

const ESCENAS: [string, React.FC][] = [
  ['La pila infinita', PilaInfinita], ['Capa por capa', CapaPorCapa], ['Antes / con MigasOk', AntesDespues], ['Testimonios', Testimonios],
  ['Calculadora de miga', Calculadora], ['Menú de gustos', Menu], ['Tipografía cinética', Cinetica], ['Ilustración animada', Ilustrado],
  ['Bandeja giratoria 3D', Bandeja], ['Caja 3D que se abre', Caja], ['Logo moneda 3D', Moneda], ['Fiestas', Fiestas],
];

export const MuestrarioMigas: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: M.fuente.texto }}>
      {ESCENAS.map(([titulo, Escena], i) => (
        <Sequence key={titulo} from={i * ESC} durationInFrames={ESC}>
          <AbsoluteFill style={{ opacity: lin(f - i * ESC, 0, 6) }}><Escena /></AbsoluteFill>
          <div style={{ position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(20,14,10,0.82)', color: '#fff', borderRadius: 999, padding: '12px 28px', fontSize: 30, fontWeight: 700 }}>Idea {i + 1} · {titulo}</div>
          </div>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
