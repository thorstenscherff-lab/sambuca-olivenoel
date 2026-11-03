// v0.9.0 QA: Sprache, Speichern/Laden, Pins auf allen Zoomstufen, Karte-Link entfernt. Aufruf: node source/qa/qa9.js <URL> <DIR>
const p=require('puppeteer-core');const S=ms=>new Promise(r=>setTimeout(r,ms));
const URL=process.argv[2],DIR=process.argv[3];require('fs').mkdirSync(DIR,{recursive:true});
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errs.push(r.status()+' '+r.url())});
const shot=t=>pg.screenshot({path:`${DIR}/${t}.png`});
const click=async sel=>{await pg.evaluate(s=>document.querySelector(s).click(),sel);await S(500)};
const btnTxt=t=>pg.evaluate(t=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.includes(t));if(e){e.click();return true}return false},t);
const body=()=>pg.evaluate(()=>document.body.innerText);
const R={};
await pg.goto(URL,{waitUntil:'networkidle0'});await pg.evaluate(()=>localStorage.clear());await pg.reload({waitUntil:'networkidle0'});
R.title=await pg.title();R.picker=await pg.evaluate(()=>document.querySelectorAll('[data-lang]').length);await shot('00_sprachwahl');
for(const L of ['en','it','de']){
  await pg.evaluate(()=>localStorage.clear());await pg.reload({waitUntil:'networkidle0'});
  await click(`[data-lang="${L}"]`);await S(300);const t=await body();R['intro_'+L]=t.slice(0,220).replace(/\n/g,' | ');await shot(`01_intro_${L}`);
  await pg.type('input','QA');await btnTxt(L==='de'?'Neues Spiel':L==='en'?'New game':'Nuova partita');await S(700);
  const sv=await pg.evaluate(()=>JSON.parse(localStorage.getItem('sambuca5_save')||'null'));R['save_lang_'+L]=sv&&sv.lang;
  await shot(`02_buero_${L}`);await click('[data-tab="stadt"]');await S(700);await shot(`03_stadt_${L}`);
  await pg.reload({waitUntil:'networkidle0'});await S(500);R['reload_'+L]={lang:await pg.evaluate(()=>document.documentElement.lang),hasGame:await pg.evaluate(()=>!!document.querySelector('[data-tab]')),picker:await pg.evaluate(()=>document.querySelectorAll('[data-lang]').length)};
  await click('[data-tab="umland"]');await S(500);await click('[data-tab="buero"]');await S(500);
  R['miss_'+L]=await pg.evaluate(()=>window.__i18n.miss.size);
  if(L==='en')R.miss_sample_en=await pg.evaluate(()=>[...window.__i18n.miss].slice(0,40));
}
// Karte-Link: keiner mehr
R.karte_buttons=await pg.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>/^\s*🗺️?\s*Karte\s*$/.test(e.textContent)).length);
// Szene öffnen und über Tab verlassen
await click('[data-tab="stadt"]');await S(500);await click('[data-pin="caffe"]');await S(700);await shot('04_szene_caffe');
R.scene_has_karte=await pg.evaluate(()=>document.body.innerText.includes('Karte'));
await click('[data-tab="stadt"]');await S(600);R.scene_exit_by_tab=await pg.evaluate(()=>!!document.querySelector('[data-map]'));
// Pins: Mittelpunkt des Buttons vs. Ankerpunkt (data-ax/ay × Kartengröße), alle Zoomstufen
R.pins={};
for(const tab of ['stadt','umland']){
  await click(`[data-tab="${tab}"]`);await S(700);
  for(let zi=0;zi<4;zi++){
    if(zi)await click('[data-zoom="in"]');await S(500);
    const m=await pg.evaluate(()=>{const im=document.querySelector('[data-map] img');const ir=im.getBoundingClientRect();const o={minor:[],pin:[],z:(ir.width).toFixed(0)};
      for(const e of document.querySelectorAll('[data-minor],[data-pin]')){if(e.dataset.ax===undefined)continue;const r=e.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const ax=ir.left+(+e.dataset.ax)/100*ir.width,ay=ir.top+(+e.dataset.ay)/100*ir.height;const d=Math.hypot(cx-ax,cy-ay);(e.dataset.minor?o.minor:o.pin).push([e.dataset.minor||e.dataset.pin,+d.toFixed(1)])}
      return o});
    const mx=a=>a.reduce((s,x)=>Math.max(s,x[1]),0);
    R.pins[`${tab}_z${zi}`]={mapW:m.z,minors:m.minor.length,minorMaxDelta:mx(m.minor),pins:m.pin.length,pinMaxDelta:mx(m.pin),pinsMoved:m.pin.filter(x=>x[1]>8).map(x=>x[0]+':'+x[1])};
    // Ausschnitt um einen Laden
    const first=await pg.evaluate(()=>{const e=document.querySelector('[data-minor]');if(!e)return null;e.scrollIntoView({block:'center',inline:'center'});return e.dataset.minor});
    await S(300);await shot(`10_pins_${tab}_z${zi}_${first}`);
  }
}
console.log(JSON.stringify(R,null,1));console.log('errors',JSON.stringify(errs));await b.close()})();
