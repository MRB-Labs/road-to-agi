/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — LAYOUT
   Where everything sits, and what connects to what. Geometry and topology
   only: not one word of prose lives here. Names, descriptions, metrics and
   companies all come from the project's own tables through atlas-data.js.

   The canvas matches the background photograph's aspect exactly (1672x941),
   so the planet in the picture lands on the same spot at every size and the
   map can be built around it. Columns are 16 apart, cards inset 16 from their
   region, and the three supply corridors are 16 apart on both sides.
   ══════════════════════════════════════════════════════════════════════════ */

const ATLAS_CANVAS = {w: 1760, h: 990};

/* The six macro-systems, left to right. `key` drives the colour, the CSS class
   and the lookup into ATLAS_REGIONS_TEXT, which holds their names. */
const ATLAS_REGIONS = [
  {key:'foundations',   x:48,   y:120, w:224, h:656},
  {key:'silicon',       x:288,  y:120, w:176, h:656},
  {key:'compute',       x:480,  y:120, w:232, h:656},
  {key:'intelligence',  x:728,  y:120, w:216, h:656},
  {key:'network',       x:968,  y:120, w:192, h:656},
  {key:'embodied',      x:1184, y:120, w:236, h:656},
];

/* Not a region: the planet in the background photograph. These are its measured
   centre and radius in canvas units — 0.9040, 0.4437 and 0.0831 of the image.
   Nothing is drawn here; the picture supplies it. Its label and hit area are in
   ATLAS_WORLD_TEXT and the renderer. */
const ATLAS_WORLD = {cx:1591, cy:439, r:146};

/* One entry per card. `layer` is the site layer it opens — several cards share
   one, which is the point: layer 1 is the grid, the plant in the hall and the
   battery in the machine; layer 4 runs centrally and at the edge.
   `encl` marks a card that contains others, drawn as an enclosure. */
