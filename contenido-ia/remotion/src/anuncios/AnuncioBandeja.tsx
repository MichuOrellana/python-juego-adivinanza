// Anuncio "Bandeja giratoria" para MigasOk · 9:16 · 15 s.
// Bandeja dorada en 3D (CSS) con fotos reales alrededor; se frena en cada foto para mostrar una ocasión.
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import type { MIGASOK } from './migasok';
import { FotoLogo } from './LogoMigas';

export const DURACION_BANDEJA = 450;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const suave = Easing.bezier(0.65, 0, 0.35, 1);
const ORO = '#f2c06b', CREMA = '#f6e7cf';

// Ocasiones: cada parada de la bandeja muestra la foto i con este texto.
const PARADAS: { foto: number; antes: string; destacado: string; emoji: string }[] = [
  { foto: 0, antes: 'Para el', destacado: 'cumple', emoji: '🎂' },
  { foto: 1, antes: 'Para', destacado: 'mamá', emoji: '💐' },
  { foto: 2, antes: 'Para la', destacado: 'oficina', emoji: '💼' },
  { foto: 3, antes: 'Para las', destacado: 'fiestas', emoji: '🎄' },
];
const INICIO_PARADAS = 90, PASO = 60, VIAJE = 20;
const N = 6, SEP = 360 / N;

// Ángulo de la bandeja en cada cuadro: giro lento de entrada, paradas, giro rápido final.
function giro(f: number) {
  if (f < INICIO_PARADAS) return interpolate(f, [0, INICIO_PARADAS], [120, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const t = f - INICIO_PARADAS;
  const k = Math.min(PARADAS.length - 1, Math.floor(t / PASO));
  const dentro = t - k * PASO;
  if (t < PARADAS.length * PASO) {
    const desde = -SEP * (k === 0 ? 0 : PARADAS[k - 1].foto), hasta = -SEP * PARADAS[k].foto;
    return k === 0 ? 0 : interpolate(dentro, [0, VIAJE], [desde, hasta], { ...cl, easing: suave });
  }
  const fin = -SEP * PARADAS[PARADAS.length - 1].foto;
  return fin - interpolate(f, [330, 372], [0, 360], { ...cl, easing: suave });
}

const Destello: React.FC<{ x: number; y: number; d: number; size: number }> = ({ x, y, d, size }) => {
  const f = useCurrentFrame();
  const t = ((f + d) % 50) / 50;
  const s = Math.sin(Math.PI * t);
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ position: 'absolute', left: x, top: y, opacity: s, transform: `scale(${0.4 + s}) rotate(${f * 2}deg)` }}>
      <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="#fff4d6" />
    </svg>
  );
};

