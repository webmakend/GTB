// ====================== simpele 2D-sportspelletjes van bovenaf: tennis (TV Waardenburg) en penalty's schieten (v.v. WNC) ======================
const SP={on:false,k:'',t:0};let WNCPOS=null;
function spOv(){let ov=document.getElementById('spOv');if(!ov){ov=document.createElement('canvas');ov.id='spOv';ov.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:66;display:none;touch-action:none';document.body.appendChild(ov);
    const pos=e=>{const r=ov.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
    ov.addEventListener('pointerdown',e=>{e.preventDefault();const [x,y]=pos(e);if(x>CW-120&&y<uiTop().top+50){spEnd();return;}SP.down=[x,y];SP.px=x;SP.py=y;spInput('down',x,y);});
    ov.addEventListener('pointermove',e=>{if(!SP.on)return;const [x,y]=pos(e);SP.px=x;SP.py=y;spInput('move',x,y,!!SP.down);});
    ov.addEventListener('pointerup',e=>{const [x,y]=pos(e);spInput('up',x,y);SP.down=null;});
    window.addEventListener('keydown',e=>{if(!SP.on)return;SP.keys[e.code]=1;if(e.code==='Escape')spEnd();if(e.code==='Space'||e.code==='Enter'){e.preventDefault();spInput('key');}},true);
    window.addEventListener('keyup',e=>{if(SP.on)SP.keys[e.code]=0;},true);}
  return ov;}
function spStart(k){if(SP.on)return;Object.assign(SP,{on:true,k,t:0,keys:{},msg:'',done:0,down:null});const ov=spOv();ov.style.display='block';paused=true;try{radio.pause();}catch(e){}
  if(k==='tennis')tnInit();else pkInit();requestAnimationFrame(spLoop);}
function spEnd(){SP.on=false;const ov=document.getElementById('spOv');if(ov)ov.style.display='none';paused=false;if(AU.on)try{musicPlay();}catch(e){}}
function spInput(t,x,y,drag){if(SP.k==='tennis')tnIn(t,x,y,drag);else pkIn(t,x,y);}
function spLoop(){if(!SP.on)return;requestAnimationFrame(spLoop);const ov=document.getElementById('spOv');if(ov.width!==Math.round(CW*DPR)||ov.height!==Math.round(CH*DPR)){ov.width=Math.round(CW*DPR);ov.height=Math.round(CH*DPR);}
  const g=ov.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);const keep=ctx;ctx=g;SP.t++;if(SP.done&&--SP.done<=0){ctx=keep;spEnd();return;}
  if(SP.k==='tennis'){tnTick();tnDraw(g);}else{pkTick();pkDraw(g);}
  g.fillStyle='rgba(26,10,44,.85)';rrect(g,CW-112,uiTop().top+6,100,36,12);g.fill();txt('✕ STOP',CW-62,uiTop().top+25,14,'#fff','center','Inter, sans-serif');
  if(SP.msg)txt(SP.msg,CW/2,CH*.5,24,'#fff','center');ctx=keep;}
// veld: past in het scherm, staand
function spField(ratio){const top=uiTop().top+60,bot=CH-40,ah=bot-top;let h=ah,w=h/ratio;if(w>CW-30){w=CW-30;h=w*ratio;}return{x:(CW-w)/2,y:top+(ah-h)/2,w,h};}

// ---------------- TENNIS ----------------
// baan: x 0..1 (breedte), y 0..2 (lengte); jij onderaan, tegenstander bovenaan
function tnInit(){Object.assign(SP,{me:.5,op:.5,b:null,sc:[0,0],srv:0,rally:0,msg:IS_TOUCH?'Tik om op te slaan':'Spatie om op te slaan'});}
function tnServe(){const me=SP.srv===0;SP.b={x:me?SP.me:SP.op,y:me?1.88:.12,vx:rr(-.004,.004),vy:me?-.022:.022,last:me?'me':'op'};SP.rally=0;SP.msg='';sfx('throw');}
function tnIn(t,x,y,drag){const F=SP.F;if(!F)return;if(t==='down'||t==='move'){if(t==='down'||drag)SP.me=clamp((x-F.x)/F.w,.04,.96);}if((t==='down'||t==='key')&&!SP.b&&!SP.done&&SP.srv===0)tnServe();}
function tnPoint(me){SP.sc[me?0:1]++;SP.b=null;sfx(me?'reward':'slap');buzz(me?20:[40,30,40]);const [a,b]=SP.sc;
  if(a>=5||b>=5){const win=a>b;SP.msg=win?'GEWONNEN! +€30':'VERLOREN… ('+a+'-'+b+')';SP.done=150;if(win){addMoney(30);addXP(70);}return;}
  SP.srv=(a+b)%2;SP.msg=(me?'Punt voor jou!':'Punt voor de tegenstander')+(SP.srv===0?(IS_TOUCH?' · tik om op te slaan':' · spatie'):'');if(SP.srv===1)setTimeout(()=>{if(SP.on&&!SP.b&&!SP.done)tnServe();},1100);}
