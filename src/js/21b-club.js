// ====================== Café Henkie: binnen in first-person (FPV) ======================
// Rondkijken door te slepen (of pijltjestoetsen). Dansers: Universal Base-vrouwen en PSX-mannen met Mixamo-dansen
// (tools/render_dancers2.py). Discolicht, lichtbundels, stroboscoop en eigen muziek (assets/bar-music.mp3).
const DANCE=new Image();let DANCE_OK=false;DANCE.onload=()=>{DANCE_OK=true;};DANCE.src='assets/dancers.webp';
const DANCE_META=[{"w": 106, "h": 180, "n": 12, "f": 1, "y": 0}, {"w": 110, "h": 180, "n": 12, "f": 1, "y": 182}, {"w": 128, "h": 180, "n": 12, "f": 1, "y": 364}, {"w": 108, "h": 180, "n": 12, "f": 1, "y": 546}, {"w": 101, "h": 180, "n": 12, "f": 1, "y": 728}, {"w": 110, "h": 180, "n": 12, "f": 1, "y": 910}, {"w": 128, "h": 180, "n": 12, "f": 1, "y": 1092}, {"w": 108, "h": 180, "n": 12, "f": 1, "y": 1274}, {"w": 128, "h": 180, "n": 12, "f": 0, "y": 1456}, {"w": 142, "h": 180, "n": 12, "f": 0, "y": 1638}, {"w": 170, "h": 180, "n": 12, "f": 0, "y": 1820}];
const barMusic=new Audio();barMusic.src='assets/bar-music.mp3';barMusic.loop=true;barMusic.preload='none';barMusic.setAttribute('playsinline','');
const CLUB={music:false,strobe:0,mt:0,on:false,yaw:0,pitch:0,vy:0,t:0,dancers:[],dots:[],pano:null,beat:0,flash:0,joined:0};
function buildPano(){const W2=3072,H2=800,c=document.createElement('canvas');c.width=W2;c.height=H2;const g=c.getContext('2d');
  const bg=g.createLinearGradient(0,0,0,H2);bg.addColorStop(0,'#14061f');bg.addColorStop(.5,'#2a0d3d');bg.addColorStop(1,'#3a1240');g.fillStyle=bg;g.fillRect(0,0,W2,H2);
  const at=a=>((a%360)+360)%360/360*W2;
  const neon=(fn,col,w)=>{g.save();g.strokeStyle=col;g.shadowColor=col;g.shadowBlur=26;g.lineWidth=w||6;g.lineJoin='round';g.lineCap='round';fn();g.stroke();g.shadowBlur=10;g.lineWidth=(w||6)*.4;g.strokeStyle='#fff';fn();g.stroke();g.restore();};
  // podium met gordijn en neon-sterren (voor je: 0°)
  for(const off of [0,W2]){const sx=at(-28)-off*0+(off?W2:0)-(off?W2:0);}
  const stage=(cx)=>{g.fillStyle='#3b0f2e';g.fillRect(cx-330,120,660,560);for(let i=0;i<30;i++){g.fillStyle=i%2?'rgba(120,20,60,.55)':'rgba(70,10,40,.55)';g.fillRect(cx-330+i*22,120,22,560);}
    g.fillStyle='#24081c';g.fillRect(cx-360,660,720,140);g.fillStyle='#ff4fa3';g.fillRect(cx-360,656,720,6);
    const star=(x,y,r)=>neon(()=>{g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.5:r;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}g.closePath();},'#ff7ad9',7);
    star(cx-150,330,95);star(cx+40,330,95);
    // DJ-booth met draaitafels
    g.fillStyle='#0d0612';g.fillRect(cx-170,560,340,150);neon(()=>{g.beginPath();g.rect(cx-170,560,340,150);},'#36d1ff',5);
    for(const dx of [-95,95]){g.fillStyle='#222';g.beginPath();g.arc(cx+dx,600,46,0,TAU);g.fill();g.fillStyle='#111';g.beginPath();g.arc(cx+dx,600,30,0,TAU);g.fill();g.fillStyle='#ff2e88';g.beginPath();g.arc(cx+dx,600,6,0,TAU);g.fill();}
    g.fillStyle='#333';g.fillRect(cx-30,575,60,50);for(let i=0;i<4;i++){g.fillStyle=['#7dff6a','#ffd166','#ff2e88','#36d1ff'][i];g.fillRect(cx-24+i*14,585,8,30);}
    g.save();g.font='900 46px Inter, sans-serif';g.textAlign='center';g.fillStyle='#36d1ff';g.shadowColor='#36d1ff';g.shadowBlur=20;g.fillText('DJ',cx,690);g.restore();neon(()=>{g.beginPath();g.arc(cx+230,470,150,Math.PI*1.05,Math.PI*1.55);},'#c77dff',14);};
  stage(at(0));stage(at(0)+W2);stage(at(0)-W2);
  // bar met flessen en neonbord (achter je: 180°)
  const bx=at(180);g.fillStyle='#1b0a24';g.fillRect(bx-520,250,1040,430);for(let r=0;r<3;r++)for(let i=0;i<46;i++){g.fillStyle=['#7dff6a','#ffd166','#36d1ff','#ff4fa3','#ffffff','#c77dff'][(i*7+r)%6];g.globalAlpha=.75;g.fillRect(bx-500+i*22,300+r*80,10,40);g.globalAlpha=1;}
  g.fillStyle='#120616';g.fillRect(bx-560,560,1120,240);neon(()=>{g.beginPath();g.moveTo(bx-560,560);g.lineTo(bx+560,560);},'#36d1ff',6);neon(()=>{g.beginPath();g.moveTo(bx-560,700);g.lineTo(bx+560,700);},'#ff2e88',5);
  g.save();g.font='italic 900 92px Anton, Impact, sans-serif';g.textAlign='center';g.fillStyle='#fff';g.shadowColor='#36d1ff';g.shadowBlur=30;g.fillText('Café Henkie',bx,220);g.restore();
  neon(()=>{g.beginPath();g.moveTo(bx+380,250);g.quadraticCurveTo(bx+400,150,bx+420,90);g.moveTo(bx+420,90);g.quadraticCurveTo(bx+360,70,bx+330,110);g.moveTo(bx+420,90);g.quadraticCurveTo(bx+480,70,bx+500,110);},'#7dff6a',6);
  // glasblokken-wand (90°) en uitgang (270°)
  const gx=at(90);for(let r=0;r<10;r++)for(let i=0;i<12;i++){g.fillStyle=`rgba(${190+((i+r)%3)*20},${200+((i*r)%4)*10},255,.55)`;g.fillRect(gx-300+i*50,150+r*50,46,46);}
  const ex=at(270);g.fillStyle='#0b0410';g.fillRect(ex-110,300,220,500);g.save();g.font='900 60px Inter, sans-serif';g.textAlign='center';g.fillStyle='#7dff6a';g.shadowColor='#7dff6a';g.shadowBlur=24;g.fillText('UITGANG',ex,270);g.restore();
  // pilaren en neonstrepen
  for(const a of [45,135,225,315]){const x=at(a);const pg=g.createLinearGradient(x-40,0,x+40,0);pg.addColorStop(0,'#3a2e4a');pg.addColorStop(.5,'#9a8fae');pg.addColorStop(1,'#3a2e4a');g.fillStyle=pg;g.fillRect(x-40,0,80,H2);}
  neon(()=>{g.beginPath();g.moveTo(0,40);g.lineTo(W2,40);},'#ff2e88',8);neon(()=>{g.beginPath();g.moveTo(0,70);g.lineTo(W2,70);},'#36d1ff',6);
  return c;}
