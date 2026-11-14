// ====================== autoradio ======================
// In een auto: R (of de 📻-knop) wisselt van zender. Buiten de auto speelt gewoon de achtergrondmuziek.
const RADIO={st:0,inCar:false,show:0,seq:null,talk:null,step:0};
const STATIONS=[{n:'RADIO BOMMEL',s:'De hits van de Bommelerwaard',c:'#ffd166'},{n:'HENKIE FM',s:'Live uit Café Henkie, Waterstraat 4',c:'#ff7ad9'},{n:'WAAL WAVE 8-BIT',s:'Chiptunes van de dijk',c:'#36d1ff'},{n:'BOMMEL PRAAT',s:'Nieuws, weer en roddels',c:'#7dff6a'},{n:'RADIO UIT',s:'',c:'#aaaaaa'}];
const PRAAT=['Goedenavond Bommel! Het is zomer, het is warm en de Waal ligt er prachtig bij.','Verkeersinformatie: druk op de Martinus Nijhoffbrug. Rij voorzichtig, of niet, dat moet u zelf weten.','De politie meldt een golf van fietsendiefstallen in de Boschstraat. Zet uw fiets op slot!','Bij Café Henkie in de Waterstraat draait vanavond weer de beste muziek van de vesting.','Het weer: droog en zonnig, ideaal voor een ijsje bij de ijssalon.','Gezocht: een gouden munt met een B erop. Er zouden er vijfentwintig verstopt liggen in de stad.','Een wandelaar meldt een glinstering in het park bij de oude watertoren. Wat zou dat zijn?','Maarten van Rossum zou trots zijn op deze stad. Of hij zou hem plunderen.','Reclame: Patatje oorlog bij de friettent op de Gamerschestraat. Lekker vet!','Dit was Bommel Praat. Blijf veilig, en blijf weg bij de wildplassers.'];
function radioAllOff(){try{barMusic.pause();}catch(e){}if(RADIO.seq){clearInterval(RADIO.seq);RADIO.seq=null;}if(RADIO.talk){clearTimeout(RADIO.talk);RADIO.talk=null;}try{speechSynthesis.cancel();}catch(e){}}
function radioPlay(){radioAllOff();const st=RADIO.st;
  if(st===0){if(AU.on)musicPlay();radio.volume=.5;}
  else{try{radio.pause();}catch(e){}}
  if(st===1){barMusic.volume=.55;barMusic.play().catch(()=>{});}
  if(st===2){auInit();RADIO.step=0;const S=[AU.sfx],mel=[0,4,7,12,7,4,9,7,5,9,12,9,7,4,2,4],bas=[0,0,-5,-5,-3,-3,-7,-7];RADIO.seq=setInterval(()=>{if(!AU.c)return;const t=AU.c.currentTime+.02,i=RADIO.step++;const f=k=>440*Math.pow(2,(k-9)/12);
      tone('square',f(mel[i%16]+(Math.floor(i/32)%2?2:0)),t,.002,.05,.08,.05,S,2600);if(i%2===0)tone('triangle',f(bas[(i>>2)%8]-12),t,.002,.12,.1,.09,S);if(i%4===0)kick(t,AU.sfx);if(i%4===2)noiseHit(t,.05,.08,'highpass',6000,S);},125);}
  if(st===3){const say=()=>{if(RADIO.st!==3||!RADIO.inCar)return;try{auInit();const t=AU.c.currentTime;tone('sine',880,t,.01,.08,.1,.08,[AU.sfx]);tone('sine',1320,t+.12,.01,.08,.15,.08,[AU.sfx]);
      const u=new SpeechSynthesisUtterance(rpick(PRAAT));u.lang='nl-NL';const v=speechSynthesis.getVoices().find(v=>/^nl/i.test(v.lang));if(v)u.voice=v;u.rate=1.05;u.pitch=.9;setTimeout(()=>speechSynthesis.speak(u),500);}catch(e){}RADIO.talk=setTimeout(say,14000);};say();}
}
function radioStep(){const inCar=!!P.car&&!CLUB.on&&!(typeof FPV!=='undefined'&&FPV.on);
  if(inCar&&!RADIO.inCar){RADIO.inCar=true;if(!P.car.t.bike){radioPlay();RADIO.show=150;}}
  else if(!inCar&&RADIO.inCar){RADIO.inCar=false;radioAllOff();if(RADIO.st!==0&&AU.on&&!CLUB.on)musicPlay();radio.volume=.45;}
  if(inCar&&!P.car.t.bike&&(pressed.KeyR||touch.radio)){touch.radio=false;RADIO.st=(RADIO.st+1)%STATIONS.length;radioPlay();RADIO.show=150;sfx('blip');}
  if(RADIO.show>0)RADIO.show--;}
function radioHud(){if(RADIO.show<=0||!P.car)return;ctx=fctx;const s=STATIONS[RADIO.st],a=Math.min(1,RADIO.show/30),y=CW<640?uiTop().top+(MINI_S||120)+60:uiTop().top+80;ctx.globalAlpha=a;
  ctx.font='26px Anton, Impact, sans-serif';const w=Math.max(ctx.measureText('📻 '+s.n).width,140)+40;ctx.fillStyle='rgba(10,4,24,.85)';rrect(ctx,CW/2-w/2,y,w,s.s?62:44,14);ctx.fill();ctx.strokeStyle=s.c;ctx.lineWidth=2;rrect(ctx,CW/2-w/2,y,w,s.s?62:44,14);ctx.stroke();
  txt('📻 '+s.n,CW/2,y+8,24,s.c,'center');if(s.s)txt(s.s+(IS_TOUCH?'':'   ·   R = volgende'),CW/2,y+40,11.5,'#fff','center','Inter, sans-serif');ctx.globalAlpha=1;ctx=wctx;}
