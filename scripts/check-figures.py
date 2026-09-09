#!/usr/bin/env python3
"""Count the time-sensitive figures in the prose that carry no date.

A figure without a date is not a fact, it is a memory. The 35 chokepoints
already carry `as_of` and `src`; the prose does not, and dating it means
verifying it, which is reading work rather than tooling work.

So this is a ratchet, not a blocker. It records how many undated figures each
table holds and fails only if that number *goes up* — new prose cannot add to
the backlog, and the backlog shrinks as the reading gets done.

    python3 scripts/check-figures.py            fail if any table got worse
    python3 scripts/check-figures.py --list     show the undated figures
    python3 scripts/check-figures.py --accept   record the current counts

A string counts as dated if it names a year, says "as of", or sits in a record
that carries an as_of field.
"""
import argparse, importlib.util, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = ROOT / 'content' / 'figures-baseline.json'

# reuse the extractor the wording guard already uses, so the two cannot drift
spec = importlib.util.spec_from_file_location('cc', ROOT / 'check-content.py')
cc = importlib.util.module_from_spec(spec); spec.loader.exec_module(cc)

# What counts as time-sensitive: a share, a sum of money, a physical capacity,
# a multiple. Plain counts and layer numbers are not claims that go stale.
FIGURE = re.compile(r"""
      \d[\d,.]*\s?%                                   # 44%, 3.5 %
    | [$£€]\s?\d                                      # $38bn
    | \b\d[\d,.]*\s?(?:bn|billion|trillion|million)\b
    | \b\d[\d,.]*\s?(?:[GMTk]W|[GMT]Wh|kt|Mt|tonnes?|tons?)\b
    | \b\d[\d,.]*\s?(?:x|×)\b                         # 3x, 10×
""", re.X | re.I)
DATED = re.compile(r'\b(?:19|20)\d\d\b|as of|year[- ]to[- ]date|latest quarter', re.I)


def near_as_of(src, text):
    """A record carrying an as_of field dates every string inside it — that is
       how the 35 chokepoints are already qualified. Rather than re-parse the
       object, look for as_of in the window a sibling field would occupy."""
    i = src.find(text)
    while i != -1:
        if 'as_of' in src[max(0, i - 240):i + len(text) + 600]:
            return True
        i = src.find(text, i + 1)
    return False


def survey():
    """{table: [(key, text), …]} for every string holding an undated figure."""
    out, seen = {}, {}
    for path in (ROOT / 'assets' / 'content.js', ROOT / 'script.js'):
        src = path.read_text()
        for t in cc.TABLES:
            m = re.search(r'\bconst ' + t + r'\s*=\s*[\{\[]', src)
            if not m:
                continue
            for key, text in cc.strings_in(src, m.start()):
                if not FIGURE.search(text) or DATED.search(text):
                    continue
                if near_as_of(src, text):
                    continue
                seen[t] = seen.get(t, 0) + 1
                out.setdefault(t, []).append(('%s/%s' % (t, key), text))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--accept', action='store_true')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()

    found = survey()
    counts = {t: len(v) for t, v in sorted(found.items())}
    total = sum(counts.values())

    if a.list:
        for t, rows in sorted(found.items()):
            print('\n%s (%d)' % (t, len(rows)))
            for k, text in rows[:25]:
                print('  %s' % text[:150])
            if len(rows) > 25:
                print('  … and %d more' % (len(rows) - 25))
        return 0

    if a.accept:
        BASE.write_text(json.dumps({'undated': counts, 'total': total},
                                   indent=1, sort_keys=True) + '\n')
        print('baseline recorded: %d undated figures across %d tables'
              % (total, len(counts)))
        return 0

    if not BASE.exists():
        print('no baseline yet. Run: python3 scripts/check-figures.py --accept')
        return 1
    was = json.loads(BASE.read_text())['undated']
    worse = {t: (was.get(t, 0), n) for t, n in counts.items() if n > was.get(t, 0)}
    better = {t: (was[t], counts.get(t, 0)) for t in was if counts.get(t, 0) < was[t]}

    if worse:
        print('More undated figures than the baseline allows:')
        for t, (b, n) in sorted(worse.items()):
            print('  %-18s %d → %d' % (t, b, n))
        print('\nEither date the new figures — a year, or "as of" — or, if the '
              'increase is intended,\nrecord it: python3 scripts/check-figures.py --accept')
        return 1
    if better:
        print('Undated figures have gone down:')
        for t, (b, n) in sorted(better.items()):
            print('  %-18s %d → %d' % (t, b, n))
        print('\nLock the improvement in: python3 scripts/check-figures.py --accept')
        return 0
    print('undated figures: %d, unchanged (see --list)' % total)
    return 0


if __name__ == '__main__':
    sys.exit(main())
