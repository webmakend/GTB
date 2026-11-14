// ====================== touch-bediening ======================
function placeTopBtns(){const tb=document.getElementById('topBtns');if(tb){const S=Math.round(clamp(Math.min(CW,CH)*.27,96,150));tb.style.top=(MINI_B||uiTop().top+S+60)+'px';tb.style.right=Math.round(16+S/2-(tb.offsetWidth||36)/2)+'px';}const sb=document.getElementById('sideBtns');if(!sb)return;const S=Math.round(clamp(Math.min(CW,CH)*.28,100,180)),top=uiTop().bottom+8+S+12;sb.style.top=top+'px';sb.style.flexDirection=(CH-top<260)?'row':'column';}
function buzz(ms){if(Array.isArray(ms)){try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}return;}try{if(IS_TOUCH&&navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
const ICO={drop:'<svg viewBox="0 0 24 24"><path fill="#9fe0ff" d="M12 2C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-12z"/><path fill="#fff" opacity=".7" d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5v1.6A4.1 4.1 0 0 1 7.9 14.5z"/></svg>',
 run:'<svg viewBox="0 0 24 24" fill="#5ff0cf"><circle cx="15" cy="4" r="2.2"/><path d="M9.8 8.6l3.4-1.2c.7-.2 1.4.1 1.8.7l1.6 2.6 2.6.8-.6 1.8-3.3-1-1-1.5-1.1 3.4 2.6 2.5V22h-2v-4.6l-2.6-2.3-.9 2.6-4.3 2.2-.9-1.8 3.6-1.8 2.2-6.4-1.4.5-1.3 2.9-1.8-.8z"/></svg>',
 car:'<svg viewBox="0 0 24 24" fill="#ffb347"><path d="M5 11l1.6-4.3A2 2 0 0 1 8.5 5.3h7a2 2 0 0 1 1.9 1.4L19 11a2 2 0 0 1 2 2v4.5a1 1 0 0 1-1 1h-1.2a1 1 0 0 1-1-1V16H6.2v1.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V13a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3.2a.8.8 0 0 0-.8-.5H9.1a.8.8 0 0 0-.8.5zM6.5 14.6a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zm11 0a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z"/></svg>',
 gun:'<svg viewBox="0 0 24 24" fill="#ffd0e8"><path d="M3 8h15l1 -1h2v4h-3v1.5c0 .8-.7 1.5-1.5 1.5H13l-1 1v4.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1.2L8 13H4a1 1 0 0 1-1-1z"/></svg>',
 radio:'<svg viewBox="0 0 24 24" fill="#ffb3dd"><path d="M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm1-1.5L16 3l.6 1.4L7.8 8z"/><circle cx="8" cy="14" r="3" fill="#2a1030"/><rect x="13" y="11.5" width="6" height="1.6" rx=".8" fill="#2a1030"/><rect x="13" y="15" width="6" height="1.6" rx=".8" fill="#2a1030"/></svg>',
 brake:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#ff6b6b" stroke-width="2.4"/><rect x="10.8" y="6.5" width="2.4" height="7" rx="1.2" fill="#ff6b6b"/><circle cx="12" cy="16.6" r="1.4" fill="#ff6b6b"/></svg>',
 exit:'<svg viewBox="0 0 24 24" fill="#ffb347"><path d="M4 4h9v3h-2V6H6v12h5v-1h2v3H4z"/><path d="M14 8l5 4-5 4v-3H9v-2h5z"/></svg>',
 balloon:'<svg viewBox="0 0 24 24"><path fill="#7fc8ff" d="M12 2c4 0 7 3.2 7 7.6 0 4.4-3.6 8.4-7 8.4s-7-4-7-8.4C5 5.2 8 2 12 2z"/><path fill="#fff" opacity=".55" d="M9 6.5c.8-1.2 2-1.8 3.2-1.8-.3.9-1.4 2.2-3.2 3.4z"/><path d="M12 18l-1.3 2.4h2.6z" fill="#7fc8ff"/></svg>'};
const tbL=(ic,t)=>ICO[ic]+'<span>'+t+'</span>';
function updTouchUI(){if(frameN%30===0){const jb=document.getElementById('joyBase');if(jb&&!jb.classList.contains('drag'))JOYIDLE();}document.getElementById('bJump').style.display=P.car||P.dead||swimming()?'none':'flex';const bA=document.getElementById('bAct'),bC=document.getElementById('bCar');const ac=P.car?tbL('brake','REM'):P.weapon===1&&P.gun?tbL('gun','SCHIET'):tbL('drop','GOOI');const bX=document.getElementById('bX'),xs=P.car&&!P.car.t.bike,xt=tbL('radio','RADIO');bX.style.display=xs&&!P.dead?'flex':'none';
  const bM=document.getElementById('bAmmo'),am=P.weapon===1&&P.gun?ICO.gun+'<b>∞</b>':ICO.balloon+'<b>x'+(P.ammo|0)+'</b>';bM.style.display=!P.car&&!P.dead&&!swimming()?'flex':'none';if(bM._t!==am){bM.innerHTML=am;bM._t=am;}if(bX._t!==xt){bX.innerHTML=xt;bX._t=xt;}if(bA._t!==ac){bA.innerHTML=ac;bA._t=ac;}
  const ac2=!P.car&&ACT.cur&&!ACT.cur.off?ACT.cur:null,show=!!P.car||!!carNear()||!!ac2,ct=P.car?tbL('exit','UITSTAPPEN'):ac2?ac2.btn:tbL('car','INSTAPPEN');bC.style.display=show&&!P.dead?'flex':'none';if(bC._t!==ct){bC.innerHTML=ct;bC._t=ct;}}
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
  const bA=document.getElementById('bAct');bA.addEventListener('pointerdown',e=>{e.preventDefault();touch.act=true;bA.classList.add('on');});['pointerup','pointercancel','pointerleave'].forEach(t=>bA.addEventListener(t,()=>{touch.act=false;bA.classList.remove('on');}));
  document.getElementById('bCar').addEventListener('pointerdown',e=>{e.preventDefault();touch.enter=true;buzz(15);});
  const bX=document.getElementById('bX');bX.addEventListener('pointerdown',e=>{e.preventDefault();buzz(12);if(P.car)touch.radio=true;});
  const bM=document.getElementById('bAmmo');bM.addEventListener('pointerdown',e=>{e.preventDefault();if(!P.gun){noteAdd('💧 WATERBALLONNEN',(P.ammo|0)+' van 12 · vullen zich vanzelf bij','#7fc8ff',90,'wapen');return;}buzz(12);P.weapon=P.weapon?0:1;sfx('blip');noteAdd(P.weapon?'🔫 PISTOOL':'💧 WATERBALLONNEN','','#fff',80,'wapen');});
  document.getElementById('bJump').innerHTML=tbL('run','SPRING');
  const bJ=document.getElementById('bJump');bJ.addEventListener('pointerdown',e=>{e.preventDefault();touch.jump=true;bJ.classList.add('on');buzz(12);});['pointerup','pointercancel','pointerleave'].forEach(t=>bJ.addEventListener(t,()=>bJ.classList.remove('on')));
  document.getElementById('bPause').addEventListener('pointerdown',e=>{e.preventDefault();paused=!paused;document.getElementById('bPause').textContent=paused?'▶':'❚❚';});
  document.addEventListener('visibilitychange',()=>{if(AU.c){if(document.hidden)AU.c.suspend();else AU.c.resume();}});
}

