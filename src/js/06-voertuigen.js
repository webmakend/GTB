// ====================== voertuigen ======================
const CT={
 sedan:{n:'Sedan',eng:36,w:20,l:42,acc:.15,max:7,turn:.055,grip:.80,hp:100,col:['#b8322a','#2c5f9e','#e5e5e5','#2d2d2d','#7f8c8d','#2e7d4f','#6c3483','#c0622a','#c9c3b5']},
 hatch:{n:'Hatchback',eng:40,w:19,l:36,acc:.15,max:6.5,turn:.06,grip:.80,hp:85,col:['#d64541','#3a7bd5','#f1c40f','#ecf0f1','#95a5a6','#27ae60','#e67e22']},
 van:{n:'Bestelbus',eng:30,w:24,l:52,acc:.10,max:5.6,turn:.045,grip:.84,hp:150,col:['#f2f2f2','#d9d9d9','#2f4b7c','#9b2d23']},
 taxi:{n:'Taxi',eng:36,w:20,l:44,acc:.15,max:7.2,turn:.055,grip:.80,hp:100,col:['#1b1b1b']},
 sport:{n:'Sportwagen',eng:48,w:20,l:42,acc:.24,max:9.8,turn:.062,grip:.78,hp:80,col:['#e31b23','#ffd500','#111111','#1e88e5','#ff5e00']},
 police:{n:'Politie',eng:40,w:21,l:46,acc:.21,max:9,turn:.06,grip:.82,hp:130,col:['#f5f5f5']},
 velzart:{n:'VelzArt',eng:44,w:21,l:46,acc:.21,max:8.8,turn:.058,grip:.82,hp:125,col:['#0b0b0b']},
 bakfiets:{n:'Bakfiets',w:12,l:26,acc:.07,max:3.2,turn:.08,grip:.9,hp:50,ev:1,col:['#2a6f97','#7b8f3a','#a63d40']},
 fatbike:{n:'Fatbike',w:10,l:24,acc:.22,max:7.6,turn:.085,grip:.86,hp:40,ev:1,bike:1,col:['#111111','#2b2b2b','#4a4a4a','#1f3d2b','#7a0f1e']},
 tractor:{n:'Trekker',w:26,l:40,acc:.08,max:4,turn:.05,grip:.9,hp:180,eng:22,col:['#2e7d32','#c62828','#1565c0','#2e7d32']},
};
const SHIRTS=['#d64541','#3a7bd5','#f5b041','#58d68d','#af7ac5','#eeeeee','#2c3e50','#e67e22','#1abc9c','#7f8c8d','#c2185b','#f7dc6f'];
const HAIRS=['#2b1d0e','#4a3218','#d8b25a','#111111','#7a4a24','#9a9a9a','#c96f2c'];
const BALLOONC=['#ff4fa3','#36d1ff','#ffe14d','#7dff6a','#ff8a3d'];
let cars=[],peds=[],balloons=[],parts=[],decals=[],bubbles=[],barges=[],CID=0;
const P={x:0,y:0,a:0,hp:100,maxhp:100,ch:null,car:null,throwCd:0,dead:0,deadKind:'',anim:0,bust:0,heatCd:0,stats:{nat:0,omver:0,gejat:0},money:0,jz:0,jv:0,squash:0,hurtF:0,moneyF:0};
let heat=0,stars=0,camX=0,camY=0,camZ=1,shake=0,frameN=0,paused=false,bigMap=false,copTouch=false,placeName='',MODE='intro';
const msgs=[];let FX=[],SKIDS=[],hitStop=0;
function popTxt(x,y,t,c,sc){FX.push({x,y,t,c:c||'#fff',l:60,ml:60,s:sc||1,k:'t'});}
function ring(x,y,r,c){FX.push({x,y,r:r||30,c:c||'rgba(255,255,255,.9)',l:22,ml:22,k:'r'});}
function drawFX(Z){for(const f of FX){const a=f.l/f.ml,age=1-a;if(f.k==='r'){ctx.strokeStyle=f.c;ctx.globalAlpha=a;ctx.lineWidth=3*a+.5;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.2+age*1.1),0,TAU);ctx.stroke();ctx.globalAlpha=1;continue;}
    const pop=age<.18?1.35*Math.sin(age/.18*Math.PI/2)+(age/.18)*-.35+0:1,sc=f.s*(age<.18?.5+pop*.6:1)/Math.max(.55,Z);ctx.save();ctx.translate(f.x,f.y-age*38);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,a*2.2);ctx.font='22px Anton, Impact, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(f.t,0,0);ctx.fillStyle=f.c;ctx.fillText(f.t,0,0);ctx.restore();ctx.globalAlpha=1;}}
