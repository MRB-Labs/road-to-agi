/* ══════════════════════════════════════════════════════════════════════════
   MULTI-PAGE GUARD
   The report is split across several pages, so any given page holds only a
   subset of the mount points the builders below write into.

   This used to be a shim that made getElementById return a detached element
   for an absent id, so every builder could run everywhere and write into the
   void. It had two costs. It silently disabled every `if(!el) return` guard in
   this file — those lines could never fire, so each page ran all of the work
   for all of the pages. And it made every table load-bearing on every page,
   which is why one 480KB content file had to be shipped to all of them.

   Builders now gate themselves on their own mount point, and `put` is there
   for the one-line writes.
   ══════════════════════════════════════════════════════════════════════════ */

/* Fetched fundamentals, populated further down once the JSON lands. Declared
   here rather than beside that fetch because `let` is not hoisted the way a
   `var` is: anything reading it earlier throws, and `typeof` does not protect
   against that — it throws too. Reading it before the fetch returns null,
   which every caller already handles. */
let FUNDA=null, FUNDA_META=null;

/* Is this page the one that carries that mount point? */
const onPage=id=>!!document.getElementById(id);

/* ══════════════════════════════════════════════════════════════════════════
   V4 — company reference data and per-layer value chains
   ══════════════════════════════════════════════════════════════════════════ */


/* Who depends on whom, stage by stage. Chokepoint stages are flagged. */


/* ══════════════════════════════════════════════════════════════════════════
   V6 — ticker links and per-layer source registers
   ══════════════════════════════════════════════════════════════════════════ */


const SA='https://stockanalysis.com/';

/* Source register. Links resolve to the publisher, dataset or filings search
   rather than to a single document, because several underlying items sit
   behind subscriptions or are not stably addressable. */
const SRC_SHARED=[
 ['SEC EDGAR full-text search','Annual reports, 10-K, 20-F and 8-K filings for every listed company named in this report','https://www.sec.gov/edgar/search/'],
 ['Stock Analysis','Share counts, market capitalisation, margins and per-company financial history','https://stockanalysis.com/'],
 ['Reuters','Contemporaneous reporting on capex announcements, export controls and supply agreements','https://www.reuters.com/'],
 ['Financial Times','Reporting on hyperscaler capital expenditure and financing structures','https://www.ft.com/']];


/* Company names link to the listing on stockanalysis.com. Rows naming several
   companies carry one link per listing; private companies carry none. */
function coName(name){
  const t=(typeof TICK!=='undefined')&&TICK[name];
  const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const lnk=(label,path)=>`<a class="tick" href="${SA}${path}/" target="_blank" rel="noopener noreferrer">${esc(label)}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
  if(!t) return `<span class="co-name">${esc(name)}</span>`;
  if(!t.length) return `<span class="co-name">${esc(name)}</span><span class="co-priv">Private — not listed</span>`;
  if(t.length===1){
    const open=typeof TVSYM!=='undefined'&&TVSYM[name];
    return (open
      ? `<button type="button" class="co-name co-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${esc(name)}</button>`
      : `<span class="co-name">${esc(name)}</span>`)+
      `<span class="co-tick">${lnk(t[0][0],t[0][1])}</span>`;
  }
  return `<span class="co-name">${esc(name)}</span><span class="co-tick">${t.map(x=>lnk(x[0],x[1])).join('')}</span>`;
}

