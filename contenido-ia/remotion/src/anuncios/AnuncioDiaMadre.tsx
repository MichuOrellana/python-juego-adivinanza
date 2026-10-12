// Anuncio Día de la Madre (borrador para MigasOk) · 9:16 · 15 s.
import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Palabras, Tramo } from './AnuncioProducto';
import { MigasEscena } from './MigasEscena';
import type { MIGASOK } from './migasok';

export const DURACION_DIA_MADRE = 450;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const AnuncioDiaMadre: React.FC<{ marca: typeof MIGASOK }> = ({ marca }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { color, fuente, textos, extra } = marca;
  const sello = spring({ frame: f - 6, fps, config: { damping: 10 } });
  const combo = spring({ frame: f - 272, fps, config: { damping: 10, mass: 0.7 } });
  const boton = spring({ frame: f - 372, fps, config: { damping: 12 } });
  const pulso = 1 + 0.04 * Math.sin((f - 380) / 4) * interpolate(f, [385, 395], [0, 1], cl);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 65% at 50% 55%, ${color.fondo2}, ${color.fondo} 75%)`, overflow: 'hidden', fontFamily: fuente.texto }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 38, position: [0, 3.4, 6.2] }} gl={{ antialias: true, alpha: true }}>
        <MigasEscena />
      </ThreeCanvas>

      {/* sello de la fecha, fijo arriba hasta el cierre */}
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [360, 372], [1, 0], cl) }}>
        <div style={{ transform: `scale(${sello}) rotate(${(1 - sello) * -10}deg)`, padding: '14px 30px', borderRadius: 999, background: color.acento, color: '#fff', fontWeight: 700, fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ♥ Día de la Madre · {extra.fecha}
        </div>
      </div>

      {/* 1 · gancho */}
      <Tramo desde={0} hasta={58} top={330}>
        <Palabras texto={textos.gancho[0]} desde={10} marca={marca} size={78} />
        <Palabras texto={textos.gancho[1]} desde={20} marca={marca} size={120} paso={4} />
      </Tramo>

      {/* 2 · sándwich */}
      <Tramo desde={62} hasta={172} top={330}>
        <Palabras texto={`${textos.beneficios[0][0]} *${textos.beneficios[0][1]}*`} desde={70} marca={marca} size={84} paso={4} />
        <div style={{ marginTop: 18, fontSize: 36, fontWeight: 500, color: color.texto, opacity: interpolate(f, [105, 120], [0, 0.75], cl) }}>Jamón · queso · tomate · lechuga</div>
      </Tramo>

      {/* 3 · budín */}
      <Tramo desde={176} hasta={262} top={330}>
        <Palabras texto={`${textos.beneficios[1][0]} *${textos.beneficios[1][1]}*`} desde={182} marca={marca} size={100} paso={4} />
        <div style={{ marginTop: 18, fontSize: 36, fontWeight: 500, color: color.texto, opacity: interpolate(f, [205, 220], [0, 0.75], cl) }}>Para acompañar el mate con mamá</div>
      </Tramo>

      {/* 4 · combo */}
      <Tramo desde={266} hasta={362} top={300}>
        <div style={{ transform: `scale(${0.4 + 0.6 * combo}) rotate(${(1 - combo) * -8}deg)` }}>
          <div style={{ fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 150, lineHeight: 1, color: color.acento }}>{extra.combo}</div>
        </div>
        <div style={{ marginTop: 20, opacity: interpolate(f, [285, 297], [0, 1], cl) }}>
          <Palabras texto={extra.detalle} desde={285} marca={marca} size={56} paso={3} />
        </div>
        <div style={{ marginTop: 26, display: 'inline-block', padding: '16px 34px', borderRadius: 18, border: `3px solid ${color.acento2}`, color: color.acento2, fontWeight: 700, fontSize: 42, opacity: interpolate(f, [305, 316], [0, 1], cl), transform: `translateY(${interpolate(f, [305, 316], [20, 0], cl)}px)`, background: 'rgba(255,255,255,0.6)' }}>
          {extra.precio ?? 'Consultá el precio'}
        </div>
      </Tramo>

      {/* 5 · cierre */}
      <Tramo desde={366} hasta={480} top={270}>
        <div style={{ fontFamily: fuente.display, fontWeight: 700, fontSize: 132, lineHeight: 1, color: color.texto, letterSpacing: '-0.02em', opacity: Math.min(1, boton * 1.4), transform: `scale(${0.85 + 0.15 * boton})` }}>
          Migas<span style={{ color: color.acento }}>Ok</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 48, color: color.acento2, opacity: interpolate(f, [380, 392], [0, 1], cl) }}>{extra.eslogan}</div>
      </Tramo>
      {f >= 372 && (
        <div style={{ position: 'absolute', top: 1370, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: boton, transform: `translateY(${(1 - boton) * 80}px)` }}>
          <div style={{ transform: `scale(${pulso})`, display: 'flex', alignItems: 'center', gap: 18, padding: '28px 60px', borderRadius: 999, background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 50, boxShadow: '0 18px 44px rgba(37,211,102,0.35)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
            {textos.cta.boton}
          </div>
          <div style={{ fontWeight: 500, fontSize: 30, color: color.texto, opacity: 0.75 }}>{textos.cta.pie}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
