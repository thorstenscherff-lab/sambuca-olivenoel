// ---------- Plaudern-Minispiel ----------
function MiniTalk(p: { id: string; mode: "meet" | "chat" | "call"; onDone: (s: number) => void; onCancel: () => void }): ReactNode {
  const c = CHM[p.id]; const RT = Math.max(28, 62 - c.diff * 6); // Zehntelsekunden pro Runde
  const [r, setR] = useState(-1); const [t, setT] = useState(0); const [pts, setPts] = useState<number[]>([]); const [fb, setFb] = useState<string>("");
  const plan = useRef<{ hint: string; opts: string[]; good: string }[]>([]);
  if (!plan.current.length) {
    for (let i = 0; i < 3; i++) {
      const good = c.likes[Math.floor(Math.random() * 2)]; const neu = TOPK.filter((k) => !c.likes.includes(k) && k !== c.hates);
      const o = [good, c.hates, neu[Math.floor(Math.random() * neu.length)]].sort(() => Math.random() - 0.5);
      const hs = TOP[good][2]; plan.current.push({ hint: hs[Math.floor(Math.random() * hs.length)], opts: o, good });
    }
  }
  useEffect(() => { if (r < 0 || r > 2 || fb) return; const iv = setInterval(() => setT((v) => v + 1), 100); return () => clearInterval(iv); }, [r, fb]);
  const pick = (k: string | null): void => {
    const pl = plan.current[r]; const v = k === null ? 0 : k === pl.good ? 2 : k === c.hates ? 0 : 1; buzz(v === 2 ? 20 : 8);
    setPts((a) => [...a, v]); setFb(k === null ? "… (peinliche Stille)" : v === 2 ? "😍 Volltreffer!" : v === 1 ? "🙂 Okay." : "😠 Falsches Thema!");
    setTimeout(() => { setFb(""); setT(0); setR((x) => x + 1); }, 750);
  };
  useEffect(() => { if (r >= 0 && r <= 2 && !fb && t >= RT) pick(null); });
  const sc = pts.reduce((s, x) => s + x, 0) / 6; const done = r > 2; const need = MEETNEED[c.diff];
  const mood = pts.length ? (pts[pts.length - 1] === 2 ? "😍" : pts[pts.length - 1] === 1 ? "🙂" : "😠") : "😐";
  return <div>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
      <Portrait id={p.id} size={70} tilt={-3} ring={c.c} />
      <div style={{ flex: 1 }}><b style={{ fontSize: 17 }}>{c.n}</b> <span style={{ fontSize: 22 }}>{mood}</span><div style={{ fontSize: 13, opacity: 0.8 }}>{c.r}</div>
        <div style={{ fontSize: 12, color: C.gold }}>{p.mode === "meet" ? `Kennenlernen · Schwierigkeit ${"★".repeat(c.diff)}${"☆".repeat(5 - c.diff)} · nötig ${Math.round(need * 100)} %` : p.mode === "call" ? "Telefonat (♥ ×0,6)" : "Plaudern"}</div></div></div>
    {r < 0 ? <><p style={{ margin: "6px 0" }}>Drei Runden: {c.n.split(" ")[0]} sagt etwas – wähle schnell das <b>passende Thema</b>. Lieblingsthema = ♥♥, neutral = ♥, Reizthema = 💥. Zu langsam = peinliche Stille.</p>
      <button onClick={() => { setR(0); setT(0); }} style={bigBtn(C.pink)}>{p.mode === "call" ? "☎️ Anrufen" : "💬 Ansprechen"}</button>
      <button onClick={p.onCancel} style={{ ...bigBtn("transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 8 }}>Doch nicht</button></>
      : !done ? <>
        <div key={r} style={{ background: "#fff", color: "#000", borderRadius: 16, padding: "12px 14px", fontWeight: 700, fontSize: 17, position: "relative", animation: "sbIn .25s", marginBottom: 8 }}>{fb || plan.current[r].hint}<span style={{ position: "absolute", left: 24, top: -10, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #fff" }} /></div>
        <div style={{ height: 8, background: "#000", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", width: `${100 - (t / RT) * 100}%`, background: t > RT * 0.7 ? C.bad : C.ok, transition: "width .1s linear" }} /></div>
        <div style={{ display: "grid", gap: 8 }}>{plan.current[r].opts.map((k) => <button key={k} data-topic={k} disabled={!!fb} onClick={() => pick(k)} style={{ ...bigBtn(C.card, "#fff"), border: "2px solid #5b3a80", display: "flex", alignItems: "center", gap: 10, fontSize: 17 }}><span style={{ fontSize: 26 }}>{TOP[k][0]}</span>{TOP[k][1]}</button>)}</div>
        <div style={{ textAlign: "center", marginTop: 8, fontFamily: FONT, fontSize: 18 }}>Runde {r + 1}/3 · {pts.map((x) => (x === 2 ? "♥♥" : x === 1 ? "♥" : "💥")).join(" ")}</div></>
        : <div style={{ textAlign: "center", animation: "sbIn .3s" }}>
          <div className="gta" style={{ fontSize: 30, color: p.mode === "meet" ? (sc >= need ? C.ok : C.bad) : C.fg }}>{p.mode === "meet" ? (sc >= need ? "NEUER KONTAKT!" : "ABGEBLITZT") : sc >= 0.8 ? "BELLISSIMO!" : sc >= 0.5 ? "NETT!" : "HOLPRIG…"}</div>
          <div style={{ margin: "6px 0 10px" }}>Gesprächs-Chemie: {Math.round(sc * 100)} %</div>
          <button onClick={() => p.onDone(sc)} style={bigBtn(C.pink)}>Weiter ▶</button></div>}
  </div>;
}
// ---------- Rettungs-Minispiel (Sturm, Flut, Fliege) ----------
const MGK: Record<string, { n: string; txt: string; it: string[]; bg: string; goal: number }> = {
  sturm: { n: "STURM!", txt: "Tippe Leitern, Kisten, Netze und Werkzeug an, bevor der Wind sie wegreißt.", it: ["🪜", "📦", "🧺", "🛞", "🪣", "🕸️"], bg: "linear-gradient(160deg,#3b4a63,#1b2333 60%,#0d111a)", goal: 14 },
  flut: { n: "FLUT!", txt: "Stopfe die Lecks im Damm mit Sandsäcken – tippe jedes 💦, bevor es durchbricht.", it: ["💦"], bg: "linear-gradient(180deg,#5c4a2e,#3a5a7a 60%,#1f3a5a)", goal: 14 },
  fliege: { n: "FLIEGENJAGD!", txt: "Klatsch die Olivenfliegen weg, bevor sie stechen.", it: ["🪰"], bg: "radial-gradient(circle at 30% 20%,#5a8a3a,#2d4a1e 60%,#1b2a12)", goal: 16 },
};
function MiniRescue(p: { kind: string; onDone: (s: number) => void }): ReactNode {
  const K = MGK[p.kind] || MGK.sturm; const END = 80;
  const [t, setT] = useState(0); const [run, setRun] = useState(false); const [n, setN] = useState(0); const [miss, setMiss] = useState(0);
  const [it, setIt] = useState<{ id: number; x: number; y: number; b: number; e: string; dx: number }[]>([]); const idr = useRef(0);
  useEffect(() => { if (!run) return; const iv = setInterval(() => setT((v) => v + 1), 100); return () => clearInterval(iv); }, [run]);
  useEffect(() => {
    if (!run) return; if (t >= END) { setRun(false); setIt([]); return; }
    setIt((o) => { const alive = o.filter((x) => t - x.b < 13); const lost = o.length - alive.length; if (lost) setMiss((m) => m + lost); let a = alive; if (t % 3 === 0 || a.length < 2) a = [...a, { id: ++idr.current, x: 10 + Math.random() * 75, y: 12 + Math.random() * 70, b: t, e: K.it[Math.floor(Math.random() * K.it.length)], dx: p.kind === "sturm" ? 1 : 0 }]; return a; });
  }, [t, run]);
  const s = Math.min(1, n / K.goal); const done = t >= END;
  return <div>
    <p style={{ margin: "0 0 8px" }}>{K.txt} 8 Sekunden. {K.goal} Treffer = kein Schaden.</p>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 22 }}><span>✅ {n}</span><span style={{ color: C.bad }}>✗ {miss}</span><span>⏱ {Math.max(0, (END - t) / 10).toFixed(1)}</span></div>
    <div style={{ position: "relative", height: 300, borderRadius: 16, overflow: "hidden", background: K.bg, border: "2px solid #000", marginTop: 6 }}>
      {p.kind === "sturm" && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(170deg,rgba(255,255,255,.07) 0 2px,transparent 2px 22px)" }} />}
      {it.map((o) => { const age = t - o.b; return <button key={o.id} data-x="1" aria-label="Ziel" onClick={() => { buzz(8); setN((v) => v + 1); setIt((a) => a.filter((x) => x.id !== o.id)); }} style={{ position: "absolute", left: `${o.x + o.dx * age * 1.6}%`, top: o.y + "%", width: 56, height: 56, padding: 0, border: "none", background: "transparent", fontSize: 38, transform: `translate(-50%,-50%) rotate(${o.dx * age * 12}deg)`, transition: "left .1s linear", opacity: age > 9 ? 0.5 : 1, cursor: "pointer" }}>{o.e}</button>; })}
      {!run && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(20,8,34,.6)" }}>
        <div className="gta" style={{ fontSize: 34, color: done ? (s >= 0.8 ? C.ok : s >= 0.4 ? C.gold : C.bad) : "#fff" }}>{done ? (s >= 0.8 ? "GERETTET!" : s >= 0.4 ? "HALBWEGS…" : "CHAOS!") : K.n}</div>
        {done && <div>{n} Treffer · Schutz {Math.round(s * 100)} %</div>}
        <div style={{ width: 220 }}><button onClick={() => { if (done) p.onDone(s); else { setRun(true); setT(0); setN(0); setMiss(0); } }} style={bigBtn(C.pink)}>{done ? "Weiter ▶" : "Los!"}</button></div></div>}
    </div>
  </div>;
}
// ---------- Szenen ----------
type Hot = { id: string; x: number; y: number; l: string; e: string; big?: boolean };
const OFFH: Record<number, Hot[]> = {
  1: [{ id: "pc", x: 55, y: 60, l: "Computer · Aufträge", e: "💻", big: true }, { id: "tel", x: 78, y: 66, l: "Telefon", e: "☎️", big: true }, { id: "regal", x: 14, y: 50, l: "Lager & Haine", e: "🗄️" }, { id: "kal", x: 22, y: 32, l: "Kalender", e: "📅" }, { id: "fenster", x: 62, y: 26, l: "Zur Stadt", e: "🪟" }, { id: "tuer", x: 14, y: 82, l: "Raus aufs Land", e: "🚪" }],
  2: [{ id: "pc", x: 55, y: 66, l: "Computer · Aufträge", e: "💻", big: true }, { id: "tel", x: 80, y: 73, l: "Telefon", e: "☎️", big: true }, { id: "regal", x: 75, y: 50, l: "Lager & Haine", e: "🗄️" }, { id: "kal", x: 11, y: 34, l: "Kalender", e: "📅" }, { id: "fenster", x: 50, y: 20, l: "Zur Stadt", e: "🪟" }, { id: "tuer", x: 15, y: 80, l: "Raus aufs Land", e: "🚪" }],
  3: [{ id: "pc", x: 55, y: 58, l: "Computer · Aufträge", e: "💻", big: true }, { id: "tel", x: 30, y: 55, l: "Telefon", e: "☎️", big: true }, { id: "regal", x: 86, y: 42, l: "Lager & Haine", e: "🗄️" }, { id: "kal", x: 18, y: 28, l: "Kalender", e: "📅" }, { id: "fenster", x: 60, y: 24, l: "Zur Stadt", e: "🪟" }, { id: "tuer", x: 14, y: 80, l: "Raus aufs Land", e: "🚪" }],
  4: [{ id: "pc", x: 40, y: 74, l: "Schreibtisch · Aufträge", e: "💼", big: true }, { id: "tel", x: 62, y: 64, l: "Telefon", e: "☎️", big: true }, { id: "regal", x: 15, y: 36, l: "Lager & Haine", e: "🗄️" }, { id: "kal", x: 10, y: 60, l: "Kalender", e: "📅" }, { id: "fenster", x: 82, y: 28, l: "Zur Stadt", e: "🪟" }, { id: "tuer", x: 42, y: 44, l: "Raus aufs Land", e: "🚪" }],
};
const OFFN = ["", "Casa in der Via Delfino · bescheidener Anfang", "Via Delfino · es läuft", "Via Delfino · man kennt deinen Namen", "Via Delfino · der Padrino des Öls"];
function offStage(g: G): number { const m = g.money - g.debt; return m >= 200000 || g.rep >= 70 ? 4 : m >= 60000 || g.rep >= 45 ? 3 : m >= 15000 || g.rep >= 20 ? 2 : 1; }
const SCN: Record<string, { img: string; n: string; sub: string; hots: Hot[]; slots: [number, number][]; venue: string; pos?: string }> = {
  buero: { img: "buero1", n: "DEIN BÜRO", sub: "Casa in der Via Delfino", venue: "buero", slots: [[30, 84]], hots: OFFH[1] },
  rathaus: { img: "rathaus", n: "MUNICIPIO", sub: "Rathaus von Sambuca", venue: "muni", slots: [[84, 80], [66, 84]], hots: [
    { id: "schalter", x: 15, y: 60, l: "Schalter · Anträge", e: "🛎️", big: true }, { id: "sindaco", x: 52, y: 55, l: "Büro des Sindaco", e: "🚪", big: true }, { id: "aushang", x: 90, y: 46, l: "Aushang", e: "📌" }] },
  bar: { img: "bar", n: "BAR DEL CORSO", sub: "Corso Umberto I · Pasticceria", venue: "bar", slots: [[56, 72], [84, 66], [44, 88]], hots: [
    { id: "caffe", x: 30, y: 60, l: "Caffè & Gerüchte (2 €)", e: "☕", big: true }, { id: "wette", x: 52, y: 34, l: "Calcio-Wette (50 €)", e: "📺" }, { id: "zeitung", x: 80, y: 46, l: "Ölpreis", e: "📰" }] },
  banca: { img: "banca", n: "BANCA", sub: "Corso Umberto I · Kredit zu 1 %", venue: "banca", slots: [[24, 80], [72, 84]], hots: [{ id: "pin:banca", x: 60, y: 62, l: "Kreditschalter", e: "🏦", big: true }] },
  teatro: { img: "teatro", n: "PALAZZO & TEATRO", sub: "Don Calogero · Haine von Erben", venue: "palazzo", slots: [[26, 82], [74, 82]], hots: [{ id: "pin:palazzo", x: 50, y: 66, l: "Don Calogero sprechen", e: "🎭", big: true }] },
  belv: { img: "belv", n: "BELVEDERE", sub: "Blick über das Belice-Tal", venue: "belv", slots: [[30, 86], [70, 88]], hots: [{ id: "pin:belv", x: 55, y: 45, l: "Ausblick", e: "🔭", big: true }] },
  feudo: { img: "feudo", n: "FEUDO ARANCIO", sub: "Weingut · Großkunde", venue: "feudo", slots: [[22, 82], [80, 80]], hots: [{ id: "pin:feudo", x: 48, y: 42, l: "Zum Gutshaus", e: "🍷", big: true }] },
  frantoio: { img: "frantoio", n: "FRANTOIO", sub: "Die Ölmühle", venue: "frantoio", slots: [[18, 84], [84, 84]], hots: [{ id: "pin:frantoio", x: 55, y: 66, l: "Mühle", e: "🫒", big: true }] },
  hain: { img: "hain", n: "DEIN HAIN", sub: "Olivenbäume unter der Stadt", venue: "hain", slots: [[80, 84]], hots: [{ id: "regal", x: 40, y: 62, l: "Haine verwalten", e: "🌳", big: true }] },
  lago: { img: "lago", n: "LAGO ARANCIO", sub: "Wasser · Villen", venue: "lago", slots: [[28, 86], [70, 88]], hots: [{ id: "pin:lago", x: 50, y: 70, l: "Am Steg", e: "⛵", big: true }] },
  ruine: { img: "ruine", n: "TORRE & ADRANONE", sub: "Zio Turis Hang", venue: "torre", slots: [[22, 84], [80, 84]], hots: [{ id: "pin:torre", x: 50, y: 60, l: "Ruinen", e: "🏛️", big: true }] },
  chiesa: { img: "chiesa", n: "CHIESA MADRE", sub: "Madonna dell'Udienza", venue: "chiesa", slots: [[62, 72], [88, 78], [46, 86]], hots: [
    { id: "kerze", x: 22, y: 71, l: "Kerze (5 €)", e: "🕯️" }, { id: "spende", x: 24, y: 86, l: "Opferstock (150 €)", e: "💶" }, { id: "beichte", x: 82, y: 50, l: "Beichtstuhl", e: "🙏" }, { id: "altar", x: 38, y: 30, l: "Madonna", e: "✨" }] },
  fest: { img: "fest", n: "FESTA", sub: "", venue: "fest", pos: "center", slots: [[16, 46], [40, 40], [64, 46], [86, 40], [28, 64], [74, 66]], hots: [{ id: "prog", x: 50, y: 82, l: "Festprogramm", e: "🎪", big: true }] },
};
function Scene(p: { id: string; g: G; H: number; W: number; onHot: (h: string) => void; onPerson: (id: string) => void; badge?: Record<string, number>; title?: string }): ReactNode {
  const s0 = SCN[p.id]; const st = offStage(p.g); const s = p.id === "buero" ? { ...s0, img: "buero" + st, hots: OFFH[st], sub: OFFN[st] } : s0; const ppl = present(p.g, s.venue);
  const h = p.H, w = Math.min(p.W, Math.round(h * 9 / 16)); const src = s.img === "fest" ? IMG_F : IMG_SC[s.img];
  return <div style={{ position: "relative", width: p.W, height: h, background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: (p.W - w) / 2, top: 0, width: w, height: h, backgroundImage: `url(${src})`, backgroundSize: s.img === "fest" ? "cover" : "100% 100%", backgroundPosition: s.pos || "center", animation: "sbZoom .6s ease-out" }}>
      {s.img === "fest" && <><Luminarie /><Fireworks n={3} /></>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: "10px 12px 26px", background: "linear-gradient(rgba(0,0,0,.7),transparent)", pointerEvents: "none" }}>
        <div className="gta" style={{ fontSize: 26, color: C.fg }}>{p.title || s.n}</div><div style={{ fontSize: 12, fontWeight: 700, textShadow: "1px 1px 0 #000" }}>{s.sub}</div></div>
      {s.hots.map((x) => <button key={x.id} data-hot={x.id} onClick={() => p.onHot(x.id)} style={{ position: "absolute", left: x.x + "%", top: x.y + "%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", padding: 0, cursor: "pointer", color: "#fff" }}>
        <span style={{ width: x.big ? 52 : 42, height: x.big ? 52 : 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: x.big ? 26 : 20, background: "rgba(23,11,38,.55)", border: `3px solid ${x.big ? C.pink : C.fg}`, animation: x.big ? "sbPulse 1.6s infinite" : undefined, position: "relative" }}>{x.e}
          {p.badge && p.badge[x.id] ? <b style={{ position: "absolute", right: -6, top: -6, minWidth: 20, height: 20, borderRadius: 10, background: C.bad, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000" }}>{p.badge[x.id]}</b> : null}</span>
        <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(0,0,0,.72)", padding: "2px 6px", borderRadius: 6, whiteSpace: "nowrap" }}>{x.l}</span></button>)}
      {ppl.map((id, i) => { const sl = s.slots[i % s.slots.length]; const met = p.g.met.includes(id); const c = CHM[id];
        return <button key={id} data-person={id} onClick={() => p.onPerson(id)} style={{ position: "absolute", left: sl[0] + "%", top: sl[1] + "%", transform: "translate(-50%,-50%)", background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", animation: "sbIn .4s" }}>
          <Portrait id={id} size={44} tilt={i % 2 ? 4 : -4} ring={met ? c.c : "#fff"} />
          <span style={{ fontSize: 10, fontWeight: 800, background: met ? "rgba(0,0,0,.75)" : C.pink, color: met ? "#fff" : "#000", padding: "1px 5px", borderRadius: 5, marginTop: 2, whiteSpace: "nowrap" }}>{met ? c.n.split(" ")[0] : "❓ Unbekannt"}</span></button>; })}
    </div>
  </div>;
}
