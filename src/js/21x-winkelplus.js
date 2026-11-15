// ====================== meer Squeezies + kassa bij Intertoys, huizen overkopen, vlammenwerper, gebouwen oplichten en aantikken ======================
// ---- nieuwe Squeezies (zachte knijpbeestjes); de eerste 8 zijn de axolotls uit 21w
for(const it of [
  {k:'beer_honing',n:'Knijpbeer Honing',c:'#e0a868',g:'#a8682e',t:'beer',p:4},{k:'beer_roze',n:'Knijpbeer Roze',c:'#f6b3cf',g:'#d9678f',t:'beer',p:4},{k:'beer_mint',n:'Knijpbeer Mint',c:'#a8e6cf',g:'#4caf8a',t:'beer',p:4},
  {k:'blok_geel',n:'Blij Blokje',c:'#ffe066',g:'#e8a91c',t:'blok',p:3},{k:'blok_blauw',n:'Blauw Blokje',c:'#8ecdf7',g:'#3d8ad6',t:'blok',p:3},{k:'blok_regenboog',n:'Regenboogblokje',c:'#ff8fb1',g:'#7b61ff',t:'blok',p:5},
  {k:'kat',n:'Knijpkat Perzik',c:'#f7c59f',g:'#d98a4e',t:'kat',p:4},{k:'wolk',n:'Wolkje',c:'#eef4ff',g:'#9fb8e8',t:'wolk',p:3},{k:'ster',n:'Sterretje',c:'#ffd84d',g:'#f0a500',t:'ster',p:3},
  {k:'aardbei',n:'Aardbei',c:'#ff5a6e',g:'#3fa34d',t:'aardbei',p:3},{k:'kikker',n:'Kikkertje',c:'#8fdc6a',g:'#4c9a2a',t:'kikker',p:4},{k:'eenhoorn',n:'Eenhoorn',c:'#fff4fb',g:'#c77dff',t:'eenhoorn',p:6}])SQZ.push(it);
