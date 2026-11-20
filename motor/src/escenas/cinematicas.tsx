import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F, VIDEO, ZONA } from "../marca/tokens";
import { entra, recorrido, salida } from "../lib/anim";
import { Camara, Enfasis, Etiqueta, Fondo, Fuente, LineasReveladas, Sonido } from "../componentes/base";
import { BrandSignature, Simbolo } from "../componentes/BrandSignature";
import { CasaAtardecer, CasaSola } from "../ilustraciones/casa";
import { Hoja, Llave, Mesa, Pluma, VentanaLuz } from "../ilustraciones/objetos";
import type { EscenaProps } from "../tipos";

/* ───────── Registro de ilustraciones de fondo reutilizables ───────── */
export const ILUSTRACIONES: Record<string, React.FC<{ t: number; frame: number }>> = {
  "casa-atardecer": ({ t }) => <CasaAtardecer t={t} luces={interpolate(t, [0.1, 0.7], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />,
  "ventana-luz": ({ frame }) => <VentanaLuz frame={frame} />,
  mesa: () => <Mesa />,
};

/* ───────── 1. CinematicIntro: plano general + titular ───────── */
export const CinematicIntro: React.FC<EscenaProps<{ ilustracion: string; titular: string[]; etiqueta?: string }>> = ({ dur, props }) => {
  const frame = useCurrentFrame();
  const Il = ILUSTRACIONES[props.ilustracion] ?? ILUSTRACIONES["casa-atardecer"];
  const t = recorrido(frame, dur + 30);
  return (
    <AbsoluteFill>
      <Camara dur={dur} desde={{ s: 1.0, y: 0 }} hasta={{ s: 1.12, y: 40 }}>
        <Il t={t} frame={frame} />
      </Camara>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,22,19,.85) 0%, rgba(10,22,19,.0) 34%)" }} />
      <div style={{ position: "absolute", top: ZONA.arriba + 110, left: ZONA.lateral, right: ZONA.lateral }}>
        <LineasReveladas lineas={props.titular} desde={4} intervalo={9} tam={78} />
      </div>
      {props.etiqueta && <Etiqueta texto={props.etiqueta} />}
    </AbsoluteFill>
  );
};

/* ───────── 2. CinematicScene: ilustración + movimiento + texto opcional ───────── */
export const CinematicScene: React.FC<EscenaProps<{ ilustracion: string; texto?: string; movimiento?: "dolly-in" | "dolly-out" | "paneo"; etiqueta?: string }>> = ({ dur, props }) => {
  const frame = useCurrentFrame();
  const Il = ILUSTRACIONES[props.ilustracion] ?? ILUSTRACIONES["casa-atardecer"];
  const mov = props.movimiento ?? "dolly-in";
  const planos = {
    "dolly-in": { desde: { s: 1 }, hasta: { s: 1.15 } },
    "dolly-out": { desde: { s: 1.18 }, hasta: { s: 1 } },
    paneo: { desde: { x: 60, s: 1.1 }, hasta: { x: -60, s: 1.1 } },
  }[mov];
  return (
    <AbsoluteFill>
      <Camara dur={dur} {...planos}>
        <Il t={recorrido(frame, dur)} frame={frame} />
      </Camara>
      {props.texto && (
        <div style={{ position: "absolute", top: ZONA.arriba + 110, left: ZONA.lateral, right: ZONA.lateral }}>
          <LineasReveladas lineas={[props.texto]} tam={70} />
        </div>
      )}
      {props.etiqueta && <Etiqueta texto={props.etiqueta} />}
    </AbsoluteFill>
  );
};

