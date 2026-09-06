#!/usr/bin/env python3
"""Refresh assets/market/fundamentals.json from Financial Modeling Prep.

Runs in GitHub Actions, never in the browser: the API key comes from the
FMP_API_KEY secret and never reaches the published site. The site reads only
the JSON this writes.

Call budget
-----------
FMP's free tier allows roughly 250 calls a day, and there are ~144 companies.
Quotes and profiles are batched (50 symbols a call, so ~6 calls covers
everything). Statements are per-symbol and cannot be batched, so each run
refreshes only the stalest companies within --budget. Quotes therefore stay
current daily while statements rotate through the set over several runs, which
is ample for numbers that change quarterly.

Usage
-----
    FMP_API_KEY=... python3 scripts/fetch_fundamentals.py --budget 200
    python3 scripts/fetch_fundamentals.py --selftest    # no key, no network
"""
import argparse, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYMBOLS = os.path.join(ROOT, 'assets', 'market', 'symbols.json')
OUT = os.path.join(ROOT, 'assets', 'market', 'fundamentals.json')
BASE = 'https://financialmodelingprep.com/api/v3'

class Budget:
    def __init__(self, n): self.left = n; self.used = 0
    def take(self, n=1):
        if self.left < n: return False
        self.left -= n; self.used += n; return True

def get(path, key, budget, params=None):
    if not budget.take(): return None
    q = dict(params or {}); q['apikey'] = key
    url = f'{BASE}/{path}?{urllib.parse.urlencode(q)}'
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'road-to-agi-fundamentals'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 429:                      # rate limited: back off, then give up
                time.sleep(5 * (attempt + 1)); continue
            if e.code in (401, 403):
                print(f'::error::FMP rejected the key ({e.code}). Check the FMP_API_KEY secret.')
                sys.exit(1)
            return None
        except Exception:
            time.sleep(2); continue
    return None

def chunks(xs, n):
    for i in range(0, len(xs), n): yield xs[i:i + n]

def num(v):
    try:
        f = float(v)
        return None if f != f else f          # drop NaN
    except (TypeError, ValueError):
        return None

def refresh(key, budget):
    syms = json.load(open(SYMBOLS))['symbols']
    prev = {}
    if os.path.exists(OUT):
        try: prev = json.load(open(OUT)).get('companies', {})
        except Exception: prev = {}

    by_symbol = {}
    for name, sym in syms.items(): by_symbol.setdefault(sym, []).append(name)
    out = {n: dict(prev.get(n, {})) for n in syms}

    # ── batched: quote and profile cover every company for a handful of calls ──
    for group in chunks(sorted(by_symbol), 50):
        data = get('quote/' + ','.join(group), key, budget) or []
        for q in data:
            for name in by_symbol.get(q.get('symbol'), []):
                out[name].update({
                    'price': num(q.get('price')), 'change': num(q.get('change')),
                    'changePct': num(q.get('changesPercentage')),
                    'marketCap': num(q.get('marketCap')), 'pe': num(q.get('pe')),
                    'eps': num(q.get('eps')), 'volume': num(q.get('volume')),
                    'avgVolume': num(q.get('avgVolume')),
                    'yearHigh': num(q.get('yearHigh')), 'yearLow': num(q.get('yearLow')),
                    'exchange': q.get('exchange'), 'quoteAt': datetime.now(timezone.utc).isoformat(timespec='seconds'),
                })
    for group in chunks(sorted(by_symbol), 50):
        data = get('profile/' + ','.join(group), key, budget) or []
        for p in data:
            for name in by_symbol.get(p.get('symbol'), []):
                out[name].update({'beta': num(p.get('beta')),
                                  'currency': p.get('currency'),
                                  'site': p.get('website') or None})

    # ── per-symbol: statements, stalest first, only while budget allows ────────
    order = sorted(syms, key=lambda n: out[n].get('statementsAt') or '')
    refreshed = 0
    for name in order:
        if budget.left < 2: break
        sym = syms[name]
        inc = get(f'income-statement/{sym}', key, budget, {'limit': 1, 'period': 'annual'}) or []
        cf = get(f'cash-flow-statement/{sym}', key, budget, {'limit': 1, 'period': 'annual'}) or []
        if inc:
            r = inc[0]
            rev, gp = num(r.get('revenue')), num(r.get('grossProfit'))
            out[name].update({
                'revenue': rev, 'netIncome': num(r.get('netIncome')),
                'grossMargin': (gp / rev) if (rev and gp is not None and rev != 0) else None,
                'fiscalYear': r.get('calendarYear'), 'reportCurrency': r.get('reportedCurrency'),
            })
        if cf:
            out[name]['freeCashFlow'] = num(cf[0].get('freeCashFlow'))
        if inc or cf:
            out[name]['statementsAt'] = datetime.now(timezone.utc).isoformat(timespec='seconds')
            refreshed += 1

    have_quote = sum(1 for v in out.values() if v.get('price') is not None)
    have_stmt = sum(1 for v in out.values() if v.get('revenue') is not None)
    missing = sorted(n for n, v in out.items() if v.get('price') is None)
    return {
        'generated': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'source': 'Financial Modeling Prep',
        'companies': out,
    }, {'calls': budget.used, 'quotes': have_quote, 'statements': have_stmt,
        'refreshedStatements': refreshed, 'total': len(syms), 'missing': missing}

def selftest():
    """Exercise the shaping logic with no key and no network."""
    assert num('12.5') == 12.5 and num(None) is None and num('x') is None
    assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
    b = Budget(2)
    assert b.take() and b.take() and not b.take()
    syms = json.load(open(SYMBOLS))['symbols']
    assert len(syms) > 100, 'symbol map looks empty'
    bad = [s for s in syms.values() if not s or ' ' in s]
    assert not bad, f'malformed symbols: {bad[:5]}'
    print(f'selftest ok — {len(syms)} symbols, shaping and budget logic sound')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--budget', type=int, default=200, help='max API calls this run')
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    if a.selftest: selftest(); raise SystemExit(0)
    key = os.environ.get('FMP_API_KEY')
    if not key:
        print('::error::FMP_API_KEY is not set'); raise SystemExit(1)
    payload, stats = refresh(key, Budget(a.budget))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as f:
        json.dump(payload, f, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    print(f"calls={stats['calls']} quotes={stats['quotes']}/{stats['total']} "
          f"statements={stats['statements']}/{stats['total']} "
          f"refreshed={stats['refreshedStatements']}")
    if stats['missing']:
        print(f"no quote for {len(stats['missing'])}: {', '.join(stats['missing'][:20])}")
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary, 'a') as f:
            f.write(f"## Fundamentals refresh\n\n"
                    f"- API calls: **{stats['calls']}**\n"
                    f"- Quotes: **{stats['quotes']}/{stats['total']}**\n"
                    f"- Statements: **{stats['statements']}/{stats['total']}** "
                    f"({stats['refreshedStatements']} refreshed this run)\n")
            if stats['missing']:
                f.write(f"- No quote for {len(stats['missing'])}: "
                        f"{', '.join(stats['missing'][:30])}\n")
