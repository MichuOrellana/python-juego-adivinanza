import React from 'react';
import { Composition, Still, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { ChatbotVsAgente, SLIDES } from './carrusel/ChatbotVsAgente';
import { ALTO, ANCHO } from './marca/Marco';
import { cargarFuentes } from './marca/tema';
import { ChatbotVsAgenteReel, DURACION, FPS } from './video/ChatbotVsAgenteReel';
import { AnuncioProducto, DURACION_ANUNCIO } from './anuncios/AnuncioProducto';
import { GRANO_LENTO, cargarFuentesAnuncio } from './anuncios/marca';
import { AnuncioDiaMadre, DURACION_DIA_MADRE } from './anuncios/AnuncioDiaMadre';
import { MIGASOK } from './anuncios/migasok';
import { AnuncioChat, DURACION_CHAT, GUION_MIGASOK } from './anuncios/AnuncioChat';
import { AnuncioBandeja, DURACION_BANDEJA } from './anuncios/AnuncioBandeja';
import { DURACION_MUESTRARIO, MuestrarioMigas, cargarFuentesMuestrario } from './anuncios/MuestrarioMigas';

const fuentes = delayRender('fuentes');
Promise.all([cargarFuentes(), cargarFuentesAnuncio(), cargarFuentesMuestrario()]).then(() => continueRender(fuentes));

// En el Studio: "carrusel-02" muestra todas las slides (1 por frame) para recorrerlas.
const Recorrido: React.FC = () => <ChatbotVsAgente slide={useCurrentFrame() + 1} />;

export const Root: React.FC = () => (
  <>
    <Still id="chatbot-vs-agente" component={ChatbotVsAgente} width={ANCHO} height={ALTO} defaultProps={{ slide: 1 }} />
    <Composition id="reel-chatbot-vs-agente" component={ChatbotVsAgenteReel} width={1080} height={1920} fps={FPS} durationInFrames={DURACION} defaultProps={{ fondoVideo: true }} />
    <Composition id="anuncio-grano-lento" component={AnuncioProducto} width={1080} height={1920} fps={30} durationInFrames={DURACION_ANUNCIO} defaultProps={{ marca: GRANO_LENTO }} />
    <Composition id="anuncio-migasok-dia-madre" component={AnuncioDiaMadre} width={1080} height={1920} fps={30} durationInFrames={DURACION_DIA_MADRE} defaultProps={{ marca: MIGASOK }} />
    <Composition id="anuncio-migasok-chat" component={AnuncioChat} width={1080} height={1920} fps={30} durationInFrames={DURACION_CHAT} defaultProps={{ marca: MIGASOK, guion: GUION_MIGASOK, sonido: 'completo' as const }} />
    <Composition id="anuncio-migasok-chat-solo-efectos" component={AnuncioChat} width={1080} height={1920} fps={30} durationInFrames={DURACION_CHAT} defaultProps={{ marca: MIGASOK, guion: GUION_MIGASOK, sonido: 'efectos' as const }} />
    <Composition id="muestrario-migasok" component={MuestrarioMigas} width={1080} height={1920} fps={30} durationInFrames={DURACION_MUESTRARIO} />
    <Composition id="anuncio-migasok-bandeja" component={AnuncioBandeja} width={1080} height={1920} fps={30} durationInFrames={DURACION_BANDEJA} defaultProps={{ marca: MIGASOK }} />
    <Composition id="carrusel-02" component={Recorrido} width={ANCHO} height={ALTO} fps={1} durationInFrames={SLIDES.length} />
  </>
);
