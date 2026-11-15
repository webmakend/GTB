# Waardenburg (OSM-export) omzetten naar dezelfde coördinaten als Zaltbommel en samenvoegen in data/game.json.
# Waardenburg komt ten noorden van de Waal; de afstand over de rivier wordt ingekort zodat hij speelbaar blijft.
import xml.etree.ElementTree as ET,json,math,sys,subprocess,os,re,copy
ZOSM,WOSM,GAME,OUT=sys.argv[1:5]
CUT=dict(minlat=51.8255,maxlat=51.8384,minlon=5.2475,maxlon=5.2683)
GAP=500        # px open water tussen de oever van Zaltbommel-kaart (y=0) en de zuidoever van Waardenburg
TOP=160        # marge boven Waardenburg
zb=ET.parse(ZOSM).getroot().find('bounds')
r=ET.parse(WOSM).getroot()
inb=lambda la,lo:CUT['minlat']<=la<=CUT['maxlat'] and CUT['minlon']<=lo<=CUT['maxlon']
keep={n.get('id') for n in r.findall('node') if inb(float(n.get('lat')),float(n.get('lon')))}
root=ET.Element('osm',{'version':'0.6'});ET.SubElement(root,'bounds',dict(zb.attrib))
for n in r.findall('node'):
    if n.get('id') in keep:root.append(n)
nid=10**12
for w in r.findall('way'):
    nds=[x.get('ref') for x in w.findall('nd')];tags=w.findall('tag')
    closed=len(nds)>3 and nds[0]==nds[-1]
    if all(n in keep for n in nds):root.append(w);continue
    if closed:continue                      # vlakken die over de rand gaan laten we weg
    run=[]
    def flush():
        global nid
        if len(run)>1:
            nw=ET.SubElement(root,'way',{'id':str(nid)});nid+=1
            for q in run:ET.SubElement(nw,'nd',{'ref':q})
            for t in tags:nw.append(copy.deepcopy(t))
    for n in nds:
        if n in keep:run.append(n)
        else:flush();run=[]
    flush()
for rel in r.findall('relation'):root.append(rel)
ET.ElementTree(root).write('/tmp/wb/wb_cut.osm',encoding='utf-8')
src=open(os.path.join(os.path.dirname(__file__),'osm2world.py')).read()
src=src.replace("def inworld(p,m=400):return any(-m<x<WW+m and -m<y<HH+m for x,y in p)","def inworld(p,m=400):return True")
src=src.replace("if -100<x<WW+100 and -100<y<HH+100:out['pois']","if True:out['pois']")
src=src.replace("    if t.get('natural')=='water':out['water'].append(r1(p))","    if t.get('landuse')=='orchard':out.setdefault('orchard',[]).append(r1(p))\n    elif t.get('natural')=='water':out['water'].append(r1(p))")
src=src.replace("DRIVE={","DRIVE={'motorway':14,'motorway_link':6,'trunk':10,'primary_link':6,'secondary_link':6,")
open('/tmp/wb/o2w.py','w').write(src)
subprocess.run([sys.executable,'/tmp/wb/o2w.py','/tmp/wb/wb_cut.osm','/tmp/wb/wb_world.json'],check=True)
d=json.load(open('/tmp/wb/wb_world.json'))
# ---- alles links (west) van de A2 weg; rondom water. Landvorm = bbox (ingesprongen) rechts van de snelweg
import numpy as np
_mp=np.array([q for r in d['roads'] if r['k']=='motorway' for q in r['p']])
_a,_b=np.linalg.lstsq(np.c_[_mp[:,1],np.ones(len(_mp))],_mp[:,0],rcond=None)[0]
_res=_mp[:,0]-(_a*_mp[:,1]+_b);WOFF=_res.min()-110
def east(x,y):return x-(_a*y+_b)>WOFF

# zelfde verschuiving als island.py voor Zaltbommel
zw=json.load(open('/tmp/wb/z_world.json'));F=zw['fort'];x0=min(p[0] for p in F)-720;y0=min(p[1] for p in F)-720
la0,la1,lo0=float(zb.get('minlat')),float(zb.get('maxlat')),float(zb.get('minlon'))
kx=math.cos(math.radians((la0+la1)/2))*111320;ky=110540
PX=lambda lo:((lo-lo0)*kx+50)*9-x0;PY=lambda la:((la1-la)*ky+50)*9-y0
TRIM=2100
yS=PY(CUT['minlat'])-160-TRIM;dy=-GAP-yS        # zuidrand Waardenburg komt GAP boven y=0
bx0,bx1,by0,by1=PX(CUT['minlon']),PX(CUT['maxlon']),PY(CUT['maxlat'])+dy,-GAP
g=json.load(open(GAME))
# landpolygoon in ruwe wb_world-coördinaten: bbox 160px ingesprongen, west begrensd door de snelweg, golvende oever
import math as _m
def _pipf(x,y,P):
    c=False;j=len(P)-1
    for i in range(len(P)):
        if (P[i][1]>y)!=(P[j][1]>y) and x<(P[j][0]-P[i][0])*(y-P[i][1])/(P[j][1]-P[i][1])+P[i][0]:c=not c
        j=i
    return c
RX0,RX1=((CUT['minlon']-lo0)*kx+50)*9,((CUT['maxlon']-lo0)*kx+50)*9;RY0,RY1=((la1-CUT['maxlat'])*ky+50)*9,((la1-CUT['minlat'])*ky+50)*9
IN=160;yt,yb=RY0+IN,RY1-IN-TRIM;xr=RX1-IN-500
def wl(y):return _a*y+_b+WOFF
land=[]
def add_edge(p0,p1,amp,ph):
    L=_m.hypot(p1[0]-p0[0],p1[1]-p0[1]);n=max(2,int(L/170));nx,ny=-(p1[1]-p0[1])/L,(p1[0]-p0[0])/L
    for k in range(n):
        t=k/n;w=_m.sin(t*L*.0021+ph)*amp+_m.sin(t*L*.0077+ph*2)*amp*.4 if 0<k else 0
        land.append([p0[0]+(p1[0]-p0[0])*t+nx*w,p0[1]+(p1[1]-p0[1])*t+ny*w])
