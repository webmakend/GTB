// ====================== missies (kerk, Kruidvat, strand + insmeer-minigame) ======================
const MIS={on:false,done:false,stage:1,x:0,y:0,inside:0,gold:false,ann:0,girl:null,cool:0};
const MIS_TXT={1:'MISSIE 1: bezoek de Sint-Maartenskerk',2:'MISSIE 2: koop zonnebrand bij de Kruidvat',3:'MISSIE 2: smeer de meid op het strand in'};
function churchDoor(){const gk=BUILDINGS.find(b=>b.n==='Grote of Sint-Maartenskerk');if(!gk)return null;const x0=gk.bb[0],ys=gk.p.filter(q=>q[0]<x0+150).map(q=>q[1]),cy=(Math.min(...ys)+Math.max(...ys))/2;return snap(x0-34,cy);}
function kruidvatDoor(){const l=LANDMARKS.find(l=>l.n==='Kruidvat');if(!l)return null;const b=BUILDINGS.find(b=>b.sign==='Kruidvat');let x=l.x,y=l.y;if(b&&b.sa!=null){}const s0=snap(x,y);return s0;}
function pickGirl(){if(!BEACHERS.length)return null;const cx=(BEACH.bb[0]+BEACH.bb[2])/2,cy=(BEACH.bb[1]+BEACH.bb[3])/2;let best=null,bd=1e18;for(const b of BEACHERS){const d=Math.hypot(b.x-cx,b.y-cy);if(d<bd){bd=d;best=b;}}
  if(best){best.special=1;best.sit=false;best.umb=null;best.suit='#ff2e88';best.towel='#ffd166';best.hair='#7a3e12';}return best;}
function setStage(st){MIS.stage=st;MIS.inside=0;let d=null;if(st===1)d=churchDoor();else if(st===2)d=kruidvatDoor();else if(st===3){if(!MIS.girl)MIS.girl=pickGirl();if(MIS.girl)d=[MIS.girl.x,MIS.girl.y];}
  if(d){MIS.x=d[0];MIS.y=d[1];MIS.on=true;}else if(st<3)setStage(st+1);else{MIS.done=true;}}
function initMission(){MIS.done=false;MIS.gold=false;MIS.girl=null;MIS.cool=0;MIS.ann=0;MIS.on=true;setStage(1);}
function missionStep(){if(!MIS.on||MIS.done||P.dead)return;if(MIS.ann>0&&--MIS.ann===0)msg('MISSIE 2','Koop zonnebrand bij de Kruidvat (Boschstraat) en ga naar het strand','#ffd166',260);
  if(MIS.cool>0)MIS.cool--;
  if(MIS.stage===1){if(MIS.inside>0){if(--MIS.inside===0){P.hp=P.maxhp;heat=0;stars=0;MIS.gold=true;sfx('reward');addMoney(20);
        msg('MISSIE GESLAAGD!','Beloning: €20 + gouden waterballonnen','#ffd166',260);setStage(2);MIS.ann=270;}return;}
    if(!P.car&&Math.hypot(P.x-MIS.x,P.y-MIS.y)<34){MIS.inside=230;sfx('organ');setTimeout(()=>sfx('bellc'),400);msg('SINT-MAARTENSKERK','Je stapt binnen… stilte, orgelmuziek en 600 jaar geschiedenis','#ffe8b0',220);}}
  else if(MIS.stage===2){if(!P.car&&Math.hypot(P.x-MIS.x,P.y-MIS.y)<38){if(P.money<8.99){if(!MIS.cool){msg('TE WEINIG GELD','Zonnebrand kost €8,99','#ff6b6b',140);MIS.cool=200;}return;}
      addMoney(-8.99);sfx('kassa');MIS.lotion=true;msg('ZONNEBRAND GEKOCHT','Factor 30 · nu snel naar het strand aan de Waal','#ffd166',220);setStage(3);}}
  else if(MIS.stage===3){const g=MIS.girl;if(!g||!BEACHERS.includes(g)){MIS.girl=null;setStage(3);return;}MIS.x=g.x;MIS.y=g.y;const d=Math.hypot(P.x-g.x,P.y-g.y);
    if(d<170&&d>60&&!g.asked){g.asked=1;bubbles=bubbles.filter(q=>q.p!==g);bubbles.push({p:g,t:'Kun jij mijn rug even insmeren?',life:220});sfx('blip',480);}
    if(d>140)g.asked=0;
    if(!P.car&&d<40&&!MIS.cool)mgStart(g);}}
