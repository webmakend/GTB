// ====================== personage kiezen ======================
let pickIdx=0,PICK=[];
function buildPick(){const cards=document.getElementById('cards'),dots=document.getElementById('pickDots');cards.innerHTML='';dots.innerHTML='';const sc=savedCard();PICK=sc?CHARS.concat([sc]):CHARS.slice();
  PICK.forEach((ch,i)=>{const el=document.createElement('div');el.className='card';el.style.setProperty('--c',ch.c);
    el.innerHTML=`<div class="art"${ch.img?` style="background:radial-gradient(circle at 70% 30%,#fff3c4 0,#ffd166 12%,rgba(255,122,77,0) 30%),linear-gradient(180deg,${ch.bg[2]},${ch.bg[1]} 55%,${ch.bg[0]})"`:''}>${ch.img?`<img src="${ch.img}" alt="${ch.name}" decoding="async">`:portraitSVG(ch,i)}<div class="nm"><b>${ch.name}</b>${ch.sub?`<small style="display:block;font:800 12px Inter,sans-serif;letter-spacing:1px;color:#7dff6a;text-shadow:0 1px 3px #000">${ch.sub}</small>`:''}</div></div>
      <button class="kies" data-i="${i}">${ch.save?'VERDER ALS '+ch.name:'KIES '+ch.name}</button>${ch.save?'<div class="srow"><button class="bew">✏️ NAAM</button><button class="look">🎭 UITERLIJK</button></div><button class="wis">🗑 VERWIJDER '+ch.name+'</button>':''}`;cards.appendChild(el);const d=document.createElement('i');dots.appendChild(d);});
  cards.querySelectorAll('.kies').forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.i)));
  cards.querySelectorAll('.wis').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(!b.dataset.arm){b.dataset.arm=1;b.textContent='ZEKER? TIK NOG EEN KEER';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent='🗑 VERWIJDER';}},3000);return;}deleteSave();}));
  cards.querySelectorAll('.bew').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();clearInterval(autoIv);const s=getSave();if(!s)return;askName(()=>{const n=lsGet('gtb_name');const s2=getSave();if(s2&&n){s2.name=n;lsSet(SAVE_KEY,JSON.stringify(s2));}buildPick();},null,s.name);}));
  cards.querySelectorAll('.look').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();clearInterval(autoIv);const s=getSave();if(!s)return;const ids=CHARS.map(c=>c.id),i=ids.indexOf(s.base);s.base=ids[(i+1)%ids.length];lsSet(SAVE_KEY,JSON.stringify(s));sfx('blip');buildPick();}));
  cards.addEventListener('scroll',updPick,{passive:true});const st=()=>{scrollToCard(sc?PICK.length-1:0,false);updPick();};setTimeout(st,30);setTimeout(st,350);setTimeout(st,1000);}
function scrollToCard(i,smooth){const cards=document.getElementById('cards'),el=cards.children[i];if(!el)return;cards.scrollTo({left:el.offsetLeft-(cards.clientWidth-el.clientWidth)/2,behavior:smooth?'smooth':'auto'});}
function updPick(){const cards=document.getElementById('cards'),mid=cards.scrollLeft+cards.clientWidth/2;let best=0,bd=1e9;[...cards.children].forEach((el,i)=>{const d=Math.abs(el.offsetLeft+el.clientWidth/2-mid);if(d<bd){bd=d;best=i;}const k=clamp(1-d/(el.clientWidth*1.2),0,1);el.style.transform=`scale(${.9+.1*k})`;el.style.opacity=.55+.45*k;});
  pickIdx=best;[...document.querySelectorAll('#pickDots i')].forEach((d,i)=>d.classList.toggle('on',i===best));}
let autoIv=null;
function showPick(){if(MODE!=='intro'||!loadDone)return;MODE='pick';document.getElementById('pick').style.display='flex';buildPick();clearInterval(autoIv);let k=0;
  autoIv=setInterval(()=>{if(MODE!=='pick'||getSave()){clearInterval(autoIv);return;}k=(k+1)%PICK.length;scrollToCard(k,true);},2600);
  const stop=()=>{clearInterval(autoIv);};const cards=document.getElementById('cards');['pointerdown','touchstart','wheel'].forEach(ev=>cards.addEventListener(ev,stop,{once:true,passive:true}));
  ['pPrev','pNext'].forEach(id=>document.getElementById(id).addEventListener('click',stop,{once:true}));}
const LINES={vince:'Tijd voor actie.',joey:"Yeah, let's go!",lola:'Bommel, hier kom ik!',roxy:"Let's go, schatjes!"};
function speak(txt,ch){try{const ss=window.speechSynthesis;if(!ss)return;ss.cancel();const u=new SpeechSynthesisUtterance(txt);const vs=ss.getVoices();const fem=ch.id==='lola'||ch.id==='roxy';
  const nl=vs.filter(v=>/^nl/i.test(v.lang));const en=vs.filter(v=>/^en/i.test(v.lang));const pool=/[a-z]'s|yeah|let's/i.test(txt)&&en.length?en:(nl.length?nl:vs);
  const pref=pool.find(v=>fem?/female|vrouw|ellen|claire|fenna|colette|zira|samantha|karen/i.test(v.name):/male|man|xander|maarten|daniel|david|alex/i.test(v.name))||pool[0];if(pref){u.voice=pref;u.lang=pref.lang;}
  u.pitch=fem?1.15:.75;u.rate=1.02;u.volume=1;ss.speak(u);}catch(e){}}
let chosen=false;
function choose(i){if(chosen)return;chosen=true;clearInterval(autoIv);const pc=PICK[i]||CHARS[0],ch=pc.save?pc.base:pc;P.ch=ch;const SV=pc.save||null;P.maxhp=100;P.hp=P.maxhp;const line=SV?('Daar ben ik weer!'):(LINES[ch.id]||"Yeah, let's go!");
  const L2=document.getElementById('lets'),T2=document.getElementById('letsT');L2.style.setProperty('--c',ch.c);T2.style.setProperty('--c',ch.c);T2.textContent=line.toUpperCase();L2.style.display='flex';T2.style.animation='none';void T2.offsetWidth;T2.style.animation='';
  speak(line,ch);sfx('sting');const go=()=>{document.getElementById('pick').style.display='none';document.getElementById('intro').style.display='none';clearInterval(slideTimer);startPlay();if(SV)applySave(SV);};
  setTimeout(()=>{L2.style.display='none';chosen=false;if(SV)go();else{const nw=()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}go();setTimeout(()=>writeSave(true),400);};askName(nw,()=>{if(!lsGet('gtb_name'))lsSet('gtb_name',ch.name.charAt(0)+ch.name.slice(1).toLowerCase());nw();},(getSave()||{}).name||lsGet('gtb_name')||'');}},1700);}
if(window.speechSynthesis){try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices();}catch(e){}}
document.getElementById('pPrev').addEventListener('click',()=>scrollToCard(Math.max(0,pickIdx-1),true));
document.getElementById('pNext').addEventListener('click',()=>scrollToCard(Math.min(PICK.length-1,pickIdx+1),true));
function deleteSave(){try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem('gtb_name');localStorage.removeItem(PRG_KEY);}catch(e){}
  Object.assign(PRG,{hist:[],xp:0,lvl:1,coins:[],ach:[],day:'',streak:0,gun:false,robs:0,jobs:0,races:0,dirty:false});P.inv=['balloon'];P.wid='balloon';syncWpn();PRG.inv=['balloon'];buildPick();sfx('slap');}
