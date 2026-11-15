// ====================== mijn spullen (beer-icoon naast je geld), aankoopgeschiedenis, vitrine in je huis, volledig scherm, nieuw GTB-menu ======================
sqzHud=function(){}; // de vaste Squeezy-kaart linksboven is vervangen door het beer-icoon
// ---- aankopen bijhouden
const BUYS=(()=>{try{return JSON.parse(lsGet('gtb_buys')||'[]')||[];}catch(e){return [];}})();
function houseAddr(oid){return (WD.baddr&&WD.baddr[String(oid)])||'';}
function buyLog(ic,n,p,x){BUYS.push(Object.assign({ic,n:String(n).slice(0,48),p:Math.round(p*100)/100,ts:Date.now()},x||{}));if(BUYS.length>400)BUYS.splice(0,BUYS.length-400);try{lsSet('gtb_buys',JSON.stringify(BUYS));}catch(e){}}
const spend=(fn,cb)=>function(){const m=P.money,r=fn.apply(this,arguments);const d=m-P.money;if(d>0)cb(d,arguments);return r;};
sqzBuy=spend(sqzBuy,(d,a)=>{const s=SQZ[a[0]];if(s)buyLog('🧸',sqzName(s),d);});
buyBeer=spend(buyBeer,d=>buyLog(SC.room==='dorpshuis'?'☕':'🍺',SC.room==='dorpshuis'?'Koffie met koek':'Biertje',d));
fpvActivate=spend(fpvActivate,(d,a)=>buyLog('🛒',(a[0]&&a[0].l)||'Boodschappen',d));
{const ICO={eat:'🍟',wine:'🍷',cut:'💈',castle:'🏰',outfit:'👕',doc:'🩺',zw:'💊'};const _at=actTry;actTry=function(){const a=ACT.cur,m=P.money;const r=_at.apply(this,arguments);const d=m-P.money;
  if(a&&d>0&&ICO[a.k])buyLog(a.k==='eat'&&a.f?a.f.e:ICO[a.k],a.k==='eat'?(a.s?a.s.n:'Eten'):String(a.t||'').replace(/\s*\(€.*\)$/,'').replace(/^[^A-Za-zÀ-ÿ]+/,''),d);return r;};}
{let hm=null;const mark=fn=>function(){hm=P.money;return fn.apply(this,arguments);};houseBuy=mark(houseBuy);houseTakeover=mark(houseTakeover);
  const _hn=houseName;houseName=function(b){if(hm!=null&&hm>P.money)(()=>{const pr=housePrice(b),paid=hm-P.money,tk=paid>pr*1.05;buyLog('🏠',(tk?'Huis overgekocht':'Huis gekocht')+(houseAddr(b.oid)?': '+houseAddr(b.oid):''),tk?pr+Math.max(10,Math.round(pr*.1)):pr,{oid:String(b.oid)});})();hm=null;_hn(b);};}
