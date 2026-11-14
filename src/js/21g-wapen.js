// ====================== wapens: waterballon + 9 vuurwapens (icoontjes: assets/weapons.webp) ======================
// Het pistool ligt in het park bij de oude watertoren; de rest ligt verstopt in de vesting (sommige pas vanaf een bepaald level).
// Wissel met Q / pijltjes / swipen over de schietknop. Munitie is onbeperkt. Opgepakt = alle wapens kwijt.
const WSHEET=new Image();WSHEET.src='assets/weapons.webp';
const WPN={
 balloon:{n:'Waterballonnen',ic:-1},
 pistol :{n:'Pistool',ic:0,cd:13,sp:16,l:34,pel:1,spr:.03,dmg:12,cone:.38,kick:2.2,lvl:1},
 shotgun:{n:'Shotgun',ic:1,cd:40,sp:14,l:18,pel:6,spr:.28,dmg:10,cone:.45,kick:5,lvl:2},
 ak     :{n:'AK-47',ic:2,cd:6,sp:17,l:36,pel:1,spr:.07,dmg:10,cone:.3,kick:1.6,lvl:3},
 m4     :{n:'M4',ic:3,cd:5,sp:18,l:38,pel:1,spr:.045,dmg:10,cone:.3,kick:1.4,lvl:4},
 sniper :{n:'Sniper',ic:4,cd:62,sp:32,l:40,pel:1,spr:0,dmg:60,cone:.6,kick:4,lvl:5,range:900},
 minigun:{n:'Minigun',ic:5,cd:2,sp:18,l:32,pel:1,spr:.13,dmg:7,cone:.25,kick:1.1,lvl:7},
 bazooka:{n:'Raketwerper',ic:6,cd:75,sp:9,l:70,rocket:1,cone:.3,kick:7,lvl:6},
 rpg    :{n:'RPG',ic:7,cd:90,sp:8,l:80,rocket:1,cone:.3,kick:8,lvl:8},
 grenade:{n:'Granaat',ic:8,cd:55,grenade:1,lvl:3}};
const WORDER=['balloon','pistol','shotgun','ak','m4','sniper','minigun','bazooka','rpg','grenade'];
P.inv=['balloon'];P.wid='balloon';P.gun=false;P.weapon=0;let BULLETS=[],TARGETS=[],ROCKETS=[],WPICK=[];
function syncWpn(){P.inv=WORDER.filter(w=>w==='balloon'||P.inv.includes(w));if(!P.inv.includes(P.wid))P.wid='balloon';P.gun=P.inv.length>1;P.weapon=P.wid==='balloon'?0:1;}
function giveWeapon(w,silent){if(P.inv.includes(w))return false;P.inv.push(w);P.wid=w;syncWpn();PRG.inv=P.inv.slice();PRG.gun=P.gun;PRG.dirty=true;try{progSave();}catch(e){}
  if(!silent){sfx('reward');camHit(4);noteAdd(WPN[w].n.toUpperCase()+' GEVONDEN!',IS_TOUCH?'Wissel met de pijltjes of swipe over de schietknop':'Wissel met Q, schiet met Spatie','#ff2e88',300);addXP(40);if(w==='pistol')unlock('pistool');}return true;}
function loseWeapons(){const had=P.inv.length>1;P.inv=['balloon'];P.wid='balloon';syncWpn();PRG.inv=['balloon'];PRG.gun=false;PRG.dirty=true;try{progSave();}catch(e){}return had;}
function setWeapon(dir){if(P.car||P.inv.length<2)return;const i=P.inv.indexOf(P.wid);P.wid=P.inv[(i+dir+P.inv.length)%P.inv.length];syncWpn();buzz(12);sfx('blip');noteAdd(WPN[P.wid].n.toUpperCase(),'','#36d1ff',60,'wapen');}
function gunGlint(){return WTOWER&&WTOWER.gun&&!P.inv.includes('pistol');}
function initWpick(){WPICK=[];let sd=7331;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;const [x0,y0,x1,y1]=FORTBB;
  for(const w of ['shotgun','ak','m4','sniper','minigun','bazooka','rpg','grenade']){for(let t=0;t<400;t++){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0),c=cellAt(x,y);
    if((c===WALK||c===PLAZA)&&WPICK.every(q=>Math.hypot(q.x-x,q.y-y)>260)&&Math.hypot(x-SPAWN[0],y-SPAWN[1])>200){WPICK.push({w,x,y});break;}}}}
