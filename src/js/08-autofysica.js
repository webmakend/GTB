// ====================== autofysica ======================
const CPTS=[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
function carBlocked(c,x,y,a){const fx=Math.cos(a),fy=Math.sin(a),hl=c.t.l/2,hw=c.t.w/2;for(const [u,v] of CPTS)if(cellAt(x+fx*u*hl-fy*v*hw,y+fy*u*hl+fx*v*hw)===BUILD)return true;return false;}
function carStep(c){
  if(c.hitCd>0)c.hitCd--;let [th,st,hb]=c.ctl;if(c.state==='wreck'){th=0;st=0;hb=1;}
  c.prevA=c.a;const t=c.t,fx=Math.cos(c.a),fy=Math.sin(c.a);let fwd=c.vx*fx+c.vy*fy,lat=-c.vx*fy+c.vy*fx;
  const g=cellAt(c.x,c.y),rough=g===GRASS||g===PARK||g===SAND;const pk=c===P.car&&P.ch?P.ch.perk.drive:1,max=t.max*pk*(rough?.6:1)*(c.hp<35?.75:1);
  if(th>0){if(fwd<max)fwd+=t.acc*th*(fwd<0?2:1);}else if(th<0){if(fwd>.3)fwd-=t.acc*2.2*-th;else if(fwd>-max*.45)fwd-=t.acc*.7*-th;}
  fwd*=th===0?.983:.994;if(rough)fwd*=.985;if(hb)fwd*=.972;lat*=hb?.95:Math.max(.7,t.grip-(pk-1)*.5);
  c.a+=st*t.turn*Math.min(1,Math.abs(fwd)/2.2)*(fwd<0?-1:1)*(hb?1.35:1);
  c.vx=fx*fwd-fy*lat;c.vy=fy*fwd+fx*lat;
  if(Math.abs(lat)>2.3&&frameN%2===0)decals.push({x:c.x-fx*t.l*.35,y:c.y-fy*t.l*.35,r:3,c:'rgba(20,20,20,.3)',life:500});
  let hit=0;
  if(carBlocked(c,c.x,c.y,c.prevA)){c.x+=c.vx;c.y+=c.vy;}
  else{if(carBlocked(c,c.x+c.vx,c.y,c.a)){hit=Math.abs(c.vx);c.vx*=-.25;}else c.x+=c.vx;
    if(carBlocked(c,c.x,c.y+c.vy,c.a)){hit=Math.max(hit,Math.abs(c.vy));c.vy*=-.25;}else c.y+=c.vy;
    if(carBlocked(c,c.x,c.y,c.a))c.a=c.prevA;}
  if(hit>2.3){damageCar(c,(hit-2)*6,c===P.car);sparks(c.x+fx*t.l/2,c.y+fy*t.l/2,6);if(c===P.car){camHit(Math.min(11,hit*1.8),hit>3.5?Math.min(.06,hit*.008):0);sfx('crash',hit);if(hit>3.5){hitStop=Math.max(hitStop,hit>5?6:3);ring(c.x+fx*t.l/2,c.y+fy*t.l/2,40,'rgba(255,220,120,.95)');buzz(40);}if(hit>5)popTxt(c.x,c.y-14,rpick(['KRAK!','BOEM!','AUW!']),'#ffd166',1.2);}panic(c.x,c.y,140);}
  if(cellAt(c.x,c.y)===WATER){c.sink++;c.vx*=.9;c.vy*=.9;if(frameN%4===0)parts.push({x:c.x+rr(-15,15),y:c.y+rr(-15,15),vx:rr(-1,1),vy:rr(-1,1),l:30,ml:30,s:6,k:'p'});
    if(c.sink===2&&c===P.car)sfx('splash');if(c.sink===40&&P.car===c){P.car=null;c.driver=null;P.x=c.x;P.y=c.y;msg('PLONS!','Zwem naar de kant','#36d1ff',120);}if(c.sink>70)c.dead=1;}
  if(c.state==='burning'){c.burn--;if(frameN%2===0)parts.push({x:c.x+rr(-8,8),y:c.y+rr(-8,8),vx:rr(-.4,.4),vy:rr(-.4,.4),l:40,ml:40,s:rr(5,10),k:'f'});if(frameN%5===0)parts.push({x:c.x,y:c.y,vx:rr(-.5,.5),vy:rr(-.5,.5),l:90,ml:90,s:rr(8,14),k:'s'});if(c.burn<=0)explode(c);}
}
function damageCar(c,d,byPlayer){if(c.state!=='ok')return;c.hp-=d;
  if(byPlayer&&c.type==='police'&&c!==P.car&&P.heatCd<=0){addHeat(.35);P.heatCd=40;}
  if(c.hp<=0){c.state='burning';c.burn=170;if(c===P.car)msg('STAP UIT!','Je auto staat in brand','#ff6b3d',120);if(c.driver==='npc')ejectDriver(c);else if(c.driver==='cop')exitCops(c);}}
function ejectDriver(c){const p=makePed(c.x+Math.sin(c.a)*(c.t.w/2+8),c.y-Math.cos(c.a)*(c.t.w/2+8),c.boer?'boer':'civ');if(c.boer)p.dorp=c.boer;if(c.rider)p.col=c.rider;flee(p,me().x,me().y,300);
  say(p,c.boer?rpick(['Mien trekker!','Hee, da\'s mijne trekker!','Ik bel de veldwachter!']):c.t.bike?rpick(['Mijn fatbike!','Hé, terug jij!','Die was gloednieuw!']):rpick(['Mijn auto!','Hé, dief!','Politie!!','Echt niet normaal!']));peds.push(p);c.driver=null;}
function explode(c){c.state='wreck';c.burn=0;c.vx*=.2;c.vy*=.2;camHit(Math.max(0,14-Math.hypot(c.x-camX,c.y-camY)/60),.07);sfx('boom');
  for(let i=0;i<34;i++){const a=rr(0,TAU),s=rr(1,5);parts.push({x:c.x,y:c.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(25,50),ml:50,s:rr(6,14),k:'f'});}
  for(let i=0;i<18;i++){const a=rr(0,TAU),s=rr(.3,1.6);parts.push({x:c.x,y:c.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(80,140),ml:140,s:rr(10,20),k:'s'});}
  decals.push({x:c.x,y:c.y,r:32,c:'rgba(20,18,16,.5)',life:3000});panic(c.x,c.y,400);
  for(const p of peds)if(p.state!=='down'&&Math.hypot(p.x-c.x,p.y-c.y)<85)knockDown(p,false,Math.atan2(p.y-c.y,p.x-c.x));
  for(const o of cars)if(o!==c&&o.state==='ok'&&Math.hypot(o.x-c.x,o.y-c.y)<95){damageCar(o,70,false);const a=Math.atan2(o.y-c.y,o.x-c.x);o.vx+=Math.cos(a)*3;o.vy+=Math.sin(a)*3;}
  if(P.car===c){P.car.driver=null;P.car=null;wasted('WASTED');}else if(!P.car&&!P.dead&&Math.hypot(P.x-c.x,P.y-c.y)<85)hurt(70);}
function carCircles(c){const fx=Math.cos(c.a),fy=Math.sin(c.a),o=(c.t.l-c.t.w)/2;return[[c.x+fx*o,c.y+fy*o],[c.x,c.y],[c.x-fx*o,c.y-fy*o]];}
function carCollisions(){
  for(let i=0;i<cars.length;i++){const a=cars[i];if(a.dead)continue;
    for(let j=i+1;j<cars.length;j++){const b=cars[j];if(b.dead)continue;const lim=(a.t.l+b.t.l)/2+4;if(Math.abs(a.x-b.x)>lim||Math.abs(a.y-b.y)>lim)continue;
      const ca=carCircles(a),cb=carCircles(b),ra=a.t.w/2+1,rb=b.t.w/2+1;let best=0,nx=0,ny=0;
      for(const p of ca)for(const q of cb){const dx=p[0]-q[0],dy=p[1]-q[1],d=Math.hypot(dx,dy),o=ra+rb-d;if(o>best&&d>.01){best=o;nx=dx/d;ny=dy/d;}}
      if(best<=0)continue;const ma=a.state==='wreck'||(!a.driver&&a!==P.car)?1.6:1,mb=b.state==='wreck'||(!b.driver&&b!==P.car)?1.6:1,sum=ma+mb,pa=best*mb/sum,pb=best*ma/sum;
      if(!carBlocked(a,a.x+nx*pa,a.y+ny*pa,a.a)){a.x+=nx*pa;a.y+=ny*pa;}if(!carBlocked(b,b.x-nx*pb,b.y-ny*pb,b.a)){b.x-=nx*pb;b.y-=ny*pb;}
      const vrel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
      if(vrel<0){const jj=-1.3*vrel/sum;a.vx+=jj*nx*mb;a.vy+=jj*ny*mb;b.vx-=jj*nx*ma;b.vy-=jj*ny*ma;const imp=-vrel;
        if(imp>1.6){const pl=a===P.car||b===P.car;damageCar(a,(imp-1.2)*5,pl);damageCar(b,(imp-1.2)*5,pl);sparks((a.x+b.x)/2,(a.y+b.y)/2,4+imp|0);if(pl){camHit(Math.min(9,imp*1.4),imp>3?.03:0);sfx('crash',imp);}if(imp>3)panic(a.x,a.y,160);
          for(const c of [a,b])if(c.ai&&c.ai.mode==='civ'&&imp>2.5)c.ai.stun=50;}}}}}
function sparks(x,y,n){for(let i=0;i<n;i++){const a=rr(0,TAU),s=rr(1,4);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rr(10,22),ml:22,s:2,k:'k'});}}

