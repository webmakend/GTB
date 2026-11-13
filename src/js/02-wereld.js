// ====================== wereld uit OpenStreetMap ======================
const WD=JSON.parse(document.getElementById('wdata').textContent);
const W=WD.W,H=WD.H,T=16,GW=Math.ceil(W/T),GH=Math.ceil(H/T);
const GRASS=0,ROAD=1,WALK=2,BUILD=3,WATER=4,PARK=5,PLAZA=6,PATH=7,SAND=8;
const G=new Uint8Array(GW*GH),BRG=new Uint8Array(GW*GH);
const FORT=WD.fort,FORTBB=bbox(FORT);let BRIDGE=null,LAMPS=[],KLIP=null;
const inFort=(x,y)=>x>FORTBB[0]&&x<FORTBB[2]&&y>FORTBB[1]&&y<FORTBB[3]&&pip(x,y,FORT);
// rivier: oever + afsluiting naar het noorden
const WATERS=WD.water;
function cellAt(x,y){const cx=Math.floor(x/T),cy=Math.floor(y/T);if(cx<0||cy<0||cx>=GW||cy>=GH)return BUILD;return G[cy*GW+cx];}
function cellIdx(x,y){return clamp(Math.floor(y/T),0,GH-1)*GW+clamp(Math.floor(x/T),0,GW-1);}
function polyFill(p,fn){const b=bbox(p),cy0=Math.max(0,Math.floor((b[1]-8)/T)),cy1=Math.min(GH-1,Math.ceil((b[3]-8)/T));
  for(let cy=cy0;cy<=cy1;cy++){const yc=cy*T+8,xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],c=p[j];if((a[1]>yc)!==(c[1]>yc))xs.push(a[0]+(yc-a[1])*(c[0]-a[0])/(c[1]-a[1]));}
    xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2){const x0=Math.max(0,Math.ceil((xs[k]-8)/T)),x1=Math.min(GW-1,Math.floor((xs[k+1]-8)/T));for(let cx=x0;cx<=x1;cx++)fn(cy*GW+cx);}}}
function stampSeg(x1,y1,x2,y2,hw,fn){
  const x0=Math.max(0,Math.floor((Math.min(x1,x2)-hw)/T)),x9=Math.min(GW-1,Math.floor((Math.max(x1,x2)+hw)/T)),y0=Math.max(0,Math.floor((Math.min(y1,y2)-hw)/T)),y9=Math.min(GH-1,Math.floor((Math.max(y1,y2)+hw)/T));
  const dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy||1;
  for(let cy=y0;cy<=y9;cy++)for(let cx=x0;cx<=x9;cx++){const px=cx*T+8,py=cy*T+8;let t=((px-x1)*dx+(py-y1)*dy)/L2;t=t<0?0:t>1?1:t;const qx=x1+dx*t-px,qy=y1+dy*t-py;if(qx*qx+qy*qy<=hw*hw)fn(cy*GW+cx);}}
function stampLine(p,hw,fn){for(let i=0;i<p.length-1;i++)stampSeg(p[i][0],p[i][1],p[i+1][0],p[i+1][1],hw,fn);}

