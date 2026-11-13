// ====================== audio (80s synthwave, zelf gegenereerd) ======================
const AU={c:null,on:lsGet('gtb6music')!=='0',timer:null,step:0,nextT:0};
const BPM=104,SPB=60/BPM/4,mf=m=>440*Math.pow(2,(m-69)/12);
const PROG=[{r:45,n:[57,60,64]},{r:41,n:[53,57,60]},{r:48,n:[55,60,64]},{r:43,n:[55,59,62]}];
const MEL=[[0,0,76,4],[0,4,74,2],[0,6,72,2],[0,8,71,4],[0,12,72,4],[1,0,72,6],[1,6,69,2],[1,8,72,4],[1,12,74,4],[2,0,76,4],[2,4,79,4],[2,8,76,4],[2,12,74,4],[3,0,74,8],[3,8,71,4],[3,12,67,4],
 [4,0,76,4],[4,4,74,2],[4,6,72,2],[4,8,71,4],[4,12,69,4],[5,0,72,4],[5,4,77,4],[5,8,76,4],[5,12,72,4],[6,0,79,6],[6,6,76,2],[6,8,72,4],[6,12,76,4],[7,0,74,12],[7,12,71,4]];
function auInit(){
  if(AU.c)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  try{
  const c=new AC();AU.c=c;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.connect(c.destination);
  AU.master=c.createGain();AU.master.gain.value=.85;AU.master.connect(comp);
  AU.mus=c.createGain();AU.mus.gain.value=AU.on?.5:0;AU.mus.connect(AU.master);
  AU.sfx=c.createGain();AU.sfx.gain.value=.8;AU.sfx.connect(AU.master);
  const d=c.createDelay(1);d.delayTime.value=SPB*3;const fb=c.createGain();fb.gain.value=.33;const dl=c.createBiquadFilter();dl.type='lowpass';dl.frequency.value=2400;d.connect(dl);dl.connect(fb);fb.connect(d);const dg=c.createGain();dg.gain.value=.55;dl.connect(dg);dg.connect(AU.mus);AU.del=d;
  const len=c.sampleRate*2|0,ib=c.createBuffer(2,len,c.sampleRate);for(let k=0;k<2;k++){const a=ib.getChannelData(k);for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  const cvb=c.createConvolver();cvb.buffer=ib;const rg=c.createGain();rg.gain.value=.4;cvb.connect(rg);rg.connect(AU.mus);AU.rev=cvb;
  const nb=c.createBuffer(1,c.sampleRate,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;AU.noise=nb;
  // motor
  const curve=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;curve[i]=(1+3)*x/(1+3*Math.abs(x));}
  const eo=c.createOscillator();eo.type='sawtooth';eo.frequency.value=40;const eo2=c.createOscillator();eo2.type='square';eo2.frequency.value=20;const e2g=c.createGain();e2g.gain.value=.55;
  const ws=c.createWaveShaper();ws.curve=curve;const ef=c.createBiquadFilter();ef.type='lowpass';ef.frequency.value=500;ef.Q.value=3;const eg=c.createGain();eg.gain.value=0;
  eo.connect(ws);eo2.connect(e2g);e2g.connect(ws);ws.connect(ef);ef.connect(eg);eg.connect(AU.sfx);eo.start();eo2.start();AU.eo=eo;AU.eo2=eo2;AU.ef=ef;AU.eg=eg;
  const wo=c.createOscillator();wo.type='triangle';wo.frequency.value=220;const wg=c.createGain();wg.gain.value=0;wo.connect(wg);wg.connect(AU.sfx);wo.start();AU.wo=wo;AU.wg=wg;
  const tb=c.createBufferSource();tb.buffer=AU.noise;tb.loop=true;const tbf=c.createBiquadFilter();tbf.type='lowpass';tbf.frequency.value=240;const tbg=c.createGain();tbg.gain.value=0;tb.connect(tbf);tbf.connect(tbg);tbg.connect(AU.sfx);tb.start();AU.tbg=tbg;
  const wl=c.createBufferSource();wl.buffer=AU.noise;wl.loop=true;const wlf=c.createBiquadFilter();wlf.type='bandpass';wlf.frequency.value=480;wlf.Q.value=.6;const wlg=c.createGain();wlg.gain.value=0;wl.connect(wlf);wlf.connect(wlg);wlg.connect(AU.sfx);wl.start(0,.5);AU.wlg=wlg;
  const sk=c.createBufferSource();sk.buffer=AU.noise;sk.loop=true;const sbf=c.createBiquadFilter();sbf.type='bandpass';sbf.frequency.value=2400;sbf.Q.value=5;const skg=c.createGain();skg.gain.value=0;sk.connect(sbf);sbf.connect(skg);skg.connect(AU.sfx);sk.start();AU.sbf=sbf;AU.skg=skg;
  // sirene
  const so=c.createOscillator();so.type='square';so.frequency.value=760;const lfo=c.createOscillator();lfo.type='square';lfo.frequency.value=1.4;const lg=c.createGain();lg.gain.value=170;lfo.connect(lg);lg.connect(so.frequency);const sf=c.createBiquadFilter();sf.type='lowpass';sf.frequency.value=1600;const sg=c.createGain();sg.gain.value=0;so.connect(sf);sf.connect(sg);sg.connect(AU.sfx);so.start();lfo.start();AU.sg=sg;
  }catch(e){AU.c=null;}
}
function env(g,t,a,peak,hold,rel){g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(.0001,t+a+hold+rel);}
function tone(type,f,t,a,hold,rel,peak,dest,cut,det){const c=AU.c,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;if(det)o.detune.value=det;let n=o;if(cut){const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.connect(fl);n=fl;}n.connect(g);for(const d of dest)g.connect(d);env(g,t,a,peak,hold,rel);o.start(t);o.stop(t+a+hold+rel+.05);}
function noiseHit(t,dur,peak,ft,fq,dest,q){const c=AU.c,s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type=ft;f.frequency.value=fq;if(q)f.Q.value=q;const g=c.createGain();s.connect(f);f.connect(g);for(const d of dest)g.connect(d);env(g,t,.002,peak,0,dur);s.start(t,Math.random()*.4);s.stop(t+dur+.05);}
function kick(t,dest){const c=AU.c,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.13);o.connect(g);g.connect(dest||AU.mus);env(g,t,.002,.85,.02,.28);o.start(t);o.stop(t+.4);}
function playStep(s,t){
  const bar=(s>>4)%16,st=s&15,ch=PROG[bar%4],M=[AU.mus];
  if(bar>=2){if(st%4===0)kick(t);if(st===4||st===12||(bar===15&&st>12)){noiseHit(t,.24,.42,'bandpass',1900,[AU.mus,AU.rev],.7);tone('triangle',190,t,.001,0,.08,.22,M);}
    if(st%2===0)noiseHit(t,st%4===2?.07:.03,st%4===2?.11:.05,'highpass',8000,M);}
  if(bar>=1&&st%2===0)tone('sawtooth',mf(ch.r+(st%4===2?12:0)),t,.005,SPB*.9,.07,.19,M,700);
  tone('square',mf(ch.n[[0,1,2,1][st%4]]+12+(st>=8?12:0)),t,.003,SPB*.35,.08,.04,[AU.mus,AU.del],2300);
  if(st===0)for(const n of ch.n)for(const dt of [-9,9])tone('sawtooth',mf(n),t,.5,SPB*16-1.1,.6,.02,[AU.mus,AU.rev],1500,dt);
  if(bar>=8)for(const e of MEL)if(e[0]===bar-8&&e[1]===st){tone('sawtooth',mf(e[2]),t,.01,e[3]*SPB-.06,.14,.065,[AU.mus,AU.del,AU.rev],2800);tone('square',mf(e[2]),t,.01,e[3]*SPB-.06,.14,.03,[AU.mus],2000,7);}
}
function synthStart(){if(!AU.c)return;if(AU.c.state==='suspended')AU.c.resume();if(AU.timer)return;AU.nextT=AU.c.currentTime+.12;AU.step=0;
  AU.timer=setInterval(()=>{const c=AU.c;if(!c)return;while(AU.nextT<c.currentTime+.16){if(AU.on)playStep(AU.step,AU.nextT);AU.nextT+=SPB;AU.step++;}},25);}
