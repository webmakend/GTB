// ====================== tekenen ======================
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function drawCar(c){const t=c.t,L=t.l,Wd=t.w;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);if(c.sink>0)ctx.globalAlpha=Math.max(0,1-c.sink/70);
  ctx.fillStyle='rgba(0,0,0,.32)';rrect(ctx,-L/2+5,-Wd/2+5,L,Wd,5);ctx.fill();
  if(c.t.bike){ctx.fillStyle='#111';rrect(ctx,L/2-9,-3.5,9,7,3);ctx.fill();rrect(ctx,-L/2,-3.5,9,7,3);ctx.fill();ctx.fillStyle=c.col;ctx.fillRect(-L/2+6,-1.5,L-12,3);ctx.fillStyle='#333';ctx.fillRect(L/2-10,-6,2,12);
    if(c.driver||c===P.car){ctx.fillStyle=c===P.car?(P.ch?P.ch.body:'#ff2e88'):(c.rider||'#333');ctx.beginPath();ctx.ellipse(-1,0,4.5,6.5,0,0,TAU);ctx.fill();ctx.fillStyle=c===P.car?'#2b1d0e':'#1a1a1a';ctx.beginPath();ctx.arc(1,0,3.3,0,TAU);ctx.fill();}ctx.restore();return;}
  if(c.type==='tractor'&&c.state!=='wreck'){ctx.fillStyle='#151515';ctx.fillRect(-L/2+1,-Wd/2-3,15,7);ctx.fillRect(-L/2+1,Wd/2-4,15,7);ctx.fillRect(L/2-11,-Wd/2+1,8,4);ctx.fillRect(L/2-11,Wd/2-5,8,4);
    ctx.fillStyle=c.col;rrect(ctx,-L/2+4,-Wd/2+4,L-5,Wd-8,3);ctx.fill();ctx.fillStyle=shade(c.col,.75);ctx.fillRect(0,-3,L/2-2,6);ctx.fillStyle='rgba(185,225,245,.8)';ctx.fillRect(-L/2+5,-Wd/2+5,15,Wd-10);
    ctx.fillStyle=shade(c.col,.65);ctx.fillRect(-L/2+7,-Wd/2+7,11,Wd-14);ctx.fillStyle='#222';ctx.beginPath();ctx.arc(L/2-12,-5,1.8,0,TAU);ctx.fill();ctx.fillStyle='#ffd166';ctx.fillRect(L/2-2,-4,2,3);ctx.fillRect(L/2-2,1,2,3);ctx.restore();return;}
  if(c.type==='bakfiets'){ctx.fillStyle='#222';ctx.fillRect(-L/2,-1,L,2);ctx.fillStyle=c.col;ctx.fillRect(2,-Wd/2,L/2-2,Wd);ctx.fillStyle='#3a2a1a';ctx.fillRect(4,-Wd/2+2,L/2-6,Wd-4);ctx.fillStyle=c.driver?'#e67e22':'#555';ctx.beginPath();ctx.arc(-L/4,0,4,0,TAU);ctx.fill();ctx.restore();return;}
  if(c.spr&&CAR_ATLAS_OK&&c.state!=='wreck'){drawCarSprite(c);ctx.restore();return;}
  const body=c.state==='wreck'?'#2a2725':c.col,mov=c.driver||c===P.car;
  if(mov&&c.state==='ok'){const gl=ctx.createLinearGradient(L/2,0,L/2+60,0);gl.addColorStop(0,'rgba(255,244,190,.28)');gl.addColorStop(1,'rgba(255,244,190,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.moveTo(L/2,-Wd/2+3);ctx.lineTo(L/2+60,-Wd/2-10);ctx.lineTo(L/2+60,Wd/2+10);ctx.lineTo(L/2,Wd/2-3);ctx.closePath();ctx.fill();}
  ctx.fillStyle=body;ctx.beginPath();const rf=c.type==='van'?4:9,rb=3;ctx.moveTo(-L/2+rb,-Wd/2);ctx.lineTo(L/2-rf,-Wd/2);ctx.quadraticCurveTo(L/2,-Wd/2,L/2,-Wd/2+rf);ctx.lineTo(L/2,Wd/2-rf);ctx.quadraticCurveTo(L/2,Wd/2,L/2-rf,Wd/2);ctx.lineTo(-L/2+rb,Wd/2);ctx.quadraticCurveTo(-L/2,Wd/2,-L/2,Wd/2-rb);ctx.lineTo(-L/2,-Wd/2+rb);ctx.quadraticCurveTo(-L/2,-Wd/2,-L/2+rb,-Wd/2);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
  if(c.state!=='wreck'){
    if(c.type==='van'){ctx.fillStyle=shade(c.col,.86);ctx.fillRect(-L/2+2,-Wd/2+2,L-17,Wd-4);ctx.fillStyle='#1c2733';ctx.fillRect(L/2-14,-Wd/2+2,6,Wd-4);}
    else{const pk=.016,wx=(c.x-camX)*pk,wy=(c.y-camY)*pk,ca=Math.cos(c.a),sa=Math.sin(c.a);ctx.save();ctx.translate(wx*ca+wy*sa,-wx*sa+wy*ca);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-L/2+8,-Wd/2+3,L-20,Wd-6);ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(L/2-12,-Wd/2+3,1,Wd-6);ctx.fillRect(L/2-8,-Wd/2+4,1,Wd-8);
      ctx.fillStyle='#22364c';ctx.beginPath();ctx.moveTo(L/2-12,-Wd/2+2.5);ctx.lineTo(L/2-21,-Wd/2+3.5);ctx.lineTo(L/2-21,Wd/2-3.5);ctx.lineTo(L/2-12,Wd/2-2.5);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(180,220,255,.35)';ctx.beginPath();ctx.moveTo(L/2-13,-Wd/2+4);ctx.lineTo(L/2-16,-Wd/2+4.5);ctx.lineTo(L/2-19,Wd/2-6);ctx.lineTo(L/2-14,Wd/2-5);ctx.closePath();ctx.fill();
      ctx.fillStyle=shade(c.col,c.col==='#0b0b0b'?2.2:1.1);ctx.fillRect(-L/2+9,-Wd/2+3,L-30,Wd-6);ctx.fillStyle='#152232';ctx.fillRect(-L/2+4,-Wd/2+4,4,Wd-8);ctx.fillStyle='#1c2733';ctx.fillRect(-L/2+10,-Wd/2+1.5,L-31,2);ctx.fillRect(-L/2+10,Wd/2-3.5,L-31,2);ctx.restore();}
    if(c.type==='velzart'){ctx.fillStyle='#0b0b0b';ctx.fillRect(-L/2+9,-Wd/2+3,L-25,Wd-6);ctx.fillStyle='#fff';ctx.font='bold 8.5px Inter,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('VelzArt',-3,.5);
      ctx.fillStyle='#fff';ctx.fillRect(-L/2+3,-Wd/2,L-6,1.2);ctx.fillRect(-L/2+3,Wd/2-1.2,L-6,1.2);}
    if(c.type==='taxi'){ctx.fillStyle='#ffd400';ctx.fillRect(-4,-4,8,8);ctx.fillStyle='#111';ctx.font='bold 5px Inter';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('TAXI',0,.5);}
    if(c.type==='police'){ctx.fillStyle='#1f4fbf';ctx.fillRect(-L/2+2,-Wd/2,L-4,3);ctx.fillRect(-L/2+2,Wd/2-3,L-4,3);ctx.fillStyle='#e8562a';ctx.fillRect(-L/2+13,-Wd/2,6,3);ctx.fillRect(-L/2+13,Wd/2-3,6,3);
      const on=c.ai&&c.ai.mode==='pursuit',fl=(frameN>>3)&1;ctx.fillStyle=on&&fl?'#ff2a2a':'#5a1010';ctx.fillRect(-4,-Wd/2+3,5,Wd/2-3);ctx.fillStyle=on&&!fl?'#2a6bff':'#1f3a7a';ctx.fillRect(-4,0,5,Wd/2-3);
      if(on){ctx.fillStyle=fl?'rgba(255,40,40,.16)':'rgba(40,110,255,.16)';ctx.beginPath();ctx.arc(0,0,34,0,TAU);ctx.fill();}}
    if(c.type==='sport'){ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(-L/2,-2,L,1.5);ctx.fillRect(-L/2,1,L,1.5);}
    ctx.fillStyle='#fffbe2';rrect(ctx,L/2-3.5,-Wd/2+1.5,3.5,5,1.2);ctx.fill();rrect(ctx,L/2-3.5,Wd/2-6.5,3.5,5,1.2);ctx.fill();
    const brake=c.ctl&&c.ctl[0]<0&&fwdSpeed(c)>.4;ctx.fillStyle=brake?'#ff3030':'#b0181a';ctx.fillRect(-L/2,-Wd/2+1.5,2.5,5.5);ctx.fillRect(-L/2,Wd/2-7,2.5,5.5);
    if(brake){ctx.fillStyle='rgba(255,40,40,.28)';ctx.beginPath();ctx.arc(-L/2-2,-Wd/2+4,6,0,TAU);ctx.arc(-L/2-2,Wd/2-4,6,0,TAU);ctx.fill();}
    if(c.hp<40){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-L/4,-Wd/2,L/3,Wd);}
  }else{ctx.fillStyle='#151313';ctx.fillRect(-L/2+5,-Wd/2+3,L-10,Wd-6);}
  ctx.restore();}
