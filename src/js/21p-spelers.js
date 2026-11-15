// ====================== spelerslijst, profiel, laatst online en persoonlijke berichten ======================
// Lijst: compact, scrollt soepel (wordt niet meer elke seconde opnieuw opgebouwd). Tik op een speler voor zijn profiel:
// laatst online, rang en geld, persoonlijk bericht sturen en vriend worden. Op eigen hosting komen berichten ook aan als
// de ander offline is (postvak in api.php); in de claude.ai-versie alleen als hij online is.
const LB={tab:'alle',prof:null,unread:{}};
function jget(k,d){try{return JSON.parse(lsGet(k)||'')||d;}catch(e){return d;}}
function seenStore(){const S=jget('gtb_seen',{}),now=Date.now();let ch=false;for(const p of netOthers()){const s=p.presence;if(!s.pid)continue;S[s.pid]={nm:String(s.nm||'Speler').slice(0,14),lv:s.lv|0,xp:s.xp|0,eur:s.eur|0,ts:now};ch=true;}
  if(ch){const ks=Object.keys(S);if(ks.length>200)ks.sort((a,b)=>S[a].ts-S[b].ts).slice(0,ks.length-200).forEach(k=>delete S[k]);lsSet('gtb_seen',JSON.stringify(S));}}
setInterval(()=>{if(NET.room||NET.http)seenStore();},3000);
function agoTxt(ms){if(!ms)return 'onbekend';const s=Math.max(0,(Date.now()-ms)/1000);if(s<90)return 'net nog';if(s<3600)return Math.round(s/60)+' min geleden';if(s<86400)return Math.round(s/3600)+' uur geleden';const d=Math.round(s/86400);return d===1?'gisteren':d+' dagen geleden';}
// ---- berichten ----
function dmAll(){return jget('gtb_dm',{});}
function dmPush(pub,nm,me,t,ts){const D=dmAll(),c=D[pub]||(D[pub]={nm,m:[]});c.nm=nm||c.nm;c.m.push({me:me?1:0,t,ts});if(c.m.length>40)c.m=c.m.slice(-40);lsSet('gtb_dm',JSON.stringify(D));}
function dmGot(pub,nm,t,ts){dmPush(pub,nm,0,t,ts);if(LB.prof===pub&&NET.open){lbRender(true);return;}LB.unread[pub]={nm,t};sfx('blip');buzz([20,40,20]);}
function dmInbox(list){let mx=+(lsGet('gtb_dmafter')||0);for(const m of list){mx=Math.max(mx,m.id|0);if(m.from===pvpPub())continue;dmGot(m.from,String(m.nm||'Speler').slice(0,14),String(m.t||'').slice(0,200),(m.ts|0)*1000-(NET.srvOff||0));}lsSet('gtb_dmafter',String(mx));}
function dmSend(pub,nm,t){t=String(t||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,200);if(!t||!pub)return false;
  if(NET.http){(NET.dmQ=NET.dmQ||[]).push({to:pub,t});NET.last=0;}else if(NET.room){if(!pvpByPub(pub)){noteAdd('NIET VERSTUURD',nm+' is nu niet online','#ff9f1c',160);return false;}pvpSend('dm',pub,0,t);}else return false;
  dmPush(pub,nm,1,t,Date.now());sfx('blip');return true;}
