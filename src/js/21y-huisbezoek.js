// ====================== gekochte huizen bezoeken (3D), met meerdere spelers tegelijk, en graffiti spuiten op de muren ======================
const HROOM_MAP=['HHHHHWWWHHHHHH','H.....H......H','H.....H..BBB.H','H.....H..BBB.H','H.....H......W','W............H','H......HH.HHHH','H.KKK........H','H......T.....W','HF...........H','HHHHHHDDHHHHHH'];
const WALLP=[['#f3e3c3','#e6cf9e','dots'],['#cfe3ef','#a9c8dc','stripes'],['#e8d4ea','#cfb1d4','dots'],['#dfe8cf','#c0d1a6','stripes'],['#f6d8cf','#e4b1a3','diamonds'],['#e9e9e9','#cfcfcf','bricks']];
function hHash(oid){let h=0;for(const c of String(oid))h=(h*31+c.charCodeAt(0))>>>0;return h;}
function wallDraw(pal){return (g,w,h)=>{g.fillStyle=pal[0];g.fillRect(0,0,w,h);g.fillStyle=pal[1];
  if(pal[2]==='stripes')for(let x=0;x<w;x+=10)g.fillRect(x,0,4,h);else if(pal[2]==='dots'){for(let y=4;y<h-12;y+=10)for(let x=(y/10&1)*5+3;x<w;x+=10){g.beginPath();g.arc(x,y,1.8,0,TAU);g.fill();}}
  else if(pal[2]==='diamonds'){for(let y=0;y<h-12;y+=12)for(let x=0;x<w;x+=12){g.beginPath();g.moveTo(x+6,y);g.lineTo(x+12,y+6);g.lineTo(x+6,y+12);g.lineTo(x,y+6);g.closePath();g.globalAlpha=.5;g.fill();g.globalAlpha=1;}}
  else{for(let y=0;y<h-12;y+=8)for(let x=((y/8)&1)*8;x<w;x+=16){g.strokeStyle=pal[1];g.strokeRect(x+.5,y+.5,15,7);}}
  g.fillStyle='#fff';g.fillRect(0,h-12,w,2);g.fillStyle='#8a6a4a';g.fillRect(0,h-10,w,10);};}
function houseTex(oid){const pal=WALLP[hHash(oid)%WALLP.length],T={},mk=mkTex,wd=wallDraw(pal);
  T.H=mk(64,64,wd);
  T.W=mk(64,64,(g,w,h)=>{wd(g,w,h);g.fillStyle='#f4f4f4';g.fillRect(8,8,48,38);const gr=g.createLinearGradient(0,10,0,44);gr.addColorStop(0,'#7ec8ff');gr.addColorStop(1,'#d8f0ff');g.fillStyle=gr;g.fillRect(11,11,42,32);g.fillStyle='#f4f4f4';g.fillRect(31,11,2,32);g.fillRect(11,26,42,2);g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.ellipse(22,18,7,3,0,0,TAU);g.fill();g.fillStyle='#b5523b';g.fillRect(4,6,6,44);g.fillRect(54,6,6,44);});
  T.D=mk(64,64,(g,w,h)=>{wd(g,w,h);g.fillStyle='#7a4a2a';g.fillRect(14,6,36,58);g.fillStyle='#8f5a34';g.fillRect(18,10,28,22);g.fillRect(18,36,28,24);g.fillStyle='#ffd166';g.beginPath();g.arc(42,36,2.4,0,TAU);g.fill();});
  T.K=mk(64,64,(g,w,h)=>{g.fillStyle='#f2f2f2';g.fillRect(0,0,w,h);g.fillStyle='#d8d8d8';for(let x=0;x<w;x+=21)g.fillRect(x,8,1,h);g.fillStyle='#999';for(let x=8;x<w;x+=21)g.fillRect(x,14,6,2);g.fillStyle='#555';g.fillRect(0,0,w,6);});
  T.F=mk(64,64,(g,w,h)=>{g.fillStyle='#e8eef2';g.fillRect(0,0,w,h);g.fillStyle='#c5ced4';g.fillRect(0,24,w,2);g.fillStyle='#8a979f';g.fillRect(50,8,3,12);g.fillRect(50,32,3,20);for(const [x,y,c] of [[10,36,'#ff5a6e'],[20,42,'#ffd84d'],[12,48,'#5ec8ff']]){g.fillStyle=c;g.fillRect(x,y,7,5);}});
  T.B=mk(64,64,(g,w,h)=>{g.fillStyle='#5a3a2a';g.fillRect(0,0,w,h);g.fillStyle=['#5e9bd6','#e0708a','#7cc48a','#f0b54a'][hHash(oid)%4];g.fillRect(0,4,w,40);g.fillStyle='rgba(255,255,255,.25)';for(let x=0;x<w;x+=8)g.fillRect(x,4,3,40);});
  T.T=mk(64,64,(g,w,h)=>{g.fillStyle='#a1724a';g.fillRect(0,0,w,10);g.fillStyle='#7a5434';g.fillRect(4,10,6,54);g.fillRect(54,10,6,54);});
  T.top=mk(32,32,(g,w,h)=>{g.fillStyle='#a1724a';g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<h;y+=5)g.fillRect(0,y,w,1);});
  T.topK=mk(32,32,(g,w,h)=>{g.fillStyle='#3a3a3e';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<20;i++)g.fillRect((i*13)%32,(i*7)%32,1,1);});
  T['#']=T.H;T.wd=wd;return T;}
