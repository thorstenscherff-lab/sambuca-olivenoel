#!/usr/bin/env python3
"""Baut das Porträt-Sprite (IMG_P) aus den Mastern in source/portraits/<i>-<id>.jpg.
Zelle i = Figur mit CHARS[].i (96×128 px, ganzes Bild verkleinert, LANCZOS), N Zellen nebeneinander (v0.9.0: 23 → 2208×128) WebP.
Aufruf: python3 source/tools/make_portrait_sprite.py [out.webp]   (Standard: /tmp/port_sprite.webp)
Hinweis: Das ausgelieferte Sprite (source/portraits/port_sprite.webp, sha256 373f8935…) wurde 2026 ohne Skript erzeugt;
dieses Skript reproduziert es visuell (Abweichung wird ausgegeben), nicht byte-identisch. Siehe docs/OPEN_ISSUES.md (OI-012)."""
import sys, os, glob
from PIL import Image, ImageChops, ImageStat
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "portraits")
files = sorted(glob.glob(D + "/[0-9]*-*.jpg"), key=lambda f: int(os.path.basename(f).split("-")[0]))
out = Image.new("RGB", (96 * len(files), 128))
for k, f in enumerate(files): out.paste(Image.open(f).convert("RGB").resize((96, 128), Image.LANCZOS), (96 * k, 0))
dst = sys.argv[1] if len(sys.argv) > 1 else "/tmp/port_sprite.webp"; out.save(dst, "WEBP", quality=82)
ref = os.path.join(D, "port_sprite.webp")
if os.path.exists(ref):
    r = Image.open(ref).convert("RGB")
    if r.size == out.size: print("mittlere Abweichung zum Original (0–255):", round(sum(ImageStat.Stat(ImageChops.difference(r, out)).mean) / 3, 2))
print(dst, out.size, len(files), "Zellen")
