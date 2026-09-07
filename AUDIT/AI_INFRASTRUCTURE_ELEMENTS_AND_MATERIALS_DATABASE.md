# AI Infrastructure — Elements and Materials Database

**Purpose:** authoritative content brief for adding a materials view to the ten-layer AI infrastructure website.

**Scope:** reviewed against the physical architecture defined in the companion audit. This is a comprehensive engineering map of commercially relevant and technically plausible material systems. It is **not a literal bill of materials for every possible product**. Exact compositions vary by architecture, supplier, process node, geography and generation.

## 1. Rules Claude must follow

### 1.1 Do not confuse elements with materials

- An **element** is a periodic-table species such as copper (`Cu`) or silicon (`Si`).
- A **material** is a usable substance or engineered system such as copper conductor, silicon wafer, NdFeB magnet, stainless steel, FR-4 laminate or lithium iron phosphate.
- A component normally contains several materials; a material may contain several elements.

### 1.2 Applicability codes

| Code | Meaning |
|---|---|
| **C — Core/widespread** | Common across most implementations of this layer, but not necessarily present in every individual product. |
| **T — Technology-dependent** | Required only for a particular architecture, energy source, chemistry or product type. |
| **P — Process/trace** | Used as a dopant, catalyst, process gas, coating, plating or small functional addition. It may not remain in the final product. |
| **L — Legacy/restricted** | Relevant to older products or restricted applications; do not imply it is preferred in new designs. |

### 1.3 Avoid double-counting

- Layer 5 physically contains central Layer 4 hardware and runs Layers 7–9.
- Layer 10 contains edge instances of Layers 4, 8 and 9.
- Layers 7–9 have no unique periodic-table composition as abstract data, models or software.
- Attribute physical materials to the host hardware/facility, then reference them from the logical layer.
- Separate **installed stock**, **annual material demand**, **replacement demand** and **process consumption**.

### 1.4 Required database fields

For each website material record, retain:

`layer`, `subsystem`, `material`, `elements`, `application`, `applicability`, `retained_or_process`, `substitutes`, `recycling_route`, `geography`, `as_of_date`, `source_url`, `confidence`.

---

# Layer 1 — Energy, Power and Utilities

Layer 1 includes external energy supply, grid infrastructure, on-site data-centre electrical/thermal plant, and mobile energy systems inside embodied AI.

| Subsystem | Materials and forms | Principal elements | Code | Function/notes |
|---|---|---|---|---|
| Natural-gas generation | Methane/natural gas; carbon and stainless steels; Ni superalloys; thermal-barrier ceramics | C, H, Fe, Cr, Ni, Co, Al, Ti, Mo, W, Ta, Re, Y, Zr, O | T/P | Fuel plus turbines, combustors and hot-section coatings. Alloy chemistry varies strongly. |
| Nuclear generation | Uranium oxide fuel; zirconium alloys; stainless steel; borated control/chemistry materials | U, O, Zr, Sn, Nb, Fe, Cr, Ni, B, H | T | Reactor-specific. Do not imply all nuclear designs use the same fuel or cladding. |
| Solar PV | Crystalline Si; glass; aluminium frames; copper wiring; silver metallisation; polymer encapsulants; thin-film CdTe or CIGS alternatives | Si, O, Al, Cu, Ag, C, H, F; T: Cd, Te, Cu, In, Ga, Se | T | Separate crystalline-silicon, CdTe and CIGS value chains. |
| Wind generation | Steel, concrete, copper, glass/carbon composites; NdFeB permanent magnets in some generator designs | Fe, C, Ca, Si, O, Al, Cu, B; T: Nd, Pr, Dy, Tb | T | Not every turbine uses rare-earth permanent magnets. |
| Hydropower | Concrete, structural/stainless steels, copper generators, protective coatings | Ca, Si, O, Fe, C, Cr, Ni, Cu, Zn, Al | T | Large civil-material intensity; long asset life. |
| Grid conductors | Copper; aluminium; aluminium-conductor steel-reinforced cable | Cu, Al, Fe, Zn | C | Transmission and distribution conductor systems. |
| Transformers | Grain-oriented electrical steel; amorphous metal in some designs; copper/aluminium windings; cellulose/mineral or ester insulation | Fe, Si, B, C, Cu, Al, H, O, N | C/T | Core material, winding material and insulation must be tracked separately. |
| Switchgear/protection | Copper/aluminium conductors; steel enclosures; ceramics/polymers; vacuum interrupters; SF6 or alternatives in some equipment | Cu, Al, Fe, Si, O, C, H; T/P: S, F, N | C/T | SF6 is application-specific and environmentally regulated; alternatives are expanding. |
| UPS and stationary batteries | Lead-acid; LFP; NMC; sodium-ion; copper/aluminium current collectors; graphite | Pb, S, O; or Li, Fe, P, Ni, Mn, Co, C, Al, Cu; T: Na | T | Chemistry determines the element set. Never list all battery elements as universally required. |
| Backup generation | Diesel/natural gas; steels; copper; aluminium; catalysts | C, H, Fe, Cr, Ni, Cu, Al, Pt, Pd, Rh | T/P | Catalyst elements are small-volume but functional. |
| Power electronics | Silicon, SiC and GaN devices; copper, aluminium, ceramic substrates and solders | Si, C, Ga, N, Cu, Al, Ag, Sn, O | C/T | Used in UPS, power supplies, drives and charging. |
| Cooling plant | Carbon/stainless steel, copper, aluminium, water/glycol, refrigerants, polymers | Fe, C, Cr, Ni, Cu, Al, H, O; T: F, Cl | C/T | Refrigerant composition varies; some legacy fluids are restricted. |
| Concrete and civil works | Portland cement, aggregate, reinforcing steel | Ca, Si, O, Al, Fe, C, Mg, S | C | Applies to generation, substations and data-centre infrastructure. |
| Mobile/robot energy | Li-ion or alternative cells; copper/aluminium; polymers; thermal-interface materials | Li, C, O, P, Fe, Ni, Mn, Co, Al, Cu, H; T: Na, Si | T | See Layer 10. Cell chemistry and duty cycle determine material demand. |

