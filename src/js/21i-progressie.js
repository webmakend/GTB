// ====================== progressie: respect & levels, Gouden Bommels, prestaties, dagbonus ======================
// Alles wordt los van het opslagslot bewaard (gtb_prog_v1), zodat je voortgang altijd blijft.
const PRG_KEY='gtb_prog_v1';
const PRG={hist:[],xp:0,lvl:1,coins:[],ach:[],day:'',streak:0,gun:false,robs:0,jobs:0,races:0,dirty:false,combo:0,comboT:0,toasts:[],drift:0,lastStars:0,dailyDone:false,reveal:0,revealC:-1};
const RANKS=['Loopjongen','Straatschoffie','Associate','Mob','Made Man','Soldato','Caporegime','Consigliere','Underboss','The Boss','Godfather','Capo dei Capi'];
const RANK_TXT=['Je haalt koffie en loopt boodschapjes voor de familie.','Je kent de straten van Bommel op je duimpje.','Je werkt voor de familie, maar je hoort er nog niet bij.','De familie begint je te vertrouwen.','Je hebt de omertà gezworen: de zwijgplicht. Nu ben je een echte "made man".','Je bent een soldaat van de familie en verdient geld voor je capo.','Je leidt je eigen crew van soldaten.','Je bent de rechterhand en adviseur van de baas.','Je bent de tweede man van de familie.','Jij bent de baas van de familie Bommel.','De Peetvader. Heel de Bommelerwaard buigt voor je.','De baas van alle bazen. Hoger kan niet.'];
function rankOf(l){return RANKS[Math.min(RANKS.length-1,l-1)];}
const ACH={fiets:['Fietsendief','Steel je eerste fiets'],overval:['Handen omhoog!','Je eerste overval'],overval5:['Kassakraker','5 overvallen'],lam:['Lam als een kanon','5 drankjes op'],plas:['Wildplasser','Plassen op straat'],broek:['Oeps','Broek nat geplast'],
  pistool:['Gevonden voorwerp','Het pistool bij de watertoren gevonden'],omver10:['Kegelclub','10 mensen omver'],gejat10:['Autodief','10 voertuigen gejat'],ster3:['Gezocht','3 sterren'],ontsnapt:['Spoorloos','Ontsnapt aan de politie'],
  missies:['Verhaal uit','Alle verhaalmissies klaar'],munt1:['Glinstering','Eerste Gouden Bommel'],munt10:['Spaarvarken','10 Gouden Bommels'],munt25:['Schatrijk','Alle 25 Gouden Bommels'],level5:['Op weg','Level 5'],level10:['Legende','Level 10'],
  kasteel:['Cultuursnuiver','Het Stadskasteel bezocht'],uitzicht:['Hoog en droog','Boven op de oude watertoren'],klus3:['Klusjesman','3 klussen gedaan'],race:['Bommel GP','Straatrace gewonnen'],rijk:['Binnen!','€500 op zak'],schat:['Schatzoeker','De schat van Maarten van Rossum'],schutter:['Scherpschutter','Alle flessen geraakt']};
const COINS=[];
function progLoad(){try{const s=JSON.parse(lsGet(PRG_KEY)||'null');if(s)Object.assign(PRG,s,{toasts:[],combo:0,comboT:0,dirty:false,dailyDone:false,reveal:0});}catch(e){}PRG.lvl=lvlOf(PRG.xp);P.gun=!!PRG.gun;applyLevelPerks();}
function progSave(){const o={xp:PRG.xp,coins:PRG.coins,ach:PRG.ach,day:PRG.day,streak:PRG.streak,gun:P.gun,robs:PRG.robs,jobs:PRG.jobs,races:PRG.races,hist:PRG.hist};lsSet(PRG_KEY,JSON.stringify(o));PRG.dirty=false;}
function need(l){return Math.round(120*Math.pow(l,1.45));}
function lvlOf(xp){let l=1,t=0;while(xp>=t+need(l)){t+=need(l);l++;}return l;}
function lvlBase(l){let t=0;for(let i=1;i<l;i++)t+=need(i);return t;}
function applyLevelPerks(){P.maxhp=100+Math.min(60,(PRG.lvl-1)*6);}
function addXP(n,why){if(!n||MODE!=='play')return;const mult=1+Math.min(2,PRG.combo);PRG.combo=Math.min(2,PRG.combo+(PRG.comboT>0?1:0));PRG.comboT=200;const v=Math.round(n*mult);PRG.xp+=v;PRG.dirty=true;
  popTxt(me().x,me().y-34,'+'+v+' RESPECT'+(mult>1?' ×'+mult:''),'#c77dff',1);
  const L=lvlOf(PRG.xp);if(L>PRG.lvl){const old=PRG.lvl;PRG.lvl=L;applyLevelPerks();P.hp=P.maxhp;const cash=25*L;P.money+=cash;P.moneyF=20;
    missionBanner('PROMOTIE: '+rankOf(L).toUpperCase()+' (LV '+L+')',RANK_TXT[Math.min(RANK_TXT.length-1,L-1)]+` Beloning: €${cash} en ${P.maxhp} max. health.`,'#c77dff',360);sfx('reward');
    for(let i=0;i<40;i++){const a=rr(0,TAU),s=rr(1,4);parts.push({x:me().x,y:me().y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(30,60),ml:60,s:1,k:'st'});}
    if(L>=5)unlock('level5');if(L>=10)unlock('level10');}}
