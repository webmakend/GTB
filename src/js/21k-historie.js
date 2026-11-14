// ====================== historische route: monumenten, beelden, parken en begraafplaatsen ======================
// Loop naar een 📜-bordje en druk op E: je leest het verhaal en krijgt respect. Alles bezoeken = prestatie.
const HIST=[];
function histPos(x,y){if(cellAt(x,y)!==BUILD)return[x,y];return walkNear(x,y,20,220,0)||snap(x,y);}
function lmk(n){return LANDMARKS.find(l=>l.n===n);}
function poi(n){return (WD.pois||[]).find(p=>p.n===n);}
function initHist(){HIST.length=0;const add=(id,n,p,kind,adr,t)=>{if(!p)return;const q=histPos(p[0],p[1]);HIST.push({id,n,x:q[0],y:q[1],kind,adr,t});};
  const L=n=>{const l=lmk(n);return l?[l.x,l.y]:null;},Pp=n=>{const p=poi(n);return p?[p.x,p.y]:null;},off=(p,dx,dy)=>p?[p[0]+dx,p[1]+dy]:null;
  const gs=ROADS.filter(r=>r.n==='Gasthuisstraat')[0],mk=ROADS.find(r=>r.n==='Markt'),tol=ROADS.filter(r=>r.n==='Tolstraat').sort((a,b)=>b.p.length-a.p.length)[0];
  add('stadhuis','Stadhuis',L('Stadhuis'),'plaquette','Markt','Het stadhuis aan de Markt werd gebouwd in 1760-1763, naar een ontwerp van architect Anthony Viervant uit Arnhem. Al meer dan duizend jaar is de Markt het hart van Bommel.');
  add('kerk','Grote of Sint-Maartenskerk',churchDoor(),'plaquette','Kerkplein 1','Een imposante 15e-eeuwse kerk in Nedergotische stijl. Vanaf de toren heb je in de zomer uitzicht over de hele Bommelerwaard.');
  add('gasthuistoren','Gasthuistoren',off(L('Gasthuiskapel'),-70,40),'plaquette','Gasthuisstraat / Kerkstraat','Het oudste deel van het gasthuis stamt uit de 14e eeuw; ruim honderd jaar later kwam de toren met zijn peervormige bekroning en open lantaarn. Franz Liszt hoorde de klokken in 1842 al vanaf de Waal.');
  add('gasthuiskapel','Gasthuiskapel',L('Gasthuiskapel'),'plaquette','Gasthuisstraat 34','De kapel van het gasthuis (15e eeuw) was later ook slagerij, vleeshal, slaapplaats voor soldaten en zelfs paardrijschool. Nu is het een tentoonstellingsruimte van het Stadskasteel.');
  add('waterpoort','Waterpoort',L('Waterpoort'),'plaquette','Waterstraat','Van de vijf stadspoorten die Bommel ooit had, is de Waterpoort de enige die nog overeind staat.');
  add('stadskasteel','Stadskasteel (Maarten van Rossumhuis)',L('Stadskasteel Zaltbommel'),'plaquette','Nonnenstraat 5-7','Gebouwd in 1535 in opdracht van veldheer Maarten van Rossum, met hoektorentjes en kantelen. Sinds 1937 een museum over de Bommelerwaard.');
  add('philips','Huis van de familie Philips',mk?[mk.p[0][0]*.45+mk.p[1][0]*.55,mk.p[0][1]*.45+mk.p[1][1]*.55]:null,'plaquette','Markt 9','Boven de winkeldeur hangt nog het uithangbord met de eenhoorn. De broers Anton en Gerard Philips werden geboren aan de Tolstraat 15-23 en legden de basis voor het wereldbedrijf Philips.');
  add('tolstraat','Geboortehuis Philips',tol?tol.p[Math.floor(tol.p.length/2)]:null,'plaquette','Tolstraat 15-23','Hier stond het geboortehuis van Anton en Gerard Philips. De familie had al sinds eind 18e eeuw nauwe banden met Zaltbommel.');
  add('marx','Huis van Lion Philips (Karl Marx)',gs?[gs.p[0][0]*.82+gs.p[1][0]*.18,gs.p[0][1]*.82+gs.p[1][1]*.18]:null,'plaquette','Gasthuisstraat 12','Hier woonden Lion Philips en Feijtje Presburg. Hun neef Karl Marx logeerde er in de winter van 1863 enkele maanden en werkte er aan Das Kapital.');
  add('waterjongen','Borstbeeld De Waterjongen',Pp('Borstbeeld De Waterjongen'),'beeld','Waalkade','Aan de Waalkade verbeelden twee beelden de eeuwenoude haat-liefdeverhouding tussen de Bommelerwaard en het water.');
  add('torso','Liggende torso',Pp('Liggende torso'),'beeld','Waalkade','Een kunstwerk langs de Waalkade, met uitzicht op de rivier.');
  add('sintmaarten','Beeld van Sint Maarten',Pp('Sint Maarten'),'beeld','Bossche Poort','Sint Maarten, de beschermheilige van de Grote Kerk en van Bommel.');
  add('markbeeld','De verbeelding van een bewogen historie',Pp('De verbeelding van een bewogen historie'),'beeld','Markt','Een kunstwerk op de Markt over de rijke en woelige geschiedenis van de stad.');
  add('joodsmonument','Joods Monument',Pp('Joods Monument Zaltbommel'),'monument','Bossche Poort','Een monument met de namen van de slachtoffers van de Jodenvervolging uit Zaltbommel, Rossum en Herwijnen. Wit op zwart, zodat we ze nooit vergeten.');
  add('ijskelder','IJskelder',Pp('IJskelder'),'plaquette','Vestingwallen','Een oude ijskelder in de wallen: hier werd vroeger ijs uit de grachten bewaard voor de zomer.');
  if(WTOWER)add('watertoren','Oude Watertoren',[WTOWER.x+48,WTOWER.y+24],'plaquette','Uiterwaarden','Gebouwd in 1904 en tot 1960 voorzag deze bakstenen toren de stad van schoon drinkwater. Nu is het een bijzondere vakantiewoning.');
  if(HISTX.band)add('muziektent','Muziektent en kanon',[HISTX.band.x+40,HISTX.band.y+30],'plaquette','Lage Singelbolwerk','De muziektent staat op een eilandje in het plantsoen op de wallen. Na een brand in 2004 werd hij in 2005 gerestaureerd.');
  if(HISTX.cem)add('begraafplaats','Oude algemene begraafplaats',[HISTX.cem.x-110,HISTX.cem.y+60],'plaquette','Boschstraat (bastion Het Ravelijn)','Aangelegd in 1810 op het bastion Het Ravelijn. Het baarhuisje en het smeedijzeren hek zijn rijksmonument.');
  if(HISTX.jcem)add('joodsebegraafplaats','Joodse begraafplaats',[HISTX.jcem.x-70,HISTX.jcem.y+40],'plaquette','Bossche Poort','In 1823 werd bij de Bossche Poort een Joodse begraafplaats in gebruik genomen; in 1901 volgde er nog een aan de Maarten van Rossumsingel.');
  {let best=null,bd=1e9;for(const q of FORT){const d=Math.hypot(q[0]-2200,q[1]-5600);if(d<bd){bd=d;best=q;}}if(best){const c=centroid(FORT),dx=c[0]-best[0],dy=c[1]-best[1],l=Math.hypot(dx,dy);add('vesting','Vestingwallen',[best[0]+dx/l*140,best[1]+dy/l*140],'plaquette','Singels','Bommel telt maar liefst zeven bastions, aangelegd rond 1600 met een brede buitengracht. Bij de ontmanteling in 1843 werden de wallen omgevormd tot plantsoenen en singels.');}}
  ACH.historie=['Geschiedkundige','Alle '+HIST.length+' historische plekken bezocht'];ACH.historie5=['Rondleiding','5 historische plekken bezocht'];
}
function histNear(){for(const h of HIST)if(Math.hypot(P.x-h.x,P.y-h.y)<44)return h;return null;}
function histRead(h){missionBanner(h.n.toUpperCase()+(h.adr?'  ·  '+h.adr:''),h.t,'#f0d58a',460);sfx('organ');
  if(!PRG.hist.includes(h.id)){PRG.hist.push(h.id);PRG.dirty=true;addXP(25);const n=PRG.hist.length;setTimeout(()=>msg('HISTORISCHE PLEK '+n+'/'+HIST.length,'','#f0d58a',120),1200);if(n>=5)unlock('historie5');if(n>=HIST.length)unlock('historie');}}