**Layer 1 element set:** `H, B, C, N, O, F, Na, Mg, Al, Si, P, S, Cl, Ca, Ti, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Se, Y, Zr, Nb, Mo, Rh, Pd, Ag, Cd, In, Sn, Te, Pr, Nd, Tb, Dy, Ta, W, Re, Pt, Pb, U`.

Do not treat this union as a claim that every power asset contains every listed element.

---

# Layer 2 — Raw and Processed Materials

Layer 2 is the upstream source of materials used by all hardware layers. Its “material list” should be organised by functional family, not as one homogeneous critical-minerals basket.

| Material family | Representative materials/products | Elements | Downstream layers |
|---|---|---|---|
| Bulk structural | Carbon steel, stainless steel, aluminium alloys, concrete, glass | Fe, C, Cr, Ni, Mn, Mo, Al, Mg, Si, Ca, O | 1, 3, 4, 5, 6, 10 |
| Electrical conductors | Refined copper, aluminium conductor, silver contacts | Cu, Al, Ag | 1, 3, 4, 5, 6, 10 |
| Electrical/magnetic steels | Grain-oriented electrical steel, non-oriented electrical steel, amorphous alloys | Fe, Si, B, C, P | 1, 10 |
| Semiconductor feedstocks | Semiconductor-grade silicon, SiC substrates, GaAs, GaN, InP, Ge | Si, C, Ga, As, N, In, P, Ge | 3, 4, 6, 10 |
| Semiconductor chemicals | Photoresists, acids, bases, solvents, fluorinated/chlorinated etchants | H, B, C, N, O, F, P, S, Cl, Br | 3 |
| High-purity gases | H2, N2, O2, Ar, He, Ne, Kr, Xe and reactive process gases | H, N, O, Ar, He, Ne, Kr, Xe; compounds containing F, Cl, B, P, As, Si, W | 3 |
| Refractory/barrier metals | Tungsten, molybdenum, tantalum, titanium, cobalt, ruthenium | W, Mo, Ta, Ti, Co, Ru | 3, 4 |
| Solder/plating/contact | Tin alloys, copper, nickel, gold, silver, palladium; bismuth alternatives | Sn, Cu, Ni, Au, Ag, Pd, Bi | 3, 4, 6, 10 |
| Permanent magnets | NdFeB, SmCo, ferrites | Nd, Pr, Dy, Tb, Fe, B; Sm, Co; or Fe, O, Sr/Ba | 1, 10 |
| Battery materials | LFP, NMC/NCA, graphite, silicon additives, electrolytes, sodium-ion materials | Li, Fe, P, Ni, Mn, Co, Al, C, Si, O, F; T: Na | 1, 5, 10 |
| Optical materials | Silica glass, Ge/P/B/F-doped fibre, InP/GaAs photonics, zirconia ferrules | Si, O, Ge, P, B, F, In, Ga, As, Zr, Y | 4, 6, 10 |
| Electronics ceramics | Alumina, aluminium nitride, barium titanate, ferrites, PZT, quartz | Al, O, N, Ba, Ti, Fe, Mn, Zn, Ni, Pb, Zr, Si | 3, 4, 6, 10 |
| Polymers/composites | Epoxy, FR-4, polyimide, polyethylene, PVC, fluoropolymers, carbon fibre | C, H, O, N, Cl, F, Si, B | 1, 3, 4, 5, 6, 10 |
| Thermal materials | Copper/aluminium heat spreaders, graphite, thermal greases, phase-change materials, refrigerants | Cu, Al, C, Si, H, O, F, N | 1, 4, 5, 10 |