/* Sources view — where each layer's numbers actually come from. */
function sourcePane(n){
  const d=(typeof SOURCES!=='undefined')&&SOURCES[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const host=u=>u.replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  const row=([name,use,url])=>`<li class="src">
      <a class="src-name" href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)}
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <span class="src-use">${esc(use)}</span>
      <span class="src-host">${esc(host(url))}</span>
    </li>`;
  return `<p class="chain-lead">${d.lead}</p>
    <h4 class="mini-h">Primary sources for this layer</h4>
    <ol class="src-list">${d.items.map(row).join('')}</ol>
    <h4 class="mini-h">Used throughout the report</h4>
    <ol class="src-list">${SRC_SHARED.map(row).join('')}</ol>
    <p class="tnote"><b>How to read these links.</b> Each resolves to the publisher, dataset or filings search rather than to a single document, because several of the underlying items sit behind subscriptions, are updated in place, or are not stably addressable. Where a figure in this layer is a derivation rather than a published statistic, the text says so at the point the number appears. Figures were compiled to September 2026 and several — lead times, interconnection queues, equipment share and model rankings above all — change on a quarterly or faster cadence.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   V7 — listings for the value-chain entities, and project source registers
   ══════════════════════════════════════════════════════════════════════════ */


/* ── Value chain, V7: linked entities plus structural diagrams ───────────── */
const _esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const _arrow='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';


/* A logo is a button when we hold an exchange-qualified ticker for it, and a
   plain image otherwise, so unlisted entities never look interactive.

   A company with no entry here shows a blank plate rather than a stand-in.
   That is deliberate: an invented mark is worse than no mark, because it
   reads as the company's own. */
const logoMark=(name,cls)=>{
  const f=LOGO[name]; if(!f) return '';
  const img=`<img class="${cls||'co-logo'}" src="assets/logos/${f}.png" alt="" loading="lazy" decoding="async">`;
  if(typeof TVSYM==='undefined'||!TVSYM[name]) return img;
  return `<button type="button" class="co-logo-btn" data-co="${_escAttr(name)}" `+
         `title="${_escAttr(name)} — market information" aria-label="${_escAttr(name)} — market information">${img}</button>`;
};
const _escAttr=x=>String(x).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

function chainChip(name){
  const c=(typeof CT!=='undefined')&&CT[name], mark=logoMark(name);
  /* No plate when there is no mark. An empty square reads as a picture that
     failed to load; the name alone reads as what it is. */
  const plate=mark||'';
  const body=`${plate}<span class="cn-text"><span class="cn-name">${_esc(name)}</span>`+
    (c&&c[0]?`<span class="chip-tick">${_esc(c[0])}</span>`:'<span class="chip-tick is-priv">private</span>')+`</span>`;
  if(typeof TVSYM!=='undefined'&&TVSYM[name])
    return `<button type="button" class="chain-node is-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${body}</button>`;
  return `<span class="chain-node">${body}</span>`;
}

/* One entity, as a row in the vertical chain: mark, what it supplies here, and
   what is known about its position. Share comes from COMETA where a figure is
   stated for this layer, and is n/d otherwise — never inferred. */
/* COMETA is keyed layer|company because the same firm appears in several layer
   tables. A share is a property of the company, not of the layer it is being
   read in, so fall back to whichever layer states one. */
/* The chain names an entity the way the chain reads; the share table names the
   listed parent. Verified by hand — fuzzy matching alone paired Carpenter
   Technology with Marvell Technology, and Siemens with Siemens Energy, which
   are different companies. */
/* Country marks as emoji flags: no image requests, and they follow the
   viewer's font in either theme. A dual-domicile string shows both. */
const FLAG={"Australia": "🇦🇺", "Austria": "🇦🇹", "Belgium": "🇧🇪", "Finland": "🇫🇮", "Canada": "🇨🇦", "China": "🇨🇳", "France": "🇫🇷", "Germany": "🇩🇪", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Japan": "🇯🇵", "Kazakhstan": "🇰🇿", "Netherlands": "🇳🇱", "Norway": "🇳🇴", "South Korea": "🇰🇷", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Taiwan": "🇹🇼", "Thailand": "🇹🇭", "United Kingdom": "🇬🇧", "United States": "🇺🇸"};
const flagFor=geo=>!geo?'':geo.split(' / ').map(p=>FLAG[p.trim()]||'').join('\u2009');


const mcapText=n=>{if(n==null)return'';
  return n>=1000?'$'+(n/1000).toFixed(n>=10000?1:2)+'T':'$'+(n>=100?Math.round(n):n.toFixed(1))+'bn';};

/* Design model, for the accelerator-design stage: who sells the silicon they
   design and who only consumes it. Shown in that stage's note column. */
const DESIGN_MODEL={"NVIDIA": "Fabless chip firm — designs and sells merchant silicon", "AMD": "Fabless chip firm — designs and sells merchant silicon", "Broadcom": "Fabless chip firm — designs custom silicon for others", "Marvell": "Fabless chip firm — designs custom silicon for others", "Google TPU": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "AWS Trainium": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Microsoft Maia": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Meta MTIA": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Tesla AI5": "Fabless non-chip firm — designs for its own use, does not sell the silicon"};

const CALIAS={"ASE": "ASE Technology", "Anthropic": "Anthropic (private)", "Arista": "Arista Networks", "Boston Dynamics": "Hyundai (Boston Dynamics)", "Cadence": "Cadence Design Systems", "Constellation": "Constellation Energy", "DeepSeek": "DeepSeek and Alibaba Qwen", "Alibaba Qwen": "DeepSeek and Alibaba Qwen", "Howmet": "Howmet Aerospace", "Lynas": "Lynas Rare Earths", "Lynas Malaysia": "Lynas Rare Earths", "Marvell": "Marvell Technology", "Meta": "Meta Platforms", "Micron": "Micron Technology", "Microsoft Entra": "Microsoft", "NVIDIA Jetson": "NVIDIA", "NVIDIA NVLink": "NVIDIA", "OpenAI": "OpenAI (private)", "Schneider": "Schneider Electric", "Sibelco": "Sibelco and The Quartz Corp (private)", "The Quartz Corp": "Sibelco and The Quartz Corp (private)", "THK": "THK and Hiwin", "Hiwin": "THK and Hiwin", "TSMC CoWoS": "TSMC", "Google TPU": "Alphabet", "Google": "Alphabet", "Google Cloud": "Alphabet", "Google DeepMind": "Alphabet", "Gemini": "Alphabet", "Waymo": "Alphabet", "AWS": "Amazon", "AWS Trainium": "Amazon", "Azure": "Microsoft", "Copilot": "Microsoft", "ChatGPT": "OpenAI (private)", "Claude": "Anthropic (private)", "Microsoft Maia": "Microsoft", "Meta MTIA": "Meta", "Tesla AI5": "Tesla"};

/* CALIAS maps a chain name to the name the share table uses. The companies
   table starts from the other end, so it needs the reverse to find a logo. */
const RALIAS=(()=>{const o={};Object.keys(CALIAS).forEach(k=>{const v=CALIAS[k];if(!o[v])o[v]=k;});return o;})();
const logoFor=(name,cls)=>logoMark(name,cls)||logoMark(CALIAS[name]||'',cls)||logoMark(RALIAS[name]||'',cls)||'';

const COMETA_ANY=(()=>{const o={};
  if(typeof COMETA==='undefined') return o;
  Object.keys(COMETA).forEach(k=>{const n=k.slice(k.indexOf('|')+1); if(!o[n]) o[n]=COMETA[k];});
  return o;})();

/* Market capitalisation in US dollars, billions. Two sources, in order of
   freshness: fundamentals.json, written daily by the scheduled job and stamped
   per company; then MCAP, maintained by hand at a single date. capAsOf says
   which one a figure came from, so the page can date it honestly. */
/* Whether a market cap refreshes on its own, and the sentence that says so.
   A figure the reader can see is stale is worth more than one that looks
   current and is not. */
function capLive(name, alias){
  const f=(typeof FUNDA!=='undefined'&&FUNDA)&&(FUNDA[name]||(alias&&FUNDA[alias]));
  return !!(f&&f.marketCap>0);
}
function capSource(name, alias){
  const when=capAsOf(name,alias);
  return capLive(name,alias)
    ? 'Refreshed by the scheduled job'+(when?' — last '+when:'')
    : 'Fixed figure, not refreshed'+(when?' — taken '+when:'');
}

/* The rows are built before the fundamentals JSON lands, so every market cap
   starts as the fixed figure. When the data arrives, replace the ones it
   covers and relabel them. Without this the page would call a live figure
   fixed, which is the wrong way round to be wrong. */
function refreshCaps(){
  document.querySelectorAll('[data-cap]').forEach(cell=>{
    const name=cell.dataset.cap, alias=cell.dataset.capAlias||null;
    if(!capLive(name,alias)) return;
    const v=capFor(name,alias);
    if(v==null) return;
    cell.innerHTML=`<b>${mcapText(v)}</b><span class="vr-lbl" title="${_escAttr(capSource(name,alias))}">market cap · live</span>`;
  });
}

function capFor(name, alias){
  const f=(typeof FUNDA!=='undefined'&&FUNDA)&&(FUNDA[name]||(alias&&FUNDA[alias]));
  if(f&&f.marketCap>0) return f.marketCap/1e9;
  if(typeof MCAP==='undefined') return null;
  return MCAP[name]!=null?MCAP[name]:(alias!=null?MCAP[alias]:null);
}
function capAsOf(name, alias){
  const f=(typeof FUNDA!=='undefined'&&FUNDA)&&(FUNDA[name]||(alias&&FUNDA[alias]));
  if(f&&f.marketCap>0) return f.quoteAt||(FUNDA_META&&FUNDA_META.generated)||null;
  return (typeof MCAP_ASOF!=='undefined')?MCAP_ASOF:null;
}

function chainRow(name,layer){
  const c=(typeof CT!=='undefined')&&CT[name];
  const alias=CALIAS[name];
  const m=((typeof COMETA!=='undefined')&&COMETA[layer+'|'+name])||COMETA_ANY[name]
        ||(alias&&COMETA_ANY[alias]);
  const geo=(m&&m[0])||(c&&c[2])||'';
  let note=DESIGN_MODEL[name]||(m&&m[1])||'';
  if(note==='n/d') note='';
  /* Prefer the figure the scheduled job fetched, which refreshes daily and
     carries its own timestamp, over the hand-maintained table, which carries
     one date for all of it. Falling back keeps the international listings the
     data plan cannot reach. */
  const cap=capFor(name,alias);
  const mark=logoFor(name,'vr-logo')||'<span class="vr-logo is-blank" aria-hidden="true"></span>';
  const desc=CDESC[name]||'';
  const head=c&&c[1]
    ? `<button type="button" class="vr-name is-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${_esc(name)}</button>`
    : `<span class="vr-name">${_esc(name)}</span>`;
  const tick=c&&c[0]?`<span class="vr-tick">${_esc(c[0])}</span>`:'<span class="vr-tick is-priv">not listed</span>';
  return `<li class="vrow">
    ${mark}
    <div class="vr-main"><div class="vr-top">${head}${tick}</div>${desc?`<p class="vr-desc">${_esc(desc)}</p>`:''}</div>
    <div class="vr-cap" data-cap="${_escAttr(name)}" data-cap-alias="${_escAttr(alias||'')}">${cap!=null
      ?`<b>${mcapText(cap)}</b><span class="vr-lbl" title="${_escAttr(capSource(name,alias))}">${capLive(name,alias)?'market cap · live':'market cap · fixed'}</span>`
      :'<span class="vr-none">not listed</span>'}</div>
    <div class="vr-note">${note?`<span>${_esc(note)}</span>`:'<span class="vr-none">no share stated</span>'}</div>
    <div class="vr-geo">${geo?`<span class="vr-flag" aria-hidden="true">${flagFor(geo)}</span><span>${_esc(geo)}</span>`:''}</div>
  </li>`;
}

/* Two derived diagrams: how deep each stage is, and where the chain sits. */
function chainDiagrams(d,col){
  /* Where the chain is domiciled. A headcount of the named entities by country
     of listing or headquarters — read for where the chain touches ground, not
     for how much value sits in each place. */
  const tally={};
  chainAllStages(d).forEach(st=>st.n.forEach(n=>{
    const c=(typeof CT!=='undefined')&&CT[n]; const k=c&&c[2];
    if(k) tally[k]=(tally[k]||0)+1; }));
  const geo=Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  if(!geo.length) return '';
  const total=geo.reduce((s,g)=>s+g[1],0);

  /* One hue per slice, walked around the layer palette so neighbours differ. */
  const HUES=[1,4,6,2,5,7,3,8];
  const colour=i=>`var(--l${HUES[i%HUES.length]})`;

  const R=78, r=46, C=100;          /* viewBox is 200 square */
  let angle=-Math.PI/2, arcs='';
  geo.forEach(([name,v],i)=>{
    const sweep=v/total*Math.PI*2, end=angle+sweep, big=sweep>Math.PI?1:0;
    const pt=(rad,a)=>[(C+rad*Math.cos(a)).toFixed(2),(C+rad*Math.sin(a)).toFixed(2)];
    const [x1,y1]=pt(R,angle),[x2,y2]=pt(R,end),[x3,y3]=pt(r,end),[x4,y4]=pt(r,angle);
    /* a full-circle slice cannot be drawn as one arc; split it in two */
    if(geo.length===1){
      arcs=`<circle cx="${C}" cy="${C}" r="${(R+r)/2}" fill="none" `+
           `stroke="${colour(0)}" stroke-width="${R-r}"/>`;
    } else {
      arcs+=`<path class="dn-seg" d="M${x1} ${y1} A${R} ${R} 0 ${big} 1 ${x2} ${y2} `+
            `L${x3} ${y3} A${r} ${r} 0 ${big} 0 ${x4} ${y4} Z" fill="${colour(i)}">`+
            `<title>${_esc(name)}: ${v} of ${total}</title></path>`;
    }
    angle=end;
  });

  const legend=geo.map(([name,v],i)=>{
    const pct=(v/total*100);
    return `<li>
      <span class="dn-key" style="background:${colour(i)}"></span>
      <span class="dn-flag" aria-hidden="true">${flagFor(name)}</span>
      <span class="dn-name">${_esc(name)}</span>
      <span class="dn-val">${v}</span>
      <span class="dn-pct">${pct<1?'<1':pct.toFixed(0)}%</span>
    </li>`;}).join('');

  return `<section class="chain-geo">
    <h4 class="mini-h">Where the chain is domiciled</h4>
    <p class="sub">Named entities by country of listing or headquarters &mdash; ${total} of them placed.</p>
    <div class="dn-wrap">
      <div class="dn-chart">
        <svg viewBox="0 0 200 200" role="img" aria-label="Share of named entities in this chain by country of domicile">
          ${arcs}
          <text class="dn-total" x="100" y="96" text-anchor="middle">${total}</text>
          <text class="dn-sub" x="100" y="114" text-anchor="middle">entities</text>
        </svg>
      </div>
      <ol class="dn-legend">${legend}</ol>
    </div>
    <p class="cap">DERIVED &mdash; a headcount, not a value-weighted measure. One monopolist counts the same as one of five competitors, so read it for where the chain touches ground, not for how much value sits in each country.</p>
  </section>`;
}

/* Every layer now carries named branches rather than one queue, because most
   of them genuinely run several chains in parallel that converge. A layer
   written the old way still renders: it is treated as a single unnamed
   branch. */
/* The wider market map for a stage: every company the company database places
   here that the chain above does not already name. Kept as a separate, denser
   block rather than merged into the rows, because the named entries carry an
   argument — what the company supplies at that stage — and these carry
   coverage. Both are useful; conflating them would lose the distinction. */
function marketRow(key, named){
  const all=(typeof MARKET_MAP!=='undefined'&&MARKET_MAP[key])||[];
  const have=new Set(named||[]);
  const rest=all.filter(x=>!have.has(x));
  if(!rest.length) return '';
  return `<details class="mkt">
    <summary><span class="mkt-n">${rest.length}</span> more companies mapped to this stage</summary>
    <ul class="mkt-list">${rest.map(x=>chainChip(x)).join('')}</ul>
    <p class="mkt-note">From the company and value-chain database, mapped onto this stage by <code>brand/stage_map.py</code>. Inclusion means relevance to the stage, not market leadership, endorsement or investment suitability. A company can appear at several stages.</p>
  </details>`;
}

function chainBranches(d){
  return d.branches || [{t:null,w:null,stages:d.stages||[]}];
}
function chainAllStages(d){
  return chainBranches(d).flatMap(b=>b.stages);
}

/* The qualification a chokepoint claim has to carry before it is marked.
   Product, geography, date, horizon, character, substitutes, relief time and
   source — a stage without these does not get the amber. */
function chokeQual(cq){
  if(!cq) return '';
  const row=(k,v)=>v?`<div class="cqr"><dt>${k}</dt><dd>${_esc(v)}</dd></div>`:'';
  return `<details class="cq">
    <summary><span class="cq-tag">Chokepoint</span> What is constrained, where, and for how long</summary>
    <dl class="cq-grid">
      ${row('Affects',cq.what)}${row('Where',cq.where)}${row('As of',cq.as_of)}
      ${row('Horizon',cq.horizon)}${row('Character',cq.kind)}${row('Substitutes',cq.sub)}
      ${row('Time to relieve',cq.lead)}${row('Source',cq.src)}
    </dl>
  </details>`;
}

function chainPane(n,col){
  const d=(typeof CHAIN!=='undefined')&&CHAIN[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const branches=chainBranches(d);
  const multi=branches.length>1 && !!branches[0].t;

  const sid=(bi,si)=>`vc-${n}-${bi}-${si}`;

  const body=branches.map((b,bi)=>{
    const stages=b.stages.map((st,si)=>`
      <li id="${sid(bi,si)}" class="chain-stage" style="--stage:${col}">
        <div class="cs-head">
          <span class="cs-num">${si+1}</span>
          <div class="cs-title">
            <span class="chain-step">Stage ${si+1}</span>
            <h5>${_esc(st.t)}</h5>
          </div>
          <span class="cs-count">${st.n.length} named ${st.n.length===1?'supplier':'suppliers'}</span>
        </div>
        ${st.w?`<p class="cs-what">${_esc(st.w)}</p>`:''}
        ${st.c?chokeQual(st.cq):''}
        <ul class="vs-rows">${st.n.map(x=>chainRow(x,n)).join('')}</ul>
        ${marketRow(`L${n}.${bi}.${si}`, st.n)}
        ${st.note?`<p class="chain-note">${_esc(st.note)}</p>`:''}
      </li>`).join('');
    return `<section class="chain-branch${bi===0?' is-on':''}" data-branch="${bi}"${b.t?` aria-label="${_esc(b.t)}"`:''}>
      ${b.t?`<div class="cb-head" style="--stage:${col}">
        <h4 class="cb-title">${_esc(b.t)}</h4>
        ${b.w?`<p class="cb-sub">${_esc(b.w)}</p>`:''}
      </div>`:''}
      <div class="chain-wrap"><ol class="chain-flow">${stages}</ol></div>
    </section>`;}).join('');

  /* The index stays an overview of every chain; the companies below show one
     chain at a time, chosen here. Before this the pane rendered all of them
     stacked — twenty-five stages of companies on layer 5 — so reading one
     chain meant scrolling past the others. */
  const index=branches.map((b,bi)=>`
    <div class="vj-group${bi===0?' is-on':''}" data-branch="${bi}">
      ${b.t?`<button type="button" class="vj-gh" data-open="${bi}" aria-expanded="${bi===0}">
        <span class="vj-gn">${bi+1}</span><span class="vj-gt">${_esc(b.t)}</span>
        <span class="vj-gc">${b.stages.length} stages</span>
        <span class="vj-gx" aria-hidden="true"></span>
      </button>`:''}
      <ol class="vj-jump">${b.stages.map((st,si)=>
        `<li><button type="button" class="vj${st.c?' is-choke':''}" data-jump="${sid(bi,si)}" data-branch="${bi}"`+
        `${st.c?' title="Chokepoint stage — qualified in the stage itself"':''}>`+
        `<span class="vj-n">${si+1}</span><b>${_esc(st.t)}</b>`+
        `</button></li>`).join('')}</ol>
    </div>`).join('');

  const p=(typeof PROC!=='undefined')&&PROC[n];
  const proc = p ? `
    <section class="vc-proc">
      <h4 class="blockhead">${_esc(p.t)}</h4>
      <p class="blocksub">${_esc(p.lead)}</p>
      <ol class="proc-flow">${p.steps.map((x,i)=>`
        <li class="proc-step">
          <span class="ps-num">${i+1}</span>
          <div class="ps-body">
            <h6>${_esc(x[0])}</h6>
            <div class="ps-who">${logoMark(x[1])||''}<span>${_esc(x[1])}</span></div>
            <p>${_esc(x[2])}</p>
          </div>
        </li>`).join('')}</ol>
      <p class="chain-note proc-note">${_esc(p.note)}</p>
      <p class="tnote">${_esc(p.src)}</p>
    </section>` : '';

  return `<p class="chain-lead">${d.lead}</p>
    <section class="vc-index" id="vc-index-${n}" role="navigation" aria-label="Stages in this layer">
      <p class="vc-index-h">How the layer breaks down</p>
      <p class="vc-index-s">${multi
        ? 'This layer runs '+branches.length+' chains in parallel. Within a chain, each stage depends principally on the one before it; between chains, nothing does. Select a chain to open its companies below, or any stage to go straight to it. Amber marks a chokepoint, qualified where it is marked.'
        : 'Upstream to downstream. Each stage depends principally on the one before it &mdash; select any of them to go straight to it. Amber marks a chokepoint, qualified where it is marked.'}</p>
      ${index}
    </section>
    <div class="chain-key">
      <span><i class="k-choke"></i>Chokepoint &mdash; open the stage for what is constrained, where, and for how long</span>
      <span><i class="k-flow"></i>Principal dependency within a chain; chains run in parallel</span>
      <span><i class="k-link"></i>Listed &mdash; opens on Stock Analysis</span>
    </div>
    ${body}
    <p class="vc-top-wrap"><button type="button" class="vc-top">Back to the stage index &uarr;</button></p>
    ${proc}
    ${chainDiagrams(d,col)}
    <p class="tnote">Companies are named for structural completeness of the chain, not as recommendations, and several are private, Chinese-listed or embedded inside much larger groups. Position within a stage does not imply ranking. A company can appear in more than one stage, more than one chain or more than one layer &mdash; layers 4, 7 and 8 deliberately appear in both the data centre and the machine at the edge. Product and platform names resolve to the parent listing, so Google TPU opens Alphabet and NVIDIA Jetson opens NVIDIA. Entities without a ticker are private, state-held, generic categories, or not separately listed.</p>`;
}


function tabIntro(mode,col,layerTitle){
  const t=TABINTRO[mode]; if(!t||!t[1]) return '';
  return `<div class="tab-intro" style="--tint:${col}">
    <h4>${_esc(t[0])}</h4><p>${_esc(t[1])}</p></div>`;
}

/* How a layer is measured: the ratio that matters, the formula behind it, the
   KPIs that diagnose it, and a worked number. The framework is the same for
   all ten — accepted useful output over what it cost — so it is stated once,
   collapsed, and the layer-specific part is open by default. */
function metricsBlock(n, col){
  const m=(typeof LAYER_METRICS!=='undefined')&&LAYER_METRICS[n];
  if(!m) return '';
  const F=(typeof METRIC_FRAME!=='undefined')&&METRIC_FRAME;

  const frame = F ? `<details class="mfr">
    <summary>The measurement framework these all share</summary>
    <div class="mfr-body">
      <p class="sub">${_esc(F.lead)}</p>
      <div class="fml"><span class="fml-t">${_esc(F.accepted.t)}</span><code>${F.accepted.f}</code></div>
      <p class="mfr-w">${F.accepted.w}</p>
      <div class="tw"><table class="dat"><thead><tr><th>Question it answers</th><th>Ratio</th><th>What it tells you</th><th>Direction</th></tr></thead><tbody>
        ${F.ratios.map(r=>`<tr><td>${_esc(r[2])}</td><td><code>${r[1]}</code></td><td>${_esc(r[0])}</td><td>${r[3]==='higher'?'higher is better':'lower is better'}</td></tr>`).join('')}
      </tbody></table></div>
      ${[F.chain,F.bottleneck].map(x=>`<div class="fml"><span class="fml-t">${_esc(x.t)}</span><code>${x.f}</code></div><p class="mfr-w">${_esc(x.w)}</p>`).join('')}
      <p class="mfr-h">No ratio is publishable without all six</p>
      <ul class="mfr-guards">${F.guards.map(g=>`<li>${_esc(g)}</li>`).join('')}</ul>
      <p class="mfr-warn">${_esc(F.warn)}</p>
    </div>
  </details>` : '';

  return `<section class="mtr">
    <h4 class="mini-h">How this layer is measured</h4>
    <p class="sub">The ratio that decides whether the layer is getting better, what it is made of, and a worked number. Every figure below needs its functional unit, boundary, quality threshold, workload, geography and period stated with it — a ratio without those is not a measurement.</p>
    <div class="mtr-primary" style="--stage:${col}">
      <p class="mtr-eyebrow">Primary metric</p>
      <h5>${_esc(m.primary.n)}</h5>
      <div class="fml is-lead"><code>${m.primary.f}</code><span class="fml-u">${_esc(m.primary.u)}</span></div>
      <p class="mtr-w">${m.primary.w}</p>
    </div>
    <h5 class="mtr-h">What diagnoses it</h5>
    <div class="tw"><table class="dat"><thead><tr><th>Indicator</th><th>How it is computed</th><th>What it tells you</th></tr></thead><tbody>
      ${m.kpis.map(k=>`<tr><td><b>${_esc(k[0])}</b></td><td><code>${k[1]}</code></td><td>${_esc(k[2])}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="mtr-worked" style="--stage:${col}">
      <p class="mtr-eyebrow">Worked through</p>
      <ul>${m.worked.s.map(x=>`<li>${_esc(x)}</li>`).join('')}</ul>
      <p class="mtr-r">${m.worked.r}</p>
    </div>
    ${frame}
  </section>`;
}

function howPane(L,col){
  const d=HOWTO[L.n];
  if(!d) return '<p class="sub">Description unavailable.</p>';
  return `<div class="tab-intro" style="--tint:${col}">
      <h4>What this layer is</h4><p>${d.what}</p></div>
    <div class="how-stats">${d.econ.map(x=>`<div><b class="num">${_esc(x[0])}</b><span>${_esc(x[1])}</span></div>`).join('')}</div>
    <h4 class="mini-h">The engineering that governs the layer</h4>
    <p class="sub">Each of these is a physical constraint, not a market condition. They are why the layer has the shape it has.</p>
    <ol class="how-list">${d.physics.map((p,i)=>`<li style="--stage:${col}">
      <span class="how-n">${i+1}</span>
      <div><h5>${_esc(p[0])}</h5><p>${_esc(p[1])}</p></div></li>`).join('')}</ol>
    ${L.sub?`<h4 class="mini-h">How the layer breaks down</h4>
    <p class="sub">A structural view of the layer itself. The value chain tab shows the same layer as a supply flow, which is a different cut.</p>
    <div class="tw"><table class="dat">${tbl(L.sub)}</table></div>`:''}
    <div class="how-money" style="border-left-color:${col}">
      <h5>What that means for the money</h5><p>${_esc(d.money)}</p></div>
    ${metricsBlock(L.n,col)}
    ${d.src?`<p class="tnote">${_esc(d.src)}</p>`:''}
    <p class="tnote">Physical relationships stated here are standard engineering and are given without citation. Every figure repeated in this tab is sourced where it first appears elsewhere in the report; see Method for the register.</p>`;
}

/* ── Project sources ─────────────────────────────────────────────────────── */
function projectSourcePane(key){
  const d=(typeof PSOURCES!=='undefined')&&PSOURCES[key];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const host=u=>u.replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  const row=([name,use,url])=>`<li class="src">
      <a class="src-name" href="${url}" target="_blank" rel="noopener noreferrer">${_esc(name)}${_arrow}</a>
      <span class="src-use">${_esc(use)}</span>
      <span class="src-host">${_esc(host(url))}</span></li>`;
  return `<p class="chain-lead">${d.lead}</p>`+
    d.groups.map(([t,items])=>`<h4 class="mini-h">${_esc(t)}</h4><ol class="src-list">${items.map(row).join('')}</ol>`).join('')+
    `<div class="verdict" style="margin-top:22px"><h3>What to distrust first</h3><p>${_esc(d.caveat)}</p></div>`+
    `<p class="tnote"><b>How to read these links.</b> Each resolves to the publisher, dataset or filings search rather than to a single document, because several of the underlying items sit behind subscriptions, are updated in place, or are not stably addressable. Figures were compiled to September 2026. Nothing in this project is a forecast; each figure is an input to a model whose assumptions are stated where the number appears.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   V9 — the physical world: context rather than an allocation
   ══════════════════════════════════════════════════════════════════════════ */
function worldPane(){
  const row=r=>`<tr>${r.map((c,i)=>`<td class="${i?'sm':'co-n'}">${c}</td>`).join('')}</tr>`;
  const table=(h,rows,min=720)=>`<div class="tw"><table class="dat" style="min-width:${min}px">`+
    `<thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row).join('')}</tbody></table></div>`;
  return `
  <div class="overview-lede">
    <div>
      <p class="lede">Everything in the ten layers above is, in the end, rearranged pieces of this. Nothing in the stack is created — it is extracted, concentrated, purified and shaped, using energy that was itself captured from somewhere physical.</p>
      <p>The physical world is not a layer because you cannot invest in it and it has no supplier. It belongs in this report for two reasons. It is the source of the two base layers, energy and materials, and the transformation steps between a natural resource and a usable input are where almost every chokepoint in this analysis actually sits. And it is the environment embodied machines have to operate in — the one part of the stack that was not designed, does not follow a specification, and does not hold still.</p>
    </div>
    <aside class="constraint"><b>The framing that matters.</b> Nature supplies abundance in raw form and scarcity in useful form. There is no shortage of quartz on earth, no shortage of iron, no shortage of sunlight. What is scarce is quartz pure enough for a crucible, steel annealed into a transformer core, and electricity that is firm at three in the morning. <b>Every constraint in this report is a transformation constraint, not a resource constraint.</b></aside>
  </div>

  <h4 class="mini-h">Energy — from a natural flow or stock to a usable electron</h4>
  <p class="sub">Each row is a conversion. The value, the capital and the bottlenecks sit in the middle column, not the first.</p>
  ${table(['Natural resource','What has to be built to use it','What comes out','Where the difficulty is'],[
    ['Uranium ore','Mining, milling, conversion to hexafluoride, enrichment, fuel fabrication, a reactor, a turbine hall','Firm baseload electricity, 90%+ capacity factor','Enrichment capacity and, for advanced reactors, high-assay low-enriched fuel — not ore. Construction schedules run seven years and longer'],
    ['Natural gas','Extraction, pipelines, a combined-cycle plant with single-crystal turbine blades','Firm, dispatchable electricity in hours','Turbine hot-section castings from a handful of specialised foundries. Slots are sold to 2031'],
    ['Sunlight','Silicon purification, cell and module manufacture, inverters, land, storage','Cheap electricity, but only when the sun is up','Firmness. Round-the-clock supply needs roughly fourfold overbuild plus overnight storage'],
    ['Wind','Rare earth magnets or electrically excited generators, towers, blades, grid connection','Variable electricity','Magnets, grid connection queues, and the same firmness problem'],
    ['Falling water','Dams, penstocks, turbines, decades of permitting','Firm and storable electricity','Geography. The good sites are largely taken'],
    ['Any of the above','Transformers, switchgear, transmission lines, substations, cooling','Electricity where and when it is needed','Grain-oriented electrical steel, copper and 128-week transformer lead times'],
  ])}
  <p class="cap">The last row is the one most analysis skips. Generation is only half the problem; moving and conditioning the electricity is the half that is currently gating the build-out.</p>

  <h4 class="mini-h">Materials — from rock to a qualified input</h4>
  <p class="sub">The same shape appears again. Ore is common; the refined, purified, qualified form is not.</p>
  ${table(['Natural resource','Transformation chain','What it becomes','Where the difficulty is'],[
    ['Copper ore, 0.4–1% metal','Crushing, flotation, smelting, electrolytic refining','Cathode at 99.99%, then wire, busbar, tube','Smelting, not mining. China holds roughly 8% of concentrate and 48% of smelting'],
    ['Silica sand and high-purity quartz','Carbothermic reduction, the Siemens process, crucible forming, crystal growth','Electronic-grade polysilicon at eleven nines, then wafers','Purity, and a crucible material that comes almost entirely from one North Carolina district'],
    ['Bastnäsite and monazite ore','Cracking, leaching, hundreds of solvent-extraction stages, metal reduction, sintering','Neodymium-iron-boron magnets that survive heat','Separation. Chemically near-identical elements, and the process technology itself is export-controlled'],
    ['Iron ore','Steelmaking, hot and cold rolling, decarburisation anneal, days-long box anneal','Grain-oriented electrical steel for transformer cores','A metallurgical recipe accumulated over decades. One domestic US producer'],
    ['Nickel, cobalt, rhenium','Vacuum induction melting, single-crystal investment casting, coating','Turbine blades that survive above 1,000°C for years','Yield. Growing one continuous metal crystal with internal cooling channels'],
    ['Lithium brine or spodumene','Concentration, conversion, cathode manufacture, cell assembly','Storage for the grid and for the fleet','Refining and cathode production, both heavily concentrated in China'],
  ])}

  <h4 class="mini-h">Moving and sensing in it — the part that was not designed</h4>
  <p>A data centre is a controlled environment built to a specification. A warehouse aisle, a construction site, a kitchen and a public road are not. This is the gap between a model that performs well on a benchmark and a machine that is useful on a Tuesday afternoon, and it is a physics and engineering problem rather than a scaling one.</p>
  ${table(['The challenge','Why the physical world makes it hard','What has to improve'],[
    ['Perception under real conditions','Rain, glare, dust, night, reflective surfaces and partial occlusion break sensors that work in a lab. Every deployment discovers new failure modes rather than exhausting a fixed list','Sensor fusion, and enough real operating hours to encounter the long tail at all'],
    ['Touch','Manipulation depends on feeling grip slip, compliance and contact force. Tactile sensing is the least mature modality in robotics and has no dominant supplier','A tactile sensing stack that is durable, cheap and manufacturable at fleet volume'],
    ['Acting inside a latency budget','A picking robot needs sub-200-millisecond action cycles. A cloud round trip is 50–150 ms and a dropped connection mid-task is a safety event, so inference has to run on board','Models small enough to run in roughly 130 watts that are still good enough to be useful'],
    ['Carrying its own energy','A humanoid carries about 2.3 kWh — a high-end electric bicycle — against 82 kWh in a car. Adding capacity adds mass, which adds torque demand, which eats the runtime the capacity was meant to buy','Architecture rather than chemistry: hot-swappable packs, autonomous docking, charging infrastructure as a deployed asset'],
    ['Wear','Reducers, bearings and actuators are consumables. Ten million machines with 45 actuators each implies a maintenance economy and a trade that do not yet exist','A trained technician base, spare-part logistics and honest duty-life data'],
    ['Being safe around people','An agent with credentials that can only write to a database is a data breach risk. An agent with credentials that can lift 25 kg is a physical safety risk','Standards, machine identity, per-action authorisation, and insurance markets that will price it'],
  ])}

  <h4 class="mini-h">The feedback that closes the loop</h4>
  <p>Text describes the world; it does not verify claims about it. A model trained only on text learns what people have written about physics, not what physics does. Sensors close that gap by returning an error signal from reality itself: actuators change the world, sensors observe the changed world, and the discrepancy between prediction and observation is the training signal. <b>Each turn generates data that could not have existed before that turn</b> — which is the structural difference between a flywheel and a pipeline, and the reason a decade of fleet driving data cannot be bought, scraped or licensed by a competitor.</p>
  <div class="wrongnote" style="margin:16px 0 0"><b>The honest caveat, repeated here because it matters.</b> Research teams reported in 2026 that robot policies trained on 40% synthetic data matched policies trained wholly on real demonstrations. If synthetic generation substitutes that well, real-world collection is a threshold asset rather than a scaling one — enough to seed a simulator, and sharply diminishing after that. That would make the data-collection arms race over-funded and shift the advantage to whoever simulates best. I cannot resolve this from outside, and every embodiment position should be sized as though it might go either way.</div>

  <div class="layer-verdict"><b>How to use this section.</b> Not as an allocation. Use it as a check on the two claims the rest of the report depends on: that a natural resource can actually be transformed into a usable input on the schedule the build-out assumes, and that machines can eventually operate in unstructured surroundings well enough to be worth their cost. If the first fails, layers 1 and 2 reprice upward and everything above them slips. If the second fails, layer 10 stays a pilot programme and the loop never closes.</div>

  <p class="tnote">This section is context rather than analysis: it carries no company list, no valuation and no rating, and it deliberately has no sub-views. The material chains summarised here are treated in full in layer 2, the energy conversions in layer 1, and the sensing and manipulation constraints in layer 10.</p>`;
}


/* A standalone mark. `wafer` is why each copy needs its own clip id. */
let __icn=0;
/* `n` picks the drawing, `tone` the colour. They differ for exactly one mark:
   the on-site plant is key '1p' — layer 1 indoors, drawn as a bolt — and there
   is no --l1p to colour it with. */
function layerIcon(n,cls,tone){
  const id='wc'+(++__icn);
  const body=LAYER_ICONS[n].replace('url(#waferClip)','url(#'+id+')');
  return `<svg class="licon ${cls||''}" viewBox="0 0 44 44" aria-hidden="true" style="stroke:var(--l${tone==null?n:tone})">`+
    `<defs><clipPath id="${id}"><circle cx="22" cy="22" r="13.6"/></clipPath></defs>${body}</svg>`;
}


/* If these disagree, one of the two was edited alone. */
LAYERS.forEach(L=>{ const want=layerName(L.n);
  if(want && want!==L.t) console.warn('taxonomy mismatch: layer '+L.n+' is "'+L.t+
    '" here and "'+want+'" in assets/taxonomy.js'); });
if(LAYERS.length!==LAYER_COUNT) console.warn('taxonomy: '+LAYERS.length+
  ' layers defined here, '+LAYER_COUNT+' in assets/taxonomy.js');


function bars(cfg){
  const vals=cfg.b.map(x=>x[1]);
  const mx=Math.max(...vals), mn=Math.min(...vals.filter(v=>v>0));
  const pct=v=>{ if(!cfg.log) return Math.max(1.5,v/mx*100);
    const lo=Math.log10(mn)-0.6, hi=Math.log10(mx);
    return Math.max(2,(Math.log10(v)-lo)/(hi-lo)*100); };
  const fmt=v=>{ if(v>=1000) return v.toLocaleString(undefined,{maximumFractionDigits:0});
    if(v<0.01) return String(v);
    return String(v%1===0? v : v.toFixed(v<10?2:1)); };
  return `<h4>${cfg.t}</h4>`+cfg.b.map(([l,v])=>
    `<div class="bar"><span class="lb2">${l}</span><span class="tr"><i class="fl" data-w="${pct(v).toFixed(1)}" style="background:${cfg.c}"></i></span><span class="vl num">${fmt(v)}</span></div>`
  ).join('')+`<p class="cnote"><b style="color:var(--ink2)">Units: ${cfg.u}.</b> ${cfg.note||''}</p>`;
}
function tbl(o){
  return `<thead><tr>${o.h.map(h=>`<th>${h}</th>`).join('')}</tr></thead>`+
    `<tbody>${o.r.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'':'sm'}">${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
}
function cotbl(rows,layer){
  const meta=r=>(typeof COMETA!=='undefined'&&COMETA[layer+'|'+r[0]])||null;
  const head=`<thead><tr><th>Company</th><th>Country</th><th>Share of its niche</th>`+
    `<th>Key metrics and fundamentals</th><th>Position</th><th>Bulls say</th><th>Bears say</th></tr></thead>`;
  return head+`<tbody>`+rows.map(r=>{ const m=meta(r)||['—','n/d'];
    const mk=logoFor(r[0],'co-tlogo')||'<span class="co-tlogo is-blank" aria-hidden="true"></span>';
    return `<tr><td class="co-n"><div class="co-cell">${mk}<div>${coName(r[0])}</div></div></td>`+
      `<td class="sm co-geo"><span class="vr-flag" aria-hidden="true">${flagFor(m[0])}</span>${m[0]}</td><td class="sm co-share">${m[1]}</td>`+
      `<td class="sm">${r[2]}</td><td class="sm">${r[3]}</td>`+
      `<td class="bull">${r[4]}</td><td class="bear">${r[5]}</td></tr>`;}).join('')+`</tbody>`;
}
/* A headline number carries its as-of date and source where it has one, per
   the audit: a time-sensitive figure without a date is not a fact, it is a
   memory. Tuples are [figure, label, as-of, source]; the last two are
   optional so the project pages can keep the shorter form. */
const factgrid=f=>f.map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span>`+
  (x[2]?`<em class="fact-src">${_esc(x[2])}${x[3]?' · '+_esc(x[3]):''}</em>`:'')+
  `</div>`).join('');


/* ══════════════════════════════════════════════════════════════════════════
   ELEMENT PHOTOGRAPHS
   Specimen photographs for every element the collection carries — 90 of the
   118, from the Chemical Elements virtual museum via images-of-elements.com.
   Protactinium and curium are excluded: their source states no image-specific
   Creative Commons licence, so they are not ours to redistribute.

   A photograph shows one specimen, not a canonical appearance: allotrope,
   oxide film, container and lighting all change it, and several are gas
   discharge tubes whose glow is electrically excited. Each element's own entry
   says which it is, and the panel repeats that where it matters.

   ELMAP ties a material entry in the report to the element or elements that
   actually govern it. Entries with no single governing element, and fluorine,
   which has no usable specimen photograph, render without one.
   ══════════════════════════════════════════════════════════════════════════ */
const EL_HAVE=new Set(["Ac","Ag","Al","Am","Ar","As","Au","B","Ba","Be","Bi","Bk","Br","C","Ca","Cd","Ce","Cf","Cl","Co","Cr","Cs","Cu","Dy","Er","Es","Eu","Fe","Ga","Gd","Ge","H","He","Hf","Hg","Ho","I","In","Ir","K","Kr","La","Li","Lu","Mg","Mn","Mo","N","Na","Nb","Nd","Ne","Ni","Np","O","Os","P","Pb","Pd","Pr","Pt","Pu","Rb","Re","Rh","Ru","S","Sb","Sc","Se","Si","Sm","Sn","Sr","Ta","Tb","Tc","Te","Th","Ti","Tl","Tm","U","V","W","Xe","Y","Yb","Zn","Zr"]);


/* Applicability codes, expanded for the reader rather than left as letters. */
const EL_CODES={
 C:['Core','Common across most implementations of this layer — though not necessarily in every individual product.'],
 T:['Technology-dependent','Required only for a particular architecture, chemistry or product type.'],
 P:['Process','A dopant, gas, slurry, catalyst or coating. Frequently consumed rather than retained.'],
 L:['Legacy or restricted','Present in older or regulated designs. Not an indication of what a new design should use.'],
};

/* Which layers use a given element, built once from the table itself so the
   element dialog can answer the reverse question without a second dataset. */
const EL_LAYERS=(()=>{
  const o={};
  Object.keys(LAYER_ELEMENTS).forEach(n=>{
    const d=LAYER_ELEMENTS[n]; if(!d.els) return;
    d.els.forEach(([sym])=>{ (o[sym]=o[sym]||[]).push(+n); });
  });
  Object.keys(o).forEach(k=>o[k].sort((a,b)=>a-b));
  return o;
})();


/* Layers 7 to 9 have no element cards to hang their constraint commentary on,
   so it sits with the dependencies instead — layer 6's usage-rights note in
   particular is the binding constraint on the whole layer. */
function inheritNotes(n){
  const items=(((typeof LAYER_MATERIALS!=='undefined'&&LAYER_MATERIALS[n])||{}).items)||[];
  if(!items.length) return '';
  return `<div class="ei-notes">${items.map(x=>`<span class="elc-note">
    <b>${_esc(x.n)}</b> ${_esc(x.choke)}
    <span class="elc-chips"><span class="micro-chip">${_esc(x.geo)}</span><span class="micro-chip">Relief: ${_esc(x.time)}</span></span>
  </span>`).join('')}</div>`;
}

function elementsPane(n,col){
  const d=(typeof LAYER_ELEMENTS!=='undefined')&&LAYER_ELEMENTS[n];
  if(!d) return '';

  /* Layers 7, 8 and 9 are informational. The database forbids inventing an
     element set for them, so they state what they depend on instead. */
  if(d.inherit){
    const from=d.inherit.from.map(k=>{
      const L=(typeof LAYERS!=='undefined')&&LAYERS.find(x=>x.n===k);
      return `<li class="ei-dep" style="--stage:var(--l${k})"><span class="ei-n">${k}</span>`+
             `<span>${_esc(L?L.t:'Layer '+k)}</span></li>`;}).join('');
    return `<section class="el-block">
      <h4 class="mini-h">Key elements in this layer</h4>
      <p class="el-lead">${_esc(d.inherit.lead)}</p>
      <p class="el-none"><b>No intrinsic element set.</b> ${_esc(d.inherit.note)}</p>
      <ul class="ei-deps">${from}</ul>
      ${inheritNotes(n)}
    </section>`;
  }

  const chip=(c,cnt)=>`<button type="button" class="elf" data-code="${c}" aria-pressed="false">`+
    `<b>${c}</b>${_esc(EL_CODES[c][0])}<span>${cnt}</span></button>`;
  const counts={};
  d.els.forEach(([,,c])=>counts[c]=(counts[c]||0)+1);

  const cards=d.els.map(([sym,why,code,keep])=>{
    const shot=EL_HAVE.has(sym)
      ? `<img src="assets/elements/${sym}.jpg" alt="Specimen of ${sym}" loading="lazy" decoding="async"`+
        ` onerror="this.remove()">`
      : '';
    const also=(EL_LAYERS[sym]||[]).filter(x=>x!==n);
    return `<li class="elc" data-code="${code}" style="--stage:${col}">
      <button type="button" class="elc-btn" data-el="${sym}" title="${_esc(sym)} — open for supply constraints and detail">
        <span class="elc-shot">${shot}<span class="elc-sym">${sym}</span></span>
        <span class="elc-body">
          <span class="elc-head"><b data-elname="${sym}">${sym}</b>
            <span class="elc-code" title="${_esc(EL_CODES[code][1])}">${code}</span>
            <span class="elc-keep is-${keep}">${keep==='kept'?'retained':keep==='trace'?'trace':'process'}</span>
          </span>
          <span class="elc-why">${_esc(why)}</span>
          ${also.length?`<span class="elc-also">Also in ${also.length===1?'layer':'layers'} ${also.join(', ')}</span>`:''}
        </span>
      </button>
    </li>`;}).join('');

  return `<section class="el-block">
    <h4 class="mini-h">Key elements in this layer</h4>
    <p class="el-lead">${_esc(d.lead)}</p>
    <div class="el-filter" role="group" aria-label="Filter elements by applicability">
      <span class="elf-h">Show</span>
      ${['C','T','P','L'].filter(c=>counts[c]).map(c=>chip(c,counts[c])).join('')}
      <button type="button" class="elf elf-all is-on" data-code="" aria-pressed="true">All ${d.els.length}</button>
    </div>
    <ul class="el-grid">${cards}</ul>
    <p class="tnote">Selections, not inventories. An element appears here because it does identifiable work in a named material, not because it is present as a trace. Nothing is labelled critical on its own: criticality depends on geography and date, and is argued in the value chain where a specific supply step is actually constrained. Product-specific bills of materials and process recipes remain supplier-specific.</p>
  </section>`;
}

/* Filter chips. Delegated, because panes are rebuilt whenever a layer changes. */
document.addEventListener('click',e=>{
  const b=e.target.closest('.elf'); if(!b) return;
  const box=b.closest('.el-block'); if(!box) return;
  const code=b.dataset.code;
  box.querySelectorAll('.elf').forEach(x=>{
    const on=x===b; x.classList.toggle('is-on',on); x.setAttribute('aria-pressed',String(on));
  });
  box.querySelectorAll('.elc').forEach(c=>{
    c.hidden = !!code && c.dataset.code!==code;
  });
});

let ELDATA=null;
fetch('assets/elements/elements.json').then(r=>r.ok?r.json():null).then(d=>{ELDATA=d;}).catch(()=>{});


function materialPane(m,col){
  const isL2 = m.__n===2;
  const crossStack = isL2 && typeof MATTBL!=='undefined' ? `
    <h4 class="mini-h">Where each material enters the infrastructure stack</h4>
    <p class="sub">The five gating materials, read across the whole stack rather than one layer at a time.</p>
    <div class="mats mats-inline">${(typeof MATS!=='undefined'?MATS:[]).map(x=>
      `<article class="mat"><h4>${x.t}</h4><div class="big" style="color:${x.c}">${x.big}</div>`+
      `<p>${x.d}</p><p class="src">${x.s}</p></article>`).join('')}</div>
    <div class="tw"><table class="dat">${tbl(MATTBL)}</table></div>
    <p class="tnote">Material chokepoints behave differently from manufacturing ones. A refinery can be replicated in three to eight years; ASML\u2019s accumulated engineering cannot. Material constraints shape the near-term timing of bottlenecks but should not, on their own, underwrite a decade-long thesis. The exception is China\u2019s export ban on rare earth separation <em>technology</em> \u2014 licensing the metal is a tariff, banning the know-how is a moat.</p>` : '';

  return `<div class="material-hero" style="border-left:4px solid ${col}">
    <div><h4>Material foundation</h4><p>${m.summary}</p></div>
    <div class="severity-badge"><span>Constraint severity</span><b style="color:${col}">${m.severity}</b></div>
  </div>
  <div class="material-stats">${m.stats.map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>
  <div class="supply-flow">${m.flow.map((x,j)=>`<div class="flow-node"><small>${['Origin','Refine','Transform','Enters stack'][j]}</small><b>${x}</b></div>`).join('')}</div>
  ${elementsPane(m.__n,col)}
  <div class="conc-wrap" data-conc="${m.__n}"></div>
  ${m.__n===3?`<div class="policy-rail" data-policy="${m.__n}"></div>`:''}
  <div class="material-note"><b>Investment reading.</b> ${m.note}</div>
  <p class="tnote">Element photographs: Chemical Elements &mdash; A Virtual Museum (images-of-elements.com), <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>, retouched onto a neutral ground. Each shows one specimen rather than a canonical appearance &mdash; allotrope, oxide film, container and lighting all change how an element looks.</p>`+crossStack;
}
function riskPane(r,L){
  return `<div class="risk-layout">
    <div class="risk-scorecard"><h4>Risk intensity · 1 low → 5 high</h4>${r.scores.map(x=>`<div class="risk-meter"><span>${x[0]}</span><span class="meter-track"><i style="width:${x[1]*20}%"></i></span><b>${x[1]}</b></div>`).join('')}</div>
    <div class="risk-cards">${r.items.map(x=>`<article class="risk-item"><h5>${x.t}</h5><p>${x.d}</p><small>${x.m}</small></article>`).join('')}</div>
  </div>
  <div class="monitor-grid">
    <div><p class="sub">Leading indicators</p><div class="tw"><table class="dat">${tbl({h:['Indicator','Why it matters'],r:L.watch})}</table></div></div>
    <div><p class="sub">Layer falsifier</p><div class="wrongnote" style="margin:0"><b>What would make this wrong.</b> ${L.wrong}</div></div>
  </div>
  <div class="layer-verdict"><b>Risk verdict.</b> ${r.verdict}</div>`;
}

/* One builder per view. Kept as a table so a page can carry any subset of them
   without the markup having to know which. */
const PANE={
  how:(L,col)=>howPane(L,col),
  chain:(L,col)=>tabIntro('chain',col)+chainPane(L.n,col),
  materials:(L,col,mat)=>materialPane(mat,col),
  thesis:(L,col,mat,risk,ch)=>tabIntro('thesis',col)+
    `<div class="overview-lede"><div><p class="lede">${L.lede}</p><p class="why">${L.why}</p></div>`+
    `<div class="choke-card" style="border-left-color:${col}"><b>Binding constraint.</b> ${L.choke}</div></div>`+
    `<div class="facts">${factgrid(L.facts)}</div>`+
    `<div class="layer-diagnostic single"><div class="chartbox">${bars(ch)}</div></div>`+
    `<div class="essay-list">${L.detail.map((d,j)=>`<details class="essay" ${j===0?'open':''}><summary>${d[0]}</summary><p>${d[1]}</p></details>`).join('')}</div>`,
  companies:(L,col)=>tabIntro('companies',col)+
    `<div class="tw"><table class="co">${cotbl(L.co,L.n)}</table></div>`+
    `<p class="tnote"><b>On the share column.</b> Each figure is the company\u2019s approximate share of the specific niche named beside it, not of the layer and not of any single market. Bases, definitions and measurement dates differ from row to row, so the column indicates order of magnitude and competitive position rather than a like-for-like ranking; <em>n/d</em> means no figure is stated here because none is reliable. Country is domicile of listing, which frequently differs from where the production risk actually sits. Inclusion maps exposure to the layer; it is not a buy recommendation. Read the bull and bear columns together.</p>`,
  risks:(L,col,mat,risk)=>tabIntro('risks',col)+riskPane(risk,L),
};

/* The wording for "How this breaks". Kept as data rather than inline in the
   builder so check-content.py can see it: prose written inside a function is
   invisible to the snapshot, and this text used to have a page of its own. */
const BREAKS={
 lead:'A thesis you have not attacked is not a thesis. Five specific failure modes, in rough order of how likely they are to matter — then what survives them.',
 title:'The verdict',
 body:[
  'The loop is real. Cloud revenue is accelerating at three companies simultaneously, physical bottlenecks in power and packaging are genuine, and monopoly pricing is holding at the chokepoints. This is not a narrative in search of numbers. <b>But the loop is not equally investable at every point.</b>',
  'Layers 1, 2 and 3 hold durable chokepoints. Layer 4 has the highest growth and the shortest moat half-life. Layer 5 is where the leverage sits. Layer 9 splits in two: the routes are among the most durable assets in the report and the equipment is among the least. Layer 6 turns on a legal question rather than a technical one. Layer 7 is the least investable and the most important to monitor. Layer 8 is where the thesis inverts and AI destroys incumbent value. Layer 10 flips the geopolitics against a Western portfolio, and is a diagnostic rather than a holding.',
  '<b>The deepest risk runs through every layer:</b> a portfolio holding ASML, TSMC, Nvidia, Micron, Vertiv and Constellation feels diversified across six industries. It is one bet. If hyperscaler capex disappoints, all six correlate to one.',
  'The asymmetry that defines the report: a $2bn campus can sit idle waiting on a $40m transformer. A supplier of a 2% cost item that gates 100% of the project has extraordinary pricing power, and that is not a temporary condition.',
 ],
 note:'Nothing on this page is a recommendation. Companies are named because they map exposure to a layer; several are private, Chinese-listed, or a small division inside a much larger group. Where a share figure appears, its base and measurement date differ from row to row, so it indicates competitive position rather than a like-for-like ranking. Read the bull and bear columns together.',
};

function breaksPane(){
  return `<p class="chain-lead">${_esc(BREAKS.lead)}</p>
  <div class="risk-cards">${RISKS.map(r=>`<div class="risk"><h4>${_esc(r.t)}</h4><p>${_esc(r.d)}</p></div>`).join('')}</div>
  <div class="verdict"><h3>${_esc(BREAKS.title)}</h3>${BREAKS.body.map(x=>`<p>${x}</p>`).join('')}</div>
  <p class="tnote">${_esc(BREAKS.note)}</p>`;
}

const rail=document.getElementById('rail'), panels=document.getElementById('panels');
/* The layer views are split across two pages. The infrastructure page carries
   what a layer physically is; the investor page carries what to make of it.
   Each page declares its own set on the rail, and the builder emits only
   those tabs and panes. */
const MODES=((rail&&rail.dataset.modes)||'how chain materials thesis companies risks').split(/\s+/);
const MODE_LABEL={how:'Layer description',chain:'Value chain',materials:'Layer materials',
                  thesis:'Layer thesis',companies:'Top companies',risks:'Risks + signals'};
const WORLD={t:'The physical world',n:0};
/* Slot 0 in the rail is a preamble rather than a layer. On the infrastructure
   page it is the physical world; on the investor page it is how the thesis
   breaks, which is the thing to read before any of the layer cases. Both pages
   keep the slot filled so the tab and panel indices stay aligned. */
const IS_INVESTOR = MODES.includes('thesis') && !MODES.includes('how');
if(rail&&panels){
(function addLead(){
  const i=0, col = IS_INVESTOR ? 'var(--flag)' : 'var(--accent)';
  const b=document.createElement('button');
  b.className='tab world-tab'; b.setAttribute('role','tab'); b.id='tb'+i;
  b.setAttribute('aria-controls','pn'+i); b.setAttribute('aria-selected','false');
  b.innerHTML = IS_INVESTOR
    ? `${layerIcon(0,'rail-icon')}<span class="t">How this breaks</span>`
    : `${layerIcon(0,'rail-icon')}<span class="t">The physical world</span>`;
  b.onclick=()=>sel(i);
  b.onkeydown=e=>{
    if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();sel(LAYERS.length,1)}
    if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();sel(1,1)}};
  rail.insertBefore(b,rail.firstChild);
  const p=document.createElement('div');
  p.className='panel world-panel'; p.id='pn'+i; p.setAttribute('role','tabpanel');
  p.setAttribute('aria-labelledby','tb'+i); p.hidden=true;
  p.innerHTML = IS_INVESTOR ? `<div class="card" style="border-top-color:${col}">
    <div class="layer-head">
      <div class="layer-head-main">${layerIcon(0,'head-icon')}<div><div class="layer-index">Before the layer cases</div>
      <div class="layer-headline"><h3>How this breaks</h3><span class="chip warn">Attack it first</span></div></div></div>
    </div>
    <div class="layer-body world-body"><div class="layer-pane on">${breaksPane()}</div></div>
  </div>` : `<div class="card" style="border-top-color:${col}">
    <div class="layer-head">
      <div class="layer-head-main">${layerIcon(0,'head-icon')}<div><div class="layer-index">Not a layer · the ground the stack stands on</div>
      <div class="layer-headline"><h3>The physical world</h3><span class="chip">Context, not an allocation</span></div></div></div>
    </div>
    <div class="layer-body world-body"><div class="layer-pane on">${worldPane()}</div></div>
  </div>`;
  panels.insertBefore(p,panels.firstChild);
})();

LAYERS.forEach((L,i0)=>{
  const i=i0+1;
  const col=C[L.n];
  const mat=LAYER_MATERIALS[L.n], risk=LAYER_RISKS[L.n]; mat.__n=L.n;
  const b=document.createElement('button');
  b.className='tab'; b.setAttribute('role','tab'); b.id='tb'+i;
  b.setAttribute('aria-controls','pn'+i); b.setAttribute('aria-selected', i===0?'true':'false');
  b.style.borderLeftColor=i===0?col:'transparent';
  b.innerHTML=`${layerIcon(L.n,'rail-icon')}<span class="t">${L.n}. ${L.t}</span>`;
  b.onclick=()=>sel(i);
  b.onkeydown=e=>{
    if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();sel((i+1)%LAYERS.length,1)}
    if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();sel((i-1+LAYERS.length)%LAYERS.length,1)}};
  rail.appendChild(b);
  const p=document.createElement('div');
  p.className='panel'+(i===0?' on':''); p.id='pn'+i; p.setAttribute('role','tabpanel');
  p.setAttribute('aria-labelledby','tb'+i); if(i)p.hidden=true;
  const ch=Object.assign({},L.chart,{c:col});
  p.innerHTML=`<div class="card" style="border-top-color:${col}">
    <div class="layer-head">
      <div class="layer-head-main">${layerIcon(L.n,'head-icon')}<div><div class="layer-index">Layer ${L.n} · dependency map</div><div class="layer-headline"><h3>${L.t}</h3><span class="chip ${L.mk}">${L.moat}</span></div></div></div>
      <div class="layer-score"><i style="background:${col}"></i><div><span>Material constraint</span><b>${mat.severity}</b></div></div>
    </div>
    <div class="layer-modes" role="tablist" aria-label="${L.t} views">
      ${MODES.map((m,k)=>`<button class="layer-mode" data-mode="${m}" aria-selected="${k===0}">${MODE_LABEL[m]}</button>`).join('')}
    </div>
    <div class="layer-body">
      ${MODES.map((m,k)=>`<div class="layer-pane${k===0?' on':''}" data-mode-pane="${m}">${PANE[m](L,col,mat,risk,ch)}</div>`).join('')}
    </div>
  </div>`;
  panels.appendChild(p);
  const modes=[...p.querySelectorAll('.layer-mode')];
  modes.forEach((mode,j)=>{
    mode.onclick=()=>selectLayerMode(p,mode.dataset.mode);
    mode.onkeydown=e=>{
      if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();modes[(j+1)%modes.length].click();modes[(j+1)%modes.length].focus()}
      if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();modes[(j-1+modes.length)%modes.length].click();modes[(j-1+modes.length)%modes.length].focus()}
    };
  });
});

