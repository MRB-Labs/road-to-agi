/* ══════════════════════════════════════════════════════════════════════════
   THE TAXONOMY
   The ten layers: their numbers, names and colours, in one place.

   This exists because the last renumbering was painful. Moving from eight
   layers to ten meant rewriting keys in nine separate tables, every LC(n) and
   C[n] reference, the palette, and a sweep of prose where "layer 8" had meant
   embodiment and now meant models. Anything that needs to know what a layer is
   called or what colour it is should read it from here.

   Colours are the CSS custom properties in style.css, which is where the
   actual values live — light and dark. This file names them; it does not
   duplicate them.
   ══════════════════════════════════════════════════════════════════════════ */
const TAXONOMY = [
  {n:1,  key:'energy',       name:'Energy, power and utilities'},
  {n:2,  key:'materials',    name:'Raw and processed materials'},
  {n:3,  key:'semis',        name:'Semiconductor production ecosystem'},
  {n:4,  key:'compute',      name:'Compute, memory and networking'},
  {n:5,  key:'datacentres',  name:'Data centres, cloud and edge'},
  {n:6,  key:'data',         name:'Data and knowledge infrastructure'},
  {n:7,  key:'models',       name:'AI models and inference'},
  {n:8,  key:'agents',       name:'Agentic software and applications'},
  {n:9,  key:'connectivity', name:'Connectivity and communications'},
  {n:10, key:'embodied',     name:'Embodied AI and autonomous systems'},
];

/* The physical world is not a layer. It is the ground the stack stands on,
   and it is numbered 0 only so the map and the rail can address it. */
const WORLD_LAYER = {n:0, key:'world', name:'The physical world'};

const LAYER_COUNT = TAXONOMY.length;
const LAYER_NUMBERS = TAXONOMY.map(l => l.n);
const layerName = n => (TAXONOMY.find(l => l.n === n) || WORLD_LAYER).name;
const layerColour = n => `var(--l${n})`;
const layerSoft = n => `var(--l${n}s)`;

/* Colour lookups used throughout the report. C is keyed by layer number, LC is
   the same thing as a call — both resolve to the CSS custom properties above,
   so a palette change happens once, in style.css. */
const C = Object.fromEntries(LAYER_NUMBERS.map(n => [n, layerColour(n)]));
const LC = n => layerColour(n);
