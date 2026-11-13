import json,openpyxl,sys
d=json.load(open(sys.argv[1]))
A={}
for a in d['addr']:A.setdefault((a['s'].lower(),a['h'].lower().replace(' ','')),a)
SHORT={"'t Stadscafé Zaltbommel":"'t Stadscafé",'Konotori SUSHI':'Konotori Sushi','La Cantine à la Minute':'La Cantine'}
ws=openpyxl.load_workbook(sys.argv[3],read_only=True).worksheets[0]
biz=[];miss=[]
rows=list(ws.iter_rows(values_only=True))[1:]+[('Waterstraat','26','5301 AJ','LEF','Restaurant')]
for st,hn,pc,name,cat,*_ in rows:
    if not name or 'kerk' in (cat or '').lower():continue
    hn=str(hn).strip().lower();parts=hn.split('-')
    c0=''.join(ch for ch in parts[0] if ch.isdigit())
    cands=[hn,parts[0],c0]+([parts[1]] if len(parts)>1 else [])+[c0+'a',c0+'b']
    hit=None
    for c in cands:
        if (st.lower(),c) in A:hit=A[(st.lower(),c)];break
    lc=(cat or '').lower()
    grp='Restaurant' if any(k in lc for k in('restaurant','café','cafe','lunch','brasserie','bar','sushi','bakkerij','pizzeria','tapas')) else 'Kapper / Barbershop' if any(k in lc for k in('kapper','tattoo')) else 'Winkel'
    if hit:biz.append({'n':SHORT.get(name,name),'full':name,'c':grp,'cat':cat,'adr':f'{st} {hn}','x':hit['x'],'y':hit['y']})
    else:miss.append(f'{name} ({st} {hn})')
d['biz']=biz;del d['addr']
json.dump(d,open(sys.argv[2],'w'),separators=(',',':'))
print(len(biz),'geplaatst; niet geplaatst:',miss)