/* The tab a reader is on carries across layers: switching from Energy to
   Compute silicon while reading Layer thesis keeps you on Layer thesis, so the
   same view can be compared layer by layer. */
}

let CURRENT_MODE=MODES[0];
function selectLayerMode(panel,mode,remember=true){
  if(remember) CURRENT_MODE=mode;
  panel.querySelectorAll('.layer-mode').forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===mode?'true':'false'));
  panel.querySelectorAll('[data-mode-pane]').forEach(v=>v.classList.toggle('on',v.dataset.modePane===mode));
  const pane=panel.querySelector('[data-mode-pane].on');
  if(pane) pane.scrollTop=0;
  fill();
}

/* Show one chain's stages and mark it in the index. */
function showChain(pane, bi){
  if(!pane) return;
  pane.querySelectorAll('.chain-branch[data-branch]').forEach(sec=>
    sec.classList.toggle('is-on', sec.dataset.branch===String(bi)));
  pane.querySelectorAll('.vj-group[data-branch]').forEach(g=>{
    const on=g.dataset.branch===String(bi);
    g.classList.toggle('is-on', on);
    const h=g.querySelector('.vj-gh'); if(h) h.setAttribute('aria-expanded', String(on));
  });
}

/* Stage jumps and back-to-index scroll their own pane rather than navigating.
   They were anchor hashes, which the layer deep-link handler could not match
   and so fell through to selecting the physical world. Delegated from the
   document so it holds however the panes are built or rebuilt. */
