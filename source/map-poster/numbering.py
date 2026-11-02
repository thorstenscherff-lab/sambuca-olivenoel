# v4: räumliche Nummerierung der Altstadt-POIs
# 1 = Terrazzo Belvedere, dann den Corso Umberto I hinunter (NO -> SW), dann im Uhrzeigersinn um die Stadt.
import json, math
import numpy as np
from pois import TOWN
LAT0, LON0 = 37.648, 13.111
KX, KY = 111.32 * math.cos(math.radians(LAT0)), 110.95
def km(lat, lon): return np.array([(lon - LON0) * KX, (lat - LAT0) * KY])
_t = json.load(open("town.json"))["elements"]
_c = [e for e in _t if e.get("tags", {}).get("name") == "Corso Umberto I" and "geometry" in e]
_c = sorted(_c, key=lambda e: -len(e["geometry"]))
pts = [(p["lat"], p["lon"]) for p in _c[0]["geometry"]]
if len(_c) > 1: pts = pts + [(p["lat"], p["lon"]) for p in _c[1]["geometry"]][1:]
C = np.array([km(*p) for p in pts])
if C[0][1] < C[-1][1]: C = C[::-1]          # start at the NE (upper) end
seg = np.diff(C, axis=0); L = np.hypot(*seg.T); cum = np.r_[0, np.cumsum(L)]
def proj(p):
    best = (9e9, 0)
    for i in range(len(seg)):
        t = np.clip(np.dot(p - C[i], seg[i]) / max(L[i] ** 2, 1e-12), 0, 1)
        d = np.hypot(*(C[i] + t * seg[i] - p))
        if d < best[0]: best = (d, cum[i] + t * L[i])
    return best
BUF = 0.085   # km: Abstand zur Corso-Mittellinie (Corso-Abschnitt inkl. direkte Seitengassen)
P = {n: km(la, lo) for n, c, la, lo, s, f in TOWN}
first = "Terrazzo Belvedere"
ctr = np.mean(np.array(list(P.values())), axis=0)
RIN = 0.13    # km: innerer Kern um die Stadtmitte gehört mit zum Corso-Abschnitt
corso, rest = [], []
for n, p in P.items():
    if n == first: continue
    d, s = proj(p)
    if d <= BUF or np.hypot(*(p - ctr)) < RIN: corso.append((s, n))
    else: rest.append(n)
corso.sort()
ctr = np.mean(np.array(list(P.values())), axis=0)
def bearing(p):  # compass bearing (clockwise from north)
    v = p - ctr; return math.degrees(math.atan2(v[0], v[1])) % 360
b0 = bearing(C[-1])               # continue clockwise from the SW end of the Corso
rest.sort(key=lambda n: ((bearing(P[n]) - b0) % 360, np.hypot(*(P[n] - ctr))))
ORDER = [first] + [n for s, n in corso] + rest
# v12 (Thorsten): die letzten 6 der Runde liegen zwischen 1 und 2 -> werden 2–7
MOVE = ["Lu Saracinu", "Le Purrere (Steinbrüche)", "Chiesa Madre", "Ceramiche Artistiche Safina", "G. Perniciaro – Granite", "Nomad Art Collective"]
ORDER = [first] + MOVE + [x for x in ORDER[1:] if x not in MOVE]
NUM = {n: i + 1 for i, n in enumerate(ORDER)}
assert len(NUM) == len(TOWN)
if __name__ == "__main__":
    print("corso", len(corso), "rest", len(rest), "b0", round(b0))
    for n in ORDER: print(NUM[n], n)
