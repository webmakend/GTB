import sys,os,math,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from fbx import parse,walk
from PIL import Image
def props70(node):
    out={}
    for p in walk(node['c'],'P'):
        k=p['p'][0].decode();out[k]=p['p'][4:]
    return out
def euler(rx,ry,rz):
    rx,ry,rz=map(math.radians,(rx,ry,rz))
    X=np.array([[1,0,0],[0,math.cos(rx),-math.sin(rx)],[0,math.sin(rx),math.cos(rx)]])
    Y=np.array([[math.cos(ry),0,math.sin(ry)],[0,1,0],[-math.sin(ry),0,math.cos(ry)]])
    Z=np.array([[math.cos(rz),-math.sin(rz),0],[math.sin(rz),math.cos(rz),0],[0,0,1]])
    return Z@Y@X
def load(path):
    t=parse(path);objs=next(walk(t,'Objects'))['c']
    geoms={g['p'][0]:g for g in objs if g['n']=='Geometry'}
    models={m['p'][0]:m for m in objs if m['n']=='Model'}
    con=next(walk(t,'Connections'))['c']
    g2m={};parent={}
    for c in con:
        a,b=c['p'][1],c['p'][2]
        if a in geoms and b in models:g2m[a]=b
        if a in models:parent[a]=b
    gs=props70(next(walk(t,'GlobalSettings')))
    tris=[];cols=[]
    pal=np.asarray(Image.open(path.replace('.fbx','.fbm/')+'387359c5580f06c08c266126b3b46db47e48ba44.png').convert('RGB')).astype(float)
    def mat(mid):
        M=np.eye(4)
        while mid in models:
            p=props70(models[mid]);T=p.get('Lcl Translation',[0,0,0]);R=p.get('Lcl Rotation',[0,0,0]);S=p.get('Lcl Scaling',[1,1,1]);pre=p.get('PreRotation',[0,0,0])
            L=np.eye(4);L[:3,:3]=euler(*pre)@euler(*R)@np.diag(S);L[:3,3]=T;M=L@M;mid=parent.get(mid)
        return M
    for gid,g in geoms.items():
        V=next(walk(g['c'],'Vertices'))['p'][0].reshape(-1,3);I=next(walk(g['c'],'PolygonVertexIndex'))['p'][0]
        M=mat(g2m.get(gid));Vw=(np.c_[V,np.ones(len(V))]@M.T)[:,:3]
        uvl=next(walk(g['c'],'LayerElementUV'));uv=next(walk(uvl['c'],'UV'))['p'][0].reshape(-1,2);uvi=list(walk(uvl['c'],'UVIndex'));uvi=uvi[0]['p'][0] if uvi else np.arange(len(I))
        poly=[];k0=0
        for k,ix in enumerate(I):
            vi=ix if ix>=0 else -ix-1;poly.append((vi,k))
            if ix<0:
                for j in range(1,len(poly)-1):
                    tri=[poly[0],poly[j],poly[j+1]];tris.append([Vw[a] for a,_ in tri]);u=np.mean([uv[uvi[b]] for _,b in tri],axis=0)
                    px=int(np.clip(u[0],0,.999)*256);py=int(np.clip(1-u[1],0,.999)*256);cols.append(pal[py,px])
                poly=[]
    return np.array(tris),np.array(cols),gs
def render(path,out,size=256,up=None,fwd=None,flip=False):
    T,C,gs=load(path)
    P=T.reshape(-1,3);mn,mx=P.min(0),P.max(0);ext=mx-mn
    upi=up if up is not None else int(np.argmin(ext)) # hoogte-as
    hor=[i for i in range(3) if i!=upi];fi=fwd if fwd is not None else (hor[0] if ext[hor[0]]>ext[hor[1]] else hor[1]);si=[i for i in hor if i!=fi][0]
    L=ext[fi];Wd=ext[si];sc=(size-8)/L;Wpx=int(Wd*sc)+8
    img=np.zeros((Wpx,size,4));zb=np.full((Wpx,size),-1e9)
    ld=np.array([-.35,-.45,.82]);ld/=np.linalg.norm(ld)
    for tri,c in zip(T,C):
        x=(tri[:,fi]-mn[fi])*sc+4;y=(tri[:,si]-mn[si])*sc+4;z=tri[:,upi]-mn[upi]
        if flip:x=size-x
        e1=tri[1]-tri[0];e2=tri[2]-tri[0];n=np.cross(e1,e2);nn=np.linalg.norm(n)
        if nn==0:continue
        n/=nn;n3=np.array([n[fi]*(-1 if flip else 1),n[si],n[upi]])
        if n3[2]<0:n3=-n3
        sh=.55+.55*max(0,n3@ld)
        x0,x1=int(max(0,np.floor(x.min()))),int(min(size-1,np.ceil(x.max())));y0,y1=int(max(0,np.floor(y.min()))),int(min(Wpx-1,np.ceil(y.max())))
        if x1<x0 or y1<y0:continue
        gx,gy=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
        d=(y[1]-y[2])*(x[0]-x[2])+(x[2]-x[1])*(y[0]-y[2])
        if abs(d)<1e-9:continue
        w0=((y[1]-y[2])*(gx-x[2])+(x[2]-x[1])*(gy-y[2]))/d;w1=((y[2]-y[0])*(gx-x[2])+(x[0]-x[2])*(gy-y[2]))/d;w2=1-w0-w1
        m=(w0>=-1e-4)&(w1>=-1e-4)&(w2>=-1e-4)
        zz=w0*z[0]+w1*z[1]+w2*z[2]
        sub=zb[y0:y1+1,x0:x1+1];upd=m&(zz>sub);sub[upd]=zz[upd]
        col=np.clip(c*sh,0,255);im=img[y0:y1+1,x0:x1+1];im[upd,:3]=col;im[upd,3]=255
    Image.fromarray(img.astype('uint8')).save(out);return Wd/L
if __name__=='__main__':
    print(render(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 256))
