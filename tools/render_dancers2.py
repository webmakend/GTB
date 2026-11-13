"""Dansers voor Café Henke: Universal Base-vrouwen (uitgaanskleding via kleur) + een paar PSX-mannen,
met Mixamo-dansen overgezet (tools/anim.py). Uitvoer: dancers.webp + dancers.json"""
import sys,os,json,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from anim import Scene,to_render,retarget_globals,skinned_rel
from render3d import render,load
from PIL import Image
PSX,UB,OUT=sys.argv[1],sys.argv[2],sys.argv[3];dances=sys.argv[4:]
BC=UB+'/Base Characters';HS=UB+'/Hairstyles/Origin at 0/FBX (Unity)'
MAP={'pelvis':'Hips','spine_01':'Spine','spine_02':'Spine1','spine_03':'Spine2','neck_01':'Neck','Head':'Head'}
for s_,S_ in (('l','Left'),('r','Right')):MAP.update({'clavicle_'+s_:S_+'Shoulder','upperarm_'+s_:S_+'Arm','lowerarm_'+s_:S_+'ForeArm','hand_'+s_:S_+'Hand','thigh_'+s_:S_+'UpLeg','calf_'+s_:S_+'Leg','foot_'+s_:S_+'Foot','ball_'+s_:S_+'ToeBase'})
def C(h):return [int(h[i:i+2],16)/255 for i in (1,3,5)]
def texfix(m,tex):
    t=tex.copy()
    if m.get('hair') is not None:
        lum=t[...,:3].mean(-1,keepdims=True);t[...,:3]=np.clip(np.array(m['hair'])[None,None,:]*(lum*1.6),0,1)
    return t
Ds=[Scene(d,'mixamo') for d in dances];Dbs=[D.globals(None) for D in Ds]
NF=12;H=180;sheets=[];meta=[]
def sheet(frames):
    cw=max(f.size[0] for f in frames);ch=max(f.size[1] for f in frames);sh=Image.new('RGBA',(cw*len(frames),ch))
    for k,fr in enumerate(frames):sh.paste(fr,(k*cw+(cw-fr.size[0])//2,ch-fr.size[1]))
    return sh,{'w':cw,'h':ch,'n':len(frames)}
women=[('l','#ff2e88','#111111','Hair_Long','#e8c070'),('d','#c0c0c8','#ff2e88','Hair_Buns','#2a1a12'),('l','#36d1ff','#ffffff','Hair_Long','#3a2418'),('d','#ffd166','#111111','Hair_Long','#151010'),
       ('l','#9b5de5','#2b2b2b','Hair_SimpleParted','#b5651d'),('d','#ffffff','#36d1ff','Hair_Long','#3a2418'),('l','#e63946','#111111','Hair_Buns','#e8c070'),('d','#7dff6a','#111111','Hair_Long','#2a1a12')]
for wi,(skin,top,bot,hn,hc) in enumerate(women):
    Cs=Scene(BC+'/Unity/Superhero_Female_FullBody.fbx');Cb=Cs.globals(None);D=Ds[wi%len(Ds)];Db=Dbs[wi%len(Ds)];t0=1.0+(wi%4)*.6
    hair=load(HS+'/'+hn+'.fbx',[UB])
    for x in hair:
        tr=x['tri'];x['tri']=np.stack([tr[...,0]/100,-tr[...,2]/100,tr[...,1]/100],-1);x['hair']=C(hc)
    head=next(m for m in Cs.models if Cs.name[m]=='Head')
    bindz={x['name']:x['tri'][:,:,2].mean(1) for x in to_render(Cs,skinned_rel(Cs,Cb,Cb))}
    frames=[]
    for k in range(NF):
        t=t0+k*(2.4/NF);G=retarget_globals(Cs,D,t,Cb,Db,[[1,0,0],[0,0,-1],[0,1,0]],MAP)
        ms=to_render(Cs,skinned_rel(Cs,G,Cb),texdirs=[BC+'/Textures'])
        for x in ms:
            if 'Superhero' in x['name']:x['tex']=BC+'/Textures/'+('T_Superhero_Female_Light_BaseColor.png' if skin=='l' else 'T_Superhero_Female_Dark_BaseColor.png');x['bikz']=(C(top),C(bot),1.15,2);x['bindz']=bindz[x['name']]
        Hd=G[head]@np.linalg.inv(Cb[head]);hs=[]
        for x in hair:
            v=x['tri'].reshape(-1,3);v=(np.c_[v,np.ones(len(v))]@Hd.T)[:,:3];y=dict(x);y['tri']=v.reshape(-1,3,3);hs.append(y)
        o=OUT+'/tmp.png';render(ms+hs,[[1,0,0],[0,0,-1],[0,-1,0]],120,o,pad=2,height=H,amb=.62,light=(-.3,-.5,.8),texfix=texfix);frames.append(Image.open(o).copy())
    s,m=sheet(frames);m['f']=1;sheets.append(s);meta.append(m);print('vrouw',wi,m)
R=PSX+'/Characters_psx_02/Models/Rig/'
for ci,f in enumerate(['Male/Character_05.fbx','Male/Character_Male_40.fbx','Male/Character_Male_45.fbx']):
    Cs=Scene(R+f);Cb=Cs.globals(None);D=Ds[ci%len(Ds)];frames=[]
    for k in range(NF):
        G=retarget_globals(Cs,D,1.3+k*(2.4/NF),Cb,Dbs[ci%len(Ds)],[[0,0,1],[0,1,0],[-1,0,0]]);m=to_render(Cs,skinned_rel(Cs,G,Cb),texdirs=[PSX])
        o=OUT+'/tmp.png';render(m,[[0,0,-1],[0,-1,0],[1,0,0]],120,o,pad=2,height=H,amb=.6,light=(-.3,-.5,.8));frames.append(Image.open(o).copy())
    s,m=sheet(frames);m['f']=0;sheets.append(s);meta.append(m);print('man',ci,m)
W=max(s.size[0] for s in sheets);Ht=sum(s.size[1]+2 for s in sheets);at=Image.new('RGBA',(W,Ht));y=0
for s,m in zip(sheets,meta):at.paste(s,(0,y));m['y']=y;y+=s.size[1]+2
at.save(OUT+'/dancers.webp','WEBP',quality=85,method=6);json.dump(meta,open(OUT+'/dancers.json','w'));print(at.size)
