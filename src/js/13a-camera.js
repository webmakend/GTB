// ====================== camera ======================
// Volgt de speler met vertraging: hoe harder je rijdt, hoe meer de camera achterloopt (begrensd, zodat
// je auto altijd in beeld blijft). Screen-shake werkt met 'trauma': vloeiende ruis i.p.v. willekeurig
// schokken, met een klein beetje draaiing. Bij harde klappen ook een korte zoom-stoot.
const CAM={x:0,y:0,z:1,r:0};
function camNoise(t,s){return Math.sin(t*1.7+s)*.5+Math.sin(t*3.1+s*2.3)*.3+Math.sin(t*7.3+s*4.1)*.2;}
function cameraStep(){const o=me(),c=P.car;let tx=o.x,ty=o.y,k=.12;
  if(c){const sp=speedOf(c);tx+=c.vx*8;ty+=c.vy*8;k=clamp(.11-sp*.0095,.032,.11);}
  camX+=(tx-camX)*k;camY+=(ty-camY)*k;
  const Z=viewZ(),mx=CW*.3/Z,my=CH*.3/Z;camX=clamp(camX,o.x-mx,o.x+mx);camY=clamp(camY,o.y-my,o.y+my);
  const tz=c?clamp(1.05-speedOf(c)*.05,.6,1.05):1.15;camZ+=(tz-camZ)*.03;
  shake*=.9;if(shake<.05)shake=0;zoomKick*=.86;if(zoomKick<.001)zoomKick=0;}
function camHit(s,kick){shake=Math.max(shake,s);if(kick)zoomKick=Math.max(zoomKick,kick);}
function cameraView(){const tr=Math.min(1,shake/12),t2=tr*tr,t=performance.now()/1000*15;CAM.z=viewZ();
  CAM.x=camX+camNoise(t,1)*t2*24/CAM.z;CAM.y=camY+camNoise(t,7)*t2*24/CAM.z;CAM.r=camNoise(t,13)*t2*.04;
  if((P.drunk>=2||P.high>0)&&!CLUB.on){const q=Math.min(1,P.drunk/6)+(P.high>0?.35:0),s=performance.now()/1000;CAM.r+=Math.sin(s*.8)*.06*q;CAM.x+=Math.sin(s*1.1)*16*q/CAM.z;CAM.y+=Math.cos(s*.7)*10*q/CAM.z;}return CAM;}
function applyCam(c2){c2.setTransform(DPR,0,0,DPR,0,0);c2.translate(CW/2,CH/2);if(CAM.r)c2.rotate(CAM.r);c2.scale(CAM.z,CAM.z);c2.translate(-CAM.x,-CAM.y);}
