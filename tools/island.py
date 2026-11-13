import json,sys
d=json.load(open(sys.argv[1]))
F=d['fort'];M=720
x0=min(p[0] for p in F)-M;y0=min(p[1] for p in F)-M;x1=max(p[0] for p in F)+M;y1=max(p[1] for p in F)+M
def pip(x,y,p):
    c=False;j=len(p)-1
    for i in range(len(p)):
        a,b=p[i],p[j]
        if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:c=not c
        j=i
    return c
T=lambda p:[[int(q[0]-x0),int(q[1]-y0)] for q in p]
def bb(p):return (min(q[0] for q in p),min(q[1] for q in p),max(q[0] for q in p),max(q[1] for q in p))
FB=bb(F)
def near(p):b=bb(p);return not(b[2]<FB[0]-50 or b[0]>FB[2]+50 or b[3]<FB[1]-50 or b[1]>FB[3]+50)
def split(pts,js=None):
    out=[];cur=[];cj=[]
    for i,q in enumerate(pts):
        if pip(q[0],q[1],F):cur.append(q);cj.append(js[i] if js else None)
        else:
            if len(cur)>1:out.append((cur,cj))
            cur=[];cj=[]
    if len(cur)>1:out.append((cur,cj))
    return out
o={'W':int(x1-x0),'H':int(y1-y0),'pxm':d['pxm'],'fort':T(F)}
for k in('water','green','sand','parking','plaza','seating','islands'):o[k]=[T(p) for p in d[k] if near(p)]
o['buildings']=[]
for b in d['buildings']:
    cx=sum(q[0] for q in b['p'])/len(b['p']);cy=sum(q[1] for q in b['p'])/len(b['p'])
    if pip(cx,cy,F) and not any(pip(cx,cy,w) for w in d['water']):b=dict(b);b['p']=T(b['p']);o['buildings'].append(b)
o['roads']=[]
for r in d['roads']:
    for pts,js in split(r['p'],r['j']):
        js=[js[0] or 'cut%d_%d'%(pts[0][0],pts[0][1])]+js[1:-1]+[js[-1] or 'cut%d_%d'%(pts[-1][0],pts[-1][1])]
        o['roads'].append({'n':r['n'],'k':r['k'],'w':r['w'],'p':T(pts),'j':js})
o['paths']=[]
for p in d['paths']:
    for pts,_ in split(p['p']):o['paths'].append({'k':p['k'],'w':p['w'],'p':T(pts)})
o['pois']=[dict(p,x=int(p['x']-x0),y=int(p['y']-y0)) for p in d['pois'] if pip(p['x'],p['y'],F)]
o['addr']=[dict(a,x=int(a['x']-x0),y=int(a['y']-y0)) for a in d.get('addr',[]) if pip(a['x'],a['y'],F)]
json.dump(o,open(sys.argv[2],'w'),separators=(',',':'))
print(o['W'],o['H'],{k:len(v) for k,v in o.items() if isinstance(v,list)})
