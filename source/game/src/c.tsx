// ---------- v0.5: neue Ereignisse ----------
const DMG = (g: G, base: number, k: string): number => { let d = base; if (k === "sturm" && g.fl.netz) d *= 0.4; if (k === "flut" && g.fl.drain) d *= 0.3; if (g.fl.pray) d *= 0.6; return d; };
function storm(g: G, base: number, s: number, k: string): string {
  const d = Math.round(DMG(g, base, k) * (1 - s)); const pre: string[] = [];
  if (k === "sturm" && g.fl.netz) { g.fl.netz--; pre.push("Windschutznetze halten"); }
  if (k === "flut" && g.fl.sand) { g.fl.sand--; pre.push("Sandsäcke liegen bereit"); }
  if (g.fl.pray) { g.fl.pray = 0; pre.push("die Madonna hilft"); }
  condAll(g, -d); if (g.m === 9 || g.m === 10) g.yieldMod = Math.max(0.5, g.yieldMod - d / 150);
  let br = ""; if (k === "sturm" && g.gear && s < 0.35 && hr(g.seed, abs(g), 77) < 0.4) { g.gear = false; br = " Dein Rüttler ist vom Anhänger gekippt – kaputt!"; }
  if (k === "flut" && s < 0.4 && g.olives > 0) { const l = Math.round(g.olives * 0.4); g.olives -= l; br += ` ${l} kg Oliven im Schlamm.`; }
  return (pre.length ? pre.join(", ") + ". " : "") + (d > 0 ? `Schaden: alle Haine −${d} %.` : "Kein Schaden!") + br;
}
const EVX: EvDef[] = [
  { id: "sturm", icon: "🌪️", t: "Sturmwarnung über dem Belice", months: [9, 10, 11, 0, 1, 2], dis: true, text: "Böen bis 100 km/h. Leitern, Kisten, Netze und der Rüttler liegen noch draußen im Hain!", ch: [
    { l: "🎮 Alles in Sicherheit bringen", d: "Minispiel: je mehr du rettest, desto weniger Schaden", mg: "sturm", f: (g, r, s) => storm(g, 20, s, "sturm") },
    { l: "Helfer bezahlen (350 €)", d: "Schaden −70 %", f: (g) => { pay(g, 350); return storm(g, 20, 0.7, "sturm"); } },
    { l: "Fenster zu und hoffen", d: "voller Schaden", f: (g) => storm(g, 20, 0, "sturm") }] },
  { id: "flut", icon: "🌊", t: "Starkregen: Der Belice tritt über die Ufer", months: [10, 11, 0, 1], dis: true, text: "Seit drei Tagen schüttet es. Die unteren Terrassen laufen voll, Erde rutscht ab.", ch: [
    { l: "🎮 Sandsäcke schleppen", d: "Minispiel: Dämme stopfen", mg: "flut", f: (g, r, s) => storm(g, 16, s, "flut") },
    { l: "Bagger aus Adragna (500 €)", d: "Schaden −80 %", f: (g) => { pay(g, 500); return storm(g, 16, 0.8, "flut"); } },
    { l: "Abwarten", d: "voller Schaden", f: (g) => storm(g, 16, 0, "flut") }] },
  { id: "dolores1", icon: "🥂", t: "Eine Amerikanerin kauft die Villa am Lago", months: [3, 4, 5, 6], need: (g) => !g.met.includes("dolores"), text: "Ganz Sambuca redet über Dolores Whitfield aus Texas. Sie soll Journalisten kennen. Man sieht sie im Sommer auf Festen und abends in der Bar.", ch: [
    { l: "Eine Flasche Öl an die Villa schicken (5 l)", d: "sie erinnert sich an dich", ok: (g) => g.oil >= 5, f: (g) => { g.oil -= 5; g.rel.dolores = (g.rel.dolores ?? 30) + 10; return "Ein Kärtchen kommt zurück: „Lovely! – D.“"; } },
    no("Abwarten")] },
  { id: "wang1", icon: "📦", t: "Container-Lieferung bei Signor Wang", months: ALL, text: "In der Ferramenta Cinese stapeln sich neue Kartons: Netze, Spaten, Pumpen – alles „fast wie Original“.", ch: [
    { l: "Billig-Netze sichern (180 €)", d: "Sturmschutz für 1 Sturm", f: (g) => { pay(g, 180); g.fl.netz = Math.max(g.fl.netz || 0, 1); return "Die Netze riechen nach Plastik. Halten sie?" + rel(g, "wang", 4); } },
    no("Kein Bedarf")] },
  { id: "carmela1", icon: "🍋", t: "Es klopft: die Nachbarin", months: ALL, need: (g) => !g.met.includes("carmela"), text: "Eine ältere Dame mit einem Korb Zitronen steht vor deiner Tür. „Ich bin Carmela. Von nebenan.“", ch: [
    { l: "Reinbitten (Plaudern im Büro)", d: "Sie ist im Büro – tippe sie an", f: (g) => { g.fl.carmelaHere = abs(g); return "Carmela sitzt jetzt in deinem Büro – tippe sie an."; } },
    no("Keine Zeit")] },
];
const FIX: Record<string, string> = {};
// ---------- Feste ----------
// v0.8 (FB-23/OI-030): Schutz-Tipp je Katastrophe (Carmelas Wetter-Tratsch zeigt ihn an)
const PROTECT: Record<string, string> = { brand: "Schutz: 🚜 Brandschneise mähen (Consorzio) oder ♥ Sindaco ≥ 40 für die Protezione Civile.", duerre: "Schutz: 💧 Wasserrecht (Lago) oder Hain bewässern.", scirocco: "Schutz: 💧 Wasserrecht (Lago) oder Hain bewässern.", fliege: "Schutz: 🪤 Fallen im Hain.", diebe: "Schutz: 🐕 Wachhund (O-Dogs Garden).", sturm: "Schutz: 🕸️ Windnetze (Ferramenta/Consorzio).", flut: "Schutz: 🧱 Sandsäcke (Ferramenta) oder 🚧 Drainage (Consorzio).", regen: "Schutz: 🚧 Drainage (Consorzio).", hagel: "Schutz: 🕯️ Kerze im Santuario mildert die nächste Katastrophe.", frost: "Schutz: 🕯️ Kerze im Santuario mildert die nächste Katastrophe.", wild: "Schutz: Zäune über das Ereignis, 🕯️ Kerze mildert.", xylella: "Schutz: gepflegte Haine (Schnitt/Dünger) halten besser." };
const BET = { p: 0.45, win: 110 }; // Calcio-Wette: Einsatz 50 €, Auszahlung 110 € (Quote 2,2), Chance 45 %
const FEST: Record<number, { n: string; s: string; big?: boolean; ids: string[]; guests: string[] }> = {
  3: { n: "SETTIMANA SANTA & SAN GIORGIO", s: "Karwoche · Feldsegnung am 23. April", ids: ["santa", "giorgio"], guests: ["padre", "nonna", "carmela", "rosalia", "ciccio"] },
  4: { n: "MADONNA DELL'UDIENZA", s: "10 Tage Festa · 3. Sonntag im Mai · Pilgerweg, Palio, Luminarie, Nisciuta", big: true, ids: ["ud1", "ud2", "ud3", "ud4", "ud5"], guests: ["sindaco", "padre", "dolores", "chiara", "klaus", "giusi", "turi", "carmela"] },
  7: { n: "VASSALLI & CALICI DI STELLE", s: "Pasta col Macco · Wein unter Sternschnuppen", ids: ["vassalli", "calici"], guests: ["giusi", "dolores", "klaus", "turi", "carmela", "rosalia"] },
  8: { n: "VENDEMMIA & FIERA", s: "Weinlese · Viehmarkt 21.–22. Sept.", ids: ["fiera", "vend2"], guests: ["ciccio", "turi", "giusi", "wang"] },
  9: { n: "RACCOLTA", s: "Olivenernte beginnt", ids: ["vend3"], guests: ["ciccio", "rosalia"] },
  11: { n: "NATALE A SAMBUCA", s: "Krippe, Zampognari, Weihnachtsmarkt", ids: ["zabut"], guests: ["chiara", "padre", "carmela", "sindaco", "nonna"] },
};
// v0.8 Fest-Bilder (Referenzfotos aus Drive, im Spielstil nachgezeichnet – siehe docs/ASSETS.md)
const FEST_SC: Record<number, string> = { 3: "giorgio", 7: "vassalli" };
const EV_IMG: Record<string, string> = { santa: "santa", giorgio: "giorgio", vassalli: "vassalli", calici: "vassalli" };
const festImg = (m: number): string => (FEST_SC[m] && IMG_SC[FEST_SC[m]]) || IMG_F;
const GOALS: { t: string; chk: (g: G) => boolean; rew: number; rep: number }[] = [
  { t: "Schneide mindestens einen Hain", chk: (g) => g.groves.some((x) => x.prune), rew: 200, rep: 2 },
  { t: "Plaudere mit 2 Leuten", chk: (g) => g.talked.length >= 2, rew: 250, rep: 2 },
  { t: "Dünge alle deine Haine", chk: (g) => g.groves.every((x) => x.fert), rew: 300, rep: 3 },
  { t: "Lerne jemanden Neues kennen", chk: (g) => g.fl["metM"] === abs(g), rew: 300, rep: 3 },
  { t: "Udienza: Ansehen 30 erreichen", chk: (g) => g.rep >= 30, rew: 400, rep: 0 },
  { t: "Bewässerung (Hain) oder 💧 Wasserrecht (Lago, schützt vor Dürre)", chk: (g) => g.water || g.groves.some((x) => x.irr), rew: 300, rep: 2 },
  { t: "Fliegenfallen in allen Hainen", chk: (g) => g.groves.every((x) => x.traps), rew: 350, rep: 2 },
  { t: "Ernte-Crew sichern", chk: (g) => g.crew > 0, rew: 300, rep: 2 },
  { t: "Alle Haine mindestens 60 % Zustand", chk: (g) => g.groves.every((x) => x.cond >= 60), rew: 400, rep: 3 },
  { t: "Ernte 2.000 kg Oliven (Jahr)", chk: (g) => g.stats.harvest >= 2000, rew: 400, rep: 3 },
  { t: "Öl mit Qualität ≥ 70 im Lager", chk: (g) => g.oil > 0 && g.q >= 70, rew: 450, rep: 4 },
  { t: "Mindestens 2 Partner-Deals", chk: (g) => g.deals.length >= 2, rew: 600, rep: 4 },
];
const DEALN: Record<string, string> = { mill: "Mühlen-Deal (Rosalia)", coop: "Mahl-Gemeinschaft (Turi)", wine: "Wein-Kooperation (Giusi)", tour: "Tourismus-Deal (Pro Loco)", agri: "Agriturismo (Klaus)", export: "Export München (Klaus)", truce: "Waffenstillstand (Turi)", family: "Familien-Crew (Nonna)", us: "US-Presse (Dolores)", ciccio: "Ciccios Crew", ningbo: "Direktimport (Wang)" };
// ---------- Kontakt-Aktionen: nur mit Bekanntschaft & ♥ ----------
type Perk = { id: string; who: string; min: number; e: string; n: string; d: string; per: "y" | "m" | "once"; cost?: (g: G) => number; ok?: (g: G) => boolean; f: (g: G) => string };
const nextPrice = (g: G, a: number): number => { let f = 0.95 + hr(g.seed, 1, a) * 0.1; const s = hr(g.seed, 2, a); if (s < 0.09) f *= 1.28; else if (s < 0.18) f *= 0.78; if (a % 12 === 10 || a % 12 === 11) f *= 0.97; return Math.round(clamp(g.price * f, 4.5, 16) * 100) / 100; };
const PERKS: Perk[] = [
  { id: "topf", who: "sindaco", min: 50, e: "🏛️", n: "Fördertopf anzapfen", d: "1×/Jahr: 1.500–3.500 € PSR-Mittel", per: "y", f: (g) => { const v = Math.round((1500 + hr(g.seed, abs(g), 9) * 1500 + R(g, "sindaco") * 5) / 50) * 50; g.money += v; return `Der Sindaco unterschreibt: +${eur(v)} Fördermittel!`; } },
  { id: "dopx", who: "sindaco", min: 65, e: "🏅", n: "DOP auf dem kurzen Dienstweg", d: "DOP für 600 € statt 1.200 €", per: "once", cost: () => 600, ok: (g) => !g.dop, f: (g) => { g.dop = true; return "Stempel. Preis +8 % dauerhaft."; } },
  { id: "segen", who: "padre", min: 45, e: "⛪", n: "Feldsegen bestellen", d: "1×/Jahr: Haine +8 %, ★ +3", per: "y", f: (g) => { condAll(g, 8); repAdd(g, 3); return "Weihwasser über allen Bäumen."; } },
  { id: "mill", who: "rosalia", min: 55, e: "⚙️", n: "Mühlen-Deal", d: "Mahlgebühr dauerhaft −50 %", per: "once", ok: (g) => !g.deals.includes("mill"), f: (g) => { deal(g, "mill"); return "DEAL: Mahlgebühr −50 %."; } },
  { id: "fam", who: "nonna", min: 65, e: "👪", n: "Familien-Crew", d: "Die Familie erntet mit – Crew gratis", per: "once", ok: (g) => !g.deals.includes("family"), f: (g) => { g.crew = Math.max(g.crew, 1); deal(g, "family"); return "DEAL: Cousins, Tanten, alle kommen zur Ernte."; } },
  { id: "tratsch", who: "carmela", min: 30, e: "🌦️", n: "Wetter-Tratsch", d: "verrät Katastrophen im nächsten Monat", per: "m", f: (g) => { const n = rollEvents(g, abs(g) + 1, true).filter((id) => EVM[id] && EVM[id].dis); return n.length ? `„Ich spür’s in den Knien: ${n.map((id) => EVM[id].icon + " " + EVM[id].t).join(", ")}. Bereite dich vor!“ ${n.map((id) => PROTECT[id] ? "→ " + PROTECT[id] : "").filter(Boolean).join(" ")}` : "„Nächsten Monat? Ruhig. Meine Knie sind still.“"; } },
  { id: "agrum", who: "carmela", min: 50, e: "🍋", n: "Zitronen-Öl (Agrumato)", d: "20 l Öl → 30 Fläschchen à 18 €", per: "m", ok: (g) => g.oil >= 20, f: (g) => { g.oil -= 20; g.money += 540; g.stats.revenue += 540; return "Carmelas Zitronen + dein Öl: +540 €."; } },
  { id: "tipp", who: "salvo", min: 35, e: "📈", n: "Insider-Tipp Ölpreis", d: "Trend für nächsten Monat", per: "m", f: (g) => { const p = nextPrice(g, abs(g) + 1); return `„Hab’s vom Großhändler: nächsten Monat ${p > g.price * 1.03 ? "📈 steigt" : p < g.price * 0.97 ? "📉 fällt" : "➡️ bleibt"} der Preis (≈ ${p.toFixed(2)} €/l).“`; } },
  { id: "barsell", who: "salvo", min: 60, e: "☕", n: "Öl über die Bar verkaufen", d: "bis 40 l zu 135 %", per: "m", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 40, 1.35, "die Bar del Corso") },
  { id: "ningbo", who: "wang", min: 55, e: "🚢", n: "Direktimport aus Ningbo", d: "neuer Rüttler für 700 € (hält)", per: "once", cost: () => 700, ok: (g) => !g.gear || !!g.fl.cheap, f: (g) => { g.gear = true; g.fl.cheap = 0; return "Ein nagelneuer Rüttler im Karton. Anleitung auf Chinesisch."; } },
  { id: "crew", who: "ciccio", min: 40, e: "👷", n: "Ciccios Crew anheuern", d: "Erntehelfer, Lohn −25 %, Ertrag +10 %", per: "y", cost: (g) => Math.round(wage(g) * 0.75), ok: (g) => g.m >= 6 && g.m <= 10 && g.crew === 0, f: (g) => { g.crew = 1; deal(g, "ciccio"); return "Ciccio pfeift – sechs Männer stehen bereit."; } },
  { id: "wein", who: "giusi", min: 40, e: "🍷", n: "Wein-Nebenlinie", d: "600 Flaschen, Verkauf ab Nov.", per: "y", cost: () => 1200, ok: (g) => (g.m === 7 || g.m === 8) && g.wine === 0, f: (g) => { g.wine = 600; return "600 Flaschen „Rosso Pandolfina“ reifen bei Giusi."; } },
  { id: "winesell", who: "giusi", min: 0, e: "🍾", n: "Rosso Pandolfina verkaufen", d: "600 Flaschen à ~4 €", per: "m", ok: (g) => g.m >= 10 && g.wine > 0, f: (g) => { const e = Math.round(g.wine * 4 * (1 + g.rep / 300)); g.money += e; g.wine = 0; return `+${eur(e)}.`; } },
  { id: "coopw", who: "giusi", min: 65, e: "🤝", n: "Wein-Kooperation", d: "Crew & Gerät teilen: Löhne −30 %", per: "once", ok: (g) => !g.deals.includes("wine"), f: (g) => { deal(g, "wine"); return "DEAL: Wein & Öl gemeinsam."; } },
  { id: "tast", who: "chiara", min: 40, e: "🍞", n: "Verkostung für Tourist:innen", d: "Apr–Okt: bis 25 l zu 145 %, ★ +2", per: "m", cost: () => 80, ok: (g) => g.m >= 3 && g.m <= 9 && g.oil > 0, f: (g) => { repAdd(g, 2); return sellAt(g, 25, 1.45, "Tourist:innen"); } },
  { id: "tour", who: "chiara", min: 65, e: "🚌", n: "Tourismus-Deal", d: "Monatseinnahmen von der Pro Loco", per: "once", ok: (g) => !g.deals.includes("tour"), f: (g) => { deal(g, "tour"); return "DEAL: Dein Hain steht im Tour-Programm."; } },
  { id: "exp", who: "klaus", min: 60, e: "🇩🇪", n: "Export nach München", d: "alle Verkäufe +8 %", per: "once", ok: (g) => !g.deals.includes("export"), f: (g) => { deal(g, "export"); return "DEAL: Exportvertrag München."; } },
  { id: "truce", who: "turi", min: 55, e: "🕊️", n: "Waffenstillstand", d: "keine Sabotage mehr, ★ +4", per: "once", ok: (g) => !g.deals.includes("truce"), f: (g) => { deal(g, "truce"); repAdd(g, 4); return "DEAL: Turi gibt dir die Hand. Fest."; } },
  { id: "press", who: "dolores", min: 50, e: "📰", n: "US-Presse: Reportage in New York", d: "1.000 €: Preis +10 %, US-Tourist:innen zahlen monatlich", per: "once", cost: () => 1000, ok: (g) => !g.deals.includes("us"), f: (g) => { deal(g, "us"); repAdd(g, 8); return "„The Secret Olive Oil of Sicily“ – die Reportage geht viral. ★ +8."; } },
  { id: "texas", who: "dolores", min: 70, e: "🇺🇸", n: "Container nach Texas", d: "1×/Jahr: bis 120 l zu 220 %", per: "y", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 120, 2.2, "Dolores’ Freunde in Houston") },
  // v0.9.0 (FB-40/OI-050): Vorteile der Ladenbesitzer:innen
  { id: "linsell", who: "lin", min: 40, e: "🧴", n: "Öl ins Ladenregal", d: "bis 10 l zu 150 %", per: "m", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 10, 1.5, "Y&L Haushaltswaren") },
  { id: "focac", who: "nunzia", min: 45, e: "🥖", n: "Öl für die Focaccia", d: "bis 15 l zu 135 %", per: "m", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 15, 1.35, "Nunzias Panificio") },
  { id: "rasur", who: "gaspare", min: 50, e: "💈", n: "Ein gutes Wort beim Sindaco", d: "1×/Jahr: Sindaco ♥ +8 (wenn bekannt), sonst ★ +2", per: "y", f: (g) => { if (g.met.includes("sindaco")) return "Beim Rasieren fällt dein Name."+rel(g, "sindaco", 8); repAdd(g, 2); return "Gaspare erzählt im ganzen Dorf von dir. ★ +2"; } },
  { id: "tabsell", who: "pippo", min: 40, e: "🎟️", n: "Öl an die Lkw-Fahrer", d: "bis 8 l zu 150 %", per: "m", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 8, 1.5, "Pippos Tabacchi") },
  { id: "crema", who: "lobue", min: 45, e: "⚕️", n: "Olivenöl-Kosmetik", d: "1×/Jahr: bis 30 l zu 170 %", per: "y", ok: (g) => g.oil > 0 && g.q >= 50, f: (g) => sellAt(g, 30, 1.7, "die Farmacia (Kosmetiklinie)") },
  { id: "artikel", who: "enzo", min: 40, e: "📰", n: "Artikel im Lokalblatt", d: "einmalig: ★ +5", per: "once", f: (g) => { repAdd(g, 5); return "„Der Neue rettet die alten Haine“ – ★ +5."; } },
  { id: "pecor", who: "peppe", min: 50, e: "🥩", n: "Öl für den Pecorino", d: "bis 20 l zu 130 %", per: "m", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 20, 1.3, "die Macelleria") },
  { id: "voelker", who: "nino", min: 45, e: "🐝", n: "Bienenvölker in den Hain", d: "1×/Jahr: Ertrag +5 %", per: "y", f: (g) => { g.yieldMod += 0.05; return "Ninos beste Völker summen zwischen deinen Bäumen. Ertrag +5 %."; } },
  { id: "hund", who: "marta", min: 45, e: "🐕", n: "Wachhund geschenkt", d: "einmalig: Wachhund gratis (Schutz vor Olivendieben)", per: "once", ok: (g) => !g.fl.dog, f: (g) => { g.fl.dog = 1; return "Bruno zieht bei dir ein – Marta winkt ab: „Geschenk.“"; } },
  { id: "antrag", who: "ragio", min: 50, e: "🧾", n: "Förderantrag Consorzio", d: "1×/Jahr: 800–1.500 € Agrarförderung", per: "y", f: (g) => { const v = Math.round((800 + hr(g.seed, abs(g), 31) * 700) / 50) * 50; g.money += v; return `Gestempelt, unterschrieben, bewilligt: +${eur(v)}.`; } },
];
// v0.9.0 (FB-39/OI-049): Vitamin B – für jede Figur mit vb ein einmaliger Vermittler-Vorteil „Stell mich … vor“
CHARS.forEach((c) => { if (!c.vb) return; const [w, mn] = c.vb; PERKS.push({ id: "vb_" + c.id, who: w, min: mn, e: "🤝", n: `Vitamin B: Stell mich ${c.n} vor`, d: `einmalig: ${c.n} (${c.r.split("·")[0].trim()}) wird erreichbar, Kennenlernen leichter`, per: "once", ok: (g) => !g.met.includes(c.id) && g.fl["intro_" + c.id] === undefined, f: (g) => { g.fl["intro_" + c.id] = abs(g); return `${CHM[w].n} legt ein gutes Wort ein. ${c.n} erwartet dich – schau bei ${c.r.split("·")[0].trim()} vorbei.`; } }); });
// ---------- Kleine Orte mit Zufallsbegegnungen ----------
type Enc = { t: string; l: string; d: string; ok?: (g: G) => boolean; f: (g: G, r: number) => string };
// v0.8 (FB-05/OI-017): px = echte Kartenposition in Karten-% (aus OSM/Poster), hat Vorrang vor x/y (Canvas-Altwerte)
type Minor = { id: string; n: string; e: string; x: number; y: number; px?: [number, number]; map: "s" | "u"; enc: Enc[] };
const MINOR: Minor[] = [
  // v0.8 (FB-16/OI-023): Y&L Haushaltswaren (Casalinghi) – echter Laden in Sambuca
  { id: "casal", n: "Y&L Haushaltswaren", e: "🧴", x: 0, y: 0, px: [56.43, 31.38], map: "s", enc: [
    { t: "Die Inhaberin sucht Öl in kleinen Flaschen für ihr Regal.", l: "5 l liefern", d: "5 l zu 140 %", ok: (g) => g.oil >= 5, f: (g) => sellAt(g, 5, 1.4, "Y&L Haushaltswaren") },
    { t: "Restposten: Etiketten und Glasflaschen, 40 € für alles.", l: "Kaufen (40 €)", d: "★ +2 – schönere Flaschen", f: (g) => { pay(g, 40); repAdd(g, 2); return "Deine Flaschen sehen jetzt aus wie aus Palermo. ★ +2"; } },
    { t: "Ein Kunde fragt, ob dein Öl auch hier zu haben ist.", l: "Probe dalassen (1 l)", d: "★ +1", ok: (g) => g.oil >= 1, f: (g) => { g.oil -= 1; repAdd(g, 1); return "Die Probe ist in einer Stunde leer. ★ +1"; } }] },
  // v0.8 (FB-17/OI-023): O-Dogs Garden – Hundepension/Tierheim, Wachhund gegen Olivendiebe
  { id: "dogs", n: "O-Dogs Garden", e: "🐕", x: 0, y: 0, px: [76.03, 76.69], map: "u", enc: [
    { t: "Ein Rudel Hunde begrüßt dich am Zaun. Die Betreiberin sucht Paten.", l: "Gassi gehen", d: "★ +1", f: (g) => { repAdd(g, 1); return "Eine Stunde mit sechs Hunden. ★ +1"; } },
    { t: "Futterspende? Die Säcke sind leer.", l: "Spenden (30 €)", d: "★ +2", f: (g) => { pay(g, 30); repAdd(g, 2); return "Die Hunde danken lautstark. ★ +2"; } }] },
  { id: "ferr", n: "Ferramenta Cinese", e: "🔧", x: 45.4, y: 71, map: "s", px: [38.79, 49.06], enc: [
    { t: "Ein Bauer reklamiert lautstark seinen kaputten Spaten.", l: "Mitlachen", d: "Wang ♥+3", f: (g) => "Wang zuckt die Schultern: „19 Euro!“" + rel(g, "wang", 3) },
    { t: "Restposten: Fliegenfallen, Kiste zu 40 €.", l: "Kiste kaufen (40 €)", d: "nächste Fallen −50 %", f: (g) => { pay(g, 40); g.fl.trapdisc = 1; return "Eine Kiste gelber Leimtafeln."; } },
    { t: "Wang zeigt dir ein Video vom Großhandel in Palermo.", l: "Zuschauen", d: "Wang ♥+4", f: (g) => "Er zeigt dir 40 Minuten lang Kartons." + rel(g, "wang", 4) }] },
  { id: "panif", n: "Panificio", e: "🥖", x: 54.4, y: 72, map: "s", px: [75.27, 21.33], enc: [
    { t: "Die Bäckerin braucht Öl für ihre Focaccia.", l: "10 l verkaufen (130 %)", d: "", ok: (g) => g.oil >= 10, f: (g) => sellAt(g, 10, 1.3, "das Panificio") },
    { t: "Schlange vor der Theke – alle reden über Zio Turi.", l: "Zuhören", d: "★ +1", f: (g) => { repAdd(g, 1); return "Turi soll einen neuen Traktor haben. Auf Kredit."; } },
    { t: "Frische Cuccidati für die Nonna?", l: "Kaufen (6 €)", d: "Nonna ♥+4", f: (g) => { pay(g, 6); return "Nonna strahlt." + rel(g, "nonna", 4); } }] },
  { id: "tabac", n: "Tabacchi & Lotto", e: "🎟️", x: 40.3, y: 92.4, map: "s", px: [61.79, 62.8], enc: [
    { t: "Gratta e Vinci, das Los zu 5 €.", l: "Rubbeln (5 €)", d: "10 %: 250 €", f: (g, r) => { pay(g, 5); if (r < 0.1) { g.money += 250; return "HAUPTGEWINN! +250 €."; } return r < 0.35 ? (g.money += 10, "+10 €. Immerhin.") : "Niete."; } },
    { t: "Der Tabaccaio sucht ein Geschenk für seine Schwiegermutter.", l: "5 l Öl verkaufen (150 %)", d: "", ok: (g) => g.oil >= 5, f: (g) => sellAt(g, 5, 1.5, "den Tabaccaio") }] },
  { id: "barb", n: "Barbiere Gaspare", e: "💈", x: 17, y: 63, map: "s", px: [52.94, 71.41], enc: [
    { t: "Haarschnitt 12 € – und der komplette Dorfklatsch.", l: "Schneiden lassen (12 €)", d: "★ +2", f: (g) => { pay(g, 12); repAdd(g, 2); return "Frisch frisiert grüßt dich das halbe Dorf."; } },
    { t: "Gaspare rasiert sonst den Sekretär des Sindaco.", l: "Gutes Wort einlegen (50 €)", d: "Sindaco ♥+6 (auch unbekannt)", f: (g) => { pay(g, 50); g.rel.sindaco = clamp((g.rel.sindaco ?? 30) + 6, 0, 100); return "„Ich sag’s ihm beim Rasieren.“"; } }] },
  { id: "farm", n: "Farmacia", e: "⚕️", x: 63.5, y: 58.7, map: "s", px: [66.19, 55.27], enc: [
    { t: "Dein Rücken nach der Arbeit im Hain …", l: "Wärmesalbe (15 €)", d: "+2 ⏳ nächsten Monat", f: (g) => { pay(g, 15); g.fl.apb = (g.fl.apb || 0) + 2; return "Riecht nach Kampfer. Hilft aber."; } },
    { t: "Die Apothekerin fragt nach Öl für Naturkosmetik.", l: "15 l verkaufen (140 %)", d: "", ok: (g) => g.oil >= 15, f: (g) => sellAt(g, 15, 1.4, "die Farmacia") }] },
  { id: "edic", n: "Edicola", e: "📰", x: 31, y: 47, map: "s", px: [38.92, 56.34], enc: [
    { t: "Giornale di Sicilia: Ölpreis-Prognose.", l: "Zeitung (2 €)", d: "Preis-Trend", f: (g) => { pay(g, 2); const p = nextPrice(g, abs(g) + 1); return `Analysten erwarten ${p > g.price ? "steigende" : "fallende"} Preise (≈ ${p.toFixed(2)} €/l).`; } },
    { t: "Kleinanzeigen im Lokalblatt.", l: "Inserat schalten (150 €)", d: "★ +3", f: (g) => { pay(g, 150); repAdd(g, 3); return "„Olio extravergine aus Pandolfina“ – mit Foto."; } }] },
  { id: "mac", n: "Macelleria", e: "🥩", x: 34.4, y: 19.4, map: "s", px: [42.51, 88.23], enc: [
    { t: "Der Metzger braucht Öl für seine Salsiccia.", l: "15 l verkaufen (125 %)", d: "", ok: (g) => g.oil >= 15, f: (g) => sellAt(g, 15, 1.25, "die Macelleria") },
    { t: "Ciccio liefert gerade Lämmer ab.", l: "Hallo sagen", d: "Ciccio ♥+4 (auch unbekannt)", f: (g) => { g.rel.ciccio = clamp((g.rel.ciccio ?? 30) + 4, 0, 100); return "„Hm.“ – Für Ciccio fast eine Rede."; } }] },
  { id: "masseria", n: "Masseria abbandonata", e: "🏚️", x: 65.9, y: 73.6, map: "u", enc: [
    { t: "Im Schuppen stehen alte Ölkrüge.", l: "Durchsuchen", d: "Glückssache", f: (g, r) => { if (r < 0.3) { g.money += 220; return "Ein antiker Orcio! Ein Sammler zahlt 220 €."; } if (r < 0.6) { g.spade += 2; return "Ein rostiger Spaten (2 Einsätze)."; } return "Nur Tauben."; } },
    { t: "Jugendliche aus Sambuca feiern hier.", l: "Mitfeiern", d: "★ +1", f: (g) => { repAdd(g, 1); return "Sie posten dich. Du bist jetzt „der Olivenmann“."; } }] },
  { id: "imker", n: "Apicoltore Nino", e: "🐝", x: 76.5, y: 81.6, map: "u", px: [84.5, 62.0], enc: [
    { t: "Nino will Bienenstöcke in deinen Hain stellen.", l: "Einverstanden", d: "Ertrag +4 % (dieses Jahr)", ok: (g) => !g.fl.bees, f: (g) => { g.fl.bees = 1; g.yieldMod += 0.04; return "Es summt im Hain."; } },
    { t: "Honig gegen Öl?", l: "5 l tauschen", d: "Nonna ♥+5", ok: (g) => g.oil >= 5, f: (g) => { g.oil -= 5; return "Zagara-Honig für die Nonna." + rel(g, "nonna", 5); } }] },
  { id: "pozzo", n: "Brunnen", e: "⛲", x: 46.7, y: 24.3, map: "u", enc: [
    { t: "Kühles Quellwasser.", l: "Kanister schleppen", d: "Sommer: Haine +3 %", f: (g) => { if (g.m >= 5 && g.m <= 7) { condAll(g, 3); return "Die Bäume danken es: +3 %."; } return "Erfrischend. Mehr nicht."; } }] },
  { id: "kapelle", n: "Cappella di Adragna", e: "🕯️", x: 61, y: 32.6, map: "u", enc: [
    { t: "Ein Votivbild der Madonna, Kerzenstummel.", l: "Kerze anzünden", d: "nächste Katastrophe −40 %", f: (g) => { g.fl.pray = 1; return "Stille. Du fühlst dich beschützt."; } }] },
  { id: "schaefer", n: "Ciccios Weide", e: "🐑", x: 12, y: 30, map: "u", enc: [
    { t: "Die Schafe könnten unter deinen Bäumen weiden.", l: "Erlauben", d: "Haine +3 %", f: (g) => { condAll(g, 3); return "Natürlicher Mulch, gratis." + rel(g, "ciccio", 2); } },
    { t: "Frische Ricotta, noch warm.", l: "Probieren (3 €)", d: "Ciccio ♥+3", f: (g) => { pay(g, 3); return "Himmlisch." + rel(g, "ciccio", 3); } }] },
  { id: "consorzio", n: "Consorzio Agrario", e: "🧰", x: 79, y: 62.8, map: "u", enc: [
    { t: "Agronom-Beratung am Tresen.", l: "Beraten lassen (60 €)", d: "Haine +4 %", f: (g) => { pay(g, 60); condAll(g, 4); return "Weniger Stickstoff, mehr Kalium."; } }] },
  { id: "bosco", n: "Bosco della Resinata", e: "🌲", x: 20, y: 15, map: "u", enc: [
    { t: "Pilzsaison im Wald.", l: "Pilze sammeln", d: "~40 €", f: (g, r) => { if (r < 0.15) return "Wildschweine! Du rennst."; g.money += 40; return "Ein Korb Funghi: +40 €."; } },
    { t: "Die Jäger von Adragna.", l: "Wurst teilen", d: "★ +2", f: (g) => { repAdd(g, 2); return "Salsiccia di cinghiale am Feuer."; } }] },
];
type Shop = { id: string; at: string; n: string; d: string; cost: (g: G) => number; ok: (g: G) => boolean; f: (g: G) => string };
const disc = (g: G): number => (R(g, "wang") >= 40 ? 0.8 : 1);
const SHOP: Shop[] = [
  { id: "spade1", at: "ferr", n: "🪓 Billig-Spaten", d: "3 Einsätze, Pflege ohne Spaten +25 %", cost: (g) => Math.round(19 * disc(g)), ok: () => true, f: (g) => { g.spade += 3; return "Der Stiel knarzt schon im Laden."; } },
  { id: "netz1", at: "ferr", n: "🕸️ Billig-Windnetze", d: "Sturmschutz für 1 Sturm", cost: (g) => Math.round(180 * disc(g)), ok: (g) => !g.fl.netz, f: (g) => { g.fl.netz = 1; return "Netze gekauft."; } },
  { id: "sand", at: "ferr", n: "🧱 Sandsäcke", d: "Flutschaden-Puffer (1×)", cost: (g) => Math.round(60 * disc(g)), ok: () => true, f: (g) => { g.fl.sand = (g.fl.sand || 0) + 1; return "20 Säcke im Schuppen."; } },
  { id: "kamm", at: "ferr", n: "🪮 Erntekamm + Bodennetze", d: "Ernte-Minispiel: wischen statt tippen, mehr Oliven (Deckel 40)", cost: (g) => Math.round(120 * disc(g)), ok: (g) => !g.fl.kamm, f: (g) => { g.fl.kamm = 1; return "Kamm und Netze liegen im Schuppen."; } },
  { id: "gear1", at: "ferr", n: "🔩 Billig-Rüttler", d: "Ernte +15 %, aber 35 % Bruch pro Ernte", cost: (g) => Math.round(850 * disc(g)), ok: (g) => !g.gear, f: (g) => { g.gear = true; g.fl.cheap = 1; return "„Garantie? Was ist Garantie?“"; } },
  { id: "spade2", at: "consorzio", n: "⛏️ Profi-Spaten", d: "12 Einsätze", cost: () => 89, ok: () => true, f: (g) => { g.spade += 12; return "Solide Ware aus Brescia."; } },
  { id: "netz2", at: "consorzio", n: "🛡️ Windschutznetze", d: "hält 3 Stürme", cost: () => 450, ok: (g) => (g.fl.netz || 0) < 2, f: (g) => { g.fl.netz = 3; return "Profi-Netze montiert."; } },
  { id: "drain", at: "consorzio", n: "🚧 Drainagegräben", d: "Flutschaden dauerhaft −70 %", cost: () => 900, ok: (g) => !g.fl.drain, f: (g) => { g.fl.drain = 1; return "Bagger, Rohre, Kies – fertig."; } },
  { id: "presse", at: "consorzio", n: "🏭 Eigene Mini-Presse", d: "Press-Minispiel mit Thermometer: alle Gänge ≤ 27 °C = kaltgepresst (+8 Qualität)", cost: () => 4500, ok: (g) => !g.fl.presse, f: (g) => { g.fl.presse = 1; return "Edelstahl, glänzend, deins."; } },
  { id: "gear2", at: "consorzio", n: "🔧 Rüttler (neu)", d: "Ernte +15 %, Lohn halbiert", cost: () => 1800, ok: (g) => !g.gear || !!g.fl.cheap, f: (g) => { g.gear = true; g.fl.cheap = 0; return "Ein Abbacchiatore mit Garantie."; } },
  { id: "bio", at: "muni", n: "🌿 Bio-Zertifikat beantragen", d: "Preis +10 %, Qualität +10", cost: () => 800, ok: (g) => !g.bio, f: (g) => { g.bio = true; return "Bio-zertifiziert."; } },
  { id: "dop", at: "muni", n: "🏅 DOP Val di Mazara", d: "Preis +8 % dauerhaft", cost: () => 1200, ok: (g) => !g.dop, f: (g) => { g.dop = true; repAdd(g, 3); return "DOP! ★ +3."; } },
  { id: "schneise", at: "consorzio", n: "🚜 Brandschneise mähen", d: "Schutz vor Flächenbrand für 12 Monate: Gras und Gestrüpp um alle Haine wird gemäht (100 € + 0,40 €/Baum)", cost: (g) => 100 + Math.round(trees(g) * 0.4), ok: (g) => g.fl.schneise === undefined || abs(g) - g.fl.schneise >= 12, f: (g) => { g.fl.schneise = abs(g); return "Der Consorzio mäht eine breite Schneise um deine Haine. Brandschutz für 12 Monate."; } },
  { id: "dog", at: "dogs", n: "🐕 Wachhund adoptieren", d: "Schutz vor Olivendieben: im Ereignis „Olivendiebe“ gibt es die sichere Option „Wachhunde“, Risiko sonst nur 10 % statt 40 %", cost: () => 350, ok: (g) => !g.fl.dog, f: (g) => { g.fl.dog = 1; repAdd(g, 1); return "Bruno zieht in deinen Hain. Ab jetzt bellt hier jeder Dieb ins Leere. ★ +1"; } },
  { id: "water", at: "lago", n: "💧 Wasserrecht am Lago", d: "Wirkung: alle Haine gelten dauerhaft als bewässert (💧, keine Bewässerungs-Kosten), Dürre & Hitzewelle ohne Schaden, erfüllt das Juni-Ziel", cost: () => 1500, ok: (g) => !g.water, f: (g) => { g.water = true; return "Wasserrecht erworben."; } },
];
const SPOTS: { id: string; n: string; x: number; y: number }[] = [
  { id: "lago", n: "Hain am Lago Arancio", x: 33, y: 80 }, { id: "adranone", n: "Alte Bäume am Stadtrand", x: 80, y: 86 }, { id: "misili", n: "Contrada Misilifurmi", x: 36, y: 38 },
  { id: "adragna", n: "Terrassen bei Adragna", x: 55, y: 55 }, { id: "batia", n: "Contrada Batia", x: 28, y: 20 }, { id: "genuardo", n: "Hang am Monte Genuardo", x: 7, y: 48 }, { id: "torreh", n: "Hain unter der Torre", x: 60, y: 12 }, { id: "giov", n: "Uliveto Giovinco", x: 57, y: 86 },
];
