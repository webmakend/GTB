# Nabewerking van data/game.json:
#  1) Waardenburg compacter: het eiland krimpt naar de huizen, straten, velden en boomgaarden (+ een rand), lege grasvlaktes worden water.
#  2) Adressen per gebouw (uit de OSM-bestanden) voor de aankooplijst: g['baddr'] = {gebouw-id: "Straat 12"}.
# Gebruik: python3 tools/postprocess.py data/game.json zaltbommel.osm waardenburg.osm
import json,sys,math
import numpy as np,cv2
import xml.etree.ElementTree as ET
GAME=sys.argv[1];g=json.load(open(GAME))
def pip(x,y,P):
    c=False;j=len(P)-1
    for i in range(len(P)):
        if (P[i][1]>y)!=(P[j][1]>y) and x<(P[j][0]-P[i][0])*(y-P[i][1])/(P[j][1]-P[i][1])+P[i][0]:c=not c
        j=i
    return c
wb=g.get('wb')
# Waardenburg 15% compacter: alles (gebouwen, straten, velden, boomgaarden, plekken) schuift naar elkaar toe; de zuidrand (Waalbandijk) blijft op zijn plek
K=0.85;LIM=10650
if wb and not wb.get('sc'):
    land=wb['land'];cx=(min(q[0] for q in land)+max(q[0] for q in land))/2;cy=max(q[1] for q in land)
    T=lambda q:[int(round(cx+(q[0]-cx)*K)),int(round(cy+(q[1]-cy)*K))]
    isw=lambda P:max(q[1] for q in P)<LIM
    def tp(P):return [T(q) for q in P]
    for k in ('water','green','parking','plaza','orchard'):
        g[k]=[tp(P) if P and isw(P) else P for P in g.get(k,[])]
    for k in ('buildings','roads','paths','rail','pitch'):
        for it in g.get(k,[]):
            if isw(it['p']):it['p']=tp(it['p'])
    for k in ('pois','wbiz'):
        for it in g.get(k,[]):
            if it['y']<LIM:it['x'],it['y']=T([it['x'],it['y']])
    for k,v in (g.get('wbspot') or {}).items():g['wbspot'][k]=T(v)
    wb['land']=tp(land);L=wb['land'];wb['bb']=[min(q[0] for q in L),min(q[1] for q in L),max(q[0] for q in L),max(q[1] for q in L)];wb['sc']={'cx':cx,'cy':cy,'k':K}
    print('Waardenburg geschaald x%.2f rond (%d,%d)'%(K,cx,cy))
if wb and not wb.get('shrunk'):
    land=wb['land'];S=8;BUF=170
    x0,y0,x1,y1=wb['bb'];W=int((x1-x0)/S)+40;H=int((y1-y0)/S)+40;ox,oy=x0-20*S,y0-20*S
    P=lambda p:np.array([[int((q[0]-ox)/S),int((q[1]-oy)/S)] for q in p],np.int32)
    old=np.zeros((H,W),np.uint8);cv2.fillPoly(old,[P(land)],255)
    f=np.zeros((H,W),np.uint8);inl=lambda p:any(pip(q[0],q[1],land) for q in p[::max(1,len(p)//4)])
    for b in g['buildings']:
        if inl(b['p']):cv2.fillPoly(f,[P(b['p'])],255)
    for k in ('pitch',):
        for p in g.get(k,[]):
            if inl(p['p']):cv2.fillPoly(f,[P(p['p'])],255)
    for k in ('parking','plaza','orchard'):
        for p in g.get(k,[]):
            if inl(p):cv2.fillPoly(f,[P(p)],255)
    for r in g['roads']+g['paths']:
        if inl(r['p']):cv2.polylines(f,[P(r['p'])],False,255,max(1,int(r.get('w',20)/S)))
    for k,v in (g.get('wbspot') or {}).items():
        if pip(v[0],v[1],land):cv2.circle(f,(int((v[0]-ox)/S),int((v[1]-oy)/S)),int(120/S),255,-1)
    r=int(BUF/S);k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(2*r+1,2*r+1))
    m=cv2.dilate(f,k);m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(41,41)))
    m=cv2.bitwise_and(m,old);m=cv2.GaussianBlur(m,(9,9),0);m=(m>127).astype(np.uint8)*255
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);c=max(cs,key=cv2.contourArea)
    c=cv2.approxPolyDP(c,2.0,True)[:,0,:]
    nl=[[int(q[0]*S+ox),int(q[1]*S+oy)] for q in c];nl.append(nl[0])
    a0=cv2.contourArea(P(land));a1=cv2.contourArea(P(nl))
    print('Waardenburg land: %d -> %d punten, oppervlak %.0f%%'%(len(land),len(nl),100*a1/a0))
    wb['land']=nl;wb['shrunk']=1;wb['bb']=[min(q[0] for q in nl),min(q[1] for q in nl),max(q[0] for q in nl),max(q[1] for q in nl)]
    cv2.imwrite('/tmp/wbland.png',cv2.merge([f,m,old]))
# ---- adressen per gebouw
ids={str(b['id']) for b in g['buildings']};ad={}
for fn in sys.argv[2:]:
    r=ET.parse(fn).getroot();nodes={};apts=[]
    for n in r.iter('node'):
        ll=(float(n.get('lon')),float(n.get('lat')));nodes[n.get('id')]=ll;t={x.get('k'):x.get('v') for x in n.findall('tag')}
        if t.get('addr:street') and t.get('addr:housenumber'):apts.append((ll,t['addr:street']+' '+t['addr:housenumber']))
    for w in r.iter('way'):
        if w.get('id') not in ids:continue
        t={x.get('k'):x.get('v') for x in w.findall('tag')}
        if t.get('addr:street') and t.get('addr:housenumber'):ad[w.get('id')]=t['addr:street']+' '+t['addr:housenumber'];continue
        p=[nodes[n.get('ref')] for n in w.findall('nd') if n.get('ref') in nodes]
        if len(p)<3:continue
        bx=(min(q[0] for q in p),min(q[1] for q in p),max(q[0] for q in p),max(q[1] for q in p))
        for ll,a in apts:
            if bx[0]<=ll[0]<=bx[2] and bx[1]<=ll[1]<=bx[3] and pip(ll[0],ll[1],p):ad[w.get('id')]=a;break
g['baddr']=ad;print('adressen:',len(ad),'van',len(ids),'gebouwen')
json.dump(g,open(GAME,'w'),separators=(',',':'))
