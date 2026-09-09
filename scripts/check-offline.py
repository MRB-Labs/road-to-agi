#!/usr/bin/env python3
"""Fail if a page would fetch an asset from another server at run time.

Outbound links in prose are fine — they are citations. What is not fine is a
stylesheet, script, font, image or iframe loaded from somewhere else: it makes
the published page depend on a third party staying up, and it leaks the
reader's address to them.

TradingView is the one allowed exception, declared here rather than tolerated
silently, so that removing it is a one-line decision.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).parent.parent
ALLOWED = {'s3.tradingview.com'}          # the company dialog's quote widgets

LOADERS = re.compile(
    r'<(script|link|img|iframe|source|audio|video|embed|object)\b([^>]*?)'
    r'(?:src|href|data)\s*=\s*["\'](https?://[^"\']+)', re.I)
# A <link> only fetches for some rel values. canonical, alternate, licence and
# the rest are statements about the document, not requests for a file, and
# flagging them would push the site into using relative canonical URLs — which
# scrapers and search engines do not accept.
NON_FETCHING = {'canonical', 'alternate', 'author', 'license', 'licence',
                'me', 'next', 'prev', 'help', 'search', 'bookmark'}
REL = re.compile(r'\brel\s*=\s*["\']?([a-zA-Z- ]+)', re.I)


def fetches(tag, attrs):
    if tag.lower() != 'link':
        return True
    m = REL.search(attrs)
    rels = set((m.group(1) if m else '').lower().split())
    return not (rels and rels <= NON_FETCHING)
CSS_URL = re.compile(r'url\(\s*["\']?(https?://[^"\')]+)', re.I)
JS_LOAD = re.compile(r'''(?:\.src\s*=\s*|fetch\(|new\s+Worker\(|import\()\s*['"`](https?://[^'"`]+)''')

def host(u):
    return re.sub(r'^https?://', '', u).split('/')[0].lower()

def main():
    bad = []
    for p in sorted(ROOT.glob('*.html')):
        for m in LOADERS.finditer(p.read_text()):
            if fetches(m.group(1), m.group(2)) and host(m.group(3)) not in ALLOWED:
                bad.append((p.name, m.group(3)))
    css = ROOT / 'style.css'
    for m in CSS_URL.finditer(css.read_text()):
        if host(m.group(1)) not in ALLOWED:
            bad.append((css.name, m.group(1)))
    for js in (ROOT / 'script.js', ROOT / 'assets' / 'content.js',
               ROOT / 'assets' / 'taxonomy.js'):
        for m in JS_LOAD.finditer(js.read_text()):
            if host(m.group(1)) not in ALLOWED:
                bad.append((js.name, m.group(1)))

    if bad:
        print('Remote asset loads found:')
        for f, u in bad:
            print('  %-14s %s' % (f, u))
        print('\nEither vendor the asset into assets/, or add its host to '
              'ALLOWED in scripts/check-offline.py with a reason.')
        return 1
    print('no remote asset loads (allowed exceptions: %s)' % ', '.join(sorted(ALLOWED)))
    return 0

if __name__ == '__main__':
    sys.exit(main())
