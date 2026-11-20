import React from "react";
import { C, F } from "../marca/tokens";

/** Superficie de mesa de madera vista desde arriba (fondo de documentos) */
export const Mesa: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="madera" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a3726" />
        <stop offset="0.5" stopColor="#3a2b1e" />
        <stop offset="1" stopColor="#261c14" />
      </linearGradient>
      <radialGradient id="luzMesa" cx="0.45" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#f3d9a4" stopOpacity="0.32" />
        <stop offset="1" stopColor="#f3d9a4" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#madera)" />
    {Array.from({ length: 26 }).map((_, i) => (
      <path key={i} d={`M-50 ${i * 80 + 20} C 300 ${i * 80 + 60}, 700 ${i * 80 - 10}, 1130 ${i * 80 + 40}`} stroke="#000" strokeOpacity={0.09} strokeWidth={2 + (i % 3)} fill="none" />
    ))}
    <rect width="1080" height="1920" fill="url(#luzMesa)" />
  </svg>
);

/** Hoja de papel con líneas de texto. `lineas` = nº de renglones de relleno */
export const Hoja: React.FC<{ titulo: string; ancho?: number; alto?: number; lineas?: number; children?: React.ReactNode }> = ({
  titulo, ancho = 760, alto = 980, lineas = 9, children,
}) => (
  <div
    style={{
      width: ancho, height: alto, background: `linear-gradient(160deg, ${C.blanco} 0%, #efe9dd 100%)`, borderRadius: 6,
      boxShadow: "0 40px 80px rgba(0,0,0,.45), 0 8px 18px rgba(0,0,0,.3)", padding: "70px 70px", boxSizing: "border-box", position: "relative",
    }}
  >
    <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 3, textTransform: "uppercase", color: C.verde }}>{titulo}</div>
    <div style={{ width: 90, height: 5, background: C.bronce, marginTop: 22, marginBottom: 40 }} />
    {children ??
      Array.from({ length: lineas }).map((_, i) => (
        <div key={i} style={{ height: 14, borderRadius: 7, background: "rgba(38,43,41,.16)", marginBottom: 26, width: `${[96, 88, 92, 70, 95, 84, 90, 60, 78][i % 9]}%` }} />
      ))}
  </div>
);

export const Pluma: React.FC<{ tam?: number }> = ({ tam = 520 }) => (
  <svg width={tam} height={tam * 0.12} viewBox="0 0 500 60">
    <defs>
      <linearGradient id="pluma" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2f3533" />
        <stop offset="1" stopColor="#111413" />
      </linearGradient>
    </defs>
    <path d="M20 30 L70 16 L440 16 Q470 30 440 44 L70 44 Z" fill="url(#pluma)" />
    <path d="M0 30 L22 22 L22 38 Z" fill={C.bronce} />
    <rect x={300} y={16} width={10} height={28} fill={C.bronce} />
  </svg>
);

export const Llave: React.FC<{ tam?: number; color?: string }> = ({ tam = 300, color = C.bronce }) => (
  <svg width={tam} height={tam * 0.42} viewBox="0 0 300 126">
    <defs>
      <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e2c08e" />
        <stop offset="0.5" stopColor={color} />
        <stop offset="1" stopColor="#6d5131" />
      </linearGradient>
    </defs>
    <circle cx={60} cy={63} r={52} fill="url(#metal)" />
    <circle cx={60} cy={63} r={22} fill="#1a1a17" opacity={0.9} />
    <rect x={105} y={52} width={185} height={22} rx={4} fill="url(#metal)" />
    <path d="M230 74 V96 H246 V84 H258 V100 H274 V74 Z" fill="url(#metal)" />
  </svg>
);

