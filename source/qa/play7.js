const p=require('puppeteer-core');const S=ms=>new Promise(r=>setTimeout(r,ms));
const MONTHS=+process.argv[2]||15;
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--allow-file-access-from-files']});
const pg=await b.newPage();await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.goto('https://thorstenscherff-lab.github.io/sambuca-olivenoel/?v=07');await pg.evaluate(()=>localStorage.clear());await pg.reload();await S(400);
const dir='/workspace/sambuca-game/v07/qa/jahr2/';require('fs').mkdirSync(dir,{recursive:true});
let n=0;const shots=[];const shot=async t=>{const f=`${dir}${String(n++).padStart(2,'0')}_${t}.png`;await pg.screenshot({path:f});shots.push(f)};
const issues=new Set();const stats={met:0,calls:0,resc:0,harv:0,press:0,sell:0,care:0,enc:0,perk:0};
const check=async t=>{const r=await pg.evaluate(()=>{const o=[];if(document.documentElement.scrollWidth>innerWidth+1)o.push('hOverflow '+document.documentElement.scrollWidth);if(document.documentElement.scrollHeight>innerHeight+1)o.push('vOverflow '+document.documentElement.scrollHeight);return o});r.forEach(x=>issues.add(t+': '+x))};
const tapSel=async sel=>{const box=await pg.evaluate(sel=>{const e=[...document.querySelectorAll(sel)].find(e=>!e.disabled);if(!e)return null;e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}},sel);if(!box)return false;await S(40);await pg.touchscreen.tap(box.x,box.y);await S(120);return true};
const tapTxt=async(t)=>{const box=await pg.evaluate(t=>{const e=[...document.querySelectorAll('button')].filter(e=>!e.disabled&&e.textContent.includes(t)).pop();if(!e)return null;e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}},t);if(!box)return false;await S(40);await pg.touchscreen.tap(box.x,box.y);await S(120);return true};
const close=async()=>{for(let i=0;i<3;i++){await pg.evaluate(()=>{const b=document.querySelector('button[aria-label="Schließen"]');b&&b.click()});await S(80)}};
const talk=async(tag)=>{if(!await tapTxt('Ansprechen')&&!await tapTxt('Anrufen'))return false;for(let r=0;r<3;r++){await S(300);const ks=await pg.evaluate(()=>[...document.querySelectorAll('[data-topic]')].map(e=>e.dataset.topic));if(!ks.length)break;await tapSel(`[data-topic="${ks[Math.floor(Math.random()*ks.length)]}"]`);if(tag&&r===0)await shot(tag);await S(1500)}await S(300);return await tapTxt('Weiter ▶')};
const rescue=async(tag)=>{await tapTxt('Los!');const t0=Date.now();let k=0;while(Date.now()-t0<9000){const d=await pg.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Weiter ▶')&&!document.querySelector('[data-x]')));if(d)break;const o=await pg.evaluate(()=>{const e=document.querySelector('[data-x]');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});if(o&&Math.random()<0.8)await pg.touchscreen.tap(o.x,o.y);if(tag&&k++===6)await shot(tag);await S(200)}await S(300);await tapTxt('Weiter ▶');stats.resc++};
const st=()=>pg.evaluate(()=>JSON.parse(localStorage.getItem('sambuca5_save')||'null'));
await shot('intro');await pg.type('input','QA-Bot');await tapTxt('Neues Spiel');await S(500);await check('buero');await shot('buero');
const log=[];
for(let m=0;m<MONTHS;m++){
 await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Zum Fest'));});
 const sp=await pg.evaluate(()=>!![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Zum Fest')));
 if(sp){await shot('splash_m'+m);await tapTxt('Zum Fest');await S(300);await shot('fest_m'+m);await check('fest');
   const ps=await pg.evaluate(()=>[...document.querySelectorAll('[data-person]')].map(e=>e.dataset.person));if(ps.length){await tapSel(`[data-person="${ps[0]}"]`);await S(150);if(await tapTxt('Kennenlernen')){if(await talk(m<6?'talk_fest':null))stats.met++}await close()}}
 await close();await tapSel('[data-tab="buero"]');await S(150);
 // events
 await tapSel('[data-hot="pc"]');await S(150);if(m===0||m===5)await shot('auftraege_m'+m);
 for(let i=0;i<8;i++){const ids=await pg.evaluate(()=>{const o={};[...document.querySelectorAll('[data-choice]')].filter(b=>!b.disabled).forEach(b=>{const[k]=b.dataset.choice.split(':');(o[k]=o[k]||[]).push(b.dataset.choice)});return Object.values(o)});if(!ids.length)break;const l=ids[0];const pick=l.find(x=>Math.random()<0.5)||l[0];
   const isMg=await pg.evaluate(c=>{const b=document.querySelector(`[data-choice="${c}"]`);return b.textContent.includes('🎮')},pick);await tapSel(`[data-choice="${pick}"]`);await S(250);if(isMg)await rescue(stats.resc<2?'rescue':null);}
 await close();
 // call
 await tapSel('[data-hot="tel"]');await S(150);if(m===1)await shot('telefon');if(await tapSel('[data-call]')){if(await talk(m===1?'call':null))stats.calls++}await close();
 // bar / chiesa / rathaus meet
 const sc=['caffe','chiesa','muni'][m%3];await tapSel('[data-tab="stadt"]');await S(250);if(m===0){await check('stadtkarte');await shot('stadtkarte')}
 await tapSel(`[data-pin="${sc}"]`);await S(250);if(m<3){await check('scene_'+sc);await shot('scene_'+sc)}
 const ps=await pg.evaluate(()=>[...document.querySelectorAll('[data-person]')].map(e=>e.dataset.person));
 for(const pid of ps){await tapSel(`[data-person="${pid}"]`);await S(150);if(await tapTxt('Kennenlernen')){if(await talk(m===0?'talk':null)){stats.met++;if(m<2)await shot('person_after');}await close();break}
   if(await tapTxt('Plaudern ·')){await talk(null)}
   const pk=await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(b=>!b.disabled&&b.textContent==='Machen · 1 ⏳');return !!b});if(pk){await tapTxt('Machen · 1 ⏳');stats.perk++}await close()}
 if(sc==='caffe'){await tapSel('[data-hot="caffe"]')}
 await close();
 // minor encounter on map
 await tapSel('[data-tab="'+(m%2?'umland':'stadt')+'"]');await S(250);if(m===1){await check('umland');await shot('umlandkarte')}
 const mins=await pg.evaluate(()=>[...document.querySelectorAll('[data-minor]')].map(e=>e.dataset.minor));const mi=mins[m%mins.length];if(mi){await tapSel(`[data-minor="${mi}"]`);await S(200);if(m<3)await shot('minor_'+mi);const ok=await pg.evaluate(()=>[...document.querySelectorAll('button')].find(b=>!b.disabled&&b.textContent.includes('· 1 ⏳')&&b.closest('[style*="border-radius: 20px 20px 0px 0px"]')));if(ok){await pg.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>!b.disabled&&b.textContent.includes('· 1 ⏳')&&b.closest('[style*="border-radius: 20px 20px 0px 0px"]')).click()});stats.enc++}await close()}
 // care / harvest / press
 await tapSel('[data-tab="buero"]');await S(150);await tapSel('[data-hot="regal"]');await S(150);if(m===0)await shot('regal');
 for(let i=0;i<8;i++){const t=await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(b=>!b.disabled&&b.textContent.includes('· 1 ⏳')&&/^(✂️|🌱|💧|🪤|🧺|⚙️|🧹|🪓|🌿|🐑)/u.test(b.textContent));return b&&b.textContent});if(!t)break;await tapTxt(t);await S(200);
   if(t.startsWith('🧺')){await tapTxt('Start!');for(let k=0;k<18;k++){const o=await pg.evaluate(()=>{const e=document.querySelector('button[aria-label="Olive"]');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});if(o)await pg.touchscreen.tap(o.x,o.y);if(k===8&&stats.harv===0)await shot('ernte');await S(380)}await S(2000);await tapTxt('Ernte einfahren');stats.harv++;await tapSel('[data-hot="regal"]');await S(150)}
   else if(t.startsWith('⚙️')){await tapTxt('Presse starten');for(let k=0;k<3;k++){await S(300+Math.random()*500);await tapTxt('STOPP')}await S(300);await tapTxt('Öl abfüllen');stats.press++;await tapSel('[data-hot="regal"]');await S(150)}
   else stats.care++;}
 await close();
 const s=await st();
 if(s&&s.oil>=60){await tapSel('[data-tab="umland"]');await S(250);await tapSel('[data-pin="feudo"]');await S(300);await tapSel('[data-hot="pin:feudo"]');await S(200);if(await tapTxt('Öl verkaufen')){await tapTxt('Feilschen starten');for(let k=0;k<3;k++){await S(200+Math.random()*600);const d=await pg.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Handschlag')));if(d)break;if(!await tapTxt('JETZT FORDERN'))await tapTxt('Nochmal')&&await tapTxt('JETZT FORDERN');if(stats.sell===0&&k===0)await shot('feilschen')}await S(300);await tapTxt('Handschlag');stats.sell++}await close()}
 if(m===2){await tapSel('[data-tab="umland"]');await S(200);await tapSel('[data-pin^="o:"]');await S(200);await shot('angebot');await tapTxt('Pachten');await close()}
 const s2=await st();log.push({m,y:s2.y,mo:s2.m,money:s2.money,oil:s2.oil,rep:s2.rep,ap:s2.ap,met:s2.met.length,groves:s2.groves.length});
 await tapSel('[data-tab="end"]');await S(400);
 const pend=await pg.evaluate(()=>document.querySelector('[data-choice]:not([disabled])')!=null);if(pend){issues.add('pending at end m'+m);for(let i=0;i<6;i++){const c=await pg.evaluate(()=>{const b=document.querySelector('[data-choice]:not([disabled])');return b&&b.dataset.choice});if(!c)break;const mg=await pg.evaluate(c=>document.querySelector(`[data-choice="${c}"]`).textContent.includes('🎮'),c);await tapSel(`[data-choice="${c}"]`);await S(200);if(mg)await rescue()}await close();await tapSel('[data-tab="end"]');await S(400)}
 if(m===0)await shot('bericht');
 if(await pg.evaluate(()=>document.body.innerText.includes('Jahresbilanz'))){await shot('jahresbilanz');await check('jahr');await tapTxt('Weiter ins Jahr')}else await tapTxt('Weiter ▶');
 await S(300);
}
await close();await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Zum Fest'));});
await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Zum Fest'));if(b)b.parentElement.click()});await S(200);
await tapSel('[data-tab="tal"]');await S(200);await shot('tal');await check('tal');
await tapSel('[data-tab="buero"]');await S(200);await shot('buero_end');
const s=await st();const hs=await pg.evaluate(()=>localStorage.getItem('sambuca5_hs'));
console.log(JSON.stringify(log));console.log('stats',JSON.stringify(stats));console.log('final y',s.y,'m',s.m,'money',s.money,'met',s.met,'deals',s.deals,'yhist',s.yhist);console.log('hs',hs);
console.log('errors',errs.length,errs.slice(0,5));console.log('issues',[...issues]);console.log(shots.length,'shots');
await b.close()})();