**Layer 2 website rule:** distinguish reserve, mined concentrate, refined element, chemical precursor, engineered material and qualified component. These are different products with different suppliers and chokepoints.

---

# Layer 3 — Semiconductor Production Ecosystem

Layer 3 has the broadest process-element set. Mark whether an element remains in the chip/package or is used only during fabrication.

| Process/component | Materials | Elements | Code | Retained? |
|---|---|---|---|---|
| Logic/memory substrate | Monocrystalline silicon wafers; SOI variants | Si, O | C | Yes |
| Wide-bandgap substrates/devices | Silicon carbide; gallium nitride | Si, C, Ga, N | T | Yes |
| Compound photonic/RF devices | GaAs, InP, InGaAs, AlGaAs, SiGe | Ga, As, In, P, Al, Si, Ge | T | Yes |
| Gate dielectric | Silicon dioxide; hafnium oxide high-k dielectric | Si, O, Hf | C/P | Yes |
| Insulators/passivation | Silicon nitride, oxynitride and low-k dielectrics | Si, N, O, C, H | C | Yes |
| Dopants | Boron, phosphorus, arsenic, antimony | B, P, As, Sb | P | Trace retained |
| Interconnects | Copper, aluminium; emerging/specialised cobalt, ruthenium, molybdenum | Cu, Al, Co, Ru, Mo | C/T | Yes |
| Contacts/plugs/barriers | Tungsten, tantalum/tantalum nitride, titanium/titanium nitride, cobalt, nickel | W, Ta, N, Ti, Co, Ni | C/T | Yes |
| Lithography | Photoresists, antireflective coatings, masks/reticles; EUV mask multilayers | C, H, O, N, F, S, Si, Mo, Ru, Ta, B | C/P | Some process-only |
| Deposition/etch/clean gases | Hydrogen, nitrogen, oxygen, argon, helium, neon, krypton, xenon; fluorine/chlorine/bromine compounds | H, N, O, Ar, He, Ne, Kr, Xe, F, Cl, Br | C/T/P | Mainly process-only |
| Reactive precursors | Silanes, ammonia, phosphine, arsine, boron compounds, tungsten hexafluoride and metal-organic precursors | Si, H, N, P, As, B, W, F plus metal-specific elements | P | Partly retained |
| CMP and wet processing | Silica/alumina/ceria slurries, acids, bases, oxidisers and ultrapure water | Si, Al, Ce, O, H, F, Cl, S, N | C/P | Mainly process-only |
| Advanced packaging conductors | Copper pillars/bumps, solder, gold/copper bonding | Cu, Sn, Ag, Au, Ni, Bi | C/T | Yes |
| Package substrates/interposers | Organic laminates, silicon/glass interposers, ceramics | C, H, O, N, Si, B, Al | C/T | Yes |
| Ceramic packaging/heat spreaders | Alumina, aluminium nitride, silicon carbide, copper, diamond-like carbon | Al, O, N, Si, C, Cu | T | Yes |
| Plating/contacts | Nickel, gold, palladium, silver, tin | Ni, Au, Pd, Ag, Sn | P/T | Yes |

**Layer 3 element set:** `H, He, B, C, N, O, F, Ne, Al, Si, P, S, Cl, Ar, Ti, Co, Ni, Cu, Ga, Ge, As, Br, Kr, Mo, Ru, Pd, Ag, In, Sn, Sb, Xe, Ce, Hf, Ta, W, Au, Bi`.

Possible fab materials extend beyond this list in proprietary chemistries. Do not claim the list is a recipe for a specific process node.

---

# Layer 4 — Compute, Memory and Networking Systems

Layer 4 integrates semiconductor devices into boards, servers, storage, switches, optics and racks. It appears centrally inside Layer 5 and in smaller form inside Layer 10.

