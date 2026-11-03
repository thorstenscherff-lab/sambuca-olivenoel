// v0.9.1 (FB-43): Headless-Übersetzungscheck. Zufallsrundgang in EN und IT (Tabs, Pins, Läden, Hotspots,
// Personen, Buttons, Monatsende), normal + "reicher" Spielstand (alle Figuren kennengelernt). Meldet jeden
// sichtbaren Text / title / placeholder, der deutsch aussieht (Umlaute/ß oder typische deutsche Wörter),
// plus __i18n.miss. Eigennamen-Ausnahmen: i18n_allow.json.
// Aufruf: NODE_PATH=…/node_modules node source/qa/i18ncheck.js <URL> [Schritte=300] [out.json]  → Exit 1 bei Funden
// Sicherheit: klickt nie den Highscore-Senden-Button (data-hssend); POSTs an Supabase werden geblockt.
const p=require('puppeteer-core');const fs=require('fs');const S=ms=>new Promise(r=>setTimeout(r,ms));
const URL=process.argv[2]||'http://localhost:8099/',STEPS=+(process.argv[3]||300),OUT=process.argv[4]||'/tmp/i18ncheck.json';
const ALLOW=JSON.parse(fs.readFileSync(require('path').join(__dirname,'i18n_allow.json'),'utf8'));
const GER=/[äöüßÄÖÜ]|\b(der|die|das|und|ist|nicht|mit|für|auf|ein|eine|einen|einem|vom|zum|zur|dem|den|des|noch|schon|dein|deine|deinen|du|kein|keine|Monat|Monate|Jahr|kaufen|verkaufen|wieder|bis|oder|wenn|nur|auch|sich|bei|nach|zu|von|jetzt|mehr|Oliven|braucht|Stück|Ernte|Gespräch)\b/;
const isGerman=t=>{let s=t;for(const a of ALLOW.names)s=s.split(a).join(' ');return GER.test(s)};
const IDS=['nonna','carmela','salvo','wang','rosalia','ciccio','padre','turi','giusi','chiara','klaus','dolores','sindaco','lin','nunzia','gaspare','pippo','lobue','enzo','peppe','nino','marta','ragio'];
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};
for(const L of ['en','it']){
  const found=new Map(),errs=[];const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.dismiss());
  await pg.setRequestInterception(true);pg.on('request',r=>{if(/supabase/.test(r.url())&&r.method()!=='GET')r.abort();else r.continue()});
  const start=async(rich)=>{await pg.goto(URL,{waitUntil:'networkidle0'});await pg.evaluate(()=>localStorage.clear());await pg.reload({waitUntil:'networkidle0'});
    await pg.evaluate(l=>{const e=document.querySelector(`[data-lang="${l}"]`);e&&e.click()},L);await S(300);
    const inp=await pg.$('input');if(inp)await inp.type('QA');
    await pg.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(e=>/New game|Nuova partita|Neues Spiel|Start|Inizia|Los/i.test(e.textContent));e&&e.click()});await S(600);
    if(rich){await pg.evaluate(ids=>{const s=JSON.parse(localStorage.getItem('sambuca5_save'));if(!s)return;Object.assign(s,{money:500000,rep:90,oil:400,olives:2000,q:80});
      s.rel=s.rel||{};s.met=s.met||[];for(const id of ids){if(!s.met.includes(id))s.met.push(id);s.rel[id]=90}
      localStorage.setItem('sambuca5_save',JSON.stringify(s))},IDS);await pg.reload({waitUntil:'networkidle0'});await S(500)}};
  const scan=async(where)=>{const r=await pg.evaluate(()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT);let n;
      while(n=w.nextNode()){if(/STYLE|SCRIPT/.test(n.nodeName))continue;const own=[...n.childNodes].filter(c=>c.nodeType===3).map(c=>c.nodeValue).join('').trim();
        const rc=n.getBoundingClientRect();if(own&&rc.width>0&&rc.height>0)out.push(own);
        for(const a of ['title','placeholder','aria-label']){const v=n.getAttribute(a);if(v)out.push(v)}}
      return {txt:out,miss:window.__i18n?[...window.__i18n.miss]:[]}});
    for(const t of r.txt)if(isGerman(t)&&!found.has(t))found.set(t,where);
    for(const t of r.miss)if(isGerman(t)&&!found.has(t))found.set(t,'miss:'+where)};
  let seed=+(process.env.SEED||7);const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  for(const rich of [false,true]){await start(rich);let last='start';
    for(let i=0;i<STEPS;i++){await scan(last);
      const k=await pg.evaluate(x=>{const els=[...document.querySelectorAll('button,[data-pin],[data-minor],[data-hot],[data-person],[data-tab],[data-topic],[data-choice],[data-call],[data-ap],[data-gear],[data-people]')].filter(e=>{if(e.closest('[data-hssend]')||e.closest('a[href^="http"]')||e.matches('[data-tab="end"]'))return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.disabled&&!/senden|send|invia|eintragen|submit/i.test(e.textContent)});
        if(!els.length)return null;const e=els[Math.floor(x*els.length)];const d=(e.getAttribute('data-pin')||e.getAttribute('data-hot')||e.textContent.trim()).slice(0,30);e.click();return d},rnd());
      last=String(k);await S(110);
      if(i%40===39){await pg.evaluate(()=>{const e=document.querySelector('[data-tab="end"]');e&&e.click()});await S(300);last='Monatsende'}
      if(i%40===20&&await pg.evaluate(()=>!document.querySelector('[data-tab]')))await start(rich);
    }}
  R[L]={count:found.size,errors:[...new Set(errs)].slice(0,10),items:[...found].map(([t,w])=>({t,w}))};await pg.close();
}
fs.writeFileSync(OUT,JSON.stringify(R,null,1));console.log('EN',R.en.count,'IT',R.it.count,'pageerrors',R.en.errors.length+R.it.errors.length);await b.close();process.exit(R.en.count+R.it.count?1:0)})();
