// ====================== gebied rond v.v. WNC en de tennisclub (zoals op de luchtfoto): boomgaarden langs de Heideweg, parkeerplaats bij de kantine ======================
function WBT(x,y){const s=WD.wb&&WD.wb.sc;return s?[s.cx+(x-s.cx)*s.k,s.cy+(y-s.cy)*s.k]:[x,y];}
(function(){if(!WD.wb)return;const K=(WD.wb.sc&&WD.wb.sc.k)||1;const hw=(WD.roads||[]).filter(r=>r.n==='Heideweg'&&r.p.length===2)[0];
  if(hw){const [A,B]=[hw.p[0],hw.p[1]],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
    const strip=(t0,t1,o0,o1)=>{const P=(t,o)=>[Math.round(A[0]+ux*L*t+nx*o),Math.round(A[1]+uy*L*t+ny*o)];return [P(t0,o0),P(t1,o0),P(t1,o1),P(t0,o1),P(t0,o0)];};
    // aan beide kanten van de Heideweg fruitbomen in rijen (west: tussen weg en velden, oost: grote boomgaard)
    WD.orchard=WD.orchard||[];WD.orchard.push(strip(.04,.9,-45*K,-300*K),strip(.05,.62,45*K,560*K));}
  // parkeerplaats bij de kantine van WNC
  const so=(WD.pitch||[]).filter(p=>p.s==='soccer');if(so.length){
    const [cx,cy]=WBT(5835,850),a=.84,w=150*K,h=70*K,ca=Math.cos(a),sa=Math.sin(a),pt=(u,v)=>[Math.round(cx+u*ca-v*sa),Math.round(cy+u*sa+v*ca)];WD.parking.push([pt(-w,-h),pt(w,-h),pt(w,h),pt(-w,h),pt(-w,-h)]);WD._wncPark=[cx,cy,a,w,h];}})();