| Subsystem | Materials | Elements | Code |
|---|---|---|---|
| Packaged chips/HBM | Semiconductor and packaging materials inherited from Layer 3 | See Layer 3 | C |
| Printed circuit boards | Copper-clad FR-4, epoxy/glass fibre, polyimide, solder mask | Cu, C, H, O, Si, B, N | C |
| Solder and interconnect | SAC solder, copper, nickel/gold finishes; bismuth alloys in some applications | Sn, Ag, Cu, Ni, Au, Bi | C/T |
| Capacitors | Barium titanate MLCCs; tantalum capacitors; aluminium electrolytics | Ba, Ti, O, Ni; Ta; Al, B | C/T |
| Inductors/transformers | Copper windings; ferrites; electrical steel | Cu, Fe, O, Mn, Zn, Ni, Si | C |
| Connectors/contacts | Copper alloys with nickel, gold, tin or palladium finishes | Cu, Zn, Be, Ni, Au, Sn, Pd | C/P |
| Server/rack structures | Carbon/stainless steel, aluminium, zinc coatings, engineering polymers | Fe, C, Cr, Ni, Al, Zn, H, O, N | C |
| Heat spreaders/cold plates | Copper, aluminium, graphite, stainless steel, solders/TIMs | Cu, Al, C, Fe, Cr, Ni, Sn, Ag, Si, O, H | C/T |
| Fans/pumps | Steel, aluminium, copper windings, NdFeB or ferrite magnets, polymers | Fe, Al, Cu, Nd, Pr, B, Sr/Ba, O, C, H | C/T |
| Power supplies/VRMs | Silicon, SiC or GaN power devices; copper; ferrites; capacitors | Si, C, Ga, N, Cu, Fe, Mn, Zn, Ba, Ti, Al, Sn | C/T |
| HDD storage | Aluminium/glass disks; FeCo magnetic layers; Pt/Cr/Ru additions; NdFeB actuators | Al, Si, O, Fe, Co, Pt, Cr, Ru, Nd, Pr, B, Cu | T |
| SSD storage | NAND silicon, package/PCB materials | Si plus Layer 3 and PCB elements | C/T |
| Optical links | Silica fibre; InP/GaAs/Si/Ge photonics; copper; zirconia ferrules | Si, O, In, P, Ga, As, Ge, Cu, Zr, Y | C/T |
| Liquid-cooling loop | Copper/stainless/aluminium; water/glycol or dielectric fluid; elastomers | Cu, Fe, Cr, Ni, Al, H, O, C, F, Si | T |

**Layer 4 element set:** `H, Be, B, C, N, O, F, Mg, Al, Si, P, Ti, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Y, Zr, Mo, Ru, Pd, Ag, In, Sn, Ba, Nd, Pr, Ta, W, Pt, Au, Bi` plus inherited Layer 3 process elements.

---

# Layer 5 — Data Centres, Cloud and Edge Infrastructure

Layer 5 is the facility enclosure. Do not count the full material content of Layer 4 again when estimating Layer 5 facility materials; show it as installed IT equipment inside the boundary.

| Facility subsystem | Materials | Elements | Code |
|---|---|---|---|
| Foundations/building | Concrete, reinforcing steel, structural steel, glass, aluminium | Ca, Si, O, Al, Fe, C, Mg, Mn, Cr, Ni | C |
| Interior construction | Gypsum board, mineral wool, glass, timber/cellulose, polymers | Ca, S, O, H, Si, Al, C, N | C/T |
| Electrical distribution | Copper/aluminium busways and cables, electrical steel, insulation | Cu, Al, Fe, Si, C, H, O, Cl/F depending polymer | C |
| Transformers/switchgear | See Layer 1; steel, copper/aluminium, ceramics and insulation | Fe, Si, Cu, Al, C, H, O, N, B | C |
| UPS/batteries | Lead-acid, LFP, NMC or other chemistry | See Layer 1 battery entries | T |
| Cooling plant | Steel, stainless steel, copper, aluminium, water/glycol, refrigerants | Fe, Cr, Ni, Cu, Al, H, O, C, F, N | C/T |
| Piping/valves | Carbon/stainless steel, copper, polymers and elastomers | Fe, C, Cr, Ni, Cu, H, O, Cl, F, Si | C/T |
| Fire protection | Steel/copper piping; water; inert or chemical suppression agents | Fe, Cu, H, O, N, Ar, C, F | C/T |
| Fibre entrance/network rooms | Silica fibre, copper, steel/aluminium trays and electronics | Si, O, Ge, P, Cu, Fe, Al plus Layer 4 elements | C |
| IT equipment | Layer 4 servers, storage, networks and racks | See Layer 4 | C; nested |

**Layer 5 facility element set:** `H, B, C, N, O, F, Mg, Al, Si, P, S, Cl, Ar, Ca, Cr, Mn, Fe, Ni, Cu, Zn, Ge, Ag, Sn, Pb` plus technology-dependent battery/refrigerant elements and nested Layer 4.