export const AnuncioBandeja: React.FC<{ marca: typeof MIGASOK }> = ({ marca }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { color, fuente, extra } = marca;
  const F = extra.fotos;
  const fotos = [F.miga1, F.budin1, F.apertura, F.budin2, F.miga2, extra.logo];

  const sube = spring({ frame: f - 4, fps, config: { damping: 14, mass: 1 } });
  const ang = giro(f);
  const salida = interpolate(f, [372, 396], [0, 1], { ...cl, easing: suave });
  const tituloOp = interpolate(f, [12, 24, INICIO_PARADAS - 8, INICIO_PARADAS], [0, 1, 1, 0], cl);
  const parada = Math.floor((f - INICIO_PARADAS) / PASO);
  const enParadas = f >= INICIO_PARADAS && f < INICIO_PARADAS + PARADAS.length * PASO;
  const remate = interpolate(f, [334, 346, 366, 376], [0, 1, 1, 0], cl);
  const logo = spring({ frame: f - 384, fps, config: { damping: 12 } });
  const boton = spring({ frame: f - 400, fps, config: { damping: 12 } });
  const pulso = 1 + 0.04 * Math.sin((f - 410) / 4) * interpolate(f, [412, 420], [0, 1], cl);
  const luz = 0.55 + 0.1 * Math.sin(f / 12);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 62%, #3d2417, #1a0f0a 72%)', overflow: 'hidden', fontFamily: fuente.texto }}>
      {/* haz de luz */}
      <div style={{ position: 'absolute', left: 140, right: 140, top: -200, height: 1700, clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)', background: `linear-gradient(180deg, rgba(255,226,170,${0.18 * luz}), rgba(255,226,170,0))`, opacity: interpolate(f, [0, 30], [0, 1], cl) * (1 - salida * 0.6) }} />

      {/* bandeja + fotos */}
      <div style={{ position: 'absolute', inset: 0, perspective: 1600, opacity: 1 - salida, transform: `translateY(${(1 - sube) * 700 + salida * 500}px) scale(${1 - salida * 0.3})` }}>
        <div style={{ position: 'absolute', left: 540, top: 1060, transformStyle: 'preserve-3d', transform: 'rotateX(-12deg)' }}>
          <div style={{ position: 'absolute', left: -440, top: -290, width: 880, height: 880, borderRadius: '50%', transform: 'rotateX(90deg)',
            background: `conic-gradient(from ${f * 2}deg, #c9962f, #f7d98a, #b8862a, #f9e3a3, #c9962f, #e8c066, #c9962f)`, boxShadow: '0 0 90px rgba(242,192,107,0.45), inset 0 0 0 18px rgba(255,236,190,0.35)' }} />
          {fotos.map((src, i) => {
            const a = i * SEP + ang;
            const norm = ((a % 360) + 540) % 360 - 180; // -180..180, 0 = de frente
            const frente = enParadas && PARADAS[parada]?.foto === i ? interpolate(Math.abs(norm), [0, 25], [1, 0], cl) : 0;
            const llega = spring({ frame: f - 14 - i * 4, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{
                position: 'absolute', left: -150, top: -240, width: 300, height: 380, borderRadius: 22, overflow: 'hidden',
                border: `8px solid ${frente > 0.5 ? ORO : '#fff'}`, boxShadow: `0 20px 40px rgba(0,0,0,0.45), 0 0 ${60 * frente}px rgba(242,192,107,${0.8 * frente})`,
                transform: `rotateY(${a}deg) translateZ(${340 + 60 * frente}px) scale(${llega * (1 + 0.22 * frente)})`,
              }}>
                <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })}
        </div>
        {[[230, 1000, 0, 34], [820, 960, 17, 28], [300, 1330, 31, 22], [760, 1360, 8, 30], [540, 1430, 23, 20], [140, 1180, 40, 18], [930, 1220, 12, 24]].map(([x, y, d, s], i) => <Destello key={i} x={x} y={y} d={d} size={s} />)}
      </div>

      {/* título de apertura */}
      <div style={{ position: 'absolute', top: 360, left: 60, right: 60, textAlign: 'center', opacity: tituloOp }}>
        <div style={{ fontFamily: fuente.display, fontWeight: 700, fontSize: 104, lineHeight: 1.05, color: CREMA, transform: `translateY(${interpolate(f, [12, 30], [30, 0], cl)}px)` }}>
          Bandejas para<br /><em style={{ fontStyle: 'italic', fontWeight: 600, color: ORO }}>cada ocasión</em>
        </div>
      </div>

      {/* ocasiones */}
      {PARADAS.map((p, k) => {
        const t0 = INICIO_PARADAS + k * PASO;
        const o = interpolate(f, [t0 + (k ? VIAJE - 6 : 0), t0 + (k ? VIAJE + 4 : 10), t0 + PASO - 4, t0 + PASO + 2], [0, 1, 1, 0], cl);
        if (o <= 0) return null;
        const s = spring({ frame: f - t0 - (k ? VIAJE - 6 : 0), fps, config: { damping: 11 } });
        return (
          <div key={k} style={{ position: 'absolute', top: 360, left: 40, right: 40, textAlign: 'center', opacity: o }}>
            <div style={{ fontFamily: fuente.texto, fontWeight: 500, fontSize: 56, color: CREMA, letterSpacing: '0.02em' }}>{p.antes}</div>
            <div style={{ fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 170, lineHeight: 1, color: ORO, transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 40}px)` }}>
              {p.destacado} <span style={{ fontStyle: 'normal', fontSize: 120 }}>{p.emoji}</span>
            </div>
          </div>
        );
      })}

      {/* remate */}
      <div style={{ position: 'absolute', top: 380, left: 60, right: 60, textAlign: 'center', opacity: remate, transform: `scale(${0.9 + 0.1 * remate})` }}>
        <div style={{ fontFamily: fuente.display, fontWeight: 700, fontSize: 92, lineHeight: 1.08, color: CREMA }}>
          Sándwiches de miga<br /><span style={{ color: ORO }}>+</span> <em style={{ fontWeight: 600, color: ORO }}>budines caseros</em>
        </div>
      </div>

      {/* cierre */}
      {f >= 380 && (
        <div style={{ position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -25}deg)`, filter: 'drop-shadow(0 0 50px rgba(242,192,107,0.35))' }}><FotoLogo marca={marca} size={380} borde={12} /></div>
          <div style={{ marginTop: 34, fontFamily: fuente.texto, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: '-0.035em', color: CREMA, opacity: Math.min(1, logo * 1.4) }}>
            Migas<span style={{ color: color.acento }}>Ok</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: ORO, opacity: interpolate(f, [396, 408], [0, 1], cl) }}>{extra.eslogan}</div>
          <div style={{ marginTop: 60, opacity: boton, transform: `translateY(${(1 - boton) * 60}px) scale(${pulso})`, display: 'flex', alignItems: 'center', gap: 18, padding: '28px 60px', borderRadius: 999, background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 50, boxShadow: '0 18px 44px rgba(37,211,102,0.3)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
            Pedí por WhatsApp
          </div>
          <div style={{ marginTop: 22, fontWeight: 500, fontSize: 30, color: CREMA, opacity: boton * 0.75 }}>{marca.textos.cta.pie}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
