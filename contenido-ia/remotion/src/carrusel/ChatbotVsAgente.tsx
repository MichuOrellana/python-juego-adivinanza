// Carrusel 02 · Chatbot vs. Agente (8 slides, 1080×1350)
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Madera } from '../marca/Madera';
import { Destacado, Marco, Parrafo, Titulo } from '../marca/Marco';
import { HANDLE, color, fuente } from '../marca/tema';
import { Burbuja, CicloAgente, Chip, Etiqueta, Paso, Tarjeta } from './piezas';

const TEMA = 'Chatbot vs. Agente';

const Portada = () => (
  <>
    <Titulo texto={'Chatbot vs.\n*Agente*'} size={138} style={{ whiteSpace: 'pre-line', marginTop: 30 }} />
    <Parrafo style={{ marginTop: 34, maxWidth: 760, color: color.apagado, fontSize: 38 }}>
      La diferencia que está cambiando cómo trabajamos con inteligencia artificial.
    </Parrafo>
  </>
);
const fondoPortada = (
  <>
    <Img src={staticFile('escena-red.png')} style={{ position: 'absolute', width: 1080, top: -150, left: 0 }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(11,9,7,0.96) 0%, rgba(11,9,7,0.78) 34%, rgba(11,9,7,0) 58%)' }} />
  </>
);

const Chatbot = () => (
  <>
    <Titulo texto="El chatbot *responde.*" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 56 }}>
      <Burbuja de="vos">¿Cómo organizo una reunión con mi equipo el jueves?</Burbuja>
      <Burbuja de="ia">Podés enviar un email proponiendo tres horarios y pedir que confirmen…</Burbuja>
      <Burbuja de="vos">¿Me lo podés agendar vos?</Burbuja>
      <Burbuja de="ia">No tengo acceso a tu calendario, pero te dejo el texto listo para copiar.</Burbuja>
    </div>
    <Parrafo style={{ marginTop: 'auto' }}>
      Vos preguntás, él contesta. Pero <Destacado>cada paso lo seguís haciendo vos.</Destacado>
    </Parrafo>
  </>
);

const Agente = () => (
  <>
    <Titulo texto="El agente *actúa.*" />
    <Parrafo style={{ marginTop: 28 }}>
      Le das un <Destacado>objetivo</Destacado>. Arma un plan, usa herramientas y revisa su propio trabajo hasta terminar.
    </Parrafo>
    <div style={{ marginTop: 'auto', marginBottom: 'auto' }}><CicloAgente /></div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
      {['Navegador', 'Código', 'Email', 'Calendario', 'Archivos', 'APIs'].map(t => <Chip key={t}>{t}</Chip>)}
    </div>
  </>
);

const Ejemplo = () => (
  <>
    <Titulo texto="Mismo pedido, *dos resultados.*" size={84} />
    <div style={{ marginTop: 34, fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 44, color: color.crema, borderLeft: `2px solid ${color.ambar}`, paddingLeft: 28 }}>
      “Organizá una reunión con el equipo el jueves.”
    </div>
    <div style={{ display: 'flex', gap: 24, marginTop: 56 }}>
      <Tarjeta style={{ flex: 1 }}>
        <Etiqueta>CHATBOT</Etiqueta>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Paso n={1} quien="ia">Te redacta el email</Paso>
          <Paso n={2} quien="vos">Vos revisás los calendarios</Paso>
          <Paso n={3} quien="vos">Vos elegís el horario</Paso>
          <Paso n={4} quien="vos">Vos enviás la invitación</Paso>
        </div>
      </Tarjeta>
      <Tarjeta acento style={{ flex: 1 }}>
        <Etiqueta acento>AGENTE</Etiqueta>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Paso n={1} quien="ia">Revisa los calendarios</Paso>
          <Paso n={2} quien="ia">Encuentra un horario libre</Paso>
          <Paso n={3} quien="ia">Prepara la invitación</Paso>
          <Paso n={4} quien="vos">Vos aprobás y listo</Paso>
        </div>
      </Tarjeta>
    </div>
    <Titulo texto={'El chatbot te ayuda.\nEl agente te *ahorra el trabajo.*'} size={58} style={{ whiteSpace: 'pre-line', marginTop: 'auto', lineHeight: 1.15 }} />
  </>
);