/* ───────── 3. ParallaxScene: la casa (precio) y lo que hay debajo (iceberg) ───────── */
export const ParallaxScene: React.FC<EscenaProps<{ revelarEn?: string }>> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();
  const revela = marca(props.revelarEn ?? "", Math.round(dur * 0.55));
  const bajar = entra(frame, revela - 6, 40);
  const etiqueta = entra(frame, 6, 22);
  const vaiven = Math.sin(frame / 14) * 3 * (1 - bajar);
  return (
    <AbsoluteFill>
      <Fondo variante="noche" />
      <AbsoluteFill style={{ transform: `translateY(${-bajar * 620}px)` }}>
        {/* casa recortada sobre el horizonte */}
        <AbsoluteFill style={{ transform: "translateY(-180px) scale(0.95)" }}>
          <CasaSola luces={0.9} />
        </AbsoluteFill>
        {/* etiqueta de precio colgando */}
        <div style={{ position: "absolute", left: 640, top: 360, transformOrigin: "50% 0", transform: `rotate(${-6 + vaiven}deg) scale(${0.6 + 0.4 * etiqueta})`, opacity: etiqueta }}>
          <div style={{ width: 4, height: 120, background: C.beige, margin: "0 auto" }} />
          <div
            style={{
              background: C.beige, color: C.verde, fontFamily: F.sans, fontWeight: 800, fontSize: 54, letterSpacing: 4,
              padding: "26px 44px", borderRadius: "18px 18px 18px 18px", boxShadow: "0 20px 40px rgba(0,0,0,.4)",
            }}
          >
            PRECIO
          </div>
        </div>
        {/* bajo tierra: lo que viene después */}
        <svg width={1080} height={1200} viewBox="0 0 1080 1200" style={{ position: "absolute", top: 955 }}>
          <defs>
            <linearGradient id="bajo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d3a32" />
              <stop offset="1" stopColor="#0a1613" />
            </linearGradient>
          </defs>
          <rect width={1080} height={1200} fill="url(#bajo)" />
          <path d="M140 0 L940 0 L1010 380 L860 760 L540 900 L220 760 L70 380 Z" fill="rgba(177,138,88,.14)" stroke={C.bronce} strokeWidth={3} strokeDasharray="14 12" opacity={bajar} />
        </svg>
        <div style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", opacity: entra(frame, revela + 10, 22) }}>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 92, color: C.bronceClaro }}>Lo que viene después</div>
          {["Impuestos y gastos de compra", "Mantenimiento", "Gastos de cada año"].map((x, i) => (
            <div key={x} style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: C.beige, marginTop: 26, opacity: entra(frame, revela + 20 + i * 8, 18) }}>
              {x}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sonido en={revela - 6} src="whoosh" volumen={0.35} />
      <Etiqueta texto="Imagen ilustrativa" />
    </AbsoluteFill>
  );
};

