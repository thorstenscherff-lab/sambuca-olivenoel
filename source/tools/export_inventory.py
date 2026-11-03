#!/usr/bin/env python3
"""Inventur des Spielcodes → docs/data/inventory.json + generierte Blöcke in docs/*.md + Abgleich.

Aufruf (im Repo-Root):
  python3 source/tools/export_inventory.py            # JSON schreiben + GENERATED-Blöcke in docs/*.md erneuern
  python3 source/tools/export_inventory.py --check    # nichts schreiben; Exit 1, wenn Doku veraltet/unvollständig

Generierte Blöcke stehen zwischen  <!-- BEGIN GENERATED:name -->  und  <!-- END GENERATED:name -->.
Alles außerhalb dieser Marker ist Handtext und bleibt unangetastet.

Abgleich (--check und normaler Lauf, Bericht in docs/data/reconcile.txt):
  1. Jede Code-ID (CH-, EV-, MG-, LOC-, HOT-, PIN-, MIN-, SHOP-, PERK-, DEAL-, FEST-, GOAL-, UI-, SAVE-, ECO-) kommt in docs/*.md vor.
  2. Jede ID dieser Präfixe in docs/*.md existiert im Code (keine Phantom-Doku).  OI-xxx (Backlog) ist ausgenommen.
  3. Die GENERATED-Blöcke entsprechen dem aktuellen Code.
Nur Python 3, keine Abhängigkeiten."""
import re, json, sys, os, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import export_characters as XC  # liefert src, chars, perks, deals, fest, blocks, encs, md()
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
DOCS = os.path.join(ROOT, "docs")
src = XC.src
def F(name): return XC.find(name)
def where(rx, fname=None):
    for f, ls in src.items():
        if fname and not f.endswith(fname): continue
        for i, l in enumerate(ls):
            if re.search(rx, l): return f"{f}:{i+1}"
    return None
MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
def mlist(ms): return "ganzjährig" if ms == list(range(12)) else (", ".join(MON[m] for m in ms) if ms else "–")
def s(l, k):
    m = re.search(r'\b%s: "((?:[^"\\]|\\.)*)"' % k, l); return m.group(1) if m else None
A, C, D, E, Fx, EV, UO = F("src/a.tsx"), F("src/c.tsx"), F("src/d.tsx"), F("src/e.tsx"), F("src/f.tsx"), F("evs.tsx"), F("ui_old.tsx")

# ---------- Ereignisse ----------
fest = {}
for i, l in enumerate(src[C]):
    m = re.match(r'\s*(\d+): \{ n: "([^"]+)", s: "([^"]+)"(, big: true)?, ids: \[([^\]]*)\], guests: \[([^\]]*)\]', l)
    if m: fest[int(m.group(1))] = dict(n=m.group(2), s=m.group(3), big=bool(m.group(4)), ids=re.findall(r'"(\w+)"', m.group(5)), guests=re.findall(r'"(\w+)"', m.group(6)), loc=f"{C}:{i+1}")
queued = {}
for b in XC.blocks:
    for d, t in re.findall(r'later\(g, (\d+), "(\w+)"\)', b["txt"]): q_ = queued.setdefault(t, []); (b["id"], int(d)) in q_ or q_.append((b["id"], int(d)))
