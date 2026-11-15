// ====================== Waardenburg extra: startplek kiezen, schoolpleinen met hek, Esso, speeltuin De Rakkershof,
// picknickplek Weerdenborch, Chinotaria De Waard, A2 (snel, niet te belopen), nieuwe klussen en blijvend opslaan ======================
const WBS=WD.wbspot||{},YARDS=[],FENCES=[],KIDS=[],PROPS2=[],SCHOOLZ=[];let ESSO=null,SPEEL=null,PICNIC=null,WBSPAWN=null;
function clearRect(cx,cy,w,h,bad){for(let u=-w/2;u<=w/2;u+=12)for(let v=-h/2;v<=h/2;v+=12)if(bad.includes(cellAt(cx+u,cy+v)))return false;return true;}
function findRect(x0,y0,w,h,bad,maxR){for(let R2=0;R2<=maxR;R2+=20){const n=Math.max(1,Math.round(R2/14));for(let k=0;k<n;k++){const a=k/n*TAU,x=x0+Math.cos(a)*R2,y=y0+Math.sin(a)*R2;if(clearRect(x,y,w,h,bad))return[x,y];}}return null;}
function rectPoly(cx,cy,w,h){return[[cx-w/2,cy-h/2],[cx+w/2,cy-h/2],[cx+w/2,cy+h/2],[cx-w/2,cy+h/2],[cx-w/2,cy-h/2]];}
function addSign(b,name,cat,adr){b.sign=name;b.signC=signCol(name,cat);b.sa=nearestRoadDir(b.cx,b.cy);SHOPS.push({b,n:name,c:cat,rob:0});LANDMARKS.push({n:name,x:b.cx,y:b.cy,shop:1,c:b.signC[0],cat,adr});}
function wbExtras(){if(!WB)return;
  const dorp=ROADS.filter(r=>r.wb&&r.n==='Dorpsstraat');if(dorp.length){const r=dorp.reduce((a,b)=>a.p.length>=b.p.length?a:b),q=r.p[r.p.length>>1];WBSPAWN=[q[0],q[1]];}
  // ---- schoolpleinen met hek
  for(const z of (WD.wbiz||[]).filter(z=>z.c==='Scholen'&&!/academ/i.test(z.n))){let sb=null,bd=1e9;for(const b of BUILDINGS){if(!b.wb||b.wbc)continue;const d=Math.hypot(b.cx-z.x,b.cy-z.y)-(b.kind==='school'?150:0);if(d<bd){bd=d;sb=b;}}if(!sb||bd>420)continue;
    if(YARDS.some(y=>y.b===sb))continue;const W2=300,H2=210,bw=(sb.bb[2]-sb.bb[0])/2,bh=(sb.bb[3]-sb.bb[1])/2;let pos=null;
    for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const cx=sb.cx+dx*(bw+W2/2+14),cy=sb.cy+dy*(bh+H2/2+14);if(clearRect(cx,cy,W2,H2,[BUILD,ROAD,WATER])){pos=[cx,cy];break;}}
    let w=W2,h=H2;if(!pos){w=240;h=170;pos=findRect(sb.cx,sb.cy,w,h,[BUILD,ROAD,WATER],700);}if(!pos){w=170;h=120;pos=findRect(sb.cx,sb.cy,w,h,[BUILD,ROAD,WATER],900);}if(!pos)continue;
    const P0=rectPoly(pos[0],pos[1],w,h);
    WD.plaza.push(P0.slice(0,4));polyFill(P0,i=>{G[i]=PLAZA;});const y={x:pos[0],y:pos[1],w,h,b:sb,n:z.n,poly:P0};YARDS.push(y);
    for(let i=0;i<4;i++)FENCES.push([P0[i],P0[i+1]]);
    SCHOOLZ.push([Math.min(pos[0]-w/2,sb.bb[0])-170,Math.min(pos[1]-h/2,sb.bb[1])-170,Math.max(pos[0]+w/2,sb.bb[2])+170,Math.max(pos[1]+h/2,sb.bb[3])+170]);
    LANDMARKS.push({n:'Schoolplein '+z.n,x:pos[0],y:pos[1]});
    for(let k=0;k<7;k++)KIDS.push({yd:y,x:pos[0]+rr(-w/3,w/3),y:pos[1]+rr(-h/3,h/3),a:rr(0,TAU),anim:rr(0,6),t:0,tx:0,ty:0,col:RP(['#ff4fa3','#36d1ff','#ffe14d','#7dff6a','#ff8a3d','#c77dff','#e63946']),hair:RP(['#2b1d0e','#e8c070','#7a3e12','#111','#c0392b']),talkCd:rr(0,400)});
    PROPS2.push({k:'hop',x:pos[0]-w/4,y:pos[1]},{k:'hoop',x:pos[0]+w/2-14,y:pos[1]},{k:'ball',x:pos[0],y:pos[1],vx:0,vy:0,yd:y});}
  // ---- Esso tankstation (Dorpsstraat 8)
  if(WBS.esso){const p=findRect(WBS.esso[0],WBS.esso[1],230,150,[BUILD,WATER],420);if(p){const P0=rectPoly(p[0],p[1],230,150);WD.plaza.push(P0.slice(0,4));polyFill(P0,i=>{if(G[i]!==ROAD)G[i]=PLAZA;});
      const shop={p:rectPoly(p[0]+70,p[1]-38,70,50).slice(0,4).concat([[p[0]+35,p[1]-63]]),ht:13,kind:'retail',flat:true,noFac:1,wall:'#f4f4f2',roof:'#d9dde2',ridge:false};shop.p=rectPoly(p[0]+70,p[1]-38,70,50);prepBuilding(shop);addSign(shop,'Esso','Winkel','Dorpsstraat 8, Waardenburg');
      
      ESSO={x:p[0]-30,y:p[1]+10,pumps:[[p[0]-60,p[1]+10],[p[0],p[1]+10]]};}}
  // ---- Chinotaria De Waard (Steenweg 45)
  if(WBS.chinees){let best=null,bd=1e9;for(const b of BUILDINGS){if(!b.wb||b.sign||b.wbc)continue;const d=Math.hypot(b.cx-WBS.chinees[0],b.cy-WBS.chinees[1]);if(d<bd){bd=d;best=b;}}if(best&&bd<400)addSign(best,'Chinotaria De Waard','Restaurant','Steenweg 45, Waardenburg');}
  // ---- speeltuin De Rakkershof
  if(WBS.speeltuin){const p=findRect(WBS.speeltuin[0],WBS.speeltuin[1],260,200,[BUILD,ROAD,WATER],700)||findRect(WBS.speeltuin[0],WBS.speeltuin[1],200,150,[BUILD,ROAD,WATER],1000);if(p){const P0=rectPoly(p[0],p[1],260,200);WD.sand.push(P0.slice(0,4));polyFill(P0,i=>{G[i]=SAND;});SPEEL={x:p[0],y:p[1],w:260,h:200};LANDMARKS.push({n:'Speeltuin De Rakkershof',x:p[0],y:p[1]});
      PROPS2.push({k:'swing',x:p[0]-80,y:p[1]-55},{k:'slide',x:p[0]+70,y:p[1]-50},{k:'seesaw',x:p[0]-70,y:p[1]+55},{k:'climb',x:p[0]+60,y:p[1]+50},{k:'sandbox',x:p[0],y:p[1]+5});
      const yd={x:p[0],y:p[1],w:240,h:180,play:1};for(let k=0;k<6;k++)KIDS.push({yd,x:p[0]+rr(-90,90),y:p[1]+rr(-70,70),a:rr(0,TAU),anim:rr(0,6),t:0,tx:0,ty:0,col:RP(['#ff4fa3','#36d1ff','#ffe14d','#7dff6a','#ff8a3d']),hair:RP(['#2b1d0e','#e8c070','#7a3e12']),talkCd:rr(0,400)});}}
  // ---- picknickplek Weerdenborch 20: vier grote bomen en een picknicktafel op het groen
  if(WBS.picknick){const p=findRect(WBS.picknick[0],WBS.picknick[1],170,170,[BUILD,ROAD,WATER,PLAZA,WALK],420)||findRect(WBS.picknick[0],WBS.picknick[1],140,140,[BUILD,ROAD,WATER],420);
    if(p){PICNIC={x:p[0],y:p[1],a:.2};for(const [dx,dy] of [[-62,-58],[64,-54],[-58,62],[60,60]])TREES.push({x:p[0]+dx,y:p[1]+dy,r:34,h:86,c:RP(['#2f5a28','#355f2c','#3b6a30'])});LANDMARKS.push({n:'Picknickplek Weerdenborch',x:p[0],y:p[1]});}}}
