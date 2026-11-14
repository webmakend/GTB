// ====================== first-person scènes (panorama om je heen, rondkijken en tikken) ======================
// Albert Heijn, Lidl, Gall & Gall, boven op de oude watertoren en binnen in het Stadskasteel.
const FPV={on:false,sc:null,yaw:0,pitch:0,pano:{},rects:[],t:0,drag:null,once:{}};
const PW=3600,PH=1000;
function fpvBuy(p,fn){if(P.money<p){msg('TE WEINIG GELD','Dat kost €'+p.toFixed(2).replace('.',','),'#ff6b6b',110);sfx('blip');return;}addMoney(-p);sfx('kassa');fn();}
function fpvRob(min,max,h){const v=Math.round(rr(min,max));addMoney(v);addHeat(h);PRG.robs++;PRG.dirty=true;unlock('overval');if(PRG.robs>=5)unlock('overval5');addXP(40);sfx('bell');camHit(8);msg('OVERVAL!',`€${v} uit de kassa. Wegwezen!`,'#ff4d4d',150);setTimeout(()=>{if(FPV.on)fpvExit();},900);}
function heal(n,t){P.hp=Math.min(P.maxhp,P.hp+n);msg(t,'+'+n+' health','#7dff6a',100);}
const SCENES={
  ah:{t:'ALBERT HEIJN',c:'#00a0e2',draw:g=>superPano(g,'#00a0e2','#ffffff','Albert Heijn','#00a0e2'),hs:[
    {a:0,y:.52,l:'🥪 Broodje kaas',p:2,f:()=>heal(20,'BROODJE KAAS')},{a:.85,y:.6,l:'🥔 Chips',p:1.5,f:()=>heal(8,'CHIPS!')},{a:-.85,y:.6,l:'⚡ Energiedrank',p:2,f:()=>{P.boost=60*40;msg('ENERGIEDRANK','40 seconden sneller rennen','#36d1ff',110);}},
    {a:1.75,y:.62,l:'🍺 Krat bier',p:12,f:()=>{P.drunk=Math.min(8,P.drunk+3);P.bladP+=80;msg('HELE KRAT OP?!','Dat gaat hard…','#ffd166',120);}},{a:-1.75,y:.55,l:'💐 Bos bloemen',p:5,f:()=>{addXP(15);msg('VOOR JE MOEDER','Wat lief van je','#ff7ab6',110);}},
    {a:Math.PI,y:.6,l:'🔫 KASSA OVERVALLEN',p:0,rob:1,f:()=>fpvRob(80,220,3.2)}]},
  lidl:{t:'LIDL',c:'#0050aa',draw:g=>superPano(g,'#0050aa','#fff000','Lidl','#e60a14'),hs:[
    {a:0,y:.52,l:'🥐 Croissantjes',p:1,f:()=>heal(14,'CROISSANTJES')},{a:.85,y:.6,l:'🍕 Diepvriespizza',p:2.5,f:()=>heal(30,'PIZZA!')},{a:-.85,y:.6,l:'⚡ Energiedrank',p:1,f:()=>{P.boost=60*40;msg('ENERGIEDRANK','40 seconden sneller rennen','#36d1ff',110);}},
    {a:1.75,y:.62,l:'🍺 Sixpack bier',p:4,f:()=>{P.drunk=Math.min(8,P.drunk+2);P.bladP+=50;msg('SIXPACK!','Proost','#ffd166',100);}},{a:-1.75,y:.55,l:'🛠️ Gereedschapskist',p:15,f:()=>{addXP(20);msg('KLUSJESMAN','Lekker gekocht in de middenpad','#36d1ff',110);}},
    {a:Math.PI,y:.6,l:'🔫 KASSA OVERVALLEN',p:0,rob:1,f:()=>fpvRob(70,200,3.2)}]},
  gall:{t:'GALL & GALL',c:'#7a1c2e',draw:g=>gallPano(g),hs:[
    {a:0,y:.55,l:'🍷 Fles rode wijn',p:8,f:()=>{P.drunk=Math.min(8,P.drunk+2);P.bladP+=40;msg('SANTÉ!','Hele fles achterover','#ff9ec4',110);}},{a:.9,y:.55,l:'🥚 Advocaat',p:9,f:()=>{JOBX.advocaat=true;msg('ADVOCAAT','Oma zal blij zijn','#ffd166',110);}},
    {a:-.9,y:.55,l:'🥃 Whisky',p:25,f:()=>{P.drunk=8;P.bladP+=30;msg('WHISKY…','Alles draait','#ffd166',120);}},{a:Math.PI,y:.6,l:'🔫 KASSA OVERVALLEN',p:0,rob:1,f:()=>fpvRob(60,160,2.6)}]},
  toren:{t:'OUDE WATERTOREN',c:'#ffb36b',draw:g=>torenPano(g),hs:[{a:0,y:.4,l:'🔭 Verrekijker: zoek een Gouden Bommel',p:0,f:()=>{if(revealCoin()){msg('DAAR GLINSTERT IETS!','De dichtstbijzijnde Gouden Bommel staat 90 sec. op je kaart','#ffd34d',190);}else msg('NIETS MEER TE ZIEN','Je hebt alle Gouden Bommels al','#ffd34d',140);}}]},
  kasteel:{t:'STADSKASTEEL ZALTBOMMEL',c:'#f0d58a',draw:g=>kasteelPano(g),hs:[
    {a:0,y:.42,l:'🖼️ Maarten van Rossum',p:0,f:()=>missionBanner('MAARTEN VAN ROSSUM',CASTLE_FACTS[1],'#f0d58a',260)},{a:1.2,y:.42,l:'🖼️ Het huis',p:0,f:()=>missionBanner('HET STADSKASTEEL',CASTLE_FACTS[0],'#f0d58a',260)},
    {a:-1.2,y:.42,l:'🖼️ De zalen',p:0,f:()=>missionBanner('KRUISGEWELVEN',CASTLE_FACTS[2],'#f0d58a',260)},{a:Math.PI,y:.55,l:'⚔️ Zwaard van Maarten',p:0,f:()=>{if(!FPV.once.zwaard){FPV.once.zwaard=1;addXP(40);}msg('NIET AANKOMEN!','De suppoost kijkt je boos aan','#ff6b6b',120);}}]}
};
function panoCanvas(){const c=document.createElement('canvas');c.width=PW;c.height=PH;return c;}
const atA=a=>((a/TAU)%1+1)%1*PW;
function superPano(g0,c1,c2,logo,lc){const c=panoCanvas(),g=c.getContext('2d');
  const wall=g.createLinearGradient(0,0,0,PH);wall.addColorStop(0,'#f2f4f6');wall.addColorStop(.62,'#dfe3e8');wall.addColorStop(.63,'#b9c0c8');wall.addColorStop(1,'#8d959e');g.fillStyle=wall;g.fillRect(0,0,PW,PH);
  for(let x=0;x<PW;x+=90){g.fillStyle='rgba(255,255,255,.9)';g.fillRect(x+10,40,60,8);}// tl-lampen
  g.fillStyle=c1;g.fillRect(0,170,PW,26);
  // schappen met producten
  let rs=7;const rn=()=>((rs=(rs*16807)%2147483647)/2147483647);const cols=['#e53935','#fdd835','#43a047','#1e88e5','#fb8c00','#8e24aa','#ffffff','#6d4c41','#00acc1','#f06292'];
  for(let s=0;s<8;s++){const x0=s*PW/8+40,w=PW/8-80;if(Math.abs(s*PW/8+PW/16-atA(Math.PI))<PW/10)continue;g.fillStyle='#cfd5db';g.fillRect(x0-6,230,w+12,400);
    for(let r=0;r<5;r++){const y=250+r*76;g.fillStyle='#9aa3ad';g.fillRect(x0-6,y+62,w+12,8);let x=x0;while(x<x0+w-14){const pw2=14+rn()*26,ph2=30+rn()*28;g.fillStyle=cols[(rn()*cols.length)|0];g.fillRect(x,y+62-ph2,pw2-3,ph2);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x+2,y+62-ph2+4,pw2-8,5);x+=pw2;}}
    g.fillStyle=c1;g.fillRect(x0,205,w,22);g.fillStyle=c2;g.font='900 18px Inter, sans-serif';g.textAlign='center';g.fillText(['BROOD','CHIPS & SNOEP','ZUIVEL','DRANKEN','DIEPVRIES','GROENTE','HUISHOUDEN','BIER'][s],x0+w/2,222);}
  // kassa achter je
  const kx=atA(Math.PI);g.fillStyle='#37474f';g.fillRect(kx-320,520,640,140);g.fillStyle='#263238';g.fillRect(kx-320,500,640,24);for(let i=-1;i<=1;i++){g.fillStyle='#111';g.fillRect(kx+i*200-30,430,60,70);g.fillStyle='#4caf50';g.fillRect(kx+i*200-24,438,48,30);}
  g.fillStyle=c1;g.fillRect(kx-260,300,520,80);g.fillStyle=c2;g.font='900 46px Inter, sans-serif';g.textAlign='center';g.fillText('KASSA',kx,355);
  // logo boven de ingang
  const lx=atA(0);g.fillStyle=lc;g.fillRect(lx-260,80,520,90);g.fillStyle='#fff';g.font='900 64px Inter, sans-serif';g.fillText(logo,lx,148);
  // vloertegels
  g.strokeStyle='rgba(0,0,0,.08)';for(let x=0;x<PW;x+=60){g.beginPath();g.moveTo(x,630);g.lineTo(x,PH);g.stroke();}for(let y=660;y<PH;y+=50){g.beginPath();g.moveTo(0,y);g.lineTo(PW,y);g.stroke();}
  return c;}