function drawDog(g){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.a);ctx.scale(g.sz,g.sz);const s=Math.sin(g.anim)*2.5,wag=Math.sin(frameN*.5)*.8;
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(1.5,1.5,7,3.6,0,0,TAU);ctx.fill();ctx.fillStyle='#1d1612';ctx.fillRect(2+s,-4,2,2);ctx.fillRect(2-s,2,2,2);ctx.fillRect(-4-s,-4,2,2);ctx.fillRect(-4+s,2,2,2);
  ctx.fillStyle=g.col;ctx.beginPath();ctx.ellipse(0,0,6.5,3.3,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(6.8,0,2.8,0,TAU);ctx.fill();ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(6.2,-2.4,1.2,1.8,0,0,TAU);ctx.ellipse(6.2,2.4,1.2,1.8,0,0,TAU);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(9.4,0,.9,0,TAU);ctx.fill();ctx.strokeStyle=g.col;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-10,wag*4);ctx.stroke();
  if(g.bark>0){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1;for(const r of [5,8]){ctx.beginPath();ctx.arc(9,0,r,-.6,.6);ctx.stroke();}}ctx.restore();}
function drawPed(p,isPlayer){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
  if(p.state==='down'&&p.spr&&PPL_OK){const r=p.spr,w=16,sc=w/r[3],L=r[2]*sc;ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(1,2,11,6,0,0,TAU);ctx.fill();ctx.rotate(Math.PI/2);ctx.scale(1.15,.8);ctx.drawImage(PPL,r[0],r[1],r[2],r[3],-L/2,-w/2,L,w);ctx.restore();return;}
  if(p.state==='down'){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(1,2,10,5,0,0,TAU);ctx.fill();ctx.fillStyle='#222';ctx.fillRect(-12,-4,6,3);ctx.fillRect(-12,1,6,3);ctx.fillStyle=p.col;ctx.beginPath();ctx.ellipse(0,0,8,5,0,0,TAU);ctx.fill();ctx.fillStyle=p.hair;ctx.beginPath();ctx.arc(9,0,3.4,0,TAU);ctx.fill();ctx.restore();return;}
  if(p.spr&&PPL_OK){drawPplSprite(p.spr,isPlayer?17:16,p.anim,isPlayer?P.moving:p.state!=='idle',isPlayer?p.run:p.state==='flee');
    if(isPlayer){ctx.globalAlpha=(frameN>>4)&1?1:.35;ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(11,0,2.8,0,TAU);ctx.fill();ctx.globalAlpha=1;}
    if(p.wet>0){ctx.fillStyle='rgba(90,170,255,.45)';ctx.beginPath();ctx.ellipse(0,0,5,8,0,0,TAU);ctx.fill();if(frameN%8===0)parts.push({x:p.x,y:p.y,vx:rr(-.3,.3),vy:rr(-.3,.3),l:16,ml:16,s:1.6,k:'w'});}
    ctx.restore();return;}
  const s=Math.sin(p.anim)*4;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(2,2,5,7,0,0,TAU);ctx.fill();
  ctx.fillStyle='#222';ctx.fillRect(s-2,-5,5,3);ctx.fillRect(-s-2,2,5,3);ctx.fillStyle=p.col;ctx.beginPath();ctx.ellipse(0,0,4.2,7,0,0,TAU);ctx.fill();
  if(isPlayer){ctx.globalAlpha=(frameN>>4)&1?1:.35;ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(10,0,2.8,0,TAU);ctx.fill();ctx.globalAlpha=1;}
  ctx.fillStyle=p.hair;ctx.beginPath();ctx.arc(.5,0,3.4,0,TAU);ctx.fill();
  if(p.kind==='cop'){ctx.fillStyle='#0d1a33';ctx.fillRect(-2.5,-3,5,6);}
  if(p.wet>0){ctx.fillStyle='rgba(90,170,255,.5)';ctx.beginPath();ctx.ellipse(0,0,5,8,0,0,TAU);ctx.fill();if(frameN%8===0)parts.push({x:p.x,y:p.y,vx:rr(-.3,.3),vy:rr(-.3,.3),l:16,ml:16,s:1.6,k:'w'});}
  ctx.restore();}