SQZ.forEach(s=>{if(!s.t)s.t='axo';if(!s.p)s.p=3;});
function sqzName(s){return s.t==='axo'?s.n+' axolotl':s.n;}
function sqzFace(g,r,dy){dy=dy||0;g.fillStyle='#222';g.beginPath();g.arc(-r*.3,dy,r*.09,0,TAU);g.arc(r*.3,dy,r*.09,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(-r*.27,dy-r*.04,r*.032,0,TAU);g.arc(r*.33,dy-r*.04,r*.032,0,TAU);g.fill();
  g.strokeStyle='#222';g.lineWidth=Math.max(1,r*.06);g.beginPath();g.moveTo(-r*.12,dy+r*.15);g.quadraticCurveTo(0,dy+r*.28,r*.12,dy+r*.15);g.stroke();
  g.fillStyle='rgba(240,90,140,.45)';g.beginPath();g.ellipse(-r*.48,dy+r*.14,r*.12,r*.07,0,0,TAU);g.ellipse(r*.48,dy+r*.14,r*.12,r*.07,0,0,TAU);g.fill();}
function sqzShine(g,r){g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.ellipse(-r*.35,-r*.45,r*.22,r*.12,-.5,0,TAU);g.fill();}
function drawSqz(g,x,y,r,s){if(!s.t||s.t==='axo'){drawAxo(g,x,y,r,s);return;}const c=s.c,d=s.g;g.save();g.translate(x,y);g.lineWidth=Math.max(1,r*.05);g.strokeStyle='rgba(0,0,0,.15)';
  if(s.t==='beer'||s.t==='kat'){g.fillStyle=c;if(s.t==='beer'){for(const sd of [-1,1]){g.beginPath();g.arc(sd*r*.62,-r*.62,r*.28,0,TAU);g.fill();g.fillStyle=d;g.beginPath();g.arc(sd*r*.62,-r*.62,r*.14,0,TAU);g.fill();g.fillStyle=c;}}
    else for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*r*.85,-r*.25);g.lineTo(sd*r*.7,-r*1.0);g.lineTo(sd*r*.25,-r*.6);g.fill();}
    g.beginPath();g.ellipse(0,-r*.05,r*.9,r*.8,0,0,TAU);g.fill();g.stroke();g.fillStyle=d;g.globalAlpha=.35;g.beginPath();g.ellipse(0,r*.25,r*.32,r*.22,0,0,TAU);g.fill();g.globalAlpha=1;sqzShine(g,r);sqzFace(g,r,-r*.1);
    if(s.t==='kat'){g.strokeStyle=d;g.lineWidth=Math.max(1,r*.04);for(const sd of [-1,1])for(const k of [-1,1]){g.beginPath();g.moveTo(sd*r*.55,r*.05+k*r*.06);g.lineTo(sd*r*.9,k*r*.12);g.stroke();}}}
  else if(s.t==='blok'){if(s.k==='blok_regenboog'){const gr=g.createLinearGradient(-r,-r,r,r);['#ff5a6e','#ffb347','#ffe066','#8fdc6a','#5ec8ff','#a77dff'].forEach((q,i)=>gr.addColorStop(i/5,q));g.fillStyle=gr;}else g.fillStyle=c;
    rrect(g,-r*.85,-r*.8,r*1.7,r*1.6,r*.35);g.fill();g.stroke();g.fillStyle='rgba(0,0,0,.08)';rrect(g,-r*.85,r*.35,r*1.7,r*.45,r*.3);g.fill();sqzShine(g,r);sqzFace(g,r,-r*.05);}
  else if(s.t==='wolk'){g.fillStyle=c;for(const [px,py,pr] of [[-.5,.1,.45],[0,-.25,.55],[.5,.1,.45],[0,.25,.5]]){g.beginPath();g.arc(px*r,py*r,pr*r,0,TAU);g.fill();}g.strokeStyle=d;g.globalAlpha=.4;g.beginPath();g.arc(0,-r*.25,r*.55,Math.PI*1.1,Math.PI*1.9);g.stroke();g.globalAlpha=1;sqzFace(g,r,0);}
  else if(s.t==='ster'){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr2=i%2?r*.5:r*1.0;g.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2+r*.08);}g.closePath();g.fill();g.strokeStyle=d;g.stroke();sqzShine(g,r*.8);sqzFace(g,r*.75,r*.05);}
  else if(s.t==='aardbei'){g.fillStyle=c;g.beginPath();g.moveTo(0,r*.95);g.bezierCurveTo(-r*1.05,r*.3,-r*.9,-r*.75,0,-r*.55);g.bezierCurveTo(r*.9,-r*.75,r*1.05,r*.3,0,r*.95);g.fill();g.fillStyle='#ffe9a8';for(const [px,py] of [[-.45,.1],[.45,.1],[-.2,.55],[.2,.55],[0,.3],[-.55,-.25],[.55,-.25]]){g.beginPath();g.ellipse(px*r,py*r,r*.04,r*.07,0,0,TAU);g.fill();}
    g.fillStyle=d;for(let i=0;i<5;i++){const a=-Math.PI+i*Math.PI/4;g.beginPath();g.ellipse(Math.cos(a)*r*.25,-r*.65+Math.sin(a)*r*.08,r*.22,r*.08,a,0,TAU);g.fill();}sqzFace(g,r*.8,-r*.05);}
  else if(s.t==='kikker'){g.fillStyle=c;for(const sd of [-1,1]){g.beginPath();g.arc(sd*r*.45,-r*.6,r*.3,0,TAU);g.fill();}g.beginPath();g.ellipse(0,0,r*.95,r*.75,0,0,TAU);g.fill();g.stroke();
    g.fillStyle='#fff';for(const sd of [-1,1]){g.beginPath();g.arc(sd*r*.45,-r*.62,r*.18,0,TAU);g.fill();}g.fillStyle='#222';for(const sd of [-1,1]){g.beginPath();g.arc(sd*r*.45,-r*.6,r*.09,0,TAU);g.fill();}
    g.strokeStyle='#222';g.lineWidth=Math.max(1,r*.06);g.beginPath();g.moveTo(-r*.4,r*.05);g.quadraticCurveTo(0,r*.38,r*.4,r*.05);g.stroke();g.fillStyle='rgba(240,90,140,.45)';g.beginPath();g.ellipse(-r*.6,r*.1,r*.12,r*.07,0,0,TAU);g.ellipse(r*.6,r*.1,r*.12,r*.07,0,0,TAU);g.fill();}
  else if(s.t==='eenhoorn'){g.fillStyle=c;g.beginPath();g.ellipse(0,0,r*.85,r*.8,0,0,TAU);g.fill();g.stroke();const gr=g.createLinearGradient(0,-r*1.3,0,-r*.6);gr.addColorStop(0,'#ffd84d');gr.addColorStop(1,'#ff8fb1');g.fillStyle=gr;g.beginPath();g.moveTo(-r*.15,-r*.7);g.lineTo(0,-r*1.35);g.lineTo(r*.15,-r*.7);g.fill();
    ['#ff8fb1','#c77dff','#5ec8ff'].forEach((q,i)=>{g.fillStyle=q;g.beginPath();g.ellipse(-r*.55+i*r*.18,-r*.55+i*r*.05,r*.2,r*.12,-.6,0,TAU);g.fill();});for(const sd of [-1,1]){g.fillStyle=c;g.beginPath();g.moveTo(sd*r*.55,-r*.55);g.lineTo(sd*r*.75,-r*.95);g.lineTo(sd*r*.3,-r*.7);g.fill();}sqzShine(g,r);sqzFace(g,r,0);}
  g.restore();}
