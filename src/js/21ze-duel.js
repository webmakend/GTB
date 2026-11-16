// ====================== online duels: tennis en penalty's tegen een andere speler ======================
// Uitdagen gaat via het profiel van een speler die online is. Alles reist mee als korte gebeurtenissen (chal/chacc/chno/dmv).
// Tennis: wie de bal op zich af ziet komen, beslist (raak, mis of uit) en stuurt de nieuwe baan met een tijdstempel mee;
// de ander rekent de bal door naar "nu", zodat een beetje vertraging niet uitmaakt. Penalty's: per beurt kiezen schutter en
// keeper tegelijk een plek, pas als beide keuzes binnen zijn wordt het resultaat getoond.
const DUEL={g:null,op:null,nm:'',mid:'',host:false,inv:null,sent:null,ox:.5,oxs:.5,lastSeen:0};
const DK=new Set(['chal','chacc','chno','dmv']);
const dNow=()=>Date.now()+(NET.srvOff||0);
const DGAME={dtn:'tennis',dpk:"penalty's"};
function duelMid(){return Math.random().toString(36).slice(2,8);}
function duelPres(){return SP.on&&DUEL.g&&SPM[SP.k]&&SP.k===DUEL.g?[Math.round((SP.me??.5)*1000),DUEL.mid]:null;}
function duelOpp(){return pvpByPub(DUEL.op);}
// uitdagen
function duelChallenge(pub,g){const s=pvpByPub(pub);if(!s){noteAdd('NIET ONLINE','Je kunt alleen iemand uitdagen die nu online is','#ff9f1c',160);return;}if(SP.on)return;
  const mid=duelMid();DUEL.sent={pub,g,mid,t:Date.now(),nm:String(s.nm||'Speler').slice(0,14)};pvpSend('chal',pub,g==='dtn'?1:2,mid);sfx('blip');
  noteAdd('UITDAGING VERSTUURD',DUEL.sent.nm+' krijgt je uitnodiging voor '+DGAME[g]+'. Even wachten…','#36d1ff',260,'duel');}
function duelInvShow(){let d=document.getElementById('duelInv');const v=DUEL.inv;if(!v){if(d)d.style.display='none';return;}
  if(!d){d=document.createElement('div');d.id='duelInv';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());}
  d.innerHTML=`<div class="diBox"><i>${v.g==='dtn'?'🎾':'⚽'}</i><b>${esc(v.nm)} daagt je uit!</b><span>Een potje ${DGAME[v.g]} tegen elkaar. De winnaar krijgt €50.</span><div class="diBtns"><span class="diNo">Nee, bedankt</span><span class="diOk">SPELEN!</span></div><small class="diT"></small></div>`;
  d.querySelector('.diOk').onclick=()=>duelAccept();d.querySelector('.diNo').onclick=()=>{pvpSend('chno',v.pub,0,v.mid);DUEL.inv=null;duelInvShow();};d.style.display='flex';sfx('blip');buzz([30,40,30]);}
function duelAccept(){const v=DUEL.inv;if(!v)return;DUEL.inv=null;duelInvShow();if(!pvpByPub(v.pub)){noteAdd('TE LAAT','Je tegenstander is niet meer online','#ff9f1c',160);return;}
  pvpSend('chacc',v.pub,v.g==='dtn'?1:2,v.mid);duelStart(v.g,v.pub,v.nm,v.mid,false);}
function duelStart(g,pub,nm,mid,host){try{if(typeof lbClose==='function')lbClose();if(typeof menuClose==='function'&&document.getElementById('menuOv')&&document.getElementById('menuOv').style.display!=='none')menuClose();}catch(e){}
  if(SC.on)scExit();if(typeof FPV!=='undefined'&&FPV.on)fpvExit();Object.assign(DUEL,{g,op:pub,nm,mid,host,ox:.5,oxs:.5,lastSeen:Date.now()});DUEL.sent=null;spStart(g);}