function houseSprites(S){if(S.bank)return;const mk=mkTex;
  S.bank=mk(64,40,(g)=>{g.fillStyle='#5a4fcf';g.fillRect(2,6,60,20);g.fillRect(0,18,64,14);g.fillStyle='#6f64e8';g.fillRect(6,10,25,10);g.fillRect(33,10,25,10);g.fillStyle='#3a2f9f';g.fillRect(0,32,6,8);g.fillRect(58,32,6,8);g.fillStyle='#ffd166';g.fillRect(8,13,8,6);});
  S.tv=mk(64,48,(g)=>{g.fillStyle='#6b4a32';g.fillRect(4,34,56,14);g.fillStyle='#111';g.fillRect(6,0,52,32);const gr=g.createLinearGradient(0,2,64,30);gr.addColorStop(0,'#36d1ff');gr.addColorStop(1,'#ff2e88');g.fillStyle=gr;g.fillRect(9,3,46,26);g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText('GTB TV',32,19);});
  S.kat=mk(32,24,(g)=>{g.fillStyle='#f0a35e';g.beginPath();g.ellipse(14,16,11,7,0,0,TAU);g.fill();g.beginPath();g.arc(24,9,6,0,TAU);g.fill();g.beginPath();g.moveTo(20,5);g.lineTo(21,0);g.lineTo(24,4);g.moveTo(25,4);g.lineTo(28,0);g.lineTo(29,6);g.fill();g.strokeStyle='#f0a35e';g.lineWidth=3;g.beginPath();g.moveTo(4,16);g.quadraticCurveTo(0,6,6,6);g.stroke();g.fillStyle='#222';g.fillRect(22,8,1.5,1.5);g.fillRect(26,8,1.5,1.5);});
  S.kunst=mk(40,32,(g)=>{g.fillStyle='#c9a24a';g.fillRect(0,0,40,32);g.fillStyle='#fdf6e3';g.fillRect(3,3,34,26);g.fillStyle='#7ec8ff';g.fillRect(3,3,34,14);g.fillStyle='#ffd84d';g.beginPath();g.arc(28,10,4,0,TAU);g.fill();g.fillStyle='#4caf50';g.beginPath();g.moveTo(3,29);g.lineTo(14,14);g.lineTo(24,29);g.fill();g.fillStyle='#2e7d32';g.beginPath();g.moveTo(16,29);g.lineTo(26,18);g.lineTo(37,29);g.fill();});
  S.kast=mk(40,64,(g)=>{g.fillStyle='#7a5434';g.fillRect(0,0,40,64);g.fillStyle='#5a3a24';for(let y=4;y<64;y+=15)g.fillRect(3,y,34,2);for(let y=6;y<60;y+=15)for(let x=4;x<36;x+=4){g.fillStyle=['#e53935','#1e88e5','#fdd835','#43a047','#8e24aa'][(x+y)%5];g.fillRect(x,y,3,11);}});
  S.mat=mk(64,16,(g)=>{g.fillStyle='#c0504d';g.fillRect(0,0,64,16);g.fillStyle='#f2c14e';g.fillRect(4,3,56,10);g.fillStyle='#c0504d';g.fillRect(10,6,44,4);});}