// ---- wat je hebt: squeezies + huizen
function bagCount(){return sqzCount()+Object.keys(MYH).length;}
function sqPres(){const o=PRG.sqz||{};return Object.keys(o).filter(k=>o[k]>0).slice(0,24).map(k=>k+':'+o[k]).join(',');}
function sqParse(s){const o={};for(const p of String(s||'').split(',')){const [k,n]=p.split(':');if(k&&+n>0)o[k]=+n;}return o;}
let BAGR=null;
function bagChip(xr,cy,U){const n=bagCount(),t=String(n);ctx.save();ctx.font=`800 ${15*U}px Inter, sans-serif`;const tw=ctx.measureText(t).width,w=tw+34*U,h=24*U,x=xr-w,y=cy-h/2;
  ctx.fillStyle='rgba(247,168,200,.16)';rrect(ctx,x,y,w,h,12*U);ctx.fill();ctx.strokeStyle='rgba(247,168,200,.55)';ctx.lineWidth=1.2;rrect(ctx,x,y,w,h,12*U);ctx.stroke();
  ctx.font=`${14*U}px sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('🧸',x+6*U,cy+1*U);ctx.font=`800 ${14*U}px Inter, sans-serif`;ctx.fillStyle='#f7a8c8';ctx.fillText(t,x+26*U,cy+1*U);ctx.restore();BAGR=[x-4,y-6,w+8,h+12];}
window.addEventListener('pointerdown',e=>{if(MODE!=='play'||!BAGR||SC.on||bigMap)return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(x>BAGR[0]&&x<BAGR[0]+BAGR[2]&&y>BAGR[1]&&y<BAGR[1]+BAGR[3]){e.preventDefault();e.stopImmediatePropagation();bagOpen();}},true);
function bagOpen(tab){let d=document.getElementById('bagOv');if(!d){d=document.createElement('div');d.id='bagOv';document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d&&performance.now()-(d._t||0)>450)bagClose();});}d._t=performance.now();
  tab=tab||'mijn';d._tab=tab;paused=true;const o=PRG.sqz||{},own=SQZ.filter(s=>o[s.k]>0),hs=Object.entries(MYH);
  let body='';if(tab==='mijn'){body+=`<h4>🧸 Squeezies <small>${sqzCount()} stuks</small></h4>`;body+=own.length?'<div class="bgGrid">'+own.map(s=>`<div class="bgIt" data-k="${s.k}"><canvas width="96" height="96"></canvas><span>${esc(sqzName(s))}</span><i>×${o[s.k]}</i></div>`).join('')+'</div>':'<p class="bgE">Nog geen Squeezies. Ze liggen bij Intertoys in de Waterstraat.</p>';
    body+=`<h4>🏠 Huizen <small>${hs.length} / 8</small></h4>`+(hs.length?hs.map(([k,v])=>`<div class="bgRow"><b>🏠 ${esc(String(v).slice(0,10))}</b><span>${esc(houseAddr(k)||'adres onbekend')} · verkoopwaarde €${houseValue(k)}</span><em class="bgSell" data-o="${esc(k)}">VERKOPEN</em></div>`).join(''):'<p class="bgE">Nog geen huis. Loop langs een woonhuis en koop het.</p>');}
  else{body+=BUYS.length?BUYS.slice().reverse().map(b=>{const dt=new Date(b.ts);const own=b.oid&&MYH[b.oid];return `<div class="bgRow"><b>${b.ic} ${esc(b.n)}</b>${own?`<em class="bgSell" data-o="${esc(b.oid)}">VERKOPEN</em>`:''}<span>${b.oid&&!own?'verkocht · ':''}${own?'nog van jou · ':''}${dt.toLocaleDateString('nl-NL',{day:'numeric',month:'short'})} ${dt.toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'})}</span><em${b.p<0?' style="color:#4ade80"':''}>${b.p<0?'+':''}€${String(Math.abs(b.p)).replace('.',',')}</em></div>`;}).join(''):'<p class="bgE">Nog niets gekocht sinds deze update.</p>';}
  d.innerHTML=`<div class="bgBox"><div class="bgTop"><b>🧸 MIJN SPULLEN</b><span class="bgX">✕</span></div><div class="bgTabs"><span data-t="mijn" class="${tab==='mijn'?'on':''}">Wat ik heb</span><span data-t="hist" class="${tab==='hist'?'on':''}">Alles wat ik kocht (${BUYS.length})</span></div><div class="bgBody">${body}</div></div>`;
  d.querySelectorAll('.bgIt').forEach(el=>{const s=SQZ.find(q=>q.k===el.dataset.k);drawSqz(el.querySelector('canvas').getContext('2d'),48,52,30,s);});
  d.querySelectorAll('.bgTabs span').forEach(s=>s.onclick=()=>bagOpen(s.dataset.t));d.querySelectorAll('.bgSell').forEach(el=>el.onclick=()=>{if(!el.dataset.arm){el.dataset.arm=1;el.textContent='ZEKER? +€'+houseValue(el.dataset.o);el.style.background='#c62828';return;}houseSell(el.dataset.o);});d.querySelector('.bgX').onclick=bagClose;d.style.display='flex';}
function bagClose(){const d=document.getElementById('bagOv');if(d)d.style.display='none';paused=false;}
{const st=document.createElement('style');st.textContent=`#bagOv{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(8,4,20,.8);font-family:Inter,sans-serif;color:#fff}
#bagOv .bgBox{width:min(94vw,460px);height:min(84vh,680px);display:flex;flex-direction:column;background:#160926;border:2px solid #f7a8c8;border-radius:18px;box-shadow:0 0 30px rgba(247,168,200,.3);overflow:hidden}
#bagOv .bgTop{display:flex;justify-content:space-between;align-items:center;padding:14px 16px 8px}#bagOv .bgTop b{font:400 24px Anton,Impact,sans-serif;color:#f7a8c8;letter-spacing:1px}#bagOv .bgX{font:800 18px Inter;cursor:pointer;padding:4px 8px}
#bagOv .bgTabs{display:flex;gap:6px;padding:0 12px 8px}#bagOv .bgTabs span{flex:1;text-align:center;padding:8px 0;border-radius:10px;background:rgba(255,255,255,.07);font:800 12px Inter;cursor:pointer}#bagOv .bgTabs span.on{background:#d9467f}
#bagOv .bgBody{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;padding:4px 14px 16px}#bagOv h4{margin:12px 0 8px;font:800 14px Inter;color:#ffd166}#bagOv h4 small{opacity:.6;font-weight:600}
#bagOv .bgGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}#bagOv .bgIt{position:relative;background:rgba(255,255,255,.06);border:1px solid rgba(247,168,200,.35);border-radius:12px;padding:6px;text-align:center}
#bagOv .bgIt canvas{position:static!important;inset:auto!important;width:60px!important;height:60px!important;display:block;margin:0 auto}#bagOv .bgIt span{display:block;font:700 11px Inter;min-height:26px}#bagOv .bgIt i{position:absolute;top:4px;right:7px;font:800 12px Inter;color:#f7a8c8;font-style:normal}
#bagOv .bgRow{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:9px 10px;margin:5px 0;border-radius:10px;background:rgba(255,255,255,.05);font-size:13px}#bagOv .bgRow span{grid-column:1;font-size:11px;opacity:.65}#bagOv .bgRow em{grid-row:1/3;grid-column:2;align-self:center;font-style:normal;font-weight:800;color:#f5c542}
#bagOv .bgE{opacity:.7;font-size:13px}#bagOv .bgRow em.bgSell{grid-row:3;grid-column:1/3;justify-self:start;margin-top:5px;background:#7b2ff7;color:#fff!important;font-size:11px;padding:6px 10px;border-radius:8px;cursor:pointer}`;document.head.appendChild(st);}

// ---- vitrine (glazen kast) in elk gekocht huis met de verzameling van de eigenaar
HROOM_MAP[3]='HG....H..BBB.H';
function vitrineTex(items,owner){return mkTex(128,128,(g,w,h)=>{g.fillStyle='#5a3a24';g.fillRect(0,0,w,h);g.fillStyle='#d9eef5';g.fillRect(8,10,112,108);
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(.5,'rgba(190,225,240,.15)');gr.addColorStop(1,'rgba(255,255,255,.3)');
  g.fillStyle='#ffd166';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText(('VITRINE '+(owner||'')).toUpperCase().slice(0,22),64,8);
  const list=[];for(const k in items)for(let i=0;i<Math.min(items[k],3);i++)list.push(k);const L=list.slice(0,12);
  for(let row=0;row<3;row++){const sy=10+row*36+34;g.fillStyle='rgba(255,255,255,.75)';g.fillRect(8,sy,112,3);for(let c=0;c<4;c++){const k=L[row*4+c];if(!k)continue;const s=SQZ.find(q=>q.k===k);if(s)drawSqz(g,22+c*28,sy-13,11,s);}}
  if(!L.length){g.fillStyle='rgba(60,60,80,.7)';g.font='bold 11px sans-serif';g.fillText('nog leeg',64,66);}
  g.fillStyle=gr;g.fillRect(8,10,112,108);g.strokeStyle='#3a2416';g.lineWidth=3;g.beginPath();g.moveTo(64,10);g.lineTo(64,118);g.stroke();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.moveTo(14,14);g.lineTo(30,14);g.lineTo(14,40);g.fill();});}
{const _hr=houseRoom;houseRoom=function(b){const id=_hr(b),R=ROOMS[id],h=HS[b.oid]||{},mine=h.p===pvpPub();R.map=HROOM_MAP;R.h.G=2.1;R.tex.G=vitrineTex(mine?(PRG.sqz||{}):sqParse(h.sq),mine?netName():h.o);return id;};}
{const _ho=houseObjs;houseObjs=function(oid){return _ho(oid).filter(o=>!(o.s==='plant'&&o.x<2&&o.z<2)).concat([{x:1.5,z:1.6,y:0,h:1.2,w:.6,s:'plant'}]);};}

// ---- volledig scherm bij het starten (zodra je ergens tikt; iPhone-Safari ondersteunt dit niet)
function goFull(){const el=document.documentElement;if(document.fullscreenElement||document.webkitFullscreenElement)return;const f=el.requestFullscreen||el.webkitRequestFullscreen;if(!f)return;try{const p=f.call(el,{navigationUI:'hide'});if(p&&p.catch)p.catch(()=>{});}catch(e){}}
{let auto=SET.full!==false;const h=()=>{if(auto)goFull();};['pointerdown','keydown'].forEach(t=>window.addEventListener(t,h,true));
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&MODE==='play')auto=false;});const _ch=choose;choose=function(){if(SET.full!==false){auto=true;goFull();}return _ch.apply(this,arguments);};}