function duelRecv(s,e){const nm=String(s.nm||'Speler').slice(0,14),m=String(e.m||'');
  if(e.k==='chal'){const g=e.d===1?'dtn':'dpk';if(SP.on||DUEL.inv||P.dead){pvpSend('chno',s.pid,2,m);return;}DUEL.inv={pub:s.pid,nm,g,mid:m,t:Date.now()};duelInvShow();}
  else if(e.k==='chacc'){const v=DUEL.sent;if(v&&v.pub===s.pid&&v.mid===m&&!SP.on)duelStart(v.g,v.pub,v.nm,v.mid,true);}
  else if(e.k==='chno'){const v=DUEL.sent;if(v&&v.mid===m){DUEL.sent=null;noteAdd(e.d===2?'NU NIET':'UITDAGING AFGESLAGEN',nm+(e.d===2?' is nu met iets anders bezig':' wil nu niet spelen'),'#ff9f1c',200,'duel');}}
  else if(e.k==='dmv'){let o;try{o=JSON.parse(m);}catch(_){return;}if(!SP.on||o.m!==DUEL.mid||s.pid!==DUEL.op)return;DUEL.lastSeen=Date.now();const M=SPM[SP.k];if(M&&M.recv)M.recv(o);}}
function duelSend(o){o.m=DUEL.mid;pvpSend('dmv',DUEL.op,0,JSON.stringify(o));}
// gebeurtenissen ook verwerken als het spel op pauze staat (tijdens een duel of in een menu)
function duelPoll(){if(!(NET.room||NET.http))return;const me=pvpPub();for(const p of netOthers()){const s=p.presence;if(!s||!s.pid||!Array.isArray(s.ev))continue;
  if(SP.on&&s.pid===DUEL.op){DUEL.lastSeen=Date.now();if(Array.isArray(s.du)&&s.du[1]===DUEL.mid)DUEL.ox=clamp(s.du[0]/1000,0,1);}
  for(const e of s.ev){if(!e||e.to!==me||!DK.has(e.k))continue;const key=s.pid+':'+e.i;if(PVP.seen.has(key))continue;PVP.seen.add(key);duelRecv(s,e);}}}
setInterval(()=>{try{duelPoll();}catch(e){}
  if(DUEL.inv&&Date.now()-DUEL.inv.t>25000){DUEL.inv=null;duelInvShow();}else if(DUEL.inv){const t=document.querySelector('#duelInv .diT');if(t)t.textContent='Nog '+Math.ceil((25000-(Date.now()-DUEL.inv.t))/1000)+' seconden';}
  if(DUEL.sent&&Date.now()-DUEL.sent.t>30000){noteAdd('GEEN ANTWOORD',DUEL.sent.nm+' reageerde niet op je uitdaging','#ff9f1c',180,'duel');DUEL.sent=null;}
  if(SP.on&&DUEL.g===SP.k&&!SP.done&&Date.now()-DUEL.lastSeen>15000){SP.msg='Tegenstander is weg…';SP.done=150;}},150);
{const _r=pvpRecv;pvpRecv=function(s,e){if(DK.has(e.k)){duelRecv(s,e);return;}_r(s,e);};}
function duelEndPrize(win,draw){if(draw){addXP(30);return 'GELIJKSPEL!';}if(win){addMoney(50);addXP(90);sfx('reward');buzz([40,40,80]);return 'JIJ WINT! +€50';}addXP(25);return 'VERLOREN…';}
function duelTop(g,a,b,sub){const y=uiTop().top;g.fillStyle='rgba(20,10,36,.92)';rrect(g,10,y+4,CW-128,52,14);g.fill();
  txt('JIJ',26,y+22,12,'#36d1ff','left','Inter, sans-serif');txt(String(a),26,y+44,22,'#fff','left');txt(DUEL.nm.toUpperCase(),CW-134,y+22,12,'#ff6b9d','right','Inter, sans-serif');txt(String(b),CW-134,y+44,22,'#fff','right');
  txt(sub,(CW-118)/2+5,y+36,11,'rgba(255,255,255,.7)','center','Inter, sans-serif');}