/* ───────── 4. DocumentReveal: documento sobre la mesa ───────── */
type ItemLista = { texto: string; en: string; destacada?: boolean };
export const DocumentReveal: React.FC<EscenaProps<{ documento: string; marca?: string; lista?: ItemLista[]; fuente?: string }>> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();
  const entrada = entra(frame, 0, 26);
  const firma = props.marca ? marca(props.marca, Math.round(dur * 0.7)) : -1;
  const pluma = firma >= 0 ? entra(frame, firma - 14, 18) : 0;
  return (
    <AbsoluteFill>
      <Camara dur={dur} desde={{ s: 1.08, r: -1 }} hasta={{ s: 1.0, r: 0 }}>
        <Mesa />
        <div style={{ position: "absolute", left: 160, top: 210, transform: `translateY(${(1 - entrada) * 400}px) rotate(${-3 + entrada * 1}deg)`, opacity: entrada }}>
          <Hoja titulo={props.documento} lineas={props.lista ? 0 : 7} alto={props.lista ? 820 : 980}>
            {props.lista ? (
              <div style={{ marginTop: 10 }}>
                {props.lista.map((it, i) => {
                  const m = marca(it.en, 20 + i * 20);
                  const p = entra(frame, m - 4, 14);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 42, opacity: 0.35 + 0.65 * p }}>
                      <div style={{ width: 54, height: 54, borderRadius: 12, border: `4px solid ${C.verde}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width={36} height={36} viewBox="0 0 36 36">
                          <path d="M6 19 L14 27 L30 9" stroke={it.destacada ? C.bronce : C.verde} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={40} strokeDashoffset={40 * (1 - p)} />
                        </svg>
                      </div>
                      <div style={{ fontFamily: F.sans, fontWeight: it.destacada ? 800 : 600, fontSize: 44, color: it.destacada ? C.bronceOscuro : C.gris }}>{it.texto}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <div style={{ height: 300 }} />
                <div style={{ position: "absolute", left: 70, right: 70, bottom: 120 }}>
                  <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.gris, opacity: 0.7, marginBottom: 70 }}>Firma del comprador</div>
                  <div style={{ height: 3, background: C.gris, opacity: 0.6 }} />
                  {firma >= 0 && (
                    <div
                      style={{
                        position: "absolute", top: -64, left: 0, fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 58, color: C.bronceOscuro,
                        opacity: entra(frame, firma, 14), transform: `rotate(-4deg)`,
                      }}
                    >
                      ¿Lo has calculado todo?
                    </div>
                  )}
                </div>
              </>
            )}
          </Hoja>
        </div>
        {!props.lista && (
          <div style={{ position: "absolute", left: 470 - pluma * 160, top: 1000 - pluma * 70, transform: `rotate(${-28 + pluma * 8}deg)` }}>
            <Pluma />
          </div>
        )}
        {!props.fuente && (
          <div style={{ position: "absolute", left: 760, top: 1080, transform: "rotate(24deg)", opacity: 0.95 }}>
            <Llave tam={260} />
          </div>
        )}
      </Camara>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(10,22,19,.85) 72%)" }} />
      <Sonido en={2} src="papel" volumen={0.45} />
      {props.lista?.map((it, i) => <Sonido key={i} en={marca(it.en, -1) - 4} src="tick" volumen={0.4} />)}
      {props.fuente && <Fuente texto={props.fuente} desde={20} />}
    </AbsoluteFill>
  );
};

/* ───────── 12. EmotionalEnding: frase final con luz ───────── */
export const EmotionalEnding: React.FC<EscenaProps<{ ilustracion: "ventana-luz" | "llaves"; frase: string[] }>> = ({ dur, props }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {props.ilustracion === "llaves" ? (
        <AbsoluteFill>
          <Fondo variante="noche" />
          <Camara dur={dur} desde={{ s: 1 }} hasta={{ s: 1.1 }}>
            <div style={{ position: "absolute", left: 340, top: 560, transform: `rotate(${-18 + Math.sin(frame / 25) * 2}deg)` }}>
              <Llave tam={420} />
            </div>
            <div style={{ position: "absolute", left: 280, top: 380, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(243,217,164,.22) 0%, rgba(243,217,164,0) 70%)" }} />
          </Camara>
        </AbsoluteFill>
      ) : (
        <Camara dur={dur} desde={{ s: 1.05 }} hasta={{ s: 1.15, y: -30 }}>
          <VentanaLuz frame={frame} />
        </Camara>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,22,19,.0) 30%, rgba(10,22,19,.75) 60%)" }} />
      <div style={{ position: "absolute", top: props.ilustracion === "llaves" ? 820 : 960, left: ZONA.lateral, right: ZONA.lateral, textAlign: "center" }}>
        {props.frase.map((l, i) => {
          const p = entra(frame, 8 + i * 14, 30);
          return (
            <div key={i} style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 82, lineHeight: 1.12, color: C.blanco, opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>
              <Enfasis texto={l} serifEscala={1.05} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 14. CTAEnding: acción + firma de marca ───────── */
const IconoAccion: React.FC<{ accion: string; p: number }> = ({ accion, p }) => {
  const d =
    accion === "guardar"
      ? "M30 10 H90 V110 L60 88 L30 110 Z"
      : accion === "compartir"
        ? "M20 60 L100 20 L80 100 L58 70 L20 60 Z M58 70 L100 20"
        : "M15 25 H105 V85 H50 L28 105 V85 H15 Z";
  return (
    <svg width={150} height={150} viewBox="0 0 120 120">
      <path d={d} fill="none" stroke={C.bronceClaro} strokeWidth={6} strokeLinejoin="round" strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
    </svg>
  );
};

export const CTAEnding: React.FC<EscenaProps<{ accion: "guardar" | "compartir" | "escribir"; texto: string; palabraClave?: string }>> = ({ dur, props }) => {
  const frame = useCurrentFrame();
  const firmaDesde = Math.max(30, dur - Math.round(VIDEO.cola * 30) + 4); // la firma entra al acabar la voz
  const fuera = 1 - entra(frame, firmaDesde - 10, 14);
  const p = entra(frame, 2, 26);
  return (
    <AbsoluteFill>
      <Fondo variante="verde" />
      <AbsoluteFill style={{ opacity: fuera, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 430 }}>
        <IconoAccion accion={props.accion} p={p} />
        {props.palabraClave && (
          <div
            style={{
              marginTop: 40, fontFamily: F.sans, fontWeight: 800, fontSize: 120, letterSpacing: 12, color: C.verde, background: C.beige,
              padding: "16px 54px", borderRadius: 24, transform: `scale(${0.8 + 0.2 * entra(frame, 6, 20)})`, opacity: entra(frame, 6, 16),
            }}
          >
            {props.palabraClave}
          </div>
        )}
        <div style={{ marginTop: 50, maxWidth: 860, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontWeight: 500, fontSize: 70, lineHeight: 1.15, color: C.blanco, opacity: entra(frame, 12, 22) }}>
          {props.texto}
        </div>
      </AbsoluteFill>
      {frame >= firmaDesde - 4 && <BrandSignature desde={firmaDesde} />}
      <Sonido en={firmaDesde} src="pop" volumen={0.25} />
    </AbsoluteFill>
  );
};

export { Simbolo, salida };