function drawSwimmer(){ctx.save();ctx.translate(P.x,P.y);ctx.rotate(P.a);const s=Math.sin(P.anim*1.2);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-2,0,9+Math.abs(s)*2,Math.PI*.6,Math.PI*1.4);ctx.stroke();
  ctx.strokeStyle='#e9b48a';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(1,-3);ctx.lineTo(5+s*4,-8);ctx.moveTo(1,3);ctx.lineTo(5-s*4,8);ctx.stroke();ctx.fillStyle='#ff2e88';ctx.beginPath();ctx.ellipse(-3,0,3,4,0,0,TAU);ctx.fill();ctx.fillStyle='#2b1d0e';ctx.beginPath();ctx.arc(1,0,3.4,0,TAU);ctx.fill();ctx.restore();}
function drawBeach(vx0,vy0,vx1,vy1){const iv=(x,y)=>x>vx0-40&&x<vx1+40&&y>vy0-40&&y<vy1+40;
  if(BEACHA_OK)for(const p of BPROPS){if(!iv(p.x,p.y))continue;const r=BEACH_SPR[p.k];if(!r)continue;const h=p.sz,w=h*r[2]/r[3],bob=p.w?Math.sin(frameN*.03+p.x)*1.2:0;
    ctx.fillStyle=p.w?'rgba(255,255,255,.18)':'rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(p.x+3,p.y+1,w*.42,Math.max(3,h*.12),0,0,TAU);ctx.fill();
    ctx.save();ctx.translate(p.x,p.y+bob);if(p.f)ctx.scale(-1,1);if(p.k==='fire'){const fl=1+.06*Math.sin(frameN*.4);ctx.scale(fl,fl);}ctx.drawImage(BEACHA,r[0],r[1],r[2],r[3],-w/2,-h*.92,w,h);ctx.restore();}
  for(const s2 of SWIMMERS){if(!iv(s2.x,s2.y))continue;const r=6+3*Math.sin(frameN*.05+s2.ph);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(s2.x,s2.y,r+4,0,TAU);ctx.stroke();ctx.fillStyle='#e9b48a';ctx.beginPath();ctx.arc(s2.x+Math.cos(frameN*.08+s2.ph)*6,s2.y+3,2,0,TAU);ctx.fill();ctx.fillStyle=s2.cap||s2.hair;ctx.beginPath();ctx.arc(s2.x,s2.y,4,0,TAU);ctx.fill();}
  for(const b of BWALK){if(!iv(b.x,b.y))continue;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);
    if(PPL_OK){if(b.spr==null)b.spr=pplSpr('walk');drawPplSprite(b.spr,15,b.anim,!(b.stop>0));}ctx.restore();}
  for(const b of BEACHERS){if(!iv(b.x,b.y))continue;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-13,-6,28,15);ctx.fillStyle=b.towel;ctx.fillRect(-15,-8,30,16);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-15,-8,30,3);ctx.fillRect(-15,5,30,3);
    if(PPL_OK){if(b.spr==null)b.spr=b.special?PPL_SPR.lie[1]:pplSpr('lie');const r=b.spr,L=28,sc=L/r[2],w=r[3]*sc;ctx.drawImage(PPL,r[0],r[1],r[2],r[3],-L/2,-w/2,L,w);}
    else{ctx.fillStyle=b.skin;ctx.fillRect(-11,-3,22,6);ctx.fillStyle=b.suit;ctx.fillRect(-4,-3.5,8,7);ctx.fillStyle=b.hair;ctx.beginPath();ctx.arc(12,0,3.6,0,TAU);ctx.fill();}
    ctx.restore();if(b.umb){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.arc(b.x+10,b.y+8,16,0,TAU);ctx.fill();ctx.fillStyle=b.umb;ctx.beginPath();for(let k=0;k<8;k++){const a=k/8*TAU;ctx.lineTo(b.x+4+Math.cos(a)*16,b.y+Math.sin(a)*16);}ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;for(let k=0;k<4;k++){const a=k/4*Math.PI;ctx.beginPath();ctx.moveTo(b.x+4-Math.cos(a)*16,b.y-Math.sin(a)*16);ctx.lineTo(b.x+4+Math.cos(a)*16,b.y+Math.sin(a)*16);ctx.stroke();}}}}