// ---- botsen met hekken (dubbelsprong gaat erover) en de A2 (niet te belopen)
function nearFence(x,y,r){for(const f of FENCES){const a=f[0],b=f[1],dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1);if(Math.hypot(a[0]+dx*t-x,a[1]+dy*t-y)<r)return true;}return false;}
{const _fb=footBlocked;footBlocked=function(x,y){if(_fb(x,y))return true;const i=cellIdx(x,y);if(MOTO[i]&&!P.car){if(frameN-(WBX.motoT||0)>200){WBX.motoT=frameN;noteAdd('SNELWEG A2','Hier kun je niet lopen. Neem de afslag naar beneden.','#ff9f1c',180,'a2');}return true;}
   if(FENCES.length&&!(P.jz>32)&&nearFence(x,y,6)){if(frameN-(WBX.fenceT||0)>240){WBX.fenceT=frameN;noteAdd('HEK','Met een dubbelsprong kom je eroverheen','#36d1ff',150,'hek');}return true;}return false;};
 const _cb=carBlocked;carBlocked=function(c,x,y,a){if(_cb(c,x,y,a))return true;if(!FENCES.length)return false;for(const y2 of YARDS){if(Math.abs(x-y2.x)>y2.w/2+60||Math.abs(y-y2.y)>y2.h/2+60)continue;return nearFence(x,y,c.t.w/2+4);}return false;};}
