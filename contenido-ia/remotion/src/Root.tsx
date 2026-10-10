import React from 'react';
import { Composition, Still, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { ChatbotVsAgente, SLIDES } from './carrusel/ChatbotVsAgente';
import { ALTO, ANCHO } from './marca/Marco';
import { cargarFuentes } from './marca/tema';
import { ChatbotVsAgenteReel, DURACION, FPS } from './video/ChatbotVsAgenteReel';

const fuentes = delayRender('fuentes');
cargarFuentes().then(() => continueRender(fuentes));

// En el Studio: "carrusel-02" muestra todas las slides (1 por frame) para recorrerlas.
const Recorrido: React.FC = () => <ChatbotVsAgente slide={useCurrentFrame() + 1} />;

export const Root: React.FC = () => (
  <>
    <Still id="chatbot-vs-agente" component={ChatbotVsAgente} width={ANCHO} height={ALTO} defaultProps={{ slide: 1 }} />
    <Composition id="reel-chatbot-vs-agente" component={ChatbotVsAgenteReel} width={1080} height={1920} fps={FPS} durationInFrames={DURACION} defaultProps={{ fondoVideo: true }} />
    <Composition id="carrusel-02" component={Recorrido} width={ANCHO} height={ALTO} fps={1} durationInFrames={SLIDES.length} />
  </>
);
