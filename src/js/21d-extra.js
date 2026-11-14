// ====================== extra: beeld bij de Waterpoort, automerk bij instappen ======================
// --- Beeld "Jip en Janneke" net buiten de Waterpoort, op de stoep richting het Waalstrand.
// In het spel zie je van bovenaf alleen de bakstenen sokkel met de dunne stalen plaat erop;
// bekijken toont de foto (assets/beeld.webp).
const STATUE={x:0,y:0,a:0,ok:false};
function placeStatue(){const g=(WD.pois||[]).find(p=>p.n==='Waterpoort');if(!g)return;
  // weg door de poort richting de Waal: Waterstraat-stuk ten noorden van de poort
  let best=null,bd=1e9;for(const r of ROADS){if(r.n!=='Waterstraat')continue;for(let i=0;i<r.p.length-1;i++){const A=r.p[i],B=r.p[i+1],mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;if(my>g.y)continue;const d=Math.hypot(mx-g.x,my-(g.y-110));if(d<bd){bd=d;best={A,B,w:r.w};}}}
  let x=g.x,y=g.y-120,a=-Math.PI/2,w=70;if(best){const {A,B}=best;a=Math.atan2(B[1]-A[1],B[0]-A[0]);w=best.w;const t=.5;x=A[0]+(B[0]-A[0])*t;y=A[1]+(B[1]-A[1])*t;}
  const nx=-Math.sin(a),ny=Math.cos(a),off=w/2+30;
  // kies de stoepkant die niet in het water/gebouw ligt
  for(const sd of [1,-1]){const px=x+nx*off*sd,py=y+ny*off*sd,c=cellAt(px,py);if(c!==WATER&&c!==BUILD){STATUE.x=px;STATUE.y=py;STATUE.a=a;STATUE.ok=true;break;}}
  if(STATUE.ok)LANDMARKS.push({n:'Jip en Janneke (beeld)',x:STATUE.x,y:STATUE.y,k:'beeld'});}
const BEELD=new Image();BEELD.src='assets/beeld.webp';
function nearStatue(){return STATUE.ok&&!P.car&&!P.dead&&Math.hypot(P.x-STATUE.x,P.y-STATUE.y)<60;}
function drawStatue(vx0,vy0,vx1,vy1,cx,cy){if(!STATUE.ok||STATUE.x<vx0-80||STATUE.x>vx1+80||STATUE.y<vy0-80||STATUE.y>vy1+80)return;const k=.0016,h=26,ox=(STATUE.x-cx)*k*h,oy=(STATUE.y-cy)*k*h;
  ctx.save();ctx.translate(STATUE.x,STATUE.y);ctx.rotate(STATUE.a);const L=34,Wd=12;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-L/2+4,-Wd/2+5,L,Wd);
  // sokkel: zijkanten (perspectief) en baksteen-bovenkant
  ctx.restore();ctx.save();ctx.translate(STATUE.x,STATUE.y);const ca=Math.cos(STATUE.a),sa=Math.sin(STATUE.a),c=[[-L/2,-Wd/2],[L/2,-Wd/2],[L/2,Wd/2],[-L/2,Wd/2]].map(([u,v])=>[u*ca-v*sa,u*sa+v*ca]);
  ctx.fillStyle='#8a4a32';for(let i=0;i<4;i++){const p=c[i],q=c[(i+1)%4];ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(q[0]+ox,q[1]+oy);ctx.lineTo(p[0]+ox,p[1]+oy);ctx.closePath();ctx.fill();}
  ctx.beginPath();c.forEach((p,i)=>i?ctx.lineTo(p[0]+ox,p[1]+oy):ctx.moveTo(p[0]+ox,p[1]+oy));ctx.closePath();ctx.fillStyle='#b5654a';ctx.fill();ctx.strokeStyle='rgba(60,25,15,.6)';ctx.lineWidth=.8;ctx.stroke();
  ctx.translate(ox,oy);ctx.rotate(STATUE.a);ctx.strokeStyle='rgba(120,60,40,.45)';ctx.lineWidth=.6;for(let u=-L/2+4;u<L/2;u+=4){ctx.beginPath();ctx.moveTo(u,-Wd/2);ctx.lineTo(u,Wd/2);ctx.stroke();}
  // stalen plaat van bovenaf: dunne zwarte lijn met schaduw
  const lift=1.4;ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-L*.42+3,-1+3,L*.84,2.2);ctx.fillStyle='#141414';ctx.fillRect(-L*.42-ox*.4*lift,-1-oy*.4*lift,L*.84,2.2);
  ctx.restore();}
