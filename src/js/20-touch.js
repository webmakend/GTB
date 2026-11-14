// ====================== touch-bediening ======================
function placeTopBtns(){const tb=document.getElementById('topBtns');if(tb){const S=Math.round(clamp(Math.min(CW,CH)*.27,96,150));const m=HUDX.mini;const mx=m?m.x:CW-S-16,my=m?m.y:uiTop().top+22,MS=m?m.S:S;const bm=document.getElementById('bMenu'),bn=document.getElementById('bNet');if(bm){bm.style.left=Math.round(mx-10)+'px';bm.style.top=Math.round(my-14)+'px';}if(bn){bn.style.left=Math.round(mx+MS-24)+'px';bn.style.top=Math.round(my-14)+'px';}}const sb=document.getElementById('sideBtns');if(!sb)return;const S=Math.round(clamp(Math.min(CW,CH)*.28,100,180)),top=uiTop().bottom+8+S+12;sb.style.top=top+'px';sb.style.flexDirection=(CH-top<260)?'row':'column';}
function buzz(ms){if(Array.isArray(ms)){try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}return;}try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
const ICO={drop:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3C9 7.5 6.5 10.5 6.5 14a5.5 5.5 0 0 0 11 0c0-3.5-2.5-6.5-5.5-11z"/></svg>',
 run:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4.5" r="1.8"/><path d="M8 21l3-5.5 3 2.5v4M11 15.5l1.5-5.5 3.5 3 3 .5M12.5 10l-3.5 1-2 3"/></svg>',
 car:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14l1.8-4.6A2 2 0 0 1 7.7 8h8.6a2 2 0 0 1 1.9 1.4L20 14v4h-2.5v-1.5h-11V18H4z"/><path d="M4 14h16"/><circle cx="7.5" cy="15.2" r=".6"/><circle cx="16.5" cy="15.2" r=".6"/></svg>',
 exit:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 8l-4 4 4 4M6 12h9"/></svg>',
 brake:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M8 8.5v7M16 8.5v7"/><text x="12" y="14.6" fill="#fff" stroke="none" font-size="7" font-family="Inter,sans-serif" font-weight="900" text-anchor="middle">!</text></svg>',
 radio:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M7 8l9-4"/><circle cx="15.5" cy="13.5" r="2.6"/><path d="M6.5 12h4M6.5 15h4"/></svg>',
 gun:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h15l1 2.5h2v2H11l-1.5 6H5.5L7 12.5H3z"/></svg>',
 balloon:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c3.6 0 6 2.8 6 6.3 0 3.8-3 6.9-6 6.9s-6-3.1-6-6.9c0-3.5 2.4-6.3 6-6.3z"/><path d="M12 16.7l-1 1.6h2l-1-1.6M12 18.3c0 1.5-1 1.8-1 3"/><path d="M9 7.5a3.5 3.5 0 0 1 2.3-1.6"/></svg>'};
const tbL=(ic,t)=>ICO[ic]+'<span>'+t+'</span>';
function updTouchUI(){if(frameN%30===0){const jb=document.getElementById('joyBase');if(jb&&!jb.classList.contains('drag'))JOYIDLE();}
  const bJ=document.getElementById('bJump');if(bJ._t!==1){bJ.innerHTML=ICO.run;bJ._t=1;}bJ.style.display=P.car||P.dead||swimming()?'none':'flex';const base=lvlBase(PRG.lvl),pr=clamp((PRG.xp-base)/need(PRG.lvl),0,1);bJ.style.setProperty('--p',(pr*100).toFixed(1)+'%');
  const bA=document.getElementById('bAct'),bC=document.getElementById('bCar'),bX=document.getElementById('bX');
  const ac=P.car?'car':P.wid;if(bA._t!==ac){bA._t=ac;const W=WPN[P.wid];bA.innerHTML=P.car?ICO.brake:(W&&W.ic>=0?`<i class="wico" style="background-position:0 ${(W.ic/8*100).toFixed(3)}%"></i>`:ICO.balloon);}
  const xs=P.car&&!P.car.t.bike;bX.style.display=xs&&!P.dead?'flex':'none';if(bX._t!==1){bX.innerHTML=ICO.radio;bX._t=1;}
  const ws=P.inv.length>1&&!P.car&&!P.dead&&!swimming();for(const id of ['wPrev','wNext']){const e=document.getElementById(id);if(e)e.style.display=ws?'flex':'none';}
  const show=(!!P.car||!!carNear())&&!P.dead,ct=P.car?ICO.exit:ICO.car;bC.style.display=show?'flex':'none';if(bC._t!==ct){bC.innerHTML=ct;bC._t=ct;}bC.classList.toggle('pulse',!P.car);}
let JOYIDLE=()=>{};let PINCH=null,joyCancel=()=>{};
function setupPinch(){const isBtn=t=>t&&t.closest&&t.closest('.tb,.sb,#mus');let first=null;
  window.addEventListener('touchstart',e=>{if(MODE!=='play'||MG.on)return;const now=performance.now();
    if(e.touches.length===1){first={t:now,btn:isBtn(e.touches[0].target)};return;}
    if(e.touches.length===2&&!PINCH){const [a,b]=e.touches;if(isBtn(a.target)||isBtn(b.target))return;if(first&&now-first.t>350&&(touch.jx||touch.jy))return; // al aan het sturen: tweede vinger is geen knijpgebaar
      PINCH={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)||1,z:ZU};touch.jx=touch.jy=0;joyCancel();}},{passive:true,capture:true});
  window.addEventListener('touchmove',e=>{if(!PINCH||e.touches.length<2)return;const [a,b]=e.touches;setZoom(PINCH.z*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/PINCH.d);if(e.cancelable)e.preventDefault();},{passive:false,capture:true});
  const end=e=>{if(PINCH&&e.touches.length<2)PINCH=null;};window.addEventListener('touchend',end,{capture:true});window.addEventListener('touchcancel',end,{capture:true});}
