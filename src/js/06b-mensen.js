// ====================== mensen-sprites ======================
// assets/people.png: PSX-personages (voetgangers + politie, van bovenaf) en Universal Base-personages
// (strandgangers en zonnebaders). Gemaakt met tools/render_people.py; voorkant/hoofd wijst naar +x.
const PPL=new Image();let PPL_OK=false;PPL.onload=()=>{PPL_OK=true;};PPL.src='assets/people.png';
const PPL_SPR={"civ": [[0, 0, 64, 112], [0, 114, 64, 112], [0, 228, 63, 124], [0, 354, 64, 123], [0, 479, 64, 122], [0, 603, 64, 107], [0, 712, 64, 104], [0, 818, 64, 112], [0, 932, 64, 108], [0, 1042, 63, 122], [0, 1166, 64, 134], [0, 1302, 64, 131], [0, 1435, 64, 140], [0, 1577, 64, 120], [0, 1699, 64, 128], [0, 1829, 64, 112], [0, 1943, 63, 109], [0, 2054, 64, 115], [0, 2171, 64, 112], [0, 2285, 64, 125], [0, 2412, 64, 118], [0, 2532, 64, 114], [0, 2648, 64, 122], [0, 2772, 64, 119]], "cop": [[0, 2893, 64, 114], [0, 3009, 64, 114], [0, 3125, 64, 110], [0, 3237, 64, 115]], "walk": [[0, 3354, 60, 149], [0, 3505, 60, 149], [0, 3656, 60, 149], [0, 3807, 60, 149], [0, 3958, 60, 149]], "lie": [[0, 4109, 130, 62], [0, 4173, 130, 62], [0, 4237, 130, 73], [0, 4312, 130, 62], [0, 4376, 130, 72], [0, 4450, 130, 62]]};
const RUG=new Image();let RUG_OK=false;RUG.onload=()=>{RUG_OK=true;};RUG.src='assets/rug.webp';
function pplSpr(kind,i){const L=PPL_SPR[kind];return L[(i==null?Math.random()*L.length:i)|0];}
// teken een staand persoon (r=atlas-rechthoek), breedte over de schouders ~w wereld-px
function drawPplSprite(r,w,anim,moving){const sc=w/r[3],L=r[2]*sc,s=moving?Math.sin(anim)*3.2:0;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(2,2,L*.42,w*.42,0,0,TAU);ctx.fill();
  ctx.fillStyle='#1d1a18';ctx.beginPath();ctx.ellipse(s,-w*.16,2.6,1.7,0,0,TAU);ctx.ellipse(-s,w*.16,2.6,1.7,0,0,TAU);ctx.fill();
  const bob=moving?1+Math.abs(Math.sin(anim))*.04:1;ctx.save();ctx.scale(bob,bob);ctx.drawImage(PPL,r[0],r[1],r[2],r[3],-L/2,-w/2,L,w);ctx.restore();}
