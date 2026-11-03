// ===== v0.9.0 (FB-37/OI-047): Sprachwahl DE/EN/IT – siehe docs/I18N.md =====
// Prinzip: Quelltext bleibt Deutsch (Master). Ein DOM-Übersetzer (MutationObserver) ersetzt
// Textknoten und Attribute (placeholder/title/aria-label) über das Wörterbuch I18N_DICT
// (game/i18n_dict.tsx, erzeugt von source/tools/i18n_build.py) + Muster mit Platzhaltern {0}.
type Lang = "de" | "en" | "it";
const LANGS: { id: Lang; flag: string; n: string }[] = [{ id: "de", flag: "🇩🇪", n: "Deutsch" }, { id: "en", flag: "🇬🇧", n: "English" }, { id: "it", flag: "🇮🇹", n: "Italiano" }];
const LANG_KEY = "sambuca5_lang";
let LANG: Lang = "de";
const I18N_MISS = new Set<string>();
type Pat = { re: RegExp; idx: number[]; en: string; it: string; lit: number };
let I18N_PATS: Pat[] | null = null;
const i18nPats = (): Pat[] => {
  if (I18N_PATS) return I18N_PATS;
  const out: Pat[] = [];
  for (const k of Object.keys(I18N_DICT)) {
    if (k.indexOf("{0}") < 0) continue;
    const idx: number[] = [];
    const src = k.split(/(\{\d\})/).map((p) => { const m = /^\{(\d)\}$/.exec(p); if (m) { idx.push(+m[1]); return "([\\s\\S]*?)"; } return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("");
    out.push({ re: new RegExp("^" + src + "$"), idx, en: I18N_DICT[k][0], it: I18N_DICT[k][1], lit: (k.replace(/\{\d\}/g, "").match(/[A-Za-zÄÖÜäöüß]/g) || []).length });
  }
  out.sort((a, b) => b.re.source.length - a.re.source.length); I18N_PATS = out; return out;
};
// v0.9.1 (FB-43): Zahlen-Generalisierung – "Aperitivo (12 €)" findet auch "Aperitivo (9 €)".
const NUM_RE = /\d+(?:[.,]\d+)*/g;
let I18N_NUM: Record<string, [string, string]> | null = null;
const i18nNum = (): Record<string, [string, string]> => {
  if (I18N_NUM) return I18N_NUM; const o: Record<string, [string, string]> = {};
  for (const k of Object.keys(I18N_DICT)) {
    const nums = k.match(NUM_RE); if (!nums) continue;
    const nk = k.replace(NUM_RE, "#"); if (o[nk]) continue;
    const conv = (t: string): string | null => { let ok = true; const used = new Set<number>(); const r = t.replace(NUM_RE, (x) => { const xn = x.replace(/[.,]/g, ""); const i = nums.findIndex((n, j) => !used.has(j) && n.replace(/[.,]/g, "") === xn); if (i < 0) { ok = false; return x; } used.add(i); return "\u0001" + i + "\u0002"; }); return ok ? r : null; };
    const en = conv(I18N_DICT[k][0]), it = conv(I18N_DICT[k][1]); if (en !== null && it !== null) o[nk] = [en, it];
  }
  I18N_NUM = o; return o;
};
// Schlüssel ohne führendes Emoji ("🚜 Brandschneise mähen" → "Brandschneise mähen")
let I18N_STRIP: Record<string, [string, string]> | null = null;
const LEAD = /^[^A-Za-zÄÖÜäöüß„"(0-9]+/;
const i18nStrip = (): Record<string, [string, string]> => { if (I18N_STRIP) return I18N_STRIP; const o: Record<string, [string, string]> = {}; for (const k of Object.keys(I18N_DICT)) { const m = LEAD.exec(k); if (!m) continue; const sk = k.slice(m[0].length); const v = I18N_DICT[k]; if (sk && !o[sk] && !I18N_DICT[sk]) o[sk] = [v[0].replace(LEAD, ""), v[1].replace(LEAD, "")]; } I18N_STRIP = o; return o; };
const GERM = /[äöüßÄÖÜ]|\b(der|die|das|und|ist|nicht|mit|für|auf|ein|eine|einen|zu|zum|zur|vom|von|bis|ab|kein|keine|du|dein|deine|noch|wenn|oder|nur|auch|im|am|dem|den|des|Jahr|Monat)\b/;
const I18N_MEMO: Record<string, Map<string, string | null>> = { en: new Map(), it: new Map() };
const trCore = (s: string, depth: number, seg = true): string | null => {
  const d = I18N_DICT[s]; if (d) return LANG === "en" ? d[0] : d[1];
  if (depth > 4) return null;
  const mk = depth + (seg ? "1" : "0") + s; const memo = I18N_MEMO[LANG]; if (memo && memo.has(mk)) return memo.get(mk) as string | null;
  const r = trCore2(s, depth, seg); if (memo) memo.set(mk, r); return r;
};
const trCore2 = (s: string, depth: number, seg: boolean): string | null => {
  for (const p of i18nPats()) {
    if (!seg && p.lit < 3) continue; // reine Trenner-Muster ({0}: {1}) nicht für Teilstücke
    const m = p.re.exec(s); if (!m) continue;
    const vals: Record<number, string> = {}; let ok = true; p.idx.forEach((n, i) => { const v = m[i + 1]; const t = /[A-Za-zÄÖÜäöüß]{2}/.test(v) ? trCore(v.trim(), depth + 1) : null; if (t === null && GERM.test(v)) ok = false; vals[n] = t === null ? v : v.replace(v.trim(), t); });
    if (!ok) continue;
    return (LANG === "en" ? p.en : p.it).replace(/\{(\d)\}/g, (_, n: string) => vals[+n] ?? "");
  }
  const nums = s.match(NUM_RE);
  if (nums) { const e = i18nNum()[s.replace(NUM_RE, "#")]; if (e) return (LANG === "en" ? e[0] : e[1]).replace(/\u0001(\d+)\u0002/g, (_, i: string) => nums[+i]); }
  // v0.9.1 (FB-43): zusammengesetzte Texte (Label · Kosten, Titel: Text, mehrere Sätze) stückweise
  if (seg && depth <= 3) {
    const parts = s.split(/( · | – | — |: |\n|(?<=[.!?…“])\s+(?=\S))/);
    if (parts.length > 1) { let any = false, bad = false; const out: string[] = []; const n = parts.length;
      // längste übersetzbare Teilfolge zuerst ("Starkregen: Der Belice …" steht als Ganzes im Wörterbuch)
      for (let i = 0; i < n; i += 2) {
        let done = false;
        for (let j = n - 1; j > i; j -= 2) { if (i === 0 && j === n - 1) continue; const sp = parts.slice(i, j + 1).join(""); const t = sp.trim() ? trCore(sp.trim(), depth + 1, false) : null; if (t !== null) { out.push(sp.replace(sp.trim(), t)); if (j + 1 < n) out.push(parts[j + 1]); i = j; any = true; done = true; break; } }
        if (done) continue;
        const p = parts[i]; let v = p;
        if (/[A-Za-zÄÖÜäöüß]{2}/.test(p)) { const t = trCore(p.trim(), depth + 1, false); if (t !== null) { any = true; v = p.replace(p.trim(), t); } else if (GERM.test(p)) bad = true; }
        out.push(v); if (i + 1 < n) out.push(parts[i + 1]);
      }
      if (any && !bad) return out.join(""); }
  }
  // v0.9.1 (FB-43): Emoji/Satzzeichen-Rand abtrennen ("🏷️ Alte Bäume …")
  const sk = i18nStrip()[s]; if (sk) return LANG === "en" ? sk[0] : sk[1];
  const am = /^([^A-Za-zÄÖÜäöüß„"(0-9]*)([\s\S]*?)((?:\s*\([^A-Za-zÄÖÜäöüß()]*\))?[\s.!?:]*)$/.exec(s);
  if (am && (am[1] || am[3]) && am[2] && am[2] !== s) { const r = trCore(am[2], depth + 1, seg); if (r !== null) return am[1] + r + am[3]; }
  return null;
};
const tr = (s: string): string => {
  if (LANG === "de") return s;
  const t = s.trim(); if (!t || !/[A-Za-zÄÖÜäöüß]{2}/.test(t)) return s;
  const r = trCore(t, 0);
  if (r === null) { I18N_MISS.add(t); return s; }
  return s.replace(t, r);
};
// Original je Knoten + zuletzt von uns gesetzter Wert (erkennt, wenn React den Text neu setzt)
const ORIG = new WeakMap<Node, string>(); const SET = new WeakMap<Node, string>(); const ORIG_A = new WeakMap<Element, Record<string, string>>();
const ATTRS = ["placeholder", "title", "aria-label"];
let i18nBusy = false;
const origOf = (n: Node): string => { const cur = n.nodeValue || ""; const o = ORIG.get(n); if (o !== undefined && SET.get(n) === cur) return o; ORIG.set(n, cur); return cur; };
const put = (n: Node, v: string): void => { SET.set(n, v); if (n.nodeValue !== v) n.nodeValue = v; };
// React zerlegt {a} l zu {b} % in mehrere Textknoten → Gruppe gemeinsam übersetzen
const trGroup = (el: Element): boolean => {
  const kids = Array.from(el.childNodes); if (kids.length < 2 || kids.some((k) => k.nodeType !== 3)) return false;
  const origs = kids.map(origOf); const joined = origs.join("");
  if (LANG === "de") { kids.forEach((k, i) => put(k, origs[i])); return true; }
  const t = joined.trim(); const r = t && /[A-Za-zÄÖÜäöüß]{2}/.test(t) ? trCore(t, 0) : null;
  if (r === null) { kids.forEach((k, i) => put(k, tr(origs[i]))); if (t && /[A-Za-zÄÖÜäöüß]{2}/.test(t) && origs.some((o) => tr(o) === o && /[A-Za-zÄÖÜäöüß]{2}/.test(o))) I18N_MISS.add(t); return true; }
  put(kids[0], joined.replace(t, r)); for (let i = 1; i < kids.length; i++) put(kids[i], "");
  return true;
};
const trNode = (n: Node): void => {
  if (n.nodeType === 3) {
    const p = n.parentNode as Element | null; if (p && (p.nodeName === "STYLE" || p.nodeName === "SCRIPT")) return;
    if (p && p.nodeType === 1 && trGroup(p)) return;
    put(n, tr(origOf(n))); return;
  }
  if (n.nodeType !== 1) return; const el = n as Element; if (el.nodeName === "STYLE" || el.nodeName === "SCRIPT") return;
  for (const a of ATTRS) { const cur = el.getAttribute(a); if (cur === null) continue; const rec = ORIG_A.get(el) || {}; const o = rec[a]; const orig = o !== undefined && (o === cur || tr(o) === cur) ? o : cur; rec[a] = orig; ORIG_A.set(el, rec); const v = tr(orig); if (v !== cur) el.setAttribute(a, v); }
  if (trGroup(el)) return;
  el.childNodes.forEach(trNode);
};
let i18nObs: MutationObserver | null = null;
const i18nApply = (): void => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = LANG;
  if (!i18nObs) {
    i18nObs = new MutationObserver((ms) => { if (i18nBusy) return; i18nBusy = true; try { for (const m of ms) { if (m.type === "characterData") trNode(m.target); else if (m.type === "attributes") trNode(m.target); else m.addedNodes.forEach(trNode); } } finally { i18nBusy = false; } });
    i18nObs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  i18nBusy = true; try { trNode(document.body); } finally { i18nBusy = false; }
};
const setLang = (l: Lang): void => { LANG = l; try { window.localStorage.setItem(LANG_KEY, l); } catch { } i18nApply(); };
const getLangStored = (): Lang | null => { try { const v = window.localStorage.getItem(LANG_KEY); return v === "de" || v === "en" || v === "it" ? v : null; } catch { return null; } };
if (typeof window !== "undefined") (window as unknown as { __i18n: unknown }).__i18n = { miss: I18N_MISS, tr, core: (s: string, d: number, g: boolean) => trCore(s, d, g), get lang() { return LANG; } };
