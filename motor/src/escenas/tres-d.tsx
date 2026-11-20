import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { C, F, ZONA } from "../marca/tokens";
import { entra, mezcla, recorrido } from "../lib/anim";
import { Etiqueta, LineasReveladas, Sonido } from "../componentes/base";
import type { EscenaProps } from "../tipos";

/**
 * 10. ArchitectureScene — Local comercial en 3D (Three.js / React Three Fiber).
 * Modelo procedural sencillo y bien iluminado (Directiva 2.0, §4-D). Ilustrativo.
 */

type V3 = [number, number, number];
type Plano = { pos: V3; mira: V3; fov: number };

const PLANOS: Record<string, [Plano, Plano]> = {
  aproximacion: [
    { pos: [5, 2.4, 26], mira: [0, 5.2, -1], fov: 42 },
    { pos: [1.2, 1.9, 14], mira: [0, 4.6, -1], fov: 42 },
  ],
  interior: [
    { pos: [0.4, 1.7, 5.5], mira: [0, 1.6, -6], fov: 50 },
    { pos: [0.7, 1.55, 2.2], mira: [-0.3, 1.3, -6], fov: 52 },
  ],
  cenital: [
    { pos: [9, 11, 9], mira: [0, 0.6, -3], fov: 32 },
    { pos: [5, 12.5, 11], mira: [0, 0.4, -3], fov: 32 },
  ],
};

const Camara: React.FC<{ plano: [Plano, Plano]; t: number }> = ({ plano, t }) => {
  const { camera } = useThree();
  const [a, b] = plano;
  const p = a.pos.map((v, i) => mezcla(v, b.pos[i], t)) as V3;
  const m = a.mira.map((v, i) => mezcla(v, b.mira[i], t)) as V3;
  camera.position.set(...p);
  (camera as THREE.PerspectiveCamera).fov = mezcla(a.fov, b.fov, t);
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...m);
  return null;
};

const Caja: React.FC<{ p: V3; s: V3; color: string; rugosidad?: number; emisivo?: string; intensidad?: number; sombra?: boolean; opacidad?: number }> = ({
  p, s, color, rugosidad = 0.85, emisivo, intensidad = 0, sombra = true, opacidad,
}) => (
  <mesh position={p} castShadow={sombra} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial
      color={color} roughness={rugosidad} emissive={emisivo ?? "#000"} emissiveIntensity={intensidad}
      transparent={opacidad !== undefined} opacity={opacidad ?? 1}
    />
  </mesh>
);

