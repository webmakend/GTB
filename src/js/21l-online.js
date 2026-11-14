// ====================== online: andere spelers live zien + live ranglijst ======================
// Werkt alleen in de gedeelde claude.ai-pagina (capability "room"): iedereen die het spel op dat moment open
// heeft en is ingelogd, ziet elkaar als spook-speler op straat en op de minikaart, plus een live ranglijst.
const NET={room:null,peers:[],last:0,lastSent:'',open:false};
function netName(){const s=typeof getSave==='function'&&getSave();return (s&&s.name)||lsGet('gtb_name')||(P.ch?P.ch.name:'Speler');}
(async()=>{try{if(!window.claude||typeof window.claude.use!=='function')return;const room=await window.claude.use('room');if(!room)return;NET.room=room;
  room.onPeers(ch=>{NET.peers=ch.peers;},()=>{NET.room=null;NET.peers=[];});}catch(e){}})();
function netStep(){if(!NET.room||MODE!=='play')return;const now=performance.now();if(now-NET.last<220)return;NET.last=now;const o=me();
  const st={nm:netName().slice(0,14),ch:P.ch?P.ch.id:'',x:Math.round(o.x),y:Math.round(o.y),a:+(P.car?P.car.a:P.a).toFixed(2),car:P.car?(P.car.t.bike?'b':'c'):'',col:P.car?P.car.col:'',lv:PRG.lvl,xp:PRG.xp,mu:PRG.coins.length,pr:PRG.ach.length,eur:Math.round(P.money),st:stars};
  const k=JSON.stringify(st);if(k===NET.lastSent)return;NET.lastSent=k;NET.room.presence(st).catch(()=>{});}
function netOthers(){return NET.peers.filter(p=>!p.isMe&&p.kind==='viewer'&&p.presence&&typeof p.presence.x==='number');}
function drawNetGhosts(){for(const p of netOthers()){const s=p.presence;if(Math.abs(s.x-CAM.x)>1400||Math.abs(s.y-CAM.y)>1400)continue;const nm=String(s.nm||'Speler').slice(0,14);
  ctx.save();ctx.globalAlpha=.85;ctx.translate(s.x,s.y);ctx.rotate(+s.a||0);
  if(s.car==='c'){ctx.fillStyle='rgba(0,0,0,.3)';rrect(ctx,-19,-8,42,20,5);ctx.fill();ctx.fillStyle=/^#[0-9a-f]{3,6}$/i.test(s.col)?s.col:'#7b2ff7';rrect(ctx,-21,-10,42,20,5);ctx.fill();ctx.fillStyle='rgba(150,210,255,.8)';ctx.fillRect(4,-7,8,14);ctx.fillRect(-14,-7,6,14);}
  else{ctx.fillStyle='#7b2ff7';ctx.beginPath();ctx.ellipse(0,0,5,7,0,0,TAU);ctx.fill();ctx.fillStyle='#e0ac69';ctx.beginPath();ctx.arc(2,0,3.6,0,TAU);ctx.fill();}
  ctx.restore();ctx.font='800 11px Inter, sans-serif';const w=ctx.measureText(nm).width+12;ctx.fillStyle='rgba(123,47,247,.85)';rrect(ctx,s.x-w/2,s.y-34,w,16,8);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(nm+' · LV'+(s.lv|0),s.x,s.y-25.5);}}
function netMinimap(mp,cxm,cym,S){for(const p of netOthers()){let [x,y]=mp(p.presence.x,p.presence.y);const dx=x-cxm,dy=y-cym,dd=Math.hypot(dx,dy);if(dd>S/2-6){x=cxm+dx/dd*(S/2-6);y=cym+dy/dd*(S/2-6);}ctx.fillStyle='#c77dff';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.2;ctx.stroke();}}
function netHud(){if(!NET.room)return;const n=netOthers().length;ctx=fctx;const t=n?`🌐 ${n+1} spelers online · 🏆`:'🌐 alleen online · 🏆';ctx.font='800 11px Inter, sans-serif';const w=ctx.measureText(t).width+18,x=CW-w-12,y=uiTop().top+(MINI_S||120)+52;
  ctx.fillStyle='rgba(12,8,24,.78)';rrect(ctx,x,y,w,22,11);ctx.fill();ctx.strokeStyle='#c77dff';ctx.lineWidth=1.5;rrect(ctx,x,y,w,22,11);ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t,x+9,y+11.5);NET.btn={x,y,w,h:22};ctx=wctx;}
