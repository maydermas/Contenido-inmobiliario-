"""Música original generada por código (licencia propia del proyecto) y efectos de sonido.

Uso:
    .venv/bin/python herramientas/musica.py pista  <salida.wav> --segundos 50 --tono calido --bpm 72 [--semilla 1]
    .venv/bin/python herramientas/musica.py sfx    <carpeta>

Tonos disponibles (ver TONOS): calido, sereno, urbano.
Estructura: pads suaves + piano de notas sueltas + bajo; entra poco a poco y se abre en el
último tercio para acompañar la conclusión. Sin percusión agresiva (lenguaje de marca).
"""
from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

SR = 44100
NOTAS = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(nota: str, octava: int) -> float:
    return 440.0 * 2 ** ((NOTAS[nota] + 12 * (octava + 1) - 69) / 12)


# Progresiones (acordes como listas de notas). Todas en modo tranquilo, sin dramatismo.
TONOS = {
    "calido": [["A", "C", "E", "G"], ["F", "A", "C", "E"], ["C", "E", "G", "B"], ["G", "B", "D", "A"]],   # Am9 Fmaj7 Cmaj7 G(add9)
    "sereno": [["D", "F#", "A", "C#"], ["B", "D", "F#", "A"], ["G", "B", "D", "F#"], ["A", "C#", "E", "B"]],  # Dmaj7 Bm7 Gmaj7 A(add9)
    "urbano": [["E", "G", "B", "D"], ["C", "E", "G", "B"], ["A", "C", "E", "G"], ["B", "D#", "F#", "A"]],  # Em7 Cmaj7 Am7 B7
}


def env_adsr(n: int, a: float, r: float) -> np.ndarray:
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 2
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    X = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    resp = 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X * (resp[:, None] if x.ndim == 2 else resp), n=x.shape[0], axis=0)


def reverb(x: np.ndarray, segundos: float = 3.2, mezcla: float = 0.35, rng=None) -> np.ndarray:
    rng = rng or np.random.default_rng(0)
    n = int(segundos * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t * 6.9 / segundos)
        ir = lowpass(ir, 5000)
        ir /= np.sqrt(np.sum(ir ** 2))
        L = x.shape[0] + n
        y = np.fft.irfft(np.fft.rfft(x[:, ch], L) * np.fft.rfft(ir, L), L)[: x.shape[0]]
        out[:, ch] = y
    return x * (1 - mezcla) + out * mezcla


def pad(freqs: list[float], dur: float, rng) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for f in freqs:
        for d, pan in ((-0.07, 0.25), (0.0, 0.5), (0.07, 0.75)):
            ff = f * 2 ** (d / 12)
            ph = rng.uniform(0, 2 * np.pi)
            # triángulo suave (pocos armónicos): cálido, nada brillante
            s = (np.sin(2 * np.pi * ff * t + ph) + np.sin(2 * np.pi * 3 * ff * t + ph) / 9 - np.sin(2 * np.pi * 5 * ff * t + ph) / 25)
            out[:, 0] += s * (1 - pan)
            out[:, 1] += s * pan
    out *= env_adsr(n, min(1.5, dur / 3), min(1.8, dur / 3))[:, None]
    return lowpass(out, 1800) / (len(freqs) * 3)


def piano(f: float, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k * 1.1)) / k ** 1.4 for k in range(1, 6))
    s *= env_adsr(n, 0.004, 0.25)
    return s


