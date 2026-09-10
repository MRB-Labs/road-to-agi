/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — GEOMETRY
   Anchors, orthogonal route building, and the generated background art.
   Nothing here knows what a layer means; it only knows where things are.
   ══════════════════════════════════════════════════════════════════════════ */

const AtlasGeom = (() => {
  const STUB = 18;          // how far a route leaves a card before it turns
  const R    = 12;          // corner radius on the routes

  /* ── anchors ───────────────────────────────────────────────────────────── */
  function anchor(node, side, off) {
    const o = off || 0;
    switch (side) {
      case 'left':   return {p:[node.x, node.y + node.h / 2 + o],       n:[-1, 0]};
      case 'right':  return {p:[node.x + node.w, node.y + node.h / 2 + o], n:[1, 0]};
      case 'top':    return {p:[node.x + node.w / 2 + o, node.y],       n:[0, -1]};
      default:       return {p:[node.x + node.w / 2 + o, node.y + node.h], n:[0, 1]};
    }
  }

  /* ── the router ────────────────────────────────────────────────────────── */
  /* Points are produced, then rounded. Guides are threaded in order: {x:…}
     turns the run vertical at that column, {y:…} turns it horizontal at that
     row. The last leg always arrives square-on to the target's own side, so a
     route can never appear to graze a card. */
  function route(a, b, opts) {
    const o = opts || {};
    const side = o.side || ['right', 'left'];
    /* dx offsets the departure along its own edge; dy the arrival. tx is the
       same as dy but named for routes that aim at a group rather than a card,
       where "along the edge" is the only way to say where. */
    const A = anchor(a, side[0], o.dx), B = anchor(b, side[1], o.tx || o.dy);
    const pts = [A.p.slice()];
    let cur = [A.p[0] + A.n[0] * STUB, A.p[1] + A.n[1] * STUB];
    pts.push(cur.slice());

    (o.via || []).forEach(g => {
      if (g.x !== undefined) { cur = [g.x, cur[1]]; }
      else                   { cur = [cur[0], g.y]; }
      pts.push(cur.slice());
    });

    const Bo = [B.p[0] + B.n[0] * STUB, B.p[1] + B.n[1] * STUB];
    if (cur[0] !== Bo[0] && cur[1] !== Bo[1]) {
      /* one elbow, turned so the final leg runs along the target's normal */
      pts.push(B.n[0] !== 0 ? [cur[0], Bo[1]] : [Bo[0], cur[1]]);
    }
    pts.push(Bo, B.p.slice());
    return roundPath(dedupe(pts));
  }

  function dedupe(pts) {
    const out = [];
    pts.forEach(p => {
      const q = out[out.length - 1];
      if (q && q[0] === p[0] && q[1] === p[1]) return;          // same point
      const r = out[out.length - 2];
      if (q && r && ((r[0] === q[0] && q[0] === p[0]) ||
                     (r[1] === q[1] && q[1] === p[1]))) out.pop(); // collinear
      out.push(p.slice());
    });
    return out;
  }

  function roundPath(pts) {
    if (pts.length < 3) return 'M' + pts.map(p => p.join(' ')).join(' L');
    let d = 'M' + pts[0].join(' ');
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i], a = pts[i - 1], b = pts[i + 1];
      const r = Math.min(R, len(a, p) / 2, len(p, b) / 2);
      const i1 = towards(p, a, r), i2 = towards(p, b, r);
      d += ' L' + i1.join(' ') + ' Q' + p.join(' ') + ' ' + i2.join(' ');
    }
    return d + ' L' + pts[pts.length - 1].join(' ');
  }
  const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  function towards(from, to, d) {
    const l = len(from, to) || 1;
    return [round(from[0] + (to[0] - from[0]) / l * d),
            round(from[1] + (to[1] - from[1]) / l * d)];
  }
  const round = v => Math.round(v * 100) / 100;


  /* ── fanning ───────────────────────────────────────────────────────────── */
  /* Centring an arrow on its card only reads well when there is one arrow. Two
     leaving the same edge from the same point are indistinguishable, so every
     route end on a given (card, side) is collected here and spread evenly about
     the centre. The order is by where the far end sits across that edge, which
     is what keeps a fan from crossing itself. An explicit dx/tx in the layout
     still wins: it is written there because that run had to clear something.
     40 is the widest step it will use; it narrows when the edge is too short.
     Routes marked with the same `trunk` are a fork, not two arrows: they share
     one slot, so they leave from the same point on purpose. */
  function fan(nodes, routes) {
    const by = {}, off = routes.map(() => ({}));
    routes.forEach((r, i) => {
      const s = r.side || ['right', 'left'];
      [[r.from, s[0], 'dx'], [r.to, s[1], 'tx']].forEach(([id, side, prop]) => {
        const k = id + '|' + side;
        (by[k] = by[k] || []).push({i, prop, id, side});
      });
    });
    Object.keys(by).forEach(k => {
      const list = by[k], host = nodes[list[0].id];
      if (!host) return;
      const vert = list[0].side === 'left' || list[0].side === 'right';
      const across = e => {
        const r = routes[e.i], far = nodes[e.prop === 'dx' ? r.to : r.from];
        return far ? (vert ? far.y + far.h / 2 : far.x + far.w / 2) : 0;
      };
      /* A fork takes one slot, not one per branch: trunk-mates leave together
         and are meant to sit on top of each other until they part. */
      const slots = [], seen = {};
      list.forEach(e => {
        const t = e.prop === 'dx' && routes[e.i].trunk;
        if (t && seen[t] !== undefined) { slots[seen[t]].push(e); return; }
        if (t) seen[t] = slots.length;
        slots.push([e]);
      });
      if (slots.length < 2) { slots.forEach(sl => sl.forEach(e => keep(e))); return; }
      const at = sl => sl.reduce((a, e) => a + across(e), 0) / sl.length;
      slots.sort((p, q) => at(p) - at(q) || p[0].i - q[0].i);
      const n = slots.length, extent = vert ? host.h : host.w;
      const step = Math.min(40, Math.max(12, (extent - 40) / (n - 1)));
      slots.forEach((sl, j) => sl.forEach(e => keep(e, Math.round((j - (n - 1) / 2) * step))));

      function keep(e, auto) {
        const r = routes[e.i];
        const given = e.prop === 'dx' ? r.dx : (r.tx !== undefined ? r.tx : r.dy);
        const v = given !== undefined ? given : auto;
        if (v !== undefined) off[e.i][e.prop] = v;
      }
    });
    return off;
  }

  /* ── background art, all generated, all local ──────────────────────────── */
  /* A fixed seed, so the sky is the same on every load and in every snapshot. */
  function rng(seed) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  }

  function stars(w, h, count) {
    const r = rng(20260909), out = [];
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, m = r();
      out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" ` +
               `r="${(m * m * 1.5 + .35).toFixed(2)}" fill="#cfe8ff" ` +
               `opacity="${(m * .5 + .07).toFixed(2)}"/>`);
    }
    return out.join('');
  }

  function arcs(w, h) {
    const a = [];
    for (let i = 0; i < 4; i++) {
      const rx = w * (.52 + i * .16), ry = h * (.62 + i * .2);
      a.push(`<ellipse cx="${w * .93}" cy="${h * .45}" rx="${rx.toFixed(0)}" ` +
             `ry="${ry.toFixed(0)}" fill="none" stroke="#4f9ad0" ` +
             `stroke-opacity="${(.11 - i * .022).toFixed(3)}" stroke-width="1"/>`);
    }
    return a.join('');
  }

  /* The faint world behind the stack: the same continent art as the planet,
     blown up and filled with a dot pattern. */
  function worldDots(w, h) {
    if (typeof ATLAS_LAND === 'undefined') return '';
    const s = w / 150, tx = w * .30, ty = h * .46;
    const paths = ATLAS_LAND.map(d => `<path d="${d}"/>`).join('');
    return `<g transform="translate(${tx.toFixed(0)} ${ty.toFixed(0)}) scale(${s.toFixed(3)})"
              opacity=".5"><g clip-path="url(#atlasWorldClip)"></g>
            <g fill="url(#atlasDots)" stroke="none">${paths}</g></g>`;
  }

  /* The planet. Built from the report's own globe art with a night side, a
     lit rim, city lights on the dark half and an outer atmosphere. */
  function earth(cx, cy, r) {
    const k = r / 52;                                     // the art is drawn at r=52
    const land  = (typeof ATLAS_LAND  !== 'undefined' ? ATLAS_LAND  : []);
    const cloud = (typeof ATLAS_CLOUD !== 'undefined' ? ATLAS_CLOUD : []);
    const lightsR = rng(7771), lights = [];
    for (let i = 0; i < 90; i++) {
      const t = lightsR() * Math.PI * 2, rad = Math.sqrt(lightsR()) * 50;
      const x = Math.cos(t) * rad, y = Math.sin(t) * rad * .92;
      if (x < 4) continue;                                // only the night side
      lights.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" ` +
                  `r="${(lightsR() * .8 + .35).toFixed(2)}" fill="#ffd9a0" ` +
                  `opacity="${(lightsR() * .55 + .2).toFixed(2)}"/>`);
    }
    return `
    <g class="pw-globe" transform="translate(${cx} ${cy}) scale(${k.toFixed(4)})">
      <circle r="86" fill="url(#atlasHalo)"/>
      <circle r="53.5" fill="none" stroke="#7fd0ff" stroke-opacity=".5" stroke-width="2.5"
              filter="url(#atlasSoft)"/>
      <circle class="pw-rim" r="52" fill="#0b2d4d" stroke="#8fdcff" stroke-opacity=".85" stroke-width="1.4"/>
      <g clip-path="url(#atlasGlobeClip)">
        <circle r="52" fill="url(#atlasSea)"/>
        <ellipse cx="0" cy="-52" rx="42" ry="15" fill="#dff2ff" opacity=".55"/>
        <ellipse cx="0" cy="52"  rx="42" ry="15" fill="#dff2ff" opacity=".55"/>
        <g fill="url(#atlasLand)" stroke="#6ee7c8" stroke-opacity=".35" stroke-width=".6">
          ${land.map(d => `<path d="${d}"/>`).join('')}
        </g>
        <g fill="none" stroke="#9fe6ff" stroke-opacity=".16" stroke-width=".7">
          <ellipse rx="52" ry="18"/><ellipse rx="52" ry="36"/>
          <ellipse rx="18" ry="52"/><ellipse rx="36" ry="52"/>
          <path d="M-52 0H52"/><path d="M0 -52V52"/>
        </g>
        ${lights.join('')}
        <g fill="#eaf7ff" opacity=".18">${cloud.map(d => `<path d="${d}"/>`).join('')}</g>
        <circle r="52" fill="url(#atlasNight)"/>
      </g>
    </g>`;
  }

  return {anchor, route, fan, stars, arcs, worldDots, earth, rng};
})();
