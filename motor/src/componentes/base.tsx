import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, random } from "remotion";
import { C, F, ZONA } from "../marca/tokens";
import { entra, mezcla, recorrido } from "../lib/anim";

/* ───────────── Fondos ───────────── */
export const Fondo: React.FC<{ variante?: "verde" | "beige" | "noche" }> = ({ variante = "verde" }) => {
  const bg =
    variante === "beige"
      ? `radial-gradient(120% 80% at 50% 25%, ${C.blanco} 0%, ${C.beige} 60%, #d9ccb4 100%)`
      : variante === "noche"
        ? `radial-gradient(110% 70% at 50% 30%, #1b352e 0%, #0f211c 55%, #0a1613 100%)`
        : `radial-gradient(120% 75% at 50% 28%, ${C.verdeClaro} 0%, ${C.verde} 55%, #0d1d19 100%)`;
  return <AbsoluteFill style={{ background: bg }} />;
};

/** Grano de película + viñeta. Va encima de todo para unificar la imagen. */
export const Acabado: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.floor(random(`gx${frame}`) * 256);
  const y = Math.floor(random(`gy${frame}`) * 256);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("texturas/grano.png")})`,
          backgroundPosition: `${x}px ${y}px`,
          mixBlendMode: "overlay",
          opacity: 0.16,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(90% 65% at 50% 42%, transparent 55%, rgba(5,12,10,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ───────────── Cámara virtual ───────────── */
export type Plano = { x?: number; y?: number; s?: number; r?: number };
export const Camara: React.FC<{ dur: number; desde?: Plano; hasta?: Plano; children: React.ReactNode; origen?: string }> = ({
  dur, desde = {}, hasta = {}, children, origen = "50% 40%",
}) => {
  const frame = useCurrentFrame();
  const t = recorrido(frame, dur);
  const x = mezcla(desde.x ?? 0, hasta.x ?? 0, t);
  const y = mezcla(desde.y ?? 0, hasta.y ?? 0, t);
  const s = mezcla(desde.s ?? 1, hasta.s ?? 1, t);
  const r = mezcla(desde.r ?? 0, hasta.r ?? 0, t);
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`, transformOrigin: origen }}>
      {children}
    </AbsoluteFill>
  );
};

/** Capa con parallax: `profundidad` 0 = fondo lejano, 1 = primer plano */
export const Capa: React.FC<{ t: number; profundidad: number; desplazamiento?: number; desenfoque?: number; children: React.ReactNode }> = ({
  t, profundidad, desplazamiento = 120, desenfoque = 0, children,
}) => (
  <AbsoluteFill
    style={{
      transform: `translateX(${-t * desplazamiento * profundidad}px) scale(${1 + t * 0.06 * profundidad})`,
      filter: desenfoque ? `blur(${desenfoque}px)` : undefined,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ───────────── Texto con énfasis: "*palabras*" → serif cursiva en bronce ───────────── */
export const Enfasis: React.FC<{ texto: string; color?: string; acento?: string; serifEscala?: number }> = ({
  texto, color, acento = C.bronceClaro, serifEscala = 1.18,
}) => {
  const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <span style={{ color }}>
      {partes.map((p, i) =>
        p.startsWith("*") ? (
          <span key={i} style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, color: acento, fontSize: `${serifEscala}em`, letterSpacing: 0 }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
};

/** Líneas que aparecen de abajo arriba tras una máscara */
export const LineasReveladas: React.FC<{
  lineas: string[]; desde?: number; intervalo?: number; tam?: number; color?: string; acento?: string; peso?: number; alineacion?: "left" | "center";
}> = ({ lineas, desde = 0, intervalo = 7, tam = 84, color = C.blanco, acento, peso = 700, alineacion = "center" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: F.sans, fontWeight: peso, fontSize: tam, lineHeight: 1.12, letterSpacing: -1.5, color, textAlign: alineacion }}>
      {lineas.map((l, i) => {
        const p = entra(frame, desde + i * intervalo, 22);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 8 }}>
            <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>
              <Enfasis texto={l} acento={acento} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── Etiquetas de transparencia ───────────── */
/** "Imagen ilustrativa", "Ejemplo hipotético"… Obligatorio cuando algo pueda confundirse con real. */
export const Etiqueta: React.FC<{ texto: string; claro?: boolean }> = ({ texto, claro }) => {
  const frame = useCurrentFrame();
  const o = entra(frame, 4, 14);
  return (
    <div
      style={{
        position: "absolute", top: ZONA.arriba + 20, left: ZONA.lateral, opacity: o,
        fontFamily: F.sans, fontWeight: 700, fontSize: 26, letterSpacing: 2.5, textTransform: "uppercase",
        color: claro ? C.verde : C.beige, border: `2px solid ${claro ? "rgba(20,43,37,.45)" : "rgba(232,221,201,.5)"}`,
        padding: "10px 20px", borderRadius: 40, background: claro ? "rgba(247,245,239,.6)" : "rgba(20,43,37,.55)",
      }}
    >
      {texto}
    </div>
  );
};

/** Nota de fuente o matiz, encima de los subtítulos */
export const Fuente: React.FC<{ texto: string; desde?: number; claro?: boolean }> = ({ texto, desde = 10, claro }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute", left: ZONA.lateral, right: ZONA.lateral + 40, top: ZONA.visualFin - 20,
        fontFamily: F.sans, fontWeight: 500, fontSize: 25, lineHeight: 1.35,
        color: claro ? "rgba(20,43,37,.78)" : "rgba(232,221,201,.78)", opacity: entra(frame, desde, 16),
      }}
    >
      {texto}
    </div>
  );
};

/** Efecto de sonido colocado en un frame de la escena */
export const Sonido: React.FC<{ en: number; src: "tick" | "pop" | "whoosh" | "papel"; volumen?: number }> = ({ en, src, volumen = 0.5 }) =>
  en >= 0 ? (
    <Sequence from={Math.max(0, Math.round(en))} layout="none">
      <Audio src={staticFile(`sfx/${src}.wav`)} volume={volumen} />
    </Sequence>
  ) : null;

/** Imagen de /public (para recursos con licencia registrada en recursos/licencias.md) */
export const Imagen: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
);