const ATLAS_NODES = [
  {id:'l1',    layer:1,  region:'foundations',  x:64,   y:208, w:192, h:132},
  {id:'l2',    layer:2,  region:'foundations',  x:64,   y:392, w:192, h:144},
  {id:'l3',    layer:3,  region:'silicon',      x:304,  y:470, w:144, h:156},

  /* The data centre is an enclosure too, like the machine: the plant and the
     racks are inside it, not beside it. The plant sits at the top, where the
     grid reaches it first. */
  {id:'l5',    layer:5,  region:'compute',      x:496,  y:196, w:200, h:480, encl:1},
  {id:'l1p',   layer:1,  region:'compute',      x:508,  y:284, w:176, h:160, sub:1},
  {id:'l4',    layer:4,  region:'compute',      x:508,  y:492, w:176, h:168, sub:1},

  {id:'l7',    layer:7,  region:'intelligence', x:744,  y:208, w:184, h:132},
  {id:'l8',    layer:8,  region:'intelligence', x:744,  y:384, w:184, h:136},
  {id:'l9',    layer:9,  region:'intelligence', x:744,  y:564, w:184, h:132},

  {id:'l6',    layer:6,  region:'network',      x:984,  y:328, w:160, h:184},

  /* the machine, and everything inside it */
  {id:'l10',   layer:10, region:'embodied',     x:1200, y:196, w:204, h:560, encl:1},
  {id:'sens',  layer:10, region:'embodied',     x:1212, y:284, w:180, h:64, sub:1},
  {id:'l4e',   layer:4,  region:'embodied',     x:1212, y:360, w:180, h:64, sub:1},
  {id:'l8e',   layer:8,  region:'embodied',     x:1212, y:436, w:180, h:64, sub:1},
  {id:'l9e',   layer:9,  region:'embodied',     x:1212, y:512, w:180, h:64, sub:1},
  {id:'act',   layer:10, region:'embodied',     x:1212, y:588, w:180, h:64, sub:1},
  {id:'l1b',   layer:1,  region:'embodied',     x:1212, y:664, w:180, h:64, sub:1},
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

   Corridors, all 16 apart and nested so nothing crosses: 0 / 16 / 32 down the
   left, lanes at y 828 / 860 / 892 beneath the stack, and 1436 / 1452 / 1468
   rising into the machine down its right-hand side, clear of the planet.

   `tx` offsets the arrival along the target's own edge, the way `dx` offsets
   the departure. `ends` names extra cards that light the route. */
const ATLAS_ROUTES = [
  /* Out of the physical world into the dashed group that turns nature into
     supply — dashed, because nothing is bought at this step; it is captured or
     extracted. They land on the group, not on a card, because that is what
     they feed. `ends` lights them from either layer inside it as well. */
  {from:'world', to:'#foundations', flow:'materials', side:['top','top'], dx:-16, tx:96,
   via:[{y:48}], ends:'l2', dash:'6 6', core:true},
  {from:'world', to:'#foundations', flow:'energy',    side:['top','top'], dx:-56, tx:-40,
   via:[{y:80}], ends:'l1', dash:'6 6', core:true},

  /* the base pair */
  {from:'l1',  to:'l2',   flow:'energy',    side:['bottom','top'], dx:-32},
  {from:'l2',  to:'l1',   flow:'materials', side:['top','bottom'], dx:32},
  {from:'l1',  to:'l3',   flow:'energy',    side:['right','left'], via:[{x:280}], core:true},
  {from:'l2',  to:'l3',   flow:'materials', side:['right','left'], via:[{x:272}], core:true},

  /* into the hall: the grid reaches the plant, the plant powers the racks,
     and the building itself is what the materials go into */
  {from:'l1',  to:'l1p',  flow:'energy',    side:['right','left'], via:[{x:288}], core:true},
  {from:'l2',  to:'l5',   flow:'materials', side:['right','left'], via:[{x:264}]},
  {from:'l1p', to:'l4',   flow:'energy',    side:['bottom','top'], core:true},
  {from:'l3',  to:'l4',   flow:'compute',   side:['right','left'], via:[{x:472}], core:true},

  /* the hall into the software */
  {from:'l4',  to:'l7',   flow:'compute',   side:['right','left'], via:[{x:720},{y:264}]},
  {from:'l4',  to:'l8',   flow:'compute',   side:['right','left'], via:[{x:712}], core:true},
  {from:'l7',  to:'l8',   flow:'data',      side:['bottom','top'], core:true},
  {from:'l8',  to:'l9',   flow:'intelligence', side:['bottom','top'], core:true},

  /* the software and the network */
  {from:'l8',  to:'l6',   flow:'intelligence', side:['right','left'], via:[{x:956}], core:true},
  {from:'l6',  to:'l7',   flow:'data',      side:['left','left'], via:[{x:964},{y:712},{x:736}]},
  {from:'l9',  to:'l6',   flow:'control',   side:['right','left'], via:[{x:952}]},

  /* the network and the machine */
  {from:'l6',  to:'l8e',  flow:'intelligence', side:['right','left'], via:[{x:1176}], core:true},
  {from:'l6',  to:'l9e',  flow:'control',   side:['right','left'], via:[{x:1168},{y:544}]},
  {from:'l9e', to:'l6',   flow:'data',      side:['left','right'], via:[{x:1192},{y:472}]},

  /* the base also feeds the network and the machine, along the lower lanes */
  {from:'l1',  to:'l6',   flow:'energy',    side:['left','bottom'],
   via:[{x:32},{y:828},{x:1064}]},
  /* There is no room to thread these between the planet and the machine, so
     they land on the machine itself and its containment says the rest. `ends`
     keeps the block each one feeds able to light its own supply. */
  {from:'l1',  to:'l10',  flow:'energy',    side:['left','bottom'], tx:-60,
   via:[{x:32},{y:828}], ends:'l1b'},
  {from:'l2',  to:'l10',  flow:'materials', side:['left','bottom'],
   via:[{x:16},{y:860}], ends:'act'},
  {from:'l3',  to:'l10',  flow:'compute',   side:['left','bottom'], tx:60,
   via:[{x:0},{y:892}], ends:'l4e'},

  /* the machine and the world, threaded up the gap beside the planet */
  {from:'act',   to:'world', flow:'control', side:['right','left'], dy:32,  via:[{x:1424}]},
  {from:'world', to:'sens',  flow:'data',    side:['left','right'], dx:-40, via:[{x:1432}]},
];
