import math
LAT0,LON0=37.648,13.111
KX,KY=111.32*math.cos(math.radians(LAT0)),110.95
PPC=7086/120.0
def km(la,lo): return ((lo-LON0)*KX,(la-LAT0)*KY)
INS=(39.0,13.6,81.0,46.6); SI=25.3
icx,icy=km(37.6489,13.10892); hw=(INS[2]-INS[0])/2/SI; hh=(INS[3]-INS[1])/2/SI
S=3.3; SX,SY=INS[0]-1.4*S,36.0
def inset_px(la,lo):
    x,y=km(la,lo); xc=INS[0]+(x-(icx-hw))*SI; yc=INS[1]+(y-(icy-hh))*SI
    return xc*PPC,(60-yc)*PPC
def region_px(la,lo):
    x,y=km(la,lo); return (SX+x*S)*PPC,(60-(SY+y*S))*PPC
STADT_CROP=(2330,1000,4750,2361); UML_CROP=(0,650,2280,1933)
def to_pct(px,py,c):
    return 100*(px-c[0])/(c[2]-c[0]),100*(py-c[1])/(c[3]-c[1])
TOWN={ # name: (lat,lon,source)
 "Casa (Via Delfino)":(37.65020,13.11262,"Hausmarker v12, OSM w238048681"),
 "Banca (Sicilbanca)":(37.647281,13.110587,"Corso Umberto I 111"),
 "Municipio":(37.64892,13.11297,"OSM w238427483"),
 "Chiesa Madre":(37.6505,13.11514,"POI 86"),
 "Belvedere":(37.65083,13.11637,"POI 1"),
 "Caffè dell'Arpa":(37.64816,13.11216,"POI 6"),
 "Posta":(37.652524,13.114036,"OSM post_office"),
 "Oleificio SA.CA":(37.65399,13.1161,"POI 80"),
 "Palazzo Panitteri":(37.64928,13.11257,"POI 2"),
 "Despar":(37.64446,13.10606,"POI 40"),
}
UML={
 "Olivenhain Pandolfina":(37.679965,13.094593,"Koordinaten Thorsten"),
 "Torre di Pandolfina":(37.68056,13.08583,"v12"),
 "Frantoio Murgia Lamanno":(37.658,13.103,"POI H"),
 "Feudo Arancio":(37.6528,13.017,"POI C"),
 "Sambuca":(37.648,13.111,"Ortsmitte"),
}
if __name__=="__main__":
    import json
    out={"stadt":{},"umland":{}}
    for k,(a,b,s) in TOWN.items(): out["stadt"][k]=to_pct(*inset_px(a,b),STADT_CROP)+(s,)
    for k,(a,b,s) in UML.items(): out["umland"][k]=to_pct(*region_px(a,b),UML_CROP)+(s,)
    json.dump(out,open("pins.json","w"),indent=1,ensure_ascii=False); print(json.dumps(out,indent=1,ensure_ascii=False))
