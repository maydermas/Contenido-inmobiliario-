"""Genera texturas propias del motor (grano de película). Licencia propia.

Uso: .venv/bin/python herramientas/texturas.py motor/public/texturas
"""
import subprocess
import sys
from pathlib import Path

import numpy as np

carpeta = Path(sys.argv[1])
carpeta.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(3)
n = 512
g = rng.normal(128, 38, (n, n))
# grano ligeramente orgánico: mezcla de dos escalas
g2 = np.kron(rng.normal(0, 16, (n // 2, n // 2)), np.ones((2, 2)))
img = np.clip(g + g2, 0, 255).astype(np.uint8)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{n}x{n}", "-i", "-", str(carpeta / "grano.png")],
               input=img.tobytes(), check=True)
print(f"textura: {carpeta / 'grano.png'}")
