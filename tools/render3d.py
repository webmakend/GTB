"""Eenvoudige software-renderer voor FBX-modellen (orthografisch, z-buffer, textuur per pixel)."""
import sys,os,math,glob,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fbx import parse,walk
from PIL import Image
def P70(node):
    out={}
    for p in walk(node['c'],'P'):out[p['p'][0].decode()]=p['p'][4:]
    return out
def euler(rx,ry,rz):
    rx,ry,rz=map(math.radians,(rx,ry,rz))
    X=np.array([[1,0,0],[0,math.cos(rx),-math.sin(rx)],[0,math.sin(rx),math.cos(rx)]]);Y=np.array([[math.cos(ry),0,math.sin(ry)],[0,1,0],[-math.sin(ry),0,math.cos(ry)]]);Z=np.array([[math.cos(rz),-math.sin(rz),0],[math.sin(rz),math.cos(rz),0],[0,0,1]])
    return Z@Y@X
_texcache={}
def loadtex(path):
    if path not in _texcache:_texcache[path]=np.asarray(Image.open(path).convert('RGBA')).astype(np.float32)/255
    return _texcache[path]
def load(path,texdirs,skip=()):
    t=parse(path);objs=next(walk(t,'Objects'))['c']
    by={o['p'][0]:o for o in objs}
    con=next(walk(t,'Connections'))['c'];parent={};links=[]
    for c in con:
        a,b=c['p'][1],c['p'][2];links.append((a,b,c['p'][3] if len(c['p'])>3 else None))
        if a in by and b in by and by[a]['n']=='Model' and by[b]['n']=='Model':parent[a]=b
    def mat(mid):
        M=np.eye(4)
        while mid in by and by[mid]['n']=='Model':
            p=P70(by[mid]);T=p.get('Lcl Translation',[0,0,0]);R=p.get('Lcl Rotation',[0,0,0]);S=p.get('Lcl Scaling',[1,1,1]);pre=p.get('PreRotation',[0,0,0])
            L=np.eye(4);L[:3,:3]=euler(*pre)@euler(*R)@np.diag(S);L[:3,3]=T;M=L@M;mid=parent.get(mid)
        return M
    meshes=[]
    for gid,g in by.items():
        if g['n']!='Geometry':continue
        gname=g['p'][1].split(b'\x00')[0].decode()
        if any(s.lower() in gname.lower() for s in skip):continue
        model=next((b for a,b,_ in links if a==gid and b in by and by[b]['n']=='Model'),None)
        mats=[a for a,b,_ in links if b==model and a in by and by[a]['n']=='Material']
        tex=None
        for m in mats:
            for a,b,prop in links:
                if b==m and a in by and by[a]['n']=='Texture':
                    fn=next((c['p'][0] for c in by[a]['c'] if c['n'] in('RelativeFilename','FileName')),b'').decode('latin1').replace('\\','/');base=os.path.basename(fn)
                    if not base or any(k in base.lower() for k in('normal','rough')):continue
                    for d in texdirs:
                        cand=glob.glob(os.path.join(glob.escape(d),'**',glob.escape(base)),recursive=True)
                        cand=[c for c in cand if os.path.isfile(c)]
                        if cand:tex=cand[0];break
                if tex:break
            if tex:break
        V=next(walk(g['c'],'Vertices'))['p'][0].reshape(-1,3);I=next(walk(g['c'],'PolygonVertexIndex'))['p'][0]
        Vw=(np.c_[V,np.ones(len(V))]@mat(model).T)[:,:3]
        uvl=list(walk(g['c'],'LayerElementUV'))
        if uvl:uv=next(walk(uvl[0]['c'],'UV'))['p'][0].reshape(-1,2);ui=list(walk(uvl[0]['c'],'UVIndex'));uvi=ui[0]['p'][0] if ui else np.arange(len(I))
        tri=[];tuv=[];poly=[]
        for k,ix in enumerate(I):
            vi=ix if ix>=0 else -ix-1;poly.append((vi,k))
            if ix<0:
                for j in range(1,len(poly)-1):
                    q=[poly[0],poly[j],poly[j+1]];tri.append([Vw[a] for a,_ in q]);tuv.append([uv[uvi[b]] for _,b in q] if uvl else [[0,0]]*3)
                poly=[]
        vid=[];poly=[]
        for k,ix in enumerate(I):
            vi=ix if ix>=0 else -ix-1;poly.append(vi)
            if ix<0:
                for j in range(1,len(poly)-1):vid.append([poly[0],poly[j],poly[j+1]])
                poly=[]
        # skin-clusters (botten) voor eenvoudig poseren
        cl={}
        skins=[a for a,b,_ in links if b==gid and a in by and by[a]['n']=='Deformer']
        for sk in skins:
            for a,b,_ in links:
                if b==sk and a in by and by[a]['n']=='Deformer':
                    o=by[a];kids={c['n']:c['p'] for c in o['c']}
                    if 'Indexes' in kids:
                        bone=next((by[x]['p'][1] for x,y,_ in links if y==a and x in by and by[x]['n']=='Model'),o['p'][1]).split(b'\x00')[0].decode().split(':')[-1]
                        cl.setdefault(bone,[]).append((kids['Indexes'][0],kids['Weights'][0]))
        meshes.append({'name':gname,'tri':np.array(tri),'uv':np.array(tuv,dtype=float),'tex':tex,'V':Vw,'vid':np.array(vid),'cl':cl,'M':mat(model)})
    return meshes
