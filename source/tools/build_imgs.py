#!/usr/bin/env python3
"""Erzeugt source/game/imgs.tsx neu aus den Szenenbildern (source/scenes/*.jpg).
So wurde IMG_SC / IMG_F in v0.7 erzeugt: Resize 450x800 (LANCZOS), WebP q70 (Festa q72), method 6,
Base64 in 4000-Zeichen-Stücken. IMG_S / IMG_U sind seit v0.7.1 externe Dateien (maps/*.webp).
IMG_B (Büro alt) und IMG_P (Porträts) werden unverändert aus der bestehenden imgs.tsx übernommen.
Aufruf: python3 source/tools/build_imgs.py   (Pillow 13.0.0)"""
import re, base64, io, os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, "..")
F = os.path.join(SRC, "game", "imgs.tsx"); SC_DIR = os.path.join(SRC, "scenes")
def arr(b):
    c = base64.b64encode(b).decode(); ch = [c[i:i+4000] for i in range(0, len(c), 4000)]
    return '["data:image/webp;base64,",\n' + ',\n'.join('"%s"' % x for x in ch) + '].join("")'
def webp(path, size, q):
    im = Image.open(path).convert("RGB")
    if size: im = im.resize(size, Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "WEBP", quality=q, method=6); return b.getvalue()
SC = {'buero1': '01_buero1_start', 'buero2': '02_buero2_bescheiden', 'buero3': '03_buero3_erfolg', 'buero4': '04_buero4_padrino',
      'rathaus': '05_rathaus', 'bar': '06_bar_del_corso', 'chiesa': '07_chiesa', 'feudo': '09_feudo', 'frantoio': '10_frantoio',
      'hain': '11_hain', 'belv': '12_belvedere', 'lago': '13_lago', 'teatro': '14_teatro_palazzo', 'banca': '16_banca',
      # v0.8: neue Szenen (FB-01/07/13/15/18/25); 15_ruine_adranone bleibt als Quelldatei, wird aber nicht mehr eingebettet
      'start': '17_start_hain', 'torre': '18_torre_pandolfina', 'hotel': '19_hotel_pool', 'santa': '20_settimana_santa',
      'lido': '21_lido', 'santuario': '22_santuario', 'vassalli': '23_fest_vassalli', 'giorgio': '24_fest_giorgio'}
parts = re.split(r'\n(?=const )', open(F).read()); out = []
for p in parts:
    m = re.match(r'const (\w+)', p); n = m.group(1) if m else None
    if n == 'IMG_F': p = 'const IMG_F = %s;' % arr(webp(os.path.join(SC_DIR, '08_festa.jpg'), (450, 800), 72))
    elif n == 'IMG_SC':
        p = 'const IMG_SC: Record<string, string> = {\n' + '\n'.join('  %s: %s,' % (k, arr(webp(os.path.join(SC_DIR, f + '.jpg'), (450, 800), 70))) for k, f in SC.items()) + '\n};'
    out.append(p)
open(F, 'w').write('\n'.join(out).rstrip('\n') + '\n'); print("imgs.tsx neu geschrieben")