function drawTrees(vx0,vy0,vx1,vy1,cx,cy){const k=.0016*22;for(const t of TREES){if(t.x<vx0-60||t.x>vx1+60||t.y<vy0-60||t.y>vy1+60)continue;const ox=(t.x-cx)*k,oy=(t.y-cy)*k;
  ctx.strokeStyle='#4a3424';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.x+ox*.8,t.y+oy*.8);ctx.stroke();const x=t.x+ox,y=t.y+oy;
  ctx.fillStyle=t.c;ctx.beginPath();ctx.arc(x,y,t.r,0,TAU);ctx.fill();ctx.fillStyle='rgba(0,0,0,.16)';ctx.beginPath();ctx.arc(x+t.r*.3,y+t.r*.3,t.r*.62,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(x-t.r*.32,y-t.r*.32,t.r*.5,0,TAU);ctx.fill();}}
function cone(x,y,a,len,al){const g=ctx.createRadialGradient(x,y,2,x,y,len);g.addColorStop(0,`rgba(255,245,215,${al})`);g.addColorStop(.6,`rgba(255,235,190,${al*.45})`);g.addColorStop(1,'rgba(255,230,180,0)');ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+Math.cos(a+1.57)*6,y+Math.sin(a+1.57)*6);ctx.arc(x,y,len,a-.42,a+.42);ctx.lineTo(x+Math.cos(a-1.57)*6,y+Math.sin(a-1.57)*6);ctx.closePath();ctx.fill();}
const LC=document.createElement('canvas');LC.width=LC.height=208;const lcx=LC.getContext('2d');
function lampLight(l){const R0=96,sc=104/R0;if(!l.bs)l.bs=BUILDINGS.filter(b=>!b.pass&&b.bb[2]>l.x-R0&&b.bb[0]<l.x+R0&&b.bb[3]>l.y-R0&&b.bb[1]<l.y+R0);
  lcx.setTransform(1,0,0,1,0,0);lcx.globalCompositeOperation='source-over';lcx.clearRect(0,0,208,208);lcx.setTransform(sc,0,0,sc,104-l.x*sc,104-l.y*sc);
  const g=lcx.createRadialGradient(l.x,l.y,0,l.x,l.y,R0);g.addColorStop(0,'rgba(255,214,150,.55)');g.addColorStop(.35,'rgba(255,186,110,.26)');g.addColorStop(1,'rgba(255,170,90,0)');lcx.fillStyle=g;lcx.fillRect(l.x-R0,l.y-R0,R0*2,R0*2);
  if(l.bs.length){lcx.globalCompositeOperation='destination-out';lcx.fillStyle='rgba(0,0,0,.92)';for(const b of l.bs){const p=b.p;for(let i=0,j=p.length-1;i<p.length;j=i++){const A=p[j],B=p[i],ax=A[0]-l.x,ay=A[1]-l.y,bx=B[0]-l.x,by=B[1]-l.y,da=Math.hypot(ax,ay)||1,db=Math.hypot(bx,by)||1;
      lcx.beginPath();lcx.moveTo(A[0],A[1]);lcx.lineTo(B[0],B[1]);lcx.lineTo(B[0]+bx/db*260,B[1]+by/db*260);lcx.lineTo(A[0]+ax/da*260,A[1]+ay/da*260);lcx.closePath();lcx.fill();}}}
  ctx.drawImage(LC,l.x-R0,l.y-R0,R0*2,R0*2);}
