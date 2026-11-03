const p=require('puppeteer-core');const S=ms=>new Promise(r=>setTimeout(r,ms));
const URL=process.argv[2],DIR=process.argv[3];require('fs').mkdirSync(DIR,{recursive:true});
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errs.push(r.status()+' '+r.url())});
let n=0;const shot=async t=>pg.screenshot({path:`${DIR}/${String(n++).padStart(2,'0')}_${t}.png`});
const tap=async sel=>{const r=await pg.evaluate(sel=>{const e=[...document.querySelectorAll(sel)].find(e=>!e.disabled);if(!e)return null;e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]},sel);if(!r){errs.push('missing '+sel);return false}await pg.touchscreen.tap(...r);await S(400);return true};
const txt=async t=>{const r=await pg.evaluate(t=>{const e=[...document.querySelectorAll('button')].filter(e=>!e.disabled&&e.textContent.includes(t)).pop();if(!e)return null;const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]},t);if(!r)return false;await pg.touchscreen.tap(...r);await S(300);return true};
const close=async()=>{for(let i=0;i<3;i++){await pg.evaluate(()=>{const b=document.querySelector('button[aria-label="Schließen"]');b&&b.click()});await S(100)}};
const info=()=>pg.evaluate(()=>({h:[...document.querySelectorAll('[data-hot]')].map(e=>e.dataset.hot).join(','),t:(document.querySelector('.gta')||{}).textContent,ov:document.documentElement.scrollWidth>innerWidth+1}));
await pg.goto(URL,{waitUntil:'networkidle0'});await pg.evaluate(()=>localStorage.clear());await pg.reload({waitUntil:'networkidle0'});
const title=await pg.title();await shot('intro');await pg.type('input','QA');await txt('Neues Spiel');await S(600);await shot('buero_stufe1');
const rep={};
await tap('[data-tab="stadt"]');await S(500);await shot('stadtkarte');
const mapinfo=await pg.evaluate(()=>{const el=[...document.querySelectorAll('div')].find(d=>(d.style.backgroundImage||'').includes('data:image/webp'));return el?[el.offsetWidth,el.offsetHeight]:null});rep.map=mapinfo;
await tap('[data-pin="caffe"]');await S(200);await tap('[data-pin="caffe"]');await S(500);
for(const pin of ['caffe','banca','muni','palazzo','chiesa','belv']){await tap('[data-tab="stadt"]');await S(300);if(!await tap(`[data-pin="${pin}"]`))continue;await S(600);rep[pin]=await info();await shot('szene_'+pin);
  const h=await pg.evaluate(()=>{const e=document.querySelector('[data-hot]');return e&&e.dataset.hot});if(h&&pin!=='caffe'){await tap(`[data-hot="${h}"]`);await S(400);await shot('hot_'+pin);await close()}}
await tap('[data-tab="stadt"]');await S(300);
await pg.evaluate(()=>{const el=[...document.querySelectorAll('div')].find(d=>d.scrollWidth>d.clientWidth+5);if(el){const b=document.querySelector('[data-pin="caffe"]').getBoundingClientRect();el.scrollLeft+=b.left-150}});await S(300);await shot('stadtkarte_bar_del_corso');
for(const pin of ['torre','frantoio','hain','feudo','lago']){await tap('[data-tab="umland"]');await S(300);if(pin==='torre')await shot('umlandkarte');if(!await tap(`[data-pin="${pin}"]`))continue;await S(600);rep[pin]=await info();await shot('szene_'+pin);
  const h=await pg.evaluate(()=>{const e=document.querySelector('[data-hot]');return e&&e.dataset.hot});if(h){await tap(`[data-hot="${h}"]`);await S(400);await shot('hot_'+pin);await close()}}
for(const [st,mo,rp] of [[2,20000,10],[3,70000,10],[4,250000,10]]){await pg.evaluate(([mo,rp])=>{const s=JSON.parse(localStorage.getItem('sambuca5_save'));s.money=mo;s.rep=rp;localStorage.setItem('sambuca5_save',JSON.stringify(s))},[mo,rp]);await pg.reload({waitUntil:'networkidle0'});await S(500);await txt('Weiter');await txt('Fortsetzen');await S(400);await tap('[data-tab="buero"]');await S(500);rep['buero'+st]=await info();await shot('buero_stufe'+st);
  for(const h of ['pc','regal','kal']){if(await tap(`[data-hot="${h}"]`)){await S(300);await close()}}}
await tap('[data-hot="fenster"]');await S(300);rep.fensterOK=await pg.evaluate(()=>!!document.querySelector('[data-pin="caffe"]'));
console.log('title',title);console.log(JSON.stringify(rep,null,0));console.log('errors',JSON.stringify(errs));await b.close()})();
