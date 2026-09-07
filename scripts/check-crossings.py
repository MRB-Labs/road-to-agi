"""Report crossings between the schematic's arrow paths.

Every arrow is an orthogonal polyline, so this only has to test axis-aligned
segments against each other. Shared endpoints and collinear overlaps at a
junction are not crossings; a perpendicular hit in the interior of both is.
"""
import re, sys

svg = open('diagrams/infrastructure-map.svg').read()
paths = re.findall(r'<path class="([^"]*)"([^>]*?)d="([^"]+)"', svg)

def segs(d):
    """Return (segments, bridges). A bridge is an arc: the line hops over
       something rather than meeting it, so a crossing under one is intended."""
    pts=[]; bridges=[]; x=y=0.0
    for m in re.finditer(r'([MHVLA])\s*([-\d. ]+)', d):
        op=m.group(1); nums=[float(v) for v in m.group(2).split()]
        if op=='M': x,y=nums[0],nums[1]; pts.append((x,y)); continue
        if op=='H': x=nums[0]
        elif op=='V': y=nums[0]
        elif op=='L': x,y=nums[0],nums[1]
        elif op=='A':
            nx,ny=nums[5],nums[6]
            bridges.append(((x+nx)/2.0,(y+ny)/2.0))
            x,y=nx,ny
        pts.append((x,y))
    return [(pts[i],pts[i+1]) for i in range(len(pts)-1)], bridges

def label(cls, attrs):
    m=re.search(r'data-from="([^"]*)"', attrs)
    return '%s [%s]' % (cls.strip(), m.group(1) if m else '-')

arrows=[(label(c,a),)+segs(d) for c,a,d in paths
        if 'marker-end' in a or c.strip() in ('pw','mt2','ln','ln-a','ln-s','ln-d','ln-m','ln-i','wl','wl2')]

def cross(s1,s2):
    (ax1,ay1),(ax2,ay2)=s1; (bx1,by1),(bx2,by2)=s2
    h1, h2 = ay1==ay2, by1==by2
    if h1==h2: return None                      # parallel: no perpendicular cross
    if h2: s1,s2=s2,s1; (ax1,ay1),(ax2,ay2)=s1; (bx1,by1),(bx2,by2)=s2
    # s1 horizontal, s2 vertical
    lo,hi=sorted((ax1,ax2)); ylo,yhi=sorted((by1,by2))
    if lo < bx1 < hi and ylo < ay1 < yhi:       # strict interior of both
        return (bx1, ay1)
    return None

hits=[]; bridged=0
for i in range(len(arrows)):
    for j in range(i+1,len(arrows)):
        n1,s1,b1=arrows[i]; n2,s2,b2=arrows[j]
        for a in s1:
            for b in s2:
                p=cross(a,b)
                if not p: continue
                near=[q for q in b1+b2 if abs(q[0]-p[0])<12 and abs(q[1]-p[1])<12]
                if near: bridged+=1; continue
                hits.append((n1,n2,p))
print('arrows checked: %d   bridged crossings: %d' % (len(arrows), bridged))
if not hits:
    print('no crossings')
else:
    for n1,n2,p in hits:
        print('  CROSS  %-22s x %-22s at (%.0f, %.0f)' % (n1,n2,p[0],p[1]))
sys.exit(1 if hits else 0)
