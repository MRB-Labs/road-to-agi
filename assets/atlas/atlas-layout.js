/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — LAYOUT
   Where everything sits, and what connects to what. Geometry and topology
   only: not one word of prose lives here. Names, descriptions, metrics and
   companies all come from the project's own tables through atlas-data.js.

   The canvas matches the background photograph's aspect exactly, so the planet
   in the picture lands on the same spot at every size and the map is built
   around it. Columns are 16 apart unless a run of routes needs the room, and
   cards are inset 16 from their region.
   ══════════════════════════════════════════════════════════════════════════ */

const ATLAS_CANVAS = {w: 1760, h: 990};

/* The six macro-systems, left to right. `key` drives the colour, the CSS class
   and the lookup into ATLAS_REGIONS_TEXT, which holds their names.

   The gaps between them are not decoration — each one is a wiring corridor,
   and it is as wide as the number of route columns it has to carry:
     256..288   32   the two forks out of the base pair
     496..512   16   silicon into the hall
     744..760   16   the fork out of central compute
     952..992   40   two arrivals into the network, kept 16 apart
     1160..1188 28   three runs between the network and the machine */
const ATLAS_REGIONS = [
  {key:'foundations',   x:48,   y:112, w:208, h:680},
  {key:'silicon',       x:288,  y:112, w:208, h:680},
  {key:'compute',       x:512,  y:112, w:232, h:680},
  {key:'intelligence',  x:760,  y:112, w:192, h:680},
  {key:'network',       x:984,  y:112, w:176, h:680},
  {key:'embodied',      x:1188, y:112, w:232, h:680},
];

/* Not a region: the planet in the background photograph. These are its measured
   centre and radius in canvas units — 0.9040, 0.4437 and 0.0831 of the image.
   Nothing is drawn here; the picture supplies it. Its label and hit area are in
   ATLAS_WORLD_TEXT and the renderer. The label hangs *below* the planet, so the
   two dashed lines leaving the top of it never cross their own caption. */
const ATLAS_WORLD = {cx:1592, cy:440, r:124};

/* One entry per card. `layer` is the site layer it opens — several cards share
   one, which is the point: layer 1 is the grid, the plant in the hall and the
   battery in the machine; layer 4 runs centrally and at the edge.
   `encl` marks a card that contains others, drawn as an enclosure.
   `icon` overrides which mark is drawn, for a layer that appears twice in two
   different guises — the plant indoors is layer 1, but drawn as a bolt. */
const ATLAS_NODES = [
  {id:'l1',    layer:1,  region:'foundations',  x:64,   y:192, w:176, h:136},
  {id:'l2',    layer:2,  region:'foundations',  x:64,   y:368, w:176, h:144},

  /* Silicon carries one card, so it gets the width its own name needs. */
  {id:'l3',    layer:3,  region:'silicon',      x:304,  y:456, w:176, h:168, iy:-32, iz:120},

  /* The data centre is an enclosure too, like the machine: the plant and the
     racks are inside it, not beside it. The plant sits at the top, where the
     grid reaches it first. */
  {id:'l5',    layer:5,  region:'compute',      x:528,  y:192, w:200, h:544, encl:1, iy:-232},
  {id:'l1p',   layer:1,  region:'compute',      x:544,  y:328, w:176, h:160, sub:1, icon:'1p', ix:-8, iy:-56, iz:145},
  {id:'l4',    layer:4,  region:'compute',      x:544,  y:528, w:176, h:192, sub:1, ix:-8, iy:-64, iz:150},

  {id:'l7',    layer:6,  region:'intelligence', x:776,  y:192, w:160, h:152, ix:8, iy:-56},
  {id:'l8',    layer:7,  region:'intelligence', x:776,  y:384, w:160, h:144, ix:8, iy:-48},
  {id:'l9',    layer:8,  region:'intelligence', x:776,  y:572, w:160, h:160, iy:-56},

  /* Connectivity is the only path between the two enclosures, so it carries
     more routes than any other card. It is tall for that reason alone: seven
     runs spread over four sides need the height to stay 40 apart. */
  {id:'l6',    layer:9,  region:'network',      x:1000, y:272, w:144, h:296, iy:-88, iz:120},

  /* the machine, and everything inside it */
  {id:'l10',   layer:10, region:'embodied',     x:1204, y:196, w:200, h:584, encl:1, icon:'humanoid', iy:-264},
  {id:'sens',  layer:10, region:'embodied',     x:1216, y:272, w:176, h:80, sub:1},
  {id:'l4e',   layer:4,  region:'embodied',     x:1216, y:356, w:176, h:80, sub:1},
  {id:'l8e',   layer:7,  region:'embodied',     x:1216, y:440, w:176, h:80, sub:1},
  {id:'l9e',   layer:8,  region:'embodied',     x:1216, y:524, w:176, h:80, sub:1},
  {id:'act',   layer:10, region:'embodied',     x:1216, y:608, w:176, h:80, sub:1},
  {id:'l1b',   layer:1,  region:'embodied',     x:1216, y:692, w:176, h:72, sub:1, icon:'battery'},
];

/* Flow families. `dash` carries the meaning a second time, so a route never
   depends on colour alone to say what it is. */
/* `layer` is the layer the flow stands for — energy is layer 1's, control is
   layer 8's — and it is what the chip in the toolbar is drawn in, so the legend
   is in the same colours as the map. */
const ATLAS_FLOWS = {
  energy:       {label:'Energy',       dash:null,   layer:1},
  materials:    {label:'Materials',    dash:null,   layer:2},
  compute:      {label:'Compute',      dash:null,   layer:4},
  data:         {label:'Data',         dash:'7 6',  layer:6},
  intelligence: {label:'Intelligence', dash:'16 6', layer:7},
  control:      {label:'Control',      dash:'2 6',  layer:8},
};

