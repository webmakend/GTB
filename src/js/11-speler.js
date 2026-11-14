// ====================== speler ======================
const keys={},pressed={};
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!keys[e.code])pressed[e.code]=true;keys[e.code]=true;
  if(MODE==='play'){if(e.code==='KeyM')bigMap=!bigMap;if(e.code==='KeyP'||e.code==='Escape')paused=!paused;if(e.code==='KeyN')musicToggle();if(e.code==='Minus'||e.code==='NumpadSubtract')setZoom(ZU/1.15);if(e.code==='Equal'||e.code==='NumpadAdd')setZoom(ZU*1.15);}
  if(MODE==='intro'&&(e.code==='Enter'||e.code==='Space'))showPick();else if(MODE==='pick'){if(e.code==='ArrowRight')scrollToCard(Math.min(PICK.length-1,pickIdx+1),true);if(e.code==='ArrowLeft')scrollToCard(Math.max(0,pickIdx-1),true);if(e.code==='Enter'||e.code==='Space')choose(pickIdx);}});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
document.addEventListener('contextmenu',e=>e.preventDefault());
const touch={jx:0,jy:0,act:false,enter:false,jump:false,on:false};
function inp(){const k=keys;return{up:k.KeyW||k.ArrowUp,down:k.KeyS||k.ArrowDown,left:k.KeyA||k.ArrowLeft,right:k.KeyD||k.ArrowRight,act:k.Space||k.ControlLeft||k.ControlRight||touch.act,run:k.ShiftLeft||k.ShiftRight,enter:pressed.KeyE||pressed.Enter||pressed.KeyF||touch.enter,jump:pressed.KeyJ||pressed.KeyX||touch.jump};}
function footBlocked(x,y){for(const [dx,dy] of [[5,0],[-5,0],[0,5],[0,-5]]){const t=cellAt(x+dx,y+dy);if(t===BUILD)return true;}return x<20||y<20||x>W-20||y>H-20;}
const swimming=()=>!P.car&&!P.dead&&cellAt(P.x,P.y)===WATER&&!BRG[cellIdx(P.x,P.y)];
function carNear(){let best=null,bd=1e9;for(const c of cars){if(c.dead||c.state!=='ok')continue;const dx=P.x-c.x,dy=P.y-c.y;if(Math.abs(dx)>70||Math.abs(dy)>70)continue;const fx=Math.cos(c.a),fy=Math.sin(c.a),lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;
  if(Math.abs(lx)<c.t.l/2+18&&Math.abs(ly)<c.t.w/2+20){const d=Math.hypot(dx,dy);if(d<bd){bd=d;best=c;}}}return best;}
function tryEnter(){const best=carNear();if(!best)return;
  if(best.driver==='npc')ejectDriver(best);else if(best.driver==='cop'){exitCops(best);addHeat(1.2);}else if(best.type==='police')addHeat(1);
  best.driver='player';best.ai=null;best.keep=1;P.car=best;P.stats.gejat++;showCarName(best);popTxt(best.x,best.y-16,'GEJAT!','#ffd166',1.1);sfx('door');stoleBike(best);addXP(4);}
function exitCar(){const c=P.car,s=c.t.w/2+10,L=[c.x+Math.sin(c.a)*s,c.y-Math.cos(c.a)*s],Rt=[c.x-Math.sin(c.a)*s,c.y+Math.cos(c.a)*s];
  const p=!footBlocked(L[0],L[1])?L:!footBlocked(Rt[0],Rt[1])?Rt:[c.x,c.y];P.x=p[0];P.y=p[1];P.a=c.a;c.driver=null;c.keep=0;c.ctl=[0,0,1];P.car=null;sfx('door');}
function addMoney(v){P.money=Math.max(0,P.money+v);P.moneyF=20;popTxt(me().x,me().y-20,(v>0?'+':'-')+'€'+Math.abs(v).toFixed(2).replace('.',','),v>0?'#7dff6a':'#ff6b6b',1.2);}
function hurt(d){if(P.dead)return;P.hp-=d;P.hurtF=18;buzz(30);shake=Math.max(shake,5);if(P.hp<=0){P.hp=0;wasted('WASTED');}}
function wasted(t){if(P.dead)return;P.dead=170;P.deadKind='wasted';msg(t,'De huisarts lapt je weer op','#e8433a',170);sfx('sting');}
function busted(){if(P.dead)return;if(P.car){P.car.driver=null;P.car.keep=0;P.car=null;}P.dead=170;P.deadKind='bust';msg('GEARRESTEERD!','Een nachtje in de cel, morgen weer vrij','#4d8dff',170);sfx('sting');}
let SPAWN=[0,0];
function respawn(){const s=snap(SPAWN[0],SPAWN[1]);P.x=s[0];P.y=s[1];P.hp=P.maxhp;P.car=null;P.bust=0;heat=0;stars=0;
  cars=cars.filter(c=>!(c.driver==='cop'&&c.ai&&c.ai.mode==='pursuit'));peds=peds.filter(p=>p.kind!=='cop');camX=P.x;camY=P.y;}
