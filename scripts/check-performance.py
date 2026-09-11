#!/usr/bin/env python3
"""Simple size budgets for a static report.

The goal is not microscopic optimisation; it is preventing accidental bloat
from a pasted image, duplicated bundle or forgotten export.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
LIMITS = {
    'style.css': 190 * 1024,
    'script.js': 190 * 1024,
    'assets/atlas/earth.webp': 80 * 1024,
    'assets/images/social-card.png': 420 * 1024,
}
TOTAL_ASSETS_LIMIT = 24 * 1024 * 1024
IMAGE_LIMIT = 900 * 1024


def fmt(n):
    return '%.1f KB' % (n / 1024)


def main():
    bad = []
    for rel, limit in LIMITS.items():
        p = ROOT / rel
        if not p.exists():
            bad.append('%s is missing' % rel)
            continue
        size = p.stat().st_size
        if size > limit:
            bad.append('%s is %s, above %s' % (rel, fmt(size), fmt(limit)))

    total = 0
    for p in (ROOT / 'assets').rglob('*'):
        if not p.is_file():
            continue
        if p.name == '.DS_Store':
            bad.append('%s should not be committed' % p.relative_to(ROOT))
        size = p.stat().st_size
        total += size
        if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.gif'} and size > IMAGE_LIMIT:
            bad.append('%s is %s, above per-image budget %s' %
                       (p.relative_to(ROOT), fmt(size), fmt(IMAGE_LIMIT)))
    if total > TOTAL_ASSETS_LIMIT:
        bad.append('assets/ total is %s, above %s' % (fmt(total), fmt(TOTAL_ASSETS_LIMIT)))

    if bad:
        print('Performance budget problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('performance budgets OK: assets total %s' % fmt(total))
    return 0


if __name__ == '__main__':
    sys.exit(main())
