// Identidad visual de @michelorellana.creator: minimal oscuro + madera rústica.
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const HANDLE = '@michelorellana.creator';

export const color = {
  fondo: '#0b0907',
  fondo2: '#14100c',
  ambar: '#e8b46a',
  crema: '#f3e6d0',
  apagado: '#a8977f',
  linea: 'rgba(232,180,106,0.22)',
  grabado: 'rgba(22,12,6,0.88)',
};

export const fuente = { serif: 'Cormorant', sans: 'InterL' };

export const cargarFuentes = () =>
  Promise.all([
    loadFont({ family: 'Cormorant', url: staticFile('fonts/Cormorant-Medium.ttf'), weight: '500' }),
    loadFont({ family: 'Cormorant', url: staticFile('fonts/Cormorant-Italic.ttf'), weight: '500', style: 'italic' }),
    loadFont({ family: 'InterL', url: staticFile('fonts/Inter-Light.ttf'), weight: '300' }),
    loadFont({ family: 'InterL', url: staticFile('fonts/Inter-Medium.ttf'), weight: '500' }),
  ]);