// duel-knoppen in het profiel van een speler die online is
{const _pr=profRender;profRender=function(){_pr();const pub=LB.prof;if(!pub||pub===pvpPub()||!pvpByPub(pub)||!(NET.room||NET.http))return;const PF=document.getElementById('lbProf'),bx=PF&&PF.querySelector('.pfBtns');if(!bx)return;
  const d=document.createElement('div');d.className='pfDuel';d.innerHTML='<small>⚔️ Daag uit voor een duel (winnaar +€50):</small><span data-g="dtn">🎾 Tennis</span><span data-g="dpk">⚽ Penalty\'s</span>';
  d.querySelectorAll('span').forEach(s=>s.onclick=e=>{e.preventDefault();duelChallenge(pub,s.dataset.g);});bx.parentNode.insertBefore(d,bx);};}
{const st=document.createElement('style');st.textContent=`.pfDuel{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;font:700 12px Inter,sans-serif;color:#36d1ff}.pfDuel small{width:100%}.pfDuel span{flex:1;text-align:center;padding:10px 6px;border-radius:12px;background:rgba(54,209,255,.12);border:1.5px solid #36d1ff;color:#fff;cursor:pointer;font-weight:800}
#duelInv{position:fixed;inset:0;z-index:90;display:none;align-items:center;justify-content:center;background:rgba(8,4,20,.6);font-family:Inter,sans-serif;color:#fff}
#duelInv .diBox{width:min(88vw,360px);padding:20px;border-radius:20px;background:#160926;border:2px solid #36d1ff;box-shadow:0 0 30px rgba(54,209,255,.4);text-align:center;display:flex;flex-direction:column;gap:8px}
#duelInv i{font-size:44px;font-style:normal}#duelInv b{font:400 26px Anton,Impact,sans-serif;letter-spacing:1px}#duelInv span{font-size:14px;opacity:.85}#duelInv .diBtns{display:flex;gap:10px;margin-top:8px}
#duelInv .diBtns span{flex:1;padding:12px;border-radius:12px;font-weight:900;cursor:pointer;opacity:1}#duelInv .diNo{background:#3a3a5a}#duelInv .diOk{background:linear-gradient(90deg,#22c55e,#16a34a);box-shadow:0 0 14px rgba(34,197,94,.5)}#duelInv small{opacity:.6}`;document.head.appendChild(st);}

// ---------------- TENNIS-DUEL ----------------
// baan in "host-coördinaten": x 0..1, y 0..2; de host staat onderaan (y=2), de gast bovenaan. Ieder ziet zichzelf onderaan.
const TD={B:null,sc:{},rally:0,pts:0,srvT:0};
function tdV(x,y){return DUEL.host?[x,y]:[1-x,2-y];} // host-coördinaat -> mijn beeld
function tdPos(t){const B=TD.B;const dt=(t-B.t0)/1000;return [B.x0+B.vx*dt,B.y0+B.vy*dt];}
function tdServer(){return (TD.pts%2===0)===DUEL.host;} // wie slaat op
SPM.dtn={init(){Object.assign(SP,{me:.5,msg:''});Object.assign(TD,{B:null,sc:{me:0,op:0},rally:0,pts:0,srvT:Date.now()+1500});},
  input(t,x,y,drag){const F=SP.F;if(!F)return;if(t==='down'||(t==='move'&&drag))SP.me=clamp((x-F.x)/F.w,.04,.96);if((t==='down'||t==='key')&&!TD.B&&!SP.done&&tdServer()&&Date.now()>TD.srvT-1400)tdServe();},
  tick(){const k=SP.keys;if(k.ArrowLeft||k.KeyA)SP.me=Math.max(.04,SP.me-.022);if(k.ArrowRight||k.KeyD)SP.me=Math.min(.96,SP.me+.022);DUEL.oxs+=(DUEL.ox-DUEL.oxs)*.25;
    if(SP.done)return;if(!TD.B){if(tdServer()&&Date.now()>TD.srvT+4000)tdServe();return;}
    const now=dNow(),[hx,hy]=tdPos(now),[vx,vy]=tdV(hx,hy),comingToMe=DUEL.host?TD.B.vy>0:TD.B.vy<0;if(!comingToMe)return;
    if(vx<-.08||vx>1.08){tdPoint(true);return;}
    if(vy>1.82&&vy<2.0&&Math.abs(vx-SP.me)<.16){const off=(vx-SP.me)/.16,sp=.8+Math.min(.35,TD.rally*.03);let nvx=off*.32+rr(-.04,.04),nvy=-sp;if(!DUEL.host){nvx=-nvx;nvy=-nvy;}
      TD.rally++;TD.B={x0:hx,y0:hy,vx:nvx,vy:nvy,t0:now};duelSend({b:[Math.round(hx*1e4),Math.round(hy*1e4),Math.round(nvx*1e4),Math.round(nvy*1e4),now],r:TD.rally});sfx('slap');buzz(10);}
    else if(vy>2.08)tdPoint(false);},
  recv(o){if(o.b){TD.B={x0:o.b[0]/1e4,y0:o.b[1]/1e4,vx:o.b[2]/1e4,vy:o.b[3]/1e4,t0:o.b[4]};TD.rally=o.r||0;SP.msg='';sfx('slap');}
    else if(o.p!=null){tdScore(!o.p,o.n);}else if(o.q){if(SP.done)return;SP.msg=DUEL.nm+' gaf op. '+duelEndPrize(true);SP.done=200;}},
  draw(g){const F=SP.F=spField(2.05),X=x=>F.x+x*F.w,Y=y=>F.y+y/2*F.h;tnCourt(g,F,X,Y);
    tnPl(g,X,Y,1-DUEL.oxs,.08,'#ff6b9d',false);tnPl(g,X,Y,SP.me,1.94,P.ch?P.ch.c:'#36d1ff',true);
    if(TD.B){const [hx,hy]=tdPos(dNow()),[vx,vy]=tdV(hx,hy);if(vy>-0.3&&vy<2.3){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(X(vx)+4,Y(vy)+5,5,3,0,0,TAU);g.fill();g.fillStyle='#e6ff3a';g.beginPath();g.arc(X(vx),Y(vy),5.5,0,TAU);g.fill();}}
    else if(!SP.done)txt(tdServer()?(IS_TOUCH?'Jij slaat op · tik!':'Jij slaat op · spatie'):DUEL.nm+' slaat op…',CW/2,Y(1.45),15,'#fff','center','Inter, sans-serif');
    duelTop(g,TD.sc.me,TD.sc.op,'TENNIS-DUEL · tot 5');txt(IS_TOUCH?'Sleep om te bewegen':'← → of muis om te bewegen',CW/2,CH-16,12,'rgba(255,255,255,.75)','center','Inter, sans-serif');},
  end(){if(!SP.over&&DUEL.g==='dtn')duelSend({q:1});DUEL.g=null;}};
