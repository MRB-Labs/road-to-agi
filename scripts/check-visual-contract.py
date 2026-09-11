#!/usr/bin/env python3
"""Guard the visual system's load-bearing selectors and tokens.

This is not a browser screenshot diff. It is the cheap CI guard that catches
renames and accidental deletions before the manual/Playwright screenshot pass.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
STYLE = (ROOT / 'style.css').read_text(encoding='utf-8')
ATLAS = (ROOT / 'assets' / 'atlas' / 'atlas.css').read_text(encoding='utf-8')
INDEX = (ROOT / 'index.html').read_text(encoding='utf-8')

REQUIRED_STYLE = [
    ':root{', '[data-theme="dark"]', '.skip-link', '.theme-toggle',
    '.main-view', '.dia-shell.is-loop', '#loopsvg', '.layer-pane',
]
REQUIRED_ATLAS = [
    '.atlas{', '--atlas-l1:', '--atlas-l10:', '.atlas-bg-photo',
    '.atlas-world', '.pw-earth', '.atlas-panel', '@media (max-width:1080px)',
]
REQUIRED_INDEX = [
    'id="atlas"', 'id="loopsvg"', 'id="cx-matrix"',
]
REQUIRED_ATLAS_JS = [
    'href="assets/atlas/earth.png"', 'class="pw-earth"',
]


def missing(name, text, required):
    return ['%s: missing %s' % (name, token) for token in required if token not in text]


def main():
    bad = []
    bad += missing('style.css', STYLE, REQUIRED_STYLE)
    bad += missing('assets/atlas/atlas.css', ATLAS, REQUIRED_ATLAS)
    bad += missing('index.html', INDEX, REQUIRED_INDEX)
    atlas_js = (ROOT / 'assets' / 'atlas' / 'atlas.js').read_text(encoding='utf-8')
    bad += missing('assets/atlas/atlas.js', atlas_js, REQUIRED_ATLAS_JS)

    layer_tokens = re.findall(r'--l(\d+):', STYLE)
    if set(layer_tokens) < set(str(n) for n in range(1, 11)):
        bad.append('style.css: expected --l1 through --l10 tokens')
    atlas_tokens = re.findall(r'--atlas-l(\d+):', ATLAS)
    if set(atlas_tokens) < set(str(n) for n in range(1, 11)):
        bad.append('atlas.css: expected --atlas-l1 through --atlas-l10 tokens')

    if bad:
        print('Visual contract problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('visual contract: theme, atlas and overview selectors present')
    return 0


if __name__ == '__main__':
    sys.exit(main())