function drawMission(Z){if(!MIS.on||MIS.done)return;const pu=1+.25*Math.sin(frameN*.12);ctx.save();ctx.globalCompositeOperation='lighter';glow(MIS.x,MIS.y,46*pu,'rgba(255,209,102,.55)');ctx.restore();
  ctx.strokeStyle='#ffd166';ctx.lineWidth=3/Math.max(.6,Z);ctx.beginPath();ctx.arc(MIS.x,MIS.y,22*pu,0,TAU);ctx.stroke();const by=MIS.y-34-6*Math.sin(frameN*.1);ctx.fillStyle='#ffd166';ctx.beginPath();ctx.moveTo(MIS.x,by+14);ctx.lineTo(MIS.x-10,by);ctx.lineTo(MIS.x+10,by);ctx.closePath();ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();}
// ---------- minigame: rug insmeren ----------
const MG={on:false,g:null,t:0,T:840,hy:0,py:0,cov:null,res:'',rt:0,N:22,hearts:[]};
function mgBox(){const top=Math.max(CH*.3,uiTop().bottom+150),bot=CH-110,w=Math.min(CW*.6,300,(bot-top)*.62);return{w,top,bot,cx:CW/2};}
function mgStart(g){MG.on=true;MG.g=g;MG.t=0;MG.res='';MG.rt=0;MG.cov=new Float32Array(MG.N);const B=mgBox();MG.hy=MG.py=(B.top+B.bot)/2;bigMap=false;document.getElementById('touch').style.display='none';sfx('blip',500);}
function mgEnd(){MG.on=false;if(IS_TOUCH)document.getElementById('touch').style.display='block';}
function mgStep(){frameN++;const B=mgBox();if(MG.res){if(--MG.rt<=0){const kiss=MG.res==='kiss';mgEnd();if(kiss){MIS.done=true;msg('MISSIE 2 GESLAAGD!','Ze is ingesmeerd én je kreeg een kus 💋','#ff7ab6',260);sfx('reward');}
      else{hurt(35);shake=12;MIS.cool=360;msg('PAK SLAAG!','Half werk… kom later nog eens terug','#ff4f6d',220);}}
    if(MG.res==='kiss'&&frameN%4===0)MG.hearts.push({x:CW/2+rr(-80,80),y:CH*.5,vy:rr(-2.5,-1.2),l:70});return;}
  const k=inp();if(k.up)MG.hy-=9;if(k.down)MG.hy+=9;MG.hy=clamp(MG.hy,B.top+10,B.bot-10);
  const dy=Math.abs(MG.hy-MG.py);MG.py=MG.hy;MG.t++;
  if(dy>1.2){const r=(MG.hy-B.top)/(B.bot-B.top)*MG.N;for(let i=0;i<MG.N;i++){const dd=Math.abs(i+.5-r);if(dd<1.6)MG.cov[i]=Math.min(1,MG.cov[i]+Math.min(.06,dy*.0055)*(1-dd/1.6));}if(frameN%6===0)sfx('rub');}
  let sum=0,mn=1;for(const v of MG.cov){sum+=v;mn=Math.min(mn,v);}const pct=sum/MG.N;
  if(pct>.9&&mn>.55){MG.res='kiss';MG.rt=150;sfx('kiss');setTimeout(()=>sfx('kiss'),260);buzz(40);}
  else if(MG.t>=MG.T){MG.res='slap';MG.rt=110;sfx('slap');setTimeout(()=>sfx('slap'),180);shake=10;buzz([60,40,60]);}
  for(const h of MG.hearts){h.y+=h.vy;h.l--;}MG.hearts=MG.hearts.filter(h=>h.l>0);}
