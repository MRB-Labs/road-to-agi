#!/usr/bin/env python3
"""Guard the report's wording against accidental change.

Every user-facing string — the layer descriptions, the tab copy, each stage,
each box on every page — is extracted into content/copy-snapshot.json. That
file is the record of what the report currently says.

    python3 check-content.py            report anything that has changed
    python3 check-content.py --accept   approve the current wording as the new
                                        baseline (do this when a change is
                                        intended, and only then)

The point is that a change to wording is never silent. An edit made by mistake
shows up here as a diff; an edit made on purpose is approved explicitly.
"""
import json, re, sys, pathlib, html

ROOT = pathlib.Path(__file__).parent
SNAP = ROOT / 'content' / 'copy-snapshot.json'

# the tables in script.js that carry prose rather than data
TABLES = ['LAYERS','CHAIN','HOWTO','TABINTRO','LAYER_MATERIALS','LAYER_RISKS',
          'LAYER_ELEMENTS','MOATWHY','SOURCES','PSOURCES','CONC','PROC','MATS',
          'MATTBL','RISKS','GW','HU','LOOPWHY','DEPLOY','ENVIRO','EL_CODES','BREAKS',
          'CDESC','DESIGN_MODEL','COMETA']
PAGES = ['index.html','stack.html','investor.html','markets.html','environment.html',
         'projects.html','method.html']
MIN_LEN = 4           # short enough to cover tab labels and buttons
NOISE = re.compile(r'^(?:[\d.,%+\-$£€\s]+|[a-z0-9_-]+\.(?:js|css|png|svg|json|html)'
                   r'|https?://\S+|[A-Za-z]+:[A-Za-z0-9.\-]+|assets/\S+|var\(--\S+\)'
                   r'|[a-z-]+(?: [a-z-]+)*\s*[:;{]\S*)$')


def strings_in(src, start):
    """Yield (depth1_key, text) for every string literal inside one object,
       tracking which top-level entry we are under."""
    i = src.index('{', start)
    depth = 0
    key = '_'
    pending = ''
    out = []
    while i < len(src):
        c = src[i]
        if c in '\'"`':
            q = c
            i += 1
            buf = []
            while i < len(src):
                if src[i] == '\\':
                    buf.append(src[i:i+2]); i += 2; continue
                if src[i] == q:
                    break
                buf.append(src[i]); i += 1
            text = ''.join(buf)
            if len(text) >= MIN_LEN and not NOISE.match(text):
                out.append((key, text))
            pending = ''
            i += 1
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return out
        elif depth == 1:
            m = re.match(r'\s*[,{]?\s*["\']?([A-Za-z0-9_]+)["\']?\s*:', src[i:])
            if m and (src[i-1] in '{,' or src[i-1].isspace()):
                key = m.group(1)
        i += 1
    return out


def collect():
    snap = {}
    # Prose lives in both files: the content tables were split into
    # assets/content.js, but a few — BREAKS, DESIGN_MODEL, EL_CODES — sit
    # beside the code that uses them. Scanning only one silently drops them.
    for path in (ROOT / 'assets' / 'content.js', ROOT / 'script.js'):
        src = path.read_text()
        for t in TABLES:
            m = re.search(r'\bconst ' + t + r'\s*=\s*[\{\[]', src)
            if not m:
                continue
            for n, (key, text) in enumerate(strings_in(src, m.start())):
                snap['%s/%s/%s/%d' % (path.name, t, key, n)] = text

    tag = re.compile(r'<(script|style)\b.*?</\1>', re.S | re.I)
    for page in PAGES:
        p = ROOT / page
        if not p.exists():
            continue
        body = tag.sub(' ', p.read_text())
        body = re.sub(r'<!--.*?-->', ' ', body, flags=re.S)
        n = 0
        for chunk in re.split(r'<[^>]+>', body):
            text = html.unescape(re.sub(r'\s+', ' ', chunk)).strip()
            if len(text) >= MIN_LEN and not NOISE.match(text):
                snap['%s/%d' % (page, n)] = text
                n += 1
    return snap


def main():
    now = collect()
    if '--accept' in sys.argv:
        SNAP.parent.mkdir(exist_ok=True)
        SNAP.write_text(json.dumps(now, indent=1, ensure_ascii=False, sort_keys=True) + '\n')
        print('baseline accepted: %d strings recorded' % len(now))
        return 0
    if not SNAP.exists():
        print('no baseline yet. Run: python3 check-content.py --accept')
        return 1
    was = json.loads(SNAP.read_text())
    added = [k for k in now if k not in was]
    removed = [k for k in was if k not in now]
    changed = [k for k in now if k in was and now[k] != was[k]]
    if not (added or removed or changed):
        print('wording unchanged: %d strings match the baseline' % len(now))
        return 0
    def show(title, keys, get):
        if not keys:
            return
        print('\n%s (%d)' % (title, len(keys)))
        for k in keys[:40]:
            print('  %s\n      %s' % (k, get(k)[:150]))
        if len(keys) > 40:
            print('  … and %d more' % (len(keys) - 40))
    show('CHANGED', changed, lambda k: '- ' + was[k][:150] + '\n      + ' + now[k][:150])
    show('REMOVED', removed, lambda k: was[k])
    show('ADDED', added, lambda k: now[k])
    print('\nIf these changes are intended: python3 check-content.py --accept')
    return 1


if __name__ == '__main__':
    sys.exit(main())