function glow(x,y,r,c){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function drawEvening(vx0,vy0,vx1,vy1){
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='multiply';const gr=ctx.createLinearGradient(0,0,CW*.6,CH);gr.addColorStop(0,'#ffcf9a');gr.addColorStop(.5,'#e3a6c4');gr.addColorStop(1,'#8f7fd0');ctx.fillStyle=gr;ctx.fillRect(0,0,CW,CH);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';const iv=(x,y,m)=>x>vx0-m&&x<vx1+m&&y>vy0-m&&y<vy1+m;
  {const vis=LAMPS.filter(l=>iv(l.x,l.y,100));const sh=vis.length<=(IS_TOUCH?45:80);for(const l of vis){if(sh&&!l.br)lampLight(l);else glow(l.x,l.y,l.br?60:74,'rgba(255,186,110,.30)');glow(l.x,l.y,6,'rgba(255,240,200,.9)');}}
  for(const b of BUILDINGS){if(!b.sign||!iv(b.cx,b.cy,90))continue;glow(b.cx,b.cy,70,b.signC[0]+'55');}
  for(const c of cars){if(c.dead||c.state!=='ok'||!(c.driver||c===P.car)||!iv(c.x,c.y,90))continue;const fx=Math.cos(c.a),fy=Math.sin(c.a),hl=c.t.l/2;cone(c.x+fx*(hl-2),c.y+fy*(hl-2),c.a,c===P.car?150:115,c===P.car?.30:.22);glow(c.x-fx*hl,c.y-fy*hl,16,'rgba(255,40,40,.35)');
    if(c.type==='police'&&c.ai&&c.ai.mode==='pursuit')glow(c.x,c.y,60,(frameN>>3)&1?'rgba(255,40,40,.35)':'rgba(40,110,255,.35)');}
  if(BRIDGE&&BRIDGE.py)for(const q of BRIDGE.py)if(q.top)glow(q.top[0],q.top[1],22,'rgba(255,40,40,.5)');
  for(const b of barges)if(iv(b.x,b.y,300)){glow(b.x,b.y,40,'rgba(255,220,150,.25)');}
  ctx.restore();}
function drawBridgeSign(vx0,vy0,vx1,vy1,cx,cy){if(!BRIDGE)return;const {A,ux,uy,L}=BRIDGE,nx=-uy,ny=ux,k=.0016;
  for(const [t,sd] of [[.16,1],[.86,-1]]){const bx=A[0]+ux*L*t+nx*sd*62,by=A[1]+uy*L*t+ny*sd*62;if(bx<vx0-200||bx>vx1+200||by<vy0-200||by>vy1+200)continue;
    const h=60,ox=(bx-cx)*k*h,oy=(by-cy)*k*h,tx=bx+ox,ty=by+oy-h*.35;ctx.strokeStyle='#9aa3ad';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx-14,by);ctx.lineTo(tx-14,ty);ctx.moveTo(bx+14,by);ctx.lineTo(tx+14,ty);ctx.stroke();
    const w2=t<.5?122:112,hh=44;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(bx-w2/2+6,by-hh/2+8,w2,hh);ctx.fillStyle='#1a4fa3';rrect(ctx,tx-w2/2,ty-hh/2,w2,hh,5);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;rrect(ctx,tx-w2/2+3,ty-hh/2+3,w2-6,hh-6,4);ctx.stroke();
    ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 14px Inter, sans-serif';ctx.fillText(t<.5?'Waardenburg':'Zaltbommel',tx,ty-6);ctx.font='700 10px Inter, sans-serif';ctx.fillText(t<.5?'⬈ afslag  A2':'⬋ centrum',tx,ty+11);}}
function drawCables(vx0,vy0,vx1,vy1,cx,cy){if(!BRIDGE||!BRIDGE.py)return;const k=.0016,{ux,uy}=BRIDGE;ctx.strokeStyle='rgba(245,238,225,.85)';ctx.lineWidth=1.6;
  for(const q of BRIDGE.py){const b=q.b,f=Math.min(b.ht,330)*k*.98,tx=b.cx+(b.cx-cx)*f,ty=b.cy+(b.cy-cy)*f;if(Math.max(Math.abs(b.cx-cx),Math.abs(b.cy-cy))>3000)continue;
    for(let i=1;i<=9;i++)for(const dir of [-1,1]){const d=i*44*dir,ex=b.cx+ux*d,ey=b.cy+uy*d;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(ex,ey);ctx.stroke();}
    ctx.fillStyle=(frameN>>5)&1?'#ff3030':'#7a1010';ctx.beginPath();ctx.arc(tx,ty,4,0,TAU);ctx.fill();q.top=[tx,ty];}}
function drawBuildings(vx0,vy0,vx1,vy1,cx,cy){
  const k=.0016,vis=[];for(const b of BUILDINGS){if(b.bb[2]<vx0-160||b.bb[0]>vx1+160||b.bb[3]<vy0-160||b.bb[1]>vy1+160)continue;b._d=(b.cx-cx)**2+(b.cy-cy)**2;vis.push(b);}
  vis.sort((a,b)=>b._d-a._d);
  for(const b of vis){const f=Math.min(b.ht,180)*k,p=b.p,n=p.length,r=new Array(n);for(let i=0;i<n;i++)r[i]=[p[i][0]+(p[i][0]-cx)*f,p[i][1]+(p[i][1]-cy)*f];
    for(let i=0;i<n-1;i++){const a=p[i],q=p[i+1],nx=q[1]-a[1],ny=a[0]-q[0];ctx.fillStyle=Math.abs(nx)>Math.abs(ny)?(nx>0?b.wE:b.wW):(ny>0?b.wS:b.wN);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(r[i+1][0],r[i+1][1]);ctx.lineTo(r[i][0],r[i][1]);ctx.closePath();ctx.fill();
      const th=Math.hypot(r[i][0]-a[0],r[i][1]-a[1]),ln=Math.hypot(q[0]-a[0],q[1]-a[1]);if(th>7&&ln>16&&b.kind!=='tower'){const fl=Math.max(1,Math.min(5,Math.round(b.ht/15)));ctx.strokeStyle=(hsh(i,b.bb[0]|0)%3)?'rgba(255,206,130,.85)':'rgba(40,30,40,.55)';ctx.lineWidth=Math.min(4,th/fl*.38);ctx.setLineDash([3.5,4.5]);
        for(let j=0;j<fl;j++){const tt=(j+.55)/(fl+.3);ctx.beginPath();ctx.moveTo(a[0]+(r[i][0]-a[0])*tt+(q[0]-a[0])*.08,a[1]+(r[i][1]-a[1])*tt+(q[1]-a[1])*.08);ctx.lineTo(q[0]+(r[i+1][0]-q[0])*tt-(q[0]-a[0])*.08,q[1]+(r[i+1][1]-q[1])*tt-(q[1]-a[1])*.08);ctx.stroke();}ctx.setLineDash([]);}}
    ctx.beginPath();ctx.moveTo(r[0][0],r[0][1]);for(let i=1;i<n;i++)ctx.lineTo(r[i][0],r[i][1]);ctx.closePath();ctx.fillStyle=b.roof;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=1.2;ctx.stroke();
    const rcx=b.cx+(b.cx-cx)*f,rcy=b.cy+(b.cy-cy)*f;
    if(b.ridge){ctx.save();ctx.clip();const ca=Math.cos(b.ra),sa=Math.sin(b.ra);ctx.fillStyle='rgba(0,0,0,.17)';ctx.beginPath();ctx.moveTo(rcx-ca*400,rcy-sa*400);ctx.lineTo(rcx+ca*400,rcy+sa*400);ctx.lineTo(rcx+ca*400-sa*400,rcy+sa*400+ca*400);ctx.lineTo(rcx-ca*400-sa*400,rcy-sa*400+ca*400);ctx.closePath();ctx.fill();
      ctx.strokeStyle=b.roofD;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(rcx-ca*400,rcy-sa*400);ctx.lineTo(rcx+ca*400,rcy+sa*400);ctx.stroke();ctx.restore();
      if(b.chim){const bx=b.bb[0]+(b.bb[2]-b.bb[0])*b.chim[0],by=b.bb[1]+(b.bb[3]-b.bb[1])*b.chim[1];ctx.fillStyle='#5b3a2e';ctx.fillRect(bx+(bx-cx)*f*1.1-3,by+(by-cy)*f*1.1-3,7,7);}}
    else if(b.kind==='tower'){ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(r[0][0],r[0][1]);ctx.lineTo(r[2][0],r[2][1]);ctx.moveTo(r[1][0],r[1][1]);ctx.lineTo(r[3][0],r[3][1]);ctx.stroke();ctx.fillStyle='#d8b54a';ctx.beginPath();ctx.arc(rcx,rcy,4,0,TAU);ctx.fill();}
    else if(b.kind==='gate'){ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.moveTo(r[0][0]*.85+rcx*.15,r[0][1]*.85+rcy*.15);for(let i=1;i<n;i++)ctx.lineTo(r[i][0]*.85+rcx*.15,r[i][1]*.85+rcy*.15);ctx.fill();}
    else{ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=2;ctx.stroke();}
    if(b.sign){const sg=b.signC;let a=b.sa;if(a>Math.PI/2)a-=Math.PI;if(a<-Math.PI/2)a+=Math.PI;ctx.save();ctx.translate(rcx,rcy);ctx.rotate(a);ctx.font='800 13px Inter, sans-serif';const tw=ctx.measureText(b.sign).width+12;
      ctx.shadowColor=sg[0];ctx.shadowBlur=14;ctx.fillStyle=sg[0];ctx.fillRect(-tw/2,-10,tw,20);ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.2;ctx.strokeRect(-tw/2+1.5,-8.5,tw-3,17);ctx.fillStyle=sg[1];ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.sign,0,1);ctx.restore();}}
}
function drawBarges(){for(const b of barges){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);const L=b.len,Wd=b.w;ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-L/2+8,-Wd/2+8,L,Wd);
  ctx.fillStyle=b.col;ctx.beginPath();ctx.moveTo(-L/2,-Wd/2);ctx.lineTo(L/2-30,-Wd/2);ctx.quadraticCurveTo(L/2,-Wd/2,L/2,0);ctx.quadraticCurveTo(L/2,Wd/2,L/2-30,Wd/2);ctx.lineTo(-L/2,Wd/2);ctx.closePath();ctx.fill();
  ctx.fillStyle=b.cargo;ctx.fillRect(-L/2+70,-Wd/2+7,L-120,Wd-14);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;for(let x=-L/2+90;x<L/2-60;x+=40){ctx.beginPath();ctx.moveTo(x,-Wd/2+7);ctx.lineTo(x,Wd/2-7);ctx.stroke();}
  ctx.fillStyle='#eee';ctx.fillRect(-L/2+12,-Wd/2+10,44,Wd-20);ctx.fillStyle='#1c2733';ctx.fillRect(-L/2+46,-Wd/2+12,8,Wd-24);ctx.restore();}}
