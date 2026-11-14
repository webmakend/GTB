// ====================== start ======================
function populate(){const v=parkNear(P.x+30,P.y+30,'velzart');v.keep=0;for(let i=0;i<22;i++)spawnCivCar(true);for(let i=0;i<40;i++)spawnPed(true);}
function init(){
  resize();genWorld();buildGraph();buildMini();buildVectorMap();buildPats();initBarges();
  const mk=ROADS.find(r=>r.n==='Markt');SPAWN=mk?mk.p[mk.p.length>>1]:[W/2,H/2];respawn();camZ=1.15;
  placeStatue();populate();initMission();
  setupTouch();setupMapClick();setupZoom();setupPinch();
}
init();
let last=performance.now(),acc=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(100,now-last);last=now;
  if(MODE==='play'&&CLUB.on){acc+=dt;let n=0;while(acc>=16.667&&n<4){clubStep();acc-=16.667;n++;}if(n>=4)acc=0;if(CLUB.on)drawClub();return;}
  if(MODE==='play'){if(!paused&&!bigMap){acc+=dt;let n=0;while(acc>=16.667&&n<4){if(MG.on)mgStep();else if(hitStop>0){hitStop--;frameN++;}else step();acc-=16.667;n++;}if(n>=4)acc=0;}renderWorld();}
}
requestAnimationFrame(frame);
updMusIcon();enterIntro(false);startMusicNow();
if(document.fonts&&document.fonts.load){document.fonts.load('40px Anton').catch(()=>{});}
initLights();
