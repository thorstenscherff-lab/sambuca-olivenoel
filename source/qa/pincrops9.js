const p=require('puppeteer-core');const S=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();await pg.setViewport({width:390,height:844,deviceScaleFactor:1});
const click=async s=>{await pg.evaluate(s=>document.querySelector(s).click(),s);await S(500)};
await pg.goto('http://localhost:8099/',{waitUntil:'networkidle0'});await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('sambuca5_lang','de')});await pg.reload({waitUntil:'networkidle0'});
await pg.type('input','QA');await pg.evaluate(()=>[...document.querySelectorAll('button')].find(e=>e.textContent.includes('Neues Spiel')).click());await S(600);
const out=[];
for(const tab of ['stadt','umland']){await click(`[data-tab="${tab}"]`);for(let i=0;i<3;i++)await click('[data-zoom="in"]');
 const ids=await pg.evaluate(()=>[...document.querySelectorAll('[data-minor]')].map(e=>e.dataset.minor));
 for(const id of ids){const info=await pg.evaluate(id=>{const e=document.querySelector(`[data-minor="${id}"]`);e.style.opacity='0.35';const el=document.querySelector('[data-map]');const r=e.getBoundingClientRect(),c=el.getBoundingClientRect();el.scrollLeft+=r.left+r.width/2-(c.left+c.width/2);el.scrollTop+=r.top+r.height/2-(c.top+c.height/2);const im=el.querySelector('img').getBoundingClientRect();const r2=e.getBoundingClientRect();return {id,ax:e.dataset.ax,ay:e.dataset.ay,cx:r2.left+r2.width/2,cy:r2.top+r2.height/2,W:im.width,H:im.height}},id);
  await S(300);await pg.screenshot({path:`/tmp/crop_${tab}_${id}.png`,clip:{x:info.cx-150,y:info.cy-150,width:300,height:300}});out.push({tab,...info})}}
console.log(JSON.stringify(out));await b.close()})();
