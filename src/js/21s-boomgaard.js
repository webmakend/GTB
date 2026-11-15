// ====================== Waardenburg: appelboomgaarden met rijen bomen, boeren die plukken, kistjes en een trekker ======================
const ORCH=(WD.orchard||[]).map(p=>{const q=p.slice();q.bb=bbox(q);let best=0,ang=0;for(let i=0;i<q.length-1;i++){const a=q[i],b=q[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(l>best){best=l;ang=Math.atan2(b[1]-a[1],b[0]-a[0]);}}q.ang=ang;q.area=polyArea(q);return q;});
const APPLE=[],FARMERS=[],CRATES=[];let TRACTOR=null;
function inOrchard(x,y){for(const o of ORCH)if(x>o.bb[0]&&x<o.bb[2]&&y>o.bb[1]&&y<o.bb[3]&&pip(x,y,o))return o;return null;}
function buildOrchards(){let sd=99;const rn=()=>((sd=(sd*16807)%2147483647)/2147483647);
  for(const o of ORCH){const ca=Math.cos(o.ang),sa=Math.sin(o.ang),c=centroid(o),R=Math.hypot(o.bb[2]-o.bb[0],o.bb[3]-o.bb[1])/2+40;o.rows=[];
    for(let v=-R;v<=R;v+=46){const row=[];for(let u=-R;u<=R;u+=30){const x=c[0]+u*ca-v*sa,y=c[1]+u*sa+v*ca;if(!pip(x,y,o))continue;if(cellAt(x,y)===ROAD||cellAt(x,y)===BUILD)continue;
        const t={x,y,r:10+rn()*3,ap:[]};const na=3+(rn()*5|0);for(let k=0;k<na;k++){const a=rn()*TAU,d=rn()*t.r*.8;t.ap.push([Math.cos(a)*d,Math.sin(a)*d,rn()<.2?'#d9c23a':rn()<.5?'#c62828':'#e53935']);}APPLE.push(t);row.push(t);}
      if(row.length>3)o.rows.push(row);}
    // kistjes aan het eind van een paar rijen
    for(let i=0;i<o.rows.length;i+=3){const r=o.rows[i],e=r[r.length-1];CRATES.push({x:e.x+ca*24,y:e.y+sa*24,a:o.ang,n:1+(rn()*3|0)});}}
  // boeren in de grootste boomgaarden
  const big=ORCH.filter(o=>o.rows&&o.rows.length>2).sort((a,b)=>b.area-a.area).slice(0,6);
  const SK=['#f1c27d','#e0ac69','#c68642','#ffdbac'],SH=['#2e5a88','#6b4f2a','#3a6b35','#8a2f2f','#4a4a4a'];
  big.forEach((o,k)=>{for(let j=0;j<(k<2?3:2);j++){const row=o.rows[(j*5+k)%o.rows.length];FARMERS.push({o,row,i:(rn()*row.length)|0,dir:rn()<.5?1:-1,x:row[0].x,y:row[0].y,a:o.ang,anim:0,pick:0,state:'walk',talkCd:0,col:SH[(k+j)%SH.length],skin:SK[(k*2+j)%SK.length],crate:0});}});
  if(big[0]){const o=big[0],r=o.rows[0],e=r[0];TRACTOR={x:e.x-Math.cos(o.ang)*60,y:e.y-Math.sin(o.ang)*60,a:o.ang};}}
const SAY_FARM=['Goeiemorgen!','Mooie Elstars dit jaar.','Niet zomaar aan mijn appels zitten hè!','Wil je een kistje? Vijf euro.','Plukken, plukken, plukken...','Pas op voor de ladder!','De Jonagolds zijn bijna rijp.','Hier in Waardenburg hebben we de lekkerste appels.'];
function orchardStep(){if(APPLE_CD>0)APPLE_CD--;if(!FARMERS.length)return;const o2=me();
  for(const f of FARMERS){if(Math.abs(f.x-o2.x)>1600||Math.abs(f.y-o2.y)>1600)continue;f.talkCd--;
    if(f.state==='pick'){f.pick--;f.anim+=.2;if(f.pick<=0){f.state='walk';f.crate=Math.min(6,f.crate+1);}}
    else{const t=f.row[f.i],dx=t.x-f.x,dy=t.y+14-f.y,d=Math.hypot(dx,dy);if(d<2){if(Math.random()<.5){f.state='pick';f.pick=90+Math.random()*120;}f.i+=f.dir;if(f.i<0||f.i>=f.row.length){f.dir*=-1;f.i+=2*f.dir;f.i=clamp(f.i,0,f.row.length-1);}}
      else{f.x+=dx/d*.55;f.y+=dy/d*.55;f.a=Math.atan2(dy,dx);f.anim+=.18;}}
    const pd=Math.hypot(f.x-o2.x,f.y-o2.y);if(pd<120&&f.talkCd<=0&&Math.random()<.01){bubbles=bubbles.filter(b=>b.p!==f);bubbles.push({p:f,t:rpick(SAY_FARM),life:200,keep:1});f.talkCd=500;}}}
function drawOrchardGround(g,ox,oy,X1,Y1){for(const o of ORCH){if(!inBox(o.bb,ox,oy,X1,Y1,30))continue;g.save();pathPoly(g,o);g.closePath();g.fillStyle='#7aa356';g.fill();g.clip();
    // gemaaide grasstroken tussen de rijen
    const ca=Math.cos(o.ang),sa=Math.sin(o.ang);g.strokeStyle='rgba(60,90,40,.35)';g.lineWidth=18;for(const r of o.rows){g.beginPath();g.moveTo(r[0].x-ca*30,r[0].y-sa*30);g.lineTo(r[r.length-1].x+ca*30,r[r.length-1].y+sa*30);g.stroke();}g.restore();}
  for(const t of APPLE){if(t.x<ox-20||t.x>X1+20||t.y<oy-20||t.y>Y1+20)continue;g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.arc(t.x+5,t.y+4,t.r,0,TAU);g.fill();
    g.fillStyle='#3f6e2c';g.beginPath();g.arc(t.x,t.y,t.r,0,TAU);g.fill();g.fillStyle='#4f8336';g.beginPath();g.arc(t.x-t.r*.25,t.y-t.r*.25,t.r*.6,0,TAU);g.fill();
    for(const a of t.ap){g.fillStyle=a[2];g.beginPath();g.arc(t.x+a[0],t.y+a[1],2,0,TAU);g.fill();}}
  for(const c of CRATES){if(c.x<ox-30||c.x>X1+30||c.y<oy-30||c.y>Y1+30)continue;for(let k=0;k<c.n;k++){const x=c.x+Math.cos(c.a+1.57)*k*13,y=c.y+Math.sin(c.a+1.57)*k*13;g.save();g.translate(x,y);g.rotate(c.a);g.fillStyle='#a5763f';g.fillRect(-7,-5,14,10);g.fillStyle='#c62828';for(let a=0;a<5;a++){g.beginPath();g.arc(-4+a*2,-1+(a%2)*2,1.8,0,TAU);g.fill();}g.strokeStyle='#6d4b25';g.lineWidth=1;g.strokeRect(-7,-5,14,10);g.restore();}}}
function drawOrchardLife(){if(TRACTOR&&Math.abs(TRACTOR.x-CAM.x)<1400&&Math.abs(TRACTOR.y-CAM.y)<1400){const t=TRACTOR;ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.a);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-15,-9,34,22);
    ctx.fillStyle='#1b1b1b';ctx.fillRect(-14,-13,12,6);ctx.fillRect(-14,7,12,6);ctx.fillRect(8,-11,7,4);ctx.fillRect(8,7,7,4);ctx.fillStyle='#2e7d32';ctx.fillRect(-12,-8,30,16);ctx.fillStyle='#43a047';ctx.fillRect(4,-6,14,12);ctx.fillStyle='#cfe8ff';ctx.fillRect(-10,-6,10,12);ctx.fillStyle='#e0e0e0';ctx.fillRect(18,-2,3,4);ctx.restore();}
  for(const f of FARMERS){if(Math.abs(f.x-CAM.x)>1300||Math.abs(f.y-CAM.y)>1300)continue;
    drawPed({x:f.x,y:f.y,a:f.state==='pick'?f.a-1.57:f.a,anim:f.anim,col:f.col,hair:'#6b4a2a',skin:f.skin,state:f.state==='walk'?'walk':'idle',kind:'p',wet:0},false);
    ctx.fillStyle='#e8c96a';ctx.beginPath();ctx.arc(f.x,f.y-1,7.5,0,TAU);ctx.fill();ctx.fillStyle='#c9a64a';ctx.beginPath();ctx.arc(f.x,f.y-1,4,0,TAU);ctx.fill();
    if(f.state==='pick'){ctx.fillStyle='#c62828';ctx.beginPath();ctx.arc(f.x+Math.cos(f.a)*9,f.y+Math.sin(f.a)*9-2+Math.sin(f.anim)*2,2.2,0,TAU);ctx.fill();}
    if(f.crate>0){ctx.save();ctx.translate(f.x-Math.cos(f.a)*9,f.y-Math.sin(f.a)*9);ctx.rotate(f.a);ctx.fillStyle='#a5763f';ctx.fillRect(-5,-4,8,8);ctx.fillStyle='#c62828';ctx.fillRect(-3,-2,4,4);ctx.restore();}}}
let APPLE_CD=0;
function applePick(){if(APPLE_CD>0)return;APPLE_CD=35;P.hp=Math.min(P.maxhp,P.hp+5);addMoney(.5);sfx('blip');parts.push({x:P.x,y:P.y-10,vx:0,vy:-1,l:30,ml:30,s:3,k:'f'});popTxt(P.x,P.y-20,'🍎 +5 ♥','#ff6b6b',1);if(typeof voice==='function')voice('appel');
  const near=FARMERS.find(f=>Math.hypot(f.x-P.x,f.y-P.y)<160);if(near&&Math.random()<.35){bubbles=bubbles.filter(b=>b.p!==near);bubbles.push({p:near,t:rpick(['Hé! Dat is mijn appel!','Eén mag, meer niet!','Die zijn voor de veiling!']),life:180});near.talkCd=300;}}
