// SAMBUCA v0.7.1
// SAMBUCA v0.7.1 – Szenen mit Hotspots, Leute kennenlernen, Plauder-Minispiel, endlose Jahre, Highscore
type Grove = { id: string; name: string; trees: number; cond: number; lease: number; prune: boolean; fert: boolean; irr: boolean; traps: boolean; harvested: boolean; x: number; y: number };
type Offer = { id: string; name: string; trees: number; cond: number; price: number; lease: number; until: number; rival: number; x: number; y: number; own?: string; from?: number };
type Stats = { harvest: number; oilMade: number; sold: number; revenue: number; goals: number; n: number; soldM: number; mg: number; met: number };
type G = { v: 5; seed: number; run: string; y: number; m: number; money: number; debt: number; olives: number; oil: number; q: number; price: number; hist: number[]; rep: number; water: boolean; bio: boolean; dop: boolean; gear: boolean; spade: number; crew: number; wine: number; yieldMod: number; over: boolean; log: string[]; groves: Grove[]; offers: Offer[];
  cur: string[]; queue: [number, string][]; used: string[]; pick: Record<string, number>; res: Record<string, string>; goalDone: boolean[]; stats: Stats; tot: Stats; rel: Record<string, number>; met: string[]; talked: string[]; acts: string[]; deals: string[]; fl: Record<string, number>; ap: number; best: number; yhist: number[]; notes?: Record<string, string>; prev?: string[] };
type A = { k: string; id?: string; n?: number; f?: number; q?: number };
type Ch = { l: string; d: string; ok?: (g: G) => boolean; mg?: string; f: (g: G, r: number, s: number) => string };
type EvDef = { id: string; icon: string; t: string; months: number[]; text: string; who?: string; fest?: boolean; dis?: boolean; need?: (g: G) => boolean; ch: Ch[] };

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const SAISON = ["Winter", "Winter", "Frühling", "Frühling", "Frühling", "Sommer", "Sommer", "Sommer", "Herbst", "Ernte", "Ernte", "Winter"];
const SEASON: Record<string, number[]> = { prune: [11, 0, 1], fert: [2, 3, 4], irr: [5, 6, 7], traps: [5, 6, 7, 8], harvest: [9, 10], buy: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11] };
const CARE: Record<string, [number, string, number, string]> = { prune: [3, "Baumschnitt", 15, "✂️"], fert: [2, "Düngung", 8, "🌱"], irr: [1.5, "Bewässerung", 0, "💧"], traps: [2, "Fliegenfallen", 0, "🪤"] };
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AP = 7;
const RIV = [{ n: "Zio Turi Ciaccio", e: "🧓", b: 6500 }, { n: "Cooperativa Rocca", e: "🏭", b: 8500 }, { n: "Baronessa Inglese", e: "👒", b: 10500 }];
const eur = (n: number): string => Math.round(n).toLocaleString("de-DE") + " €";
const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const YEAR0 = 2027;