init_q = re.findall(r'queue: \[\[(\d+), "(\w+)"\]\]', "\n".join(src[D]))
for d, t in init_q: queued.setdefault(t, []).append(("Spielstart", int(d)))
events = []
for b in XC.blocks:
    if not (b["f"].endswith("evs.tsx") or b["f"].endswith("c.tsx")): continue
    h = b["txt"].split("\n")[0]
    if "months:" not in h: continue
    mm = re.search(r"months: (\[[^\]]*\]|ALL)", h); ms = list(range(12)) if mm.group(1) == "ALL" else [int(x) for x in re.findall(r"\d+", mm.group(1))]
    need = re.search(r"need: \(g\) => (.+?), (?:icon|t|months|who|text|dis|fest|ch):", h)
    ch = []
    for cm in re.finditer(r'\{ l: "((?:[^"\\]|\\.)*)", d: "((?:[^"\\]|\\.)*)"(.*?)f: \(', b["txt"]):
        rest = cm.group(3); ok = re.search(r"ok: \(g\) => (.+?), (?:mg|$)", rest + "$"); mg = re.search(r'mg: "(\w+)"', rest)
        ch.append(dict(l=cm.group(1), d=cm.group(2), ok=(ok.group(1).rstrip(", ") if ok else None), mg=mg.group(1) if mg else None))
    for nm in re.finditer(r'no\("([^"]+)"\)', b["txt"]): ch.append(dict(l=nm.group(1), d="nichts passiert", ok=None, mg=None))
    e = dict(id=b["id"], t=b["t"], icon=s(h, "icon"), months=ms, dis=" dis: true" in h, fest=" fest: true" in h, who=s(h, "who"), need=need.group(1) if need else None,
             text=s(h, "text"), ch=ch, loc=f'{b["f"]}:{b["a"]}-{b["b"]}', follow=sorted(set(re.findall(r'later\(g, \d+, "(\w+)"\)', b["txt"]))))
    trig = []
    fm = [m for m, f in fest.items() if e["id"] in f["ids"]]
    if fm: trig.append("Fest " + ", ".join(f'FEST-{m+1:02d} ({MON[m]})' for m in fm))
    if e["id"] == "vend1": trig.append("fix jeden Juli (rollEvents)")
    if e["id"] in queued: trig.append("Folge von " + ", ".join(f'{"EV-"+q if q != "Spielstart" else q} (+{d} Mon.)' for q, d in queued[e["id"]]))
    if ms and not e["fest"]: trig.append("Zufall")
    e["trigger"] = trig or ["– (nicht erreichbar?)"]
    events.append(e)
EVM = {e["id"]: e for e in events}
# analytische Wahrscheinlichkeit pro Monat (ohne need-Filter, ohne Jahresverbrauch): Slots = (0,55·2 + 0,45·1) − Fest
def prob(e, m):
    if e["fest"] or m not in e["months"]: return 0.0
    f = fest.get(m)
    if f and f["big"]: return 0.0
    slots = [(0.55, max(0, 2 - (1 if f else 0))), (0.45, max(0, 1 - (1 if f else 0)))]
    pool = [x for x in events if m in x["months"] and not x["fest"]]
    pd = [x for x in pool if x["dis"]]; pn = [x for x in pool if not x["dis"]]
    p1 = (0.4 / len(pd) if e["dis"] else 0.6 / len(pn)) if pd and pn else 1 / len(pool)
    return sum(w * min(1, n * p1) for w, n in slots)
for e in events:
    e["p_month"] = {MON[m]: round(prob(e, m), 3) for m in e["months"]} if not e["fest"] else {}
    e["p_year"] = round(1 - __import__("math").prod(1 - p for p in e["p_month"].values()), 3) if e["p_month"] else None

# ---------- Orte ----------
pins = []
for f in (Fx,):
    for i, l in enumerate(src[f]):
        m = re.match(r'\s*\{ id: "(\w+)", label: "([^"]+)", role: "([^"]+)", x: ([\d.]+), y: ([\d.]+)(?:, scene: "(\w+)")?', l)
        if m: pins.append(dict(id=m.group(1), label=m.group(2), role=m.group(3), x=float(m.group(4)), y=float(m.group(5)), scene=m.group(6), map="Stadt" if i < 10 else "Umland", loc=f"{f}:{i+1}"))
scenes = []; cur = None
for i, l in enumerate(src[E]):
    m = re.match(r'\s*(\w+): \{ img: "(\w+)", n: "([^"]+)", sub: "([^"]*)", venue: "(\w+)"', l)
    if m: cur = dict(id=m.group(1), img=m.group(2), n=m.group(3), sub=m.group(4), venue=m.group(5), hots=[], loc=f"{E}:{i+1}"); scenes.append(cur)
    if cur is not None or l.strip().startswith(("1:", "2:", "3:", "4:")):
        for hm in re.finditer(r'\{ id: "([\w:]+)", x: [\d.]+, y: [\d.]+, l: "([^"]+)", e: "([^"]+)"', l):
            tgt = cur if cur is not None else None
            if tgt is not None: tgt["hots"].append(dict(id=hm.group(1), l=hm.group(2), e=hm.group(3), loc=f"{E}:{i+1}"))
    if l.startswith("};") and cur is not None: cur = None
offh = {}
for i, l in enumerate(src[E]):
    m = re.match(r'\s*(\d): \[(.*)\],?$', l)
    if m: offh[int(m.group(1))] = [dict(id=a, l=b) for a, b in re.findall(r'id: "(\w+)", x: [\d.]+, y: [\d.]+, l: "([^"]+)"', m.group(2))]
