// v0.9.1 (FB-43): Statischer Übersetzungs-Scan. Nimmt alle aus dem Quelltext extrahierten Texte/Muster
// (tools/i18n_extract.js → JSON-Datei), lässt sie im Browser durch __i18n.tr laufen (EN + IT; Platzhalter {n} → 7)
// und meldet alles, was danach noch deutsch aussieht. Eigennamen: i18n_allow.json.
// Aufruf: NODE_PATH=…/node_modules node source/qa/i18nstatic.js <URL> <strings.json> [out.json] → Exit 1 bei Funden
const p=require('puppeteer-core');const fs=require('fs');
const [URL,STR,OUT='/tmp/i18nstatic.json']=process.argv.slice(2);const S=JSON.parse(fs.readFileSync(STR,'utf8'));
const ALLOW=JSON.parse(fs.readFileSync(require('path').join(__dirname,'i18n_allow.json'),'utf8'));
const GER=/[äöüßÄÖÜ]|\b(der|die|das|und|ist|nicht|mit|für|auf|ein|eine|einen|einem|vom|zum|zur|dem|den|des|noch|schon|dein|deine|deinen|du|kein|keine|Monat|Jahr|kaufen|verkaufen|wieder|bis|oder|wenn|nur|auch|sich|bei|nach|zu|von|jetzt|mehr|Oliven|braucht|Ernte)\b/;
const isGerman=t=>{let s=t;for(const a of ALLOW.names)s=s.split(a).join(' ');for(const a of (ALLOW.static||[]))if(s===a)return false;return GER.test(s)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();await pg.goto(URL,{waitUntil:'networkidle0'});
  const items=[...S.lit,...S.pat.map(x=>x.replace(/\{\d+\}/g,'7'))].filter(isGerman);const R={total:items.length};
  for(const L of ['en','it']){await pg.evaluate(l=>{const e=document.querySelector(`[data-lang="${l}"]`);e&&e.click()},L);
    const out=await pg.evaluate(a=>a.map(s=>window.__i18n.tr(s)),items);R[L]=items.filter((s,i)=>isGerman(out[i])).map((s,i)=>s);}
  fs.writeFileSync(OUT,JSON.stringify(R,null,1));console.log('geprüft',R.total,'EN',R.en.length,'IT',R.it.length);await b.close();process.exit(R.en.length+R.it.length?1:0)})();
