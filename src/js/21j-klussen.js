// ====================== klussen: extra missies, verspreid over de stad (herhaalbaar) ======================
// Loop naar een gekleurd klus-icoon en druk op E. De straatrace start je door er met een auto in te rijden.
const JOBX={advocaat:false};
const JOB={cur:null,t:0,T:0,tgt:null,i:0,d:{},cd:0,list:[]};
function shopDoor(n){const s=SHOPS.find(s=>s.n===n);if(!s)return null;return walkNear(s.b.cx,s.b.cy,30,220,12);}
function randWalk(fx,fy,dmin,dmax){for(let i=0;i<400;i++){const a=rr(0,TAU),d=rr(dmin,dmax),x=fx+Math.cos(a)*d,y=fy+Math.sin(a)*d,t=cellAt(x,y);if((t===WALK||t===PLAZA)&&pip(x,y,FORT))return[x,y];}return snap(fx+dmin,fy);}
function roadMid(n,k){const rs=ROADS.filter(r=>r.n===n);if(!rs.length)return null;const r=rs.reduce((a,b)=>a.p.length>=b.p.length?a:b),p=r.p[Math.floor((r.p.length-1)*(k==null?.5:k))];return[p[0],p[1]];}
const JOBDEF=[
 {id:'pizza',n:'Pizzakoerier',ic:'🍕',col:'#ff7043',giver:()=>shopDoor('Perla di Cairo'),desc:'Bezorg een pizza voordat hij koud is',
  start(){const g=this.g;JOB.tgt=randWalk(g[0],g[1],900,1700);JOB.T=Math.round(Math.hypot(JOB.tgt[0]-g[0],JOB.tgt[1]-g[1])/1.9+900);return 'Bezorg de pizza op het aangegeven adres. Snel, voor de fooi!';},
  step(){if(near(JOB.tgt,40)){const pay=15+PRG.lvl*2,tip=JOB.t<JOB.T*.5?10:0;jobWin(pay+tip,50,tip?'Pizza warm afgeleverd + €'+tip+' fooi!':'Pizza afgeleverd.');}}},
 {id:'oma',n:'Boodschappen voor oma',ic:'👵',col:'#f48fb1',giver:()=>shopDoor("Oma's Winkeltje"),desc:'Haal boodschappen bij de Albert Heijn en advocaat bij Gall & Gall',
  start(){JOB.i=0;JOB.tgt=shopDoor('Albert Heijn');JOB.T=60*240;return 'Oma heeft boodschappen nodig. Eerst naar de Albert Heijn aan de Steenweg.';},
  step(){if(!JOB.tgt||!near(JOB.tgt,40))return;if(JOB.i===0){if(P.money<6){if(frameN%120===0)msg('GEEN GELD','Boodschappen kosten €6','#ff6b6b',100);return;}addMoney(-6);sfx('kassa');JOB.i=1;JOB.tgt=shopDoor('Gall & Gall');jobText('Nu nog een fles advocaat bij Gall & Gall (naast de AH).');}
    else if(JOB.i===1){if(P.money<9){if(frameN%120===0)msg('GEEN GELD','Advocaat kost €9','#ff6b6b',100);return;}addMoney(-9);sfx('kassa');JOB.i=2;JOB.tgt=this.g;jobText("Breng alles terug naar oma bij Oma's Winkeltje.");}
    else jobWin(60,80,'Oma is dolblij en geeft je een dikke zoen. Én geld.');}},
 {id:'race',n:'Straatrace',ic:'🏁',col:'#ffd166',car:1,giver:()=>{const m=ROADS.find(r=>r.n==='Markt');return m?[m.p[0][0]*.7+m.p[1][0]*.3,m.p[0][1]*.7+m.p[1][1]*.3]:null;},desc:'Rij met een auto in het icoon. Haal alle checkpoints op tijd',
  start(){const pts=[roadMid('Waterstraat',.6),roadMid('Waalkade',.5),roadMid('Oliestraat',.5),roadMid('Boschstraat',.35),roadMid('Gamerschestraat',.7),this.g].filter(Boolean);JOB.d.cps=pts;JOB.i=0;JOB.tgt=pts[0];let L=0,a=this.g;for(const q of pts){L+=Math.hypot(q[0]-a[0],q[1]-a[1]);a=q;}JOB.T=Math.round(L/4.4+240);JOB.d.cnt=180;return 'Rij door alle checkpoints en eindig weer op de Markt!';},
  step(){if(JOB.d.cnt>0){JOB.d.cnt--;if(JOB.d.cnt%60===0&&JOB.d.cnt>0){msg(String(JOB.d.cnt/60),'','#ffd166',40);sfx('blip');}if(JOB.d.cnt===0){msg('GO!','','#7dff6a',60);sfx('sting');}JOB.t=0;return;}
    if(near(JOB.tgt,70)){JOB.i++;sfx('reward');if(JOB.i>=JOB.d.cps.length){PRG.races++;unlock('race');jobWin(80+PRG.lvl*5,120,'Je bent de snelste van Bommel!');}else{JOB.tgt=JOB.d.cps[JOB.i];popTxt(me().x,me().y-30,'CHECKPOINT '+JOB.i+'/'+JOB.d.cps.length,'#ffd166',1.2);}}}},
 {id:'vlucht',n:'De grote ontsnapping',ic:'🚨',col:'#4d8dff',giver:()=>shopDoor('Dubai Barbershop'),desc:'De kapper heeft de politie op je afgestuurd. Schud ze binnen 30 seconden af!',
  start(){addHeat(3.3);JOB.tgt=null;JOB.T=60*30;return 'Drie sterren! Schud de politie binnen 30 seconden af.';},
  step(){if(JOB.t>90&&stars===0)jobWin(70,90,'Spoorloos verdwenen. De kapper betaalt je.');}},
 {id:'schat',n:'De schat van Maarten',ic:'🗝️',col:'#f0d58a',giver:()=>shopDoor('Stadskasteel'),desc:'Volg de raadsels van Maarten van Rossum door de stad',
  start(){const wp=LANDMARKS.find(l=>l.n==='Waterpoort'),gk=LANDMARKS.find(l=>l.n==='Gasthuiskapel');JOB.d.cps=[wp&&snap(wp.x,wp.y),gk&&snap(gk.x,gk.y),churchDoor(),WTOWER&&walkNear(WTOWER.x,WTOWER.y,45,120,10),this.g].filter(Boolean);
    JOB.d.rid=['"Waar de rivier de stad binnenkwam, ligt mijn eerste aanwijzing." (de Waterpoort)','"Waar zieken eens werden verpleegd, bid ik verder." (de Gasthuiskapel)','"Onder de hoogste toren van Bommel." (de Sint-Maartenskerk)','"Waar het water hoog werd bewaard." (de oude watertoren)','"Keer terug naar mijn huis, de schat ligt in de kelder." (het Stadskasteel)'];
    JOB.i=0;JOB.tgt=JOB.d.cps[0];JOB.T=0;return JOB.d.rid[0];},
  step(){if(near(JOB.tgt,40)){JOB.i++;sfx('organ');if(JOB.i>=JOB.d.cps.length){const first=!PRG.ach.includes('schat');unlock('schat');jobWin(first?150:50,first?200:60,first?'Een kist vol oude munten! De schat is van jou.':'Weer een paar muntjes gevonden.');}else{JOB.tgt=JOB.d.cps[JOB.i];jobText(JOB.d.rid[JOB.i]);}}}},
 {id:'pistool',n:'Het gerucht',ic:'❓',col:'#c77dff',giver:()=>ACT.zw?[ACT.zw.x+30,ACT.zw.y+30]:null,avail:()=>!P.inv.includes('pistol'),desc:'De zwerver weet iets over een verloren pistool',
  start(){JOB.tgt=WTOWER?WTOWER.gun.slice():null;JOB.d.zone=1;JOB.T=0;return 'Zwerver: "In het park bij de oude watertoren ligt iets dat glinstert. Zoek goed!"';},
  step(){if(P.inv.includes('pistol'))jobWin(0,40,'Gevonden. Wees er voorzichtig mee…');}},
 {id:'schiet',n:'Flessen schieten',ic:'🎯',col:'#7dff6a',giver:()=>WTOWER?walkNear(WTOWER.x+120,WTOWER.y+60,0,200,8)||[WTOWER.x+120,WTOWER.y+60]:null,avail:()=>P.gun,desc:'Schiet alle flessen in het park om binnen 35 seconden',
  start(){TARGETS=[];for(let i=0;i<8;i++){const a=i/8*TAU+rr(-.2,.2),d=rr(90,180);TARGETS.push({x:WTOWER.x+Math.cos(a)*d,y:WTOWER.y+Math.sin(a)*d,hit:0});}if(P.inv.includes('pistol')){P.wid='pistol';syncWpn();}JOB.tgt=null;JOB.T=60*35;return 'Schiet alle 8 flessen om (Spatie / actieknop).';},
  step(){const left=TARGETS.filter(t=>!t.hit).length;JOB.d.left=left;if(left===0){TARGETS=[];unlock('schutter');jobWin(50,80,'Alle flessen aan gruzelementen!');}},end(){TARGETS=[];}}
];
function near(p,r){if(!p)return false;const o=me();return Math.hypot(o.x-p[0],o.y-p[1])<r;}
function initJobs(){for(const j of JOBDEF){j.g=j.giver();}}
function jobsAvail(){return JOBDEF.filter(j=>j.g&&(!j.avail||j.avail()));}
function jobText(t){JOB.txt=t;missionBanner(JOB.cur.n.toUpperCase(),t,JOB.cur.col,240);}
function startJob(j){if(JOB.cur)return;JOB.cur=j;JOB.t=0;JOB.T=0;JOB.i=0;JOB.d={};JOB.tgt=null;const t=j.start();JOB.txt=t;missionBanner('KLUS: '+j.n.toUpperCase(),t,j.col,300);sfx('sting');}
function jobEnd(){const j=JOB.cur;if(j&&j.end)j.end();JOB.cur=null;JOB.tgt=null;JOB.cd=120;}
function jobWin(cash,xp,t){const j=JOB.cur;if(cash){P.money+=cash;P.moneyF=20;}sfx('reward');missionBanner('KLUS GESLAAGD: '+j.n.toUpperCase(),t+(cash?`  Beloning: €${cash}.`:''),'#7dff6a',300);PRG.jobs++;PRG.dirty=true;if(PRG.jobs>=3)unlock('klus3');jobEnd();setTimeout(()=>addXP(xp),300);}
function jobFail(t){const j=JOB.cur;sfx('slap');missionBanner('KLUS MISLUKT: '+j.n.toUpperCase(),t,'#ff4d4d',240);jobEnd();}
function jobStep(){if(JOB.cd>0)JOB.cd--;
  if(!JOB.cur){// straatrace starten door er met een auto in te rijden
    const r=JOBDEF.find(j=>j.id==='race');if(r&&r.g&&P.car&&!P.car.t.bike&&JOB.cd<=0&&near(r.g,46))startJob(r);return;}
  JOB.t++;if(P.dead){jobFail('Dat ging mis…');return;}
  if(JOB.cur.car&&!P.car&&JOB.d.cnt<=0&&JOB.t>60){jobFail('Je bent uit de auto gestapt.');return;}
  if(JOB.T>0&&JOB.t>JOB.T){jobFail('De tijd is om!');return;}
  JOB.cur.step();}
