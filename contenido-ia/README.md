# Contenido IA para Instagram

Visuales 3D generados con código: estilo **minimal oscuro + madera rústica**, con un tono profesional.

## Demo 01 · "¿Cómo piensa una IA?"

Reel vertical (1080×1920, 11 s, 30 fps): una red neuronal de luz ámbar se forma sobre un corte de tronco de nogal y una señal viaja por las capas.

- `demo-reel/index.html`: la escena (Three.js). Si lo abres con un servidor local, ves la animación en vivo.
- `demo-reel/render.mjs`: graba cada cuadro y arma `reel-demo.mp4` con ffmpeg.
- `demo-reel/still.mjs`: saca capturas sueltas para revisar (por ejemplo, `node still.mjs 3 7`).

### Cómo regenerarlo

```bash
cd contenido-ia/demo-reel
npm install
node render.mjs 30     # crea reel-demo.mp4
```

### Qué se puede cambiar fácilmente (en `index.html`)

- **Textos**: los `<div>` con id `title`, `cap1`, `cap2`, `cap3` y `end` (ahí también va tu @usuario).
- **Colores**: las variables `--amber`, `--cream` y `--muted`, y los colores `AMBER`/`HOT` en el script.
- **Red neuronal**: `LAYERS = [5, 8, 8, 8, 3]` define cuántas neuronas tiene cada capa.
- **Tiempos**: las llamadas a `show(...)` dentro de `renderAt` (segundo de entrada y de salida de cada texto).

## Carrusel 02 · "Chatbot vs. Agente" (Remotion)

Son 8 slides de 1080×1350 (4:5), que es el formato que más espacio ocupa en el feed. Ya están renderizadas en `remotion/out/chatbot-vs-agente/`, junto con `caption.txt`, que tiene el texto y los hashtags para la publicación.

```bash
cd contenido-ia/remotion
npm install
npm run studio            # vista previa en Remotion Studio
node render-carrusel.mjs  # vuelve a generar los PNG (o solo algunas: node render-carrusel.mjs 1 4)
```

### Estructura

- `src/marca/`: la identidad visual de @michelorellana.creator. Incluye colores, tipografías, la madera procedural, el pie de madera con el @ pirograbado y los títulos con palabra destacada (`*así*`).
- `src/carrusel/piezas.tsx`: piezas reutilizables (tarjetas, burbujas de chat, chips, el diagrama del ciclo del agente).
- `src/carrusel/ChatbotVsAgente.tsx`: el contenido de este carrusel. Para hacer uno nuevo, copia este archivo, cambia los textos y regístralo en `src/Root.tsx`.
- `public/escena-red.png`: fondo de la portada, capturado de la escena 3D del Reel con `demo-reel/still-sin-texto.mjs`.

## Reel 02 · "Chatbot vs. Agente" (video, 42 s)

Es el carrusel convertido en un Reel vertical de 1080×1920. El fondo 3D se mueve durante todo el video y reacciona a la historia: hay pocas señales mientras se habla del chatbot y pulsos continuos cuando aparece el agente. Cada slide entra y sale como una tarjeta que gira en 3D, con animaciones propias (chat con "escribiendo…", ciclo del agente con un punto de luz, contador del 90% y tronco que gira con el @).

```bash
# 1) Fondo 3D (solo si cambias la escena; tarda unos 20 min)
cd contenido-ia/demo-reel && PAGE=fondo-3d.html OUT=../remotion/public/fondo-3d.mp4 node render.mjs 30
# 2) Video final
cd ../remotion && node render-reel.mjs             # → out/reel-chatbot-vs-agente.mp4
SIN_VIDEO=1 node render-reel.mjs --cuadros 300 900 # cuadros sueltos para revisar
```

- `src/video/ChatbotVsAgenteReel.tsx`: las escenas y sus tiempos (`ESCENAS`).
- `src/video/anim.tsx` y `piezasAnim.tsx`: animaciones reutilizables (título palabra por palabra, burbujas, contador, ciclo).
