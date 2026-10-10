// Marco común a todas las slides: fondo, cabecera, pie de madera con el @ grabado.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Madera } from './Madera';
import { HANDLE, color, fuente } from './tema';

export const ANCHO = 1080, ALTO = 1350, PIE = 104;

export const Marco: React.FC<{ tema: string; n: number; total: number; children: React.ReactNode; fondo?: React.ReactNode }> = ({ tema, n, total, children, fondo }) => (
  <AbsoluteFill style={{ background: color.fondo, fontFamily: fuente.sans, color: color.crema }}>
    {fondo}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(60,38,20,0.28), transparent 70%)' }} />
    {/* cabecera */}
    <div style={{ position: 'absolute', top: 64, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, fontWeight: 500, letterSpacing: '0.38em', color: color.ambar }}>
      <span>{tema.toUpperCase()}</span>
      <span style={{ color: color.apagado, letterSpacing: '0.2em' }}>{String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
    <div style={{ position: 'absolute', top: 108, left: 90, right: 90, height: 1, background: `linear-gradient(90deg, ${color.linea}, transparent)` }} />
    {/* contenido */}
    <div style={{ position: 'absolute', top: 150, left: 90, right: 90, bottom: PIE + 50, display: 'flex', flexDirection: 'column' }}>{children}</div>
    {/* pie de madera con texto grabado (pirograbado) */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: PIE, boxShadow: '0 -18px 40px rgba(0,0,0,0.6)' }}>
      <Madera ancho={ANCHO} alto={PIE} semilla={11} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,210,150,0.10), transparent 30%, rgba(0,0,0,0.35))' }} />
      <div style={{ position: 'absolute', inset: '0 90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 30, fontWeight: 500, letterSpacing: '0.06em', color: color.grabado, textShadow: '0 1px 0 rgba(255,214,160,0.22), 0 -1px 0 rgba(0,0,0,0.5)' }}>
        <span>{HANDLE}</span>
        <span style={{ fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 34, letterSpacing: 0 }}>{n < total ? 'deslizá →' : 'guardalo ✦'}</span>
      </div>
    </div>
  </AbsoluteFill>
);

// Título grande con palabra destacada en itálica ámbar: "Chatbot vs. *Agente*"
export const Titulo: React.FC<{ texto: string; size?: number; style?: React.CSSProperties }> = ({ texto, size = 96, style }) => (
  <h1 style={{ margin: 0, fontFamily: fuente.serif, fontWeight: 500, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.01em', color: color.crema, ...style }}>
    {texto.split(/(\*[^*]+\*)/).map((p, i) => p.startsWith('*') ? <em key={i} style={{ color: color.ambar }}>{p.slice(1, -1)}</em> : <React.Fragment key={i}>{p}</React.Fragment>)}
  </h1>
);

export const Parrafo: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{ margin: 0, fontSize: 36, lineHeight: 1.42, fontWeight: 300, color: color.crema, opacity: 0.92, ...style }}>{children}</p>
);

export const Destacado: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 500, color: color.ambar }}>{children}</b>;
