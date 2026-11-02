import json, math, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
from matplotlib.patches import Polygon, Rectangle, FancyBboxPatch, Ellipse, Circle
from matplotlib.collections import LineCollection, PatchCollection
import matplotlib.patheffects as pe
from scipy.ndimage import gaussian_filter
from pois import TOWN, REGION, LANDMARKS, ADRAGNA, CATS
from icons import snail,  icon, COL
from numbering import NUM   # v4: räumliche Nummerierung (1 = Belvedere, Corso hinunter, dann im Uhrzeigersinn)
CATN = dict(CATS)

DPI = int(sys.argv[1]) if len(sys.argv) > 1 else 150
OUT = sys.argv[2] if len(sys.argv) > 2 else "sambuca_karte_120x60_150dpi.png"
G = "/usr/share/fonts/truetype/sand-box/google/"
def font(d):
    import glob
    f = sorted(glob.glob(G + d + "/*.ttf"))[0]
    fm.fontManager.addfont(f); return fm.FontProperties(fname=f)
FELL = font("IM Fell English SC"); HAND = font("Kalam"); SCRIPT = font("Tangerine")
import glob
FELLI = fm.FontProperties(fname=sorted(glob.glob(G+"IM Fell French Canon/*Italic*.ttf") or glob.glob(G+"IM Fell French Canon/*.ttf"))[0])

INK = "#3a2414"; RED = "#7c2216"; GREEN = "#3f5626"; BLUE = "#3d5f6e"; PARCH = "#e9d6a8"
LAT0, LON0 = 37.648, 13.111
KX, KY = 111.32 * math.cos(math.radians(LAT0)), 110.95
def km(lat, lon): return ((lon - LON0) * KX, (lat - LAT0) * KY)
km.LAT0, km.LON0, km.KX, km.KY = LAT0, LON0, KX, KY
from topo import draw_topo, wood_polys, draw_woods, spot_heights
from matplotlib.path import Path
HOUSE = Path([(-1, -1), (1, -1), (1, 0.25), (0, 1.15), (-1, 0.25), (-1, -1)], [1, 2, 2, 2, 2, 79])
TOWER = Path([(-0.6, -1), (0.6, -1), (0.6, 0.55), (0.85, 0.55), (0.85, 1), (0.5, 1), (0.5, 0.8), (0.17, 0.8), (0.17, 1), (-0.17, 1), (-0.17, 0.8), (-0.5, 0.8), (-0.5, 1), (-0.85, 1), (-0.85, 0.55), (-0.6, 0.55), (-0.6, -1)], [1] + [2] * 15 + [79])

W, H = 120.0, 60.0
fig = plt.figure(figsize=(W / 2.54, H / 2.54), dpi=DPI)
base = fig.add_axes([0, 0, 1, 1]); base.set_xlim(0, W); base.set_ylim(0, H); base.axis("off")

# --- parchment texture
rng = np.random.default_rng(7)
ny, nx = 600, 1200
n = sum(gaussian_filter(rng.standard_normal((ny, nx)), s) * w for s, w in [(2, .25), (8, .6), (30, 1.2), (90, 1.5)])
n = (n - n.min()) / (n.max() - n.min())
yy, xx = np.mgrid[0:ny, 0:nx]
vig = ((xx / nx - .5) ** 2 * 1.2 + (yy / ny - .5) ** 2 * 2.0)
light = np.clip(0.98 - 0.25 * n - 0.55 * vig, 0, 1)
c0 = np.array([0.93, 0.85, 0.66]); c1 = np.array([0.62, 0.45, 0.25])
img = c1 + (c0 - c1) * light[..., None]
# fold creases
for fx in (W/4, W/2, 3*W/4):
    i = int(fx / W * nx); img[:, i-1:i+2] *= 0.93
i = int(ny/2); img[i-1:i+2, :] *= 0.94
base.imshow(img, extent=(0, W, 0, H), origin="lower", zorder=0, interpolation="bicubic")

pe_halo = [pe.withStroke(linewidth=3, foreground=PARCH + "dd")]

def frame(ax_or_base, x0, y0, x1, y1, lw=1.6, z=5):
    for d, l in ((0, lw), (0.35, lw * .5)):
        base.add_patch(Rectangle((x0 + d, y0 + d), x1 - x0 - 2 * d, y1 - y0 - 2 * d, fill=False, ec=INK, lw=l, zorder=z))

# ---------------- REGION MAP ----------------
MX0, MX1, MY0, MY1 = 1.5, 118.5, 12.8, 58.5
INS = (39.0, 13.6, 81.0, 46.6)            # inset box in cm (x0,y0,x1,y1)
S = 3.3                                    # cm per km  (~1:30.000)
# region view: Sambuca (0,0) placed just left of inset; inset centred on canvas
SX, SY = INS[0] - 1.4 * S, 36.0            # canvas cm of Sambuca centre
def R(x, y): return (SX + x * S, SY + y * S)
axR = fig.add_axes([MX0 / W, MY0 / H, (MX1 - MX0) / W, (MY1 - MY0) / H])
kx0 = (MX0 - SX) / S; kx1 = (MX1 - SX) / S; ky0 = (MY0 - SY) / S; ky1 = (MY1 - SY) / S
axR.set_xlim(kx0, kx1); axR.set_ylim(ky0, ky1); axR.axis("off"); axR.patch.set_alpha(0)
region = json.load(open("region.json"))["elements"]
# v4: Straßen/Bäche bis an den Kartenrand (Nord- und Oststreifen nachgeladen, sonst endete u. a. die SS624 nach Palermo mitten im Bild)
_ids = {(e["type"], e["id"]) for e in region}
region += [e for e in json.load(open("v4/region_ext.json"))["elements"] if (e["type"], e["id"]) not in _ids]

def geoms(e):
    if "geometry" in e: yield [km(p["lat"], p["lon"]) for p in e["geometry"]]
    for m in e.get("members", []):
        if "geometry" in m: yield [km(p["lat"], p["lon"]) for p in m["geometry"] if p]
