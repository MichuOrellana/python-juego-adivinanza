// Anuncio de producto 9:16 (15 s): gancho → producto 3D → beneficios → oferta → llamado a la acción.
import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MarcaAnuncio } from './marca';
import { TazaEscena } from './TazaEscena';

export const DURACION_ANUNCIO = 450;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const useMarca = (m: MarcaAnuncio) => m;

// Palabras que entran de a una con rebote. *texto* = destacado.
const Palabras: React.FC<{ texto: string; desde: number; marca: MarcaAnuncio; size: number; serif?: boolean; paso?: number }> = ({ texto, desde, marca, size, serif, paso = 3 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let i = 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: size * 0.26 }}>
      {texto.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((seg, si) => {
        const dest = seg.startsWith('*');
        return (dest ? seg.slice(1, -1) : seg).trim().split(/\s+/).map((w, wi) => {
          const s = spring({ frame: f - desde - paso * i++, fps, config: { damping: 11, mass: 0.6 } });
          return (
            <span key={`${si}-${wi}`} style={{
              display: 'inline-block', transform: `translateY(${(1 - s) * 60}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`, opacity: Math.min(1, s * 1.5),
              fontFamily: dest || serif ? marca.fuente.display : marca.fuente.texto,
              fontStyle: dest ? 'italic' : 'normal', fontWeight: dest ? 600 : 700,
              color: dest ? marca.color.acento : marca.color.texto, fontSize: size, lineHeight: 1.05,
            }}>{w}</span>
          );
        });
      })}
    </div>
  );
};

const Tramo: React.FC<{ desde: number; hasta: number; children: React.ReactNode; top: number }> = ({ desde, hasta, children, top }) => {
  const f = useCurrentFrame();
  if (f < desde - 1 || f > hasta + 10) return null;
  const sal = interpolate(f, [hasta - 2, hasta + 8], [0, 1], cl);
  return (
    <div style={{ position: 'absolute', top, left: 70, right: 70, textAlign: 'center', opacity: 1 - sal, transform: `translateY(${-80 * sal}px) scale(${1 - 0.08 * sal})` }}>
      {children}
    </div>
  );
};

const Logo: React.FC<{ marca: MarcaAnuncio; desde: number; size?: number }> = ({ marca, desde, size = 124 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 14 } });
  const linea = interpolate(f, [desde + 8, desde + 28], [0, 1], cl);
  return (
    <div style={{ transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
      <div style={{ fontFamily: marca.fuente.display, fontWeight: 700, fontSize: size, lineHeight: 1, color: marca.color.texto, letterSpacing: '-0.02em' }}>{marca.nombre}</div>
      <div style={{ height: 3, width: 260 * linea, margin: '22px auto 18px', background: marca.color.acento, borderRadius: 2 }} />
      <div style={{ fontFamily: marca.fuente.texto, fontWeight: 500, fontSize: 30, letterSpacing: '0.18em', textTransform: 'uppercase', color: marca.color.acento2, opacity: linea }}>{marca.bajada}</div>
    </div>
  );
};

const Beneficio: React.FC<{ marca: MarcaAnuncio; par: [string, string]; desde: number }> = ({ marca, par, desde }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 15, mass: 0.7 } });
  const sal = interpolate(f, [desde + 42, desde + 50], [0, 1], cl);
  if (f < desde - 1 || f > desde + 51) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${(1 - s) * 700 - sal * 700}px) rotate(${(1 - s) * 4}deg)`, opacity: 1 - sal }}>
      <div style={{ fontFamily: marca.fuente.texto, fontWeight: 700, fontSize: 62, color: marca.color.texto, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{par[0]}</div>
      <div style={{ fontFamily: marca.fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 132, lineHeight: 1.02, color: marca.color.acento }}>{par[1]}</div>
    </div>
  );
};

const Rayos: React.FC<{ marca: MarcaAnuncio; f: number }> = ({ marca, f }) => (
  <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) rotate(${f * 0.6}deg)`, opacity: 0.22 }}>
    {Array.from({ length: 18 }, (_, i) => (
      <path key={i} d="M0 0 L-40 -440 L40 -440 Z" fill={marca.color.acento2} transform={`rotate(${i * 20})`} />
    ))}
  </svg>
);

