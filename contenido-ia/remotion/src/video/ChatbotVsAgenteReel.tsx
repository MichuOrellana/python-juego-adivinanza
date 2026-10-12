// Reel 02 · "Chatbot vs. Agente": el carrusel convertido en video vertical con fondo 3D.
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Madera } from '../marca/Madera';
import { HANDLE, color, fuente } from '../marca/tema';
import { Burbuja, Chip, Etiqueta, Tarjeta } from '../carrusel/piezas';
import { Rev, TituloAnim, rango, useEntrada } from './anim';
import { Anillo, CicloAnim, Escribiendo, PasoAnim, Pop } from './piezasAnim';

export const FPS = 30;
// [inicio, fin] en segundos. El fondo 3D (demo-reel/fondo-3d.html) usa estos mismos tiempos.
const ESCENAS: [number, number][] = [[0, 4.5], [4.5, 10], [10, 15.5], [15.5, 22], [22, 27.5], [27.5, 32], [32, 37.5], [37.5, 42]];
export const DURACION = 42 * FPS;
const SOLAPE = 12; // cuadros en los que una escena sale mientras entra la siguiente

const P = (s: React.ReactNode, st?: React.CSSProperties) => <p style={{ margin: 0, fontSize: 36, lineHeight: 1.42, fontWeight: 300, color: color.crema, ...st }}>{s}</p>;
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 500, color: color.ambar }}>{children}</b>;

// Tarjeta de vidrio que entra y sale girando en 3D, como un carrusel.
const Panel3D: React.FC<{ dur: number; children: React.ReactNode; sinFondo?: boolean }> = ({ dur, children, sinFondo }) => {
  const f = useCurrentFrame();
  const ent = useEntrada(0, 22);
  const sal = rango(f, dur - SOLAPE - 4, dur, 0, 1);
  const rotY = 48 * (1 - ent) - 48 * sal;
  const x = 340 * (1 - ent) - 340 * sal;
  const z = -380 * (1 - ent) - 380 * sal;
  const o = Math.min(rango(f, 0, 8), 1 - sal);
  return (
    <AbsoluteFill style={{ perspective: 1700 }}>
      <div style={{
        position: 'absolute', top: 310, left: 54, right: 54, height: 1190,
        transform: `translate3d(${x}px,0,${z}px) rotateY(${rotY}deg)`, opacity: o,
        borderRadius: 38, padding: '64px 52px 56px',
        background: sinFondo ? 'transparent' : 'linear-gradient(165deg, rgba(24,17,11,0.86), rgba(12,9,7,0.9))',
        border: sinFondo ? 'none' : '1px solid rgba(232,180,106,0.24)',
        boxShadow: sinFondo ? 'none' : '0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,220,170,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>{children}</div>
    </AbsoluteFill>
  );
};

// ---------- escenas ----------
const Portada: React.FC = () => {
  const f = useCurrentFrame();
  const sal = rango(f, 135 - 4, 135 + SOLAPE, 0, 1);
  return (
    <AbsoluteFill style={{ opacity: 1 - sal, transform: `translateY(${-60 * sal}px)` }}>
      <div style={{ position: 'absolute', top: 250, left: 90, right: 90 }}>
        <Rev delay={4}><div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '0.4em', color: color.ambar, marginBottom: 26 }}>GUÍA 02 · INTELIGENCIA ARTIFICIAL</div></Rev>
        <TituloAnim texto={'Chatbot vs.\n*Agente*'} delay={10} paso={5} size={150} />
        <Rev delay={34}><p style={{ margin: '30px 0 0', fontSize: 40, lineHeight: 1.35, fontWeight: 300, color: color.apagado, maxWidth: 820 }}>La diferencia que está cambiando cómo trabajamos con IA.</p></Rev>
      </div>
      <Rev delay={60} style={{ position: 'absolute', bottom: 430, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 500, letterSpacing: '0.34em', color: color.ambar }}>
        EN 40 SEGUNDOS
      </Rev>
    </AbsoluteFill>
  );
};

