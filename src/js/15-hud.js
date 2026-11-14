// ====================== HUD ======================
function star(x,y,r,fill){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.stroke();}
function txt(t,x,y,size,col,align,font){ctx.font=`${size}px ${font||'Anton, Impact, sans-serif'}`;ctx.textAlign=align||'left';ctx.textBaseline='top';ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillText(t,x+2,y+2);ctx.fillStyle=col;ctx.fillText(t,x,y);}
let MINI_S=170,MM={x:0,y:0,r:0};
const AVA={};function avatarImg(ch){if(!ch.img)return null;if(!AVA[ch.id]){AVA[ch.id]=new Image();AVA[ch.id].src=ch.img;}return AVA[ch.id];}
function uiTop(){const r=document.getElementById('mus').getBoundingClientRect();return{top:r.top||10,bottom:(r.bottom||50)};}
// ---- missie-melding: groot kaartje in beeld met titel en duidelijke opdracht
let MBAN=null;
function missionBanner(title,text,col,life){MBAN={title,text,col:col||'#ffd166',life:life||330,ml:life||330};sfx('reward');buzz(25);}
function wrapLines(t,maxW){const out=[];let cur='';for(const w of String(t).split(' ')){const tr=cur?cur+' '+w:w;if(ctx.measureText(tr).width>maxW&&cur){out.push(cur);cur=w;}else cur=tr;}if(cur)out.push(cur);return out;}
function drawMissionBanner(){if(!MBAN||MG.on)return;if(--MBAN.life<=0){MBAN=null;return;}const a=clamp(Math.min(MBAN.life/25,(MBAN.ml-MBAN.life)/10),0,1),U=clamp(Math.min(CW,CH)/560,.8,1.2);
  const w=Math.min(CW-28,440*U),x=(CW-w)/2,y=CH*.2+(1-a)*-20;ctx.font=`600 ${16*U}px Inter, sans-serif`;const lines=wrapLines(MBAN.text,w-44*U),h=(62+lines.length*22)*U;
  ctx.globalAlpha=a;ctx.fillStyle='rgba(10,4,24,.9)';rrect(ctx,x,y,w,h,14*U);ctx.fill();ctx.fillStyle=MBAN.col;rrect(ctx,x,y,7*U,h,4);ctx.fill();ctx.strokeStyle=MBAN.col;ctx.lineWidth=2;rrect(ctx,x,y,w,h,14*U);ctx.stroke();
  txt(MBAN.title,x+22*U,y+12*U,24*U,MBAN.col,'left','Anton, Impact, sans-serif');ctx.font=`600 ${16*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='top';lines.forEach((l,i)=>ctx.fillText(l,x+22*U,y+(48+i*22)*U));ctx.globalAlpha=1;}
let HUDX={misOpen:false},MINI_B=0;
function hud(){
  ctx.setTransform(DPR,0,0,DPR,0,0);const U=clamp(Math.min(CW,CH)/560,.75,1.25),sm=CW<640,ut=uiTop(),L0=14;let y=ut.top;
  const S0=Math.round(clamp(Math.min(CW,CH)*.27,96,150));
  // ---- statuskaart (zoals het ontwerp): portret met levelbadge, naam, geld, rang, HP en respect
  const pw=Math.min(CW-S0-46,330*U),ph=84*U;
  {ctx.fillStyle='rgba(28,30,48,.93)';rrect(ctx,L0,y,pw,ph,5*U);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.09)';ctx.lineWidth=1;rrect(ctx,L0,y,pw,ph,5*U);ctx.stroke();
   const ar=27*U,ax=L0+14*U+ar,ay=y+ph/2;ctx.save();ctx.beginPath();ctx.arc(ax,ay,ar,0,TAU);ctx.fillStyle=P.ch?P.ch.c:'#7b2ff7';ctx.fill();ctx.clip();const im=P.ch&&avatarImg(P.ch);
   if(im&&im.complete&&im.naturalWidth){const w=im.naturalWidth;ctx.drawImage(im,w*.24,(P.ch.avy||0)*w,w*.52,w*.52,ax-ar,ay-ar,ar*2,ar*2);}else{ctx.fillStyle='#fff';ctx.font=`900 ${20*U}px Inter`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((P.ch?P.ch.name:'?')[0],ax,ay+1);}
   ctx.restore();const rg=ctx.createLinearGradient(ax-ar,ay-ar,ax+ar,ay+ar);rg.addColorStop(0,'#b07cff');rg.addColorStop(1,'#4fb6ff');ctx.strokeStyle=rg;ctx.lineWidth=3.5*U;ctx.beginPath();ctx.arc(ax,ay,ar+1.5*U,0,TAU);ctx.stroke();
   const bx2=ax+ar*.72,by2=ay+ar*.72,br=10*U;ctx.fillStyle='#16182a';ctx.beginPath();ctx.arc(bx2,by2,br,0,TAU);ctx.fill();ctx.strokeStyle='#b07cff';ctx.lineWidth=2*U;ctx.stroke();txt(String(PRG.lvl),bx2,by2-7*U,12*U,'#fff','center','Inter, sans-serif');
   const tx=ax+ar+16*U,tr=L0+pw-14*U;
   ctx.font=`900 ${18*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='top';{let nm=String(netName()).toUpperCase();while(nm.length>3&&ctx.measureText(nm).width>pw-170*U)nm=nm.slice(0,-1);ctx.fillText(nm,tx,y+11*U);}
   const mf=P.moneyF>0?1+.2*Math.sin(P.moneyF/20*Math.PI):1;if(P.moneyF>0)P.moneyF--;const ms='€ '+Math.round(P.money).toLocaleString('nl-NL');ctx.save();ctx.font=`800 ${18*U}px Inter, sans-serif`;const mw=ctx.measureText(ms).width;ctx.translate(tr-mw/2,y+21*U);ctx.scale(mf,mf);ctx.fillStyle='#f5c542';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ms,0,0);ctx.restore();
   ctx.font=`600 ${12*U}px Inter, sans-serif`;ctx.fillStyle='#a9acc4';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(rankOf(PRG.lvl),tx,y+33*U);
   const vw=30*U,bar=(by,k,c0,c1,val,ic)=>{const bx=tx+18*U,bw=tr-vw-bx;ic(tx+6*U,by+3.5*U);ctx.fillStyle='rgba(255,255,255,.1)';rrect(ctx,bx,by,bw,7*U,3.5*U);ctx.fill();const g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;rrect(ctx,bx,by,Math.max(4*U,bw*k),7*U,3.5*U);ctx.fill();ctx.font=`700 ${12*U}px Inter, sans-serif`;ctx.fillStyle=c1;ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(String(val),tr,by+4*U);};
   const heart=(x,yy)=>{ctx.fillStyle='#4ade80';ctx.beginPath();ctx.moveTo(x,yy+4*U);ctx.bezierCurveTo(x-7*U,yy-1*U,x-4*U,yy-6*U,x,yy-2.5*U);ctx.bezierCurveTo(x+4*U,yy-6*U,x+7*U,yy-1*U,x,yy+4*U);ctx.fill();},
     bolt=(x,yy)=>{ctx.fillStyle='#b07cff';ctx.beginPath();ctx.moveTo(x+1.5*U,yy-6*U);ctx.lineTo(x-4*U,yy+1*U);ctx.lineTo(x,yy+1*U);ctx.lineTo(x-1.5*U,yy+6*U);ctx.lineTo(x+4*U,yy-1*U);ctx.lineTo(x,yy-1*U);ctx.closePath();ctx.fill();};
   const hp=clamp(P.hp/P.maxhp,0,1),base=lvlBase(PRG.lvl),nd=need(PRG.lvl),xi=PRG.xp-base;
   bar(y+52*U,hp,hp>.3?'#22c55e':'#ef4444',hp>.3?'#86efac':'#fca5a5',Math.round(P.hp),heart);bar(y+68*U,clamp(xi/nd,0,1),'#7c3aed','#c4a1ff',xi,bolt);
   HUDX.panel={x:L0,y,w:pw,h:ph};}
  y+=ph+10*U;HUDX.top=ut.top;HUDX.listW=pw;
  {const misOn=MIS.on&&!MIS.done&&!MG.on;if(misOn){const Z0=viewZ(),sx=CW/2+(MIS.x-camX)*Z0,sy=CH/2+(MIS.y-camY)*Z0,mg=34;if(sx<mg||sx>CW-mg||sy<mg+60||sy>CH-mg){const a=Math.atan2(sy-CH/2,sx-CW/2),ex=clamp(CW/2+Math.cos(a)*CW,mg,CW-mg),ey=clamp(CH/2+Math.sin(a)*CH,mg+60,CH-mg-(IS_TOUCH?240:0));
     ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle='#fb923c';ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}}
  HUDY=y;
  // minikaart (rond, GTA-stijl) onder de knoppen rechtsboven
  const S=MINI_S=Math.round(clamp(Math.min(CW,CH)*.27,96,150)),mx=CW-S-16,my=ut.top+22*U,o=me(),span=S*18;MM={x:mx+S/2,y:my+S/2,r:S/2};
  ctx.save();ctx.beginPath();ctx.arc(mx+S/2,my+S/2,S/2,0,TAU);ctx.fillStyle='#4f86b0';ctx.fill();ctx.clip();
  if(MAPC)ctx.drawImage(MAPC,(o.x-span/2)*MAPS,(o.y-span/2)*MAPS,span*MAPS,span*MAPS,mx,my,S,S);
  const mp=(x,y)=>[mx+S/2+(x-o.x)*S/span,my+S/2+(y-o.y)*S/span];
  if(MIS.on&&!MIS.done){let [x,y]=mp(MIS.x,MIS.y);const dx=x-(mx+S/2),dy=y-(my+S/2),dd=Math.hypot(dx,dy);if(dd>S/2-7){x=mx+S/2+dx/dd*(S/2-7);y=my+S/2+dy/dd*(S/2-7);}ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(x,y,5.5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();}
  histMinimap(mp,mx+S/2,my+S/2,S);jobMinimap(mp,mx+S/2,my+S/2,S);progMinimap(mp,mx+S/2,my+S/2,S);netMinimap(mp,mx+S/2,my+S/2,S);
  for(const c of cars)if(c.driver==='cop'){const [x,y]=mp(c.x,c.y);ctx.fillStyle=(frameN>>3)&1?'#ff3b30':'#4d8dff';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
  ctx.save();ctx.translate(mx+S/2,my+S/2);ctx.rotate(P.car?P.car.a:P.a);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-6);ctx.lineTo(-2,0);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  ctx.restore();{const cx3=mx+S/2,cy3=my+S/2,h=clamp(heat/4.5,0,1),pul=h>0?.75+.25*Math.sin(frameN*.18):0;ctx.lineWidth=8;ctx.strokeStyle='rgba(16,18,30,.95)';ctx.beginPath();ctx.arc(cx3,cy3,S/2+4,0,TAU);ctx.stroke();
   const g1=ctx.createLinearGradient(mx,my,mx+S,my+S);g1.addColorStop(0,'#b07cff');g1.addColorStop(1,'#3fb6ff');ctx.strokeStyle=g1;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx3,cy3,S/2+2,0,TAU);ctx.stroke();
   if(h>0){ctx.save();ctx.globalAlpha=Math.min(1,.25+h)*pul;const g2=ctx.createLinearGradient(mx,my+S,mx+S,my);g2.addColorStop(0,'#ff1f3d');g2.addColorStop(1,h>.6?'#ff6b3d':'rgba(255,31,61,.2)');ctx.shadowColor='#ff1f3d';ctx.shadowBlur=8+24*h;ctx.strokeStyle=g2;ctx.lineWidth=3+5*h;ctx.beginPath();ctx.arc(cx3,cy3,S/2+3,0,TAU);ctx.stroke();ctx.restore();
     const rg2=ctx.createRadialGradient(cx3,cy3,S/2,cx3,cy3,S/2+30*h+8);rg2.addColorStop(0,`rgba(255,31,61,${.35*h*pul})`);rg2.addColorStop(1,'rgba(255,31,61,0)');ctx.fillStyle=rg2;ctx.beginPath();ctx.arc(cx3,cy3,S/2+30*h+8,0,TAU);ctx.fill();}
   ctx.fillStyle='rgba(16,18,30,.95)';ctx.beginPath();ctx.arc(cx3,my-2*U,11*U,0,TAU);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;ctx.stroke();txt('N',cx3,my-9*U,12*U,'#fff','center','Inter, sans-serif');
   MINI_B=my+S+10;HUDX.mini={x:mx,y:my,S};}
  // hint
  let hint='';if(!P.dead){if(P.car)hint=IS_TOUCH?'':'E: uitstappen · Spatie: handrem · S: remmen';else if(carNear())hint=IS_TOUCH?'':'E: instappen';else if(swimming())hint='Je zwemt! Zoek de kant op';else if(frameN<1500&&!IS_TOUCH)hint='Spatie: waterballon gooien';}
  if(hint)txt(hint,CW/2,CH-(IS_TOUCH?175:40),13.5*U,'#fff','center','Inter, sans-serif');
  if(!IS_TOUCH)txt('E in/uit/actie · Spatie gooien/schieten/handrem · Q wapen wisselen · R radio · J springen (2× = dubbel) · M kaart · Tab menu',16,CH-24,12,'rgba(255,255,255,.55)','left','Inter, sans-serif');
  if(P.hurtF>0){const a=P.hurtF/18,g3=ctx.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.3,CW/2,CH/2,Math.max(CW,CH)*.75);g3.addColorStop(0,'rgba(255,0,40,0)');g3.addColorStop(1,`rgba(255,0,40,${.55*a})`);ctx.fillStyle=g3;ctx.fillRect(0,0,CW,CH);}
  if(P.car&&speedOf(P.car)>5.2&&!MG.on){const k=clamp((speedOf(P.car)-5.2)/3,0,1);ctx.strokeStyle=`rgba(255,255,255,${.25*k})`;ctx.lineWidth=1.5;for(let i=0;i<14;i++){const a=(i*2.399+frameN*.07)%TAU,r0=Math.max(CW,CH)*(.42+((i*37+frameN*3)%40)/100);ctx.beginPath();ctx.moveTo(CW/2+Math.cos(a)*r0,CH/2+Math.sin(a)*r0);ctx.lineTo(CW/2+Math.cos(a)*(r0+60*k),CH/2+Math.sin(a)*(r0+60*k));ctx.stroke();}}
  drawCarName();statueHint();henkieMarker();actHint();progHud();jobHud();netHud();drawNotes();
  if(MINI_B!==HUDX.lastMB){HUDX.lastMB=MINI_B;placeTopBtns();}
  deathOverlay();mapOverlay();
  if(paused){ctx.fillStyle='rgba(10,0,25,.65)';ctx.fillRect(0,0,CW,CH);txt('PAUZE',CW/2,CH/2-50,60,'#ffd166','center');txt(IS_TOUCH?'Tik om verder te spelen':'Druk op P of klik om verder te spelen',CW/2,CH/2+26,16,'#fff','center','Inter, sans-serif');}
  if(IS_TOUCH&&frameN%6===0)updTouchUI();
  if(MG.on)drawMinigame();
}
function mapOverlay(){let ov=document.getElementById('mapOv');
  if(!ov){ov=document.createElement('div');ov.id='mapOv';ov.style.cssText='position:fixed;inset:0;z-index:45;display:none;background:rgba(8,4,20,.92);touch-action:none';
    const c=document.createElement('canvas');c.id='mapC';c.style.cssText='position:absolute;inset:0;width:100%;height:100%';ov.appendChild(c);
    const b=document.createElement('div');b.textContent='✕  SLUITEN';b.style.cssText='position:absolute;right:calc(var(--sr) + 14px);top:calc(var(--st) + 14px);padding:10px 16px;border-radius:12px;background:#ff2e88;color:#fff;font:800 14px Inter,sans-serif;letter-spacing:1px;cursor:pointer';ov.appendChild(b);
    ov.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();bigMap=false;});document.body.appendChild(ov);}
  ov.style.display=bigMap?'block':'none';if(!bigMap)return;const c=document.getElementById('mapC');if(c.width!==Math.round(CW*DPR)||c.height!==Math.round(CH*DPR)){c.width=Math.round(CW*DPR);c.height=Math.round(CH*DPR);}
  const keep=ctx;ctx=c.getContext('2d');ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,CW,CH);drawBigMap();ctx=keep;}