function lbOpen(){let ov=document.getElementById('lbOv');if(!ov){ov=document.createElement('div');ov.id='lbOv';ov.style.cssText='position:fixed;inset:0;z-index:55;display:flex;align-items:center;justify-content:center;background:rgba(8,4,20,.85);font-family:Inter,sans-serif;color:#fff';ov.addEventListener('pointerdown',e=>{if(e.target===ov){e.preventDefault();lbClose();}});document.body.appendChild(ov);}
  NET.open=true;paused=true;lbRender();ov.style.display='flex';}
function lbClose(){NET.open=false;paused=false;const ov=document.getElementById('lbOv');if(ov)ov.style.display='none';}
function lbRender(){const ov=document.getElementById('lbOv');if(!ov||!NET.open)return;const me={nm:netName(),lv:PRG.lvl,xp:PRG.xp,mu:PRG.coins.length,pr:PRG.ach.length,eur:Math.round(P.money),me:1};
  const rows=[me].concat(netOthers().map(p=>({nm:String(p.presence.nm||'Speler').slice(0,14),lv:p.presence.lv|0,xp:p.presence.xp|0,mu:p.presence.mu|0,pr:p.presence.pr|0,eur:p.presence.eur|0,g:p.guest}))).sort((a,b)=>b.xp-a.xp);
  const box=document.createElement('div');box.style.cssText='width:min(92vw,460px);max-height:80vh;overflow:auto;background:#1a0a2c;border:2px solid #c77dff;border-radius:16px;padding:18px';
  const h=document.createElement('div');h.style.cssText='font:400 30px Anton,Impact,sans-serif;color:#ffd166;letter-spacing:1px';h.textContent='🏆 LIVE RANGLIJST';box.appendChild(h);
  const sub=document.createElement('div');sub.style.cssText='font-size:12px;opacity:.8;margin:4px 0 12px';sub.textContent=NET.room?'Iedereen die nu speelt (ververst live). Gerangschikt op respect.':'Live spelen kan alleen in de gedeelde claude.ai-pagina.';box.appendChild(sub);
  rows.forEach((r,i)=>{const d=document.createElement('div');d.style.cssText=`display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;padding:8px 10px;margin:4px 0;border-radius:10px;background:${r.me?'rgba(199,125,255,.25)':'rgba(255,255,255,.06)'}`;
    const a=document.createElement('b');a.textContent=['🥇','🥈','🥉'][i]||String(i+1);const b=document.createElement('div');const nm=document.createElement('b');nm.textContent=r.nm+(r.me?' (jij)':'');const st=document.createElement('div');st.style.cssText='font-size:11px;opacity:.8';st.textContent=`LV ${r.lv} · 🪙 ${r.mu}/25 · 🏆 ${r.pr} · € ${r.eur}`;b.append(nm,st);
    const c=document.createElement('b');c.style.color='#c77dff';c.textContent=r.xp+' RP';d.append(a,b,c);box.appendChild(d);});
  const cl=document.createElement('div');cl.textContent='SLUITEN';cl.style.cssText='margin-top:12px;text-align:center;padding:12px;border-radius:12px;background:#ff2e88;font-weight:800;letter-spacing:1px;cursor:pointer';cl.addEventListener('pointerdown',e=>{e.preventDefault();lbClose();});box.appendChild(cl);
  ov.replaceChildren(box);}
setInterval(()=>{if(NET.open)lbRender();},1500);
window.addEventListener('pointerdown',e=>{const b=NET.btn;if(!b||MODE!=='play'||NET.open||!NET.room)return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(x>=b.x&&x<=b.x+b.w&&y>=b.y-4&&y<=b.y+b.h+4){e.preventDefault();e.stopPropagation();lbOpen();}},true);
window.addEventListener('keydown',e=>{if(MODE==='play'&&e.code==='KeyL'){NET.open?lbClose():lbOpen();}});