const Chatbot: React.FC<{ dur: number }> = ({ dur }) => (
  <Panel3D dur={dur}>
    <TituloAnim texto="El chatbot *responde.*" delay={6} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 50 }}>
      <Pop delay={18} origen="right bottom"><Burbuja de="vos">¿Cómo organizo una reunión con mi equipo el jueves?</Burbuja></Pop>
      <Escribiendo desde={30} hasta={48} />
      <Pop delay={48} origen="left bottom"><Burbuja de="ia">Podés enviar un email proponiendo tres horarios y pedir que confirmen…</Burbuja></Pop>
      <Pop delay={72} origen="right bottom"><Burbuja de="vos">¿Me lo podés agendar vos?</Burbuja></Pop>
      <Escribiendo desde={84} hasta={100} />
      <Pop delay={100} origen="left bottom"><Burbuja de="ia">No tengo acceso a tu calendario, pero te dejo el texto listo para copiar.</Burbuja></Pop>
    </div>
    <Rev delay={122} style={{ marginTop: 'auto' }}>{P(<>Vos preguntás, él contesta. Pero <B>cada paso lo seguís haciendo vos.</B></>)}</Rev>
  </Panel3D>
);

const Agente: React.FC<{ dur: number }> = ({ dur }) => (
  <Panel3D dur={dur}>
    <TituloAnim texto="El agente *actúa.*" delay={6} />
    <Rev delay={18} style={{ marginTop: 28 }}>{P(<>Le das un <B>objetivo</B>. Arma un plan, usa herramientas y revisa su propio trabajo hasta terminar.</>)}</Rev>
    <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'center' }}><CicloAnim delay={30} /></div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
      {['Navegador', 'Código', 'Email', 'Calendario', 'Archivos', 'APIs'].map((t, i) => <Pop key={t} delay={96 + i * 4}><Chip>{t}</Chip></Pop>)}
    </div>
  </Panel3D>
);

const Ejemplo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const frase = '“Organizá una reunión con el equipo el jueves.”';
  const n = Math.round(rango(f, 16, 52) * frase.length);
  const PASOS: [string, 'vos' | 'ia', string, 'vos' | 'ia'][] = [
    ['Te redacta el email', 'ia', 'Revisa los calendarios', 'ia'],
    ['Vos revisás los calendarios', 'vos', 'Encuentra un horario libre', 'ia'],
    ['Vos elegís el horario', 'vos', 'Prepara la invitación', 'ia'],
    ['Vos enviás la invitación', 'vos', 'Vos aprobás y listo', 'vos'],
  ];
  return (
    <Panel3D dur={dur}>
      <TituloAnim texto={'Mismo pedido,\n*dos resultados.*'} delay={4} size={88} />
      <div style={{ marginTop: 32, minHeight: 112, fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 44, lineHeight: 1.2, color: color.crema, borderLeft: `2px solid ${color.ambar}`, paddingLeft: 28, opacity: rango(f, 12, 18) }}>
        {frase.slice(0, n)}<span style={{ opacity: n < frase.length && f % 16 < 8 ? 1 : 0, color: color.ambar }}>|</span>
      </div>
      <div style={{ display: 'flex', gap: 22, marginTop: 40 }}>
        {[0, 1].map(col => (
          <Pop key={col} delay={56 + col * 6} style={{ flex: 1 }}>
            <Tarjeta acento={col === 1} style={{ padding: '30px 28px', height: '100%' }}>
              <Etiqueta acento={col === 1}>{col === 0 ? 'CHATBOT' : 'AGENTE'}</Etiqueta>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {PASOS.map((p, i) => <PasoAnim key={i} n={i + 1} quien={p[col * 2 + 1] as 'vos' | 'ia'} delay={72 + i * 16 + col * 4}>{p[col * 2]}</PasoAnim>)}
              </div>
            </Tarjeta>
          </Pop>
        ))}
      </div>
      <Rev delay={150} style={{ marginTop: 'auto' }}>
        <TituloAnim texto={'El chatbot te ayuda.\nEl agente te *ahorra el trabajo.*'} delay={150} size={56} paso={2} />
      </Rev>
    </Panel3D>
  );
};

