// ====================== WNC-gebied (kunstgras, geen bomen op de velden, geparkeerde auto's), max 8 huizen + verkopen, huizen op de grote kaart, winkelmandje met afrekenen ======================
// ---- WNC en tennis
function wncWorld(){if(!WB)return;const pitches=(WD.pitch||[]).map(pc=>{const p=pc.p;if(!p.bb)p.bb=bbox(p);return pc;});
  const so=pitches.filter(p=>p.s==='soccer');let best=null,bd=1e9;for(const pc of so){const c=centroid(pc.p.slice(0,-1)),d=Math.hypot(c[0]-5505,c[1]-1312);if(d<bd){bd=d;best=pc;}}if(best&&bd<200)best.turf=1;
  const near=(x,y,m)=>pitches.some(pc=>x>pc.p.bb[0]-m&&x<pc.p.bb[2]+m&&y>pc.p.bb[1]-m&&y<pc.p.bb[3]+m&&(pip(x,y,pc.p)||ptPolyD(x,y,pc.p)<m));
  for(let i=TREES.length-1;i>=0;i--){const t=TREES[i];if(near(t.x,t.y,26))TREES.splice(i,1);}
  if(typeof APPLE!=='undefined'){for(let i=APPLE.length-1;i>=0;i--){const t=APPLE[i];if(near(t.x,t.y,30)||cellAt(t.x,t.y)===PLAZA){t.gone=1;APPLE.splice(i,1);}}if(typeof ORCH!=='undefined')for(const o of ORCH)if(o.rows)o.rows=o.rows.map(r=>r.filter(t=>!t.gone)).filter(r=>r.length>3);}
  try{chunkCache.clear();}catch(e){}}
function wncCars(){if(!WB)return;let sd=4242;const rn=()=>((sd=(sd*16807)%2147483647)/2147483647);const types=['sedan','hatch'].filter(t=>CT[t]),pitches=WD.pitch||[];
  const put=(x,y,a)=>{if(cellAt(x,y)===BUILD||cellAt(x,y)===WATER)return;if(pitches.some(pc=>pip(x,y,pc.p)))return;if(cars.some(c=>Math.hypot(c.x-x,c.y-y)<30))return;const c=makeCar(types[(rn()*types.length)|0],x,y,a,null);c.keep=1;c.wncPark=1;cars.push(c);};
  const lot=(cx,cy,a,w,h,n)=>{const ca=Math.cos(a),sa=Math.sin(a);let k=0;for(let v=-h+26;v<=h-20&&k<n;v+=h*2-50)for(let u=-w+16;u<=w-16&&k<n;u+=26){if(rn()<.25)continue;put(cx+u*ca-v*sa,cy+u*sa+v*ca,a+Math.PI/2+(v<0?0:Math.PI));k++;}};
  if(WD._wncPark){const [cx,cy,a,w,h]=WD._wncPark;lot(cx,cy,a,w,h,9);}
  for(const pk of WD.parking){const b=bbox(pk);if(b[0]<6600||b[0]>7300||b[1]>2000||b[1]<1300)continue;let best=0,ang=0;for(let i=0;i<pk.length-1;i++){const l=Math.hypot(pk[i+1][0]-pk[i][0],pk[i+1][1]-pk[i][1]);if(l>best){best=l;ang=Math.atan2(pk[i+1][1]-pk[i][1],pk[i+1][0]-pk[i][0]);}}
    let n=0;for(let t=0;t<400&&n<8;t++){const x=b[0]+rn()*(b[2]-b[0]),y=b[1]+rn()*(b[3]-b[1]);if(!pip(x,y,pk)||cellAt(x,y)===ROAD)continue;const before=cars.length;put(x,y,ang+Math.PI/2);if(cars.length>before)n++;}}}
{const _bo=buildOrchards;buildOrchards=function(){_bo();try{wncWorld();}catch(e){console.warn(e);}};}
{const _po=populate;populate=function(){_po();if(!cars.some(c=>c.wncPark))try{wncCars();}catch(e){console.warn(e);}};}

// ---- huizen: maximaal 8, en verkopen voor de standaardwaarde
const HOUSE_MAX=8;function houseValue(oid){const b=BUILDINGS.find(q=>String(q.oid)===String(oid));return b?housePrice(b):100;}
{const lim=fn=>function(){if(Object.keys(MYH).length>=HOUSE_MAX){noteAdd('MAXIMAAL 8 HUIZEN','Verkoop eerst een huis via 🧸 Mijn spullen (tik op het beertje naast je geld)','#ff9f1c',260,'huismax');return;}return fn.apply(this,arguments);};houseBuy=lim(houseBuy);houseTakeover=lim(houseTakeover);}
function houseSell(oid){oid=String(oid);if(!MYH[oid])return;const v=houseValue(oid),nm=MYH[oid];
  const done=()=>{delete MYH[oid];delete HS[oid];lsSet('gtb_myhouses',JSON.stringify(MYH));addMoney(v);sfx('kassa');buyLog('💰','Huis "'+String(nm).slice(0,10)+'" verkocht',-v);noteAdd('HUIS VERKOCHT','"'+String(nm).slice(0,10)+'" is verkocht voor €'+v+'. Iedereen kan het nu weer kopen.','#7dff6a',220);
    const R=ROOMS['h'+oid];if(R&&SC.on&&SC.room==='h'+oid)scExit();if(document.getElementById('bagOv')&&document.getElementById('bagOv').style.display==='flex')bagOpen('mijn');};
  if(NET.http)fetch('api.php?a=sell',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:netPid(),oid})}).then(r=>r.json()).then(j=>{if(j&&j.ok)done();else{noteAdd('NIET GELUKT','Dit huis staat niet (meer) op jouw naam','#ff6b6b',180);houseFetch();}}).catch(()=>noteAdd('GEEN VERBINDING','Probeer het zo nog eens','#ff6b6b',150));else done();}