function drawSkids(vx0,vy0,vx1,vy1){ctx.lineCap='round';for(const k of SKIDS){if(k.x1<vx0-20||k.x1>vx1+20||k.y1<vy0-20||k.y1>vy1+20)continue;ctx.strokeStyle=`rgba(20,16,14,${.32*Math.min(1,k.l/300)})`;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(k.x0,k.y0);ctx.lineTo(k.x1,k.y1);ctx.stroke();}}
function msg(t,sub,col,life){msgs.length=0;msgs.push({t,sub:sub||'',col:col||'#ffd166',life:life||150,ml:life||150});}
function makeCar(type,x,y,a,driver){const t=CT[type];return{id:CID++,type,t,x,y,a,prevA:a,vx:0,vy:0,hp:t.hp,col:rpick(t.col),driver,ai:null,state:'ok',burn:0,sink:0,keep:0,dead:0,ctl:[0,0,0],hitCd:0};}
function makePed(x,y,kind){return{x,y,a:rr(0,TAU),spd:rr(.5,.9),state:'walk',kind,think:rr(30,200)|0,anim:rr(0,6),col:kind==='cop'?'#1d3f8f':rpick(SHIRTS),hair:kind==='cop'?'#14213d':rpick(HAIRS),downT:0,fleeT:0,fx:0,fy:0,cross:0,wet:0,talkCd:0};}
const fwdSpeed=c=>c.vx*Math.cos(c.a)+c.vy*Math.sin(c.a),speedOf=c=>Math.hypot(c.vx,c.vy),me=()=>P.car||P;
function edgeFrame(e,f){const Aid=f?e.a:e.b,Bid=f?e.b:e.a,A=NODES[Aid],B=NODES[Bid],ux=(B.x-A.x)/e.len,uy=(B.y-A.y)/e.len;return{Aid,Bid,A,B,ux,uy,nx:-uy,ny:ux};}
let ZU=clamp(parseFloat(lsGet('gtb6zoom'))||1,.3,2.6),zoomKick=0;
function viewZ(){return camZ*scrScale()*ZU*(1+zoomKick);}
function viewR(){return Math.hypot(CW,CH)/2/viewZ();}
function setZoom(z){ZU=clamp(z,.3,2.6);lsSet('gtb6zoom',ZU.toFixed(2));}
function scrScale(){return clamp(Math.min(CW,CH)/(CH>CW?700:800),.5,1.3);}
function offscreen(x,y,m){const Z=viewZ();m=m||80;return Math.abs(x-camX)>CW/2/Z+m||Math.abs(y-camY)>CH/2/Z+m;}
function parkNear(x,y,type){const ne=nearestEdge(x,y),e=EDGES[ne.ei],A=NODES[e.a],B=NODES[e.b],ux=(B.x-A.x)/e.len,uy=(B.y-A.y)/e.len,px=A.x+(B.x-A.x)*ne.t,py=A.y+(B.y-A.y)*ne.t;
  const side=((x-px)*-uy+(y-py)*ux)>=0?1:-1,t=CT[type],off=e.w/2-t.w/2-2;const c=makeCar(type,px-uy*off*side,py+ux*off*side,Math.atan2(uy,ux)+(side<0?Math.PI:0),null);cars.push(c);return c;}
