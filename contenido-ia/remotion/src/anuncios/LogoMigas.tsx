// Logo de MigasOk armado para los anuncios: foto del sándwich + nombre y eslogan tipográficos.
import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MIGASOK } from './migasok';

const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const FotoLogo: React.FC<{ marca: typeof MIGASOK; size: number; borde?: number; sombra?: boolean }> = ({ marca, size, borde = 10, sombra = true }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', padding: borde, background: '#fff', boxSizing: 'border-box', boxShadow: sombra ? '0 24px 60px rgba(90,50,25,0.28)' : 'none' }}>
    <Img src={staticFile(marca.extra.logo)} style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block' }} />
  </div>
);

// Foto que entra con rebote, nombre que sube letra por letra y eslogan que aparece después.
export const LogoMigas: React.FC<{ marca: typeof MIGASOK; desde: number; foto?: number; nombre?: number }> = ({ marca, desde, foto = 360, nombre = 150 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { color, fuente } = marca;
  const s = spring({ frame: f - desde, fps, config: { damping: 11 } });
  const letras = 'MigasOk'.split('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -25}deg)` }}><FotoLogo marca={marca} size={foto} /></div>
      <div style={{ marginTop: 26, display: 'flex', fontFamily: fuente.texto, fontWeight: 700, fontSize: nombre, lineHeight: 1, letterSpacing: '-0.035em' }}>
        {letras.map((l, i) => {
          const sl = spring({ frame: f - desde - 8 - i * 2, fps, config: { damping: 12, mass: 0.5 } });
          return <span key={i} style={{ display: 'inline-block', color: i >= 5 ? color.acento : color.texto, opacity: Math.min(1, sl * 1.5), transform: `translateY(${(1 - sl) * 50}px)` }}>{l}</span>;
        })}
      </div>
      <div style={{ marginTop: 12, fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: nombre * 0.34, color: color.acento2, opacity: interpolate(f, [desde + 24, desde + 36], [0, 1], cl), transform: `translateY(${interpolate(f, [desde + 24, desde + 36], [14, 0], cl)}px)` }}>
        {marca.extra.eslogan}
      </div>
    </div>
  );
};