function drawBigMap(){
  const bx0=FORTBB[0]-250,by0=FORTBB[1]-250,bw=FORTBB[2]-FORTBB[0]+500,bh=FORTBB[3]-FORTBB[1]+500,top=uiTop().bottom+34;
  const s=Math.min((CW-20)/bw,(CH-top-30)/bh),w=bw*s,h=bh*s,x0=(CW-w)/2,y0=top+(CH-top-30-h)/2;
  if(MAPC){ctx.imageSmoothingQuality='high';ctx.drawImage(MAPC,bx0*MAPS,by0*MAPS,bw*MAPS,bh*MAPS,x0,y0,w,h);}ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.strokeRect(x0,y0,w,h);
  const mp=(x,y)=>[x0+(x-bx0)*s,y0+(y-by0)*s],fs=clamp(w/95,8.5,12);ctx.font=`700 ${fs}px Inter, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  const placed=[];
  for(const l of LANDMARKS.slice().sort((a,b)=>(a.shop?1:0)-(b.shop?1:0))){const [x,y]=mp(l.x,l.y);ctx.fillStyle=l.shop?(l.c||'#fff'):'#ffd166';ctx.beginPath();ctx.arc(x,y,l.shop?3:4.5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.stroke();
    const tw=ctx.measureText(l.n).width;let ly=y-fs;if(placed.some(q=>Math.abs(q[0]-x)<(q[2]+tw)/2+2&&Math.abs(q[1]-ly)<fs+1))ly=y+fs;if(placed.some(q=>Math.abs(q[0]-x)<(q[2]+tw)/2+2&&Math.abs(q[1]-ly)<fs+1))continue;placed.push([x,ly,tw]);
    ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.strokeText(l.n,x,ly);ctx.fillStyle='#fff';ctx.fillText(l.n,x,ly);}
  if(MIS.on&&!MIS.done){const [qx,qy]=mp(MIS.x,MIS.y),r=9+3*Math.sin(frameN*.15);ctx.strokeStyle='#ffd166';ctx.lineWidth=3;ctx.beginPath();ctx.arc(qx,qy,r,0,TAU);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText('MISSIE',qx,qy-r-8);ctx.fillStyle='#ffd166';ctx.fillText('MISSIE',qx,qy-r-8);}
  histBigMap(mp);jobBigMap(mp,fs);progBigMap(mp,fs);
  const [px,py]=mp(me().x,me().y);ctx.fillStyle=(frameN>>4)&1?'#fff':'#ff2e88';ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.stroke();
  txt('KAART · VESTING ZALTBOMMEL',CW/2,top-30,clamp(CW/22,16,22),'#ffd166','center');txt('tik ergens om te sluiten · ✕ rechtsboven',CW/2,top-10,11,'rgba(255,255,255,.7)','center','Inter, sans-serif');txt('Kaartdata © OpenStreetMap-bijdragers',x0+w,y0+h+4,10,'rgba(255,255,255,.6)','right','Inter, sans-serif');}

// ---- WASTED / BUSTED in GTA-stijl (Pricedown als die er is, anders een vette fallback)
const DEATH_FONT="'Pricedown','Pricedown Bl','Pricedown Black',Anton,Impact,sans-serif";
function deathOverlay(){ctx=fctx;const want=P.dead>0&&(P.deadKind==='wasted'||P.deadKind==='bust');
  const f=want?(P.deadKind==='wasted'?'grayscale(1) contrast(1.1) brightness(.85)':'grayscale(.7) brightness(.8) sepia(.25) hue-rotate(180deg)'):'';
  if(!(P.high>0)&&cv._df!==f){cv.style.filter=f;cv._df=f;const lc=document.getElementById('lightc');if(lc)lc.style.filter=f;}if(!want)return;
  const T=220-P.dead,a=clamp(T/40,0,1),wa=P.deadKind==='wasted';
  ctx.fillStyle=`rgba(0,0,0,${.35*a})`;ctx.fillRect(0,0,CW,CH);
  const g=ctx.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.2,CW/2,CH/2,Math.max(CW,CH)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${.6*a})`);ctx.fillStyle=g;ctx.fillRect(0,0,CW,CH);
  if(T<30)return;const k=clamp((T-30)/14,0,1),sc=1+(1-k)*.6,fs=Math.min(CW*.2,130);
  ctx.save();ctx.globalAlpha=k;ctx.translate(CW/2,CH*.46);ctx.scale(sc,sc);ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(-CW,-fs*.62,CW*2,fs*1.24);
  ctx.font=`${fs}px ${DEATH_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=fs*.09;ctx.strokeStyle='#000';const t=wa?'WASTED':'BUSTED';
  ctx.strokeText(t,0,fs*.04);ctx.fillStyle=wa?'#c0192b':'#3f8cff';ctx.fillText(t,0,fs*.04);ctx.restore();
  if(T>70){ctx.globalAlpha=clamp((T-70)/20,0,1);const sub=wa?(P.deadWhy||'De huisarts lapt je weer op'):(P.deadWhy||'Al je wapens zijn in beslag genomen');txt(sub,CW/2,CH*.46+fs*.72,15,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;}}
