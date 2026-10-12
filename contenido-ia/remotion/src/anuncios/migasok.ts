// Borrador para MigasOk (@migas.ok22) · Día de la Madre. Pendiente: permiso del dueño, logo original y precio real.
import type { MarcaAnuncio } from './marca';

export type ComboAnuncio = {
  fecha: string;
  // Fotos en public/migasok/. Para usar las fotos reales del negocio, reemplazá estos archivos (mismo nombre).
  logo: string;
  fotos: { apertura: string; miga1: string; miga2: string; budin1: string; budin2: string };
  subMiga: string;
  subBudin: string;
  combo: string;
  detalle: string;
  precio: string | null; // null = todavía no lo tenemos → muestra "Consultá el precio"
  eslogan: string;
};

export const MIGASOK: MarcaAnuncio & { extra: ComboAnuncio } = {
  nombre: 'MigasOk',
  bajada: 'El clásico que siempre suma',
  color: { fondo: '#f4e9da', fondo2: '#fffaf2', texto: '#2b1d16', acento: '#d8432f', acento2: '#4f8a3a', producto: '#ffffff', liquido: '#000000', espuma: '#ffffff' },
  fuente: { display: 'Fraunces', texto: 'DM Sans' },
  textos: {
    gancho: ['¿Ya sabés qué', 'regalarle a *mamá?*'],
    beneficios: [['Sándwiches de miga', 'artesanales'], ['y un budín', 'casero']],
    oferta: { numero: 'Combo Mamá', detalle: 'Docena de miga + budín', codigo: '' },
    cta: { boton: 'Pedí por WhatsApp', pie: 'Lomas de Zamora · efectivo o transferencia' },
  },
  extra: {
    fecha: 'Domingo 18 de octubre',
    logo: 'migasok/logo.png',
    fotos: { apertura: 'migasok/miga-triangulos.jpg', miga1: 'migasok/miga-pila.jpg', miga2: 'migasok/miga-rectangulos.jpg', budin1: 'migasok/budin-chocolate.jpg', budin2: 'migasok/budines-vainilla.jpg' },
    subMiga: 'Clásicos de jamón y queso',
    subBudin: 'Para acompañar el mate con mamá',
    combo: 'Combo Mamá',
    detalle: 'Docena de miga + budín casero',
    precio: null,
    eslogan: 'El clásico que siempre suma',
  },
};
