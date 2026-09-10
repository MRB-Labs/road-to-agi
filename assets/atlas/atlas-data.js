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
      /* the report already knows how to draw a layer mark — use its own
         renderer rather than a second copy that would drift from it */
      icon: (typeof layerIcon === 'function')
        ? layerIcon(node.icon || node.layer, 'nd-icon', node.layer) : '',
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

  /* Everything a search can match, drawn only from data already present. */
  function searchIndex(nodes) {
    const out = [];
    nodes.forEach(node => {
      const c = card(node), L = layerOf(node.layer);
      out.push({node: node.id, label: c.title, hint: 'Layer ' + node.layer});
      (c.lines || []).forEach(line =>
        line.split('·').map(s => s.trim()).filter(s => s.length > 2)
            .forEach(term => out.push({node: node.id, label: term, hint: c.title})));
      if (L && Array.isArray(L.co))
        L.co.forEach(row => row[0] && out.push({node: node.id, label: row[0], hint: c.title}));
    });
    /* one entry per label per node */
    const seen = new Set();
    return out.filter(r => {
      const k = r.node + '|' + r.label.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
  }

  return {card, detail, worldDetail, searchIndex, layerOf, ready: () => LAYERS_T().length > 0, have};
})();