// ---- twee vrolijke mensen achter de kassa
(function(){const _it=itSprites;itSprites=function(S){_it(S);const happy=(shirt,hair,cap,long)=>mkTex(32,80,(g)=>{g.fillStyle='#2a2a30';g.fillRect(10,52,5,28);g.fillRect(17,52,5,28);g.fillStyle=shirt;g.fillRect(7,22,18,32);g.fillRect(3,20,5,14);g.fillRect(24,20,5,14);g.fillStyle='#e0b48f';g.fillRect(2,14,5,7);g.fillRect(25,14,5,7);
    g.fillStyle='#fff';g.font='bold 6px sans-serif';g.textAlign='center';g.fillText('toys',16,36);g.fillStyle='#e0b48f';g.beginPath();g.arc(16,13,8.5,0,6.3);g.fill();g.fillStyle=hair;g.beginPath();g.arc(16,9.5,8.5,3.1,6.3);g.fill();if(long){g.fillRect(7,9,3,15);g.fillRect(22,9,3,15);}
    if(cap){g.fillStyle='#e30613';g.fillRect(7,4,18,5);g.fillRect(16,7,11,3);}g.fillStyle='#222';g.fillRect(12,11,2,2);g.fillRect(18,11,2,2);g.fillStyle='#7a1f1f';g.beginPath();g.arc(16,15,4,0,Math.PI);g.fill();g.fillStyle='#fff';g.fillRect(13,15,6,1.5);g.fillStyle='rgba(240,90,120,.5)';g.fillRect(9,14,3,2);g.fillRect(20,14,3,2);});
  S.kassa=happy('#e30613','#6b3e1e',0,1);S.kassa2=happy('#e30613','#2b2b2b',1,0);};})();
// kijk je naar de toonbank: "Wil je wat kopen?"
function itCounter(){if(!SC.on||SC.room!=='intertoys')return false;for(const d of [.6,1.0])if(scCell(SC.x+Math.cos(SC.yaw)*d,SC.z+Math.sin(SC.yaw)*d)==='C')return true;return false;}
const ITK={seen:false,open:false};
function shopOpen(){let d=document.getElementById('sqzShop');if(!d){d=document.createElement('div');d.id='sqzShop';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());}
  ITK.open=true;SC.mv.f=0;SC.mv.t=0;const own=PRG.sqz||{};
  d.innerHTML=`<div class="shBox"><div class="shTop"><span class="shFace">😊</span><div><b>Wil je wat kopen?</b><small>Kies een Squeezy. Je hebt €${Math.floor(P.money)}.</small></div><span class="shX">✕</span></div><div class="shGrid"></div></div>`;
  const gr=d.querySelector('.shGrid');SQZ.forEach((s,i)=>{const it=document.createElement('div');it.className='shIt';const c=document.createElement('canvas');c.width=96;c.height=96;drawSqz(c.getContext('2d'),48,52,30,s);it.appendChild(c);
    it.insertAdjacentHTML('beforeend',`<span>${sqzName(s)}</span><em>€${s.p}</em>${own[s.k]?`<i>×${own[s.k]}</i>`:''}`);it.addEventListener('click',()=>{sqzBuy(i);shopOpen();});gr.appendChild(it);});
  d.querySelector('.shX').onclick=shopClose;d.style.display='flex';}
