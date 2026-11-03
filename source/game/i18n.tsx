// ===== v0.9.0 (FB-37/OI-047): Sprachwahl DE/EN/IT – siehe docs/I18N.md =====
// Prinzip: Quelltext bleibt Deutsch (Master). Ein DOM-Übersetzer (MutationObserver) ersetzt
// Textknoten und Attribute (placeholder/title/aria-label) über das Wörterbuch I18N_DICT
// (game/i18n_dict.tsx, erzeugt von source/tools/i18n_build.py) + Muster mit Platzhaltern {0}.
type Lang = "de" | "en" | "it";
const LANGS: { id: Lang; flag: string; n: string }[] = [{ id: "de", flag: "🇩🇪", n: "Deutsch" }, { id: "en", flag: "🇬🇧", n: "English" }, { id: "it", flag: "🇮🇹", n: "Italiano" }];
const LANG_KEY = "sambuca5_lang";
let LANG: Lang = "de";
const I18N_MISS = new Set<string>();
type Pat = { re: RegExp; idx: number[]; en: string; it: string };
let I18N_PATS: Pat[] | null = null;
const i18nPats = (): Pat[] => {
  if (I18N_PATS) return I18N_PATS;
  const out: Pat[] = [];
  for (const k of Object.keys(I18N_DICT)) {
    if (k.indexOf("{0}") < 0) continue;
    const idx: number[] = [];
    const src = k.split(/(\{\d\})/).map((p) => { const m = /^\{(\d)\}$/.exec(p); if (m) { idx.push(+m[1]); return "([\\s\\S]*?)"; } return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("");
    out.push({ re: new RegExp("^" + src + "$"), idx, en: I18N_DICT[k][0], it: I18N_DICT[k][1] });
  }
  out.sort((a, b) => b.re.source.length - a.re.source.length); I18N_PATS = out; return out;
};
const trCore = (s: string, depth: number): string | null => {
  const d = I18N_DICT[s]; if (d) return LANG === "en" ? d[0] : d[1];
  if (depth > 2) return null;
  for (const p of i18nPats()) {
    const m = p.re.exec(s); if (!m) continue;
    const vals: Record<number, string> = {}; p.idx.forEach((n, i) => { const v = m[i + 1]; vals[n] = trCore(v, depth + 1) ?? v; });
    return (LANG === "en" ? p.en : p.it).replace(/\{(\d)\}/g, (_, n: string) => vals[+n] ?? "");
  }
  return null;
};
const tr = (s: string): string => {
  if (LANG === "de") return s;
  const t = s.trim(); if (!t || !/[A-Za-zÄÖÜäöüß]{2}/.test(t)) return s;
  const r = trCore(t, 0);
  if (r === null) { I18N_MISS.add(t); return s; }
  return s.replace(t, r);
};
const ORIG = new WeakMap<Node, string>(); const ORIG_A = new WeakMap<Element, Record<string, string>>();
const ATTRS = ["placeholder", "title", "aria-label"];
let i18nBusy = false;
const trNode = (n: Node): void => {
  if (n.nodeType === 3) {
    const p = n.parentNode as Element | null; if (p && (p.nodeName === "STYLE" || p.nodeName === "SCRIPT")) return;
    const cur = n.nodeValue || ""; const o = ORIG.get(n);
    // Neuer Text (React hat ihn ersetzt) → Original neu merken
    const orig = o !== undefined && (o === cur || tr(o) === cur) ? o : cur; ORIG.set(n, orig);
    const v = tr(orig); if (v !== cur) n.nodeValue = v; return;
  }
  if (n.nodeType !== 1) return; const el = n as Element; if (el.nodeName === "STYLE" || el.nodeName === "SCRIPT") return;
  for (const a of ATTRS) { const cur = el.getAttribute(a); if (cur === null) continue; const rec = ORIG_A.get(el) || {}; const o = rec[a]; const orig = o !== undefined && (o === cur || tr(o) === cur) ? o : cur; rec[a] = orig; ORIG_A.set(el, rec); const v = tr(orig); if (v !== cur) el.setAttribute(a, v); }
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
if (typeof window !== "undefined") (window as unknown as { __i18n: unknown }).__i18n = { miss: I18N_MISS, tr, get lang() { return LANG; } };