// ---- geen wapens rond de school
function inSchoolZone(x,y){for(const z of SCHOOLZ)if(x>z[0]&&x<z[2]&&y>z[1]&&y<z[3])return true;return false;}
function schoolBlock(){if(!inSchoolZone(P.x,P.y))return false;P.throwCd=30;if(frameN-(WBX.schT||0)>150){WBX.schT=frameN;noteAdd('🚸 SCHOOL','Rond de school werken je wapens niet','#ffd166',160,'school');sfx('slap');}return true;}
{const _fg=fireGun;fireGun=function(){if(schoolBlock())return;_fg();};const _tb=throwBalloon;throwBalloon=function(){if(!P.car&&schoolBlock())return;_tb.apply(this,arguments);};}
// ---- kinderen, speeltoestellen, tankstation, picknicktafel tekenen en laten bewegen
const KID_SAY=['Tikkie, jij bent hem!','Mag ik ook een keer?','Juf, hij duwt!','Nog vijf minuutjes!','Wie het eerst bij het hek is!','Hoger, hoger!'];
function wb2Step(){const o=me();for(const k of KIDS){if(Math.abs(k.x-o.x)>1400||Math.abs(k.y-o.y)>1400)continue;const yd=k.yd;if(--k.t<=0){k.t=rr(40,160);k.tx=yd.x+rr(-yd.w/2+18,yd.w/2-18);k.ty=yd.y+rr(-yd.h/2+18,yd.h/2-18);}
    const dx=k.tx-k.x,dy=k.ty-k.y,d=Math.hypot(dx,dy);if(d>3){const sp=d>60?1.6:1;k.x+=dx/d*sp;k.y+=dy/d*sp;k.a=Math.atan2(dy,dx);k.anim+=.3;k.mv=1;}else k.mv=0;
    if(--k.talkCd<=0&&Math.hypot(k.x-o.x,k.y-o.y)<260&&Math.random()<.01&&!bubbles.some(b=>KIDS.includes(b.p)&&b.p.yd===k.yd)){bubbles=bubbles.filter(b=>b.p!==k);bubbles.push({p:k,t:rpick(KID_SAY),life:150,keep:1});k.talkCd=500;}}
  for(const b of PROPS2)if(b.k==='ball'){const kk=KIDS.find(k=>k.yd===b.yd&&Math.hypot(k.x-b.x,k.y-b.y)<10);if(kk){const a=rr(0,TAU);b.vx=Math.cos(a)*3;b.vy=Math.sin(a)*3;}b.x+=b.vx;b.y+=b.vy;b.vx*=.96;b.vy*=.96;const y=b.yd;if(Math.abs(b.x-y.x)>y.w/2-8){b.vx*=-1;b.x=clamp(b.x,y.x-y.w/2+8,y.x+y.w/2-8);}if(Math.abs(b.y-y.y)>y.h/2-8){b.vy*=-1;b.y=clamp(b.y,y.y-y.h/2+8,y.y+y.h/2-8);}}}
