// ====================== voetgangers, waterballonnen, tekstballonnen ======================
const SAY_WET=['Hé!!','NAT!','Mijn haar!','Jij weer?!','Echt hè!','Doe normaal!','Brrr!','Mijn telefoon!','Ah nee joh!'];
const SAY_HIT=['Au!','Kijk uit!','Gek!','Hé, ROT OP!','Mijn heup!','Bel 112!'];
const SAY_FAT=['Opzij!','Kijk uit, man!','Wheelieee!','45 op de fiets, ja!','Brrrrr!','Remmen is voor watjes!'];
const SAY_BOER=['Ik kom uit #, jong!','# represent!','Mot nog melken!','Kan da nie wa rustiger?','Hedde gij mijn koeien gezien?','Effe boodschappen in de stad','Ut gras wordt nie vanzelf gemaaid!'];
const SAY_IDLE=['Lekker weertje','Nog even naar de HEMA','Koffie op de Markt?','Gezellig hier','Waar is de Bruna?','Bommel is mooi joh'];
function say(p,t){if(p.talkCd>0&&t!==undefined&&bubbles.some(b=>b.p===p))return;bubbles=bubbles.filter(b=>b.p!==p);bubbles.push({p,t,life:110});p.talkCd=200;if(MODE==='play'&&Math.hypot(p.x-me().x,p.y-me().y)<500)sfx('blip');}
function panic(x,y,r){for(const p of peds){if(p.kind==='cop'||p.state==='down')continue;if(Math.hypot(p.x-x,p.y-y)<r)flee(p,x,y,rr(150,320));}}
function flee(p,x,y,t){if(p.state==='down')return;p.state='flee';p.fx=x;p.fy=y;p.fleeT=t|0;}
function pedOk(p,t){if(t===BUILD||t===WATER)return false;if(p.state==='walk'&&p.cross<=0)return t===WALK||t===PLAZA||t===PARK||t===PATH||t===SAND;return true;}
function knockDown(p,byPlayer,dir){if(p.state==='down')return;if(byPlayer){hitStop=Math.max(hitStop,4);popTxt(p.x,p.y-10,rpick(['OMVER!','BAM!','OEPS!','STRIKE!']),'#ff4f6d',1.1);ring(p.x,p.y,34,'rgba(255,90,110,.9)');shake=Math.max(shake,4);buzz(25);}if(byPlayer||Math.hypot(p.x-me().x,p.y-me().y)<450)sfx('hit',byPlayer?1:.5);p.state='down';p.downT=rr(130,220)|0;p.a=dir;p.x+=Math.cos(dir)*10;p.y+=Math.sin(dir)*10;say(p,rpick(SAY_HIT));panic(p.x,p.y,180);
  for(let i=0;i<5;i++)parts.push({x:p.x,y:p.y-6,vx:rr(-1,1),vy:rr(-1.5,-.3),l:30,ml:30,s:3,k:'st'});
  if(byPlayer){P.stats.omver++;addXP(3);if(p.kind==='cop')addHeat(1.5);else addHeat(copNear(650)?1:.35);}}
function soak(p,byPlayer){p.wet=900;if(byPlayer){popTxt(p.x,p.y-12,rpick(['+1 💧','NAT!','SPLASH!','PLONS!']),'#5cc8ff',.9);hitStop=Math.max(hitStop,2);}if(p.kind==='cop'){if(byPlayer)addHeat(1.1);say(p,rpick(['Staan blijven!','Dat ga je bezuren!','Ho! Politie!']));p.state='chase';}else{flee(p,P.x,P.y,rr(200,350));say(p,rpick(SAY_WET));}if(byPlayer)P.stats.nat++;}
function pushOutOfCars(e,rad){for(const c of cars){if(c.dead)continue;const dx=e.x-c.x,dy=e.y-c.y;if(Math.abs(dx)>50||Math.abs(dy)>50)continue;const fx=Math.cos(c.a),fy=Math.sin(c.a);let lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;const hx=c.t.l/2+rad,hy=c.t.w/2+rad;
  if(Math.abs(lx)<hx&&Math.abs(ly)<hy){const px=hx-Math.abs(lx),py=hy-Math.abs(ly);if(px<py)lx+=Math.sign(lx||1)*px;else ly+=Math.sign(ly||1)*py;const nx=c.x+lx*fx-ly*fy,ny=c.y+lx*fy+ly*fx,t=cellAt(nx,ny);if(t!==BUILD&&t!==WATER){e.x=nx;e.y=ny;}}}}
