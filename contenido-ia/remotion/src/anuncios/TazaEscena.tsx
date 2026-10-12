// Escena 3D del anuncio: taza con arte latte, vapor y granos que caen. Todo depende del frame (determinista).
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MarcaAnuncio } from './marca';

const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

function lienzo(size: number, dibujar: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  dibujar(cv.getContext('2d')!, size);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const texLatte = (m: MarcaAnuncio) => lienzo(512, (c, s) => {
  const g = c.createRadialGradient(s / 2, s / 2, s * 0.05, s / 2, s / 2, s / 2);
  g.addColorStop(0, '#b97a45'); g.addColorStop(0.55, m.color.liquido); g.addColorStop(0.85, '#7a4826'); g.addColorStop(1, '#4a2914');
  c.fillStyle = g; c.fillRect(0, 0, s, s);
  // corazón de leche
  c.save(); c.translate(s / 2, s / 2 + 20); c.scale(1.6, 1.6);
  c.filter = 'blur(3px)'; c.fillStyle = m.color.espuma;
  c.beginPath(); c.moveTo(0, 60);
  c.bezierCurveTo(-110, -10, -70, -95, 0, -45);
  c.bezierCurveTo(70, -95, 110, -10, 0, 60); c.fill();
  c.fillStyle = '#c99566'; c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-60, -5, -38, -55, 0, -28); c.bezierCurveTo(38, -55, 60, -5, 0, 40); c.fill();
  c.fillStyle = m.color.espuma; c.beginPath(); c.moveTo(0, 22); c.bezierCurveTo(-28, 2, -16, -24, 0, -12); c.bezierCurveTo(16, -24, 28, 2, 0, 22); c.fill();
  c.restore();
});
const texVapor = () => lienzo(256, (c, s) => {
  for (let i = 0; i < 9; i++) {
    const x = s / 2 + (rnd(i) - 0.5) * s * 0.35, y = s * (0.2 + 0.6 * rnd(i + 9)), r = s * (0.12 + 0.12 * rnd(i + 3));
    const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
  }
});
const texSombra = () => lienzo(256, (c, s) => {
  const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, s, s);
});
const texGrano = () => lienzo(128, (c, s) => {
  c.fillStyle = '#4a2a17'; c.fillRect(0, 0, s, s);
  const g = c.createLinearGradient(0, 0, s, 0); g.addColorStop(0.2, 'rgba(0,0,0,0)'); g.addColorStop(0.25, 'rgba(20,8,2,0.95)'); g.addColorStop(0.3, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, s, s);
});

// Cámara animada por tramos del anuncio.
export const Camara: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const dist = interpolate(f, [0, 150, 300, 325, 390, 412], [8.6, 8.4, 7.4, 9.8, 9.8, 9.2], cl);
    const ang = interpolate(f, [0, 450], [-0.25, 0.35], cl);
    const alto = interpolate(f, [0, 150, 300, 450], [3.0, 3.4, 3.1, 3.5], cl);
    camera.position.set(Math.sin(ang) * dist, alto, Math.cos(ang) * dist);
    camera.lookAt(0, interpolate(f, [0, 300, 325, 390, 412], [1.3, 1.25, 1.75, 1.75, 0.55], cl), 0);
  }, [camera, f]);
  return null;
};