plt.rcParams["path.sketch"] = None
TOPO = draw_topo(axR, km, (kx0, kx1, ky0, ky1), INK)
WOODS = wood_polys("wood.json", km)
print("trees/shrubs", draw_woods(axR, WOODS, (kx0, kx1, ky0, ky1), INK))
# landuse textures
for e in region:
    t = e.get("tags", {}); lu = t.get("landuse")
    if lu in ("vineyard", "orchard") or t.get("leisure") == "nature_reserve":
        for g in geoms(e):
            if len(g) < 3: continue
            hatch = {"vineyard": "||||", "orchard": "o.", "forest": ".."}.get(lu, "")
            col = {"vineyard": "#6d5a2b", "orchard": "#5d6a32", "forest": "#4b5a2f"}.get(lu, INK)
            axR.add_patch(Polygon(g, closed=True, fc=col + "18", ec=col + "70", lw=0.3, hatch=hatch, zorder=1))
plt.rcParams["hatch.color"] = "#6d5a2b"; plt.rcParams["hatch.linewidth"] = 0.35
# rivers
for e in region:
    t = e.get("tags", {})
    if t.get("waterway") in ("river", "stream"):
        for g in geoms(e):
            a = np.array(g); axR.plot(a[:, 0], a[:, 1], color=BLUE, lw=0.9 if t["waterway"] == "river" else 0.4, alpha=.8, zorder=2)[0].set_sketch_params(0.6, 40.0, 2.0)
# water bodies
for e in region:
    t = e.get("tags", {})
    if t.get("natural") == "water" or t.get("landuse") == "basin":
        for g in geoms(e):
            if len(g) < 3: continue
            axR.add_patch(Polygon(g, closed=True, fc="#8fa9a8aa", ec=BLUE, lw=1.0, hatch="--", zorder=3))
# roads
wid = {"motorway": 1.6, "trunk": 1.4, "primary": 1.3, "secondary": 1.0, "tertiary": 0.7, "unclassified": 0.35}
for e in region:
    t = e.get("tags", {}); h = t.get("highway")
    if h in wid:
        for g in geoms(e):
            a = np.array(g)
            if h in ("primary", "secondary", "trunk", "motorway"):
                axR.plot(a[:, 0], a[:, 1], color=INK, lw=wid[h] * 2.2, zorder=4, solid_capstyle="round")[0].set_sketch_params(0.5, 60.0, 2.0)
                axR.plot(a[:, 0], a[:, 1], color="#e8d3a0", lw=wid[h] * 1.1, zorder=4.1, solid_capstyle="round")
            else:
                ww = 1.0 if h == "tertiary" else 0.75   # v12: als Straße (Kontur + Füllung), nicht als Weg
                axR.plot(a[:, 0], a[:, 1], color=INK, lw=ww * 2.2, zorder=3.9, solid_capstyle="round")
                axR.plot(a[:, 0], a[:, 1], color="#e8d3a0", lw=ww * 1.0, zorder=3.95, solid_capstyle="round")
# towns + peaks
for e in region:
    t = e.get("tags", {})
    if t.get("place") in ("town", "village") and "name" in t and e["type"] == "node":
        x, y = km(e["lat"], e["lon"])
        if t["name"] == "Sambuca di Sicilia": continue
        axR.add_patch(Circle((x, y), 0.18, fc=INK + "30", ec=INK, lw=1, hatch="xxx", zorder=6, clip_on=True))
        axR.text(x, y + 0.5, t["name"], fontproperties=FELL, fontsize=17, color=INK, ha="center", va="bottom", zorder=7, path_effects=pe_halo, clip_on=True)
    if t.get("natural") == "peak" and "name" in t and t.get("ele"):
        x, y = km(e["lat"], e["lon"])
        try: ele = float(t["ele"])
        except: continue
        if ele < 700: continue
        axR.plot(x, y, marker="^", ms=9, color=INK, mfc="#cbb07a", zorder=6, clip_on=True)
        axR.text(x, y - 0.3, f"{t['name']}\n{int(ele)} m", fontproperties=HAND, fontsize=9, color=INK, ha="center", va="top", zorder=7, path_effects=pe_halo, clip_on=True)
# lake label
lx, ly = km(37.6364, 13.0661)
axR.text(lx - 0.3, ly - 0.15, "Lago Arancio", fontproperties=FELLI, fontsize=30, color="#1f3e4a", ha="center", va="center", rotation=-12, zorder=8, path_effects=pe_halo)
ax_, ay_ = km(37.6834, 13.1395)
axR.plot(ax_, ay_, marker=(8, 2, 0), ms=11, color=INK, zorder=7)
axR.text(ax_, ay_ + 0.25, "Monte Adranone\n(antike Ausgrabung)", fontproperties=HAND, fontsize=9.5, color=INK, ha="center", va="bottom", zorder=7, path_effects=pe_halo, clip_on=True)
# Lido Boomerang: arrow from the SP41 (road to Menfi, west of the lake) towards the beach (off-map, ~9 km)
LIDO = (37.57522, 12.94071)
r0 = km(37.6438, 13.0108); r_edge = km(37.6419, 12.9984)
lx_, ly_ = km(*LIDO); dvec = np.array([lx_ - r0[0], ly_ - r0[1]]); dvec /= np.hypot(*dvec)
tip = (kx0 + 0.25, r0[1] + dvec[1] / dvec[0] * (kx0 + 0.25 - r0[0]))
axR.annotate("", xy=tip, xytext=(r0[0] + 0.1, r0[1] - 0.12), arrowprops=dict(arrowstyle="-|>,head_length=0.9,head_width=0.45", color=RED, lw=2.0, connectionstyle="arc3,rad=-0.15"), zorder=9)
d_edge = math.hypot(lx_ - r_edge[0], ly_ - r_edge[1])
axR.text(tip[0] + 0.05, tip[1] - 0.18, "Lido Boomerang", fontproperties=FELLI, fontsize=19, color=RED, ha="left", va="top", zorder=9, path_effects=pe_halo)
axR.text(tip[0] + 0.1, tip[1] - 0.95, f"Strand bei Menfi · SP41 Richtung Menfi\nnoch ≈ {d_edge:.0f} km Luftlinie", fontproperties=HAND, fontsize=11, color=INK, ha="left", va="top", zorder=9, path_effects=pe_halo, linespacing=0.95)
# v4 Palermo: Route der Einheimischen = SP70 bis zur SS624 (Palermo–Sciacca), dann nach Norden (Wikivoyage/OSM; ≈ 78 km Fahrt)
PAL = (38.1157, 13.3615)
_rt = []
for e in region:
    t = e.get("tags", {})
    if "geometry" not in e: continue
    if t.get("ref") == "SP70" or t.get("ref") == "SS624":
        a = np.array([km(p["lat"], p["lon"]) if (t.get("ref") == "SP70" or p["lat"] >= 37.6755) else (np.nan, np.nan) for p in e["geometry"]])
        axR.plot(a[:, 0], a[:, 1], color=RED, lw=1.6, solid_capstyle="round", alpha=.9, zorder=4.3)  # v12: durchgehend (sah wie Schienen aus)