function snap(x,y){const cx0=Math.floor(x/T),cy0=Math.floor(y/T);for(let r=0;r<60;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const cx=cx0+dx,cy=cy0+dy;if(cx<0||cy<0||cx>=GW||cy>=GH)continue;const t=G[cy*GW+cx];if(t===WALK||t===PLAZA)return[cx*T+8,cy*T+8];}return[x,y];}
function playerStep(){
  if(P.dead>0){if(--P.dead===0)respawn();return;}
  const k=inp();if(P.throwCd>0)P.throwCd--;
  if(k.enter){if(P.car)exitCar();else if(nearStatue())openStatue();else if(!actTry())tryEnter();}
  if(P.car){const c=P.car;let th=(k.up?1:0)-(k.down?1:0),st=(k.right?1:0)-(k.left?1:0);
    if(touch.on&&(Math.abs(touch.jx)>.15||Math.abs(touch.jy)>.15)){const m=Math.min(1,Math.hypot(touch.jx,touch.jy)),want=Math.atan2(touch.jy,touch.jx),d=wrap(want-c.a);
      const fs0=fwdSpeed(c);if(Math.abs(d)<2.3||fs0>2.5){th=Math.abs(d)>1.9&&fs0>1.5?-1:m;st=clamp(d*(fs0>3?1.7:2.4),-1,1);}else{th=-m;st=clamp(-wrap(want+Math.PI-c.a)*2.4,-1,1);}
      c.stS=(c.stS||0)+(st-(c.stS||0))*.35;st=c.stS;}
    c.ctl=[th,st,k.act?1:0];
  }else{let mx=(k.right?1:0)-(k.left?1:0),my=(k.down?1:0)-(k.up?1:0),run=k.run;
    if(k.jump&&!(P.jz>0)&&!swimming()){P.jv=4.2;P.jz=.01;P.dj=0;sfx('jump');}
    else if(k.jump&&P.jz>0&&!P.dj){P.dj=1;P.jv=Math.max(P.jv,0)*.5+3.8;sfx('jump',1.3);ring(P.x,P.y,20,'rgba(255,255,255,.8)');for(let i=0;i<8;i++){const a=i/8*TAU;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6,l:16,ml:16,s:2,k:'d'});}}
    if(P.jz>0){P.jz+=P.jv;P.jv-=.32;if(P.jz<=0){P.jz=0;P.jv=0;P.dj=0;sfx('step',1);buzz(10);P.squash=9;for(let i=0;i<6;i++){const a=rr(0,TAU);parts.push({x:P.x,y:P.y,vx:Math.cos(a)*1.2,vy:Math.sin(a)*1.2,l:20,ml:20,s:2,k:'d'});}}}
    if(touch.on&&(Math.abs(touch.jx)>.12||Math.abs(touch.jy)>.12)){mx=touch.jx;my=touch.jy;run=Math.hypot(mx,my)>.92;}
    const sw=swimming();if(sw&&frameN%14===0)parts.push({x:P.x,y:P.y,vx:0,vy:0,l:40,ml:40,s:6,k:'p'});
    const m=Math.hypot(mx,my);P.moving=m>.1;P.running=P.moving&&run;if(m>.1){const rk=P.ch?P.ch.perk.run:1,sp=(sw?1.45:run?3.3:2.3)*rk*Math.min(1,m)*(P.jz>0?1.15:1)*(P.high>0?1.3:1)*(P.boost>0?1.3:1)*(P.drunk>=4?.85:1);mx/=m;my/=m;if(P.drunk>=2){const w=Math.sin(frameN*.045)*Math.min(1,P.drunk/6)*.9;const c2=Math.cos(w),s2=Math.sin(w);[mx,my]=[mx*c2-my*s2,mx*s2+my*c2];}P.a=Math.atan2(my,mx);const nx=P.x+mx*sp,ny=P.y+my*sp;if(!footBlocked(nx,P.y))P.x=nx;if(!footBlocked(P.x,ny))P.y=ny;const ph=Math.floor(P.anim/Math.PI);P.anim+=sp*.28;if(Math.floor(P.anim/Math.PI)!==ph&&!(P.jz>0)){if(sw){if(ph%2===0)sfx('swim');}else{const gt=cellAt(P.x,P.y);sfx('step',run?1:0,(gt===GRASS||gt===PARK||gt===SAND)?1:0);}}}
    if(!(P.jz>7))pushOutOfCars(P,6);
    if(k.act&&P.throwCd<=0&&!sw){if(P.weapon===1&&P.gun)fireGun();else if(P.ammo>0){P.ammo--;throwBalloon();}else{P.throwCd=30;noteAdd('💧 BALLONNEN OP','Even wachten, ze vullen zich vanzelf bij','#7fc8ff',90,'ammo');}}
    if(heat<.5&&P.hp<P.maxhp)P.hp=Math.min(P.maxhp,P.hp+.03);}
}
function beachHits(){for(const c of cars){if(c.dead)continue;const sp=speedOf(c);if(sp<1.6)continue;for(let i=BEACHERS.length-1;i>=0;i--){const b=BEACHERS[i];if(Math.abs(b.x-c.x)>26||Math.abs(b.y-c.y)>26)continue;if(b.special)continue;BEACHERS.splice(i,1);const p=makePed(b.x,b.y,'civ');p.col=b.suit;p.hair=b.hair;peds.push(p);knockDown(p,c===P.car,Math.atan2(c.vy,c.vx));}}
  for(let i=BWALK.length-1;i>=0;i--){const b=BWALK[i];if(b.talkCd>0)b.talkCd--;
    if(cars.some(c=>!c.dead&&speedOf(c)>1.6&&Math.abs(b.x-c.x)<16&&Math.abs(b.y-c.y)<16)){const c=cars.find(c=>!c.dead&&Math.abs(b.x-c.x)<16&&Math.abs(b.y-c.y)<16);BWALK.splice(i,1);const p=makePed(b.x,b.y,'civ');p.col=b.suit;p.hair=b.hair;peds.push(p);knockDown(p,c===P.car,Math.atan2(c.vy,c.vx));continue;}
    if(--b.think<=0){b.think=rr(80,260)|0;if(Math.random()<.4)b.a+=rr(-1.8,1.8);b.stop=Math.random()<.3?rr(60,160)|0:0;}
    if(b.stop>0){b.stop--;}else{const nx=b.x+Math.cos(b.a)*b.spd,ny=b.y+Math.sin(b.a)*b.spd;if(cellAt(nx,ny)===SAND){b.x=nx;b.y=ny;b.anim+=b.spd*.28;}else b.a+=rr(1.5,3.5);}
    const d=Math.hypot(b.x-me().x,b.y-me().y);if(d<330&&b.talkCd<=0&&Math.random()<(d<120?.02:.004)&&!bubbles.some(q=>BWALK.includes(q.p))){bubbles=bubbles.filter(q=>q.p!==b);bubbles.push({p:b,t:rpick(SAY_BEACH),life:240});b.talkCd=600;sfx('blip',rr(380,520));}}
  for(const s2 of SWIMMERS){s2.x=s2.x0+Math.sin(frameN*.004+s2.ph)*40;s2.y=s2.y0+Math.cos(frameN*.003+s2.ph)*14;}}
