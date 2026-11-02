import math, numpy as np
from matplotlib.patches import Polygon, Circle, Ellipse, Rectangle, Wedge, Arc
INK = "#2a180c"
COL = {"rest": "#7c2216", "bar": "#6b1f3a", "cafe": "#7a4a1c", "pastry": "#b0642a", "bakery": "#a8742a", "grocery": "#3f5626",
       "butcher": "#8b2f2a", "dairy": "#b08a1e", "oil": "#55702a", "tabacchi": "#1f3550", "pharmacy": "#2f7a3a", "hair": "#6a3d6a",
       "fashion": "#2e4a6a", "household": "#3d6e6e", "hardware": "#5a4a3a", "shop": "#2e5a7a", "workshop": "#454545", "craft": "#6a5040",
       "fuel": "#8a5a1a", "shelter": "#7a4a2a", "wine": "#6b1f3a", "works": "#5a4a3a", "sight": "#3a2414",
       "furniture": "#6a4628", "agri": "#4f6b22", "waste": "#2f5d4a", "gallery": "#7a3a5a", "hotel": "#2f4f6f"}
SK = (0.5, 25.0, 2.0)

def _sk(a):
    try: a.set_sketch_params(*SK)
    except Exception: pass
    return a

def icon(ax, cat, x, y, r, z=10, lw=1.0, badge=True, name=None):
    """draw pictogram centred at x,y; r = badge radius (data units)."""
    T = lambda pts: [(x + u * r, y + v * r) for u, v in pts]
    L = lambda pts, w=1.0, c=INK: _sk(ax.plot(*zip(*T(pts)), color=c, lw=lw * w, zorder=z + 1, solid_capstyle="round", solid_joinstyle="round")[0])
    P = lambda pts, fc=INK, ec=INK, w=0.8, zz=0: ax.add_patch(_sk(Polygon(T(pts), closed=True, fc=fc, ec=ec, lw=lw * w, zorder=z + 1 + zz, joinstyle="round")))
    C = lambda cx, cy, rr, fc=INK, ec=INK, w=0.8: ax.add_patch(Circle((x + cx * r, y + cy * r), rr * r, fc=fc, ec=ec, lw=lw * w, zorder=z + 1.2))
    col = COL.get(cat, INK)
    if False and cat == "sight" and name:
        return sight_art(ax, name, x, y, r * 1.9, z, lw)
    if cat == "sight":
        ang = np.linspace(math.pi / 2, math.pi / 2 + 2 * math.pi, 11)[:-1]
        pts = [((1.0 if k % 2 == 0 else 0.42) * math.cos(a), (1.0 if k % 2 == 0 else 0.42) * math.sin(a)) for k, a in enumerate(ang)]
        P([(u * 1.15, v * 1.15) for u, v in pts], fc="#c9a64a", ec=INK, w=1.2)
        return
    if badge:
        ax.add_patch(Circle((x, y), r, fc="#f6ecd2", ec=col, lw=lw * 2.0, zorder=z))
        ax.add_patch(Circle((x, y), r * 0.86, fill=False, ec=col, lw=lw * 0.6, zorder=z))
    if cat == "rest":      # fork + knife
        L([(-0.32, -0.62), (-0.32, 0.12)], 1.6)
        for u in (-0.47, -0.32, -0.17): L([(u, 0.12), (u, 0.6)], 0.9)
        L([(-0.47, 0.12), (-0.17, 0.12)], 1.1)
        P([(0.24, -0.02), (0.24, 0.62), (0.44, 0.42), (0.44, -0.02)], fc=INK)
        L([(0.33, -0.62), (0.33, -0.02)], 1.8)
    elif cat == "wine":    # grapes + leaf
        P([(-0.05, 0.42), (0.3, 0.68), (0.55, 0.45), (0.25, 0.3)], fc="#55702a", ec=INK, w=0.8)
        L([(-0.02, 0.4), (-0.12, 0.62)], 1.2)
        for cx, cy in ((-0.3, 0.22), (0.0, 0.22), (0.3, 0.22), (-0.15, -0.04), (0.15, -0.04), (-0.3, -0.04), (0.3, -0.04), (0.0, -0.3), (-0.15, -0.3), (0.15, -0.3), (0.0, -0.55)):
            C(cx, cy, 0.14, fc="#6b2a5a", w=0.7)
    elif cat == "bar":   # wine glass
        th = np.linspace(math.pi, 2 * math.pi, 14)
        bowl = [(0.36 * math.cos(t), 0.30 + 0.38 * math.sin(t)) for t in th]
        P([(-0.36, 0.62)] + bowl + [(0.36, 0.62)], fc="#f6ecd2", ec=INK, w=1.1)
        th2 = np.linspace(math.pi * 1.05, 1.95 * math.pi, 10)
        P([(0.34 * math.cos(t), 0.30 + 0.36 * math.sin(t)) for t in th2] + [(0.33, 0.24), (-0.33, 0.24)], fc="#7a1a2a", ec="none", w=0)
        L([(0, -0.08), (0, -0.55)], 1.3); L([(-0.27, -0.6), (0.27, -0.6)], 1.4)
        if cat == "wine":  # grapes instead? add small grapes cluster right
            pass
    elif cat == "cafe":    # coffee cup
        P([(-0.48, 0.18), (0.28, 0.18), (0.24, -0.25), (0.12, -0.38), (-0.32, -0.38), (-0.44, -0.25)], fc=INK)
        ax.add_patch(_sk(Arc((x + 0.32 * r, y - 0.04 * r), 0.32 * r, 0.32 * r, theta1=-90, theta2=90, ec=INK, lw=lw * 1.3, zorder=z + 1)))
        L([(-0.6, -0.5), (0.42, -0.5)], 1.4)
        for u in (-0.28, -0.04):
            yy = np.linspace(0.28, 0.66, 8); L([(u + 0.06 * math.sin(k * 1.6), v) for k, v in enumerate(yy)], 0.8)
    elif cat == "pastry":  # cake with cherry
        P([(-0.55, -0.5), (0.55, -0.5), (0.55, -0.05), (-0.55, -0.05)], fc="#e6c58a", ec=INK, w=1.1)
        P([(-0.38, -0.05), (0.38, -0.05), (0.38, 0.3), (-0.38, 0.3)], fc="#f3dcb0", ec=INK, w=1.1)
        L([(-0.55, -0.27), (0.55, -0.27)], 0.7)
        C(0, 0.44, 0.13, fc="#9a1f1f")
    elif cat == "bakery":  # loaf of bread
        th = np.linspace(0, math.pi, 16)
        P([(0.6 * math.cos(t), -0.25 + 0.55 * math.sin(t)) for t in th] + [(-0.6, -0.32), (0.6, -0.32)], fc="#c8873a", ec=INK, w=1.1)
        for u in (-0.3, 0.0, 0.3): L([(u - 0.1, 0.0), (u + 0.12, 0.22)], 0.9)
    elif cat == "grocery": # basket
        ax.add_patch(_sk(Arc((x, y + 0.02 * r), 0.8 * r, 0.9 * r, theta1=0, theta2=180, ec=INK, lw=lw * 1.4, zorder=z + 1)))
        P([(-0.62, 0.02), (0.62, 0.02), (0.44, -0.55), (-0.44, -0.55)], fc="#c99a55", ec=INK, w=1.1)
        for u in (-0.25, 0.0, 0.25): L([(u * 1.3, 0.02), (u, -0.55)], 0.6)
        L([(-0.55, -0.2), (0.55, -0.2)], 0.6)
    elif cat == "butcher": # cleaver
        P([(-0.55, -0.05), (0.25, -0.05), (0.25, 0.5), (-0.55, 0.5)], fc="#d8d0c0", ec=INK, w=1.1)
        C(-0.38, 0.33, 0.07, fc="#f6ecd2")
        P([(0.25, 0.08), (0.62, -0.3), (0.5, -0.42), (0.18, -0.05)], fc=INK)
    elif cat == "dairy":   # cheese wedge with holes
        P([(-0.6, -0.4), (0.6, -0.4), (0.6, 0.15), (-0.6, -0.05)], fc="#e8c35a", ec=INK, w=1.1)
        P([(-0.6, -0.05), (0.6, 0.15), (0.25, 0.48)], fc="#f2d679", ec=INK, w=1.1)
        for cx, cy, rr in ((-0.25, -0.2, 0.09), (0.2, -0.12, 0.11), (0.42, -0.3, 0.06)): C(cx, cy, rr, fc="#b88f22", w=0.5)
    elif cat == "oil":     # oil drop + olive
        th = np.linspace(-math.pi * 0.25, math.pi * 1.25, 18)
        P([(0, 0.62)] + [(0.34 * math.cos(t) - 0.1, -0.12 + 0.34 * math.sin(-t) * 1.0) for t in th[::-1]], fc="#9fae2e", ec=INK, w=1.1)
        ax.add_patch(_sk(Ellipse((x + 0.4 * r, y + 0.25 * r), 0.26 * r, 0.4 * r, angle=-30, fc="#3f5626", ec=INK, lw=lw * 0.8, zorder=z + 1)))
    elif cat == "tabacchi":  # T sign
        P([(-0.5, -0.55), (0.5, -0.55), (0.5, 0.55), (-0.5, 0.55)], fc="#1f3550", ec=INK, w=1.0)
        P([(-0.34, 0.38), (0.34, 0.38), (0.34, 0.22), (0.08, 0.22), (0.08, -0.42), (-0.08, -0.42), (-0.08, 0.22), (-0.34, 0.22)], fc="#f6ecd2", ec="#f6ecd2", w=0.3)
    elif cat == "pharmacy":  # cross
        a, b = 0.17, 0.55
        P([(-a, b), (a, b), (a, a), (b, a), (b, -a), (a, -a), (a, -b), (-a, -b), (-a, -a), (-b, -a), (-b, a), (-a, a)], fc="#2f8a3a", ec=INK, w=1.0)
    elif cat == "hair":    # scissors
        L([(-0.22, -0.25), (0.35, 0.62)], 1.5); L([(0.22, -0.25), (-0.35, 0.62)], 1.5)
        C(-0.28, -0.42, 0.17, fc="#f6ecd2", w=1.2); C(0.28, -0.42, 0.17, fc="#f6ecd2", w=1.2)
        C(0, 0.07, 0.05)
    elif cat == "fashion": # T-shirt
        P([(-0.25, 0.5), (-0.62, 0.3), (-0.48, 0.05), (-0.34, 0.12), (-0.34, -0.55), (0.34, -0.55), (0.34, 0.12), (0.48, 0.05), (0.62, 0.3), (0.25, 0.5), (0.12, 0.38), (-0.12, 0.38)], fc="#5a7aa0", ec=INK, w=1.1)
    elif cat == "household":  # cooking pot
        P([(-0.45, 0.18), (0.45, 0.18), (0.4, -0.45), (-0.4, -0.45)], fc="#7a9a9a", ec=INK, w=1.1)
        L([(-0.62, 0.1), (-0.45, 0.1)], 1.5); L([(0.45, 0.1), (0.62, 0.1)], 1.5)
        L([(-0.5, 0.28), (0.5, 0.28)], 1.4); C(0, 0.4, 0.08)
    elif cat == "hardware":   # hammer
        P([(-0.05, 0.25), (0.08, 0.25), (0.08, -0.62), (-0.05, -0.62)], fc="#b48a53", ec=INK, w=0.9)
        P([(-0.45, 0.25), (0.45, 0.25), (0.45, 0.5), (-0.3, 0.55), (-0.5, 0.42)], fc=INK)
    elif cat == "gallery":  # framed picture on easel-like frame
        P([(-0.58, -0.45), (0.58, -0.45), (0.58, 0.5), (-0.58, 0.5)], fc="#c9a64a", ec=INK, w=1.1)
        P([(-0.42, -0.3), (0.42, -0.3), (0.42, 0.35), (-0.42, 0.35)], fc="#f6ecd2", ec=INK, w=0.7, zz=0.1)
        P([(-0.42, -0.3), (-0.12, 0.08), (0.05, -0.1), (0.22, 0.12), (0.42, -0.12), (0.42, -0.3)], fc="#7a3a5a", ec=INK, w=0.5, zz=0.2)
        C(0.22, 0.24, 0.07, fc="#b0642a")
    elif cat == "hotel":   # bed
        P([(-0.6, -0.35), (0.6, -0.35), (0.6, -0.05), (-0.6, -0.05)], fc="#a8c0d0", ec=INK, w=1.0)
        P([(-0.6, -0.05), (-0.6, 0.45), (-0.48, 0.45), (-0.48, -0.05)], fc=INK, ec=INK, w=0.6)
        P([(-0.44, -0.05), (-0.1, -0.05), (-0.1, 0.15), (-0.44, 0.15)], fc="#f6ecd2", ec=INK, w=0.6, zz=0.1)
        L([(-0.6, -0.35), (-0.6, -0.5)], 1.2); L([(0.6, -0.35), (0.6, -0.5)], 1.2)
    elif cat == "shop":    # shopping bag
        P([(-0.45, 0.25), (0.45, 0.25), (0.5, -0.55), (-0.5, -0.55)], fc="#a8c0d0", ec=INK, w=1.1)
        ax.add_patch(_sk(Arc((x, y + 0.25 * r), 0.5 * r, 0.6 * r, theta1=0, theta2=180, ec=INK, lw=lw * 1.3, zorder=z + 1)))
    elif cat == "workshop":  # wrench
        ang = math.radians(45); ca, sa = math.cos(ang), math.sin(ang)
        rot = lambda pts: [(u * ca - v * sa, u * sa + v * ca) for u, v in pts]
        P(rot([(-0.55, -0.09), (0.3, -0.09), (0.3, 0.09), (-0.55, 0.09)]), fc=INK)
        th = np.linspace(0.6, 2 * math.pi - 0.6, 16)
        P(rot([(0.42 + 0.26 * math.cos(t), 0.26 * math.sin(t)) for t in th] + [(0.42 + 0.1, -0.08), (0.42 - 0.04, -0.08), (0.42 - 0.04, 0.08), (0.42 + 0.1, 0.08)]), fc=INK)
        C(-0.55 * ca, -0.55 * sa, 0.06, fc="#f6ecd2", w=0.4)
    elif cat in ("craft", "works"):  # gear
        n = 8; pts = []
        for k in range(n * 4):
            a = 2 * math.pi * k / (n * 4); rr = 0.58 if (k % 4) in (1, 2) else 0.42
            pts.append((rr * math.cos(a), rr * math.sin(a)))
        P(pts, fc="#6a5a48", ec=INK, w=1.0); C(0, 0, 0.16, fc="#f6ecd2")
    elif cat == "fuel":    # fuel pump
        P([(-0.45, -0.58), (0.15, -0.58), (0.15, 0.55), (-0.45, 0.55)], fc="#a05a1a", ec=INK, w=1.0)
        P([(-0.35, 0.15), (0.05, 0.15), (0.05, 0.42), (-0.35, 0.42)], fc="#f6ecd2", ec=INK, w=0.6, zz=0.1)
        L([(0.15, 0.4), (0.4, 0.4), (0.46, 0.3), (0.46, -0.28), (0.36, -0.36)], 1.2)
        P([(0.3, -0.32), (0.44, -0.32), (0.44, -0.55), (0.3, -0.55)], fc=INK)
    elif cat == "shelter": # paw
        P([(-0.32, -0.05), (0.32, -0.05), (0.42, -0.35), (0.2, -0.55), (-0.2, -0.55), (-0.42, -0.35)], fc=INK)
        for cx, cy in ((-0.45, 0.2), (-0.17, 0.45), (0.17, 0.45), (0.45, 0.2)):
            ax.add_patch(Ellipse((x + cx * r, y + cy * r), 0.24 * r, 0.32 * r, fc=INK, ec=INK, lw=lw * .5, zorder=z + 1))
    elif cat == "furniture":  # armchair / sofa
        P([(-0.5, -0.05), (0.5, -0.05), (0.5, 0.5), (-0.5, 0.5)], fc="#a8784a", ec=INK, w=1.0)
        P([(-0.62, -0.38), (0.62, -0.38), (0.62, 0.12), (0.42, 0.12), (0.42, -0.08), (-0.42, -0.08), (-0.42, 0.12), (-0.62, 0.12)], fc="#8a5a32", ec=INK, w=1.0, zz=0.1)
        L([(-0.5, -0.38), (-0.5, -0.58)], 1.4); L([(0.5, -0.38), (0.5, -0.58)], 1.4)
    elif cat == "agri":    # sprout in soil
        P([(-0.6, -0.42), (0.6, -0.42), (0.5, -0.6), (-0.5, -0.6)], fc="#7a5a32", ec=INK, w=0.9)
        L([(0, -0.42), (0, 0.25)], 1.6)
        P([(0, 0.0), (-0.25, 0.08), (-0.52, 0.32), (-0.28, 0.4), (-0.06, 0.22)], fc="#6f9a2e", ec=INK, w=0.9)
        P([(0, 0.2), (0.22, 0.32), (0.5, 0.62), (0.2, 0.62), (0.04, 0.42)], fc="#6f9a2e", ec=INK, w=0.9)
    elif cat == "waste":   # bin with lid + recycling arrows hint
        P([(-0.4, 0.3), (0.4, 0.3), (0.32, -0.6), (-0.32, -0.6)], fc="#5f8a6a", ec=INK, w=1.1)
        P([(-0.52, 0.32), (0.52, 0.32), (0.52, 0.44), (-0.52, 0.44)], fc=INK)
        P([(-0.12, 0.44), (0.12, 0.44), (0.12, 0.56), (-0.12, 0.56)], fc=INK)
        for u in (-0.16, 0.0, 0.16): L([(u, 0.18), (u * 0.85, -0.48)], 0.8, c="#f6ecd2")


