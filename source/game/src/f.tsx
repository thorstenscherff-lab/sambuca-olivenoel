type Pin = { id: string; label: string; role: string; x: number; y: number; scene?: string; below?: boolean; al?: "l"; e?: string };
const PS: Pin[] = [
  { id: "casa", label: "Casa (Via Delfino)", role: "Dein Büro", x: 69.64, y: 38.94, scene: "buero" },
  { id: "banca", label: "Sicilbanca", role: "Kredit", x: 58.85, y: 63.77, scene: "banca" },
  { id: "muni", label: "Municipio", role: "Rathaus", x: 71.5, y: 49.83, scene: "rathaus" },
  { id: "palazzo", label: "Teatro & Palazzo", role: "Don Calogero · Haine", x: 47.87, y: 81.51, scene: "teatro" },
  { id: "caffe", label: "Bar del Corso", role: "Leute & Gerüchte", x: 59.5, y: 65.57, scene: "bar", below: true },
  { id: "chiesa", label: "Chiesa Madre", role: "Gemeinde", x: 83.02, y: 36.39, scene: "chiesa" },
  { id: "belv", label: "Belvedere", role: "Ausblick", x: 89.55, y: 33.58, scene: "belv" },
  // v0.8 (FB-07/OI-019): Santuario della Madonna dell'Udienza – echte Lage (OSM), Karten-%
  { id: "santuario", label: "Santuario", role: "Madonna dell'Udienza", x: 65.56, y: 59.44, scene: "santuario", below: true },
];
const PU: Pin[] = [
  { id: "torre", label: "Torre di Pandolfina", role: "Turis Hang", x: 69.48, y: 20.89, scene: "ruine", al: "l" },
  { id: "frantoio", label: "Frantoio", role: "Ölmühle", x: 82.3, y: 53.41, scene: "frantoio" },
  { id: "hain", label: "Dein Hain", role: "Olivenbäume", x: 76.02, y: 21.74, scene: "hain" },
  { id: "feudo", label: "Feudo Arancio", role: "Großkunde", x: 18.07, y: 60.9, scene: "feudo" },
  { id: "lago", label: "Lago Arancio", role: "Wasser · Villen", x: 54.74, y: 84.54, scene: "lago" },
  { id: "sambuca", label: "Sambuca", role: "Zur Stadt", x: 88.3, y: 68.2 },
  // v0.8 (FB-15/OI-027): Hotel Don Giovanni – echte Lage, Karten-%
  { id: "hotel", label: "Hotel Don Giovanni", role: "Pool · Küche", x: 64.87, y: 39.88, scene: "hotel" },
  // v0.8 (FB-18/OI-028): Lido Boomerang liegt am Meer außerhalb der Karte → Wegweiser am linken Rand, Höhe SP41 (13,44 % / 73,87 %)
  { id: "lido", label: "→ Lido Boomerang", role: "Meer · über SP41", x: 7.5, y: 73.87, scene: "lido" },
];
// v0.8 (FB-27/OI-033): Symbol je Ort für die herausgezoomte Karte (nur Icons, glitzernd)
const PIN_E: Record<string, string> = { casa: "🏠", banca: "🏦", muni: "🏛️", palazzo: "🎭", caffe: "☕", chiesa: "⛪", belv: "🔭", santuario: "✨", torre: "🗼", frantoio: "🫒", hain: "🌳", feudo: "🍷", lago: "⛵", sambuca: "🏘️", hotel: "🏊", lido: "🏖️" };
// v0.8.1 (FB-29/OI-036): bunte Orts-Icons auf allen Zoomstufen statt Sprechblasen; Personen-Badge; Überlappungsfreies Layout
const PIN_COL: Record<string, string> = { casa: "#f59e0b", banca: "#10b981", muni: "#3b82f6", palazzo: "#a855f7", caffe: "#ef6c3a", chiesa: "#eab308", belv: "#06b6d4", santuario: "#ec4899", torre: "#d97706", frantoio: "#65a30d", hain: "#16a34a", feudo: "#be123c", lago: "#0ea5e9", sambuca: "#f97316", hotel: "#14b8a6", lido: "#38bdf8" };
type LB = { k: string; x: number; y: number; w: number; h: number; m: number };
// Verschiebt kollidierende Boxen (px, Mittelpunkt) deterministisch auseinander; m = Beweglichkeit (0 = fest)
function layoutBoxes(bs: LB[], W: number, H: number, gap = 4): Record<string, [number, number]> {
  const p = bs.map((b) => ({ ...b }));
  for (let it = 0; it < 80; it++) { let moved = false;
    for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) { const a = p[i], b = p[j];
      const ox = (a.w + b.w) / 2 + gap - Math.abs(a.x - b.x), oy = (a.h + b.h) / 2 + gap - Math.abs(a.y - b.y);
      if (ox <= 0 || oy <= 0) continue; moved = true; const tm = a.m + b.m || 1;
      if (ox < oy) { const d = (a.x < b.x || (a.x === b.x && i < j) ? -1 : 1) * ox; a.x += d * a.m / tm; b.x -= d * b.m / tm; }
      else { const d = (a.y < b.y || (a.y === b.y && i < j) ? -1 : 1) * oy; a.y += d * a.m / tm; b.y -= d * b.m / tm; } }
    p.forEach((b) => { b.x = Math.max(b.w / 2, Math.min(W - b.w / 2, b.x)); b.y = Math.max(b.h / 2, Math.min(H - b.h / 2, b.y)); });
    if (!moved) break; }
  const r: Record<string, [number, number]> = {}; p.forEach((b) => { r[b.k] = [b.x, b.y]; }); return r;
}
// v0.8 (FB-08/09/11/OI-020): Beschreibung je Aktionspunkt in Szenen – [Titel, Erklärung, Kosten €, ⏳]
const SPOT_INFO: Record<string, [string, string, number, number]> = {
  caffe: ["☕ Caffè & Gerüchte", "Ein Espresso an der Theke. Du hörst den Dorftratsch: Ölpreis-Trend oder was demnächst passiert.", 2, 0],
  wette: ["📺 Calcio-Wette bei Salvo", `Einsatz 50 €. Chance ${Math.round(BET.p * 100)} %, dass Palermo gewinnt. Auszahlung ${BET.win} € (Quote ${(BET.win / 50).toFixed(1).replace(".", ",")}× = ${BET.win - 50} € Gewinn). Erwartungswert: ${Math.round(BET.p * BET.win - 50)} € pro Wette.`, 50, 1],
  kerze: ["🕯️ Kerze für die Madonna", "Eine Kerze vor der Madonna dell'Udienza. Ansehen ★ +1 und die NÄCHSTE Katastrophe (Sturm, Flut …) wird gemildert.", 5, 0],
  spende: ["💶 Opferstock", "150 € für die Kirche: Ansehen ★ +3 und Padre Vito ♥+5.", 150, 0],
  beichte: ["🙏 Beichtstuhl", "Eine Viertelstunde bei Padre Vito. Gut fürs Gewissen und für die Beziehung zum Padre.", 0, 1],
  aushang: ["📌 Aushang am Rathaus", "Was steht am Brett? Nächstes Fest und wie viele Haine Don Calogero gerade anbietet.", 0, 0],
  pooldeal: ["🏊 Hotelküche", "Der Küchenchef kauft 20 l Öl zu 160 % des Marktpreises (braucht 20 l).", 0, 1],
  aperitivo: ["🍹 Aperitivo an der Poolbar", "12 € für einen Spritz. Ansehen ★ +1, und wenn du Gäste kennst (Klaus, Dolores, Giusi), ♥+4 bei einer/einem davon.", 12, 0],
  strand: ["🏖️ Strandtag", "Ein Tag am Meer. Kostet 20 € und 1 ⏳ jetzt – dafür hast du nächsten Monat +1 ⏳.", 20, 1],
  lidodeal: ["🍤 Lido-Restaurant", "Nur Juni–September: Die Küche kauft 15 l zu 150 % des Marktpreises.", 0, 1],
};
// v0.7.1: Karten = Original-Ausschnitte der Micro-Macro-Karte v12 (300 dpi). Alte Spielkoordinaten (Minors, Haine, Angebote) werden umgerechnet.
const MAPAR = { s: 4961 / 3897, u: 4600 / 3000 };
const cvXY = (m: "s" | "u", x: number, y: number): [number, number] => m === "s" ? [x * 0.75267 + 24.7128, y * 0.53888 + 15.8327] : [x * 0.9913, y * 0.85533 + 6.6667];
const PIN_TXT: Record<string, string> = {
  belv: "Der Blick über das Belice-Tal bis zum Lago Arancio. Irgendwo da unten wachsen deine Bäume.",
  torre: "Der Wachturm aus dem 15. Jahrhundert. Gleich daneben: Zio Turis Hang – und sein Misstrauen.",
  frantoio: "Die Ölmühle: Hier wird aus Oliven Öl. Rosalia hat das Sagen.",
  feudo: "Das große Weingut kauft Öl in jeder Menge – wenn du gut feilschst.",
  lago: "Der Stausee. Wasserrechte, Cantine und die Villen der Fremden.",
  banca: "Die Sicilbanca leiht dir Geld zu 1 % pro Monat.",
  hain: "Deine Bäume. Hier entscheidet sich, ob das Jahr gut wird.",
  palazzo: "Don Calogero verwaltet Land von Erben, die in Turin und Toronto leben.",
};
const store = { get: (k: string): string | null => { try { return window.localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string): void => { try { window.localStorage.setItem(k, v); } catch { } }, del: (k: string): void => { try { window.localStorage.removeItem(k); } catch { } } };
const buzz = (ms: number = 12): void => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch { } };
const SAVE = "sambuca5_save";
type Sheet = null | { k: "missions" } | { k: "tel" } | { k: "regal" } | { k: "kal" } | { k: "person"; id: string } | { k: "talk"; id: string; mode: "meet" | "chat" | "call" }
  | { k: "mg"; t: "h" | "p" | "s" | "r"; id?: string; n?: number; kind?: string } | { k: "pin"; id: string } | { k: "minor"; id: string } | { k: "shop"; at: string } | { k: "sindaco" } | { k: "spot"; id: string }
  | { k: "report"; lines: string[] } | { k: "year" } | { k: "end" } | { k: "log" };

