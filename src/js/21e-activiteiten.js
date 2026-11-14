// ====================== vrije activiteiten (zoals in GTA, geen missies) ======================
// Zwerver met 'spul', fietsen stelen uit de rekken, winkels overvallen, bier bij Café Henkie en daarna
// wildplassen, eten (friet, ijs, Máxima) en de huisarts voor nieuwe health.
const ACT={cur:null,zw:null,racks:[],hintA:0,lowWarn:0};
P.drunk=0;P.bladder=0;P.bladP=0;P.high=0;P.peeT=0;
const FOOD={'Marktzicht Friet':{p:3,hp:35,t:'Patatje oorlog',e:'🍟',say:'Patatje oorlog, lekker vet!'},'IJssalon Hygge':{p:2,hp:15,t:'IJsje',e:'🍦',say:'Aardbei met slagroom!'},'Máxima':{p:12,hp:70,t:'Eten bij Máxima',e:'🌮',say:'Burrito en een biefstuk, smullen!'}};
const ZW_SAY=['Psst… wil je wat spul?','Heb je een euro voor me?','Bommel is mijn huiskamer, vriend.','Niet zeggen tegen de wouten, hè.','Ik ken iedereen hier. Iedereen!'];
function ptPolyD(x,y,p){let m=1e9;for(let i=0,j=p.length-1;i<p.length;j=i++){const A=p[j],B=p[i],dx=B[0]-A[0],dy=B[1]-A[1],t=clamp(((x-A[0])*dx+(y-A[1])*dy)/(dx*dx+dy*dy||1),0,1);m=Math.min(m,Math.hypot(x-A[0]-t*dx,y-A[1]-t*dy));}return m;}
function walkNear(x,y,r0,r1,cl){for(let r=r0;r<=r1;r+=8)for(let k=0;k<24;k++){const a=k/24*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r,t=cellAt(px,py);if((t===WALK||t===PLAZA)&&(!cl||[0,1,2,3,4,5,6,7].every(j=>cellAt(px+Math.cos(j*.785)*cl,py+Math.sin(j*.785)*cl)!==BUILD)))return[px,py];}return null;}
function initActs(){
  // zwerver bij de Waterpoort-kant van de Markt (onder de luifel van het stadhuis)
  const sh=LANDMARKS.find(l=>l.n==='Stadhuis')||LANDMARKS.find(l=>l.n==='Waterpoort');if(sh){const q=walkNear(sh.x,sh.y,60,300,44);if(q)ACT.zw={x:q[0],y:q[1],a:rr(0,TAU),cd:0,talk:0};}
  // fietsenrekken bij een deel van de winkels
  SHOPS.forEach((s,i)=>{if(i%2)return;const q=walkNear(s.b.cx,s.b.cy,40,170,24);if(!q)return;if(ACT.racks.some(r=>Math.hypot(r.x-q[0],r.y-q[1])<160))return;ACT.racks.push({x:q[0],y:q[1],a:nearestRoadDir(q[0],q[1]),c:null,cd:0});});
}
function nearShop(){let best=null,bd=34;for(const s of SHOPS){const b=s.b;if(P.x<b.bb[0]-40||P.x>b.bb[2]+40||P.y<b.bb[1]-40||P.y>b.bb[3]+40)continue;const d=ptPolyD(P.x,P.y,b.p);if(d<bd){bd=d;best=s;}}return best;}
function actFind(){
  if(P.car||P.dead||CLUB.on||MG.on||P.peeT>0||swimming())return null;
  if(P.bladder>=100)return{k:'pee',t:'Wildplassen (je moet nodig!)',btn:'💦<br>PLAS'};
  const z=ACT.zw;if(z&&Math.hypot(P.x-z.x,P.y-z.y)<46)return{k:'zw',t:P.high>0?'De zwerver: "Rustig aan, maat"':'Spul kopen bij de zwerver (€5)',btn:'💊<br>€5',off:P.high>0};
  const s=nearShop();
  if(s){if(s.n==='Café Henkie')return null;
    if(s.n==='Huisarts')return{k:'doc',s,t:P.hp>=P.maxhp?'Huisarts: je bent kerngezond':'Naar de dokter: volle health (€2)',btn:'🩺<br>€2',off:P.hp>=P.maxhp};
    const f=FOOD[s.n];if(f)return{k:'eat',s,f,t:`${f.t} (€${f.p})`,btn:`${f.e}<br>€${f.p}`};
    if(s.c==='Winkel')return s.rob>0?{k:'robbed',s,t:`${s.n}: de kassa is nog leeg`,btn:'',off:1}:{k:'rob',s,t:`${s.n} overvallen!`,btn:'🔫<br>OVERVAL'};}
  if(P.bladder>=60)return{k:'pee',t:'Wildplassen',btn:'💦<br>PLAS'};
  return null;}
