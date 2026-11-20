import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../marca/tokens";
import { Capa } from "../componentes/base";

/**
 * Vivienda mediterránea moderna al atardecer, en capas para parallax 2.5D.
 * Ilustrativa: no representa ningún inmueble real.
 * `t` progreso de cámara (0–1), `luces` intensidad de las ventanas (0–1).
 */
const W = 1080;
const H = 1920;

const Cielo: React.FC<{ calor: number }> = ({ calor }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d201c" />
        <stop offset="0.28" stopColor="#1f3d36" />
        <stop offset="0.43" stopColor="#6d6a52" />
        <stop offset="0.5" stopColor="#c69c6a" />
        <stop offset="0.545" stopColor="#ecd2a3" />
        <stop offset="0.56" stopColor="#ecd2a3" />
      </linearGradient>
      <radialGradient id="sol" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff1cf" stopOpacity="1" />
        <stop offset="0.25" stopColor="#f6d79f" stopOpacity="0.9" />
        <stop offset="1" stopColor="#f3d9a4" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#cielo)" />
    <circle cx={770} cy={1010} r={340} fill="url(#sol)" opacity={0.55 + calor * 0.25} />
    <circle cx={770} cy={1010} r={62} fill="#fff4d8" opacity={0.95} />
  </svg>
);

const Lejania: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a98b66" />
        <stop offset="1" stopColor="#3b4d44" />
      </linearGradient>
    </defs>
    {/* sierra lejana */}
    <path d="M0 990 L120 940 L210 965 L330 905 L450 950 L560 925 L680 975 L800 935 L930 970 L1080 930 L1080 1060 L0 1060 Z" fill="#4a5a4e" opacity={0.55} />
    <path d="M0 1030 L160 985 L300 1010 L420 980 L600 1020 L760 995 L900 1025 L1080 1000 L1080 1075 L0 1075 Z" fill="#2c4038" opacity={0.85} />
    {/* mar con reflejo */}
    <rect x={0} y={1070} width={W} height={70} fill="url(#mar)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={700 - i * 18} y={1078 + i * 12} width={140 + i * 36} height={3} fill="#f6dcaa" opacity={0.7 - i * 0.12} rx={2} />
    ))}
  </svg>
);

const Casa: React.FC<{ luces: number }> = ({ luces }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      <linearGradient id="muroBajo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9bfad" />
        <stop offset="1" stopColor="#ebe2d2" />
      </linearGradient>
      <linearGradient id="muroAlto" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#d8cfbf" />
        <stop offset="1" stopColor="#f4eee3" />
      </linearGradient>
      <linearGradient id="cristal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8dfa6" />
        <stop offset="1" stopColor="#c98e4c" />
      </linearGradient>
      <linearGradient id="cristalApagado" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3c514a" />
        <stop offset="1" stopColor="#1e2f2a" />
      </linearGradient>
      <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#21362f" />
        <stop offset="1" stopColor="#0c1815" />
      </linearGradient>
      <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="28" />
      </filter>
    </defs>
    {/* terreno */}
    <rect x={0} y={1135} width={W} height={H - 1135} fill="url(#suelo)" />
    {/* halo de luz de las ventanas sobre el terreno */}
    <ellipse cx={420} cy={1180} rx={360} ry={40} fill="#f3c47e" opacity={0.28 * luces} filter="url(#brillo)" />
    {/* volumen bajo */}
    <rect x={150} y={850} width={760} height={290} fill="url(#muroBajo)" />
    <rect x={150} y={842} width={760} height={12} fill="#9c9282" />
    {/* gran ventanal */}
    <rect x={200} y={905} width={360} height={235} fill="url(#cristalApagado)" />
    <rect x={200} y={905} width={360} height={235} fill="url(#cristal)" opacity={luces} />
    {[290, 380, 470].map((x) => <rect key={x} x={x} y={905} width={5} height={235} fill="#2a2a24" opacity={0.8} />)}
    <rect x={200} y={905} width={360} height={6} fill="#2a2a24" opacity={0.8} />
    {/* celosía de madera */}
    <rect x={600} y={890} width={270} height={250} fill="#6e5236" />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={606 + i * 19} y={890} width={10} height={250} fill={C.bronce} opacity={0.9} />)}
    {/* sombra del voladizo */}
    <rect x={260} y={850} width={650} height={34} fill="#000" opacity={0.18} />
    {/* volumen alto en voladizo */}
    <rect x={260} y={690} width={700} height={162} fill="url(#muroAlto)" />
    <rect x={260} y={682} width={700} height={12} fill="#a39a8a" />
    <rect x={330} y={730} width={560} height={86} fill="url(#cristalApagado)" />
    <rect x={330} y={730} width={560} height={86} fill="url(#cristal)" opacity={luces * 0.9} />
    {[470, 610, 750].map((x) => <rect key={x} x={x} y={730} width={5} height={86} fill="#2a2a24" opacity={0.8} />)}
    {/* sombra lateral del volumen alto para dar profundidad */}
    <rect x={900} y={690} width={60} height={162} fill="#000" opacity={0.08} />
    {/* piscina */}
    <rect x={110} y={1150} width={860} height={52} fill="#264a45" />
    <rect x={110} y={1150} width={860} height={6} fill="#d9cfbd" />
    {[0, 1, 2].map((i) => <rect key={i} x={180 + i * 210} y={1172 + (i % 2) * 10} width={130} height={3} rx={2} fill="#f3d9a4" opacity={0.35 + 0.35 * luces} />)}
  </svg>
);

