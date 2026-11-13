// ====================== wegengraaf ======================
const NODES=[],EDGES=[];
function buildGraph(){
  const map=new Map(),NPC={tertiary:1,residential:1,unclassified:1,living_street:1};
  const node=(k,x,y)=>{let id=k?map.get(k):undefined;if(id===undefined){id=NODES.length;NODES.push({x,y,adj:[]});if(k)map.set(k,id);}return id;};
  ROADS.forEach((r,ri)=>{if(!NPC[r.k])return;let prev=-1;
    r.p.forEach((q,i)=>{const id=node(r.j[i]?'j'+r.j[i]:null,q[0],q[1]);if(prev>=0&&prev!==id){const A=NODES[prev],B=NODES[id],len=Math.hypot(B.x-A.x,B.y-A.y);if(len>2){EDGES.push({a:prev,b:id,len,w:r.w,n:r.n,spd:r.k==='tertiary'?3.8:r.fort?2.5:3.1});A.adj.push(EDGES.length-1);B.adj.push(EDGES.length-1);}}prev=id;});});
}
function nearestEdge(x,y){let best=null,bd=1e18;for(let i=0;i<EDGES.length;i++){const e=EDGES[i],A=NODES[e.a],B=NODES[e.b];if(Math.abs(A.x-x)>900&&Math.abs(B.x-x)>900)continue;const dx=B.x-A.x,dy=B.y-A.y;let t=((x-A.x)*dx+(y-A.y)*dy)/(e.len*e.len);t=clamp(t,0,1);const qx=A.x+dx*t-x,qy=A.y+dy*t-y,d=qx*qx+qy*qy;if(d<bd){bd=d;best={ei:i,t,d:Math.sqrt(d)};}}
  if(!best){for(let i=0;i<EDGES.length;i++){const e=EDGES[i],A=NODES[e.a],d=Math.hypot(A.x-x,A.y-y);if(d<bd){bd=d;best={ei:i,t:0,d};}}}return best;}
function dijkstra(s,g){const n=NODES.length,dist=new Float64Array(n).fill(Infinity),prev=new Int32Array(n).fill(-1),h=[[0,s]];dist[s]=0;
  while(h.length){let bi=0;for(let i=1;i<h.length;i++)if(h[i][0]<h[bi][0])bi=i;const [d,u]=h[bi];h[bi]=h[h.length-1];h.pop();if(d>dist[u])continue;if(u===g)break;
    for(const ei of NODES[u].adj){const e=EDGES[ei],v=e.a===u?e.b:e.a,nd=d+e.len;if(nd<dist[v]){dist[v]=nd;prev[v]=u;h.push([nd,v]);}}}
  const path=[];let c=g;while(c>=0){path.unshift(c);if(c===s)break;c=prev[c];}return path[0]===s?path:[g];}