function actTry(){const a=ACT.cur;if(!a)return false;if(a.off)return true;
  if(a.k==='zw'){if(P.money<5){say(ACT.zw,'Geen geld, geen spul.');sfx('blip');return true;}addMoney(-5);P.high=60*45;say(ACT.zw,'Niet alles tegelijk, hè!');sfx('whoosh');msg('ZO… DAT IS STERK SPUL','Alles kleurt en je rent harder','#c77dff',170);if(copNear(320))addHeat(1.1);return true;}
  if(a.k==='doc'){if(P.money<2){msg('GEEN GELD','Een consult kost €2','#ff6b6b',110);return true;}addMoney(-2);P.hp=P.maxhp;P.high=0;P.drunk=Math.max(0,P.drunk-2);sfx('reward');msg('WEER HELEMAAL FIT','De huisarts plakt je weer aan elkaar','#7dff6a',140);for(let i=0;i<14;i++)parts.push({x:P.x,y:P.y,vx:rr(-1.5,1.5),vy:rr(-2,-.4),l:40,ml:40,s:1,k:'h'});return true;}
  if(a.k==='eat'){const f=a.f;if(P.money<f.p){msg('GEEN GELD','Dat kost €'+f.p,'#ff6b6b',110);return true;}addMoney(-f.p);P.hp=Math.min(P.maxhp,P.hp+f.hp);sfx('mmm');popTxt(P.x,P.y-30,'+'+f.hp+' health','#7dff6a',1.1);msg(f.t.toUpperCase(),f.say,'#ffd166',120);return true;}
  if(a.k==='rob'){const v=Math.round(rr(35,140));a.s.rob=60*240;addMoney(v);addHeat(2.3);sfx('kassa');sfx('bell');camHit(6);msg('OVERVAL!',`€${v} uit de kassa van ${a.s.n}. De politie komt eraan!`,'#ff4d4d',170);
    for(const p of peds)if(p.state!=='down'&&p.kind!=='cop'&&Math.hypot(p.x-P.x,p.y-P.y)<200)say(p,rpick(['Help! Overval!','Bel de politie!','Ik heb je gezien hoor!']));return true;}
  if(a.k==='pee'){P.peeT=150;P.peeX=P.x;P.peeY=P.y;sfx('splash');return true;}
  return false;}
function buyBeer(){if(P.money<2){msg('GEEN GELD','Een biertje kost €2','#ff6b6b',110);return;}addMoney(-2);P.drunk=Math.min(8,P.drunk+1);P.bladP+=34;sfx('kassa');
  const l=['PROOST!','NOG EENTJE!','GEZELLIG!','HUP, ADTJE!','IK BEN NIET DRONKEN!','WAAR IS DE WC?'];msg(l[Math.min(l.length-1,P.drunk-1)],P.drunk>=4?'De vloer begint te bewegen…':'Lekker koud biertje','#ffd166',110);}
