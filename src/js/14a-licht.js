// ====================== licht (PixiJS / WebGL-lichtkaart) ======================
// Werkt zoals PointLight2D + LightOccluder2D in Godot, maar dan in de browser:
//  - een lichtkaart (aparte WebGL-canvas) met een zomeravond-basiskleur;
//  - lampen, koplampen, achterlichten, neon en zwaailichten tellen daar als licht bij op (additief);
//  - straatlantaarns werpen schaduwen tegen gebouwen: die zijn statisch, dus per kaartvak één keer
//    'gebakken' (geen rekenwerk per frame);
//  - de lichtkaart ligt met mix-blend-mode:multiply over de wereld: waar licht is zie je echte kleuren,
//    daarbuiten de paarse avondgloed.
// Lukt WebGL niet, dan valt het spel terug op de oude canvas-belichting (drawEvening).
const GL={ok:false,app:null,world:null,amb:null,chunks:new Map(),pool:[],used:0,tex:{},res:1};
const LCS=512,LBAKE=.5,LR=110; // kaartvak (wereld-px), bakschaal, lamp-straal

function texFromCanvas(c){return PIXI.Texture.from(c);}
function makeLightTextures(){
  const r=document.createElement('canvas');r.width=r.height=128;const g=r.getContext('2d'),rg=g.createRadialGradient(64,64,0,64,64,64);
  rg.addColorStop(0,'rgba(255,255,255,1)');rg.addColorStop(.25,'rgba(255,255,255,.55)');rg.addColorStop(.6,'rgba(255,255,255,.16)');rg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=rg;g.fillRect(0,0,128,128);
  const c=document.createElement('canvas');c.width=256;c.height=128;const h=c.getContext('2d'),cg=h.createRadialGradient(0,64,4,0,64,256);
  cg.addColorStop(0,'rgba(255,255,255,1)');cg.addColorStop(.45,'rgba(255,255,255,.45)');cg.addColorStop(1,'rgba(255,255,255,0)');h.fillStyle=cg;h.beginPath();h.moveTo(0,58);h.arc(0,64,256,-.42,.42);h.lineTo(0,70);h.closePath();h.fill();
  const a=document.createElement('canvas');a.width=a.height=256;const k=a.getContext('2d'),ag=k.createLinearGradient(0,0,180,256);ag.addColorStop(0,'#d9a07c');ag.addColorStop(.5,'#a27598');ag.addColorStop(1,'#564c96');k.fillStyle=ag;k.fillRect(0,0,256,256);
  GL.tex.rad=texFromCanvas(r);GL.tex.cone=texFromCanvas(c);GL.tex.amb=texFromCanvas(a);}

async function initLights(){const el=document.getElementById('lightc');
  if(!window.PIXI){return;}
  try{const app=new PIXI.Application();GL.res=Math.min(DPR,IS_TOUCH?1:1.5);
    await app.init({canvas:el,width:CW,height:CH,resolution:GL.res,autoDensity:true,antialias:false,backgroundColor:0x000000,backgroundAlpha:1,preference:'webgl',autoStart:false,sharedTicker:false,powerPreference:'high-performance'});
    app.ticker&&app.ticker.stop();GL.app=app;makeLightTextures();
    GL.amb=new PIXI.Sprite(GL.tex.amb);app.stage.addChild(GL.amb);
    GL.world=new PIXI.Container();app.stage.addChild(GL.world);
    GL.baked=new PIXI.Container();GL.dyn=new PIXI.Container();GL.world.addChild(GL.baked,GL.dyn);
    GL.ok=true;lightsResize();
  }catch(e){GL.ok=false;el.style.display='none';console.warn('WebGL-licht niet beschikbaar, canvas-terugval',e);}}
function lightsResize(){if(!GL.ok)return;GL.app.renderer.resize(CW,CH);GL.amb.width=CW;GL.amb.height=CH;GL.shown=false;document.getElementById('lightc').style.display='none';}