function unlock(id){if(!ACH[id]||PRG.ach.includes(id))return;PRG.ach.push(id);PRG.dirty=true;noteAdd('🏆 PRESTATIE: '+ACH[id][0].toUpperCase(),ACH[id][1]+'  ·  +50 respect','#ffd166',320);sfx('sting');setTimeout(()=>{const c=PRG.combo;PRG.combo=0;addXP(50);PRG.combo=c;},400);}
function makeCoins(){COINS.length=0;let rs=4242;const rn=()=>((rs=(rs*16807)%2147483647)/2147483647);const bb=FORTBB;let tries=0;
  const extra=[];if(WTOWER)extra.push([WTOWER.x+60,WTOWER.y-170]);
  for(const e of extra)COINS.push({x:e[0],y:e[1],i:COINS.length});
  while(COINS.length<25&&tries<20000){tries++;const x=bb[0]+rn()*(bb[2]-bb[0]),y=bb[1]+rn()*(bb[3]-bb[1]);const t=cellAt(x,y);if(!(t===WALK||t===PLAZA||t===PARK||t===PATH||t===SAND))continue;if(!pip(x,y,FORT)&&t!==SAND)continue;if(COINS.some(c=>Math.hypot(c.x-x,c.y-y)<420))continue;
    if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>cellAt(x+dx*14,y+dy*14)===BUILD))continue;COINS.push({x,y,i:COINS.length});}}