function actStep(){
  for(const s of SHOPS)if(s.rob>0)s.rob--;
  // drank, plasnood en spul
  if(P.bladP>0){const d=Math.min(P.bladP,.06);P.bladP-=d;P.bladder+=d;}
  if(P.drunk>0&&frameN%(60*35)===0)P.drunk=Math.max(0,P.drunk-1);
  if(P.bladder>=145&&P.peeT<=0&&!CLUB.on){P.bladder=0;P.bladP=0;decals.push({x:P.x,y:P.y,r:13,c:'rgba(225,205,60,.55)'});hurt(5);msg('OEPS… BROEK NAT!','Had je maar eerder moeten wildplassen','#ffd166',170);for(const p of peds)if(p.state!=='down'&&Math.hypot(p.x-P.x,p.y-P.y)<180)say(p,rpick(['Haha, kijk die broek!','Gatver!','Pampers nodig?']));}
  if(P.high>0){P.high--;const h=(frameN*1.6)%360;if(frameN%3===0||P.high===0)cv.style.filter=P.high>0?`hue-rotate(${h|0}deg) saturate(${1.5+Math.sin(frameN*.05)*.4})`:'';if(P.high===0){cv.style.filter='';msg('HET SPUL IS UITGEWERKT','Je voelt je een beetje brak','#c77dff',130);hurt(6);}}
  // wildplassen
  if(P.peeT>0){P.peeT--;P.x=P.peeX;P.y=P.peeY;P.moving=false;const fx=Math.cos(P.a),fy=Math.sin(P.a);if(frameN%2===0)parts.push({x:P.x+fx*8,y:P.y+fy*8,vx:fx*rr(1.2,2)+rr(-.2,.2),vy:fy*rr(1.2,2)+rr(-.2,.2),l:14,ml:14,s:1.4,k:'y'});
    if(P.peeT===110){if(copNear(280)){addHeat(1.2);msg('BOETE! WILDPLASSEN','De politie heeft je gezien','#4d8dff',150);}else for(const p of peds)if(p.state!=='down'&&p.kind!=='cop'&&Math.hypot(p.x-P.x,p.y-P.y)<150){say(p,rpick(['Gadverdamme!','Doe normaal, man!','Dat is mijn voordeur!']));break;}}
    if(P.peeT===0){P.bladder=0;P.bladP=0;decals.push({x:P.x+Math.cos(P.a)*20,y:P.y+Math.sin(P.a)*20,r:12,c:'rgba(225,205,60,.5)'});msg('AAAH…','Dat lucht op','#7dff6a',100);}}
  // fietsenrekken vullen
  if(frameN%30===0)for(const r of ACT.racks){const d=Math.hypot(r.x-P.x,r.y-P.y);if(r.c&&(r.c.dead||!cars.includes(r.c)||Math.hypot(r.c.x-r.x,r.c.y-r.y)>60)){r.c=null;r.cd=60*90;}
    if(r.cd>0)r.cd-=30;if(!r.c&&r.cd<=0&&d<900&&d>220){const c=makeCar('fiets',r.x,r.y,r.a+Math.PI/2,null);c.rack=r;r.c=c;cars.push(c);}}
  // zwerver
  const z=ACT.zw;if(z){if(z.talk>0)z.talk--;if(z.talkCd>0)z.talkCd--;const d=Math.hypot(P.x-z.x,P.y-z.y);if(d<130&&z.talk<=0&&!P.car){say(z,rpick(ZW_SAY));z.talk=60*9;}}
  // bijna dood: wijs de huisarts aan
  if(ACT.lowWarn>0)ACT.lowWarn--;if(P.hp>0&&P.hp<P.maxhp*.25&&ACT.lowWarn<=0&&!P.dead&&!CLUB.on){ACT.lowWarn=60*40;msg('BIJNA DOOD!','Ga naar de huisarts in de Gasthuisstraat (€2)','#ff6b6b',190);}
  ACT.cur=actFind();
}
function stoleBike(c){if(c.type!=='fiets')return;msg('FIETS GEJAT!','Trappen maar','#ffd166',90);for(const p of peds)if(p.state!=='down'&&p.kind!=='cop'&&Math.hypot(p.x-c.x,p.y-c.y)<140){say(p,rpick(['Hé! Mijn fiets!','Fietsendief!','Die staat niet op slot hoor… o wacht.']));addHeat(.6);break;}}
function drawActs(){
  const z=ACT.zw;
  for(const r of ACT.racks){if(Math.abs(r.x-CAM.x)>1400||Math.abs(r.y-CAM.y)>1400)continue;ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.a);ctx.strokeStyle='#8a9198';ctx.lineWidth=2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*7,-11);ctx.lineTo(i*7,11);ctx.stroke();}ctx.restore();}
  if(z&&Math.abs(z.x-CAM.x)<1400&&Math.abs(z.y-CAM.y)<1400){ctx.save();ctx.translate(z.x,z.y);ctx.scale(1.25,1.25);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(3,3,14,10,0,0,TAU);ctx.fill();
    ctx.fillStyle='#a0814f';ctx.fillRect(-16,-11,30,22);ctx.strokeStyle='#7a5f36';ctx.lineWidth=1;ctx.strokeRect(-16,-11,30,22);// karton
    ctx.fillStyle='#4a3b2a';ctx.beginPath();ctx.ellipse(0,0,8,10,0,0,TAU);ctx.fill();ctx.fillStyle='#5b4a33';ctx.fillRect(-9,4,6,7);ctx.fillRect(3,4,6,7);
    ctx.fillStyle='#c0392b';ctx.beginPath();ctx.arc(0,-3,4.6,0,TAU);ctx.fill();ctx.fillStyle='#d9b38c';ctx.beginPath();ctx.arc(0,-1,3.2,Math.PI*.1,Math.PI*.9);ctx.fill();
    ctx.fillStyle='#ddd';ctx.fillRect(10,8,4,4);// bekertje
    ctx.fillStyle='#e8dcc0';ctx.fillRect(-14,13,20,8);ctx.fillStyle='#222';ctx.font='700 5px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('HONGER',-4,17.3);
    ctx.restore();}
}
function actHint(){if(MG.on||bigMap||CLUB.on)return;ctx=fctx;const a=ACT.cur;ACT.hintA+=((a?1:0)-ACT.hintA)*.2;
  // status: drank / plasnood / spul
  const chips=[];if(P.drunk>0)chips.push(['🍺 '+(P.drunk>=5?'Lam':P.drunk>=3?'Dronken':'Aangeschoten'),'#ffd166']);if(P.bladder>20)chips.push(['🚽 Plasnood '+Math.min(100,P.bladder|0)+'%',P.bladder>=100&&(frameN>>4)%2?'#ff4d4d':'#7fd4ff']);if(P.high>0)chips.push(['🌀 Spul '+Math.ceil(P.high/60)+'s','#c77dff']);
  if(chips.length){ctx.font='800 13px Inter, sans-serif';let w=0;const ws=chips.map(c=>ctx.measureText(c[0]).width+20);w=ws.reduce((s,x)=>s+x,0)+(chips.length-1)*6;let x=CW/2-w/2;const y=uiTop().top+44;
    chips.forEach((c,i)=>{ctx.fillStyle='rgba(12,8,24,.78)';rrect(ctx,x,y,ws[i],26,13);ctx.fill();ctx.strokeStyle=c[1];ctx.lineWidth=1.5;rrect(ctx,x,y,ws[i],26,13);ctx.stroke();ctx.fillStyle=c[1];ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(c[0],x+10,y+13.5);x+=ws[i]+6;});}
  if(ACT.hintA>.02&&(a||ACT.lastT)){if(a)ACT.lastT=a.t+(a.off?'':IS_TOUCH?'':'   [E]');ctx.globalAlpha=ACT.hintA;ctx.font='800 15px Inter, sans-serif';const t=ACT.lastT,w=ctx.measureText(t).width+30,y=CH-118;
    ctx.fillStyle='rgba(12,8,24,.82)';rrect(ctx,CW/2-w/2,y,w,34,17);ctx.fill();ctx.strokeStyle=a&&a.k==='rob'?'#ff4d4d':'#ffd166';ctx.lineWidth=2;rrect(ctx,CW/2-w/2,y,w,34,17);ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,CW/2,y+17.5);ctx.globalAlpha=1;}
  ctx=wctx;}
