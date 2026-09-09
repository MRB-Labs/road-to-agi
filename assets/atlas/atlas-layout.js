/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — LAYOUT
   Where everything sits, and what connects to what. Geometry and topology
   only: not one word of prose lives here. Names, descriptions, metrics and
   companies all come from the project's own tables through atlas-data.js.

   The canvas is 1920 × 1000 user units on an 8-unit module, the same
   discipline the previous schematic used. Move a card by editing its y here;
   the routes re-derive from the node anchors, so nothing else needs touching.
   ══════════════════════════════════════════════════════════════════════════ */

/* One canvas unit is one CSS pixel at full size; the node layer is scaled by
   stage width / canvas width so the type shrinks with the drawing instead of
   staying 15px on a 60%-scale map. Below the breakpoint in atlas.css the whole
   thing reflows into stacked regions rather than shrinking further. */
const ATLAS_CANVAS = {w: 1760, h: 880};

/* The six macro-systems, left to right. `key` drives the colour, the CSS class
   and the lookup into ATLAS_REGIONS_TEXT, which holds their names. */
const ATLAS_REGIONS = [
  {key:'foundations',   x:56,   y:132, w:232, h:580},
  {key:'silicon',   x:304,  y:132, w:184, h:580},
  {key:'compute',   x:504,  y:132, w:232, h:580},
  {key:'intelligence',   x:752,  y:132, w:248, h:580},
  {key:'network',   x:1016, y:132, w:152, h:580},
  {key:'embodied',   x:1184, y:132, w:216, h:580},
];

/* The planet is not a region: it is the ground the stack stands on. Its label
   is in ATLAS_WORLD_TEXT. */
const ATLAS_WORLD = {cx:1600, cy:400, r:112};

/* One entry per card. `layer` is the site layer it belongs to and the panel it
   opens — several cards can share one, which is the point: layer 4 runs in the
   hall and at the edge, layer 1 is the grid and the battery. */
const ATLAS_NODES = [
  {id:'l1',    layer:1,  region:'foundations',  x:72,   y:240, w:200, h:124},
  {id:'l2',    layer:2,  region:'foundations',  x:72,   y:400, w:200, h:124},
  {id:'l3',    layer:3,  region:'silicon',      x:320,  y:308, w:152, h:148},
  {id:'l5',    layer:5,  region:'compute',      x:520,  y:224, w:200, h:124},
  {id:'l4',    layer:4,  region:'compute',      x:520,  y:384, w:200, h:128},
  {id:'l7',    layer:7,  region:'intelligence', x:768,  y:216, w:216, h:116},
  {id:'l8',    layer:8,  region:'intelligence', x:768,  y:364, w:216, h:116},
  {id:'l9',    layer:9,  region:'intelligence', x:768,  y:512, w:216, h:124},
  {id:'l6',    layer:6,  region:'network',      x:1032, y:328, w:120, h:150},
  /* the machine: a head card, then the blocks inside it */
  {id:'l10',   layer:10, region:'embodied',     x:1200, y:216, w:184, h:74, head:true},
  {id:'sens',  layer:10, region:'embodied',     x:1200, y:304, w:184, h:52, sub:1},
  {id:'l4e',   layer:4,  region:'embodied',     x:1200, y:362, w:184, h:52, sub:1},
  {id:'l8e',   layer:8,  region:'embodied',     x:1200, y:420, w:184, h:52, sub:1},
  {id:'l9e',   layer:9,  region:'embodied',     x:1200, y:478, w:184, h:52, sub:1},
  {id:'act',   layer:10, region:'embodied',     x:1200, y:536, w:184, h:52, sub:1},
  {id:'l1b',   layer:1,  region:'embodied',     x:1200, y:594, w:184, h:52, sub:1},
];

/* Flow families. `dash` carries the meaning a second time, so a route never
   depends on colour alone to say what it is. */
const ATLAS_FLOWS = {
  energy:       {label:'Energy',       dash:null},
  materials:    {label:'Materials',    dash:null},
  compute:      {label:'Compute',      dash:null},
  data:         {label:'Data',         dash:'7 6'},
  intelligence: {label:'Intelligence', dash:'16 6'},
  control:      {label:'Control',      dash:'2 6'},
};

/* Routes. `via` threads the run through guides in order: {x:…} turns it
   vertical at that column, {y:…} horizontal at that row. `core` marks the main
   sequence, which stays bright at rest while the rest are drawn quietly.

   Three corridors run below the stack at y 768 / 800 / 832 and return up the
   right at x 1424 / 1440 / 1456, clear of the planet. */
const ATLAS_ROUTES = [
  {from:'l1',  to:'l2',   flow:'energy',    side:['bottom','top'], dx:-34},
  {from:'l2',  to:'l1',   flow:'materials', side:['top','bottom'], dx:34},
  {from:'l1',  to:'l3',   flow:'energy',    side:['right','left'], via:[{x:296}], core:true},
  {from:'l2',  to:'l3',   flow:'materials', side:['right','left'], via:[{x:292}], core:true},

  {from:'l3',  to:'l4',   flow:'compute',   side:['right','left'], via:[{x:496}], core:true},
  {from:'l1',  to:'l5',   flow:'energy',    side:['right','left'], via:[{x:300}], core:true},
  {from:'l2',  to:'l5',   flow:'materials', side:['right','left'], via:[{x:284}]},
  {from:'l5',  to:'l4',   flow:'compute',   side:['bottom','top']},

  {from:'l4',  to:'l7',   flow:'compute',   side:['right','left'], via:[{x:744}]},
  {from:'l4',  to:'l8',   flow:'compute',   side:['right','left'], via:[{x:740}], core:true},
  {from:'l7',  to:'l8',   flow:'data',      side:['bottom','top'], core:true},
  {from:'l8',  to:'l9',   flow:'intelligence', side:['bottom','top'], core:true},

  {from:'l8',  to:'l6',   flow:'intelligence', side:['right','left'], via:[{x:1008}], core:true},
  {from:'l6',  to:'l7',   flow:'data',      side:['left','bottom'], via:[{x:1008},{y:672},{x:876}]},
  {from:'l9',  to:'l6',   flow:'control',   side:['right','left'], via:[{x:1004}]},

  {from:'l6',  to:'l8e',  flow:'intelligence', side:['right','left'], via:[{x:1176}], core:true},
  {from:'l6',  to:'l9e',  flow:'control',   side:['right','left'], via:[{x:1172}]},
  {from:'l9e', to:'l6',   flow:'data',      side:['left','right'], via:[{x:1180}]},

  /* the base also feeds the network and the machine, along the lower corridors */
  {from:'l1',  to:'l6',   flow:'energy',    side:['left','bottom'],
   via:[{x:32},{y:768},{x:1092}]},
  {from:'l1',  to:'l1b',  flow:'energy',    side:['left','right'],
   via:[{x:32},{y:768},{x:1424},{y:604}]},
  {from:'l2',  to:'act',  flow:'materials', side:['left','right'],
   via:[{x:16},{y:800},{x:1440},{y:546}]},
  {from:'l3',  to:'l4e',  flow:'compute',   side:['left','right'],
   via:[{x:0},{y:832},{x:1456},{y:372}]},

  /* the machine and the world */
  {from:'act',   to:'world', flow:'control', side:['right','left'], via:[{x:1416},{y:466}]},
  {from:'world', to:'sens',  flow:'data',    side:['left','right'], via:[{x:1432},{y:314}]},
];