/** Balanza: `inclinacion` −1 (izquierda abajo) a 1 (derecha abajo) */
export const Balanza: React.FC<{ inclinacion: number; izquierda: React.ReactNode; derecha: React.ReactNode }> = ({ inclinacion, izquierda, derecha }) => {
  const ang = inclinacion * 11;
  const brazo = 330;
  const dy = Math.sin((ang * Math.PI) / 180) * brazo;
  const plato = (lado: -1 | 1, contenido: React.ReactNode) => {
    const y = 330 + lado * dy;
    const x = 540 + lado * Math.cos((ang * Math.PI) / 180) * brazo;
    return (
      <g>
        <line x1={x} y1={y} x2={x - 120} y2={y + 260} stroke={C.bronce} strokeWidth={3} />
        <line x1={x} y1={y} x2={x + 120} y2={y + 260} stroke={C.bronce} strokeWidth={3} />
        <path d={`M${x - 160} ${y + 260} Q ${x} ${y + 330} ${x + 160} ${y + 260} Z`} fill={C.bronce} />
        <foreignObject x={x - 200} y={y + 320} width={400} height={130}>
          <div style={{ display: "flex", height: "100%", alignItems: "flex-start", justifyContent: "center", textAlign: "center" }}>{contenido}</div>
        </foreignObject>
      </g>
    );
  };
  return (
    <svg width={1080} height={1000} viewBox="0 0 1080 1000">
      <path d="M540 330 L540 900" stroke={C.bronce} strokeWidth={14} strokeLinecap="round" />
      <path d="M420 900 L660 900" stroke={C.bronce} strokeWidth={16} strokeLinecap="round" />
      <circle cx={540} cy={320} r={18} fill={C.bronceClaro} />
      <g transform={`rotate(${ang} 540 330)`}>
        <line x1={540 - brazo} y1={330} x2={540 + brazo} y2={330} stroke={C.bronceClaro} strokeWidth={10} strokeLinecap="round" />
      </g>
      {plato(-1, izquierda)}
      {plato(1, derecha)}
    </svg>
  );
};

/** Ventana con luz entrando y polvo en suspensión */
export const VentanaLuz: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="haz" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f6dcaa" stopOpacity="0.55" />
        <stop offset="1" stopColor="#f6dcaa" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="paredLuz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a332c" />
        <stop offset="1" stopColor="#0d1b17" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#paredLuz)" />
    <g transform="translate(150 250)">
      <rect width={430} height={620} fill="#f3d9a4" opacity={0.92} />
      <rect x={210} width={12} height={620} fill="#1a332c" />
      <rect y={300} width={430} height={12} fill="#1a332c" />
    </g>
    <path d="M150 250 L580 250 L1080 1500 L1080 1920 L520 1920 Z" fill="url(#haz)" />
    {Array.from({ length: 40 }).map((_, i) => {
      const x = 300 + ((i * 137) % 700) + Math.sin((frame + i * 20) / 40) * 20;
      const y = 500 + ((i * 251) % 1100) - ((frame * (0.3 + (i % 5) * 0.1)) % 200);
      return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill="#fff3d6" opacity={0.25 + (i % 4) * 0.12} />;
    })}
  </svg>
);

/** Calculadora (frontal) con pantalla configurable */
export const Calculadora: React.FC<{ pantalla: React.ReactNode }> = ({ pantalla }) => (
  <div
    style={{
      width: 620, height: 860, borderRadius: 48, background: "linear-gradient(160deg, #2f3533 0%, #1a1e1d 100%)",
      boxShadow: "0 50px 90px rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.08)", padding: 46, boxSizing: "border-box",
    }}
  >
    <div
      style={{
        height: 230, borderRadius: 22, background: "linear-gradient(180deg, #d9e0c8 0%, #c3cbb2 100%)", boxShadow: "inset 0 6px 14px rgba(0,0,0,.35)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", padding: "20px 30px", boxSizing: "border-box",
        fontFamily: F.sans, color: "#1d2420",
      }}
    >
      {pantalla}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, marginTop: 40 }}>
      {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"].map((k) => (
        <div
          key={k}
          style={{
            height: 92, borderRadius: 20, background: k === "=" ? C.bronce : "#3a413f", color: k === "=" ? C.verde : C.beige,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 40,
            boxShadow: "0 6px 0 rgba(0,0,0,.35)",
          }}
        >
          {k}
        </div>
      ))}
    </div>
  </div>
);
