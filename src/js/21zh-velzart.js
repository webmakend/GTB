// ====================== Oude Bosscheweg: VelzArt (ICT, nummer 5), Personal Active (sportschool, 15) en de kantoren ernaast ======================
// Nieuwe spelers beginnen voor het pand van VelzArt. De kantoren zijn vierkant met rode baksteen, een witte rand bovenin en een grijs schilddak,
// VelzArt heeft daarbij de ronde glazen hoektoren en de zwarte lichtbak met de naam op het dak.
function obwStyle(){for(const b of BUILDINGS){const id=String(b.oid||'');if(!id.startsWith('obw'))continue;const office=/^obw(5v|7|9|11|13|15)$/.test(id);
    if(office){b.wall='#b45f4f';b.roof='#5b6269';b.ht=office&&id==='obw5v'?44:40;b.flat=false;}else if(id==='obw6'){b.wall='#d9dee3';b.roof='#8fb8d6';b.ht=30;b.flat=true;b.pool=1;}else if(['obw1','obw2','obw3','obw20'].includes(id)){b.wall='#c9b79a';b.roof='#6f7378';b.ht=24;b.flat=true;}else{b.ht=10;}
    b.fac=null;b.wN=shade(b.wall,.62);b.wS=shade(b.wall,.98);b.wW=shade(b.wall,.78);b.wE=shade(b.wall,.88);b.roofD=shade(b.roof,.78);b.roofL=shade(b.roof,1.12);if(id==='obw5v')b.velz=1;}}
function drawVelz(b,r,rcx,rcy){b.sign=null;const P2=b.p;// glazen hoektoren op de ronde kant
  const k=Math.min(4,P2.length-1),gx=(P2[k][0]+P2[k+1>=P2.length?0:k+1][0])/2,gy=(P2[k][1]+P2[k+1>=P2.length?0:k+1][1])/2,f=Math.min(b.ht,180)*.0022,tx=gx+(gx-CAM.x)*f*.85,ty=gy+(gy-CAM.y)*f*.85;
  ctx.save();const gr=ctx.createRadialGradient(tx-6,ty-6,2,tx,ty,26);gr.addColorStop(0,'#9fd3ff');gr.addColorStop(.5,'#3c78b5');gr.addColorStop(1,'#1d3d66');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(tx,ty,24,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.2;for(let a=0;a<TAU;a+=TAU/10){ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(a)*24,ty+Math.sin(a)*24);ctx.stroke();}ctx.strokeStyle='#d8dde3';ctx.lineWidth=3;ctx.beginPath();ctx.arc(tx,ty,24,0,TAU);ctx.stroke();
  // lichtbak met de naam op het dak
  const w=96,h=26;ctx.fillStyle='rgba(0,0,0,.35)';rrect(ctx,rcx-w/2+3,rcy-h/2+4,w,h,4);ctx.fill();ctx.fillStyle='#0d0f14';rrect(ctx,rcx-w/2,rcy-h/2,w,h,4);ctx.fill();ctx.strokeStyle='#2a2f38';ctx.lineWidth=1.5;ctx.stroke();
  ctx.font='900 17px Inter, Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.shadowColor='rgba(255,255,255,.6)';ctx.shadowBlur=6;ctx.fillText('VelzArt',rcx,rcy+1);ctx.shadowBlur=0;
  ctx.restore();}
// startplek voor nieuwe spelers: op straat voor VelzArt
function velzSpawn(){const v=WD.obw&&WD.obw.velz;if(!v)return null;let best=null,bd=1e9;for(let a=0;a<24;a++)for(let d=40;d<260;d+=8){const x=v[0]+Math.cos(a/24*TAU)*d,y=v[1]+Math.sin(a/24*TAU)*d,c=cellAt(x,y);if(c===WALK||c===PLAZA){if(d<bd){bd=d;best=[x,y];}break;}}return best||snap(v[0],v[1]-120);}
{const _ap=areaPick;areaPick=function(sv){if(!sv){const q=velzSpawn();if(q){if(P.car){P.car.driver=null;P.car=null;}P.x=q[0];P.y=q[1];camX=P.x;camY=P.y;try{populate();}catch(e){}
      setTimeout(()=>{missionBanner('WELKOM BIJ VELZART','Oude Bosscheweg 5, Zaltbommel · hier begint je avontuur','#36d1ff',300);if(typeof voiceSay==='function')voiceSay('Welkom bij VelzArt. Loop de Oude Bosscheweg af naar de Boschstraat en de vesting.');},600);return;}}
  _ap(sv);};}
