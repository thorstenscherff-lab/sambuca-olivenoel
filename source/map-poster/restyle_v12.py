# Rendert render_v12.py unverändert (gleiche Daten, gleiche Positionen) und färbt/setzt Schriften erst vor dem Speichern um.
import sys, os, glob, numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, matplotlib.colors as mc
from matplotlib import font_manager as fm
from matplotlib.text import Text
from matplotlib.lines import Line2D
from matplotlib.patches import Patch
from matplotlib.collections import Collection
from matplotlib.image import AxesImage
STYLE, DPI, OUT = sys.argv[1], int(sys.argv[2]), sys.argv[3]
G = "/usr/share/fonts/truetype/sand-box/google/"
def F(d, pat="*"):
    f = sorted(glob.glob(G + d + "/" + pat + ".ttf"))[0]; fm.fontManager.addfont(f); return fm.FontProperties(fname=f)
if STYLE == "mm":
    FT, FH, FB, FN = F("Archivo Black"), F("Archivo Black"), F("Roboto Condensed"), F("Roboto Condensed")
else:
    FT, FH, FB, FN = F("Cinzel Decorative", "*Bold*"), F("Cinzel", "*") , F("IM Fell English SC"), F("Alegreya", "*Italic*")
SEP = np.array(mc.to_rgb("#3b2412"))
def rgb_map(c):
    c = np.asarray(c, float); r, g, b = c[..., 0], c[..., 1], c[..., 2]
    L = 0.3 * r + 0.59 * g + 0.11 * b
    if STYLE == "mm":
        sat = np.clip(np.max(c[..., :3], -1) - np.min(c[..., :3], -1), 0, 1)
        Lg = np.interp(L, [0, .3, .62, 1], [0, .09, .9, 1.0])   # Tinte -> schwarz, Papier -> hellgrau
        k = np.where(sat > 0.25, 0.55, 0.22)[..., None]                                    # Farbakzente gedämpft behalten
        out = Lg[..., None] + (c[..., :3] - L[..., None]) * k
    else:
        sep = np.stack([L * 1.02 + .04, L * 0.86 + .02, L * 0.62], -1)                     # Sepia-Tönung
        out = sep * 0.55 + c[..., :3] * 0.45
        w = np.clip((0.35 - L) / 0.12, 0, 1)[..., None]; out = out * (1 - w) + SEP * (0.6 + L[..., None]) * w
    return np.clip(out, 0, 1)
def cm(col):
    if col is None or (isinstance(col, str) and col == "none"): return col
    a = mc.to_rgba(col); return (*rgb_map(np.array(a[:3])), a[3])
def carr(arr):
    arr = np.array(arr, float)
    if arr.size == 0: return arr
    arr[:, :3] = rgb_map(arr[:, :3]); return arr
_save = plt.Figure.savefig
def themed(fig, *a, **k):
    seen = set()
    for o in fig.findobj():
        if id(o) in seen: continue
        seen.add(id(o))
        if isinstance(o, Text):
            o.set_color(cm(o.get_color()))
            fam = os.path.basename(o.get_fontproperties().get_file() or "")
            sz = o.get_fontsize()
            if "Fell" in fam or "Cinzel" in fam:
                fp = (FT if sz >= 24 else FH if sz >= 11.5 else FB).copy(); fp.set_size(sz * (0.92 if STYLE == "mm" and sz >= 24 else 1)); o.set_fontproperties(fp)
            elif fam:  # Handschrift (Kalam/Tangerine) -> Fließtext
                fp = FN.copy(); fp.set_size(sz * (1.0 if STYLE == "mm" else 1.05)); o.set_fontproperties(fp)
            if STYLE == "lotr" and sz >= 24: o.set_color(cm("#6e1b10"))
        elif isinstance(o, Line2D):
            o.set_color(cm(o.get_color())); o.set_mfc(cm(o.get_mfc())); o.set_mec(cm(o.get_mec()))
            if STYLE == "mm": o.set_sketch_params(None)
        elif isinstance(o, Patch):
            fc, ec = o.get_facecolor(), o.get_edgecolor()
            if STYLE == "mm" and o.get_hatch() == "////":  # Altstadt-Gebäude: gedämpfte Flächen statt Schraffur
                o.set_hatch(None); o.set_facecolor(cm("#c7bfae")); o.set_edgecolor(cm("#151515")); o.set_linewidth(o.get_linewidth() * 1.4)
            else:
                o.set_facecolor(cm(fc)); o.set_edgecolor(cm(ec))
            try: o._hatch_color = cm(o._hatch_color)
            except Exception: pass
            if STYLE == "mm": o.set_sketch_params(None)
        elif isinstance(o, Collection):
            try:
                from matplotlib.contour import ContourSet
                from matplotlib.collections import LineCollection
                lineish = isinstance(o, LineCollection) or (isinstance(o, ContourSet) and not o.filled)
                if not lineish and len(o.get_facecolor()): o.set_facecolor(carr(o.get_facecolor()))
                if len(o.get_edgecolor()): o.set_edgecolor(carr(o.get_edgecolor()))
            except Exception: pass
            if STYLE == "mm": o.set_sketch_params(None)
        elif isinstance(o, AxesImage):
            A = np.asarray(o.get_array(), float)
            if A.ndim == 3:
                mx = 255.0 if A.max() > 1.5 else 1.0
                B = np.array(A, float)
                if A.shape[2] == 4:
                    if STYLE == "mm": B[..., :3] = (.30, .30, .33)
                elif STYLE == "mm":
                    L = (0.3 * B[..., 0] + 0.59 * B[..., 1] + 0.11 * B[..., 2]) / mx
                    t = np.clip((L - 0.45) / 0.5, 0, 1)
                    B[..., :3] = (np.array([.86, .855, .83]) + t[..., None] * np.array([.11, .11, .11])) * mx
                else:
                    B[..., :3] = np.clip(B[..., :3] * np.array([1.0, .97, .9]), 0, mx)
                o.set_data(B)
    # Altstadt-Straßen in MM: Füllung weiß
    if STYLE == "mm":
        for o in fig.findobj(Line2D):
            c = mc.to_rgb(o.get_color())
            if min(c) > 0.85 and o.get_linewidth() > 2: o.set_color("white")
    return _save(fig, *a, **k)
plt.Figure.savefig = themed
sys.argv = ["render_v12.py", str(DPI), OUT]
exec(compile(open("render_v12.py").read(), "render_v10.py", "exec"))