function drawWb2(){const vis=(x,y)=>Math.abs(x-CAM.x)<1400&&Math.abs(y-CAM.y)<1400;
  for(const f of FENCES){if(!vis(f[0][0],f[0][1])&&!vis(f[1][0],f[1][1]))continue;const L=Math.hypot(f[1][0]-f[0][0],f[1][1]-f[0][1]);ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f[0][0]+3,f[0][1]+3);ctx.lineTo(f[1][0]+3,f[1][1]+3);ctx.stroke();
    ctx.strokeStyle='#2f6b3a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f[0][0],f[0][1]);ctx.lineTo(f[1][0],f[1][1]);ctx.stroke();ctx.fillStyle='#1e4a27';for(let t=0;t<=L;t+=24){const x=f[0][0]+(f[1][0]-f[0][0])*t/L,y=f[0][1]+(f[1][1]-f[0][1])*t/L;ctx.fillRect(x-2,y-2,4,4);}}
  for(const b of PROPS2){if(!vis(b.x,b.y))continue;ctx.save();ctx.translate(b.x,b.y);
    if(b.k==='hop'){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.5;for(let i=0;i<6;i++)ctx.strokeRect(-10+(i%2?10:0)*(i>1&&i<4?1:0),-36+i*12,i>1&&i<4?10:20,12);}
    else if(b.k==='hoop'){ctx.fillStyle='#555';ctx.fillRect(-3,-3,6,6);ctx.strokeStyle='#ff7043';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-9,0,6,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-40,0,26,0,TAU);ctx.stroke();}
    else if(b.k==='ball'){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(2,2,4,0,TAU);ctx.fill();ctx.fillStyle='#ff7043';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.strokeStyle='#5d2a1a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(4,0);ctx.stroke();}
    else if(b.k==='swing'){ctx.fillStyle='#8d6e63';ctx.fillRect(-36,-3,72,6);ctx.fillStyle='#5d4037';ctx.fillRect(-38,-12,5,24);ctx.fillRect(33,-12,5,24);const s=Math.sin(frameN*.06)*6;ctx.fillStyle='#e53935';ctx.fillRect(-20,6+s,14,6);ctx.fillStyle='#1e88e5';ctx.fillRect(6,6-s,14,6);}
    else if(b.k==='slide'){ctx.fillStyle='#fdd835';ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(8,-20);ctx.lineTo(10,30);ctx.lineTo(-10,30);ctx.closePath();ctx.fill();ctx.fillStyle='#8d6e63';ctx.fillRect(-12,-30,24,12);ctx.strokeStyle='#5d4037';ctx.lineWidth=2;ctx.strokeRect(-12,-30,24,12);}
    else if(b.k==='seesaw'){ctx.save();ctx.rotate(Math.sin(frameN*.05)*.25);ctx.fillStyle='#43a047';ctx.fillRect(-34,-4,68,8);ctx.restore();ctx.fillStyle='#6d4c41';ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();}
    else if(b.k==='climb'){ctx.strokeStyle='#e53935';ctx.lineWidth=3;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(0,0,14+i*7,Math.PI,0);ctx.stroke();}ctx.strokeStyle='#1e88e5';ctx.lineWidth=2;for(let a=-1.4;a<=1.4;a+=.7){ctx.beginPath();ctx.moveTo(Math.sin(a)*7,-Math.cos(a)*7);ctx.lineTo(Math.sin(a)*21,-Math.cos(a)*21);ctx.stroke();}}
    else if(b.k==='sandbox'){ctx.strokeStyle='#8d6e63';ctx.lineWidth=5;ctx.strokeRect(-26,-20,52,40);ctx.fillStyle='#e53935';ctx.fillRect(-10,-6,7,7);ctx.fillStyle='#fdd835';ctx.beginPath();ctx.arc(8,6,4,0,TAU);ctx.fill();}
    ctx.restore();}
  for(const k of KIDS){if(!vis(k.x,k.y))continue;ctx.save();ctx.translate(k.x,k.y);ctx.scale(.72,.72);drawPed({x:0,y:0,a:k.a,anim:k.anim,col:k.col,hair:k.hair,state:k.mv?'flee':'idle',kind:'p',wet:0},false);ctx.restore();}
  if(false){for(const q of ESSO.pumps){ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(q[0]-6,q[1]-12,16,28);ctx.fillStyle='#e53935';ctx.fillRect(q[0]-8,q[1]-14,16,28);ctx.fillStyle='#fff';ctx.fillRect(q[0]-5,q[1]-10,10,8);ctx.fillStyle='#0d47a1';ctx.fillRect(q[0]-8,q[1]+8,16,4);}}
  if(PICNIC&&vis(PICNIC.x,PICNIC.y)){ctx.save();ctx.translate(PICNIC.x,PICNIC.y);ctx.rotate(PICNIC.a);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(-22,-12,48,30);ctx.fillStyle='#8d6e63';ctx.fillRect(-26,-20,52,8);ctx.fillRect(-26,12,52,8);ctx.fillStyle='#a1887f';ctx.fillRect(-24,-10,48,20);ctx.strokeStyle='rgba(60,40,30,.6)';ctx.lineWidth=1;for(let x=-16;x<=16;x+=8){ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,10);ctx.stroke();}ctx.fillStyle='#e53935';ctx.fillRect(-6,-4,8,6);ctx.restore();}}
