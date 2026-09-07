# AI Infrastructure Website — Master Layer-by-Layer Audit

## Purpose

Use this document as the authoritative correction brief for the website. The website should explain the **physical architecture required to create, operate and deploy powerful AI, agents and embodied AI**, while still allowing each numbered layer to have its own investable value chain.

The final taxonomy contains **10 technical layers**:

1. Energy, power and utilities
2. Raw and processed materials
3. Semiconductor production ecosystem
4. Compute, memory and networking systems
5. Data centres, cloud and edge infrastructure
6. Connectivity and communications
7. Data and knowledge infrastructure
8. AI models and inference
9. Agentic software and applications
10. Embodied AI and autonomous systems

Deployment, integration and end markets should be a **separate commercial section**, not Layer 11 of the physical architecture.

## Mandatory conceptual correction

Do not present the ten layers as a single linear stack in which every stage buys from the stage immediately to its left. The architecture combines:

- Sequential production chains
- Parallel industrial inputs
- Physical containment
- Software running on hardware
- Cloud-to-edge distribution
- Closed feedback loops

Use arrows to show a specific relationship: physical supply, electricity, data, model/software updates or physical interaction. Do not use an arrow merely because two subjects are related.

## Essential physical containment

### Inside Layer 5: AI data centre and cloud

- The on-site portion of **Layer 1**: substation, switchgear, UPS, backup power, cooling and water systems
- Central **Layer 4**: servers, accelerator racks, CPUs, HBM, storage and network fabrics
- **Layer 7**: databases, object storage, data lakes, ingestion, curation and governance systems
- Cloud portion of **Layer 8**: model training, evaluation and cloud inference
- Cloud portion of **Layer 9**: agent runtimes, orchestration, tools, enterprise applications and observability

Layer 5 is the physical and operational enclosure. Layer 4 is the installed productive equipment. Layers 7–9 are software and information systems executed on Layer 4.

### Inside Layer 10: embodied or edge system

- Sensors and sensor interfaces
- Edge instance of **Layer 4**: SoC/accelerator, memory, local storage and real-time I/O
- Local instance of **Layer 8**: perception models, world models, policies and other inference workloads
- Local instance of **Layer 9**: agent logic, planning, safety supervision and control software
- Actuators, drives, transmissions and end effectors
- Battery or other energy source, power electronics and thermal management

The repeated layer numbers are intentional. A capability may exist in both the central data centre and the edge machine.

### Layer 6 as the bridge

Connectivity spans the data centre, external networks and embodied systems. It carries:

- Sensor, telemetry and experience data from the edge to Layer 7
- Model weights, policies and software updates from the data centre to the edge
- Commands, fleet coordination and human-supervision traffic

The embodied system must remain safe when connectivity is degraded. Safety-critical control should not assume uninterrupted cloud access.

## Closed physical-intelligence loop

The central story of the website should be:

1. The physical world produces observable state.
2. Sensors convert physical phenomena into data.
3. Edge compute processes time-critical information.
4. Local models interpret the environment and propose actions.
5. Agent and control software applies constraints and sends commands.
6. Actuators change the physical world.
7. Selected sensor and experience data is transmitted and stored.
8. Data is curated and used for evaluation or training.
9. Validated model and software updates return to the machine.
10. The loop repeats.

## Global errors to correct

| Problematic idea | Required correction |
|---|---|
| “Each stage buys from the stage on its left.” | Say that the map shows principal dependencies; many inputs are parallel or cross-cutting. |
| “Extraction has no chokepoint.” | Chokepoints can exist in mining, refining, processing technology, transport, qualification or trade. |
| “Packaging, not lithography, rations accelerators.” | Packaging and HBM can be binding alongside wafer capacity, yield, substrates, networking, power and cooling. |
| “Every actuator needs rare-earth magnets.” | Many compact electric actuators use permanent magnets, but induction, reluctance, hydraulic, pneumatic and other systems do not. |
| “Actuation is half of every robot BOM.” | BOM share is architecture- and volume-specific. Require a defined robot and source. |
| “Distribution is the only durable model moat.” | Distribution is one potential moat alongside performance, cost, data, feedback, ecosystem, trust, integration and switching costs. |
| Operator → tenant is a production chain. | Treat operator, owner and tenant as commercial roles or business models. |
| Security and observability occur after applications. | Treat them as cross-cutting control planes throughout Layers 7–10. |
| API model expenditure can never create an asset. | Usage is usually OPEX, but owned infrastructure and qualifying software development may be capitalised under applicable rules. |
| Embodied AI is the final form of all AI. | Digital applications and embodied systems are parallel destinations for model capability. |

## Chokepoint discipline

Every claim that something is a chokepoint must specify:

- Product or process affected
- Geography
- Measurement date
- Time horizon
- Structural or cyclical character
- Available substitutes
- Expansion lead time
- Evidence source

Avoid static amber highlights without these qualifications.

## Website implementation rules for Claude

- Preserve the ten layer names and numbering.
- Use containment in the physical-architecture view.
- Use separate linear diagrams inside each layer for its commercial value chain.
- Allow Layer 4, Layer 8 and Layer 9 to appear in both cloud and edge contexts.
- Separate physical flows from data flows visually.
- Show feedback loops explicitly.
- Separate facts, estimates, opinions and forward-looking hypotheses.
- Add a source and “last verified” date to quantitative or time-sensitive claims.
- Never use “always,” “every,” “only” or “no chokepoint” unless the statement is genuinely universal.
- Do not confuse technical necessity with pricing power or investment attractiveness.

## Evidence hierarchy for future revisions

Claude should verify technical and quantitative claims using primary or authoritative sources wherever possible:

1. Government and intergovernmental technical bodies: IEA, USGS, US Department of Energy, NIST, national grid authorities and regulators
2. Standards and engineering bodies: IEEE, ISO, IEC, JEDEC, PCI-SIG, CXL Consortium and Open Compute Project
3. Industry organisations with disclosed methodology: Semiconductor Industry Association, SEMI and International Federation of Robotics
4. Company primary materials: technical documentation, architecture guides, regulatory filings, earnings materials and product specifications
5. Peer-reviewed research for physical, algorithmic or system-performance claims

Use secondary commentary only to identify a question or competing interpretation. Do not use it as the sole evidence for market share, performance, capacity, lead time, cost or regulatory claims.

For time-sensitive claims, store these metadata fields with the website content:

- `as_of_date`
- `geography`
- `system_boundary`
- `source_name`
- `source_url`
- `fact_or_estimate`
- `confidence`

## Suggested visual language

- Amber: energy and utilities
- Orange: materials and manufactured physical inputs
- Rose: semiconductor ecosystem
- Purple: compute hardware
- Blue: data-centre enclosure
- Cyan: connectivity and operational data
- Teal: data and models
- Grey: software and agent control
- Green: embodied systems and physical interaction

## Definition of success

The corrected website should let a reader answer three different questions without confusing them:

1. **What must physically exist?**
2. **Where does each capability run?**
3. **Where in each value chain can an investor capture value?**