// Personal Active: even trainen
function paNear(){const v=WD.obw&&WD.obw.pa;return v&&!P.car&&!SC.on&&Math.hypot(P.x-v[0],P.y-v[1])<150;}
let PA_CD=0;
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);if(a&&a.k!=='huis')return a;if(paNear())return{k:'gym',t:PA_CD>Date.now()?'🏋️ Personal Active · je bent net getraind, even uitrusten':'🏋️ Trainen bij Personal Active (€5): weer helemaal fit',btn:'🏋️<br>€5',off:PA_CD>Date.now()};return a;};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='gym'){if(a.off)return true;if(P.money<5){noteAdd('TE WEINIG GELD','Een training kost €5','#ff6b6b',150);return true;}addMoney(-5);P.hp=P.maxhp;if(typeof P.st==='number'&&typeof P.maxst==='number')P.st=P.maxst;addXP(25);PA_CD=Date.now()+120000;sfx('reward');buzz([30,30,30]);
    if(typeof buyLog==='function')buyLog('🏋️','Training bij Personal Active',5);noteAdd('GETRAIND!','Een uurtje Personal Active: weer volle health, +25 respect','#7dff6a',220);return true;}return _at.apply(this,arguments);};}
if(typeof ACT_START!=='undefined')ACT_START.add('gym');
{const _wi=wb3Init;wb3Init=function(){_wi();try{obwStyle();}catch(e){console.warn(e);}};}

// ---- geparkeerde auto's op de grote parkeerplaats van het zwembad (Oude Bosscheweg 6)
{const _po=populate;populate=function(){_po();const o=WD.obw;if(!o||!o.poolP||cars.some(c=>c.poolPark))return;let sd=606;const rn=()=>((sd=(sd*16807)%2147483647)/2147483647);
  const pk=WD.parking.find(q=>pip(o.poolP[0],o.poolP[1],q));if(!pk)return;const bb=bbox(pk);let ang=0,best=0;for(let i=0;i<pk.length-1;i++){const l=Math.hypot(pk[i+1][0]-pk[i][0],pk[i+1][1]-pk[i][1]);if(l>best){best=l;ang=Math.atan2(pk[i+1][1]-pk[i][1],pk[i+1][0]-pk[i][0]);}}
  const ca=Math.cos(ang),sa=Math.sin(ang),types=['sedan','hatch'].filter(t=>CT[t]);let n=0;
  for(let v=-200;v<=200;v+=58)for(let u=-260;u<=260;u+=24){const x=o.poolP[0]+u*ca-v*sa,y=o.poolP[1]+u*sa+v*ca;if(!pip(x,y,pk)||rn()<.3)continue;if(cars.some(c=>Math.hypot(c.x-x,c.y-y)<22))continue;
    const c=makeCar(types[(rn()*types.length)|0],x,y,ang+Math.PI/2+(Math.floor(v/58)%2?Math.PI:0),null);c.keep=1;c.poolPark=1;cars.push(c);if(++n>=22)return;}};}
// ---- VelzArt: naar binnen in de kantine
function velzNear(){const v=WD.obw&&WD.obw.velz;return v&&!P.car&&!SC.on&&Math.hypot(P.x-v[0],P.y-v[1])<140;}
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);if(a&&a.k!=='huis'&&a.k!=='gym')return a;if(velzNear())return{k:'velz',t:'💻 Naar binnen bij VelzArt (kantine)',btn:'💻<br>BINNEN',b:BUILDINGS.find(q=>q.velz)};return a;};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='velz'){scEnter('velzart');return true;}return _at.apply(this,arguments);};}
if(typeof ACT_START!=='undefined')ACT_START.add('velz');if(typeof HILITE_K!=='undefined')HILITE_K.add('velz');
ROOMS.velzart={name:'VELZART · KANTINE',hint:'Pak een koffie aan de bar of plof op de bank',music:0,spawn:[7.5,8.4,-Math.PI/2],floor:'parquet',ceil:0xff1c1c1e,tint:0,
  map:['EEEE1234EEEEEE','E............G','E..KKKKKKKK..G','E............G','E............G','P............G','P............G','P............E','P............E','EEEEEEDDEEEEEE'],
  h:{E:3,G:3,P:3,D:3,'1':3,'2':3,'3':3,'4':3,K:1.05}};