// Figuren sind frei erfunden (Dorf-Typen), keine realen Personen.
// diff 1 (leicht) … 5 (schwer): je schwerer kennenzulernen, desto größer der Nutzen.
type Chr = { id: string; n: string; r: string; i: number; c: string; lo: string; mid: string; hi: string; diff: number; at: string[]; mo?: number[]; likes: [string, string]; hates: string; need?: [string, (g: G) => boolean] };
const CHARS: Chr[] = [
  { id: "nonna", n: "Nonna Pina", r: "Deine Nonna · Minni di Virgini", i: 3, c: "#ffd9a0", lo: "„Iss erst mal was, du bist ganz dünn!“", mid: "„Dein Nonno wäre stolz. Ein bisschen.“", hi: "„Die ganze Familie hilft dir. Basta!“", diff: 0, at: ["chiesa", "panif", "santuario"], likes: ["essen", "familie"], hates: "technik" },
  { id: "carmela", n: "Zia Carmela", r: "Nachbarin · weiß alles zuerst", i: 9, c: "#ffe27a", lo: "„Ah, der Neue von nebenan!“", mid: "„Komm, ich hab Zitronen für dich.“", hi: "„Wenn ein Sturm kommt, sag ich dir’s vor dem Wetterbericht.“", diff: 1, at: ["buero", "panif", "chiesa", "fest", "santuario"], likes: ["essen", "kirche"], hates: "geld" },
  { id: "salvo", n: "Salvo", r: "Bar del Corso · hört alles", i: 5, c: "#ffb05c", lo: "„Un caffè? 1,20. Gerüchte kosten extra.“", mid: "„Setz dich. Ich hab was gehört …“", hi: "„Für dich: Insider-Tipps, gratis.“", diff: 1, at: ["bar", "lido"], likes: ["calcio", "essen"], hates: "politik" },
  { id: "wang", n: "Signor Wang", r: "Ferramenta Cinese · hat alles, billig", i: 11, c: "#9fe0ff", lo: "„Spaten? 19 Euro! Hält … eine Weile.“", mid: "„Für Stammkunden: Großhandelspreis.“", hi: "„Freund! Ich bestelle dir direkt aus Ningbo.“", diff: 2, at: ["ferr", "bar", "banca"], likes: ["technik", "geld"], hates: "wein" },
  { id: "rosalia", n: "Signora Rosalia", r: "Frantoio · presst seit 30 Jahren", i: 2, c: "#7dffb0", lo: "„Hinten anstellen. Wie alle.“", mid: "„Deine Oliven sind besser geworden.“", hi: "„Für dich lass ich die Presse auch nachts laufen.“", diff: 2, at: ["frantoio", "chiesa", "fest", "santuario"], likes: ["oliven", "familie"], hates: "politik" },
  { id: "ciccio", n: "Ciccio u Pasturi", r: "Schäfer · Vorarbeiter der Erntehelfer", i: 12, c: "#d6b37a", lo: "„Hm.“", mid: "„Meine Jungs pflücken schneller als jede Maschine.“", hi: "„Die Crew gehört dir. Auch zur Vendemmia.“", diff: 2, at: ["schaefer", "bar", "fest", "belv", "hain"], likes: ["calcio", "oliven"], hates: "technik" },
  { id: "padre", n: "Padre Vito", r: "Pfarrer · Chiesa Madre", i: 1, c: "#c9a7ff", lo: "„Ich sehe Sie selten bei der Messe.“", mid: "„Die Madonna segnet die Fleißigen.“", hi: "„Sie gehören jetzt zur Gemeinde.“", diff: 2, at: ["chiesa", "fest", "santuario"], likes: ["kirche", "familie"], hates: "geld" },
  { id: "turi", n: "Zio Turi", r: "Rivale vom Nachbarhang", i: 8, c: "#ff6b6b", lo: "„Was schaust du? Das ist MEIN Hang.“", mid: "„Deine Bäume sehen besser aus als letztes Jahr.“", hi: "„Wir Bauern müssen zusammenhalten.“", diff: 3, at: ["bar", "fest", "torre", "hain"], likes: ["oliven", "calcio"], hates: "reisen" },
  { id: "giusi", n: "Giusi Ferrante", r: "Winzerin · Cantina am Lago", i: 4, c: "#ff6b9e", lo: "„Öl? Wein ist das Geschäft hier, caro.“", mid: "„Wein und Öl – zusammen unschlagbar.“", hi: "„Socio! Meine Leute sind deine Leute.“", diff: 3, at: ["feudo", "fest", "banca", "hotel"], likes: ["wein", "geld"], hates: "calcio" },
  { id: "chiara", n: "Chiara Mulè", r: "Pro Loco · Tourismus", i: 6, c: "#8be0ff", lo: "„Hast du ein Instagram? Nein? Madonna …“", mid: "„Die Busse aus Palermo suchen echte Erlebnisse!“", hi: "„Du bist jetzt auf jeder Tour!“", diff: 3, at: ["muni", "bar", "fest", "palazzo", "lido"], likes: ["technik", "reisen"], hates: "geld" },
  { id: "klaus", n: "Klaus Berger", r: "Aussteiger aus München", i: 7, c: "#b5ff6b", lo: "„Grüß Gott! Ich mach hier was mit Tourismus.“", mid: "„Mein Spezl in München hat ein Feinkostgeschäft …“", hi: "„Partner! Das wird das Agriturismo vom ganzen Belice!“", diff: 3, at: ["bar", "lago", "fest", "hotel", "belv"], mo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], likes: ["reisen", "essen"], hates: "calcio" },
  { id: "dolores", n: "Dolores Whitfield", r: "Reiche Amerikanerin · Villa am Lago", i: 10, c: "#fff3c4", lo: "„Darling, I only drink champagne.“", mid: "„My friends at the Times would LOVE this place.“", hi: "„Honey, half of Texas will fly in for your oil!“", diff: 4, at: ["fest", "bar", "lago", "palazzo", "hotel", "lido"], mo: [4, 5, 6, 7, 8], likes: ["reisen", "wein"], hates: "politik", need: ["Ansehen ★ 20", (g) => g.rep >= 20] },
  { id: "sindaco", n: "Sindaco Totò Bonura", r: "Bürgermeister · Fördertöpfe", i: 0, c: "#ffc94a", lo: "„Und Sie sind …? Mein Sekretär macht Termine.“", mid: "„Ah, der Olivenmensch! Sambuca braucht Leute wie Sie.“", hi: "„Für Sie ist die Tür im Palazzo immer offen.“", diff: 5, at: ["fest", "muni"], likes: ["politik", "geld"], hates: "technik", need: ["Ansehen ★ 35", (g) => g.rep >= 35] },
];
const CHM: Record<string, Chr> = {}; CHARS.forEach((c) => { CHM[c.id] = c; });
const TOP: Record<string, [string, string, string[]]> = {
  calcio: ["⚽", "Calcio", ["„Palermo hat schon wieder verloren …“", "„Am Sonntag ist Derby!“"]],
  wein: ["🍷", "Wein", ["„Der Nero d’Avola dieses Jahr …“", "„Was trinkst du eigentlich so?“"]],
  kirche: ["⛪", "Die Madonna", ["„Bald ist wieder Prozession.“", "„Warst du Sonntag in der Messe?“"]],
  familie: ["👪", "Familie", ["„Meine Enkel sind alle in Turin …“", "„Wie geht’s deiner Nonna?“"]],
  geld: ["💶", "Geschäfte", ["„Alles wird teurer, oder?“", "„Lohnt sich das mit den Oliven?“"]],
  reisen: ["✈️", "Reisen & Gäste", ["„Die Busse aus Palermo werden mehr.“", "„Warst du schon mal in New York?“"]],
  oliven: ["🫒", "Oliven", ["„Die Nocellara blüht früh dieses Jahr.“", "„Wann fängst du mit der Ernte an?“"]],
  politik: ["🏛️", "Politik", ["„Die Region streicht schon wieder Gelder.“", "„Wer wird nächster Sindaco?“"]],
  essen: ["🍝", "Essen", ["„Heute gibt’s Pasta col Macco.“", "„Hast du die Minni di Virgini probiert?“"]],
  technik: ["📱", "Internet", ["„Das WLAN hier ist eine Katastrophe.“", "„Machst du eigentlich Instagram?“"]],
};
const TOPK = Object.keys(TOP);

