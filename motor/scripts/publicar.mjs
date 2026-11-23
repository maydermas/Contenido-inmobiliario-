// Preparación y registro de publicaciones en Instagram (@capital4thunel).
//
//   node scripts/publicar.mjs siguiente
//       Elige el siguiente vídeo listo y no publicado (el más antiguo del registro), genera su pie
//       (contenido/videos/<ID>/PIE.txt), sube el MP4 a la rama `medios` (URL pública para que Instagram
//       lo descargue) y muestra un JSON con { id, video_url, caption }.
//   node scripts/publicar.mjs registrar <ID> <ig_media_id> [permalink]
//       Anota la publicación en contenido/publicaciones.json.
//
// La publicación en sí la hace Claude con Composio (INSTAGRAM_POST_IG_USER_MEDIA + _PUBLISH).
// La rama `medios` solo contiene el vídeo pendiente: se reescribe en cada publicación (no tiene historial útil).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPO = "maydermas/Contenido-inmobiliario-";
const PUBS = path.join(RAIZ, "contenido/publicaciones.json");
const leerJSON = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : d);
const [accion, ...args] = process.argv.slice(2);

export function pie(carpeta) {
  const e = YAML.parse(fs.readFileSync(path.join(carpeta, "editorial.yaml"), "utf8"));
  const p = e.publicacion;
  const tags = [...new Set(p.hashtags)].slice(0, 12).join(" ");
  // evita repetir la llamada a la acción si la descripción ya la incluye
  const norm = (x) => x.toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, "");
  const desc = p.descripcion.trim().split("\n").filter((l) => !norm(p.cta).includes(norm(l)) || norm(l).length < 12).join("\n");
  let texto = `${p.portada}\n\n${desc}\n\n${p.cta}\n\n${tags}`;
  if (texto.length > 2200) texto = texto.slice(0, 2190) + "…";
  return texto;
}

if (accion === "siguiente") {
  const registro = leerJSON(path.join(RAIZ, "contenido/registro.json"), { videos: [] });
  const publicados = new Set(leerJSON(PUBS, { publicaciones: [] }).publicaciones.map((x) => x.id));
  const candidato = registro.videos.find((v) => {
    if (publicados.has(v.id)) return false;
    const c = path.join(RAIZ, "contenido/videos", v.id);
    const mp4 = path.join(RAIZ, "salida", `${v.id}.mp4`);
    if (!fs.existsSync(mp4) || !fs.existsSync(path.join(c, "editorial.yaml"))) return false;
    const a = YAML.parse(fs.readFileSync(path.join(c, "editorial.yaml"), "utf8")).auditoria;
    const nota = Object.values(a?.puntuaciones ?? {}).reduce((x, y) => x + y, 0);
    return nota >= 85 && !a?.no_publicar;
  });
  if (!candidato) {
    console.log(JSON.stringify({ id: null, motivo: "No hay vídeos listos sin publicar (MP4 en salida/ y auditoría ≥ 85)." }));
    process.exit(0);
  }
  const carpeta = path.join(RAIZ, "contenido/videos", candidato.id);
  const caption = pie(carpeta);
  fs.writeFileSync(path.join(carpeta, "PIE.txt"), caption + "\n");

  // Rama `medios`: commit huérfano con solo este MP4
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "medios-"));
  const remoto = execFileSync("git", ["-C", RAIZ, "remote", "get-url", "origin"], { encoding: "utf8" }).trim();
  const g = (...a) => execFileSync("git", ["-C", tmp, ...a], { stdio: "pipe" });
  g("init", "-q", "-b", "medios");
  fs.copyFileSync(path.join(RAIZ, "salida", `${candidato.id}.mp4`), path.join(tmp, `${candidato.id}.mp4`));
  fs.writeFileSync(path.join(tmp, "README.md"), "Rama temporal: vídeo pendiente de publicar en Instagram. Se reescribe en cada publicación.\n");
  g("add", "-A");
  g("-c", "user.name=Claude", "-c", "user.email=noreply@anthropic.com", "commit", "-q", "-m", `Medio para publicar: ${candidato.id}`);
  g("remote", "add", "origin", remoto);
  g("push", "-q", "--force", "origin", "medios");
  fs.rmSync(tmp, { recursive: true, force: true });

  const video_url = `https://raw.githubusercontent.com/${REPO}/medios/${candidato.id}.mp4`;
  console.log(JSON.stringify({ id: candidato.id, video_url, caption }, null, 1));
} else if (accion === "registrar") {
  const [id, media, permalink] = args;
  if (!id || !media) throw new Error("Uso: registrar <ID> <ig_media_id> [permalink]");
  const d = leerJSON(PUBS, { cuenta: "@capital4thunel", publicaciones: [] });
  d.publicaciones = d.publicaciones.filter((x) => x.id !== id);
  d.publicaciones.push({ id, plataforma: "instagram", ig_media_id: media, permalink: permalink ?? null, fecha: new Date().toISOString() });
  fs.writeFileSync(PUBS, JSON.stringify(d, null, 2) + "\n");
  console.log(`registrado ${id}`);
} else {
  console.log("Uso: node scripts/publicar.mjs siguiente | registrar <ID> <ig_media_id> [permalink]");
}