function drawMinigame(){const B=mgBox(),g=MG.g||{skin:'#e0ac69',hair:'#7a3e12',suit:'#ff2e88'};ctx.setTransform(DPR,0,0,DPR,0,0);
  // laken
  ctx.fillStyle='#e9d3a6';ctx.fillRect(0,0,CW,CH);const tw=Math.min(CW*.86,440);for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#ffd166':'#ff7ab6';ctx.fillRect(CW/2-tw/2+i*tw/12,CH*.06,tw/12+1,CH*.9);}
  ctx.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<70;i++){ctx.fillRect((i*97)%CW,(i*53)%CH,2,2);}
  const {w,top,bot,cx}=B,sh=w*.5,wa=sh*.66,H0=bot-top,hip=wa*1.22;
  // armen + hoofd (achterkant)
  ctx.lineJoin='round';ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=2;
  for(const sd of [-1,1]){ctx.fillStyle=g.skin;ctx.beginPath();ctx.moveTo(cx+sd*sh*.92,top+14);ctx.bezierCurveTo(cx+sd*sh*1.25,top-20,cx+sd*sh*1.05,top-70,cx+sd*sh*.55,top-86);ctx.lineTo(cx+sd*sh*.3,top-70);ctx.bezierCurveTo(cx+sd*sh*.75,top-56,cx+sd*sh*.9,top-24,cx+sd*sh*.66,top+18);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle=g.hair;ctx.beginPath();ctx.ellipse(cx,top-46,sh*.42,sh*.4,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(cx-sh*.36,top-40);ctx.bezierCurveTo(cx-sh*.46,top+10,cx-sh*.25,top+44,cx-sh*.05,top+52);ctx.lineTo(cx+sh*.05,top+52);ctx.bezierCurveTo(cx+sh*.25,top+44,cx+sh*.46,top+10,cx+sh*.36,top-40);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*sh*.1,top-70);ctx.quadraticCurveTo(cx+i*sh*.16,top-20,cx+i*sh*.06,top+40);ctx.stroke();}
  // rug: schouders → taille → heupen
  const back=new Path2D();back.moveTo(cx-sh*.62,top);back.bezierCurveTo(cx-sh*.9,top-2,cx-sh*1.04,top+6,cx-sh,top+H0*.12);
  back.bezierCurveTo(cx-sh*.96,top+H0*.38,cx-wa*1.02,top+H0*.55,cx-wa,top+H0*.7);back.bezierCurveTo(cx-wa*.98,top+H0*.82,cx-hip,top+H0*.9,cx-hip,bot);
  back.lineTo(cx+hip,bot);back.bezierCurveTo(cx+hip,top+H0*.9,cx+wa*.98,top+H0*.82,cx+wa,top+H0*.7);back.bezierCurveTo(cx+wa*1.02,top+H0*.55,cx+sh*.96,top+H0*.38,cx+sh,top+H0*.12);
  back.bezierCurveTo(cx+sh*1.04,top+6,cx+sh*.9,top-2,cx+sh*.62,top);back.closePath();
  ctx.save();ctx.translate(7,9);ctx.fillStyle='rgba(60,30,10,.22)';ctx.fill(back);ctx.restore();ctx.fillStyle=g.skin;ctx.fill(back);
  ctx.save();ctx.clip(back);const sg=ctx.createLinearGradient(cx-sh,0,cx+sh,0);sg.addColorStop(0,'rgba(0,0,0,.22)');sg.addColorStop(.3,'rgba(255,255,255,.06)');sg.addColorStop(.5,'rgba(0,0,0,.04)');sg.addColorStop(.7,'rgba(255,255,255,.06)');sg.addColorStop(1,'rgba(0,0,0,.22)');ctx.fillStyle=sg;ctx.fillRect(cx-sh*1.1,top-10,sh*2.2,H0+20);
  const sp=ctx.createLinearGradient(cx-6,0,cx+6,0);sp.addColorStop(0,'rgba(0,0,0,0)');sp.addColorStop(.5,'rgba(0,0,0,.14)');sp.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sp;ctx.fillRect(cx-6,top+H0*.08,12,H0*.86);
  // zonnebrand: zachte witte banen
  const rh=H0/MG.N;for(let i=0;i<MG.N;i++){const v=MG.cov[i];if(v<=0)continue;const y=top+i*rh+rh/2,lg=ctx.createLinearGradient(0,y-rh,0,y+rh);lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(.5,`rgba(255,255,255,${.5*v})`);lg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=lg;ctx.fillRect(cx-sh*1.1,y-rh,sh*2.2,rh*2);
    if(v>.3&&i%3===0){ctx.strokeStyle=`rgba(255,255,255,${.25*v})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx-sh,y+Math.sin(i)*3);ctx.bezierCurveTo(cx-sh*.3,y-4,cx+sh*.3,y+4,cx+sh,y+Math.cos(i)*3);ctx.stroke();}}
  // bikinitop (bandje met strik) + broekje
  const by=top+H0*.34;ctx.fillStyle=g.suit;ctx.fillRect(cx-sh*1.1,by-6,sh*2.2,12);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.strokeRect(cx-sh*1.1,by-6,sh*2.2,12);
  ctx.beginPath();ctx.ellipse(cx-10,by,11,7,-.35,0,TAU);ctx.ellipse(cx+10,by,11,7,.35,0,TAU);ctx.fill();ctx.stroke();ctx.fillRect(cx-5,by+2,3.5,20);ctx.fillRect(cx+1.5,by+2,3.5,17);
  ctx.beginPath();ctx.moveTo(cx-hip*1.1,bot-18);ctx.quadraticCurveTo(cx,bot-8,cx+hip*1.1,bot-18);ctx.lineTo(cx+hip*1.1,bot+40);ctx.lineTo(cx-hip*1.1,bot+40);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2;ctx.stroke(back);
  // hand
  const hx=cx+Math.sin(frameN*.25)*sh*.3,hy=MG.hy;ctx.save();ctx.translate(hx,hy);ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(6,8,34,26,0,0,TAU);ctx.fill();const hs='#d9a066';ctx.fillStyle=hs;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(0,0,30,24,0,0,TAU);ctx.fill();ctx.stroke();for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-21+i*14,-30,6.5,14,0,0,TAU);ctx.fill();ctx.stroke();}ctx.beginPath();ctx.ellipse(34,4,7,14,-.9,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.ellipse(-4,4,14,8,.3,0,TAU);ctx.fill();ctx.restore();
  // UI
  let sum=0;for(const v of MG.cov)sum+=v;const pct=Math.round(sum/MG.N*100),tl=Math.max(0,(MG.T-MG.t)/60);
  const ty0=uiTop().bottom+8,tfs=clamp(CW/14,22,32);ctx.fillStyle='rgba(10,4,24,.7)';ctx.fillRect(0,0,CW,ty0+tfs+30);txt('SMEER HAAR RUG IN!',CW/2,ty0,tfs,'#ffd166','center');txt(IS_TOUCH?'Sleep je vinger op en neer over haar rug':'Beweeg de muis of W/S op en neer',CW/2,ty0+tfs+8,12,'#fff','center','Inter, sans-serif');
  const bw=Math.min(CW*.8,360),bx=CW/2-bw/2,byy=CH-70;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(bx,byy,bw,16);ctx.fillStyle=pct>=96?'#7dff6a':'#ffffff';ctx.fillRect(bx+2,byy+2,(bw-4)*Math.min(1,pct/100),12);
  txt('Ingesmeerd '+pct+'%   ·   '+tl.toFixed(1)+' s',CW/2,byy+22,13,'#fff','center','Inter, sans-serif');
  if(MG.res==='kiss'){for(const h of MG.hearts){ctx.globalAlpha=Math.min(1,h.l/30);ctx.font='28px sans-serif';ctx.textAlign='center';ctx.fillText('❤️',h.x,h.y);}ctx.globalAlpha=1;const a=Math.min(1,(150-MG.rt)/12);ctx.globalAlpha=a;txt('💋 KUS!',CW/2,CH*.42,clamp(CW/7,44,80),'#ff7ab6','center');txt('"Dankjewel, lieverd!"',CW/2,CH*.42+clamp(CW/7,44,80)+8,16,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;}
  if(MG.res==='slap'){const a=Math.min(1,(110-MG.rt)/8);ctx.fillStyle=`rgba(255,0,40,${.35*a*(MG.rt%10<5?1:.5)})`;ctx.fillRect(0,0,CW,CH);ctx.globalAlpha=a;txt('PATS!',CW/2,CH*.42,clamp(CW/6,50,90),'#ff4f6d','center');txt('"Dat noem jij insmeren?!"',CW/2,CH*.42+clamp(CW/6,50,90)+8,16,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;}}