/* Routes. `via` threads the run through guides in order: {x:…} turns it
   vertical at that column, {y:…} horizontal at that row. `core` marks the main
   sequence, which stays bright at rest while the rest are drawn quietly.

   `trunk` is a fork. Two runs that leave the same card on the same side for the
   same reason share one line out of it and split where they part company —
   drawn as one arrow that branches, never as two beside each other. Trunk-mates
   keep the same anchor (the fan leaves them alone) and take the same first
   guides, so the overlap is deliberate and the guard allows it.

   `tone` overrides the colour, which otherwise comes from the box the run
   leaves. Only the two runs out of the planet use it: they are the supply of
   layers 1 and 2 and have to be told apart, and the planet has one colour.

   `tx` offsets the arrival along the target's own edge, the way `dx` offsets
   the departure. Any offset written here overrides the automatic fan, which is
   what spreads everything else apart. `ends` names extra cards that light the
   route. */
const ATLAS_ROUTES = [
  /* Out of the physical world into the dashed group that turns nature into
     supply — dashed, because nothing is bought at this step; it is captured or
     extracted. They land on the group, not on a card, because that is what
     they feed. `ends` lights them from either layer inside it as well. */
  {from:'world', to:'#foundations', flow:'materials', side:['top','top'], dx:24, tx:36,
   via:[{y:48}], ends:'l2', dash:'6 6', tone:'l2', core:true},
  {from:'world', to:'#foundations', flow:'energy',    side:['top','top'], dx:-24, tx:-36,
   via:[{y:80}], ends:'l1', dash:'6 6', tone:'l1', core:true},

  /* the base pair */
  {from:'l1',  to:'l2',   flow:'energy',    side:['bottom','top'], dx:-32, tx:-32},
  {from:'l2',  to:'l1',   flow:'materials', side:['top','bottom'], dx:32,  tx:32},

  /* One line leaves the grid and forks: up into the hall's own plant, down
     into device manufacture. Likewise one line of materials, forking into the
     wafer ecosystem and into the building itself. */
  {from:'l1',  to:'l1p',  flow:'energy',    side:['right','left'], via:[{x:280}],
   trunk:'l1-east', core:true},
  {from:'l1',  to:'l3',   flow:'energy',    side:['right','left'], via:[{x:280}],
   trunk:'l1-east', core:true},
  {from:'l2',  to:'l5',   flow:'materials', side:['right','left'], via:[{x:264}], tx:-24,
   trunk:'l2-east'},
  {from:'l2',  to:'l3',   flow:'materials', side:['right','left'], via:[{x:264}],
   trunk:'l2-east', core:true},

  /* inside the hall */
  {from:'l1p', to:'l4',   flow:'energy',    side:['bottom','top'], core:true},
  {from:'l3',  to:'l4',   flow:'compute',   side:['right','left'], via:[{x:504}], core:true},

  /* and one line out of central compute, forking into the two things it runs */
  {from:'l4',  to:'l7',   flow:'compute',   side:['right','left'], via:[{x:752}], tx:-20,
   trunk:'l4-east'},
  {from:'l4',  to:'l8',   flow:'compute',   side:['right','left'], via:[{x:752}],
   trunk:'l4-east', core:true},

  /* the software column */
  {from:'l7',  to:'l8',   flow:'data',      side:['bottom','top'], core:true},
  {from:'l8',  to:'l9',   flow:'intelligence', side:['bottom','top'], core:true},

  /* Into the network on its left, out of it on its right, back in at the top
     and fed from below: four sides, so no side carries more than two. */
  {from:'l8',  to:'l6',   flow:'intelligence', side:['right','left'], via:[{x:960}], core:true},
  {from:'l9',  to:'l6',   flow:'control',   side:['right','left'], via:[{x:968}]},
  {from:'l6',  to:'l7',   flow:'data',      side:['left','right'], via:[{x:968}]},

  /* the network and the machine */
  {from:'l6',  to:'l8e',  flow:'intelligence', side:['right','left'], via:[{x:1184}], core:true},
  {from:'l6',  to:'l9e',  flow:'control',   side:['right','left'], via:[{x:1176}]},
  {from:'l9e', to:'l6',   flow:'data',      side:['left','right'], via:[{x:1168}]},

  /* The base feeds the network and the machine along the lanes under the map.
     Energy leaves the grid once and stays one line the whole way: down the
     outermost column, along the lane, splitting only where the branches
     actually part — under the network, where one turns up and the other
     carries on to the machine. A fork drawn early is two long parallel lines;
     drawn late it is one. There is no room to thread the
     other two between the planet and the machine, so they land on the machine
     itself and its containment says the rest; `ends` keeps the block each one
     feeds able to light its own supply. */
  {from:'l1',  to:'l6',   flow:'energy',    side:['left','bottom'],
   via:[{x:40},{y:844}], trunk:'l1-west'},
  {from:'l1',  to:'l10',  flow:'energy',    side:['left','bottom'], tx:-60,
   via:[{x:40},{y:844}], trunk:'l1-west', ends:'l1b'},
  {from:'l2',  to:'l10',  flow:'materials', side:['left','bottom'],
   via:[{x:24},{y:864}], ends:'act'},
  {from:'l3',  to:'l10',  flow:'compute',   side:['left','bottom'], tx:60,
   via:[{x:8},{y:888}],  ends:'l4e'},

  /* the machine and the world, threaded up the gap beside the planet */
  {from:'act',   to:'world', flow:'control', side:['right','left'], dy:32, via:[{x:1432}]},
  {from:'world', to:'sens',  flow:'data',    side:['left','right'], dx:-40, via:[{x:1432}]},
];