function gallPano(){const c=panoCanvas(),g=c.getContext('2d');const bg=g.createLinearGradient(0,0,0,PH);bg.addColorStop(0,'#2b1a14');bg.addColorStop(.65,'#4a2c1e');bg.addColorStop(.66,'#3a2418');bg.addColorStop(1,'#1d120c');g.fillStyle=bg;g.fillRect(0,0,PW,PH);
  const wc=['#4a0d1a','#6b1426','#2e5a1c','#d7c37a','#7a3e12','#1a1a1a'];for(let s=0;s<10;s++){const x0=s*PW/10+30,w=PW/10-60;if(Math.abs(x0+w/2-atA(Math.PI))<PW/12)continue;g.fillStyle='#6d4c33';g.fillRect(x0-8,200,w+16,440);
    for(let r=0;r<6;r++){const y=215+r*70;g.fillStyle='#3e2a1c';g.fillRect(x0-8,y+58,w+16,6);for(let x=x0;x<x0+w-10;x+=16){g.fillStyle=wc[(x*7+r*3+s)%wc.length];g.fillRect(x,y+8,10,50);g.fillRect(x+3,y,4,10);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x+2,y+14,2,30);g.fillStyle='#f3e9d2';g.fillRect(x+1,y+30,8,10);}}}
  const kx=atA(Math.PI);g.fillStyle='#3e2a1c';g.fillRect(kx-260,520,520,140);g.fillStyle='#7a1c2e';g.fillRect(kx-220,300,440,80);g.fillStyle='#fff';g.font='900 46px Inter, sans-serif';g.textAlign='center';g.fillText('KASSA',kx,355);
  const lx=atA(0);g.fillStyle='#7a1c2e';g.fillRect(lx-250,70,500,90);g.fillStyle='#fff';g.font='italic 900 60px Inter, sans-serif';g.fillText('Gall & Gall',lx,135);
  for(let x=0;x<PW;x+=110){const gr=g.createRadialGradient(x,40,2,x,40,90);gr.addColorStop(0,'rgba(255,214,150,.6)');gr.addColorStop(1,'rgba(255,214,150,0)');g.fillStyle=gr;g.fillRect(x-90,0,180,140);}return c;}