Website categories should distinguish **facility shell**, **MEP/electrical plant**, **IT equipment**, **consumables** and **replacement cycles**.

---

# Layer 6 — Connectivity and Communications

Layer 6 includes network equipment and the physical transmission media connecting chips, racks, data centres, users and edge machines.

| Subsystem | Materials | Elements | Code |
|---|---|---|---|
| Optical fibre | High-purity silica with Ge/P/B/F dopants; polymer coatings | Si, O, Ge, P, B, F, C, H | C |
| Fibre amplifiers | Erbium-doped fibre; pump lasers | Er, Si, O, In, Ga, As, P | T/P |
| Lasers/modulators | InP, GaAs/AlGaAs, silicon photonics, lithium niobate in some systems | In, P, Ga, As, Al, Si; T: Li, Nb, O | T |
| Photodetectors | Germanium-on-silicon, InGaAs and related compounds | Ge, Si, In, Ga, As | T |
| Optical modules | Semiconductor devices, copper, ceramics, PCBs, polymers and solders | Layer 3/4 elements | C |
| Fibre connectors | Zirconia ceramic ferrules, polymers, stainless steel | Zr, Y, O, C, H, Fe, Cr, Ni | C |
| Copper links | Copper conductors, polymer insulation/shielding, tin/nickel plating | Cu, C, H, F, Cl, Sn, Ni, Al | C/T |
| Long-haul/subsea cable | Optical fibre, copper power conductor, steel armour, polyethylene | Si, O, Ge, Cu, Fe, C, H, Zn | T |
| Switch/router systems | Semiconductor, PCB, optics, power and chassis materials | See Layers 3 and 4 | C; nested |
| Wireless/RF | Copper/aluminium antennas; SiGe, GaAs or GaN RF devices; ceramics | Cu, Al, Si, Ge, Ga, As, N, Ba, Ti, O | T |
| Satellite links | Aluminium/titanium structures, composites, solar cells, RF electronics | Al, Ti, C, Si, Ga, As, Ge, Cu, Ag, In, P | T |

**Layer 6 element set:** `H, B, C, N, O, F, Li, Al, Si, P, Cl, Ti, Cr, Fe, Ni, Cu, Zn, Ga, Ge, As, Y, Zr, Nb, Pd, Ag, In, Sn, Ba, Er, Au` plus nested Layer 3/4 elements.

Do not imply that all communications use fibre or that all optical systems use the same laser/material platform.

---

# Layer 7 — Data and Knowledge Infrastructure

Layer 7 is primarily logical. Data has no unique elemental composition. The physical material footprint comes from the Layer 4 storage/compute systems and Layer 5 facilities on which data services run.

| Physical substrate | Materials | Elements | Code |
|---|---|---|---|
| SSD/object storage | NAND flash, controllers, packages, PCBs | See Layers 3 and 4 | C |
| HDD archives | Magnetic media, aluminium/glass disks, motors and electronics | Fe, Co, Pt, Cr, Ru, Al, Si, O, Nd, Pr, B plus Layer 4 | T |
| Magnetic tape archive | Polymer tape with magnetic coatings; cartridge plastics | C, H, O, Fe, Co, Cr, Ba depending medium | T |
| Networking/data movement | Layer 6 fibre/copper plus Layer 4 switching | See Layers 4 and 6 | C |
| Local robot buffer | Flash memory and edge electronics inside Layer 10 | See Layers 3, 4 and 10 | T |

**Intrinsic Layer 7 element set:** none.  
**Inherited physical set:** Layers 3–6, dominated by storage, compute, network and facility materials.

Claude must not create a misleading “data is made of silicon” statement. Data is information represented by physical states in storage and memory devices; the material belongs to those devices.

---

# Layer 8 — AI Models and Inference

AI model weights and algorithms are mathematical/informational artifacts. They have no intrinsic periodic-table composition.

| Deployment mode | Physical host | Material attribution |
|---|---|---|
| Central training | Layer 4 clusters inside Layer 5 | Attribute to Layers 1, 3, 4 and 5 |
| Cloud inference | Layer 4 servers inside Layer 5 | Attribute to Layers 1, 3, 4, 5 and 6 |
| Edge inference | Layer 4 compute inside Layer 10 | Attribute to Layers 1–4, 6 and 10 |
| Model storage/distribution | Layer 7 storage and Layer 6 networks | Attribute to Layers 4–7 |

**Intrinsic Layer 8 element set:** none.  
**Inherited physical set:** host hardware, facility, networking and energy materials.

For environmental or material-intensity analysis, use allocated compute time, energy, hardware utilisation, embodied hardware impact and replacement life. Do not assign the entire data centre to one model unless it is dedicated.