function drawParts(){for(const p of parts){const a=p.l/p.ml;
  if(p.k==='f'){ctx.fillStyle=a>.6?`rgba(255,${200*a|0},60,${a})`:`rgba(230,${90*a|0},20,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(.5+a*.5),0,TAU);ctx.fill();}
  else if(p.k==='d'){ctx.fillStyle=`rgba(215,195,165,${a*.45})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(2-a),0,TAU);ctx.fill();}
  else if(p.k==='h'){ctx.globalAlpha=a;ctx.fillStyle='#ff4f8b';ctx.font='bold 12px Inter';ctx.fillText('❤',p.x,p.y);ctx.globalAlpha=1;}
  else if(p.k==='s'){ctx.fillStyle=`rgba(40,40,40,${a*.45})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();}
  else if(p.k==='k'){ctx.fillStyle=`rgba(255,230,120,${a})`;ctx.fillRect(p.x-1,p.y-1,2.5,2.5);}
  else if(p.k==='w'){ctx.fillStyle=`rgba(150,210,255,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();}
  else if(p.k==='st'){ctx.fillStyle=`rgba(255,230,90,${a})`;ctx.font='bold 8px Inter';ctx.fillText('★',p.x,p.y);}
  else if(p.k==='bal'){ctx.strokeStyle=p.c;ctx.globalAlpha=a;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,(1-a)*24+4,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  else if(p.k==='p'){ctx.fillStyle=`rgba(220,240,255,${a*.6})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1.5-a),0,TAU);ctx.fill();}}}
function drawBalloons(){for(const b of balloons){ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(b.x,b.y,5,3.5,0,0,TAU);ctx.fill();ctx.fillStyle=b.c;ctx.beginPath();ctx.ellipse(b.x,b.y-b.z,5.5,6.5,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(b.x-2,b.y-b.z-2.5,1.6,0,TAU);ctx.fill();}}
function drawBubbles(Z){ctx.font=`600 ${12/Z}px Inter, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(const b of bubbles){const a=Math.min(1,b.life/15),x=b.p.x;const lines=[];let cur='';for(const w of String(b.t).split(' ')){const tr=cur?cur+' '+w:w;if(ctx.measureText(tr).width>190/Z&&cur){lines.push(cur);cur=w;}else cur=tr;}if(cur)lines.push(cur);
    const lh=15/Z,tw=Math.max(...lines.map(l=>ctx.measureText(l).width))+14/Z,h=lines.length*lh+7/Z,y=b.p.y-20/Z-h/2;ctx.globalAlpha=a;ctx.fillStyle='#fff';rrect(ctx,x-tw/2,y-h/2,tw,h,6/Z);ctx.fill();ctx.beginPath();ctx.moveTo(x-4/Z,y+h/2);ctx.lineTo(x,y+h/2+6/Z);ctx.lineTo(x+4/Z,y+h/2);ctx.fill();ctx.fillStyle='#111';lines.forEach((l,i)=>ctx.fillText(l,x,y-h/2+3.5/Z+lh*(i+.5)));ctx.globalAlpha=1;}}
function renderWorld(){
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#3d6d8c';ctx.fillRect(0,0,CW,CH);
  cameraView();const Z=CAM.z,cx=CAM.x,cy=CAM.y,ar=Math.abs(CAM.r);applyCam(ctx);
  const hw=(CW/2+ar*CH*.6)/Z,hh=(CH/2+ar*CW*.6)/Z,vx0=cx-hw,vy0=cy-hh,vx1=cx+hw,vy1=cy+hh;
  for(let cj=Math.max(0,Math.floor(vy0/CS));cj<=Math.min(Math.ceil(H/CS)-1,Math.floor(vy1/CS));cj++)for(let ci=Math.max(0,Math.floor(vx0/CS));ci<=Math.min(Math.ceil(W/CS)-1,Math.floor(vx1/CS));ci++)ctx.drawImage(getChunk(ci,cj),ci*CS,cj*CS,CS+.6,CS+.6);
  const inV=(x,y,m)=>x>vx0-m&&x<vx1+m&&y>vy0-m&&y<vy1+m;
  for(const d of decals){if(!inV(d.x,d.y,40))continue;ctx.fillStyle=d.c;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,TAU);ctx.fill();}
  drawSkids(vx0,vy0,vx1,vy1);drawBeach(vx0,vy0,vx1,vy1);drawBarges();
  for(const p of peds)if(p.state==='down'&&inV(p.x,p.y,20))drawPed(p);
  for(const p of peds)if(p.dog&&inV(p.dog.x,p.dog.y,20)){ctx.strokeStyle='rgba(30,20,20,.55)';ctx.lineWidth=.8;if(p.state!=='down'){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.dog.x+Math.cos(p.dog.a)*6,p.dog.y+Math.sin(p.dog.a)*6);ctx.stroke();}drawDog(p.dog);}
  for(const p of peds)if(p.state!=='down'&&inV(p.x,p.y,20))drawPed(p);
  if(!P.car&&!P.dead){if(swimming())drawSwimmer();else{const jz=P.jz||0;if(jz>0){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(P.x+2,P.y+3,6-jz*.05,8-jz*.06,0,0,TAU);ctx.fill();ctx.save();ctx.translate(P.x-jz*.25,P.y-jz*.6);ctx.scale(1+jz/45,1+jz/45);ctx.translate(-P.x,-P.y);}
    if(P.squash>0&&!(jz>0)){const q=P.squash/9;ctx.save();ctx.translate(P.x,P.y);ctx.scale(1+.3*q,1-.22*q);ctx.translate(-P.x,-P.y);}
    drawPed({run:P.running,spr:P.ch&&P.ch.spr!=null?PPL_SPR[P.ch.spr[0]][P.ch.spr[1]]:null,x:P.x,y:P.y,a:P.a,anim:jz>0?1.2:P.anim,col:P.ch?P.ch.body:'#ff2e88',hair:P.ch?P.ch.head:'#2b1d0e',state:'walk',kind:'p',wet:0},true);if(jz>0||P.squash>0)ctx.restore();}}
  for(const c of cars)if(!c.dead&&inV(c.x,c.y,60))drawCar(c);
  drawTrees(vx0,vy0,vx1,vy1,cx,cy);drawBuildings(vx0,vy0,vx1,vy1,cx,cy);drawCables(vx0,vy0,vx1,vy1,cx,cy);drawBridgeSign(vx0,vy0,vx1,vy1,cx,cy);drawParts();drawBalloons();
  if(!GL.ok)drawEvening(vx0,vy0,vx1,vy1);
  // bovenste laag (niet door de lichtkaart verdonkerd): gloed, markeringen, teksten, HUD
  ctx=fctx;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,fxc.width,fxc.height);applyCam(ctx);
  if(GL.ok){lightsRender(vx0,vy0,vx1,vy1);drawGlows(vx0,vy0,vx1,vy1);}
  drawMission(Z);drawFX(Z);drawBubbles(Z);
  if(MIS.inside>0){const k=Math.min(1,(230-MIS.inside)/30,MIS.inside/30);ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=`rgba(20,8,2,${.85*k})`;ctx.fillRect(0,0,CW,CH);ctx.globalAlpha=k;
    const g2=ctx.createRadialGradient(CW/2,CH*.45,10,CW/2,CH*.45,Math.max(CW,CH)*.6);g2.addColorStop(0,'rgba(255,200,120,.35)');g2.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,CW,CH);
    for(let i=0;i<5;i++){const x=CW*(.2+i*.15);ctx.fillStyle='rgba(255,220,160,.12)';ctx.beginPath();ctx.moveTo(x-18,0);ctx.lineTo(x+18,0);ctx.lineTo(x+60,CH);ctx.lineTo(x-60,CH);ctx.fill();}ctx.globalAlpha=1;}
  hud();ctx=wctx;
}