function dmCards(add){for(const pub in LB.unread){const u=LB.unread[pub];add('✉ PRIVÉ · '+u.nm,IS_TOUCH?'TIK':'',u.t,'#ff2e88',()=>{lbOpen();lbProfile(pub);},1);}}
// ---- lijst ----
function lbRows(){const me={pid:pvpPub(),nm:netName().slice(0,14),lv:PRG.lvl,xp:PRG.xp,eur:Math.round(P.money),on:1,me:1},M=new Map();M.set(me.pid,me);
  const S=jget('gtb_seen',{}),fr=frGet(),off=NET.srvOff||0;
  if(NET.http&&NET.top)for(const r of NET.top){const k=r.pid||('x'+r.id);if(M.has(k))continue;M.set(k,{pid:r.pid||'',nm:String(r.nm||'Speler').slice(0,14),lv:r.lv|0,xp:r.xp|0,eur:r.eur|0,on:!!r.on,seen:r.seen?r.seen*1000-off:0});}
  for(const p of netOthers()){const s=p.presence,k=s.pid||p.peer;const o=M.get(k)||{};M.set(k,Object.assign(o,{pid:s.pid||'',nm:String(s.nm||'Speler').slice(0,14),lv:s.lv|0,xp:Math.max(o.xp|0,s.xp|0),eur:s.eur|0,on:true,seen:Date.now()}));}
  for(const k in S){if(M.has(k))continue;M.set(k,{pid:k,nm:S[k].nm,lv:S[k].lv,xp:S[k].xp,eur:S[k].eur,on:false,seen:S[k].ts});}
  for(const k in fr)if(!M.has(k))M.set(k,{pid:k,nm:fr[k],lv:0,xp:0,eur:0,on:false,seen:(S[k]||{}).ts||0});
  let rows=[...M.values()].sort((a,b)=>b.xp-a.xp);rows.forEach((r,i)=>r.rank=i+1);rows.sort((a,b)=>(b.me?2:b.on?1:0)-(a.me?2:a.on?1:0)||a.rank-b.rank);
  if(LB.tab==='online')rows=rows.filter(r=>r.on);if(LB.tab==='vrienden')rows=rows.filter(r=>r.me||fr[r.pid]);return rows;}
function lbOpen(){let ov=document.getElementById('lbOv');if(!ov){ov=document.createElement('div');ov.id='lbOv';document.body.appendChild(ov);ov.addEventListener('click',e=>{if(e.target===ov){e.preventDefault();lbClose();}});
    ['pointerdown','touchstart','touchmove','wheel'].forEach(t=>ov.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
    ov.innerHTML='<div class="lbBox"><div class="lbHead"><b>🏆 SPELERS</b><span id="lbX">✕</span></div><div class="lbTabs"><span data-t="alle">Alle</span><span data-t="online">Online</span><span data-t="vrienden">Vrienden</span></div><div id="lbList"></div><div id="lbProf"></div></div>';
    ov.querySelector('#lbX').addEventListener('click',e=>{e.preventDefault();lbClose();});
    ov.querySelectorAll('.lbTabs span').forEach(s=>s.addEventListener('click',e=>{e.preventDefault();LB.tab=s.dataset.t;LB.prof=null;lbRender(true);document.getElementById('lbList').scrollTop=0;}));
    ov.querySelector('#lbList').addEventListener('click',e=>{const r=e.target.closest('.lbRow');if(r&&r.dataset.p)lbProfile(r.dataset.p);});}
  NET.open=true;paused=true;LB.prof=null;ov.style.display='flex';lbRender(true);if(NET.http)fetch('api.php?a=top',{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j&&j.top){NET.top=j.top;lbRender();}}).catch(()=>{});}
function lbClose(){NET.open=false;paused=false;LB.prof=null;const ov=document.getElementById('lbOv');if(ov)ov.style.display='none';}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);}
function lbRender(force){const ov=document.getElementById('lbOv');if(!ov||!NET.open)return;ov.querySelectorAll('.lbTabs span').forEach(s=>s.classList.toggle('on',s.dataset.t===LB.tab&&!LB.prof));
  const L=document.getElementById('lbList'),PF=document.getElementById('lbProf');if(LB.prof){L.style.display='none';PF.style.display='block';if(force)profRender();else profStatus();return;}
  L.style.display='block';PF.style.display='none';const fr=frGet(),rows=lbRows(),st=L.scrollTop;
  const html=rows.length?rows.map(r=>`<div class="lbRow${r.me?' me':''}" data-p="${r.me?'':esc(r.pid)}"><i>${['🥇','🥈','🥉'][r.rank-1]||r.rank}</i><em class="${r.on?'on':''}"></em><b>${esc(r.nm)}${r.me?' <small>(jij)</small>':''}${fr[r.pid]?' <small class="fr">♥</small>':''}${LB.unread[r.pid]?' <small class="dm">✉</small>':''}</b><span>${r.lv?'LV '+r.lv:''}</span><span class="rp">${r.xp} RP</span></div>`).join(''):'<div class="lbEmpty">Nog niemand hier.</div>';
  if(L._h!==html){L.innerHTML=html;L._h=html;L.scrollTop=st;}}
