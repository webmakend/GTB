"""FBX-skeletanimatie: botten + animatiecurves evalueren en vertices skinnen (linear blend skinning).
Werkt met Mixamo-exports; kan een animatie ook op een ander Mixamo-skelet (zelfde botnamen) overzetten."""
import sys,os,math,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fbx import parse,walk
TICK=46186158000
def P70(n):return {p['p'][0].decode():p['p'][4:] for p in walk(n['c'],'P')}
def eul(r):
    rx,ry,rz=[math.radians(float(v)) for v in r]
    X=np.array([[1,0,0],[0,math.cos(rx),-math.sin(rx)],[0,math.sin(rx),math.cos(rx)]]);Y=np.array([[math.cos(ry),0,math.sin(ry)],[0,1,0],[-math.sin(ry),0,math.cos(ry)]]);Z=np.array([[math.cos(rz),-math.sin(rz),0],[math.sin(rz),math.cos(rz),0],[0,0,1]])
    return Z@Y@X
def bname(o):return o['p'][1].split(b'\x00')[0].decode().split(':')[-1]
class Scene:
    def __init__(s,path,stack=None):
        t=parse(path);objs=next(walk(t,'Objects'))['c'];s.by={o['p'][0]:o for o in objs}
        s.links=[(c['p'][1],c['p'][2],c['p'][3] if len(c['p'])>3 else None) for c in next(walk(t,'Connections'))['c']]
        s.parent={a:b for a,b,_ in s.links if a in s.by and b in s.by and s.by[a]['n']=='Model' and s.by[b]['n']=='Model'}
        s.models={k:o for k,o in s.by.items() if o['n']=='Model'}
        s.name={k:bname(o) for k,o in s.models.items()}
        s.props={k:P70(o) for k,o in s.models.items()}
        # animatie: curvenode -> model/prop ; curves -> curvenode/axis
        s.curves={}
        stacks=[k for k,o in s.by.items() if o['n']=='AnimationStack']
        layers=[a for a,b,_ in s.links if b in stacks and s.by[a]['n']=='AnimationLayer']
        if stack is not None:
            st=[k for k in stacks if stack.encode() in s.by[k]['p'][1]];layers=[a for a,b,_ in s.links if b in st and s.by[a]['n']=='AnimationLayer']
        cns=set(a for a,b,_ in s.links if b in layers and s.by.get(a,{}).get('n')=='AnimationCurveNode')
        for a,b,prop in s.links:
            if a in cns and b in s.models and prop:
                ax={}
                for c,d,pp in s.links:
                    if d==a and s.by.get(c,{}).get('n')=='AnimationCurve':
                        o=s.by[c];kids={x['n']:x['p'] for x in o['c']};ax[pp.decode().split('|')[-1]]=(np.array(kids['KeyTime'][0],dtype=np.float64)/TICK,np.array(kids['KeyValueFloat'][0],dtype=np.float64))
                s.curves.setdefault(b,{})[prop.decode()]=ax
        s.dur=max((ax[k][0][-1] for m in s.curves.values() for ax in m.values() for k in ax),default=0)
    def local(s,mid,t=None,override=None):
        p=s.props[mid];T=list(p.get('Lcl Translation',[0,0,0]));R=list(p.get('Lcl Rotation',[0,0,0]));S=list(p.get('Lcl Scaling',[1,1,1]));pre=p.get('PreRotation',[0,0,0]);post=p.get('PostRotation',[0,0,0])
        if override is not None:
            o=override.get(s.name[mid])
            if o is not None:R=o.get('R',R);T=o.get('T',T) if o.get('T') is not None else T
        elif t is not None and mid in s.curves:
            for prop,arr in (('Lcl Translation',T),('Lcl Rotation',R),('Lcl Scaling',S)):
                ax=s.curves[mid].get(prop)
                if not ax:continue
                for i,k in enumerate('XYZ'):
                    if k in ax:kt,kv=ax[k];arr[i]=float(np.interp(t,kt,kv))
        L=np.eye(4);L[:3,:3]=eul(pre)@eul(R)@np.linalg.inv(eul(post))@np.diag(S);L[:3,3]=T;return L
    def globals(s,t=None,override=None):
        G={}
        def g(m):
            if m in G:return G[m]
            L=s.local(m,t,override);pa=s.parent.get(m);G[m]=(g(pa)@L) if pa in s.models else L;return G[m]
        for m in s.models:g(m)
        return G
    def anim_locals(s,t):
        """lokale R/T per botnaam op tijd t (voor overzetten)"""
        out={}
        for mid in s.models:
            if mid in s.curves:
                p=s.props[mid];R=list(p.get('Lcl Rotation',[0,0,0]));T=list(p.get('Lcl Translation',[0,0,0]))
                for prop,arr in (('Lcl Rotation',R),('Lcl Translation',T)):
                    ax=s.curves[mid].get(prop)
                    if not ax:continue
                    for i,k in enumerate('XYZ'):
                        if k in ax:kt,kv=ax[k];arr[i]=float(np.interp(t,kt,kv))
                out[s.name[mid]]={'R':R,'T':T}
        return out
    def skinned(s,G,skip=()):
        """geeft lijst van (naam, driehoeken[N,3,3], materiaalkleur per driehoek, uv, texnaam)"""
        meshes=[]
        for gid,g in s.by.items():
            if g['n']!='Geometry':continue
            nm=g['p'][1].split(b'\x00')[0].decode()
            if any(k.lower() in nm.lower() for k in skip):continue
            V=next(walk(g['c'],'Vertices'))['p'][0].reshape(-1,3);I=next(walk(g['c'],'PolygonVertexIndex'))['p'][0]
            skins=[a for a,b,_ in s.links if b==gid and s.by.get(a,{}).get('n')=='Deformer']
            acc=np.zeros((len(V),3));wsum=np.zeros(len(V))
            for sk in skins:
                for a,b,_ in s.links:
                    if b!=sk or s.by.get(a,{}).get('n')!='Deformer':continue
                    o=s.by[a];kids={x['n']:x['p'] for x in o['c']}
                    if 'Indexes' not in kids:continue
                    bone=next((x for x,y,_ in s.links if y==a and x in s.models),None)
                    if bone is None:continue
                    TL=np.array(kids['TransformLink'][0]).reshape(4,4).T;TM=np.array(kids['Transform'][0]).reshape(4,4).T
                    Mx=G[bone]@TM;ix=kids['Indexes'][0];w=kids['Weights'][0]
                    v=np.c_[V[ix],np.ones(len(ix))]@Mx.T;np.add.at(acc,ix,v[:,:3]*w[:,None]);np.add.at(wsum,ix,w)
            model=next((b for a,b,_ in s.links if a==gid and b in s.models),None)
            Vw=np.where(wsum[:,None]>1e-6,acc/np.maximum(wsum,1e-6)[:,None],(np.c_[V,np.ones(len(V))]@G[model].T)[:,:3] if model in G else V)
            meshes.append((nm,gid,Vw,I,g))
        return meshes
