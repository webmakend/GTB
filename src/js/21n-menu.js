// ====================== beginscherm-menu: instellingen, naam, eigen personage, ranglijst ======================
const SET_KEY='gtb_set';const SET=Object.assign({mus:1,sfx:1,vib:true},(()=>{try{return JSON.parse(lsGet(SET_KEY)||'{}');}catch(e){return{};}})());
function setSave(){lsSet(SET_KEY,JSON.stringify(SET));}
{const _bz=buzz;buzz=function(m){if(SET.vib)_bz(m);};}
setInterval(()=>{try{if(AU.sfx)AU.sfx.gain.value=.8*SET.sfx;if(MODE==='play'&&!CLUB.on&&!MG.on&&!radio.paused)radio.volume=clamp(.45*SET.mus,0,1);}catch(e){}},400);
// ---- eigen personage ----
const CUST_KEY='gtb_custom';
const CUST_OPT={sex:['man','vrouw'],skin:[['#f1c9a5','#cf9f7c'],['#e2ad88','#b5805e'],['#c68a5e','#9a6440'],['#8d5a3b','#6b4029'],['#5c3a24','#432818']],hair:['slick','wavy','mohawk','pony'],hairC:['#231a16','#5a2a18','#a8682e','#e2c07a','#9a9a9a','#c43b6c'],outfit:['polo','tee','leather','crop'],top:['#e9ecd6','#3a2a55','#3f6f93','#d9e6b0','#c62828','#111111'],beard:['','stubble','shadow'],c:['#36d1c4','#ff2e88','#36d1ff','#ffd166','#7dff6a','#c77dff']};
function custDefault(){return{name:'BOMMELAAR',sex:0,skin:1,hair:0,hairC:0,outfit:1,top:2,beard:1,c:5,spr:2};}
function custLoad(){try{return Object.assign(custDefault(),JSON.parse(lsGet(CUST_KEY)||'null')||{});}catch(e){return custDefault();}}
function custChar(o){const sk=CUST_OPT.skin[o.skin],top=CUST_OPT.top[o.top],c=CUST_OPT.c[o.c],vrouw=o.sex===1;
  const ch={id:'eigen',name:(o.name||'IK').toUpperCase().slice(0,12),c,bg:[c,'#8a2be2','#1a0629'],skin:sk[0],skinD:sk[1],hair:CUST_OPT.hair[o.hair],hairC:CUST_OPT.hairC[o.hairC],beard:vrouw?'':CUST_OPT.beard[o.beard],outfit:CUST_OPT.outfit[o.outfit],top,topD:shadeHex(top,.75),eye:'#3b2a16',jaw:vrouw?'soft':'square',lips:vrouw?'#b5435a':undefined,ear:vrouw?'drop':undefined,body:top,head:CUST_OPT.hairC[o.hairC],perk:PERK0,
    avy:.36,spr:vrouw?['player',o.spr%PPL_SPR.player.length]:['civ',o.spr%PPL_SPR.civ.length],sub:'JOUW EIGEN PERSONAGE'};
  ch.img='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(portraitSVG(ch,'eigen').replace('<svg ','<svg width="400" height="600" '));return ch;}
function shadeHex(h,f){const n=parseInt(h.slice(1),16),r=Math.min(255,((n>>16)&255)*f)|0,g=Math.min(255,((n>>8)&255)*f)|0,b=Math.min(255,(n&255)*f)|0;return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);}
function custRegister(){if(!lsGet(CUST_KEY))return;const ch=custChar(custLoad());const i=CHARS.findIndex(c=>c.id==='eigen');if(i>=0)CHARS[i]=ch;else CHARS.unshift(ch);if(AVA)delete AVA.eigen;return ch;}
custRegister();
// ---- UI helpers ----
function ovEl(id){let ov=document.getElementById(id);if(!ov){ov=document.createElement('div');ov.id=id;ov.style.cssText='position:fixed;inset:0;z-index:58;display:none;flex-direction:column;align-items:center;justify-content:flex-start;background:radial-gradient(circle at 70% 0%,#3a1458 0,#16081f 55%,#0b0410 100%);font-family:Inter,sans-serif;color:#fff;overflow:auto;padding:calc(var(--st) + 14px) 12px calc(var(--sb) + 20px);box-sizing:border-box';document.body.appendChild(ov);}return ov;}
function btnEl(txt,bg,fn){const b=document.createElement('button');b.type='button';b.textContent=txt;b.style.cssText=`display:block;width:100%;padding:9px 12px;margin:5px 0;border:0;border-radius:10px;background:${bg};color:#fff;font:800 13px Inter,sans-serif;letter-spacing:.3px;cursor:pointer;text-align:center;user-select:none;-webkit-tap-highlight-color:transparent`;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(performance.now()-MENU_T<350)return;fn();});return b;}
let MENU_T=0;
function boxEl(){const b=document.createElement('div');b.style.cssText='width:min(96vw,520px);padding:4px 2px';return b;}
function hEl(t,c,s){const h=document.createElement('div');h.style.cssText=`font:400 ${s||30}px Anton,Impact,sans-serif;color:${c||'#ffd166'};letter-spacing:1px`;h.textContent=t;return h;}
// ---- hoofdmenu ----
function menuOpen(){if(MODE!=='play')return;const ov=ovEl('menuOv');paused=true;bigMap=false;MENU_T=performance.now();menuRender();ov.style.display='flex';document.getElementById('touch').style.display='none';}
function menuClose(){const ov=ovEl('menuOv');ov.style.display='none';paused=false;if(IS_TOUCH)document.getElementById('touch').style.display='block';}
function menuRender(){const ov=ovEl('menuOv'),b=boxEl();b.appendChild(hEl('GTB BOMMEL',null,34));
  const base=lvlBase(PRG.lvl),k=clamp((PRG.xp-base)/need(PRG.lvl),0,1),r=document.createElement('div');r.style.cssText='margin:4px 0 10px;padding:10px 12px;border-radius:12px;background:rgba(199,125,255,.15);border:1px solid #c77dff';
  r.innerHTML='';const t1=document.createElement('div');t1.style.cssText='font:400 22px Anton,Impact,sans-serif;color:#c77dff';t1.textContent=`${rankOf(PRG.lvl).toUpperCase()} · LV ${PRG.lvl}`;const t2=document.createElement('div');t2.style.cssText='font-size:12px;opacity:.85;margin:3px 0 8px';t2.textContent=RANK_TXT[Math.min(RANK_TXT.length-1,PRG.lvl-1)];
  const bar=document.createElement('div');bar.style.cssText='height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden';const fill=document.createElement('div');fill.style.cssText=`height:100%;width:${(k*100).toFixed(1)}%;background:linear-gradient(90deg,#7b2ff7,#c77dff)`;bar.appendChild(fill);
  const t3=document.createElement('div');t3.style.cssText='font-size:11px;opacity:.8;margin-top:6px';const nx=RANKS[Math.min(RANKS.length-1,PRG.lvl)];t3.textContent=`${PRG.xp-base} / ${need(PRG.lvl)} respect tot ${PRG.lvl>=RANKS.length?'max':nx} · 🪙 ${PRG.coins.length}/25 · 📜 ${PRG.hist.length}/${HIST.length} · 🏆 ${PRG.ach.length}`;
  r.append(t1,t2,bar,t3);b.appendChild(r);
  const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:0 8px';const G=(t,c,f)=>grid.appendChild(btnEl(t,c,f));
  b.appendChild(btnEl('▶  VERDER SPELEN','#ff2e88',menuClose));
  G('🏆 Ranglijst','#5b2a9e',()=>{menuClose();lbOpen();});G('🎨 Eigen personage','#2a6f97',()=>custOpen());
  G('✏️ Naam aanpassen','#3a3a5a',()=>{menuClose();askName(()=>{const s=getSave(),n=lsGet('gtb_name');if(s&&n){s.name=n;lsSet(SAVE_KEY,JSON.stringify(s));}if(n)writeSave(true);noteAdd('NAAM AANGEPAST',n||'','#7dff6a',150);});const i=document.getElementById('nameIn');if(i)i.value=lsGet('gtb_name')||'';});
  G('⚙️ Instellingen','#3a3a5a',setOpen);G('💾 Opslaan','#1f6b4a',()=>{writeSave();});G('🗺️ Kaart','#3a3a5a',()=>{menuClose();bigMap=true;});
  G('🏠 Keuzescherm','#5a2a2a',()=>{if(getSave())writeSave(true);progSave();menuClose();restartGame();});G('⟲ Opnieuw beginnen','#5a2a2a',menuOpenConfirm);
  b.appendChild(grid);
  const hint=document.createElement('div');hint.style.cssText='font-size:11px;opacity:.6;margin-top:10px;text-align:center';hint.textContent=IS_TOUCH?'Het spel staat op pauze zolang dit scherm open is.':'Tab of O = menu · het spel staat op pauze zolang dit scherm open is';b.appendChild(hint);
  ov.replaceChildren(b);}