function gunStep(){if(!WPICK.length&&FORTBB&&typeof SPAWN!=='undefined'&&SPAWN[0])initWpick();
  if(!P.car&&!P.dead){if(gunGlint()){const g=WTOWER.gun;if(Math.hypot(P.x-g[0],P.y-g[1])<22)giveWeapon('pistol');}
    for(const q of WPICK){if(P.inv.includes(q.w))continue;if(Math.hypot(P.x-q.x,P.y-q.y)<20){if(PRG.lvl<WPN[q.w].lvl){if(!q.warn){q.warn=180;noteAdd(WPN[q.w].n.toUpperCase(),'Pas te pakken vanaf level '+WPN[q.w].lvl+' ('+RANKS[Math.min(RANKS.length-1,WPN[q.w].lvl-1)]+')','#ff6b6b',160);}}else giveWeapon(q.w);}if(q.warn)q.warn--;}}
  if(pressed.KeyQ)setWeapon(1);
  for(const b of BULLETS){for(let s=0;s<3;s++){b.x+=b.vx/3;b.y+=b.vy/3;b.l-=1/3;if(b.l<=0)break;
      if(cellAt(b.x,b.y)===BUILD){b.l=0;for(let i=0;i<5;i++)parts.push({x:b.x,y:b.y,vx:rr(-1.5,1.5),vy:rr(-1.5,1.5),l:12,ml:12,s:1,k:'k'});break;}
      let hit=false;
      for(const t of TARGETS){if(t.hit)continue;if(Math.hypot(t.x-b.x,t.y-b.y)<9){t.hit=1;hit=true;sfx('splash');for(let i=0;i<12;i++)parts.push({x:t.x,y:t.y,vx:rr(-2.5,2.5),vy:rr(-2.5,2.5),l:rr(15,30),ml:30,s:1.5,k:'k'});popTxt(t.x,t.y-12,'RAAK!','#7dff6a',1);break;}}
      if(!hit)for(const p of peds){if(p.state==='down')continue;if(Math.abs(p.x-b.x)<8&&Math.abs(p.y-b.y)<8){knockDown(p,true,Math.atan2(b.vy,b.vx));if(p.kind==='cop')addHeat(1.2);hit=true;break;}}
      if(!hit)for(const c of cars){if(c===P.car||c.dead||c.state!=='ok')continue;const dx=b.x-c.x,dy=b.y-c.y,fx=Math.cos(c.a),fy=Math.sin(c.a),lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(Math.abs(lx)<c.t.l/2&&Math.abs(ly)<c.t.w/2){damageCar(c,b.dmg||12,true);parts.push({x:b.x,y:b.y,vx:0,vy:0,l:10,ml:10,s:1,k:'k'});if(c.driver==='cop')addHeat(.8);hit=true;break;}}
      if(hit){b.l=0;break;}}}
  BULLETS=BULLETS.filter(b=>b.l>0);
  for(const r of ROCKETS){if(r.gren){r.x+=r.vx;r.y+=r.vy;r.vx*=.95;r.vy*=.95;r.z+=r.vz;r.vz-=.35;if(r.z<0){r.z=0;r.vz*=-.4;}if(cellAt(r.x,r.y)===BUILD){r.vx*=-.5;r.vy*=-.5;r.x+=r.vx*2;r.y+=r.vy*2;}if(--r.l<=0)blast(r.x,r.y,70);continue;}
    r.x+=r.vx;r.y+=r.vy;r.l--;if(frameN%2===0)parts.push({x:r.x-r.vx,y:r.y-r.vy,vx:rr(-.3,.3),vy:rr(-.3,.3),l:16,ml:16,s:2.2,k:'f'});
    let hit=r.l<=0||cellAt(r.x,r.y)===BUILD;if(!hit)for(const c of cars){if(c===P.car||c.state!=='ok')continue;if(Math.hypot(c.x-r.x,c.y-r.y)<c.t.l/2+4){hit=true;break;}}
    if(!hit)for(const p of peds)if(p.state!=='down'&&Math.hypot(p.x-r.x,p.y-r.y)<9){hit=true;break;}
    if(hit){r.l=0;blast(r.x,r.y,80);}}
  ROCKETS=ROCKETS.filter(r=>r.l>0);}
