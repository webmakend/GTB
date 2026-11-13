import struct,zlib,sys
import numpy as np
def parse(path):
    d=open(path,'rb').read();ver=struct.unpack('<I',d[23:27])[0];big=ver>=7500
    def rd_node(o):
        if big:end,np_,pl=struct.unpack('<QQQ',d[o:o+24]);o+=24
        else:end,np_,pl=struct.unpack('<III',d[o:o+12]);o+=12
        nl=d[o];o+=1;name=d[o:o+nl].decode('latin1');o+=nl
        if end==0:return None,o
        props=[]
        for _ in range(np_):
            t=chr(d[o]);o+=1
            if t=='Y':props.append(struct.unpack('<h',d[o:o+2])[0]);o+=2
            elif t=='C':props.append(d[o]);o+=1
            elif t=='I':props.append(struct.unpack('<i',d[o:o+4])[0]);o+=4
            elif t=='F':props.append(struct.unpack('<f',d[o:o+4])[0]);o+=4
            elif t=='D':props.append(struct.unpack('<d',d[o:o+8])[0]);o+=8
            elif t=='L':props.append(struct.unpack('<q',d[o:o+8])[0]);o+=8
            elif t in 'fdlib':
                n,enc,cl=struct.unpack('<III',d[o:o+12]);o+=12;raw=d[o:o+cl];o+=cl
                if enc==1:raw=zlib.decompress(raw)
                dt={'f':'<f4','d':'<f8','l':'<i8','i':'<i4','b':'u1'}[t];props.append(np.frombuffer(raw,dtype=dt,count=n))
            elif t in 'SR':
                n=struct.unpack('<I',d[o:o+4])[0];o+=4;props.append(d[o:o+n]);o+=n
        kids=[]
        while o<end:
            k,o=rd_node(o)
            if k is None:break
            kids.append(k)
        return {'n':name,'p':props,'c':kids},end
    o=27;top=[]
    while o<len(d)-200:
        k,o=rd_node(o)
        if k is None:break
        top.append(k)
    return top
def find(nodes,name):
    for n in nodes:
        if n['n']==name:yield n
def walk(nodes,name):
    for n in nodes:
        if n['n']==name:yield n
        yield from walk(n['c'],name)
if __name__=='__main__':
    t=parse(sys.argv[1])
    print([n['n'] for n in t])
    for g in walk(t,'Geometry'):
        v=next(walk(g['c'],'Vertices'))['p'][0];idx=next(walk(g['c'],'PolygonVertexIndex'))['p'][0]
        print('geom',g['p'][1][:40],len(v)//3,len(idx),[c['n'] for c in g['c']])
    for m in walk(t,'Model'):print('model',m['p'][1][:40],m['p'][2])
    for c in walk(t,'Connections'):print(len(c['c']))
