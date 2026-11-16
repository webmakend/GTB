// ====================== 3D op straathoogte (proef): het rondje in de Weerdenborch, Waardenburg ======================
// Een eigen kleine WebGL-weergave: de huizen uit de kaart worden opgetrokken (baksteen onder, wit stucwerk boven, grijze
// pannendaken), de grond is dezelfde kaart als in het spel, met bomen, lantaarnpalen en de geparkeerde auto's. Je begint
// voor Weerdenborch 51 en kijkt het rondje in. Alleen in dit gebied; daarbuiten blijft het spel 2D.
const ST3={on:false,x:0,y:0,yaw:0,pitch:-.04,gl:null,cv:null,prog:null,meshes:null,C:null,mv:[0,0],look:null,joy:null,keys:{},bob:0,t:0};
const S3=8,S3R=560; // 8 wereld-pixels per meter; straal van het 3D-gebied in wereld-pixels
function st3Home(){const b=BUILDINGS.find(q=>String(q.oid)==='273945986');return b||null;}
function st3Center(){const r=ROADS.find(q=>q.n==='Weerdenborch'&&q.p.length===5);if(r){let x=0,y=0;for(const q of r.p){x+=q[0];y+=q[1];}return [x/r.p.length-40,y/r.p.length];}const b=st3Home();return b?[b.cx+110,b.cy-260]:null;}
// ---- textures (canvas)
function st3Tex(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;}
function st3WallTex(white){return st3Tex(256,256,(g,w,h)=>{
  // boven: wit stucwerk met raam; onder: baksteen (of ook wit) met groot raam
  g.fillStyle='#f3f1ec';g.fillRect(0,0,w,h/2);g.fillStyle='rgba(0,0,0,.035)';for(let i=0;i<300;i++)g.fillRect(Math.random()*w,Math.random()*h/2,2,2);
  if(white){g.fillStyle='#efede7';g.fillRect(0,h/2,w,h/2);}else{g.fillStyle='#a8683f';g.fillRect(0,h/2,w,h/2);g.fillStyle='rgba(60,30,15,.35)';for(let y=h/2;y<h;y+=8){g.fillRect(0,y,w,1.5);for(let x=((y/8)&1)*12;x<w;x+=24)g.fillRect(x,y,1.5,8);}
    for(let i=0;i<120;i++){g.fillStyle=`rgba(${120+Math.random()*60|0},${60+Math.random()*30|0},30,.25)`;g.fillRect(Math.random()*w,h/2+Math.random()*h/2,10,6);}}
  g.fillStyle='#4a5258';g.fillRect(0,h/2-4,w,6);g.fillStyle='#3d4247';g.fillRect(0,0,w,7); // daklijst en scheiding
  const win=(x,y,ww,hh)=>{g.fillStyle='#e8e8e8';g.fillRect(x-4,y-4,ww+8,hh+8);const gr=g.createLinearGradient(x,y,x+ww,y+hh);gr.addColorStop(0,'#5f7c94');gr.addColorStop(.6,'#2d3e4f');gr.addColorStop(1,'#465d70');g.fillStyle=gr;g.fillRect(x,y,ww,hh);
    g.fillStyle='#e8e8e8';g.fillRect(x+ww/2-2,y,4,hh);g.fillRect(x,y+hh*.35,ww,3);g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.moveTo(x,y);g.lineTo(x+ww*.4,y);g.lineTo(x,y+hh*.6);g.fill();};
  win(70,40,116,64);win(56,150,144,78);g.fillStyle='#5b6166';g.fillRect(0,h-10,w,10);});}
function st3RoofTex(panels){return st3Tex(128,128,(g,w,h)=>{g.fillStyle='#595f66';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,y,w,2);for(let x=((y/8)&1)*8;x<w;x+=16){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(x,y+2,14,6);}}
  if(panels){g.fillStyle='#1d2433';g.fillRect(10,14,108,64);g.strokeStyle='#8090a8';g.lineWidth=1;for(let x=10;x<=118;x+=18){g.beginPath();g.moveTo(x,14);g.lineTo(x,78);g.stroke();}for(let y=14;y<=78;y+=32){g.beginPath();g.moveTo(10,y);g.lineTo(118,y);g.stroke();}}});}
