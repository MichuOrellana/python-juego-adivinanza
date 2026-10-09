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