function torenPano(){const c=panoCanvas(),g=c.getContext('2d');const sky=g.createLinearGradient(0,0,0,PH*.62);sky.addColorStop(0,'#3a2a6b');sky.addColorStop(.5,'#e3769a');sky.addColorStop(1,'#ffc988');g.fillStyle=sky;g.fillRect(0,0,PW,PH);
  const sx=atA(-.6);const sun=g.createRadialGradient(sx,520,10,sx,520,260);sun.addColorStop(0,'rgba(255,240,200,1)');sun.addColorStop(.15,'rgba(255,210,140,.9)');sun.addColorStop(1,'rgba(255,170,120,0)');g.fillStyle=sun;g.fillRect(sx-260,260,520,520);
  // Waal (noord) en uiterwaarden
  g.fillStyle='#6d8f5a';g.fillRect(0,600,PW,PH);const wx=atA(.4);g.fillStyle='#8fb6d6';g.beginPath();g.moveTo(wx-1300,610);g.quadraticCurveTo(wx,580,wx+1300,610);g.lineTo(wx+1500,700);g.quadraticCurveTo(wx,660,wx-1500,700);g.closePath();g.fill();
  // brug (A2) met pylonen
  const bx=atA(.75);g.strokeStyle='#efe6d4';g.lineWidth=10;g.beginPath();g.moveTo(bx-700,640);g.lineTo(bx+600,560);g.stroke();for(const o of [-250,200]){g.fillStyle='#efe6d4';g.fillRect(bx+o-8,380,16,240);g.lineWidth=2;for(let i=-5;i<=5;i++){g.beginPath();g.moveTo(bx+o,385);g.lineTo(bx+o+i*45,600-(o+i*45)*.06);g.stroke();}}
  // vesting met kerktoren (zuidwest)
  const kx=atA(Math.PI+.3);let rs=3;const rn=()=>((rs=(rs*16807)%2147483647)/2147483647);for(let i=0;i<70;i++){const x=kx-900+i*26,h=30+rn()*50;g.fillStyle=['#7a3e2e','#5d4037','#6d4c41','#8d5a44'][i%4];g.fillRect(x,620-h,24,h);g.fillStyle='#3b2f2a';g.beginPath();g.moveTo(x-2,620-h);g.lineTo(x+12,600-h);g.lineTo(x+26,620-h);g.fill();}
  g.fillStyle='#5b4a3a';g.fillRect(kx-40,330,80,290);g.fillRect(kx-28,270,56,70);g.beginPath();g.moveTo(kx-30,272);g.lineTo(kx,210);g.lineTo(kx+30,272);g.fill();g.fillStyle='#2a221c';for(let i=0;i<3;i++)g.fillRect(kx-10,380+i*60,20,36);
  // borstwering van de toren (voorgrond)
  g.fillStyle='#7e3d28';g.fillRect(0,820,PW,PH-820);for(let x=0;x<PW;x+=120){g.fillStyle='#6a3322';g.fillRect(x,760,70,70);}g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,820,PW,10);return c;}
