// Flujo completo de producción de un vídeo.
// Uso (desde motor/):  npm run producir -- ../contenido/videos/P01-xxx [--render] [--borrador]
//
//   1. Valida el guion (reglas editoriales y de honestidad)
//   2. Comprueba que existe la voz (audio/voz-original.mp3) y la post-procesa
//   3. Alinea voz ↔ guion (faster-whisper) → timing.json + subtitulos.srt
//   4. Genera la música original a la duración exacta
//   5. Ensambla datos y audio para Remotion (src/generado, public/videos)
//   6. --render: renderiza a salida/<id>.mp4 y pasa el control de calidad técnico
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validar } from "./validar.mjs";

const MOTOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAIZ = path.resolve(MOTOR, "..");
const PY = path.join(RAIZ, ".venv/bin/python");
const args = process.argv.slice(2);
const carpeta = path.resolve(args.find((a) => !a.startsWith("--")) ?? "");
const RENDER = args.includes("--render");
const BORRADOR = args.includes("--borrador");

const paso = (n, t) => console.log(`\n[${n}] ${t}`);
const mtime = (f) => (fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0);
const run = (cmd, a, opts = {}) => execFileSync(cmd, a, { stdio: "inherit", cwd: RAIZ, ...opts });

if (!fs.existsSync(path.join(carpeta, "guion.yaml"))) {
  console.error(`No encuentro guion.yaml en ${carpeta}`);
  process.exit(1);
}

// 1 · Validación
paso(1, "Validando guion");
const regPath = path.join(RAIZ, "contenido/registro.json");
const registro = fs.existsSync(regPath) ? JSON.parse(fs.readFileSync(regPath, "utf8")) : { videos: [] };
const { guion, errores, avisos } = validar(carpeta, { registro });
avisos.forEach((a) => console.log(`  aviso  ${a}`));
errores.forEach((e) => console.log(`  ERROR  ${e}`));
if (errores.length) process.exit(1);
fs.writeFileSync(path.join(carpeta, "guion.json"), JSON.stringify(guion, null, 1));

// 2 · Voz
paso(2, "Voz en off");
const vozOriginal = path.join(carpeta, "audio/voz-original.mp3");
const voz = path.join(carpeta, "audio/voz.mp3");
if (!fs.existsSync(vozOriginal)) {
  const texto = guion.bloques.map((b) => b.voz).join("\n\n");
  fs.mkdirSync(path.dirname(vozOriginal), { recursive: true });
  fs.writeFileSync(path.join(carpeta, "audio/texto-locucion.txt"), texto);
  console.log(`  Falta audio/voz-original.mp3. Texto de locución guardado en audio/texto-locucion.txt.`);
  console.log(`  Genera la voz (ElevenLabs, voz ${guion.voz?.voice_id}) y vuelve a ejecutar. Ver docs/flujo-de-trabajo.md`);
  process.exit(2);
}
// comprobar que el texto locutado coincide con el guion
const textoActual = guion.bloques.map((b) => b.voz).join("\n\n");
const txtPath = path.join(carpeta, "audio/texto-locucion.txt");
if (fs.existsSync(txtPath) && fs.readFileSync(txtPath, "utf8").trim() !== textoActual.trim())
  console.log("  aviso  El guion ha cambiado desde que se generó la voz: regenera la locución si cambió el texto hablado.");
else if (!fs.existsSync(txtPath)) fs.writeFileSync(txtPath, textoActual);
if (mtime(voz) < mtime(vozOriginal)) run(PY, ["herramientas/voz.py", carpeta]);
else console.log("  voz.mp3 al día");

// 3 · Alineación
paso(3, "Alineando voz y guion (subtítulos y tiempos de escena)");
const timing = path.join(carpeta, "timing.json");
if (mtime(timing) < Math.max(mtime(voz), mtime(path.join(carpeta, "guion.yaml")))) run(PY, ["herramientas/alinear.py", carpeta]);
else console.log("  timing.json al día");
const tdata = JSON.parse(fs.readFileSync(timing, "utf8"));
if (tdata.coincidencia < 0.9) console.log(`  aviso  Coincidencia voz/guion baja (${Math.round(tdata.coincidencia * 100)} %). Revisa que la voz dice exactamente el guion.`);