function houseObjs(oid){const o=[{x:3,z:4.2,y:0,h:.85,w:2.2,s:'bank'},{x:3,z:1.35,y:0,h:1.1,w:1.6,s:'tv'},{x:3,z:2.8,y:0,h:.06,w:2.4,s:'mat'},{x:1.4,z:1.5,y:0,h:1.2,w:.6,s:'plant'},{x:5.4,z:5.2,y:0,h:1.2,w:.6,s:'plant'},
  {x:12.4,z:1.4,y:0,h:2.0,w:1.1,s:'kast'},{x:10.5,z:1.15,y:1.3,h:.7,w:.9,s:'kunst'},{x:6.6,z:8.5,y:0,h:.95,w:.5,s:'chair'},{x:8.4,z:8.5,y:0,h:.95,w:.5,s:'chair'},{x:7.5,z:9.3,y:0,h:.95,w:.5,s:'chair'}];
  if(hHash(oid)%2)o.push({x:4.2,z:3.2,y:0,h:.45,w:.6,s:'kat'});for(const [x,z] of [[3,3],[10,3.5],[7,8],[3,8.5]])o.push({x,z,y:2.55,h:.22,w:.9,s:'tl',lamp:1});return o;}
function houseRoom(b){const id='h'+b.oid,h=HS[b.oid]||{},nm=String(h.t||'Huis').slice(0,10);let R=ROOMS[id];
  if(!R){R=ROOMS[id]={map:HROOM_MAP,h:{H:2.8,W:2.8,D:2.8,K:.95,F:1.9,B:.55,T:.75},spawn:[6.9,9.2,-Math.PI/2],floor:'parquet',ceil:0xfff4f4f0,tint:0,music:0,oid:String(b.oid)};R.tex=houseTex(b.oid);R.objs=houseObjs(b.oid);R.ctex={};}
  R.name=nm.toUpperCase()+(h.o?' · VAN '+String(h.o).toUpperCase():'');R.hint='Loop rond · 🎨 spuit iets op de muur met de spuitbus';return id;}
function houseVisit(b){if(!b||!HS[b.oid])return;if(!SCSPR)SCSPR=scSprites();houseSprites(SCSPR);const id=houseRoom(b);scEnter(id);tagsLoad(String(b.oid));}
// eigen huis: uitrusten en naar binnen
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='thuis'){const r=_at.apply(this,arguments);houseVisit(a.b);return r;}return _at.apply(this,arguments);};}
{const _ha=houseAct;houseAct=function(b){const a=_ha(b);if(a&&a.k==='thuis'){a.t='🏠 '+String((HS[b.oid]||{}).t||'Thuis').slice(0,10)+': naar binnen (en uitrusten)';a.btn='🏠<br>BINNEN';}return a;};}

