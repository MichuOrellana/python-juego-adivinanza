// Anuncio "historia en chat" 9:16: un problema contado por mensajes → la marca lo resuelve por WhatsApp → eslogan → logo.
// El guion es una lista de mensajes, así que sirve para cualquier marca.
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MIGASOK } from './migasok';

type Marca = typeof MIGASOK;
export type Mensaje =
  | { lado: 'yo' | 'otro'; texto: string; desde: number }
  | { lado: 'yo' | 'otro'; foto: string; desde: number }
  | { lado: 'yo' | 'otro'; escribiendo: true; desde: number; hasta: number };

export type GuionChat = {
  amigos: Mensaje[];            // primer chat (el problema)
  pedido: Mensaje[];            // chat de WhatsApp con la marca
  eslogan: string;
  tiempos: { amigosHasta: number; icono: number; pedidoDesde: number; pedidoHasta: number; esloganDesde: number; logoDesde: number };
};

export const DURACION_CHAT = 420;
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const ANCHO_CHAT = 920, AREA_ALTO = 1080;

const alto = (m: Mensaje) => ('foto' in m ? 452 : 'escribiendo' in m ? 92 : Math.ceil(m.texto.length / 31) * 54 + 48);

const Puntos: React.FC<{ f: number; color: string }> = ({ f, color }) => (
  <div style={{ display: 'flex', gap: 10, padding: '6px 4px' }}>
    {[0, 1, 2].map(i => <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: color, opacity: 0.45 + 0.55 * Math.max(0, Math.sin(f * 0.3 - i * 0.9)), transform: `translateY(${-5 * Math.max(0, Math.sin(f * 0.3 - i * 0.9))}px)` }} />)}
  </div>
);

