/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — DATA ADAPTER
   The only place that knows how the report's tables are shaped. It reshapes
   them for the view and invents nothing: a field the project does not have
   comes back undefined, and the renderer simply leaves that section out.

   Reads: ATLAS_CARDS (the diagram's own short labels), LAYERS, LAYER_ICONS.
   ══════════════════════════════════════════════════════════════════════════ */

const AtlasData = (() => {
  const have = n => typeof window[n] !== 'undefined' ? window[n] : undefined;
  const LAYERS_T = () => (typeof LAYERS !== 'undefined' ? LAYERS : []);
  const layerOf = n => LAYERS_T().find(L => L.n === n) || null;
  const atlasGlyphs = {
    1: '<path d="M22 6 L11 39"/><path d="M22 6 L33 39"/><path d="M8 17 H36"/><path d="M5 27 H39"/><path d="M15 17 L29 27"/><path d="M29 17 L15 27"/><path d="M17 30 L27 38"/><path d="M27 30 L17 38"/><circle cx="22" cy="6" r="2.4"/><path d="M12 39 H32"/>',
    '1p': '<rect x="7" y="8" width="30" height="28" rx="7"/><path d="M25 12 L15 25 H22 L18.5 33 L29 20 H22 Z"/><path d="M12 14 H16"/><path d="M28 31 H33"/>',
    2: '<path d="M7 37 L12 24 L23 23 L28 37 Z"/><path d="M25 37 L29 25 L38 28 L37 37 Z"/><path d="M14 24 L20 11 L30 16 L24 23"/><path d="M13 24 L20 37"/><path d="M23 23 L15 36"/><path d="M29 25 L34 37"/><circle cx="20" cy="11" r="2"/>',
    3: '<rect x="13" y="13" width="18" height="18" rx="2.5"/><rect x="18" y="18" width="8" height="8" rx="1.5"/><path d="M13 8 V13"/><path d="M19 6 V13"/><path d="M25 6 V13"/><path d="M31 8 V13"/><path d="M13 31 V36"/><path d="M19 31 V38"/><path d="M25 31 V38"/><path d="M31 31 V36"/><path d="M8 13 H13"/><path d="M6 19 H13"/><path d="M6 25 H13"/><path d="M8 31 H13"/><path d="M31 13 H36"/><path d="M31 19 H38"/><path d="M31 25 H38"/><path d="M31 31 H36"/>',
    4: '<rect x="8" y="11" width="28" height="22" rx="3"/><path d="M12 17 H32"/><path d="M12 22 H32"/><path d="M12 27 H32"/><circle cx="15" cy="17" r="1.4"/><circle cx="15" cy="22" r="1.4"/><circle cx="15" cy="27" r="1.4"/><path d="M26 16 H32"/><path d="M26 22 H32"/><path d="M26 28 H32"/><path d="M6 36 H38"/><path d="M14 33 V36"/><path d="M30 33 V36"/>',
    5: '<rect x="7" y="8" width="30" height="8" rx="2.2"/><rect x="7" y="19" width="30" height="8" rx="2.2"/><rect x="7" y="30" width="30" height="8" rx="2.2"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="23" r="1.5"/><circle cx="12" cy="34" r="1.5"/><path d="M26 12 H33"/><path d="M26 23 H33"/><path d="M26 34 H33"/><path d="M22 16 V19"/><path d="M22 27 V30"/>',
    6: '<ellipse cx="22" cy="12" rx="13" ry="5"/><path d="M9 12 V32 A13 5 0 0 0 35 32 V12"/><path d="M9 22 A13 5 0 0 0 35 22"/><path d="M12 29 A13 5 0 0 0 32 29"/><path d="M35 17 C39 18 39 24 35 25"/><path d="M9 17 C5 18 5 24 9 25"/>',
    7: '<circle cx="22" cy="22" r="4"/><circle cx="22" cy="8" r="3"/><circle cx="34" cy="15" r="3"/><circle cx="34" cy="29" r="3"/><circle cx="22" cy="36" r="3"/><circle cx="10" cy="29" r="3"/><circle cx="10" cy="15" r="3"/><path d="M22 12 V18"/><path d="M25.5 20 L31.5 16.5"/><path d="M25.5 24 L31.5 27.5"/><path d="M22 26 V33"/><path d="M18.5 24 L12.5 27.5"/><path d="M18.5 20 L12.5 16.5"/><path d="M14 15 H30"/><path d="M14 29 H30"/>',
    8: '<path d="M13 13 L31 17"/><path d="M13 15 L31 27"/><path d="M13 22 L31 17"/><path d="M13 22 L31 27"/><path d="M13 31 L31 17"/><path d="M13 33 L31 27"/><circle cx="10" cy="13" r="3.2"/><circle cx="10" cy="22" r="3.2"/><circle cx="10" cy="31" r="3.2"/><rect x="31" y="13.8" width="6" height="6" rx="1.4"/><rect x="31" y="24.2" width="6" height="6" rx="1.4"/><path d="M37 17 H40"/><path d="M37 27 H40"/>',
    9: '<path d="M22 35 V21"/><path d="M15 35 H29"/><path d="M13 21 C13 16 17 12 22 12 C27 12 31 16 31 21"/><path d="M17 21 C17 18 19 16 22 16 C25 16 27 18 27 21"/><path d="M9 21 C9 13 15 7 22 7 C29 7 35 13 35 21"/><circle cx="22" cy="21" r="2.6"/><path d="M22 24 V28"/><path d="M18 38 H26"/>',
    10: '<rect x="16" y="5" width="12" height="9" rx="3"/><circle cx="19.5" cy="9.5" r="1.2"/><circle cx="24.5" cy="9.5" r="1.2"/><path d="M22 14 V17"/><rect x="14" y="17" width="16" height="12" rx="3"/><path d="M14 20 H9.5 L7.5 27"/><path d="M30 20 H34.5 L36.5 27"/><path d="M17.5 29 V34 L14.5 38"/><path d="M26.5 29 V34 L29.5 38"/><path d="M15 38 H20"/><path d="M24 38 H31"/><path d="M18 21 H26"/><path d="M18 25 H26"/>',
    sens: '<path d="M5 22 C9 14 15 10 22 10 C29 10 35 14 39 22 C35 30 29 34 22 34 C15 34 9 30 5 22 Z"/><circle cx="22" cy="22" r="6"/><circle cx="22" cy="22" r="2"/><path d="M11 12 L8 9"/><path d="M33 12 L36 9"/>',
    act: '<path d="M13 33 L22 24"/><path d="M22 24 L31 33"/><circle cx="22" cy="24" r="3.5"/><path d="M22 20 V12"/><path d="M16 12 H28"/><path d="M18 12 V7 H26 V12"/><path d="M13 33 L9 38"/><path d="M31 33 L35 38"/><path d="M11 36 H17"/><path d="M27 36 H33"/>'
  };
  function atlasIcon(key, cls, tone) {
    const body = atlasGlyphs[key] || atlasGlyphs[+key];
    if (!body) return (typeof layerIcon === 'function') ? layerIcon(key, cls, tone) : '';
    return `<svg class="licon ${cls || ''}" viewBox="0 0 44 44" aria-hidden="true" style="stroke:var(--l${tone == null ? key : tone})">${body}</svg>`;
  }

  /* What a card shows: its own short title and descriptor lines, the layer's
     number, and the layer mark already used everywhere else in the report. */
  function card(node) {
    const c = (typeof ATLAS_CARDS !== 'undefined' && ATLAS_CARDS[node.id]) || null;
    const L = layerOf(node.layer);
    return {
      id: node.id,
      layer: node.layer,
      title: c ? c.t : (L ? L.t : ''),
      lines: c ? c.s : [],
      icon: atlasIcon(node.icon || (atlasGlyphs[node.id] ? node.id : node.layer), 'nd-icon', node.layer),
      moat: L ? L.moat : undefined,
      mark: L ? L.mk : undefined,
    };
  }

  /* What the detail panel shows. Every section is optional: `detail` renders
     only the keys that came back with something in them. */
  function detail(layerNumber) {
    const L = layerOf(layerNumber);
    if (!L) return null;
    const facts = Array.isArray(L.facts) ? L.facts : [];
    const co    = Array.isArray(L.co) ? L.co : [];
    const watch = Array.isArray(L.watch) ? L.watch : [];
    return {
      n: L.n,
      title: L.t,
      moat: L.moat,
      mark: L.mk,
      role: L.lede,
      choke: L.choke,
      /* the first fact is the layer's headline number: [value, what, as-of, source] */
      metric: facts.length ? {
        value: facts[0][0], label: facts[0][1],
        asOf: facts[0][2], source: facts[0][3],
      } : undefined,
      /* the rest of the facts read well as a strip of secondary numbers */
      facts: facts.slice(1, 4).map(f => ({value: f[0], label: f[1]})),
      /* company rows are [name, what they do, metric, why] — the panel wants names */
      companies: co.slice(0, 8).map(c => c[0]).filter(Boolean),
      /* what to watch is [signal, why] — the signal alone is the chip */
      watch: watch.slice(0, 4).map(w => w[0]).filter(Boolean),
    };
  }

  /* The physical world is not a layer, so it has no row in LAYERS. Its panel
     is built from the same shape as any other, out of ATLAS_WORLD_TEXT — the
     only place its words live. */
  function worldDetail() {
    const t = (typeof ATLAS_WORLD_TEXT !== 'undefined') ? ATLAS_WORLD_TEXT : null;
    if (!t) return null;
    return {
      n: 0, title: t.t, moat: t.s, role: t.lede,
      icon: (typeof layerIcon === 'function') ? layerIcon(0, 'pn-mark', 0) : '',
      facts: [], companies: [], watch: t.reach || [],
    };
  }

  /* What the search can match: companies, by name and by ticker. Nothing else
     — a map you can already see does not need its own boxes indexed, and the
     one thing you cannot find by looking is which layer a company sits in.

     ATLAS_TICKERS is generated by build-content.py from CHAIN and TVSYM: one
     row per company per layer, [name, ticker, layer]. It exists because the
     tables it comes from are 80KB together and the overview needs neither.
     If it is missing, the layer's own short company list stands in. */
  function searchIndex(nodes) {
    /* Each layer answers with its main card: the one that is not a block
       inside an enclosure. A layer can be drawn three times — layer 10 is the
       machine, its sensors and its actuators — and the companies belong to the
       layer, so indexing per card would return NVIDIA five times. */
    const primary = {};
    nodes.forEach(n => {
      if (!primary[n.layer] || (primary[n.layer].sub && !n.sub)) primary[n.layer] = n;
    });
    const title = {};
    Object.keys(primary).forEach(k => title[k] = card(primary[k]).title);

    const rows = (typeof ATLAS_TICKERS !== 'undefined' && ATLAS_TICKERS.length)
      ? ATLAS_TICKERS
      : Object.keys(primary).flatMap(k => {
          const L = layerOf(primary[k].layer);
          return (L && Array.isArray(L.co) ? L.co : [])
            .filter(r => r[0]).map(r => [r[0], '', primary[k].layer]);
        });

    const atlasSearchLayerOverrides = {
      'tesla|tsla': [1, 10],
    };

    const grouped = new Map();
    rows.forEach(([name, ticker, layer]) => {
      const node = primary[layer];
      if (!node) return;
      const key = name.toLowerCase();
      if (!grouped.has(key))
        grouped.set(key, {nodes: [], layers: [], label: name, ticker: ticker || ''});
      const rec = grouped.get(key);
      if (!rec.ticker && ticker) rec.ticker = ticker;
      if (!rec.nodes.includes(node.id)) rec.nodes.push(node.id);
      if (!rec.layers.includes(layer)) rec.layers.push(layer);
    });
    return [...grouped.values()].map(rec => {
      const override = atlasSearchLayerOverrides[`${rec.label.toLowerCase()}|${rec.ticker.toLowerCase()}`];
      if (override) {
        rec.layers = override.filter(layer => primary[layer]);
        rec.nodes = rec.layers.map(layer => primary[layer].id);
      }
      rec.layers.sort((a, b) => a - b);
      rec.hint = rec.layers.map(layer => title[layer]).filter(Boolean).join(' · ');
      return rec;
    });
  }

  return {card, detail, worldDetail, searchIndex, layerOf, ready: () => LAYERS_T().length > 0, have};
})();
