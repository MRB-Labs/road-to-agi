#!/usr/bin/env python3
"""Build the site's company registry and self-hosted brand assets.

Source of truth is AI_INFRASTRUCTURE_COMPANY_AND_LOGO_DATABASE_V2/. This script
reads it, maps every value-chain position onto this report's own chains using
brand/stage_map.py, and writes three things into the repository:

  assets/company-logos/<id>/icon.svg   one neutral identity tile per entity
  brand/company_registry.csv           one row per entity the site can name
  script.js  (between markers)         BRAND, MARKET_MAP and CT additions

Nothing here reaches the network, at build time or at run time. Entities the
database does not carry but the report already names keep working: a tile is
generated for them in the same deterministic style, and the registry records
that their origin is this report rather than the database.

    python3 brand/build-companies.py            rebuild everything
    python3 brand/build-companies.py --check    fail if the repo is out of date
"""
from __future__ import annotations
import csv, hashlib, html, json, re, shutil, sys, os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from stage_map import STAGE_MAP

ROOT = Path(__file__).parent.parent
DB   = ROOT / 'AI_INFRASTRUCTURE_COMPANY_AND_LOGO_DATABASE_V2'
MD   = DB / 'AI_INFRASTRUCTURE_COMPANY_VALUE_CHAIN_DATABASE.md'
MAN  = DB / 'logo_database' / 'company_logo_manifest.csv'
SRC_ASSETS = DB / 'logo_database' / 'assets'
OUT_ASSETS = ROOT / 'assets' / 'company-logos'
REGISTRY   = ROOT / 'brand' / 'company_registry.csv'
SCRIPT     = ROOT / 'script.js'

BEGIN = '/* BEGIN generated-company-data — built by brand/build-companies.py, do not edit here */'
END   = '/* END generated-company-data */'

# The same palette and rule the database's own generator uses, so a tile made
# here is indistinguishable from one made there.
# Groups rather than companies. The database quarantines these for the same
# reason: attaching a logo to "Hyperscalers" would be inventing an identity for
# something that has none.
GENERIC = {
 'Hyperscalers','Neoclouds','Governments','Enterprises','Model labs','Frontier labs',
 'Sovereign programmes','Licensed corpora','Open weights','Synthetic generation',
 'Enterprise APIs','On-robot selection','Logistics operators','Maintenance depots',
 'Utilities','Transformer makers','Turbine OEMs','Wafer makers','Magnet motor makers',
 'China separation capacity',
}

PALETTE = ("#2563EB","#0891B2","#0F766E","#15803D","#4F46E5",
           "#7C3AED","#9333EA","#BE123C","#C2410C","#A16207")

# Ticker suffix -> (country, stockanalysis exchange segment). Only suffixes the
# database actually uses are listed; anything else is left without a quote link
# rather than guessed at.
SUFFIX = {
 'SW':('Switzerland','swx'), 'L':('United Kingdom','lon'), 'DE':('Germany','etr'),
 'PA':('France','epa'),      'MI':('Italy','bit'),         'AS':('Netherlands','ams'),
 'MC':('Spain','bme'),       'CO':('Denmark','cph'),       'ST':('Sweden','sto'),
 'HE':('Finland','hel'),     'OL':('Norway','osl'),        'BR':('Belgium','ebr'),
 'VI':('Austria','vie'),     'T':('Japan','tyo'),          'KS':('South Korea','krx'),
 'KQ':('South Korea','krx'), 'TW':('Taiwan','tpe'),        'TWO':('Taiwan','tpe'),
 'HK':('Hong Kong','hkg'),   'SS':('China','sha'),         'SZ':('China','she'),
 'TO':('Canada','tsx'),      'V':('Canada','cve'),         'AX':('Australia','asx'),
 'NS':('India','nse'),       'BO':('India','bom'),         'SI':('Singapore','sgx'),
 'TA':('Israel','tlv'),      'SA':('Brazil','bvmf'),       'MX':('Mexico','bmv'),
 'IS':('Turkey','ist'),      'JO':('South Africa','jse'),  'NZ':('New Zealand','nzx'),
}

def slug(name: str) -> str:
    s = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return s or hashlib.sha1(name.encode()).hexdigest()[:10]

