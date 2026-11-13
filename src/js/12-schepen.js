// ====================== binnenvaartschepen op de Waal ======================
let BARGE_PATH=[];
function initBarges(){
  const pts=FORT.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}
  for(let i=pts.length-1;i>=0;i--){const q=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}
  const hull=lo.slice(0,-1).concat(up.slice(0,-1)),c=centroid(hull);
  const line=hull.map(q=>{const dx=q[0]-c[0],dy=q[1]-c[1],l=Math.hypot(dx,dy);return[q[0]+dx/l*360,q[1]+dy/l*360];});line.push(line[0]);
  const L=[0];for(let i=1;i<line.length;i++)L.push(L[i-1]+Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]));const path={line,L,tot:L[L.length-1]};
  for(let i=0;i<3;i++)barges.push({p:path,s:path.tot*i/3,dir:i%2?-1:1,v:rr(.9,1.3),len:rr(380,520),w:rr(56,68),col:rpick(['#2b2f3a','#5a2121','#1f3d2b','#2c3e66']),cargo:rpick(['#6b5a45','#8a8a8a','#c0392b','#3b5998'])});}
function bargeStep(){for(const b of barges){b.s=(b.s+b.v*b.dir+b.p.tot)%b.p.tot;const p=b.p;let i=0;const s=b.s;while(i<p.L.length-2&&s>p.L[i+1])i++;const a=p.line[i],q=p.line[i+1],t=(s-p.L[i])/(p.L[i+1]-p.L[i]||1);
  const ang=Math.atan2(q[1]-a[1],q[0]-a[0]);const ext=0;b.x=a[0]+(q[0]-a[0])*t+Math.cos(ang)*ext;b.y=a[1]+(q[1]-a[1])*t+Math.sin(ang)*ext;b.a=ang+(b.dir<0?Math.PI:0);
  if(frameN%6===0)parts.push({x:b.x-Math.cos(b.a)*b.len/2,y:b.y-Math.sin(b.a)*b.len/2,vx:rr(-.2,.2),vy:rr(-.2,.2),l:90,ml:90,s:10,k:'p'});}}

