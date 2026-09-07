#!/usr/bin/env python3
"""Inject the canonical schematic into the pages that show it.

The map lives in diagrams/infrastructure-map.svg. That file is the source of
truth; the copy inside index.html is generated from it and sits between two
markers. Editing the page copy by hand is a mistake this script both prevents
and detects:

    python3 build-diagram.py           inject the canonical file into the pages
    python3 build-diagram.py --check   fail if a page has drifted from it

Run --check before publishing. It catches the case where someone edits the
inline copy and the change is silently lost on the next build.
"""
import sys, re, pathlib

ROOT = pathlib.Path(__file__).parent
SRC  = ROOT / 'diagrams' / 'infrastructure-map.svg'
PAGES = ['index.html']
BEGIN = '<!-- BEGIN infrastructure-map (generated from diagrams/infrastructure-map.svg — do not edit here) -->'
END   = '<!-- END infrastructure-map -->'

def main():
    check = '--check' in sys.argv
    svg = SRC.read_text().strip()
    bad = changed = 0
    for name in PAGES:
        p = ROOT / name
        text = p.read_text()
        i = text.find(BEGIN)
        j = text.find(END)
        if i < 0 or j < 0:
            print('%s: no injection markers — skipped' % name); bad += 1; continue
        current = text[i + len(BEGIN):j].strip()
        if current == svg:
            print('%s: up to date' % name); continue
        if check:
            print('%s: DRIFTED from diagrams/infrastructure-map.svg' % name); bad += 1; continue
        p.write_text(text[:i + len(BEGIN)] + '\n' + svg + '\n        ' + text[j:])
        print('%s: updated from the canonical file' % name); changed += 1
    if check and bad:
        print('\n%d page(s) out of sync. Edit diagrams/infrastructure-map.svg, '
              'then run: python3 build-diagram.py' % bad)
        return 1
    if changed:
        print('\nRemember to re-stamp the asset hashes: python3 bump-assets.py')
    return 0

if __name__ == '__main__':
    sys.exit(main())
