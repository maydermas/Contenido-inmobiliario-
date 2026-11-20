// Hoja de contactos: un fotograma por escena (o en los frames indicados) para revisión visual.
// Uso: node scripts/fotogramas.mjs <id-composicion> [salida.jpg] [--en=0.6]  (posición dentro de cada escena, 0–1)
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const [id, salidaArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const en = Number((process.argv.find((a) => a.startsWith("--en=")) ?? "--en=0.6").slice(5));
const salida = path.resolve(salidaArg ?? `../salida/${id}-contactos.jpg`);
const data = JSON.parse(fs.readFileSync(`src/generado/${id}.json`, "utf8"));
const fps = 30, adelanto = 5, cola = 2.4;
const total = Math.ceil((data.timing.duracionVoz + cola) * fps);
const ini = data.timing.bloques.map((b, i) => (i === 0 ? 0 : Math.max(0, Math.round(b.start * fps) - adelanto)));
const frames = ini.map((s, i) => Math.round(s + ((i + 1 < ini.length ? ini[i + 1] : total) - s) * en));

const serve = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl: serve, id, chromiumOptions: { gl: "swangle" } });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "foto-"));
for (const [i, f] of frames.entries()) {
  await renderStill({ serveUrl: serve, composition: comp, frame: f, output: path.join(tmp, `${String(i).padStart(2, "0")}.png`), scale: 0.4, chromiumOptions: { gl: "swangle" } });
  process.stdout.write(`  escena ${i + 1}: frame ${f}\n`);
}
fs.mkdirSync(path.dirname(salida), { recursive: true });
const cols = Math.min(4, frames.length);
execFileSync("ffmpeg", ["-v", "error", "-y", "-pattern_type", "glob", "-i", path.join(tmp, "*.png"), "-vf", `tile=${cols}x${Math.ceil(frames.length / cols)}:padding=8:color=0x0b1613`, "-frames:v", "1", "-q:v", "3", salida]);
console.log(`hoja de contactos: ${salida}`);
