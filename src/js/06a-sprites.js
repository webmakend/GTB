// ====================== auto-sprites (Designersoup Low Poly Car Pack, van bovenaf gerenderd) ======================
// assets/cars.png is gemaakt uit de 3D-modellen (FBX) met tools/render_cars.py: orthografisch van bovenaf,
// met belichting en een paar kleurvarianten per model. Voorkant wijst naar rechts (+x).
const CAR_ATLAS=new Image();let CAR_ATLAS_OK=false;CAR_ATLAS.onload=()=>{CAR_ATLAS_OK=true;};CAR_ATLAS.src='assets/cars.png';
// tweede atlas: Free Low Poly Vehicles Pack (Rgsdev, CC0), gerenderd met tools/render_vehicles.py
const VEH_ATLAS=new Image();VEH_ATLAS.src='assets/vehicles.png';const ATLASES=[CAR_ATLAS,VEH_ATLAS];
const CAR_SPR={"beetle": [[0, 0, 256, 103], [0, 105, 256, 103], [0, 210, 256, 103]], "delorean": [[0, 315, 256, 126]], "landy": [[0, 443, 256, 110], [0, 555, 256, 110], [0, 667, 256, 110]], "pickup": [[0, 1018, 256, 145, 1], [0, 1165, 256, 145, 1]], "racer": [[0, 1163, 256, 119], [0, 1284, 256, 119]], "hatchback": [[0, 0, 256, 143, 1], [0, 145, 256, 143, 1], [0, 290, 256, 143, 1]], "sedan": [[0, 435, 256, 140, 1]], "suv": [[0, 577, 256, 145, 1], [0, 724, 256, 145, 1], [0, 871, 256, 145, 1]], "muscle": [[0, 1312, 256, 122, 1]], "muscle_2": [[0, 1436, 256, 122, 1]], "roadster": [[0, 1560, 256, 120, 1], [0, 1682, 256, 120, 1], [0, 1804, 256, 120, 1]], "sports": [[0, 1926, 256, 120, 1], [0, 2048, 256, 120, 1], [0, 2170, 256, 120, 1]], "taxi": [[0, 2292, 256, 140, 1]], "van": [[0, 2434, 256, 125, 1], [0, 2561, 256, 125, 1]], "bus": [[0, 2688, 256, 75, 1], [0, 2765, 256, 75, 1]], "ambulance": [[0, 2842, 256, 125, 1]], "firetruck": [[0, 2969, 256, 94, 1]], "truck": [[0, 3065, 256, 164, 1], [0, 3231, 256, 164, 1]], "limousine": [[0, 3397, 256, 74, 1]]};
const TYPE_SPR={hatch:[['beetle',1.22],['hatchback',1.08]],sedan:[['delorean',1.1],['landy',1.12],['pickup',1.1],['sedan',1.08],['suv',1.08],['muscle',1.08],['muscle_2',1.08],['pickup',1.08]],sport:[['racer',1.12],['roadster',1.08],['sports',1.08]],taxi:[['taxi',1.08]],van:[['van',1.05]],bus:[['bus',1.02]],ambulance:[['ambulance',1.03]],firetruck:[['firetruck',1.02]],truck:[['truck',1.03]],limo:[['limousine',1.02]]};
function pickSprite(type){const L=TYPE_SPR[type];if(!L)return null;const [m,sc]=rpick(L),v=rpick(CAR_SPR[m]);return{r:v,sc,m};}
function drawCarSprite(c){const t=c.t,s=c.spr,r=s.r,L=t.l*s.sc,Wd=L*r[3]/r[2];
  ctx.drawImage(ATLASES[r[4]||0],r[0],r[1],r[2],r[3],-L/2,-Wd/2,L,Wd);
  if(c.state==='burning'){ctx.fillStyle='rgba(30,10,0,.35)';rrect(ctx,-L/2+2,-Wd/2+2,L-4,Wd-4,4);ctx.fill();}
  const mov=c.driver||c===P.car;if(mov){ctx.fillStyle='rgba(255,251,226,.95)';ctx.fillRect(L/2-2.5,-Wd/2+2,2.5,3.5);ctx.fillRect(L/2-2.5,Wd/2-5.5,2.5,3.5);}
  const brake=c.ctl&&c.ctl[0]<0&&fwdSpeed(c)>.4;ctx.fillStyle=brake?'#ff3030':'rgba(176,24,26,.9)';ctx.fillRect(-L/2,-Wd/2+2,2,4);ctx.fillRect(-L/2,Wd/2-6,2,4);
  if(brake){ctx.fillStyle='rgba(255,40,40,.3)';ctx.beginPath();ctx.arc(-L/2-2,-Wd/2+4,6,0,TAU);ctx.arc(-L/2-2,Wd/2-4,6,0,TAU);ctx.fill();}}