def pista(segundos: float, tono: str, bpm: float, semilla: int) -> np.ndarray:
    rng = np.random.default_rng(semilla)
    prog = TONOS[tono]
    beat = 60 / bpm
    compas = beat * 4
    total = int((segundos + 3) * SR)
    mix = np.zeros((total, 2))
    t_acorde = compas * 2  # cada acorde dura dos compases
    i = 0
    t = 0.0
    while t < segundos + 3:
        acorde = prog[i % len(prog)]
        base = [hz(n, 3 if k == 0 else 4) for k, n in enumerate(acorde)]
        p = pad(base, t_acorde + 1.6, rng)
        a = int(t * SR)
        b = min(total, a + len(p))
        mix[a:b] += p[: b - a] * 0.9
        # bajo
        bn = int((t_acorde + 0.5) * SR)
        tb = np.arange(bn) / SR
        bajo = np.sin(2 * np.pi * hz(acorde[0], 2) * tb) * env_adsr(bn, 0.3, 0.8) * 0.22
        b2 = min(total, a + bn)
        mix[a:b2] += bajo[: b2 - a, None]
        # piano: notas sueltas, más densas en la segunda mitad del vídeo
        densidad = 0.35 if t < segundos * 0.35 else 0.6
        for paso in range(int(t_acorde / (beat / 2))):
            if rng.random() < densidad and paso % 2 == 0 or (paso == 0):
                nota = acorde[rng.integers(0, len(acorde))]
                f = hz(nota, 5 if rng.random() < 0.7 else 4)
                s = piano(f, 2.5) * (0.16 if paso else 0.2)
                pa = int((t + paso * beat / 2) * SR)
                pb = min(total, pa + len(s))
                if pb <= pa:
                    continue
                pan = rng.uniform(0.3, 0.7)
                mix[pa:pb, 0] += s[: pb - pa] * (1 - pan)
                mix[pa:pb, 1] += s[: pb - pa] * pan
        t += t_acorde
        i += 1
    mix = reverb(mix, rng=rng)
    mix = mix[: int(segundos * SR)]
    # curva general: entrada suave, final con fundido
    n = mix.shape[0]
    curva = np.ones(n)
    fi, fo = int(1.2 * SR), int(2.5 * SR)
    curva[:fi] = np.linspace(0, 1, fi)
    curva[-fo:] = np.linspace(1, 0, fo) ** 1.5
    mix *= curva[:, None]
    return mix / (np.max(np.abs(mix)) + 1e-9) * 0.7


def sfx(carpeta: Path) -> None:
    rng = np.random.default_rng(7)
    carpeta.mkdir(parents=True, exist_ok=True)
    # whoosh: ruido filtrado con barrido, para transiciones
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    ruido = rng.standard_normal((n, 2))
    env = np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 3
    w = lowpass(ruido, 2200) * env[:, None]
    escribir(carpeta / "whoosh.wav", w / np.max(np.abs(w)) * 0.5)
    # tick: clic suave de madera para elementos que aparecen
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    k = (np.sin(2 * np.pi * 1850 * t) * 0.6 + np.sin(2 * np.pi * 920 * t)) * np.exp(-t * 55)
    escribir(carpeta / "tick.wav", np.stack([k, k], 1) / np.max(np.abs(k)) * 0.45)
    # pop: aparición de cifra importante (dos notas)
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    p = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 7) for f in (hz("E", 5), hz("B", 5))) * env_adsr(n, 0.003, 0.1)
    escribir(carpeta / "pop.wav", np.stack([p, p], 1) / np.max(np.abs(p)) * 0.4)
    # papel: deslizamiento de documento
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    pa = lowpass(rng.standard_normal((n, 2)), 6000) * (np.sin(np.pi * t / 0.6) ** 2)[:, None]
    pa -= lowpass(pa, 900)
    escribir(carpeta / "papel.wav", pa / np.max(np.abs(pa)) * 0.35)


def escribir(path: Path, x: np.ndarray) -> None:
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("pista")
    p.add_argument("salida", type=Path)
    p.add_argument("--segundos", type=float, required=True)
    p.add_argument("--tono", default="calido", choices=list(TONOS))
    p.add_argument("--bpm", type=float, default=76)
    p.add_argument("--semilla", type=int, default=1)
    s = sub.add_parser("sfx")
    s.add_argument("carpeta", type=Path)
    a = ap.parse_args()
    if a.cmd == "pista":
        a.salida.parent.mkdir(parents=True, exist_ok=True)
        escribir(a.salida, pista(a.segundos, a.tono, a.bpm, a.semilla))
        print(f"música: {a.salida} ({a.segundos:.1f}s, {a.tono}, {a.bpm} bpm)")
    else:
        sfx(a.carpeta)
        print(f"efectos: {a.carpeta}")


if __name__ == "__main__":
    main()