// ---- huizen van iedereen op de grote kaart
let OIDB=null;function bOid(oid){if(!OIDB){OIDB=new Map();for(const b of BUILDINGS)if(b.oid)OIDB.set(String(b.oid),b);}return OIDB.get(String(oid));}
{const _bm=drawBigMap;drawBigMap=function(){_bm();const M=window.BMAP;if(!M)return;ctx.save();ctx.beginPath();ctx.rect(M.x0,M.y0,M.w,M.h);ctx.clip();const me=pvpPub();
  const lab=[];for(const oid in HS){const h=HS[oid],b=bOid(oid);if(!b||!h)continue;const [x,y]=M.mp(b.cx,b.cy);if(x<M.x0-10||x>M.x0+M.w+10||y<M.y0-10||y>M.y0+M.h+10)continue;const mine=h.p===me,r=Math.max(5,Math.min(9,M.s*90));
    ctx.fillStyle=mine?'#ffd166':'#c77dff';ctx.strokeStyle='#120a20';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x+r*.7,y);ctx.lineTo(x+r*.7,y+r*.8);ctx.lineTo(x-r*.7,y+r*.8);ctx.lineTo(x-r*.7,y);ctx.lineTo(x-r,y);ctx.closePath();ctx.stroke();ctx.fill();
    if(M.s>.09||mine)lab.push([x,y+r+8,(mine?'':String(h.o||'').slice(0,10)+': ')+String(h.t||'Huis').slice(0,10),mine]);}
  ctx.font='800 11px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';for(const [x,y,t,mine] of lab){ctx.lineWidth=3.4;ctx.strokeStyle='rgba(6,4,14,.95)';ctx.strokeText(t,Math.round(x),Math.round(y));ctx.fillStyle=mine?'#ffd166':'#e6d4ff';ctx.fillText(t,Math.round(x),Math.round(y));}
  const n=Object.keys(HS).length;if(n){ctx.restore();txt(`🏠 ${n} gekochte huizen · geel = van jou, paars = van anderen`,CW/2,M.y0+M.h+38,11,'#e6d4ff','center','Inter, sans-serif');return;}ctx.restore();};}

// ---- winkelmandje: eerst in je mandje, dan afrekenen bij de kassa
const CART={items:[]};
function cartTotal(){return Math.round(CART.items.reduce((a,i)=>a+i.p,0)*100)/100;}
function cartAdd(it){CART.items.push(it);sfx('blip');buzz(10);cartUI();noteAdd('IN JE MANDJE',it.ic+' '+it.l+' · totaal €'+eur(cartTotal()),'#36d1ff',110,'mandje');}
function eur(v){return (Math.round(v*100)/100).toFixed(2).replace('.',',').replace(',00','');}
function inShop(){return (FPV.on&&FPV.sc!=='toren'&&FPV.sc!=='kasteel')||(SC.on&&SC.room==='intertoys');}
function cartPay(){if(!CART.items.length)return;const tot=cartTotal();if(P.money<tot){noteAdd('TE WEINIG GELD','Je mandje kost €'+eur(tot)+', je hebt €'+Math.floor(P.money)+'. Haal iets terug.','#ff6b6b',200,'mandje');sfx('blip');return;}
  const list=CART.items.splice(0);for(const it of list)it.buy();sfx('kassa');buzz([20,30,20]);noteAdd('AFGEREKEND','€'+eur(tot)+' betaald voor '+list.length+' item'+(list.length>1?'s':'')+'. Bedankt en tot ziens!','#7dff6a',220,'mandje');cartUI();if(SC.on&&SC.room==='intertoys'&&typeof shopOpen==='function'&&ITK.open)shopOpen();}
