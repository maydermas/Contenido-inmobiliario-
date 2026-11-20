import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F, MARCA, ZONA } from "../marca/tokens";
import { entra } from "../lib/anim";

/** Símbolo: arco de puerta (decidir = cruzar un umbral) con una línea de horizonte. */
export const Simbolo: React.FC<{ tam?: number; color?: string; trazo?: number }> = ({ tam = 120, color = C.bronce, trazo = 1 }) => (
  <svg width={tam} height={tam * 1.25} viewBox="0 0 100 125">
    <path
      d="M18 118 V52 A32 32 0 0 1 82 52 V118"
      fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"
      strokeDasharray={260} strokeDashoffset={260 * (1 - trazo)}
    />
    <line x1="6" y1="118" x2="94" y2="118" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={trazo} />
    <circle cx="66" cy="86" r="3.6" fill={color} opacity={trazo} />
  </svg>
);

/** Marca de agua discreta en la parte superior de todos los vídeos */
export const MarcaAgua: React.FC<{ claro?: boolean }> = ({ claro }) => (
  <div
    style={{
      position: "absolute", top: ZONA.arriba - 70, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
      fontFamily: F.sans, fontWeight: 700, fontSize: 24, letterSpacing: 6, textTransform: "uppercase",
      color: claro ? "rgba(20,43,37,.55)" : "rgba(232,221,201,.55)",
    }}
  >
    <Simbolo tam={22} color={claro ? "rgba(20,43,37,.55)" : "rgba(210,174,124,.8)"} />
    {MARCA.nombre}
  </div>
);

/** Firma final: símbolo que se dibuja + nombre + lema */
export const BrandSignature: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const frame = useCurrentFrame() - desde;
  const trazo = entra(frame, 0, 30);
  const nombre = entra(frame, 14, 20);
  const lema = entra(frame, 26, 24);
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Simbolo tam={130} trazo={trazo} />
      <div style={{ marginTop: 34, fontFamily: F.serif, fontWeight: 600, fontSize: 104, color: C.beige, opacity: nombre, transform: `translateY(${(1 - nombre) * 20}px)` }}>
        {MARCA.nombre}
      </div>
      <div
        style={{
          marginTop: 28, maxWidth: 820, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontWeight: 500,
          fontSize: 44, lineHeight: 1.3, color: C.bronceClaro, opacity: lema,
        }}
      >
        «{MARCA.lema}»
      </div>
    </div>
  );
};