function carPedHits(){beachHits();
  for(const c of cars){if(c.dead)continue;const sp=speedOf(c);if(sp<.9)continue;const fx=Math.cos(c.a),fy=Math.sin(c.a);
    for(const p of peds){if(p.state==='down')continue;const dx=p.x-c.x,dy=p.y-c.y;if(Math.abs(dx)>40||Math.abs(dy)>40)continue;const lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;
      if(Math.abs(lx)<c.t.l/2+5&&Math.abs(ly)<c.t.w/2+5){if(sp>1.8){knockDown(p,c===P.car,Math.atan2(c.vy,c.vx)+rr(-.5,.5));p.x+=c.vx*3;p.y+=c.vy*3;if(c===P.car)sfx('bump');}else{p.x+=c.vx*2;p.y+=c.vy*2;if(p.kind==='civ')flee(p,c.x,c.y,200);}}}
    if(c!==P.car&&!P.car&&!P.dead&&!(P.jz>6)){const dx=P.x-c.x,dy=P.y-c.y,lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(Math.abs(lx)<c.t.l/2+6&&Math.abs(ly)<c.t.w/2+6&&sp>2.4&&c.hitCd<=0){c.hitCd=30;hurt(sp*5);const a=Math.atan2(dy,dx),nx=P.x+Math.cos(a)*14,ny=P.y+Math.sin(a)*14;if(!footBlocked(nx,ny)){P.x=nx;P.y=ny;}}}}}