---

# Layer 9 — Agentic Software and Applications

Agent code, workflows and applications are informational artifacts and have no intrinsic elemental composition. Their physical footprint is the infrastructure used for execution, storage, communication and user interaction.

| Execution context | Physical host | Material attribution |
|---|---|---|
| Cloud agent runtime | Layer 4 inside Layer 5 | Layers 1, 3, 4, 5, 7 and 8 |
| Enterprise/on-premises agent | Server/workstation/network equipment | Layers 1, 3, 4, 6 and 7 |
| User interface | Phone, PC, display or other endpoint | Endpoint device materials; do not assign to Layer 9 twice |
| Embodied agent/control | Edge Layer 4 inside Layer 10 | Layers 1–4, 6, 8 and 10 |

**Intrinsic Layer 9 element set:** none.  
**Inherited physical set:** depends on execution location and endpoints.

The website may show “material dependency” rather than “materials contained” for this layer.

---

# Layer 10 — Embodied AI and Autonomous Systems

Layer 10 combines mechanical, electrical, electronic, optical and energy-storage systems. Exact content varies enormously among humanoids, industrial arms, drones, autonomous vehicles and smart devices.

| Subsystem | Materials | Elements | Code |
|---|---|---|---|
| Structural frame | Aluminium, carbon/stainless/alloy steel, titanium, magnesium, carbon-fibre composite | Al, Fe, C, Cr, Ni, Mo, Ti, Mg, Mn | C/T |
| Covers/seals | ABS, polycarbonate, nylon, polyurethane, silicone, fluoropolymers, elastomers | C, H, O, N, Si, F, Cl | C/T |
| Bearings/gears | Bearing/tool/alloy steels; bronze; surface coatings | Fe, C, Cr, Ni, Mo, V, W, Cu, Sn; P: Ti, N | C/T |
| Precision reducers | Hardened steels, aluminium housings, lubricants | Fe, C, Cr, Ni, Mo, Al; lubricant: C, H, O, S, P | T |
| Electric motors | Copper windings, electrical steel, NdFeB/SmCo/ferrite magnets | Cu, Fe, Si; T: Nd, Pr, Dy, Tb, B, Sm, Co, Sr/Ba, O | C/T |
| Alternative actuation | Hydraulic steel/aluminium systems and fluids; pneumatic systems; reluctance/induction motors | Fe, Al, Cu, C, H, O, Si | T |
| Motor drives | Si, SiC or GaN power devices; copper; capacitors and PCBs | Si, C, Ga, N, Cu, Sn, Ag, Al, Ba, Ti, O | C/T |
| Wiring/connectors | Copper/aluminium, polymers, nickel/gold/tin plated contacts | Cu, Al, C, H, F, Cl, Ni, Au, Sn | C |
| Edge compute | SoC/accelerator, memory, storage and PCB materials | See Layers 3 and 4 | C; nested |
| Cameras | Silicon CMOS, glass/polymer optics, filters and electronics | Si, O, C, H, Al, Cu plus Layer 3 elements | C |
| Lidar/time-of-flight | InP/GaAs lasers, Si/InGaAs detectors, optics and scanning hardware | In, P, Ga, As, Si, Ge, O, Al, Cu | T |
| Radar | SiGe, GaAs or GaN RF electronics; copper antennas and PCBs | Si, Ge, Ga, As, N, Cu, C, H, O | T |
| IMU/position sensors | Silicon MEMS, quartz, magnets, copper and packaging | Si, O, Al, Cu, Fe, Nd, Pr, B | C/T |
| Force/torque/tactile | Strain-gauge alloys; silicon sensors; piezoelectric ceramics such as PZT; polymers | Cu, Ni, Cr, Si; T: Pb, Zr, Ti, O, C, H | T |
| Battery | LFP, NMC/NCA, graphite, silicon additives, electrolyte, copper/aluminium | Li, Fe, P, Ni, Mn, Co, Al, C, Si, O, F, Cu | T |
| Thermal system | Aluminium/copper spreaders, heat pipes, water/glycol, TIMs | Al, Cu, H, O, C, Si, F | C/T |
| Brakes/friction | Steel, copper/iron compounds, ceramics and polymers | Fe, C, Cu, Si, O, Al, Ba, S | T |
| End effectors | Tool steel, aluminium, polymers, elastomers, sensors | Fe, C, Cr, Ni, Mo, Al, H, O, N, Si, Cu | T |
| Lubrication/coatings | Hydrocarbon/synthetic oils, greases, MoS2, DLC, TiN and corrosion coatings | C, H, O, S, Mo, Ti, N, Zn, P | C/T/P |

