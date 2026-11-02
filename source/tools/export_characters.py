#!/usr/bin/env python3
"""Exportiert alle Figuren (CHARS) samt Fundstellen aus dem Spielcode.
Aufruf:  python3 source/tools/export_characters.py [--json out.json] [--md out.md]
Liest source/game/**.tsx; keine Abhängigkeiten außer Python 3.
Erkennt pro Figur: Stammdaten (CHARS in a.tsx), Orte (at, MINOR-Namen, Fest-Gäste),
Perks (PERKS in c.tsx), Deals (DEALN), Ereignisse (Blöcke mit { id: "…" … } in evs.tsx / c.tsx,
die who:"id", rel/R(g,"id"), met.includes("id") oder den Namen erwähnen) und alle Code-Zeilen."""
import re, json, sys, os, glob
G = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "game")
FILES = sorted(glob.glob(G + "/*.tsx") + glob.glob(G + "/src/*.tsx"))
FILES = [f for f in FILES if not f.endswith("imgs.tsx")]
src = {os.path.relpath(f, os.path.join(G, "..", "..")): open(f, encoding="utf-8").read().split("\n") for f in FILES}
def find(fname): return next(k for k in src if k.endswith(fname))
A = find("src/a.tsx"); C = find("src/c.tsx")
def sfield(s, k):
    m = re.search(r'\b%s: "((?:[^"\\]|\\.)*)"' % k, s); return m.group(1) if m else None
chars = []
for i, l in enumerate(src[A]):
    if l.strip().startswith('{ id: "') and ' diff: ' in l:
        c = {k: sfield(l, k) for k in ("id", "n", "r", "c", "lo", "mid", "hi", "hates")}
        c["i"] = int(re.search(r"\bi: (\d+)", l).group(1)); c["diff"] = int(re.search(r"diff: (\d+)", l).group(1))
        c["at"] = re.findall(r'"(\w+)"', re.search(r"at: \[([^\]]*)\]", l).group(1))
        m = re.search(r"mo: \[([^\]]*)\]", l); c["mo"] = [int(x) for x in m.group(1).split(",")] if m else None
        c["likes"] = re.findall(r'"(\w+)"', re.search(r"likes: \[([^\]]*)\]", l).group(1))
        m = re.search(r'need: \["([^"]+)"', l); c["need"] = m.group(1) if m else None
        c["def"] = f"{A}:{i+1}"; chars.append(c)
MEET = [0, 0.3, 0.45, 0.6, 0.7, 0.8]
venues = {}
for f, ls in src.items():
    for l in ls:
        m = re.match(r'\s*\{ id: "(\w+)", (?:n|label): "([^"]+)"', l)
        if m and ("map:" in l or "label:" in l): venues.setdefault(m.group(1), m.group(2))
venues.update({"bar": "Bar del Corso", "chiesa": "Chiesa Madre", "muni": "Municipio", "buero": "Büro (zuhause)", "fest": "Feste", "frantoio": "Frantoio", "feudo": "Feudo Arancio", "lago": "Lago Arancio"})
fest = {}
for l in src[C]:
    m = re.match(r'\s*(\d+): \{ n: "([^"]+)".*guests: \[([^\]]*)\]', l)
    if m: fest[int(m.group(1))] = (m.group(2), re.findall(r'"(\w+)"', m.group(3)))
perks = []
for i, l in enumerate(src[C]):
    m = re.match(r'\s*\{ id: "(\w+)", who: "(\w+)", min: (\d+), e: "([^"]+)", n: "([^"]+)", d: "([^"]+)", per: "(\w+)"', l)
    if m: perks.append(dict(id=m.group(1), who=m.group(2), min=int(m.group(3)), e=m.group(4), n=m.group(5), d=m.group(6), per=m.group(7), loc=f"{C}:{i+1}"))
deals = dict(re.findall(r'(\w+): "([^"]+)"', next(l for l in src[C] if l.startswith("const DEALN"))))
# Ereignis-Blöcke
blocks = []
for f, ls in src.items():
    cur = None
    for i, l in enumerate(ls):
        m = re.match(r'\s{2,4}\{ id: "(\w+)",.*\bt: "([^"]+)"', l)
        if m and ("text:" in l or "months:" in l):
            cur = dict(id=m.group(1), t=m.group(2), f=f, a=i + 1, b=i + 1, txt=l); blocks.append(cur)
        elif cur and (l.startswith("  { ") or l.startswith("];") or l.startswith("const ") or l.startswith("};")):
            cur = None
        elif cur: cur["b"] = i + 1; cur["txt"] += "\n" + l