document.addEventListener('click',e=>{
  const top=e.target.closest('.vc-top');
  if(top){
    const pane=top.closest('[data-mode-pane]');
    if(pane) pane.scrollTop=0;   /* smoothness is CSS scroll-behavior */
    return;
  }
  /* Opening a chain: the index keeps every chain visible, the body shows the
     one selected. A stage jump opens its own chain first, or it would scroll
     to something still hidden. */
  const open=e.target.closest('.vj-gh[data-open]');
  if(open){ showChain(open.closest('[data-mode-pane]'), open.dataset.open); return; }

  const jump=e.target.closest('.vj[data-jump]');
  if(!jump) return;
  const pane=jump.closest('[data-mode-pane]'), target=document.getElementById(jump.dataset.jump);
  if(!pane||!target) return;
  if(jump.dataset.branch) showChain(pane, jump.dataset.branch);
  /* measured from rects: the pane is not the target's offsetParent */
  const delta=target.getBoundingClientRect().top-pane.getBoundingClientRect().top;
  pane.scrollTop=pane.scrollTop+delta-12;
});

function sel(i,focus){
  document.querySelectorAll('#rail .tab').forEach((t,j)=>{
    const on=j===i; t.setAttribute('aria-selected',on?'true':'false');
    const col=j>0&&LAYERS[j-1]?C[LAYERS[j-1].n]:'var(--accent)';
    t.style.borderLeftColor=on?col:'transparent';
    t.style.borderBottomColor=on?col:'transparent';});
  document.querySelectorAll('#panels .panel').forEach((p,j)=>{p.classList.toggle('on',j===i); p.hidden=j!==i});
  const shown=document.querySelectorAll('#panels .panel')[i];
  if(shown&&shown.querySelector(`.layer-mode[data-mode="${CURRENT_MODE}"]`)) selectLayerMode(shown,CURRENT_MODE,false);
  if(focus) document.getElementById('tb'+i).focus();
  fill();
}

/* #mats, #mattable and #riskgrid were mount points on a page that no longer
   exists — the shim meant nobody noticed the writes were going nowhere. MATS
   and MATTBL are still used, by the layer 2 materials pane; RISKS by the
   thesis preamble on the investor page. */

if(onPage('gw-facts')){

document.getElementById('gw-facts').innerHTML=factgrid(GW.facts);
document.getElementById('gw-capex').innerHTML=bars(GW.capex);
document.getElementById('gw-lead').innerHTML=bars(GW.lead);
document.getElementById('gw-land').innerHTML=bars(GW.land);
[['gw-fac',GW.fac],['gw-bom1',GW.bom1],['gw-bom2',GW.bom2],['gw-energy',GW.energy],['gw-be',GW.be],
 ['gw-util',GW.util],['gw-mkt',GW.mkt],['gw-verdict',GW.verdict],['gw-lab',GW.lab],['gw-cap',GW.cap],['gw-proj',GW.proj]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
document.getElementById('gw-phase').innerHTML=GW.phase.map(p=>
 `<div class="ph-t">${p[0]} mo</div><div class="ph-d"><b>${p[1]}</b>${p[2]?`<span>${p[2]}</span>`:''}</div>`).join('');

document.getElementById('hu-facts').innerHTML=factgrid(HU.facts);
document.getElementById('hu-cap').innerHTML=bars(HU.cap);
document.getElementById('hu-bom').innerHTML=bars(HU.bom);
document.getElementById('hu-data').innerHTML=bars(HU.data);
document.getElementById('hu-ramp').innerHTML=bars(HU.ramp);
[['hu-layers',HU.layers],['hu-comp',HU.comp],['hu-cost',HU.cost],['hu-batt',HU.batt],
 ['hu-edge',HU.edge],['hu-eng',HU.eng],['hu-econ',HU.econ],['hu-rank',HU.rank]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
document.getElementById('hu-co').innerHTML=cotbl(HU.co,7);
[['gw-risk',GW.risk],['gw-gate',GW.gate],['hu-deploy',HU.deploy]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
const deepHTML=a=>a.map(d=>`<div><h5>${d[0]}</h5><p>${d[1]}</p></div>`).join('');
document.getElementById('gw-deep').innerHTML=deepHTML(GW.deep);
document.getElementById('hu-deep').innerHTML=deepHTML(HU.deep);
}

// Project tabs — each long report is split into viewport-sized chapters at runtime.
const PROJECTS=['gw','hu'];
PROJECTS.forEach((k,i)=>{
  const b=document.getElementById('pt-'+k); if(!b) return;
  b.onclick=()=>selProject(i);
  b.onkeydown=e=>{
    if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();selProject((i+1)%PROJECTS.length,1)}
    if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();selProject((i-1+PROJECTS.length)%PROJECTS.length,1)}};
});
function selProject(i,focus){
  PROJECTS.forEach((k,j)=>{
    const t=document.getElementById('pt-'+k); if(t) t.setAttribute('aria-selected', i===j?'true':'false');
    const p=document.getElementById('pj-'+k);
    if(p){ p.classList.toggle('on', i===j); p.hidden=i!==j; }
  });
  const f=focus&&document.getElementById('pt-'+PROJECTS[i]); if(f) f.focus();
  fill();
}

const CHAPTER_LABELS={
  gw:['Brief','Capital','Schedule','Bill of materials','Power options','Economics','Labour + market','Risk gates','Thesis','Sources'],
  hu:['Brief','Fleet stack','Bottleneck','Cost curve','Battery + edge','Data flywheel','Capital + energy','Timeline','Deployment','Failure cases','Sources']
};
function buildProjectChapters(panel,key){
  if(!panel) return;                  // only the projects page carries these
  const nodes=[...panel.children], groups=[];
  let current={title:'Brief',nodes:[]};
  nodes.forEach(node=>{
    if(node.matches&&node.matches('h3.blockhead')){
      if(current.nodes.length) groups.push(current);
      current={title:node.textContent.trim(),nodes:[node]};
    }else current.nodes.push(node);
  });
  if(current.nodes.length) groups.push(current);
  const nav=document.createElement('div');
  nav.className='project-chapter-nav'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Project chapters');
  const wrap=document.createElement('div'); wrap.className='project-chapters';
  groups.forEach((group,i)=>{
    const short=(CHAPTER_LABELS[key]||[])[i]||group.title;
    const button=document.createElement('button');
    button.className='chapter-tab'; button.type='button'; button.textContent=short;
    button.setAttribute('aria-selected',i===0?'true':'false'); button.dataset.chapter=i;
    nav.appendChild(button);
    const chapter=document.createElement('section'); chapter.className='project-chapter'+(i===0?' on':'');
    chapter.dataset.chapterPane=i; chapter.setAttribute('aria-label',group.title);
    group.nodes.forEach(n=>chapter.appendChild(n)); wrap.appendChild(chapter);
  });
  panel.replaceChildren(nav,wrap);
  const tabs=[...nav.querySelectorAll('.chapter-tab')];
  tabs.forEach((tab,i)=>{
    tab.onclick=()=>selectProjectChapter(panel,i);
    tab.onkeydown=e=>{
      if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();const n=(i+1)%tabs.length;selectProjectChapter(panel,n);tabs[n].focus()}
      if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const n=(i-1+tabs.length)%tabs.length;selectProjectChapter(panel,n);tabs[n].focus()}
    };
  });
}
function selectProjectChapter(panel,index){
  panel.querySelectorAll('.chapter-tab').forEach((b,i)=>b.setAttribute('aria-selected',i===index?'true':'false'));
  panel.querySelectorAll('.project-chapter').forEach((c,i)=>{c.classList.toggle('on',i===index); if(i===index)c.scrollTop=0});
  fill();
}
buildProjectChapters(document.getElementById('pj-gw'),'gw');
buildProjectChapters(document.getElementById('pj-hu'),'hu');