// 4 · Música
paso(4, "Música original");
const musica = path.join(carpeta, "audio/musica.wav");
const segundos = tdata.duracionVoz + 2.8; // cola de 2,4 s (firma) + margen
if (mtime(musica) < mtime(timing))
  run(PY, ["herramientas/musica.py", "pista", musica, "--segundos", String(segundos), "--tono", guion.musica?.tono ?? "calido", "--bpm", String(guion.musica?.bpm ?? 76), "--semilla", String([...guion.id].reduce((a, c) => a + c.charCodeAt(0), 0))]);
else console.log("  musica.wav al día");

// 5 · Ensamblado
paso(5, "Ensamblando para Remotion");
const pub = path.join(MOTOR, "public/videos", guion.id);
fs.mkdirSync(pub, { recursive: true });
fs.copyFileSync(voz, path.join(pub, "voz.mp3"));
fs.copyFileSync(musica, path.join(pub, "musica.wav"));
if (!fs.existsSync(path.join(MOTOR, "public/texturas/grano.png"))) run(PY, ["herramientas/texturas.py", path.join(MOTOR, "public/texturas")]);
if (!fs.existsSync(path.join(MOTOR, "public/sfx/tick.wav"))) run(PY, ["herramientas/musica.py", "sfx", path.join(MOTOR, "public/sfx")]);
const gen = path.join(MOTOR, "src/generado");
fs.mkdirSync(gen, { recursive: true });
const data = {
  id: guion.id, titulo: guion.titulo, estilo: guion.estilo, bloques: guion.bloques, timing: tdata,
  assets: { voz: `videos/${guion.id}/voz.mp3`, musica: `videos/${guion.id}/musica.wav` },
};
fs.writeFileSync(path.join(gen, `${guion.id}.json`), JSON.stringify(data));
const todos = fs.readdirSync(gen).filter((f) => f.endsWith(".json")).sort();
fs.writeFileSync(
  path.join(gen, "index.ts"),
  `// Archivo generado por scripts/producir.mjs — no editar a mano\nimport type { VideoData } from "../tipos";\n` +
    todos.map((f, i) => `import v${i} from "./${f}";`).join("\n") +
    `\n\nexport const VIDEOS = [${todos.map((_, i) => `v${i}`).join(", ")}] as unknown as VideoData[];\n`,
);
console.log(`  composición "${guion.id}" lista (${tdata.duracionVoz.toFixed(1)} s de voz)`);

// Registro de producción (control de repetición)
const entrada = { id: guion.id, titulo: guion.titulo, gancho: guion.bloques[0].voz, pilar: guion.pilar, emocion: guion.emocion, formato: guion.formato, estilo: guion.estilo, cta: guion.bloques.at(-1).escena?.props?.accion, fecha: (registro.videos ?? []).find((r) => r.id === guion.id)?.fecha ?? new Date().toISOString().slice(0, 10) };
const i = (registro.videos ?? []).findIndex((r) => r.id === guion.id);
if (i >= 0) registro.videos[i] = entrada;
else registro.videos = [...(registro.videos ?? []), entrada];
fs.writeFileSync(regPath, JSON.stringify(registro, null, 2) + "\n");

// 6 · Render + QC
if (RENDER) {
  paso(6, "Renderizando");
  const salida = path.join(RAIZ, "salida", `${guion.id}${BORRADOR ? "-borrador" : ""}.mp4`);
  const maestro = salida.replace(/\.mp4$/, "-maestro.mp4");
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  run("npx", ["remotion", "render", "src/index.ts", guion.id, maestro, ...(BORRADOR ? ["--scale=0.5"] : [])], { cwd: MOTOR });
  paso(7, "Codificación para redes (H.264 High, ≤ 12 Mbps, faststart)");
  // El grano y el 3D por software disparan el bitrate del máster: se limita para publicar sin pérdida visible.
  run("ffmpeg", ["-v", "error", "-y", "-i", maestro, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "12M", "-bufsize", "24M",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", salida]);
  paso(8, "Control de calidad técnico");
  run("bash", ["herramientas/qc.sh", salida, ...(BORRADOR ? ["--borrador"] : [])]);
}
