// v0.9.0 (FB-37): extrahiert übersetzbare deutsche UI-Texte aus source/harness/game.tsx (TypeScript-AST)
// Aufruf: node source/tools/i18n_extract.js > /tmp/strings.json
const ts = require(process.env.TS5 || 'typescript') // TypeScript-5-JS-API (harness nutzt tsc 7 ohne JS-API): TS5=/tmp/ts5/node_modules/typescript;
const fs = require('fs'); const src = fs.readFileSync(require('path').join(__dirname, '../harness/game.tsx'), 'utf8');
const sf = ts.createSourceFile('g.tsx', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const lit = new Set(), pat = new Set();
const GERW = /[äöüßÄÖÜ]|\b(der|die|das|und|ist|nicht|mit|für|auf|ein|eine|zu|zum|zur|vom|bis|ab|kein|Bäume|Zustand|Treffer|Sekunden|verkaufen|Oliven|Flaschen|Jahr|Monat)\b/;
const isText = (s) => { const t = s.trim(); if (t.length < 2) return false; if (!/[A-Za-zÄÖÜäöüß]/.test(t)) return false;
  if (/^(data:|https?:|#|rgba?\(|linear-|radial-|url\()/.test(t)) return false; if (/^[a-z0-9_:\-.]+$/.test(t)) return false;
  if (/^[\d.\s%a-z()-]+$/.test(t) && !/\s[a-zäöü]{3,}/.test(t) && !GERW.test(t)) return false; if (/^[A-Za-z0-9+/=]{40,}$/.test(t)) return false;
  if (/(px|em|deg|ms|s)\b.*;|^\d+(px|%)/.test(t) && !GERW.test(t)) return false; if (/:\s*\d/.test(t) && !GERW.test(t) && !/\s[A-ZÄÖÜa-zäöü]{4,}\s/.test(t)) return false; return true; };
function visit(n) {
  if (ts.isImportDeclaration(n)) return;
  // v0.9.1 (FB-43): JSX mit eingebetteten Ausdrücken ("Was {x} für dich tun kann") → Muster wie zur Laufzeit gruppiert
  if (ts.isJsxElement(n) && n.children.length > 1 && n.children.every((c) => ts.isJsxText(c) || ts.isJsxExpression(c))) {
    let s = '', i = 0; for (const c of n.children) { if (ts.isJsxText(c)) s += c.text.replace(/\s*\n\s*/g, '').replace(/\s+/g, ' '); else if (c.expression) s += '{' + (i++) + '}'; }
    if (i > 0 && isText(s.replace(/\{\d+\}/g, ''))) pat.add(s.trim()); }
  if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n))) { const p = n.parent;
    if (p && (ts.isPropertyAssignment(p) && p.name === n)) {} else if (p && ts.isElementAccessExpression(p)) {} else if (p && ts.isJsxAttribute(p) && !['aria-label','placeholder','title','alt','label','who'].includes(p.name.getText())) {} else if (isText(n.text)) lit.add(n.text.trim()); }
  else if (ts.isTemplateExpression(n)) { let s = n.head.text; n.templateSpans.forEach((sp, i) => { s += '{' + i + '}' + sp.literal.text; }); if (isText(s.replace(/\{\d+\}/g, ''))) pat.add(s.trim()); }
  else if (ts.isJsxText(n)) { const t = n.text.replace(/\s+/g, ' ').trim(); if (isText(t)) lit.add(t); }
  ts.forEachChild(n, visit);
}
visit(sf);
console.log(JSON.stringify({ lit: [...lit], pat: [...pat] }, null, 0));
