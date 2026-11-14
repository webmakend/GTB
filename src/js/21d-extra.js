// ====================== extra: beeld bij de Waterpoort, automerk bij instappen ======================
// --- Beeld "Jip en Janneke" net buiten de Waterpoort, op de stoep richting het Waalstrand.
// In het spel zie je van bovenaf alleen de bakstenen sokkel met de dunne stalen plaat erop;
// bekijken toont de foto (assets/beeld.webp).
const STATUE={x:0,y:0,a:0,ok:false};
function placeStatue(){const g=(WD.pois||[]).find(p=>p.n==='Waterpoort');if(!g)return;
  // vanaf de poort naar het noorden: eerste groenstrook (park) voor het strand
  const x=g.x-40;let y=null;for(let yy=g.y-120;yy>g.y-900;yy-=10){if(cellAt(x,yy)===PARK&&cellAt(x,yy-30)===PARK){y=yy-28;break;}}
  if(y==null)return;STATUE.x=x;STATUE.y=y;STATUE.a=0;STATUE.ok=true;LANDMARKS.push({n:'Jip en Janneke (beeld)',x,y,k:'beeld'});}
const BEELD=new Image();BEELD.src='assets/beeld.webp';
function nearStatue(){return STATUE.ok&&!P.car&&!P.dead&&Math.hypot(P.x-STATUE.x,P.y-STATUE.y)<60;}
function statueAt(sx,sy){if(!STATUE.ok)return false;const wx=CAM.x+(sx-CW/2)/CAM.z,wy=CAM.y+(sy-CH/2)/CAM.z;return Math.hypot(wx-STATUE.x,wy-STATUE.y)<Math.max(30,26/CAM.z);}
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
function statueHint(){if(!STATUE.ok||MG.on||bigMap)return;const sx=CW/2+(STATUE.x-CAM.x)*CAM.z,sy=CH/2+(STATUE.y-CAM.y)*CAM.z;if(sx<-40||sx>CW+40||sy<-40||sy>CH+40)return;
  const b=Math.sin(frameN*.08)*4,r=13,y=sy-30-b;ctx.fillStyle='rgba(10,4,24,.85)';ctx.beginPath();ctx.arc(sx,y,r,0,TAU);ctx.fill();ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.stroke();
  ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('👁',sx,y+1);ctx.beginPath();ctx.moveTo(sx-5,y+r-1);ctx.lineTo(sx+5,y+r-1);ctx.lineTo(sx,y+r+6);ctx.closePath();ctx.fillStyle='#ffd166';ctx.fill();}
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
