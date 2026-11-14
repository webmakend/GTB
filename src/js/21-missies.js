// ====================== missies (kerk, Kruidvat, strand + insmeer-minigame) ======================
const MIS={on:false,done:false,stage:1,x:0,y:0,inside:0,gold:false,ann:0,girl:null,cool:0};
const MIS_DO={4:'Ga naar Café Henkie in de Waterstraat bij de Markt voor een avondje stappen (entree €10).',1:'Loop naar de ingang van de Sint-Maartenskerk (Kerkplein). Volg de gele pijl.',2:'Koop zonnebrand bij de Kruidvat in de Boschstraat (€8,99).',3:'Breng de zonnebrand naar de meid op het strand en smeer haar rug in.'};
const MIS_TXT={4:'MISSIE 3: avondje stappen in Café Henkie',1:'MISSIE 1: bezoek de Sint-Maartenskerk',2:'MISSIE 2: koop zonnebrand bij de Kruidvat',3:'MISSIE 2: smeer de meid op het strand in'};
function churchDoor(){const gk=BUILDINGS.find(b=>b.n==='Grote of Sint-Maartenskerk');if(!gk)return null;const x0=gk.bb[0],ys=gk.p.filter(q=>q[0]<x0+150).map(q=>q[1]),cy=(Math.min(...ys)+Math.max(...ys))/2;return snap(x0-34,cy);}
function kruidvatDoor(){const l=LANDMARKS.find(l=>l.n==='Kruidvat');if(!l)return null;const b=BUILDINGS.find(b=>b.sign==='Kruidvat');let x=l.x,y=l.y;if(b&&b.sa!=null){}const s0=snap(x,y);return s0;}
function pickGirl(){if(!BEACHERS.length)return null;const cx=(BEACH.bb[0]+BEACH.bb[2])/2,cy=(BEACH.bb[1]+BEACH.bb[3])/2;let best=null,bd=1e18;for(const b of BEACHERS){const d=Math.hypot(b.x-cx,b.y-cy);if(d<bd){bd=d;best=b;}}
  if(best){best.special=1;best.sit=false;best.umb=null;best.suit='#ff2e88';best.towel='#ffd166';best.hair='#7a3e12';}return best;}
function henkeDoor(){const l=LANDMARKS.find(l=>l.n==='Café Henkie');return l?snap(l.x,l.y):null;}
function setStage(st){MIS.stage=st;MIS.inside=0;let d=null;if(st===4)d=henkeDoor();else if(st===1)d=churchDoor();else if(st===2)d=kruidvatDoor();else if(st===3){if(!MIS.girl)MIS.girl=pickGirl();if(MIS.girl)d=[MIS.girl.x,MIS.girl.y];}
  if(d){MIS.x=d[0];MIS.y=d[1];MIS.on=true;}else if(st<3)setStage(st+1);else{MIS.done=true;}}
