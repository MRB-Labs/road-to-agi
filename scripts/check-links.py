#!/usr/bin/env python3
"""Find the external links that no longer work.

The report cites hundreds of sources, and sources move: agencies reorganise,
papers change URLs, pages are withdrawn. Nothing on the site breaks when that
happens, so without a check a dead citation can sit there for months.

    python3 scripts/check-links.py                 print what is dead or blocked
    python3 scripts/check-links.py --report F.md   also write a Markdown report

A link is DEAD only on an answer that means "gone" — 404, 410, or a host that
no longer exists. 401/403/429 mean a site is refusing robots, not that the
page is gone (Reuters and the SEC both do this), so those are listed apart as
BLOCKED and never counted as failures. The weekly workflow turns the report
into a GitHub issue; the script exits 1 only when something is dead.
"""
import concurrent.futures as cf
import pathlib
import re
import socket
import ssl
import sys
import urllib.error
import urllib.request
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = sorted(p for p in ROOT.glob('*.html') if not p.name.startswith('atlas-editor')) + \
    [ROOT / 'assets' / 'content.js', ROOT / 'script.js']
URL = re.compile(r'https?://[^\s"\'<>`)\]\\]+')
SKIP = re.compile(r'^https?://(localhost|127\.|www\.w3\.org|schema\.org|mrb-labs\.github\.io|'
                  r's3\.tradingview\.com|fonts\.)')
UA = 'Mozilla/5.0 (compatible; RoadToAGI-linkcheck; +https://github.com/MRB-Labs/road-to-agi)'
DEAD = {404, 410}
BLOCKED = {401, 403, 429, 999}


def collect():
    where = defaultdict(list)
    for f in SOURCES:
        for n, line in enumerate(f.read_text(errors='replace').splitlines(), 1):
            for u in URL.findall(line):
                u = u.rstrip('.,;:\'"')
                if '${' in u or SKIP.match(u):
                    continue
                where[u].append('%s:%d' % (f.relative_to(ROOT), n))
    return where


def probe(url):
    """(verdict, detail). HEAD first; many servers refuse HEAD, so fall back to
       a GET that reads nothing past the headers."""
    for method in ('HEAD', 'GET'):
        req = urllib.request.Request(url, method=method, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=20, context=ssl.create_default_context()) as r:
                return 'ok', r.status
        except urllib.error.HTTPError as e:
            if method == 'HEAD' and e.code in (400, 403, 405, 406, 429, 501):
                continue
            if e.code in DEAD:
                return 'dead', e.code
            if e.code in BLOCKED:
                return 'blocked', e.code
            return ('error' if e.code >= 500 else 'ok'), e.code
        except urllib.error.URLError as e:
            if isinstance(e.reason, socket.gaierror):
                return 'dead', 'host not found'
            return 'error', str(e.reason)[:60]
        except Exception as e:                       # timeouts, resets, bad TLS
            return 'error', type(e).__name__
    return 'blocked', 'refused'


def main():
    report = sys.argv[sys.argv.index('--report') + 1] if '--report' in sys.argv else None
    where = collect()
    with cf.ThreadPoolExecutor(8) as ex:
        results = dict(zip(where, ex.map(probe, where)))
    groups = defaultdict(list)
    for u, (verdict, detail) in results.items():
        groups[verdict].append((u, detail))

    lines = ['%d external links checked: %d ok, %d dead, %d blocked robots, %d errored.'
             % (len(where), len(groups['ok']), len(groups['dead']),
                len(groups['blocked']), len(groups['error']))]
    for verdict, title in (('dead', 'Dead — fix or replace these'),
                           ('error', 'Errored — server trouble or timeout; recheck before acting'),
                           ('blocked', 'Blocked — the site refuses robots; check by hand if in doubt')):
        if not groups[verdict]:
            continue
        lines += ['', '## %s (%d)' % (title, len(groups[verdict]))]
        for u, detail in sorted(groups[verdict]):
            lines.append('- `%s` %s — %s' % (detail, u, ', '.join(where[u][:3])
                                             + (' …' if len(where[u]) > 3 else '')))
    text = '\n'.join(lines)
    print(text)
    if report:
        pathlib.Path(report).write_text(text + '\n')
    return 1 if groups['dead'] else 0


if __name__ == '__main__':
    sys.exit(main())