export const TazaEscena: React.FC<{ marca: MarcaAnuncio }> = ({ marca }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = useMemo(() => ({ latte: texLatte(marca), vapor: texVapor(), sombra: texSombra(), grano: texGrano() }), [marca]);

  const perfil = useMemo(() => {
    const p: THREE.Vector2[] = [];
    // exterior (abajo → borde) y luego interior (borde → fondo)
    const ext = [[0, 0.02], [0.5, 0.02], [0.56, 0.08], [0.66, 0.45], [0.76, 0.95], [0.82, 1.25], [0.83, 1.29]];
    const int = [[0.78, 1.29], [0.77, 1.22], [0.71, 0.9], [0.6, 0.45], [0.48, 0.14], [0, 0.12]];
    [...ext, ...int].forEach(([x, y]) => p.push(new THREE.Vector2(x, y)));
    return p;
  }, []);

  // entrada de la taza
  const sube = spring({ frame: f - 52, fps, config: { damping: 13, mass: 0.9 } });
  const y = interpolate(sube, [0, 1], [-3.2, 0]);
  const giro = interpolate(f, [52, 140], [-2.4, 0], { ...cl, easing: t => 1 - Math.pow(1 - t, 3) }) + Math.sin(f / 40) * 0.12 + (f > 140 ? (f - 140) * 0.004 : 0);

  // granos cayendo: lluvia densa en el gancho, luego algunos sueltos
  const N = 70;
  const granos = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = granos.current; if (!m) return;
    const o = new THREE.Object3D();
    const visibles = Math.round(interpolate(f, [40, 90], [N, 22], cl));
    for (let i = 0; i < N; i++) {
      const vel = 0.05 + 0.05 * rnd(i + 1);
      const fase = rnd(i + 2) * 9;
      const yy = 5.5 - (((f * vel + fase) % 9));
      const z = -2.5 + 3.6 * rnd(i + 4);
      o.position.set((rnd(i + 3) - 0.5) * (5 + 2 * (z + 2.5) / 3.6), yy, z);
      o.rotation.set(f * 0.04 * (rnd(i + 5) - 0.5) + i, f * 0.05 * (rnd(i + 6) - 0.3) + i * 2, i);
      const s = i < visibles ? 0.14 + 0.05 * rnd(i + 7) : 0;
      o.scale.set(s * 0.78, s, s * 0.58);
      o.updateMatrix(); m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [f]);

  return (
    <>
      <Camara f={f} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#ffe2c0', '#2a160c', 0.8]} />
      <directionalLight position={[3, 6, 4]} intensity={2.4} color="#ffe8cc" />
      <directionalLight position={[-4, 2, -3]} intensity={1.6} color={marca.color.acento} />

      <instancedMesh ref={granos} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial map={tex.grano} roughness={0.38} metalness={0.05} />
      </instancedMesh>

      <group position={[0, y, 0]} rotation={[0, giro, 0]} scale={sube > 0.001 ? 1 : 0.0001}>
        {/* sombra de contacto */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial map={tex.sombra} transparent depthWrite={false} />
        </mesh>
        {/* plato */}
        <mesh position={[0, -0.03, 0]}>
          <cylinderGeometry args={[1.3, 1.1, 0.07, 64]} />
          <meshStandardMaterial color={marca.color.producto} roughness={0.32} />
        </mesh>
        {/* taza */}
        <mesh>
          <latheGeometry args={[perfil, 72]} />
          <meshStandardMaterial color={marca.color.producto} roughness={0.28} side={THREE.DoubleSide} />
        </mesh>
        {/* banda de color de la marca */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.738, 0.706, 0.16, 72, 1, true]} />
          <meshStandardMaterial color={marca.color.acento} roughness={0.4} />
        </mesh>
        {/* asa */}
        <mesh position={[0.78, 0.72, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.28, 0.07, 18, 36, Math.PI * 1.15]} />
          <meshStandardMaterial color={marca.color.producto} roughness={0.28} />
        </mesh>
        {/* café con arte latte */}
        <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.775, 64]} />
          <meshStandardMaterial map={tex.latte} roughness={0.25} />
        </mesh>
      </group>

      {/* vapor */}
      {[0, 1, 2, 3].map(i => {
        const per = 96, t = ((f + i * (per / 4)) % per) / per;
        const o = Math.sin(Math.PI * t) * 0.3 * interpolate(f, [110, 140], [0, 1], cl);
        return (
          <mesh key={i} position={[Math.sin(t * 5 + i) * 0.2, y + 1.45 + t * 1.7, 0.2]} scale={[1.2 + t * 1.2, 1.4 + t, 1]}>
            <planeGeometry args={[1, 1.4]} />
            <meshBasicMaterial map={tex.vapor} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
    </>
  );
};
