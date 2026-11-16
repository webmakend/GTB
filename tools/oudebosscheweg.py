# Voegt rechtsonder aan Zaltbommel een klein eiland toe: een straat vanaf het eind van de Boschstraat naar de
# Oude Bosscheweg, met de scholen (Cambium College, Gomarus, De Brug) en het bedrijventerrein (VelzArt op nummer 5,
# Personal Active op 15, Cagemax). Getekend naar de OSM-kaart die Roy stuurde (schermafbeelding), omgerekend naar spel-pixels.
# Gebruik: python3 tools/oudebosscheweg.py data/game.json
import json,sys
import numpy as np,cv2
F=sys.argv[1];g=json.load(open(F))
if g.get('obw'):print('al toegevoegd');sys.exit()
K=2.6;X0,Y0=6420,17860                     # iets kleiner dan echt, en dichter bij de Boschstraat (korte brug)
T=lambda p:[int(round(X0+p[0]*K)),int(round(Y0+p[1]*K))]
TP=lambda P:[T(q) for q in P]
BS=[6875,17442];BSJ='cut6342_5746'
# ---- land: eiland + dijkje met de straat vanaf de Boschstraat
island=TP([(15,520),(300,170),(345,40),(372,0),(480,0),(560,120),(900,180),(1050,240),(1062,850),(900,1010),(560,1040),(250,960),(150,870),(15,560)])
top=T((393,0))
def strip(a,b,w):
    a=np.array(a,float);b=np.array(b,float);d=b-a;n=np.array([-d[1],d[0]])/np.linalg.norm(d)*w;return [list(map(int,a+n)),list(map(int,b+n)),list(map(int,b-n)),list(map(int,a-n))]