function st3TreeTex(k){return st3Tex(128,256,(g,w,h)=>{g.fillStyle='#5a4128';g.fillRect(58,120,12,136);g.fillRect(50,150,8,4);
  const cols=k?['#3f7a2c','#4f8f36','#62a446','#78b955']:['#356b28','#467f30','#5a9a3c','#6fae4c'];for(let i=0;i<70;i++){const a=Math.random()*TAU,d=Math.random()*46,x=64+Math.cos(a)*d,y=78+Math.sin(a)*d*1.05;g.fillStyle=cols[(Math.random()*cols.length)|0];g.beginPath();g.arc(x,y,10+Math.random()*12,0,TAU);g.fill();}});}
function st3SolidTex(){return st3Tex(4,4,(g)=>{g.fillStyle='#fff';g.fillRect(0,0,4,4);});}
function st3Ground(C){const x0=Math.floor((C[0]-S3R-200)/CS),y0=Math.floor((C[1]-S3R-200)/CS),x1=Math.floor((C[0]+S3R+200)/CS),y1=Math.floor((C[1]+S3R+200)/CS);
  const N=2048,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),wx0=x0*CS,wy0=y0*CS,span=Math.max(x1-x0+1,y1-y0+1)*CS,k=N/span;g.imageSmoothingQuality='high';
  for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++)g.drawImage(renderChunk(i,j),(i*CS-wx0)*k,(j*CS-wy0)*k,CS*k+1,CS*k+1);return {c,wx0,wy0,span};}
// ---- WebGL
function st3GL(){const cv=document.createElement('canvas');cv.id='st3';cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:64;display:none;touch-action:none;background:#9ec8ef';document.body.appendChild(cv);
  const gl=cv.getContext('webgl',{antialias:true,alpha:false});if(!gl)return null;ST3.cv=cv;
  const vs=`attribute vec3 p;attribute vec2 u;attribute vec3 c;uniform mat4 M;varying vec2 vu;varying vec3 vc;varying vec3 vp;void main(){vu=u;vc=c;vp=p;gl_Position=M*vec4(p,1.);}`;
  const fs=`precision highp float;uniform sampler2D T;uniform vec3 F;uniform vec3 E;uniform vec2 FR;varying vec2 vu;varying vec3 vc;varying vec3 vp;void main(){float vd=length(vp-E);vec4 t=texture2D(T,vu);if(t.a<.5)discard;vec3 col=t.rgb*vc;gl_FragColor=vec4(mix(col,F,smoothstep(FR.x,FR.y,vd)),1.);}`;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn(gl.getShaderInfoLog(o));return o;};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
  ST3.prog={pr,p:gl.getAttribLocation(pr,'p'),u:gl.getAttribLocation(pr,'u'),c:gl.getAttribLocation(pr,'c'),M:gl.getUniformLocation(pr,'M'),E:gl.getUniformLocation(pr,'E'),T:gl.getUniformLocation(pr,'T'),F:gl.getUniformLocation(pr,'F'),FR:gl.getUniformLocation(pr,'FR')};
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);return gl;}
function st3Texture(gl,canvas,repeat){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);const p2=(canvas.width&(canvas.width-1))===0&&(canvas.height&(canvas.height-1))===0;
  if(p2){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);}else gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  const wr=repeat&&p2?gl.REPEAT:gl.CLAMP_TO_EDGE;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,wr);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,wr);
  const ext=gl.getExtension('EXT_texture_filter_anisotropic');if(ext)gl.texParameterf(gl.TEXTURE_2D,ext.TEXTURE_MAX_ANISOTROPY_EXT,8);return t;}