C=[[max(wl(yt),RX0+IN),yt],[xr,yt],[xr,yb],[max(wl(yb),RX0+IN),yb]]
add_edge(C[0],C[1],45,1);add_edge(C[1],C[2],45,2);add_edge(C[2],C[3],45,3);add_edge(C[3],C[0],25,4)
okp=lambda x,y:_pipf(x,y,land)
cen=lambda p:(sum(q[0] for q in p)/len(p),sum(q[1] for q in p)/len(p))
d.setdefault('orchard',[])
for k in('water','green','parking','plaza','orchard'):d[k]=[p for p in d[k] if okp(*cen(p))]
d['buildings']=[b for b in d['buildings'] if okp(*cen(b['p']))]
def cutline(pts,js=None):
    out=[];cur=[];cj=[]
    for i,q in enumerate(pts):
        if okp(q[0],q[1]):cur.append(q);cj.append(js[i] if js else None)
        else:
            if len(cur)>1:out.append((cur,cj))
            cur=[];cj=[]
    if len(cur)>1:out.append((cur,cj))
    return out
nr=[]
for r in d['roads']:
    for pts,js in cutline(r['p'],r['j']):nr.append(dict(r,p=pts,j=js))
d['roads']=nr
npth=[]
for p in d['paths']:
    for pts,_ in cutline(p['p']):npth.append(dict(p,p=pts))
d['paths']=npth
d['pois']=[p for p in d['pois'] if okp(p['x'],p['y'])]
d['addr']=[a for a in d['addr'] if okp(a['x'],a['y'])]
ZY=int(round(-(by0+IN)+TOP))
def sh(p,ddy):return [[int(round(q[0]-x0)),int(round(q[1]-y0+ddy))] for q in p]
def shz(p):return [[q[0],q[1]+ZY] for q in p]
# Zaltbommel omlaag schuiven
for k in('water','green','sand','parking','plaza','seating','islands'):g[k]=[shz(p) for p in g[k]]
g['fort']=shz(g['fort'])
for b in g['buildings']:b['p']=shz(b['p'])
for rd in g['roads']:rd['p']=shz(rd['p'])
for p in g['paths']:p['p']=shz(p['p'])
for k in('pois','biz'):
    for p in g[k]:p['y']+=ZY
# Waardenburg erbij
W2=lambda p:[[q[0],q[1]+ZY] for q in sh(p,dy)]
for k in('water','green','parking','plaza'):g[k]+= [W2(p) for p in d[k]]
nb=0
for b in d['buildings']:
    b=dict(b);b['p']=W2(b['p']);b['wb']=1;g['buildings'].append(b);nb+=1
for rd in d['roads']:
    g['roads'].append({'n':rd['n'],'k':rd['k'],'w':rd['w'],'p':W2(rd['p']),'j':['w'+j if j else None for j in rd['j']],'wb':1})
for p in d['paths']:g['paths'].append({'k':p['k'],'w':p['w'],'p':W2(p['p']),'wb':1})
for p in d['pois']:
    q=W2([[p['x'],p['y']]])[0];g['pois'].append(dict(p,x=q[0],y=q[1],wb=1))
# adressenlijst plaatsen via addr:street + huisnummer
A={}
for a in d['addr']:A.setdefault((a['s'].lower(),a['h'].lower().replace(' ','')),a)
rows=[l.split(';') for l in open(os.path.join(os.path.dirname(GAME),'waardenburg-adressen.csv'),encoding='utf-8').read().strip().split('\n')[1:]]
wbz=[];miss=[]
for cat,name,adr,pc,pl in rows:
    a=adr.split(',')[-1].strip();a=re.sub(r'\(.*?\)','',a).strip();m=re.match(r'(.+?)\s+(\d+\s*[a-zA-Z]?)$',a)
    if not m:miss.append(name);continue
    st,hn=m.group(1).lower(),m.group(2).lower().replace(' ','');hit=A.get((st,hn)) or A.get((st,re.sub(r'\D','',hn)))
    if not hit:
        rr=[x for x in d['roads'] if x['n'].lower()==st]
        if rr:
            pts=[q for x in rr for q in x['p']];q=pts[len(pts)//2];q=W2([q])[0];wbz.append({'n':name,'c':cat,'adr':adr,'x':q[0],'y':q[1],'approx':1});continue
        miss.append(name+' ('+adr+')');continue
    q=W2([[hit['x'],hit['y']]])[0];wbz.append({'n':name,'c':cat,'adr':adr,'x':q[0],'y':q[1]})
g['wbiz']=wbz;g['orchard']=[W2(p) for p in d['orchard']]
WL=W2(land);g['wb']={'bb':[min(q[0] for q in WL),min(q[1] for q in WL),max(q[0] for q in WL),max(q[1] for q in WL)],'zy':ZY,'land':WL}
g['H']=g['H']+ZY;g['W']=max(g['W'],int(max(q[0] for q in WL))+250)
json.dump(g,open(OUT,'w'),separators=(',',':'))
print('ZY',ZY,'W',g['W'],'H',g['H'],'wb bb',g['wb']['bb'],'gebouwen',nb,'wegen',len(d['roads']),'paden',len(d['paths']),'adressen',len(wbz),'niet gevonden:',miss)
