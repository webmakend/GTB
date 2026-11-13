"""Rendert dansende PSX-figuren (Mixamo-dansen overgezet op het PSX-skelet) als flipbook-sprites voor Café Henke."""
import sys,os,json,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from anim import Scene,to_render,retarget_globals,skinned_rel
from render3d import render
from PIL import Image
PSX,OUT=sys.argv[1],sys.argv[2];dances=sys.argv[3:]
R=PSX+'/Characters_psx_02/Models/Rig/'
Q=[[0,0,1],[0,1,0],[-1,0,0]]
cast=['Female/Character_37_Female.fbx','Female/Character_41_Female.fbx','Female/Character_45_Female.fbx','Female/Character_50_Female.fbx','Male/Character_05.fbx','Male/Character_Male_40.fbx','Male/Character_Male_45.fbx','Female/Character_33_Female.fbx']
NF=12;H=170
sheets=[];meta=[]
Ds=[Scene(d,'mixamo') for d in dances];Dbs=[D.globals(None) for D in Ds]
for ci,f in enumerate(cast):
    C=Scene(R+f);Cb=C.globals(None);di=ci%len(Ds);D=Ds[di];t0=1.0+(ci%3)*.7
    frames=[]
    for k in range(NF):
        t=t0+k*(2.4/NF)
        G=retarget_globals(C,D,t,Cb,Dbs[di],Q);m=to_render(C,skinned_rel(C,G,Cb),texdirs=[PSX])
        o=OUT+'/tmp.png';render(m,[[0,0,-1],[0,-1,0],[1,0,0]],120,o,pad=2,height=H,amb=.6,light=(-.3,-.5,.8));frames.append(Image.open(o).copy())
    # gelijke celgrootte: breedste frame
    cw=max(f.size[0] for f in frames);ch=max(f.size[1] for f in frames);sheet=Image.new('RGBA',(cw*NF,ch))
    for k,fr in enumerate(frames):sheet.paste(fr,(k*cw+(cw-fr.size[0])//2,ch-fr.size[1]))
    sheets.append(sheet);meta.append({'w':cw,'h':ch,'n':NF});print(f,cw,ch)
W=max(s.size[0] for s in sheets);Ht=sum(s.size[1]+2 for s in sheets);at=Image.new('RGBA',(W,Ht));y=0
for s,m in zip(sheets,meta):at.paste(s,(0,y));m['y']=y;y+=s.size[1]+2
at.save(OUT+'/dancers.webp','WEBP',quality=85,method=6);json.dump(meta,open(OUT+'/dancers.json','w'));print(at.size)