// mesh-bouwer: driehoeken met positie (meter), uv en kleur (licht al verrekend)
function st3Mesh(){return {v:[],add(a,b,c,ua,ub,uc,col){this.v.push(...a,...ua,...col,...b,...ub,...col,...c,...uc,...col);},quad(a,b,c,d,ua,ub,uc,ud,col){this.add(a,b,c,ua,ub,uc,col);this.add(a,c,d,ua,uc,ud,col);}};}
const SUN=(()=>{const v=[.45,.8,.35],l=Math.hypot(...v);return v.map(q=>q/l);})();
function st3Light(n,base){const d=Math.max(0,n[0]*SUN[0]+n[1]*SUN[1]+n[2]*SUN[2]);const k=.58+.5*d;return [base[0]*k,base[1]*k,base[2]*k];}
const W3=(x,y)=>[(x-ST3.C[0])/S3,(y-ST3.C[1])/S3]; // wereld -> meters (x,z)
function st3Build(gl){const C=ST3.C,M={walls:st3Mesh(),wallsW:st3Mesh(),roofs:st3Mesh(),roofsP:st3Mesh(),trees:st3Mesh(),solid:st3Mesh(),ground:st3Mesh()};
  const near=(x,y,r)=>Math.hypot(x-C[0],y-C[1])<r;
  for(const b of BUILDINGS){if(!near(b.cx,b.cy,S3R+260))continue;let P=b.p.slice();if(P.length>2&&P[0][0]===P[P.length-1][0]&&P[0][1]===P[P.length-1][1])P.pop();if(P.length<3)continue;
    if(polyArea(P)<0)P.reverse(); // tegen de klok in (in wereld-y omlaag) zodat buitenkanten goed staan
    const aM=Math.abs(polyArea(P))/(S3*S3),small=aM<32,H=small?2.7:5.7,h=hashStr(String(b.oid||b.cx));const white=String(b.oid)==='273946748'||h%5===0;const WM=white?M.wallsW:M.walls;
    let run=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],[ax,az]=W3(p[0],p[1]),[bx,bz]=W3(q[0],q[1]),L=Math.hypot(bx-ax,bz-az);if(L<.05)continue;
      const nx=(bz-az)/L,nz=-(bx-ax)/L,col=st3Light([nx,0,nz],[1,1,1]),u0=run/4,u1=(run+L)/4,vt=small?.48:1;run+=L;
      WM.quad([ax,0,az],[bx,0,bz],[bx,H,bz],[ax,H,az],[u0,1],[u1,1],[u1,1-vt],[u0,1-vt],col);}
    // dak: zadeldak over de kleinste omsluitende rechthoek als het gebouw ongeveer rechthoekig is, anders plat
    const ob=st3OBB(P);const fill=Math.abs(polyArea(P))/(ob.a*ob.b*4);
    if(!small&&fill>.72){const ca=Math.cos(ob.ang),sa=Math.sin(ob.ang),pt=(u,v,y)=>{const [x,z]=W3(ob.cx+u*ca-v*sa,ob.cy+u*sa+v*ca);return [x,y,z];};const o=4,A=ob.a+o,B=ob.b+o,R=Math.min(3.4,ob.b/S3*.85),top=H+R;
      const RM=h%3===0?M.roofsP:M.roofs,sl=Math.hypot(B/S3,R);
      for(const s of [1,-1]){const n=(()=>{const e=pt(0,s*1,0),c0=pt(0,0,0);const nx=(e[0]-c0[0]),nz=(e[2]-c0[2]),l=Math.hypot(nx,nz)||1;return [nx/l*R/sl,(B/S3)/sl,nz/l*R/sl];})(),col=st3Light(n,[1,1,1]);
        const a1=pt(-A,s*B,H-.25),a2=pt(A,s*B,H-.25),r2=pt(A,0,top),r1=pt(-A,0,top),ul=(2*A/S3)/4,vl=sl/3;
        if(s>0)RM.quad(a2,a1,r1,r2,[ul,vl],[0,vl],[0,0],[ul,0],col);else RM.quad(a1,a2,r2,r1,[0,vl],[ul,vl],[ul,0],[0,0],col);}
      for(const e of [1,-1]){const g1=pt(e*ob.a,ob.b,H),g2=pt(e*ob.a,-ob.b,H),g3=pt(e*ob.a,0,top),nv=(()=>{const c0=pt(0,0,0),c1=pt(e,0,0);const nx=c1[0]-c0[0],nz=c1[2]-c0[2],l=Math.hypot(nx,nz)||1;return [nx/l,0,nz/l];})(),col=st3Light(nv,[1,1,1]);
        if(e>0)WM.add(g1,g2,g3,[0,.5],[.6,.5],[.3,.02],col);else WM.add(g2,g1,g3,[0,.5],[.6,.5],[.3,.02],col);}}
    else{const col=st3Light([0,1,0],[.82,.84,.86]);const cen=W3(b.cx,b.cy);for(let i=0;i<P.length;i++){const p=W3(P[i][0],P[i][1]),q=W3(P[(i+1)%P.length][0],P[(i+1)%P.length][1]);M.solid.add([cen[0],H+.05,cen[1]],[q[0],H+.05,q[1]],[p[0],H+.05,p[1]],[.5,.5],[.5,.5],[.5,.5],small?[.42,.4,.38]:[.36,.38,.4]);}}}
  // bomen: twee gekruiste platen
  for(const t of TREES){if(!near(t.x,t.y,S3R+120))continue;const [x,z]=W3(t.x,t.y),hh=Math.max(5,t.r/S3*2.6+2.5),ww=hh*.55,k=(t.x|0)%2;const col=[1,1,1];const um=k?.5:0;
    for(const a of [0,Math.PI/2]){const dx=Math.cos(a)*ww/2,dz=Math.sin(a)*ww/2;M.trees.quad([x-dx,0,z-dz],[x+dx,0,z+dz],[x+dx,hh,z+dz],[x-dx,hh,z-dz],[um,1],[um+.5,1],[um+.5,0],[um,0],col);M.trees.quad([x+dx,0,z+dz],[x-dx,0,z-dz],[x-dx,hh,z-dz],[x+dx,hh,z+dz],[um,1],[um+.5,1],[um+.5,0],[um,0],col);}}
  // geparkeerde auto's (zoals ze nu in het spel staan)
  for(const c of cars){if(c.state!=='ok'||!near(c.x,c.y,S3R)||c===P.car)continue;const L=(c.t.l||40)/S3*.92,Wd=(c.t.w||18)/S3*.95,col=hexRGB(c.col||'#888');const [x,z]=W3(c.x,c.y);st3Box(M.solid,x,z,c.a,L,Wd,0.25,1.05,col);st3Box(M.solid,x-Math.cos(c.a)*L*.05,z-Math.sin(c.a)*L*.05,c.a,L*.55,Wd*.9,1.05,1.5,[col[0]*.55+.15,col[1]*.55+.17,col[2]*.55+.2]);
    for(const s of [-1,1])for(const f of [-1,1]){const wx=x+Math.cos(c.a)*L*.32*f-Math.sin(c.a)*Wd*.5*s,wz=z+Math.sin(c.a)*L*.32*f+Math.cos(c.a)*Wd*.5*s;st3Box(M.solid,wx,wz,c.a,.62,.22,0,.6,[.12,.12,.13]);}}
  // zoals op de foto: een wit autootje en een donkere pick-up langs het rondje
  {const park=(a,b,col,L,Wd,tall)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dl=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/dl,ny=(b[0]-a[0])/dl,side=((mx+nx-C[0])**2+(my+ny-C[1])**2)>((mx-C[0])**2+(my-C[1])**2)?1:-1,px=mx+nx*side*18,py=my+ny*side*18,an=Math.atan2(b[1]-a[1],b[0]-a[0]);
      const [x,z]=W3(px,py);st3Box(M.solid,x,z,an,L,Wd,.3,tall?1.2:1.0,col);st3Box(M.solid,x-Math.cos(an)*L*(tall?.12:.02),z-Math.sin(an)*L*(tall?.12:.02),an,L*(tall?.45:.6),Wd*.9,tall?1.2:1.0,tall?1.85:1.5,[col[0]*.5+.12,col[1]*.5+.15,col[2]*.5+.2]);
      for(const s2 of [-1,1])for(const f of [-1,1]){const wx=x+Math.cos(an)*L*.32*f-Math.sin(an)*Wd*.5*s2,wz=z+Math.sin(an)*L*.32*f+Math.cos(an)*Wd*.5*s2;st3Box(M.solid,wx,wz,an,.66,.24,0,.64,[.1,.1,.11]);}};
    const r5=ROADS.find(q=>q.n==='Weerdenborch'&&q.p.length===5);if(r5)park(r5.p[1],r5.p[2],[.96,.96,.95],3.6,1.65,false);
    const rl=ROADS.find(q=>q.n==='Weerdenborch'&&q.p.length>10);if(rl){const i=rl.p.findIndex(q=>q[0]===6929&&q[1]===4346);const a2=i>=0?rl.p[i]:null,b2=i>=0?rl.p[i+1]:null;if(a2&&b2)park(a2,b2,[.2,.22,.25],5.3,1.95,true);}}
  // lantaarnpalen langs de Weerdenborch
  for(const r of ROADS){if(r.n!=='Weerdenborch')continue;let acc=0;for(let i=0;i<r.p.length-1;i++){const a=r.p[i],b=r.p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let d=(180-acc%180);d<L;d+=180){const t=d/L,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;if(!near(x,y,S3R))continue;
      const nx=-(b[1]-a[1])/L,ny=(b[0]-a[0])/L,px=x+nx*(r.w/2+10),py=y+ny*(r.w/2+10);if(cellAt(px,py)===BUILD)continue;const [X,Z]=W3(px,py);st3Box(M.solid,X,Z,0,.14,.14,0,6,[.22,.3,.25]);const [hx,hz]=[X-nx*.7,Z-ny*.7];st3Box(M.solid,(X+hx)/2,(Z+hz)/2,Math.atan2(-ny,-nx),.9,.12,5.85,6,[.22,.3,.25]);st3Box(M.solid,hx,hz,0,.35,.2,5.7,5.9,[.95,.95,.85]);}acc+=L;}}
  // grond: de kaart uit het spel als textuur, plus gras eromheen
  const G=st3Ground(C),gx0=(G.wx0-C[0])/S3,gz0=(G.wy0-C[1])/S3,gs=G.span/S3;M.ground.quad([gx0,0,gz0+gs],[gx0+gs,0,gz0+gs],[gx0+gs,0,gz0],[gx0,0,gz0],[0,1],[1,1],[1,0],[0,0],[1.04,1.04,1.04]);
  const tex={walls:st3Texture(gl,st3WallTex(false),true),wallsW:st3Texture(gl,st3WallTex(true),true),roofs:st3Texture(gl,st3RoofTex(false),true),roofsP:st3Texture(gl,st3RoofTex(true),true),trees:st3Texture(gl,(()=>{const a=st3TreeTex(0),b=st3TreeTex(1),c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.drawImage(a,0,0);g.drawImage(b,128,0);return c;})(),false),solid:st3Texture(gl,st3SolidTex(),false),ground:st3Texture(gl,G.c,false)};
  const out=[];for(const k in M){const arr=new Float32Array(M[k].v);if(!arr.length)continue;const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,arr,gl.STATIC_DRAW);out.push({k,buf,n:arr.length/8,tex:tex[k],cull:false});}
  // gras buiten de kaart
  return out;}
