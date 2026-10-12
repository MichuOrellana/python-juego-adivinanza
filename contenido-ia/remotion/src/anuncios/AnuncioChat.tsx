// Anuncio "historia en chat" 9:16: un problema contado por mensajes → la marca lo resuelve por WhatsApp → eslogan → logo.
// El guion es una lista de mensajes, así que sirve para cualquier marca.
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MIGASOK } from './migasok';
import { FotoLogo, LogoMigas } from './LogoMigas';

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

export const DURACION_CHAT = 650;
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
  const tipeado = guion.eslogan.slice(0, Math.round(interpolate(f, [t.esloganDesde + 4, t.esloganDesde + 46], [0, guion.eslogan.length], cl)));
  const esloganOp = interpolate(f, [t.esloganDesde, t.esloganDesde + 4, t.logoDesde - 6, t.logoDesde], [0, 1, 1, 0], cl);
  const logo = spring({ frame: f - t.logoDesde, fps, config: { damping: 12 } });
  const pie = interpolate(f, [t.logoDesde + 18, t.logoDesde + 30], [0, 1], cl);
  const tarjeta = spring({ frame: f - (t.logoDesde + 70), fps, config: { damping: 15, mass: 0.9 } });

  // posición del ícono: centro de pantalla → avatar del encabezado
  const iconoX = interpolate(iconoSube, [0, 1], [540, 150]);
  const iconoY = interpolate(iconoSube, [0, 1], [960, 250]);
  const iconoTam = interpolate(iconoSube, [0, 1], [460, 104]);
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
            borderRadius: '50%', transform: `scale(${iconoEntra})`, boxShadow: `0 ${24 * (1 - iconoSube)}px ${60 * (1 - iconoSube)}px rgba(90,50,25,0.28)`,
          }}>
            <FotoLogo marca={marca} size={iconoTam} borde={iconoTam * 0.03} sombra={false} />
          </div>
        )}

        {iconoVisible && f < t.pedidoDesde && (
          <div style={{ position: 'absolute', top: 1230, left: 0, right: 0, textAlign: 'center', fontFamily: fuente.texto, fontWeight: 700, fontSize: 110, letterSpacing: '-0.035em', color: color.texto, opacity: interpolate(f, [t.icono + 6, t.icono + 14, t.pedidoDesde - 8, t.pedidoDesde - 2], [0, 1, 1, 0], cl), transform: `translateY(${interpolate(f, [t.icono + 6, t.icono + 14], [30, 0], cl)}px)` }}>
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
          <>
            {/* logo + nombre: primero solo en el centro, después sube y se achica para dar lugar a la tarjeta */}
            <div style={{ position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', transformOrigin: '50% 0', transform: `translateY(${-200 * tarjeta}px) scale(${1 - 0.36 * tarjeta})` }}>
              <LogoMigas marca={marca} desde={t.logoDesde} foto={420} />
              <div style={{ marginTop: 34, fontSize: 34, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: color.acento, opacity: pie * (1 - tarjeta) }}>♥ Día de la Madre · {marca.extra.fecha}</div>
            </div>
            {/* tarjeta de agradecimiento con Instagram, QR y WhatsApp */}
            <div style={{ position: 'absolute', left: 40, width: 1000, top: 830, transform: `translateY(${(1 - tarjeta) * 1200}px) rotate(${(1 - tarjeta) * 6}deg)`, borderRadius: 30, overflow: 'hidden', boxShadow: '0 30px 70px rgba(90,50,25,0.3)', border: '6px solid #fff' }}>
              <Img src={staticFile(marca.extra.tarjeta)} style={{ display: 'block', width: '100%' }} />
            </div>
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Guion para MigasOk. Las fotos usan los mismos archivos que el anuncio del Día de la Madre.
export const GUION_MIGASOK: GuionChat = {
  amigos: [
    { lado: 'yo', escribiendo: true, desde: 6, hasta: 28 },
    { lado: 'yo', texto: 'El domingo es el Día de la Madre 😩', desde: 28 },
    { lado: 'yo', texto: 'y todavía no le compré nada a mamá', desde: 58 },
    { lado: 'otro', escribiendo: true, desde: 84, hasta: 114 },
    { lado: 'otro', texto: 'Regalale algo de MigasOk 🥪💛', desde: 114 },
  ],
  pedido: [
    { lado: 'yo', texto: 'Hola! Quiero el combo para mamá: docena de miga + budín 🙏', desde: 232 },
    { lado: 'otro', escribiendo: true, desde: 260, hasta: 286 },
    { lado: 'otro', texto: '¡Hola! Claro 😊 Mirá cómo quedan:', desde: 286 },
    { lado: 'otro', foto: 'migasok/miga-pila.jpg', desde: 312 },
    { lado: 'otro', foto: 'migasok/budin-chocolate.jpg', desde: 342 },
    { lado: 'yo', texto: '¡Le va a encantar 😍 lo pido!', desde: 380 },
  ],
  eslogan: 'El clásico que siempre suma.',
  tiempos: { amigosHasta: 170, icono: 172, pedidoDesde: 214, pedidoHasta: 430, esloganDesde: 432, logoDesde: 492 },
};
