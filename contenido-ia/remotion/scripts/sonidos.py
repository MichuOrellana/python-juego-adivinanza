"""Genera sonidos originales (libres de derechos) para los anuncios: efectos de chat, de marca y música de fondo.

Uso: python3 scripts/sonidos.py   → escribe los .wav en public/sonidos/
Todo se sintetiza con numpy: no hay muestras de terceros.
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sonidos')
rng = np.random.default_rng(7)


def t(seg):
    return np.arange(int(SR * seg)) / SR


def guardar(nombre, x, pico=0.8):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * pico
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, nombre), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print('✓', nombre, f'{len(x) / SR:.2f}s')


def pasabajos(x, corte):
    """Filtro de un polo; `corte` puede ser un número o un array (cambia en el tiempo)."""
    corte = np.broadcast_to(np.asarray(corte, dtype=np.float64), x.shape)
    a = np.exp(-2 * np.pi * corte / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def env(n, ataque=0.004, caida=0.08):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / ataque) * np.exp(-tt / caida)


def tono(f, seg, caida=0.08, parciales=((1, 1.0),)):
    tt = t(seg)
    s = sum(a * np.sin(2 * np.pi * f * k * tt) for k, a in parciales)
    return s * env(len(tt), caida=caida)


def mezclar(largo_seg, eventos):
    out = np.zeros(int(SR * largo_seg))
    for inicio, x in eventos:
        i = int(inicio * SR)
        out[i:i + len(x)] += x[: max(0, len(out) - i)]
    return out


# ---------------- efectos de chat ----------------
def recibido():
    # burbuja que llega: dos notas cortas que suben, tipo "pop"
    a = tono(1046, 0.09, 0.035, ((1, 1), (2, 0.25)))
    b = tono(1568, 0.14, 0.05, ((1, 1), (2, 0.2)))
    return mezclar(0.2, [(0, a), (0.055, b * 0.9)])


def enviado():
    # envío: barrido corto hacia arriba con un soplo de aire
    tt = t(0.12)
    f = 520 + 900 * (tt / tt[-1]) ** 0.7
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.003, 0.045)
    aire = pasabajos(rng.standard_normal(len(tt)), 4000) * env(len(tt), 0.002, 0.03) * 0.25
    return s + aire


def tecleo():
    # puntitos de "escribiendo…": clics suaves de teclado al azar
    largo = 1.0
    eventos = []
    tiempo = 0.03
    while tiempo < largo - 0.05:
        n = int(SR * 0.012)
        click = pasabajos(rng.standard_normal(n), 2500 + rng.uniform(0, 1500)) * env(n, 0.0005, 0.003)
        eventos.append((tiempo, click * rng.uniform(0.5, 1.0)))
        tiempo += rng.uniform(0.07, 0.16)
    return mezclar(largo, eventos)


def foto():
    # foto que llega: "pop" más grave y redondo
    a = tono(660, 0.16, 0.06, ((1, 1), (2, 0.3), (3, 0.1)))
    b = tono(990, 0.18, 0.07, ((1, 1), (2, 0.2)))
    return mezclar(0.25, [(0, a), (0.045, b * 0.8)])


# ---------------- efectos de marca ----------------
def campana(f, seg=1.6):
    return tono(f, seg, 0.5, ((1, 1), (2.76, 0.35), (5.4, 0.12)))


def campanita():
    # aparición del logo: arpegio brillante (Do mayor)
    notas = [1046.5, 1318.5, 1568.0, 2093.0]
    return mezclar(2.0, [(i * 0.075, campana(f) * (0.9 - i * 0.12)) for i, f in enumerate(notas)])


def whoosh():
    # entrada de la tarjeta: ruido que se abre y se cierra
    tt = t(0.75)
    forma = np.sin(np.pi * tt / tt[-1]) ** 1.6
    corte = 250 + 3200 * forma
    return pasabajos(rng.standard_normal(len(tt)), corte) * forma


# ---------------- música de fondo ----------------
def musica(seg=22.0, bpm=96):
    tt = t(seg)
    out = np.zeros(len(tt))
    pulso = 60 / bpm
    compas = 4 * pulso
    # Do maj7 · La m7 · Fa maj7 · Sol (sus) — cálido y tranquilo
    acordes = [
        [261.6, 329.6, 392.0, 493.9],
        [220.0, 261.6, 329.6, 392.0],
        [174.6, 220.0, 261.6, 329.6],
        [196.0, 246.9, 293.7, 392.0],
    ]
    bajos = [65.4, 55.0, 43.7, 49.0]

    def piano(f, dur, vel):
        n = int(SR * dur)
        x = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * 2 * f * x) + 0.12 * np.sin(2 * np.pi * 3 * f * x)
             + 0.5 * np.sin(2 * np.pi * (f * 1.003) * x))
        return s * env(n, 0.008, 0.9) * vel

    def poner(inicio, x):
        i = int(inicio * SR)
        if i >= len(out):
            return
        fin = min(len(out), i + len(x))
        out[i:fin] += x[: fin - i]

    c = 0
    while c * compas < seg:
        base = c * compas
        k = c % 4
        # acorde en el 1 y en el "y" del 2 (un poco sincopado)
        for off, vel in ((0, 0.16), (1.5 * pulso, 0.09)):
            for j, f in enumerate(acordes[k]):
                poner(base + off + j * 0.012, piano(f, 2.4, vel))
        # bajo en el 1 y el 3
        for off in (0, 2 * pulso):
            n = int(SR * pulso * 1.8)
            x = np.arange(n) / SR
            poner(base + off, (np.sin(2 * np.pi * bajos[k] * x) + 0.3 * np.sin(4 * np.pi * bajos[k] * x)) * env(n, 0.01, 0.5) * 0.45)
        # bombo suave en el 1 y el 3
        for off in (0, 2 * pulso):
            n = int(SR * 0.3)
            x = np.arange(n) / SR
            f = 50 + 70 * np.exp(-x / 0.03)
            poner(base + off, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * 0.5)
        # shaker en corcheas, más fuerte a contratiempo
        for e in range(8):
            n = int(SR * 0.06)
            ruido = rng.standard_normal(n)
            agudo = ruido - pasabajos(ruido, 5000)
            poner(base + e * pulso / 2, agudo * env(n, 0.004, 0.02) * (0.05 if e % 2 else 0.025))
        # pequeña melodía de campanita cada dos compases
        if c % 2 == 1:
            for i, f in enumerate([783.99, 659.25, 783.99, 1046.5][: 3 + (c % 4 == 3)]):
                poner(base + (i * 0.5 + 0.5) * pulso, campana(f, 1.2) * 0.06)
        c += 1

    # entrada y salida suaves
    fade_in = np.minimum(1, tt / 0.8)
    fade_out = np.clip((seg - tt) / 1.8, 0, 1)
    return out * fade_in * fade_out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    guardar('recibido.wav', recibido())
    guardar('enviado.wav', enviado())
    guardar('tecleo.wav', tecleo(), 0.6)
    guardar('foto.wav', foto())
    guardar('campanita.wav', campanita(), 0.7)
    guardar('whoosh.wav', whoosh(), 0.6)
    guardar('musica.wav', musica(), 0.7)