def initials(name: str) -> str:
    words = re.findall(r'[A-Za-z0-9]+', name)
    if not words: return '?'
    return words[0][:2].upper() if len(words) == 1 else (words[0][0] + words[-1][0]).upper()

def colour(cid: str) -> str:
    return PALETTE[hashlib.sha256(cid.encode()).digest()[0] % len(PALETTE)]

def icon_svg(name: str, cid: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-labelledby="title">\n'
            f'  <title id="title">{html.escape(name)}</title>\n'
            f'  <rect width="128" height="128" rx="28" fill="{colour(cid)}"/>\n'
            f'  <text x="64" y="69" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF" '
            f'font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" letter-spacing="-1">'
            f'{html.escape(initials(name))}</text>\n</svg>\n')

def parse_db():
    """Return [(layer_key, position, [entity names])] from the markdown."""
    md = MD.read_text()
    rows, layer = [], None
    for line in md.split('\n'):
        m = re.match(r'^# Layer (\d+)', line)
        if m: layer = m.group(1); continue
        if re.match(r'^# Cross-Stack', line, re.I): layer = 'X'; continue
        if re.match(r'^# (Commercial|Database)', line, re.I): layer = None; continue
        if not layer or not line.startswith('|') or '---' in line: continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) < 4 or cells[0] in ('Value-chain position','Security domain','Code'): continue
        names = []
        for cell in (cells[1], cells[2]):
            for part in cell.split(';'):
                part = re.sub(r'\([^)]*\)', '', part)          # drop tickers and parents
                part = re.sub(r'`[^`]*`', '', part).strip(' .')
                if part and part.lower() not in ('—','-','n/a','none'):
                    names.append(part)
        rows.append((layer, cells[0], names))
    return rows