const FILAS: [string, string, string][] = [
  ['Recibe', 'Una pregunta', 'Un objetivo'],
  ['Hace', 'Responde con texto', 'Ejecuta pasos'],
  ['Herramientas', 'Pocas o ninguna', 'Navegador, código, apps'],
  ['El trabajo', 'Lo hacés vos', 'Lo hace él, vos supervisás'],
  ['Ejemplo', 'Chat de preguntas', 'Agente de código o de navegador'],
];
const Tabla: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const brillo = 0.05 + 0.07 * rango(f, 110, 130) * (0.6 + 0.4 * Math.sin(f * 0.15));
  return (
    <Panel3D dur={dur}>
      <TituloAnim texto="Cara a *cara.*" delay={6} />
      <div style={{ marginTop: 'auto', marginBottom: 'auto', border: '1px solid rgba(243,230,208,0.12)', borderRadius: 22, overflow: 'hidden', perspective: 900 }}>
        <Rev delay={16} dy={10}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', fontSize: 21, fontWeight: 500, letterSpacing: '0.26em', background: 'rgba(255,240,220,0.04)' }}>
            <div style={{ padding: '24px 24px' }} />
            <div style={{ padding: '24px 24px', color: color.apagado }}>CHATBOT</div>
            <div style={{ padding: '24px 24px', color: color.ambar, background: 'rgba(232,180,106,0.08)' }}>AGENTE</div>
          </div>
        </Rev>
        {FILAS.map(([k, a, b], i) => {
          const v = rango(f, 28 + i * 13, 46 + i * 13);
          return (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', borderTop: '1px solid rgba(243,230,208,0.1)', fontSize: 29, lineHeight: 1.3, transformOrigin: 'top', transform: `rotateX(${-90 * (1 - v)}deg)`, opacity: v }}>
              <div style={{ padding: '30px 24px', fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 34, color: color.ambar }}>{k}</div>
              <div style={{ padding: '30px 24px', fontWeight: 300, color: color.apagado }}>{a}</div>
              <div style={{ padding: '30px 24px', fontWeight: 300, color: color.crema, background: `rgba(232,180,106,${brillo})` }}>{b}</div>
            </div>
          );
        })}
      </div>
    </Panel3D>
  );
};

const Dato: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Panel3D dur={dur}>
      <Rev delay={4}><Etiqueta acento>EL DATO</Etiqueta></Rev>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><Anillo desde={10} hasta={58} valor={90} size={470} /></div>
      <Rev delay={40} style={{ marginTop: 40 }}>{P(<>de los programadores profesionales ya usa <B>agentes de IA</B> para trabajar, al menos una vez por semana.</>, { fontSize: 42, lineHeight: 1.3, textAlign: 'center' })}</Rev>
      <Rev delay={66} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 22, marginTop: 34 }}>
        <span style={{ fontFamily: fuente.serif, fontSize: 96, color: color.crema }}>{Math.round(rango(f, 66, 100) * 68)}%</span>
        {P('los usa todos los días.', { color: color.apagado })}
      </Rev>
      <Rev delay={90} style={{ marginTop: 'auto', textAlign: 'center', fontSize: 22, color: color.apagado, letterSpacing: '0.04em' }}>Fuente: JetBrains · Developer Ecosystem Survey 2026</Rev>
    </Panel3D>
  );
};

const Cuando: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const flip = (d: number) => { const v = rango(f, d, d + 20); return { transform: `perspective(900px) rotateX(${70 * (1 - v)}deg)`, transformOrigin: 'top', opacity: v }; };
  return (
    <Panel3D dur={dur}>
      <TituloAnim texto="¿Cuándo usar *cada uno?*" delay={4} size={88} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 44 }}>
        <div style={flip(20)}><Tarjeta><Etiqueta>USÁ UN CHATBOT PARA</Etiqueta>{P('Preguntas rápidas · Lluvia de ideas · Redactar y resumir', { fontSize: 34 })}</Tarjeta></div>
        <div style={flip(36)}><Tarjeta acento><Etiqueta acento>USÁ UN AGENTE PARA</Etiqueta>{P('Tareas de varios pasos · Trabajo repetitivo · Programar y automatizar', { fontSize: 34 })}</Tarjeta></div>
      </div>
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <Rev delay={72}><div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.34em', color: color.apagado, marginBottom: 18 }}>LA REGLA DE ORO</div></Rev>
        <TituloAnim texto={'Vos decidís. El agente ejecuta.\n*Vos aprobás.*'} delay={82} paso={4} size={64} align="center" style={{ lineHeight: 1.15 }} />
      </div>
    </Panel3D>
  );
};