// ---- graffiti: per huis een lijst [cel, tekst, kleur, id]
const TAGS=(()=>{try{return JSON.parse(lsGet('gtb_tags')||'{}')||{};}catch(e){return {};}})();
const TAGC=['#ff2e88','#36d1ff','#7dff6a','#ffd166','#ff6b3d','#b388ff','#ffffff','#111111'];
function tagsSave(){try{for(const k in TAGS)TAGS[k]=TAGS[k].slice(-60);lsSet('gtb_tags',JSON.stringify(TAGS));}catch(e){}}
function tagsMerge(oid,list){if(!Array.isArray(list))return;const cur=TAGS[oid]=TAGS[oid]||[];let ch=0;for(const t of list){if(!Array.isArray(t)||t.length<4)continue;const q=[String(t[0]).slice(0,7),String(t[1]).replace(/[<>]/g,'').slice(0,12),TAGC.includes(t[2])?t[2]:'#ff2e88',String(t[3]).slice(0,24)];if(!/^\d{1,2},\d{1,2}$/.test(q[0]))continue;if(!cur.some(c=>c[3]===q[3])){cur.push(q);ch=1;}}if(ch){TAGS[oid]=cur.slice(-60);tagsSave();tagsApply(oid);}}
function tagDraw(g,t,i,n){let s=0;for(const c of t[3])s=(s*33+c.charCodeAt(0))>>>0;const y=14+((i+(s%3))%3)*16,rot=((s%21)-10)/60,fs=Math.max(9,Math.min(18,110/Math.max(3,t[1].length)));
  g.save();g.translate(32+((s>>3)%9)-4,y);g.rotate(rot);g.font=`900 ${fs}px Impact, 'Arial Black', sans-serif`;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  g.strokeStyle=t[2]==='#111111'?'rgba(255,255,255,.7)':'rgba(0,0,0,.65)';g.lineWidth=3;g.strokeText(t[1],0,0);g.fillStyle=t[2];g.fillText(t[1],0,0);
  g.globalAlpha=.85;for(let k=0;k<3;k++){const dx=((s>>(k*4))%30)-15;g.fillRect(dx,fs*.35,1.6,4+((s>>(k*3))%9));}g.restore();}
function tagsApply(oid){const R=ROOMS['h'+oid];if(!R)return;R.ctex={};const by={};for(const t of TAGS[oid]||[])(by[t[0]]=by[t[0]]||[]).push(t);
  for(const k in by){const [cx,cz]=k.split(',').map(Number),ch=(R.map[cz]||'')[cx];if(ch!=='H')continue;const L=by[k].slice(-3);R.ctex[k]=mkTex(64,64,(g,w,h)=>{R.tex.wd(g,w,h);L.forEach((t,i)=>tagDraw(g,t,i,L.length));});}}
