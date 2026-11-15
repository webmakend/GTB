// ====================== stem van je personage: korte Nederlandse zinnetjes (spraaksynthese van het toestel) ======================
// Gebruikt de Nederlandse stem van je telefoon/browser (Web Speech API). Aan/uit in Instellingen. Altijd met ondertitel-wolkje.
const VOICE={last:0,lastIdle:0,v:null,ok:'speechSynthesis' in window,lastStars:0,wasCar:false,hpLow:false,
  L:{auto:['Deze is nu van mij.','Sorry maat, ik leen hem even.','Lekker bakkie!','Instappen en gaan.','Even een ritje maken.'],
     fiets:['Lekker fietsen door Bommel.','Even op de fiets.'],
     politie:['Oei, de politie!','Wegwezen!','Niet vandaag, agent!','Rennen!','Ze hebben me gezien!'],
     kwijt:['Pfoe, ze zijn me kwijt.','Mooi, rust.','Weer even veilig.'],
     geld:['Kassa!','Ka-tsjing!','Dat is mooi meegenomen.','Lekker verdiend.'],
     pijn:['Au, dat doet pijn.','Ik moet naar de dokter.','Ik voel me niet zo lekker.'],
     bier:['Proost!','Nog eentje dan.','Lekker koud biertje.'],
     appel:['Mmm, lekker fris.','Vers van de boom!','Die is zuur!'],
     terug:['Dat ging niet helemaal goed.','Volgende keer beter.','Waar was ik gebleven?'],
     wb:['Waardenburg, daar ben ik dan.','Zo, de overkant van de Waal.'],
     wapen:['Nu wordt het serieus.','Kijk eens wat ik gevonden heb.'],
     idle:['Wat een mooi stadje.','Rustig dagje vandaag.','Zaltbommel, mijn stad.','Eens kijken wat er te doen is.','Ik heb trek in friet.','Even de Markt over.']}};
function voicePick(){if(!VOICE.ok)return null;const vs=speechSynthesis.getVoices().filter(v=>/^nl/i.test(v.lang));if(!vs.length)return null;
  const fem=!!(P.ch&&!P.ch.beard),femN=/claire|ellen|fleur|lotte|colette|female|vrouw|xiomara|sanne|emma|tamara|fenna/i,maleN=/xander|frank|maarten|male|man|daan|bram|ruben|arnaud/i;
  return vs.find(v=>(fem?femN:maleN).test(v.name))||vs.find(v=>/google/i.test(v.name))||vs[0];}
if(VOICE.ok){speechSynthesis.onvoiceschanged=()=>{VOICE.v=null;};}
function voiceSay(t){const o=me();bubbles=bubbles.filter(b=>!b.me);bubbles.push({p:{get x(){return me().x;},get y(){return me().y-6;}},t,life:170,me:1});
  if(!VOICE.ok||SET.voice===false||!AU.on)return;try{const u=new SpeechSynthesisUtterance(t);u.lang='nl-NL';VOICE.v=VOICE.v||voicePick();if(VOICE.v)u.voice=VOICE.v;const fem=!!(P.ch&&!P.ch.beard);u.pitch=fem?1.15:.85;u.rate=1.05;u.volume=Math.min(1,(SET.sfx??1)*1.1);speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
function voice(k,force){if(MODE!=='play'||P.dead&&k!=='terug'||CLUB.on)return;const now=performance.now();if(!force&&now-VOICE.last<9000)return;if(!force&&Math.random()<.35)return;const L=VOICE.L[k];if(!L)return;VOICE.last=now;voiceSay(rpick(L));}
function voiceStep(){if(MODE!=='play'||P.dead)return;
  if(stars>VOICE.lastStars&&stars>=1&&VOICE.lastStars===0)voice('politie',true);if(stars===0&&VOICE.lastStars>0)voice('kwijt');VOICE.lastStars=stars;
  const inCar=!!P.car;if(inCar&&!VOICE.wasCar)voice(P.car.t.bike?'fiets':'auto');VOICE.wasCar=inCar;
  const low=P.hp<30;if(low&&!VOICE.hpLow)voice('pijn',true);VOICE.hpLow=low;
  const now=performance.now();if(now-VOICE.last>45000&&now-VOICE.lastIdle>45000&&frameN%60===0&&Math.random()<.15){VOICE.lastIdle=now;voice('idle',true);}}
// haakjes in bestaande acties
{const _am=addMoney;addMoney=function(v){_am(v);if(v>=15)voice('geld');};
 const _bb=buyBeer;buyBeer=function(){const r=_bb.apply(this,arguments);voice('bier');return r;};
 const _rs=respawn;respawn=function(){_rs.apply(this,arguments);setTimeout(()=>voice('terug',true),900);};
 const _gw=giveWeapon;giveWeapon=function(w,silent){const r=_gw(w,silent);if(r&&!silent)setTimeout(()=>voice('wapen',true),1400);return r;};}
