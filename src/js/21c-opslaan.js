// ====================== opslaan & verder spelen ======================
// Eén opslagplek in de browser (localStorage). De eerste keer vraagt het spel je naam;
// daarna verschijnt jouw spel als extra personage vooraan in de keuze: "VERDER ALS <NAAM>".
const SAVE_KEY='gtb_save_v1';
function getSave(){try{const s=JSON.parse(lsGet(SAVE_KEY)||'null');return s&&s.name?s:null;}catch(e){return null;}}
function writeSave(silent){const old=getSave();const name=(old&&old.name)||lsGet('gtb_name');if(!name){askName(()=>writeSave(silent));return;}
  const s={name,base:P.ch?P.ch.id:'vince',x:Math.round(P.x),y:Math.round(P.y),money:+P.money.toFixed(2),stage:MIS.stage,done:!!MIS.done,gold:!!MIS.gold,stats:P.stats,hp:Math.round(P.hp),t:Date.now()};
  if(P.car){s.x=Math.round(P.car.x);s.y=Math.round(P.car.y);}lsSet(SAVE_KEY,JSON.stringify(s));if(!silent){msg('OPGESLAGEN',`Volgende keer: kies "${name.toUpperCase()}" om verder te spelen`,'#7dff6a',170);sfx('reward');}}
function askName(cb){const wasP=paused;paused=true;let m=document.getElementById('nameDlg');
  if(!m){m=document.createElement('div');m.id='nameDlg';m.style.cssText='position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(8,4,20,.8)';
    m.innerHTML='<div style="width:min(88vw,380px);background:#1a0a2c;border:2px solid #ff2e88;border-radius:16px;padding:20px;color:#fff;font-family:Inter,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.6)"><div style="font:400 30px Anton,Impact,sans-serif;color:#ffd166;letter-spacing:1px">JOUW NAAM</div><div style="margin:6px 0 14px;font-size:14px;opacity:.85">Je spel wordt bewaard onder deze naam. Je ziet hem straks als extra personage bij het kiezen.</div><input id="nameIn" maxlength="14" autocomplete="off" placeholder="Bijv. Roy" style="width:100%;padding:12px 14px;border-radius:10px;border:2px solid #36d1ff;background:#0b0418;color:#fff;font:700 18px Inter,sans-serif;outline:none"><div style="display:flex;gap:10px;margin-top:14px"><button id="nameNo" style="flex:1;padding:12px;border-radius:10px;border:1px solid #666;background:transparent;color:#ccc;font:700 14px Inter">ANNULEER</button><button id="nameOk" style="flex:2;padding:12px;border-radius:10px;border:0;background:#ff2e88;color:#fff;font:800 15px Inter;letter-spacing:1px">OPSLAAN</button></div></div>';
    document.body.appendChild(m);}
  m.style.display='flex';const inp=document.getElementById('nameIn');inp.value='';setTimeout(()=>inp.focus(),50);
  const close=()=>{m.style.display='none';paused=wasP;};
  document.getElementById('nameNo').onclick=close;
  const ok=()=>{const v=inp.value.trim().replace(/[<>&"]/g,'').slice(0,14);if(!v){inp.style.borderColor='#ff4f6d';return;}lsSet('gtb_name',v);close();cb&&cb();};
  document.getElementById('nameOk').onclick=ok;inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')ok();};}
function savedCard(){const s=getSave();if(!s)return null;const b=CHARS.find(c=>c.id===s.base)||CHARS[0];
  return Object.assign({},b,{id:'save',save:s,base:b,name:s.name.toUpperCase(),c:'#7dff6a',sub:`VERDER SPELEN · MISSIE ${Math.min(3,s.stage===4?3:s.stage===3?2:s.stage===2?2:1)}${s.done&&s.stage>=4?' ✓':''} · €${s.money.toFixed(2).replace('.',',')}`});}
function applySave(s){const sp=snap(SPAWN[0],SPAWN[1]);P.x=sp[0];P.y=sp[1];camX=P.x;camY=P.y;P.money=s.money||0;P.stats=Object.assign({nat:0,omver:0,gejat:0},s.stats||{});P.hp=s.hp||P.maxhp;
  MIS.gold=!!s.gold;setStage(s.stage||1);if(s.done)MIS.done=true;MBAN=null;
  const s2=snap(P.x,P.y);if(footBlocked(P.x,P.y)){P.x=s2[0];P.y=s2[1];}
  setTimeout(()=>{if(MODE==='play')missionBanner('WELKOM TERUG, '+s.name.toUpperCase(),MIS.done?'Alle missies zijn klaar. Verken Bommel op je eigen manier!':(MIS_DO[MIS.stage]||''),'#7dff6a',300);},1200);}
// automatisch bewaren bij missie-voortgang (alleen als er al een naam is)
let _lastStage=0;setInterval(()=>{if(MODE==='play'&&getSave()&&(MIS.stage!==_lastStage||MIS.done)){_lastStage=MIS.stage;writeSave(true);}},4000);