export default function SambucaGame(): ReactNode {
  const [g, setG] = useState<G | null>(null); const [boot, setBoot] = useState(false);
  const [scr, setScr] = useState<"buero" | "stadt" | "umland" | "tal">("buero"); const [scene, setScene] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null); const [toast, setToast] = useState<string>(""); const [splash, setSplash] = useState<number>(-1);
  const [name, setName] = useState<string>(""); const [hs, setHs] = useState<HS[]>([]);
  const [conf, setConf] = useState(false); const [W, setW] = useState(390); const [VH, setVH] = useState(844);
  const mapRef = useRef<HTMLDivElement | null>(null); const [mz, setMz] = useState(1); const pinch = useRef<{ d: number; z: number } | null>(null);
  useEffect(() => {
    const f = (): void => { setW(Math.min(window.innerWidth, 520)); setVH(window.innerHeight); }; f(); window.addEventListener("resize", f);
    try { const s = store.get(SAVE); if (s) { const x = JSON.parse(s) as G; if (x && x.v === 5) setG(x); } } catch { }
    setName(store.get("sambuca5_name") || ""); setHs(hsLoad()); setBoot(true);
    return () => window.removeEventListener("resize", f);
  }, []);
  useEffect(() => { if (boot) { if (g) store.set(SAVE, JSON.stringify(g)); } }, [g, boot]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { setMz(1); }, [scr]);
  useEffect(() => { if (!mapRef.current) return; const el = mapRef.current; el.scrollLeft = (el.scrollWidth - el.clientWidth) * (scr === "stadt" ? 0.75 : 0.7); el.scrollTop = 0; }, [scr, scene]);
  const run = (a: A): void => {
    if (!g) return; const before = g; const n = act(g, a); setG(n);
    if (n.log[0] !== before.log[0] && n.log.length) setToast(n.log[0]);
    if (n.used.length) store.set("sambuca5_seen", JSON.stringify(Array.from(new Set([...n.used, ...(n.prev || [])])).slice(-40)));
    if (a.k === "end" && n !== before) {
      const k = n.log.length - before.log.length; const lines = n.log.slice(0, Math.max(1, Math.min(k + 2, 14)));
      setScene(null); setScr("buero");
      if (n.over) { setHs(hsPut(n, name)); setSheet({ k: "end" }); }
      else if (n.y > before.y) { setHs(hsPut(n, name)); setSheet({ k: "year" }); }
      else setSheet({ k: "report", lines });
      if (!n.over && FEST[n.m]) setSplash(n.m);
    }
    if (n.over && !before.over && a.k !== "end") { setHs(hsPut(n, name)); setSheet({ k: "end" }); }
  };
  const start = (): void => { let seen: string[] = []; try { seen = JSON.parse(store.get("sambuca5_seen") || "[]") as string[]; } catch { } const n = newGame(seen); store.set("sambuca5_name", name); setG(n); setScr("buero"); setScene(null); setSheet(null); setSplash(-1); };

  const css = <style>{CSS + CSS4}</style>;
  if (!boot) return <div className="sb3" style={{ background: C.bar, minHeight: "100vh" }}>{css}</div>;
  // ---------- Intro ----------
  if (!g) return <div className="sb3" style={{ minHeight: "100vh", background: `linear-gradient(180deg,rgba(23,11,38,.2),${C.bar} 70%), url(${IMG_SC.start}) center top/cover no-repeat`, color: "#fff", fontFamily: SANS, padding: "40px 18px 30px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 520, margin: "0 auto" }}>{css}
    <div className="gta" style={{ fontSize: 50, color: C.fg, lineHeight: 0.95, marginTop: 120 }}>SAMBUCA</div>
    <div className="gta" style={{ fontSize: 22, color: C.gold }}>DAS ÖL DER MADONNA · v0.8.2</div>
    <p style={{ margin: 0, fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,.9)" }}>Du erbst einen verwilderten Olivenhain bei Sambuca di Sicilia. Lerne das Dorf kennen, überlebe Stürme, Fliegen und Feste – Jahr für Jahr.</p>
    <div style={{ fontWeight: 900, fontSize: 18, color: C.gold, textShadow: "0 2px 6px rgba(0,0,0,.85)" }}>🏆 Werde der größte Olivenöl-Mogul Sambucas!</div>
    <label style={{ fontWeight: 700, fontSize: 14 }}>Dein Name für den Highscore
      <input value={name} maxLength={18} onChange={(e) => setName(e.target.value)} placeholder="z. B. Thorsten" style={{ display: "block", width: "100%", marginTop: 4, padding: "12px 14px", fontSize: 16, borderRadius: 12, border: "2px solid #6b4a90", background: C.panel, color: "#fff" }} /></label>
    <button onClick={start} style={bigBtn(C.pink)}>▶ Neues Spiel</button>
    <LiveHS name={name} wealth={0} years={0} local={hs} me="" />
    {hs.length > 0 && <HSList hs={hs} me="" />}
  </div>;

  const HUD = 62, NAV = 64; const H = VH - HUD - NAV; const pend = pendingEv(g).length; const fest = FEST[g.m];
  const sc = score(g);
  const open = (s: Sheet): void => { buzz(); setSheet(s); };
  const onHot = (h: string): void => {
    buzz();
    switch (h) {
      case "pc": open({ k: "missions" }); break; case "tel": open({ k: "tel" }); break; case "regal": open({ k: "regal" }); break; case "kal": open({ k: "kal" }); break;
      case "fenster": setScr("stadt"); setScene(null); break; case "tuer": setScr("umland"); setScene(null); break;
      case "schalter": open({ k: "shop", at: "muni" }); break; case "sindaco": open({ k: "sindaco" }); break;
      case "aushang": case "caffe": case "wette": case "kerze": case "spende": case "beichte": case "pooldeal": case "aperitivo": case "strand": case "lidodeal": open({ k: "spot", id: h }); break;
      case "zeitung": open({ k: "regal" }); break; case "altar": setToast("✨ Die Madonna dell'Udienza (16. Jh.). Am 3. Sonntag im Mai wird sie durch die Gassen getragen – das große Fest."); break;
      case "prog": open({ k: "missions" }); break;
      default: if (h.startsWith("pin:")) open({ k: "pin", id: h.slice(4) });
    }
  };
  const person = (id: string): void => open({ k: "person", id });
  const tabs: [typeof scr, string, string][] = [["buero", "🏠", "Büro"], ["stadt", "🏘️", "Stadt"], ["umland", "🌄", "Umland"], ["tal", "🏆", "Tal"]];
  // ---------- Karte ----------
  const mapView = (which: "s" | "u"): ReactNode => {
    const z = mz; const mh = Math.round(H * z); const mw = Math.round(H * MAPAR[which] * z); const pins = which === "s" ? PS : PU;
    const extra: { id: string; x: number; y: number; l: string; e: string; c: string }[] = [];
    if (which === "u") { g.groves.forEach((x) => { const [cx, cy] = cvXY("u", x.x, x.y); if (Math.hypot(cx - 76.02, cy - 21.74) < 4.5) return; /* v0.8 FB-12: Erbhain = Pin „Dein Hain“ */ extra.push({ id: "g:" + x.id, x: cx, y: cy, l: x.name, e: "🌳", c: C.ok }); }); g.offers.forEach((o) => { const [cx, cy] = cvXY("u", o.x, o.y); extra.push({ id: "o:" + o.id, x: cx, y: cy, l: o.own ? `${o.name} · 🔒 ${CHM[o.own].n}` : `${o.name} · zu haben`, e: o.own ? "🔒" : "🏷️", c: o.own ? C.fg : C.gold }); }); }
    if (which === "s" && fest) extra.push({ id: "festa", x: cvXY("s", 68.8, 73)[0], y: cvXY("s", 68.8, 73)[1], l: fest.n, e: "🎆", c: C.pink });
    const zoomTo = (nz: number): void => { const el = mapRef.current; const c = Math.max(1, Math.min(4, nz)); if (el) { const fx = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth, fy = (el.scrollTop + el.clientHeight / 2) / el.scrollHeight; requestAnimationFrame(() => { el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2; el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2; }); } setMz(c); };
    const tdist = (e: React.TouchEvent): number => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    const zb = { width: 44, height: 44, borderRadius: 22, border: "2px solid #000", background: C.bar, color: "#fff", fontSize: 24, fontWeight: 900, boxShadow: "3px 3px 0 #000", padding: 0, cursor: "pointer" };
    return <div style={{ position: "relative", width: W, height: H }}><div ref={mapRef} data-map={which} onTouchStart={(e) => { if (e.touches.length === 2) pinch.current = { d: tdist(e), z }; }} onTouchMove={(e) => { if (e.touches.length === 2 && pinch.current) { const nz = Math.max(1, Math.min(4, pinch.current.z * tdist(e) / pinch.current.d)); if (Math.abs(nz - z) > 0.04) zoomTo(nz); } }} onTouchEnd={() => { pinch.current = null; }} style={{ width: W, height: H, overflow: "auto", background: "#0d0618", touchAction: "pan-x pan-y" }}>
      <div style={{ position: "relative", width: mw, height: mh }}>
        <img src={which === "s" ? IMG_S : IMG_U} alt={which === "s" ? "Stadtplan Sambuca" : "Umland Sambuca"} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", userSelect: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(139,92,246,.22),rgba(255,79,160,.16))", mixBlendMode: "multiply", pointerEvents: "none" }} />
        {(() => { const lab = z >= 1.6; const IC = lab ? 50 : 46;
          const pinW = (l: string): number => lab ? Math.max(IC, Math.min(150, l.length * 6.6 + 14)) : IC; const pinH = lab ? IC + 20 : IC;
          const bs: LB[] = [];
          MINOR.filter((m) => m.map === which).forEach((m) => { const [mx, my] = m.px || cvXY(which, m.x, m.y); bs.push({ k: "m:" + m.id, x: mx / 100 * mw, y: my / 100 * mh, w: 30, h: 30, m: 1 }); });
          pins.forEach((p) => bs.push({ k: "p:" + p.id, x: p.x / 100 * mw, y: p.y / 100 * mh + (lab ? 10 : 0), w: pinW(p.label), h: pinH, m: 0.6 }));
          extra.forEach((p) => bs.push({ k: "e:" + p.id, x: p.x / 100 * mw, y: p.y / 100 * mh + (lab ? 9 : 0), w: lab ? Math.max(40, Math.min(150, p.l.length * 6.2 + 12)) : 40, h: lab ? 58 : 40, m: 0.8 }));
          const L = layoutBoxes(bs, mw, mh);
          const lead = (k: string, x0: number, y0: number): ReactNode => { const [x, y] = L[k]; const d = Math.hypot(x - x0, y - y0); if (d < 8) return null; return <svg key={"l" + k} style={{ position: "absolute", left: 0, top: 0, width: mw, height: mh, pointerEvents: "none", overflow: "visible" }}><line x1={x0} y1={y0} x2={x} y2={y} stroke="#fff" strokeWidth={2} strokeDasharray="3 3" opacity={0.85} /><circle cx={x0} cy={y0} r={4} fill="#fff" stroke="#000" strokeWidth={1.5} /></svg>; };
          const go = (p: Pin): void => { buzz(); if (p.scene) { if (p.scene === "buero") { setScr("buero"); setScene(null); } else setScene(p.scene); } else if (p.id === "sambuca") { setScr("stadt"); setScene(null); } else open({ k: "pin", id: p.id }); };
          return <>
          {MINOR.filter((m) => m.map === which).map((m) => { const [mx, my] = m.px || cvXY(which, m.x, m.y); const [x, y] = L["m:" + m.id]; return <span key={m.id} style={{ display: "contents" }}>{lead("m:" + m.id, mx / 100 * mw, my / 100 * mh)}<button data-minor={m.id} data-ax={mx} data-ay={my} onClick={() => open({ k: "minor", id: m.id })} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: 15, border: "2px solid #000", background: g.acts.includes("enc_" + m.id) ? "#9a8aa8" : "#fff", fontSize: 15, padding: 0, boxShadow: "2px 2px 0 rgba(0,0,0,.5)", cursor: "pointer" }} aria-label={m.n}>{m.e}</button></span>; })}
          {pins.map((p) => { const [x, y] = L["p:" + p.id]; const n = p.scene && p.scene !== "buero" && SCN[p.scene] ? present(g, SCN[p.scene].venue).length : 0; const col = PIN_COL[p.id] || C.pink;
            return <span key={p.id} style={{ display: "contents" }}>{lead("p:" + p.id, p.x / 100 * mw, p.y / 100 * mh)}<button data-pin={p.id} data-people={n} data-ax={p.x} data-ay={p.y} aria-label={p.label + (n ? ` · ${n} Person${n > 1 ? "en" : ""} da` : "")} onClick={() => go(p)} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: pinW(p.label), height: pinH, background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
              <span style={{ position: "relative", width: IC, height: IC, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff8 0, ${col} 45%, ${col} 100%)`, border: "3px solid #fff", boxShadow: "0 3px 10px rgba(0,0,0,.65)", fontSize: lab ? 26 : 24, display: "flex", alignItems: "center", justifyContent: "center", animation: "sbGlint 2.4s infinite", flexShrink: 0 }}>{PIN_E[p.id] || "📍"}
                {n > 0 && <span data-badge="person" style={{ position: "absolute", right: -6, top: -6, minWidth: 22, height: 22, borderRadius: 11, background: "#fff", color: "#1a0b2e", border: `2px solid ${col}`, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", boxShadow: "0 1px 4px rgba(0,0,0,.6)", lineHeight: 1 }}>👤{n > 1 ? n : ""}</span>}</span>
              {lab && <span style={{ marginTop: 2, fontSize: 11, fontWeight: 800, color: "#fff", background: "rgba(10,4,20,.82)", padding: "1px 6px", borderRadius: 6, whiteSpace: "nowrap", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</span>}</button></span>; })}
          {extra.map((p) => { const [x, y] = L["e:" + p.id]; return <span key={p.id} style={{ display: "contents" }}>{lead("e:" + p.id, p.x / 100 * mw, p.y / 100 * mh)}<button data-pin={p.id} data-ax={p.x} data-ay={p.y} aria-label={p.l} onClick={() => { buzz(); if (p.id === "festa") setScene("fest"); else open({ k: "pin", id: p.id }); }} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ width: 40, height: 40, borderRadius: 20, background: C.bar, border: `3px solid ${p.c}`, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", animation: p.id === "festa" ? "sbPulse 1.4s infinite" : undefined }}>{p.e}</span>
            {lab && <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(0,0,0,.78)", color: p.c, padding: "1px 6px", borderRadius: 6, whiteSpace: "nowrap", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>{p.l}</span>}</button></span>; })}
          </>; })()}
      </div></div>
      <div style={{ position: "absolute", right: 10, bottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <button data-zoom="in" aria-label="Hineinzoomen" onClick={() => zoomTo(z * 1.6)} style={zb}>+</button>
        <button data-zoom="out" aria-label="Herauszoomen" onClick={() => zoomTo(z / 1.6)} style={{ ...zb, opacity: z > 1 ? 1 : 0.45 }}>−</button></div></div>;
  };
  // ---------- Inhalt ----------
  let body: ReactNode;
  if (scr === "buero") body = <div style={{ position: "relative" }}>
    <Scene id="buero" g={g} H={H} W={W} onHot={onHot} onPerson={person} badge={{ pc: pend, tel: g.met.filter((x) => !g.talked.includes(x)).length }} />
    <div style={{ position: "absolute", left: 10, right: 10, bottom: 8, background: "rgba(23,11,38,.88)", border: `2px solid ${g.goalDone[g.m] ? C.ok : C.gold}`, borderRadius: 12, padding: "6px 10px", fontSize: 13, fontWeight: 700 }}>🎯 {GOALS[g.m].t} <span style={{ color: C.gold }}>+{eur(GOALS[g.m].rew * (1 + 0.25 * (g.y - 1)))}</span>{pend ? <span style={{ color: C.bad }}> · {pend} Auftrag{pend > 1 ? "e" : ""} offen 💻</span> : null}</div></div>;
  else if ((scr === "stadt" || scr === "umland") && scene) body = <div style={{ position: "relative" }}>
    <Scene id={scene} g={g} H={H} W={W} onHot={onHot} onPerson={person} title={scene === "fest" && fest ? fest.n : undefined} badge={scene === "fest" ? { prog: pend } : undefined} />
    <button onClick={() => setScene(null)} style={{ position: "absolute", right: 10, top: 10, ...bigBtn(C.fg), width: "auto", minHeight: 40, padding: "6px 12px", fontSize: 14 }}>🗺️ Karte</button></div>;
  else if (scr === "stadt") body = mapView("s");
  else if (scr === "umland") body = mapView("u");
  else {
    const rows = [{ n: name || "Du", e: "🫒", v: sc.verm, me: true }, ...RIV.map((r, i) => ({ n: r.n, e: r.e, v: rivalPts(g, i), me: false }))].sort((a, b) => b.v - a.v);
    body = <div style={{ height: H, overflowY: "auto", padding: 14 }}>
      <div className="gta" style={{ fontSize: 28, color: C.fg }}>DAS TAL</div>
      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>Jahr {g.y} · {titel(sc.verm)}</div>
      {rows.map((r, i) => <div key={r.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 6, borderRadius: 12, background: r.me ? "#3a1a5c" : C.card, border: r.me ? `2px solid ${C.pink}` : "2px solid transparent" }}><span><b>{i + 1}.</b> {r.e} {r.n}</span><b style={{ color: r.me ? C.ok : C.fg }}>{eur(r.v)}</b></div>)}
      <div style={{ background: C.card, borderRadius: 12, padding: 10, margin: "10px 0", fontSize: 14 }}>
        <div>💶 Kasse {eur(g.money)} · Kredit {eur(g.debt)}</div><div>🌳 Haine {eur(sc.groves)} · 🫙 Lager & Deals {eur(sc.oil)}</div>
        <div>👥 Bekannt: {g.met.length}/{CHARS.length} · 🤝 Deals: {g.deals.map((d) => DEALN[d] || d).join(", ") || "–"}</div>
        {g.yhist.length > 0 && <div>📊 Vermögen je Jahr: {g.yhist.map((v, i) => `J${i + 1} ${eur(v)}`).join(" · ")}</div>}</div>
      <LiveHS name={name} wealth={0} years={0} local={hs} me={g.run} />
      <HSList hs={hs} me={g.run} />
      <button onClick={() => { if (conf) { setConf(false); run({ k: "retire" }); } else setConf(true); }} style={{ ...bigBtn(conf ? C.bad : "transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 10 }}>{conf ? "Wirklich? Nochmal tippen zum Beenden" : "🏁 Karriere beenden"}</button>
    </div>;
  }
  // ---------- Sheets ----------
  const card: CSSProperties = { background: C.card, borderRadius: 14, padding: 12, marginBottom: 8 };
  const sub = (s: string): ReactNode => <div style={{ fontSize: 12, opacity: 0.75 }}>{s}</div>;
  const btn = (l: string, on: () => void, ok: boolean = true, col: string = C.pink, key?: string): ReactNode => <button key={key || l} disabled={!ok} onClick={on} style={{ ...bigBtn(ok ? col : "#3b2a4f", ok ? "#000" : "#9a8aa8"), marginTop: 6, fontSize: 15, minHeight: 44 }}>{l}</button>;
  const peopleRow = (venue: string): ReactNode => { const l = present(g, venue); if (!l.length) return null; return <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "6px 0 10px" }}>{l.map((id) => <button key={id} data-person={id} onClick={() => person(id)} style={{ background: "transparent", border: "none", padding: 0, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><Portrait id={id} size={50} ring={g.met.includes(id) ? CHM[id].c : "#fff"} /><span style={{ fontSize: 11, fontWeight: 700 }}>{g.met.includes(id) ? CHM[id].n.split(" ")[0] : "❓"}</span></button>)}</div>; };
  const buyOk = (o: Offer): boolean => g.money >= o.price && SEASON.buy.includes(g.m) && (!o.own || (abs(g) >= (o.from || 0) && R(g, o.own) >= 40));
  const evCard = (id: string): ReactNode => { const e = EVM[id]; if (!e) return null; const done = g.pick[id] !== undefined;
    return <div key={id} style={{ ...card, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,.45)", opacity: done ? 0.85 : 1 }}>
      {EV_IMG[id] && <div style={{ height: 120, margin: "-4px -4px 8px", borderRadius: 10, background: `url(${IMG_SC[EV_IMG[id]]}) center 40%/cover` }} />}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>{e.who && g.met.includes(e.who) ? <Portrait id={e.who} size={46} /> : <span style={{ fontSize: 34 }}>{e.icon}</span>}<div><b>{e.icon} {e.t}</b><div style={{ fontSize: 14, marginTop: 3 }}>{e.text}</div></div></div>
      {done ? <div style={{ marginTop: 8, color: C.ok, fontWeight: 700 }}>✔ {g.res[id]}</div> : e.ch.map((c, i) => { const ok = !c.ok || c.ok(g); return <button key={i} data-choice={id + ":" + i} disabled={!ok} onClick={() => { if (c.mg) open({ k: "mg", t: "r", id, n: i, kind: c.mg }); else run({ k: "choice", id, n: i }); }} style={{ display: "block", width: "100%", textAlign: "left", marginTop: 6, padding: "9px 12px", borderRadius: 12, border: `2px solid ${ok ? (c.mg ? C.gold : "#6b4a90") : "#3b2a4f"}`, background: ok ? C.panel : "#1a0d29", color: ok ? "#fff" : "#7a6a88", fontWeight: 700, fontSize: 14 }}>{c.l}{c.d && <span style={{ display: "block", fontSize: 12, fontWeight: 500, color: ok ? C.fg : "#7a6a88" }}>{c.d}</span>}</button>; })}
    </div>; };
  const careList = (only?: string): ReactNode => { const l = todo(g).filter((t) => !only || t.id === only || (!t.id && !only));
    if (!l.length) return <div style={{ opacity: 0.7, fontSize: 14 }}>Gerade nichts zu tun in den Hainen ({SAISON[g.m]}).</div>;
    return l.map((t) => btn(`${t.t}${t.cost ? ` · ${eur(t.cost)}` : ""} · 1 ⏳`, () => { if (t.key === "harvest") open({ k: "mg", t: "h", id: t.id }); else if (t.key === "mill") open({ k: "mg", t: "p" }); else run({ k: t.key, id: t.id }); }, g.ap > 0 && g.money >= t.cost, C.ok, t.key + (t.id || ""))); };
  let sh: ReactNode = null; let shT = "";
  if (sheet) switch (sheet.k) {
    case "missions": shT = fest ? `💻 Aufträge · ${fest.n}` : "💻 Aufträge & E-Mails";
      sh = <>{g.cur.length ? g.cur.map(evCard) : <div style={card}>Keine Nachrichten diesen Monat.</div>}
        <div style={card}><b>🎯 Monatsziel:</b> {GOALS[g.m].t}</div></>; break;
    case "tel": { shT = "☎️ Telefon"; const l = g.met;
      sh = <>{sub("Nur Leute, die du kennst. Telefonieren bringt weniger ♥ als ein Treffen. Kostet 1 ⏳.")}
        {l.map((id) => { const c = CHM[id]; const done = g.talked.includes(id); return <div key={id} style={{ ...card, display: "flex", gap: 10, alignItems: "center" }}><Portrait id={id} size={40} /><div style={{ flex: 1 }}><b>{c.n}</b> <span style={{ color: C.pinkT }}>♥ {R(g, id)}</span>{sub(c.r)}</div>
          <button disabled={done || g.ap < 1} data-call={id} onClick={() => open({ k: "talk", id, mode: "call" })} style={{ ...bigBtn(done || g.ap < 1 ? "#3b2a4f" : C.ok), width: 64, minHeight: 40, fontSize: 18 }}>{done ? "✔" : "☎️"}</button>
          <button onClick={() => person(id)} style={{ ...bigBtn(C.fg), width: 44, minHeight: 40, fontSize: 16 }}>›</button></div>; })}
        <div style={{ ...card, opacity: 0.8, fontSize: 13 }}>Noch {CHARS.length - l.length} Leute im Dorf, die du nicht kennst. Triff sie in der Bar, Kirche, im Rathaus, auf Festen und an kleinen Orten der Karte.</div></>; break; }
    case "regal": { shT = "🗄️ Lager, Haine & Markt"; const mx = Math.max(...g.hist), mn = Math.min(...g.hist);
      // v0.8 (FB-04/OI-016): Status als Chips mit Abstand statt Fließtext
      const chip = (t: string, on: boolean): ReactNode => <span key={t} style={{ display: "inline-block", padding: "5px 10px", margin: "0 6px 6px 0", borderRadius: 999, background: on ? "rgba(74,222,128,.16)" : "rgba(255,255,255,.07)", color: on ? "#bff5cf" : "#d9cfe6", fontSize: 13, fontWeight: 700 }}>{t}</span>;
      const st = offStage(g); const nc = OFFICE_COST[st + 1];
      sh = <><div style={card}><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8, fontSize: 15 }}><span>🫙 <b>{g.oil} l</b> Öl</span><span>⭐ Qualität <b>{g.q}</b></span><span>🫒 <b>{g.olives}</b> kg</span></div>
        <div style={{ marginBottom: 8 }}>💶 Marktpreis <b>{price(g).toFixed(2)} €/l</b> · deiner {unit(g).toFixed(2)} €/l</div>
        <div style={{ fontSize: 12, color: C.fg, margin: "6px 0 4px", fontWeight: 800, letterSpacing: 0.5 }}>AUSRÜSTUNG</div>
        <div>{chip(g.spade > 0 ? `🪓 Spaten ×${g.spade}` : "🪓 kein Spaten (Pflege +25 %)", g.spade > 0)}{chip(`🔧 Rüttler ${g.gear ? (g.fl.cheap ? "(billig)" : "✔") : "–"}`, !!g.gear)}{chip(`👷 Crew ${g.crew ? "✔" : "–"}`, !!g.crew)}{g.wine ? chip(`🍷 ${g.wine} Fl.`, true) : null}</div>
        <div style={{ fontSize: 12, color: C.fg, margin: "6px 0 4px", fontWeight: 800, letterSpacing: 0.5 }}>SCHUTZ</div>
        <div>{chip(g.fl.netz ? `🕸️ Netze ×${g.fl.netz}` : "🕸️ keine Netze", !!g.fl.netz)}{chip(g.fl.drain ? "🚧 Drainage" : "🚧 keine Drainage", !!g.fl.drain)}{chip(g.fl.sand ? `🧱 Sandsäcke ×${g.fl.sand}` : "🧱 keine Sandsäcke", !!g.fl.sand)}{chip(g.water ? "💧 Wasserrecht: Dürre-Schutz, alles bewässert" : "💧 kein Wasserrecht", !!g.water)}{chip(g.fl.dog ? "🐕 Wachhund" : "🐕 kein Wachhund", !!g.fl.dog)}{chip(g.fl.schneise !== undefined && abs(g) - g.fl.schneise < 12 ? `🚜 Brandschneise (noch ${12 - (abs(g) - g.fl.schneise)} Mon.)` : "🚜 keine Brandschneise", !!(g.fl.schneise !== undefined && abs(g) - g.fl.schneise < 12))}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 50, marginTop: 8 }}>{g.hist.map((v, i) => <span key={i} style={{ flex: 1, height: `${20 + ((v - mn) / Math.max(0.01, mx - mn)) * 80}%`, background: i === g.hist.length - 1 ? C.pink : "#6b4a90", borderRadius: 2 }} />)}</div>{sub("Ölpreis der letzten Monate")}</div>
        {g.groves.map((x) => <div key={x.id} style={card}><b>🌳 {x.name}</b> · {x.trees} Bäume · Zustand <b style={{ color: x.cond >= 60 ? C.ok : x.cond >= 35 ? C.gold : C.bad }}>{x.cond} %</b>{x.lease ? ` · Pacht ${x.lease} €` : ""}
          {sub(`${x.prune ? "✂️" : "·"} ${x.fert ? "🌱" : "·"} ${x.irr || g.water ? "💧" : "·"} ${x.traps ? "🪤" : "·"} ${x.harvested ? "🧺 geerntet" : ""}`)}</div>)}
        <b>Arbeit diesen Monat</b>{careList()}
        <div style={card}><b>🏠 Büro: Stufe {st}/4</b>{sub(OFFN[st])}{nc ? btn(`Umziehen: ${OFFN[st + 1].split("·")[1]?.trim() || "Stufe " + (st + 1)} · ${eur(nc)}`, () => run({ k: "office" }), g.money >= nc, C.gold) : sub("Größtes Büro erreicht.")}</div>
        {btn("📜 Tagebuch", () => open({ k: "log" }), true, C.fg)}</>; break; }
    case "kal": shT = `📅 ${YEAR0 + g.y - 1}`;
      sh = <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>{MONATE.map((n, i) => <div key={n} style={{ ...card, padding: 8, marginBottom: 0, border: i === g.m ? `2px solid ${C.pink}` : "2px solid transparent", opacity: i < g.m ? 0.55 : 1 }}><b style={{ fontSize: 13 }}>{n}</b><div style={{ fontSize: 11 }}>{FEST[i] ? "🎆 " + FEST[i].n.split(" ")[0] : SAISON[i]}</div><div style={{ fontSize: 11 }}>{g.goalDone[i] === true ? "🎯✔" : g.goalDone[i] === false ? "🎯✗" : ""}</div></div>)}</div>; break;
    case "person": { const c = CHM[sheet.id]; const met = g.met.includes(c.id); const tried = g.fl["try_" + c.id] === abs(g); const needOk = !c.need || c.need[1](g);
      shT = met ? c.n : "❓ Unbekannt";
      sh = <><div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}><Portrait id={c.id} size={80} tilt={-3} ring={c.c} /><div><b style={{ fontSize: 18 }}>{met ? c.n : c.r.split("·")[0]}</b>{sub(met ? c.r : `Man nennt sie/ihn „${c.n}“`)}
        {met ? <div style={{ color: C.pinkT, fontWeight: 800 }}>♥ {R(g, c.id)}</div> : <div style={{ color: C.gold, fontSize: 13 }}>Schwierigkeit {"★".repeat(c.diff)}{"☆".repeat(5 - c.diff)}</div>}
        <div style={{ fontStyle: "italic", fontSize: 14, marginTop: 4 }}>{met ? (R(g, c.id) >= 60 ? c.hi : R(g, c.id) >= 35 ? c.mid : c.lo) : c.lo}</div></div></div>
        {!met ? <>{!needOk && <div style={{ ...card, color: C.bad }}>Nicht interessiert an dir. Nötig: {c.need ? c.need[0] : ""}</div>}
          {sub(`Tipp: Sie/er mag ${c.likes.map((k) => TOP[k][0]).join(" ")} … vielleicht. Hör genau hin.`)}
          {btn(tried ? "Heute abgeblitzt – nächsten Monat" : "🤝 Kennenlernen (Plaudern) · 1 ⏳", () => open({ k: "talk", id: c.id, mode: "meet" }), needOk && !tried && g.ap > 0)}</>
          : <>{btn(g.talked.includes(c.id) ? "✔ Diesen Monat schon geplaudert" : "💬 Plaudern · 1 ⏳", () => open({ k: "talk", id: c.id, mode: "chat" }), !g.talked.includes(c.id) && g.ap > 0)}
            {btn("🎁 5 l Öl schenken (♥ +6)", () => run({ k: "gift", id: c.id }), g.oil >= 5 && !g.acts.includes("gift_" + c.id), C.fg)}
            <b style={{ display: "block", marginTop: 10 }}>Was {c.n.split(" ")[0]} für dich tun kann</b>
            {PERKS.filter((p) => p.who === c.id).map((p) => { const ok = perkOk(g, p) && g.ap > 0; const lock = R(g, c.id) < p.min; return <div key={p.id} style={{ ...card, opacity: lock ? 0.6 : 1, marginTop: 6 }}><b>{p.e} {p.n}</b>{sub(`${p.d}${p.cost ? ` · ${eur(p.cost(g))}` : ""} · ${lock ? `🔒 ab ♥ ${p.min}` : p.per === "y" ? "1×/Jahr" : p.per === "m" ? "1×/Monat" : "einmalig"}`)}
              {g.notes?.["pk_" + p.id] ? <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 10, background: "rgba(74,222,128,.12)", fontSize: 14 }}>✔ {g.notes["pk_" + p.id]}</div> : !lock && btn(ok ? "Machen · 1 ⏳" : "gerade nicht möglich", () => run({ k: "perk", id: p.id }), ok, C.ok)}</div>; })}</>}</>; break; }
    case "talk": shT = sheet.mode === "call" ? "☎️ Telefonat" : "💬 Plaudern";
      sh = <MiniTalk key={sheet.id + sheet.mode} id={sheet.id} mode={sheet.mode} onCancel={() => setSheet(null)} onDone={(s) => { const id = sheet.id; run({ k: sheet.mode === "meet" ? "meet" : sheet.mode, id, f: s }); setSheet({ k: "person", id }); }} />; break;
    case "mg": shT = sheet.t === "h" ? "🧺 Ernte" : sheet.t === "p" ? "⚙️ Frantoio" : sheet.t === "s" ? "🤝 Feilschen" : "🚨 Rettung!";
      if (sheet.t === "h") { const gr = g.groves.find((x) => x.id === sheet.id); sh = g.gear ? <MiniShaker name={gr ? gr.name : ""} cheap={!!g.fl.cheap} onDone={(f) => { run({ k: "harvest", id: sheet.id, f }); setSheet(null); }} onSkip={() => { run({ k: "harvest", id: sheet.id, f: 0.85 }); setSheet(null); }} /> : <MiniHarvest name={gr ? gr.name : ""} kamm={!!g.fl.kamm} crew={g.crew > 0} onDone={(f) => { run({ k: "harvest", id: sheet.id, f }); setSheet(null); }} onSkip={() => { run({ k: "harvest", id: sheet.id, f: 0.85 }); setSheet(null); }} />; }
      else if (sheet.t === "p") sh = <MiniPress kg={g.olives} presse={!!g.fl.presse} onDone={(f, q) => { run({ k: "mill", f, q }); setSheet(null); }} />;
      else if (sheet.t === "s") sh = <MiniHaggle oil={g.oil} unit={unit(g)} limit={1.12 + g.rep / 500 + R(g, "giusi") / 600} who="Einkäufer vom Feudo Arancio" onDone={(f, n) => { run({ k: "sell", f, n }); setSheet(null); }} />;
      else sh = <MiniRescue kind={sheet.kind || "sturm"} netz={!!g.fl.netz} sand={!!g.fl.sand} drain={!!g.fl.drain} onDone={(s) => { run({ k: "choice", id: sheet.id, n: sheet.n, f: s }); setSheet({ k: "missions" }); }} />;
      break;
    case "pin": { const id = sheet.id;
      if (id.startsWith("g:")) { const gr = g.groves.find((x) => "g:" + x.id === id); if (gr) { shT = "🌳 " + gr.name; sh = <><div style={card}>{gr.trees} Bäume · Zustand {gr.cond} %{gr.lease ? ` · Pacht ${gr.lease} €/Monat` : " · Eigentum"}</div>{careList(gr.id)}{id === "g:erbe" && peopleRow("torre")}</>; } }
      else if (id.startsWith("o:")) { const o = g.offers.find((x) => "o:" + x.id === id); if (o) { shT = "🏷️ " + o.name; sh = <><div style={card}>{o.trees} Bäume · Zustand {o.cond} %<br />Kauf {eur(o.price)} oder Pacht {o.lease} €/Monat<br />{o.own ? <span style={{ color: C.fg }}>🔒 Besitz von {CHM[o.own].n} – verkauft erst ab Jahr {Math.floor((o.from || 0) / 12) + 1} und ab ♥ 40</span> : <span style={{ color: C.bad }}>⚔️ {RIV[o.rival].n} will ihn bis Ende {MONATE[o.until]}!</span>}</div>{sub("Verhandelt wird im Palazzo Panitteri (Stadt) bei Don Calogero – oder direkt hier.")}
        {btn(`Kaufen · ${eur(o.price)}`, () => { run({ k: "buy", id: o.id }); setSheet(null); }, buyOk(o))}{!o.own && btn(`Pachten · ${o.lease} €/Monat`, () => { run({ k: "lease", id: o.id }); setSheet(null); }, SEASON.buy.includes(g.m), C.fg)}</>; } }
      else { const P = [...PS, ...PU].find((x) => x.id === id); shT = P ? P.label : id;
        sh = <><div style={{ fontSize: 14, marginBottom: 8 }}>{PIN_TXT[id] || ""}</div>{peopleRow(id)}
          {id === "banca" && <><div style={card}>Kredit: {eur(g.debt)} · Zins 1 %/Monat</div>{btn("+5.000 € Kredit", () => run({ k: "loan" }), g.debt < 15000 + 5000 * (g.y - 1))}{btn("5.000 € tilgen", () => run({ k: "repay" }), g.debt > 0 && g.money > 0, C.fg)}</>}
          {id === "palazzo" && (g.offers.length ? g.offers.map((o) => <div key={o.id} style={card}><b>{o.name}</b>{sub(`${o.trees} Bäume · Zustand ${o.cond} % · ${o.own ? `🔒 Besitz von ${CHM[o.own].n}, ab Jahr ${Math.floor((o.from || 0) / 12) + 1} & ♥ 40` : `⚔️ ${RIV[o.rival].n} bis ${MONATE[o.until]}`}`)}{btn(`Kaufen · ${eur(o.price)}`, () => run({ k: "buy", id: o.id }), buyOk(o))}{!o.own && btn(`Pachten · ${o.lease} €/Monat`, () => run({ k: "lease", id: o.id }), SEASON.buy.includes(g.m), C.fg)}</div>) : <div style={card}>„Im Moment nichts. Nächstes Jahr wieder, Signore.“</div>)}
          {id === "frantoio" && btn(g.olives > 0 ? `⚙️ ${g.olives} kg pressen · 1 ⏳` : "Keine Oliven zum Pressen", () => open({ k: "mg", t: "p" }), g.olives > 0 && g.ap > 0, C.ok)}
          {id === "feudo" && btn(g.oil > 0 ? `🤝 Öl verkaufen (Feilschen) · ${g.oil} l · 1 ⏳` : "Kein Öl", () => open({ k: "mg", t: "s" }), g.oil > 0 && g.ap > 0, C.ok)}
          {id === "lago" && SHOP.filter((s) => s.at === "lago").map((s) => <div key={s.id} style={card}><b>{s.n}</b> · {eur(s.cost(g))}{sub(s.d)}{btn(s.ok(g) ? "Kaufen" : "✔ besitzt du", () => run({ k: "shop", id: s.id }), s.ok(g) && g.money >= s.cost(g), C.ok)}</div>)}
        </>; }
      break; }
    case "minor": { const mi = MINOR.find((x) => x.id === sheet.id); if (!mi) break; const e = mi.enc[encIdx(g, mi)]; const done = g.acts.includes("enc_" + mi.id); const ok = (!e.ok || e.ok(g)) && g.ap > 0 && !done;
      shT = `${mi.e} ${mi.n}`;
      sh = <>{peopleRow(mi.id)}<div style={card}><div style={{ fontSize: 15 }}>{e.t}</div>{done ? <div style={{ color: C.ok, marginTop: 6 }}>✔ Diesen Monat erledigt.</div> : btn(`${e.l}${e.d ? ` – ${e.d}` : ""} · 1 ⏳`, () => run({ k: "enc", id: mi.id }), ok, C.ok)}</div>
        {SHOP.filter((s) => s.at === mi.id).length > 0 && <><b>Laden{mi.id === "ferr" && disc(g) < 1 ? " (Stammkunden-Rabatt −20 %)" : ""}</b>{SHOP.filter((s) => s.at === mi.id).map((s) => <div key={s.id} style={card}><b>{s.n}</b> · {eur(s.cost(g))}{sub(s.d)}{btn("Kaufen", () => run({ k: "shop", id: s.id }), s.ok(g) && g.money >= s.cost(g), C.fg)}</div>)}</>}</>; break; }
    case "spot": { const id = sheet.id; const I = SPOT_INFO[id]; if (!I) break; const done = g.acts.includes("sp_" + id); const note = g.notes?.["sp_" + id]; const ok = !done && g.money >= I[2] && g.ap >= I[3];
      shT = I[0]; sh = <><div style={{ ...card, fontSize: 15 }}>{I[1]}{sub(`Kosten: ${I[2] ? eur(I[2]) : "gratis"} · ${I[3] ? I[3] + " ⏳" : "kein ⏳"} · 1× pro Monat`)}</div>
        {note && <div style={{ ...card, background: "rgba(74,222,128,.12)", fontSize: 15 }}><b>Ergebnis:</b> {note}</div>}
        {done ? sub(`✔ Diesen Monat schon erledigt – wieder ab ${MONATE[(g.m + 1) % 12]}.`) : btn(I[2] ? `Machen · ${eur(I[2])}${I[3] ? " · 1 ⏳" : ""}` : `Machen${I[3] ? " · 1 ⏳" : ""}`, () => run({ k: "spot", id }), ok, C.ok)}</>; break; }
    case "shop": shT = "🛎️ Schalter · Anträge"; sh = <>{sub("Papierkram braucht keine Kontakte – nur Geld und Geduld.")}{SHOP.filter((s) => s.at === sheet.at).map((s) => <div key={s.id} style={card}><b>{s.n}</b> · {eur(s.cost(g))}{sub(s.d)}{btn(s.ok(g) ? "Beantragen" : "✔ erledigt", () => run({ k: "shop", id: s.id }), s.ok(g) && g.money >= s.cost(g), C.fg)}</div>)}</>; break;
    case "sindaco": shT = "🚪 Büro des Sindaco"; {
      const here = present(g, "muni").includes("sindaco");
      sh = g.met.includes("sindaco") ? <>{btn("Zum Sindaco ›", () => person("sindaco"), true, C.ok)}</>
        : <div style={card}>Die Sekretärin schaut nicht mal hoch: „Der Sindaco empfängt nur Leute, die er kennt.“ {here ? "Aber da kommt er gerade heraus …" : "Vielleicht triffst du ihn auf einem großen Fest – zur Udienza im Mai oder zu Natale. Mit Ansehen ★ 35+."}
          {here && btn("❓ Ansprechen", () => person("sindaco"))}</div>; }
      break;
    case "report": shT = `📬 ${MONATE[g.m]} ${YEAR0 + g.y - 1}`; sh = <>{sheet.lines.map((l, i) => <div key={i} style={{ ...card, padding: 8, fontSize: 14 }}>{l}</div>)}{btn("Weiter ▶", () => setSheet(null))}</>; break;
    case "year": shT = `🎆 Jahresbilanz ${YEAR0 + g.y - 2}`;
      sh = <><div style={{ textAlign: "center" }}><div className="gta" style={{ fontSize: 34, color: C.fg }}>{eur(g.yhist[g.yhist.length - 1] || 0)}</div>{sub("Vermögen am Jahresende · " + titel(g.yhist[g.yhist.length - 1] || 0))}</div>
        <div style={card}>🧺 {g.fl.lyH || 0} kg geerntet · 🫙 {g.fl.lyO || 0} l gepresst · 💶 {eur(g.fl.lyR || 0)} Umsatz · 🎯 {g.fl.lyG || 0}/12 Ziele</div>
        <div style={card}>Das Spiel geht weiter: neues Erntejahr, neue Haine bei Don Calogero, neue Leute, neue Katastrophen. Dein lokaler Highscore wurde aktualisiert – trag dich unten in die Live-Liste ein.</div>
        <LiveHS name={name} wealth={g.yhist[g.yhist.length - 1] || 0} years={g.y - 1} subKey={g.run + "_y" + g.y} local={hs} me={g.run} />
        {btn(`Weiter ins Jahr ${YEAR0 + g.y - 1} ▶`, () => setSheet(null))}</>; break;
    case "end": shT = "🏁 Karriere-Ende";
      sh = <><div style={{ textAlign: "center" }}><div className="gta" style={{ fontSize: 34, color: g.money < -8000 ? C.bad : C.fg }}>{g.money < -8000 ? "PLEITE!" : eur(sc.verm)}</div>{sub(`${g.y} Jahr(e) · ${titel(Math.max(sc.verm, g.best))}`)}</div><LiveHS name={name} wealth={Math.max(sc.verm, g.best)} years={g.y} subKey={g.run + "_end"} local={hs} me={g.run} /><HSList hs={hs} me={g.run} />{btn("▶ Neues Spiel", () => { store.del(SAVE); setG(null); setSheet(null); })}</>; break;
    case "log": shT = "📜 Tagebuch"; sh = <>{g.log.slice(0, 40).map((l, i) => <div key={i} style={{ fontSize: 13, padding: "5px 0", borderBottom: "1px solid #3b2a4f" }}>{l}</div>)}</>; break;
  }
  const canClose = !sheet || !(sheet.k === "mg" || sheet.k === "end" || sheet.k === "year");
  return <div className="sb3" style={{ height: VH, background: C.bar, color: "#fff", fontFamily: SANS, maxWidth: 520, margin: "0 auto", overflow: "hidden", position: "relative" }}>{css}
    <div style={{ height: HUD, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", background: `linear-gradient(${C.bar2},${C.bar})`, borderBottom: "2px solid #000" }}>
      <button onClick={() => open({ k: "kal" })} style={{ background: "transparent", border: "none", color: "#fff", textAlign: "left", padding: 0 }}><div className="gta" style={{ fontSize: 19, color: C.fg, lineHeight: 1 }}>{MONATE[g.m].toUpperCase()}</div><div style={{ fontSize: 11, fontWeight: 700 }}>Jahr {g.y} · {YEAR0 + g.y - 1}</div></button>
      <div style={{ flex: 1, textAlign: "center" }}><Money v={g.money} size={24} /></div>
      <div style={{ fontSize: 13, fontWeight: 800, textAlign: "right", lineHeight: 1.25 }}><div>🫙{g.oil} ★{g.rep}</div><div data-ap={g.ap} style={{ color: g.ap ? C.ok : C.bad }}>⏳ {g.ap}/{AP + 0}</div></div>
    </div>
    <div style={{ height: H, position: "relative" }}>{body}</div>
    <div style={{ height: NAV, display: "flex", background: C.bar2, borderTop: "2px solid #000" }}>
      {tabs.map(([k, e, l]) => <button key={k} data-tab={k} onClick={() => { buzz(); setScr(k); setScene(null); }} style={{ flex: 1, background: scr === k ? "#3a1a5c" : "transparent", border: "none", color: scr === k ? C.fg : "#fff", fontWeight: 800, fontSize: 11, position: "relative" }}><div style={{ fontSize: 22 }}>{e}</div>{l}{k === "buero" && pend ? <b style={{ position: "absolute", top: 4, right: "22%", width: 18, height: 18, borderRadius: 9, background: C.bad, fontSize: 11, lineHeight: "18px" }}>{pend}</b> : null}</button>)}
      <button data-tab="end" onClick={() => { if (pend) { setToast(`Erst ${pend} Auftrag/Aufträge entscheiden 💻`); setScr("buero"); setScene(null); open({ k: "missions" }); } else run({ k: "end" }); }} style={{ flex: 1.3, background: pend ? "#3b2a4f" : C.pink, border: "none", color: pend ? "#9a8aa8" : "#000", fontWeight: 900, fontSize: 12 }}><div style={{ fontSize: 20 }}>▶▶</div>Monat beenden</button>
    </div>
    {sheet && sh !== null && <div onClick={() => { if (canClose) setSheet(null); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "flex-end", zIndex: 20, animation: "sbFade .2s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "86%", overflowY: "auto", background: C.panel, borderRadius: "20px 20px 0 0", border: "2px solid #000", borderBottom: "none", padding: "12px 14px 22px", animation: "sbUp .25s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><b style={{ fontSize: 17 }}>{shT}</b>{canClose && <button aria-label="Schließen" onClick={() => setSheet(null)} style={{ width: 40, height: 40, borderRadius: 20, border: "2px solid #6b4a90", background: "transparent", color: "#fff", fontSize: 18 }}>✕</button>}</div>
        {sh}</div></div>}
    {splash >= 0 && FEST[splash] && <div onClick={() => setSplash(-1)} style={{ position: "absolute", inset: 0, zIndex: 30, background: `linear-gradient(rgba(23,11,38,.3),rgba(23,11,38,.9)), url(${festImg(splash)}) center/cover`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 18px 60px", animation: "sbFade .3s" }}>
      <Luminarie /><Fireworks n={5} /><div className="gta" style={{ fontSize: 15, color: C.pinkT, animation: "sbSweep .6s" }}>FESTA IN SAMBUCA</div>
      <div className="gta" style={{ fontSize: 38, color: C.fg, lineHeight: 1, animation: "sbStamp .6s" }}>{FEST[splash].n}</div><div style={{ fontWeight: 700, margin: "8px 0 16px", textShadow: "0 1px 4px rgba(0,0,0,.9)" }}>{FEST[splash].s}. Auf der Stadtkarte: 🎆 Piazza – dort sind heute viele Leute.</div>
      <button onClick={(e) => { e.stopPropagation(); setSplash(-1); setScr("stadt"); setScene("fest"); }} style={bigBtn(C.pink)}>Zum Fest ▶</button></div>}
    {toast && <div key={toast} style={{ position: "absolute", left: 12, right: 12, top: HUD + 8, zIndex: 40, background: "rgba(23,11,38,.95)", border: `2px solid ${C.pink}`, borderRadius: 12, padding: "8px 12px", fontSize: 13, fontWeight: 700, animation: "sbToast 2.6s forwards", pointerEvents: "none" }}>{toast}</div>}
  </div>;
}
// v0.8.1 (FB-19/OI-007): Live-Highscore über Supabase REST (ohne SDK). Publishable Key ist öffentlich; RLS erlaubt anon nur select + insert. Offline → lokale Liste.
const SB_URL = "https://aqgigngeksgpbhcdaiar.supabase.co/rest/v1/highscores"; const SB_KEY = "sb_publishable_wU2pe73e-cWRpppIgNICpQ_eart3DN5"; const GAME_V = "0.8.2";
type GHS = { name: string; wealth: number; years: number; version: string; created_at: string };
const sbHead = { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json" };
async function ghsTop(): Promise<GHS[]> { const r = await fetch(SB_URL + "?select=name,wealth,years,version,created_at&order=wealth.desc&limit=20", { headers: sbHead }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json() as GHS[]; }
async function ghsPost(name: string, wealth: number, years: number): Promise<void> { const r = await fetch(SB_URL, { method: "POST", headers: { ...sbHead, Prefer: "return=minimal" }, body: JSON.stringify({ name: (name.trim() || "Anonimo").slice(0, 24), wealth: Math.max(-10000000, Math.min(1000000000, Math.round(wealth))), years: Math.max(0, Math.min(200, years)), version: GAME_V }) }); if (!r.ok) throw new Error("HTTP " + r.status); }
function LiveHS(p: { name: string; wealth: number; years: number; subKey?: string; local: HS[]; me: string }): ReactNode {
  const [list, setList] = useState<GHS[] | null>(null); const [err, setErr] = useState(false); const [nm, setNm] = useState(p.name); const [st, setSt] = useState<"" | "busy" | "ok" | "fail">(p.subKey && store.get("sambuca5_sub_" + p.subKey) ? "ok" : "");
  const load = (): void => { ghsTop().then((l) => { setList(l); setErr(false); }).catch(() => setErr(true)); };
  useEffect(() => { load(); }, []);
  const send = (): void => { if (!p.subKey) return; setSt("busy"); store.set("sambuca5_name", nm); ghsPost(nm, p.wealth, p.years).then(() => { store.set("sambuca5_sub_" + p.subKey, "1"); setSt("ok"); load(); }).catch(() => setSt("fail")); };
  return <div data-livehs="1" style={{ background: "rgba(31,15,51,.92)", borderRadius: 14, padding: 10, border: "2px solid #000", marginTop: 8 }}>
    <div className="gta" style={{ fontSize: 20, color: C.gold }}>🌍 LIVE-HIGHSCORE · TOP 20</div>
    {p.subKey && st !== "ok" && <div style={{ display: "flex", gap: 6, margin: "6px 0" }}><input data-hsname="1" value={nm} maxLength={24} onChange={(e) => setNm(e.target.value)} placeholder="Dein Name" style={{ flex: 1, padding: "10px 12px", fontSize: 16, borderRadius: 10, border: "2px solid #6b4a90", background: C.panel, color: "#fff", minWidth: 0 }} /><button data-hssend="1" disabled={st === "busy"} onClick={send} style={{ padding: "0 14px", borderRadius: 10, border: "none", background: C.pink, color: "#fff", fontWeight: 900, fontSize: 15 }}>{st === "busy" ? "…" : "Eintragen"}</button></div>}
    {st === "ok" && p.subKey && <div style={{ fontSize: 13, color: C.ok, margin: "4px 0" }}>✔ Eingetragen ({eur(p.wealth)}).</div>}
    {st === "fail" && <div style={{ fontSize: 13, color: C.bad, margin: "4px 0" }}>Offline – nicht gesendet. Lokal ist dein Ergebnis gespeichert, versuch es später nochmal.</div>}
    {err ? <><div style={{ fontSize: 13, opacity: 0.8 }}>📴 Offline – es gilt die Liste dieses Geräts.</div></> : list === null ? <div style={{ fontSize: 13, opacity: 0.7 }}>Lade …</div> : list.length ? list.map((h, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}><span>{i + 1}. {h.name} · J{h.years}</span><b>{eur(h.wealth)}</b></div>) : <div style={{ fontSize: 13, opacity: 0.7 }}>Noch keine Einträge – sei der Erste!</div>}
  </div>;
}
function HSList(p: { hs: HS[]; me: string }): ReactNode {
  return <div style={{ background: "rgba(31,15,51,.92)", borderRadius: 14, padding: 10, border: "2px solid #000" }}>
    <div className="gta" style={{ fontSize: 20, color: C.gold }}>🏆 HIGHSCORE (dieses Gerät)</div>
    {p.hs.length ? p.hs.slice(0, 10).map((h, i) => <div key={h.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0", color: h.id === p.me ? C.ok : "#fff", fontWeight: h.id === p.me ? 800 : 500 }}><span>{i + 1}. {h.name} · J{h.year}</span><b>{eur(h.wealth)}</b></div>) : <div style={{ fontSize: 13, opacity: 0.7 }}>Noch keine Einträge – am Ende jedes Jahres wird dein Vermögen eingetragen.</div>}
  </div>;
}
//
// FB-31/OI-038 (v0.8.1): Rüttler-Ernte – eigenes Minispiel, wenn g.gear (siehe docs/MINIGAMES.md MG-harvest-shaker)
function MiniShaker(p: { name: string; cheap: boolean; onDone: (f: number) => void; onSkip: () => void }): ReactNode {
  const TREES = 3;
  const [tree, setTree] = useState(0); const [step, setStep] = useState<"net" | "trunk" | "shake" | "fall" | "done">("net");
  const [lean] = useState<number[]>(() => Array.from({ length: TREES }, () => Math.floor(Math.random() * 3)));
  const [net, setNet] = useState(1); const [sNet, setSNet] = useState(0); const [hpos, setHpos] = useState(0); const [sPos, setSPos] = useState(0);
  const [pw, setPw] = useState(0); const [hold, setHold] = useState(false); const [res, setRes] = useState<number[]>([]); const [brk, setBrk] = useState(0); const [msg, setMsg] = useState("");
  const pwr = useRef(0);
  const fin = (sInt: number, broke: boolean): void => {
    setHold(false); buzz(broke ? 60 : 20); const s = sNet * sPos * sInt; setRes((r) => [...r, s]); if (broke) setBrk((b) => b + 1);
    setMsg(broke ? "💥 Astbruch! Zu viel Kraft." : sInt >= 1 ? "✅ Perfekt gerüttelt" : "〰️ Zu schwach – Oliven bleiben hängen");
    setStep("fall"); setTimeout(() => { if (tree + 1 >= TREES) setStep("done"); else { setTree((t) => t + 1); setStep("net"); setNet(1); setMsg(""); } }, 1100);
  };
  useEffect(() => {
    if (!hold) return; const iv = setInterval(() => { pwr.current = Math.min(100, pwr.current + (p.cheap ? 7 : 5)); setPw(pwr.current); if (pwr.current >= 100) { clearInterval(iv); fin(0.4, true); } }, 50);
    return () => clearInterval(iv);
  }, [hold]);
  const release = (): void => { if (!hold) return; const v = pwr.current; if (v >= 100) return; if (v > 80) fin(0.4, true); else if (v >= 55) fin(1, false); else fin(Math.max(0.2, v / 55 * 0.8), false); };
  const avg = res.length ? res.reduce((a, b) => a + b, 0) / res.length : 0;
  const f = Math.max(0.7, Math.round((0.8 + avg * 0.6 - brk * 0.05) * 100) / 100);
  const L = lean[Math.min(tree, TREES - 1)]; const tilt = [-14, 0, 14][L];
  const shaking = hold || step === "fall";
  return <div data-mg="shaker">
    <p style={{ margin: "0 0 8px" }}>🔧 <b>Rüttler-Ernte</b> · Baum {Math.min(tree + 1, TREES)}/{TREES}. {step === "net" ? "Die Krone hängt zu einer Seite – leg das Netz darunter." : step === "trunk" ? "Setz die Rüttler-Zange am Stamm an – am Rindenring, nicht an den Ästen." : step === "shake" ? "Halten = Intensität. Im grünen Bereich loslassen – zu viel bricht Äste." : "Ertrag ×0,80 bis ×1,40."}</p>
    <div style={{ position: "relative", height: 300, borderRadius: 16, overflow: "hidden", border: "2px solid #000", background: "linear-gradient(#8fc6e8 0%,#cfe6c0 55%,#8a6a3e 56%,#6b4f2c 100%)" }}>
      {/* Krone */}
      <div data-lean={L} style={{ position: "absolute", left: "50%", top: 18, width: 210, height: 130, marginLeft: -105, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(circle at 40% 35%,#8db35a,#4f7a2c 60%,#2f4d1a)", transformOrigin: "50% 100%", transform: `rotate(${tilt}deg)`, animation: shaking ? "sbShake .12s linear infinite" : undefined, boxShadow: "0 6px 12px rgba(0,0,0,.35)" }}>
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ position: "absolute", left: `${12 + (i * 37) % 76}%`, top: `${15 + (i * 53) % 65}%`, width: 9, height: 12, borderRadius: "50%", background: "#3b1f5c", opacity: step === "done" || res.length > tree ? 0.15 : 1 }} />)}
      </div>
      {/* Stamm */}
      <button data-trunk="1" aria-label="Stamm" disabled={step !== "trunk"} onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); const h = 100 - ((e.clientY - r.top) / r.height) * 100; setHpos(h); setSPos(h >= 30 && h <= 55 ? 1 : h < 30 ? 0.7 : 0.55); if (h > 55) setMsg("⚠️ Zu hoch – an den Ästen"); else if (h < 30) setMsg("Etwas tief – Wurzelanlauf"); else setMsg("👍 Gut angesetzt"); buzz(10); setStep("shake"); }}
        style={{ position: "absolute", left: "50%", top: 135, width: 44, height: 100, marginLeft: -22, padding: 0, border: "none", borderRadius: 10, background: "repeating-linear-gradient(90deg,#5a3a1e 0 6px,#6e4a28 6px 12px)", cursor: step === "trunk" ? "pointer" : "default", boxShadow: step === "trunk" ? "0 0 0 3px #fff8" : undefined }}>
        <span style={{ position: "absolute", left: -4, right: -4, bottom: "30%", height: "25%", borderTop: "2px dashed #f3d9a4", borderBottom: "2px dashed #f3d9a4", opacity: step === "trunk" ? 1 : 0.4 }} />
        {step !== "net" && step !== "trunk" && <span style={{ position: "absolute", left: -16, right: -16, bottom: `${hpos}%`, height: 14, marginBottom: -7, borderRadius: 4, background: "#f2b705", border: "2px solid #000", fontSize: 10, lineHeight: "10px" }}>🔧</span>}
      </button>
      {/* Netz */}
      <div style={{ position: "absolute", left: `${[8, 36, 64][net]}%`, top: 238, width: "28%", height: 40, borderRadius: 8, background: "repeating-linear-gradient(45deg,#2fbf71 0 3px,transparent 3px 9px),repeating-linear-gradient(-45deg,#2fbf71 0 3px,transparent 3px 9px)", border: "2px solid #1f6b45", transition: "left .25s" }} />
      {step === "fall" && Array.from({ length: 8 }, (_, i) => <span key={"o" + i} style={{ position: "absolute", left: `${[22, 50, 78][L] + (i % 4 - 1.5) * 5}%`, top: 120, width: 9, height: 12, borderRadius: "50%", background: "#3b1f5c", animation: `sbConf ${0.6 + i * 0.05}s ease-in forwards` }} />)}
      {msg && <div style={{ position: "absolute", left: 8, right: 8, top: 6, textAlign: "center", fontWeight: 800, color: "#fff", textShadow: "0 2px 4px #000" }}>{msg}</div>}
      {step === "done" && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(20,8,34,.6)" }}>
        <div style={{ fontFamily: FONT, fontSize: 30, color: C.fg }}>{avg > 0.8 ? "BRAVISSIMO!" : avg > 0.5 ? "BENE!" : "NA JA…"}</div>
        <div>{TREES} Bäume · {brk ? `${brk}× Astbruch · ` : ""}Ertrag ×{f.toFixed(2)}</div>
        <div style={{ width: 220 }}><button onClick={() => p.onDone(f)} style={bigBtn(C.pink)}>Ernte einfahren ▶</button></div>
      </div>}
    </div>
    {step === "net" && <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{["⬅️ links", "⬇️ Mitte", "➡️ rechts"].map((t, i) => <button key={i} data-net={i} onClick={() => { setNet(i); const d = Math.abs(i - L); setSNet(d === 0 ? 1 : d === 1 ? 0.6 : 0.25); setMsg(d === 0 ? "🕸️ Netz liegt richtig" : "🕸️ Netz liegt daneben"); setStep("trunk"); }} style={{ ...bigBtn("#2fbf71"), flex: 1, fontSize: 14 }}>{t}</button>)}</div>}
    {step === "shake" && <div style={{ marginTop: 8 }}>
      <div style={{ position: "relative", height: 22, borderRadius: 11, background: "linear-gradient(90deg,#3a2a4a 0 55%,#2fbf71 55% 80%,#c0392b 80%)", border: "2px solid #000", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${pw}% - 3px)`, width: 6, background: "#fff" }} /></div>
      <button data-shake="1" onPointerDown={() => { pwr.current = 0; setPw(0); setHold(true); }} onPointerUp={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()} style={{ ...bigBtn(hold ? C.fg : "#f2b705"), minHeight: 64, fontSize: 20, marginTop: 8, touchAction: "none" }}>{hold ? "RÜTTELN… loslassen im Grün!" : "🔧 Gedrückt halten"}</button>
    </div>}
    {step === "net" && tree === 0 && <button onClick={p.onSkip} style={{ ...bigBtn("transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 8 }}>Ohne Minispiel ernten (×0,85)</button>}
  </div>;
}
