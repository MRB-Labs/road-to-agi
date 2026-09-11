#!/usr/bin/env python3
"""Guard the boundary between public site and local tooling."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_HTML = [p for p in ROOT.glob('*.html') if p.name not in {'atlas-editor.html', '404.html'}]


def main():
    bad = []
    editor = (ROOT / 'atlas-editor.html').read_text(encoding='utf-8')
    if '<meta name="robots" content="noindex">' not in editor:
        bad.append('atlas-editor.html must be noindex')

    for p in PUBLIC_HTML:
        if 'atlas-editor.html' in p.read_text(encoding='utf-8'):
            bad.append('%s links to the local editor' % p.name)

    workflow = ROOT / '.github' / 'workflows' / 'checks.yml'
    txt = workflow.read_text(encoding='utf-8')
    required_excludes = [
        "--exclude='atlas-editor.*'",
        "--exclude='*.py'",
        "--exclude='.github'",
        "--exclude='CLEAN'",
    ]
    for token in required_excludes:
        if token not in txt:
            bad.append('deploy staging is missing %s' % token)

    robots = (ROOT / 'robots.txt').read_text(encoding='utf-8')
    if 'Sitemap: https://mrb-labs.github.io/road-to-agi/sitemap.xml' not in robots:
        bad.append('robots.txt must point to the public sitemap')

    if bad:
        print('Public surface problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('public surface: editor isolated and deploy exclusions present')
    return 0


if __name__ == '__main__':
    sys.exit(main())