// ---- eten bij De Waard en tanken
FOOD['Chinotaria De Waard']={p:9,hp:60,t:'Chinees eten bij De Waard',e:'🥡',say:'Babi pangang en een loempia!'};
FOOD["McDonald's"]={p:6,hp:40,t:"Menu bij McDonald's",e:'🍔',say:'Big Mac menu, groot!'};
FOOD["Bertie's IJssalon"]={p:2,hp:15,t:'IJsje bij Bertie',e:'🍦',say:'Twee bolletjes, met slagroom!'};
function essoNear(){return ESSO&&P.car&&!P.car.t.bike&&Math.hypot(P.car.x-ESSO.x,P.car.y-ESSO.y)<110;}
function essoFill(){const c=P.car;if(!c)return;if(P.money<10){noteAdd('TE WEINIG GELD','Tanken en wassen kost €10','#ff6b6b',140);return;}addMoney(-10);c.hp=Math.max(c.hp,100);c.dmgV=0;sfx('kassa');noteAdd('GETANKT','Volle tank en een wasbeurt: je auto is weer als nieuw','#7dff6a',200);}
// ---- startgebied kiezen (Zaltbommel of Waardenburg, of verder waar je was)
function areaPick(sv){if(!WB)return;paused=true;let ov=document.getElementById('areaOv');if(!ov){ov=document.createElement('div');ov.id='areaOv';document.body.appendChild(ov);}
  const okPos=sv&&sv.v===2&&typeof sv.x==='number'&&![BUILD,WATER].includes(cellAt(sv.x,sv.y))&&(WBOPEN||!inWB(sv.x,sv.y));
  ov.innerHTML=`<div class="arBox"><b>WAAR WIL JE BEGINNEN?</b>${okPos?'<div class="arB cont" data-k="cont">▶ VERDER WAAR JE WAS<small>'+esc(sv.place||'')+'</small></div>':''}<div class="arB zb" data-k="zb">ZALTBOMMEL<small>De vesting · Markt</small></div>${WBOPEN?'<div class="arB wb" data-k="wb">WAARDENBURG<small>Dorpsstraat · kasteel · boomgaarden</small></div>':'<div class="arB lock">🔒 WAARDENBURG<small>Nog op slot · betaal €300 tol bij de Martinus Nijhoffbrug</small></div>'}</div>`;ov.style.display='flex';
  ov.querySelectorAll('.arB:not(.lock)').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const k=b.dataset.k;ov.style.display='none';paused=false;
    let q=k==='cont'?[sv.x,sv.y]:k==='wb'&&WBSPAWN?snap(WBSPAWN[0],WBSPAWN[1]):snap(SPAWN[0],SPAWN[1]);if(P.car){P.car.driver=null;P.car=null;}P.x=q[0];P.y=q[1];camX=P.x;camY=P.y;try{populate();}catch(er){}sfx('reward');if(k==='wb')WBX.ann=false;}));}
