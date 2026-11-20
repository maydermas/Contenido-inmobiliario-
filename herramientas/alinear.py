"""Alinea la voz en off con el guion y genera los tiempos de subtítulos y escenas.

Uso:
    .venv/bin/python herramientas/alinear.py contenido/videos/P01-casa-de-tus-suenos

Lee:
    <video>/guion.json          (generado desde guion.yaml por herramientas/guion.mjs)
    <video>/audio/voz.mp3       (voz final)
Escribe:
    <video>/timing.json         (inicio/fin de cada bloque y de cada palabra del guion)
    <video>/subtitulos.srt

Método: faster-whisper (MIT, CPU) transcribe con marcas de tiempo por palabra.
Después se emparejan las palabras reconocidas con las palabras del guion
(el texto del guion manda: así los números y la ortografía son los nuestros).
"""
from __future__ import annotations

import difflib
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

MODELO = "small"


def normalizar(palabra: str) -> str:
    p = unicodedata.normalize("NFD", palabra.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", p)


def srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def main(carpeta: Path) -> None:
    guion = json.loads((carpeta / "guion.json").read_text(encoding="utf-8"))
    audio = carpeta / "audio" / "voz.mp3"

    # Palabras del guion, con el bloque al que pertenecen
    script_words: list[dict] = []
    for bi, bloque in enumerate(guion["bloques"]):
        for w in bloque["voz"].split():
            script_words.append({"texto": w, "bloque": bi, "norm": normalizar(w)})

    # Decodificamos con ffmpeg (evita depender de PyAV) a 16 kHz mono float32
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(audio), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         check=True, capture_output=True).stdout
    muestras = np.frombuffer(raw, dtype=np.float32)

    model = WhisperModel(MODELO, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        muestras, language="es", word_timestamps=True, vad_filter=False,
        initial_prompt=" ".join(b["voz"] for b in guion["bloques"]),
    )
    rec: list[dict] = []
    for seg in segments:
        for w in seg.words or []:
            n = normalizar(w.word)
            if n:
                rec.append({"norm": n, "start": w.start, "end": w.end})

    # Emparejamiento por secuencia
    sm = difflib.SequenceMatcher(a=[w["norm"] for w in script_words], b=[r["norm"] for r in rec], autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                script_words[i1 + k]["start"] = rec[j1 + k]["start"]
                script_words[i1 + k]["end"] = rec[j1 + k]["end"]
        elif tag == "replace" and j2 > j1:
            # reparte el tramo reconocido entre las palabras del guion
            t0, t1 = rec[j1]["start"], rec[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                script_words[i1 + k]["start"] = t0 + (t1 - t0) * k / n
                script_words[i1 + k]["end"] = t0 + (t1 - t0) * (k + 1) / n

    # Interpolar huecos (palabras del guion que no se reconocieron)
    for i, w in enumerate(script_words):
        if "start" in w:
            continue
        prev_end = next((script_words[j]["end"] for j in range(i - 1, -1, -1) if "end" in script_words[j]), 0.0)
        nxt = next((j for j in range(i + 1, len(script_words)) if "start" in script_words[j]), None)
        next_start = script_words[nxt]["start"] if nxt is not None else prev_end + 0.4
        w["start"], w["end"] = prev_end, max(prev_end + 0.05, min(next_start, prev_end + 0.4))

    matched = sum(1 for _ in sm.get_matching_blocks())
    duracion = info.duration
    bloques = []
    for bi, bloque in enumerate(guion["bloques"]):
        ws = [w for w in script_words if w["bloque"] == bi]
        bloques.append({"id": bloque["id"], "start": ws[0]["start"], "end": ws[-1]["end"],
                        "palabras": [{"t": w["texto"], "s": round(w["start"], 3), "e": round(w["end"], 3)} for w in ws]})

    iguales = sum(i2 - i1 for tag, i1, i2, _, _ in sm.get_opcodes() if tag == "equal")
    out = {"duracionVoz": duracion, "coincidencia": round(iguales / len(script_words), 3), "bloques": bloques}
    (carpeta / "timing.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    # SRT por frases cortas (máx. 6 palabras o fin de frase)
    lines, buf = [], []
    for w in script_words:
        buf.append(w)
        if len(buf) >= 6 or re.search(r"[.?!:]$", w["texto"]):
            lines.append(buf)
            buf = []
    if buf:
        lines.append(buf)
    srt = []
    for i, l in enumerate(lines, 1):
        srt.append(f"{i}\n{srt_time(l[0]['start'])} --> {srt_time(l[-1]['end'])}\n{' '.join(w['texto'] for w in l)}\n")
    (carpeta / "subtitulos.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"{carpeta.name}: voz {duracion:.2f}s, coincidencia guion/voz {out['coincidencia']*100:.1f}% ({matched} tramos)")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
