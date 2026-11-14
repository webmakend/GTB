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
function hud(){
  ctx.setTransform(DPR,0,0,DPR,0,0);const U=clamp(Math.min(CW,CH)/560,.75,1.25),sm=CW<640,ut=uiTop(),L0=14;let y=ut.top;
  // ---- statuspaneel linksboven: portret, naam, geld, gezondheid, statistieken, (sterren bij politie)
  const S0=Math.round(clamp(Math.min(CW,CH)*.27,96,150)),pw=Math.min(CW-S0-40,236*U),ph=(stars>0?82:66)*U;
  {const g2=ctx.createLinearGradient(0,y,0,y+ph);g2.addColorStop(0,'rgba(40,14,66,.88)');g2.addColorStop(1,'rgba(12,4,24,.88)');ctx.fillStyle=g2;rrect(ctx,L0,y,pw,ph,14*U);ctx.fill();
   const cc=P.ch?P.ch.c:'#ff2e88';ctx.strokeStyle=cc+'99';ctx.lineWidth=1.5;rrect(ctx,L0,y,pw,ph,14*U);ctx.stroke();
   // portret
   const ar=19*U,ax=L0+10*U+ar,ay=y+10*U+ar;ctx.save();ctx.beginPath();ctx.arc(ax,ay,ar,0,TAU);ctx.fillStyle=cc;ctx.fill();ctx.clip();const im=P.ch&&avatarImg(P.ch);
   if(im&&im.complete&&im.naturalWidth){const w=im.naturalWidth;ctx.drawImage(im,w*.24,0,w*.52,w*.52,ax-ar,ay-ar,ar*2,ar*2);}else{ctx.fillStyle='#fff';ctx.font=`900 ${18*U}px Inter`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((P.ch?P.ch.name:'?')[0],ax,ay+1);}
   ctx.restore();ctx.strokeStyle=cc;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(ax,ay,ar,0,TAU);ctx.stroke();
   const tx=ax+ar+9*U,tw=L0+pw-10*U-tx;
   txt((P.ch?P.ch.name:''),tx,y+8*U,15*U,'#fff','left','Anton, Impact, sans-serif');
   const mf=P.moneyF>0?1+.25*Math.sin(P.moneyF/20*Math.PI):1;if(P.moneyF>0)P.moneyF--;const ms='€ '+P.money.toFixed(2).replace('.',',');ctx.save();ctx.font=`${16*U}px Anton, Impact, sans-serif`;const mw=ctx.measureText(ms).width;ctx.translate(L0+pw-10*U-mw/2,y+16*U);ctx.scale(mf,mf);txt(ms,-mw/2,-8*U,16*U,P.moneyF>0?'#b6ff9e':'#7dff6a','left','Anton, Impact, sans-serif');ctx.restore();
   // gezondheid
   const hy=y+31*U,hp=clamp(P.hp/P.maxhp,0,1);ctx.fillStyle='rgba(255,255,255,.12)';rrect(ctx,tx,hy,tw,7*U,4*U);ctx.fill();const hg=ctx.createLinearGradient(tx,0,tx+tw,0);hg.addColorStop(0,hp>.35?'#36d1a0':'#e8433a');hg.addColorStop(1,hp>.35?'#7dff6a':'#ff6b3d');ctx.fillStyle=hg;rrect(ctx,tx,hy,Math.max(4*U,tw*hp),7*U,4*U);ctx.fill();
   // statistieken
   ctx.font=`700 ${11*U}px Inter, sans-serif`;ctx.fillStyle='rgba(255,255,255,.85)';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(`💧 ${P.stats.nat}    🤕 ${P.stats.omver}    🚗 ${P.stats.gejat}`,tx,y+44*U);
   if(stars>0){for(let i=0;i<5;i++){const on=i<stars,fl=on&&copNear(500)&&(frameN>>4)&1;star(tx+8*U+i*20*U,y+67*U,7.5*U,on?(fl?'#4d8dff':'#ffd166'):'rgba(255,255,255,.16)');}}
  }
  y+=ph+8*U;ctx.save();const pn=placeName||'';ctx.font=`italic ${15*U}px Anton, Impact, sans-serif`;const maxW=pw;let t2=pn;while(t2.length>4&&ctx.measureText(t2).width>maxW)t2=t2.slice(0,-2);if(t2!==pn)t2+='…';ctx.restore();
  txt(t2,L0,y,15*U,'#ffd166','left','Anton, Impact, sans-serif');
  if(P.car){y+=20*U;txt(P.car.t.n+(P.car.boer?' · boer uit '+P.car.boer:'')+(P.car.state==='burning'?' — BRANDT!':''),L0,y,11.5*U,P.car.state==='burning'?'#ff6b3d':'#e8dcf5','left','Inter, sans-serif');}
  if(MIS.on&&!MIS.done){y+=(P.car?20:22)*U;const dm=Math.round(Math.hypot(MIS.x-me().x,MIS.y-me().y)/9);
    if(!MG.on){const cw=Math.min(CW-MINI_S-40,300*U);ctx.font=`700 ${12.5*U}px Inter, sans-serif`;const ls=wrapLines(MIS_DO[MIS.stage]||'',cw-20*U),ch=(26+ls.length*16)*U,pu=.55+.45*Math.abs(Math.sin(frameN*.05));
      ctx.fillStyle='rgba(10,4,24,.78)';rrect(ctx,L0,y,cw,ch,9*U);ctx.fill();ctx.fillStyle=`rgba(255,209,102,${pu})`;rrect(ctx,L0,y,5*U,ch,3);ctx.fill();
      txt((MIS_TXT[MIS.stage]||'').split(':')[0]+'  ·  '+dm+' m',L0+13*U,y+6*U,11*U,'#ffd166','left','Inter, sans-serif');ctx.font=`700 ${12.5*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='top';ls.forEach((l,i)=>ctx.fillText(l,L0+13*U,y+(22+i*16)*U));y+=ch-14*U;}
    const Z0=viewZ(),sx=CW/2+(MIS.x-camX)*Z0,sy=CH/2+(MIS.y-camY)*Z0,mg=34;if(!MG.on&&(sx<mg||sx>CW-mg||sy<mg+60||sy>CH-mg)){const a=Math.atan2(sy-CH/2,sx-CW/2),ex=clamp(CW/2+Math.cos(a)*CW,mg,CW-mg),ey=clamp(CH/2+Math.sin(a)*CH,mg+60,CH-mg-(IS_TOUCH?260:0));
      ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle='#ffd166';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-3,0);ctx.lineTo(-8,11);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
  // minikaart (rond, GTA-stijl) onder de knoppen rechtsboven
  const S=MINI_S=Math.round(clamp(Math.min(CW,CH)*.27,96,150)),mx=CW-S-12,my=ut.top,o=me(),span=S*18;MM={x:mx+S/2,y:my+S/2,r:S/2};
  ctx.save();ctx.beginPath();ctx.arc(mx+S/2,my+S/2,S/2,0,TAU);ctx.fillStyle='#4f86b0';ctx.fill();ctx.clip();
  if(MAPC)ctx.drawImage(MAPC,(o.x-span/2)*MAPS,(o.y-span/2)*MAPS,span*MAPS,span*MAPS,mx,my,S,S);
  const mp=(x,y)=>[mx+S/2+(x-o.x)*S/span,my+S/2+(y-o.y)*S/span];
  if(MIS.on&&!MIS.done){let [x,y]=mp(MIS.x,MIS.y);const dx=x-(mx+S/2),dy=y-(my+S/2),dd=Math.hypot(dx,dy);if(dd>S/2-7){x=mx+S/2+dx/dd*(S/2-7);y=my+S/2+dy/dd*(S/2-7);}ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(x,y,5.5,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();}
  for(const c of cars)if(c.driver==='cop'){const [x,y]=mp(c.x,c.y);ctx.fillStyle=(frameN>>3)&1?'#ff3b30':'#4d8dff';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
  ctx.save();ctx.translate(mx+S/2,my+S/2);ctx.rotate(P.car?P.car.a:P.a);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-6);ctx.lineTo(-2,0);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  ctx.restore();ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx+S/2,my+S/2,S/2,0,TAU);ctx.stroke();txt('N',mx+S/2,my+3,10,'#fff','center','Inter, sans-serif');
  // hint
  let hint='';if(!P.dead){if(P.car)hint=IS_TOUCH?'':'E: uitstappen · Spatie: handrem · S: remmen';else if(carNear())hint=IS_TOUCH?'Tik IN STAP om in te stappen':'E: instappen';else if(swimming())hint='Je zwemt! Zoek de kant op';else if(frameN<1500)hint=IS_TOUCH?'💧 = waterballon gooien':'Spatie: waterballon gooien';}
  if(hint)txt(hint,CW/2,CH-(IS_TOUCH?175:40),13.5*U,'#fff','center','Inter, sans-serif');
  msgs.forEach(m=>{const a=clamp(Math.min(m.life/25,(m.ml-m.life)/8+.2),0,1);ctx.globalAlpha=a;const big=Math.min((sm?36:56)*U,CW*.11);txt(m.t,CW/2,CH*.3,big,m.col,'center');if(m.sub)txt(m.sub,CW/2,CH*.3+big+6,(sm?13:16)*U,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;});
  if(!IS_TOUCH)txt('E in/uit · Spatie gooien/handrem · J springen · M kaart · muiswiel zoom · P pauze',16,CH-24,12,'rgba(255,255,255,.55)','left','Inter, sans-serif');
  if(P.hurtF>0){const a=P.hurtF/18,g3=ctx.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.3,CW/2,CH/2,Math.max(CW,CH)*.75);g3.addColorStop(0,'rgba(255,0,40,0)');g3.addColorStop(1,`rgba(255,0,40,${.55*a})`);ctx.fillStyle=g3;ctx.fillRect(0,0,CW,CH);}
  if(P.car&&speedOf(P.car)>5.2&&!MG.on){const k=clamp((speedOf(P.car)-5.2)/3,0,1);ctx.strokeStyle=`rgba(255,255,255,${.25*k})`;ctx.lineWidth=1.5;for(let i=0;i<14;i++){const a=(i*2.399+frameN*.07)%TAU,r0=Math.max(CW,CH)*(.42+((i*37+frameN*3)%40)/100);ctx.beginPath();ctx.moveTo(CW/2+Math.cos(a)*r0,CH/2+Math.sin(a)*r0);ctx.lineTo(CW/2+Math.cos(a)*(r0+60*k),CH/2+Math.sin(a)*(r0+60*k));ctx.stroke();}}
  drawCarName();statueHint();henkieMarker();actHint();
  drawMissionBanner();
  mapOverlay();
  if(paused){ctx.fillStyle='rgba(10,0,25,.65)';ctx.fillRect(0,0,CW,CH);txt('PAUZE',CW/2,CH/2-50,60,'#ffd166','center');txt(IS_TOUCH?'Tik op ▶ om verder te spelen':'Druk op P om verder te spelen',CW/2,CH/2+26,16,'#fff','center','Inter, sans-serif');}
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
  const [px,py]=mp(me().x,me().y);ctx.fillStyle=(frameN>>4)&1?'#fff':'#ff2e88';ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.stroke();
  txt('KAART · VESTING ZALTBOMMEL',CW/2,top-30,clamp(CW/22,16,22),'#ffd166','center');txt('tik ergens om te sluiten · ✕ rechtsboven',CW/2,top-10,11,'rgba(255,255,255,.7)','center','Inter, sans-serif');txt('Kaartdata © OpenStreetMap-bijdragers',x0+w,y0+h+4,10,'rgba(255,255,255,.6)','right','Inter, sans-serif');}
