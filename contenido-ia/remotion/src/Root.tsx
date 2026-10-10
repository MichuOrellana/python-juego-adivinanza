import React from 'react';
import { Composition, Still, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { ChatbotVsAgente, SLIDES } from './carrusel/ChatbotVsAgente';
import { ALTO, ANCHO } from './marca/Marco';
import { cargarFuentes } from './marca/tema';

const fuentes = delayRender('fuentes');
cargarFuentes().then(() => continueRender(fuentes));

// En el Studio: "carrusel-02" muestra todas las slides (1 por frame) para recorrerlas.
const Recorrido: React.FC = () => <ChatbotVsAgente slide={useCurrentFrame() + 1} />;

export const Root: React.FC = () => (
  <>
    <Still id="chatbot-vs-agente" component={ChatbotVsAgente} width={ANCHO} height={ALTO} defaultProps={{ slide: 1 }} />
    <Composition id="carrusel-02" component={Recorrido} width={ANCHO} height={ALTO} fps={1} durationInFrames={SLIDES.length} />
  </>
);