for sc in scenes:
    if sc["id"] == "buero" and not sc["hots"]: sc["hots"] = [dict(id=h["id"], l=h["l"], e="", loc=where(r"^\s*1: \[", "e.tsx")) for h in offh[1]]
handled = re.search(r"switch \(h\) \{(.*?)default:", "\n".join(src[Fx]), re.S).group(1)
for sc in scenes:
    for h in sc["hots"]:
        h["handled"] = h["id"].startswith("pin:") or f'"{h["id"]}"' in handled
minors = []; cm = None
for i, l in enumerate(src[C]):
    m = re.match(r'\s*\{ id: "(\w+)", n: "([^"]+)", e: "([^"]+)", x: ([\d.]+), y: ([\d.]+), (?:px: \[[^\]]*\], )?map: "(\w)"', l)  # v0.8: optionales px vor map
    if m: cm = dict(id=m.group(1), n=m.group(2), e=m.group(3), map="Stadt" if m.group(6) == "s" else "Umland", enc=[], loc=f"{C}:{i+1}"); minors.append(cm); continue
    if cm and l.strip().startswith('{ t: "'):
        cm["enc"].append(dict(t=s(l, "t"), l=s(l, "l"), d=s(l, "d"), ok=bool(re.search(r"\bok: ", l)), loc=f"{C}:{i+1}"))
    if l.startswith("];"): cm = None
shop = []
for i, l in enumerate(src[C]):
    m = re.match(r'\s*\{ id: "(\w+)", at: "(\w+)", n: "([^"]+)", d: "([^"]+)", cost: \([^)]*\) => ([^,]+?), ok:', l)
    if m: shop.append(dict(id=m.group(1), at=m.group(2), n=m.group(3), d=m.group(4), cost=m.group(5).replace("Math.round(", "").replace(" * disc(g))", " × Wang-Rabatt"), loc=f"{C}:{i+1}"))
spots = re.findall(r'\{ id: "(\w+)", n: "([^"]+)", x: [\d.]+, y: [\d.]+ \}', "\n".join(src[C][src[C].index(next(l for l in src[C] if l.startswith("const SPOTS"))):]))
startoff = re.findall(r'\{ id: "(\w+)", name: "([^"]+)", trees: (\d+), cond: (\d+), price: (\d+), lease: (\d+)', "\n".join(src[D]))
spotfx = re.search(r"const S: Record<string, \[number, number, \(\) => string\]> = \{(.*?)\n\s*\};", "\n".join(src[D]), re.S).group(1)
spotacts = [dict(id=a, cost=int(b), ap=int(c)) for a, b, c in re.findall(r"(\w+): \[(\d+), (\d), \(\)", spotfx)]

# ---------- Ziele, Konstanten, Minispiele, UI, Spielstand ----------
goals = []
for i, l in enumerate(src[C]):
    m = re.match(r'\s*\{ t: "([^"]+)", chk: \(g\) => (.+?), rew: (\d+), rep: (\d+) \}', l)
    if m: goals.append(dict(t=m.group(1), chk=m.group(2), rew=int(m.group(3)), rep=int(m.group(4)), loc=f"{C}:{i+1}"))
mgk = re.findall(r'(\w+): \{ n: "([^"]+)", txt: "([^"]+)", it: \[[^\]]*\], bg: "[^"]+", goal: (\d+)', "\n".join(src[E]))
minigames = [dict(id="talk", fn="MiniTalk", loc=where(r"^function MiniTalk", "e.tsx")), dict(id="harvest", fn="MiniHarvest", loc=where(r"^function MiniHarvest")), dict(id="harvest-shaker", fn="MiniShaker", loc=where(r"^function MiniShaker", "f.tsx")),
             dict(id="press", fn="MiniPress", loc=where(r"^function MiniPress")), dict(id="haggle", fn="MiniHaggle", loc=where(r"^function MiniHaggle"))]