# exit point of SS624 at the upper map edge
ss = [km(p["lat"], p["lon"]) for e in region if e.get("tags", {}).get("ref") == "SS624" and "geometry" in e for p in e["geometry"]]
ss = np.array([q for q in ss if ky1 - 1.6 < q[1] < ky1 + 0.4])
ex_ = ss[np.argmin(np.abs(ss[:, 1] - ky1))]
st_ = ss[np.argmin(np.abs(ss[:, 1] - (ky1 - 1.25)))]
ptip = (st_[0] + 0.55, ky1 - 0.12)
axR.annotate("", xy=ptip, xytext=(st_[0] + 0.12, st_[1]), arrowprops=dict(arrowstyle="-|>,head_length=0.9,head_width=0.45", color=RED, lw=2.0, connectionstyle="arc3,rad=0.15"), zorder=9)
pxy = km(*PAL); exll = (km.LAT0 + ex_[1] / km.KY, km.LON0 + ex_[0] / km.KX)
d_pal = math.hypot(pxy[0] - ex_[0], pxy[1] - ex_[1])
axR.text(ptip[0] + 0.3, ky1 - 0.15, "Palermo", fontproperties=FELLI, fontsize=19, color=RED, ha="left", va="top", zorder=9, path_effects=pe_halo)
axR.text(ptip[0] + 0.33, ky1 - 0.95, f"über SP70 und SS624 Palermo–Sciacca · ≈ 78 km Fahrt ab Sambuca\nab Kartenrand noch ≈ {d_pal:.0f} km Luftlinie", fontproperties=HAND, fontsize=11, color=INK, ha="left", va="top", zorder=9, path_effects=pe_halo, linespacing=0.95)
print("Palermo exit", exll, "Luftlinie", round(d_pal, 1))
# Pandolfina: our olive grove (coords from Thorsten) + Torre di Pandolfina (it.wikipedia contrada coords, approx.)
gx_, gy_ = km(37.679965, 13.094593)
axR.add_patch(Circle((gx_, gy_), 0.034, fc="#7d8a3c", ec=INK, lw=0.6, zorder=10))
axR.add_patch(Circle((gx_, gy_), 0.30, fill=False, ec=RED, lw=1.6, ls=(0, (4, 2)), zorder=10))  # v12: Markierung Olivenhain (ohne Beschriftung)
axR.text(gx_ + 0.38, gy_ + 0.05, "Pandolfina", fontproperties=FELLI, fontsize=20, color=INK, ha="left", va="bottom", zorder=11, path_effects=pe_halo)
tx_, ty_ = km(37.68056, 13.08583)
axR.plot(tx_, ty_, marker=TOWER, ms=22, mfc="#b9a06a", mec=INK, mew=1.4, zorder=11)
axR.text(tx_ - 0.22, ty_ + 0.18, "Torre di Pandolfina", fontproperties=FELL, fontsize=14, color=INK, ha="right", va="bottom", zorder=11, path_effects=pe_halo)
axR.text(tx_ - 0.22, ty_ + 0.12, "Burgturm, 15. Jh.", fontproperties=HAND, fontsize=10.5, color=INK, ha="right", va="top", zorder=11, path_effects=pe_halo)
# spot heights from SRTM (unnamed hills, e.g. next to the lake)
for (hx, hy, hz) in spot_heights(*TOPO, (-8.5, 2.5, -6.0, 2.0)):
    if np.hypot(hx, hy) < 1.0 or np.hypot(hx - gx_, hy - gy_) < 1.0: continue
    if any(np.hypot(hx - km(la, lo)[0], hy - km(la, lo)[1]) < 0.8 for _, _, la, lo, _, _ in REGION): continue
    if INS[0] - 0.3 < SX + hx * S < INS[2] + 0.3 and INS[1] - 0.3 < SY + hy * S < INS[3] + 0.3: continue
    if 83.5 < SX + hx * S < 104.5 and 26.3 < SY + hy * S < 47.4: continue
    axR.plot(hx, hy, marker="^", ms=6.5, color=INK, mfc="#cbb07a", mew=0.9, zorder=6, clip_on=True)
    axR.text(hx, hy - 0.16, f"{int(round(hz, -1)) if False else int(hz)} m", fontproperties=HAND, fontsize=8.5, color=INK, ha="center", va="top", zorder=6, path_effects=pe_halo, clip_on=True)
# Sambuca true position + lens lines to inset
axR.add_patch(Circle((0, 0), 0.32, fc=RED + "55", ec=RED, lw=1.6, hatch="xxx", zorder=8))
axR.text(0.05, -0.42, "Sambuca di Sicilia", fontproperties=FELL, fontsize=20, color=RED, ha="center", va="top", zorder=9, path_effects=pe_halo)

# region POIs (pictogram badges + letter)
LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
UORD = ["wine", "oil", "dairy", "rest", "grocery", "craft", "works", "shelter", "furniture", "agri", "waste", "hotel"]  # v4: neue Kategorien hinten -> A–U bleiben
RSORT = sorted(REGION + ADRAGNA, key=lambda t: UORD.index(t[1]))
RLET = {t[0]: LET[i] for i, t in enumerate(RSORT)}
RR = 0.36 / S
roffs = {"Cantina Cellaro": (-1, 0, "right"), "Cantina Di Prima": (0.0, -1, "top"), "Feudo Arancio": (0, 1, "bottom"), "Planeta": (0, -1, "top"),
         "Giovinco": (0, 1, "bottom"), "Domina Miccina": (0, 1, "bottom"), "Di Giovanna": (0, -1, "top"), "Antico Frantoio": (0, 1, "bottom"),
         "Supermercato Sisa": (0, -1, "top"), "COMART": (-1, 0, "right"), "Canile Viardi": (0, -1, "top"), "Dog's Garden": (0, -1, "top"), "Fonderia": (0, 1, "bottom"),
         "Tumminello": (1, 0, "left"), "Agraria": (-1, 0, "right"), "Isola ecologica": (1, 0, "left")}