// ---- gebakken lantaarnlicht + neon per kaartvak (met schaduwen tegen gebouwen)
function bakeChunk(ci,cj){const S=Math.ceil(LCS*LBAKE),c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d');
  const x0=ci*LCS,y0=cj*LCS;g.setTransform(LBAKE,0,0,LBAKE,-x0*LBAKE,-y0*LBAKE);g.globalCompositeOperation='lighter';
  const near=(x,y,m)=>x>x0-m&&x<x0+LCS+m&&y>y0-m&&y<y0+LCS+m;
  for(const l of LAMPS){if(!near(l.x,l.y,LR))continue;bakeLamp(l);g.drawImage(BL,l.x-LR,l.y-LR,LR*2,LR*2);}
  for(const b of BUILDINGS){if(!b.sign||!near(b.cx,b.cy,90))continue;const rg=g.createRadialGradient(b.cx,b.cy,0,b.cx,b.cy,90);rg.addColorStop(0,b.signC[0]+'aa');rg.addColorStop(1,b.signC[0]+'00');g.fillStyle=rg;g.fillRect(b.cx-90,b.cy-90,180,180);}
  return c;}
const BL=document.createElement('canvas');BL.width=BL.height=128;const blx=BL.getContext('2d');
function bakeLamp(l){const sc=64/LR;if(!l.bs2)l.bs2=BUILDINGS.filter(b=>!b.pass&&b.bb[2]>l.x-LR&&b.bb[0]<l.x+LR&&b.bb[3]>l.y-LR&&b.bb[1]<l.y+LR);
  blx.setTransform(1,0,0,1,0,0);blx.globalCompositeOperation='source-over';blx.clearRect(0,0,128,128);blx.setTransform(sc,0,0,sc,64-l.x*sc,64-l.y*sc);
  const rg=blx.createRadialGradient(l.x,l.y,0,l.x,l.y,LR);rg.addColorStop(0,'rgba(255,214,160,.95)');rg.addColorStop(.3,'rgba(255,190,120,.5)');rg.addColorStop(1,'rgba(255,170,90,0)');blx.fillStyle=rg;blx.fillRect(l.x-LR,l.y-LR,LR*2,LR*2);
  if(l.bs2.length){blx.globalCompositeOperation='destination-out';blx.fillStyle='rgba(0,0,0,.95)';
    for(const b of l.bs2){const p=b.p;for(let i=0,j=p.length-1;i<p.length;j=i++){const A=p[j],B=p[i],ax=A[0]-l.x,ay=A[1]-l.y,bx=B[0]-l.x,by=B[1]-l.y,da=Math.hypot(ax,ay)||1,db=Math.hypot(bx,by)||1;
      blx.beginPath();blx.moveTo(A[0],A[1]);blx.lineTo(B[0],B[1]);blx.lineTo(B[0]+bx/db*300,B[1]+by/db*300);blx.lineTo(A[0]+ax/da*300,A[1]+ay/da*300);blx.closePath();blx.fill();}}}}

function chunkSprite(ci,cj){const key=ci+','+cj;let e=GL.chunks.get(key);if(e){e.t=frameN;return e;}
  const cvs=bakeChunk(ci,cj),tex=texFromCanvas(cvs),spr=new PIXI.Sprite(tex);spr.x=ci*LCS;spr.y=cj*LCS;spr.width=spr.height=LCS;spr.blendMode='add';GL.baked.addChild(spr);
  e={spr,tex,t:frameN};GL.chunks.set(key,e);
  if(GL.chunks.size>(IS_TOUCH?60:110)){let old=null,ok=null;for(const [k,v] of GL.chunks)if(!old||v.t<old.t){old=v;ok=k;}if(old&&old!==e){old.spr.destroy();old.tex.destroy(true);GL.chunks.delete(ok);}}
  return e;}

// ---- dynamische lichten (koplampen, achterlichten, zwaailichten, vuur) via een sprite-pool
function dynLight(tex,x,y,sx,sy,rot,tint,alpha){let s=GL.pool[GL.used];if(!s){s=new PIXI.Sprite(tex);s.blendMode='add';GL.dyn.addChild(s);GL.pool.push(s);}
  GL.used++;s.texture=tex;s.anchor.set(tex===GL.tex.cone?0:.5,.5);s.x=x;s.y=y;s.scale.set(sx,sy);s.rotation=rot;s.tint=tint;s.alpha=alpha;s.visible=true;}