**Layer 10 element set:** `H, Li, B, C, N, O, F, Mg, Al, Si, P, S, Cl, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Sr, Zr, Mo, Pd, Ag, In, Sn, Ba, Pr, Nd, Sm, Tb, Dy, W, Au, Pb` plus nested Layer 3/4 elements.

### Required corrections

- Permanent magnets are important but not universal.
- Rare-earth content must be tied to motor architecture.
- Battery elements must be tied to cell chemistry.
- Lead in PZT must be marked technology-dependent and subject to regulatory/substitution analysis.
- Do not assign all robot sensor data to permanent storage; selection and compression occur.

---

# Commercial Section — Deployment, Integration and End Markets

Deployment is not a distinct physical layer and therefore has no intrinsic element set. It causes demand for:

- Installation cabling, connectors, cabinets and site modifications
- Edge devices, user terminals and control stations
- Safety barriers, fixtures, tooling and end effectors
- Replacement parts, batteries, lubricants and consumables
- Packaging, logistics and maintenance inventory

Materials must be attributed to the purchased Layer 1–10 equipment or to application-specific balance-of-system items. Do not create a fictitious “Layer 11 material” total.

---

# Master Periodic-Element Index

This is the union of the principal, technology-dependent and process elements identified above. It is a navigation index, not a universal AI bill of materials.

| Z | Element | Symbol | Principal AI-infrastructure roles |
|---:|---|---|---|
| 1 | Hydrogen | H | Fuels, water, polymers, process gases, coolants |
| 2 | Helium | He | Semiconductor process/cooling gas; leak testing |
| 3 | Lithium | Li | Batteries; lithium-niobate photonics |
| 4 | Beryllium | Be | Special copper connector alloys; niche ceramics |
| 5 | Boron | B | Silicon dopant, borosilicate glass, NdFeB magnets, fuels/control materials |
| 6 | Carbon | C | Steel, graphite, polymers, fuels, composites, SiC, diamond-like materials |
| 7 | Nitrogen | N | Process gas, GaN/AlN, polymers, cooling/suppression |
| 8 | Oxygen | O | Oxides, water, glass, concrete, ceramics and battery cathodes |
| 9 | Fluorine | F | Etchants, refrigerants, electrolytes and fluoropolymers |
| 10 | Neon | Ne | Semiconductor lithography/process gas |
| 11 | Sodium | Na | Sodium-ion batteries, glass and chemicals |
| 12 | Magnesium | Mg | Aluminium alloys, structures and refractories |
| 13 | Aluminium | Al | Conductors, structures, heat sinks, packaging and batteries |
| 14 | Silicon | Si | Logic/memory, glass/fibre, solar PV, power devices, silicones |
| 15 | Phosphorus | P | Dopant, InP photonics, LFP batteries, chemicals and lubricants |
| 16 | Sulfur | S | Batteries, chemicals, lubricants, gypsum and SF6 applications |
| 17 | Chlorine | Cl | Semiconductor chemicals, polymers and refrigerant-related compounds |
| 18 | Argon | Ar | Inert process gas and fire suppression |
| 20 | Calcium | Ca | Cement, concrete, glass and gypsum |
| 22 | Titanium | Ti | Structures, alloys, barriers, coatings and capacitors/ceramics |
| 23 | Vanadium | V | High-strength/tool steels and specialised batteries |
| 24 | Chromium | Cr | Stainless/alloy steel, coatings and magnetic media |
| 25 | Manganese | Mn | Steel, ferrites and battery cathodes |
| 26 | Iron | Fe | Steel, electrical steel, magnets, ferrites and magnetic storage |
| 27 | Cobalt | Co | Superalloys, batteries, magnets, contacts and magnetic media |
| 28 | Nickel | Ni | Stainless/superalloys, batteries, plating and electronic components |
| 29 | Copper | Cu | Conductors, windings, PCBs, interconnects, cooling and communications |
| 30 | Zinc | Zn | Galvanising, brass, ferrites and battery technologies |
| 31 | Gallium | Ga | GaN/GaAs power, RF, photonic and optoelectronic devices |
| 32 | Germanium | Ge | Silicon photonics, detectors, SiGe RF and fibre dopant |
| 33 | Arsenic | As | GaAs/InGaAs devices and silicon dopant/process chemistry |
| 34 | Selenium | Se | CIGS thin-film solar and specialised electronic materials |
| 35 | Bromine | Br | Semiconductor etchants and some flame-retardant chemistries |
| 36 | Krypton | Kr | Semiconductor process/lithography gas |
| 38 | Strontium | Sr | Ferrite magnets and specialised ceramics |
| 39 | Yttrium | Y | Ceramics, coatings and stabilised zirconia |
| 40 | Zirconium | Zr | Zirconia fibre ferrules, PZT, nuclear alloys and ceramics |
| 41 | Niobium | Nb | Superalloys, capacitors, superconducting/specialised systems |
| 42 | Molybdenum | Mo | Alloy steel, chip interconnect/masks, coatings and lubricants |
| 44 | Ruthenium | Ru | Semiconductor interconnects, magnetic storage and contacts |
| 45 | Rhodium | Rh | Emissions-control catalysts in backup/generation equipment |
| 46 | Palladium | Pd | Plating, electronic components and catalysts |
| 47 | Silver | Ag | Contacts, solder, solar metallisation and thermal materials |
| 48 | Cadmium | Cd | CdTe solar; legacy/restricted uses |
| 49 | Indium | In | InP/InGaAs photonics, solders and transparent conductors |
| 50 | Tin | Sn | Solder, plating, bronze and some nuclear alloys |
| 51 | Antimony | Sb | Semiconductor dopant, flame-retardant and alloy applications |
| 52 | Tellurium | Te | CdTe solar and specialised electronic materials |
| 54 | Xenon | Xe | Semiconductor process gas and specialised propulsion/lighting |
| 56 | Barium | Ba | MLCC dielectrics, ferrite magnets, ceramics and some magnetic tape media |
| 58 | Cerium | Ce | CMP slurry, glass polishing and catalysts |
| 59 | Praseodymium | Pr | High-performance permanent magnets |
| 60 | Neodymium | Nd | NdFeB permanent magnets |
| 62 | Samarium | Sm | SmCo high-temperature magnets |
| 65 | Terbium | Tb | Magnet coercivity and specialised phosphors |
| 66 | Dysprosium | Dy | High-temperature NdFeB magnet performance |
| 68 | Erbium | Er | Fibre amplifiers and optical communications |
| 72 | Hafnium | Hf | High-k semiconductor gate dielectric and superalloys |
| 73 | Tantalum | Ta | Semiconductor barriers, capacitors and superalloys |
| 74 | Tungsten | W | Chip contacts/interconnects, tools, alloys and hot-section materials |
| 75 | Rhenium | Re | High-temperature turbine superalloys |
| 78 | Platinum | Pt | Catalysts, storage media, sensors and specialised electronics |
| 79 | Gold | Au | Reliable contacts, bonding and plating |
| 82 | Lead | Pb | Lead-acid batteries, legacy solder and PZT ceramics; restricted in many uses |
| 83 | Bismuth | Bi | Lead-free solder/alloy alternatives and specialised electronics |
| 92 | Uranium | U | Nuclear fuel |

