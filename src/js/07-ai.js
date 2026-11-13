// ====================== AI ======================
function drive(c,tx,ty,want){const d=wrap(Math.atan2(ty-c.y,tx-c.x)-c.a),sp=fwdSpeed(c);if(Math.abs(d)>1.1)want=Math.min(want,2);let th=0;if(sp<want-.2)th=1;else if(sp>want+.5)th=-1;return[th,clamp(d*2.6,-1,1),0];}
function blockedAhead(c){const fx=Math.cos(c.a),fy=Math.sin(c.a),sp=Math.max(0,fwdSpeed(c)),look=26+c.t.l/2+sp*12;
  for(const o of cars){if(o===c||o.dead)continue;const dx=o.x-c.x,dy=o.y-c.y;if(Math.abs(dx)>130||Math.abs(dy)>130)continue;const lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(lx>0&&lx<look+o.t.l/2&&Math.abs(ly)<14)return true;}
  for(const p of peds){if(p.state==='down')continue;const dx=p.x-c.x,dy=p.y-c.y;if(Math.abs(dx)>90||Math.abs(dy)>90)continue;const lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(lx>0&&lx<look&&Math.abs(ly)<14)return true;}
  if(!P.car&&!P.dead){const dx=P.x-c.x,dy=P.y-c.y,lx=dx*fx+dy*fy,ly=-dx*fy+dy*fx;if(lx>0&&lx<look&&Math.abs(ly)<14)return true;}
  return false;}
function pickNext(ai,F){const opts=F.B.adj.filter(k=>k!==ai.e);if(!opts.length)return ai.e;
  // voorkeur voor rechtdoor-achtige keuzes
  const sc=opts.map(k=>{const e=EDGES[k],f=e.a===F.Bid?1:0,G2=edgeFrame(e,f);return{k,d:F.ux*G2.ux+F.uy*G2.uy};});
  if(Math.random()<.55){sc.sort((a,b)=>b.d-a.d);return sc[0].k;}return rpick(opts);}
function aiCivil(c){
  const ai=c.ai;if(ai.stun>0){ai.stun--;return[0,0,1];}
  let e=EDGES[ai.e],F=edgeFrame(e,ai.f),s=(c.x-F.A.x)*F.ux+(c.y-F.A.y)*F.uy;
  if(ai.nx<0)ai.nx=pickNext(ai,F);
  if(e.len-s<14){const Bid=F.Bid;ai.e=ai.nx;e=EDGES[ai.e];ai.f=e.a===Bid?1:0;F=edgeFrame(e,ai.f);s=(c.x-F.A.x)*F.ux+(c.y-F.A.y)*F.uy;ai.nx=pickNext(ai,F);}
  const look=46;let tx,ty;
  if(s+look<=e.len){tx=F.A.x+F.ux*(s+look)+F.nx*e.w/4;ty=F.A.y+F.uy*(s+look)+F.ny*e.w/4;}
  else{const e2=EDGES[ai.nx],f2=e2.a===F.Bid?1:0,G2=edgeFrame(e2,f2),r=Math.min(e2.len,s+look-e.len);tx=G2.A.x+G2.ux*r+G2.nx*e2.w/4;ty=G2.A.y+G2.uy*r+G2.ny*e2.w/4;}
  let want=e.spd*ai.sm;const turn=Math.abs(wrap(Math.atan2(ty-c.y,tx-c.x)-c.a));if(turn>.5)want*=.6;
  if(blockedAhead(c)){if(ai.wait===0&&speedOf(c)>2.4&&!c.t.bike&&Math.random()<.55){const dx=c.x-me().x;if(Math.abs(dx)+Math.abs(c.y-me().y)<700)sfx('brake',clamp(.9-Math.hypot(dx,c.y-me().y)/900,.2,.9),clamp(dx/400,-1,1));}ai.wait++;if(ai.wait===80&&Math.hypot(c.x-me().x,c.y-me().y)<450)sfx(c.t.bike?'bell':'horn');if(ai.wait<200)want=0;else{want=e.spd*.5;if(ai.wait>300)ai.wait=0;}}else ai.wait=0;
  return drive(c,tx,ty,want);
}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/14);for(let i=1;i<n;i++)if(cellAt(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n)===BUILD)return false;return true;}
function findPath(c,tx,ty){const a=nearestEdge(c.x,c.y),e=EDGES[a.ei],A=NODES[e.a],B=NODES[e.b],fx=Math.cos(c.a),fy=Math.sin(c.a);
  const s=((B.x-c.x)*fx+(B.y-c.y)*fy)>((A.x-c.x)*fx+(A.y-c.y)*fy)?e.b:e.a;const b=nearestEdge(tx,ty),e2=EDGES[b.ei];return dijkstra(s,b.t<.5?e2.a:e2.b);}
function exitCops(c){for(let i=0;i<c.ai.cops;i++){const sd=i?1:-1,p=makePed(c.x+Math.sin(c.a)*sd*(c.t.w/2+8),c.y-Math.cos(c.a)*sd*(c.t.w/2+8),'cop');p.state='chase';peds.push(p);}c.ai.cops=0;c.driver=null;c.ai.mode='empty';sfx('door');}
function aiCop(c){
  const ai=c.ai,t=me(),d=Math.hypot(t.x-c.x,t.y-c.y);
  if(!P.car&&!P.dead&&d<160&&Math.abs(fwdSpeed(c))<3&&ai.cops>0){exitCops(c);return[0,0,1];}
  if(ai.rev>0){ai.rev--;return[-1,ai.revS,0];}
  if(Math.abs(fwdSpeed(c))<.5)ai.stuck++;else ai.stuck=0;if(ai.stuck>45){ai.stuck=0;ai.rev=40;ai.revS=Math.random()<.5?1:-1;}
  let tx=t.x,ty=t.y,want=c.t.max;
  if(d<300&&!swimming()&&los(c.x,c.y,t.x,t.y)){tx+=(t.vx||0)*12;ty+=(t.vy||0)*12;if(!P.car&&d<200)want=2.6;}
  else{if(--ai.repath<=0||!ai.path){ai.repath=45;ai.path=findPath(c,t.x,t.y);ai.pi=0;}
    const p=ai.path;if(p&&ai.pi<p.length){let n=NODES[p[ai.pi]];while(ai.pi<p.length-1&&Math.hypot(n.x-c.x,n.y-c.y)<55){ai.pi++;n=NODES[p[ai.pi]];}tx=n.x;ty=n.y;
      if(ai.pi+1<p.length){const n2=NODES[p[ai.pi+1]];if(Math.abs(wrap(Math.atan2(n2.y-ty,n2.x-tx)-Math.atan2(ty-c.y,tx-c.x)))>.6&&Math.hypot(tx-c.x,ty-c.y)<150)want=3.4;}}
    want=Math.min(want,c.t.max*.85);}
  return drive(c,tx,ty,want);
}

