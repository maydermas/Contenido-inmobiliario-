// Validador editorial y técnico de un guion.yaml.
// Aplica los principios innegociables (CLAUDE.md §Principios) de forma automática.
// Uso: node scripts/validar.mjs ../contenido/videos/P01-xxx
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export const TIPOS = [
  "CinematicIntro", "CinematicScene", "ParallaxScene", "KineticTypography", "AnimatedNumber", "FinancialChart",
  "ComparisonScene", "DocumentReveal", "ArchitectureScene", "MapScene", "EmotionalEnding", "CTAEnding",
];

// Expresiones que una marca honesta no usa (Prompt maestro §13, Directiva 2.0 §14)
const PROHIBIDAS = [
  /garantiz/i, /te aprueban seguro/i, /aprobaci[oó]n asegurada/i, /rentabilidad asegurada/i, /sin riesgo/i,
  /hazte rico/i, /dinero f[aá]cil/i, /[uú]ltima oportunidad/i, /solo hoy/i, /no te lo pierdas/i, /testimonio real/i,
];

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const textos = (o, out = []) => {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => textos(x, out));
  else if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => k !== "fuente" && textos(v, out));
  return out;
};

export function validar(carpeta, { registro } = {}) {
  const errores = [];
  const avisos = [];
  const g = YAML.parse(fs.readFileSync(path.join(carpeta, "guion.yaml"), "utf8"));

  for (const k of ["id", "titulo", "estilo", "pilar", "emocion", "formato", "bloques"]) if (!g[k]) errores.push(`Falta el campo "${k}"`);
  if (g.id && g.id !== path.basename(carpeta)) errores.push(`El id (${g.id}) no coincide con la carpeta (${path.basename(carpeta)})`);
  const ids = new Set();

  (g.bloques ?? []).forEach((b, i) => {
    const donde = `bloque ${i + 1} (${b.id})`;
    if (ids.has(b.id)) errores.push(`${donde}: id repetido`);
    ids.add(b.id);
    if (!b.voz) errores.push(`${donde}: falta "voz"`);
    if (/\d/.test(b.voz ?? "")) avisos.push(`${donde}: la voz contiene cifras; escríbelas con letras para que la locución sea natural`);
    if (!b.escena?.tipo || !TIPOS.includes(b.escena.tipo)) errores.push(`${donde}: escena.tipo "${b.escena?.tipo}" no existe. Opciones: ${TIPOS.join(", ")}`);

    const palabras = new Set((b.voz ?? "").split(/\s+/).map(norm));
    for (const d of b.destacar ?? []) if (!palabras.has(norm(d))) avisos.push(`${donde}: "destacar: ${d}" no aparece en la voz`);
    // marcas de sincronización (en:, revelarEn:, encenderEn:, cambiarEn:, tacharEn:, marca:)
    const marcas = [];
    JSON.stringify(b.escena?.props ?? {}, (k, v) => {
      if (["en", "revelarEn", "encenderEn", "cambiarEn", "tacharEn", "marca"].includes(k) && typeof v === "string") marcas.push(v);
      return v;
    });
    for (const m of marcas) if (!palabras.has(norm(m))) errores.push(`${donde}: la marca de sincronía "${m}" no aparece en la voz`);

    // Honestidad: toda cifra en pantalla necesita fuente o etiqueta de ejemplo
    const enPantalla = textos(b.escena?.props ?? {}).join(" ");
    const sinTecnicismos = enPantalla.replace(/\b\d+(\.\d+)?D\b/g, ""); // "3D", "2.5D" no son cifras
    const tieneCifras = /\d/.test(sinTecnicismos) || JSON.stringify(b.escena?.props ?? {}).match(/"valor":\s*-?\d/);
    const props = b.escena?.props ?? {};
    const justificada = props.fuente || /hipot[eé]tico/i.test(props.etiqueta ?? "") || /hipot[eé]tico/i.test(props.titulo ?? "");
    if (tieneCifras && !justificada) errores.push(`${donde}: muestra cifras sin "fuente" ni etiqueta "Ejemplo hipotético"`);
    if (/ejemplo|imagina|pongamos/i.test(b.voz ?? "") && /\d|mil|cien|ciento/i.test(b.voz ?? "") && !justificada)
      errores.push(`${donde}: es un ejemplo con cifras; añade etiqueta "Ejemplo hipotético"`);

    for (const r of PROHIBIDAS) if (r.test(b.voz ?? "") || r.test(enPantalla)) errores.push(`${donde}: expresión no permitida por la marca (${r})`);
  });

  if (g.formato === "caso-hipotetico" && !JSON.stringify(g).match(/hipot[eé]tico/i)) errores.push(`Formato "caso-hipotetico" sin etiqueta visible de ejemplo hipotético`);
  const ultimo = g.bloques?.[g.bloques.length - 1];
  if (ultimo && ultimo.escena?.tipo !== "CTAEnding") avisos.push("El último bloque no es un CTAEnding");

  // Control de repetición (contenido/registro.json)
  if (registro) {
    const gancho = norm(g.bloques?.[0]?.voz ?? "");
    for (const r of registro.videos ?? []) {
      if (r.id === g.id) continue;
      if (norm(r.gancho) === gancho) errores.push(`Gancho idéntico al de ${r.id}`);
      const a = new Set((g.bloques?.[0]?.voz ?? "").toLowerCase().split(/\W+/).filter((w) => w.length > 3));
      const bset = new Set(r.gancho.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
      const inter = [...a].filter((w) => bset.has(w)).length;
      const jac = inter / (new Set([...a, ...bset]).size || 1);
      if (jac > 0.5) avisos.push(`Gancho muy parecido al de ${r.id} (${Math.round(jac * 100)} % de palabras en común)`);
    }
    const ultimos = (registro.videos ?? []).filter((r) => r.id !== g.id).slice(-3);
    if (ultimos.length === 3 && ultimos.every((r) => r.pilar === g.pilar)) avisos.push(`Los tres últimos vídeos ya son del pilar "${g.pilar}"`);
    if (ultimos.length >= 2 && ultimos.slice(-2).every((r) => r.emocion === g.emocion)) avisos.push(`Los dos últimos vídeos ya usan la emoción "${g.emocion}"`);
  }
  return { guion: g, errores, avisos };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const carpeta = path.resolve(process.argv[2]);
  const regPath = path.resolve(carpeta, "../../registro.json");
  const registro = fs.existsSync(regPath) ? JSON.parse(fs.readFileSync(regPath, "utf8")) : undefined;
  const { errores, avisos } = validar(carpeta, { registro });
  avisos.forEach((a) => console.log(`  aviso  ${a}`));
  errores.forEach((e) => console.log(`  ERROR  ${e}`));
  console.log(errores.length ? `✗ ${errores.length} errores` : "✓ guion válido");
  process.exit(errores.length ? 1 : 0);
}