SHORT = {"nonna": "Nonna", "ciccio": "Ciccio", "padre": "Padre Vito|Padre", "chiara": "Chiara|Pro Loco", "sindaco": "Sindaco|Bonura", "turi": "Turi"}
# Begegnungen an kleinen Orten (MINOR.enc)
encs = []
for f, ls in src.items():
    place = None
    for i, l in enumerate(ls):
        m = re.match(r'\s*\{ id: "(\w+)", n: "([^"]+)", e: "[^"]+", x: [\d.]+, y: [\d.]+, map:', l)
        if m: place = m.group(2); continue
        m = re.match(r'\s*\{ t: "([^"]+)", l: "([^"]+)"', l)
        if m and place: encs.append(dict(place=place, t=m.group(1), l=m.group(2), loc=f"{f}:{i+1}", txt=l))
        if l.startswith("];"): place = None
for c in chars:
    first = SHORT.get(c["id"], c["n"].split()[-1])
    pat = re.compile(r'(who: "%s"|rel\(g, "%s"|R\(g, "%s"|includes\("%s"\)|g\.rel\.%s\b|\b(?:%s)\b)' % ((c["id"],) * 5 + (first,)))
    c["meet_need"] = MEET[c["diff"]]
    c["venues"] = [venues.get(v, v) for v in c["at"]]
    c["fests"] = [f"{m}: {n}" for m, (n, gs) in sorted(fest.items()) if c["id"] in gs]
    c["perks"] = [p for p in perks if p["who"] == c["id"]]
    c["deals"] = {k: v for k, v in deals.items() if re.search(r"\(%s\)" % re.escape(first.split("|")[0].split()[-1]), v) or (c["id"] == "chiara" and "Pro Loco" in v)}
    c["events"] = [dict(id=b["id"], t=b["t"], loc=f'{b["f"]}:{b["a"]}-{b["b"]}', who=f'who: "{c["id"]}"' in b["txt"]) for b in blocks if pat.search(b["txt"])]
    c["encounters"] = [dict(place=e["place"], t=e["t"], l=e["l"], loc=e["loc"]) for e in encs if pat.search(e["txt"])]
    c["refs"] = [f"{f}:{i+1}" for f, ls in src.items() for i, l in enumerate(ls) if re.search(r'"%s"' % c["id"], l)]
def md(chars):
    o = []
    for c in sorted(chars, key=lambda c: (c["diff"], c["i"])):
        o += [f'### {c["n"]} (`{c["id"]}`)', "", f'- **Rolle:** {c["r"]}', f'- **Orte:** {", ".join(c["venues"])}' + (f' (nur Monate {c["mo"]})' if c["mo"] else ""),
              f'- **Feste (Gast):** {"; ".join(c["fests"]) or "–"}', f'- **Schwierigkeit:** {c["diff"]} → Gesprächs-Score ≥ {int(c["meet_need"]*100)} %' + (f'; Voraussetzung: {c["need"]}' if c["need"] else ""),
              f'- **Mag:** {", ".join(c["likes"])} · **mag nicht:** {c["hates"]}', f'- **Sprüche:** ♥ niedrig {c["lo"]} · mittel {c["mid"]} · hoch {c["hi"]}',
              "- **Aktionen (Perks):** " + ("; ".join(f'{p["e"]} {p["n"]} (ab ♥ {p["min"]}, {dict(y="1×/Jahr", m="monatlich", once="einmalig")[p["per"]]}: {p["d"]}; `{p["loc"]}`)' for p in c["perks"]) or "–"),
              "- **Deals:** " + (", ".join(f'`{k}` {v}' for k, v in c["deals"].items()) or "–"),
              "- **Ereignisse/Begegnungen:** " + ("; ".join(f'{e["t"]} (`{e["id"]}`{", Hauptfigur" if e["who"] else ""}, `{e["loc"]}`)' for e in c["events"]) or "–"),
              "- **Begegnungen an kleinen Orten:** " + ("; ".join(f'{e["place"]}: „{e["t"]}“ → {e["l"]} (`{e["loc"]}`)' for e in c["encounters"]) or "–"),
              f'- **Definition:** `{c["def"]}` · Porträt-Index `i: {c["i"]}`', ""]
    return "\n".join(o)
if __name__ == "__main__":
    a = sys.argv
    if "--json" in a: json.dump(chars, open(a[a.index("--json") + 1], "w"), ensure_ascii=False, indent=1)
    if "--md" in a: open(a[a.index("--md") + 1], "w").write(md(chars))
    print(f"{len(chars)} Figuren:", ", ".join(c["n"] for c in chars))
    for c in chars: print(f'  {c["id"]:8} diff {c["diff"]} perks {len(c["perks"])} events {len(c["events"])} enc {len(c["encounters"])} refs {len(c["refs"])}')