function setupZoom(){cv.addEventListener('wheel',e=>{if(MODE!=='play')return;e.preventDefault();setZoom(ZU*(e.deltaY>0?.9:1.11));},{passive:false});
  const pts=new Map();let d0=0,z0=1;
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const [a,b]=[...pts.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1]);z0=ZU;}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2&&d0>0){const [a,b]=[...pts.values()];setZoom(z0*Math.hypot(a[0]-b[0],a[1]-b[1])/d0);}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)d0=0;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  const hold=(id,f)=>{const el=document.getElementById(id);let iv=null;el.addEventListener('pointerdown',e=>{e.preventDefault();f();clearInterval(iv);iv=setInterval(f,120);});['pointerup','pointerleave','pointercancel'].forEach(t=>el.addEventListener(t,()=>{clearInterval(iv);}));};
  document.getElementById('bRestart').addEventListener('pointerdown',e=>{e.preventDefault();askRestart();});
  document.getElementById('bSave').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();writeSave(false);});}
function setupMapClick(){cv.addEventListener('pointerdown',e=>{if(MODE==='play'&&!CLUB.on&&!MG.on&&!bigMap&&statueAt(e.clientX,e.clientY)){e.stopImmediatePropagation();openStatue();}},true);
  const mgp=e=>{if(MG.on&&!MG.res&&(e.pointerType==='mouse'||e.buttons||e.type==='pointerdown')){const B=mgBox();MG.hy=clamp(e.clientY,B.top+10,B.bot-10);}};cv.addEventListener('pointerdown',mgp);cv.addEventListener('pointermove',mgp);
  cv.addEventListener('pointerdown',e=>{if(MODE!=='play'||MG.on)return;if(bigMap){bigMap=false;return;}if(Math.hypot(e.clientX-MM.x,e.clientY-MM.y)<=MM.r+4)bigMap=true;});
  cv.addEventListener('pointermove',e=>{if(MODE==='play')cv.style.cursor=(bigMap||Math.hypot(e.clientX-MM.x,e.clientY-MM.y)<=MM.r)?'pointer':'default';});}
