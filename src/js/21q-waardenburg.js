// ====================== Waardenburg vrijspelen, slagboom op de brug, stroming in de Waal ======================
const WBX={msgT:0,curT:0,barA:0,ann:false};
function wbBar(){if(!BRIDGE)return null;const {A,ux,uy}=BRIDGE,s=230;return{x:A[0]+ux*s,y:A[1]+uy*s,s,ux,uy,w:BRIDGE.L?130:120};}
function wbUnlock(silent){if(WBOPEN||!WB)return;WBOPEN=true;PRG.wb=1;PRG.dirty=true;try{progSave();}catch(e){}if(silent)return;
  sfx('reward');camHit(6);buzz([60,40,60,40,120]);addXP(250);
  noteAdd('WAARDENBURG VRIJGESPEELD!','Rijd over de Martinus Nijhoffbrug naar het noorden. De slagboom is open.','#ffd166',600);
  missionBanner('NIEUW GEBIED: WAARDENBURG','Rijd over de Martinus Nijhoffbrug','#ffd166',260);}
function wbStep(){if(!WB||!BRIDGE)return;if(!WBOPEN&&(PRG.wb||MIS.done))wbUnlock(!!PRG.wb);
  WBX.barA+=((WBOPEN?1:0)-WBX.barA)*.04;
  const b=wbBar(),o=me();
  // slagboom: zolang Waardenburg op slot zit kom je de brug niet op
  if(!WBOPEN&&!P.dead){const dx=o.x-BRIDGE.A[0],dy=o.y-BRIDGE.A[1],s=dx*BRIDGE.ux+dy*BRIDGE.uy,l=-dx*BRIDGE.uy+dy*BRIDGE.ux;
    if(s>b.s-6&&s<b.s+600&&Math.abs(l)<110){const ns=b.s-8,nx=BRIDGE.A[0]+BRIDGE.ux*ns-BRIDGE.uy*l,ny=BRIDGE.A[1]+BRIDGE.uy*ns+BRIDGE.ux*l;
      if(P.car){P.car.x=nx;P.car.y=ny;P.car.vx*=-.25;P.car.vy*=-.25;}else{P.x=nx;P.y=ny;}
      if(frameN-WBX.msgT>150){WBX.msgT=frameN;sfx('slap');noteAdd('BRUG AFGESLOTEN','Waardenburg speel je vrij door alle missies te halen','#ff6b6b',200,'wbslot');}}}
  // stroming: midden in de Waal kom je zwemmend niet verder
  if(swimming()){const yS=WB.bb[3]+80,yZ=FORTBB[1]-60;if(P.y>yS&&P.y<yZ){const mid=(yS+yZ)/2,half=(yZ-yS)/2,k=1-Math.abs(P.y-mid)/half;
      if(k>.35){const dir=P.y<mid?-1:1;P.y+=dir*(k-.35)*7;P.x+=1.6*k;if(frameN-WBX.curT>200){WBX.curT=frameN;noteAdd('TE VEEL STROMING','Midden in de Waal sleurt de stroming je terug. Neem de brug.','#36d1ff',200,'stroming');buzz(30);}
        if(frameN%5===0)parts.push({x:P.x+rr(-20,20),y:P.y+rr(-20,20),vx:2,vy:0,l:30,ml:30,s:3,k:'p'});}}}
  if(inWB(o.x,o.y)&&!WBX.ann){WBX.ann=true;missionBanner('WELKOM IN WAARDENBURG','Dorp aan de Waal · kasteel, PLUS en v.v. WNC','#ffd166',220);addXP(60);}}
function drawWbBar(){if(!WB||!BRIDGE)return;const b=wbBar();if(Math.abs(b.x-CAM.x)>1500||Math.abs(b.y-CAM.y)>1500)return;const ang=Math.atan2(b.uy,b.ux)+Math.PI/2,hw=66;
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(ang);
  for(const sd of [-1,1]){ctx.fillStyle='#2a2a2e';ctx.fillRect(sd*hw-5,-5,10,10);}
  ctx.save();ctx.translate(-hw,0);ctx.rotate(-WBX.barA*1.35);const L=hw*2;for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#ffffff':'#e5312b';ctx.fillRect(i*L/8,-3,L/8+.5,6);}ctx.restore();
  if(!WBOPEN){ctx.rotate(-ang);ctx.font='800 13px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const t='⛔ WAARDENBURG · OP SLOT';const w=ctx.measureText(t).width+16;ctx.fillStyle='rgba(20,8,30,.85)';rrect(ctx,-w/2,-44,w,22,6);ctx.fill();ctx.fillStyle='#ffd166';ctx.fillText(t,0,-33);}
  ctx.restore();}
