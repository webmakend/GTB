"""Rendert mensen voor GTB Bommel:
 - PSX-voetgangers en politie van bovenaf (assets/people.png + meta)
 - Universal Base: strandgangers (bovenaf), zonnebaders (liggend) en de insmeer-close-up (rug)."""
import sys,os,json,glob,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from render3d import load,render,pose_arms,loadtex
from PIL import Image
PSX,UB,OUT=sys.argv[1],sys.argv[2],sys.argv[3]
os.makedirs(OUT,exist_ok=True)
NR=PSX+'/Characters_psx_02/Models/Rig'
TOP=[[1,0,0],[0,0,1],[0,1,0]]           # PSX: voorkant +X, hoogte Y
sprites=[]
def add(name,path):sprites.append((name,Image.open(path)))
civ_m=['Character_01','Character_03','Character_05','Character_07','Character_09','Character_11','Character_13','Character_29','Character_31','Character_Male_35','Character_Male_40','Character_Male_45']
civ_f=['Character_Female_01','Character_Female_03','Character_Female_05','Character_Female_07','Character_Female_09','Character_29_Female','Character_31_Female','Character_33_Female','Character_37_Female','Character_41_Female','Character_45_Female','Character_50_Female']
cops=['Male/Character_17_Police','Male/Character_19_Police','Female/Character_17_Female_Police','Female/Character_19_Female_Police']
jobs=[]
for n in civ_m:jobs.append(('civ','Male/'+n))
for n in civ_f:jobs.append(('civ','Female/'+n))
for n in cops:jobs.append(('cop',n))
meta={'civ':[],'cop':[]}
for kind,rel in jobs:
    f=NR+'/'+rel+'.fbx'
    if not os.path.exists(f):print('ontbreekt',f);continue
    m=load(f,[PSX]);pose_arms(m,78,up=(0,1,0));o=OUT+'/p_'+os.path.basename(rel)+'.png';render(m,TOP,64,o,pad=2,amb=.6,light=(-.3,-.4,.85));sprites.append((kind,Image.open(o)))
# ---- Universal Base
BC=UB+'/Base Characters';HS=UB+'/Hairstyles/Origin at 0/FBX (Unity)'
def hair(name,col):
    h=load(HS+'/'+name+'.fbx',[UB])
    for x in h:
        t=x['tri'];x['tri']=np.stack([t[...,0]/100,-t[...,2]/100,t[...,1]/100],-1);x['hair']=col
    return h
def body(sex,skin,bik,deg):
    f=BC+'/Unity/Superhero_%s_FullBody.fbx'%('Female' if sex=='f' else 'Male');m=load(f,[BC+'/Textures'])
    tx={'f':{'l':'T_Superhero_Female_Light_BaseColor.png','d':'T_Superhero_Female_Dark_BaseColor.png'},'m':{'l':'T_Superhero_Male_Ligh.png','d':'T_Superhero_Male_Dark.png'}}[sex][skin]
    for x in m:
        if 'Superhero' in x['name']:x['tex']=BC+'/Textures/'+tx;x['bik']=bik
    pose_arms(m,deg);return m
def texfix(m,tex):
    t=tex.copy()
    if m.get('bik') is not None:
        r,g,b=t[...,0],t[...,1],t[...,2];mx=t[...,:3].max(-1);mn=t[...,:3].min(-1);sat=(mx-mn)/np.maximum(mx,1e-4)
        k=(sat<.13)&(mx>.15);lum=(.5+.7*mx[k])[:,None];t[k,:3]=np.clip(np.array(m['bik'])[None,:]*lum,0,1)
    if m.get('hair') is not None:
        lum=t[...,:3].mean(-1,keepdims=True);t[...,:3]=np.clip(np.array(m['hair'])[None,None,:]*(lum*1.6),0,1)
    return t
def C(h):return [int(h[i:i+2],16)/255 for i in (1,3,5)]
UTOP=[[0,-1,0],[1,0,0],[0,0,1]]   # bovenaf, voorkant (-y) naar rechts
FRONT=[[1,0,0],[0,0,-1],[0,-1,0]]  # liggend op de rug, van bovenaf gezien
BACK=[[-1,0,0],[0,0,-1],[0,1,0]]   # liggend op de buik
bik=['#ff2e88','#36d1ff','#ffe14d','#e63946','#7dff6a','#ffffff','#9b5de5']
hairs=['#3a2418','#d9b26a','#7a3e12','#151010','#b5651d']
vars_=[('f','l','Hair_Long'),('f','d','Hair_Buns'),('f','l','Hair_Buns'),('f','d','Hair_Long'),('f','l','Hair_SimpleParted')]
meta_u={'walk':[],'lie':[]}
for i,(sx,sk,hn) in enumerate(vars_):
    col=C(bik[i%len(bik)]);hc=C(hairs[i%len(hairs)])
    m=body(sx,sk,col,72)+hair(hn,hc);o=OUT+'/w%d.png'%i;render(m,UTOP,60,o,pad=2,texfix=texfix,amb=.6);sprites.append(('walk',Image.open(o)))
lie=[('f','l','Hair_Long',FRONT),('f','d','Hair_Buns',BACK),('m','l','Hair_Buzzed',FRONT),('f','d','Hair_Long',FRONT),('m','d','Hair_SimpleParted',BACK),('f','l','Hair_Buns',BACK)]
for i,(sx,sk,hn,R) in enumerate(lie):
    col=C(bik[(i+2)%len(bik)]) if sx=='f' else C(['#1d3557','#e63946','#2a9d8f'][i%3]);hc=C(hairs[(i+1)%len(hairs)])
    m=body(sx,sk,col,70)+hair(hn,hc);o=OUT+'/l%d.png'%i;render(m,R,40,o,pad=2,texfix=texfix,height=130,amb=.62)
    Image.open(o).rotate(-90,expand=True).save(o);sprites.append(('lie',Image.open(o)))   # hoofd naar +x
# atlas
Wt=max(im.size[0] for _,im in sprites);H=sum(im.size[1]+2 for _,im in sprites);at=Image.new('RGBA',(Wt,H));y=0;meta={}
for k,im in sprites:at.paste(im,(0,y));meta.setdefault(k,[]).append([0,y,im.size[0],im.size[1]]);y+=im.size[1]+2
at.save(OUT+'/people.png',optimize=True);json.dump(meta,open(OUT+'/people.json','w'));print({k:len(v) for k,v in meta.items()},at.size)
# insmeer-close-up: rug, liggend op de buik
m=body('f','d',C('#ff2e88'),78)+hair('Hair_Buns',C('#3a2418'))
render(m,BACK,600,OUT+'/rub_full.png',pad=4,texfix=texfix,height=1500,amb=.55,light=(-.3,-.5,.8))
im=Image.open(OUT+'/rub_full.png');W,H=im.size;im.crop((int(W*.12),0,int(W*.88),int(H*.47))).save(OUT+'/rub.png');print('rub',im.size)
