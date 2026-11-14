// ====================== online tegen elkaar: andere spelers neerschieten + vriendschappen ======================
// Berichten reizen mee in je "presence" (wat andere spelers van jou zien), als korte lijst gebeurtenissen met een
// ontvanger (publieke speler-id). Elke speler verwerkt alleen wat voor hem bedoeld is, en elke gebeurtenis maar één keer.
//   hit  = jij raakt iemand (schade)          kill = jij bent door iemand neergeschoten (geld voor de schutter)
//   frq  = vriendschapsverzoek                fok  = verzoek geaccepteerd           frm = vriendschap opgezegd
const PVP={out:[],seq:0,seen:new Set(),req:{},sent:{},by:null,byT:0,hitCd:{}};
function pvpPub(){let id=lsGet('gtb_pub');if(!id||id.length!==12){id=Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>b.toString(16).padStart(2,'0')).join('');lsSet('gtb_pub',id);}return id;}
function frGet(){try{return JSON.parse(lsGet('gtb_friends')||'{}')||{};}catch(e){return {};}}
function frSet(o){lsSet('gtb_friends',JSON.stringify(o));}
function isFriend(pub){return !!frGet()[pub];}
function pvpSend(k,to,d){PVP.out.push({k,to,i:++PVP.seq,d:Math.round(d||0),t:performance.now()});if(PVP.out.length>12)PVP.out.shift();NET.lastSent='';}
function pvpEv(){const now=performance.now();PVP.out=PVP.out.filter(e=>now-e.t<5000);return PVP.out.map(e=>({k:e.k,to:e.to,i:e.i,d:e.d}));}
function pvpGhosts(){return netOthers().map(p=>p.presence).filter(s=>s.pid&&s.pid!==pvpPub());}
function pvpByPub(pub){return pvpGhosts().find(s=>s.pid===pub);}
function pvpTarget(s){return !s.dead&&!isFriend(s.pid)&&!P.dead&&MODE==='play';}
function pvpHit(s,dmg){const now=performance.now();if((PVP.hitCd[s.pid]||0)>now)return false;PVP.hitCd[s.pid]=now+90;pvpSend('hit',s.pid,dmg);popTxt(s.x,s.y-18,'-'+Math.round(dmg),'#ff4f6d',1);for(let i=0;i<6;i++)parts.push({x:s.x,y:s.y,vx:rr(-2,2),vy:rr(-2,2),l:14,ml:14,s:1.4,k:'f'});return true;}
// kogels/raketten van jou tegen andere spelers
function pvpStep(){if(!(NET.room||NET.http)||MODE!=='play')return;const G=pvpGhosts();
  if(G.length){for(const b of BULLETS){if(b.l<=0)continue;const x0=b.x-b.vx,y0=b.y-b.vy;for(const s of G){if(!pvpTarget(s))continue;const r=s.car==='c'?16:9,dx=b.vx,dy=b.vy,L=dx*dx+dy*dy||1,t=clamp(((s.x-x0)*dx+(s.y-y0)*dy)/L,0,1);
      if(Math.hypot(x0+dx*t-s.x,y0+dy*t-s.y)<r){b.l=0;pvpHit(s,b.dmg||12);break;}}}}
  // binnengekomen gebouwen verwerken
  const me=pvpPub();for(const p of netOthers()){const s=p.presence;if(!s.pid||!Array.isArray(s.ev))continue;for(const e of s.ev){if(!e||e.to!==me)continue;const key=s.pid+':'+e.i;if(PVP.seen.has(key))continue;PVP.seen.add(key);pvpRecv(s,e);}}
  if(PVP.seen.size>600)PVP.seen=new Set([...PVP.seen].slice(-300));}
function pvpRecv(s,e){const nm=String(s.nm||'Speler').slice(0,14),fr=frGet();
  if(e.k==='hit'){if(P.dead||isFriend(s.pid)||CLUB.on||(typeof FPV!=='undefined'&&FPV.on))return;PVP.by={pid:s.pid,nm};PVP.byT=performance.now();P.lastHit='Neergeschoten door '+nm;hurt(clamp(e.d,1,90));if(!P.dead)noteAdd('GERAAKT!',nm+' schiet op je','#ff4f6d',90,'pvphit');}
  else if(e.k==='kill'){const amt=clamp(e.d,0,100000);addMoney(amt);addXP(35);sfx('kassa');noteAdd('RAAK! '+nm.toUpperCase()+' LIGT NEER','+€'+amt+' uit zijn zakken','#7dff6a',220);}
  else if(e.k==='frq'){if(fr[s.pid]){pvpSend('fok',s.pid);return;}if(PVP.sent[s.pid]){pvpAddFriend(s.pid,nm);pvpSend('fok',s.pid);return;}PVP.req[s.pid]=nm;sfx('blip');buzz(20);}
  else if(e.k==='fok'){if(!fr[s.pid]&&(PVP.sent[s.pid]||PVP.req[s.pid])){pvpAddFriend(s.pid,nm);noteAdd('NIEUWE VRIEND','Jij en '+nm+' zijn nu vrienden','#4ade80',200);}}
  else if(e.k==='frm'){if(fr[s.pid]){delete fr[s.pid];frSet(fr);noteAdd('VRIENDSCHAP VOORBIJ',nm+' is geen vriend meer','#ff9f1c',200);}}}
