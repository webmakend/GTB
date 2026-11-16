// ====================== online opslaan: je voortgang staat ook op de server, terug te halen met je herstelcode ======================
// Alleen op de eigen website (api.php). Elke minuut (en als je de app wegzet) gaat je spel mee; op een ander apparaat
// vul je je code in en speel je verder met hetzelfde geld, dezelfde huizen, vrienden, Squeezies en hetzelfde level.
const CLOUD_KEYS=['gtb_save_v1','gtb_prog_v1','gtb_myhouses','gtb_friends','gtb_dm','gtb_dmafter','gtb_seen','gtb_pub','gtb_pid','gtb_custom','gtb_name','gtb_set','gtb_buys','gtb_tags','gtb_chest','gtb_treas','gtb_cine'];
const CLOUD={busy:false,last:'',t:0,ok:0,err:0};
function cloudCode(){return lsGet('gtb_cloud')||'';}
function cloudFmt(c){return c?c.slice(0,4)+'-'+c.slice(4):'';}
function cloudData(){try{if(MODE==='play'){progSave();if(getSave())writeSave(true);}}catch(e){}const d={};for(const k of CLOUD_KEYS){const v=lsGet(k);if(v!=null)d[k]=v;}return d;}
function cloudUp(force,beacon){if(!NET.http||CLOUD.busy)return;if(!getSave()&&!cloudCode())return;const data=cloudData(),js=JSON.stringify(data);if(!force&&js===CLOUD.last)return;
  const body=JSON.stringify({code:cloudCode(),data});if(beacon&&navigator.sendBeacon&&cloudCode()){navigator.sendBeacon('api.php?a=csave',new Blob([body],{type:'application/json'}));CLOUD.last=js;return;}
  CLOUD.busy=true;fetch('api.php?a=csave',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:body.length<60000}).then(r=>r.json()).then(j=>{CLOUD.busy=false;if(!j||!j.ok){CLOUD.err++;return;}
    const fresh=!cloudCode();lsSet('gtb_cloud',j.code);CLOUD.last=js;CLOUD.ok=Date.now();
    if(fresh)noteAdd('JE SPEL STAAT ONLINE','Je herstelcode is '+cloudFmt(j.code)+'. Bewaar hem goed: daarmee speel je verder op een ander apparaat (staat ook in het menu).','#36d1ff',600,'cloud');}).catch(()=>{CLOUD.busy=false;CLOUD.err++;});}
setInterval(()=>{if(MODE==='play')cloudUp(false);},60000);
setTimeout(()=>{if(MODE==='play')cloudUp(false);},20000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')cloudUp(false,true);});
function cloudRestore(code,cb){code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==8){cb('Een code heeft 8 tekens, bijvoorbeeld K7PQ-4MZA');return;}
  fetch('api.php?a=cload&code='+code,{cache:'no-store'}).then(r=>r.json()).then(j=>{if(!j||!j.ok||!j.data){cb('Deze code bestaat niet. Controleer hem nog even.');return;}
    for(const k of CLOUD_KEYS)try{localStorage.removeItem(k);}catch(e){}for(const k in j.data)if(CLOUD_KEYS.includes(k))lsSet(k,j.data[k]);lsSet('gtb_cloud',code);cb(null,j);}).catch(()=>cb('Geen verbinding met de server'));}