function statueHint(){if(!nearStatue()||MG.on||bigMap)return;const U=clamp(Math.min(CW,CH)/560,.8,1.2),t=IS_TOUCH?'👁  Tik BEKIJK om het beeld te zien':'👁  Druk op E om het beeld te bekijken';
  ctx.font=`700 ${14*U}px Inter, sans-serif`;const w=ctx.measureText(t).width+28*U,x=(CW-w)/2,y=CH*.62;ctx.fillStyle='rgba(10,4,24,.82)';rrect(ctx,x,y,w,34*U,17*U);ctx.fill();ctx.strokeStyle='#ffd166';ctx.lineWidth=2;rrect(ctx,x,y,w,34*U,17*U);ctx.stroke();
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,CW/2,y+17*U);}
function openStatue(){let o=document.getElementById('beeldOv');
  if(!o){o=document.createElement('div');o.id='beeldOv';o.style.cssText='position:fixed;inset:0;z-index:55;display:flex;align-items:center;justify-content:center;background:rgba(8,4,20,.9);padding:16px';
    o.innerHTML='<div style="width:min(94vw,900px);background:#140822;border:2px solid #ffd166;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:Inter,sans-serif;color:#fff"><img src="assets/beeld.webp" alt="Beeld van Jip en Janneke bij de Waterpoort" style="display:block;width:100%;height:auto;max-height:62vh;object-fit:cover"><div style="padding:14px 16px;display:flex;align-items:center;gap:12px"><div style="flex:1"><div style="font:400 26px Anton,Impact,sans-serif;color:#ffd166;letter-spacing:1px">JIP EN JANNEKE</div><div style="font-size:13px;opacity:.85">Stalen beeld bij de Waterpoort · Zaltbommel</div></div><button id="beeldX" style="padding:10px 16px;border-radius:10px;border:0;background:#ff2e88;color:#fff;font:800 14px Inter;letter-spacing:1px">SLUITEN</button></div></div>';
    document.body.appendChild(o);o.addEventListener('pointerdown',e=>{if(e.target.id==='beeldOv'||e.target.id==='beeldX'){e.preventDefault();o.style.display='none';paused=false;}});}
  o.style.display='flex';paused=true;sfx('blip',520);}
// --- automerk/-model kort in beeld bij instappen
const CAR_NAMES={beetle:'Beatall',delorean:'docLorean',landy:'Landyroamer',pickup:'Pickup',racer:'Tristar Racer',hatchback:'Hatchback',sedan:'Sedan',suv:'SUV',muscle:'Muscle',muscle_2:'Muscle II',roadster:'Roadster',sports:'Sports',taxi:'Taxi',van:'Bestelbus',bus:'Bus',ambulance:'Ambulance',firetruck:'Brandweerwagen',truck:'Vrachtwagen',limousine:'Limousine'};
let CARNAME=null;
function showCarName(c){const n=(c.spr&&CAR_NAMES[c.spr.m])||c.t.n||'Auto';CARNAME={t:n,sub:c.t.n&&c.t.n!==n?c.t.n:'',life:110,ml:110};}
function drawCarName(){if(!CARNAME||MG.on)return;if(--CARNAME.life<=0||!P.car){CARNAME=null;return;}const a=clamp(Math.min(CARNAME.life/20,(CARNAME.ml-CARNAME.life)/8),0,1),fs=clamp(CW/9,30,58),x=CW-24,y=CH-(IS_TOUCH?250:90);
  ctx.save();ctx.globalAlpha=a;ctx.translate(x+(1-a)*40,y);ctx.transform(1,0,-.18,1,0,0);ctx.font=`400 ${fs}px Anton, Impact, sans-serif`;ctx.textAlign='right';ctx.textBaseline='alphabetic';ctx.lineWidth=6;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(CARNAME.t.toUpperCase(),0,0);ctx.fillStyle='#fff';ctx.fillText(CARNAME.t.toUpperCase(),0,0);
  if(CARNAME.sub){ctx.font=`700 ${fs*.28}px Inter, sans-serif`;ctx.lineWidth=4;ctx.strokeText(CARNAME.sub.toUpperCase(),0,fs*.4);ctx.fillStyle='#ffd166';ctx.fillText(CARNAME.sub.toUpperCase(),0,fs*.4);}ctx.restore();}