def render(meshes,R,size,out,pad=6,texfix=None,bg=None,height=None,light=(-.35,-.5,.8),amb=.5):
    """R: 3x3 rotatie naar kijkruimte: x->rechts, y->omlaag in beeld, z->naar de camera."""
    allp=np.concatenate([m['tri'].reshape(-1,3) for m in meshes])@np.array(R).T
    mn,mx=allp.min(0),allp.max(0);ext=mx-mn
    sc=(size-2*pad)/ext[0] if height is None else (height-2*pad)/ext[1]
    W=int(ext[0]*sc+2*pad);H=int(ext[1]*sc+2*pad)
    img=np.zeros((H,W,4),np.float32);zb=np.full((H,W),-1e18)
    ld=np.array(light,float);ld/=np.linalg.norm(ld)
    for m in meshes:
        tex=loadtex(m['tex']) if m['tex'] else None
        if tex is not None and texfix:tex=texfix(m,tex)
        th,tw=(tex.shape[:2] if tex is not None else (1,1))
        T=m['tri']@np.array(R).T
        for tri,uv in zip(T,m['uv']):
            x=(tri[:,0]-mn[0])*sc+pad;y=(tri[:,1]-mn[1])*sc+pad;z=tri[:,2]
            n=np.cross(tri[1]-tri[0],tri[2]-tri[0]);nn=np.linalg.norm(n)
            if nn==0:continue
            n/=nn
            sh=amb+(1-amb)*abs(n@ld)
            x0,x1=int(max(0,np.floor(x.min()))),int(min(W-1,np.ceil(x.max())));y0,y1=int(max(0,np.floor(y.min()))),int(min(H-1,np.ceil(y.max())))
            if x1<x0 or y1<y0:continue
            gx,gy=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
            d=(y[1]-y[2])*(x[0]-x[2])+(x[2]-x[1])*(y[0]-y[2])
            if abs(d)<1e-9:continue
            w0=((y[1]-y[2])*(gx-x[2])+(x[2]-x[1])*(gy-y[2]))/d;w1=((y[2]-y[0])*(gx-x[2])+(x[0]-x[2])*(gy-y[2]))/d;w2=1-w0-w1
            msk=(w0>=-1e-3)&(w1>=-1e-3)&(w2>=-1e-3)
            if not msk.any():continue
            zz=w0*z[0]+w1*z[1]+w2*z[2];sub=zb[y0:y1+1,x0:x1+1]
            if tex is not None:
                u=w0*uv[0,0]+w1*uv[1,0]+w2*uv[2,0];v=w0*uv[0,1]+w1*uv[1,1]+w2*uv[2,1]
                px=np.clip((u%1)*tw,0,tw-1).astype(int);py=np.clip((1-(v%1))*th,0,th-1).astype(int);col=tex[py,px]
            else:col=np.ones(msk.shape+(4,))*.7
            msk&=col[...,3]>.35
            upd=msk&(zz>sub);sub[upd]=zz[upd];im=img[y0:y1+1,x0:x1+1]
            im[upd,:3]=np.clip(col[upd,:3]*sh,0,1);im[upd,3]=1
    Image.fromarray((img*255).astype('uint8')).save(out);return W,H

def pose_arms(meshes,deg,up=(0,0,1)):
    """Zet de armen op 'deg' graden onder horizontaal (eenvoudige skinning op de arm-botten).
    Werkt met Unreal-namen (upperarm_l ...) en Mixamo-namen (LeftArm ...)."""
    up=np.array(up,float)
    def chain(bn,side):
        b=bn.split(':')[-1]
        if b.endswith('_'+side) and b.split('_')[0] in('upperarm','lowerarm','hand','index','middle','pinky','ring','thumb'):return True
        L='Left' if side=='l' else 'Right'
        return b.startswith(L) and any(b.startswith(L+k) for k in('Arm','ForeArm','Hand'))
    for m in meshes:
        cl=m.get('cl') or {}
        if not cl:continue
        V=m['V'].copy()
        tot=np.zeros(len(V))
        for bn,lst in cl.items():
            for ix,wt in lst:np.add.at(tot,ix,wt)
        for side in('l','r'):
            ub=next((b for b in cl if b.split(':')[-1] in('upperarm_'+side,('Left' if side=='l' else 'Right')+'Arm')),None)
            if ub is None:continue
            w=np.zeros(len(V))
            for bn,lst in cl.items():
                if chain(bn,side):
                    for ix,wt in lst:np.add.at(w,ix,wt)
            w=np.clip(w/np.maximum(tot,1e-6),0,1)
            ix=np.concatenate([a for a,_ in cl[ub]]);wt=np.concatenate([b for _,b in cl[ub]]);arm=V[ix[wt>.6]]
            ctr=V.mean(0);lat=arm-ctr;lat-=np.outer(lat@up,up);dist=np.linalg.norm(lat,axis=1)
            k=np.argsort(dist)[:max(3,len(arm)//12)];piv=arm[k].mean(0)
            d=V[w>.95].mean(0)-piv;d/=np.linalg.norm(d);cur=np.degrees(np.arcsin(np.clip(-(d@up),-1,1)))
            dh=d-up*(d@up);dh/=np.linalg.norm(dh)
            ax=np.cross(dh,-up);ax/=np.linalg.norm(ax);th=np.radians(deg-cur)
            K=np.array([[0,-ax[2],ax[1]],[ax[2],0,-ax[0]],[-ax[1],ax[0],0]]);Rm=np.eye(3)+np.sin(th)*K+(1-np.cos(th))*K@K
            P=(V-piv)@Rm.T+piv;V=V+(P-V)*w[:,None]
        m['V']=V;m['tri']=V[m['vid']]
