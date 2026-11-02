#!/usr/bin/env python3
"""Berechnet die Pin-Positionen (% des Kartenausschnitts) für v0.7.1 aus WGS84-Koordinaten.
Projektion = identisch mit render_v12.py / restyle_v12.py (Poster 120x60 cm).
Basis 150 dpi (PPC=7086/120 px/cm), hochgerechnet auf 300 dpi (Faktor P2)."""
import math, json
LAT0, LON0 = 37.648, 13.111
KX, KY = 111.32 * math.cos(math.radians(LAT0)), 110.95
PPC = 7086 / 120.0                 # px/cm bei 150 dpi
P2 = (14173 / 120.0) / PPC         # 150 -> 300 dpi
def km(la, lo): return ((lo - LON0) * KX, (la - LAT0) * KY)
INS = (39.0, 13.6, 81.0, 46.6); SI = 25.3            # Stadt-Inset (cm), cm/km
icx, icy = km(37.6489, 13.10892); hw = (INS[2]-INS[0])/2/SI; hh = (INS[3]-INS[1])/2/SI
S = 3.3; SX, SY = INS[0] - 1.4 * S, 36.0              # Region: cm/km, Ursprung
def inset_px(la, lo):
    x, y = km(la, lo); xc = INS[0] + (x - (icx - hw)) * SI; yc = INS[1] + (y - (icy - hh)) * SI
    return xc * PPC * P2, (60 - yc) * PPC * P2
def region_px(la, lo):
    x, y = km(la, lo); return (SX + x * S) * PPC * P2, (60 - (SY + y * S)) * PPC * P2
CT = (4606, 1583, 9567, 5480); CU = (0, 800, 4600, 3800)
def pct(p, c): return round(100*(p[0]-c[0])/(c[2]-c[0]), 2), round(100*(p[1]-c[1])/(c[3]-c[1]), 2)
TOWN = {"casa": (37.65020, 13.11262), "banca": (37.647281, 13.110587), "muni": (37.64892, 13.11297),
        "palazzo": (37.645196, 13.108519), "caffe": (37.64707, 13.11071), "chiesa": (37.65050, 13.11514),
        "belv": (37.65083, 13.11637)}
LAND = {"torre": (37.68056, 13.08583), "frantoio": (37.658, 13.103), "hain": (37.679965, 13.094593),
        "feudo": (37.6528, 13.0170), "lago": (37.6364, 13.0661), "sambuca": (37.6477395, 13.1110313)}
if __name__ == "__main__":
    out = {"stadt": {k: pct(inset_px(*v), CT) for k, v in TOWN.items()},
           "umland": {k: pct(region_px(*v), CU) for k, v in LAND.items()}}
    print(json.dumps(out, indent=1))