function cartClear(silent){if(!CART.items.length)return;CART.items.length=0;cartUI();if(!silent)noteAdd('MANDJE LEEG','Alles is terug in het schap gelegd','#a9acc4',140,'mandje');}
function cartUI(){let d=document.getElementById('cartBar');const show=inShop()&&!(typeof ITK!=='undefined'&&ITK.open)&&!SC.tagOpen;if(!d){d=document.createElement('div');d.id='cartBar';document.body.appendChild(d);d.addEventListener('pointerdown',e=>{e.stopPropagation();const t=e.target.closest('[data-c]');if(!t)return;e.preventDefault();if(t.dataset.c==='pay')cartPay();else cartClear();});}
  if(!show){d.style.display='none';return;}const n=CART.items.length,tot=cartTotal();const html=`<span class="cbI">🛒<b>${n}</b></span><span class="cbT">${n?CART.items.slice(-3).map(i=>i.ic).join(' ')+(n>3?' …':''):'Mandje is leeg'}<small>${n?'totaal €'+eur(tot):'tik op een product'}</small></span>${n?'<span class="cbX" data-c="clr">✕</span>':''}<span class="cbPay${n?'':' off'}" data-c="pay">AFREKENEN${n?' €'+eur(tot):''}</span>`;
  if(d._h!==html){d.innerHTML=html;d._h=html;}d.style.display='flex';}
setInterval(()=>{const s=inShop();if(!s&&CART.items.length){cartClear(true);noteAdd('NIET AFGEREKEND','Je liep weg zonder te betalen; je mandje is teruggezet.','#ff9f1c',180,'mandje');}cartUI();},250);
{const st=document.createElement('style');st.textContent=`#cartBar{position:fixed;z-index:71;left:50%;transform:translateX(-50%);top:calc(var(--st) + 74px);display:none;align-items:center;gap:10px;padding:8px 8px 8px 12px;border-radius:16px;background:rgba(20,10,36,.94);border:2px solid #36d1ff;box-shadow:0 0 18px rgba(54,209,255,.35);font-family:Inter,sans-serif;color:#fff;max-width:calc(100vw - 20px)}
#cartBar .cbI{position:relative;font-size:24px}#cartBar .cbI b{position:absolute;right:-8px;top:-6px;min-width:18px;height:18px;border-radius:9px;background:#ff2e88;font:800 11px Inter;display:flex;align-items:center;justify-content:center;padding:0 4px}
#cartBar .cbT{font:700 14px Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}#cartBar .cbT small{display:block;font:600 11px Inter;opacity:.7}#cartBar .cbX{padding:8px;opacity:.7;cursor:pointer;font-weight:800}
#cartBar .cbPay{padding:11px 14px;border-radius:12px;background:linear-gradient(90deg,#22c55e,#16a34a);font:900 13px Inter;letter-spacing:.5px;cursor:pointer;white-space:nowrap;box-shadow:0 0 12px rgba(34,197,94,.5)}#cartBar .cbPay.off{background:#3a3a5a;box-shadow:none;opacity:.6}`;document.head.appendChild(st);}
// supermarkten (AH, Lidl, Gall & Gall): producten gaan in je mandje, overvallen blijft direct
{const _fa=fpvActivate;fpvActivate=function(h){if(h&&h.p>0&&!h.rob){const l=String(h.l||'Product'),ic=(l.match(/^\S+/)||['🛒'])[0];cartAdd({ic,l:l.replace(/^\S+\s*/,''),p:h.p,buy:()=>{addMoney(-h.p);h.f();buyLog(ic,l.replace(/^\S+\s*/,''),h.p);}});return;}return _fa.apply(this,arguments);};}
// Intertoys: Squeezies uit het schap of van de toonbank in je mandje
{const _real=sqzBuy;sqzBuy=function(i){const s=SQZ[i];if(!s)return;if(!(SC.on&&SC.room==='intertoys')){_real(i);return;}cartAdd({ic:'🧸',l:sqzName(s),p:s.p||3,sq:s.k,buy:()=>_real(i)});if(ITK.open)shopOpen();};}
{const _so=shopOpen;shopOpen=function(){_so();const d=document.getElementById('sqzShop');if(!d)return;const inC={};for(const it of CART.items)if(it.sq)inC[it.sq]=(inC[it.sq]||0)+1;
  d.querySelectorAll('.shIt').forEach((el,i)=>{const s=SQZ[i];if(s&&inC[s.k]){const t=document.createElement('b');t.className='shIn';t.textContent='🛒 '+inC[s.k];el.appendChild(t);}});
  const sm=d.querySelector('.shTop small');if(sm)sm.textContent='Tik om in je mandje te doen. Je hebt €'+Math.floor(P.money)+'.';
  const n=CART.items.length,f=document.createElement('div');f.className='shFoot';f.innerHTML=`<span>🛒 ${n} in je mandje · €${eur(cartTotal())}</span><b class="${n?'':'off'}">AFREKENEN</b>`;f.querySelector('b').onclick=()=>{cartPay();};d.querySelector('.shBox').appendChild(f);};}
{const st=document.createElement('style');st.textContent=`#sqzShop .shFoot{position:sticky;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;background:#fff3c4;border-top:3px solid #ffd400;color:#222;font:800 14px Inter}
#sqzShop .shFoot b{padding:11px 16px;border-radius:12px;background:#16a34a;color:#fff;cursor:pointer;font-weight:900}#sqzShop .shFoot b.off{background:#bbb}#sqzShop .shIn{position:absolute;top:4px;left:6px;font:800 11px Inter;color:#16a34a}`;document.head.appendChild(st);}