def to_render(s,ms,colors=None,texdirs=()):
    """zet geskinde meshes om naar render3d-meshes (driehoeken + kleur/uv/textuur)"""
    import glob
    out=[]
    for nm,gid,V,I,g in ms:
        mats=[a for a,b,_ in s.links if b==next((bb for aa,bb,_ in s.links if aa==gid and bb in s.models),None) and s.by.get(a,{}).get('n')=='Material']
        mcols=[]
        for m in mats:
            p=P70(s.by[m]);d=p.get('DiffuseColor',[.7,.7,.7]);mcols.append([max(0,min(1,float(c)))**(1/2.2) for c in d[:3]])
        if colors and nm in colors:mcols=[colors[nm]]*max(1,len(mcols))
        tex=None
        for m in mats:
            for a,b,_ in s.links:
                if b==m and s.by.get(a,{}).get('n')=='Texture':
                    fn=next((c['p'][0] for c in s.by[a]['c'] if c['n'] in('RelativeFilename','FileName')),b'').decode('latin1').replace('\\','/');base=os.path.basename(fn)
                    if base and not any(k in base.lower() for k in('normal','rough')):
                        for d in texdirs:
                            c=[x for x in glob.glob(os.path.join(glob.escape(d),'**',glob.escape(base)),recursive=True) if os.path.isfile(x)]
                            if c:tex=c[0];break
        lm=list(walk(g['c'],'LayerElementMaterial'));pm=None
        if lm:
            mm=list(walk(lm[0]['c'],'Materials'));pm=mm[0]['p'][0] if mm else None
        uvl=list(walk(g['c'],'LayerElementUV'))
        if uvl:uv=next(walk(uvl[0]['c'],'UV'))['p'][0].reshape(-1,2);ui=list(walk(uvl[0]['c'],'UVIndex'));uvi=ui[0]['p'][0] if ui else np.arange(len(I))
        tri=[];tuv=[];tmc=[];poly=[];pi=0
        for k,ix in enumerate(I):
            vi=ix if ix>=0 else -ix-1;poly.append((vi,k))
            if ix<0:
                mi=int(pm[pi]) if pm is not None and len(pm)>pi else 0
                for j in range(1,len(poly)-1):
                    q=[poly[0],poly[j],poly[j+1]];tri.append([V[a] for a,_ in q]);tuv.append([uv[uvi[b]] for _,b in q] if uvl else [[0,0]]*3);tmc.append(mcols[mi] if mcols and mi<len(mcols) else [.7,.7,.7])
                poly=[];pi+=1
        out.append({'name':nm,'tri':np.array(tri),'uv':np.array(tuv,dtype=float),'tex':tex,'mc':np.array(tmc)})
    return out