export const AnuncioProducto: React.FC<{ marca: MarcaAnuncio }> = ({ marca: m0 }) => {
  const marca = useMarca(m0);
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = marca.textos;
  const oferta = spring({ frame: f - 306, fps, config: { damping: 9, mass: 0.7 } });
  const pulso = 1 + 0.04 * Math.sin((f - 400) / 4) * interpolate(f, [405, 415], [0, 1], cl);
  const boton = spring({ frame: f - 398, fps, config: { damping: 12 } });
  const flash = interpolate(f, [52, 56, 66], [0, 0.35, 0], cl);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 58%, ${marca.color.fondo2}, ${marca.color.fondo} 72%)`, overflow: 'hidden' }}>
      {/* rayos detrás de la oferta */}
      {f > 300 && f < 400 && <div style={{ position: 'absolute', left: 0, right: 0, top: 230, height: 700, opacity: oferta }}><Rayos marca={marca} f={f} /></div>}

      <ThreeCanvas width={width} height={height} camera={{ fov: 36, position: [0, 2, 6.4] }} gl={{ antialias: true, alpha: true }}>
        <TazaEscena marca={marca} />
      </ThreeCanvas>

      {/* grano de película */}
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: 'overlay' }}>
        <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,236,210,${flash})` }} />

      {/* 1 · gancho */}
      <Tramo desde={0} hasta={54} top={360}>
        <Palabras texto={t.gancho[0]} desde={4} marca={marca} size={72} />
        <div style={{ height: 14 }} />
        <Palabras texto={t.gancho[1]} desde={16} marca={marca} size={150} serif paso={5} />
      </Tramo>

      {/* 2 · producto + logo */}
      <Tramo desde={60} hasta={148} top={300}><Logo marca={marca} desde={64} /></Tramo>

      {/* 3 · beneficios */}
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, height: 320 }}>
        {t.beneficios.map((b, i) => <Beneficio key={i} marca={marca} par={b} desde={152 + i * 50} />)}
      </div>
      {f >= 150 && f < 302 && (
        <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14 }}>
          {t.beneficios.map((_, i) => <span key={i} style={{ width: f >= 152 + i * 50 ? 46 : 14, height: 8, borderRadius: 4, background: f >= 152 + i * 50 ? marca.color.acento : 'rgba(244,231,211,0.25)' }} />)}
        </div>
      )}

      {/* 4 · oferta */}
      <Tramo desde={302} hasta={392} top={270}>
        <div style={{ transform: `scale(${0.3 + 0.7 * oferta}) rotate(${(1 - oferta) * -12}deg)`, fontFamily: marca.fuente.display, fontWeight: 700, fontSize: 300, lineHeight: 0.95, color: marca.color.acento, textShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>{t.oferta.numero}</div>
        <div style={{ marginTop: 6, opacity: interpolate(f, [318, 330], [0, 1], cl) }}>
          <Palabras texto={t.oferta.detalle} desde={318} marca={marca} size={64} />
        </div>
      </Tramo>
      {f >= 330 && f < 402 && (
        <div style={{ position: 'absolute', top: 700, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [330, 340, 392, 400], [0, 1, 1, 0], cl) }}>
          <div style={{ padding: '22px 44px', border: `3px dashed ${marca.color.acento2}`, borderRadius: 20, fontFamily: marca.fuente.texto, fontSize: 40, fontWeight: 500, color: marca.color.texto, letterSpacing: '0.04em', background: 'rgba(0,0,0,0.25)' }}>
            Código <b style={{ fontWeight: 700, color: marca.color.acento2, letterSpacing: '0.12em' }}>{t.oferta.codigo}</b>
          </div>
        </div>
      )}

      {/* 5 · llamado a la acción */}
      <Tramo desde={396} hasta={470} top={300}><Logo marca={marca} desde={398} size={112} /></Tramo>
      {f >= 398 && (
        <div style={{ position: 'absolute', top: 1360, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: boton, transform: `translateY(${(1 - boton) * 80}px)` }}>
          <div style={{ transform: `scale(${pulso})`, padding: '30px 70px', borderRadius: 999, background: marca.color.acento, color: marca.color.fondo, fontFamily: marca.fuente.texto, fontWeight: 700, fontSize: 52, boxShadow: `0 18px 50px ${marca.color.acento}66` }}>{t.cta.boton}</div>
          <div style={{ fontFamily: marca.fuente.texto, fontWeight: 500, fontSize: 30, color: marca.color.texto, opacity: 0.8 }}>{t.cta.pie}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
