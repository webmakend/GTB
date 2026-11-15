// ====================== Waardenburg 3: trein + spoortunnel, molen, Esso, De Kwast, tennis (FPV), WNC, dorpshuis, huizen kopen ======================
// ---- trein over de spoorlijn (op een dijk; wegen gaan eronder door)
const RAIL=(()=>{const segs=(WD.rail||[]).map(r=>r.p.slice());if(!segs.length)return null;const pts=[].concat(...segs).sort((a,b)=>a[1]-b[1]);const out=[pts[0]];for(const q of pts)if(Math.hypot(q[0]-out[out.length-1][0],q[1]-out[out.length-1][1])>20)out.push(q);let L=0;const cum=[0];for(let i=1;i<out.length;i++){L+=Math.hypot(out[i][0]-out[i-1][0],out[i][1]-out[i-1][1]);cum.push(L);}return{p:out,cum,L};})();
const TRAIN={s:-1,dir:1,wait:600};
function railAt(s){const R=RAIL;s=clamp(s,0,R.L);let i=1;while(i<R.cum.length-1&&R.cum[i]<s)i++;const a=R.p[i-1],b=R.p[i],t=(s-R.cum[i-1])/((R.cum[i]-R.cum[i-1])||1);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,Math.atan2(b[1]-a[1],b[0]-a[0])];}
function trainStep(){if(!RAIL)return;if(TRAIN.s<0){if(--TRAIN.wait<=0){TRAIN.dir=Math.random()<.5?1:-1;TRAIN.s=TRAIN.dir>0?-260:RAIL.L+260;TRAIN.horn=0;}return;}TRAIN.s+=TRAIN.dir*8.5;
  const h=railAt(TRAIN.s);if(!TRAIN.horn&&Math.hypot(h[0]-me().x,h[1]-me().y)<900){TRAIN.horn=1;sfx('horn');}if(TRAIN.s<-300||TRAIN.s>RAIL.L+300){TRAIN.s=-1;TRAIN.wait=1800+Math.random()*1800;}}
function drawRailTop(){if(!RAIL)return;
  // spoorbrug/tunnel over de weg: dek boven de auto's
  for(const r of (WD.rail||[])){if(!r.br)continue;const a=r.p[0],b=r.p[r.p.length-1];if(Math.abs(a[0]-CAM.x)>1400||Math.abs(a[1]-CAM.y)>1400)continue;const L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;
    ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(uy,ux));ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-10,-24,L+20,58);ctx.fillStyle='#8d8f93';ctx.fillRect(-14,-28,L+28,56);ctx.fillStyle='#a39a8e';ctx.fillRect(-14,-17,L+28,34);ctx.fillStyle='#5d4a3a';for(let t=-12;t<L+14;t+=9)ctx.fillRect(t,-15,4,30);ctx.fillStyle='#c8ccd2';ctx.fillRect(-14,-9,L+28,2);ctx.fillRect(-14,7,L+28,2);ctx.fillStyle='#6b6e73';ctx.fillRect(-14,-28,L+28,4);ctx.fillRect(-14,24,L+28,4);ctx.restore();}
  if(TRAIN.s<0)return;for(let k=0;k<3;k++){const s=TRAIN.s-TRAIN.dir*k*92,h=railAt(s);if(s<0||s>RAIL.L)continue;if(Math.abs(h[0]-CAM.x)>1500||Math.abs(h[1]-CAM.y)>1500)continue;ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(h[2]);
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-40,-11,88,28);ctx.fillStyle='#ffc917';ctx.fillRect(-44,-15,88,30);ctx.fillStyle='#003082';ctx.fillRect(-44,-15,88,5);ctx.fillRect(-44,10,88,5);ctx.fillStyle='#d7dbe0';ctx.fillRect(-38,-9,76,18);ctx.fillStyle='rgba(0,0,0,.25)';for(let x=-34;x<36;x+=12)ctx.fillRect(x,-8,8,16);
    if(k===0||k===2){ctx.fillStyle='#ffc917';ctx.beginPath();const e=(k===0)===(TRAIN.dir>0)?44:-44;ctx.moveTo(e,-15);ctx.quadraticCurveTo(e+Math.sign(e)*14,0,e,15);ctx.fill();}ctx.restore();}}
