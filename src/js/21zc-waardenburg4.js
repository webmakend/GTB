// ====================== Waardenburg 4: meer boomgaarden (rond WNC en het kasteel), schatkist bij het kasteel, brug altijd open, boten onder de brug, wit huis met varkentje ======================
// ---- Waardenburg is voor iedereen meteen bereikbaar: geen slagboom en geen tol meer
WBOPEN=true;tollNear=function(){return false;};drawWbBar=function(){};
// ---- extra boomgaarden op lege grasvelden
function castleB(){return BUILDINGS.find(b=>b.wbc)||null;}
function orchAuto(){if(!WB)return;let sd=777;const rn=()=>((sd=(sd*16807)%2147483647)/2147483647);const pit=WD.pitch||[];
  const free=(x,y)=>{const c=cellAt(x,y);if(c!==GRASS&&c!==PARK)return false;if(pit.some(pc=>pip(x,y,pc.p)))return false;if(typeof inOrchard==='function'&&inOrchard(x,y))return false;return true;};
  const add=(cx,cy,n,r0,r1)=>{let made=0;for(let t=0;t<500&&made<n;t++){const a=rn()*TAU,d=r0+rn()*(r1-r0),x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,ang=rn()*Math.PI,w=110+rn()*70,h=80+rn()*50,ca=Math.cos(ang),sa=Math.sin(ang);
      const pt=(u,v)=>[Math.round(x+u*ca-v*sa),Math.round(y+u*sa+v*ca)];let ok=true;for(let u=-w;u<=w&&ok;u+=w/3)for(let v=-h;v<=h&&ok;v+=h/2){const q=pt(u,v);if(!free(q[0],q[1]))ok=false;}
      if(!ok)continue;const poly=[pt(-w,-h),pt(w,-h),pt(w,h),pt(-w,h),pt(-w,-h)];poly.bb=bbox(poly);poly.ang=ang;poly.area=polyArea(poly);if(ORCH.some(o=>!(poly.bb[2]<o.bb[0]-30||poly.bb[0]>o.bb[2]+30||poly.bb[3]<o.bb[1]-30||poly.bb[1]>o.bb[3]+30)))continue;
      ORCH.push(poly);made++;
      for(let i=TREES.length-1;i>=0;i--){const t=TREES[i];if(t.x>poly.bb[0]-10&&t.x<poly.bb[2]+10&&t.y>poly.bb[1]-10&&t.y<poly.bb[3]+10&&pip(t.x,t.y,poly))TREES.splice(i,1);}}};
  const c=castleB();if(c)add(c.cx,c.cy,7,260,1100);
  const so=(WD.pitch||[]).filter(p=>p.s==='soccer');if(so.length){const q=centroid(so[0].p.slice(0,-1));add(q[0],q[1],6,700,1500);}
  try{chunkCache.clear();}catch(e){}}
{const _bo=buildOrchards;buildOrchards=function(){try{orchAuto();}catch(e){console.warn(e);}_bo();};}
// appels plukken levert iets meer op
{const _ap=applePick;applePick=function(){const m=P.money,cd=APPLE_CD;_ap();if(cd<=0&&APPLE_CD>0&&P.money>m)addMoney(.5);};}

// ---- schatkist rond het kasteel: €500, elke 10 minuten op een nieuwe plek
const CHEST={x:0,y:0,on:false,next:0};
function chestPlace(){const c=castleB();if(!c)return;let sd=(Date.now()/600000)|0;const rn=()=>((sd=(sd*16807+11)%2147483647)/2147483647);
  for(let t=0;t<400;t++){const a=rn()*TAU,d=120+rn()*650,x=c.cx+Math.cos(a)*d,y=c.cy+Math.sin(a)*d,k=cellAt(x,y);if(k===BUILD||k===WATER||k===ROAD)continue;if(typeof isDeep==='function'&&isDeep(x,y))continue;CHEST.x=x;CHEST.y=y;CHEST.on=true;return;}}
function chestStep(){const now=Date.now();if(!CHEST.on&&now>=CHEST.next){chestPlace();if(CHEST.on&&CHEST.next)noteAdd('NIEUWE SCHATKIST','Ergens rond Kasteel Waardenburg ligt weer een schatkist met €500','#ffd166',260,'kist');}
  if(!CHEST.on||P.dead)return;const o=me();if(Math.hypot(o.x-CHEST.x,o.y-CHEST.y)<26){CHEST.on=false;CHEST.next=now+600000;lsSet('gtb_chest',String(CHEST.next));addMoney(500);addXP(100);sfx('reward');camHit(4);buzz([40,40,80]);ring(CHEST.x,CHEST.y,60,'rgba(255,209,102,.95)');
    for(let i=0;i<30;i++){const a=rr(0,TAU),v=rr(1,4);parts.push({x:CHEST.x,y:CHEST.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:40,ml:40,s:2.5,k:'f'});}
    missionBanner('SCHATKIST GEVONDEN!','+€500 · over 10 minuten ligt er een nieuwe rond het kasteel','#ffd166',260);}}