function kasteelPano(){const c=panoCanvas(),g=c.getContext('2d');g.fillStyle='#8c8072';g.fillRect(0,0,PW,PH);
  for(let y=0;y<PH;y+=40)for(let x=(y/40)%2*45;x<PW;x+=90){g.fillStyle=`rgba(0,0,0,${.05+((x*y)%7)/100})`;g.fillRect(x,y,88,38);}
  g.fillStyle='#5d4a3a';g.fillRect(0,0,PW,90);for(let x=0;x<PW;x+=300){g.strokeStyle='#4a3a2c';g.lineWidth=14;g.beginPath();g.arc(x+150,90,150,Math.PI,0);g.stroke();}
  g.fillStyle='#6b4a2e';g.fillRect(0,700,PW,PH-700);for(let x=0;x<PW;x+=80){g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,700,4,PH);}
  const frame=(a,title,col)=>{const x=atA(a);g.fillStyle='#c9a227';g.fillRect(x-150,200,300,360);g.fillStyle='#3b2a1e';g.fillRect(x-130,220,260,320);const bg=g.createLinearGradient(0,220,0,540);bg.addColorStop(0,col);bg.addColorStop(1,'#1d140e');g.fillStyle=bg;g.fillRect(x-126,224,252,312);
    g.fillStyle='#e0b48a';g.beginPath();g.ellipse(x,330,40,52,0,0,TAU);g.fill();g.fillStyle='#2a1d14';g.beginPath();g.ellipse(x,300,46,26,0,Math.PI,0);g.fill();g.fillStyle='#1a1a1a';g.fillRect(x-80,385,160,150);g.fillStyle='#d8d8d8';g.fillRect(x-60,385,120,18);
    g.fillStyle='#f0d58a';g.font='700 22px Georgia, serif';g.textAlign='center';g.fillText(title,x,590);};
  frame(0,'Maarten van Rossum','#5a3d2a');frame(1.2,'Bommel, 1535','#2e4a5a');frame(-1.2,'De Veldheer','#4a2e2e');
  const ax=atA(Math.PI);g.fillStyle='#9e9e9e';g.fillRect(ax-30,300,60,200);g.beginPath();g.arc(ax,280,34,0,TAU);g.fill();g.fillStyle='#616161';g.fillRect(ax-12,268,24,6);g.strokeStyle='#cfd8dc';g.lineWidth=8;g.beginPath();g.moveTo(ax+70,250);g.lineTo(ax+70,560);g.stroke();g.fillStyle='#c9a227';g.fillRect(ax+50,300,40,10);
  for(const a of [.6,-.6,2.1,-2.1]){const x=atA(a);g.fillStyle='#7a1c1c';g.fillRect(x-70,120,140,420);g.fillStyle='#c9a227';for(let i=0;i<5;i++)g.fillRect(x-60,150+i*80,120,6);}
  return c;}