// na missie 3 blijft Café Henkie open: gewoon naar binnen lopen
function henkieVisit(){if(P.car||CLUB.on||MIS.cool>0)return;const d=henkeDoor();if(!d)return;if(Math.hypot(P.x-d[0],P.y-d[1])<34)enterClub();}
function henkieMarker(){if(!(MIS.done&&MIS.stage>=4)||MG.on||bigMap||CLUB.on)return;const d=henkeDoor();if(!d)return;const sx=CW/2+(d[0]-CAM.x)*CAM.z,sy=CH/2+(d[1]-CAM.y)*CAM.z;if(sx<-40||sx>CW+40||sy<-40||sy>CH+40)return;
  const b=Math.sin(frameN*.08)*3,y=sy-26-b;ctx.fillStyle='rgba(10,4,24,.85)';rrect(ctx,sx-34,y-12,68,22,11);ctx.fill();ctx.strokeStyle='#ff7ad9';ctx.lineWidth=2;rrect(ctx,sx-34,y-12,68,22,11);ctx.stroke();ctx.font='800 11px Inter, sans-serif';ctx.fillStyle='#ff7ad9';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🍸 OPEN',sx,y);}
function henkeStep(){if(MIS.stage!==4||MIS.done||P.car||CLUB.on)return;if(Math.hypot(P.x-MIS.x,P.y-MIS.y)<36&&!MIS.cool){if(P.money<10){msg('TE WEINIG GELD','Entree kost €10','#ff6b6b',140);MIS.cool=200;return;}addMoney(-10);sfx('kassa');enterClub();}}
function initMission(){MIS.done=false;MIS.gold=false;MIS.girl=null;MIS.cool=0;MIS.ann=0;MIS.on=true;setStage(1);}
function missionStep(){if(MIS.cool>0&&MIS.done)MIS.cool--;if(MIS.done&&MIS.stage>=4&&!P.dead){henkieVisit();return;}if(!MIS.on||MIS.done||P.dead)return;if(MIS.ann>0&&--MIS.ann===0)missionBanner('MISSIE 2: ZONNEBRAND','Je hebt €20. Koop zonnebrand bij de Kruidvat in de Boschstraat en breng het naar het strand. Volg de gele pijl.');
  if(MIS.cool>0)MIS.cool--;
  if(MIS.stage===1){if(MIS.inside>0){if(--MIS.inside===0){P.hp=P.maxhp;heat=0;stars=0;MIS.gold=true;sfx('reward');addMoney(20);
        msg('MISSIE GESLAAGD!','Beloning: €20 + gouden waterballonnen','#ffd166',260);setStage(2);MIS.ann=270;}return;}
    if(!P.car&&Math.hypot(P.x-MIS.x,P.y-MIS.y)<34){MIS.inside=230;sfx('organ');setTimeout(()=>sfx('bellc'),400);msg('SINT-MAARTENSKERK','Je stapt binnen… stilte, orgelmuziek en 600 jaar geschiedenis','#ffe8b0',220);}}
  else if(MIS.stage===2){if(!P.car&&Math.hypot(P.x-MIS.x,P.y-MIS.y)<38){if(P.money<8.99){if(!MIS.cool){msg('TE WEINIG GELD','Zonnebrand kost €8,99','#ff6b6b',140);MIS.cool=200;}return;}
      addMoney(-8.99);sfx('kassa');MIS.lotion=true;msg('ZONNEBRAND GEKOCHT','Factor 30','#ffd166',120);setStage(3);setTimeout(()=>missionBanner('MISSIE 2: NAAR HET STRAND','Loop of rijd naar het strand aan de Waal. Zoek de meid op het gele laken en smeer haar rug in.'),1600);}}
  else if(MIS.stage===3){const g=MIS.girl;if(!g||!BEACHERS.includes(g)){MIS.girl=null;setStage(3);return;}MIS.x=g.x;MIS.y=g.y;const d=Math.hypot(P.x-g.x,P.y-g.y);
    if(d<170&&d>60&&!g.asked){g.asked=1;bubbles=bubbles.filter(q=>q.p!==g);bubbles.push({p:g,t:'Kun jij mijn rug even insmeren?',life:220});sfx('blip',480);}
    if(d>140)g.asked=0;
    if(!P.car&&d<40&&!MIS.cool)mgStart(g);}
  else if(MIS.stage===4)henkeStep();}
function drawMission(Z){if(!MIS.on||MIS.done)return;const pu=1+.25*Math.sin(frameN*.12);ctx.save();ctx.globalCompositeOperation='lighter';glow(MIS.x,MIS.y,46*pu,'rgba(255,209,102,.55)');ctx.restore();
  ctx.strokeStyle='#ffd166';ctx.lineWidth=3/Math.max(.6,Z);ctx.beginPath();ctx.arc(MIS.x,MIS.y,22*pu,0,TAU);ctx.stroke();const by=MIS.y-34-6*Math.sin(frameN*.1);ctx.fillStyle='#ffd166';ctx.beginPath();ctx.moveTo(MIS.x,by+14);ctx.lineTo(MIS.x-10,by);ctx.lineTo(MIS.x+10,by);ctx.closePath();ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();}
// ---------- minigame: rug insmeren ----------
const MG={on:false,g:null,t:0,T:840,hy:0,py:0,cov:null,res:'',rt:0,N:22,hearts:[],mini:[],joy:'',joyT:0,joyCd:0,lastPct:0};
const JOY=['Mmm, heerlijk…','Ahh, lekker koel!','Ja, precies daar!','Jij kan dit goed!','Hmm, wat fijn…','Oeh, dat is lekker!'];
function mgPlace(){const hdr=uiTop().bottom+8+clamp(CW/14,22,32)+34,avail=CH-100-hdr,iw=RUG.width||424,ih=RUG.height||705,sc=Math.min(avail/ih,CW*.86/iw),dw=iw*sc,dh=ih*sc;return{dw,dh,dx:CW/2-dw/2,dy:hdr+(avail-dh)/2};}
function mgBox(){const p=mgPlace();return{w:p.dw,top:p.dy+p.dh*.3,bot:p.dy+p.dh*.95,cx:CW/2};}
function mgStart(g){MG.on=true;MG.g=g;MG.t=0;MG.res='';MG.rt=0;MG.cov=new Float32Array(MG.N);MG.mini=[];MG.joyT=0;MG.joyCd=60;MG.lastPct=0;const B=mgBox();MG.hy=MG.py=(B.top+B.bot)/2;bigMap=false;document.getElementById('touch').style.display='none';sfx('blip',500);MG.vol=radio.volume;radio.volume=Math.min(radio.volume,.1);}
function mgEnd(){MG.on=false;radio.volume=MODE==='play'?.45:(MG.vol||.45);if(IS_TOUCH)document.getElementById('touch').style.display='block';}
function mgStep(){frameN++;const B=mgBox();if(MG.res){if(--MG.rt<=0){const kiss=MG.res==='kiss';mgEnd();if(kiss){msg('MISSIE 2 GESLAAGD!','Ze is ingesmeerd én je kreeg een kus 💋','#ff7ab6',220);sfx('reward');addMoney(40);setStage(4);setTimeout(()=>missionBanner('MISSIE 3: AVONDJE STAPPEN','Je kreeg €40 fooi. Tijd om te stappen! Café Henkie in de Waterstraat bij de Markt is open. Volg de gele pijl.'),3200);}
      else{hurt(35);shake=12;MIS.cool=360;msg('PAK SLAAG!','Half werk… kom later nog eens terug','#ff4f6d',220);}}
    if(MG.res==='kiss'&&frameN%4===0)MG.hearts.push({x:CW/2+rr(-80,80),y:CH*.5,vy:rr(-2.5,-1.2),l:70});return;}
  const k=inp();if(k.up)MG.hy-=9;if(k.down)MG.hy+=9;MG.hy=clamp(MG.hy,B.top+10,B.bot-10);
  const dy=Math.abs(MG.hy-MG.py);MG.py=MG.hy;MG.t++;
  if(dy>1.2){const r=(MG.hy-B.top)/(B.bot-B.top)*MG.N;for(let i=0;i<MG.N;i++){const dd=Math.abs(i+.5-r);if(dd<1.6)MG.cov[i]=Math.min(1,MG.cov[i]+Math.min(.06,dy*.0055)*(1-dd/1.6));}if(frameN%6===0)sfx('rub');}
  let sum=0,mn=1;for(const v of MG.cov){sum+=v;mn=Math.min(mn,v);}const pct=sum/MG.N;
  if(MG.joyT>0)MG.joyT--;if(MG.joyCd>0)MG.joyCd--;
  if(dy>1.2&&pct>MG.lastPct+.07&&MG.joyCd<=0){MG.lastPct=pct;MG.joy=rpick(JOY);MG.joyT=95;MG.joyCd=55;sfx('mmm',1.4);for(let i=0;i<4;i++)MG.mini.push({x:CW/2+rr(-90,90),y:B.top+rr(0,60),vy:rr(-1.6,-.8),l:60});}
  for(const h of MG.mini){h.y+=h.vy;h.l--;}MG.mini=MG.mini.filter(h=>h.l>0);
  if(pct>.9&&mn>.55){MG.res='kiss';MG.rt=150;sfx('kiss');setTimeout(()=>sfx('kiss'),260);buzz(40);}
  else if(MG.t>=MG.T){MG.res='slap';MG.rt=110;sfx('slap');setTimeout(()=>sfx('slap'),180);shake=10;buzz([60,40,60]);}
  for(const h of MG.hearts){h.y+=h.vy;h.l--;}MG.hearts=MG.hearts.filter(h=>h.l>0);}
function drawMinigame(){const B=mgBox(),g=MG.g||{skin:'#e0ac69',hair:'#7a3e12',suit:'#ff2e88'};ctx.setTransform(DPR,0,0,DPR,0,0);
  // laken
  ctx.fillStyle='#e9d3a6';ctx.fillRect(0,0,CW,CH);const tw=Math.min(CW*.86,440);for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#ffd166':'#ff7ab6';ctx.fillRect(CW/2-tw/2+i*tw/12,CH*.06,tw/12+1,CH*.9);}
  ctx.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<70;i++){ctx.fillRect((i*97)%CW,(i*53)%CH,2,2);}
  const {top,bot,cx}=B;let sh=Math.min(CW*.3,150);
  if(RUG_OK){const {dw,dh,dx,dy}=mgPlace();sh=dw*.32;
    const breathe=1+.006*Math.sin(frameN*.05)+(MG.joyT>0?.01*Math.sin(frameN*.3):0);ctx.save();ctx.translate(cx,dy+dh*.6);ctx.scale(1,breathe);ctx.translate(-cx,-(dy+dh*.6));ctx.shadowColor='rgba(60,30,10,.35)';ctx.shadowBlur=18;ctx.shadowOffsetX=6;ctx.shadowOffsetY=9;ctx.drawImage(RUG,dx,dy,dw,dh);ctx.restore();
    // zonnebrand alleen op de huid: banen in een hulp-canvas, gemaskeerd met de afbeelding
    if(!MG.lc)MG.lc=document.createElement('canvas');const lc=MG.lc;lc.width=Math.ceil(dw);lc.height=Math.ceil(dh);const lx=lc.getContext('2d');lx.clearRect(0,0,lc.width,lc.height);
    const rh=(bot-top)/MG.N;for(let i=0;i<MG.N;i++){const v=MG.cov[i];if(v<=0)continue;const y=top+i*rh+rh/2-dy,lg=lx.createLinearGradient(0,y-rh,0,y+rh);lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(.5,`rgba(255,255,255,${.55*v})`);lg.addColorStop(1,'rgba(255,255,255,0)');lx.fillStyle=lg;lx.fillRect(0,y-rh,dw,rh*2);
      if(v>.3&&i%3===0){lx.strokeStyle=`rgba(255,255,255,${.3*v})`;lx.lineWidth=1.5;lx.beginPath();lx.moveTo(0,y+Math.sin(i)*3);lx.bezierCurveTo(dw*.35,y-4,dw*.65,y+4,dw,y+Math.cos(i)*3);lx.stroke();}}
    lx.globalCompositeOperation='destination-in';lx.drawImage(RUG,0,0,dw,dh);lx.globalCompositeOperation='source-over';ctx.drawImage(lc,dx,dy);
    if(MG.joyT>0){const a=Math.min(1,MG.joyT/20);ctx.globalAlpha=a;const tx=cx,ty=dy+dh*.03;ctx.font='700 15px Inter, sans-serif';const tw=ctx.measureText(MG.joy).width+20;ctx.fillStyle='#fff';rrect(ctx,tx-tw/2,ty-16,tw,30,10);ctx.fill();ctx.fillStyle='#d6336c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(MG.joy,tx,ty-1);ctx.globalAlpha=1;}
    for(const h of MG.mini){ctx.globalAlpha=Math.min(1,h.l/25);ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('💗',h.x,h.y);}ctx.globalAlpha=1;}
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