function pvpAddFriend(pub,nm){const fr=frGet();fr[pub]=nm;frSet(fr);delete PVP.req[pub];delete PVP.sent[pub];sfx('reward');}
function pvpAsk(pub){const s=pvpByPub(pub);if(!s)return;PVP.sent[pub]=s.nm||'Speler';pvpSend('frq',pub);noteAdd('VERZOEK VERSTUURD','Wacht tot '+(s.nm||'de speler')+' accepteert','#36d1ff',160);}
function pvpAccept(pub){const nm=PVP.req[pub];if(!nm)return;pvpAddFriend(pub,nm);pvpSend('fok',pub);noteAdd('NIEUWE VRIEND','Jij en '+nm+' zijn nu vrienden','#4ade80',200);}
function pvpUnfriend(pub){const fr=frGet(),nm=fr[pub];if(!nm)return;delete fr[pub];frSet(fr);pvpSend('frm',pub);noteAdd('ONTVRIEND',nm+' is geen vriend meer · jullie kunnen weer op elkaar schieten','#ff9f1c',200);}
// kaartjes in de lijst links: binnengekomen vriendschapsverzoeken (tik = accepteren)
function pvpCards(add){for(const pub in PVP.req)add('VRIENDSCHAPSVERZOEK',IS_TOUCH?'TIK':'',PVP.req[pub]+' wil vrienden worden · tik om te accepteren','#4ade80',()=>pvpAccept(pub),.8+.2*Math.sin(frameN*.12));}
// geld kwijt als een andere speler jou neerschiet (mag in het rood)
const _wasted0=wasted;
wasted=function(t,why){const wasDead=P.dead;_wasted0(t,why);if(wasDead||!P.dead)return;const b=PVP.by;if(b&&performance.now()-PVP.byT<2500){PVP.by=null;const amt=Math.round(50+Math.max(0,P.money)*.15);P.money-=amt;P.moneyF=20;pvpSend('kill',b.pid,amt);
  setTimeout(()=>noteAdd('BEROOFD DOOR '+b.nm.toUpperCase(),'-€'+amt+(P.money<0?' · je staat nu € '+Math.round(-P.money)+' in het rood':''),'#ff4f6d',300),1200);}};
// raketten/granaten raken ook andere spelers
const _blast0=blast;blast=function(x,y,R){_blast0(x,y,R);if(!(NET.room||NET.http))return;for(const s of pvpGhosts())if(pvpTarget(s)&&Math.hypot(s.x-x,s.y-y)<R+8)pvpHit(s,80);};
// ---- vrienden-scherm in het dashboard ----
function friendsOpen(){const ov=ovEl('menuOv'),b=boxEl();b.appendChild(hEl('👥 VRIENDEN',null,30));const fr=frGet(),G=pvpGhosts();
  const info=document.createElement('div');info.style.cssText='font-size:12px;opacity:.85;margin:4px 0 12px';info.textContent='Vrienden kunnen niet op elkaar schieten. Schiet je een andere speler neer, dan pak je zijn geld (hij kan zelfs in het rood komen).';b.appendChild(info);
  const row=(nm,sub,btn,col,fn,on)=>{const d=document.createElement('div');d.style.cssText='display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 10px;margin:4px 0;border-radius:10px;background:rgba(255,255,255,.06)';
    const l=document.createElement('div');const n=document.createElement('b');n.textContent=(on?'🟢 ':'⚪ ')+nm;const s2=document.createElement('div');s2.style.cssText='font-size:11px;opacity:.75';s2.textContent=sub;l.append(n,s2);
    const k=document.createElement('div');k.textContent=btn;k.style.cssText=`padding:8px 12px;border-radius:10px;background:${col};font:800 12px Inter,sans-serif;cursor:pointer;white-space:nowrap`;if(fn)k.addEventListener('click',e=>{e.preventDefault();fn();friendsOpen();});d.append(l,k);b.appendChild(d);};
  const sec=t=>{const h=document.createElement('div');h.style.cssText='font:800 11px Inter,sans-serif;letter-spacing:2px;color:#c77dff;margin:12px 0 4px';h.textContent=t;b.appendChild(h);};
  if(!(NET.room||NET.http)){const t=document.createElement('div');t.style.cssText='font-size:13px;opacity:.8;margin:8px 0';t.textContent='Je speelt nu offline. Vrienden maken kan in de gedeelde online versie of op je eigen hosting.';b.appendChild(t);}
  const reqs=Object.keys(PVP.req);if(reqs.length){sec('VERZOEKEN');for(const p of reqs)row(PVP.req[p],'wil vrienden worden','ACCEPTEREN','#16a34a',()=>pvpAccept(p),!!pvpByPub(p));}
  sec('MIJN VRIENDEN');const ks=Object.keys(fr);if(!ks.length){const t=document.createElement('div');t.style.cssText='font-size:12px;opacity:.6;margin:4px 0';t.textContent='Nog geen vrienden.';b.appendChild(t);}
  for(const p of ks){const g=pvpByPub(p);row(fr[p],g?'online · LV '+(g.lv|0):'offline','ONTVRIENDEN','#7f1d1d',()=>{if(g)pvpUnfriend(p);else{const f=frGet();delete f[p];frSet(f);}},!!g);}
  const others=G.filter(s=>!fr[s.pid]);if(others.length){sec('NU ONLINE');for(const s of others){const nm=String(s.nm||'Speler').slice(0,14);if(PVP.req[s.pid])continue;row(nm,'LV '+(s.lv|0)+' · € '+(s.eur|0),PVP.sent[s.pid]?'VERSTUURD…':'VRIEND WORDEN',PVP.sent[s.pid]?'#3a3a5a':'#2563eb',PVP.sent[s.pid]?null:()=>pvpAsk(s.pid),true);}}
  b.appendChild(btnEl('⟵  TERUG','#3a3a5a',menuRender));ov.replaceChildren(b);}
setInterval(()=>{if(paused||CLUB.on||(typeof FPV!=='undefined'&&FPV.on))try{netStep();}catch(e){}},300);