function fpvEnter(id){const sc=SCENES[id];if(!sc)return;FPV.on=true;FPV.sc=id;FPV.yaw=0;FPV.pitch=0;FPV.t=0;if(!FPV.pano[id])FPV.pano[id]=sc.draw();bigMap=false;
  document.getElementById('touch').style.display='none';document.getElementById('topBtns').style.display='none';document.getElementById('lightc').style.display='none';GL.shown=false;fpvExitBtn(true);sfx('door');
  if(id==='toren'){unlock('uitzicht');if(!FPV.once.toren){FPV.once.toren=1;addXP(30);}}if(id==='kasteel')unlock('kasteel');}
function fpvExit(){FPV.on=false;fpvExitBtn(false);if(IS_TOUCH)document.getElementById('touch').style.display='block';document.getElementById('topBtns').style.display='flex';sfx('door');}
function fpvExitBtn(show){let b=document.getElementById('fpvExit');if(!b){b=document.createElement('div');b.id='fpvExit';b.textContent='⟵ NAAR BUITEN';b.style.cssText='position:fixed;z-index:40;left:calc(var(--sl) + 14px);top:calc(var(--st) + 14px);padding:10px 16px;border-radius:12px;background:rgba(10,4,24,.75);border:2px solid #ffd166;color:#fff;font:800 14px Inter,sans-serif;letter-spacing:1px;cursor:pointer;pointer-events:auto';b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fpvExit();});document.body.appendChild(b);}b.style.display=show?'block':'none';}
function fpvActivate(h){if(h.rob)h.f();else if(h.p>0)fpvBuy(h.p,h.f);else{sfx('blip');h.f();}}
function fpvStep(){FPV.t++;frameN++;const k=keys;if(k.ArrowLeft||k.KeyA)FPV.yaw-=.035;if(k.ArrowRight||k.KeyD)FPV.yaw+=.035;if(k.ArrowUp||k.KeyW)FPV.pitch=Math.min(CH*.2,FPV.pitch+6);if(k.ArrowDown||k.KeyS)FPV.pitch=Math.max(-CH*.2,FPV.pitch-6);
  if(pressed.KeyE||pressed.Escape){for(const kk in pressed)delete pressed[kk];fpvExit();return;}
  if(pressed.Enter||pressed.Space){const sc=SCENES[FPV.sc];let best=null,bd=.3;for(const h of sc.hs){const d=Math.abs(wrap(h.a-FPV.yaw));if(d<bd){bd=d;best=h;}}if(best)fpvActivate(best);}
  for(const kk in pressed)delete pressed[kk];
  for(const m of msgs)m.life--;while(msgs.length&&msgs[0].life<=0)msgs.shift();}