function velzTex(T){const mk=mkTex;
  T.E=mk(64,64,(g,w,h)=>{g.fillStyle='#17181b';g.fillRect(0,0,w,h);g.fillStyle='#232428';g.fillRect(0,40,w,3);g.fillStyle='#2b2c31';for(let x=0;x<w;x+=16)g.fillRect(x,0,1,40);g.fillStyle='#e9e5de';g.fillRect(0,52,w,12);});
  // achterwand van de bar met planken, flessen, glazen en het neon-logo over vier vakken
  const back=document.createElement('canvas');back.width=256;back.height=64;const b=back.getContext('2d');b.fillStyle='#141518';b.fillRect(0,0,256,64);b.fillStyle='#2c2d31';b.fillRect(0,8,256,2);b.fillRect(0,34,256,2);
  for(let x=6;x<120;x+=7){b.fillStyle=['#5b2a14','#2f5a2a','#c9a227','#7a1e2a','#d8d2c4'][(x/7|0)%5];b.fillRect(x,22,4,12);b.fillRect(x+1,18,2,4);}for(let x=150;x<250;x+=6){b.fillStyle='rgba(220,230,240,.55)';b.fillRect(x,26,4,8);}
  b.fillStyle='#e9e5de';b.fillRect(0,52,256,12);
  b.save();b.font='italic 400 30px Inter, Arial, sans-serif';b.textAlign='center';b.textBaseline='middle';b.shadowColor='#bfffef';b.shadowBlur=10;b.fillStyle='#f4fffb';b.fillText('VelzArt',128,17);b.shadowBlur=6;b.font='600 9px Inter, sans-serif';b.fillText('Het antwoord op ICT',128,38);
  b.shadowColor='#39ff88';b.shadowBlur=8;b.fillStyle='#7dffb0';b.fillRect(38,15,22,3);b.restore();
  ['1','2','3','4'].forEach((k,i)=>{T[k]=mk(64,64,(g)=>{g.drawImage(back,i*64,0,64,64,0,0,64,64);});});
  T.G=mk(64,64,(g,w,h)=>{g.fillStyle='#24382f';g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(170,220,200,.35)');gr.addColorStop(1,'rgba(40,70,60,.2)');g.fillStyle=gr;g.fillRect(2,0,60,h);g.fillStyle='#111';g.fillRect(0,0,2,h);g.fillRect(62,0,2,h);g.fillRect(0,0,w,3);
    g.save();g.translate(40,10);g.rotate(Math.PI/2);g.fillStyle='rgba(255,255,255,.85)';g.font='900 10px Inter';g.fillText('GREEN',0,0);g.restore();});
  T.P=mk(64,64,(g,w,h)=>{g.fillStyle='#8a8578';g.fillRect(0,0,w,h);for(let i=0;i<26;i++){const x=(i*37)%64,y=(i*23)%52,r=4+(i%4)*2;g.fillStyle=['#c9a35a','#5f7d6a','#d8cfc0','#8c5a3c','#3f4f5f'][i%5];g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.strokeStyle='rgba(30,30,30,.4)';g.lineWidth=1;g.beginPath();g.arc(x,y,r*.6,0,TAU);g.stroke();}g.fillStyle='#e9e5de';g.fillRect(0,52,w,12);});
  T.K=mk(64,64,(g,w,h)=>{g.fillStyle='#3a3b3e';g.fillRect(0,0,w,h);g.strokeStyle='rgba(220,220,220,.35)';g.lineWidth=1;for(let i=0;i<7;i++){g.beginPath();g.moveTo((i*19)%64,0);g.bezierCurveTo(20+i*5,20,40-i*3,40,(i*29)%64,64);g.stroke();}g.fillStyle='#c79a63';g.fillRect(0,0,w,6);});
  T.topK=mk(32,32,(g,w,h)=>{g.fillStyle='#d2a56e';g.fillRect(0,0,w,h);g.fillStyle='rgba(120,70,30,.18)';for(let y=0;y<h;y+=3)g.fillRect(0,y,w,1);});
  T.D=mk(64,64,(g,w,h)=>{g.fillStyle='#17181b';g.fillRect(0,0,w,h);g.fillStyle='#2a2b2f';g.fillRect(10,4,44,60);g.fillStyle='rgba(150,190,210,.35)';g.fillRect(14,8,36,52);g.fillStyle='#ccc';g.fillRect(44,32,3,8);});
  T['#']=T.E;return T;}
