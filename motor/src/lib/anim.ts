import { Easing, interpolate } from "remotion";

// Curvas del lenguaje de movimiento: suaves, sin rebotes (Directiva 2.0, §7)
export const salida = Easing.bezier(0.16, 1, 0.3, 1);
export const suave = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 con curva de salida a partir del frame `desde` */
export const entra = (frame: number, desde: number, dur = 18, curva = salida) =>
  interpolate(frame, [desde, desde + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curva });

/** progreso lineal 0→1 de toda la escena con curva suave (cámara) */
export const recorrido = (frame: number, dur: number) =>
  interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: suave });

export const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const euros = (n: number) =>
  `${n < 0 ? "−" : ""}${Math.round(Math.abs(n)).toLocaleString("es-ES", { useGrouping: "always" } as any)} €`;