function drawFpv(){const g=fctx;g.setTransform(DPR,0,0,DPR,0,0);const sc=SCENES[FPV.sc],pano=FPV.pano[FPV.sc],k=CH*1.12/PH,Wk=PW*k,ppr=Wk/TAU,top=(CH-PH*k)/2+FPV.pitch;
  g.fillStyle='#000';g.fillRect(0,0,CW,CH);const off=((FPV.yaw/TAU*Wk)%Wk+Wk)%Wk;let x0=CW/2-off;while(x0>0)x0-=Wk;for(let x=x0;x<CW;x+=Wk)g.drawImage(pano,x,top,Wk,PH*k);
  const vg=g.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.4,CW/2,CH/2,Math.max(CW,CH)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,CW,CH);
  FPV.rects=[];ctx=fctx;
  for(const h of sc.hs){const dx=wrap(h.a-FPV.yaw)*ppr;if(Math.abs(dx)>CW/2+140)continue;const x=CW/2+dx,y=top+h.y*PH*k,lab=h.l+(h.p>0?'  €'+h.p.toFixed(2).replace('.',','):'');g.font='800 15px Inter, sans-serif';const w=g.measureText(lab).width+28,cen=Math.abs(dx)<ppr*.3,pu=cen?1+.04*Math.sin(FPV.t*.2):1;
    g.save();g.translate(x,y);g.scale(pu,pu);g.fillStyle=h.rob?'rgba(140,10,20,.9)':'rgba(10,4,24,.82)';rrect(g,-w/2,-19,w,38,19);g.fill();g.strokeStyle=h.rob?'#ff4d4d':sc.c;g.lineWidth=cen?3:1.5;rrect(g,-w/2,-19,w,38,19);g.stroke();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(lab,0,1);g.restore();FPV.rects.push({x:x-w/2,y:y-19,w,h:38,h2:h});}
  const tf=clamp(CW/16,20,32);txt(sc.t,CW/2,CH-110-tf,tf,sc.c,'center');txt(IS_TOUCH?'Sleep om rond te kijken · tik op iets om het te kopen':'Pijltjes of muis slepen om rond te kijken · Enter = kopen · E = naar buiten',CW/2,CH-100,12,'rgba(255,255,255,.85)','center','Inter, sans-serif');
  txt('€ '+P.money.toFixed(2).replace('.',',')+'   ·   ♥ '+Math.round(P.hp),CW/2,CH-46,16,'#7dff6a','center','Inter, sans-serif');
  msgs.forEach(m=>{const a=clamp(Math.min(m.life/25,(m.ml-m.life)/8+.2),0,1);g.globalAlpha=a;txt(m.t,CW/2,CH*.68,Math.min(40,CW*.09),m.col,'center');if(m.sub)txt(m.sub,CW/2,CH*.68+Math.min(40,CW*.09)+6,14,'#fff','center','Inter, sans-serif');g.globalAlpha=1;});
  drawMissionBanner();ctx=wctx;}
(function fpvInput(){cv.addEventListener('pointerdown',e=>{if(!FPV.on)return;FPV.drag={x:e.clientX,y:e.clientY,yaw:FPV.yaw,pitch:FPV.pitch,m:0};});
  window.addEventListener('pointermove',e=>{const d=FPV.drag;if(!FPV.on||!d)return;d.m=Math.max(d.m,Math.hypot(e.clientX-d.x,e.clientY-d.y));FPV.yaw=d.yaw-(e.clientX-d.x)*.006;FPV.pitch=clamp(d.pitch+(e.clientY-d.y)*.8,-CH*.2,CH*.2);});
  window.addEventListener('pointerup',e=>{const d=FPV.drag;FPV.drag=null;if(!FPV.on||!d||d.m>10)return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(const q of FPV.rects)if(x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h){fpvActivate(q.h2);break;}});})();