function pedStep(p){
  if(p.talkCd>0)p.talkCd--;if(p.wet>0)p.wet--;
  if(p.state==='down'){if(--p.downT<=0){p.state=p.kind==='cop'&&stars>0?'chase':'flee';p.fx=me().x;p.fy=me().y;p.fleeT=200;}return;}
  let sp=0;
  if(p.kind==='cop'&&stars>0&&!P.dead){const t=me(),d=Math.hypot(t.x-p.x,t.y-p.y);p.a=Math.atan2(t.y-p.y,t.x-p.x);sp=d>14?2.4:0;p.state='chase';
    if(!P.car&&d<17)copTouch=true;if(P.car&&d<P.car.t.l/2+14&&speedOf(P.car)<.8)copTouch=true;if(Math.random()<.004)say(p,rpick(['Staan blijven!','Politie!','Handen omhoog!']));}
  else{if(p.kind==='cop'&&p.state==='chase')p.state='walk';
    if(p.state==='walk'){sp=p.spd;if(--p.think<=0){p.think=rr(60,240)|0;if(Math.random()<.35)p.a+=rr(-1.6,1.6);if(Math.random()<.04)p.cross=90;if(Math.random()<.02&&!offscreen(p.x,p.y))say(p,p.kind==='boer'?rpick(SAY_BOER).replace('#',p.dorp||'Gameren'):rpick(SAY_IDLE));}}
    else if(p.state==='flee'){sp=2.2;p.a=Math.atan2(p.y-p.fy,p.x-p.fx)+Math.sin(frameN*.05+p.x)*.4;if(--p.fleeT<=0)p.state='walk';}}
  if(p.cross>0)p.cross--;
  if(p.dog){const g=p.dog,tx=p.x-Math.cos(p.a)*16+Math.sin(p.a)*10,ty=p.y-Math.sin(p.a)*16-Math.cos(p.a)*10,dx=tx-g.x,dy=ty-g.y,d=Math.hypot(dx,dy);if(g.bark>0)g.bark--;
    if(p.state==='down'){g.a+=.15;g.anim+=.4;if(Math.random()<.02&&Math.hypot(g.x-me().x,g.y-me().y)<500){sfx('bark',.8);g.bark=14;}}
    else if(d>3){const sp=Math.min(d*.12,3.4);g.a=Math.atan2(dy,dx);g.x+=dx/d*sp;g.y+=dy/d*sp;g.anim+=sp*.5;}
    if(d>120){g.x=tx;g.y=ty;}
    if(!P.car&&!P.dead&&Math.hypot(g.x-P.x,g.y-P.y)<26&&!(g.bark>0)&&Math.random()<.05){sfx('bark',1);g.bark=20;say(p,rpick(['Hij doet niks hoor!','Af! Braaf!','Sorry, hij is nog jong']));}}
  if(sp>0){const nx=p.x+Math.cos(p.a)*sp,ny=p.y+Math.sin(p.a)*sp;if(pedOk(p,cellAt(nx,ny))){p.x=nx;p.y=ny;}else if(pedOk(p,cellAt(nx,p.y)))p.x=nx;else if(pedOk(p,cellAt(p.x,ny)))p.y=ny;else p.a+=rr(1.4,3.6);p.anim+=sp*.28;}
  pushOutOfCars(p,5);
}
function throwBalloon(){
  const tk=P.ch?P.ch.perk.throw:1;let tx=P.x+Math.cos(P.a)*230*tk,ty=P.y+Math.sin(P.a)*230*tk,best=null,bd=1e9;
  for(const p of peds){if(p.state==='down')continue;const dx=p.x-P.x,dy=p.y-P.y,d=Math.hypot(dx,dy);if(d>280*tk||d<10)continue;if(Math.abs(wrap(Math.atan2(dy,dx)-P.a))>.6)continue;if(d<bd){bd=d;best=p;}}
  if(best){tx=best.x+Math.cos(best.a)*best.spd*8;ty=best.y+Math.sin(best.a)*best.spd*8;}
  const d=Math.hypot(tx-P.x,ty-P.y);balloons.push({sx:P.x,sy:P.y,tx,ty,x:P.x,y:P.y,z:0,t:0,T:Math.max(16,d/6.5),c:MIS.gold?'#ffcc33':rpick(BALLOONC)});sfx('throw');P.throwCd=18;
}
function splash(x,y,col){sfx('splash');ring(x,y,MIS.gold?44:28,'rgba(160,220,255,.95)');for(let i=0;i<16;i++){const a=rr(0,TAU),s=rr(1,3.5);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(14,26),ml:26,s:rr(2,4),k:'w'});}
  parts.push({x,y,vx:0,vy:0,l:10,ml:10,s:8,k:'bal',c:col});decals.push({x,y,r:rr(12,18),c:'rgba(120,180,230,.35)',life:500});
  const sr=MIS.gold?40:22;if(MIS.gold){for(let i=0;i<10;i++){const a=rr(0,TAU),s=rr(1,3);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(16,30),ml:30,s:rr(1.5,3),k:'w'});}}
  for(const p of peds){if(p.state==='down')continue;if(Math.hypot(p.x-x,p.y-y)<sr)soak(p,true);}panic(x,y,120);}
function balloonStep(){for(const b of balloons){b.t++;const k=b.t/b.T;b.x=b.sx+(b.tx-b.sx)*k;b.y=b.sy+(b.ty-b.sy)*k;b.z=Math.sin(Math.PI*k)*38;
  if(cellAt(b.x,b.y)===BUILD){splash(b.x,b.y,b.c);b.done=1;continue;}
  if(b.z<16)for(const p of peds){if(p.state==='down')continue;if(Math.abs(p.x-b.x)<9&&Math.abs(p.y-b.y)<9){splash(b.x,b.y,b.c);b.done=1;break;}}
  if(!b.done&&k>=1){splash(b.x,b.y,b.c);b.done=1;}}
  balloons=balloons.filter(b=>!b.done);}