function tnTick(){const k=SP.keys;if(k.ArrowLeft||k.KeyA)SP.me=Math.max(.04,SP.me-.018);if(k.ArrowRight||k.KeyD)SP.me=Math.min(.96,SP.me+.018);
  const b=SP.b;if(!b){SP.op+=(.5-SP.op)*.05;return;}const sp=1+Math.min(.8,SP.rally*.06);b.x+=b.vx*sp;b.y+=b.vy*sp;
  if(b.x<-.08){tnPoint(b.last==='op');return;}if(b.x>1.08){tnPoint(b.last==='op');return;}
  // jij slaat terug als de bal je racket raakt
  if(b.vy>0&&b.y>1.84&&b.y<1.98&&Math.abs(b.x-SP.me)<.11){const off=(b.x-SP.me)/.11;b.vy=-(.022+rr(0,.004));b.vx=off*.012+rr(-.002,.002);b.last='me';SP.rally++;sfx('slap');buzz(10);}
  else if(b.y>2.06){tnPoint(false);return;}
  // tegenstander loopt naar de bal
  const tgt=b.vy<0?b.x+b.vx*((b.y-.12)/-b.vy):.5,ms=.011+Math.min(.006,SP.rally*.0006);SP.op+=clamp(tgt-SP.op,-ms,ms);
  if(b.vy<0&&b.y<.16&&b.y>.02&&Math.abs(b.x-SP.op)<.11){if(Math.random()<.93-SP.rally*.012){const aim=rr(.12,.88);b.vy=.022+rr(0,.004);b.vx=(aim-b.x)/((1.9-b.y)/b.vy);b.last='op';SP.rally++;sfx('slap');}else{b.vx+=rr(-.02,.02);b.last='op_mis';}}
  else if(b.y<-.06){tnPoint(true);return;}}
