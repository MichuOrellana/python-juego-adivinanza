// Piezas visuales reutilizables para carruseles.
import React from 'react';
import { color, fuente } from '../marca/tema';

export const Tarjeta: React.FC<{ children: React.ReactNode; acento?: boolean; style?: React.CSSProperties }> = ({ children, acento, style }) => (
  <div style={{
    background: acento ? 'linear-gradient(160deg, rgba(232,180,106,0.10), rgba(232,180,106,0.03))' : 'rgba(255,240,220,0.035)',
    border: `1px solid ${acento ? 'rgba(232,180,106,0.45)' : 'rgba(243,230,208,0.12)'}`,
    borderRadius: 22, padding: '34px 38px', ...style,
  }}>{children}</div>
);

export const Etiqueta: React.FC<{ children: React.ReactNode; acento?: boolean }> = ({ children, acento }) => (
  <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.3em', color: acento ? color.ambar : color.apagado, marginBottom: 18 }}>{children}</div>
);

export const Burbuja: React.FC<{ de: 'vos' | 'ia'; children: React.ReactNode }> = ({ de, children }) => (
  <div style={{ display: 'flex', justifyContent: de === 'vos' ? 'flex-end' : 'flex-start' }}>
    <div style={{
      maxWidth: 700, padding: '24px 30px', fontSize: 32, lineHeight: 1.35, fontWeight: 300,
      borderRadius: de === 'vos' ? '26px 26px 6px 26px' : '26px 26px 26px 6px',
      background: de === 'vos' ? 'rgba(232,180,106,0.16)' : 'rgba(255,240,220,0.05)',
      border: `1px solid ${de === 'vos' ? 'rgba(232,180,106,0.4)' : 'rgba(243,230,208,0.12)'}`,
      color: color.crema,
    }}>
      <div style={{ fontSize: 19, fontWeight: 500, letterSpacing: '0.24em', color: de === 'vos' ? color.ambar : color.apagado, marginBottom: 10 }}>{de === 'vos' ? 'VOS' : 'CHATBOT'}</div>
      {children}
    </div>
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ padding: '12px 24px', borderRadius: 999, border: `1px solid ${color.linea}`, fontSize: 26, color: color.crema, background: 'rgba(232,180,106,0.06)' }}>{children}</span>
);

// Ciclo del agente: Objetivo → Planifica → Actúa → Verifica ↺
export const CicloAgente: React.FC = () => {
  const W = 900, H = 470, cx = W / 2, cy = 250, rx = 300, ry = 170;
  const pasos = [
    { t: 'Planifica', a: -90 }, { t: 'Actúa', a: 0 }, { t: 'Verifica', a: 90 }, { t: 'Ajusta', a: 180 },
  ].map(p => ({ ...p, x: cx + rx * Math.cos((p.a * Math.PI) / 180), y: cy + ry * Math.sin((p.a * Math.PI) / 180) }));
  const arco = (a0: number, a1: number) => {
    const r = (a: number) => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = r(a0 + 22), [x1, y1] = r(a1 - 22);
    return `M ${x0} ${y0} A ${rx} ${ry} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ alignSelf: 'center', overflow: 'visible' }}>
      <defs>
        <marker id="flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={color.ambar} />
        </marker>
        <radialGradient id="brillo"><stop offset="0" stopColor="rgba(232,180,106,0.35)" /><stop offset="1" stopColor="rgba(232,180,106,0)" /></radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={150} ry={95} fill="url(#brillo)" />
      {[-90, 0, 90, 180].map((a, i) => <path key={i} d={arco(a, a + 90)} fill="none" stroke={color.ambar} strokeWidth={2.5} strokeOpacity={0.75} markerEnd="url(#flecha)" />)}
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily={fuente.serif} fontStyle="italic" fontSize={54} fill={color.ambar}>Objetivo</text>
      <text x={cx} y={cy + 34} textAnchor="middle" fontFamily={fuente.sans} fontSize={20} letterSpacing="4" fill={color.apagado}>HASTA TERMINAR</text>
      {pasos.map(p => (
        <g key={p.t}>
          <rect x={p.x - 112} y={p.y - 36} width={224} height={72} rx={36} fill={color.fondo2} stroke="rgba(232,180,106,0.55)" strokeWidth={1.5} />
          <text x={p.x} y={p.y + 11} textAnchor="middle" fontFamily={fuente.sans} fontWeight={500} fontSize={30} fill={color.crema}>{p.t}</text>
        </g>
      ))}
    </svg>
  );
};

export const Paso: React.FC<{ n: number; quien: 'vos' | 'ia'; children: React.ReactNode }> = ({ n, quien, children }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', fontSize: 29, lineHeight: 1.3, fontWeight: 300, color: quien === 'ia' ? color.crema : color.apagado }}>
    <span style={{ flex: '0 0 40px', height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 500,
      border: `1px solid ${quien === 'ia' ? color.ambar : 'rgba(168,151,127,0.5)'}`, color: quien === 'ia' ? color.ambar : color.apagado }}>{n}</span>
    <span style={{ paddingTop: 2 }}>{children}</span>
  </div>
);
