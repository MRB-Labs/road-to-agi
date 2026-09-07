# Layer 5 — Data Centres, Cloud and Edge Infrastructure

## Role in the physical architecture

Layer 5 is a physical and operational enclosure. It contains the central instance of Layer 4, Layer 7, the cloud portion of Layer 8, the cloud portion of Layer 9 and the on-site portion of Layer 1. “Cloud” is not an immaterial place; cloud services run on equipment in physical facilities.

## 1. Current chain

Power and land → Design and construction → Critical equipment → Compute fit-out → Operator → Tenant

## 2. Main problems and missing components

### Roles are mixed with project stages

Operator and tenant are commercial roles, not construction stages. A hyperscaler may own and operate its facility; a tenant may lease colocation capacity; a neocloud may lease space and operate its own hardware.

### “Power and land” is insufficient

A site needs deliverable power, fibre routes, permits, water or an alternative cooling design, geotechnical suitability, access and community approval. Nominal grid capacity is not the same as an executed and energised connection.

### Missing lifecycle stages

- Market and site selection
- Site control and land acquisition
- Power, water and fibre feasibility
- Grid study, agreement and energisation
- Permitting and environmental review
- Financing and contractual structure
- Architecture and engineering
- Civil construction and powered shell
- Electrical and mechanical installation
- Network and IT fit-out
- Commissioning and load testing
- Operations, maintenance and security
- Hardware refresh and capacity expansion
- Repowering, retrofit and decommissioning

### Missing physical systems

- Substations and medium-voltage distribution
- UPS, batteries and backup generation
- Cooling plants and coolant distribution
- Fire detection/suppression
- Physical security
- Carrier rooms and diverse fibre entrances
- Storage and network systems
- Monitoring, controls and building-management systems

### Statements to change

- Do not state that compute is a fixed percentage of project cost without defining the denominator and project type.
- Do not treat every data centre as an AI data centre.
- Do not treat “cloud,” “colocation,” “hyperscale” and “neocloud” as synonyms.
- Do not assume data-centre capacity is usable for AI merely because it has floor area; power density, cooling, network and hardware matter.

## 3. Recommended structure and corrections

Site/market selection → Resource feasibility → Site control → Grid/fibre/water commitments → Permitting → Financing/design → Construction → Electrical/mechanical installation → IT/network fit-out → Commissioning → Operations → Refresh/expansion → Decommissioning

Show commercial structures separately:

- Hyperscale self-build
- Build-to-suit/wholesale
- Retail or wholesale colocation
- GPU/neocloud service
- Sovereign or public-private AI infrastructure
- Edge and telecom facilities

## Essential containment

Inside Layer 5, show:

1. On-site Layer 1 electrical and thermal plant
2. Central Layer 4 compute, storage and networking
3. Layer 7 data and knowledge systems
4. Layer 8 training and cloud inference
5. Layer 9 cloud agent runtimes and applications

Containment does not mean ownership. Different companies may own the land, building, electrical plant, hardware, software and workload.

## Connections to other layers

- **Layer 1:** supplies grid electricity and on-site power/cooling systems.
- **Layer 2:** supplies construction, electrical and thermal materials.
- **Layer 4:** becomes the productive IT equipment inside the facility.
- **Layer 6:** connects clusters, facilities, users and edge machines.
- **Layer 7:** uses storage and compute inside Layer 5.
- **Layer 8:** central training and inference run inside Layer 5.
- **Layer 9:** cloud agents and applications run inside Layer 5.

## Website wording

> Layer 5 is the powered, cooled, connected and operated physical environment in which central AI hardware, data systems, model workloads and cloud applications run.

## Required verification

Define capacity as site power, utility power, critical IT load, rack density or deployed accelerator capacity. These metrics are not interchangeable.

