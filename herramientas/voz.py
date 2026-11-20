"""Post-proceso de la voz en off: pausas más cortas, ritmo y volumen de redes.

Uso:
    .venv/bin/python herramientas/voz.py contenido/videos/P01-xxx [--pausa 0.38] [--tempo 1.05]

Entrada:  <video>/audio/voz-original.mp3   (tal como sale de ElevenLabs)
Salida:   <video>/audio/voz.mp3            (la que usa el motor)

1. Detecta silencios (RMS < -40 dBFS en ventanas de 10 ms).
2. Acorta cada silencio más largo que --pausa a exactamente --pausa segundos,
   con fundidos de 8 ms para que no se oigan cortes.
3. Aplica atempo (sin cambiar el tono) y normaliza a -16 LUFS / -1.5 dBTP.
"""
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

import numpy as np

SR = 44100


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def shorten_pauses(x: np.ndarray, max_pause: float, thr_db: float = -40.0) -> tuple[np.ndarray, int]:
    win = int(SR * 0.01)
    n = len(x) // win
    rms = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    silent = 20 * np.log10(rms) < thr_db
    keep = np.ones(len(x), dtype=bool)
    fade = int(SR * 0.008)
    i, cuts = 0, 0
    while i < n:
        if silent[i]:
            j = i
            while j < n and silent[j]:
                j += 1
            dur = (j - i) * 0.01
            interior = i > 0 and j < n  # no tocar silencios inicial/final aquí
            if interior and dur > max_pause:
                half = max_pause / 2
                a = int((i * 0.01 + half) * SR)
                b = int((j * 0.01 - half) * SR)
                keep[a:b] = False
                cuts += 1
            i = j
        else:
            i += 1
    # aplicar fundidos alrededor de cada corte
    y = x.copy()
    edges = np.flatnonzero(np.diff(keep.astype(np.int8)))
    for e in edges:
        lo, hi = max(0, e - fade), min(len(y), e + fade)
        if keep[e]:  # empieza un corte justo después de e
            y[lo:e + 1] *= np.linspace(1, 0, e + 1 - lo)
        else:  # termina un corte en e
            y[e + 1:hi] *= np.linspace(0, 1, hi - e - 1)
    out = y[keep]
    # recortar silencio inicial/final a 0.15 s
    idx = np.flatnonzero(np.abs(out) > 10 ** (-40 / 20))
    if len(idx):
        out = out[max(0, idx[0] - int(0.15 * SR)): idx[-1] + int(0.15 * SR)]
    return out, cuts


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("--pausa", type=float, default=0.38)
    ap.add_argument("--tempo", type=float, default=1.05)
    a = ap.parse_args()
    src = a.video / "audio" / "voz-original.mp3"
    dst = a.video / "audio" / "voz.mp3"
    x = decode(src)
    y, cuts = shorten_pauses(x, a.pausa)
    proc = subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
         "-af", f"atempo={a.tempo},loudnorm=I=-16:TP=-1.5:LRA=11,apad=pad_dur=0.25",
         "-ar", str(SR), "-b:a", "192k", str(dst)],
        input=y.astype(np.float32).tobytes(), check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dst)],
                               capture_output=True, text=True).stdout)
    print(f"{a.video.name}: {len(x)/SR:.2f}s -> {dur:.2f}s ({cuts} pausas acortadas)")


if __name__ == "__main__":
    main()