for k, n, txt, goal in mgk: minigames.append(dict(id="rescue-" + k, fn=f'MiniRescue kind="{k}"', title=n, txt=txt, goal=int(goal), loc=where(r'^\s*%s: \{ n: "' % k, "e.tsx")))
mini_fns = sorted(set(re.findall(r"^function (Mini\w+)", "\n".join("\n".join(v) for v in src.values()), re.M)))
sheetdef = "\n".join(l for l in src[Fx] if "k: \"" in l and ("type Sheet" in l or l.strip().startswith("|")))
sheets = sorted(set(re.findall(r'k: "(\w+)"', sheetdef)))
gtype = re.search(r"type G = \{(.*?)\};", "\n".join(src[A]), re.S).group(1)
gfields = [dict(name=a, type=b.strip()) for a, b in re.findall(r"(\w+): ([^;]+);", gtype)]
stats = re.findall(r"(\w+): number", re.search(r"type Stats = \{([^}]*)\}", "\n".join(src[A])).group(1))
grove = re.findall(r"(\w+): (\w+)", re.search(r"type Grove = \{([^}]*)\}", "\n".join(src[A])).group(1))
flags = sorted(set(re.findall(r"g\.fl\.(\w+)", "\n".join("\n".join(v) for v in src.values()))) | set(re.findall(r'g\.fl\["(\w+)', "\n".join("\n".join(v) for v in src.values()))) | {"try_", "py_", "po_"})
acts = sorted(set(re.findall(r'acts\.(?:push|includes)\("(\w+?)_?"', "\n".join("\n".join(v) for v in src.values()))))
storekeys = sorted(set(re.findall(r'"(sambuca5_\w+)"', "\n".join("\n".join(v) for v in src.values()))))
ECO = ["AP", "CARE", "SEASON", "RIV", "YEAR0", "price", "unit", "wage", "sellAt", "millFee", "pickCost", "careCost", "nextPrice", "endMonth", "score", "titel", "rivalPts", "mkOffers", "disc", "DMG", "storm", "offStage", "hsPut", "MEETNEED"]
allcode = "\n".join("\n".join(v) for v in src.values())
eco = [dict(id=x, loc=where(r"^(const|function) %s\b" % x)) for x in ECO]
inv = dict(characters=XC.chars, events=events, fest=fest, perks=XC.perks, deals=XC.deals, minors=minors, shop=shop, scenes=scenes, pins=pins, spots=spots, start_offers=startoff, spot_actions=spotacts,
           goals=goals, minigames=minigames, sheets=sheets, savegame=dict(G=gfields, Stats=stats, Grove=grove, fl=flags, acts=acts, storage=storekeys), eco=eco)

# ---------- IDs ----------
ids = {}
def add(i, loc): ids[i] = loc
for c in XC.chars: add("CH-" + c["id"], c["def"])
for e in events: add("EV-" + e["id"], e["loc"])
for m in minigames: add("MG-" + m["id"], m["loc"])
for sc in scenes:
    add("LOC-" + sc["id"], sc["loc"])
    for h in sc["hots"]: add(f'HOT-{sc["id"]}-{h["id"].replace("pin:", "pin-")}', h["loc"])
for p in pins: add("PIN-" + p["id"], p["loc"])
for m in minors: add("MIN-" + m["id"], m["loc"])
for x in shop: add("SHOP-" + x["id"], x["loc"])
for p in XC.perks: add("PERK-" + p["id"], p["loc"])
for k in XC.deals: add("DEAL-" + k, where(r"^const DEALN"))
for m, f in fest.items(): add(f"FEST-{m+1:02d}", f["loc"])
for n, gl in enumerate(goals): add(f"GOAL-{n+1:02d}", gl["loc"])
for k in sheets: add("UI-" + k, where(r"type Sheet", "f.tsx"))
for f_ in gfields: add("SAVE-" + f_["name"], where(r"^type G = ", "a.tsx"))
for x in eco: add("ECO-" + x["id"], x["loc"])

# ---------- Markdown-Blöcke ----------
def T(rows, head): return "\n".join(["| " + " | ".join(head) + " |", "|" + "---|" * len(head)] + ["| " + " | ".join(str(c).replace("|", "\\|").replace("\n", " ") for c in r) + " |" for r in rows])
def cn(i): return XC.chars and next((c["n"] for c in XC.chars if c["id"] == i), i)
G = {}
G["events-random"] = T([[f'`EV-{e["id"]}`', f'{e["icon"]} {e["t"]}', "Katastrophe" if e["dis"] else "normal", mlist(e["months"]), f'{e["p_year"]*100:.0f} %' if e["p_year"] is not None else "–",
                        (f'`{e["need"]}`' if e["need"] else "–"), (f'CH-{e["who"]}' if e["who"] else "–"), "; ".join(e["trigger"]), f'`{e["loc"]}`'] for e in events if not e["fest"]],
                       ["ID", "Ereignis", "Art", "Monate", "≈ P/Jahr", "Vorbedingung", "Figur", "Auslöser", "Code"])