Elements not listed may appear in proprietary alloys, pigments, catalysts, cleaning chemistries, trace impurities or specialised products. Add them only with a defined material, application and reliable source.

---

# Claude Output Instructions

When adding the materials view to the website:

1. Give each layer an **Elements** view and a **Materials** view.
2. Show the material first, then reveal constituent element symbols.
3. Filter by `Core`, `Technology-dependent`, `Process/trace` and `Legacy/restricted`.
4. Mark whether the material is retained in the product or consumed during manufacturing.
5. Show nested dependencies instead of duplicating quantities for Layers 5, 7, 8, 9 and 10.
6. Allow a user to select an element and see every layer, material and component that uses it.
7. Do not label every listed element “critical.” Criticality is geography- and time-dependent.
8. Add supply concentration, recyclability and substitution only when supported by a dated source.
9. Avoid decorative element associations unsupported by an actual material application.
10. Include the disclaimer that product-specific BOMs and process recipes remain supplier-specific.

# Source Framework for Verification

Use primary and authoritative sources, prioritising:

- [USGS Mineral Commodity Summaries](https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries)
- [US Department of Energy Critical Materials Assessment](https://www.energy.gov/cmm/critical-materials-assessment)
- [NIST CHIPS semiconductor materials and manufacturing equipment strategy](https://www.nist.gov/chips/vision-success-facilities-semiconductor-materials-and-manufacturing-equipment)
- [Semiconductor Industry Association supply-chain submission](https://www.semiconductors.org/wp-content/uploads/2021/04/4.5.21-SIA-supply-chain-submission.pdf)
- [IEA data centres and data-transmission networks](https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks)
- Relevant IEC, IEEE, JEDEC, SEMI, PCI-SIG, CXL, Open Compute Project and ISO standards
- Manufacturer datasheets, material declarations, environmental reports and regulatory filings

For any material-share, intensity, market-size, price, supply-concentration or chokepoint claim, add an `as_of_date`, geography, system boundary and direct source.
