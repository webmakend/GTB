// ====================== handpistool (verloren in het park bij de oude watertoren) ======================
// Wissel met Q (of de 🔫-knop). Schieten met Spatie / de actieknop. Licht automatisch richten.
P.gun=false;P.weapon=0;let BULLETS=[],TARGETS=[];
function gunGlint(){return WTOWER&&WTOWER.gun&&!P.gun;}
function gunStep(){
  if(gunGlint()&&!P.car){const g=WTOWER.gun;if(Math.hypot(P.x-g[0],P.y-g[1])<22){P.gun=true;P.weapon=1;PRG.gun=true;PRG.dirty=true;progSave();sfx('reward');camHit(4);
    missionBanner('HANDPISTOOL GEVONDEN!',IS_TOUCH?'Iemand is hier zijn pistool verloren. Wissel met de 🔫-knop en schiet met de actieknop.':'Iemand is hier zijn pistool verloren. Wissel met Q en schiet met Spatie.','#ff6b3d',330);unlock('pistool');addXP(60);}}
  if(pressed.KeyQ&&P.gun&&!P.car){P.weapon=P.weapon?0:1;sfx('blip');noteAdd(P.weapon?'🔫 PISTOOL':'💧 WATERBALLONNEN','','#ffffff',80,'wapen');}
  for(const b of BULLETS){for(let s=0;s<3;s++){b.x+=b.vx/3;b.y+=b.vy/3;b.l-=1/3;if(b.l<=0)break;
      if(cellAt(b.x,b.y)===BUILD){b.l=0;for(let i=0;i<5;i++)parts.push({x:b.x,y:b.y,vx:rr(-1.5,1.5),vy:rr(-1.5,1.5),l:12,ml:12,s:1,k:'k'});break;}
      let hit=false;
      for(const t of TARGETS){if(t.hit)continue;if(Math.hypot(t.x-b.x,t.y-b.y)<9){t.hit=1;hit=true;sfx('splash');for(let i=0;i<12;i++)parts.push({x:t.x,y:t.y,vx:rr(-2.5,2.5),vy:rr(-2.5,2.5),l:rr(15,30),ml:30,s:1.5,k:'k'});popTxt(t.x,t.y-12,'RAAK!','#7dff6a',1);break;}}
      if(!hit)for(const p of peds){if(p.state==='down')continue;if(Math.abs(p.x-b.x)<8&&Math.abs(p.y-b.y)<8){knockDown(p,true,Math.atan2(b.vy,b.vx));if(p.kind==='cop')addHeat(1.2);hit=true;break;}}
      if(!hit)for(const c of cars){if(c===P.car||c.dead||c.state!=='ok')continue;const dx=b.x-c.x,dy=b.y-c.y,fx=Math.cos(c.a),fy=Math.sin(c.a),lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(Math.abs(lx)<c.t.l/2&&Math.abs(ly)<c.t.w/2){damageCar(c,12,true);parts.push({x:b.x,y:b.y,vx:0,vy:0,l:10,ml:10,s:1,k:'k'});if(c.driver==='cop')addHeat(.8);hit=true;break;}}
      if(hit){b.l=0;break;}}}
  BULLETS=BULLETS.filter(b=>b.l>0);
}
function fireGun(){if(P.throwCd>0)return;P.throwCd=13;let a=P.a,best=null,bd=1e9;
  const cands=[...peds.filter(p=>p.state!=='down'),...TARGETS.filter(t=>!t.hit)];
  for(const p of cands){const dx=p.x-P.x,dy=p.y-P.y,d=Math.hypot(dx,dy);if(d>420||d<6)continue;const da=Math.abs(wrap(Math.atan2(dy,dx)-P.a));if(da>.38)continue;const sc=d*(1+da*3);if(sc<bd){bd=sc;best=p;}}
  if(best)a=Math.atan2(best.y-P.y,best.x-P.x);a+=rr(-.03,.03);
  const sx=P.x+Math.cos(a)*10,sy=P.y+Math.sin(a)*10;BULLETS.push({x:sx,y:sy,vx:Math.cos(a)*16,vy:Math.sin(a)*16,l:34,sx,sy});P.a=a;
  for(let i=0;i<4;i++)parts.push({x:sx+Math.cos(a)*4,y:sy+Math.sin(a)*4,vx:Math.cos(a+rr(-.5,.5))*rr(1,3),vy:Math.sin(a+rr(-.5,.5))*rr(1,3),l:7,ml:7,s:1,k:'k'});
  P.flash=4;camHit(2.2);shotSfx();panic(P.x,P.y,260);if(copNear(420))addHeat(.35);}
function shotSfx(){if(!AU.c)return;const t=AU.c.currentTime,S=[AU.sfx];noiseHit(t,.09,.6,'bandpass',1800,S,.8);noiseHit(t+.01,.22,.25,'lowpass',600,S);tone('square',160,t,.001,.01,.06,.12,S,900);}
function drawGunWorld(){
  if(gunGlint()){const g=WTOWER.gun,d=Math.hypot(P.x-g[0],P.y-g[1]);if(Math.abs(g[0]-CAM.x)<1300&&Math.abs(g[1]-CAM.y)<1300){
    if(d<260||(frameN%90)<8){ctx.save();ctx.globalCompositeOperation='lighter';glow(g[0],g[1],d<260?18+6*Math.sin(frameN*.2):12,'rgba(255,255,255,.55)');ctx.restore();}
    ctx.save();ctx.translate(g[0],g[1]);ctx.rotate(.6);ctx.fillStyle='#1d1d1f';ctx.fillRect(-6,-2,12,4);ctx.fillRect(-6,-2,4,8);ctx.fillStyle='#555';ctx.fillRect(2,-1.5,4,1.2);ctx.restore();}}
  for(const t of TARGETS){if(t.hit)continue;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(t.x+2,t.y+3,5,2.5,0,0,TAU);ctx.fill();ctx.fillStyle='#2e7d32';ctx.fillRect(t.x-3,t.y-9,6,11);ctx.fillStyle='#a5d6a7';ctx.fillRect(t.x-1.5,t.y-12,3,4);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(t.x-2,t.y-7,1.5,6);}
  ctx.strokeStyle='rgba(255,230,140,.95)';ctx.lineWidth=2;for(const b of BULLETS){ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.9,b.y-b.vy*.9);ctx.stroke();}
  if(P.flash>0&&!P.car){P.flash--;ctx.save();ctx.globalCompositeOperation='lighter';glow(P.x+Math.cos(P.a)*14,P.y+Math.sin(P.a)*14,26,'rgba(255,200,80,.8)');ctx.restore();}
  if(P.weapon===1&&!P.car&&!P.dead){ctx.save();ctx.translate(P.x,P.y);ctx.rotate(P.a);ctx.fillStyle='#1d1d1f';ctx.fillRect(7,2,9,3);ctx.restore();}
}
