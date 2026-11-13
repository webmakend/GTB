// ====================== grond-chunks (vector) ======================
const CS=512,chunkCache=new Map();let PATS=null;
function mkPat(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
function buildPats(){seed=77;
  const noise=(g,w,h,base,cols,n,s)=>{g.fillStyle=base;g.fillRect(0,0,w,h);for(let i=0;i<n;i++){g.fillStyle=RP(cols);g.fillRect(R(0,w),R(0,h),R(1,s),R(1,s));}};
  PATS={
   grass:mkPat(96,96,(g,w,h)=>noise(g,w,h,'#6d9a4c',['#76a354','#64904a','#7aa85a','#5f8a45'],900,3)),
   park:mkPat(96,96,(g,w,h)=>noise(g,w,h,'#5d8f45',['#669a4c','#558641','#6aa152','#507d3d'],900,3)),
   asphalt:mkPat(64,64,(g,w,h)=>noise(g,w,h,'#4a4b4f',['#525357','#45464a','#57585c','#404145'],700,2)),
   brick:mkPat(24,24,(g,w,h)=>{g.fillStyle='#7d5446';g.fillRect(0,0,w,h);const cs=['#8a5d4c','#93634f','#7f5545','#86604f','#9a6a55'];for(let y=0;y<4;y++)for(let x=0;x<3;x++){g.fillStyle=cs[(x*7+y*3)%5];g.fillRect(x*8+(y%2?4:0)-8+.5,y*6+.5,7,5);g.fillRect(x*8+(y%2?4:0)+16.5,y*6+.5,7,5);}}),
   pave:mkPat(32,32,(g,w,h)=>{g.fillStyle='#c2bdb2';g.fillRect(0,0,w,h);g.strokeStyle='rgba(90,85,75,.22)';g.lineWidth=1;for(let i=0;i<=32;i+=16){g.beginPath();g.moveTo(i+.5,0);g.lineTo(i+.5,32);g.stroke();g.beginPath();g.moveTo(0,i+.5);g.lineTo(32,i+.5);g.stroke();}}),
   plaza:mkPat(20,20,(g,w,h)=>{g.fillStyle='#b9ab95';g.fillRect(0,0,w,h);const cs=['#c2b49e','#ae9f88','#bba98f','#c7bba5'];for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=cs[(x+y*3)%4];g.fillRect(x*5+.5,y*5+.5,4,4);}}),
   water:mkPat(128,128,(g,w,h)=>{g.fillStyle='#3d6d8c';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.fillStyle=i%2?'rgba(255,255,255,.07)':'rgba(10,30,50,.10)';g.fillRect(R(0,w),R(0,h),R(8,22),2);}}),
   sand:mkPat(48,48,(g,w,h)=>noise(g,w,h,'#d8c592',['#e0ce9c','#cdb985','#d3c08c'],300,2)),
   park2:null};
}
function pathPoly(g,p){g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1]);}
function inBox(bb,x0,y0,x1,y1,m){return !(bb[2]+m<x0||bb[0]-m>x1||bb[3]+m<y0||bb[1]-m>y1);}
function renderChunk(ci,cj){
  const c=document.createElement('canvas');c.width=c.height=CS;const g=c.getContext('2d');const ox=ci*CS,oy=cj*CS,X1=ox+CS,Y1=oy+CS;
  const pat=k=>g.createPattern(PATS[k],'repeat');
  g.translate(-ox,-oy);g.lineCap='round';g.lineJoin='round';
  g.fillStyle=pat('water');g.fillRect(ox,oy,CS,CS);
  if(BEACH&&inBox(BEACH.bb,ox,oy,X1,Y1,40)){pathPoly(g,BEACH);g.closePath();g.strokeStyle='rgba(225,210,160,.55)';g.lineWidth=26;g.stroke();g.fillStyle=pat('sand');g.fill();g.strokeStyle='rgba(150,125,80,.35)';g.lineWidth=6;g.stroke();}
  g.save();pathPoly(g,FORT);g.closePath();g.strokeStyle='#8f8a80';g.lineWidth=12;g.stroke();g.clip();g.fillStyle=pat('grass');g.fillRect(ox,oy,CS,CS);
  const fillPolys=(list,style,stroke,lw)=>{for(const p of list){if(!p.bb)p.bb=bbox(p);if(!inBox(p.bb,ox,oy,X1,Y1,20))continue;pathPoly(g,p);g.closePath();g.fillStyle=style;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}}};
  fillPolys(WD.green,pat('park'));
  fillPolys(WD.sand,pat('sand'));
  fillPolys(WATERS,pat('water'),'#8f8a80',6);
  fillPolys(WD.islands,pat('park'),'#8f8a80',5);
  fillPolys(WD.parking,'#8e8f8f','#77787a',2);
  g.restore();
  // winkelcentrum Klipperstraat (buiten de vesting)
  if(KLIP&&inBox([KLIP.x0,KLIP.y0,KLIP.x1,KLIP.y1],ox,oy,X1,Y1,20)){const k=KLIP;g.fillStyle=pat('park');g.strokeStyle='#8f8a80';g.lineWidth=8;g.beginPath();g.rect(k.x0,k.y0,k.x1-k.x0,k.y1-k.y0);g.fill();g.stroke();
    for(const p of WD.parking){if(!p.bb)p.bb=bbox(p);if(p.bb[0]<k.x0)continue;pathPoly(g,p);g.closePath();g.fillStyle='#8e8f8f';g.fill();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;for(let x=p.bb[0]+20;x<p.bb[2]-10;x+=34){g.beginPath();g.moveTo(x,p.bb[1]+10);g.lineTo(x,p.bb[1]+90);g.stroke();g.beginPath();g.moveTo(x,p.bb[3]-90);g.lineTo(x,p.bb[3]-10);g.stroke();}}}
  // stoepen
  const RV=ROADS.filter(r=>inBox(r.bb,ox,oy,X1,Y1,r.w+70));
  g.strokeStyle=pat('pave');for(const r of RV){g.lineWidth=r.w+(r.fort?88:44);pathPoly(g,r.p);g.stroke();}
  fillPolys(WD.plaza,pat('plaza'));
  // paden en fietspaden
  for(const p of PATHS){if(!inBox(p.bb,ox,oy,X1,Y1,30))continue;g.strokeStyle=p.k==='cycleway'?'#a3584a':p.k==='footway'?'#c7c0b2':p.k==='track'?'#a89474':'#b7a684';g.lineWidth=p.w;for(const q of p.segs){pathPoly(g,q);g.stroke();}}
  // rijbaan
  g.strokeStyle='#6d6a64';for(const r of RV){if(r.k==='pedestrian')continue;g.lineWidth=r.w+4;pathPoly(g,r.p);g.stroke();}
  for(const r of RV){g.strokeStyle=r.k==='pedestrian'?pat('plaza'):r.brick?pat('brick'):pat('asphalt');g.lineWidth=r.w;pathPoly(g,r.p);g.stroke();}
  for(const r of RV){if(!r.bridge)continue;g.strokeStyle='#e8e2d4';g.lineWidth=3;for(const o of [-r.w/2+6,r.w/2-6]){const dx=r.p[1][0]-r.p[0][0],dy=r.p[1][1]-r.p[0][1],l=Math.hypot(dx,dy),nx=-dy/l*o,ny=dx/l*o;g.beginPath();g.moveTo(r.p[0][0]+nx,r.p[0][1]+ny);g.lineTo(r.p[1][0]+nx,r.p[1][1]+ny);g.stroke();}}
  for(const r of RV){if(r.brick||r.w<60)continue;g.setLineDash([22,20]);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=2.5;pathPoly(g,r.p);g.stroke();g.setLineDash([]);}
  // brugleuningen
  g.fillStyle='#d6d0c4';
  const cx0=Math.floor(ox/T),cy0=Math.floor(oy/T);
  for(let cy=cy0;cy<Math.min(GH,cy0+CS/T);cy++)for(let cx=cx0;cx<Math.min(GW,cx0+CS/T);cx++){const i=cy*GW+cx;if(!BRG[i]||G[i]===WATER)continue;const wt=(x,y)=>x>=0&&y>=0&&x<GW&&y<GH&&G[y*GW+x]===WATER;const X=cx*T,Y=cy*T;
    if(wt(cx-1,cy))g.fillRect(X,Y,3,T);if(wt(cx+1,cy))g.fillRect(X+T-3,Y,3,T);if(wt(cx,cy-1))g.fillRect(X,Y,T,3);if(wt(cx,cy+1))g.fillRect(X,Y+T-3,T,3);}
  // schaduwen van gebouwen en bomen (zon uit het noordwesten)
  const sl=document.createElement('canvas');sl.width=sl.height=CS;const s=sl.getContext('2d');s.translate(-ox,-oy);s.fillStyle='#000';
  for(const b of BUILDINGS){if(!inBox(b.bb,ox,oy,X1,Y1,b.ht*1.2+10))continue;const dx=Math.min(b.ht,90)*.55,dy=Math.min(b.ht,90)*.38,p=b.p;
    s.beginPath();for(let i=0;i<p.length;i++){const a=p[i],q=p[(i+1)%p.length];s.moveTo(a[0],a[1]);s.lineTo(q[0],q[1]);s.lineTo(q[0]+dx,q[1]+dy);s.lineTo(a[0]+dx,a[1]+dy);s.closePath();}s.fill();
    pathPoly(s,p.map(q=>[q[0]+dx,q[1]+dy]));s.closePath();s.fill();}
  for(const t of TREES){if(t.x+t.r+12<ox||t.x-t.r>X1||t.y+t.r+12<oy||t.y-t.r>Y1)continue;s.beginPath();s.arc(t.x+8,t.y+6,t.r,0,TAU);s.fill();}
  g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.3;g.drawImage(sl,0,0);g.restore();
  // terrassen
  for(const t of TERRACE){if(t.x<ox-30||t.x>X1+30||t.y<oy-30||t.y>Y1+30)continue;g.fillStyle='#4a3a30';for(const a of [0,1.57,3.14,4.71])g.fillRect(t.x+Math.cos(a)*9-2,t.y+Math.sin(a)*9-2,4,4);
    g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(t.x+4,t.y+3,13,0,TAU);g.fill();g.fillStyle=t.c;g.beginPath();for(let k=0;k<8;k++){const a=k/8*TAU;g.lineTo(t.x+Math.cos(a)*13,t.y+Math.sin(a)*13);}g.closePath();g.fill();
    g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;for(let k=0;k<4;k++){const a=k/4*Math.PI;g.beginPath();g.moveTo(t.x-Math.cos(a)*13,t.y-Math.sin(a)*13);g.lineTo(t.x+Math.cos(a)*13,t.y+Math.sin(a)*13);g.stroke();}}
  g.fillStyle='#2a2730';for(const l of LAMPS){if(l.x<ox-6||l.x>X1+6||l.y<oy-6||l.y>Y1+6)continue;g.beginPath();g.arc(l.x,l.y,3.2,0,TAU);g.fill();}
  // waternamen
  g.textAlign='center';g.textBaseline='middle';g.font='italic 120px Anton, Impact, sans-serif';g.fillStyle='rgba(255,255,255,.13)';
  for(const [t,x,y] of [['DE WAAL',W*.45,260],['STADSGRACHT',W*.5,H-200]])if(x>ox-800&&x<X1+800&&y>oy-200&&y<Y1+200)g.fillText(t,x,y);
  return c;
}
function getChunk(ci,cj){const k=ci+','+cj;let c=chunkCache.get(k);if(c){chunkCache.delete(k);chunkCache.set(k,c);return c;}c=renderChunk(ci,cj);chunkCache.set(k,c);if(chunkCache.size>Math.max(IS_TOUCH?42:70,Math.ceil(CW/viewZ()/CS+2)*Math.ceil(CH/viewZ()/CS+2)+10))chunkCache.delete(chunkCache.keys().next().value);return c;}

