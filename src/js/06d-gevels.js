// Gevels uit het Quaternius-pakket (assets/facades.webp) als herhalend patroon op de muren
const FAC_IMG=new Image();let FAC_PAT=null;
FAC_IMG.onload=()=>{FAC_PAT=FAC_META.map(m=>{const c=document.createElement('canvas');c.width=m.w;c.height=m.h;c.getContext('2d').drawImage(FAC_IMG,m.x,m.y,m.w,m.h,0,0,m.w,m.h);return wctx.createPattern(c,'repeat');});if(typeof markDirty==='function')markDirty();};
FAC_IMG.src='assets/facades.webp';
const FAC_BY={};FAC_META.forEach((m,i)=>{(FAC_BY[m.m+'_'+m.lit]=FAC_BY[m.m+'_'+m.lit]||[]).push(i);});
const FAC_MX=new DOMMatrix();
function pickFacade(b,h){
  if(b.castle||b.noFac||b.wt||b.kind==='church'||b.kind==='civic'||b.kind==='tower'||b.kind==='pylon'||b.kind==='gate'||b.kind==='houseboat'||b.pass||b.ht<20)return;
  const a=(b.bb[2]-b.bb[0])*(b.bb[3]-b.bb[1]),r=(h>>>3)%100;let m;
  if(b.ms)m=(b.bb[2]-b.bb[0])*(b.bb[3]-b.bb[1])>16000?(r<50?2:1):(r<55?1:0);else if(b.ws||b.gen)m=r<74?0:1;else if(b.flat||a>14000)m=r<50?2:1;else m=r<55?0:(r<92?1:2);
  const L=FAC_BY[m+'_'+((h>>>9)%100<45?1:0)];b.fac=L[(h>>>12)%L.length];
  if(m===2)b.roof=['#4a3a2e','#55402f','#3f3631'][(h>>>4)%3];
}
// muur a→q met dakrand-verschuiving d (=r[i]-a), gevulde quad is al als pad gezet
function fillFacade(b,a,q,d,ln){const m=FAC_META[b.fac],pat=FAC_PAT[b.fac],n=Math.max(1,Math.round(ln/m.ww)),sx=ln/n/m.w,ex=(q[0]-a[0])/ln,ey=(q[1]-a[1])/ln;
  FAC_MX.a=ex*sx;FAC_MX.b=ey*sx;FAC_MX.c=-d[0]/m.h;FAC_MX.d=-d[1]/m.h;FAC_MX.e=a[0]+d[0];FAC_MX.f=a[1]+d[1];pat.setTransform(FAC_MX);ctx.fillStyle=pat;ctx.fill();}
