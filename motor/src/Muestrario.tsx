import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MARCA } from "./marca/tokens";
import { Acabado, Enfasis, Fondo } from "./componentes/base";
import { Simbolo } from "./componentes/BrandSignature";

/** Hoja de identidad: paleta, tipografías y símbolo. Se exporta como imagen en docs/marca/. */
export const Muestrario: React.FC = () => (
  <AbsoluteFill>
    <Fondo variante="verde" />
    <div style={{ position: "absolute", top: 200, left: 90, right: 90, color: C.beige, fontFamily: F.sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Simbolo tam={110} />
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 96 }}>{MARCA.nombre}</div>
      </div>
      <div style={{ marginTop: 30, fontFamily: F.serif, fontStyle: "italic", fontSize: 46, color: C.bronceClaro, lineHeight: 1.3 }}>«{MARCA.lema}»</div>
      <div style={{ marginTop: 90, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7 }}>Paleta</div>
      <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
        {[
          ["Verde", C.verde], ["Beige", C.beige], ["Blanco", C.blanco], ["Bronce", C.bronce], ["Gris", C.gris],
        ].map(([n, c]) => (
          <div key={n} style={{ flex: 1 }}>
            <div style={{ height: 180, borderRadius: 20, background: c, border: "2px solid rgba(232,221,201,.25)" }} />
            <div style={{ marginTop: 14, fontWeight: 700, fontSize: 28 }}>{n}</div>
            <div style={{ fontSize: 24, opacity: 0.7 }}>{c}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 90, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7 }}>Tipografía</div>
      <div style={{ marginTop: 20, fontWeight: 800, fontSize: 92, letterSpacing: -2, color: C.blanco, lineHeight: 1.1 }}>
        <Enfasis texto="Antes de decidir, *entiéndelo*." />
      </div>
      <div style={{ marginTop: 26, fontSize: 32, opacity: 0.8 }}>Manrope (titulares, subtítulos) · Cormorant Garamond cursiva (énfasis editorial)</div>
      <div style={{ marginTop: 90, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7 }}>Subtítulo</div>
      <div style={{ marginTop: 24, fontWeight: 800, fontSize: 66, color: C.blanco, textShadow: "0 3px 18px rgba(0,0,0,.55)" }}>
        haz la <span style={{ color: C.bronceClaro }}>cuenta completa</span>
      </div>
    </div>
    <Acabado />
  </AbsoluteFill>
);
