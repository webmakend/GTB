// ====================== meldingen: één lijst links op het scherm ======================
// msg() en missionBanner() komen in de wereld niet meer midden in beeld, maar als kaartjes in een lijst links.
// (In de club en in first-person-scènes blijven ze zoals ze waren.)
const NOTES=[];let HUDY=0;
function noteAdd(t,b,col,life,key){if(!t&&!b)return;if(key){const o=NOTES.find(n=>n.key===key);if(o){o.t=t;o.b=b||'';o.col=col||o.col;o.life=Math.max(o.life,life||150);o.ml=o.life;return;}}
  const dup=NOTES.find(n=>n.t===t&&n.b===(b||''));if(dup){dup.life=dup.ml=Math.max(dup.ml,life||150);return;}
  NOTES.unshift({t:String(t||''),b:String(b||''),col:col||'#ffd166',life:life||150,ml:life||150,key,age:0});if(NOTES.length>8)NOTES.length=8;}
const _msg0=msg,_ban0=missionBanner;
msg=function(t,sub,col,life){if(MODE==='play'&&!CLUB.on&&!(typeof FPV!=='undefined'&&FPV.on)&&!MG.on){noteAdd(t,sub,col,Math.max(life||150,170));return;}_msg0(t,sub,col,life);};
missionBanner=function(title,text,col,life){if(MODE==='play'&&!CLUB.on&&!(typeof FPV!=='undefined'&&FPV.on)&&!MG.on){noteAdd(title,text,col,Math.max(life||330,330));sfx('reward');buzz(25);return;}_ban0(title,text,col,life);};
function drawNotes(){if(MG.on||bigMap)return;ctx=fctx;const U=clamp(Math.min(CW,CH)/560,.75,1.15),x=14,w=Math.min(CW<640?CW*.6:330*U,340),maxY=CH-(IS_TOUCH?250:70);let y=Math.max(HUDY,uiTop().top+120);
  // statusregels (drank, plasnood, spul, energie)
  const st=[];if(P.drunk>0)st.push(['🍺 '+(P.drunk>=5?'Lam':P.drunk>=3?'Dronken':'Aangeschoten'),'#ffd166']);if(P.bladder+P.bladP>=20)st.push(['🚽 Plasnood '+Math.min(100,P.bladder|0)+'%'+(IS_TOUCH?'':' · E'),P.bladder>=100&&(frameN>>4)%2?'#ff4d4d':'#7fd4ff']);if(P.high>0)st.push(['🌀 Spul '+Math.ceil(P.high/60)+'s','#c77dff']);if(P.boost>0)st.push(['⚡ Energie '+Math.ceil(P.boost/60)+'s','#36d1ff']);
  if(PRG.combo>0&&PRG.comboT>0)st.push(['✖ Combo ×'+(1+PRG.combo),'#c77dff']);
  ctx.font=`800 ${12*U}px Inter, sans-serif`;let cx=x;for(const [s,c] of st){const sw=ctx.measureText(s).width+18*U;if(cx+sw>x+w){cx=x;y+=26*U;}ctx.fillStyle='rgba(12,8,24,.8)';rrect(ctx,cx,y,sw,22*U,11*U);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=1.5;rrect(ctx,cx,y,sw,22*U,11*U);ctx.stroke();ctx.fillStyle=c;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(s,cx+9*U,y+11.5*U);cx+=sw+6*U;}
  if(st.length)y+=30*U;
  for(let i=0;i<NOTES.length;i++){const n=NOTES[i];n.age++;n.life--;if(n.life<=0){NOTES.splice(i--,1);continue;}
    ctx.font=`800 ${12.5*U}px Inter, sans-serif`;const ls=n.b?wrapLines(n.b,w-26*U).slice(0,4):[],h=(ls.length?30+ls.length*15:28)*U;if(y+h>maxY)break;
    const a=clamp(Math.min(n.life/30,n.age/8),0,1),slide=(1-Math.min(1,n.age/10))*-40;ctx.globalAlpha=a;
    ctx.fillStyle='rgba(12,6,26,.86)';rrect(ctx,x+slide,y,w,h,10*U);ctx.fill();ctx.fillStyle=n.col;rrect(ctx,x+slide,y,5*U,h,3);ctx.fill();
    ctx.font=`${14.5*U}px Anton, Impact, sans-serif`;let t=n.t;while(t.length>4&&ctx.measureText(t).width>w-22*U)t=t.slice(0,-2);if(t!==n.t)t+='…';ctx.fillStyle=n.col;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(t,x+slide+13*U,y+6*U);
    ctx.font=`600 ${12*U}px Inter, sans-serif`;ctx.fillStyle='#fff';ls.forEach((l,j)=>ctx.fillText(l,x+slide+13*U,y+(26+j*15)*U));ctx.globalAlpha=1;y+=h+6*U;}ctx=wctx;}
