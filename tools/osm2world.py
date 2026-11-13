import xml.etree.ElementTree as ET,sys,math,json
src,dst=sys.argv[1],sys.argv[2]
r=ET.parse(src).getroot()
N={n.get('id'):(float(n.get('lat')),float(n.get('lon'))) for n in r.findall('node')}
NT={n.get('id'):{x.get('k'):x.get('v') for x in n.findall('tag')} for n in r.findall('node') if n.find('tag') is not None}
b=r.find('bounds');la0,la1,lo0,lo1=[float(b.get(k)) for k in('minlat','maxlat','minlon','maxlon')]
PXM=9.0;MARG=50
kx=math.cos(math.radians((la0+la1)/2))*111320;ky=110540
def P(nid):la,lo=N[nid];return [round(((lo-lo0)*kx+MARG)*PXM,1),round(((la1-la)*ky+MARG)*PXM,1)]
WW=int(((lo1-lo0)*kx+2*MARG)*PXM);HH=int(((la1-la0)*ky+2*MARG)*PXM)
tg=lambda e:{x.get('k'):x.get('v') for x in e.findall('tag')}
ways={w.get('id'):([x.get('ref') for x in w.findall('nd')],tg(w)) for w in r.findall('way')}
def pts(nds):return [P(n) for n in nds if n in N]
def inworld(p,m=400):return any(-m<x<WW+m and -m<y<HH+m for x,y in p)
def r1(p):return [[int(round(x)),int(round(y))] for x,y in p]
def simplify(p,eps):
    if len(p)<3:return p
    a,bb=p[0],p[-1];dx,dy=bb[0]-a[0],bb[1]-a[1];L=math.hypot(dx,dy) or 1e-9
    mi,md=0,-1
    for i in range(1,len(p)-1):
        d=abs((p[i][0]-a[0])*dy-(p[i][1]-a[1])*dx)/L
        if d>md:md,mi=d,i
    if md>eps:return simplify(p[:mi+1],eps)[:-1]+simplify(p[mi:],eps)
    return [a,bb]
out={'W':WW,'H':HH,'pxm':PXM,'water':[],'green':[],'sand':[],'parking':[],'plaza':[],'seating':[],'roads':[],'paths':[],'buildings':[],'pois':[],'fort':None,'islands':[]}
# rivier: leden van relatie samenvoegen
def join(segs):
    segs=[s[:] for s in segs];out=[]
    while segs:
        cur=segs.pop(0);changed=True
        while changed:
            changed=False
            for i,s in enumerate(segs):
                if s[0]==cur[-1]:cur+=s[1:];segs.pop(i);changed=True;break
                if s[-1]==cur[-1]:cur+=s[::-1][1:];segs.pop(i);changed=True;break
                if s[-1]==cur[0]:cur=s+cur[1:];segs.pop(i);changed=True;break
                if s[0]==cur[0]:cur=s[::-1]+cur[1:];segs.pop(i);changed=True;break
        out.append(cur)
    return out
for rel in r.findall('relation'):
    t=tg(rel)
    if t.get('type')!='multipolygon':continue
    mem=[(m.get('ref'),m.get('role')) for m in rel.findall('member') if m.get('type')=='way' and m.get('ref') in ways]
    if t.get('water')=='river':
        lines=join([ways[w][0] for w,_ in mem])
        out['riverbank']=[r1(pts(l)) for l in lines]
    elif t.get('natural')=='water' or t.get('landuse') in('grass','forest'):
        key='water' if t.get('natural')=='water' else 'green'
        for ring in join([ways[w][0] for w,role in mem if role=='outer']):
            if ring[0]==ring[-1]:out[key].append(r1(pts(ring)))
        if key=='water':
            for ring in join([ways[w][0] for w,role in mem if role=='inner']):
                if ring[0]==ring[-1]:out['islands'].append(r1(pts(ring)))
