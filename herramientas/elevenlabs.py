"""Adaptador de la API de ElevenLabs con control de cupo (vía alternativa al conector de Claude).

La clave NO se guarda en el código ni en variables: está guardada como secreto de red del entorno de Claude
para el host api.elevenlabs.io y el proxy la inyecta en la cabecera `xi-api-key`. Si se ejecuta fuera de ese
entorno, define ELEVENLABS_API_KEY con una clave real.

Uso:
    ELEVENLABS_API_KEY=... .venv/bin/python herramientas/elevenlabs.py contenido/videos/<ID> [--estimar]

- Lee guion.yaml, une las frases `voz` y comprueba el cupo restante del plan ANTES de generar.
- Se niega a generar si el texto supera el cupo restante menos una reserva (por defecto 3.000 caracteres),
  para no provocar sobreconsumo ni cargos (Directiva 2.0 §1).
- Guarda audio/voz-original.mp3 y audio/texto-locucion.txt.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

API = "https://api.elevenlabs.io/v1"
RESERVA = 3000


def peticion(ruta: str, datos: dict | None = None) -> bytes:
    # En el entorno de Claude el proxy sustituye este valor por la clave real guardada como secreto.
    clave = os.environ.get("ELEVENLABS_API_KEY", "inyectada-por-el-proxy")
    req = urllib.request.Request(f"{API}{ruta}", method="POST" if datos else "GET",
                                 headers={"xi-api-key": clave, "Content-Type": "application/json"},
                                 data=json.dumps(datos).encode() if datos else None)
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def main() -> None:
    import yaml  # pyyaml

    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("--estimar", action="store_true", help="solo calcula caracteres y cupo, no genera")
    ap.add_argument("--reserva", type=int, default=RESERVA)
    a = ap.parse_args()

    g = yaml.safe_load((a.video / "guion.yaml").read_text(encoding="utf-8"))
    texto = "\n\n".join(b["voz"] for b in g["bloques"])
    voz = g.get("voz", {})
    try:
        sub = json.loads(peticion("/user/subscription"))
    except Exception as e:  # sin clave válida o host no permitido
        sys.exit(f"No se pudo consultar el cupo de ElevenLabs ({e}). No se genera nada.")
    restante = sub["character_limit"] - sub["character_count"]
    print(f"Texto: {len(texto)} caracteres · cupo restante: {restante} · plan: {sub.get('tier')} · reinicio: {sub.get('next_character_count_reset_unix')}")
    if len(texto) > restante - a.reserva:
        sys.exit("Cupo insuficiente (se respeta una reserva). No se genera nada para evitar cargos.")
    if a.estimar:
        return
    audio = peticion(f"/text-to-speech/{voz['voice_id']}?output_format=mp3_44100_192",
                     {"text": texto, "model_id": voz.get("modelo", "eleven_multilingual_v2")})
    (a.video / "audio").mkdir(exist_ok=True)
    (a.video / "audio" / "voz-original.mp3").write_bytes(audio)
    (a.video / "audio" / "texto-locucion.txt").write_text(texto, encoding="utf-8")
    print("Voz guardada en audio/voz-original.mp3")


if __name__ == "__main__":
    main()
