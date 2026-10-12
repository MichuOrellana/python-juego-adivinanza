// Anuncio Día de la Madre (borrador para MigasOk) · 9:16 · 15 s · fotos reales con movimiento.
import React from 'react';
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Palabras, Tramo } from './AnuncioProducto';
import type { MIGASOK } from './migasok';

export const DURACION_DIA_MADRE = 450;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
type Marca = typeof MIGASOK;

// Paleta para texto sobre foto: blanco con sombra y acento más luminoso.
const sobreFoto = (m: Marca): Marca => ({ ...m, color: { ...m.color, texto: '#ffffff', acento: '#ff8a6e' } });
const sombraTexto = '0 4px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)';

// Foto a pantalla completa con zoom y paneo lentos (efecto Ken Burns).
const FotoPlena: React.FC<{ src: string; dur: number; zoom: [number, number]; pan?: [number, number]; foco?: string }> = ({ src, dur, zoom, pan = [0, 0], foco = 'center' }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], cl);
  const entra = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: entra, overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * p}) translate(${pan[0] * p}px, ${pan[1] * p}px)` }} />
    </AbsoluteFill>
  );
};

// Foto en tarjeta tipo polaroid que entra volando y queda levemente inclinada.
const Tarjeta: React.FC<{ src: string; desde: number; x: number; y: number; w: number; h: number; rot: number; desdeLado?: 1 | -1; foco?: string }> = ({ src, desde, x, y, w, h, rot, desdeLado = 1, foco = 'center' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 14, mass: 0.8 } });
  const flota = Math.sin((f - desde) / 22) * 6;
  return (
    <div style={{
      position: 'absolute', left: x, top: y + flota, width: w, height: h, padding: 14, background: '#fff', borderRadius: 26,
      boxShadow: '0 30px 60px rgba(70,40,20,0.28), 0 8px 18px rgba(70,40,20,0.18)',
      transform: `translateX(${(1 - s) * 900 * desdeLado}px) rotate(${rot + (1 - s) * 18 * desdeLado}deg)`, opacity: Math.min(1, s * 2),
    }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, borderRadius: 16, transform: `scale(${1.06 - 0.06 * interpolate(f - desde, [0, 120], [0, 1], cl)})` }} />
    </div>
  );
};

// Fondo crema de la marca con corazones suaves.
const FondoMarca: React.FC<{ marca: Marca }> = ({ marca }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${marca.color.fondo2}, ${marca.color.fondo} 80%)` }}>
      {Array.from({ length: 12 }, (_, i) => {
        const r = (k: number) => { const v = Math.sin((i + k) * 127.1) * 43758.5; return v - Math.floor(v); };
        const per = 260 + r(1) * 160, t = ((f + r(2) * per) % per) / per;
        return (
          <svg key={i} width={40 + r(3) * 40} viewBox="0 0 24 22" style={{ position: 'absolute', left: `${r(4) * 92}%`, top: `${105 - t * 115}%`, opacity: 0.18 + 0.2 * Math.sin(Math.PI * t), transform: `rotate(${(r(5) - 0.5) * 40}deg)` }}>
            <path d="M12 21.6 1.9 11.5A6 6 0 0 1 12 3.3a6 6 0 0 1 10.1 8.2Z" fill={i % 2 ? marca.color.acento : '#f3a497'} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

const Escena: React.FC<{ desde: number; dur: number; children: React.ReactNode }> = ({ desde, dur, children }) => (
  <Sequence from={desde} durationInFrames={dur}>{children}</Sequence>
);

export const AnuncioDiaMadre: React.FC<{ marca: Marca }> = ({ marca }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { color, fuente, textos, extra } = marca;
  const mF = sobreFoto(marca);
  const sello = spring({ frame: f - 6, fps, config: { damping: 10 } });
  const combo = spring({ frame: f - 272, fps, config: { damping: 10, mass: 0.7 } });
  const boton = spring({ frame: f - 368, fps, config: { damping: 12 } });
  const pulso = 1 + 0.04 * Math.sin((f - 380) / 4) * interpolate(f, [385, 395], [0, 1], cl);
  const degradeArriba = <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(25,12,6,0.75) 0%, rgba(25,12,6,0.35) 30%, rgba(25,12,6,0) 48%)' }} />;

  return (
    <AbsoluteFill style={{ background: color.fondo, overflow: 'hidden', fontFamily: fuente.texto }}>
      {/* 1 · gancho sobre foto */}
      <Escena desde={0} dur={86}><FotoPlena src={extra.fotos.apertura} dur={86} zoom={[1.18, 1.02]} pan={[0, -30]} />{degradeArriba}</Escena>

      {/* 2 · sándwiches en tarjetas */}
      <Escena desde={78} dur={92}>
        <FondoMarca marca={marca} />
        <Tarjeta src={extra.fotos.miga1} desde={4} x={90} y={640} w={900} h={700} rot={-3} desdeLado={-1} />
        <Tarjeta src={extra.fotos.miga2} desde={16} x={300} y={1240} w={680} h={420} rot={4} />
      </Escena>

      {/* 3 · budín sobre foto + tarjeta */}
      <Escena desde={164} dur={108}>
        <FotoPlena src={extra.fotos.budin1} dur={108} zoom={[1.0, 1.14]} pan={[-20, 40]} foco="60% 50%" />
        {degradeArriba}
        <Tarjeta src={extra.fotos.budin2} desde={40} x={560} y={1120} w={420} h={480} rot={5} />
      </Escena>

      {/* 4 · combo: miga + budín */}
      <Escena desde={266} dur={100}>
        <FondoMarca marca={marca} />
        <Tarjeta src={extra.fotos.apertura} desde={10} x={70} y={900} w={470} h={620} rot={-6} desdeLado={-1} foco="50% 40%" />
        <Tarjeta src={extra.fotos.budin1} desde={18} x={540} y={930} w={470} h={620} rot={5} foco="55% 55%" />
        <div style={{ position: 'absolute', left: 470, top: 1130, width: 140, height: 140, borderRadius: 70, background: color.acento, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 96, fontWeight: 700, lineHeight: 1, boxShadow: '0 14px 30px rgba(216,67,47,0.4)', transform: `scale(${spring({ frame: f - 266 - 30, fps, config: { damping: 9 } })})` }}>+</div>
      </Escena>

      {/* 5 · cierre */}
      <Escena desde={360} dur={90}>
        <FondoMarca marca={marca} />
        <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26 }}>
          {[extra.fotos.miga1, extra.fotos.budin1, extra.fotos.apertura].map((src, i) => {
            const s = spring({ frame: f - 372 - i * 5, fps, config: { damping: 12 } });
            return <Img key={src} src={staticFile(src)} style={{ width: 200, height: 200, borderRadius: 100, objectFit: 'cover', border: '10px solid #fff', boxShadow: '0 16px 36px rgba(70,40,20,0.25)', transform: `scale(${s}) translateY(${i === 1 ? -30 : 0}px)` }} />;
          })}
        </div>
      </Escena>

      {/* sello de la fecha */}
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [356, 366], [1, 0], cl) }}>
        <div style={{ transform: `scale(${sello}) rotate(${(1 - sello) * -10}deg)`, padding: '14px 30px', borderRadius: 999, background: color.acento, color: '#fff', fontWeight: 700, fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
          ♥ Día de la Madre · {extra.fecha}
        </div>
      </div>

      {/* textos */}
      <Tramo desde={0} hasta={78} top={310}>
        <div style={{ textShadow: sombraTexto }}>
          <Palabras texto={textos.gancho[0]} desde={10} marca={mF} size={80} />
          <Palabras texto={textos.gancho[1]} desde={20} marca={mF} size={124} paso={4} />
        </div>
      </Tramo>
      <Tramo desde={80} hasta={164} top={300}>
        <Palabras texto={`${textos.beneficios[0][0]} *${textos.beneficios[0][1]}*`} desde={86} marca={marca} size={84} paso={4} />
        <div style={{ marginTop: 16, fontSize: 38, fontWeight: 500, color: color.texto, opacity: interpolate(f, [110, 122], [0, 0.8], cl) }}>{extra.subMiga}</div>
      </Tramo>
      <Tramo desde={166} hasta={264} top={300}>
        <div style={{ textShadow: sombraTexto }}>
          <Palabras texto={`${textos.beneficios[1][0]} *${textos.beneficios[1][1]}*`} desde={172} marca={mF} size={104} paso={4} />
          <div style={{ marginTop: 16, fontSize: 40, fontWeight: 500, color: '#fff', opacity: interpolate(f, [196, 208], [0, 1], cl) }}>{extra.subBudin}</div>
        </div>
      </Tramo>
      <Tramo desde={268} hasta={358} top={300}>
        <div style={{ transform: `scale(${0.4 + 0.6 * combo}) rotate(${(1 - combo) * -8}deg)`, fontFamily: fuente.display, fontStyle: 'italic', fontWeight: 600, fontSize: 150, lineHeight: 1, color: color.acento }}>{extra.combo}</div>
        <div style={{ marginTop: 18, opacity: interpolate(f, [284, 296], [0, 1], cl) }}>
          <Palabras texto={extra.detalle} desde={284} marca={marca} size={56} paso={3} />
        </div>
        <div style={{ marginTop: 24, display: 'inline-block', padding: '16px 34px', borderRadius: 18, border: `3px solid ${color.acento2}`, color: color.acento2, fontWeight: 700, fontSize: 42, background: 'rgba(255,255,255,0.75)', opacity: interpolate(f, [304, 314], [0, 1], cl), transform: `translateY(${interpolate(f, [304, 314], [20, 0], cl)}px)` }}>
          {extra.precio ?? 'Consultá el precio'}
        </div>
      </Tramo>
      <Tramo desde={362} hasta={480} top={270}>
        <Img src={staticFile(extra.logo)} style={{ width: 480, height: 480, borderRadius: '50%', boxShadow: '0 26px 60px rgba(90,50,25,0.25)', opacity: Math.min(1, boton * 1.4), transform: `scale(${0.85 + 0.15 * boton})` }} />
      </Tramo>
      {f >= 368 && (
        <div style={{ position: 'absolute', top: 1250, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: boton, transform: `translateY(${(1 - boton) * 80}px)` }}>
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