// ---- nieuw GTB-menu
menuRender=function(){const ov=ovEl('menuOv');const base=lvlBase(PRG.lvl),k=clamp((PRG.xp-base)/need(PRG.lvl),0,1),req=Object.keys(PVP.req||{}).length,onl=(typeof netOthers==='function'?netOthers().length:0);
  const ch=P.ch,img=ch&&ch.img?ch.img:'',full=!!(document.fullscreenElement||document.webkitFullscreenElement);
  ov.innerHTML=`<div class="gm"><div class="gmHead"><div class="gmAv" style="background:${ch?ch.c:'#7b2ff7'}">${img?`<img src="${img}">`:''}<i>${PRG.lvl}</i></div>
   <div class="gmWho"><b>${esc(netName()).toUpperCase()}</b><span>${esc(rankOf(PRG.lvl))}</span><div class="gmBar"><div style="width:${(k*100).toFixed(1)}%"></div></div><small>${PRG.xp-base} / ${need(PRG.lvl)} respect tot level ${PRG.lvl+1}</small></div></div>
   <div class="gmStats"><div><em>€ ${Math.round(P.money).toLocaleString('nl-NL')}</em><span>saldo</span></div><div><em>🧸 ${bagCount()}</em><span>spullen</span></div><div><em>🪙 ${PRG.coins.length}/25</em><span>bommels</span></div><div><em>🏆 ${PRG.ach.length}</em><span>prestaties</span></div></div>
   <div class="gmPlay" data-a="play">▶ VERDER SPELEN</div>
   <div class="gmGrid">
    <div class="gmT" data-a="map" style="--c:#36d1ff"><i>🗺️</i><b>Kaart</b><span>zoom & spawn</span></div>
    <div class="gmT" data-a="lb" style="--c:#c77dff"><i>🏆</i><b>Spelers</b><span>${onl?onl+' online':'ranglijst'}</span></div>
    <div class="gmT" data-a="fr" style="--c:#4ade80"><i>👥</i><b>Vrienden</b><span>${req?req+' verzoek'+(req>1?'en':''):'je maten'}</span>${req?'<u>'+req+'</u>':''}</div>
    <div class="gmT" data-a="bag" style="--c:#f7a8c8"><i>🧸</i><b>Mijn spullen</b><span>${bagCount()} items</span></div>
    <div class="gmT" data-a="cust" style="--c:#ffd166"><i>🎨</i><b>Personage</b><span>uiterlijk</span></div>
    <div class="gmT" data-a="name" style="--c:#ff9f1c"><i>✏️</i><b>Naam</b><span>${esc(netName()).slice(0,12)}</span></div>
    <div class="gmT" data-a="set" style="--c:#9aa0ff"><i>⚙️</i><b>Instellingen</b><span>geluid & zoom</span></div>
    <div class="gmT" data-a="save" style="--c:#22c55e"><i>💾</i><b>Opslaan</b><span>bewaar je spel</span></div>
    <div class="gmT" data-a="full" style="--c:#36d1ff"><i>⛶</i><b>Volledig scherm</b><span>${full?'aan':'uit'}</span></div>
   </div>
   <div class="gmLow"><span data-a="pick">🏠 Keuzescherm</span><span data-a="reset">⟲ Opnieuw beginnen</span></div>
   <p class="gmHint">${IS_TOUCH?'Het spel staat op pauze zolang dit menu open is.':'Tab of O = menu · het spel staat op pauze'}</p></div>`;
  const A={play:menuClose,map:()=>{menuClose();bigMap=true;},lb:()=>{menuClose();lbOpen();},fr:friendsOpen,bag:()=>{menuClose();bagOpen();},cust:()=>custOpen(),
    name:()=>{menuClose();askName(()=>{const s=getSave(),n=lsGet('gtb_name');if(s&&n){s.name=n;lsSet(SAVE_KEY,JSON.stringify(s));}if(n)writeSave(true);noteAdd('NAAM AANGEPAST',n||'','#7dff6a',150);});const i=document.getElementById('nameIn');if(i)i.value=lsGet('gtb_name')||'';},
    set:setOpen,save:()=>{writeSave();menuRender();},full:()=>{if(document.fullscreenElement){SET.full=false;setSave();document.exitFullscreen().catch(()=>{});}else{SET.full=true;setSave();goFull();}setTimeout(menuRender,300);},
    pick:()=>{if(getSave())writeSave(true);progSave();menuClose();restartGame();},reset:menuOpenConfirm};
  ov.querySelectorAll('[data-a]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(performance.now()-MENU_T<350)return;sfx('blip');A[el.dataset.a]();}));};
{const st=document.createElement('style');st.textContent=`#menuOv .gm{width:min(96vw,520px);padding:4px 2px}
#menuOv .gmHead{display:flex;gap:14px;align-items:center;padding:14px;border-radius:18px;background:linear-gradient(135deg,rgba(123,47,247,.35),rgba(255,46,136,.18));border:1px solid rgba(199,125,255,.6);box-shadow:0 0 24px rgba(123,47,247,.25)}
#menuOv .gmAv{position:relative;flex:none;width:70px;height:70px;border-radius:50%;overflow:visible;box-shadow:0 0 0 3px #c77dff,0 0 18px rgba(199,125,255,.7)}#menuOv .gmAv img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 18%}
#menuOv .gmAv i{position:absolute;right:-4px;bottom:-4px;width:26px;height:26px;border-radius:50%;background:#16182a;border:2px solid #c77dff;font:800 12px Inter;display:flex;align-items:center;justify-content:center;font-style:normal}
#menuOv .gmWho{flex:1;min-width:0}#menuOv .gmWho b{display:block;font:400 26px Anton,Impact,sans-serif;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#menuOv .gmWho span{font:800 12px Inter;color:#c77dff;text-transform:uppercase;letter-spacing:1px}
#menuOv .gmBar{height:9px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden;margin:8px 0 4px}#menuOv .gmBar div{height:100%;background:linear-gradient(90deg,#7b2ff7,#ff2e88);box-shadow:0 0 10px #ff2e88}#menuOv .gmWho small{font-size:11px;opacity:.7}
#menuOv .gmStats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0}#menuOv .gmStats div{padding:8px 4px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center}#menuOv .gmStats em{display:block;font:800 14px Inter;font-style:normal;color:#f5c542;white-space:nowrap}#menuOv .gmStats span{font-size:10px;opacity:.6;text-transform:uppercase;letter-spacing:.5px}
#menuOv .gmPlay{margin:6px 0 12px;padding:16px;border-radius:16px;text-align:center;font:400 24px Anton,Impact,sans-serif;letter-spacing:2px;cursor:pointer;background:linear-gradient(90deg,#ff2e88,#7b2ff7);box-shadow:0 0 22px rgba(255,46,136,.55),inset 0 0 0 2px rgba(255,255,255,.25)}
#menuOv .gmGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}#menuOv .gmT{position:relative;padding:12px 6px 10px;border-radius:14px;text-align:center;cursor:pointer;background:rgba(20,10,36,.85);border:1.5px solid var(--c);box-shadow:0 0 12px color-mix(in srgb,var(--c) 35%,transparent),inset 0 0 18px color-mix(in srgb,var(--c) 12%,transparent);transition:transform .1s}
#menuOv .gmT:active,#menuOv .gmPlay:active{transform:scale(.95)}#menuOv .gmT i{display:block;font-size:26px;font-style:normal;filter:drop-shadow(0 0 6px var(--c))}#menuOv .gmT b{display:block;font:800 13px Inter;margin-top:4px}#menuOv .gmT span{display:block;font-size:10.5px;opacity:.65;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#menuOv .gmT u{position:absolute;top:6px;right:8px;min-width:18px;height:18px;border-radius:9px;background:#ff2e88;font:800 11px Inter;text-decoration:none;display:flex;align-items:center;justify-content:center}
#menuOv .gmLow{display:flex;gap:8px;margin-top:12px}#menuOv .gmLow span{flex:1;padding:10px;border-radius:12px;text-align:center;font:800 12px Inter;cursor:pointer;background:rgba(120,30,40,.35);border:1px solid rgba(255,90,110,.45)}
#menuOv .gmHint{font-size:11px;opacity:.55;text-align:center;margin-top:12px}`;document.head.appendChild(st);}