function progStep(){
  {const mh=100+Math.min(60,(PRG.lvl-1)*6);if(P.maxhp!==mh)P.maxhp=mh;}
  if(!PRG.dailyDone&&MODE==='play'&&frameN>200){PRG.dailyDone=true;const d=new Date(),day=d.toISOString().slice(0,10),y=new Date(d-864e5).toISOString().slice(0,10);
    if(PRG.day!==day){PRG.streak=PRG.day===y?PRG.streak+1:1;PRG.day=day;const cash=Math.min(70,10*PRG.streak);P.money+=cash;P.moneyF=20;PRG.dirty=true;setTimeout(()=>missionBanner('DAGBONUS · DAG '+PRG.streak,`Welkom terug in Bommel! €${cash} op je rekening. Kom morgen terug voor meer (max €70).`,'#7dff6a',300),3500);}}
  if(PRG.comboT>0&&--PRG.comboT===0)PRG.combo=0;
  if(PRG.reveal>0)PRG.reveal--;
  // gouden bommels
  const o=me();for(const c of COINS){if(PRG.coins.includes(c.i))continue;if(Math.abs(c.x-o.x)<26&&Math.abs(c.y-o.y)<26){PRG.coins.push(c.i);PRG.dirty=true;const n=PRG.coins.length;sfx('reward');
      for(let i=0;i<24;i++){const a=rr(0,TAU),s=rr(1,3.5);parts.push({x:c.x,y:c.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(20,45),ml:45,s:1,k:'st'});}
      let bonus=10;if(n%5===0)bonus=50;if(n===25)bonus=500;P.money+=bonus;P.moneyF=20;msg('GOUDEN BOMMEL '+n+'/25','+€'+bonus+(n%5===0&&n<25?' · bonus voor elke 5!':n===25?' · ALLES GEVONDEN!':''),'#ffd166',170);addXP(30);
      if(n>=1)unlock('munt1');if(n>=10)unlock('munt10');if(n>=25)unlock('munt25');}}
  // drift-bonus
  const c=P.car;if(c&&!c.t.bike){const sp=speedOf(c),lat=Math.abs(-Math.sin(c.a)*c.vx+Math.cos(c.a)*c.vy);if(sp>3.5&&lat>1.6){PRG.drift+=lat;if(frameN%6===0)parts.push({x:c.x,y:c.y,vx:0,vy:0,l:30,ml:30,s:5,k:'s'});}else if(PRG.drift>0){if(PRG.drift>120){const v=Math.round(PRG.drift/25);popTxt(c.x,c.y-30,'DRIFT!','#36d1ff',1.3);addXP(v);}PRG.drift=0;}}
  // ontsnapt aan de politie
  if(PRG.lastStars>0&&stars===0&&!P.dead){addXP(PRG.lastStars*20);msg('ONTSNAPT!','De politie is je kwijt','#7dff6a',120);unlock('ontsnapt');}
  if(!P.dead)PRG.lastStars=stars;else PRG.lastStars=0;
  if(frameN%30===0){if(stars>=3)unlock('ster3');if(P.stats.omver>=10)unlock('omver10');if(P.stats.gejat>=10)unlock('gejat10');if(P.money>=500)unlock('rijk');if(MIS.allDone)unlock('missies');if(P.drunk>=5)unlock('lam');}
  if(PRG.dirty&&frameN%300===0)progSave();
}
function drawCoins(){const t=frameN*.08,o=me();for(const c of COINS){if(PRG.coins.includes(c.i))continue;if(Math.abs(c.x-CAM.x)>1300||Math.abs(c.y-CAM.y)>1300)continue;
  const d=Math.hypot(c.x-o.x,c.y-o.y),w=Math.abs(Math.cos(t+c.i)),bob=Math.sin(t*1.3+c.i)*2;
  ctx.save();ctx.globalCompositeOperation='lighter';glow(c.x,c.y+bob,d<500?34:22,'rgba(255,210,80,.45)');ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(c.x+2,c.y+6,8,3,0,0,TAU);ctx.fill();
  ctx.fillStyle='#b8860b';ctx.beginPath();ctx.ellipse(c.x,c.y+bob,9*w+1.5,9,0,0,TAU);ctx.fill();ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.ellipse(c.x,c.y+bob,7.5*w+1,7.5,0,0,TAU);ctx.fill();
  if(w>.4){ctx.fillStyle='#8a5a00';ctx.font='900 9px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.save();ctx.translate(c.x,c.y+bob);ctx.scale(w,1);ctx.fillText('B',0,.5);ctx.restore();}
  if((frameN+c.i*7)%50<4){ctx.fillStyle='#fff';ctx.fillRect(c.x-1+5,c.y+bob-6,2,2);}}}
function progHud(){ctx=fctx;const U=clamp(Math.min(CW,CH)/560,.75,1.25),ut=uiTop(),L0=14,S0=Math.round(clamp(Math.min(CW,CH)*.27,96,150)),pw=Math.min(CW-S0-40,236*U),ph=(stars>0?82:66)*U;
  // XP-balk onderaan het statuspaneel
  const base=lvlBase(PRG.lvl),nd=need(PRG.lvl),k=clamp((PRG.xp-base)/nd,0,1),bx=L0+10*U,bw=pw-20*U,by=ut.top+ph-5*U;
  ctx.fillStyle='rgba(255,255,255,.1)';rrect(ctx,bx,by,bw,3.5*U,2);ctx.fill();const g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,'#7b2ff7');g.addColorStop(1,'#c77dff');ctx.fillStyle=g;rrect(ctx,bx,by,Math.max(3,bw*k),3.5*U,2);ctx.fill();
  ctx.font=`900 ${10*U}px Inter, sans-serif`;const lt='LV '+PRG.lvl,lw=ctx.measureText(lt).width+10*U;ctx.fillStyle='#7b2ff7';rrect(ctx,L0+pw-lw-8*U,ut.top+43*U,lw,15*U,7*U);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lt,L0+pw-lw/2-8*U,ut.top+51*U);
  ctx=wctx;}
function progMinimap(mp,cxm,cym,S){if(PRG.reveal>0&&PRG.revealC>=0){const c=COINS[PRG.revealC];if(c&&!PRG.coins.includes(c.i)){let [x,y]=mp(c.x,c.y);const dx=x-cxm,dy=y-cym,dd=Math.hypot(dx,dy);if(dd>S/2-7){x=cxm+dx/dd*(S/2-7);y=cym+dy/dd*(S/2-7);}ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.2;ctx.stroke();}}}
function progBigMap(mp,fs){const n=PRG.coins.length;txt(`LV ${PRG.lvl} · ${rankOf(PRG.lvl)}   ·   Gouden Bommels ${n}/25   ·   Historie ${PRG.hist.length}/${HIST.length}   ·   Prestaties ${PRG.ach.length}/${Object.keys(ACH).length}   ·   Dagbonus: dag ${PRG.streak||1}`,CW/2,CH-22,12,'#c77dff','center','Inter, sans-serif');
  if(PRG.reveal>0&&PRG.revealC>=0){const c=COINS[PRG.revealC];if(c&&!PRG.coins.includes(c.i)){const [x,y]=mp(c.x,c.y);ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.stroke();}}}
function revealCoin(){const o=me();let best=-1,bd=1e9;for(const c of COINS){if(PRG.coins.includes(c.i))continue;const d=Math.hypot(c.x-o.x,c.y-o.y);if(d<bd){bd=d;best=c.i;}}if(best<0)return false;PRG.revealC=best;PRG.reveal=60*90;return true;}
