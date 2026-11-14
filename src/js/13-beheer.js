// ====================== beheer ======================
function manage(){
  const o=me();
  cars=cars.filter(c=>{if(c.dead)return false;if(c===P.car||c.keep)return true;const d=Math.hypot(c.x-o.x,c.y-o.y);if(c.driver==='cop'&&c.ai&&c.ai.mode==='pursuit'&&stars>0)return d<3000;return d<Math.max(1700,viewR()+900)||!offscreen(c.x,c.y,40);});
  peds=peds.filter(p=>{const d=Math.hypot(p.x-o.x,p.y-o.y);if(p.kind==='cop'&&stars>0)return d<1500;return d<Math.max(1250,viewR()+600)||!offscreen(p.x,p.y,30);});
  let nc=0;for(const c of cars)if(c.driver!=='cop'&&c!==P.car&&Math.hypot(c.x-o.x,c.y-o.y)<Math.max(1400,viewR()+500))nc++;const dens=clamp(viewR()/800,1,2.4);
  for(let i=0;i<2&&nc<(IS_TOUCH?18:22)*dens;i++,nc++)spawnCivCar(false);
  let np=0;for(const p of peds)np++;for(let i=0;i<2&&np<(IS_TOUCH?40:50)*dens;i++,np++)spawnPed(false);
  for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vx*=.95;p.vy*=.95;p.l--;if(p.k==='s')p.s+=.15;}
  parts=parts.filter(p=>p.l>0);if(parts.length>600)parts.splice(0,parts.length-600);
  for(const f of FX)f.l--;FX=FX.filter(f=>f.l>0);for(const k of SKIDS)k.l--;SKIDS=SKIDS.filter(k=>k.l>0);if(SKIDS.length>700)SKIDS.splice(0,SKIDS.length-700);
  if(P.hurtF>0)P.hurtF--;if(P.squash>0)P.squash--;
  if(!P.car&&!P.dead&&!(P.jz>0)&&!swimming()&&inp().run&&frameN%5===0&&(Math.abs(touch.jx)+Math.abs(touch.jy)>.9||keys.ShiftLeft||keys.ShiftRight))parts.push({x:P.x-Math.cos(P.a)*6+rr(-2,2),y:P.y-Math.sin(P.a)*6+rr(-2,2),vx:-Math.cos(P.a)*.4,vy:-Math.sin(P.a)*.4,l:24,ml:24,s:2.5,k:'d'});
  if(P.car&&P.car.state!=='wreck'){const c=P.car,fs=fwdSpeed(c),fx2=Math.cos(c.a),fy2=Math.sin(c.a),lat=Math.abs(-c.vx*fy2+c.vy*fx2),br=(c.ctl[0]<0&&fs>2.2)||(c.ctl[2]&&Math.abs(fs)>2);
    if((lat>1.6||br)&&!c.t.bike){const hl=c.t.l/2-4,hw=c.t.w/2-2;for(const sd of [-1,1]){const x=c.x-fx2*hl-fy2*hw*sd,y=c.y-fy2*hl+fx2*hw*sd,key='sk'+sd;const pv=c[key];if(pv&&Math.hypot(pv[0]-x,pv[1]-y)<30)SKIDS.push({x0:pv[0],y0:pv[1],x1:x,y1:y,l:900});c[key]=[x,y];}
      if(frameN%3===0)parts.push({x:c.x-fx2*hl,y:c.y-fy2*hl,vx:rr(-.3,.3),vy:rr(-.3,.3),l:30,ml:30,s:4,k:'s'});}else{c.sk1=null;c['sk-1']=null;}}
  for(const d of decals)d.life--;decals=decals.filter(d=>d.life>0);if(decals.length>400)decals.splice(0,decals.length-400);
  for(const b of bubbles)b.life--;bubbles=bubbles.filter(b=>b.life>0&&(peds.includes(b.p)||cars.includes(b.p)||BWALK.includes(b.p)||BEACHERS.includes(b.p)));
  if(frameN%140===0){const cand=cars.filter(c=>c.driver==='npc'&&(c.rider||c.boer)&&!offscreen(c.x,c.y,-40));if(cand.length){const c=rpick(cand);say(c,c.boer?rpick(SAY_BOER).replace('#',c.boer):rpick(SAY_FAT));}}
  if(frameN%15===0){let rn='';const ne=nearestEdge(o.x,o.y);if(ne&&ne.d<EDGES[ne.ei].w/2+24)rn=EDGES[ne.ei].n;
    let lm='';for(const l of LANDMARKS){if(Math.hypot(l.x-o.x,l.y-o.y)<(l.shop?90:200)){lm=l.n;break;}}
    placeName=swimming()?(o.y<H*.25?'Zwemmen in de Waal':'Zwemmen in de stadsgracht'):[lm,rn].filter(Boolean).join(' · ')||(inFort(o.x,o.y)?'Vesting Zaltbommel':'Zaltbommel');}
}
function step(){
  frameN++;playerStep();actStep();gunStep();radioStep();progStep();jobStep();
  for(const c of cars){if(c.dead)continue;if(c===P.car){}else if(c.driver==='npc'&&c.ai)c.ctl=aiCivil(c);else if(c.driver==='cop'&&c.ai)c.ctl=c.ai.mode==='pursuit'?aiCop(c):aiCivil(c);else c.ctl=[0,0,1];carStep(c);}
  carCollisions();carPedHits();for(const p of peds)pedStep(p);missionStep();balloonStep();bargeStep();wantedStep();manage();
  for(const m of msgs)m.life--;while(msgs.length&&msgs[0].life<=0)msgs.shift();
  cameraStep();
  for(const k in pressed)delete pressed[k];touch.enter=false;touch.jump=false;
}