G["events-fest"] = T([[f'`EV-{e["id"]}`', f'{e["icon"]} {e["t"]}', "; ".join(e["trigger"]), (f'CH-{e["who"]}' if e["who"] else "–"), f'`{e["loc"]}`'] for e in events if e["fest"]], ["ID", "Fest-Ereignis", "Wann", "Figur", "Code"])
cho = []
for e in events:
    cho.append(f'#### EV-{e["id"]} · {e["icon"]} {e["t"]}\n\n> {e["text"]}\n')
    cho.append(T([[i + 1, c["l"], c["d"] or "–", f'`{c["ok"]}`' if c["ok"] else "–", f'MG-rescue-{c["mg"]}' if c["mg"] else "–"] for i, c in enumerate(e["ch"])], ["#", "Wahl", "Folge (Spieltext)", "nur wenn", "Minispiel"]))
    if e["follow"]: cho.append("\nFolge-Ereignisse: " + ", ".join(f"EV-{x}" for x in e["follow"]))
    cho.append("")
G["events-choices"] = "\n".join(cho)
G["fest"] = T([[f"`FEST-{m+1:02d}`", MON[m], f["n"], f["s"], "ja (keine Zufallsereignisse)" if f["big"] else "nein (−1 Zufallsereignis)", ", ".join("EV-" + x for x in f["ids"]), ", ".join("CH-" + x for x in f["guests"]), f'`{f["loc"]}`'] for m, f in sorted(fest.items())],
              ["ID", "Monat", "Fest", "Untertitel", "Großfest", "Ereignisse", "Gäste (80 %)", "Code"])
G["goals"] = T([[f"`GOAL-{n+1:02d}`", MON[n], gl["t"], f'`{gl["chk"]}`', f'{gl["rew"]} €', gl["rep"], f'`{gl["loc"]}`'] for n, gl in enumerate(goals)], ["ID", "Monat", "Monatsziel", "Prüfung", "Belohnung J1", "★", "Code"])
G["perks"] = T([[f'`PERK-{p["id"]}`', f'CH-{p["who"]}', f'{p["e"]} {p["n"]}', p["d"], p["min"], dict(y="1×/Jahr", m="1×/Monat", once="einmalig")[p["per"]], f'`{p["loc"]}`'] for p in XC.perks], ["ID", "Figur", "Aktion", "Wirkung", "ab ♥", "Takt", "Code"])
G["deals"] = T([[f"`DEAL-{k}`", v] for k, v in XC.deals.items()], ["ID", "Deal (DEALN)"])
G["shop"] = T([[f'`SHOP-{x["id"]}`', x["n"], x["d"], x["cost"] + " €", ("MIN-" if x["at"] in [m["id"] for m in minors] else "PIN-") + x["at"], f'`{x["loc"]}`'] for x in shop], ["ID", "Artikel", "Wirkung", "Preis", "Ort", "Code"])
G["minors"] = "\n\n".join(f'#### MIN-{m["id"]} · {m["e"]} {m["n"]} ({m["map"]})\n\n' + T([[e["t"], e["l"], e["d"] or "–", "ja" if e["ok"] else "–", f'`{e["loc"]}`'] for e in m["enc"]], ["Begegnung", "Aktion", "Folge", "Bedingung", "Code"]) for m in minors)
G["scenes"] = T([[f'`LOC-{sc["id"]}`', sc["n"], sc["sub"] or "–", sc["venue"], ", ".join(f'HOT-{sc["id"]}-{h["id"].replace("pin:", "pin-")} ({h["l"]}){"" if h["handled"] else " ⚠ ohne Handler"}' for h in sc["hots"]),
                 ", ".join("CH-" + c["id"] for c in XC.chars if sc["venue"] in c["at"]) or "–", f'`{sc["loc"]}`'] for sc in scenes], ["ID", "Szene", "Untertitel", "venue", "Hotspots", "Stammgäste (at)", "Code"])
G["pins"] = T([[f'`PIN-{p["id"]}`', p["map"], p["label"], p["role"], f'LOC-{p["scene"]}' if p["scene"] else "Sheet „pin“", f'`{p["loc"]}`'] for p in pins], ["ID", "Karte", "Label", "Rolle", "öffnet", "Code"])
G["minigames"] = T([[f'`MG-{m["id"]}`', m["fn"], f'`{m["loc"]}`'] for m in minigames], ["ID", "Komponente", "Code"])
G["ui"] = T([[f"`UI-{k}`"] for k in sheets], ["Sheet-ID"])
G["save"] = T([[f'`SAVE-{f_["name"]}`', f'`{f_["type"]}`'] for f_ in gfields], ["ID", "Typ"]) + "\n\n**Stats-Felder:** " + ", ".join(f"`{x}`" for x in stats) + "\n\n**Grove-Felder:** " + ", ".join(f"`{a}`" for a, b in grove) + \
    "\n\n**Flags `g.fl.*` (im Code gefunden):** " + ", ".join(f"`{x}`" for x in flags) + "\n\n**Monats-Sperren `g.acts` (Präfixe):** " + ", ".join(f"`{x}`" for x in acts) + "\n\n**localStorage-Schlüssel:** " + ", ".join(f"`{x}`" for x in storekeys)