function shopClose(){const d=document.getElementById('sqzShop');if(d)d.style.display='none';ITK.open=false;}
{const st=document.createElement('style');st.textContent=`#sqzShop{position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:rgba(10,4,20,.55);padding:calc(var(--st) + 10px) 10px calc(var(--sb) + 10px)}
#sqzShop .shBox{width:min(520px,100%);max-height:100%;overflow:auto;background:#fffdf5;border:4px solid #e30613;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.5);font-family:Inter,sans-serif}
#sqzShop .shTop{position:sticky;top:0;display:flex;gap:10px;align-items:center;padding:12px 14px;background:#e30613;color:#fff}#sqzShop .shFace{font-size:30px}#sqzShop .shTop b{display:block;font-size:19px}#sqzShop .shTop small{opacity:.9}
#sqzShop .shX{margin-left:auto;font-size:22px;cursor:pointer;padding:4px 8px}#sqzShop .shGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;padding:12px}
#sqzShop .shIt{position:relative;background:#fff;border:2px solid #ffd400;border-radius:14px;padding:6px;text-align:center;cursor:pointer;color:#222}#sqzShop .shIt:active{transform:scale(.95)}
#sqzShop canvas{position:static!important;inset:auto!important;width:72px!important;height:72px!important;display:block;margin:0 auto;pointer-events:none}#sqzShop .shIt span{display:block;font:700 12px Inter,sans-serif;min-height:30px}#sqzShop .shIt em{display:inline-block;font-style:normal;font-weight:900;background:#e30613;color:#fff;border-radius:8px;padding:2px 8px;margin-top:2px}
#sqzShop .shIt i{position:absolute;top:4px;right:6px;font:800 11px Inter;color:#7b2ff7;font-style:normal}`;document.head.appendChild(st);}
setInterval(()=>{if(!(SC.on&&SC.room==='intertoys')){ITK.seen=false;if(ITK.open)shopClose();let b=document.getElementById('itBuy');if(b)b.style.display='none';return;}
  const at=itCounter();let b=document.getElementById('itBuy');if(!b){b=document.createElement('div');b.id='itBuy';b.className='scBtn';b.textContent='😊 Wil je wat kopen?';b.style.cssText+='right:calc(var(--sr) + 14px);bottom:calc(var(--sb) + 40px);background:linear-gradient(90deg,#e30613,#ffb000);white-space:nowrap';b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();shopOpen();});document.body.appendChild(b);}
  b.style.display=at&&!ITK.open?'block':'none';if(at&&!ITK.seen){ITK.seen=true;shopOpen();}if(!at&&ITK.seen&&!ITK.open&&SC.z<7)ITK.seen=false;},150);
window.addEventListener('keydown',e=>{if(ITK.open&&e.code==='Escape'){shopClose();e.stopPropagation();}else if(SC.on&&SC.room==='intertoys'&&!ITK.open&&itCounter()&&(e.code==='Enter'||e.code==='Space'))shopOpen();},true);
{const _ss=scStep;scStep=function(){if(ITK.open){SC.mv.f=0;SC.mv.t=0;for(const k in pressed)pressed[k]=false;return;}_ss();};}