// ---- instellingen ----
function menuOpenConfirm(){const ov=ovEl('menuOv'),b=boxEl();b.appendChild(hEl('OPNIEUW BEGINNEN?',null,30));const t=document.createElement('div');t.style.cssText='font-size:13px;opacity:.85;margin:6px 0 12px';t.textContent='Je begint weer bij missie 1 met €0. Je opgeslagen spel, levels en prestaties blijven bewaard.';b.appendChild(t);
  b.appendChild(btnEl('JA, OPNIEUW BEGINNEN','#c62828',()=>{menuClose();restartGame();}));b.appendChild(btnEl('⟵  TERUG','#3a3a5a',menuRender));ov.replaceChildren(b);}
function setOpen(){const ov=ovEl('menuOv'),b=boxEl();b.appendChild(hEl('INSTELLINGEN',null,30));
  const slider=(lab,val,fn)=>{const w=document.createElement('label');w.style.cssText='display:block;margin:14px 0 4px;font-weight:700;font-size:14px';w.textContent=lab;const i=document.createElement('input');i.type='range';i.min=0;i.max=100;i.value=Math.round(val*100);i.style.cssText='width:100%;accent-color:#ff2e88';i.addEventListener('input',()=>fn(i.value/100));w.appendChild(i);b.appendChild(w);};
  slider('🎵 Muziekvolume',SET.mus,v=>{SET.mus=v;setSave();});slider('💥 Geluidseffecten',SET.sfx,v=>{SET.sfx=v;setSave();});slider('🔍 Camera-zoom',(ZU-.3)/2.3,v=>setZoom(.3+v*2.3));
  const tog=(lab,get,fn)=>{const d=btnEl(lab+': '+(get()?'AAN':'UIT'),'#3a3a5a',()=>{fn();d.textContent=lab+': '+(get()?'AAN':'UIT');});b.appendChild(d);};
  tog('🔊 Geluid',()=>AU.on,()=>musicToggle());tog('📳 Trillen',()=>SET.vib,()=>{SET.vib=!SET.vib;setSave();});
  b.appendChild(btnEl('⟵  TERUG','#ff2e88',menuRender));ov.replaceChildren(b);}