G["eco"] = T([[f'`ECO-{x["id"]}`', f'`{x["loc"]}`'] for x in eco], ["ID", "Code"])
G["characters"] = XC.md(XC.chars)
G["counts"] = T([[k, v] for k, v in [("Figuren", len(XC.chars)), ("Ereignisse gesamt", len(events)), ("· davon Zufall", sum(1 for e in events if not e["fest"] and e["months"])), ("· davon Katastrophen", sum(1 for e in events if e["dis"])),
              ("· davon Fest-Ereignisse", sum(1 for e in events if e["fest"])), ("· nur als Folge/fix", sum(1 for e in events if not e["fest"] and not e["months"])), ("Wahlmöglichkeiten", sum(len(e["ch"]) for e in events)),
              ("Feste", len(fest)), ("Monatsziele", len(goals)), ("Perks", len(XC.perks)), ("Deals", len(XC.deals)), ("Szenen", len(scenes)), ("Hotspots", sum(len(s_["hots"]) for s_ in scenes)), ("Karten-Pins", len(pins)),
              ("Kleine Orte", len(minors)), ("Begegnungen", sum(len(m["enc"]) for m in minors)), ("Laden-Artikel", len(shop)), ("Minispiele", len(minigames)), ("Sheets (UI)", len(sheets)), ("Spielstand-Felder G", len(gfields))]], ["Inventar", "Anzahl"])

def fill(text):
    def rep(m):
        k = m.group(1); return f"<!-- BEGIN GENERATED:{k} -->\n{G[k]}\n<!-- END GENERATED:{k} -->" if k in G else m.group(0)
    return re.sub(r"<!-- BEGIN GENERATED:([\w-]+) -->.*?<!-- END GENERATED:\1 -->", rep, text, flags=re.S)
check = "--check" in sys.argv
problems = []; mdfiles = sorted(glob.glob(DOCS + "/*.md")); stale = []
for f in mdfiles:
    t = open(f, encoding="utf-8").read(); n = fill(t)
    if n != t:
        stale.append(os.path.basename(f))
        if not check: open(f, "w", encoding="utf-8").write(n)
alltext = "\n".join(open(f, encoding="utf-8").read() for f in mdfiles)
PFX = r"(?:CH|EV|MG|LOC|HOT|PIN|MIN|SHOP|PERK|DEAL|FEST|GOAL|UI|SAVE|ECO)"
found = set(re.findall(r"(?<![\w-])(%s-[\w-]*\w)" % PFX, alltext))
missing = sorted(i for i in ids if i not in found)
phantom = sorted(i for i in found if i not in ids)
unreach = [e["id"] for e in events if e["trigger"][0].startswith("–")]
unhandled = [f'{sc["id"]}:{h["id"]}' for sc in scenes for h in sc["hots"] if not h["handled"]]
rep = [f"Code-IDs: {len(ids)}  ·  in docs gefunden: {len(ids) - len(missing)}",
       f"Fehlend in docs ({len(missing)}): " + (", ".join(missing) or "–"),
       f"Phantom-IDs in docs ({len(phantom)}): " + (", ".join(phantom) or "–"),
       f"Veraltete GENERATED-Blöcke: " + (", ".join(stale) or "–") + (" (erneuert)" if stale and not check else ""),
       f"Ereignisse ohne Auslöser: " + (", ".join(unreach) or "–"),
       f"Hotspots ohne Handler: " + (", ".join(unhandled) or "–"),
       f"Minispiel-Komponenten im Code: " + ", ".join(mini_fns)]
if not check:
    json.dump(inv, open(os.path.join(DOCS, "data", "inventory.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(ids, open(os.path.join(DOCS, "data", "ids.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(os.path.join(DOCS, "data", "reconcile.txt"), "w", encoding="utf-8").write("\n".join(rep) + "\n")
print("\n".join(rep))
sys.exit(1 if check and (missing or phantom or stale) else 0)