// ---- huis overkopen van een andere speler: standaardprijs + 10% (die 10% gaat naar de eigenaar)
{const _ha=houseAct;houseAct=function(b){const h=HS[b.oid];if(h&&h.p!==pvpPub()){const pr=housePrice(b),cut=Math.max(10,Math.round(pr*.1)),tot=pr+cut;return{k:'overname',b,pr,cut,t:`🏠 ${h.t||'Huis'} van ${h.o||'?'} overkopen (€${tot})`,btn:`🏠<br>€${tot}`};}return _ha(b);};}
function houseTakeover(b){const h=HS[b.oid];if(!h||h.p===pvpPub())return;const pr=housePrice(b),cut=Math.max(10,Math.round(pr*.1)),tot=pr+cut;
  if(P.money<tot){noteAdd('TE WEINIG GELD','Overkopen kost €'+tot+' (€'+pr+' + €'+cut+' voor '+(h.o||'de eigenaar')+')','#ff6b6b',180,'huisgeld');return;}
  const owner=h.p,oname=h.o||'de eigenaar';
  const done=()=>{addMoney(-tot);sfx('kassa');HS[b.oid]={p:pvpPub(),o:netName(),t:'Mijn huis'};MYH[b.oid]='Mijn huis';lsSet('gtb_myhouses',JSON.stringify(MYH));addXP(80);
    noteAdd('HUIS OVERGENOMEN','Je betaalde €'+tot+'. '+oname+' krijgt €'+cut+'.','#7dff6a',240);houseName(b);};
  if(NET.http){fetch('api.php?a=takeover',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:netPid(),oid:String(b.oid),from:owner,cut})}).then(r=>r.json()).then(j=>{if(j&&j.ok)done();else{noteAdd('NIET GELUKT','Dit huis is net van eigenaar gewisseld','#ff6b6b',180);houseFetch();}}).catch(()=>noteAdd('GEEN VERBINDING','Probeer het zo nog eens','#ff6b6b',150));}
  else{if(!(NET.room&&pvpByPub(owner))){noteAdd('EIGENAAR NIET ONLINE',oname+' moet online zijn om het huis over te dragen','#ff9f1c',180);return;}pvpSend('hsold',owner,cut,String(b.oid));done();}}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='overname'){houseTakeover(a.b);return true;}return _at.apply(this,arguments);};}
function payRecv(list){for(const p of list){const amt=Math.max(0,p.amt|0);addMoney(amt);sfx('kassa');buzz([30,40,30]);noteAdd('HUIS VERKOCHT','"'+String(p.name||'Je huis').slice(0,24)+'" is overgekocht door '+String(p.nm||'iemand').slice(0,14)+'. Jij krijgt €'+amt+'.','#ffd166',360);}if(NET.http)houseFetch();}
{const _r=pvpRecv;pvpRecv=function(s,e){if(e.k==='hsold'){const oid=String(e.m||'');if(MYH[oid]){const nm=MYH[oid];delete MYH[oid];lsSet('gtb_myhouses',JSON.stringify(MYH));HS[oid]={p:s.pid,o:s.nm,t:'Mijn huis'};payRecv([{amt:e.d,nm:s.nm,name:nm}]);}return;}_r(s,e);};}
// verkocht terwijl je weg was: haal het uit je eigen lijst
setInterval(()=>{let ch=0;for(const k in MYH)if(HS[k]&&HS[k].p&&HS[k].p!==pvpPub()){delete MYH[k];ch=1;}if(ch)lsSet('gtb_myhouses',JSON.stringify(MYH));},5000);