function clubInit(){if(!CLUB.pano)CLUB.pano=buildPano();CLUB.dancers=[];const n=26;
  for(let i=0;i<n;i++){const a=i<14?rr(-1.1,1.1):rr(-Math.PI,Math.PI),d=rr(2.6,7.4);if(Math.abs(wrap(a-Math.PI))<.5&&d>5)continue;const W_=DANCE_META.map((m,k)=>k).filter(k=>DANCE_META[k].f),M_=DANCE_META.map((m,k)=>k).filter(k=>!DANCE_META[k].f);CLUB.dancers.push({x:Math.cos(a)*d,z:Math.sin(a)*d,s:(Math.random()<.78||!M_.length)?rpick(W_):rpick(M_),ph:rr(0,24),sp:rr(.8,1.2),bob:rr(0,6)});}
  CLUB.dots=[];for(let i=0;i<420;i++){const a=rr(0,TAU),d=Math.sqrt(Math.random())*8.6;CLUB.dots.push({x:Math.cos(a)*d,z:Math.sin(a)*d,c:rpick(['#ff2e88','#36d1ff','#ffd166','#c77dff','#7dff6a']),ph:rr(0,6)});}}
function enterClub(){clubInit();CLUB.on=true;CLUB.t=0;CLUB.yaw=0;CLUB.pitch=0;CLUB.joined=0;bigMap=false;document.getElementById('touch').style.display='none';document.getElementById('topBtns').style.display='none';
  document.getElementById('lightc').style.display='none';GL.shown=false;clubBtn(true);CLUB.music=false;CLUB.strobe=0;try{radio.pause();}catch(e){}sfx('door');setTimeout(()=>{if(CLUB.on&&!CLUB.music)msg('HET IS STIL…','Loop naar de DJ-booth en zet de muziek aan','#36d1ff',220);},600);}