// ---- blijvend bewaren: positie mee opslaan, automatisch opslaan, opslag laten vasthouden door de browser
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
{const _ws=writeSave;writeSave=function(silent){_ws(silent);try{const s=getSave();if(s){const o=me();s.x=Math.round(o.x);s.y=Math.round(o.y);s.v=2;s.place=placeName||'';lsSet(SAVE_KEY,JSON.stringify(s));}}catch(e){}};}
setInterval(()=>{if(MODE==='play'&&!P.dead&&getSave())writeSave(true);},15000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&MODE==='play'&&getSave()){writeSave(true);try{progSave();}catch(e){}}});
window.addEventListener('pagehide',()=>{if(MODE==='play'&&getSave()){writeSave(true);try{progSave();}catch(e){}}});
// ---- doodgaan in Waardenburg: je komt in Waardenburg weer bij
{const _rs=respawn;respawn=function(){const wasWB=inWB(me().x,me().y);_rs.apply(this,arguments);if(wasWB&&WBSPAWN){const q=snap(WBSPAWN[0],WBSPAWN[1]);P.x=q[0];P.y=q[1];camX=P.x;camY=P.y;}};}
// ---- nieuwe klussen in Waardenburg
function wbWalk(fx,fy,dmin,dmax){for(let i=0;i<500;i++){const a=rr(0,TAU),d=rr(dmin,dmax),x=fx+Math.cos(a)*d,y=fy+Math.sin(a)*d,t=cellAt(x,y);if((t===WALK||t===PLAZA)&&inWB(x,y)&&!MOTO[cellIdx(x,y)])return[x,y];}return snap(fx,fy);}
function moatSpot(){const c=BUILDINGS.find(b=>b.wbc);if(!c||typeof isDeep!=='function')return null;let best=null,bd=1e9;for(let a=0;a<64;a++)for(let r=60;r<520;r+=12){const x=c.cx+Math.cos(a/64*TAU)*r,y=c.cy+Math.sin(a/64*TAU)*r;if(cellAt(x,y)!==WATER||BRG[cellIdx(x,y)]||isDeep(x,y))continue;const d=Math.hypot(x-c.cx,y-c.cy);if(d<bd){bd=d;best=[x,y];}break;}return best;}
WPN.zwaard={n:'Zwaard van Waardenburg',ic:-1,emo:'🗡️',cd:24,melee:1,lvl:1};WORDER.push('zwaard');
{const _fg2=fireGun;fireGun=function(){const W=WPN[P.wid];if(W&&W.melee){if(P.throwCd>0)return;if(schoolBlock())return;P.throwCd=W.cd;sfx('throw');camHit(2);ring(P.x+Math.cos(P.a)*18,P.y+Math.sin(P.a)*18,22,'rgba(255,255,255,.7)');
    for(const p of peds){if(p.state==='down')continue;const dx=p.x-P.x,dy=p.y-P.y,d=Math.hypot(dx,dy);if(d<34&&Math.abs(wrap(Math.atan2(dy,dx)-P.a))<1.1){knockDown(p,true,Math.atan2(dy,dx));if(p.kind==='cop')addHeat(1);}}
    if(typeof pvpGhosts==='function')for(const s of pvpGhosts())if(pvpTarget(s)&&Math.hypot(s.x-P.x,s.y-P.y)<34)pvpHit(s,25);return;}_fg2();};}