def retarget_globals(C,D,t,Cb=None,Db=None,Q=None):
    """Zet de animatie van D (tijd t) over op skelet C via wereld-rotatie-delta's per bot (zelfde botnamen)."""
    Cb=Cb or C.globals(None);Db=Db or D.globals(None);Dt=D.globals(t);Q=np.eye(3) if Q is None else np.array(Q);Qi=Q.T
    dn={D.name[m]:m for m in D.models}
    hipC=next((m for m in C.models if C.name[m]=='Hips'),None);hipD=dn.get('Hips')
    k=(Cb[hipC][1,3]/Db[hipD][1,3]) if hipC and hipD and abs(Db[hipD][1,3])>1e-9 else 1
    G={}
    def g(m):
        if m in G:return G[m]
        pa=C.parent.get(m);nm=C.name[m]
        if pa in C.models:
            P=g(pa);Pb=Cb[pa];off=np.linalg.inv(Pb)@Cb[m];M=P@off
        else:M=Cb[m].copy()
        RD=(g(pa)[:3,:3]@np.linalg.inv(Cb[pa][:3,:3])) if pa in C.models else np.eye(3)   # standaard: volg de ouder
        if nm in dn:
            d=dn[nm];ch=[x for x in C.models if C.parent.get(x)==m and C.name[x] in dn]
            if nm in('Hips','Spine','Spine1','Spine2','Neck','Head'):RD=Q@Dt[d][:3,:3]@np.linalg.inv(Db[d][:3,:3])@Qi
            elif len(ch)==1 and any(nm.endswith(k) for k in('Arm','ForeArm','UpLeg','Leg')):
                cc=ch[0];dc=dn[C.name[cc]]
                vC=Cb[cc][:3,3]-Cb[m][:3,3];vD=Q@(Dt[dc][:3,3]-Dt[d][:3,3])
                if np.linalg.norm(vC)>1e-9 and np.linalg.norm(vD)>1e-9:
                    a1=vC/np.linalg.norm(vC);b1=vD/np.linalg.norm(vD);ax=np.cross(a1,b1);sn=np.linalg.norm(ax);cs=float(a1@b1)
                    if sn<1e-8:RD=np.eye(3) if cs>0 else -np.eye(3)
                    else:
                        ax/=sn;K=np.array([[0,-ax[2],ax[1]],[ax[2],0,-ax[0]],[-ax[1],ax[0],0]]);RD=np.eye(3)+sn*K+(1-cs)*K@K
            if nm=='Hips':M=M.copy();M[:3,3]=Cb[m][:3,3]+(Q@(Dt[d][:3,3]-Db[d][:3,3]))*k
        M=M.copy();M[:3,:3]=RD@Cb[m][:3,:3]
        G[m]=M;return M
    for m in C.models:g(m)
    return G
def skinned_rel(s,G,Gb,skip=()):
    """LBS met eigen bind-globals: v' = G_t * inv(G_bind) * v_bindwereld"""
    out=[]
    for gid,g in s.by.items():
        if g['n']!='Geometry':continue
        nm=g['p'][1].split(b'\x00')[0].decode()
        if any(k.lower() in nm.lower() for k in skip):continue
        V=next(walk(g['c'],'Vertices'))['p'][0].reshape(-1,3);I=next(walk(g['c'],'PolygonVertexIndex'))['p'][0]
        model=next((b for a,b,_ in s.links if a==gid and b in s.models),None);MW=Gb[model] if model in Gb else np.eye(4)
        Vb=(np.c_[V,np.ones(len(V))]@MW.T)
        skins=[a for a,b,_ in s.links if b==gid and s.by.get(a,{}).get('n')=='Deformer']
        acc=np.zeros((len(V),3));ws=np.zeros(len(V))
        for sk in skins:
            for a,b,_ in s.links:
                if b!=sk or s.by.get(a,{}).get('n')!='Deformer':continue
                kids={x['n']:x['p'] for x in s.by[a]['c']}
                if 'Indexes' not in kids:continue
                bone=next((x for x,y,_ in s.links if y==a and x in s.models),None)
                if bone is None:continue
                Mx=G[bone]@np.linalg.inv(Gb[bone]);ix=kids['Indexes'][0];w=kids['Weights'][0]
                v=Vb[ix]@Mx.T;np.add.at(acc,ix,v[:,:3]*w[:,None]);np.add.at(ws,ix,w)
        Vw=np.where(ws[:,None]>1e-6,acc/np.maximum(ws,1e-6)[:,None],Vb[:,:3])
        out.append((nm,gid,Vw,I,g))
    return out
