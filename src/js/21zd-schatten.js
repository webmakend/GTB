// ====================== meer verstopte schatten door het hele spel + niet spawnen op de A2 ======================
// ---- niet spawnen op of vlak naast de snelweg
function nearMoto(x,y,r){const cx=Math.floor(x/T),cy=Math.floor(y/T),n=Math.ceil(r/T);for(let dy=-n;dy<=n;dy++)for(let dx=-n;dx<=n;dx++){const X=cx+dx,Y=cy+dy;if(X<0||Y<0||X>=GW||Y>=GH)continue;if(MOTO[Y*GW+X])return true;}return false;}
{const _ok=mapSpawnOk;mapSpawnOk=function(x,y){if(nearMoto(x,y,40))return false;return _ok(x,y);};}
// ---- schatkisten: elke kist heeft zijn eigen gebied en ligt na 10 minuten weer ergens anders
const TREAS=[
  {id:'vesting1',n:'in de vesting van Zaltbommel',v:150},{id:'vesting2',n:'in de vesting van Zaltbommel',v:150},{id:'vesting3',n:'in de vesting van Zaltbommel',v:150},
  {id:'toren',n:'in het park bij de oude watertoren',v:250},{id:'wb1',n:'in het dorp Waardenburg',v:200},{id:'wb2',n:'in het dorp Waardenburg',v:200},{id:'gaard',n:'in een appelboomgaard',v:200},{id:'wnc',n:'rond sportpark WNC',v:200}];
const TSAVE=(()=>{try{return JSON.parse(lsGet('gtb_treas')||'{}')||{};}catch(e){return {};}})();
for(const t of TREAS){t.on=false;t.next=TSAVE[t.id]||0;}
function treasSpot(t){let sd=((Date.now()/600000)|0)*31+t.id.length*977+t.id.charCodeAt(t.id.length-1)*13;const rn=()=>((sd=(sd*16807+7)%2147483647)/2147483647);
  const ok=(x,y)=>{const c=cellAt(x,y);if(c===BUILD||c===WATER||c===ROAD)return false;if(nearMoto(x,y,30))return false;if(typeof isDeep==='function'&&isDeep(x,y))return false;return true;};
  let box=null,cen=null,R=0;
  if(t.id.startsWith('vesting'))box=FORTBB;else if(t.id==='toren'&&typeof WTOWER!=='undefined'&&WTOWER){cen=[WTOWER.x,WTOWER.y];R=420;}
  else if(t.id.startsWith('wb')&&WB){const c=BUILDINGS.find(b=>b.dorp)||BUILDINGS.find(b=>b.wb);if(c){cen=[c.cx,c.cy];R=1500;}}
  else if(t.id==='gaard'&&typeof ORCH!=='undefined'&&ORCH.length){const o=ORCH[(rn()*ORCH.length)|0];box=o.bb;}
  else if(t.id==='wnc'&&typeof WNCPOS!=='undefined'){if(!WNCPOS&&typeof wncInit==='function')wncInit();if(WNCPOS){cen=[WNCPOS.x,WNCPOS.y];R=900;}}
  for(let i=0;i<500;i++){let x,y;if(box){x=box[0]+rn()*(box[2]-box[0]);y=box[1]+rn()*(box[3]-box[1]);}else if(cen){const a=rn()*TAU,d=rn()*R;x=cen[0]+Math.cos(a)*d;y=cen[1]+Math.sin(a)*d;}else return false;
    if(ok(x,y)&&!(typeof CHEST!=='undefined'&&Math.hypot(x-CHEST.x,y-CHEST.y)<200)&&TREAS.every(q=>q===t||!q.on||Math.hypot(q.x-x,q.y-y)>250)){t.x=x;t.y=y;return true;}}return false;}
function treasStep(){if(MODE!=='play')return;const now=Date.now(),o=me();for(const t of TREAS){if(!t.on&&now>=t.next&&frameN%30===0){if(treasSpot(t)){t.on=true;if(t.next)noteAdd('NIEUWE SCHAT VERSTOPT','Er ligt weer een schatkist '+t.n+' (€'+t.v+')','#ffd166',220,'schat');}else t.next=now+30000;}
  if(t.on&&!P.dead&&Math.hypot(o.x-t.x,o.y-t.y)<26){t.on=false;t.next=now+600000;TSAVE[t.id]=t.next;lsSet('gtb_treas',JSON.stringify(TSAVE));addMoney(t.v);addXP(40);sfx('reward');camHit(3);buzz([30,30,60]);ring(t.x,t.y,50,'rgba(255,209,102,.95)');
    for(let i=0;i<24;i++){const a=rr(0,TAU),v=rr(1,4);parts.push({x:t.x,y:t.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:36,ml:36,s:2.2,k:'f'});}
    const left=TREAS.filter(q=>q.on).length+(CHEST.on?1:0);missionBanner('SCHAT GEVONDEN!','+€'+t.v+' · nog '+left+' schatkist'+(left===1?'':'en')+' verstopt in Bommel en Waardenburg','#ffd166',240);if(typeof buyLog==='function')buyLog('💎','Schat gevonden '+t.n,-t.v);}}}
function drawTreas(){const keep={on:CHEST.on,x:CHEST.x,y:CHEST.y};for(const t of TREAS){if(!t.on)continue;CHEST.on=true;CHEST.x=t.x;CHEST.y=t.y;drawChest();}Object.assign(CHEST,keep);}
{const _nm=netMinimap;netMinimap=function(mp,cxm,cym,S){_nm(mp,cxm,cym,S);const o=me();for(const t of TREAS){if(!t.on||Math.hypot(o.x-t.x,o.y-t.y)>700)continue;const [x,y]=mp(t.x,t.y);if(Math.hypot(x-cxm,y-cym)>S/2-6)continue;ctx.fillStyle=(frameN>>4)&1?'#ffd166':'#ff9f1c';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();}};}
{const _s=gunStep;gunStep=function(){_s();treasStep();};}
{const _d=drawTerrace;drawTerrace=function(){_d();drawTreas();};}
