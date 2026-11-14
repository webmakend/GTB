// ====================== meldingen: één lijst links op het scherm ======================
// msg() en missionBanner() komen in de wereld niet meer midden in beeld, maar als kaartjes in een lijst links.
// (In de club en in first-person-scènes blijven ze zoals ze waren.)
const NOTES=[];let HUDY=0;
function noteAdd(t,b,col,life,key){if(!t&&!b)return;if(key){const o=NOTES.find(n=>n.key===key);if(o){o.t=t;o.b=b||'';o.col=col||o.col;o.life=Math.max(o.life,life||150);o.ml=o.life;return;}}
  const dup=NOTES.find(n=>n.t===t&&n.b===(b||''));if(dup){dup.life=dup.ml=Math.max(dup.ml,life||150);return;}
  NOTES.unshift({t:String(t||''),b:String(b||''),col:col||'#ffd166',life:life||150,ml:life||150,key,age:0});if(NOTES.length>5)NOTES.length=5;}
const _msg0=msg,_ban0=missionBanner;
msg=function(t,sub,col,life){if(MODE==='play'&&!CLUB.on&&!(typeof FPV!=='undefined'&&FPV.on)&&!MG.on){noteAdd(t,sub,col,Math.max(life||150,170));return;}_msg0(t,sub,col,life);};
missionBanner=function(title,text,col,life){if(MODE==='play'&&!CLUB.on&&!(typeof FPV!=='undefined'&&FPV.on)&&!MG.on){if(/^(MISSIE \d|KLUS:)/.test(String(title||''))){sfx('reward');buzz(25);return;}noteAdd(title,text,col,Math.max(life||330,330));sfx('reward');buzz(25);return;}_ban0(title,text,col,life);};
// vaste kaarten (missie, klus, dagbonus, actie) + losse meldingen, alles transparant in één kolom links
function noteCard(x,y,w,lab,right,body,col,a,tap){const U=HUDX.U||1;ctx.font=`700 ${13*U}px Inter, sans-serif`;const ls=body?wrapLines(body,w-24*U).slice(0,3):[],h=(lab?22:8)*U+ls.length*17*U+8*U;
  ctx.globalAlpha=a;ctx.fillStyle='rgba(10,20,18,.5)';rrect(ctx,x,y,w,h,5*U);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=1;rrect(ctx,x,y,w,h,5*U);ctx.stroke();
  if(lab){ctx.font=`800 ${10.5*U}px Inter, sans-serif`;ctx.fillStyle=col;ctx.textAlign='left';ctx.textBaseline='top';let t=lab.toUpperCase().split('').join(String.fromCharCode(8202));while(t.length>6&&ctx.measureText(t).width>w-(right?70:24)*U)t=t.slice(0,-3);ctx.fillText(t,x+12*U,y+9*U);}
  if(right){ctx.font=`800 ${12*U}px Inter, sans-serif`;ctx.fillStyle=col;ctx.textAlign='right';ctx.textBaseline=ls.length&&!lab?'middle':'top';ctx.fillText(right,x+w-12*U,lab?y+8*U:y+h/2);}
  ctx.font=`700 ${13*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='top';ls.forEach((l,j)=>ctx.fillText(l,x+12*U,y+(lab?24:9)*U+j*17*U));ctx.globalAlpha=1;
  if(tap)HUDX.cards.push({x,y,w,h,fn:tap});return h;}
function drawNotes(){HUDX.cards=[];if(MG.on||bigMap)return;ctx=fctx;const U=HUDX.U=clamp(Math.min(CW,CH)/560,.75,1.15),x=14,w=HUDX.listW||Math.min(CW<640?CW*.6:330*U,340),maxY=CH-(IS_TOUCH?250:70),gap=6*U;let y=Math.max(HUDY,uiTop().top+90);
  const add=(lab,r,b,c,tap,a)=>{if(y>maxY)return;y+=noteCard(x,y,w,lab,r,b,c,a==null?1:a,tap)+gap;};
  // missie
  if(MIS.on&&!MIS.done&&!MG.on){const t=(MIS_TXT[MIS.stage]||'MISSIE').replace(/^MISSIE (\d):\s*/,'MISSIE $1 · '),d=Math.round(Math.hypot(MIS.x-me().x,MIS.y-me().y)/9);
    add(HUDX.misOpen?t:t.replace(/ · .*/,'')+' · '+t.split(' · ')[1].split(' ').slice(-2).join(' '),d+' m',HUDX.misOpen?MIS_DO[MIS.stage]:t.split(' · ')[1].replace(/^./,c=>c.toUpperCase()),'#fb923c',()=>{HUDX.misOpen=!HUDX.misOpen;sfx('blip');});}
  // klus
  if(typeof JOB!=='undefined'&&JOB.cur){const j=JOB.cur;let r='';if(JOB.T>0){const s2=Math.max(0,Math.ceil((JOB.T-JOB.t)/60));r=Math.floor(s2/60)+':'+String(s2%60).padStart(2,'0');}else if(JOB.tgt)r=Math.round(Math.hypot(JOB.tgt.x-me().x,JOB.tgt.y-me().y)/9)+' m';add('KLUS · '+j.n,r,JOB.txt||'',j.col||'#36d1ff');}
  // dagbonus (tik om te claimen)
  if(PRG.bonus){add('DAGBONUS · DAG '+PRG.bonus.day,'+€'+PRG.bonus.cash,'Tik om te claimen','#4ade80',()=>progClaim(),.75+.25*Math.sin(frameN*.12));}
  // actie in de buurt (tik = doen)
  if(ACT.cur&&!ACT.cur.off&&!P.dead&&!P.car){const a=ACT.cur;add(a.k==='rob'?'OVERVAL':a.k==='pee'?'PLASNOOD':a.k==='job'?'KLUS':'ACTIE',IS_TOUCH?'TIK':'E',a.k==='pee'?'Tik hier om tegen een muur te plassen':a.t,a.k==='rob'?'#ff4d4d':'#ffd166',()=>{actTry();});}
  // statusregels (drank, plasnood, spul, energie, combo)
  const st=[];if(P.drunk>0)st.push(['🍺 '+(P.drunk>=5?'Lam':P.drunk>=3?'Dronken':'Aangeschoten'),'#ffd166']);if(P.bladder+P.bladP>=20)st.push(['🚽 Plasnood '+Math.min(100,P.bladder|0)+'%',P.bladder>=100&&(frameN>>4)%2?'#ff4d4d':'#7fd4ff']);if(P.high>0)st.push(['🌀 Spul '+Math.ceil(P.high/60)+'s','#c77dff']);if(P.boost>0)st.push(['⚡ Energie '+Math.ceil(P.boost/60)+'s','#36d1ff']);
  if(PRG.combo>0&&PRG.comboT>0)st.push(['✖ Combo ×'+(1+PRG.combo),'#c77dff']);
  if(st.length){ctx.font=`800 ${11.5*U}px Inter, sans-serif`;let cx=x;for(const [s,c] of st){const sw=ctx.measureText(s).width+16*U;if(cx+sw>x+w){cx=x;y+=24*U;}ctx.fillStyle='rgba(10,20,18,.5)';rrect(ctx,cx,y,sw,20*U,5*U);ctx.fill();ctx.fillStyle=c;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(s,cx+8*U,y+10.5*U);cx+=sw+5*U;}y+=20*U+gap;}
  // losse meldingen
  for(let i=0;i<NOTES.length;i++){const n=NOTES[i];n.age++;n.life--;if(n.life<=0){NOTES.splice(i--,1);continue;}if(y>maxY)continue;
    const a=clamp(Math.min(n.life/30,n.age/8),0,1);y+=noteCard(x,y,w,n.t,'',n.b,n.col,a)+gap;}
  ctx=wctx;}
