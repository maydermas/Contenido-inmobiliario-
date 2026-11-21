import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F, ZONA } from "../marca/tokens";
import { entra, euros, recorrido } from "../lib/anim";
import { Camara, Enfasis, Etiqueta, Fondo, Fuente, LineasReveladas, Sonido } from "../componentes/base";
import { Balanza, Calculadora } from "../ilustraciones/objetos";
import type { EscenaProps } from "../tipos";

const panel = (claro = false): React.CSSProperties => ({
  background: claro ? C.blanco : "rgba(29,58,50,.92)",
  border: `2px solid ${claro ? "rgba(20,43,37,.12)" : "rgba(210,174,124,.28)"}`,
  borderRadius: 28,
  boxShadow: "0 30px 60px rgba(0,0,0,.35)",
});

/* ───────── 4. KineticTypography ───────── */
type Linea = { texto: string; en: string };
export const KineticTypography: React.FC<
  EscenaProps<{ variante: "titular" | "recibo" | "contraste" | "pregunta"; lineas: (string | Linea)[]; titulo?: string; respuesta?: string; en?: string; cambiarEn?: string; simbolo?: string }>
> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();
  const v = props.variante;

  if (v === "titular") {
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <Camara dur={dur} desde={{ s: 1 }} hasta={{ s: 1.06 }}>
          <div style={{ position: "absolute", top: 380, left: ZONA.lateral, right: ZONA.lateral }}>
            <LineasReveladas lineas={props.lineas as string[]} intervalo={6} tam={104} />
          </div>
        </Camara>
        <LineaBronce frame={frame} y={330} />
      </AbsoluteFill>
    );
  }

  if (v === "recibo") {
    const lineas = props.lineas as Linea[];
    const ultima = Math.max(...lineas.map((l, i) => marca(l.en, 20 + i * 18)));
    const alto = interpolate(frame, [0, ultima + 10], [160, 260 + lineas.length * 112], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <Camara dur={dur} desde={{ y: 0, s: 1.02 }} hasta={{ y: -40, s: 1.0 }}>
          <div style={{ position: "absolute", left: 150, right: 150, top: 230 }}>
            <div style={{ height: 34, borderRadius: 17, background: "#0c1a16", boxShadow: "inset 0 4px 8px rgba(0,0,0,.6)" }} />
            <div
              style={{
                margin: "-16px 26px 0", height: alto, overflow: "hidden", background: C.blanco, padding: "46px 46px 0", boxSizing: "border-box",
                boxShadow: "0 30px 60px rgba(0,0,0,.4)",
                WebkitMaskImage: "linear-gradient(180deg, #000 92%, transparent 100%)",
              }}
            >
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 4, textTransform: "uppercase", color: C.verde, textAlign: "center" }}>{props.titulo}</div>
              <div style={{ borderTop: `3px dashed rgba(38,43,41,.3)`, margin: "28px 0 34px" }} />
              {lineas.map((l, i) => {
                const p = entra(frame, marca(l.en, 20 + i * 18) - 3, 12);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, height: 112, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
                    <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 46, color: C.gris, whiteSpace: "nowrap" }}>{l.texto}</span>
                    <span style={{ flex: 1, borderBottom: "4px dotted rgba(38,43,41,.35)", transform: "translateY(-10px)" }} />
                    <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.bronceOscuro }}>{props.simbolo ?? "€"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Camara>
        {lineas.map((l, i) => <Sonido key={i} en={marca(l.en, -1) - 3} src="tick" volumen={0.35} />)}
      </AbsoluteFill>
    );
  }

  if (v === "contraste") {
    const [a, b] = props.lineas as string[];
    const cambio = marca(props.cambiarEn ?? "", Math.round(dur * 0.55));
    const p = entra(frame, cambio - 4, 20);
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: 380, left: ZONA.lateral, right: ZONA.lateral, textAlign: "center" }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 100, color: C.blanco, opacity: entra(frame, 2, 18) * (1 - 0.65 * p), position: "relative", display: "inline-block" }}>
            <Enfasis texto={a} />
            <div style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 8, background: C.bronceClaro, transform: `scaleX(${p})`, transformOrigin: "0 50%" }} />
          </div>
          <div style={{ marginTop: 120, fontFamily: F.sans, fontWeight: 800, fontSize: 112, color: C.blanco, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})` }}>
            <Enfasis texto={b} />
          </div>
        </div>
        <Sonido en={cambio - 4} src="whoosh" volumen={0.3} />
      </AbsoluteFill>
    );
  }

  // pregunta
  const r = marca(props.en ?? "", Math.round(dur * 0.7));
  const pr = entra(frame, r - 6, 20);
  return (
    <AbsoluteFill>
      <Fondo variante="verde" />
      <div style={{ position: "absolute", top: 300, left: ZONA.lateral, right: ZONA.lateral }}>
        <LineasReveladas lineas={props.lineas as string[]} tam={82} intervalo={8} />
      </div>
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            ...panel(true), padding: "34px 64px", fontFamily: F.sans, fontWeight: 800, fontSize: 72, color: C.verde,
            opacity: pr, transform: `scale(${0.85 + 0.15 * pr})`,
          }}
        >
          {props.respuesta}
        </div>
      </div>
      <Sonido en={r - 6} src="pop" volumen={0.4} />
    </AbsoluteFill>
  );
};

const LineaBronce: React.FC<{ frame: number; y: number }> = ({ frame, y }) => (
  <div style={{ position: "absolute", top: y, left: ZONA.lateral, width: 140, height: 6, background: C.bronce, transform: `scaleX(${entra(frame, 0, 24)})`, transformOrigin: "0 50%" }} />
);

/* ───────── 7. FinancialChart ───────── */
type Pieza = { texto: string; en: string; destacada?: boolean };
type Fila = { texto: string; valor: number; en: string; destacada?: boolean };
export const FinancialChart: React.FC<
  EscenaProps<{
    variante: "pila" | "anillo" | "barras";
    titulo?: string; base?: string; piezas?: Pieza[]; fuente?: string; etiqueta?: string;
    desde?: number; hasta?: number; en?: string; filas?: Fila[];
  }>
> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();

  if (props.variante === "pila") {
    const piezas = props.piezas ?? [];
    const H = 112;
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: ZONA.arriba + 60, left: ZONA.lateral, right: ZONA.lateral, fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 72, color: C.bronceClaro, opacity: entra(frame, 0, 18) }}>
          {props.titulo}
        </div>
        <Camara dur={dur} desde={{ s: 1, y: 0 }} hasta={{ s: 0.96, y: 20 }} origen="50% 80%">
          <div style={{ position: "absolute", left: 120, right: 120, bottom: 1920 - 1060, display: "flex", flexDirection: "column-reverse", perspective: 1600 }}>
            <div style={{ height: 170, borderRadius: 20, background: C.beige, color: C.verde, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 52, boxShadow: "0 24px 50px rgba(0,0,0,.4)" }}>
              {props.base}
            </div>
            {piezas.map((p, i) => {
              const m = marca(p.en, 30 + i * 15);
              const k = entra(frame, m - 6, 16);
              return (
                <div
                  key={i}
                  style={{
                    height: H - 14, marginBottom: 14, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: p.destacada ? C.bronce : C.verdeClaro, color: p.destacada ? C.verde : C.beige,
                    border: p.destacada ? "none" : "2px solid rgba(210,174,124,.35)",
                    fontFamily: F.sans, fontWeight: 800, fontSize: 46,
                    opacity: k, transform: `translateY(${(1 - k) * -220}px) rotateX(${(1 - k) * 25}deg)`,
                    boxShadow: "0 18px 30px rgba(0,0,0,.35)",
                  }}
                >
                  {p.texto}
                </div>
              );
            })}
          </div>
        </Camara>
        {piezas.map((p, i) => <Sonido key={i} en={marca(p.en, -1) - 6} src="tick" volumen={0.4} />)}
        {props.fuente && <Fuente texto={props.fuente} desde={marca(piezas[0]?.en ?? "", 20)} />}
      </AbsoluteFill>
    );
  }

  if (props.variante === "anillo") {
    const m = marca(props.en ?? "", 20);
    const p1 = entra(frame, m - 4, 26);
    const p2 = entra(frame, m + 18, 22);
    const R = 300;
    const L = 2 * Math.PI * R;
    const a = (props.desde ?? 30) / 100;
    const b = (props.hasta ?? 35) / 100;
    const n1 = Math.max(1, Math.round((props.desde ?? 30) * p1));
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: ZONA.arriba + 70, left: ZONA.lateral, right: ZONA.lateral, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: C.beige, opacity: entra(frame, 0, 16) }}>
          {props.titulo}
        </div>
        <Camara dur={dur} desde={{ s: 0.96 }} hasta={{ s: 1.03 }}>
          <svg width={1080} height={1000} viewBox="0 0 1080 1000" style={{ position: "absolute", top: 260 }}>
            <g transform="rotate(-90 540 440)">
              <circle cx={540} cy={440} r={R} fill="none" stroke="rgba(232,221,201,.12)" strokeWidth={70} />
              <circle cx={540} cy={440} r={R} fill="none" stroke={C.bronceClaro} strokeOpacity={0.45} strokeWidth={70} strokeDasharray={`${L * b * p2} ${L}`} />
              <circle cx={540} cy={440} r={R} fill="none" stroke={C.bronce} strokeWidth={70} strokeDasharray={`${L * a * p1} ${L}`} />
            </g>
            <text x={540} y={450} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={150} fill={C.blanco} opacity={p1}>
              {n1}
              {p2 > 0.05 ? `–${Math.round((props.hasta ?? 35) * p2)}` : ""} %
            </text>
            <text x={540} y={530} textAnchor="middle" fontFamily={F.serif} fontStyle="italic" fontWeight={600} fontSize={54} fill={C.bronceClaro} opacity={p1}>
              {props.etiqueta}
            </text>
          </svg>
        </Camara>
        <Sonido en={m - 4} src="pop" volumen={0.35} />
        {props.fuente && <Fuente texto={props.fuente} desde={m + 20} />}
      </AbsoluteFill>
    );
  }

  // barras (cascada con importes)
  const filas = props.filas ?? [];
  const max = Math.max(...filas.map((f) => Math.abs(f.valor)));
  return (
    <AbsoluteFill>
      <Fondo variante="verde" />
      {props.etiqueta && <Etiqueta texto={props.etiqueta} />}
      <div style={{ position: "absolute", top: 300, left: ZONA.lateral, right: ZONA.lateral }}>
        {filas.map((f, i) => {
          const m = marca(f.en, 15 + i * 25);
          const k = entra(frame, m - 6, 24);
          const ancho = (Math.abs(f.valor) / max) * 100 * k;
          // barras bien visibles sobre verde: beige para importes, bronce apagado para restas, bronce para el resultado
          const color = f.destacada ? C.bronce : f.valor < 0 ? "rgba(177,138,88,.45)" : "rgba(232,221,201,.78)";
          return (
            <div key={i} style={{ marginBottom: 46, opacity: Math.min(1, k * 1.4) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: f.destacada ? C.bronceClaro : C.beige, marginBottom: 14 }}>
                <span>{f.texto}</span>
                <span style={{ fontWeight: 800 }}>{euros(f.valor * k)}</span>
              </div>
              <div style={{ height: f.destacada ? 76 : 58, borderRadius: 14, background: "rgba(232,221,201,.08)" }}>
                <div style={{ width: `${ancho}%`, height: "100%", borderRadius: 14, background: color, boxShadow: f.destacada ? "0 0 40px rgba(177,138,88,.45)" : "none" }} />
              </div>
            </div>
          );
        })}
      </div>
      {filas.map((f, i) => <Sonido key={i} en={marca(f.en, -1) - 6} src={f.destacada ? "pop" : "tick"} volumen={0.4} />)}
    </AbsoluteFill>
  );
};

/* ───────── 6. AnimatedNumber ───────── */
type Op = { texto: string; valor: string; en: string };
export const AnimatedNumber: React.FC<
  EscenaProps<{
    variante: "hucha" | "calculadora"; titulo?: string; lineas?: Pieza[]; conclusion?: string;
    etiqueta?: string; operacion?: Op[]; resultado?: { texto: string; valor: number; en: string }; nota?: string;
  }>
> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();

  if (props.variante === "hucha") {
    const lineas = props.lineas ?? [];
    const consumos = lineas.map((l, i) => entra(frame, marca(l.en, 15 + i * 20) - 4, 24));
    const nivel = 1 - consumos.reduce((a, c) => a + c * 0.38, 0);
    const fin = entra(frame, Math.round(dur * 0.62), 20);
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: ZONA.arriba + 70, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 70, color: C.bronceClaro, opacity: entra(frame, 0, 16) }}>
          {props.titulo}
        </div>
        {/* depósito de ahorros */}
        <div style={{ position: "absolute", left: 140, top: 420, width: 300, height: 600, borderRadius: 40, border: `5px solid ${C.beige}`, overflow: "hidden", background: "rgba(232,221,201,.06)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${nivel * 100}%`, background: `linear-gradient(180deg, ${C.bronceClaro} 0%, ${C.bronce} 100%)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.verde }}>Ahorros</div>
        </div>
        <div style={{ position: "absolute", left: 500, right: ZONA.lateral, top: 480 }}>
          {lineas.map((l, i) => (
            <div key={i} style={{ ...panel(), padding: "30px 36px", marginBottom: 34, fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.beige, opacity: consumos[i], transform: `translateX(${(1 - consumos[i]) * 80}px)` }}>
              − {l.texto}
            </div>
          ))}
          <div style={{ marginTop: 40, fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 64, lineHeight: 1.1, color: C.blanco, opacity: fin }}>{props.conclusion}</div>
        </div>
        {lineas.map((l, i) => <Sonido key={i} en={marca(l.en, -1) - 4} src="tick" volumen={0.4} />)}
      </AbsoluteFill>
    );
  }

  // calculadora
  const ops = props.operacion ?? [];
  const res = props.resultado!;
  const mr = marca(res.en, Math.round(dur * 0.6));
  const kr = entra(frame, mr - 4, 30);
  return (
    <AbsoluteFill>
      <Fondo variante="noche" />
      {props.etiqueta && <Etiqueta texto={props.etiqueta} />}
      <Camara dur={dur} desde={{ s: 0.98, y: 20 }} hasta={{ s: 1.04, y: 0 }}>
        <div style={{ position: "absolute", left: 230, top: 330, transform: "scale(0.9)", transformOrigin: "50% 0" }}>
          <Calculadora
            pantalla={
              <>
                {ops.map((o, i) => {
                  const k = entra(frame, marca(o.en, 10 + i * 20) - 4, 12);
                  return (
                    <div key={i} style={{ fontSize: 34, fontWeight: 700, opacity: k * (1 - 0.5 * kr) }}>
                      {o.texto}: {o.valor}
                    </div>
                  );
                })}
                <div style={{ fontSize: 86, fontWeight: 800, opacity: kr, lineHeight: 1 }}>{kr > 0 ? euros(res.valor * kr) : ""}</div>
              </>
            }
          />
        </div>
      </Camara>
      <div style={{ position: "absolute", top: 1075, left: 0, right: 0, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: C.bronceClaro, opacity: entra(frame, mr + 24, 16) }}>
        {res.texto} · <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 48 }}>{props.nota}</span>
      </div>
      {ops.map((o, i) => <Sonido key={i} en={marca(o.en, -1) - 4} src="tick" volumen={0.4} />)}
      <Sonido en={mr - 4} src="pop" volumen={0.45} />
    </AbsoluteFill>
  );
};

/* ───────── 8. ComparisonScene ───────── */
export const ComparisonScene: React.FC<
  EscenaProps<{ variante: "balanza" | "tarjetas" | "giro"; izquierda: string; derecha: string; inclinarHacia?: "izquierda" | "derecha"; signo?: string; tacharEn?: string; cambiarEn?: string }>
> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();

  if (props.variante === "balanza") {
    const objetivo = props.inclinarHacia === "izquierda" ? -1 : 1;
    const inc = interpolate(frame, [0, dur * 0.35, dur * 0.7], [0, -0.3 * objetivo, objetivo], { extrapolateRight: "clamp" });
    const etiqueta = (t: string, fuerte: boolean) => (
      <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 44, lineHeight: 1.1, color: fuerte ? C.bronceClaro : C.beige }}>{t}</div>
    );
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: 180 }}>
          <Balanza inclinacion={inc} izquierda={etiqueta(props.izquierda, false)} derecha={etiqueta(props.derecha, true)} />
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variante === "tarjetas") {
    const x = marca(props.tacharEn ?? "", Math.round(dur * 0.7));
    const k = entra(frame, x, 14);
    const tarjeta = (t: string, i: number) => {
      const e = entra(frame, 4 + i * 10, 22);
      return (
        <div style={{ ...panel(), width: 380, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.bronceClaro, textTransform: "uppercase" }}>cada mes</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 92, color: C.blanco, marginTop: 18 }}>{t}</div>
        </div>
      );
    };
    return (
      <AbsoluteFill>
        <Fondo variante="verde" />
        <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          {tarjeta(props.izquierda, 0)}
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 120, color: k > 0.5 ? C.bronceClaro : C.beige, position: "relative", width: 80, textAlign: "center" }}>
            {props.signo ?? "="}
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 10, background: C.bronceClaro, transform: `rotate(-60deg) scaleX(${k})` }} />
          </div>
          {tarjeta(props.derecha, 1)}
        </div>
        <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: C.bronceClaro, opacity: entra(frame, x + 6, 16) }}>
          No es lo mismo
        </div>
        <Sonido en={x} src="tick" volumen={0.45} />
      </AbsoluteFill>
    );
  }

  // giro: una tarjeta que se da la vuelta poco después de la palabra clave
  const g = marca(props.cambiarEn ?? "", Math.round(dur * 0.45));
  const k = entra(frame, g + 8, 20);
  const ang = k * 180;
  const trasera = ang > 90;
  return (
    <AbsoluteFill>
      <Fondo variante={trasera ? "noche" : "verde"} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 380, height: 520, perspective: 2000 }}>
        <div
          style={{
            position: "absolute", inset: 0, transform: `rotateY(${trasera ? ang - 180 : ang}deg)`,
            background: trasera ? C.beige : C.verdeClaro, borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center",
            border: trasera ? "none" : "2px solid rgba(210,174,124,.4)", boxShadow: "0 40px 80px rgba(0,0,0,.45)",
            fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: 120, color: trasera ? C.verde : C.bronceClaro,
          }}
        >
          {trasera ? props.derecha : props.izquierda}
        </div>
      </div>
      <Sonido en={g + 8} src="whoosh" volumen={0.35} />
    </AbsoluteFill>
  );
};

/* ───────── 11. MapScene: mapa esquemático (ilustrativo) con puntos ───────── */
export const MapScene: React.FC<EscenaProps<{ titulo?: string; puntos: { nombre: string; x: number; y: number; en?: string }[] }>> = ({ dur, marca, props }) => {
  const frame = useCurrentFrame();
  const t = recorrido(frame, dur);
  return (
    <AbsoluteFill>
      <Fondo variante="verde" />
      <Camara dur={dur} desde={{ s: 1.0 }} hasta={{ s: 1.12 }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <path d="M-40 880 C 160 820, 260 900, 420 860 C 560 820, 640 940, 820 900 C 920 880, 1000 940, 1120 920 L 1120 1300 L -40 1300 Z" fill="#20413a" />
          <path d="M-40 880 C 160 820, 260 900, 420 860 C 560 820, 640 940, 820 900 C 920 880, 1000 940, 1120 920" fill="none" stroke={C.bronce} strokeWidth={4} strokeDasharray="2400" strokeDashoffset={2400 * (1 - Math.min(1, t * 2))} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={300 + i * 80} x2={1080} y2={300 + i * 80} stroke="rgba(232,221,201,.05)" />)}
        </svg>
        {props.puntos.map((p, i) => {
          const k = entra(frame, marca(p.en ?? "", 15 + i * 15), 16);
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%, -100%) scale(${k})`, opacity: k, textAlign: "center" }}>
              <div style={{ ...panel(true), padding: "10px 22px", fontFamily: F.sans, fontWeight: 800, fontSize: 32, color: C.verde }}>{p.nombre}</div>
              <div style={{ width: 4, height: 40, background: C.beige, margin: "0 auto" }} />
              <div style={{ width: 22, height: 22, borderRadius: 11, background: C.bronce, margin: "0 auto" }} />
            </div>
          );
        })}
      </Camara>
      {props.titulo && (
        <div style={{ position: "absolute", top: ZONA.arriba + 110, left: ZONA.lateral, right: ZONA.lateral }}>
          <LineasReveladas lineas={[props.titulo]} tam={72} />
        </div>
      )}
      <Etiqueta texto="Mapa ilustrativo" />
    </AbsoluteFill>
  );
};
