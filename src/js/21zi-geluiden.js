// ====================== echte geluidsfragmenten: WASTED, pistool, "au!" van voetgangers, schatkist-deuntje, themalied ======================
// Bestanden staan in assets/sfx/. Via Web Audio als dat kan (snel, meerdere tegelijk), anders met gewone <audio>-elementen.
const SMP={buf:{},el:{},files:{wasted:'wasted',pistol:'pistool',au:'au',schat:'schat',thema:'thema'},vol:{wasted:.9,pistol:.55,au:.6,schat:.8,thema:.85},last:{}};
for(const k in SMP.files){const a=new Audio();a.src='assets/sfx/'+SMP.files[k]+'.mp3';a.preload='auto';SMP.el[k]=a;}
function smpLoad(){if(!AU.c||SMP.loading)return;SMP.loading=1;for(const k in SMP.files)fetch('assets/sfx/'+SMP.files[k]+'.mp3').then(r=>r.ok?r.arrayBuffer():null).then(b=>b&&AU.c.decodeAudioData(b,d=>{SMP.buf[k]=d;},()=>{})).catch(()=>{});}
function smp(k,v,minGap){if(!AU.on&&k==='thema')return null;const now=performance.now();if(minGap&&now-(SMP.last[k]||0)<minGap)return null;SMP.last[k]=now;const vol=(v??1)*SMP.vol[k];
  if(AU.c&&SMP.buf[k]){try{const s=AU.c.createBufferSource();s.buffer=SMP.buf[k];const g=AU.c.createGain();g.gain.value=vol;s.connect(g);g.connect(AU.sfx);s.playbackRate.value=k==='au'?rr(.9,1.12):k==='pistol'?rr(.96,1.04):1;s.start();return s;}catch(e){}}
  const base=SMP.el[k];if(!base)return null;const a=k==='pistol'||k==='au'?base.cloneNode():base;try{a.currentTime=0;}catch(e){}a.volume=clamp(vol*(AU.sfx?AU.sfx.gain.value:1),0,1);const p=a.play();if(p&&p.catch)p.catch(()=>{});return a;}
{const _ai=auInit;auInit=function(){_ai.apply(this,arguments);smpLoad();};}
// WASTED: het echte geluid in plaats van het synth-deuntje
{const _w=wasted;wasted=function(t,why){const was=P.dead;_w(t,why);if(!was&&P.dead){smp('wasted');try{radio.volume=.12;setTimeout(()=>{if(MODE==='play')radio.volume=.45;},8000);}catch(e){}}};}
// pistool: echt schot (de andere wapens houden hun eigen geluid)
{const _s=shotSfx;shotSfx=function(){if(P.wid==='pistol'&&(SMP.buf.pistol||SMP.el.pistol)){smp('pistol',1,40);return;}_s();};}
// voetgangers roepen "au!" als je ze omver loopt, rijdt of raakt
{const _k=knockDown;knockDown=function(p,byPlayer,dir){const was=p.state;_k.apply(this,arguments);if(was!=='down'&&p.state==='down'&&Math.hypot(p.x-P.x,p.y-P.y)<700)smp('au',.9,350);};}
// schatkist gevonden: vrolijk deuntje
{const _mb=missionBanner;missionBanner=function(t){if(/^SCHAT/.test(String(t)))smp('schat');return _mb.apply(this,arguments);};}
// themalied op het kiesscherm (de achtergrondmuziek gaat even zachter)
{const _sp=showPick;showPick=function(){_sp.apply(this,arguments);if(MODE!=='pick'||SMP.themaDone)return;SMP.themaDone=1;const go=()=>{try{auInit();}catch(e){}const prev=radio.volume;radio.volume=.08;const a=smp('thema');setTimeout(()=>{try{radio.volume=MODE==='play'?.45:prev;}catch(e){}},17600);return a;};
  if(AU.c&&AU.c.state==='running')go();else{const once=()=>{window.removeEventListener('pointerdown',once,true);if(MODE==='pick')setTimeout(go,60);};window.addEventListener('pointerdown',once,true);}};}
