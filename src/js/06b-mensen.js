// ====================== mensen-sprites ======================
// assets/people.png: PSX-personages (voetgangers + politie, van bovenaf) en Universal Base-personages
// (strandgangers en zonnebaders). Gemaakt met tools/render_people.py; voorkant/hoofd wijst naar +x.
const PPL=new Image();let PPL_OK=false;PPL.onload=()=>{PPL_OK=true;};PPL.src='assets/people.png';
const PPL_SPR={"civ": [[0, 0, 64, 112], [0, 114, 64, 112], [0, 228, 63, 124], [0, 354, 64, 123], [0, 479, 64, 122], [0, 603, 64, 107], [0, 712, 64, 104], [0, 818, 64, 112], [0, 932, 64, 108], [0, 1042, 63, 122], [0, 1166, 64, 134], [0, 1302, 64, 131], [0, 1435, 64, 140], [0, 1577, 64, 120], [0, 1699, 64, 128], [0, 1829, 64, 112], [0, 1943, 63, 109], [0, 2054, 64, 115], [0, 2171, 64, 112], [0, 2285, 64, 125], [0, 2412, 64, 118], [0, 2532, 64, 114], [0, 2648, 64, 122], [0, 2772, 64, 119]], "cop": [[0, 2893, 64, 114], [0, 3009, 64, 114], [0, 3125, 64, 110], [0, 3237, 64, 115]], "walk": [[0, 3354, 60, 149], [0, 3505, 60, 149], [0, 3656, 60, 149], [0, 3807, 60, 149], [0, 3958, 60, 149]], "lie": [[0, 4109, 130, 62], [0, 4173, 130, 62], [0, 4237, 130, 73], [0, 4312, 130, 62], [0, 4376, 130, 72], [0, 4450, 130, 62]], "player": [[0, 4516, 60, 149], [0, 4667, 60, 149]]};
const RUG=new Image();let RUG_OK=false;RUG.onload=()=>{RUG_OK=true;};RUG.src='assets/rug.webp';
function pplSpr(kind,i){const L=PPL_SPR[kind];return L[(i==null?Math.random()*L.length:i)|0];}
// teken een staand persoon (r=atlas-rechthoek), breedte over de schouders ~w wereld-px
function drawPplSprite(r,w,anim,moving,run,legC){const sc=w/r[3],L=r[2]*sc,s=moving?Math.sin(anim*(run?.5:.7))*(run?10:6.2):0;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(2,2,L*.42,w*.42,0,0,TAU);ctx.fill();
  // benen: van heup naar voet, om en om naar voren/achteren (rennen = grotere passen)
  ctx.lineCap='round';for(const sd of [-1,1]){const fx=s*sd,fy=sd*w*.14;ctx.strokeStyle=legC||'#2a2622';ctx.lineWidth=w*.21;ctx.beginPath();ctx.moveTo(0,fy);ctx.lineTo(fx,fy);ctx.stroke();ctx.fillStyle='#141210';ctx.beginPath();ctx.ellipse(fx+(fx>=0?1.4:-1.4),fy,2.9,1.9,0,0,TAU);ctx.fill();}
  const bob=moving?1+Math.abs(Math.sin(anim))*.04:1;ctx.save();ctx.scale(bob,bob);ctx.drawImage(PPL,r[0],r[1],r[2],r[3],-L/2,-w/2,L,w);ctx.restore();}
// strand-decor (TOPDOWN Nature Beach Island pack, verkleind tot één atlas)
const BEACHA=new Image();let BEACHA_OK=false;BEACHA.onload=()=>{BEACHA_OK=true;};BEACHA.src='assets/beach.webp';
const BEACH_SPR={"sailboat": [0, 0, 92, 160], "tower": [94, 0, 104, 160], "surf": [200, 0, 125, 160], "chair": [327, 0, 134, 160], "castle": [463, 0, 146, 160], "umbrella": [611, 0, 160, 153], "bush": [773, 0, 138, 160], "palm": [0, 162, 120, 160], "palm2": [122, 162, 159, 160], "kayak": [283, 162, 160, 142], "rowboat": [445, 162, 160, 133], "oats": [607, 162, 124, 160], "rock": [733, 162, 160, 101], "shell": [895, 162, 119, 160], "bottle": [0, 324, 66, 160], "fire": [68, 324, 150, 160], "hammock": [220, 324, 160, 118], "tiki": [382, 324, 160, 158]};