// ---- personage-maker ----
function custOpen(){const ov=ovEl('menuOv');let o=custLoad();const b=boxEl();b.appendChild(hEl('EIGEN PERSONAGE',null,30));
  const wrap=document.createElement('div');wrap.style.cssText='display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:start;margin-top:8px';const pv=document.createElement('div');pv.style.cssText='width:120px;height:180px;border-radius:12px;overflow:hidden;border:2px solid #ff2e88';
  const sp=document.createElement('canvas');sp.width=120;sp.height=90;sp.style.cssText='position:static;display:block;width:120px;height:90px;margin-top:6px;border-radius:10px;background:#3b4a3a';
  const left=document.createElement('div');left.append(pv,sp);const opts=document.createElement('div');wrap.append(left,opts);b.appendChild(wrap);
  const nm=document.createElement('input');nm.maxLength=12;nm.value=o.name;nm.style.cssText='width:100%;padding:10px;border-radius:10px;border:2px solid #ff2e88;background:#120720;color:#fff;font:800 15px Inter,sans-serif;margin-bottom:6px';nm.addEventListener('keydown',e=>e.stopPropagation());nm.addEventListener('input',()=>{o.name=nm.value;});opts.appendChild(nm);
  const draw=()=>{const ch=custChar(o);pv.innerHTML=portraitSVG(ch,'cpv');const g=sp.getContext('2d');g.clearRect(0,0,120,90);g.fillStyle='#4a5a46';g.fillRect(0,0,120,90);if(PPL_OK){const r=PPL_SPR[ch.spr[0]][ch.spr[1]],s=70/r[3];g.save();g.translate(60,45);g.rotate(-Math.PI/2);g.drawImage(PPL,r[0],r[1],r[2],r[3],-r[2]*s/2,-r[3]*s/2,r[2]*s,r[3]*s);g.restore();}};
  const row=(lab,key,list,isCol)=>{const l=document.createElement('div');l.style.cssText='font-size:11px;font-weight:800;opacity:.8;margin:6px 0 3px;letter-spacing:.5px';l.textContent=lab;opts.appendChild(l);const r=document.createElement('div');r.style.cssText='display:flex;flex-wrap:wrap;gap:5px';
    list.forEach((v,i)=>{const s=document.createElement('div');const sel=()=>o[key]===i;s.style.cssText=`min-width:26px;height:26px;padding:0 7px;border-radius:8px;display:flex;align-items:center;justify-content:center;font:700 11px Inter,sans-serif;cursor:pointer;border:2px solid ${sel()?'#fff':'transparent'};background:${isCol?(Array.isArray(v)?v[0]:v):'#3a3a5a'}`;if(!isCol)s.textContent=v;
      s.addEventListener('click',e=>{e.preventDefault();o[key]=i;[...r.children].forEach((c,j)=>c.style.borderColor=j===i?'#fff':'transparent');draw();});r.appendChild(s);});opts.appendChild(r);};
  row('TYPE','sex',['Man','Vrouw']);row('HUID','skin',CUST_OPT.skin,1);row('KAPSEL','hair',['Strak','Golven','Hanenkam','Staart']);row('HAARKLEUR','hairC',CUST_OPT.hairC,1);row('KLEDING','outfit',['Polo','Shirt','Leer','Top']);row('KLEUR KLEDING','top',CUST_OPT.top,1);row('BAARD','beard',['Geen','Stoppels','Kort']);row('KLEUR','c',CUST_OPT.c,1);
  const sl=document.createElement('div');sl.style.cssText='font-size:11px;font-weight:800;opacity:.8;margin:8px 0 3px';sl.textContent='UITERLIJK OP STRAAT';opts.appendChild(sl);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:6px';
  sr.append(btnEl('‹','#3a3a5a',()=>{o.spr=(o.spr+23)%24;draw();}),btnEl('›','#3a3a5a',()=>{o.spr=(o.spr+1)%24;draw();}));[...sr.children].forEach(c=>{c.style.flex='1';c.style.margin='0';});opts.appendChild(sr);
  b.appendChild(btnEl('✔  OPSLAAN EN NU SPELEN','#ff2e88',()=>{o.name=(nm.value||'IK').trim();lsSet(CUST_KEY,JSON.stringify(o));const ch=custRegister();if(MODE==='play'&&ch){P.ch=ch;noteAdd('NIEUW PERSONAGE',ch.name+' staat klaar. Je vindt hem ook op het keuzescherm.','#7dff6a',220);menuClose();}}));
  b.appendChild(btnEl('⟵  TERUG','#3a3a5a',menuRender));ov.replaceChildren(b);draw();}
// knop in de balk rechtsboven
(function(){const tb=document.getElementById('topBtns');if(!tb)return;const d=document.createElement('div');d.className='sb';d.id='bMenu';d.title='Menu';d.innerHTML='<svg viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="13.5" width="6" height="6" rx="1.5"/></svg>';d.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menuOpen();});tb.insertBefore(d,tb.firstChild);})();
window.addEventListener('keydown',e=>{if(MODE==='play'&&(e.code==='Tab'||e.code==='KeyO')){e.preventDefault();const ov=document.getElementById('menuOv');if(ov&&ov.style.display==='flex')menuClose();else menuOpen();}});
window.addEventListener('pointerdown',e=>{if(MODE!=='play')return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,m=HUDX.misRect;
  const ov=document.getElementById('menuOv'),open=(ov&&ov.style.display==='flex')||NET.open||(document.getElementById('nameDlg')||{}).open;
  if(paused&&!open&&!bigMap){paused=false;e.preventDefault();e.stopPropagation();return;}
  if(!paused&&!open&&!bigMap&&HUDX.cards)for(const c of HUDX.cards)if(x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h){c.fn();e.preventDefault();e.stopPropagation();return;}},true);