function drawHist(){const t=frameN*.06;
  // begraafplaatsen
  for(const key of ['cem','jcem']){const c=HISTX[key];if(!c||Math.abs(c.x-CAM.x)>1500||Math.abs(c.y-CAM.y)>1500)continue;const x0=c.x-c.w/2,y0=c.y-c.h/2;
    ctx.fillStyle='#3f6b35';ctx.fillRect(x0,y0,c.w,c.h);ctx.fillStyle='#c9b98f';ctx.fillRect(c.x-5,y0,10,c.h);ctx.fillRect(x0,c.y-4,c.w,8);
    let rs=key==='cem'?17:31;const rn=()=>((rs=(rs*16807)%2147483647)/2147483647);
    for(let gy=y0+12;gy<y0+c.h-10;gy+=18)for(let gx=x0+10;gx<x0+c.w-10;gx+=16){if(Math.abs(gx-c.x)<14||Math.abs(gy-c.y)<12)continue;if(rn()<.18)continue;
      ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(gx+2,gy+2,9,5);ctx.fillStyle=key==='jcem'?'#b8b2a6':['#9e9e9e','#bdbdbd','#8d8d8d','#c7c2b6'][(rn()*4)|0];ctx.fillRect(gx,gy,9,5);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(gx,gy,9,1.5);}
    ctx.strokeStyle='#1d1d1d';ctx.lineWidth=2;ctx.strokeRect(x0,y0,c.w,c.h);ctx.fillStyle='#1d1d1d';for(let x=x0;x<=x0+c.w;x+=8){ctx.fillRect(x-1,y0-2,2,4);ctx.fillRect(x-1,y0+c.h-2,2,4);}for(let y=y0;y<=y0+c.h;y+=8){ctx.fillRect(x0-2,y-1,4,2);ctx.fillRect(x0+c.w-2,y-1,4,2);}
    ctx.fillStyle='#2e4f26';for(const [dx,dy] of [[-c.w/2+8,-c.h/2+8],[c.w/2-8,-c.h/2+8],[-c.w/2+8,c.h/2-8],[c.w/2-8,c.h/2-8]]){ctx.beginPath();ctx.arc(c.x+dx,c.y+dy,7,0,TAU);ctx.fill();}}
  // muziektent met kanon
  const b=HISTX.band;if(b&&Math.abs(b.x-CAM.x)<1500&&Math.abs(b.y-CAM.y)<1500){const f=.0016*36,ox=(b.x-CAM.x)*f,oy=(b.y-CAM.y)*f;
    ctx.fillStyle='rgba(120,170,210,.7)';ctx.beginPath();ctx.arc(b.x,b.y,52,0,TAU);ctx.fill();ctx.fillStyle='#4f7d3f';ctx.beginPath();ctx.arc(b.x,b.y,40,0,TAU);ctx.fill();
    ctx.fillStyle='#d9d2c3';ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.lineTo(b.x+Math.cos(a)*24,b.y+Math.sin(a)*24);}ctx.closePath();ctx.fill();
    ctx.strokeStyle='#f5f5f5';ctx.lineWidth=2;for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.beginPath();ctx.moveTo(b.x+Math.cos(a)*22,b.y+Math.sin(a)*22);ctx.lineTo(b.x+ox+Math.cos(a)*22,b.y+oy+Math.sin(a)*22);ctx.stroke();}
    ctx.fillStyle='#2e6b4a';ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.lineTo(b.x+ox*1.05+Math.cos(a)*27,b.y+oy*1.05+Math.sin(a)*27);}ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;for(let i=0;i<8;i++){const a=i/8*TAU+.39;ctx.beginPath();ctx.moveTo(b.x+ox*1.05+Math.cos(a)*27,b.y+oy*1.05+Math.sin(a)*27);ctx.lineTo(b.x+ox*1.3,b.y+oy*1.3);ctx.stroke();}
    ctx.fillStyle='#d8b54a';ctx.beginPath();ctx.arc(b.x+ox*1.3,b.y+oy*1.3,2.5,0,TAU);ctx.fill();
    const cx2=b.x+70,cy2=b.y-30;ctx.fillStyle='#5d4037';ctx.beginPath();ctx.arc(cx2-6,cy2+5,5,0,TAU);ctx.arc(cx2+6,cy2+5,5,0,TAU);ctx.fill();ctx.fillStyle='#263238';ctx.save();ctx.translate(cx2,cy2);ctx.rotate(-.5);ctx.fillRect(-4,-4,26,8);ctx.beginPath();ctx.arc(-4,0,6,0,TAU);ctx.fill();ctx.restore();}
  // bordjes en beelden
  for(const h of HIST){if(Math.abs(h.x-CAM.x)>1300||Math.abs(h.y-CAM.y)>1300)continue;const seen=PRG.hist.includes(h.id);
    if(h.kind==='beeld'||h.kind==='monument'){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(h.x-6,h.y-2,16,12);ctx.fillStyle='#9e9890';ctx.fillRect(h.x-8,h.y-8,16,16);ctx.fillStyle=h.kind==='monument'?'#222':'#5d6b4a';if(h.kind==='monument')ctx.fillRect(h.x-6,h.y-6,12,12);else{ctx.beginPath();ctx.arc(h.x+2,h.y-6,5,0,TAU);ctx.fill();ctx.fillRect(h.x-2,h.y-3,8,9);}}
    else{ctx.fillStyle='#5d4037';ctx.fillRect(h.x-1,h.y-14,2,14);ctx.fillStyle='#1a4fa3';ctx.fillRect(h.x-9,h.y-24,18,12);ctx.fillStyle='#fff';ctx.font='900 9px Georgia, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('i',h.x,h.y-18);}
    if(!seen){const bob=Math.sin(t+h.x)*3;ctx.save();ctx.globalCompositeOperation='lighter';glow(h.x,h.y-36+bob,20,'rgba(240,213,138,.5)');ctx.restore();ctx.font='15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('📜',h.x,h.y-36+bob);}}}
function histMinimap(mp,cxm,cym,S){for(const h of HIST){if(PRG.hist.includes(h.id))continue;const [x,y]=mp(h.x,h.y);if(Math.hypot(x-cxm,y-cym)>S/2-5)continue;ctx.fillStyle='#f0d58a';ctx.fillRect(x-2.5,y-2.5,5,5);ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(x-2.5,y-2.5,5,5);}}
function histBigMap(mp){for(const h of HIST){const [x,y]=mp(h.x,h.y),seen=PRG.hist.includes(h.id);ctx.fillStyle=seen?'rgba(240,213,138,.45)':'#f0d58a';ctx.fillRect(x-4,y-4,8,8);ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(x-4,y-4,8,8);}}
