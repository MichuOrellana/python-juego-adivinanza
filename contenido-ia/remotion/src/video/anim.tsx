// Utilidades de animación para Reels.
import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, fuente } from '../marca/tema';

export const useEntrada = (delay: number, damping = 200) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } });
};

export const rango = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 1, 0.68, 1) });

// Aparece subiendo y desenfocándose a nítido.
export const Rev: React.FC<{ delay: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties; inline?: boolean }> = ({ delay, children, dy = 34, style, inline }) => {
  const v = useEntrada(delay);
  return (
    <div style={{ display: inline ? 'inline-block' : 'block', opacity: v, transform: `translateY(${(1 - v) * dy}px)`, filter: `blur(${(1 - v) * 10}px)`, ...style }}>{children}</div>
  );
};

// Título que entra palabra por palabra; *texto* = itálica ámbar. "\n" = salto de línea.
export const TituloAnim: React.FC<{ texto: string; delay?: number; size?: number; paso?: number; style?: React.CSSProperties; align?: 'left' | 'center' }> = ({ texto, delay = 0, size = 96, paso = 3, style, align = 'left' }) => {
  let i = 0;
  const lineas = texto.split('\n');
  return (
    <h1 style={{ margin: 0, fontFamily: fuente.serif, fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.01em', color: color.crema, textAlign: align, ...style }}>
      {lineas.map((linea, li) => (
        <div key={li}>
          {linea.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((seg, si) => {
            const em = seg.startsWith('*');
            return (em ? seg.slice(1, -1) : seg).split(/(\s+)/).filter(Boolean).map((w, wi) =>
              /^\s+$/.test(w) ? <span key={`${si}-${wi}`}> </span> : (
                <Rev key={`${si}-${wi}`} inline delay={delay + paso * i++} dy={40}>
                  {em ? <em style={{ color: color.ambar }}>{w}</em> : w}
                </Rev>
              ));
          })}
        </div>
      ))}
    </h1>
  );
};