// scherm: je code bekijken, nu opslaan, of een code invullen
function cloudOpen(fromPick){let d=document.getElementById('cloudOv');if(!d){d=document.createElement('div');d.id='cloudOv';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());}
  const code=cloudCode(),wasPaused=paused;if(!fromPick)paused=true;const ago=CLOUD.ok?Math.round((Date.now()-CLOUD.ok)/60000):null;
  d.innerHTML=`<div class="clBox"><div class="clTop"><b>☁️ ONLINE OPSLAG</b><span class="clX">✕</span></div>${!NET.http?'<p class="clE">Online opslaan werkt alleen op de website zelf (gtb.devdock.nl). In deze versie blijft je voortgang op dit apparaat.</p>':`
   ${code?`<p>Je herstelcode:</p><div class="clCode">${cloudFmt(code)}</div><p class="clS">${ago==null?'Nog niet opgeslagen in deze sessie':ago<1?'Net opgeslagen ✓':'Opgeslagen '+ago+' min geleden ✓'} · gaat elke minuut vanzelf</p>
   <div class="clBtns"><span class="clSave">💾 Nu opslaan</span><span class="clCopy">📋 Kopieer code</span></div>`:(fromPick?'':`<p>Je spel heeft nog geen herstelcode.</p><div class="clBtns"><span class="clSave">💾 Opslaan en code maken</span></div>`)}
   <h4>Al eerder gespeeld op een ander apparaat?</h4><p class="clS">Vul je code in. Let op: wat op dít apparaat staat wordt dan vervangen.</p>
   <div class="clIn"><input maxlength="9" placeholder="XXXX-XXXX" autocapitalize="characters" autocomplete="off"><span class="clGo">HERSTEL</span></div><p class="clMsg"></p>`}</div>`;
  const close=()=>{d.style.display='none';if(!fromPick)paused=false;};d.querySelector('.clX').onclick=close;
  const sv=d.querySelector('.clSave');if(sv)sv.onclick=()=>{cloudUp(true);sv.textContent='Bezig…';setTimeout(()=>cloudOpen(fromPick),1200);};
  const cp=d.querySelector('.clCopy');if(cp)cp.onclick=()=>{try{navigator.clipboard.writeText(cloudFmt(code));cp.textContent='✓ Gekopieerd';}catch(e){}};
  const go=d.querySelector('.clGo'),inp=d.querySelector('.clIn input'),msg=d.querySelector('.clMsg');if(inp){inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')go.click();};inp.oninput=()=>{let v=inp.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);inp.value=v.length>4?v.slice(0,4)+'-'+v.slice(4):v;};}
  if(go)go.onclick=()=>{msg.textContent='Bezig met ophalen…';msg.style.color='#d9cff5';cloudRestore(inp.value,(err,j)=>{if(err){msg.textContent=err;msg.style.color='#ff6b6b';return;}
    msg.textContent='Gelukt! Je spel wordt geladen…';msg.style.color='#7dff6a';setTimeout(()=>location.reload(),900);});};
  d.style.display='flex';}
{const st=document.createElement('style');st.textContent=`#cloudOv{position:fixed;inset:0;z-index:95;display:none;align-items:center;justify-content:center;background:rgba(8,4,20,.82);font-family:Inter,sans-serif;color:#fff}
#cloudOv .clBox{width:min(92vw,420px);max-height:90vh;overflow:auto;padding:16px 18px 20px;border-radius:20px;background:#160926;border:2px solid #36d1ff;box-shadow:0 0 30px rgba(54,209,255,.3)}
#cloudOv .clTop{display:flex;justify-content:space-between;align-items:center}#cloudOv .clTop b{font:400 24px Anton,Impact,sans-serif;letter-spacing:1px;color:#36d1ff}#cloudOv .clX{font:800 18px Inter;cursor:pointer;padding:4px 8px}
#cloudOv p{font-size:14px;margin:10px 0 6px;opacity:.9}#cloudOv .clS{font-size:12px;opacity:.65;margin-top:4px}#cloudOv .clE{opacity:.8}
#cloudOv .clCode{font:400 40px Anton,Impact,sans-serif;letter-spacing:6px;text-align:center;padding:12px;border-radius:14px;background:rgba(54,209,255,.1);border:1.5px dashed #36d1ff;color:#fff;user-select:all}
#cloudOv .clBtns{display:flex;gap:8px;margin-top:10px}#cloudOv .clBtns span,#cloudOv .clGo{flex:1;text-align:center;padding:12px;border-radius:12px;background:#7b2ff7;font-weight:900;cursor:pointer}#cloudOv .clCopy{background:#2a1a40!important;border:1px solid #7b2ff7}
#cloudOv h4{margin:20px 0 0;font:800 14px Inter;color:#ffd166}#cloudOv .clIn{display:flex;gap:8px;margin-top:8px}#cloudOv .clIn input{flex:2;min-width:0;font:800 20px Inter;letter-spacing:3px;text-transform:uppercase;padding:10px 12px;border-radius:12px;border:0;background:#2a1a40;color:#fff}
#cloudOv .clGo{flex:1;background:linear-gradient(90deg,#22c55e,#16a34a)}#cloudOv .clMsg{min-height:18px;font-weight:700}
#pickCloud{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--sb) + 10px);z-index:5;padding:9px 16px;border-radius:20px;background:rgba(26,10,44,.85);border:1.5px solid #36d1ff;color:#fff;font:800 12px Inter,sans-serif;cursor:pointer;white-space:nowrap}`;document.head.appendChild(st);}
// knop op het kiesscherm (op de eigen site)
{const _sp=showPick;showPick=function(){_sp.apply(this,arguments);const pk=document.getElementById('pick');if(!pk||document.getElementById('pickCloud'))return;const b=document.createElement('div');b.id='pickCloud';b.textContent='☁️ Al eerder gespeeld? Herstel met je code';
  b.addEventListener('click',e=>{e.stopPropagation();cloudOpen(true);});pk.appendChild(b);const chk=()=>{b.style.display=NET.http?'block':'none';};chk();setTimeout(chk,1500);};}
// in het menu: de tegel "Opslaan" wordt "Online opslag"
{const _mr=menuRender;menuRender=function(){_mr();const ov=document.getElementById('menuOv'),t=ov&&ov.querySelector('.gmT[data-a="save"]');if(!t)return;const c=cloudCode();
  t.innerHTML=`<i>☁️</i><b>Opslaan</b><span>${NET.http?(c?'code '+cloudFmt(c):'online bewaren'):'op dit apparaat'}</span>`;const n=t.cloneNode(true);t.replaceWith(n);
  n.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();sfx('blip');writeSave();if(NET.http){cloudUp(true);menuClose();cloudOpen(false);}else menuRender();});};}
