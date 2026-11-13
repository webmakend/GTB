// ====================== politie ======================
function ambientStep(){if(!AU.c||MODE!=='play'||paused)return;const t=AU.c.currentTime,o=me();
  let n=0;for(const c of cars){if(c===P.car||c.dead||!c.driver)continue;const d=Math.hypot(c.x-o.x,c.y-o.y);if(d<700)n++;
    if(d<170&&speedOf(c)>2.2&&!(c.passCd>frameN)){c.passCd=frameN+180;if(!c.t.ev)sfx('whoosh',clamp(speedOf(c)/5,.4,1.2),clamp((c.x-o.x)/170,-1,1));}}
  AU.tbg.gain.setTargetAtTime(Math.min(.06,.01+n*.0045),t,.6);
  let wn=0;for(const [dx,dy] of [[0,-160],[0,160],[-160,0],[160,0],[0,0]])if(cellAt(o.x+dx,o.y+dy)===WATER)wn++;AU.wlg.gain.setTargetAtTime(wn*.006*(1+.5*Math.sin(t*.9)),t,.4);
  if(n>0&&Math.random()<.004)sfx('moped',rr(.6,1.1),rr(-1,1));
  if(n>1&&Math.random()<.0025)sfx('rumble',rr(.6,1));
  if(n>1&&Math.random()<.003)sfx('horn');
  for(const p of peds){if(!p.dog||p.state==='down')continue;const d=Math.hypot(p.dog.x-o.x,p.dog.y-o.y);if(d<520&&Math.random()<(d<120?.012:.0025)){sfx('bark',clamp(1.1-d/600,.25,1.1));p.dog.bark=14;}}
  if(n>2&&Math.random()<.012){const c=rpick(cars);if(c&&c.driver==='npc'&&Math.hypot(c.x-o.x,c.y-o.y)<600)sfx(c.t.bike?'bell':'horn');}
  if(BEACH&&Math.hypot(o.x-(BEACH.bb[0]+BEACH.bb[2])/2,o.y-BEACH.bb[1])<2600&&o.y<BEACH.bb[3]+900&&Math.random()<.02)sfx('gull');
  const gk=LANDMARKS.find(l=>l.n==='Grote of Sint-Maartenskerk');if(gk&&Math.hypot(gk.x-o.x,gk.y-o.y)<1100&&Math.random()<.0025)sfx('bellc');
  let pn=0;for(const p of peds)if(p.state!=='down'&&Math.hypot(p.x-o.x,p.y-o.y)<260)pn++;if(pn>3&&Math.random()<.03)sfx('blip',rr(200,460));}
function engineUpdate(){if(!AU.c)return;const t=AU.c.currentTime,c=P.car;
  if(!c||c.state==='wreck'||c.sink>0||P.dead){AU.eg.gain.setTargetAtTime(0,t,.08);AU.wg.gain.setTargetAtTime(0,t,.08);AU.skg.gain.setTargetAtTime(0,t,.05);return;}
  const fs=fwdSpeed(c),fwd=Math.abs(fs),th=c.ctl[0],hb=c.ctl[2],fx=Math.cos(c.a),fy=Math.sin(c.a),lat=Math.abs(-c.vx*fy+c.vy*fx);
  if(c.t.ev){AU.wo.frequency.setTargetAtTime(200+fwd*55,t,.05);AU.wg.gain.setTargetAtTime(th>0?.022+fwd*.003:.008,t,.1);AU.eg.gain.setTargetAtTime(0,t,.05);}
  else{const span=c.t.max/4,g=Math.min(3,Math.floor(fwd/span)),r=(fwd-g*span)/span,rpm=fwd<.3?0:(g===0?r:.35+.65*r),base=c.t.eng||36,f=base*(1+rpm*1.6+(th>0?.15:0));
    AU.eo.frequency.setTargetAtTime(f,t,.06);AU.eo2.frequency.setTargetAtTime(f*.5,t,.06);AU.ef.frequency.setTargetAtTime(th>0?500+rpm*1500:280+rpm*500,t,.08);AU.eg.gain.setTargetAtTime((th>0?.075:.035)+rpm*.03,t,.08);AU.wg.gain.setTargetAtTime(0,t,.05);}
  let sq=Math.max(0,(lat-1.4)*.045)+(th<0&&fs>2.2?.06:0)+(hb&&fwd>2?.07:0);sq=Math.min(.16,sq);if(c.t.ev||c.type==='tractor')sq*=.35;
  const braking=(th<0&&fs>2.2)||(hb&&fwd>2.4);if(braking&&!c.brk&&fwd>2.6&&c.type!=='tractor'&&!c.t.bike){sfx('brake',clamp(fwd/6,.4,1.2));buzz(20);}c.brk=braking;
  AU.skg.gain.setTargetAtTime(sq,t,.04);AU.sbf.frequency.setTargetAtTime(2100+fwd*90,t,.05);}
function addHeat(v){heat=Math.min(5.99,heat+v);}
function copNear(r){const t=me();for(const c of cars)if(c.driver==='cop'&&Math.hypot(c.x-t.x,c.y-t.y)<r)return true;for(const p of peds)if(p.kind==='cop'&&p.state!=='down'&&Math.hypot(p.x-t.x,p.y-t.y)<r)return true;return false;}
let copCd=0;
function wantedStep(){
  if(P.heatCd>0)P.heatCd--;if(!copNear(500))heat=Math.max(0,heat-.0026);stars=Math.min(5,Math.floor(heat));
  for(const c of cars){if(c.driver!=='cop'||!c.ai)continue;if(stars>0&&c.ai.mode==='patrol'&&Math.hypot(c.x-me().x,c.y-me().y)<450)c.ai.mode='pursuit';
    if(stars===0&&c.ai.mode==='pursuit'){const ne=nearestEdge(c.x,c.y),e=EDGES[ne.ei];c.ai.e=ne.ei;c.ai.nx=-1;c.ai.f=Math.cos(c.a)*(NODES[e.b].x-NODES[e.a].x)+Math.sin(c.a)*(NODES[e.b].y-NODES[e.a].y)>0?1:0;c.ai.mode='patrol';}}
  if(stars>0){const want=Math.min(6,stars*2-1);let have=0,cp=0;for(const c of cars)if(c.driver==='cop'&&c.ai&&c.ai.mode==='pursuit')have++;for(const p of peds)if(p.kind==='cop'&&p.state!=='down')cp++;have+=cp/2|0;if(--copCd<=0&&have<want){spawnCop();copCd=100;}}
  if(copTouch&&!P.dead){P.bust++;if(P.bust>50)busted();}else P.bust=Math.max(0,P.bust-2);copTouch=false;
  if(AU.c&&frameN%10===0){let near=false;for(const c of cars)if(c.driver==='cop'&&c.ai&&c.ai.mode==='pursuit'&&Math.hypot(c.x-me().x,c.y-me().y)<700){near=true;break;}AU.sg.gain.setTargetAtTime(near?.03:0,AU.c.currentTime,.2);
}
  if(frameN%3===0)engineUpdate();if(frameN%6===0)ambientStep();
}

