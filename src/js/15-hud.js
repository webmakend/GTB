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
  // ---- missiebalk bovenin het midden (tik = uitklappen)
  const S0=Math.round(clamp(Math.min(CW,CH)*.27,96,150));
  {const job=typeof JOB!=='undefined'&&JOB.cur,misOn=MIS.on&&!MIS.done&&!MG.on;
   if(misOn||job){const pw=Math.min(CW-28,380*U),px=CW/2-pw/2,ph1=34*U,open=!!HUDX.misOpen;const title=misOn?(MIS_TXT[MIS.stage]||'MISSIE'):'KLUS: '+job.n.toUpperCase(),body=misOn?(MIS_DO[MIS.stage]||''):(JOB.txt||'');
     ctx.font=`600 ${12*U}px Inter, sans-serif`;const ls=open?wrapLines(body,pw-28*U):[],ph=ph1+(open?ls.length*15*U+10*U:0)+12*U;
     ctx.fillStyle='rgba(18,22,34,.86)';rrect(ctx,px,y,pw,ph,12*U);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1.5;rrect(ctx,px,y,pw,ph,12*U);ctx.stroke();
     ctx.strokeStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(px+10*U,y+ph1);ctx.lineTo(px+pw-10*U,y+ph1);ctx.stroke();
     const ix=px+12*U,iy=y+8*U,is=18*U,ic=misOn?'#c77dff':(job.col||'#36d1ff');ctx.strokeStyle=ic;ctx.lineWidth=2;rrect(ctx,ix,iy,is,is,4*U);ctx.stroke();ctx.fillStyle=ic;ctx.beginPath();ctx.moveTo(ix+4*U,iy+is-4*U);ctx.lineTo(ix+is/2,iy+5*U);ctx.lineTo(ix+is-4*U,iy+is-4*U);ctx.closePath();ctx.fill();
     let tt=title.toUpperCase();ctx.font=`${17*U}px Anton, Impact, sans-serif`;const dist=misOn?Math.round(Math.hypot(MIS.x-me().x,MIS.y-me().y)/9)+' m':(JOB.T>0?(()=>{const s2=Math.max(0,Math.ceil((JOB.T-JOB.t)/60));return Math.floor(s2/60)+':'+String(s2%60).padStart(2,'0');})():'');
     ctx.font=`700 ${11*U}px Inter, sans-serif`;const dw=dist?ctx.measureText(dist).width+12*U:0;ctx.font=`${17*U}px Anton, Impact, sans-serif`;while(tt.length>4&&ctx.measureText(tt).width>pw-60*U-dw)tt=tt.slice(0,-2);
     txt(tt,ix+is+12*U,y+7*U,17*U,'#e9ecf5','left','Anton, Impact, sans-serif');if(dist)txt(dist,px+pw-12*U,y+11*U,11*U,'#ffd166','right','Inter, sans-serif');
     ctx.font=`600 ${12*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='top';ls.forEach((l,k)=>ctx.fillText(l,px+14*U,y+ph1+8*U+k*15*U));
     const cy2=y+ph-7*U,cx2=CW/2;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx2-7*U,cy2-(open?0:3)*U);ctx.lineTo(cx2,cy2+(open?-4:1)*U);ctx.lineTo(cx2+7*U,cy2-(open?0:3)*U);ctx.stroke();
     HUDX.misRect={x:px,y,w:pw,h:ph};y+=ph+10*U;}else HUDX.misRect=null;
   if(misOn){const Z0=viewZ(),sx=CW/2+(MIS.x-camX)*Z0,sy=CH/2+(MIS.y-camY)*Z0,mg=34;if(sx<mg||sx>CW-mg||sy<mg+60||sy>CH-mg){const a=Math.atan2(sy-CH/2,sx-CW/2),ex=clamp(CW/2+Math.cos(a)*CW,mg,CW-mg),ey=clamp(CH/2+Math.sin(a)*CH,mg+60,CH-mg-(IS_TOUCH?280:0));
     ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle='#ffd166';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-3,0);ctx.lineTo(-8,11);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}}
  HUDX.top=y;
  // ---- statuspaneel: portret, naam, geld, HP, waterballonnen, respect
  const pw=Math.min(CW-S0-44,250*U),ph=74*U,TEAL='#36d1c4';
  {ctx.save();ctx.shadowColor='rgba(54,209,196,.45)';ctx.shadowBlur=14;ctx.fillStyle='rgba(16,20,32,.88)';rrect(ctx,L0,y,pw,ph,14*U);ctx.fill();ctx.restore();
   ctx.strokeStyle='rgba(54,209,196,.75)';ctx.lineWidth=1.6;rrect(ctx,L0,y,pw,ph,14*U);ctx.stroke();
   const cc=P.ch?P.ch.c:TEAL,ar=23*U,ax=L0+10*U+ar,ay=y+ph/2-2*U;ctx.save();ctx.beginPath();ctx.arc(ax,ay,ar,0,TAU);ctx.fillStyle=cc;ctx.fill();ctx.clip();const im=P.ch&&avatarImg(P.ch);
   if(im&&im.complete&&im.naturalWidth){const w=im.naturalWidth;ctx.drawImage(im,w*.24,(P.ch.avy||0)*w,w*.52,w*.52,ax-ar,ay-ar,ar*2,ar*2);}else{ctx.fillStyle='#fff';ctx.font=`900 ${18*U}px Inter`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((P.ch?P.ch.name:'?')[0],ax,ay+1);}
   ctx.restore();ctx.save();ctx.shadowColor=TEAL;ctx.shadowBlur=10;ctx.strokeStyle=TEAL;ctx.lineWidth=3;ctx.beginPath();ctx.arc(ax,ay,ar,0,TAU);ctx.stroke();ctx.restore();
   const tx=ax+ar+10*U,tw=L0+pw-12*U-tx;
   txt((P.ch?P.ch.name:'').toUpperCase(),tx,y+8*U,17*U,'#fff','left','Anton, Impact, sans-serif');
   const mf=P.moneyF>0?1+.25*Math.sin(P.moneyF/20*Math.PI):1;if(P.moneyF>0)P.moneyF--;const ms='€ '+Math.round(P.money).toLocaleString('nl-NL');ctx.save();ctx.font=`${18*U}px Anton, Impact, sans-serif`;const mw=ctx.measureText(ms).width;ctx.translate(L0+pw-12*U-mw/2,y+17*U);ctx.scale(mf,mf);ctx.shadowColor='rgba(125,255,106,.6)';ctx.shadowBlur=8;txt(ms,-mw/2,-10*U,18*U,'#7dff6a','left','Anton, Impact, sans-serif');ctx.restore();
   const bar=(by,lab,col,k,g0,g1)=>{const bx=tx+(lab?20*U:0),bw=tw-(lab?20*U:0);if(lab==='HP')txt('HP',tx,by-2*U,10*U,col,'left','Inter, sans-serif');else{ctx.fillStyle='#5cc8ff';ctx.beginPath();ctx.moveTo(tx+7*U,by-3*U);ctx.quadraticCurveTo(tx+12*U,by+3*U,tx+7*U,by+6*U);ctx.quadraticCurveTo(tx+2*U,by+3*U,tx+7*U,by-3*U);ctx.fill();}
     ctx.fillStyle='rgba(255,255,255,.1)';rrect(ctx,bx,by,bw,8*U,4*U);ctx.fill();const gr=ctx.createLinearGradient(bx,0,bx+bw,0);gr.addColorStop(0,g0);gr.addColorStop(1,g1);ctx.fillStyle=gr;rrect(ctx,bx,by,Math.max(5*U,bw*k),8*U,4*U);ctx.fill();};
   const hp=clamp(P.hp/P.maxhp,0,1);bar(y+36*U,'HP','#7dff6a',hp,hp>.35?'#2fd1a0':'#e8433a',hp>.35?'#7dff6a':'#ff6b3d');bar(y+52*U,'W','#5cc8ff',clamp((P.ammo|0)/12,0,1),'#36a8ff','#b06bff');
   const base=lvlBase(PRG.lvl),xk=clamp((PRG.xp-base)/need(PRG.lvl),0,1);ctx.save();rrect(ctx,L0,y,pw,ph,14*U);ctx.clip();ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(L0+8*U,y+ph-5*U,pw-16*U,3*U);const xg=ctx.createLinearGradient(L0,0,L0+pw,0);xg.addColorStop(0,'#7b2ff7');xg.addColorStop(1,'#c77dff');ctx.fillStyle=xg;ctx.fillRect(L0+8*U,y+ph-5*U,(pw-16*U)*xk,3*U);ctx.restore();
   HUDX.panel={x:L0,y,w:pw,h:ph};}
  y+=ph+6*U;
  txt((placeName||'')+(PRG?'  ·  '+rankOf(PRG.lvl)+' LV '+PRG.lvl:''),L0+4*U,y,11*U,'rgba(233,236,245,.75)','left','Inter, sans-serif');y+=14*U;
  HUDY=y+28*U;
  // minikaart (rond, GTA-stijl) onder de knoppen rechtsboven
  const S=MINI_S=Math.round(clamp(Math.min(CW,CH)*.27,96,150)),mx=CW-S-16,my=HUDX.top+4*U,o=me(),span=S*18;MM={x:mx+S/2,y:my+S/2,r:S/2};
  ctx.save();ctx.beginPath();ctx.arc(mx+S/2,my+S/2,S/2,0,TAU);ctx.fillStyle='#4f86b0';ctx.fill();ctx.clip();
  if(MAPC)ctx.drawImage(MAPC,(o.x-span/2)*MAPS,(o.y-span/2)*MAPS,span*MAPS,span*MAPS,mx,my,S,S);
  const mp=(x,y)=>[mx+S/2+(x-o.x)*S/span,my+S/2+(y-o.y)*S/span];
  if(MIS.on&&!MIS.done){let [x,y]=mp(MIS.x,MIS.y);const dx=x-(mx+S/2),dy=y-(my+S/2),dd=Math.hypot(dx,dy);if(dd>S/2-7){x=mx+S/2+dx/dd*(S/2-7);y=my+S/2+dy/dd*(S/2-7);}ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(x,y,5.5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();}
  histMinimap(mp,mx+S/2,my+S/2,S);jobMinimap(mp,mx+S/2,my+S/2,S);progMinimap(mp,mx+S/2,my+S/2,S);netMinimap(mp,mx+S/2,my+S/2,S);
  for(const c of cars)if(c.driver==='cop'){const [x,y]=mp(c.x,c.y);ctx.fillStyle=(frameN>>3)&1?'#ff3b30':'#4d8dff';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
  ctx.save();ctx.translate(mx+S/2,my+S/2);ctx.rotate(P.car?P.car.a:P.a);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-6);ctx.lineTo(-2,0);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  ctx.restore();{const cx3=mx+S/2,cy3=my+S/2;ctx.lineWidth=9;ctx.strokeStyle='rgba(14,16,28,.92)';ctx.beginPath();ctx.arc(cx3,cy3,S/2+5,0,TAU);ctx.stroke();
   let gr;try{gr=ctx.createConicGradient(-Math.PI/2,cx3,cy3);gr.addColorStop(0,'#ff4d6d');gr.addColorStop(.3,'#ff2e88');gr.addColorStop(.55,'#36d1c4');gr.addColorStop(.8,'#36a8ff');gr.addColorStop(1,'#ff4d6d');}catch(e){gr='#36d1c4';}
   ctx.save();ctx.shadowColor='rgba(54,209,196,.7)';ctx.shadowBlur=12;ctx.strokeStyle=gr;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx3,cy3,S/2+2,0,TAU);ctx.stroke();ctx.restore();
   ctx.fillStyle='rgba(14,16,28,.95)';ctx.beginPath();ctx.arc(cx3,my-3,9*U,0,TAU);ctx.fill();txt('N',cx3,my-10*U,12*U,'#fff','center','Anton, Impact, sans-serif');
   MINI_B=my+S+12;if(stars>0){const sy=my+S+18*U,n=5,sp=19*U,x0=cx3-(n-1)*sp/2;for(let i=0;i<n;i++){const on=i<stars,fl=on&&copNear(500)&&(frameN>>4)&1;ctx.save();if(on){ctx.shadowColor='#ff2e2e';ctx.shadowBlur=10;}star(x0+i*sp,sy,8.5*U,on?(fl?'#4d8dff':'#ff3b3b'):'rgba(255,255,255,.9)');ctx.restore();}
     ctx.fillStyle='rgba(10,6,14,.7)';const wy=sy+12*U;ctx.fillRect(cx3-S/2,wy,S,20*U);ctx.save();ctx.shadowColor='#ff2e2e';ctx.shadowBlur=8;txt('WANTED',cx3,wy+2*U,16*U,'#ff3b3b','center','Anton, Impact, sans-serif');ctx.restore();MINI_B=wy+26*U;}}
  // hint
  let hint='';if(!P.dead){if(P.car)hint=IS_TOUCH?'':'E: uitstappen · Spatie: handrem · S: remmen';else if(carNear())hint=IS_TOUCH?'':'E: instappen';else if(swimming())hint='Je zwemt! Zoek de kant op';else if(frameN<1500&&!IS_TOUCH)hint='Spatie: waterballon gooien';}
  if(hint)txt(hint,CW/2,CH-(IS_TOUCH?175:40),13.5*U,'#fff','center','Inter, sans-serif');
  if(!IS_TOUCH)txt('E in/uit/actie · Spatie gooien/schieten/handrem · Q wapen · R radio · J springen (2× = dubbel) · M kaart · Tab menu',16,CH-24,12,'rgba(255,255,255,.55)','left','Inter, sans-serif');
  if(P.hurtF>0){const a=P.hurtF/18,g3=ctx.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.3,CW/2,CH/2,Math.max(CW,CH)*.75);g3.addColorStop(0,'rgba(255,0,40,0)');g3.addColorStop(1,`rgba(255,0,40,${.55*a})`);ctx.fillStyle=g3;ctx.fillRect(0,0,CW,CH);}
  if(P.car&&speedOf(P.car)>5.2&&!MG.on){const k=clamp((speedOf(P.car)-5.2)/3,0,1);ctx.strokeStyle=`rgba(255,255,255,${.25*k})`;ctx.lineWidth=1.5;for(let i=0;i<14;i++){const a=(i*2.399+frameN*.07)%TAU,r0=Math.max(CW,CH)*(.42+((i*37+frameN*3)%40)/100);ctx.beginPath();ctx.moveTo(CW/2+Math.cos(a)*r0,CH/2+Math.sin(a)*r0);ctx.lineTo(CW/2+Math.cos(a)*(r0+60*k),CH/2+Math.sin(a)*(r0+60*k));ctx.stroke();}}
  drawCarName();statueHint();henkieMarker();actHint();progHud();jobHud();netHud();drawNotes();
  if(MINI_B!==HUDX.lastMB){HUDX.lastMB=MINI_B;placeTopBtns();}
  mapOverlay();
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