function blast(x,y,R){sfx('boom');camHit(Math.max(3,14-Math.hypot(x-camX,y-camY)/60),.06);ring(x,y,R,'rgba(255,170,60,.9)');
  for(let i=0;i<34;i++){const a=rr(0,TAU),v=rr(1,5);parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:rr(18,40),ml:40,s:rr(2,4),k:i%3?'f':'k'});}
  decals.push({x,y,r:R*.35,c:'rgba(20,16,14,.55)'});
  for(const p of peds)if(p.state!=='down'&&Math.hypot(p.x-x,p.y-y)<R){knockDown(p,true,Math.atan2(p.y-y,p.x-x));if(p.kind==='cop')addHeat(1.5);}
  for(const c of cars){if(c.state!=='ok')continue;const d=Math.hypot(c.x-x,c.y-y);if(d<R+10){if(c===P.car)damageCar(c,60,true);else damageCar(c,140,true);if(c.driver==='cop')addHeat(1.2);}}
  if(!P.car&&!P.dead&&Math.hypot(P.x-x,P.y-y)<R*.6){P.lastHit='Opgeblazen door je eigen explosief';hurt(45);}
  panic(x,y,400);addHeat(copNear(500)?1:.3);}
function aimAt(W){let a=P.a,best=null,bd=1e9;const cands=[...peds.filter(p=>p.state!=='down'),...TARGETS.filter(t=>!t.hit)],rg=W.range||420;
  for(const p of cands){const dx=p.x-P.x,dy=p.y-P.y,d=Math.hypot(dx,dy);if(d>rg||d<6)continue;const da=Math.abs(wrap(Math.atan2(dy,dx)-P.a));if(da>W.cone)continue;const sc=d*(1+da*3);if(sc<bd){bd=sc;best=p;}}
  if(best)a=Math.atan2(best.y-P.y,best.x-P.x);return a;}
function fireGun(){if(P.throwCd>0)return;const W=WPN[P.wid];if(!W||P.wid==='balloon')return;P.throwCd=W.cd;
  if(W.grenade){const a=P.a;ROCKETS.push({gren:1,x:P.x+Math.cos(a)*8,y:P.y+Math.sin(a)*8,vx:Math.cos(a)*7,vy:Math.sin(a)*7,z:4,vz:4,l:55});sfx('throw');return;}
  const a=aimAt(W);P.a=a;const sx=P.x+Math.cos(a)*10,sy=P.y+Math.sin(a)*10;
  if(W.rocket){ROCKETS.push({x:sx,y:sy,vx:Math.cos(a)*W.sp,vy:Math.sin(a)*W.sp,l:W.l,a});}
  else for(let i=0;i<W.pel;i++){const b=a+rr(-W.spr,W.spr);BULLETS.push({x:sx,y:sy,vx:Math.cos(b)*W.sp*rr(.93,1.05),vy:Math.sin(b)*W.sp*rr(.93,1.05),l:W.l,sx,sy,dmg:W.dmg});}
  for(let i=0;i<4;i++)parts.push({x:sx+Math.cos(a)*4,y:sy+Math.sin(a)*4,vx:Math.cos(a+rr(-.5,.5))*rr(1,3),vy:Math.sin(a+rr(-.5,.5))*rr(1,3),l:7,ml:7,s:1,k:'k'});
  P.flash=4;camHit(W.kick||2);shotSfx();if(W.rocket)sfx('whoosh');panic(P.x,P.y,260);if(copNear(420))addHeat(W.rocket?.8:.35);}
