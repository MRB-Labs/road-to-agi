#!/usr/bin/env python3
"""Stamp style.css and script.js with a content hash in every page.

Without this a reader who has visited before keeps the browser's cached copy
after a deploy and sees old markup against new styles. Run after changing
either asset; it is idempotent.
"""
import hashlib,re,glob,sys
def h(p): return hashlib.sha256(open(p,'rb').read()).hexdigest()[:8]
ver={'style.css':h('style.css'),'script.js':h('script.js')}
n=0
for f in glob.glob('*.html'):
    t=open(f).read(); o=t
    for asset,v in ver.items():
        t=re.sub(r'(?<=["\'])'+re.escape(asset)+r'(\?v=[0-9a-f]+)?(?=["\'])', f'{asset}?v={v}', t)
    if t!=o: open(f,'w').write(t); n+=1
print(f"stamped {n} page(s): " + ", ".join(f"{k}?v={v}" for k,v in ver.items()))