function lbProfile(pub){if(!pub)return;LB.prof=pub;delete LB.unread[pub];lbRender(true);}
function profData(pub){const rows=(()=>{const t=LB.tab;LB.tab='alle';const r=lbRows();LB.tab=t;return r;})();return rows.find(r=>r.pid===pub)||{pid:pub,nm:(dmAll()[pub]||{}).nm||frGet()[pub]||'Speler',lv:0,xp:0,eur:0,on:false,seen:0};}
function profStatus(){const PF=document.getElementById('lbProf');const s=PF&&PF.querySelector('.pfSt');if(!s)return;const r=profData(LB.prof);const t=r.on?'🟢 Nu online':'⚪ Laatst online: '+agoTxt(r.seen);if(s.textContent!==t)s.textContent=t;}
function profRender(){const PF=document.getElementById('lbProf'),pub=LB.prof,r=profData(pub),fr=frGet(),conv=(dmAll()[pub]||{m:[]}).m,canDm=NET.http||(NET.room&&r.on);
  const rk=r.lv?RANKS[Math.min(RANKS.length-1,r.lv-1)]:'';
  PF.innerHTML=`<div class="pfTop"><span class="pfBack">‹ terug</span></div><div class="pfName">${esc(r.nm)}${fr[pub]?' <span class="fr">♥ vriend</span>':''}</div>
   <div class="pfSt"></div><div class="pfStats">${r.lv?`<span>LV ${r.lv} · ${esc(rk)}</span>`:''}${r.xp?`<span>${r.xp} RP</span>`:''}${r.lv?`<span>€ ${r.eur}</span>`:''}</div>
   <div class="pfConv">${conv.length?conv.slice(-20).map(m=>`<div class="pm ${m.me?'me':''}"><p>${esc(m.t)}</p><small>${agoTxt(m.ts)}</small></div>`).join(''):'<div class="pfNone">Nog geen berichten. Stuur een persoonlijk bericht, alleen '+esc(r.nm)+' ziet het.</div>'}</div>
   <div class="pfSend"><input maxlength="200" enterkeyhint="send" placeholder="${canDm?'Persoonlijk bericht aan '+esc(r.nm)+'…':esc(r.nm)+' is offline (berichten alleen live)'}" ${canDm?'':'disabled'}><span class="pfGo">➤</span></div>
   <div class="pfBtns">${fr[pub]?'<span class="pfFr un">Ontvrienden</span>':PVP.sent[pub]?'<span class="pfFr off">Verzoek verstuurd…</span>':PVP.req[pub]?'<span class="pfFr acc">Vriendschap accepteren</span>':r.on?'<span class="pfFr">👥 Vriend worden</span>':'<span class="pfFr off">Vriend worden kan als hij online is</span>'}</div>`;
  profStatus();const cv2=PF.querySelector('.pfConv');cv2.scrollTop=cv2.scrollHeight;
  PF.querySelector('.pfBack').addEventListener('click',e=>{e.preventDefault();LB.prof=null;lbRender(true);});
  const inp=PF.querySelector('input'),go=()=>{if(dmSend(pub,r.nm,inp.value)){inp.value='';profRender();}};
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();go();}});inp.addEventListener('keyup',e=>e.stopPropagation());PF.querySelector('.pfGo').addEventListener('click',e=>{e.preventDefault();go();});
  const fb=PF.querySelector('.pfFr');fb.addEventListener('click',e=>{e.preventDefault();if(fb.classList.contains('off'))return;if(fb.classList.contains('un'))pvpUnfriend(pub);else if(fb.classList.contains('acc'))pvpAccept(pub);else pvpAsk(pub);profRender();});}
setInterval(()=>{if(NET.open)lbRender();},1500);
