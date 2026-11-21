import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C, F } from "./marca/tokens";

/**
 * Foto de perfil de Instagram (1080×1080). Instagram la recorta en círculo:
 * todo lo importante queda dentro del 70 % central.
 * Variantes: "arco" (símbolo + 4), "monograma" (C4T en anillo), "minimal" (solo símbolo).
 */
export const FotoPerfil: React.FC<{ variante: "arco" | "monograma" | "minimal" }> = ({ variante }) => (
  <AbsoluteFill style={{ background: `radial-gradient(70% 70% at 50% 42%, ${C.verdeClaro} 0%, ${C.verde} 58%, #0c1a16 100%)` }}>
    <AbsoluteFill style={{ backgroundImage: `url(${staticFile("texturas/grano.png")})`, mixBlendMode: "overlay", opacity: 0.1 }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {variante === "monograma" ? (
        <div style={{ width: 640, height: 640, borderRadius: "50%", border: `10px solid ${C.bronce}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 300, color: C.beige, letterSpacing: -6, lineHeight: 1 }}>
            C<span style={{ fontStyle: "italic", color: C.bronceClaro }}>4</span>T
          </div>
        </div>
      ) : (
        <svg width={620} height={720} viewBox="0 0 100 116">
          <defs>
            <linearGradient id="bronceG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e2c08e" />
              <stop offset="0.55" stopColor={C.bronce} />
              <stop offset="1" stopColor="#8a6a40" />
            </linearGradient>
            <radialGradient id="luzPuerta" cx="0.5" cy="0.75" r="0.6">
              <stop offset="0" stopColor="#f3d9a4" stopOpacity="0.35" />
              <stop offset="1" stopColor="#f3d9a4" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* luz cálida dentro del umbral */}
          <path d="M20 106 V48 A30 30 0 0 1 80 48 V106 Z" fill="url(#luzPuerta)" />
          <path d="M20 106 V48 A30 30 0 0 1 80 48 V106" fill="none" stroke="url(#bronceG)" strokeWidth={5.5} strokeLinecap="round" />
          <line x1="8" y1="106" x2="92" y2="106" stroke={C.bronce} strokeWidth={5.5} strokeLinecap="round" />
          {variante === "arco" ? (
            <text x="50" y="92" textAnchor="middle" fontFamily={F.serif} fontStyle="italic" fontWeight={600} fontSize={58} fill={C.beige}>
              4
            </text>
          ) : (
            <circle cx="66" cy="80" r="3.6" fill="url(#bronceG)" />
          )}
        </svg>
      )}
    </AbsoluteFill>
  </AbsoluteFill>
);
