// ====================== muziek altijd aan bij start ======================
let NEED_TAP=false;
const ICON_ON='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="#fff"/><circle cx="18" cy="16" r="3" fill="#fff"/></svg>';
const ICON_OFF='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="#fff"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
function updMusIcon(){document.getElementById('mus').innerHTML=AU.on?ICON_ON:ICON_OFF;}
function startMusicNow(){try{auInit();}catch(e){}radio.volume=MODE==='play'?.45:.9;if(!AU.on)return;let pr=null;try{pr=radio.play();}catch(e){}
  const blocked=()=>{NEED_TAP=true;document.getElementById('snd').style.display='flex';};if(pr&&pr.then)pr.then(()=>{if(AU.c&&AU.c.state==='suspended')AU.c.resume();}).catch(blocked);else blocked();}
function unlockSound(e){if(!NEED_TAP)return;NEED_TAP=false;document.getElementById('snd').style.display='none';try{auInit();if(AU.c&&AU.c.state==='suspended')AU.c.resume();}catch(_){}musicPlay(false);}
['pointerup','touchend','click','keydown'].forEach(ev=>window.addEventListener(ev,unlockSound,true));
document.getElementById('mus').addEventListener('click',e=>{e.stopPropagation();if(NEED_TAP)return;musicToggle();});
function enterIntro(fast){MODE='intro';document.getElementById('lightc').style.display='none';GL.shown=false;document.getElementById('intro').style.display='block';document.getElementById('pick').style.display='none';document.getElementById('touch').style.display='none';
  document.getElementById('topBtns').style.display='none';document.getElementById('sideBtns').style.display='none';setupIntro();runLoader(fast);}
function restartGame(){paused=false;bigMap=false;P.stats={nat:0,omver:0,gejat:0};cars=[];peds=[];balloons=[];parts=[];decals=[];bubbles=[];msgs.length=0;P.dead=0;P.jz=0;respawn();camZ=1.15;populate();initMission();P.money=0;FX=[];SKIDS=[];hitStop=0;if(MG.on)mgEnd();
  document.getElementById('bPause').textContent='❚❚';radio.volume=.9;enterIntro(true);}
let restartArm=0;function askRestart(){if(performance.now()-restartArm<2500){restartArm=0;restartGame();}else{restartArm=performance.now();msg('OPNIEUW BEGINNEN?','Tik nog een keer op ⟲','#ffd166',140);}}
function startPlay(){MODE='play';radio.volume=.45;musicPlay();try{renderWorld();}catch(e){}
  if(IS_TOUCH)document.getElementById('touch').style.display='block';
  document.getElementById('topBtns').style.display='flex';placeTopBtns();msg(P.ch?P.ch.name+' IN BOMMEL':'WELKOM IN BOMMEL','Missie 1: breng een bezoek aan de Sint-Maartenskerk','#ffd166',240);last=performance.now();}
document.getElementById('play').addEventListener('click',showPick);