function tnDraw(g){const F=SP.F=spField(2.05),X=x=>F.x+x*F.w,Y=y=>F.y+y/2*F.h;g.fillStyle='#1e4f7a';g.fillRect(0,0,CW,CH);g.fillStyle='#2f6f3a';g.fillRect(F.x-14,F.y-14,F.w+28,F.h+28);
  g.fillStyle='#3d7ec2';g.fillRect(F.x,F.y,F.w,F.h);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(F.x,F.y,F.w,F.h);g.lineWidth=2;g.beginPath();g.moveTo(X(.12),F.y);g.lineTo(X(.12),F.y+F.h);g.moveTo(X(.88),F.y);g.lineTo(X(.88),F.y+F.h);
  g.moveTo(X(.12),Y(.55));g.lineTo(X(.88),Y(.55));g.moveTo(X(.12),Y(1.45));g.lineTo(X(.88),Y(1.45));g.moveTo(X(.5),Y(.55));g.lineTo(X(.5),Y(1.45));g.stroke();
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(F.x-8,Y(1)-1,F.w+16,6);g.fillStyle='#f4f4f4';g.fillRect(F.x-8,Y(1)-3,F.w+16,4);g.fillStyle='#333';g.fillRect(F.x-12,Y(1)-6,5,10);g.fillRect(F.x+F.w+7,Y(1)-6,5,10);
  const pl=(x,y,col,up,hit)=>{const px=X(x),py=Y(y);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(px+3,py+4,13,8,0,0,TAU);g.fill();g.fillStyle=col;g.beginPath();g.arc(px,py,11,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(px,py,6,0,TAU);g.fill();
    g.strokeStyle='#222';g.lineWidth=3;const ry=up?-1:1,sw=hit?.6:0;g.beginPath();g.moveTo(px+9,py);g.lineTo(px+16+sw*8,py+ry*12);g.stroke();g.strokeStyle='#f5f5f5';g.lineWidth=2;g.beginPath();g.ellipse(px+19+sw*8,py+ry*17,6,8,0,0,TAU);g.stroke();};
  pl(SP.op,.08,'#e53935',false,0);pl(SP.me,1.94,P.ch?P.ch.c:'#36d1ff',true,0);
  const b=SP.b;if(b){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(X(b.x)+4,Y(b.y)+5,5,3,0,0,TAU);g.fill();g.fillStyle='#e6ff3a';g.beginPath();g.arc(X(b.x),Y(b.y),5.5,0,TAU);g.fill();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1;g.stroke();}
  txt(`JIJ ${SP.sc[0]}  ·  ${SP.sc[1]} TEGENSTANDER`,CW/2,uiTop().top+24,18,'#fff','center');txt('Eerste tot 5 punten wint',CW/2,uiTop().top+46,12,'rgba(255,255,255,.7)','center','Inter, sans-serif');
  txt(IS_TOUCH?'Sleep om te bewegen':'← → of muis om te bewegen',CW/2,CH-16,12,'rgba(255,255,255,.75)','center','Inter, sans-serif');}
tnStart=function(){spStart('tennis');};

// ---------------- PENALTY'S BIJ WNC ----------------
// veld: x 0..1, y 0..1.4; doel bovenaan tussen x .3 en .7, keeper beweegt heen en weer
function pkInit(){Object.assign(SP,{n:0,goals:0,ball:null,kx:.5,kv:.006,dive:0,aim:.5,msg:IS_TOUCH?'Tik in het doel om te schieten':'← → richten · spatie = schieten'});}
function pkShoot(tx){if(SP.ball||SP.done||SP.n>=5)return;tx=clamp(tx+rr(-.035,.035),.1,.9);SP.ball={x:.5,y:1.15,tx,ty:.1,t:0};SP.msg='';sfx('throw');buzz(15);
  SP.dive=Math.random()<.55?tx:rr(.34,.66);}
function pkIn(t,x,y){const F=SP.F;if(!F)return;const fx=(x-F.x)/F.w;if(t==='down')pkShoot(fx);if(t==='key')pkShoot(SP.aim);}
function pkTick(){const k=SP.keys;if(k.ArrowLeft||k.KeyA)SP.aim=Math.max(.15,SP.aim-.012);if(k.ArrowRight||k.KeyD)SP.aim=Math.min(.85,SP.aim+.012);const b=SP.ball;
  if(!b){SP.kx+=SP.kv;if(SP.kx<.4||SP.kx>.6)SP.kv*=-1;return;}b.t+=.04;const e=Math.min(1,b.t);b.x=.5+(b.tx-.5)*e;b.y=1.15+(b.ty-1.15)*e;SP.kx+=clamp(SP.dive-SP.kx,-.014,.014);
  if(e>=1){const inGoal=b.tx>.31&&b.tx<.69,saved=Math.abs(b.tx-SP.kx)<.075;SP.n++;let r;if(!inGoal)r='NAAST!';else if(saved){r='GEKEERD!';sfx('slap');}else{r='GOAL! +€10';SP.goals++;addMoney(10);sfx('reward');buzz([30,30,60]);}
    SP.ball=null;SP.last={x:b.tx,r};SP.dive=.5;if(SP.n>=5){const all=SP.goals===5;if(all){addMoney(20);addXP(80);}else addXP(20+SP.goals*8);SP.msg=`${r}  ·  ${SP.goals}/5 gescoord${all?' · BONUS +€20':''}`;SP.done=170;}else SP.msg=r;}}
function pkDraw(g){const F=SP.F=spField(1.4),X=x=>F.x+x*F.w,Y=y=>F.y+y/1.4*F.h;g.fillStyle='#1b5e20';g.fillRect(0,0,CW,CH);
  for(let i=0;i<8;i++){g.fillStyle=i%2?'#2e7d32':'#388e3c';g.fillRect(F.x,F.y+i*F.h/8,F.w,F.h/8);}g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(F.x,F.y,F.w,F.h);
  g.strokeRect(X(.18),F.y,X(.82)-X(.18),Y(.5)-F.y);g.strokeRect(X(.33),F.y,X(.67)-X(.33),Y(.2)-F.y);g.fillStyle='#fff';g.beginPath();g.arc(X(.5),Y(1.15),4,0,TAU);g.fill();g.beginPath();g.arc(X(.5),Y(.5),F.w*.12,.2,Math.PI-.2);g.stroke();
  // doel
  g.fillStyle='rgba(255,255,255,.18)';g.fillRect(X(.3),F.y-22,X(.7)-X(.3),22);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1;for(let x=X(.3);x<X(.7);x+=8){g.beginPath();g.moveTo(x,F.y-22);g.lineTo(x,F.y);g.stroke();}
  g.strokeStyle='#fff';g.lineWidth=5;g.beginPath();g.moveTo(X(.3),F.y);g.lineTo(X(.3),F.y-22);g.lineTo(X(.7),F.y-22);g.lineTo(X(.7),F.y);g.stroke();
  txt('v.v. WNC',X(.5),Y(.8),16,'rgba(255,255,255,.35)','center');
  // keeper
  const kx=X(SP.kx),ky=Y(.06);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(kx+3,ky+5,22,8,0,0,TAU);g.fill();g.fillStyle='#ffd400';g.fillRect(kx-20,ky-5,40,10);g.beginPath();g.arc(kx,ky,10,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(kx,ky,5.5,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(kx-21,ky,4,0,TAU);g.arc(kx+21,ky,4,0,TAU);g.fill();
  // schutter en richten
  if(!SP.ball&&SP.n<5){const ax=IS_TOUCH?null:SP.aim;if(ax!=null){g.setLineDash([6,6]);g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=2;g.beginPath();g.moveTo(X(.5),Y(1.15));g.lineTo(X(ax),Y(.1));g.stroke();g.setLineDash([]);g.strokeStyle='#ffd166';g.beginPath();g.arc(X(ax),Y(.1),9,0,TAU);g.stroke();}}
  const sx=X(.5),sy=Y(1.25);g.fillStyle=P.ch?P.ch.c:'#36d1ff';g.beginPath();g.arc(sx,sy,11,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(sx,sy,6,0,TAU);g.fill();
  const b=SP.ball,bx=b?X(b.x):X(.5),by=b?Y(b.y):Y(1.15),sc=b?1+Math.sin(Math.min(1,b.t)*Math.PI)*.5:1;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(bx+4,by+5,6,3,0,0,TAU);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(bx,by,6*sc,0,TAU);g.fill();g.fillStyle='#222';g.beginPath();g.arc(bx,by,2.2*sc,0,TAU);g.fill();g.strokeStyle='#222';g.lineWidth=1;g.beginPath();g.arc(bx,by,6*sc,0,TAU);g.stroke();
  for(let i=0;i<5;i++){const x=CW/2-50+i*25,y=uiTop().top+48,c=i<SP.n?(SP.res&&SP.res[i])||'#888':'rgba(255,255,255,.25)';g.fillStyle=c;g.beginPath();g.arc(x,y,8,0,TAU);g.fill();}
  txt(`PENALTY'S · ${SP.goals} GOAL${SP.goals===1?'':'S'}`,CW/2,uiTop().top+22,18,'#fff','center');txt(IS_TOUCH?'Tik waar in het doel je wilt schieten':'← → richten · spatie = schieten',CW/2,CH-16,12,'rgba(255,255,255,.75)','center','Inter, sans-serif');}
{const _pt=pkTick;pkTick=function(){const n=SP.n;_pt();if(SP.n>n){SP.res=SP.res||[];SP.res[n]=SP.last.r.startsWith('GOAL')?'#7dff6a':'#ff4f6d';}};}
{const _pi=pkInit;pkInit=function(){_pi();SP.res=[];};}
// starten bij het WNC-veld
function wncInit(){const so=(WD.pitch||[]).filter(p=>p.s==='soccer');if(so.length){const c=centroid(so[0].p.slice(0,-1));WNCPOS={x:c[0],y:c[1]};}else if(WD.wbspot&&WD.wbspot.wnc)WNCPOS={x:WD.wbspot.wnc[0],y:WD.wbspot.wnc[1]};}
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);if(a)return a;if(!WNCPOS&&WD.pitch)wncInit();if(WNCPOS&&!P.car&&!SC.on&&Math.hypot(P.x-WNCPOS.x,P.y-WNCPOS.y)<200)return{k:'penalty',t:"⚽ Penalty's schieten bij v.v. WNC (€10 per goal)",btn:'⚽<br>SPEEL'};return a;};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='penalty'){spStart('penalty');return true;}return _at.apply(this,arguments);};}