const Palmera: React.FC<{ x: number; y: number; escala: number; espejo?: boolean }> = ({ x, y, escala, espejo }) => (
  <g transform={`translate(${x} ${y}) scale(${espejo ? -escala : escala} ${escala})`}>
    <path d="M0 0 C 10 -160, 40 -330, 30 -520" stroke="#0b1613" strokeWidth={26} fill="none" strokeLinecap="round" />
    {[
      "M30 -520 C 120 -560, 220 -540, 300 -470 C 210 -500, 120 -505, 30 -520Z",
      "M30 -520 C 110 -470, 170 -400, 200 -300 C 150 -380, 90 -450, 30 -520Z",
      "M30 -520 C -40 -590, -150 -600, -240 -560 C -140 -560, -50 -545, 30 -520Z",
      "M30 -520 C -40 -470, -100 -400, -130 -310 C -80 -390, -20 -460, 30 -520Z",
      "M30 -520 C 40 -610, 100 -680, 190 -700 C 120 -660, 70 -600, 30 -520Z",
      "M30 -520 C -10 -610, -70 -660, -150 -680 C -80 -630, -30 -580, 30 -520Z",
    ].map((d, i) => <path key={i} d={d} fill="#0b1613" />)}
  </g>
);

const Agave: React.FC<{ x: number; y: number; e: number }> = ({ x, y, e }) => (
  <g transform={`translate(${x} ${y}) scale(${e})`}>
    {[-70, -45, -22, 0, 22, 45, 70].map((a, i) => (
      <path key={i} d="M-14 0 Q -6 -150 0 -300 Q 6 -150 14 0 Z" fill="#0a1411" transform={`rotate(${a}) scale(${1 - Math.abs(a) / 200})`} />
    ))}
  </g>
);

const PrimerPlano: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <Palmera x={60} y={1420} escala={1.25} />
    <Palmera x={1070} y={1480} escala={1.05} espejo />
    <rect x={0} y={1400} width={W} height={H - 1400} fill="#0a1411" />
    <Agave x={150} y={1420} e={1.1} />
    <Agave x={330} y={1440} e={0.7} />
    <Agave x={880} y={1430} e={0.95} />
  </svg>
);

export const CasaAtardecer: React.FC<{ t: number; luces: number; calor?: number }> = ({ t, luces, calor = 0.5 }) => (
  <AbsoluteFill>
    <Capa t={t} profundidad={0.1}><Cielo calor={calor} /></Capa>
    <Capa t={t} profundidad={0.25}><Lejania /></Capa>
    <Capa t={t} profundidad={0.55}><Casa luces={luces} /></Capa>
    <Capa t={t} profundidad={1.3} desplazamiento={160} desenfoque={3}><PrimerPlano /></Capa>
  </AbsoluteFill>
);

/** Solo la casa (para escenas en las que se reutiliza el edificio) */
export { Casa as CasaSola };