// ---- molen (Gasthuisstraat 23): achtkantige romp, kap en draaiende wieken
function drawMolen(b,r,f,cx,cy){const n=r.length-1,c=centroid(r.slice(0,n)),tx=c[0]+(c[0]-cx)*f*.9,ty=c[1]+(c[1]-cy)*f*.9;ctx.save();
  ctx.fillStyle='#3d332c';ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.lineTo(tx+Math.cos(a)*22,ty+Math.sin(a)*22);}ctx.closePath();ctx.fill();ctx.fillStyle='#57493d';ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.lineTo(tx+Math.cos(a)*14,ty+Math.sin(a)*14);}ctx.closePath();ctx.fill();
  const hx=tx+(tx-cx)*.05,hy=ty+(ty-cy)*.05,rot=frameN*.025;ctx.translate(hx,hy);ctx.rotate(rot);for(let k=0;k<4;k++){ctx.save();ctx.rotate(k*Math.PI/2);ctx.fillStyle='#2a1d14';ctx.fillRect(-2,0,4,92);ctx.strokeStyle='rgba(240,230,210,.85)';ctx.lineWidth=1;ctx.fillStyle='rgba(235,225,205,.55)';ctx.fillRect(2,18,12,72);for(let y=22;y<90;y+=8){ctx.beginPath();ctx.moveTo(2,y);ctx.lineTo(14,y);ctx.stroke();}ctx.beginPath();ctx.moveTo(8,18);ctx.lineTo(8,90);ctx.stroke();ctx.restore();}
  ctx.fillStyle='#1a120c';ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();ctx.restore();}
// ---- Esso als echt tankstation
function drawEsso(){if(!ESSO||Math.abs(ESSO.x-CAM.x)>1400||Math.abs(ESSO.y-CAM.y)>1400)return;const x=ESSO.x,y=ESSO.y,k=.0022*24,ox=(x-CAM.x)*k,oy=(y-CAM.y)*k;
  ctx.fillStyle='#fff';for(const [px,py] of ESSO.pumps){ctx.fillStyle='#bdbdbd';ctx.fillRect(px-14,py-26,28,52);ctx.fillStyle='#e53935';ctx.fillRect(px-7,py-12,14,24);ctx.fillStyle='#fff';ctx.fillRect(px-5,py-8,10,6);}
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=2;ctx.setLineDash([10,8]);for(const dx of [-90,-30,30]){ctx.beginPath();ctx.moveTo(x+dx,y-45);ctx.lineTo(x+dx,y+45);ctx.stroke();}ctx.setLineDash([]);
  // overkapping (licht doorschijnend zodat je de pompen en auto's eronder ziet)
  ctx.save();ctx.translate(ox,oy);ctx.globalAlpha=.82;ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x-72,y-28,150,84);ctx.fillStyle='#f7f7f7';ctx.fillRect(x-78,y-38,150,84);ctx.fillStyle='#e53935';ctx.fillRect(x-78,y-38,150,7);ctx.fillStyle='#0d47a1';ctx.fillRect(x-78,y+39,150,7);ctx.globalAlpha=1;
  ctx.fillStyle='#fff';ctx.strokeStyle='#e53935';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x-3,y+4,30,14,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#0d47a1';ctx.font='900 italic 16px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Esso',x-3,y+5);ctx.restore();
  // prijspaal
  const sx=ESSO.x+130,sy=ESSO.y+70;ctx.fillStyle='#555';ctx.fillRect(sx-2,sy-2,4,4);const kk=.0022*60,px2=sx+(sx-CAM.x)*kk,py2=sy+(sy-CAM.y)*kk;ctx.strokeStyle='#777';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(px2,py2);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(px2-18,py2-26,36,42);ctx.fillStyle='#e53935';ctx.fillRect(px2-18,py2-26,36,10);ctx.fillStyle='#0d47a1';ctx.font='900 7px Inter';ctx.textAlign='center';ctx.fillText('Esso',px2,py2-20);ctx.fillStyle='#111';ctx.font='700 7px Inter';ctx.fillText('E10 2,05',px2,py2-6);ctx.fillText('DSL 1,79',px2,py2+5);}