const radio=new Audio();radio.src='assets/music.mp3';radio.loop=true;radio.preload='auto';radio.setAttribute('playsinline','');let RADIO_OK=true;
radio.addEventListener('ended',()=>{try{radio.currentTime=0;}catch(e){}if(AU.on)radio.play().catch(()=>{});});
radio.addEventListener('pause',()=>{if(AU.on&&radio.ended){try{radio.currentTime=0;}catch(e){}radio.play().catch(()=>{});}});
radio.addEventListener('error',()=>{if(!RADIO_OK)return;RADIO_OK=false;if(AU.on&&MODE!=='tap')synthStart();});
function musicPlay(restart){if(!AU.on)return;if(RADIO_OK){if(restart){try{radio.currentTime=0;}catch(e){}}radio.volume=MODE==='play'?.45:.9;const pr=radio.play();if(pr&&pr.catch)pr.catch(err=>{if(err&&err.name==='NotAllowedError'){NEED_TAP=true;document.getElementById('snd').style.display='flex';}});}else synthStart();}
function musicToggle(){AU.on=!AU.on;lsSet('gtb6music',AU.on?'1':'0');if(AU.c)AU.mus.gain.setTargetAtTime(AU.on?.5:0,AU.c.currentTime,.1);if(AU.on)musicPlay();else radio.pause();updMusIcon();}
function sfx(kind,v,w){if(!AU.c)return;const t=AU.c.currentTime,S=[AU.sfx];
  if(kind==='splash'){noiseHit(t,.32,.45,'lowpass',1600,S);tone('sine',520,t,.002,.02,.12,.15,S);}
  else if(kind==='throw')noiseHit(t,.12,.16,'highpass',2500,S);
  else if(kind==='crash'){const k=Math.min(1,v/7);noiseHit(t,.18+k*.25,.22+k*.45,'lowpass',700+k*700,S);kick(t,AU.sfx);for(let i=0;i<3;i++)tone('square',rr(240,1700),t+rr(0,.03),.001,.01,rr(.08,.25),.03+.05*k,S,3200);
    if(v>4.5)for(let i=0;i<6;i++)tone('sine',rr(2500,5200),t+rr(.03,.28),.001,.005,.08,.045,S);}
  else if(kind==='step'){const r=v||0,soft=w===1;if(soft){noiseHit(t,.09,.035+.02*r,'bandpass',rr(500,800),S,.8);}else{tone('sine',rr(68,92),t,.004,0,.07,.07+.04*r,S);noiseHit(t+.004,.06,.035+.025*r,'lowpass',rr(260,420),S,.7);noiseHit(t+rr(.018,.03),.03,.012+.012*r,'bandpass',rr(1300,2100),S,2);}}
  else if(kind==='swim')noiseHit(t,.22,.12,'bandpass',rr(700,1100),S,1.2);
  else if(kind==='hit'){const k=v||1;kick(t,AU.sfx);noiseHit(t,.12,.35*k,'lowpass',900,S);const o=AU.c.createOscillator(),f=AU.c.createBiquadFilter(),gg=AU.c.createGain();o.type='sawtooth';const f0=rr(380,620);o.frequency.setValueAtTime(f0,t+.05);o.frequency.exponentialRampToValueAtTime(f0*.55,t+.3);f.type='bandpass';f.frequency.value=rr(900,1300);f.Q.value=3;o.connect(f);f.connect(gg);gg.connect(AU.sfx);env(gg,t+.05,.01,.16*k,.08,.16);o.start(t+.05);o.stop(t+.4);}
  else if(kind==='blip'){const n=2+(Math.random()*3|0),base=v||rr(220,420);for(let i=0;i<n;i++)tone('square',base*rr(.85,1.25),t+i*.075,.004,.03,.03,.018,S,1600);}
  else if(kind==='whoosh'){const pan=clamp(w||0,-1,1),c=AU.c,src=c.createBufferSource();src.buffer=AU.noise;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=.9;f.frequency.setValueAtTime(500,t);f.frequency.linearRampToValueAtTime(260,t+.6);const gg=c.createGain();let node=gg;if(c.createStereoPanner){const pn=c.createStereoPanner();pn.pan.setValueAtTime(pan,t);pn.pan.linearRampToValueAtTime(-pan,t+.6);gg.connect(pn);node=pn;}src.connect(f);f.connect(gg);node.connect(AU.sfx);gg.gain.setValueAtTime(.0001,t);gg.gain.linearRampToValueAtTime(.05*(v||1),t+.25);gg.gain.exponentialRampToValueAtTime(.0001,t+.7);src.start(t,Math.random()*.3);src.stop(t+.75);}
  else if(kind==='gull'){for(let i=0;i<2;i++){const c=AU.c,o=c.createOscillator(),gg=c.createGain(),tt=t+i*.32;o.type='triangle';o.frequency.setValueAtTime(2300,tt);o.frequency.exponentialRampToValueAtTime(1300,tt+.26);o.connect(gg);gg.connect(AU.sfx);env(gg,tt,.02,.02,.1,.12);o.start(tt);o.stop(tt+.32);}}
  else if(kind==='bellc'){for(let i=0;i<3;i++)for(const [m,a] of [[1,.05],[2.4,.025],[3,.02],[4.5,.012]])tone('sine',196*m,t+i*1.4,.005,0,2.4,a,S);}
  else if(kind==='horn'){tone('square',415,t,.01,.28,.05,.035,S,1800);tone('square',520,t,.01,.28,.05,.03,S,1800);}
  else if(kind==='bell'){tone('sine',2100,t,.001,.02,.25,.06,S);tone('sine',2100,t+.18,.001,.02,.25,.05,S);}
  else if(kind==='boom'){noiseHit(t,1.2,.9,'lowpass',380,S);kick(t,AU.sfx);}
  else if(kind==='bump')tone('triangle',140,t,.002,.02,.12,.25,S);
  else if(kind==='sting'){for(const [n,i] of [[57,0],[60,1],[64,2]])tone('sawtooth',mf(n-12),t+i*.12,.01,.5,.6,.08,[AU.sfx],1400);}
  else if(kind==='brake'){const k=clamp(v||1,.2,1.3),c=AU.c,pan=clamp(w||0,-1,1);let out=AU.sfx;if(c.createStereoPanner&&pan){const pn=c.createStereoPanner();pn.pan.value=pan;pn.connect(AU.sfx);out=pn;}
    const o=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o2.type='square';const f0=rr(2300,2900);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*.82,t+.55);o2.frequency.setValueAtTime(f0*1.007,t);o2.frequency.linearRampToValueAtTime(f0*.8,t+.55);
    f.type='bandpass';f.frequency.value=f0;f.Q.value=6;o.connect(f);o2.connect(f);f.connect(g);g.connect(out);env(g,t,.03,.035*k,.3*k,.25);o.start(t);o2.start(t);o.stop(t+.7);o2.stop(t+.7);
    const src=c.createBufferSource();src.buffer=AU.noise;const nf=c.createBiquadFilter();nf.type='bandpass';nf.frequency.value=1700;nf.Q.value=1.5;const ng=c.createGain();src.connect(nf);nf.connect(ng);ng.connect(out);env(ng,t,.02,.05*k,.25*k,.25);src.start(t,Math.random()*.3);src.stop(t+.7);}
  else if(kind==='bark'){const k=v||1,n=1+(Math.random()*2|0),c=AU.c,big=Math.random()<.5;for(let i=0;i<n;i++){const tt=t+i*rr(.17,.24),o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),f0=big?rr(330,420):rr(560,720);
      o.type='sawtooth';o.frequency.setValueAtTime(f0*.8,tt);o.frequency.linearRampToValueAtTime(f0*1.25,tt+.03);o.frequency.exponentialRampToValueAtTime(f0*.6,tt+.12);f.type='bandpass';f.frequency.value=big?900:1400;f.Q.value=2.2;o.connect(f);f.connect(g);g.connect(AU.sfx);env(g,tt,.006,.09*k,.03,.08);o.start(tt);o.stop(tt+.2);
      noiseHit(tt,.07,.05*k,'bandpass',big?1100:1800,S,1.5);}}
  else if(kind==='moped'){const c=AU.c,pan=clamp(w||0,-1,1),o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();let out=g;o.type='sawtooth';const f0=rr(95,130);o.frequency.setValueAtTime(f0*1.2,t);o.frequency.linearRampToValueAtTime(f0*.85,t+1.6);f.type='lowpass';f.frequency.value=1300;o.connect(f);f.connect(g);
    if(c.createStereoPanner){const pn=c.createStereoPanner();pn.pan.setValueAtTime(pan,t);pn.pan.linearRampToValueAtTime(-pan,t+1.6);g.connect(pn);out=pn;}out.connect(AU.sfx);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.03*(v||1),t+.6);g.gain.exponentialRampToValueAtTime(.0001,t+1.7);o.start(t);o.stop(t+1.8);}
  else if(kind==='rumble'){const c=AU.c,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(rr(38,48),t);o.frequency.linearRampToValueAtTime(rr(30,38),t+2.2);f.type='lowpass';f.frequency.value=260;o.connect(f);f.connect(g);g.connect(AU.sfx);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.06*(v||1),t+.9);g.gain.exponentialRampToValueAtTime(.0001,t+2.4);o.start(t);o.stop(t+2.5);}
  else if(kind==='jump'){const c=AU.c,o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(520,t+.12);o.connect(g);g.connect(AU.sfx);env(g,t,.005,.06,.03,.08);o.start(t);o.stop(t+.2);noiseHit(t,.1,.05,'highpass',2000,S);}
  else if(kind==='organ'){for(const [n,i] of [[48,0],[55,0],[60,0],[64,.5],[67,1],[72,1.5]])for(const m of [1,2,4])tone(m===1?'sawtooth':'sine',mf(n)*m,t+i,.12,2.6-i*.6,1.4,.03/m,[AU.sfx,AU.rev],1800);}
  else if(kind==='reward'){for(const [n,i] of [[72,0],[76,.1],[79,.2],[84,.32]])tone('square',mf(n),t+i,.005,.12,.3,.05,[AU.sfx],3000);}
  else if(kind==='kassa'){tone('sine',1568,t,.002,.05,.5,.08,S);tone('sine',2093,t+.09,.002,.08,.7,.08,S);noiseHit(t,.08,.1,'highpass',4000,S);}
  else if(kind==='slap'){noiseHit(t,.09,.6,'highpass',1800,S);noiseHit(t,.05,.4,'bandpass',900,S,1);kick(t,AU.sfx);}
  else if(kind==='kiss'){const c=AU.c,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(1300,t+.12);o.connect(g);g.connect(AU.sfx);env(g,t,.01,.08,.04,.1);o.start(t);o.stop(t+.3);noiseHit(t+.11,.05,.12,'bandpass',2500,S,2);}
  else if(kind==='rub'){noiseHit(t,.09,.05,'bandpass',rr(900,1400),S,1.2);}
  else if(kind==='mmm'){const c=AU.c,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),vib=c.createOscillator(),vg=c.createGain();o.type='triangle';const f0=rr(230,280);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*1.12,t+.25);o.frequency.linearRampToValueAtTime(f0*.95,t+.6);
    vib.frequency.value=5.5;vg.gain.value=4;vib.connect(vg);vg.connect(o.frequency);f.type='lowpass';f.frequency.value=900;o.connect(f);f.connect(g);g.connect(AU.sfx);env(g,t,.08,.07,.3,.25);o.start(t);vib.start(t);o.stop(t+.8);vib.stop(t+.8);}
  else if(kind==='door')tone('square',90,t,.002,.03,.06,.12,S,500);}