// Lista de mensajes que empuja hacia arriba con suavidad a medida que llegan.
const Chat: React.FC<{ mensajes: Mensaje[]; estilo: 'amigos' | 'whatsapp'; marca: Marca; top: number }> = ({ mensajes, estilo, marca, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = mensajes.map(m => {
    const entra = spring({ frame: f - m.desde, fps, config: { damping: 15, mass: 0.6 } });
    const sale = 'escribiendo' in m ? spring({ frame: f - m.hasta, fps, config: { damping: 20 } }) : 0;
    return Math.max(0, entra - sale);
  });
  const GAP = 18;
  const total = mensajes.reduce((a, m, i) => a + (alto(m) + GAP) * prog[i], 0);
  const scroll = Math.max(0, total - AREA_ALTO);
  let y = 0;
  const wa = estilo === 'whatsapp';
  return (
    <div style={{ position: 'absolute', top, left: (1080 - ANCHO_CHAT) / 2, width: ANCHO_CHAT, height: AREA_ALTO, overflow: 'hidden' }}>
      {mensajes.map((m, i) => {
        const p = prog[i];
        const top0 = y; y += (alto(m) + GAP) * p;
        if (p < 0.01) return null;
        const yo = m.lado === 'yo';
        const fondo = wa ? (yo ? '#d9fdd3' : '#ffffff') : (yo ? marca.color.acento : '#e9e4dc');
        const tinta = wa ? '#111b21' : yo ? '#fff' : marca.color.texto;
        return (
          <div key={i} style={{ position: 'absolute', top: top0 - scroll, left: 0, right: 0, display: 'flex', justifyContent: yo ? 'flex-end' : 'flex-start', opacity: Math.min(1, p * 1.6) }}>
            <div style={{
              transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: yo ? 'right bottom' : 'left bottom', maxWidth: 'foto' in m ? 560 : 800,
              background: fondo, color: tinta, borderRadius: 34, padding: 'foto' in m ? 10 : '20px 30px',
              borderBottomRightRadius: yo ? 8 : 34, borderBottomLeftRadius: yo ? 34 : 8,
              boxShadow: wa ? '0 2px 2px rgba(0,0,0,0.08)' : 'none', fontSize: 42, lineHeight: '54px', fontWeight: 500,
            }}>
              {'texto' in m && <>{m.texto}{wa && yo && <span style={{ marginLeft: 14, fontSize: 26, color: f > m.desde + 18 ? '#53bdeb' : '#8696a0' }}>✓✓</span>}</>}
              {'foto' in m && <Img src={staticFile(m.foto)} style={{ display: 'block', width: 540, height: 432, objectFit: 'cover', borderRadius: 26 }} />}
              {'escribiendo' in m && <Puntos f={f} color={wa ? '#8696a0' : marca.color.texto} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AnuncioChat: React.FC<{ marca: Marca; guion: GuionChat }> = ({ marca, guion }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { color, fuente } = marca;
  const t = guion.tiempos;

  // leve movimiento de cámara en todo el anuncio
  const cam = interpolate(f, [0, t.amigosHasta, t.pedidoDesde, t.pedidoHasta, DURACION_CHAT], [1.0, 1.06, 1.0, 1.05, 1.0], cl);
  const salidaAmigos = interpolate(f, [t.amigosHasta - 6, t.amigosHasta + 4], [1, 0], cl);
  // ícono: aparece, y después sube y se achica hasta ser el avatar del encabezado de WhatsApp
  const iconoEntra = spring({ frame: f - t.icono, fps, config: { damping: 11 } });
  const iconoSube = spring({ frame: f - (t.pedidoDesde - 6), fps, config: { damping: 16 } });
  const wa = interpolate(f, [t.pedidoDesde - 4, t.pedidoDesde + 8, t.pedidoHasta - 6, t.pedidoHasta + 4], [0, 1, 1, 0], cl);
  const tipeado = guion.eslogan.slice(0, Math.round(interpolate(f, [t.esloganDesde + 4, t.esloganDesde + 34], [0, guion.eslogan.length], cl)));
  const esloganOp = interpolate(f, [t.esloganDesde, t.esloganDesde + 4, t.logoDesde - 6, t.logoDesde], [0, 1, 1, 0], cl);
  const logo = spring({ frame: f - t.logoDesde, fps, config: { damping: 12 } });
  const pie = interpolate(f, [t.logoDesde + 18, t.logoDesde + 30], [0, 1], cl);

  // posición del ícono: centro de pantalla → avatar del encabezado
  const iconoX = interpolate(iconoSube, [0, 1], [540, 150]);
  const iconoY = interpolate(iconoSube, [0, 1], [960, 250]);
  const iconoTam = interpolate(iconoSube, [0, 1], [300, 104]);
  const iconoVisible = f >= t.icono && f < t.pedidoHasta + 4;

  return (
    <AbsoluteFill style={{ background: color.fondo2, fontFamily: fuente.texto, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {/* 1 · chat entre amigos */}
        {f < t.amigosHasta + 4 && <div style={{ opacity: salidaAmigos }}><Chat mensajes={guion.amigos} estilo="amigos" marca={marca} top={720} /></div>}

        {/* 3 · chat de WhatsApp con la marca */}
        {wa > 0 && (
          <AbsoluteFill style={{ opacity: wa, background: '#efeae2' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 330, background: '#ffffff', borderBottom: '1px solid #e2ddd5' }}>
              <div style={{ position: 'absolute', left: 230, top: 196, fontSize: 48, fontWeight: 700, color: '#111b21' }}>{marca.nombre}</div>
              <div style={{ position: 'absolute', left: 230, top: 258, fontSize: 32, fontWeight: 500, color: '#25a35a' }}>en línea</div>
            </div>
            <Chat mensajes={guion.pedido} estilo="whatsapp" marca={marca} top={380} />
          </AbsoluteFill>
        )}

        {/* 2 · ícono de la marca que se convierte en avatar */}
        {iconoVisible && (
          <div style={{
            position: 'absolute', left: iconoX - iconoTam / 2, top: iconoY - iconoTam / 2, width: iconoTam, height: iconoTam,
            borderRadius: interpolate(iconoSube, [0, 1], [72, iconoTam / 2]), background: color.acento, display: 'grid', placeItems: 'center',
            transform: `scale(${iconoEntra})`, boxShadow: `0 ${20 * (1 - iconoSube)}px ${50 * (1 - iconoSube)}px rgba(216,67,47,0.35)`,
          }}>
            <span style={{ fontFamily: fuente.display, fontWeight: 700, color: '#fff', fontSize: iconoTam * 0.52, lineHeight: 1, transform: 'translateY(-4%)' }}>M</span>
          </div>
        )}
        {iconoVisible && f < t.pedidoDesde && (
          <div style={{ position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', fontFamily: fuente.display, fontWeight: 700, fontSize: 84, color: color.texto, opacity: interpolate(f, [t.icono + 8, t.icono + 16, t.pedidoDesde - 8, t.pedidoDesde - 2], [0, 1, 1, 0], cl) }}>
            Migas<span style={{ color: color.acento }}>Ok</span>
          </div>
        )}

        {/* 4 · eslogan que se escribe solo */}
        {esloganOp > 0 && (
          <div style={{ position: 'absolute', top: 900, left: 60, right: 60, textAlign: 'center', fontSize: 64, fontWeight: 500, color: color.texto, opacity: esloganOp }}>
            {tipeado}<span style={{ color: color.acento, opacity: f % 18 < 9 ? 1 : 0 }}>|</span>
          </div>
        )}

        {/* 5 · logo final */}
        {f >= t.logoDesde && (
          <div style={{ position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: fuente.display, fontWeight: 700, fontSize: 180, lineHeight: 1, letterSpacing: '-0.02em', color: color.texto, transform: `scale(${0.8 + 0.2 * logo})`, opacity: Math.min(1, logo * 1.5) }}>
              Migas<span style={{ color: color.acento }}>Ok</span>
            </div>
            <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '20px 40px', borderRadius: 999, background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 40, opacity: pie, transform: `translateY(${(1 - pie) * 24}px)` }}>
              Pedí por WhatsApp
            </div>
            <div style={{ marginTop: 22, fontSize: 32, fontWeight: 500, color: color.texto, opacity: pie * 0.7 }}>{marca.textos.cta.pie}</div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Guion para MigasOk. Las fotos usan los mismos archivos que el anuncio del Día de la Madre.
export const GUION_MIGASOK: GuionChat = {
  amigos: [
    { lado: 'yo', escribiendo: true, desde: 6, hasta: 22 },
    { lado: 'yo', texto: 'Mañana es el cumple de mamá 😩', desde: 22 },
    { lado: 'yo', texto: 'y no tengo nada para la merienda', desde: 42 },
    { lado: 'otro', escribiendo: true, desde: 60, hasta: 82 },
    { lado: 'otro', texto: 'Pedile a MigasOk 🥪', desde: 82 },
  ],
  pedido: [
    { lado: 'yo', texto: 'Hola! Quiero una docena de miga + un budín 🙏', desde: 172 },
    { lado: 'otro', escribiendo: true, desde: 190, hasta: 206 },
    { lado: 'otro', texto: '¡Hola! Claro 😊 Mirá cómo quedan:', desde: 206 },
    { lado: 'otro', foto: 'migasok/miga-pila.jpg', desde: 222 },
    { lado: 'otro', foto: 'migasok/budin-chocolate.jpg', desde: 240 },
    { lado: 'yo', texto: '¡Me encantan 😍 lo pido!', desde: 262 },
  ],
  eslogan: 'El clásico que siempre suma.',
  tiempos: { amigosHasta: 116, icono: 118, pedidoDesde: 156, pedidoHasta: 300, esloganDesde: 302, logoDesde: 348 },
};
