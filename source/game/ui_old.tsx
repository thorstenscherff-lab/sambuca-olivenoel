const C = { bar: "#170b26", bar2: "#241038", fg: "#ffd9a0", pink: "#ff4fa0", violet: "#8b5cf6", panel: "#1f0f33", card: "#2a1543", ok: "#7dffb0", bad: "#ff8f8f", gold: "#ffc94a", pinkT: "#ffa8d0" }; // v0.8 (FB-03): pinkT = helles Pink für Text, bad heller
// v0.8 (FB-03/OI-018): runde Nunito (OFL, lokal in fonts/) statt Impact mit Kontur – weniger „Pixel/Comic“
const FONT = "'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const SANS = "'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const CSS = `
.sb3 *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.sb3 button{font-family:${SANS};touch-action:manipulation;transition:transform .08s ease, filter .15s}
.sb3 button:not(:disabled):active{transform:scale(.95);filter:brightness(1.15)}
@keyframes sbUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
@keyframes sbIn{from{transform:translateY(10px) scale(.98);opacity:0}to{transform:none;opacity:1}}
@keyframes sbFade{from{opacity:0}to{opacity:1}}
@keyframes sbPop{0%{transform:scale(1)}35%{transform:scale(1.22)}100%{transform:scale(1)}}
@keyframes sbToast{0%{opacity:0;transform:translateY(16px) scale(.9)}12%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-26px)}}
@keyframes sbGlint{0%,100%{filter:brightness(1);box-shadow:0 3px 10px rgba(0,0,0,.6)}50%{filter:brightness(1.35);box-shadow:0 0 14px 3px rgba(255,201,74,.7)}}
@keyframes sbPulse{0%{box-shadow:0 0 0 0 rgba(255,79,160,.75)}100%{box-shadow:0 0 0 16px rgba(255,79,160,0)}}
@keyframes sbGlow{0%,100%{border-color:#ff4fa0}50%{border-color:#ffd9a0}}
@keyframes sbSweep{0%{transform:translateX(-60%);opacity:0}25%{transform:none;opacity:1}100%{transform:none;opacity:1}}
@keyframes sbFloat{0%{transform:translate(-50%,-50%) scale(.6);opacity:1}100%{transform:translate(-50%,-160%) scale(1.3);opacity:0}}
@keyframes sbBob{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-56%) scale(1.06)}}
@keyframes sbSpin{to{transform:rotate(360deg)}}
@keyframes sbShake{0%{translate:-3px 0}50%{translate:3px 0}100%{translate:-3px 0}}
@keyframes sbConf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(240px) rotate(540deg);opacity:0}}
.sb3 ::-webkit-scrollbar{height:6px;width:6px}.sb3 ::-webkit-scrollbar-thumb{background:#5b3a80;border-radius:3px}
`;
const bigBtn = (bg: string, fg: string = "#000"): CSSProperties => ({ width: "100%", minHeight: 48, padding: "10px 14px", fontWeight: 800, fontSize: 16, background: bg, color: fg, border: "none", borderRadius: 14, cursor: "pointer", boxShadow: "0 4px 0 rgba(0,0,0,.45)" });

//
function MiniHarvest(p: { name: string; onDone: (f: number) => void; onSkip: () => void }): ReactNode {
  const [t, setT] = useState(0); const [run, setRun] = useState(false); const [n, setN] = useState(0);
  const [ol, setOl] = useState<{ id: number; x: number; y: number; b: number; gold: boolean }[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number; s: string }[]>([]);
  const idr = useRef(0); const END = 80;
  useEffect(() => { if (!run) return; const iv = setInterval(() => setT((v) => v + 1), 100); return () => clearInterval(iv); }, [run]);
  useEffect(() => {
    if (!run) return; if (t >= END) { setRun(false); setOl([]); return; }
    setOl((o) => { let a = o.filter((x) => t - x.b < 14); if (t % 3 === 0 || a.length < 2) a = [...a, { id: ++idr.current, x: 8 + Math.random() * 80, y: 10 + Math.random() * 72, b: t, gold: Math.random() < 0.12 }]; return a; });
  }, [t, run]);
  const f = Math.round((0.7 + Math.min(n, 30) / 30 * 0.6) * 100) / 100; const done = t >= END;
  const hit = (o: { id: number; x: number; y: number; gold: boolean }): void => { buzz(8); setN((v) => v + (o.gold ? 3 : 1)); setOl((a) => a.filter((x) => x.id !== o.id)); setPops((a) => [...a.slice(-6), { id: o.id, x: o.x, y: o.y, s: o.gold ? "+3" : "+1" }]); };
  return <div>
    <p style={{ margin: "0 0 8px" }}>Tippe 8 Sekunden lang so viele Oliven wie möglich. <b style={{ color: C.gold }}>Goldene</b> zählen dreifach. Mehr Treffer = mehr Ertrag (×0,70 bis ×1,30).</p>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 22, margin: "4px 0" }}><span>🫒 {n}</span><span style={{ color: C.fg }}>×{f.toFixed(2)}</span><span>⏱ {Math.max(0, (END - t) / 10).toFixed(1)}</span></div>
    <div style={{ height: 8, background: "#000", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}><div style={{ height: "100%", width: `${100 - (t / END) * 100}%`, background: `linear-gradient(90deg,${C.pink},${C.fg})`, transition: "width .1s linear" }} /></div>
    <div style={{ position: "relative", height: 280, borderRadius: 16, overflow: "hidden", background: "radial-gradient(circle at 30% 20%,#5a8a3a,#2d4a1e 60%,#1b2a12)", border: "2px solid #000" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg,rgba(255,255,255,.04) 0 14px,transparent 14px 30px)" }} />
      {ol.map((o) => <button key={o.id} data-x="1" aria-label="Olive" onClick={() => hit(o)} style={{ position: "absolute", left: o.x + "%", top: o.y + "%", width: 52, height: 52, padding: 0, border: "none", background: "transparent", cursor: "pointer", animation: "sbBob .8s ease-in-out infinite", transform: "translate(-50%,-50%)" }}>
        <span style={{ display: "block", width: 34, height: 42, margin: "0 auto", borderRadius: "50%", background: o.gold ? "radial-gradient(circle at 35% 30%,#fff6b0,#ffc94a 45%,#b27b00)" : "radial-gradient(circle at 35% 30%,#b58ad6,#5b2a86 50%,#2a0f45)", boxShadow: "0 3px 6px rgba(0,0,0,.5)", transform: "rotate(-20deg)" }} /></button>)}
      {pops.map((q) => <span key={"p" + q.id} style={{ position: "absolute", left: q.x + "%", top: q.y + "%", fontFamily: FONT, fontSize: 26, color: q.s === "+3" ? C.gold : "#fff", textShadow: "0 2px 6px rgba(0,0,0,.8)", animation: "sbFloat .7s ease-out forwards", pointerEvents: "none" }}>{q.s}</span>)}
      {!run && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(20,8,34,.55)", animation: "sbFade .3s" }}>
        {done ? <><div style={{ fontFamily: FONT, fontSize: 34, color: C.fg, animation: "sbPop .5s" }}>{n >= 24 ? "BRAVISSIMO!" : n >= 14 ? "BENE!" : "NA JA…"}</div><div>{n} Oliven · Ertrag ×{f.toFixed(2)}</div></>
          : <div style={{ fontFamily: FONT, fontSize: 30, color: "#fff" }}>{p.name}</div>}
        <div style={{ width: 220 }}><button onClick={() => { if (done) p.onDone(f); else { setRun(true); setT(0); setN(0); } }} style={bigBtn(C.pink)}>{done ? "Ernte einfahren ▶" : "Start!"}</button></div>
      </div>}
    </div>
    {!run && !done && <button onClick={p.onSkip} style={{ ...bigBtn("transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 8 }}>Ohne Minispiel ernten (×0,85)</button>}
  </div>;
}
//
function MiniPress(p: { kg: number; onDone: (f: number, q: number) => void }): ReactNode {
  const [t, setT] = useState(0); const [res, setRes] = useState<number[]>([]); const [run, setRun] = useState(false);
  const zone = useRef<number[]>([30 + Math.random() * 40, 25 + Math.random() * 50, 20 + Math.random() * 60]);
  useEffect(() => { if (!run) return; const iv = setInterval(() => setT((v) => v + 1), 30); return () => clearInterval(iv); }, [run]);
  const r = res.length; const W = [26, 18, 12][Math.min(r, 2)]; const spd = [0.07, 0.095, 0.12][Math.min(r, 2)];
  const pos = 50 + 48 * Math.sin(t * spd); const c = zone.current[Math.min(r, 2)];
  const done = r >= 3; const avg = done ? res.reduce((s, x) => s + x, 0) / 3 : 0;
  const stop = (): void => { if (!run) { setRun(true); return; } buzz(15); const d = Math.abs(pos - c); const s = d <= W / 2 ? 1 - (d / W) * 0.3 : Math.max(0, 0.85 - (d - W / 2) / 30); const nr = [...res, s]; setRes(nr); if (nr.length >= 3) setRun(false); };
  const q = Math.round(40 + avg * 60), f = Math.round((0.9 + avg * 0.25) * 100) / 100;
  return <div>
    <p style={{ margin: "0 0 8px" }}>Drei Pressgänge: tippe <b>STOPP</b>, wenn die Nadel in der grünen Zone steht. Je genauer, desto besser Qualität und Ausbeute. {p.kg} kg Oliven warten.</p>
    <div style={{ position: "relative", height: 70, borderRadius: 35, background: "linear-gradient(90deg,#3a1a5c,#5b2a86 50%,#3a1a5c)", border: "3px solid #000", overflow: "hidden", margin: "10px 0" }}>
      {!done && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${c - W / 2}%`, width: `${W}%`, background: "linear-gradient(#7dffb0,#2fbf71)", opacity: 0.9, boxShadow: "0 0 18px #7dffb0" }} />}
      <div style={{ position: "absolute", top: -4, bottom: -4, left: `calc(${pos}% - 4px)`, width: 8, background: "#fff", boxShadow: "0 0 10px #fff", borderRadius: 4 }} />
    </div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0", fontFamily: FONT, fontSize: 20 }}>{[0, 1, 2].map((i) => <span key={i} style={{ flex: 1, textAlign: "center", padding: 6, borderRadius: 10, background: i < r ? (res[i] > 0.85 ? "#1f6b45" : res[i] > 0.5 ? "#6b5a1f" : "#6b1f2f") : "#2a1543", animation: i === r - 1 ? "sbPop .4s" : undefined }}>{i < r ? (res[i] > 0.85 ? "PERFETTO" : res[i] > 0.5 ? "GUT" : "DANEBEN") : `Gang ${i + 1}`}</span>)}</div>
    {done ? <div style={{ textAlign: "center", animation: "sbIn .3s" }}><div style={{ fontFamily: FONT, fontSize: 28, color: C.fg }}>Qualität {q} · Ausbeute ×{f.toFixed(2)}</div><button onClick={() => p.onDone(f, q)} style={{ ...bigBtn(C.pink), marginTop: 8 }}>Öl abfüllen ▶</button></div>
      : <button onClick={stop} style={{ ...bigBtn(run ? C.fg : C.pink), minHeight: 64, fontSize: 22, fontFamily: FONT, letterSpacing: ".05em" }}>{run ? "STOPP!" : r ? "Weiter" : "Presse starten"}</button>}
    {!done && r === 0 && !run && <button onClick={() => p.onDone(1, 55)} style={{ ...bigBtn("transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 8 }}>Rosalia machen lassen (Qualität 55)</button>}
  </div>;
}
//
function MiniHaggle(p: { oil: number; unit: number; limit: number; who: string; onDone: (f: number, n: number) => void }): ReactNode {
  const [n, setN] = useState(p.oil); const [t, setT] = useState(0); const [run, setRun] = useState(false); const [tries, setTries] = useState<number[]>([]); const [deal, setDeal] = useState<number | null>(null);
  useEffect(() => { if (!run) return; const iv = setInterval(() => setT((v) => v + 1), 30); return () => clearInterval(iv); }, [run]);
  const pos = (Math.sin(t * 0.08 + tries.length) + 1) / 2; const d = 0.9 + pos * 0.6;
  const mood = deal !== null ? "😄" : tries.length === 0 ? "🙂" : tries.length === 1 ? "😐" : "😠";
  const ask = (): void => {
    if (!run) { setRun(true); return; } buzz(15);
    if (d <= p.limit) { setDeal(Math.round(d * 100) / 100); setRun(false); }
    else { const nt = [...tries, d]; setTries(nt); if (nt.length >= 3) { setDeal(0.9); setRun(false); } }
  };
  const said = deal !== null ? (deal >= 1.2 ? "„Va bene… du bist ein harter Hund.“" : deal > 0.95 ? "„Abgemacht!“" : "„Mein letztes Wort: 90 %. Nimm’s oder lass es.“") : tries.length ? `„${Math.round(tries[tries.length - 1] * 100)} %? Bist du verrückt?!“` : "„Was willst du für dein Öl?“";
  return <div>
    <div style={{ display: "flex", gap: 12, alignItems: "center", background: C.card, borderRadius: 14, padding: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 46, animation: tries.length ? "sbPop .4s" : undefined }} key={tries.length + (deal ?? 0)}>{mood}</span>
      <div><b>{p.who}</b><div style={{ color: C.fg }}>{said}</div></div></div>
    {deal === null && tries.length === 0 && !run && <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>{[p.oil, Math.ceil(p.oil / 2), Math.min(p.oil, 50)].filter((v, i, a) => v > 0 && a.indexOf(v) === i).map((v) => <button key={v} onClick={() => setN(v)} style={{ flex: 1, minHeight: 44, borderRadius: 10, border: `2px solid ${n === v ? C.pink : "#5b3a80"}`, background: n === v ? C.pink : "transparent", color: n === v ? "#000" : "#fff", fontWeight: 700 }}>{v} l</button>)}</div>}
    <p style={{ margin: "4px 0" }}>Die Nadel zeigt deine Forderung. Zu gierig – und er wird sauer. Drei Versuche, dann gibt es nur noch 90 %.</p>
    <div style={{ position: "relative", height: 56, borderRadius: 28, background: "linear-gradient(90deg,#2fbf71,#ffc94a 45%,#ff4f6d)", border: "3px solid #000", margin: "8px 0", overflow: "hidden" }}>
      {tries.map((x, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${(x - 0.9) / 0.6 * 100}%`, width: 3, background: "rgba(0,0,0,.6)" }} />)}
      <div style={{ position: "absolute", top: -4, bottom: -4, left: `calc(${pos * 100}% - 4px)`, width: 8, background: "#fff", borderRadius: 4, boxShadow: "0 0 10px #fff" }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.8 }}><span>90 %</span><span>120 %</span><span>150 %</span></div>
    <div style={{ textAlign: "center", fontFamily: FONT, fontSize: 26, color: C.fg, margin: "6px 0" }}>{deal !== null ? `${eur(n * p.unit * deal)} für ${n} l` : `${Math.round(d * 100)} % · ${(p.unit * d).toFixed(2)} €/l`}</div>
    {deal !== null ? <button onClick={() => p.onDone(deal, n)} style={bigBtn(C.pink)}>Handschlag ▶</button>
      : <button onClick={ask} style={{ ...bigBtn(run ? C.fg : C.pink), minHeight: 60, fontFamily: FONT, fontSize: 22 }}>{run ? "JETZT FORDERN!" : tries.length ? "Nochmal" : "Feilschen starten"}</button>}
    {deal === null && !run && tries.length === 0 && <button onClick={() => p.onDone(1, n)} style={{ ...bigBtn("transparent", "#fff"), boxShadow: "none", border: "2px solid #6b4a90", marginTop: 8 }}>Marktpreis annehmen (100 %)</button>}
  </div>;
}
//
const CSS4 = `
@keyframes sbTw{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes sbFw{0%{transform:scale(.1);opacity:1}70%{opacity:1}100%{transform:scale(1.5);opacity:0}}
@keyframes sbStamp{0%{transform:scale(2.4) rotate(-8deg);opacity:0}60%{transform:scale(.95) rotate(-3deg);opacity:1}100%{transform:scale(1) rotate(-3deg);opacity:1}}
@keyframes sbBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes sbSplash{0%{opacity:0}10%{opacity:1}85%{opacity:1}100%{opacity:0}}
@keyframes sbZoom{from{transform:scale(1.15)}to{transform:scale(1)}}
.sb3 .gta{font-family:${FONT};font-weight:900;letter-spacing:.01em;text-shadow:0 2px 6px rgba(0,0,0,.85)}
`;
function Portrait(p: { id: string; size: number; tilt?: number; ring?: string }): ReactNode {
  const c = CHM[p.id]; const w = p.size, h = Math.round(p.size * 4 / 3);
  return <span style={{ display: "inline-block", position: "relative", width: w, height: h, flex: "none", borderRadius: 6, border: `3px solid ${p.ring || "#000"}`, outline: "2px solid #000", boxShadow: "4px 4px 0 rgba(0,0,0,.6)", overflow: "hidden", transform: `rotate(${p.tilt ?? 0}deg)`, background: c ? c.c : "#333" }}>
    <span role="img" aria-label={c ? c.n : ""} style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMG_P})`, backgroundSize: `${w * 13}px ${h}px`, backgroundPosition: `${-(c ? c.i : 0) * w}px 0`, backgroundRepeat: "no-repeat" }} /></span>;
}
function Money(p: { v: number; size: number }): ReactNode {
  const [d, setD] = useState(p.v); const cur = useRef(p.v);
  useEffect(() => { const from = cur.current, to = p.v; if (from === to) return; let k = 0; const iv = setInterval(() => { k++; const v = Math.round(from + (to - from) * Math.min(1, k / 14)); cur.current = v; setD(v); if (k >= 14) clearInterval(iv); }, 35); return () => clearInterval(iv); }, [p.v]);
  const up = p.v >= d;
  return <span style={{ fontFamily: FONT, fontSize: p.size, color: p.v < 0 ? C.bad : d !== p.v ? (up ? C.ok : C.bad) : "#7dffb0", fontWeight: 900, textShadow: "0 1px 4px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>{d < 0 ? "-€" : "€"}{Math.abs(d).toLocaleString("de-DE")}</span>;
}
function Fireworks(p: { n: number }): ReactNode {
  return <>{Array.from({ length: p.n }).map((_, i) => <span key={i} style={{ position: "absolute", left: `${10 + (i * 29) % 80}%`, top: `${6 + (i * 17) % 35}%`, width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: "50%", background: `radial-gradient(circle, transparent 30%, ${["#ffc94a", "#ff4fa0", "#8be0ff", "#7dffb0"][i % 4]} 32%, transparent 40%), repeating-conic-gradient(${["#ffc94a", "#ff4fa0", "#8be0ff", "#7dffb0"][i % 4]} 0 4deg, transparent 4deg 22deg)`, WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 70%)", maskImage: "radial-gradient(circle, #000 20%, transparent 70%)", animation: `sbFw 1.8s ${i * 0.45}s ease-out infinite`, pointerEvents: "none", opacity: 0 }} />)}</>;
}
function Luminarie(): ReactNode {
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, pointerEvents: "none" }}>{[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 6 + r * 16, display: "flex", justifyContent: "space-around" }}>{Array.from({ length: 22 }).map((_, i) => <span key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i % 3 ? "#ffe9a8" : "#ff9be0", boxShadow: "0 0 6px #ffd070", transform: `translateY(${Math.sin(i / 3.5) * 4}px)`, animation: `sbTw ${1 + (i % 4) * 0.3}s ${(i % 5) * 0.2}s infinite` }} />)}</div>)}</div>;
}