// ---- tennis (FPV-minispel) en voetbal bij Zandweg
const TN={on:false};let TENNIS=null;
function wb3Init(){const sp=WD.wbspot||{};const pt=(WD.pitch||[]).find(p=>p.s==='tennis');if(pt){const c=centroid(pt.p.slice(0,-1));TENNIS={x:c[0],y:c[1]};LANDMARKS.push({n:'Tennisvereniging Waardenburg',x:c[0],y:c[1]});}else if(sp.tennis){TENNIS={x:sp.tennis[0],y:sp.tennis[1]};}
  const so=(WD.pitch||[]).filter(p=>p.s==='soccer');if(so.length){const c=centroid(so[0].p.slice(0,-1));LANDMARKS.push({n:'v.v. WNC',x:c[0],y:c[1]});}
  if(sp.kwast){let best=null,bd=1e9;for(const b of BUILDINGS){if(!b.wb||b.sign||b.wbc)continue;const d=Math.hypot(b.cx-sp.kwast[0],b.cy-sp.kwast[1]);if(d<bd){bd=d;best=b;}}if(best&&bd<300)addSign(best,'Snackbar De Kwast','Restaurant','Weerdenborch 93, Waardenburg');}
  if(sp.dorpshuis){let best=null,bd=1e9;for(const b of BUILDINGS){if(!b.wb||b.wbc)continue;const d=Math.hypot(b.cx-sp.dorpshuis[0],b.cy-sp.dorpshuis[1]);if(d<bd){bd=d;best=b;}}if(best&&bd<300){best.sign='Dorpshuis De Koeldert';best.signC=['#2e7d32','#fff'];best.sa=nearestRoadDir(best.cx,best.cy);best.dorp=1;LANDMARKS.push({n:'Dorpshuis De Koeldert',x:best.cx,y:best.cy});}}
  houseLoad();}
FOOD['Snackbar De Kwast']={p:4,hp:40,t:'Frietje bij De Kwast',e:'🍟',say:'Friet speciaal met een frikandel!'};
function tennisNear(){return TENNIS&&!P.car&&Math.hypot(P.x-TENNIS.x,P.y-TENNIS.y)<220;}
function dorpNear(){if(P.car)return false;for(const b of BUILDINGS){if(!b.dorp)continue;if(ptPolyD(P.x,P.y,b.p)<34)return true;}return false;}
function tnStart(){if(TN.on)return;TN.on=true;TN.px=0;TN.ox=0;TN.b=null;TN.sc=[0,0];TN.gm=[0,0];TN.srv=1;TN.msg='Tik om op te slaan';TN.swing=0;TN.t=0;let ov=document.getElementById('tnOv');if(!ov){ov=document.createElement('canvas');ov.id='tnOv';ov.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:60;touch-action:none';document.body.appendChild(ov);
    ov.addEventListener('pointerdown',e=>{e.preventDefault();TN.drag=e.clientX;TN.dpx=TN.px;TN.tap=performance.now();if(!TN.b)tnServe();});ov.addEventListener('pointermove',e=>{if(TN.drag==null)return;TN.px=clamp(TN.dpx+(e.clientX-TN.drag)/CW*10,-5,5);});ov.addEventListener('pointerup',e=>{if(TN.drag!=null&&Math.abs(e.clientX-TN.drag)<12)TN.swing=14;TN.drag=null;});
    window.addEventListener('keydown',e=>{if(!TN.on)return;if(e.code==='Space'){TN.swing=14;if(!TN.b)tnServe();}if(e.code==='Escape')tnEnd();});}
  ov.style.display='block';paused=true;try{radio.pause();}catch(e){}tnLoop();}
function tnServe(){if(TN.srv){TN.b={x:TN.px,y:.5,z:2.4,vx:rr(-.03,.03),vy:.32,vz:.02,bounce:0,last:'me'};sfx('throw');}else{TN.b={x:TN.ox,y:23.5,z:2.4,vx:rr(-.05,.05),vy:-.3,vz:.02,bounce:0,last:'op'};}TN.msg='';}
function tnPoint(me){TN.sc[me?0:1]++;TN.b=null;sfx(me?'reward':'slap');const [a,b]=TN.sc;if((a>=4||b>=4)&&Math.abs(a-b)>=2){TN.gm[a>b?0:1]++;TN.sc=[0,0];TN.srv=1-TN.srv;}
  if(TN.gm[0]>=2||TN.gm[1]>=2){const win=TN.gm[0]>=2;TN.msg=win?'GEWONNEN! +€30':'VERLOREN…';TN.done=90;if(win){addMoney(30);addXP(70);}}else TN.msg=me?'Punt voor jou!':'Punt voor de tegenstander';setTimeout(()=>{if(TN.on&&!TN.b&&!TN.srv&&!TN.done)tnServe();},1200);}