CHEST.next=+(lsGet('gtb_chest')||0);
function drawChest(){if(!CHEST.on||Math.abs(CHEST.x-CAM.x)>1300||Math.abs(CHEST.y-CAM.y)>1300)return;const x=CHEST.x,y=CHEST.y,b=Math.sin(frameN*.1);
  ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,30+4*b,'rgba(255,200,60,.45)');ctx.restore();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x+3,y+6,15,6,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.fillStyle='#7a4a1e';ctx.fillRect(-13,-6,26,14);ctx.fillStyle='#9c5f28';ctx.beginPath();ctx.moveTo(-13,-6);ctx.quadraticCurveTo(0,-17,13,-6);ctx.closePath();ctx.fill();ctx.fillStyle='#e8b923';ctx.fillRect(-13,-3,26,2.5);ctx.fillRect(-2,-8,4,8);ctx.fillRect(-14,-7,3,15);ctx.fillRect(11,-7,3,15);
  if((frameN>>3)%6===0){ctx.fillStyle='#fff';ctx.fillRect(6+b*2,-14,2,6);ctx.fillRect(4+b*2,-12,6,2);}ctx.restore();}
{const _nm=netMinimap;netMinimap=function(mp,cxm,cym,S){_nm(mp,cxm,cym,S);if(!CHEST.on)return;const o=me();if(Math.hypot(o.x-CHEST.x,o.y-CHEST.y)>700)return;const [x,y]=mp(CHEST.x,CHEST.y);if(Math.hypot(x-cxm,y-cym)>S/2-6)return;ctx.fillStyle=(frameN>>4)&1?'#ffd166':'#ff9f1c';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();};}

// ---- boten varen onder bruggen door: de boot wordt niet getekend waar de brug ligt
{const _db=drawBarges;drawBarges=function(){const all=barges;for(const b of all){const R=(b.len||60)/2+20;let path=null;const cx0=Math.max(0,Math.floor((b.x-R)/T)),cx1=Math.min(GW-1,Math.floor((b.x+R)/T)),cy0=Math.max(0,Math.floor((b.y-R)/T)),cy1=Math.min(GH-1,Math.floor((b.y+R)/T));
    for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++)if(BRG[cy*GW+cx]){if(!path){path=new Path2D();path.rect(CAM.x-5000,CAM.y-5000,10000,10000);}path.rect(cx*T-1,cy*T-1,T+2,T+2);}
    barges=[b];if(path){ctx.save();ctx.clip(path,'evenodd');_db();ctx.restore();}else _db();}barges=all;};}

// ---- Koningin Julianaplantsoen 47: wit huis, witte auto voor de deur, varkentje achter in de tuin (voeren €3)
const PIG={x:0,y:0,hx:0,hy:0,a:0,t:0,happy:0,b:null};
function pigInit(){const b=BUILDINGS.find(q=>String(q.oid)==='273946748');if(!b)return;PIG.b=b;b.wall='#f4f4f0';b.roof='#4c545b';b.fac=null;b.wN=shade(b.wall,.62);b.wS=shade(b.wall,.98);b.wW=shade(b.wall,.78);b.wE=shade(b.wall,.88);b.roofD=shade(b.roof,.78);b.roofL=shade(b.roof,1.12);
  // voorkant = kant van de dichtstbijzijnde straat
  let best=null,bd=1e9;for(let a=0;a<16;a++){const ux=Math.cos(a/16*TAU),uy=Math.sin(a/16*TAU);for(let d=10;d<160;d+=6){const x=b.cx+ux*d,y=b.cy+uy*d;if(cellAt(x,y)===ROAD){if(d<bd){bd=d;best=[ux,uy];}break;}}}
  const [fx,fy]=best||[0,1];let e=0;while(e<120&&pip(b.cx+fx*e,b.cy+fy*e,b.p))e+=3;let k=0;while(k<120&&pip(b.cx-fx*k,b.cy-fy*k,b.p))k+=3;
  PIG.hx=b.cx-fx*(k+38);PIG.hy=b.cy-fy*(k+38);PIG.x=PIG.hx;PIG.y=PIG.hy;PIG.fx=fx;PIG.fy=fy;
  PIG.car=[b.cx+fx*(e+22)+(-fy)*24,b.cy+fy*(e+22)+fx*24,Math.atan2(-fy,-fx)];}
{const _po=populate;populate=function(){_po();if(PIG.car&&!cars.some(c=>c.pigCar)&&CT.sedan){const [x,y,an]=PIG.car;const c=makeCar('sedan',x,y,an,null);c.col='#f5f5f5';c.spr=null;c.keep=1;c.pigCar=1;cars.push(c);}};}
function pigStep(){if(!PIG.b)return;PIG.t++;if(PIG.happy>0)PIG.happy--;if(PIG.t%120===0)PIG.a=rr(0,TAU);const sp=PIG.happy>0?.9:.35,nx=PIG.x+Math.cos(PIG.a)*sp,ny=PIG.y+Math.sin(PIG.a)*sp;
  if(Math.hypot(nx-PIG.hx,ny-PIG.hy)<26&&cellAt(nx,ny)!==BUILD&&cellAt(nx,ny)!==ROAD){PIG.x=nx;PIG.y=ny;}else PIG.a+=Math.PI*.8;
  if(PIG.happy>0&&PIG.t%10===0)parts.push({x:PIG.x+rr(-6,6),y:PIG.y-10,vx:0,vy:-.6,l:30,ml:30,s:2,k:'h'});}