function lightsRender(vx0,vy0,vx1,vy1){if(!GL.ok)return;const w=GL.world;
  w.position.set(CW/2,CH/2);w.rotation=CAM.r;w.scale.set(CAM.z);w.pivot.set(CAM.x,CAM.y);
  for(const e of GL.chunks.values())e.spr.visible=false;
  for(let cj=Math.max(0,Math.floor(vy0/LCS));cj<=Math.min(Math.ceil(H/LCS)-1,Math.floor(vy1/LCS));cj++)for(let ci=Math.max(0,Math.floor(vx0/LCS));ci<=Math.min(Math.ceil(W/LCS)-1,Math.floor(vx1/LCS));ci++)chunkSprite(ci,cj).spr.visible=true;
  GL.used=0;const iv=(x,y,m)=>x>vx0-m&&x<vx1+m&&y>vy0-m&&y<vy1+m,RAD=GL.tex.rad,CONE=GL.tex.cone;
  for(const c of cars){if(c.dead||!iv(c.x,c.y,200))continue;const fx=Math.cos(c.a),fy=Math.sin(c.a),hl=c.t.l/2,hw=c.t.w/2;
    if(c.state==='burning'){const f=.8+.2*Math.sin(frameN*.6+c.x);dynLight(RAD,c.x,c.y,2.4*f,2.4*f,0,0xff7a2a,.9);continue;}
    if(c.state!=='ok'||!(c.driver||c===P.car))continue;const me2=c===P.car,len=(me2?190:140)/256;
    if(!c.t.bike){for(const sd of [-1,1])dynLight(CONE,c.x+fx*(hl-2)-fy*hw*.55*sd,c.y+fy*(hl-2)+fx*hw*.55*sd,len,len*.9,c.a,0xfff1d6,me2?1:.7);}
    else dynLight(CONE,c.x+fx*hl,c.y+fy*hl,len*.7,len*.6,c.a,0xfff1d6,.6);
    const br=c===P.car?(c.brk?1:.55):(c.ai&&c.ai.wait>0?1:.5);dynLight(RAD,c.x-fx*hl,c.y-fy*hl,.42*br+.2,.32*br+.15,c.a,0xff2020,.8*br);
    if(c.type==='police'&&c.ai&&c.ai.mode==='pursuit'){const on=(frameN>>3)&1;dynLight(RAD,c.x-fy*8,c.y+fx*8,1.6,1.6,0,on?0xff2030:0x2050ff,.85);}}
  if(BRIDGE&&BRIDGE.py)for(const q of BRIDGE.py)if(q.top&&iv(q.top[0],q.top[1],60)){const b=.6+.4*((frameN>>5)&1);dynLight(RAD,q.top[0],q.top[1],.6,.6,0,0xff2020,b);}
  for(const b of barges)if(iv(b.x,b.y,300))dynLight(RAD,b.x,b.y,1.4,1.4,0,0xffd9a0,.6);
  if(MIS.on&&!MIS.done&&iv(MIS.x,MIS.y,100)){const p=1+.2*Math.sin(frameN*.12);dynLight(RAD,MIS.x,MIS.y,1.5*p,1.5*p,0,0xffd166,.9);}
  if(!P.car&&!P.dead)dynLight(RAD,P.x,P.y,1.1,1.1,0,0xffe6c8,.35); // zacht 'speler-licht' zodat je jezelf altijd ziet
  for(let i=GL.used;i<GL.pool.length;i++)GL.pool[i].visible=false;
  GL.app.render();if(!GL.shown){GL.shown=true;document.getElementById('lightc').style.display='block';}}

// ---- gloed op de bovenste laag (wordt niet verdonkerd): lampkernen, neon, koplamp-flares
function drawGlows(vx0,vy0,vx1,vy1){const iv=(x,y,m)=>x>vx0-m&&x<vx1+m&&y>vy0-m&&y<vy1+m;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of LAMPS){if(!iv(l.x,l.y,20))continue;glow(l.x,l.y,9,'rgba(255,236,200,.85)');}
  for(const b of BUILDINGS){if(!b.sign||!iv(b.cx,b.cy,60))continue;glow(b.cx,b.cy,34,b.signC[0]+'44');}
  for(const c of cars){if(c.dead||c.state!=='ok'||!(c.driver||c===P.car)||!iv(c.x,c.y,40)||c.t.bike)continue;const fx=Math.cos(c.a),fy=Math.sin(c.a),hl=c.t.l/2,hw=c.t.w/2;
    for(const sd of [-1,1])glow(c.x+fx*hl-fy*hw*.55*sd,c.y+fy*hl+fx*hw*.55*sd,7,'rgba(255,250,230,.8)');
    if(c.type==='police'&&c.ai&&c.ai.mode==='pursuit')glow(c.x,c.y,26,(frameN>>3)&1?'rgba(255,40,40,.55)':'rgba(40,110,255,.55)');}
  ctx.restore();}