JOBDEF.push(
 {id:'zwaard',n:'Het zwaard in de gracht',ic:'🗡️',col:'#f0d58a',giver:()=>{const c=BUILDINGS.find(b=>b.wbc);return c?walkNear(c.cx,c.bb[3]+60,20,320,10):null;},avail:()=>!P.inv.includes('zwaard'),desc:'Volgens de kasteelheer ligt er een oud zwaard in de slotgracht',
  start(){JOB.tgt=moatSpot();JOB.T=0;return 'Kasteelheer: "In 1574 is het kasteel verwoest. Een ridder verloor toen zijn zwaard in de gracht. Zoek het aan de rand van het water, maar ga niet te diep!"';},
  step(){if(!JOB.tgt){jobFail('Geen zwaard te vinden.');return;}const o=me();if(Math.hypot(o.x-JOB.tgt[0],o.y-JOB.tgt[1])<26){giveWeapon('zwaard');jobWin(100,150,'Je hebt het zwaard van Waardenburg gevonden! Wissel ernaar en sla ermee met de actieknop.');}}},
 {id:'appelkist',n:'Appels voor de PLUS',ic:'🍎',col:'#e53935',giver:()=>{const f=FARMERS[0];return f?(walkNear(f.row[0].x,f.row[0].y,20,400,10)||snap(f.row[0].x,f.row[0].y)):null;},desc:'Breng een kist verse appels naar de PLUS, binnen de tijd',
  start(){JOB.tgt=shopDoor('PLUS');JOB.T=60*120;return 'Boer: "De PLUS wacht op mijn appels. Breng deze kist er snel heen, voor ze bruin worden!"';},
  step(){if(near(JOB.tgt,50))jobWin(45,80,'De PLUS is blij met de verse appels.');}},
 {id:'chinees',n:'Chinees bezorgen',ic:'🥡',col:'#ff7043',giver:()=>shopDoor('Chinotaria De Waard'),desc:'Bezorg een bestelling van De Waard in het dorp',
  start(){const g=this.g;JOB.tgt=wbWalk(g[0],g[1],700,1600);JOB.T=Math.round(Math.hypot(JOB.tgt[0]-g[0],JOB.tgt[1]-g[1])/1.8+900);return "Bezorg de babi pangang en loempia's op het aangegeven adres in Waardenburg. Warm afleveren!";},
  step(){if(near(JOB.tgt,40)){const tip=JOB.t<JOB.T*.5?8:0;jobWin(20+tip,60,tip?'Nog warm! +€'+tip+' fooi.':'Eten afgeleverd.');}}},
 {id:'verstop',n:'Verstoppertje in de Rakkershof',ic:'🙈',col:'#c77dff',giver:()=>SPEEL?(walkNear(SPEEL.x,SPEEL.y+SPEEL.h/2+30,10,300,8)||snap(SPEEL.x,SPEEL.y)):null,desc:'Zoek de drie kinderen die zich in het dorp verstopt hebben',
  start(){const g=this.g;JOB.d.cps=[wbWalk(g[0],g[1],400,900),wbWalk(g[0],g[1],500,1100),wbWalk(g[0],g[1],600,1300)];JOB.i=0;JOB.tgt=JOB.d.cps[0];JOB.T=60*150;return 'Kinderen: "Tel tot tien en zoek ons! We hebben ons verstopt in het dorp." Volg de pijl.';},
  step(){if(near(JOB.tgt,36)){JOB.i++;sfx('reward');popTxt(me().x,me().y-30,'GEVONDEN '+JOB.i+'/3','#c77dff',1.2);if(JOB.i>=3)jobWin(35,90,'Alle kinderen gevonden. Jij bent een goede zoeker!');else JOB.tgt=JOB.d.cps[JOB.i];}}});