function st3Box(m,x,z,a,L,W,y0,y1,col){const ca=Math.cos(a),sa=Math.sin(a),P=(u,v,y)=>[x+u*ca-v*sa,y,z+u*sa+v*ca],l=L/2,w=W/2;const c=[[-l,-w],[l,-w],[l,w],[-l,w]];
  for(let i=0;i<4;i++){const p=c[i],q=c[(i+1)%4];const nx=(q[1]-p[1]),nz=-(q[0]-p[0]),n=Math.hypot(nx,nz);const N=[(nx*ca-nz*sa)/n,0,(nx*sa+nz*ca)/n];m.quad(P(p[0],p[1],y0),P(q[0],q[1],y0),P(q[0],q[1],y1),P(p[0],p[1],y1),[.5,.5],[.5,.5],[.5,.5],[.5,.5],st3Light(N,col));}
  m.quad(P(-l,w,y1),P(l,w,y1),P(l,-w,y1),P(-l,-w,y1),[.5,.5],[.5,.5],[.5,.5],[.5,.5],st3Light([0,1,0],col));}
function st3OBB(P){let best=null;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],ang=Math.atan2(q[1]-p[1],q[0]-p[0]),ca=Math.cos(-ang),sa=Math.sin(-ang);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    for(const r of P){const u=r[0]*ca-r[1]*sa,v=r[0]*sa+r[1]*ca;x0=Math.min(x0,u);x1=Math.max(x1,u);y0=Math.min(y0,v);y1=Math.max(y1,v);}const A=(x1-x0)*(y1-y0);
    if(!best||A<best.A){const cu=(x0+x1)/2,cv=(y0+y1)/2,c2=Math.cos(ang),s2=Math.sin(ang);best={A,ang,a:(x1-x0)/2,b:(y1-y0)/2,cx:cu*c2-cv*s2,cy:cu*s2+cv*c2};}}
  if(best.b>best.a){best={...best,ang:best.ang+Math.PI/2,a:best.b,b:best.a};}return best;}