function wpnIcon(g,w,x,y,wd,ht){const W=WPN[w];if(!W||W.ic<0||!WSHEET.complete)return;g.drawImage(WSHEET,0,W.ic*110,240,110,x,y,wd,ht);}
function shotSfx(){if(!AU.c)return;const t=AU.c.currentTime,S=[AU.sfx];noiseHit(t,.09,.6,'bandpass',1800,S,.8);noiseHit(t+.01,.22,.25,'lowpass',600,S);tone('square',160,t,.001,.01,.06,.12,S,900);}
function drawGunWorld(){
  if(gunGlint()){const g=WTOWER.gun,d=Math.hypot(P.x-g[0],P.y-g[1]);if(Math.abs(g[0]-CAM.x)<1300&&Math.abs(g[1]-CAM.y)<1300){
    if(d<260||(frameN%90)<8){ctx.save();ctx.globalCompositeOperation='lighter';glow(g[0],g[1],d<260?18+6*Math.sin(frameN*.2):12,'rgba(255,255,255,.55)');ctx.restore();}
    ctx.save();ctx.translate(g[0],g[1]);ctx.rotate(.6);ctx.fillStyle='#1d1d1f';ctx.fillRect(-6,-2,12,4);ctx.fillRect(-6,-2,4,8);ctx.fillStyle='#555';ctx.fillRect(2,-1.5,4,1.2);ctx.restore();}}
  for(const t of TARGETS){if(t.hit)continue;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(t.x+2,t.y+3,5,2.5,0,0,TAU);ctx.fill();ctx.fillStyle='#2e7d32';ctx.fillRect(t.x-3,t.y-9,6,11);ctx.fillStyle='#a5d6a7';ctx.fillRect(t.x-1.5,t.y-12,3,4);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(t.x-2,t.y-7,1.5,6);}
  ctx.strokeStyle='rgba(255,230,140,.95)';ctx.lineWidth=2;for(const b of BULLETS){ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.9,b.y-b.vy*.9);ctx.stroke();}
  if(P.flash>0&&!P.car){P.flash--;ctx.save();ctx.globalCompositeOperation='lighter';glow(P.x+Math.cos(P.a)*14,P.y+Math.sin(P.a)*14,26,'rgba(255,200,80,.8)');ctx.restore();}
  if(P.weapon===1&&!P.car&&!P.dead){const L=({rpg:15,bazooka:15,minigun:14,sniper:15,m4:12,ak:12,shotgun:11})[P.wid]||9;ctx.save();ctx.translate(P.x,P.y);ctx.rotate(P.a);ctx.fillStyle='#1d1d1f';ctx.fillRect(7,1.5,L,P.wid==='rpg'||P.wid==='bazooka'||P.wid==='minigun'?4:3);ctx.restore();}
  for(const r of ROCKETS){if(r.gren){ctx.fillStyle='#2f4f1f';ctx.beginPath();ctx.arc(r.x,r.y-r.z,3,0,TAU);ctx.fill();if((r.l>>2)&1){ctx.fillStyle='#ff3b30';ctx.fillRect(r.x-1,r.y-r.z-4,2,2);}continue;}
    ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.a);ctx.fillStyle='#6b7a3a';ctx.fillRect(-6,-2,10,4);ctx.fillStyle='#ffb347';ctx.fillRect(-9,-1.5,3,3);ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';glow(r.x,r.y,14,'rgba(255,160,60,.7)');ctx.restore();}
  for(const q of WPICK){if(P.inv.includes(q.w))continue;if(Math.abs(q.x-CAM.x)>1300||Math.abs(q.y-CAM.y)>1300)continue;const bob=Math.sin(frameN*.08+q.x)*2,lock=PRG.lvl<WPN[q.w].lvl;
    ctx.save();ctx.globalCompositeOperation='lighter';glow(q.x,q.y,22,lock?'rgba(255,80,80,.35)':'rgba(255,46,136,.55)');ctx.restore();
    ctx.strokeStyle=lock?'rgba(255,90,90,.8)':'#ff2e88';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(q.x,q.y,11+Math.sin(frameN*.12)*1.5,0,TAU);ctx.stroke();wpnIcon(ctx,q.w,q.x-14,q.y-7+bob,28,13);}
}