function hr(s: number, a: number, b: number = 0): number {
  let t = (s ^ Math.imul(a + 1, 0x9e3779b1) ^ Math.imul(b + 7, 0x85ebca77)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const abs = (g: G): number => (g.y - 1) * 12 + g.m;
const repAdd = (g: G, n: number): void => { g.rep = clamp(g.rep + n, 0, 100); };
const rel = (g: G, id: string, n: number): string => { g.rel[id] = clamp((g.rel[id] ?? 30) + n, 0, 100); return n && g.met.includes(id) ? ` ${CHM[id].n.split(" ").pop()} ${n > 0 ? "♥+" : "♥−"}${Math.abs(n)}.` : ""; };
const R = (g: G, id: string): number => (g.met.includes(id) ? g.rel[id] ?? 30 : 0);
const later = (g: G, d: number, id: string): void => { if (g.queue.some((x) => x[1] === id) || g.cur.includes(id)) return; g.queue.push([abs(g) + d, id]); };
const deal = (g: G, id: string): boolean => { if (g.deals.includes(id)) return false; g.deals.push(id); return true; };
const trees = (g: G): number => g.groves.reduce((s, x) => s + x.trees, 0);
const condAll = (g: G, d: number, f: (x: Grove) => boolean = () => true): void => { g.groves.forEach((x) => { if (f(x)) x.cond = clamp(x.cond + d, 0, 100); }); };
const price = (g: G): number => g.price * (g.bio ? 1.1 : 1) * (g.dop ? 1.08 : 1) * (g.deals.includes("us") ? 1.1 : 1) * (1 + g.rep / 400);
const unit = (g: G): number => price(g) * (0.8 + g.q / 250);
const wage = (g: G): number => (g.m === 7 || g.m === 8 ? 950 : g.m >= 9 ? 1150 : 600) * (g.deals.includes("wine") ? 0.7 : 1) * (g.deals.includes("ciccio") ? 0.75 : 1);
function sellAt(g: G, l: number, fac: number, who: string): string {
  l = Math.min(Math.round(l), g.oil); if (l <= 0) return "Kein Öl zum Verkaufen.";
  const e = Math.round(l * unit(g) * fac); g.oil -= l; g.money += e; g.stats.sold += l; g.stats.soldM += l; g.stats.revenue += e;
  if (g.oil <= 0) g.q = 0;
  return `${l} l an ${who} (${(e / l).toFixed(2)} €/l): +${eur(e)}.`;
}
const pay = (g: G, n: number): void => { g.money -= n; };
const no = (s: string): Ch => ({ l: s, d: "", f: () => "Du lässt es bleiben." });