function jobAct(){if(JOB.cur||JOB.cd>0||P.car)return null;for(const j of jobsAvail()){if(!near(j.g,34))continue;if(j.car)return{k:'jobcar',t:j.ic+' '+j.n+': kom terug met een auto',btn:'',off:1};return{k:'job',j,t:j.ic+' Klus: '+j.n+' · '+j.desc,btn:'▶<br>KLUS'};}return null;}
function drawJobsWorld(){const t=frameN*.08;
  if(!JOB.cur)for(const j of jobsAvail()){const [x,y]=j.g;if(Math.abs(x-CAM.x)>1300||Math.abs(y-CAM.y)>1300)continue;const pu=1+.12*Math.sin(t+x);
    ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,40*pu,j.col+'66');ctx.restore();ctx.strokeStyle=j.col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,17*pu,0,TAU);ctx.stroke();
    ctx.fillStyle='rgba(10,4,24,.85)';ctx.beginPath();ctx.arc(x,y-30-4*Math.sin(t*1.3),13,0,TAU);ctx.fill();ctx.font='15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(j.ic,x,y-29-4*Math.sin(t*1.3));}
  if(JOB.cur&&JOB.tgt){const [x,y]=JOB.tgt,pu=1+.25*Math.sin(frameN*.12),c=JOB.cur.col;ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,50*pu,'rgba(54,209,255,.5)');ctx.restore();ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,24*pu,0,TAU);ctx.stroke();
    const by=y-38-6*Math.sin(frameN*.1);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,by+14);ctx.lineTo(x-10,by);ctx.lineTo(x+10,by);ctx.closePath();ctx.fill();}
  if(JOB.cur&&JOB.cur.id==='pistool'&&WTOWER){ctx.strokeStyle='rgba(199,125,255,.6)';ctx.setLineDash([10,8]);ctx.lineWidth=3;ctx.beginPath();ctx.arc(WTOWER.x,WTOWER.y,240,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
function jobHud(){if(!JOB.cur||MG.on)return;ctx=fctx;const j=JOB.cur,U=clamp(Math.min(CW,CH)/560,.75,1.2),w=Math.min(CW<640?CW*.6:330*U,340),x=14,y=HUDY;
  let tl='';if(JOB.T>0){const s=Math.max(0,Math.ceil((JOB.T-JOB.t)/60));tl=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
  const extra=j.id==='schiet'?' · nog '+(JOB.d.left!=null?JOB.d.left:8)+' flessen':j.id==='race'&&JOB.d.cps?' · checkpoint '+Math.min(JOB.i+1,JOB.d.cps.length)+'/'+JOB.d.cps.length:'';
  if(JOB.tgt){const Z0=viewZ(),sx=CW/2+(JOB.tgt[0]-camX)*Z0,sy=CH/2+(JOB.tgt[1]-camY)*Z0,mg=34;if(sx<mg||sx>CW-mg||sy<mg+60||sy>CH-mg){const a=Math.atan2(sy-CH/2,sx-CW/2),ex=clamp(CW/2+Math.cos(a)*CW,mg,CW-mg),ey=clamp(CH/2+Math.sin(a)*CH,mg+60,CH-mg-(IS_TOUCH?260:0));
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=j.col;ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-3,0);ctx.lineTo(-8,11);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
  ctx=wctx;}
function jobMinimap(mp,cxm,cym,S){const dot=(p,c,r)=>{let [x,y]=mp(p[0],p[1]);const dx=x-cxm,dy=y-cym,dd=Math.hypot(dx,dy);if(dd>S/2-7){if(r<5)return;x=cxm+dx/dd*(S/2-7);y=cym+dy/dd*(S/2-7);}ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.2;ctx.stroke();};
  if(JOB.cur){if(JOB.tgt)dot(JOB.tgt,JOB.cur.col,5.5);}else for(const j of jobsAvail())dot(j.g,j.col,3.6);}
function jobBigMap(mp,fs){if(JOB.cur){if(JOB.tgt){const [x,y]=mp(JOB.tgt[0],JOB.tgt[1]);ctx.strokeStyle=JOB.cur.col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,9+3*Math.sin(frameN*.15),0,TAU);ctx.stroke();}return;}
  for(const j of jobsAvail()){const [x,y]=mp(j.g[0],j.g[1]);ctx.fillStyle='rgba(10,4,24,.85)';ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();ctx.strokeStyle=j.col;ctx.lineWidth=2;ctx.stroke();ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(j.ic,x,y+1);}}
