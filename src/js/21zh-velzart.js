// ====================== Oude Bosscheweg: VelzArt (ICT, nummer 5), Personal Active (sportschool, 15) en de kantoren ernaast ======================
// Nieuwe spelers beginnen voor het pand van VelzArt. De kantoren zijn vierkant met rode baksteen, een witte rand bovenin en een grijs schilddak,
// VelzArt heeft daarbij de ronde glazen hoektoren en de zwarte lichtbak met de naam op het dak.
function obwStyle(){for(const b of BUILDINGS){const id=String(b.oid||'');if(!id.startsWith('obw'))continue;const office=/^obw(5v|7|9|11|13|15)$/.test(id);
    if(office){b.wall='#b45f4f';b.roof='#5b6269';b.ht=office&&id==='obw5v'?44:40;b.flat=false;}else if(['obw1','obw2','obw3'].includes(id)){b.wall='#c9b79a';b.roof='#6f7378';b.ht=24;b.flat=true;}else{b.ht=10;}
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
  _ap(sv);const ov=document.getElementById('areaOv');if(!ov||!WD.obw)return;const box=ov.querySelector('.arBox');if(!box||box.querySelector('.arB.vz'))return;const b=document.createElement('div');b.className='arB vz';b.dataset.k='vz';b.innerHTML='VELZART<small>Oude Bosscheweg 5 · het eilandje</small>';
  b.style.cssText='background:linear-gradient(135deg,#1d3d66,#3c78b5);border-color:#9fd3ff';const zb=box.querySelector('.arB.zb');(zb&&zb.nextSibling?box.insertBefore(b,zb.nextSibling):box.appendChild(b));
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();ov.style.display='none';paused=false;const q=velzSpawn();if(q){if(P.car){P.car.driver=null;P.car=null;}P.x=q[0];P.y=q[1];camX=P.x;camY=P.y;try{populate();}catch(er){}}sfx('reward');});};}
// Personal Active: even trainen
function paNear(){const v=WD.obw&&WD.obw.pa;return v&&!P.car&&!SC.on&&Math.hypot(P.x-v[0],P.y-v[1])<150;}
let PA_CD=0;
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);if(a&&a.k!=='huis')return a;if(paNear())return{k:'gym',t:PA_CD>Date.now()?'🏋️ Personal Active · je bent net getraind, even uitrusten':'🏋️ Trainen bij Personal Active (€5): weer helemaal fit',btn:'🏋️<br>€5',off:PA_CD>Date.now()};return a;};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='gym'){if(a.off)return true;if(P.money<5){noteAdd('TE WEINIG GELD','Een training kost €5','#ff6b6b',150);return true;}addMoney(-5);P.hp=P.maxhp;if(typeof P.st==='number'&&typeof P.maxst==='number')P.st=P.maxst;addXP(25);PA_CD=Date.now()+120000;sfx('reward');buzz([30,30,30]);
    if(typeof buyLog==='function')buyLog('🏋️','Training bij Personal Active',5);noteAdd('GETRAIND!','Een uurtje Personal Active: weer volle health, +25 respect','#7dff6a',220);return true;}return _at.apply(this,arguments);};}
if(typeof ACT_START!=='undefined')ACT_START.add('gym');
{const _wi=wb3Init;wb3Init=function(){_wi();try{obwStyle();}catch(e){console.warn(e);}};}
