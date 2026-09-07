# Layer 1 — Energy, Power and Utilities

## Role in the physical architecture

Layer 1 supplies usable, reliable electrical and thermal capacity. Part of the layer is outside the data centre—fuel supply, generation, transmission and distribution—and part is physically inside Layer 5 as the on-site electrical and cooling plant. A smaller version also exists inside Layer 10 as batteries, charging, power conversion and thermal management.

## 1. Current chain

Fuel and critical metal → Generation → Transmission and interconnect → On-site electrical plant → Thermal and the rack

## 2. Main problems and missing components

### Category mixing

“Fuel and critical metal” combines energy commodities, equipment materials and manufactured components. Gas and uranium feed generation; copper and electrical steel feed equipment manufacturers; transformers and turbines are manufactured products.

### The chain is not entirely linear

Electrical equipment and cooling equipment are parallel supply chains. Thermal management does not buy its output from the electrical plant, although both serve the same computing load.

### Missing components

- Resource extraction, fuel processing and uranium enrichment where relevant
- Renewable generation equipment and supply chains
- Grid-scale and behind-the-meter storage
- Wholesale markets, utility tariffs and power-purchase agreements
- Distribution networks, not only transmission
- Grid-connection studies, queue position and energisation
- Transformers, switchgear, protection, cables and busways
- UPS systems, batteries, generators and microgrids
- Power conversion from grid voltage to rack and chip voltage
- Cooling towers, chillers, dry coolers, pumps and coolant distribution units
- Direct-to-chip and immersion cooling
- Water sourcing, treatment and discharge
- Controls, commissioning, maintenance and heat reuse

### Statements to change

- Do not imply that new generation alone solves power availability. Transmission, substations, transformers, permits and connection queues can bind first.
- Do not call every metal used in power equipment “critical.” Specify the material, product and geography.
- Do not combine rack manufacture with heat rejection. The rack is part of Layer 4; the cooling system serves it.

## 3. Recommended structure and corrections

### Energy-resource and grid chain

Resource/fuel supply or renewable resource → Generation → Storage/firming → Electricity market or PPA → Transmission → Distribution → Grid interconnection

### Electrical-equipment chain

Processed materials → Transformers, switchgear, cables and power equipment → Utility substation → On-site medium-voltage distribution → UPS/backup → Rack power → Board/chip power conversion

### Thermal chain

Cooling equipment and fluids → Heat capture at chip/server → Coolant distribution → Facility loop → Heat rejection or reuse

### Embodied-energy chain

Energy source or charger → Battery/fuel system → Power electronics → Motors, compute and sensors → Thermal management

## Connections to other layers

- **Layer 2:** supplies copper, aluminium, electrical steel, battery materials, fuels and equipment materials.
- **Layer 3:** fabs require large amounts of reliable power, water and process cooling.
- **Layer 4:** compute converts electrical energy into computation and heat.
- **Layer 5:** contains the on-site power and cooling plant.
- **Layer 6:** telecom networks require continuous power.
- **Layer 10:** robots and vehicles require batteries, charging or another mobile energy system.

## Website wording

> Layer 1 converts primary energy and grid capacity into reliable electricity and heat-removal capacity for semiconductor production, data centres, networks and autonomous machines.

## Required verification

For claims about electricity demand, PUE, water use, transformer lead times or generation mix, specify geography, facility type, date, system boundary and primary source.