// Tronco que gira como una moneda en 3D con el @ pirograbado.
const Moneda: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const f = useCurrentFrame();
  const v = rango(f, delay, delay + 50);
  const giro = -540 * (1 - v) + 8 * Math.sin(Math.max(0, f - delay - 50) * 0.05);
  const capas = 18;
  return (
    <div style={{ width: size, height: size, perspective: 1600, opacity: rango(f, delay, delay + 8) }}>
      <div style={{ position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(12deg) rotateY(${giro}deg)` }}>
        {Array.from({ length: capas }, (_, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: i % 3 === 0 ? '#24160d' : '#2e1d11', transform: `translateZ(${-i * 2.4 - 1}px)` }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, transform: `translateZ(${-capas * 2.4 - 1}px) rotateY(180deg)`, backfaceVisibility: 'hidden' }}>
          <Madera ancho={size} alto={size} tipo="anillos" semilla={9} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
          <Madera ancho={size} alto={size} tipo="anillos" semilla={5} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 38% 28%, rgba(255,214,160,0.2), transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', fontSize: 30, fontWeight: 500, color: color.grabado, textShadow: '0 1px 0 rgba(255,214,160,0.25), 0 -1px 0 rgba(0,0,0,0.55)' }}>
            <div><div style={{ fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 42, marginBottom: 6 }}>seguime en</div>{HANDLE}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cierre: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', top: 330, left: 70, right: 70 }}>
      <TituloAnim texto={'Entendé la IA\n*sin humo.*'} delay={8} paso={4} size={110} align="center" />
    </div>
    <div style={{ position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.75)) drop-shadow(0 0 70px rgba(232,180,106,0.16))' }}>
      <Moneda delay={14} size={600} />
    </div>
    <Rev delay={66} style={{ position: 'absolute', top: 1340, left: 90, right: 90, textAlign: 'center' }}>
      {P(<><B>Guardá este video</B> y compartilo con alguien que todavía confunde los dos.</>, { fontSize: 36, color: color.apagado })}
    </Rev>
  </AbsoluteFill>
);

// Placa de madera superior con el @ y el progreso.
const Placa: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const actual = ESCENAS.findIndex(([a, b]) => t >= a && t < b);
  const o = rango(f, 4.3 * FPS, 4.9 * FPS) * (1 - rango(f, ESCENAS[7][0] * FPS - 6, ESCENAS[7][0] * FPS + 6));
  return (
    <div style={{ position: 'absolute', top: 178, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: o }}>
      <div style={{ position: 'relative', width: 500, height: 70, borderRadius: 14, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,220,170,0.2)' }}>
        <Madera ancho={500} alto={70} semilla={11} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,210,150,0.12), transparent 40%, rgba(0,0,0,0.3))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 500, letterSpacing: '0.04em', color: color.grabado, textShadow: '0 1px 0 rgba(255,214,160,0.24), 0 -1px 0 rgba(0,0,0,0.5)' }}>{HANDLE}</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {ESCENAS.map((_, i) => (
          <span key={i} style={{ width: i === actual ? 34 : 10, height: 10, borderRadius: 5, background: i <= actual ? color.ambar : 'rgba(243,230,208,0.2)', opacity: i === actual ? 1 : 0.7 }} />
        ))}
      </div>
    </div>
  );
};

const Fondo: React.FC<{ video: boolean }> = ({ video }) => {
  const f = useCurrentFrame();
  const s = (x: number) => x * FPS;
  // oscurecer el 3D detrás de las tarjetas; dejarlo protagonista en portada y cierre
  const dim = interpolate(f, [s(4.1), s(4.9), s(37.2), s(38)], [0, 0.42, 0.42, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      {video
        ? <OffthreadVideo src={staticFile('fondo-3d.mp4')} muted />
        : <Img src={staticFile('escena-red.png')} />}
      <AbsoluteFill style={{ background: `rgba(8,6,4,${dim})` }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.35) 30%, transparent 45%, transparent 70%, rgba(10,8,6,0.5) 100%)' }} />
    </AbsoluteFill>
  );
};

export const ChatbotVsAgenteReel: React.FC<{ fondoVideo: boolean }> = ({ fondoVideo }) => {
  const { fps } = useVideoConfig();
  const escenas = [null, Chatbot, Agente, Ejemplo, Tabla, Dato, Cuando];
  return (
    <AbsoluteFill style={{ background: color.fondo, fontFamily: fuente.sans, color: color.crema }}>
      <Fondo video={fondoVideo} />
      <Sequence durationInFrames={ESCENAS[0][1] * fps + SOLAPE}><Portada /></Sequence>
      {escenas.map((Escena, i) => {
        if (!Escena) return null;
        const [a, b] = ESCENAS[i];
        const dur = Math.round((b - a) * fps) + SOLAPE;
        return <Sequence key={i} from={Math.round(a * fps)} durationInFrames={dur}><Escena dur={dur} /></Sequence>;
      })}
      <Sequence from={ESCENAS[7][0] * fps}><Cierre /></Sequence>
      <Placa />
    </AbsoluteFill>
  );
};