const FILAS: [string, string, string][] = [
  ['Recibe', 'Una pregunta', 'Un objetivo'],
  ['Hace', 'Responde con texto', 'Ejecuta pasos'],
  ['Herramientas', 'Pocas o ninguna', 'Navegador, código, apps'],
  ['El trabajo', 'Lo hacés vos', 'Lo hace él, vos supervisás'],
  ['Ejemplo', 'Chat de preguntas', 'Agente de código o de navegador'],
];
const Tabla = () => (
  <>
    <Titulo texto="Cara a *cara.*" />
    <div style={{ marginTop: 'auto', marginBottom: 'auto', border: `1px solid rgba(243,230,208,0.12)`, borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 1fr', fontSize: 21, fontWeight: 500, letterSpacing: '0.26em', background: 'rgba(255,240,220,0.04)' }}>
        <div style={{ padding: '24px 28px' }} />
        <div style={{ padding: '24px 28px', color: color.apagado }}>CHATBOT</div>
        <div style={{ padding: '24px 28px', color: color.ambar, background: 'rgba(232,180,106,0.08)' }}>AGENTE</div>
      </div>
      {FILAS.map(([k, a, b]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '230px 1fr 1fr', borderTop: '1px solid rgba(243,230,208,0.1)', fontSize: 29, lineHeight: 1.3 }}>
          <div style={{ padding: '28px 28px', fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 34, color: color.ambar }}>{k}</div>
          <div style={{ padding: '28px 28px', fontWeight: 300, color: color.apagado }}>{a}</div>
          <div style={{ padding: '28px 28px', fontWeight: 300, color: color.crema, background: 'rgba(232,180,106,0.05)' }}>{b}</div>
        </div>
      ))}
    </div>
  </>
);

const Dato = () => (
  <>
    <Etiqueta acento>EL DATO</Etiqueta>
    <div style={{ fontFamily: fuente.serif, fontSize: 330, lineHeight: 0.9, color: color.ambar, marginTop: 10, letterSpacing: '-0.03em' }}>90%</div>
    <Parrafo style={{ fontSize: 44, lineHeight: 1.3, marginTop: 70 }}>
      de los programadores profesionales ya usa <Destacado>agentes de IA</Destacado> para trabajar, al menos una vez por semana.
    </Parrafo>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 44 }}>
      <span style={{ fontFamily: fuente.serif, fontSize: 96, color: color.crema }}>68%</span>
      <Parrafo style={{ color: color.apagado }}>los usa todos los días.</Parrafo>
    </div>
    <div style={{ marginTop: 'auto', fontSize: 22, color: color.apagado, letterSpacing: '0.04em' }}>
      Fuente: JetBrains · Developer Ecosystem Survey 2026 (may–jul)
    </div>
  </>
);

const Cuando = () => (
  <>
    <Titulo texto="¿Cuándo usar *cada uno?*" size={88} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 44 }}>
      <Tarjeta>
        <Etiqueta>USÁ UN CHATBOT PARA</Etiqueta>
        <Parrafo style={{ fontSize: 34 }}>Preguntas rápidas · Lluvia de ideas · Redactar y resumir</Parrafo>
      </Tarjeta>
      <Tarjeta acento>
        <Etiqueta acento>USÁ UN AGENTE PARA</Etiqueta>
        <Parrafo style={{ fontSize: 34 }}>Tareas de varios pasos · Trabajo repetitivo · Programar y automatizar</Parrafo>
      </Tarjeta>
    </div>
    <div style={{ marginTop: 'auto', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.34em', color: color.apagado, marginBottom: 16 }}>LA REGLA DE ORO</div>
      <Titulo texto={'Vos decidís. El agente ejecuta.\n*Vos aprobás.*'} size={62} style={{ whiteSpace: 'pre-line', lineHeight: 1.15 }} />
    </div>
  </>
);

const Cierre = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
    <Titulo texto="Entendé la IA *sin humo.*" size={92} style={{ marginTop: 10 }} />
    <div style={{ position: 'relative', width: 600, height: 600, marginTop: 'auto', marginBottom: 'auto', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(232,180,106,0.12))' }}>
      <Madera ancho={600} alto={600} tipo="anillos" semilla={5} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 40% 30%, rgba(255,210,150,0.16), transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 29, fontWeight: 500, letterSpacing: '0.02em', color: color.grabado, textShadow: '0 1px 0 rgba(255,214,160,0.25), 0 -1px 0 rgba(0,0,0,0.55)' }}>
        <div>
          <div style={{ fontFamily: fuente.serif, fontStyle: 'italic', fontSize: 40, marginBottom: 6 }}>seguime en</div>
          {HANDLE}
        </div>
      </div>
    </div>
    <Parrafo style={{ fontSize: 34, color: color.apagado }}>
      <Destacado>Guardá este post</Destacado> y compartilo con alguien que todavía confunde los dos.
    </Parrafo>
  </div>
);

export const SLIDES: { contenido: React.FC; fondo?: React.ReactNode }[] = [
  { contenido: Portada, fondo: fondoPortada },
  { contenido: Chatbot },
  { contenido: Agente },
  { contenido: Ejemplo },
  { contenido: Tabla },
  { contenido: Dato },
  { contenido: Cuando },
  { contenido: Cierre },
];

export const ChatbotVsAgente: React.FC<{ slide: number }> = ({ slide }) => {
  const { contenido: Contenido, fondo } = SLIDES[slide - 1];
  return <Marco tema={TEMA} n={slide} total={SLIDES.length} fondo={fondo}><Contenido /></Marco>;
};