function exitClub(){CLUB.on=false;CLUB.music=false;clubBtn(false);djBtn(false);try{barMusic.pause();}catch(e){}if(IS_TOUCH)document.getElementById('touch').style.display='block';document.getElementById('topBtns').style.display='flex';if(AU.on)musicPlay();sfx('door');
  if(MIS.stage===4&&!MIS.done){MIS.done=true;MIS.allDone=true;missionBanner('MISSIE 3 GESLAAGD!','Wat een avond in Café Henkie! Alle missies zijn klaar. Rijd, zwem en verken Bommel op je eigen manier.','#7dff6a',360);sfx('reward');}}
function djStart(){if(CLUB.music)return;CLUB.music=true;CLUB.mt=CLUB.t;CLUB.flash=1;CLUB.strobe=90;barMusic.currentTime=0;barMusic.volume=1;barMusic.play().catch(()=>{});sfx('sting');djBtn(false);msg('DROP THE BEAT!','Iedereen gaat los','#ff7ad9',160);}
function djBtn(show){let b=document.getElementById('djBtn');if(!b){b=document.createElement('div');b.id='djBtn';b.innerHTML='🎧 DRAAI DE PLAAT';b.style.cssText='position:fixed;z-index:40;left:50%;transform:translateX(-50%);bottom:calc(var(--sb) + 34px);padding:16px 26px;border-radius:16px;background:linear-gradient(90deg,#ff2e88,#7b2ff7);color:#fff;font:900 18px Inter,sans-serif;letter-spacing:1.5px;box-shadow:0 0 30px rgba(255,46,136,.7);cursor:pointer;white-space:nowrap;pointer-events:auto';
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();djStart();});document.body.appendChild(b);}b.style.display=show?'block':'none';}
function clubBtn(show){let b=document.getElementById('clubExit');if(!b){b=document.createElement('div');b.id='clubExit';b.textContent='⟵ NAAR BUITEN';b.style.cssText='position:fixed;z-index:40;left:calc(var(--sl) + 14px);top:calc(var(--st) + 14px);padding:10px 16px;border-radius:12px;background:rgba(10,4,24,.75);border:2px solid #ff2e88;color:#fff;font:800 14px Inter,sans-serif;letter-spacing:1px;cursor:pointer;pointer-events:auto';b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();exitClub();});document.body.appendChild(b);}
  b.style.display=show?'block':'none';}
(function clubInput(){let drag=null;cv.addEventListener('pointerdown',e=>{if(!CLUB.on)return;drag={x:e.clientX,y:e.clientY,yaw:CLUB.yaw,pitch:CLUB.pitch};});
  window.addEventListener('pointermove',e=>{if(!CLUB.on||!drag)return;CLUB.yaw=drag.yaw-(e.clientX-drag.x)*.006;CLUB.pitch=clamp(drag.pitch+(e.clientY-drag.y)*.8,-CH*.25,CH*.25);});
  window.addEventListener('pointerup',()=>{drag=null;});})();
