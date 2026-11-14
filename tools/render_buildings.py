"""Quaternius OBJ-gebouwen -> gevel-texturen (elevaties) voor de 2.5D-gebouwen in GTB."""
import sys,os,glob,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from render3d import render
from PIL import Image
def mtl(paths):
    M={};cur=None
    for p in paths:
        for l in open(p):
            s=l.split()
            if not s:continue
            if s[0]=='newmtl':cur=s[1]
            elif s[0]=='Kd' and cur and cur not in M:M[cur]=[float(x) for x in s[1:4]]
    return M
def obj(path,KD,recol=None):
    V=[];tri=[];mc=[];cur='Grey'
    for l in open(path):
        if l.startswith('v '):V.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('usemtl'):cur=l.split()[1]
        elif l.startswith('f '):
            ix=[int(t.split('/')[0])-1 for t in l.split()[1:]]
            kd=(recol or {}).get(cur) or KD.get(cur,[.3,.3,.3]);c=[max(0,min(1,x))**(1/2.2) for x in kd]
            for j in range(1,len(ix)-1):tri.append([V[ix[0]],V[ix[j]],V[ix[j+1]]]);mc.append(c)
    t=np.array(tri);return [{'tri':t,'uv':np.zeros((len(t),3,2)),'tex':None,'mc':np.array(mc)}]
if __name__=='__main__' and sys.argv[1]!='--atlas':
    src=sys.argv[1];out=sys.argv[2]
    KD=mtl(glob.glob(os.path.join(glob.escape(src),'*.mtl')))
    KD.setdefault('Beige',[.336,.328,.256]);KD.setdefault('BrickRed',[.30,.075,.045]);KD.setdefault('LightGrey',[.34,.34,.34])
    print(KD)
    VIEWS={'front':[[1,0,0],[0,-1,0],[0,0,1]],'back':[[-1,0,0],[0,-1,0],[0,0,-1]],'right':[[0,0,-1],[0,-1,0],[1,0,0]],'left':[[0,0,1],[0,-1,0],[-1,0,0]]}
    for f in sorted(glob.glob(os.path.join(glob.escape(src),'*.obj'))):
        nm=os.path.basename(f).split('-',1)[-1][:-4];m=obj(f,KD)
        for v,R in VIEWS.items():render(m,R,0,f'{out}/{nm}_{v}.png',pad=0,height=256,light=(-.3,-.4,.85),amb=.62)

# ---- gevel-atlas: python3 -I tools/render_buildings.py --atlas <objdir> <repo> ----
def atlas(src,repo):
    import json
    KD=mtl(glob.glob(os.path.join(glob.escape(src),'*.mtl')));KD.setdefault('Beige',[.336,.328,.256]);KD.setdefault('BrickRed',[.30,.075,.045]);KD.setdefault('LightGrey',[.34,.34,.34])
    find=lambda n:glob.glob(os.path.join(glob.escape(src),'*'+n+'.obj'))[0]
    LIT=[1.0,.55,.16];DARK=[.025,.03,.045]
    # model, muurmateriaal, glasmateriaal, muurkleuren, breedte in m
    SPEC=[('Building3_Small','BrickRed','Brown',[[.30,.075,.045],[.15,.045,.03],[.42,.15,.06],[.45,.32,.15],[.62,.60,.55],[.22,.10,.07]],3.06,{}),
          ('Building4',['WhiteBlue','LightBlue'],'DarkGrey',[[.70,.58,.42],[.62,.38,.33],[.42,.47,.53],[.52,.42,.28],[.74,.74,.70]],4.64,{'White':[.80,.78,.72]}),
          ('Building2_Large','Beige','White',[[.336,.328,.256],[.52,.38,.26],[.28,.33,.38],[.24,.11,.07]],5.72,{})]
    H=150;tiles=[];meta=[]
    for mi,(nm,wm,gm,cols,wd,extra) in enumerate(SPEC):
        f=find(nm);wm=wm if isinstance(wm,list) else [wm]
        for ci,c in enumerate(cols):
            for lit in (0,1):
                rc=dict(extra);rc[gm]=LIT if lit else DARK
                for k,w in enumerate(wm):rc[w]=c if k==0 else [x*.8 for x in c]
                p='/tmp/_fac.png';render(obj(f,KD,rc),[[1,0,0],[0,-1,0],[0,0,1]],0,p,pad=0,height=400,light=(-.3,-.4,.85),amb=.66)
                im=Image.open(p);a=np.asarray(im)[...,3]
                cols_ok=np.where((a>200).mean(0)>.5)[0];im=im.crop((cols_ok[0],0,cols_ok[-1]+1,im.height));a=np.asarray(im)[...,3]
                top=int(np.where((a>200).mean(1)>.985)[0][0]);im=im.crop((0,top,im.width,im.height))
                im=im.resize((max(8,round(im.width*H/im.height)),H),Image.LANCZOS)
                bg=Image.new('RGBA',im.size,tuple(int(255*x**(1/2.2)) for x in c)+(255,));bg.alpha_composite(im);tiles.append(bg)
                meta.append({'m':mi,'c':ci,'lit':lit,'ww':round(wd*18)})
    W=2048;x=y=0;rh=H;pos=[]
    for t in tiles:
        if x+t.width>W:x=0;y+=rh+2
        pos.append((x,y));x+=t.width+2
    A=Image.new('RGBA',(W,y+rh),(0,0,0,0))
    for t,(x,y),m in zip(tiles,pos,meta):A.paste(t,(x,y));m.update(x=x,y=y,w=t.width,h=t.height)
    A.convert('RGB').save(os.path.join(repo,'assets/facades.webp'),quality=86,method=6)
    open(os.path.join(repo,'src/js/06c-gevels-data.js'),'w').write('// gegenereerd door tools/render_buildings.py --atlas (Quaternius-gevels)\nconst FAC_META='+json.dumps(meta,separators=(',',':'))+';\n')
    print(len(tiles),A.size)
if __name__=='__main__' and sys.argv[1]=='--atlas':atlas(sys.argv[2],sys.argv[3])