mid=[(BS[0]+top[0])//2+60,(BS[1]+top[1])//2-40]
dam=strip(BS,mid,62)+[];dam2=strip(mid,top,62)
S=4;H=max(g['H'],max(q[1] for q in island)+500);W=max(g['W'],max(q[0] for q in island)+300)
def mask(polys):
    m=np.zeros((H//S+2,W//S+2),np.uint8);cv2.fillPoly(m,[np.array([[q[0]//S,q[1]//S] for q in P],np.int32) for P in polys],255);return m
add=mask([island,dam,dam2]);add=cv2.dilate(add,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
fort=mask([g['fort']]);u=cv2.bitwise_or(fort,add)
cs,_=cv2.findContours(u,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);c=max(cs,key=cv2.contourArea);c=cv2.approxPolyDP(c,1.2,True)[:,0,:]
nf=[[int(q[0]*S),int(q[1]*S)] for q in c];nf.append(nf[0])
# het oude fort precies houden waar niets veranderde: alleen het contour vervangen als het nieuwe groter is
print('fort',len(g['fort']),'->',len(nf),'punten');g['fort']=nf;g['W'],g['H']=W,H
# water dat nu onder het nieuwe land ligt weghalen
nw=[]
for P in g['water']:
    xs=[q[0] for q in P];ys=[q[1] for q in P]
    if max(xs)<min(q[0] for q in dam+island)-50 or min(ys)>H or max(ys)<BS[1]-300:nw.append(P);continue
    m=mask([P]);m=cv2.bitwise_and(m,cv2.bitwise_not(add))
    for cc in cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[0]:
        if cv2.contourArea(cc)<40:continue
        cc=cv2.approxPolyDP(cc,1.0,True)[:,0,:];Q=[[int(q[0]*S),int(q[1]*S)] for q in cc];Q.append(Q[0]);nw.append(Q)
g['water']=nw+[TP([(950,790),(1020,745),(1045,740),(1050,835),(970,835),(950,790)])]
# ---- wegen (met knooppunten zodat auto's er kunnen rijden)
J=lambda n:'obw'+str(n)
roads=[
 {'n':'Oude Bosscheweg','k':'secondary','w':62,'p':[BS,mid,top],'j':[BSJ,None,J(1)]},
 {'n':'Oude Bosscheweg','k':'secondary','w':62,'p':[top]+TP([(430,95),(520,250),(598,415),(705,545),(830,725),(850,800),(870,872)]),'j':[J(1),None,None,J(2),J(3),J(4),None,None]},
 {'n':'Oude Bosscheweg','k':'service','w':40,'p':TP([(598,415),(420,520),(235,635)]),'j':[J(2),None,None]},
 {'n':'Oude Bosscheweg','k':'residential','w':42,'p':TP([(705,545),(850,435),(1015,320)]),'j':[J(3),J(5),None]},
 {'n':'Oude Bosscheweg','k':'residential','w':38,'p':TP([(690,388),(790,330),(850,285)]),'j':[None,J(6),None]},
 {'n':'Oude Bosscheweg','k':'residential','w':38,'p':TP([(790,330),(850,435),(905,490),(965,600)]),'j':[J(6),J(5),J(7),J(8)]},
 {'n':'Oude Bosscheweg','k':'service','w':34,'p':TP([(905,490),(1015,415)]),'j':[J(7),None]},
 {'n':'Oude Bosscheweg','k':'service','w':34,'p':TP([(965,600),(1015,500)]),'j':[J(8),None]},
 {'n':'Oude Bosscheweg','k':'residential','w':40,'p':TP([(830,725),(930,660),(1015,590)]),'j':[J(4),None,None]},
 {'n':'Oude Bosscheweg','k':'residential','w':40,'p':TP([(830,725),(640,830),(440,935)]),'j':[J(4),J(9),None]},
 {'n':'Oude Bosscheweg','k':'service','w':34,'p':TP([(640,830),(700,900),(760,960)]),'j':[J(9),None,None]},
]
g['roads']+=roads
g['paths']+=[{'k':'footway','w':16,'p':TP([(420,0),(455,90),(545,245),(622,400),(728,530),(850,710),(880,800)])},   # Hogeweg (fietspad)
             {'k':'footway','w':14,'p':TP([(290,230),(110,445),(95,560),(195,632)])},{'k':'footway','w':14,'p':TP([(370,140),(475,360)])}]
# ---- gebouwen
B=[('Cambium College - De Waard','school','obw1',[(300,205),(355,185),(385,250),(380,330),(330,410),(260,470),(205,530),(120,500),(120,450),(170,400),(240,330),(300,250)]),
 ('Gomarus scholengemeenschap','school','obw2',[(495,585),(565,520),(700,640),(735,690),(605,775),(560,700),(545,610),(520,615)]),
 ('De Brug','school','obw3',[(305,775),(370,700),(400,690),(480,760),(440,800),(430,835),(350,835),(305,790)]),
 ('','yes','obw4',[(262,690),(285,670),(312,705),(290,725)]),('','yes','obw5',[(313,640),(330,630),(362,680),(345,695)]),('','yes','obw6',[(217,650),(232,640),(250,660),(235,670)]),
 ('Personal Active','commercial','obw15',[(890,290),(945,240),(990,300),(935,345)]),('Edulance','office','obw13',[(800,340),(850,300),(895,350),(845,395)]),
 ('Ferliner','office','obw11',[(710,410),(765,365),(805,420),(750,465)]),('','yes','obw1067',[(755,330),(775,320),(785,335),(765,345)]),
 ('Cagemax','commercial','obw9',[(780,505),(830,465),(875,520),(825,560)]),('Elbuco','office','obw7',[(845,610),(900,560),(940,615),(890,660)]),
 ('Kentalis Compas College','school','obw20',[(170,730),(225,725),(262,780),(262,845),(175,850)]),('','yes','obw21',[(225,640),(245,628),(262,650),(242,664)]),('','yes','obw22',[(195,675),(212,664),(228,684),(210,696)]),
 ('','commercial','obw23',[(765,80),(850,78),(842,225),(770,228)]),
 ('Sporthal & Zwembad De Waluwe','civic','obw6',[(470,960),(610,890),(680,1000),(540,1030)]),
 ('VelzArt','office','obw5v',[(905,690),(958,648),(1002,702),(950,745)]),('','yes','obw16',[(900,210),(950,205),(950,220),(902,222)])]
for n,b,i,P in B:
    Q=TP(P);Q.append(Q[0]);g['buildings'].append({'p':Q,'b':b,'n':n,'id':i,'am':''})
g['baddr'].update({'obw6':'Oude Bosscheweg 6','obw20':'Oude Bosscheweg 2b','obw5v':'Oude Bosscheweg 5','obw7':'Oude Bosscheweg 7','obw9':'Oude Bosscheweg 9','obw11':'Oude Bosscheweg 11','obw13':'Oude Bosscheweg 13','obw15':'Oude Bosscheweg 15','obw1':'Oude Bosscheweg 2','obw2':'Oude Bosscheweg 4','obw3':'Oude Bosscheweg 2a'})
BI=lambda i:[q for n,b,j,q in B if j==i][0]
c=lambda P:[sum(q[0] for q in P)//len(P),sum(q[1] for q in P)//len(P)]
for n,cat,adr,P in [('Elbuco','Bedrijf','Oude Bosscheweg 7',BI('obw7')),('Ferliner','Bedrijf','Oude Bosscheweg 11',BI('obw11')),('Edulance','Bedrijf','Oude Bosscheweg 13',BI('obw13')),('Sporthal & Zwembad De Waluwe','Binnenzwembad','Oude Bosscheweg 6',[(470,960),(610,890),(680,1000),(540,1030)]),('VelzArt','ICT-bedrijf','Oude Bosscheweg 5',BI('obw5v')),('Personal Active','Sportschool','Oude Bosscheweg 15',BI('obw15')),('Cagemax','Bedrijf','Oude Bosscheweg 9',BI('obw9'))]:
    x,y=T(c(P));g['biz'].append({'n':n,'full':n,'c':cat,'cat':cat,'adr':adr,'x':x,'y':y})
# ---- bestrating en parkeerplaatsen
g['parking']+=[TP([(650,850),(740,800),(830,890),(760,960),(650,850)]),TP([(355,140),(405,125),(560,395),(510,430),(355,140)]),TP([(240,640),(590,430),(610,450),(260,662),(240,640)]),TP([(1010,600),(1040,590),(1045,740),(1010,745),(1010,600)])]
g['plaza']+=[TP([(670,378),(890,225),(1040,255),(1045,600),(1000,610),(940,700),(860,720),(760,620),(700,520),(670,378)])]
g['green']+=[TP([(330,640),(375,620),(400,670),(355,690),(330,640)])]
g['obw']={'pool':T((650,925)),'poolP':T(c([(650,850),(740,800),(830,890),(760,960)])),'velz':T(c([q for n,b,i,q in B if i=='obw5v'][0])),'pa':T(c([q for n,b,i,q in B if i=='obw15'][0])),'top':top,'bs':BS}
json.dump(g,open(F,'w'),separators=(',',':'));print('klaar; H',H,'W',W)