function setupTouch(){
  const zone=document.getElementById('joyZone'),base=document.getElementById('joyBase'),knob=document.getElementById('joyKnob'),hint=document.getElementById('joyHint');let jid=null,bx=0,by=0;
  touch.on=IS_TOUCH;
  zone.addEventListener('pointerdown',e=>{if(jid===null&&MODE==='play'&&statueAt(e.clientX,e.clientY)){e.preventDefault();openStatue();return;}if(jid!==null)return;jid=e.pointerId;try{zone.setPointerCapture(jid);}catch(_){}bx=e.clientX;by=e.clientY;base.style.display='block';base.classList.remove('idle');base.classList.add('drag');base.style.left=bx+'px';base.style.top=(by-zone.getBoundingClientRect().top)+'px';e.preventDefault();});
  const zt=()=>zone.getBoundingClientRect().top;
  const joyIdle=()=>{base.classList.remove('drag');const sl=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sl'))||0,sb=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb'))||0;base.style.display='block';base.classList.add('idle');base.style.left=(sl+24+75)+'px';base.style.top=(zone.clientHeight-sb-34-75)+'px';knob.style.left='43px';knob.style.top='43px';};JOYIDLE=joyIdle;window.addEventListener('resize',()=>setTimeout(joyIdle,60));
  joyCancel=()=>{if(jid!==null){jid=null;joyIdle();}};
  zone.addEventListener('pointermove',e=>{if(e.pointerId!==jid)return;if(PINCH){touch.jx=touch.jy=0;return;}let dx=e.clientX-bx,dy=e.clientY-by,d=Math.hypot(dx,dy);const m=58;
    if(d>m*1.25){const k=(d-m*1.25)/d;bx+=dx*k;by+=dy*k;base.style.left=bx+'px';base.style.top=(by-zt())+'px';dx=e.clientX-bx;dy=e.clientY-by;d=Math.hypot(dx,dy);}
    let kx=dx,ky=dy;if(d>m){kx*=m/d;ky*=m/d;}knob.style.left=(43+kx)+'px';knob.style.top=(43+ky)+'px';
    const n=Math.min(1,d/m),dz=.14,v=n<dz?0:Math.pow((n-dz)/(1-dz),1.15);touch.jx=d>0?dx/d*v:0;touch.jy=d>0?dy/d*v:0;e.preventDefault();});
  const end=e=>{if(e.pointerId!==jid)return;jid=null;touch.jx=touch.jy=0;joyIdle();};
  zone.addEventListener('pointerup',end);zone.addEventListener('pointercancel',end);
  const bA=document.getElementById('bAct');let sw0=null;bA.addEventListener('pointerdown',e=>{e.preventDefault();touch.act=true;bA.classList.add('on');sw0={x:e.clientX,y:e.clientY,done:false};try{bA.setPointerCapture(e.pointerId);}catch(_){}});
  bA.addEventListener('pointermove',e=>{if(!sw0||sw0.done||!P.gun||P.car)return;const dx=e.clientX-sw0.x;if(Math.abs(dx)>38&&Math.abs(dx)>Math.abs(e.clientY-sw0.y)*1.3){sw0.done=true;touch.act=false;setWeapon(dx>0?1:-1);}});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>bA.addEventListener(t,()=>{touch.act=false;sw0=null;bA.classList.remove('on');}));
  for(const [id,d] of [['wPrev',-1],['wNext',1]]){const e2=document.getElementById(id);if(e2)e2.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();setWeapon(d);});}
  document.getElementById('bCar').addEventListener('pointerdown',e=>{e.preventDefault();touch.enter=true;buzz(15);});
  const bX=document.getElementById('bX');bX.addEventListener('pointerdown',e=>{e.preventDefault();buzz(12);if(P.car)touch.radio=true;});
  document.getElementById('bJump').innerHTML=tbL('run','SPRING');
  const bJ=document.getElementById('bJump');if(bJ._t!==1){bJ.innerHTML=ICO.run;bJ._t=1;}bJ.addEventListener('pointerdown',e=>{e.preventDefault();touch.jump=true;bJ.classList.add('on');buzz(12);});['pointerup','pointercancel','pointerleave'].forEach(t=>bJ.addEventListener(t,()=>bJ.classList.remove('on')));
  document.getElementById('bPause').addEventListener('pointerdown',e=>{e.preventDefault();paused=!paused;document.getElementById('bPause').textContent=paused?'▶':'❚❚';});
  document.addEventListener('visibilitychange',()=>{if(AU.c){if(document.hidden)AU.c.suspend();else AU.c.resume();}});
}

