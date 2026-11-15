// ====================== Waardenburg vrijspelen, slagboom op de brug, stroming in de Waal ======================
const WBX={msgT:0,curT:0,barA:0,ann:false};
function wbBar(){if(!BRIDGE)return null;const {A,ux,uy}=BRIDGE,s=230;return{x:A[0]+ux*s,y:A[1]+uy*s,s,ux,uy,w:BRIDGE.L?130:120};}
function wbUnlock(silent){if(WBOPEN||!WB)return;WBOPEN=true;PRG.wb=1;PRG.dirty=true;try{progSave();}catch(e){}if(silent)return;
  sfx('reward');camHit(6);buzz([60,40,60,40,120]);addXP(250);
  noteAdd('WAARDENBURG VRIJGESPEELD!','Tol betaald. Rijd over de Martinus Nijhoffbrug naar het noorden; de slagboom is voortaan open.','#ffd166',600);
  missionBanner('NIEUW GEBIED: WAARDENBURG','Rijd over de Martinus Nijhoffbrug','#ffd166',260);}
function wbStep(){if(!WB||!BRIDGE)return;if(!WBOPEN&&PRG.wb)wbUnlock(true);
  WBX.barA+=((WBOPEN?1:0)-WBX.barA)*.04;
  const b=wbBar(),o=me();
  // slagboom: zolang Waardenburg op slot zit kom je de brug niet op
  if(!WBOPEN&&!P.dead){const dx=o.x-BRIDGE.A[0],dy=o.y-BRIDGE.A[1],s=dx*BRIDGE.ux+dy*BRIDGE.uy,l=-dx*BRIDGE.uy+dy*BRIDGE.ux;
    if(s>b.s-6&&s<b.s+600&&Math.abs(l)<110){const ns=b.s-8,nx=BRIDGE.A[0]+BRIDGE.ux*ns-BRIDGE.uy*l,ny=BRIDGE.A[1]+BRIDGE.uy*ns+BRIDGE.ux*l;
      if(P.car){P.car.x=nx;P.car.y=ny;P.car.vx*=-.25;P.car.vy*=-.25;}else{P.x=nx;P.y=ny;}
      if(frameN-WBX.msgT>150){WBX.msgT=frameN;sfx('slap');noteAdd('TOLPOORT','Betaal €300 bij de slagboom om Waardenburg vrij te spelen','#ff6b6b',200,'wbslot');}}}
  // diep water: 2 meter vanaf de kant wordt het donkerblauw, daar verdrink je binnen 5 seconden
  if(swimming()&&isDeep(P.x,P.y)){P.drown=(P.drown||0)+1/60;if(frameN%6===0)parts.push({x:P.x+rr(-6,6),y:P.y+rr(-6,6),vx:0,vy:-.3,l:24,ml:24,s:2,k:'p'});
    if(frameN-WBX.curT>240){WBX.curT=frameN;noteAdd('TE DIEP!','Zwem terug naar de kant, anders verdrink je','#36d1ff',200,'diep');buzz([40,60,40]);}
    if(P.drown>=5){P.drown=0;P.lastHit='Verdronken in diep water';wasted('WASTED','Verdronken in diep water');}}
  else if(P.drown)P.drown=Math.max(0,P.drown-2/60);
  if(inWB(o.x,o.y)&&!WBX.ann){WBX.ann=true;if(typeof voice==='function')setTimeout(()=>voice('wb',true),2500);missionBanner('WELKOM IN WAARDENBURG','Dorp aan de Waal · kasteel, PLUS en v.v. WNC','#ffd166',220);addXP(60);}}
function drawWbBar(){if(!WB||!BRIDGE)return;const b=wbBar();if(Math.abs(b.x-CAM.x)>1500||Math.abs(b.y-CAM.y)>1500)return;const ang=Math.atan2(b.uy,b.ux)+Math.PI/2,hw=66;
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(ang);
  for(const sd of [-1,1]){ctx.fillStyle='#2a2a2e';ctx.fillRect(sd*hw-5,-5,10,10);}
  ctx.save();ctx.translate(-hw,0);ctx.rotate(-WBX.barA*1.35);const L=hw*2;for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#ffffff':'#e5312b';ctx.fillRect(i*L/8,-3,L/8+.5,6);}ctx.restore();
  if(!WBOPEN){ctx.rotate(-ang);ctx.font='800 13px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const t='🚧 TOL WAARDENBURG · €300';const w=ctx.measureText(t).width+16;ctx.fillStyle='rgba(20,8,30,.85)';rrect(ctx,-w/2,-44,w,22,6);ctx.fill();ctx.fillStyle='#ffd166';ctx.fillText(t,0,-33);}
  ctx.restore();}

let DEEP=null;function buildDeep(){DEEP=new Uint8Array(GW*GH);const D=new Uint8Array(GW*GH).fill(9),q=[];for(let i=0;i<G.length;i++)if(G[i]!==WATER||BRG[i]){D[i]=0;q.push(i);}
  for(let h=0;h<q.length;h++){const i=q[h],d=D[i];if(d>=3)continue;const x=i%GW,y=(i/GW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=GW||ny>=GH)continue;const k=ny*GW+nx;if(D[k]>d+1){D[k]=d+1;q.push(k);}}}
  for(let i=0;i<G.length;i++)DEEP[i]=D[i]>=2?1:0;}
function isDeep(x,y){if(!DEEP)buildDeep();return DEEP[cellIdx(x,y)]===1;}
function drawDrown(){if(!P.drown||P.drown<.05||P.dead)return;const t=Math.ceil(5-P.drown);ctx.save();ctx.font='900 20px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.6)';const y=P.y-30-Math.sin(frameN*.2)*2;
  ctx.strokeText('💧 '+t,P.x,y);ctx.fillStyle=t<=2?'#ff4d4d':'#7fd4ff';ctx.fillText('💧 '+t,P.x,y);ctx.restore();}

function tollNear(){if(WBOPEN||!WB||!BRIDGE||P.dead)return false;const b=wbBar(),o=me(),dx=o.x-BRIDGE.A[0],dy=o.y-BRIDGE.A[1],s=dx*BRIDGE.ux+dy*BRIDGE.uy,l=-dx*BRIDGE.uy+dy*BRIDGE.ux;return s>b.s-200&&s<b.s+5&&Math.abs(l)<140;}
function tollPay(){if(WBOPEN)return;if(P.money<300){sfx('slap');noteAdd('TE WEINIG GELD','De tol voor Waardenburg is €300. Je hebt €'+Math.floor(P.money)+'.','#ff6b6b',200,'tolgeld');return;}addMoney(-300);sfx('kassa');wbUnlock(false);}
