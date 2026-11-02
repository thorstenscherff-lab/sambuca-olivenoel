#!/usr/bin/env python3
"""Schneidet Stadt- und Umland-Ausschnitt aus dem Micro-Macro-Poster v12 (300 dpi).
Kein Skalieren: Pixel 1:1 aus dem Original. Ausgabe WebP q80, method 6."""
import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
SRC = sys.argv[1] if len(sys.argv) > 1 else "/workspace/sambuca-karte/v12/sambuca_karte_120x60cm_micromacro_300dpi_v12.png"
OUT = sys.argv[2] if len(sys.argv) > 2 else "maps"
CT = (4606, 1583, 9567, 5480)   # Stadt  -> 4961 x 3897 px
CU = (0, 800, 4600, 3800)       # Umland -> 4600 x 3000 px
im = Image.open(SRC).convert("RGB")
assert im.size == (14173, 7086), im.size
for box, name in ((CT, "stadt_v071.webp"), (CU, "umland_v071.webp")):
    c = im.crop(box)
    c.save(f"{OUT}/{name}", "WEBP", quality=80, method=6)
    print(name, c.size)
