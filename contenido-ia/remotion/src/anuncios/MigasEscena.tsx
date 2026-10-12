// Escena 3D: sándwich de miga triple que se arma capa por capa, budín glaseado y corazones flotando.
import React, { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function lienzo(w: number, h: number, dibujar: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; dibujar(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// miga de pan: crema con poros finos
const texMiga = () => lienzo(256, 256, c => {
  c.fillStyle = '#f6ecd8'; c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${200 + rnd(i) * 30},${180 + rnd(i + 1) * 30},${140 + rnd(i + 2) * 30},0.35)`; c.beginPath(); c.arc(rnd(i + 3) * 256, rnd(i + 4) * 256, 0.6 + rnd(i + 5) * 1.6, 0, 7); c.fill(); }
});
const texSombra = () => lienzo(256, 256, c => {
  const g = c.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(80,45,20,0.45)'); g.addColorStop(1, 'rgba(80,45,20,0)');
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
});
const texBudin = () => lienzo(256, 256, c => {
  const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#9a5a24'); g.addColorStop(1, '#c98a44');
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(90,45,15,${0.15 + rnd(i) * 0.2})`; c.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 256, 2, 2); }
});

const triangulo = (lado: number) => {
  const s = new THREE.Shape(); s.moveTo(-lado / 2, -lado / 3); s.lineTo(lado / 2, -lado / 3); s.lineTo(0, (2 * lado) / 3); s.closePath(); return s;
};
const corazon = () => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.35); s.bezierCurveTo(-0.6, 0.05, -0.35, 0.55, 0, 0.25); s.bezierCurveTo(0.35, 0.55, 0.6, 0.05, 0, -0.35); return s;
};

// capas del triple: [color, grosor, esPan]
const CAPAS: [string, number, boolean][] = [
  ['#f6ecd8', 0.12, true], ['#ee9c94', 0.07, false], ['#f5cf5c', 0.05, false],
  ['#f6ecd8', 0.12, true], ['#d8432f', 0.07, false], ['#78b046', 0.06, false],
  ['#f6ecd8', 0.12, true],
];

const Camara: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const dist = interpolate(f, [0, 170, 200, 270, 300, 360, 380], [11.5, 10, 12.2, 12.2, 13.4, 13.4, 12.6], cl);
    const ang = interpolate(f, [0, 450], [-0.35, 0.3], cl);
    camera.position.set(Math.sin(ang) * dist, interpolate(f, [0, 200, 450], [4.6, 5.0, 5.4], cl), Math.cos(ang) * dist);
    camera.lookAt(interpolate(f, [170, 200], [0, 0.7], cl), interpolate(f, [0, 270, 300, 360, 380], [1.0, 1.0, 1.9, 1.9, 0.15], cl), 0);
  }, [camera, f]);
  return null;
};

const Sandwich: React.FC<{ f: number; desde: number; x: number; rot: number; tex: THREE.Texture }> = ({ f, desde, x, rot, tex }) => {
  const { fps } = useVideoConfig();
  const geos = useMemo(() => CAPAS.map(([, h, pan]) => new THREE.ExtrudeGeometry(triangulo(pan ? 2.1 : 2.16), {
    depth: h, bevelEnabled: pan, bevelThickness: 0.03, bevelSize: 0.04, bevelSegments: 3, curveSegments: 4,
  })), []);
  let y = 0;
  return (
    <group position={[x, 0.06, 0]} rotation={[0, rot, 0]}>
      {CAPAS.map(([color, h, pan], i) => {
        const s = spring({ frame: f - desde - i * 5, fps, config: { damping: 12, mass: 0.6 } });
        const base = y; y += h + (pan ? 0.05 : 0.005);
        return (
          <mesh key={i} geometry={geos[i]} rotation={[-Math.PI / 2, 0, 0]} position={[0, base + (1 - s) * 3.5, 0]} visible={s > 0.01}>
            <meshStandardMaterial color={color} map={pan ? tex : null} roughness={pan ? 0.9 : 0.55} />
          </mesh>
        );
      })}
    </group>
  );
};

