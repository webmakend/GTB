// ====================== intro: artwork, logo, laadbalk ======================
const ARTS=['assets/art1.jpg','assets/art2.jpg','assets/art3.jpg'];
const TIPS=['Tip: met 💧 gooi je waterballonnen naar voorbijgangers','Tip: in het water ben je veilig voor agenten te voet','Tip: tik op de minikaart voor de grote kaart','Tip: knijp of gebruik ＋ en － om te zoomen','Tip: de VelzArt-auto is zwart met witte letters','Tip: boeren uit Gameren en Nieuwaal laten hun trekker niet graag los'];
let slideIdx=0,slideTimer=null,loadDone=false;
function setupIntro(){
  const box=document.getElementById('slides'),dots=document.getElementById('dots');box.innerHTML='';dots.innerHTML='';
  ARTS.forEach((src,i)=>{const d=document.createElement('div');d.className='slide'+(i===0?' on':'');d.innerHTML=`<div class="slideBg" style="background-image:url('${src}')"></div><div class="slideImg" style="background-image:url('${src}')"></div>`;box.appendChild(d);const dt=document.createElement('i');if(i===0)dt.className='on';dots.appendChild(dt);});
  clearInterval(slideTimer);slideIdx=0;slideTimer=setInterval(nextSlide,3800);
}
function nextSlide(){const sl=[...document.querySelectorAll('.slide')],dt=[...document.querySelectorAll('#dots i')];if(!sl.length)return;const cur=sl[slideIdx],ni=(slideIdx+1)%sl.length,nx=sl[ni];
  sl.forEach(s=>{if(s!==cur&&s!==nx){s.style.transition='none';s.classList.remove('on','off');}});nx.style.transition='none';nx.classList.remove('on','off');void nx.offsetWidth;nx.style.transition='';sl.forEach(s=>{s.style.transition='';});
  cur.classList.remove('on');cur.classList.add('off');nx.classList.add('on');dt.forEach((d,i)=>d.classList.toggle('on',i===ni));slideIdx=ni;}
function runLoader(fast){
  loadDone=false;const fill=document.getElementById('loadFill'),pct=document.getElementById('loadPct'),tip=document.getElementById('loadTip'),lb=document.getElementById('loadBox'),pl=document.getElementById('play');
  lb.style.opacity=1;lb.style.display='block';pl.classList.remove('show');let ti=Math.random()*TIPS.length|0;tip.textContent=TIPS[ti];
  const waits=[...ARTS,'assets/logo.png'].map(src=>new Promise(r=>{const im=new Image();im.onload=im.onerror=r;im.src=src;}));
  if(document.fonts&&document.fonts.load)waits.push(document.fonts.load('40px Anton').catch(()=>{}));
  let real=0;waits.forEach(w=>w.then(()=>{real++;}));
  const t0=performance.now(),minT=fast?1600:5200;let shown=0;
  const tick=()=>{const tt=performance.now()-t0,frac=Math.min(1,tt/minT),target=Math.min(frac,(real+1)/(waits.length+1)+.15,1);shown+=(Math.max(shown,target)-shown)*.12;if(real>=waits.length&&tt>=minT)shown=Math.min(1,shown+.03);
    fill.style.width=(shown*100).toFixed(1)+'%';pct.textContent=Math.round(shown*100)+'%';if(((tt/2600)|0)!==ti%1000&&tt%2600<20){}
    if(shown>=.999){loadDone=true;lb.style.opacity=0;setTimeout(()=>{lb.style.display='none';pl.classList.add('show');},450);return;}requestAnimationFrame(tick);};
  requestAnimationFrame(tick);const tipIv=setInterval(()=>{if(loadDone){clearInterval(tipIv);return;}ti=(ti+1)%TIPS.length;tip.textContent=TIPS[ti];},2600);
}

// ---- korte filmische intro vóór het startscherm (tik = overslaan)
let CINE_DONE=false;
function playCine(){if(CINE_DONE)return;CINE_DONE=true;const d=document.createElement('div');d.id='cine';
  const L=[['ZALTBOMMEL','Een vestingstad aan de Waal.'],['','Grachten. Klinkers. Een kerk van 800 jaar.'],['','Rustig. Gezellig.'],['','Té rustig.']];
  d.innerHTML=`<div class="cbg" style="background-image:url('${ARTS[1]}')"></div><div class="cbar t"></div><div class="cbar b"></div><div class="csir"></div><div class="ctx"></div><div class="cflash"></div><div class="clogo"><img src="assets/logo.png" alt=""><b>GRAND THEFT BOMMEL</b></div><div class="cskip">TIK OM OVER TE SLAAN ›</div>`;
  document.body.appendChild(d);const tx=d.querySelector('.ctx'),tm=[];let gone=false;
  const show=(a,b)=>{tx.classList.remove('on');setTimeout(()=>{tx.innerHTML=(a?`<i>${a}</i>`:'')+`<span>${b}</span>`;void tx.offsetWidth;tx.classList.add('on');},180);};
  const end=()=>{if(gone)return;gone=true;tm.forEach(clearTimeout);d.classList.add('out');setTimeout(()=>d.remove(),650);};
  const at=(ms,f)=>tm.push(setTimeout(f,ms));
  L.forEach((l,i)=>at(250+i*1250,()=>show(l[0],l[1])));
  at(5100,()=>{tx.classList.remove('on');d.classList.add('siren');try{buzz([40,60,40]);}catch(e){}});
  at(5900,()=>show('','Tijd om de stad over te nemen.'));
  at(7300,()=>{tx.classList.remove('on');d.classList.remove('siren');d.classList.add('slam');});
  at(9600,end);
  d.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();end();});}