function useCartel(texto: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = C.beige;
    g.fillRect(0, 0, 1024, 256);
    g.fillStyle = C.verde;
    g.font = `800 120px ${F.sans}, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(texto, 512, 136);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [texto]);
}

const Local: React.FC<{ luces: number; corte: boolean; cartel?: string }> = ({ luces, corte, cartel }) => {
  const tex = useCartel(cartel ?? "");
  const vecinas: { x: number; w: number; h: number; c: string }[] = [
    { x: -7.6, w: 7, h: 9, c: "#d8cdb9" },
    { x: 7.6, w: 7, h: 11, c: "#cfc3ad" },
  ];
  return (
    <group>
      {/* calle y acera */}
      <Caja p={[0, -0.06, 4]} s={[60, 0.1, 30]} color="#2a302d" sombra={false} />
      <Caja p={[0, 0.06, 1.6]} s={[30, 0.12, 3.2]} color="#9a9282" sombra={false} />
      {/* suelo interior (madera clara) */}
      <Caja p={[0, 0.08, -3.2]} s={[6, 0.1, 6.4]} color="#c9a87c" rugosidad={0.6} />
      {/* paredes */}
      <Caja p={[0, 1.7, -6.45]} s={[6.2, 3.4, 0.1]} color="#e9e1d2" />
      <Caja p={[-3.05, 1.7, -3.2]} s={[0.1, 3.4, 6.5]} color="#e2d9c8" />
      <Caja p={[3.05, 1.7, -3.2]} s={[0.1, 3.4, 6.5]} color="#e2d9c8" />
      {!corte && <Caja p={[0, 3.45, -3.2]} s={[6.2, 0.1, 6.5]} color="#f1ece2" />}
      {/* mostrador y estanterías */}
      <Caja p={[1.4, 0.6, -4.6]} s={[2.4, 1.0, 0.8]} color={C.bronce} rugosidad={0.5} />
      {[0.9, 1.6, 2.3].map((y) => <Caja key={y} p={[-1.2, y, -6.25]} s={[3, 0.06, 0.35]} color="#8c6b45" />)}
      {/* atrezo: taburetes, planta, cuadro, alfombra */}
      {[0.6, 2.2].map((x) => (
        <group key={x}>
          <Caja p={[x, 0.75, -3.9]} s={[0.42, 0.06, 0.42]} color="#2a2f2d" />
          <Caja p={[x, 0.42, -3.9]} s={[0.06, 0.66, 0.06]} color="#2a2f2d" />
        </group>
      ))}
      <Caja p={[-2.4, 0.35, -5.6]} s={[0.5, 0.6, 0.5]} color="#cdbfa6" />
      <mesh position={[-2.4, 1.05, -5.6]} castShadow>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color="#3f6b4f" roughness={0.9} />
      </mesh>
      <Caja p={[2.98, 1.9, -3]} s={[0.04, 1.1, 1.6]} color={C.bronce} rugosidad={0.5} />
      <Caja p={[2.95, 1.9, -3]} s={[0.03, 0.9, 1.4]} color="#e8ddc9" />
      <Caja p={[-0.4, 0.14, -2.6]} s={[3.2, 0.02, 2]} color="#8a7a63" sombra={false} />
      {/* lámparas: se encienden con `luces` */}
      {[-1.5, 0, 1.5].map((x) => (
        <group key={x}>
          <Caja p={[x, 3.15, -3.2]} s={[0.02, 0.5, 0.02]} color="#1d2220" sombra={false} />
          <mesh position={[x, 2.85, -3.2]}>
            <cylinderGeometry args={[0.08, 0.32, 0.26, 24, 1, true]} />
            <meshStandardMaterial color="#1d2220" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[x, 2.76, -3.2]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshStandardMaterial color="#fff2d6" emissive="#ffd9a0" emissiveIntensity={0.3 + luces * 4} />
          </mesh>
          <pointLight position={[x, 2.7, -3.2]} intensity={luces * 9} distance={7} color="#ffd8a3" />
        </group>
      ))}
      {/* fachada: pilares, dintel, escaparate */}
      {!corte && (
        <>
          <Caja p={[-3.25, 2.4, 0.15]} s={[0.5, 4.8, 0.5]} color="#d9cfbd" />
          <Caja p={[3.25, 2.4, 0.15]} s={[0.5, 4.8, 0.5]} color="#d9cfbd" />
          <Caja p={[0, 4.2, 0.15]} s={[7, 1.6, 0.5]} color="#e7dfd0" />
          {/* plantas superiores */}
          <Caja p={[0, 7.6, -3]} s={[7, 5.2, 6.8]} color="#eae3d6" />
          {[-2, 0, 2].map((x) => [6.4, 8.4].map((y) => <Caja key={`${x}${y}`} p={[x, y, 0.42]} s={[1.2, 1.3, 0.05]} color="#4d6a62" emisivo="#f3c47e" intensidad={(Math.round(x + y) % 3 === 0 ? 0.9 : 0.12)} rugosidad={0.25} sombra={false} />))}
          {/* cartel */}
          <mesh position={[0, 4.2, 0.42]}>
            <planeGeometry args={[4.2, 1.05]} />
            <meshStandardMaterial map={tex} roughness={0.7} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.25} />
          </mesh>
          {/* toldo */}
          <mesh position={[0, 3.25, 0.75]} rotation={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[6, 0.06, 1.3]} />
            <meshStandardMaterial color={C.verde} roughness={0.8} />
          </mesh>
        </>
      )}
      {/* escaparate de cristal y carpintería */}
      <Caja p={[0, 1.7, 0.05]} s={[6, 3.2, 0.04]} color="#9fb7b0" rugosidad={0.1} opacidad={corte ? 0.08 : 0.22} sombra={false} />
      {[-3, -1, 1, 3].map((x) => <Caja key={x} p={[x, 1.7, 0.08]} s={[0.08, 3.2, 0.1]} color="#1d2220" />)}
      <Caja p={[0, 0.2, 0.08]} s={[6, 0.12, 0.12]} color="#1d2220" />
      <Caja p={[0, 3.3, 0.08]} s={[6, 0.08, 0.12]} color="#1d2220" />
      {/* edificios vecinos */}
      {!corte &&
        vecinas.map((v) => (
          <group key={v.x}>
            <Caja p={[v.x, v.h / 2, -3]} s={[v.w, v.h, 7]} color={v.c} />
            {Array.from({ length: Math.floor(v.h / 2.2) }).map((_, i) =>
              [-2, 0, 2].map((dx) => (
                <Caja key={`${i}${dx}`} p={[v.x + dx, 1.8 + i * 2.2, 0.52]} s={[1.1, 1.2, 0.04]} color="#2c4a42" emisivo="#f3c47e" intensidad={(i + dx + 7) % 4 === 0 ? 0.7 : 0.04} sombra={false} />
              )),
            )}
          </group>
        ))}
    </group>
  );
};

type Ficha = { texto: string; en: string };
export const ArchitectureScene: React.FC<
  EscenaProps<{ modelo: "local"; camara: keyof typeof PLANOS; titular?: string[]; etiqueta?: string; encenderEn?: string; cartel?: string; fichas?: Ficha[] }>
> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = recorrido(frame, dur + 20);
  const enc = props.encenderEn ? marca(props.encenderEn, Math.round(dur * 0.7)) : -1;
  const luces = props.camara === "aproximacion" ? 0.55 : props.camara === "cenital" ? 1 : interpolate(frame, [enc - 4, enc + 14], [0.22, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const corte = props.camara === "cenital";
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0f221d 0%, ${C.verdeClaro} 45%, #b99a72 62%, #2a302d 63%)` }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 40, near: 0.1, far: 200 }}>
        <Camara plano={PLANOS[props.camara]} t={t} />
        <color attach="background" args={[corte ? C.verde : "#18302a"]} />
        {!corte && <fog attach="fog" args={["#1b332c", 18, 45]} />}
        <hemisphereLight args={["#9fb3a6", "#2a2018", 0.6]} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[-8, 10, 9]} intensity={corte ? 2.2 : 1.6} color="#ffd9a8" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
        <Local luces={luces} corte={corte} cartel={props.cartel ?? "SE ALQUILA"} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(100% 60% at 50% 45%, transparent 50%, rgba(8,16,14,.6) 100%)" }} />
      {(props.titular || props.fichas) && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,22,19,.88) 0%, rgba(10,22,19,.0) 30%)" }} />}
      {props.titular && (
        <div style={{ position: "absolute", top: ZONA.arriba + 110, left: ZONA.lateral, right: ZONA.lateral }}>
          <LineasReveladas lineas={props.titular} tam={76} intervalo={9} />
        </div>
      )}
      {props.fichas && (
        <div style={{ position: "absolute", top: ZONA.arriba + 60, left: ZONA.lateral, right: ZONA.lateral, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
          {props.fichas.map((f, i) => {
            const k = entra(frame, marca(f.en, 10 + i * 14) - 4, 14);
            return (
              <div
                key={i}
                style={{
                  padding: "22px 10px", textAlign: "center", borderRadius: 20, fontFamily: F.sans, fontWeight: 800, fontSize: 40,
                  background: i === 0 ? C.beige : "rgba(20,43,37,.85)", color: i === 0 ? C.verde : C.beige, border: i === 0 ? "none" : `2px solid rgba(210,174,124,.45)`,
                  opacity: k, transform: `translateY(${(1 - k) * -30}px) scale(${0.9 + 0.1 * k})`, boxShadow: "0 16px 30px rgba(0,0,0,.35)",
                }}
              >
                {i === 0 ? f.texto : `+ ${f.texto}`}
              </div>
            );
          })}
        </div>
      )}
      {props.fichas?.map((f, i) => <Sonido key={i} en={marca(f.en, -1) - 4} src="tick" volumen={0.4} />)}
      {enc >= 0 && <Sonido en={enc - 4} src="pop" volumen={0.3} />}
      {props.etiqueta && <Etiqueta texto={props.etiqueta} />}
    </AbsoluteFill>
  );
};