(function addBridge(){let ne=null,bv=-1e9;for(const q of FORT){const v=q[0]-q[1]*1.1;if(v>bv){bv=v;ne=q;}}let A=null,jid=null,bd=1e18;
  for(const r of WD.roads){if(!(r.k==='tertiary'||r.k==='residential'||r.k==='unclassified'))continue;r.p.forEach((q,i)=>{if(!r.j[i])return;const d=Math.hypot(q[0]-ne[0],q[1]-ne[1]);if(d<bd){bd=d;A=q;jid=r.j[i];}});}
  if(!A)return;const dx=W-90-A[0],dy=70-A[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;const B=[Math.round(A[0]+ux*L),Math.round(A[1]+uy*L)];
  WD.roads.push({n:'Martinus Nijhoffbrug',k:'tertiary',w:110,bridge:1,p:[A,B],j:[jid,'brug_einde']});BRIDGE={A,B,ux,uy,L};})();
(function addKlipperstraat(){let ee=null;for(const q of FORT)if(!ee||q[0]>ee[0])ee=q;let A=null,jid=null,bd=1e18;
  for(const r of WD.roads){if(r.k==='service'||r.bridge)continue;r.p.forEach((q,i)=>{if(!r.j||!r.j[i])return;const d=Math.hypot(q[0]-ee[0],q[1]-ee[1]);if(d<bd){bd=d;A=q;jid=r.j[i];}});}
  if(!A)return;const x0=Math.max(ee[0]+230,A[0]+300),x1=W-40,cy=ee[1],y0=cy-520,y1=cy+520;if(x1-x0<300)return;
  WD.islands.push([[x0,y0],[x1,y0],[x1,y1],[x0,y1]]);
  const B=[x0+90,A[1]],Cc=[x0+90,y0+60],Dd=[x0+90,y1-60];
  WD.roads.push({n:'Klipperstraat',k:'residential',w:70,p:[A,B],j:[jid,'klip_b']});
  WD.roads.push({n:'Klipperstraat',k:'residential',w:70,p:[Cc,B,Dd],j:['klip_c','klip_b','klip_d']});
  WD.parking.push([[x0+150,cy+60],[x1-20,cy+60],[x1-20,y1-40],[x0+150,y1-40]]);
  const bx0=x0+170,bx1=x1-30,by0=cy-380,by1=cy+20;WD.buildings.push({p:[[bx0,by0],[bx1,by0],[bx1,by1],[bx0,by1]],b:'retail',n:''});
  for(const z of WD.biz)if(z.n==='Action'){z.x=(bx0+bx1)/2;z.y=(by0+by1)/2;}
  KLIP={x0,x1,y0,y1};})();
const ROADS=WD.roads.map(r=>{const m=r.p[r.p.length>>1];return{...r,fort:inFort(m[0],m[1]),bb:bbox(r.p)};});
for(const r of ROADS)r.brick=r.k==='pedestrian'||(r.fort&&r.k!=='tertiary');
const PATHS=WD.paths.map(p=>({...p,bb:bbox(p.p)}));
const BUILDINGS=[],TREES=[],TERRACE=[];
// kleuren naar de luchtfoto's: veel oranje pannen, leisteen-grijs, witte en bakstenen gevels
const ROOFS=['#d0623a','#c85a33','#d97048','#bd5530','#cf6a43','#d0623a','#c85a33','#56595f','#4b4e54','#63666c','#7a3b2c'];
const WALLS=['#ece6da','#e2d8c6','#f2eee6','#8a4a36','#9c5a42','#b98060','#d9cdb8','#7d4434','#e8e1d3'];
const SIGNS={'Action':['#0a1f8f','#ffffff'],'Kruidvat':['#e2001a','#fff'],'Intertoys':['#f26b0f','#fff'],'Bruna':['#0b4da2','#ffd200'],'Shoeby':['#111','#fff'],'HEMA':['#d6001c','#fff'],
 'Kapsalon Saer':['#2b2b2b','#e8c46a'],'Kapper Dubai':['#0d0d0d','#d4af37'],'LEF':['#1d6b4a','#fff'],'De Heeren van Bommel':['#5a1622','#f1dfb3'],'Xenos':['#e30613','#fff'],'Sport 2000':['#003da5','#fff'],
 'Toast & Tosti':['#f2b134','#3a2410'],'Zorba':['#1f5fa8','#fff'],'Máxima':['#6cace4','#fff'],'CinCin':['#7a1f3d','#fff'],"Kim's Kitchen":['#2e7d32','#fff'],'De Verdraagzaamheid':['#203a5c','#f1dfb3'],'De Eetgelegenheid':['#4e342e','#fff']};
const CATC={'Winkel':[['#2d6cdf','#fff'],['#7b2cbf','#fff'],['#e76f51','#fff'],['#264653','#fff']],'Kapper / Barbershop':[['#111','#e8c46a'],['#3d3d3d','#fff']],'Restaurant':[['#7a1f3d','#fff'],['#1d6b4a','#fff'],['#4e342e','#ffd166']]};
function signCol(n,c){return SIGNS[n]||(CATC[c]||CATC.Winkel)[hsh(n.length,n.charCodeAt(0))%(CATC[c]||CATC.Winkel).length];}
const MAIN=new Set(['Markt','Waterstraat','Gasthuisstraat','Boschstraat','Oliestraat','Nieuwstraat','Kerkstraat','Kerkplein','Waalkade','Gamerschestraat','Oenselsestraat','Vismarkt','Steenweg']);
const LANDMARKS=[];
function polyArea(p){let a=0;for(let i=0,j=p.length-1;i<p.length;j=i++)a+=(p[j][0]+p[i][0])*(p[j][1]-p[i][1]);return Math.abs(a/2);}
function centroid(p){let x=0,y=0;for(const q of p){x+=q[0];y+=q[1];}return[x/p.length,y/p.length];}
function prepBuilding(b){
  b.bb=bbox(b.p);const c=centroid(b.p);b.cx=c[0];b.cy=c[1];
  const h=hsh(b.bb[0]|0,b.bb[1]|0);
  if(!b.roof)b.roof=ROOFS[h%ROOFS.length];if(!b.wall)b.wall=WALLS[(h>>>5)%WALLS.length];
  b.wN=shade(b.wall,.55);b.wS=shade(b.wall,.98);b.wW=shade(b.wall,.72);b.wE=shade(b.wall,.85);b.roofD=shade(b.roof,.78);b.roofL=shade(b.roof,1.12);
  // nok langs de langste zijde (bij smalle diepe panden = haaks op de straat)
  if(b.ridge!==false&&b.p.length<=9){let best=0,ang=0;for(let i=0;i<b.p.length-1;i++){const a=b.p[i],q=b.p[i+1],l=Math.hypot(q[0]-a[0],q[1]-a[1]);if(l>best){best=l;ang=Math.atan2(q[1]-a[1],q[0]-a[0]);}}b.ra=ang;b.ridge=true;}else b.ridge=false;
  if(b.ridge&&!b.flat&&h%3===0)b.chim=[R(.3,.7),R(.3,.7)];
  BUILDINGS.push(b);
  if(!b.pass)polyFill(b.p,i=>{G[i]=BUILD;});
}
let BEACH=null,BEACHERS=[],SWIMMERS=[],BWALK=[],BPROPS=[];
const SAY_BEACH=['Ik heb nu al zand op plekken waar het zonlicht nog nooit is geweest.','Broodje kaas met een extra krokant laagje schelpengruis.','Ik kan Tuil zien liggen aan de overkant!','Het is heerlijk weer!','Wil je ook een pilsje?','Kun jij mijn rug even insmeren?'];
function makeBeach(){const n=FORT.length,cyT=FORTBB[1]+(FORTBB[3]-FORTBB[1])*.32,c=centroid(FORT);let best=[],cur=[];
  for(let k=0;k<2*n;k++){const i=k%n;if(FORT[i][1]<cyT){cur.push(i);if(cur.length>best.length)best=cur.slice();if(cur.length>=n)break;}else cur=[];}
  if(best.length<4)return null;const inner=best.map(i=>FORT[i]),outer=inner.map(q=>{const dx=q[0]-c[0],dy=q[1]-c[1],l=Math.hypot(dx,dy)||1;return[q[0]+dx/l*190,q[1]+dy/l*190-70];});
  const p=inner.concat(outer.reverse());p.bb=bbox(p);return p;}
function genWorld(){
  BEACH=makeBeach();
  G.fill(WATER);if(BEACH)polyFill(BEACH,i=>{G[i]=SAND;});polyFill(FORT,i=>{G[i]=GRASS;});
  for(const p of WD.green)polyFill(p,i=>{if(G[i]!==WATER)G[i]=PARK;});
  for(const p of WD.sand)polyFill(p,i=>{if(G[i]!==WATER)G[i]=SAND;});
  for(const p of WATERS)polyFill(p,i=>{G[i]=WATER;});
  for(const p of WD.islands)polyFill(p,i=>{G[i]=PARK;});
  for(const p of WD.parking)polyFill(p,i=>{if(G[i]!==WATER)G[i]=PLAZA;});
  for(const p of WD.plaza)polyFill(p,i=>{if(G[i]!==WATER)G[i]=PLAZA;});
  for(const p of PATHS){const keep=[];let cur=[p.p[0]];for(let i=1;i<p.p.length;i++){const a=p.p[i-1],b=p.p[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>110&&cellAt((a[0]+b[0])/2,(a[1]+b[1])/2)===WATER){if(cur.length>1)keep.push(cur);cur=[b];}else cur.push(b);}if(cur.length>1)keep.push(cur);p.segs=keep;}
  for(const p of PATHS)for(const q of p.segs)stampLine(q,p.w/2+2,i=>{if(G[i]===WATER)BRG[i]=1;if(G[i]!==ROAD)G[i]=PATH;});
  for(const p of [])stampLine(p.p,p.w/2+2,i=>{if(G[i]===WATER)BRG[i]=1;if(G[i]!==ROAD)G[i]=PATH;});
  for(const r of ROADS)stampLine(r.p,r.w/2+(r.fort?44:22),i=>{const t=G[i];if(t===WATER||t===ROAD||t===PLAZA)return;G[i]=WALK;});
  for(const r of ROADS)stampLine(r.p,r.w/2,i=>{if(G[i]===WATER)BRG[i]=1;G[i]=ROAD;});
  // gebouwen
  // alleen hoofdstraten, kerken, winkels en horeca: overige huizen worden tuin en groen
  const MR=ROADS.filter(r=>MAIN.has(r.n)),AR=ROADS.filter(r=>r.k!=='service'),nearR=(L,x,y,lim)=>{for(const r of L){if(x<r.bb[0]-lim||x>r.bb[2]+lim||y<r.bb[1]-lim||y>r.bb[3]+lim)continue;for(let i=0;i<r.p.length-1;i++){const a=r.p[i],q=r.p[i+1],dx=q[0]-a[0],dy=q[1]-a[1],L2=dx*dx+dy*dy||1;let t=clamp(((x-a[0])*dx+(y-a[1])*dy)/L2,0,1);if(Math.hypot(a[0]+dx*t-x,a[1]+dy*t-y)<lim)return true;}}return false;},nearMain=(x,y,lim)=>nearR(MR,x,y,lim);
  const edgeD=(x,y)=>{let d=1e9;for(let i=0;i<FORT.length;i++){const a=FORT[i],q=FORT[(i+1)%FORT.length],dx=q[0]-a[0],dy=q[1]-a[1],L2=dx*dx+dy*dy||1,t=clamp(((x-a[0])*dx+(y-a[1])*dy)/L2,0,1);d=Math.min(d,Math.hypot(a[0]+dx*t-x,a[1]+dy*t-y));}return d;};
  const bizB=new Set();for(const z of WD.biz){let best=-1,bd=1e9;WD.buildings.forEach((ob,k)=>{const c=centroid(ob.p);if(Math.abs(c[0]-z.x)>300||Math.abs(c[1]-z.y)>300)return;const d=pip(z.x,z.y,ob.p)?0:Math.hypot(c[0]-z.x,c[1]-z.y);if(d<bd){bd=d;best=k;}});if(best>=0&&bd<200)bizB.add(best);}
  WD.buildings.forEach((ob,k)=>{const c=centroid(ob.p),h0=hsh(ob.p[0][0],ob.p[0][1]);const front=nearR(AR,c[0],c[1],125),edge=edgeD(c[0],c[1]);ob.keep=!!(bizB.has(k)||ob.n||ob.b==='church'||ob.b==='civic'||(front&&edge>300&&(nearMain(c[0],c[1],175)||h0%100<72)));});
  for(const ob of WD.buildings){
    if(!ob.keep)continue;
    const b={p:ob.p,n:ob.n,kind:ob.b};const a=polyArea(ob.p),h=hsh(ob.p[0][0],ob.p[0][1]);
    let m=(ob.b==='apartments'?14:ob.b==='house'?8+(h%4):ob.b==='church'?22:ob.b==='retail'||ob.b==='commercial'?10:ob.b==='shed'||ob.b==='roof'||a<1200?4:9+(h%5));
    if(ob.b==='civic')m=16;if(ob.b==='houseboat')m=4;
    b.ht=m*3.2;b.flat=(ob.b==='retail'||ob.b==='commercial'||ob.b==='industrial'||ob.b==='apartments'||a>25000)&&ob.b!=='church';
    if(b.flat)b.roof=RP(['#9a9c9e','#86898c','#b3b3ae','#7a7d80','#c4c3bd']);
    if(ob.b==='church'){b.roof='#5d636a';b.wall='#b8ab95';b.label=ob.n;}
    if(ob.b==='civic'){b.wall='#e1d7c2';b.roof='#3d4146';b.label='Stadhuis';}
    if(ob.n==='Gasthuiskapel'||ob.n==='Maarten van Rossumhuis')b.label=ob.n;
    if(b.flat)b.ridge=false;
    prepBuilding(b);
    if(b.label)LANDMARKS.push({n:b.label,x:b.cx,y:b.cy});
  }
  // toren van de Grote Kerk aan de westkant
  const gk=BUILDINGS.find(b=>b.n==='Grote of Sint-Maartenskerk');
  if(gk){const x0=gk.bb[0],ys=gk.p.filter(q=>q[0]<x0+150).map(q=>q[1]),cy=(Math.min(...ys)+Math.max(...ys))/2,s=60;
    prepBuilding({p:[[x0-6,cy-s],[x0+2*s-6,cy-s],[x0+2*s-6,cy+s],[x0-6,cy+s]],ht:200,kind:'tower',roof:'#6b6e70',wall:'#b3a58d',ridge:false,spire:1});}
  for(const r of ROADS)stampLine(r.p,r.w/2-2,i=>{if(G[i]===BUILD)G[i]=ROAD;});
  if(BRIDGE){const {A,ux,uy,L}=BRIDGE,nx=-uy,ny=ux;BRIDGE.py=[];for(const t of [.42,.78]){const cx=A[0]+ux*L*t,cy=A[1]+uy*L*t;for(const sd of [-1,1])for(const o of [-11,11]){const px=cx+nx*sd*72+ux*o,py=cy+ny*sd*72+uy*o,h=9;
      const b={p:[[px-h,py-h],[px+h,py-h],[px+h,py+h],[px-h,py+h]],ht:330,kind:'pylon',roof:'#e9e1cf',wall:'#cfc6b2',ridge:false};prepBuilding(b);BRIDGE.py.push({b,sd,cx,cy});}}
    LANDMARKS.push({n:'Martinus Nijhoffbrug',x:A[0]+ux*L*.6,y:A[1]+uy*L*.6});}
  const smk=BUILDINGS.find(b=>b.n==='Sint-Martinuskerk');if(smk)smk.ht=60;
  // Waterpoort over de Waterstraat
  const wp=WD.pois.find(p=>p.n==='Waterpoort');
  if(wp){const ne=nearestRoadDir(wp.x,wp.y),ux=Math.cos(ne),uy=Math.sin(ne),a=48,b=78;
    prepBuilding({p:[[wp.x-ux*a-uy*b,wp.y-uy*a+ux*b],[wp.x+ux*a-uy*b,wp.y+uy*a+ux*b],[wp.x+ux*a+uy*b,wp.y+uy*a-ux*b],[wp.x-ux*a+uy*b,wp.y-uy*a-ux*b]],ht:78,kind:'gate',pass:1,roof:'#5a3a2e',wall:'#8b5a44',ridge:false,label:'Waterpoort'});
    LANDMARKS.push({n:'Waterpoort',x:wp.x,y:wp.y});}
  // winkels en horeca
  const used=new Set();
  const signOn=(name,x,y,cat,adr)=>{let best=null,bd=1e9;for(const b of BUILDINGS){if(b.pass||b.kind==='tower'||used.has(b))continue;if(Math.abs(b.cx-x)>260||Math.abs(b.cy-y)>260)continue;const d=pip(x,y,b.p)?0:Math.hypot(b.cx-x,b.cy-y);if(d<bd){bd=d;best=b;}}
    if(best){used.add(best);best.sign=name;best.signC=signCol(name,cat);best.sa=nearestRoadDir(best.cx,best.cy);LANDMARKS.push({n:name,x:best.cx,y:best.cy,shop:1,c:best.signC[0],cat,adr});}};
  for(const z of WD.biz)signOn(z.n,z.x,z.y,z.c,z.adr);
  // terrassen
  for(const p of WD.seating){const b=bbox(p),col=RP(['#e9e2d0','#1d6b4a','#5a1622','#f2f2f2','#c43b2f']);for(let y=b[1]+16;y<b[3]-8;y+=34)for(let x=b[0]+16;x<b[2]-8;x+=34)if(pip(x,y,p))TERRACE.push({x,y,c:col});}
  // lantaarnpalen
  for(const r of ROADS){if(r.k==='service')continue;let acc2=R(0,120),side=1;for(let i=0;i<r.p.length-1;i++){const a=r.p[i],b2=r.p[i+1],L=Math.hypot(b2[0]-a[0],b2[1]-a[1]),ux=(b2[0]-a[0])/L,uy=(b2[1]-a[1])/L;
    while(acc2<L){const off=r.w/2+(r.bridge?6:14),x=a[0]+ux*acc2-uy*off*side,y=a[1]+uy*acc2+ux*off*side;if(cellAt(x,y)!==BUILD)LAMPS.push({x,y,br:!!r.bridge});side=-side;acc2+=r.bridge?110:(r.fort?150:190);}acc2-=L;}}
  // strandgasten en zwemmers
  if(BEACH){const b=BEACH.bb;for(let i=0;i<4000&&BEACHERS.length<46;i++){const x=R(b[0],b[2]),y=R(b[1],b[3]);if(cellAt(x,y)!==SAND||inFort(x,y))continue;if(BEACHERS.some(q=>Math.abs(q.x-x)<34&&Math.abs(q.y-y)<34))continue;
      BEACHERS.push({x,y,a:R(-.4,.4)+(rnd()<.5?0:Math.PI),towel:RP(['#ff4fa3','#36d1ff','#ffe14d','#7dff6a','#ff8a3d','#ffffff','#e63946']),skin:RP(['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac']),suit:RP(['#1d3557','#e63946','#2a9d8f','#111','#f4a261']),hair:RP(HAIRS),umb:rnd()<.3?RP(['#ff4fa3','#36d1ff','#ffd166','#7dff6a']):null,sit:rnd()<.3});}
    // strand-decor: palmen, parasols, ligstoelen, strandtent, reddingstoren, boten aan de waterkant
    {const want=[['palm',9,64],['palm2',5,70],['umbrella',8,34],['chair',8,26],['oats',8,26],['bush',3,30],['castle',2,26],['tower',1,58],['tiki',1,62],['surf',1,34],['fire',1,26],['hammock',1,40],['shell',3,10],['bottle',1,10],['rock',2,30]];
      const okP=(x,y,sz)=>BPROPS.every(p=>Math.hypot(p.x-x,p.y-y)>(p.sz+sz)*.55)&&BEACHERS.every(q=>Math.hypot(q.x-x,q.y-y)>sz*.6+14);
      for(const [k,n,sz] of want){let c=0;for(let i=0;i<4000&&c<n;i++){const x=R(b[0],b[2]),y=R(b[1],b[3]);if(cellAt(x,y)!==SAND||inFort(x,y))continue;if(!okP(x,y,sz))continue;BPROPS.push({k,x,y,sz,f:rnd()<.5});c++;}}
      for(const [k,n,sz] of [['kayak',2,30],['rowboat',2,34],['sailboat',1,46]]){let c=0;for(let i=0;i<6000&&c<n;i++){const x=R(b[0]-150,b[2]+150),y=R(b[1]-200,b[3]);if(cellAt(x,y)!==WATER||inFort(x,y))continue;let nearS=false;for(const [dx,dy] of [[0,40],[0,70],[40,40],[-40,40]])if(cellAt(x+dx,y+dy)===SAND)nearS=true;if(!nearS||!okP(x,y,sz))continue;BPROPS.push({k,x,y,sz,f:rnd()<.5,w:1});c++;}}
      BPROPS.sort((p,q)=>p.y-q.y);}
    for(let i=0;i<5000&&BWALK.length<12;i++){const x=R(b[0],b[2]),y=R(b[1],b[3]);if(cellAt(x,y)!==SAND||inFort(x,y))continue;
      BWALK.push({x,y,a:R(0,6.28),anim:R(0,6),spd:R(.35,.6),think:0,talkCd:0,skin:RP(['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac']),suit:RP(['#ff2e88','#36d1ff','#ffe14d','#e63946','#7dff6a','#ffffff','#111']),hair:RP(['#2b1d0e','#e8c070','#7a3e12','#111','#c0392b','#f5deb3']),state:'walk'});}
    for(let i=0;i<6000&&SWIMMERS.length<22;i++){const x=R(b[0]-200,b[2]+200),y=R(b[1]-260,b[3]);if(cellAt(x,y)!==WATER||inFort(x,y))continue;let nearS=false;for(const [dx,dy] of [[0,60],[0,120],[60,60],[-60,60],[0,180]])if(cellAt(x+dx,y+dy)===SAND)nearS=true;if(!nearS)continue;
      SWIMMERS.push({x0:x,y0:y,x,y,ph:R(0,6.28),hair:RP(HAIRS),cap:rnd()<.3?RP(['#ff4fa3','#ffe14d','#36d1ff']):null});}}
  // bomen
  for(let i=0;i<40000&&TREES.length<3400;i++){const x=R(0,W),y=R(0,H),t=cellAt(x,y);let pr=0;if(!inFort(x,y))continue;if(t===PARK)pr=.55;else if(t===GRASS)pr=.16;if(rnd()<pr){let ok=true;for(const q of TREES){if(Math.abs(q.x-x)<22&&Math.abs(q.y-y)<22){ok=false;break;}}if(ok)TREES.push({x,y,r:R(13,24),c:RP(['#3a6b2f','#41752f','#335f2a','#4a7d36','#2f5a28'])});}}
}
function nearestRoadDir(x,y){let bd=1e18,ang=0;for(const r of ROADS){if(x<r.bb[0]-300||x>r.bb[2]+300||y<r.bb[1]-300||y>r.bb[3]+300)continue;for(let i=0;i<r.p.length-1;i++){const a=r.p[i],b=r.p[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy||1;let t=((x-a[0])*dx+(y-a[1])*dy)/L2;t=clamp(t,0,1);const qx=a[0]+dx*t-x,qy=a[1]+dy*t-y,d=qx*qx+qy*qy;if(d<bd){bd=d;ang=Math.atan2(dy,dx);}}}return ang;}