function tagsLoad(oid){tagsApply(oid);if(NET.http)fetch('api.php?a=tags&oid='+encodeURIComponent(oid),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j&&j.tags)tagsMerge(oid,j.tags);}).catch(()=>{});}
function curHouse(){return SC.on&&SC.room&&SC.room.charAt(0)==='h'&&ROOMS[SC.room]&&ROOMS[SC.room].oid?ROOMS[SC.room].oid:null;}
function tagTarget(){if(!curHouse())return null;for(let d=.2;d<1.8;d+=.05){const x=SC.x+Math.cos(SC.yaw)*d,z=SC.z+Math.sin(SC.yaw)*d,c=scCell(x,z);if(c==='.')continue;return c==='H'?Math.floor(x)+','+Math.floor(z):null;}return null;}
let MYTAGS=[];
function tagPres(){const oid=curHouse();if(!oid)return null;return MYTAGS.filter(t=>t[4]===oid).slice(-8).map(t=>t.slice(0,4));}
function sprayDo(k,t,c){const oid=curHouse();if(!oid||!k)return;t=t.replace(/[<>]/g,'').trim().slice(0,12);if(!t)return;const q=[k,t,c,pvpPub()+Date.now().toString(36)];tagsMerge(oid,[q]);MYTAGS.push([...q,oid]);MYTAGS=MYTAGS.slice(-20);
  if(AU.c){const tt=AU.c.currentTime;noiseHit(tt,.5,.45,'highpass',3000,[AU.sfx]);}buzz(30);noteAdd('GESPOTEN!','"'+t+'" staat op de muur. Iedereen in dit huis ziet het.','#ff2e88',160,'spray');
  if(NET.http)fetch('api.php?a=tag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:netPid(),oid,k,t,c,i:q[3]})}).catch(()=>{});}
function sprayOpen(){const k=tagTarget();if(!k)return;let d=document.getElementById('tagDlg');if(!d){d=document.createElement('div');d.id='tagDlg';d.innerHTML='<div class="tgBox"><b>🎨 SPUITBUS</b><input maxlength="12" placeholder="Wat spuit je op de muur?"><div class="tgCol"></div><div class="tgBtns"><span class="tgNo">Annuleer</span><span class="tgOk">SPUITEN</span></div></div>';document.body.appendChild(d);
    const cw=d.querySelector('.tgCol');TAGC.forEach(c=>{const s=document.createElement('i');s.style.background=c;s.dataset.c=c;s.onclick=()=>{cw.querySelectorAll('i').forEach(x=>x.classList.remove('on'));s.classList.add('on');};cw.appendChild(s);});cw.firstChild.classList.add('on');
    d.addEventListener('pointerdown',e=>e.stopPropagation());}
  const inp=d.querySelector('input');inp.value='';d.style.display='flex';SC.mv.f=0;SC.mv.t=0;SC.tagOpen=1;setTimeout(()=>inp.focus(),50);
  const close=()=>{d.style.display='none';SC.tagOpen=0;inp.blur();};const ok=()=>{const c=(d.querySelector('.tgCol .on')||{}).dataset;sprayDo(k,inp.value,c?c.c:'#ff2e88');close();};
  inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')ok();if(e.key==='Escape')close();};d.querySelector('.tgOk').onclick=ok;d.querySelector('.tgNo').onclick=close;}
{const st=document.createElement('style');st.textContent=`#tagDlg{position:fixed;inset:0;z-index:72;display:none;align-items:center;justify-content:center;background:rgba(8,4,20,.6)}
#tagDlg .tgBox{width:min(88vw,360px);background:#1a0a2c;border:2px solid #ff2e88;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:12px;color:#fff;font-family:Inter,sans-serif}
#tagDlg input{font:800 18px Inter,sans-serif;padding:10px 12px;border-radius:10px;border:0;background:#2a1a40;color:#fff}#tagDlg .tgCol{display:flex;gap:8px;flex-wrap:wrap}
#tagDlg .tgCol i{width:34px;height:34px;border-radius:50%;cursor:pointer;border:3px solid transparent;box-shadow:0 0 0 1px rgba(255,255,255,.3)}#tagDlg .tgCol i.on{border-color:#fff;transform:scale(1.12)}
#tagDlg .tgBtns{display:flex;gap:10px;justify-content:flex-end}#tagDlg .tgBtns span{padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:800}#tagDlg .tgNo{background:#3a3a5a}#tagDlg .tgOk{background:#ff2e88}`;document.head.appendChild(st);}
{const _ss=scStep;scStep=function(){if(SC.tagOpen){SC.mv.f=0;SC.mv.t=0;for(const k in pressed)pressed[k]=false;return;}_ss();};}
setInterval(()=>{let b=document.getElementById('sprayBtn');const ok=!!tagTarget()&&!SC.tagOpen;if(!ok){if(b)b.style.display='none';return;}
  if(!b){b=document.createElement('div');b.id='sprayBtn';b.className='scBtn';b.textContent='🎨 SPUITBUS';b.style.cssText+='right:calc(var(--sr) + 14px);bottom:calc(var(--sb) + 40px);background:linear-gradient(90deg,#ff2e88,#7b2ff7);white-space:nowrap';b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();sprayOpen();});document.body.appendChild(b);}b.style.display='block';},150);
window.addEventListener('keydown',e=>{if(SC.on&&!SC.tagOpen&&e.code==='KeyG'&&tagTarget()){e.preventDefault();sprayOpen();}});
// tags van andere spelers in hetzelfde huis (claude.ai-versie: via aanwezigheid) en van de server (eigen site)
setInterval(()=>{const oid=curHouse();if(!oid)return;if(NET.room){for(const s of scOthers())if(Array.isArray(s.tg))tagsMerge(oid,s.tg);}if(NET.http)tagsLoad(oid);},3000);
// geen parasols bij 't Stadscafé (ook niet de terrasparasols uit de kaart)
{const _it=initTerrace;initTerrace=function(){_it();const s=SHOPS.find(s=>s.n==="'t Stadscafé");if(!s)return;for(let i=TERRACE.length-1;i>=0;i--)if(Math.hypot(TERRACE[i].x-s.b.cx,TERRACE[i].y-s.b.cy)<420)TERRACE.splice(i,1);try{chunkCache.clear();}catch(e){}};}