function hashStr(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}
function hexRGB(h){h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h.slice(0,6),16)||0x888888;return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}
// ---- matrices
function st3Persp(fov,asp,n,f){const t=1/Math.tan(fov/2);return [t/asp,0,0,0,0,t,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0];}
function st3Mul(a,b){const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;}
function st3View(e,yaw,pitch){const f=[Math.cos(pitch)*Math.cos(yaw),Math.sin(pitch),Math.cos(pitch)*Math.sin(yaw)],up=[0,1,0];
  const s=[f[1]*up[2]-f[2]*up[1],f[2]*up[0]-f[0]*up[2],f[0]*up[1]-f[1]*up[0]],sl=Math.hypot(...s);s[0]/=sl;s[1]/=sl;s[2]/=sl;const u=[s[1]*f[2]-s[2]*f[1],s[2]*f[0]-s[0]*f[2],s[0]*f[1]-s[1]*f[0]];
  return [s[0],u[0],-f[0],0,s[1],u[1],-f[1],0,s[2],u[2],-f[2],0,-(s[0]*e[0]+s[1]*e[1]+s[2]*e[2]),-(u[0]*e[0]+u[1]*e[1]+u[2]*e[2]),f[0]*e[0]+f[1]*e[1]+f[2]*e[2],1];}