function clubStep(){CLUB.t+=1/60;frameN++;const k=keys;if(k.ArrowLeft||k.KeyA)CLUB.yaw-=.035;if(k.ArrowRight||k.KeyD)CLUB.yaw+=.035;if(k.ArrowUp||k.KeyW)CLUB.pitch=Math.min(CH*.25,CLUB.pitch+6);if(k.ArrowDown||k.KeyS)CLUB.pitch=Math.max(-CH*.25,CLUB.pitch-6);
  if(pressed.KeyE||pressed.Escape)exitClub();for(const kk in pressed)delete pressed[kk];
  const facing=Math.abs(wrap(CLUB.yaw))<.42;if(!CLUB.music&&facing&&(keys.Enter||keys.Space))djStart();
  if(CLUB.music){const bpm=124,mt=CLUB.t-CLUB.mt,beat=Math.floor(mt*bpm/60);if(beat!==CLUB.beat){CLUB.beat=beat;if(beat%4===0)CLUB.flash=1;if(beat%32===24)CLUB.strobe=Math.round(8*60/bpm*60/4);}}CLUB.flash*=.86;if(CLUB.strobe>0)CLUB.strobe--;
  if(CLUB.music&&CLUB.t-CLUB.mt>8&&!CLUB.joined){CLUB.joined=1;msg('FEEST!','Kijk rond · tik ⟵ NAAR BUITEN om te gaan','#ff7ad9',200);}}