# ---------- v10: gezeichnete Sehenswürdigkeiten (Micro-Macro-Vignetten, reine Vektorzeichnung) ----------
WALL, ROOF, DARK, PAPER = "#d9d3c4", "#8a8478", "#151515", "#ffffff"
def sight_art(ax, name, x, y, r, z=10, lw=1.0):
    T = lambda pts: [(x + u * r, y + v * r) for u, v in pts]
    def P(pts, fc=WALL, w=0.9, zz=0.0):
        ax.add_patch(Polygon(T(pts), closed=True, fc=fc, ec=DARK, lw=lw * w, zorder=z + 1 + zz, joinstyle="round"))
    def R(x0, y0, x1, y1, fc=WALL, w=0.9, zz=0.0): P([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fc, w, zz)
    def L(pts, w=0.8, zz=0.3):
        ax.plot(*zip(*T(pts)), color=DARK, lw=lw * w, zorder=z + 1 + zz, solid_capstyle="round")
    def C(cx, cy, rr, fc=DARK, w=0.6, zz=0.3):
        ax.add_patch(Circle((x + cx * r, y + cy * r), rr * r, fc=fc, ec=DARK, lw=lw * w, zorder=z + 1 + zz))
    def arch(cx, y0, wdt, h, fc=DARK, zz=0.3):
        th = np.linspace(math.pi, 0, 12); hw = wdt / 2; ys = y0 + h - hw
        P([(cx - hw, y0)] + [(cx + hw * math.cos(t), ys + hw * math.sin(t)) for t in th] + [(cx + hw, y0)], fc, 0.5, zz)
    # Kachel
    ax.add_patch(Polygon(T([(-1, -0.82), (1, -0.82), (1, 0.98), (-1, 0.98)]), closed=True, fc=PAPER, ec=DARK, lw=lw * 1.3, zorder=z))
    L([(-0.9, -0.62), (0.9, -0.62)], 1.0, 0.1)          # Bodenlinie
    n = name
    if n.startswith("Chiesa Madre"):          # Kirche mit Glockenturm
        R(-0.65, -0.62, 0.2, 0.15); P([(-0.72, 0.15), (0.27, 0.15), (-0.22, 0.48)], ROOF)
        R(0.2, -0.62, 0.6, 0.62); P([(0.15, 0.62), (0.65, 0.62), (0.4, 0.88)], ROOF)
        arch(0.4, 0.22, 0.18, 0.28); arch(-0.22, -0.62, 0.26, 0.5); C(-0.22, 0.27, 0.07, PAPER)
        L([(-0.22, 0.48), (-0.22, 0.62)], 1.0); L([(-0.29, 0.56), (-0.15, 0.56)], 1.0)
    elif n.startswith("Santuario"):           # Kirche mit Kuppel
        R(-0.7, -0.62, 0.7, 0.1); P([(-0.78, 0.1), (0.78, 0.1), (0, 0.38)], ROOF)
        R(0.25, 0.05, 0.6, 0.35); th = np.linspace(0, math.pi, 12)
        P([(0.425 + 0.2 * math.cos(t), 0.35 + 0.24 * math.sin(t)) for t in th], ROOF, 0.9, 0.2)
        L([(0.425, 0.59), (0.425, 0.75)], 1.0); L([(0.36, 0.69), (0.49, 0.69)], 1.0)
        arch(0, -0.62, 0.3, 0.5); arch(-0.45, -0.3, 0.16, 0.28, PAPER); arch(0.45, -0.3, 0.16, 0.28, PAPER)
    elif n.startswith("Terrazzo"):            # Aussichtsterrasse mit Balustrade + Hügel
        P([(-0.9, -0.1), (-0.4, 0.45), (0.0, 0.15), (0.45, 0.6), (0.9, 0.05), (0.9, -0.1)], ROOF, 0.8)
        C(-0.55, 0.65, 0.12, PAPER, 0.8)
        R(-0.85, -0.38, 0.85, -0.28, WALL)
        for u in np.linspace(-0.75, 0.75, 9): L([(u, -0.62), (u, -0.38)], 1.4)
    elif n.startswith("Municipio"):            # Palazzo mit Uhr
        R(-0.75, -0.62, 0.75, 0.35); P([(-0.82, 0.35), (0.82, 0.35), (0, 0.6)], ROOF)
        C(0, 0.46, 0.09, PAPER, 0.7); L([(0, 0.46), (0, 0.52)], 0.7, 0.5); L([(0, 0.46), (0.04, 0.46)], 0.7, 0.5)
        for u in (-0.5, -0.17, 0.17, 0.5): R(u - 0.08, 0.0, u + 0.08, 0.22, DARK, 0.4, 0.2)
        arch(0, -0.62, 0.3, 0.45); L([(-0.75, -0.08), (0.75, -0.08)], 0.7)
    elif n.startswith("Palazzo Panitteri"):    # Palazzo mit Arkaden
        R(-0.8, -0.62, 0.8, 0.45); L([(-0.85, 0.45), (0.85, 0.45)], 1.6)
        for u in (-0.55, -0.18, 0.18, 0.55): arch(u, -0.62, 0.24, 0.45)
        for u in (-0.55, -0.18, 0.18, 0.55): R(u - 0.07, 0.05, u + 0.07, 0.3, DARK, 0.4, 0.2)
        L([(-0.8, -0.05), (0.8, -0.05)], 0.7)
    elif n.startswith("Pinacoteca"):           # Klosterbau mit Bild
        R(-0.8, -0.62, 0.8, 0.3); P([(-0.86, 0.3), (0.86, 0.3), (0.6, 0.48), (-0.6, 0.48)], ROOF)
        R(-0.4, -0.38, 0.4, 0.15, "#c9a64a", 0.9, 0.2); R(-0.3, -0.29, 0.3, 0.06, PAPER, 0.5, 0.3)
        P([(-0.3, -0.29), (-0.08, -0.02), (0.05, -0.15), (0.3, 0.04), (0.3, -0.29)], ROOF, 0.4, 0.4)
    elif n.startswith("Museo Sylvie"):         # Textilskulptur (Figur mit Gewand)
        R(-0.8, -0.62, 0.8, 0.4, WALL); L([(-0.85, 0.4), (0.85, 0.4)], 1.4)
        C(0, 0.18, 0.11, ROOF, 0.7)
        P([(0, 0.05), (0.32, -0.55), (-0.32, -0.55)], "#7a3a5a", 0.8, 0.3)
        L([(-0.12, -0.15), (0.12, -0.15)], 0.6, 0.5); L([(-0.2, -0.35), (0.2, -0.35)], 0.6, 0.5)
    elif n.startswith("Museo d'Arte Sacra"):   # Kelch
        R(-0.8, -0.62, 0.8, 0.4, WALL); L([(-0.85, 0.4), (0.85, 0.4)], 1.4)
        th = np.linspace(math.pi, 2 * math.pi, 12)
        P([(0.28 * math.cos(t), 0.25 + 0.3 * math.sin(t)) for t in th], "#c9a64a", 0.8, 0.3)
        L([(0, -0.05), (0, -0.42)], 1.4); P([(-0.22, -0.5), (0.22, -0.5), (0.1, -0.42), (-0.1, -0.42)], "#c9a64a", 0.7, 0.3)
    elif n.startswith("Teatro"):               # Theaterfassade mit Giebel
        R(-0.72, -0.62, 0.72, 0.2); P([(-0.8, 0.2), (0.8, 0.2), (0, 0.6)], ROOF)
        C(0, 0.36, 0.08, PAPER, 0.7)
        for u in (-0.55, -0.2, 0.2, 0.55): R(u - 0.05, -0.62, u + 0.05, 0.2, PAPER, 0.6, 0.2)
        arch(0, -0.62, 0.2, 0.42)
    elif n.startswith("Le Purrere"):           # Felsenkeller / Steinbruch
        P([(-0.9, -0.62), (-0.85, 0.2), (-0.4, 0.55), (0.3, 0.6), (0.85, 0.3), (0.9, -0.62)], ROOF, 0.9)
        for u, wdt in ((-0.45, 0.32), (0.05, 0.36), (0.55, 0.28)): arch(u, -0.62, wdt, 0.55)
        L([(-0.6, 0.3), (-0.3, 0.32)], 0.6); L([(0.2, 0.42), (0.55, 0.38)], 0.6)
    elif n.startswith("Acquedotto"):           # Bogenreihe
        R(-0.9, 0.12, 0.9, 0.32, WALL); R(-0.9, -0.62, 0.9, 0.12, WALL)
        for u in (-0.6, -0.2, 0.2, 0.6): arch(u, -0.62, 0.28, 0.58, PAPER)
        L([(-0.9, 0.32), (0.9, 0.32)], 1.4)
    elif n.startswith("Lumaca"):               # Schnecke (Lumaca Vittoria) auf Sockel
        R(-0.45, -0.62, 0.45, -0.42, ROOF)
        snail(ax, x, y + 0.08 * r, r * 0.75, z + 1.3, lw)
    else:
        R(-0.7, -0.62, 0.7, 0.3); P([(-0.78, 0.3), (0.78, 0.3), (0, 0.6)], ROOF)

def snail(ax, x, y, r, z=10, lw=1.0, shell="#d9d3c4", ink="#151515"):
    """Babbalucia – Schnecke, Symbol Sambucas (Vektorzeichnung)."""
    T = lambda pts: [(x + u * r, y + v * r) for u, v in pts]
    # Körper
    body = [(-0.95, -0.55), (0.75, -0.55), (0.95, -0.42), (0.98, -0.1), (0.85, 0.05), (0.72, -0.2), (0.6, -0.32), (-0.75, -0.32)]
    ax.add_patch(Polygon(T(body), closed=True, fc="#8a8478", ec=ink, lw=lw * 1.1, zorder=z, joinstyle="round"))
    for (bx, by), (tx, ty) in (((0.86, 0.0), (0.98, 0.42)), ((0.92, -0.05), (1.15, 0.3))):
        ax.plot([x + bx * r, x + tx * r], [y + by * r, y + ty * r], color=ink, lw=lw * 1.0, zorder=z + 0.1)
        ax.add_patch(Circle((x + tx * r, y + ty * r), 0.045 * r, fc=ink, ec=ink, zorder=z + 0.1))
    # Haus
    ax.add_patch(Circle((x - 0.05 * r, y + 0.12 * r), 0.55 * r, fc=shell, ec=ink, lw=lw * 1.2, zorder=z + 0.2))
    th = np.linspace(0, 5.2 * math.pi, 140); rr = 0.5 * np.exp(-0.17 * th)
    ax.plot(x + (-0.05 + rr * np.cos(th + 1.0)) * r, y + (0.12 + rr * np.sin(th + 1.0)) * r, color=ink, lw=lw * 1.0, zorder=z + 0.3)
