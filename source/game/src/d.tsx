// ---------- Spiel-Logik v0.5 ----------
function rollEvents(g: G, a: number, peek: boolean = false): string[] {
  const m = a % 12; const f = FEST[m]; const row: string[] = [];
  if (f) row.push(...f.ids);
  if (m === 6) row.push("vend1");
  if (!peek) g.queue.filter((q) => q[0] <= a).slice(0, 2).forEach((q) => { if (!(q[1] === "turi2" && g.deals.includes("truce"))) row.push(q[1]); });
  if (f && f.big) return row;
  const n = Math.max(0, (hr(g.seed, a, 11) < 0.55 ? 2 : 1) - (f ? 1 : 0)); const used = new Set([...g.used, ...row]);
  // v0.8 (FB-21/OI-009): Pool = Events des Monats + der Nachbarmonate; zuletzt gesehene (Vorjahr bzw. letzter Spielstand, g.prev) nach hinten
  const near = (e: EvDef): boolean => e.months.includes(m) || (hr(g.seed, a, 41) < 0.5 && (e.months.includes((m + 11) % 12) || e.months.includes((m + 1) % 12)));
  const all = EVS.filter((e) => near(e) && !e.fest && !used.has(e.id) && (!e.need || e.need(g))); const prev = new Set(g.prev || []);
  const fresh = all.filter((e) => !prev.has(e.id)); const pool = fresh.length >= n ? fresh : all;
  for (let k = 0; k < n; k++) {
    const dis = hr(g.seed, a, 20 + k) < 0.4; let el = pool.filter((e) => !!e.dis === dis && !row.includes(e.id)); if (!el.length) el = pool.filter((e) => !row.includes(e.id)); if (!el.length) break;
    row.push(el[Math.floor(hr(g.seed, a, 30 + k) * el.length)].id);
  }
  return row;
}
function startMonth(g: G): void {
  const a = abs(g); g.ap = AP + (g.fl.apb || 0); g.fl.apb = 0; g.cur = rollEvents(g, a);
  g.queue = g.queue.filter((q) => !g.cur.includes(q[1]) || q[0] > a); g.used.push(...g.cur); g.pick = {}; g.res = {};
}
function mkOffers(g: G, y: number): Offer[] {
  const taken = new Set([...g.groves.map((x) => x.id), ...g.offers.map((o) => o.id)]);
  const free = SPOTS.filter((s) => !taken.has(s.id)); const out: Offer[] = [];
  for (let k = 0; k < 3 && free.length; k++) {
    const s = free.splice(Math.floor(hr(g.seed, 900 + y, k) * free.length), 1)[0]; const r = (i: number): number => hr(g.seed, 910 + y * 7 + k, i);
    const t = 60 + Math.round(r(1) * 18) * 10; const c = 40 + Math.round(r(2) * 45);
    out.push({ id: s.id, name: s.n, trees: t, cond: c, price: Math.round(t * (18 + c * 0.3) * (1 + 0.06 * y) / 50) * 50, lease: Math.round(t * 0.7), until: 2 + Math.floor(r(3) * 6), rival: Math.floor(r(4) * 3), x: s.x, y: s.y });
  }
  return out;
}
const S0 = (): Stats => ({ harvest: 0, oilMade: 0, sold: 0, revenue: 0, goals: 0, n: 0, soldM: 0, mg: 0, met: 0 });
function newGame(prev: string[] = []): G {
  const seed = 1 + Math.floor(Math.random() * 2147483000); const r = (a: number): number => hr(seed, 30, a);
  const rl: Record<string, number> = {}; CHARS.forEach((c) => { rl[c.id] = c.id === "turi" ? 15 : c.id === "nonna" ? 55 : 30; });
  const g: G = { v: 5, seed, run: seed.toString(36) + Date.now().toString(36), y: 1, m: 0, money: 6000, debt: 0, olives: 0, oil: 150, q: 55, price: 8.5, hist: [8.5], rep: 10, water: false, bio: false, dop: false, gear: false, spade: 0, crew: 0, wine: 0, yieldMod: 1, over: false,
    log: ["Du erbst einen verwilderten Hain bei Pandolfina, 6.000 € und 150 l von Nonnos Öl. Im Dorf kennst du nur deine Nonna."],
    groves: [{ id: "erbe", name: "Parzelle Pandolfina", trees: 120, cond: 40, lease: 0, prune: false, fert: false, irr: false, traps: false, harvested: false, x: 76.68, y: 17.62 }],
    offers: [{ id: "lago", name: "Hain am Lago Arancio", trees: 200, cond: 70, price: 6300, lease: 140, until: 3 + Math.floor(r(1) * 3), rival: 2, x: 33, y: 80 },
      { id: "adranone", name: "Alte Bäume am Stadtrand", trees: 80, cond: 85, price: 3100, lease: 70, until: 5 + Math.floor(r(2) * 3), rival: 0, x: 80, y: 86 },
      { id: "misili", name: "Contrada Misilifurmi", trees: 150, cond: 55, price: 3700, lease: 95, until: 2 + Math.floor(r(3) * 3), rival: 1, x: 36, y: 38 },
      // v0.8 (FB-14/OI-024): mehr Angebote + 2 Haine in NPC-Besitz (erst ab Jahr 2 kaufbar, laufen nicht ab)
      { id: "batia", name: "Contrada Batia", trees: 110, cond: 60, price: 3500, lease: 80, until: 6 + Math.floor(r(4) * 3), rival: 1, x: 28, y: 20 },
      { id: "adragna", name: "Terrassen bei Adragna", trees: 90, cond: 75, price: 3300, lease: 65, until: 4 + Math.floor(r(5) * 4), rival: 2, x: 55, y: 55 },
      { id: "turih", name: "Zio Turis Oberhang", trees: 160, cond: 80, price: 9500, lease: 0, until: -1, rival: 0, x: 66, y: 16, own: "turi", from: 12 },
      { id: "giusih", name: "Uliveto Ferrante (Feudo)", trees: 240, cond: 85, price: 14500, lease: 0, until: -1, rival: 2, x: 22, y: 66, own: "giusi", from: 12 }],
    cur: [], queue: [[1, "carmela1"]], used: [], pick: {}, res: {}, goalDone: [], stats: S0(), tot: S0(), rel: rl, met: ["nonna"], talked: [], acts: [], deals: [], fl: {}, ap: AP, best: 0, yhist: [], notes: {}, prev };
  startMonth(g); return g;
}
function rivalPts(g: G, i: number): number {
  let v = RIV[i].b; const n = abs(g);
  for (let k = 0; k <= n; k++) { v *= 1 + (hr(g.seed, 50 + i, k) - 0.3) * 0.05; if (k % 12 === 10) v += 2000 + hr(g.seed, 60 + i, k) * 3000; if (k % 12 === 11) v += 1500 * hr(g.seed, 61 + i, k); }
  return Math.round(v);
}
const millFee = (g: G): number => (g.deals.includes("mill") || g.deals.includes("coop") ? 0.1 : 0.2);
const pickCost = (g: G, t: number): number => (g.crew ? 0 : Math.round((g.gear ? 1.5 : 3) * t));
const pendingEv = (g: G): string[] => g.cur.filter((id) => g.pick[id] === undefined);
const careCost = (g: G, k: string, t: number): number => Math.round(CARE[k][0] * t * ((k === "prune" || k === "fert") && g.spade <= 0 ? 1.25 : 1) * (k === "traps" && g.fl.trapdisc ? 0.5 : 1));
// wer ist wo? zufällig pro Monat
// v0.8 OI-035: Brand – Anteil Bäume je Hain verbrennt (Bäume weg, Ernte sinkt)
function burn(g: G, f: number): number { let n = 0; for (const x of g.groves) { const d = Math.round(x.trees * f); x.trees -= d; n += d; } return n; }
function present(g: G, venue: string): string[] {
  const a = abs(g); const fest = FEST[g.m];
  return CHARS.filter((c, i) => {
    if (!gateOk(g, c)) return false; // v0.9.0 FB-38/39: noch nicht freigeschaltete Personen tauchen nicht auf
    if (venue === "fest") return !!fest && fest.guests.includes(c.id) && (hr(g.seed, a, 400 + i) < 0.8 || c.id === "sindaco" || c.id === "dolores");
    if (!c.at.includes(venue)) return false; if (c.mo && !c.mo.includes(g.m)) return false;
    if (c.id === "carmela" && venue === "buero") return (g.fl.carmelaHere !== undefined && a - g.fl.carmelaHere <= 1 && a >= g.fl.carmelaHere - 1) || (g.met.includes("carmela") && hr(g.seed, a, 401) < 0.4);
    if (c.id === "sindaco" && venue === "muni") return g.rep >= 50 || g.met.includes("sindaco") || g.fl.intro_sindaco !== undefined;
    return hr(g.seed, a, 500 + i * 13 + venue.length) < (venue === "bar" ? 0.55 : 0.6);
  }).map((c) => c.id).slice(0, venue === "fest" ? 6 : 3);
}
const MEETNEED = [0, 0.3, 0.45, 0.6, 0.7, 0.8];
const apOk = (g: G, n: number = 1): boolean => g.ap >= n;
function act(g0: G, a: A): G {
  const g: G = JSON.parse(JSON.stringify(g0)); const L = (s: string): void => { g.log.unshift(s); if (g.log.length > 80) g.log.length = 80; };
  if (g.over) return g;
  const rnd = (): number => hr(g.seed, 100 + abs(g), ++g.stats.n);
  const useAP = (n: number = 1): boolean => { if (g.ap < n) { L("⏳ Keine Zeit mehr diesen Monat – beende den Monat."); return false; } g.ap -= n; return true; };
  const gr = a.id ? g.groves.find((x) => x.id === a.id) : undefined;
  if (CARE[a.k]) {
    const [, n, b] = CARE[a.k]; const key = a.k as "prune" | "fert" | "irr" | "traps";
    if (!gr || gr[key] || !SEASON[a.k].includes(g.m)) return g;
    const cost = careCost(g, a.k, gr.trees); if (g.money < cost) { L(`Zu wenig Geld für ${n} (${cost} €).`); return g; }
    if (!useAP()) return g;
    g.money -= cost; gr[key] = true; gr.cond = Math.min(100, gr.cond + b); let sp = "";
    if ((a.k === "prune" || a.k === "fert") && g.spade > 0) { g.spade--; sp = g.spade === 0 ? " Der Spaten ist gebrochen!" : ` (Spaten: noch ${g.spade}×)`; }
    if (a.k === "traps") g.fl.trapdisc = 0;
    L(`${n} in „${gr.name}“: −${cost} €.${sp}`);
  } else if (a.k === "harvest") {
    if (!gr || gr.harvested || !SEASON.harvest.includes(g.m) || !useAP()) return g;
    const cost = pickCost(g, gr.trees); g.money -= cost; const f = a.f ?? 1;
    const kg = Math.round(gr.trees * 20 * gr.cond / 100 * (1 + (gr.prune ? 0.2 : 0) + (gr.fert ? 0.15 : 0)) * g.yieldMod * f * (g.crew ? 1.1 : 1) * (g.gear ? 1.15 : 1));
    gr.harvested = true; g.olives += kg; g.stats.harvest += kg; if (a.f !== undefined && a.f !== 0.85) g.stats.mg++;
    L(`Ernte „${gr.name}“: ${kg} kg Oliven (×${f.toFixed(2)}${cost ? `, Lohn −${cost} €` : ", Crew"}).`);
    if (g.gear && g.fl.cheap && rnd() < 0.35) { g.gear = false; g.fl.cheap = 0; L("🔩 Der Billig-Rüttler ist auseinandergefallen. Typisch."); }
  } else if (a.k === "mill") {
    if (g.olives <= 0 || !useAP()) return g; const fee = Math.round(g.olives * millFee(g)); const r = (0.12 + rnd() * 0.05) * (a.f ?? 1); let l = Math.round(g.olives * r); let pz = `−${fee} €`;
    if (g.money < fee) { const s = Math.round(l * 0.25); l -= s; pz = `${s} l Öl als Mahlanteil`; } else g.money -= fee;
    const qq = clamp(a.q ?? 60, 0, 100) + (g.bio ? 10 : 0) + (g.fl.early || 0); g.q = Math.round(clamp((g.q * g.oil + qq * l) / Math.max(1, g.oil + l), 0, 100));
    g.oil += l; g.stats.oilMade += l; L(`Frantoio: ${g.olives} kg → ${l} l Öl, Qualität ${Math.round(clamp(qq, 0, 100))} (${pz}).`); g.olives = 0;
  } else if (a.k === "sell") {
    if (!useAP()) return g; L(sellAt(g, a.n || g.oil, (a.f ?? 1) * (g.deals.includes("export") ? 1.08 : 1), "Feudo Arancio"));
  } else if (a.k === "loan") {
    if (g.debt >= 15000 + 5000 * (g.y - 1)) return g; g.debt += 5000; g.money += 5000; L("Kredit über 5.000 € bei der Sicilbanca (1 % Zins pro Monat).");
  } else if (a.k === "office") {
    // v0.8 (FB-28/OI-034): Büro-Stufen werden gekauft statt automatisch freigeschaltet
    const st = offStage(g); const c = OFFICE_COST[st + 1]; if (!c) return g; if (g.money < c) { L(`Für das nächste Büro fehlen ${eur(c - g.money)}.`); return g; }
    g.money -= c; g.fl.office = st + 1; repAdd(g, 3); L(`🏠 Umzug! Neues Büro: ${OFFN[st + 1]} (−${eur(c)}, ★ +3).`);
  } else if (a.k === "repay") {
    const p = Math.min(g.debt, 5000, Math.max(0, g.money)); if (p <= 0) return g; g.debt -= p; g.money -= p; L(`${p} € Kredit getilgt.`);
  } else if (a.k === "buy" || a.k === "lease") {
    const o = g.offers.find((x) => x.id === a.id); if (!o || !SEASON.buy.includes(g.m)) return g;
    if (o.own && (a.k === "lease" || abs(g) < (o.from || 0) || R(g, o.own) < 40)) { L(`${CHM[o.own].n} verkauft (noch) nicht.`); return g; }
    if (a.k === "buy") { if (g.money < o.price) { L(`Don Calogero will ${o.price} € – zu wenig Geld.`); return g; } g.money -= o.price; }
    g.groves.push({ id: o.id, name: o.name, trees: o.trees, cond: o.cond, lease: a.k === "lease" ? o.lease : 0, prune: false, fert: false, irr: false, traps: false, harvested: false, x: o.x, y: o.y });
    g.offers = g.offers.filter((x) => x.id !== o.id); L(a.k === "buy" ? `„${o.name}“ gekauft: −${o.price} €.` : `„${o.name}“ gepachtet: ${o.lease} €/Monat.`);
  } else if (a.k === "meet") {
    // a.f = Plauder-Score 0..1
    const c = a.id ? CHM[a.id] : undefined; if (!c || g.met.includes(c.id) || g.fl["try_" + c.id] === abs(g)) return g;
    if (!gateOk(g, c)) return g;
    // v0.9.0 FB-38: höchstens eine neue Bekanntschaft pro Monat
    if (g.fl.metM === abs(g)) { L("🕰️ Eine neue Bekanntschaft pro Monat reicht – die Leute hier brauchen Zeit."); return g; }
    if (!useAP()) return g;
    const s = a.f ?? 0; const need = MEETNEED[Math.max(0, c.diff - (g.fl["intro_" + c.id] !== undefined ? 1 : 0))];
    if (s >= need) { g.met.push(c.id); g.rel[c.id] = clamp(Math.max(g.rel[c.id] ?? 30, 25) + Math.round(s * 15), 0, 100); g.fl.metM = abs(g); g.stats.met++; g.talked.push(c.id); L(`🤝 Du hast ${c.n} kennengelernt! (${c.r})`); }
    else { g.fl["try_" + c.id] = abs(g); L(`😬 ${c.n} ist nicht überzeugt (${Math.round(s * 100)} %, nötig ${Math.round(need * 100)} %). Nächsten Monat nochmal.`); }
  } else if (a.k === "chat" || a.k === "call") {
    const c = a.id ? CHM[a.id] : undefined; if (!c || !g.met.includes(c.id) || g.talked.includes(c.id) || !useAP()) return g;
    g.talked.push(c.id); const s = a.f ?? 0.5; let n = Math.round((s >= 0.5 ? 2 + s * 9 : -2 + s * 6) * (a.k === "call" ? 0.6 : 1));
    if (n === 0) n = 1; L(`${a.k === "call" ? "☎️" : "💬"} ${c.n}: ${s >= 0.8 ? "Super Gespräch!" : s >= 0.5 ? "Netter Plausch." : "Etwas holprig …"}${rel(g, c.id, n)}`);
  } else if (a.k === "gift") {
    const c = a.id ? CHM[a.id] : undefined; if (!c || !g.met.includes(c.id) || g.oil < 5 || g.acts.includes("gift_" + c.id)) return g;
    g.oil -= 5; g.acts.push("gift_" + c.id); L(`🎁 5 l Öl für ${c.n}.${rel(g, c.id, 6)}`);
  } else if (a.k === "perk") {
    const p = PERKS.find((x) => x.id === a.id); if (!p || !perkOk(g, p) || !useAP()) return g; const c = p.cost ? p.cost(g) : 0;
    g.money -= c; if (p.per === "y") g.fl["py_" + p.id] = g.y; else if (p.per === "m") g.acts.push("pk_" + p.id); else g.fl["po_" + p.id] = 1;
    const pr = p.f(g); g.notes = { ...(g.notes || {}), ["pk_" + p.id]: pr }; L(`${p.e} ${p.n}${c ? ` (−${eur(c)})` : ""}: ${pr}`);
  } else if (a.k === "shop") {
    const s = SHOP.find((x) => x.id === a.id); if (!s || !s.ok(g)) return g; const c = s.cost(g); if (g.money < c) { L("Zu wenig Geld."); return g; }
    g.money -= c; L(`${s.n} (−${eur(c)}): ${s.f(g)}`);
  } else if (a.k === "enc") {
    const mi = MINOR.find((x) => x.id === a.id); if (!mi || g.acts.includes("enc_" + mi.id)) return g; const e = mi.enc[encIdx(g, mi)];
    if ((e.ok && !e.ok(g)) || !useAP()) return g; g.acts.push("enc_" + mi.id); L(`${mi.e} ${mi.n}: ${e.f(g, rnd())}`);
  } else if (a.k === "spot") {
    // Szenen-Hotspots mit kleinen Aktionen
    const id = a.id || ""; if (g.acts.includes("sp_" + id)) return g; const N = (s: string): string => { g.notes = { ...(g.notes || {}), ["sp_" + id]: s }; return s; };
    const S: Record<string, [number, number, () => string]> = {
      caffe: [2, 0, () => { const n = rollEvents(g, abs(g) + 1, true).filter((x) => EVM[x] && !EVM[x].fest).map((x) => EVM[x].icon); return `Ein Caffè an der Theke. Gerücht für nächsten Monat: ${n.length ? n.join(" ") : "nichts"}.`; }],
      wette: [50, 1, () => { if (rnd() < BET.p) { g.money += BET.win; return `⚽ Palermo gewinnt! +${BET.win} € Auszahlung (Gewinn +${BET.win - 50} €).`; } return "⚽ 0:2. Salvo grinst. Die 50 € sind weg."; }],
      kerze: [5, 0, () => { repAdd(g, 1); g.fl.pray = 1; return "🕯️ Eine Kerze für die Madonna dell'Udienza. ★ +1, nächste Katastrophe gemildert."; }],
      spende: [150, 0, () => { repAdd(g, 3); return "💶 Spende in den Opferstock. ★ +3." + rel(g, "padre", 3); }],
      beichte: [0, 1, () => { repAdd(g, 1); return "Padre Vito hört zu und schweigt. Danach fühlst du dich leichter. ★ +1"; }],
      aushang: [0, 0, () => { const f = FEST[(g.m + 1) % 12]; const o = g.offers.filter((x) => !x.own).length; return `📌 ${f ? `Nächsten Monat: ${f.n}!` : "Kein Fest nächsten Monat."} · ${o} Hain-Angebot(e) bei Don Calogero · Müllabfuhr neu geregelt.`; }],
      pooldeal: [0, 1, () => g.oil >= 20 ? "🏊 " + sellAt(g, 20, 1.6, "die Hotelküche") : "Der Küchenchef will mindestens 20 l."],
      aperitivo: [12, 0, () => { repAdd(g, 1); const w = ["klaus", "dolores", "giusi"].filter((x) => g.met.includes(x)); const p = w.length ? w[Math.floor(rnd() * w.length)] : ""; return "🍹 Spritz an der Poolbar. ★ +1" + (p ? rel(g, p, 4) : " – noch kennst du hier niemanden."); }],
      strand: [20, 1, () => { g.fl.apb = (g.fl.apb || 0) + 1; return "🏖️ Ein Tag am Meer. Nächsten Monat +1 ⏳."; }],
      lidodeal: [0, 1, () => g.m < 5 || g.m > 8 ? "Der Lido hat nur Juni–September geöffnet." : g.oil >= 15 ? "🍤 " + sellAt(g, 15, 1.5, "das Lido-Restaurant") : "Die Küche will mindestens 15 l."],
      tierheim: [30, 0, () => { repAdd(g, 1); return "🐕 30 € Futterspende fürs Tierheim. ★ +1"; }],
    };
    const s = S[id]; if (!s) return g; if (g.money < s[0]) { L("Zu wenig Geld."); return g; } if (s[1] && !useAP(s[1])) return g;
    g.money -= s[0]; g.acts.push("sp_" + id); L(N(s[2]()));
  } else if (a.k === "choice") {
    const id = a.id || ""; const e = EVM[id]; const c = e && e.ch[a.n ?? 0];
    if (!c || !g.cur.includes(id) || g.pick[id] !== undefined || (c.ok && !c.ok(g))) return g;
    g.pick[id] = a.n ?? 0; if (c.mg) g.stats.mg++; g.res[id] = c.f(g, hr(g.seed, 300 + abs(g), id.length * 7 + (a.n ?? 0)), a.f ?? 0); L(`${e.icon} ${e.t}: ${g.res[id]}`);
  } else if (a.k === "end") { if (pendingEv(g).length) return g; endMonth(g); }
  else if (a.k === "retire") { g.over = true; L("Du beendest deine Karriere als Olivenbauer."); }
  return g;
}
const encIdx = (g: G, mi: Minor): number => Math.floor(hr(g.seed, abs(g), 700 + mi.id.length * 3 + mi.x) * mi.enc.length);
function perkOk(g: G, p: Perk): boolean {
  if (!g.met.includes(p.who) || R(g, p.who) < p.min) return false;
  if (p.per === "y" && g.fl["py_" + p.id] === g.y) return false; if (p.per === "m" && g.acts.includes("pk_" + p.id)) return false; if (p.per === "once" && g.fl["po_" + p.id]) return false;
  if (p.ok && !p.ok(g)) return false; if (p.cost && g.money < p.cost(g)) return false; return true;
}
function endMonth(g: G): void {
  const L = (s: string): void => { g.log.unshift(s); }; const m = g.m; const a = abs(g);
  let cost = 100; cost += g.groves.reduce((s, x) => s + x.lease, 0); cost += Math.round(g.debt * 0.01); if (g.money < 0) cost += Math.round(-g.money * 0.02); g.money -= cost;
  condAll(g, -2);
  if (g.olives > 0) { const lost = Math.round(g.olives * 0.2); g.olives -= lost; L(`🫒 ${lost} kg Oliven verdorben – ab in die Mühle!`); }
  let inc = 0;
  if (g.deals.includes("tour")) inc += m >= 3 && m <= 9 ? 220 : 80;
  if (g.deals.includes("us")) inc += m >= 3 && m <= 9 ? 300 : 60;
  if (g.deals.includes("agri")) inc += g.fl.agri || 250;
  if (inc) { g.money += inc; L(`🤝 Deal-Einnahmen (Tourist:innen): +${eur(inc)}.`); }
  if (g.crew && !g.deals.includes("family") && m >= 6 && m <= 10) { const w = Math.round(wage(g) * 0.3); g.money -= w; L(`👷 Crew-Lohn (Bereitschaft): −${eur(w)}.`); }
  if (m === 10 && !g.deals.includes("family")) { g.crew = 0; g.deals = g.deals.filter((d) => d !== "ciccio"); }
  const goal = GOALS[m]; const rw = Math.round(goal.rew * (1 + 0.25 * (g.y - 1)));
  if (goal.chk(g)) { g.money += rw; repAdd(g, goal.rep); g.goalDone[m] = true; g.stats.goals++; L(`🎯 Monatsziel „${goal.t}“ geschafft: +${eur(rw)}${goal.rep ? `, Ansehen +${goal.rep}` : ""}.`); }
  else { g.goalDone[m] = false; L(`○ Monatsziel „${goal.t}“ verfehlt.`); }
  g.offers.filter((o) => o.until === m && !o.own).forEach((o) => L(`⚔️ ${RIV[o.rival].n} schnappt dir „${o.name}“ weg!`));
  g.offers = g.offers.filter((o) => o.until !== m || !!o.own);
  const np = nextPrice(g, a + 1); const pr = np / g.price;
  if (pr > 1.15) L(`📈 Ölpreis springt auf ${np.toFixed(2)} €/l (Missernte in Spanien).`); else if (pr < 0.87) L(`📉 Billigöl flutet den Markt: ${np.toFixed(2)} €/l.`);
  g.price = np; g.hist.push(np); if (g.hist.length > 24) g.hist.shift();
  L(`${MONATE[m]} ${YEAR0 + g.y - 1} vorbei: Fixkosten −${eur(cost)}.`);
  if (g.money < -8000) { g.over = true; L("Pleite! Die Banca pfändet."); return; }
  g.stats.soldM = 0; g.talked = []; g.acts = []; g.notes = {};
  if (m === 11) {
    const v = score(g).verm; g.yhist.push(v); g.best = Math.max(g.best, v);
    (Object.keys(g.stats) as (keyof Stats)[]).forEach((k) => { g.tot[k] += g.stats[k]; });
    g.fl.lyH = g.stats.harvest; g.fl.lyO = g.stats.oilMade; g.fl.lyR = g.stats.revenue; g.fl.lyG = g.stats.goals;
    g.prev = [...g.used]; g.y++; g.m = 0; g.stats = S0(); g.goalDone = []; g.used = []; g.yieldMod = 1; g.fl.bees = 0; g.fl.early = 0; g.fl.share = 0;
    g.groves.forEach((x) => { x.prune = false; x.fert = false; x.irr = false; x.traps = false; x.harvested = false; });
    g.offers = [...g.offers, ...mkOffers(g, g.y)];
    L(`🎆 Neues Jahr ${YEAR0 + g.y - 1}! Vermögen: ${eur(v)}. Neue Hain-Angebote bei Don Calogero.`);
  } else g.m++;
  startMonth(g);
}
function score(g: G): { groves: number; oil: number; verm: number } {
  const groves = g.groves.filter((x) => !x.lease).reduce((s, x) => s + Math.round(x.trees * 45 * x.cond / 100), 0);
  const oil = Math.round(g.oil * unit(g) * 0.9) + Math.round(g.olives * 0.8) + g.wine * 3 + g.deals.length * 400 + (g.gear ? 600 : 0);
  return { groves, oil, verm: g.money - g.debt + groves + oil };
}
const titel = (v: number): string => (v >= 60000 ? "Olivenöl-Mogul von Sambuca" : v >= 35000 ? "Barone dell'Olio" : v >= 20000 ? "Angesehener Produzent" : v >= 11000 ? "Fleißiger Bauer" : "Hobby-Olivenbauer");
function todo(g: G): { t: string; key: string; id?: string; cost: number }[] {
  const o: { t: string; key: string; id?: string; cost: number }[] = [];
  g.groves.forEach((x) => (["prune", "fert", "irr", "traps"] as const).forEach((k) => { if (!x[k] && SEASON[k].includes(g.m) && !(k === "irr" && g.water)) o.push({ t: `${CARE[k][3]} ${CARE[k][1]} · ${x.name}`, key: k, id: x.id, cost: careCost(g, k, x.trees) }); }));
  if (SEASON.harvest.includes(g.m)) g.groves.forEach((x) => { if (!x.harvested) o.push({ t: `🧺 Ernten · ${x.name}`, key: "harvest", id: x.id, cost: pickCost(g, x.trees) }); });
  if (g.olives > 0) o.push({ t: `⚙️ Pressen: ${g.olives} kg Oliven (Frantoio)`, key: "mill", cost: Math.round(g.olives * millFee(g)) });
  return o;
}
// ---------- Highscore (lokal; Einträge sind eigenständig → später async vergleichbar) ----------
type HS = { id: string; name: string; wealth: number; best: number; year: number; d: string; v: 5 };
const HSK = "sambuca5_hs";
const hsLoad = (): HS[] => { try { const r = JSON.parse(store.get(HSK) || "[]") as HS[]; return Array.isArray(r) ? r : []; } catch { return []; } };
function hsPut(g: G, name: string): HS[] {
  const v = score(g).verm; const e: HS = { id: g.run, name: name || "Anonimo", wealth: Math.round(Math.max(v, g.best)), best: Math.round(Math.max(v, g.best)), year: g.y, d: new Date().toISOString().slice(0, 10), v: 5 };
  const l = hsLoad().filter((x) => x.id !== e.id); l.push(e); l.sort((p, q) => q.wealth - p.wealth); const out = l.slice(0, 20); store.set(HSK, JSON.stringify(out)); return out;
}