function velzSprites(S){if(S.ystool)return;const mk=mkTex;
  S.ystool=mk(32,64,(g)=>{g.fillStyle='#d9a21b';g.fillRect(4,0,24,9);g.fillStyle='#b98510';g.fillRect(4,7,24,3);g.strokeStyle='#111';g.lineWidth=2.4;for(const [a,b2] of [[7,2],[25,30],[12,10],[20,22]]){g.beginPath();g.moveTo(a,10);g.lineTo(b2,64);g.stroke();}g.lineWidth=1.6;g.beginPath();g.moveTo(5,44);g.lineTo(27,44);g.stroke();});
  S.bank=S.bank||mk(64,40,(g)=>{g.fillStyle='#4a4a52';g.fillRect(2,6,60,20);g.fillRect(0,18,64,14);g.fillStyle='#5a5a63';g.fillRect(6,10,25,10);g.fillRect(33,10,25,10);g.fillStyle='#222';g.fillRect(0,32,6,8);g.fillRect(58,32,6,8);});
  S.velzBank=mk(64,40,(g)=>{g.fillStyle='#45464d';g.fillRect(0,4,64,22);g.fillRect(0,18,64,16);g.fillStyle='#55565e';g.fillRect(4,8,18,12);g.fillRect(23,8,18,12);g.fillRect(42,8,18,12);g.fillStyle='#111';g.fillRect(2,34,4,6);g.fillRect(58,34,4,6);});
  S.fauteuil=mk(40,48,(g)=>{g.fillStyle='#c48a2c';g.fillRect(6,0,28,30);g.fillRect(2,24,36,12);g.fillStyle='#a8731f';g.fillRect(4,22,32,3);g.strokeStyle='#222';g.lineWidth=2;g.beginPath();g.moveTo(6,36);g.lineTo(4,48);g.moveTo(34,36);g.lineTo(36,48);g.stroke();});
  S.tafeltje=mk(48,24,(g)=>{g.fillStyle='#2a2a2c';g.beginPath();g.ellipse(24,5,23,5,0,0,TAU);g.fill();g.strokeStyle='#1a1a1a';g.lineWidth=2;g.beginPath();g.moveTo(6,8);g.lineTo(8,24);g.moveTo(42,8);g.lineTo(40,24);g.moveTo(24,10);g.lineTo(24,24);g.stroke();g.fillStyle='#7a8f5a';g.beginPath();g.arc(24,1,4,0,TAU);g.fill();});
  S.dart=mk(32,32,(g)=>{const c=[['#111',15],['#e9e0c8',13],['#c62828',11],['#111',9],['#2e7d32',6],['#c62828',2]];for(const [col,r] of c){g.fillStyle=col;g.beginPath();g.arc(16,16,r,0,TAU);g.fill();}g.fillStyle='rgba(255,220,140,.25)';g.beginPath();g.arc(16,16,16,0,TAU);g.fill();});
  S.velzMan=mk(32,80,(g)=>{g.fillStyle='#4a6b9a';g.fillRect(10,52,5,28);g.fillRect(17,52,5,28);g.fillStyle='#1f2638';g.fillRect(7,22,18,32);g.fillRect(4,24,4,22);g.fillRect(24,24,4,22);g.fillStyle='#e0b48f';g.beginPath();g.arc(16,13,8,0,6.3);g.fill();g.fillStyle='#4a3524';g.beginPath();g.arc(16,9,8,3.1,6.3);g.fill();g.fillStyle='#fff';g.fillRect(13,22,6,3);});}
function velzObjs(){const o=[];for(let x=3.5;x<=10.5;x+=1.15)o.push({x,z:3.55,y:0,h:.82,w:.4,s:'ystool'});o.push({x:6.2,z:3.95,y:0,h:1.75,w:.62,s:'velzMan'});
  o.push({x:2.2,z:7,y:0,h:.85,w:2.4,s:'velzBank'},{x:4.6,z:6.2,y:0,h:1.0,w:.8,s:'fauteuil'},{x:3.5,z:7,y:0,h:.42,w:.9,s:'tafeltje'},{x:0.7,z:6.5,y:1.35,h:.55,w:.55,s:'dart'},{x:12.3,z:7.6,y:0,h:1.2,w:.6,s:'plant'},{x:1.4,z:1.6,y:0,h:1.2,w:.6,s:'plant'});
  for(const [x,z] of [[4,2],[9,2],[4,6],[10,6]])o.push({x,z,y:2.75,h:.2,w:.8,s:'tl',lamp:1});return o;}
{const _se=scEnter;scEnter=function(room){if(room==='velzart'){const R=ROOMS.velzart;if(!R.tex)R.tex=velzTex(scTex());if(!SCSPR)SCSPR=scSprites();velzSprites(SCSPR);if(!R.objs)R.objs=velzObjs();}_se(room);};}
