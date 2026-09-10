#!/usr/bin/env python3
"""Split the content file per page, and write a no-JavaScript summary.

One 480KB content file was loaded by every page, because a shim let every
builder run everywhere. The builders gate themselves on their own mount point
now, so each page can be handed only the tables it uses.

Which tables that is comes from `content/page-tables.json`, derived by probing
rather than by reading the code: each page is loaded with one table emptied,
every tab, button and hoverable node is exercised, and the result compared with
the untouched page. The method is written up in scripts/probe-page-deps.md.

Every generated file still *declares* all 33 names — the ones the page does not
use are declared empty. A name that turns out to be needed then renders an
empty section rather than throwing a ReferenceError and taking out the page.

    python3 build-content.py            write assets/content-<page>.js
    python3 build-content.py --check    fail if a generated file has drifted
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).parent
SRC  = ROOT / 'assets' / 'content.js'
MAP  = json.loads((ROOT / 'content' / 'page-tables.json').read_text())
PAGES = {k: v for k, v in MAP.items() if not k.startswith('_')}

# Pages that carry no #rail and no #panels, so no layer panel is ever built.
LITE_PAGES = {'index.html', 'markets.html', 'environment.html', 'method.html'}

BEGIN = '<!-- BEGIN no-script-summary -->'
END   = '<!-- END no-script-summary -->'


def comment_spans(src):
    """(start, end) of every /* … */ block, skipping any inside a string."""
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c in '\'"`':
            q, i = c, i + 1
            while i < n and src[i] != q:
                i += 2 if src[i] == '\\' else 1
        elif c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            j = n if j < 0 else j + 2
            out.append((i, j)); i = j; continue
        elif c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            out.append((i, n if j < 0 else j)); i = n if j < 0 else j; continue
        i += 1
    return out


def chunks(src):
    """Tile the source into one chunk per top-level const, each carrying the
       comment block written above it."""
    starts = [m.start() for m in re.finditer(r'^const [A-Z_0-9]+\s*=', src, re.M)]
    names  = [re.match(r'^const ([A-Z_0-9]+)', src[s:]).group(1) for s in starts]
    spans = comment_spans(src)
    ends = {e: b for b, e in spans}

    def back(i):
        """Walk up past whitespace and whole comment blocks to the real start.
           Line-by-line heuristics do not work here: the middle lines of a
           block comment are ordinary prose, so a walker that tests each line
           stops inside the comment and splits it in half."""
        while True:
            j = i
            while j > 0 and src[j - 1] in ' \t\n':
                j -= 1
            if j in ends:
                i = ends[j]
                continue
            return j
    bounds = [back(s) for s in starts] + [len(src)]
    out = {}
    for i, n in enumerate(names):
        out[n] = src[bounds[i]:bounds[i + 1]]
    # `Object.assign(CT, …)` is generated beside MARKET_MAP but belongs to CT
    m = re.search(r'^Object\.assign\(CT,.*?\);\s*$', src, re.M | re.S)
    if m:
        for n in out:
            out[n] = out[n].replace(m.group(0), '')
        out['CT'] += '\n' + m.group(0) + '\n'
    return names, out


# Pages without a layer rail cannot render a layer panel, so they never touch
# the heavy per-layer fields — only the handful the map card and the matrix
# read. Trimming those four pages is where most of the weight goes.
LITE_KEYS = {'n', 't', 'moat', 'mk', 'lede', 'choke', 'why', 'chart',
             'facts', 'watch', 'co'}
# Some of those are only wanted in part. The atlas panel reads a layer's
# headline numbers, the signals to watch and the names of its companies — not
# the paragraphs beside them — so those arrays are cut down rather than
# dropped, which is the difference between an 11KB overview and a 47KB one.
LITE_SLICE = {'facts': (4, None), 'watch': (4, 1), 'co': (8, 1)}


def trim_layers(text, keep=LITE_KEYS):
    """Re-emit LAYERS with only the fields a page without a rail can use."""
    i = text.index('const LAYERS')
    head = text[:i]
    body = text[i:]
    marks = [m.start() for m in re.finditer(r'^\{n:\d+,t:', body, re.M)] + [len(body)]
    out = []
    for a, b in zip(marks, marks[1:]):
        seg, kept, j, d = body[a:b], [], 1, 0
        while j < len(seg):                      # walk the entry at depth 0
            c = seg[j]
            if c in '\'"`':
                q, j = c, j + 1
                while j < len(seg) and seg[j] != q:
                    j += 2 if seg[j] == '\\' else 1
            elif c in '{[':
                d += 1
            elif c in '}]':
                d -= 1
            elif d == 0:
                m = re.match(r'([a-zA-Z_]\w*)\s*:', seg[j:])
                if m and (seg[j - 1] in '{,' or seg[j - 1].isspace()):
                    k = m.group(1)
                    v = j + m.end()
                    end = value_end(seg, v)
                    if k in keep:
                        kept.append(slim(k, seg[j:end]) if k in LITE_SLICE
                                    else seg[j:end])
                    j = end - 1
            j += 1
        out.append('{' + ','.join(x.strip().rstrip(',') for x in kept) + '}')
    return head + 'const LAYERS=[\n' + ',\n'.join(out) + '\n];\n'


def slim(key, text):
    """Keep the first N rows of an array field, and the first M columns of each
       row. Everything cut is prose the atlas panel never reads."""
    rows_max, cols_max = LITE_SLICE[key]
    i = text.index('[')
    rows = split_depth1(text[i:])
    out = []
    for row in rows[:rows_max]:
        row = row.strip()
        if cols_max and row.startswith('['):
            cols = split_depth1(row)[:cols_max]
            out.append('[' + ','.join(c.strip() for c in cols) + ']')
        else:
            out.append(row)
    return text[:i] + '[' + ','.join(out) + ']'


def split_depth1(text):
    """The comma-separated items of the bracketed value starting at text[0]."""
    items, depth, start, i = [], 0, 1, 1
    while i < len(text):
        c = text[i]
        if c in '\'"`':
            q, i = c, i + 1
            while i < len(text) and text[i] != q:
                i += 2 if text[i] == '\\' else 1
        elif c in '[{(':
            depth += 1
        elif c in ')}':
            depth -= 1
        elif c == ']':
            if depth == 0:
                items.append(text[start:i]); return items
            depth -= 1
        elif c == ',' and depth == 0:
            items.append(text[start:i]); start = i + 1
        i += 1
    items.append(text[start:])
    return items


def value_end(seg, i):
    """Index just past the value starting at i."""
    d = 0
    while i < len(seg):
        c = seg[i]
        if c in '\'"`':
            q, i = c, i + 1
            while i < len(seg) and seg[i] != q:
                i += 2 if seg[i] == '\\' else 1
        elif c in '{[':
            d += 1
        elif c in '}]':
            if d == 0:
                return i
            d -= 1
        elif c == ',' and d == 0:
            return i
        i += 1
    return i


def empty_like(text):
    """A declaration of the same kind, with nothing in it."""
    m = re.search(r'^const ([A-Z_0-9]+)\s*=\s*(.)', text, re.M)
    kind = '[]' if m.group(2) == '[' else '{}'
    return 'const %s=%s;\n' % (m.group(1), kind)


JS_ESC = {"'": "'", '"': '"', '\\': '\\', 'n': '\n', 't': '\t', '/': '/'}


def unesc(text):
    """Undo the JavaScript string escapes, \\uXXXX included. A naive chain of
       replaces turns \\u2019 into u2019, which is how a stray "worldu2019s"
       got into the summary the first time."""
    out, i = [], 0
    while i < len(text):
        c = text[i]
        if c == '\\' and i + 1 < len(text):
            nxt = text[i + 1]
            if nxt == 'u' and i + 5 < len(text):
                try:
                    out.append(chr(int(text[i + 2:i + 6], 16))); i += 6; continue
                except ValueError:
                    pass
            out.append(JS_ESC.get(nxt, nxt)); i += 2; continue
        out.append(c); i += 1
    return ''.join(out)


def layer_summary(src):
    """The ten layers as plain HTML, for a reader or crawler without scripts."""
    i = src.index('const LAYERS')
    body = src[i:]
    field = lambda seg, k: (re.search(r"\b%s\s*:\s*'((?:[^'\\]|\\.)*)'" % k, seg) or [None, ''])[1]
    # these fields are authored HTML fragments — the binding constraint carries
    # its own <b> — so they pass through as written, exactly as the panels use
    # them; only the JavaScript string escapes are undone
    esc = unesc
    rows, marks = [], [m.start() for m in re.finditer(r'^\{n:\d+,t:', body, re.M)] + [len(body)]
    for a, b in zip(marks, marks[1:]):
        seg = body[a:b]
        n = re.match(r'^\{n:(\d+)', seg).group(1)
        t, lede, choke = field(seg, 't'), field(seg, 'lede'), field(seg, 'choke')
        if not t:
            continue
        rows.append('<li><h3>Layer %s &middot; %s</h3><p>%s</p>'
                    '<p><b>Binding constraint.</b> %s</p></li>'
                    % (n, esc(t), esc(lede), esc(choke)))
    return ('<noscript>\n<div class="ns-summary">\n'
            '<p>This report draws its diagrams and tables with JavaScript. '
            'Here is the substance without it.</p>\n<ol class="ns-layers">\n'
            + '\n'.join(rows) + '\n</ol>\n</div>\n</noscript>')


# ── the atlas ticker index ───────────────────────────────────────────────────
# The overview's map has a search, and it looks for companies by name and by
# ticker. It cannot read the tables that hold them: CHAIN is 72KB and TVSYM
# 10KB, and neither belongs on a page that only needs the lookup. So the lookup
# is built here instead — one row per company the site places anywhere, with
# its symbol when the site knows one — and shipped as ATLAS_TICKERS.
def ticker_index(src):
    """[name, ticker, layer] for every company CHAIN places, symbol if known."""
    sym = {}
    m = re.search(r'const TVSYM=\{(.*?)\n\};', src, re.S)
    for name, listing in re.findall(r'"((?:[^"\\]|\\.)*)" *: *"([^"]+)"', m.group(1)):
        sym[name] = listing.split(':')[-1]

    body = src[src.index('const CHAIN='):src.index('const TICK=')]
    rows, seen = [], set()
    layer = None
    for m in re.finditer(r"^(\d+):\{lead:|n:\[([^\]]*)\]", body, re.M):
        if m.group(1):
            layer = int(m.group(1))
            continue
        for name in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(2)):
            key = (name, layer)
            if key in seen:
                continue
            seen.add(key)
            rows.append((name, sym.get(name, ''), layer))
    rows.sort(key=lambda r: (r[1] == '', r[0]))
    return ('\n/* GENERATED: the atlas search index — company, ticker, layer. */\n'
            'const ATLAS_TICKERS=[' +
            ','.join('["%s","%s",%d]' % (n.replace('"', '\\"'), t, l)
                     for n, t, l in rows) + '];\n')


def main():
    check = '--check' in sys.argv
    src = SRC.read_text()
    names, ch = chunks(src)
    summary = layer_summary(src)
    stale = []

    for page, wanted in PAGES.items():
        want = set(wanted)
        missing = want - set(names)
        assert not missing, 'unknown table(s) in page-tables.json: %s' % sorted(missing)
        parts = ['/* GENERATED by build-content.py from assets/content.js — do not edit.\n'
                 '   %s carries %d of the %d content tables; the rest are declared\n'
                 '   empty so a builder can never hit a ReferenceError. */\n'
                 % (page, len(want), len(names))]
        lite = page in LITE_PAGES
        for n in names:
            if n not in want:
                parts.append(empty_like(ch[n]))
            elif n == 'LAYERS' and lite:
                parts.append(trim_layers(ch[n]))
            else:
                parts.append(ch[n])
        if page == 'index.html':
            parts.append(ticker_index(src))
        out = ROOT / 'assets' / ('content-%s.js' % page[:-5])
        text = ''.join(parts)
        if check:
            if not out.exists() or out.read_text() != text:
                stale.append(out.name)
        else:
            out.write_text(text)

        # the page loads its own file, and carries the no-script summary
        p = ROOT / page
        html = p.read_text()
        # keep the cache-busting query bump-assets.py puts there, or --check
        # would call every page stale on every run
        def point_at(m):
            return ('src="assets/%s%s"' % (out.name, m.group(2) or '')
                    if m.group(1) != out.name else m.group(0))
        new = re.sub(r'src="assets/(content(?:-[a-z]+)?\.js)(\?[^"]*)?"',
                     point_at, html, count=1)
        if BEGIN in new:
            block = BEGIN + '\n' + summary + '\n' + END
            # a plain lambda, not a template: the prose carries backslashes
            new = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END),
                         lambda _m: block, new, flags=re.S)
        else:
            new = new.replace('</main>', BEGIN + '\n' + summary + '\n' + END + '\n</main>', 1)
        if check:
            if new != html:
                stale.append(page)
        elif new != html:
            p.write_text(new)

    if check:
        if stale:
            print('stale generated files: %s' % ', '.join(sorted(set(stale))))
            print('Run: python3 build-content.py')
            return 1
        print('per-page content files are current (%d pages)' % len(PAGES))
        return 0
    total = sum((ROOT / 'assets' / ('content-%s.js' % p[:-5])).stat().st_size for p in PAGES)
    print('wrote %d files, %d KB total (source is %d KB, loaded %d times before)'
          % (len(PAGES), total // 1024, len(src) // 1024, len(PAGES)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