// ---- openen / sluiten
function st3Open(){if(ST3.on)return;const C=st3Center(),home=st3Home();if(!C){noteAdd('NIET GEVONDEN','De Weerdenborch staat niet op de kaart','#ff6b6b',150);return;}
  if(!ST3.gl){ST3.gl=st3GL();if(!ST3.gl){noteAdd('GEEN 3D','Je browser ondersteunt geen WebGL','#ff6b6b',180);return;}st3Input();}
  ST3.C=C;if(!ST3.meshes){try{ST3.meshes=st3Build(ST3.gl);}catch(e){console.warn(e);noteAdd('3D LUKT NIET','Er ging iets mis bij het opbouwen','#ff6b6b',180);return;}}
  // start voor Weerdenborch 51, kijkend het rondje in
  let sx=C[0],sy=C[1]+200;if(home){let best=null,bd=1e9;for(let a=0;a<32;a++){for(let d=10;d<200;d+=6){const x=home.cx+Math.cos(a/32*TAU)*d,y=home.cy+Math.sin(a/32*TAU)*d,c=cellAt(x,y);if(c===ROAD||c===WALK){if(d<bd){bd=d;best=[x,y];}break;}}}if(best){sx=best[0];sy=best[1];}}
  ST3.x=sx;ST3.y=sy;ST3.yaw=Math.atan2(C[1]-sy,C[0]-sx);ST3.pitch=-.03;ST3.on=true;paused=true;ST3.cv.style.display='block';st3UI(true);if(typeof voiceSay==='function')voiceSay('Kijk eens aan, het rondje in de Weerdenborch.');}