function fill(){
  document.querySelectorAll('.fl').forEach(f=>{
    const p=f.closest('.panel');
    if(p&&p.hidden) return;
    if(f.getBoundingClientRect().top<window.innerHeight+250) f.style.width=f.dataset.w+'%';
  });
}
window.addEventListener('scroll',fill,{passive:true});
window.addEventListener('resize',fill); fill();

// Deep links into a single layer. The overview map links here as
// stack.html#layer-4, and selecting a layer writes the hash back so the tab is
// shareable and survives a reload. Layer n sits at index n-1 in LAYERS.
(function(){
  const tabs=[...document.querySelectorAll('#rail .tab')];
  if(!tabs.length) return;
  const indexFromHash=()=>{
    const m=/^#layer-(\d+)$/.exec(location.hash);
    if(!m) return -1;
    if(+m[1]===0) return 0;                       // the physical world leads the rail
    const k=LAYERS.findIndex(L=>L.n===+m[1]);
    return k<0?-1:k+1;
  };
  const apply=()=>{
    const i=indexFromHash();
    if(i<0){ sel(0); return; }   // no hash: open on the physical world, never on nothing
    sel(i);
    tabs[i].scrollIntoView({block:'nearest',inline:'nearest'});
  };
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{
    history.replaceState(null,'','#layer-'+(i===0?0:LAYERS[i-1].n));
  }));
  window.addEventListener('hashchange',()=>{ if(/^#layer-\d+$/.test(location.hash)) apply(); });
  apply();
})();

// Multi-page navigation. Each view now lives on its own page, so the nav is a
// set of plain links and the former in-page view switcher is no longer needed.
// The per-page section is rendered by the markup itself; `fill()` still runs so
// the bar fills animate in on load.
fill();


/* ══════════════════════════════════════════════════════════════════════════
   V3 — theme controller and inline SVG chart system
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  const root=document.documentElement, btn=document.getElementById('theme-toggle');
  const meta=document.querySelector('meta[name="theme-color"]');
  const paint=t=>{ root.setAttribute('data-theme',t);
    if(btn) btn.setAttribute('aria-label', t==='dark'?'Switch to light mode':'Switch to dark mode');
    const lbl=btn&&btn.querySelector('.tt-label'); if(lbl) lbl.textContent = t==='dark'?'Dark':'Light';
    if(meta) meta.setAttribute('content', t==='dark'?'#0F1319':'#F6F7F9'); };
  paint(root.getAttribute('data-theme')||'light');
  if(btn) btn.onclick=()=>{ const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    paint(next); try{localStorage.setItem('rtagi-theme',next)}catch(e){} };
})();

const CX=(function(){
  const N=(v,d=0)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const wrap=(vb,inner,label)=>`<svg viewBox="${vb}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const shell=(o,body)=>`<figure class="cw"><h4>${o.t}</h4>${o.q?`<p class="cq">${o.q}</p>`:''}${body}`+
      `${o.legend?`<div class="legend">${o.legend}</div>`:''}`+
      `${o.note?`<figcaption class="cnote">${o.note}</figcaption>`:''}</figure>`;
  const key=items=>items.map(i=>`<span><i style="background:${i.c}"></i>${i.l}</span>`).join('');

  /* ── donut ─────────────────────────────────────────────────────────── */
  function donut(o){
    const W=520,H=250,cx=125,cy=125,R=100,r=60;
    const tot=o.data.reduce((s,d)=>s+d.v,0); let a=-Math.PI/2, paths='';
    o.data.forEach(d=>{
      const sw=d.v/tot*Math.PI*2, e=a+sw, big=sw>Math.PI?1:0;
      const p=(rad,ang)=>[cx+rad*Math.cos(ang),cy+rad*Math.sin(ang)];
      const[x1,y1]=p(R,a),[x2,y2]=p(R,e),[x3,y3]=p(r,e),[x4,y4]=p(r,a);
      paths+=`<path class="seg" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r} ${r} 0 ${big} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${d.c}"><title>${esc(d.l)}: ${esc(d.vl||N(d.v))}</title></path>`;
      a=e;
    });
    let rows=o.data.map((d,i)=>{
      const y=30+i*32;
      return `<rect x="266" y="${y-10}" width="11" height="11" rx="3" fill="${d.c}"/>`+
        `<text class="cs2" x="285" y="${y}">${esc(d.l)}</text>`+
        `<text class="cv" x="520" y="${y}" text-anchor="end">${esc(d.vl||N(d.v))}</text>`+
        (String(d.vl||'').trim().endsWith('%')?'':`<text class="cs" x="520" y="${y+13}" text-anchor="end">${(d.v/tot*100).toFixed(1)}%</text>`);
    }).join('');
    const inner=paths+
      `<text class="ct" x="${cx}" y="${cy-2}" text-anchor="middle" style="font-size:24px">${esc(o.centre[0])}</text>`+
      `<text class="cs" x="${cx}" y="${cy+18}" text-anchor="middle">${esc(o.centre[1])}</text>`+rows;
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── 100% stacked comparison bars ──────────────────────────────────── */
  function stack100(o){
    const W=720,rowH=64,H=o.rows.length*rowH+34;
    let inner='',ky=[];
    o.rows.forEach((row,i)=>{
      const y=i*rowH+16, tot=row.segs.reduce((s,d)=>s+d.v,0); let x=138;
      inner+=`<text class="cs2" x="0" y="${y+22}">${esc(row.label)}</text>`+
             `<text class="cs" x="0" y="${y+38}">${esc(row.sub||'')}</text>`;
      row.segs.forEach(d=>{
        const w=d.v/tot*(W-138);
        inner+=`<rect class="seg" x="${x.toFixed(1)}" y="${y}" width="${Math.max(w,0).toFixed(1)}" height="30" fill="${d.c}"><title>${esc(d.l)}: ${esc(d.vl||N(d.v))}</title></rect>`;
        if(w>44) inner+=`<text x="${(x+w/2).toFixed(1)}" y="${y+19}" text-anchor="middle" style="fill:var(--on-layer);font:600 10.5px var(--f)">${(d.v/tot*100).toFixed(0)}%</text>`;
        x+=w;
        if(i===0) ky.push({l:d.l,c:d.c});
      });
      inner+=`<text class="cv" x="138" y="${y+46}">${esc(row.totalLabel||'')}</text>`;
    });
    return shell(Object.assign({},o,{legend:key(o.key||ky)}),wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── multi-series line chart ───────────────────────────────────────── */
  function lines(o){
    const W=720,H=300,L=58,R=14,T=16,B=52, pw=W-L-R, ph=H-T-B;
    const lg=!!o.log, ymin=o.y.min, ymax=o.y.max;
    const py=v=>{ const f=lg?(Math.log10(v)-Math.log10(ymin))/(Math.log10(ymax)-Math.log10(ymin))
      :(v-ymin)/(ymax-ymin); return T+ph-f*ph; };
    const px=i=>L+(o.x.length===1?pw/2:i*pw/(o.x.length-1));
    let inner='';
    o.y.ticks.forEach(t=>{ const y=py(t).toFixed(1);
      inner+=`<line class="gr" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/>`+
             `<text class="cs" x="${L-8}" y="${(+y+3.5).toFixed(1)}" text-anchor="end">${esc(o.y.fmt?o.y.fmt(t):N(t))}</text>`; });
    inner+=`<line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${T+ph}"/><line class="ax" x1="${L}" y1="${T+ph}" x2="${W-R}" y2="${T+ph}"/>`;
    o.x.forEach((lab,i)=>inner+=`<text class="cs" x="${px(i).toFixed(1)}" y="${T+ph+18}" text-anchor="middle">${esc(lab)}</text>`);
    (o.marks||[]).forEach(m=>{ const y=py(m.y).toFixed(1);
      inner+=`<line class="cmk" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/>`+
             `<text class="cmk-t" x="${W-R}" y="${(+y-5).toFixed(1)}" text-anchor="end">${esc(m.label)}</text>`; });
    o.series.forEach(s=>{
      const d=s.v.map((v,i)=>`${i?'L':'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
      inner+=`<path d="${d}" fill="none" stroke="${s.c}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${s.dash?' stroke-dasharray="5 4"':''}/>`;
      s.v.forEach((v,i)=>inner+=`<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="3.4" fill="${s.c}"><title>${esc(s.n)} · ${esc(o.x[i])}: ${esc(o.y.fmt?o.y.fmt(v):N(v))}</title></circle>`);
    });
    if(o.y.title) inner+=`<text class="cs" x="0" y="${T-4}">${esc(o.y.title)}</text>`;
    if(o.x.title) inner+=`<text class="cs" x="${W-R}" y="${H-8}" text-anchor="end">${esc(o.x.title)}</text>`;
    return shell(Object.assign({},o,{legend:key(o.series.map(s=>({l:s.n,c:s.c})))}),wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── bubble scatter ────────────────────────────────────────────────── */
  function scatter(o){
    const W=720,H=356,L=66,R=26,T=40,B=54, pw=W-L-R, ph=H-T-B;
    const px=v=>L+(v-o.x.min)/(o.x.max-o.x.min)*pw;
    const py=v=>T+ph-(v-o.y.min)/(o.y.max-o.y.min)*ph;
    let inner='';
    o.y.ticks.forEach(t=>{ const y=py(t).toFixed(1);
      inner+=`<line class="gr" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/><text class="cs" x="${L-8}" y="${(+y+3.5).toFixed(1)}" text-anchor="end">${esc(o.y.fmt?o.y.fmt(t):t)}</text>`; });
    o.x.ticks.forEach(t=>{ const x=px(t).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T}" x2="${x}" y2="${T+ph}"/><text class="cs" x="${x}" y="${T+ph+18}" text-anchor="middle">${esc(o.x.fmt?o.x.fmt(t):t)}</text>`; });
    inner+=`<line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${T+ph}"/><line class="ax" x1="${L}" y1="${T+ph}" x2="${W-R}" y2="${T+ph}"/>`;
    o.points.forEach(p=>{
      const x=px(p.x),y=py(p.y);
      inner+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.r}" fill="${p.c}" fill-opacity=".22" stroke="${p.c}" stroke-width="1.6"><title>${esc(p.l)} — ${esc(p.tip||'')}</title></circle>`+
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${p.c}"/>`+
        (()=>{ const off=(p.ly!==undefined?p.ly:-p.r-8), lx=x+(p.lx||0), an=p.an||'middle',
                 my=off<0?off-13:off, sy=off<0?off:off+12;
          return `<text class="cs2" x="${lx.toFixed(1)}" y="${(y+my).toFixed(1)}" text-anchor="${an}">${esc(p.l)}</text>`+
            (p.sub?`<text class="cs" x="${lx.toFixed(1)}" y="${(y+sy).toFixed(1)}" text-anchor="${an}">${esc(p.sub)}</text>`:''); })();
    });
    inner+=`<text class="cs" x="${W-R}" y="${H-8}" text-anchor="end">${esc(o.x.title)}</text>`+
           `<text class="cs" x="0" y="${T-5}">${esc(o.y.title)}</text>`;
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── tornado / sensitivity ─────────────────────────────────────────── */
  function tornado(o){
    const W=720,rowH=52,L=178,R=16,T=26,H=o.rows.length*rowH+T+52, pw=W-L-R;
    const px=v=>L+(v-o.x.min)/(o.x.max-o.x.min)*pw;
    let inner='';
    o.x.ticks.forEach(t=>{ const x=px(t).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T-8}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cs" x="${x}" y="${T+o.rows.length*rowH+18}" text-anchor="middle">$${t.toFixed(2)}</text>`; });
    const bx=px(o.base).toFixed(1);
    inner+=`<line class="ax" x1="${bx}" y1="${T-14}" x2="${bx}" y2="${T+o.rows.length*rowH}" stroke-width="1.6"/>`+
           `<text class="cs2" x="${bx}" y="${T-20}" text-anchor="middle">base $${o.base.toFixed(2)}</text>`;
    (o.marks||[]).forEach((m,i)=>{ const x=px(m.x).toFixed(1);
      inner+=`<line class="cmk" x1="${x}" y1="${T-8}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cmk-t" x="${x}" y="${T+o.rows.length*rowH+32+i*14}" text-anchor="${i%2?'start':'end'}">${esc(m.label)}</text>`; });
    o.rows.forEach((r,i)=>{
      const y=T+i*rowH+9, x1=px(Math.min(r.lo,r.hi)), x2=px(Math.max(r.lo,r.hi));
      inner+=`<text class="cs2" x="0" y="${y+16}">${esc(r.l)}</text>`+
             `<text class="cs" x="0" y="${y+30}">${esc(r.sub||'')}</text>`+
             `<rect x="${x1.toFixed(1)}" y="${y}" width="${(x2-x1).toFixed(1)}" height="22" rx="4" fill="${r.c}" fill-opacity=".78"><title>${esc(r.l)}: $${Math.min(r.lo,r.hi).toFixed(2)} to $${Math.max(r.lo,r.hi).toFixed(2)}</title></rect>`+
             `<text class="cv" x="${(x1-6).toFixed(1)}" y="${y+16}" text-anchor="end">${esc(r.loL)}</text>`+
             `<text class="cv" x="${(x2+6).toFixed(1)}" y="${y+16}">${esc(r.hiL)}</text>`;
    });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── gantt / sequence ──────────────────────────────────────────────── */
  function gantt(o){
    const W=720,rowH=26,L=196,R=14,T=24,H=o.rows.length*rowH+T+38, pw=W-L-R;
    const px=v=>L+v/o.max*pw;
    let inner='';
    for(let m=0;m<=o.max;m+=12){ const x=px(m).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T-10}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cs" x="${x}" y="${T-16}" text-anchor="middle">${m===0?'month 0':'m'+m}</text>`; }
    o.rows.forEach((r,i)=>{
      const y=T+i*rowH+4, x1=px(r.a), x2=px(r.b);
      inner+=`<text class="${r.strong?'cs2':'cs'}" x="0" y="${y+13}">${esc(r.l)}</text>`+
             `<rect x="${x1.toFixed(1)}" y="${y}" width="${Math.max(x2-x1,3).toFixed(1)}" height="15" rx="3.5" fill="${r.c}" fill-opacity="${r.kind==='lead'?'.95':'.62'}"><title>${esc(r.l)}: month ${r.a} to ${r.b}</title></rect>`+
             (r.tag?(x2>L+pw*0.86
               ?`<text class="cs" x="${(x2-7).toFixed(1)}" y="${y+12}" text-anchor="end" style="fill:var(--on-layer)">${esc(r.tag)}</text>`
               :`<text class="cs" x="${(x2+6).toFixed(1)}" y="${y+12}">${esc(r.tag)}</text>`):'');
    });
    (o.marks||[]).forEach(m=>{ const x=px(m.x).toFixed(1);
      inner+=`<line class="cmk" x1="${x}" y1="${T-10}" x2="${x}" y2="${T+o.rows.length*rowH+6}"/>`+
             `<text class="cmk-t" x="${x}" y="${T+o.rows.length*rowH+22}" text-anchor="${m.an||'middle'}">${esc(m.label)}</text>`; });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── simple share bars, used for concentration profiles ────────────── */
  function shareBars(o){
    const W=720,rowH=30,H=o.rows.length*rowH+18,LM=312,R=58,pw=W-LM-R;
    const mx=o.max||Math.max(100,...o.rows.map(r=>r.v));
    let inner='';
    o.rows.forEach((r,i)=>{
      const y=i*rowH+8, w=r.v/mx*pw;
      inner+=`<text class="cs2" x="0" y="${y+14}">${esc(r.l)}</text>`+
        `<rect x="${LM}" y="${y+3}" width="${pw}" height="13" rx="4" fill="var(--track)"/>`+
        `<rect x="${LM}" y="${y+3}" width="${Math.max(w,2).toFixed(1)}" height="13" rx="4" fill="${r.c||o.c}"><title>${esc(r.l)}: ${esc(r.vl||r.v)}</title></rect>`+
        `<text class="cv" x="${W}" y="${y+14}" text-anchor="end">${esc(r.vl!==undefined?r.vl:r.v+'%')}</text>`;
    });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }
  return {donut,stack100,lines,scatter,tornado,gantt,shareBars,N,key,shell,wrap};
})();


const put=(id,html)=>{const el=document.getElementById(id); if(el) el.innerHTML=html;};

/* ───────── Gigawatt project charts ───────── */
put('cx-tco',CX.stack100({
  t:'Upfront capital against annualised lifetime cost',
  q:'Does the balance change once the asset is running? Barely — and that is the finding.',
  rows:[
    {label:'Upfront capital',sub:'$37.9bn',totalLabel:'',segs:[
      {l:'Servers',v:21188,c:LC(4)},{l:'Facility',v:11433,c:LC(1)},{l:'Network',v:4925,c:LC(5)},
      {l:'Energy and operations',v:0,c:LC(8)},{l:'Land and utility works',v:336,c:LC(10)}]},
    {label:'Annualised total cost',sub:'$8.51bn per year',totalLabel:'',segs:[
      {l:'Servers',v:5021,c:LC(4)},{l:'Facility',v:1387,c:LC(1)},{l:'Network',v:1167,c:LC(5)},
      {l:'Energy and operations',v:897,c:LC(8)},{l:'Land and utility works',v:39,c:LC(10)}]}],
  note:'Servers move from 56% of the cheque to 59% of the annual cost. Energy — the input every headline is about — is 7% of the annual bill and zero of the upfront one. Source: Epoch AI, May 2026; operations line aggregates energy, taxes, maintenance, labour and water.'
}));

put('cx-lead-gantt',CX.gantt({
  t:'Sequence and lead times, drawn from the same month zero',
  q:'Which activity, started today, finishes last? Not the building.',
  max:66,
  rows:[
    {l:'Long-lead equipment orders',a:0,b:3,c:LC(1),kind:'lead',strong:1,tag:'must be first'},
    {l:'Site and power strategy',a:0,b:12,c:LC(10)},
    {l:'Permitting and entitlement',a:6,b:24,c:LC(10)},
    {l:'Site works and foundations',a:12,b:24,c:LC(10)},
    {l:'Shell construction',a:18,b:36,c:LC(10),tag:'18 months'},
    {l:'Electrical installation',a:24,b:42,c:LC(1)},
    {l:'Mechanical and cooling',a:26,b:44,c:LC(8)},
    {l:'Commissioning, levels 1–5',a:40,b:52,c:LC(5)},
    {l:'IT fit-out and burn-in',a:42,b:60,c:LC(4)},
    {l:'— large power transformer',a:0,b:29.5,c:LC(1),kind:'lead',tag:'128 wks'},
    {l:'— generator step-up units',a:0,b:37,c:LC(1),kind:'lead',tag:'160 wks'},
    {l:'— heavy-duty gas turbine',a:0,b:60,c:LC(2),kind:'lead',strong:1,tag:'2031 slot'}],
  marks:[{x:66,label:'first token, month 48–66',an:'end'},{x:36,label:'accelerated path, 30–40 months'}],
  note:'Bars below the rule are equipment lead times converted to months from a mid-2026 order, drawn from the same month-zero start as the construction sequence. The turbine, not the concrete, sets the date. Lead times are 2026 published figures and are changing.'
}));

put('cx-energy-scatter',CX.scatter({
  t:'Energy options: what you pay, and how long you wait',
  q:'Bubble area is land taken. The cheapest option is the one you cannot get; the fastest cannot run at night.',
  x:{min:0,max:8,ticks:[0,2,4,6,8],title:'years to firm power →',fmt:t=>t+'y'},
  y:{min:-1,max:13,ticks:[0,3,6,9,12],title:'generation capex, $bn',fmt:t=>'$'+t+'bn'},
  points:[
    {x:6,y:0,r:6,c:LC(5),l:'Grid',sub:'no capex · 5–7 yr queue',ly:-2,an:'end',lx:-16,tip:'$0 capex, land 0 km², ~$594m a year'},
    {x:6,y:1,r:9,c:LC(1),l:'Gas CCGT',sub:'0.3 km² · turbine slot gated',ly:-26,tip:'~$1.0bn capex, $285–530m a year'},
    {x:2.5,y:11.5,r:36,c:LC(9),l:'Solar + storage',sub:'~110 km² · not firm alone',ly:52,tip:'~$11–12bn capex, ~110 km² of land'},
    {x:7.5,y:9,r:12,c:LC(3),l:'Nuclear AP1000',sub:'~1.5 km² · 7+ years',ly:-6,an:'end',lx:-18,tip:'~$9.0bn capex, $570–1,280m a year'}],
  note:'Solar sized for genuine round-the-clock firmness needs roughly fourfold overbuild plus overnight storage — about ninety times the land of the campus it serves. Energy choice moves annual cost by a few hundred million on an $8.5bn total; it moves the schedule by years.'
}));

put('cx-tornado',CX.tornado({
  t:'What actually moves the break-even price',
  q:'Break-even $ per GPU-hour at a 12% hurdle. Each bar is the full range across the assumption tested, holding everything else at base.',
  base:3.19,x:{min:2.0,max:6.4,ticks:[2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0]},
  rows:[
    {l:'Utilisation rate',sub:'90% → 50%',lo:2.56,hi:4.45,c:LC(1),loL:'$2.56',hiL:'$4.45'},
    {l:'IT equipment life',sub:'7 years → 3 years',lo:2.70,hi:4.36,c:LC(4),loL:'$2.70',hiL:'$4.36'},
    {l:'Energy source',sub:'gas → nuclear',lo:3.13,hi:3.32,c:LC(8),loL:'$3.13',hiL:'$3.32'}],
  marks:[{x:3.49,label:'cheapest contract $3.49'},{x:4.26,label:'spot median $4.26'}],
  note:'Depreciation swings the answer 8.7 times harder than the energy source. Stated honestly, utilisation across the range tested is wider still — and it is the variable that moves first if demand softens. The energy debate that dominates commentary is the narrowest bar on the chart. All three are drawn from the same model; 3-year and 5-year cases both sit above the cheapest contracted price.'
}));

put('cx-util-lines',CX.lines({
  t:'Break-even against utilisation, by assumed server life',
  q:'At what occupancy does each depreciation assumption clear the market?',
  x:['50%','60%','71%','80%','90%'],
  y:{min:2,max:6.5,ticks:[2,3,4,5,6],title:'$ per GPU-hour',fmt:t=>'$'+t.toFixed(2)},
  series:[
    {n:'3-year life',v:[6.10,5.12,4.36,3.89,3.48],c:LC(3)},
    {n:'5-year life',v:[4.45,3.74,3.19,2.85,2.56],c:LC(4)},
    {n:'7-year life',v:[3.75,3.16,2.70,2.42,2.17],c:LC(8)}],
  marks:[{y:3.49,label:'cheapest custom contract, $3.49'},{y:4.26,label:'spot median, $4.26'}],
  note:'The 3-year line never crosses below the contract floor at any plausible utilisation. The 5-year line clears it only above roughly 65% occupancy. Break-even includes a 12% return on capital; market reference prices are B200 rates at 1 September 2026.'
}));

put('cx-capstack',CX.stack100({
  t:'Two capital structures, one asset',
  q:'Same building, same chips, different survival odds. The discount rate should not be the same.',
  key:[{l:'Equity and operating cash flow',c:LC(8)},{l:'Project debt and private credit',c:LC(4)},{l:'GPU-collateralised debt',c:LC(3)}],
  rows:[
    {label:'Hyperscaler-funded',sub:'balance-sheet capex',segs:[
      {l:'Equity and operating cash flow',v:75,c:LC(8)},{l:'Project debt and private credit',v:25,c:LC(4)},{l:'GPU-collateralised debt',v:0,c:LC(3)}]},
    {label:'Neocloud-funded',sub:'levered SPV',segs:[
      {l:'Equity and operating cash flow',v:20,c:LC(8)},{l:'Project debt and private credit',v:45,c:LC(4)},{l:'GPU-collateralised debt',v:35,c:LC(3)}]}],
  note:'ILLUSTRATIVE — midpoints chosen inside the disclosed ranges in the table above to show the shape of the difference, not a survey of actual deals. The structural point is not a percentage: a representative neocloud carries five-year loans against three-year customer contracts and fifteen-year leases, secured on an asset whose useful life is the single most contested assumption in the project.'
}));

/* ───────── Humanoid project charts ───────── */
put('cx-bom-donut',CX.donut({
  t:'Where the cost sits in one humanoid',
  q:'A mechatronics problem with an AI feature, not the reverse.',
  centre:['~50%','actuation'],
  data:[{l:'Actuators and joints',v:50,c:LC(9),vl:'50%'},{l:'Sensors and perception',v:33,c:LC(5),vl:'33%'},{l:'Hands and manipulation',v:17,c:LC(3),vl:'17%'}],
  note:'Morgan Stanley\u2019s teardown of an Optimus Gen 2-class robot put actuators at roughly 56% of a ~$55,000 bill of materials; independent 2026 estimates place high-precision joint actuators at 40–55% of hardware cost. Shares are analyst estimates, not disclosures.'
}));

put('cx-ramp',CX.lines({
  t:'The ramp required to reach ten million units',
  q:'What has to be true, year by year, for the fleet to exist?',
  x:['2026','2028','2030','2032','2034'],
  y:{min:0.01,max:20,ticks:[0.01,0.1,1,10],title:'cumulative units, log scale',fmt:t=>t<1?(t*1000).toFixed(0)+'k':t+'m'},log:true,
  series:[
    {n:'Annual production',v:[0.02,0.08,0.32,1.28,5.12],c:LC(5),dash:true},
    {n:'Cumulative fleet',v:[0.02,0.14,0.62,2.54,10.22],c:LC(9)}],
  marks:[{y:10,label:'10 million cumulative'}],
  note:'DERIVED — sustained 100% annual production growth applied to a 2026 base of roughly 20,000 units. Reaching the threshold requires doubling output every year for nine consecutive years. No hardware industry has sustained that, and none faced a component whose supply chain must grow fiftyfold.'
}));

put('cx-bottleneck',CX.scatter({
  t:'Bottleneck map: how bad, and how long to fix',
  q:'Position, not rank. Anything in the upper right is a decade-scale constraint, not a supply squeeze.',
  x:{min:0,max:13,ticks:[0,3,6,9,12],title:'years to relieve →',fmt:t=>t+'y'},
  y:{min:0,max:5.6,ticks:[1,2,3,4,5],title:'severity, 1 low → 5 high',fmt:t=>String(t)},
  points:[
    {x:10,y:5,r:22,c:LC(9),l:'Precision reducers',sub:'~50× expansion',ly:-32,tip:'8–12 years to relieve'},
    {x:11.5,y:4.6,r:16,c:LC(1),l:'Rare earth magnets',sub:'political, not industrial',ly:24,an:'middle',lx:0,tip:'13% of world output, export-controlled'},
    {x:8,y:4.3,r:14,c:LC(3),l:'Manipulation and tactile',sub:'research-dependent',ly:-22,tip:'Unsolved for unstructured work'},
    {x:4,y:3.4,r:12,c:LC(5),l:'Edge inference',sub:'3–5 years',ly:-22,tip:'Models outpace deployable hardware'},
    {x:1.5,y:3.9,r:11,c:LC(4),l:'Training data',sub:'self-resolving above 1m units',ly:-18,an:'end',lx:-16,tip:'Severe below 1m units'},
    {x:3,y:2.4,r:9,c:LC(8),l:'Battery runtime',sub:'workarounds exist',ly:22,tip:'Architectural, not chemical'},
    {x:7,y:2.0,r:9,c:LC(10),l:'Maintenance trade',sub:'5–10 years',ly:22,tip:'A trade that does not yet exist'},
    {x:1,y:1.0,r:7,c:LC(10),l:'Fleet electricity',sub:'not a constraint',ly:20,an:'start',lx:-6,tip:'~0.5% of US consumption'}],
  note:'Severity scores are the author\u2019s ranking, positioned against the time-to-relieve estimates in the table below. The reducer capacity denominator behind the fiftyfold figure is a derivation from industrial robot installation volumes, not a disclosed statistic, and is the single number here most in need of primary-source verification.'
}));

put('cx-energy-cmp',CX.shareBars({
  t:'Fleet energy in context',
  q:'Ten million robots against the infrastructure that trains them.',c:LC(9),
  max:100,
  rows:[
    {l:'Supporting AI training compute, 3–5 GW',v:100,vl:'~26 TWh',c:LC(4)},
    {l:'10m humanoid fleet, all charging',v:78,vl:'20.4 TWh',c:LC(9)},
    {l:'One 1 GW data centre',v:27,vl:'7.1 TWh',c:LC(5)},
    {l:'Fleet on-board compute, distributed',v:16,vl:'~1.3 GW',c:LC(10)}],
  note:'DERIVED — annual terawatt-hours, scaled to the largest bar. The 3–5 GW training estimate is converted at the same 71% utilisation used in the gigawatt model. The whole fleet is roughly 0.5% of US electricity consumption, or 2.9 gigawatt-scale data centres. Compute is energy-intensive; physical work is not. The grid strain from AI comes from training and inference, not from embodiment — the charging load is spread across thousands of facilities and looks like ordinary industrial load growth.'
}));

/* Horizontal bars are width-animated on reveal; make that robust across the
   three view tabs, the layer rail and the runtime-generated project chapters. */
const fillAll=()=>document.querySelectorAll('.fl').forEach(f=>{ if(f.dataset.w) f.style.width=f.dataset.w+'%'; });
fillAll();
document.addEventListener('click',()=>{requestAnimationFrame(fillAll); setTimeout(fillAll,60)},true);
window.addEventListener('hashchange',()=>setTimeout(fillAll,60));

/* ───────── Static diagrams built for this report ───────── */

/* Capital flow: $37.9bn, with the facility line exploded onto its own scale */
(function(){
  const el=document.getElementById('cx-sankey'); if(!el) return;
  const W=720,H=372,T=24,BH=300;
  const mid=[{l:'Servers',v:21188,c:LC(4)},{l:'Facility',v:11433,c:LC(1)},
             {l:'Network infrastructure',v:4925,c:LC(5)},{l:'Land and utility works',v:336,c:LC(10)}];
  const sub=[{l:'Electrical infrastructure',v:4875},{l:'Cooling systems',v:2300},
             {l:'Building shell and envelope',v:1425},{l:'Fire, security, controls',v:1150},
             {l:'Design, PM, contingency',v:1113},{l:'Site works and roads',v:570}];
  const tot=mid.reduce((s,d)=>s+d.v,0), k=BH/tot, gap=4;
  const x0=6,x1=34,x2=252,x3=280,x4=470,x5=498;
  let g='',y=T, nodes=[];
  g+=`<rect x="${x0}" y="${T}" width="${x1-x0}" height="${BH}" rx="3" fill="var(--ink2)"/>`;
  g+=`<text class="cs2" x="${x0}" y="${T-8}">Total upfront capital</text>`;
  g+=`<text class="ct" x="${x0}" y="${T+BH+22}" style="font-size:16px">$37.9bn</text>`;
  let ymid=T;
  mid.forEach(d=>{
    const h=d.v*k, ys=y, ym=ymid;
    g+=`<path d="M${x1} ${ys} C${(x1+x2)/2} ${ys}, ${(x1+x2)/2} ${ym}, ${x2} ${ym} L${x2} ${ym+h} C${(x1+x2)/2} ${ym+h}, ${(x1+x2)/2} ${ys+h}, ${x1} ${ys+h} Z" fill="${d.c}" fill-opacity=".26"/>`;
    g+=`<rect x="${x2}" y="${ym}" width="${x3-x2}" height="${h}" rx="3" fill="${d.c}"><title>${d.l}: $${(d.v/1000).toFixed(2)}bn</title></rect>`;
    g+=`<text class="cs2" x="${x3+8}" y="${ym+h/2+1}">${d.l}</text>`+
       `<text class="cs" x="${x3+8}" y="${ym+h/2+14}">$${(d.v/1000).toFixed(2)}bn · ${(d.v/tot*100).toFixed(1)}%</text>`;
    if(d.l==='Facility') nodes.push([ym,h]);
    y+=h; ymid+=h+gap;
  });
  const [fy,fh]=nodes[0], k2=BH/11433;
  let sy=T;
  sub.forEach((d,i)=>{
    const h=d.v*k2;
    const a=fy+fh*(sub.slice(0,i).reduce((s,x)=>s+x.v,0)/11433), b=a+fh*(d.v/11433);
    g+=`<path d="M${x3} ${a.toFixed(1)} C${(x3+x4)/2} ${a.toFixed(1)}, ${(x3+x4)/2} ${sy}, ${x4} ${sy} L${x4} ${(sy+h).toFixed(1)} C${(x3+x4)/2} ${(sy+h).toFixed(1)}, ${(x3+x4)/2} ${b.toFixed(1)}, ${x3} ${b.toFixed(1)} Z" fill="${LC(1)}" fill-opacity="${0.3-i*0.035}"/>`;
    g+=`<rect x="${x4}" y="${sy}" width="${x5-x4}" height="${h.toFixed(1)}" rx="3" fill="${LC(1)}" fill-opacity="${0.95-i*0.11}"><title>${d.l}: $${(d.v/1000).toFixed(2)}bn</title></rect>`;
    g+=`<text class="cs2" x="${x5+8}" y="${(sy+h/2+1).toFixed(1)}">${d.l}</text>`+
       `<text class="cs" x="${x5+8}" y="${(sy+h/2+13).toFixed(1)}">$${(d.v/1000).toFixed(2)}bn</text>`;
    sy+=h;
  });
  g+=`<text class="cs" x="${x4}" y="${T-8}">Facility, on its own scale</text>`;
  el.innerHTML=`<h4>Where the $37.9 billion goes</h4>`+
    `<p class="cq">Follow the money once, then follow the facility line again at ten times magnification.</p>`+
    CX.wrap(`0 0 ${W} ${H}`,g,'Capital flow from total upfront capital into servers, facility, network and land, with the facility line broken out into electrical, cooling, shell, controls, design and site works')+
    `<figcaption class="cnote">Servers are 56% of the cheque. Inside the building, electrical infrastructure is larger than cooling and shell combined — and the shell itself, the thing most commentary pictures, is 10–15% of the facility line and under 5% of the project. Facility sub-categories are midpoints of the disclosed ranges. Source: Epoch AI, May 2026.</figcaption>`;
})();


(function(){
  const el=document.getElementById('cx-matrix'); if(!el) return;
  const W=390,H=330,L=42,R=18,T=24,B=42, pw=W-L-R, ph=H-T-B;
  /* Ten layers now. Connectivity enters mid-field — its chokepoints are real
     but geographic rather than material — and data enters low on the x axis
     because its binding constraint is legal, which this axis does not measure. */
  const P=[[1,.62,.82,'Energy',0],[2,.86,.62,'Materials',0],[3,.94,.95,'Semis',0],[4,.58,.46,'Compute',0],
           [5,.32,.22,'Data centres',0],[6,.16,.52,'Data',0],[7,.05,.13,'Models',0],
           [8,.05,.37,'Software',0],[9,.50,.62,'Connectivity',0],[10,.78,.44,'Embodiment',0]];
  const px=v=>L+v*pw, py=v=>T+ph-v*ph;
  let g=`<defs><linearGradient id="mx-bg" x1="0" x2="1" y1="1" y2="0">`+
    `<stop offset="0" stop-color="var(--surface2)"/><stop offset=".58" stop-color="var(--surface)"/>`+
    `<stop offset="1" stop-color="var(--accent-soft)"/></linearGradient></defs>`+
    `<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="url(#mx-bg)" rx="14"/>`+
    `<rect x="${L+8}" y="${T+8}" width="${pw-16}" height="${ph-16}" fill="none" stroke="var(--line)" rx="10" opacity=".55"/>`;
  g+=`<line class="gr" x1="${L+pw/2}" y1="${T}" x2="${L+pw/2}" y2="${T+ph}"/>`+
     `<line class="gr" x1="${L}" y1="${T+ph/2}" x2="${L+pw}" y2="${T+ph/2}"/>`;
  P.forEach(([n,x,y,lab,dy])=>{
    const an=x<.15?'start':(x>.85?'end':'middle'), lx=x<.15?-13:(x>.85?13:0);
    g+=`<g class="mx-pt" data-layer="${n}" tabindex="0" role="button" aria-label="Layer ${n}, ${lab}">`+
       `<circle class="mx-hit" cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="19" fill="transparent"/>`+
       `<circle class="mx-dot" cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="13" fill="var(--l${n})"/>`+
       `<text x="${px(x).toFixed(1)}" y="${(py(y)+4).toFixed(1)}" text-anchor="middle" style="fill:var(--on-layer);font:600 11px var(--f);pointer-events:none">${n}</text>`+
       `<text class="cs" x="${(px(x)+lx).toFixed(1)}" y="${(py(y)+27+(dy||0)).toFixed(1)}" text-anchor="${an}" style="pointer-events:none">${lab}</text></g>`;
  });
  g+=`<text class="cs" x="${L}" y="${H-24}">weak or indirect</text>`+
     `<text class="cs" x="${L+pw}" y="${H-24}" text-anchor="end">extreme</text>`+
     `<text class="cs" x="${L+pw/2}" y="${H-8}" text-anchor="middle">material chokepoint →</text>`+
     `<text class="cs" x="${-(T+ph/2)}" y="12" transform="rotate(-90)" text-anchor="middle">moat durability →</text>`;

  const REST=`<p class="mx-eyebrow">The heuristic</p><h5>Where a physical chokepoint exists, a moat tends to exist above it</h5>`+
    `<p class="mx-lede">Layers 7 and 8 have no material chokepoint and the weakest moats. Layers 1, 2 and 3 have the strongest of both. `+
    `Materials sits high on chokepoint but below semiconductors on moat, because a refining monopoly can be rebuilt in three to eight years while accumulated engineering cannot. `+
    `Two layers sit awkwardly on this axis: connectivity, whose hardest constraints are geographic rather than material, and data, whose binding constraint is legal. `+
    `Both are plotted on materials alone, so both are understated here.</p>`+
    `<p class="mx-hint">Point at any layer to read why it sits where it does.</p>`;

  el.innerHTML=`<h4>Chokepoint and moat, layer by layer</h4>`+
    `<p class="cq">The correlation is the most useful heuristic in the analysis.</p>`+
    `<div class="dia-shell">`+
      `<div class="dia-chart">`+CX.wrap(`0 0 ${W} ${H}`,g,'Scatter of the ten layers positioned by material chokepoint strength against moat durability, showing a strong positive relationship')+`</div>`+
      `<aside class="dia-info" id="mx-info" aria-live="polite">${REST}</aside>`+
    `</div>`+
    `<figcaption class="cnote">Positions are the author’s assessment on both axes, not measured values. They encode the argument made in each layer rather than a dataset, and should be read as a ranking, not a measurement.</figcaption>`;

  const info=el.querySelector('#mx-info'), svg=el.querySelector('svg');
  const card=n=>{const d=MOATWHY[n]; if(!d) return REST;
    return `<p class="mx-eyebrow" style="color:var(--l${n})">Layer ${n}</p><h5>${d.t}</h5>`+
      `<div class="mx-scores"><span><b>Moat</b>${d.moat}</span><span><b>Chokepoint</b>${d.cp}</span></div>`+
      `<p class="mx-why"><b>Why the moat sits there.</b> ${d.m}</p>`+
      `<p class="mx-why"><b>Why the chokepoint sits there.</b> ${d.c}</p>`+
      `<p class="mx-watch" style="border-left-color:var(--l${n})">${d.w}</p>`;};
  let pinned=null;
  const show=n=>{info.innerHTML=card(n); svg.classList.add('mx-hl'); svg.style.setProperty('--mxc',`var(--l${n})`);
    svg.querySelectorAll('.mx-pt').forEach(p=>p.classList.toggle('on',+p.dataset.layer===n));};
  const clear=()=>{if(pinned!==null)return; info.innerHTML=REST; svg.classList.remove('mx-hl');
    svg.querySelectorAll('.mx-pt').forEach(p=>p.classList.remove('on'));};
  svg.querySelectorAll('.mx-pt').forEach(p=>{
    const n=+p.dataset.layer;
    p.addEventListener('mouseenter',()=>show(n));
    p.addEventListener('mouseleave',clear);
    p.addEventListener('focusin',()=>{pinned=n;show(n);});
    p.addEventListener('focusout',()=>{pinned=null;clear();});
  });
})();

/* Export control chronology */
function policySVG(){
  const W=720,H=276,LP=8,RP=8,Y=140,pw=W-LP-RP;
  const t0=Date.UTC(2023,5,1), t1=Date.UTC(2027,0,15);
  const px=d=>LP+(d-t0)/(t1-t0)*pw;
  // lv 1 sits close to the axis, lv 2 further out, so neighbouring events never overlap
  const E=[
    {d:Date.UTC(2023,7,1),l:'Gallium and germanium controls begin',s:'1 Aug 2023',up:1,lv:1,an:'start',c:LC(3)},
    {d:Date.UTC(2024,11,1),l:'Ga, Ge and Sb banned to the US',s:'Dec 2024',up:0,lv:1,an:'middle',c:LC(3)},
    {d:Date.UTC(2025,3,4),l:'Seven heavy rare earths licensed',s:'4 Apr 2025 · never suspended',up:1,lv:2,an:'middle',c:LC(1),flag:1},
    {d:Date.UTC(2025,9,9),l:'Announcements 61 and 62',s:'9 Oct 2025 · technology export ban',up:0,lv:2,an:'end',c:LC(1)},
    {d:Date.UTC(2025,10,7),l:'One-year suspension',s:'7 Nov 2025',up:1,lv:1,an:'middle',c:LC(8)},
    {d:Date.UTC(2026,5,22),l:'MP Materials and USA Rare Earth listed',s:'22 Jun 2026',up:0,lv:1,an:'middle',c:LC(3)},
    {d:Date.UTC(2026,10,10),l:'Suspension expires',s:'10–27 Nov 2026',up:1,lv:2,an:'end',c:LC(3),flag:1}];
  let g=`<line class="ax" x1="${LP}" y1="${Y}" x2="${W-RP}" y2="${Y}" stroke-width="1.6"/>`;
  [2024,2025,2026].forEach(yr=>{ const x=px(Date.UTC(yr,0,1)).toFixed(1);
    g+=`<line class="gr" x1="${x}" y1="18" x2="${x}" y2="${H-30}"/><text class="cs" x="${x}" y="${H-12}" text-anchor="middle">${yr}</text>`; });
  const a=px(Date.UTC(2025,10,7)),b=px(Date.UTC(2026,10,10));
  g+=`<rect x="${a.toFixed(1)}" y="${Y-9}" width="${(b-a).toFixed(1)}" height="18" rx="4" fill="${LC(8)}" fill-opacity=".18"/>`+
     `<text class="cs" x="${(a+(b-a)*0.34).toFixed(1)}" y="${Y+4}" text-anchor="middle">October package suspended</text>`;
  E.forEach(e=>{
    const x=px(e.d), stem=e.lv===1?30:62, dir=e.up?-1:1;
    const y2=Y+dir*stem, ty=e.up?y2-10:y2+14;
    g+=`<line x1="${x.toFixed(1)}" y1="${Y+dir*9}" x2="${x.toFixed(1)}" y2="${y2}" stroke="${e.c}" stroke-width="1.3"/>`+
       `<circle cx="${x.toFixed(1)}" cy="${Y}" r="${e.flag?5.5:4}" fill="${e.c}"/>`+
       `<text class="cs2" x="${x.toFixed(1)}" y="${ty}" text-anchor="${e.an}">${e.l}</text>`+
       `<text class="cs" x="${x.toFixed(1)}" y="${ty+(e.up?-13:13)}" text-anchor="${e.an}">${e.s}</text>`;
  });
  return `<figure class="cw"><h4>China\u2019s export controls, and the date already in the diary</h4>`+
    `<p class="cq">What is suspended, what never was, and what expires.</p>`+
    CX.wrap(`0 0 ${W} ${H}`,g,'Timeline of Chinese export controls from August 2023 to November 2026, showing the suspension window and the April 2025 heavy rare earth licensing that was never suspended')+
    `<figcaption class="cnote">The reading most commentary gets wrong: the suspension covers the October 2025 expansion and the US-specific bans. <b>The April 2025 licensing requirement on seven heavy rare earths — including the dysprosium and terbium that keep magnets working hot — was never suspended and remains active</b>, with customs data showing exports running roughly 50% below prior levels. The suspension expires 10 November 2026; the gallium, germanium and antimony arrangement runs to 27 November 2026. This is a scheduled, known risk date affecting layers 1, 3, 4 and 8 at once. Sources: Clark Hill, CIRS Group, Benchmark Minerals, CSIS.</figcaption></figure>`;
}
put('cx-policy',policySVG());
document.querySelectorAll('[data-policy]').forEach(n=>{n.innerHTML=policySVG()});


document.querySelectorAll('[data-conc]').forEach(n=>{
  const d=CONC[+n.dataset.conc]; if(!d){n.remove();return;}
  n.innerHTML=CX.shareBars({t:d.t,q:'Share held by the single dominant node, where a number exists.',c:d.c,rows:d.rows,note:d.note});
});


put('gw-src',projectSourcePane('gw'));
put('hu-src',projectSourcePane('hu'));
fillAll();

/* ══════════════════════════════════════════════════════════════════════════
   The overview map, read by pointing at it. Hovering a layer lights that
   layer's outgoing arrows, reveals their labels — hidden otherwise, which is
   what keeps the diagram legible — and fills the panel beside the map with
   the layer's own thesis. Everything works on keyboard focus too.
   ══════════════════════════════════════════════════════════════════════════ */
/* Fill the map's mark slots from the shared set, so the icons have one source. */
(function(){
  document.querySelectorAll('#mapsvg .lic[data-icon]').forEach(g=>{
    /* keys are usually the layer number, but '1p' is the on-site plant —
       the same layer indoors, drawn differently so the two read apart. */
    g.innerHTML=LAYER_ICONS[g.dataset.icon]||LAYER_ICONS[+g.dataset.icon]||'';
  });
})();

(function(){
  const svg=document.getElementById('mapsvg'), info=document.getElementById('mapinfo');
  if(!svg||!info||!svg.querySelector('[data-ends]')) return;

  const WORLD_TEXT='Not a layer, but the ground the stack is drawn from: where energy is '+
    'captured, where materials are extracted, and where embodied machines eventually do the work. '+
    'It feeds the base pair and takes the fleet’s work back.';
  const REST='<p class="mi-eyebrow">The map</p><h4>Where each capability physically lives</h4>'+
    '<p class="mi-lede">Not a single queue. An industrial supply base feeds two physical enclosures: '+
    'the data centre, and the machine at the edge. Layers 4, 7 and 8 appear inside both, because the '+
    'same capability class runs at two scales. Layer 9 is the only path between them.</p>'+
    '<p class="mi-hint">Point at any layer to read it here and light up the arrows in and out of it. '+
    'Click the layer itself to open it in full.</p>';

  function card(n){
    if(n===0) return '<p class="mi-eyebrow">Outside the stack</p><h4>The physical world</h4>'+
      `<p class="mi-lede">${WORLD_TEXT}</p>`;
    const L=LAYERS.find(x=>x.n===n); if(!L) return REST;
    return `<p class="mi-eyebrow">Layer ${L.n}</p><h4>${L.t}</h4>`+
      `<span class="chip ${L.mk}">${L.moat}</span>`+
      `<p class="mi-lede">${L.lede}</p>`+
      `<p class="mi-choke"><b>Binding constraint.</b> ${L.choke}</p>`;
  }

  /* ── who lights up ────────────────────────────────────────────────────
     Every box carries a data-node id and every arrow a data-ends list of the
     ids that light it. Ids, not layer numbers: layer 1 is drawn three times —
     the grid, the plant in the hall, the battery in the machine — and a layer
     number cannot tell them apart, which is why pointing at the battery used
     to light the power lane running off to connectivity.

     data-link is the arrow's real pair of ends, and decides which *boxes* light
     up. It differs from data-ends wherever a flow is shared: the power lane
     into connectivity is lit from the battery as well, so the lane still reads
     whole, but its ends are energy and connectivity, so the battery does not
     drag connectivity into the highlight. */
  const arrows=[...svg.querySelectorAll('[data-ends]')];
  const boxes=[...svg.querySelectorAll('[data-node]')];
  const set=v=>new Set((v||'').split(/\s+/).filter(Boolean));

  function highlight(id){
    svg.classList.toggle('hl', id!==null);
    const lit=new Set(), near=new Set();
    if(id){
      near.add(id);
      arrows.forEach(el=>{
        const ends=set(el.dataset.ends);
        if(!ends.has(id)) return;
        lit.add(el);
        /* Only an arrow may name the boxes on its far side, and only from a
           real end of it. A label carries the same data-ends so it appears
           with the flow, but a label connects nothing. */
        if(el.tagName!=='path') return;
        const link=el.dataset.link?set(el.dataset.link):ends;
        if(link.has(id)) link.forEach(x=>near.add(x));
      });
      /* An enclosure draws no arrow of its own, so it names its sources. */
      const self=boxes.find(el=>el.dataset.node===id);
      if(self) set(self.dataset.neighbours).forEach(x=>near.add(x));
    }
    arrows.forEach(el=>el.classList.toggle('on', lit.has(el)));
    boxes.forEach(el=>el.classList.toggle('on', near.has(el.dataset.node)));
  }

  let pinned=null;
  const show=(n,id)=>{ info.innerHTML=card(n); highlight(id); };
  const clear=()=>{ if(pinned!==null) return; info.innerHTML=REST; highlight(null); };

  /* Parse the layer out of the href properly. Taking the last character
     worked while there were eight layers and breaks at ten: '#layer-10'
     ends in '0', which is the physical world. */
  const layerOf=a=>{const m=/#layer-(\d+)/.exec(a.getAttribute('href')||''); return m?+m[1]:null;};
  const nodes=[...svg.querySelectorAll('a.node')].map(a=>[a,layerOf(a)]).filter(p=>p[1]!==null);
  const world=svg.querySelector('.worldnode');
  if(world) nodes.push([world,0]);

  nodes.forEach(([el,n])=>{
    const id=el.dataset.node||null;
    el.addEventListener('mouseenter',()=>show(n,id));
    el.addEventListener('mouseleave',clear);
    el.addEventListener('focusin',()=>{pinned=n; show(n,id);});
    el.addEventListener('focusout',()=>{pinned=null; clear();});
  });
  info.innerHTML=REST;
  lockPanelHeight(info,[REST,card(0),...LAYERS.map(L=>card(L.n))]);
})();

/* All layer source registers, rendered onto the Method page now that the
   per-layer Sources tab is gone. */
(function(){
  const host=document.getElementById('allsources');
  if(!host||typeof SOURCES==='undefined'||typeof LAYERS==='undefined') return;
  host.innerHTML=LAYERS.map(L=>`<details class="src-layer"${L.n===1?' open':''}>
    <summary>${layerIcon(L.n,'src-icon')}<span>Layer ${L.n} &middot; ${_esc(L.t)}</span></summary>
    <div class="src-layer-body">${sourcePane(L.n)}</div></details>`).join('');
})();

/* ══════════════════════════════════════════════════════════════════════════
   PANEL HEIGHT LOCK
   The reading panels beside the map and the loop stretch to their grid row, so
   a taller card grows the row and the page moves under the cursor mid-hover.
   Measure every state a panel can hold, off-layout in a hidden probe, and hold
   the tallest. Re-measured on resize, since the tallest state depends on width.
   ══════════════════════════════════════════════════════════════════════════ */
function lockPanelHeight(panel, states){
  if(!panel||!states.length) return;
  const measure=()=>{
    panel.style.minHeight='';
    const probe=document.createElement('div');
    probe.className=panel.className;
    probe.style.cssText='position:absolute;left:-9999px;top:0;visibility:hidden;'+
      'pointer-events:none;min-height:0;height:auto;width:'+panel.clientWidth+'px';
    (panel.parentElement||document.body).appendChild(probe);
    let tallest=0;
    for(const html of states){ probe.innerHTML=html; tallest=Math.max(tallest,probe.offsetHeight); }
    probe.remove();
    if(tallest) panel.style.minHeight=tallest+'px';
  };
  /* setTimeout rather than requestAnimationFrame: rAF does not fire while the
     tab is hidden, and the panel would then never get its height. */
  const run=()=>setTimeout(measure,60);
  run();
  window.addEventListener('load',run);
  let t; window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(measure,180);});
}


(function(){
  const svg=document.getElementById('loopsvg'), info=document.getElementById('loopinfo');
  if(!svg||!info) return;
  const REST='<p class="mx-eyebrow">The compounding loop</p>'+
    '<h5>Four steps, and the third one is why this is not just software</h5>'+
    '<p class="mx-lede">Read as a chain, the stack is a value chain. Close it &mdash; actuators change the world, '+
    'sensors observe the change &mdash; and it becomes a flywheel. Each turn produces training data that could not '+
    'have existed before that turn, which is what makes the thesis compound rather than merely grow.</p>'+
    '<p class="mx-hint">Point at any step to read what it means and how it works.</p>';
  const card=k=>{const d=LOOPWHY[k]; if(!d) return REST;
    return `<p class="mx-eyebrow">${d.l}</p><h5>${d.t}</h5>`+
      `<p class="mx-why"><b>What it means.</b> ${d.w}</p>`+
      `<p class="mx-why"><b>How it works.</b> ${d.h}</p>`+
      `<p class="mx-watch">${d.k}</p>`;};
  let pinned=null;
  const show=k=>{info.innerHTML=card(k); svg.classList.add('mx-hl');
    svg.querySelectorAll('.loop-node').forEach(n=>n.classList.toggle('on',n.dataset.stage===k));};
  const clear=()=>{if(pinned)return; info.innerHTML=REST; svg.classList.remove('mx-hl');
    svg.querySelectorAll('.loop-node').forEach(n=>n.classList.remove('on'));};
  svg.querySelectorAll('.loop-node').forEach(n=>{
    const k=n.dataset.stage;
    n.addEventListener('mouseenter',()=>show(k));
    n.addEventListener('mouseleave',clear);
    n.addEventListener('focusin',()=>{pinned=k;show(k);});
    n.addEventListener('focusout',()=>{pinned=null;clear();});
  });
  info.innerHTML=REST;
  lockPanelHeight(info,[REST,...Object.keys(LOOPWHY).map(k=>card(k))]);
})();

/* When the photographic globe loads, retire the drawn one beneath it. If the
   file is missing the image never fires load and the vector globe stays. */
(function(){
  const svg=document.getElementById('mapsvg'); if(!svg) return;
  const img=svg.querySelector('image.earth'); if(!img) return;
  const probe=new Image();
  probe.onload=()=>svg.classList.add('has-earth');
  probe.src=img.getAttribute('href');
})();

/* ══════════════════════════════════════════════════════════════════════════
   ELEMENT DETAIL DIALOG
   Selecting a specimen photograph opens what the collection records about that
   element, plus where it enters this report. Uses a native <dialog>, so Escape
   and the backdrop close it and focus is restored on its own.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  /* Both the material photo strips and the per-layer element cards open this,
     so gate on the data rather than on one of the two markups. */
  if(typeof EL_HAVE==='undefined') return;

  const dlg=document.createElement('dialog');
  dlg.className='el-dialog';
  dlg.innerHTML='<div class="eld-body"></div>';
  document.body.appendChild(dlg);
  const body=dlg.querySelector('.eld-body');

  /* Which material entries in this report rest on a given element. */
  function usedIn(sym){
    const out=[];
    for(const [mat,syms] of Object.entries(ELMAP)) if(syms.includes(sym)) out.push(mat);
    return [...new Set(out)];
  }

  function render(sym){
    const e=ELDATA&&ELDATA[sym];
    if(!e){ body.innerHTML='<p class="eld-lede">Details for this element are still loading.</p>'; return; }
    const uses=usedIn(sym);
    const layers=(typeof EL_LAYERS!=='undefined'&&EL_LAYERS[sym])||[];
    /* Every constrained material this element governs, across all ten layers.
       Deduplicated: rare earth separation constrains four layers and the
       reader does not need it four times. */
    const seen=new Set(), cons=[];
    if(typeof LAYER_MATERIALS!=='undefined') Object.keys(LAYER_MATERIALS).forEach(k=>{
      ((LAYER_MATERIALS[k]||{}).items||[]).forEach(x=>{
        if(!((typeof ELMAP!=='undefined'&&ELMAP[x.n])||[]).includes(sym)) return;
        if(seen.has(x.n)) return; seen.add(x.n);
        cons.push(Object.assign({layer:k}, x));
      });
    });
    body.innerHTML=
      `<button type="button" class="eld-close" aria-label="Close">&times;</button>`+
      `<div class="eld-head">`+
        `<img class="eld-shot" src="assets/elements/${sym}.jpg" alt="Specimen of ${e.name}">`+
        `<div>`+
          `<p class="eld-z">Element ${e.z}</p>`+
          `<h4 id="eld-title">${e.name} <span class="eld-sym">${sym}</span></h4>`+
          `<div class="eld-chips"><span>${e.cat}</span><span>${e.phase} at room temperature</span></div>`+
        `</div>`+
      `</div>`+
      (e.kind&&!/^Specimen photograph$/.test(e.kind)?`<p class="eld-warn">${e.kind}.</p>`:'')+
      (layers.length?`<div class="eld-uses"><p class="eld-h">Layers that use it</p>`+
        `<ul class="eld-layers">${layers.map(n=>{
          const L=(typeof LAYERS!=='undefined')&&LAYERS.find(x=>x.n===n);
          const row=(LAYER_ELEMENTS[n].els||[]).find(r=>r[0]===sym);
          return `<li style="--stage:var(--l${n})"><a href="stack.html#layer-${n}">`+
            `<span class="eldl-n">${n}</span><b>${L?L.t:'Layer '+n}</b>`+
            `<span>${row?row[1]:''}</span></a></li>`;}).join('')}</ul></div>`:'')+
      (cons.length?`<div class="eld-uses"><p class="eld-h">Where its supply is constrained</p>`+
        `<ul class="eld-cons">${cons.map(c=>`<li>`+
          `<b>${_esc(c.n)}</b><span class="eld-c-layer">layer ${c.layer}</span>`+
          `<span class="eld-c-why">${_esc(c.choke)}</span>`+
          `<span class="eld-c-chips"><span class="micro-chip">${_esc(c.geo)}</span>`+
          `<span class="micro-chip">Relief: ${_esc(c.time)}</span></span></li>`).join('')}</ul></div>`:'')+
      (uses.length?`<div class="eld-uses"><p class="eld-h">Material entries resting on it</p>`+
        `<ul>${uses.map(u=>`<li>${u}</li>`).join('')}</ul></div>`:'')+
      `<p class="eld-shows"><b>What the photograph shows.</b> ${e.note}</p>`;
    dlg.setAttribute('aria-label', e.name+' — element details');
  }

  document.addEventListener('click',e=>{
    const shot=e.target.closest('[data-el]');
    if(shot){ render(shot.dataset.el); dlg.showModal(); return; }
    if(e.target.closest('.eld-close')) dlg.close();
  });
  /* clicking the backdrop closes it */
  dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });

  /* fill the caption names once the index lands */
  const label=()=>{
    if(!ELDATA) return;
    document.querySelectorAll('[data-elname]').forEach(n=>{
      const e=ELDATA[n.dataset.elname]; if(e) n.textContent=e.name;
    });
  };
  const t=setInterval(()=>{ if(ELDATA){ label(); clearInterval(t); } },120);
  setTimeout(()=>clearInterval(t),8000);
})();

/* ══════════════════════════════════════════════════════════════════════════
   COMPANY DIALOG
   Every logo on the site opens the same modal: one component, driven by the
   exchange-qualified ticker in TVSYM. Quote, chart and fundamentals are
   TradingView's own embeddable widgets, which need no API key — the site is
   static on GitHub Pages, so there is nowhere to keep a secret. See the note
   in Method on what a fundamentals API would require.

   Widgets are created per open and torn down on close, because TradingView
   scripts write into their container on load and do not survive being moved.
   ══════════════════════════════════════════════════════════════════════════ */
/* TradingView's own range tabs, in the order the brief asked for. Each entry
   is label|resolution. */
const TV_RANGES=['1d|1','5d|15','1m|30','6m|120','ytd|1D','12m|1D','60m|1W','all|1M'];

function tvTheme(){
  const t=document.documentElement.getAttribute('data-theme');
  if(t) return t==='dark'?'dark':'light';
  return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}

(function(){
  let dlg=null, current=null;

  function build(){
    dlg=document.createElement('dialog');
    dlg.className='co-dialog';
    dlg.innerHTML=`<div class="cod-body">
      <button type="button" class="cod-close" aria-label="Close">&times;</button>
      <div class="cod-head"></div>
      <div class="cod-chart"></div>
      <div class="cod-stats"></div>
      <div class="cod-fund"></div>
      <p class="cod-foot"></p>
    </div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click',e=>{ if(e.target===dlg) close(); });
    dlg.addEventListener('close',teardown);
    dlg.querySelector('.cod-close').addEventListener('click',close);
  }

  const widget=(host,src,cfg,h)=>{
    /* TradingView iframes can take ten seconds or more; say so rather than
       leaving an empty box. The iframe paints over this once it arrives. */
    host.innerHTML='<p class="cod-loading">Loading market data\u2026</p>';
    const wrap=document.createElement('div');
    wrap.className='tradingview-widget-container';
    const inner=document.createElement('div');
    inner.className='tradingview-widget-container__widget';
    if(h) inner.style.height=h;
    wrap.appendChild(inner);
    const sc=document.createElement('script');
    sc.type='text/javascript'; sc.async=true; sc.src=src;
    sc.text=JSON.stringify(cfg);
    wrap.appendChild(sc);
    host.appendChild(wrap);
  };

  function renderChart(){
    widget(dlg.querySelector('.cod-chart'),
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js',
      {symbols:[[current.name, current.sym+'|12M']], chartOnly:false,
       width:'100%', height:'100%', locale:'en', colorTheme:tvTheme(),
       autosize:true, showVolume:false, hideDateRanges:false, hideMarketStatus:false,
       hideSymbolLogo:false, scalePosition:'right', scaleMode:'Normal',
       chartType:'area', dateRanges:TV_RANGES, isTransparent:false});
  }

  function open(name){
    const sym=TVSYM[name]; if(!sym) return;
    if(!dlg) build();
    current={name,sym};
    const logo=logoFor(name,'cod-logo')||'';
    const [exch,tick]=sym.split(':');
    const ct=(typeof CT!=='undefined'&&CT[name])||null;
    dlg.querySelector('.cod-head').innerHTML=
      `<div class="cod-id">${logo}<div>
         <h4>${_esc(name)}</h4>
         <p class="cod-tick"><span class="cod-exch">${_esc(exch)}</span>${_esc(tick)}${ct&&ct[2]?` &middot; ${_esc(ct[2])}`:''}</p>
       </div></div>
       ${CDESC[name]?`<p class="cod-desc">${_esc(CDESC[name])}</p>`:''}
       <div class="cod-quote"></div>`;
    widget(dlg.querySelector('.cod-quote'),
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js',
      {symbol:sym, width:'100%', locale:'en', colorTheme:tvTheme(), isTransparent:false}, '300px');
    renderChart();
    widget(dlg.querySelector('.cod-fund'),
      'https://s3.tradingview.com/external-embedding/embed-widget-financials.js',
      {symbol:sym, colorTheme:tvTheme(), displayMode:'compact', isTransparent:false,
       largeChartUrl:'', locale:'en', width:'100%', height:'300'},'300px');
    const fb=fundamentalsBlock(name);
    dlg.querySelector('.cod-stats').innerHTML=fb;
    dlg.querySelector('.cod-stats').hidden=!fb;
    dlg.querySelector('.cod-foot').innerHTML=
      `Quote, chart and financials by <a href="https://www.tradingview.com/symbols/${_esc(sym.replace(':','-'))}/" target="_blank" rel="noopener noreferrer">TradingView</a>`+
      `${ct&&ct[1]?` &middot; <a href="${SA}${ct[1]}/" target="_blank" rel="noopener noreferrer">full profile on Stock Analysis</a>`:''}`+
      `${(FUNDA&&FUNDA[name]&&FUNDA[name].site)?` &middot; <a href="${FUNDA[name].site}" target="_blank" rel="noopener noreferrer">investor site</a>`:''}`+
      `<br>Market data is delayed and shown for reference. Nothing here is a recommendation.`;
    dlg.setAttribute('aria-label', name+' — market information');
    dlg.showModal();
  }

  function close(){ if(dlg&&dlg.open){ dlg.close(); } teardown(); }
  function teardown(){
    /* only ever empties a closed dialog: tearing down a visible one leaves
       three blank boxes with no way back */
    if(!dlg||dlg.open) return;
    ['.cod-quote','.cod-chart','.cod-fund'].forEach(s=>{
      const el=dlg.querySelector(s); if(el) el.innerHTML='';
    });
  }

  /* Any logo anywhere opens it — chain chips, company tables, chain rows. */
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-co]');
    if(!trigger) return;
    e.preventDefault();
    open(trigger.dataset.co);
  });

  /* Repaint the widgets when the theme changes underneath an open dialog. */
  const obs=new MutationObserver(()=>{ if(dlg&&dlg.open&&current) open(current.name); });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();

/* Escape closes whichever dialog is open. Native <dialog> does this itself only
   when it holds focus, which is not reliable in every embedding. */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape') return;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
});

/* ══════════════════════════════════════════════════════════════════════════
   FUNDAMENTALS
   The figures TradingView's free widgets do not carry — beta, volume, average
   volume, the 52-week range, and the statement lines. Read from a static file
   refreshed by .github/workflows/fundamentals.yml, which holds the API key in
   Actions secrets; nothing here ever sees it. Absent data renders nothing
   rather than a dash, so a company with no entry simply shows the widgets.
   ══════════════════════════════════════════════════════════════════════════ */
/* declared at the top of this file — see the note there */
fetch('assets/market/fundamentals.json')
  .then(r=>r.ok?r.json():null)
  .then(d=>{ if(!d) return; FUNDA=d.companies||{}; FUNDA_META=d; refreshCaps(); })
  .catch(()=>{});

const _fmtBig=v=>{
  if(v==null) return null;
  const a=Math.abs(v);
  if(a>=1e12) return (v/1e12).toFixed(2)+'T';
  if(a>=1e9)  return (v/1e9).toFixed(2)+'bn';
  if(a>=1e6)  return (v/1e6).toFixed(1)+'m';
  if(a>=1e3)  return (v/1e3).toFixed(1)+'k';
  return String(Math.round(v*100)/100);
};
const _fmtNum=(v,d=2)=>v==null?null:Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const _fmtPct=v=>v==null?null:(v*100).toFixed(1)+'%';

function fundamentalsBlock(name){
  const f=FUNDA&&FUNDA[name];
  /* Coverage is partial, and saying so beats showing a gap. The stored set is
     US-listed only, because that is what the data plan returns. */
  if(!f) return '<p class="cod-nodata"><b>No stored fundamentals for this company.</b> '+
    'The figures collected below the chart cover US-listed companies only; '+
    'for everything else the quote and chart above are served live.</p>';
  const cur=f.currency||'';
  const rows=[
    ['Market cap', _fmtBig(f.marketCap)],
    ['P/E ratio', _fmtNum(f.pe)],
    ['EPS', _fmtNum(f.eps)],
    ['Beta', _fmtNum(f.beta)],
    ['Volume', _fmtBig(f.volume)],
    ['Avg. volume', _fmtBig(f.avgVolume)],
    ['52-wk high', _fmtNum(f.yearHigh)],
    ['52-wk low', _fmtNum(f.yearLow)],
  ].filter(r=>r[1]!=null);
  const fin=[
    ['Revenue', _fmtBig(f.revenue)],
    ['Net income', _fmtBig(f.netIncome)],
    ['Free cash flow', _fmtBig(f.freeCashFlow)],
    ['Gross margin', _fmtPct(f.grossMargin)],
  ].filter(r=>r[1]!=null);
  if(!rows.length&&!fin.length) return '';
  const grid=r=>`<div class="cod-grid">${r.map(([k,v])=>
    `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
  const stamp=f.quoteAt?new Date(f.quoteAt).toLocaleString(undefined,
    {dateStyle:'medium',timeStyle:'short'}):null;
  return (rows.length?`<h5 class="cod-h">Key statistics${cur?` <span>${cur}</span>`:''}</h5>${grid(rows)}`:'')+
    (fin.length?`<h5 class="cod-h">Latest annual results${f.fiscalYear?` <span>FY${f.fiscalYear}`+
      `${f.reportCurrency&&f.reportCurrency!==cur?' · '+f.reportCurrency:''}</span>`:''}</h5>${grid(fin)}`:'')+
    (stamp?`<p class="cod-stamp">Fundamentals as of ${stamp}`+
      `${FUNDA_META&&FUNDA_META.placeholder?' · sample data until the first scheduled refresh':''}</p>`:'');
}


/* Renders the Deployment and Markets page. Every builder no-ops when its
   mount point is absent, so this file stays inert on the other pages. */
(function(){
  const M=(id,html)=>{const el=document.getElementById(id); if(el) el.innerHTML=html;};
  if(!document.getElementById('dep-pipeline')) return;
  const e=_esc;

  M('dep-pipeline', DEPLOY.pipeline.map((s,i)=>
    `<li class="dep-step"><span class="ds-num">${i+1}</span>`+
    `<div class="ds-body"><h5>${e(s.t)}</h5><p>${e(s.w)}</p></div></li>`).join(''));

  /* tbl() returns thead+tbody only, so it needs the table wrapper around it. */
  const table=o=>`<div class="tw"><table class="dat">${tbl(o)}</table></div>`;
  M('dep-stake', table(DEPLOY.stakeholders));

  M('dep-markets', DEPLOY.markets.map(m=>
    `<div class="dep-mk"><h5>${e(m.t)}</h5><p>${e(m.w)}</p>`+
    `<span class="dep-tag">${e(m.m)}</span></div>`).join(''));

  M('dep-models', table(DEPLOY.models));
  M('dep-unit',   table(DEPLOY.unit));

  M('dep-embodied', DEPLOY.embodied.map(([t,w])=>
    `<li><b>${e(t)}</b><span>${e(w)}</span></li>`).join(''));

  M('dep-capture', DEPLOY.capture.map(c=>{
    const L=LAYERS.find(x=>x.n===c.n);
    return `<li class="dep-cap" style="--stage:var(--l${c.n})">`+
      `<span class="dc-n">${c.n}</span>`+
      `<div class="dc-body"><h5>${e(L?L.t:'Layer '+c.n)}</h5><p>${e(c.w)}</p></div>`+
      `<span class="dc-v">${e(c.v)}</span></li>`;}).join(''));

  M('dep-avoid', DEPLOY.avoid.map(a=>`<li>${e(a)}</li>`).join(''));

  M('dep-implications', DEPLOY.implications.map(([t,w])=>
    `<div class="block"><h4>${e(t)}</h4><p>${w}</p></div>`).join(''));
})();


/* Environmental impact page. */
(function(){
  const host=document.getElementById('env-layers'); if(!host) return;
  const e=_esc;
  const M=(id,html)=>{const el=document.getElementById(id); if(el) el.innerHTML=html;};
  const badge=s=>`<span class="env-st is-${s}">${s==='measured'?'Measured':s==='partial'?'Partly measured':'Poorly measured'}</span>`;

  M('env-boundaries', ENVIRO.boundaries.map(([t,w])=>
    `<article class="env-bd"><h5>${e(t)}</h5><p>${e(w)}</p></article>`).join(''));

  M('env-facility', ENVIRO.facility.items.map(x=>
    `<article class="env-fc"><div class="env-fc-h"><h5>${e(x.t)}</h5>${badge(x.s)}</div>`+
    `<p>${e(x.w)}</p><p class="env-metric"><b>Measured as</b> ${e(x.m)}</p></article>`).join(''));

  host.innerHTML=Object.keys(ENVIRO.layers).map(n=>{
    const d=ENVIRO.layers[n];
    const L=(typeof LAYERS!=='undefined')&&LAYERS.find(x=>x.n===+n);
    const list=(t,a)=>`<div class="env-col"><p class="env-ch">${t}</p><ul>${a.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`;
    return `<details class="env-layer" style="--stage:var(--l${n})">
      <summary>
        ${typeof layerIcon==='function'?layerIcon(+n,'src-icon'):''}
        <span class="env-n">${n}</span>
        <b>${e(L?L.t:'Layer '+n)}</b>
        <span class="env-sum">${e(d.h)}</span>
        ${badge(d.s)}
      </summary>
      <div class="env-body">
        <p class="env-lede">${e(d.w)}</p>
        <div class="env-cols">${list('What drives it',d.drivers)}${list('What reduces it',d.reduce)}</div>
        <p class="env-bad"><b>Measured badly.</b> ${e(d.bad)}</p>
      </div>
    </details>`;}).join('');

  M('env-open', ENVIRO.open.map(([t,w])=>
    `<li><b>${e(t)}</b><span>${e(w)}</span></li>`).join(''));
})();
