import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, ZONA } from "../marca/tokens";
import { normalizar } from "../lib/anim";
import type { BloqueTiming } from "../tipos";

type Grupo = { palabras: { t: string; s: number; e: number; clave: boolean }[]; s: number; e: number; claro: boolean };

/**
 * Subtítulos grandes, por grupos de 2–4 palabras, sincronizados palabra a palabra.
 * Solo se resaltan las palabras de `destacar` (en bronce). Sin rebotes.
 */
export const DynamicSubtitle: React.FC<{
  bloques: BloqueTiming[];
  destacar: string[][];
  tonos: ("oscuro" | "claro")[];
  maxPalabras?: number;
}> = ({ bloques, destacar, tonos, maxPalabras = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const grupos = useMemo(() => {
    const out: Grupo[] = [];
    bloques.forEach((b, bi) => {
      const claves = new Set((destacar[bi] ?? []).map(normalizar));
      let actual: Grupo["palabras"] = [];
      const cerrar = () => {
        if (actual.length) out.push({ palabras: actual, s: actual[0].s, e: actual[actual.length - 1].e, claro: tonos[bi] === "claro" });
        actual = [];
      };
      // Reglas de corte: puntuación, máx. palabras o ~22 caracteres (una línea a 66 px),
      // y nunca terminar un grupo en una palabra de enlace ("en", "de", "la", "y"…).
      const ENLACE = /^(a|al|el|la|lo|las|los|un|una|en|de|del|y|o|que|si|tu|tus|mi|por|para|con|sin|se|no|es|le|te|me)$/i;
      const largo = () => actual.reduce((n, w) => n + w.t.length + 1, 0);
      b.palabras.forEach((p, i) => {
        actual.push({ ...p, clave: claves.has(normalizar(p.t)) });
        const fin = /[.,;:?!]$/.test(p.t);
        const sig = b.palabras[i + 1];
        const lleno = actual.length >= maxPalabras || (sig && largo() + sig.t.length > 22);
        if (fin) return cerrar();
        if (!lleno) return;
        // las palabras de enlace del final pasan al grupo siguiente
        const arrastre: Grupo["palabras"] = [];
        while (actual.length > 2 && ENLACE.test(actual[actual.length - 1].t)) arrastre.unshift(actual.pop()!);
        cerrar();
        actual = arrastre;
      });
      cerrar();
    });
    // cada grupo permanece hasta que empieza el siguiente (máx. 0.6 s de espera)
    return out.map((g, i) => ({ ...g, e: Math.min(out[i + 1]?.s ?? g.e + 0.6, g.e + 0.6) }));
  }, [bloques, destacar, tonos, maxPalabras]);

  const g = grupos.find((x) => t >= x.s - 0.08 && t < x.e);
  if (!g) return null;
  const aparicion = Math.min(1, (t - (g.s - 0.08)) / 0.12);
  const claro = g.claro;

  return (
    <div
      style={{
        position: "absolute", left: ZONA.lateral, right: ZONA.lateral, top: ZONA.subtitulos,
        display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 18, rowGap: 4,
        fontFamily: F.sans, fontWeight: 800, fontSize: 66, lineHeight: 1.15, letterSpacing: -0.8, textAlign: "center",
        opacity: aparicion, transform: `translateY(${(1 - aparicion) * 10}px)`,
      }}
    >
      {g.palabras.map((p, i) => {
        const dicha = t >= p.s - 0.03;
        const color = p.clave ? (claro ? C.bronceOscuro : C.bronceClaro) : claro ? C.verde : C.blanco;
        return (
          <span
            key={i}
            style={{
              color,
              opacity: dicha ? 1 : 0.42,
              textShadow: claro ? "none" : "0 3px 18px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)",
            }}
          >
            {p.t}
          </span>
        );
      })}
    </div>
  );
};