def main():
    check = '--check' in sys.argv
    manifest = {r['display_name'].strip(): r for r in csv.DictReader(MAN.open())}
    by_norm  = {re.sub(r'[^a-z0-9]','',k.lower()): v for k, v in manifest.items()}

    # every name this report already uses, so none of them loses its mark
    js = SCRIPT.read_text()
    i = js.index('const CT='); k = js.index('{', i); depth = 0; j = k
    while j < len(js):
        c = js[j]
        if c in '"\'':
            q = c; j += 1
            while j < len(js):
                if js[j] == '\\': j += 2; continue
                if js[j] == q: break
                j += 1
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    ct_seg = js[k:j]
    existing = dict(re.findall(r"[\n{]\s*'([^']+)':\[\s*'?([^',\]]*)'?", ct_seg))
    existing.update(dict(re.findall(r'[\n{]\s*"([^"]+)":\[\s*"?([^",\]]*)"?', ct_seg)))

    db_rows = parse_db()
    market, entities = {}, {}

    def register(name, source):
        name = name.strip()
        if not name or name in GENERIC: return None
        rec = entities.get(name)
        if rec: return rec
        m = manifest.get(name) or by_norm.get(re.sub(r'[^a-z0-9]','',name.lower()))
        cid = (m['company_id'] if m else slug(name))
        tick = (m['ticker_query'].strip() if m else '')
        status = (m['entity_status'] if m else 'Unclassified')
        country, sa = '', ''
        if tick:
            base, _, suf = tick.partition('.')
            if not suf:
                country, sa = 'United States', 'stocks/%s' % base.lower()
            elif suf.upper() in SUFFIX:
                country, seg = SUFFIX[suf.upper()][0], SUFFIX[suf.upper()][1]
                sa = 'quote/%s/%s' % (seg, base.lower())
        rec = {'name':name,'id':cid,'ticker':tick,'status':status,'country':country,
               'sa':sa,'origin':('database' if m else source),
               'domain':(m['official_domain'] if m else '')}
        entities[name] = rec
        return rec

    for layer, position, names in db_rows:
        key = '%s::%s' % (layer, position)
        if key not in STAGE_MAP:
            print('  unmapped position (skipped): %s' % key)
            continue
        target = STAGE_MAP[key]
        if not target: continue
        for n in names:
            r = register(n, 'database')
            if r: market.setdefault(target, []).append(r['name'])
    for n in existing:
        register(n, 'report')

    # Names the chains use directly. Harvesting from CHAIN as well as CT catches
    # entities that were never given a ticker row, which would otherwise lose
    # their mark silently.
    chain_seg = js[js.index('const CHAIN={'):js.index('const TICK={')]
    for m in re.finditer(r"n:\[([^\]]*)\]", chain_seg):
        for part in m.group(1).split(','):
            nm = part.strip().strip("'").strip('"')
            if nm and nm not in GENERIC:
                register(nm, 'report')

    # ── assets ────────────────────────────────────────────────────────────────
    if not check:
        if OUT_ASSETS.exists(): shutil.rmtree(OUT_ASSETS)
        OUT_ASSETS.mkdir(parents=True)
    made = copied = 0
    for rec in entities.values():
        src = SRC_ASSETS / rec['id'] / 'icon.svg'
        dst = OUT_ASSETS / rec['id'] / 'icon.svg'
        if check: continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.exists():
            shutil.copyfile(src, dst); copied += 1
        else:
            dst.write_text(icon_svg(rec['name'], rec['id'])); made += 1

    # ── registry ──────────────────────────────────────────────────────────────
    if not check:
        with REGISTRY.open('w', newline='') as fh:
            w = csv.writer(fh)
            w.writerow(['company_id','display_name','entity_status','ticker','country',
                        'stockanalysis_path','official_domain','asset','origin','rights_status'])
            for rec in sorted(entities.values(), key=lambda r: r['name'].lower()):
                w.writerow([rec['id'], rec['name'], rec['status'], rec['ticker'], rec['country'],
                            rec['sa'], rec['domain'],
                            'assets/company-logos/%s/icon.svg' % rec['id'], rec['origin'],
                            'Generated neutral identifier — not an official mark'])

    # ── generated block in script.js ──────────────────────────────────────────
    brand = {r['name']: r['id'] for r in entities.values()}
    ct_add = {r['name']: [r['ticker'] or None, r['sa'] or None, r['country'] or None]
              for r in entities.values() if r['name'] not in existing}
    for key in market: market[key] = sorted(set(market[key]))
    block = (BEGIN + '\n'
      '/* Self-hosted company identity. Every mark is a local SVG under\n'
      '   assets/company-logos/; nothing is fetched from a logo API, a CDN or a\n'
      '   company website, at build time or at run time. The marks are neutral\n'
      '   identifiers rather than official trademarks — see brand/README.md. */\n'
      'const BRAND=' + json.dumps(brand, ensure_ascii=False, sort_keys=True) + ';\n'
      '/* The wider market map, mapped onto this report\'s own stages by\n'
      '   brand/stage_map.py. Curated entries in CHAIN are shown first; these\n'
      '   follow, so the chain keeps its argument and still names the field. */\n'
      'const MARKET_MAP=' + json.dumps(market, ensure_ascii=False, sort_keys=True) + ';\n'
      'Object.assign(CT,' + json.dumps(ct_add, ensure_ascii=False, sort_keys=True) + ');\n'
      + END)

    a = js.find(BEGIN); b = js.find(END)
    if a < 0:
        # after CT's own declaration: the block extends CT, and a const is in
        # its temporal dead zone until the declaration has run.
        anchor = js.index('\n', js.index('};', js.index('const CT='))) + 1
        new_js = js[:anchor] + '\n' + block + '\n\n' + js[anchor:]
    else:
        new_js = js[:a] + block + js[b+len(END):]
    if check:
        ok = (a >= 0 and js[a:b+len(END)] == block)
        print('script.js: %s' % ('up to date' if ok else 'OUT OF DATE — run brand/build-companies.py'))
        return 0 if ok else 1
    SCRIPT.write_text(new_js)

    print('entities:      %d  (%d from the database, %d already in the report)'
          % (len(entities), sum(1 for r in entities.values() if r['origin']=='database'),
             sum(1 for r in entities.values() if r['origin']=='report')))
    print('assets:        %d copied, %d generated here' % (copied, made))
    print('stages mapped: %d  carrying %d placements'
          % (len(market), sum(len(v) for v in market.values())))
    print('new CT rows:   %d' % len(ct_add))
    return 0

if __name__ == '__main__':
    sys.exit(main())