function tdServe(){const now=dNow(),sp=.8;let x=SP.me,y=1.9,vx=rr(-.12,.12),vy=-sp;if(!DUEL.host){x=1-x;y=2-y;vx=-vx;vy=sp;}TD.rally=0;TD.B={x0:x,y0:y,vx,vy,t0:now};duelSend({b:[Math.round(x*1e4),Math.round(y*1e4),Math.round(vx*1e4),Math.round(vy*1e4),now],r:0});sfx('throw');SP.msg='';}
function tdPoint(mine){TD.pts++;duelSend({p:mine?1:0,n:TD.pts});tdScore(mine,TD.pts,true);}
function tdScore(mine,n,local){if(!local){if(n&&n<=TD.pts)return;TD.pts=n||TD.pts+1;}TD.B=null;TD.sc[mine?'me':'op']++;sfx(mine?'reward':'slap');TD.srvT=Date.now();
  const a=TD.sc.me,b=TD.sc.op;if(a>=5||b>=5){SP.msg=duelEndPrize(a>b)+'  ('+a+'-'+b+')';SP.done=240;return;}SP.msg=mine?'Punt voor jou!':'Punt voor '+DUEL.nm;}
// tennisbaan en speler tekenen (gedeeld met het spel tegen de computer)
function tnCourt(g,F,X,Y){g.fillStyle='#1e4f7a';g.fillRect(0,0,CW,CH);g.fillStyle='#2f6f3a';g.fillRect(F.x-14,F.y-14,F.w+28,F.h+28);g.fillStyle='#3d7ec2';g.fillRect(F.x,F.y,F.w,F.h);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(F.x,F.y,F.w,F.h);g.lineWidth=2;g.beginPath();
  g.moveTo(X(.12),F.y);g.lineTo(X(.12),F.y+F.h);g.moveTo(X(.88),F.y);g.lineTo(X(.88),F.y+F.h);g.moveTo(X(.12),Y(.55));g.lineTo(X(.88),Y(.55));g.moveTo(X(.12),Y(1.45));g.lineTo(X(.88),Y(1.45));g.moveTo(X(.5),Y(.55));g.lineTo(X(.5),Y(1.45));g.stroke();
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(F.x-8,Y(1)-1,F.w+16,6);g.fillStyle='#f4f4f4';g.fillRect(F.x-8,Y(1)-3,F.w+16,4);g.fillStyle='#333';g.fillRect(F.x-12,Y(1)-6,5,10);g.fillRect(F.x+F.w+7,Y(1)-6,5,10);}
function tnPl(g,X,Y,x,y,col,up){const px=X(x),py=Y(y);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(px+3,py+4,13,8,0,0,TAU);g.fill();g.fillStyle=col;g.beginPath();g.arc(px,py,11,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(px,py,6,0,TAU);g.fill();
  g.strokeStyle='#222';g.lineWidth=3;const ry=up?-1:1;g.beginPath();g.moveTo(px+9,py);g.lineTo(px+16,py+ry*12);g.stroke();g.strokeStyle='#f5f5f5';g.lineWidth=2;g.beginPath();g.ellipse(px+19,py+ry*17,6,8,0,0,TAU);g.stroke();}

// ---------------- PENALTY-DUEL ----------------
// beurt r: even = host schiet, oneven = gast schiet. Beide kiezen een plek (0..1) in het doel; pas als beide binnen zijn volgt het resultaat.
const PD={r:0,me:{},op:{},sc:{me:0,op:0},res:[],anim:0,t0:0};
function pdShooter(r){return (r%2===0)===DUEL.host;}
SPM.dpk={init(){Object.assign(PD,{r:0,me:{},op:{},sc:{me:0,op:0},res:[],anim:0,t0:Date.now()});SP.msg='';SP.aim=.5;},
  input(t,x,y){const F=SP.F;if(!F||SP.done||PD.anim)return;if(t==='down')pdPick(clamp((x-F.x)/F.w,.15,.85));if(t==='key')pdPick(SP.aim);},
  tick(){const k=SP.keys;if(k.ArrowLeft||k.KeyA)SP.aim=Math.max(.15,SP.aim-.012);if(k.ArrowRight||k.KeyD)SP.aim=Math.min(.85,SP.aim+.012);if(SP.done)return;
    if(PD.anim){if(Date.now()-PD.anim>1600){PD.anim=0;PD.r++;PD.t0=Date.now();SP.msg='';pdCheckEnd();}return;}
    if(PD.me[PD.r]==null&&Date.now()-PD.t0>9000)pdPick(rr(.2,.8));if(PD.me[PD.r]!=null&&PD.op[PD.r]!=null)pdResolve();},
  recv(o){if(o.q){if(SP.done)return;SP.msg=DUEL.nm+' gaf op. '+duelEndPrize(true);SP.done=200;return;}if(o.r!=null&&o.c!=null)PD.op[o.r]=clamp(o.c/1000,0,1);},
  draw(g){pdDraw(g);},end(){if(!SP.over&&DUEL.g==='dpk')duelSend({q:1});DUEL.g=null;}};
function pdPick(x){if(PD.me[PD.r]!=null)return;PD.me[PD.r]=x;duelSend({r:PD.r,c:Math.round(x*1000)});sfx('blip');buzz(10);}
function pdResolve(){const r=PD.r,sh=pdShooter(r),aim=sh?PD.me[r]:PD.op[r],dive=sh?PD.op[r]:PD.me[r],inG=aim>.31&&aim<.69,goal=inG&&Math.abs(aim-dive)>.11;
  PD.res[r]={sh,aim,dive,goal,out:!inG};if(goal)PD.sc[sh?'me':'op']++;PD.anim=Date.now();SP.msg=goal?(sh?'GOAL!':'Tegengoal…'):(!inG?(sh?'Naast!':'Naast! Gelukkig.'):(sh?'Gekeerd…':'GEKEERD!'));sfx(goal===sh?'reward':'slap');}
function pdCheckEnd(){const r=PD.r,a=PD.sc.me,b=PD.sc.op;
  if(r<10){let mL=0,oL=0;for(let q=r;q<10;q++){if(pdShooter(q))mL++;else oL++;}if(a+mL<b||b+oL<a)pdFin();return;}
  if(r%2===0&&a!==b){pdFin();return;}if(r>=16){SP.msg=duelEndPrize(false,true);SP.done=240;}}
function pdFin(){const a=PD.sc.me,b=PD.sc.op;SP.msg=duelEndPrize(a>b)+'  ('+a+'-'+b+')';SP.done=240;}
function pdDraw(g){const F=SP.F=spField(1.4),X=x=>F.x+x*F.w,Y=y=>F.y+y/1.4*F.h;g.fillStyle='#1b5e20';g.fillRect(0,0,CW,CH);for(let i=0;i<8;i++){g.fillStyle=i%2?'#2e7d32':'#388e3c';g.fillRect(F.x,F.y+i*F.h/8,F.w,F.h/8);}
  g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(F.x,F.y,F.w,F.h);g.strokeRect(X(.18),F.y,X(.82)-X(.18),Y(.5)-F.y);g.strokeRect(X(.33),F.y,X(.67)-X(.33),Y(.2)-F.y);g.fillStyle='#fff';g.beginPath();g.arc(X(.5),Y(1.15),4,0,TAU);g.fill();
  g.fillStyle='rgba(255,255,255,.18)';g.fillRect(X(.3),F.y-22,X(.7)-X(.3),22);g.strokeStyle='#fff';g.lineWidth=5;g.beginPath();g.moveTo(X(.3),F.y);g.lineTo(X(.3),F.y-22);g.lineTo(X(.7),F.y-22);g.lineTo(X(.7),F.y);g.stroke();
  const r=PD.r,R=PD.anim?PD.res[r]:null,sh=pdShooter(r),e=R?Math.min(1,(Date.now()-PD.anim)/700):0;
  // keeper (rood als de ander keept, blauw als jij keept)
  const kcol=sh?'#ff6b9d':'#36d1ff',kx=X(R?.5+(R.dive-.5)*Math.min(1,e*1.4):.5+Math.sin(Date.now()/400)*.05),ky=Y(.06);g.fillStyle=kcol;g.fillRect(kx-20,ky-5,40,10);g.beginPath();g.arc(kx,ky,10,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(kx,ky,5.5,0,TAU);g.fill();
  const scol=sh?'#36d1ff':'#ff6b9d';g.fillStyle=scol;g.beginPath();g.arc(X(.5),Y(1.25),11,0,TAU);g.fill();g.fillStyle='#e0b48f';g.beginPath();g.arc(X(.5),Y(1.25),6,0,TAU);g.fill();
  const bx=R?X(.5+(R.aim-.5)*e):X(.5),by=R?Y(1.15+(.08-1.15)*e):Y(1.15);g.fillStyle='#fff';g.beginPath();g.arc(bx,by,6,0,TAU);g.fill();g.fillStyle='#222';g.beginPath();g.arc(bx,by,2.2,0,TAU);g.fill();
  const mine=PD.me[r];if(!R&&!SP.done){if(mine!=null){g.strokeStyle='#ffd166';g.lineWidth=2;g.beginPath();g.arc(X(mine),Y(.1),10,0,TAU);g.stroke();txt('Wachten op '+DUEL.nm+'…',CW/2,Y(.75),15,'#fff','center','Inter, sans-serif');}
    else{const left=Math.max(0,9-Math.floor((Date.now()-PD.t0)/1000));txt(sh?'JIJ SCHIET! Tik waar in het doel':'JIJ KEEPT! Tik waar je naartoe duikt',CW/2,Y(.75),16,sh?'#7dff6a':'#ffd166','center','Inter, sans-serif');txt(left+'',CW/2,Y(.9),26,'#fff','center');
      if(!IS_TOUCH){g.strokeStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(X(SP.aim),Y(.1),9,0,TAU);g.stroke();}}}
  const rows=[[true,'me'],[false,'op']];for(const [isMe] of rows){for(let i=0;i<5;i++){const rr2=i*2+((isMe===DUEL.host)?0:1),q=PD.res[rr2];const x=(isMe?26:CW-134-4*20)+i*20,y=uiTop().top+70;g.fillStyle=q?(q.goal?'#7dff6a':'#ff4f6d'):'rgba(255,255,255,.25)';g.beginPath();g.arc(x,y,6,0,TAU);g.fill();}}
  duelTop(g,PD.sc.me,PD.sc.op,"PENALTY-DUEL · ronde "+(Math.floor(r/2)+1));}