function drawClub(){const g=fctx;g.setTransform(DPR,0,0,DPR,0,0);const W2=CW,H2=CH,fov=1.25,f=Math.max((W2/2)/Math.tan(fov/2),H2*.62),y0=H2*.5+CLUB.pitch,camH=1.6,R=9,wallH=4.6,t=CLUB.t;
  g.fillStyle='#07020c';g.fillRect(0,0,W2,H2);
  const wt=y0-(wallH-camH)/R*f,wb=y0+camH/R*f,P=CLUB.pano,PW=P.width;
  // plafond
  const cg=g.createLinearGradient(0,0,0,wt);cg.addColorStop(0,'#05010a');cg.addColorStop(1,'#1a0826');g.fillStyle=cg;g.fillRect(0,0,W2,Math.max(0,wt));
  // wand (panorama, kolom voor kolom)
  const step=6;for(let x=0;x<W2;x+=step){const a=CLUB.yaw+Math.atan((x+step/2-W2/2)/f);let u=((a/TAU)%1+1)%1*PW;g.drawImage(P,u,0,Math.max(1,PW*Math.atan(step/f)/TAU),P.height,x,wt,step+.6,wb-wt);}
  // vloer
  const fg=g.createLinearGradient(0,wb,0,H2);fg.addColorStop(0,'#1d0a26');fg.addColorStop(1,'#3a1238');g.fillStyle=fg;g.fillRect(0,wb,W2,H2-wb);
  const proj=(x,z)=>{const ca=Math.cos(CLUB.yaw),sa=Math.sin(CLUB.yaw),fx=x*ca+z*sa,sz=-x*sa+z*ca;if(fx<.3)return null;return{x:W2/2+sz/fx*f,d:fx};};
  g.globalCompositeOperation='lighter';if(!CLUB.music)g.globalAlpha=.25;for(const d of CLUB.dots){const on0=CLUB.music;const p=proj(d.x,d.z);if(!p)continue;const y=y0+camH/p.d*f,on=on0?.4+.6*Math.abs(Math.sin(t*3+d.ph+CLUB.beat*.7)):.2;g.globalAlpha=on*.85;g.fillStyle=d.c;const r=Math.max(1,9/p.d);g.fillRect(p.x-r,y-r*.4,r*2,r*.8);}g.globalAlpha=1;
  // lichtbundels vanaf het plafond
  if(CLUB.music)for(let i=0;i<7;i++){const a0=i/7*TAU+t*.4*(i%2?1:-1),d=3+2*Math.sin(t*.7+i),p=proj(Math.cos(a0)*d,Math.sin(a0)*d);if(!p)continue;const top=proj(Math.cos(a0+.3)*2,Math.sin(a0+.3)*2);const tx=top?top.x:p.x,ty=Math.max(-50,wt-60),fy=y0+camH/p.d*f,w2=Math.max(20,90/p.d);
    const col=['255,46,136','54,209,255','255,209,102','199,125,255','125,255,106'][i%5],lg=g.createLinearGradient(0,ty,0,fy);lg.addColorStop(0,`rgba(${col},.05)`);lg.addColorStop(1,`rgba(${col},.32)`);g.fillStyle=lg;g.beginPath();g.moveTo(tx-4,ty);g.lineTo(tx+4,ty);g.lineTo(p.x+w2,fy);g.lineTo(p.x-w2,fy);g.closePath();g.fill();
    g.fillStyle=`rgba(${col},.35)`;g.beginPath();g.ellipse(p.x,fy,w2,w2*.25,0,0,TAU);g.fill();}
  g.globalCompositeOperation='source-over';
  // dansers (ver naar dichtbij)
  if(DANCE_OK){const L=[];for(const d of CLUB.dancers){const p=proj(d.x,d.z);if(p)L.push([p,d]);}L.sort((a,b)=>b[0].d-a[0].d);
    for(const [p,d] of L){const m=DANCE_META[d.s],n=m.n,tt=CLUB.strobe>0?Math.floor(t*12)/12:t,fr=CLUB.music?Math.floor(tt*10*d.sp+d.ph)%(2*n-2):0,k=fr<n?fr:2*n-2-fr,h=1.75/p.d*f,w=h*m.w/m.h,fy=y0+camH/p.d*f+(CLUB.music?Math.sin(t*8+d.bob)*h*.01:Math.sin(t*1.2+d.bob)*h*.004);
      g.drawImage(DANCE,k*m.w,m.y,m.w,m.h,p.x-w/2,fy-h,w,h);}}
  // gekleurd licht + stroboscoop + vignet
  g.globalCompositeOperation='lighter';const hues=['255,46,136','54,209,255','199,125,255'];if(CLUB.music)for(let i=0;i<3;i++){const x=W2*(.5+.45*Math.sin(t*.9+i*2.1)),y=H2*(.45+.25*Math.cos(t*.7+i)),rg=g.createRadialGradient(x,y,0,x,y,W2*.6);rg.addColorStop(0,`rgba(${hues[i]},.16)`);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,W2,H2);}
  if(CLUB.flash>.05){g.fillStyle=`rgba(255,255,255,${CLUB.flash*.18})`;g.fillRect(0,0,W2,H2);}g.globalCompositeOperation='source-over';
  // stroboscoop: harde witte flitsen (± 12 per seconde) met zwarte tussenbeelden
  if(CLUB.strobe>0){const on=Math.floor(t*24)%2===0;g.fillStyle=on?'rgba(255,255,255,.62)':'rgba(0,0,0,.55)';g.fillRect(0,0,W2,H2);}
  if(!CLUB.music){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,W2,H2);}
  const vg=g.createRadialGradient(W2/2,H2/2,Math.min(W2,H2)*.35,W2/2,H2/2,Math.max(W2,H2)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');g.fillStyle=vg;g.fillRect(0,0,W2,H2);
  const facing=Math.abs(wrap(CLUB.yaw))<.42;djBtn(!CLUB.music&&facing);
  if(!CLUB.music&&!facing){ctx=fctx;txt('Kijk rond en zoek de DJ-booth bij het podium',W2/2,H2-120,16,'#36d1ff','center','Inter, sans-serif');}
  ctx=fctx;txt('CAFÉ HENKIE',W2/2,uiTop().top+56,clamp(W2/12,22,40),'#ff7ad9','center');txt(IS_TOUCH?'Sleep om rond te kijken':'Muis slepen of pijltjes om rond te kijken · E = naar buiten',W2/2,uiTop().top+56+clamp(W2/12,22,40)+10,12,'rgba(255,255,255,.85)','center','Inter, sans-serif');
  msgs.forEach(m=>{const a=clamp(Math.min(m.life/25,(m.ml-m.life)/8+.2),0,1);ctx.globalAlpha=a;txt(m.t,W2/2,H2*.75,Math.min(46,W2*.1),m.col,'center');if(m.sub)txt(m.sub,W2/2,H2*.75+Math.min(46,W2*.1)+6,14,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;m.life--;});while(msgs.length&&msgs[0].life<=0)msgs.shift();
  ctx=wctx;}