// ---- vlammenwerper
WPN.vlam={n:'Vlammenwerper',ic:-1,emo:'🔥',cd:3,flame:1,cone:.5,range:110,lvl:2};WORDER.push('vlam');let FLAMES=[];
{const _iw=initWpick;initWpick=function(){_iw();let sd=9127;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;const [x0,y0,x1,y1]=FORTBB;for(let t=0;t<600;t++){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0),c=cellAt(x,y);if((c===WALK||c===PLAZA)&&WPICK.every(q=>Math.hypot(q.x-x,q.y-y)>220)&&Math.hypot(x-SPAWN[0],y-SPAWN[1])>200){WPICK.push({w:'vlam',x,y});break;}}};}
{const _wi=wpnIcon;wpnIcon=function(g,w,x,y,wd,ht){const W=WPN[w];if(W&&W.emo&&W.ic<0){g.save();g.font=Math.round(ht*1.4)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(W.emo,x+wd/2,y+ht/2);g.restore();return;}_wi(g,w,x,y,wd,ht);};}
{const _fg=fireGun;fireGun=function(){const W=WPN[P.wid];if(!(W&&W.flame)){_fg();return;}if(P.throwCd>0||P.car)return;if(typeof schoolBlock==='function'&&schoolBlock())return;P.throwCd=W.cd;
  const a=aimAt(W);P.a=a;const sx=P.x+Math.cos(a)*12,sy=P.y+Math.sin(a)*12;for(let i=0;i<4;i++){const b=a+rr(-.2,.2),v=rr(7.5,10);FLAMES.push({x:sx,y:sy,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:rr(22,30),ml:30,r:4});}
  if(frameN%6===0)flameSfx();if(frameN%20===0){panic(P.x,P.y,240);if(copNear(420))addHeat(.3);}camHit(.6);};}