function st3Close(){ST3.on=false;ST3.cv.style.display='none';st3UI(false);paused=false;const n=snap(ST3.x,ST3.y);if(n&&!P.car){P.x=n[0];P.y=n[1];camX=P.x;camY=P.y;}}
function st3UI(on){let u=document.getElementById('st3ui');if(!u){u=document.createElement('div');u.id='st3ui';u.innerHTML='<span class="s3x">✕ TERUG NAAR 2D</span><div class="s3t"><b>WEERDENBORCH · 3D</b><small></small></div><div class="s3j"><i></i></div>';document.body.appendChild(u);
    u.querySelector('.s3x').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();st3Close();});u.querySelector('.s3t small').textContent=IS_TOUCH?'Links: lopen · rechts: rondkijken':'WASD/pijltjes: lopen · slepen: rondkijken';}
  u.style.display=on?'block':'none';}
{const st=document.createElement('style');st.textContent=`#st3ui{position:fixed;inset:0;z-index:65;pointer-events:none;display:none;font-family:Inter,sans-serif;color:#fff}
#st3ui .s3x{pointer-events:auto;position:absolute;right:calc(var(--sr) + 12px);top:calc(var(--st) + 12px);padding:10px 14px;border-radius:14px;background:rgba(20,10,36,.85);border:1.5px solid #ff2e88;font:900 12px Inter;cursor:pointer}
#st3ui .s3t{position:absolute;left:calc(var(--sl,0px) + 12px);top:calc(var(--st) + 12px);padding:8px 12px;border-radius:12px;background:rgba(20,10,36,.7)}#st3ui .s3t b{display:block;font:400 18px Anton,Impact,sans-serif;letter-spacing:1px}#st3ui .s3t small{font-size:11px;opacity:.8}
#st3ui .s3j{position:absolute;left:calc(var(--sl,0px) + 30px);bottom:calc(var(--sb) + 30px);width:120px;height:120px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(20,10,36,.25);display:${'none'}}#st3ui .s3j i{position:absolute;left:35px;top:35px;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.8)}`;document.head.appendChild(st);}
function st3Input(){const cv=ST3.cv;const pts=new Map();
  cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(_){}const left=IS_TOUCH&&e.clientX<window.innerWidth*.45;pts.set(e.pointerId,{x:e.clientX,y:e.clientY,ox:e.clientX,oy:e.clientY,left});
    if(left){ST3.joy={id:e.pointerId,x:e.clientX,y:e.clientY};const j=document.querySelector('#st3ui .s3j');j.style.display='block';j.style.left=(e.clientX-60)+'px';j.style.top=(e.clientY-60)+'px';j.style.bottom='auto';}});
  cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(p.left&&ST3.joy){const jx=clamp((e.clientX-ST3.joy.x)/50,-1,1),jy=clamp((e.clientY-ST3.joy.y)/50,-1,1);ST3.mv=[jx,jy];const k=document.querySelector('#st3ui .s3j i');k.style.left=(35+jx*35)+'px';k.style.top=(35+jy*35)+'px';}
    else{ST3.yaw+=dx*.0055;ST3.pitch=clamp(ST3.pitch-dy*.004,-1.1,.9);}});
  const up=e=>{const p=pts.get(e.pointerId);pts.delete(e.pointerId);if(p&&p.left){ST3.joy=null;ST3.mv=[0,0];const j=document.querySelector('#st3ui .s3j');j.style.display='none';j.querySelector('i').style.left='35px';j.querySelector('i').style.top='35px';}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  window.addEventListener('keydown',e=>{if(!ST3.on)return;ST3.keys[e.code]=1;if(e.code==='Escape')st3Close();},true);window.addEventListener('keyup',e=>{if(ST3.on)ST3.keys[e.code]=0;},true);}