export const MigasEscena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = useMemo(() => ({ miga: texMiga(), sombra: texSombra(), budin: texBudin() }), []);
  const geo = useMemo(() => ({
    budin: new RoundedBoxGeometry(2.0, 0.85, 0.95, 5, 0.22),
    glaseado: new RoundedBoxGeometry(2.04, 0.12, 0.99, 4, 0.05),
    corazon: new THREE.ExtrudeGeometry(corazon(), { depth: 0.14, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 }),
  }), []);

  const plato = spring({ frame: f - 44, fps, config: { damping: 14 } });
  const budin = spring({ frame: f - 178, fps, config: { damping: 11, mass: 0.8 } });
  const giro = interpolate(f, [60, 450], [-0.3, 0.45], cl);

  return (
    <>
      <Camara f={f} />
      <hemisphereLight args={['#fff6ea', '#e8c9a8', 1.3]} />
      <directionalLight position={[3, 7, 5]} intensity={2.2} color="#fff1df" />
      <directionalLight position={[-5, 3, -2]} intensity={0.8} color="#ffd1c4" />

      {/* corazones flotando de fondo */}
      {Array.from({ length: 14 }, (_, i) => {
        const per = 240 + rnd(i) * 160, t = ((f + rnd(i + 1) * per) % per) / per;
        const x = (rnd(i + 2) - 0.5) * 18, z = -9 - rnd(i + 3) * 5;
        const s = 0.28 + rnd(i + 4) * 0.3;
        return (
          <mesh key={i} geometry={geo.corazon} position={[x, -4 + t * 15, z]} rotation={[0.1, f * 0.03 * (rnd(i + 5) - 0.5) + i, 0]} scale={s * Math.min(1, f / 12)}>
            <meshStandardMaterial color={i % 3 === 0 ? '#f19a8f' : i % 3 === 1 ? '#d8432f' : '#f6c1b5'} roughness={0.35} />
          </mesh>
        );
      })}

      <group rotation={[0, giro, 0]} position={[0, interpolate(plato, [0, 1], [-2, 0]), 0]} scale={plato > 0.001 ? 1 : 0.0001}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <planeGeometry args={[7, 7]} /><meshBasicMaterial map={tex.sombra} transparent depthWrite={false} />
        </mesh>
        {/* bandeja */}
        <mesh><cylinderGeometry args={[2.3, 2.15, 0.08, 72]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>
        <Sandwich f={f} desde={62} x={-0.62} rot={0.2} tex={tex.miga} />
        <Sandwich f={f} desde={92} x={0.75} rot={Math.PI + 0.35} tex={tex.miga} />
      </group>

      {/* budín glaseado */}
      <group position={[interpolate(budin, [0, 1], [8, 1.9]), 0.42, -2.1]} rotation={[0, -0.5 + (1 - budin) * 1.2, 0]} scale={budin > 0.001 ? 1 : 0.0001}>
        <mesh geometry={geo.budin}><meshStandardMaterial map={tex.budin} roughness={0.7} /></mesh>
        <mesh geometry={geo.glaseado} position={[0, 0.4, 0]}><meshStandardMaterial color="#fffaf0" roughness={0.25} /></mesh>
        {[-0.7, -0.25, 0.3, 0.75].map((dx, i) => (
          <mesh key={i} position={[dx, 0.26 - (i % 2) * 0.06, 0.49]}><capsuleGeometry args={[0.055, 0.16 + (i % 2) * 0.1, 4, 10]} /><meshStandardMaterial color="#fffaf0" roughness={0.25} /></mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, 0]}>
          <planeGeometry args={[3.2, 2]} /><meshBasicMaterial map={tex.sombra} transparent depthWrite={false} />
        </mesh>
      </group>
    </>
  );
};