function flameSfx(){if(!AU.c)return;const t=AU.c.currentTime;noiseHit(t,.14,.35,'bandpass',900,[AU.sfx],.5);noiseHit(t,.18,.2,'lowpass',300,[AU.sfx]);}
{const _gs=gunStep;gunStep=function(){_gs();for(const f of FLAMES){f.x+=f.vx;f.y+=f.vy;f.vx*=.93;f.vy*=.93;f.l--;f.r+=.8;if(cellAt(f.x,f.y)===BUILD){f.vx*=-.2;f.vy*=-.2;f.l=Math.min(f.l,6);}
    if(f.l%4===0){for(const p of peds){if(p.state==='down')continue;if(Math.hypot(p.x-f.x,p.y-f.y)<f.r+5){knockDown(p,true,Math.atan2(p.y-f.y,p.x-f.x));if(p.kind==='cop')addHeat(1.2);for(let i=0;i<5;i++)parts.push({x:p.x,y:p.y,vx:rr(-.6,.6),vy:rr(-1.2,-.2),l:30,ml:30,s:3,k:'f'});}}
      for(const c of cars){if(c===P.car||c.state!=='ok')continue;if(Math.hypot(c.x-f.x,c.y-f.y)<c.t.l/2+f.r){damageCar(c,5,true);if(c.driver==='cop')addHeat(.4);}}
      for(const t of TARGETS){if(!t.hit&&Math.hypot(t.x-f.x,t.y-f.y)<f.r+6){t.hit=1;popTxt(t.x,t.y-12,'RAAK!','#7dff6a',1);}}
      if(typeof pvpGhosts==='function'&&(NET.room||NET.http))for(const s of pvpGhosts())if(pvpTarget(s)&&Math.hypot(s.x-f.x,s.y-f.y)<f.r+8)pvpHit(s,4);}
    if(f.l%3===0&&Math.random()<.4)parts.push({x:f.x,y:f.y,vx:f.vx*.2+rr(-.3,.3),vy:f.vy*.2-rr(.2,.6),l:18,ml:18,s:rr(1.5,3),k:'d'});}
  FLAMES=FLAMES.filter(f=>f.l>0);};}
{const _dg=drawGunWorld;drawGunWorld=function(){_dg();if(FLAMES.length){ctx.save();ctx.globalCompositeOperation='lighter';for(const f of FLAMES){const a=f.l/f.ml;glow(f.x,f.y,f.r*3,a>.6?`rgba(255,${200+55*a|0},120,${.7*a})`:`rgba(255,${110*a+60|0},30,${.75*a})`);}ctx.restore();for(const f of FLAMES){const a=f.l/f.ml;ctx.fillStyle=a>.5?`rgba(255,240,170,${a*.8})`:`rgba(255,120,30,${a})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.35+a*.3),0,TAU);ctx.fill();}}
  if(P.wid==='vlam'&&!P.car&&!P.dead){ctx.save();ctx.translate(P.x,P.y);ctx.rotate(P.a);ctx.fillStyle='#b23a1e';ctx.fillRect(6,1,13,4);ctx.fillStyle='#333';ctx.fillRect(17,1.5,4,3);ctx.fillStyle='#ffb000';ctx.fillRect(-6,-3,5,7);ctx.restore();
    if(frameN%3===0)parts.push({x:P.x+Math.cos(P.a)*21,y:P.y+Math.sin(P.a)*21,vx:rr(-.2,.2),vy:-.3,l:10,ml:10,s:1.4,k:'f'});}};}

// ---- winkel of huis licht op als je er langs loopt; tik erop om naar binnen te gaan
let HILITE=null;const HILITE_K=new Set(['toys','stadscafe','fpv','dorp','thuis','overname']);
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);HILITE=null;if(a&&!P.car){let b=a.b||(a.s&&a.s.b);if(!b&&a.k==='dorp')b=BUILDINGS.find(q=>q.dorp);if(!b){const s=nearShop();b=s&&s.b;}if(b&&b.p&&HILITE_K.has(a.k))HILITE=b;}return a;};}
function drawHilite(b,r,rcx,rcy){const a=ACT.cur;const bad=a&&(a.k==='rob'||a.k==='robbed'),col=bad?'255,80,80':'255,209,102',pu=.6+.4*Math.sin(frameN*.12);
  ctx.save();ctx.beginPath();ctx.moveTo(r[0][0],r[0][1]);for(let i=1;i<r.length;i++)ctx.lineTo(r[i][0],r[i][1]);ctx.closePath();ctx.fillStyle=`rgba(${col},${.16*pu})`;ctx.fill();
  ctx.shadowColor=`rgb(${col})`;ctx.shadowBlur=18;ctx.strokeStyle=`rgba(${col},${.55+.45*pu})`;ctx.lineWidth=3.5;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.moveTo(b.p[0][0],b.p[0][1]);for(let i=1;i<b.p.length;i++)ctx.lineTo(b.p[i][0],b.p[i][1]);ctx.closePath();ctx.setLineDash([6,5]);ctx.lineDashOffset=-frameN*.5;ctx.strokeStyle=`rgba(${col},.8)`;ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
  const t=(IS_TOUCH?'👆 Tik op het gebouw':'🖱 Klik op het gebouw')+(a&&a.k==='overname'?' om binnen te kijken':' om binnen te gaan');ctx.font='800 12px Inter, sans-serif';const w=ctx.measureText(t).width+16,y=rcy+26;ctx.fillStyle=bad?'rgba(120,20,30,.92)':'rgba(26,10,44,.92)';rrect(ctx,rcx-w/2,y-10,w,20,9);ctx.fill();ctx.fillStyle=`rgb(${col})`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,rcx,y+1);ctx.restore();}
window.addEventListener('pointerdown',e=>{if(MODE!=='play'||paused||SC.on||bigMap||!HILITE||!ACT.cur||P.car)return;const tg=e.target;if(!(tg===cv||(tg&&tg.id==='joyZone')||(tg&&tg.id==='lightc')))return;
  const r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,wx=CAM.x+(sx-CW/2)/CAM.z,wy=CAM.y+(sy-CH/2)/CAM.z,b=HILITE,f=Math.min(b.ht,180)*.0022;
  const roof=b.p.map(q=>[q[0]+(q[0]-CAM.x)*f,q[1]+(q[1]-CAM.y)*f]);if(!(pip(wx,wy,b.p)||pip(wx,wy,roof)))return;
  e.preventDefault();e.stopImmediatePropagation();buzz(15);if(ACT.cur.k==='overname'&&typeof houseVisit==='function')houseVisit(b);else actTry();},true);
{const _se=scEnter;scEnter=function(r){ACT.cur=null;HILITE=null;_se(r);};}
{const _gw=drawGlows;drawGlows=function(){_gw.apply(this,arguments);if(!FLAMES.length)return;ctx.save();ctx.globalCompositeOperation='lighter';for(const f of FLAMES){const a=f.l/f.ml;glow(f.x,f.y,f.r*2.4,`rgba(255,${120+120*a|0},40,${.55*a})`);ctx.fillStyle=`rgba(255,${200+50*a|0},140,${.7*a})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.3+a*.3),0,TAU);ctx.fill();}ctx.restore();};}