function tnEnd(){TN.on=false;const ov=document.getElementById('tnOv');if(ov)ov.style.display='none';paused=false;if(AU.on)musicPlay();}
function tnLoop(){if(!TN.on)return;requestAnimationFrame(tnLoop);const ov=document.getElementById('tnOv');if(ov.width!==Math.round(CW*DPR)){ov.width=Math.round(CW*DPR);ov.height=Math.round(CH*DPR);}const g=ov.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);TN.t++;
  if(TN.done&&--TN.done<=0){tnEnd();return;}if(TN.swing>0)TN.swing--;
  const b=TN.b;if(b){b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;b.vz-=.012;if(b.z<=0){b.z=0;b.vz=-b.vz*.72;b.bounce++;if(Math.abs(b.x)>4.2||b.y<-.5&&b.bounce===1&&b.last==='op'&&false){}
      if(b.bounce===1){const inP=Math.abs(b.x)<=4.12&&b.y>=0&&b.y<=23.8;if(!inP){tnPoint(b.last==='op');return;}}if(b.bounce>=2){tnPoint(b.last==='me');return;}}
    if(b.y>11.8&&b.y<12.1&&b.z<.9&&Math.abs(b.vy)>0){tnPoint(b.last==='op');return;}
    // jij slaat
    if(b.vy<0&&b.y<1.6&&b.y>-1.2&&Math.abs(b.x-TN.px)<1.4&&b.z<2.6&&TN.swing>0){const aim=clamp((TN.px-b.x)*1.6+(Math.random()-.5),-3.4,3.4);b.vy=rr(.33,.4);b.vz=rr(.1,.14);b.vx=(aim-b.x)/((23-b.y)/b.vy);b.bounce=0;b.last='me';TN.swing=0;sfx('throw');}
    else if(b.vy<0&&b.y<-1.6){tnPoint(false);return;}
    // tegenstander
    TN.ox+=clamp(b.x-TN.ox,-.09,.09);if(b.vy>0&&b.y>22.2&&Math.abs(b.x-TN.ox)<1.3&&b.z<2.6){if(Math.random()<.82){const aim=rr(-3.6,3.6);b.vy=-rr(.3,.38);b.vz=rr(.1,.14);b.vx=(aim-b.x)/((b.y-.5)/-b.vy);b.bounce=0;b.last='op';sfx('throw');}}
    else if(b.vy>0&&b.y>25.5){tnPoint(true);return;}}
  else TN.ox+=(0-TN.ox)*.05;
  // tekenen: baan in perspectief
  const hz=CH*.3,F=CH*1.25,pr=(x,y,z)=>{const d=y+11;return[CW/2+(x-TN.px*.6)/d*F,hz+(3-z)/d*F];};
  g.fillStyle='#4a8a3a';g.fillRect(0,0,CW,CH);const sk=g.createLinearGradient(0,0,0,hz);sk.addColorStop(0,'#7ec0ee');sk.addColorStop(1,'#cfe9ff');g.fillStyle=sk;g.fillRect(0,0,CW,hz);g.fillStyle='#2f6b2a';g.fillRect(0,hz-26,CW,26);
  const poly=(pts,c)=>{g.beginPath();pts.forEach((p,i)=>{const q=pr(p[0],p[1],0);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.closePath();g.fillStyle=c;g.fill();};
  poly([[-6,-3],[6,-3],[6,27],[-6,27]],'#b5562f');g.strokeStyle='#f4efe6';g.lineWidth=2;const ln=(a,b2)=>{const p=pr(a[0],a[1],0),q=pr(b2[0],b2[1],0);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();};
  for(const xx of [-5.48,-4.12,4.12,5.48])ln([xx,0],[xx,23.8]);ln([-5.48,0],[5.48,0]);ln([-5.48,23.8],[5.48,23.8]);ln([-4.12,5.5],[4.12,5.5]);ln([-4.12,18.3],[4.12,18.3]);ln([0,5.5],[0,18.3]);
  const n1=pr(-6.4,11.9,0),n2=pr(6.4,11.9,0),n3=pr(6.4,11.9,.95),n4=pr(-6.4,11.9,.95);g.fillStyle='rgba(20,20,20,.55)';g.beginPath();g.moveTo(n1[0],n1[1]);g.lineTo(n2[0],n2[1]);g.lineTo(n3[0],n3[1]);g.lineTo(n4[0],n4[1]);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(n4[0],n4[1]);g.lineTo(n3[0],n3[1]);g.stroke();
  const person=(x,y,col,sw)=>{const p=pr(x,y,0),q=pr(x,y,1.8),h=p[1]-q[1],w=h*.35;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(p[0],p[1],w*.7,w*.2,0,0,TAU);g.fill();g.fillStyle='#fff';g.fillRect(p[0]-w*.35,q[1]+h*.55,w*.7,h*.45);g.fillStyle=col;g.fillRect(p[0]-w*.45,q[1]+h*.22,w*.9,h*.38);g.fillStyle='#e0b48f';g.beginPath();g.arc(p[0],q[1]+h*.12,w*.28,0,TAU);g.fill();g.strokeStyle='#333';g.lineWidth=Math.max(1,w*.1);g.beginPath();g.moveTo(p[0]+w*.45,q[1]+h*.35);g.lineTo(p[0]+w*(sw?1.3:.9),q[1]+h*(sw?.15:.55));g.stroke();g.strokeStyle='#ffd166';g.beginPath();g.arc(p[0]+w*(sw?1.45:1),q[1]+h*(sw?.05:.62),w*.22,0,TAU);g.stroke();};
  person(TN.ox,24.3,'#e53935',false);
  if(b){const s=pr(b.x,b.y,0),q=pr(b.x,b.y,b.z),r=Math.max(2,10/(b.y+6)*F*.012);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(s[0],s[1],r,r*.4,0,0,TAU);g.fill();g.fillStyle='#e6ff4a';g.beginPath();g.arc(q[0],q[1],r,0,TAU);g.fill();}
  person(TN.px,-.6,P.ch?P.ch.c:'#36d1ff',TN.swing>0);
  const sn=['0','15','30','40','AD'];ctx=g;txt(`JIJ ${TN.gm[0]}  ·  ${TN.gm[1]} TEGENSTANDER`,CW/2,uiTop().top+62,18,'#fff','center');txt(`${sn[Math.min(4,TN.sc[0])]} - ${sn[Math.min(4,TN.sc[1])]}`,CW/2,uiTop().top+88,16,'#ffd166','center','Inter, sans-serif');
  if(TN.msg)txt(TN.msg,CW/2,CH*.55,22,'#fff','center');txt(IS_TOUCH?'Sleep om te bewegen · tik om te slaan':'Muis slepen = bewegen · Spatie = slaan · Esc = stoppen',CW/2,CH-18,12,'rgba(255,255,255,.85)','center','Inter, sans-serif');
  g.fillStyle='rgba(20,10,30,.8)';rrect(g,CW-110,uiTop().top+6,96,34,10);g.fill();txt('✕ STOP',CW-62,uiTop().top+16,14,'#fff','center','Inter, sans-serif');ctx=wctx;
  if(!TN.stopH){TN.stopH=1;ov.addEventListener('pointerdown',e=>{const r=ov.getBoundingClientRect();if(e.clientX-r.left>CW-110&&e.clientY-r.top<uiTop().top+44)tnEnd();});}}
// ---- huizen kopen (gedeeld online via api.php; in de claude.ai-versie via je aanwezigheid)
const HS={};let MYH=(()=>{try{return JSON.parse(lsGet('gtb_myhouses')||'{}')||{};}catch(e){return {};}})();
const HOUSEK=new Set(['house','yes','residential','detached','semidetached_house','terrace','apartments','bungalow']);
function housePrice(b){const m2=polyArea(b.p)/81;return Math.max(100,Math.round(100*Math.pow(Math.max(1,m2)/60,1.25)/10)*10);}
function houseOk(b){return b.oid&&!b.sign&&!b.label&&!b.wbc&&!b.molen&&!b.dorp&&HOUSEK.has(b.kind)&&polyArea(b.p)>=1500;}
function houseNear(){if(P.car)return null;let best=null,bd=30;for(const b of BUILDINGS){if(P.x<b.bb[0]-40||P.x>b.bb[2]+40||P.y<b.bb[1]-40||P.y>b.bb[3]+40)continue;if(!houseOk(b))continue;const d=ptPolyD(P.x,P.y,b.p);if(d<bd){bd=d;best=b;}}return best;}
function houseLoad(){for(const k in MYH)HS[k]={p:pvpPub(),o:netName(),t:MYH[k]};if(NET.http)houseFetch();}
function houseFetch(){fetch('api.php?a=houses',{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j&&j.houses){for(const h of j.houses)HS[h.oid]={p:h.pid,o:h.nm,t:h.name};}}).catch(()=>{});}
setInterval(()=>{if(NET.http)houseFetch();if(NET.room){for(const p of netOthers()){const s=p.presence;if(Array.isArray(s.hs))for(const h of s.hs)if(h&&h[0]&&!MYH[h[0]])HS[h[0]]={p:s.pid,o:s.nm,t:String(h[1]||'').slice(0,24)};}}},4000);
function houseAct(b){const h=HS[b.oid];if(h&&h.p===pvpPub())return{k:'thuis',b,t:'🏠 '+(h.t||'Thuis')+': uitrusten (volle health)',btn:'🏠<br>RUST'};if(h)return{k:'huisvan',b,t:'🏠 '+(h.t||'Huis')+' · van '+h.o,btn:'',off:1};const pr=housePrice(b);return{k:'huis',b,pr,t:`🏠 Dit huis kopen (€${pr})`,btn:`🏠<br>€${pr}`};}
function houseBuy(b){const pr=housePrice(b);if(HS[b.oid]){noteAdd('AL VERKOCHT','Iemand anders was je net voor','#ff6b6b',160);return;}if(P.money<pr){noteAdd('TE WEINIG GELD','Dit huis kost €'+pr,'#ff6b6b',160,'huisgeld');return;}
  const done=()=>{addMoney(-pr);sfx('kassa');HS[b.oid]={p:pvpPub(),o:netName(),t:'Mijn huis'};MYH[b.oid]='Mijn huis';lsSet('gtb_myhouses',JSON.stringify(MYH));addXP(80);houseName(b);};
  if(NET.http){fetch('api.php?a=buy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:netPid(),pid:pvpPub(),nm:netName(),oid:String(b.oid),name:'Mijn huis'})}).then(r=>r.json()).then(j=>{if(j&&j.ok)done();else{noteAdd('AL VERKOCHT','Dit huis is net door iemand anders gekocht','#ff6b6b',180);houseFetch();}}).catch(()=>done());}else done();}
function houseName(b){let d=document.getElementById('hnDlg');if(!d){d=document.createElement('div');d.id='hnDlg';d.innerHTML='<div class="hnBox"><b>🏠 GEEF JE HUIS EEN NAAM</b><input maxlength="24" placeholder="Bijv. Villa Bommel"><div class="hnOk">OPSLAAN</div></div>';document.body.appendChild(d);}
  const inp=d.querySelector('input');inp.value='';d.style.display='flex';paused=true;setTimeout(()=>inp.focus(),50);inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')ok();};
  const ok=()=>{const t=inp.value.replace(/[<>]/g,'').trim().slice(0,24)||'Mijn huis';d.style.display='none';paused=false;inp.blur();HS[b.oid].t=t;MYH[b.oid]=t;lsSet('gtb_myhouses',JSON.stringify(MYH));noteAdd('HUIS GEKOCHT!','"'+t+'" is nu van jou. Iedereen ziet de naam op het dak.','#7dff6a',260);
    if(NET.http)fetch('api.php?a=hname',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:netPid(),oid:String(b.oid),name:t})}).catch(()=>{});};d.querySelector('.hnOk').onclick=ok;}
function houseTag(b,x,y){const h=HS[b.oid];if(!h)return;const mine=h.p===pvpPub(),t='🏠 '+(h.t||'Huis');ctx.font='800 15px Inter, sans-serif';const w=Math.max(ctx.measureText(t).width,ctx.measureText(h.o||'').width*.8)+18;ctx.fillStyle=mine?'rgba(255,209,102,.96)':'rgba(30,20,50,.9)';rrect(ctx,x-w/2,y-19,w,38,8);ctx.fill();ctx.fillStyle=mine?'#2a1a00':'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y-6);ctx.font='700 12px Inter, sans-serif';ctx.fillStyle=mine?'#5a3a00':'#c7b8ff';ctx.fillText(h.o||'',x,y+10);}