DRIVE={'tertiary':9,'secondary':10,'primary':10,'residential':6,'unclassified':6,'living_street':5,'service':4,'pedestrian':6}
PATH={'footway':2.4,'cycleway':2.8,'path':2,'track':3}
for wid,(nds,t) in ways.items():
    p=pts(nds)
    if len(p)<2 or not inworld(p):continue
    closed=nds[0]==nds[-1] and len(nds)>3
    h=t.get('highway')
    if h and t.get('area')=='yes' and closed:out['plaza'].append(r1(p));continue
    if h in DRIVE:
        w=DRIVE[h]
        if t.get('width'):
            try:w=float(t['width'])
            except:pass
        out['roads'].append({'n':t.get('name',''),'k':h,'w':round(w*PXM),'nodes':[n for n in nds if n in N],'p':r1(p)});continue
    if h in PATH:out['paths'].append({'k':h,'w':round(PATH[h]*PXM),'p':r1(simplify(p,4))});continue
    if not closed:continue
    if 'building' in t:
        out['buildings'].append({'p':r1(p),'b':t['building'],'n':t.get('name',''),'id':wid,'am':t.get('amenity','')});continue
    if t.get('natural')=='water':out['water'].append(r1(p))
    elif t.get('landuse') in('grass','forest','cemetery','meadow','orchard','farmland') or t.get('leisure') in('park','garden','playground') or t.get('natural') in('shrubbery','scrub'):out['green'].append(r1(p))
    elif t.get('natural')=='beach' or t.get('man_made')=='groyne':out['sand'].append(r1(p))
    elif t.get('amenity')=='parking':out['parking'].append(r1(p))
    elif t.get('leisure')=='outdoor_seating':out['seating'].append(r1(p))
    elif t.get('historic')=='castle':out['fort']=r1(p)
# graaf-topologie: knopen die door meerdere wegen gedeeld worden
cnt={}
for rd in out['roads']:
    for n in rd['nodes']:cnt[n]=cnt.get(n,0)+1
for rd in out['roads']:
    nds=rd['nodes'];keep=[i for i,n in enumerate(nds) if i==0 or i==len(nds)-1 or cnt[n]>1]
    # tussenliggende vormpunten vereenvoudigen tussen junctions
    pp=[];ids=[]
    for a,bb in zip(keep,keep[1:]):
        seg=[P(n) for n in nds[a:bb+1]];s=simplify(seg,3)
        if not pp:pp.append(s[0]);ids.append(nds[a])
        for q in s[1:-1]:pp.append(q);ids.append(None)
        pp.append(s[-1]);ids.append(nds[bb])
    rd['p']=r1(pp);rd['j']=[(n if n and cnt.get(n,0)>1 or i in(0,len(ids)-1) else None) for i,n in enumerate(ids)];del rd['nodes']
for nid,t in NT.items():
    if 'name' in t and any(k in t for k in('shop','amenity','tourism','historic','craft')):
        x,y=P(nid)
        if -100<x<WW+100 and -100<y<HH+100:out['pois'].append({'n':t['name'],'k':t.get('shop') or t.get('amenity') or t.get('tourism') or t.get('historic'),'x':round(x),'y':round(y)})
out['addr']=[]
for nid,t in NT.items():
    if 'addr:housenumber' in t and 'addr:street' in t:
        x,y=P(nid);out['addr'].append({'s':t['addr:street'],'h':t['addr:housenumber'],'x':round(x),'y':round(y)})
for wid,(nds,t) in ways.items():
    if 'addr:housenumber' in t and 'addr:street' in t:
        pp=pts(nds)
        if pp:out['addr'].append({'s':t['addr:street'],'h':t['addr:housenumber'],'x':round(sum(q[0] for q in pp)/len(pp)),'y':round(sum(q[1] for q in pp)/len(pp))})
json.dump(out,open(dst,'w'),separators=(',',':'))
print('W',WW,'H',HH,{k:len(v) for k,v in out.items() if isinstance(v,list)},'riverbank',[len(l) for l in out.get('riverbank',[])])
