// Piezas animadas del Reel "Chatbot vs. Agente".
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, fuente } from '../marca/tema';
import { rango, useEntrada } from './anim';

export const Pop: React.FC<{ delay: number; origen?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, origen = 'center', children, style }) => {
  const v = useEntrada(delay, 14);
  const o = Math.min(1, useEntrada(delay));
  return <div style={{ opacity: o, transform: `scale(${0.82 + 0.18 * v}) translateY(${(1 - o) * 24}px)`, transformOrigin: origen, ...style }}>{children}</div>;
};

export const Escribiendo: React.FC<{ desde: number; hasta: number }> = ({ desde, hasta }) => {
  const f = useCurrentFrame();
  if (f < desde || f >= hasta) return null;
  const o = Math.min(rango(f, desde, desde + 6), rango(f, hasta - 4, hasta, 1, 0));
  return (
    <div style={{ display: 'flex', opacity: o }}>
      <div style={{ padding: '26px 32px', borderRadius: '26px 26px 26px 6px', background: 'rgba(255,240,220,0.05)', border: '1px solid rgba(243,230,208,0.12)', display: 'flex', gap: 12 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: color.apagado, transform: `translateY(${-6 * Math.max(0, Math.sin((f - desde) * 0.35 - i * 0.9))}px)` }} />
        ))}
      </div>
    </div>
  );
};

// Ciclo del agente animado: nodos aparecen, flechas se dibujan y un punto de luz recorre el ciclo.
export const CicloAnim: React.FC<{ delay: number }> = ({ delay }) => {
  const f = useCurrentFrame() - delay;
  const W = 860, H = 500, cx = W / 2, cy = 250, rx = 300, ry = 175;
  const pos = (a: number) => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)];
  const pasos = [{ t: 'Planifica', a: -90 }, { t: 'Actúa', a: 0 }, { t: 'Verifica', a: 90 }, { t: 'Ajusta', a: 180 }];
  const arco = (a0: number) => {
    const [x0, y0] = pos(a0 + 22), [x1, y1] = pos(a0 + 90 - 22);
    return `M ${x0} ${y0} A ${rx} ${ry} 0 0 1 ${x1} ${y1}`;
  };
  const viaje = f > 60 ? ((f - 60) * 5.5 - 90) : null; // grados
  const activo = viaje === null ? -1 : Math.floor((((viaje + 90 + 45) % 360) + 360) % 360 / 90);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', alignSelf: 'center' }}>
      <defs>
        <marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={color.ambar} /></marker>
        <radialGradient id="br"><stop offset="0" stopColor="rgba(232,180,106,0.4)" /><stop offset="1" stopColor="rgba(232,180,106,0)" /></radialGradient>
        <radialGradient id="pt"><stop offset="0" stopColor="#fff4dc" /><stop offset="0.3" stopColor="rgba(255,200,120,0.9)" /><stop offset="1" stopColor="rgba(255,180,90,0)" /></radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={160} ry={100} fill="url(#br)" opacity={rango(f, 0, 20)} />
      {[-90, 0, 90, 180].map((a, i) => {
        const p = rango(f, 18 + i * 8, 40 + i * 8);
        return <path key={a} d={arco(a)} fill="none" stroke={color.ambar} strokeWidth={2.5} strokeOpacity={0.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} markerEnd={p > 0.98 ? 'url(#fl)' : undefined} />;
      })}
      <g opacity={rango(f, 0, 14)} transform={`translate(0 ${(1 - rango(f, 0, 14)) * 12})`}>
        <text x={cx} y={cy - 4} textAnchor="middle" fontFamily={fuente.serif} fontStyle="italic" fontSize={58} fill={color.ambar}>Objetivo</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fontFamily={fuente.sans} fontSize={20} letterSpacing="4" fill={color.apagado}>HASTA TERMINAR</text>
      </g>
      {viaje !== null && (() => { const [x, y] = pos(viaje); return <circle cx={x} cy={y} r={38} fill="url(#pt)" />; })()}
      {pasos.map((p, i) => {
        const [x, y] = pos(p.a);
        const s = rango(f, 10 + i * 8, 24 + i * 8);
        const on = activo === i;
        return (
          <g key={p.t} opacity={s} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * s})`}>
            <rect x={-118} y={-38} width={236} height={76} rx={38} fill={on ? 'rgba(232,180,106,0.22)' : color.fondo2} stroke={on ? color.ambar : 'rgba(232,180,106,0.5)'} strokeWidth={on ? 2.5 : 1.5} />
            <text y={11} textAnchor="middle" fontFamily={fuente.sans} fontWeight={500} fontSize={31} fill={on ? '#fff4dc' : color.crema}>{p.t}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const PasoAnim: React.FC<{ n: number; quien: 'vos' | 'ia'; delay: number; children: React.ReactNode }> = ({ n, quien, delay, children }) => {
  const v = useEntrada(delay);
  const ia = quien === 'ia';
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', fontSize: 29, lineHeight: 1.3, fontWeight: 300, color: ia ? color.crema : color.apagado, opacity: v, transform: `translateX(${(1 - v) * -24}px)` }}>
      <span style={{ flex: '0 0 40px', height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 500,
        background: ia ? `rgba(232,180,106,${0.25 * v})` : 'transparent',
        border: `1px solid ${ia ? color.ambar : 'rgba(168,151,127,0.5)'}`, color: ia ? color.ambar : color.apagado }}>{ia && v > 0.9 ? '✓' : n}</span>
      <span style={{ paddingTop: 2 }}>{children}</span>
    </div>
  );
};

// Contador circular para el dato.
export const Anillo: React.FC<{ desde: number; hasta: number; valor: number; size: number }> = ({ desde, hasta, valor, size }) => {
  const f = useCurrentFrame();
  const p = rango(f, desde, hasta);
  const r = size / 2 - 14, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, alignSelf: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(243,230,208,0.08)" strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color.ambar} strokeWidth={10} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (p * valor) / 100)} style={{ filter: 'drop-shadow(0 0 12px rgba(232,180,106,0.6))' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: fuente.serif, fontSize: size * 0.36, color: color.ambar, letterSpacing: '-0.03em' }}>
        {Math.round(p * valor)}%
      </div>
    </div>
  );
};
