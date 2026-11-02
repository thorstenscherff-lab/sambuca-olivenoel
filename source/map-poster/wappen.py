# Stadtwappen Sambuca di Sicilia – Vektor nach der vom Comune verwendeten Form
# (Wikimedia Commons "Sambuca di Sicilia-Stemma.svg"; Blasonierung DCG 27.05.1929, it.wikipedia):
# goldene Barock-Kartusche, Schild troncato d'azzurro e di rosso, goldene Harfe mit Schwanenkopf,
# darüber goldener Stern; darüber Marchese-Krone (Zackenkrone); Band "VOLAT AD AETHERA VIRTVS".
import math, numpy as np
from matplotlib.patches import Polygon, Circle, Ellipse
from matplotlib.transforms import Affine2D
INK, GOLD, GOLD2, AZ, GU, SILV = "#151515", "#e2c25a", "#f3e08e", "#2a5fae", "#c8191c", "#e6e6e6"
def wappen(ax, x, y, h, z=30, lw=1.2):
    k = h / 770.0
    T = lambda pts: [(x + (px - 250) * k, y + (385 - py) * k) for px, py in pts]
    def P(pts, fc, w=1.0, zz=0, ec=INK):
        ax.add_patch(Polygon(T(pts), closed=True, fc=fc, ec=ec, lw=lw * w, zorder=z + zz, joinstyle="round"))
    def Ln(pts, c, w, zz):
        ax.plot(*zip(*T(pts)), color=c, lw=w, zorder=z + zz, solid_capstyle="round", solid_joinstyle="round")
    # Kartusche
    cart = [(48, 232), (92, 192), (150, 214), (250, 232), (350, 214), (408, 192), (452, 232), (440, 330), (462, 405),
            (430, 438), (442, 520), (400, 585), (330, 640), (250, 705), (170, 640), (100, 585), (58, 520), (70, 438),
            (38, 405), (60, 330)]
    P(cart, GOLD, 1.3, 0)
    for cx, cy in ((118, 212), (382, 212), (52, 412), (448, 412)):
        ax.add_patch(Circle(T([(cx, cy)])[0], 20 * k, fc=GOLD2, ec=INK, lw=lw * 0.9, zorder=z + 0.2))
        ax.add_patch(Circle(T([(cx, cy)])[0], 8 * k, fc=GOLD, ec=INK, lw=lw * 0.6, zorder=z + 0.25))
    # Schild (Spitzbogen unten), troncato
    top = [(250 + 130 * math.cos(a), 420 - 170 * math.sin(a)) for a in np.linspace(0, math.pi, 30)]
    bot = []
    for a in np.linspace(math.pi, 2 * math.pi, 30):
        f = (1 + math.sin(a)) ** 0.55 if math.sin(a) > -1 else 0.0
        bot.append((250 + 130 * math.cos(a) * max(f, 0) , 420 - 195 * math.sin(a)))
    P(top, AZ, 0, 0.4, ec="none")
    P([(120, 420)] + bot + [(380, 420)], GU, 0, 0.4, ec="none")
    ax.add_patch(Polygon(T(top + bot), closed=True, fill=False, ec=INK, lw=lw * 1.4, zorder=z + 0.5))
    # Stern
    ang = np.linspace(math.pi / 2, math.pi / 2 + 2 * math.pi, 11)[:-1]
    P([(250 + (34 if i % 2 == 0 else 14) * math.cos(a), 298 - (34 if i % 2 == 0 else 14) * math.sin(a)) for i, a in enumerate(ang)], GOLD, 0.7, 0.8)
    # Harfe: Säule, Hals mit Schwanenkopf, Resonanzkörper
    neck = [(182, 362), (205, 340), (240, 345), (268, 368), (295, 372), (318, 350), (330, 360)]
    body = [(318, 372), (322, 400), (300, 450), (268, 500), (240, 540)]
    pillar = [(182, 362), (180, 420), (185, 480), (192, 540)]
    for pts in (neck, body, pillar):
        Ln(pts, INK, lw * 7.0, 0.6); Ln(pts, GOLD, lw * 5.0, 0.62)
    P([(175, 538), (250, 538), (246, 552), (180, 552)], GOLD, 0.8, 0.64)
    ax.add_patch(Circle(T([(330, 358)])[0], 9 * k, fc=GOLD, ec=INK, lw=lw * 0.6, zorder=z + 0.66))
    for i in range(6):
        Ln([(232 + i * 16, 352 + i * 3 + (8 if i >= 2 else 0)), (188, 392 + i * 26)], "#f6f6f6", lw * 0.9, 0.61)
    # Krone (Zackenkrone, 7 Zacken) mit Reif und Juwelen
    P([(132, 118), (368, 118), (360, 152), (140, 152)], GOLD, 1.0, 0.9)
    ax.add_patch(Ellipse(T([(250, 156)])[0], 230 * k, 22 * k, fc="#8a7020", ec=INK, lw=lw * 0.8, zorder=z + 0.85))
    for i in range(7):
        bx = 132 + i * 33.7; tx = 250 + (bx + 16.85 - 250) * 1.15
        P([(bx, 118), (bx + 33.7, 118), (tx, 12 + abs(i - 3) * 6)], GOLD, 0.8, 0.88)
    for i, px in enumerate(np.linspace(170, 330, 5)):
        if i % 2 == 0:
            ax.add_patch(Ellipse(T([(px, 135)])[0], 30 * k, 16 * k, fc=GOLD2, ec=INK, lw=lw * 0.6, zorder=z + 0.95))
        else:
            for dy in (-6, 6):
                ax.add_patch(Circle(T([(px, 135 + dy)])[0], 4.5 * k, fc=GOLD2, ec=INK, lw=lw * 0.4, zorder=z + 0.95))
    # Spruchband in drei Teilen
    P([(0, 600), (40, 585), (175, 655), (160, 700)], SILV, 0.9, 1.0)
    P([(150, 715), (350, 715), (350, 768), (150, 768)], SILV, 0.9, 1.05)
    P([(500, 600), (460, 585), (325, 655), (340, 700)], SILV, 0.9, 1.0)
    fs = h * 1.05
    for (px, py), t, rot in (((95, 640), "VOLAT", -27), ((250, 742), "AD AETHERA", 0), ((405, 640), "VIRTVS", 27)):
        ax.text(*T([(px, py)])[0], t, fontsize=fs, ha="center", va="center", rotation=rot, color=INK, zorder=z + 1.2, family="serif")