// ---- per frame: lopen en tekenen
function st3Frame(dt){const k=ST3.keys,s=Math.min(dt,50)/1000;let f=-ST3.mv[1],r=ST3.mv[0];if(k.KeyW||k.ArrowUp)f=1;if(k.KeyS||k.ArrowDown)f=-1;if(k.KeyA)r=-1;if(k.KeyD)r=1;if(k.ArrowLeft)ST3.yaw-=1.8*s;if(k.ArrowRight)ST3.yaw+=1.8*s;
  const run=k.ShiftLeft||Math.hypot(f,r)>.95?1.6:1,sp=1.7*run*S3*s,ca=Math.cos(ST3.yaw),sa=Math.sin(ST3.yaw);const dx=(ca*f-sa*r)*sp,dy=(sa*f+ca*r)*sp;
  const ok=(x,y)=>Math.hypot(x-ST3.C[0],y-ST3.C[1])<S3R-20&&cellAt(x,y)!==BUILD&&cellAt(x+4,y)!==BUILD&&cellAt(x-4,y)!==BUILD&&cellAt(x,y+4)!==BUILD&&cellAt(x,y-4)!==BUILD;
  if(ok(ST3.x+dx,ST3.y))ST3.x+=dx;if(ok(ST3.x,ST3.y+dy))ST3.y+=dy;const moving=Math.hypot(dx,dy)>.01;if(moving)ST3.bob+=s*9*run;
  const gl=ST3.gl,cv=ST3.cv,dpr=Math.min(window.devicePixelRatio||1,2),W=Math.round(cv.clientWidth*dpr),H=Math.round(cv.clientHeight*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  gl.viewport(0,0,W,H);gl.clearColor(.66,.81,.95,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const [ex,ez]=W3(ST3.x,ST3.y),ey=1.65+(moving?Math.sin(ST3.bob)*.04:0),E=[ex,ey,ez];const Mx=st3Mul(st3Persp(1.15,W/H,.1,260),st3View(E,ST3.yaw,ST3.pitch));const pr=ST3.prog;
  gl.useProgram(pr.pr);gl.uniformMatrix4fv(pr.M,false,new Float32Array(Mx));gl.uniform3f(pr.E,...E);gl.uniform3f(pr.F,.72,.84,.95);gl.uniform2f(pr.FR,40,S3R/S3+25);gl.uniform1i(pr.T,0);gl.activeTexture(gl.TEXTURE0);
  for(const m of ST3.meshes){if(m.cull)gl.enable(gl.CULL_FACE);else gl.disable(gl.CULL_FACE);gl.bindTexture(gl.TEXTURE_2D,m.tex);gl.bindBuffer(gl.ARRAY_BUFFER,m.buf);
    gl.enableVertexAttribArray(pr.p);gl.vertexAttribPointer(pr.p,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(pr.u);gl.vertexAttribPointer(pr.u,2,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(pr.c);gl.vertexAttribPointer(pr.c,3,gl.FLOAT,false,32,20);gl.drawArrays(gl.TRIANGLES,0,m.n);}}
// ---- starten bij het rondje
{const _af=actFind;actFind=function(){const a=_af.apply(this,arguments);if(a&&a.k!=='huis')return a;const C=st3Center();if(C&&!P.car&&!SC.on&&Math.hypot(P.x-C[0],P.y-C[1])<330)return{k:'st3',t:'👀 Rondkijken in 3D: het rondje Weerdenborch',btn:'👀<br>3D'};return a;};}
{const _at=actTry;actTry=function(){const a=ACT.cur;if(a&&a.k==='st3'){st3Open();return true;}return _at.apply(this,arguments);};}
if(typeof ACT_START!=='undefined')ACT_START.add('st3');
