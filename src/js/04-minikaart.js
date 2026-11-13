// ====================== minikaart ======================
let MINI=null;
function buildMini(){MINI=document.createElement('canvas');MINI.width=GW;MINI.height=GH;const m=MINI.getContext('2d'),img=m.createImageData(GW,GH);
  const C={0:[110,150,80],1:[225,220,210],2:[170,160,150],3:[120,82,66],4:[56,102,138],5:[84,130,64],6:[200,190,170],7:[190,175,150],8:[214,195,139]};
  for(let i=0;i<G.length;i++){const c=BRG[i]&&G[i]!==WATER?[230,226,214]:C[G[i]];img.data[i*4]=c[0];img.data[i*4+1]=c[1];img.data[i*4+2]=c[2];img.data[i*4+3]=255;}m.putImageData(img,0,0);}

let MAPC=null;const MAPS=.17;
function buildVectorMap(){const w=Math.ceil(W*MAPS),h=Math.ceil(H*MAPS),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.scale(MAPS,MAPS);g.lineJoin='round';g.lineCap='round';
  g.fillStyle='#4f86b0';g.fillRect(0,0,W,H);const pp=(p)=>{g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1]);g.closePath();};
  g.save();pp(FORT);g.fillStyle='#bcd39a';g.fill();g.strokeStyle='#e9e2d0';g.lineWidth=30;g.stroke();g.clip();
  g.fillStyle='#8fbd6c';for(const p of WD.green){pp(p);g.fill();}g.fillStyle='#4f86b0';for(const p of WATERS){pp(p);g.fill();}g.fillStyle='#8fbd6c';for(const p of WD.islands){pp(p);g.fill();}
  g.fillStyle='#e6dccb';for(const p of WD.plaza.concat(WD.parking)){pp(p);g.fill();}g.restore();
  g.strokeStyle='#d8cfbd';for(const p of PATHS){g.lineWidth=p.w+8;for(const q of p.segs){g.beginPath();g.moveTo(q[0][0],q[0][1]);for(let i=1;i<q.length;i++)g.lineTo(q[i][0],q[i][1]);g.stroke();}}
  for(const pass of [0,1])for(const r of ROADS){g.strokeStyle=pass?(MAIN.has(r.n)?'#fff7e0':'#ffffff'):'#a99f8e';g.lineWidth=r.w+(pass?26:40)+(MAIN.has(r.n)?14:0);g.beginPath();g.moveTo(r.p[0][0],r.p[0][1]);for(let i=1;i<r.p.length;i++)g.lineTo(r.p[i][0],r.p[i][1]);g.stroke();}
  for(const b of BUILDINGS){if(b.pass)continue;pp(b.p);g.fillStyle=b.kind==='church'||b.kind==='tower'?'#8e7fa8':b.sign?b.signC[0]:b.flat?'#b9b6ae':'#d79270';g.fill();g.strokeStyle='rgba(60,30,20,.35)';g.lineWidth=6;g.stroke();}
  MAPC=c;}
