// Plantilla de anuncio: todo lo que cambia de un cliente a otro vive acá.
// Para una marca nueva: copiá GRANO_LENTO, cambiá colores, fuentes y textos, y registrala en Root.tsx.
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export type MarcaAnuncio = {
  nombre: string;
  bajada: string;
  color: { fondo: string; fondo2: string; texto: string; acento: string; acento2: string; producto: string; liquido: string; espuma: string };
  fuente: { display: string; texto: string };
  textos: {
    gancho: [string, string];          // línea chica, línea grande (*palabra* = destacada)
    beneficios: [string, string][];    // [normal, destacado]
    oferta: { numero: string; detalle: string; codigo: string };
    cta: { boton: string; pie: string };
  };
};

// Marca ficticia para el portafolio (anuncio de muestra).
export const GRANO_LENTO: MarcaAnuncio = {
  nombre: 'Grano Lento',
  bajada: 'Café de especialidad · tostado lento',
  color: { fondo: '#1c110b', fondo2: '#3b2216', texto: '#f4e7d3', acento: '#e47a3c', acento2: '#f2c48d', producto: '#f1e9dd', liquido: '#5a321b', espuma: '#f3e1c4' },
  fuente: { display: 'Fraunces', texto: 'DM Sans' },
  textos: {
    gancho: ['¿Tu café de la mañana', 'sabe a *nada?*'],
    beneficios: [['Tostado', 'esta semana'], ['Origen', 'Huila, Colombia'], ['Molido', 'a tu gusto']],
    oferta: { numero: '-20%', detalle: 'en tu primera bolsa', codigo: 'LENTO20' },
    cta: { boton: 'Pedí el tuyo →', pie: 'Link en la bio · envíos a todo el país' },
  },
};

export const cargarFuentesAnuncio = () => Promise.all([
  loadFont({ family: 'Fraunces', url: staticFile('fonts/anuncios/Fraunces-Bold.ttf'), weight: '700' }),
  loadFont({ family: 'Fraunces', url: staticFile('fonts/anuncios/Fraunces-SemiBoldItalic.ttf'), weight: '600', style: 'italic' }),
  loadFont({ family: 'DM Sans', url: staticFile('fonts/anuncios/DMSans-Medium.ttf'), weight: '500' }),
  loadFont({ family: 'DM Sans', url: staticFile('fonts/anuncios/DMSans-Bold.ttf'), weight: '700' }),
]);