function spawnCivCar(initial){
  const o=me();
  for(let k=0;k<16;k++){
    const ei=Math.random()*EDGES.length|0,e=EDGES[ei];if(e.len<40)continue;const f=Math.random()<.5?1:0,F=edgeFrame(e,f),s=rr(10,e.len-10);
    const parked=Math.random()<.3&&e.w>=50;
    let type='sedan';const zr=Math.random();
    if(zr<.06)type='velzart';else if(zr<.10)type='taxi';else if(zr<.15)type='sport';else if(zr<.33)type='hatch';else if(zr<.43)type='van';else if(zr<.47)type='bakfiets';else if(zr<.58)type='fatbike';else if(zr<.64)type='tractor';
    if(parked&&(type==='fatbike'||type==='tractor'))type='hatch';
    const t=CT[type],lane=parked?e.w/2-t.w/2-2:e.w/4;
    const x=F.A.x+F.ux*s+F.nx*lane,y=F.A.y+F.uy*s+F.ny*lane,d=Math.hypot(x-o.x,y-o.y);
    if(d<(initial?220:700)||d>Math.max(1350,viewR()+600))continue;if(!initial&&!offscreen(x,y))continue;
    if(cars.some(c=>Math.abs(c.x-x)<60&&Math.abs(c.y-y)<60))continue;
    const cop=!parked&&Math.random()<.05;
    const c=makeCar(cop?'police':type,x,y,Math.atan2(F.uy,F.ux),parked?null:(cop?'cop':'npc'));
    if(type==='fatbike'){c.rider=rpick(['#e74c3c','#2c3e50','#7f8c8d','#f39c12','#16a085','#8e44ad','#ecf0f1']);}if(type==='tractor')c.boer=rpick(['Gameren','Nieuwaal']);
    if(!parked){c.ai={e:ei,f,nx:-1,stun:0,wait:0,sm:type==='fatbike'?rr(1.25,1.45):rr(.85,1.08),mode:cop?'patrol':'civ',cops:cop?2:0,path:null,pi:0,repath:0,stuck:0,rev:0,revS:1};const v=e.spd*.7;c.vx=Math.cos(c.a)*v;c.vy=Math.sin(c.a)*v;}
    cars.push(c);return c;}
}
function spawnCop(){const o=me();
  for(let k=0;k<24;k++){const ei=Math.random()*EDGES.length|0,e=EDGES[ei];if(e.len<30)continue;const s=rr(5,e.len-5);let f=1,F=edgeFrame(e,1);const mx=F.A.x+F.ux*s,my=F.A.y+F.uy*s;if((o.x-mx)*F.ux+(o.y-my)*F.uy<0){f=0;F=edgeFrame(e,0);}
    const s2=f?s:e.len-s,x=F.A.x+F.ux*s2+F.nx*e.w/4,y=F.A.y+F.uy*s2+F.ny*e.w/4,d=Math.hypot(x-o.x,y-o.y);
    if(d<600||d>1100||!offscreen(x,y))continue;if(cars.some(c=>Math.abs(c.x-x)<60&&Math.abs(c.y-y)<60))continue;
    const c=makeCar('police',x,y,Math.atan2(F.uy,F.ux),'cop');c.ai={e:ei,f,nx:-1,stun:0,wait:0,sm:1,mode:'pursuit',cops:2,path:null,pi:0,repath:0,stuck:0,rev:0,revS:1};c.vx=Math.cos(c.a)*3;c.vy=Math.sin(c.a)*3;cars.push(c);return c;}}
function spawnPed(initial){const o=me();
  for(let k=0;k<14;k++){const a=rr(0,TAU),r=rr(initial?100:450,Math.max(1000,viewR()+250)),x=o.x+Math.cos(a)*r,y=o.y+Math.sin(a)*r,t=cellAt(x,y);
    if(t!==WALK&&t!==PLAZA&&t!==PATH&&t!==SAND)continue;if((t===PATH||t===SAND)&&Math.random()<.5)continue;if(!initial&&!offscreen(x,y,30))continue;const boer=Math.random()<.08,p=makePed(x,y,boer?'boer':'civ');if(!boer&&t!==SAND&&Math.random()<.14)p.dog={x:x+10,y:y+10,a:0,anim:0,col:rpick(['#8a5a2b','#2b2420','#d8b27a','#f1ede4','#6b6b6b','#b5651d']),sz:rr(.75,1.25),bark:0};if(boer){p.col='#2f5d8a';p.hair='#2e7d32';p.dorp=rpick(['Gameren','Nieuwaal']);}peds.push(p);return p;}}