def rshort(nm):
    for k in roffs:
        if nm.startswith(k): return k
    return nm
RA_ = np.array([km(t[2], t[3]) for t in REGION]); RP_ = RA_.copy()
for it in range(300):
    for i in range(len(RP_)):
        d = RP_[i] - RP_; dist = np.hypot(d[:, 0], d[:, 1]); dist[i] = 9
        for j in np.where(dist < 2.6 * RR)[0]:
            v = d[j] / max(dist[j], 1e-6); RP_[i] += v * (2.6 * RR - dist[j]) * .25; RP_[j] -= v * (2.6 * RR - dist[j]) * .25
    RP_ += (RA_ - RP_) * 0.02
for i, (name, cat, lat, lon, src, note) in enumerate(REGION):
    x, y = RP_[i]; x0_, y0_ = RA_[i]
    if np.hypot(x - x0_, y - y0_) > 0.5 * RR:
        axR.plot([x0_, x], [y0_, y], color=INK, lw=0.8, zorder=9); axR.plot(x0_, y0_, "o", ms=3, color=INK, zorder=9)
    icon(axR, cat, x, y, RR, z=10, lw=1.2)
    k = rshort(name); dx, dy, al = roffs.get(k, (0, 1, "bottom"))
    short = {"Planeta": "Planeta Ulmo", "Fonderia": "Fonderia Virgadamo", "Supermercato Sisa": "Sisa", "Tumminello": "Möbel Tumminello", "Agraria": "Agraria (Natale)", "Isola ecologica": "Wertstoffhof"}.get(k, k)
    lab = f"{RLET[name]} {short}"
    if al in ("top", "bottom"):
        axR.text(x, y + dy * (RR + 0.03), lab, fontproperties=HAND, fontsize=12, color=INK, ha="center", va=al, zorder=11, path_effects=pe_halo)
    else:
        axR.text(x + dx * (RR + 0.04), y, lab, fontproperties=HAND, fontsize=12, color=INK, ha=al, va="center", zorder=11, path_effects=pe_halo)
# pointer to inset
axR.annotate("", xy=((INS[0] - SX) / S - 0.05, 0), xytext=(0.4, 0), arrowprops=dict(arrowstyle="-|>", color=RED, lw=1.6, ls="--"), zorder=9)
axR.text(0.45, 0.25, "Altstadtplan", fontproperties=HAND, fontsize=11, color=RED, ha="left", va="bottom", zorder=9, path_effects=pe_halo)
gx, gy = km(37.700, 13.205)
axR.text(gx, gy, "Riserva Naturale Monte Genuardo\ne Santa Maria del Bosco", fontproperties=FELLI, fontsize=15, color=GREEN, ha="center", va="center", zorder=7, path_effects=pe_halo, clip_on=True)
mx, my = km(37.6098, 13.3369)
axR.text(mx, my, "M o n t i   S i c a n i", fontproperties=FELLI, fontsize=40, color="#5a4326", ha="center", va="center", rotation=8, alpha=.8, zorder=7, path_effects=pe_halo, clip_on=True)
# compass rose (region)
def compass(ax, x, y, r):
    for ang, L in [(90, 1), (0, .6), (180, .6), (270, .6), (45, .4), (135, .4), (225, .4), (315, .4)]:
        a = math.radians(ang); tip = (x + r * L * math.cos(a), y + r * L * math.sin(a))
        for s, col in ((1, INK), (-1, "#e8d3a0")):
            b = math.radians(ang + 90 * s); w = r * 0.12
            ax.add_patch(Polygon([(x, y), tip, (x + w * math.cos(b), y + w * math.sin(b))], fc=col, ec=INK, lw=0.8, zorder=12))
    ax.text(x, y + r * 1.08, "N", fontproperties=FELL, fontsize=20, ha="center", va="bottom", color=INK, zorder=12)
