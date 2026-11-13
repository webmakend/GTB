// ====================== touch-bediening ======================
function placeTopBtns(){const sb=document.getElementById('sideBtns');if(!sb)return;const S=Math.round(clamp(Math.min(CW,CH)*.28,100,180)),top=uiTop().bottom+8+S+12;sb.style.top=top+'px';sb.style.flexDirection=(CH-top<260)?'row':'column';}
function buzz(ms){if(Array.isArray(ms)){try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}return;}try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
function updTouchUI(){document.getElementById('bJump').style.display=P.car||P.dead||swimming()?'none':'flex';const bA=document.getElementById('bAct'),bC=document.getElementById('bCar');const ac=P.car?'REM':'💧<br>GOOI';if(bA._t!==ac){bA.innerHTML=ac;bA._t=ac;}
  const show=!!P.car||!!carNear(),ct=P.car?'UIT<br>STAP':'IN<br>STAP';bC.style.display=show&&!P.dead?'flex':'none';if(bC._t!==ct){bC.innerHTML=ct;bC._t=ct;}}
let PINCH=null,joyCancel=()=>{};
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
  document.getElementById('bRestart').addEventListener('pointerdown',e=>{e.preventDefault();askRestart();});}
function setupMapClick(){const mgp=e=>{if(MG.on&&!MG.res&&(e.pointerType==='mouse'||e.buttons||e.type==='pointerdown')){const B=mgBox();MG.hy=clamp(e.clientY,B.top+10,B.bot-10);}};cv.addEventListener('pointerdown',mgp);cv.addEventListener('pointermove',mgp);
  cv.addEventListener('pointerdown',e=>{if(MODE!=='play'||MG.on)return;if(bigMap){bigMap=false;return;}if(Math.hypot(e.clientX-MM.x,e.clientY-MM.y)<=MM.r+4)bigMap=true;});
  cv.addEventListener('pointermove',e=>{if(MODE==='play')cv.style.cursor=(bigMap||Math.hypot(e.clientX-MM.x,e.clientY-MM.y)<=MM.r)?'pointer':'default';});}
function setupTouch(){
  const zone=document.getElementById('joyZone'),base=document.getElementById('joyBase'),knob=document.getElementById('joyKnob'),hint=document.getElementById('joyHint');let jid=null,bx=0,by=0;
  touch.on=IS_TOUCH;
  zone.addEventListener('pointerdown',e=>{if(jid!==null)return;jid=e.pointerId;try{zone.setPointerCapture(jid);}catch(_){}bx=e.clientX;by=e.clientY;base.style.display='block';base.style.left=bx+'px';base.style.top=(by-zone.getBoundingClientRect().top)+'px';hint.style.display='none';e.preventDefault();});
  const zt=()=>zone.getBoundingClientRect().top;
  joyCancel=()=>{if(jid!==null){jid=null;base.style.display='none';knob.style.left='40px';knob.style.top='40px';}};
  zone.addEventListener('pointermove',e=>{if(e.pointerId!==jid)return;if(PINCH){touch.jx=touch.jy=0;return;}let dx=e.clientX-bx,dy=e.clientY-by,d=Math.hypot(dx,dy);const m=58;
    if(d>m*1.25){const k=(d-m*1.25)/d;bx+=dx*k;by+=dy*k;base.style.left=bx+'px';base.style.top=(by-zt())+'px';dx=e.clientX-bx;dy=e.clientY-by;d=Math.hypot(dx,dy);}
    let kx=dx,ky=dy;if(d>m){kx*=m/d;ky*=m/d;}knob.style.left=(40+kx)+'px';knob.style.top=(40+ky)+'px';
    const n=Math.min(1,d/m),dz=.14,v=n<dz?0:Math.pow((n-dz)/(1-dz),1.15);touch.jx=d>0?dx/d*v:0;touch.jy=d>0?dy/d*v:0;e.preventDefault();});
  const end=e=>{if(e.pointerId!==jid)return;jid=null;touch.jx=touch.jy=0;base.style.display='none';knob.style.left='40px';knob.style.top='40px';};
  zone.addEventListener('pointerup',end);zone.addEventListener('pointercancel',end);
  const bA=document.getElementById('bAct');bA.addEventListener('pointerdown',e=>{e.preventDefault();touch.act=true;bA.classList.add('on');});['pointerup','pointercancel','pointerleave'].forEach(t=>bA.addEventListener(t,()=>{touch.act=false;bA.classList.remove('on');}));
  document.getElementById('bCar').addEventListener('pointerdown',e=>{e.preventDefault();touch.enter=true;buzz(15);});
  const bJ=document.getElementById('bJump');bJ.addEventListener('pointerdown',e=>{e.preventDefault();touch.jump=true;bJ.classList.add('on');buzz(12);});['pointerup','pointercancel','pointerleave'].forEach(t=>bJ.addEventListener(t,()=>bJ.classList.remove('on')));
  document.getElementById('bPause').addEventListener('pointerdown',e=>{e.preventDefault();paused=!paused;document.getElementById('bPause').textContent=paused?'▶':'❚❚';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&MODE==='play'){paused=true;document.getElementById('bPause').textContent='▶';}if(AU.c){if(document.hidden)AU.c.suspend();else AU.c.resume();}});
}

