// Genera ENTREGA.md con el formato de entrega de 9 puntos (Prompt maestro §12)
// a partir de guion.yaml + editorial.yaml + timing.json + subtitulos.srt.
// Uso: node scripts/entrega.mjs ../contenido/videos/<ID>
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const carpeta = path.resolve(process.argv[2]);
const leer = (f) => fs.readFileSync(path.join(carpeta, f), "utf8");
const g = YAML.parse(leer("guion.yaml"));
const e = YAML.parse(leer("editorial.yaml"));
const t = JSON.parse(leer("timing.json"));
const srt = fs.existsSync(path.join(carpeta, "subtitulos.srt")) ? leer("subtitulos.srt") : "";

const FPS = 30, ADELANTO = 5, COLA = 2.4;
const total = t.duracionVoz + COLA;
const inicios = t.bloques.map((b, i) => (i === 0 ? 0 : Math.max(0, b.start - ADELANTO / FPS)));
const seg = (s) => `${s.toFixed(1).replace(".", ",")} s`;
const textosPantalla = (o, out = []) => {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => textosPantalla(x, out));
  else if (o && typeof o === "object")
    for (const [k, v] of Object.entries(o)) {
      if (["tipo", "variante", "en", "revelarEn", "encenderEn", "cambiarEn", "tacharEn", "marca", "ilustracion", "modelo", "camara", "accion", "inclinarHacia", "destacada", "valor", "desde", "hasta"].includes(k)) continue;
      textosPantalla(v, out);
    }
  return out;
};
const crit = ["atencion", "identificacion", "claridad", "curiosidad", "intensidad", "credibilidad", "relacion"];
const puntos = (x) => crit.reduce((a, c) => a + (x[c] ?? 0), 0);

let md = `# ${g.id} · ${g.titulo}\n\n`;
md += `Estilo ${g.estilo} · pilar \`${g.pilar}\` · emoción \`${g.emocion}\` · formato \`${g.formato}\` · duración ${seg(total)} · 1080×1920 · 30 fps\n\n`;
md += `> Documento generado por \`motor/scripts/entrega.mjs\`. Fuente de verdad: \`guion.yaml\` y \`editorial.yaml\`.\n\n`;

md += `## 1. Concepto\n\n| | |\n|---|---|\n`;
for (const [k, v] of Object.entries(e.concepto)) md += `| **${k[0].toUpperCase() + k.slice(1)}** | ${v} |\n`;

md += `\n## 2. Ganchos\n\nSe evaluaron ${e.ganchos.length} candidatos (7 criterios, máx. 35). Cinco mejores:\n\n| # | Gancho | Familia | Puntos |\n|---|---|---|---|\n`;
const orden = e.ganchos.map((x, i) => ({ ...x, i, p: puntos(x) })).sort((a, b) => b.p - a.p);
orden.slice(0, 5).forEach((x, n) => (md += `| ${n + 1} | ${x.i === e.elegido ? "**" : ""}«${x.texto}»${x.i === e.elegido ? "** ✔" : ""} | ${x.familia} | ${x.p}/35 |\n`));
md += `\n**Elegido:** «${e.ganchos[e.elegido].texto}». ${e.motivo}\n`;

md += `\n## 3. Guion definitivo (tiempos reales de la locución)\n\n| Tiempo | Voz en off | Texto en pantalla | Énfasis |\n|---|---|---|---|\n`;
g.bloques.forEach((b, i) => {
  const fin = i + 1 < inicios.length ? inicios[i + 1] : total;
  const pantalla = textosPantalla(b.escena.props).filter((x) => x.length < 140).map((x) => x.replace(/\*/g, "")).join(" · ");
  md += `| ${seg(inicios[i])} – ${seg(fin)} | ${b.voz} | ${pantalla || "—"} | ${(b.destacar ?? []).join(", ")} |\n`;
});
md += `\nRitmo: pausas entre frases acortadas a 0,38 s, locución acelerada un 5 % y normalizada a −16 LUFS. Cola final de ${COLA} s para la firma de marca.\n`;