function drawPig(){if(!PIG.b||Math.abs(PIG.x-CAM.x)>1200||Math.abs(PIG.y-CAM.y)>1200)return;
  // hekje om de tuin
  ctx.strokeStyle='rgba(120,90,60,.8)';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.arc(PIG.hx,PIG.hy,36,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(150,110,60,.35)';ctx.beginPath();ctx.ellipse(PIG.hx+8,PIG.hy+6,12,7,0,0,TAU);ctx.fill();
  const x=PIG.x,y=PIG.y,dir=Math.cos(PIG.a)>=0?1:-1,bob=Math.sin(PIG.t*.25)*(PIG.happy>0?1.5:.6);ctx.save();ctx.translate(x,y);ctx.scale(dir,1);
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(1,6,11,4,0,0,TAU);ctx.fill();ctx.fillStyle='#f4a6b8';ctx.beginPath();ctx.ellipse(0,bob,10,7,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(9,-2+bob,5.5,0,TAU);ctx.fill();
  ctx.fillStyle='#e0849a';ctx.beginPath();ctx.ellipse(13.5,-1+bob,2.6,2.2,0,0,TAU);ctx.fill();ctx.fillStyle='#8a3a4a';ctx.fillRect(13,-2+bob,.9,1.4);ctx.fillRect(14.4,-2+bob,.9,1.4);ctx.fillStyle='#222';ctx.fillRect(9.5,-4.5+bob,1.4,1.4);
  ctx.fillStyle='#e48aa0';ctx.beginPath();ctx.moveTo(6,-6+bob);ctx.lineTo(8,-10+bob);ctx.lineTo(10,-6+bob);ctx.fill();ctx.strokeStyle='#e0849a';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(-11,-2+bob,2.4,0,Math.PI*1.6);ctx.stroke();
  ctx.fillStyle='#e0849a';for(const lx of [-6,-2,3,7])ctx.fillRect(lx,5+bob,2,3);ctx.restore();
  const d=Math.hypot(P.x-x,P.y-y);if(d<120){ctx.font='800 11px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const t='🐷 Knorretje';const w=ctx.measureText(t).width+12;ctx.fillStyle='rgba(26,10,44,.85)';rrect(ctx,x-w/2,y-30,w,17,8);ctx.fill();ctx.fillStyle='#f4a6b8';ctx.fillText(t,x,y-21);}}
function pigFeed(){if(P.money<3){noteAdd('TE WEINIG GELD','Varkensvoer kost €3','#ff6b6b',150,'pig');return;}addMoney(-3);PIG.happy=360;addXP(10);sfx('mmm');buzz([20,30,20]);popTxt(PIG.x,PIG.y-22,'KNOR KNOR! ❤','#f4a6b8',1.2);
  if(typeof buyLog==='function')buyLog('🐷','Varkentje gevoerd',3);noteAdd('VARKENTJE GEVOERD','Knorretje smult van zijn emmertje voer. Wat een blij varken!','#f4a6b8',200,'pig');}
{const _af=actFind;actFind=function(){if(PIG.b&&!P.car&&!SC.on&&Math.hypot(P.x-PIG.x,P.y-PIG.y)<55)return{k:'pig',t:PIG.happy>0?'🐷 Knorretje is aan het smikkelen…':'🐷 Varkentje voeren (€3)',btn:'🐷<br>€3',off:PIG.happy>0};return _af.apply(this,arguments);};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='pig'){if(!a.off)pigFeed();return true;}return _at.apply(this,arguments);};}

// ---- duidelijker melden dat je een activiteit kunt starten
const ACT_START=new Set(['tennis','penalty','toys','stadscafe','dorp','fpv','castle','pig','thuis','esso','chinees','kwast','job','tol']);
{const _dn=drawNotes;drawNotes=function(){const a=ACT.cur;if(a&&ACT_START.has(a.k)&&!a.off&&!a._clear){a._clear=1;a._t0=a.t;}if(a&&a._t0)a.t=a._t0+(IS_TOUCH?'  ·  👉 tik hier of op de knop rechtsonder':'  ·  druk op E om te starten');_dn();};}
{const _nc=noteCard;noteCard=function(x,y,w,lab,r,b,c,al,tap){if(lab==='ACTIE'&&ACT.cur&&ACT_START.has(ACT.cur.k)){lab='▶ START ACTIVITEIT';r=IS_TOUCH?'TIK HIER':'E';c='#7dff6a';al=.82+.18*Math.sin(frameN*.12);}return _nc(x,y,w,lab,r,b,c,al,tap);};}

// ---- inhaken
{const _wb=wbStep;wbStep=function(){_wb();chestStep();pigStep();};}
{const _dt=drawTerrace;drawTerrace=function(){_dt();drawChest();drawPig();};}
{const _wi=wb3Init;wb3Init=function(){_wi();try{pigInit();}catch(e){console.warn(e);}};}