compass(axR, kx0 + 2.0, ky0 + 2.2, 1.5)
# region scale bar
def scalebar(ax, x, y, length, unit_per, label, seg=4, h=None):
    h = h or length * 0.03
    for i in range(seg):
        ax.add_patch(Rectangle((x + i * length / seg, y), length / seg, h, fc=INK if i % 2 == 0 else "#efe0b8", ec=INK, lw=.8, zorder=12))
    ax.text(x, y + h * 1.6, "0", fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
    ax.text(x + length, y + h * 1.6, label, fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
scalebar(axR, kx0 + 4.0, ky0 + 0.6, 2.0, 1, "2 km  (≈ 1 : 30 000)")

# ---------------- OLD TOWN INSET ----------------
ix0, iy0, ix1, iy1 = INS
base.add_patch(Rectangle((ix0 - .9, iy0 - .9), ix1 - ix0 + 1.8, iy1 - iy0 + 1.8, fc="#00000022", ec="none", zorder=19))
# lighter parchment for inset
inset_img = np.clip(img[int(iy0/H*ny):int(iy1/H*ny), int(ix0/W*nx):int(ix1/W*nx)] * 1.07 + 0.03, 0, 1)
axI = fig.add_axes([ix0 / W, iy0 / H, (ix1 - ix0) / W, (iy1 - iy0) / H], zorder=20)
SI = 25.3   # cm per km in inset (~1:3.950)
icx, icy = km(37.6489, 13.10892)
hw, hh = (ix1 - ix0) / 2 / SI, (iy1 - iy0) / 2 / SI
axI.set_xlim(icx - hw, icx + hw); axI.set_ylim(icy - hh, icy + hh); axI.axis("off")
axI.imshow(inset_img, extent=(icx - hw, icx + hw, icy - hh, icy + hh), origin="lower", zorder=0, aspect="auto")
town = json.load(open("town.json"))["elements"]
# landuse / parks faint
for e in town:
    t = e.get("tags", {})
    if t.get("building"):
        g = [km(p["lat"], p["lon"]) for p in e.get("geometry", [])]
        if len(g) > 2:
            axI.add_patch(Polygon(g, closed=True, fc="#b48a5340", ec=INK, lw=0.45, hatch="////", zorder=2))
plt.rcParams["hatch.color"] = "#7a5a33"
sw = {"primary": 3.2, "secondary": 3.0, "tertiary": 2.6, "unclassified": 2.2, "residential": 1.8, "pedestrian": 1.6, "living_street": 1.6, "service": 1.0, "footway": 0.9, "steps": 0.9, "path": 0.6, "track": 0.8}
for e in town:
    t = e.get("tags", {}); h = t.get("highway")
    if h in sw and "geometry" in e:
        a = np.array([km(p["lat"], p["lon"]) for p in e["geometry"]])
        lw = sw[h]
        ls = (0, (3, 2)) if h in ("footway", "steps", "path", "track") else "-"
        if lw >= 1.6:
            axI.plot(a[:, 0], a[:, 1], color=INK, lw=lw * 2.4, zorder=3, solid_capstyle="round")[0].set_sketch_params(0.4, 50.0, 2.0)
            axI.plot(a[:, 0], a[:, 1], color="#f0e1bb", lw=lw * 1.5, zorder=3.1, solid_capstyle="round")
        else:
            axI.plot(a[:, 0], a[:, 1], color=INK, lw=lw, ls=ls, zorder=3)[0].set_sketch_params(0.4, 50.0, 2.0)
# street names (longest segment per name)
best = {}
for e in town:
    t = e.get("tags", {}); h = t.get("highway")
    if h in ("primary", "secondary", "tertiary", "unclassified", "residential", "pedestrian") and "name" in t and "geometry" in e:
        a = np.array([km(p["lat"], p["lon"]) for p in e["geometry"]])
        L = np.sum(np.hypot(*np.diff(a, axis=0).T))
        if L > best.get(t["name"], (0,))[0]: best[t["name"]] = (L, a)
placed = []
for name, (L, a) in sorted(best.items(), key=lambda kv: -kv[1][0]):
    if L < 0.09: continue
    seg = np.hypot(*np.diff(a, axis=0).T); cum = np.concatenate([[0], np.cumsum(seg)])
    m = L / 2; i = max(0, min(np.searchsorted(cum, m) - 1, len(seg) - 1))
    p0, p1 = a[i], a[i + 1]; mid = p0 + (p1 - p0) * ((m - cum[i]) / max(seg[i], 1e-9))
    if not (icx - hw < mid[0] < icx + hw and icy - hh < mid[1] < icy + hh): continue
    if any(np.hypot(*(mid - q)) < 0.07 for q in placed): continue
    placed.append(mid)
    ang = math.degrees(math.atan2(p1[1] - p0[1], p1[0] - p0[0]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    axI.text(mid[0], mid[1], name, fontproperties=HAND, fontsize=8.5 if L < 0.25 else 10, color="#4b2e18", rotation=ang, rotation_mode="anchor", ha="center", va="center", zorder=6, path_effects=[pe.withStroke(linewidth=2.5, foreground="#f0e1bbcc")])
# footprints along Corso Umberto I
corso = [e for e in town if e.get("tags", {}).get("name") == "Corso Umberto I" and "geometry" in e]
k = 0
for e in corso:
    a = np.array([km(p["lat"], p["lon"]) for p in e["geometry"]])
    for j in range(len(a) - 1):
        p0, p1 = a[j], a[j + 1]; d = p1 - p0; L = np.hypot(*d)
        if L == 0: continue
        u = d / L; nrm = np.array([-u[1], u[0]]); ang = math.degrees(math.atan2(u[1], u[0]))
        for s in np.arange(0, L, 0.028):
            k += 1
            if k % 7: continue
            side = 1 if (k // 7) % 2 else -1
            c = p0 + u * s + nrm * 0.004 * side
            axI.add_patch(Ellipse(c, 0.010, 0.0055, angle=ang, fc=INK + "aa", ec="none", zorder=4))
# inset POIs: pictogram badges, relaxed to avoid overlap, leader line to true position
RI = 0.29 / SI
A_ = np.array([km(la, lo) for _, _, la, lo, _, _ in TOWN]); P_ = A_.copy()
HOUSE_XY = np.array(km(37.65015, 13.11255))
D_ = 2.85 * RI
DV = np.array([D_ * (1.0 if t[1] == "sight" else 1.0) for t in TOWN])
for it in range(400):
    for i in range(len(P_)):
        d = P_[i] - P_; dist = np.hypot(d[:, 0], d[:, 1]); dist[i] = 9
        DD = (DV[i] + DV) / 2
        for j in np.where(dist < DD)[0]:
            v = d[j] / dist[j] if dist[j] > 1e-6 else np.array([math.cos(i), math.sin(i)])
            P_[i] += v * (DD[j] - dist[j]) * 0.25; P_[j] -= v * (DD[j] - dist[j]) * 0.25
        dh = P_[i] - HOUSE_XY; dhn = np.hypot(*dh)
        if False: P_[i] += dh / max(dhn, 1e-6) * (2.6 * RI - dhn) * 0.5
    P_ += (A_ - P_) * 0.02
for i0, (name, cat, lat, lon, src, note) in enumerate(TOWN):
    i = NUM[name]; ax0, ay0 = A_[i0]; x, y = P_[i0]
    if np.hypot(x - ax0, y - ay0) > 0.6 * RI:
        axI.plot([ax0, x], [ay0, y], color=INK, lw=0.8, zorder=9)
        axI.plot(ax0, ay0, "o", ms=3.2, color=INK, zorder=9)
    icon(axI, cat, x, y, RI, z=10, lw=1.0, name=name)
    oo = 0.78 if cat == "sight" else 0.78
    axI.text(x + RI * oo, y - RI * oo, str(i), fontproperties=FELL, fontsize=9.5, color=INK, ha="left", va="top", zorder=12, path_effects=[pe.withStroke(linewidth=2.2, foreground="#f6ecd2")])
# v12: Markierung Haus Via Delfino (OSM w238048681) wieder, ohne Beschriftung
vd = np.array([km(la, lo) for la, lo in [(37.6498581, 13.1123321), (37.6498973, 13.1123192), (37.650011, 13.1123559), (37.6500554, 13.1123741), (37.6500969, 13.1124089), (37.6501256, 13.1124503), (37.6501852, 13.1125477), (37.6502711, 13.112779), (37.650344, 13.1130567), (37.6504297, 13.113303), (37.6505652, 13.1136541)]])
axI.plot(vd[:, 0], vd[:, 1], color=RED, lw=3.2, alpha=.55, zorder=8, solid_capstyle="round")
seg_ = np.hypot(*np.diff(vd, axis=0).T); cum_ = np.r_[0, np.cumsum(seg_)]; m_ = cum_[-1] / 2; k_ = np.searchsorted(cum_, m_) - 1
hx_, hy_ = vd[k_] + (vd[k_ + 1] - vd[k_]) * (m_ - cum_[k_]) / seg_[k_]
axI.plot(hx_, hy_, marker=HOUSE, ms=26, mfc=RED, mec="#1e120a", mew=1.6, zorder=12)
# inset frame & labels
for d, l in ((0, 2.4), (0.45, 0.9)):
    base.add_patch(Rectangle((ix0 + d, iy0 + d), ix1 - ix0 - 2 * d, iy1 - iy0 - 2 * d, fill=False, ec=INK, lw=l, zorder=30))
fig.text((ix0 + 1.4) / W, (iy1 - 1.2) / H, "Centro Storico", fontproperties=FELL, fontsize=34, color=INK, ha="left", va="top", zorder=40, path_effects=pe_halo)
fig.text((ix0 + 1.5) / W, (iy1 - 3.6) / H, "die Altstadt im Detail · Maßstab ≈ 1 : 4 000", fontproperties=HAND, fontsize=13, color=INK, ha="left", va="top", zorder=40)
# inset scale bar (100 m) and compass in bottom right of inset
sbx = icx + hw - 0.33; sby = icy - hh + 0.06
for j in range(4):
    axI.add_patch(Rectangle((sbx + j * 0.05, sby), 0.05, 0.008, fc=INK if j % 2 == 0 else "#efe0b8", ec=INK, lw=.8, zorder=12))
axI.text(sbx, sby + 0.014, "0", fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
axI.text(sbx + 0.2, sby + 0.014, "200 m", fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
compass(axI, icx + hw - 0.07, icy + hh - 0.12, 0.05)

# ---------------- ADRAGNA CALLOUT (Umland NE, hidden under the old-town plan) ----------------
cx0, cy0, cx1, cy1 = 84.3, 27.0, 103.7, 46.6
base.add_patch(Rectangle((cx0 - .7, cy0 - .7), cx1 - cx0 + 1.4, cy1 - cy0 + 1.4, fc="#00000018", ec="none", zorder=19))
base.add_patch(Rectangle((cx0, cy0), cx1 - cx0, cy1 - cy0, fc="#efe0b8", ec="none", zorder=19.5))
mx0_, my0_, mx1_, my1_ = cx0 + 0.6, cy0 + 0.6, cx1 - 0.6, cy1 - 3.3
axA = fig.add_axes([mx0_ / W, my0_ / H, (mx1_ - mx0_) / W, (my1_ - my0_) / H], zorder=20)
SA = 6.6
acx, acy = km(37.6677, 13.1335)
ahw, ahh = (mx1_ - mx0_) / 2 / SA, (my1_ - my0_) / 2 / SA
axA.set_xlim(acx - ahw, acx + ahw); axA.set_ylim(acy - ahh, acy + ahh); axA.axis("off")
axA.imshow(np.clip(img[int(my0_/H*ny):int(my1_/H*ny), int(mx0_/W*nx):int(mx1_/W*nx)] * 1.07 + 0.03, 0, 1), extent=(acx - ahw, acx + ahw, acy - ahh, acy + ahh), origin="lower", zorder=0, aspect="auto")
adr = json.load(open("adragna.json"))["elements"]
for e in adr:
    t = e.get("tags", {})
    if t.get("building") and "geometry" in e:
        g = [km(p["lat"], p["lon"]) for p in e["geometry"]]
        if len(g) > 2: axA.add_patch(Polygon(g, closed=True, fc="#b48a5360", ec=INK, lw=0.4, zorder=2))
swA = {"primary": 2.6, "secondary": 2.4, "tertiary": 2.2, "unclassified": 1.6, "residential": 1.0, "service": 0.6, "track": 0.6, "path": 0.5, "footway": 0.5}
for e in adr:
    t = e.get("tags", {}); h = t.get("highway")
    if h in swA and "geometry" in e:
        a = np.array([km(p["lat"], p["lon"]) for p in e["geometry"]])
        if swA[h] >= 1.6:
            axA.plot(a[:, 0], a[:, 1], color=INK, lw=swA[h] * 2.2, zorder=3, solid_capstyle="round")[0].set_sketch_params(0.4, 50.0, 2.0)
            axA.plot(a[:, 0], a[:, 1], color="#f0e1bb", lw=swA[h] * 1.3, zorder=3.1, solid_capstyle="round")
        else:
            axA.plot(a[:, 0], a[:, 1], color=INK, lw=swA[h], ls="-" if h == "residential" else (0, (3, 2)), zorder=3)[0].set_sketch_params(0.4, 50.0, 2.0)
# SP69 label
sp = [e for e in adr if e.get("tags", {}).get("ref") == "SP69" and "geometry" in e]
if sp:
    a = np.array([km(p["lat"], p["lon"]) for p in max(sp, key=lambda e: len(e["geometry"]))["geometry"]]); m = len(a) // 2
    ang = math.degrees(math.atan2(a[m + 1][1] - a[m][1], a[m + 1][0] - a[m][0]))
    ang = ang - 180 if ang > 90 else (ang + 180 if ang < -90 else ang)
    axA.text(*a[m], "SP 69", fontproperties=HAND, fontsize=11, clip_on=True, rotation=ang, rotation_mode="anchor", ha="center", va="center", color="#4b2e18", zorder=6, path_effects=[pe.withStroke(linewidth=2.5, foreground="#f0e1bbcc")])
RA = 0.36 / SA
AA = np.array([km(la, lo) for _, _, la, lo, _, _ in ADRAGNA]); PA = AA.copy()
for it in range(300):
    for i in range(len(PA)):
        d = PA[i] - PA; dist = np.hypot(d[:, 0], d[:, 1]); dist[i] = 9
        for j in np.where(dist < 2.7 * RA)[0]:
            v = d[j] / max(dist[j], 1e-6); PA[i] += v * (2.7 * RA - dist[j]) * .25; PA[j] -= v * (2.7 * RA - dist[j]) * .25
    PA += (AA - PA) * 0.02
aoffs = {"Antico Mulino": (-1, "right"), "Il Duca": (1, "left"), "La Pergola": (-1, "right"), "La Panoramica": (-1, "right"), "Massaria Ruvettu (Rest. & Käserei)": (-1, "right"),
         "Caseificio Pasini": (1, "left"), "ARD Discount": (1, "left"), "Le Primizie di Zabut": (1, "left")}
for i, (name, cat, lat, lon, src, note) in enumerate(ADRAGNA):
    (ax0, ay0), (x, y) = AA[i], PA[i]
    if np.hypot(x - ax0, y - ay0) > 0.5 * RA:
        axA.plot([ax0, x], [ay0, y], color=INK, lw=0.8, zorder=9); axA.plot(ax0, ay0, "o", ms=3.2, color=INK, zorder=9)
    icon(axA, cat, x, y, RA, z=10, lw=1.1)
    sgn, al = aoffs.get(name, (1, "left"))
    axA.text(x + sgn * RA * 1.25, y, f"{RLET[name]} {name}", fontproperties=HAND, fontsize=11.5, color=INK, ha=al, va="center", zorder=12, path_effects=pe_halo)
# scale bar 500 m + north
sbx_ = acx + ahw - 0.75; sby_ = acy - ahh + 0.12
for j in range(4):
    axA.add_patch(Rectangle((sbx_ + j * 0.125, sby_), 0.125, 0.03, fc=INK if j % 2 == 0 else "#efe0b8", ec=INK, lw=.8, zorder=12))
axA.text(sbx_, sby_ + 0.05, "0", fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
axA.text(sbx_ + 0.5, sby_ + 0.05, "500 m", fontproperties=HAND, fontsize=10, ha="center", color=INK, zorder=12)
compass(axA, acx + ahw - 0.17, acy + ahh - 0.33, 0.14)
for d, l in ((0, 2.0), (0.35, 0.8)):
    base.add_patch(Rectangle((cx0 + d, cy0 + d), cx1 - cx0 - 2 * d, cy1 - cy0 - 2 * d, fill=False, ec=INK, lw=l, zorder=30))
base.plot([cx0 + 0.35, cx1 - 0.35], [my1_ + 0.05] * 2, color=INK, lw=0.8, zorder=30)
fig.text((cx0 + 1.0) / W, (cy1 - 0.8) / H, "Contrada Adragna & Cicala", fontproperties=FELL, fontsize=24, color=INK, ha="left", va="top", zorder=40)
fig.text((cx0 + 1.05) / W, (cy1 - 2.15) / H, "Umland ≈ 2 km nordöstlich der Altstadt (im Hauptplan unter dem Altstadtplan) · Maßstab ≈ 1 : 15 000", fontproperties=HAND, fontsize=10, color=INK, ha="left", va="top", zorder=40)
# ---------------- TITLE CARTOUCHE ----------------
tx0, ty0, tx1, ty1 = 84.0, 49.6, 117.2, 57.6
base.add_patch(FancyBboxPatch((tx0, ty0), tx1 - tx0, ty1 - ty0, boxstyle="round,pad=0.3,rounding_size=1.2", fc="#efdfb6", ec=INK, lw=2.2, zorder=31))
base.add_patch(FancyBboxPatch((tx0 + .5, ty0 + .5), tx1 - tx0 - 1, ty1 - ty0 - 1, boxstyle="round,pad=0.2,rounding_size=1", fill=False, ec=INK, lw=.8, zorder=31))
base.text((tx0 + tx1) / 2, ty0 + 5.3, "Sambuca di Sicilia", fontproperties=FELL, fontsize=62, color=INK, ha="center", va="center", zorder=32)
base.text((tx0 + tx1) / 2, ty0 + 2.0, "Altstadt & Terre Sicane · Weingüter und Erzeuger rund um den Lago Arancio", fontproperties=HAND, fontsize=14, color=INK, ha="center", va="center", zorder=32)

from wappen import wappen
wappen(base, tx0 + 2.6, (ty0 + ty1) / 2 + 0.1, 6.2, z=33)
snail(base, tx1 - 3.6, ty0 + 4.6, 2.2, z=33, lw=1.6)
base.text(tx1 - 3.6, ty0 + 2.55, "Babbalucia", fontproperties=FELLI, fontsize=13, color=INK, ha="center", va="center", zorder=33)
# ---------------- LEGEND ----------------
LX0, LY0, LX1, LY1 = 1.5, 0.9, 118.5, 12.3
base.add_patch(Rectangle((LX0, LY0), LX1 - LX0, LY1 - LY0, fc="#efe0b8cc", ec=INK, lw=1.8, zorder=31))
base.add_patch(Rectangle((LX0 + .35, LY0 + .35), LX1 - LX0 - .7, LY1 - LY0 - .7, fill=False, ec=INK, lw=.7, zorder=31))
base.text(LX0 + 1.2, LY1 - 0.9, "Legende", fontproperties=FELL, fontsize=30, color=INK, ha="left", va="top", zorder=32)
# --- topo / special key (first column, under title)
kx_ = LX0 + 1.5
def krow(j): return LY1 - 2.45 - j * 1.08
KF = 11
snail(base, kx_, krow(0.5) + 0.05, 0.42, z=33, lw=0.9)
base.text(kx_ + 0.8, krow(0.5), "Babbalucia – die Schnecke,\nSymbol Sambucas", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33, linespacing=0.9)
base.plot(kx_, krow(2), marker=TOWER, ms=15, mfc="#b9a06a", mec=INK, mew=1.2, zorder=33)
base.text(kx_ + 0.8, krow(2), "Burg / Turm", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.add_patch(Rectangle((kx_ - 0.45, krow(3) - 0.4), 0.9, 0.8, fc="#4b5a2f26", ec="#4b5a2f90", lw=.6, zorder=33))
for dx_, dy_ in ((-0.2, -0.12), (0.2, -0.12), (0, 0.18)):
    base.plot([kx_ + dx_] * 2, [krow(3) + dy_ - 0.2, krow(3) + dy_ - 0.02], color=INK, lw=.7, zorder=33)
    base.plot(kx_ + dx_, krow(3) + dy_ + 0.03, "o", ms=4.2, mfc="#6f7f3f", mec=INK, mew=.5, zorder=34)
base.text(kx_ + 0.8, krow(3), "Wald · Gebüsch", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.add_patch(Rectangle((kx_ - 0.45, krow(4) - 0.4), 0.9, 0.8, fc="#6d5a2b18", ec="#6d5a2b70", lw=.6, hatch="||||", zorder=33))
base.text(kx_ + 0.8, krow(4), "Weinberg  ·  ", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.add_patch(Rectangle((kx_ + 4.25, krow(4) - 0.4), 0.9, 0.8, fc="#5d6a3218", ec="#5d6a3270", lw=.6, hatch="o.", zorder=33))
base.text(kx_ + 5.35, krow(4), "Obst/Oliven", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
for o in (-0.25, 0, 0.25):
    xs_ = np.linspace(kx_ - 0.45, kx_ + 0.45, 12); base.plot(xs_, krow(5) + o + 0.06 * np.sin(xs_ * 9), color="#4a2f17", lw=0.5, zorder=33)
base.text(kx_ + 0.8, krow(5), "Höhenlinien 50 m · Hangschraffur", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.plot(kx_, krow(6), marker="^", ms=8, color=INK, mfc="#cbb07a", zorder=33)
base.text(kx_ + 0.8, krow(6), "Gipfel / Höhenpunkt (m)", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.annotate("", xy=(kx_ - 0.5, krow(7)), xytext=(kx_ + 0.5, krow(7)), arrowprops=dict(arrowstyle="-|>", color=RED, lw=1.6), zorder=33)
base.text(kx_ + 0.8, krow(7), "Ziel außerhalb der Karte", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.plot([kx_ - 0.5, kx_ + 0.5], [krow(7.85)] * 2, color=RED, lw=1.3, ls=(0, (2.5, 2)), zorder=33)
base.text(kx_ + 0.8, krow(7.85), "Route nach Palermo", fontproperties=HAND, fontsize=KF, color=INK, va="center", zorder=33)
base.plot([LX0 + 12.3] * 2, [LY0 + 0.8, LY1 - 0.8], color=INK, lw=0.6, zorder=33)

# --- grouped, numbered list (flow layout)
items = []   # (kind, cat, text)
seen = []
for name, cat, lat, lon, src, note in TOWN:
    if cat not in seen: seen.append(cat)
for c in seen:
    items.append(("H", c, CATN[c]))
    for name, cat, lat, lon, src, note in sorted([t for t in TOWN if t[1] == c], key=lambda t: NUM[t[0]]):
        items.append(("E", c, f"{NUM[name]}", name + (" *" if note == "*" else "")))
items.append(("U", None, "Umland  (Buchstaben)"))
rall = REGION + ADRAGNA
for c in UORD:
    ent = [(RLET[n], n, f) for (n, cc, la, lo, sr, f) in rall if cc == c]
    if not ent: continue
    items.append(("H", c, CATN[c] if c != "dairy" else "Käserei · Agriturismo"))
    for L_, n, f in ent: items.append(("E", c, L_, n + (" *" if f == "*" else "")))
ROW = 0.705; Y0 = LY1 - 0.95; NROW = int((Y0 - (LY0 + 1.15)) / ROW) + 1
cols = [[]]
for k, it in enumerate(items):
    col = cols[-1]
    if len(col) >= NROW or (it[0] in ("H", "U") and len(col) >= NROW - 1):
        cols.append([]); col = cols[-1]
    col.append(it)
X0 = LX0 + 12.9; CW = (LX1 - 0.5 - X0) / len(cols)
print("legend columns", len(cols), "rows", NROW, "colw", round(CW, 2))
rend = fig.canvas.get_renderer()
for ci, col in enumerate(cols):
    xc = X0 + ci * CW
    for ri, it in enumerate(col):
        yc = Y0 - ri * ROW
        if it[0] == "U":
            base.text(xc, yc, it[2], fontproperties=FELL, fontsize=14, color=RED, va="center", zorder=33)
        elif it[0] == "H":
            icon(base, it[1], xc + 0.3, yc, 0.30, z=33, lw=0.9)
            t = base.text(xc + 0.8, yc, it[2], fontproperties=FELL, fontsize=12, color=COL.get(it[1], INK), va="center", zorder=33)
            fs = 12
            while fs > 8 and t.get_window_extent(rend).width / fig.dpi * 2.54 > CW - 1.0:
                fs -= 0.5; t.set_fontsize(fs)
        else:
            base.text(xc + 0.55, yc, it[2], fontproperties=FELL, fontsize=10.5, color=INK, ha="right", va="center", zorder=33)
            t = base.text(xc + 0.75, yc, it[3], fontproperties=HAND, fontsize=10.5, color=INK, va="center", zorder=33)
            fs = 10.5
            while fs > 7.5:
                bb = t.get_window_extent(rend); wcm = bb.width / fig.dpi * 2.54
                if wcm <= CW - 0.95: break
                fs -= 0.5; t.set_fontsize(fs)
base.text(LX1 - 0.8, LY0 + 0.5, "Kartengrundlage © OpenStreetMap-Mitwirkende (ODbL) · Relief: SRTM 30 m (NASA/USGS) · Geschäftsdaten: OSM, restaurantguru, exa.ai Places, Branchenverzeichnisse, Comune di Sambuca · Stand Okt. 2026 · * nur eine Quelle – bitte vor Ort prüfen",
          fontproperties=HAND, fontsize=8, color=INK, ha="right", va="bottom", zorder=33)
# outer border
frame(base, 0.5, 0.4, W - 0.5, H - 0.4, lw=2.6, z=35)
fig.savefig(OUT, dpi=DPI)
print("saved", OUT)