md += `\n## 4. Storyboard\n\n`;
g.bloques.forEach((b, i) => {
  const fin = i + 1 < inicios.length ? inicios[i + 1] : total;
  const s = e.storyboard?.[b.id] ?? {};
  md += `**${i + 1}. ${b.id}** · ${seg(fin - inicios[i])} · \`${b.escena.tipo}${b.escena.props?.variante ? `/${b.escena.props.variante}` : ""}\`\n`;
  md += `- Imagen: ${s.imagen ?? "—"}\n- Cámara: ${s.camara ?? "—"}\n- Transición: ${i === 0 ? "entrada directa" : "fundido de 12 fotogramas con desenfoque 10 → 0 px"}\n- Sonido: ${s.sonido ?? "voz + música atenuada"}\n- Objetivo narrativo: ${s.objetivo ?? "—"}\n\n`;
});

md += `## 5. Prompts de generación\n\n${e.prompts?.nota ?? ""}\n\n`;
(e.prompts?.lista ?? []).forEach((p) => (md += `- **${p.escena}** (${p.tipo}): ${p.prompt}\n`));

md += `\n## 6. Producción técnica\n\n`;
md += `- Guion y escenas: \`contenido/videos/${g.id}/guion.yaml\`\n- Voz: ElevenLabs, voz \`${g.voz?.voice_id}\`, modelo \`${g.voz?.modelo}\` → \`audio/voz-original.mp3\` → \`herramientas/voz.py\`\n`;
md += `- Alineación palabra a palabra: faster-whisper (coincidencia guion/voz ${Math.round(t.coincidencia * 100)} %) → \`timing.json\`\n`;
md += `- Música original: \`herramientas/musica.py\` (tono \`${g.musica?.tono}\`, ${g.musica?.bpm} bpm)\n`;
md += `- Composición Remotion: \`${g.id}\` (\`motor/src/Video.tsx\`, escenas en \`motor/src/escenas/\`)\n`;
md += `- Comando: \`cd motor && npm run producir -- ../contenido/videos/${g.id} --render\` → \`salida/${g.id}.mp4\`\n`;
if (e.qc) md += `- Control de calidad técnico: ${e.qc}\n`;

md += `\n## 7. Subtítulos\n\nIntegrados en el vídeo (DynamicSubtitle) y exportados en \`subtitulos.srt\` para subir a las plataformas. Primeras líneas:\n\n\`\`\`\n${srt.split("\n\n").slice(0, 4).join("\n\n").trim()}\n\`\`\`\n`;

const p = e.publicacion;
md += `\n## 8. Publicación\n\n- **Portada:** ${p.portada}\n- **Descripción:**\n\n> ${p.descripcion.trim().replace(/\n/g, "\n> ")}\n\n- **CTA:** ${p.cta}\n- **Hashtags:** ${p.hashtags.join(" ")}\n`;
md += `\n| Plataforma | Adaptación |\n|---|---|\n| TikTok | ${p.tiktok} |\n| Instagram Reels | ${p.instagram} |\n| YouTube Shorts | ${p.youtube} |\n`;

const a = e.auditoria;
const totalA = Object.values(a.puntuaciones).reduce((x, y) => x + y, 0);
md += `\n## 9. Auditoría · ${totalA}/100 ${totalA >= 85 ? "✔ apto" : "✗ rehacer"}\n\n| Criterio | Nota |\n|---|---|\n`;
for (const [k, v] of Object.entries(a.puntuaciones)) md += `| ${k} | ${v}/10 |\n`;
md += `\n**Problemas detectados:**\n${a.problemas.map((x) => `- ${x}`).join("\n")}\n\n**Mejoras aplicadas / propuestas:**\n${a.mejoras.map((x) => `- ${x}`).join("\n")}\n`;
if (e.fuentes?.length) md += `\n## Fuentes\n\n${e.fuentes.map((f) => `- ${f}`).join("\n")}\n`;

fs.writeFileSync(path.join(carpeta, "ENTREGA.md"), md);
console.log(`ENTREGA.md generado (${totalA}/100)`);
